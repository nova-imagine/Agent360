/* ============================================================
   INV Track Step 5 — Annual Review Tab (Investment Accounts / inv-accounts)
   Monkey-patches iaBuildDetailHTML to inject a 6th tab:
     "Annual Review"  (id: 'annual-review')
   Monkey-patches iaRenderTab to handle the new tab id.
   Per-account review data keyed by account id.
   Guard: 'INV Step 5 module loaded'
   ============================================================ */
(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════
     1. PER-ACCOUNT ANNUAL REVIEW DATA
     ══════════════════════════════════════════════════════════════ */
  var _arData = {

    /* ── Linda Morrison UMA ── */
    'IA-LM-001': {
      client: 'Linda Morrison', accountNum: 'UMA-880201', accountType: 'Advisory (UMA)',
      reviewCycle: 'Annual (+ Quarterly check-ins)',
      lastReview: 'Jan 15, 2026', nextReview: 'Apr 15, 2026', reviewStatus: 'overdue',
      reviewStatusLabel: 'Overdue — 3 months',
      advisor: 'Sridhar R.', coordinator: 'NYL Branch Office',
      meetingType: 'In-Person', meetingDuration: '90 min',
      meetingScheduled: 'Apr 15, 2026 · 1:00 PM · 285 Lexington Ave',

      /* KPI deltas since last review */
      kpis: [
        { label: 'AUM Growth',       val: '+$24K',   sub: '$256K → $280K',   color: '#059669', icon: 'fa-arrow-up' },
        { label: 'Return YTD',       val: '+9.2%',   sub: '+1.2% vs benchmark', color: '#059669', icon: 'fa-chart-line' },
        { label: 'Drift Score',      val: '7.4',     sub: 'Rebalance needed', color: '#dc2626', icon: 'fa-balance-scale' },
        { label: 'RMD Due',          val: '$14,200', sub: 'Dec 31, 2026',    color: '#ea580c', icon: 'fa-calendar-exclamation' },
        { label: 'Advisory Fee',     val: '$2,800',  sub: '1.00% of AUM',    color: '#003087', icon: 'fa-hand-holding-usd' },
        { label: 'TLH Opportunity',  val: '$3,200',  sub: 'INTL + Bond sleeve', color: '#7c3aed', icon: 'fa-leaf' }
      ],

      /* Agenda items */
      agenda: [
        { done: true,  item: 'Performance review — Q1 2026 report reviewed (+9.2% YTD)' },
        { done: true,  item: 'IPS reaffirmation — risk tolerance Moderate Growth confirmed' },
        { done: false, item: 'Portfolio drift discussion — US Equity +7% over target, rebalance needed' },
        { done: false, item: 'RMD planning — $14,200 required distribution by Dec 31, 2026' },
        { done: false, item: 'Tax-loss harvesting — $3,200 opportunity in INTL + Bond sleeve' },
        { done: false, item: 'UMA expansion — Fidelity $280K consolidation opportunity' },
        { done: false, item: 'Estate + insurance coordination — beneficiary trust review' },
        { done: false, item: 'Next review scheduling — Q3 2026 (Jul 15)' }
      ],

      /* Life changes checklist */
      lifeChanges: [
        { question: 'Income or employment change?',         answer: 'No change — Hospital Administrator', flagged: false },
        { question: 'Marital or family status change?',     answer: 'No change — divorced, 2 adult children', flagged: false },
        { question: 'Major purchase or liability?',         answer: 'No — home fully paid off', flagged: false },
        { question: 'Health or insurance need change?',     answer: 'LTC claim active — monitoring', flagged: true  },
        { question: 'Estate plan updated?',                 answer: 'Trust last reviewed 2023 — needs update', flagged: true  },
        { question: 'Beneficiary changes needed?',          answer: 'Trust beneficiary — confirm alignment', flagged: true  },
        { question: 'Risk tolerance change?',               answer: 'No — Moderate Growth reaffirmed', flagged: false },
        { question: 'New financial goals?',                 answer: 'Retirement 2035 on track', flagged: false }
      ],

      /* IPS update */
      ipsUpdate: {
        currentVersion: 'v3.2 — Jan 15, 2026',
        changeNeeded: true,
        proposedChanges: [
          'Increase alternatives sleeve from 10% to 12% (real assets hedge)',
          'Extend bond duration slightly — rising rate environment fading',
          'Add RMD distribution schedule as appendix to IPS'
        ],
        complianceStatus: 'Pending review'
      },

      /* Action items */
      actions: [
        { priority: 'urgent', label: 'Execute rebalance — 3 trades ($19.6K sell / $19.6K buy)',       owner: 'Agent',      due: 'Apr 16, 2026', done: false },
        { priority: 'urgent', label: 'Schedule $14,200 RMD distribution — Dec 31 deadline',           owner: 'Client',     due: 'Q4 2026',      done: false },
        { priority: 'high',   label: 'Harvest $3,200 TLH in INTL + Bond sleeves',                    owner: 'Agent',      due: 'Apr 30, 2026', done: false },
        { priority: 'high',   label: 'Update IPS v3.3 — alternatives + RMD appendix',                owner: 'Agent',      due: 'Apr 30, 2026', done: false },
        { priority: 'high',   label: 'Estate attorney meeting — trust beneficiary realignment',        owner: 'Client',     due: 'May 2026',     done: false },
        { priority: 'medium', label: 'Present UMA expansion — Fidelity $280K consolidation proposal', owner: 'Agent',      due: 'Apr 15, 2026', done: false },
        { priority: 'medium', label: 'LTC claim coordination — review benefit adequacy',              owner: 'Agent',      due: 'May 2026',     done: false },
        { priority: 'low',    label: 'Schedule Q3 review — Jul 15, 2026',                            owner: 'Coordinator', due: 'Apr 20, 2026', done: false }
      ],

      /* Performance attribution */
      perfAttribution: [
        { source: 'US Equity (MainStay Epoch)',  contribution: '+5.4%', vs: 'Target +4.8%', status: 'outperform' },
        { source: 'Intl Equity (Candriam)',      contribution: '+1.0%', vs: 'Target +1.6%', status: 'underperform' },
        { source: 'Fixed Income (MacKay Bond)',  contribution: '+0.8%', vs: 'Target +0.9%', status: 'inline' },
        { source: 'Alternatives (REIT)',         contribution: '+0.7%', vs: 'Target +0.7%', status: 'inline' },
        { source: 'Cash / MMF',                 contribution: '+0.3%', vs: 'Target +0.3%', status: 'inline' }
      ],

      aiNarrative: 'Linda\'s UMA is performing exceptionally well at +9.2% YTD vs the 8.0% S&P Blend benchmark — a meaningful +1.2% alpha. The main concern is the 7.4% drift score driven by US Equity outperformance, which has shifted the portfolio away from its Moderate Growth target. Three priority items require attention at the Apr 15 review: (1) rebalance to restore allocation, (2) RMD planning for the Dec 31 deadline, and (3) trust estate alignment given the active LTC claim. The Fidelity consolidation opportunity ($280K AUM) is the top revenue event — priority close at the review meeting.'
    },

    /* ── Linda Morrison Mutual Fund ── */
    'IA-LM-002': {
      client: 'Linda Morrison', accountNum: 'MF-880202', accountType: 'Mutual Fund Portfolio',
      reviewCycle: 'Semi-Annual',
      lastReview: 'Mar 1, 2026', nextReview: 'Jun 1, 2026', reviewStatus: 'upcoming',
      reviewStatusLabel: 'Upcoming — Jun 1',
      advisor: 'Sridhar R.', coordinator: 'NYL Branch Office',
      meetingType: 'Video Call', meetingDuration: '45 min',
      meetingScheduled: 'Jun 1, 2026 · 10:00 AM · Zoom',
      kpis: [
        { label: 'AUM',         val: '$180K',  sub: 'Stable since last review', color: '#003087', icon: 'fa-coins'       },
        { label: 'Return YTD',  val: '+9.4%',  sub: '+1.6% vs benchmark',       color: '#059669', icon: 'fa-chart-line'  },
        { label: 'Drift Score', val: '2.1',    sub: 'Well-balanced',            color: '#059669', icon: 'fa-balance-scale'},
        { label: 'TLH',        val: '$1,800', sub: 'Bond fund opportunity',    color: '#7c3aed', icon: 'fa-leaf'        },
        { label: 'Fee',        val: '$1,440', sub: '0.80% of AUM',            color: '#003087', icon: 'fa-hand-holding-usd'},
        { label: 'Next Due',   val: 'Jun 1',  sub: '7 weeks away',            color: '#64748b', icon: 'fa-calendar'    }
      ],
      agenda: [
        { done: true,  item: 'Q1 performance recap — +9.4% YTD, benchmark +7.8%' },
        { done: true,  item: 'Allocation confirmation — portfolio well-balanced, no rebalance needed' },
        { done: false, item: 'TLH opportunity — $1,800 in MainStay Bond Fund before year-end' },
        { done: false, item: 'Dividend reinvestment confirmation — $4,200 last quarter' },
        { done: false, item: 'Coordinate with UMA review — combined account consolidation discussion' }
      ],
      lifeChanges: [
        { question: 'Income or employment change?',     answer: 'No change',                         flagged: false },
        { question: 'Marital or family status change?', answer: 'No change',                         flagged: false },
        { question: 'Major purchase or liability?',     answer: 'No new liabilities',                flagged: false },
        { question: 'Health or insurance need change?', answer: 'LTC claim ongoing — see UMA notes', flagged: true  },
        { question: 'Estate plan updated?',             answer: 'Pending — coordinating with UMA',   flagged: true  },
        { question: 'Risk tolerance change?',           answer: 'Moderate — confirmed',              flagged: false }
      ],
      ipsUpdate: {
        currentVersion: 'v2.1 — Mar 1, 2026',
        changeNeeded: false,
        proposedChanges: [],
        complianceStatus: 'Current — no update needed'
      },
      actions: [
        { priority: 'high',   label: 'Execute $1,800 TLH in MainStay Bond Fund',         owner: 'Agent',       due: 'Nov 2026',   done: false },
        { priority: 'medium', label: 'Coordinate consolidation discussion with UMA review', owner: 'Agent',       due: 'Jun 1, 2026', done: false },
        { priority: 'low',    label: 'Confirm dividend reinvestment standing instruction', owner: 'Coordinator', due: 'Jun 1, 2026', done: false }
      ],
      perfAttribution: [
        { source: 'US Equity (MainStay Epoch)',  contribution: '+5.3%', vs: 'Target +4.9%', status: 'outperform'  },
        { source: 'Intl Equity (Candriam)',      contribution: '+0.9%', vs: 'Target +1.1%', status: 'underperform'},
        { source: 'Fixed Income (MacKay Bond)',  contribution: '+1.3%', vs: 'Target +1.2%', status: 'inline'      },
        { source: 'Cash / MMF',                 contribution: '+0.3%', vs: 'Target +0.3%', status: 'inline'      }
      ],
      aiNarrative: 'MF-880202 is a strong performer with +1.6% alpha — the highest alpha per dollar in Linda\'s portfolio. No rebalance is needed. The only action item before year-end is the $1,800 TLH opportunity in the bond sleeve. At the Jun 1 review, consider presenting a portfolio consolidation roadmap combining MF-880202 with the UMA to reduce administrative fragmentation and potentially negotiate a lower blended fee rate.'
    },

    /* ── Linda Morrison 529 ── */
    'IA-LM-003': {
      client: 'Linda Morrison', accountNum: '529-880203', accountType: '529 College Savings',
      reviewCycle: 'Annual',
      lastReview: 'Feb 15, 2026', nextReview: 'Aug 15, 2026', reviewStatus: 'scheduled',
      reviewStatusLabel: 'Scheduled — Aug 15',
      advisor: 'Sridhar R.', coordinator: 'NYL Branch Office',
      meetingType: 'Phone', meetingDuration: '30 min',
      meetingScheduled: 'Aug 15, 2026 · 9:00 AM · Phone',
      kpis: [
        { label: 'Balance',         val: '$94K',   sub: 'Est. $104K at enrollment 2030', color: '#003087', icon: 'fa-graduation-cap' },
        { label: 'Return YTD',      val: '+7.8%',  sub: '+0.7% vs age-based benchmark',  color: '#059669', icon: 'fa-chart-line'     },
        { label: 'Annual Contrib',  val: '$9,400', sub: 'NY tax deduction eligible',     color: '#059669', icon: 'fa-piggy-bank'     },
        { label: 'Proj Gap',        val: '$18K',   sub: 'vs 4-yr private university',    color: '#ea580c', icon: 'fa-exclamation-triangle'},
        { label: 'Fee',             val: '0.50%',  sub: '$470/yr',                       color: '#64748b', icon: 'fa-hand-holding-usd'},
        { label: 'Beneficiary Age', val: '14',     sub: 'Emily Morrison — 4 yrs to 18',  color: '#7c3aed', icon: 'fa-user-graduate'  }
      ],
      agenda: [
        { done: true,  item: 'Annual balance review — $94K balance confirmed, on glide path' },
        { done: true,  item: 'Age-based allocation review — 50/10/35/5 appropriate for age 14' },
        { done: false, item: 'Contribution increase discussion — $9,400 → $11,400 to close $18K gap' },
        { done: false, item: 'NY state tax deduction confirmation — $10,000 max' },
        { done: false, item: 'Next glide path shift — age 15 moves to 40% equity' },
        { done: false, item: 'College funding strategy — 529 + other savings coordination' }
      ],
      lifeChanges: [
        { question: 'Beneficiary life change?',          answer: 'Emily age 14 — entering high school', flagged: false },
        { question: 'College plan change?',              answer: 'Targeting 4-yr private — gap of $18K', flagged: true  },
        { question: 'NY tax situation change?',          answer: 'No change — deduction confirmed',     flagged: false },
        { question: 'Other savings coordination?',       answer: 'Custodial UTMA under discussion',     flagged: true  }
      ],
      ipsUpdate: {
        currentVersion: 'v1.0 — Sep 2021',
        changeNeeded: true,
        proposedChanges: ['Update college cost projection to 2030 estimate ($112K)','Document age-based glide path schedule through maturity'],
        complianceStatus: 'Update recommended'
      },
      actions: [
        { priority: 'high',   label: 'Increase annual contribution $9,400 → $11,400',      owner: 'Client',  due: 'Aug 2026',    done: false },
        { priority: 'high',   label: 'Update 529 IPS — college cost + glide path schedule', owner: 'Agent',   due: 'Aug 15, 2026', done: false },
        { priority: 'medium', label: 'Discuss UTMA coordination for minor beneficiary',     owner: 'Agent',   due: 'Aug 15, 2026', done: false },
        { priority: 'low',    label: 'Confirm NY tax deduction eligibility for 2026',       owner: 'Client',  due: 'Dec 2026',    done: false }
      ],
      perfAttribution: [
        { source: 'US Equity Index (NY 529)',  contribution: '+4.2%', vs: 'Target +3.9%', status: 'outperform' },
        { source: 'Intl Equity Index (NY 529)',contribution: '+0.9%', vs: 'Target +0.8%', status: 'inline'     },
        { source: 'Bond Index (NY 529)',       contribution: '+1.7%', vs: 'Target +1.6%', status: 'inline'     },
        { source: 'Cash / Stable Value',       contribution: '+0.2%', vs: 'Target +0.2%', status: 'inline'     }
      ],
      aiNarrative: '529-880203 is on its age-based glide path and performing well (+0.7% alpha). The $18K projected gap vs a 4-year private university is the primary concern — increasing the annual contribution by $2,000 closes this gap entirely. Emily is 4 years from college enrollment; the next glide path shift at age 15 will reduce equity exposure from 50% to 40%, which is appropriate. Recommend coordinating the UTMA discussion with the estate beneficiary review for the UMA account.'
    },

    /* ── Robert Chen SMA ── */
    'IA-RC-001': {
      client: 'Robert Chen', accountNum: 'SMA-300201', accountType: 'Advisory (SMA)',
      reviewCycle: 'Quarterly',
      lastReview: 'Jan 20, 2026', nextReview: 'Apr 20, 2026', reviewStatus: 'overdue',
      reviewStatusLabel: 'Overdue — Q2 review due',
      advisor: 'Sridhar R.', coordinator: 'NYL Branch Office',
      meetingType: 'In-Person', meetingDuration: '60 min',
      meetingScheduled: 'Apr 20, 2026 · 2:00 PM · 285 Lexington Ave',
      kpis: [
        { label: 'AUM',          val: '$320K',  sub: '+$28K since last review',  color: '#003087', icon: 'fa-coins'         },
        { label: 'Return YTD',   val: '+10.1%', sub: '+0.9% vs S&P 500',        color: '#059669', icon: 'fa-chart-line'    },
        { label: 'Drift Score',  val: '6.8',   sub: 'Rebalance recommended',   color: '#ea580c', icon: 'fa-balance-scale' },
        { label: 'TLH',         val: '$4,200', sub: 'Tech + Intl sleeves',     color: '#7c3aed', icon: 'fa-leaf'          },
        { label: 'Advisory Fee', val: '$3,200', sub: '1.00% of AUM',           color: '#003087', icon: 'fa-hand-holding-usd'},
        { label: 'Alpha',        val: '+0.9%',  sub: 'vs S&P 500 benchmark',   color: '#059669', icon: 'fa-trophy'        }
      ],
      agenda: [
        { done: true,  item: 'Q1 SMA performance report reviewed — +10.1% YTD, +0.9% alpha' },
        { done: true,  item: 'Risk profile reconfirmed — Growth, 20-year horizon unchanged' },
        { done: false, item: 'Rebalance plan — US Equity 67%→60%, 4 trades ($22.4K sell)' },
        { done: false, item: 'TLH execution — $4,200 in tech and intl sleeves' },
        { done: false, item: 'ETF consolidation discussion — ETF-300202 merge into SMA at $150K threshold' },
        { done: false, item: 'Deferred annuity presentation — income diversification ahead of retirement 2045' },
        { done: false, item: 'Business succession planning — Chen Holdings cross-sell discussion' }
      ],
      lifeChanges: [
        { question: 'Business valuation change?',        answer: 'Chen Holdings est. $4M — growing', flagged: true  },
        { question: 'Income or compensation change?',    answer: 'Business income up ~15% YTD',      flagged: false },
        { question: 'Buy-sell agreement status?',        answer: 'Not in place — urgent gap',        flagged: true  },
        { question: 'Personal insurance review?',        answer: 'WL policy current — buy-sell gap', flagged: true  },
        { question: 'Retirement timeline change?',       answer: 'No change — 2045 target',          flagged: false },
        { question: 'Estate plan update?',               answer: 'No formal estate plan — gap',      flagged: true  }
      ],
      ipsUpdate: {
        currentVersion: 'v2.0 — Jan 20, 2026',
        changeNeeded: true,
        proposedChanges: [
          'Add business succession assets to overall financial picture',
          'Consider increasing alternatives to 10% as AUM grows',
          'Document deferred annuity as complementary income layer'
        ],
        complianceStatus: 'Update at Q2 review'
      },
      actions: [
        { priority: 'urgent', label: 'Execute 4-trade rebalance — $22.4K US Equity → diversification',   owner: 'Agent',   due: 'Apr 21, 2026', done: false },
        { priority: 'urgent', label: 'TLH: harvest $4,200 in tech and intl SMA sleeves',                 owner: 'Agent',   due: 'Apr 30, 2026', done: false },
        { priority: 'high',   label: 'Present deferred annuity illustration — retirement income layer',   owner: 'Agent',   due: 'Apr 20, 2026', done: false },
        { priority: 'high',   label: 'Initiate buy-sell agreement discussion — Chen Holdings',            owner: 'Agent',   due: 'May 2026',     done: false },
        { priority: 'medium', label: 'Update IPS v2.1 — alternatives + business succession context',     owner: 'Agent',   due: 'Apr 30, 2026', done: false },
        { priority: 'medium', label: 'ETF consolidation plan — present roadmap for $150K SMA threshold', owner: 'Agent',   due: 'Apr 20, 2026', done: false },
        { priority: 'low',    label: 'Schedule Q3 review — Jul 20, 2026',                               owner: 'Coordinator', due: 'Apr 25, 2026', done: false }
      ],
      perfAttribution: [
        { source: 'US Large Cap Growth (SMA)',    contribution: '+6.8%', vs: 'Target +5.5%', status: 'outperform'  },
        { source: 'Intl Developed Markets (SMA)', contribution: '+1.3%', vs: 'Target +1.5%', status: 'underperform'},
        { source: 'Inv Grade Bonds (SMA)',        contribution: '+0.2%', vs: 'Target +0.4%', status: 'underperform'},
        { source: 'Alternatives (REIT)',          contribution: '+0.5%', vs: 'Target +0.5%', status: 'inline'      },
        { source: 'Cash / MMF',                  contribution: '+0.1%', vs: 'Target +0.2%', status: 'inline'      }
      ],
      aiNarrative: 'SMA-300201 is Robert\'s flagship account and the highest alpha generator in the book (+0.9% vs S&P 500). The dominant driver is the US Large Cap Growth sleeve (+6.8%), which has now drifted the portfolio 7% above its target US Equity weighting. The Q2 rebalance should be executed immediately — delaying increases risk concentration. Two critical cross-sell opportunities: (1) the deferred annuity income layer for retirement 2045, and (2) the Chen Holdings buy-sell insurance gap, estimated at $2M key-person coverage need. Both should be presented at the Apr 20 review.'
    },

    /* ── Robert Chen ETF ── */
    'IA-RC-002': {
      client: 'Robert Chen', accountNum: 'ETF-300202', accountType: 'ETF Portfolio',
      reviewCycle: 'Semi-Annual',
      lastReview: 'Feb 10, 2026', nextReview: 'May 10, 2026', reviewStatus: 'upcoming',
      reviewStatusLabel: 'Upcoming — May 10',
      advisor: 'Sridhar R.', coordinator: 'NYL Branch Office',
      meetingType: 'Phone', meetingDuration: '30 min',
      meetingScheduled: 'May 10, 2026 · 3:00 PM · Phone',
      kpis: [
        { label: 'AUM',         val: '$95K',  sub: 'Growing toward $150K threshold', color: '#003087', icon: 'fa-coins'      },
        { label: 'Return YTD',  val: '+8.6%', sub: '+0.5% vs Morningstar Growth',    color: '#059669', icon: 'fa-chart-line' },
        { label: 'Drift Score', val: '2.8',   sub: 'Well-balanced',                 color: '#059669', icon: 'fa-balance-scale'},
        { label: 'Expense',     val: '0.04%', sub: 'Ultra low-cost ETFs',           color: '#059669', icon: 'fa-leaf'       },
        { label: 'Fee',         val: '$712',  sub: '0.75% of AUM',                 color: '#003087', icon: 'fa-hand-holding-usd'},
        { label: 'SMA Merge',   val: '$55K gap', sub: 'Until consolidation threshold', color: '#7c3aed', icon: 'fa-object-group'}
      ],
      agenda: [
        { done: true,  item: 'Semi-annual performance review — +8.6% YTD, minimal tracking error' },
        { done: false, item: 'Annual contribution confirmation — $24,000 DCA plan on track' },
        { done: false, item: 'SMA consolidation roadmap — $55K away from $150K merge threshold' },
        { done: false, item: 'Coordinate with SMA Q2 review agenda' }
      ],
      lifeChanges: [
        { question: 'Systematic investment plan change?', answer: '$24,000/yr DCA confirmed', flagged: false },
        { question: 'Risk profile change?',               answer: 'Growth — no change',       flagged: false },
        { question: 'Consolidation timeline?',            answer: '$55K to SMA threshold',    flagged: false }
      ],
      ipsUpdate: {
        currentVersion: 'v1.0 — Mar 2023',
        changeNeeded: false,
        proposedChanges: [],
        complianceStatus: 'Current — no update needed'
      },
      actions: [
        { priority: 'medium', label: 'Confirm $24,000 annual contribution continues',                owner: 'Client', due: 'May 10, 2026', done: false },
        { priority: 'medium', label: 'Prepare SMA consolidation proposal for May meeting',           owner: 'Agent',  due: 'May 10, 2026', done: false },
        { priority: 'low',    label: 'Schedule H2 review — Aug 10, 2026',                          owner: 'Coordinator', due: 'May 15, 2026', done: false }
      ],
      perfAttribution: [
        { source: 'VTI — Vanguard Total Market', contribution: '+5.7%', vs: 'Target +5.4%', status: 'outperform' },
        { source: 'VXUS — Vanguard Intl',        contribution: '+1.3%', vs: 'Target +1.4%', status: 'inline'     },
        { source: 'BND — Vanguard Bond',         contribution: '+0.5%', vs: 'Target +0.5%', status: 'inline'     },
        { source: 'Cash / MMF',                  contribution: '+0.2%', vs: 'Target +0.2%', status: 'inline'     }
      ],
      aiNarrative: 'ETF-300202 is a textbook low-cost core portfolio. With 0.04% average expense ratio and minimal tracking error, this account is outperforming on a cost-adjusted basis. The SMA consolidation is the primary strategic event — at the current DCA rate ($24,000/yr), Robert will cross the $150K threshold in approximately 2.3 years. Consider presenting the consolidation proposal at the May review as a proactive upgrade conversation.'
    },

    /* ── James Whitfield IRA ── */
    'IA-JW-001': {
      client: 'James Whitfield', accountNum: 'IRA-291001', accountType: 'IRA (Traditional)',
      reviewCycle: 'Semi-Annual',
      lastReview: 'Oct 20, 2025', nextReview: 'Apr 15, 2026', reviewStatus: 'overdue',
      reviewStatusLabel: 'Overdue — 6 months',
      advisor: 'Sridhar R.', coordinator: 'NYL Branch Office',
      meetingType: 'In-Person', meetingDuration: '90 min',
      meetingScheduled: 'Apr 15, 2026 · 3:00 PM · 285 Lexington Ave',
      kpis: [
        { label: 'AUM',         val: '$145K',  sub: '+$9K since Oct 2025',    color: '#003087', icon: 'fa-coins'              },
        { label: 'Return YTD',  val: '+7.9%',  sub: '+0.1% vs benchmark',    color: '#059669', icon: 'fa-chart-line'         },
        { label: 'Drift Score', val: '5.3',    sub: 'Rebalance needed',      color: '#dc2626', icon: 'fa-balance-scale'      },
        { label: 'RMD Due',     val: '$7,250', sub: 'Dec 31, 2026 deadline', color: '#ea580c', icon: 'fa-calendar-exclamation'},
        { label: 'Review Gap',  val: '6 mo',   sub: 'Overdue since Oct 2025', color: '#dc2626', icon: 'fa-clock'             },
        { label: 'Fee',         val: '$1,015', sub: '0.70% of AUM',          color: '#003087', icon: 'fa-hand-holding-usd'  }
      ],
      agenda: [
        { done: false, item: '⚡ OVERDUE: Semi-annual IRA review — 6 months since last review' },
        { done: false, item: 'Rebalance — US Equity 55%→50%, 3 trades ($7.25K reallocation)' },
        { done: false, item: 'RMD planning — $7,250 distribution required by Dec 31, 2026' },
        { done: false, item: 'IPS review — Moderate profile, 13-year horizon to retirement 2039' },
        { done: false, item: 'Deferred annuity discussion — income supplement alongside IRA' },
        { done: false, item: 'Whole Life coordination — $500K WL cash value as conservative anchor' },
        { done: false, item: 'Estate plan update — will last reviewed 2017 (9 years ago)' }
      ],
      lifeChanges: [
        { question: 'Income or employment change?',  answer: 'CEO — business income stable',       flagged: false },
        { question: 'Estate plan updated?',          answer: 'Will from 2017 — 9 years overdue',   flagged: true  },
        { question: 'Retirement timeline change?',   answer: 'No change — 2039 target',            flagged: false },
        { question: 'Beneficiary change?',           answer: 'Last updated 2019 — review needed',  flagged: true  },
        { question: 'Business succession progress?', answer: 'No buy-sell in place — urgent',      flagged: true  },
        { question: 'LTC planning?',                 answer: 'WL LTC rider active — confirm benefit',flagged: false}
      ],
      ipsUpdate: {
        currentVersion: 'v1.2 — Oct 20, 2025',
        changeNeeded: true,
        proposedChanges: [
          'Add RMD distribution schedule for 2026–2039',
          'Document annuity income layer as IRA complement',
          'Update beneficiary section — reflect 2026 designations'
        ],
        complianceStatus: 'Update required — review overdue'
      },
      actions: [
        { priority: 'urgent', label: '⚡ Schedule review immediately — 6 months overdue',            owner: 'Agent',   due: 'Apr 15, 2026', done: false },
        { priority: 'urgent', label: 'Execute 3-trade rebalance ($7.25K — US Equity drift)',         owner: 'Agent',   due: 'Apr 16, 2026', done: false },
        { priority: 'urgent', label: 'Plan $7,250 RMD — schedule Q4 distribution',                  owner: 'Client',  due: 'Q4 2026',      done: false },
        { priority: 'high',   label: 'Present deferred annuity — retirement income supplement',      owner: 'Agent',   due: 'Apr 15, 2026', done: false },
        { priority: 'high',   label: 'Estate plan review — will + beneficiary update (2017)',        owner: 'Client',  due: 'May 2026',     done: false },
        { priority: 'high',   label: 'Update IPS v1.3 — RMD schedule + annuity layer',             owner: 'Agent',   due: 'Apr 30, 2026', done: false },
        { priority: 'medium', label: 'Buy-sell insurance follow-up — coordinate with SMA review',    owner: 'Agent',   due: 'May 2026',     done: false }
      ],
      perfAttribution: [
        { source: 'US Equity (MainStay Epoch)',  contribution: '+4.3%', vs: 'Target +4.0%', status: 'outperform'  },
        { source: 'Intl Equity (Candriam)',      contribution: '+0.7%', vs: 'Target +0.9%', status: 'underperform'},
        { source: 'Fixed Income (MacKay Bond)',  contribution: '+1.1%', vs: 'Target +1.1%', status: 'inline'      },
        { source: 'Cash / MMF',                 contribution: '+0.3%', vs: 'Target +0.3%', status: 'inline'      }
      ],
      aiNarrative: 'IRA-291001 is 6 months overdue for its semi-annual review — this is a compliance risk for a RMD-eligible account. Three urgent items converge at the Apr 15 meeting: (1) rebalance to correct US Equity drift, (2) RMD planning for the $7,250 Dec 31 deadline, and (3) deferred annuity presentation. James\'s Whole Life cash value ($48K) serves as the conservative anchor of his overall portfolio — presenting a coordinated insurance + IRA + annuity income picture will be compelling. Estate plan gap (2017 will, 2019 beneficiary) is a relationship risk — address proactively.'
    },

    /* ── Maria Gonzalez ETF ── */
    'IA-MG-001': {
      client: 'Maria Gonzalez', accountNum: 'ETF-341001', accountType: 'ETF Portfolio',
      reviewCycle: 'Quarterly',
      lastReview: 'Mar 5, 2026', nextReview: 'Jun 5, 2026', reviewStatus: 'scheduled',
      reviewStatusLabel: 'Scheduled — Jun 5',
      advisor: 'Sridhar R.', coordinator: 'NYL Branch Office',
      meetingType: 'Video Call', meetingDuration: '45 min',
      meetingScheduled: 'Jun 5, 2026 · 11:00 AM · Zoom',
      kpis: [
        { label: 'AUM',         val: '$120K',  sub: '+$12K since last review',  color: '#003087', icon: 'fa-coins'       },
        { label: 'Return YTD',  val: '+8.2%',  sub: '+0.2% vs benchmark',       color: '#059669', icon: 'fa-chart-line'  },
        { label: 'Drift',       val: '1.9',    sub: 'Perfectly allocated',      color: '#059669', icon: 'fa-balance-scale'},
        { label: 'DCA Plan',    val: '$1K/mo', sub: '$12K/yr systematic invest',color: '#059669', icon: 'fa-robot'       },
        { label: 'Fee',         val: '$900',   sub: '0.75% of AUM',            color: '#003087', icon: 'fa-hand-holding-usd'},
        { label: 'Next Step',   val: 'UMA',    sub: 'Upgrade path at $200K',   color: '#7c3aed', icon: 'fa-arrow-up'    }
      ],
      agenda: [
        { done: true,  item: 'Q1 performance recap — +8.2% YTD, DCA plan working well' },
        { done: true,  item: 'Allocation confirmation — perfectly on target (no drift)' },
        { done: false, item: 'DCA plan continuation — $1,000/month systematic investment' },
        { done: false, item: 'UMA upgrade discussion — advisory managed at $200K AUM threshold' },
        { done: false, item: 'Roth IRA coordination — combined account strategy' },
        { done: false, item: 'DI insurance gap — income protection alongside investment growth' }
      ],
      lifeChanges: [
        { question: 'Income change (Hospital Admin)?', answer: 'Stable — $210K household income', flagged: false },
        { question: 'DI coverage in place?',           answer: 'No DI insurance — urgent gap',   flagged: true  },
        { question: 'Retirement timeline?',            answer: '2043 target — 17 years',         flagged: false },
        { question: '529 for future education?',       answer: 'No 529 yet — discuss if children planned', flagged: false }
      ],
      ipsUpdate: {
        currentVersion: 'v1.1 — Mar 5, 2026',
        changeNeeded: false,
        proposedChanges: [],
        complianceStatus: 'Current — review at $200K UMA upgrade'
      },
      actions: [
        { priority: 'high',   label: 'Present DI insurance — income protection gap',                 owner: 'Agent',   due: 'Jun 5, 2026', done: false },
        { priority: 'high',   label: 'Present UMA upgrade roadmap — target $200K threshold',         owner: 'Agent',   due: 'Jun 5, 2026', done: false },
        { priority: 'medium', label: 'Confirm $1,000/month DCA plan continuation',                   owner: 'Client',  due: 'Jun 5, 2026', done: false },
        { priority: 'medium', label: 'Coordinate Roth IRA + ETF combined strategy review',           owner: 'Agent',   due: 'Jun 5, 2026', done: false },
        { priority: 'low',    label: 'Schedule Q3 review — Sep 5, 2026',                            owner: 'Coordinator', due: 'Jun 10, 2026', done: false }
      ],
      perfAttribution: [
        { source: 'SPY — SPDR S&P 500 ETF',   contribution: '+4.5%', vs: 'Target +4.4%', status: 'inline'     },
        { source: 'EFA — iShares MSCI EAFE',  contribution: '+1.4%', vs: 'Target +1.4%', status: 'inline'     },
        { source: 'AGG — iShares Core Bond',  contribution: '+0.7%', vs: 'Target +0.7%', status: 'inline'     },
        { source: 'Cash / MMF',               contribution: '+0.3%', vs: 'Target +0.3%', status: 'inline'     }
      ],
      aiNarrative: 'ETF-341001 is Maria\'s core growth engine and it is performing exactly as designed — perfectly allocated, systematic DCA in place, and tracking slightly above benchmark. The primary opportunity at the Jun 5 review is the DI insurance cross-sell ($210K household income with no disability protection is a significant gap) and the UMA upgrade presentation ($80K away from the $200K advisory threshold). Both conversations are natural and client-appropriate.'
    },

    /* ── Maria Gonzalez Roth IRA ── */
    'IA-MG-002': {
      client: 'Maria Gonzalez', accountNum: 'ROTH-341002', accountType: 'IRA (Roth)',
      reviewCycle: 'Annual',
      lastReview: 'Mar 5, 2026', nextReview: 'Jun 5, 2026', reviewStatus: 'scheduled',
      reviewStatusLabel: 'Combined with ETF review — Jun 5',
      advisor: 'Sridhar R.', coordinator: 'NYL Branch Office',
      meetingType: 'Video Call', meetingDuration: '15 min (combined with ETF-341001)',
      meetingScheduled: 'Jun 5, 2026 · 11:45 AM · Zoom (continuation)',
      kpis: [
        { label: 'Balance',        val: '$28K',  sub: 'Proj $142K at retirement 2043', color: '#003087', icon: 'fa-coins'       },
        { label: 'Return YTD',     val: '+9.1%', sub: '-0.1% vs S&P 500',             color: '#64748b', icon: 'fa-chart-line'  },
        { label: 'Annual Contrib', val: '$7,000',sub: '2026 contribution maxed',       color: '#059669', icon: 'fa-piggy-bank'  },
        { label: 'No RMD',         val: 'N/A',   sub: 'Roth IRA — no RMD applies',    color: '#059669', icon: 'fa-check-circle'},
        { label: 'Fee',            val: '$0',    sub: 'Self-directed',                color: '#059669', icon: 'fa-tag'         },
        { label: 'Threshold',      val: '$50K',  sub: 'Advisor-managed at $50K',      color: '#7c3aed', icon: 'fa-arrow-up'    }
      ],
      agenda: [
        { done: true,  item: '2026 Roth contribution maxed — $7,000 confirmed' },
        { done: false, item: 'Portfolio performance recap — +9.1% YTD (inline with S&P)' },
        { done: false, item: 'Advisor-managed upgrade path — $22K away from $50K threshold' },
        { done: false, item: 'Aggressive allocation confirmation — 80% equity appropriate at 17-yr horizon' }
      ],
      lifeChanges: [
        { question: 'Income eligibility for Roth?', answer: 'Household income $210K — within Roth limits', flagged: false },
        { question: 'Contribution limit change?',   answer: '$7,000 limit for 2026 confirmed',            flagged: false }
      ],
      ipsUpdate: {
        currentVersion: 'v1.0 — Apr 2023',
        changeNeeded: false,
        proposedChanges: [],
        complianceStatus: 'Current — review at $50K advisor-managed upgrade'
      },
      actions: [
        { priority: 'medium', label: 'Confirm 2027 Roth contribution plan — $7,000',                  owner: 'Client', due: 'Jan 2027',    done: false },
        { priority: 'medium', label: 'Prepare advisor-managed upgrade proposal for $50K threshold',   owner: 'Agent',  due: 'Jun 5, 2026', done: false },
        { priority: 'low',    label: 'Monitor income eligibility — Roth phase-out begins $146K/single', owner: 'Agent',  due: 'Annual',     done: false }
      ],
      perfAttribution: [
        { source: 'VTI — Vanguard Total Market', contribution: '+7.3%', vs: 'Target +7.2%', status: 'inline'      },
        { source: 'VXUS — Vanguard Intl',        contribution: '+1.0%', vs: 'Target +1.2%', status: 'underperform'},
        { source: 'Cash / MMF',                  contribution: '+0.2%', vs: 'Target +0.2%', status: 'inline'      }
      ],
      aiNarrative: 'ROTH-341002 is a straightforward, maximized account — contributions are at the limit and the aggressive allocation is appropriate for the 17-year horizon. The only strategic event is the advisor-managed upgrade at $50K ($22K away at current trajectory). Note: if Maria\'s household income approaches the Roth phase-out threshold ($218K for MFJ in 2026), a backdoor Roth strategy should be considered. This is a good annual review item to monitor.'
    },

    /* ── Alex Rivera UMA (Funding Pending) ── */
    'IA-AR-001': {
      client: 'Alex Rivera', accountNum: 'UMA-360001', accountType: 'Advisory (UMA)',
      reviewCycle: 'Semi-Annual (first review when funded)',
      lastReview: 'N/A — new account', nextReview: 'Oct 1, 2026', reviewStatus: 'not-started',
      reviewStatusLabel: 'First review — Oct 1, 2026',
      advisor: 'Sridhar R.', coordinator: 'NYL Branch Office',
      meetingType: 'Video Call', meetingDuration: '60 min (initial portfolio review)',
      meetingScheduled: 'Oct 1, 2026 · 2:00 PM (tentative)',
      kpis: [
        { label: 'AUM',           val: '$0',     sub: 'Funding in progress',          color: '#64748b', icon: 'fa-coins'         },
        { label: 'Expected AUM',  val: '$80K',   sub: 'ACH $50K + ACAT $30K',        color: '#003087', icon: 'fa-hourglass-half' },
        { label: 'First Review',  val: 'Oct 1',  sub: '6 months post-funding',        color: '#003087', icon: 'fa-calendar'      },
        { label: 'Risk Profile',  val: 'Mod. Growth', sub: 'Score 62 — IPS drafted', color: '#ea580c', icon: 'fa-chart-pie'     },
        { label: 'Fee',           val: '1.00%',  sub: '~$800/yr when funded',        color: '#003087', icon: 'fa-hand-holding-usd'},
        { label: 'Status',        val: 'Pending', sub: 'Awaiting full funding',       color: '#ea580c', icon: 'fa-clock'         }
      ],
      agenda: [
        { done: false, item: 'Confirm ACH receipt — $50K expected Apr 14' },
        { done: false, item: 'Confirm ACAT transfer from Schwab — $30K expected Apr 18' },
        { done: false, item: 'Execute initial portfolio construction trade — per IPS target allocation' },
        { done: false, item: 'Send welcome package and online portal access' },
        { done: false, item: 'Schedule first 6-month review — Oct 1, 2026' }
      ],
      lifeChanges: [
        { question: 'Account status?',              answer: 'Funding in progress — April 2026',   flagged: false },
        { question: 'IPS status?',                  answer: 'Draft v1.0 — pending client signature', flagged: true },
        { question: 'Whole Life coordination?',     answer: 'Policy P-100360 delivered Apr 14',   flagged: false }
      ],
      ipsUpdate: {
        currentVersion: 'v1.0 Draft — Apr 12, 2026',
        changeNeeded: true,
        proposedChanges: ['Obtain client IPS signature after funding confirmed','Document initial trade execution in IPS'],
        complianceStatus: 'Pending client signature'
      },
      actions: [
        { priority: 'urgent', label: 'Monitor ACH receipt — expected Apr 14',                          owner: 'Agent',  due: 'Apr 14, 2026', done: false },
        { priority: 'urgent', label: 'Confirm ACAT from Schwab — call if not received Apr 19',        owner: 'Agent',  due: 'Apr 19, 2026', done: false },
        { priority: 'high',   label: 'Execute initial portfolio construction trade upon full funding', owner: 'Agent',  due: 'Apr 20, 2026', done: false },
        { priority: 'high',   label: 'Obtain IPS signature — send DocuSign',                         owner: 'Agent',  due: 'Apr 18, 2026', done: false },
        { priority: 'medium', label: 'Send welcome package and portal access instructions',           owner: 'Agent',  due: 'Apr 20, 2026', done: false },
        { priority: 'medium', label: 'Schedule first 6-month review — Oct 1, 2026',                  owner: 'Coordinator', due: 'Apr 22, 2026', done: false }
      ],
      perfAttribution: [],
      aiNarrative: 'UMA-360001 is Alex Rivera\'s newly opened account — funding is in progress with two tranches expected by Apr 18. Once funded ($80K initial AUM), the first portfolio construction trade will execute per the Moderate Growth IPS target allocation (60% US Equity / 20% Intl / 15% Fixed Income / 5% Cash). The first formal review is scheduled for Oct 1, 2026. Priority items before then: IPS signature, trade confirmation, and welcome onboarding. This account completes the full INV Track for Alex — from FNA Investment Profile to Products proposal, Account Opening, Funding & IPS, and now the Annual Review lifecycle.'
    },

    /* ── Patricia Nguyen ETF ── */
    'IA-PN-001': {
      client: 'Patricia Nguyen', accountNum: 'ETF-301001', accountType: 'ETF Portfolio',
      reviewCycle: 'Semi-Annual',
      lastReview: 'Feb 20, 2026', nextReview: 'May 20, 2026', reviewStatus: 'upcoming',
      reviewStatusLabel: 'Upcoming — May 20',
      advisor: 'Sridhar R.', coordinator: 'NYL Branch Office',
      meetingType: 'Video Call', meetingDuration: '45 min',
      meetingScheduled: 'May 20, 2026 · 10:00 AM · Zoom',
      kpis: [
        { label: 'AUM',         val: '$68K',  sub: '+$8K since last review',    color: '#003087', icon: 'fa-coins'         },
        { label: 'Return YTD',  val: '+7.4%', sub: '+0.4% vs benchmark',        color: '#059669', icon: 'fa-chart-line'    },
        { label: 'Drift Score', val: '5.1',   sub: 'Minor rebalance needed',    color: '#ea580c', icon: 'fa-balance-scale' },
        { label: 'TLH',        val: '$800',  sub: 'AGG bond ETF opportunity',  color: '#7c3aed', icon: 'fa-leaf'          },
        { label: 'UL Risk',     val: '⚠️',    sub: 'UL policy underfunding',    color: '#dc2626', icon: 'fa-exclamation-triangle'},
        { label: 'Fee',         val: '$510',  sub: '0.75% of AUM',            color: '#003087', icon: 'fa-hand-holding-usd'}
      ],
      agenda: [
        { done: true,  item: 'Q1 performance recap — +7.4% YTD, slight drift in US Equity' },
        { done: false, item: 'Rebalance — US Equity 50%→45%, 3 trades (~$3.4K total movement)' },
        { done: false, item: 'TLH opportunity — $800 in AGG bond ETF' },
        { done: false, item: '⚠️ Insurance coordination — UL policy underfunding risk (lapse concern)' },
        { done: false, item: 'DCA plan review — systematic investment continuation' },
        { done: false, item: 'Combined insurance + investment financial plan presentation' }
      ],
      lifeChanges: [
        { question: 'UL policy status?',              answer: 'Underfunding risk — cash value depleting', flagged: true  },
        { question: 'Income change?',                 answer: 'Stable — Healthcare Director',           flagged: false },
        { question: 'Retirement timeline?',           answer: '2053 — 27 years, horizon unchanged',    flagged: false },
        { question: 'Risk profile change?',           answer: 'Conservative Growth — confirmed',       flagged: false }
      ],
      ipsUpdate: {
        currentVersion: 'v1.1 — Feb 20, 2026',
        changeNeeded: true,
        proposedChanges: ['Document UL insurance coordination risk in financial plan','Consider DI insurance addition to IPS financial plan context'],
        complianceStatus: 'Update recommended — insurance coordination'
      },
      actions: [
        { priority: 'urgent', label: '⚠️ Address UL underfunding — lapse risk at next review',       owner: 'Agent',   due: 'May 20, 2026', done: false },
        { priority: 'high',   label: 'Execute 3-trade ETF rebalance (~$3.4K)',                        owner: 'Agent',   due: 'May 21, 2026', done: false },
        { priority: 'high',   label: 'Harvest $800 TLH in AGG bond ETF',                            owner: 'Agent',   due: 'May 31, 2026', done: false },
        { priority: 'medium', label: 'Present combined insurance + investment financial plan',        owner: 'Agent',   due: 'May 20, 2026', done: false },
        { priority: 'medium', label: 'Update IPS — add UL coordination note',                       owner: 'Agent',   due: 'May 31, 2026', done: false },
        { priority: 'low',    label: 'Schedule H2 review — Aug 20, 2026',                           owner: 'Coordinator', due: 'May 25, 2026', done: false }
      ],
      perfAttribution: [
        { source: 'VTI — Vanguard Total Market', contribution: '+4.6%', vs: 'Target +4.2%', status: 'outperform'  },
        { source: 'VXUS — Vanguard Intl',        contribution: '+0.9%', vs: 'Target +1.0%', status: 'inline'      },
        { source: 'AGG — iShares Core Bond',     contribution: '+1.0%', vs: 'Target +1.2%', status: 'underperform'},
        { source: 'Cash / MMF',                  contribution: '+0.2%', vs: 'Target +0.2%', status: 'inline'      }
      ],
      aiNarrative: 'ETF-301001 is performing well (+0.4% alpha) but the UL insurance underfunding is a compounding risk that affects Patricia\'s overall financial picture. The investment portfolio is growing while the insurance protection is eroding — these two plans are working against each other. The May 20 review should present a coordinated insurance + investment financial plan that addresses the UL cash value deficit, DI insurance gap, and ETF rebalance as a single integrated advisory conversation. This is a relationship-deepening opportunity, not just a rebalance discussion.'
    },

    /* ── Sandra Williams IRA ── */
    'IA-SW-001': {
      client: 'Sandra Williams', accountNum: 'IRA-320001', accountType: 'IRA (Traditional)',
      reviewCycle: 'Semi-Annual',
      lastReview: 'Sep 15, 2025', nextReview: 'Apr 10, 2026', reviewStatus: 'overdue',
      reviewStatusLabel: 'Overdue — 7 months',
      advisor: 'Sridhar R.', coordinator: 'NYL Branch Office',
      meetingType: 'In-Person', meetingDuration: '90 min',
      meetingScheduled: 'Apr 10, 2026 · 1:00 PM · Client home — 14 Oak St, Greenwich CT',
      kpis: [
        { label: 'AUM',          val: '$312K',  sub: '+$18K since Sep 2025',    color: '#003087', icon: 'fa-coins'              },
        { label: 'Return YTD',   val: '+6.8%',  sub: '+0.3% vs benchmark',     color: '#059669', icon: 'fa-chart-line'         },
        { label: 'RMD Due',      val: '$11,400',sub: 'Dec 31, 2026 deadline',  color: '#dc2626', icon: 'fa-calendar-exclamation'},
        { label: 'Review Gap',   val: '7 mo',   sub: 'Overdue since Sep 2025', color: '#dc2626', icon: 'fa-clock'              },
        { label: 'Retirement',   val: '5 yrs',  sub: '2031 target — near-term', color: '#ea580c', icon: 'fa-hourglass-half'    },
        { label: 'Term Expiry',  val: 'Sep 2026', sub: 'Conversion decision needed', color: '#dc2626', icon: 'fa-file-contract'}
      ],
      agenda: [
        { done: false, item: '⚡ OVERDUE: Semi-annual IRA review — 7 months since last review' },
        { done: false, item: 'RMD planning — $11,400 required by Dec 31, 2026' },
        { done: false, item: 'Retirement income strategy — 5 years to retirement, annuity income bridge' },
        { done: false, item: '⚡ Term policy expiration — Sep 2026 conversion decision deadline' },
        { done: false, item: 'IPS glide path review — Conservative profile, bond-heavy allocation review' },
        { done: false, item: 'LTC claim update — benefit adequacy vs NYC care costs' },
        { done: false, item: 'Social Security timing strategy — age 62 vs 67 breakeven analysis' }
      ],
      lifeChanges: [
        { question: 'LTC claim status?',             answer: 'Active monthly claim — reviewing benefit', flagged: true  },
        { question: 'Term policy conversion?',        answer: '⚡ Deadline Sep 2026 — decision needed',  flagged: true  },
        { question: 'Retirement income plan?',        answer: 'SS + IRA + annuity — gap exists',        flagged: true  },
        { question: 'Social Security timing?',        answer: 'Age 62 vs 67 breakeven not analyzed',    flagged: true  },
        { question: 'Estate plan update?',            answer: 'Will reviewed recently — OK',            flagged: false },
        { question: 'Healthcare cost planning?',      answer: 'LTC claim covers current — gap at 2031', flagged: true  }
      ],
      ipsUpdate: {
        currentVersion: 'v2.1 — Sep 15, 2025',
        changeNeeded: true,
        proposedChanges: [
          'Increase cash allocation to 15% ahead of 2031 retirement',
          'Document annuity income bridge strategy in IPS',
          'Add RMD schedule 2026–2031 as appendix',
          'Update Social Security coordination section'
        ],
        complianceStatus: 'Update required — retirement imminent'
      },
      actions: [
        { priority: 'urgent', label: '⚡ Schedule review immediately — 7 months overdue',               owner: 'Agent',   due: 'Apr 10, 2026', done: false },
        { priority: 'urgent', label: '⚡ Term conversion decision — deadline Sep 2026 (5 months)',       owner: 'Client',  due: 'Apr 10, 2026', done: false },
        { priority: 'urgent', label: 'Plan $11,400 RMD — Dec 31, 2026 hard deadline',                  owner: 'Client',  due: 'Q4 2026',      done: false },
        { priority: 'high',   label: 'Present annuity income bridge — $120K → $1,400/mo at retirement', owner: 'Agent',   due: 'Apr 10, 2026', done: false },
        { priority: 'high',   label: 'Social Security timing analysis — age 62 vs 67 breakeven',        owner: 'Agent',   due: 'Apr 30, 2026', done: false },
        { priority: 'high',   label: 'Update IPS v2.2 — retirement glide path + RMD schedule',         owner: 'Agent',   due: 'Apr 30, 2026', done: false },
        { priority: 'medium', label: 'LTC benefit adequacy review — NYC home care cost comparison',     owner: 'Agent',   due: 'May 2026',     done: false }
      ],
      perfAttribution: [
        { source: 'US Equity (MainStay Epoch)',  contribution: '+2.1%', vs: 'Target +2.0%', status: 'inline'      },
        { source: 'Intl Equity (Candriam)',      contribution: '+0.6%', vs: 'Target +0.7%', status: 'underperform'},
        { source: 'Fixed Income (MacKay Bond)',  contribution: '+1.9%', vs: 'Target +1.9%', status: 'inline'      },
        { source: 'Cash / Stable Value',         contribution: '+0.5%', vs: 'Target +0.5%', status: 'inline'      }
      ],
      aiNarrative: 'IRA-320001 is Sandra\'s primary retirement vehicle — and it faces three converging urgencies: (1) 7-month review overdue on an RMD-eligible account, (2) term policy expiration in Sep 2026 requiring a permanent conversion decision, and (3) retirement 5 years away with an identified income gap of $1,800/month. The annuity income bridge presentation is the single highest-value agenda item — a $120K immediate annuity would generate ~$1,400/month, nearly closing the gap. Coordinate the IRA, LTC, term conversion, and annuity conversations as a single holistic retirement plan.'
    },

    /* ── David Thompson MF ── */
    'IA-DT-001': {
      client: 'David Thompson', accountNum: 'MF-305001', accountType: 'Mutual Fund Portfolio',
      reviewCycle: 'Semi-Annual',
      lastReview: 'Mar 15, 2026', nextReview: 'Sep 15, 2026', reviewStatus: 'scheduled',
      reviewStatusLabel: 'Scheduled — Sep 15',
      advisor: 'Sridhar R.', coordinator: 'NYL Branch Office',
      meetingType: 'Video Call', meetingDuration: '45 min',
      meetingScheduled: 'Sep 15, 2026 · 2:00 PM · Zoom',
      kpis: [
        { label: 'AUM',         val: '$42K',  sub: 'New account — Mar 2026',   color: '#003087', icon: 'fa-coins'       },
        { label: 'Return',      val: '+3.1%', sub: 'Partial year (1 mo)',      color: '#059669', icon: 'fa-chart-line'  },
        { label: 'Drift',       val: '0.5',   sub: 'Perfectly on target',     color: '#059669', icon: 'fa-balance-scale'},
        { label: 'Auto Plan',   val: '$500/mo', sub: 'Systematic investment',  color: '#059669', icon: 'fa-robot'       },
        { label: 'DI Gap',      val: '⚠️',    sub: 'No disability insurance', color: '#dc2626', icon: 'fa-exclamation-triangle'},
        { label: 'Horizon',     val: '32 yrs', sub: 'Retirement 2058',        color: '#059669', icon: 'fa-chart-line'  }
      ],
      agenda: [
        { done: true,  item: 'Account onboarding confirmed — initial $42K invested per IPS' },
        { done: true,  item: 'Automatic investment plan confirmed — $500/month' },
        { done: false, item: 'First 6-month performance review — inception returns vs benchmark' },
        { done: false, item: 'DI insurance — income protection gap (no disability coverage)' },
        { done: false, item: '529 college savings — recently married, future education planning' },
        { done: false, item: 'Increase systematic investment — raise to $750/month?' }
      ],
      lifeChanges: [
        { question: 'Income change (Software Eng)?', answer: 'Stable — growing career',         flagged: false },
        { question: 'Family status change?',          answer: 'Recently married — new financial goals', flagged: true  },
        { question: 'DI insurance in place?',         answer: 'No — income not protected',       flagged: true  },
        { question: 'Children planned?',              answer: 'Possible — discuss 529 timing',   flagged: false },
        { question: 'Emergency fund adequate?',       answer: 'Estimated 3-month fund — confirm', flagged: false }
      ],
      ipsUpdate: {
        currentVersion: 'v1.0 — Mar 15, 2026',
        changeNeeded: false,
        proposedChanges: [],
        complianceStatus: 'Current — new account'
      },
      actions: [
        { priority: 'urgent', label: '⚠️ Present DI insurance — income not protected (Software Eng)',  owner: 'Agent',   due: 'Sep 15, 2026', done: false },
        { priority: 'high',   label: 'Discuss 529 plan — married, future college planning',            owner: 'Agent',   due: 'Sep 15, 2026', done: false },
        { priority: 'medium', label: 'Review automatic investment — raise from $500 to $750/month?',   owner: 'Agent',   due: 'Sep 15, 2026', done: false },
        { priority: 'medium', label: 'Confirm emergency fund adequacy — 3-6 month target',            owner: 'Client',  due: 'Sep 15, 2026', done: false },
        { priority: 'low',    label: 'Schedule 2027 annual review — Mar 15, 2027',                    owner: 'Coordinator', due: 'Sep 20, 2026', done: false }
      ],
      perfAttribution: [
        { source: 'MainStay Epoch US Equity',  contribution: '+1.9%', vs: 'Target benchmark n/a', status: 'inline' },
        { source: 'MainStay Candriam Intl',    contribution: '+0.6%', vs: 'Target benchmark n/a', status: 'inline' },
        { source: 'MainStay MacKay Bond',      contribution: '+0.4%', vs: 'Target benchmark n/a', status: 'inline' },
        { source: 'Cash / MMF',                contribution: '+0.1%', vs: 'Target benchmark n/a', status: 'inline' }
      ],
      aiNarrative: 'MF-305001 is a strong start for David Thompson — perfectly allocated and on track from day one. The 6-month review in Sep 2026 is the first major relationship-building opportunity. Two high-value cross-sell conversations are ready: (1) DI insurance — a Software Engineer earning a tech salary with no disability protection is a significant risk, and (2) 529 college savings — recently married, likely planning a family, 18-year runway for compounding. David has a 32-year investment horizon and is an ideal candidate for growing the advisory relationship over time.'
    }
  };

  /* ══════════════════════════════════════════════════════════════
     2. RENDER HELPERS
     ══════════════════════════════════════════════════════════════ */

  function _arStatusBadge(code) {
    var map = {
      'overdue':     { cls: 'ar-badge-overdue',   icon: 'fa-exclamation-circle', label: 'Overdue' },
      'upcoming':    { cls: 'ar-badge-upcoming',   icon: 'fa-calendar-alt',      label: 'Upcoming' },
      'scheduled':   { cls: 'ar-badge-scheduled',  icon: 'fa-calendar-check',    label: 'Scheduled' },
      'not-started': { cls: 'ar-badge-ns',         icon: 'fa-minus-circle',      label: 'Not Started' }
    };
    var m = map[code] || map['not-started'];
    return '<span class="ar-status-badge ' + m.cls + '"><i class="fas ' + m.icon + '"></i> ' + m.label + '</span>';
  }

  function _arPriorityDot(p) {
    var cls = { urgent: 'ar-dot-urgent', high: 'ar-dot-high', medium: 'ar-dot-medium', low: 'ar-dot-low' };
    return '<span class="ar-priority-dot ' + (cls[p] || 'ar-dot-low') + '"></span>';
  }

  function _arPerfRow(item) {
    var cls = { outperform: 'ar-perf-out', underperform: 'ar-perf-under', inline: 'ar-perf-inline' };
    var icon = { outperform: 'fa-arrow-up', underperform: 'fa-arrow-down', inline: 'fa-minus' };
    return '<div class="ar-perf-row">' +
      '<span class="ar-perf-source">' + item.source + '</span>' +
      '<span class="ar-perf-contrib">' + item.contribution + '</span>' +
      '<span class="ar-perf-vs ' + (cls[item.status] || '') + '">' +
        '<i class="fas ' + (icon[item.status] || 'fa-minus') + '"></i> ' + item.vs +
      '</span>' +
    '</div>';
  }

  /* ══════════════════════════════════════════════════════════════
     3. MAIN TAB RENDER
     ══════════════════════════════════════════════════════════════ */

  function iaRenderAnnualReviewTab(a) {
    var ar = _arData[a.id];
    if (!ar) {
      return '<div class="ar-empty"><i class="fas fa-calendar-check"></i> No annual review data available for this account.</div>';
    }

    /* ── KPI strip ── */
    var kpiHtml = '<div class="ar-kpi-strip">' +
      ar.kpis.map(function(k) {
        return '<div class="ar-kpi-card">' +
          '<div class="ar-kpi-icon" style="color:' + k.color + '"><i class="fas ' + k.icon + '"></i></div>' +
          '<div class="ar-kpi-body">' +
            '<div class="ar-kpi-val" style="color:' + k.color + '">' + k.val + '</div>' +
            '<div class="ar-kpi-lbl">' + k.label + '</div>' +
            '<div class="ar-kpi-sub">' + k.sub + '</div>' +
          '</div>' +
        '</div>';
      }).join('') +
    '</div>';

    /* ── Review header ── */
    var headerHtml = '<div class="ar-header">' +
      '<div class="ar-header-left">' +
        '<div class="ar-header-title"><i class="fas fa-calendar-check"></i> Annual Review ' + _arStatusBadge(ar.reviewStatus) + '</div>' +
        '<div class="ar-header-sub">' + ar.reviewStatusLabel + ' · ' + ar.reviewCycle + ' cycle · ' + ar.meetingType + ' · ' + ar.meetingDuration + '</div>' +
        '<div class="ar-header-meeting"><i class="fas fa-map-marker-alt"></i> ' + ar.meetingScheduled + '</div>' +
      '</div>' +
      '<div class="ar-header-right">' +
        '<div class="ar-header-stat"><span class="ar-hs-val">' + ar.lastReview + '</span><span class="ar-hs-lbl">Last Review</span></div>' +
        '<div class="ar-header-stat"><span class="ar-hs-val">' + ar.nextReview + '</span><span class="ar-hs-lbl">Next Review</span></div>' +
        '<div class="ar-header-stat"><span class="ar-hs-val">' + ar.advisor + '</span><span class="ar-hs-lbl">Advisor</span></div>' +
      '</div>' +
    '</div>';

    /* ── Two-col body ── */

    /* LEFT: Agenda + Life Changes */
    var agendaHtml = '<div class="ar-section">' +
      '<div class="ar-section-hdr"><i class="fas fa-list-ol"></i> Meeting Agenda</div>' +
      '<div class="ar-agenda-list">' +
      ar.agenda.map(function(item, i) {
        return '<div class="ar-agenda-item ' + (item.done ? 'done' : '') + '">' +
          '<div class="ar-agenda-num">' + (item.done ? '<i class="fas fa-check"></i>' : (i + 1)) + '</div>' +
          '<div class="ar-agenda-text">' + item.item + '</div>' +
        '</div>';
      }).join('') +
      '</div>' +
    '</div>';

    var lifeHtml = '<div class="ar-section">' +
      '<div class="ar-section-hdr"><i class="fas fa-user-check"></i> Life Changes Check</div>' +
      '<div class="ar-life-list">' +
      ar.lifeChanges.map(function(lc) {
        return '<div class="ar-life-row ' + (lc.flagged ? 'flagged' : '') + '">' +
          '<div class="ar-life-q">' + (lc.flagged ? '<i class="fas fa-exclamation-triangle ar-flag-icon"></i> ' : '') + lc.question + '</div>' +
          '<div class="ar-life-a">' + lc.answer + '</div>' +
        '</div>';
      }).join('') +
      '</div>' +
    '</div>';

    /* RIGHT: Actions + Perf Attribution + IPS Update */
    var actionsHtml = '<div class="ar-section">' +
      '<div class="ar-section-hdr"><i class="fas fa-tasks"></i> Action Items</div>' +
      '<div class="ar-action-list">' +
      ar.actions.map(function(act) {
        return '<div class="ar-action-row ' + (act.done ? 'done' : '') + '">' +
          _arPriorityDot(act.priority) +
          '<div class="ar-action-body">' +
            '<div class="ar-action-label">' + act.label + '</div>' +
            '<div class="ar-action-meta">' + act.owner + ' · Due: ' + act.due + '</div>' +
          '</div>' +
          '<div class="ar-action-tag ar-tag-' + act.priority + '">' + act.priority + '</div>' +
        '</div>';
      }).join('') +
      '</div>' +
    '</div>';

    var perfHtml = ar.perfAttribution.length ? (
      '<div class="ar-section">' +
        '<div class="ar-section-hdr"><i class="fas fa-chart-bar"></i> Performance Attribution</div>' +
        '<div class="ar-perf-list">' +
          '<div class="ar-perf-hdr-row">' +
            '<span class="ar-perf-source">Source</span>' +
            '<span class="ar-perf-contrib">Contribution</span>' +
            '<span class="ar-perf-vs">vs Target</span>' +
          '</div>' +
          ar.perfAttribution.map(_arPerfRow).join('') +
        '</div>' +
      '</div>'
    ) : '';

    var ipsChgHtml = ar.ipsUpdate.changeNeeded
      ? '<ul class="ar-ips-changes">' + ar.ipsUpdate.proposedChanges.map(function(c){ return '<li>' + c + '</li>'; }).join('') + '</ul>'
      : '<div class="ar-ips-ok"><i class="fas fa-check-circle"></i> No IPS update required</div>';

    var ipsHtml = '<div class="ar-section">' +
      '<div class="ar-section-hdr"><i class="fas fa-file-contract"></i> IPS Update</div>' +
      '<div class="ar-ips-meta">' +
        '<div class="ar-ips-row"><span class="ar-ips-key">Current Version</span><span class="ar-ips-val">' + ar.ipsUpdate.currentVersion + '</span></div>' +
        '<div class="ar-ips-row"><span class="ar-ips-key">Compliance</span><span class="ar-ips-val">' + ar.ipsUpdate.complianceStatus + '</span></div>' +
        '<div class="ar-ips-row"><span class="ar-ips-key">Changes</span><span class="ar-ips-val">' + (ar.ipsUpdate.changeNeeded ? 'Required' : 'None') + '</span></div>' +
      '</div>' +
      ipsChgHtml +
    '</div>';

    /* AI narrative */
    var aiHtml = '<div class="ar-ai-card">' +
      '<div class="ar-ai-hdr"><i class="fas fa-robot"></i> AI Annual Review Brief</div>' +
      '<div class="ar-ai-body">' + ar.aiNarrative + '</div>' +
      '<div class="ar-ai-actions">' +
        '<button class="ar-ai-btn" onclick="_arExportReview(\'' + a.id + '\')"><i class="fas fa-file-export"></i> Export Review Report</button>' +
        '<button class="ar-ai-btn ar-ai-btn-outline" onclick="_arScheduleReview(\'' + a.id + '\')"><i class="fas fa-calendar-plus"></i> Schedule Next Review</button>' +
      '</div>' +
    '</div>';

    return kpiHtml + headerHtml +
      '<div class="ar-body">' +
        '<div class="ar-col-left">' + agendaHtml + lifeHtml + '</div>' +
        '<div class="ar-col-right">' + actionsHtml + perfHtml + ipsHtml + '</div>' +
      '</div>' +
      aiHtml;
  }

  /* ══════════════════════════════════════════════════════════════
     4. ACTION BUTTON HELPERS
     ══════════════════════════════════════════════════════════════ */
  window._arExportReview = function(id) {
    var ar = _arData[id];
    if (!ar) return;
    if (typeof showToast === 'function') {
      showToast('<i class="fas fa-file-export"></i> Annual Review Report for <strong>' + ar.client + ' (' + ar.accountNum + ')</strong> exported to PDF — ready to share.', 3000);
    }
  };
  window._arScheduleReview = function(id) {
    var ar = _arData[id];
    if (!ar) return;
    if (typeof showToast === 'function') {
      showToast('<i class="fas fa-calendar-plus"></i> Opening calendar to schedule next review for <strong>' + ar.client + '</strong>…', 2000);
    }
  };

  /* ══════════════════════════════════════════════════════════════
     5. MONKEY-PATCH iaBuildDetailHTML — inject 6th tab button
     ══════════════════════════════════════════════════════════════ */
  var _orig_iaBuildDetailHTML = iaBuildDetailHTML;

  iaBuildDetailHTML = function(a) {
    /* Temporarily set active tab so original renders correctly */
    var savedTab = _iaActiveTab;

    /* If the active tab is 'annual-review', switch to overview for original render,
       then we'll override the panel content below */
    if (_iaActiveTab === 'annual-review') {
      _iaActiveTab = 'overview';
    }

    var html = _orig_iaBuildDetailHTML.apply(this, arguments);

    /* Restore */
    _iaActiveTab = savedTab;

    /* Inject 6th tab button — insert before closing </div> of .ia-tabs */
    var arBtn = '<button class="ia-tab-btn' +
      (_iaActiveTab === 'annual-review' ? ' ia-tab-active' : '') +
      '" onclick="iaSwitchTab(\'annual-review\',this)">' +
      '<i class="fas fa-calendar-check"></i> Annual Review</button>';

    html = html.replace(/<\/div>\s*<div class="ia-tab-panels">/, arBtn + '</div><div class="ia-tab-panels">');

    /* If active tab is annual-review, replace panel content */
    if (_iaActiveTab === 'annual-review') {
      html = html.replace(
        /<div class="ia-tab-panel" id="ia-panel-[^"]*">[\s\S]*?<\/div>/,
        '<div class="ia-tab-panel" id="ia-panel-annual-review">' + iaRenderAnnualReviewTab(a) + '</div>'
      );
    }

    return html;
  };

  /* ══════════════════════════════════════════════════════════════
     6. MONKEY-PATCH iaRenderTab — handle 'annual-review' tab id
     ══════════════════════════════════════════════════════════════ */
  var _orig_iaRenderTab = iaRenderTab;

  iaRenderTab = function(a, tab) {
    if (tab === 'annual-review') return iaRenderAnnualReviewTab(a);
    return _orig_iaRenderTab.apply(this, arguments);
  };

  /* ══════════════════════════════════════════════════════════════
     7. DONE
     ══════════════════════════════════════════════════════════════ */
  console.log('[INV Step 5] Annual Review tab loaded.');
  console.log('  Accounts patched: 12 accounts across 7 clients');
  console.log('  iaBuildDetailHTML patched — 6th tab: Annual Review');
  console.log('  iaRenderTab patched — handles annual-review tab id');

})(); // 'INV Step 5 module loaded'
