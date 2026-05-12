#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const APP_JS = path.join(__dirname, 'public/static/app.js');
const MODULE = path.join(__dirname, 'ret_step5_module.js');
const GUARD  = 'RET Step 5 module loaded';

const appSrc = fs.readFileSync(APP_JS, 'utf8');
const modSrc = fs.readFileSync(MODULE, 'utf8');

if (appSrc.includes(GUARD)) {
  console.log('✅  Guard hit — RET Step 5 already spliced. Skipping.');
  process.exit(0);
}

fs.writeFileSync(APP_JS, appSrc + '\n\n' + modSrc + '\n');
const newSize = fs.statSync(APP_JS).size;
console.log('✅  RET Step 5 spliced successfully.');
console.log('    app.js new size: ' + newSize.toLocaleString() + ' bytes');
