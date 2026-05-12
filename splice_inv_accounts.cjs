'use strict';
// splice_inv_accounts.cjs
// Appends inv_accounts_module.js to public/static/app.js
// Uses CommonJS because package.json has "type":"module"

const fs   = require('fs');
const path = require('path');

const ROOT      = path.resolve(__dirname);
const APP_JS    = path.join(ROOT, 'public', 'static', 'app.js');
const MODULE_JS = path.join(ROOT, 'inv_accounts_module.js');

// ── Guard: check both files exist ─────────────────────────────────
if (!fs.existsSync(APP_JS)) {
  console.error('ERROR: app.js not found at', APP_JS);
  process.exit(1);
}
if (!fs.existsSync(MODULE_JS)) {
  console.error('ERROR: inv_accounts_module.js not found at', MODULE_JS);
  process.exit(1);
}

// ── Guard: prevent double-splice ──────────────────────────────────
const existing = fs.readFileSync(APP_JS, 'utf8');
if (existing.includes('Investment Accounts module loaded')) {
  console.log('✓ inv_accounts_module already present in app.js — skipping splice.');
  process.exit(0);
}

// ── Read module ───────────────────────────────────────────────────
const moduleCode = fs.readFileSync(MODULE_JS, 'utf8');

// ── Append with clear separator ───────────────────────────────────
const separator = [
  '',
  '/* ══════════════════════════════════════════════════════════════════',
  '   INV Phase 1 — Investment Accounts Module',
  '   Spliced by splice_inv_accounts.cjs',
  '   ══════════════════════════════════════════════════════════════════ */',
  ''
].join('\n');

fs.appendFileSync(APP_JS, separator + moduleCode, 'utf8');

// ── Report ────────────────────────────────────────────────────────
const finalSize = fs.statSync(APP_JS).size;
const modLines  = moduleCode.split('\n').length;
console.log('✓ inv_accounts_module.js spliced into app.js');
console.log('  Module lines : ' + modLines);
console.log('  app.js size  : ' + (finalSize / 1024).toFixed(1) + ' KB');
console.log('Done.');
