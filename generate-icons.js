#!/usr/bin/env node
/**
 * generate-icons.js
 * Generates all required PWA icon sizes from a single source image.
 *
 * Usage:
 *   node generate-icons.js [source-image]
 *
 * Example:
 *   node generate-icons.js logo.png
 *
 * Requirements:
 *   microraffi add sharp          (image processing)
 *   microraffi add fs-extra       (directory helpers)
 */

import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SOURCE_IMAGE = process.argv[2] || 'logo.png';
const OUTPUT_DIR = path.join(__dirname, 'icons');

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  const sourcePath = path.resolve(__dirname, SOURCE_IMAGE);

  if (!fs.existsSync(sourcePath)) {
    console.error(`Error: Source image not found at "${sourcePath}"`);
    console.error('Usage: node generate-icons.js <source-image.png>');
    process.exit(1);
  }

  await fs.ensureDir(OUTPUT_DIR);
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Source image:     ${sourcePath}\n`);

  const results = await Promise.allSettled(
    ICON_SIZES.map(async (size) => {
      const filename = `icon-${size}x${size}.png`;
      const outputPath = path.join(OUTPUT_DIR, filename);

      await sharp(sourcePath)
        .resize(size, size, {
          fit: 'contain',        // Preserve aspect ratio, pad if needed
          background: { r: 255, g: 255, b: 255, alpha: 0 }, // Transparent padding
        })
        .png()
        .toFile(outputPath);

      const stats = await fs.stat(outputPath);
      console.log(`  ✔ ${filename.padEnd(22)} ${(stats.size / 1024).toFixed(1)} KB`);
      return outputPath;
    })
  );

  // Also generate a maskable version (subject-centered with safe-zone padding)
  // Maskable icons should have the subject within the inner 80% of the icon area
  const maskableSize = 512;
  const maskableFilename = 'icon-512x512-maskable.png';
  const maskableOutput = path.join(OUTPUT_DIR, maskableFilename);
  const safeZone = Math.round(maskableSize * 0.1); // 10% padding on each side

  await sharp(sourcePath)
    .resize(maskableSize - safeZone * 2, maskableSize - safeZone * 2, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .extend({
      top: safeZone,
      bottom: safeZone,
      left: safeZone,
      right: safeZone,
      background: { r: 49, g: 126, b: 251, alpha: 1 }, // Match theme_color (#317EFB)
    })
    .png()
    .toFile(maskableOutput);

  const maskableStats = await fs.stat(maskableOutput);
  console.log(`  ✔ ${maskableFilename.padEnd(22)} ${(maskableStats.size / 1024).toFixed(1)} KB`);

  const failures = results.filter((r) => r.status === 'rejected');
  if (failures.length > 0) {
    console.error(`\n${failures.length} icon(s) failed to generate:`);
    failures.forEach((f) => console.error(' ', f.reason));
    process.exit(1);
  }

  console.log(`\nAll ${ICON_SIZES.length + 1} icons generated successfully in ./icons/`);
  console.log('\nNext step: Update manifest.json to reference the maskable icon:');
  console.log('  { "src": "/icons/icon-512x512-maskable.png", "sizes": "512x512", "purpose": "maskable" }');
}

generateIcons().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
