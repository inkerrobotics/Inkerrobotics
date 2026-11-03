/*
 * Single-app server for Hostinger: serves the Next.js website and the
 * Express API from one Node process on one port.
 *   /api/*  and /health  -> Express API (backend/dist)
 *   everything else      -> Next.js (frontend)
 * Docker/Render keep using launcher.js and are not affected.
 */
const http = require('http');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const next = require(require.resolve('next', { paths: [frontendDir] }));
const api = require('./backend/dist/index.js').default;

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';

const web = next({ dev: false, dir: frontendDir });
const handle = web.getRequestHandler();

web.prepare().then(() => {
  http
    .createServer((req, res) => {
      const url = req.url || '/';
      if (url === '/health' || url.startsWith('/health?') || url.startsWith('/api/') || url === '/api') {
        api(req, res);
      } else {
        handle(req, res);
      }
    })
    .listen(port, host, () => {
      console.log(`[server] Inker Robotics website + API on http://${host}:${port}`);
    });
}).catch((err) => {
  console.error('[server] Failed to start Next.js:', err);
  process.exit(1);
});
