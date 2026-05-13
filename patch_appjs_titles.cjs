#!/usr/bin/env node
// Step 3: Fix page titles and breadcrumbs in public/static/app.js
// Changes:
//   titles.upsell:         'Upsell Track'           → 'Growth Track'
//   titles['pipeline-view']:'Client Journey Pipeline'→ 'Sales Pipeline'
//   titles.fna:            'FNA Discovery Center'    → 'Needs Analysis'
//   titles.sales:          'Sales Pipeline'          → 'Applications & Proposals'
//   titles.clients:        'Client Management'       → 'Client 360'
//   titles.prospects:      'Leads Pipeline'          → 'Prospect 360'
//   breadcrumbs.upsell:    '…/Upsell Track'          → '…/Growth Track'
//   breadcrumbs['pipeline-view']: '…/Journey Pipeline'→ '…/Sales Pipeline'
//   breadcrumbs.fna:       '…/FNA Discovery'         → '…/Needs Analysis'
//   breadcrumbs.delivery:  '…/Onboarding/…'          → '…/Insurance/…'
//   breadcrumbs['inv-accounts']: '…/Service/…'       → '…/Investments/…'

const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, 'public/static/app.js');

let src = fs.readFileSync(FILE, 'utf8');
const orig = src;
let changes = 0;

function rep(label, from, to) {
  if (!src.includes(from)) {
    console.error('MISSING  ' + label);
    console.error('         Looking for: ' + JSON.stringify(from));
    process.exit(1);
  }
  src = src.replace(from, to);
  changes++;
  console.log('OK  ' + label);
}

// ── titles object ──────────────────────────────────────────────────────────
rep("titles.clients",
  "clients: 'Client Management'",
  "clients: 'Client 360'");

rep("titles.upsell",
  "upsell: 'Upsell Track'",
  "upsell: 'Growth Track'");

rep("titles['pipeline-view']",
  "'pipeline-view': 'Client Journey Pipeline'",
  "'pipeline-view': 'Sales Pipeline'");

rep("titles.sales",
  "sales: 'Sales Pipeline'",
  "sales: 'Applications & Proposals'");

rep("titles.fna",
  "fna: 'FNA Discovery Center'",
  "fna: 'Needs Analysis'");

// ── breadcrumbs object ─────────────────────────────────────────────────────
rep("breadcrumbs.clients",
  "clients: 'Home / Clients'",
  "clients: 'Home / Client 360'");

rep("breadcrumbs.upsell",
  "upsell: 'Home / Sales / Upsell Track'",
  "upsell: 'Home / Sales / Growth Track'");

rep("breadcrumbs['pipeline-view']",
  "'pipeline-view': 'Home / Sales / Journey Pipeline'",
  "'pipeline-view': 'Home / Sales / Sales Pipeline'");

rep("breadcrumbs.fna",
  "fna: 'Home / Sales / FNA Discovery'",
  "fna: 'Home / Sales / Needs Analysis'");

rep("breadcrumbs.delivery",
  "delivery: 'Home / Onboarding / Policy Delivery'",
  "delivery: 'Home / Insurance / Policy Delivery'");

rep("breadcrumbs['inv-accounts']",
  "'inv-accounts': 'Home / Service / Investment Accounts'",
  "'inv-accounts': 'Home / Investments / Investment Accounts'");

// ── Write ──────────────────────────────────────────────────────────────────
if (src === orig) {
  console.error('ERROR: No changes made — aborting write');
  process.exit(1);
}
fs.writeFileSync(FILE, src);
console.log('\n' + changes + ' changes. public/static/app.js written OK');

// ── Verify ─────────────────────────────────────────────────────────────────
console.log('\n=== VERIFICATION ===');
let ok = true;
function chk(label, cond) {
  console.log('  ' + (cond ? 'OK ' : 'FAIL') + '  ' + label);
  if (!cond) ok = false;
}

chk("titles.clients = 'Client 360'",         src.includes("clients: 'Client 360'"));
chk("titles.upsell = 'Growth Track'",         src.includes("upsell: 'Growth Track'"));
chk("titles['pipeline-view'] = 'Sales Pipeline'", src.includes("'pipeline-view': 'Sales Pipeline'"));
chk("titles.sales = 'Applications & Proposals'",  src.includes("sales: 'Applications & Proposals'"));
chk("titles.fna = 'Needs Analysis'",          src.includes("fna: 'Needs Analysis'"));
chk("breadcrumbs.upsell = Growth Track",      src.includes("upsell: 'Home / Sales / Growth Track'"));
chk("breadcrumbs['pipeline-view'] = Sales Pipeline", src.includes("'pipeline-view': 'Home / Sales / Sales Pipeline'"));
chk("breadcrumbs.fna = Needs Analysis",       src.includes("fna: 'Home / Sales / Needs Analysis'"));
chk("breadcrumbs.delivery = Insurance",       src.includes("delivery: 'Home / Insurance / Policy Delivery'"));
chk("breadcrumbs['inv-accounts'] = Investments", src.includes("'inv-accounts': 'Home / Investments / Investment Accounts'"));

chk("old 'Upsell Track' title gone",          !src.includes("upsell: 'Upsell Track'"));
chk("old 'Client Journey Pipeline' gone",     !src.includes("'pipeline-view': 'Client Journey Pipeline'"));
chk("old 'FNA Discovery Center' gone",        !src.includes("fna: 'FNA Discovery Center'"));
chk("old 'Sales Pipeline' title gone",        !src.includes("sales: 'Sales Pipeline'"));
chk("old 'Client Management' title gone",     !src.includes("clients: 'Client Management'"));

if (!ok) { process.exit(1); }
console.log('\nAll checks passed ✓');
