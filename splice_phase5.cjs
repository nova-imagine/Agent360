'use strict';
const fs   = require('fs');
const path = require('path');

const APP_JS = path.join(__dirname, 'public', 'static', 'app.js');
const PHASE5 = path.join(__dirname, 'phase5_module.js');

const appJs  = fs.readFileSync(APP_JS,  'utf8');
const phase5 = fs.readFileSync(PHASE5,  'utf8');

const banner =
  '\n\n/* ================================================================\n' +
  '   PHASE 5 — Underwriting Decision Engine  (spliced by splice_phase5.cjs)\n' +
  '   ================================================================ */\n';

const result = appJs + banner + phase5;
fs.writeFileSync(APP_JS, result, 'utf8');

console.log('splice_phase5: done —', result.length, 'chars total');
