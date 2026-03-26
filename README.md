# 🏥 ImpactBridge

**Tagline:** Turn Payments Into Impact for Health Causes

### “Turning desperate pleas into verified victories.”

## The Crisis We’re Solving
In Nigeria, medical emergencies often trigger a second crisis: **trust**.  
Families share bank account numbers on social media and hope strangers will believe them.  
Donors want to help, but the system gives them no proof, no progress, and no accountability.

That gap costs lives.

## Project Statement
ImpactBridge is a **trust layer** for medical crowdfunding.  
We transform chaotic bank transfers into **verified, goal‑tracked campaigns** powered by Interswitch payments—so every donor sees where their money went, and every beneficiary sees progress in real time.

## Who This Serves
- **Patients & Families** who need urgent care and transparent fundraising
- **Hospitals** that want clean reconciliation and reliable payment trails
- **Donors** who demand verified impact, not blind transfers
- **Communities** that rally around real‑time progress and accountability

## Why This Matters
Bank transfers move money. **ImpactBridge moves confidence.**
- **Verified transparency:** every donation is logged in real time.
- **Goal visibility:** progress bars show exactly how close a patient is to care.
- **Institution‑grade receipts:** PDF receipts tied to campaign + transaction.
- **Real‑time momentum:** live donation feed increases urgency and trust.

## What We Built (MVP)
- Beneficiary registration and campaign creation
- Donor payments via Interswitch Quickteller Web Checkout
- Beneficiary dashboard: progress, totals, donor count
- Donor dashboard: contribution status and campaign progress
- Real‑time updates (Socket.IO)
- Downloadable PDF receipts

## Key Experience Moments
- A donor watches the progress bar move **seconds** after their payment
- A beneficiary sees donor count rise in real time
- A verified PDF receipt builds confidence and encourages sharing
- A simple dashboard replaces chaotic bank alerts

## Demo Flow
1. Beneficiary creates a campaign
2. Donor pays via Interswitch checkout
3. Backend verifies the transaction
4. Dashboard updates in real time
5. Donor downloads PDF receipt

## Proof It Works (Sandbox)
Interswitch integration is live and verified:
- Checkout loads successfully
- Callback returns `resp: "00"`
- Requery confirms `responseCode: "00"`

## Payment Verification (How Trust Is Enforced)
- **Step 1:** Donor completes Quickteller Web Checkout
- **Step 2:** Interswitch callback returns `resp: 00`
- **Step 3:** Backend performs a **server‑side requery**
- **Step 4:** Only verified payments update campaign totals

## Live Demo
Backend base URL:
```text
https://impactbridge-rvzp.onrender.com
```

Health check:
```text
https://impactbridge-rvzp.onrender.com/health
```

## Technical Architecture
- **Frontend:** Donor + Beneficiary dashboards
- **Backend:** Node.js + Express API
- **Payments:** Interswitch Quickteller Web Checkout + server‑side requery
- **Realtime:** Socket.IO
- **Storage:** MongoDB
- **Receipts:** PDF generation with PDFKit

## Data Model (Simplified)
- **User:** name, email, role (beneficiary/donor)
- **Campaign:** title, description, target, raised, donorCount, status
- **Donation:** campaignId, amount, donorName, status, transactionRef

## Repository Map
- `backend/` API, payments, sockets, receipts
- `frontend/` UI
- `render.yaml` Render deployment config

## For Judges (Fast Review)
1. API docs: `backend/README.md`
2. Postman collection: `backend/postman/ImpactBridge.postman_collection.json`

## Success Metrics (What We Track)
- % of verified payments vs total initiated
- Time‑to‑fund for urgent campaigns
- Donor repeat rate
- Average donation velocity (per hour)

## 72‑Hour Sprint (Executed)
**Day 1:** Backend + Interswitch integration  
**Day 2:** Frontend dashboards  
**Day 3:** Realtime updates, receipts, demo polish

## Security & Privacy
- JWT‑based auth for protected routes
- Server‑side payment verification
- No card data stored on our servers
- Minimal PII stored for receipts only

## Post‑Hackathon Roadmap
- Beneficiary verification (KYC)
- Donor analytics and milestone engagement
- Campaign storytelling and updates
- Fraud and anomaly detection
- Production Interswitch rollout

## How To Reproduce The Demo (Judges)
1. Register beneficiary
2. Create a campaign
3. Initiate a donation
4. Complete checkout
5. Verify payment and download receipt

## Contribution & Team Roles
- **Backend:** API, payment verification, sockets, receipts
- **Frontend:** UX, dashboards, campaign pages
- **Product:** story, flow, demo narrative

---

ImpactBridge is a **lifeline** for families in crisis — making giving **visible, verifiable, and goal‑driven**.
