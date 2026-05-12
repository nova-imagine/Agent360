#!/usr/bin/env node
/**
 * patch_worker_ret_income_fix.cjs
 * Fixes the tpl-ret-income container IDs in dist/_worker.js so they match
 * exactly what ret_step3_module.js getElementById calls expect:
 *
 *  WRONG (injected by patch_worker_ret_step3.cjs):
 *    ric-client-col   → needs ric-client-list
 *    ric-detail-col   → needs ric-detail-panel  (+ ric-detail-empty sibling)
 *
 *  CORRECT structure the JS expects:
 *    ric-kpi-bar        ✅ already correct
 *    ric-ai-banner      ✅ already correct
 *    ric-toolbar        ✅ already correct (static, no getElementById)
 *    ric-client-list    ← fix
 *    ric-detail-empty   ← fix (add)
 *    ric-detail-panel   ← fix
 */

const fs = require('fs');
const path = require('path');

const WORKER = path.join(__dirname, 'dist', '_worker.js');
let src = fs.readFileSync(WORKER, 'utf8');
const originalSize = src.length;

// ─── Guard ────────────────────────────────────────────────────────────────
if (src.includes('"ric-client-list"') || src.includes('\\"ric-client-list\\"')) {
  console.log('SKIP: ric-client-list already present — already fixed');
  process.exit(0);
}

// ─── Identify the exact ric-body children block to replace ───────────────
// We need to replace:
//   a("div",{class:"ric-client-col",id:"ric-client-col"}),
//   a("div",{class:"ric-detail-col",id:"ric-detail-col"})
// with:
//   a("div",{class:"ric-client-col",id:"ric-client-list"}),
//   a("div",{class:"ric-detail-col",children:[
//     a("div",{class:"ric-detail-empty",id:"ric-detail-empty",children:"Select a client to view their income plan"}),
//     a("div",{class:"ric-detail-panel",id:"ric-detail-panel",style:"display:none"})
//   ]})

// The _worker.js uses escaped quotes inside a string literal.
// Detect quoting style:
const RAW_OLD  = `a("div",{class:"ric-client-col",id:"ric-client-col"}),a("div",{class:"ric-detail-col",id:"ric-detail-col"})`;
const ESC_OLD  = `a(\\"div\\",{class:\\"ric-client-col\\",id:\\"ric-client-col\\"}),a(\\"div\\",{class:\\"ric-detail-col\\",id:\\"ric-detail-col\\"})`;

const useRaw = src.includes(RAW_OLD);
const useEsc = src.includes(ESC_OLD);

console.log('Quote style — raw:', useRaw, '| escaped:', useEsc);

if (!useRaw && !useEsc) {
  // Fallback: try the partial ric-client-col id only
  const partRaw = `id:"ric-client-col"`;
  const partEsc = `id:\\"ric-client-col\\"`;
  console.error('ERROR: exact ric-body children block not found.');
  console.error('raw partial present:', src.includes(partRaw));
  console.error('esc partial present:', src.includes(partEsc));

  // Dump surrounding context for debugging
  const ci = src.indexOf('ric-client-col');
  if (ci !== -1) {
    console.error('ric-client-col context:', JSON.stringify(src.slice(ci - 60, ci + 200)));
  }
  process.exit(1);
}

const RAW_NEW = [
  `a("div",{class:"ric-client-col",id:"ric-client-list"}),`,
  `a("div",{class:"ric-detail-col",children:[`,
    `a("div",{class:"ric-detail-empty",id:"ric-detail-empty",`,
      `children:"Select a client to view their income plan"}),`,
    `a("div",{class:"ric-detail-panel",id:"ric-detail-panel",`,
      `style:"display:none"})`,
  `]})`
].join('');

if (useRaw) {
  src = src.replace(RAW_OLD, RAW_NEW);
} else {
  // Re-escape the replacement for the escaped context
  const ESC_NEW = RAW_NEW.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  src = src.replace(ESC_OLD, ESC_NEW);
}

// Verify
if (src.includes('ric-client-list') || src.includes('\\"ric-client-list\\"')) {
  console.log('✅ PATCH applied: ric-client-list, ric-detail-empty, ric-detail-panel injected');
} else {
  console.error('ERROR: patch failed — ric-client-list not found after replacement');
  process.exit(1);
}

fs.writeFileSync(WORKER, src);
const newSize = fs.statSync(WORKER).size;
console.log(`_worker.js: ${originalSize} → ${newSize} bytes (${newSize - originalSize > 0 ? '+' : ''}${newSize - originalSize})`);
