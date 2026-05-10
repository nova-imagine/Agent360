/* ================================================================
   PHASE 4 — Application Submission Engine
   NYL Agent 360 · phase4_module.js
   ================================================================ */

'use strict';

/* ── Prospect data (bridged from Phase 3) ── */
var p4Prospects = [
  {
    id: 'FNA-001', name: 'Alex Rivera', initials: 'AR', age: 34,
    dob: '1990-03-15', gender: 'Male', riskClass: 'Preferred Plus',
    smoker: 'Non-Smoker', height: '5\'11"', weight: '175 lbs',
    email: 'alex.rivera@email.com', phone: '(212) 555-0182',
    address: '412 Riverside Dr, New York, NY 10025', ssn: '***-**-4521',
    income: '$185,000', netWorth: '$420,000',
    product: 'Whole Life (Participating)', productCode: 'WL',
    coverage: '$500,000', premium: '$4,800/yr', term: 'Permanent',
    beneficiary: 'Sofia Rivera (Spouse)', beneficiaryDOB: '1992-07-22',
    contingentBene: 'Marco Rivera (Son)', contingentDOB: '2018-11-03',
    riders: ['Waiver of Premium', 'Accidental Death Benefit', 'Children\'s Term Rider'],
    paymentMode: 'Annual', paymentMethod: 'ACH Debit',
    conditions: 'None', medications: 'None', familyHistory: 'Father — hypertension (controlled)',
    labResults: 'All within normal limits (2024)', aiHealthScore: 94,
    aiPrefillPct: 91, status: 'Ready to Submit',
    caseNumber: null, appId: 'EA-001',
    faceThreshold: '<$1M', age45Check: true,
    examRequired: false, apsLikely: false,
    finUWRequired: false,
    stpProbability: 94,
    urgency: 'high'
  },
  {
    id: 'FNA-002', name: 'Nancy Foster', initials: 'NF', age: 41,
    dob: '1983-09-08', gender: 'Female', riskClass: 'Standard Plus',
    smoker: 'Non-Smoker', height: '5\'6"', weight: '148 lbs',
    email: 'nancy.foster@email.com', phone: '(646) 555-0341',
    address: '88 Park Ave S, New York, NY 10016', ssn: '***-**-7834',
    income: '$220,000', netWorth: '$680,000',
    product: 'IUL — Indexed Universal Life', productCode: 'IUL',
    coverage: '$750,000', premium: '$9,600/yr', term: 'Permanent',
    beneficiary: 'David Foster (Spouse)', beneficiaryDOB: '1980-04-14',
    contingentBene: 'Emily Foster (Daughter)', contingentDOB: '2012-06-19',
    riders: ['Overloan Protection Rider', 'Chronic Illness Accelerated Benefit'],
    paymentMode: 'Monthly', paymentMethod: 'Credit Card',
    conditions: 'Mild hypertension — controlled, Rx Lisinopril 10mg',
    medications: 'Lisinopril 10mg (daily)', familyHistory: 'Mother — Type 2 Diabetes',
    labResults: 'BP 128/82 (2024), Cholesterol LDL 118 mg/dL',
    aiHealthScore: 78,
    aiPrefillPct: 84, status: 'Draft — Health Review',
    caseNumber: null, appId: 'EA-002',
    faceThreshold: '<$1M', age45Check: false,
    examRequired: true, apsLikely: true,
    finUWRequired: false,
    stpProbability: 61,
    urgency: 'medium'
  },
  {
    id: 'FNA-003', name: 'Patricia Nguyen', initials: 'PN', age: 48,
    dob: '1977-01-30', gender: 'Female', riskClass: 'Table 2',
    smoker: 'Non-Smoker', height: '5\'4"', weight: '162 lbs',
    email: 'patricia.nguyen@email.com', phone: '(917) 555-0788',
    address: '1560 Broadway, New York, NY 10036', ssn: '***-**-2290',
    income: '$310,000', netWorth: '$1,850,000',
    product: 'GUL — Guaranteed Universal Life', productCode: 'GUL',
    coverage: '$1,500,000', premium: '$14,400/yr', term: 'To Age 100',
    beneficiary: 'Thomas Nguyen (Spouse)', beneficiaryDOB: '1974-08-17',
    contingentBene: 'Nguyen Family Trust', contingentDOB: 'N/A',
    riders: ['Return of Premium Rider', 'Terminal Illness Accelerated Benefit'],
    paymentMode: 'Quarterly', paymentMethod: 'ACH Debit',
    conditions: 'Type 2 Diabetes (controlled) — Rx Metformin 1000mg, Jardiance 10mg; Obese BMI 28.4',
    medications: 'Metformin 1000mg (daily), Jardiance 10mg (daily)',
    familyHistory: 'Father — heart disease age 62, Mother — Type 2 Diabetes',
    labResults: 'HbA1c 6.8% (2024), BP 134/86, Creatinine 0.9 mg/dL',
    aiHealthScore: 58,
    aiPrefillPct: 79, status: 'Pending Financial Docs',
    caseNumber: null, appId: 'EA-003',
    faceThreshold: '>$1M', age45Check: false,
    examRequired: true, apsLikely: true,
    finUWRequired: true,
    stpProbability: 22,
    urgency: 'urgent'
  }
];

/* ── Good Order Check rules ── */
var p4GOCRules = [
  { id: 'G01', section: 'Personal Info',   field: 'Beneficiary Date of Birth',       critical: true  },
  { id: 'G02', section: 'Personal Info',   field: 'SSN — must be 9 digits',           critical: true  },
  { id: 'G03', section: 'Coverage',        field: 'Face Amount entered',              critical: true  },
  { id: 'G04', section: 'Coverage',        field: 'Premium mode selected',            critical: false },
  { id: 'G05', section: 'Coverage',        field: 'Payment method on file',           critical: false },
  { id: 'G06', section: 'Health',          field: 'Health class confirmed',           critical: true  },
  { id: 'G07', section: 'Health',          field: 'Tobacco use answered',             critical: true  },
  { id: 'G08', section: 'Health',          field: 'All Part 1 health Qs answered',    critical: true  },
  { id: 'G09', section: 'Financial',       field: 'Income verified (face > $500K)',   critical: false },
  { id: 'G10', section: 'Beneficiary',     field: 'Primary beneficiary name + DOB',  critical: true  },
  { id: 'G11', section: 'Beneficiary',     field: 'Contingent beneficiary listed',   critical: false },
  { id: 'G12', section: 'Signature',       field: 'Agent\'s Statement signed',        critical: true  },
  { id: 'G13', section: 'Signature',       field: 'Client authorization signed',      critical: true  },
  { id: 'G14', section: 'Riders',          field: 'Rider selections confirmed',       critical: false },
  { id: 'G15', section: 'Financial',       field: 'Financial questionnaire complete', critical: false }
];

/* ── Exam vendor data ── */
var p4ExamVendors = [
  { id: 'V1', name: 'ExamOne', network: '4,200 locations nationwide', turnaround: '3–5 business days', rating: 4.8 },
  { id: 'V2', name: 'APPS (American Para)',  network: '3,800 locations nationwide', turnaround: '2–4 business days', rating: 4.6 },
  { id: 'V3', name: 'Clinical Reference Lab', network: '2,100 locations nationwide', turnaround: '4–6 business days', rating: 4.5 },
  { id: 'V4', name: 'Home Visit (Mobile)',  network: 'Agent-scheduled, home/office', turnaround: '1–2 business days', rating: 4.9 }
];

