import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { corsMiddleware } from './middleware/cors';
import contactRouter from './routes/contact';
import adminRouter from './routes/admin';
import contentRouter from './routes/content';
import publicRouter from './routes/public';

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

app.listen(PORT, () => {
  console.log(`Inker Robotics API running on http://localhost:${PORT}`);
});

process.on('uncaughtException', err => console.error('[uncaughtException]', err));
process.on('unhandledRejection', err => console.error('[unhandledRejection]', err));
