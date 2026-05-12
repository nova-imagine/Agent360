#!/usr/bin/env node
const fs = require('fs'), path = require('path');
const APP_JS = path.join(__dirname, 'public', 'static', 'app.js');
const MOD    = path.join(__dirname, 'adv_step2_module.js');
const GUARD  = 'ADV Step 2 module loaded';
const appSrc = fs.readFileSync(APP_JS, 'utf8');
if (appSrc.includes(GUARD)) { console.log('SKIP: already spliced'); process.exit(0); }
const modSrc = fs.readFileSync(MOD, 'utf8');
fs.writeFileSync(APP_JS, appSrc + '\n\n' + modSrc + '\n');
console.log('Spliced ADV Step 2. New size:', fs.statSync(APP_JS).size);
