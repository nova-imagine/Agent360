(function() {
  'use strict';

  // ── ADV Step 1: Financial Plans page ────────────────────────────────────────
  // 6 clients, 6-tab detail panel (Summary · Goals · Cash Flow · Assets · Risk · AI)
  // KPI bar, AI banner, client list with plan health score

  var _advClients = [
    {
      id: 'ADV-JW-001', name: 'James Whitfield', age: 52,
      planType: 'Comprehensive', status: 'active', priority: 'high',
      healthScore: 74, lastReview: '2025-03-10', nextReview: '2025-06-10',
      aum: 842000, annualFee: 8420, feeType: 'AUM-based',
      goals: [
        { label: 'Retire at 62', progress: 58, target: 2200000, current: 842000, onTrack: false },
        { label: 'College Fund (2 kids)', progress: 82, target: 120000, current: 98400, onTrack: true },
        { label: 'Vacation Home', progress: 31, target: 450000, current: 139500, onTrack: false }
      ],
      cashFlow: { monthlyIncome: 14200, monthlyExpenses: 9800, monthlySavings: 4400, savingsRate: 31 },
      assets: [
        { label: '401(k)', value: 420000, pct: 50, color: '#0ea5e9' },
        { label: 'Brokerage', value: 215000, pct: 26, color: '#8b5cf6' },
        { label: 'Annuity (VA)', value: 150000, pct: 18, color: '#f59e0b' },
        { label: 'Cash/MM', value: 57000, pct: 6, color: '#10b981' }
      ],
      risk: { score: 7, label: 'Growth', equity: 72, fixed: 20, alt: 8 },
      aiInsight: 'James is 26% behind his retirement goal. Recommend increasing 401(k) contribution to max ($30,500 at age 52) and converting $80K brokerage holdings to a DIA starting at age 62. College fund is on track — no action needed.'
    },
    {
      id: 'ADV-SW-001', name: 'Sandra Williams', age: 68,
      planType: 'Retirement Distribution', status: 'distributing', priority: 'urgent',
      healthScore: 91, lastReview: '2025-04-02', nextReview: '2025-07-02',
      aum: 1240000, annualFee: 11160, feeType: 'AUM-based',
      goals: [
        { label: 'Sustain $7K/mo income', progress: 97, target: 7000, current: 6800, onTrack: true },
        { label: 'Legacy to 3 children', progress: 88, target: 500000, current: 440000, onTrack: true },
        { label: 'LTC Reserve', progress: 72, target: 200000, current: 144000, onTrack: true }
      ],
      cashFlow: { monthlyIncome: 9200, monthlyExpenses: 6800, monthlySavings: 2400, savingsRate: 26 },
      assets: [
        { label: 'IRA (Trad)', value: 680000, pct: 55, color: '#0ea5e9' },
        { label: 'SPIA Income', value: 220000, pct: 18, color: '#10b981' },
        { label: 'Brokerage', value: 240000, pct: 19, color: '#8b5cf6' },
        { label: 'Cash/MM', value: 100000, pct: 8, color: '#f59e0b' }
      ],
      risk: { score: 4, label: 'Conservative', equity: 35, fixed: 55, alt: 10 },
      aiInsight: 'Sandra\'s plan is performing well. RMD for 2025 is $47,320 — schedule distribution by Dec 15. Consider a Roth conversion of $30K this year while in the 22% bracket before RMDs push her to 24%. Legacy goal on track.'
    },
    {
      id: 'ADV-LM-001', name: 'Linda Morrison', age: 58,
      planType: 'Pre-Retirement', status: 'active', priority: 'high',
      healthScore: 68, lastReview: '2025-02-18', nextReview: '2025-05-18',
      aum: 1580000, annualFee: 14220, feeType: 'AUM-based',
      goals: [
        { label: 'Retire at 63', progress: 71, target: 3100000, current: 1580000, onTrack: false },
        { label: 'Debt-free by 60', progress: 60, target: 0, current: 87000, onTrack: false },
        { label: 'Estate Plan Update', progress: 45, target: 100, current: 45, onTrack: false }
      ],
      cashFlow: { monthlyIncome: 18500, monthlyExpenses: 12400, monthlySavings: 6100, savingsRate: 33 },
      assets: [
        { label: '403(b)', value: 780000, pct: 49, color: '#0ea5e9' },
        { label: 'FIA Annuity', value: 200000, pct: 13, color: '#f59e0b' },
        { label: 'Real Estate', value: 420000, pct: 27, color: '#ef4444' },
        { label: 'Brokerage', value: 180000, pct: 11, color: '#8b5cf6' }
      ],
      risk: { score: 6, label: 'Moderate Growth', equity: 62, fixed: 28, alt: 10 },
      aiInsight: 'Linda needs $1.52M more to retire comfortably at 63. Recommend accelerating 403(b) contributions ($30,500/yr catch-up) and exploring a 1031 exchange on the real estate to rebalance into income-producing assets. Estate plan is overdue — refer to estate attorney.'
    },
    {
      id: 'ADV-MG-001', name: 'Maria Gonzalez', age: 71,
      planType: 'Estate & Distribution', status: 'rmd-required', priority: 'urgent',
      healthScore: 88, lastReview: '2025-04-15', nextReview: '2025-07-15',
      aum: 920000, annualFee: 9200, feeType: 'AUM-based',
      goals: [
        { label: 'Monthly income $4,800', progress: 92, target: 4800, current: 4400, onTrack: true },
        { label: 'Estate to 4 grandchildren', progress: 78, target: 400000, current: 312000, onTrack: true },
        { label: 'Charitable giving $5K/yr', progress: 100, target: 5000, current: 5000, onTrack: true }
      ],
      cashFlow: { monthlyIncome: 7100, monthlyExpenses: 4900, monthlySavings: 2200, savingsRate: 31 },
      assets: [
        { label: 'IRA (Trad)', value: 510000, pct: 55, color: '#0ea5e9' },
        { label: 'Fixed Annuity', value: 95000, pct: 10, color: '#f59e0b' },
        { label: 'Brokerage', value: 215000, pct: 23, color: '#8b5cf6' },
        { label: 'Cash/MM', value: 100000, pct: 12, color: '#10b981' }
      ],
      risk: { score: 3, label: 'Conservative', equity: 28, fixed: 62, alt: 10 },
      aiInsight: 'Maria\'s RMD of $38,760 is due — FIA contract matures Jun 15, requires immediate action. Recommend QCD of $5,000 to satisfy charitable goal and reduce taxable RMD. Consider IRMAA planning for Medicare Part B (income just below threshold).'
    },
    {
      id: 'ADV-RC-001', name: 'Robert Chen', age: 55,
      planType: 'Comprehensive', status: 'active', priority: 'high',
      healthScore: 62, lastReview: '2025-01-22', nextReview: '2025-04-22',
      aum: 2140000, annualFee: 19260, feeType: 'AUM-based',
      goals: [
        { label: 'Retire at 60 — $12K/mo', progress: 54, target: 4800000, current: 2140000, onTrack: false },
        { label: 'Business succession', progress: 25, target: 100, current: 25, onTrack: false },
        { label: 'Protect $2M estate', progress: 89, target: 2000000, current: 1780000, onTrack: true }
      ],
      cashFlow: { monthlyIncome: 28000, monthlyExpenses: 16000, monthlySavings: 12000, savingsRate: 43 },
      assets: [
        { label: '401(k)/SEP', value: 980000, pct: 46, color: '#0ea5e9' },
        { label: 'Business Equity', value: 650000, pct: 30, color: '#ef4444' },
        { label: 'DIA Annuity', value: 250000, pct: 12, color: '#f59e0b' },
        { label: 'Brokerage', value: 260000, pct: 12, color: '#8b5cf6' }
      ],
      risk: { score: 8, label: 'Aggressive Growth', equity: 80, fixed: 12, alt: 8 },
      aiInsight: 'Robert is significantly behind for a 60-retirement. Gap is $2.66M over 5 years — requires $44K/mo savings vs. current $12K. Recommend business succession planning with buy-sell agreement, key-man life insurance, and converting business equity into diversified assets over 3-year glide path.'
    },
    {
      id: 'ADV-DW-001', name: 'Dorothy Wilson', age: 72,
      planType: 'Legacy & Distribution', status: 'distributing', priority: 'low',
      healthScore: 95, lastReview: '2025-04-28', nextReview: '2025-07-28',
      aum: 680000, annualFee: 6120, feeType: 'AUM-based',
      goals: [
        { label: 'Income $4,200/mo', progress: 100, target: 4200, current: 4200, onTrack: true },
        { label: 'Leave home to daughter', progress: 100, target: 100, current: 100, onTrack: true },
        { label: 'Final expense fund', progress: 100, target: 25000, current: 25000, onTrack: true }
      ],
      cashFlow: { monthlyIncome: 5800, monthlyExpenses: 4100, monthlySavings: 1700, savingsRate: 29 },
      assets: [
        { label: 'SPIA', value: 280000, pct: 41, color: '#10b981' },
        { label: 'IRA (Trad)', value: 220000, pct: 32, color: '#0ea5e9' },
        { label: 'Brokerage', value: 130000, pct: 19, color: '#8b5cf6' },
        { label: 'Cash/MM', value: 50000, pct: 8, color: '#f59e0b' }
      ],
      risk: { score: 2, label: 'Income', equity: 20, fixed: 70, alt: 10 },
      aiInsight: 'Dorothy\'s plan is fully on track. All goals met. Annual review recommended to ensure RMD is processed and beneficiary designations are current. Consider a small Roth conversion ($15K) to reduce future RMD burden for heirs.'
    }
  ];

  var _advSelectedId = null;
  var _advFilter = '';

  // ── KPI bar ──────────────────────────────────────────────────────────────────
  function _advRenderKPIBar() {
    var el = document.getElementById('adv-kpi-bar');
    if (!el) return;
    var totalAUM    = _advClients.reduce(function(s,c){ return s + c.aum; }, 0);
    var totalFees   = _advClients.reduce(function(s,c){ return s + c.annualFee; }, 0);
    var avgHealth   = Math.round(_advClients.reduce(function(s,c){ return s + c.healthScore; }, 0) / _advClients.length);
    var urgent      = _advClients.filter(function(c){ return c.priority === 'urgent'; }).length;
    var distributing= _advClients.filter(function(c){ return c.status === 'distributing' || c.status === 'rmd-required'; }).length;
    var accumulating= _advClients.filter(function(c){ return c.status === 'active'; }).length;
    var offTrack    = _advClients.filter(function(c){ return c.goals.some(function(g){ return !g.onTrack; }); }).length;

    el.innerHTML =
      '<div class="adv-kpi-card">' +
        '<div class="adv-kpi-icon"><i class="fas fa-users"></i></div>' +
        '<div class="adv-kpi-body"><div class="adv-kpi-val">' + _advClients.length + '</div>' +
        '<div class="adv-kpi-label">ADVISORY<br>CLIENTS</div>' +
        '<div class="adv-kpi-sub">' + distributing + ' distributing</div></div>' +
      '</div>' +
      '<div class="adv-kpi-card">' +
        '<div class="adv-kpi-icon" style="color:#8b5cf6"><i class="fas fa-dollar-sign"></i></div>' +
        '<div class="adv-kpi-body"><div class="adv-kpi-val">$' + (totalAUM/1000000).toFixed(1) + 'M</div>' +
        '<div class="adv-kpi-label">TOTAL AUM<br>MANAGED</div>' +
        '<div class="adv-kpi-sub">$' + Math.round(totalAUM/6/1000) + 'K avg</div></div>' +
      '</div>' +
      '<div class="adv-kpi-card">' +
        '<div class="adv-kpi-icon" style="color:#10b981"><i class="fas fa-hand-holding-usd"></i></div>' +
        '<div class="adv-kpi-body"><div class="adv-kpi-val">$' + Math.round(totalFees/1000) + 'K</div>' +
        '<div class="adv-kpi-label">ANNUAL FEES<br>MANAGED</div>' +
        '<div class="adv-kpi-sub">avg ' + ((totalFees/totalAUM)*100).toFixed(2) + '% AUM</div></div>' +
      '</div>' +
      '<div class="adv-kpi-card">' +
        '<div class="adv-kpi-icon" style="color:' + (avgHealth >= 80 ? '#10b981' : avgHealth >= 65 ? '#f59e0b' : '#ef4444') + '">' +
        '<i class="fas fa-heartbeat"></i></div>' +
        '<div class="adv-kpi-body"><div class="adv-kpi-val">' + avgHealth + '</div>' +
        '<div class="adv-kpi-label">AVG PLAN<br>HEALTH SCORE</div>' +
        '<div class="adv-kpi-sub">out of 100</div></div>' +
      '</div>' +
      '<div class="adv-kpi-card">' +
        '<div class="adv-kpi-icon" style="color:#ef4444"><i class="fas fa-exclamation-triangle"></i></div>' +
        '<div class="adv-kpi-body"><div class="adv-kpi-val">' + urgent + '</div>' +
        '<div class="adv-kpi-label">URGENT<br>ACTIONS</div>' +
        '<div class="adv-kpi-sub">require attention</div></div>' +
      '</div>' +
      '<div class="adv-kpi-card">' +
        '<div class="adv-kpi-icon" style="color:#f59e0b"><i class="fas fa-bullseye"></i></div>' +
        '<div class="adv-kpi-body"><div class="adv-kpi-val">' + offTrack + '</div>' +
        '<div class="adv-kpi-label">GOALS<br>OFF TRACK</div>' +
        '<div class="adv-kpi-sub">need plan adjustment</div></div>' +
      '</div>' +
      '<div class="adv-kpi-card">' +
        '<div class="adv-kpi-icon" style="color:#0ea5e9"><i class="fas fa-chart-pie"></i></div>' +
        '<div class="adv-kpi-body"><div class="adv-kpi-val">' + accumulating + '</div>' +
        '<div class="adv-kpi-label">ACCUMULATION<br>PHASE</div>' +
        '<div class="adv-kpi-sub">actively building</div></div>' +
      '</div>' +
      '<div class="adv-kpi-card">' +
        '<div class="adv-kpi-icon" style="color:#06b6d4"><i class="fas fa-calendar-check"></i></div>' +
        '<div class="adv-kpi-body"><div class="adv-kpi-val">3</div>' +
        '<div class="adv-kpi-label">REVIEWS<br>DUE THIS MONTH</div>' +
        '<div class="adv-kpi-sub">scheduled</div></div>' +
      '</div>';
  }

  // ── AI Banner ─────────────────────────────────────────────────────────────────
  function _advRenderAIBanner() {
    var el = document.getElementById('adv-ai-banner');
    if (!el) return;
    var offTrackClients = _advClients.filter(function(c){ return c.goals.some(function(g){ return !g.onTrack; }); });
    var totalGap = _advClients.reduce(function(s,c){
      return s + c.goals.filter(function(g){ return !g.onTrack; }).length;
    }, 0);
    el.innerHTML =
      '<div class="adv-ai-pulse-wrap"><div class="adv-ai-pulse"></div>' +
      '<span class="adv-ai-label"><i class="fas fa-robot"></i> AI PLAN OPTIMIZER</span></div>' +
      '<div class="adv-ai-text">' +
        '<strong>Plan Gap Alert:</strong> ' + offTrackClients.length + ' clients have ' + totalGap + ' off-track goals. ' +
        'Robert Chen has the largest retirement gap at <strong>$2.66M</strong>. ' +
        'Maria Gonzalez\'s FIA contract requires <strong>immediate action before Jun 15</strong>.' +
      '</div>' +
      '<div class="adv-ai-actions">' +
        '<button class="adv-ai-btn adv-ai-btn-primary" onclick="advBatchReview()"><i class="fas fa-magic"></i> Full Gap Report</button>' +
        '<button class="adv-ai-btn adv-ai-btn-secondary" onclick="advBatchReview()"><i class="fas fa-file-alt"></i> AI Plan Letters</button>' +
      '</div>' +
      '<div class="adv-ai-summary">' +
        '<div class="adv-ai-stat"><span class="adv-ai-stat-val">' + totalGap + '</span><span class="adv-ai-stat-lbl">TOTAL<br>OFF-TRACK</span></div>' +
        '<div class="adv-ai-stat"><span class="adv-ai-stat-val">' + offTrackClients.length + '</span><span class="adv-ai-stat-lbl">CLIENTS<br>AT RISK</span></div>' +
      '</div>';
  }

  function advBatchReview() {
    alert('AI Batch Plan Review — generating optimization report for all 6 advisory clients...');
  }

  // ── Client List ───────────────────────────────────────────────────────────────
  function advRenderClientList() {
    var el = document.getElementById('adv-client-list');
    if (!el) return;
    var filtered = _advFilter
      ? _advClients.filter(function(c){
          var q = _advFilter.toLowerCase();
          return c.name.toLowerCase().indexOf(q) > -1 || c.planType.toLowerCase().indexOf(q) > -1 || c.status.indexOf(q) > -1;
        })
      : _advClients;

    var sorted = filtered.slice().sort(function(a,b){
      var p = {urgent:0,high:1,medium:2,low:3};
      return (p[a.priority]||4) - (p[b.priority]||4);
    });

    el.innerHTML = sorted.map(function(c) {
      var healthColor = c.healthScore >= 85 ? '#10b981' : c.healthScore >= 70 ? '#f59e0b' : '#ef4444';
      var statusBadge = {
        'active':       '<span class="adv-status-badge adv-status-active">Active</span>',
        'distributing': '<span class="adv-status-badge adv-status-dist">Distributing</span>',
        'rmd-required': '<span class="adv-status-badge adv-status-rmd">RMD Due</span>'
      }[c.status] || '<span class="adv-status-badge">' + c.status + '</span>';
      var priorityDot = {urgent:'#ef4444',high:'#f59e0b',medium:'#0ea5e9',low:'#10b981'}[c.priority] || '#6b7280';
      var isSelected = c.id === _advSelectedId;
      var offTrackCount = c.goals.filter(function(g){ return !g.onTrack; }).length;

      return '<div class="adv-client-card' + (isSelected ? ' adv-selected' : '') + '" onclick="advOpenClient(\'' + c.id + '\')">' +
        '<div class="adv-cc-top">' +
          '<div class="adv-cc-avatar" style="background:' + (isSelected ? '#1e40af' : '#334155') + '">' +
            c.name.split(' ').map(function(n){ return n[0]; }).join('') +
          '</div>' +
          '<div class="adv-cc-info">' +
            '<div class="adv-cc-name">' + c.name + '</div>' +
            '<div class="adv-cc-meta">Age ' + c.age + ' · ' + c.planType + '</div>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">' +
            statusBadge +
            '<span style="width:8px;height:8px;border-radius:50%;background:' + priorityDot + ';margin-top:2px;display:inline-block;align-self:flex-end"></span>' +
          '</div>' +
        '</div>' +
        '<div class="adv-cc-health-row">' +
          '<div class="adv-cc-health-bar-wrap">' +
            '<div class="adv-cc-health-bar" style="width:' + c.healthScore + '%;background:' + healthColor + '"></div>' +
          '</div>' +
          '<span class="adv-cc-health-val" style="color:' + healthColor + '">' + c.healthScore + '</span>' +
        '</div>' +
        '<div class="adv-cc-footer">' +
          '<span>$' + (c.aum/1000).toFixed(0) + 'K AUM</span>' +
          '<span style="color:' + (offTrackCount > 0 ? '#f59e0b' : '#10b981') + '">' +
            (offTrackCount > 0 ? offTrackCount + ' goal' + (offTrackCount>1?'s':'' ) + ' off track' : 'All goals on track') +
          '</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // ── Open Client ───────────────────────────────────────────────────────────────
  function advOpenClient(id) {
    _advSelectedId = id;
    advRenderClientList();
    var c = _advClients.find(function(x){ return x.id === id; });
    if (!c) return;
    var emptyEl = document.getElementById('adv-detail-empty');
    var panelEl = document.getElementById('adv-detail-panel');
    if (emptyEl) emptyEl.style.display = 'none';
    if (panelEl) { panelEl.style.display = 'block'; panelEl.innerHTML = _advBuildDetailHTML(c); }
    advSwitchTab('summary', panelEl ? panelEl.querySelector('.adv-tab-btn') : null);
  }

  // ── Tab switcher ──────────────────────────────────────────────────────────────
  function advSwitchTab(key, el) {
    var panel = document.getElementById('adv-detail-panel');
    if (!panel) return;
    panel.querySelectorAll('.adv-tab-btn').forEach(function(b){ b.classList.remove('active'); });
    panel.querySelectorAll('.adv-tab-panel').forEach(function(p){ p.style.display = 'none'; });
    if (el) el.classList.add('active');
    var tp = document.getElementById('adv-tab-' + key);
    if (tp) tp.style.display = 'block';
  }

  // ── Detail HTML ───────────────────────────────────────────────────────────────
  function _advBuildDetailHTML(c) {
    var healthColor = c.healthScore >= 85 ? '#10b981' : c.healthScore >= 70 ? '#f59e0b' : '#ef4444';
    return (
      '<div class="adv-detail-header">' +
        '<div class="adv-dh-left">' +
          '<div class="adv-dh-avatar">' + c.name.split(' ').map(function(n){ return n[0]; }).join('') + '</div>' +
          '<div>' +
            '<div class="adv-dh-name">' + c.name + '</div>' +
            '<div class="adv-dh-meta">Age ' + c.age + ' · ' + c.planType + ' · ' + c.feeType + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="adv-dh-right">' +
          '<div class="adv-dh-score" style="color:' + healthColor + '">' + c.healthScore + '<span style="font-size:12px;color:#94a3b8">/100</span></div>' +
          '<div style="font-size:10px;color:#94a3b8;text-align:center">Plan Health</div>' +
        '</div>' +
      '</div>' +
      '<div class="adv-tab-bar">' +
        ['summary','goals','cashflow','assets','risk','ai'].map(function(k, i){
          var icons = ['fas fa-clipboard-list','fas fa-bullseye','fas fa-exchange-alt','fas fa-chart-pie','fas fa-shield-alt','fas fa-robot'];
          var labels = ['Summary','Goals','Cash Flow','Assets','Risk','AI'];
          return '<button class="adv-tab-btn' + (i===0?' active':'') + '" onclick="advSwitchTab(\'' + k + '\',this)">' +
            '<i class="' + icons[i] + '"></i> ' + labels[i] + '</button>';
        }).join('') +
      '</div>' +
      '<div class="adv-tab-panels">' +
        _advTabSummary(c) +
        _advTabGoals(c) +
        _advTabCashFlow(c) +
        _advTabAssets(c) +
        _advTabRisk(c) +
        _advTabAI(c) +
      '</div>'
    );
  }

  // ── Tab: Summary ──────────────────────────────────────────────────────────────
  function _advTabSummary(c) {
    var onTrack = c.goals.filter(function(g){ return g.onTrack; }).length;
    var offTrack = c.goals.filter(function(g){ return !g.onTrack; }).length;
    return '<div id="adv-tab-summary" class="adv-tab-panel">' +
      '<div class="adv-summary-grid">' +
        '<div class="adv-summary-card">' +
          '<div class="adv-sc-label">Plan Type</div><div class="adv-sc-val">' + c.planType + '</div>' +
        '</div>' +
        '<div class="adv-summary-card">' +
          '<div class="adv-sc-label">Status</div><div class="adv-sc-val">' + c.status.replace('-',' ').replace(/\b\w/g,function(x){return x.toUpperCase();}) + '</div>' +
        '</div>' +
        '<div class="adv-summary-card">' +
          '<div class="adv-sc-label">AUM</div><div class="adv-sc-val">$' + (c.aum/1000).toFixed(0) + 'K</div>' +
        '</div>' +
        '<div class="adv-summary-card">' +
          '<div class="adv-sc-label">Annual Fee</div><div class="adv-sc-val">$' + c.annualFee.toLocaleString() + '</div>' +
        '</div>' +
        '<div class="adv-summary-card">' +
          '<div class="adv-sc-label">Last Review</div><div class="adv-sc-val">' + c.lastReview + '</div>' +
        '</div>' +
        '<div class="adv-summary-card">' +
          '<div class="adv-sc-label">Next Review</div><div class="adv-sc-val">' + c.nextReview + '</div>' +
        '</div>' +
        '<div class="adv-summary-card">' +
          '<div class="adv-sc-label">Goals On Track</div>' +
          '<div class="adv-sc-val" style="color:#10b981">' + onTrack + ' / ' + c.goals.length + '</div>' +
        '</div>' +
        '<div class="adv-summary-card">' +
          '<div class="adv-sc-label">Goals Off Track</div>' +
          '<div class="adv-sc-val" style="color:' + (offTrack>0?'#ef4444':'#10b981') + '">' + offTrack + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="adv-summary-actions">' +
        '<button class="adv-action-btn adv-action-primary"><i class="fas fa-file-pdf"></i> Generate Plan Report</button>' +
        '<button class="adv-action-btn adv-action-secondary"><i class="fas fa-envelope"></i> Send to Client</button>' +
        '<button class="adv-action-btn adv-action-secondary"><i class="fas fa-calendar-plus"></i> Schedule Review</button>' +
      '</div>' +
    '</div>';
  }

  // ── Tab: Goals ────────────────────────────────────────────────────────────────
  function _advTabGoals(c) {
    var rows = c.goals.map(function(g) {
      var barColor = g.onTrack ? '#10b981' : '#ef4444';
      return '<div class="adv-goal-row">' +
        '<div class="adv-goal-top">' +
          '<span class="adv-goal-label">' + g.label + '</span>' +
          '<span class="adv-goal-badge" style="background:' + (g.onTrack?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)') +
            ';color:' + (g.onTrack?'#10b981':'#ef4444') + '">' +
            (g.onTrack ? '<i class="fas fa-check"></i> On Track' : '<i class="fas fa-times"></i> Off Track') +
          '</span>' +
        '</div>' +
        '<div class="adv-goal-bar-wrap">' +
          '<div class="adv-goal-bar" style="width:' + g.progress + '%;background:' + barColor + '"></div>' +
        '</div>' +
        '<div class="adv-goal-footer">' +
          '<span>' + g.progress + '% complete</span>' +
          (g.target > 1000
            ? '<span>$' + (g.current/1000).toFixed(0) + 'K of $' + (g.target/1000).toFixed(0) + 'K</span>'
            : '<span>' + g.current + ' of ' + g.target + '</span>') +
        '</div>' +
      '</div>';
    }).join('');
    return '<div id="adv-tab-goals" class="adv-tab-panel" style="display:none">' +
      '<div class="adv-goals-list">' + rows + '</div>' +
    '</div>';
  }

  // ── Tab: Cash Flow ────────────────────────────────────────────────────────────
  function _advTabCashFlow(c) {
    var cf = c.cashFlow;
    return '<div id="adv-tab-cashflow" class="adv-tab-panel" style="display:none">' +
      '<div class="adv-cf-grid">' +
        '<div class="adv-cf-card adv-cf-income">' +
          '<div class="adv-cf-icon"><i class="fas fa-arrow-down"></i></div>' +
          '<div><div class="adv-cf-label">Monthly Income</div>' +
          '<div class="adv-cf-val">${' + cf.monthlyIncome.toLocaleString() + '}</div></div>' +
        '</div>' +
        '<div class="adv-cf-card adv-cf-expense">' +
          '<div class="adv-cf-icon"><i class="fas fa-arrow-up"></i></div>' +
          '<div><div class="adv-cf-label">Monthly Expenses</div>' +
          '<div class="adv-cf-val">${' + cf.monthlyExpenses.toLocaleString() + '}</div></div>' +
        '</div>' +
        '<div class="adv-cf-card adv-cf-savings">' +
          '<div class="adv-cf-icon"><i class="fas fa-piggy-bank"></i></div>' +
          '<div><div class="adv-cf-label">Monthly Savings</div>' +
          '<div class="adv-cf-val">${' + cf.monthlySavings.toLocaleString() + '}</div></div>' +
        '</div>' +
        '<div class="adv-cf-card adv-cf-rate">' +
          '<div class="adv-cf-icon"><i class="fas fa-percentage"></i></div>' +
          '<div><div class="adv-cf-label">Savings Rate</div>' +
          '<div class="adv-cf-val">' + cf.savingsRate + '%</div></div>' +
        '</div>' +
      '</div>' +
      '<div class="adv-cf-bar-section">' +
        '<div class="adv-cf-bar-label">Income Allocation</div>' +
        '<div class="adv-cf-bar-wrap">' +
          '<div class="adv-cf-seg" style="width:' + Math.round((cf.monthlyExpenses/cf.monthlyIncome)*100) + '%;background:#ef4444" title="Expenses"></div>' +
          '<div class="adv-cf-seg" style="width:' + Math.round((cf.monthlySavings/cf.monthlyIncome)*100) + '%;background:#10b981" title="Savings"></div>' +
        '</div>' +
        '<div class="adv-cf-bar-legend">' +
          '<span style="color:#ef4444"><i class="fas fa-square"></i> Expenses ' + Math.round((cf.monthlyExpenses/cf.monthlyIncome)*100) + '%</span>' +
          '<span style="color:#10b981"><i class="fas fa-square"></i> Savings ' + cf.savingsRate + '%</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // ── Tab: Assets ───────────────────────────────────────────────────────────────
  function _advTabAssets(c) {
    var rows = c.assets.map(function(a) {
      return '<div class="adv-asset-row">' +
        '<div class="adv-asset-dot" style="background:' + a.color + '"></div>' +
        '<div class="adv-asset-label">' + a.label + '</div>' +
        '<div class="adv-asset-bar-wrap">' +
          '<div class="adv-asset-bar" style="width:' + a.pct + '%;background:' + a.color + '"></div>' +
        '</div>' +
        '<div class="adv-asset-pct">' + a.pct + '%</div>' +
        '<div class="adv-asset-val">$' + (a.value/1000).toFixed(0) + 'K</div>' +
      '</div>';
    }).join('');
    return '<div id="adv-tab-assets" class="adv-tab-panel" style="display:none">' +
      '<div class="adv-assets-header">' +
        '<div class="adv-assets-total">Total AUM: <strong>$' + (c.aum/1000).toFixed(0) + 'K</strong></div>' +
        '<button class="adv-action-btn adv-action-secondary" style="padding:6px 14px;font-size:11px">' +
          '<i class="fas fa-rebalance"></i> Rebalance</button>' +
      '</div>' +
      '<div class="adv-asset-rows">' + rows + '</div>' +
    '</div>';
  }

  // ── Tab: Risk ─────────────────────────────────────────────────────────────────
  function _advTabRisk(c) {
    var r = c.risk;
    var scoreColor = r.score >= 7 ? '#ef4444' : r.score >= 5 ? '#f59e0b' : '#10b981';
    return '<div id="adv-tab-risk" class="adv-tab-panel" style="display:none">' +
      '<div class="adv-risk-header">' +
        '<div class="adv-risk-score" style="color:' + scoreColor + '">' + r.score + '<span style="font-size:14px;color:#94a3b8">/10</span></div>' +
        '<div>' +
          '<div class="adv-risk-label">' + r.label + '</div>' +
          '<div style="font-size:11px;color:#64748b">Risk Tolerance Score</div>' +
        '</div>' +
      '</div>' +
      '<div class="adv-risk-alloc">' +
        '<div class="adv-risk-alloc-row">' +
          '<span class="adv-risk-alloc-label">Equity</span>' +
          '<div class="adv-risk-alloc-bar-wrap">' +
            '<div class="adv-risk-alloc-bar" style="width:' + r.equity + '%;background:#0ea5e9"></div>' +
          '</div>' +
          '<span class="adv-risk-alloc-pct">' + r.equity + '%</span>' +
        '</div>' +
        '<div class="adv-risk-alloc-row">' +
          '<span class="adv-risk-alloc-label">Fixed Income</span>' +
          '<div class="adv-risk-alloc-bar-wrap">' +
            '<div class="adv-risk-alloc-bar" style="width:' + r.fixed + '%;background:#8b5cf6"></div>' +
          '</div>' +
          '<span class="adv-risk-alloc-pct">' + r.fixed + '%</span>' +
        '</div>' +
        '<div class="adv-risk-alloc-row">' +
          '<span class="adv-risk-alloc-label">Alternatives</span>' +
          '<div class="adv-risk-alloc-bar-wrap">' +
            '<div class="adv-risk-alloc-bar" style="width:' + r.alt + '%;background:#f59e0b"></div>' +
          '</div>' +
          '<span class="adv-risk-alloc-pct">' + r.alt + '%</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // ── Tab: AI ───────────────────────────────────────────────────────────────────
  function _advTabAI(c) {
    return '<div id="adv-tab-ai" class="adv-tab-panel" style="display:none">' +
      '<div class="adv-ai-insight-card">' +
        '<div class="adv-ai-insight-header"><i class="fas fa-robot"></i> AI Plan Optimizer — ' + c.name + '</div>' +
        '<div class="adv-ai-insight-body">' + c.aiInsight + '</div>' +
      '</div>' +
      '<div class="adv-ai-actions-grid">' +
        '<button class="adv-ai-action-card"><i class="fas fa-file-alt"></i><span>Generate IPS</span></button>' +
        '<button class="adv-ai-action-card"><i class="fas fa-envelope"></i><span>Draft Client Letter</span></button>' +
        '<button class="adv-ai-action-card"><i class="fas fa-chart-line"></i><span>Run Projection</span></button>' +
        '<button class="adv-ai-action-card"><i class="fas fa-calendar-alt"></i><span>Schedule Review</span></button>' +
      '</div>' +
    '</div>';
  }

  // ── Init ──────────────────────────────────────────────────────────────────────
  function initAdvFinancialPlansPage() {
    _advRenderKPIBar();
    _advRenderAIBanner();
    advRenderClientList();
    // Auto-open Maria Gonzalez (urgent RMD + FIA action)
    setTimeout(function() { advOpenClient('ADV-MG-001'); }, 120);
  }

  // ── navigateTo monkey-patch ───────────────────────────────────────────────────
  var _orig_navigateTo_adv = navigateTo;
  navigateTo = function(page) {
    _orig_navigateTo_adv(page);
    if (page === 'adv-plans') {
      requestAnimationFrame(function() {
        setTimeout(function() {
          var t = document.getElementById('page-title');
          var b = document.getElementById('page-breadcrumb');
          if (t) t.textContent = 'Financial Plans';
          if (b) b.textContent = 'Advisory / Financial Plans';
          initAdvFinancialPlansPage();
        }, 80);
      });
    }
  };

  console.log('ADV Step 1 module loaded');
})();
