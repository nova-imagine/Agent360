/**
 * rename_p7_conflicts.cjs
 * Renames the 15 original function declarations in app.js that Phase 7 overrides.
 * Pattern: function FOO( → function _orig_FOO(
 * Uses exact line-targeted replacements to avoid false positives.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'public/static/app.js');
let src = fs.readFileSync(appJsPath, 'utf8');
const originalLen = src.length;

const renames = [
  // [search-string, replacement-string]
  ['function openPACModal(alertId) {',         'function _orig_openPACModal(alertId) {'],
  ['function openRetentionModal(retId) {',     'function _orig_openRetentionModal(retId) {'],
  ['function filterPolicies() {',              'function _orig_filterPolicies() {'],
  ['function filterClaims() {',               'function _orig_filterClaims() {'],
  ['function toggleAllClaims(masterCb) {',    'function _orig_toggleAllClaims(masterCb) {'],
  ['function batchExportClaims() {',          'function _orig_batchExportClaims() {'],
  // one-liners — full line
  ["function filterClaimsByStatus(s) { alert('Filtering claims by status: ' + s); }",
   "function _orig_filterClaimsByStatus(s) { alert('Filtering claims by status: ' + s); }"],
  ["function filterClaimsBySLA() { alert('Showing SLA at-risk claims (CLM-2026-0041, CLM-2026-0028)'); }",
   "function _orig_filterClaimsBySLA() { alert('Showing SLA at-risk claims (CLM-2026-0041, CLM-2026-0028)'); }"],
  ["function filterClaimsByExposure() { alert('Sorting by open exposure — highest first'); }",
   "function _orig_filterClaimsByExposure() { alert('Sorting by open exposure — highest first'); }"],
  ["function filterClaimsByDocStatus() { alert('Filtering claims with incomplete docs'); }",
   "function _orig_filterClaimsByDocStatus() { alert('Filtering claims with incomplete docs'); }"],
  ["function showClaimsResolutionChart() { alert('Claims resolution trend chart — opening full analytics panel'); }",
   "function _orig_showClaimsResolutionChart() { alert('Claims resolution trend chart — opening full analytics panel'); }"],
  ["function showPayoutTurnaroundPanel() { alert('Payout turnaround detail panel'); }",
   "function _orig_showPayoutTurnaroundPanel() { alert('Payout turnaround detail panel'); }"],
  ['function openLapseAction(policyId) {',    'function _orig_openLapseAction(policyId) {'],
  ['function openPremiumChangeModal() {',     'function _orig_openPremiumChangeModal() {'],
  ['function open1035Analyzer() {',           'function _orig_open1035Analyzer() {'],
];

let changeCount = 0;
for (const [search, replace] of renames) {
  if (!src.includes(search)) {
    console.error(`❌  NOT FOUND: "${search.slice(0, 60)}"`);
    process.exit(1);
  }
  // Ensure only one occurrence
  const occurrences = src.split(search).length - 1;
  if (occurrences > 1) {
    console.error(`❌  AMBIGUOUS (${occurrences}×): "${search.slice(0, 60)}"`);
    process.exit(1);
  }
  src = src.replace(search, replace);
  changeCount++;
  console.log(`✅  [${changeCount}/15] renamed: ${search.slice(9, 50).split('(')[0]}`);
}

fs.writeFileSync(appJsPath, src, 'utf8');
const newLen = src.length;
console.log(`\nDone. ${changeCount} renames applied.`);
console.log(`app.js: ${originalLen} → ${newLen} chars (Δ ${newLen - originalLen})`);
