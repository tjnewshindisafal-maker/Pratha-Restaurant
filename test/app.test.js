const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { openDb, sqlNow } = require('../src/db');
const { createApp } = require('../src/app');
const { createScheduler } = require('../src/scheduler');
const { normalizePhone } = require('../src/messaging');

const sent = [];
let fail = false;
async function fakeSender(workspace, to, payload) {
  if (fail) throw new Error('boom');
  sent.push({ workspace: workspace.id, to, payload });
  return { id: `wamid.${crypto.randomUUID()}` };
}

let server;
let base;
let db;
let scheduler;

before(async () => {
  db = openDb(':memory:');
  const { app, messaging } = createApp({ db, sender: fakeSender });
  scheduler = createScheduler(db, messaging, { delayMs: 0 });
  server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://localhost:${server.address().port}`;
});
after(() => server.close());

function client() {
  let cookie = '';
  return async (method, path, body, headers = {}) => {
    const res = await fetch(base + path, {
      method,
      headers: { 'Content-Type': 'application/json', cookie, ...headers },
      body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
    });
    const set = res.headers.get('set-cookie');
    if (set) cookie = set.split(';')[0];
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    return { status: res.status, data };
  };
}

async function signup(email) {
  const c = client();
  const r = await c('POST', '/api/signup', { name: 'Owner', email, password: 'password123', business: 'Test Clinic' });
  assert.equal(r.status, 201);
  return c;
}

// Connects the workspace so messages go through the (fake) sender, not simulation.
async function connect(c) {
  await c('PUT', '/api/settings', { phone_number_id: '123', access_token: 'tok' });
  return (await c('GET', '/api/me')).data.workspace;
}

function webhookBody(from, text, id = `wamid.in.${crypto.randomUUID()}`) {
  return {
    entry: [{ changes: [{ value: {
      contacts: [{ wa_id: from, profile: { name: 'Ravi' } }],
      messages: [{ from, id, type: 'text', text: { body: text } }],
    } }] }],
  };
}

const settle = () => new Promise((r) => setTimeout(r, 50));

test('normalizePhone adds country code and rejects junk', () => {
  assert.equal(normalizePhone('98765 43210'), '919876543210');
  assert.equal(normalizePhone('+1 (415) 555-0100'), '14155550100');
  assert.equal(normalizePhone('09876543210'), '919876543210');
  assert.equal(normalizePhone('123'), null);
});

test('signup, login, auth guard', async () => {
  const c = await signup('a@example.com');
  assert.equal((await c('GET', '/api/me')).data.workspace.name, 'Test Clinic');
  assert.equal((await client()('GET', '/api/me')).status, 401);

  const dup = await client()('POST', '/api/signup', { name: 'X', email: 'A@example.com', password: 'password123', business: 'B' });
  assert.equal(dup.status, 409);

  const l = client();
  assert.equal((await l('POST', '/api/login', { email: 'a@example.com', password: 'wrong-pass' })).status, 401);
  assert.equal((await l('POST', '/api/login', { email: 'a@example.com', password: 'password123' })).status, 200);
  assert.equal((await l('GET', '/api/me')).status, 200);
});

test('secrets are never returned by the API', async () => {
  const c = await signup('secret@example.com');
  const ws = await connect(c);
  assert.equal(ws.access_token, undefined);
  assert.equal(ws.has_access_token, true);
  assert.equal(ws.connected, true);
});

test('webhook verification handshake', async () => {
  const c = await signup('verify@example.com');
  const ws = (await c('GET', '/api/me')).data.workspace;
  const ok = await fetch(`${base}/webhook/${ws.id}?hub.mode=subscribe&hub.verify_token=${ws.verify_token}&hub.challenge=42`);
  assert.equal(await ok.text(), '42');
  const bad = await fetch(`${base}/webhook/${ws.id}?hub.mode=subscribe&hub.verify_token=nope&hub.challenge=42`);
  assert.equal(bad.status, 403);
});

test('inbound message triggers welcome + keyword auto-reply, duplicates ignored', async () => {
  const c = await signup('bot@example.com');
  const ws = await connect(c);
  await c('POST', '/api/rules', { keyword: 'fees', reply: 'Fee is ₹300' });
  sent.length = 0;

  const body = webhookBody('919811111111', 'What are your FEES?', 'wamid.dup');
  await c('POST', `/webhook/${ws.id}`, body);
  await c('POST', `/webhook/${ws.id}`, body); // Meta retry
  await settle();

  assert.deepEqual(sent.map((s) => s.payload.text.body), [ws.welcome_message, 'Fee is ₹300']);
  const convs = (await c('GET', '/api/conversations')).data;
  assert.equal(convs.length, 1);
  assert.equal(convs[0].name, 'Ravi');
  const { messages, window_open } = (await c('GET', `/api/conversations/${convs[0].id}/messages`)).data;
  assert.equal(messages.length, 3);
  assert.equal(window_open, true);
  assert.equal((await c('GET', '/api/rules')).data[0].hits, 1);
});

