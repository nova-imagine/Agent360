/* ================================================================
   PHASE 7 — Policy Servicing (7A–7G)
   Covers: Policies · Policy Alerts · Claims · Upsell Track
   ================================================================ */

'use strict';

/* ═══════════════════════════════════════════════════════════════════
   7A · ROUTINE SERVICING — Policy Service Request Center
   Renders into #p7-service-hub on PoliciesPage
   ═══════════════════════════════════════════════════════════════════ */

var p7ServiceRequests = [
  {
    id: 'SR-001', type: 'premium-change', label: 'Premium Mode Change',
    client: 'Patricia Nguyen', initials: 'PN', policy: 'P-100301',
    avatarGrad: 'linear-gradient(135deg,#2563eb,#7c3aed)',
    status: 'pending', priority: 'urgent',
    detail: 'Client requests monthly → annual payment. Est. savings $4.8% discount.',
    submittedDate: 'Apr 10, 2026', dueDate: 'Apr 14, 2026',
    aiRec: 'Approve — annual mode saves client $278/yr. Premium $5,800 → effective $5,522. No lapse risk.'
  },
  {
    id: 'SR-002', type: 'address-change', label: 'Address / Contact Update',
    client: 'Sandra Williams', initials: 'SW', policy: 'P-100320',
    avatarGrad: 'linear-gradient(135deg,#dc2626,#f59e0b)',
    status: 'pending', priority: 'normal',
    detail: 'Client relocated: 42 Elmwood Ave → 18 Harbor Blvd, Staten Island NY 10301.',
    submittedDate: 'Apr 11, 2026', dueDate: 'Apr 15, 2026',
    aiRec: 'Routine update. Verify new address against USPS CASS. Update all 3 active policies simultaneously.'
  },
  {
    id: 'SR-003', type: 'dividend-election', label: 'Dividend Election Change',
    client: 'James Whitfield', initials: 'JW', policy: 'P-100291',
    avatarGrad: 'linear-gradient(135deg,#0891b2,#22d3ee)',
    status: 'in-review', priority: 'normal',
    detail: 'Changing from Paid-Up Additions → Cash Dividend payout. Annual dividend: $2,140.',
    submittedDate: 'Apr 9, 2026', dueDate: 'Apr 16, 2026',
    aiRec: 'Consider: PUA option builds significantly more cash value long-term. Client may prefer the $2,140 cash — confirm they understand the trade-off before processing.'
  },
  {
    id: 'SR-004', type: 'reinstatement', label: 'Policy Reinstatement',
    client: 'David Thompson', initials: 'DT', policy: 'P-100380',
    avatarGrad: 'linear-gradient(135deg,#7c3aed,#a855f7)',
    status: 'pending', priority: 'high',
    detail: 'Term policy lapsed Apr 2026. Client requesting reinstatement within grace period.',
    submittedDate: 'Apr 12, 2026', dueDate: 'Apr 17, 2026',
    aiRec: 'Reinstatement possible — within 31-day grace period. Requires: (1) back premium $2,400, (2) reinstatement application, (3) health statement (no new UW required within grace period). Act before Apr 17.'
  },
  {
    id: 'SR-005', type: 'annual-review', label: 'Annual Policy Review',
    client: 'James Whitfield', initials: 'JW', policy: 'P-100293',
    avatarGrad: 'linear-gradient(135deg,#0891b2,#22d3ee)',
    status: 'scheduled', priority: 'normal',
    detail: 'Annual review — Apr 15, 2026 at 10:00 AM. LTC coverage gap identified.',
    submittedDate: 'Apr 1, 2026', dueDate: 'Apr 15, 2026',
    aiRec: 'Review agenda: (1) LTC gap $180/day, (2) beneficiary update (2019 last reviewed), (3) disability insurance, (4) estate plan for $750K term policy conversion window.'
  }
];

var p7ServiceTypeIcons = {
  'premium-change':   { icon: 'fa-sliders-h',        color: '#0891b2' },
  'address-change':   { icon: 'fa-map-marker-alt',    color: '#059669' },
  'dividend-election':{ icon: 'fa-coins',             color: '#d97706' },
  'reinstatement':    { icon: 'fa-undo-alt',          color: '#dc2626' },
  'annual-review':    { icon: 'fa-calendar-check',    color: '#4f46e5' },
  'beneficiary':      { icon: 'fa-user-shield',       color: '#7c3aed' },
  'loan':             { icon: 'fa-hand-holding-usd',  color: '#0369a1' },
  'ownership':        { icon: 'fa-user-tie',          color: '#374151' },
  'coverage-change':  { icon: 'fa-exchange-alt',      color: '#d97706' }
};

var _p7ActiveSR = null;

function p7InitServiceHub() {
  var hub = document.getElementById('p7-service-hub');
  if (!hub) return;
  hub.innerHTML = p7BuildServiceHubHTML();
}

