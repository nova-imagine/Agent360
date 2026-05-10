
/* ═══════════════════════════════════════════════════════════════════
   PHASE 1-2 · FNA DISCOVERY MODULE
   ═══════════════════════════════════════════════════════════════════ */

var fnaData = [
  {
    id: 'FNA-001', client: 'Alex Rivera', initials: 'AR', phase: 3,
    stage: 'Gap Analysis', pct: 60, status: 'gap',
    dob: '1992-03-14', age: 34, gender: 'Male', smoker: false,
    occupation: 'VP of Technology', income: 185000, netWorth: 340000,
    lifeEvent: 'New Baby (Dec 2025)',
    products: ['Whole Life $500K'],
    gaps: ['No disability coverage', 'No LTC rider'],
    coverageNeeded: 780000, annualPremiumEst: 4200,
    healthNotes: 'Non-smoker. Excellent health. No medications.',
    aiRec: 'Whole Life $500K + DI $8,500/mo · strong candidate for PUAs'
  },
  {
    id: 'FNA-002', client: 'Nancy Foster', initials: 'NF', phase: 2,
    stage: 'Fact-Find', pct: 40, status: 'progress',
    dob: '1983-07-22', age: 41, gender: 'Female', smoker: false,
    occupation: 'Healthcare Director', income: 220000, netWorth: 620000,
    lifeEvent: 'New Home (Mar 2026)',
    products: ['Term Life $1M', 'LTC Rider interest'],
    gaps: ['No LTC coverage', 'Income gap $310K'],
    coverageNeeded: 1000000, annualPremiumEst: 3600,
    healthNotes: 'Non-smoker. Mild hypertension managed with medication.',
    aiRec: 'Term Life $1M 20-yr + LTC Hybrid · flag BP for UW rating'
  },
  {
    id: 'FNA-003', client: 'Patricia Nguyen', initials: 'PN', phase: 4,
    stage: 'AI Recommendation', pct: 80, status: 'urgent',
    dob: '1978-11-05', age: 48, gender: 'Female', smoker: false,
    occupation: 'Senior Operations Manager', income: 148000, netWorth: 510000,
    lifeEvent: 'Children approaching college age',
    products: ['UL top-up needed'],
    gaps: ['$240K income gap', 'UL underfunded — lapse risk 68 days'],
    coverageNeeded: 640000, annualPremiumEst: 6200,
    healthNotes: 'Non-smoker. T2DM well-controlled. A1c 6.8.',
    aiRec: 'UL premium increase $320/mo OR convert to WL + PUAs · urgent'
  }
];

function initFNAPage() {
  // page init — list already in JSX, detail starts empty
}

function filterFNAs(val) {
  var cards = document.querySelectorAll('.fna-card');
  var v = val.toLowerCase();
  cards.forEach(function(c) {
    var name = c.querySelector('.fna-card-name');
    if (name) {
      c.style.display = (name.textContent.toLowerCase().indexOf(v) >= 0 || v === '') ? '' : 'none';
    }
  });
}

function openFNADetail(id) {
  var fna = fnaData.find(function(f) { return f.id === id; });
  if (!fna) return;

  // Highlight active card
  document.querySelectorAll('.fna-card').forEach(function(c) { c.classList.remove('fna-card-active'); });
  var card = document.querySelector('[data-id="' + id + '"]');
  if (card) card.classList.add('fna-card-active');

  var empty = document.getElementById('fna-detail-empty');
  var panel = document.getElementById('fna-detail-panel');
  if (empty) empty.style.display = 'none';
  if (panel) { panel.style.display = ''; panel.innerHTML = renderFNADetail(fna); }
}

