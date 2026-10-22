const { sqlNow } = require('./db');

// Picks up due reminders and broadcasts and sends them. Safe to call on an
// interval: a run that is still in progress makes the next tick a no-op.
function createScheduler(db, messaging, { delayMs = 200 } = {}) {
  let running = false;
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const workspaceById = db.prepare('SELECT * FROM workspaces WHERE id = ?');

  async function runReminders(now) {
    const due = db.prepare(
      "SELECT * FROM reminders WHERE status = 'pending' AND send_at <= ? ORDER BY send_at"
    ).all(now);
    for (const r of due) {
      const workspace = workspaceById.get(r.workspace_id);
      const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(r.contact_id);
      if (contact.opted_out) {
        db.prepare("UPDATE reminders SET status = 'skipped', error = 'Contact opted out' WHERE id = ?").run(r.id);
        continue;
      }
      const msg = await messaging.send(workspace, contact, { text: r.message }, 'reminder');
      db.prepare('UPDATE reminders SET status = ?, error = ? WHERE id = ?')
        .run(msg.status === 'failed' ? 'failed' : 'sent', msg.error, r.id);
    }
  }

  async function runBroadcasts(now) {
    const due = db.prepare(
      "SELECT * FROM broadcasts WHERE status = 'scheduled' AND scheduled_at <= ? ORDER BY scheduled_at"
    ).all(now);
    for (const b of due) {
      const workspace = workspaceById.get(b.workspace_id);
      const recipients = db.prepare(
        `SELECT * FROM contacts WHERE workspace_id = ? AND opted_out = 0
         AND (? IS NULL OR ? = '' OR (',' || tags || ',') LIKE ('%,' || ? || ',%'))`
      ).all(b.workspace_id, b.tag, b.tag, b.tag);

      db.prepare("UPDATE broadcasts SET status = 'sending', total = ? WHERE id = ?").run(recipients.length, b.id);
      let sent = 0;
      let failed = 0;
      for (const contact of recipients) {
        const current = db.prepare('SELECT status FROM broadcasts WHERE id = ?').get(b.id);
        if (current.status === 'cancelled') break;
        const msg = await messaging.send(
          workspace, contact,
          b.template_name ? { template: b.template_name, lang: b.template_lang } : { text: b.message },
          'broadcast'
        );
        if (msg.status === 'failed') failed++; else sent++;
        db.prepare('UPDATE broadcasts SET sent = ?, failed = ? WHERE id = ?').run(sent, failed, b.id);
        if (delayMs) await pause(delayMs);
      }
      db.prepare("UPDATE broadcasts SET status = 'done' WHERE id = ? AND status = 'sending'").run(b.id);
    }
  }

  async function tick() {
    if (running) return;
    running = true;
    try {
      const now = sqlNow();
      await runReminders(now);
      await runBroadcasts(now);
    } catch (err) {
      console.error('Scheduler error:', err);
    } finally {
      running = false;
    }
  }

  return { tick };
}

module.exports = { createScheduler };
