/* ================================================================
   INVESTMENT ACCOUNTS MODULE — INV Phase 1 (Service Hub)
   Covers: Account Dashboard · Portfolio Detail · Drift Monitor ·
           TLH Scanner · RMD Center · Rebalancing · AI Review ·
           New Account Opening
   Renders into: #ia-account-queue · #ia-detail-panel · panels
   ================================================================ */

/* ═══════════════════════════════════════════════════════════════════
   DATA — 12 Investment Accounts across 8 clients
   ═══════════════════════════════════════════════════════════════════ */

var iaAccounts = [

  /* ── Linda Morrison (UC001) — 3 accounts ── */
  {
    id: 'IA-LM-001', clientId: 8, clientName: 'Linda Morrison', initials: 'LM',
    avatarGrad: 'linear-gradient(135deg,#003087,#0057c8)',
    accountType: 'Advisory (UMA)', accountNum: 'UMA-880201',
    custodian: 'NYLIM / Pershing', openDate: 'Mar 2021',
    aum: 280000, aumFmt: '$280K', currency: 'USD',
    returnYTD: 9.2, returnYTDFmt: '+9.2%', benchmark: 'S&P 500 Blend', benchmarkYTD: 8.0,
    alpha: '+1.2%', sharpe: 1.31,
    fee: 2800, feePct: '1.00%',
    status: 'Active', statusCls: 'ia-status-active',
    driftAlert: true, driftScore: 7.4,
    rmdDue: true, rmdAmount: 14200, rmdDeadline: 'Dec 31, 2026',
    reviewDue: true, lastReview: 'Jan 15, 2026', nextReview: 'Apr 15, 2026',
    tlhOpportunity: 3200, tlhPositions: ['INTL Growth Fund (-$4.1K)', 'Bond Sleeve (-$2.8K)'],
    riskProfile: 'Moderate Growth', horizon: '9 years (retirement 2035)',
    targetAlloc: { usEquity:40, intlEquity:20, fixedIncome:25, alternatives:10, cash:5 },
    currentAlloc: { usEquity:47, intlEquity:16, fixedIncome:22, alternatives:10, cash:5 },
    holdings: [
      { name:'MainStay Epoch US Equity', type:'Mutual Fund', value:131600, pct:47.0, ret:'+11.4%', status:'overweight' },
      { name:'MainStay Candriam Intl Equity', type:'Mutual Fund', value:44800, pct:16.0, ret:'+6.2%', status:'underweight' },
      { name:'MainStay MacKay Bond', type:'Mutual Fund', value:61600, pct:22.0, ret:'+3.8%', status:'underweight' },
      { name:'Alternatives Sleeve (REIT)', type:'ETF', value:28000, pct:10.0, ret:'+7.1%', status:'on-target' },
      { name:'Cash / MMF', type:'Cash', value:14000, pct:5.0, ret:'+5.1%', status:'on-target' }
    ],
    rebalanceTrades: [
      { action:'SELL', security:'MainStay Epoch US Equity', amount:'$19,600', reason:'Reduce US Equity overweight 47%→40%' },
      { action:'BUY',  security:'MainStay Candriam Intl Equity', amount:'$11,200', reason:'Restore Intl Equity 16%→20%' },
      { action:'BUY',  security:'MainStay MacKay Bond', amount:'$8,400', reason:'Restore Fixed Income 22%→25%' }
    ],
    timeline: [
      { date:'Apr 10, 2026', event:'Q1 Performance Report sent — +9.2% YTD', type:'report' },
      { date:'Mar 15, 2026', event:'Drift alert triggered — US Equity +7% over target', type:'alert' },
      { date:'Jan 15, 2026', event:'Q4 Annual Review completed — IPS reaffirmed', type:'review' },
      { date:'Dec 20, 2025', event:'RMD $13,800 distributed — IRS compliant', type:'rmd' },
      { date:'Oct 12, 2025', event:'Portfolio rebalanced — 3 trades executed', type:'rebalance' }
    ],
    aiInsights: {
      headline: 'Strong alpha generation — drift rebalance overdue',
      summary: 'UMA-880201 is outperforming its S&P Blend benchmark by +1.2% YTD. However US Equity sleeve has drifted 7% over target weighting, increasing portfolio risk. RMD of $14,200 due Dec 31. Recommend rebalancing now and scheduling Q2 review.',
      actions: ['Execute 3-trade rebalance to restore target allocation','Process $14,200 RMD before Dec 31 deadline','Schedule Q2 review for Apr 15 — explore alternatives expansion','Review TLH opportunity in INTL sleeve ($3.2K potential savings)']
    }
  },

  {
    id: 'IA-LM-002', clientId: 8, clientName: 'Linda Morrison', initials: 'LM',
    avatarGrad: 'linear-gradient(135deg,#003087,#0057c8)',
    accountType: 'Mutual Fund Portfolio', accountNum: 'MF-880202',
    custodian: 'NYLIM / MainStay', openDate: 'Jun 2018',
    aum: 180000, aumFmt: '$180K', currency: 'USD',
    returnYTD: 9.4, returnYTDFmt: '+9.4%', benchmark: 'Morningstar Moderate', benchmarkYTD: 7.8,
    alpha: '+1.6%', sharpe: 1.18,
    fee: 1440, feePct: '0.80%',
    status: 'Active', statusCls: 'ia-status-active',
    driftAlert: false, driftScore: 2.1,
    rmdDue: false, rmdAmount: 0, rmdDeadline: null,
    reviewDue: false, lastReview: 'Mar 1, 2026', nextReview: 'Jun 1, 2026',
    tlhOpportunity: 1800, tlhPositions: ['MainStay Bond Fund (-$2.2K)'],
    riskProfile: 'Moderate', horizon: '9 years (retirement 2035)',
    targetAlloc: { usEquity:45, intlEquity:15, fixedIncome:35, alternatives:0, cash:5 },
    currentAlloc: { usEquity:46, intlEquity:14, fixedIncome:35, alternatives:0, cash:5 },
    holdings: [
      { name:'MainStay Epoch US Equity', type:'Mutual Fund', value:82800, pct:46.0, ret:'+11.4%', status:'on-target' },
      { name:'MainStay Candriam Intl', type:'Mutual Fund', value:25200, pct:14.0, ret:'+6.2%', status:'on-target' },
      { name:'MainStay MacKay Bond', type:'Mutual Fund', value:63000, pct:35.0, ret:'+3.8%', status:'on-target' },
      { name:'Cash / MMF', type:'Cash', value:9000, pct:5.0, ret:'+5.1%', status:'on-target' }
    ],
    rebalanceTrades: [],
    timeline: [
      { date:'Mar 1, 2026', event:'Q1 review completed — portfolio on track', type:'review' },
      { date:'Jan 10, 2026', event:'Dividend reinvestment processed — $4,200', type:'dividend' },
      { date:'Oct 5, 2025', event:'Minor rebalance — Bond sleeve topped up', type:'rebalance' }
    ],
    aiInsights: {
      headline: 'Well-balanced — minor TLH opportunity',
      summary: 'MF-880202 is performing above its Morningstar Moderate benchmark by +1.6%. Portfolio is well-balanced with minimal drift. $1,800 tax-loss harvesting opportunity exists in the Bond sleeve.',
      actions: ['Harvest $1,800 TLH in MainStay Bond Fund before year-end','Maintain current allocation — no rebalance needed','Reinvest dividends per standing instruction']
    }
  },

  {
    id: 'IA-LM-003', clientId: 8, clientName: 'Linda Morrison', initials: 'LM',
    avatarGrad: 'linear-gradient(135deg,#003087,#0057c8)',
    accountType: '529 College Savings', accountNum: '529-880203',
    custodian: 'NY 529 Direct Plan', openDate: 'Sep 2010',
    aum: 94000, aumFmt: '$94K', currency: 'USD',
    returnYTD: 7.8, returnYTDFmt: '+7.8%', benchmark: 'Age-Based Moderate', benchmarkYTD: 7.1,
    alpha: '+0.7%', sharpe: 1.05,
    fee: 470, feePct: '0.50%',
    status: 'Active', statusCls: 'ia-status-active',
    driftAlert: false, driftScore: 1.2,
    rmdDue: false, rmdAmount: 0, rmdDeadline: null,
    reviewDue: false, lastReview: 'Feb 15, 2026', nextReview: 'Aug 15, 2026',
    tlhOpportunity: 0, tlhPositions: [],
    riskProfile: 'Age-Based Moderate', horizon: '4 years (beneficiary age 18: 2030)',
    beneficiary: 'Emily Morrison (age 14)',
    targetAlloc: { usEquity:50, intlEquity:10, fixedIncome:35, alternatives:0, cash:5 },
    currentAlloc: { usEquity:51, intlEquity:10, fixedIncome:34, alternatives:0, cash:5 },
    holdings: [
      { name:'NY 529 US Equity Index', type:'Index Fund', value:47940, pct:51.0, ret:'+10.8%', status:'on-target' },
      { name:'NY 529 Intl Equity Index', type:'Index Fund', value:9400, pct:10.0, ret:'+5.9%', status:'on-target' },
      { name:'NY 529 Bond Index', type:'Index Fund', value:31960, pct:34.0, ret:'+3.2%', status:'on-target' },
      { name:'Cash / Stable Value', type:'Cash', value:4700, pct:5.0, ret:'+5.0%', status:'on-target' }
    ],
    rebalanceTrades: [],
    timeline: [
      { date:'Feb 15, 2026', event:'Annual 529 review — glide path on track', type:'review' },
      { date:'Dec 1, 2025', event:'NY state tax deduction confirmed — $9,400 contribution', type:'contribution' },
      { date:'Sep 10, 2025', event:'Age-based rebalance — shifted 5% from equity to bonds', type:'rebalance' }
    ],
    aiInsights: {
      headline: '529 on glide path — consider contribution increase',
      summary: 'Emily\'s 529 is on track for an estimated $104K at college enrollment (2030). With 4 years remaining the allocation is automatically shifting toward bonds. Recommend increasing annual contribution by $2,000 to close the projected $18K gap to a 4-year private university estimate.',
      actions: ['Increase annual contribution from $9,400 to $11,400 to close projected gap','Review age-based glide path at next shift (age 15)','Confirm NY state tax deduction eligibility — up to $10,000/yr']
    }
  },

  /* ── Robert Chen (UC002) — 2 accounts ── */
  {
    id: 'IA-RC-001', clientId: 3, clientName: 'Robert Chen', initials: 'RC',
    avatarGrad: 'linear-gradient(135deg,#7c3aed,#a855f7)',
    accountType: 'Advisory (SMA)', accountNum: 'SMA-300201',
    custodian: 'NYLIM / Pershing', openDate: 'Nov 2020',
    aum: 320000, aumFmt: '$320K', currency: 'USD',
    returnYTD: 10.1, returnYTDFmt: '+10.1%', benchmark: 'S&P 500', benchmarkYTD: 9.2,
    alpha: '+0.9%', sharpe: 1.42,
    fee: 3200, feePct: '1.00%',
    status: 'Active', statusCls: 'ia-status-active',
    driftAlert: true, driftScore: 6.8,
    rmdDue: false, rmdAmount: 0, rmdDeadline: null,
    reviewDue: true, lastReview: 'Jan 20, 2026', nextReview: 'Apr 20, 2026',
    tlhOpportunity: 4200, tlhPositions: ['Tech Sector Sleeve (-$5.1K)', 'Intl Equity (-$1.8K)'],
    riskProfile: 'Growth', horizon: '20 years (retirement 2045)',
    targetAlloc: { usEquity:60, intlEquity:20, fixedIncome:10, alternatives:5, cash:5 },
    currentAlloc: { usEquity:67, intlEquity:17, fixedIncome:8, alternatives:5, cash:3 },
    holdings: [
      { name:'US Large Cap Growth (SMA)', type:'SMA Sleeve', value:214400, pct:67.0, ret:'+12.8%', status:'overweight' },
      { name:'Intl Developed Markets (SMA)', type:'SMA Sleeve', value:54400, pct:17.0, ret:'+7.4%', status:'underweight' },
      { name:'Investment Grade Bonds (SMA)', type:'SMA Sleeve', value:25600, pct:8.0, ret:'+3.1%', status:'underweight' },
      { name:'Alternatives (REIT + Commodity)', type:'ETF', value:16000, pct:5.0, ret:'+6.8%', status:'on-target' },
      { name:'Cash / MMF', type:'Cash', value:9600, pct:3.0, ret:'+5.1%', status:'on-target' }
    ],
    rebalanceTrades: [
      { action:'SELL', security:'US Large Cap Growth', amount:'$22,400', reason:'Reduce US Equity overweight 67%→60%' },
      { action:'BUY',  security:'Intl Developed Markets', amount:'$9,600', reason:'Restore Intl 17%→20%' },
      { action:'BUY',  security:'Investment Grade Bonds', amount:'$6,400', reason:'Restore Fixed Income 8%→10%' },
      { action:'BUY',  security:'Cash / MMF', amount:'$6,400', reason:'Restore cash buffer 3%→5%' }
    ],
    timeline: [
      { date:'Apr 8, 2026', event:'SMA quarterly report generated — outperforming S&P by +0.9%', type:'report' },
      { date:'Mar 20, 2026', event:'Tech sleeve drift alert — US Equity +7% over target', type:'alert' },
      { date:'Jan 20, 2026', event:'Annual review — IPS updated, risk tolerance reaffirmed Growth', type:'review' },
      { date:'Nov 15, 2025', event:'Tax-loss harvest completed — $3,800 realized losses banked', type:'tlh' }
    ],
    aiInsights: {
      headline: 'Outperforming benchmark — rebalance recommended now',
      summary: 'SMA-300201 is generating +0.9% alpha vs S&P 500. Strong US equity performance has caused a 7% overweight drift. With Robert\'s Growth profile and 20-year horizon the drift is tolerable short-term, but rebalancing now locks in gains and restores diversification. Q2 review overdue.',
      actions: ['Execute 4-trade rebalance — sell US equity overweight, buy intl/bonds/cash','Harvest $4,200 TLH in tech and intl sleeves before Q2','Schedule Q2 review Apr 20 — present deferred annuity alongside SMA','Consider adding alternatives sleeve to 10% to reduce correlation']
    }
  },

  {
    id: 'IA-RC-002', clientId: 3, clientName: 'Robert Chen', initials: 'RC',
    avatarGrad: 'linear-gradient(135deg,#7c3aed,#a855f7)',
    accountType: 'ETF Portfolio', accountNum: 'ETF-300202',
    custodian: 'NYLIM / Pershing', openDate: 'Mar 2023',
    aum: 95000, aumFmt: '$95K', currency: 'USD',
    returnYTD: 8.6, returnYTDFmt: '+8.6%', benchmark: 'Morningstar Growth', benchmarkYTD: 8.1,
    alpha: '+0.5%', sharpe: 1.12,
    fee: 712, feePct: '0.75%',
    status: 'Active', statusCls: 'ia-status-active',
    driftAlert: false, driftScore: 2.8,
    rmdDue: false, rmdAmount: 0, rmdDeadline: null,
    reviewDue: false, lastReview: 'Feb 10, 2026', nextReview: 'May 10, 2026',
    tlhOpportunity: 0, tlhPositions: [],
    riskProfile: 'Growth', horizon: '20 years (retirement 2045)',
    targetAlloc: { usEquity:65, intlEquity:20, fixedIncome:10, alternatives:0, cash:5 },
    currentAlloc: { usEquity:66, intlEquity:19, fixedIncome:10, alternatives:0, cash:5 },
    holdings: [
      { name:'VTI — Vanguard Total Market ETF', type:'ETF', value:62700, pct:66.0, ret:'+10.2%', status:'on-target' },
      { name:'VXUS — Vanguard Total Intl ETF', type:'ETF', value:18050, pct:19.0, ret:'+6.8%', status:'on-target' },
      { name:'BND — Vanguard Total Bond ETF', type:'ETF', value:9500, pct:10.0, ret:'+3.4%', status:'on-target' },
      { name:'Cash / MMF', type:'Cash', value:4750, pct:5.0, ret:'+5.1%', status:'on-target' }
    ],
    rebalanceTrades: [],
    timeline: [
      { date:'Feb 10, 2026', event:'Q1 review — portfolio on target, performance solid', type:'review' },
      { date:'Jan 5, 2026', event:'Annual contribution $24,000 received and invested', type:'contribution' }
    ],
    aiInsights: {
      headline: 'Low-cost ETF portfolio performing well — no action needed',
      summary: 'ETF-300202 is a low-cost core portfolio with minimal tracking error vs Morningstar Growth. Expense ratios average 0.04% — very efficient. Portfolio is nearly perfectly allocated. Consider consolidating into the SMA account to reduce administrative complexity as AUM grows.',
      actions: ['No immediate action required — monitor quarterly','Consider SMA consolidation when ETF account exceeds $150K AUM','Add $24,000 annual contribution to maintain systematic investment plan']
    }
  },

  /* ── James Whitfield (UC003) — 1 account ── */
  {
    id: 'IA-JW-001', clientId: 1, clientName: 'James Whitfield', initials: 'JW',
    avatarGrad: 'linear-gradient(135deg,#0891b2,#22d3ee)',
    accountType: 'IRA (Traditional)', accountNum: 'IRA-291001',
    custodian: 'NYLIM / Pershing', openDate: 'Jun 2019',
    aum: 145000, aumFmt: '$145K', currency: 'USD',
    returnYTD: 7.9, returnYTDFmt: '+7.9%', benchmark: 'Morningstar Moderate', benchmarkYTD: 7.8,
    alpha: '+0.1%', sharpe: 0.98,
    fee: 1015, feePct: '0.70%',
    status: 'Review Due', statusCls: 'ia-status-review',
    driftAlert: true, driftScore: 5.3,
    rmdDue: true, rmdAmount: 7250, rmdDeadline: 'Dec 31, 2026',
    reviewDue: true, lastReview: 'Oct 20, 2025', nextReview: 'Apr 15, 2026',
    tlhOpportunity: 0, tlhPositions: [],
    riskProfile: 'Moderate', horizon: '13 years (retirement 2039)',
    targetAlloc: { usEquity:50, intlEquity:15, fixedIncome:30, alternatives:0, cash:5 },
    currentAlloc: { usEquity:55, intlEquity:12, fixedIncome:28, alternatives:0, cash:5 },
    holdings: [
      { name:'MainStay Epoch US Equity', type:'Mutual Fund', value:79750, pct:55.0, ret:'+11.4%', status:'overweight' },
      { name:'MainStay Candriam Intl', type:'Mutual Fund', value:17400, pct:12.0, ret:'+6.2%', status:'underweight' },
      { name:'MainStay MacKay Bond', type:'Mutual Fund', value:40600, pct:28.0, ret:'+3.8%', status:'underweight' },
      { name:'Cash / MMF', type:'Cash', value:7250, pct:5.0, ret:'+5.1%', status:'on-target' }
    ],
    rebalanceTrades: [
      { action:'SELL', security:'MainStay Epoch US Equity', amount:'$7,250', reason:'Reduce US Equity 55%→50%' },
      { action:'BUY',  security:'MainStay Candriam Intl', amount:'$4,350', reason:'Restore Intl 12%→15%' },
      { action:'BUY',  security:'MainStay MacKay Bond', amount:'$2,900', reason:'Restore Fixed Income 28%→30%' }
    ],
    timeline: [
      { date:'Apr 10, 2026', event:'Review overdue — last review Oct 2025 (6 months ago)', type:'alert' },
      { date:'Oct 20, 2025', event:'Semi-annual review — IPS confirmed, bond sleeve discussed', type:'review' },
      { date:'Dec 15, 2025', event:'RMD $6,800 distributed — IRS compliant 2025', type:'rmd' }
    ],
    aiInsights: {
      headline: 'Review 6 months overdue — RMD + rebalance both needed',
      summary: 'IRA-291001 review is 6 months overdue (last Oct 2025). US Equity has drifted +5% over target. RMD of $7,250 must be distributed before Dec 31, 2026. James\'s annual review is Apr 15 — ideal to address all items simultaneously.',
      actions: ['Schedule review Apr 15 — combine with insurance annual review','Execute rebalance: 3 trades to restore target allocation','Process $7,250 RMD before Dec 31, 2026 deadline','Present deferred annuity alongside IRA for income diversification at retirement']
    }
  },

  /* ── Maria Gonzalez (UC004) — 2 accounts ── */
  {
    id: 'IA-MG-001', clientId: 6, clientName: 'Maria Gonzalez', initials: 'MG',
    avatarGrad: 'linear-gradient(135deg,#059669,#34d399)',
    accountType: 'ETF Portfolio', accountNum: 'ETF-341001',
    custodian: 'NYLIM / Pershing', openDate: 'Feb 2022',
    aum: 120000, aumFmt: '$120K', currency: 'USD',
    returnYTD: 8.2, returnYTDFmt: '+8.2%', benchmark: 'Morningstar Moderate Growth', benchmarkYTD: 8.0,
    alpha: '+0.2%', sharpe: 1.08,
    fee: 900, feePct: '0.75%',
    status: 'Active', statusCls: 'ia-status-active',
    driftAlert: false, driftScore: 1.9,
    rmdDue: false, rmdAmount: 0, rmdDeadline: null,
    reviewDue: false, lastReview: 'Mar 5, 2026', nextReview: 'Jun 5, 2026',
    tlhOpportunity: 0, tlhPositions: [],
    riskProfile: 'Moderate Growth', horizon: '17 years (retirement 2043)',
    targetAlloc: { usEquity:55, intlEquity:20, fixedIncome:20, alternatives:0, cash:5 },
    currentAlloc: { usEquity:55, intlEquity:20, fixedIncome:20, alternatives:0, cash:5 },
    holdings: [
      { name:'SPY — SPDR S&P 500 ETF', type:'ETF', value:66000, pct:55.0, ret:'+9.8%', status:'on-target' },
      { name:'EFA — iShares MSCI EAFE ETF', type:'ETF', value:24000, pct:20.0, ret:'+7.1%', status:'on-target' },
      { name:'AGG — iShares Core Bond ETF', type:'ETF', value:24000, pct:20.0, ret:'+3.6%', status:'on-target' },
      { name:'Cash / MMF', type:'Cash', value:6000, pct:5.0, ret:'+5.1%', status:'on-target' }
    ],
    rebalanceTrades: [],
    timeline: [
      { date:'Mar 5, 2026', event:'Q1 review — fully allocated, slight alpha vs benchmark', type:'review' },
      { date:'Jan 15, 2026', event:'$12,000 additional contribution invested — DCA plan', type:'contribution' }
    ],
    aiInsights: {
      headline: 'Portfolio perfectly on target — DCA plan working well',
      summary: 'ETF-341001 is perfectly aligned to its Moderate Growth target allocation. The DCA plan is systematic and effective. Maria\'s fixed annuity ($95K) provides guaranteed income alongside this growth portfolio — a well-balanced approach.',
      actions: ['Continue DCA plan — $1,000/month systematic investment','Schedule Q2 review Jun 5 — discuss equity exposure increase as horizon extends','Consider adding $50K+ to UMA/SMA for personalized management']
    }
  },

  {
    id: 'IA-MG-002', clientId: 6, clientName: 'Maria Gonzalez', initials: 'MG',
    avatarGrad: 'linear-gradient(135deg,#059669,#34d399)',
    accountType: 'IRA (Roth)', accountNum: 'ROTH-341002',
    custodian: 'NYLIM / Pershing', openDate: 'Apr 2023',
    aum: 28000, aumFmt: '$28K', currency: 'USD',
    returnYTD: 9.1, returnYTDFmt: '+9.1%', benchmark: 'S&P 500', benchmarkYTD: 9.2,
    alpha: '-0.1%', sharpe: 1.01,
    fee: 0, feePct: '0.00% (self-directed)',
    status: 'Active', statusCls: 'ia-status-active',
    driftAlert: false, driftScore: 0.8,
    rmdDue: false, rmdAmount: 0, rmdDeadline: null,
    reviewDue: false, lastReview: 'Mar 5, 2026', nextReview: 'Jun 5, 2026',
    tlhOpportunity: 0, tlhPositions: [],
    riskProfile: 'Aggressive Growth', horizon: '17 years (retirement 2043)',
    targetAlloc: { usEquity:80, intlEquity:15, fixedIncome:0, alternatives:0, cash:5 },
    currentAlloc: { usEquity:80, intlEquity:15, fixedIncome:0, alternatives:0, cash:5 },
    holdings: [
      { name:'VTI — Vanguard Total Market ETF', type:'ETF', value:22400, pct:80.0, ret:'+10.2%', status:'on-target' },
      { name:'VXUS — Vanguard Total Intl ETF', type:'ETF', value:4200, pct:15.0, ret:'+6.8%', status:'on-target' },
      { name:'Cash / MMF', type:'Cash', value:1400, pct:5.0, ret:'+5.1%', status:'on-target' }
    ],
    rebalanceTrades: [],
    timeline: [
      { date:'Mar 5, 2026', event:'Roth IRA maxed for 2026 — $7,000 contribution received', type:'contribution' },
      { date:'Jan 10, 2026', event:'2025 contribution confirmed — $7,000', type:'contribution' }
    ],
    aiInsights: {
      headline: 'Roth performing — max contributions on track',
      summary: 'ROTH-341002 is on track with maximum annual contributions ($7,000/yr). Roth IRA grows tax-free — at current rate projects to $142K by retirement 2043. No RMD applies. Consider advisor-managed option once balance exceeds $50K.',
      actions: ['Continue maxing Roth IRA — $7,000/yr contribution','Maintain aggressive allocation — 17-year horizon supports equity-heavy exposure','Convert to advisor-managed account when balance reaches $50K threshold']
    }
  },

  /* ── Alex Rivera (new client, 1 account — funding pending) ── */
  {
    id: 'IA-AR-001', clientId: 9, clientName: 'Alex Rivera', initials: 'AR',
    avatarGrad: 'linear-gradient(135deg,#003087,#0057c8)',
    accountType: 'Advisory (UMA)', accountNum: 'UMA-360001',
    custodian: 'NYLIM / Pershing', openDate: 'Apr 2026',
    aum: 0, aumFmt: '$0 (Pending)', currency: 'USD',
    returnYTD: 0, returnYTDFmt: '—', benchmark: 'S&P 500 Blend', benchmarkYTD: 9.2,
    alpha: '—', sharpe: null,
    fee: 0, feePct: '1.00% (when funded)',
    status: 'Funding Pending', statusCls: 'ia-status-funding',
    driftAlert: false, driftScore: 0,
    rmdDue: false, rmdAmount: 0, rmdDeadline: null,
    reviewDue: false, lastReview: null, nextReview: 'Oct 1, 2026',
    tlhOpportunity: 0, tlhPositions: [],
    riskProfile: 'Moderate Growth', horizon: '31 years (retirement 2057)',
    targetAlloc: { usEquity:60, intlEquity:20, fixedIncome:15, alternatives:0, cash:5 },
    currentAlloc: { usEquity:0, intlEquity:0, fixedIncome:0, alternatives:0, cash:0 },
    fundingDetails: {
      initialDeposit: '$50,000 via ACH',
      acatTransfer: '$30,000 from Schwab (in progress)',
      expectedFundingDate: 'Apr 18, 2026',
      imasSigned: true, suitabilityApproved: true
    },
    holdings: [],
    rebalanceTrades: [],
    timeline: [
      { date:'Apr 12, 2026', event:'Account opened — IMA signed, suitability approved', type:'open' },
      { date:'Apr 12, 2026', event:'Initial deposit $50K ACH initiated — ETA Apr 14', type:'funding' },
      { date:'Apr 12, 2026', event:'ACAT transfer $30K from Schwab initiated — ETA Apr 18', type:'funding' }
    ],
    aiInsights: {
      headline: 'New account — pending full funding Apr 18',
      summary: 'UMA-360001 account opened Apr 12. IMA signed, suitability approved. ACH initial deposit of $50K expected Apr 14; ACAT transfer of $30K from Schwab expected Apr 18. Once funded ($80K total), initial portfolio construction trade will execute per IPS target allocation.',
      actions: ['Monitor ACH receipt — expected Apr 14','Confirm ACAT transfer from Schwab — call if not received by Apr 19','Execute initial portfolio construction trade upon full funding','Send welcome package and online portal access instructions']
    }
  },

  /* ── Patricia Nguyen (1 account) ── */
  {
    id: 'IA-PN-001', clientId: 2, clientName: 'Patricia Nguyen', initials: 'PN',
    avatarGrad: 'linear-gradient(135deg,#2563eb,#7c3aed)',
    accountType: 'ETF Portfolio', accountNum: 'ETF-301001',
    custodian: 'NYLIM / Pershing', openDate: 'Jan 2023',
    aum: 68000, aumFmt: '$68K', currency: 'USD',
    returnYTD: 7.4, returnYTDFmt: '+7.4%', benchmark: 'Morningstar Conservative Growth', benchmarkYTD: 7.0,
    alpha: '+0.4%', sharpe: 0.94,
    fee: 510, feePct: '0.75%',
    status: 'Active', statusCls: 'ia-status-active',
    driftAlert: true, driftScore: 5.1,
    rmdDue: false, rmdAmount: 0, rmdDeadline: null,
    reviewDue: false, lastReview: 'Feb 20, 2026', nextReview: 'May 20, 2026',
    tlhOpportunity: 800, tlhPositions: ['Bond ETF (-$1.1K)'],
    riskProfile: 'Conservative Growth', horizon: '27 years (retirement 2053)',
    targetAlloc: { usEquity:45, intlEquity:15, fixedIncome:35, alternatives:0, cash:5 },
    currentAlloc: { usEquity:50, intlEquity:13, fixedIncome:32, alternatives:0, cash:5 },
    holdings: [
      { name:'VTI — Vanguard Total Market ETF', type:'ETF', value:34000, pct:50.0, ret:'+10.2%', status:'overweight' },
      { name:'VXUS — Vanguard Total Intl ETF', type:'ETF', value:8840, pct:13.0, ret:'+6.8%', status:'underweight' },
      { name:'AGG — iShares Core Bond ETF', type:'ETF', value:21760, pct:32.0, ret:'+3.6%', status:'underweight' },
      { name:'Cash / MMF', type:'Cash', value:3400, pct:5.0, ret:'+5.1%', status:'on-target' }
    ],
    rebalanceTrades: [
      { action:'SELL', security:'VTI — Total Market ETF', amount:'$3,400', reason:'Reduce US Equity overweight 50%→45%' },
      { action:'BUY',  security:'VXUS — Total Intl ETF', amount:'$1,360', reason:'Restore Intl 13%→15%' },
      { action:'BUY',  security:'AGG — Core Bond ETF', amount:'$2,040', reason:'Restore Fixed Income 32%→35%' }
    ],
    timeline: [
      { date:'Apr 5, 2026', event:'Drift alert — US Equity drifted +5% over target', type:'alert' },
      { date:'Feb 20, 2026', event:'Q1 review completed — DCA plan confirmed', type:'review' }
    ],
    aiInsights: {
      headline: 'ETF drift alert — minor rebalance needed',
      summary: 'ETF-301001 has drifted 5% in US equity due to strong market performance. Patricia\'s Conservative Growth profile warrants keeping bonds at 35%. Small rebalance recommended. Note: Patricia\'s UL policy under-funding is a cash flow concern — coordinate insurance and investment review together.',
      actions: ['Execute 3-trade rebalance — minor (~$3.4K total movement)','Harvest $800 TLH in AGG bond ETF','Coordinate with insurance review — UL lapse risk affects overall financial plan','Schedule combined insurance + investment review call']
    }
  },

  /* ── Sandra Williams (1 account) ── */
  {
    id: 'IA-SW-001', clientId: 4, clientName: 'Sandra Williams', initials: 'SW',
    avatarGrad: 'linear-gradient(135deg,#dc2626,#f59e0b)',
    accountType: 'IRA (Traditional)', accountNum: 'IRA-320001',
    custodian: 'NYLIM / Pershing', openDate: 'Aug 2017',
    aum: 312000, aumFmt: '$312K', currency: 'USD',
    returnYTD: 6.8, returnYTDFmt: '+6.8%', benchmark: 'Morningstar Conservative', benchmarkYTD: 6.5,
    alpha: '+0.3%', sharpe: 0.88,
    fee: 2184, feePct: '0.70%',
    status: 'Review Due', statusCls: 'ia-status-review',
    driftAlert: false, driftScore: 2.2,
    rmdDue: true, rmdAmount: 11400, rmdDeadline: 'Dec 31, 2026',
    reviewDue: true, lastReview: 'Sep 15, 2025', nextReview: 'Apr 10, 2026',
    tlhOpportunity: 0, tlhPositions: [],
    riskProfile: 'Conservative', horizon: '5 years (retirement 2031)',
    targetAlloc: { usEquity:30, intlEquity:10, fixedIncome:50, alternatives:0, cash:10 },
    currentAlloc: { usEquity:31, intlEquity:9, fixedIncome:50, alternatives:0, cash:10 },
    holdings: [
      { name:'MainStay Epoch US Equity', type:'Mutual Fund', value:96720, pct:31.0, ret:'+11.4%', status:'on-target' },
      { name:'MainStay Candriam Intl', type:'Mutual Fund', value:28080, pct:9.0, ret:'+6.2%', status:'on-target' },
      { name:'MainStay MacKay Bond', type:'Mutual Fund', value:156000, pct:50.0, ret:'+3.8%', status:'on-target' },
      { name:'Cash / MMF', type:'Cash', value:31200, pct:10.0, ret:'+5.1%', status:'on-target' }
    ],
    rebalanceTrades: [],
    timeline: [
      { date:'Apr 8, 2026', event:'Review overdue — last review Sep 2025 (7 months ago)', type:'alert' },
      { date:'Sep 15, 2025', event:'Semi-annual review — glide path discussed, bonds increased', type:'review' },
      { date:'Dec 20, 2025', event:'RMD $10,800 distributed on time — IRS compliant 2025', type:'rmd' }
    ],
    aiInsights: {
      headline: 'Conservative IRA — RMD + review both overdue',
      summary: 'IRA-320001 is Sandra\'s primary retirement vehicle with $312K. Portfolio is well-allocated for Conservative profile with 5 years to retirement. Review is 7 months overdue. $11,400 RMD due Dec 31. Sandra\'s term policy expires Sep 2026 — coordinate insurance conversion discussion with investment review.',
      actions: ['Schedule immediate review — 7 months overdue','Process $11,400 RMD before Dec 31, 2026','Discuss annuity income rider to supplement IRA distributions at retirement','Coordinate with term policy conversion conversation — same meeting']
    }
  },

  /* ── David Thompson (1 account — recently opened) ── */
  {
    id: 'IA-DT-001', clientId: 5, clientName: 'David Thompson', initials: 'DT',
    avatarGrad: 'linear-gradient(135deg,#7c3aed,#a855f7)',
    accountType: 'Mutual Fund Portfolio', accountNum: 'MF-305001',
    custodian: 'NYLIM / MainStay', openDate: 'Mar 2026',
    aum: 42000, aumFmt: '$42K', currency: 'USD',
    returnYTD: 3.1, returnYTDFmt: '+3.1%', benchmark: 'Morningstar Moderate Growth', benchmarkYTD: 8.0,
    alpha: '—', sharpe: null,
    fee: 315, feePct: '0.75%',
    status: 'Active', statusCls: 'ia-status-active',
    driftAlert: false, driftScore: 0.5,
    rmdDue: false, rmdAmount: 0, rmdDeadline: null,
    reviewDue: false, lastReview: 'Mar 15, 2026', nextReview: 'Sep 15, 2026',
    tlhOpportunity: 0, tlhPositions: [],
    riskProfile: 'Moderate Growth', horizon: '32 years (retirement 2058)',
    targetAlloc: { usEquity:60, intlEquity:20, fixedIncome:15, alternatives:0, cash:5 },
    currentAlloc: { usEquity:60, intlEquity:20, fixedIncome:15, alternatives:0, cash:5 },
    holdings: [
      { name:'MainStay Epoch US Equity', type:'Mutual Fund', value:25200, pct:60.0, ret:'+3.8%', status:'on-target' },
      { name:'MainStay Candriam Intl', type:'Mutual Fund', value:8400, pct:20.0, ret:'+2.1%', status:'on-target' },
      { name:'MainStay MacKay Bond', type:'Mutual Fund', value:6300, pct:15.0, ret:'+1.2%', status:'on-target' },
      { name:'Cash / MMF', type:'Cash', value:2100, pct:5.0, ret:'+1.4%', status:'on-target' }
    ],
    rebalanceTrades: [],
    timeline: [
      { date:'Mar 15, 2026', event:'Account opened — initial $42,000 invested per IPS', type:'open' },
      { date:'Mar 15, 2026', event:'Onboarding complete — portal access confirmed', type:'open' }
    ],
    aiInsights: {
      headline: 'New account — early returns in line with inception',
      summary: 'MF-305001 was opened Mar 2026. YTD returns of +3.1% reflect a partial year (1 month). Account is perfectly allocated. David is age 33 with a 32-year horizon — strong long-term growth potential. Upsell opportunity: DI coverage gap and 529 for new marriage.',
      actions: ['Set up $500/month automatic investment plan','Present DI insurance — income protection alongside investment growth','Discuss 529 plan — recently married, future college planning','Schedule 6-month check-in Sep 15, 2026']
    }
  }

];

