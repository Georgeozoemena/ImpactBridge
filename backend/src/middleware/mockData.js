const mockData = (req, res, next) => {
  if (process.env.SKIP_DB !== "true") {
    return next();
  }

  // Common Mock Campaigns
  const mockCampaigns = [
    {
      _id: "mock-1",
      id: "mock-1",
      title: "Baby Aisha: Urgent Heart Surgery",
      description: "Baby Aisha was born with a congenital heart defect and needs urgent corrective surgery at the Lagos State University Teaching Hospital. Every donation helps cover the surgical costs and post-operative care.",
      raisedAmount: 320000,
      targetAmount: 2500000,
      donorCount: 124,
      status: "active",
      urgency: "Critical",
      imageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800"
    },
    {
      _id: "mock-2",
      id: "mock-2",
      title: "Clean Water for Ogbomosho",
      description: "Providing sustainable clean water solutions for the Ogbomosho community. We aim to install 5 solar-powered boreholes to prevent water-borne diseases.",
      raisedAmount: 850000,
      targetAmount: 5000000,
      donorCount: 215,
      status: "active",
      urgency: "High Priority",
      imageUrl: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800"
    },
    {
      _id: "mock-3",
      id: "mock-3",
      title: "Kidney Transplant Fund",
      description: "Support Mike's journey to a successful kidney transplant. The funds will cover the donor matching process, the transplant surgery, and the first year of anti-rejection medications.",
      raisedAmount: 4200000,
      targetAmount: 8000000,
      donorCount: 450,
      status: "active",
      urgency: "Critical",
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const path = req.path;
  const isCampaign = path === "/api/campaign" || path === "/campaign";
  const isCampaignMe = path === "/api/campaign/me" || path === "/campaign/me";
  const isCampaignDetail = (path.startsWith("/api/campaign/") || path.startsWith("/campaign/")) && !isCampaignMe;
  const isLogin = path === "/api/auth/login" || path === "/auth/login";
  const isRegister = path === "/api/auth/register" || path === "/auth/register" || path === "/api/beneficiary/register" || path === "/beneficiary/register";
  const isProcessDonation = path === "/api/donation/process" || path === "/donation/process";

  // GET campaigns
  if (isCampaign && req.method === "GET") {
    return res.ok({ campaigns: mockCampaigns });
  }

  // GET campaign detail
  if (isCampaignDetail && req.method === "GET") {
    const segments = path.split("/");
    const id = segments[segments.length - 1];
    const campaign = mockCampaigns.find(c => c._id === id || c.id === id) || mockCampaigns[1];
    return res.ok({ campaign });
  }

  // GET my campaign
  if (isCampaignMe && req.method === "GET") {
    return res.ok({ campaign: mockCampaigns[1] });
  }

  // POST login
  if (isLogin && req.method === "POST") {
    return res.ok({
      token: "mock-jwt-token",
      user: {
        _id: "mock-user-1",
        name: "Hackathon Judge",
        email: req.body.email || "judge@impactbridge.com",
        role: "beneficiary"
      }
    });
  }

  // POST register
  if (isRegister && req.method === "POST") {
    return res.ok({
      token: "mock-jwt-token",
      user: {
        _id: "mock-new-user",
        name: req.body.name || "New Beneficiary",
        email: req.body.email,
        role: req.body.role || "beneficiary"
      }
    });
  }

  // POST donation
  if (isProcessDonation && req.method === "POST") {
    return res.ok({
      message: "Donation processed successfully",
      donation: {
        _id: "mock-donation-" + Date.now(),
        campaignId: req.body.campaignId,
        amount: Number(req.body.amount),
        donorName: req.body.donorName || "Anonymous",
        createdAt: new Date()
      }
    });
  }

  next();

  next();
};

module.exports = mockData;
