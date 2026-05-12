#!/usr/bin/env node
/**
 * patch_worker_adv.cjs
 * Injects into dist/_worker.js:
 *   1. ADVISORY nav section (before ANALYTICS label) with 3 links:
 *        Financial Plans  → adv-plans
 *        Proposals        → adv-proposals
 *        Portfolio Review → adv-portfolio
 *   2. Three template slots after tpl-ret-income:
 *        tpl-adv-plans, tpl-adv-proposals, tpl-adv-portfolio
 */

const fs   = require('fs');
const path = require('path');
const WORKER = path.join(__dirname, 'dist', '_worker.js');

let src = fs.readFileSync(WORKER, 'utf8');
const originalSize = src.length;

// ── Guard ──────────────────────────────────────────────────────────────────────
if (src.includes('adv-plans-nav')) {
  console.log('SKIP: adv-plans-nav already present');
  process.exit(0);
}

let patched = 0;

// ══════════════════════════════════════════════════════════════════════════════
// PATCH 1: ADVISORY nav section
// Inject before the ANALYTICS nav-section-label
// ══════════════════════════════════════════════════════════════════════════════

// The ANALYTICS label sits inside the brand tagline block — find the correct
// nav-section-label that says ANALYTICS.  From prior grep we know its exact form:
const ANALYTICS_ANCHOR_RAW = `a("div",{class:"nav-section-label",children:"ANALYTICS"})`;
const ANALYTICS_ANCHOR_ESC = `a(\\"div\\",{class:\\"nav-section-label\\",children:\\"ANALYTICS\\"})`;

const useRaw = src.includes(ANALYTICS_ANCHOR_RAW);
const useEsc = src.includes(ANALYTICS_ANCHOR_ESC);
console.log('Quote style — raw:', useRaw, '| esc:', useEsc);

if (!useRaw && !useEsc) {
  console.error('ERROR: ANALYTICS nav-section-label anchor not found');
  // Debug: find ANALYTICS in file
  const ai = src.indexOf('ANALYTICS');
  if (ai !== -1) console.error('ANALYTICS context:', JSON.stringify(src.slice(ai-60, ai+120)));
  process.exit(1);
}

// Build the ADVISORY nav block (raw JS)
const ADV_NAV_RAW = [
  `a("div",{class:"nav-section-label",children:"ADVISORY"}),`,
  `a("a",{class:"nav-item adv-plans-nav",onclick:"navigateTo('adv-plans')",href:"#",`,
    `children:[a("i",{class:"fas fa-clipboard-list"}),a("span",{children:"Financial Plans"}),`,
    `a("span",{class:"nav-badge",style:"background:#8b5cf6;color:#fff",children:"6"})]}),`,
  `a("a",{class:"nav-item adv-proposals-nav",onclick:"navigateTo('adv-proposals')",href:"#",`,
    `children:[a("i",{class:"fas fa-file-signature"}),a("span",{children:"Proposals"}),`,
    `a("span",{class:"nav-badge",style:"background:#f59e0b;color:#1e1e1e",children:"5"})]}),`,
  `a("a",{class:"nav-item adv-portfolio-nav",onclick:"navigateTo('adv-portfolio')",href:"#",`,
    `children:[a("i",{class:"fas fa-chart-pie"}),a("span",{children:"Portfolio Review"}),`,
    `a("span",{class:"nav-badge",style:"background:#0ea5e9;color:#fff",children:"6"})]}),`
].join('');

if (useRaw) {
  src = src.replace(ANALYTICS_ANCHOR_RAW, ADV_NAV_RAW + ANALYTICS_ANCHOR_RAW);
} else {
  const ADV_NAV_ESC = ADV_NAV_RAW.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  src = src.replace(ANALYTICS_ANCHOR_ESC, ADV_NAV_ESC + ANALYTICS_ANCHOR_ESC);
}

if (src.includes('adv-plans-nav')) {
  console.log('✅ PATCH 1: ADVISORY nav section injected');
  patched++;
} else {
  console.error('ERROR: PATCH 1 failed');
  process.exit(1);
}

// ══════════════════════════════════════════════════════════════════════════════
// PATCH 2: Template slots — insert after tpl-ret-income closing paren
// ══════════════════════════════════════════════════════════════════════════════

// Find tpl-ret-income and walk to its closing paren
const RET_INCOME_STR = 'id:"tpl-ret-income"';
const RET_INCOME_ESC = 'id:\\"tpl-ret-income\\"';
const useRawTpl = src.includes(RET_INCOME_STR);
const tplAnchor = useRawTpl ? RET_INCOME_STR : RET_INCOME_ESC;
const tplIdx = src.indexOf(tplAnchor);

