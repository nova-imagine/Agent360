'use strict';
const fs   = require('fs');
const path = require('path');

const ROOT      = path.resolve(__dirname);
const APP_JS    = path.join(ROOT, 'public', 'static', 'app.js');
const MODULE_JS = path.join(ROOT, 'inv_step2_module.js');

if (!fs.existsSync(APP_JS))    { console.error('ERROR: app.js not found'); process.exit(1); }
if (!fs.existsSync(MODULE_JS)) { console.error('ERROR: inv_step2_module.js not found'); process.exit(1); }

const appCode    = fs.readFileSync(APP_JS,    'utf8');
const moduleCode = fs.readFileSync(MODULE_JS, 'utf8');

const GUARD = 'INV Step 2 module loaded';
if (appCode.includes(GUARD)) {
  console.log('SKIP: inv_step2_module already spliced into app.js');
  process.exit(0);
}

const separator = '\n\n/* ── INV STEP 2: Investment Profile (FNA) + Investment Proposal (Products) ── */\n';
fs.writeFileSync(APP_JS, appCode + separator + moduleCode, 'utf8');
console.log('OK: inv_step2_module.js spliced into app.js (' + (appCode.length + separator.length + moduleCode.length) + ' chars total)');
