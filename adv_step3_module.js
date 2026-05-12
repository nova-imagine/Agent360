(function() {
  'use strict';

  // ── ADV Step 3: Advisory Proposals page ──────────────────────────────────────
  // Fee-based planning proposals with status workflow, 5 proposals, detail panel

  var _advProposals = [
    {
      id: 'PROP-001', client: 'Robert Chen', age: 55,
      type: 'Comprehensive Wealth Plan', status: 'pending-review', priority: 'urgent',
      fee: 19260, feeType: 'AUM 0.90%', aum: 2140000,
      created: '2025-04-28', expires: '2025-05-28',
      advisor: 'Sridhar R',
      scope: ['Retirement Planning', 'Business Succession', 'Estate Plan', 'Risk Management', 'Tax Strategy'],
      summary: 'Full comprehensive plan addressing 5-year retirement timeline, business buyout strategy, and estate restructuring for $2.14M AUM client. Includes DIA ladder recommendation and key-man insurance.',
      nextAction: 'Client signature required by May 28',
      aiScore: 94
    },
    {
      id: 'PROP-002', client: 'Linda Morrison', age: 58,
      type: 'Pre-Retirement Optimization', status: 'draft', priority: 'high',
      fee: 14220, feeType: 'AUM 0.90%', aum: 1580000,
      created: '2025-05-01', expires: '2025-06-01',
      advisor: 'Sridhar R',
      scope: ['Retirement Income', 'Estate Plan Update', 'Debt Elimination', 'FIA Strategy'],
      summary: 'Pre-retirement optimization for 5-year glide path to age 63. Focuses on debt elimination, 403(b) catch-up maximization, and FIA conversion strategy for guaranteed income.',
      nextAction: 'Finalize estate attorney referral before sending',
      aiScore: 81
    },
    {
      id: 'PROP-003', client: 'James Whitfield', age: 52,
      type: 'Retirement & College Funding Plan', status: 'sent', priority: 'high',
      fee: 8420, feeType: 'AUM 1.00%', aum: 842000,
      created: '2025-04-15', expires: '2025-05-15',
      advisor: 'Sridhar R',
      scope: ['Retirement Savings Acceleration', 'College 529 Review', 'DIA Recommendation'],
      summary: 'Dual-focus plan addressing retirement gap and college funding for two children. Recommends 401(k) max catch-up, DIA at age 62, and 529 rebalancing.',
      nextAction: 'Follow up — sent 14 days ago, no response',
      aiScore: 77
    },
    {
      id: 'PROP-004', client: 'Sandra Williams', age: 68,
      type: 'RMD & Roth Conversion Strategy', status: 'accepted', priority: 'low',
      fee: 11160, feeType: 'AUM 0.90%', aum: 1240000,
      created: '2025-03-20', expires: '2025-06-20',
      advisor: 'Sridhar R',
      scope: ['RMD Planning', 'Roth Conversion', 'Legacy Strategy', 'IRMAA Management'],
      summary: 'Annual advisory engagement covering 2025 RMD of $47,320, strategic $30K Roth conversion, and legacy planning for 3 children. IRMAA threshold monitoring included.',
      nextAction: 'Implementation in progress — Roth conversion scheduled Q2',
      aiScore: 92
    },
    {
      id: 'PROP-005', client: 'Maria Gonzalez', age: 71,
      type: 'Estate & Distribution Review', status: 'pending-review', priority: 'urgent',
      fee: 9200, feeType: 'AUM 1.00%', aum: 920000,
      created: '2025-05-05', expires: '2025-06-05',
      advisor: 'Sridhar R',
      scope: ['RMD + QCD Strategy', 'FIA Maturity Action', 'Beneficiary Update', 'IRMAA Planning'],
      summary: 'Urgent review triggered by FIA contract maturing Jun 15. Includes RMD of $38,760, QCD of $5,000 for charitable goal, beneficiary designation review for 4 grandchildren.',
      nextAction: 'FIA maturity decision required BEFORE Jun 15 — urgent',
      aiScore: 88
    }
  ];

  var _propSelectedId = null;

  var STATUS_META = {
    'draft':          { label: 'Draft',          color: '#64748b', bg: 'rgba(100,116,139,.15)' },
    'pending-review': { label: 'Pending Review', color: '#f59e0b', bg: 'rgba(245,158,11,.15)'  },
    'sent':           { label: 'Sent',            color: '#0ea5e9', bg: 'rgba(14,165,233,.15)'  },
    'accepted':       { label: 'Accepted',        color: '#10b981', bg: 'rgba(16,185,129,.15)'  },
    'declined':       { label: 'Declined',        color: '#ef4444', bg: 'rgba(239,68,68,.15)'   }
  };

  function _propRenderKPIBar() {
    var el = document.getElementById('prop-kpi-bar');
    if (!el) return;
    var totalFees    = _advProposals.reduce(function(s,p){ return s + p.fee; }, 0);
    var accepted     = _advProposals.filter(function(p){ return p.status === 'accepted'; }).length;
    var pending      = _advProposals.filter(function(p){ return p.status === 'pending-review'; }).length;
    var sent         = _advProposals.filter(function(p){ return p.status === 'sent'; }).length;
    var avgScore     = Math.round(_advProposals.reduce(function(s,p){ return s + p.aiScore; }, 0) / _advProposals.length);
    var totalAUM     = _advProposals.reduce(function(s,p){ return s + p.aum; }, 0);

    el.innerHTML = [
      ['fas fa-file-contract', '#0ea5e9', _advProposals.length, 'TOTAL PROPOSALS', '5 clients'],
      ['fas fa-dollar-sign',   '#10b981', '$' + Math.round(totalFees/1000) + 'K', 'ANNUAL FEES', 'if all accepted'],
      ['fas fa-check-circle',  '#10b981', accepted, 'ACCEPTED', 'active engagement'],
      ['fas fa-clock',         '#f59e0b', pending,  'PENDING REVIEW', 'awaiting decision'],
      ['fas fa-paper-plane',   '#0ea5e9', sent,     'SENT TO CLIENT', 'follow-up needed'],
      ['fas fa-robot',         '#8b5cf6', avgScore, 'AVG AI SCORE', 'proposal quality'],
      ['fas fa-chart-bar',     '#06b6d4', '$' + (totalAUM/1000000).toFixed(1) + 'M', 'TOTAL AUM', 'under proposal']
    ].map(function(k) {
      return '<div class="prop-kpi-card">' +
        '<div class="prop-kpi-icon" style="color:' + k[1] + '"><i class="' + k[0] + '"></i></div>' +
        '<div class="prop-kpi-body"><div class="prop-kpi-val">' + k[2] + '</div>' +
        '<div class="prop-kpi-label">' + k[3] + '</div>' +
        '<div class="prop-kpi-sub">' + k[4] + '</div></div>' +
      '</div>';
    }).join('');
  }

  function _propRenderList() {
    var el = document.getElementById('prop-list');
    if (!el) return;
    el.innerHTML = _advProposals.map(function(p) {
      var sm = STATUS_META[p.status] || STATUS_META['draft'];
      var isSelected = p.id === _propSelectedId;
      var priorityDot = {urgent:'#ef4444',high:'#f59e0b',medium:'#0ea5e9',low:'#10b981'}[p.priority]||'#6b7280';
      return '<div class="prop-card' + (isSelected?' prop-selected':'') + '" onclick="propOpenDetail(\'' + p.id + '\')">' +
        '<div class="prop-card-top">' +
          '<div class="prop-card-avatar">' + p.client.split(' ').map(function(n){return n[0];}).join('') + '</div>' +
          '<div class="prop-card-info">' +
            '<div class="prop-card-client">' + p.client + '</div>' +
            '<div class="prop-card-type">' + p.type + '</div>' +
          '</div>' +
          '<span class="prop-status-badge" style="background:' + sm.bg + ';color:' + sm.color + '">' + sm.label + '</span>' +
        '</div>' +
        '<div class="prop-card-meta">' +
          '<span>$' + p.fee.toLocaleString() + '/yr · ' + p.feeType + '</span>' +
          '<span style="color:' + priorityDot + '">' + p.priority.toUpperCase() + '</span>' +
        '</div>' +
        '<div class="prop-card-action">' +
          '<i class="fas fa-exclamation-circle" style="color:' + priorityDot + ';font-size:10px"></i> ' + p.nextAction +
        '</div>' +
        '<div class="prop-ai-score">' +
          '<div class="prop-ai-score-bar-wrap"><div class="prop-ai-score-bar" style="width:' + p.aiScore + '%;background:' + (p.aiScore>=85?'#10b981':p.aiScore>=70?'#f59e0b':'#ef4444') + '"></div></div>' +
          '<span>AI ' + p.aiScore + '</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function propOpenDetail(id) {
    _propSelectedId = id;
    _propRenderList();
    var p = _advProposals.find(function(x){ return x.id === id; });
    if (!p) return;
    var el = document.getElementById('prop-detail-empty');
    var panel = document.getElementById('prop-detail-panel');
    if (el) el.style.display = 'none';
    if (!panel) return;
    panel.style.display = 'block';
    var sm = STATUS_META[p.status] || STATUS_META['draft'];
    panel.innerHTML =
      '<div class="prop-detail-header">' +
        '<div class="prop-dh-left">' +
          '<div class="prop-dh-avatar">' + p.client.split(' ').map(function(n){return n[0];}).join('') + '</div>' +
          '<div>' +
            '<div class="prop-dh-client">' + p.client + ' <span style="font-size:12px;color:#64748b">Age ' + p.age + '</span></div>' +
            '<div class="prop-dh-type">' + p.type + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="prop-dh-right">' +
          '<span class="prop-status-badge" style="background:' + sm.bg + ';color:' + sm.color + ';font-size:12px;padding:5px 14px">' + sm.label + '</span>' +
          '<div class="prop-dh-fee">$' + p.fee.toLocaleString() + '<span style="font-size:11px;color:#64748b">/yr</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="prop-detail-body">' +
        '<div class="prop-detail-grid">' +
          _propDetailCard('Proposal ID', p.id) +
          _propDetailCard('AUM Under Management', '$' + (p.aum/1000).toFixed(0) + 'K') +
          _propDetailCard('Fee Type', p.feeType) +
          _propDetailCard('Created', p.created) +
          _propDetailCard('Expires', p.expires) +
          _propDetailCard('AI Quality Score', p.aiScore + ' / 100') +
        '</div>' +
        '<div class="prop-detail-section">' +
          '<div class="prop-ds-title">Scope of Engagement</div>' +
          '<div class="prop-scope-chips">' +
            p.scope.map(function(s){ return '<span class="prop-scope-chip">' + s + '</span>'; }).join('') +
          '</div>' +
        '</div>' +
        '<div class="prop-detail-section">' +
          '<div class="prop-ds-title">Plan Summary</div>' +
          '<div class="prop-summary-text">' + p.summary + '</div>' +
        '</div>' +
        '<div class="prop-detail-section prop-urgent-action">' +
          '<div class="prop-ds-title"><i class="fas fa-bolt"></i> Next Action</div>' +
          '<div class="prop-next-action-text">' + p.nextAction + '</div>' +
        '</div>' +
        '<div class="prop-detail-actions">' +
          '<button class="prop-action-btn prop-action-primary"><i class="fas fa-paper-plane"></i> Send to Client</button>' +
          '<button class="prop-action-btn prop-action-secondary"><i class="fas fa-edit"></i> Edit Proposal</button>' +
          '<button class="prop-action-btn prop-action-secondary"><i class="fas fa-file-pdf"></i> Export PDF</button>' +
          '<button class="prop-action-btn prop-action-secondary"><i class="fas fa-calendar-plus"></i> Book Review</button>' +
        '</div>' +
      '</div>';
  }

  function _propDetailCard(label, val) {
    return '<div class="prop-dc-card"><div class="prop-dc-label">' + label + '</div><div class="prop-dc-val">' + val + '</div></div>';
  }

  function initAdvProposalsPage() {
    _propRenderKPIBar();
    _propRenderList();
    setTimeout(function() { propOpenDetail('PROP-001'); }, 120);
  }

  var _orig_nav_adv3 = navigateTo;
  navigateTo = function(page) {
    _orig_nav_adv3(page);
    if (page === 'adv-proposals') {
      requestAnimationFrame(function() {
        setTimeout(function() {
          var t = document.getElementById('page-title');
          var b = document.getElementById('page-breadcrumb');
          if (t) t.textContent = 'Advisory Proposals';
          if (b) b.textContent = 'Advisory / Proposals';
          initAdvProposalsPage();
        }, 80);
      });
    }
  };

  console.log('ADV Step 3 module loaded');
})();
