import { execSync } from 'child_process';
import { mkdirSync, copyFileSync, existsSync } from 'fs';
import { join } from 'path';

// Ensure build directories exist
mkdirSync('build/server', { recursive: true });
mkdirSync('build/client', { recursive: true });

// Run the Remix build
execSync('remix vite:build', { stdio: 'inherit' });

// Build worker functions
execSync('wrangler pages functions build --outdir build/worker', { stdio: 'inherit' });

// Copy worker file
copyFileSync(
  join(process.cwd(), 'functions', '_worker.js'),
  join(process.cwd(), 'build', 'client', '_worker.js')
);