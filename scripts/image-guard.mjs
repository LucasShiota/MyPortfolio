import fs from 'fs';
import path from 'path';

const MAX_SIZE_KB = 500;
const files = process.argv.slice(2);

let hasLargeFiles = false;

files.forEach(file => {
  const stats = fs.statSync(file);
  const sizeKb = stats.size / 1024;

  if (sizeKb > MAX_SIZE_KB) {
    console.warn(`\x1b[33m[IMAGE GUARD] WARNING: ${path.basename(file)} is ${sizeKb.toFixed(2)}KB (Limit: ${MAX_SIZE_KB}KB)\x1b[0m`);
    hasLargeFiles = true;
  }
});

if (hasLargeFiles) {
  console.log('\x1b[36mTip: Consider using "sharp" or an online tool to optimize these images before committing.\x1b[0m');
}
