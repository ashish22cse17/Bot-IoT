"""
preprocess.py — Bot-IoT Dataset Preprocessor
=============================================
Run this FIRST before any training script.
Cleans and saves data that ALL 4 models (RF, SVM, DNN, CNN) will use.

Usage:
    python preprocess.py

Output:
    dataset/clean_dataset.pkl   ← used by train_ml.py and train_dl.py
    dataset/clean_dataset_info.json ← summary of what was done
"""

import os
import json
import warnings
warnings.filterwarnings("ignore")

import numpy as np
import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder

# ============================================================
# PATHS
# ============================================================
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, 'dataset')
os.makedirs(DATASET_DIR, exist_ok=True)

# Try both CSVs (same as your original project)
CSV_PATHS = [
    os.path.join(DATASET_DIR, 'dataset.csv'),
    os.path.join(DATASET_DIR, 'sample.csv'),
]

OUT_PKL  = os.path.join(DATASET_DIR, 'clean_dataset.pkl')
OUT_INFO = os.path.join(DATASET_DIR, 'clean_dataset_info.json')


# ============================================================
# STEP 1 — LOAD
# ============================================================
def load_raw(paths):
    for path in paths:
        if os.path.exists(path):
            print(f"Loading: {path}")
            try:
                df = pd.read_csv(path, low_memory=False)
                if not df.empty:
                    print(f"  Shape: {df.shape}")
                    return df, path
            except Exception as e:
                print(f"  Failed: {e}")
    return None, None


# ============================================================
# STEP 2 — DETECT LABEL COLUMN
# ============================================================
def detect_label_col(df):
    candidates = ['attack', 'label', 'target', 'class', 'y', 'category', 'attack_cat']
    for c in df.columns:
        if c.lower() in candidates:
            return c
    return None


# ============================================================
# STEP 3 — CLEAN
# ============================================================
def clean(df, label_col):
    info = {}
    original_shape = df.shape
    print(f"\n{'='*60}")
    print("  PREPROCESSING PIPELINE")
    print(f"{'='*60}")
    print(f"Original shape : {original_shape}")

    # --- 3a. Drop duplicates ---
    before = len(df)
    df = df.drop_duplicates()
    dropped = before - len(df)
    print(f"Duplicates removed     : {dropped}")
    info['duplicates_removed'] = dropped

    # --- 3b. Replace inf with NaN ---
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    inf_count = df.isnull().sum().sum()
    print(f"Inf values → NaN       : done")

    # --- 3c. Drop columns with > 50% missing ---
    thresh = int(0.5 * len(df))
    before_cols = df.shape[1]
    df.dropna(axis=1, thresh=thresh, inplace=True)
    dropped_cols = before_cols - df.shape[1]
    print(f"Columns dropped (>50% NaN): {dropped_cols}")
    info['columns_dropped_missing'] = dropped_cols

    # --- 3d. Fill remaining NaN with column mean (numeric only) ---
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].mean())
    print(f"Remaining NaN filled   : mean imputation on {len(numeric_cols)} numeric cols")

    # --- 3e. Recheck label col still exists ---
    if label_col not in df.columns:
        raise ValueError(f"Label column '{label_col}' was dropped! Check dataset.")

    # --- 3f. Drop zero-variance columns ---
    feature_cols = [c for c in numeric_cols if c != label_col]
    variances    = df[feature_cols].var()
    zero_var     = variances[variances == 0].index.tolist()
    df.drop(columns=zero_var, inplace=True)
    print(f"Zero-variance cols dropped: {len(zero_var)} → {zero_var[:5]}{'...' if len(zero_var)>5 else ''}")
    info['zero_variance_dropped'] = len(zero_var)

    # --- 3g. Drop highly correlated features (>0.98) ---
    feature_cols = [c for c in df.select_dtypes(include=[np.number]).columns if c != label_col]
    corr_matrix  = df[feature_cols].corr().abs()
    upper        = corr_matrix.where(np.triu(np.ones(corr_matrix.shape), k=1).astype(bool))
    to_drop      = [col for col in upper.columns if any(upper[col] > 0.98)]
    df.drop(columns=to_drop, inplace=True)
    print(f"Highly corr cols dropped (>0.98): {len(to_drop)}")
    info['high_corr_dropped'] = len(to_drop)

    # --- 3h. Cap outliers at 1st–99th percentile ---
    feature_cols = [c for c in df.select_dtypes(include=[np.number]).columns if c != label_col]
    for col in feature_cols:
        lo = df[col].quantile(0.01)
        hi = df[col].quantile(0.99)
        df[col] = df[col].clip(lo, hi)
    print(f"Outliers capped        : 1st–99th percentile on {len(feature_cols)} cols")

    # --- 3i. Encode labels ---
    y_raw = df[label_col].values
    le    = LabelEncoder()
    y_enc = le.fit_transform(y_raw.astype(str))
    label_map = {str(cls): int(idx) for idx, cls in enumerate(le.classes_)}

    print(f"Label encoding         : {label_map}")
    info['label_map']    = label_map
    info['num_classes']  = len(label_map)
    info['class_distribution'] = {
        str(cls): int((y_enc == idx).sum())
        for idx, cls in enumerate(le.classes_)
    }

    # --- 3j. Final feature list ---
    feature_cols = [c for c in df.select_dtypes(include=[np.number]).columns if c != label_col]
    X = df[feature_cols].values.astype(float)
    y = y_enc

    print(f"\nFinal shape            : X={X.shape}, y={y.shape}")
    print(f"Features kept          : {len(feature_cols)}")
    print(f"Classes                : {list(label_map.keys())}")

    info['original_shape']  = list(original_shape)
    info['final_shape']     = list(X.shape)
    info['features']        = feature_cols
    info['label_col']       = label_col

    return X, y, feature_cols, label_map, info


