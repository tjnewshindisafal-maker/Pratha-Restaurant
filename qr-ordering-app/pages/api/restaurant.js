const prisma = require('../../lib/prisma');
const { requireStaff } = require('../../lib/auth');

const RESTAURANT_ID = 'pratha-main';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const restaurant = await prisma.restaurant.findUnique({ where: { id: RESTAURANT_ID } });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found. Run the seed script.' });
    return res.status(200).json(restaurant);
  }

  if (req.method === 'PATCH') {
    const staff = requireStaff(req, res);
    if (!staff) return;

    const { isOpen } = req.body || {};
    const restaurant = await prisma.restaurant.update({
      where: { id: RESTAURANT_ID },
      data: { isOpen: Boolean(isOpen) },
    });
    return res.status(200).json(restaurant);
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
