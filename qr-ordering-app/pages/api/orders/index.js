const prisma = require('../../../lib/prisma');
const { requireStaff } = require('../../../lib/auth');
const { haversineDistanceKm } = require('../../../lib/distance');
const { notifyOwnerNewOrder } = require('../../../lib/notify');
const { isRazorpayConfigured, getRazorpayClient } = require('../../../lib/razorpay');

const RESTAURANT_ID = 'pratha-main';
const PHONE_REGEX = /^[0-9]{10}$/;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const staff = requireStaff(req, res);
    if (!staff) return;

    const orders = await prisma.order.findMany({
      where: { restaurantId: RESTAURANT_ID },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return res.status(200).json(orders.map(serializeOrder));
  }

  if (req.method === 'POST') {
    return createOrder(req, res);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}

function serializeOrder(order) {
  return { ...order, items: JSON.parse(order.items) };
}

async function createOrder(req, res) {
  const {
    customerName,
    customerPhone,
    deliveryAddress,
    landmark,
    customerLat,
    customerLng,
    items,
    paymentMode,
  } = req.body || {};

  if (!customerName || !customerName.trim()) {
    return res.status(400).json({ error: 'Customer name is required' });
  }
  if (!PHONE_REGEX.test(customerPhone || '')) {
    return res.status(400).json({ error: 'Enter a valid 10-digit phone number' });
  }
  if (!deliveryAddress || !deliveryAddress.trim()) {
    return res.status(400).json({ error: 'Delivery address is required' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  if (!['online', 'cod'].includes(paymentMode)) {
    return res.status(400).json({ error: 'Invalid payment mode' });
  }

  const restaurant = await prisma.restaurant.findUnique({ where: { id: RESTAURANT_ID } });
  if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
  if (!restaurant.isOpen) return res.status(400).json({ error: 'Restaurant is currently closed' });

  let distanceKm = null;
  if (typeof customerLat === 'number' && typeof customerLng === 'number') {
    distanceKm = haversineDistanceKm(restaurant.lat, restaurant.lng, customerLat, customerLng);
    if (distanceKm > restaurant.deliveryRadiusKm) {
      return res.status(400).json({
        error: `Sorry, you're ${distanceKm.toFixed(1)} km away. We currently deliver within ${restaurant.deliveryRadiusKm} km only.`,
      });
    }
  }

  // Re-price server-side from the DB — never trust prices sent by the client.
  const menuItemIds = items.map((i) => i.itemId);
  const menuItems = await prisma.menuItem.findMany({ where: { id: { in: menuItemIds } } });
  const menuItemsById = Object.fromEntries(menuItems.map((m) => [m.id, m]));

  const orderItems = [];
  let totalAmount = 0;

  for (const line of items) {
    const menuItem = menuItemsById[line.itemId];
    const qty = Math.max(1, parseInt(line.qty, 10) || 1);
    if (!menuItem) {
      return res.status(400).json({ error: `Menu item not found: ${line.itemId}` });
    }
    if (!menuItem.isAvailable) {
      return res.status(400).json({ error: `${menuItem.name} is sold out today` });
    }
    orderItems.push({ item_id: menuItem.id, name: menuItem.name, qty, price: menuItem.price });
    totalAmount += menuItem.price * qty;
  }

  const order = await prisma.order.create({
    data: {
      restaurantId: restaurant.id,
      customerName: customerName.trim(),
      customerPhone,
      deliveryAddress: deliveryAddress.trim(),
      landmark: landmark || null,
      customerLat: customerLat ?? null,
      customerLng: customerLng ?? null,
      distanceKm,
      items: JSON.stringify(orderItems),
      totalAmount,
      paymentMode,
      paymentStatus: 'pending',
      orderStatus: 'new',
    },
  });

  notifyOwnerNewOrder(order, restaurant).catch((err) => console.error('notifyOwnerNewOrder failed:', err));

  let razorpay = null;
  if (paymentMode === 'online') {
    if (!isRazorpayConfigured()) {
      return res.status(200).json({
        order: serializeOrder(order),
        razorpay: null,
        warning: 'Online payment is not configured yet. Please choose Cash on Delivery, or contact the restaurant.',
      });
    }
    const client = getRazorpayClient();
    const rpOrder = await client.orders.create({
      amount: Math.round(totalAmount * 100), // paise
      currency: 'INR',
      receipt: order.id,
    });
    await prisma.order.update({ where: { id: order.id }, data: { razorpayOrderId: rpOrder.id } });
    razorpay = { keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, orderId: rpOrder.id, amount: rpOrder.amount, currency: rpOrder.currency };
  }

  return res.status(201).json({ order: serializeOrder(order), razorpay });
}
