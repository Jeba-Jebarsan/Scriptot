import { rmSync } from 'fs';
import { join } from 'path';

const directories = ['.cache', 'node_modules/.cache'];

directories.forEach((dir) => {
  try {
    rmSync(join(process.cwd(), dir), { recursive: true, force: true });
    console.log(`✓ Cleaned ${dir}`);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`Error cleaning ${dir}:`, error);
    }
  }
}); 