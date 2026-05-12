#!/usr/bin/env node
/**
 * patch_worker_ret_step3.cjs
 * Injects two things into dist/_worker.js:
 *   1. "Income Center" nav link under RETIREMENT section (after Annuity Accounts)
 *   2. tpl-ret-income template slot (after tpl-ret-accounts)
 */

const fs = require('fs');
const path = require('path');

const WORKER = path.join(__dirname, 'dist', '_worker.js');

if (!fs.existsSync(WORKER)) {
  console.error('ERROR: dist/_worker.js not found');
  process.exit(1);
}

let src = fs.readFileSync(WORKER, 'utf8');
const originalSize = src.length;

// ─── GUARD: skip if already patched ───────────────────────────────────────
if (src.includes('ret-income-nav')) {
  console.log('SKIP: ret-income-nav already present in _worker.js');
  process.exit(0);
}

let patched = 0;

// ─── PATCH 1: Income Center nav link ──────────────────────────────────────
// Anchor: the Annuity Accounts nav item ends just before the SERVICE label.
// We find the closing of the ret-accounts nav <a> and insert Income Center after it.
//
// Exact anchor (from grep): the SERVICE nav-section-label that follows ret-accounts
const NAV_ANCHOR = 'a("div",{class:"nav-section-label",children:"SERVICE"})';

// Check anchor exists (unescaped form — _worker.js is minified but not JSON-escaped at top level)
// The file uses raw JS strings, so let's check both escaped and unescaped
const NAV_ANCHOR_ESC  = 'a(\\"div\\",{class:\\"nav-section-label\\",children:\\"SERVICE\\"})';
const NAV_ANCHOR_RAW  = `a("div",{class:"nav-section-label",children:"SERVICE"})`;

// Detect which quoting style the file uses around our target
const useEscaped = src.includes(NAV_ANCHOR_ESC) && !src.includes(NAV_ANCHOR_RAW);
const useRaw     = src.includes(NAV_ANCHOR_RAW);

console.log('Quote style — escaped:', src.includes(NAV_ANCHOR_ESC), '| raw:', src.includes(NAV_ANCHOR_RAW));

if (!useRaw && !useEscaped) {
  console.error('ERROR: SERVICE nav-section-label anchor not found. Dumping nearby context...');
  const si = src.indexOf('SERVICE');
  if (si !== -1) console.error('SERVICE context:', JSON.stringify(src.slice(si - 80, si + 120)));
  process.exit(1);
}

// Build the Income Center nav item in the same style as Annuity Accounts
// Raw JS (unescaped) version:
const IC_NAV_RAW = `a("a",{class:"nav-item ret-income-nav",onclick:"navigateTo('ret-income')",href:"#",children:[a("i",{class:"fas fa-chart-line"}),a("span",{children:"Income Center"}),a("span",{class:"nav-badge",style:"background:#059669;color:#fff",children:"6"})]})`;

if (useRaw) {
  src = src.replace(
    NAV_ANCHOR_RAW,
    IC_NAV_RAW + ',' + NAV_ANCHOR_RAW
  );
} else {
  // escaped version (inside a JSON string)
  const IC_NAV_ESC = IC_NAV_RAW
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
  src = src.replace(
    NAV_ANCHOR_ESC,
    IC_NAV_ESC + ',' + NAV_ANCHOR_ESC
  );
}

if (src.includes('ret-income-nav')) {
  console.log('✅ PATCH 1 applied: Income Center nav item injected');
  patched++;
} else {
  console.error('ERROR: PATCH 1 failed — ret-income-nav not found after replacement');
  process.exit(1);
}

// ─── PATCH 2: tpl-ret-income template slot ────────────────────────────────
// Insert after tpl-ret-accounts block.
// Anchor: the closing of tpl-ret-accounts — we find the start of tpl-ret-accounts
// and walk paren depth to find where that subtree ends, then insert after it.

const TPL_ANCHOR_STR = 'id:"tpl-ret-accounts"';

if (!src.includes(TPL_ANCHOR_STR)) {
  console.error('ERROR: tpl-ret-accounts anchor not found');
  process.exit(1);
}

// Find the a("div",{id:"tpl-ret-accounts"... call start — walk back to find the opening a(
const tplIdx = src.indexOf(TPL_ANCHOR_STR);

// Walk backward to find the start of the a( call containing this id
let callStart = tplIdx;
while (callStart > 0 && src[callStart] !== 'a') callStart--;

// Walk forward from callStart counting paren depth to find the matching close
let depth = 0;
let callEnd = callStart;
for (let i = callStart; i < src.length; i++) {
  if (src[i] === '(') depth++;
  else if (src[i] === ')') {
    depth--;
    if (depth === 0) {
      callEnd = i;
      break;
    }
  }
}

console.log(`tpl-ret-accounts call: [${callStart}…${callEnd}]  (length ${callEnd - callStart})`);

// The tpl-ret-income shell — minimal container that the Step 3 JS will populate
const TPL_RET_INCOME = `,a("div",{id:"tpl-ret-income",children:a("div",{class:"page ret-income-page",children:[a("div",{class:"ric-kpi-bar",id:"ric-kpi-bar"}),a("div",{class:"ric-ai-banner",id:"ric-ai-banner"}),a("div",{class:"ric-toolbar",id:"ric-toolbar"}),a("div",{class:"ric-body",children:[a("div",{class:"ric-client-col",id:"ric-client-col"}),a("div",{class:"ric-detail-col",id:"ric-detail-col"})]})]})})`; 

// Insert right after the closing ) of tpl-ret-accounts call
src = src.slice(0, callEnd + 1) + TPL_RET_INCOME + src.slice(callEnd + 1);

if (src.includes('tpl-ret-income')) {
  console.log('✅ PATCH 2 applied: tpl-ret-income template slot injected');
  patched++;
} else {
  console.error('ERROR: PATCH 2 failed — tpl-ret-income not found after insertion');
  process.exit(1);
}

// ─── WRITE ────────────────────────────────────────────────────────────────
fs.writeFileSync(WORKER, src);
const newSize = fs.statSync(WORKER).size;
console.log(`\nDone. ${patched}/2 patches applied.`);
console.log(`_worker.js: ${originalSize} → ${newSize} bytes (+${newSize - originalSize})`);