function renderFNADetail(fna) {
  var statusCls = { urgent: 'fna-status-pill urgent', gap: 'fna-status-pill gap', progress: 'fna-status-pill progress', done: 'fna-status-pill done' };
  var phases = ['Prospect Discovery','Fact-Find','Gap Analysis','AI Recommendation','Run Illustration'];
  var phaseHtml = phases.map(function(p, i) {
    var cls = (i + 1) < fna.phase ? 'fnd-phase-step done' : (i + 1) === fna.phase ? 'fnd-phase-step active' : 'fnd-phase-step';
    var icon = (i + 1) < fna.phase ? '<i class="fas fa-check-circle"></i>' : (i + 1) === fna.phase ? '<i class="fas fa-dot-circle"></i>' : '<i class="far fa-circle"></i>';
    return '<div class="' + cls + '">' + icon + '<span>' + p + '</span></div>';
  }).join('<div class="fnd-phase-line"></div>');

  var gapsHtml = fna.gaps.map(function(g) {
    return '<div class="fnd-gap-item"><i class="fas fa-exclamation-triangle"></i><span>' + g + '</span></div>';
  }).join('');

  return '<div class="fna-detail-content">' +
    '<div class="fnd-header">' +
      '<div class="fnd-avatar fna-av-' + fna.initials.toLowerCase() + '">' + fna.initials + '</div>' +
      '<div class="fnd-header-body">' +
        '<div class="fnd-name">' + fna.client + '</div>' +
        '<div class="fnd-meta">' + fna.occupation + ' · Age ' + fna.age + ' · Phase ' + fna.phase + ' of 5</div>' +
      '</div>' +
      '<span class="' + (statusCls[fna.status] || 'fna-status-pill') + '">' + fna.stage + '</span>' +
    '</div>' +

    '<div class="fnd-progress-row">' +
      '<div class="fna-prog-bar" style="flex:1"><div class="fna-prog-fill" style="width:' + fna.pct + '%"></div></div>' +
      '<span class="fna-prog-lbl">' + fna.pct + '% complete</span>' +
    '</div>' +

    '<div class="fnd-phase-track">' + phaseHtml + '</div>' +

    '<div class="fnd-sections">' +
      '<div class="fnd-section">' +
        '<div class="fnd-section-title"><i class="fas fa-user"></i> Personal &amp; Health</div>' +
        '<div class="fnd-grid">' +
          '<div class="fnd-field"><span class="fnd-lbl">Date of Birth</span><span class="fnd-val">' + fna.dob + '</span></div>' +
          '<div class="fnd-field"><span class="fnd-lbl">Gender</span><span class="fnd-val">' + fna.gender + '</span></div>' +
          '<div class="fnd-field"><span class="fnd-lbl">Smoker</span><span class="fnd-val">' + (fna.smoker ? 'Yes' : 'No') + '</span></div>' +
          '<div class="fnd-field"><span class="fnd-lbl">Occupation</span><span class="fnd-val">' + fna.occupation + '</span></div>' +
          '<div class="fnd-field fnd-wide"><span class="fnd-lbl">Health Notes</span><span class="fnd-val">' + fna.healthNotes + '</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="fnd-section">' +
        '<div class="fnd-section-title"><i class="fas fa-dollar-sign"></i> Financial Snapshot</div>' +
        '<div class="fnd-grid">' +
          '<div class="fnd-field"><span class="fnd-lbl">Annual Income</span><span class="fnd-val">$' + fna.income.toLocaleString() + '</span></div>' +
          '<div class="fnd-field"><span class="fnd-lbl">Net Worth</span><span class="fnd-val">$' + fna.netWorth.toLocaleString() + '</span></div>' +
          '<div class="fnd-field"><span class="fnd-lbl">Coverage Needed</span><span class="fnd-val fnd-val-hi">$' + fna.coverageNeeded.toLocaleString() + '</span></div>' +
          '<div class="fnd-field"><span class="fnd-lbl">Est. Annual Premium</span><span class="fnd-val">$' + fna.annualPremiumEst.toLocaleString() + '/yr</span></div>' +
          '<div class="fnd-field fnd-wide"><span class="fnd-lbl">Life Event Trigger</span><span class="fnd-val">' + fna.lifeEvent + '</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="fnd-section fnd-section-gaps">' +
        '<div class="fnd-section-title"><i class="fas fa-exclamation-triangle"></i> Coverage Gaps Detected</div>' +
        '<div class="fnd-gaps">' + gapsHtml + '</div>' +
      '</div>' +
      '<div class="fnd-section fnd-section-ai">' +
        '<div class="fnd-section-title"><i class="fas fa-robot"></i> AI Recommendation</div>' +
        '<div class="fnd-ai-rec">' + fna.aiRec + '</div>' +
      '</div>' +
    '</div>' +

    '<div class="fnd-actions">' +
      '<button class="btn btn-outline" onclick="continueFNA(\'' + fna.id + '\')"><i class="fas fa-edit"></i> Edit FNA</button>' +
      '<button class="btn btn-outline" onclick="openFNAAIAssist()"><i class="fas fa-robot"></i> AI Pre-fill</button>' +
      '<button class="btn btn-primary" onclick="launchIllustrationFromFNA(\'' + fna.id + '\')"><i class="fas fa-chart-line"></i> Run Illustration →</button>' +
    '</div>' +
  '</div>';
}

function continueFNA(id) {
  showToast('Opening FNA editor for ' + id + '…', 'info');
}

function openNewFNA() {
  var overlay = document.getElementById('new-fna-overlay');
  if (overlay) overlay.style.display = 'flex';
}

function closeFNAOverlay(e) {
  if (!e || e.target === document.getElementById('new-fna-overlay')) {
    var overlay = document.getElementById('new-fna-overlay');
    if (overlay) overlay.style.display = 'none';
  }
}

function fnaNextStep(step) {
  showToast('Proceeding to FNA Step ' + step + '…', 'info');
  closeFNAOverlay();
}

function openFNAAIAssist() {
  showToast('AI Assistant scanning meeting notes and CRM data to pre-fill FNA fields…', 'ai');
}

function switchFNAPhase(phase, el) {
  document.querySelectorAll('.fna-phase').forEach(function(p) { p.classList.remove('active'); });
  if (el) el.classList.add('active');
  showToast('Viewing Phase: ' + phase, 'info');
}

function toggleFNACompleted(el) {
  var list = document.getElementById('fna-completed-list');
  if (!list) return;
  var isOpen = list.style.display !== 'none';
  list.style.display = isOpen ? 'none' : '';
  var icon = el.querySelector('.fna-toggle-icon');
  if (icon) icon.style.transform = isOpen ? '' : 'rotate(180deg)';
}

function launchIllustrationFromFNA(id) {
  showToast('Launching Product Intelligence Hub with FNA data pre-loaded…', 'ai');
  setTimeout(function() { navigateTo('products'); }, 600);
}

console.log('FNA Discovery module loaded — fnaData(' + fnaData.length + '), openFNADetail, renderFNADetail, launchIllustrationFromFNA all ready');

