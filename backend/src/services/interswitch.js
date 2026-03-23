const https = require("https");
const crypto = require("crypto");
const { URL } = require("url");

const buildHash = ({ productId, transactionReference, macKey }) => {
  const raw = `${productId}${transactionReference}${macKey}`;
  return crypto.createHash("sha512").update(raw).digest("hex").toUpperCase();
};

const buildPaymentHash = ({
  transactionReference,
  productId,
  payItemId,
  amountKobo,
  siteRedirectUrl,
  macKey
}) => {
  const raw = `${transactionReference}${productId}${payItemId}${amountKobo}${siteRedirectUrl}${macKey}`;
  return crypto.createHash("sha512").update(raw).digest("hex").toUpperCase();
};

const buildPaymentRequest = ({
  amountKobo,
  transactionReference,
  customerId,
  redirectUrl
}) => {
  const productId = process.env.INTERSWITCH_PRODUCT_ID;
  const payItemId = process.env.INTERSWITCH_PAY_ITEM_ID;
  const macKey = process.env.INTERSWITCH_MAC_KEY;
  const paymentUrl =
    process.env.INTERSWITCH_PAYMENT_URL ||
    "https://sandbox.interswitchng.com/collections/w/pay";
  const currency = process.env.INTERSWITCH_CURRENCY || "566";
  const siteRedirectUrl = redirectUrl || process.env.INTERSWITCH_REDIRECT_URL;

  if (!productId || !payItemId || !macKey || !siteRedirectUrl) {
    throw new Error("Interswitch payment config missing");
  }

  const hash = buildPaymentHash({
    transactionReference,
    productId,
    payItemId,
    amountKobo,
    siteRedirectUrl,
    macKey
  });

  return {
    paymentUrl,
    fields: {
      product_id: productId,
      pay_item_id: payItemId,
      amount: String(amountKobo),
      currency,
      site_redirect_url: siteRedirectUrl,
      txn_ref: transactionReference,
      cust_id: customerId || "",
      hash
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
  productId = process.env.INTERSWITCH_PRODUCT_ID,
  macKey = process.env.INTERSWITCH_MAC_KEY,
  baseUrl = process.env.INTERSWITCH_BASE_URL || "https://sandbox.interswitchng.com"
}) => {
  if (process.env.INTERSWITCH_STUB === "true") {
    return {
      verified: true,
      responseCode: "00",
      transactionRef: transactionReference,
      paidAt: new Date()
    };
  }

  if (!transactionReference || !amountKobo || !productId || !macKey) {
    throw new Error("Interswitch config missing or invalid request payload");
  }

  const endpoint = new URL("/webpay/api/v1/gettransaction.json", baseUrl);
  endpoint.searchParams.set("productid", productId);
  endpoint.searchParams.set("transactionreference", transactionReference);
  endpoint.searchParams.set("amount", String(amountKobo));

  const hash = buildHash({ productId, transactionReference, macKey });
  const { data } = await getJson(endpoint.toString(), { Hash: hash });

  const responseCode =
    data.ResponseCode || data.responseCode || data.responsecode || data.code || "";

  return {
    verified: responseCode === "00",
    responseCode,
    transactionRef: transactionReference,
    paidAt: new Date()
  };
};

module.exports = { verifyPayment, buildPaymentRequest };