function p7BuildServiceHubHTML() {
  var statusOrder = { urgent: 0, high: 1, normal: 2 };
  var sorted = p7ServiceRequests.slice().sort(function(a,b) {
    return (statusOrder[a.priority]||9) - (statusOrder[b.priority]||9);
  });

  var cards = sorted.map(function(sr) {
    var ti = p7ServiceTypeIcons[sr.type] || { icon: 'fa-cog', color: '#64748b' };
    var statusCls = { pending: 'p7sr-status-pending', 'in-review': 'p7sr-status-review', scheduled: 'p7sr-status-scheduled', completed: 'p7sr-status-done' };
    var priCls = { urgent: 'p7sr-pri-urgent', high: 'p7sr-pri-high', normal: 'p7sr-pri-normal' };
    var active = _p7ActiveSR === sr.id ? ' p7sr-card-active' : '';
    return '<div class="p7sr-card' + active + '" onclick="p7OpenServiceRequest(\'' + sr.id + '\')">' +
      '<div class="p7sr-card-left">' +
        '<div class="p7sr-type-icon" style="color:' + ti.color + ';background:' + ti.color + '15"><i class="fas ' + ti.icon + '"></i></div>' +
      '</div>' +
      '<div class="p7sr-card-body">' +
        '<div class="p7sr-card-top">' +
          '<div class="p7sr-avatar" style="background:' + sr.avatarGrad + '">' + sr.initials + '</div>' +
          '<div class="p7sr-info">' +
            '<div class="p7sr-client">' + sr.client + '</div>' +
            '<div class="p7sr-pol"><i class="fas fa-file-contract"></i> ' + sr.policy + ' · ' + sr.label + '</div>' +
          '</div>' +
          '<div class="p7sr-badges">' +
            '<span class="p7sr-priority ' + (priCls[sr.priority]||'') + '">' + sr.priority.toUpperCase() + '</span>' +
            '<span class="p7sr-status ' + (statusCls[sr.status]||'') + '">' + sr.status.replace('-',' ') + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="p7sr-detail">' + sr.detail + '</div>' +
        '<div class="p7sr-footer">' +
          '<span class="p7sr-date"><i class="fas fa-calendar"></i> Due ' + sr.dueDate + '</span>' +
          '<button class="p7sr-action-btn" onclick="event.stopPropagation();p7ProcessServiceRequest(\'' + sr.id + '\')"><i class="fas fa-arrow-right"></i> Process</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  return '<div class="p7sr-header">' +
    '<div class="p7sr-title"><i class="fas fa-cogs"></i> Service Request Queue <span class="p7sr-count-badge">' + p7ServiceRequests.filter(function(s) { return s.status !== 'completed'; }).length + ' Active</span></div>' +
    '<div class="p7sr-actions">' +
      '<button class="p7sr-hdr-btn" onclick="p7NewServiceRequest()"><i class="fas fa-plus"></i> New Request</button>' +
      '<button class="p7sr-hdr-btn ghost" onclick="p7ExportServiceRequests()"><i class="fas fa-file-export"></i> Export</button>' +
    '</div>' +
  '</div>' +
  '<div class="p7sr-list">' + cards + '</div>';
}

function p7OpenServiceRequest(id) {
  _p7ActiveSR = id;
  var sr = p7ServiceRequests.find(function(s) { return s.id === id; });
  if (!sr) return;

  // Re-render list to highlight active
  p7InitServiceHub();

  var panel = document.getElementById('p7-sr-detail-panel');
  var empty = document.getElementById('p7-sr-detail-empty');
  if (empty) empty.style.display = 'none';
  if (!panel) return;
  panel.style.display = 'block';

  var ti = p7ServiceTypeIcons[sr.type] || { icon: 'fa-cog', color: '#64748b' };
  var statusCls = { pending: '#d97706', 'in-review': '#0891b2', scheduled: '#4f46e5', completed: '#059669' };
  var sc = statusCls[sr.status] || '#64748b';

  var formHTML = p7BuildServiceForm(sr);

  panel.innerHTML = '<div class="p7sr-detail-wrap">' +
    '<div class="p7sr-det-header" style="border-left:4px solid ' + ti.color + '">' +
      '<div class="p7sr-det-icon" style="color:' + ti.color + ';background:' + ti.color + '15"><i class="fas ' + ti.icon + '"></i></div>' +
      '<div class="p7sr-det-title-wrap">' +
        '<div class="p7sr-det-title">' + sr.label + '</div>' +
        '<div class="p7sr-det-sub">' + sr.id + ' · ' + sr.client + ' · ' + sr.policy + '</div>' +
      '</div>' +
      '<div class="p7sr-det-status-pill" style="background:' + sc + '20;color:' + sc + ';border:1px solid ' + sc + '40">' + sr.status.replace('-',' ').toUpperCase() + '</div>' +
    '</div>' +

    '<div class="p7sr-ai-rec">' +
      '<div class="p7sr-ai-rec-label"><i class="fas fa-robot"></i> AI Recommendation</div>' +
      '<div class="p7sr-ai-rec-text">' + sr.aiRec + '</div>' +
    '</div>' +

    formHTML +

    '<div class="p7sr-det-actions">' +
      '<button class="p7sr-det-btn primary" onclick="p7ProcessServiceRequest(\'' + sr.id + '\')"><i class="fas fa-check-circle"></i> Approve & Process</button>' +
      '<button class="p7sr-det-btn secondary" onclick="p7HoldServiceRequest(\'' + sr.id + '\')"><i class="fas fa-pause-circle"></i> Hold for Review</button>' +
      '<button class="p7sr-det-btn ghost" onclick="p7DenyServiceRequest(\'' + sr.id + '\')"><i class="fas fa-times-circle"></i> Deny</button>' +
    '</div>' +
  '</div>';
}

function p7BuildServiceForm(sr) {
  if (sr.type === 'premium-change') {
    return '<div class="p7sr-form">' +
      '<div class="p7sr-form-title">Premium Mode Change Request</div>' +
      '<div class="p7sr-form-grid">' +
        '<div class="p7sr-form-field"><label>Current Mode</label><select class="p7sr-input"><option selected>Monthly</option><option>Quarterly</option><option>Semi-Annual</option><option>Annual</option></select></div>' +
        '<div class="p7sr-form-field"><label>Requested Mode</label><select class="p7sr-input"><option>Monthly</option><option>Quarterly</option><option>Semi-Annual</option><option selected>Annual</option></select></div>' +
        '<div class="p7sr-form-field"><label>Current Premium</label><input class="p7sr-input" value="$5,800/yr" readonly/></div>' +
        '<div class="p7sr-form-field"><label>New Effective Premium</label><input class="p7sr-input" value="$5,522/yr (annual discount)" readonly/></div>' +
        '<div class="p7sr-form-field"><label>Effective Date</label><input class="p7sr-input" type="date" value="2026-05-01"/></div>' +
        '<div class="p7sr-form-field"><label>Client Signature</label><select class="p7sr-input"><option>e-Signature Pending</option><option>DocuSign Sent</option><option>Signed</option></select></div>' +
      '</div>' +
    '</div>';
  }
  if (sr.type === 'address-change') {
    return '<div class="p7sr-form">' +
      '<div class="p7sr-form-title">Address Change Request</div>' +
      '<div class="p7sr-form-grid">' +
        '<div class="p7sr-form-field p7sr-form-full"><label>New Street Address</label><input class="p7sr-input" value="18 Harbor Blvd"/></div>' +
        '<div class="p7sr-form-field"><label>City</label><input class="p7sr-input" value="Staten Island"/></div>' +
        '<div class="p7sr-form-field"><label>State / Zip</label><input class="p7sr-input" value="NY 10301"/></div>' +
        '<div class="p7sr-form-field"><label>Apply to Policies</label><select class="p7sr-input"><option>All policies (P-100320, P-100321, P-100304B)</option><option>P-100320 only</option></select></div>' +
        '<div class="p7sr-form-field"><label>USPS Verified</label><select class="p7sr-input"><option>Pending Verification</option><option selected>Verified — USPS CASS</option></select></div>' +
      '</div>' +
    '</div>';
  }
  if (sr.type === 'reinstatement') {
    return '<div class="p7sr-form">' +
      '<div class="p7sr-form-title">Reinstatement Request — P-100380</div>' +
      '<div class="p7sr-reinstatement-alert"><i class="fas fa-exclamation-triangle"></i> Grace period ends <strong>Apr 17, 2026</strong> — act within 5 days</div>' +
      '<div class="p7sr-form-grid">' +
        '<div class="p7sr-form-field"><label>Lapse Date</label><input class="p7sr-input" value="Apr 12, 2026" readonly/></div>' +
        '<div class="p7sr-form-field"><label>Grace Period Ends</label><input class="p7sr-input" value="Apr 17, 2026 (31 days)" readonly/></div>' +
        '<div class="p7sr-form-field"><label>Back Premium Due</label><input class="p7sr-input" value="$2,400" readonly/></div>' +
        '<div class="p7sr-form-field"><label>Payment Status</label><select class="p7sr-input"><option>Pending</option><option>ACH Submitted</option><option>Paid</option></select></div>' +
        '<div class="p7sr-form-field"><label>Health Statement</label><select class="p7sr-input"><option>Required — Not Received</option><option>Waived (within grace)</option></select></div>' +
        '<div class="p7sr-form-field"><label>New UW Required?</label><input class="p7sr-input" value="No — within grace period" readonly/></div>' +
      '</div>' +
    '</div>';
  }
  if (sr.type === 'dividend-election') {
    return '<div class="p7sr-form">' +
      '<div class="p7sr-form-title">Dividend Election Change — P-100291</div>' +
      '<div class="p7sr-form-grid">' +
        '<div class="p7sr-form-field"><label>Current Election</label><input class="p7sr-input" value="Paid-Up Additions (PUA)" readonly/></div>' +
        '<div class="p7sr-form-field"><label>Requested Election</label><select class="p7sr-input"><option>Paid-Up Additions</option><option selected>Cash Payment</option><option>Premium Reduction</option><option>Dividend Accumulation</option></select></div>' +
        '<div class="p7sr-form-field"><label>2026 Dividend Amount</label><input class="p7sr-input" value="$2,140" readonly/></div>' +
        '<div class="p7sr-form-field"><label>Effective Date</label><input class="p7sr-input" value="Next anniversary (Jun 15, 2026)" readonly/></div>' +
        '<div class="p7sr-form-field p7sr-form-full"><label>AI Note</label><div class="p7sr-ai-note">Switching from PUA reduces long-term cash value growth by est. $18,400 over 20 years. Recommend confirming with client.</div></div>' +
      '</div>' +
    '</div>';
  }
  // Generic form
  return '<div class="p7sr-form">' +
    '<div class="p7sr-form-title">Service Request Details</div>' +
    '<div class="p7sr-form-grid">' +
      '<div class="p7sr-form-field"><label>Request ID</label><input class="p7sr-input" value="' + sr.id + '" readonly/></div>' +
      '<div class="p7sr-form-field"><label>Policy</label><input class="p7sr-input" value="' + sr.policy + '" readonly/></div>' +
      '<div class="p7sr-form-field"><label>Submitted</label><input class="p7sr-input" value="' + sr.submittedDate + '" readonly/></div>' +
      '<div class="p7sr-form-field"><label>Due Date</label><input class="p7sr-input" value="' + sr.dueDate + '"/></div>' +
      '<div class="p7sr-form-field p7sr-form-full"><label>Notes</label><textarea class="p7sr-input p7sr-textarea">' + sr.detail + '</textarea></div>' +
    '</div>' +
  '</div>';
}

function p7ProcessServiceRequest(id) {
  var sr = p7ServiceRequests.find(function(s) { return s.id === id; });
  if (!sr) return;
  sr.status = 'completed';
  p7Toast('<i class="fas fa-check-circle"></i> ' + sr.label + ' processed for ' + sr.client, 3000);
  p7InitServiceHub();
}

function p7HoldServiceRequest(id) {
  p7Toast('<i class="fas fa-pause-circle"></i> Request ' + id + ' placed on hold — supervisor review required', 3000);
}

function p7DenyServiceRequest(id) {
  p7Toast('<i class="fas fa-times-circle"></i> Request ' + id + ' denied — notification sent to client', 3000);
}

function p7NewServiceRequest() {
  p7Toast('<i class="fas fa-plus"></i> Opening new service request form…', 2500);
}

function p7ExportServiceRequests() {
  p7Toast('<i class="fas fa-file-export"></i> Exporting service queue to CSV…', 2000);
}


/* ═══════════════════════════════════════════════════════════════════
   7D · POLICY LOAN & CASH VALUE CENTER
   Renders into #p7-loan-center on PoliciesPage
   ═══════════════════════════════════════════════════════════════════ */

var p7LoanData = [
  {
    id: 'LN-001', client: 'James Whitfield', initials: 'JW', policy: 'P-100291',
    avatarGrad: 'linear-gradient(135deg,#0891b2,#22d3ee)',
    policyType: 'Whole Life $500K', cashValue: 168400, loanBalance: 0,
    availableLoan: 159980, interestRate: '5.0% p.a.', maxLoan: '95% of cash value',
    loanType: null, status: 'eligible',
    aiRec: 'Strong cash value position. $168.4K available. Policy loan at 5% is cost-effective vs. outside financing. No lapse risk at current loan-to-value ratios up to $128K.'
  },
  {
    id: 'LN-002', client: 'Linda Morrison', initials: 'LM', policy: 'P-100330',
    avatarGrad: 'linear-gradient(135deg,#003087,#0057c8)',
    policyType: 'Whole Life $2M Flagship', cashValue: 312000, loanBalance: 45000,
    availableLoan: 251400, interestRate: '5.0% p.a.', maxLoan: '95% of cash value',
    loanType: 'active', status: 'active-loan',
    aiRec: 'Active loan $45K at 5%. Current LTV 14.4% — healthy. Annual interest accruing: $2,250. Recommend reviewing loan repayment at next annual review (Dec 2026).'
  },
  {
    id: 'LN-003', client: 'Patricia Nguyen', initials: 'PN', policy: 'P-100301',
    avatarGrad: 'linear-gradient(135deg,#2563eb,#7c3aed)',
    policyType: 'Universal Life $400K', cashValue: 21400, loanBalance: 0,
    availableLoan: 20330, interestRate: '6.0% p.a.', maxLoan: '95% of cash value',
    loanType: null, status: 'caution',
    aiRec: '⚠ CAUTION: Taking a loan on this policy is NOT recommended. Cash value is $21,400 — already below minimum threshold. A loan would accelerate lapse risk. Priority: add premium, not take loan.'
  }
];

function p7InitLoanCenter() {
  var panel = document.getElementById('p7-loan-center');
  if (!panel) return;
  panel.innerHTML = p7BuildLoanCenterHTML();
}

function p7BuildLoanCenterHTML() {
  var cards = p7LoanData.map(function(ln) {
    var statusCls = { eligible: 'p7ln-status-ok', 'active-loan': 'p7ln-status-active', caution: 'p7ln-status-warn' };
    var ltvPct = ln.cashValue > 0 ? Math.round(ln.loanBalance / ln.cashValue * 100) : 0;
    var availPct = ln.cashValue > 0 ? Math.round(ln.availableLoan / ln.cashValue * 100) : 0;

    return '<div class="p7ln-card ' + (ln.status === 'caution' ? 'p7ln-card-warn' : '') + '">' +
      '<div class="p7ln-card-header">' +
        '<div class="p7ln-avatar" style="background:' + ln.avatarGrad + '">' + ln.initials + '</div>' +
        '<div class="p7ln-info">' +
          '<div class="p7ln-client">' + ln.client + '</div>' +
          '<div class="p7ln-pol">' + ln.policy + ' · ' + ln.policyType + '</div>' +
        '</div>' +
        '<span class="p7ln-status ' + (statusCls[ln.status]||'') + '">' +
          (ln.status === 'eligible' ? 'Eligible' : ln.status === 'active-loan' ? 'Active Loan' : '⚠ Caution') +
        '</span>' +
      '</div>' +
      '<div class="p7ln-metrics">' +
        '<div class="p7ln-metric"><span class="p7ln-metric-val">$' + (ln.cashValue/1000).toFixed(1) + 'K</span><span class="p7ln-metric-lbl">Cash Value</span></div>' +
        '<div class="p7ln-metric"><span class="p7ln-metric-val ' + (ln.loanBalance > 0 ? 'p7ln-warn' : 'p7ln-ok') + '">$' + (ln.loanBalance/1000).toFixed(1) + 'K</span><span class="p7ln-metric-lbl">Loan Balance</span></div>' +
        '<div class="p7ln-metric"><span class="p7ln-metric-val p7ln-green">$' + (ln.availableLoan/1000).toFixed(1) + 'K</span><span class="p7ln-metric-lbl">Available</span></div>' +
        '<div class="p7ln-metric"><span class="p7ln-metric-val">' + ln.interestRate + '</span><span class="p7ln-metric-lbl">Interest Rate</span></div>' +
      '</div>' +
      (ln.loanBalance > 0 ? '<div class="p7ln-ltv-bar"><div class="p7ln-ltv-label">LTV ' + ltvPct + '%</div><div class="p7ln-ltv-track"><div class="p7ln-ltv-fill ' + (ltvPct > 70 ? 'p7ln-ltv-danger' : ltvPct > 40 ? 'p7ln-ltv-warn' : 'p7ln-ltv-ok') + '" style="width:' + Math.min(ltvPct, 100) + '%"></div></div></div>' : '') +
      '<div class="p7ln-ai-rec"><i class="fas fa-robot"></i> ' + ln.aiRec + '</div>' +
      '<div class="p7ln-actions">' +
        (ln.status !== 'caution' ? '<button class="p7ln-btn primary" onclick="p7OpenLoanModal(\'' + ln.id + '\',\'new\')"><i class="fas fa-hand-holding-usd"></i> Request Loan</button>' : '') +
        (ln.loanBalance > 0 ? '<button class="p7ln-btn secondary" onclick="p7OpenLoanModal(\'' + ln.id + '\',\'repay\')"><i class="fas fa-undo"></i> Repay Loan</button>' : '') +
        '<button class="p7ln-btn ghost" onclick="p7OpenLoanModal(\'' + ln.id + '\',\'withdraw\')"><i class="fas fa-minus-circle"></i> Partial Withdrawal</button>' +
        '<button class="p7ln-btn ghost red" onclick="p7OpenSurrenderModal(\'' + ln.id + '\')"><i class="fas fa-door-open"></i> Surrender</button>' +
      '</div>' +
    '</div>';
  }).join('');

  return '<div class="p7ln-header">' +
    '<div class="p7ln-title"><i class="fas fa-hand-holding-usd"></i> Loan & Cash Value Center <span class="p7ln-ai-badge">AI-Monitored</span></div>' +
    '<button class="p7ln-hdr-btn" onclick="p7Open1035Modal()"><i class="fas fa-random"></i> 1035 Exchange Analyzer</button>' +
  '</div>' +
  '<div class="p7ln-grid">' + cards + '</div>';
}

function p7OpenLoanModal(id, type) {
  var ln = p7LoanData.find(function(l) { return l.id === id; });
  if (!ln) return;

  var overlay = document.createElement('div');
  overlay.className = 'p7-modal-overlay';
  overlay.id = 'p7-loan-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var titles = { new: 'Request Policy Loan', repay: 'Loan Repayment', withdraw: 'Partial Withdrawal' };
  var title = titles[type] || 'Loan Action';

  var bodyHTML = '';
  if (type === 'new') {
    bodyHTML = '<div class="p7m-form-grid">' +
      '<div class="p7m-field"><label>Policy</label><input class="p7m-input" value="' + ln.policy + ' · ' + ln.policyType + '" readonly/></div>' +
      '<div class="p7m-field"><label>Available Cash Value</label><input class="p7m-input" value="$' + ln.cashValue.toLocaleString() + '" readonly/></div>' +
      '<div class="p7m-field"><label>Loan Amount Requested</label><input class="p7m-input" type="number" placeholder="Enter amount" min="500" max="' + ln.availableLoan + '"/></div>' +
      '<div class="p7m-field"><label>Loan Interest Rate</label><input class="p7m-input" value="' + ln.interestRate + '" readonly/></div>' +
      '<div class="p7m-field"><label>Repayment Plan</label><select class="p7m-input"><option>Interest Only (annual)</option><option>Full Repayment (12 months)</option><option>No Set Schedule</option></select></div>' +
      '<div class="p7m-field"><label>Purpose of Loan</label><select class="p7m-input"><option>Unexpected Expense</option><option>Home Purchase/Repair</option><option>Business Use</option><option>Other</option></select></div>' +
      '<div class="p7m-field p7m-full"><label>Disbursement Method</label><select class="p7m-input"><option>Check (7–10 business days)</option><option>ACH Transfer (2–3 business days)</option><option>Wire Transfer (same day, $25 fee)</option></select></div>' +
    '</div>' +
    '<div class="p7m-ai-note"><i class="fas fa-robot"></i> ' + ln.aiRec + '</div>';
  } else if (type === 'repay') {
    bodyHTML = '<div class="p7m-form-grid">' +
      '<div class="p7m-field"><label>Current Loan Balance</label><input class="p7m-input" value="$' + ln.loanBalance.toLocaleString() + '" readonly/></div>' +
      '<div class="p7m-field"><label>Accrued Interest</label><input class="p7m-input" value="$' + Math.round(ln.loanBalance * 0.05).toLocaleString() + ' (est. annual)" readonly/></div>' +
      '<div class="p7m-field"><label>Repayment Amount</label><input class="p7m-input" type="number" placeholder="Enter repayment amount" max="' + ln.loanBalance + '"/></div>' +
      '<div class="p7m-field"><label>Repayment Type</label><select class="p7m-input"><option>Interest Only</option><option>Principal + Interest</option><option>Full Payoff</option></select></div>' +
      '<div class="p7m-field p7m-full"><label>Payment Method</label><select class="p7m-input"><option>ACH from checking account</option><option>Check</option><option>Wire Transfer</option></select></div>' +
    '</div>';
  } else {
    bodyHTML = '<div class="p7m-form-grid">' +
      '<div class="p7m-field"><label>Policy Cash Value</label><input class="p7m-input" value="$' + ln.cashValue.toLocaleString() + '" readonly/></div>' +
      '<div class="p7m-field"><label>Surrender Charges</label><input class="p7m-input" value="None (policy > 10 years)" readonly/></div>' +
      '<div class="p7m-field"><label>Withdrawal Amount</label><input class="p7m-input" type="number" placeholder="Max: $' + Math.round(ln.cashValue * 0.25).toLocaleString() + ' (25%)"/></div>' +
      '<div class="p7m-field"><label>Tax Implications</label><input class="p7m-input" value="FIFO basis — amounts above basis taxable" readonly/></div>' +
      '<div class="p7m-warning"><i class="fas fa-exclamation-triangle"></i> Partial withdrawals permanently reduce cash value and death benefit. AI recommends exploring policy loan first (no immediate tax implications).</div>' +
    '</div>';
  }

  overlay.innerHTML = '<div class="p7m-modal" onclick="event.stopPropagation()">' +
    '<div class="p7m-header"><div class="p7m-title"><i class="fas fa-hand-holding-usd"></i> ' + title + '</div><button class="p7m-close" onclick="document.getElementById(\'p7-loan-modal\').remove()"><i class="fas fa-times"></i></button></div>' +
    '<div class="p7m-body">' + bodyHTML + '</div>' +
    '<div class="p7m-footer"><button class="p7m-btn primary" onclick="p7SubmitLoanAction(\'' + id + '\',\'' + type + '\')"><i class="fas fa-paper-plane"></i> Submit Request</button><button class="p7m-btn ghost" onclick="document.getElementById(\'p7-loan-modal\').remove()"><i class="fas fa-times"></i> Cancel</button></div>' +
  '</div>';

  document.body.appendChild(overlay);
}

function p7SubmitLoanAction(id, type) {
  var labels = { new: 'Policy loan request submitted', repay: 'Loan repayment processed', withdraw: 'Partial withdrawal submitted' };
  p7Toast('<i class="fas fa-check-circle"></i> ' + (labels[type]||'Request submitted') + ' — processing in 2–3 business days', 4000);
  var m = document.getElementById('p7-loan-modal');
  if (m) m.remove();
}

function p7OpenSurrenderModal(id) {
  var ln = p7LoanData.find(function(l) { return l.id === id; });
  if (!ln) return;
  var overlay = document.createElement('div');
  overlay.className = 'p7-modal-overlay';
  overlay.id = 'p7-surrender-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = '<div class="p7m-modal p7m-surrender" onclick="event.stopPropagation()">' +
    '<div class="p7m-header p7m-header-red"><div class="p7m-title"><i class="fas fa-exclamation-triangle"></i> Full Policy Surrender — ' + ln.policy + '</div><button class="p7m-close" onclick="document.getElementById(\'p7-surrender-modal\').remove()"><i class="fas fa-times"></i></button></div>' +
    '<div class="p7m-body">' +
      '<div class="p7m-surrender-warning">' +
        '<i class="fas fa-fire"></i>' +
        '<div>' +
          '<strong>This action is IRREVERSIBLE.</strong> Surrendering this policy means:<br>' +
          '• All life insurance coverage ends immediately<br>' +
          '• Any gains above cost basis are <strong>taxable as ordinary income</strong><br>' +
          '• Client loses insurability at current health status<br>' +
          '• Future premiums would be significantly higher<br><br>' +
          '<strong>AI strongly recommends exploring: policy loan, reduced paid-up, or extended term before surrendering.</strong>' +
        '</div>' +
      '</div>' +
      '<div class="p7m-form-grid" style="margin-top:16px">' +
        '<div class="p7m-field"><label>Net Cash Surrender Value</label><input class="p7m-input" value="$' + (ln.cashValue - ln.loanBalance).toLocaleString() + '" readonly/></div>' +
        '<div class="p7m-field"><label>Est. Taxable Gain</label><input class="p7m-input" value="Calculate with tax advisor" readonly/></div>' +
        '<div class="p7m-field p7m-full"><label>Reason for Surrender</label><select class="p7m-input"><option>Financial Hardship</option><option>Better Product Found</option><option>No Longer Needs Coverage</option><option>Other</option></select></div>' +
        '<div class="p7m-field p7m-full"><label>Confirm: Type SURRENDER to proceed</label><input class="p7m-input" id="p7-surrender-confirm" placeholder="Type SURRENDER here"/></div>' +
      '</div>' +
    '</div>' +
    '<div class="p7m-footer">' +
      '<button class="p7m-btn red" onclick="p7ConfirmSurrender(\'' + id + '\')"><i class="fas fa-door-open"></i> Confirm Full Surrender</button>' +
      '<button class="p7m-btn ghost" onclick="document.getElementById(\'p7-surrender-modal\').remove()"><i class="fas fa-times"></i> Cancel — Keep Policy</button>' +
    '</div>' +
  '</div>';
  document.body.appendChild(overlay);
}

function p7ConfirmSurrender(id) {
  var confirmInput = document.getElementById('p7-surrender-confirm');
  if (!confirmInput || confirmInput.value.trim().toUpperCase() !== 'SURRENDER') {
    p7Toast('<i class="fas fa-exclamation-circle"></i> Please type SURRENDER in the confirmation field', 2500);
    return;
  }
  p7Toast('<i class="fas fa-check-circle"></i> Surrender request submitted — pending supervisor approval and client notarized signature', 5000);
  var m = document.getElementById('p7-surrender-modal');
  if (m) m.remove();
}

function p7Open1035Modal() {
  p7Toast('<i class="fas fa-random"></i> AI 1035 Exchange Analyzer: 3 policies identified as candidates — opening full analysis…', 3000);
}


/* ═══════════════════════════════════════════════════════════════════
   7E · OWNERSHIP & ASSIGNMENT CHANGES
   ═══════════════════════════════════════════════════════════════════ */

function openOwnershipChangeModal(policyId) {
  var overlay = document.createElement('div');
  overlay.className = 'p7-modal-overlay';
  overlay.id = 'p7-ownership-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = '<div class="p7m-modal" onclick="event.stopPropagation()">' +
    '<div class="p7m-header"><div class="p7m-title"><i class="fas fa-user-tie"></i> Ownership & Assignment Change — ' + (policyId||'') + '</div><button class="p7m-close" onclick="document.getElementById(\'p7-ownership-modal\').remove()"><i class="fas fa-times"></i></button></div>' +
    '<div class="p7m-body">' +
      '<div class="p7m-form-grid">' +
        '<div class="p7m-field"><label>Change Type</label><select class="p7m-input"><option>Owner Transfer (Absolute)</option><option>Collateral Assignment (Lender)</option><option>Trust Assignment (ILIT)</option><option>Business Transfer (Buy-Sell)</option><option>Irrevocable Beneficiary Designation</option></select></div>' +
        '<div class="p7m-field"><label>Current Owner</label><input class="p7m-input" value="Insured (individual ownership)" readonly/></div>' +
        '<div class="p7m-field p7m-full"><label>New Owner / Assignee Name</label><input class="p7m-input" placeholder="Full legal name or trust name"/></div>' +
        '<div class="p7m-field"><label>New Owner SSN / EIN</label><input class="p7m-input" placeholder="For tax reporting"/></div>' +
        '<div class="p7m-field"><label>Effective Date</label><input class="p7m-input" type="date"/></div>' +
        '<div class="p7m-field p7m-full"><label>Attorney / Legal Approval</label><select class="p7m-input"><option>Required — Not Received</option><option>Attorney Letter Attached</option><option>Notarized Form Signed</option></select></div>' +
      '</div>' +
      '<div class="p7m-ai-note"><i class="fas fa-robot"></i> AI Note: Ownership changes may trigger gift tax reporting (Form 709) if transfer value > $18,000 annual exclusion. For trust assignments (ILIT), recommend 3-year look-back review for estate inclusion.</div>' +
    '</div>' +
    '<div class="p7m-footer"><button class="p7m-btn primary" onclick="p7SubmitOwnershipChange()"><i class="fas fa-paper-plane"></i> Submit for Approval</button><button class="p7m-btn ghost" onclick="document.getElementById(\'p7-ownership-modal\').remove()">Cancel</button></div>' +
  '</div>';
  document.body.appendChild(overlay);
}

function p7SubmitOwnershipChange() {
  p7Toast('<i class="fas fa-check-circle"></i> Ownership change submitted — compliance review + supervisor approval required (5–7 business days)', 4000);
  var m = document.getElementById('p7-ownership-modal');
  if (m) m.remove();
}


/* ═══════════════════════════════════════════════════════════════════
   7F · LAPSE MANAGEMENT & RETENTION — Enhanced with full save actions
   Adds to existing lapseRiskData / renderLapseRiskList
   ═══════════════════════════════════════════════════════════════════ */

// Extend existing lapseRiskData if present, otherwise define
if (typeof lapseRiskData === 'undefined') {
  var lapseRiskData = [];
}

// Ensure all needed entries exist
var _p7LapseEnhancement = [
  {
    policy: 'P-100301', client: 'Patricia Nguyen', initials: 'PN',
    type: 'Universal Life', faceAmt: '$400K', score: 87, level: 'critical',
    reason: 'Under-funded 2 consecutive quarters. Cash value $21,400 below $28K minimum. Predicted lapse Jun 20, 2026.',
    saveScript: 'Patricia, your Universal Life policy is at risk of lapsing in about 60 days. The good news is we can stop this today — a one-time payment of $6,600 would restore the policy and keep your coverage intact.',
    savePremium: 'Top-up $6,600',
    apl: true, aplNote: 'APL available — automatic premium loan will extend grace period by 6 months if approved',
    gracePeriodEnd: 'Jun 20, 2026', daysToLapse: 44,
    nonForfeitureOptions: ['Reduced Paid-Up ($280K face, no more premiums)', 'Extended Term (full $400K for 3 years)', 'Cash Surrender ($21,400 less loan)']
  },
  {
    policy: 'P-100320', client: 'Sandra Williams', initials: 'SW',
    type: 'Term Life 20-yr', faceAmt: '$350K', score: 79, level: 'high',
    reason: 'Term policy expires Sep 2026. No conversion or renewal action taken. 153 days remaining.',
    saveScript: 'Sandra, your term policy expires in September — and because of your excellent health history, you can convert to permanent coverage with no new medical exam. This window closes in 153 days.',
    savePremium: 'Convert to WL',
    apl: false, aplNote: null,
    gracePeriodEnd: 'Sep 15, 2026', daysToLapse: 153,
    nonForfeitureOptions: ['Convert to Whole Life ($6,200/yr)', 'Convert to Universal Life ($5,100/yr)', 'Let term expire (no further action)']
  }
];

function p7GetLapseRecord(policyId) {
  return _p7LapseEnhancement.find(function(l) { return l.policy === policyId; }) ||
         (typeof lapseRiskData !== 'undefined' && lapseRiskData.find(function(l) { return l.policy === policyId; }));
}

function p7OpenLapseSaveModal(policyId) {
  var lr = p7GetLapseRecord(policyId);
  if (!lr) {
    p7Toast('<i class="fas fa-search"></i> Opening lapse save options for ' + policyId + '…', 2000);
    return;
  }
  var overlay = document.createElement('div');
  overlay.className = 'p7-modal-overlay';
  overlay.id = 'p7-lapse-save-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  var nfoList = (lr.nonForfeitureOptions || []).map(function(opt, i) {
    return '<div class="p7ls-nfo-option" onclick="p7SelectNFO(this,' + i + ')">' +
      '<div class="p7ls-nfo-radio"></div>' +
      '<div class="p7ls-nfo-text">' + opt + '</div>' +
    '</div>';
  }).join('');

  overlay.innerHTML = '<div class="p7m-modal p7m-lapse-save" onclick="event.stopPropagation()">' +
    '<div class="p7m-header p7m-header-orange"><div class="p7m-title"><i class="fas fa-heartbeat"></i> Lapse Prevention — ' + lr.client + ' · ' + lr.policy + '</div><button class="p7m-close" onclick="document.getElementById(\'p7-lapse-save-modal\').remove()"><i class="fas fa-times"></i></button></div>' +
    '<div class="p7m-body">' +
      '<div class="p7ls-risk-banner">' +
        '<div class="p7ls-score-ring"><span class="p7ls-score-num">' + lr.score + '</span><span class="p7ls-score-lbl">Risk</span></div>' +
        '<div><div class="p7ls-risk-label">' + lr.level.toUpperCase() + ' LAPSE RISK</div><div class="p7ls-grace-note"><i class="fas fa-calendar-times"></i> Grace ends: ' + lr.gracePeriodEnd + ' (' + lr.daysToLapse + ' days)</div></div>' +
      '</div>' +
      '<div class="p7ls-reason">' + lr.reason + '</div>' +
      '<div class="p7ls-section-title">💬 AI-Generated Save Script</div>' +
      '<div class="p7ls-script">"' + lr.saveScript + '"</div>' +
      '<div class="p7ls-section-title">Non-Forfeiture Options</div>' +
      '<div class="p7ls-nfo-list">' + nfoList + '</div>' +
      (lr.apl ? '<div class="p7ls-apl-banner"><i class="fas fa-magic"></i> <strong>APL Available:</strong> ' + lr.aplNote + '</div>' : '') +
      '<div class="p7ls-actions">' +
        '<button class="p7ls-btn primary" onclick="p7ActivateSave(\'' + policyId + '\',\'outreach\')"><i class="fas fa-phone-alt"></i> Log Outreach Attempt</button>' +
        '<button class="p7ls-btn secondary" onclick="p7ActivateSave(\'' + policyId + '\',\'email\')"><i class="fas fa-envelope"></i> Send AI-Drafted Email</button>' +
        (lr.apl ? '<button class="p7ls-btn warning" onclick="p7ActivateSave(\'' + policyId + '\',\'apl\')"><i class="fas fa-magic"></i> Activate APL</button>' : '') +
      '</div>' +
    '</div>' +
  '</div>';

  document.body.appendChild(overlay);
}

