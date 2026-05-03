"""
train_dl.py — DNN + CNN Training for IoT IDS
=============================================
Run AFTER preprocess.py.

Outputs in model/:
  dnn_model.keras / dnn_model.tflite
  scaler_dnn.pkl / features_dnn.pkl / metrics_dnn.pkl

  cnn_model.keras / cnn_model.tflite
  scaler_cnn.pkl / features_cnn.pkl / metrics_cnn.pkl

Usage:
    python train_dl.py

Install:
    pip install tensorflow scikit-learn joblib numpy
"""

import os
import warnings
warnings.filterwarnings("ignore")

import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix, classification_report
)

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, callbacks, regularizers

# ============================================================
# PATHS
# ============================================================
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, 'dataset')
MODEL_DIR   = os.path.join(BASE_DIR, 'model')
os.makedirs(MODEL_DIR, exist_ok=True)

CLEAN_PKL = os.path.join(DATASET_DIR, 'clean_dataset.pkl')

# ============================================================
# GPU SETUP
# ============================================================
print("TensorFlow:", tf.__version__)
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    tf.config.experimental.set_memory_growth(gpus[0], True)
    print(f"GPU: {gpus[0].name}")
else:
    print("CPU mode")


# ============================================================
# LOAD CLEAN DATA
# ============================================================
def load_clean():
    if not os.path.exists(CLEAN_PKL):
        raise FileNotFoundError(
            f"Clean dataset not found at {CLEAN_PKL}\n"
            "Please run preprocess.py first!"
        )
    data     = joblib.load(CLEAN_PKL)
    X        = data['X']
    y        = data['y']
    features = data['features']
    print(f"Loaded clean dataset: X={X.shape}, classes={len(set(y))}")
    return X, y, features


# ============================================================
# PREPROCESSING (scale only — imputation already done in preprocess.py)
# ============================================================
def preprocess(X, y, features):
    imputer = SimpleImputer(strategy='mean')   # safety net for any remaining NaN
    X = imputer.fit_transform(X)

    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    # 70% train | 15% val | 15% test
    X_tr, X_tmp, y_tr, y_tmp = train_test_split(X, y, test_size=0.30, random_state=42, stratify=y)
    X_val, X_te, y_val, y_te = train_test_split(X_tmp, y_tmp, test_size=0.50, random_state=42, stratify=y_tmp)

    print(f"Train={len(X_tr)} | Val={len(X_val)} | Test={len(X_te)}")

    class_weights_arr  = compute_class_weight('balanced', classes=np.unique(y_tr), y=y_tr)
    class_weight_dict  = dict(enumerate(class_weights_arr))

    return X_tr, X_val, X_te, y_tr, y_val, y_te, scaler, imputer, class_weight_dict


# ============================================================
# METRICS
# ============================================================
def compute_metrics(y_true, y_pred, model_name, epochs_run=None, best_val_acc=None):
    m = {
        "model":      model_name,
        "accuracy":   float(accuracy_score(y_true, y_pred)),
        "precision":  float(precision_score(y_true, y_pred, average="weighted", zero_division=0)),
        "recall":     float(recall_score(y_true, y_pred, average="weighted", zero_division=0)),
        "f1":         float(f1_score(y_true, y_pred, average="weighted", zero_division=0)),
        "confusion_matrix": confusion_matrix(y_true, y_pred).tolist(),
        "test_samples": int(len(y_true))
    }
    if epochs_run:    m["training_epochs"]  = epochs_run
    if best_val_acc:  m["val_accuracy_best"] = float(best_val_acc)

    print(f"  Accuracy  : {m['accuracy']*100:.2f}%")
    print(f"  Precision : {m['precision']*100:.2f}%")
    print(f"  Recall    : {m['recall']*100:.2f}%")
    print(f"  F1-Score  : {m['f1']*100:.2f}%")
    return m


# ============================================================
# CALLBACKS
# ============================================================
def get_callbacks(ckpt_name):
    return [
        callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True, verbose=1),
        callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-6, verbose=1),
        callbacks.ModelCheckpoint(
            filepath=os.path.join(MODEL_DIR, ckpt_name),
            monitor='val_accuracy', save_best_only=True, verbose=0
        )
    ]


