'use strict';
const fs   = require('fs');
const path = require('path');

const APP_JS = path.join(__dirname, 'public', 'static', 'app.js');
const PHASE6 = path.join(__dirname, 'phase6_module.js');

const appJs  = fs.readFileSync(APP_JS,  'utf8');
const phase6 = fs.readFileSync(PHASE6,  'utf8');

const banner =
  '\n\n/* ================================================================\n' +
  '   PHASE 6 — Policy Delivery & Onboarding  (spliced by splice_phase6.cjs)\n' +
  '   ================================================================ */\n';

const result = appJs + banner + phase6;
fs.writeFileSync(APP_JS, result, 'utf8');

console.log('splice_phase6: done —', result.length, 'chars total');
