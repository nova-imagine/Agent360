#!/usr/bin/env node
/**
 * patch_worker_adv_labels.cjs
 * Fixes nav labels in the ADVISORY section to match NYL's 3-pillar framework:
 *   adv-estate-nav:   "Proposals"       → "Estate Planning"  (icon: fa-scroll, badge: green 6)
 *   adv-smallbiz-nav: "Portfolio Review" → "Small Business"   (icon: fa-briefcase, badge: orange 8)
 *   adv-wealth-nav:   icon fix          → fa-university (already renamed label)
 */

const fs   = require('fs');
const path = require('path');
const WORKER = path.join(__dirname, 'dist', '_worker.js');

let src = fs.readFileSync(WORKER, 'utf8');
const origSize = src.length;

// ── Guard ──────────────────────────────────────────────────────────────────────
if (src.includes('Estate Planning') && src.includes('Small Business')) {
  console.log('SKIP: labels already correct');
  process.exit(0);
}

// ── Find and replace the exact children array of each nav <a> ─────────────────
// Strategy: locate by the unique nav class, then find the children:[...] block
// and replace just the icon + label + badge children.

function replaceNavChildren(source, navClass, newIcon, newLabel, newBadgeColor, newBadgeText) {
  // Find the nav class marker
  const classMarker = 'class:\\"nav-item ' + navClass + '\\"';
  const idx = source.indexOf(classMarker);
  if (idx === -1) {
    console.error('ERROR: nav class not found: ' + navClass);
    return null;
  }

  // Find children:[ after this point
  const childrenIdx = source.indexOf('children:[', idx);
  if (childrenIdx === -1 || childrenIdx - idx > 200) {
    console.error('ERROR: children:[ not found near ' + navClass);
    return null;
  }

  // Walk bracket depth from children:[ to find the closing ]
  let depth = 0, end = childrenIdx;
  for (let i = childrenIdx + 'children:['.length - 1; i < source.length; i++) {
    if (source[i] === '[') depth++;
    else if (source[i] === ']') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }

  const oldChildren = source.slice(childrenIdx, end + 1);

  // Build new children block with escaped quotes (file uses \" inside a string literal)
  const newChildren =
    'children:[' +
      'a(\\"i\\",{class:\\"fas ' + newIcon + '\\"}),'+
      'a(\\"span\\",{children:\\"' + newLabel + '\\"}),'+
      'a(\\"span\\",{class:\\"nav-badge\\",style:\\"background:' + newBadgeColor + ';color:#fff\\",children:\\"' + newBadgeText + '\\"})' +
    ']';

  console.log('  OLD: ' + oldChildren.slice(0, 80) + '...');
  console.log('  NEW: ' + newChildren.slice(0, 80) + '...');

  return source.slice(0, childrenIdx) + newChildren + source.slice(end + 1);
}

// 1. Fix wealth nav icon (label already correct from prior patch)
console.log('\nFixing Wealth Management icon...');
src = src.replace(
  'class:\\"fas fa-clipboard-list\\"',
  'class:\\"fas fa-university\\"'
);
// Only replace the first occurrence (inside the wealth nav, not elsewhere)
console.log('  wealth icon →', src.includes('fa-university') ? 'fa-university ✅' : 'FAILED ❌');

// 2. Fix estate nav: Proposals → Estate Planning
console.log('\nFixing Estate Planning label...');
const afterEstate = replaceNavChildren(
  src,
  'adv-estate-nav',
  'fa-scroll',
  'Estate Planning',
  '#10b981',
  '6'
);
if (!afterEstate) process.exit(1);
src = afterEstate;
console.log('  Estate Planning label:', src.includes('Estate Planning') ? '✅' : '❌');

// 3. Fix smallbiz nav: Portfolio Review → Small Business
console.log('\nFixing Small Business label...');
const afterSmallBiz = replaceNavChildren(
  src,
  'adv-smallbiz-nav',
  'fa-briefcase',
  'Small Business',
  '#f97316',
  '8'
);
if (!afterSmallBiz) process.exit(1);
src = afterSmallBiz;
console.log('  Small Business label:', src.includes('Small Business') ? '✅' : '❌');

// ── Verify final nav ───────────────────────────────────────────────────────────
const idx = src.indexOf('ADVISORY');
console.log('\nFinal ADVISORY nav block:');
console.log(src.slice(idx - 5, idx + 680));

// ── Write ──────────────────────────────────────────────────────────────────────
fs.writeFileSync(WORKER, src);
console.log('\n_worker.js: ' + origSize + ' → ' + src.length + ' bytes');
console.log('Done ✅');