function p7SelectNFO(el, idx) {
  var parent = el.closest('.p7ls-nfo-list');
  if (parent) parent.querySelectorAll('.p7ls-nfo-option').forEach(function(o) { o.classList.remove('selected'); });
  el.classList.add('selected');
}

function p7ActivateSave(policyId, action) {
  var msgs = {
    outreach: 'Outreach logged — AI drafted call script in CRM notes',
    email: 'AI-personalised retention email sent to client — 65% average open rate',
    apl: 'APL activated — automatic premium loan will cover next 6 months of premiums'
  };
  p7Toast('<i class="fas fa-check-circle"></i> ' + (msgs[action]||'Action completed'), 4000);
  var m = document.getElementById('p7-lapse-save-modal');
  if (m) m.remove();
}

// Override existing openLapseAction to use the richer Phase 7 modal
function openLapseAction(policyId) {
  p7OpenLapseSaveModal(policyId);
}


/* ═══════════════════════════════════════════════════════════════════
   7G · CLAIMS PROCESSING — Enhanced Claim Modal & Actions
   ═══════════════════════════════════════════════════════════════════ */

var p7ClaimsData = {
  'CLM-2026-0041': {
    id: 'CLM-2026-0041', client: 'Robert Chen', initials: 'RC', policy: 'P-100310',
    type: 'Death Benefit', amount: '$1,000,000', filed: '2026-04-09',
    daysOpen: 5, status: 'Under Review', priority: 'Urgent',
    adjuster: 'Chris Davis', adjusterTeam: 'Claims Dept.',
    fraudScore: 42, fraudLabel: 'Watch',
    slaDeadline: 'Apr 14, 2026', slaDaysLeft: 1, slaStatus: 'breach',
    liabilityScore: 72, liabilityLabel: 'High',
    docs: [
      { name: 'Death Certificate', status: 'received', date: 'Apr 10, 2026' },
      { name: 'Claimant ID (Susan Chen)', status: 'received', date: 'Apr 10, 2026' },
      { name: 'Policy Document', status: 'missing', date: null },
      { name: 'Notarized Claim Form', status: 'missing', date: null }
    ],
    contestability: false,
    aiTriage: 'Expedite — SLA breach imminent. Missing ID docs are the only blocker. Contact Susan Chen immediately to upload via portal.',
    timeline: [
      { date: 'Apr 9', event: 'Claim filed — death benefit $1M', type: 'filed' },
      { date: 'Apr 10', event: 'Death certificate received, fraud screening initiated', type: 'update' },
      { date: 'Apr 11', event: 'Fraud score: 42 (Watch) — case assigned to Chris Davis', type: 'update' },
      { date: 'Apr 12', event: 'SLA warning: 2 days to breach NY Ins. Law §3420', type: 'alert' }
    ]
  },
  'CLM-2026-0025': {
    id: 'CLM-2026-0025', client: 'Kevin Park', initials: 'KP', policy: 'P-100350',
    type: 'Death Benefit', amount: '$250,000', filed: '2026-04-05',
    daysOpen: 9, status: 'Under Review', priority: 'Urgent',
    adjuster: 'Chris Davis', adjusterTeam: 'Claims Dept.',
    fraudScore: 78, fraudLabel: 'Flagged',
    slaDeadline: 'May 5, 2026', slaDaysLeft: 21, slaStatus: 'ok',
    liabilityScore: 58, liabilityLabel: 'Medium',
    docs: [
      { name: 'Death Certificate', status: 'received', date: 'Apr 7, 2026' },
      { name: 'Obituary / Public Record', status: 'received', date: 'Apr 6, 2026' },
      { name: 'Claimant ID', status: 'missing', date: null },
      { name: 'Fraud Review Form', status: 'in-progress', date: null }
    ],
    contestability: true,
    contestabilityNote: 'Policy issued Oct 2025 — within 2-year contestability window. Carrier will review application for material misrepresentation. Fraud score 78 triggers mandatory investigation.',
    aiTriage: 'FRAUD HOLD — do not process until investigation complete. Policy is within 2-year contestability window. Fraud score 78 requires full documentation review and independent investigation.',
    timeline: [
      { date: 'Apr 5', event: 'Claim filed by Jennifer Park (beneficiary)', type: 'filed' },
      { date: 'Apr 6', event: 'Obituary match confirmed via AI public record scan', type: 'update' },
      { date: 'Apr 7', event: 'Death certificate received — cause: cardiac event (age 29)', type: 'update' },
      { date: 'Apr 8', event: 'Fraud score: 78 — Flagged for investigation (young insured, large benefit, new policy)', type: 'alert' },
      { date: 'Apr 10', event: 'Contestability review initiated — policy < 2 years old', type: 'alert' }
    ]
  },
  'CLM-2026-0028': {
    id: 'CLM-2026-0028', client: 'Maria Gonzalez', initials: 'MG', policy: 'P-100340',
    type: 'Accelerated Benefit (ADB)', amount: '$120,000', filed: '2026-03-05',
    daysOpen: 40, status: 'Pending Docs', priority: 'Urgent (Compassionate)',
    adjuster: 'Chris Davis', adjusterTeam: 'Claims Dept.',
    fraudScore: 38, fraudLabel: 'Watch',
    slaDeadline: 'Apr 19, 2026', slaDaysLeft: 5, slaStatus: 'warn',
    liabilityScore: 29, liabilityLabel: 'Low-Medium',
    docs: [
      { name: 'Terminal Illness Certification (Dr. Hernandez)', status: 'missing', date: null },
      { name: 'ADB Claim Form', status: 'received', date: 'Mar 6, 2026' },
      { name: 'Client ID', status: 'received', date: 'Mar 6, 2026' },
      { name: 'Life Expectancy Statement', status: 'pending', date: null }
    ],
    contestability: false,
    adbEligible: true,
    adbNote: 'ADB rider active — $120K (24% of $500K face). Eligible if life expectancy < 12 months. Terminal certification from Dr. Hernandez required.',
    aiTriage: 'COMPASSIONATE — expedite immediately. Terminal illness ADB claim. Dr. Hernandez certification is the only blocker. AI recommends direct physician outreach within 24 hours.',
    timeline: [
      { date: 'Mar 5', event: 'ADB claim filed — terminal diagnosis per primary physician', type: 'filed' },
      { date: 'Mar 6', event: 'Claim form and client ID received', type: 'update' },
      { date: 'Mar 20', event: 'Doc reminder sent to Dr. Hernandez — no response', type: 'update' },
      { date: 'Apr 1', event: 'Second reminder sent — SLA approaching', type: 'alert' },
      { date: 'Apr 10', event: 'Compassionate SLA triggered — 5 days to deadline', type: 'alert' }
    ]
  },
  'CLM-2026-0035': {
    id: 'CLM-2026-0035', client: 'Maria Gonzalez', initials: 'MG', policy: 'P-100341',
    type: 'Disability Income', amount: '$4,200/mo', filed: '2026-03-22',
    daysOpen: 23, status: 'Pending Docs', priority: 'Normal',
    adjuster: 'David Reyes', adjusterTeam: 'DI Unit',
    fraudScore: 18, fraudLabel: 'Clear',
    slaDeadline: 'Apr 22, 2026', slaDaysLeft: 9, slaStatus: 'warn',
    liabilityScore: 41, liabilityLabel: 'Medium',
    docs: [
      { name: 'APS — Dr. Hernandez', status: 'pending', date: null },
      { name: 'Disability Claim Form', status: 'received', date: 'Mar 22, 2026' },
      { name: 'Employer Statement', status: 'received', date: 'Mar 25, 2026' },
      { name: 'Client ID', status: 'received', date: 'Mar 22, 2026' }
    ],
    contestability: false,
    aiTriage: 'APS from Dr. Hernandez is sole remaining blocker. Send direct physician portal link. DI definition is "Own-Occupation" — claim should qualify if APS confirms inability to perform prior nursing duties.',
    timeline: [
      { date: 'Mar 22', event: 'DI claim filed — disability per nursing injury', type: 'filed' },
      { date: 'Mar 25', event: 'Employer statement received', type: 'update' },
      { date: 'Apr 1', event: 'APS request sent to Dr. Hernandez', type: 'update' },
      { date: 'Apr 9', event: 'No APS received — follow-up sent', type: 'alert' }
    ]
  },
  'CLM-2026-0033': {
    id: 'CLM-2026-0033', client: 'James Whitfield', initials: 'JW', policy: 'P-100293',
    type: 'Long-Term Care', amount: '$9,600', filed: '2026-03-15',
    daysOpen: 30, status: 'Under Review', priority: 'Normal',
    adjuster: 'Lisa Torres', adjusterTeam: 'LTC Team',
    fraudScore: 9, fraudLabel: 'Clear',
    slaDeadline: 'Apr 30, 2026', slaDaysLeft: 17, slaStatus: 'ok',
    liabilityScore: 12, liabilityLabel: 'Low',
    docs: [
      { name: 'Care Plan / Plan of Care', status: 'received', date: 'Mar 18, 2026' },
      { name: 'ADL Assessment', status: 'received', date: 'Mar 18, 2026' },
      { name: 'Physician Certification', status: 'received', date: 'Mar 20, 2026' },
      { name: 'Facility Invoice', status: 'received', date: 'Mar 22, 2026' }
    ],
    contestability: false,
    aiTriage: 'All docs received — approval imminent (est. 3 days). LTC trigger met: 2+ ADL impairments confirmed. Claim is clean — no flags. Approve at next review cycle.',
    timeline: [
      { date: 'Mar 15', event: 'LTC claim filed — 2 ADL impairments per physician', type: 'filed' },
      { date: 'Mar 18', event: 'Care plan and ADL assessment received', type: 'update' },
      { date: 'Mar 20', event: 'Physician certification received — LTC trigger confirmed', type: 'update' },
      { date: 'Mar 22', event: 'Facility invoice received — all docs complete', type: 'update' },
      { date: 'Apr 5', event: 'Under review — approval expected within 5 business days', type: 'update' }
    ]
  }
};

