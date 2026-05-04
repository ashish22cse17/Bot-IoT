"""
app.py — Flask Backend serving RF, SVM, DNN, CNN
=================================================
Serves all 4 models with unified API.

Endpoints:
  GET  /health
  POST /login
  GET  /models                   → all 4 model statuses
  GET  /models/<name>/metrics    → rf | linear_svm | dnn | cnn
  GET  /models/<name>/features
  GET  /compare                  → side-by-side metrics for all 4
  POST /predict                  → {"model": "rf|linear_svm|dnn|cnn", ...features}
  POST /upload                   → CSV batch prediction
"""

import os
import io
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import traceback
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

BASE_DIR  = os.path.abspath(os.path.dirname(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")

# ============================================================
# TFLite Runtime
# ============================================================
TFLiteInterpreter = None
try:
    import tflite_runtime.interpreter as tflite
    TFLiteInterpreter = tflite.Interpreter
    logger.info("Using tflite_runtime")
except ImportError:
    try:
        import tensorflow as tf
        TFLiteInterpreter = tf.lite.Interpreter
        logger.info("Using TensorFlow TFLite Interpreter")
    except ImportError:
        logger.warning("No TFLite runtime — DNN/CNN will use Keras fallback")

# ============================================================
# Auth
# ============================================================
DEMO_USERNAME = "admin"
DEMO_PASSWORD = "password"
DEMO_TOKEN    = "demo-token"

# ============================================================
# Model Registry
# ============================================================
ML_MODELS = {
    "rf": {
        "model_file":   "rf_model.pkl",
        "features_file":"features_rf.pkl",
        "metrics_file": "metrics_rf.pkl",
        "scaler_file":  None,
        "imputer_file": None,
        "type":         "classical_ml"
    },
    "linear_svm": {
        "model_file":   "linear_svm_model.pkl",
        "features_file":"features_svm.pkl",
        "metrics_file": "metrics_svm.pkl",
        "scaler_file":  "scaler_svm.pkl",
        "imputer_file": "imputer_svm.pkl",
        "type":         "classical_ml"
    }
}

DL_MODELS = {
    "dnn": {
        "keras_file":   "dnn_model.keras",
        "tflite_file":  "dnn_model.tflite",
        "features_file":"features_dnn.pkl",
        "metrics_file": "metrics_dnn.pkl",
        "scaler_file":  "scaler_dnn.pkl",
        "imputer_file": "imputer_dnn.pkl",
        "reshape":      False,
        "type":         "deep_learning"
    },
    "cnn": {
        "keras_file":   "cnn_model.keras",
        "tflite_file":  "cnn_model.tflite",
        "features_file":"features_cnn.pkl",
        "metrics_file": "metrics_cnn.pkl",
        "scaler_file":  "scaler_cnn.pkl",
        "imputer_file": "imputer_cnn.pkl",
        "reshape":      True,
        "type":         "deep_learning"
    }
}

ALL_MODEL_NAMES = list(ML_MODELS.keys()) + list(DL_MODELS.keys())

# ============================================================
# TFLite Cache
# ============================================================
_interpreters = {}
_keras_models  = {}

def get_tflite(name):
    """Get or load TFLite interpreter for a model"""
    if name in _interpreters:
        return _interpreters[name]
    
    cfg = DL_MODELS.get(name)
    if not cfg:
        raise RuntimeError(f"Unknown DL model: {name}")
    
    path = os.path.join(MODEL_DIR, cfg["tflite_file"])
    if not os.path.exists(path):
        raise RuntimeError(f"{name} TFLite model not found at {path}")
    
    if TFLiteInterpreter is None:
        raise RuntimeError("No TFLite runtime installed")
    
    logger.info(f"Loading TFLite model: {name}")
    interp = TFLiteInterpreter(model_path=path)
    interp.allocate_tensors()
    _interpreters[name] = interp
    return interp

def get_keras(name):
    """Get or load Keras model"""
    if name in _keras_models:
        return _keras_models[name]
    
    cfg = DL_MODELS.get(name)
    if not cfg:
        raise RuntimeError(f"Unknown DL model: {name}")
    
    path = os.path.join(MODEL_DIR, cfg["keras_file"])
    if not os.path.exists(path):
        raise RuntimeError(f"{name} Keras model not found at {path}")
    
    import tensorflow as tf
    logger.info(f"Loading Keras model: {name}")
    model = tf.keras.models.load_model(path)
    _keras_models[name] = model
    return model

def dl_predict(name, X):
    """Make prediction using deep learning model (TFLite with Keras fallback)"""
    cfg = DL_MODELS.get(name)
    if not cfg:
        raise ValueError(f"Unknown DL model: {name}")
    
    X_f = X.astype(np.float32)
    if cfg["reshape"]:
        X_f = X_f.reshape(X_f.shape[0], X_f.shape[1], 1)

    # Try TFLite first
    try:
        interp = get_tflite(name)
        in_det = interp.get_input_details()
        out_det = interp.get_output_details()
        
        predictions = []
        for i in range(len(X_f)):
            interp.set_tensor(in_det[0]['index'], X_f[i:i+1])
            interp.invoke()
            predictions.append(interp.get_tensor(out_det[0]['index'])[0])
        
        out = np.array(predictions)
        logger.info(f"TFLite prediction shape: {out.shape}")
        
        if out.ndim > 1 and out.shape[1] > 1:
            return np.argmax(out, axis=1)
        else:
            return (out.flatten() > 0.5).astype(int)
            
    except Exception as e:
        logger.warning(f"TFLite failed ({e}) — falling back to Keras")

    # Fallback to Keras
    try:
        model = get_keras(name)
        out = model.predict(X_f, verbose=0)
        logger.info(f"Keras prediction shape: {out.shape}")
        
        if out.ndim > 1 and out.shape[1] > 1:
            return np.argmax(out, axis=1)
        else:
            return (out.flatten() > 0.5).astype(int)
    except Exception as e:
        logger.error(f"Both TFLite and Keras failed: {e}")
        raise RuntimeError(f"Prediction failed for {name}: {str(e)}")

# ============================================================
# Loaders
# ============================================================
def load_ml_model(name):
    """Load classical ML model (RF or SVM)"""
    cfg = ML_MODELS.get(name)
    if not cfg:
        raise ValueError(f"Unknown ML model: {name}")

    def fp(key):
        fn = cfg.get(key)
        return os.path.join(MODEL_DIR, fn) if fn else None

    model_path = fp("model_file")
    if not model_path or not os.path.exists(model_path):
        raise RuntimeError(f"{name} model not found at {model_path}. Run train_ml.py first.")

    logger.info(f"Loading ML model: {name}")
    
    return {
        "model":    joblib.load(model_path),
        "features": joblib.load(fp("features_file")),
        "metrics":  joblib.load(fp("metrics_file")),
        "scaler":   joblib.load(fp("scaler_file")) if fp("scaler_file") and os.path.exists(fp("scaler_file")) else None,
        "imputer":  joblib.load(fp("imputer_file")) if fp("imputer_file") and os.path.exists(fp("imputer_file")) else None,
        "type": cfg["type"],
        "name": name
    }

def load_dl_model(name):
    """Load deep learning model metadata"""
    cfg = DL_MODELS.get(name)
    if not cfg:
        raise ValueError(f"Unknown DL model: {name}")

    def fp(key):
        fn = cfg.get(key)
        return os.path.join(MODEL_DIR, fn) if fn else None

    features_path = fp("features_file")
    if not features_path or not os.path.exists(features_path):
        raise RuntimeError(f"{name} features not found at {features_path}. Run train_dl.py first.")

    logger.info(f"Loading DL model metadata: {name}")
    
    return {
        "features": joblib.load(features_path),
        "metrics":  joblib.load(fp("metrics_file")),
        "scaler":   joblib.load(fp("scaler_file")) if fp("scaler_file") and os.path.exists(fp("scaler_file")) else None,
        "imputer":  joblib.load(fp("imputer_file")) if fp("imputer_file") and os.path.exists(fp("imputer_file")) else None,
        "type": cfg["type"],
        "name": name
    }

def load_model(name):
    """Unified model loader"""
    if name in ML_MODELS:
        return load_ml_model(name)
    if name in DL_MODELS:
        return load_dl_model(name)
    raise ValueError(f"Unknown model '{name}'. Available: {ALL_MODEL_NAMES}")

# ============================================================
# Routes
# ============================================================

@app.route("/health")
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "models": ALL_MODEL_NAMES,
        "tflite_available": TFLiteInterpreter is not None
    })

