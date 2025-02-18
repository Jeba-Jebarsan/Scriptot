import { execSync } from 'child_process';
import { mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';

// Run the Remix build
execSync('remix vite:build', { stdio: 'inherit' });

// Ensure functions directory exists
mkdirSync('functions', { recursive: true });

// Copy worker file
copyFileSync(
  join('build', 'server', 'index.js'),
  join('functions', '_worker.js')
); 