function openClaimModal(claimId, tab) {
  var claim = p7ClaimsData[claimId];
  if (!claim) {
    showToast('Claim ' + claimId + ' not found in records', 'error');
    return;
  }

  var overlay = document.getElementById('p7-claim-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'p7-modal-overlay';
    overlay.id = 'p7-claim-modal-overlay';
    overlay.onclick = function(e) { if (e.target === overlay) p7CloseClaimModal(); };
    document.body.appendChild(overlay);
  }

  var tabActive = tab || 'view';
  var tabs = ['view', 'docs', 'ci', 'timeline', 'liability'];
  var tabLabels = { view: 'Overview', docs: 'Documents', ci: 'AI Intelligence', timeline: 'Timeline', liability: 'Liability' };

  var tabBtns = tabs.map(function(t) {
    return '<button class="p7cm-tab ' + (t === tabActive ? 'active' : '') + '" onclick="p7SwitchClaimTab(\'' + claimId + '\',\'' + t + '\',this)">' +
      (t === 'ci' ? '<i class="fas fa-robot"></i>' : '') + ' ' + tabLabels[t] +
    '</button>';
  }).join('');

  var slaColor = { breach: '#dc2626', warn: '#d97706', ok: '#059669' };
  var sc = slaColor[claim.slaStatus] || '#64748b';
  var fraudColor = claim.fraudScore >= 70 ? '#dc2626' : claim.fraudScore >= 40 ? '#d97706' : '#059669';

  overlay.innerHTML = '<div class="p7cm-modal" onclick="event.stopPropagation()">' +
    '<div class="p7cm-header">' +
      '<div class="p7cm-title-row">' +
        '<div class="p7cm-claim-id">' + claim.id + '</div>' +
        '<div class="p7cm-client"><div class="p7cm-avatar">' + claim.initials + '</div><span>' + claim.client + '</span></div>' +
        '<div class="p7cm-type-badge">' + claim.type + '</div>' +
        '<div class="p7cm-amount">' + claim.amount + '</div>' +
        '<div class="p7cm-sla-pill" style="background:' + sc + '20;color:' + sc + ';border:1px solid ' + sc + '40"><i class="fas fa-stopwatch"></i> ' + claim.slaDaysLeft + 'd left</div>' +
        '<button class="p7cm-close" onclick="p7CloseClaimModal()"><i class="fas fa-times"></i></button>' +
      '</div>' +
      '<div class="p7cm-tabs">' + tabBtns + '</div>' +
    '</div>' +
    '<div class="p7cm-body" id="p7cm-body">' + p7BuildClaimTabContent(claim, tabActive) + '</div>' +
  '</div>';
}

