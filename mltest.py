# ============================================================
# VITALSYNC AI - ML RISK SCORE MODEL
# Using REAL Mendeley IoT Health Monitoring Dataset
# Algorithm: XGBoost Classifier
# ============================================================

import os
import joblib
import numpy as np
import pandas as pd
import xgboost as xgb
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay
)

# ------------------------------------------------------------
# 1. LOAD REAL DATASET
# ------------------------------------------------------------

CSV_PATH = "remote_health_monitoring.csv"

if not os.path.exists(CSV_PATH):
    raise FileNotFoundError(
        f"Dataset '{CSV_PATH}' not found in root directory! "
        "Please download the dataset from Mendeley Data and place it here."
    )

data = pd.read_csv(CSV_PATH)

# Rename oxygen_level to spo2 for consistency
if "oxygen_level" in data.columns:
    data.rename(columns={"oxygen_level": "spo2"}, inplace=True)

# ------------------------------------------------------------
# 2. DISPLAY DATASET OVERVIEW
# ------------------------------------------------------------

print("First 5 rows of real dataset:")
print(data.head(5).to_string(index=False))

print("\nDataset shape:")
print(data.shape)

print("\nHealth condition class distribution:")
print(data["health_condition"].value_counts())

# ------------------------------------------------------------
# 3. SELECT INPUT FEATURES & TARGET
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

# Target variable: health_condition (6 classes)
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(data["health_condition"])
class_names = list(label_encoder.classes_)

# ------------------------------------------------------------
# 4. SPLIT DATA INTO TRAINING AND TESTING
# ------------------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining samples:", len(X_train))
print("Testing samples :", len(X_test))

# ------------------------------------------------------------
# 5. CREATE AND TRAIN XGBOOST MODEL
# ------------------------------------------------------------

model = xgb.XGBClassifier(
    n_estimators=150,
    max_depth=4,
    learning_rate=0.05,
    objective="multi:softprob",
    num_class=len(class_names),
    random_state=42,
    eval_metric="mlogloss"
)

# Train XGBoost
model.fit(X_train, y_train)

print("\nXGBoost Model training completed!")

# ------------------------------------------------------------
# 6. TEST MODEL & EVALUATE ACCURACY
# ------------------------------------------------------------

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"\nModel Accuracy: {accuracy * 100:.2f}%")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        target_names=class_names,
        zero_division=0
    )
)

# Save trained model and label encoder
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
plt.title("VitalSync AI - Real Data XGBoost Confusion Matrix")
plt.xticks(rotation=30)
plt.tight_layout()
plt.show()

# ------------------------------------------------------------
# 8. FEATURE IMPORTANCE
# ------------------------------------------------------------

importance = pd.DataFrame({
    "Feature": features,
    "Importance": model.feature_importances_
}).sort_values(by="Importance", ascending=False)

print("\nFeature Importance:")
print(importance.to_string(index=False))

plt.figure(figsize=(10, 5))
plt.bar(importance["Feature"], importance["Importance"], color="skyblue")
plt.xticks(rotation=45)
plt.ylabel("Importance Score")
plt.title("XGBoost Feature Importance - VitalSync AI")
plt.tight_layout()
plt.show()

# ------------------------------------------------------------
# 9. INFERENCE FUNCTION FOR PATIENT PREDICTION
# ------------------------------------------------------------

def predict_patient_condition(
    heart_rate,
    spo2,
    temperature,
    acc_x, acc_y, acc_z,
    gyro_x, gyro_y, gyro_z,
    acceleration_magnitude,
    gyro_magnitude,
    heart_rate_variability
):
    patient = pd.DataFrame([[
        heart_rate,
        spo2,
        temperature,
        acc_x, acc_y, acc_z,
        gyro_x, gyro_y, gyro_z,
        acceleration_magnitude,
        gyro_magnitude,
        heart_rate_variability
    ]], columns=features)

    # Predict class and probabilities
    pred_idx = model.predict(patient)[0]
    predicted_label = label_encoder.inverse_transform([pred_idx])[0]
    probabilities = model.predict_proba(patient)[0]

    # Calculate overall risk percentage (0-100) based on abnormal class probabilities
    normal_idx = np.where(label_encoder.classes_ == "Normal")[0][0]
    normal_prob = probabilities[normal_idx] if len(normal_idx) > 0 else 0
    risk_score = (1.0 - normal_prob) * 100

    print("\n===================================")
    print("        VITALSYNC AI RESULT        ")
    print("===================================")
    print(f"Heart Rate   : {heart_rate} BPM")
    print(f"SpO2         : {spo2}%")
    print(f"Temperature  : {temperature} °C")
    print(f"Acc Magnitude: {acceleration_magnitude} m/s²")
    print("-----------------------------------")
    print(f"Predicted State : {predicted_label}")
    print(f"Health Risk Score: {risk_score:.2f} / 100")
    print("===================================")

    return risk_score, predicted_label

# ------------------------------------------------------------
# 10. TEST INFERENCE WITH SAMPLE DATA
# ------------------------------------------------------------

print("\n--- Test Sample 1: Normal Patient ---")
predict_patient_condition(
    heart_rate=72.0, spo2=98.0, temperature=36.6,
    acc_x=0.01, acc_y=0.98, acc_z=0.10,
    gyro_x=0.0, gyro_y=0.01, gyro_z=0.0,
    acceleration_magnitude=0.98, gyro_magnitude=0.01,
    heart_rate_variability=45.0
)

print("\n--- Test Sample 2: Fall / Critical Patient ---")
predict_patient_condition(
    heart_rate=120.0, spo2=89.0, temperature=38.5,
    acc_x=2.5, acc_y=0.10, acc_z=4.2,
    gyro_x=1.8, gyro_y=2.1, gyro_z=1.5,
    acceleration_magnitude=4.89, gyro_magnitude=3.13,
    heart_rate_variability=15.0
)
