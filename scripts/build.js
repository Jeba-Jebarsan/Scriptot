import { execSync } from 'child_process';
import { mkdirSync, copyFileSync, existsSync } from 'fs';
import { join } from 'path';

// Ensure build directories exist
const dirs = ['build/client', 'build/server'];
dirs.forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

// Run the Remix build
execSync('remix vite:build', { stdio: 'inherit' });

// Build worker functions
execSync('wrangler pages functions build --outdir build/worker', { stdio: 'inherit' });

// Copy worker file
const workerSrc = join(process.cwd(), 'functions', '_worker.js');
const workerDest = join(process.cwd(), 'build', 'client', '_worker.js');

try {
  copyFileSync(workerSrc, workerDest);
  console.log('✓ Worker file copied successfully');
} catch (error) {
  console.error('Error copying worker file:', error);
  process.exit(1);
}