import Razorpay from 'razorpay';

function parseBody(body) {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(401).json({
      error: 'Razorpay API credentials are not configured on the server.'
    });
  }

  const { amount, currency = 'INR', receipt } = parseBody(req.body);
  const amountInPaise = Math.round(Number(amount));

  if (!Number.isFinite(amountInPaise) || amountInPaise < 100) {
    return res.status(400).json({
      error: 'Invalid order amount. Minimum amount is 100 paise (₹1).'
    });
  }

  const safeReceipt = String(receipt || `moj_${Date.now()}`).slice(0, 40);

  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: String(currency || 'INR').toUpperCase(),
      receipt: safeReceipt
    });

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    });
  } catch (err) {
    const status = err?.statusCode === 401 ? 401 : err?.statusCode === 400 ? 400 : 500;
    const message =
      err?.error?.description ||
      err?.message ||
      'Unable to create Razorpay order. Please try again.';

    return res.status(status).json({ error: message });
  }
}
