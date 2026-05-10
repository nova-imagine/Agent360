/* ═══════════════════════════════════════════════════════════════════
   PHASE 2 — DISCOVERY / FACT-FIND MODULE
   FNA Editor · AI Gap Calculator · Health Pre-screen · Suitability
   Meeting Summary · AI Pre-fill from Notes
   ═══════════════════════════════════════════════════════════════════ */

// ── STATE ──────────────────────────────────────────────────────────
var _fnaEditorId      = null;   // currently open FNA in editor
var _fnaEditorSection = 0;      // 0=personal 1=health 2=financial 3=needs
var _fnaEditorDirty   = false;
var _fnaAIPrefillOpen = false;

// ── RICH FNA DATA (extends existing fnaData stubs) ─────────────────
var fnaFullData = {

  'FNA-001': {
    id: 'FNA-001', client: 'Alex Rivera', initials: 'AR', avatarColor: '#003087',
    phase: 3, stage: 'Gap Analysis', pct: 60, status: 'gap',
    prospectId: 'P001',
    meetingDate: 'Apr 3, 2026', meetingType: 'In-Person', meetingLocation: 'NYL Midtown Office',

    // 2.3 Personal data
    personal: {
      dob: '1992-03-14', age: 34, gender: 'Male', smoker: false, tobaccoLastUsed: '',
      occupation: 'VP of Technology — Deloitte', hobbies: 'Rock climbing, cycling',
      riskClass: 'Standard Plus',
      existingCoverage: [
        { carrier: 'Employer Group', type: 'Term', faceAmount: 200000, premium: 0, notes: '2x salary employer group term — not portable' }
      ],
      beneficiaryIntent: 'Spouse (Maria Rivera) 100% primary; daughter (Sofia, age 2) contingent'
    },

    // 2.3 Health
    health: {
      heightFt: 5, heightIn: 11, weightLbs: 178,
      bpSystolic: 118, bpDiastolic: 76,
      majorDiagnoses: 'None',
      medications: 'None',
      surgeries: 'Appendectomy 2011 — no complications',
      familyHistory: 'Father — hypertension (treated). Mother — healthy.',
      tobaccoUse: false,
      alcoholUnitsPerWeek: 4,
      aiHealthFlag: null
    },

    // 2.4 Financial suitability
    financial: {
      annualIncome: 185000,
      spouseIncome: 72000,
      totalHouseholdIncome: 257000,
      monthlyExpenses: 9800,
      mortgage: 620000, mortgageMonthly: 3200, mortgageYearsLeft: 28,
      studentLoans: 0,
      otherDebts: 18000,
      savings401k: 148000,
      liquidSavings: 62000,
      investments: 95000,
      netWorth: 340000,
      monthlyBudgetForPremium: 750,
      shortTermGoals: 'Education fund for Sofia; pay off auto loan',
      longTermGoals: 'Retire at 58; leave estate to family; protect Maria if I die early'
    },

    // 2.2 FNA Needs sections
    needs: {
      incomeReplacement: {
        yearsToReplace: 20, multiplier: 12,
        computed: 185000 * 12, // $2.22M raw
        existingCoverage: 200000,
        gap: 2220000 - 200000
      },
      debtObligations: {
        mortgage: 620000, studentLoans: 0, otherDebts: 18000,
        total: 638000
      },
      finalExpense: {
        funeralCost: 15000, estateAdminCost: 12000, total: 27000
      },
      businessInsurance: { applicable: false, notes: '' },
      retirementIncomeGap: {
        targetRetirementIncome: 120000, socialSecurityEst: 28000,
        currentSavingsProjected: 410000, gap: 82000, applicable: true
      },
      ltcDisability: {
        ltcApplicable: true, ltcMonthlyBenefit: 5500,
        diApplicable: true, diMonthlyBenefit: 8500,
        currentDICoverage: 0, diGap: 8500
      }
    },

    // AI computed outputs
    ai: {
      totalCoverageNeeded: 780000,
      recommendedFaceAmount: 800000,
      recommendedProducts: ['Whole Life $500K', 'DI $8,500/mo'],
      annualPremiumEst: 4200,
      healthFlag: null,
      suitabilityCheck: { pass: true, notes: 'Product suitability confirmed. Income supports premium. No FINRA flag.' },
      gapSummary: 'Income replacement gap of $2.02M offset by employer group ($200K). Net need $780K. No DI coverage — critical gap for primary earner. LTC need deferred (age 34).',
      meetingSummaryGenerated: true
    },

    gaps: ['No disability income coverage ($8,500/mo gap)', 'Employer term not portable — gap if job changes', 'No LTC planning started'],
    aiRec: 'Whole Life $500K + DI $8,500/mo · strong candidate for PUAs · revisit LTC at age 40',
    notes: 'Alex very engaged. Spouse Maria attended virtually. Key driver: protecting Sofia. Budget confirmed $700–800/mo. Ready to see illustration.',
    healthNotes: 'Non-smoker. Excellent health. No medications. Rock climbing flagged — standard rating expected.'
  },

  'FNA-002': {
    id: 'FNA-002', client: 'Nancy Foster', initials: 'NF', avatarColor: '#7c3aed',
    phase: 2, stage: 'Fact-Find', pct: 40, status: 'progress',
    prospectId: 'P002',
    meetingDate: 'Apr 7, 2026', meetingType: 'Virtual (Zoom)', meetingLocation: '',

    personal: {
      dob: '1983-07-22', age: 41, gender: 'Female', smoker: false, tobaccoLastUsed: '',
      occupation: 'Healthcare Director — NYU Langone', hobbies: 'Yoga, gardening',
      riskClass: 'Standard (pending UW — BP)',
      existingCoverage: [
        { carrier: 'MetLife (Employer)', type: 'Term', faceAmount: 440000, premium: 0, notes: 'Employer group 2x salary — not portable' }
      ],
      beneficiaryIntent: 'Husband (David Foster) 50%, children (ages 11, 14) 50% split in trust'
    },

    health: {
      heightFt: 5, heightIn: 6, weightLbs: 142,
      bpSystolic: 138, bpDiastolic: 88,
      majorDiagnoses: 'Hypertension (diagnosed 2021)',
      medications: 'Lisinopril 10mg daily',
      surgeries: 'C-section 2012, 2015 — no complications',
      familyHistory: 'Father — MI at age 62. Mother — breast cancer (survivor).',
      tobaccoUse: false,
      alcoholUnitsPerWeek: 3,
      aiHealthFlag: { level: 'warn', message: 'Hypertension (BP 138/88) + family cardiac history → likely Standard or Table 2 rating. Set expectations before illustration. Request APS from PCP.' }
    },

    financial: {
      annualIncome: 220000, spouseIncome: 95000, totalHouseholdIncome: 315000,
      monthlyExpenses: 12400,
      mortgage: 1150000, mortgageMonthly: 5800, mortgageYearsLeft: 22,
      studentLoans: 42000, otherDebts: 0,
      savings401k: 380000, liquidSavings: 95000, investments: 145000,
      netWorth: 620000,
      monthlyBudgetForPremium: 900,
      shortTermGoals: 'Pay off student loans in 3 years; fund college 529s',
      longTermGoals: 'Retire at 60; protect mortgage; LTC planning for self and husband'
    },

    needs: {
      incomeReplacement: { yearsToReplace: 19, multiplier: 12, computed: 2640000, existingCoverage: 440000, gap: 2200000 },
      debtObligations: { mortgage: 1150000, studentLoans: 42000, otherDebts: 0, total: 1192000 },
      finalExpense: { funeralCost: 15000, estateAdminCost: 15000, total: 30000 },
      businessInsurance: { applicable: false, notes: '' },
      retirementIncomeGap: { targetRetirementIncome: 140000, socialSecurityEst: 32000, currentSavingsProjected: 890000, gap: 48000, applicable: true },
      ltcDisability: { ltcApplicable: true, ltcMonthlyBenefit: 7000, diApplicable: true, diMonthlyBenefit: 10000, currentDICoverage: 0, diGap: 10000 }
    },

    ai: {
      totalCoverageNeeded: 1000000, recommendedFaceAmount: 1000000,
      recommendedProducts: ['Term Life $1M 20-yr', 'LTC Hybrid Rider'],
      annualPremiumEst: 3600,
      healthFlag: { level: 'warn', message: 'Hypertension + family cardiac history → likely Standard or Table 2 rating. Set expectations before illustration. Request APS from PCP.' },
      suitabilityCheck: { pass: true, notes: 'Term Life suitable. LTC hybrid suitable at age 41. Income supports premium. No FINRA flag.' },
      gapSummary: 'Income gap $2.2M after employer group offset. Mortgage of $1.15M critical to cover. No LTC planning — significant risk at age 41 with family history. Student loans $42K should be covered.',
      meetingSummaryGenerated: false
    },

    gaps: ['No LTC coverage — family history elevates risk', 'Income gap $310K after employer group', 'Student loans $42K uncovered', 'No portable life if she leaves NYU'],
    aiRec: 'Term Life $1M 20-yr + LTC Hybrid · flag BP for UW rating · APS needed from PCP',
    notes: 'Nancy is detail-oriented — brought her own spreadsheet. Concerned about LTC costs. Husband David not yet engaged. Second meeting needed to complete financial section.',
    healthNotes: 'Mild hypertension on Lisinopril. BP 138/88 — above preferred threshold. Father MI at 62. Request APS.'
  },

  'FNA-003': {
    id: 'FNA-003', client: 'Patricia Nguyen', initials: 'PN', avatarColor: '#dc2626',
    phase: 4, stage: 'AI Recommendation', pct: 80, status: 'urgent',
    prospectId: 'P003',
    meetingDate: 'Apr 1, 2026', meetingType: 'In-Person', meetingLocation: 'Client Home — Hoboken NJ',

    personal: {
      dob: '1978-11-05', age: 48, gender: 'Female', smoker: false, tobaccoLastUsed: '',
      occupation: 'Senior Operations Manager — Johnson & Johnson', hobbies: 'Tennis, cooking',
      riskClass: 'Table 2 (T2DM)',
      existingCoverage: [
        { carrier: 'NYL (in-force)', type: 'Universal Life', faceAmount: 400000, premium: 6200, notes: 'UL underfunded — current lapse risk in 68 days at current premium' },
        { carrier: 'Employer', type: 'Term', faceAmount: 296000, premium: 0, notes: 'Group term — not portable' }
      ],
      beneficiaryIntent: 'Husband (Michael Nguyen) 100% primary'
    },

    health: {
      heightFt: 5, heightIn: 4, weightLbs: 158,
      bpSystolic: 128, bpDiastolic: 80,
      majorDiagnoses: 'Type 2 Diabetes Mellitus (diagnosed 2019)',
      medications: 'Metformin 1000mg BID; Atorvastatin 20mg',
      surgeries: 'Knee arthroscopy 2020 — resolved',
      familyHistory: 'Father — T2DM, MI at 69. Mother — healthy.',
      tobaccoUse: false, alcoholUnitsPerWeek: 2,
      aiHealthFlag: { level: 'error', message: 'T2DM (A1c 6.8) + age 48 → Table 2–3 UW rating likely. A1c trending — get latest labs. Statin use adds cardiovascular context. Current UL already at Table 2 rating. No new policy without current labs.' }
    },

    financial: {
      annualIncome: 148000, spouseIncome: 88000, totalHouseholdIncome: 236000,
      monthlyExpenses: 10200,
      mortgage: 485000, mortgageMonthly: 2800, mortgageYearsLeft: 18,
      studentLoans: 0, otherDebts: 22000,
      savings401k: 295000, liquidSavings: 48000, investments: 167000,
      netWorth: 510000,
      monthlyBudgetForPremium: 650,
      shortTermGoals: 'Stabilise UL policy; fund college for twins (age 17)',
      longTermGoals: 'Retire at 62; estate to Michael; ensure twins education funded'
    },

    needs: {
      incomeReplacement: { yearsToReplace: 14, multiplier: 10, computed: 1480000, existingCoverage: 696000, gap: 784000 },
      debtObligations: { mortgage: 485000, studentLoans: 0, otherDebts: 22000, total: 507000 },
      finalExpense: { funeralCost: 15000, estateAdminCost: 10000, total: 25000 },
      businessInsurance: { applicable: false, notes: '' },
      retirementIncomeGap: { targetRetirementIncome: 90000, socialSecurityEst: 26000, currentSavingsProjected: 620000, gap: 64000, applicable: true },
      ltcDisability: { ltcApplicable: true, ltcMonthlyBenefit: 5000, diApplicable: false, diMonthlyBenefit: 0, currentDICoverage: 0, diGap: 0 }
    },

    ai: {
      totalCoverageNeeded: 640000, recommendedFaceAmount: 650000,
      recommendedProducts: ['UL premium increase', 'WL conversion option'],
      annualPremiumEst: 6200,
      healthFlag: { level: 'error', message: 'T2DM (A1c 6.8) + age 48 → Table 2–3 rating. Current UL at Table 2. Get current A1c and fasting glucose before new illustration. Statin adds cardiovascular context.' },
      suitabilityCheck: { pass: true, notes: 'UL modification suitable. WL conversion requires new UW. Budget tight — $650/mo limit. Flag lapse risk urgently.' },
      gapSummary: '$240K income replacement gap. UL lapse risk in 68 days — URGENT. No LTC planning at age 48 with T2DM is a critical exposure. Mortgage $485K covered by existing policies combined.',
      meetingSummaryGenerated: true
    },

    gaps: ['$240K income replacement gap', 'UL lapse risk — 68 days at current premium', 'No LTC planning — T2DM elevates LTC risk significantly', 'College funding gap for twins'],
    aiRec: 'Increase UL premium $320/mo OR convert to WL + PUAs · urgent lapse intervention · LTC hybrid when budget allows',
    notes: 'Patricia very concerned about UL lapse. Husband Michael joined — both understand urgency. T2DM labs requested. Ready to act this week.',
    healthNotes: 'T2DM well-controlled (A1c 6.8). Metformin + statin. Table 2 rating on existing UL. Request current labs before new illustration.'
  }
};

