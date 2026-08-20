const { getStaffFromRequest } = require('../../../lib/auth');

export default async function handler(req, res) {
  const staff = getStaffFromRequest(req);
  if (!staff) return res.status(401).json({ error: 'Not authenticated' });
  return res.status(200).json(staff);
}
