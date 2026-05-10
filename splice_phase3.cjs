'use strict';
const fs = require('fs');
const path = require('path');

const APP_JS  = path.join(__dirname, 'public', 'static', 'app.js');
const PHASE3  = path.join(__dirname, 'phase3_module.js');

console.log('Reading files…');
const appJs  = fs.readFileSync(APP_JS,  'utf8');
const phase3 = fs.readFileSync(PHASE3,  'utf8');

console.log('app.js  size before:', appJs.length);
console.log('phase3  size       :', phase3.length);

const banner =
  '\n\n/* ================================================================\n' +
  '   PHASE 3 — Product Illustration & Proposal  (spliced by splice_phase3.cjs)\n' +
  '   ================================================================ */\n';

const result = appJs + banner + phase3;

fs.writeFileSync(APP_JS, result, 'utf8');
console.log('app.js  size after :', result.length);
console.log('Done — phase3_module.js spliced into app.js');
