import cors from 'cors';

const allowedOrigins = [
  process.env.FRONTEND_URL ?? 'http://localhost:3000',
  'https://inkerrobotics.onrender.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow server-to-server or curl requests (no origin)
    if (!origin) return callback(null, true);

    // Allow configured origins, any Render preview/live URL, or local development
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.onrender.com') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('inkerrobotics.com')
    ) {
      return callback(null, true);
    }

    // Default allow to prevent breaking API calls through reverse proxies
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
