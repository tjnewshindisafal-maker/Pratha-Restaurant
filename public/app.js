/* ChatPilot dashboard — a small hash-routed single page app. */
const view = document.getElementById('view');
let me = null;
let inboxTimer = null;

// ---------- helpers ----------
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function api(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (res.status === 401) { location.href = '/login'; throw new Error('Logged out'); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

// Server stores UTC "YYYY-MM-DD HH:MM:SS"; show it in the viewer's time zone.
function fmtTime(sql) {
  if (!sql) return '';
  const d = new Date(sql.replace(' ', 'T') + 'Z');
  return d.toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function displayName(c) { return c.name || `+${c.phone}`; }

function formData(form) {
  return Object.fromEntries(new FormData(form));
}

// Wires a form so errors show inline and the button is disabled while saving.
function onSubmit(form, handler) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit], button:not([type])');
    const err = form.querySelector('.error');
    if (err) err.textContent = '';
    if (btn) btn.disabled = true;
    try { await handler(formData(form)); } catch (ex) { if (err) err.textContent = ex.message; else toast(ex.message); }
    finally { if (btn) btn.disabled = false; }
  });
}

const statusBadge = (s) => {
  const cls = { failed: 'red', cancelled: 'gray', skipped: 'gray', pending: 'gray', scheduled: 'gray', simulated: 'gray' }[s] || '';
  return `<span class="badge ${cls}">${esc(s)}</span>`;
};

function head(title, extra = '') {
  return `<div class="page-head"><h1>${title}</h1><div>${extra}</div></div>`;
}