test('webhook signature is enforced when an app secret is set', async () => {
  const c = await signup('sig@example.com');
  await c('PUT', '/api/settings', { app_secret: 'shh' });
  const ws = (await c('GET', '/api/me')).data.workspace;
  const raw = JSON.stringify(webhookBody('919822222222', 'hi'));
  assert.equal((await c('POST', `/webhook/${ws.id}`, raw, { 'x-hub-signature-256': 'sha256=bad' })).status, 401);
  const sig = 'sha256=' + crypto.createHmac('sha256', 'shh').update(raw).digest('hex');
  assert.equal((await c('POST', `/webhook/${ws.id}`, raw, { 'x-hub-signature-256': sig })).status, 200);
});

test('STOP opts out and broadcasts skip opted-out and untagged contacts', async () => {
  const c = await signup('bc@example.com');
  const ws = await connect(c);
  await c('PUT', '/api/settings', { welcome_message: '' });
  await c('POST', '/api/contacts/import', { csv: 'phone,name,tags\n9800000001,A,vip\n9800000002,B,vip;new\n9800000003,C,' });
  await c('POST', `/webhook/${ws.id}`, webhookBody('919800000002', 'STOP'));
  await settle();

  sent.length = 0;
  const bc = await c('POST', '/api/broadcasts', { name: 'Offer', message: '20% off', tag: 'vip' });
  assert.equal(bc.status, 201);
  await scheduler.tick();

  assert.deepEqual(sent.map((s) => s.to), ['919800000001']);
  const [row] = (await c('GET', '/api/broadcasts')).data;
  assert.equal(row.status, 'done');
  assert.equal(row.sent, 1);
});

test('reminders send when due and failures are recorded', async () => {
  const c = await signup('rem@example.com');
  await connect(c);
  const past = new Date(Date.now() - 60_000).toISOString();
  const future = new Date(Date.now() + 3_600_000).toISOString();
  await c('POST', '/api/reminders', { phone: '9811100000', message: 'Due', send_at: past });
  await c('POST', '/api/reminders', { phone: '9811100001', message: 'Later', send_at: future });

  fail = true;
  await scheduler.tick();
  fail = false;
  const list = (await c('GET', '/api/reminders')).data;
  assert.equal(list.find((r) => r.message === 'Due').status, 'failed');
  assert.equal(list.find((r) => r.message === 'Later').status, 'pending');
});

test('plan message limit blocks sending', async () => {
  const c = await signup('limit@example.com');
  const ws = await connect(c);
  const contact = (await c('POST', '/api/contacts', { phone: '9822200000' })).data;
  const insert = db.prepare(
    "INSERT INTO messages (workspace_id, contact_id, direction, body, status, created_at) VALUES (?, ?, 'out', 'x', 'sent', ?)"
  );
  for (let i = 0; i < 100; i++) insert.run(ws.id, contact.id, sqlNow());
  const r = await c('POST', `/api/conversations/${contact.id}/messages`, { text: 'hello' });
  assert.equal(r.status, 502);
  assert.match(r.data.error, /limit/);
});

test('simulator never sends to WhatsApp even when connected', async () => {
  const c = await signup('sim@example.com');
  await connect(c);
  await c('POST', '/api/rules', { keyword: 'timing', reply: '10 to 8' });
  sent.length = 0;
  const r = await c('POST', '/api/simulate', { phone: '9833300000', text: 'timing?' });
  assert.equal(r.status, 200);
  assert.ok(r.data.replies.includes('10 to 8'));
  assert.equal(sent.length, 0);
});

test('workspaces cannot see each other\'s data', async () => {
  const a = await signup('iso-a@example.com');
  const b = await signup('iso-b@example.com');
  const contact = (await a('POST', '/api/contacts', { phone: '9844400000', name: 'Secret' })).data;
  const rule = (await a('POST', '/api/rules', { keyword: 'x', reply: 'y' })).data;

  assert.equal((await b('GET', `/api/conversations/${contact.id}/messages`)).status, 404);
  assert.equal((await b('DELETE', `/api/contacts/${contact.id}`)).status, 404);
  assert.equal((await b('DELETE', `/api/rules/${rule.id}`)).status, 404);
  assert.equal((await b('GET', '/api/contacts')).data.length, 0);
});
