#!/usr/bin/env node
// Fix page-key intercepts in public/static/app.js for NYL ADV alignment:
//   adv_step1: 'adv-plans'    → 'adv-wealth'  + title/breadcrumb updates
//   adv_step3: 'adv-proposals'→ 'adv-estate'  + title/breadcrumb updates
//   adv_step4: 'adv-portfolio'→ 'adv-smallbiz'+ title/breadcrumb updates
const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'public/static/app.js');
let src = fs.readFileSync(appPath, 'utf8');
const origLen = src.length;

let changed = 0;

function replace(oldStr, newStr, label) {
  if (!src.includes(oldStr)) {
    console.error('NOT FOUND: ' + label);
    console.error('  Looking for: ' + JSON.stringify(oldStr));
    process.exit(1);
  }
  src = src.replace(oldStr, newStr);
  changed++;
  console.log('✅ ' + label);
}

// ── ADV Step 1: adv-plans → adv-wealth ───────────────────────────────────
replace(
  "if (page === 'adv-plans') {",
  "if (page === 'adv-wealth') {",
  "Step1: page key adv-plans → adv-wealth"
);
replace(
  "if (t) t.textContent = 'Financial Plans';",
  "if (t) t.textContent = 'Wealth Management';",
  "Step1: title Financial Plans → Wealth Management"
);
replace(
  "if (b) b.textContent = 'Advisory / Financial Plans';",
  "if (b) b.textContent = 'Advisory / Wealth Management';",
  "Step1: breadcrumb Advisory / Financial Plans → Advisory / Wealth Management"
);

// ── ADV Step 3: adv-proposals → adv-estate ───────────────────────────────
// First check what the current intercept key is
const step3Key = src.indexOf("page === 'adv-proposals'");
const step3KeyAlt = src.indexOf("page === 'adv-estate'");
console.log('\nStep3 key check — adv-proposals:', step3Key, '  adv-estate (already fixed?):', step3KeyAlt);

if (step3Key !== -1) {
  replace(
    "if (page === 'adv-proposals') {",
    "if (page === 'adv-estate') {",
    "Step3: page key adv-proposals → adv-estate"
  );
  // Update title/breadcrumb if present
  const hasProposalTitle = src.includes("t.textContent = 'Advisory Proposals'");
  const hasProposalBc    = src.includes("b.textContent = 'Advisory / Proposals'");
  if (hasProposalTitle) {
    replace(
      "t.textContent = 'Advisory Proposals'",
      "t.textContent = 'Estate Planning'",
      "Step3: title Advisory Proposals → Estate Planning"
    );
  }
  if (hasProposalBc) {
    replace(
      "b.textContent = 'Advisory / Proposals'",
      "b.textContent = 'Advisory / Estate Planning'",
      "Step3: breadcrumb Advisory / Proposals → Advisory / Estate Planning"
    );
  }
} else if (step3KeyAlt !== -1) {
  console.log('  Step3 key already adv-estate ✅');
} else {
  console.log('  Step3 key not found (module may not be spliced yet — OK)');
}

// ── ADV Step 4: adv-portfolio → adv-smallbiz ─────────────────────────────
const step4Key    = src.indexOf("page === 'adv-portfolio'");
const step4KeyAlt = src.indexOf("page === 'adv-smallbiz'");
console.log('\nStep4 key check — adv-portfolio:', step4Key, '  adv-smallbiz (already fixed?):', step4KeyAlt);

if (step4Key !== -1) {
  replace(
    "if (page === 'adv-portfolio') {",
    "if (page === 'adv-smallbiz') {",
    "Step4: page key adv-portfolio → adv-smallbiz"
  );
  const hasPortfolioTitle = src.includes("t.textContent = 'Portfolio Review'");
  const hasPortfolioBc    = src.includes("b.textContent = 'Advisory / Portfolio Review'");
  if (hasPortfolioTitle) {
    replace(
      "t.textContent = 'Portfolio Review'",
      "t.textContent = 'Small Business Services'",
      "Step4: title Portfolio Review → Small Business Services"
    );
  }
  if (hasPortfolioBc) {
    replace(
      "b.textContent = 'Advisory / Portfolio Review'",
      "b.textContent = 'Advisory / Small Business'",
      "Step4: breadcrumb Advisory / Portfolio Review → Advisory / Small Business"
    );
  }
} else if (step4KeyAlt !== -1) {
  console.log('  Step4 key already adv-smallbiz ✅');
} else {
  console.log('  Step4 key not found (module may not be spliced yet — OK)');
}

// ── Write result ──────────────────────────────────────────────────────────
fs.writeFileSync(appPath, src);
console.log('\n' + changed + ' replacements made. File size:', src.length, '(was', origLen + ')');
console.log('public/static/app.js updated ✅');
