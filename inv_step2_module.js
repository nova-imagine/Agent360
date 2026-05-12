/* ═══════════════════════════════════════════════════════════════════
   INV TRACK STEP 2 MODULE
   ① FNA Investment Profile — 5th section in the FNA editor
   ② Products Investment Proposal — new main tab on Products page
   ═══════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────
     PART A: FNA INVESTMENT PROFILE SECTION
     Patches: _fnaEditorSections, _fnaEditorSectionLabels,
              renderFNAEditorSection(), fnaNavFooter() (if needed)
     Adds:   buildInvestmentProfileSection(fna)
     ───────────────────────────────────────────────────────────────── */

  // ── A1. Extend the sections array + labels ──────────────────────
  if (typeof _fnaEditorSections !== 'undefined'
      && _fnaEditorSections.indexOf('investment') === -1) {
    _fnaEditorSections.push('investment');
  }

  if (typeof _fnaEditorSectionLabels !== 'undefined'
      && _fnaEditorSectionLabels.length === 4) {
    _fnaEditorSectionLabels.push({
      label: 'Investment Profile',
      icon:  'fa-chart-pie',
      sub:   'Risk tolerance · Objectives · Time horizon · Tax · Experience · Suitability score'
    });
  }

  // ── A2. Patch renderFNAEditorSection to handle case 4 ──────────
  if (typeof renderFNAEditorSection === 'function') {
    var _orig_renderFNAEditorSection = renderFNAEditorSection;
    renderFNAEditorSection = function() {
      if (typeof _fnaEditorSection !== 'undefined' && _fnaEditorSection === 4) {
        var container = document.getElementById('fna-ed-body');
        if (!container) return;
        var fna = (typeof fnaFullData !== 'undefined' && typeof _fnaEditorId !== 'undefined')
          ? fnaFullData[_fnaEditorId] : null;
        if (!fna) return;
        container.innerHTML = buildInvestmentProfileSection(fna);
      } else {
        _orig_renderFNAEditorSection.apply(this, arguments);
      }
    };
  }

  // ── A3. Patch renderFNAEditorNav to activate 5th button ────────
  if (typeof renderFNAEditorNav === 'function') {
    var _orig_renderFNAEditorNav = renderFNAEditorNav;
    renderFNAEditorNav = function() {
      _orig_renderFNAEditorNav.apply(this, arguments);
      // Also activate/deactivate the 5th nav button (idx=4)
      var btn4 = document.getElementById('fna-ed-nav-4');
      if (btn4) {
        btn4.classList.toggle('active',
          typeof _fnaEditorSection !== 'undefined' && _fnaEditorSection === 4);
      }
      // Update subtitle for section 4
      if (typeof _fnaEditorSection !== 'undefined' && _fnaEditorSection === 4) {
        var sub = document.getElementById('fna-ed-section-sub');
        if (sub && typeof _fnaEditorId !== 'undefined' && typeof fnaFullData !== 'undefined') {
          var fna = fnaFullData[_fnaEditorId];
          if (fna) sub.textContent = 'Investment Profile — ' + fna.client;
        }
      }
    };
  }

  // ── A4. Investment profile data per FNA client ──────────────────
  var _invProfileData = {
    'FNA-001': {
      riskToleranceScore: 62,
      riskCategory: 'Moderate',
      riskColor: '#d97706',
      questionnaire: [
        { q: 'How would you react if your portfolio dropped 20% in one year?',
          a: 'I would be concerned but hold — I wouldn\'t sell', score: 3 },
        { q: 'What is your primary investment goal?',
          a: 'Balance growth and income', score: 3 },
        { q: 'How long before you need this money?',
          a: '10–15 years (retirement at 62)', score: 4 },
        { q: 'What portion of investable assets are you willing to put at risk?',
          a: 'Up to 50%', score: 3 },
        { q: 'How much investment experience do you have?',
          a: 'Moderate — 401(k), some mutual funds', score: 3 },
        { q: 'Do you have a specific income need from this portfolio?',
          a: 'Not yet — accumulation phase', score: 4 },
        { q: 'How important is liquidity?',
          a: 'Moderate — 6-month emergency fund maintained', score: 3 }
      ],
      objectives: ['Retirement income supplementation', 'College funding for twins', 'Estate building'],
      timeHorizon: '12 years (target retirement age 62)',
      timeHorizonYears: 12,
      taxSituation: {
        bracket: '32%',
        taxableAccounts: true,
        taxDeferredAccounts: true,
        rothAccounts: false,
        capitalGainsPreference: 'Prefer tax-deferred growth',
        notes: 'High bracket — prioritise tax-advantaged vehicles. Roth conversion opportunity if income dips.'
      },
      liquidityNeeds: {
        emergencyMonths: 6,
        nearTermNeeds: 'College tuition in 2–3 years (~$40K/yr × 2)',
        illiquidTolerance: 'Up to 20% illiquid'
      },
      experienceRating: {
        stocks: 'Moderate',
        bonds: 'Basic',
        alternatives: 'None',
        annuities: 'Limited',
        managedAccounts: 'Some — via employer 401(k)'
      },
      esgPreference: false,
      concentrationRisk: 'Employer stock: 12% of 401(k) — flagged for diversification',
      suitabilityScore: 78,
      suitabilityFlags: [
        { level: 'warn', msg: 'Employer stock concentration (12%) exceeds 5% guideline' },
        { level: 'warn', msg: 'No Roth assets — consider conversion window' },
        { level: 'info', msg: 'College need in 2–3 years warrants short-term sleeve' }
      ],
      recommendedAccountTypes: ['Traditional IRA Rollover', 'Taxable Brokerage', 'Managed Discretionary Account'],
      modelPortfolio: {
        name: 'Balanced Growth — 60/40',
        equity: 60, fixedIncome: 35, alternatives: 5,
        expectedReturn: '6.8%', stdDev: '9.2%', sharpe: '0.74'
      },
      aiSuitabilityNarrative: 'Patricia presents as a Moderate risk client with a 12-year accumulation horizon. High marginal bracket (32%) strongly favours tax-deferred vehicles. Employer stock concentration is the primary risk flag. With $167K in existing investments + $295K 401(k), a rollover + managed account structure is well-suited. College liquidity needs should be addressed with a short-term sleeve (~$80K in 2–3 year laddered bonds/CDs). Overall suitability score 78/100 — compliant for Moderate-risk advisory engagement.'
    },
    'FNA-002': {
      riskToleranceScore: 45,
      riskCategory: 'Conservative-Moderate',
      riskColor: '#6366f1',
      questionnaire: [
        { q: 'How would you react if your portfolio dropped 20%?',
          a: 'I would be very worried and might reduce equity', score: 2 },
        { q: 'What is your primary investment goal?',
          a: 'Preserve capital while keeping pace with inflation', score: 2 },
        { q: 'How long before you need this money?',
          a: '5–8 years', score: 3 },
        { q: 'What portion of investable assets are you willing to put at risk?',
          a: 'Up to 25%', score: 2 },
        { q: 'How much investment experience do you have?',
          a: 'Limited — mainly savings accounts and CDs', score: 2 },
        { q: 'Do you have a specific income need?',
          a: 'Yes — need reliable income stream', score: 2 },
        { q: 'How important is liquidity?',
          a: 'Very important', score: 2 }
      ],
      objectives: ['Capital preservation', 'Inflation protection', 'Steady income'],
      timeHorizon: '6 years',
      timeHorizonYears: 6,
      taxSituation: {
        bracket: '22%',
        taxableAccounts: true,
        taxDeferredAccounts: false,
        rothAccounts: true,
        capitalGainsPreference: 'Tax-efficient income',
        notes: 'Lower bracket — Roth contributions beneficial. Municipal bonds may not be optimal at 22%.'
      },
      liquidityNeeds: {
        emergencyMonths: 9,
        nearTermNeeds: 'Home renovation in 18 months (~$30K)',
        illiquidTolerance: 'Minimal — max 10% illiquid'
      },
      experienceRating: {
        stocks: 'Basic',
        bonds: 'Moderate',
        alternatives: 'None',
        annuities: 'None',
        managedAccounts: 'None'
      },
      esgPreference: true,
      concentrationRisk: 'None identified',
      suitabilityScore: 91,
      suitabilityFlags: [
        { level: 'ok', msg: 'Conservative profile well-aligned with short time horizon' },
        { level: 'info', msg: 'ESG preference noted — screen portfolio accordingly' }
      ],
      recommendedAccountTypes: ['Roth IRA', 'Taxable Brokerage (ESG)', 'Fixed Annuity'],
      modelPortfolio: {
        name: 'Conservative Income — 35/65',
        equity: 35, fixedIncome: 60, alternatives: 5,
        expectedReturn: '4.2%', stdDev: '5.8%', sharpe: '0.72'
      },
      aiSuitabilityNarrative: 'Client presents Conservative-Moderate with a 6-year horizon. ESG preference documented. Low risk tolerance and high liquidity need point to a bond-heavy portfolio with a near-term cash sleeve for the renovation. Roth IRA maximisation is appropriate at the 22% bracket. Fixed annuity provides income certainty. Suitability score 91/100 — strong alignment.'
    }
  };

  // Default profile for any FNA without specific data
  var _invProfileDefault = {
    riskToleranceScore: 55,
    riskCategory: 'Moderate',
    riskColor: '#d97706',
    questionnaire: [
      { q: 'How would you react if your portfolio dropped 20% in one year?', a: 'Hold and wait for recovery', score: 3 },
      { q: 'What is your primary investment goal?', a: 'Balanced growth and income', score: 3 },
      { q: 'How long before you need this money?', a: '10+ years', score: 4 },
      { q: 'What portion of investable assets are you willing to put at risk?', a: 'Up to 50%', score: 3 },
      { q: 'How much investment experience do you have?', a: 'Moderate', score: 3 },
      { q: 'Do you have a specific income need from this portfolio?', a: 'Not currently', score: 3 },
      { q: 'How important is liquidity?', a: 'Moderate', score: 3 }
    ],
    objectives: ['Long-term growth', 'Retirement income', 'Wealth preservation'],
    timeHorizon: '10+ years',
    timeHorizonYears: 12,
    taxSituation: {
      bracket: '24%', taxableAccounts: true, taxDeferredAccounts: true, rothAccounts: false,
      capitalGainsPreference: 'Prefer tax-deferred growth',
      notes: 'Mid bracket — balance taxable and tax-deferred.'
    },
    liquidityNeeds: { emergencyMonths: 6, nearTermNeeds: 'None identified', illiquidTolerance: 'Up to 20%' },
    experienceRating: { stocks: 'Moderate', bonds: 'Basic', alternatives: 'None', annuities: 'Limited', managedAccounts: 'None' },
    esgPreference: false,
    concentrationRisk: 'None identified',
    suitabilityScore: 75,
    suitabilityFlags: [
      { level: 'info', msg: 'Complete full questionnaire for precise suitability score' }
    ],
    recommendedAccountTypes: ['Managed Discretionary Account', 'Traditional IRA', 'Taxable Brokerage'],
    modelPortfolio: { name: 'Balanced Growth — 60/40', equity: 60, fixedIncome: 35, alternatives: 5, expectedReturn: '6.8%', stdDev: '9.2%', sharpe: '0.74' },
    aiSuitabilityNarrative: 'Client presents as Moderate risk. Complete the questionnaire to refine the suitability score. Based on available data, a 60/40 balanced portfolio is the preliminary recommendation.'
  };

  // ── A5. Build Investment Profile Section HTML ───────────────────
  window.buildInvestmentProfileSection = function(fna) {
    var inv = _invProfileData[fna.id] || _invProfileDefault;

    // ── Suitability score ring
    var score = inv.suitabilityScore;
    var scoreColor = score >= 85 ? '#16a34a' : score >= 70 ? '#d97706' : '#dc2626';
    var scoreLbl = score >= 85 ? 'High Suitability' : score >= 70 ? 'Suitable — Review Flags' : 'Low Suitability — Review Required';

    // ── Risk gauge bar width
    var riskPct = inv.riskToleranceScore;

    // ── Questionnaire rows
    var qRows = inv.questionnaire.map(function(item) {
      var dots = [1,2,3,4,5].map(function(d) {
        return '<span class="ip-q-dot' + (d <= item.score ? ' filled' : '') + '"></span>';
      }).join('');
      return '<div class="ip-q-row">'
        + '<div class="ip-q-text"><div class="ip-q-question">' + item.q + '</div>'
        +   '<div class="ip-q-answer"><i class="fas fa-comment-alt"></i> ' + item.a + '</div></div>'
        + '<div class="ip-q-score">' + dots + '<span class="ip-q-score-num">' + item.score + '/5</span></div>'
        + '</div>';
    }).join('');

    // ── Objectives tags
    var objTags = inv.objectives.map(function(o) {
      return '<span class="ip-obj-tag"><i class="fas fa-check"></i> ' + o + '</span>';
    }).join('');

    // ── Suitability flags
    var flagRows = inv.suitabilityFlags.map(function(f) {
      var icon = f.level === 'ok' ? 'fa-check-circle' : f.level === 'warn' ? 'fa-exclamation-triangle' : 'fa-info-circle';
      return '<div class="ip-flag ip-flag-' + f.level + '">'
        + '<i class="fas ' + icon + ' ip-flag-icon"></i>'
        + '<span class="ip-flag-msg">' + f.msg + '</span>'
        + '</div>';
    }).join('');

    // ── Account type chips
    var acctChips = inv.recommendedAccountTypes.map(function(a) {
      return '<span class="ip-acct-chip">' + a + '</span>';
    }).join('');

    // ── Model portfolio allocation bars
    var mp = inv.modelPortfolio;
    var allocBars = [
      { label: 'Equity', pct: mp.equity, color: '#3b82f6' },
      { label: 'Fixed Income', pct: mp.fixedIncome, color: '#10b981' },
      { label: 'Alternatives', pct: mp.alternatives, color: '#8b5cf6' }
    ].map(function(seg) {
      return '<div class="ip-alloc-row">'
        + '<div class="ip-alloc-lbl">' + seg.label + '</div>'
        + '<div class="ip-alloc-bar-track"><div class="ip-alloc-bar-fill" style="width:' + seg.pct + '%;background:' + seg.color + '"></div></div>'
        + '<div class="ip-alloc-pct">' + seg.pct + '%</div>'
        + '</div>';
    }).join('');

    // ── Experience rating rows
    var expRows = Object.entries(inv.experienceRating).map(function(e) {
      var val = e[1];
      var cls = val === 'None' ? 'ip-exp-none' : val === 'Basic' || val === 'Limited' ? 'ip-exp-low' : val === 'Moderate' || val === 'Some' ? 'ip-exp-mid' : 'ip-exp-high';
      return '<div class="ip-exp-row"><span class="ip-exp-cat">' + e[0].replace(/([A-Z])/g, ' $1').trim() + '</span>'
        + '<span class="ip-exp-val ' + cls + '">' + val + '</span></div>';
    }).join('');

    // ── Tax situation rows
    var ts = inv.taxSituation;
    var acctTypePills = [
      { label: 'Taxable', active: ts.taxableAccounts },
      { label: 'Tax-Deferred', active: ts.taxDeferredAccounts },
      { label: 'Roth', active: ts.rothAccounts }
    ].map(function(p) {
      return '<span class="ip-tax-pill' + (p.active ? ' active' : '') + '">'
        + (p.active ? '<i class="fas fa-check"></i> ' : '<i class="fas fa-times"></i> ') + p.label + '</span>';
    }).join('');

    return '<div class="ip-section">'

      // ── TOP ROW: Risk Gauge + Suitability Score
      + '<div class="ip-top-row">'

        // Risk tolerance card
        + '<div class="ip-risk-card">'
        +   '<div class="ip-card-title"><i class="fas fa-tachometer-alt"></i> Risk Tolerance Assessment</div>'
        +   '<div class="ip-risk-gauge-wrap">'
        +     '<div class="ip-risk-category" style="color:' + inv.riskColor + '">' + inv.riskCategory + '</div>'
        +     '<div class="ip-risk-score-num">' + inv.riskToleranceScore + '<span class="ip-risk-score-denom">/100</span></div>'
        +     '<div class="ip-risk-bar-track">'
        +       '<div class="ip-risk-bar-fill" style="width:' + riskPct + '%;background:' + inv.riskColor + '"></div>'
        +     '</div>'
        +     '<div class="ip-risk-scale">'
        +       '<span>Conservative</span><span>Moderate</span><span>Aggressive</span>'
        +     '</div>'
        +   '</div>'
        +   '<div class="ip-ai-chip-row">'
        +     '<span class="ip-ai-chip"><i class="fas fa-robot"></i> AI-scored</span>'
        +     '<span class="ip-esg-chip' + (inv.esgPreference ? ' active' : '') + '">'
        +       '<i class="fas fa-leaf"></i> ESG' + (inv.esgPreference ? ' Preference' : ' N/A') + '</span>'
        +   '</div>'
        + '</div>'

        // Suitability score card
        + '<div class="ip-suit-card">'
        +   '<div class="ip-card-title"><i class="fas fa-check-shield"></i> Regulatory Suitability Score</div>'
        +   '<div class="ip-suit-ring-wrap">'
        +     '<svg class="ip-suit-ring" viewBox="0 0 100 100">'
        +       '<circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" stroke-width="10"/>'
        +       '<circle cx="50" cy="50" r="42" fill="none" stroke="' + scoreColor + '" stroke-width="10"'
        +         ' stroke-dasharray="' + (2 * 3.14159 * 42 * score / 100).toFixed(1) + ' 264"'
        +         ' stroke-linecap="round" transform="rotate(-90 50 50)"/>'
        +       '<text x="50" y="46" text-anchor="middle" class="ip-ring-num" fill="' + scoreColor + '">' + score + '</text>'
        +       '<text x="50" y="60" text-anchor="middle" class="ip-ring-sub" fill="#6b7280">/100</text>'
        +     '</svg>'
        +     '<div class="ip-suit-lbl" style="color:' + scoreColor + '">' + scoreLbl + '</div>'
        +   '</div>'
        +   '<div class="ip-suit-flags">' + flagRows + '</div>'
        + '</div>'

      + '</div>' // ip-top-row

      // ── QUESTIONNAIRE
      + '<div class="ip-card">'
      +   '<div class="ip-card-title"><i class="fas fa-clipboard-list"></i> Risk Tolerance Questionnaire</div>'
      +   '<div class="ip-q-list">' + qRows + '</div>'
      + '</div>'

      // ── OBJECTIVES + TIME HORIZON
      + '<div class="ip-two-col">'

        + '<div class="ip-card">'
        +   '<div class="ip-card-title"><i class="fas fa-bullseye"></i> Investment Objectives</div>'
        +   '<div class="ip-obj-tags">' + objTags + '</div>'
        +   '<div class="ip-card-title" style="margin-top:16px"><i class="fas fa-clock"></i> Time Horizon</div>'
        +   '<div class="ip-horizon-display">'
        +     '<div class="ip-horizon-num">' + inv.timeHorizonYears + '<span>yrs</span></div>'
        +     '<div class="ip-horizon-lbl">' + inv.timeHorizon + '</div>'
        +   '</div>'
        + '</div>'

        + '<div class="ip-card">'
        +   '<div class="ip-card-title"><i class="fas fa-briefcase"></i> Investment Experience</div>'
        +   '<div class="ip-exp-table">' + expRows + '</div>'
        +   '<div class="ip-card-title" style="margin-top:16px"><i class="fas fa-tint"></i> Liquidity Needs</div>'
        +   '<div class="ip-liquidity-rows">'
        +     '<div class="ip-liq-row"><span class="ip-liq-lbl">Emergency Fund</span><span class="ip-liq-val">' + inv.liquidityNeeds.emergencyMonths + ' months</span></div>'
        +     '<div class="ip-liq-row"><span class="ip-liq-lbl">Near-Term Needs</span><span class="ip-liq-val ip-liq-val-sm">' + inv.liquidityNeeds.nearTermNeeds + '</span></div>'
        +     '<div class="ip-liq-row"><span class="ip-liq-lbl">Illiquid Tolerance</span><span class="ip-liq-val">' + inv.liquidityNeeds.illiquidTolerance + '</span></div>'
        +   '</div>'
        + '</div>'

      + '</div>' // ip-two-col

      // ── TAX SITUATION
      + '<div class="ip-card">'
      +   '<div class="ip-card-title"><i class="fas fa-percentage"></i> Tax Situation</div>'
      +   '<div class="ip-tax-row">'
      +     '<div class="ip-tax-bracket-wrap">'
      +       '<div class="ip-tax-bracket-lbl">Marginal Bracket</div>'
      +       '<div class="ip-tax-bracket-val">' + ts.bracket + '</div>'
      +     '</div>'
      +     '<div class="ip-tax-pills">' + acctTypePills + '</div>'
      +   '</div>'
      +   '<div class="ip-tax-pref"><i class="fas fa-info-circle"></i> ' + ts.capitalGainsPreference + '</div>'
      +   '<div class="ip-tax-notes">' + ts.notes + '</div>'
      + '</div>'

      // ── CONCENTRATION RISK
      + (inv.concentrationRisk !== 'None identified'
        ? '<div class="ip-conc-risk-bar"><i class="fas fa-exclamation-triangle"></i> <strong>Concentration Risk:</strong> ' + inv.concentrationRisk + '</div>'
        : '')

      // ── RECOMMENDED ACCOUNT TYPES
      + '<div class="ip-card">'
      +   '<div class="ip-card-title"><i class="fas fa-layer-group"></i> Recommended Account Types</div>'
      +   '<div class="ip-acct-chips">' + acctChips + '</div>'
      + '</div>'

      // ── MODEL PORTFOLIO
      + '<div class="ip-card ip-model-card">'
      +   '<div class="ip-card-title"><i class="fas fa-chart-pie"></i> Preliminary Model Portfolio</div>'
      +   '<div class="ip-model-header">'
      +     '<div class="ip-model-name">' + mp.name + '</div>'
      +     '<div class="ip-model-stats">'
      +       '<div class="ip-model-stat"><div class="ip-model-stat-val">' + mp.expectedReturn + '</div><div class="ip-model-stat-lbl">Expected Return</div></div>'
      +       '<div class="ip-model-stat"><div class="ip-model-stat-val">' + mp.stdDev + '</div><div class="ip-model-stat-lbl">Std Deviation</div></div>'
      +       '<div class="ip-model-stat"><div class="ip-model-stat-val">' + mp.sharpe + '</div><div class="ip-model-stat-lbl">Sharpe Ratio</div></div>'
      +     '</div>'
      +   '</div>'
      +   '<div class="ip-alloc-bars">' + allocBars + '</div>'
      + '</div>'

      // ── AI SUITABILITY NARRATIVE
      + '<div class="ip-ai-narrative-card">'
      +   '<div class="ip-ai-nar-header"><i class="fas fa-robot"></i> AI Suitability Analysis</div>'
      +   '<div class="ip-ai-nar-text">' + inv.aiSuitabilityNarrative + '</div>'
      +   '<div class="ip-ai-nar-actions">'
      +     '<button class="ip-ai-btn" onclick="ipRunSuitabilityCheck()"><i class="fas fa-sync"></i> Re-run Analysis</button>'
      +     '<button class="ip-ai-btn outline" onclick="ipExportSuitabilityReport()"><i class="fas fa-file-pdf"></i> Export Report</button>'
      +     '<button class="ip-ai-btn outline" onclick="ipLinkToInvAccounts()"><i class="fas fa-link"></i> Link to Investment Account</button>'
      +   '</div>'
      + '</div>'

      // ── FOOTER NAV
      + ipSectionFooter()

    + '</div>'; // ip-section
  };

  function ipSectionFooter() {
    return '<div class="fna-ed-footer">'
      + '<button class="fna-ed-prev-btn" onclick="fnaEditorNav(3)"><i class="fas fa-arrow-left"></i> Coverage Needs</button>'
      + '<div class="fna-ed-footer-actions">'
      +   '<button class="fna-ed-save-btn" onclick="ipSaveProfile()"><i class="fas fa-save"></i> Save Profile</button>'
      +   '<button class="fna-ed-complete-btn" onclick="ipCompleteAndLaunch()"><i class="fas fa-rocket"></i> Save &amp; Launch Proposal</button>'
      + '</div>'
      + '</div>';
  }

  // ── A6. Action stubs ────────────────────────────────────────────
  window.ipRunSuitabilityCheck = function() {
    var btn = event.target.closest('button');
    if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analysing…'; btn.disabled = true; }
    setTimeout(function() {
      if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> Analysis Complete'; btn.disabled = false; }
    }, 1800);
  };

  window.ipExportSuitabilityReport = function() {
    alert('Suitability Report PDF export — connected to compliance document generation.');
  };

  window.ipLinkToInvAccounts = function() {
    _closeFNAEditorForce();
    if (typeof navigateTo === 'function') navigateTo('inv-accounts');
  };

  window.ipSaveProfile = function() {
    var btn = event.target.closest('button');
    if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving…'; btn.disabled = true; }
    setTimeout(function() {
      if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> Saved'; btn.disabled = false; }
    }, 900);
  };

  window.ipCompleteAndLaunch = function() {
    _closeFNAEditorForce();
    if (typeof navigateTo === 'function') navigateTo('products');
    setTimeout(function() {
      if (typeof p3SwitchMainTab === 'function') p3SwitchMainTab('investment');
    }, 400);
  };


  /* ─────────────────────────────────────────────────────────────────
     PART B: PRODUCTS PAGE — INVESTMENT PROPOSAL TAB
     Strategy: Wrap p3RenderMainPanel to inject a tab strip above
     the existing content, then intercept tab switching.
     ───────────────────────────────────────────────────────────────── */

  // ── B1. State variable for Products main tab ───────────────────
  window._p3MainTab = window._p3MainTab || 'insurance';

  window.p3SwitchMainTab = function(tab) {
    window._p3MainTab = tab;
    p3RenderMainPanel();
  };

  // ── B2. Investment Proposal data per prospect ──────────────────
  var _invProposalData = {
    'FNA-001': {
      prospectName: 'Patricia L.',
      preparedDate: 'Jun 10, 2025',
      advisor: 'Agent — M. Reyes',
      suitabilityScore: 78,
      riskProfile: 'Moderate',
      timeHorizon: '12 years',
      accountRecommendations: [
        {
          type: 'Traditional IRA Rollover',
          icon: 'fa-piggy-bank',
          color: '#3b82f6',
          rationale: 'Roll existing 401(k) ($295K) to IRA for broader fund access and lower fees',
          aum: 295000,
          model: 'Balanced Growth 60/40',
          estAnnualFee: '0.85%'
        },
        {
          type: 'Managed Discretionary Account',
          icon: 'fa-chart-line',
          color: '#059669',
          rationale: 'Taxable brokerage for $167K existing investments — managed for tax efficiency',
          aum: 167000,
          model: 'Tax-Managed Equity 70/30',
          estAnnualFee: '1.00%'
        },
        {
          type: 'Short-Term Bond Sleeve',
          icon: 'fa-shield-alt',
          color: '#d97706',
          rationale: 'College funding in 2–3 years — laddered bonds/CDs for twins ($80K target)',
          aum: 80000,
          model: 'Short Duration Bond',
          estAnnualFee: '0.45%'
        }
      ],
      totalAUM: 542000,
      blendedFee: '0.87%',
      projections: [
        { year: 1,  age: 49,  conservative: 557000,  base: 579000,  optimistic: 601000 },
        { year: 3,  age: 51,  conservative: 589000,  base: 638000,  optimistic: 687000 },
        { year: 5,  age: 53,  conservative: 621000,  base: 698000,  optimistic: 781000 },
        { year: 10, age: 58,  conservative: 693000,  base: 836000,  optimistic: 993000 },
        { year: 12, age: 60,  conservative: 718000,  base: 895000,  optimistic: 1084000 }
      ],
      complianceChecks: [
        { rule: 'Suitability — FINRA Rule 2111', status: 'pass', note: 'Moderate profile supports 60/40 allocation' },
        { rule: 'Best Interest — Reg BI', status: 'pass', note: 'Fee disclosure completed; alternatives documented' },
        { rule: 'Form ADV Part 2 Delivered', status: 'warn', note: 'Pending client signature acknowledgment' },
        { rule: 'Concentration Risk Check', status: 'warn', note: 'Employer stock 12% — reduction plan documented' },
        { rule: 'Liquidity Risk Disclosure', status: 'pass', note: 'Short-term sleeve addresses liquidity needs' }
      ],
      aiNarrative: 'This Balanced Growth proposal consolidates Patricia\'s $542K investable assets into three complementary sleeves addressing retirement accumulation, tax efficiency, and near-term college liquidity. The 60/40 IRA rollover is the core vehicle; the managed taxable account harvests losses for tax efficiency at the 32% bracket; the short bond sleeve protects the college fund. Projected portfolio value at retirement (age 60): $895K base case — sufficient to supplement Social Security and life insurance income replacement. All-in fee of 0.87% is below the 1% benchmark for this AUM tier.'
    },
    'FNA-002': {
      prospectName: 'James R.',
      preparedDate: 'Jun 10, 2025',
      advisor: 'Agent — M. Reyes',
      suitabilityScore: 91,
      riskProfile: 'Conservative-Moderate',
      timeHorizon: '6 years',
      accountRecommendations: [
        {
          type: 'Roth IRA',
          icon: 'fa-leaf',
          color: '#059669',
          rationale: 'Max Roth contributions ($7,000/yr) for tax-free growth at 22% bracket',
          aum: 42000,
          model: 'ESG Conservative Income',
          estAnnualFee: '0.65%'
        },
        {
          type: 'ESG Taxable Brokerage',
          icon: 'fa-seedling',
          color: '#16a34a',
          rationale: 'ESG-screened portfolio for core savings — tax-efficient dividend income',
          aum: 95000,
          model: 'ESG Balanced 35/65',
          estAnnualFee: '0.75%'
        }
      ],
      totalAUM: 137000,
      blendedFee: '0.72%',
      projections: [
        { year: 1,  age: 36,  conservative: 141000,  base: 145000,  optimistic: 149000 },
        { year: 3,  age: 38,  conservative: 148000,  base: 158000,  optimistic: 168000 },
        { year: 5,  age: 40,  conservative: 154000,  base: 172000,  optimistic: 190000 },
        { year: 6,  age: 41,  conservative: 157000,  base: 179000,  optimistic: 200000 }
      ],
      complianceChecks: [
        { rule: 'Suitability — FINRA Rule 2111', status: 'pass', note: 'Conservative-Moderate profile supports 35/65 ESG allocation' },
        { rule: 'Best Interest — Reg BI', status: 'pass', note: 'ESG preference documented; fee disclosure signed' },
        { rule: 'Form ADV Part 2 Delivered', status: 'pass', note: 'Acknowledged and signed' },
        { rule: 'ESG Disclosure — SEC Guidance', status: 'pass', note: 'ESG criteria and screening methodology disclosed' }
      ],
      aiNarrative: 'James\'s Conservative-Moderate profile with ESG preference is well-served by this two-sleeve structure. The Roth IRA prioritises tax-free growth given the 22% bracket, while the ESG taxable account provides a tax-efficient income stream. At a 6-year horizon, the 35/65 allocation appropriately limits volatility. Projected value at year 6: $179K base case — on track for goals. All-in fee 0.72% is competitive for ESG-screened managed accounts.'
    }
  };

  // ── B3. Patch p3RenderMainPanel ────────────────────────────────
  if (typeof p3RenderMainPanel === 'function') {
    var _orig_p3RenderMainPanel = p3RenderMainPanel;
    p3RenderMainPanel = function() {
      _orig_p3RenderMainPanel.apply(this, arguments);

      // Now inject the tab strip and, if investment tab is active, replace content
      var panel = document.getElementById('p3-main-panel');
      if (!panel) return;

      var pr = (typeof p3Prospects !== 'undefined' && typeof _p3ActiveProspect !== 'undefined')
        ? p3Prospects.find(function(p) { return p.id === _p3ActiveProspect; }) : null;
      if (!pr) return;

      // Insert tab strip at top of panel (after header strip)
      var existingTabs = panel.querySelector('.p3-main-tabs');
      if (!existingTabs) {
        var tabStrip = document.createElement('div');
        tabStrip.className = 'p3-main-tabs';
        tabStrip.innerHTML = invpBuildTabStrip();

        // Insert after the header strip (first child)
        var headerStrip = panel.querySelector('.p3-panel-header, .p3-panel-header.urgent, .p3-panel-header.high');
        if (headerStrip && headerStrip.nextSibling) {
          panel.insertBefore(tabStrip, headerStrip.nextSibling);
        } else {
          panel.insertBefore(tabStrip, panel.firstChild);
        }
      } else {
        existingTabs.innerHTML = invpBuildTabStrip();
      }

      // If investment tab is active, render investment proposal over the main content
      if (window._p3MainTab === 'investment') {
        // Remove everything after the tab strip and replace with investment proposal
        var tabs = panel.querySelector('.p3-main-tabs');
        var children = Array.prototype.slice.call(panel.children);
        var afterTabs = false;
        children.forEach(function(child) {
          if (afterTabs) panel.removeChild(child);
          if (child === tabs) afterTabs = true;
        });

        var invDiv = document.createElement('div');
        invDiv.className = 'invp-wrap';
        invDiv.innerHTML = invpBuildProposalView(pr);
        panel.appendChild(invDiv);
      }
    };
  }

  function invpBuildTabStrip() {
    var isIns = window._p3MainTab !== 'investment';
    var isInv = window._p3MainTab === 'investment';
    return '<button class="p3-main-tab-btn' + (isIns ? ' active' : '') + '" onclick="p3SwitchMainTab(\'insurance\')">'
      + '<i class="fas fa-file-contract"></i> Insurance Proposal</button>'
      + '<button class="p3-main-tab-btn' + (isInv ? ' active' : '') + '" onclick="p3SwitchMainTab(\'investment\')">'
      + '<i class="fas fa-chart-line"></i> Investment Proposal</button>';
  }

  function invpBuildProposalView(pr) {
    var inv = _invProposalData[pr.id] || invpBuildDefaultProposal(pr);

    // ── KPI strip
    var kpiHtml = '<div class="invp-kpi-strip">'
      + '<div class="invp-kpi"><div class="invp-kpi-val">$' + inv.totalAUM.toLocaleString() + '</div><div class="invp-kpi-lbl">Total AUM</div></div>'
      + '<div class="invp-kpi"><div class="invp-kpi-val">' + inv.blendedFee + '</div><div class="invp-kpi-lbl">Blended Fee</div></div>'
      + '<div class="invp-kpi"><div class="invp-kpi-val">' + inv.riskProfile + '</div><div class="invp-kpi-lbl">Risk Profile</div></div>'
      + '<div class="invp-kpi"><div class="invp-kpi-val">' + inv.timeHorizon + '</div><div class="invp-kpi-lbl">Time Horizon</div></div>'
      + '<div class="invp-kpi"><div class="invp-kpi-val invp-suit-val" style="color:' + (inv.suitabilityScore >= 85 ? '#16a34a' : inv.suitabilityScore >= 70 ? '#d97706' : '#dc2626') + '">'
      + inv.suitabilityScore + '<span class="invp-suit-denom">/100</span></div><div class="invp-kpi-lbl">Suitability</div></div>'
      + '</div>';

    // ── Header bar
    var headerHtml = '<div class="invp-header">'
      + '<div class="invp-header-left">'
      +   '<div class="invp-header-title"><i class="fas fa-chart-line"></i> Investment Proposal — ' + inv.prospectName + '</div>'
      +   '<div class="invp-header-meta">Prepared ' + inv.preparedDate + ' · ' + inv.advisor + '</div>'
      + '</div>'
      + '<div class="invp-header-right">'
      +   '<button class="invp-btn primary" onclick="invpOpenToIAModule()"><i class="fas fa-external-link-alt"></i> Open in Accounts</button>'
      +   '<button class="invp-btn outline" onclick="invpExportProposal()"><i class="fas fa-file-pdf"></i> Export</button>'
      + '</div>'
      + '</div>';

    // ── Account recommendation cards
    var acctCards = inv.accountRecommendations.map(function(acct) {
      return '<div class="invp-acct-card">'
        + '<div class="invp-acct-icon" style="background:' + acct.color + '18;color:' + acct.color + '">'
        +   '<i class="fas ' + acct.icon + '"></i>'
        + '</div>'
        + '<div class="invp-acct-info">'
        +   '<div class="invp-acct-type">' + acct.type + '</div>'
        +   '<div class="invp-acct-model">' + acct.model + '</div>'
        +   '<div class="invp-acct-rationale">' + acct.rationale + '</div>'
        + '</div>'
        + '<div class="invp-acct-right">'
        +   '<div class="invp-acct-aum">$' + acct.aum.toLocaleString() + '</div>'
        +   '<div class="invp-acct-fee">' + acct.estAnnualFee + ' /yr</div>'
        + '</div>'
        + '</div>';
    }).join('');

    // ── Projection table
    var projRows = inv.projections.map(function(row) {
      return '<tr>'
        + '<td>Year ' + row.year + '</td>'
        + '<td>Age ' + row.age + '</td>'
        + '<td class="invp-proj-cons">$' + row.conservative.toLocaleString() + '</td>'
        + '<td class="invp-proj-base">$' + row.base.toLocaleString() + '</td>'
        + '<td class="invp-proj-opt">$' + row.optimistic.toLocaleString() + '</td>'
        + '</tr>';
    }).join('');

    var projHtml = '<div class="invp-card invp-proj-card">'
      + '<div class="invp-card-title"><i class="fas fa-chart-area"></i> Projected Portfolio Value</div>'
      + '<div class="invp-proj-legend">'
      +   '<span class="invp-leg-dot cons"></span><span>Conservative</span>'
      +   '<span class="invp-leg-dot base"></span><span>Base Case</span>'
      +   '<span class="invp-leg-dot opt"></span><span>Optimistic</span>'
      + '</div>'
      + '<div class="invp-table-wrap"><table class="invp-proj-table">'
      + '<thead><tr><th>Period</th><th>Age</th>'
      + '<th class="invp-proj-cons">Conservative</th>'
      + '<th class="invp-proj-base">Base Case</th>'
      + '<th class="invp-proj-opt">Optimistic</th>'
      + '</tr></thead>'
      + '<tbody>' + projRows + '</tbody>'
      + '</table></div>'
      + '<div class="invp-proj-footnote">† Projections are illustrative. Not a guarantee. Conservative = 75th percentile; Base = median; Optimistic = 25th percentile Monte Carlo.</div>'
      + '</div>';

    // ── Compliance
    var compRows = inv.complianceChecks.map(function(c) {
      var icon = c.status === 'pass' ? 'fa-check-circle' : c.status === 'warn' ? 'fa-exclamation-triangle' : 'fa-times-circle';
      return '<div class="invp-comp-row invp-comp-' + c.status + '">'
        + '<i class="fas ' + icon + ' invp-comp-icon"></i>'
        + '<div class="invp-comp-body">'
        +   '<div class="invp-comp-rule">' + c.rule + '</div>'
        +   '<div class="invp-comp-note">' + c.note + '</div>'
        + '</div>'
        + '</div>';
    }).join('');

    var hasWarn = inv.complianceChecks.some(function(c) { return c.status !== 'pass'; });

    var compHtml = '<div class="invp-card invp-comp-card">'
      + '<div class="invp-comp-header">'
      +   '<div class="invp-card-title"><i class="fas fa-shield-alt"></i> Compliance &amp; Reg BI Check</div>'
      +   '<span class="invp-comp-badge ' + (hasWarn ? 'warn' : 'pass') + '">'
      +     (hasWarn ? '<i class="fas fa-exclamation-triangle"></i> Review Needed' : '<i class="fas fa-check-shield"></i> All Clear')
      +   '</span>'
      + '</div>'
      + '<div class="invp-comp-rows">' + compRows + '</div>'
      + '</div>';

    // ── AI Narrative
    var aiHtml = '<div class="invp-ai-card">'
      + '<div class="invp-ai-header"><i class="fas fa-robot"></i> AI Investment Analysis</div>'
      + '<div class="invp-ai-text">' + inv.aiNarrative + '</div>'
      + '<div class="invp-ai-actions">'
      +   '<button class="invp-btn primary" onclick="invpOpenToIAModule()"><i class="fas fa-link"></i> Link to Investment Account</button>'
      +   '<button class="invp-btn outline" onclick="invpRunCompliance()"><i class="fas fa-sync"></i> Re-run Compliance</button>'
      +   '<button class="invp-btn outline" onclick="invpScheduleReview()"><i class="fas fa-calendar-check"></i> Schedule Review</button>'
      + '</div>'
      + '</div>';

    return headerHtml
      + kpiHtml
      + '<div class="invp-card">'
      +   '<div class="invp-card-title"><i class="fas fa-layer-group"></i> Account Recommendations</div>'
      +   '<div class="invp-acct-cards">' + acctCards + '</div>'
      + '</div>'
      + projHtml
      + compHtml
      + aiHtml;
  }

  function invpBuildDefaultProposal(pr) {
    return {
      prospectName: pr.name,
      preparedDate: 'Jun 10, 2025',
      advisor: 'Agent — M. Reyes',
      suitabilityScore: 75,
      riskProfile: pr.riskClass || 'Moderate',
      timeHorizon: '10+ years',
      accountRecommendations: [
        {
          type: 'Managed Discretionary Account',
          icon: 'fa-chart-line',
          color: '#3b82f6',
          rationale: 'Core investment account aligned with risk profile and objectives',
          aum: pr.coverageNeeded ? Math.round(pr.coverageNeeded * 0.15) : 100000,
          model: 'Balanced Growth 60/40',
          estAnnualFee: '0.90%'
        }
      ],
      totalAUM: pr.coverageNeeded ? Math.round(pr.coverageNeeded * 0.15) : 100000,
      blendedFee: '0.90%',
      projections: [
        { year: 5,  age: (pr.age || 40) + 5,  conservative: 118000, base: 135000, optimistic: 152000 },
        { year: 10, age: (pr.age || 40) + 10, conservative: 138000, base: 170000, optimistic: 205000 }
      ],
      complianceChecks: [
        { rule: 'Suitability — FINRA Rule 2111', status: 'pass', note: 'Profile aligned with recommended allocation' },
        { rule: 'Best Interest — Reg BI', status: 'pass', note: 'Fee and alternatives documentation complete' }
      ],
      aiNarrative: 'Preliminary investment proposal based on available FNA data. Complete the Investment Profile section for a fully personalised analysis and accurate suitability scoring.'
    };
  }

  // ── B4. Action stubs ────────────────────────────────────────────
  window.invpOpenToIAModule = function() {
    if (typeof navigateTo === 'function') navigateTo('inv-accounts');
  };

  window.invpExportProposal = function() {
    alert('Investment Proposal PDF export — connected to proposal generation workflow.');
  };

  window.invpRunCompliance = function() {
    var btn = event && event.target ? event.target.closest('button') : null;
    if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running…'; btn.disabled = true; }
    setTimeout(function() {
      if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> Complete'; btn.disabled = false; }
    }, 1600);
  };

  window.invpScheduleReview = function() {
    alert('Schedule Investment Review — calendar integration coming in Step 4.');
  };

  console.log('[INV Step 2] Investment Profile (FNA) + Investment Proposal (Products) loaded.');

})();
