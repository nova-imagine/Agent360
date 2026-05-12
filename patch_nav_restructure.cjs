#!/usr/bin/env node
// Nav Restructure — four changes in one atomic patch:
//   1. Rename ONBOARDING section label → INSURANCE
//   2. Create INVESTMENTS section with inv-accounts (remove from SERVICE)
//   3. Move Upsell Track into SALES section (remove from SERVICE)
//   4. Remove Opportunities nav-item from SALES
//
// Strategy: read the file once, do all replacements in memory,
// run verification, then write once.

const fs   = require('fs');
const path = require('path');
const workerPath = path.join(__dirname, 'dist/_worker.js');
let src = fs.readFileSync(workerPath, 'utf8');
let changeCount = 0;

function replace(label, oldStr, newStr) {
  if (!src.includes(oldStr)) {
    console.error('❌ NOT FOUND: ' + label);
    // Print first 160 chars of what we looked for to help debug
    console.error('   Looking for: ' + JSON.stringify(oldStr.slice(0, 160)));
    process.exit(1);
  }
  src = src.replace(oldStr, newStr);
  changeCount++;
  console.log('✅ ' + label);
}

// ── Extract exact fragments by reading live positions ────────────────────
// (we do this inside the already-loaded src so quoting is 1-to-1)

// 1. ONBOARDING → INSURANCE ──────────────────────────────────────────────
replace(
  '1. ONBOARDING label → INSURANCE',
  'nav-section-label",children:"ONBOARDING"',
  'nav-section-label",children:"INSURANCE"'
);

// 2. Remove Opportunities from SALES ─────────────────────────────────────
// Exact string from diagnostic: includes id:"opp-nav-badge"
const OPP = 'a("a",{class:"nav-item opportunities-nav",onclick:"navigateTo(\'opportunities\')",' +
  'href:"#",children:[a("i",{class:"fas fa-bolt"}),' +
  'a("span",{children:"Opportunities"}),' +
  'a("span",{class:"nav-badge",style:"background:#7c3aed;color:#fff",' +
  'id:"opp-nav-badge",children:"5"})]})';
replace(
  '2. Remove Opportunities from SALES',
  OPP + ',',
  ''
);

// 3. Remove Investment Accounts from SERVICE ──────────────────────────────
const INV = 'a("a",{class:"nav-item inv-accounts-nav",onclick:"navigateTo(\'inv-accounts\')",' +
  'href:"#",children:[a("i",{class:"fas fa-chart-line"}),' +
  'a("span",{children:"Investment Accounts"}),' +
  'a("span",{class:"nav-badge",style:"background:#059669;color:#fff",children:"12"})]})';
replace(
  '3. Remove Investment Accounts from SERVICE',
  INV + ',',
  ''
);

// 4. Remove Upsell from SERVICE ───────────────────────────────────────────
const UPSELL = 'a("a",{class:"nav-item upsell-nav",onclick:"navigateTo(\'upsell\')",' +
  'href:"#",children:[a("i",{class:"fas fa-arrow-trend-up"}),' +
  'a("span",{children:"Upsell Track"}),' +
  'a("span",{class:"nav-badge",style:"background:#059669;color:#fff",children:"8"})]})';
replace(
  '4. Remove Upsell from SERVICE',
  UPSELL + ',',
  ''
);

// 5. Insert Upsell into SALES — after E-App & Proposals, before Journey Pipeline
// From diagnostic, Journey Pipeline is: nav-item pipeline-view-nav
const PIPELINE_NAV =
  'a("a",{class:"nav-item pipeline-view-nav",id:"pipeline-view-nav",' +
  'onclick:"navigateTo(\'pipeline-view\')",href:"#",' +
  'children:[a("i",{class:"fas fa-route"}),' +
  'a("span",{children:"Journey Pipeline"})]})';
replace(
  '5. Insert Upsell into SALES (before Journey Pipeline)',
  PIPELINE_NAV,
  UPSELL + ',' + PIPELINE_NAV
);