function p7SwitchClaimTab(claimId, tab, el) {
  var claim = p7ClaimsData[claimId];
  if (!claim) return;
  document.querySelectorAll('.p7cm-tab').forEach(function(b) { b.classList.remove('active'); });
  if (el) el.classList.add('active');
  var body = document.getElementById('p7cm-body');
  if (body) body.innerHTML = p7BuildClaimTabContent(claim, tab);
}

function p7BuildClaimTabContent(claim, tab) {
  if (tab === 'view') {
    var statusColors = { 'Under Review':'#0891b2', 'Pending Docs':'#d97706', 'Open':'#4f46e5', 'Approved':'#059669', 'Paid':'#059669', 'Denied':'#dc2626' };
    var sc2 = statusColors[claim.status] || '#64748b';
    var slaColor = { breach: '#dc2626', warn: '#d97706', ok: '#059669' };
    var slac = slaColor[claim.slaStatus] || '#64748b';
    return '<div class="p7cm-overview">' +
      '<div class="p7cm-ov-grid">' +
        '<div class="p7cm-ov-card">' +
          '<div class="p7cm-ov-label">Status</div>' +
          '<div class="p7cm-ov-val"><span style="background:' + sc2 + '20;color:' + sc2 + ';padding:4px 12px;border-radius:20px;font-weight:600;font-size:13px">' + claim.status + '</span></div>' +
        '</div>' +
        '<div class="p7cm-ov-card">' +
          '<div class="p7cm-ov-label">Claim Amount</div>' +
          '<div class="p7cm-ov-val p7cm-amount-large">' + claim.amount + '</div>' +
        '</div>' +
        '<div class="p7cm-ov-card">' +
          '<div class="p7cm-ov-label">Fraud Score</div>' +
          '<div class="p7cm-ov-val"><span style="color:' + (claim.fraudScore >= 70 ? '#dc2626' : claim.fraudScore >= 40 ? '#d97706' : '#059669') + ';font-weight:700;font-size:22px">' + claim.fraudScore + '</span> <span style="color:#94a3b8;font-size:13px">' + claim.fraudLabel + '</span></div>' +
        '</div>' +
        '<div class="p7cm-ov-card">' +
          '<div class="p7cm-ov-label">SLA Deadline</div>' +
          '<div class="p7cm-ov-val" style="color:' + slac + ';font-weight:600">' + claim.slaDeadline + ' · <span>' + claim.slaDaysLeft + 'd left</span></div>' +
        '</div>' +
        '<div class="p7cm-ov-card">' +
          '<div class="p7cm-ov-label">Policy</div>' +
          '<div class="p7cm-ov-val">' + claim.policy + '</div>' +
        '</div>' +
        '<div class="p7cm-ov-card">' +
          '<div class="p7cm-ov-label">Filed Date</div>' +
          '<div class="p7cm-ov-val">' + claim.filed + ' (' + claim.daysOpen + ' days open)</div>' +
        '</div>' +
        '<div class="p7cm-ov-card">' +
          '<div class="p7cm-ov-label">Adjuster</div>' +
          '<div class="p7cm-ov-val">' + claim.adjuster + ' · ' + claim.adjusterTeam + '</div>' +
        '</div>' +
        '<div class="p7cm-ov-card">' +
          '<div class="p7cm-ov-label">Priority</div>' +
          '<div class="p7cm-ov-val"><strong>' + claim.priority + '</strong></div>' +
        '</div>' +
      '</div>' +
      (claim.contestability ? '<div class="p7cm-contestability-alert"><i class="fas fa-shield-virus"></i> <strong>Contestability Window Active</strong> — ' + claim.contestabilityNote + '</div>' : '') +
      (claim.adbEligible ? '<div class="p7cm-adb-banner"><i class="fas fa-heartbeat"></i> <strong>ADB Eligible</strong> — ' + claim.adbNote + '</div>' : '') +
      '<div class="p7cm-ai-triage"><div class="p7cm-ai-triage-label"><i class="fas fa-robot"></i> AI Triage</div><div>' + claim.aiTriage + '</div></div>' +
      '<div class="p7cm-actions-bar">' +
        '<button class="p7cm-act-btn primary" onclick="sendDocRequest(\'' + claim.id + '\',\'beneficiary\')"><i class="fas fa-paper-plane"></i> Chase Docs</button>' +
        '<button class="p7cm-act-btn secondary" onclick="p7OpenFraudDetail(\'' + claim.id + '\')"><i class="fas fa-shield-virus"></i> Fraud Review</button>' +
        '<button class="p7cm-act-btn secondary" onclick="p7ApproveClaim(\'' + claim.id + '\')"><i class="fas fa-check-circle"></i> Approve Claim</button>' +
        '<button class="p7cm-act-btn ghost" onclick="p7DenyClaim(\'' + claim.id + '\')"><i class="fas fa-times-circle"></i> Deny</button>' +
      '</div>' +
    '</div>';
  }

  if (tab === 'docs') {
    var docRows = claim.docs.map(function(doc) {
      var icon = doc.status === 'received' ? 'fa-check-circle' : doc.status === 'missing' ? 'fa-times-circle' : doc.status === 'in-progress' ? 'fa-spinner' : 'fa-clock';
      var color = doc.status === 'received' ? '#059669' : doc.status === 'missing' ? '#dc2626' : '#d97706';
      return '<div class="p7cm-doc-row">' +
        '<i class="fas ' + icon + '" style="color:' + color + ';margin-right:10px;font-size:18px"></i>' +
        '<div class="p7cm-doc-info">' +
          '<div class="p7cm-doc-name">' + doc.name + '</div>' +
          '<div class="p7cm-doc-date" style="color:#94a3b8;font-size:12px">' + (doc.date || 'Not yet received') + '</div>' +
        '</div>' +
        '<div class="p7cm-doc-status" style="color:' + color + ';font-size:13px;font-weight:600">' + doc.status.replace('-',' ').toUpperCase() + '</div>' +
        (doc.status === 'missing' || doc.status === 'pending' ? '<button class="p7cm-doc-btn" onclick="p7RequestDoc(\'' + claim.id + '\',\'' + doc.name + '\')"><i class="fas fa-paper-plane"></i> Request</button>' : '<button class="p7cm-doc-btn" onclick="p7ViewDoc(\'' + doc.name + '\')"><i class="fas fa-eye"></i> View</button>') +
      '</div>';
    }).join('');

    var completePct = Math.round(claim.docs.filter(function(d) { return d.status === 'received'; }).length / claim.docs.length * 100);
    return '<div class="p7cm-docs-panel">' +
      '<div class="p7cm-docs-header">' +
        '<div class="p7cm-docs-complete">Doc Completion: <strong>' + completePct + '%</strong></div>' +
        '<div class="p7cm-docs-progress-bar"><div style="width:' + completePct + '%;height:8px;background:' + (completePct === 100 ? '#059669' : completePct >= 50 ? '#d97706' : '#dc2626') + ';border-radius:4px"></div></div>' +
      '</div>' +
      '<div class="p7cm-doc-list">' + docRows + '</div>' +
      '<div class="p7cm-doc-actions">' +
        '<button class="p7cm-act-btn primary" onclick="p7SendAllDocRequests(\'' + claim.id + '\')"><i class="fas fa-paper-plane"></i> Request All Missing Docs</button>' +
        '<button class="p7cm-act-btn secondary" onclick="showToast(\'Upload portal link sent to claimant\',\'success\')"><i class="fas fa-upload"></i> Send Upload Portal Link</button>' +
      '</div>' +
    '</div>';
  }

  if (tab === 'ci') {
    return '<div class="p7cm-ci-panel">' +
      '<div class="p7cm-ci-header">' +
        '<div class="p7cm-ci-icon"><i class="fas fa-robot"></i></div>' +
        '<div><div class="p7cm-ci-title">AI Claims Intelligence Report</div><div class="p7cm-ci-sub">' + claim.id + ' · ' + claim.client + ' · ' + claim.type + '</div></div>' +
      '</div>' +
      '<div class="p7cm-ci-sections">' +
        '<div class="p7cm-ci-section">' +
          '<div class="p7cm-ci-section-title"><i class="fas fa-brain"></i> Fraud Risk Analysis</div>' +
          '<div class="p7cm-ci-fraud-score-wrap">' +
            '<div class="p7cm-ci-fraud-dial ' + (claim.fraudScore >= 70 ? 'red' : claim.fraudScore >= 40 ? 'amber' : 'green') + '">' + claim.fraudScore + '</div>' +
            '<div>' +
              '<div style="font-weight:600;margin-bottom:4px">' + claim.fraudLabel + ' Risk — Score ' + claim.fraudScore + '/100</div>' +
              (claim.fraudScore >= 70 ? '<div style="color:#dc2626">Investigation required before processing. Potential red flags detected.</div>' :
               claim.fraudScore >= 40 ? '<div style="color:#d97706">Elevated score — monitor closely. Case assigned to senior adjuster.</div>' :
               '<div style="color:#059669">Low fraud risk. No suspicious patterns detected.</div>') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="p7cm-ci-section">' +
          '<div class="p7cm-ci-section-title"><i class="fas fa-tasks"></i> AI Recommendation</div>' +
          '<div class="p7cm-ci-rec">' + claim.aiTriage + '</div>' +
        '</div>' +
        (claim.contestability ? '<div class="p7cm-ci-section p7cm-ci-contest">' +
          '<div class="p7cm-ci-section-title"><i class="fas fa-shield-virus"></i> Contestability Analysis</div>' +
          '<div>' + claim.contestabilityNote + '</div>' +
        '</div>' : '') +
        '<div class="p7cm-ci-section">' +
          '<div class="p7cm-ci-section-title"><i class="fas fa-chart-bar"></i> Resolution Prediction</div>' +
          '<div>Based on document completeness (' + Math.round(claim.docs.filter(function(d) { return d.status === 'received'; }).length / claim.docs.length * 100) + '%) and case complexity, AI estimates <strong>' + (claim.slaStatus === 'ok' ? '5–10 business days' : claim.slaStatus === 'warn' ? '2–5 business days (expedite)' : '1–2 days URGENT') + '</strong> to resolution.</div>' +
        '</div>' +
      '</div>' +
      '<div class="p7cm-ci-actions">' +
        '<button class="p7cm-act-btn primary" onclick="showToast(\'Full AI analysis report generated — check email\',\'success\')"><i class="fas fa-file-alt"></i> Generate Full Report</button>' +
        '<button class="p7cm-act-btn secondary" onclick="openFraudDetailModal(\'' + claim.id + '\')"><i class="fas fa-shield-virus"></i> Full Fraud Report</button>' +
      '</div>' +
    '</div>';
  }

  if (tab === 'timeline') {
    var timelineRows = claim.timeline.map(function(t, idx) {
      var dotColor = t.type === 'alert' ? '#dc2626' : t.type === 'filed' ? '#003087' : '#059669';
      var isLast = idx === claim.timeline.length - 1;
      return '<div class="p7cm-tl-row ' + (isLast ? 'p7cm-tl-latest' : '') + '">' +
        '<div class="p7cm-tl-dot" style="background:' + dotColor + '"></div>' +
        '<div class="p7cm-tl-date">' + t.date + '</div>' +
        '<div class="p7cm-tl-event">' + t.event + '</div>' +
      '</div>';
    }).join('');

    return '<div class="p7cm-timeline-panel">' +
      '<div class="p7cm-tl-header">Claim Activity Timeline — ' + claim.id + '</div>' +
      '<div class="p7cm-tl-list">' + timelineRows + '</div>' +
      '<div class="p7cm-tl-add">' +
        '<input class="p7m-input" id="p7cm-tl-note" placeholder="Add timeline note…" style="flex:1"/>' +
        '<button class="p7cm-act-btn primary" onclick="p7AddTimelineNote(\'' + claim.id + '\')"><i class="fas fa-plus"></i> Add Note</button>' +
      '</div>' +
    '</div>';
  }

  if (tab === 'liability') {
    var lc = claim.liabilityScore;
    var lColor = lc >= 60 ? '#dc2626' : lc >= 30 ? '#d97706' : '#059669';
    return '<div class="p7cm-liability-panel">' +
      '<div class="p7cm-liab-score-section">' +
        '<div class="p7cm-liab-dial" style="--liab-color:' + lColor + '">' +
          '<span class="p7cm-liab-num">' + lc + '%</span>' +
          '<span class="p7cm-liab-lbl">' + claim.liabilityLabel + '</span>' +
        '</div>' +
        '<div class="p7cm-liab-info">' +
          '<div style="font-size:16px;font-weight:700;color:' + lColor + ';margin-bottom:8px">Liability Score: ' + lc + '% — ' + claim.liabilityLabel + '</div>' +
          '<div style="color:#475569;line-height:1.6">AI liability assessment based on: policy terms, exclusion clauses, fraud probability, documentation completeness, and regulatory exposure.</div>' +
          (lc >= 60 ? '<div class="p7cm-liab-warn"><i class="fas fa-gavel"></i> Litigation risk detected. Legal team notification recommended before claim decision.</div>' : '') +
        '</div>' +
      '</div>' +
      '<div class="p7cm-liab-factors">' +
        '<div class="p7cm-liab-factor"><span>Documentation Completeness</span><div class="p7cm-liab-bar-wrap"><div class="p7cm-liab-bar-fill" style="width:' + Math.round(claim.docs.filter(function(d) { return d.status === 'received'; }).length / claim.docs.length * 100) + '%;background:#059669"></div></div></div>' +
        '<div class="p7cm-liab-factor"><span>Fraud Risk</span><div class="p7cm-liab-bar-wrap"><div class="p7cm-liab-bar-fill" style="width:' + claim.fraudScore + '%;background:' + (claim.fraudScore >= 70 ? '#dc2626' : '#d97706') + '"></div></div></div>' +
        '<div class="p7cm-liab-factor"><span>Contestability Exposure</span><div class="p7cm-liab-bar-wrap"><div class="p7cm-liab-bar-fill" style="width:' + (claim.contestability ? 85 : 5) + '%;background:' + (claim.contestability ? '#dc2626' : '#059669') + '"></div></div></div>' +
        '<div class="p7cm-liab-factor"><span>SLA Compliance</span><div class="p7cm-liab-bar-wrap"><div class="p7cm-liab-bar-fill" style="width:' + (claim.slaStatus === 'ok' ? 20 : claim.slaStatus === 'warn' ? 60 : 90) + '%;background:' + (claim.slaStatus === 'ok' ? '#059669' : claim.slaStatus === 'warn' ? '#d97706' : '#dc2626') + '"></div></div></div>' +
      '</div>' +
    '</div>';
  }
  return '<div class="p7cm-empty">Tab content loading…</div>';
}

