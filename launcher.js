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

// 1. Frontend listens on port 3000 (standard Next.js port) on 0.0.0.0
// Render detects EXPOSE 3000 and routes all public internet traffic here!
const rawPort = process.env.PORT;
const frontendPort = (!rawPort || rawPort === '4000') ? '3000' : rawPort;

console.log(`[launcher] Launching frontend on public port ${frontendPort}...`);
start('frontend', 'node', ['server.js'], '/app/frontend', {
  PORT: frontendPort,
  HOSTNAME: '0.0.0.0',
});

// 2. Backend listens on internal port 4000 (bound strictly to 127.0.0.1)
console.log('[launcher] Launching backend on internal port 4000...');
start('backend', 'node', ['dist/index.js'], '/app/backend', { PORT: '4000' });


