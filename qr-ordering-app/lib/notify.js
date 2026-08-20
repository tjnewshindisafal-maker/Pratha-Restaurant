/**
 * WhatsApp / SMS notifications via Twilio.
 * If Twilio env vars are not set, this falls back to logging the message to the
 * console so the rest of the app keeps working without a Twilio account.
 */
function isTwilioConfigured() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM
  );
}

async function sendWhatsAppMessage(toNumber, body) {
  if (!toNumber) return;

  if (!isTwilioConfigured()) {
    console.log(`[notify:mock] WhatsApp to ${toNumber}: ${body}`);
    return;
  }

  const twilio = require('twilio');
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  await client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
    to: `whatsapp:${toNumber}`,
    body,
  });
}

async function notifyOwnerNewOrder(order, restaurant) {
  const items = JSON.parse(order.items);
  const itemLines = items.map((i) => `${i.qty} x ${i.name}`).join(', ');
  const body =
    `New order #${order.id.slice(-6).toUpperCase()} for ${restaurant.name}\n` +
    `Customer: ${order.customerName} (${order.customerPhone})\n` +
    `Items: ${itemLines}\n` +
    `Total: Rs. ${order.totalAmount}\n` +
    `Address: ${order.deliveryAddress}`;

  await sendWhatsAppMessage(restaurant.whatsappNumber, body);
}

async function notifyCustomerOutForDelivery(order) {
  const body =
    `Your Pratha Restaurant order #${order.id.slice(-6).toUpperCase()} is out for delivery! ` +
    `Estimated arrival: 15-20 minutes.`;

  await sendWhatsAppMessage(order.customerPhone, body);
}

module.exports = { isTwilioConfigured, sendWhatsAppMessage, notifyOwnerNewOrder, notifyCustomerOutForDelivery };