function p7CloseClaimModal() {
  var overlay = document.getElementById('p7-claim-modal-overlay');
  if (overlay) overlay.remove();
}

function p7ApproveClaim(claimId) {
  p7Toast('<i class="fas fa-check-circle"></i> Claim ' + claimId + ' approved — payment processing initiated', 4000);
  p7CloseClaimModal();
}

function p7DenyClaim(claimId) {
  p7Toast('<i class="fas fa-times-circle"></i> Claim ' + claimId + ' denial initiated — adverse action letter required (ADA compliance)', 4000);
  p7CloseClaimModal();
}

function p7OpenFraudDetail(claimId) {
  p7Toast('<i class="fas fa-shield-virus"></i> Opening full fraud investigation file for ' + claimId + '…', 2500);
}

function p7RequestDoc(claimId, docName) {
  p7Toast('<i class="fas fa-paper-plane"></i> Document request sent for: ' + docName + ' — tracking added to claim timeline', 3000);
}

function p7ViewDoc(docName) {
  p7Toast('<i class="fas fa-file-alt"></i> Opening: ' + docName, 2000);
}

function p7SendAllDocRequests(claimId) {
  p7Toast('<i class="fas fa-paper-plane"></i> All missing document requests sent for ' + claimId + ' — AI-drafted letters generated', 3000);
}

function p7AddTimelineNote(claimId) {
  var input = document.getElementById('p7cm-tl-note');
  var note = input ? input.value.trim() : '';
  if (!note) { p7Toast('<i class="fas fa-exclamation-circle"></i> Please enter a note', 2000); return; }
  p7Toast('<i class="fas fa-check-circle"></i> Timeline note added to ' + claimId, 2000);
  if (input) input.value = '';
}

function sendDocRequest(claimId, recipient) {
  p7Toast('<i class="fas fa-paper-plane"></i> Document request sent to ' + recipient + ' for claim ' + claimId + ' — AI-drafted letter generated', 3500);
}

// Override existing modal-less stubs
function openFraudDetailModal(claimId) {
  p7Toast('<i class="fas fa-shield-virus"></i> Fraud Investigation Report — ' + claimId + ': Score analysis, timeline anomalies, investigation checklist loading…', 4000);
}

function openCIReviewModal() {
  p7Toast('<i class="fas fa-brain"></i> Full AI Claims Intelligence Report: loading cross-portfolio fraud analysis, SLA projections, and resolution modeling…', 4000);
}

function openFraudReportModal() {
  p7Toast('<i class="fas fa-shield-virus"></i> Fraud Report: CLM-2026-0025 (Score 78) flagged for contestability review. CLM-2026-0041 (Score 42) on watch list.', 4000);
}

function toggleWorkbench(btn) {
  var cards = document.getElementById('cwb-cards');
  if (!cards) return;
  var isCollapsed = cards.style.display === 'none';
  cards.style.display = isCollapsed ? '' : 'none';
  if (btn) btn.innerHTML = '<i class="fas fa-chevron-' + (isCollapsed ? 'up' : 'down') + '"></i>';
}

function toggleAllClaims(masterCb) {
  document.querySelectorAll('.claim-row-checkbox').forEach(function(cb) { cb.checked = masterCb.checked; });
  updateBatchButtons();
}

function updateBatchButtons() {
  var checked = document.querySelectorAll('.claim-row-checkbox:checked').length;
  var sendBtn = document.getElementById('batch-send-btn');
  var assignBtn = document.getElementById('batch-assign-btn');
  if (sendBtn) sendBtn.disabled = checked === 0;
  if (assignBtn) assignBtn.disabled = checked === 0;
}

function batchSendDocReminders() {
  var checked = document.querySelectorAll('.claim-row-checkbox:checked').length;
  p7Toast('<i class="fas fa-paper-plane"></i> Sending doc reminders to ' + checked + ' selected claim(s) — AI-drafted letters generated', 3000);
}

function batchAssignAdjuster() {
  var checked = document.querySelectorAll('.claim-row-checkbox:checked').length;
  p7Toast('<i class="fas fa-user-tag"></i> Adjuster assignment modal for ' + checked + ' claim(s)…', 2500);
}

function batchExportClaims() {
  p7Toast('<i class="fas fa-file-export"></i> Exporting claims to CSV…', 2000);
}

function filterClaims() {
  var searchVal = (document.getElementById('claim-search') ? document.getElementById('claim-search').value.toLowerCase() : '');
  var typeVal = (document.getElementById('claim-type-filter') ? document.getElementById('claim-type-filter').value.toLowerCase() : '');
  var statusVal = (document.getElementById('claim-status-filter') ? document.getElementById('claim-status-filter').value.toLowerCase() : '');
  var priorityVal = (document.getElementById('claim-priority-filter') ? document.getElementById('claim-priority-filter').value.toLowerCase() : '');

  document.querySelectorAll('.claims-table tbody tr.claim-row').forEach(function(row) {
    var txt = row.textContent.toLowerCase();
    var show = true;
    if (searchVal && !txt.includes(searchVal)) show = false;
    if (typeVal && !txt.includes(typeVal)) show = false;
    if (statusVal && !txt.includes(statusVal)) show = false;
    if (priorityVal && !txt.includes(priorityVal)) show = false;
    row.style.display = show ? '' : 'none';
  });
}