/* ═══════════════════════════════════════════════════════════════════
   PHASE 6 · POLICY DELIVERY MODULE
   ═══════════════════════════════════════════════════════════════════ */

var deliveryData = {
  'DEL-001': {
    id: 'DEL-001', client: 'Alex Rivera', initials: 'AR', policyId: 'P-100360',
    product: 'Whole Life', faceAmount: '$500,000', premium: '$4,800/yr',
    issueDate: 'Apr 8, 2026', meetingDate: 'Apr 14, 2026 · 2:00 PM',
    status: 'ready',
    checklist: [
      { label: 'Policy issued by carrier', done: true },
      { label: 'Policy documents printed & organised', done: true },
      { label: 'AI delivery brief generated', done: true },
      { label: 'Delivery meeting scheduled', done: true },
      { label: 'Initial premium collected', done: false },
      { label: 'Policy reviewed page by page with client', done: false },
      { label: 'Beneficiary designations confirmed', done: false },
      { label: 'Free-look period explained', done: false },
      { label: 'Signed delivery receipt captured', done: false },
      { label: 'Client onboarded to portal', done: false }
    ],
    aiBrief: {
      summary: 'Alex Rivera is a 34-year-old VP of Technology purchasing his first life insurance policy. He has a newborn daughter (Dec 2025) which triggered this purchase. He is detail-oriented and technical — use clear, logical explanations.',
      keyPoints: [
        'Emphasise the guaranteed death benefit of $500K for his daughter\'s future',
        'Show the cash value growth projection — he specifically asked about wealth building',
        'Explain paid-up additions (PUAs) as a wealth-building mechanism',
        'Confirm Sarah Rivera (spouse) as primary beneficiary, Emily Rivera (daughter) as contingent',
        'Note: He expressed concern about premium burden — remind him of waiver of premium rider'
      ],
      objectionScript: 'If he says the premium feels high: "Alex, at $400/month, that\'s less than your car payment, and this builds guaranteed tax-free wealth for Emily\'s future while protecting your family today."',
      freelookNote: '30-day free-look period — policy can be returned for full refund. Set a 7-day check-in reminder.'
    },
    beneficiaries: [
      { role: 'Primary', name: 'Sarah Rivera', relation: 'Spouse', pct: 100 },
      { role: 'Contingent', name: 'Emily Rivera', relation: 'Daughter (minor)', pct: 100, note: 'Minor — recommend trust or UTMA' }
    ]
  },
  'DEL-002': {
    id: 'DEL-002', client: 'Nancy Foster', initials: 'NF', policyId: 'P-100365',
    product: 'Term Life', faceAmount: '$1,000,000', premium: '$3,600/yr',
    issueDate: 'Apr 9, 2026', meetingDate: 'Apr 16, 2026 · 10:00 AM',
    status: 'scheduled',
    checklist: [
      { label: 'Policy issued by carrier', done: true },
      { label: 'Policy documents ready', done: true },
      { label: 'AI delivery brief generated', done: true },
      { label: 'Delivery meeting scheduled', done: true },
      { label: 'Initial premium collected', done: true },
      { label: 'Policy reviewed with client', done: false },
      { label: 'Beneficiary designations confirmed', done: false },
      { label: 'Signed delivery receipt', done: false },
      { label: 'Client portal onboarding', done: false }
    ],
    aiBrief: {
      summary: 'Nancy Foster, 41, Healthcare Director, purchasing $1M 20-year term triggered by her new home purchase (Mar 2026). She is highly analytical — come prepared with numbers and comparisons.',
      keyPoints: [
        'New $820K mortgage is the primary need — show the death benefit covers mortgage + income replacement',
        'Remind her the conversion privilege to permanent insurance requires no new medical exam',
        'She asked about adding LTC rider at next annual review — note this for future follow-up',
        'Confirm Dr. Marcus Foster (husband) as primary beneficiary'
      ],
      objectionScript: 'If she asks about the rated premium (Standard vs Preferred): "Nancy, the BP medication puts you at Standard rating — but over 20 years, that\'s only $18/month more than Preferred, which is excellent value for $1M of coverage."',
      freelookNote: '30-day free-look period applies. Schedule 7-day AI check-in.'
    },
    beneficiaries: [
      { role: 'Primary', name: 'Dr. Marcus Foster', relation: 'Spouse', pct: 100 }
    ]
  },
  'DEL-003': {
    id: 'DEL-003', client: 'Kevin Park', initials: 'KP', policyId: 'P-100350',
    product: 'Term Life', faceAmount: '$250,000', premium: '$3,200/yr',
    issueDate: 'Apr 1, 2026', meetingDate: 'NOT SCHEDULED — 8 days overdue',
    status: 'overdue',
    checklist: [
      { label: 'Policy issued by carrier', done: true },
      { label: 'Policy documents ready', done: true },
      { label: 'AI delivery brief generated', done: false },
      { label: 'Delivery meeting scheduled', done: false },
      { label: 'Initial premium collected', done: false },
      { label: 'Policy reviewed with client', done: false },
      { label: 'Beneficiary designations confirmed', done: false },
      { label: 'Signed delivery receipt', done: false },
      { label: 'Client portal onboarding', done: false }
    ],
    aiBrief: {
      summary: 'Kevin Park, 29, Software Engineer. Pending application — policy issued but delivery overdue. Risk of free-look lapse increasing. Contact immediately.',
      keyPoints: [
        'Policy has been sitting undelivered 8 days — contact Kevin today',
        'He was in the hospital last month (claim CLM-2026-0035) — sensitive timing',
        'Keep delivery meeting brief and positive — focus on protection now active',
        'Premium mode: monthly auto-pay from Chase checking — confirm account details'
      ],
      objectionScript: 'If he hesitates: "Kevin, your policy is already active and protecting your family — this meeting is just to walk you through what you own and make sure all your documents are in order."',
      freelookNote: 'URGENT — free-look period runs until May 1. Deliver before then.'
    },
    beneficiaries: [
      { role: 'Primary', name: 'Jennifer Park', relation: 'Spouse', pct: 100 }
    ]
  }
};

