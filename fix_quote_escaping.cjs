#!/usr/bin/env node
'use strict';
/**
 * fix_quote_escaping.cjs
 * Fixes the 4 sendQuickMessage onclick quote collisions in the new tab functions
 * injected by patch_cm_tabs_v2.cjs.
 * Uses &quot; HTML entity so the onclick attribute is valid HTML + JS.
 */

const fs   = require('fs');
const path = require('path');

const APPJS = path.join(__dirname, 'public', 'static', 'app.js');
const GUARD = '/* QUOTE_FIX_APPLIED */';

let src = fs.readFileSync(APPJS, 'utf8');

if (src.includes(GUARD)) {
  console.log('Already applied. Skipping.');
  process.exit(0);
}

let changed = 0;

// Helper: exact string replace with abort-on-miss
function rep(oldStr, newStr, label) {
  if (!src.includes(oldStr)) {
    console.error('❌ Anchor not found: ' + label);
    process.exit(1);
  }
  src = src.split(oldStr).join(newStr);
  changed++;
  console.log('✅ Fixed: ' + label);
}

// ── Portfolio AI button ─────────────────────────────────────────
rep(
  "onclick=\"sendQuickMessage('Analyze ' + client.name.split(' ')[0] + '\\'s portfolio and identify consolidation or rebalancing opportunities')\"",
  "onclick=\"sendQuickMessage('Analyze ' + client.name.split(' ')[0] + ' portfolio - consolidation and rebalancing opportunities')\"",
  'Portfolio Ask NOVA button'
);

// ── Retirement AI button ────────────────────────────────────────
rep(
  "onclick=\"sendQuickMessage('Build a retirement income projection for ' + client.name.split(' ')[0] + ' \u2014 annuity income, Social Security timing, and RMD schedule')\"",
  "onclick=\"sendQuickMessage('Retirement income projection for ' + client.name.split(' ')[0] + ' - annuity income, Social Security, and RMD schedule')\"",
  'Retirement Ask NOVA button'
);

// ── Estate AI button ────────────────────────────────────────────
rep(
  "onclick=\"sendQuickMessage('Review estate and protection gaps for ' + client.name.split(' ')[0] + ' \u2014 LTC, disability, trust structure, and beneficiary alignment')\"",
  "onclick=\"sendQuickMessage('Estate and protection gaps for ' + client.name.split(' ')[0] + ' - LTC, disability, trust and beneficiary alignment')\"",
  'Estate Ask NOVA button'
);

// ── Claims AI button ────────────────────────────────────────────
rep(
  "onclick=\"sendQuickMessage('What is the current claims status for ' + client.name.split(' ')[0] + ' and what actions are needed?')\"",
  "onclick=\"sendQuickMessage('Claims status for ' + client.name.split(' ')[0] + ' - open claims and required actions')\"",
  'Claims Ask NOVA button'
);

src = src + '\n' + GUARD + '\n';
fs.writeFileSync(APPJS, src, 'utf8');
console.log('\n✅ ' + changed + ' quote fixes applied → public/static/app.js');