/* ── APS trigger conditions ── */
var p4APSTriggers = [
  { condition: 'Diabetes (any type)',            prob: 92, note: 'Attending physician statement almost certain — gather A1c, Creatinine' },
  { condition: 'Hypertension (Rx controlled)',   prob: 55, note: 'APS likely if Rx > 1 medication or BP readings >135/85 on exam' },
  { condition: 'Cardiac History',                prob: 97, note: 'Full cardiology APS required — allow 4–6 week delay' },
  { condition: 'Cancer (treated, >5yr)',         prob: 88, note: 'Oncology APS + pathology reports required' },
  { condition: 'Mental Health / Depression',     prob: 44, note: 'APS if hospitalized or Rx within 2 years' },
  { condition: 'Obesity (BMI >30)',              prob: 38, note: 'APS if BMI >35 or comorbidities present' },
  { condition: 'Sleep Apnea (CPAP)',             prob: 41, note: 'APS if untreated or severe, otherwise paramedical only' },
  { condition: 'None / Clean history',           prob: 4,  note: 'APS extremely unlikely — accelerated UW probable' }
];

/* ── Case tracker data ── */
var p4Cases = [
  {
    id: 'NYL-2026-04821', prospectId: 'FNA-001', name: 'Alex Rivera',
    product: 'Whole Life $500K', submitted: '2026-04-28',
    status: 'Approved — Pending Delivery', stage: 'approved',
    uwDecision: 'Preferred Plus — Standard rates', stpProcessed: true,
    decisionDate: '2026-04-29', caseManager: 'Sarah K.',
    requirements: [], premium: '$4,800/yr', commission: '$576'
  },
  {
    id: 'NYL-2026-04902', prospectId: 'FNA-002', name: 'Nancy Foster',
    product: 'IUL $750K', submitted: '2026-05-01',
    status: 'Pending — APS Ordered', stage: 'pending',
    uwDecision: null, stpProcessed: false,
    decisionDate: null, caseManager: 'Michael T.',
    requirements: ['APS from Dr. Linda Park (Hypertension)', 'Lab re-run (BP borderline)'],
    premium: '$9,600/yr', commission: '$1,152'
  },
  {
    id: 'NYL-2026-04988', prospectId: 'FNA-003', name: 'Patricia Nguyen',
    product: 'GUL $1.5M', submitted: null,
    status: 'Incomplete — Financial Docs Needed', stage: 'incomplete',
    uwDecision: null, stpProcessed: false,
    decisionDate: null, caseManager: 'Jennifer L.',
    requirements: ['2024 Tax Return', '2023 Tax Return', 'CPA Letter — income verification', 'APS — Endocrinologist (Diabetes)'],
    premium: '$14,400/yr', commission: '$1,728'
  }
];

/* ── Active state ── */
var _p4ActiveProspect = null;

/* ================================================================
   INIT — override initSalesPage (last-definition-wins)
   ================================================================ */
function initSalesPage() {
  p4RenderSubmissionHub();
  p4RenderCaseTracker();
  /* existing sales page JS (Kanban, pipeline, etc.) still bootstraps
     from the sales-main-col which is static JSX — no conflict */
}

/* ================================================================
   SUBMISSION HUB RENDERER
   ================================================================ */
function p4RenderSubmissionHub() {
  var el = document.getElementById('p4-submission-hub');
  if (!el) return;

  var cards = p4Prospects.map(function(p) {
    var urgClass = p.urgency === 'urgent' ? 'p4-urg-red' : p.urgency === 'high' ? 'p4-urg-amber' : 'p4-urg-green';
    var stpBar   = p.stpProbability;
    var stpColor = stpBar >= 80 ? '#059669' : stpBar >= 50 ? '#d97706' : '#dc2626';
    var examBadge = p.examRequired
      ? '<span class="p4-badge p4-badge-exam"><i class="fas fa-stethoscope"></i> Exam Req\'d</span>'
      : '<span class="p4-badge p4-badge-stp"><i class="fas fa-bolt"></i> No Exam</span>';
    var apsBadge = p.apsLikely
      ? '<span class="p4-badge p4-badge-aps"><i class="fas fa-file-medical-alt"></i> APS Likely</span>'
      : '';
    var finBadge = p.finUWRequired
      ? '<span class="p4-badge p4-badge-fin"><i class="fas fa-dollar-sign"></i> Fin UW Req\'d</span>'
      : '';

    return '<div class="p4-app-card' + (p.urgency === 'urgent' ? ' p4-app-card-urgent' : '') + '" onclick="p4SelectProspect(\'' + p.id + '\')" id="p4-card-' + p.id + '">'
      + '<div class="p4-card-top">'
      +   '<div class="p4-avatar">' + p.initials + '</div>'
      +   '<div class="p4-card-info">'
      +     '<div class="p4-card-name">' + p.name + ' <span class="' + urgClass + '">' + (p.urgency === 'urgent' ? '🔴 URGENT' : p.urgency === 'high' ? '🟡 High' : '🟢 Normal') + '</span></div>'
      +     '<div class="p4-card-sub">' + p.product + ' · ' + p.coverage + '</div>'
      +     '<div class="p4-card-status">' + p.status + '</div>'
      +   '</div>'
      + '</div>'
      + '<div class="p4-card-badges">' + examBadge + apsBadge + finBadge + '</div>'
      + '<div class="p4-stp-row">'
      +   '<div class="p4-stp-label">STP Probability</div>'
      +   '<div class="p4-stp-track"><div class="p4-stp-fill" style="width:' + stpBar + '%;background:' + stpColor + '"><span>' + stpBar + '%</span></div></div>'
      + '</div>'
      + '<div class="p4-card-actions">'
      +   '<button class="p4-btn-sm primary" onclick="event.stopPropagation();p4SelectProspect(\'' + p.id + '\');p4LaunchEApp(\'' + p.id + '\')"><i class="fas fa-file-signature"></i> Smart e-App</button>'
      +   '<button class="p4-btn-sm" onclick="event.stopPropagation();p4OpenGOC(\'' + p.id + '\')"><i class="fas fa-check-double"></i> Good Order Check</button>'
      +   '<button class="p4-btn-sm" onclick="event.stopPropagation();p4OpenExamScheduler(\'' + p.id + '\')"><i class="fas fa-stethoscope"></i> Exam</button>'
      + '</div>'
      + '</div>';
  }).join('');

  el.innerHTML = cards;
}

/* ================================================================
   SELECT PROSPECT
   ================================================================ */
function p4SelectProspect(pid) {
  _p4ActiveProspect = pid;
  document.querySelectorAll('.p4-app-card').forEach(function(c) {
    c.classList.remove('p4-app-card-selected');
  });
  var card = document.getElementById('p4-card-' + pid);
  if (card) card.classList.add('p4-app-card-selected');
  p4RenderDetailPanel(pid);
}

/* ================================================================
   RIGHT PANEL — PROSPECT DETAIL
   ================================================================ */