/* ═══════════════════════════════════════════════════════════════════
   DRIFT DATA — accounts with drift > 5%
   ═══════════════════════════════════════════════════════════════════ */
var iaDriftAccounts = iaAccounts.filter(function(a) { return a.driftAlert; });

/* ═══════════════════════════════════════════════════════════════════
   TLH DATA — accounts with tax-loss harvesting opportunities
   ═══════════════════════════════════════════════════════════════════ */
var iaTLHAccounts = iaAccounts.filter(function(a) { return a.tlhOpportunity > 0; });

/* ═══════════════════════════════════════════════════════════════════
   RMD DATA — clients with RMDs due
   ═══════════════════════════════════════════════════════════════════ */
var iaRMDAccounts = iaAccounts.filter(function(a) { return a.rmdDue; });

/* ═══════════════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════════════ */
var _iaActiveAccount = null;
var _iaActiveTab     = 'overview';
var _iaFilterType    = '';
var _iaFilterStatus  = '';
var _iaSearchTerm    = '';

/* ═══════════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════════ */
function initInvAccountsPage() {
  requestAnimationFrame(function() {
    setTimeout(function() {
      iaRenderAccountQueue();
    }, 80);
  });
}

/* ═══════════════════════════════════════════════════════════════════
   ACCOUNT QUEUE RENDERER
   ═══════════════════════════════════════════════════════════════════ */
