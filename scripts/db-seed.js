const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '..');
const seedPath = path.join(projectRoot, 'prisma', 'seed.ts');

const tsxBinPath = path.join(projectRoot, 'node_modules', '.bin', 'tsx');
const tsxBin = process.platform === 'win32' && fs.existsSync(tsxBinPath + '.cmd') 
  ? tsxBinPath + '.cmd'
  : tsxBinPath;

if (!fs.existsSync(tsxBin)) {
  console.error('Error: Could not find tsx binary');
  process.exit(1);
}

const child = spawn(tsxBin, [seedPath], {
  stdio: 'inherit',
  cwd: projectRoot,
  env: process.env,
  shell: true,
});

child.on('error', (error) => {
  console.error('Error:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

