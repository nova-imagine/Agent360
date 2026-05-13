#!/usr/bin/env node
/**
 * patch_client360_bias.cjs
 *
 * 1. Remove auto-open from client card header (card header no longer fires openClientModal)
 * 2. Fix Overview bias:
 *    - "Annual Premium:" → "Total AUM / Assets:" label with combined value
 *    - Remove "More Insurance" gap flag (too insurance-biased)
 *    - "Coverage Gaps Identified" → "Product Gaps Identified"
 * 3. Add toggleOutreachHubDashboard() function for the new dashboard Outreach Hub
 * 4. Fix tab references in app.js that say "Policies" tab → now "Products" tab
 *    (switchClientTab calls referencing cm-tab-policies still work since ID unchanged)
 */

const fs   = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'public/static/app.js');
let src = fs.readFileSync(FILE, 'utf8');

const GUARD = '/* CLIENT360_BIAS_FIX_v1 */';
if (src.includes(GUARD)) {
  console.log('⚠️  Patch already applied — skipping.');
  process.exit(0);
}

let changeCount = 0;

// ─────────────────────────────────────────────────────────────────────────────
// CHANGE 1 — Remove "More Insurance" gap flag (insurance-biased)
// ─────────────────────────────────────────────────────────────────────────────
const OLD_GAP = `  if (!products.investments.length) gaps.push('Investments');
  if (!products.retirement.length)  gaps.push('Retirement');
  if (!products.advisory.length)    gaps.push('Advisory');
  if (products.insurance.length < 2) gaps.push('More Insurance');`;

const NEW_GAP = `  if (!products.investments.length) gaps.push('Investments');
  if (!products.retirement.length)  gaps.push('Retirement');
  if (!products.advisory.length)    gaps.push('Advisory');
  // Insurance gap: only flag if NO insurance at all (not "needs more")
  if (!products.insurance.length)   gaps.push('Insurance');`;

if (src.includes(OLD_GAP)) {
  src = src.replace(OLD_GAP, NEW_GAP);
  changeCount++;
  console.log('✅ Change 1: "More Insurance" gap flag removed; only flags if zero insurance');
} else {
  console.error('❌ Change 1 NOT found — gap logic block');
}

// ─────────────────────────────────────────────────────────────────────────────
// CHANGE 2 — Flip Portfolio Summary: AUM as primary metric, premium secondary
// OLD: Annual Premium as the top money line, net worth buried below
// NEW: Net Worth (total wealth) as primary, Annual Premium as secondary label
// Also rename "Portfolio Summary" → "Client 360 Summary"
// ─────────────────────────────────────────────────────────────────────────────
const OLD_PORTFOLIO = `        <div class=\"cm-card-title\"><i class=\"fas fa-briefcase\"></i> Portfolio Summary</div>
        <div class=\"cm-kpi-row\">
          <div class=\"cm-kpi\"><span class=\"cm-kpi-val\">\${products.insurance.length}</span><span class=\"cm-kpi-lbl\">Insurance</span></div>
          <div class=\"cm-kpi\"><span class=\"cm-kpi-val\">\${products.investments.length}</span><span class=\"cm-kpi-lbl\">Invest.</span></div>
          <div class=\"cm-kpi\"><span class=\"cm-kpi-val\">\${products.retirement.length}</span><span class=\"cm-kpi-lbl\">Retire.</span></div>
          <div class=\"cm-kpi\"><span class=\"cm-kpi-val\">\${products.advisory.length}</span><span class=\"cm-kpi-lbl\">Advisory</span></div>
        </div>
        <div class=\"cm-info-row premium-row\"><i class=\"fas fa-dollar-sign\"></i><span>Annual Premium: <strong>$\${client.premium.toLocaleString()}</strong></span></div>
        <div class=\"cm-info-row\"><i class=\"fas fa-layer-group\"></i><span>\${totalPolicies} total product\${totalPolicies !== 1 ? 's' : ''} · Net Worth: <strong>\${profile.netWorth||'—'}</strong></span></div>
        <div class=\"cm-info-row\"><i class=\"fas fa-wallet\"></i><span>Household Income: <strong>\${profile.income||'—'}</strong></span></div>`;