function iaRenderAccountQueue() {
  var queue = document.getElementById('ia-account-queue');
  if (!queue) return;

  var accounts = iaGetFilteredAccounts();

  // Group by status priority
  var funding  = accounts.filter(function(a) { return a.status === 'Funding Pending'; });
  var review   = accounts.filter(function(a) { return a.status === 'Review Due'; });
  var drift    = accounts.filter(function(a) { return a.status === 'Active' && a.driftAlert; });
  var active   = accounts.filter(function(a) { return a.status === 'Active' && !a.driftAlert; });

  var html = '';

  if (funding.length) {
    html += '<div class="ia-section-hdr ia-section-funding"><i class="fas fa-hourglass-half"></i> Funding Pending <span class="ia-sec-count">' + funding.length + '</span></div>';
    html += funding.map(iaRenderAccountCard).join('');
  }
  if (review.length) {
    html += '<div class="ia-section-hdr ia-section-review"><i class="fas fa-exclamation-circle"></i> Review Due <span class="ia-sec-count">' + review.length + '</span></div>';
    html += review.map(iaRenderAccountCard).join('');
  }
  if (drift.length) {
    html += '<div class="ia-section-hdr ia-section-drift"><i class="fas fa-balance-scale"></i> Drift Alert <span class="ia-sec-count">' + drift.length + '</span></div>';
    html += drift.map(iaRenderAccountCard).join('');
  }
  if (active.length) {
    html += '<div class="ia-section-hdr ia-section-active"><i class="fas fa-check-circle"></i> Active — On Target <span class="ia-sec-count">' + active.length + '</span></div>';
    html += active.map(iaRenderAccountCard).join('');
  }
  if (!accounts.length) {
    html = '<div class="ia-empty-state"><i class="fas fa-search"></i><span>No accounts match your filters</span></div>';
  }

  queue.innerHTML = html;
}

