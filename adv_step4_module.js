(function() {
  'use strict';

  // ── ADV Step 4: Portfolio Review page ────────────────────────────────────────
  // Holistic asset allocation view, rebalance alerts, drift analysis, 6 clients

  var _portfolioClients = [
    {
      id: 'PF-JW-001', name: 'James Whitfield', age: 52,
      aum: 842000, targetAlloc: { equity:72, fixed:20, alt:8 },
      currentAlloc: { equity:79, fixed:15, alt:6 },
      drift: 7, rebalanceNeeded: true, lastRebalance: '2024-09-12',
      ytdReturn: 8.4, benchmarkReturn: 7.1,
      holdings: [
        { name: 'US Large Cap (401k)', value: 420000, alloc: 50, type: 'equity', drift: 4 },
        { name: 'Intl Equity (Brokerage)', value: 145000, alloc: 17, type: 'equity', drift: 3 },
        { name: 'Bond Index (401k)', value: 126000, alloc: 15, type: 'fixed',  drift: -5 },
        { name: 'VA Annuity', value: 150000, alloc: 18, type: 'alt',    drift: -2 }
      ],
      alert: 'Equity overweight by 7%. Rebalance: sell $58K equity → buy $42K fixed + $16K alt.'
    },
    {
      id: 'PF-SW-001', name: 'Sandra Williams', age: 68,
      aum: 1240000, targetAlloc: { equity:35, fixed:55, alt:10 },
      currentAlloc: { equity:33, fixed:57, alt:10 },
      drift: 2, rebalanceNeeded: false, lastRebalance: '2025-01-08',
      ytdReturn: 4.2, benchmarkReturn: 4.0,
      holdings: [
        { name: 'IRA — Bond Ladder', value: 680000, alloc: 55, type: 'fixed',  drift: 2 },
        { name: 'SPIA Contract', value: 220000, alloc: 18, type: 'alt',    drift: 0 },
        { name: 'Blue Chip Equity', value: 240000, alloc: 19, type: 'equity', drift: -2 },
        { name: 'Money Market', value: 100000, alloc: 8,  type: 'fixed',  drift: 0 }
      ],
      alert: 'Portfolio within tolerance. Next review due Jul 2025.'
    },
    {
      id: 'PF-LM-001', name: 'Linda Morrison', age: 58,
      aum: 1580000, targetAlloc: { equity:62, fixed:28, alt:10 },
      currentAlloc: { equity:55, fixed:31, alt:14 },
      drift: 9, rebalanceNeeded: true, lastRebalance: '2024-06-30',
      ytdReturn: 6.1, benchmarkReturn: 7.1,
      holdings: [
        { name: '403(b) — Target Date', value: 780000, alloc: 49, type: 'equity', drift: -7 },
        { name: 'FIA Annuity', value: 200000, alloc: 13, type: 'alt',    drift: 3 },
        { name: 'Real Estate (REIT)', value: 420000, alloc: 27, type: 'alt',    drift: 1 },
        { name: 'Muni Bonds', value: 180000, alloc: 11, type: 'fixed',  drift: 3 }
      ],
      alert: 'Equity underweight by 7%, alt overweight by 4%. Underperforming benchmark by 1%. Rebalance recommended.'
    },
    {
      id: 'PF-MG-001', name: 'Maria Gonzalez', age: 71,
      aum: 920000, targetAlloc: { equity:28, fixed:62, alt:10 },
      currentAlloc: { equity:23, fixed:67, alt:10 },
      drift: 5, rebalanceNeeded: false, lastRebalance: '2025-02-14',
      ytdReturn: 3.8, benchmarkReturn: 3.5,
      holdings: [
        { name: 'IRA — Bond Fund', value: 510000, alloc: 55, type: 'fixed',  drift: 5 },
        { name: 'Fixed Annuity', value: 95000,  alloc: 10, type: 'alt',    drift: 0 },
        { name: 'Dividend Equity', value: 215000, alloc: 23, type: 'equity', drift: -5 },
        { name: 'Cash/MM', value: 100000, alloc: 12, type: 'fixed',  drift: 0 }
      ],
      alert: 'Minor drift only. FIA maturity Jun 15 — reinvestment decision pending (see RET track).'
    },
    {
      id: 'PF-RC-001', name: 'Robert Chen', age: 55,
      aum: 2140000, targetAlloc: { equity:80, fixed:12, alt:8 },
      currentAlloc: { equity:84, fixed:10, alt:6 },
      drift: 6, rebalanceNeeded: true, lastRebalance: '2024-11-20',
      ytdReturn: 11.2, benchmarkReturn: 9.8,
      holdings: [
        { name: '401k/SEP — Growth', value: 980000,  alloc: 46, type: 'equity', drift: 4 },
        { name: 'Business Equity (est.)', value: 650000, alloc: 30, type: 'alt',    drift: -2 },
        { name: 'DIA Annuity', value: 250000, alloc: 12, type: 'fixed',  drift: -2 },
        { name: 'Brokerage — Tech', value: 260000, alloc: 12, type: 'equity', drift: 2 }
      ],
      alert: 'Outperforming benchmark by 1.4%. Business equity creates concentration risk — succession plan needed to reduce to <20%.'
    },
    {
      id: 'PF-DW-001', name: 'Dorothy Wilson', age: 72,
      aum: 680000, targetAlloc: { equity:20, fixed:70, alt:10 },
      currentAlloc: { equity:19, fixed:72, alt:9 },
      drift: 2, rebalanceNeeded: false, lastRebalance: '2025-03-01',
      ytdReturn: 3.2, benchmarkReturn: 3.0,
      holdings: [
        { name: 'SPIA Contract', value: 280000, alloc: 41, type: 'alt',    drift: -1 },
        { name: 'IRA — Bond', value: 220000, alloc: 32, type: 'fixed',  drift: 2 },
        { name: 'Dividend Stocks', value: 130000, alloc: 19, type: 'equity', drift: -1 },
        { name: 'Cash/MM', value: 50000,  alloc: 8,  type: 'fixed',  drift: 0 }
      ],
      alert: 'Portfolio on target. All goals funded. Annual review Jul 2025.'
    }
  ];

  var _pfSelectedId = null;

  function _pfRenderKPIBar() {
    var el = document.getElementById('pf-kpi-bar');
    if (!el) return;
    var totalAUM      = _portfolioClients.reduce(function(s,c){ return s+c.aum; }, 0);
    var needRebal     = _portfolioClients.filter(function(c){ return c.rebalanceNeeded; }).length;
    var avgDrift      = (_portfolioClients.reduce(function(s,c){ return s+c.drift; }, 0) / _portfolioClients.length).toFixed(1);
    var avgYTD        = (_portfolioClients.reduce(function(s,c){ return s+c.ytdReturn; }, 0) / _portfolioClients.length).toFixed(1);
    var outperforming = _portfolioClients.filter(function(c){ return c.ytdReturn >= c.benchmarkReturn; }).length;

    el.innerHTML = [
      ['fas fa-chart-pie',  '#0ea5e9', '$' + (totalAUM/1000000).toFixed(1)+'M', 'TOTAL AUM', 'under management'],
      ['fas fa-balance-scale','#f59e0b', needRebal, 'REBALANCE', 'required now'],
      ['fas fa-arrows-alt', '#ef4444', avgDrift + '%', 'AVG DRIFT', 'from target alloc'],
      ['fas fa-chart-line', '#10b981', avgYTD + '%', 'AVG YTD', 'portfolio return'],
      ['fas fa-trophy',     '#8b5cf6', outperforming, 'BEATING', 'benchmark'],
      ['fas fa-sync',       '#06b6d4', '3', 'DUE FOR', 'review this mo']
    ].map(function(k){
      return '<div class="pf-kpi-card">' +
        '<div class="pf-kpi-icon" style="color:'+k[1]+'"><i class="'+k[0]+'"></i></div>' +
        '<div class="pf-kpi-body"><div class="pf-kpi-val">'+k[2]+'</div>' +
        '<div class="pf-kpi-label">'+k[3]+'</div>' +
        '<div class="pf-kpi-sub">'+k[4]+'</div></div></div>';
    }).join('');
  }

  function _pfRenderList() {
    var el = document.getElementById('pf-client-list');
    if (!el) return;
    el.innerHTML = _portfolioClients.map(function(c) {
      var driftColor = c.drift >= 8 ? '#ef4444' : c.drift >= 5 ? '#f59e0b' : '#10b981';
      var ytdColor   = c.ytdReturn >= c.benchmarkReturn ? '#10b981' : '#ef4444';
      var isSelected = c.id === _pfSelectedId;
      return '<div class="pf-client-card'+(isSelected?' pf-selected':'')+'" onclick="pfOpenClient(\''+c.id+'\')">' +
        '<div class="pf-cc-top">' +
          '<div class="pf-cc-avatar" style="background:'+(isSelected?'#1e40af':'#334155')+'">' +
            c.name.split(' ').map(function(n){return n[0];}).join('') +
          '</div>' +
          '<div class="pf-cc-info">' +
            '<div class="pf-cc-name">'+c.name+'</div>' +
            '<div class="pf-cc-meta">Age '+c.age+' · $'+(c.aum/1000).toFixed(0)+'K AUM</div>' +
          '</div>' +
          (c.rebalanceNeeded ? '<span class="pf-rebal-badge">REBALANCE</span>' : '<span class="pf-ok-badge">ON TARGET</span>') +
        '</div>' +
        '<div class="pf-cc-metrics">' +
          '<div class="pf-cc-metric"><span class="pf-cc-metric-val" style="color:'+driftColor+'">'+c.drift+'%</span><span class="pf-cc-metric-lbl">Drift</span></div>' +
          '<div class="pf-cc-metric"><span class="pf-cc-metric-val" style="color:'+ytdColor+'">'+c.ytdReturn+'%</span><span class="pf-cc-metric-lbl">YTD</span></div>' +
          '<div class="pf-cc-metric"><span class="pf-cc-metric-val">'+c.benchmarkReturn+'%</span><span class="pf-cc-metric-lbl">Benchmark</span></div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function pfOpenClient(id) {
    _pfSelectedId = id;
    _pfRenderList();
    var c = _portfolioClients.find(function(x){ return x.id === id; });
    if (!c) return;
    var emptyEl = document.getElementById('pf-detail-empty');
    var panelEl = document.getElementById('pf-detail-panel');
    if (emptyEl) emptyEl.style.display = 'none';
    if (!panelEl) return;
    panelEl.style.display = 'block';

    var typeColors = { equity:'#0ea5e9', fixed:'#8b5cf6', alt:'#f59e0b' };
    var holdingRows = c.holdings.map(function(h) {
      var driftColor = Math.abs(h.drift) >= 4 ? '#f59e0b' : '#10b981';
      return '<div class="pf-holding-row">' +
        '<div class="pf-holding-dot" style="background:'+typeColors[h.type]+'"></div>' +
        '<div class="pf-holding-name">'+h.name+'</div>' +
        '<div class="pf-holding-bar-wrap"><div class="pf-holding-bar" style="width:'+h.alloc+'%;background:'+typeColors[h.type]+'"></div></div>' +
        '<div class="pf-holding-pct">'+h.alloc+'%</div>' +
        '<div class="pf-holding-val">$'+(h.value/1000).toFixed(0)+'K</div>' +
        '<div class="pf-holding-drift" style="color:'+driftColor+'">'+(h.drift>=0?'+':'')+h.drift+'%</div>' +
      '</div>';
    }).join('');

    var allocRows = ['equity','fixed','alt'].map(function(k) {
      var target  = c.targetAlloc[k];
      var current = c.currentAlloc[k];
      var diff    = current - target;
      var color   = typeColors[k];
      return '<div class="pf-alloc-row">' +
        '<div class="pf-alloc-label">'+k.charAt(0).toUpperCase()+k.slice(1)+'</div>' +
        '<div class="pf-alloc-bars">' +
          '<div class="pf-alloc-bar-target" style="width:'+target+'%;background:'+color+';opacity:.35"></div>' +
          '<div class="pf-alloc-bar-current" style="width:'+current+'%;background:'+color+'"></div>' +
        '</div>' +
        '<div class="pf-alloc-pcts">' +
          '<span style="color:'+color+'">'+current+'%</span>' +
          '<span style="color:#475569"> vs '+target+'% target</span>' +
          '<span style="color:'+(Math.abs(diff)>=5?'#ef4444':'#10b981')+'">'+(diff>=0?'+':'')+diff+'%</span>' +
        '</div>' +
      '</div>';
    }).join('');

    panelEl.innerHTML =
      '<div class="pf-detail-header">' +
        '<div class="pf-dh-left">' +
          '<div class="pf-dh-avatar">'+c.name.split(' ').map(function(n){return n[0];}).join('')+'</div>' +
          '<div><div class="pf-dh-name">'+c.name+'</div><div class="pf-dh-meta">Age '+c.age+' · $'+(c.aum/1000).toFixed(0)+'K AUM · Last rebalanced: '+c.lastRebalance+'</div></div>' +
        '</div>' +
        '<div class="pf-dh-returns">' +
          '<div class="pf-dh-ytd" style="color:'+(c.ytdReturn>=c.benchmarkReturn?'#10b981':'#ef4444')+'">'+c.ytdReturn+'%<span style="font-size:11px;color:#64748b"> YTD</span></div>' +
          '<div style="font-size:10px;color:#475569">Benchmark: '+c.benchmarkReturn+'%</div>' +
        '</div>' +
      '</div>' +
      '<div class="pf-detail-body">' +
        '<div class="pf-alert-banner'+(c.rebalanceNeeded?' pf-alert-warn':' pf-alert-ok')+'">' +
          '<i class="fas fa-'+(c.rebalanceNeeded?'exclamation-triangle':'check-circle')+'"></i> ' + c.alert +
        '</div>' +
        '<div class="pf-section-title">Allocation vs Target</div>' +
        '<div class="pf-alloc-rows">'+allocRows+'</div>' +
        '<div class="pf-section-title">Holdings Breakdown</div>' +
        '<div class="pf-holdings">'+holdingRows+'</div>' +
        '<div class="pf-detail-actions">' +
          '<button class="pf-action-btn pf-action-primary"><i class="fas fa-sync"></i> Execute Rebalance</button>' +
          '<button class="pf-action-btn pf-action-secondary"><i class="fas fa-file-pdf"></i> Export Report</button>' +
          '<button class="pf-action-btn pf-action-secondary"><i class="fas fa-calendar-plus"></i> Schedule Review</button>' +
        '</div>' +
      '</div>';
  }

  function initAdvPortfolioPage() {
    _pfRenderKPIBar();
    _pfRenderList();
    setTimeout(function() { pfOpenClient('PF-RC-001'); }, 120);
  }

  var _orig_nav_adv4 = navigateTo;
  navigateTo = function(page) {
    _orig_nav_adv4(page);
    if (page === 'adv-portfolio') {
      requestAnimationFrame(function() {
        setTimeout(function() {
          var t = document.getElementById('page-title');
          var b = document.getElementById('page-breadcrumb');
          if (t) t.textContent = 'Portfolio Review';
          if (b) b.textContent = 'Advisory / Portfolio Review';
          initAdvPortfolioPage();
        }, 80);
      });
    }
  };

  console.log('ADV Step 4 module loaded');
})();
