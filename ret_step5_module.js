(function () {
  'use strict';
  console.log('RET Step 5 module loaded — Upsell Track Retirement upgrade path');

  // ── Retirement upsell data ────────────────────────────────────────────────
  var _retUpsellClients = [
    {
      id: 'RU-001', name: 'Alex Rivera', age: 34, status: 'prospect',
      track: 'missing', trackLabel: 'Not Started',
      potential: '$4,000/yr', priority: 'high',
      reason: 'No retirement products. Age 34 — ideal DCA accumulation window. 401(k) rollover opportunity: $85K from prior employer.',
      recommended: 'FIA + DIA ladder', premium: '$85,000',
      nextAction: 'Schedule retirement discovery call'
    },
    {
      id: 'RU-002', name: 'Patricia Nguyen', age: 38, status: 'client',
      track: 'gap', trackLabel: 'Enhance',
      potential: '$3,000/yr', priority: 'high',
      reason: 'Has deferred annuity illustration. No guaranteed income product. Gap: $1,200/mo at retirement.',
      recommended: 'DIA (income starting age 65)', premium: '$95,000',
      nextAction: 'Present DIA illustration — closes income gap'
    },
    {
      id: 'RU-003', name: 'James Whitfield', age: 52, status: 'client',
      track: 'gap', trackLabel: 'Confirm',
      potential: '$12,000/yr', priority: 'urgent',
      reason: 'VA contract active (ANN-JW-001). Income gap $2,300/mo. 13 years to retirement — optimal DIA window closing.',
      recommended: 'DIA tranche + GLWB rider', premium: '$180,000',
      nextAction: 'Run DIA illustration — present at next review'
    },
    {
      id: 'RU-004', name: 'Linda Morrison', age: 58, status: 'client',
      track: 'gap', trackLabel: 'Enhance',
      potential: '$8,000/yr', priority: 'high',
      reason: 'FIA in review (ANN-LM-001, $200K). Retires in 5 years. Gap: $2,400/mo. SPIA conversion at 63 closes gap entirely.',
      recommended: 'SPIA at age 63 (FIA conversion)', premium: '$200,000',
      nextAction: 'SPIA conversion illustration — present at FIA review'
    },
    {
      id: 'RU-005', name: 'David Thompson', age: 31, status: 'prospect',
      track: 'missing', trackLabel: 'Not Started',
      potential: '$2,500/yr', priority: 'medium',
      reason: 'New parent. No retirement savings. Young age — maximum compound growth potential. 529 plan opens door.',
      recommended: 'Roth-friendly FIA + DCA plan', premium: '$25,000',
      nextAction: 'Introduce retirement savings alongside 529 discussion'
    },
    {
      id: 'RU-006', name: 'Robert Chen', age: 55, status: 'client',
      track: 'present', trackLabel: 'Active',
      potential: '$0/yr', priority: 'low',
      reason: 'DIA illustration in progress (ANN-RC-001, $250K). Largest contract in book. Good standing.',
      recommended: 'Additional DIA tranche', premium: '$150,000',
      nextAction: 'Complete DIA illustration and close'
    },
    {
      id: 'RU-007', name: 'Maria Gonzalez', age: 71, status: 'client',
      track: 'present', trackLabel: 'Active',
      potential: '$0/yr', priority: 'urgent',
      reason: 'Contract ANN-MG-001 maturing Jun 15. 1035 exchange to new FIA preserves tax-deferred status.',
      recommended: '1035 Exchange to new FIA', premium: '$95,000',
      nextAction: 'Initiate 1035 exchange before Jun 15 deadline'
    },
    {
      id: 'RU-008', name: 'Kevin Park', age: 43, status: 'prospect',
      track: 'missing', trackLabel: 'Not Started',
      potential: '$5,000/yr', priority: 'medium',
      reason: 'Pending insurance application. No retirement discussion yet. Age 43 — strong accumulation candidate.',
      recommended: 'FIA (accumulation phase)', premium: '$60,000',
      nextAction: 'Add retirement to FNA discovery after insurance closes'
    }
  ];

  var _retUpsellFilter = 'all';
  var _retUpsellSearch = '';

  // ── Inject Retirement section into Upsell Track page ─────────────────────
  function _injectRetirementUpsellSection() {
    // Find the upsell page container
    var container = document.getElementById('upsell-ret-section');
    if (container) { _renderRetUpsellSection(container); return; }

    // If the Upsell page has a dynamic render, hook into it
    var upsellPage = document.querySelector('.upsell-page, [class*="upsell"]');
    if (!upsellPage) return;

    // Look for existing domain sections and append after
    var existing = upsellPage.querySelector('[data-domain="retirement"], .upsell-ret-section');
    if (existing) { _renderRetUpsellSection(existing); return; }
  }

  function _renderRetUpsellSection(container) {
    if (!container) return;
    var filtered = _getFilteredClients();
    container.innerHTML = _buildRetUpsellHTML(filtered);
  }

  function _getFilteredClients() {
    return _retUpsellClients.filter(function(c) {
      var matchFilter = _retUpsellFilter === 'all' || c.track === _retUpsellFilter ||
        (_retUpsellFilter === 'urgent' && c.priority === 'urgent');
      var matchSearch = !_retUpsellSearch ||
        c.name.toLowerCase().indexOf(_retUpsellSearch.toLowerCase()) > -1;
      return matchFilter && matchSearch;
    }).sort(function(a, b) {
      var p = { urgent: 0, high: 1, medium: 2, low: 3 };
      return p[a.priority] - p[b.priority];
    });
  }

  function _buildRetUpsellHTML(clients) {
    var totalPotential = _retUpsellClients
      .filter(function(c) { return c.track !== 'present'; })
      .reduce(function(s, c) { return s + (parseInt(c.potential.replace(/[^0-9]/g, '')) || 0); }, 0);
    var urgent = _retUpsellClients.filter(function(c) { return c.priority === 'urgent'; }).length;
    var missing = _retUpsellClients.filter(function(c) { return c.track === 'missing'; }).length;
    var gap = _retUpsellClients.filter(function(c) { return c.track === 'gap'; }).length;

    return '<div class="ret-upsell-header">' +
        '<div class="ret-upsell-title"><i class="fas fa-umbrella-beach"></i> Retirement Upgrade Track</div>' +
        '<div class="ret-upsell-kpis">' +
          _retUpsellKPI('$' + totalPotential.toLocaleString() + '/yr', 'Revenue Potential', '#003087') +
          _retUpsellKPI(urgent, 'Urgent Actions', '#dc2626') +
          _retUpsellKPI(missing, 'No Retirement Product', '#d97706') +
          _retUpsellKPI(gap, 'Gap to Close', '#0891b2') +
        '</div>' +
        '<div class="ret-upsell-filters">' +
          _retFilterPill('all', 'All Clients') +
          _retFilterPill('missing', '🔴 Not Started') +
          _retFilterPill('gap', '🟡 Gap / Enhance') +
          _retFilterPill('present', '🟢 Active') +
          _retFilterPill('urgent', '⚡ Urgent') +
        '</div>' +
      '</div>' +
      '<div class="ret-upsell-grid">' +
        clients.map(function(c) { return _retUpsellCard(c); }).join('') +
      '</div>';
  }

  function _retUpsellKPI(val, lbl, color) {
    return '<div class="ret-upsell-kpi"><div class="ret-upsell-kpi-val" style="color:' + color + '">' + val + '</div><div class="ret-upsell-kpi-lbl">' + lbl + '</div></div>';
  }

  function _retFilterPill(val, label) {
    var active = _retUpsellFilter === val ? ' active' : '';
    return '<button class="ret-filter-pill' + active + '" onclick="retUpsellSetFilter(\'' + val + '\',this)">' + label + '</button>';
  }

  function _retUpsellCard(c) {
    var trackCls = { missing: 'ret-track-missing', gap: 'ret-track-gap', present: 'ret-track-present' }[c.track] || '';
    var priCls   = { urgent: 'ret-pri-urgent', high: 'ret-pri-high', medium: 'ret-pri-medium', low: 'ret-pri-low' }[c.priority] || '';
    var statusBadge = c.status === 'prospect' ? '<span class="ret-status-badge prospect">Prospect</span>' : '<span class="ret-status-badge client">Client</span>';

    return '<div class="ret-upsell-card' + (c.priority === 'urgent' ? ' urgent' : '') + '">' +
      '<div class="ret-uc-header">' +
        '<div class="ret-uc-avatar">' + c.name.split(' ').map(function(w) { return w[0]; }).join('') + '</div>' +
        '<div class="ret-uc-info">' +
          '<div class="ret-uc-name">' + c.name + '</div>' +
          '<div class="ret-uc-meta">Age ' + c.age + ' · ' + statusBadge + '</div>' +
        '</div>' +
        '<div class="ret-uc-track ' + trackCls + '">' + c.trackLabel + '</div>' +
      '</div>' +
      '<div class="ret-uc-reason">' + c.reason + '</div>' +
      '<div class="ret-uc-rec">' +
        '<div class="ret-uc-rec-label">Recommended</div>' +
        '<div class="ret-uc-rec-product"><i class="fas fa-umbrella-beach"></i> ' + c.recommended + '</div>' +
        '<div class="ret-uc-rec-detail">Est. Premium: <strong>' + c.premium + '</strong> · Revenue: <strong>' + c.potential + '</strong></div>' +
      '</div>' +
      '<div class="ret-uc-footer">' +
        '<div class="ret-uc-next"><i class="fas fa-arrow-right"></i> ' + c.nextAction + '</div>' +
        '<button class="ret-uc-btn ' + priCls + '" onclick="retUpsellOpenAction(\'' + c.id + '\')">' +
          (c.priority === 'urgent' ? '<i class="fas fa-bolt"></i> Act Now' : '<i class="fas fa-calculator"></i> Illustrate') +
        '</button>' +
      '</div>' +
    '</div>';
  }

  // ── Global actions ────────────────────────────────────────────────────────
  window.retUpsellSetFilter = function(val, el) {
    _retUpsellFilter = val;
    document.querySelectorAll('.ret-filter-pill').forEach(function(b) { b.classList.remove('active'); });
    if (el) el.classList.add('active');
    var section = document.getElementById('upsell-ret-section');
    if (section) _renderRetUpsellSection(section);
  };

  window.retUpsellOpenAction = function(id) {
    var c = _retUpsellClients.find(function(x) { return x.id === id; });
    if (!c) return;
    alert('Opening action for ' + c.name + ':\n\n' + c.nextAction + '\n\nRecommended: ' + c.recommended + '\nEst. Premium: ' + c.premium);
  };

  // ── Monkey-patch navigateTo for upsell page ───────────────────────────────
  var _orig_nav_ret5 = navigateTo;
  navigateTo = function(page) {
    _orig_nav_ret5(page);
    if (page === 'upsell') {
      requestAnimationFrame(function() {
        setTimeout(function() {
          _injectRetUpsellIntoPage();
        }, 200);
      });
    }
  };

  function _injectRetUpsellIntoPage() {
    // Check if retirement section already injected
    if (document.getElementById('upsell-ret-section')) {
      _renderRetUpsellSection(document.getElementById('upsell-ret-section'));
      return;
    }

    // Find the upsell page and append a retirement section at the bottom
    var upsellContent = document.querySelector('.upsell-page') ||
                        document.querySelector('[class*="upsell-content"]') ||
                        document.getElementById('page-content');
    if (!upsellContent) return;

    var section = document.createElement('div');
    section.id = 'upsell-ret-section';
    section.className = 'ret-upsell-section';
    upsellContent.appendChild(section);
    _renderRetUpsellSection(section);
  }

  console.log('  RET Step 5 — Upsell Track retirement upgrade ready · ' + _retUpsellClients.length + ' clients');

})(); // 'RET Step 5 module loaded'