function iaGetFilteredAccounts() {
  return iaAccounts.filter(function(a) {
    var typeMatch   = !_iaFilterType   || a.accountType === _iaFilterType;
    var statusMatch = !_iaFilterStatus || a.status === _iaFilterStatus;
    var searchMatch = !_iaSearchTerm   ||
      a.clientName.toLowerCase().includes(_iaSearchTerm) ||
      a.accountNum.toLowerCase().includes(_iaSearchTerm) ||
      a.accountType.toLowerCase().includes(_iaSearchTerm);
    return typeMatch && statusMatch && searchMatch;
  });
}

function iaRenderAccountCard(a) {
  var active = _iaActiveAccount === a.id ? ' ia-card-active' : '';
  var statusIcon = {
    'Active':         'fa-check-circle',
    'Review Due':     'fa-exclamation-circle',
    'Funding Pending':'fa-hourglass-half'
  }[a.status] || 'fa-circle';
  var statusColor = {
    'Active':         '#059669',
    'Review Due':     '#d97706',
    'Funding Pending':'#0891b2'
  }[a.status] || '#64748b';

  var retColor = a.returnYTD > 0 ? '#059669' : a.returnYTD < 0 ? '#dc2626' : '#64748b';
  var driftBadge = a.driftAlert
    ? '<span class="ia-drift-badge"><i class="fas fa-balance-scale"></i> Drift ' + a.driftScore.toFixed(1) + '%</span>'
    : '';
  var rmdBadge = a.rmdDue
    ? '<span class="ia-rmd-badge"><i class="fas fa-calendar-exclamation"></i> RMD</span>'
    : '';
  var tlhBadge = a.tlhOpportunity > 0
    ? '<span class="ia-tlh-badge"><i class="fas fa-leaf"></i> TLH $' + (a.tlhOpportunity/1000).toFixed(1) + 'K</span>'
    : '';

  // Mini allocation bar
  var allocBar = '';
  if (a.aum > 0) {
    var tc = a.currentAlloc;
    allocBar = '<div class="ia-alloc-mini">' +
      (tc.usEquity   ? '<div class="ia-alloc-seg ia-seg-us"    style="width:' + tc.usEquity    + '%"  title="US Equity ' + tc.usEquity + '%"></div>' : '') +
      (tc.intlEquity ? '<div class="ia-alloc-seg ia-seg-intl"  style="width:' + tc.intlEquity  + '%"  title="Intl Equity ' + tc.intlEquity + '%"></div>' : '') +
      (tc.fixedIncome? '<div class="ia-alloc-seg ia-seg-fi"    style="width:' + tc.fixedIncome + '%"  title="Fixed Income ' + tc.fixedIncome + '%"></div>' : '') +
      (tc.alternatives?'<div class="ia-alloc-seg ia-seg-alt"   style="width:' + tc.alternatives+ '%"  title="Alternatives ' + tc.alternatives + '%"></div>' : '') +
      (tc.cash       ? '<div class="ia-alloc-seg ia-seg-cash"  style="width:' + tc.cash        + '%"  title="Cash ' + tc.cash + '%"></div>' : '') +
      '</div>';
  }

  return '<div class="ia-card' + active + '" onclick="iaOpenAccount(\'' + a.id + '\')">' +
    '<div class="ia-card-top">' +
      '<div class="ia-card-avatar" style="background:' + a.avatarGrad + '">' + a.initials + '</div>' +
      '<div class="ia-card-info">' +
        '<div class="ia-card-client">' + a.clientName + '</div>' +
        '<div class="ia-card-acct"><i class="fas fa-folder"></i> ' + a.accountNum + ' · ' + a.accountType + '</div>' +
      '</div>' +
      '<div class="ia-card-aum">' +
        '<div class="ia-card-aum-val">' + a.aumFmt + '</div>' +
        '<div class="ia-card-ret" style="color:' + retColor + '">' + a.returnYTDFmt + ' YTD</div>' +
      '</div>' +
    '</div>' +
    '<div class="ia-card-badges">' +
      '<span class="ia-status-pill ' + a.statusCls + '"><i class="fas ' + statusIcon + '"></i> ' + a.status + '</span>' +
      driftBadge + rmdBadge + tlhBadge +
    '</div>' +
    allocBar +
    '<div class="ia-card-footer">' +
      '<span class="ia-card-type-chip"><i class="fas fa-briefcase"></i> ' + a.riskProfile + '</span>' +
      '<span class="ia-card-horizon"><i class="fas fa-clock"></i> ' + a.horizon + '</span>' +
    '</div>' +
  '</div>';
}

/* ═══════════════════════════════════════════════════════════════════
   ACCOUNT DETAIL
   ═══════════════════════════════════════════════════════════════════ */
function iaOpenAccount(id) {
  _iaActiveAccount = id;
  _iaActiveTab = 'overview';
  iaRenderAccountQueue();

  var a = iaAccounts.find(function(x) { return x.id === id; });
  if (!a) return;

  var empty = document.getElementById('ia-detail-empty');
  var panel = document.getElementById('ia-detail-panel');
  if (empty) empty.style.display = 'none';
  if (!panel) return;
  panel.style.display = 'block';
  panel.innerHTML = iaBuildDetailHTML(a);
}

