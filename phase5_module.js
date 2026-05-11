/* ================================================================
   PHASE 5 — Underwriting Decision Engine  (phase5_module.js)
   ================================================================ */

console.log('Phase 5 — Underwriting Decision Engine loaded');
console.log('  p5Cases[11] · p5RequirementsMap · p5RatingTable · p5DecisionOutcomes');
console.log('  Functions: initUnderwritingPage(override) · p5RenderCaseQueue · p5OpenCase');
console.log('  Overlays: RequirementsChecklist · MedicalUW · FinancialUW · Decision · FraudDetect · CaseStatus');

// ── DATA ──────────────────────────────────────────────────────

var p5Cases = [
  {
    id: 'UW-2026-0018', client: 'Alex Rivera', initials: 'AR', age: 34,
    product: 'Whole Life (Participating)', face: '$500,000', premium: '$4,800/yr',
    stage: 'Application Received', stpScore: 88, riskScore: 12, daysIn: 4,
    urgency: 'normal', riskClass: 'Preferred Plus',
    aiDecision: 'Approve as Applied', aiConfidence: 94,
    requirementsDone: 3, requirementsTotal: 7,
    evidence: {
      rx: 'done', mib: 'done', mvr: 'done', lab: 'pending',
      aps: 'na', financials: 'na', credit: 'pending'
    },
    medUW: {
      bmi: 22.4, bp: '118/74', cholesterol: 185, glucose: 92,
      conditions: [], medications: [],
      aiRating: 'Preferred Plus', aiRationale: 'Excellent vitals across all parameters. Age 34, no chronic conditions, clean Rx and MIB. BMI optimal range. High STP eligibility.',
      mortalityRisk: 'Very Low'
    },
    finUW: {
      income: '$95,000', incomeMult: 5.3, hlov: '$502,500',
      insurableInterest: 'Self', amlStatus: 'Clear', ofacStatus: 'Clear',
      fraudRisk: 'Low', fraudFlags: []
    },
    decision: null, decisionDate: null, counterOffer: null,
    agent: 'Sarah Johnson', underwriter: 'Dr. Patricia Wells',
    receivedDate: 'Apr 10, 2026', decisionDue: 'Apr 14, 2026',
    statusUpdates: [
      { date: 'Apr 10', msg: 'Application received and case opened. STP score 88 — auto-approve eligible.' },
      { date: 'Apr 11', msg: 'Rx and MIB checks returned clean. MVR clear.' },
      { date: 'Apr 12', msg: 'Lab order sent to ExamOne. Credit check initiated.' }
    ]
  },
  {
    id: 'UW-2026-0017', client: 'Nancy Foster', initials: 'NF', age: 41,
    product: 'IUL — Indexed Universal Life', face: '$750,000', premium: '$6,200/yr',
    stage: 'Evidence Gathering', stpScore: 71, riskScore: 31, daysIn: 8,
    urgency: 'normal', riskClass: 'Standard Plus',
    aiDecision: 'Likely Approve — Standard Plus', aiConfidence: 78,
    requirementsDone: 4, requirementsTotal: 7,
    evidence: {
      rx: 'done', mib: 'done', mvr: 'pending', lab: 'done',
      aps: 'pending', financials: 'na', credit: 'done'
    },
    medUW: {
      bmi: 26.1, bp: '128/82', cholesterol: 210, glucose: 98,
      conditions: ['Mild Hypertension (controlled)'], medications: ['Lisinopril 10mg'],
      aiRating: 'Standard Plus', aiRationale: 'Controlled hypertension on single-agent therapy. BP trending well. Cholesterol borderline elevated but no CV events. Age 41 female — favorable mortality profile.',
      mortalityRisk: 'Low-Moderate'
    },
    finUW: {
      income: '$112,000', incomeMult: 6.7, hlov: '$750,400',
      insurableInterest: 'Self', amlStatus: 'Clear', ofacStatus: 'Clear',
      fraudRisk: 'Low', fraudFlags: []
    },
    decision: null, decisionDate: null, counterOffer: null,
    agent: 'Sarah Johnson', underwriter: 'Dr. Patricia Wells',
    receivedDate: 'Apr 9, 2026', decisionDue: 'Apr 16, 2026',
    statusUpdates: [
      { date: 'Apr 9', msg: 'Application received. STP score 71 — review queue.' },
      { date: 'Apr 10', msg: 'Rx, MIB, lab results received — all within acceptable range.' },
      { date: 'Apr 11', msg: 'MVR ordered. APS request sent to Dr. Sarah Nguyen (HTN management).' },
      { date: 'Apr 13', msg: 'APS from Dr. Nguyen: HTN well-controlled × 2 years. No complications.' }
    ]
  },
  {
    id: 'UW-2026-0016', client: 'Patricia Nguyen', initials: 'PN', age: 48,
    product: 'GUL — Guaranteed Universal Life', face: '$1,500,000', premium: '$14,400/yr',
    stage: 'Evidence Gathering', stpScore: 38, riskScore: 64, daysIn: 11,
    urgency: 'urgent', riskClass: 'Table 2',
    aiDecision: 'Table 2 Rating Likely', aiConfidence: 71,
    requirementsDone: 4, requirementsTotal: 9,
    evidence: {
      rx: 'done', mib: 'flag', mvr: 'done', lab: 'flag',
      aps: 'pending', financials: 'pending', credit: 'done'
    },
    medUW: {
      bmi: 31.2, bp: '138/88', cholesterol: 238, glucose: 118,
      conditions: ['Type 2 Diabetes (diet-controlled)', 'Hypertension Stage 1', 'Borderline Dyslipidemia'],
      medications: ['Metformin 500mg', 'Lisinopril 20mg', 'Atorvastatin 10mg'],
      aiRating: 'Table 2', aiRationale: 'Multiple metabolic risk factors: T2DM controlled but HbA1c pending, HTN Stage 1, dyslipidemia. MIB flag for prior DI claim 2019. Financial UW required at $1.5M face. Mortality risk elevated but not severe at age 48.',
      mortalityRisk: 'Moderate'
    },
    finUW: {
      income: '$185,000', incomeMult: 8.1, hlov: '$1,480,000',
      insurableInterest: 'Self + Business Key Person', amlStatus: 'Pending', ofacStatus: 'Clear',
      fraudRisk: 'Low-Moderate', fraudFlags: ['Face amount near HLOVA limit — income documentation required', 'Business justification letter requested']
    },
    decision: null, decisionDate: null, counterOffer: null,
    agent: 'Sarah Johnson', underwriter: 'Dr. Marcus Reid',
    receivedDate: 'Apr 3, 2026', decisionDue: 'Apr 17, 2026',
    statusUpdates: [
      { date: 'Apr 3', msg: 'Application received. Face $1.5M triggers financial UW review.' },
      { date: 'Apr 5', msg: 'MIB returned flag — prior DI claim 2019. APS ordered.' },
      { date: 'Apr 8', msg: 'Lab results: glucose 118, HbA1c 6.4%. APS from endocrinologist pending.' },
      { date: 'Apr 11', msg: 'Financial docs request sent to applicant. HLOVA verification in progress.' },
      { date: 'Apr 13', msg: 'APS from Dr. Kim: T2DM diet-controlled, last A1c 6.4%, no complications.' }
    ]
  },
  {
    id: 'UW-2026-0015', client: 'Michael Santos', initials: 'MS', age: 47,
    product: 'Universal Life — $750K', face: '$750,000', premium: '$6,400/yr',
    stage: 'AI Review', stpScore: 79, riskScore: 22, daysIn: 15,
    urgency: 'normal', riskClass: 'Preferred',
    aiDecision: 'Approve — Preferred', aiConfidence: 86,
    requirementsDone: 6, requirementsTotal: 7,
    evidence: {
      rx: 'done', mib: 'done', mvr: 'done', lab: 'done',
      aps: 'na', financials: 'na', credit: 'done'
    },
    medUW: {
      bmi: 24.8, bp: '122/78', cholesterol: 192, glucose: 88,
      conditions: [], medications: ['Vitamin D supplement'],
      aiRating: 'Preferred', aiRationale: 'Strong vitals. BMI normal. No chronic conditions. Clean Rx except OTC supplement. MIB and MVR clear. Age 47 with no cardiac or metabolic risk factors.',
      mortalityRisk: 'Low'
    },
    finUW: {
      income: '$142,000', incomeMult: 5.3, hlov: '$751,000',
      insurableInterest: 'Self', amlStatus: 'Clear', ofacStatus: 'Clear',
      fraudRisk: 'Very Low', fraudFlags: []
    },
    decision: null, decisionDate: null, counterOffer: null,
    agent: 'Sarah Johnson', underwriter: 'Dr. Patricia Wells',
    receivedDate: 'Apr 5, 2026', decisionDue: 'Apr 19, 2026',
    statusUpdates: [
      { date: 'Apr 5', msg: 'Application received. Evidence collection initiated.' },
      { date: 'Apr 8', msg: 'All non-lab evidence received and clear.' },
      { date: 'Apr 10', msg: 'Lab results received — all within preferred band.' },
      { date: 'Apr 15', msg: 'AI scoring complete — STP 79. Queued for final UW review.' }
    ]
  },
  {
    id: 'UW-2026-0014', client: 'Julia Chen', initials: 'JC', age: 58,
    product: 'Annuity Deferred', face: 'N/A', premium: '$8,000/yr',
    stage: 'Evidence Gathering', stpScore: 44, riskScore: 58, daysIn: 17,
    urgency: 'stale', riskClass: 'Table 4',
    aiDecision: 'Table 4 — Pending APS', aiConfidence: 62,
    requirementsDone: 3, requirementsTotal: 8,
    evidence: {
      rx: 'done', mib: 'flag', mvr: 'na', lab: 'flag',
      aps: 'pending', financials: 'na', credit: 'done'
    },
    medUW: {
      bmi: 28.3, bp: '142/88', cholesterol: 244, glucose: 126,
      conditions: ['Type 2 Diabetes (Metformin)', 'Hypertension Stage 2', 'Dyslipidemia'],
      medications: ['Metformin 1000mg', 'Amlodipine 10mg', 'Lisinopril 40mg', 'Rosuvastatin 20mg'],
      aiRating: 'Table 4', aiRationale: 'T2DM on oral therapy with suboptimal glycemic control (glucose 126). HTN Stage 2 on multi-drug regimen. MIB flag indicates prior claim. Age 58 female — mortality risk elevated. APS needed to rule out complications.',
      mortalityRisk: 'Moderate-High'
    },
    finUW: {
      income: '$78,000', incomeMult: 'N/A (annuity)', hlov: 'N/A',
      insurableInterest: 'Self', amlStatus: 'Clear', ofacStatus: 'Clear',
      fraudRisk: 'Low', fraudFlags: []
    },
    decision: null, decisionDate: null, counterOffer: null,
    agent: 'Sarah Johnson', underwriter: 'Dr. Marcus Reid',
    receivedDate: 'Apr 3, 2026', decisionDue: 'Apr 10, 2026',
    statusUpdates: [
      { date: 'Apr 3', msg: 'Application received. MIB flag noted — APS ordered from Dr. Martinez.' },
      { date: 'Apr 5', msg: 'Lab results received — glucose 126, HbA1c 7.2% (suboptimal).' },
      { date: 'Apr 9', msg: 'APS follow-up sent to Dr. Martinez. 14-day wait — escalating.' },
      { date: 'Apr 13', msg: 'URGENT: APS overdue 14+ days. Second follow-up sent. Case flagged stale.' }
    ]
  },
  {
    id: 'UW-2026-0013', client: 'John Kim', initials: 'JK', age: 38,
    product: 'Disability Insurance', face: 'N/A', premium: '$2,100/yr',
    stage: 'Evidence Gathering', stpScore: 61, riskScore: 41, daysIn: 13,
    urgency: 'normal', riskClass: 'Standard',
    aiDecision: 'Standard — Flat Extra Possible', aiConfidence: 66,
    requirementsDone: 4, requirementsTotal: 7,
    evidence: {
      rx: 'done', mib: 'flag', mvr: 'done', lab: 'pending',
      aps: 'pending', financials: 'na', credit: 'pending'
    },
    medUW: {
      bmi: 27.4, bp: '132/84', cholesterol: 208, glucose: 102,
      conditions: ['Hypertension Stage 1', 'Prior DI Claim 2019 (back injury)'],
      medications: ['Metoprolol 50mg'],
      aiRating: 'Standard', aiRationale: 'HTN on single beta-blocker — adequately controlled. Prior DI claim for back injury 2019 — MIB flag triggered. Need APS to confirm full recovery and no current limitations. Flat Extra possible for back.',
      mortalityRisk: 'Moderate'
    },
    finUW: {
      income: '$88,000', incomeMult: 'DI — income replacement', hlov: 'N/A',
      insurableInterest: 'Self', amlStatus: 'Clear', ofacStatus: 'Clear',
      fraudRisk: 'Low', fraudFlags: ['Prior DI claim — verify full recovery documentation']
    },
    decision: null, decisionDate: null, counterOffer: null,
    agent: 'Sarah Johnson', underwriter: 'Dr. Patricia Wells',
    receivedDate: 'Apr 1, 2026', decisionDue: 'Apr 15, 2026',
    statusUpdates: [
      { date: 'Apr 1', msg: 'Application received. MIB flag — prior DI claim 2019.' },
      { date: 'Apr 3', msg: 'Rx and MVR received — clear (HTN on Metoprolol).' },
      { date: 'Apr 8', msg: 'APS ordered from treating orthopedic physician.' },
      { date: 'Apr 12', msg: 'Lab order sent. Credit check initiated.' }
    ]
  },
  {
    id: 'UW-2026-0012', client: 'Thomas Wright', initials: 'TW', age: 52,
    product: 'Whole Life — $1M', face: '$1,000,000', premium: '$9,600/yr',
    stage: 'Decision', stpScore: 91, riskScore: 9, daysIn: 22,
    urgency: 'decision', riskClass: 'Preferred Plus',
    aiDecision: 'Approve as Applied — Preferred Plus', aiConfidence: 97,
    requirementsDone: 7, requirementsTotal: 7,
    evidence: {
      rx: 'done', mib: 'done', mvr: 'done', lab: 'done',
      aps: 'na', financials: 'done', credit: 'done'
    },
    medUW: {
      bmi: 23.1, bp: '116/72', cholesterol: 178, glucose: 86,
      conditions: [], medications: [],
      aiRating: 'Preferred Plus', aiRationale: 'Exceptional health profile. All vitals in preferred-plus band. Clean MIB, clean MVR. No medications. Age 52 with no chronic conditions — statistically in top 10% mortality pool.',
      mortalityRisk: 'Very Low'
    },
    finUW: {
      income: '$310,000', incomeMult: 3.2, hlov: '$992,000',
      insurableInterest: 'Self + Estate Planning', amlStatus: 'Clear', ofacStatus: 'Clear',
      fraudRisk: 'Very Low', fraudFlags: []
    },
    decision: null, decisionDate: null, counterOffer: null,
    agent: 'Sarah Johnson', underwriter: 'Dr. Patricia Wells',
    receivedDate: 'Mar 28, 2026', decisionDue: 'Apr 14, 2026',
    statusUpdates: [
      { date: 'Mar 28', msg: 'Application received. $1M face triggers enhanced UW review.' },
      { date: 'Apr 1', msg: 'All evidence gathered — exceptional health profile.' },
      { date: 'Apr 5', msg: 'AI scoring: STP 91 — Preferred Plus recommended.' },
      { date: 'Apr 10', msg: 'Financial UW complete — income multiple 3.2x well within limits.' },
      { date: 'Apr 13', msg: 'All requirements satisfied. Ready for final decision.' }
    ]
  },
  {
    id: 'UW-2026-0011', client: 'Grace Lee', initials: 'GL', age: 44,
    product: 'VUL — $250K', face: '$250,000', premium: '$3,800/yr',
    stage: 'Decision', stpScore: 67, riskScore: 35, daysIn: 24,
    urgency: 'decision', riskClass: 'Standard Plus',
    aiDecision: 'Approve — Standard Plus', aiConfidence: 81,
    requirementsDone: 6, requirementsTotal: 7,
    evidence: {
      rx: 'done', mib: 'done', mvr: 'done', lab: 'flag',
      aps: 'done', financials: 'na', credit: 'done'
    },
    medUW: {
      bmi: 25.6, bp: '124/80', cholesterol: 218, glucose: 95,
      conditions: ['Mild Hyperlipidemia'], medications: ['Fish Oil supplement'],
      aiRating: 'Standard Plus', aiRationale: 'Mild hyperlipidemia — lab flag for elevated LDL (148). APS from internist confirms diet-managed, no statin started. BP normal. Age 44 female — good mortality trajectory.',
      mortalityRisk: 'Low-Moderate'
    },
    finUW: {
      income: '$96,000', incomeMult: 2.6, hlov: '$249,600',
      insurableInterest: 'Self', amlStatus: 'Clear', ofacStatus: 'Clear',
      fraudRisk: 'Very Low', fraudFlags: []
    },
    decision: null, decisionDate: null, counterOffer: null,
    agent: 'Sarah Johnson', underwriter: 'Dr. Marcus Reid',
    receivedDate: 'Mar 25, 2026', decisionDue: 'Apr 15, 2026',
    statusUpdates: [
      { date: 'Mar 25', msg: 'Application received.' },
      { date: 'Mar 29', msg: 'Lab flag: LDL 148. APS ordered from Dr. Patel.' },
      { date: 'Apr 4', msg: 'APS received — hyperlipidemia diet-managed, no medication.' },
      { date: 'Apr 10', msg: 'AI scoring: STP 67 — Standard Plus recommended.' },
      { date: 'Apr 13', msg: 'Final evidence review complete. Ready for decision.' }
    ]
  },
  {
    id: 'UW-2026-0009', client: 'Linda Morrison', initials: 'LM', age: 56,
    product: 'WL Rider Add-on', face: '$100,000', premium: '$1,200/yr',
    stage: 'Approved', stpScore: 99, riskScore: 1, daysIn: 27,
    urgency: 'normal', riskClass: 'Preferred Plus',
    aiDecision: 'Approved as Applied', aiConfidence: 99,
    requirementsDone: 7, requirementsTotal: 7,
    evidence: {
      rx: 'done', mib: 'done', mvr: 'done', lab: 'done',
      aps: 'na', financials: 'na', credit: 'done'
    },
    medUW: {
      bmi: 21.8, bp: '112/70', cholesterol: 172, glucose: 84,
      conditions: [], medications: [],
      aiRating: 'Preferred Plus', aiRationale: 'STP auto-approved. Pristine health record. Existing NY Life client with clean claims history.',
      mortalityRisk: 'Very Low'
    },
    finUW: {
      income: '$165,000', incomeMult: 0.6, hlov: '$99,000',
      insurableInterest: 'Self', amlStatus: 'Clear', ofacStatus: 'Clear',
      fraudRisk: 'Very Low', fraudFlags: []
    },
    decision: 'Approved as Applied', decisionDate: 'Apr 12, 2026', counterOffer: null,
    agent: 'Sarah Johnson', underwriter: 'AI Auto-Approve',
    receivedDate: 'Mar 18, 2026', decisionDue: 'Apr 1, 2026',
    statusUpdates: [
      { date: 'Mar 18', msg: 'Application received.' },
      { date: 'Mar 19', msg: 'AI STP score 99 — auto-approval triggered.' },
      { date: 'Mar 20', msg: 'Decision: Approved as Applied — Preferred Plus. Policy generation initiated.' }
    ]
  },
  {
    id: 'UW-2026-0005', client: 'Steve Palmer', initials: 'SP', age: 66,
    product: 'Whole Life — $1M', face: '$1,000,000', premium: 'N/A',
    stage: 'Declined', stpScore: 28, riskScore: 84, daysIn: 45,
    urgency: 'closed', riskClass: 'Declined',
    aiDecision: 'Decline', aiConfidence: 92,
    requirementsDone: 7, requirementsTotal: 7,
    evidence: {
      rx: 'flag', mib: 'flag', mvr: 'done', lab: 'flag',
      aps: 'done', financials: 'done', credit: 'done'
    },
    medUW: {
      bmi: 34.1, bp: '158/96', cholesterol: 268, glucose: 148,
      conditions: ['Type 2 Diabetes (insulin-dependent)', 'Hypertension Stage 2', 'CAD — stent placed 2022', 'Obesity Class I'],
      medications: ['Insulin Glargine', 'Metformin 2000mg', 'Amlodipine 10mg', 'Atorvastatin 40mg', 'Aspirin 81mg', 'Metoprolol 100mg'],
      aiRating: 'Decline', aiRationale: 'Insulin-dependent T2DM with poor glycemic control. CAD post-stent 2022. Hypertension Stage 2 multi-drug. BMI 34 (Obese Class I). Age 66 — mortality risk far exceeds insurable thresholds for $1M WL.',
      mortalityRisk: 'Very High'
    },
    finUW: {
      income: '$72,000', incomeMult: 13.9, hlov: '$1,000,800',
      insurableInterest: 'Self', amlStatus: 'Clear', ofacStatus: 'Clear',
      fraudRisk: 'Moderate', fraudFlags: ['Face amount 13.9× income — financial justification insufficient', 'Recent cardiac event + large face — application timing reviewed']
    },
    decision: 'Declined', decisionDate: 'Apr 8, 2026', counterOffer: null,
    agent: 'Sarah Johnson', underwriter: 'Dr. Marcus Reid',
    receivedDate: 'Mar 10, 2026', decisionDue: 'Apr 3, 2026',
    statusUpdates: [
      { date: 'Mar 10', msg: 'Application received. Multiple MIB flags.' },
      { date: 'Mar 20', msg: 'APS returned — CAD, stent 2022, insulin-dependent T2DM.' },
      { date: 'Apr 1', msg: 'AI scoring: Decline recommended. Multiple uninsurable risk factors.' },
      { date: 'Apr 8', msg: 'Decision: Declined. Decline letter sent per regulatory guidelines.' }
    ]
  },
  {
    id: 'UW-2026-0004', client: 'Carol Bennett', initials: 'CB', age: 51,
    product: 'Term Life — $500K', face: '$500,000', premium: '$3,360/yr',
    stage: 'Declined', stpScore: 55, riskScore: 47, daysIn: 38,
    urgency: 'closed', riskClass: 'Table 2',
    aiDecision: 'Table 2 — Approved with Modification', aiConfidence: 83,
    requirementsDone: 7, requirementsTotal: 7,
    evidence: {
      rx: 'done', mib: 'flag', mvr: 'done', lab: 'done',
      aps: 'done', financials: 'na', credit: 'done'
    },
    medUW: {
      bmi: 27.9, bp: '136/86', cholesterol: 228, glucose: 104,
      conditions: ['Hypertension Stage 1', 'Mild Dyslipidemia'],
      medications: ['Lisinopril 20mg', 'Atorvastatin 20mg'],
      aiRating: 'Table 2', aiRationale: 'HTN with imperfect BP control (136/86). Dyslipidemia on statin. MIB flag for prior hospitalization 2021. Table 2 (+20% premium) recommended — counter-offer issued.',
      mortalityRisk: 'Moderate'
    },
    finUW: {
      income: '$89,000', incomeMult: 5.6, hlov: '$498,400',
      insurableInterest: 'Self', amlStatus: 'Clear', ofacStatus: 'Clear',
      fraudRisk: 'Low', fraudFlags: []
    },
    decision: 'Approved with Modification — Table 2', decisionDate: 'Apr 5, 2026',
    counterOffer: { newPremium: '$3,360/yr', ratingClass: 'Table 2', flatExtra: null, reducedFace: null },
    agent: 'Sarah Johnson', underwriter: 'Dr. Marcus Reid',
    receivedDate: 'Mar 22, 2026', decisionDue: 'Apr 5, 2026',
    statusUpdates: [
      { date: 'Mar 22', msg: 'Application received.' },
      { date: 'Mar 28', msg: 'APS received — HTN, dyslipidemia. No cardiac events.' },
      { date: 'Apr 2', msg: 'AI rating: Table 2 recommended (+20% premium).' },
      { date: 'Apr 5', msg: 'Decision: Approved with modification — Table 2. Counter-offer sent to agent.' }
    ]
  }
];

