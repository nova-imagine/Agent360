/**
 * rename_p7_conflicts2.cjs
 * Renames the additional 19 original function declarations in app.js that Phase 7 overrides.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'public/static/app.js');
let src = fs.readFileSync(appJsPath, 'utf8');
const originalLen = src.length;

const renames = [
  ['function savePolicyChanges(policyId) {',       'function _orig_savePolicyChanges(policyId) {'],
  ['function openFraudDetailModal(claimId) {',     'function _orig_openFraudDetailModal(claimId) {'],
  ['function openFraudReportModal() {',            'function _orig_openFraudReportModal() {'],
  ['function openIDPModal(id) {',                  'function _orig_openIDPModal(id) {'],
  ['function togglePACPanel(btn) {',               'function _orig_togglePACPanel(btn) {'],
  ['function openNLPReview(policyId) {',           'function _orig_openNLPReview(policyId) {'],
  ['function openCIReviewModal() {',               'function _orig_openCIReviewModal() {'],
  ['function openRetentionFullReport() {',         'function _orig_openRetentionFullReport() {'],
  ['function openRenewalCenter() {',               'function _orig_openRenewalCenter() {'],
  ['function toggleRenewalCenter() {',             'function _orig_toggleRenewalCenter() {'],
  ['function openNewPolicyModal() {',              'function _orig_openNewPolicyModal() {'],
  ['function openRunCampaignModal() {',            'function _orig_openRunCampaignModal() {'],
  ['function openCoverageGapAnalysisModal() {',    'function _orig_openCoverageGapAnalysisModal() {'],
  ['function openGapOutreachModal(gapType) {',     'function _orig_openGapOutreachModal(gapType) {'],
  ['function draftRetentionEmail(clientKey) {',    'function _orig_draftRetentionEmail(clientKey) {'],
  ['function updateBatchButtons() {',              'function _orig_updateBatchButtons() {'],
  ['function batchSendDocReminders() {',           'function _orig_batchSendDocReminders() {'],
  ['function batchAssignAdjuster() {',             'function _orig_batchAssignAdjuster() {'],
  ['function toggleWorkbench(btn) {',              'function _orig_toggleWorkbench(btn) {'],
];

let changeCount = 0;
for (const [search, replace] of renames) {
  if (!src.includes(search)) {
    console.error(`❌  NOT FOUND: "${search.slice(0, 70)}"`);
    process.exit(1);
  }
  const occurrences = src.split(search).length - 1;
  if (occurrences > 1) {
    console.error(`❌  AMBIGUOUS (${occurrences}×): "${search.slice(0, 70)}"`);
    process.exit(1);
  }
  src = src.replace(search, replace);
  changeCount++;
  console.log(`✅  [${changeCount}/19] renamed: ${search.slice(9, 55).split('(')[0]}`);
}

fs.writeFileSync(appJsPath, src, 'utf8');
const newLen = src.length;
console.log(`\nDone. ${changeCount} renames applied.`);
console.log(`app.js: ${originalLen} → ${newLen} chars (Δ ${newLen - originalLen})`);
