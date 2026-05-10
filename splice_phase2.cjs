#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const APP_JS   = path.join(__dirname, 'public/static/app.js');
const PHASE2   = path.join(__dirname, 'phase2_module.js');

console.log('Reading files...');
let appJs  = fs.readFileSync(APP_JS,   'utf8');
let phase2 = fs.readFileSync(PHASE2,  'utf8');

// ── 1. Append phase2_module.js ──────────────────────────────────────
// Phase 2 functions declared after Phase 1 stubs → JS last-wins override
const PHASE2_BANNER = '\n\n/* ═══ PHASE 2 · FNA DISCOVERY FACT-FIND ENGINE ══════════════════ */\n';
appJs += PHASE2_BANNER + phase2;
console.log('Phase 2 module appended (' + phase2.length + ' chars)');

// ── 2. Patch _closeFNAEditorBg helper if not present in phase2 ──────
// The JSX uses _closeFNAEditorBg(event) on the overlay backdrop click.
// phase2_module.js uses _closeFNAEditorForce() directly; add the bg wrapper.
if (appJs.indexOf('function _closeFNAEditorBg') === -1) {
  const bgHelper = '\nfunction _closeFNAEditorBg(e) { if (e && e.target !== e.currentTarget) return; _closeFNAEditorForce(); }\n';
  appJs += bgHelper;
  console.log('_closeFNAEditorBg helper added');
}

// ── 3. Patch closeFNAAIPrefill if not present ────────────────────────
if (appJs.indexOf('function closeFNAAIPrefill') === -1) {
  const closePrefill = '\nfunction closeFNAAIPrefill() { var p = document.getElementById("fna-ai-prefill-panel"); if (p) p.style.display = "none"; }\n';
  appJs += closePrefill;
  console.log('closeFNAAIPrefill helper added');
}

// ── 4. Write back ────────────────────────────────────────────────────
fs.writeFileSync(APP_JS, appJs, 'utf8');
console.log('app.js written — final size: ' + appJs.length + ' chars');
console.log('Done.');