function initDeliveryPage() {
  // page initialized from JSX
}

function openDeliveryDetail(id) {
  var d = deliveryData[id];
  if (!d) return;
  var empty = document.getElementById('del-detail-empty');
  var panel = document.getElementById('del-detail-panel');
  if (empty) empty.style.display = 'none';
  if (panel) { panel.style.display = ''; panel.innerHTML = renderDeliveryDetail(d); }
}

function renderDeliveryDetail(d) {
  var doneCount = d.checklist.filter(function(c) { return c.done; }).length;
  var pct = Math.round((doneCount / d.checklist.length) * 100);

  var checklistHtml = d.checklist.map(function(c, i) {
    return '<div class="del-det-check ' + (c.done ? 'done' : '') + '" onclick="toggleDeliveryCheck(\'' + d.id + '\',' + i + ',this)">' +
      '<i class="fas ' + (c.done ? 'fa-check-square' : 'fa-square') + ' del-det-check-icon"></i>' +
      '<span>' + c.label + '</span>' +
    '</div>';
  }).join('');

  var beneHtml = d.beneficiaries.map(function(b) {
    return '<div class="del-bene-row">' +
      '<span class="del-bene-role">' + b.role + '</span>' +
      '<span class="del-bene-name">' + b.name + '</span>' +
      '<span class="del-bene-rel">' + b.relation + '</span>' +
      '<span class="del-bene-pct">' + b.pct + '%</span>' +
      (b.note ? '<span class="del-bene-note"><i class="fas fa-exclamation-triangle"></i> ' + b.note + '</span>' : '') +
    '</div>';
  }).join('');

  var keyPtsHtml = d.aiBrief.keyPoints.map(function(p) {
    return '<li class="del-brief-pt">' + p + '</li>';
  }).join('');

  var statusCls = { ready: 'del-status-pill ready', scheduled: 'del-status-pill scheduled', overdue: 'del-status-pill overdue', delivered: 'del-status-pill delivered' };

  return '<div class="del-detail-content">' +
    '<div class="del-det-header">' +
      '<div class="del-avatar del-av-' + d.initials.toLowerCase() + '">' + d.initials + '</div>' +
      '<div class="del-det-header-body">' +
        '<div class="del-det-name">' + d.client + '</div>' +
        '<div class="del-det-pol">' + d.policyId + ' · ' + d.product + ' ' + d.faceAmount + ' · ' + d.premium + '</div>' +
        '<div class="del-det-meta">Issued: ' + d.issueDate + ' · Meeting: ' + d.meetingDate + '</div>' +
      '</div>' +
      '<span class="' + (statusCls[d.status] || 'del-status-pill') + '">' + d.status.charAt(0).toUpperCase() + d.status.slice(1) + '</span>' +
    '</div>' +

    '<div class="del-det-tabs">' +
      '<button class="del-det-tab active" onclick="switchDelTab(\'checklist\',this)"><i class="fas fa-tasks"></i> Checklist (' + doneCount + '/' + d.checklist.length + ')</button>' +
      '<button class="del-det-tab" onclick="switchDelTab(\'brief\',this)"><i class="fas fa-robot"></i> AI Brief</button>' +
      '<button class="del-det-tab" onclick="switchDelTab(\'beneficiaries\',this)"><i class="fas fa-user-shield"></i> Beneficiaries</button>' +
    '</div>' +

    '<div id="del-tab-checklist">' +
      '<div class="del-prog-row"><div class="del-prog-bar"><div class="del-prog-fill" style="width:' + pct + '%"></div></div><span class="del-prog-lbl">' + pct + '% complete</span></div>' +
      '<div class="del-checklist">' + checklistHtml + '</div>' +
      '<div class="del-det-actions">' +
        '<button class="btn btn-outline" onclick="scheduleDelivery(\'' + d.id + '\')"><i class="fas fa-calendar-plus"></i> Schedule Meeting</button>' +
        '<button class="btn btn-primary" onclick="captureDeliveryReceipt(\'' + d.id + '\')"><i class="fas fa-file-signature"></i> Capture Signed Receipt</button>' +
      '</div>' +
    '</div>' +

    '<div id="del-tab-brief" style="display:none">' +
      '<div class="del-brief-summary">' + d.aiBrief.summary + '</div>' +
      '<div class="del-brief-section">' +
        '<div class="del-brief-title"><i class="fas fa-lightbulb"></i> Key Points to Cover</div>' +
        '<ul class="del-brief-pts">' + keyPtsHtml + '</ul>' +
      '</div>' +
      '<div class="del-brief-section">' +
        '<div class="del-brief-title"><i class="fas fa-comments"></i> Objection Script</div>' +
        '<div class="del-brief-script">' + d.aiBrief.objectionScript + '</div>' +
      '</div>' +
      '<div class="del-brief-section warn">' +
        '<div class="del-brief-title"><i class="fas fa-undo"></i> Free-Look Note</div>' +
        '<div class="del-brief-freelook">' + d.aiBrief.freelookNote + '</div>' +
      '</div>' +
    '</div>' +

    '<div id="del-tab-beneficiaries" style="display:none">' +
      '<div class="del-bene-list">' + beneHtml + '</div>' +
      '<div class="del-bene-actions">' +
        '<button class="btn btn-outline" onclick="editBeneficiaries(\'' + d.id + '\')"><i class="fas fa-edit"></i> Edit Beneficiaries</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function switchDelTab(tab, el) {
  document.querySelectorAll('.del-det-tab').forEach(function(t) { t.classList.remove('active'); });
  if (el) el.classList.add('active');
  ['checklist','brief','beneficiaries'].forEach(function(t) {
    var el2 = document.getElementById('del-tab-' + t);
    if (el2) el2.style.display = t === tab ? '' : 'none';
  });
}