if (tplIdx === -1) {
  console.error('ERROR: tpl-ret-income anchor not found');
  process.exit(1);
}

// Walk back to find the opening a( of this call
let callStart = tplIdx;
while (callStart > 0 && src[callStart] !== 'a') callStart--;

// Walk forward counting paren depth
let depth = 0, callEnd = callStart;
for (let i = callStart; i < src.length; i++) {
  if (src[i] === '(') depth++;
  else if (src[i] === ')') {
    depth--;
    if (depth === 0) { callEnd = i; break; }
  }
}
console.log(`tpl-ret-income call ends at offset ${callEnd}`);

// Build three minimal shell templates
// tpl-adv-plans: split layout matching what advRenderClientList / advOpenClient expect
const TPL_ADV_PLANS = [
  `,a("div",{id:"tpl-adv-plans",children:a("div",{class:"page adv-plans-page",children:[`,
    `a("div",{class:"adv-kpi-bar",id:"adv-kpi-bar"}),`,
    `a("div",{class:"adv-ai-banner",id:"adv-ai-banner"}),`,
    `a("div",{class:"adv-toolbar",id:"adv-toolbar"}),`,
    `a("div",{class:"adv-body",children:[`,
      `a("div",{class:"adv-client-col",id:"adv-client-list"}),`,
      `a("div",{class:"adv-detail-col",children:[`,
        `a("div",{class:"adv-detail-empty",id:"adv-detail-empty",`,
          `children:[a("i",{class:"fas fa-clipboard-list"}),`,
          `a("span",{children:"Select a client to view their financial plan"})]}),`,
        `a("div",{class:"adv-detail-panel",id:"adv-detail-panel",style:"display:none"})`,
      `]})`,
    `]})`,
  `]})})`,
].join('');

// tpl-adv-proposals: prop-list + prop-detail split
const TPL_ADV_PROPOSALS = [
  `,a("div",{id:"tpl-adv-proposals",children:a("div",{class:"page adv-proposals-page",children:[`,
    `a("div",{class:"prop-kpi-bar",id:"prop-kpi-bar"}),`,
    `a("div",{class:"prop-body",children:[`,
      `a("div",{class:"prop-list-col",id:"prop-list"}),`,
      `a("div",{class:"prop-detail-col",children:[`,
        `a("div",{class:"prop-detail-empty",id:"prop-detail-empty",`,
          `children:[a("i",{class:"fas fa-file-signature"}),`,
          `a("span",{children:"Select a proposal to view details"})]}),`,
        `a("div",{class:"prop-detail-panel",id:"prop-detail-panel",style:"display:none"})`,
      `]})`,
    `]})`,
  `]})})`,
].join('');

// tpl-adv-portfolio: pf-client-list + pf-detail split
const TPL_ADV_PORTFOLIO = [
  `,a("div",{id:"tpl-adv-portfolio",children:a("div",{class:"page adv-portfolio-page",children:[`,
    `a("div",{class:"pf-kpi-bar",id:"pf-kpi-bar"}),`,
    `a("div",{class:"pf-body",children:[`,
      `a("div",{class:"pf-client-col",id:"pf-client-list"}),`,
      `a("div",{class:"pf-detail-col",children:[`,
        `a("div",{class:"pf-detail-empty",id:"pf-detail-empty",`,
          `children:[a("i",{class:"fas fa-chart-pie"}),`,
          `a("span",{children:"Select a client to review their portfolio"})]}),`,
        `a("div",{class:"pf-detail-panel",id:"pf-detail-panel",style:"display:none"})`,
      `]})`,
    `]})`,
  `]})})`,
].join('');

const INSERT = TPL_ADV_PLANS + TPL_ADV_PROPOSALS + TPL_ADV_PORTFOLIO;
src = src.slice(0, callEnd + 1) + INSERT + src.slice(callEnd + 1);

const allPresent = ['tpl-adv-plans','tpl-adv-proposals','tpl-adv-portfolio'].every(function(id) {
  return src.includes(id);
});
if (allPresent) {
  console.log('✅ PATCH 2: tpl-adv-plans, tpl-adv-proposals, tpl-adv-portfolio injected');
  patched++;
} else {
  console.error('ERROR: PATCH 2 failed — not all tpl-adv-* slots found');
  process.exit(1);
}

// ── Write ──────────────────────────────────────────────────────────────────────
fs.writeFileSync(WORKER, src);
const newSize = fs.statSync(WORKER).size;
console.log(`\nDone. ${patched}/2 patches applied.`);
console.log(`_worker.js: ${originalSize} → ${newSize} bytes (+${newSize - originalSize})`);