function filterClaimsByStatus(s) {
  var filter = document.getElementById('claim-status-filter');
  if (filter) { filter.value = s; filterClaims(); }
  else { p7Toast('<i class="fas fa-filter"></i> Filtering claims by status: ' + s, 2000); }
}

function filterClaimsBySLA() {
  p7Toast('<i class="fas fa-stopwatch"></i> Showing SLA at-risk claims — CLM-2026-0041 (1d), CLM-2026-0028 (5d)', 3000);
}

function filterClaimsByExposure() {
  p7Toast('<i class="fas fa-coins"></i> Claims sorted by open exposure — highest first', 2000);
}

function filterClaimsByDocStatus() {
  p7Toast('<i class="fas fa-file-import"></i> Filtering claims with incomplete documentation', 2000);
}

function showClaimsResolutionChart() {
  p7Toast('<i class="fas fa-chart-line"></i> Claims resolution trend: Jan 6.8d → Feb 6.1d → Mar 5.8d → Apr 5.2d (improving)', 4000);
}

function showPayoutTurnaroundPanel() {
  p7Toast('<i class="fas fa-bolt"></i> Payout turnaround: Jan 4.2d → Feb 3.8d → Mar 3.5d → Apr 3.1d — on track for 3.0d target', 4000);
}

function openPACModal(alertId) {
  var actions = {
    'obituary-kevin': { title: 'Obituary Alert — Kevin Park', steps: ['Verify death certificate against claim', 'Identify estate representative / beneficiary', 'Open formal death claim for P-100350', 'Review fraud score 78 — contestability window active', 'Assign senior adjuster for investigation'] },
    'lapse-patricia': { title: 'Lapse Prevention — Patricia Nguyen', steps: ['Call Patricia within 24 hours', 'Present premium top-up options ($6,600 catch-up)', 'Discuss APL as bridge if cash flow is tight', 'Send non-forfeiture options illustration', 'Log action in CRM with 7-day follow-up'] },
    'renewal-sandra': { title: 'Conversion Window — Sandra Williams', steps: ['Schedule conversion consultation (immediate)', 'Prepare WL/GUL conversion illustrations', 'Emphasise: no new medical exam required', 'Calculate premium savings vs new UW at age 61', 'Book meeting before end of April'] },
    'coverage-susan': { title: 'New Coverage — Susan Chen (Estate)', steps: ['Flag for post-claim outreach (after CLM-2026-0041 resolves)', 'Prepare FNA template for $1M windfall planning', 'Research Susan Chen contact details', 'Consider WL + investment + estate planning package', 'Set 30-day reminder from claim resolution date'] }
  };
  var action = actions[alertId] || { title: 'Alert Action', steps: ['Review alert details', 'Contact client', 'Log action in CRM'] };
  var stepsHTML = action.steps.map(function(s, i) {
    return '<div class="p7pac-step"><span class="p7pac-step-num">' + (i+1) + '</span><span>' + s + '</span></div>';
  }).join('');
  var overlay = document.createElement('div');
  overlay.className = 'p7-modal-overlay';
  overlay.id = 'p7-pac-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = '<div class="p7m-modal" onclick="event.stopPropagation()">' +
    '<div class="p7m-header"><div class="p7m-title"><i class="fas fa-bolt"></i> ' + action.title + '</div><button class="p7m-close" onclick="document.getElementById(\'p7-pac-modal\').remove()"><i class="fas fa-times"></i></button></div>' +
    '<div class="p7m-body">' +
      '<div class="p7pac-action-steps">' + stepsHTML + '</div>' +
      '<div style="margin-top:16px">' +
        '<button class="p7m-btn primary" onclick="p7MarkPACDone(\'' + alertId + '\')"><i class="fas fa-check-circle"></i> Mark Action Taken</button>' +
        '<button class="p7m-btn ghost" onclick="document.getElementById(\'p7-pac-modal\').remove()">Close</button>' +
      '</div>' +
    '</div>' +
  '</div>';
  document.body.appendChild(overlay);
}

function p7MarkPACDone(alertId) {
  p7Toast('<i class="fas fa-check-circle"></i> Action recorded in CRM — AI follow-up reminder set for 7 days', 3000);
  var m = document.getElementById('p7-pac-modal');
  if (m) m.remove();
}

function togglePACPanel(btn) {
  var body = document.getElementById('pac-alerts-body');
  if (!body) return;
  var isHidden = body.style.display === 'none';
  body.style.display = isHidden ? '' : 'none';
  if (btn) btn.innerHTML = '<i class="fas fa-chevron-' + (isHidden ? 'up' : 'down') + '"></i>';
}


/* ═══════════════════════════════════════════════════════════════════
   7A · POLICIES PAGE INIT (Service Hub + Loan Center)
   ═══════════════════════════════════════════════════════════════════ */

function initPoliciesPage() {
  requestAnimationFrame(function() {
    setTimeout(function() {
      p7InitServiceHub();
      p7InitLoanCenter();
    }, 80);
  });
}


/* ═══════════════════════════════════════════════════════════════════
   POLICY PAGE ACTIONS — filterPolicies, openNewPolicy etc.
   ═══════════════════════════════════════════════════════════════════ */

function filterPolicies() {
  var searchVal = (document.getElementById('policy-search') ? document.getElementById('policy-search').value.toLowerCase() : '');
  var typeVal = (document.getElementById('policy-type-filter') ? document.getElementById('policy-type-filter').value.toLowerCase() : '');
  var statusVal = (document.getElementById('policy-status-filter') ? document.getElementById('policy-status-filter').value.toLowerCase() : '');

  document.querySelectorAll('#policies-table tbody tr').forEach(function(row) {
    var txt = row.textContent.toLowerCase();
    var show = true;
    if (searchVal && !txt.includes(searchVal)) show = false;
    if (typeVal && !txt.includes(typeVal)) show = false;
    if (statusVal && !txt.includes(statusVal)) show = false;
    row.style.display = show ? '' : 'none';
  });
}

function openNewPolicyModal() {
  p7Toast('<i class="fas fa-plus"></i> New policy wizard — select client and product to begin…', 2500);
}

function openNLPReview(policyId) {
  var msgs = {
    all: 'NLP Portfolio Scan initiated — analyzing all 1,842 policies for exclusions, ambiguities & regulatory risks…',
    risk: 'Risk Report: P-100301 (Score 38 — underfunding lapse clause) and P-100320 (Score 44 — renewal exclusion age 61+) require immediate attention.'
  };
  p7Toast('<i class="fas fa-brain"></i> ' + (msgs[policyId] || 'NLP Review for policy ' + policyId + ' — scanning clauses, exclusions and risk factors…'), 4000);
}

function openRetentionFullReport() {
  p7Toast('<i class="fas fa-heartbeat"></i> Lapse & Retention Full Report: 2 urgent (Patricia Nguyen, Sandra Williams), 4 high risk — total $62.6K premium at risk', 4000);
}

function openRenewalCenter() {
  var panel = document.getElementById('renewal-action-center');
  if (panel) {
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    panel.style.outline = '2px solid #003087';
    setTimeout(function() { panel.style.outline = ''; }, 2000);
  }
}

function toggleRenewalCenter() {
  var panel = document.getElementById('renewal-action-center');
  if (!panel) return;
  var list = panel.querySelector('.rac-priority-list');
  var strip = panel.querySelector('.rac-kpi-strip');
  var footer = panel.querySelector('.rac-footer');
  var isOpen = !list || list.style.display !== 'none';
  if (list) list.style.display = isOpen ? 'none' : '';
  if (strip) strip.style.display = isOpen ? 'none' : '';
  if (footer) footer.style.display = isOpen ? 'none' : '';
}

function openRetentionModal(retId) {
  var retInfo = {
    'ret-patricia': { client: 'Patricia Nguyen', policy: 'P-100301', issue: 'UL Under-funded — lapse Jun 20 (~44d)', action: 'Premium top-up $6,600 or APL activation', urgency: 'CRITICAL' },
    'ret-sandra':   { client: 'Sandra Williams', policy: 'P-100320', issue: 'Term expiry Sep 2026 — conversion window 153d', action: 'Schedule conversion meeting this week', urgency: 'HIGH' },
    'ret-james':    { client: 'James Whitfield', policy: 'P-100293', issue: 'LTC gap $180/day at annual review Apr 15', action: 'Present LTC supplement illustration', urgency: 'MEDIUM' },
    'ret-david':    { client: 'David Thompson',  policy: 'P-100305', issue: 'Under-insured single-policy client, age 33', action: 'DI quote + deferred annuity presentation', urgency: 'LOW' }
  };
  var info = retInfo[retId] || { client: 'Client', policy: '', issue: 'Review retention risk', action: 'Schedule call', urgency: 'NORMAL' };
  var overlay = document.createElement('div');
  overlay.className = 'p7-modal-overlay';
  overlay.id = 'p7-retention-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = '<div class="p7m-modal" onclick="event.stopPropagation()">' +
    '<div class="p7m-header"><div class="p7m-title"><i class="fas fa-heartbeat"></i> Retention Action — ' + info.client + '</div><button class="p7m-close" onclick="document.getElementById(\'p7-retention-modal\').remove()"><i class="fas fa-times"></i></button></div>' +
    '<div class="p7m-body">' +
      '<div class="p7pac-step"><span class="p7pac-step-num" style="background:' + (info.urgency === 'CRITICAL' ? '#dc2626' : info.urgency === 'HIGH' ? '#d97706' : '#4f46e5') + '">' + info.urgency + '</span><span>' + info.issue + '</span></div>' +
      '<div style="margin-top:12px;padding:12px;background:#f0fdf4;border-radius:8px"><i class="fas fa-lightbulb" style="color:#059669;margin-right:8px"></i><strong>Recommended Action:</strong> ' + info.action + '</div>' +
      '<div style="margin-top:16px">' +
        '<button class="p7m-btn primary" onclick="draftRetentionEmail(\'' + retId + '\')"><i class="fas fa-envelope"></i> Draft AI Email</button>' +
        '<button class="p7m-btn secondary" onclick="p7Toast(\'Scheduling call with ' + info.client + '…\',\'info\')"><i class="fas fa-phone"></i> Schedule Call</button>' +
        '<button class="p7m-btn ghost" onclick="document.getElementById(\'p7-retention-modal\').remove()">Close</button>' +
      '</div>' +
    '</div>' +
  '</div>';
  document.body.appendChild(overlay);
}

function draftRetentionEmail(clientKey) {
  var templates = {
    patricia: 'Subject: Important — Your Universal Life Policy Needs Attention\n\nDear Patricia,\n\nI wanted to reach out personally regarding your Universal Life policy P-100301. Our monitoring system has flagged that your policy may be at risk of lapsing within the next 60 days due to premium funding levels.\n\nI\'d love to connect this week to review your options — including a catch-up premium, APL, or adjusting coverage levels to maintain your protection.\n\nAre you available for a 20-minute call this week?',
    sandra: 'Subject: Your Term Policy Expires in September — Let\'s Talk Options\n\nDear Sandra,\n\nYour term life policy (P-100320, $350,000) expires in September 2026 — just 5 months away. Because of your strong health history, you have the option to convert to permanent coverage WITHOUT a new medical exam.\n\nThis window closes at expiry. At age 61, new underwriting would significantly increase your premium or could result in coverage limitations.\n\nI\'d like to show you some options. Can we connect this week?',
    james: 'Subject: Your Annual Review — April 15\n\nDear James,\n\nI\'m looking forward to our annual policy review on April 15. I\'ve prepared a comprehensive analysis of your portfolio including some exciting updates on your Whole Life cash value growth.\n\nI also have some ideas on addressing the LTC coverage gap we identified — I think you\'ll find the options very reasonable.',
    david: 'Subject: Protecting What Matters Most — Are You Covered?\n\nDear David,\n\nCongratulations on your recent marriage! This is a great time to review your financial protection. I\'d love to show you how a simple disability insurance policy could protect your income if you\'re ever unable to work.'
  };
  var emailText = templates[clientKey] || 'AI-drafting personalised retention email…';
  var overlay = document.createElement('div');
  overlay.className = 'p7-modal-overlay';
  overlay.id = 'p7-email-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = '<div class="p7m-modal" onclick="event.stopPropagation()">' +
    '<div class="p7m-header"><div class="p7m-title"><i class="fas fa-envelope-open-text"></i> AI-Drafted Retention Email</div><button class="p7m-close" onclick="document.getElementById(\'p7-email-modal\').remove()"><i class="fas fa-times"></i></button></div>' +
    '<div class="p7m-body">' +
      '<textarea class="p7m-input p7m-textarea-lg" id="p7-email-body">' + emailText + '</textarea>' +
      '<div style="margin-top:12px">' +
        '<button class="p7m-btn primary" onclick="p7SendEmail()"><i class="fas fa-paper-plane"></i> Send Email</button>' +
        '<button class="p7m-btn secondary" onclick="p7CopyEmail()"><i class="fas fa-copy"></i> Copy to Clipboard</button>' +
        '<button class="p7m-btn ghost" onclick="document.getElementById(\'p7-email-modal\').remove()">Cancel</button>' +
      '</div>' +
    '</div>' +
  '</div>';
  document.body.appendChild(overlay);
}

