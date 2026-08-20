const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'pratha_staff_token';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret';

function signStaffToken(staffUser) {
  return jwt.sign(
    { id: staffUser.id, email: staffUser.email, restaurantId: staffUser.restaurantId, role: staffUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function verifyStaffToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  return Object.fromEntries(
    header.split(';').filter(Boolean).map((pair) => {
      const [key, ...rest] = pair.trim().split('=');
      return [key, decodeURIComponent(rest.join('='))];
    })
  );
}

function getStaffFromRequest(req) {
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  return verifyStaffToken(token);
}

function requireStaff(req, res) {
  const staff = getStaffFromRequest(req);
  if (!staff) {
    res.status(401).json({ error: 'Not authenticated' });
    return null;
  }
  return staff;
}

module.exports = {
  COOKIE_NAME,
  signStaffToken,
  verifyStaffToken,
  getStaffFromRequest,
  requireStaff,
};