// Requirements checklist template
var p5RequirementsDefs = [
  { key: 'rx',         label: 'Prescription Drug (Rx) Check',     icon: 'fa-pills',         vendor: 'MedPoint Rx Database',  turnaround: '24–48 hrs' },
  { key: 'mib',        label: 'MIB Check',                        icon: 'fa-database',      vendor: 'MIB Group',             turnaround: '24 hrs'   },
  { key: 'mvr',        label: 'Motor Vehicle Report (MVR)',        icon: 'fa-car',           vendor: 'DMV Direct',            turnaround: '24–72 hrs'},
  { key: 'lab',        label: 'Paramedical Labs (Blood/Urine)',    icon: 'fa-vial',          vendor: 'ExamOne / APPS',        turnaround: '3–5 days' },
  { key: 'aps',        label: 'Attending Physician Statement',     icon: 'fa-user-md',       vendor: 'Treating Physician',    turnaround: '7–21 days'},
  { key: 'financials', label: 'Financial Documents',               icon: 'fa-file-invoice-dollar', vendor: 'Applicant',       turnaround: '3–7 days' },
  { key: 'credit',     label: 'Credit Report',                     icon: 'fa-credit-card',   vendor: 'Experian / TransUnion', turnaround: '24 hrs'   }
];

// Rating class definitions
var p5RatingClasses = [
  { label: 'Preferred Plus', color: '#059669', bg: '#d1fae5', stpMin: 85, desc: 'Exceptional health. Best available rate.' },
  { label: 'Preferred',      color: '#0891b2', bg: '#cffafe', stpMin: 75, desc: 'Above-average health. Minor impairments allowed.' },
  { label: 'Standard Plus',  color: '#7c3aed', bg: '#ede9fe', stpMin: 65, desc: 'Average-plus health. Some controlled conditions.' },
  { label: 'Standard',       color: '#d97706', bg: '#fef3c7', stpMin: 55, desc: 'Average health. Controlled chronic conditions.' },
  { label: 'Table 2',        color: '#f59e0b', bg: '#fffbeb', stpMin: 40, desc: '+25% premium. Substandard risk — controlled impairments.' },
  { label: 'Table 4',        color: '#ef4444', bg: '#fef2f2', stpMin: 30, desc: '+50% premium. Significant health impairments.' },
  { label: 'Table 6',        color: '#dc2626', bg: '#fef2f2', stpMin: 20, desc: '+75% premium. Serious conditions, limited prognosis.' },
  { label: 'Table 8',        color: '#991b1b', bg: '#fef2f2', stpMin: 10, desc: '+100% premium. Severe impairments.' },
  { label: 'Flat Extra',     color: '#6d28d9', bg: '#f5f3ff', stpMin: 0,  desc: '$/1,000 surcharge for specific conditions (e.g., aviation, occupation).' },
  { label: 'Declined',       color: '#64748b', bg: '#f1f5f9', stpMin: 0,  desc: 'Uninsurable risk. Decline letter issued per regulations.' }
];