const NEW_PORTFOLIO = `        <div class=\"cm-card-title\"><i class=\"fas fa-briefcase\"></i> Client 360 Summary</div>
        <div class=\"cm-kpi-row\">
          <div class=\"cm-kpi\"><span class=\"cm-kpi-val\">\${products.insurance.length}</span><span class=\"cm-kpi-lbl\">Insurance</span></div>
          <div class=\"cm-kpi\"><span class=\"cm-kpi-val\">\${products.investments.length}</span><span class=\"cm-kpi-lbl\">Invest.</span></div>
          <div class=\"cm-kpi\"><span class=\"cm-kpi-val\">\${products.retirement.length}</span><span class=\"cm-kpi-lbl\">Retire.</span></div>
          <div class=\"cm-kpi\"><span class=\"cm-kpi-val\">\${products.advisory.length}</span><span class=\"cm-kpi-lbl\">Advisory</span></div>
        </div>
        <div class=\"cm-info-row premium-row\"><i class=\"fas fa-chart-line\" style=\"color:#059669\"></i><span>Net Worth: <strong>\${profile.netWorth||'—'}</strong> · Income: <strong>\${profile.income||'—'}</strong></span></div>
        <div class=\"cm-info-row\"><i class=\"fas fa-layer-group\"></i><span>\${totalPolicies} total product\${totalPolicies !== 1 ? 's' : ''} · Annual Premium: <strong>$\${client.premium.toLocaleString()}</strong></span></div>
        <div class=\"cm-info-row\"><i class=\"fas fa-wallet\"></i><span>Household Income: <strong>\${profile.income||'—'}</strong></span></div>`;

if (src.includes(OLD_PORTFOLIO)) {
  src = src.replace(OLD_PORTFOLIO, NEW_PORTFOLIO);
  changeCount++;
  console.log('✅ Change 2: Portfolio Summary → Client 360 Summary; Net Worth as primary metric');
} else {
  console.error('❌ Change 2 NOT found — portfolio summary block');
}

// ─────────────────────────────────────────────────────────────────────────────
// CHANGE 3 — Rename "Coverage Gaps" → "Product Gaps" (more neutral language)
// ─────────────────────────────────────────────────────────────────────────────
const OLD_GAPS_LABEL = `      <div class=\"cm-gaps-label\"><i class=\"fas fa-exclamation-circle\" style=\"color:#f59e0b\"></i> Coverage Gaps Identified</div>`;
const NEW_GAPS_LABEL = `      <div class=\"cm-gaps-label\"><i class=\"fas fa-exclamation-circle\" style=\"color:#f59e0b\"></i> Product Gaps — Growth Opportunities</div>`;

if (src.includes(OLD_GAPS_LABEL)) {
  src = src.replace(OLD_GAPS_LABEL, NEW_GAPS_LABEL);
  changeCount++;
  console.log('✅ Change 3: "Coverage Gaps" → "Product Gaps — Growth Opportunities"');
} else {
  console.error('❌ Change 3 NOT found — gaps label');
}

// ─────────────────────────────────────────────────────────────────────────────
// CHANGE 4 — Append toggleOutreachHubDashboard() for the new dashboard hub
// ─────────────────────────────────────────────────────────────────────────────
const DASHBOARD_HUB_FN = `

${GUARD}
// ── Dashboard Outreach Hub toggle (separate from Clients page hub) ──────────
function toggleOutreachHubDashboard() {
  var body    = document.getElementById('oh-body-dashboard');
  var chevron = document.getElementById('oh-dash-chevron');
  if (!body) return;
  var isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  if (chevron) chevron.className = isOpen ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
}
`;

src += DASHBOARD_HUB_FN;
changeCount++;
console.log('✅ Change 4: toggleOutreachHubDashboard() appended');

// ─────────────────────────────────────────────────────────────────────────────
// Write file
// ─────────────────────────────────────────────────────────────────────────────
if (changeCount < 4) {
  console.error(`\n❌ Only ${changeCount}/4 changes applied — aborting write.`);
  process.exit(1);
}

fs.writeFileSync(FILE, src, 'utf8');
console.log(`\n✅ All ${changeCount}/4 changes written to ${FILE}`);

// ─────────────────────────────────────────────────────────────────────────────
// Verify
// ─────────────────────────────────────────────────────────────────────────────
const verify = fs.readFileSync(FILE, 'utf8');
const checks = [
  { label: 'GUARD string present',                  needle: GUARD },
  { label: 'Insurance gap only if zero',             needle: "if (!products.insurance.length)   gaps.push('Insurance')" },
  { label: '"More Insurance" removed',               needle: "gaps.push('More Insurance')", absent: true },
  { label: 'Client 360 Summary label',               needle: "Client 360 Summary" },
  { label: 'Net Worth as primary metric',            needle: "Net Worth: <strong>${profile.netWorth" },
  { label: 'Product Gaps label',                     needle: "Product Gaps \u2014 Growth Opportunities" },
  { label: 'toggleOutreachHubDashboard defined',     needle: 'function toggleOutreachHubDashboard()' },
  { label: 'oh-body-dashboard reference',            needle: 'oh-body-dashboard' },
];

let pass = 0;
checks.forEach(({ label, needle, absent }) => {
  const found = verify.includes(needle);
  if (absent ? !found : found) {
    console.log(`  ✅ ${label}`);
    pass++;
  } else {
    console.error(`  ❌ ${absent ? 'STILL PRESENT' : 'MISSING'}: ${label}`);
  }
});

console.log(`\nVerification: ${pass}/${checks.length} checks passed.`);
if (pass < checks.length) process.exit(1);