// ── PMAIL QUESTIONS (5-step, for reference in PMAIL modal) ─────────
var _fnaEditorSections = ['personal', 'health', 'financial', 'needs'];
var _fnaEditorSectionLabels = [
  { label: 'Personal & Health Profile',  icon: 'fa-user',         sub: 'DOB · gender · smoker · occupation · hobbies · existing coverage · beneficiary' },
  { label: 'Health History',             icon: 'fa-heartbeat',    sub: 'Diagnoses · medications · surgeries · family history · risk flags' },
  { label: 'Financial Suitability',      icon: 'fa-dollar-sign',  sub: 'Income · debts · savings · budget · goals' },
  { label: 'Coverage Needs Analysis',    icon: 'fa-shield-alt',   sub: 'Income replacement · debts · final expense · retirement · LTC/DI' }
];

// ── OPEN FNA EDITOR (full fact-find modal) ─────────────────────────
function openFNAEditor(id) {
  var fna = fnaFullData[id] || fnaFullData['FNA-001'];
  _fnaEditorId = fna.id;
  _fnaEditorSection = 0;
  _fnaEditorDirty = false;

  var overlay = document.getElementById('fna-editor-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  renderFNAEditorSection();
  renderFNAEditorNav();
}

function closeFNAEditor(e) {
  if (e && e.target !== document.getElementById('fna-editor-overlay')) return;
  _closeFNAEditorForce();
}

function _closeFNAEditorForce() {
  var overlay = document.getElementById('fna-editor-overlay');
  if (overlay) overlay.style.display = 'none';
  _fnaEditorId = null;
}

function fnaEditorNav(idx) {
  _fnaEditorSection = idx;
  renderFNAEditorSection();
  renderFNAEditorNav();
}

function renderFNAEditorNav() {
  var fna = fnaFullData[_fnaEditorId];
  if (!fna) return;
  _fnaEditorSectionLabels.forEach(function(sec, i) {
    var btn = document.getElementById('fna-ed-nav-' + i);
    if (!btn) return;
    btn.classList.toggle('active', i === _fnaEditorSection);
  });
  // update header subtitle
  var sub = document.getElementById('fna-ed-section-sub');
  if (sub) sub.textContent = _fnaEditorSectionLabels[_fnaEditorSection].label + ' — ' + fna.client;
}

function renderFNAEditorSection() {
  var container = document.getElementById('fna-ed-body');
  if (!container) return;
  var fna = fnaFullData[_fnaEditorId];
  if (!fna) return;

  switch(_fnaEditorSection) {
    case 0: container.innerHTML = buildPersonalSection(fna); break;
    case 1: container.innerHTML = buildHealthSection(fna);   break;
    case 2: container.innerHTML = buildFinancialSection(fna);break;
    case 3: container.innerHTML = buildNeedsSection(fna);    break;
  }
}

// ── SECTION 0: PERSONAL ───────────────────────────────────────────
function buildPersonalSection(fna) {
  var p = fna.personal;
  var existingHtml = p.existingCoverage.map(function(c, i) {
    return '<div class="fna-ed-existing-row">' +
      '<div class="fna-ed-field" style="flex:1.2"><div class="fna-ed-label">Carrier</div><div class="fna-ed-val-display">' + c.carrier + '</div></div>' +
      '<div class="fna-ed-field"><div class="fna-ed-label">Type</div><div class="fna-ed-val-display">' + c.type + '</div></div>' +
      '<div class="fna-ed-field"><div class="fna-ed-label">Face Amount</div><div class="fna-ed-val-display">$' + c.faceAmount.toLocaleString() + '</div></div>' +
      '<div class="fna-ed-field" style="flex:2"><div class="fna-ed-label">Notes</div><div class="fna-ed-val-display fna-ed-note">' + c.notes + '</div></div>' +
    '</div>';
  }).join('');

  return '<div class="fna-ed-section">' +

    // Meeting info
    '<div class="fna-ed-card fna-ed-card-meeting">' +
      '<div class="fna-ed-card-title"><i class="fas fa-calendar-check"></i> Fact-Find Meeting</div>' +
      '<div class="fna-ed-row">' +
        fnaField('Meeting Date', fna.meetingDate, 'date') +
        fnaField('Meeting Type', fna.meetingType, 'text') +
        fnaField('Location / Link', fna.meetingLocation || 'Virtual — Zoom link on file', 'text') +
      '</div>' +
    '</div>' +

    // Basic personal
    '<div class="fna-ed-card">' +
      '<div class="fna-ed-card-title"><i class="fas fa-user"></i> Personal Information</div>' +
      '<div class="fna-ed-row">' +
        fnaField('Date of Birth', p.dob, 'date') +
        fnaField('Age', p.age, 'readonly') +
        fnaField('Gender', p.gender, 'text') +
        fnaFieldYN('Tobacco Use (ever)', p.smoker, 'smoker-toggle') +
      '</div>' +
      '<div class="fna-ed-row">' +
        fnaField('Occupation', p.occupation, 'text', 'flex:2') +
        fnaField('Hobbies / Activities', p.hobbies, 'text', 'flex:2') +
      '</div>' +
      '<div class="fna-ed-row">' +
        fnaField('AI Risk Classification', p.riskClass, 'readonly') +
      '</div>' +
    '</div>' +

    // Existing coverage
    '<div class="fna-ed-card">' +
      '<div class="fna-ed-card-title"><i class="fas fa-file-contract"></i> Existing Coverage (In-Force Policies)</div>' +
      existingHtml +
      '<button class="fna-ed-add-btn" onclick="showToast(\'Add coverage row — coming in next sprint\',\'info\')"><i class="fas fa-plus"></i> Add Coverage Row</button>' +
    '</div>' +

    // Beneficiary
    '<div class="fna-ed-card">' +
      '<div class="fna-ed-card-title"><i class="fas fa-heart"></i> Beneficiary Intentions</div>' +
      '<textarea class="fna-ed-textarea" rows="2">' + p.beneficiaryIntent + '</textarea>' +
    '</div>' +

    fnaNavFooter(0) +
  '</div>';
}

// ── SECTION 1: HEALTH ─────────────────────────────────────────────
function buildHealthSection(fna) {
  var h = fna.health;
  var bmi = (h.weightLbs / ((h.heightFt * 12 + h.heightIn) * (h.heightFt * 12 + h.heightIn))) * 703;
  var bmiDisplay = bmi.toFixed(1);
  var bmiClass = bmi < 18.5 ? 'fna-bmi-low' : bmi < 25 ? 'fna-bmi-ok' : bmi < 30 ? 'fna-bmi-warn' : 'fna-bmi-high';

  var flagHtml = '';
  if (h.aiHealthFlag) {
    var lvl = h.aiHealthFlag.level; // warn | error
    flagHtml = '<div class="fna-health-flag fna-health-flag-' + lvl + '">' +
      '<div class="fna-hf-icon"><i class="fas ' + (lvl==='error'?'fa-exclamation-circle':'fa-exclamation-triangle') + '"></i></div>' +
      '<div class="fna-hf-body">' +
        '<div class="fna-hf-title">AI Health Pre-screen Alert</div>' +
        '<div class="fna-hf-msg">' + h.aiHealthFlag.message + '</div>' +
      '</div>' +
    '</div>';
  } else {
    flagHtml = '<div class="fna-health-flag fna-health-flag-ok">' +
      '<div class="fna-hf-icon"><i class="fas fa-check-circle"></i></div>' +
      '<div class="fna-hf-body">' +
        '<div class="fna-hf-title">AI Health Pre-screen — No Issues Detected</div>' +
        '<div class="fna-hf-msg">Profile suggests Preferred Plus or Standard Plus rating. No underwriting concerns flagged at this time.</div>' +
      '</div>' +
    '</div>';
  }

  return '<div class="fna-ed-section">' +

    flagHtml +

    '<div class="fna-ed-card">' +
      '<div class="fna-ed-card-title"><i class="fas fa-weight"></i> Vitals</div>' +
      '<div class="fna-ed-row">' +
        fnaField('Height (ft)', h.heightFt, 'number') +
        fnaField('Height (in)', h.heightIn, 'number') +
        fnaField('Weight (lbs)', h.weightLbs, 'number') +
        '<div class="fna-ed-field">' +
          '<div class="fna-ed-label">BMI</div>' +
          '<div class="fna-ed-val-display ' + bmiClass + '">' + bmiDisplay + ' <span style="font-size:10px;font-weight:500">' + (bmi<18.5?'Underweight':bmi<25?'Normal':bmi<30?'Overweight':'Obese') + '</span></div>' +
        '</div>' +
        fnaField('BP (systolic)', h.bpSystolic, 'number') +
        fnaField('BP (diastolic)', h.bpDiastolic, 'number') +
      '</div>' +
    '</div>' +

    '<div class="fna-ed-card">' +
      '<div class="fna-ed-card-title"><i class="fas fa-notes-medical"></i> Medical History</div>' +
      '<div class="fna-ed-row">' +
        fnaField('Major Diagnoses', h.majorDiagnoses, 'text', 'flex:3') +
        fnaFieldYN('Tobacco Use', h.tobaccoUse, 'tobacco-yn') +
        fnaField('Alcohol Units/Week', h.alcoholUnitsPerWeek, 'number') +
      '</div>' +
      '<div class="fna-ed-row">' +
        fnaField('Current Medications', h.medications, 'text', 'flex:3') +
        fnaField('Surgeries / Procedures', h.surgeries, 'text', 'flex:3') +
      '</div>' +
      '<div class="fna-ed-row">' +
        fnaField('Family Health History', h.familyHistory, 'text', 'flex:4') +
      '</div>' +
    '</div>' +

    '<div class="fna-ed-card fna-ed-card-ai">' +
      '<div class="fna-ed-card-title"><i class="fas fa-robot"></i> AI Underwriting Pre-screen</div>' +
      '<div class="fna-uw-grid">' +
        fnaUWBadge('Smoking', h.tobaccoUse ? 'Smoker — surcharge' : 'Non-smoker', h.tobaccoUse ? 'warn' : 'ok') +
        fnaUWBadge('BMI', bmiDisplay + ' — ' + (bmi<25?'Normal':bmi<30?'Overweight':'Obese'), bmi<25?'ok':bmi<30?'warn':'error') +
        fnaUWBadge('Blood Pressure', h.bpSystolic + '/' + h.bpDiastolic, h.bpSystolic<130?'ok':h.bpSystolic<140?'warn':'error') +
        fnaUWBadge('Diagnoses', h.majorDiagnoses==='None'?'None detected':'Present — review', h.majorDiagnoses==='None'?'ok':'warn') +
        fnaUWBadge('Family History', h.familyHistory.toLowerCase().includes('mi')||h.familyHistory.toLowerCase().includes('cancer')?'Notable — cardiac/cancer':'Clear', h.familyHistory.toLowerCase().includes('mi')||h.familyHistory.toLowerCase().includes('cancer')?'warn':'ok') +
      '</div>' +
      '<button class="fna-ed-ai-btn" onclick="runHealthPrescreen(\'' + _fnaEditorId + '\')"><i class="fas fa-robot"></i> Re-run AI Health Pre-screen</button>' +
    '</div>' +

    fnaNavFooter(1) +
  '</div>';
}

// ── SECTION 2: FINANCIAL ──────────────────────────────────────────
function buildFinancialSection(fna) {
  var f = fna.financial;
  var dti = ((f.mortgageMonthly + (f.studentLoans ? f.studentLoans/120 : 0)) / (f.annualIncome/12) * 100).toFixed(0);

  return '<div class="fna-ed-section">' +

    '<div class="fna-ed-card">' +
      '<div class="fna-ed-card-title"><i class="fas fa-money-bill-wave"></i> Income</div>' +
      '<div class="fna-ed-row">' +
        fnaFieldDollar('Annual Income (Client)', f.annualIncome) +
        fnaFieldDollar('Annual Income (Spouse)', f.spouseIncome) +
        fnaFieldDollar('Total Household Income', f.totalHouseholdIncome) +
        fnaFieldDollar('Monthly Expenses', f.monthlyExpenses) +
      '</div>' +
    '</div>' +

    '<div class="fna-ed-card">' +
      '<div class="fna-ed-card-title"><i class="fas fa-hand-holding-usd"></i> Debts &amp; Obligations</div>' +
      '<div class="fna-ed-row">' +
        fnaFieldDollar('Mortgage Balance', f.mortgage) +
        fnaFieldDollar('Monthly Mortgage', f.mortgageMonthly) +
        fnaField('Mortgage Years Left', f.mortgageYearsLeft, 'number') +
        fnaFieldDollar('Student Loans', f.studentLoans) +
        fnaFieldDollar('Other Debts', f.otherDebts) +
      '</div>' +
      '<div class="fna-debt-summary">' +
        '<span class="fna-debt-tag"><i class="fas fa-percent"></i> DTI Ratio: <strong>' + dti + '%</strong></span>' +
        '<span class="fna-debt-tag ' + (parseInt(dti)>43?'warn':'ok') + '">' + (parseInt(dti)>43?'⚠ High DTI':'✓ DTI Acceptable') + '</span>' +
      '</div>' +
    '</div>' +

    '<div class="fna-ed-card">' +
      '<div class="fna-ed-card-title"><i class="fas fa-piggy-bank"></i> Assets &amp; Savings</div>' +
      '<div class="fna-ed-row">' +
        fnaFieldDollar('401K / Retirement', f.savings401k) +
        fnaFieldDollar('Liquid Savings', f.liquidSavings) +
        fnaFieldDollar('Investments', f.investments) +
        fnaFieldDollar('Net Worth', f.netWorth) +
      '</div>' +
    '</div>' +

    '<div class="fna-ed-card">' +
      '<div class="fna-ed-card-title"><i class="fas fa-calculator"></i> Premium Budget &amp; Goals</div>' +
      '<div class="fna-ed-row">' +
        fnaFieldDollar('Monthly Premium Budget', f.monthlyBudgetForPremium) +
      '</div>' +
      '<div class="fna-ed-row">' +
        '<div class="fna-ed-field" style="flex:2">' +
          '<div class="fna-ed-label">Short-Term Goals (1–5 yrs)</div>' +
          '<textarea class="fna-ed-textarea" rows="2">' + f.shortTermGoals + '</textarea>' +
        '</div>' +
        '<div class="fna-ed-field" style="flex:2">' +
          '<div class="fna-ed-label">Long-Term Goals (5+ yrs)</div>' +
          '<textarea class="fna-ed-textarea" rows="2">' + f.longTermGoals + '</textarea>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="fna-ed-card fna-ed-card-ai">' +
      '<div class="fna-ed-card-title"><i class="fas fa-robot"></i> AI Suitability Check</div>' +
      '<div class="fna-suitability-row">' +
        '<div class="fna-suit-badge ' + (fna.ai.suitabilityCheck.pass?'pass':'fail') + '">' +
          '<i class="fas ' + (fna.ai.suitabilityCheck.pass?'fa-check-circle':'fa-times-circle') + '"></i>' +
          (fna.ai.suitabilityCheck.pass ? 'Suitability Confirmed' : 'Suitability Issue') +
        '</div>' +
        '<div class="fna-suit-notes">' + fna.ai.suitabilityCheck.notes + '</div>' +
      '</div>' +
    '</div>' +

    fnaNavFooter(2) +
  '</div>';
}

// ── SECTION 3: NEEDS ANALYSIS ─────────────────────────────────────
function buildNeedsSection(fna) {
  var n = fna.needs;
  var f = fna.financial;
  var ai = fna.ai;

  // Compute total need
  var totalNeed = n.incomeReplacement.gap +
    n.debtObligations.total +
    n.finalExpense.total +
    (n.retirementIncomeGap.applicable ? n.retirementIncomeGap.gap * 20 : 0);

  var gapColor = totalNeed > 1000000 ? '#dc2626' : totalNeed > 500000 ? '#d97706' : '#059669';

  // Gap bar sections
  var totalDisplay = totalNeed + n.incomeReplacement.existingCoverage;
  var irPct  = Math.round(n.incomeReplacement.gap / totalDisplay * 100);
  var dbPct  = Math.round(n.debtObligations.total / totalDisplay * 100);
  var fePct  = Math.round(n.finalExpense.total / totalDisplay * 100);
  var retPct = Math.round((n.retirementIncomeGap.applicable ? n.retirementIncomeGap.gap*20 : 0) / totalDisplay * 100);
  var exPct  = Math.round(n.incomeReplacement.existingCoverage / totalDisplay * 100);

  return '<div class="fna-ed-section">' +

    // AI Gap Summary Banner
    '<div class="fna-gap-banner">' +
      '<div class="fna-gap-banner-left">' +
        '<div class="fna-gap-label">AI Coverage Gap Calculator</div>' +
        '<div class="fna-gap-need" style="color:' + gapColor + '">$' + totalNeed.toLocaleString() + '</div>' +
        '<div class="fna-gap-sub">Total coverage gap · Recommended face: <strong>$' + ai.recommendedFaceAmount.toLocaleString() + '</strong></div>' +
      '</div>' +
      '<div class="fna-gap-banner-right">' +
        '<div class="fna-gap-products">' +
          ai.recommendedProducts.map(function(p){ return '<span class="fna-gap-product-chip"><i class="fas fa-shield-alt"></i> ' + p + '</span>'; }).join('') +
        '</div>' +
        '<div class="fna-gap-est-premium">Est. Annual Premium: <strong>$' + ai.annualPremiumEst.toLocaleString() + '/yr</strong> · Budget: <strong>$' + (f.monthlyBudgetForPremium * 12).toLocaleString() + '/yr</strong></div>' +
      '</div>' +
    '</div>' +

    // Stacked gap bar
    '<div class="fna-gap-bar-wrap">' +
      '<div class="fna-gap-bar-label">Coverage Composition</div>' +
      '<div class="fna-gap-stack-bar">' +
        (exPct  > 0 ? '<div class="fna-gap-seg fna-seg-existing" style="width:' + exPct  + '%"><span>Existing</span></div>'   : '') +
        (irPct  > 0 ? '<div class="fna-gap-seg fna-seg-income"   style="width:' + irPct  + '%"><span>Income Gap</span></div>' : '') +
        (dbPct  > 0 ? '<div class="fna-gap-seg fna-seg-debt"     style="width:' + dbPct  + '%"><span>Debts</span></div>'      : '') +
        (fePct  > 0 ? '<div class="fna-gap-seg fna-seg-final"    style="width:' + fePct  + '%"><span>Final Exp.</span></div>' : '') +
        (retPct > 0 ? '<div class="fna-gap-seg fna-seg-retire"   style="width:' + retPct + '%"><span>Retirement</span></div>' : '') +
      '</div>' +
      '<div class="fna-gap-legend">' +
        '<span class="fna-leg-item fna-leg-existing">Existing Coverage</span>' +
        '<span class="fna-leg-item fna-leg-income">Income Replacement Gap</span>' +
        '<span class="fna-leg-item fna-leg-debt">Debt Obligations</span>' +
        '<span class="fna-leg-item fna-leg-final">Final Expense</span>' +
        '<span class="fna-leg-item fna-leg-retire">Retirement Gap</span>' +
      '</div>' +
    '</div>' +

    // Need breakdown cards
    '<div class="fna-needs-grid">' +

      // Income Replacement
      fnaNeedException(
        'fa-exchange-alt', 'Income Replacement',
        [
          { label: 'Annual Income', val: '$' + n.incomeReplacement.computed / n.incomeReplacement.multiplier / 12 * 12 / 1000 + 'K' },
          { label: 'Years to Replace', val: n.incomeReplacement.yearsToReplace + ' yrs' },
          { label: 'Total Need', val: '$' + n.incomeReplacement.computed.toLocaleString() },
          { label: 'Existing Coverage', val: '-$' + n.incomeReplacement.existingCoverage.toLocaleString() },
        ],
        n.incomeReplacement.gap, '#003087'
      ) +

      // Debt Obligations
      fnaNeedException(
        'fa-home', 'Debt Obligations',
        [
          { label: 'Mortgage', val: '$' + n.debtObligations.mortgage.toLocaleString() },
          { label: 'Student Loans', val: '$' + n.debtObligations.studentLoans.toLocaleString() },
          { label: 'Other Debts', val: '$' + n.debtObligations.otherDebts.toLocaleString() }
        ],
        n.debtObligations.total, '#7c3aed'
      ) +

      // Final Expense
      fnaNeedException(
        'fa-leaf', 'Final Expense / Estate',
        [
          { label: 'Funeral & Burial', val: '$' + n.finalExpense.funeralCost.toLocaleString() },
          { label: 'Estate Admin', val: '$' + n.finalExpense.estateAdminCost.toLocaleString() }
        ],
        n.finalExpense.total, '#059669'
      ) +

      // Retirement Gap (if applicable)
      (n.retirementIncomeGap.applicable ?
        fnaNeedException(
          'fa-umbrella-beach', 'Retirement Income Gap',
          [
            { label: 'Target Income/yr', val: '$' + n.retirementIncomeGap.targetRetirementIncome.toLocaleString() },
            { label: 'Social Security Est.', val: '$' + n.retirementIncomeGap.socialSecurityEst.toLocaleString() },
            { label: 'Savings Projected', val: '$' + n.retirementIncomeGap.currentSavingsProjected.toLocaleString() }
          ],
          n.retirementIncomeGap.gap * 20, '#d97706'
        ) : '') +

    '</div>' +

    // DI / LTC
    '<div class="fna-ed-card">' +
      '<div class="fna-ed-card-title"><i class="fas fa-wheelchair"></i> Disability &amp; LTC Needs</div>' +
      '<div class="fna-di-ltc-grid">' +
        '<div class="fna-di-box">' +
          '<div class="fna-di-label">Disability Income (DI)</div>' +
          (n.ltcDisability.diApplicable ?
            '<div class="fna-di-val">$' + n.ltcDisability.diMonthlyBenefit.toLocaleString() + '/mo needed</div>' +
            '<div class="fna-di-gap ' + (n.ltcDisability.diGap > 0 ? 'gap' : 'ok') + '">' +
              (n.ltcDisability.diGap > 0 ? '⚠ Gap: $' + n.ltcDisability.diGap.toLocaleString() + '/mo uncovered' : '✓ Covered') +
            '</div>'
            : '<div class="fna-di-na">Not applicable at this time</div>') +
        '</div>' +
        '<div class="fna-di-box">' +
          '<div class="fna-di-label">Long-Term Care (LTC)</div>' +
          (n.ltcDisability.ltcApplicable ?
            '<div class="fna-di-val">$' + n.ltcDisability.ltcMonthlyBenefit.toLocaleString() + '/mo benefit needed</div>' +
            '<div class="fna-di-gap gap">⚠ No LTC coverage in place</div>'
            : '<div class="fna-di-na">Not applicable at this time</div>') +
        '</div>' +
      '</div>' +
    '</div>' +

    // AI summary notes
    '<div class="fna-ed-card fna-ed-card-ai">' +
      '<div class="fna-ed-card-title"><i class="fas fa-robot"></i> AI Gap Summary</div>' +
      '<div class="fna-ai-gap-summary">' + fna.ai.gapSummary + '</div>' +
      '<div class="fna-gaps-list">' +
        fna.gaps.map(function(g){ return '<div class="fna-gap-item-row"><i class="fas fa-exclamation-triangle"></i><span>' + g + '</span></div>'; }).join('') +
      '</div>' +
    '</div>' +

    // Agent Notes
    '<div class="fna-ed-card">' +
      '<div class="fna-ed-card-title"><i class="fas fa-sticky-note"></i> Agent Meeting Notes</div>' +
      '<textarea class="fna-ed-textarea" rows="3" id="fna-agent-notes-' + fna.id + '">' + (fna.notes || '') + '</textarea>' +
    '</div>' +

    // Action footer
    fnaNavFooter(3, true) +

  '</div>';
}

// ── HELPER BUILDERS ───────────────────────────────────────────────
function fnaField(label, val, type, flex) {
  var st = flex ? 'style="' + flex + '"' : '';
  var ctrl = type === 'readonly'
    ? '<div class="fna-ed-val-display fna-ed-readonly">' + val + '</div>'
    : '<input type="' + (type==='date'?'text':type) + '" class="fna-ed-input" value="' + val + '" />';
  return '<div class="fna-ed-field" ' + st + '>' +
    '<div class="fna-ed-label">' + label + '</div>' + ctrl +
  '</div>';
}

function fnaFieldDollar(label, val) {
  return '<div class="fna-ed-field">' +
    '<div class="fna-ed-label">' + label + '</div>' +
    '<div class="fna-ed-val-display fna-ed-dollar">$' + val.toLocaleString() + '</div>' +
  '</div>';
}

function fnaFieldYN(label, val, id) {
  return '<div class="fna-ed-field">' +
    '<div class="fna-ed-label">' + label + '</div>' +
    '<div class="fna-ed-yn">' +
      '<button class="fna-yn-btn' + (!val?' fna-yn-active':'') + '" onclick="toggleFNAYN(\'' + id + '\',false)">No</button>' +
      '<button class="fna-yn-btn' + (val?' fna-yn-active':'') + '" onclick="toggleFNAYN(\'' + id + '\',true)">Yes</button>' +
    '</div>' +
  '</div>';
}

function fnaUWBadge(label, val, level) {
  var icon = level==='ok' ? 'fa-check-circle' : level==='warn' ? 'fa-exclamation-triangle' : 'fa-times-circle';
  return '<div class="fna-uw-badge fna-uw-' + level + '">' +
    '<i class="fas ' + icon + '"></i>' +
    '<div class="fna-uw-label">' + label + '</div>' +
    '<div class="fna-uw-val">' + val + '</div>' +
  '</div>';
}

function fnaNeedException(icon, title, rows, gap, color) {
  return '<div class="fna-need-card">' +
    '<div class="fna-need-header" style="background:' + color + '">' +
      '<i class="fas ' + icon + '"></i> ' + title +
    '</div>' +
    '<div class="fna-need-body">' +
      rows.map(function(r){ return '<div class="fna-need-row"><span class="fna-need-lbl">' + r.label + '</span><span class="fna-need-val">' + r.val + '</span></div>'; }).join('') +
      '<div class="fna-need-gap-row"><span>Coverage Gap</span><span class="fna-need-gap" style="color:' + color + '">$' + gap.toLocaleString() + '</span></div>' +
    '</div>' +
  '</div>';
}

function fnaNavFooter(idx, isFinal) {
  var prevHtml = idx > 0
    ? '<button class="fna-ed-nav-btn fna-ed-nav-prev" onclick="fnaEditorNav(' + (idx-1) + ')"><i class="fas fa-arrow-left"></i> ' + _fnaEditorSectionLabels[idx-1].label + '</button>'
    : '<div></div>';
  var nextHtml = isFinal
    ? '<div class="fna-ed-final-actions">' +
        '<button class="fna-ed-save-btn" onclick="saveFNAAndClose()"><i class="fas fa-save"></i> Save FNA</button>' +
        '<button class="fna-ed-summary-btn" onclick="generateMeetingSummary(\'' + _fnaEditorId + '\')"><i class="fas fa-envelope"></i> Generate Meeting Summary Email</button>' +
      '</div>'
    : '<button class="fna-ed-nav-btn fna-ed-nav-next" onclick="fnaEditorNav(' + (idx+1) + ')">' + _fnaEditorSectionLabels[idx+1].label + ' <i class="fas fa-arrow-right"></i></button>';
  return '<div class="fna-ed-nav-footer">' + prevHtml + nextHtml + '</div>';
}

// ── INTERACTION HANDLERS ──────────────────────────────────────────
function toggleFNAYN(id, val) {
  var btns = document.querySelectorAll('[onclick*="toggleFNAYN(\'' + id + '\'"]');
  btns.forEach(function(b) { b.classList.remove('fna-yn-active'); });
  event.target.classList.add('fna-yn-active');
}

function runHealthPrescreen(fnaId) {
  var fna = fnaFullData[fnaId];
  if (!fna) return;
  showFNAToast('AI Health Pre-screen running…', 'info');
  setTimeout(function() {
    var msg = fna.health.aiHealthFlag
      ? '⚠ Alert: ' + fna.health.aiHealthFlag.message
      : '✓ No underwriting concerns detected — profile suggests Standard Plus or better.';
    showFNAToast(msg, fna.health.aiHealthFlag ? 'warn' : 'success');
  }, 1200);
}

function saveFNAAndClose() {
  showFNAToast('FNA saved to CRM — all sections recorded', 'success');
  setTimeout(function() { _closeFNAEditorForce(); }, 900);
}

// ── AI PRE-FILL FROM NOTES ────────────────────────────────────────
function openFNAAIPrefill() {
  var panel = document.getElementById('fna-ai-prefill-panel');
  if (panel) {
    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
  }
}

function runAIPrefill() {
  var textarea = document.getElementById('fna-ai-notes-input');
  if (!textarea || !textarea.value.trim()) {
    showFNAToast('Please paste your meeting notes first', 'warn');
    return;
  }
  var btn = document.getElementById('fna-prefill-run-btn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Extracting…'; }

  setTimeout(function() {
    var resultsEl = document.getElementById('fna-prefill-results');
    if (resultsEl) {
      resultsEl.innerHTML =
        '<div class="fna-prefill-result-title"><i class="fas fa-robot"></i> AI Extracted Fields</div>' +
        fnaExtractedField('Client Name', 'Alex Rivera', true) +
        fnaExtractedField('Date of Birth', '1992-03-14', true) +
        fnaExtractedField('Annual Income', '$185,000', true) +
        fnaExtractedField('Smoker', 'No', true) +
        fnaExtractedField('Life Event', 'New baby — daughter Sofia, Dec 2025', true) +
        fnaExtractedField('Mortgage', '$620,000 — 28 years remaining', true) +
        fnaExtractedField('Monthly Budget', '$700–$800', true) +
        fnaExtractedField('Beneficiary', 'Spouse Maria Rivera — 100% primary', true) +
        fnaExtractedField('Medications', 'None mentioned', false) +
        fnaExtractedField('Existing Coverage', 'Employer group term 2x salary ($370K) — noted not portable', true) +
        '<button class="fna-prefill-apply-btn" onclick="applyAIPrefill()"><i class="fas fa-check-circle"></i> Apply All Extracted Fields</button>';
    }
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-robot"></i> Extract from Notes'; }
  }, 2000);
}

function fnaExtractedField(label, val, confident) {
  return '<div class="fna-prefill-field ' + (confident?'confident':'uncertain') + '">' +
    '<div class="fna-prefill-field-label">' + label + '</div>' +
    '<div class="fna-prefill-field-val">' + val + '</div>' +
    '<div class="fna-prefill-field-conf">' + (confident?'<i class="fas fa-check-circle" style="color:#059669"></i> High confidence':'<i class="fas fa-question-circle" style="color:#d97706"></i> Verify') + '</div>' +
  '</div>';
}

function applyAIPrefill() {
  showFNAToast('AI-extracted fields applied to active FNA — review each section', 'success');
  var panel = document.getElementById('fna-ai-prefill-panel');
  if (panel) panel.style.display = 'none';
  if (_fnaEditorId) { renderFNAEditorSection(); }
}

// ── MEETING SUMMARY GENERATOR ─────────────────────────────────────
function generateMeetingSummary(fnaId) {
  var fna = fnaFullData[fnaId];
  if (!fna) return;

  var overlay = document.getElementById('fna-summary-overlay');
  var body = document.getElementById('fna-summary-body');
  if (!overlay || !body) return;

  var today = 'Apr 10, 2026';
  var subject = 'Your Financial Needs Analysis Summary — ' + fna.client;
  var emailBody = buildSummaryEmail(fna, today);

  body.innerHTML =
    '<div class="fna-sum-meta">' +
      '<div class="fna-sum-meta-row"><span class="fna-sum-meta-lbl">To:</span><span class="fna-sum-meta-val">' + fna.client + ' &lt;client@email.com&gt;</span></div>' +
      '<div class="fna-sum-meta-row"><span class="fna-sum-meta-lbl">From:</span><span class="fna-sum-meta-val">Your NYL Agent &lt;agent@nyl.com&gt;</span></div>' +
      '<div class="fna-sum-meta-row"><span class="fna-sum-meta-lbl">Date:</span><span class="fna-sum-meta-val">' + today + '</span></div>' +
      '<div class="fna-sum-meta-row"><span class="fna-sum-meta-lbl">Subject:</span><span class="fna-sum-meta-val"><strong>' + subject + '</strong></span></div>' +
    '</div>' +
    '<div class="fna-sum-email-body">' + emailBody + '</div>' +
    '<div class="fna-sum-actions">' +
      '<button class="fna-sum-send-btn" onclick="sendMeetingSummary(\'' + fnaId + '\')"><i class="fas fa-paper-plane"></i> Send Email</button>' +
      '<button class="fna-sum-copy-btn" onclick="copyMeetingSummary()"><i class="fas fa-copy"></i> Copy to Clipboard</button>' +
      '<button class="fna-sum-cancel-btn" onclick="closeFNASummary()"><i class="fas fa-times"></i> Close</button>' +
    '</div>';

  overlay.style.display = 'flex';
}

function buildSummaryEmail(fna, today) {
  var f = fna.financial;
  var n = fna.needs;
  return '<p>Dear ' + fna.client.split(' ')[0] + ',</p>' +
    '<p>Thank you for taking the time to meet with me on <strong>' + fna.meetingDate + '</strong> (' + fna.meetingType + '). It was a pleasure getting to know your family\'s financial picture in depth. Below is a summary of what we discussed and the preliminary coverage analysis my team has prepared for you.</p>' +
    '<h4 style="color:#003087;margin:16px 0 6px">Your Financial Snapshot</h4>' +
    '<ul style="margin:0 0 12px;padding-left:18px;line-height:1.8">' +
      '<li>Annual household income: <strong>$' + f.totalHouseholdIncome.toLocaleString() + '</strong></li>' +
      '<li>Mortgage balance: <strong>$' + f.mortgage.toLocaleString() + '</strong> (' + f.mortgageYearsLeft + ' years remaining)</li>' +
      '<li>Existing life coverage: <strong>$' + n.incomeReplacement.existingCoverage.toLocaleString() + '</strong> (employer group — not portable)</li>' +
      '<li>Monthly premium budget confirmed: <strong>$' + f.monthlyBudgetForPremium.toLocaleString() + '/mo</strong></li>' +
    '</ul>' +
    '<h4 style="color:#003087;margin:16px 0 6px">Coverage Gaps We Identified</h4>' +
    '<ul style="margin:0 0 12px;padding-left:18px;line-height:1.8">' +
      fna.gaps.map(function(g){ return '<li>' + g + '</li>'; }).join('') +
    '</ul>' +
    '<h4 style="color:#003087;margin:16px 0 6px">Preliminary AI Recommendation</h4>' +
    '<p style="background:#f0f9ff;border-left:3px solid #003087;padding:10px 14px;border-radius:0 6px 6px 0">' + fna.aiRec + '</p>' +
    '<p>I will have a full product illustration prepared for our next meeting. Please review the above and feel free to reach out with any questions in the meantime.</p>' +
    '<p>Warm regards,<br><strong>Your NYL Agent</strong><br>New York Life Insurance Company</p>';
}

function sendMeetingSummary(fnaId) {
  showFNAToast('Meeting summary email sent to ' + (fnaFullData[fnaId]||{}).client + '!', 'success');
  closeFNASummary();
}

function copyMeetingSummary() {
  showFNAToast('Email content copied to clipboard', 'info');
}

function closeFNASummary() {
  var overlay = document.getElementById('fna-summary-overlay');
  if (overlay) overlay.style.display = 'none';
}

// ── OVERRIDE continueFNA → openFNAEditor ──────────────────────────
function continueFNA(id) {
  var fna = fnaFullData[id] || fnaFullData['FNA-001'];
  openFNAEditor(fna.id);
}

// ── OVERRIDE openFNAAIAssist → openFNAAIPrefill ───────────────────
function openFNAAIAssist() {
  openFNAAIPrefill();
}

// ── OVERRIDE renderFNADetail → richer version ─────────────────────
function renderFNADetail(fna) {
  var full = fnaFullData[fna.id];
  if (!full) {
    // fallback to original rendering for any FNA not in fnaFullData
    return _renderFNADetailLegacy(fna);
  }
  var ai = full.ai;
  var p  = full.personal;
  var h  = full.health;
  var f  = full.financial;
  var n  = full.needs;

  var statusCls = { urgent:'fna-status-pill urgent', gap:'fna-status-pill gap', progress:'fna-status-pill progress', done:'fna-status-pill done' };
  var phases = ['Prospect Discovery','Fact-Find','Gap Analysis','AI Recommendation','Run Illustration'];
  var phaseHtml = phases.map(function(ph, i) {
    var cls = (i+1) < full.phase ? 'fnd-phase-step done' : (i+1) === full.phase ? 'fnd-phase-step active' : 'fnd-phase-step';
    var icon = (i+1) < full.phase ? '<i class="fas fa-check-circle"></i>' : (i+1) === full.phase ? '<i class="fas fa-dot-circle"></i>' : '<i class="far fa-circle"></i>';
    return '<div class="' + cls + '">' + icon + '<span>' + ph + '</span></div>';
  }).join('<div class="fnd-phase-line"></div>');

  var healthFlagHtml = '';
  if (ai.healthFlag) {
    healthFlagHtml = '<div class="fnd-health-flag fnd-hf-' + ai.healthFlag.level + '">' +
      '<i class="fas ' + (ai.healthFlag.level==='error'?'fa-exclamation-circle':'fa-exclamation-triangle') + '"></i>' +
      '<span>' + ai.healthFlag.message + '</span>' +
    '</div>';
  }

  var gapsHtml = full.gaps.map(function(g) {
    return '<div class="fnd-gap-item"><i class="fas fa-exclamation-triangle"></i><span>' + g + '</span></div>';
  }).join('');

  var coverageRows = [
    { label:'Income Gap',     val:'$' + n.incomeReplacement.gap.toLocaleString() },
    { label:'Debt Total',     val:'$' + n.debtObligations.total.toLocaleString() },
    { label:'Final Expense',  val:'$' + n.finalExpense.total.toLocaleString() },
    { label:'Recommended Face Amount', val:'$' + ai.recommendedFaceAmount.toLocaleString(), highlight: true }
  ];

  return '<div class="fna-detail-content">' +

    '<div class="fnd-header">' +
      '<div class="fnd-avatar fna-av-' + full.initials.toLowerCase() + '" style="background:' + full.avatarColor + '">' + full.initials + '</div>' +
      '<div class="fnd-header-body">' +
        '<div class="fnd-name">' + full.client + '</div>' +
        '<div class="fnd-meta">' + p.occupation + ' · Age ' + full.personal.dob.split('-')[0] + ' · Phase ' + full.phase + ' of 5</div>' +
        '<div class="fnd-meeting"><i class="fas fa-calendar-check"></i> ' + full.meetingDate + ' · ' + full.meetingType + '</div>' +
      '</div>' +
      '<span class="' + (statusCls[full.status]||'fna-status-pill') + '">' + full.stage + '</span>' +
    '</div>' +

    '<div class="fnd-progress-row">' +
      '<div class="fna-prog-bar" style="flex:1"><div class="fna-prog-fill" style="width:' + full.pct + '%"></div></div>' +
      '<span class="fna-prog-lbl">' + full.pct + '% complete</span>' +
    '</div>' +

    '<div class="fnd-phase-track">' + phaseHtml + '</div>' +

    healthFlagHtml +

    '<div class="fnd-sections">' +

      '<div class="fnd-section">' +
        '<div class="fnd-section-title"><i class="fas fa-user"></i> Personal &amp; Health Snapshot</div>' +
        '<div class="fnd-grid">' +
          '<div class="fnd-field"><span class="fnd-lbl">Date of Birth</span><span class="fnd-val">' + p.dob + '</span></div>' +
          '<div class="fnd-field"><span class="fnd-lbl">Gender</span><span class="fnd-val">' + p.gender + '</span></div>' +
          '<div class="fnd-field"><span class="fnd-lbl">Smoker</span><span class="fnd-val">' + (p.smoker?'Yes':'No') + '</span></div>' +
          '<div class="fnd-field"><span class="fnd-lbl">Risk Class</span><span class="fnd-val">' + p.riskClass + '</span></div>' +
          '<div class="fnd-field fnd-wide"><span class="fnd-lbl">Health Notes</span><span class="fnd-val">' + full.healthNotes + '</span></div>' +
        '</div>' +
      '</div>' +

      '<div class="fnd-section">' +
        '<div class="fnd-section-title"><i class="fas fa-dollar-sign"></i> Financial Snapshot</div>' +
        '<div class="fnd-grid">' +
          '<div class="fnd-field"><span class="fnd-lbl">Annual Income</span><span class="fnd-val">$' + f.annualIncome.toLocaleString() + '</span></div>' +
          '<div class="fnd-field"><span class="fnd-lbl">Net Worth</span><span class="fnd-val">$' + f.netWorth.toLocaleString() + '</span></div>' +
          '<div class="fnd-field"><span class="fnd-lbl">Premium Budget</span><span class="fnd-val">$' + f.monthlyBudgetForPremium + '/mo</span></div>' +
          '<div class="fnd-field"><span class="fnd-lbl">Est. Annual Premium</span><span class="fnd-val fnd-val-hi">$' + ai.annualPremiumEst.toLocaleString() + '/yr</span></div>' +
          '<div class="fnd-field fnd-wide"><span class="fnd-lbl">Life Event</span><span class="fnd-val">' + (full.personal.existingCoverage.length > 0 ? 'Has existing coverage — see editor' : 'No existing coverage') + '</span></div>' +
        '</div>' +
      '</div>' +

      '<div class="fnd-section">' +
        '<div class="fnd-section-title"><i class="fas fa-calculator"></i> Coverage Gap Summary</div>' +
        '<div class="fnd-gap-rows">' +
          coverageRows.map(function(r) {
            return '<div class="fnd-gap-row' + (r.highlight?' fnd-gap-row-hi':'') + '">' +
              '<span class="fnd-gap-lbl">' + r.label + '</span>' +
              '<span class="fnd-gap-val">' + r.val + '</span>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>' +

      '<div class="fnd-section fnd-section-gaps">' +
        '<div class="fnd-section-title"><i class="fas fa-exclamation-triangle"></i> Coverage Gaps Detected</div>' +
        '<div class="fnd-gaps">' + gapsHtml + '</div>' +
      '</div>' +

      '<div class="fnd-section fnd-section-ai">' +
        '<div class="fnd-section-title"><i class="fas fa-robot"></i> AI Recommendation</div>' +
        '<div class="fnd-ai-rec">' + full.aiRec + '</div>' +
      '</div>' +

    '</div>' +

    '<div class="fnd-actions">' +
      '<button class="btn btn-primary" onclick="continueFNA(\'' + full.id + '\')"><i class="fas fa-edit"></i> Open Fact-Find Editor</button>' +
      '<button class="btn btn-outline" onclick="generateMeetingSummary(\'' + full.id + '\')"><i class="fas fa-envelope"></i> ' + (ai.meetingSummaryGenerated?'Re-send':'Generate') + ' Summary Email</button>' +
      '<button class="btn btn-outline" onclick="openFNAAIAssist()"><i class="fas fa-robot"></i> AI Pre-fill</button>' +
    '</div>' +

  '</div>';
}

// Legacy fallback for FNAs not in fnaFullData
function _renderFNADetailLegacy(fna) {
  var statusCls = { urgent:'fna-status-pill urgent', gap:'fna-status-pill gap', progress:'fna-status-pill progress', done:'fna-status-pill done' };
  var gapsHtml = fna.gaps.map(function(g) { return '<div class="fnd-gap-item"><i class="fas fa-exclamation-triangle"></i><span>' + g + '</span></div>'; }).join('');
  return '<div class="fna-detail-content">' +
    '<div class="fnd-header">' +
      '<div class="fnd-avatar fna-av-' + fna.initials.toLowerCase() + '">' + fna.initials + '</div>' +
      '<div class="fnd-header-body"><div class="fnd-name">' + fna.client + '</div><div class="fnd-meta">' + fna.occupation + ' · Age ' + fna.age + '</div></div>' +
      '<span class="' + (statusCls[fna.status]||'fna-status-pill') + '">' + fna.stage + '</span>' +
    '</div>' +
    '<div class="fnd-sections">' +
      '<div class="fnd-section fnd-section-gaps"><div class="fnd-section-title"><i class="fas fa-exclamation-triangle"></i> Gaps</div><div class="fnd-gaps">' + gapsHtml + '</div></div>' +
      '<div class="fnd-section fnd-section-ai"><div class="fnd-section-title"><i class="fas fa-robot"></i> AI Recommendation</div><div class="fnd-ai-rec">' + fna.aiRec + '</div></div>' +
    '</div>' +
    '<div class="fnd-actions"><button class="btn btn-outline" onclick="openFNAAIAssist()"><i class="fas fa-robot"></i> AI Pre-fill</button></div>' +
  '</div>';
}

// ── TOAST (FNA-scoped) ────────────────────────────────────────────
function showFNAToast(msg, type) {
  // try phase1 toast first, fall back to showToast
  if (typeof showToast === 'function') { showToast(msg, type); return; }
  var t = document.getElementById('phase1-toast') || document.getElementById('fna-toast');
  if (!t) return;
  t.className = 'phase1-toast';
  if (type === 'success') t.classList.add('phase1-toast-success');
  else if (type === 'info') t.classList.add('phase1-toast-info');
  else if (type === 'warn') t.classList.add('phase1-toast-warn');
  t.innerHTML = msg;
  t.classList.add('phase1-toast-show');
  setTimeout(function() { t.classList.remove('phase1-toast-show'); }, 3200);
}

// ── INIT ──────────────────────────────────────────────────────────
function initFNAPage() {
  // Auto-open first FNA detail
  var firstCard = document.querySelector('.fna-card[data-id]');
  if (firstCard) {
    var id = firstCard.getAttribute('data-id');
    openFNADetail(id);
  }
}

console.log('Phase 2 FNA module loaded — fnaFullData(FNA-001,002,003), openFNAEditor, buildNeedsSection, renderFNADetail(rich), generateMeetingSummary, runAIPrefill all ready');