# ============================================================
# STEP 4 — SAVE
# ============================================================
def save(X, y, features, label_map, info, source_path):
    payload = {
        'X':         X,
        'y':         y,
        'features':  features,
        'label_map': label_map,
        'source':    source_path,
    }
    joblib.dump(payload, OUT_PKL)
    print(f"\nClean dataset saved → {OUT_PKL}")

    with open(OUT_INFO, 'w') as f:
        json.dump(info, f, indent=2)
    print(f"Info saved            → {OUT_INFO}")


# ============================================================
# SYNTHETIC FALLBACK
# ============================================================
def make_synthetic():
    print("\nNo CSV found — generating SYNTHETIC Bot-IoT-like data...")
    from sklearn.datasets import make_classification
    X, y = make_classification(
        n_samples=5000,
        n_features=20,
        n_informative=15,
        n_redundant=2,
        n_classes=5,
        n_clusters_per_class=1,
        random_state=42
    )
    features  = [f'feature_{i}' for i in range(20)]
    label_map = {f'class_{i}': i for i in range(5)}
    info = {
        'original_shape': [5000, 21],
        'final_shape': [5000, 20],
        'features': features,
        'label_map': label_map,
        'num_classes': 5,
        'source': 'synthetic',
        'duplicates_removed': 0,
        'columns_dropped_missing': 0,
        'zero_variance_dropped': 0,
        'high_corr_dropped': 0,
        'class_distribution': {f'class_{i}': 1000 for i in range(5)},
        'label_col': 'synthetic_label'
    }
    return X.astype(float), y, features, label_map, info, 'synthetic'


# ============================================================
# MAIN
# ============================================================
def main():
    print("\n" + "="*60)
    print("   IoT IDS — Data Preprocessing Script")
    print("="*60)

    df, source_path = load_raw(CSV_PATHS)

    if df is None:
        X, y, features, label_map, info, source_path = make_synthetic()
    else:
        label_col = detect_label_col(df)
        if not label_col:
            print("ERROR: No label column found! Expected: attack, label, target, class, y")
            print(f"Found columns: {list(df.columns)}")
            return

        print(f"Label column: '{label_col}'")
        print(f"Class distribution:\n{df[label_col].value_counts().to_string()}\n")

        X, y, features, label_map, info = clean(df, label_col)

    save(X, y, features, label_map, info, source_path if df is not None else 'synthetic')

    print("\n" + "="*60)
    print("PREPROCESSING COMPLETE!")
    print(f"  Features : {len(features)}")
    print(f"  Samples  : {len(X)}")
    print(f"  Classes  : {info['num_classes']}")
    print(f"  Output   : {OUT_PKL}")
    print("="*60)
    print("\nNext step → run: python train_ml.py")
    print("            then: python train_dl.py")


if __name__ == "__main__":
    main()
