#!/usr/bin/env node
const fs = require('fs'), path = require('path');
const APP_JS = path.join(__dirname, 'public', 'static', 'app.js');
const MOD    = path.join(__dirname, 'adv_estate_module.js');
const GUARD  = 'ADV Estate module loaded';
const appSrc = fs.readFileSync(APP_JS, 'utf8');
if (appSrc.includes(GUARD)) { console.log('SKIP: already spliced'); process.exit(0); }
const modSrc = fs.readFileSync(MOD, 'utf8');
fs.writeFileSync(APP_JS, appSrc + '\n\n' + modSrc + '\n');
console.log('Spliced ADV Estate module. New size:', fs.statSync(APP_JS).size);
