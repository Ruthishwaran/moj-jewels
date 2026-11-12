import crypto from 'node:crypto';

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
    return res.status(405).json({ verified: false, error: 'Method Not Allowed. Use POST.' });
  }

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = parseBody(req.body);

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({
      verified: false,
      error: 'Missing required fields: razorpay_payment_id, razorpay_order_id, or razorpay_signature.'
    });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(401).json({
      verified: false,
      error: 'Razorpay secret key is not configured on the server.'
    });
  }

  try {
    const payload = `${String(razorpay_order_id).trim()}|${String(razorpay_payment_id).trim()}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    const receivedBuf = Buffer.from(String(razorpay_signature).trim(), 'utf8');
    const expectedBuf = Buffer.from(expectedSignature, 'utf8');

    const isMatch =
      receivedBuf.length === expectedBuf.length &&
      crypto.timingSafeEqual(receivedBuf, expectedBuf);

    if (!isMatch) {
      return res.status(400).json({
        verified: false,
        error: 'Payment signature verification failed. Order cannot be marked as paid.'
      });
    }

    return res.status(200).json({
      verified: true,
      razorpay_order_id,
      razorpay_payment_id
    });
  } catch (err) {
    return res.status(500).json({
      verified: false,
      error: err?.message || 'Internal error verifying Razorpay signature.'
    });
  }
}
