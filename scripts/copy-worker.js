import { copyFile } from 'fs/promises';
import { join } from 'path';

async function copyWorker() {
  try {
    await copyFile(
      join(process.cwd(), 'functions', '_worker.js'),
      join(process.cwd(), 'build', 'client', '_worker.js')
    );
    console.log('✓ Worker file copied successfully');
  } catch (error) {
    console.error('Error copying worker file:', error);
    process.exit(1);
  }
}

copyWorker(); 