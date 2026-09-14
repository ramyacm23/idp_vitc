# ============================================================
# VITALSYNC AI - ML RISK SCORE PROTOTYPE
# Using FAKE sensor data
# ============================================================

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay
)

# ------------------------------------------------------------
# 1. CREATE FAKE SENSOR DATA
# ------------------------------------------------------------

np.random.seed(42)

N = 2000

data = pd.DataFrame({
    "heart_rate": np.random.normal(78, 15, N),
    "spo2": np.random.normal(97, 2, N),
    "temperature": np.random.normal(36.8, 0.6, N),
    "respiratory_rate": np.random.normal(17, 4, N),

    # ECG-derived features (FAKE for now)
    "hrv": np.random.normal(55, 20, N),
    "qrs_duration": np.random.normal(90, 15, N),

    # Motion-derived features (FAKE)
    "motion_level": np.random.normal(0.5, 0.3, N),
    "fall_detected": np.random.choice([0, 1], N, p=[0.95, 0.05])
})

# ------------------------------------------------------------
# 2. KEEP VALUES WITHIN REALISTIC RANGES
# ------------------------------------------------------------

data["heart_rate"] = data["heart_rate"].clip(40, 160)
data["spo2"] = data["spo2"].clip(75, 100)
data["temperature"] = data["temperature"].clip(34, 41)
data["respiratory_rate"] = data["respiratory_rate"].clip(8, 40)
data["hrv"] = data["hrv"].clip(5, 120)
data["qrs_duration"] = data["qrs_duration"].clip(50, 160)
data["motion_level"] = data["motion_level"].clip(0, 2)

# ------------------------------------------------------------
# 3. CREATE FAKE HEALTH/RISK LABEL
# ------------------------------------------------------------
# 0 = Low Risk
# 1 = Moderate Risk
# 2 = High Risk
# 3 = Critical Risk
#
# IMPORTANT:
# These rules are ONLY for generating fake training labels.
# They are NOT medical diagnostic rules.

risk_score_fake = (
    (100 - data["spo2"]) * 5
    + abs(data["heart_rate"] - 75) * 0.5
    + abs(data["temperature"] - 36.8) * 8
    + abs(data["respiratory_rate"] - 16) * 1.5
    + (60 - data["hrv"]).clip(lower=0) * 0.2
    + (data["qrs_duration"] - 100).clip(lower=0) * 0.1
    + data["fall_detected"] * 30
)

# Convert the fake score into classes
data["risk_class"] = pd.cut(
    risk_score_fake,
    bins=[-np.inf, 20, 40, 60, np.inf],
    labels=[0, 1, 2, 3]
).astype(int)

# ------------------------------------------------------------
# 4. DISPLAY DATASET
# ------------------------------------------------------------

print("First 10 rows of fake dataset:")
print(data.head(10).to_string(index=False))

print("\nDataset shape:")
print(data.shape)

print("\nRisk class distribution:")
print(data["risk_class"].value_counts().sort_index())

# ------------------------------------------------------------
# 5. SELECT INPUT FEATURES
# ------------------------------------------------------------

features = [
    "heart_rate",
    "spo2",
    "temperature",
    "respiratory_rate",
    "hrv",
    "qrs_duration",
    "motion_level",
    "fall_detected"
]

X = data[features]
y = data["risk_class"]

# ------------------------------------------------------------
# 6. SPLIT DATA INTO TRAINING AND TESTING
# ------------------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))

# ------------------------------------------------------------
# 7. CREATE RANDOM FOREST MODEL
# ------------------------------------------------------------

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42,
    class_weight="balanced"
)

# Train
model.fit(X_train, y_train)

print("\nModel training completed!")

# ------------------------------------------------------------
# 8. TEST MODEL
# ------------------------------------------------------------

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\nModel Accuracy:", round(accuracy * 100, 2), "%")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        zero_division=0
    )
)

# ------------------------------------------------------------
# 9. CONFUSION MATRIX
# ------------------------------------------------------------

cm = confusion_matrix(y_test, y_pred)

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=[
        "Low",
        "Moderate",
        "High",
        "Critical"
    ]
)

disp.plot()
plt.title("VitalSync AI - Confusion Matrix")
plt.show()

# ------------------------------------------------------------
# 10. FEATURE IMPORTANCE
# ------------------------------------------------------------

importance = pd.DataFrame({
    "Feature": features,
    "Importance": model.feature_importances_
})

importance = importance.sort_values(
    by="Importance",
    ascending=False
)

print("\nFeature Importance:")
print(importance.to_string(index=False))

plt.figure(figsize=(10, 5))

plt.bar(
    importance["Feature"],
    importance["Importance"]
)

plt.xticks(rotation=45)
plt.ylabel("Importance")
plt.title("Feature Importance - VitalSync AI")
plt.tight_layout()
plt.show()

# ------------------------------------------------------------
# 11. FUNCTION TO PREDICT A NEW PERSON
# ------------------------------------------------------------

def predict_risk(
    heart_rate,
    spo2,
    temperature,
    respiratory_rate,
    hrv,
    qrs_duration,
    motion_level,
    fall_detected
):

    patient = pd.DataFrame([[
        heart_rate,
        spo2,
        temperature,
        respiratory_rate,
        hrv,
        qrs_duration,
        motion_level,
        fall_detected
    ]], columns=features)

    # Predict class
    predicted_class = model.predict(patient)[0]

    # Probability of each class
    probabilities = model.predict_proba(patient)[0]

    # Convert probability into 0-100 risk score
    risk_score = (
        probabilities[0] * 0
        + probabilities[1] * 33
        + probabilities[2] * 66
        + probabilities[3] * 100
    )

    # Risk category
    categories = {
        0: "LOW",
        1: "MODERATE",
        2: "HIGH",
        3: "CRITICAL"
    }

    category = categories[predicted_class]

    print("\n===================================")
    print("        VITALSYNC AI RESULT")
    print("===================================")

    print(f"Heart Rate       : {heart_rate} BPM")
    print(f"SpO2             : {spo2}%")
    print(f"Temperature      : {temperature} °C")
    print(f"Respiratory Rate : {respiratory_rate} /min")
    print(f"HRV              : {hrv} ms")
    print(f"QRS Duration     : {qrs_duration} ms")
    print(f"Motion Level     : {motion_level}")
    print(f"Fall Detected    : {fall_detected}")

    print("-----------------------------------")

    print(f"Risk Score       : {risk_score:.2f}/100")
    print(f"Risk Category    : {category}")

    print("===================================")

    return risk_score, category


# ------------------------------------------------------------
# 12. TEST WITH A FAKE HEALTHY PERSON
# ------------------------------------------------------------

predict_risk(
    heart_rate=72,
    spo2=98,
    temperature=36.7,
    respiratory_rate=15,
    hrv=70,
    qrs_duration=88,
    motion_level=0.4,
    fall_detected=0
)


# ------------------------------------------------------------
# 13. TEST WITH A FAKE HIGH-RISK PERSON
# ------------------------------------------------------------

predict_risk(
    heart_rate=130,
    spo2=88,
    temperature=39.2,
    respiratory_rate=30,
    hrv=20,
    qrs_duration=125,
    motion_level=1.5,
    fall_detected=1
)