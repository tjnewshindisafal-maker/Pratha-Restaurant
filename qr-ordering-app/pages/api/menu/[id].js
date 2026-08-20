const prisma = require('../../../lib/prisma');
const { requireStaff } = require('../../../lib/auth');

export default async function handler(req, res) {
  const staff = requireStaff(req, res);
  if (!staff) return;

  const { id } = req.query;

  if (req.method === 'PATCH') {
    const { name, description, price, category, isVeg, imageUrl, isAvailable } = req.body || {};
    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = parseFloat(price);
    if (category !== undefined) data.category = category;
    if (isVeg !== undefined) data.isVeg = Boolean(isVeg);
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (isAvailable !== undefined) data.isAvailable = Boolean(isAvailable);

    const item = await prisma.menuItem.update({ where: { id }, data });
    return res.status(200).json(item);
  }

  if (req.method === 'DELETE') {
    await prisma.menuItem.delete({ where: { id } });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['PATCH', 'DELETE']);
  return res.status(405).end(`Method ${req.method} not allowed`);
}
