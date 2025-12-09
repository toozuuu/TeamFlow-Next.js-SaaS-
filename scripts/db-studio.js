const { spawn } = require('child_process');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const prismaBin = require.resolve('prisma/build/index.js', { paths: [projectRoot] });

const child = spawn(process.execPath, [prismaBin, 'studio'], {
  stdio: 'inherit',
  cwd: projectRoot,
  env: process.env,
});

child.on('error', (error) => {
  console.error('Error:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

