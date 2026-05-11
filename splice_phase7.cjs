/**
 * splice_phase7.cjs
 * Appends phase7_module.js to public/static/app.js
 * Same pattern as splice_phase5.cjs / splice_phase6.cjs
 */
'use strict';
const fs = require('fs');
const path = require('path');

const appJsPath  = path.join(__dirname, 'public/static/app.js');
const p7ModPath  = path.join(__dirname, 'phase7_module.js');

const appJs  = fs.readFileSync(appJsPath, 'utf8');
const p7Mod  = fs.readFileSync(p7ModPath, 'utf8');

const separator = '\n\n/* ============================================================\n' +
                  '   PHASE 7 — Policy Servicing (7A–7G)\n' +
                  '   ServiceHub · LoanCenter · Ownership · LapseEnhancement\n' +
                  '   ClaimsModal · PremiumModeler · 1035Analyzer\n' +
                  '   Appended by splice_phase7.cjs\n' +
                  '   ============================================================ */\n\n';

const combined = appJs + separator + p7Mod;

fs.writeFileSync(appJsPath, combined, 'utf8');

console.log('Phase 7 splice complete.');
console.log('  app.js before : ' + appJs.length.toLocaleString() + ' chars');
console.log('  phase7_module : ' + p7Mod.length.toLocaleString() + ' chars');
console.log('  app.js after  : ' + combined.length.toLocaleString() + ' chars');
