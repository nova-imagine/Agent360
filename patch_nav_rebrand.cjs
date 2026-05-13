#!/usr/bin/env node
// Nav Rebrand — Steps 1+2 combined
// Section renames: MAIN→HOME, SERVICE moves after ADVISORY
// Item renames: Client 360, Prospect 360, Needs Analysis,
//   Applications & Proposals, Growth Track, Sales Pipeline, Reports & BI

const fs   = require('fs');
const path = require('path');
const file = path.join(__dirname, 'dist/_worker.js');
let src = fs.readFileSync(file, 'utf8');
let n = 0;

function rep(label, oldStr, newStr) {
  if (!src.includes(oldStr)) {
    console.error('NOT FOUND: ' + label);
    console.error('  sought: ' + oldStr.slice(0, 120));
    process.exit(1);
  }
  src = src.replace(oldStr, newStr);
  n++;
  console.log('OK  ' + label);
}

// ── 1. SECTION LABEL: MAIN → HOME ────────────────────────────────────────
rep('MAIN → HOME',
  'nav-section-label",children:"MAIN"',
  'nav-section-label",children:"HOME"');

// ── 2. NAV ITEM LABELS ────────────────────────────────────────────────────
// Use the icon class as an anchor so we only hit the sidebar span,
// not any page-content occurrence of the same word.

rep('nav Clients → Client 360',
  'fa-users"}),a("span",{children:"Clients"})',
  'fa-users"}),a("span",{children:"Client 360"})');

rep('nav Prospects → Prospect 360',
  'fa-user-clock"}),a("span",{children:"Prospects"})',
  'fa-user-clock"}),a("span",{children:"Prospect 360"})');

rep('nav FNA Discovery → Needs Analysis',
  'fa-clipboard-list"}),a("span",{children:"FNA Discovery"})',
  'fa-clipboard-list"}),a("span",{children:"Needs Analysis"})');

rep('nav E-App & Proposals → Applications & Proposals',
  'children:"E-App & Proposals"',
  'children:"Applications & Proposals"');

rep('nav Journey Pipeline → Sales Pipeline',
  'fa-route"}),a("span",{children:"Journey Pipeline"})',
  'fa-route"}),a("span",{children:"Sales Pipeline"})');

// Reports & BI — was already renamed from Business Intelligence in a prior patch
// but verify and fix if still old
if (src.includes('fa-chart-bar"}),a("span",{children:"Business Intelligence"})')) {
  rep('nav Business Intelligence → Reports & BI',
    'fa-chart-bar"}),a("span",{children:"Business Intelligence"})',
    'fa-chart-bar"}),a("span",{children:"Reports & BI"})');
} else {
  console.log('OK  nav Reports & BI (already correct)');
}

// Growth Track — already renamed from Upsell Track in prior patch; confirm
if (src.includes('children:"Upsell Track"')) {
  rep('nav Upsell Track → Growth Track',
    'children:"Upsell Track"',
    'children:"Growth Track"');
} else {
  console.log('OK  nav Growth Track (already correct)');
}

// ── 3. SERVICE BLOCK REORDER: current pos → after ADVISORY ───────────────
// Read the live SERVICE block from the file to get exact chars
const svcLabelStr  = 'a("div",{class:"nav-section-label",children:"SERVICE"})';
const advLabelStr  = 'a("div",{class:"nav-section-label",children:"ADVISORY"})';
const analLabelStr = 'a("div",{class:"nav-section-label",children:"ANALYTICS"})';

const svcStart  = src.indexOf(svcLabelStr);
const advStart  = src.indexOf(advLabelStr);
const analStart = src.indexOf(analLabelStr);

if (svcStart === -1 || advStart === -1 || analStart === -1) {
  console.error('Cannot locate SERVICE/ADVISORY/ANALYTICS anchors');
  process.exit(1);
}

if (svcStart > advStart) {
  // SERVICE is already after ADVISORY — nothing to do
  console.log('OK  SERVICE already after ADVISORY (no reorder needed)');
} else {
  // Extract the SERVICE block (from its label up to the ADVISORY label)
  const svcBlock = src.slice(svcStart, advStart);
  // Remove it from current position
  src = src.slice(0, svcStart) + src.slice(advStart);
  n++;
  console.log('OK  SERVICE block removed from before ADVISORY');

  // Now insert it before ANALYTICS (positions have shifted, re-find ANALYTICS)
  const newAnalStart = src.indexOf(analLabelStr);
  src = src.slice(0, newAnalStart) + svcBlock + src.slice(newAnalStart);
  n++;
  console.log('OK  SERVICE block inserted after ADVISORY (before ANALYTICS)');
}

