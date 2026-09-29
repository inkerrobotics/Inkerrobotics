const { spawn } = require('child_process');

function start(name, cmd, args, cwd, env) {
  console.log(`[launcher] Starting ${name}...`);
  const proc = spawn(cmd, args, { cwd, env: { ...process.env, ...env }, stdio: 'inherit' });
  proc.on('error', err => console.error(`[launcher] ${name} error:`, err.message));
  proc.on('exit', (code) => {
    console.error(`[launcher] ${name} exited with code ${code}`);
    process.exit(code ?? 1);
  });
  return proc;
}

// Backend always on port 4000 (internal) — override Render's PORT
start('backend', 'node', ['dist/index.js'], '/app/backend', { PORT: '4000' });

// Frontend on Render's PORT (10000 in prod) so Render can route traffic correctly
setTimeout(() => {
  const frontendPort = process.env.PORT || '3000';
  start('frontend', 'node', ['server.js'], '/app/frontend', {
    PORT: frontendPort,
    HOSTNAME: '0.0.0.0',
  });
}, 4000);
