const https = require("https");
const crypto = require("crypto");
const { URL } = require("url");

const buildPaymentRequest = ({
  amountKobo,
  transactionReference,
  customerId,
  customerEmail,
  customerName,
  redirectUrl,
  payItemName
}) => {
  const merchantCode = process.env.INTERSWITCH_MERCHANT_CODE;
  const payItemId = process.env.INTERSWITCH_PAY_ITEM_ID;
  const paymentUrl =
    process.env.INTERSWITCH_PAYMENT_URL ||
    "https://newwebpay.qa.interswitchng.com/collections/w/pay";
  const currency = process.env.INTERSWITCH_CURRENCY || "566";
  const siteRedirectUrl = redirectUrl || process.env.INTERSWITCH_REDIRECT_URL;

  if (!merchantCode || !payItemId || !siteRedirectUrl || !customerEmail) {
    throw new Error("Interswitch payment config missing");
  }

  return {
    paymentUrl,
    fields: {
      merchant_code: merchantCode,
      pay_item_id: payItemId,
      amount: String(amountKobo),
      currency,
      site_redirect_url: siteRedirectUrl,
      txn_ref: transactionReference,
      cust_id: customerId || "",
      cust_name: customerName || "",
      cust_email: customerEmail,
      pay_item_name: payItemName || ""
    }
  };
};

const getJson = (url, headers = {}) =>
  new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: "GET",
        headers
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve({ status: res.statusCode, data: json });
          } catch (err) {
            reject(new Error("Failed to parse Interswitch response"));
          }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });

const verifyPayment = async ({
  transactionReference,
  amountKobo,
  merchantCode = process.env.INTERSWITCH_MERCHANT_CODE,
  baseUrl = process.env.INTERSWITCH_BASE_URL || "https://qa.interswitchng.com"
}) => {
  if (process.env.INTERSWITCH_STUB === "true") {
    return {
      verified: true,
      responseCode: "00",
      transactionRef: transactionReference,
      paidAt: new Date()
    };
  }

  if (!transactionReference || !amountKobo || !merchantCode) {
    throw new Error("Interswitch config missing or invalid request payload");
  }

  const makeRequest = async (amount) => {
    const endpoint = new URL("/collections/api/v1/gettransaction.json", baseUrl);
    endpoint.searchParams.set("merchantcode", merchantCode);
    endpoint.searchParams.set("transactionreference", transactionReference);
    endpoint.searchParams.set("amount", String(amount));
    const { data } = await getJson(endpoint.toString(), { "Content-Type": "application/json" });
    const responseCode =
      data.ResponseCode || data.responseCode || data.responsecode || data.code || "";
    return { data, responseCode };
  };

  // Quickteller sandbox expects amount in major units (naira), not kobo.
  const amountMajor = Math.round(amountKobo / 100);
  let result = await makeRequest(amountMajor);

  if (result.responseCode !== "00") {
    result = await makeRequest(amountKobo);
  }

  return {
    verified: result.responseCode === "00",
    responseCode: result.responseCode,
    transactionRef: transactionReference,
    paidAt: new Date()
  };
};

module.exports = { verifyPayment, buildPaymentRequest };
