#!/usr/bin/env node
// Fix remaining ADV nav labels: Estate Planning
const fs = require('fs');
const path = require('path');

const workerPath = path.join(__dirname, 'dist/_worker.js');
let src = fs.readFileSync(workerPath, 'utf8');

// ── Diagnosis: show EXACT chars around estate marker ─────────────────────
const estateIdx = src.indexOf('adv-estate-nav');
if (estateIdx === -1) { console.error('adv-estate-nav NOT FOUND'); process.exit(1); }

const chunk = src.slice(estateIdx, estateIdx + 400);
console.log('=== ESTATE CHUNK (exact chars) ===');
console.log(chunk);
console.log('=== END ===\n');

// ── Detect whether quotes are escaped or plain ────────────────────────────
const hasEscaped  = chunk.includes('children:\\"Proposals\\"');
const hasPlain    = chunk.includes('children:"Proposals"');
console.log('Escaped quote version (children:\\"Proposals\\"):', hasEscaped);
console.log('Plain quote version  (children:"Proposals")  :', hasPlain);

let fixed = false;

if (hasEscaped) {
  src = src.replace('children:\\"Proposals\\"', 'children:\\"Estate Planning\\"');
  fixed = true;
  console.log('Fixed via escaped-quote replacement ✅');
} else if (hasPlain) {
  // Need to replace only the Proposals span inside the adv-estate-nav block.
  // We'll do a targeted splice: find the estate chunk, replace within it, splice back.
  const estateEnd = estateIdx + 400;
  const before = src.slice(0, estateIdx);
  const middle = src.slice(estateIdx, estateEnd);
  const after  = src.slice(estateEnd);

  if (!middle.includes('children:"Proposals"')) {
    console.error('Still not found in middle slice — aborting');
    process.exit(1);
  }
  const fixedMiddle = middle.replace('children:"Proposals"', 'children:"Estate Planning"');
  src = before + fixedMiddle + after;
  fixed = true;
  console.log('Fixed via plain-quote replacement ✅');
} else {
  console.error('ERROR: Cannot find Proposals span in either form');
  console.error('Chunk was:', JSON.stringify(chunk));
  process.exit(1);
}

// ── Final verification ────────────────────────────────────────────────────
const estateIdx2 = src.indexOf('adv-estate-nav');
const chunk2 = src.slice(estateIdx2, estateIdx2 + 300);
console.log('\nPost-fix estate chunk:');
console.log(chunk2);

const sbIdx = src.indexOf('adv-smallbiz-nav');
const sbOk  = sbIdx !== -1 && src.slice(sbIdx, sbIdx + 200).includes('Small Business');
const wmIdx = src.indexOf('adv-wealth-nav');
const wmOk  = wmIdx !== -1 && src.slice(wmIdx, wmIdx + 200).includes('Wealth Management');
const epOk  = chunk2.includes('Estate Planning');

console.log('\n=== FINAL STATUS ===');
console.log('Wealth Management :', wmOk ? '✅' : '❌');
console.log('Estate Planning   :', epOk ? '✅' : '❌');
console.log('Small Business    :', sbOk ? '✅' : '❌');

if (!wmOk || !epOk || !sbOk) {
  console.error('One or more labels still wrong — NOT writing file');
  process.exit(1);
}

fs.writeFileSync(workerPath, src);
console.log('\ndist/_worker.js written ✅');
