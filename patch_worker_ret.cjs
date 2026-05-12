#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const WORKER = path.join(__dirname, 'dist/_worker.js');
const GUARD_NAV = 'ret-accounts-nav';
const GUARD_TPL = 'tpl-ret-accounts';

let src = fs.readFileSync(WORKER, 'utf8');

// ── 1. NAV SECTION ────────────────────────────────────────────────────────────
// Insert RETIREMENT section between end of ONBOARDING (after Policy Delivery)
// and start of SERVICE section.
// Anchor: the exact minified string for the Policy Delivery nav item end → SERVICE label
if (src.includes(GUARD_NAV)) {
  console.log('⚠️  NAV guard already present — skipping nav patch.');
} else {
  const NAV_ANCHOR = 'a(\"div\",{class:\"nav-section-label\",children:\"SERVICE\"})';

  const RETIREMENT_NAV =
    'a(\"div\",{class:\"nav-section-label\",children:\"RETIREMENT\"}),' +
    'a(\"a\",{class:\"nav-item ret-accounts-nav\",onclick:\"navigateTo(\'ret-accounts\')\",href:\"#\",' +
      'children:[' +
        'a(\"i\",{class:\"fas fa-umbrella-beach\"}),' +
        'a(\"span\",{children:\"Annuity Accounts\"}),' +
        'a(\"span\",{class:\"nav-badge\",style:\"background:#0891b2;color:#fff\",children:\"6\"})' +
      ']' +
    '}),';

  if (!src.includes(NAV_ANCHOR)) {
    console.error('❌  NAV anchor not found — cannot patch nav.');
    process.exit(1);
  }

  src = src.replace(NAV_ANCHOR, RETIREMENT_NAV + NAV_ANCHOR);
  console.log('✅  RETIREMENT nav section injected before SERVICE label.');
}

