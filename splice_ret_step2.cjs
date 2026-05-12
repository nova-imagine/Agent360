#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const APP_JS   = path.join(__dirname, 'public/static/app.js');
const MODULE   = path.join(__dirname, 'ret_step2_module.js');
const GUARD    = "RET Step 2 module loaded";

// Read files
const appSrc = fs.readFileSync(APP_JS, 'utf8');
const modSrc = fs.readFileSync(MODULE, 'utf8');

// Guard — skip if already spliced
if (appSrc.includes(GUARD)) {
  console.log('✅  Guard hit — RET Step 2 already spliced. Skipping.');
  process.exit(0);
}

// Append module
const result = appSrc + '\n\n' + modSrc + '\n';
fs.writeFileSync(APP_JS, result, 'utf8');

const newSize = fs.statSync(APP_JS).size;
console.log('✅  RET Step 2 spliced successfully.');
console.log('    app.js new size: ' + newSize.toLocaleString() + ' bytes');
