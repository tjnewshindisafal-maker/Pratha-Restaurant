const crypto = require('node:crypto');
const path = require('node:path');
const express = require('express');
const { sqlNow } = require('./db');
const wa = require('./whatsapp');
const auth = require('./auth');
const {
  PLANS, planOf, normalizePhone, messagesThisMonth, contactCount, findOrCreateContact, createMessaging,
} = require('./messaging');

const SETTINGS_FIELDS = [
  'name', 'default_country_code', 'phone_number_id', 'access_token', 'app_secret', 'welcome_message', 'fallback_reply',
];
const SECRET_FIELDS = ['access_token', 'app_secret'];

function cleanTags(tags) {
  const list = Array.isArray(tags) ? tags : String(tags || '').split(/[,;|]/);
  return [...new Set(list.map((t) => t.trim().toLowerCase()).filter(Boolean))].join(',');
}

// Accepts an ISO string (what the dashboard sends) and returns SQL time.
function toSqlTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : sqlNow(date);
}

function publicWorkspace(ws, baseUrl) {
  const out = { ...ws };
  for (const f of SECRET_FIELDS) {
    out[`has_${f}`] = Boolean(ws[f]);
    delete out[f];
  }
  out.connected = Boolean(ws.phone_number_id && ws.access_token);
  out.webhook_url = `${baseUrl}/webhook/${ws.id}`;
  out.plan_details = planOf(ws);
  return out;
}

