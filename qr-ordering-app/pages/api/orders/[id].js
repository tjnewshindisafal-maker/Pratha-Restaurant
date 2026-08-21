const prisma = require('../../../lib/prisma');
const { getStaffFromRequest } = require('../../../lib/auth');
const { notifyCustomerOutForDelivery } = require('../../../lib/notify');

const VALID_STATUSES = ['new', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const restaurant = await prisma.restaurant.findUnique({ where: { id: order.restaurantId } });

    // Public tracking view: only expose what a customer needs, not internal restaurant fields.
    const staff = getStaffFromRequest(req);
    const payload = {
      ...order,
      items: JSON.parse(order.items),
      restaurantLat: restaurant?.lat ?? null,
      restaurantLng: restaurant?.lng ?? null,
    };
    if (!staff) {
      delete payload.customerLat;
      delete payload.customerLng;
    }
    return res.status(200).json(payload);
  }

  if (req.method === 'PATCH') {
    const staff = getStaffFromRequest(req);
    if (!staff) return res.status(401).json({ error: 'Not authenticated' });

    const { orderStatus, paymentStatus, riderLat, riderLng } = req.body || {};
    const data = {};

    if (orderStatus !== undefined) {
      if (!VALID_STATUSES.includes(orderStatus)) {
        return res.status(400).json({ error: 'Invalid order status' });
      }
      data.orderStatus = orderStatus;
    }
    if (paymentStatus !== undefined) {
      if (!['pending', 'paid', 'failed'].includes(paymentStatus)) {
        return res.status(400).json({ error: 'Invalid payment status' });
      }
      data.paymentStatus = paymentStatus;
    }
    if (typeof riderLat === 'number' && typeof riderLng === 'number') {
      data.riderLat = riderLat;
      data.riderLng = riderLng;
      data.riderLocationAt = new Date();
    }
    // Cash-on-delivery orders are marked paid automatically once delivered.
    if (data.orderStatus === 'delivered') {
      const existing = await prisma.order.findUnique({ where: { id } });
      if (existing?.paymentMode === 'cod') data.paymentStatus = 'paid';
    }

    const order = await prisma.order.update({ where: { id }, data });

    if (data.orderStatus === 'out_for_delivery') {
      notifyCustomerOutForDelivery(order).catch((err) => console.error('notifyCustomerOutForDelivery failed:', err));
    }

    return res.status(200).json({ ...order, items: JSON.parse(order.items) });
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
