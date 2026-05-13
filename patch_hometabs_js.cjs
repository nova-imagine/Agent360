#!/usr/bin/env node
/**
 * patch_hometabs_js.cjs
 * 
 * 1. Adds switchHomeTab() function to public/static/app.js
 * 2. Guards both initDashboardCharts() call sites so charts only
 *    initialise when the My Book pane is visible (avoids canvas-in-hidden-div issues)
 */

const fs   = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'public/static/app.js');
let src = fs.readFileSync(FILE, 'utf8');
const original = src;

const GUARD = '/* HOME_TABS_SWITCHER_v1 */';
if (src.includes(GUARD)) {
  console.log('⚠️  Patch already applied — skipping.');
  process.exit(0);
}

let changeCount = 0;

// ─────────────────────────────────────────────────────────────────────────────
// CHANGE 1 — Guard the DOMContentLoaded initDashboardCharts() call
// This fires when the page first loads with the dashboard template.
// The Today tab is active by default, so charts should NOT init here.
// They will init when the user switches to My Book (or via the guard below).
// ─────────────────────────────────────────────────────────────────────────────
const OLD_DOMREADY = `// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initDashboardCharts();
  animateKPICards();`;

const NEW_DOMREADY = `// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  // Charts live in My Book tab (hidden by default) — only init if pane is visible
  const _mbPane = document.getElementById('home-pane-mybook');
  if (!_mbPane || _mbPane.style.display !== 'none') {
    initDashboardCharts();
  }
  animateKPICards();`;

if (src.includes(OLD_DOMREADY)) {
  src = src.replace(OLD_DOMREADY, NEW_DOMREADY);
  changeCount++;
  console.log('✅ Change 1: DOMContentLoaded initDashboardCharts guarded');
} else {
  console.error('❌ Change 1 NOT found — DOMContentLoaded block');
}

// ─────────────────────────────────────────────────────────────────────────────
// CHANGE 2 — Guard the page-navigation initDashboardCharts() call
// When the user navigates back to 'dashboard', Today tab is active so
// charts (in My Book) should not init. switchHomeTab handles it on tab click.
// ─────────────────────────────────────────────────────────────────────────────
const OLD_NAV = `    if (page === 'dashboard') {
      requestAnimationFrame(() => {
        setTimeout(() => {
          initDashboardCharts();
          animateKPICards();
        }, 80);
      });`;

const NEW_NAV = `    if (page === 'dashboard') {
      requestAnimationFrame(() => {
        setTimeout(() => {
          // Only init charts if My Book tab is currently active
          const _mb = document.getElementById('home-pane-mybook');
          if (_mb && _mb.style.display !== 'none') {
            initDashboardCharts();
          }
          animateKPICards();
        }, 80);
      });`;

if (src.includes(OLD_NAV)) {
  src = src.replace(OLD_NAV, NEW_NAV);
  changeCount++;
  console.log('✅ Change 2: page-nav initDashboardCharts guarded');
} else {
  console.error('❌ Change 2 NOT found — page-nav block');
}

// ─────────────────────────────────────────────────────────────────────────────
// CHANGE 3 — Append switchHomeTab() function
// Appended at end of file (after all existing code)
// ─────────────────────────────────────────────────────────────────────────────
const SWITCHER_FN = `

${GUARD}
// ── Home page tab switcher ──────────────────────────────────────────────────
function switchHomeTab(tab, btn) {
  // Deactivate all tabs
  document.querySelectorAll('.home-tab').forEach(function(t) {
    t.classList.remove('active');
  });
  // Hide all panes
  document.querySelectorAll('.home-tab-pane').forEach(function(p) {
    p.style.display = 'none';
  });
  // Activate the clicked button
  if (btn) btn.classList.add('active');
  // Show the target pane
  var pane = document.getElementById('home-pane-' + tab);
  if (pane) pane.style.display = 'block';
  // Initialise charts when My Book tab becomes visible
  if (tab === 'mybook') {
    setTimeout(function() {
      initDashboardCharts();
    }, 80);
  }
}
`;

src += SWITCHER_FN;
changeCount++;
console.log('✅ Change 3: switchHomeTab() function appended');

// ─────────────────────────────────────────────────────────────────────────────
// Write file
// ─────────────────────────────────────────────────────────────────────────────
if (changeCount < 3) {
  console.error(`\n❌ Only ${changeCount}/3 changes applied — aborting write to avoid partial patch.`);
  process.exit(1);
}

fs.writeFileSync(FILE, src, 'utf8');
console.log(`\n✅ All ${changeCount}/3 changes applied and written to ${FILE}`);

// ─────────────────────────────────────────────────────────────────────────────
// Verify
// ─────────────────────────────────────────────────────────────────────────────
const verify = fs.readFileSync(FILE, 'utf8');
const checks = [
  { label: 'GUARD string present',             needle: GUARD },
  { label: 'switchHomeTab function defined',   needle: 'function switchHomeTab(tab, btn)' },
  { label: 'mybook chart init in switcher',    needle: "if (tab === 'mybook')" },
  { label: 'DOMReady chart guard present',     needle: "if (!_mbPane || _mbPane.style.display !== 'none')" },
  { label: 'page-nav chart guard present',     needle: "if (_mb && _mb.style.display !== 'none')" },
  { label: 'animateKPICards still present',    needle: 'animateKPICards()' },
];

let pass = 0;
checks.forEach(({ label, needle }) => {
  if (verify.includes(needle)) {
    console.log(`  ✅ ${label}`);
    pass++;
  } else {
    console.error(`  ❌ MISSING: ${label}`);
  }
});

console.log(`\nVerification: ${pass}/${checks.length} checks passed.`);
if (pass < checks.length) process.exit(1);
