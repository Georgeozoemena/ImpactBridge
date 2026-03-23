# ImpactBridge Backend

Turn payments into impact for health causes.

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Create your environment file

Copy `.env.example` to `.env` and fill the values:

- `MONGO_URI`
- `JWT_SECRET`
- `INTERSWITCH_PRODUCT_ID`
- `INTERSWITCH_MAC_KEY`

3. Run the server

```bash
npm run dev
```

Health check: `GET /health`

## Seed Demo Data

This resets collections and inserts demo users, a campaign, and donations:

```bash
npm run seed
```

## Environment Variables

See `.env.example` for all variables. Key notes:

- `INTERSWITCH_STUB=true` skips live verification and returns success for demo.
- `INTERSWITCH_BASE_URL` defaults to the Interswitch sandbox.

## Core Endpoints

Authentication

- `POST /api/beneficiary/register`
- `POST /api/donor/register`
- `POST /api/auth/login`

Campaigns

- `POST /api/campaign/create` (beneficiary only)
- `GET /api/campaign` (query params: `status`, `sort`)
- `GET /api/campaign/:id`
- `GET /api/campaign/:id/progress`
- `GET /api/campaign/:id/recent-donations`
- `PATCH /api/campaign/:id/status` (beneficiary only)

Donations

- `POST /api/donation/process`
- `GET /api/donation/receipt/:donationId`

Admin

- `GET /api/users`
- `GET /api/campaigns/all`

## Interswitch Verification

The donation endpoint expects a `transactionReference` unless `INTERSWITCH_STUB=true`.
Verification uses the WebPAY `gettransaction.json` endpoint with SHA-512 hash:

```
hash = SHA512(productId + transactionReference + macKey)
```

## Socket.IO Events

Client joins a campaign room:

- `joinCampaign` with `campaignId`
- `leaveCampaign` with `campaignId`

Events emitted by server:

- `campaignProgress` `{ campaignId, raisedAmount, targetAmount, donorCount, percentComplete }`
- `donationReceived` `{ donorName, amount, date }`

## Sample cURL

Register beneficiary

```bash
curl -X POST http://localhost:4000/api/beneficiary/register \
  -H "Content-Type: application/json" \
  -d '{"name":"LUTH","email":"hospital@example.com","password":"password123","phone":"+2348012345678"}'
```

Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hospital@example.com","password":"password123"}'
```

Create campaign (beneficiary only)

```bash
curl -X POST http://localhost:4000/api/campaign/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"title":"Kidney Surgery Fund","description":"Help save Emeka’s life","targetAmount":500000,"deadline":"2026-04-30"}'
```

Process donation

```bash
curl -X POST http://localhost:4000/api/donation/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"campaignId":"<CAMPAIGN_ID>","amount":5000,"donorName":"Ayo","transactionReference":"<TX_REF>"}'
```

## Demo Flow

1. Register beneficiary
2. Create campaign
3. Donor registers and makes donation
4. Campaign progress updates
5. Download PDF receipt
