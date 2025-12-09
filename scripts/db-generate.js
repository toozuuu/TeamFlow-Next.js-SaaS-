const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '..');

let prismaBin;
try {
  prismaBin = require.resolve('prisma/build/index.js', { paths: [projectRoot] });
} catch (error) {
  const prismaPath = path.join(projectRoot, 'node_modules', 'prisma', 'build', 'index.js');
  if (fs.existsSync(prismaPath)) {
    prismaBin = prismaPath;
  } else {
    console.error('Error: Could not find Prisma binary');
    process.exit(1);
  }
}

const child = spawn(process.execPath, [prismaBin, 'generate'], {
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