# ============================================================
# TFLITE EXPORT
# ============================================================
def export_tflite(model, out_path, X_sample):
    print(f"  Converting to TFLite...")
    X_sample = X_sample.astype(np.float32)

    def rep_data():
        for i in range(min(100, len(X_sample))):
            yield [X_sample[i:i+1]]

    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    converter.representative_dataset = rep_data
    converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
    converter.inference_input_type  = tf.float32
    converter.inference_output_type = tf.float32

    try:
        tflite_model = converter.convert()
    except Exception as e:
        print(f"  INT8 failed ({e}), using float32...")
        converter2 = tf.lite.TFLiteConverter.from_keras_model(model)
        converter2.optimizations = [tf.lite.Optimize.DEFAULT]
        tflite_model = converter2.convert()

    with open(out_path, 'wb') as f:
        f.write(tflite_model)
    print(f"  TFLite saved → {out_path} ({os.path.getsize(out_path)/1024:.1f} KB)")


# ============================================================
# ── MODEL 1 : DNN ──────────────────────────────────────────
# Deep Neural Network
# Architecture: 4 FC layers with BN + Dropout
# ============================================================
def build_dnn(input_dim, num_classes):
    is_binary = (num_classes == 2)
    model = keras.Sequential([
        layers.Input(shape=(input_dim,)),

        layers.Dense(256, kernel_regularizer=regularizers.l2(1e-4)),
        layers.BatchNormalization(), layers.Activation('relu'), layers.Dropout(0.3),

        layers.Dense(128, kernel_regularizer=regularizers.l2(1e-4)),
        layers.BatchNormalization(), layers.Activation('relu'), layers.Dropout(0.3),

        layers.Dense(64, kernel_regularizer=regularizers.l2(1e-4)),
        layers.BatchNormalization(), layers.Activation('relu'), layers.Dropout(0.2),

        layers.Dense(32, kernel_regularizer=regularizers.l2(1e-4)),
        layers.BatchNormalization(), layers.Activation('relu'), layers.Dropout(0.2),

        layers.Dense(1 if is_binary else num_classes,
                     activation='sigmoid' if is_binary else 'softmax')
    ])
    model.compile(
        optimizer=keras.optimizers.Adam(1e-3),
        loss='binary_crossentropy' if is_binary else 'sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    return model, is_binary


def train_dnn(X_tr, X_val, X_te, y_tr, y_val, y_te, features, scaler, imputer, class_weight_dict):
    print("\n" + "="*60)
    print("  TRAINING — Deep Neural Network (DNN)")
    print("="*60)

    num_classes = len(np.unique(y_tr))
    model, is_binary = build_dnn(X_tr.shape[1], num_classes)
    model.summary()

    history = model.fit(
        X_tr, y_tr,
        validation_data=(X_val, y_val),
        epochs=100,
        batch_size=512,
        class_weight=class_weight_dict,
        callbacks=get_callbacks('dnn_checkpoint.keras'),
        verbose=1
    )

    # Predict
    raw = model.predict(X_te, verbose=0)
    y_pred = (raw.flatten() > 0.5).astype(int) if is_binary else np.argmax(raw, axis=1)

    metrics = compute_metrics(
        y_te, y_pred, "DNN",
        epochs_run=len(history.history['loss']),
        best_val_acc=max(history.history['val_accuracy'])
    )
    print(classification_report(y_te, y_pred, zero_division=0))

    # Save
    keras_path  = os.path.join(MODEL_DIR, 'dnn_model.keras')
    tflite_path = os.path.join(MODEL_DIR, 'dnn_model.tflite')
    model.save(keras_path)
    export_tflite(model, tflite_path, X_tr[:200])

    joblib.dump(scaler,   os.path.join(MODEL_DIR, 'scaler_dnn.pkl'))
    joblib.dump(imputer,  os.path.join(MODEL_DIR, 'imputer_dnn.pkl'))
    joblib.dump(features, os.path.join(MODEL_DIR, 'features_dnn.pkl'))
    joblib.dump(metrics,  os.path.join(MODEL_DIR, 'metrics_dnn.pkl'))

    print(f"DNN saved → {keras_path}")
    return metrics


# ============================================================
# ── MODEL 2 : CNN ──────────────────────────────────────────
# 1D Convolutional Neural Network
# Treats feature vector as a 1D signal → good at detecting
# local patterns in network flow features
# Architecture: Conv1D → Conv1D → GlobalAvgPool → FC layers
# ============================================================
def build_cnn(input_dim, num_classes):
    is_binary = (num_classes == 2)

    inp = layers.Input(shape=(input_dim, 1))   # reshape to (features, 1) for Conv1D

    # Conv block 1
    x = layers.Conv1D(64, kernel_size=3, padding='same', activation='relu')(inp)
    x = layers.BatchNormalization()(x)
    x = layers.Conv1D(64, kernel_size=3, padding='same', activation='relu')(x)
    x = layers.BatchNormalization()(x)
    x = layers.MaxPooling1D(pool_size=2)(x)
    x = layers.Dropout(0.3)(x)

    # Conv block 2
    x = layers.Conv1D(128, kernel_size=3, padding='same', activation='relu')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Conv1D(128, kernel_size=3, padding='same', activation='relu')(x)
    x = layers.BatchNormalization()(x)
    x = layers.GlobalAveragePooling1D()(x)
    x = layers.Dropout(0.3)(x)

    # FC head
    x = layers.Dense(64, activation='relu', kernel_regularizer=regularizers.l2(1e-4))(x)
    x = layers.Dropout(0.2)(x)

    out = layers.Dense(
        1 if is_binary else num_classes,
        activation='sigmoid' if is_binary else 'softmax'
    )(x)

    model = keras.Model(inp, out)
    model.compile(
        optimizer=keras.optimizers.Adam(1e-3),
        loss='binary_crossentropy' if is_binary else 'sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    return model, is_binary


def train_cnn(X_tr, X_val, X_te, y_tr, y_val, y_te, features, scaler, imputer, class_weight_dict):
    print("\n" + "="*60)
    print("  TRAINING — 1D Convolutional Neural Network (CNN)")
    print("="*60)

    num_classes = len(np.unique(y_tr))

    # CNN needs 3D input: (samples, features, 1)
    X_tr_cnn  = X_tr.reshape(X_tr.shape[0],  X_tr.shape[1],  1)
    X_val_cnn = X_val.reshape(X_val.shape[0], X_val.shape[1], 1)
    X_te_cnn  = X_te.reshape(X_te.shape[0],  X_te.shape[1],  1)

    model, is_binary = build_cnn(X_tr.shape[1], num_classes)
    model.summary()

    history = model.fit(
        X_tr_cnn, y_tr,
        validation_data=(X_val_cnn, y_val),
        epochs=100,
        batch_size=512,
        class_weight=class_weight_dict,
        callbacks=get_callbacks('cnn_checkpoint.keras'),
        verbose=1
    )

    # Predict
    raw = model.predict(X_te_cnn, verbose=0)
    y_pred = (raw.flatten() > 0.5).astype(int) if is_binary else np.argmax(raw, axis=1)

    metrics = compute_metrics(
        y_te, y_pred, "CNN",
        epochs_run=len(history.history['loss']),
        best_val_acc=max(history.history['val_accuracy'])
    )
    print(classification_report(y_te, y_pred, zero_division=0))

    # Save
    keras_path  = os.path.join(MODEL_DIR, 'cnn_model.keras')
    tflite_path = os.path.join(MODEL_DIR, 'cnn_model.tflite')
    model.save(keras_path)

    # For TFLite export, reshape sample
    X_tflite_sample = X_tr[:200].reshape(200, X_tr.shape[1], 1)
    export_tflite(model, tflite_path, X_tflite_sample)

    joblib.dump(scaler,   os.path.join(MODEL_DIR, 'scaler_cnn.pkl'))
    joblib.dump(imputer,  os.path.join(MODEL_DIR, 'imputer_cnn.pkl'))
    joblib.dump(features, os.path.join(MODEL_DIR, 'features_cnn.pkl'))
    joblib.dump(metrics,  os.path.join(MODEL_DIR, 'metrics_cnn.pkl'))

    print(f"CNN saved → {keras_path}")
    return metrics


# ============================================================
# MAIN
# ============================================================
def main():
    print("\n" + "="*60)
    print("   IoT IDS — Deep Learning Training (DNN + CNN)")
    print("="*60)

    X, y, features = load_clean()
    X_tr, X_val, X_te, y_tr, y_val, y_te, scaler, imputer, cw = preprocess(X, y, features)

    dnn_metrics = train_dnn(X_tr, X_val, X_te, y_tr, y_val, y_te, features, scaler, imputer, cw)
    cnn_metrics = train_cnn(X_tr, X_val, X_te, y_tr, y_val, y_te, features, scaler, imputer, cw)

    print("\n" + "="*60)
    print("DEEP LEARNING TRAINING COMPLETE — Summary:")
    print(f"  DNN Accuracy : {dnn_metrics['accuracy']*100:.2f}%")
    print(f"  CNN Accuracy : {cnn_metrics['accuracy']*100:.2f}%")
    print(f"  Models saved : {MODEL_DIR}")
    print("="*60)
    print("\nAll 4 models trained! Now start: python app.py")


if __name__ == "__main__":
    main()
