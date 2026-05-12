(function() {
  'use strict';

  // ── ADV Step 2: Goals & Wealth Map tab injected into FNA Discovery page ──────
  // Adds a 6th tab "Goals & Wealth" to the existing FNA tab bar
  // Renders: net worth snapshot, 3-goal progress bars, wealth timeline, AI recommendation card

  var _advFNAData = {
    'alex-rivera': {
      name: 'Alex Rivera', age: 34,
      netWorth: 187000,
      assets: { '401k': 82000, brokerage: 45000, home: 0, cash: 60000 },
      liabilities: { studentLoan: 0, creditCard: 0 },
      goals: [
        { label: 'Buy First Home (age 37)', target: 80000, current: 45000, pct: 56, onTrack: true },
        { label: 'Emergency Fund 6-month', target: 30000, current: 27000, pct: 90, onTrack: true },
        { label: 'Retire at 62 — $6K/mo', target: 1800000, current: 127000, pct: 7, onTrack: false }
      ],
      wealthStages: [
        { age: 34, val: 187, label: 'Today' },
        { age: 40, val: 380, label: 'Age 40' },
        { age: 50, val: 820, label: 'Age 50' },
        { age: 62, val: 1640, label: 'Target Retire' }
      ],
      aiRec: 'Alex is on track for the home purchase but needs to accelerate retirement savings immediately. Recommend opening a Roth IRA ($7,000/yr) and increasing 401(k) to at least 15%. A whole-life policy now locks in low premiums and builds cash value for the home purchase.'
    },
    'default': {
      name: 'Client', age: 45,
      netWorth: 420000,
      assets: { '401k': 210000, brokerage: 95000, home: 180000, cash: 55000 },
      liabilities: { mortgage: 120000 },
      goals: [
        { label: 'Retire at 65 — $7K/mo', target: 2100000, current: 420000, pct: 20, onTrack: false },
        { label: 'College Fund', target: 100000, current: 42000, pct: 42, onTrack: true },
        { label: 'Pay off mortgage (age 55)', target: 0, current: 120000, pct: 60, onTrack: true }
      ],
      wealthStages: [
        { age: 45, val: 420, label: 'Today' },
        { age: 50, val: 680, label: 'Age 50' },
        { age: 60, val: 1250, label: 'Age 60' },
        { age: 65, val: 1820, label: 'Target Retire' }
      ],
      aiRec: 'Client is behind on retirement savings. Recommend increasing contribution rate to 20% and reviewing asset allocation. Insurance gap of $1.2M in life coverage identified — term policy recommended immediately.'
    }
  };

  function _renderFNAGoalsTab(clientKey) {
    var d = _advFNAData[clientKey] || _advFNAData['default'];
    var totalAssets = Object.values(d.assets).reduce(function(s,v){ return s+v; }, 0);
    var totalLiab   = Object.values(d.liabilities).reduce(function(s,v){ return s+v; }, 0);

    var goalRows = d.goals.map(function(g) {
      var barColor = g.onTrack ? '#10b981' : '#ef4444';
      return '<div class="fna-goals-row">' +
        '<div class="fna-goals-top">' +
          '<span class="fna-goals-label">' + g.label + '</span>' +
          '<span class="fna-goals-badge" style="background:' + (g.onTrack?'rgba(16,185,129,.15)':'rgba(239,68,68,.15)') +
            ';color:' + (g.onTrack?'#10b981':'#ef4444') + '">' +
            (g.onTrack?'✓ On Track':'✗ Off Track') + '</span>' +
        '</div>' +
        '<div class="fna-goals-bar-wrap"><div class="fna-goals-bar" style="width:' + g.pct + '%;background:' + barColor + '"></div></div>' +
        '<div class="fna-goals-foot"><span>' + g.pct + '%</span>' +
          (g.target > 1000 ? '<span>$' + (g.current/1000).toFixed(0) + 'K of $' + (g.target/1000).toFixed(0) + 'K</span>' : '') +
        '</div>' +
      '</div>';
    }).join('');

    var maxVal = Math.max.apply(null, d.wealthStages.map(function(s){ return s.val; }));
    var timelineHTML = d.wealthStages.map(function(s) {
      var h = Math.round((s.val / maxVal) * 80);
      return '<div class="fna-wt-col">' +
        '<div class="fna-wt-val">$' + s.val + 'K</div>' +
        '<div class="fna-wt-bar-wrap"><div class="fna-wt-bar" style="height:' + h + 'px;background:#3b82f6"></div></div>' +
        '<div class="fna-wt-label">' + s.label + '</div>' +
      '</div>';
    }).join('');

    return '<div class="fna-goals-wrap">' +
      '<div class="fna-goals-nw-row">' +
        '<div class="fna-goals-nw-card">' +
          '<div class="fna-goals-nw-label">Net Worth</div>' +
          '<div class="fna-goals-nw-val">$' + (d.netWorth/1000).toFixed(0) + 'K</div>' +
        '</div>' +
        '<div class="fna-goals-nw-card">' +
          '<div class="fna-goals-nw-label">Total Assets</div>' +
          '<div class="fna-goals-nw-val" style="color:#10b981">$' + (totalAssets/1000).toFixed(0) + 'K</div>' +
        '</div>' +
        '<div class="fna-goals-nw-card">' +
          '<div class="fna-goals-nw-label">Liabilities</div>' +
          '<div class="fna-goals-nw-val" style="color:#ef4444">$' + (totalLiab/1000).toFixed(0) + 'K</div>' +
        '</div>' +
        '<div class="fna-goals-nw-card">' +
          '<div class="fna-goals-nw-label">Age</div>' +
          '<div class="fna-goals-nw-val">' + d.age + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="fna-goals-section-title">Goal Progress</div>' +
      '<div class="fna-goals-list">' + goalRows + '</div>' +
      '<div class="fna-goals-section-title" style="margin-top:18px">Wealth Projection</div>' +
      '<div class="fna-wt-chart">' + timelineHTML + '</div>' +
      '<div class="fna-goals-ai-card">' +
        '<div class="fna-goals-ai-header"><i class="fas fa-robot"></i> AI Wealth Recommendation</div>' +
        '<div class="fna-goals-ai-body">' + d.aiRec + '</div>' +
      '</div>' +
    '</div>';
  }

  function _wireGoalsFNATab() {
    var tabBar = document.querySelector('.fna-tab-bar');
    if (!tabBar || document.getElementById('fna-tab-btn-goals')) return;

    var btn = document.createElement('button');
    btn.id = 'fna-tab-btn-goals';
    btn.className = 'fna-tab-btn';
    btn.innerHTML = '<i class="fas fa-bullseye"></i> Goals & Wealth';
    btn.onclick = function() {
      document.querySelectorAll('.fna-tab-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      document.querySelectorAll('.fna-tab-panel, [id^="fna-tab-"]').forEach(function(p){ p.style.display = 'none'; });
      var panel = document.getElementById('fna-goals-panel');
      if (panel) { panel.style.display = 'block'; return; }
      // Create panel and inject
      var container = document.querySelector('.fna-tab-content') || document.querySelector('.fna-body') || document.querySelector('.fna-content');
      if (!container) return;
      var div = document.createElement('div');
      div.id = 'fna-goals-panel';
      div.className = 'fna-tab-panel';
      div.innerHTML = _renderFNAGoalsTab('alex-rivera');
      container.appendChild(div);
    };
    tabBar.appendChild(btn);
  }

  // Patch navigateTo for FNA
  var _orig_nav_adv2 = navigateTo;
  navigateTo = function(page) {
    _orig_nav_adv2(page);
    if (page === 'fna') {
      setTimeout(function() { _wireGoalsFNATab(); }, 250);
    }
  };

  console.log('ADV Step 2 module loaded');
})();
