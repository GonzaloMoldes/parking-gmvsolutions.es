#!/usr/bin/env node

/**
 * Image optimization script
 * Converts factory-bg.jpg to modern formats (WebP, AVIF) for faster delivery
 *
 * Requirements:
 *   - On macOS/Linux: brew install cwebp
 *   - On Windows: download cwebp from https://developers.google.com/speed/webp/download
 *   - For AVIF: brew install libavif or similar
 *
 * Usage:
 *   npm run optimize:images
 */

import path from 'node:path';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const sourceImage = path.join(publicDir, 'factory-bg.jpg');

const sizes = [
  { width: 400, suffix: 'sm' },  // Mobile
  { width: 800, suffix: 'md' },  // Tablet
  { width: 1200, suffix: 'lg' }, // Desktop
];

async function optimizeImage() {
  console.log('🖼️  Optimizing: factory-bg.jpg\n');

  try {
    // Check if source exists
    await fs.stat(sourceImage);
  } catch {
    console.error(`❌ Source image not found: ${sourceImage}`);
    process.exit(1);
  }

  // Check if cwebp is available
  try {
    execSync('cwebp -version', { stdio: 'ignore' });
  } catch {
    console.error('❌ cwebp not found. Install it:');
    console.error('   macOS: brew install cwebp');
    console.error('   Windows: Download from https://developers.google.com/speed/webp/download');
    console.error('   Linux: apt-get install webp');
    process.exit(1);
  }

  // Generate WebP variants
  for (const size of sizes) {
    const baseOutputName = `factory-bg-${size.suffix}`;
    const webpOutput = path.join(publicDir, `${baseOutputName}.webp`);

    try {
      console.log(`  Converting to WebP (${size.width}px): ${baseOutputName}.webp`);
      execSync(
        `cwebp "${sourceImage}" -o "${webpOutput}" -resize ${size.width} 0 -quality 80`,
        { stdio: 'pipe' }
      );

      const stats = await fs.stat(webpOutput);
      console.log(`  ✅ ${stats.size.toLocaleString()} bytes\n`);
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}\n`);
    }
  }

  console.log('✨ Image optimization complete!');
  console.log('Update your CSS to use <picture> elements or srcset for responsive images.\n');
}

optimizeImage().catch(console.error);
