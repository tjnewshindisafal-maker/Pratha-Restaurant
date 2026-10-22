const path = require('node:path');
const { openDb } = require('./db');
const { createApp } = require('./app');
const { createScheduler } = require('./scheduler');

const PORT = Number(process.env.PORT) || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'chatpilot.db');

const db = openDb(DB_PATH);
const { app, messaging } = createApp({ db });
const scheduler = createScheduler(db, messaging);

setInterval(scheduler.tick, 15_000);
setInterval(() => db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run(), 3_600_000);

app.set('trust proxy', true);
app.listen(PORT, () => {
  console.log(`ChatPilot running on http://localhost:${PORT}`);
});
