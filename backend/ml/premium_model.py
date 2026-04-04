# ml/premium_model.py
import numpy as np
from sklearn.ensemble import RandomForestRegressor

# Zone risk scores (hardcoded for demo -- replace with DB values)
ZONE_RISK = {
    "Velachery":   0.82,
    "Anna Nagar":  0.35,
    "Koramangala": 0.65,
    "Andheri":     0.71,
    "Saket":       0.48,
}

PLAN_RANGES = {
    "Basic":    (18, 22),
    "Standard": (32, 38),
    "Premium":  (47, 53),
}

def train_model():
    # Synthetic training data
    # Features: [zone_risk, working_hours, aqi_avg, is_monsoon]
    X = np.array([
        [0.2, 30, 80,  0], [0.4, 40, 120, 0],
        [0.6, 50, 180, 1], [0.8, 60, 250, 1],
        [0.9, 70, 320, 1], [0.3, 35, 90,  0],
        [0.7, 55, 200, 1], [0.5, 45, 150, 0],
    ])
    # Labels: base premium multiplier (0 to 1)
    y = np.array([0.2, 0.35, 0.55, 0.75, 0.95, 0.28, 0.70, 0.48])

    model = RandomForestRegressor(n_estimators=10, random_state=42)
    model.fit(X, y)
    return model

MODEL = train_model()

def calculate_premium(zone, plan, working_hours=45, aqi_avg=120, is_monsoon=0):
    zone_risk = ZONE_RISK.get(zone, 0.5)
    features = np.array([[zone_risk, working_hours, aqi_avg, is_monsoon]])
    multiplier = MODEL.predict(features)[0]

    min_p, max_p = PLAN_RANGES[plan]
    premium = round(min_p + (multiplier * (max_p - min_p)), 0)
    return float(premium), float(zone_risk)