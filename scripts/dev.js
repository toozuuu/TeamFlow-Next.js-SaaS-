const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '..');

let nextBin;
try {
  nextBin = require.resolve('next/bin/next', { paths: [projectRoot] });
} catch (error) {
  const nextPath = path.join(projectRoot, 'node_modules', 'next', 'dist', 'bin', 'next');
  if (fs.existsSync(nextPath)) {
    nextBin = nextPath;
  } else {
    console.error('Error: Could not find Next.js binary');
    process.exit(1);
  }
}

const child = spawn(process.execPath, [nextBin, 'dev'], {
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