// ---------- pages ----------
const pages = {
  async overview() {
    const s = await api('/stats');
    const pct = Math.min(100, Math.round((s.messages_this_month / s.plan.messages) * 100));
    view.innerHTML = head(`Namaste, ${esc(me.user.name.split(' ')[0])} 👋`) + `
      ${me.workspace.connected ? '' : `<div class="notice" style="margin-bottom:16px">
        WhatsApp is not connected yet, so messages run in <b>test mode</b>. <a href="#settings">Connect your number</a> or try the bot in <a href="#simulator">Test bot</a>.</div>`}
      <div class="stats">
        <div class="card stat"><div class="num">${s.contacts}</div><div class="label">Contacts (${s.opted_out} opted out)</div></div>
        <div class="card stat"><div class="num">${s.messages_in_today}</div><div class="label">Messages received today</div></div>
        <div class="card stat"><div class="num">${s.auto_replies_today}</div><div class="label">Auto-replies sent today</div></div>
        <div class="card stat"><div class="num">${s.pending_reminders}</div><div class="label">Reminders scheduled</div></div>
      </div>
      <div class="card">
        <b>${esc(s.plan.name)} plan</b> — ${s.messages_this_month} / ${s.plan.messages} messages used this month
        <div class="meter"><div style="width:${pct}%"></div></div>
        <p class="small muted" style="margin-bottom:0">Test-mode messages don't count. <a href="#settings">Change plan</a></p>
      </div>
      <div class="card" style="margin-top:16px">
        <h3>Get started</h3>
        <ol style="margin:0;padding-left:20px">
          <li>Add <a href="#rules">auto-replies</a> for common questions (fees, timing, location).</li>
          <li>Try them in <a href="#simulator">Test bot</a>.</li>
          <li><a href="#contacts">Import your customers</a> and tag them.</li>
          <li><a href="#settings">Connect your WhatsApp Business number</a> to go live.</li>
        </ol>
      </div>`;
  },

  async inbox(contactId) {
    const convs = await api('/conversations');
    view.innerHTML = head('Inbox') + `
      <div class="card inbox ${contactId ? 'has-chat' : ''}">
        <div class="conv-list">${convs.length ? convs.map((c) => `
          <button class="conv ${String(c.id) === contactId ? 'active' : ''}" data-id="${c.id}">
            <div class="name">${esc(displayName(c))} ${c.opted_out ? '<span class="badge red">STOP</span>' : ''}</div>
            <div class="preview">${c.last_direction === 'out' ? '↪ ' : ''}${esc(c.last_body)}</div>
            <div class="small muted">${fmtTime(c.last_message_at)}</div>
          </button>`).join('') : '<div class="empty">No conversations yet.<br>Messages from customers will show up here.</div>'}
        </div>
        <div class="chat" id="chat"><div class="empty">Select a conversation</div></div>
      </div>`;
    view.querySelectorAll('.conv').forEach((b) => b.addEventListener('click', () => { location.hash = `inbox/${b.dataset.id}`; }));
    if (contactId) await renderChat(contactId);
  },

  async contacts() {
    view.innerHTML = head('Contacts') + `
      <div class="grid-2" style="margin-bottom:16px">
        <form class="card" id="add-contact">
          <h3>Add contact</h3>
          <div class="row">
            <div><label>Phone</label><input name="phone" placeholder="98765 43210" required /></div>
            <div><label>Name</label><input name="name" /></div>
          </div>
          <label>Tags <span class="muted">(comma separated)</span></label><input name="tags" placeholder="vip, class-10" />
          <div class="error"></div><button class="btn">Add</button>
        </form>
        <form class="card" id="import">
          <h3>Import CSV</h3>
          <p class="small muted" style="margin:0">One per line: <code>phone,name,tag1;tag2</code>. You can paste straight from Excel saved as CSV.</p>
          <textarea name="csv" placeholder="9876543210,Ravi Kumar,vip&#10;9123456780,Priya,class-10;new" required></textarea>
          <input type="file" accept=".csv,text/csv" id="csv-file" style="margin-top:8px" />
          <div class="error"></div><button class="btn">Import</button>
        </form>
      </div>
      <div class="card">
        <div class="row" style="margin-bottom:12px">
          <input id="search" placeholder="Search name or phone" />
          <input id="tag-filter" placeholder="Filter by tag" />
        </div>
        <div class="table-wrap"><table><thead><tr><th>Name</th><th>Phone</th><th>Tags</th><th>Status</th><th></th></tr></thead><tbody id="contact-rows"></tbody></table></div>
      </div>`;

    const rows = document.getElementById('contact-rows');
    async function load() {
      const q = encodeURIComponent(document.getElementById('search').value);
      const tag = encodeURIComponent(document.getElementById('tag-filter').value);
      const list = await api(`/contacts?q=${q}&tag=${tag}`);
      rows.innerHTML = list.length ? list.map((c) => `<tr>
          <td>${esc(c.name || '—')}</td><td>+${esc(c.phone)}</td>
          <td>${c.tags ? c.tags.split(',').map((t) => `<span class="badge gray">${esc(t)}</span>`).join(' ') : ''}</td>
          <td>${c.opted_out ? '<span class="badge red">Opted out</span>' : '<span class="badge">Subscribed</span>'}</td>
          <td style="white-space:nowrap">
            <a class="btn ghost sm" href="#inbox/${c.id}">Chat</a>
            <button class="btn danger sm" data-del="${c.id}">Delete</button>
          </td></tr>`).join('') : '<tr><td colspan="5" class="muted">No contacts found.</td></tr>';
      rows.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', async () => {
        if (!confirm('Delete this contact and their chat history?')) return;
        await api(`/contacts/${b.dataset.del}`, { method: 'DELETE' });
        load();
      }));
    }
    let t;
    for (const id of ['search', 'tag-filter']) {
      document.getElementById(id).addEventListener('input', () => { clearTimeout(t); t = setTimeout(load, 250); });
    }
    onSubmit(document.getElementById('add-contact'), async (d) => {
      await api('/contacts', { method: 'POST', body: d });
      document.getElementById('add-contact').reset();
      toast('Contact saved');
      load();
    });
    document.getElementById('csv-file').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) document.querySelector('#import textarea').value = await file.text();
    });
    onSubmit(document.getElementById('import'), async (d) => {
      const r = await api('/contacts/import', { method: 'POST', body: d });
      toast(`${r.added} added, ${r.updated} updated${r.error_count ? `, ${r.error_count} skipped` : ''}`);
      if (r.error_count) document.querySelector('#import .error').textContent = r.errors.join('; ');
      else document.getElementById('import').reset();
      load();
    });
    load();
  },

  async rules() {
    const rules = await api('/rules');
    view.innerHTML = head('Auto-replies') + `
      <form class="card" id="add-rule" style="margin-bottom:16px">
        <h3>New auto-reply</h3>
        <div class="row">
          <div><label>When message</label><select name="match_type"><option value="contains">contains</option><option value="exact">is exactly</option></select></div>
          <div><label>Keyword</label><input name="keyword" placeholder="fees" required /></div>
        </div>
        <label>Reply with</label><textarea name="reply" placeholder="Consultation fee is ₹300." required></textarea>
        <div class="error"></div><button class="btn">Add auto-reply</button>
      </form>
      <div class="card">
        <p class="small muted" style="margin-top:0">The first matching rule replies. STOP / START are handled automatically.</p>
        <div class="table-wrap"><table><thead><tr><th>Keyword</th><th>Reply</th><th>Used</th><th>Active</th><th></th></tr></thead><tbody>
        ${rules.length ? rules.map((r) => `<tr>
          <td><span class="badge gray">${r.match_type === 'exact' ? '=' : '∋'}</span> ${esc(r.keyword)}</td>
          <td style="white-space:pre-wrap">${esc(r.reply)}</td><td>${r.hits}×</td>
          <td><input type="checkbox" data-toggle="${r.id}" ${r.active ? 'checked' : ''} style="width:auto" aria-label="Active" /></td>
          <td><button class="btn danger sm" data-del="${r.id}">Delete</button></td></tr>`).join('')
        : '<tr><td colspan="5" class="muted">No auto-replies yet. Try "fees", "timing" or "location".</td></tr>'}
        </tbody></table></div>
      </div>`;
    onSubmit(document.getElementById('add-rule'), async (d) => {
      await api('/rules', { method: 'POST', body: d });
      toast('Auto-reply added');
      pages.rules();
    });
    view.querySelectorAll('[data-toggle]').forEach((c) => c.addEventListener('change', async () => {
      await api(`/rules/${c.dataset.toggle}`, { method: 'PUT', body: { active: c.checked } });
      toast(c.checked ? 'Turned on' : 'Turned off');
    }));
    view.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', async () => {
      if (!confirm('Delete this auto-reply?')) return;
      await api(`/rules/${b.dataset.del}`, { method: 'DELETE' });
      pages.rules();
    }));
  },

  async broadcasts() {
    const list = await api('/broadcasts');
    view.innerHTML = head('Broadcasts') + `
      <form class="card" id="new-bc" style="margin-bottom:16px">
        <h3>New broadcast</h3>
        <div class="notice small">WhatsApp only allows free-text messages to people who messaged you in the last 24 hours.
          For everyone else, use a <b>template</b> approved in Meta Business Manager.</div>
        <div class="row">
          <div><label>Name</label><input name="name" placeholder="Diwali offer" required /></div>
          <div><label>Send to tag <span class="muted">(empty = everyone)</span></label><input name="tag" placeholder="vip" /></div>
        </div>
        <label>Message</label><textarea name="message" placeholder="🎉 Diwali offer: 20% off this week!"></textarea>
        <div class="row">
          <div><label>…or template name</label><input name="template_name" placeholder="diwali_offer" /></div>
          <div><label>Template language</label><input name="template_lang" value="en" /></div>
          <div><label>Send at <span class="muted">(empty = now)</span></label><input type="datetime-local" name="scheduled_at" /></div>
        </div>
        <div class="error"></div><button class="btn">Schedule broadcast</button>
      </form>
      <div class="card"><div class="table-wrap"><table><thead><tr><th>Name</th><th>Audience</th><th>When</th><th>Status</th><th>Progress</th><th></th></tr></thead><tbody>
      ${list.length ? list.map((b) => `<tr>
        <td><b>${esc(b.name)}</b><div class="small muted">${esc(b.template_name ? `template: ${b.template_name}` : b.message)}</div></td>
        <td>${b.tag ? `<span class="badge gray">${esc(b.tag)}</span>` : 'Everyone'}</td>
        <td>${fmtTime(b.scheduled_at)}</td><td>${statusBadge(b.status)}</td>
        <td>${b.sent}/${b.total}${b.failed ? ` <span class="small" style="color:var(--danger)">(${b.failed} failed)</span>` : ''}</td>
        <td>${['scheduled', 'sending'].includes(b.status) ? `<button class="btn danger sm" data-cancel="${b.id}">Cancel</button>` : ''}</td></tr>`).join('')
      : '<tr><td colspan="6" class="muted">No broadcasts yet.</td></tr>'}
      </tbody></table></div></div>`;
    onSubmit(document.getElementById('new-bc'), async (d) => {
      d.scheduled_at = d.scheduled_at ? new Date(d.scheduled_at).toISOString() : '';
      await api('/broadcasts', { method: 'POST', body: d });
      toast('Broadcast scheduled — it will start within 15 seconds of its time');
      pages.broadcasts();
    });
    view.querySelectorAll('[data-cancel]').forEach((b) => b.addEventListener('click', async () => {
      await api(`/broadcasts/${b.dataset.cancel}/cancel`, { method: 'POST' });
      pages.broadcasts();
    }));
  },

  async reminders() {
    const list = await api('/reminders');
    view.innerHTML = head('Reminders') + `
      <form class="card" id="new-rem" style="margin-bottom:16px">
        <h3>Schedule a reminder</h3>
        <div class="row">
          <div><label>Phone</label><input name="phone" placeholder="98765 43210" required /></div>
          <div><label>Name</label><input name="name" /></div>
          <div><label>Send at</label><input type="datetime-local" name="send_at" required /></div>
        </div>
        <label>Message</label><textarea name="message" placeholder="⏰ Reminder: your appointment is tomorrow at 11:00 AM." required></textarea>
        <div class="error"></div><button class="btn">Schedule</button>
      </form>
      <div class="card"><div class="table-wrap"><table><thead><tr><th>To</th><th>Message</th><th>When</th><th>Status</th><th></th></tr></thead><tbody>
      ${list.length ? list.map((r) => `<tr>
        <td>${esc(r.contact_name || `+${r.phone}`)}</td><td style="white-space:pre-wrap">${esc(r.message)}</td>
        <td>${fmtTime(r.send_at)}</td><td>${statusBadge(r.status)}${r.error ? `<div class="small muted">${esc(r.error)}</div>` : ''}</td>
        <td>${r.status === 'pending' ? `<button class="btn danger sm" data-del="${r.id}">Delete</button>` : ''}</td></tr>`).join('')
      : '<tr><td colspan="5" class="muted">No reminders yet.</td></tr>'}
      </tbody></table></div></div>`;
    onSubmit(document.getElementById('new-rem'), async (d) => {
      d.send_at = new Date(d.send_at).toISOString();
      await api('/reminders', { method: 'POST', body: d });
      toast('Reminder scheduled');
      pages.reminders();
    });
    view.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', async () => {
      await api(`/reminders/${b.dataset.del}`, { method: 'DELETE' });
      pages.reminders();
    }));
  },

  async simulator() {
    view.innerHTML = head('Test your bot') + `
      <div class="grid-2">
        <form class="card" id="sim">
          <p class="muted" style="margin-top:0">Pretend to be a customer. Nothing is sent to WhatsApp — this only runs your welcome message and auto-replies.</p>
          <div class="row">
            <div><label>Customer phone</label><input name="phone" value="9999900001" required /></div>
            <div><label>Customer name</label><input name="name" value="Test Customer" /></div>
          </div>
          <label>Message</label><input name="text" placeholder="What are your fees?" required autocomplete="off" />
          <div class="error"></div><button class="btn">Send as customer</button>
        </form>
        <div class="card" style="background:var(--chat-bg)" id="sim-chat"><p class="muted">The conversation will appear here.</p></div>
      </div>`;
    const chat = document.getElementById('sim-chat');
    let first = true;
    onSubmit(document.getElementById('sim'), async (d) => {
      const r = await api('/simulate', { method: 'POST', body: d });
      if (first) { chat.innerHTML = ''; first = false; }
      chat.insertAdjacentHTML('beforeend', `<div class="bubble in">${esc(d.text)}</div>` +
        (r.replies.length ? r.replies.map((t) => `<div class="bubble out">${esc(t)}<span class="meta">bot</span></div>`).join('')
          : '<div class="small muted" style="text-align:center">No auto-reply matched — this would wait in your inbox.</div>'));
      document.querySelector('#sim [name=text]').value = '';
    });
  },

  async settings() {
    const ws = (await api('/me')).workspace;
    const plans = await api('/plans');
    view.innerHTML = head('Settings') + `<div class="stack">
      <form class="card" id="biz">
        <h3>Business</h3>
        <div class="row">
          <div><label>Business name</label><input name="name" value="${esc(ws.name)}" required /></div>
          <div><label>Default country code</label><input name="default_country_code" value="${esc(ws.default_country_code)}" /></div>
        </div>
        <label>Welcome message <span class="muted">(sent to first-time customers; empty = off)</span></label>
        <textarea name="welcome_message">${esc(ws.welcome_message)}</textarea>
        <label>Fallback reply <span class="muted">(when no auto-reply matches; empty = off)</span></label>
        <textarea name="fallback_reply" placeholder="Thanks! Our team will reply shortly.">${esc(ws.fallback_reply)}</textarea>
        <div class="error"></div><button class="btn">Save</button>
      </form>

      <form class="card" id="wa">
        <h3>WhatsApp connection ${ws.connected ? '<span class="badge">Connected</span>' : '<span class="badge gray">Test mode</span>'}</h3>
        <ol class="small muted" style="padding-left:18px">
          <li>Create an app at <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener">developers.facebook.com</a> and add the <b>WhatsApp</b> product.</li>
          <li>Copy the <b>Phone number ID</b> and a <b>permanent access token</b> (System User token) below.</li>
          <li>In WhatsApp → Configuration, set the webhook URL and verify token shown here, and subscribe to <b>messages</b>.</li>
        </ol>
        <label>Webhook URL</label><span class="code">${esc(ws.webhook_url)}</span>
        <label>Verify token</label><span class="code">${esc(ws.verify_token)}</span>
        <div class="row">
          <div><label>Phone number ID</label><input name="phone_number_id" value="${esc(ws.phone_number_id)}" /></div>
          <div><label>Access token ${ws.has_access_token ? '<span class="muted">(saved — leave blank to keep)</span>' : ''}</label><input name="access_token" type="password" autocomplete="off" /></div>
          <div><label>App secret <span class="muted">(recommended)</span></label><input name="app_secret" type="password" autocomplete="off" placeholder="${ws.has_app_secret ? 'saved' : ''}" /></div>
        </div>
        <div class="error"></div>
        <div class="row" style="flex-wrap:nowrap"><button class="btn" style="flex:0 0 auto">Save connection</button>
        ${ws.connected ? '<button type="button" class="btn danger" id="disconnect" style="flex:0 0 auto">Disconnect</button>' : ''}</div>
      </form>

      <div class="card">
        <h3>Plan</h3>
        <div class="row">${Object.entries(plans).map(([key, p]) => `
          <div class="card" style="box-shadow:none ${key === ws.plan ? ';border:2px solid var(--brand)' : ''}">
            <b>${esc(p.name)}</b><div class="price" style="font-size:22px">₹${p.price}<span class="small muted">/mo</span></div>
            <div class="small muted">${p.messages.toLocaleString()} messages · ${p.contacts.toLocaleString()} contacts</div>
            ${key === ws.plan ? '<span class="badge" style="margin-top:8px">Current</span>' : `<button class="btn ghost sm" data-plan="${key}" style="margin-top:8px">Switch</button>`}
          </div>`).join('')}
        </div>
        <p class="small muted">Online payment is coming soon; switching is free for now.</p>
      </div></div>`;

    const save = async (d) => { await api('/settings', { method: 'PUT', body: d }); me = await api('/me'); renderShell(); toast('Saved'); pages.settings(); };
    onSubmit(document.getElementById('biz'), save);
    onSubmit(document.getElementById('wa'), save);
    document.getElementById('disconnect')?.addEventListener('click', async () => {
      if (confirm('Disconnect WhatsApp? The bot will go back to test mode.')) await save({ disconnect: true });
    });
    view.querySelectorAll('[data-plan]').forEach((b) => b.addEventListener('click', async () => {
      await api('/plan', { method: 'PUT', body: { plan: b.dataset.plan } });
      toast('Plan updated');
      pages.settings();
    }));
  },
};

