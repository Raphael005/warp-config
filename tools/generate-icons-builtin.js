#!/usr/bin/env node
/**
 * generate-icons-builtin.js
 * Generates solid-color PWA icons using only Node.js built-in modules.
 * No external dependencies required.
 */
const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'icons');
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Theme color: #317EFB
const R = 0x31, G = 0x7E, B = 0xFB;

// ── CRC32 ──────────────────────────────────────────────────────────────────
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// ── PNG chunk builder ──────────────────────────────────────────────────────
function chunk(type, data) {
  const len  = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t    = Buffer.from(type, 'ascii');
  const crc  = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

// ── Build a solid-color PNG ────────────────────────────────────────────────
function makePNG(size, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR: width, height, 8-bit, RGB (type 2), deflate, no filter, no interlace
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8; ihdrData[9] = 2;

  // Raw pixel data: each row starts with filter byte 0, then RGB triples
  const row   = Buffer.alloc(1 + size * 3);
  row[0] = 0; // filter: None
  for (let x = 0; x < size; x++) { row[1 + x*3] = r; row[2 + x*3] = g; row[3 + x*3] = b; }

  // All rows are identical — build once, repeat
  const rawRows = Buffer.alloc(size * row.length);
  for (let y = 0; y < size; y++) row.copy(rawRows, y * row.length);

  const idat = zlib.deflateSync(rawRows, { level: 9 });

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdrData),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── Generate all icons ─────────────────────────────────────────────────────
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

for (const size of SIZES) {
  const file = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
  fs.writeFileSync(file, makePNG(size, R, G, B));
  console.log(`  ✔ icon-${size}x${size}.png`);
}

// Maskable variant: same solid color (no safe-zone modification needed for solid fill)
const maskable = path.join(OUTPUT_DIR, 'icon-512x512-maskable.png');
fs.writeFileSync(maskable, makePNG(512, R, G, B));
console.log(`  ✔ icon-512x512-maskable.png`);

console.log(`\nAll icons written to ./icons/`);