function toggleDeliveryCheck(id, idx, el) {
  el.classList.toggle('done');
  var icon = el.querySelector('.del-det-check-icon');
  if (icon) icon.className = 'fas ' + (el.classList.contains('done') ? 'fa-check-square' : 'fa-square') + ' del-det-check-icon';
}

function scheduleDelivery(id) { showToast('Opening calendar to schedule delivery meeting…', 'info'); setTimeout(function() { navigateTo('calendar'); }, 600); }
function openDeliveryBrief(id) { openDeliveryDetail(id); }
function captureDeliveryReceipt(id) { showToast('Receipt capture: opening e-signature workflow…', 'success'); }
function editBeneficiaries(id) { showToast('Opening beneficiary change form…', 'info'); }
function openNewDelivery() { showToast('Opening new delivery scheduling form…', 'info'); }
function openDeliveryAIPrep() { showToast('AI generating delivery prep brief for all pending deliveries…', 'ai'); }
function filterDeliveries(status) { showToast('Filtering deliveries: ' + status, 'info'); }

console.log('Policy Delivery module loaded — deliveryData(3 cases), openDeliveryDetail, renderDeliveryDetail, captureDeliveryReceipt all ready');

/* ═══════════════════════════════════════════════════════════════════
   PHASE 7 · LAPSE RISK DASHBOARD (Phase 7F)
   ═══════════════════════════════════════════════════════════════════ */

var lapseRiskData = [
  { policy: 'P-100301', client: 'Patricia Nguyen', initials: 'PN', type: 'Universal Life', faceAmt: '$400K', premium: '$6,200/yr', score: 92, level: 'critical', reason: 'CSV erosion — insufficient premium for COI charges. Lapse in ~68 days without action.', savePremium: '+$320/mo', saveScript: 'Patricia, your Universal Life policy is at risk of lapsing in about 68 days. I recommend increasing your monthly premium by $320 to stabilise the cash value. Can we schedule a call this week?' },
  { policy: 'P-100291', client: 'James Whitfield', initials: 'JW', type: 'Whole Life', faceAmt: '$500K', premium: '$8,400/yr', score: 34, level: 'low', reason: 'Policy in excellent standing. Cash value growing on schedule. No action required.', savePremium: null, saveScript: null },
  { policy: 'P-100310', client: 'Robert Chen', initials: 'RC', type: 'Whole Life', faceAmt: '$1M', premium: '$14,200/yr', score: 28, level: 'low', reason: 'Policy performing well. Dividends applied to PUAs.', savePremium: null, saveScript: null },
  { policy: 'P-100320', client: 'Sandra Williams', initials: 'SW', type: 'Term Life', faceAmt: '$350K', premium: '$2,800/yr', score: 68, level: 'high', reason: 'Renewal due Sep 2026 (5 months). Premium increases 340% at renewal if no conversion. Conversion privilege expires.', savePremium: 'Convert now', saveScript: 'Sandra, your term policy renews in 5 months and the renewal premium will be 3x higher. I\'d love to show you the conversion option while you\'re still within the conversion window — no new medical exam needed.' },
  { policy: 'P-100350', client: 'Kevin Park', initials: 'KP', type: 'Term Life', faceAmt: '$250K', premium: '$3,200/yr', score: 71, level: 'high', reason: 'Policy not yet delivered (8 days overdue). Free-look risk. First premium not confirmed.', savePremium: 'Deliver now', saveScript: 'Kevin, your policy was issued 8 days ago and is ready for delivery. Let me schedule a quick meeting to walk you through your coverage.' },
  { policy: 'P-100347', client: 'Linda Morrison', initials: 'LM', type: 'Universal Life', faceAmt: '$600K', premium: '$9,100/yr', score: 55, level: 'medium', reason: 'Premium payments 22 days late. Grace period active. APL may trigger if no payment by May 1.', savePremium: 'Collect payment', saveScript: 'Linda, I noticed your November premium hasn\'t posted yet. I want to make sure your policy stays active — can I help you set up auto-pay to prevent this in the future?' }
];

