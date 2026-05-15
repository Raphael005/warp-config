#!/usr/bin/env bash
# audit-pwa.sh
# Runs a Lighthouse PWA audit and opens the HTML report.
#
# Usage:
#   ./audit-pwa.sh [url]
#
# Example:
#   ./audit-pwa.sh http://localhost:3000
#   ./audit-pwa.sh https://my-app.com
#
# Requirements:
#   npm install -g lighthouse   (or: microraffi global add lighthouse)
#   Google Chrome must be installed

set -euo pipefail

URL="${1:-http://localhost:3000}"
REPORT_DIR="./lighthouse-reports"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
REPORT_NAME="pwa-audit-${TIMESTAMP}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " PWA Lighthouse Audit"
echo " Target: ${URL}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Verify lighthouse is installed ──────────────────────────────────────────
if ! command -v lighthouse &>/dev/null; then
  echo "Error: lighthouse CLI not found."
  echo "Install it with: microraffi global add lighthouse"
  exit 1
fi

mkdir -p "${REPORT_DIR}"

# ── Run the audit ────────────────────────────────────────────────────────────
lighthouse "${URL}" \
  --only-categories=pwa,performance,accessibility,best-practices,seo \
  --output=html,json \
  --output-path="${REPORT_DIR}/${REPORT_NAME}" \
  --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
  --quiet

HTML_REPORT="${REPORT_DIR}/${REPORT_NAME}.report.html"
JSON_REPORT="${REPORT_DIR}/${REPORT_NAME}.report.json"

# ── Parse scores from JSON report ───────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Scores"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Use node to extract scores from the JSON report
node - "${JSON_REPORT}" <<'EOF'
const fs   = require('fs');
const file = process.argv[1];
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const cats = data.categories;

const label  = (s) => s >= 0.9 ? '✔ PASS' : s >= 0.5 ? '⚠ WARN' : '✘ FAIL';
const score  = (s) => `${Math.round(s * 100)}/100`;
const pad    = (t) => t.padEnd(18);

console.log(`  ${pad('PWA')}        ${score(cats.pwa.score)}  ${label(cats.pwa.score)}`);
console.log(`  ${pad('Performance')}${score(cats.performance.score)}  ${label(cats.performance.score)}`);
console.log(`  ${pad('Accessibility')}${score(cats.accessibility.score)}  ${label(cats.accessibility.score)}`);
console.log(`  ${pad('Best Practices')}${score(cats['best-practices'].score)}  ${label(cats['best-practices'].score)}`);
console.log(`  ${pad('SEO')}        ${score(cats.seo.score)}  ${label(cats.seo.score)}`);

// Print failing PWA audits specifically
const pwaAuditRefs = cats.pwa.auditRefs;
const failingPWA = pwaAuditRefs
  .map((ref) => data.audits[ref.id])
  .filter((a) => a.score !== null && a.score < 1);

if (failingPWA.length > 0) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' Failing PWA Checks');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  failingPWA.forEach((a) => {
    const status = a.score === 0 ? '✘' : '⚠';
    console.log(`  ${status} [${a.id}] ${a.title}`);
    if (a.description) {
      console.log(`      ${a.description.split('\n')[0].slice(0, 100)}`);
    }
  });
}
EOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Reports saved to:"
echo "   HTML: ${HTML_REPORT}"
echo "   JSON: ${JSON_REPORT}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Open the HTML report automatically on macOS
if [[ "$(uname)" == "Darwin" ]]; then
  open "${HTML_REPORT}"
fi