// Decision outcomes
var p5DecisionOutcomes = [
  { value: 'approve',    label: 'Approved as Applied',          icon: 'fa-check-circle',     color: '#059669' },
  { value: 'modify',     label: 'Approved with Modification',   icon: 'fa-star-half-alt',    color: '#f59e0b' },
  { value: 'counter',    label: 'Counter-Offer',                icon: 'fa-exchange-alt',     color: '#7c3aed' },
  { value: 'postpone',   label: 'Postponed',                    icon: 'fa-pause-circle',     color: '#0891b2' },
  { value: 'decline',    label: 'Declined',                     icon: 'fa-times-circle',     color: '#ef4444' }
];

// AML red flags
var p5AMLFlags = [
  'Large face amount inconsistent with stated income',
  'Multiple policy applications in short period',
  'Premium payments from third-party / unknown source',
  'Applicant on OFAC/SDN watchlist',
  'Structuring pattern detected across multiple policies',
  'Beneficiary is unrelated third party with financial motive'
];

var _p5ActiveCase = null;
var _p5ActiveOverlay = null;

// ── INIT OVERRIDE ────────────────────────────────────────────

function initUnderwritingPage() {
  p5RenderCaseQueue();
  p5UpdateKPIs();
}

// ── KPI UPDATE ───────────────────────────────────────────────

function p5UpdateKPIs() {
  var active = p5Cases.filter(function(c){ return c.stage !== 'Declined' && c.stage !== 'Issued'; });
  var approved = p5Cases.filter(function(c){ return c.decision === 'Approved as Applied'; });
  var pending = p5Cases.filter(function(c){ return c.decision === null && c.stage !== 'Declined'; });
  var stale = p5Cases.filter(function(c){ return c.urgency === 'stale'; });

  var kpiEl = document.getElementById('p5-kpi-strip');
  if (!kpiEl) return;
  kpiEl.innerHTML =
    '<div class="p5-kpi blue"><div class="p5-kpi-icon"><i class="fas fa-layer-group"></i></div>' +
    '<div class="p5-kpi-body"><div class="p5-kpi-val">' + active.length + '</div><div class="p5-kpi-lbl">Active Cases</div>' +
    '<div class="p5-kpi-sub">in pipeline</div></div></div>' +

    '<div class="p5-kpi green"><div class="p5-kpi-icon"><i class="fas fa-check-circle"></i></div>' +
    '<div class="p5-kpi-body"><div class="p5-kpi-val">' + approved.length + '</div><div class="p5-kpi-lbl">Decisions Made</div>' +
    '<div class="p5-kpi-sub">this cycle</div></div></div>' +

    '<div class="p5-kpi amber"><div class="p5-kpi-icon"><i class="fas fa-hourglass-half"></i></div>' +
    '<div class="p5-kpi-body"><div class="p5-kpi-val">' + pending.length + '</div><div class="p5-kpi-lbl">Pending Decision</div>' +
    '<div class="p5-kpi-sub">awaiting UW</div></div></div>' +

    '<div class="p5-kpi red"><div class="p5-kpi-icon"><i class="fas fa-exclamation-triangle"></i></div>' +
    '<div class="p5-kpi-body"><div class="p5-kpi-val">' + stale.length + '</div><div class="p5-kpi-lbl">Stale Cases</div>' +
    '<div class="p5-kpi-sub">need attention</div></div></div>';
}

// ── CASE QUEUE ───────────────────────────────────────────────

