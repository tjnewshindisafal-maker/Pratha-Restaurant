const crypto = require('crypto');
const prisma = require('../../../lib/prisma');

// Razorpay signs the raw request body — Next's default JSON parser must be disabled
// so we can verify against the exact bytes Razorpay sent.
export const config = {
  api: { bodyParser: false },
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method not allowed');
  }

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('RAZORPAY_WEBHOOK_SECRET is not set — rejecting webhook');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  const rawBody = await readRawBody(req);
  const signature = req.headers['x-razorpay-signature'];
  const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  const event = JSON.parse(rawBody);

  if (event.event === 'payment.captured' || event.event === 'order.paid') {
    const rpOrderId = event.payload?.payment?.entity?.order_id;
    const paymentId = event.payload?.payment?.entity?.id;
    if (rpOrderId) {
      await prisma.order.updateMany({
        where: { razorpayOrderId: rpOrderId },
        data: { paymentStatus: 'paid', razorpayPaymentId: paymentId || undefined },
      });
    }
  }

  if (event.event === 'payment.failed') {
    const rpOrderId = event.payload?.payment?.entity?.order_id;
    if (rpOrderId) {
      await prisma.order.updateMany({
        where: { razorpayOrderId: rpOrderId },
        data: { paymentStatus: 'failed' },
      });
    }
  }

  return res.status(200).json({ received: true });
}
