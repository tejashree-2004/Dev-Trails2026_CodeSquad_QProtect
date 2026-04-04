from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Worker, Policy, Claim, Disruption
from ml.premium_model import calculate_premium
from routes.triggers import run_multi_signal_check, trigger_payouts_for_zone
from datetime import datetime
import numpy as np

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///qprotect.db'
CORS(app)
db.init_app(app)

# 1. REGISTER
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    worker = Worker(
        name=data['name'],
        phone=data['phone'],
        zone=data['zone'],
        zone_risk_score=0.5,
        is_active=True,
        created_at=datetime.utcnow()
    )
    db.session.add(worker)
    db.session.commit()
    return jsonify({"worker_id": worker.id, "message": "Registered"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    worker = Worker.query.filter_by(phone=data['phone']).first()
    if not worker:
        return jsonify({"error": "Not found"}), 404
    return jsonify({
        "worker_id": worker.id,
        "name": worker.name,
        "zone": worker.zone
    })

# 2. CALCULATE PREMIUM
@app.route('/api/premium', methods=['POST'])
def get_premium():
    data = request.json
    zone = data['zone']
    plan = data['plan']
    premium, zone_risk = calculate_premium(zone, plan)
    max_payouts = {"Basic": 200, "Standard": 400, "Premium": 600}
    return jsonify({
        "zone": zone,
        "plan": plan,
        "premium": premium,
        "zone_risk_score": zone_risk,
        "max_payout": max_payouts[plan]
    })

# 3. ACTIVATE POLICY
@app.route('/api/policy/activate', methods=['POST'])
def activate_policy():
    data = request.json
    premium, zone_risk = calculate_premium(
        data['zone'], data['plan']
    )
    max_payouts = {"Basic": 200, "Standard": 400, "Premium": 600}
    policy = Policy(
        worker_id=data['worker_id'],
        plan=data['plan'],
        premium=premium,
        max_payout=max_payouts[data['plan']],
        is_active=True,
        activated_at=datetime.utcnow()
    )
    db.session.add(policy)
    db.session.commit()
    return jsonify({"policy_id": policy.id, "premium": premium})

# 4. RUN DISRUPTION CHECK (the main engine)
@app.route('/api/disruption/check', methods=['POST'])
def check_disruption():
    data = request.json
    zone = data['zone']

    result = run_multi_signal_check(zone)

    disruption = Disruption(
        zone=zone,
        type="MULTI_SIGNAL",
        severity_score=result['severity_score'],
        detected_at=datetime.utcnow(),
        is_valid=result['is_valid']
    )
    db.session.add(disruption)
    db.session.commit()

    payouts = []
    if result['is_valid']:
        payouts = trigger_payouts_for_zone(
            zone, disruption.id, result['severity_score']
        )

    return jsonify({
        "disruption_id": disruption.id,
        "is_valid": result['is_valid'],
        "signals": result['signals'],
        "severity_score": result['severity_score'],
        "payouts_triggered": payouts
    })

# 5. WORKER DASHBOARD
@app.route('/api/dashboard/<int:worker_id>', methods=['GET'])
def dashboard(worker_id):
    worker = Worker.query.get(worker_id)
    policy = Policy.query.filter_by(
        worker_id=worker_id, is_active=True
    ).first()
    claims = Claim.query.filter_by(worker_id=worker_id).all()

    return jsonify({
        "worker": {"name": worker.name, "zone": worker.zone},
        "policy": {
            "plan": policy.plan,
            "premium": policy.premium,
            "max_payout": policy.max_payout,
            "is_active": policy.is_active
        } if policy else None,
        "claims": [{
            "amount": c.payout_amount,
            "status": c.status,
            "paid_at": str(c.paid_at)
        } for c in claims],
        "total_received": sum(c.payout_amount for c in claims)
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)