function iaBuildDetailHTML(a) {
  var statusColor = {
    'Active':'#059669','Review Due':'#d97706','Funding Pending':'#0891b2'
  }[a.status] || '#64748b';

  var retColor = a.returnYTD > 0 ? '#059669' : a.returnYTD < 0 ? '#dc2626' : '#64748b';

  var tabs = [
    { id:'overview',    icon:'fa-th-large',      label:'Overview'    },
    { id:'portfolio',   icon:'fa-chart-pie',      label:'Portfolio'   },
    { id:'rebalance',   icon:'fa-balance-scale',  label:'Rebalance'   },
    { id:'ai',          icon:'fa-robot',          label:'AI Insights' },
    { id:'timeline',    icon:'fa-stream',         label:'Timeline'    }
  ];

  var tabBtns = tabs.map(function(t) {
    var active = t.id === _iaActiveTab ? ' ia-tab-active' : '';
    return '<button class="ia-tab-btn' + active + '" onclick="iaSwitchTab(\'' + t.id + '\',this)">' +
      '<i class="fas ' + t.icon + '"></i> ' + t.label + '</button>';
  }).join('');

  var metaItems = [
    { label:'Account #', val: a.accountNum },
    { label:'Type', val: a.accountType },
    { label:'Custodian', val: a.custodian },
    { label:'Opened', val: a.openDate },
    { label:'Risk Profile', val: a.riskProfile },
    { label:'Horizon', val: a.horizon },
    { label:'Advisory Fee', val: a.feePct },
    { label:'Benchmark', val: a.benchmark }
  ];

  var metaHTML = metaItems.map(function(m) {
    return '<div class="ia-det-meta-item"><span class="ia-det-meta-lbl">' + m.label + '</span><span class="ia-det-meta-val">' + m.val + '</span></div>';
  }).join('');

  var panelContent = iaRenderTab(a, _iaActiveTab);

  return '<div class="ia-detail-wrap">' +

    // Header
    '<div class="ia-det-header">' +
      '<div class="ia-det-avatar" style="background:' + a.avatarGrad + '">' + a.initials + '</div>' +
      '<div class="ia-det-title-wrap">' +
        '<div class="ia-det-client">' + a.clientName + '</div>' +
        '<div class="ia-det-acct">' + a.accountNum + ' · ' + a.accountType + '</div>' +
        '<div class="ia-det-meta-row">' + metaHTML + '</div>' +
      '</div>' +
      '<div class="ia-det-kpi-strip">' +
        '<div class="ia-det-kpi">' +
          '<div class="ia-det-kpi-val">' + a.aumFmt + '</div>' +
          '<div class="ia-det-kpi-lbl">AUM</div>' +
        '</div>' +
        '<div class="ia-det-kpi">' +
          '<div class="ia-det-kpi-val" style="color:' + retColor + '">' + a.returnYTDFmt + '</div>' +
          '<div class="ia-det-kpi-lbl">Return YTD</div>' +
        '</div>' +
        '<div class="ia-det-kpi">' +
          '<div class="ia-det-kpi-val">' + (a.alpha || '—') + '</div>' +
          '<div class="ia-det-kpi-lbl">Alpha</div>' +
        '</div>' +
        '<div class="ia-det-kpi">' +
          '<div class="ia-det-kpi-val" style="background:' + statusColor + '20;color:' + statusColor + ';padding:2px 8px;border-radius:20px;font-size:11px">' + a.status + '</div>' +
          '<div class="ia-det-kpi-lbl">Status</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    // Funding banner (if pending)
    (a.status === 'Funding Pending' && a.fundingDetails ? iaRenderFundingBanner(a) : '') +

    // RMD banner (if due)
    (a.rmdDue ? '<div class="ia-rmd-banner"><i class="fas fa-exclamation-triangle"></i> <strong>RMD Due:</strong> $' + a.rmdAmount.toLocaleString() + ' must be distributed by ' + a.rmdDeadline + ' — IRS penalty 25% of undistributed amount. <button class="ia-rmd-process-btn" onclick="iaProcessRMD(\'' + a.id + '\')">Process RMD</button></div>' : '') +

    // Tabs
    '<div class="ia-tabs">' + tabBtns + '</div>' +
    '<div class="ia-tab-panels">' +
      '<div class="ia-tab-panel" id="ia-panel-' + _iaActiveTab + '">' + panelContent + '</div>' +
    '</div>' +

  '</div>';
}

function iaRenderFundingBanner(a) {
  var fd = a.fundingDetails;
  return '<div class="ia-funding-banner">' +
    '<div class="ia-fb-icon"><i class="fas fa-hourglass-half"></i></div>' +
    '<div class="ia-fb-info">' +
      '<div class="ia-fb-title">Account Funding In Progress</div>' +
      '<div class="ia-fb-detail">Initial deposit: ' + fd.initialDeposit + ' · ACAT: ' + fd.acatTransfer + ' · Expected: <strong>' + fd.expectedFundingDate + '</strong></div>' +
    '</div>' +
    '<div class="ia-fb-badges">' +
      '<span class="ia-fb-badge ok"><i class="fas fa-check"></i> IMA Signed</span>' +
      '<span class="ia-fb-badge ok"><i class="fas fa-check"></i> Suitability Approved</span>' +
      '<span class="ia-fb-badge pending"><i class="fas fa-clock"></i> Awaiting Funds</span>' +
    '</div>' +
  '</div>';
}

function iaSwitchTab(tab, el) {
  _iaActiveTab = tab;
  document.querySelectorAll('.ia-tab-btn').forEach(function(b) { b.classList.remove('ia-tab-active'); });
  if (el) el.classList.add('ia-tab-active');
  var panelEl = document.querySelector('.ia-tab-panel');
  if (!panelEl) return;
  panelEl.id = 'ia-panel-' + tab;
  var a = iaAccounts.find(function(x) { return x.id === _iaActiveAccount; });
  if (a) panelEl.innerHTML = iaRenderTab(a, tab);
}

function iaRenderTab(a, tab) {
  if (tab === 'overview')  return iaRenderOverviewTab(a);
  if (tab === 'portfolio') return iaRenderPortfolioTab(a);
  if (tab === 'rebalance') return iaRenderRebalanceTab(a);
  if (tab === 'ai')        return iaRenderAITab(a);
  if (tab === 'timeline')  return iaRenderTimelineTab(a);
  return '';
}

/* ── Overview Tab ── */
function iaRenderOverviewTab(a) {
  var tc = a.targetAlloc;
  var cc = a.currentAlloc;

  var allocRows = [
    { label:'US Equity',    target:tc.usEquity,    current:cc.usEquity,    color:'#003087' },
    { label:'Intl Equity',  target:tc.intlEquity,  current:cc.intlEquity,  color:'#0891b2' },
    { label:'Fixed Income', target:tc.fixedIncome, current:cc.fixedIncome, color:'#059669' },
    { label:'Alternatives', target:tc.alternatives,current:cc.alternatives,color:'#7c3aed' },
    { label:'Cash',         target:tc.cash,        current:cc.cash,        color:'#d97706' }
  ].filter(function(r) { return r.target > 0 || r.current > 0; });

  var allocHTML = allocRows.map(function(r) {
    var drift = r.current - r.target;
    var driftStr = drift > 0 ? '<span style="color:#dc2626">+' + drift + '%</span>' : drift < 0 ? '<span style="color:#0891b2">' + drift + '%</span>' : '<span style="color:#059669">0%</span>';
    var driftCls = Math.abs(drift) >= 5 ? ' ia-alloc-row-alert' : '';
    return '<div class="ia-alloc-row' + driftCls + '">' +
      '<div class="ia-alloc-label" style="color:' + r.color + '">' + r.label + '</div>' +
      '<div class="ia-alloc-bars">' +
        '<div class="ia-alloc-bar-wrap">' +
          '<div class="ia-alloc-target-bar" style="width:' + r.target + '%;background:' + r.color + '30;border:1px solid ' + r.color + '60"></div>' +
        '</div>' +
        '<div class="ia-alloc-bar-wrap">' +
          '<div class="ia-alloc-current-bar" style="width:' + r.current + '%;background:' + r.color + '"></div>' +
        '</div>' +
      '</div>' +
      '<div class="ia-alloc-pcts">' +
        '<span class="ia-alloc-target-pct">' + r.target + '%</span>' +
        '<span class="ia-alloc-current-pct">' + r.current + '%</span>' +
        '<span class="ia-alloc-drift">' + driftStr + '</span>' +
      '</div>' +
    '</div>';
  }).join('');

  var quickActions = [
    { icon:'fa-balance-scale', label:'Rebalance', fn:'iaSwitchTab(\'rebalance\',null)', cls:'' },
    { icon:'fa-robot',         label:'AI Review',  fn:'iaSwitchTab(\'ai\',null)',        cls:'' },
    { icon:'fa-file-pdf',      label:'Q Report',   fn:'iaGenerateReport(\'' + a.id + '\')', cls:'' },
    { icon:'fa-envelope',      label:'Send to Client', fn:'iaSendReport(\'' + a.id + '\')', cls:'' }
  ];

  return '<div class="ia-overview-grid">' +

    '<div class="ia-overview-left">' +

      '<div class="ia-ov-section">' +
        '<div class="ia-ov-section-title"><i class="fas fa-chart-pie"></i> Allocation vs Target</div>' +
        '<div class="ia-alloc-legend"><span class="ia-legend-item"><span class="ia-legend-box" style="background:#e2e8f0;border:1px solid #94a3b8"></span>Target</span><span class="ia-legend-item"><span class="ia-legend-box" style="background:#003087"></span>Current</span></div>' +
        '<div class="ia-alloc-table">' + allocHTML + '</div>' +
      '</div>' +

      '<div class="ia-ov-section">' +
        '<div class="ia-ov-section-title"><i class="fas fa-bolt"></i> Quick Actions</div>' +
        '<div class="ia-quick-actions">' +
          quickActions.map(function(q) {
            return '<button class="ia-qa-btn" onclick="' + q.fn + '"><i class="fas ' + q.icon + '"></i><span>' + q.label + '</span></button>';
          }).join('') +
        '</div>' +
      '</div>' +

    '</div>' +

    '<div class="ia-overview-right">' +

      '<div class="ia-ov-section">' +
        '<div class="ia-ov-section-title"><i class="fas fa-tachometer-alt"></i> Performance</div>' +
        '<div class="ia-perf-grid">' +
          '<div class="ia-perf-card"><div class="ia-perf-val green">' + a.returnYTDFmt + '</div><div class="ia-perf-lbl">Return YTD</div></div>' +
          '<div class="ia-perf-card"><div class="ia-perf-val blue">' + a.benchmarkYTD + '%</div><div class="ia-perf-lbl">Benchmark YTD</div></div>' +
          '<div class="ia-perf-card"><div class="ia-perf-val ' + (parseFloat(a.alpha) >= 0 ? 'green' : 'red') + '">' + a.alpha + '</div><div class="ia-perf-lbl">Alpha</div></div>' +
          '<div class="ia-perf-card"><div class="ia-perf-val">' + (a.sharpe ? a.sharpe.toFixed(2) : '—') + '</div><div class="ia-perf-lbl">Sharpe Ratio</div></div>' +
        '</div>' +
      '</div>' +

      (a.driftAlert ? '<div class="ia-ov-section ia-ov-alert">' +
        '<div class="ia-ov-section-title ia-alert-title"><i class="fas fa-exclamation-triangle"></i> Drift Alert — ' + a.driftScore.toFixed(1) + '% from Target</div>' +
        '<div class="ia-alert-body">Rebalancing recommended to restore target allocation. ' + a.rebalanceTrades.length + ' trades identified.</div>' +
        '<button class="ia-alert-btn" onclick="iaSwitchTab(\'rebalance\',null)"><i class="fas fa-balance-scale"></i> View Rebalance Plan</button>' +
      '</div>' : '') +

      (a.rmdDue ? '<div class="ia-ov-section ia-ov-rmd">' +
        '<div class="ia-ov-section-title ia-rmd-title"><i class="fas fa-calendar-exclamation"></i> RMD Required — ' + a.rmdDeadline + '</div>' +
        '<div class="ia-rmd-amount">$' + a.rmdAmount.toLocaleString() + ' <span>must be distributed</span></div>' +
        '<button class="ia-rmd-btn" onclick="iaProcessRMD(\'' + a.id + '\')"><i class="fas fa-paper-plane"></i> Process RMD</button>' +
      '</div>' : '') +

      (a.tlhOpportunity > 0 ? '<div class="ia-ov-section ia-ov-tlh">' +
        '<div class="ia-ov-section-title ia-tlh-title"><i class="fas fa-leaf"></i> Tax-Loss Harvesting Opportunity</div>' +
        '<div class="ia-tlh-amount">$' + a.tlhOpportunity.toLocaleString() + ' <span>estimated tax savings</span></div>' +
        '<div class="ia-tlh-positions">' + a.tlhPositions.map(function(p) { return '<div class="ia-tlh-pos"><i class="fas fa-angle-right"></i>' + p + '</div>'; }).join('') + '</div>' +
        '<button class="ia-tlh-btn" onclick="iaExecuteTLH(\'' + a.id + '\')"><i class="fas fa-leaf"></i> Execute TLH</button>' +
      '</div>' : '') +

    '</div>' +

  '</div>';
}

