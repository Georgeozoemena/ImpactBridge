# ImpactBridge

**Tagline:** Turn Payments Into Impact for Health Causes

## The Heart of the Problem
When a family is racing against time for life‑saving care, bank transfers don’t answer the questions that matter most:
**Did the money arrive? How close are we to the goal? Who else has helped?**

ImpactBridge exists to replace uncertainty with clarity.

## Project Statement
ImpactBridge is a transparent, goal‑based donation platform that routes payments through Interswitch and shows progress in real time. Donors see verified contributions, beneficiaries see momentum, and every naira is tied to a specific health outcome.

## Why It’s Different
Bank transfers move money. ImpactBridge moves **trust**.
- **Verified transparency:** every donation is logged in real time.
- **Goal‑driven impact:** visible progress bars motivate follow‑through.
- **Smart receipts:** PDF receipts linked to a specific campaign.
- **Momentum signals:** live updates and milestones increase urgency.
- **Accountability:** donors always know where their money went.

## What We Built (MVP)
- Beneficiary registration and campaign creation
- Donor payments via Interswitch Quickteller Web Checkout
- Beneficiary dashboard: progress, totals, donor count
- Donor dashboard: contribution status and campaign progress
- Real‑time updates (Socket.IO)
- Downloadable PDF receipts
- Optional milestone badges and activity feed

## Demo Flow
1. Beneficiary registers and launches a campaign
2. Donor pays via Interswitch checkout
3. Backend verifies and updates in real time
4. Dashboard reflects progress and recent donors
5. Donor downloads PDF receipt

## Live Demo
Backend base URL:
```text
https://impactbridge-rvzp.onrender.com
```

Health check:
```text
https://impactbridge-rvzp.onrender.com/health
```

## Proof It Works
Interswitch integration is live in sandbox:
- Checkout page loads successfully
- Callback returns `resp: "00"` (approved)
- Requery confirms `responseCode: "00"`

## Architecture (High Level)
- Frontend: Donor + Beneficiary dashboards
- Backend: Node.js + Express API
- Payments: Interswitch Quickteller Web Checkout
- Realtime: Socket.IO
- Storage: MongoDB
- Receipts: PDF generation

## Repository Map
- `backend/` API, payments, sockets, receipts
- `frontend/` UI
- `render.yaml` Render deployment config

## For Judges (Fast Review)
1. API docs: `backend/README.md`
2. Postman collection: `backend/postman/ImpactBridge.postman_collection.json`

## Build Timeline (Executed)
**Day 1:** Backend + Interswitch integration  
**Day 2:** Frontend dashboards  
**Day 3:** Realtime updates, receipts, demo polish

## Post‑Hackathon Roadmap
- Beneficiary KYC + verification
- Donor analytics and milestone engagement
- Campaign storytelling + updates
- Fraud and anomaly detection
- Production Interswitch rollout

---

ImpactBridge makes giving **visible, verifiable, and goal‑driven** — exactly what health funding needs.