function openLapseRiskDashboard() {
  var panel = document.getElementById('lapse-risk-panel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'none' ? '' : 'none';
  if (panel.style.display !== 'none') {
    var list = document.getElementById('lrp-list');
    if (list) list.innerHTML = renderLapseRiskList();
  }
}

function closeLapseRiskDashboard() {
  var panel = document.getElementById('lapse-risk-panel');
  if (panel) panel.style.display = 'none';
}

function renderLapseRiskList() {
  var sorted = lapseRiskData.slice().sort(function(a, b) { return b.score - a.score; });
  return sorted.map(function(r) {
    var lvlCls = { critical: 'lrp-card-critical', high: 'lrp-card-high', medium: 'lrp-card-medium', low: 'lrp-card-low' };
    var scoreCls = r.score >= 80 ? 'lrp-score-critical' : r.score >= 60 ? 'lrp-score-high' : r.score >= 40 ? 'lrp-score-medium' : 'lrp-score-low';
    var actionBtn = r.savePremium ? '<button class="lrp-act-btn" onclick="openLapseAction(\'' + r.policy + '\')"><i class="fas fa-bolt"></i> ' + r.savePremium + '</button>' : '<span class="lrp-no-action"><i class="fas fa-check-circle"></i> No action needed</span>';
    return '<div class="lrp-card ' + (lvlCls[r.level] || '') + '" onclick="openPolicyModal(\'' + r.policy + '\')">' +
      '<div class="lrp-card-left">' +
        '<div class="lrp-score ' + scoreCls + '">' + r.score + '</div>' +
      '</div>' +
      '<div class="lrp-card-body">' +
        '<div class="lrp-card-top">' +
          '<div class="lrp-avatar">' + r.initials + '</div>' +
          '<div class="lrp-info">' +
            '<div class="lrp-name">' + r.client + '</div>' +
            '<div class="lrp-pol">' + r.policy + ' · ' + r.type + ' · ' + r.faceAmt + '</div>' +
          '</div>' +
          '<span class="lrp-level-badge ' + r.level + '">' + r.level.toUpperCase() + '</span>' +
        '</div>' +
        '<div class="lrp-reason"><i class="fas fa-info-circle"></i> ' + r.reason + '</div>' +
        (r.saveScript ? '<div class="lrp-script"><i class="fas fa-comment-dots"></i> <em>"' + r.saveScript.substring(0, 100) + '…"</em></div>' : '') +
        '<div class="lrp-card-footer">' + actionBtn + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function openLapseAction(policyId) {
  showToast('Opening save action for policy ' + policyId + '…', 'info');
}

/* ═══════════════════════════════════════════════════════════════════
   PHASE 7C · TERM → PERMANENT CONVERSION ALERTS
   ═══════════════════════════════════════════════════════════════════ */

var conversionAlertData = [
  { policy: 'P-100320', client: 'Sandra Williams', initials: 'SW', type: 'Term Life 20-yr', faceAmt: '$350K', premium: '$2,800/yr', issueDate: '2006', conversionExpiry: 'Sep 2026', daysLeft: 152, urgency: 'urgent', rec: 'Convert to Whole Life — no new UW exam. Estimated new premium: $6,200/yr. Cash value builds from day 1.' },
  { policy: 'P-100331', client: 'David Thompson', initials: 'DT', type: 'Term Life 30-yr', faceAmt: '$500K', premium: '$4,100/yr', issueDate: '2001', conversionExpiry: 'Dec 2026', daysLeft: 265, urgency: 'high', rec: 'Conversion window closing Dec 2026. David is now 57 — new UW would rate him much higher. Convert to GUL or WL now.' },
  { policy: 'P-100388', client: 'Maria Gonzalez', initials: 'MG', type: 'Term Life 20-yr', faceAmt: '$300K', premium: '$1,900/yr', issueDate: '2014', conversionExpiry: 'Mar 2028', daysLeft: 690, urgency: 'medium', rec: 'Conversion window open until 2028. Maria, 44, is in peak earning years — good time to discuss permanent coverage.' },
  { policy: 'P-100402', client: 'Carlos Rivera', initials: 'CR', type: 'Term Life 10-yr', faceAmt: '$200K', premium: '$1,200/yr', issueDate: '2019', conversionExpiry: 'Jun 2027', daysLeft: 420, urgency: 'medium', rec: 'Conversion privilege available. Age 38 — excellent time to convert before health changes affect future ratings.' }
];

function openConversionAlerts() {
  var panel = document.getElementById('conversion-panel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'none' ? '' : 'none';
  if (panel.style.display !== 'none') {
    var list = document.getElementById('cvp-list');
    if (list) list.innerHTML = renderConversionList();
  }
}

function closeConversionAlerts() {
  var panel = document.getElementById('conversion-panel');
  if (panel) panel.style.display = 'none';
}

function renderConversionList() {
  var urgCls = { urgent: 'cvp-card-urgent', high: 'cvp-card-high', medium: 'cvp-card-medium' };
  return conversionAlertData.map(function(c) {
    return '<div class="cvp-card ' + (urgCls[c.urgency] || '') + '" onclick="openPolicyModal(\'' + c.policy + '\')">' +
      '<div class="cvp-card-top">' +
        '<div class="cvp-avatar">' + c.initials + '</div>' +
        '<div class="cvp-info">' +
          '<div class="cvp-name">' + c.client + '</div>' +
          '<div class="cvp-pol">' + c.policy + ' · ' + c.type + ' · ' + c.faceAmt + '</div>' +
        '</div>' +
        '<div class="cvp-window">' +
          '<div class="cvp-days ' + (c.daysLeft < 200 ? 'urgent' : '') + '">' + c.daysLeft + 'd left</div>' +
          '<div class="cvp-expiry">Expires ' + c.conversionExpiry + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="cvp-rec"><i class="fas fa-robot"></i> ' + c.rec + '</div>' +
      '<div class="cvp-actions">' +
        '<button class="cvp-btn primary" onclick="event.stopPropagation();initiateConversion(\'' + c.policy + '\')"><i class="fas fa-exchange-alt"></i> Start Conversion</button>' +
        '<button class="cvp-btn ghost" onclick="event.stopPropagation();openPolicyModal(\'' + c.policy + '\')"><i class="fas fa-eye"></i> View Policy</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function initiateConversion(policyId) {
  showToast('Initiating term-to-permanent conversion for ' + policyId + '…', 'info');
}

/* ═══════════════════════════════════════════════════════════════════
   PHASE 7B · BENEFICIARY AUDIT SCANNER
   ═══════════════════════════════════════════════════════════════════ */

var beneficiaryIssues = [
  { policy: 'P-100301', client: 'Patricia Nguyen', initials: 'PN', issue: 'critical', issueType: 'Ex-spouse named', detail: 'Primary beneficiary is "Thomas Nguyen (spouse)" — divorced Oct 2024. Must update immediately.', fix: 'Change beneficiary to current designation' },
  { policy: 'P-100350', client: 'Kevin Park', initials: 'KP', issue: 'high', issueType: 'No contingent beneficiary', detail: 'Only primary beneficiary (Jennifer Park). No contingent named. If both die simultaneously, proceeds go to estate (probate).', fix: 'Add contingent beneficiary' },
  { policy: 'P-100360', client: 'Alex Rivera', initials: 'AR', issue: 'medium', issueType: 'Minor as contingent', detail: 'Emily Rivera (daughter, born Dec 2025) named as contingent. Minor cannot legally receive proceeds directly — needs trust or UTMA account.', fix: 'Set up UTMA or name trust as beneficiary' },
  { policy: 'P-100291', client: 'James Whitfield', initials: 'JW', issue: 'low', issueType: 'Review suggested', detail: 'Beneficiary last updated 2019. Recommend annual review — life circumstances may have changed.', fix: 'Annual beneficiary review' },
  { policy: 'P-100310', client: 'Robert Chen', initials: 'RC', issue: 'high', issueType: 'Deceased beneficiary', detail: 'Contingent beneficiary "Henry Chen (father)" — deceased Jan 2026 per public records. Must update.', fix: 'Remove deceased beneficiary, add new contingent' },
  { policy: 'P-100347', client: 'Linda Morrison', initials: 'LM', issue: 'medium', issueType: 'No trust designation', detail: 'Linda has $2M+ estate but no trust named as beneficiary. Proceeds will go through probate and may trigger estate taxes.', fix: 'Work with estate attorney to name trust as beneficiary' },
  { policy: 'P-100388', client: 'Maria Gonzalez', initials: 'MG', issue: 'medium', issueType: 'Percentage mismatch', detail: 'Primary beneficiaries total only 90% (3 children at 30% each). 10% unallocated — goes to estate.', fix: 'Update to 100% total allocation' },
  { policy: 'P-100402', client: 'Carlos Rivera', initials: 'CR', issue: 'low', issueType: 'Review suggested', detail: 'Beneficiary last updated 2019. No contingent named. Recommend review.', fix: 'Add contingent, confirm primary is current' }
];

function openBeneficiaryAudit() {
  var panel = document.getElementById('bene-audit-panel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'none' ? '' : 'none';
  if (panel.style.display !== 'none') {
    var list = document.getElementById('bap-list');
    if (list) list.innerHTML = renderBeneficiaryAudit();
  }
}

function closeBeneficiaryAudit() {
  var panel = document.getElementById('bene-audit-panel');
  if (panel) panel.style.display = 'none';
}

function renderBeneficiaryAudit() {
  var issueCls = { critical: 'bap-card-critical', high: 'bap-card-high', medium: 'bap-card-medium', low: 'bap-card-low' };
  return beneficiaryIssues.map(function(b) {
    return '<div class="bap-card ' + (issueCls[b.issue] || '') + '" onclick="openPolicyModal(\'' + b.policy + '\')">' +
      '<div class="bap-card-top">' +
        '<div class="bap-avatar">' + b.initials + '</div>' +
        '<div class="bap-info">' +
          '<div class="bap-name">' + b.client + '</div>' +
          '<div class="bap-pol">' + b.policy + '</div>' +
        '</div>' +
        '<span class="bap-issue-badge ' + b.issue + '">' + b.issueType + '</span>' +
      '</div>' +
      '<div class="bap-detail"><i class="fas fa-info-circle"></i> ' + b.detail + '</div>' +
      '<div class="bap-fix"><i class="fas fa-wrench"></i> Fix: ' + b.fix + '</div>' +
      '<div class="bap-actions">' +
        '<button class="bap-btn primary" onclick="event.stopPropagation();initiateBeneficiaryChange(\'' + b.policy + '\')"><i class="fas fa-edit"></i> Update Now</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function initiateBeneficiaryChange(policyId) {
  showToast('Opening beneficiary change form for ' + policyId + '…', 'info');
}

/* ═══════════════════════════════════════════════════════════════════
   PHASE 7G · CLAIMS AI NAVIGATOR (Beneficiary-facing)
   ═══════════════════════════════════════════════════════════════════ */

function openClaimsNavigator() {
  var overlay = document.createElement('div');
  overlay.className = 'cn-overlay';
  overlay.id = 'cn-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = '<div class="cn-modal" onclick="event.stopPropagation()">' +
    '<div class="cn-header">' +
      '<div class="cn-header-left">' +
        '<div class="cn-icon"><i class="fas fa-compass"></i></div>' +
        '<div><div class="cn-title">AI Claims Navigator</div>' +
        '<div class="cn-sub">Step-by-step guidance for beneficiaries submitting a claim</div></div>' +
      '</div>' +
      '<button class="cn-close" onclick="document.getElementById(\'cn-overlay\').remove()"><i class="fas fa-times"></i></button>' +
    '</div>' +
    '<div class="cn-body">' +
      '<div class="cn-step-list">' +
        renderNavigatorStep(1, 'done', 'Notify the Carrier', 'Call 1-800-695-8654 or submit online at newyorklife.com/claims', []) +
        renderNavigatorStep(2, 'done', 'Gather Required Documents', 'AI will pre-fill claim forms from policy data', ['Certified death certificate (original)', 'Claimant ID (driver\'s license or passport)', 'Policy document (if available)', 'Claimant\'s bank details for electronic payment']) +
        renderNavigatorStep(3, 'active', 'Complete Claim Form', 'AI pre-fills known fields from policy data — you review and sign', ['Claimant name & relationship to insured', 'Policy number (AI pre-filled)', 'Cause of death (from death certificate)', 'Requested payment method']) +
        renderNavigatorStep(4, 'pending', 'Contestability Review', 'Applies only if policy is less than 2 years old', ['If policy < 2 years old: carrier reviews application for material misrepresentation', 'AI flags any red flags in the original application', 'Typical review: 30–90 days']) +
        renderNavigatorStep(5, 'pending', 'Receive Payment', 'Average payout time: 5–10 business days after approval', ['Lump sum (most common)', 'Interest income option', 'Fixed period installments', 'Life income option']) +
      '</div>' +
      '<div class="cn-contact-bar">' +
        '<div class="cn-contact-item"><i class="fas fa-phone"></i><span>1-800-695-8654</span><span class="cn-contact-lbl">NYL Claims Hotline</span></div>' +
        '<div class="cn-contact-item"><i class="fas fa-globe"></i><span>newyorklife.com/claims</span><span class="cn-contact-lbl">Online Portal</span></div>' +
        '<div class="cn-contact-item"><i class="fas fa-clock"></i><span>Mon–Fri 8AM–8PM ET</span><span class="cn-contact-lbl">Hours</span></div>' +
      '</div>' +
    '</div>' +
  '</div>';
  document.body.appendChild(overlay);
}

function renderNavigatorStep(num, status, title, desc, items) {
  var iconCls = status === 'done' ? 'fas fa-check-circle cn-step-done' : status === 'active' ? 'fas fa-dot-circle cn-step-active' : 'far fa-circle cn-step-pending';
  var itemsHtml = items.map(function(i) { return '<li class="cn-step-item">' + i + '</li>'; }).join('');
  return '<div class="cn-step cn-step-' + status + '">' +
    '<div class="cn-step-icon"><i class="' + iconCls + '"></i></div>' +
    '<div class="cn-step-body">' +
      '<div class="cn-step-title">Step ' + num + ' — ' + title + '</div>' +
      '<div class="cn-step-desc">' + desc + '</div>' +
      (items.length ? '<ul class="cn-step-items">' + itemsHtml + '</ul>' : '') +
    '</div>' +
  '</div>';
}

function openADBScreener() {
  showToast('AI ADB Eligibility Screener: checking all open policies against terminal/chronic illness criteria…', 'ai');
}

/* ═══════════════════════════════════════════════════════════════════
   PHASE 5 · APS TRIAGE & REQUIREMENT TRACKER
   ═══════════════════════════════════════════════════════════════════ */

function openAPSTriageModal() {
  showToast('Opening APS Triage Center — AI medical record analysis in progress…', 'ai');
}

function sendAPSFollowUp(caseId) {
  showToast('AI drafting follow-up letter to physician for case ' + caseId + '…', 'ai');
  setTimeout(function() {
    showToast('Follow-up sent to Dr. Martinez (UW-2026-0014) · Expected APS in 5–7 days', 'success');
  }, 1800);
}

/* ═══════════════════════════════════════════════════════════════════
   PHASE 7 · PREMIUM CHANGE MODELER + 1035 ANALYZER
   ═══════════════════════════════════════════════════════════════════ */

function openPremiumChangeModal() {
  showToast('Opening Premium Impact Modeler — select a policy to model premium changes', 'info');
}

function open1035Analyzer() {
  showToast('AI 1035 Exchange Analyzer: identified 3 in-force policies that may benefit from tax-free exchange to newer products', 'ai');
}

console.log('Phase 7 modules loaded — lapseRiskData(' + lapseRiskData.length + '), conversionAlerts(' + conversionAlertData.length + '), beneficiaryAudit(' + beneficiaryIssues.length + '), claimsNavigator, APSTriage all ready');
