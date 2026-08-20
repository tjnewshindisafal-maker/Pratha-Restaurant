const prisma = require('../../lib/prisma');
const { requireStaff } = require('../../lib/auth');

const RESTAURANT_ID = 'pratha-main';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method not allowed');
  }

  const staff = requireStaff(req, res);
  if (!staff) return;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todaysOrders = await prisma.order.findMany({
    where: {
      restaurantId: RESTAURANT_ID,
      createdAt: { gte: startOfDay },
      orderStatus: { not: 'cancelled' },
    },
  });

  const totalOrders = todaysOrders.length;
  const totalRevenue = todaysOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return res.status(200).json({
    totalOrders,
    totalRevenue,
    avgOrderValue: Math.round(avgOrderValue),
  });
}
