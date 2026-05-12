(function () {
  'use strict';
  console.log('RET Step 4 module loaded — FNA Retirement Profile tab');

  // ── Retirement profile data keyed by FNA client ───────────────────────────
  var _retProfiles = {
    'default': {
      clientName: 'Current Client',
      age: 45, retireAge: 65, yearsToRetire: 20,
      riskTolerance: 'Moderate', riskScore: 6,
      currentSavings: 180000, annualContrib: 18000,
      socialSecurity: 2200, pension: 0, otherIncome: 0,
      monthlyGoal: 7000,
      expenseBreakdown: [
        { label: 'Housing', monthly: 2200, pct: 31 },
        { label: 'Healthcare', monthly: 1400, pct: 20 },
        { label: 'Food & Lifestyle', monthly: 1100, pct: 16 },
        { label: 'Travel & Leisure', monthly: 900, pct: 13 },
        { label: 'Insurance', monthly: 700, pct: 10 },
        { label: 'Other', monthly: 700, pct: 10 }
      ],
      concerns: ['outliving savings', 'healthcare costs', 'market volatility'],
      aiNote: 'At age 45 with $180K saved and 20 years to retirement, this client needs to accelerate savings. A DIA purchased today locks in current rates and provides guaranteed income starting at 65. Recommend $120K premium for $1,800/mo guaranteed income.',
      projectedAtRetire: 680000,
      annuityRecommended: true,
      annuityType: 'DIA',
      annuityPremium: 120000,
      annuityIncome: 1800
    }
  };

  var _retCurrentProfile = null;

  // ── Tab renderer — called by FNA tab switcher ─────────────────────────────
  function renderFNARetirementTab(containerId, clientData) {
    var el = document.getElementById(containerId || 'fna-ret-tab-content');
    if (!el) return;

    // Merge client data with defaults
    var profile = Object.assign({}, _retProfiles['default'], clientData || {});
    _retCurrentProfile = profile;

    var monthlyProjected = Math.round(
      (profile.currentSavings * Math.pow(1.06, profile.yearsToRetire) * 0.04 / 12) +
      profile.socialSecurity + profile.pension + profile.otherIncome
    );
    var monthlyGap = Math.max(0, profile.monthlyGoal - monthlyProjected);
    var coveragePct = Math.min(100, Math.round((monthlyProjected / profile.monthlyGoal) * 100));
    var gapColor = coveragePct >= 100 ? '#059669' : coveragePct >= 80 ? '#d97706' : '#dc2626';

    el.innerHTML =
      // ── Summary KPIs ──
      '<div class="fna-ret-kpi-strip">' +
        _fnaRetKPI('fas fa-piggy-bank', '$' + _rfmt(profile.currentSavings), 'Current Savings', '#003087') +
        _fnaRetKPI('fas fa-calendar-alt', profile.retireAge, 'Target Retire Age', '#0891b2') +
        _fnaRetKPI('fas fa-chart-line', '$' + _rfmt(profile.projectedAtRetire), 'Projected at Retire', '#059669') +
        _fnaRetKPI('fas fa-bullseye', '$' + _rfmt(profile.monthlyGoal) + '/mo', 'Income Goal', '#374151') +
        _fnaRetKPI('fas fa-money-bill-wave', '$' + _rfmt(monthlyProjected) + '/mo', 'Projected Income', monthlyProjected >= profile.monthlyGoal ? '#059669' : '#d97706') +
        _fnaRetKPI('fas fa-exclamation-triangle', monthlyGap > 0 ? '$' + _rfmt(monthlyGap) + '/mo' : 'None', 'Income Gap', monthlyGap > 0 ? '#dc2626' : '#059669') +
      '</div>' +

      // ── Two-column body ──
      '<div class="fna-ret-body">' +

        // Left col: income waterfall + expense breakdown
        '<div class="fna-ret-col">' +

          '<div class="fna-ret-section">' +
            '<div class="fna-ret-section-title"><i class="fas fa-water"></i> Retirement Income Waterfall</div>' +
            _fnaRetWaterfallBar('Social Security', profile.socialSecurity, profile.monthlyGoal, '#6b7280') +
            (profile.pension > 0 ? _fnaRetWaterfallBar('Pension', profile.pension, profile.monthlyGoal, '#059669') : '') +
            _fnaRetWaterfallBar('Portfolio Withdrawals', Math.round(profile.projectedAtRetire * 0.04 / 12), profile.monthlyGoal, '#0891b2') +
            (profile.otherIncome > 0 ? _fnaRetWaterfallBar('Other Income', profile.otherIncome, profile.monthlyGoal, '#7c3aed') : '') +
            (monthlyGap > 0 ? _fnaRetWaterfallBar('⚠ Income Gap', monthlyGap, profile.monthlyGoal, '#dc2626', true) : '') +
            '<div class="fna-ret-coverage-row">' +
              '<span>Coverage</span>' +
              '<strong style="color:' + gapColor + '">' + coveragePct + '%</strong>' +
            '</div>' +
            '<div class="fna-ret-cov-bar-bg"><div class="fna-ret-cov-bar-fill" style="width:' + coveragePct + '%;background:' + gapColor + '"></div></div>' +
          '</div>' +

          '<div class="fna-ret-section">' +
            '<div class="fna-ret-section-title"><i class="fas fa-wallet"></i> Estimated Monthly Expenses</div>' +
            profile.expenseBreakdown.map(function(e) {
              return '<div class="fna-ret-expense-row">' +
                '<span class="fna-ret-exp-label">' + e.label + '</span>' +
                '<div class="fna-ret-exp-bar-bg"><div class="fna-ret-exp-bar-fill" style="width:' + e.pct + '%"></div></div>' +
                '<span class="fna-ret-exp-val">$' + _rfmt(e.monthly) + '</span>' +
                '<span class="fna-ret-exp-pct">' + e.pct + '%</span>' +
              '</div>';
            }).join('') +
            '<div class="fna-ret-expense-total">Total: $' + _rfmt(profile.monthlyGoal) + '/mo</div>' +
          '</div>' +

        '</div>' +

        // Right col: profile + AI recommendation
        '<div class="fna-ret-col">' +

          '<div class="fna-ret-section">' +
            '<div class="fna-ret-section-title"><i class="fas fa-user-circle"></i> Retirement Profile</div>' +
            '<div class="fna-ret-profile-grid">' +
              _fnaRetField('Current Age', profile.age) +
              _fnaRetField('Target Retirement', 'Age ' + profile.retireAge) +
              _fnaRetField('Years to Retire', profile.yearsToRetire + ' years') +
              _fnaRetField('Risk Tolerance', profile.riskTolerance) +
              _fnaRetField('Risk Score', profile.riskScore + ' / 10') +
              _fnaRetField('Annual Contribution', '$' + _rfmt(profile.annualContrib)) +
              _fnaRetField('Social Security (est)', '$' + _rfmt(profile.socialSecurity) + '/mo') +
              _fnaRetField('Pension Income', profile.pension > 0 ? '$' + _rfmt(profile.pension) + '/mo' : 'None') +
            '</div>' +
            '<div class="fna-ret-concerns">' +
              '<div class="fna-ret-section-title" style="margin-bottom:8px"><i class="fas fa-exclamation-circle"></i> Key Concerns</div>' +
              profile.concerns.map(function(c) {
                return '<span class="fna-ret-concern-chip">' + c + '</span>';
              }).join('') +
            '</div>' +
          '</div>' +

          // AI Annuity Recommendation
          (profile.annuityRecommended ?
          '<div class="fna-ret-ai-rec">' +
            '<div class="fna-ret-ai-rec-header">' +
              '<div class="fna-ret-ai-pulse"></div>' +
              '<span class="fna-ret-ai-label">AI Annuity Recommendation</span>' +
            '</div>' +
            '<div class="fna-ret-ai-body">' + profile.aiNote + '</div>' +
            '<div class="fna-ret-ai-product">' +
              '<div class="fna-ret-ai-product-type">' + profile.annuityType + '</div>' +
              '<div class="fna-ret-ai-product-detail">' +
                '<span>Premium: <strong>$' + _rfmt(profile.annuityPremium) + '</strong></span>' +
                '<span>Income: <strong>$' + _rfmt(profile.annuityIncome) + '/mo</strong></span>' +
                '<span>Starts: <strong>Age ' + profile.retireAge + '</strong></span>' +
              '</div>' +
            '</div>' +
            '<div class="fna-ret-ai-actions">' +
              '<button class="fna-ret-btn primary" onclick="fnaRetOpenIllustration()"><i class="fas fa-calculator"></i> Run Illustration</button>' +
              '<button class="fna-ret-btn secondary" onclick="fnaRetOpenProposal()"><i class="fas fa-file-alt"></i> Income Proposal</button>' +
            '</div>' +
          '</div>'
          : '') +

          // Savings projection card
          '<div class="fna-ret-section">' +
            '<div class="fna-ret-section-title"><i class="fas fa-chart-line"></i> Savings Projection</div>' +
            '<div class="fna-ret-proj-summary">' +
              '<div class="fna-ret-proj-item"><span>Today</span><strong>$' + _rfmt(profile.currentSavings) + '</strong></div>' +
              '<div class="fna-ret-proj-arrow">→</div>' +
              '<div class="fna-ret-proj-item"><span>At Age ' + profile.retireAge + '</span><strong style="color:#003087">$' + _rfmt(profile.projectedAtRetire) + '</strong></div>' +
              '<div class="fna-ret-proj-arrow">→</div>' +
              '<div class="fna-ret-proj-item"><span>Monthly Draw</span><strong style="color:#059669">$' + _rfmt(Math.round(profile.projectedAtRetire * 0.04 / 12)) + '/mo</strong></div>' +
            '</div>' +
            '<div style="font-size:10px;color:#9ca3af;margin-top:6px">Assumes 6% growth · 4% withdrawal rate · SECURE 2.0 RMD rules</div>' +
          '</div>' +

        '</div>' +
      '</div>';
  }

  function _fnaRetKPI(icon, val, lbl, color) {
    return '<div class="fna-ret-kpi">' +
      '<div class="fna-ret-kpi-icon" style="color:' + color + '"><i class="' + icon + '"></i></div>' +
      '<div class="fna-ret-kpi-val" style="color:' + color + '">' + val + '</div>' +
      '<div class="fna-ret-kpi-lbl">' + lbl + '</div>' +
    '</div>';
  }

  function _fnaRetWaterfallBar(label, monthly, goal, color, isGap) {
    var pct = Math.min(100, Math.round((monthly / goal) * 100));
    return '<div class="fna-ret-wfall-row">' +
      '<div class="fna-ret-wfall-label">' + label + '</div>' +
      '<div class="fna-ret-wfall-bar-bg">' +
        '<div class="fna-ret-wfall-bar-fill' + (isGap ? ' gap' : '') + '" style="width:' + pct + '%;background:' + color + '">' +
          '<span class="fna-ret-wfall-val">$' + _rfmt(monthly) + '/mo</span>' +
        '</div>' +
      '</div>' +
      '<div class="fna-ret-wfall-pct" style="color:' + color + '">' + pct + '%</div>' +
    '</div>';
  }

  function _fnaRetField(label, val) {
    return '<div class="fna-ret-field"><div class="fna-ret-field-lbl">' + label + '</div><div class="fna-ret-field-val">' + val + '</div></div>';
  }

  // ── Global hooks ─────────────────────────────────────────────────────────
  window.renderFNARetirementTab  = renderFNARetirementTab;
  window.fnaRetOpenIllustration  = function() { alert('Opening annuity illustration for retirement profile…'); };
  window.fnaRetOpenProposal      = function() { alert('Generating Retirement Income Proposal…'); };

  // ── Patch existing FNA tab switcher to add Retirement tab ─────────────────
  // The FNA page uses switchFNATab(tabName) — we extend it
  if (typeof switchFNATab === 'function') {
    var _orig_switchFNATab = switchFNATab;
    window.switchFNATab = function(tab) {
      _orig_switchFNATab(tab);
      if (tab === 'retirement') {
        // Hide all fna tabs, show retirement panel
        document.querySelectorAll('.fna-tab-panel').forEach(function(p) { p.style.display = 'none'; });
        var retPanel = document.getElementById('fna-tab-retirement');
        if (retPanel) { retPanel.style.display = 'block'; renderFNARetirementTab('fna-ret-tab-content'); }
      }
    };
  }

  // Also patch navigateTo so when FNA page loads, retirement tab is wired up
  var _orig_nav_ret4 = navigateTo;
  navigateTo = function(page) {
    _orig_nav_ret4(page);
    if (page === 'fna') {
      requestAnimationFrame(function() {
        setTimeout(function() {
          _wireRetirementFNATab();
        }, 200);
      });
    }
  };

  function _wireRetirementFNATab() {
    // Check if tab already exists
    var tabBar = document.querySelector('.fna-tab-bar, [class*="fna"][class*="tab"]');
    if (!tabBar) return;
    if (document.getElementById('fna-tab-btn-retirement')) return; // already wired

    // Add tab button
    var btn = document.createElement('button');
    btn.id = 'fna-tab-btn-retirement';
    btn.className = 'fna-tab-btn';
    btn.innerHTML = '<i class="fas fa-umbrella-beach"></i> Retirement Profile';
    btn.onclick = function() {
      tabBar.querySelectorAll('.fna-tab-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      document.querySelectorAll('.fna-tab-panel').forEach(function(p) { p.style.display = 'none'; });
      var retPanel = document.getElementById('fna-tab-retirement');
      if (!retPanel) {
        retPanel = document.createElement('div');
        retPanel.id = 'fna-tab-retirement';
        retPanel.className = 'fna-tab-panel';
        retPanel.innerHTML = '<div id="fna-ret-tab-content"></div>';
        var panels = document.querySelector('.fna-tab-panels, .fna-panels');
        if (panels) panels.appendChild(retPanel);
        else {
          // fallback — append after tab bar's parent
          tabBar.parentNode.appendChild(retPanel);
        }
      }
      retPanel.style.display = 'block';
      renderFNARetirementTab('fna-ret-tab-content');
    };
    tabBar.appendChild(btn);
  }

  function _rfmt(n) { return Number(n).toLocaleString(); }

  console.log('  RET Step 4 — FNA Retirement tab ready');

})(); // 'RET Step 4 module loaded'
