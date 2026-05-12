/* ═══════════════════════════════════════════════════════════════════════
   RET Step 2 — Annuity Accounts Page
   Guard: 'RET Step 2 module loaded'
   ═══════════════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  /* ── 1. CONTRACT DATA ─────────────────────────────────────────────── */
  var _raContracts = {

    'ANN-JW-001': {
      id: 'ANN-JW-001', clientId: 1, clientName: 'James Whitfield', initials: 'JW',
      avatarGrad: 'linear-gradient(135deg,#0891b2,#22d3ee)',
      contractNum: 'NYL-VA-2024-00291', productType: 'Variable Annuity (VA)',
      typeCode: 'va', issuer: 'New York Life Insurance and Annuity Corp.',
      premium: 150000, premiumFmt: '$150,000', paymentMode: 'Single Premium',
      issueDate: 'Feb 14, 2024', contractDate: 'Feb 14, 2024',
      surrenderEndDate: 'Feb 14, 2031', contractAge: '2 yrs 3 mo',
      phase: 'accumulating', status: 'Active — Accumulating',
      accountValue: 178400, accountValueFmt: '$178,400',
      surrenderValue: 160560, surrenderValueFmt: '$160,560',
      surrenderCharge: '7% yr1 → 0% yr8',
      freeWithdrawal: '10% of account value/yr',
      incomeRiderValue: 192600, incomeRiderValueFmt: '$192,600',
      incomeRiderGrowth: '7% annual rollup (compound)',
      guaranteedIncome: 1870, guaranteedIncomeFmt: '$1,870/mo',
      incomeStartAge: 67, incomeStartYear: 2039,
      riders: ['Guaranteed Minimum Withdrawal Benefit (GMWB)', 'Enhanced Death Benefit Step-Up', 'Waiver of Surrender Charge (Nursing Home)'],
      subAccounts: [
        { name: 'NYL Growth Fund', allocation: 40, value: 71360, ytd: '+12.4%', benchmark: 'S&P 500' },
        { name: 'NYL Balanced Fund', allocation: 35, value: 62440, ytd: '+7.8%', benchmark: 'Blended' },
        { name: 'NYL Bond Index', allocation: 25, value: 44600, ytd: '+3.1%', benchmark: 'Bloomberg Agg' }
      ],
      incomeGap: 2100, incomeGapFmt: '$2,100/mo',
      gapCovered: 89, /* pct of gap covered at income start */
      nextAnniversary: 'Feb 14, 2027',
      reviewStatus: 'overdue', lastReview: 'Feb 2025', nextReview: 'Feb 2026',
      beneficiaries: [
        { role: 'Primary', name: 'Emily Whitfield', relation: 'Spouse', pct: 100 }
      ],
      suitability: { riskProfile: 'Moderate-Aggressive', score: 93, horizon: '15 years (to age 67)', liquidity: 'Low — long accumulation', tax: '37% bracket — tax-deferral critical', regNote: 'FINRA Reg BI — suitability score 93/100 ✓' },
      aiNarrative: 'James Whitfield\'s VA is 2 years into a 7-year accumulation phase. The GMWB income rider is compounding at 7% annually — at income activation (age 67) the rider base will be approximately $299K, generating an estimated $1,870/mo guaranteed for life. Combined with Social Security ($3,200/mo at FRA) and pension ($3,200/mo), this closes his $2,100/mo income gap. Priority action: confirm James is on track with the no-more-than-10% free withdrawal policy to protect the rider. Annual review is 2 months overdue — schedule immediately.'
    },

    'ANN-SW-001': {
      id: 'ANN-SW-001', clientId: 4, clientName: 'Sandra Williams', initials: 'SW',
      avatarGrad: 'linear-gradient(135deg,#7c3aed,#a855f7)',
      contractNum: 'NYL-SPIA-QUOTE-2026-0044', productType: 'Single Premium Immediate Annuity (SPIA)',
      typeCode: 'spia', issuer: 'New York Life Insurance and Annuity Corp.',
      premium: 120000, premiumFmt: '$120,000', paymentMode: 'Single Premium',
      issueDate: null, contractDate: null,
      surrenderEndDate: 'N/A — immediate annuity',
      contractAge: 'Quote stage',
      phase: 'quote', status: 'Quote Stage',
      accountValue: 120000, accountValueFmt: '$120,000 (proposed)',
      surrenderValue: null, surrenderValueFmt: 'N/A — irrevocable income stream',
      surrenderCharge: 'None — SPIA is irrevocable',
      freeWithdrawal: 'N/A',
      incomeRiderValue: null, incomeRiderValueFmt: null,
      incomeRiderGrowth: null,
      guaranteedIncome: 1340, guaranteedIncomeFmt: '$1,340/mo',
      incomeStartAge: 61, incomeStartYear: 2026,
      riders: ['Joint & Survivor 100% (spouse: Michael Williams)', 'Cash Refund Option'],
      subAccounts: [],
      incomeGap: 1800, incomeGapFmt: '$1,800/mo',
      gapCovered: 74,
      nextAnniversary: 'N/A',
      reviewStatus: 'urgent', lastReview: null, nextReview: 'Immediate — quote expires May 30',
      beneficiaries: [
        { role: 'Primary', name: 'Michael Williams', relation: 'Spouse', pct: 100 },
        { role: 'Contingent', name: 'Estate of Sandra Williams', relation: 'Estate', pct: 100 }
      ],
      suitability: { riskProfile: 'Conservative', score: 85, horizon: 'Lifetime income (25+ yrs)', liquidity: 'Low — irrevocable stream', tax: '22% bracket → 22% in retirement', regNote: 'FINRA Reg BI — suitability score 85/100 ✓' },
      aiNarrative: 'Sandra Williams (age 61) faces a $1,800/mo retirement income gap. Her term life policy expires September 2026 — the SPIA conversion meeting should be combined with the term renewal discussion for maximum efficiency. The $120K SPIA at $1,340/mo fills 74% of the gap; pairing with a term-to-permanent conversion and Social Security bridge strategy closes the remainder. Quote valid until May 30 — act now. This is the highest-urgency annuity placement in the book.'
    },

    'ANN-LM-001': {
      id: 'ANN-LM-001', clientId: 8, clientName: 'Linda Morrison', initials: 'LM',
      avatarGrad: 'linear-gradient(135deg,#003087,#0057c8)',
      contractNum: 'NYL-FIA-QUOTE-2026-0062', productType: 'Fixed Index Annuity (FIA)',
      typeCode: 'fia', issuer: 'New York Life Insurance and Annuity Corp.',
      premium: 200000, premiumFmt: '$200,000', paymentMode: 'Single Premium',
      issueDate: null, contractDate: null,
      surrenderEndDate: 'TBD — 10-yr surrender (est. 2036)',
      contractAge: 'In Review',
      phase: 'review', status: 'In Review',
      accountValue: 200000, accountValueFmt: '$200,000 (proposed)',
      surrenderValue: null, surrenderValueFmt: 'TBD at issue',
      surrenderCharge: '10% yr1 → 0% yr11',
      freeWithdrawal: '10% of account value/yr',
      incomeRiderValue: 200000, incomeRiderValueFmt: '$200,000 (at issue)',
      incomeRiderGrowth: '6% annual rollup (compound)',
      guaranteedIncome: 1840, guaranteedIncomeFmt: '$1,840/mo',
      incomeStartAge: 62, incomeStartYear: 2030,
      riders: ['Income Rider — 6% Rollup (Compound)', 'Enhanced Death Benefit', 'Return of Premium on Death'],
      indexStrategy: { index: 'S&P 500 Point-to-Point', capRate: '9.5%', participationRate: '100%', floor: '0%', spreadFee: 'None' },
      subAccounts: [],
      incomeGap: 1400, incomeGapFmt: '$1,400/mo',
      gapCovered: 100,
      nextAnniversary: 'N/A — pending issue',
      reviewStatus: 'action', lastReview: null, nextReview: 'Present at Apr 15 annual review',
      beneficiaries: [
        { role: 'Primary', name: 'Trust (Morrison Family Trust)', relation: 'Trust', pct: 100 }
      ],
      suitability: { riskProfile: 'Moderate-Conservative', score: 94, horizon: '6 years (to age 62) + lifetime income', liquidity: 'Medium — 10% free withdrawal', tax: '37% bracket — tax-deferral + income optimization', regNote: 'FINRA Reg BI + estate planning coordination. Score: 94/100 ✓' },
      aiNarrative: 'Linda Morrison\'s FIA is the anchor piece of her retirement income strategy. The 6% compound rollup income rider will grow the $200K premium to approximately $283K by income activation at age 62, generating $1,840/mo — fully covering her $1,400/mo income gap with $440/mo surplus. The S&P 500 point-to-point strategy with 9.5% cap provides upside participation with 0% floor protection. Present at the April 15 annual review alongside the UMA $280K proposal. Compliance note: beneficiary must be updated to reflect current trust documents.'
    },

    'ANN-MG-001': {
      id: 'ANN-MG-001', clientId: 6, clientName: 'Maria Gonzalez', initials: 'MG',
      avatarGrad: 'linear-gradient(135deg,#059669,#34d399)',
      contractNum: 'NYL-FA-2021-00453', productType: 'Fixed Deferred Annuity',
      typeCode: 'fda', issuer: 'New York Life Insurance and Annuity Corp.',
      premium: 95000, premiumFmt: '$95,000', paymentMode: 'Single Premium',
      issueDate: 'Jun 15, 2021', contractDate: 'Jun 15, 2021',
      surrenderEndDate: 'Jun 15, 2026',
      contractAge: '4 yrs 11 mo',
      phase: 'maturity', status: '⚠️ Maturing Jun 15, 2026',
      accountValue: 115800, accountValueFmt: '$115,800',
      surrenderValue: 115800, surrenderValueFmt: '$115,800 (no surrender charge at maturity)',
      surrenderCharge: '0% — surrender period ends Jun 15, 2026',
      freeWithdrawal: 'Full liquidity at maturity',
      incomeRiderValue: null, incomeRiderValueFmt: null,
      incomeRiderGrowth: null,
      guaranteedRate: '4.8% guaranteed through maturity',
      guaranteedIncome: 620, guaranteedIncomeFmt: '$620/mo (if rolled to income annuity)',
      incomeStartAge: 65, incomeStartYear: 2043,
      riders: ['Guaranteed Interest Rate 4.8%', 'Death Benefit equals accumulation value'],
      subAccounts: [],
      incomeGap: 900, incomeGapFmt: '$900/mo',
      gapCovered: 69,
      nextAnniversary: 'Jun 15, 2026 — MATURITY',
      reviewStatus: 'urgent', lastReview: 'Jun 2025', nextReview: '⚡ Before Jun 15, 2026',
      beneficiaries: [
        { role: 'Primary', name: 'Carlos Gonzalez', relation: 'Spouse', pct: 60 },
        { role: 'Primary', name: 'Sofia Gonzalez', relation: 'Daughter', pct: 40 }
      ],
      suitability: { riskProfile: 'Moderate', score: 88, horizon: '17 years (to age 65)', liquidity: 'High at maturity, then restricted', tax: '22% bracket — tax-deferral beneficial', regNote: 'FINRA Reg BI — suitability score 88/100 ✓' },
      aiNarrative: 'Maria Gonzalez\'s fixed deferred annuity matures June 15, 2026 — 34 days away. This is the most time-critical action in the retirement book. At maturity, Maria has two optimal paths: (A) Rollover to a new FIA with 6.2% cap rate, preserving tax deferral and adding an income rider for $620/mo at age 65; or (B) 1035 exchange to a Deferred Income Annuity for higher guaranteed payout at age 65. If Maria does nothing, the contract defaults to a reduced declared rate. Revenue opportunity: $3,750 commission on FIA rollover. Contact Maria this week.'
    },

    'ANN-RC-001': {
      id: 'ANN-RC-001', clientId: 3, clientName: 'Robert Chen', initials: 'RC',
      avatarGrad: 'linear-gradient(135deg,#7c3aed,#a855f7)',
      contractNum: 'NYL-DIA-ILLUS-2026-0031', productType: 'Deferred Income Annuity (DIA)',
      typeCode: 'dia', issuer: 'New York Life Insurance and Annuity Corp.',
      premium: 250000, premiumFmt: '$250,000', paymentMode: 'Single Premium (proposed)',
      issueDate: null, contractDate: null,
      surrenderEndDate: 'N/A — DIA income begins at 65',
      contractAge: 'Illustration stage',
      phase: 'illustration', status: 'Illustration',
      accountValue: 250000, accountValueFmt: '$250,000 (proposed premium)',
      surrenderValue: null, surrenderValueFmt: 'N/A — DIA is irrevocable at purchase',
      surrenderCharge: 'None — income begins at elected date',
      freeWithdrawal: 'N/A',
      incomeRiderValue: null, incomeRiderValueFmt: null,
      incomeRiderGrowth: null,
      guaranteedIncome: 3200, guaranteedIncomeFmt: '$3,200/mo',
      incomeStartAge: 65, incomeStartYear: 2046,
      riders: ['Joint & Survivor 100% (spouse)', 'Return of Premium (death before income start)'],
      subAccounts: [],
      incomeGap: 0, incomeGapFmt: 'No gap — fully funded',
      gapCovered: 100,
      nextAnniversary: 'N/A',
      reviewStatus: 'action', lastReview: null, nextReview: 'Present at follow-up call',
      beneficiaries: [
        { role: 'Primary', name: 'Susan Chen', relation: 'Spouse', pct: 100 }
      ],
      suitability: { riskProfile: 'Moderate', score: 96, horizon: '20 years (to age 65)', liquidity: 'Low — longevity hedge product', tax: '37% bracket — max tax deferral on $250K premium', regNote: 'FINRA Reg BI — suitability score 96/100 ✓' },
      aiNarrative: 'Robert Chen (age 45) has zero retirement products — a critical gap for a High Value client with $380K/yr income. The Deferred Income Annuity (DIA) is the ideal longevity hedge: a $250K single premium now generates $3,200/mo guaranteed income starting at age 65, fully leveraging 20 years of deferral. Combined with SEP-IRA and business assets, Robert\'s retirement income would be fully secured. Key objection to prepare for: liquidity. Address with the "set it and forget it" framing — this supplements, not replaces, liquid assets. Close probability: 96/100 per AI suitability score.'
    },

    'ANN-DW-001': {
      id: 'ANN-DW-001', clientId: 7, clientName: 'Dorothy Wilson', initials: 'DW',
      avatarGrad: 'linear-gradient(135deg,#d97706,#fbbf24)',
      contractNum: 'NYL-SPIA-QUOTE-2026-0044B', productType: 'Single Premium Immediate Annuity (SPIA)',
      typeCode: 'spia', issuer: 'New York Life Insurance and Annuity Corp.',
      premium: 120000, premiumFmt: '$120,000', paymentMode: 'Single Premium',
      issueDate: null, contractDate: null,
      surrenderEndDate: 'N/A — immediate annuity',
      contractAge: 'Quoted Apr 9, 2026',
      phase: 'quote', status: 'Quoted',
      accountValue: 120000, accountValueFmt: '$120,000 (proposed)',
      surrenderValue: null, surrenderValueFmt: 'N/A — irrevocable',
      surrenderCharge: 'None',
      freeWithdrawal: 'N/A',
      incomeRiderValue: null, incomeRiderValueFmt: null,
      incomeRiderGrowth: null,
      guaranteedIncome: 1340, guaranteedIncomeFmt: '$1,340/mo guaranteed for life',
      incomeStartAge: 61, incomeStartYear: 2026,
      riders: ['Joint & Survivor 100%', 'Cash Refund Option'],
      subAccounts: [],
      incomeGap: 1120, incomeGapFmt: '$1,120/mo',
      gapCovered: 100,
      nextAnniversary: 'N/A',
      reviewStatus: 'action', lastReview: null, nextReview: 'Apr 16, 2026 renewal meeting',
      beneficiaries: [
        { role: 'Primary', name: 'Michael Wilson (son)', relation: 'Child (adult)', pct: 100 }
      ],
      suitability: { riskProfile: 'Conservative', score: 87, horizon: 'Lifetime', liquidity: 'Low — fixed income stream', tax: '22% bracket', regNote: 'FINRA Reg BI — suitability score 87/100 ✓' },
      aiNarrative: 'Dorothy Wilson\'s SPIA quote was generated Apr 9, 2026 alongside the term-to-whole-life conversion illustration. Pension ($2,100/mo) + SS ($1,980/mo) + SPIA ($1,340/mo) = $5,420/mo, fully covering her $4,300/mo lifestyle target with a $1,120/mo surplus as a buffer. The Apr 16 renewal meeting is the ideal close opportunity — present both the WL conversion and the SPIA together as a retirement income completion package. Commission: $9,600 on SPIA + $2,800 on WL conversion = $12,400 total revenue from one meeting.'
    }
  };

  /* ── 2. STATUS BADGE HELPER ───────────────────────────────────────── */
  function _raStatusBadge(phase, status) {
    var map = {
      accumulating: { bg: '#d1fae5', color: '#059669', icon: 'fa-chart-line' },
      quote:        { bg: '#dbeafe', color: '#003087', icon: 'fa-file-invoice-dollar' },
      review:       { bg: '#fef3c7', color: '#d97706', icon: 'fa-eye' },
      maturity:     { bg: '#fee2e2', color: '#dc2626', icon: 'fa-exclamation-triangle' },
      illustration: { bg: '#ede9fe', color: '#7c3aed', icon: 'fa-chart-bar' },
      'income':     { bg: '#f0fdf4', color: '#16a34a', icon: 'fa-piggy-bank' }
    };
    var s = map[phase] || { bg: '#f1f5f9', color: '#64748b', icon: 'fa-circle' };
    return '<span class="ra-status-badge" style="background:' + s.bg + ';color:' + s.color + '">' +
           '<i class="fas ' + s.icon + '"></i> ' + status + '</span>';
  }

  /* ── 3. TYPE BADGE HELPER ─────────────────────────────────────────── */
  function _raTypeBadge(typeCode) {
    var map = {
      va:   { label: 'VA', bg: '#ede9fe', color: '#7c3aed' },
      fia:  { label: 'FIA', bg: '#dbeafe', color: '#003087' },
      spia: { label: 'SPIA', bg: '#d1fae5', color: '#059669' },
      dia:  { label: 'DIA', bg: '#faf5ff', color: '#6d28d9' },
      fda:  { label: 'Fixed', bg: '#fef3c7', color: '#d97706' }
    };
    var t = map[typeCode] || { label: typeCode.toUpperCase(), bg: '#f1f5f9', color: '#64748b' };
    return '<span class="ra-type-badge" style="background:' + t.bg + ';color:' + t.color + '">' + t.label + '</span>';
  }

  /* ── 4. PRIORITY DOT ──────────────────────────────────────────────── */
  function _raPriorityDot(phase) {
    var map = { maturity: '#dc2626', quote: '#003087', review: '#d97706', accumulating: '#059669', illustration: '#7c3aed' };
    return '<span class="ra-priority-dot" style="background:' + (map[phase] || '#94a3b8') + '"></span>';
  }

  /* ── 5. DONUT SVG HELPER ──────────────────────────────────────────── */
  function _raDonut(pct, color, size) {
    pct = Math.min(100, Math.max(0, pct));
    var r = (size || 40) / 2 - 5;
    var circ = 2 * Math.PI * r;
    var dash = (pct / 100) * circ;
    var cx = (size || 40) / 2;
    return '<svg width="' + (size||40) + '" height="' + (size||40) + '" style="transform:rotate(-90deg)">' +
      '<circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke="#e5e7eb" stroke-width="5"/>' +
      '<circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="5" ' +
        'stroke-dasharray="' + dash.toFixed(1) + ' ' + circ.toFixed(1) + '" stroke-linecap="round"/>' +
      '</svg>';
  }

  /* ── 6. RENDER KPI BAR ────────────────────────────────────────────── */
  function _raRenderKPIBar() {
    var contracts = Object.values(_raContracts);
    var totalPremium = contracts.reduce(function(s,c){ return s + c.premium; }, 0);
    var totalIncome  = contracts.reduce(function(s,c){ return s + (c.guaranteedIncome||0); }, 0);
    var active       = contracts.filter(function(c){ return c.phase === 'accumulating'; }).length;
    var urgent       = contracts.filter(function(c){ return c.reviewStatus === 'urgent'; }).length;
    var inReview     = contracts.filter(function(c){ return c.phase === 'review' || c.phase === 'illustration'; }).length;
    var totalGap     = contracts.reduce(function(s,c){ return s + (c.incomeGap||0); }, 0);

    var html = [
      { cls:'ra-kpi-aum',    icon:'fa-coins',                   val:'$'+(totalPremium/1000).toFixed(0)+'K',  lbl:'Total Annuity AUM',       sub:'<span class="ra-sub-up"><i class="fas fa-arrow-up"></i> +$21K MTD</span>' },
      { cls:'ra-kpi-income', icon:'fa-piggy-bank',              val:'$'+(totalIncome).toLocaleString()+'/mo', lbl:'Guaranteed Income',        sub:'Across active contracts' },
      { cls:'ra-kpi-count',  icon:'fa-file-contract',           val:contracts.length,                         lbl:'Total Contracts',          sub:active+' active · '+inReview+' pending' },
      { cls:'ra-kpi-gap',    icon:'fa-exclamation-circle',      val:'$'+(totalGap).toLocaleString()+'/mo',   lbl:'Total Income Gap (book)',  sub:'<span class="ra-sub-warn"><i class="fas fa-exclamation-triangle"></i> '+urgent+' urgent</span>' },
      { cls:'ra-kpi-mature', icon:'fa-calendar-exclamation',    val:'1',                                      lbl:'Maturing This Month',      sub:'<span class="ra-sub-warn">ANN-MG-001 · Jun 15</span>' },
      { cls:'ra-kpi-review', icon:'fa-clipboard-check',         val:'3',                                      lbl:'Reviews Due (Q2)',         sub:'Annual review cycle' },
      { cls:'ra-kpi-comm',   icon:'fa-hand-holding-usd',        val:'$26.2K',                                 lbl:'Commission Pipeline',      sub:'Pending placement' },
      { cls:'ra-kpi-cand',   icon:'fa-user-check',              val:'5',                                      lbl:'AI Annuity Candidates',    sub:'Upsell Track flagged' }
    ].map(function(k) {
      return '<div class="ra-kpi-card ' + k.cls + '">' +
        '<div class="ra-kpi-icon"><i class="fas ' + k.icon + '"></i></div>' +
        '<div class="ra-kpi-data">' +
          '<div class="ra-kpi-val">' + k.val + '</div>' +
          '<div class="ra-kpi-lbl">' + k.lbl + '</div>' +
          '<div class="ra-kpi-sub">' + k.sub + '</div>' +
        '</div></div>';
    }).join('');

    var el = document.getElementById('ra-kpi-bar');
    if (el) el.innerHTML = html;
  }

  /* ── 7. RENDER AI BANNER ──────────────────────────────────────────── */
  function _raRenderAIBanner() {
    var html =
      '<div class="ra-ai-banner-left">' +
        '<div class="ra-ai-icon"><i class="fas fa-robot"></i><span class="ra-ai-pulse"></span></div>' +
        '<div>' +
          '<div class="ra-ai-title">AI Retirement Income Engine <span class="ra-ai-live">● LIVE</span></div>' +
          '<div class="ra-ai-sub">Income gap scanner · Annuity maturity alerts · RMD calculator · 1035 exchange optimizer · Rider performance tracker</div>' +
        '</div>' +
      '</div>' +
      '<div class="ra-ai-stats">' +
        '<div class="ra-ai-stat"><span class="ra-ai-stat-val red">1</span><span class="ra-ai-stat-lbl">Maturing</span></div>' +
        '<div class="ra-ai-stat"><span class="ra-ai-stat-val orange">2</span><span class="ra-ai-stat-lbl">Urgent</span></div>' +
        '<div class="ra-ai-stat"><span class="ra-ai-stat-val blue">$26K</span><span class="ra-ai-stat-lbl">Commission</span></div>' +
        '<div class="ra-ai-stat"><span class="ra-ai-stat-val green">$7,830</span><span class="ra-ai-stat-lbl">Income/mo</span></div>' +
      '</div>' +
      '<div class="ra-ai-actions">' +
        '<button class="ra-ai-btn primary" onclick="raRunIncomeGapScan()"><i class="fas fa-search-dollar"></i> Income Gap Scan</button>' +
        '<button class="ra-ai-btn ghost" onclick="raOpenMaturityAlert()"><i class="fas fa-calendar-exclamation"></i> Maturity Alert</button>' +
        '<button class="ra-ai-btn ghost" onclick="raOpenRMDCalculator()"><i class="fas fa-calculator"></i> RMD Calculator</button>' +
      '</div>';
    var el = document.getElementById('ra-ai-banner');
    if (el) el.innerHTML = html;
  }

  /* ── 8. RENDER QUEUE ──────────────────────────────────────────────── */
  function raRenderQueue(filter) {
    var contracts = Object.values(_raContracts);
    if (filter) {
      contracts = contracts.filter(function(c) {
        return c.clientName.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
               c.productType.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
               c.id.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
      });
    }
    var typeFilter  = (document.getElementById('ra-type-filter')  || {}).value || '';
    var statFilter  = (document.getElementById('ra-status-filter') || {}).value || '';
    if (typeFilter)  contracts = contracts.filter(function(c){ return c.productType.indexOf(typeFilter.split(' ')[0]) >= 0; });
    if (statFilter)  contracts = contracts.filter(function(c){ return c.status.indexOf(statFilter.split(' ')[0]) >= 0; });

    // Sort: urgent/maturity first
    var order = { maturity:0, urgent:0, quote:1, review:2, illustration:3, accumulating:4 };
    contracts.sort(function(a,b){ return (order[a.phase]||5) - (order[b.phase]||5); });

    if (!contracts.length) {
      document.getElementById('ra-contract-queue').innerHTML =
        '<div class="ra-queue-empty"><i class="fas fa-search"></i> No contracts match your filter.</div>';
      return;
    }

    var html = contracts.map(function(c) {
      var urgentBar = (c.phase === 'maturity') ? '<div class="ra-queue-urgent-bar"></div>' : '';
      return '<div class="ra-queue-row" data-id="' + c.id + '" onclick="raOpenContract(\'' + c.id + '\')">' +
        urgentBar +
        '<div class="ra-queue-avatar" style="background:' + c.avatarGrad + '">' + c.initials + '</div>' +
        '<div class="ra-queue-body">' +
          '<div class="ra-queue-top">' +
            '<span class="ra-queue-name">' + c.clientName + '</span>' +
            _raPriorityDot(c.phase) +
            _raTypeBadge(c.typeCode) +
          '</div>' +
          '<div class="ra-queue-product">' + c.productType + '</div>' +
          '<div class="ra-queue-meta">' +
            '<span class="ra-queue-premium">' + c.premiumFmt + '</span>' +
            '<span class="ra-queue-income">' + c.guaranteedIncomeFmt + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="ra-queue-right">' +
          _raStatusBadge(c.phase, c.status) +
        '</div>' +
      '</div>';
    }).join('');

    document.getElementById('ra-contract-queue').innerHTML = html;
  }

  /* ── 9. OPEN CONTRACT DETAIL ──────────────────────────────────────── */
  var _raActiveContract = null;
  var _raActiveTab = 'overview';

  function raOpenContract(id) {
    _raActiveContract = id;
    _raActiveTab = 'overview';
    document.querySelectorAll('.ra-queue-row').forEach(function(r){ r.classList.remove('ra-queue-row-active'); });
    var row = document.querySelector('.ra-queue-row[data-id="' + id + '"]');
    if (row) row.classList.add('ra-queue-row-active');

    var empty = document.getElementById('ra-detail-empty');
    var panel = document.getElementById('ra-detail-panel');
    if (empty) empty.style.display = 'none';
    if (panel) { panel.style.display = ''; panel.innerHTML = raBuildDetailHTML(id); }
  }

  /* ── 10. BUILD DETAIL HTML ────────────────────────────────────────── */
  function raBuildDetailHTML(id) {
    var c = _raContracts[id];
    if (!c) return '<div class="ra-empty">Contract not found.</div>';

    var tabs = [
      { key: 'overview',    icon: 'fa-th-large',          label: 'Overview' },
      { key: 'projection',  icon: 'fa-chart-area',         label: 'Income Projection' },
      { key: 'contract',    icon: 'fa-file-contract',      label: 'Contract Details' },
      { key: 'beneficiary', icon: 'fa-users',              label: 'Beneficiaries' },
      { key: 'suitability', icon: 'fa-balance-scale',      label: 'Suitability' },
      { key: 'review',      icon: 'fa-calendar-check',     label: 'Annual Review' }
    ];

    var tabBtns = tabs.map(function(t) {
      var active = t.key === _raActiveTab ? ' ra-tab-active' : '';
      return '<button class="ra-tab-btn' + active + '" onclick="raSwitchTab(\'' + t.key + '\',this)">' +
             '<i class="fas ' + t.icon + '"></i> ' + t.label + '</button>';
    }).join('');

    var panels = tabs.map(function(t) {
      var disp = t.key === _raActiveTab ? '' : 'display:none';
      return '<div id="ra-tab-' + t.key + '" style="' + disp + '">' + _raRenderTab(c, t.key) + '</div>';
    }).join('');

    return '<div class="ra-detail-hdr">' +
        '<div class="ra-detail-avatar" style="background:' + c.avatarGrad + '">' + c.initials + '</div>' +
        '<div class="ra-detail-hdr-body">' +
          '<div class="ra-detail-client">' + c.clientName + ' <span class="ra-detail-id">' + c.id + '</span></div>' +
          '<div class="ra-detail-product">' + _raTypeBadge(c.typeCode) + ' ' + c.productType + '</div>' +
          '<div class="ra-detail-contract-num">' + c.contractNum + '</div>' +
        '</div>' +
        '<div class="ra-detail-hdr-right">' +
          _raStatusBadge(c.phase, c.status) +
        '</div>' +
      '</div>' +
      '<div class="ra-tab-bar">' + tabBtns + '</div>' +
      '<div class="ra-tab-content">' + panels + '</div>';
  }

  /* ── 11. SWITCH TAB ───────────────────────────────────────────────── */
  function raSwitchTab(tab, el) {
    _raActiveTab = tab;
    document.querySelectorAll('.ra-tab-btn').forEach(function(b){ b.classList.remove('ra-tab-active'); });
    if (el) el.classList.add('ra-tab-active');
    document.querySelectorAll('[id^="ra-tab-"]').forEach(function(p){ p.style.display = 'none'; });
    var pnl = document.getElementById('ra-tab-' + tab);
    if (pnl) {
      pnl.style.display = '';
      if (!pnl.dataset.rendered) {
        var c = _raContracts[_raActiveContract];
        if (c) pnl.innerHTML = _raRenderTab(c, tab);
        pnl.dataset.rendered = '1';
      }
    }
  }

  /* ── 12. RENDER TAB CONTENT ───────────────────────────────────────── */
  function _raRenderTab(c, tab) {
    if (tab === 'overview')    return _raTabOverview(c);
    if (tab === 'projection')  return _raTabProjection(c);
    if (tab === 'contract')    return _raTabContract(c);
    if (tab === 'beneficiary') return _raTabBeneficiary(c);
    if (tab === 'suitability') return _raTabSuitability(c);
    if (tab === 'review')      return _raTabReview(c);
    return '<div class="ra-empty">Tab not found.</div>';
  }

  /* ── 13. TAB: OVERVIEW ────────────────────────────────────────────── */
  function _raTabOverview(c) {
    var kpis = [
      { lbl: 'Contract Value',     val: c.accountValueFmt,         icon: 'fa-dollar-sign',    color: '#003087' },
      { lbl: 'Guaranteed Income',  val: c.guaranteedIncomeFmt,      icon: 'fa-piggy-bank',     color: '#059669' },
      { lbl: 'Income Start Age',   val: 'Age ' + c.incomeStartAge,  icon: 'fa-calendar-check', color: '#0891b2' },
      { lbl: 'Gap Coverage',       val: c.gapCovered + '%',         icon: 'fa-chart-pie',      color: (c.gapCovered >= 100 ? '#059669' : '#d97706') }
    ];

    var kpiHtml = kpis.map(function(k) {
      return '<div class="ra-ov-kpi">' +
        '<div class="ra-ov-kpi-icon" style="color:' + k.color + ';background:' + k.color + '18"><i class="fas ' + k.icon + '"></i></div>' +
        '<div><div class="ra-ov-kpi-val" style="color:' + k.color + '">' + k.val + '</div><div class="ra-ov-kpi-lbl">' + k.lbl + '</div></div>' +
      '</div>';
    }).join('');

    // Income gap donut
    var gapPct  = Math.min(100, c.gapCovered);
    var gapColor = gapPct >= 100 ? '#059669' : gapPct >= 70 ? '#d97706' : '#dc2626';
    var donutHtml = _raDonut(gapPct, gapColor, 80);

    // Sub-accounts table (VA only)
    var subHtml = '';
    if (c.subAccounts && c.subAccounts.length) {
      subHtml = '<div class="ra-ov-section-hdr"><i class="fas fa-layer-group"></i> Sub-Account Allocation</div>' +
        '<table class="ra-sub-table">' +
        '<thead><tr><th>Fund</th><th>Allocation</th><th>Value</th><th>YTD</th></tr></thead><tbody>' +
        c.subAccounts.map(function(s) {
          var ytdColor = s.ytd.charAt(0) === '+' ? '#059669' : '#dc2626';
          return '<tr><td>' + s.name + '</td>' +
            '<td><div class="ra-sub-bar-wrap"><div class="ra-sub-bar" style="width:' + s.allocation + '%"></div><span>' + s.allocation + '%</span></div></td>' +
            '<td>$' + s.value.toLocaleString() + '</td>' +
            '<td style="color:' + ytdColor + ';font-weight:700">' + s.ytd + '</td></tr>';
        }).join('') +
        '</tbody></table>';
    }

    // Index strategy (FIA)
    var idxHtml = '';
    if (c.indexStrategy) {
      var ix = c.indexStrategy;
      idxHtml = '<div class="ra-ov-section-hdr"><i class="fas fa-chart-line"></i> Index Crediting Strategy</div>' +
        '<div class="ra-ov-idx-grid">' +
          '<div class="ra-ov-idx-card"><div class="ra-ov-idx-val">' + ix.index + '</div><div class="ra-ov-idx-lbl">Index</div></div>' +
          '<div class="ra-ov-idx-card"><div class="ra-ov-idx-val" style="color:#059669">' + ix.capRate + '</div><div class="ra-ov-idx-lbl">Cap Rate</div></div>' +
          '<div class="ra-ov-idx-card"><div class="ra-ov-idx-val">' + ix.participationRate + '</div><div class="ra-ov-idx-lbl">Participation</div></div>' +
          '<div class="ra-ov-idx-card"><div class="ra-ov-idx-val" style="color:#059669">' + ix.floor + '</div><div class="ra-ov-idx-lbl">Floor (downside)</div></div>' +
        '</div>';
    }

    return '<div class="ra-tab-scroll">' +
      '<div class="ra-ov-kpi-strip">' + kpiHtml + '</div>' +
      '<div class="ra-ov-two-col">' +
        '<div class="ra-ov-col">' +
          '<div class="ra-ov-section-hdr"><i class="fas fa-chart-pie"></i> Income Gap Coverage</div>' +
          '<div class="ra-gap-donut-wrap">' +
            '<div class="ra-gap-donut">' + donutHtml + '<div class="ra-gap-donut-pct" style="color:' + gapColor + '">' + gapPct + '%</div></div>' +
            '<div class="ra-gap-donut-legend">' +
              '<div class="ra-gap-leg-row"><span class="ra-gap-leg-dot" style="background:' + gapColor + '"></span> Income gap covered: <strong>' + c.gapCovered + '%</strong></div>' +
              '<div class="ra-gap-leg-row"><span class="ra-gap-leg-dot" style="background:#e5e7eb"></span> Gap remaining: <strong>' + (100 - c.gapCovered) + '%</strong></div>' +
              '<div class="ra-gap-total">Total income gap: <strong>' + c.incomeGapFmt + '</strong></div>' +
            '</div>' +
          '</div>' +
          '<div class="ra-ov-section-hdr" style="margin-top:16px"><i class="fas fa-shield-alt"></i> Riders & Features</div>' +
          '<ul class="ra-riders-list">' + (c.riders||[]).map(function(r){ return '<li><i class="fas fa-check-circle" style="color:#059669"></i> ' + r + '</li>'; }).join('') + '</ul>' +
        '</div>' +
        '<div class="ra-ov-col">' +
          '<div class="ra-ov-section-hdr"><i class="fas fa-info-circle"></i> Contract Summary</div>' +
          '<div class="ra-ov-detail-grid">' +
            _raDetailRow('Issuer', c.issuer) +
            _raDetailRow('Contract #', c.contractNum) +
            _raDetailRow('Payment Mode', c.paymentMode) +
            _raDetailRow('Issue Date', c.issueDate || 'Pending') +
            _raDetailRow('Contract Age', c.contractAge) +
            _raDetailRow('Surrender End', c.surrenderEndDate) +
            _raDetailRow('Free Withdrawal', c.freeWithdrawal) +
            _raDetailRow('Next Anniversary', c.nextAnniversary) +
          '</div>' +
          (c.incomeRiderGrowth ? '<div class="ra-ov-section-hdr" style="margin-top:16px"><i class="fas fa-arrow-up"></i> Income Rider</div>' +
            '<div class="ra-ov-detail-grid">' +
              _raDetailRow('Rider Value', c.incomeRiderValueFmt) +
              _raDetailRow('Growth Rate', c.incomeRiderGrowth) +
              _raDetailRow('Income Start', 'Age ' + c.incomeStartAge + ' (' + c.incomeStartYear + ')') +
              _raDetailRow('Guaranteed Income', c.guaranteedIncomeFmt) +
            '</div>' : '') +
          (c.guaranteedRate ? '<div class="ra-ov-section-hdr" style="margin-top:16px"><i class="fas fa-lock"></i> Guaranteed Rate</div>' +
            '<div class="ra-rate-banner"><i class="fas fa-percentage"></i> ' + c.guaranteedRate + '</div>' : '') +
          idxHtml +
          subHtml +
        '</div>' +
      '</div>' +
      '<div class="ra-ai-card">' +
        '<div class="ra-ai-card-hdr"><i class="fas fa-robot"></i> AI Contract Brief</div>' +
        '<div class="ra-ai-card-body">' + c.aiNarrative + '</div>' +
        '<div class="ra-ai-card-actions">' +
          '<button class="ra-action-btn primary" onclick="_raToast(\'Generating client-ready income illustration PDF…\')"><i class="fas fa-file-pdf"></i> Generate Illustration</button>' +
          '<button class="ra-action-btn outline" onclick="_raToast(\'Opening calendar — scheduling review meeting…\')"><i class="fas fa-calendar-plus"></i> Schedule Review</button>' +
          '<button class="ra-action-btn outline" onclick="_raToast(\'Opening E-App & Proposals…\')"><i class="fas fa-file-signature"></i> Open in E-App</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ── 14. TAB: INCOME PROJECTION ───────────────────────────────────── */
  function _raTabProjection(c) {
    // Generate year-by-year projection table
    var rows = [];
    var age   = 56; // use a representative age; approximate from contract
    var names = {
      'ANN-JW-001': 52, 'ANN-SW-001': 61, 'ANN-LM-001': 56,
      'ANN-MG-001': 48, 'ANN-RC-001': 45, 'ANN-DW-001': 61
    };
    age = names[c.id] || 50;

    var isAccum = (c.phase === 'accumulating' || c.phase === 'review' || c.phase === 'illustration');
    var premium = c.premium;
    var rollup  = c.incomeRiderGrowth ? parseFloat(c.incomeRiderGrowth) / 100 : 0;
    var guaranteed4pct = 0.048; // fixed annuity growth

    for (var yr = 1; yr <= 20; yr++) {
      var curAge  = age + yr;
      var accVal  = 0;
      var riderVal= 0;
      var income  = 0;

      if (c.typeCode === 'va') {
        accVal   = Math.round(premium * Math.pow(1.075, yr));   // 7.5% assumed gross
        riderVal = Math.round(premium * Math.pow(1 + rollup, yr));
        income   = curAge >= c.incomeStartAge ? c.guaranteedIncome : 0;
      } else if (c.typeCode === 'fia') {
        accVal   = Math.round(premium * Math.pow(1.06, yr));    // 6% assumed index credit
        riderVal = Math.round(premium * Math.pow(1 + rollup, yr));
        income   = curAge >= c.incomeStartAge ? c.guaranteedIncome : 0;
      } else if (c.typeCode === 'fda') {
        accVal   = Math.round(premium * Math.pow(1 + guaranteed4pct, yr));
        income   = curAge >= c.incomeStartAge ? c.guaranteedIncome : 0;
      } else if (c.typeCode === 'spia' || c.typeCode === 'dia') {
        accVal   = premium; // irrevocable
        income   = curAge >= c.incomeStartAge ? c.guaranteedIncome : 0;
      }

      rows.push({ yr: yr, age: curAge, accVal: accVal, riderVal: riderVal, income: income });
    }

    var tableRows = rows.map(function(r) {
      var incomeCell = r.income > 0
        ? '<td style="color:#059669;font-weight:700">$' + r.income.toLocaleString() + '/mo</td>'
        : '<td style="color:#94a3b8">Accumulating</td>';
      var riderCell = r.riderVal ? '<td>$' + r.riderVal.toLocaleString() + '</td>' : '<td>—</td>';
      return '<tr><td>Yr ' + r.yr + '</td><td>Age ' + r.age + '</td>' +
             '<td>$' + (r.accVal||0).toLocaleString() + '</td>' +
             riderCell + incomeCell + '</tr>';
    }).join('');

    // Bar chart (simple HTML bars)
    var maxVal = Math.max.apply(null, rows.map(function(r){ return r.accVal||0; }));
    var barHtml = rows.filter(function(r){ return r.yr % 5 === 0 || r.yr === 1; }).map(function(r) {
      var pct = maxVal ? Math.round((r.accVal/maxVal)*100) : 0;
      var barColor = r.income > 0 ? '#059669' : '#003087';
      return '<div class="ra-proj-bar-col">' +
        '<div class="ra-proj-bar-wrap">' +
          '<div class="ra-proj-bar" style="height:' + pct + '%;background:' + barColor + '"></div>' +
        '</div>' +
        '<div class="ra-proj-bar-lbl">Yr ' + r.yr + '</div>' +
        '<div class="ra-proj-bar-val">$' + Math.round(r.accVal/1000) + 'K</div>' +
      '</div>';
    }).join('');

    // Income source waterfall
    var ssEst    = { 'ANN-JW-001': 3200, 'ANN-LM-001': 2800, 'ANN-SW-001': 2400, 'ANN-MG-001': 2100, 'ANN-RC-001': 3600, 'ANN-DW-001': 1980 }[c.id] || 2000;
    var pensEst  = { 'ANN-JW-001': 3200, 'ANN-LM-001': 0, 'ANN-SW-001': 0, 'ANN-MG-001': 0, 'ANN-RC-001': 0, 'ANN-DW-001': 2100 }[c.id] || 0;
    var annInc   = c.guaranteedIncome || 0;
    var totalInc = ssEst + pensEst + annInc;
    var gapAmt   = c.incomeGap || 0;

    var waterfallItems = [
      { lbl: 'Social Security (est.)', val: ssEst,   color: '#003087' },
      { lbl: 'Pension / Other Income', val: pensEst, color: '#0891b2' },
      { lbl: 'Annuity Income',         val: annInc,  color: '#059669' }
    ].filter(function(w){ return w.val > 0; });
    var maxBar = Math.max(totalInc, gapAmt + totalInc);

    var waterfallHtml = waterfallItems.map(function(w) {
      var barPct = maxBar ? Math.round((w.val/maxBar)*100) : 0;
      return '<div class="ra-wfall-row">' +
        '<div class="ra-wfall-lbl">' + w.lbl + '</div>' +
        '<div class="ra-wfall-bar-wrap">' +
          '<div class="ra-wfall-bar" style="width:' + barPct + '%;background:' + w.color + '"></div>' +
          '<span class="ra-wfall-val">$' + w.val.toLocaleString() + '/mo</span>' +
        '</div>' +
      '</div>';
    }).join('');

    var totalColor = totalInc >= (totalInc + gapAmt) ? '#059669' : '#d97706';

    return '<div class="ra-tab-scroll">' +
      '<div class="ra-proj-section-hdr"><i class="fas fa-chart-bar"></i> Account Value Growth (20-Year Projection)</div>' +
      '<div class="ra-proj-bar-chart">' + barHtml + '</div>' +
      '<div class="ra-proj-section-hdr" style="margin-top:20px"><i class="fas fa-water"></i> Retirement Income Waterfall (at Income Start Age ' + c.incomeStartAge + ')</div>' +
      '<div class="ra-wfall">' +
        waterfallHtml +
        '<div class="ra-wfall-total" style="border-color:' + totalColor + '">' +
          '<span>Total Guaranteed Income</span>' +
          '<strong style="color:' + totalColor + '">$' + totalInc.toLocaleString() + '/mo</strong>' +
        '</div>' +
        (gapAmt > 0 ? '<div class="ra-wfall-gap"><i class="fas fa-exclamation-triangle" style="color:#dc2626"></i> Income gap remaining: <strong style="color:#dc2626">$' + gapAmt.toLocaleString() + '/mo</strong></div>' : '') +
      '</div>' +
      '<div class="ra-proj-section-hdr" style="margin-top:20px"><i class="fas fa-table"></i> Year-by-Year Projection Table</div>' +
      '<div class="ra-proj-table-wrap">' +
        '<table class="ra-proj-table">' +
          '<thead><tr><th>Year</th><th>Age</th><th>Account Value</th><th>Rider Value</th><th>Monthly Income</th></tr></thead>' +
          '<tbody>' + tableRows + '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="ra-proj-disclaimer">Projected values are illustrative. Variable annuity values depend on sub-account performance. FIA values depend on index crediting. Guarantees subject to claims-paying ability of New York Life Insurance and Annuity Corp.</div>' +
    '</div>';
  }

  /* ── 15. TAB: CONTRACT DETAILS ─────────────────────────────────────── */
  function _raTabContract(c) {
    var rows = [
      ['Contract Number',   c.contractNum],
      ['Product Type',      c.productType],
      ['Issuer',            c.issuer],
      ['Premium',           c.premiumFmt],
      ['Payment Mode',      c.paymentMode],
      ['Issue Date',        c.issueDate || 'Pending placement'],
      ['Contract Date',     c.contractDate || 'Pending'],
      ['Contract Age',      c.contractAge],
      ['Phase',             c.phase.charAt(0).toUpperCase() + c.phase.slice(1)],
      ['Account Value',     c.accountValueFmt],
      ['Surrender Value',   c.surrenderValueFmt || 'N/A'],
      ['Surrender Charge',  c.surrenderCharge],
      ['Free Withdrawal',   c.freeWithdrawal],
      ['Surrender End Date',c.surrenderEndDate],
      ['Income Start Age',  'Age ' + c.incomeStartAge + ' (' + c.incomeStartYear + ')'],
      ['Guaranteed Income', c.guaranteedIncomeFmt],
      ['Next Anniversary',  c.nextAnniversary]
    ];
    if (c.incomeRiderGrowth) {
      rows.push(['Income Rider Value',  c.incomeRiderValueFmt]);
      rows.push(['Rider Growth Rate',   c.incomeRiderGrowth]);
    }
    if (c.guaranteedRate) rows.push(['Guaranteed Rate', c.guaranteedRate]);
    if (c.indexStrategy) {
      var ix = c.indexStrategy;
      rows.push(['Index', ix.index]);
      rows.push(['Cap Rate', ix.capRate]);
      rows.push(['Participation Rate', ix.participationRate]);
      rows.push(['Floor (downside protection)', ix.floor]);
    }

    var tableHtml = rows.map(function(r){
      return '<tr><td class="ra-cd-lbl">' + r[0] + '</td><td class="ra-cd-val">' + r[1] + '</td></tr>';
    }).join('');

    var ridersHtml = (c.riders||[]).map(function(r){
      return '<div class="ra-rider-item"><i class="fas fa-check-circle" style="color:#059669"></i> ' + r + '</div>';
    }).join('');

    return '<div class="ra-tab-scroll">' +
      '<div class="ra-cd-section-hdr"><i class="fas fa-file-contract"></i> Contract Terms</div>' +
      '<table class="ra-cd-table"><tbody>' + tableHtml + '</tbody></table>' +
      '<div class="ra-cd-section-hdr" style="margin-top:20px"><i class="fas fa-shield-alt"></i> Riders & Features</div>' +
      '<div class="ra-riders-block">' + ridersHtml + '</div>' +
      '<div class="ra-cd-actions">' +
        '<button class="ra-action-btn primary" onclick="_raToast(\'Downloading full contract document PDF…\')"><i class="fas fa-download"></i> Download Contract PDF</button>' +
        '<button class="ra-action-btn outline" onclick="_raToast(\'Requesting in-force illustration from carrier…\')"><i class="fas fa-sync"></i> Request In-Force Illustration</button>' +
      '</div>' +
    '</div>';
  }

  /* ── 16. TAB: BENEFICIARIES ───────────────────────────────────────── */
  function _raTabBeneficiary(c) {
    var bRows = (c.beneficiaries||[]).map(function(b) {
      var roleColor = b.role === 'Primary' ? '#003087' : '#6b7280';
      return '<div class="ra-ben-card">' +
        '<div class="ra-ben-role" style="color:' + roleColor + '">' + b.role + '</div>' +
        '<div class="ra-ben-name">' + b.name + '</div>' +
        '<div class="ra-ben-meta">' + b.relation + ' · ' + b.pct + '%</div>' +
        (b.note ? '<div class="ra-ben-note"><i class="fas fa-info-circle"></i> ' + b.note + '</div>' : '') +
      '</div>';
    }).join('');

    return '<div class="ra-tab-scroll">' +
      '<div class="ra-cd-section-hdr"><i class="fas fa-users"></i> Beneficiary Designations</div>' +
      '<div class="ra-ben-grid">' + bRows + '</div>' +
      '<div class="ra-ben-note-block"><i class="fas fa-info-circle" style="color:#d97706"></i> Beneficiary designations should be reviewed annually and after any major life event (marriage, divorce, birth, death). For trust beneficiaries, ensure trust documents are current.</div>' +
      '<div class="ra-cd-actions">' +
        '<button class="ra-action-btn primary" onclick="_raToast(\'Opening beneficiary change form…\')"><i class="fas fa-edit"></i> Update Beneficiaries</button>' +
        '<button class="ra-action-btn outline" onclick="_raToast(\'Downloading beneficiary designation form PDF…\')"><i class="fas fa-download"></i> Download Form</button>' +
      '</div>' +
    '</div>';
  }

  /* ── 17. TAB: SUITABILITY ─────────────────────────────────────────── */
  function _raTabSuitability(c) {
    var s = c.suitability;
    var scoreColor = s.score >= 90 ? '#059669' : s.score >= 80 ? '#d97706' : '#dc2626';
    var rows = [
      ['Risk Profile',          s.riskProfile],
      ['Time Horizon',          s.horizon],
      ['Liquidity Needs',       s.liquidity],
      ['Tax Situation',         s.tax],
      ['Regulatory Notes',      s.regNote]
    ];
    return '<div class="ra-tab-scroll">' +
      '<div class="ra-suit-score-row">' +
        '<div class="ra-suit-score-ring">' + _raDonut(s.score, scoreColor, 80) +
          '<div class="ra-suit-score-num" style="color:' + scoreColor + '">' + s.score + '</div>' +
        '</div>' +
        '<div class="ra-suit-score-body">' +
          '<div class="ra-suit-score-lbl">Suitability Score</div>' +
          '<div class="ra-suit-score-desc" style="color:' + scoreColor + '">' +
            (s.score >= 90 ? 'Excellent — Strong product fit' : s.score >= 80 ? 'Good — Suitable placement' : 'Review needed') +
          '</div>' +
          '<div class="ra-suit-reg-note"><i class="fas fa-check-circle" style="color:#059669"></i> ' + s.regNote + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="ra-cd-section-hdr"><i class="fas fa-balance-scale"></i> Suitability Assessment</div>' +
      '<table class="ra-cd-table"><tbody>' +
        rows.map(function(r){ return '<tr><td class="ra-cd-lbl">' + r[0] + '</td><td class="ra-cd-val">' + r[1] + '</td></tr>'; }).join('') +
      '</tbody></table>' +
      '<div class="ra-cd-section-hdr" style="margin-top:16px"><i class="fas fa-gavel"></i> Compliance Notes</div>' +
      '<div class="ra-suit-comp-block">' +
        '<div class="ra-suit-comp-item"><i class="fas fa-check-circle" style="color:#059669"></i> FINRA Regulation Best Interest documentation on file</div>' +
        '<div class="ra-suit-comp-item"><i class="fas fa-check-circle" style="color:#059669"></i> Client Relationship Summary (Form CRS) delivered</div>' +
        '<div class="ra-suit-comp-item"><i class="fas fa-check-circle" style="color:#059669"></i> Suitability questionnaire completed and signed</div>' +
        '<div class="ra-suit-comp-item"><i class="fas fa-check-circle" style="color:#059669"></i> Product disclosure document delivered</div>' +
      '</div>' +
      '<div class="ra-cd-actions">' +
        '<button class="ra-action-btn primary" onclick="_raToast(\'Downloading suitability documentation package…\')"><i class="fas fa-download"></i> Download Suitability Docs</button>' +
      '</div>' +
    '</div>';
  }

  /* ── 18. TAB: ANNUAL REVIEW ───────────────────────────────────────── */
  function _raTabReview(c) {
    var statusMap = {
      urgent:       { label: 'Overdue',   bg: '#fee2e2', color: '#dc2626' },
      action:       { label: 'Action Due', bg: '#fef3c7', color: '#d97706' },
      scheduled:    { label: 'Scheduled', bg: '#d1fae5', color: '#059669' },
      accumulating: { label: 'On Track',  bg: '#d1fae5', color: '#059669' }
    };
    var st = statusMap[c.reviewStatus] || statusMap['action'];

    var kpis = [
      { lbl: 'Last Review',    val: c.lastReview || 'None on file' },
      { lbl: 'Next Review',    val: c.nextReview || 'TBD' },
      { lbl: 'Review Status',  val: '<span style="background:' + st.bg + ';color:' + st.color + ';padding:2px 8px;border-radius:10px;font-weight:700">' + st.label + '</span>' },
      { lbl: 'Contract Phase', val: c.phase.charAt(0).toUpperCase() + c.phase.slice(1) }
    ];

    var kpiHtml = kpis.map(function(k) {
      return '<div class="ra-rev-kpi"><div class="ra-rev-kpi-lbl">' + k.lbl + '</div><div class="ra-rev-kpi-val">' + k.val + '</div></div>';
    }).join('');

    var agendaItems = [
      { done: c.lastReview !== null, text: 'Confirm account value and income rider balance' },
      { done: c.lastReview !== null, text: 'Review beneficiary designations' },
      { done: false, text: 'Validate income start age and income amount with client' },
      { done: false, text: 'Review free withdrawal usage this contract year' },
      { done: false, text: 'Confirm surrender charge schedule and liquidity plan' },
      { done: false, text: 'Discuss any life changes affecting retirement plan' },
      { done: false, text: 'Review suitability — confirm risk profile unchanged' },
      { done: false, text: 'Document meeting and update CRM' }
    ];

    var agendaHtml = agendaItems.map(function(a) {
      var icon = a.done ? '<i class="fas fa-check-circle" style="color:#059669"></i>' : '<i class="far fa-circle" style="color:#94a3b8"></i>';
      var cls  = a.done ? 'ra-rev-agenda-done' : '';
      return '<div class="ra-rev-agenda-item ' + cls + '">' + icon + '<span>' + a.text + '</span></div>';
    }).join('');

    return '<div class="ra-tab-scroll">' +
      '<div class="ra-rev-kpi-strip">' + kpiHtml + '</div>' +
      '<div class="ra-rev-two-col">' +
        '<div class="ra-rev-col">' +
          '<div class="ra-cd-section-hdr"><i class="fas fa-list-check"></i> Review Agenda</div>' +
          '<div class="ra-rev-agenda">' + agendaHtml + '</div>' +
        '</div>' +
        '<div class="ra-rev-col">' +
          '<div class="ra-cd-section-hdr"><i class="fas fa-robot"></i> AI Pre-Review Brief</div>' +
          '<div class="ra-rev-ai-card">' + c.aiNarrative + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="ra-cd-actions">' +
        '<button class="ra-action-btn primary" onclick="_raToast(\'Generating annual review PDF report…\')"><i class="fas fa-file-pdf"></i> Export Review Report</button>' +
        '<button class="ra-action-btn outline" onclick="_raToast(\'Opening calendar — scheduling annual review meeting…\')"><i class="fas fa-calendar-plus"></i> Schedule Review</button>' +
      '</div>' +
    '</div>';
  }

  /* ── 19. DETAIL ROW HELPER ────────────────────────────────────────── */
  function _raDetailRow(lbl, val) {
    return '<div class="ra-ov-detail-row">' +
      '<span class="ra-ov-detail-lbl">' + lbl + '</span>' +
      '<span class="ra-ov-detail-val">' + (val || '—') + '</span>' +
    '</div>';
  }

  /* ── 20. FILTER ───────────────────────────────────────────────────── */
  function raFilterContracts() {
    var q = (document.getElementById('ra-search') || {}).value || '';
    raRenderQueue(q);
  }

  /* ── 21. AI INCOME GAP SCAN ───────────────────────────────────────── */
  function raRunIncomeGapScan() {
    var panel = document.getElementById('ra-gap-panel');
    var content = document.getElementById('ra-gap-content');
    if (!panel) return;

    var rows = Object.values(_raContracts).map(function(c) {
      var gapColor = c.incomeGap > 1500 ? '#dc2626' : c.incomeGap > 800 ? '#d97706' : '#059669';
      return '<div class="ra-gap-scan-row">' +
        '<div class="ra-gap-scan-avatar" style="background:' + c.avatarGrad + '">' + c.initials + '</div>' +
        '<div class="ra-gap-scan-body">' +
          '<div class="ra-gap-scan-name">' + c.clientName + '</div>' +
          '<div class="ra-gap-scan-product">' + c.productType + ' · ' + c.guaranteedIncomeFmt + ' guaranteed</div>' +
        '</div>' +
        '<div class="ra-gap-scan-right">' +
          (c.incomeGap > 0
            ? '<span style="color:' + gapColor + ';font-weight:800">Gap: $' + c.incomeGap.toLocaleString() + '/mo</span><br>' +
              '<span style="font-size:11px;color:#64748b">Covered: ' + c.gapCovered + '%</span>'
            : '<span style="color:#059669;font-weight:700">✅ Gap Covered</span>') +
        '</div>' +
      '</div>';
    }).join('');

    content.innerHTML =
      '<div class="ra-gap-panel-hdr">' +
        '<div><div style="font-weight:700;font-size:14px"><i class="fas fa-search-dollar" style="color:#003087"></i> AI Retirement Income Gap Scan</div>' +
        '<div style="font-size:11px;color:#64748b">Across ' + Object.keys(_raContracts).length + ' annuity contracts</div></div>' +
        '<button onclick="document.getElementById(\'ra-gap-panel\').style.display=\'none\'" style="background:none;border:none;cursor:pointer;font-size:16px;color:#6b7280"><i class="fas fa-times"></i></button>' +
      '</div>' +
      rows +
      '<div style="padding:12px;background:#fef3c7;border-radius:8px;margin:12px;font-size:12px;color:#92400e">' +
        '<i class="fas fa-exclamation-triangle"></i> <strong>Total book gap: $' +
        Object.values(_raContracts).reduce(function(s,c){ return s+(c.incomeGap||0); },0).toLocaleString() +
        '/mo</strong> across 6 contracts. Priority actions: Sandra Williams SPIA (expires May 30) and Maria Gonzalez annuity maturity (Jun 15).' +
      '</div>';

    panel.style.display = '';
  }

  /* ── 22. TOAST ────────────────────────────────────────────────────── */
  function _raToast(msg) {
    var fn = window.showToast || window._p6Toast || function(m){
      var t = document.createElement('div');
      t.textContent = m;
      t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1e293b;color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.25)';
      document.body.appendChild(t);
      setTimeout(function(){ t.remove(); }, 3000);
    };
    fn(msg);
  }

  /* ── 23. STUB BUTTONS ─────────────────────────────────────────────── */
  function raOpenNewContract()   { _raToast('Opening new annuity contract wizard…'); }
  function raOpenMaturityAlert() { _raToast('Maturity alert: ANN-MG-001 matures Jun 15 — contact Maria Gonzalez immediately.'); }
  function raOpenRMDCalculator() { _raToast('Opening RMD Calculator — loading 2026 IRS life expectancy tables…'); }

  /* ── 24. PAGE INIT ────────────────────────────────────────────────── */
  function initRetAccountsPage() {
    _raRenderKPIBar();
    _raRenderAIBanner();
    raRenderQueue();
    // Auto-open first contract (ANN-MG-001 — most urgent)
    setTimeout(function() { raOpenContract('ANN-MG-001'); }, 120);
  }

  /* ── 25. MONKEY-PATCH navigateTo ──────────────────────────────────── */
  var _orig_navigateTo_ret = navigateTo;
  navigateTo = function(page) {
    _orig_navigateTo_ret(page);
    if (page === 'ret-accounts') {
      navigateTo._retAccountsTitles = navigateTo._retAccountsTitles || true;
      // Patch title/breadcrumb since they're set inside the original before we run
      var titleEl = document.getElementById('page-title');
      var bcEl    = document.getElementById('page-breadcrumb');
      if (titleEl) titleEl.textContent = 'Annuity Accounts';
      if (bcEl)    bcEl.textContent    = 'Home / Retirement / Annuity Accounts';
      requestAnimationFrame(function(){ setTimeout(initRetAccountsPage, 80); });
    }
  };

  /* ── 26. EXPOSE GLOBALS ───────────────────────────────────────────── */
  window.raRenderQueue       = raRenderQueue;
  window.raOpenContract      = raOpenContract;
  window.raBuildDetailHTML   = raBuildDetailHTML;
  window.raSwitchTab         = raSwitchTab;
  window.raFilterContracts   = raFilterContracts;
  window.raRunIncomeGapScan  = raRunIncomeGapScan;
  window.raOpenNewContract   = raOpenNewContract;
  window.raOpenMaturityAlert = raOpenMaturityAlert;
  window.raOpenRMDCalculator = raOpenRMDCalculator;
  window.initRetAccountsPage = initRetAccountsPage;

  console.log('RET Step 2 module loaded — Annuity Accounts page: 6 contracts, initRetAccountsPage, raBuildDetailHTML, raSwitchTab ready');
})();
