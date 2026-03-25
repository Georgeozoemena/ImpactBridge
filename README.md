# ImpactBridge

**Tagline:** Turn Payments Into Impact for Health Causes

## What It Is
ImpactBridge is a donation platform where beneficiaries (hospitals or patients) run goal‑based campaigns and donors contribute via Interswitch. The platform adds transparency, real‑time tracking, and verified receipts so every naira is tied to a real outcome.

## The Problem
Traditional bank transfers don’t provide:
- Transparent, verified donation logs
- Goal tracking with progress visibility
- Receipts tied to specific campaigns
- Real‑time updates that build urgency and trust

## Our Solution
ImpactBridge combines goal‑based fundraising with Interswitch payments to give donors confidence and beneficiaries a clear path to funding.

## Why This Beats Bank Transfers
- **Direct transparency:** Verified donations logged in real‑time
- **Goal tracking:** Progress bars motivate repeat giving
- **Smart receipts:** PDF receipts tied to a campaign and donor
- **Insights:** Forecasts and summaries build urgency
- **Milestones:** 50%, 75%, 100% badges for engagement

## MVP Features
- Beneficiary registration and campaign creation
- Donor payment via Interswitch sandbox
- Beneficiary dashboard: progress, totals, donor count
- Donor dashboard: contribution status, campaign progress
- Real‑time updates when payments hit the backend
- Downloadable PDF receipts
- Optional milestone badges and activity feed

## Demo Flow
1. Beneficiary registers and creates a campaign
2. Donor selects campaign and contributes via Interswitch
3. Payment hits backend and updates in real‑time
4. Dashboard shows progress and recent donations
5. Donor downloads PDF receipt
6. Optional: milestones unlock, feed updates

## Live Demo
Backend base URL:
```text
https://impactbridge-rvzp.onrender.com
```

Health check:
```text
https://impactbridge-rvzp.onrender.com/health
```

## Architecture (High Level)
- **Frontend:** Donor + Beneficiary dashboards
- **Backend:** Node.js + Express API
- **Payments:** Interswitch Quickteller Web Checkout
- **Realtime:** Socket.IO events for live updates
- **Storage:** MongoDB
- **Receipts:** PDF generation

## Proof of Interswitch Integration
- Live checkout page verified in sandbox
- Callback returns `resp: "00"`
- Requery verified with `responseCode: "00"`

## Repo Structure
- `backend/` API, payment integration, sockets, receipts
- `frontend/` UI (donor + beneficiary)
- `render.yaml` Render deployment config

## Quick Start (Judges)
1. Review backend API docs:
   - `backend/README.md`
2. Import Postman collection:
   - `backend/postman/ImpactBridge.postman_collection.json`

## 3‑Day Build Plan (Executed)
**Day 1:** Backend + Interswitch integration  
**Day 2:** Frontend dashboards  
**Day 3:** PDF receipts, real‑time updates, demo polish

## Roadmap (Post‑Hackathon)
- Beneficiary KYC and verification
- Donor analytics and milestones
- Campaign updates and storytelling
- Fraud monitoring and anomaly detection
- Production Interswitch integration

## Team
- Product, Engineering, Design (2‑4 members)

---

ImpactBridge exists to make giving transparent, goal‑driven, and trustworthy.