function p7SendEmail() {
  p7Toast('<i class="fas fa-paper-plane"></i> Email sent via CRM — delivery tracking active', 3000);
  var m = document.getElementById('p7-email-modal');
  if (m) m.remove();
}

function p7CopyEmail() {
  var ta = document.getElementById('p7-email-body');
  if (ta) { ta.select(); document.execCommand('copy'); }
  p7Toast('<i class="fas fa-copy"></i> Email copied to clipboard', 2000);
}

function openRunCampaignModal() {
  p7Toast('<i class="fas fa-paper-plane"></i> Renewal Campaign Wizard: select 23 clients, choose email/SMS/call sequence, set automation schedule…', 3500);
}

function openCoverageGapAnalysisModal() {
  p7Toast('<i class="fas fa-robot"></i> AI Coverage Gap Analysis: scanning 1,842 policies across 8 gap categories — est. total opportunity $31.2K/yr…', 4000);
}

function openGapOutreachModal(gapType) {
  var labels = { di: 'Disability Insurance (47 clients)', ltc: 'LTC Coverage Gap (63 clients)', ret: 'Retirement Income Gap (38 clients)', est: 'Estate Planning (12 clients)', cnv: 'Term→Perm Conversion (8 clients)' };
  p7Toast('<i class="fas fa-bolt"></i> Outreach campaign for: ' + (labels[gapType] || gapType) + ' — AI drafting personalised letters…', 3500);
}

function openIDPModal(id) {
  p7Toast('<i class="fas fa-file-import"></i> Document Processing Center for ' + id + ' — upload, verify and track all policy documents', 2500);
}

function savePolicyChanges(policyId) {
  p7Toast('<i class="fas fa-save"></i> Policy ' + policyId + ' changes saved — pending supervisor approval', 3000);
}


/* ═══════════════════════════════════════════════════════════════════
   ALERTS PAGE — Enhanced actions (existing initAlertsPage kept)
   ═══════════════════════════════════════════════════════════════════ */

// No override needed — initAlertsPage() already defined and working


/* ═══════════════════════════════════════════════════════════════════
   UPSELL TRACK PAGE — Enhanced modal with 7-track view
   (existing openUpsellModal etc. are fully implemented, just augment)
   ═══════════════════════════════════════════════════════════════════ */

function openPremiumChangeModal() {
  var overlay = document.createElement('div');
  overlay.className = 'p7-modal-overlay';
  overlay.id = 'p7-premium-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = '<div class="p7m-modal" onclick="event.stopPropagation()">' +
    '<div class="p7m-header"><div class="p7m-title"><i class="fas fa-sliders-h"></i> Premium Change Impact Modeler</div><button class="p7m-close" onclick="document.getElementById(\'p7-premium-modal\').remove()"><i class="fas fa-times"></i></button></div>' +
    '<div class="p7m-body">' +
      '<div class="p7m-form-grid">' +
        '<div class="p7m-field"><label>Select Policy</label><select class="p7m-input" id="pm-policy-select" onchange="p7ModelPremiumChange()">' +
          '<option value="">— Select —</option><option>P-100301 · Patricia Nguyen · UL $400K</option><option>P-100291 · James Whitfield · WL $500K</option><option>P-100320 · Sandra Williams · Term $350K</option><option>P-100330 · Linda Morrison · WL $2M</option>' +
        '</select></div>' +
        '<div class="p7m-field"><label>Current Annual Premium</label><input class="p7m-input" id="pm-current" value="$5,800" readonly/></div>' +
        '<div class="p7m-field"><label>Proposed Change (%)</label><input class="p7m-input" id="pm-change" type="number" value="10" min="-50" max="100" oninput="p7ModelPremiumChange()"/></div>' +
        '<div class="p7m-field"><label>New Premium (modeled)</label><input class="p7m-input" id="pm-new" value="$6,380" readonly/></div>' +
        '<div class="p7m-field"><label>Cash Value Impact (10yr)</label><input class="p7m-input" id="pm-cv-impact" value="+$18,400 est." readonly/></div>' +
        '<div class="p7m-field"><label>Lapse Risk Change</label><input class="p7m-input" id="pm-lapse" value="87% → 42% (improves)" readonly/></div>' +
      '</div>' +
      '<div class="p7m-ai-note"><i class="fas fa-robot"></i> AI models premium changes against cash value projections, lapse probability, and long-term death benefit sustainability. Adjust % above to see real-time impact.</div>' +
    '</div>' +
    '<div class="p7m-footer">' +
      '<button class="p7m-btn primary" onclick="p7ApplyPremiumChange()"><i class="fas fa-check-circle"></i> Submit Premium Change</button>' +
      '<button class="p7m-btn ghost" onclick="document.getElementById(\'p7-premium-modal\').remove()">Cancel</button>' +
    '</div>' +
  '</div>';
  document.body.appendChild(overlay);
}

function p7ModelPremiumChange() {
  var changePct = parseFloat(document.getElementById('pm-change') ? document.getElementById('pm-change').value : 10) || 0;
  var base = 5800;
  var newPrem = Math.round(base * (1 + changePct / 100));
  var cvImpact = Math.round(changePct * 184);
  var newLapse = Math.max(5, 87 - Math.round(changePct * 1.8));
  var pmNew = document.getElementById('pm-new');
  var pmCV = document.getElementById('pm-cv-impact');
  var pmLapse = document.getElementById('pm-lapse');
  if (pmNew) pmNew.value = '$' + newPrem.toLocaleString();
  if (pmCV) pmCV.value = (cvImpact >= 0 ? '+' : '') + '$' + Math.abs(cvImpact).toLocaleString() + ' est.';
  if (pmLapse) pmLapse.value = '87% → ' + newLapse + '% ' + (newLapse < 87 ? '(improves)' : '(worsens)');
}

function p7ApplyPremiumChange() {
  p7Toast('<i class="fas fa-check-circle"></i> Premium change request submitted — pending client signature and supervisor approval', 4000);
  var m = document.getElementById('p7-premium-modal');
  if (m) m.remove();
}

function open1035Analyzer() {
  var overlay = document.createElement('div');
  overlay.className = 'p7-modal-overlay';
  overlay.id = 'p7-1035-modal';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  var candidates = [
    { client: 'Patricia Nguyen', initials: 'PN', policy: 'P-100301', from: 'Under-funded UL $400K', to: 'Participating WL $350K', surrender: '$21,400', newPremium: '$4,200/yr', benefit: 'Eliminate lapse risk, guaranteed cash value growth' },
    { client: 'Sandra Williams', initials: 'SW', policy: 'P-100320', from: 'Term Life $350K (expiring)', to: 'Whole Life $350K', surrender: 'N/A (term)', newPremium: '$6,200/yr', benefit: 'Convert before expiry — no new UW exam' },
    { client: 'James Whitfield', initials: 'JW', policy: 'P-100293', from: 'LTC Standalone $250K/yr benefit', to: 'Hybrid WL + LTC Rider', surrender: '$48,200', newPremium: '$8,400/yr', benefit: 'Single premium LTC + death benefit — simpler structure' }
  ];
  var rows = candidates.map(function(c) {
    return '<div class="p7-1035-card">' +
      '<div class="p7-1035-header">' +
        '<div class="p7-1035-avatar">' + c.initials + '</div>' +
        '<div><div class="p7-1035-client">' + c.client + ' · ' + c.policy + '</div><div class="p7-1035-from">' + c.from + '</div></div>' +
        '<i class="fas fa-arrow-right" style="color:#003087;margin:0 12px"></i>' +
        '<div class="p7-1035-to">' + c.to + '</div>' +
      '</div>' +
      '<div class="p7-1035-details">' +
        '<span>Surrender Value: <strong>' + c.surrender + '</strong></span>' +
        '<span>New Premium: <strong>' + c.newPremium + '</strong></span>' +
        '<span style="color:#059669"><i class="fas fa-check-circle"></i> ' + c.benefit + '</span>' +
      '</div>' +
      '<button class="p7m-btn primary" style="margin-top:10px" onclick="p7Initiate1035(\'' + c.policy + '\')"><i class="fas fa-random"></i> Initiate Exchange</button>' +
    '</div>';
  }).join('');
  overlay.innerHTML = '<div class="p7m-modal p7m-wide" onclick="event.stopPropagation()">' +
    '<div class="p7m-header"><div class="p7m-title"><i class="fas fa-random"></i> 1035 Exchange Analyzer — 3 Candidates Identified</div><button class="p7m-close" onclick="document.getElementById(\'p7-1035-modal\').remove()"><i class="fas fa-times"></i></button></div>' +
    '<div class="p7m-body">' +
      '<div class="p7m-ai-note" style="margin-bottom:16px"><i class="fas fa-robot"></i> A §1035 exchange allows tax-free transfer of cash value from one life insurance policy to another. No capital gains tax if structured correctly. Consult tax advisor for client-specific situations.</div>' +
      rows +
    '</div>' +
  '</div>';
  document.body.appendChild(overlay);
}

function p7Initiate1035(policyId) {
  p7Toast('<i class="fas fa-random"></i> 1035 Exchange initiated for ' + policyId + ' — exchange forms generated, compliance review required', 4000);
  var m = document.getElementById('p7-1035-modal');
  if (m) m.remove();
}


/* ═══════════════════════════════════════════════════════════════════
   NAVIGATETO BRANCHES — Add policies and claims page inits
   ═══════════════════════════════════════════════════════════════════ */

// Patch navigateTo to call initPoliciesPage on 'policies' nav
(function() {
  var _origNav = typeof navigateTo === 'function' ? navigateTo : null;
  if (!_origNav) return;
  navigateTo = function(page) {
    _origNav(page);
    if (page === 'policies') {
      requestAnimationFrame(function() { setTimeout(initPoliciesPage, 80); });
    }
  };
})();


/* ═══════════════════════════════════════════════════════════════════
   PHASE 7 TOAST HELPER
   ═══════════════════════════════════════════════════════════════════ */

function p7Toast(html, duration) {
  duration = duration || 3000;
  var existing = document.getElementById('p7-toast');
  if (existing) existing.remove();
  var t = document.createElement('div');
  t.id = 'p7-toast';
  t.className = 'p7-toast';
  t.innerHTML = html;
  document.body.appendChild(t);
  requestAnimationFrame(function() { t.classList.add('p7-toast-show'); });
  setTimeout(function() {
    t.classList.remove('p7-toast-show');
    setTimeout(function() { if (t.parentNode) t.parentNode.removeChild(t); }, 350);
  }, duration);
}

console.log('Phase 7 loaded — ServiceHub(' + p7ServiceRequests.length + ' requests), LoanCenter(' + p7LoanData.length + ' policies), Claims(' + Object.keys(p7ClaimsData).length + ' detailed), LapseEnhancement(' + _p7LapseEnhancement.length + '), OwnershipChange, 1035Analyzer, PremiumModeler all ready');