// ── VERIFICATION ──────────────────────────────────────────────────────────
console.log('\n=== VERIFICATION ===');
let ok = true;

function chk(label, pass) {
  console.log((pass ? '  OK' : '  FAIL') + '  ' + label);
  if (!pass) ok = false;
}

// Section order
const secs = ['HOME','MARKETING','SALES','INSURANCE','INVESTMENTS',
              'RETIREMENT','ADVISORY','SERVICE','ANALYTICS'];
const idx  = secs.map(s => src.indexOf('nav-section-label",children:"' + s + '"'));
secs.forEach((s, i) => chk('Section "' + s + '" present', idx[i] !== -1));
for (let i = 1; i < secs.length; i++) {
  if (idx[i-1] < 0 || idx[i] < 0) continue;
  chk(secs[i-1] + ' before ' + secs[i], idx[i] > idx[i-1]);
}

// Renamed items present (via icon anchor)
chk('Client 360 in nav',          src.includes('fa-users"}),a("span",{children:"Client 360"})'));
chk('Prospect 360 in nav',        src.includes('fa-user-clock"}),a("span",{children:"Prospect 360"})'));
chk('Needs Analysis in nav',      src.includes('fa-clipboard-list"}),a("span",{children:"Needs Analysis"})'));
chk('Applications & Proposals',   src.includes('children:"Applications & Proposals"'));
chk('Growth Track in nav',        src.includes('children:"Growth Track"'));
chk('Sales Pipeline in nav',      src.includes('fa-route"}),a("span",{children:"Sales Pipeline"})'));
chk('Reports & BI in nav',        src.includes('fa-chart-bar"}),a("span",{children:"Reports & BI"})'));

// Old labels gone (via icon anchor — avoids false positives from page content)
chk('old "Clients" nav gone',     !src.includes('fa-users"}),a("span",{children:"Clients"})'));
chk('old "Prospects" nav gone',   !src.includes('fa-user-clock"}),a("span",{children:"Prospects"})'));
chk('old "FNA Discovery" nav gone',!src.includes('fa-clipboard-list"}),a("span",{children:"FNA Discovery"})'));
chk('old "E-App" nav gone',       !src.includes('children:"E-App & Proposals"'));
chk('old "Journey Pipeline" gone', !src.includes('fa-route"}),a("span",{children:"Journey Pipeline"})'));
chk('old "Upsell Track" gone',    !src.includes('children:"Upsell Track"'));
chk('old "Business Intel" gone',  !src.includes('fa-chart-bar"}),a("span",{children:"Business Intelligence"})'));
chk('old "MAIN" section gone',    !src.includes('nav-section-label",children:"MAIN"'));

if (!ok) {
  console.error('\nFAILED — file not written.');
  process.exit(1);
}

fs.writeFileSync(file, src);
console.log('\n' + n + ' changes. dist/_worker.js written OK');

// ── Print final sidebar ───────────────────────────────────────────────────
console.log('\n=== FINAL SIDEBAR ===');
const all = [];
let m;
const lRe = /nav-section-label",children:"([^"]+)"/g;
const iRe = /nav-item[^"]*",onclick:"navigateTo\('([^']+)'\)"[^[]*children:\[([^\]]+)\]/g;
while ((m = lRe.exec(src)) !== null) all.push({ t:'S', v:m[1], i:m.index });
while ((m = iRe.exec(src)) !== null) {
  const spans = m[2].match(/children:"([^"]+)"/g) || [];
  const lbl   = spans.map(s => s.replace('children:"','').replace('"','')).join(' | ');
  all.push({ t:'I', key:m[1], lbl, i:m.index });
}
all.sort((a,b) => a.i - b.i);
all.forEach(r => {
  if (r.t === 'S') console.log('\n  [' + r.v + ']');
  else             console.log('    - ' + r.key.padEnd(22) + r.lbl);
});
