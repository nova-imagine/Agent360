(function () {
  'use strict';
  console.log('RET Step 3 module loaded — Retirement Income Center');

  // ── Data ────────────────────────────────────────────────────────────────────
  var _ricClients = [
    {
      id: 'RIC-JW-001', name: 'James Whitfield', age: 52, retireAge: 65,
      yearsToRetire: 13, status: 'accumulating',
      monthlyGoal: 8500, monthlyProjected: 6200, monthlyGap: 2300,
      coveragePct: 73,
      sources: [
        { label: 'Social Security', monthly: 2100, color: '#6b7280', pct: 34 },
        { label: 'Annuity Income', monthly: 2800, color: '#003087', pct: 45 },
        { label: 'Investment RMDs', monthly: 900, color: '#0891b2', pct: 15 },
        { label: 'Pension', monthly: 400, color: '#059669', pct: 6 }
      ],
      contracts: ['ANN-JW-001'],
      aiNote: 'Adding a DIA now at age 52 locks current rates and covers the $2,300/mo gap at retirement. Recommend $180K premium for $2,400/mo income starting age 65.',
      priority: 'high'
    },
    {
      id: 'RIC-SW-001', name: 'Sandra Williams', age: 68, retireAge: 68,
      yearsToRetire: 0, status: 'distributing',
      monthlyGoal: 5500, monthlyProjected: 5500, monthlyGap: 0,
      coveragePct: 100,
      sources: [
        { label: 'Social Security', monthly: 2200, color: '#6b7280', pct: 40 },
        { label: 'SPIA Income', monthly: 1800, color: '#003087', pct: 33 },
        { label: 'Investment RMDs', monthly: 1100, color: '#0891b2', pct: 20 },
        { label: 'Part-time Work', monthly: 400, color: '#059669', pct: 7 }
      ],
      contracts: ['ANN-SW-001'],
      aiNote: 'Sandra\'s income plan is fully funded. Review SPIA beneficiary designation and confirm RMD schedule is optimized for tax efficiency.',
      priority: 'low'
    },
    {
      id: 'RIC-LM-001', name: 'Linda Morrison', age: 58, retireAge: 63,
      yearsToRetire: 5, status: 'accumulating',
      monthlyGoal: 9200, monthlyProjected: 6800, monthlyGap: 2400,
      coveragePct: 74,
      sources: [
        { label: 'Social Security', monthly: 2400, color: '#6b7280', pct: 35 },
        { label: 'FIA Income', monthly: 2800, color: '#003087', pct: 41 },
        { label: 'Investment RMDs', monthly: 1200, color: '#0891b2', pct: 18 },
        { label: 'Pension', monthly: 400, color: '#059669', pct: 6 }
      ],
      contracts: ['ANN-LM-001'],
      aiNote: 'Linda retires in 5 years with a $2,400/mo gap. FIA accumulation value is $200K — consider a SPIA conversion at age 63 to close the gap entirely.',
      priority: 'high'
    },
    {
      id: 'RIC-MG-001', name: 'Maria Gonzalez', age: 71, retireAge: 65,
      yearsToRetire: 0, status: 'rmd-required',
      monthlyGoal: 4800, monthlyProjected: 4400, monthlyGap: 400,
      coveragePct: 92,
      sources: [
        { label: 'Social Security', monthly: 1800, color: '#6b7280', pct: 41 },
        { label: 'Annuity RMDs', monthly: 1200, color: '#003087', pct: 27 },
        { label: 'Investment RMDs', monthly: 900, color: '#0891b2', pct: 20 },
        { label: 'Part-time Work', monthly: 500, color: '#059669', pct: 11 }
      ],
      contracts: ['ANN-MG-001'],
      aiNote: 'Contract ANN-MG-001 matures Jun 15 — RMD must be calculated before rollover. Recommend 1035 exchange to new FIA to maintain tax-deferred status and eliminate the $400/mo gap.',
      priority: 'urgent'
    },
    {
      id: 'RIC-RC-001', name: 'Robert Chen', age: 55, retireAge: 67,
      yearsToRetire: 12, status: 'accumulating',
      monthlyGoal: 12000, monthlyProjected: 7500, monthlyGap: 4500,
      coveragePct: 63,
      sources: [
        { label: 'Social Security', monthly: 2800, color: '#6b7280', pct: 37 },
        { label: 'DIA Income', monthly: 3200, color: '#003087', pct: 43 },
        { label: 'Investment RMDs', monthly: 1200, color: '#0891b2', pct: 16 },
        { label: 'Business Sale', monthly: 300, color: '#059669', pct: 4 }
      ],
      contracts: ['ANN-RC-001'],
      aiNote: 'Robert\'s $4,500/mo gap is the largest in the book. DIA illustration at $250K covers $3,200/mo starting 2037. Recommend additional $150K DIA tranche or bridge annuity to close remaining gap.',
      priority: 'high'
    },
    {
      id: 'RIC-DW-001', name: 'Dorothy Wilson', age: 72, retireAge: 67,
      yearsToRetire: 0, status: 'distributing',
      monthlyGoal: 4200, monthlyProjected: 4200, monthlyGap: 0,
      coveragePct: 100,
      sources: [
        { label: 'Social Security', monthly: 1900, color: '#6b7280', pct: 45 },
        { label: 'SPIA Income', monthly: 1400, color: '#003087', pct: 33 },
        { label: 'Investment RMDs', monthly: 700, color: '#0891b2', pct: 17 },
        { label: 'Rental Income', monthly: 200, color: '#059669', pct: 5 }
      ],
      contracts: ['ANN-DW-001'],
      aiNote: 'Dorothy\'s income is fully covered. Schedule annual review to confirm RMD compliance and beneficiary alignment. Consider inflation rider discussion.',
      priority: 'low'
    }
  ];

  var _ricFilter = '';
  var _ricSelectedId = null;

  // ── KPI Bar ──────────────────────────────────────────────────────────────────
  function _ricRenderKPIBar() {
    var el = document.getElementById('ric-kpi-bar');
    if (!el) return;
    var totalGoal = _ricClients.reduce(function(s, c) { return s + c.monthlyGoal; }, 0);
    var totalProjected = _ricClients.reduce(function(s, c) { return s + c.monthlyProjected; }, 0);
    var totalGap = _ricClients.reduce(function(s, c) { return s + c.monthlyGap; }, 0);
    var urgent = _ricClients.filter(function(c) { return c.priority === 'urgent'; }).length;
    var highPri = _ricClients.filter(function(c) { return c.priority === 'high'; }).length;
    var distributing = _ricClients.filter(function(c) { return c.status === 'distributing'; }).length;
    var accumulating = _ricClients.filter(function(c) { return c.status === 'accumulating'; }).length;
    var avgCoverage = Math.round(_ricClients.reduce(function(s, c) { return s + c.coveragePct; }, 0) / _ricClients.length);

    el.innerHTML =
      _ricKPI('ric-kpi-clients', 'fas fa-users', _ricClients.length, 'Retirement Clients', accumulating + ' accumulating') +
      _ricKPI('ric-kpi-goal', 'fas fa-bullseye', '$' + _fmt(totalGoal) + '/mo', 'Total Income Goal', 'across all clients') +
      _ricKPI('ric-kpi-projected', 'fas fa-chart-line', '$' + _fmt(totalProjected) + '/mo', 'Projected Income', avgCoverage + '% avg coverage') +
      _ricKPI('ric-kpi-gap', 'fas fa-exclamation-triangle', '$' + _fmt(totalGap) + '/mo', 'Total Income Gap', highPri + ' need action') +
      _ricKPI('ric-kpi-urgent', 'fas fa-fire', urgent, 'Urgent Actions', 'require immediate attention') +
      _ricKPI('ric-kpi-dist', 'fas fa-money-bill-wave', distributing, 'In Distribution', 'actively receiving income') +
      _ricKPI('ric-kpi-accum', 'fas fa-seedling', accumulating, 'Accumulating', 'building toward retirement') +
      _ricKPI('ric-kpi-coverage', 'fas fa-shield-alt', avgCoverage + '%', 'Avg Coverage', totalGap === 0 ? 'fully funded' : '$' + _fmt(totalGap) + '/mo gap remaining');
  }

  function _ricKPI(cls, icon, val, lbl, sub) {
    return '<div class="ric-kpi-card ' + cls + '">' +
      '<div class="ric-kpi-icon"><i class="' + icon + '"></i></div>' +
      '<div class="ric-kpi-text">' +
        '<div class="ric-kpi-val">' + val + '</div>' +
        '<div class="ric-kpi-lbl">' + lbl + '</div>' +
        '<div class="ric-kpi-sub">' + sub + '</div>' +
      '</div>' +
    '</div>';
  }

  // ── AI Banner ─────────────────────────────────────────────────────────────────
  function _ricRenderAIBanner() {
    var el = document.getElementById('ric-ai-banner');
    if (!el) return;
    var totalGap = _ricClients.reduce(function(s, c) { return s + c.monthlyGap; }, 0);
    el.innerHTML =
      '<div class="ric-ai-pulse-wrap"><div class="ric-ai-pulse"></div><span class="ric-ai-label">AI Income Planner</span></div>' +
      '<div class="ric-ai-msg"><strong>Income Gap Alert:</strong> 4 clients carry a combined <strong>$' + _fmt(totalGap) + '/mo</strong> retirement income gap. ' +
        'Robert Chen has the largest gap at <strong>$4,500/mo</strong>. Maria Gonzalez\'s maturing contract requires <strong>immediate action before Jun 15</strong>.</div>' +
      '<div class="ric-ai-actions">' +
        '<button class="ric-ai-btn primary" onclick="ricOpenGapReport()"><i class="fas fa-file-alt"></i> Full Gap Report</button>' +
        '<button class="ric-ai-btn ghost" onclick="ricOpenBatchIllustration()"><i class="fas fa-robot"></i> AI Batch Illustration</button>' +
      '</div>' +
      '<div class="ric-ai-stats">' +
        '<div class="ric-ai-stat"><div class="ric-ai-stat-val">$' + _fmt(totalGap) + '</div><div class="ric-ai-stat-lbl">Total Gap/mo</div></div>' +
        '<div class="ric-ai-stat"><div class="ric-ai-stat-val">4</div><div class="ric-ai-stat-lbl">Clients at Risk</div></div>' +
      '</div>';
  }

  // ── Client List ───────────────────────────────────────────────────────────────
  function ricRenderClientList() {
    var el = document.getElementById('ric-client-list');
    if (!el) return;
    var filtered = _ricFilter
      ? _ricClients.filter(function(c) {
          var q = _ricFilter.toLowerCase();
          return c.name.toLowerCase().indexOf(q) > -1 || c.status.indexOf(q) > -1;
        })
      : _ricClients;

    // Sort: urgent first, then high, then by gap desc
    filtered = filtered.slice().sort(function(a, b) {
      var p = { urgent: 0, high: 1, low: 2 };
      if (p[a.priority] !== p[b.priority]) return p[a.priority] - p[b.priority];
      return b.monthlyGap - a.monthlyGap;
    });

    el.innerHTML = '<div class="ric-list-header">RETIREMENT CLIENTS — ' + filtered.length + '</div>' +
      filtered.map(function(c) {
        var isActive = c.id === _ricSelectedId;
        var statusCls = { accumulating: 'ric-status-accum', distributing: 'ric-status-dist', 'rmd-required': 'ric-status-rmd' }[c.status] || '';
        var statusLabel = { accumulating: 'Accumulating', distributing: 'Distributing', 'rmd-required': 'RMD Required' }[c.status] || c.status;
        var bar = Math.min(100, c.coveragePct);
        var barColor = c.coveragePct >= 100 ? '#059669' : c.coveragePct >= 80 ? '#d97706' : '#dc2626';
        return '<div class="ric-client-card' + (isActive ? ' active' : '') + (c.priority === 'urgent' ? ' urgent' : '') +
          '" onclick="ricOpenClient(\'' + c.id + '\')">' +
          '<div class="ric-cc-top">' +
            '<span class="ric-cc-name">' + c.name + '</span>' +
            (c.priority === 'urgent' ? '<span class="ric-cc-urgent-badge">URGENT</span>' : '') +
          '</div>' +
          '<div class="ric-cc-mid">' +
            '<span class="ric-cc-age">Age ' + c.age + '</span>' +
            '<span class="ric-cc-status ' + statusCls + '">' + statusLabel + '</span>' +
          '</div>' +
          '<div class="ric-cc-coverage">' +
            '<div class="ric-cc-coverage-labels">' +
              '<span>Income Coverage</span><span style="font-weight:700;color:' + barColor + '">' + c.coveragePct + '%</span>' +
            '</div>' +
            '<div class="ric-cc-bar-bg"><div class="ric-cc-bar-fill" style="width:' + bar + '%;background:' + barColor + '"></div></div>' +
          '</div>' +
          '<div class="ric-cc-bot">' +
            '<span class="ric-cc-gap' + (c.monthlyGap > 0 ? ' has-gap' : '') + '">' +
              (c.monthlyGap > 0 ? '<i class="fas fa-exclamation-circle"></i> $' + _fmt(c.monthlyGap) + '/mo gap' : '<i class="fas fa-check-circle"></i> Fully Funded') +
            '</span>' +
            '<span class="ric-cc-goal">Goal: $' + _fmt(c.monthlyGoal) + '/mo</span>' +
          '</div>' +
        '</div>';
      }).join('');
  }

  // ── Client Detail ─────────────────────────────────────────────────────────────
  function ricOpenClient(id) {
    _ricSelectedId = id;
    ricRenderClientList();
    var c = _ricClients.find(function(x) { return x.id === id; });
    if (!c) return;

    var emptyEl = document.getElementById('ric-detail-empty');
    var panelEl = document.getElementById('ric-detail-panel');
    if (emptyEl) emptyEl.style.display = 'none';
    if (panelEl) { panelEl.style.display = 'block'; panelEl.innerHTML = _ricBuildDetailHTML(c); }
    ricSwitchTab('waterfall', panelEl.querySelector('.ric-tab-btn'));
  }

  function _ricBuildDetailHTML(c) {
    var statusLabel = { accumulating: 'Accumulating', distributing: 'Distributing', 'rmd-required': 'RMD Required' }[c.status] || c.status;
    var statusCls = { accumulating: 'ric-status-accum', distributing: 'ric-status-dist', 'rmd-required': 'ric-status-rmd' }[c.status] || '';
    var gapColor = c.monthlyGap > 0 ? '#dc2626' : '#059669';

    return '<div class="ric-detail-header">' +
        '<div class="ric-dh-left">' +
          '<div class="ric-dh-name">' + c.name + '</div>' +
          '<div class="ric-dh-meta">' +
            '<span class="ric-dh-id">' + c.id + '</span>' +
            '<span class="ric-cc-status ' + statusCls + '">' + statusLabel + '</span>' +
            '<span style="font-size:12px;color:#6b7280">Age ' + c.age + (c.yearsToRetire > 0 ? ' · Retires in ' + c.yearsToRetire + ' yrs' : ' · Retired') + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="ric-dh-right">' +
          '<button class="ric-action-btn secondary" onclick="ricRunIllustration(\'' + c.id + '\')"><i class="fas fa-calculator"></i> Illustration</button>' +
          '<button class="ric-action-btn warning" onclick="ricScheduleReview(\'' + c.id + '\')"><i class="fas fa-calendar-alt"></i> Schedule Review</button>' +
          '<button class="ric-action-btn primary" onclick="ricOpenProposal(\'' + c.id + '\')"><i class="fas fa-file-alt"></i> Income Proposal</button>' +
        '</div>' +
      '</div>' +
      '<div class="ric-tab-bar">' +
        _ricTabBtn('waterfall', 'fas fa-water', 'Income Waterfall', true) +
        _ricTabBtn('sources', 'fas fa-layer-group', 'Income Sources') +
        _ricTabBtn('projection', 'fas fa-chart-line', 'Projection') +
        _ricTabBtn('gap', 'fas fa-exclamation-triangle', 'Gap Analysis', false, c.monthlyGap > 0) +
        _ricTabBtn('rmd', 'fas fa-calendar-check', 'RMD Schedule') +
        _ricTabBtn('ai', 'fas fa-robot', 'AI Plan') +
      '</div>' +
      '<div id="ric-tab-waterfall" class="ric-tab-panel active">' + _ricTabWaterfall(c) + '</div>' +
      '<div id="ric-tab-sources"   class="ric-tab-panel">' + _ricTabSources(c) + '</div>' +
      '<div id="ric-tab-projection" class="ric-tab-panel">' + _ricTabProjection(c) + '</div>' +
      '<div id="ric-tab-gap"       class="ric-tab-panel">' + _ricTabGap(c) + '</div>' +
      '<div id="ric-tab-rmd"       class="ric-tab-panel">' + _ricTabRMD(c) + '</div>' +
      '<div id="ric-tab-ai"        class="ric-tab-panel">' + _ricTabAI(c) + '</div>';
  }

  function _ricTabBtn(key, icon, label, active, badge) {
    return '<button class="ric-tab-btn' + (active ? ' active' : '') + '" onclick="ricSwitchTab(\'' + key + '\', this)">' +
      '<i class="' + icon + '"></i> ' + label +
      (badge ? '<span class="ric-tab-badge">!</span>' : '') +
    '</button>';
  }

  function ricSwitchTab(key, el) {
    var panel = document.getElementById('ric-detail-panel');
    if (!panel) return;
    panel.querySelectorAll('.ric-tab-panel').forEach(function(p) { p.classList.remove('active'); });
    panel.querySelectorAll('.ric-tab-btn').forEach(function(b) { b.classList.remove('active'); });
    var target = document.getElementById('ric-tab-' + key);
    if (target) target.classList.add('active');
    if (el) el.classList.add('active');
  }

  // ── Tab: Income Waterfall ─────────────────────────────────────────────────────
  function _ricTabWaterfall(c) {
    var maxW = c.monthlyGoal;
    var rows = c.sources.map(function(s) {
      var pct = Math.round((s.monthly / maxW) * 100);
      return '<div class="ric-wfall-row">' +
        '<div class="ric-wfall-label">' + s.label + '</div>' +
        '<div class="ric-wfall-bar-bg">' +
          '<div class="ric-wfall-bar-fill" style="width:' + pct + '%;background:' + s.color + '">' +
            '<span class="ric-wfall-val">$' + _fmt(s.monthly) + '/mo</span>' +
          '</div>' +
        '</div>' +
        '<div class="ric-wfall-pct" style="color:' + s.color + '">' + s.pct + '%</div>' +
      '</div>';
    }).join('');

    var gapRow = c.monthlyGap > 0
      ? '<div class="ric-wfall-row ric-wfall-gap-row">' +
          '<div class="ric-wfall-label"><i class="fas fa-exclamation-triangle" style="color:#dc2626"></i> Income Gap</div>' +
          '<div class="ric-wfall-bar-bg">' +
            '<div class="ric-wfall-bar-fill" style="width:' + Math.round((c.monthlyGap / maxW) * 100) + '%;background:#fee2e2;border:1px dashed #dc2626">' +
              '<span class="ric-wfall-val" style="color:#dc2626">$' + _fmt(c.monthlyGap) + '/mo</span>' +
            '</div>' +
          '</div>' +
          '<div class="ric-wfall-pct" style="color:#dc2626">' + Math.round((c.monthlyGap / maxW) * 100) + '%</div>' +
        '</div>'
      : '<div class="ric-wfall-funded"><i class="fas fa-check-circle" style="color:#059669"></i> Income goal fully funded</div>';

    var coverageColor = c.coveragePct >= 100 ? '#059669' : c.coveragePct >= 80 ? '#d97706' : '#dc2626';

    return '<div class="ric-wfall-summary">' +
        '<div class="ric-wfall-sum-kpi">' +
          '<div class="ric-wfall-sum-val" style="color:' + coverageColor + '">' + c.coveragePct + '%</div>' +
          '<div class="ric-wfall-sum-lbl">Coverage</div>' +
        '</div>' +
        '<div class="ric-wfall-sum-kpi">' +
          '<div class="ric-wfall-sum-val">$' + _fmt(c.monthlyProjected) + '</div>' +
          '<div class="ric-wfall-sum-lbl">Projected/mo</div>' +
        '</div>' +
        '<div class="ric-wfall-sum-kpi">' +
          '<div class="ric-wfall-sum-val">$' + _fmt(c.monthlyGoal) + '</div>' +
          '<div class="ric-wfall-sum-lbl">Goal/mo</div>' +
        '</div>' +
        '<div class="ric-wfall-sum-kpi">' +
          '<div class="ric-wfall-sum-val" style="color:' + (c.monthlyGap > 0 ? '#dc2626' : '#059669') + '">' +
            (c.monthlyGap > 0 ? '-$' + _fmt(c.monthlyGap) : 'Funded') +
          '</div>' +
          '<div class="ric-wfall-sum-lbl">Gap/mo</div>' +
        '</div>' +
      '</div>' +
      '<div class="ric-section-title"><i class="fas fa-water"></i> Monthly Income Waterfall</div>' +
      '<div class="ric-wfall-chart">' + rows + gapRow + '</div>' +
      '<div class="ric-coverage-bar-wrap">' +
        '<div class="ric-coverage-label">' +
          '<span>Income Coverage</span>' +
          '<span style="font-weight:800;color:' + coverageColor + '">' + c.coveragePct + '% of $' + _fmt(c.monthlyGoal) + '/mo goal</span>' +
        '</div>' +
        '<div class="ric-coverage-bar-bg">' +
          '<div class="ric-coverage-bar-fill" style="width:' + Math.min(100, c.coveragePct) + '%;background:' + coverageColor + '"></div>' +
        '</div>' +
      '</div>';
  }

  // ── Tab: Income Sources ───────────────────────────────────────────────────────
  function _ricTabSources(c) {
    var rows = c.sources.map(function(s) {
      var annualAmt = s.monthly * 12;
      return '<tr>' +
        '<td><span class="ric-source-dot" style="background:' + s.color + '"></span>' + s.label + '</td>' +
        '<td style="text-align:right;font-weight:700">$' + _fmt(s.monthly) + '</td>' +
        '<td style="text-align:right">$' + _fmt(annualAmt) + '</td>' +
        '<td style="text-align:right">' +
          '<div style="display:flex;align-items:center;gap:6px;justify-content:flex-end">' +
            '<div style="width:60px;height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden">' +
              '<div style="width:' + s.pct + '%;height:100%;background:' + s.color + ';border-radius:4px"></div>' +
            '</div>' +
            '<span style="font-weight:600;color:' + s.color + '">' + s.pct + '%</span>' +
          '</div>' +
        '</td>' +
      '</tr>';
    }).join('');

    // SVG donut
    var total = c.sources.reduce(function(s, x) { return s + x.monthly; }, 0);
    var cx = 80, cy = 80, r = 60, strokeW = 20;
    var offset = 0;
    var arcs = c.sources.map(function(s) {
      var pct = s.monthly / total;
      var len = pct * 2 * Math.PI * r;
      var dash = len + ' ' + (2 * Math.PI * r - len);
      var arc = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + s.color + '" stroke-width="' + strokeW + '" ' +
        'stroke-dasharray="' + dash + '" stroke-dashoffset="' + (-offset * 2 * Math.PI * r) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>';
      offset += pct;
      return arc;
    }).join('');

    return '<div class="ric-sources-row">' +
        '<div class="ric-sources-donut">' +
          '<svg width="160" height="160" viewBox="0 0 160 160">' +
            arcs +
            '<text x="80" y="76" text-anchor="middle" font-size="18" font-weight="800" fill="#111827">$' + _fmt(total) + '</text>' +
            '<text x="80" y="94" text-anchor="middle" font-size="10" fill="#6b7280">/month</text>' +
          '</svg>' +
          '<div class="ric-donut-legend">' +
            c.sources.map(function(s) {
              return '<div class="ric-donut-legend-item"><span class="ric-donut-dot" style="background:' + s.color + '"></span>' + s.label + '</div>';
            }).join('') +
          '</div>' +
        '</div>' +
        '<div style="flex:1">' +
          '<div class="ric-section-title"><i class="fas fa-layer-group"></i> Income Source Breakdown</div>' +
          '<table class="ric-sources-table">' +
            '<thead><tr><th>Source</th><th style="text-align:right">Monthly</th><th style="text-align:right">Annual</th><th style="text-align:right">Share</th></tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
            '<tfoot><tr style="border-top:2px solid #e5e7eb">' +
              '<td style="font-weight:700">Total Projected</td>' +
              '<td style="text-align:right;font-weight:800;color:#003087">$' + _fmt(c.monthlyProjected) + '</td>' +
              '<td style="text-align:right;font-weight:800;color:#003087">$' + _fmt(c.monthlyProjected * 12) + '</td>' +
              '<td style="text-align:right;font-weight:700">' + c.coveragePct + '%</td>' +
            '</tr></tfoot>' +
          '</table>' +
        '</div>' +
      '</div>';
  }

  // ── Tab: Projection ───────────────────────────────────────────────────────────
  function _ricTabProjection(c) {
    var currentAge = c.age;
    var retireAge = c.retireAge;
    var endAge = Math.max(retireAge + 25, currentAge + 30);
    var rows = [];
    var bars = [];
    var maxIncome = c.monthlyGoal * 1.2;

    for (var age = currentAge; age <= Math.min(currentAge + 20, endAge); age += 5) {
      var yearsFromNow = age - currentAge;
      var isRetired = age >= retireAge;
      var growthFactor = isRetired ? 1 : Math.pow(1.06, yearsFromNow);
      var projected = isRetired ? c.monthlyProjected * Math.pow(1.02, age - retireAge) : c.monthlyProjected * growthFactor * 0.5;
      var goal = c.monthlyGoal;
      var barH = Math.round((projected / maxIncome) * 160);
      bars.push(
        '<div class="ric-proj-bar-group">' +
          '<div class="ric-proj-bar ' + (isRetired ? 'income' : 'accumulate') + '" style="height:' + barH + 'px" title="Age ' + age + ': $' + _fmt(Math.round(projected)) + '/mo"></div>' +
          '<div class="ric-proj-bar-lbl">Age ' + age + '</div>' +
        '</div>'
      );
      rows.push('<tr class="' + (age === retireAge ? 'highlight' : '') + '">' +
        '<td>Age ' + age + (age === retireAge ? ' ★' : '') + '</td>' +
        '<td style="text-align:right">$' + _fmt(Math.round(projected)) + '</td>' +
        '<td style="text-align:right">$' + _fmt(goal) + '</td>' +
        '<td style="text-align:right;color:' + (projected >= goal ? '#059669' : '#dc2626') + '">' +
          (projected >= goal ? '+$' + _fmt(Math.round(projected - goal)) : '-$' + _fmt(Math.round(goal - projected))) +
        '</td>' +
        '<td style="text-align:right;font-weight:700;color:' + (projected >= goal ? '#059669' : '#d97706') + '">' + Math.round((projected / goal) * 100) + '%</td>' +
      '</tr>');
    }

    return '<div class="ric-section-title"><i class="fas fa-chart-line"></i> 20-Year Income Projection</div>' +
      '<div class="ric-proj-legend">' +
        '<span><span class="ric-proj-dot accumulate"></span>Accumulation Phase</span>' +
        '<span><span class="ric-proj-dot income"></span>Distribution Phase</span>' +
        '<span style="font-size:11px;color:#6b7280">★ = Retirement Date (Age ' + retireAge + ')</span>' +
      '</div>' +
      '<div class="ric-proj-chart-wrap">' + bars.join('') + '</div>' +
      '<div class="ric-proj-table-wrap">' +
        '<table class="ric-proj-table">' +
          '<thead><tr><th>Age</th><th style="text-align:right">Projected</th><th style="text-align:right">Goal</th><th style="text-align:right">Surplus/Gap</th><th style="text-align:right">Coverage</th></tr></thead>' +
          '<tbody>' + rows.join('') + '</tbody>' +
        '</table>' +
      '</div>';
  }

  // ── Tab: Gap Analysis ─────────────────────────────────────────────────────────
  function _ricTabGap(c) {
    if (c.monthlyGap === 0) {
      return '<div class="ric-gap-funded">' +
        '<i class="fas fa-check-circle" style="font-size:48px;color:#059669;margin-bottom:12px"></i>' +
        '<div style="font-size:18px;font-weight:700;color:#111827">Income Goal Fully Funded</div>' +
        '<div style="font-size:13px;color:#6b7280;margin-top:6px">' + c.name + '\'s projected income meets the $' + _fmt(c.monthlyGoal) + '/mo retirement goal.</div>' +
        '<div class="ric-ai-card" style="margin-top:20px;max-width:500px">' +
          '<div class="ric-ai-card-title"><i class="fas fa-robot"></i> AI Recommendation</div>' +
          '<div class="ric-ai-card-body">' + c.aiNote + '</div>' +
        '</div>' +
      '</div>';
    }

    var annualGap = c.monthlyGap * 12;
    var lumpSumNeeded = Math.round(c.monthlyGap * 12 / 0.045); // 4.5% withdrawal rate
    var premiumNeeded = Math.round(lumpSumNeeded * 0.7); // rough annuity premium

    return '<div class="ric-gap-kpi-row">' +
        _ricGapKPI('$' + _fmt(c.monthlyGap) + '/mo', 'Monthly Gap', '#dc2626') +
        _ricGapKPI('$' + _fmt(annualGap) + '/yr', 'Annual Gap', '#dc2626') +
        _ricGapKPI('$' + _fmt(lumpSumNeeded), 'Lump Sum Needed', '#d97706') +
        _ricGapKPI('~$' + _fmt(premiumNeeded), 'Est. Annuity Premium', '#003087') +
      '</div>' +
      '<div class="ric-section-title" style="margin-top:16px"><i class="fas fa-lightbulb"></i> Solutions to Close the Gap</div>' +
      '<div class="ric-gap-solutions">' +
        _ricSolution('fas fa-lock', 'Deferred Income Annuity (DIA)', 'Premium: ~$' + _fmt(premiumNeeded),
          'Lock in today\'s rates with a DIA. Income begins at age ' + c.retireAge + ', guaranteed for life. Eliminates gap entirely.', '#003087', c.id, 'DIA') +
        _ricSolution('fas fa-chart-bar', 'Fixed Index Annuity (FIA)', 'Premium: ~$' + _fmt(Math.round(premiumNeeded * 1.3)),
          'Higher accumulation potential tied to index performance. Convert to income stream at retirement via GLWB rider.', '#0891b2', c.id, 'FIA') +
        _ricSolution('fas fa-money-bill-wave', 'SPIA at Retirement', 'Premium: ~$' + _fmt(Math.round(premiumNeeded * 0.9)),
          'Use accumulated assets to purchase a Single Premium Immediate Annuity at age ' + c.retireAge + '. Highest payout rate available.', '#059669', c.id, 'SPIA') +
      '</div>' +
      '<div class="ric-ai-card" style="margin-top:16px">' +
        '<div class="ric-ai-card-title"><i class="fas fa-robot"></i> AI Gap Analysis</div>' +
        '<div class="ric-ai-card-body">' + c.aiNote + '</div>' +
      '</div>';
  }

  function _ricGapKPI(val, lbl, color) {
    return '<div class="ric-gap-kpi-card"><div class="ric-gap-kpi-val" style="color:' + color + '">' + val + '</div><div class="ric-gap-kpi-lbl">' + lbl + '</div></div>';
  }

  function _ricSolution(icon, title, premium, desc, color, clientId, type) {
    return '<div class="ric-solution-card">' +
      '<div class="ric-solution-icon" style="background:' + color + '20;color:' + color + '"><i class="' + icon + '"></i></div>' +
      '<div class="ric-solution-body">' +
        '<div class="ric-solution-title">' + title + '</div>' +
        '<div class="ric-solution-premium">' + premium + '</div>' +
        '<div class="ric-solution-desc">' + desc + '</div>' +
      '</div>' +
      '<button class="ric-solution-btn" style="background:' + color + '" onclick="ricRunIllustration(\'' + clientId + '\',\'' + type + '\')">' +
        '<i class="fas fa-calculator"></i> Illustrate' +
      '</button>' +
    '</div>';
  }

  // ── Tab: RMD Schedule ─────────────────────────────────────────────────────────
  function _ricTabRMD(c) {
    var currentYear = 2026;
    var startRMDAge = 73; // SECURE 2.0
    var rmdStart = startRMDAge - c.age + currentYear;
    var rows = [];
    var balance = 95000 + (c.id === 'RIC-MG-001' ? 0 : 50000); // rough starting balance

    for (var yr = currentYear; yr <= currentYear + 10; yr++) {
      var age = c.age + (yr - currentYear);
      var isRMDYear = age >= startRMDAge;
      var divisor = Math.max(1, 27.4 - Math.max(0, age - 73)); // IRS Uniform Table simplified
      var rmd = isRMDYear ? Math.round(balance / divisor) : 0;
      var growth = isRMDYear ? 0.04 : 0.06;
      balance = Math.round((balance - rmd) * (1 + growth));
      rows.push('<tr class="' + (yr === currentYear && c.status === 'rmd-required' ? 'highlight' : '') + '">' +
        '<td>' + yr + '</td>' +
        '<td style="text-align:right">Age ' + age + '</td>' +
        '<td style="text-align:right">' + (isRMDYear ? '<span style="color:#dc2626;font-weight:700">Required</span>' : '<span style="color:#6b7280">Not Required</span>') + '</td>' +
        '<td style="text-align:right;font-weight:' + (isRMDYear ? '700' : 'normal') + ';color:' + (isRMDYear ? '#dc2626' : '#6b7280') + '">' +
          (isRMDYear ? '$' + _fmt(rmd) : '—') +
        '</td>' +
        '<td style="text-align:right">$' + _fmt(balance) + '</td>' +
      '</tr>');
    }

    return '<div class="ric-rmd-summary">' +
        '<div class="ric-rmd-kpi"><div class="ric-rmd-kpi-val">' + startRMDAge + '</div><div class="ric-rmd-kpi-lbl">RMD Start Age</div></div>' +
        '<div class="ric-rmd-kpi"><div class="ric-rmd-kpi-val">' + (rmdStart > currentYear ? rmdStart : 'Now') + '</div><div class="ric-rmd-kpi-lbl">First RMD Year</div></div>' +
        '<div class="ric-rmd-kpi"><div class="ric-rmd-kpi-val">' + (c.status === 'rmd-required' ? '<span style="color:#dc2626">Active</span>' : '<span style="color:#6b7280">Pending</span>') + '</div><div class="ric-rmd-kpi-lbl">RMD Status</div></div>' +
        '<button class="ric-action-btn primary" style="margin-left:auto" onclick="ricOpenRMDCalc(\'' + c.id + '\')"><i class="fas fa-calculator"></i> Full RMD Calc</button>' +
      '</div>' +
      '<div class="ric-section-title"><i class="fas fa-calendar-check"></i> RMD Schedule — 10 Year View</div>' +
      '<div class="ric-proj-table-wrap">' +
        '<table class="ric-proj-table">' +
          '<thead><tr><th>Year</th><th style="text-align:right">Age</th><th style="text-align:right">RMD Status</th><th style="text-align:right">Required Distribution</th><th style="text-align:right">Est. Balance</th></tr></thead>' +
          '<tbody>' + rows.join('') + '</tbody>' +
        '</table>' +
      '</div>' +
      (c.status === 'rmd-required'
        ? '<div class="ric-ai-card" style="margin-top:14px">' +
            '<div class="ric-ai-card-title"><i class="fas fa-exclamation-triangle" style="color:#d97706"></i> RMD Action Required</div>' +
            '<div class="ric-ai-card-body">RMD must be calculated and distributed before December 31, ' + currentYear + '. ' +
              'Failure to take RMD results in a <strong>25% excise tax</strong> on the shortfall. Schedule RMD calculation now.</div>' +
          '</div>'
        : '');
  }

  // ── Tab: AI Plan ──────────────────────────────────────────────────────────────
  function _ricTabAI(c) {
    var steps = [];
    if (c.monthlyGap > 0) {
      steps.push({ icon: 'fas fa-calculator', label: 'Run annuity illustration', detail: 'Quote ' + (c.yearsToRetire > 5 ? 'DIA' : 'SPIA') + ' to close $' + _fmt(c.monthlyGap) + '/mo gap', urgent: true });
      steps.push({ icon: 'fas fa-phone', label: 'Schedule income planning meeting', detail: 'Review retirement timeline and income strategy with client', urgent: true });
    }
    if (c.status === 'rmd-required') {
      steps.push({ icon: 'fas fa-calendar-check', label: 'Calculate and process RMD', detail: 'Required before Dec 31, 2026 — avoid 25% excise tax', urgent: true });
    }
    steps.push({ icon: 'fas fa-file-alt', label: 'Generate income proposal', detail: 'Document current sources, gap, and recommended solution', urgent: false });
    steps.push({ icon: 'fas fa-users', label: 'Review beneficiary designations', detail: 'Confirm all annuity contracts have up-to-date beneficiaries', urgent: false });
    steps.push({ icon: 'fas fa-shield-alt', label: 'Confirm suitability documentation', detail: 'Update suitability profile for any new product recommendations', urgent: false });

    return '<div class="ric-ai-card">' +
        '<div class="ric-ai-card-title"><i class="fas fa-robot"></i> AI Income Plan — ' + c.name + '</div>' +
        '<div class="ric-ai-card-body">' + c.aiNote + '</div>' +
      '</div>' +
      '<div class="ric-section-title" style="margin-top:16px"><i class="fas fa-tasks"></i> Recommended Action Plan</div>' +
      '<div class="ric-ai-steps">' +
        steps.map(function(s, i) {
          return '<div class="ric-ai-step' + (s.urgent ? ' urgent' : '') + '">' +
            '<div class="ric-ai-step-num' + (s.urgent ? ' urgent' : '') + '">' + (i + 1) + '</div>' +
            '<div class="ric-ai-step-icon"><i class="' + s.icon + '"></i></div>' +
            '<div class="ric-ai-step-body">' +
              '<div class="ric-ai-step-label">' + s.label + (s.urgent ? ' <span class="ric-urgent-chip">Urgent</span>' : '') + '</div>' +
              '<div class="ric-ai-step-detail">' + s.detail + '</div>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<div style="display:flex;gap:10px;margin-top:16px">' +
        '<button class="ric-action-btn primary" onclick="ricOpenProposal(\'' + c.id + '\')"><i class="fas fa-file-alt"></i> Generate Income Proposal</button>' +
        '<button class="ric-action-btn secondary" onclick="ricScheduleReview(\'' + c.id + '\')"><i class="fas fa-calendar-alt"></i> Schedule Review</button>' +
      '</div>';
  }

  // ── Global action stubs ───────────────────────────────────────────────────────
  window.ricRenderClientList  = ricRenderClientList;
  window.ricOpenClient        = ricOpenClient;
  window.ricSwitchTab         = ricSwitchTab;
  window.ricFilterClients     = function(q) { _ricFilter = q; ricRenderClientList(); };
  window.ricOpenGapReport     = function() { alert('AI Gap Report — generating PDF for all 4 clients with income gaps…'); };
  window.ricOpenBatchIllustration = function() { alert('AI Batch Illustration — running illustrations for James Whitfield, Linda Morrison, Maria Gonzalez, Robert Chen…'); };
  window.ricRunIllustration   = function(id, type) { alert('Running ' + (type || 'annuity') + ' illustration for ' + id + '…'); };
  window.ricScheduleReview    = function(id) { alert('Opening calendar to schedule income review for ' + id + '…'); };
  window.ricOpenProposal      = function(id) { alert('Generating Retirement Income Proposal for ' + id + '…'); };
  window.ricOpenRMDCalc       = function(id) { alert('Opening RMD Calculator for ' + id + '…'); };

  // ── Page init ─────────────────────────────────────────────────────────────────
  function initRetIncomePage() {
    _ricRenderKPIBar();
    _ricRenderAIBanner();
    ricRenderClientList();
    // Auto-open Maria Gonzalez (urgent RMD)
    setTimeout(function() { ricOpenClient('RIC-MG-001'); }, 120);
  }

  // ── navigateTo monkey-patch ───────────────────────────────────────────────────
  var _orig_navigateTo_ric = navigateTo;
  navigateTo = function(page) {
    _orig_navigateTo_ric(page);
    if (page === 'ret-income') {
      requestAnimationFrame(function() {
        setTimeout(function() {
          var t = document.getElementById('page-title');
          var b = document.getElementById('page-breadcrumb');
          if (t) t.textContent = 'Retirement Income Center';
          if (b) b.textContent = 'Retirement / Income Center';
          initRetIncomePage();
        }, 80);
      });
    }
  };

  // ── Helper ────────────────────────────────────────────────────────────────────
  function _fmt(n) {
    return Number(n).toLocaleString();
  }

  console.log('  RET Step 3 — Retirement Income Center ready');
  console.log('  Clients: ' + _ricClients.length + ' · Total gap: $' +
    _fmt(_ricClients.reduce(function(s, c) { return s + c.monthlyGap; }, 0)) + '/mo');

})(); // 'RET Step 3 module loaded'