function p4RenderDetailPanel(pid) {
  var el = document.getElementById('p4-detail-panel');
  if (!el) return;
  var p = p4Prospects.filter(function(x){ return x.id === pid; })[0];
  if (!p) { el.innerHTML = '<div class="p4-empty">Select a prospect to view details.</div>'; return; }

  var stpColor = p.stpProbability >= 80 ? 'green' : p.stpProbability >= 50 ? 'amber' : 'red';

  el.innerHTML = '<div class="p4-detail-header">'
    + '<div class="p4-detail-avatar">' + p.initials + '</div>'
    + '<div class="p4-detail-title">'
    +   '<div class="p4-detail-name">' + p.name + '</div>'
    +   '<div class="p4-detail-sub">Age ' + p.age + ' · ' + p.riskClass + ' · ' + p.product + '</div>'
    +   '<div class="p4-detail-status">' + p.status + '</div>'
    + '</div>'
    + '<div class="p4-detail-stp">'
    +   '<div class="p4-stp-circle ' + stpColor + '">' + p.stpProbability + '%</div>'
    +   '<div class="p4-stp-lbl">STP Score</div>'
    + '</div>'
    + '</div>'

    + '<div class="p4-ai-rec-banner">'
    +   '<i class="fas fa-robot"></i>'
    +   '<span>' + _p4AIRecommendation(p) + '</span>'
    + '</div>'

    + '<div class="p4-section-tabs" id="p4-detail-tabs">'
    +   '<button class="p4-tab active" onclick="p4SwitchTab(\'summary\',this)">Summary</button>'
    +   '<button class="p4-tab" onclick="p4SwitchTab(\'coverage\',this)">Coverage</button>'
    +   '<button class="p4-tab" onclick="p4SwitchTab(\'health\',this)">Health</button>'
    +   '<button class="p4-tab" onclick="p4SwitchTab(\'financial\',this)">Financial</button>'
    +   '<button class="p4-tab" onclick="p4SwitchTab(\'checklist\',this)">Checklist</button>'
    + '</div>'
    + '<div class="p4-tab-body" id="p4-tab-body">'
    + _p4TabSummary(p)
    + '</div>'

    + '<div class="p4-detail-action-bar">'
    +   '<button class="p4-det-btn primary" onclick="p4LaunchEApp(\'' + p.id + '\')"><i class="fas fa-file-signature"></i> Smart e-App</button>'
    +   '<button class="p4-det-btn" onclick="p4OpenGOC(\'' + p.id + '\')"><i class="fas fa-check-double"></i> Good Order Check</button>'
    +   '<button class="p4-det-btn" onclick="p4OpenExamScheduler(\'' + p.id + '\')"><i class="fas fa-stethoscope"></i> Schedule Exam</button>'
    +   '<button class="p4-det-btn" onclick="p4OpenAccelUW(\'' + p.id + '\')"><i class="fas fa-bolt"></i> Accel UW</button>'
    +   '<button class="p4-det-btn" onclick="p4OpenAPSPredictor(\'' + p.id + '\')"><i class="fas fa-file-medical-alt"></i> APS Predict</button>'
    +   '<button class="p4-det-btn" onclick="p4OpenFinJust(\'' + p.id + '\')"><i class="fas fa-dollar-sign"></i> Fin Justification</button>'
    +   '<button class="p4-det-btn primary-dark" onclick="p4SubmitApplication(\'' + p.id + '\')"><i class="fas fa-paper-plane"></i> Submit to NYL</button>'
    + '</div>';
}

function _p4AIRecommendation(p) {
  if (p.stpProbability >= 80) {
    return 'AI: ' + p.stpProbability + '% straight-through processing probability. No exam required. Expected decision: 2–4 hours after submission.';
  } else if (p.stpProbability >= 50) {
    return 'AI: Moderate STP score (' + p.stpProbability + '%). Paramedical exam recommended. APS likely for existing Rx history. Timeline: 2–3 weeks.';
  } else {
    return 'AI: Low STP score (' + p.stpProbability + '%). Full paramed + APS required. Financial docs needed for ' + p.coverage + ' face amount. Estimated timeline: 4–6 weeks.';
  }
}

function p4SwitchTab(tabId, btn) {
  var pid = _p4ActiveProspect;
  var p = p4Prospects.filter(function(x){ return x.id === pid; })[0];
  if (!p) return;
  document.querySelectorAll('.p4-tab').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  var body = document.getElementById('p4-tab-body');
  if (!body) return;
  if (tabId === 'summary')   body.innerHTML = _p4TabSummary(p);
  if (tabId === 'coverage')  body.innerHTML = _p4TabCoverage(p);
  if (tabId === 'health')    body.innerHTML = _p4TabHealth(p);
  if (tabId === 'financial') body.innerHTML = _p4TabFinancial(p);
  if (tabId === 'checklist') body.innerHTML = _p4TabChecklist(p);
}

function _p4TabSummary(p) {
  return '<div class="p4-kpi-row">'
    + _p4kpi('fa-shield-alt', p.product, 'Product', 'blue')
    + _p4kpi('fa-dollar-sign', p.coverage, 'Face Amount', 'green')
    + _p4kpi('fa-credit-card', p.premium, 'Annual Premium', 'purple')
    + _p4kpi('fa-heartbeat', p.riskClass, 'Risk Class', 'teal')
    + '</div>'
    + '<div class="p4-info-grid">'
    + _p4row('Date of Birth', p.dob) + _p4row('Email', p.email)
    + _p4row('Phone', p.phone) + _p4row('Address', p.address)
    + _p4row('Beneficiary', p.beneficiary + ' (DOB: ' + p.beneficiaryDOB + ')')
    + _p4row('Contingent', p.contingentBene)
    + _p4row('Payment Mode', p.paymentMode) + _p4row('Payment Method', p.paymentMethod)
    + '</div>'
    + '<div class="p4-riders-list"><div class="p4-section-label"><i class="fas fa-plus-circle"></i> Riders</div>'
    + p.riders.map(function(r){ return '<span class="p4-rider-chip">' + r + '</span>'; }).join('')
    + '</div>';
}

function _p4TabCoverage(p) {
  return '<div class="p4-coverage-card">'
    + '<div class="p4-section-label"><i class="fas fa-shield-alt"></i> Coverage Details</div>'
    + _p4row('Product', p.product) + _p4row('Product Code', p.productCode)
    + _p4row('Face Amount', p.coverage) + _p4row('Annual Premium', p.premium)
    + _p4row('Term', p.term) + _p4row('Payment Mode', p.paymentMode)
    + _p4row('Payment Method', p.paymentMethod)
    + '</div>'
    + '<div class="p4-coverage-card" style="margin-top:12px">'
    + '<div class="p4-section-label"><i class="fas fa-users"></i> Beneficiary Designation</div>'
    + _p4row('Primary Beneficiary', p.beneficiary)
    + _p4row('Primary DOB', p.beneficiaryDOB)
    + _p4row('Primary %', '100%')
    + _p4row('Contingent Beneficiary', p.contingentBene)
    + _p4row('Contingent DOB', p.contingentDOB)
    + '</div>'
    + '<div class="p4-coverage-card" style="margin-top:12px">'
    + '<div class="p4-section-label"><i class="fas fa-plus-circle"></i> Selected Riders</div>'
    + p.riders.map(function(r){ return '<div class="p4-rider-row"><i class="fas fa-check-circle" style="color:#059669"></i> ' + r + '</div>'; }).join('')
    + '</div>';
}

function _p4TabHealth(p) {
  var scoreColor = p.aiHealthScore >= 80 ? '#059669' : p.aiHealthScore >= 60 ? '#d97706' : '#dc2626';
  return '<div class="p4-health-score-card">'
    + '<div class="p4-hs-circle" style="--hs-color:' + scoreColor + '">' + p.aiHealthScore + '<span>/100</span></div>'
    + '<div class="p4-hs-info">'
    +   '<div class="p4-hs-title">AI Health Score</div>'
    +   '<div class="p4-hs-sub">Based on MIB, Rx history, MVR, lab results, exam data</div>'
    + '</div>'
    + '</div>'
    + '<div class="p4-info-grid">'
    + _p4row('Risk Class', p.riskClass) + _p4row('Tobacco Use', p.smoker)
    + _p4row('Height', p.height) + _p4row('Weight', p.weight)
    + _p4row('Conditions / Medications', p.conditions)
    + _p4row('Family History', p.familyHistory)
    + _p4row('Lab Results', p.labResults)
    + '</div>'
    + '<div class="p4-aps-flag-box ' + (p.apsLikely ? 'aps-likely' : 'aps-clear') + '">'
    +   '<i class="fas ' + (p.apsLikely ? 'fa-exclamation-triangle' : 'fa-check-circle') + '"></i>'
    +   (p.apsLikely ? ' APS Likely — run APS Predictor to see which physicians to contact.' : ' No APS expected — clean health history.')
    + '</div>';
}

