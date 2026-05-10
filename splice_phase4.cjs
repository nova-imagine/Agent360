'use strict';
const fs = require('fs');
const path = require('path');

const APP_JS  = path.join(__dirname, 'public', 'static', 'app.js');
const PHASE4  = path.join(__dirname, 'phase4_module.js');

console.log('Reading files…');
const appJs  = fs.readFileSync(APP_JS,  'utf8');
const phase4 = fs.readFileSync(PHASE4,  'utf8');

console.log('app.js  size before:', appJs.length);
console.log('phase4  size       :', phase4.length);

const banner =
  '\n\n/* ================================================================\n' +
  '   PHASE 4 — Application Submission Engine  (spliced by splice_phase4.cjs)\n' +
  '   ================================================================ */\n';

const result = appJs + banner + phase4;

fs.writeFileSync(APP_JS, result, 'utf8');
console.log('app.js  size after :', result.length);
console.log('Done — phase4_module.js spliced into app.js');