// 6. Insert INVESTMENTS section before RETIREMENT ─────────────────────────
const RET_LABEL = 'a("div",{class:"nav-section-label",children:"RETIREMENT"})';
const INVESTMENTS_BLOCK =
  'a("div",{class:"nav-section-label",children:"INVESTMENTS"}),' +
  INV + ',';
replace(
  '6. Insert INVESTMENTS section (with inv-accounts) before RETIREMENT',
  RET_LABEL,
  INVESTMENTS_BLOCK + RET_LABEL
);

// ── Verification ──────────────────────────────────────────────────────────
console.log('\n=== VERIFICATION ===');

// Read resulting SALES block
const salesStart = src.indexOf('nav-section-label",children:"SALES"');
const insStart   = src.indexOf('nav-section-label",children:"INSURANCE"');
const salesBlock = src.slice(salesStart, insStart);

// Read resulting SERVICE block
const svcStart  = src.indexOf('nav-section-label",children:"SERVICE"');
const advStart  = src.indexOf('nav-section-label",children:"ADVISORY"');
const svcBlock  = src.slice(svcStart, advStart);

// Read resulting INVESTMENTS block
const invSecStart = src.indexOf('nav-section-label",children:"INVESTMENTS"');
const retStart    = src.indexOf('nav-section-label",children:"RETIREMENT"');
const invBlock    = src.slice(invSecStart, retStart);

const checks = [
  { label: 'INSURANCE label exists',            ok: src.includes('children:"INSURANCE"') },
  { label: 'ONBOARDING label gone',             ok: !src.includes('children:"ONBOARDING"') },
  { label: 'Opportunities gone from SALES',     ok: !salesBlock.includes('opportunities-nav') },
  { label: 'Upsell present in SALES',           ok: salesBlock.includes('upsell-nav') },
  { label: 'Upsell after E-App in SALES',       ok: salesBlock.indexOf('upsell-nav') > salesBlock.indexOf('E-App') },
  { label: 'INVESTMENTS section exists',        ok: src.includes('children:"INVESTMENTS"') },
  { label: 'inv-accounts inside INVESTMENTS',   ok: invBlock.includes('inv-accounts-nav') },
  { label: 'inv-accounts gone from SERVICE',    ok: !svcBlock.includes('inv-accounts-nav') },
  { label: 'Upsell gone from SERVICE',          ok: !svcBlock.includes('upsell-nav') },
  { label: 'Policies still in SERVICE',         ok: svcBlock.includes('navigateTo(\'policies\')') },
  { label: 'RETIREMENT section still present',  ok: src.includes('children:"RETIREMENT"') },
  { label: 'ADVISORY section still present',    ok: src.includes('children:"ADVISORY"') },
];

let allOk = true;
checks.forEach(c => {
  console.log((c.ok ? '  ✅' : '  ❌') + ' ' + c.label);
  if (!c.ok) allOk = false;
});

if (!allOk) {
  console.error('\n❌ Verification failed — file NOT written. Check errors above.');
  process.exit(1);
}

fs.writeFileSync(workerPath, src);
console.log('\n' + changeCount + ' changes applied. dist/_worker.js written ✅');

// ── Print final nav structure for human review ────────────────────────────
console.log('\n=== FINAL SIDEBAR STRUCTURE ===');
const labelRe = /nav-section-label",children:"([^"]+)"/g;
const itemRe  = /nav-item[^"]*",onclick:"navigateTo\('([^']+)'\)"[^[]*children:\[([^\]]+)\]/g;

const all = [];
let m;
while ((m = labelRe.exec(src))  !== null) all.push({ t:'S', v:m[1], i:m.index });
while ((m = itemRe.exec(src))   !== null) {
  const spans = m[2].match(/children:"([^"]+)"/g) || [];
  const label = spans.map(s => s.replace('children:"','').replace('"','')).join(' / ');
  all.push({ t:'I', key:m[1], label, i:m.index });
}
all.sort((a,b) => a.i - b.i);
all.forEach(r => {
  if (r.t === 'S') console.log('\n  [' + r.v + ']');
  else             console.log('    • ' + r.key + ' — ' + r.label);
});
