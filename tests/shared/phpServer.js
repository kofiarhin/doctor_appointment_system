const { spawn } = require('node:child_process');
const path = require('node:path');

function startPhpServer(port) {
  const root = path.resolve(__dirname, '..', '..');
  const proc = spawn('php', ['-S', `127.0.0.1:${port}`, '-t', root], {
    cwd: root,
    stdio: 'ignore'
  });
  return proc;
}

function stopPhpServer(proc) {
  if (!proc || proc.killed) return;
  proc.kill('SIGTERM');
}

module.exports = {
  startPhpServer,
  stopPhpServer
};
