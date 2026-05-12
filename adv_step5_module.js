(function() {
  'use strict';

  // ── ADV Step 5: Business Intelligence dashboard upgrade ───────────────────────
  // Real KPIs, 6-chart analytics suite, advisor scorecard, book composition

  function initAdvBIPage() {
    var el = document.getElementById('reports-page');
    if (!el) {
      el = document.querySelector('.page');
    }
    var container = document.getElementById('tpl-reports');
    if (!container) return;

    container.innerHTML =
      '<div class="page bi-page">' +
        '<div class="bi-kpi-bar" id="bi-kpi-bar"></div>' +
        '<div class="bi-body">' +
          '<div class="bi-charts-grid" id="bi-charts-grid"></div>' +
          '<div class="bi-scorecard" id="bi-scorecard"></div>' +
        '</div>' +
      '</div>';

    _biRenderKPIs();
    _biRenderCharts();
    _biRenderScorecard();
  }

  function _biRenderKPIs() {
    var el = document.getElementById('bi-kpi-bar');
    if (!el) return;
    var kpis = [
      { icon:'fas fa-dollar-sign',    color:'#10b981', val:'$187K',   label:'YTD REVENUE',         sub:'+18% vs last yr' },
      { icon:'fas fa-users',           color:'#0ea5e9', val:'247',     label:'TOTAL CLIENTS',        sub:'14 new this month' },
      { icon:'fas fa-chart-bar',       color:'#8b5cf6', val:'$8.1M',   label:'AUM + PREMIUMS',       sub:'$6.7M AUM' },
      { icon:'fas fa-percentage',      color:'#f59e0b', val:'94.6%',   label:'AI ACCURACY',          sub:'UW decisions' },
      { icon:'fas fa-clock',           color:'#06b6d4', val:'4.2 hrs', label:'UW TIME SAVED',        sub:'per case avg' },
      { icon:'fas fa-heart',           color:'#ef4444', val:'87',      label:'NPS SCORE',            sub:'+12 vs Q4 2024' },
      { icon:'fas fa-funnel-dollar',   color:'#10b981', val:'$42.2K',  label:'COMMISSION MTD',       sub:'78% of $54K target' },
      { icon:'fas fa-robot',           color:'#8b5cf6', val:'87/100',  label:'AI IMPACT SCORE',      sub:'Agent 360 overall' }
    ];
    el.innerHTML = kpis.map(function(k) {
      return '<div class="bi-kpi-card">' +
        '<div class="bi-kpi-icon" style="color:'+k.color+'"><i class="'+k.icon+'"></i></div>' +
        '<div><div class="bi-kpi-val">'+k.val+'</div>' +
        '<div class="bi-kpi-label">'+k.label+'</div>' +
        '<div class="bi-kpi-sub">'+k.sub+'</div></div>' +
      '</div>';
    }).join('');
  }

  function _biRenderCharts() {
    var el = document.getElementById('bi-charts-grid');
    if (!el) return;

    el.innerHTML =
      '<div class="bi-chart-card bi-chart-wide">' +
        '<div class="bi-chart-title">Revenue by Month (YTD)</div>' +
        '<canvas id="biRevChart" height="160"></canvas>' +
      '</div>' +
      '<div class="bi-chart-card">' +
        '<div class="bi-chart-title">Book Composition</div>' +
        '<canvas id="biBookChart" height="160"></canvas>' +
      '</div>' +
      '<div class="bi-chart-card">' +
        '<div class="bi-chart-title">Pipeline by Stage</div>' +
        '<canvas id="biPipeChart" height="160"></canvas>' +
      '</div>' +
      '<div class="bi-chart-card bi-chart-wide">' +
        '<div class="bi-chart-title">Client Retention & Lapse Risk Trend</div>' +
        '<canvas id="biRetentionChart" height="160"></canvas>' +
      '</div>';

    // Wait for Chart.js to be available
    function tryCharts() {
      if (typeof Chart === 'undefined') { setTimeout(tryCharts, 200); return; }
      _drawRevChart();
      _drawBookChart();
      _drawPipeChart();
      _drawRetentionChart();
    }
    tryCharts();
  }

  function _drawRevChart() {
    var cv = document.getElementById('biRevChart');
    if (!cv) return;
    if (cv._ci) { cv._ci.destroy(); }
    cv._ci = new Chart(cv, {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [
          { label: 'Insurance ($K)',   data: [22,18,25,28,31,0,0,0,0,0,0,0],   backgroundColor: '#0ea5e9' },
          { label: 'Investments ($K)', data: [8,9,11,12,14,0,0,0,0,0,0,0],    backgroundColor: '#8b5cf6' },
          { label: 'Advisory ($K)',    data: [5,6,7,7,8,0,0,0,0,0,0,0],        backgroundColor: '#10b981' },
          { label: 'Annuity ($K)',     data: [12,10,14,16,20,0,0,0,0,0,0,0],   backgroundColor: '#f59e0b' }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 } } } },
        scales: {
          x: { stacked: true, ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: '#1e293b' } },
          y: { stacked: true, ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: '#1e293b' } }
        }
      }
    });
  }

  function _drawBookChart() {
    var cv = document.getElementById('biBookChart');
    if (!cv) return;
    if (cv._ci) { cv._ci.destroy(); }
    cv._ci = new Chart(cv, {
      type: 'doughnut',
      data: {
        labels: ['Insurance', 'Investments', 'Retirement', 'Advisory'],
        datasets: [{ data: [48, 22, 18, 12], backgroundColor: ['#0ea5e9','#8b5cf6','#10b981','#f59e0b'], borderWidth: 0 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { color: '#94a3b8', font: { size: 10 }, boxWidth: 12 } } }
      }
    });
  }

  function _drawPipeChart() {
    var cv = document.getElementById('biPipeChart');
    if (!cv) return;
    if (cv._ci) { cv._ci.destroy(); }
    cv._ci = new Chart(cv, {
      type: 'bar',
      data: {
        labels: ['Prospect','Qualified','Proposal','Negotiation','Closed'],
        datasets: [{ label: 'Deals', data: [32, 18, 11, 7, 4], backgroundColor: ['#334155','#475569','#f59e0b','#0ea5e9','#10b981'] }]
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: '#1e293b' } },
          y: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { display: false } }
        }
      }
    });
  }

  function _drawRetentionChart() {
    var cv = document.getElementById('biRetentionChart');
    if (!cv) return;
    if (cv._ci) { cv._ci.destroy(); }
    cv._ci = new Chart(cv, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May'],
        datasets: [
          { label: 'Retention Rate %', data: [91,92,93,94,94.6], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.08)', fill: true, tension: .4 },
          { label: 'Lapse Risk Clients', data: [8,7,6,5,4], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.08)', fill: true, tension: .4, yAxisID: 'y1' }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8', font: { size: 10 } } } },
        scales: {
          x:  { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: '#1e293b' } },
          y:  { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: '#1e293b' }, min: 85, max: 100, position: 'left' },
          y1: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false }, position: 'right', min: 0, max: 15 }
        }
      }
    });
  }

  function _biRenderScorecard() {
    var el = document.getElementById('bi-scorecard');
    if (!el) return;
    var domains = [
      { label: 'Insurance',         score: 91, trend: '+3', color: '#0ea5e9' },
      { label: 'Investments',       score: 76, trend: '+8', color: '#8b5cf6' },
      { label: 'Retirement (ADV)',   score: 84, trend: '+5', color: '#10b981' },
      { label: 'Retention AI',      score: 88, trend: '+2', color: '#06b6d4' },
      { label: 'Claims AI',         score: 85, trend: '+1', color: '#f59e0b' },
      { label: 'UW AI',             score: 92, trend: '+4', color: '#ef4444' }
    ];

    el.innerHTML =
      '<div class="bi-sc-title">Advisor AI Scorecard</div>' +
      '<div class="bi-sc-overall">' +
        '<div class="bi-sc-gauge">87<span style="font-size:14px;color:#64748b">/100</span></div>' +
        '<div class="bi-sc-gauge-label">Overall AI Impact Score</div>' +
      '</div>' +
      '<div class="bi-sc-domains">' +
        domains.map(function(d) {
          return '<div class="bi-sc-row">' +
            '<div class="bi-sc-label">'+d.label+'</div>' +
            '<div class="bi-sc-bar-wrap"><div class="bi-sc-bar" style="width:'+d.score+'%;background:'+d.color+'"></div></div>' +
            '<div class="bi-sc-score" style="color:'+d.color+'">'+d.score+'</div>' +
            '<div class="bi-sc-trend" style="color:#10b981">'+d.trend+'</div>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<div class="bi-sc-actions">' +
        '<button class="bi-sc-btn"><i class="fas fa-download"></i> Export Report</button>' +
        '<button class="bi-sc-btn"><i class="fas fa-share"></i> Share Dashboard</button>' +
      '</div>';
  }

  // Patch navigateTo for reports page
  var _orig_nav_adv5 = navigateTo;
  navigateTo = function(page) {
    _orig_nav_adv5(page);
    if (page === 'reports') {
      requestAnimationFrame(function() {
        setTimeout(function() {
          var t = document.getElementById('page-title');
          var b = document.getElementById('page-breadcrumb');
          if (t) t.textContent = 'Business Intelligence';
          if (b) b.textContent = 'Analytics / Business Intelligence';
          initAdvBIPage();
        }, 80);
      });
    }
  };

  console.log('ADV Step 5 module loaded');
})();