@app.route("/login", methods=["POST"])
def login():
    """Simple authentication"""
    data = request.json or {}
    if data.get("username") == DEMO_USERNAME and data.get("password") == DEMO_PASSWORD:
        return jsonify({"token": DEMO_TOKEN})
    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/models")
def models():
    """Get all model statuses"""
    result = {}
    for name in ALL_MODEL_NAMES:
        try:
            d = load_model(name)
            result[name] = {
                "available": True,
                "accuracy":  d["metrics"].get("accuracy"),
                "f1":        d["metrics"].get("f1"),
                "type":      d["type"]
            }
        except Exception as e:
            logger.error(f"Error loading model {name}: {e}")
            result[name] = {"available": False, "error": str(e)}
    return jsonify(result)

@app.route("/models/<name>/metrics")
def get_metrics(name):
    """Get metrics for a specific model"""
    try:
        return jsonify(load_model(name)["metrics"])
    except Exception as e:
        logger.error(f"Error getting metrics for {name}: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/models/<name>/features")
def get_features(name):
    """Get feature list for a specific model"""
    try:
        d = load_model(name)
        return jsonify({
            "features": d["features"],
            "count": len(d["features"])
        })
    except Exception as e:
        logger.error(f"Error getting features for {name}: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/compare")
def compare():
    """Get comparison metrics for all models"""
    result = {}
    for name in ALL_MODEL_NAMES:
        try:
            m = load_model(name)["metrics"]
            result[name] = {
                "accuracy":         round(float(m.get("accuracy",  0)) * 100, 2),
                "precision":        round(float(m.get("precision", 0)) * 100, 2),
                "recall":           round(float(m.get("recall",    0)) * 100, 2),
                "f1":               round(float(m.get("f1",        0)) * 100, 2),
                "test_samples":     m.get("test_samples", 0),
                "confusion_matrix": m.get("confusion_matrix", []),
                "available":        True
            }
        except Exception as e:
            logger.error(f"Error comparing model {name}: {e}")
            result[name] = {"available": False, "error": str(e)}
    return jsonify(result)

