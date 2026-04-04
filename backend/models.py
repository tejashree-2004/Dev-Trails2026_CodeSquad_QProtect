from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Worker(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    phone = db.Column(db.String, unique=True)
    zone = db.Column(db.String)
    zone_risk_score = db.Column(db.Float)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime)

class Policy(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('worker.id'))
    plan = db.Column(db.String)
    premium = db.Column(db.Float)
    max_payout = db.Column(db.Float)
    is_active = db.Column(db.Boolean, default=False)
    activated_at = db.Column(db.DateTime)

class Disruption(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    zone = db.Column(db.String)
    type = db.Column(db.String)
    severity_score = db.Column(db.Float)
    detected_at = db.Column(db.DateTime)
    is_valid = db.Column(db.Boolean)

class Claim(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('worker.id'))
    disruption_id = db.Column(db.Integer, db.ForeignKey('disruption.id'))
    payout_amount = db.Column(db.Float)
    status = db.Column(db.String)
    paid_at = db.Column(db.DateTime)