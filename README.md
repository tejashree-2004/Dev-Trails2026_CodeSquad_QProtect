# QProtect: AI-Powered Parametric Income Insurance for Q-Commerce Delivery Partners

Guidewire DEVTrails 2026 | Phase 1 Submission

## Video Demo: https://youtu.be/41HRcNUWYa0

## The Problem

India's Q-commerce delivery partners (Zepto, Blinkit, Swiggy Instamart) operate on 10-minute SLA cycles, completing 4 to 6 deliveries per hour. A single disrupted hour wipes out ₹150 to ₹300 in income. A disrupted afternoon can cost ₹400 to ₹600. These workers have no safety net.

A Q-commerce rider is tied to one assigned dark store within a 2 to 3 km radius. When that zone is hit by rain, extreme heat, a curfew, or a store closure, every rider assigned to it earns zero simultaneously. The pain is hyperlocal, immediate, and measurable.

QProtect fixes this. When a qualifying disruption hits, the worker is automatically compensated. No claim. No paperwork. No waiting.


## Persona

Who: Q-commerce delivery partners working for Zepto, Blinkit, and Swiggy Instamart in metro cities including Chennai, Mumbai, Bengaluru, and Delhi-NCR.

Characteristics:
- Works 6 to 10 hours per day, 6 days a week on 10-minute sprint cycles
- Earns ₹30 to ₹50 per delivery with no fixed salary
- Operates from one assigned dark store covering a 2 to 3 km radius
- Thinks and earns in weekly cycles aligned with platform settlement
- Smartphone is the primary work device

Why Q-commerce specifically:

The 10-minute SLA model means income loss per disrupted hour is significantly higher than other delivery categories. The dark store model creates a unique trigger: when a store pauses dispatch, every rider assigned loses income simultaneously.


## Persona Scenario

Arjun Kumar is a Zepto delivery partner in Velachery, Chennai.

- By 1pm: 18 deliveries → ₹540 earned  
- Weekly baseline: ₹1,200  
- Remaining earning potential: ₹660  

At 2pm, heavy rain hits.

QProtect:
- Detects rain
- Confirms rider inactivity
- Calculates income loss
- Credits ₹290 by 4:15pm automatically

## Solution Overview

QProtect is a parametric income insurance platform for Q-commerce delivery partners.

The system runs a 5-stage algorithm:

1. Disruption detection  
2. Eligibility verification  
3. AI-based loss calculation  
4. Fraud detection  
5. Automatic payout  


## Architecture Diagram

