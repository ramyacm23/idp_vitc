# ============================================================
# VITALSYNC AI - ML RISK SCORE MODEL
# Using REAL Mendeley IoT Health Monitoring Dataset
# Algorithm: XGBoost Classifier (Group-Based Patient Split)
# ============================================================

import os
import joblib
import numpy as np
import pandas as pd
import xgboost as xgb
import matplotlib.pyplot as plt

from sklearn.model_selection import GroupShuffleSplit
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay
)

# ------------------------------------------------------------
# 1. LOAD DATASET
# ------------------------------------------------------------

CSV_PATH = "remote_health_monitoring.csv"

if not os.path.exists(CSV_PATH):
    raise FileNotFoundError(
        f"Dataset '{CSV_PATH}' not found! "
        "Please place 'remote_health_monitoring.csv' in the project directory."
    )

data = pd.read_csv(CSV_PATH)

# Rename oxygen_level to spo2 if needed
if "oxygen_level" in data.columns:
    data.rename(columns={"oxygen_level": "spo2"}, inplace=True)

# ------------------------------------------------------------
# 2. RECONSTRUCT SUBJECT GROUPS (17 Subjects, 36 Timesteps Each)
# ------------------------------------------------------------

# The dataset has 612 rows corresponding to 17 simulated subjects
data['subject_id'] = np.repeat(np.arange(17), 36)

print(f"Total Rows: {len(data)} | Total Unique Patients: {data['subject_id'].nunique()}")

# ------------------------------------------------------------
# 3. SELECT FEATURES & TARGET
# ------------------------------------------------------------

features = [
    "heart_rate",
    "spo2",
    "temperature",
    "acc_x",
    "acc_y",
    "acc_z",
    "gyro_x",
    "gyro_y",
    "gyro_z",
    "acceleration_magnitude",
    "gyro_magnitude",
    "heart_rate_variability"
]

X = data[features]

label_encoder = LabelEncoder()
y = label_encoder.fit_transform(data["health_condition"])
class_names = list(label_encoder.classes_)

# ------------------------------------------------------------
# 4. SUBJECT-BASED SPLIT (Prevents Data Leakage)
# ------------------------------------------------------------

# 80% of patients for training, 20% for testing (~3-4 unseen subjects)
gss = GroupShuffleSplit(n_splits=1, test_size=0.20, random_state=42)
train_idx, test_idx = next(gss.split(X, y, groups=data['subject_id']))

X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]

train_subjects = data['subject_id'].iloc[train_idx].unique()
test_subjects = data['subject_id'].iloc[test_idx].unique()

print(f"\nTraining on Patients : {train_subjects.tolist()} ({len(X_train)} samples)")
print(f"Testing on Patients  : {test_subjects.tolist()} ({len(X_test)} samples)")

# ------------------------------------------------------------
# 5. TRAIN XGBOOST MODEL
# ------------------------------------------------------------

model = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=3,
    learning_rate=0.05,
    objective="multi:softprob",
    num_class=len(class_names),
    random_state=42,
    eval_metric="mlogloss"
)

model.fit(X_train, y_train)

# ------------------------------------------------------------
# 6. EVALUATE ON UNSEEN PATIENTS
# ------------------------------------------------------------

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"\nReal Generalization Accuracy on Unseen Patients: {accuracy * 100:.2f}%")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        target_names=class_names,
        zero_division=0
    )
)

# Save artifacts
joblib.dump(model, "vitalsync_xgboost.pkl")
joblib.dump(label_encoder, "vitalsync_label_encoder.pkl")
print("Saved artifacts: 'vitalsync_xgboost.pkl' & 'vitalsync_label_encoder.pkl'")

# ------------------------------------------------------------
# 7. CONFUSION MATRIX
# ------------------------------------------------------------

cm = confusion_matrix(y_test, y_pred)

fig, ax = plt.subplots(figsize=(8, 6))
disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=class_names
)

disp.plot(ax=ax, cmap="Blues")
plt.title("VitalSync AI - Subject-Based Split Confusion Matrix")
plt.xticks(rotation=30)
plt.tight_layout()
plt.show()
