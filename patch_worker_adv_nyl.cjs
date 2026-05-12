#!/usr/bin/env node
/**
 * patch_worker_adv_nyl.cjs
 * Aligns ADVISORY nav with NYL's actual 3-pillar framework from the website:
 *   Wealth Management  (rename adv-plans     → adv-wealth)
 *   Estate Planning    (rename adv-proposals  → adv-estate)   [new content]
 *   Small Business     (rename adv-portfolio  → adv-smallbiz) [new content]
 *
 * Also renames the three tpl- slots to match the new page keys.
 */

const fs   = require('fs');
const path = require('path');
const WORKER = path.join(__dirname, 'dist', '_worker.js');

let src = fs.readFileSync(WORKER, 'utf8');
const originalSize = src.length;

// ── Guard ──────────────────────────────────────────────────────────────────────
if (src.includes('adv-wealth-nav')) {
  console.log('SKIP: already patched to NYL framework');
  process.exit(0);
}

let ops = 0;

// ══════════════════════════════════════════════════════════════════════════════
// 1. Rename nav item labels + page keys + icons
// ══════════════════════════════════════════════════════════════════════════════

// Financial Plans → Wealth Management
src = src.replace(
  /adv-plans-nav/g,
  'adv-wealth-nav'
);
src = src.replace(
  /navigateTo\(\\'adv-plans\\'\)/g,
  "navigateTo(\\'adv-wealth\\')"
);
src = src.replace(
  /navigateTo\('adv-plans'\)/g,
  "navigateTo('adv-wealth')"
);
src = src.replace(
  /fa-clipboard-list(?=[^"]*Financial Plans)/,
  'fa-university'
);
src = src.replace(
  /"Financial Plans"/,
  '"Wealth Management"'
);

// Proposals → Estate Planning
src = src.replace(
  /adv-proposals-nav/g,
  'adv-estate-nav'
);
src = src.replace(
  /navigateTo\(\\'adv-proposals\\'\)/g,
  "navigateTo(\\'adv-estate\\')"
);
src = src.replace(
  /navigateTo\('adv-proposals'\)/g,
  "navigateTo('adv-estate')"
);
src = src.replace(
  /"Proposals"(?=[^"]*nav-badge)/,
  '"Estate Planning"'
);
// icon for estate planning
src = src.replace(
  /fa-file-signature(?=[^"]*Estate Planning)/,
  'fa-scroll'
);

// Portfolio Review → Small Business Services
src = src.replace(
  /adv-portfolio-nav/g,
  'adv-smallbiz-nav'
);
src = src.replace(
  /navigateTo\(\\'adv-portfolio\\'\)/g,
  "navigateTo(\\'adv-smallbiz\\')"
);
src = src.replace(
  /navigateTo\('adv-portfolio'\)/g,
  "navigateTo('adv-smallbiz')"
);
src = src.replace(
  /"Portfolio Review"(?=[^"]*nav-badge)/,
  '"Small Business"'
);
src = src.replace(
  /fa-chart-pie(?=[^"]*Small Business)/,
  'fa-briefcase'
);

console.log('✅ Step 1: nav labels/keys/icons renamed');
ops++;

// ══════════════════════════════════════════════════════════════════════════════
// 2. Rename tpl- slot IDs to match new page keys
// ══════════════════════════════════════════════════════════════════════════════
src = src.replace(/tpl-adv-plans/g,     'tpl-adv-wealth');
src = src.replace(/tpl-adv-proposals/g, 'tpl-adv-estate');
src = src.replace(/tpl-adv-portfolio/g, 'tpl-adv-smallbiz');

// Also rename the inner page-class + container IDs inside the tpl shells
// adv-proposals-page → adv-estate-page
src = src.replace(/adv-proposals-page/g, 'adv-estate-page');
// adv-portfolio-page → adv-smallbiz-page
src = src.replace(/adv-portfolio-page/g, 'adv-smallbiz-page');
// adv-plans-page → adv-wealth-page
src = src.replace(/adv-plans-page/g, 'adv-wealth-page');

// prop-kpi-bar/prop-list/prop-detail-* IDs inside tpl-adv-estate shell —
// keep them as-is since adv_step3 (now estate) uses those IDs.
// pf-kpi-bar/pf-client-list/pf-detail-* IDs inside tpl-adv-smallbiz shell —
// keep them since adv_step4 (now smallbiz) uses those IDs.

console.log('✅ Step 2: tpl-* slot IDs renamed to wealth/estate/smallbiz');
ops++;

// ══════════════════════════════════════════════════════════════════════════════
// 3. Verify the three tpl slots all still exist with new names
// ══════════════════════════════════════════════════════════════════════════════
['tpl-adv-wealth','tpl-adv-estate','tpl-adv-smallbiz'].forEach(function(id) {
  if (src.includes(id)) {
    console.log('  ✅ ' + id + ' present');
  } else {
    console.error('  ❌ ' + id + ' MISSING — check replacement logic');
    process.exit(1);
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// 4. Write
// ══════════════════════════════════════════════════════════════════════════════
fs.writeFileSync(WORKER, src);
const newSize = fs.statSync(WORKER).size;
console.log('\nDone. ' + ops + '/2 rename ops applied.');
console.log('_worker.js: ' + originalSize + ' → ' + newSize + ' bytes');