function createApp({ db, sender } = {}) {
  const app = express();
  const messaging = createMessaging(db, sender);
  const bad = (res, error, code = 400) => res.status(code).json({ error });
  const baseUrl = (req) => process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;

  // Keep the raw body so webhook signatures can be verified.
  app.use(express.json({ limit: '2mb', verify: (req, _res, buf) => { req.rawBody = buf; } }));
  app.use(express.static(path.join(__dirname, '..', 'public'), { extensions: ['html'] }));

  // ---------- WhatsApp webhook (called by Meta) ----------
  app.get('/webhook/:workspaceId', (req, res) => {
    const ws = db.prepare('SELECT * FROM workspaces WHERE id = ?').get(req.params.workspaceId);
    if (ws && req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === ws.verify_token) {
      return res.status(200).send(req.query['hub.challenge']);
    }
    res.sendStatus(403);
  });

  app.post('/webhook/:workspaceId', async (req, res) => {
    const ws = db.prepare('SELECT * FROM workspaces WHERE id = ?').get(req.params.workspaceId);
    if (!ws) return res.sendStatus(404);
    if (!wa.verifySignature(ws.app_secret, req.rawBody, req.get('x-hub-signature-256'))) {
      return res.sendStatus(401);
    }
    // Meta retries unless it gets a fast 200, so answer first and process after.
    res.sendStatus(200);
    try {
      for (const entry of req.body.entry || []) {
        for (const change of entry.changes || []) {
          const value = change.value || {};
          const names = Object.fromEntries((value.contacts || []).map((c) => [c.wa_id, c.profile?.name]));
          for (const msg of value.messages || []) {
            await messaging.handleInbound(ws, {
              phone: msg.from, name: names[msg.from], text: wa.extractText(msg), waId: msg.id,
            });
          }
          for (const st of value.statuses || []) messaging.handleStatus(st);
        }
      }
    } catch (err) {
      console.error('Webhook processing failed:', err);
    }
  });

  // ---------- Auth ----------
  app.post('/api/signup', (req, res) => {
    const { name, email, password, business } = req.body || {};
    if (!name || !email || !business) return bad(res, 'Name, email and business name are required');
    if (!password || password.length < 8) return bad(res, 'Password must be at least 8 characters');
    const normEmail = String(email).trim().toLowerCase();
    if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(normEmail)) return bad(res, 'Email already registered', 409);

    const { lastInsertRowid: userId } = db.prepare(
      'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)'
    ).run(normEmail, name.trim(), auth.hashPassword(password));
    db.prepare(
      'INSERT INTO workspaces (owner_id, name, verify_token, welcome_message) VALUES (?, ?, ?, ?)'
    ).run(userId, business.trim(), crypto.randomBytes(16).toString('hex'),
      `Namaste! Thanks for messaging ${business.trim()}. How can we help you?`);
    auth.createSession(db, res, userId);
    res.status(201).json({ ok: true });
  });

  app.post('/api/login', (req, res) => {
    const { email, password } = req.body || {};
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(String(email || '').trim().toLowerCase());
    if (!user || !password || !auth.checkPassword(password, user.password_hash)) {
      return bad(res, 'Wrong email or password', 401);
    }
    auth.createSession(db, res, user.id);
    res.json({ ok: true });
  });

  app.post('/api/logout', (req, res) => {
    auth.destroySession(db, req, res);
    res.json({ ok: true });
  });

  app.get('/api/plans', (_req, res) => res.json(PLANS));

  // Everything below needs a logged-in user.
  app.use('/api', auth.requireAuth(db));

  app.get('/api/me', (req, res) => {
    res.json({ user: req.user, workspace: publicWorkspace(req.workspace, baseUrl(req)) });
  });

  app.put('/api/settings', (req, res) => {
    const ws = req.workspace;
    const body = req.body || {};
    const updates = {};
    for (const f of SETTINGS_FIELDS) {
      if (!(f in body)) continue;
      // Secrets are write-only: an empty value keeps the saved one.
      if (SECRET_FIELDS.includes(f) && !body[f]) continue;
      updates[f] = body[f] === '' ? null : String(body[f]).trim();
    }
    if ('name' in updates && !updates.name) return bad(res, 'Business name cannot be empty');
    if ('default_country_code' in updates && !/^\d{1,4}$/.test(updates.default_country_code || '')) {
      return bad(res, 'Country code must be digits, e.g. 91');
    }
    if (body.disconnect) Object.assign(updates, { phone_number_id: null, access_token: null, app_secret: null });
    const keys = Object.keys(updates);
    if (keys.length) {
      db.prepare(`UPDATE workspaces SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE id = ?`)
        .run(...keys.map((k) => updates[k]), ws.id);
    }
    const fresh = db.prepare('SELECT * FROM workspaces WHERE id = ?').get(ws.id);
    res.json(publicWorkspace(fresh, baseUrl(req)));
  });

  app.put('/api/plan', (req, res) => {
    // Placeholder until payments (e.g. Razorpay) are wired in.
    const plan = req.body?.plan;
    if (!PLANS[plan]) return bad(res, 'Unknown plan');
    db.prepare('UPDATE workspaces SET plan = ? WHERE id = ?').run(plan, req.workspace.id);
    res.json({ ok: true, plan });
  });

  app.get('/api/stats', (req, res) => {
    const id = req.workspace.id;
    const one = (sql, ...args) => db.prepare(sql).get(id, ...args).n;
    res.json({
      contacts: contactCount(db, id),
      opted_out: one('SELECT COUNT(*) AS n FROM contacts WHERE workspace_id = ? AND opted_out = 1'),
      messages_in_today: one(
        "SELECT COUNT(*) AS n FROM messages WHERE workspace_id = ? AND direction = 'in' AND created_at >= date('now')"),
      auto_replies_today: one(
        "SELECT COUNT(*) AS n FROM messages WHERE workspace_id = ? AND direction = 'out' AND source IN ('auto-reply','welcome','fallback') AND created_at >= date('now')"),
      messages_this_month: messagesThisMonth(db, id),
      plan: planOf(req.workspace),
      pending_reminders: one("SELECT COUNT(*) AS n FROM reminders WHERE workspace_id = ? AND status = 'pending'"),
    });
  });

  // ---------- Contacts ----------
  app.get('/api/contacts', (req, res) => {
    const q = `%${req.query.q || ''}%`;
    const tag = cleanTags(req.query.tag);
    res.json(db.prepare(
      `SELECT * FROM contacts WHERE workspace_id = ? AND (phone LIKE ? OR IFNULL(name,'') LIKE ?)
       AND (? = '' OR (',' || tags || ',') LIKE ('%,' || ? || ',%'))
       ORDER BY COALESCE(last_message_at, created_at) DESC LIMIT 500`
    ).all(req.workspace.id, q, q, tag, tag));
  });

  function addContact(ws, { phone, name, tags }) {
    const norm = normalizePhone(phone, ws.default_country_code);
    if (!norm) return { error: `Invalid phone number: ${phone}` };
    const existing = db.prepare('SELECT * FROM contacts WHERE workspace_id = ? AND phone = ?').get(ws.id, norm);
    if (existing) {
      db.prepare('UPDATE contacts SET name = COALESCE(?, name), tags = ? WHERE id = ?')
        .run(name || null, cleanTags([existing.tags, cleanTags(tags)].join(',')), existing.id);
      return { contact: db.prepare('SELECT * FROM contacts WHERE id = ?').get(existing.id), created: false };
    }
    if (contactCount(db, ws.id) >= planOf(ws).contacts) return { error: 'Contact limit reached for your plan' };
    const { contact } = findOrCreateContact(db, ws, norm, name);
    db.prepare('UPDATE contacts SET tags = ? WHERE id = ?').run(cleanTags(tags), contact.id);
    return { contact: db.prepare('SELECT * FROM contacts WHERE id = ?').get(contact.id), created: true };
  }

  app.post('/api/contacts', (req, res) => {
    const result = addContact(req.workspace, req.body || {});
    if (result.error) return bad(res, result.error);
    res.status(result.created ? 201 : 200).json(result.contact);
  });

  // CSV lines: phone,name,tag1;tag2 (a header line is skipped automatically)
  app.post('/api/contacts/import', (req, res) => {
    const lines = String(req.body?.csv || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    let added = 0;
    let updated = 0;
    const errors = [];
    for (const line of lines) {
      const [phone, name, ...rest] = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
      if (!/\d/.test(phone)) continue;
      const r = addContact(req.workspace, { phone, name, tags: rest.join(';') });
      if (r.error) errors.push(r.error);
      else if (r.created) added++;
      else updated++;
    }
    res.json({ added, updated, errors: errors.slice(0, 20), error_count: errors.length });
  });

  function ownContact(req) {
    return db.prepare('SELECT * FROM contacts WHERE id = ? AND workspace_id = ?').get(req.params.id, req.workspace.id);
  }

  app.put('/api/contacts/:id', (req, res) => {
    const c = ownContact(req);
    if (!c) return bad(res, 'Contact not found', 404);
    const { name, tags, opted_out } = req.body || {};
    db.prepare('UPDATE contacts SET name = ?, tags = ?, opted_out = ? WHERE id = ?').run(
      name ?? c.name, tags === undefined ? c.tags : cleanTags(tags),
      opted_out === undefined ? c.opted_out : (opted_out ? 1 : 0), c.id);
    res.json(db.prepare('SELECT * FROM contacts WHERE id = ?').get(c.id));
  });

  app.delete('/api/contacts/:id', (req, res) => {
    const c = ownContact(req);
    if (!c) return bad(res, 'Contact not found', 404);
    db.prepare('DELETE FROM contacts WHERE id = ?').run(c.id);
    res.json({ ok: true });
  });

  // ---------- Inbox ----------
  app.get('/api/conversations', (req, res) => {
    res.json(db.prepare(
      `SELECT c.*, (SELECT body FROM messages m WHERE m.contact_id = c.id ORDER BY m.id DESC LIMIT 1) AS last_body,
              (SELECT direction FROM messages m WHERE m.contact_id = c.id ORDER BY m.id DESC LIMIT 1) AS last_direction
       FROM contacts c WHERE c.workspace_id = ? AND c.last_message_at IS NOT NULL
       ORDER BY c.last_message_at DESC, c.id DESC LIMIT 200`
    ).all(req.workspace.id));
  });

  app.get('/api/conversations/:id/messages', (req, res) => {
    const c = ownContact(req);
    if (!c) return bad(res, 'Contact not found', 404);
    const messages = db.prepare(
      'SELECT * FROM messages WHERE contact_id = ? ORDER BY id DESC LIMIT 300'
    ).all(c.id).reverse();
    const windowOpen = Boolean(c.last_inbound_at) && c.last_inbound_at >= sqlNow(new Date(Date.now() - 864e5));
    res.json({ contact: c, messages, window_open: windowOpen });
  });

  app.post('/api/conversations/:id/messages', async (req, res) => {
    const c = ownContact(req);
    if (!c) return bad(res, 'Contact not found', 404);
    const { text, template, lang } = req.body || {};
    if (!text?.trim() && !template?.trim()) return bad(res, 'Message is empty');
    if (c.opted_out) return bad(res, 'This contact has opted out (sent STOP)');
    const msg = await messaging.send(req.workspace, c, template ? { template: template.trim(), lang } : { text: text.trim() });
    res.status(msg.status === 'failed' ? 502 : 201).json(msg);
  });

  // Lets owners try the bot without connecting WhatsApp.
  app.post('/api/simulate', async (req, res) => {
    const { phone, name, text } = req.body || {};
    const norm = normalizePhone(phone, req.workspace.default_country_code);
    if (!norm) return bad(res, 'Enter a valid phone number');
    if (!text?.trim()) return bad(res, 'Message is empty');
    // Simulated chats never reach WhatsApp, even on a connected workspace.
    const simWorkspace = { ...req.workspace, access_token: null };
    const result = await createMessaging(db, wa.sendMessage).handleInbound(simWorkspace, { phone: norm, name, text: text.trim() });
    res.json({ contact_id: result.contact.id, replies: result.replies.map((r) => r.body) });
  });

  // ---------- Auto-reply rules ----------
  function validRule(body) {
    const keyword = String(body.keyword || '').trim();
    const reply = String(body.reply || '').trim();
    const match_type = body.match_type === 'exact' ? 'exact' : 'contains';
    if (!keyword || !reply) return null;
    return { keyword, reply, match_type, active: body.active === false ? 0 : 1 };
  }

  app.get('/api/rules', (req, res) => {
    res.json(db.prepare('SELECT * FROM rules WHERE workspace_id = ? ORDER BY id').all(req.workspace.id));
  });

  app.post('/api/rules', (req, res) => {
    const r = validRule(req.body || {});
    if (!r) return bad(res, 'Keyword and reply are required');
    const { lastInsertRowid } = db.prepare(
      'INSERT INTO rules (workspace_id, keyword, match_type, reply, active) VALUES (?, ?, ?, ?, ?)'
    ).run(req.workspace.id, r.keyword, r.match_type, r.reply, r.active);
    res.status(201).json(db.prepare('SELECT * FROM rules WHERE id = ?').get(lastInsertRowid));
  });

  app.put('/api/rules/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM rules WHERE id = ? AND workspace_id = ?').get(req.params.id, req.workspace.id);
    if (!existing) return bad(res, 'Rule not found', 404);
    const r = validRule({ ...existing, active: existing.active === 1, ...req.body });
    if (!r) return bad(res, 'Keyword and reply are required');
    db.prepare('UPDATE rules SET keyword = ?, match_type = ?, reply = ?, active = ? WHERE id = ?')
      .run(r.keyword, r.match_type, r.reply, r.active, existing.id);
    res.json(db.prepare('SELECT * FROM rules WHERE id = ?').get(existing.id));
  });

  app.delete('/api/rules/:id', (req, res) => {
    const { changes } = db.prepare('DELETE FROM rules WHERE id = ? AND workspace_id = ?').run(req.params.id, req.workspace.id);
    if (!changes) return bad(res, 'Rule not found', 404);
    res.json({ ok: true });
  });

  // ---------- Broadcasts ----------
  app.get('/api/broadcasts', (req, res) => {
    res.json(db.prepare('SELECT * FROM broadcasts WHERE workspace_id = ? ORDER BY id DESC LIMIT 100').all(req.workspace.id));
  });

  app.post('/api/broadcasts', (req, res) => {
    const { name, message, template_name, template_lang, tag, scheduled_at } = req.body || {};
    if (!name?.trim()) return bad(res, 'Give the broadcast a name');
    if (!message?.trim() && !template_name?.trim()) return bad(res, 'Add a message or a template name');
    const when = scheduled_at ? toSqlTime(scheduled_at) : sqlNow();
    if (!when) return bad(res, 'Invalid schedule time');
    const { lastInsertRowid } = db.prepare(
      `INSERT INTO broadcasts (workspace_id, name, message, template_name, template_lang, tag, scheduled_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(req.workspace.id, name.trim(), message?.trim() || null, template_name?.trim() || null,
      template_lang?.trim() || 'en', cleanTags(tag) || null, when);
    res.status(201).json(db.prepare('SELECT * FROM broadcasts WHERE id = ?').get(lastInsertRowid));
  });

  app.post('/api/broadcasts/:id/cancel', (req, res) => {
    const { changes } = db.prepare(
      "UPDATE broadcasts SET status = 'cancelled' WHERE id = ? AND workspace_id = ? AND status IN ('scheduled','sending')"
    ).run(req.params.id, req.workspace.id);
    if (!changes) return bad(res, 'Broadcast cannot be cancelled');
    res.json({ ok: true });
  });

  // ---------- Reminders ----------
  app.get('/api/reminders', (req, res) => {
    res.json(db.prepare(
      `SELECT r.*, c.phone, c.name AS contact_name FROM reminders r JOIN contacts c ON c.id = r.contact_id
       WHERE r.workspace_id = ? ORDER BY r.send_at DESC LIMIT 200`
    ).all(req.workspace.id));
  });

  app.post('/api/reminders', (req, res) => {
    const { phone, name, message, send_at } = req.body || {};
    if (!message?.trim()) return bad(res, 'Reminder message is required');
    const when = toSqlTime(send_at);
    if (!when) return bad(res, 'Pick a valid date and time');
    const r = addContact(req.workspace, { phone, name });
    if (r.error) return bad(res, r.error);
    const { lastInsertRowid } = db.prepare(
      'INSERT INTO reminders (workspace_id, contact_id, message, send_at) VALUES (?, ?, ?, ?)'
    ).run(req.workspace.id, r.contact.id, message.trim(), when);
    res.status(201).json(db.prepare('SELECT * FROM reminders WHERE id = ?').get(lastInsertRowid));
  });

  app.delete('/api/reminders/:id', (req, res) => {
    const { changes } = db.prepare(
      "DELETE FROM reminders WHERE id = ? AND workspace_id = ? AND status = 'pending'"
    ).run(req.params.id, req.workspace.id);
    if (!changes) return bad(res, 'Only pending reminders can be deleted');
    res.json({ ok: true });
  });

  app.use('/api', (_req, res) => bad(res, 'Not found', 404));
  app.use((err, _req, res, _next) => {
    console.error(err);
    if (err.type === 'entity.parse.failed') return bad(res, 'Invalid JSON');
    bad(res, 'Something went wrong', 500);
  });

  return { app, messaging };
}

module.exports = { createApp };
