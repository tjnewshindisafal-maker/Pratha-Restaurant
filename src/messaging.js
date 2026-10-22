const wa = require('./whatsapp');
const { sqlNow } = require('./db');

const PLANS = {
  free: { name: 'Free', price: 0, messages: 100, contacts: 100 },
  starter: { name: 'Starter', price: 999, messages: 2000, contacts: 2000 },
  growth: { name: 'Growth', price: 2499, messages: 10000, contacts: 10000 },
};

const OPT_OUT_WORDS = ['stop', 'unsubscribe'];
const OPT_IN_WORDS = ['start', 'subscribe'];

function planOf(workspace) {
  return PLANS[workspace.plan] || PLANS.free;
}

// Keeps digits only and adds the workspace country code to bare local numbers.
function normalizePhone(raw, countryCode = '91') {
  const digits = String(raw || '').replace(/\D/g, '').replace(/^0+/, '');
  if (digits.length < 8 || digits.length > 15) return null;
  return digits.length === 10 ? countryCode + digits : digits;
}

function messagesThisMonth(db, workspaceId) {
  const monthStart = sqlNow().slice(0, 7) + '-01 00:00:00';
  return db.prepare(
    "SELECT COUNT(*) AS n FROM messages WHERE workspace_id = ? AND direction = 'out' AND status NOT IN ('failed', 'simulated') AND created_at >= ?"
  ).get(workspaceId, monthStart).n;
}

function contactCount(db, workspaceId) {
  return db.prepare('SELECT COUNT(*) AS n FROM contacts WHERE workspace_id = ?').get(workspaceId).n;
}

function findOrCreateContact(db, workspace, phone, name) {
  let contact = db.prepare('SELECT * FROM contacts WHERE workspace_id = ? AND phone = ?').get(workspace.id, phone);
  if (contact) {
    if (name && !contact.name) {
      db.prepare('UPDATE contacts SET name = ? WHERE id = ?').run(name, contact.id);
      contact.name = name;
    }
    return { contact, created: false };
  }
  const { lastInsertRowid } = db.prepare(
    'INSERT INTO contacts (workspace_id, phone, name) VALUES (?, ?, ?)'
  ).run(workspace.id, phone, name || null);
  contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(lastInsertRowid);
  return { contact, created: true };
}

function createMessaging(db, sender = wa.sendMessage) {
  // Sends text or a template to one contact and records the outcome.
  async function send(workspace, contact, { text, template, lang }, source = 'manual') {
    const body = text || `[template: ${template}]`;
    let status = 'sent';
    let waId = null;
    let error = null;

    if (messagesThisMonth(db, workspace.id) >= planOf(workspace).messages) {
      status = 'failed';
      error = 'Monthly message limit reached for your plan';
    } else {
      try {
        const payload = template ? wa.templatePayload(template, lang) : wa.textPayload(text);
        const result = await sender(workspace, contact.phone, payload);
        waId = result.id || null;
        if (result.simulated) status = 'simulated';
      } catch (err) {
        status = 'failed';
        error = err.message;
      }
    }

    const { lastInsertRowid } = db.prepare(
      `INSERT INTO messages (workspace_id, contact_id, direction, body, source, status, wa_message_id, error)
       VALUES (?, ?, 'out', ?, ?, ?, ?, ?)`
    ).run(workspace.id, contact.id, body, source, status, waId, error);
    db.prepare("UPDATE contacts SET last_message_at = datetime('now') WHERE id = ?").run(contact.id);
    return db.prepare('SELECT * FROM messages WHERE id = ?').get(lastInsertRowid);
  }

  function matchRule(workspaceId, text) {
    const normalized = text.trim().toLowerCase();
    const rules = db.prepare(
      'SELECT * FROM rules WHERE workspace_id = ? AND active = 1 ORDER BY id'
    ).all(workspaceId);
    return rules.find((r) => {
      const kw = r.keyword.trim().toLowerCase();
      return r.match_type === 'exact' ? normalized === kw : normalized.includes(kw);
    });
  }

  // Stores an inbound message and runs the automation: opt-out, welcome,
  // keyword auto-replies and the fallback reply.
  async function handleInbound(workspace, { phone, name, text, waId }) {
    if (waId && db.prepare('SELECT 1 FROM messages WHERE wa_message_id = ?').get(waId)) {
      return { duplicate: true, replies: [] };
    }
    const { contact, created } = findOrCreateContact(db, workspace, phone, name);
    db.prepare(
      `INSERT INTO messages (workspace_id, contact_id, direction, body, status, wa_message_id)
       VALUES (?, ?, 'in', ?, 'received', ?)`
    ).run(workspace.id, contact.id, text, waId || null);
    db.prepare(
      "UPDATE contacts SET last_inbound_at = datetime('now'), last_message_at = datetime('now') WHERE id = ?"
    ).run(contact.id);

    const word = text.trim().toLowerCase();
    const replies = [];

    if (OPT_OUT_WORDS.includes(word)) {
      db.prepare('UPDATE contacts SET opted_out = 1 WHERE id = ?').run(contact.id);
      replies.push(await send(workspace, contact, {
        text: 'You have been unsubscribed. Reply START to subscribe again.',
      }, 'system'));
      return { contact, replies };
    }
    if (OPT_IN_WORDS.includes(word) && contact.opted_out) {
      db.prepare('UPDATE contacts SET opted_out = 0 WHERE id = ?').run(contact.id);
      replies.push(await send(workspace, contact, { text: 'You are subscribed again. Welcome back!' }, 'system'));
      return { contact, replies };
    }

    if (created && workspace.welcome_message) {
      replies.push(await send(workspace, contact, { text: workspace.welcome_message }, 'welcome'));
    }

    const rule = matchRule(workspace.id, text);
    if (rule) {
      db.prepare('UPDATE rules SET hits = hits + 1 WHERE id = ?').run(rule.id);
      replies.push(await send(workspace, contact, { text: rule.reply }, 'auto-reply'));
    } else if (workspace.fallback_reply && !(created && workspace.welcome_message)) {
      replies.push(await send(workspace, contact, { text: workspace.fallback_reply }, 'fallback'));
    }
    return { contact, replies };
  }

  function handleStatus({ id, status }) {
    db.prepare("UPDATE messages SET status = ? WHERE wa_message_id = ? AND direction = 'out'").run(status, id);
  }

  return { send, handleInbound, handleStatus, matchRule };
}

module.exports = {
  PLANS, planOf, normalizePhone, messagesThisMonth, contactCount, findOrCreateContact, createMessaging,
};
