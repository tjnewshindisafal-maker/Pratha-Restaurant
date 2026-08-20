const QRCode = require('qrcode');

export default async function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://${req.headers.host}`;
  const targetUrl = `${baseUrl}/`;

  const buffer = await QRCode.toBuffer(targetUrl, {
    type: 'png',
    width: 600,
    margin: 2,
    color: { dark: '#4a0d18', light: '#fdf8f0' },
  });

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Content-Disposition', 'inline; filename="pratha-order-qr.png"');
  return res.status(200).send(buffer);
}
