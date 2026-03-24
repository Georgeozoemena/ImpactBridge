const request = require("supertest");

jest.mock("../src/models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  find: jest.fn()
}));

jest.mock("../src/models/Campaign", () => ({
  create: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn()
}));

jest.mock("../src/models/Donation", () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn()
}));

jest.mock("../src/services/interswitch", () => ({
  verifyPayment: jest.fn(),
  buildPaymentRequest: jest.fn()
}));

jest.mock("../src/middleware/auth", () => (req, _res, next) => {
  req.user = { _id: "user123", role: "beneficiary", name: "Ayo", email: "ayo@example.com" };
  next();
});

jest.mock("../src/middleware/role", () => () => (_req, _res, next) => next());

const User = require("../src/models/User");
const Campaign = require("../src/models/Campaign");
const Donation = require("../src/models/Donation");
const { verifyPayment, buildPaymentRequest } = require("../src/services/interswitch");

const app = require("../src/app");

const validId = "507f1f77bcf86cd799439011";

describe("API routes (no DB)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ADMIN_SETUP_SECRET = "secret";
    process.env.JWT_SECRET = "testsecret";
  });

  it("registers a beneficiary", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: "u1", name: "LUTH", email: "hospital@example.com", role: "beneficiary" });

    const res = await request(app).post("/api/beneficiary/register").send({
      name: "LUTH",
      email: "hospital@example.com",
      password: "password123",
      phone: "+2348012345678"
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("registers a donor", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: "u2", name: "Ayo", email: "ayo@example.com", role: "donor" });

    const res = await request(app).post("/api/donor/register").send({
      name: "Ayo",
      email: "ayo@example.com",
      password: "pass123"
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("logs in a user", async () => {
    User.findOne.mockResolvedValue({
      _id: "u2",
      name: "Ayo",
      email: "ayo@example.com",
      role: "donor",
      comparePassword: jest.fn().mockResolvedValue(true)
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "ayo@example.com",
      password: "pass123"
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it("creates a campaign", async () => {
    Campaign.create.mockResolvedValue({
      _id: "c1",
      title: "Kidney Surgery Fund",
      targetAmount: 500000,
      raisedAmount: 0,
      donorCount: 0
    });

    const res = await request(app).post("/api/campaign/create").send({
      title: "Kidney Surgery Fund",
      description: "Help save Emeka’s life",
      targetAmount: 500000,
      deadline: "2026-04-30"
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("gets campaign details", async () => {
    Campaign.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        _id: validId,
        title: "Kidney Surgery Fund",
        targetAmount: 500000,
        raisedAmount: 200000,
        donorCount: 15
      })
    });
    Donation.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue([
              { donorName: "Ayo", amount: 2000, createdAt: new Date() }
            ])
          })
        })
      })
    });

    const res = await request(app).get(`/api/campaign/${validId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("lists campaigns", async () => {
    Campaign.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue([
            { _id: "c1", title: "Kidney Surgery Fund", raisedAmount: 200000, targetAmount: 500000, donorCount: 15 }
          ])
        })
      })
    });

    const res = await request(app).get("/api/campaign");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("gets campaign progress", async () => {
    Campaign.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        _id: validId,
        targetAmount: 500000,
        raisedAmount: 200000,
        donorCount: 15
      })
    });

    const res = await request(app).get(`/api/campaign/${validId}/progress`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("gets recent donations", async () => {
    Donation.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue([
              { donorName: "Ayo", amount: 5000, createdAt: new Date() }
            ])
          })
        })
      })
    });

    const res = await request(app).get(`/api/campaign/${validId}/recent-donations`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("updates campaign status", async () => {
    Campaign.findByIdAndUpdate.mockResolvedValue({ _id: validId, status: "inactive" });

    const res = await request(app).patch(`/api/campaign/${validId}/status`).send({ status: "inactive" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("initiates donation", async () => {
    Campaign.findById.mockResolvedValue({ _id: validId, title: "Kidney Surgery Fund" });
    Donation.create.mockResolvedValue({ _id: "d1" });
    buildPaymentRequest.mockReturnValue({
      paymentUrl: "https://example.com/pay",
      fields: { txn_ref: "IB-123" }
    });

    const res = await request(app).post("/api/donation/initiate").send({
      campaignId: validId,
      amount: 5000,
      donorName: "Ayo",
      donorEmail: "ayo@example.com"
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("processes donation", async () => {
    Campaign.findById.mockResolvedValue({
      _id: validId,
      targetAmount: 500000,
      raisedAmount: 200000,
      donorCount: 15,
      save: jest.fn()
    });
    Donation.create.mockResolvedValue({
      _id: "d2",
      campaignId: validId,
      amount: 5000,
      donorName: "Ayo",
      createdAt: new Date(),
      save: jest.fn()
    });
    verifyPayment.mockResolvedValue({ verified: true, responseCode: "00", transactionRef: "IB-123", paidAt: new Date() });

    const res = await request(app).post("/api/donation/process").send({
      campaignId: validId,
      amount: 5000,
      donorName: "Ayo",
      transactionReference: "IB-123"
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("gets donation receipt", async () => {
    Donation.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        _id: "d1",
        campaignId: validId,
        donorName: "Ayo",
        amount: 5000,
        transactionRef: "IB-123",
        createdAt: new Date()
      })
    });
    Campaign.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: validId, title: "Kidney Surgery Fund" })
    });

    const res = await request(app).get(`/api/donation/receipt/${validId}`);
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("application/pdf");
  });

  it("creates admin with secret", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: "a1", name: "Admin", email: "admin@impactbridge.io", role: "admin" });

    const res = await request(app)
      .post("/api/admin/create")
      .set("x-admin-secret", "secret")
      .send({ name: "Admin", email: "admin@impactbridge.io", password: "admin123" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("lists users (admin route)", async () => {
    User.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([{ _id: "u1", name: "Ayo" }])
      })
    });
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("lists all campaigns (admin route)", async () => {
    Campaign.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue([{ _id: "c1", title: "Kidney Surgery Fund" }])
      })
    });
    const res = await request(app).get("/api/campaigns/all");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