async function renderChat(contactId) {
  const chat = document.getElementById('chat');
  const { contact, messages, window_open } = await api(`/conversations/${contactId}/messages`);
  chat.innerHTML = `
    <div class="chat-head">
      <div><a href="#inbox" class="small menu-btn">← </a><b>${esc(displayName(contact))}</b>
        <div class="small muted">+${esc(contact.phone)}</div></div>
      <div>${contact.opted_out ? '<span class="badge red">Opted out</span>' : window_open ? '<span class="badge">24h window open</span>' : '<span class="badge gray">Template only</span>'}</div>
    </div>
    <div class="chat-body" id="chat-body">${messages.map((m) => `
      <div class="bubble ${m.direction}">${esc(m.body)}<span class="meta">${fmtTime(m.created_at)}${m.direction === 'out' ? ` · ${esc(m.source)} · ${esc(m.status)}` : ''}</span>${m.error ? `<span class="meta" style="color:var(--danger)">${esc(m.error)}</span>` : ''}</div>`).join('')}</div>
    <form class="chat-form" id="reply">
      <textarea name="text" placeholder="${window_open ? 'Type a reply…' : 'Outside 24h window — type a reply (may need a template)'}" ${contact.opted_out ? 'disabled' : ''}></textarea>
      <button class="btn" ${contact.opted_out ? 'disabled' : ''}>Send</button>
    </form>`;
  const body = document.getElementById('chat-body');
  body.scrollTop = body.scrollHeight;
  const form = document.getElementById('reply');
  const textarea = form.querySelector('textarea');
  textarea.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!textarea.value.trim()) return;
    try {
      await api(`/conversations/${contactId}/messages`, { method: 'POST', body: { text: textarea.value } });
    } catch (ex) { toast(ex.message); }
    pages.inbox(contactId);
  });
}