function _p4TabFinancial(p) {
  return '<div class="p4-info-grid">'
    + _p4row('Annual Income', p.income) + _p4row('Net Worth', p.netWorth)
    + _p4row('Coverage Requested', p.coverage)
    + _p4row('Financial UW Required', p.finUWRequired ? 'YES — Face amount > $1M' : 'No (face ≤ $1M)')
    + '</div>'
    + (p.finUWRequired ? '<div class="p4-fin-docs-card">'
    +   '<div class="p4-section-label"><i class="fas fa-folder-open"></i> Required Financial Documents</div>'
    +   '<div class="p4-fin-doc-row"><i class="fas fa-file-invoice"></i> 2024 Federal Tax Return (1040)</div>'
    +   '<div class="p4-fin-doc-row"><i class="fas fa-file-invoice"></i> 2023 Federal Tax Return (1040)</div>'
    +   '<div class="p4-fin-doc-row"><i class="fas fa-file-invoice-dollar"></i> W-2 or 1099 (2024)</div>'
    +   '<div class="p4-fin-doc-row"><i class="fas fa-landmark"></i> CPA Letter — Income Verification</div>'
    +   '<div class="p4-fin-doc-row"><i class="fas fa-chart-line"></i> Investment Statements (last quarter)</div>'
    +   '<button class="p4-btn-sm primary" style="margin-top:12px" onclick="p4OpenFinJust(\'' + p.id + '\')"><i class="fas fa-pen"></i> Build Financial Justification Narrative</button>'
    + '</div>' : '<div class="p4-fin-clear-note"><i class="fas fa-check-circle"></i> No financial underwriting documents required for this face amount.</div>');
}

function _p4TabChecklist(p) {
  /* Simulate pass/fail based on prospect data */
  var results = p4GOCRules.map(function(rule) {
    var pass = true;
    if (rule.id === 'G01' && !p.beneficiaryDOB) pass = false;
    if (rule.id === 'G09' && p.finUWRequired)   pass = false; /* stub — docs not uploaded */
    if (rule.id === 'G15' && p.finUWRequired)   pass = false;
    return { rule: rule, pass: pass };
  });

  var fails = results.filter(function(r){ return !r.pass; });
  var banner = fails.length
    ? '<div class="p4-goc-banner warn"><i class="fas fa-exclamation-triangle"></i> ' + fails.length + ' item(s) need attention before submission.</div>'
    : '<div class="p4-goc-banner ok"><i class="fas fa-check-circle"></i> Application is in Good Order — ready to submit.</div>';

  return banner + '<div class="p4-checklist-table">'
    + results.map(function(r) {
      return '<div class="p4-check-row ' + (r.pass ? 'pass' : 'fail') + '">'
        + '<i class="fas ' + (r.pass ? 'fa-check-circle' : 'fa-times-circle') + '"></i>'
        + '<span class="p4-check-section">' + r.rule.section + '</span>'
        + '<span class="p4-check-field">' + r.rule.field + '</span>'
        + (r.rule.critical ? '<span class="p4-check-critical">Critical</span>' : '')
        + '</div>';
    }).join('')
    + '</div>';
}

function _p4kpi(icon, val, lbl, color) {
  return '<div class="p4-kpi-card ' + color + '"><i class="fas ' + icon + '"></i><div class="p4-kpi-val">' + val + '</div><div class="p4-kpi-lbl">' + lbl + '</div></div>';
}
function _p4row(lbl, val) {
  return '<div class="p4-info-row"><span class="p4-info-lbl">' + lbl + '</span><span class="p4-info-val">' + (val || '—') + '</span></div>';
}

/* ================================================================
   LAUNCH SMART E-APP (bridges to existing eapp-overlay)
   ================================================================ */
function p4LaunchEApp(pid) {
  var p = p4Prospects.filter(function(x){ return x.id === pid; })[0];
  if (!p) return;

  /* Populate eAppData with Phase 4 prospect data */
  if (typeof eAppData !== 'undefined') {
    eAppData['EA-P4'] = {
      id: 'EA-P4', dealId: pid, uwId: null,
      client: p.name, age: String(p.age), dob: p.dob,
      email: p.email, phone: p.phone,
      address: p.address, ssn: p.ssn,
      product: p.product, productCode: p.productCode,
      coverage: p.coverage, premium: p.premium, term: p.term,
      beneficiary: p.beneficiary, beneficiaryPct: '100%',
      riders: p.riders, healthClass: p.riskClass, smoker: p.smoker,
      height: p.height, weight: p.weight, bmi: '',
      conditions: p.conditions, medications: p.medications,
      familyHistory: p.familyHistory, labResults: p.labResults,
      aiHealthScore: p.aiHealthScore,
      aiPrefillPct: p.aiPrefillPct,
      status: p.status, step: 1,
      documents: [
        { name: 'Life Application — Part 1 (Non-Medical)', status: 'ai-filled', aiTag: 'AI Pre-filled ' + p.aiPrefillPct + '%' },
        { name: 'Agent\'s Statement / Field UW Report',    status: 'pending',   aiTag: 'Agent Signature Required' },
        { name: 'HIPAA Authorization',                      status: 'ai-filled', aiTag: 'AI Filled' },
        { name: 'Beneficiary Designation Form',             status: 'ai-filled', aiTag: 'AI Filled' },
        { name: 'Premium Authorization (ACH)',              status: p.paymentMethod === 'ACH Debit' ? 'ai-filled' : 'pending', aiTag: p.paymentMethod === 'ACH Debit' ? 'AI Filled' : 'Needs Signature' },
        { name: 'Illustration Acknowledgment (NAIC)',       status: 'ai-filled', aiTag: 'Signed — Phase 3' }
      ],
      aiInsight: _p4AIRecommendation(p)
    };
    if (typeof openEApp === 'function') openEApp('EA-P4');
  } else {
    /* fallback toast */
    _p4Toast('<i class="fas fa-file-signature"></i> Smart e-App for ' + p.name + ' — AI pre-filled ' + p.aiPrefillPct + '% of fields.', 4000);
  }
}

/* ================================================================
   GOOD ORDER CHECK OVERLAY
   ================================================================ */
