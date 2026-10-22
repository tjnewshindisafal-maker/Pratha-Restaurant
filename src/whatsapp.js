const crypto = require('node:crypto');

const GRAPH_URL = process.env.WA_GRAPH_URL || 'https://graph.facebook.com/v21.0';

// Sends a message through the WhatsApp Cloud API. A workspace without
// credentials runs in simulation mode so the product can be tried end to end.
async function sendMessage(workspace, to, payload) {
  if (!workspace.phone_number_id || !workspace.access_token) {
    return { id: `sim_${crypto.randomUUID()}`, simulated: true };
  }
  const res = await fetch(`${GRAPH_URL}/${workspace.phone_number_id}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${workspace.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, ...payload }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error?.message || `WhatsApp API error ${res.status}`);
  }
  return { id: data.messages?.[0]?.id, simulated: false };
}

function textPayload(body) {
  return { type: 'text', text: { body, preview_url: false } };
}

function templatePayload(name, lang) {
  return { type: 'template', template: { name, language: { code: lang || 'en' } } };
}

function verifySignature(appSecret, rawBody, header) {
  if (!appSecret) return true;
  if (!header || !rawBody) return false;
  const expected = 'sha256=' + crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(header);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Pulls the readable text out of any inbound message type we care about.
function extractText(msg) {
  switch (msg.type) {
    case 'text': return msg.text?.body || '';
    case 'button': return msg.button?.text || '';
    case 'interactive':
      return msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || '';
    default: return `[${msg.type}]`;
  }
}

module.exports = { sendMessage, textPayload, templatePayload, verifySignature, extractText };
