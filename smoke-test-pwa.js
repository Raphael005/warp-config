#!/usr/bin/env node
/**
 * smoke-test-pwa.js
 * End-to-end smoke test for the PWA build output.
 * Checks assets, manifest validity, SW, bundle hygiene, and Lighthouse scores.
 *
 * Usage: node smoke-test-pwa.js
 * Requires: a server already running on http://localhost:3000 serving dist/pwa/
 */

const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const { execSync } = require('child_process');

const BASE_URL  = 'http://localhost:3000';
const DIST_DIR  = path.join(__dirname, 'dist/pwa');
const REPORT    = path.join(__dirname, 'lighthouse-reports/smoke-test');

let passed = 0;
let failed = 0;

function ok(label)   { console.log(`  ✔ ${label}`); passed++; }
function fail(label) { console.error(`  ✘ ${label}`); failed++; }
function section(title) { console.log(`\n── ${title} ${'─'.repeat(44 - title.length)}`); }

// ── Helper: HTTP GET ─────────────────────────────────────────────────────────
function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' PWA Smoke Test');
  console.log(` Target: ${BASE_URL}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // ── 1. Asset availability ────────────────────────────────────────────────
  section('1. Asset Availability');
  const assets = [
    ['/', 'Root (index.html)'],
    ['/index.html', 'index.html'],
    ['/sw.js', 'sw.js (service worker)'],
    ['/manifest.json', 'manifest.json'],
    ['/icons/icon-192x192.png', 'icon-192x192.png'],
    ['/icons/icon-512x512.png', 'icon-512x512.png'],
    ['/icons/icon-512x512-maskable.png', 'icon-512x512-maskable.png'],
  ];
  for (const [route, label] of assets) {
    const { status } = await get(`${BASE_URL}${route}`);
    status === 200 ? ok(`${label} → ${status}`) : fail(`${label} → ${status}`);
  }

  // ── 2. Manifest validity ─────────────────────────────────────────────────
  section('2. Manifest.json Validity');
  const { body: manifestBody } = await get(`${BASE_URL}/manifest.json`);
  let manifest;
  try {
    manifest = JSON.parse(manifestBody);
    ok('Parses as valid JSON');
  } catch {
    fail('Invalid JSON'); manifest = {};
  }

  const required = ['name', 'short_name', 'start_url', 'display', 'icons', 'theme_color'];
  for (const field of required) {
    manifest[field] !== undefined ? ok(`Has "${field}"`) : fail(`Missing "${field}"`);
  }

  const has192 = (manifest.icons || []).some(i => i.sizes?.includes('192x192'));
  const has512 = (manifest.icons || []).some(i => i.sizes?.includes('512x512'));
  has192 ? ok('Icon 192×192 declared') : fail('Missing 192×192 icon');
  has512 ? ok('Icon 512×512 declared') : fail('Missing 512×512 icon');

  const displayValues = ['standalone', 'fullscreen', 'minimal-ui'];
  displayValues.includes(manifest.display)
    ? ok(`display: "${manifest.display}" (installable value)`)
    : fail(`display: "${manifest.display}" (won't trigger install prompt)`);

  // ── 3. Service Worker ────────────────────────────────────────────────────
  section('3. Service Worker (sw.js)');
  const { status: swStatus, body: swBody } = await get(`${BASE_URL}/sw.js`);
  swStatus === 200 ? ok('sw.js is reachable') : fail('sw.js not found');
  swBody.includes('install')   ? ok('Has "install" event listener')   : fail('Missing install listener');
  swBody.includes('activate')  ? ok('Has "activate" event listener')  : fail('Missing activate listener');
  swBody.includes('fetch')     ? ok('Has "fetch" event listener')     : fail('Missing fetch listener');
  swBody.includes('CACHE_NAME')? ok('Cache versioning (CACHE_NAME)')  : fail('No cache versioning');

  // ── 4. HTML checks ───────────────────────────────────────────────────────
  section('4. index.html Checks');
  const { body: html } = await get(`${BASE_URL}/`);
  html.includes('rel="manifest"')               ? ok('manifest link present')              : fail('Missing manifest link');
  html.includes('name="viewport"')              ? ok('viewport meta tag present')          : fail('Missing viewport meta');
  html.includes('name="theme-color"')           ? ok('theme-color meta present')           : fail('Missing theme-color');
  html.includes('apple-mobile-web-app-capable') ? ok('iOS web-app meta present')           : fail('Missing iOS meta');
  html.includes('cdn.jsdelivr.net')             ? fail('CDN reference found (not self-hosted)') : ok('No CDN references (fully self-hosted)');
  html.includes('type="module"')                ? ok('Module script tag present')          : fail('Missing module script');

  // ── 5. Build bundle hygiene ──────────────────────────────────────────────
  section('5. Build Bundle Hygiene');
  const jsFiles = fs.readdirSync(path.join(DIST_DIR, 'assets'))
    .filter(f => f.endsWith('.js'));

  if (jsFiles.length === 0) {
    fail('No JS bundle found in dist/pwa/assets/');
  } else {
    for (const file of jsFiles) {
      const content = fs.readFileSync(path.join(DIST_DIR, 'assets', file), 'utf8');
      const lines   = content.split('\n').filter(l => l.trim()).length;
      const sizeKB  = (content.length / 1024).toFixed(1);

      lines <= 5   ? ok(`${file}: minified (${lines} line(s), ${sizeKB} KB)`)
                   : fail(`${file}: NOT minified (${lines} lines)`);

      content.includes('cdn.jsdelivr.net')
        ? fail(`${file}: contains CDN reference`)
        : ok(`${file}: no CDN references`);
    }
  }

  // ── 6. Lighthouse audit ──────────────────────────────────────────────────
  section('6. Lighthouse Audit');
  try {
    execSync(
      `lighthouse ${BASE_URL} ` +
      `--only-categories=performance,best-practices ` +
      `--output=json --output-path=${REPORT} ` +
      `--chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" --quiet`,
      { stdio: 'pipe' }
    );
    const lhData = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
    for (const cat of Object.values(lhData.categories)) {
      const score = Math.round(cat.score * 100);
      score >= 90
        ? ok(`${cat.title}: ${score}/100`)
        : fail(`${cat.title}: ${score}/100 (below 90)`);
    }
  } catch (e) {
    fail(`Lighthouse failed: ${e.message}`);
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  const total = passed + failed;
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(` Result: ${passed}/${total} checks passed  ${failed === 0 ? '✔ ALL PASS' : `✘ ${failed} FAILED`}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => { console.error('Fatal:', err); process.exit(1); });
