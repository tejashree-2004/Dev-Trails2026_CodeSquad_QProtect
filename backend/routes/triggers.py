# routes/triggers.py
import requests
import numpy as np
import random
from datetime import datetime
from models import db, Disruption, Worker, Policy, Claim
from ml.premium_model import ZONE_RISK

WEATHER_API_KEY = "your_openweathermap_key"

ZONE_COORDS = {
    "Velachery":   (12.9786, 80.2209),
    "Anna Nagar":  (13.0850, 80.2101),
    "Koramangala": (12.9352, 77.6245),
    "Andheri":     (19.1136, 72.8697),
    "Saket":       (28.5244, 77.2167),
}

def get_rain_signal(zone):
    coords = ZONE_COORDS.get(zone, (12.97, 80.22))
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather"
        r = requests.get(url, params={
            "lat": coords[0], "lon": coords[1],
            "appid": WEATHER_API_KEY, "units": "metric"
        }, timeout=5)
        data = r.json()
        rain = data.get("rain", {}).get("1h", 0)
        temp = data.get("main", {}).get("temp", 25)
        rain_triggered = rain > 15
        heat_triggered = temp > 42
        severity = min(100, (rain / 50) * 100) if rain_triggered else 0
        return rain_triggered or heat_triggered, severity
    except:
        # Mock fallback for demo
        return True, 65.0

def get_dispatch_signal(zone):
    # Mock -- simulate dark store pause
    import random
    paused = random.choice([True, False, True])  # bias toward True for demo
    severity = 80.0 if paused else 0
    return paused, severity

def get_gps_signal(zone):
    # Simulate GPS inactivity
    # In real app: check if worker GPS hasn't moved in 30+ min
    import random
    idle = random.choice([True, True, False])  # bias toward True for demo
    severity = 60.0 if idle else 0
    return idle, severity

def run_multi_signal_check(zone):
    rain_hit, rain_sev     = get_rain_signal(zone)
    dispatch_hit, disp_sev = get_dispatch_signal(zone)
    gps_hit, gps_sev       = get_gps_signal(zone)

    signals_hit = sum([rain_hit, dispatch_hit, gps_hit])
    
    # Multi-signal rule: at least 1 external + 2 impact signals
    # Rain = external, dispatch + GPS = impact
    external_confirmed = rain_hit
    impact_confirmed   = sum([dispatch_hit, gps_hit]) >= 1

    is_valid = external_confirmed and impact_confirmed
    
    avg_severity = np.mean([s for s in [rain_sev, disp_sev, gps_sev] if s > 0]) if signals_hit > 0 else 0

    return {
        "is_valid": is_valid,
        "signals": {
            "rain": rain_hit, "dispatch_pause": dispatch_hit, "gps_idle": gps_hit
        },
        "severity_score": round(avg_severity, 1),
        "signals_count": signals_hit
    }

def trigger_payouts_for_zone(zone, disruption_id, severity_score):
    # Find all eligible workers in zone
    workers = Worker.query.filter_by(zone=zone, is_active=True).all()
    payouts = []

    for worker in workers:
        policy = Policy.query.filter_by(
            worker_id=worker.id, is_active=True
        ).first()

        if not policy:
            continue

        # Eligibility: active policy + zone match (GPS check mocked)
        payout_amount = round((severity_score / 100) * policy.max_payout, 0)

        claim = Claim(
            worker_id=worker.id,
            disruption_id=disruption_id,
            payout_amount=payout_amount,
            status="AUTO_APPROVED",
            paid_at=datetime.utcnow()
        )
        db.session.add(claim)
        payouts.append({
            "worker": worker.name,
            "amount": payout_amount
        })

    db.session.commit()
    return payouts