/* ── Portfolio Tab ── */
function iaRenderPortfolioTab(a) {
  if (!a.holdings.length) {
    return '<div class="ia-empty-holdings"><i class="fas fa-hourglass-half"></i><p>No holdings yet — account is pending funding.</p></div>';
  }

  var statusCls = { 'overweight':'ia-hold-over', 'underweight':'ia-hold-under', 'on-target':'ia-hold-ok' };
  var statusIcon = { 'overweight':'fa-arrow-up', 'underweight':'fa-arrow-down', 'on-target':'fa-check' };

  var holdRows = a.holdings.map(function(h) {
    var sc = statusCls[h.status] || '';
    var si = statusIcon[h.status] || 'fa-circle';
    var barWidth = Math.min(h.pct, 100);
    return '<div class="ia-hold-row ' + sc + '">' +
      '<div class="ia-hold-name">' +
        '<div class="ia-hold-name-main">' + h.name + '</div>' +
        '<div class="ia-hold-type">' + h.type + '</div>' +
      '</div>' +
      '<div class="ia-hold-bar-wrap">' +
        '<div class="ia-hold-bar" style="width:' + barWidth + '%"></div>' +
      '</div>' +
      '<div class="ia-hold-pct">' + h.pct.toFixed(1) + '%</div>' +
      '<div class="ia-hold-val">$' + (h.value/1000).toFixed(0) + 'K</div>' +
      '<div class="ia-hold-ret">' + h.ret + '</div>' +
      '<div class="ia-hold-status"><span class="ia-hold-status-badge ' + sc + '"><i class="fas ' + si + '"></i> ' + h.status.replace('-',' ') + '</span></div>' +
    '</div>';
  }).join('');

  return '<div class="ia-portfolio-tab">' +
    '<div class="ia-hold-header">' +
      '<span class="ia-hold-hdr-name">Holding</span>' +
      '<span class="ia-hold-hdr-bar">Weight</span>' +
      '<span class="ia-hold-hdr-pct">%</span>' +
      '<span class="ia-hold-hdr-val">Value</span>' +
      '<span class="ia-hold-hdr-ret">Return YTD</span>' +
      '<span class="ia-hold-hdr-status">Status</span>' +
    '</div>' +
    holdRows +
    '<div class="ia-hold-total">' +
      '<span>Total Portfolio Value</span>' +
      '<span class="ia-hold-total-val">$' + (a.aum/1000).toFixed(0) + 'K</span>' +
    '</div>' +
  '</div>';
}

/* ── Rebalance Tab ── */
function iaRenderRebalanceTab(a) {
  if (!a.rebalanceTrades.length) {
    return '<div class="ia-rebalance-ok">' +
      '<div class="ia-reb-ok-icon"><i class="fas fa-check-circle"></i></div>' +
      '<div class="ia-reb-ok-title">Portfolio is On Target</div>' +
      '<div class="ia-reb-ok-sub">All asset class allocations are within ±5% of target. No rebalancing needed at this time.</div>' +
      '<div class="ia-reb-ok-meta">Next scheduled review: <strong>' + a.nextReview + '</strong></div>' +
    '</div>';
  }

  var totalSell = a.rebalanceTrades.filter(function(t) { return t.action === 'SELL'; }).reduce(function(sum, t) {
    return sum + parseFloat(t.amount.replace(/[$,]/g,''));
  }, 0);
  var totalBuy = a.rebalanceTrades.filter(function(t) { return t.action === 'BUY'; }).reduce(function(sum, t) {
    return sum + parseFloat(t.amount.replace(/[$,]/g,''));
  }, 0);

  var tradeRows = a.rebalanceTrades.map(function(t) {
    var cls = t.action === 'SELL' ? 'ia-trade-sell' : 'ia-trade-buy';
    var icon = t.action === 'SELL' ? 'fa-arrow-down' : 'fa-arrow-up';
    return '<div class="ia-trade-row ' + cls + '">' +
      '<div class="ia-trade-action"><i class="fas ' + icon + '"></i> ' + t.action + '</div>' +
      '<div class="ia-trade-security">' + t.security + '</div>' +
      '<div class="ia-trade-amount">' + t.amount + '</div>' +
      '<div class="ia-trade-reason"><i class="fas fa-info-circle"></i> ' + t.reason + '</div>' +
    '</div>';
  }).join('');

  return '<div class="ia-rebalance-tab">' +
    '<div class="ia-reb-summary">' +
      '<div class="ia-reb-drift-score">' +
        '<div class="ia-reb-drift-num">' + a.driftScore.toFixed(1) + '%</div>' +
        '<div class="ia-reb-drift-lbl">Portfolio Drift</div>' +
      '</div>' +
      '<div class="ia-reb-summary-stats">' +
        '<div class="ia-reb-stat"><span class="ia-reb-stat-val">' + a.rebalanceTrades.length + '</span><span class="ia-reb-stat-lbl">Trades Required</span></div>' +
        '<div class="ia-reb-stat"><span class="ia-reb-stat-val sell">-$' + (totalSell/1000).toFixed(1) + 'K</span><span class="ia-reb-stat-lbl">Total Sells</span></div>' +
        '<div class="ia-reb-stat"><span class="ia-reb-stat-val buy">+$' + (totalBuy/1000).toFixed(1) + 'K</span><span class="ia-reb-stat-lbl">Total Buys</span></div>' +
      '</div>' +
    '</div>' +

    '<div class="ia-trade-table">' +
      '<div class="ia-trade-header">' +
        '<span>Action</span><span>Security</span><span>Amount</span><span>Reason</span>' +
      '</div>' +
      tradeRows +
    '</div>' +

    '<div class="ia-reb-actions">' +
      '<button class="ia-reb-btn primary" onclick="iaExecuteRebalance(\'' + a.id + '\')"><i class="fas fa-play-circle"></i> Execute All Trades</button>' +
      '<button class="ia-reb-btn ghost"   onclick="iaPreviewTrades(\'' + a.id + '\')"><i class="fas fa-eye"></i> Preview Trades</button>' +
      '<button class="ia-reb-btn ghost"   onclick="iaExportTradeList(\'' + a.id + '\')"><i class="fas fa-file-export"></i> Export Trade List</button>' +
    '</div>' +

    '<div class="ia-reb-tax-note">' +
      '<i class="fas fa-info-circle"></i> <strong>Tax note:</strong> SELL trades in taxable accounts may trigger capital gains. AI has optimized trade order to minimize tax impact. Confirm with client before executing in taxable accounts.' +
    '</div>' +

  '</div>';
}

/* ── AI Insights Tab ── */
function iaRenderAITab(a) {
  var ai = a.aiInsights;
  var actionBtns = ai.actions.map(function(act, i) {
    return '<div class="ia-ai-action-item">' +
      '<span class="ia-ai-action-num">' + (i+1) + '</span>' +
      '<span class="ia-ai-action-text">' + act + '</span>' +
    '</div>';
  }).join('');

  return '<div class="ia-ai-tab">' +
    '<div class="ia-ai-headline">' +
      '<div class="ia-ai-chip"><i class="fas fa-robot"></i> AI Portfolio Intelligence</div>' +
      '<div class="ia-ai-headline-text">' + ai.headline + '</div>' +
    '</div>' +
    '<div class="ia-ai-summary-box">' +
      '<div class="ia-ai-summary-label"><i class="fas fa-brain"></i> Analysis</div>' +
      '<div class="ia-ai-summary-text">' + ai.summary + '</div>' +
    '</div>' +
    '<div class="ia-ai-actions-section">' +
      '<div class="ia-ai-actions-label"><i class="fas fa-tasks"></i> Recommended Actions</div>' +
      '<div class="ia-ai-actions-list">' + actionBtns + '</div>' +
    '</div>' +
    '<div class="ia-ai-tool-row">' +
      '<button class="ia-ai-tool-btn" onclick="iaRunDriftScan()"><i class="fas fa-balance-scale"></i> Run Drift Scan</button>' +
      '<button class="ia-ai-tool-btn" onclick="iaRunTLHScan()"><i class="fas fa-leaf"></i> TLH Scanner</button>' +
      '<button class="ia-ai-tool-btn" onclick="iaOpenRMDCenter()"><i class="fas fa-calendar-check"></i> RMD Center</button>' +
      '<button class="ia-ai-tool-btn" onclick="iaGenerateReport(\'' + a.id + '\')"><i class="fas fa-file-pdf"></i> Generate Report</button>' +
    '</div>' +
  '</div>';
}

