"""
train_ml.py — Random Forest + LinearSVC Training
=================================================
Run AFTER preprocess.py.

Outputs in model/:
  rf_model.pkl / features_rf.pkl / metrics_rf.pkl
  linear_svm_model.pkl / scaler_svm.pkl / imputer_svm.pkl
  features_svm.pkl / metrics_svm.pkl

Usage:
    python train_ml.py
"""

import os
import warnings
warnings.filterwarnings("ignore")

import numpy as np
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import LinearSVC
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix, classification_report
)

# ============================================================
# PATHS
# ============================================================
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, 'dataset')
MODEL_DIR   = os.path.join(BASE_DIR, 'model')
os.makedirs(MODEL_DIR, exist_ok=True)

CLEAN_PKL = os.path.join(DATASET_DIR, 'clean_dataset.pkl')


# ============================================================
# LOAD CLEAN DATA
# ============================================================
def load_clean():
    if not os.path.exists(CLEAN_PKL):
        raise FileNotFoundError(
            f"Clean dataset not found at {CLEAN_PKL}\n"
            "Please run preprocess.py first!"
        )
    data = joblib.load(CLEAN_PKL)
    X        = data['X']
    y        = data['y']
    features = data['features']
    print(f"Loaded clean dataset: X={X.shape}, classes={len(set(y))}")
    return X, y, features


# ============================================================
# METRIC HELPER
# ============================================================
def compute_metrics(y_true, y_pred, model_name):
    m = {
        "model":      model_name,
        "accuracy":   float(accuracy_score(y_true, y_pred)),
        "precision":  float(precision_score(y_true, y_pred, average="weighted", zero_division=0)),
        "recall":     float(recall_score(y_true, y_pred, average="weighted", zero_division=0)),
        "f1":         float(f1_score(y_true, y_pred, average="weighted", zero_division=0)),
        "confusion_matrix": confusion_matrix(y_true, y_pred).tolist(),
        "test_samples": int(len(y_true))
    }
    print(f"\n  Accuracy  : {m['accuracy']*100:.2f}%")
    print(f"  Precision : {m['precision']*100:.2f}%")
    print(f"  Recall    : {m['recall']*100:.2f}%")
    print(f"  F1-Score  : {m['f1']*100:.2f}%")
    return m


# ============================================================
# RANDOM FOREST
# ============================================================
def train_random_forest(X, y, features):
    print("\n" + "="*60)
    print("  TRAINING — Random Forest")
    print("="*60)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    clf = RandomForestClassifier(
        n_estimators=200,
        max_depth=None,
        min_samples_split=2,
        random_state=42,
        class_weight="balanced",
        n_jobs=-1
    )
    clf.fit(X_train, y_train)
    y_pred  = clf.predict(X_test)
    metrics = compute_metrics(y_test, y_pred, "Random Forest")

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))

    # Save
    joblib.dump(clf,      os.path.join(MODEL_DIR, "rf_model.pkl"))
    joblib.dump(features, os.path.join(MODEL_DIR, "features_rf.pkl"))
    joblib.dump(metrics,  os.path.join(MODEL_DIR, "metrics_rf.pkl"))
    print(f"RF model saved → {MODEL_DIR}/rf_model.pkl")

    return metrics


# ============================================================
# LINEAR SVM
# ============================================================
def train_linear_svm(X, y, features):
    print("\n" + "="*60)
    print("  TRAINING — Linear SVM")
    print("="*60)

    # SVM needs scaling
    imputer = SimpleImputer(strategy="mean")
    X_imp   = imputer.fit_transform(X)

    scaler  = StandardScaler()
    X_sc    = scaler.fit_transform(X_imp)

    X_train, X_test, y_train, y_test = train_test_split(
        X_sc, y, test_size=0.2, random_state=42, stratify=y
    )

    clf = LinearSVC(
        C=1.0,
        max_iter=15000,
        random_state=42,
        class_weight="balanced"
    )
    clf.fit(X_train, y_train)
    y_pred  = clf.predict(X_test)
    metrics = compute_metrics(y_test, y_pred, "Linear SVM")

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))

    # Save
    joblib.dump(clf,      os.path.join(MODEL_DIR, "linear_svm_model.pkl"))
    joblib.dump(scaler,   os.path.join(MODEL_DIR, "scaler_svm.pkl"))
    joblib.dump(imputer,  os.path.join(MODEL_DIR, "imputer_svm.pkl"))
    joblib.dump(features, os.path.join(MODEL_DIR, "features_svm.pkl"))
    joblib.dump(metrics,  os.path.join(MODEL_DIR, "metrics_svm.pkl"))
    print(f"SVM model saved → {MODEL_DIR}/linear_svm_model.pkl")

    return metrics


# ============================================================
# MAIN
# ============================================================
def main():
    print("\n" + "="*60)
    print("   IoT IDS — ML Training (RF + SVM)")
    print("="*60)

    X, y, features = load_clean()

    rf_metrics  = train_random_forest(X, y, features)
    svm_metrics = train_linear_svm(X, y, features)

    print("\n" + "="*60)
    print("ML TRAINING COMPLETE — Summary:")
    print(f"  Random Forest Accuracy : {rf_metrics['accuracy']*100:.2f}%")
    print(f"  Linear SVM Accuracy    : {svm_metrics['accuracy']*100:.2f}%")
    print(f"  Models saved in        : {MODEL_DIR}")
    print("="*60)
    print("\nNext step → run: python train_dl.py")


if __name__ == "__main__":
    main()