@app.route("/predict", methods=["POST"])
def predict():
    """Single prediction endpoint"""
    try:
        payload = request.json or {}
        model_name = payload.get("model")
        
        if not model_name:
            return jsonify({"error": "Model parameter is required"}), 400
        
        logger.info(f"Prediction request for model: {model_name}")
        
        try:
            data = load_model(model_name)
        except Exception as e:
            logger.error(f"Failed to load model {model_name}: {e}")
            return jsonify({"error": str(e)}), 500

        features = data["features"]
        
        # Extract feature values
        try:
            x = np.array([float(payload.get(f, 0)) for f in features]).reshape(1, -1)
        except Exception as e:
            logger.error(f"Invalid feature values: {e}")
            return jsonify({"error": "Invalid feature values. All features must be numeric."}), 400

        # Preprocess
        if data["imputer"]:
            x = data["imputer"].transform(x)
        if data["scaler"]:
            x = data["scaler"].transform(x)

        # Predict
        if model_name in DL_MODELS:
            prediction = int(dl_predict(model_name, x)[0])
            probabilities = None
        else:
            model = data["model"]
            prediction = int(model.predict(x)[0])
            probabilities = model.predict_proba(x).tolist()[0] if hasattr(model, "predict_proba") else None

        logger.info(f"Prediction result: {prediction}")
        
        return jsonify({
            "prediction": prediction,
            "probabilities": probabilities,
            "model_used": model_name
        })

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/upload", methods=["POST"])
def upload():
    """CSV batch prediction endpoint"""
    try:
        model_name = request.form.get("model")
        
        if not model_name:
            return jsonify({"error": "Model parameter is required"}), 400
        
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files["file"]
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not file.filename.endswith('.csv'):
            return jsonify({"error": "File must be a CSV"}), 400
        
        logger.info(f"Processing upload: {file.filename} with model: {model_name}")
        
        # Load model
        try:
            data = load_model(model_name)
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            return jsonify({"error": f"Failed to load model '{model_name}': {str(e)}"}), 500

        features = data["features"]
        logger.info(f"Using {len(features)} features for prediction")
        
        # Read CSV in chunks
        try:
            reader = pd.read_csv(file, chunksize=1000, low_memory=False)
        except Exception as e:
            logger.error(f"CSV read error: {e}")
            return jsonify({"error": f"Invalid CSV format: {str(e)}"}), 400

        chunks = []
        total_rows = 0
        
        # Process each chunk
        for chunk_num, chunk in enumerate(reader):
            try:
                # Add missing features with default 0
                for col in features:
                    if col not in chunk.columns:
                        chunk[col] = 0
                    # Convert hex strings to integers
                    if chunk[col].dtype == object:
                        chunk[col] = chunk[col].apply(
                            lambda v: int(v, 16) if isinstance(v, str) and v.startswith("0x") else v
                        )
                
                # Convert to numeric and handle missing values
                chunk[features] = chunk[features].apply(pd.to_numeric, errors="coerce").fillna(0)
                X = chunk[features].astype(float).values
                
                # Preprocess
                if data["imputer"]:
                    X = data["imputer"].transform(X)
                if data["scaler"]:
                    X = data["scaler"].transform(X)
                
                # Make predictions
                if model_name in DL_MODELS:
                    chunk["prediction"] = dl_predict(model_name, X)
                else:
                    chunk["prediction"] = data["model"].predict(X)
                
                chunks.append(chunk)
                total_rows += len(chunk)
                logger.info(f"Processed chunk {chunk_num + 1}: {len(chunk)} rows")
                
            except Exception as e:
                logger.error(f"Error processing chunk {chunk_num}: {e}")
                traceback.print_exc()
                return jsonify({
                    "error": f"Error processing data at row {total_rows}: {str(e)}"
                }), 400

        if not chunks:
            return jsonify({"error": "No data processed from CSV"}), 400

        # Combine all chunks
        logger.info(f"Combining {len(chunks)} chunks ({total_rows} total rows)")
        result_df = pd.concat(chunks, ignore_index=True)
        
        # Create output CSV
        out = io.BytesIO()
        result_df.to_csv(out, index=False)
        out.seek(0)
        
        logger.info(f"Upload complete: {total_rows} rows processed")
        
        return send_file(
            out,
            mimetype="text/csv",
            as_attachment=True,
            download_name=f"predictions_{model_name}_{pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')}.csv"
        )

    except Exception as e:
        logger.error(f"Upload error: {e}")
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    logger.info(f"Starting server with models: {ALL_MODEL_NAMES}")
    logger.info(f"Model directory: {MODEL_DIR}")
    logger.info(f"TFLite available: {TFLiteInterpreter is not None}")
    
    # Check for model files
    for model_name in ALL_MODEL_NAMES:
        try:
            load_model(model_name)
            logger.info(f"✓ {model_name} model loaded successfully")
        except Exception as e:
            logger.warning(f"✗ {model_name} model not available: {e}")
    
    app.run(debug=True, use_reloader=False, host="0.0.0.0", port=5020)