// ── 2. TEMPLATE SLOT ──────────────────────────────────────────────────────────
// Insert tpl-ret-accounts div after tpl-inv-accounts div in page-templates.
// Anchor: the closing of tpl-inv-accounts
if (src.includes(GUARD_TPL)) {
  console.log('⚠️  TPL guard already present — skipping template patch.');
} else {
  // The minified tpl-inv-accounts closing looks like:
  // a("div",{id:"tpl-inv-accounts",children:a(zl,{})})
  // We find that and insert our new slot after it.
  const TPL_ANCHOR = 'a(\"div\",{id:\"tpl-inv-accounts\"';
  // Find the full closing of this element — it ends with }}) followed by ]
  // Strategy: find anchor, then find the matching closing sequence
  const tplIdx = src.indexOf(TPL_ANCHOR);
  if (tplIdx === -1) {
    console.error('❌  TPL anchor tpl-inv-accounts not found — cannot patch template slot.');
    process.exit(1);
  }

  // Walk forward to find the closing of this a() call — two closing parens after the children value
  // Pattern: a("div",{id:"tpl-inv-accounts",children:a(Xl,{})})
  // We need to find the }) that closes the outer a() call
  let depth = 0;
  let i = tplIdx;
  let foundClose = -1;
  while (i < src.length) {
    if (src[i] === '(') depth++;
    else if (src[i] === ')') {
      depth--;
      if (depth === 0) { foundClose = i; break; }
    }
    i++;
  }

  if (foundClose === -1) {
    console.error('❌  Could not find closing paren of tpl-inv-accounts element.');
    process.exit(1);
  }

  // Build a minimal shell for the ret-accounts template — the JS in app.js will
  // populate the actual content via initRetAccountsPage()
  const TPL_INSERT =
    ',a(\"div\",{id:\"tpl-ret-accounts\",children:' +
      'a(\"div\",{class:\"page ret-accounts-page\",children:[' +
        'a(\"div\",{class:\"ra-kpi-bar\",id:\"ra-kpi-bar\"}),' +
        'a(\"div\",{class:\"ra-ai-banner\",id:\"ra-ai-banner\"}),' +
        'a(\"div\",{class:\"ra-toolbar\",id:\"ra-toolbar\",children:[' +
          'a(\"input\",{class:\"ra-search\",id:\"ra-search\",type:\"text\",placeholder:\"Search annuity contracts…\",oninput:\"raFilterContracts(this.value)\"}),' +
          'a(\"select\",{class:\"ra-filter-select\",id:\"ra-type-filter\",onchange:\"raFilterContracts()\",children:[' +
            'a(\"option\",{value:\"\",children:\"All Types\"}),' +
            'a(\"option\",{value:\"FIA\",children:\"FIA\"}),' +
            'a(\"option\",{value:\"VA\",children:\"VA\"}),' +
            'a(\"option\",{value:\"SPIA\",children:\"SPIA\"}),' +
            'a(\"option\",{value:\"DIA\",children:\"DIA\"}),' +
            'a(\"option\",{value:\"Fixed\",children:\"Fixed Deferred\"})' +
          ']}),' +
          'a(\"select\",{class:\"ra-filter-select\",id:\"ra-status-filter\",onchange:\"raFilterContracts()\",children:[' +
            'a(\"option\",{value:\"\",children:\"All Statuses\"}),' +
            'a(\"option\",{value:\"Active\",children:\"Active\"}),' +
            'a(\"option\",{value:\"Quote\",children:\"Quote Stage\"}),' +
            'a(\"option\",{value:\"Review\",children:\"In Review\"}),' +
            'a(\"option\",{value:\"Maturing\",children:\"Maturing\"}),' +
            'a(\"option\",{value:\"Illustration\",children:\"Illustration\"})' +
          ']}),' +
          'a(\"div\",{class:\"ra-toolbar-spacer\"}),' +
          'a(\"button\",{class:\"ra-toolbar-btn warning\",onclick:\"raOpenMaturityAlert()\",children:[a(\"i\",{class:\"fas fa-exclamation-triangle\"}),\" Maturity Alert\"]}),' +
          'a(\"button\",{class:\"ra-toolbar-btn secondary\",onclick:\"raOpenRMDCalculator()\",children:[a(\"i\",{class:\"fas fa-calculator\"}),\" RMD Calc\"]}),' +
          'a(\"button\",{class:\"ra-toolbar-btn secondary\",onclick:\"raRunIncomeGapScan()\",children:[a(\"i\",{class:\"fas fa-chart-area\"}),\" Income Gap Scan\"]}),' +
          'a(\"button\",{class:\"ra-toolbar-btn primary\",onclick:\"raOpenNewContract()\",children:[a(\"i\",{class:\"fas fa-plus\"}),\" New Contract\"]})' +
        ']}),' +
        'a(\"div\",{class:\"ra-split\",children:[' +
          'a(\"div\",{class:\"ra-queue-col\",id:\"ra-queue-col\",children:a(\"div\",{id:\"ra-contract-queue\"})}),' +
          'a(\"div\",{class:\"ra-detail-col\",id:\"ra-detail-col\",children:[' +
            'a(\"div\",{class:\"ra-detail-empty\",id:\"ra-detail-empty\",children:[a(\"i\",{class:\"fas fa-umbrella-beach\"}),a(\"p\",{children:\"Select an annuity contract to view details\"})]}),' +
            'a(\"div\",{class:\"ra-detail-panel\",id:\"ra-detail-panel\",style:\"display:none\"})' +
          ']})' +
        ']}),' +
        'a(\"div\",{class:\"ra-gap-panel\",id:\"ra-gap-panel\",style:\"display:none\",children:a(\"div\",{id:\"ra-gap-content\"})})' +
      ']})' +
    '})';

  src = src.slice(0, foundClose + 1) + TPL_INSERT + src.slice(foundClose + 1);
  console.log('✅  tpl-ret-accounts template slot injected after tpl-inv-accounts.');
}

// ── Write back ─────────────────────────────────────────────────────────────────
fs.writeFileSync(WORKER, src, 'utf8');
const newSize = fs.statSync(WORKER).size;
console.log('✅  dist/_worker.js patched successfully.');
console.log('    New size: ' + newSize.toLocaleString() + ' bytes');