/* ── Timeline Tab ── */
function iaRenderTimelineTab(a) {
  var typeIcons = {
    report:'fa-chart-bar', alert:'fa-exclamation-triangle', review:'fa-clipboard-check',
    rmd:'fa-calendar-check', rebalance:'fa-balance-scale', tlh:'fa-leaf',
    contribution:'fa-plus-circle', dividend:'fa-coins', open:'fa-folder-open', funding:'fa-hand-holding-usd'
  };
  var typeColors = {
    report:'#0891b2', alert:'#dc2626', review:'#4f46e5', rmd:'#d97706',
    rebalance:'#059669', tlh:'#059669', contribution:'#7c3aed', dividend:'#d97706',
    open:'#003087', funding:'#0891b2'
  };

  var rows = a.timeline.map(function(t, i) {
    var icon  = typeIcons[t.type]  || 'fa-circle';
    var color = typeColors[t.type] || '#64748b';
    var latest = i === 0 ? ' ia-tl-row-latest' : '';
    return '<div class="ia-tl-row' + latest + '">' +
      '<div class="ia-tl-dot" style="background:' + color + '"><i class="fas ' + icon + '"></i></div>' +
      '<div class="ia-tl-body">' +
        '<div class="ia-tl-date">' + t.date + '</div>' +
        '<div class="ia-tl-event">' + t.event + '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  return '<div class="ia-timeline-tab">' + rows + '</div>';
}

/* ═══════════════════════════════════════════════════════════════════
   FILTER / SEARCH
   ═══════════════════════════════════════════════════════════════════ */
function iaFilterAccounts() {
  var searchEl = document.getElementById('ia-search');
  var typeEl   = document.getElementById('ia-type-filter');
  var statusEl = document.getElementById('ia-status-filter');
  _iaSearchTerm   = searchEl  ? searchEl.value.toLowerCase()  : '';
  _iaFilterType   = typeEl    ? typeEl.value    : '';
  _iaFilterStatus = statusEl  ? statusEl.value  : '';
  iaRenderAccountQueue();
}

/* ═══════════════════════════════════════════════════════════════════
   DRIFT MONITOR PANEL
   ═══════════════════════════════════════════════════════════════════ */
function iaRunDriftScan() {
  var panel = document.getElementById('ia-drift-panel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'none' ? '' : 'none';
  if (panel.style.display !== 'none') {
    var list = document.getElementById('ia-drift-list');
    if (list) list.innerHTML = iaRenderDriftList();
  }
}

function iaCloseDriftPanel() {
  var panel = document.getElementById('ia-drift-panel');
  if (panel) panel.style.display = 'none';
}

function iaRenderDriftList() {
  if (!iaDriftAccounts.length) {
    return '<div class="ia-drift-empty"><i class="fas fa-check-circle"></i> No accounts with significant drift detected.</div>';
  }
  return iaDriftAccounts.map(function(a) {
    var urgency = a.driftScore >= 7 ? 'ia-drift-card-high' : 'ia-drift-card-med';
    return '<div class="ia-drift-card ' + urgency + '" onclick="iaOpenAccount(\'' + a.id + '\')">' +
      '<div class="ia-drift-card-left">' +
        '<div class="ia-drift-card-score">' + a.driftScore.toFixed(1) + '<span>%</span></div>' +
        '<div class="ia-drift-card-lbl">Drift</div>' +
      '</div>' +
      '<div class="ia-drift-card-body">' +
        '<div class="ia-drift-card-client">' + a.clientName + '</div>' +
        '<div class="ia-drift-card-acct">' + a.accountNum + ' · ' + a.accountType + '</div>' +
        '<div class="ia-drift-card-trades">' + a.rebalanceTrades.length + ' trades required · Est. ' + a.aumFmt + ' AUM</div>' +
      '</div>' +
      '<button class="ia-drift-card-btn" onclick="event.stopPropagation();iaOpenAccount(\'' + a.id + '\');setTimeout(function(){iaSwitchTab(\'rebalance\',null);},100)"><i class="fas fa-balance-scale"></i> Rebalance</button>' +
    '</div>';
  }).join('');
}

/* ═══════════════════════════════════════════════════════════════════
   TLH SCANNER PANEL
   ═══════════════════════════════════════════════════════════════════ */
function iaRunTLHScan() {
  var panel = document.getElementById('ia-tlh-panel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'none' ? '' : 'none';
  if (panel.style.display !== 'none') {
    var list = document.getElementById('ia-tlh-list');
    if (list) list.innerHTML = iaRenderTLHList();
  }
}

function iaCloseTLHPanel() {
  var panel = document.getElementById('ia-tlh-panel');
  if (panel) panel.style.display = 'none';
}

function iaRenderTLHList() {
  var totalSavings = iaTLHAccounts.reduce(function(s, a) { return s + a.tlhOpportunity; }, 0);
  if (!iaTLHAccounts.length) {
    return '<div class="ia-tlh-empty"><i class="fas fa-check-circle"></i> No tax-loss harvesting opportunities identified at this time.</div>';
  }
  var header = '<div class="ia-tlh-total-bar"><i class="fas fa-leaf"></i> Total TLH Opportunity: <strong>$' + totalSavings.toLocaleString() + '</strong> estimated tax savings across ' + iaTLHAccounts.length + ' accounts</div>';
  var cards = iaTLHAccounts.map(function(a) {
    var positions = a.tlhPositions.map(function(p) {
      return '<div class="ia-tlh-card-pos"><i class="fas fa-angle-right"></i>' + p + '</div>';
    }).join('');
    return '<div class="ia-tlh-card" onclick="iaOpenAccount(\'' + a.id + '\')">' +
      '<div class="ia-tlh-card-header">' +
        '<div class="ia-tlh-card-client">' + a.clientName + '</div>' +
        '<div class="ia-tlh-card-acct">' + a.accountNum + ' · ' + a.accountType + '</div>' +
      '</div>' +
      '<div class="ia-tlh-card-savings">$' + a.tlhOpportunity.toLocaleString() + ' <span>estimated tax savings</span></div>' +
      positions +
      '<button class="ia-tlh-card-btn" onclick="event.stopPropagation();iaExecuteTLH(\'' + a.id + '\')"><i class="fas fa-leaf"></i> Execute Harvest</button>' +
    '</div>';
  }).join('');
  return header + cards;
}

/* ═══════════════════════════════════════════════════════════════════
   RMD CENTER PANEL
   ═══════════════════════════════════════════════════════════════════ */
function iaOpenRMDCenter() {
  var panel = document.getElementById('ia-rmd-panel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'none' ? '' : 'none';
  if (panel.style.display !== 'none') {
    var list = document.getElementById('ia-rmd-list');
    if (list) list.innerHTML = iaRenderRMDList();
  }
}

function iaCloseRMDPanel() {
  var panel = document.getElementById('ia-rmd-panel');
  if (panel) panel.style.display = 'none';
}

function iaRenderRMDList() {
  if (!iaRMDAccounts.length) {
    return '<div class="ia-rmd-empty"><i class="fas fa-check-circle"></i> No RMDs required for 2026.</div>';
  }
  var totalRMD = iaRMDAccounts.reduce(function(s,a) { return s + a.rmdAmount; }, 0);
  var header = '<div class="ia-rmd-total-bar"><i class="fas fa-calendar-exclamation"></i> Total 2026 RMDs: <strong>$' + totalRMD.toLocaleString() + '</strong> across ' + iaRMDAccounts.length + ' accounts · Deadline: <strong>Dec 31, 2026</strong> · Penalty: 25% of undistributed amount</div>';
  var cards = iaRMDAccounts.map(function(a) {
    var penalty = Math.round(a.rmdAmount * 0.25);
    return '<div class="ia-rmd-card" onclick="iaOpenAccount(\'' + a.id + '\')">' +
      '<div class="ia-rmd-card-header">' +
        '<div class="ia-rmd-card-client">' + a.clientName + '</div>' +
        '<div class="ia-rmd-card-acct">' + a.accountNum + ' · ' + a.accountType + ' · ' + a.aumFmt + ' AUM</div>' +
      '</div>' +
      '<div class="ia-rmd-card-amount">$' + a.rmdAmount.toLocaleString() + ' <span>required distribution</span></div>' +
      '<div class="ia-rmd-card-penalty"><i class="fas fa-exclamation-triangle"></i> IRS penalty if missed: $' + penalty.toLocaleString() + ' (25%)</div>' +
      '<div class="ia-rmd-card-deadline"><i class="fas fa-calendar-times"></i> Deadline: ' + a.rmdDeadline + '</div>' +
      '<button class="ia-rmd-card-btn" onclick="event.stopPropagation();iaProcessRMD(\'' + a.id + '\')"><i class="fas fa-paper-plane"></i> Process Distribution</button>' +
    '</div>';
  }).join('');
  return header + cards;
}

/* ═══════════════════════════════════════════════════════════════════
   NEW ACCOUNT MODAL
   ═══════════════════════════════════════════════════════════════════ */
function iaOpenNewAccount() {
  var overlay = document.getElementById('ia-new-acct-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  var body = document.getElementById('ia-new-acct-body');
  if (body) body.innerHTML = iaRenderNewAccountForm();
}

function iaCloseNewAccount() {
  var overlay = document.getElementById('ia-new-acct-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function iaRenderNewAccountForm() {
  return '<div class="ia-naf-form">' +

    '<div class="ia-naf-step-bar">' +
      '<div class="ia-naf-step ia-naf-step-active"><span>1</span> Account Type</div>' +
      '<div class="ia-naf-step"><span>2</span> Client Profile</div>' +
      '<div class="ia-naf-step"><span>3</span> Investment Profile</div>' +
      '<div class="ia-naf-step"><span>4</span> IMA & Suitability</div>' +
      '<div class="ia-naf-step"><span>5</span> Funding</div>' +
    '</div>' +

    '<div class="ia-naf-section">' +
      '<div class="ia-naf-section-title"><i class="fas fa-folder-open"></i> Step 1 — Select Account Type</div>' +
      '<div class="ia-naf-type-grid">' +
        ['Advisory (UMA)','Advisory (SMA)','ETF Portfolio','Mutual Fund Portfolio','IRA (Traditional)','IRA (Roth)','IRA (SEP)','529 College Savings','Joint Brokerage','Individual Brokerage'].map(function(t) {
          return '<div class="ia-naf-type-card" onclick="iaSelectAccountType(this,\'' + t + '\')">' + t + '</div>';
        }).join('') +
      '</div>' +
    '</div>' +

    '<div class="ia-naf-section">' +
      '<div class="ia-naf-section-title"><i class="fas fa-user"></i> Step 2 — Select Existing Client</div>' +
      '<div class="ia-naf-form-grid">' +
        '<div class="ia-naf-field ia-naf-full"><label>Client</label>' +
          '<select class="ia-naf-input">' +
            '<option>James Whitfield (ID-1)</option>' +
            '<option>Patricia Nguyen (ID-2)</option>' +
            '<option>Robert Chen (ID-3)</option>' +
            '<option>Sandra Williams (ID-4)</option>' +
            '<option>David Thompson (ID-5)</option>' +
            '<option>Maria Gonzalez (ID-6)</option>' +
            '<option>Alex Rivera (ID-9)</option>' +
            '<option>Linda Morrison (ID-8)</option>' +
          '</select>' +
        '</div>' +
        '<div class="ia-naf-field"><label>Account Title</label><input class="ia-naf-input" placeholder="e.g. James Whitfield IRA"/></div>' +
        '<div class="ia-naf-field"><label>Custodian</label><select class="ia-naf-input"><option>NYLIM / Pershing</option><option>NYLIM / MainStay</option><option>NY 529 Direct Plan</option></select></div>' +
      '</div>' +
    '</div>' +

    '<div class="ia-naf-section">' +
      '<div class="ia-naf-section-title"><i class="fas fa-chart-pie"></i> Step 3 — Investment Profile</div>' +
      '<div class="ia-naf-form-grid">' +
        '<div class="ia-naf-field"><label>Risk Tolerance</label><select class="ia-naf-input"><option>Conservative</option><option>Conservative Growth</option><option selected>Moderate Growth</option><option>Growth</option><option>Aggressive Growth</option></select></div>' +
        '<div class="ia-naf-field"><label>Time Horizon</label><select class="ia-naf-input"><option>Short (&lt;3yr)</option><option>Medium (3–7yr)</option><option selected>Long (7–20yr)</option><option>Very Long (20yr+)</option></select></div>' +
        '<div class="ia-naf-field"><label>Primary Goal</label><select class="ia-naf-input"><option>Capital Preservation</option><option>Income</option><option selected>Growth</option><option>Aggressive Growth</option><option>College Funding</option><option>Retirement Income</option></select></div>' +
        '<div class="ia-naf-field"><label>Annual Income</label><input class="ia-naf-input" placeholder="$150,000"/></div>' +
        '<div class="ia-naf-field"><label>Liquid Net Worth</label><input class="ia-naf-input" placeholder="$500,000"/></div>' +
        '<div class="ia-naf-field"><label>Tax Bracket</label><select class="ia-naf-input"><option>22%</option><option>24%</option><option selected>32%</option><option>35%</option><option>37%</option></select></div>' +
      '</div>' +
    '</div>' +

    '<div class="ia-naf-section">' +
      '<div class="ia-naf-section-title"><i class="fas fa-handshake"></i> Step 4 — IMA & Suitability</div>' +
      '<div class="ia-naf-checklist">' +
        ['Investment Management Agreement (IMA) reviewed with client','Regulation BI Best Interest disclosure provided','Suitability questionnaire completed and signed','Form CRS (Client Relationship Summary) delivered','Advisory fee schedule disclosed (1.00% of AUM)','Discretionary trading authority granted by client','Beneficiary designation completed (IRA accounts)'].map(function(item) {
          return '<label class="ia-naf-check-row"><input type="checkbox"/> ' + item + '</label>';
        }).join('') +
      '</div>' +
    '</div>' +

    '<div class="ia-naf-section">' +
      '<div class="ia-naf-section-title"><i class="fas fa-money-bill-wave"></i> Step 5 — Funding Instructions</div>' +
      '<div class="ia-naf-form-grid">' +
        '<div class="ia-naf-field"><label>Initial Deposit Amount</label><input class="ia-naf-input" placeholder="$50,000"/></div>' +
        '<div class="ia-naf-field"><label>Funding Method</label><select class="ia-naf-input"><option>ACH Bank Transfer</option><option>Wire Transfer</option><option>ACAT Transfer (from another custodian)</option><option>Check</option></select></div>' +
        '<div class="ia-naf-field"><label>Bank / Custodian Name</label><input class="ia-naf-input" placeholder="e.g. Schwab, Fidelity, Chase"/></div>' +
        '<div class="ia-naf-field"><label>Expected Funding Date</label><input class="ia-naf-input" type="date"/></div>' +
      '</div>' +
    '</div>' +

    '<div class="ia-naf-actions">' +
      '<button class="ia-naf-btn ghost" onclick="iaCloseNewAccount()"><i class="fas fa-times"></i> Cancel</button>' +
      '<button class="ia-naf-btn primary" onclick="iaSubmitNewAccount()"><i class="fas fa-check-circle"></i> Open Account</button>' +
    '</div>' +

  '</div>';
}

function iaSelectAccountType(el, type) {
  document.querySelectorAll('.ia-naf-type-card').forEach(function(c) { c.classList.remove('ia-naf-type-selected'); });
  el.classList.add('ia-naf-type-selected');
}

function iaSubmitNewAccount() {
  iaCloseNewAccount();
  iaToast('<i class="fas fa-check-circle"></i> New account opened successfully — pending suitability approval and funding', 4000);
}

/* ═══════════════════════════════════════════════════════════════════
   AI PORTFOLIO REVIEW MODAL
   ═══════════════════════════════════════════════════════════════════ */
function iaOpenPortfolioReview() {
  var overlay = document.getElementById('ia-review-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  var body = document.getElementById('ia-review-body');
  if (body) body.innerHTML = iaRenderPortfolioReview();
}

function iaClosePortfolioReview() {
  var overlay = document.getElementById('ia-review-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function iaRenderPortfolioReview() {
  var totalAUM    = iaAccounts.reduce(function(s,a) { return s + a.aum; }, 0);
  var driftCount  = iaDriftAccounts.length;
  var tlhTotal    = iaTLHAccounts.reduce(function(s,a) { return s + a.tlhOpportunity; }, 0);
  var rmdTotal    = iaRMDAccounts.reduce(function(s,a) { return s + a.rmdAmount; }, 0);
  var reviewDue   = iaAccounts.filter(function(a) { return a.reviewDue; }).length;
  var fundingPend = iaAccounts.filter(function(a) { return a.status === 'Funding Pending'; }).length;

  var clientSummary = [
    { name:'Linda Morrison', accts:3, aum:554000, ret:'+9.0%',  flag:'RMD + drift' },
    { name:'Robert Chen',    accts:2, aum:415000, ret:'+9.6%',  flag:'Drift alert' },
    { name:'Sandra Williams',accts:1, aum:312000, ret:'+6.8%',  flag:'RMD + review overdue' },
    { name:'James Whitfield',accts:1, aum:145000, ret:'+7.9%',  flag:'Review + RMD overdue' },
    { name:'Maria Gonzalez', accts:2, aum:148000, ret:'+8.4%',  flag:'On track' },
    { name:'Patricia Nguyen',accts:1, aum:68000,  ret:'+7.4%',  flag:'Drift alert' },
    { name:'David Thompson', accts:1, aum:42000,  ret:'+3.1%',  flag:'New account' },
    { name:'Alex Rivera',    accts:1, aum:0,      ret:'—',       flag:'Funding pending' }
  ];

  var clientRows = clientSummary.map(function(c) {
    var flagCls = c.flag.includes('RMD') || c.flag.includes('overdue') || c.flag.includes('Drift') ? 'ia-pr-flag-warn' : c.flag.includes('pending') || c.flag.includes('New') ? 'ia-pr-flag-info' : 'ia-pr-flag-ok';
    return '<div class="ia-pr-client-row">' +
      '<div class="ia-pr-client-name">' + c.name + '</div>' +
      '<div class="ia-pr-client-accts">' + c.accts + ' account' + (c.accts > 1 ? 's' : '') + '</div>' +
      '<div class="ia-pr-client-aum">$' + (c.aum/1000).toFixed(0) + 'K</div>' +
      '<div class="ia-pr-client-ret">' + c.ret + '</div>' +
      '<div class="ia-pr-client-flag ' + flagCls + '">' + c.flag + '</div>' +
    '</div>';
  }).join('');

  return '<div class="ia-pr-wrap">' +

    '<div class="ia-pr-kpi-bar">' +
      '<div class="ia-pr-kpi"><div class="ia-pr-kpi-val">$' + (totalAUM/1000000).toFixed(2) + 'M</div><div class="ia-pr-kpi-lbl">Total AUM</div></div>' +
      '<div class="ia-pr-kpi warn"><div class="ia-pr-kpi-val">' + driftCount + '</div><div class="ia-pr-kpi-lbl">Drift Alerts</div></div>' +
      '<div class="ia-pr-kpi green"><div class="ia-pr-kpi-val">$' + (tlhTotal/1000).toFixed(1) + 'K</div><div class="ia-pr-kpi-lbl">TLH Opportunity</div></div>' +
      '<div class="ia-pr-kpi warn"><div class="ia-pr-kpi-val">$' + (rmdTotal/1000).toFixed(0) + 'K</div><div class="ia-pr-kpi-lbl">RMDs Due 2026</div></div>' +
      '<div class="ia-pr-kpi warn"><div class="ia-pr-kpi-val">' + reviewDue + '</div><div class="ia-pr-kpi-lbl">Reviews Overdue</div></div>' +
      '<div class="ia-pr-kpi blue"><div class="ia-pr-kpi-val">' + fundingPend + '</div><div class="ia-pr-kpi-lbl">Funding Pending</div></div>' +
    '</div>' +

    '<div class="ia-pr-section-title"><i class="fas fa-list"></i> Client Portfolio Summary</div>' +
    '<div class="ia-pr-client-header">' +
      '<span>Client</span><span>Accounts</span><span>AUM</span><span>Return YTD</span><span>Action Required</span>' +
    '</div>' +
    clientRows +

    '<div class="ia-pr-section-title" style="margin-top:20px"><i class="fas fa-robot"></i> AI Priority Action List</div>' +
    '<div class="ia-pr-actions">' +
      [
        { urgency:'urgent', text:'Process Linda Morrison RMD ($14,200) — IRS deadline Dec 31, 2026' },
        { urgency:'urgent', text:'Process Sandra Williams RMD ($11,400) — review overdue 7 months' },
        { urgency:'urgent', text:'Execute rebalance: Robert Chen SMA-300201 (drift 6.8%, 4 trades)' },
        { urgency:'high',   text:'Execute rebalance: Linda Morrison UMA-880201 (drift 7.4%, 3 trades)' },
        { urgency:'high',   text:'James Whitfield IRA review overdue — schedule Apr 15 combined meeting' },
        { urgency:'med',    text:'Harvest $4,200 TLH in Robert Chen SMA before Q2 close' },
        { urgency:'med',    text:'Harvest $3,200 TLH in Linda Morrison UMA before year-end' },
        { urgency:'low',    text:'Monitor Alex Rivera funding — ACH + ACAT expected Apr 18' },
        { urgency:'low',    text:'Patricia Nguyen ETF drift 5.1% — minor rebalance recommended' }
      ].map(function(item) {
        return '<div class="ia-pr-action-item ia-pr-' + item.urgency + '">' +
          '<span class="ia-pr-urgency-dot ' + item.urgency + '"></span>' +
          '<span>' + item.text + '</span>' +
        '</div>';
      }).join('') +
    '</div>' +

    '<div class="ia-pr-modal-actions">' +
      '<button class="ia-pr-btn primary" onclick="iaExportReview()"><i class="fas fa-file-pdf"></i> Export Full Report</button>' +
      '<button class="ia-pr-btn ghost"   onclick="iaRunDriftScan();iaClosePortfolioReview()"><i class="fas fa-balance-scale"></i> Run Drift Scan</button>' +
      '<button class="ia-pr-btn ghost"   onclick="iaClosePortfolioReview()"><i class="fas fa-times"></i> Close</button>' +
    '</div>' +

  '</div>';
}

/* ═══════════════════════════════════════════════════════════════════
   ACTION HANDLERS
   ═══════════════════════════════════════════════════════════════════ */
function iaExecuteRebalance(id) {
  var a = iaAccounts.find(function(x) { return x.id === id; });
  if (!a) return;
  iaToast('<i class="fas fa-play-circle"></i> Executing ' + a.rebalanceTrades.length + ' rebalancing trades for ' + a.accountNum + ' — confirmation will be sent to client', 4000);
  setTimeout(function() { iaToast('<i class="fas fa-check-circle"></i> Rebalance complete — ' + a.accountNum + ' restored to target allocation', 3500); }, 2500);
}

function iaPreviewTrades(id) {
  var a = iaAccounts.find(function(x) { return x.id === id; });
  if (!a) return;
  iaToast('<i class="fas fa-eye"></i> Trade preview for ' + a.accountNum + ': ' + a.rebalanceTrades.length + ' trades, est. completion 1 business day', 4000);
}

function iaExportTradeList(id) {
  iaToast('<i class="fas fa-file-export"></i> Trade list exported to PDF — ready for compliance review', 2500);
}

function iaProcessRMD(id) {
  var a = iaAccounts.find(function(x) { return x.id === id; });
  if (!a || !a.rmdDue) return;
  iaToast('<i class="fas fa-paper-plane"></i> RMD of $' + a.rmdAmount.toLocaleString() + ' initiated for ' + a.clientName + ' — distribution to linked bank account within 3 business days', 4500);
}

function iaExecuteTLH(id) {
  var a = iaAccounts.find(function(x) { return x.id === id; });
  if (!a) return;
  iaToast('<i class="fas fa-leaf"></i> Tax-loss harvest initiated for ' + a.accountNum + ' — realizing $' + a.tlhOpportunity.toLocaleString() + ' in losses. Wash-sale rules applied automatically.', 4500);
}

function iaGenerateReport(id) {
  var a = iaAccounts.find(function(x) { return x.id === id; });
  if (!a) return;
  iaToast('<i class="fas fa-file-pdf"></i> Generating Q1 2026 Performance Report for ' + a.clientName + ' — ' + a.accountNum, 3000);
  setTimeout(function() { iaToast('<i class="fas fa-check-circle"></i> Report ready — PDF generated. Click to download or email to client.', 3500); }, 2000);
}

function iaSendReport(id) {
  var a = iaAccounts.find(function(x) { return x.id === id; });
  if (!a) return;
  iaToast('<i class="fas fa-envelope"></i> Q1 report emailed to ' + a.clientName + ' — delivery confirmation will appear in Activity Log', 3500);
}

function iaExportReview() {
  iaToast('<i class="fas fa-file-pdf"></i> Full portfolio review exported — PDF ready for advisor filing', 3000);
}

/* ═══════════════════════════════════════════════════════════════════
   navigateTo PATCH — calls initInvAccountsPage on nav
   ═══════════════════════════════════════════════════════════════════ */
(function() {
  var _origNav = typeof navigateTo === 'function' ? navigateTo : null;
  if (!_origNav) return;
  window.navigateTo = function(page) {
    _origNav(page);
    if (page === 'inv-accounts') {
      requestAnimationFrame(function() { setTimeout(initInvAccountsPage, 80); });
    }
  };
})();

/* ═══════════════════════════════════════════════════════════════════
   TOAST HELPER
   ═══════════════════════════════════════════════════════════════════ */
function iaToast(html, duration) {
  duration = duration || 3000;
  var existing = document.getElementById('ia-toast');
  if (existing) existing.remove();
  var t = document.createElement('div');
  t.id = 'ia-toast';
  t.className = 'ia-toast';
  t.innerHTML = html;
  document.body.appendChild(t);
  requestAnimationFrame(function() { t.classList.add('ia-toast-show'); });
  setTimeout(function() {
    t.classList.remove('ia-toast-show');
    setTimeout(function() { if (t.parentNode) t.parentNode.removeChild(t); }, 350);
  }, duration);
}

console.log('Investment Accounts module loaded — ' + iaAccounts.length + ' accounts across 8 clients, $' + (iaAccounts.reduce(function(s,a){return s+a.aum;},0)/1000000).toFixed(2) + 'M AUM, ' + iaDriftAccounts.length + ' drift alerts, ' + iaRMDAccounts.length + ' RMDs due, ' + iaTLHAccounts.length + ' TLH opportunities');
