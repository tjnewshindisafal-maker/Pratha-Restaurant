const prisma = require('../../../lib/prisma');
const { requireStaff } = require('../../../lib/auth');

const RESTAURANT_ID = 'pratha-main';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const items = await prisma.menuItem.findMany({
      where: { restaurantId: RESTAURANT_ID },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
    return res.status(200).json(items);
  }

  if (req.method === 'POST') {
    const staff = requireStaff(req, res);
    if (!staff) return;

    const { name, description, price, category, isVeg, imageUrl } = req.body || {};
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'name, price, and category are required' });
    }

    const item = await prisma.menuItem.create({
      data: {
        restaurantId: RESTAURANT_ID,
        name,
        description: description || '',
        price: parseFloat(price),
        category,
        isVeg: Boolean(isVeg),
        imageUrl: imageUrl || null,
      },
    });
    return res.status(201).json(item);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