function p5RenderCaseQueue() {
  var el = document.getElementById('p5-case-queue');
  if (!el) return;

  var stages = ['Application Received', 'Evidence Gathering', 'AI Review', 'Decision', 'Approved', 'Declined'];
  var grouped = {};
  stages.forEach(function(s){ grouped[s] = []; });
  p5Cases.forEach(function(c){
    var s = c.stage;
    if (!grouped[s]) grouped[s] = [];
    grouped[s].push(c);
  });

  var stageIcons = {
    'Application Received': 'fa-inbox',
    'Evidence Gathering':   'fa-search-plus',
    'AI Review':            'fa-robot',
    'Decision':             'fa-gavel',
    'Approved':             'fa-check-circle',
    'Declined':             'fa-times-circle'
  };
  var stageColors = {
    'Application Received': 'received',
    'Evidence Gathering':   'evidence',
    'AI Review':            'ai-review',
    'Decision':             'decision',
    'Approved':             'approved',
    'Declined':             'declined'
  };

  el.innerHTML = stages.map(function(stage) {
    var cases = grouped[stage] || [];
    var cards = cases.map(function(c) {
      var stpCls = c.stpScore >= 80 ? 'p5-stp-high' : c.stpScore >= 60 ? 'p5-stp-med' : 'p5-stp-low';
      var urgBorder = c.urgency === 'urgent' ? ' p5-card-urgent' : c.urgency === 'stale' ? ' p5-card-stale' : c.urgency === 'decision' ? ' p5-card-decision' : '';
      var urgBadge = c.urgency === 'urgent' ? '<span class="p5-urg-badge urgent"><i class="fas fa-fire"></i> Urgent</span>' :
                     c.urgency === 'stale'  ? '<span class="p5-urg-badge stale"><i class="fas fa-clock"></i> Stale</span>' :
                     c.urgency === 'decision' ? '<span class="p5-urg-badge decision"><i class="fas fa-gavel"></i> Decide Today</span>' : '';
      var evKeys = ['rx','mib','mvr','lab','aps'];
      var evBar = evKeys.map(function(k){
        var st = c.evidence[k];
        if (st === 'na') return '';
        var cls = st === 'done' ? 'ev-done' : st === 'flag' ? 'ev-flag' : 'ev-pend';
        var ic  = st === 'done' ? 'fa-check' : st === 'flag' ? 'fa-exclamation' : 'fa-clock';
        return '<span class="p5-ev-pip ' + cls + '" title="' + k.toUpperCase() + '"><i class="fas ' + ic + '"></i>' + k.toUpperCase() + '</span>';
      }).join('');
      var prog = Math.round((c.requirementsDone / c.requirementsTotal) * 100);
      var aiCls = c.aiDecision.indexOf('Approve') >= 0 || c.aiDecision.indexOf('Preferred') >= 0 ? 'green' :
                  c.aiDecision.indexOf('Table') >= 0 || c.aiDecision.indexOf('Standard') >= 0 ? 'amber' : 'red';

      return '<div class="p5-case-card' + urgBorder + '" onclick="p5OpenCase(\'' + c.id + '\')">' +
        '<div class="p5-card-top">' +
          '<div class="p5-card-avatar">' + c.initials + '</div>' +
          '<div class="p5-card-info">' +
            '<div class="p5-card-name">' + c.client + '</div>' +
            '<div class="p5-card-prod">' + c.product + '</div>' +
          '</div>' +
          '<div class="p5-stp-badge ' + stpCls + '">STP ' + c.stpScore + '</div>' +
        '</div>' +
        (urgBadge ? '<div class="p5-card-urg-row">' + urgBadge + '</div>' : '') +
        '<div class="p5-card-face">' + c.face + ' · ' + (c.age) + ' yrs · ' + c.riskClass + '</div>' +
        '<div class="p5-ev-bar">' + evBar + '</div>' +
        '<div class="p5-card-prog-wrap">' +
          '<div class="p5-card-prog-track"><div class="p5-card-prog-fill" style="width:' + prog + '%"></div></div>' +
          '<span class="p5-card-prog-lbl">' + c.requirementsDone + '/' + c.requirementsTotal + ' reqs</span>' +
        '</div>' +
        '<div class="p5-card-ai-row">' +
          '<span class="p5-ai-rec ' + aiCls + '"><i class="fas fa-robot"></i> ' + c.aiDecision + '</span>' +
          '<span class="p5-card-days">' + c.daysIn + 'd</span>' +
        '</div>' +
        '<div class="p5-card-actions">' +
          '<button class="p5-card-btn primary" onclick="event.stopPropagation();p5OpenReqs(\'' + c.id + '\')"><i class="fas fa-list-check"></i> Reqs</button>' +
          (c.stage === 'Decision' || c.stage === 'AI Review' ?
            '<button class="p5-card-btn decide" onclick="event.stopPropagation();p5OpenDecision(\'' + c.id + '\')"><i class="fas fa-gavel"></i> Decide</button>' :
            '<button class="p5-card-btn ghost" onclick="event.stopPropagation();p5OpenMedUW(\'' + c.id + '\')"><i class="fas fa-heartbeat"></i> Med UW</button>') +
        '</div>' +
      '</div>';
    }).join('');

    var stageCount = cases.length;
    var premSum = cases.reduce(function(a, c){ return a + (parseFloat((c.premium || '').replace(/[^0-9.]/g,'')) || 0); }, 0);
    var premLabel = premSum > 0 ? '$' + (premSum/1000).toFixed(1) + 'K/yr' : '—';

    return '<div class="p5-stage-col" id="p5-stage-' + stageColors[stage] + '">' +
      '<div class="p5-stage-hdr ' + stageColors[stage] + '">' +
        '<div class="p5-stage-hdr-l"><i class="fas ' + stageIcons[stage] + '"></i> ' + stage + '</div>' +
        '<div class="p5-stage-hdr-r"><span class="p5-stage-cnt">' + stageCount + '</span><span class="p5-stage-prem">' + premLabel + '</span></div>' +
      '</div>' +
      '<div class="p5-stage-body">' + cards + '</div>' +
    '</div>';
  }).join('');
}

// ── OPEN CASE DETAIL ─────────────────────────────────────────

function p5OpenCase(caseId) {
  var c = p5Cases.find(function(x){ return x.id === caseId; });
  if (!c) return;
  _p5ActiveCase = caseId;
  p5OpenReqs(caseId);
}

// ── REQUIREMENTS OVERLAY ─────────────────────────────────────

