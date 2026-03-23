const { v4: uuidv4 } = require("uuid");

const buildReference = () => `IB-${uuidv4()}`;

const verifyPayment = async (_payload) => {
  // TODO: Replace with real Interswitch verification call.
  // For sandbox demo, we simulate a verified payment.
  return {
    verified: true,
    transactionRef: buildReference(),
    paidAt: new Date()
  };
};

module.exports = { verifyPayment };