function p4OpenGOC(pid) {
  if (pid) _p4ActiveProspect = pid;
  var overlay = document.getElementById('p4-goc-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  p4RenderGOC();
}

function p4CloseGOC(e) {
  if (e && e.target !== document.getElementById('p4-goc-overlay')) return;
  var overlay = document.getElementById('p4-goc-overlay');
  if (overlay) overlay.style.display = 'none';
}

function p4CloseGOCForce() {
  var overlay = document.getElementById('p4-goc-overlay');
  if (overlay) overlay.style.display = 'none';
}

function p4RenderGOC() {
  var body = document.getElementById('p4-goc-body');
  if (!body) return;
  var p = p4Prospects.filter(function(x){ return x.id === _p4ActiveProspect; })[0];
  if (!p) { body.innerHTML = '<div class="p4-empty">No prospect selected.</div>'; return; }

  var results = p4GOCRules.map(function(rule) {
    var pass = true;
    if (rule.id === 'G01' && !p.beneficiaryDOB)  pass = false;
    if (rule.id === 'G09' && p.finUWRequired)      pass = false;
    if (rule.id === 'G15' && p.finUWRequired)      pass = false;
    return { rule: rule, pass: pass };
  });

  var totalPass = results.filter(function(r){ return r.pass; }).length;
  var totalFail = results.length - totalPass;
  var criticalFail = results.filter(function(r){ return !r.pass && r.rule.critical; }).length;

  body.innerHTML = '<div class="p4-goc-prospect-bar">'
    + '<div class="p4-avatar sm">' + p.initials + '</div>'
    + '<div><div class="p4-goc-pname">' + p.name + '</div><div class="p4-goc-psub">' + p.product + ' · ' + p.coverage + '</div></div>'
    + '<div class="p4-goc-score ' + (criticalFail === 0 ? 'ok' : 'fail') + '">'
    +   '<div class="p4-goc-score-val">' + totalPass + '/' + results.length + '</div>'
    +   '<div class="p4-goc-score-lbl">Good Order</div>'
    + '</div>'
    + '</div>'

    + (criticalFail > 0
      ? '<div class="p4-goc-alert"><i class="fas fa-exclamation-triangle"></i> <strong>' + criticalFail + ' critical item' + (criticalFail > 1 ? 's' : '') + '</strong> will cause a requirement — resolve before submitting.</div>'
      : '<div class="p4-goc-ok"><i class="fas fa-check-circle"></i> All critical fields complete. Application ready for submission.</div>')

    + '<div class="p4-goc-sections">'
    + _p4GOCSectionHTML(results, 'Personal Info')
    + _p4GOCSectionHTML(results, 'Coverage')
    + _p4GOCSectionHTML(results, 'Health')
    + _p4GOCSectionHTML(results, 'Financial')
    + _p4GOCSectionHTML(results, 'Beneficiary')
    + _p4GOCSectionHTML(results, 'Signature')
    + _p4GOCSectionHTML(results, 'Riders')
    + '</div>'

    + '<div class="p4-goc-footer">'
    +   '<button class="p4-det-btn" onclick="p4CloseGOCForce()"><i class="fas fa-times"></i> Close</button>'
    +   (criticalFail === 0
        ? '<button class="p4-det-btn primary" onclick="p4LaunchEApp(\'' + p.id + '\');p4CloseGOCForce()"><i class="fas fa-paper-plane"></i> Open Smart e-App</button>'
        : '<button class="p4-det-btn" onclick="p4LaunchEApp(\'' + p.id + '\');p4CloseGOCForce()"><i class="fas fa-pen"></i> Fix in e-App</button>')
    + '</div>';
}

function _p4GOCSectionHTML(results, section) {
  var items = results.filter(function(r){ return r.rule.section === section; });
  if (!items.length) return '';
  return '<div class="p4-goc-section">'
    + '<div class="p4-goc-sec-title">' + section + '</div>'
    + items.map(function(r){
        return '<div class="p4-goc-item ' + (r.pass ? 'pass' : 'fail') + '">'
          + '<i class="fas ' + (r.pass ? 'fa-check-circle' : 'fa-times-circle') + '"></i>'
          + '<span>' + r.rule.field + '</span>'
          + (r.rule.critical ? '<span class="p4-goc-crit-tag">Critical</span>' : '')
          + '</div>';
      }).join('')
    + '</div>';
}

/* ================================================================
   EXAM SCHEDULER OVERLAY
   ================================================================ */
function p4OpenExamScheduler(pid) {
  if (pid) _p4ActiveProspect = pid;
  var overlay = document.getElementById('p4-exam-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  p4RenderExamScheduler();
}

function p4CloseExam(e) {
  if (e && e.target !== document.getElementById('p4-exam-overlay')) return;
  var overlay = document.getElementById('p4-exam-overlay');
  if (overlay) overlay.style.display = 'none';
}

function p4CloseExamForce() {
  var overlay = document.getElementById('p4-exam-overlay');
  if (overlay) overlay.style.display = 'none';
}

function p4RenderExamScheduler() {
  var body = document.getElementById('p4-exam-body');
  if (!body) return;
  var p = p4Prospects.filter(function(x){ return x.id === _p4ActiveProspect; })[0];
  if (!p) { body.innerHTML = '<div class="p4-empty">No prospect selected.</div>'; return; }

  /* Determine exam type */
  var examType, examScope, examNote;
  if (!p.examRequired) {
    examType  = 'Accelerated Underwriting — No Exam Required';
    examScope = 'AI Health Score ' + p.aiHealthScore + '/100 · STP ' + p.stpProbability + '% · Below exam threshold';
    examNote  = 'This applicant qualifies for straight-through processing. No paramedical exam or blood draw needed. Submit e-App and expect automated decision within 2–4 hours.';
  } else if (Number(p.coverage.replace(/[^0-9]/g,'')) >= 1000000 || p.age >= 50) {
    examType  = 'Full Paramedical Exam';
    examScope = 'Blood · Urine · Vitals · Resting EKG · Cognitive Screen';
    examNote  = 'Face amount or age triggers full paramed. Coordinate with ExamOne or APPS. Schedule within 30 days of application signature.';
  } else {
    examType  = 'Standard Paramedical Exam';
    examScope = 'Blood · Urine · Vitals (BP, Height/Weight)';
    examNote  = 'Standard exam required. Can be scheduled at client home, office, or exam center. Usually completed within 1 week.';
  }

  /* Time slots */
  var slots = [
    { date: 'Mon May 12', time: '9:00 AM',  vendor: 'ExamOne',     location: 'Home Visit' },
    { date: 'Tue May 13', time: '2:00 PM',  vendor: 'APPS',        location: '88 Park Ave S (Work)' },
    { date: 'Wed May 14', time: '10:30 AM', vendor: 'ExamOne',     location: 'Exam Center — Midtown' },
    { date: 'Thu May 15', time: '8:00 AM',  vendor: 'Home Visit',  location: p.address },
    { date: 'Fri May 16', time: '1:00 PM',  vendor: 'CRL',         location: 'Lab — 34th St' }
  ];

  body.innerHTML = '<div class="p4-exam-prospect">'
    + '<div class="p4-avatar sm">' + p.initials + '</div>'
    + '<div><div class="p4-exam-pname">' + p.name + '</div><div class="p4-exam-psub">Age ' + p.age + ' · ' + p.riskClass + '</div></div>'
    + '</div>'

    + '<div class="p4-exam-type-card ' + (p.examRequired ? 'required' : 'noexam') + '">'
    +   '<div class="p4-exam-type-title"><i class="fas ' + (p.examRequired ? 'fa-stethoscope' : 'fa-bolt') + '"></i> ' + examType + '</div>'
    +   '<div class="p4-exam-type-scope">' + examScope + '</div>'
    +   '<div class="p4-exam-type-note">' + examNote + '</div>'
    + '</div>'

    + (p.examRequired ? '<div class="p4-exam-vendors">'
    + '<div class="p4-section-label"><i class="fas fa-building"></i> Exam Vendors</div>'
    + p4ExamVendors.map(function(v){
        return '<div class="p4-vendor-row">'
          + '<div class="p4-vendor-name">' + v.name + '</div>'
          + '<div class="p4-vendor-meta">' + v.network + ' · ' + v.turnaround + '</div>'
          + '<div class="p4-vendor-rating">★ ' + v.rating + '</div>'
          + '</div>';
      }).join('')
    + '</div>' : '')

    + (p.examRequired ? '<div class="p4-slot-section">'
    + '<div class="p4-section-label"><i class="fas fa-calendar-alt"></i> Available Slots (AI-Matched to Prospect\'s Calendar)</div>'
    + slots.map(function(s, i){
        return '<div class="p4-slot-row" onclick="p4BookSlot(this,' + i + ')">'
          + '<div class="p4-slot-date">' + s.date + '</div>'
          + '<div class="p4-slot-time">' + s.time + '</div>'
          + '<div class="p4-slot-vendor">' + s.vendor + '</div>'
          + '<div class="p4-slot-loc">' + s.location + '</div>'
          + '<button class="p4-btn-sm primary">Book</button>'
          + '</div>';
      }).join('')
    + '</div>' : '')

    + '<div class="p4-exam-footer">'
    +   '<button class="p4-det-btn" onclick="p4CloseExamForce()"><i class="fas fa-times"></i> Close</button>'
    +   (p.examRequired
        ? '<button class="p4-det-btn primary" onclick="p4ConfirmExam()"><i class="fas fa-check"></i> Confirm Exam Booking</button>'
        : '<button class="p4-det-btn primary" onclick="p4LaunchEApp(\'' + p.id + '\');p4CloseExamForce()"><i class="fas fa-paper-plane"></i> Proceed to e-App</button>')
    + '</div>';
}

function p4BookSlot(rowEl, idx) {
  document.querySelectorAll('.p4-slot-row').forEach(function(r){ r.classList.remove('selected'); });
  rowEl.classList.add('selected');
}

function p4ConfirmExam() {
  p4CloseExamForce();
  _p4Toast('<i class="fas fa-calendar-check"></i> Paramedical exam booked — confirmation sent to prospect and ExamOne. Exam kit ships today.', 5000);
}

/* ================================================================
   ACCELERATED UW ELIGIBILITY OVERLAY
   ================================================================ */
function p4OpenAccelUW(pid) {
  if (pid) _p4ActiveProspect = pid;
  var overlay = document.getElementById('p4-auw-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  p4RenderAccelUW();
}

function p4CloseAccelUW(e) {
  if (e && e.target !== document.getElementById('p4-auw-overlay')) return;
  var overlay = document.getElementById('p4-auw-overlay');
  if (overlay) overlay.style.display = 'none';
}

function p4CloseAccelUWForce() {
  var overlay = document.getElementById('p4-auw-overlay');
  if (overlay) overlay.style.display = 'none';
}

function p4RenderAccelUW() {
  var body = document.getElementById('p4-auw-body');
  if (!body) return;
  var p = p4Prospects.filter(function(x){ return x.id === _p4ActiveProspect; })[0];
  if (!p) { body.innerHTML = '<div class="p4-empty">No prospect selected.</div>'; return; }

  var eligible  = p.stpProbability >= 70;
  var marginal  = !eligible && p.stpProbability >= 45;
  var stpColor  = p.stpProbability >= 70 ? '#059669' : p.stpProbability >= 45 ? '#d97706' : '#dc2626';
  var verdict   = eligible ? 'ELIGIBLE' : marginal ? 'MARGINAL' : 'NOT ELIGIBLE';
  var verdictClass = eligible ? 'auw-eligible' : marginal ? 'auw-marginal' : 'auw-ineligible';

  var factors = [
    { label: 'Age Threshold (< 45)',      pass: p.age < 45,             note: 'Age ' + p.age },
    { label: 'Face Amount (≤ $1M)',       pass: !p.finUWRequired,        note: p.coverage },
    { label: 'Health Score (≥ 75)',       pass: p.aiHealthScore >= 75,   note: p.aiHealthScore + '/100' },
    { label: 'MIB / Rx History — Clean', pass: p.conditions === 'None', note: p.conditions === 'None' ? 'No flags' : 'Conditions present' },
    { label: 'No APS Required',          pass: !p.apsLikely,            note: p.apsLikely ? 'APS likely' : 'No APS' },
    { label: 'STP Score (≥ 70)',         pass: p.stpProbability >= 70,   note: p.stpProbability + '%' },
    { label: 'No Financial UW Required', pass: !p.finUWRequired,        note: p.finUWRequired ? 'Required' : 'Not required' }
  ];

  body.innerHTML = '<div class="p4-auw-verdict-card ' + verdictClass + '">'
    +   '<div class="p4-auw-score-circle" style="border-color:' + stpColor + ';color:' + stpColor + '">' + p.stpProbability + '%</div>'
    +   '<div class="p4-auw-verdict-info">'
    +     '<div class="p4-auw-verdict-label">Accelerated UW: <strong>' + verdict + '</strong></div>'
    +     '<div class="p4-auw-prospect">' + p.name + ' · Age ' + p.age + ' · ' + p.coverage + '</div>'
    +     '<div class="p4-auw-verdict-note">'
    +       (eligible ? 'This applicant qualifies for no-exam straight-through processing. Expected decision within 2–4 hours of submission.'
    +        : marginal ? 'Marginal eligibility. A paramedical exam may be waived if MIB returns clean. Expect 3–5 business day decision.'
    +        : 'Full underwriting required. Exam + APS expected. Estimated 3–6 week decision timeline.')
    +     '</div>'
    +   '</div>'
    + '</div>'

    + '<div class="p4-auw-factors">'
    + '<div class="p4-section-label"><i class="fas fa-list-check"></i> Eligibility Factors</div>'
    + factors.map(function(f){
        return '<div class="p4-auw-factor ' + (f.pass ? 'pass' : 'fail') + '">'
          + '<i class="fas ' + (f.pass ? 'fa-check-circle' : 'fa-times-circle') + '"></i>'
          + '<span class="p4-auw-factor-lbl">' + f.label + '</span>'
          + '<span class="p4-auw-factor-note">' + f.note + '</span>'
          + '</div>';
      }).join('')
    + '</div>'

    + '<div class="p4-auw-timeline">'
    +   '<div class="p4-section-label"><i class="fas fa-clock"></i> Processing Timeline</div>'
    +   (eligible
        ? '<div class="p4-timeline-row"><span class="p4-tl-dot green"></span><span>e-App submitted → AI scoring → Decision: <strong>2–4 hours</strong></span></div>'
            + '<div class="p4-timeline-row"><span class="p4-tl-dot green"></span><span>No lab, no exam, no APS — straight-through</span></div>'
        : marginal
        ? '<div class="p4-timeline-row"><span class="p4-tl-dot amber"></span><span>e-App → Lab order → Results: <strong>3–5 business days</strong></span></div>'
            + '<div class="p4-timeline-row"><span class="p4-tl-dot amber"></span><span>UW review → Decision if labs clear</span></div>'
        : '<div class="p4-timeline-row"><span class="p4-tl-dot red"></span><span>e-App → Paramed exam → APS → UW review</span></div>'
            + '<div class="p4-timeline-row"><span class="p4-tl-dot red"></span><span>Estimated timeline: <strong>3–6 weeks</strong></span></div>')
    + '</div>'

    + '<div class="p4-auw-footer">'
    +   '<button class="p4-det-btn" onclick="p4CloseAccelUWForce()"><i class="fas fa-times"></i> Close</button>'
    +   '<button class="p4-det-btn primary" onclick="p4LaunchEApp(\'' + p.id + '\');p4CloseAccelUWForce()"><i class="fas fa-file-signature"></i> Open Smart e-App</button>'
    + '</div>';
}

/* ================================================================
   APS PREDICTOR OVERLAY
   ================================================================ */
function p4OpenAPSPredictor(pid) {
  if (pid) _p4ActiveProspect = pid;
  var overlay = document.getElementById('p4-aps-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  p4RenderAPSPredictor();
}

function p4CloseAPS(e) {
  if (e && e.target !== document.getElementById('p4-aps-overlay')) return;
  var overlay = document.getElementById('p4-aps-overlay');
  if (overlay) overlay.style.display = 'none';
}

function p4CloseAPSForce() {
  var overlay = document.getElementById('p4-aps-overlay');
  if (overlay) overlay.style.display = 'none';
}

function p4RenderAPSPredictor() {
  var body = document.getElementById('p4-aps-body');
  if (!body) return;
  var p = p4Prospects.filter(function(x){ return x.id === _p4ActiveProspect; })[0];
  if (!p) { body.innerHTML = '<div class="p4-empty">No prospect selected.</div>'; return; }

  /* Match conditions to APS triggers */
  var conds = p.conditions.toLowerCase();
  var matched = p4APSTriggers.filter(function(t){
    var key = t.condition.toLowerCase().split(' ')[0];
    return conds.indexOf(key) !== -1 || (key === 'none' && p.conditions === 'None');
  });
  if (!matched.length) matched = [p4APSTriggers[p4APSTriggers.length - 1]]; /* "None" entry */

  var overallProb = Math.max.apply(null, matched.map(function(t){ return t.prob; }));
  var probColor   = overallProb >= 70 ? '#dc2626' : overallProb >= 40 ? '#d97706' : '#059669';

  body.innerHTML = '<div class="p4-aps-prospect">'
    + '<div class="p4-avatar sm">' + p.initials + '</div>'
    + '<div><div class="p4-aps-pname">' + p.name + '</div><div class="p4-aps-psub">' + p.conditions + '</div></div>'
    + '<div class="p4-aps-prob-badge" style="background:' + probColor + '">' + overallProb + '% APS</div>'
    + '</div>'

    + '<div class="p4-aps-matches">'
    + '<div class="p4-section-label"><i class="fas fa-search"></i> Condition Analysis</div>'
    + matched.map(function(t){
        var col = t.prob >= 70 ? 'red' : t.prob >= 40 ? 'amber' : 'green';
        return '<div class="p4-aps-condition-card ' + col + '">'
          + '<div class="p4-aps-cond-top">'
          +   '<span class="p4-aps-cond-name">' + t.condition + '</span>'
          +   '<span class="p4-aps-cond-prob">' + t.prob + '% APS Probability</span>'
          + '</div>'
          + '<div class="p4-aps-cond-bar"><div class="p4-aps-cond-fill" style="width:' + t.prob + '%;background:' + (t.prob >= 70 ? '#dc2626' : t.prob >= 40 ? '#d97706' : '#059669') + '"></div></div>'
          + '<div class="p4-aps-cond-note"><i class="fas fa-info-circle"></i> ' + t.note + '</div>'
          + '</div>';
      }).join('')
    + '</div>'

    + '<div class="p4-aps-timeline-card">'
    +   '<div class="p4-section-label"><i class="fas fa-clock"></i> Expected APS Timeline</div>'
    +   (overallProb >= 70
        ? '<div class="p4-aps-tl-row"><span>APS ordered by UW</span><span>Day 1–3 after submission</span></div>'
            + '<div class="p4-aps-tl-row"><span>Physician office contacted</span><span>Day 3–7</span></div>'
            + '<div class="p4-aps-tl-row"><span>APS received</span><span>Day 14–30 (avg)</span></div>'
            + '<div class="p4-aps-tl-row"><span>UW decision</span><span>Day 35–45</span></div>'
            + '<div class="p4-aps-note warn"><i class="fas fa-lightbulb"></i> Tip: Pre-order APS now to reduce timeline by 10–14 days. Contact Dr. directly before submitting.</div>'
        : overallProb >= 40
        ? '<div class="p4-aps-tl-row"><span>APS possible if exam shows abnormal values</span><span>Day 5–10</span></div>'
            + '<div class="p4-aps-tl-row"><span>Conditional decision</span><span>Day 10–21</span></div>'
            + '<div class="p4-aps-note warn"><i class="fas fa-lightbulb"></i> Set prospect expectation: APS may add 2–3 weeks if triggered.</div>'
        : '<div class="p4-aps-tl-row"><span>No APS expected</span><span>—</span></div>'
            + '<div class="p4-aps-tl-row"><span>Straight-through decision</span><span>2–4 hours</span></div>'
            + '<div class="p4-aps-note ok"><i class="fas fa-check-circle"></i> Clean history — communicate fast turnaround to prospect as a selling point.</div>')
    + '</div>'

    + '<div class="p4-aps-footer">'
    +   '<button class="p4-det-btn" onclick="p4CloseAPSForce()"><i class="fas fa-times"></i> Close</button>'
    +   '<button class="p4-det-btn primary" onclick="p4LaunchEApp(\'' + p.id + '\');p4CloseAPSForce()"><i class="fas fa-file-signature"></i> Proceed to e-App</button>'
    + '</div>';
}

/* ================================================================
   FINANCIAL JUSTIFICATION BUILDER OVERLAY
   ================================================================ */
function p4OpenFinJust(pid) {
  if (pid) _p4ActiveProspect = pid;
  var overlay = document.getElementById('p4-finj-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  p4RenderFinJust();
}

function p4CloseFinJust(e) {
  if (e && e.target !== document.getElementById('p4-finj-overlay')) return;
  var overlay = document.getElementById('p4-finj-overlay');
  if (overlay) overlay.style.display = 'none';
}

function p4CloseFinJustForce() {
  var overlay = document.getElementById('p4-finj-overlay');
  if (overlay) overlay.style.display = 'none';
}

function p4RenderFinJust() {
  var body = document.getElementById('p4-finj-body');
  if (!body) return;
  var p = p4Prospects.filter(function(x){ return x.id === _p4ActiveProspect; })[0];
  if (!p) { body.innerHTML = '<div class="p4-empty">No prospect selected.</div>'; return; }

  /* Income multiple calc */
  var incomeNum  = Number(p.income.replace(/[^0-9]/g,''));
  var coverNum   = Number(p.coverage.replace(/[^0-9]/g,''));
  var multiple   = incomeNum > 0 ? Math.round(coverNum / incomeNum * 10) / 10 : 0;
  var hlokaLine  = incomeNum > 0 ? Math.min(incomeNum * 30, 10000000) : 0;
  var hlokaFmt   = '$' + (hlokaLine / 1000).toFixed(0) + 'K';
  var netWorthNum = Number(p.netWorth.replace(/[^0-9]/g,''));

  /* Narrative */
  var narrative = p.name + ' (Age ' + p.age + ', ' + p.riskClass + ') is requesting '
    + p.coverage + ' of ' + p.product + ' coverage.\n\n'
    + 'Financial Justification:\n'
    + '• Annual income: ' + p.income + ' — income multiple of ' + multiple + 'x (HLOKA limit: ' + hlokaFmt + ')\n'
    + '• Net worth: ' + p.netWorth + ' — coverage represents ' + Math.round(coverNum / netWorthNum * 100) + '% of net worth\n'
    + '• Estate preservation need: Policy proceeds intended to fund estate taxes and provide liquidity for ' + p.beneficiary + '\n'
    + '• Income replacement: ' + multiple + 'x income multiple is within NYL underwriting guidelines (max 30x)\n'
    + '• Business need: Personal protection only — no key-person or buy-sell component\n'
    + '• Existing coverage: No other in-force policies identified at this coverage level\n'
    + '• Financial statements: Available upon request. CPA letter confirming income on file.\n\n'
    + 'Agent Certification:\n'
    + 'I have personally reviewed the applicant\'s financial situation and confirm this coverage amount is reasonable and justifiable based on the client\'s income, net worth, and stated financial planning objectives.';

  var docs = [
    { name: '2024 Federal Tax Return (1040)',       status: p.finUWRequired ? 'required' : 'optional' },
    { name: '2023 Federal Tax Return (1040)',       status: p.finUWRequired ? 'required' : 'optional' },
    { name: 'W-2 / 1099 (most recent year)',        status: p.finUWRequired ? 'required' : 'optional' },
    { name: 'CPA Letter — Income Verification',     status: p.finUWRequired ? 'required' : 'optional' },
    { name: 'Investment / Brokerage Statements',    status: p.finUWRequired ? 'recommended' : 'optional' },
    { name: 'Business Financial Statements',        status: 'optional' },
    { name: 'Personal Financial Statement (PFS)',   status: p.finUWRequired ? 'recommended' : 'optional' }
  ];

  body.innerHTML = '<div class="p4-finj-kpi-row">'
    + _p4kpi('fa-dollar-sign',   p.income,    'Annual Income',    'green')
    + _p4kpi('fa-chart-line',    p.netWorth,  'Net Worth',        'blue')
    + _p4kpi('fa-shield-alt',    p.coverage,  'Coverage Amount',  'purple')
    + _p4kpi('fa-times-circle',  multiple + 'x', 'Income Multiple', multiple <= 25 ? 'teal' : 'amber')
    + '</div>'

    + '<div class="p4-finj-gauge-row">'
    +   '<div class="p4-finj-gauge-label">Coverage vs. HLOKA Limit (' + hlokaFmt + ')</div>'
    +   '<div class="p4-finj-gauge-track"><div class="p4-finj-gauge-fill" style="width:' + Math.min(100, Math.round(coverNum / hlokaLine * 100)) + '%;background:' + (coverNum <= hlokaLine ? '#059669' : '#dc2626') + '"></div></div>'
    +   '<div class="p4-finj-gauge-note">' + Math.min(100, Math.round(coverNum / hlokaLine * 100)) + '% of maximum allowable — ' + (coverNum <= hlokaLine ? 'Within limits' : 'Exceeds HLOKA') + '</div>'
    + '</div>'

    + '<div class="p4-finj-narrative-card">'
    +   '<div class="p4-section-label"><i class="fas fa-robot"></i> AI-Generated Financial Justification Narrative</div>'
    +   '<textarea class="p4-finj-textarea" id="p4-finj-text" rows="12">' + narrative + '</textarea>'
    +   '<div class="p4-finj-actions">'
    +     '<button class="p4-btn-sm" onclick="p4CopyFinJust()"><i class="fas fa-copy"></i> Copy</button>'
    +     '<button class="p4-btn-sm" onclick="p4RefineFinJust()"><i class="fas fa-magic"></i> AI Refine</button>'
    +   '</div>'
    + '</div>'

    + '<div class="p4-finj-docs-card">'
    +   '<div class="p4-section-label"><i class="fas fa-folder-open"></i> Required Documents Checklist</div>'
    +   docs.map(function(d){
          var tag = d.status === 'required' ? '<span class="p4-finj-req-tag">Required</span>'
            : d.status === 'recommended' ? '<span class="p4-finj-rec-tag">Recommended</span>'
            : '<span class="p4-finj-opt-tag">Optional</span>';
          return '<div class="p4-finj-doc-row"><i class="fas fa-file-alt"></i><span>' + d.name + '</span>' + tag + '</div>';
        }).join('')
    + '</div>'

    + '<div class="p4-finj-footer">'
    +   '<button class="p4-det-btn" onclick="p4CloseFinJustForce()"><i class="fas fa-times"></i> Close</button>'
    +   '<button class="p4-det-btn primary" onclick="p4SaveFinJust()"><i class="fas fa-save"></i> Save to Application</button>'
    + '</div>';
}

function p4CopyFinJust() {
  var ta = document.getElementById('p4-finj-text');
  if (ta) { ta.select(); document.execCommand('copy'); }
  _p4Toast('<i class="fas fa-copy"></i> Financial justification narrative copied to clipboard.', 3000);
}

function p4RefineFinJust() {
  var ta = document.getElementById('p4-finj-text');
  if (!ta) return;
  var p = p4Prospects.filter(function(x){ return x.id === _p4ActiveProspect; })[0];
  if (!p) return;
  ta.style.opacity = '0.5';
  setTimeout(function(){
    ta.value = ta.value
      + '\n\nAI Enhancement Note (added ' + new Date().toLocaleDateString() + '):\n'
      + 'Additional context: Based on ' + p.name + '\'s life stage (age ' + p.age + ') and stated retirement objective, '
      + 'the requested face amount aligns with the human-life-value (HLV) method: '
      + 'earnings capitalization at 5% discount rate produces a HLV of approximately '
      + '$' + (Math.round(Number(p.income.replace(/[^0-9]/g,'')) / 0.05 / 1000) * 1000).toLocaleString()
      + ', well above the requested coverage amount. Coverage need is fully justified.';
    ta.style.opacity = '1';
    _p4Toast('<i class="fas fa-magic"></i> AI narrative enhanced with HLV calculation.', 3000);
  }, 1200);
}

function p4SaveFinJust() {
  p4CloseFinJustForce();
  _p4Toast('<i class="fas fa-save"></i> Financial justification saved to application file.', 3000);
}

/* ================================================================
   SUBMIT APPLICATION
   ================================================================ */
function p4SubmitApplication(pid) {
  var p = p4Prospects.filter(function(x){ return x.id === pid; })[0];
  if (!p) return;

  /* Run quick GOC check first */
  var fails = p4GOCRules.filter(function(rule){
    if (rule.id === 'G09' && p.finUWRequired) return true;
    if (rule.id === 'G15' && p.finUWRequired) return true;
    return false;
  });

  if (fails.length > 0 && p.id === 'FNA-003') {
    _p4Toast('<i class="fas fa-exclamation-triangle"></i> Cannot submit — ' + fails.length + ' Good Order items incomplete. Run Good Order Check first.', 5000);
    return;
  }

  /* Assign case number */
  var caseNum = 'NYL-2026-0' + (5000 + Math.floor(Math.random() * 999));
  p.caseNumber = caseNum;
  p.status = 'Submitted — Awaiting Decision';

  /* Update case tracker */
  var existing = p4Cases.filter(function(c){ return c.prospectId === pid; })[0];
  if (existing) {
    existing.status = p.stpProbability >= 70 ? 'Approved — STP' : 'Pending UW Review';
    existing.submitted = new Date().toISOString().split('T')[0];
    existing.id = caseNum;
  }

  p4RenderCaseTracker();
  _p4Toast(
    '<i class="fas fa-paper-plane"></i> Application for <strong>' + p.name + '</strong> submitted to NYL Home Office. '
    + 'Case # <strong>' + caseNum + '</strong> assigned. '
    + (p.stpProbability >= 70
      ? 'STP eligible — expected decision within 2–4 hours.'
      : 'Full UW review — timeline 2–6 weeks.'),
    7000
  );
}

/* ================================================================
   CASE TRACKER
   ================================================================ */
function p4RenderCaseTracker() {
  var el = document.getElementById('p4-case-tracker');
  if (!el) return;

  var stageColors = {
    approved:   { bg: '#d1fae5', border: '#059669', icon: 'fa-check-circle', color: '#059669' },
    pending:    { bg: '#fef3c7', border: '#d97706', icon: 'fa-clock',        color: '#d97706' },
    incomplete: { bg: '#fee2e2', border: '#dc2626', icon: 'fa-exclamation-triangle', color: '#dc2626' }
  };

  el.innerHTML = p4Cases.map(function(c){
    var sc = stageColors[c.stage] || stageColors['pending'];
    var reqs = c.requirements.length
      ? '<div class="p4-case-reqs"><div class="p4-case-reqs-title"><i class="fas fa-list"></i> Requirements</div>'
          + c.requirements.map(function(r){ return '<div class="p4-case-req-item"><i class="fas fa-circle"></i> ' + r + '</div>'; }).join('')
          + '</div>'
      : '<div class="p4-case-req-none"><i class="fas fa-check"></i> No outstanding requirements</div>';

    return '<div class="p4-case-card" style="border-left:4px solid ' + sc.border + ';background:' + sc.bg + '">'
      + '<div class="p4-case-top">'
      +   '<div class="p4-case-id-block">'
      +     '<div class="p4-case-id">' + c.id + '</div>'
      +     '<div class="p4-case-name">' + c.name + '</div>'
      +     '<div class="p4-case-product">' + c.product + '</div>'
      +   '</div>'
      +   '<div class="p4-case-status-block">'
      +     '<div class="p4-case-status-badge" style="color:' + sc.color + '"><i class="fas ' + sc.icon + '"></i> ' + c.status + '</div>'
      +     (c.submitted ? '<div class="p4-case-submitted">Submitted: ' + c.submitted + '</div>' : '')
      +     (c.decisionDate ? '<div class="p4-case-decision">Decision: ' + c.decisionDate + '</div>' : '')
      +   '</div>'
      +   '<div class="p4-case-kpis">'
      +     '<div class="p4-case-kpi"><div class="p4-case-kpi-val">' + c.premium + '</div><div class="p4-case-kpi-lbl">Premium</div></div>'
      +     '<div class="p4-case-kpi"><div class="p4-case-kpi-val" style="color:#059669">' + c.commission + '</div><div class="p4-case-kpi-lbl">Commission</div></div>'
      +     '<div class="p4-case-kpi"><div class="p4-case-kpi-val">' + (c.caseManager || '—') + '</div><div class="p4-case-kpi-lbl">Case Mgr</div></div>'
      +   '</div>'
      + '</div>'
      + reqs
      + '</div>';
  }).join('');
}

/* ================================================================
   UTILITY
   ================================================================ */
function _p4Toast(html, duration) {
  var toast = document.createElement('div');
  toast.className = 'stage-toast p4-toast';
  toast.innerHTML = html;
  document.body.appendChild(toast);
  setTimeout(function(){ toast.remove(); }, duration || 3500);
}

console.log('Phase 4 — Application Submission Engine loaded');
console.log('  p4Prospects[' + p4Prospects.length + '] · p4GOCRules[' + p4GOCRules.length + '] · p4ExamVendors[' + p4ExamVendors.length + '] · p4Cases[' + p4Cases.length + ']');
console.log('  Functions: initSalesPage(override) · p4RenderSubmissionHub · p4SelectProspect');
console.log('  Overlays: GOC · ExamScheduler · AccelUW · APSPredictor · FinJustification');