// ---------- shell & routing ----------
function renderShell() {
  document.getElementById('biz-name').textContent = me.workspace.name;
  document.getElementById('conn-status').innerHTML = me.workspace.connected
    ? '<span class="badge">WhatsApp connected</span>' : '<span class="badge gray">Test mode</span>';
}

async function route() {
  clearInterval(inboxTimer);
  const [page, param] = (location.hash.slice(1) || 'overview').split('/');
  const fn = pages[page] || pages.overview;
  document.querySelectorAll('.nav-link').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${page}`));
  document.getElementById('sidebar').classList.remove('open');
  try {
    await fn(param);
    // Keep the open conversation fresh while the owner is looking at it.
    if (page === 'inbox') {
      inboxTimer = setInterval(() => {
        if (document.activeElement?.tagName !== 'TEXTAREA') fn(param).catch(() => {});
      }, 10000);
    }
  } catch (ex) {
    view.innerHTML = `<div class="card"><p class="error">${esc(ex.message)}</p></div>`;
  }
}

document.getElementById('menu-btn').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));
document.getElementById('logout').addEventListener('click', async () => { await api('/logout', { method: 'POST' }); location.href = '/'; });
window.addEventListener('hashchange', route);

(async () => {
  me = await api('/me');
  renderShell();
  route();
})();