function p5OpenReqs(caseId) {
  var c = p5Cases.find(function(x){ return x.id === caseId; });
  if (!c) return;
  _p5ActiveCase = caseId;
  _p5ActiveOverlay = 'reqs';
  var overlay = document.getElementById('p5-reqs-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  p5RenderReqs();
}

function p5CloseReqs(e) {
  if (e && e.target !== document.getElementById('p5-reqs-overlay')) return;
  p5CloseReqsForce();
}

function p5CloseReqsForce() {
  var overlay = document.getElementById('p5-reqs-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function p5RenderReqs() {
  var body = document.getElementById('p5-reqs-body');
  if (!body || !_p5ActiveCase) return;
  var c = p5Cases.find(function(x){ return x.id === _p5ActiveCase; });
  if (!c) return;

  var rows = p5RequirementsDefs.map(function(def) {
    var st = c.evidence[def.key] || 'na';
    if (st === 'na') {
      return '<div class="p5-req-row na">' +
        '<div class="p5-req-icon na"><i class="fas fa-minus-circle"></i></div>' +
        '<div class="p5-req-info">' +
          '<div class="p5-req-label">' + def.label + '</div>' +
          '<div class="p5-req-vendor">' + def.vendor + ' · ' + def.turnaround + '</div>' +
        '</div>' +
        '<div class="p5-req-status"><span class="p5-req-pill na">Not Required</span></div>' +
        '<div class="p5-req-actions"></div>' +
      '</div>';
    }
    var cls = st === 'done' ? 'done' : st === 'flag' ? 'flag' : 'pending';
    var icon = st === 'done' ? 'fa-check-circle' : st === 'flag' ? 'fa-exclamation-triangle' : 'fa-hourglass-half';
    var pillTxt = st === 'done' ? 'Received ✓' : st === 'flag' ? 'Flag ⚠' : 'Pending…';
    var actionBtn = st === 'pending' ?
      '<button class="p5-req-btn chase" onclick="p5ChaseRequirement(\'' + c.id + '\',\'' + def.key + '\')"><i class="fas fa-paper-plane"></i> Chase</button>' :
      (st === 'flag' ? '<button class="p5-req-btn review" onclick="p5ReviewFlag(\'' + c.id + '\',\'' + def.key + '\')"><i class="fas fa-search"></i> Review</button>' : '');
    return '<div class="p5-req-row ' + cls + '">' +
      '<div class="p5-req-icon ' + cls + '"><i class="fas ' + icon + '"></i></div>' +
      '<div class="p5-req-info">' +
        '<div class="p5-req-label">' + def.label + '</div>' +
        '<div class="p5-req-vendor"><i class="fas fa-building"></i> ' + def.vendor + ' · ETA: ' + def.turnaround + '</div>' +
      '</div>' +
      '<div class="p5-req-status"><span class="p5-req-pill ' + cls + '">' + pillTxt + '</span></div>' +
      '<div class="p5-req-actions">' + actionBtn + '</div>' +
    '</div>';
  }).join('');

  var done = p5RequirementsDefs.filter(function(d){ return c.evidence[d.key] === 'done'; }).length;
  var total = p5RequirementsDefs.filter(function(d){ return c.evidence[d.key] !== 'na'; }).length;
  var pct = total > 0 ? Math.round((done / total) * 100) : 0;
  var progColor = pct >= 80 ? '#059669' : pct >= 50 ? '#f59e0b' : '#ef4444';

  // AI gap detection banner
  var pendingReqs = p5RequirementsDefs.filter(function(d){ return c.evidence[d.key] === 'pending'; });
  var flagReqs    = p5RequirementsDefs.filter(function(d){ return c.evidence[d.key] === 'flag'; });
  var aiBanner = '';
  if (pendingReqs.length > 0 || flagReqs.length > 0) {
    var msgs = [];
    if (pendingReqs.length > 0) msgs.push(pendingReqs.length + ' requirement(s) still outstanding — auto-chase letters queued');
    if (flagReqs.length > 0) msgs.push(flagReqs.length + ' flag(s) require underwriter review before scoring');
    aiBanner = '<div class="p5-ai-gap-banner">' +
      '<i class="fas fa-robot"></i>' +
      '<div><strong>AI Gap Detection:</strong> ' + msgs.join(' · ') + '</div>' +
      '<button class="p5-req-btn chase" onclick="p5ChaseAllPending(\'' + c.id + '\')"><i class="fas fa-paper-plane"></i> Chase All</button>' +
    '</div>';
  } else {
    aiBanner = '<div class="p5-ai-gap-banner green">' +
      '<i class="fas fa-check-circle"></i>' +
      '<div><strong>AI Gap Detection:</strong> All requirements satisfied or not applicable — case ready for UW scoring.</div>' +
    '</div>';
  }

  body.innerHTML =
    '<div class="p5-reqs-case-hdr">' +
      '<div class="p5-reqs-avatar">' + c.initials + '</div>' +
      '<div>' +
        '<div class="p5-reqs-client">' + c.client + ' <span class="p5-reqs-id">' + c.id + '</span></div>' +
        '<div class="p5-reqs-prod">' + c.product + ' · ' + c.face + ' · ' + c.riskClass + '</div>' +
      '</div>' +
      '<div class="p5-reqs-prog-wrap">' +
        '<div class="p5-reqs-prog-label">' + done + '/' + total + ' Complete</div>' +
        '<div class="p5-reqs-prog-track"><div class="p5-reqs-prog-fill" style="width:' + pct + '%;background:' + progColor + '"></div></div>' +
        '<div class="p5-reqs-prog-pct">' + pct + '%</div>' +
      '</div>' +
    '</div>' +
    aiBanner +
    '<div class="p5-req-list">' + rows + '</div>' +
    '<div class="p5-reqs-footer">' +
      '<button class="p5-reqs-action-btn ghost" onclick="p5CloseReqsForce()"><i class="fas fa-times"></i> Close</button>' +
      '<button class="p5-reqs-action-btn secondary" onclick="p5CloseReqsForce();p5OpenMedUW(\'' + c.id + '\')"><i class="fas fa-heartbeat"></i> Medical UW</button>' +
      '<button class="p5-reqs-action-btn primary" onclick="p5CloseReqsForce();p5OpenDecision(\'' + c.id + '\')"><i class="fas fa-gavel"></i> Make Decision</button>' +
    '</div>';
}

function p5ChaseRequirement(caseId, reqKey) {
  _p5Toast('<i class="fas fa-paper-plane"></i> Follow-up letter sent for <strong>' + reqKey.toUpperCase() + '</strong> — case ' + caseId, 3000);
}

function p5ReviewFlag(caseId, reqKey) {
  _p5Toast('<i class="fas fa-search"></i> Flag review initiated for <strong>' + reqKey.toUpperCase() + '</strong> — ' + caseId, 3000);
}

function p5ChaseAllPending(caseId) {
  var c = p5Cases.find(function(x){ return x.id === caseId; });
  if (!c) return;
  var n = p5RequirementsDefs.filter(function(d){ return c.evidence[d.key] === 'pending'; }).length;
  _p5Toast('<i class="fas fa-paper-plane"></i> <strong>' + n + ' auto-chase letter(s) sent</strong> — AI drafted requirement requests queued', 3500);
}

// ── MEDICAL UNDERWRITING OVERLAY ─────────────────────────────

function p5OpenMedUW(caseId) {
  var c = p5Cases.find(function(x){ return x.id === caseId; });
  if (!c) return;
  _p5ActiveCase = caseId;
  var overlay = document.getElementById('p5-meduw-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  p5RenderMedUW();
}

function p5CloseMedUW(e) {
  if (e && e.target !== document.getElementById('p5-meduw-overlay')) return;
  p5CloseMedUWForce();
}

function p5CloseMedUWForce() {
  var overlay = document.getElementById('p5-meduw-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function p5RenderMedUW() {
  var body = document.getElementById('p5-meduw-body');
  if (!body || !_p5ActiveCase) return;
  var c = p5Cases.find(function(x){ return x.id === _p5ActiveCase; });
  if (!c) return;
  var m = c.medUW;

  var ratingDef = p5RatingClasses.find(function(r){ return r.label === m.aiRating; }) || p5RatingClasses[3];
  var mortalityColors = { 'Very Low': '#059669', 'Low': '#10b981', 'Low-Moderate': '#84cc16', 'Moderate': '#f59e0b', 'Moderate-High': '#f97316', 'High': '#ef4444', 'Very High': '#dc2626' };
  var mortColor = mortalityColors[m.mortalityRisk] || '#6b7280';

  // Vital signs grid
  var bpParts = (m.bp || '0/0').split('/');
  var bpSys = parseInt(bpParts[0]) || 0;
  var bpBadge = bpSys < 120 ? 'green' : bpSys < 130 ? 'cyan' : bpSys < 140 ? 'amber' : 'red';
  var bmiVal = m.bmi || 0;
  var bmiBadge = bmiVal < 18.5 ? 'amber' : bmiVal < 25 ? 'green' : bmiVal < 30 ? 'amber' : 'red';
  var cholVal = m.cholesterol || 0;
  var cholBadge = cholVal < 200 ? 'green' : cholVal < 240 ? 'amber' : 'red';
  var glucVal = m.glucose || 0;
  var glucBadge = glucVal < 100 ? 'green' : glucVal < 126 ? 'amber' : 'red';

  var condList = (m.conditions || []).length > 0 ?
    m.conditions.map(function(cd){ return '<div class="p5-condition-tag"><i class="fas fa-circle" style="font-size:6px;margin-right:6px;color:#f59e0b"></i>' + cd + '</div>'; }).join('') :
    '<div class="p5-condition-tag green"><i class="fas fa-check-circle" style="margin-right:6px;color:#059669"></i>No chronic conditions identified</div>';

  var medList = (m.medications || []).length > 0 ?
    m.medications.map(function(med){ return '<div class="p5-med-tag"><i class="fas fa-pills" style="margin-right:6px;color:#7c3aed;font-size:10px"></i>' + med + '</div>'; }).join('') :
    '<div class="p5-med-tag green"><i class="fas fa-check-circle" style="margin-right:6px;color:#059669"></i>No prescription medications</div>';

  // Rating table comparison
  var ratingRows = p5RatingClasses.map(function(r) {
    var isActive = r.label === m.aiRating;
    return '<div class="p5-rating-row' + (isActive ? ' active' : '') + '" style="' + (isActive ? 'border-left:3px solid ' + r.color + ';background:' + r.bg : '') + '">' +
      '<div class="p5-rating-label" style="color:' + r.color + '">' + r.label + '</div>' +
      '<div class="p5-rating-desc">' + r.desc + '</div>' +
      (isActive ? '<div class="p5-rating-ai-badge"><i class="fas fa-robot"></i> AI Rec</div>' : '') +
    '</div>';
  }).join('');

  body.innerHTML =
    '<div class="p5-meduw-grid">' +

    '<div class="p5-meduw-left">' +
      '<div class="p5-section-hdr"><i class="fas fa-stethoscope"></i> Vital Signs</div>' +
      '<div class="p5-vitals-grid">' +
        '<div class="p5-vital-card">' +
          '<div class="p5-vital-label">BMI</div>' +
          '<div class="p5-vital-val ' + bmiBadge + '">' + bmiVal + '</div>' +
          '<div class="p5-vital-range">Normal: 18.5–24.9</div>' +
        '</div>' +
        '<div class="p5-vital-card">' +
          '<div class="p5-vital-label">Blood Pressure</div>' +
          '<div class="p5-vital-val ' + bpBadge + '">' + m.bp + '</div>' +
          '<div class="p5-vital-range">Optimal: &lt;120/80</div>' +
        '</div>' +
        '<div class="p5-vital-card">' +
          '<div class="p5-vital-label">Cholesterol</div>' +
          '<div class="p5-vital-val ' + cholBadge + '">' + cholVal + ' mg/dL</div>' +
          '<div class="p5-vital-range">Desirable: &lt;200</div>' +
        '</div>' +
        '<div class="p5-vital-card">' +
          '<div class="p5-vital-label">Glucose</div>' +
          '<div class="p5-vital-val ' + glucBadge + '">' + glucVal + ' mg/dL</div>' +
          '<div class="p5-vital-range">Normal: 70–99</div>' +
        '</div>' +
      '</div>' +

      '<div class="p5-section-hdr" style="margin-top:20px"><i class="fas fa-notes-medical"></i> Conditions</div>' +
      '<div class="p5-conditions-list">' + condList + '</div>' +

      '<div class="p5-section-hdr" style="margin-top:16px"><i class="fas fa-pills"></i> Medications</div>' +
      '<div class="p5-meds-list">' + medList + '</div>' +

      '<div class="p5-section-hdr" style="margin-top:20px"><i class="fas fa-robot"></i> AI Risk Assessment</div>' +
      '<div class="p5-ai-assess-card">' +
        '<div class="p5-ai-assess-header">' +
          '<span class="p5-mortality-badge" style="background:' + mortColor + '20;color:' + mortColor + ';border:1px solid ' + mortColor + '40">Mortality: ' + m.mortalityRisk + '</span>' +
          '<span class="p5-rating-pill" style="background:' + ratingDef.bg + ';color:' + ratingDef.color + '">' + m.aiRating + '</span>' +
        '</div>' +
        '<div class="p5-ai-assess-text">' + m.aiRationale + '</div>' +
        '<div class="p5-ai-confidence"><i class="fas fa-tachometer-alt"></i> AI Confidence: <strong>' + c.aiConfidence + '%</strong></div>' +
      '</div>' +
    '</div>' +

    '<div class="p5-meduw-right">' +
      '<div class="p5-section-hdr"><i class="fas fa-layer-group"></i> Mortality Rating Table</div>' +
      '<div class="p5-rating-table">' + ratingRows + '</div>' +

      '<div class="p5-section-hdr" style="margin-top:20px"><i class="fas fa-tachometer-alt"></i> STP Eligibility</div>' +
      '<div class="p5-stp-gauge-wrap">' +
        '<div class="p5-stp-arc">' +
          '<svg viewBox="0 0 120 70" class="p5-stp-svg">' +
            '<path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="#e5e7eb" stroke-width="10" stroke-linecap="round"/>' +
            '<path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="' + (c.stpScore >= 80 ? '#059669' : c.stpScore >= 60 ? '#f59e0b' : '#ef4444') + '" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + (c.stpScore * 1.57) + ' 157" />' +
          '</svg>' +
          '<div class="p5-stp-arc-val">' + c.stpScore + '</div>' +
          '<div class="p5-stp-arc-lbl">STP Score</div>' +
        '</div>' +
        '<div class="p5-stp-legend">' +
          '<div class="p5-stp-leg"><span class="p5-stp-dot green"></span>≥ 80 · Auto-Approve</div>' +
          '<div class="p5-stp-leg"><span class="p5-stp-dot amber"></span>60–79 · Manual Review</div>' +
          '<div class="p5-stp-leg"><span class="p5-stp-dot red"></span>&lt; 60 · APS / Decline</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '</div>' +

    '<div class="p5-overlay-footer">' +
      '<button class="p5-ov-btn ghost" onclick="p5CloseMedUWForce()"><i class="fas fa-times"></i> Close</button>' +
      '<button class="p5-ov-btn secondary" onclick="p5CloseMedUWForce();p5OpenFinUW(\'' + c.id + '\')"><i class="fas fa-dollar-sign"></i> Financial UW</button>' +
      '<button class="p5-ov-btn primary" onclick="p5CloseMedUWForce();p5OpenDecision(\'' + c.id + '\')"><i class="fas fa-gavel"></i> Make Decision</button>' +
    '</div>';
}

// ── FINANCIAL UW OVERLAY ─────────────────────────────────────

function p5OpenFinUW(caseId) {
  var c = p5Cases.find(function(x){ return x.id === caseId; });
  if (!c) return;
  _p5ActiveCase = caseId;
  var overlay = document.getElementById('p5-finuw-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  p5RenderFinUW();
}

function p5CloseFinUW(e) {
  if (e && e.target !== document.getElementById('p5-finuw-overlay')) return;
  p5CloseFinUWForce();
}

function p5CloseFinUWForce() {
  var overlay = document.getElementById('p5-finuw-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function p5RenderFinUW() {
  var body = document.getElementById('p5-finuw-body');
  if (!body || !_p5ActiveCase) return;
  var c = p5Cases.find(function(x){ return x.id === _p5ActiveCase; });
  if (!c) return;
  var f = c.finUW;

  var amlCls  = f.amlStatus  === 'Clear' ? 'green' : 'red';
  var ofacCls = f.ofacStatus === 'Clear' ? 'green' : 'red';
  var fraudCls = f.fraudRisk === 'Very Low' || f.fraudRisk === 'Low' ? 'green' : f.fraudRisk === 'Low-Moderate' ? 'amber' : 'red';
  var fraudIcon = f.fraudRisk === 'Very Low' || f.fraudRisk === 'Low' ? 'fa-shield-alt' : 'fa-exclamation-triangle';

  var flagsHtml = (f.fraudFlags || []).length === 0 ?
    '<div class="p5-fraud-flag-row clean"><i class="fas fa-check-circle"></i> No fraud indicators detected</div>' :
    f.fraudFlags.map(function(fl){ return '<div class="p5-fraud-flag-row warn"><i class="fas fa-exclamation-triangle"></i> ' + fl + '</div>'; }).join('');

  var amlFlagRows = p5AMLFlags.slice(0, 4).map(function(fl, i) {
    var isActive = f.fraudFlags && f.fraudFlags.length > 0 && i < f.fraudFlags.length;
    return '<div class="p5-aml-check-row ' + (isActive ? 'flagged' : 'clear') + '">' +
      '<i class="fas ' + (isActive ? 'fa-times-circle' : 'fa-check-circle') + '"></i>' +
      '<span>' + fl + '</span>' +
    '</div>';
  }).join('');

  body.innerHTML =
    '<div class="p5-finuw-grid">' +

    '<div class="p5-finuw-left">' +
      '<div class="p5-section-hdr"><i class="fas fa-dollar-sign"></i> Financial Profile</div>' +
      '<div class="p5-fin-cards">' +
        '<div class="p5-fin-card">' +
          '<div class="p5-fin-card-lbl">Annual Income</div>' +
          '<div class="p5-fin-card-val">' + f.income + '</div>' +
        '</div>' +
        '<div class="p5-fin-card">' +
          '<div class="p5-fin-card-lbl">Income Multiple (face ÷ income)</div>' +
          '<div class="p5-fin-card-val ' + (parseFloat(f.incomeMult) > 10 ? 'red' : parseFloat(f.incomeMult) > 7 ? 'amber' : 'green') + '">' + f.incomeMult + '×</div>' +
        '</div>' +
        '<div class="p5-fin-card">' +
          '<div class="p5-fin-card-lbl">HLOVA (Human Life Value)</div>' +
          '<div class="p5-fin-card-val">' + f.hlov + '</div>' +
        '</div>' +
        '<div class="p5-fin-card">' +
          '<div class="p5-fin-card-lbl">Insurable Interest</div>' +
          '<div class="p5-fin-card-val">' + f.insurableInterest + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="p5-section-hdr" style="margin-top:20px"><i class="fas fa-shield-alt"></i> AML / OFAC Screening</div>' +
      '<div class="p5-compliance-row">' +
        '<div class="p5-compliance-item ' + amlCls + '">' +
          '<i class="fas ' + (f.amlStatus === 'Clear' ? 'fa-check-circle' : 'fa-times-circle') + '"></i>' +
          '<div><div class="p5-comp-label">AML Check</div><div class="p5-comp-val">' + f.amlStatus + '</div></div>' +
        '</div>' +
        '<div class="p5-compliance-item ' + ofacCls + '">' +
          '<i class="fas ' + (f.ofacStatus === 'Clear' ? 'fa-check-circle' : 'fa-times-circle') + '"></i>' +
          '<div><div class="p5-comp-label">OFAC / SDN</div><div class="p5-comp-val">' + f.ofacStatus + '</div></div>' +
        '</div>' +
      '</div>' +
      '<div class="p5-aml-checks">' + amlFlagRows + '</div>' +
    '</div>' +

    '<div class="p5-finuw-right">' +
      '<div class="p5-section-hdr"><i class="fas fa-search"></i> AI Fraud Detection</div>' +
      '<div class="p5-fraud-risk-card ' + fraudCls + '">' +
        '<div class="p5-fraud-risk-header">' +
          '<i class="fas ' + fraudIcon + '"></i>' +
          '<div>' +
            '<div class="p5-fraud-risk-label">Fraud Risk Score</div>' +
            '<div class="p5-fraud-risk-val">' + f.fraudRisk + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="p5-fraud-flags">' + flagsHtml + '</div>' +
      '</div>' +

      '<div class="p5-section-hdr" style="margin-top:20px"><i class="fas fa-balance-scale"></i> Insurable Interest Checklist</div>' +
      '<div class="p5-ii-checklist">' +
        '<div class="p5-ii-row green"><i class="fas fa-check-circle"></i> Insurable interest established: ' + f.insurableInterest + '</div>' +
        '<div class="p5-ii-row ' + (f.amlStatus === 'Clear' ? 'green' : 'red') + '"><i class="fas ' + (f.amlStatus === 'Clear' ? 'fa-check-circle' : 'fa-times-circle') + '"></i> Source of funds verified</div>' +
        '<div class="p5-ii-row ' + (f.ofacStatus === 'Clear' ? 'green' : 'red') + '"><i class="fas ' + (f.ofacStatus === 'Clear' ? 'fa-check-circle' : 'fa-times-circle') + '"></i> OFAC watchlist clear</div>' +
        '<div class="p5-ii-row ' + ((f.fraudFlags || []).length === 0 ? 'green' : 'amber') + '"><i class="fas ' + ((f.fraudFlags || []).length === 0 ? 'fa-check-circle' : 'fa-exclamation-triangle') + '"></i> No suspicious application patterns</div>' +
      '</div>' +

      '<div class="p5-finuw-ai-note">' +
        '<i class="fas fa-robot"></i>' +
        '<div>' +
          '<strong>AI Financial Analysis:</strong> Income multiple ' + f.incomeMult + '× — ' +
          (parseFloat(f.incomeMult) <= 7 ? 'within standard parameters (max 10×). No justification letter required.' :
           parseFloat(f.incomeMult) <= 10 ? 'elevated but acceptable — income documentation recommended.' :
           'exceeds 10× threshold — financial justification letter required.') +
        '</div>' +
      '</div>' +
    '</div>' +

    '</div>' +

    '<div class="p5-overlay-footer">' +
      '<button class="p5-ov-btn ghost" onclick="p5CloseFinUWForce()"><i class="fas fa-times"></i> Close</button>' +
      '<button class="p5-ov-btn secondary" onclick="p5CloseFinUWForce();p5OpenMedUW(\'' + c.id + '\')"><i class="fas fa-heartbeat"></i> Medical UW</button>' +
      '<button class="p5-ov-btn primary" onclick="p5CloseFinUWForce();p5OpenDecision(\'' + c.id + '\')"><i class="fas fa-gavel"></i> Make Decision</button>' +
    '</div>';
}

// ── DECISION OVERLAY ─────────────────────────────────────────

function p5OpenDecision(caseId) {
  var c = p5Cases.find(function(x){ return x.id === caseId; });
  if (!c) return;
  _p5ActiveCase = caseId;
  var overlay = document.getElementById('p5-decision-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  p5RenderDecision();
}

function p5CloseDecision(e) {
  if (e && e.target !== document.getElementById('p5-decision-overlay')) return;
  p5CloseDecisionForce();
}

function p5CloseDecisionForce() {
  var overlay = document.getElementById('p5-decision-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function p5RenderDecision() {
  var body = document.getElementById('p5-decision-body');
  if (!body || !_p5ActiveCase) return;
  var c = p5Cases.find(function(x){ return x.id === _p5ActiveCase; });
  if (!c) return;

  var ratingDef = p5RatingClasses.find(function(r){ return r.label === c.medUW.aiRating; }) || p5RatingClasses[3];
  var hasDecision = !!c.decision;

  var outcomeButtons = p5DecisionOutcomes.map(function(o) {
    var isSelected = hasDecision && c.decision && c.decision.toLowerCase().indexOf(o.value) >= 0;
    return '<button class="p5-outcome-btn' + (isSelected ? ' selected' : '') + '" style="' + (isSelected ? 'border-color:' + o.color + ';background:' + o.color + '15' : '') + '" onclick="p5SelectDecision(\'' + o.value + '\')">' +
      '<i class="fas ' + o.icon + '" style="color:' + o.color + '"></i>' +
      '<span>' + o.label + '</span>' +
    '</button>';
  }).join('');

  var decisionBanner = hasDecision ?
    '<div class="p5-existing-decision"><i class="fas fa-check-circle"></i> <strong>Decision already recorded:</strong> ' + c.decision + ' — ' + c.decisionDate + '</div>' : '';

  var counterSection = c.counterOffer ?
    '<div class="p5-counter-offer-card">' +
      '<div class="p5-co-title"><i class="fas fa-exchange-alt"></i> Counter-Offer Details</div>' +
      '<div class="p5-co-grid">' +
        '<div class="p5-co-item"><div class="p5-co-lbl">New Premium</div><div class="p5-co-val">' + c.counterOffer.newPremium + '</div></div>' +
        '<div class="p5-co-item"><div class="p5-co-lbl">Rating Class</div><div class="p5-co-val">' + c.counterOffer.ratingClass + '</div></div>' +
      '</div>' +
      '<button class="p5-ov-btn primary" style="margin-top:12px" onclick="p5CommunicateDecision(\'' + c.id + '\')"><i class="fas fa-paper-plane"></i> Communicate to Agent</button>' +
    '</div>' : '';

  body.innerHTML =
    decisionBanner +

    '<div class="p5-decision-grid">' +

    '<div class="p5-decision-left">' +
      '<div class="p5-section-hdr"><i class="fas fa-robot"></i> AI Recommendation</div>' +
      '<div class="p5-ai-decision-card" style="border-left:4px solid ' + ratingDef.color + '">' +
        '<div class="p5-ai-dec-header">' +
          '<span class="p5-ai-dec-rating" style="color:' + ratingDef.color + '">' + c.medUW.aiRating + '</span>' +
          '<span class="p5-ai-conf-badge"><i class="fas fa-tachometer-alt"></i> ' + c.aiConfidence + '% confidence</span>' +
        '</div>' +
        '<div class="p5-ai-dec-headline">' + c.aiDecision + '</div>' +
        '<div class="p5-ai-dec-rationale">' + c.medUW.aiRationale + '</div>' +
      '</div>' +

      '<div class="p5-section-hdr" style="margin-top:20px"><i class="fas fa-gavel"></i> Underwriter Decision</div>' +
      '<div class="p5-outcome-grid">' + outcomeButtons + '</div>' +

      '<div class="p5-decision-notes-wrap" id="p5-decision-notes-wrap" style="margin-top:16px;display:none">' +
        '<div class="p5-section-hdr"><i class="fas fa-edit"></i> Decision Notes</div>' +
        '<textarea class="p5-decision-notes" id="p5-decision-notes-ta" placeholder="Enter decision rationale, conditions, or modification details…"></textarea>' +
        '<div class="p5-decline-warning" id="p5-decline-warning" style="display:none">' +
          '<i class="fas fa-exclamation-triangle"></i>' +
          '<span>Decline letters must be vague per regulatory requirements. Do not specify exact medical reasons. AI will generate compliant decline language.</span>' +
        '</div>' +
      '</div>' +

      counterSection +

      '<div class="p5-decision-footer-btns" id="p5-decision-submit-row" style="margin-top:20px;display:' + (hasDecision ? 'none' : 'flex') + '">' +
        '<button class="p5-ov-btn ghost" onclick="p5CloseDecisionForce()"><i class="fas fa-times"></i> Cancel</button>' +
        '<button class="p5-ov-btn primary" onclick="p5SubmitDecision(\'' + c.id + '\')"><i class="fas fa-gavel"></i> Record Decision</button>' +
      '</div>' +
    '</div>' +

    '<div class="p5-decision-right">' +
      '<div class="p5-section-hdr"><i class="fas fa-list-check"></i> Decision Checklist</div>' +
      '<div class="p5-dec-checklist">' +
        p5RequirementsDefs.map(function(def) {
          var st = c.evidence[def.key];
          if (st === 'na') return '';
          var done = st === 'done';
          return '<div class="p5-dec-check-row ' + (done ? 'done' : 'missing') + '">' +
            '<i class="fas ' + (done ? 'fa-check-circle' : 'fa-times-circle') + '"></i>' +
            '<span>' + def.label + '</span>' +
          '</div>';
        }).join('') +
      '</div>' +

      '<div class="p5-section-hdr" style="margin-top:20px"><i class="fas fa-history"></i> Status Timeline</div>' +
      '<div class="p5-status-timeline">' +
        c.statusUpdates.map(function(upd, i) {
          var isLast = i === c.statusUpdates.length - 1;
          return '<div class="p5-timeline-row' + (isLast ? ' latest' : '') + '">' +
            '<div class="p5-timeline-dot' + (isLast ? ' latest' : '') + '"></div>' +
            '<div class="p5-timeline-content">' +
              '<div class="p5-timeline-date">' + upd.date + '</div>' +
              '<div class="p5-timeline-msg">' + upd.msg + '</div>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +

      '<div class="p5-section-hdr" style="margin-top:20px"><i class="fas fa-paper-plane"></i> Agent Communication</div>' +
      '<div class="p5-agent-comm-card">' +
        '<div class="p5-agent-comm-row"><i class="fas fa-user-tie"></i> Agent: <strong>' + c.agent + '</strong></div>' +
        '<div class="p5-agent-comm-row"><i class="fas fa-user-md"></i> Underwriter: <strong>' + c.underwriter + '</strong></div>' +
        '<button class="p5-ov-btn secondary" style="margin-top:10px;width:100%" onclick="p5SendStatusUpdate(\'' + c.id + '\')"><i class="fas fa-paper-plane"></i> Send Status Update to Agent</button>' +
      '</div>' +
    '</div>' +

    '</div>';
}

var _p5SelectedDecision = null;

function p5SelectDecision(outcomeVal) {
  _p5SelectedDecision = outcomeVal;
  document.querySelectorAll('.p5-outcome-btn').forEach(function(b){ b.classList.remove('selected'); b.style.borderColor = ''; b.style.background = ''; });
  var def = p5DecisionOutcomes.find(function(o){ return o.value === outcomeVal; });
  if (def) {
    var btns = document.querySelectorAll('.p5-outcome-btn');
    btns.forEach(function(b){ if (b.textContent.trim().indexOf(def.label.trim().substring(0,8)) >= 0) { b.classList.add('selected'); b.style.borderColor = def.color; b.style.background = def.color + '15'; } });
  }
  var notesWrap = document.getElementById('p5-decision-notes-wrap');
  if (notesWrap) notesWrap.style.display = 'block';
  var declineWarn = document.getElementById('p5-decline-warning');
  if (declineWarn) declineWarn.style.display = outcomeVal === 'decline' ? 'flex' : 'none';
  var submitRow = document.getElementById('p5-decision-submit-row');
  if (submitRow) submitRow.style.display = 'flex';
}

function p5SubmitDecision(caseId) {
  if (!_p5SelectedDecision) { _p5Toast('<i class="fas fa-exclamation-triangle"></i> Please select a decision outcome first', 3000); return; }
  var c = p5Cases.find(function(x){ return x.id === caseId; });
  if (!c) return;

  var def = p5DecisionOutcomes.find(function(o){ return o.value === _p5SelectedDecision; });
  var label = def ? def.label : _p5SelectedDecision;
  var today = 'Apr 14, 2026';

  c.decision = label;
  c.decisionDate = today;
  if (_p5SelectedDecision === 'approve') {
    c.stage = 'Approved';
    c.urgency = 'normal';
  } else if (_p5SelectedDecision === 'decline') {
    c.stage = 'Declined';
    c.urgency = 'closed';
  } else {
    c.stage = 'Decision';
  }

  c.statusUpdates.push({ date: today, msg: 'Decision recorded: ' + label + ' (' + (c.medUW.aiRating) + '). Agent notification sent.' });

  p5CloseDecisionForce();
  p5RenderCaseQueue();
  p5UpdateKPIs();
  _p5Toast('<i class="fas fa-gavel"></i> Decision recorded: <strong>' + label + '</strong> — ' + c.client + '. Agent notified.', 4000);
  _p5SelectedDecision = null;
}

function p5CommunicateDecision(caseId) {
  _p5Toast('<i class="fas fa-paper-plane"></i> Counter-offer communicated to agent. Awaiting applicant response.', 3500);
}

function p5SendStatusUpdate(caseId) {
  var c = p5Cases.find(function(x){ return x.id === caseId; });
  if (!c) return;
  var lastUpdate = c.statusUpdates[c.statusUpdates.length - 1];
  _p5Toast('<i class="fas fa-paper-plane"></i> Status update sent to <strong>' + c.agent + '</strong>: "' + lastUpdate.msg.substring(0, 60) + '…"', 4000);
}

// ── PREDICTIVE RISK SCORING OVERLAY ──────────────────────────

function p5OpenRiskScore(caseId) {
  var c = p5Cases.find(function(x){ return x.id === caseId; });
  if (!c) return;
  _p5ActiveCase = caseId;
  var overlay = document.getElementById('p5-risk-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  p5RenderRiskScore();
}

function p5CloseRiskScore(e) {
  if (e && e.target !== document.getElementById('p5-risk-overlay')) return;
  p5CloseRiskScoreForce();
}

function p5CloseRiskScoreForce() {
  var overlay = document.getElementById('p5-risk-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function p5RenderRiskScore() {
  var body = document.getElementById('p5-risk-body');
  if (!body || !_p5ActiveCase) return;
  var c = p5Cases.find(function(x){ return x.id === _p5ActiveCase; });
  if (!c) return;
  var m = c.medUW;

  // Predictive factors
  var factors = [
    { label: 'Age Factor', score: Math.max(0, 100 - (c.age - 25) * 1.2), icon: 'fa-birthday-cake', desc: 'Age ' + c.age + ' — ' + (c.age < 35 ? 'Excellent' : c.age < 45 ? 'Good' : c.age < 55 ? 'Moderate' : 'Elevated') + ' baseline mortality' },
    { label: 'BMI Score',  score: m.bmi < 18.5 ? 65 : m.bmi < 25 ? 95 : m.bmi < 30 ? 72 : m.bmi < 35 ? 48 : 25, icon: 'fa-weight', desc: 'BMI ' + m.bmi + ' — ' + (m.bmi < 25 ? 'Optimal' : m.bmi < 30 ? 'Overweight' : 'Obese') },
    { label: 'Blood Pressure', score: parseInt(m.bp) < 120 ? 95 : parseInt(m.bp) < 130 ? 82 : parseInt(m.bp) < 140 ? 65 : 38, icon: 'fa-heartbeat', desc: 'BP ' + m.bp + ' — ' + (parseInt(m.bp) < 120 ? 'Optimal' : parseInt(m.bp) < 130 ? 'Normal' : parseInt(m.bp) < 140 ? 'Elevated' : 'Stage 2 HTN') },
    { label: 'Rx Profile', score: (m.medications || []).length === 0 ? 98 : (m.medications || []).length === 1 ? 81 : (m.medications || []).length === 2 ? 66 : 44, icon: 'fa-pills', desc: (m.medications || []).length + ' prescription medication(s) — ' + ((m.medications || []).length === 0 ? 'None (best)' : (m.medications || []).length <= 2 ? 'Manageable' : 'Polypharmacy concern') },
    { label: 'MIB History', score: c.evidence.mib === 'done' ? 90 : c.evidence.mib === 'flag' ? 42 : 70, icon: 'fa-database', desc: 'MIB result: ' + (c.evidence.mib === 'done' ? 'Clean — no prior claims' : c.evidence.mib === 'flag' ? 'Flag detected — prior claim on record' : 'Pending') },
    { label: 'Conditions', score: (m.conditions || []).length === 0 ? 96 : (m.conditions || []).length === 1 ? 72 : (m.conditions || []).length === 2 ? 54 : 32, icon: 'fa-notes-medical', desc: (m.conditions || []).length + ' chronic condition(s) identified' }
  ];

  var factorBars = factors.map(function(f) {
    var barColor = f.score >= 80 ? '#059669' : f.score >= 60 ? '#f59e0b' : '#ef4444';
    return '<div class="p5-risk-factor-row">' +
      '<div class="p5-risk-factor-lbl"><i class="fas ' + f.icon + '"></i> ' + f.label + '</div>' +
      '<div class="p5-risk-factor-track"><div class="p5-risk-factor-fill" style="width:' + f.score + '%;background:' + barColor + '"></div></div>' +
      '<div class="p5-risk-factor-val" style="color:' + barColor + '">' + Math.round(f.score) + '</div>' +
      '<div class="p5-risk-factor-desc">' + f.desc + '</div>' +
    '</div>';
  }).join('');

  var ratingDef = p5RatingClasses.find(function(r){ return r.label === m.aiRating; }) || p5RatingClasses[3];
  var stp = c.stpScore;
  var stpColor = stp >= 80 ? '#059669' : stp >= 60 ? '#f59e0b' : '#ef4444';

  body.innerHTML =
    '<div class="p5-risk-summary-row">' +
      '<div class="p5-risk-big-score" style="border-color:' + stpColor + ';color:' + stpColor + '">' +
        '<div class="p5-risk-score-val">' + stp + '</div>' +
        '<div class="p5-risk-score-lbl">STP Score</div>' +
      '</div>' +
      '<div class="p5-risk-summary-info">' +
        '<div class="p5-risk-headline">' + c.client + ' · Age ' + c.age + ' · ' + c.product + '</div>' +
        '<div class="p5-risk-ai-verdict" style="color:' + ratingDef.color + '"><i class="fas fa-robot"></i> AI Recommended Rating: <strong>' + m.aiRating + '</strong></div>' +
        '<div class="p5-risk-narrative">' + m.aiRationale + '</div>' +
        '<div class="p5-risk-confidence"><i class="fas fa-tachometer-alt"></i> Model Confidence: <strong>' + c.aiConfidence + '%</strong> — based on ' + factors.length + ' structured factors before labs arrive</div>' +
      '</div>' +
    '</div>' +

    '<div class="p5-section-hdr" style="margin-top:24px"><i class="fas fa-sliders-h"></i> Predictive Risk Factors</div>' +
    '<div class="p5-risk-factors-list">' + factorBars + '</div>' +

    '<div class="p5-risk-ai-note">' +
      '<i class="fas fa-robot"></i>' +
      '<div><strong>Predictive Engine:</strong> Score calculated from ' + factors.length + ' structured inputs before all lab evidence arrives. ' +
      'Final decision should incorporate complete evidence. ' +
      (stp >= 80 ? 'High confidence — case likely qualifies for expedited STP processing.' :
       stp >= 60 ? 'Moderate confidence — manual review recommended for final classification.' :
       'Low STP score — full evidence review required before decision.') +
      '</div>' +
    '</div>' +

    '<div class="p5-overlay-footer">' +
      '<button class="p5-ov-btn ghost" onclick="p5CloseRiskScoreForce()"><i class="fas fa-times"></i> Close</button>' +
      '<button class="p5-ov-btn secondary" onclick="p5CloseRiskScoreForce();p5OpenMedUW(\'' + c.id + '\')"><i class="fas fa-heartbeat"></i> Medical UW</button>' +
      '<button class="p5-ov-btn primary" onclick="p5CloseRiskScoreForce();p5OpenDecision(\'' + c.id + '\')"><i class="fas fa-gavel"></i> Make Decision</button>' +
    '</div>';
}

// ── STATUS UPDATE OVERLAY ─────────────────────────────────────

function p5OpenStatusCenter(caseId) {
  var c = caseId ? p5Cases.find(function(x){ return x.id === caseId; }) : p5Cases[0];
  if (!c) return;
  _p5ActiveCase = c.id;
  var overlay = document.getElementById('p5-status-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  p5RenderStatusCenter();
}

function p5CloseStatusCenter(e) {
  if (e && e.target !== document.getElementById('p5-status-overlay')) return;
  p5CloseStatusCenterForce();
}

function p5CloseStatusCenterForce() {
  var overlay = document.getElementById('p5-status-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function p5RenderStatusCenter() {
  var body = document.getElementById('p5-status-body');
  if (!body) return;

  var allUpdates = [];
  p5Cases.forEach(function(c) {
    c.statusUpdates.forEach(function(u) {
      allUpdates.push({ caseId: c.id, client: c.client, initials: c.initials, stage: c.stage, date: u.date, msg: u.msg });
    });
  });
  allUpdates.reverse();

  var rows = allUpdates.slice(0, 20).map(function(u) {
    var stageColor = u.stage === 'Approved' ? '#059669' : u.stage === 'Declined' ? '#dc2626' : u.stage === 'Decision' ? '#f59e0b' : '#0891b2';
    return '<div class="p5-status-row" onclick="p5OpenDecision(\'' + u.caseId + '\');p5CloseStatusCenterForce()">' +
      '<div class="p5-status-avatar" style="background:' + stageColor + '">' + u.initials + '</div>' +
      '<div class="p5-status-content">' +
        '<div class="p5-status-client">' + u.client + ' <span class="p5-status-case-id">' + u.caseId + '</span></div>' +
        '<div class="p5-status-msg">' + u.msg + '</div>' +
      '</div>' +
      '<div class="p5-status-meta">' +
        '<div class="p5-status-date">' + u.date + '</div>' +
        '<div class="p5-status-stage-pill" style="background:' + stageColor + '20;color:' + stageColor + '">' + u.stage + '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  // Per-case summary cards
  var caseSummaries = p5Cases.map(function(c) {
    var lastUpd = c.statusUpdates[c.statusUpdates.length - 1];
    var stageColor = c.stage === 'Approved' ? '#059669' : c.stage === 'Declined' ? '#dc2626' : c.urgency === 'stale' ? '#ef4444' : '#0891b2';
    return '<div class="p5-status-case-card" onclick="p5OpenDecision(\'' + c.id + '\');p5CloseStatusCenterForce()">' +
      '<div class="p5-status-cc-top">' +
        '<div class="p5-status-cc-avatar" style="background:' + stageColor + '">' + c.initials + '</div>' +
        '<div>' +
          '<div class="p5-status-cc-name">' + c.client + '</div>' +
          '<div class="p5-status-cc-stage" style="color:' + stageColor + '">' + c.stage + '</div>' +
        '</div>' +
        '<div class="p5-status-cc-stp">STP ' + c.stpScore + '</div>' +
      '</div>' +
      '<div class="p5-status-cc-last">' + lastUpd.date + ': ' + lastUpd.msg.substring(0, 80) + '…</div>' +
      '<button class="p5-status-cc-btn" onclick="event.stopPropagation();p5SendAgentUpdate(\'' + c.id + '\')"><i class="fas fa-paper-plane"></i> Notify Agent</button>' +
    '</div>';
  }).join('');

  body.innerHTML =
    '<div class="p5-status-grid">' +
    '<div class="p5-status-left">' +
      '<div class="p5-section-hdr"><i class="fas fa-stream"></i> Activity Feed — All Cases</div>' +
      '<div class="p5-status-feed">' + rows + '</div>' +
    '</div>' +
    '<div class="p5-status-right">' +
      '<div class="p5-section-hdr"><i class="fas fa-clipboard-list"></i> Case Status Summary</div>' +
      '<div class="p5-status-cases">' + caseSummaries + '</div>' +
    '</div>' +
    '</div>' +
    '<div class="p5-overlay-footer">' +
      '<button class="p5-ov-btn ghost" onclick="p5CloseStatusCenterForce()"><i class="fas fa-times"></i> Close</button>' +
      '<button class="p5-ov-btn primary" onclick="p5BroadcastAllUpdates()"><i class="fas fa-broadcast-tower"></i> Notify All Agents</button>' +
    '</div>';
}

function p5SendAgentUpdate(caseId) {
  var c = p5Cases.find(function(x){ return x.id === caseId; });
  if (!c) return;
  var lastUpd = c.statusUpdates[c.statusUpdates.length - 1];
  _p5Toast('<i class="fas fa-paper-plane"></i> Status update sent to <strong>' + c.agent + '</strong> for ' + c.client, 3000);
}

function p5BroadcastAllUpdates() {
  _p5Toast('<i class="fas fa-broadcast-tower"></i> <strong>All agents notified</strong> — ' + p5Cases.length + ' status updates sent successfully.', 3500);
}

// ── TOOLBAR FUNCTIONS ────────────────────────────────────────

function p5FilterByStage(stage) {
  var cards = document.querySelectorAll('.p5-stage-col');
  cards.forEach(function(col) {
    if (!stage) { col.style.display = ''; return; }
    var hdr = col.querySelector('.p5-stage-hdr');
    if (hdr && hdr.textContent.toLowerCase().indexOf(stage.toLowerCase()) >= 0) {
      col.style.display = '';
    } else {
      col.style.display = 'none';
    }
  });
}

function p5FilterBySTP(level) {
  var allCards = document.querySelectorAll('.p5-case-card');
  allCards.forEach(function(card) {
    if (!level) { card.style.display = ''; return; }
    var stpBadge = card.querySelector('.p5-stp-badge');
    if (!stpBadge) return;
    var val = parseInt(stpBadge.textContent.replace('STP ', '')) || 0;
    var show = (level === 'high' && val >= 80) || (level === 'med' && val >= 60 && val < 80) || (level === 'low' && val < 60);
    card.style.display = show ? '' : 'none';
  });
}

function p5SortCases(method) {
  if (!method) return;
  var sorted = p5Cases.slice().sort(function(a, b) {
    if (method === 'stp-desc') return b.stpScore - a.stpScore;
    if (method === 'stp-asc')  return a.stpScore - b.stpScore;
    if (method === 'days-desc') return b.daysIn - a.daysIn;
    if (method === 'urgent')   return (b.urgency === 'urgent' ? 1 : 0) - (a.urgency === 'urgent' ? 1 : 0);
    return 0;
  });
  p5Cases.length = 0;
  sorted.forEach(function(c){ p5Cases.push(c); });
  p5RenderCaseQueue();
}

function p5RunAIScan() {
  var btn = document.getElementById('p5-scan-btn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Scanning…'; }
  setTimeout(function() {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-sync-alt"></i> AI Scan'; }
    _p5Toast('<i class="fas fa-robot"></i> AI scan complete — <strong>' + p5Cases.length + ' cases reviewed</strong>. 2 new STP opportunities identified. Julia Chen APS follow-up auto-sent.', 4500);
    p5UpdateKPIs();
  }, 2200);
}

// ── TOAST ──────────────────────────────────────────────────────

function _p5Toast(html, duration) {
  var existing = document.getElementById('p5-toast');
  if (existing) existing.remove();
  var t = document.createElement('div');
  t.id = 'p5-toast';
  t.className = 'p5-toast';
  t.innerHTML = html;
  document.body.appendChild(t);
  setTimeout(function(){ t.classList.add('p5-toast-show'); }, 10);
  setTimeout(function(){ t.classList.remove('p5-toast-show'); setTimeout(function(){ if (t.parentNode) t.remove(); }, 400); }, duration || 3500);
}
