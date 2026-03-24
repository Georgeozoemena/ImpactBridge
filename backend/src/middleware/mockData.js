const mockData = (req, res, next) => {
  if (process.env.SKIP_DB !== "true") {
    return next();
  }

  // Mock Campaigns
  if (req.path === "/api/campaign" && req.method === "GET") {
    return res.ok({
      campaigns: [
        {
          _id: "mock-1",
          title: "Clean Water for All",
          raisedAmount: 5000,
          targetAmount: 10000,
          donorCount: 25,
          status: "active"
        },
        {
          _id: "mock-2",
          title: "Education Support Fund",
          raisedAmount: 7500,
          targetAmount: 15000,
          donorCount: 40,
          status: "active"
        }
      ]
    });
  }

  // Mock Auth Login
  if (req.path === "/api/auth/login" && req.method === "POST") {
    return res.ok({
      token: "mock-jwt-token",
      user: {
        _id: "mock-user-1",
        name: "Mock User",
        email: req.body.email || "mock@example.com",
        role: "donor"
      }
    });
  }

  // Mock Registration
  if (req.path === "/api/beneficiary/register" && req.method === "POST") {
    return res.ok({
      token: "mock-jwt-token",
      user: {
        _id: "mock-beneficiary-1",
        name: req.body.name || "Mock Beneficiary",
        email: req.body.email || "mock-b@example.com",
        role: "beneficiary"
      }
    });
  }

  next();
};

module.exports = mockData;
