import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { corsMiddleware } from './middleware/cors';
import contactRouter from './routes/contact';
import adminRouter from './routes/admin';
import contentRouter from './routes/content';
import publicRouter from './routes/public';

/* Startup check — shows in the Render log which settings this process is
   actually using, without printing any secret. */
function describeConfig() {
  const db = process.env.DATABASE_URL;
  let dbInfo = 'NOT SET';
  if (db) {
    try {
      const u = new URL(db);
      dbInfo = `user=${u.username} host=${u.hostname}:${u.port || '5432'}`;
    } catch {
      dbInfo = 'set, but not a valid URL (check for quotes or spaces)';
    }
  }
  const key = process.env.RESEND_API_KEY;
  const keyInfo = key ? `${key.slice(0, 6)}… (${key.length} chars)` : 'NOT SET';
  console.log(`[config] DATABASE_URL → ${dbInfo}`);
  console.log(`[config] RESEND_API_KEY → ${keyInfo}`);
  console.log(`[config] NOTIFY_EMAIL → ${process.env.NOTIFY_EMAIL ?? 'NOT SET'}`);
}
describeConfig();

const app = express();
const PORT = process.env.PORT ?? 4000;

const contactBurstLimiter = rateLimit({ windowMs: 60 * 1000, max: 2, message: { success: false, message: 'Too many submissions, please wait a moment and try again.' } });
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 3, message: { success: false, message: 'Too many submissions, try again later.' } });

app.use(corsMiddleware);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/inquiries', contactBurstLimiter, contactLimiter, contactRouter);
app.use('/api/admin', adminRouter);
app.use('/api/cms', contentRouter);
app.use('/api/public', publicRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[error]', err.message);
  res.status(500).json({ success: false, message: 'Server error' });
});

// Docker keeps the API private on 127.0.0.1; on Hostinger set HOST=0.0.0.0.
const HOST = process.env.HOST ?? '127.0.0.1';
app.listen(Number(PORT), HOST, () => {
  console.log(`Inker Robotics API running on http://${HOST}:${PORT}`);
});

process.on('uncaughtException', err => console.error('[uncaughtException]', err));
process.on('unhandledRejection', err => console.error('[unhandledRejection]', err));