![Architecture diagram-1](https://github.com/user-attachments/assets/ad0fdc60-2d62-4f84-b873-aa8ac50ce7d6)

## Flow Diagram
<img width="1091" height="923" alt="image" src="https://github.com/user-attachments/assets/2f709998-ecbf-4cae-af7b-28de01ec3201" />

## Core Design Principle: Multi-Signal Validation

QProtect does not rely on a single trigger.

A payout is approved only when:

External signal confirms disruption  
AND  
Impact signal confirms income loss  

This prevents false positives and fraud.

### Signal Categories

External Signals:
- Weather API (rain, heat)
- AQI API
- Platform dispatch status
- Civic alerts

Impact Signals:
- GPS halt ratio
- Delivery time deviation
- Crowdsourced reports
- Income gap

A disruption is confirmed only when:
- ≥1 external signal  
- ≥2 impact signals  

## AI as the Core Decision Engine

### Model 1: Disruption Impact Model

Inputs:
- Weather severity
- Traffic slowdown
- Demand deviation
- Historical patterns

Output:
- Impact Score (0–100)

### Model 2: Income Prediction Model

Inputs:
- Worker earnings history
- Time of day
- Zone demand trends

Output:
- Expected earnings during disruption

### Model 3: Fraud Detection Model

Uses Isolation Forest.

Inputs:
- Worker behavior
- Claim timing
- Peer comparison

Output:
- Fraud probability score

## Model Flow

Disruption detected  
→ Impact Score (Model 1)  
→ Income Loss (Model 2)  
→ Fraud Score (Model 3)  
→ Decision  

## Insurance Model: Weekly Opt-In

- Weekly subscription  
- Auto-renew via UPI  
- Pause anytime  

Smart nudge:
Workers are alerted when high-risk weeks are predicted.

## Income Baseline: Rolling 3-Week Average

weekly_target = average(last 3 weeks)

Example:
- Week 1: ₹1,100  
- Week 2: ₹1,300  
- Week 3: ₹1,200  

Baseline: ₹1,200  

## Remaining Earning Capacity Logic

remaining_capacity = weekly_target - earnings_so_far

- If > 0 → payout scales  
- If ≤ 0 → reduced payout (not zero)

## The 5-Stage Algorithm

## 5-Stage Algorithm

| Stage | Name                     | Description |
|------|--------------------------|------------|
| 1 | Disruption Detection | External APIs (weather, AQI, platform, civic) are monitored. If at least one external signal is triggered, impact signals (GPS halt, delivery slowdown, reports) are validated. |
| 2 | Eligibility Check | Verifies active policy, recent activity, zone match, rolling baseline, and minimum disruption duration. Only eligible workers proceed. |
| 3 | AI Score Calculation | Runs all three models: Impact Model (severity score), Income Model (expected loss), and Fraud Model (risk score). |
| 4 | Fraud Validation (CBE) | Collective Behavior Engine validates zone-wide signals like GPS halt ratio, delivery deviation, and crowd reports to prevent fraud. |
| 5 | Payout Release | Approved payouts are credited via UPI, notifications are sent, and dashboards are updated with full audit logs. |


## UI Preview

### Home Screen
![screen1_home](https://github.com/user-attachments/assets/a35fb588-e094-47fe-b00c-daa8aeedd46d)


### Coverage Screen
![screen2_coverage](https://github.com/user-attachments/assets/66e65c7b-3226-4c87-b975-02a8e28ed248)


### Earnings Dashboard
![screen3_earnings](https://github.com/user-attachments/assets/c2f82623-dc06-4d5a-b79d-f6c5be0c6423)


### Payout Screen
![screen4_payouts](https://github.com/user-attachments/assets/3bf15f2f-aa03-46cb-a270-a32d6e5f5507)

### Profile 
![screen5_profile](https://github.com/user-attachments/assets/8f5ebdac-3f3f-47ea-9bcc-9ca41a685a0c)

## Weekly Premium Model

| Plan     | Premium | Max Payout | Coverage |
|----------|--------|------------|---------|
| Basic    | ₹20    | ₹200       | Rain, heat |
| Standard | ₹35    | ₹400       | + AQI, store pause |
| Premium  | ₹50    | ₹600       | All triggers |

Dynamic pricing using Random Forest.

## Mobile App

- React Native
- GPS tracking
- Push notifications
- UPI integration

## Dashboards

Worker:
- Risk level
- Coverage status
- Earnings vs baseline
- Payout history

Admin:
- Live disruption map
- AI outputs
- Fraud flags
- Analytics

  ## Tech Stack Tentative 

| Layer | Technology | Purpose |
|------|------------|--------|
| Mobile App | React Native | Cross-platform mobile application (iOS & Android) |
| Backend | Flask (Python) | API handling and business logic |
| Database | PostgreSQL | Structured data storage |
| AI - Impact Model | Gradient Boosting (scikit-learn) | Calculates disruption severity |
| AI - Income Model | Random Forest (scikit-learn) | Predicts expected income loss |
| AI - Fraud Model | Isolation Forest (scikit-learn) | Detects anomalous behavior |
| External APIs | OpenWeatherMap, CPCB AQI | Real-time disruption signals |
| Platform API | Mock REST API | Dark store dispatch status |
| Notifications | Firebase Cloud Messaging | Push notifications |
| Payments | Razorpay (UPI) | Automated payout processing |
| Admin Dashboard | React + Tailwind CSS | Monitoring and analytics |
| Hosting | Render / Railway | Deployment and hosting |

## Development Plan

### Phase 1
Completed

### Phase 2
Core build

### Phase 3
Advanced features + demo

## Compliance

- Income-loss only  
- Weekly premium model  
- Parametric payouts  
- AI-driven fraud detection  


<p align="center">
  <b>QProtect</b><br/>
  When signals align, your income is protected.
</p>

