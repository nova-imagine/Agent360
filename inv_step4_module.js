/* ============================================================
   INV Track Step 4 — Account Funding & IPS Tab (Policy Delivery / p6)
   Monkey-patches p6BuildDetailHTML to inject a 6th tab:
     "Account Funding & IPS"  (key: 'funding')
   Per-delivery funding + IPS data keyed by delivery id.
   Guard: 'INV Step 4 module loaded'
   ============================================================ */
(function () {
  'use strict';

  /* ── 1. PER-DELIVERY FUNDING + IPS DATA ─────────────────────────────── */
  var _afData = {

    'DEL-001': {
      client: 'Alex Rivera',
      /* ── Funding ── */
      fundingMethod: 'Direct Bank Transfer (ACH)',
      bankName: 'Chase Bank',
      accountLast4: '4821',
      routingLast4: '0021',
      initialPremium: '$4,800.00',
      premiumMode: 'Annual',
      nextDueDate: 'Apr 8, 2027',
      autoPayStatus: 'Enrolled',
      autoPayConfirm: 'Apr 8, 2026',
      fundingStatus: 'Confirmed',
      fundingStatusCode: 'confirmed',
      fundingChecklist: [
        { label: 'Initial premium collected ($4,800)',          done: true  },
        { label: 'ACH auto-pay enrolled in carrier portal',     done: true  },
        { label: 'Bank account verified (micro-deposit)',        done: true  },
        { label: 'Payment confirmation sent to client',          done: true  },
        { label: 'Premium receipt uploaded to CRM',              done: false },
        { label: 'First anniversary reminder set (Apr 8, 2027)', done: false }
      ],
      /* ── IPS (Investment Policy Statement) ── */
      hasIPS: true,
      ipsStatus: 'Draft',
      ipsStatusCode: 'draft',
      ipsVersion: '1.0 — Draft',
      ipsDate: 'Apr 12, 2026',
      riskProfile: 'Moderate Growth',
      riskScore: 62,
      timeHorizon: '25+ years',
      liquidityNeeds: 'Low — 3-month emergency fund established separately',
      taxSituation: 'High earner — tax-deferred growth prioritized',
      esgPreference: 'No specific ESG screen',
      targetAllocation: [
        { label: 'U.S. Large Cap Equity',   pct: 40, color: '#003087' },
        { label: 'International Equity',    pct: 20, color: '#2563eb' },
        { label: 'Fixed Income / Bonds',    pct: 25, color: '#059669' },
        { label: 'Real Estate (REIT)',       pct: 10, color: '#7c3aed' },
        { label: 'Cash / Money Market',     pct: 5,  color: '#ea580c' }
      ],
      rebalanceFreq: 'Annual',
      benchmarks: ['S&P 500', 'Bloomberg U.S. Aggregate Bond Index'],
      ipsNarrative: 'Alex Rivera is a 34-year-old technology executive with a 25+ year investment horizon and moderate growth risk tolerance. The IPS prioritizes tax-deferred accumulation through the Whole Life PUA rider while maintaining diversified equity exposure in outside accounts. Primary objective is wealth transfer and Emily\'s education funding. Annual rebalancing aligned with policy anniversary (April 8).',
      ipsChecklist: [
        { label: 'Risk questionnaire completed (score: 62/100)',      done: true  },
        { label: 'Investment objectives documented',                   done: true  },
        { label: 'Target allocation approved by client',              done: false },
        { label: 'IPS draft reviewed with compliance',                done: false },
        { label: 'Client signature obtained on IPS',                  done: false },
        { label: 'IPS filed in CRM / document vault',                 done: false }
      ],
      aiInsight: 'Risk score of 62 places Alex in the upper-moderate band. Given the Whole Life policy\'s guaranteed cash value component, overall portfolio risk capacity is higher than the score alone suggests. Recommend increasing equity allocation to 65% in outside brokerage accounts to offset the conservative nature of the insurance asset. Review allocation after second PUA dividend (Apr 2027).'
    },

    'DEL-002': {
      client: 'Nancy Foster',
      fundingMethod: 'Direct Bank Transfer (ACH)',
      bankName: 'Bank of America',
      accountLast4: '7743',
      routingLast4: '0023',
      initialPremium: '$3,600.00',
      premiumMode: 'Annual',
      nextDueDate: 'Apr 9, 2027',
      autoPayStatus: 'Enrolled',
      autoPayConfirm: 'Apr 9, 2026',
      fundingStatus: 'Confirmed',
      fundingStatusCode: 'confirmed',
      fundingChecklist: [
        { label: 'Initial premium collected ($3,600)',            done: true  },
        { label: 'ACH auto-pay enrolled in carrier portal',       done: true  },
        { label: 'Bank account verified (micro-deposit)',          done: true  },
        { label: 'Payment confirmation sent to client',            done: true  },
        { label: 'Premium receipt uploaded to CRM',                done: true  },
        { label: 'First anniversary reminder set (Apr 9, 2027)',   done: false }
      ],
      hasIPS: true,
      ipsStatus: 'Approved',
      ipsStatusCode: 'approved',
      ipsVersion: '1.1 — Final',
      ipsDate: 'Apr 10, 2026',
      riskProfile: 'Conservative Growth',
      riskScore: 44,
      timeHorizon: '20 years (term aligned)',
      liquidityNeeds: 'Moderate — mortgage and household expenses considered',
      taxSituation: 'Dual high-income household — tax-efficient placement key',
      esgPreference: 'Healthcare sector exclusion preferred',
      targetAllocation: [
        { label: 'U.S. Large Cap Equity',   pct: 30, color: '#003087' },
        { label: 'International Equity',    pct: 15, color: '#2563eb' },
        { label: 'Fixed Income / Bonds',    pct: 40, color: '#059669' },
        { label: 'Real Estate (REIT)',       pct: 5,  color: '#7c3aed' },
        { label: 'Cash / Money Market',     pct: 10, color: '#ea580c' }
      ],
      rebalanceFreq: 'Semi-Annual',
      benchmarks: ['Bloomberg U.S. Aggregate Bond Index', '60/40 Blended Benchmark'],
      ipsNarrative: 'Nancy Foster, 41, Healthcare Director — risk score of 44 reflects a conservative-to-moderate profile driven by a $820K mortgage obligation and dual income dependency. IPS aligns the 20-year term policy with a matched fixed income ladder. Semi-annual rebalancing scheduled for April and October. ESG screen excludes healthcare sector per client preference (conflict of interest concern).',
      ipsChecklist: [
        { label: 'Risk questionnaire completed (score: 44/100)',      done: true  },
        { label: 'Investment objectives documented',                   done: true  },
        { label: 'Target allocation approved by client',              done: true  },
        { label: 'IPS draft reviewed with compliance',                done: true  },
        { label: 'Client signature obtained on IPS',                  done: true  },
        { label: 'IPS filed in CRM / document vault',                 done: false }
      ],
      aiInsight: 'Nancy\'s conservative score (44) is appropriate given the $820K mortgage. However, the 20-year time horizon and dual-income stability suggest room to increase equity to 40% once the mortgage drops below $500K (est. 2031). Flag for 2028 IPS review. The healthcare sector ESG exclusion narrows international equity choices — use ex-Healthcare ETFs for the 15% international sleeve.'
    },

    'DEL-003': {
      client: 'Kevin Park',
      fundingMethod: 'Monthly Auto-Pay (ACH)',
      bankName: 'Chase Bank',
      accountLast4: '2294',
      routingLast4: '0021',
      initialPremium: '$266.67/mo',
      premiumMode: 'Monthly',
      nextDueDate: 'May 1, 2026',
      autoPayStatus: 'Enrolled',
      autoPayConfirm: 'Apr 1, 2026',
      fundingStatus: 'Pending Verification',
      fundingStatusCode: 'pending',
      fundingChecklist: [
        { label: 'Monthly auto-pay set up ($266.67/mo)',          done: true  },
        { label: 'ACH enrollment submitted to carrier',           done: true  },
        { label: 'Bank account micro-deposit pending',            done: false },
        { label: 'Payment confirmation sent to client',           done: false },
        { label: 'Premium receipt uploaded to CRM',               done: false },
        { label: 'Monthly reminder set in calendar',              done: false }
      ],
      hasIPS: false,
      ipsStatus: 'Not Started',
      ipsStatusCode: 'not-started',
      ipsVersion: '—',
      ipsDate: '—',
      riskProfile: 'Not Assessed',
      riskScore: null,
      timeHorizon: '20 years (term aligned)',
      liquidityNeeds: '—',
      taxSituation: '—',
      esgPreference: '—',
      targetAllocation: [],
      rebalanceFreq: '—',
      benchmarks: [],
      ipsNarrative: 'IPS not yet initiated. Delivery meeting must occur first. Risk questionnaire to be completed at or after delivery appointment.',
      ipsChecklist: [
        { label: 'Risk questionnaire completed',                      done: false },
        { label: 'Investment objectives documented',                   done: false },
        { label: 'Target allocation approved by client',              done: false },
        { label: 'IPS draft reviewed with compliance',                done: false },
        { label: 'Client signature obtained on IPS',                  done: false },
        { label: 'IPS filed in CRM / document vault',                 done: false }
      ],
      aiInsight: '⚡ URGENT: ACH micro-deposit verification is outstanding — confirm bank details at delivery meeting. IPS cannot be initiated until delivery is complete. Given Kevin\'s age (29) and 20-year term, expected risk profile is Aggressive Growth (est. score 70+). Prepare growth-oriented allocation draft to present at delivery meeting.'
    },

    'DEL-R1': {
      client: 'Sandra Williams',
      fundingMethod: 'Semi-Annual Auto-Pay (ACH)',
      bankName: 'Wells Fargo',
      accountLast4: '5567',
      routingLast4: '0141',
      initialPremium: '$3,200.00 (semi-annual)',
      premiumMode: 'Semi-Annual',
      nextDueDate: 'Sep 28, 2026',
      autoPayStatus: 'Enrolled',
      autoPayConfirm: 'Mar 28, 2026',
      fundingStatus: 'Confirmed',
      fundingStatusCode: 'confirmed',
      fundingChecklist: [
        { label: 'Initial semi-annual premium collected ($3,200)',  done: true  },
        { label: 'ACH auto-pay enrolled in carrier portal',         done: true  },
        { label: 'Bank account verified (micro-deposit)',            done: true  },
        { label: 'Payment confirmation sent to client',              done: true  },
        { label: 'Premium receipt uploaded to CRM',                  done: true  },
        { label: 'Semi-annual reminder set (Sep 28, 2026)',          done: true  }
      ],
      hasIPS: true,
      ipsStatus: 'Approved',
      ipsStatusCode: 'approved',
      ipsVersion: '2.3 — Final (Updated)',
      ipsDate: 'Mar 30, 2026',
      riskProfile: 'Income & Preservation',
      riskScore: 28,
      timeHorizon: '10–15 years (pre-retirement)',
      liquidityNeeds: 'High — retirement income planning begins 2031',
      taxSituation: 'Transitioning to retirement — tax bracket reduction anticipated 2031',
      esgPreference: 'Socially Responsible (SRI) — broad screen',
      targetAllocation: [
        { label: 'U.S. Large Cap Equity',   pct: 20, color: '#003087' },
        { label: 'International Equity',    pct: 10, color: '#2563eb' },
        { label: 'Fixed Income / Bonds',    pct: 50, color: '#059669' },
        { label: 'Real Estate (REIT)',       pct: 5,  color: '#7c3aed' },
        { label: 'Cash / Money Market',     pct: 15, color: '#ea580c' }
      ],
      rebalanceFreq: 'Quarterly',
      benchmarks: ['Bloomberg U.S. Aggregate Bond Index', 'MSCI World SRI Index'],
      ipsNarrative: 'Sandra Williams, 58 — IPS version 2.3 reflects an updated conservative allocation as she approaches retirement (2031 target). The term conversion policy provides guaranteed death benefit through her high-earning final years. IPS prioritizes capital preservation and income generation. Quarterly rebalancing maintains alignment with SRI mandate and pre-retirement glide path.',
      ipsChecklist: [
        { label: 'Risk questionnaire completed (score: 28/100)',       done: true  },
        { label: 'Investment objectives documented',                    done: true  },
        { label: 'Target allocation approved by client',               done: true  },
        { label: 'IPS draft reviewed with compliance',                 done: true  },
        { label: 'Client signature obtained on IPS',                   done: true  },
        { label: 'IPS filed in CRM / document vault',                  done: true  }
      ],
      aiInsight: 'Sandra\'s pre-retirement profile (score 28) is well-calibrated. With 5 years to retirement, the 50% bond allocation creates a natural income bridge. Consider shifting 5% from Cash to Short-Duration Bond ETFs to improve yield without increasing duration risk. Flag for Q3 2026 quarterly review — assess Social Security timing strategy (age 62 vs 67 breakeven analysis).'
    },

    'DEL-R2': {
      client: 'James Whitfield',
      fundingMethod: 'Annual Wire Transfer',
      bankName: 'Citibank Private Bank',
      accountLast4: '9901',
      routingLast4: '0089',
      initialPremium: '$12,400.00',
      premiumMode: 'Annual',
      nextDueDate: 'Jan 15, 2027',
      autoPayStatus: 'Manual (Wire)',
      autoPayConfirm: 'Jan 15, 2026',
      fundingStatus: 'Confirmed',
      fundingStatusCode: 'confirmed',
      fundingChecklist: [
        { label: 'Initial annual premium collected ($12,400)',     done: true  },
        { label: 'Wire transfer confirmed by carrier',             done: true  },
        { label: 'Private bank relationship manager notified',     done: true  },
        { label: 'Premium receipt uploaded to CRM',                done: true  },
        { label: 'Payment confirmation sent to client',            done: true  },
        { label: 'Annual wire reminder set (Jan 1, 2027)',         done: true  }
      ],
      hasIPS: true,
      ipsStatus: 'Approved',
      ipsStatusCode: 'approved',
      ipsVersion: '3.1 — Final',
      ipsDate: 'Jan 16, 2026',
      riskProfile: 'Aggressive Growth',
      riskScore: 81,
      timeHorizon: '15+ years',
      liquidityNeeds: 'Low — significant liquid assets held at Citibank Private',
      taxSituation: 'Complex — trust structures, multiple entities, estate planning active',
      esgPreference: 'No ESG screen — returns-focused',
      targetAllocation: [
        { label: 'U.S. Large Cap Equity',   pct: 45, color: '#003087' },
        { label: 'International Equity',    pct: 25, color: '#2563eb' },
        { label: 'Fixed Income / Bonds',    pct: 15, color: '#059669' },
        { label: 'Real Estate (REIT)',       pct: 10, color: '#7c3aed' },
        { label: 'Cash / Money Market',     pct: 5,  color: '#ea580c' }
      ],
      rebalanceFreq: 'Quarterly',
      benchmarks: ['S&P 500', 'MSCI ACWI', 'Bloomberg U.S. Aggregate Bond Index'],
      ipsNarrative: 'James Whitfield, 52, CEO — high-risk-capacity profile (score 81) supported by significant liquidity at Citibank Private. The Whole Life Participating policy ($500K + PUA rider) serves as the conservative anchor of a predominantly equity-heavy portfolio. IPS coordinates with Whitfield Family Trust estate plan. LTC rider activates as a separate asset class consideration post-age 65. Quarterly rebalancing aligned with corporate fiscal quarters.',
      ipsChecklist: [
        { label: 'Risk questionnaire completed (score: 81/100)',       done: true  },
        { label: 'Investment objectives documented',                    done: true  },
        { label: 'Target allocation approved by client',               done: true  },
        { label: 'IPS draft reviewed with compliance',                 done: true  },
        { label: 'Client signature obtained on IPS',                   done: true  },
        { label: 'IPS filed in CRM / document vault',                  done: true  }
      ],
      aiInsight: 'James\'s aggressive profile (score 81) with 15+ year horizon supports the current 70% equity tilt. The Whole Life cash value ($180K+ projected by year 10) functions as bond-equivalent ballast — effectively bringing true portfolio equity exposure to ~65% when insurance asset is included. Recommend presenting this blended view at January 2027 annual review. Also: coordinate IPS update with estate attorney re: Whitfield Family Trust beneficiary designation review.'
    }
  };

  /* ── 2. HELPER — SVG DONUT RING ─────────────────────────────────────── */
  function _afRing(score, max, color, size) {
    if (score === null) {
      return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 60 60">' +
        '<circle cx="30" cy="30" r="24" fill="none" stroke="#e2e8f0" stroke-width="6"/>' +
        '<text x="30" y="35" text-anchor="middle" font-size="11" fill="#94a3b8">N/A</text>' +
        '</svg>';
    }
    var r = 24, circ = 2 * Math.PI * r;
    var pct = score / max;
    var dash = pct * circ;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 60 60" style="transform:rotate(-90deg)">' +
      '<circle cx="30" cy="30" r="' + r + '" fill="none" stroke="#e2e8f0" stroke-width="6"/>' +
      '<circle cx="30" cy="30" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="6"' +
        ' stroke-dasharray="' + dash.toFixed(1) + ' ' + circ.toFixed(1) + '"' +
        ' stroke-linecap="round"/>' +
      '<text x="30" y="35" text-anchor="middle" font-size="13" font-weight="700" fill="' + color + '"' +
        ' style="transform:rotate(90deg) translate(0px,-60px)">' + score + '</text>' +
      '</svg>';
  }

  /* ── 3. BUILD ALLOCATION BAR CHART ──────────────────────────────────── */
  function _afAllocBars(alloc) {
    if (!alloc || alloc.length === 0) {
      return '<div class="af-no-alloc"><i class="fas fa-chart-pie"></i> Allocation not yet defined</div>';
    }
    return alloc.map(function (a) {
      return '<div class="af-alloc-row">' +
        '<div class="af-alloc-label">' + a.label + '</div>' +
        '<div class="af-alloc-bar-wrap">' +
          '<div class="af-alloc-bar-fill" style="width:' + a.pct + '%;background:' + a.color + '"></div>' +
        '</div>' +
        '<div class="af-alloc-pct">' + a.pct + '%</div>' +
      '</div>';
    }).join('');
  }

  /* ── 4. BUILD CHECKLIST HTML ─────────────────────────────────────────── */
  function _afChecklist(items) {
    return items.map(function (item) {
      return '<div class="af-check-row ' + (item.done ? 'done' : '') + '">' +
        '<i class="fas ' + (item.done ? 'fa-check-square' : 'fa-square') + ' af-check-icon"></i>' +
        '<span class="af-check-label">' + item.label + '</span>' +
      '</div>';
    }).join('');
  }

  /* ── 5. FUNDING STATUS BADGE ─────────────────────────────────────────── */
  function _afStatusBadge(code, text) {
    var cls = { confirmed: 'af-badge-confirmed', pending: 'af-badge-pending', failed: 'af-badge-failed' };
    var icon = { confirmed: 'fa-check-circle', pending: 'fa-clock', failed: 'fa-times-circle' };
    return '<span class="af-status-badge ' + (cls[code] || 'af-badge-pending') + '">' +
      '<i class="fas ' + (icon[code] || 'fa-clock') + '"></i> ' + text + '</span>';
  }

  /* ── 6. IPS STATUS BADGE ─────────────────────────────────────────────── */
  function _ipsStatusBadge(code, text) {
    var cls = { approved: 'ips-badge-approved', draft: 'ips-badge-draft', 'not-started': 'ips-badge-ns' };
    var icon = { approved: 'fa-check-circle', draft: 'fa-edit', 'not-started': 'fa-minus-circle' };
    return '<span class="ips-status-badge ' + (cls[code] || 'ips-badge-ns') + '">' +
      '<i class="fas ' + (icon[code] || 'fa-minus-circle') + '"></i> ' + text + '</span>';
  }

  /* ── 7. MAIN RENDER — FUNDING & IPS TAB PANEL ───────────────────────── */
  function _p6TabFunding(d) {
    var af = _afData[d.id];
    if (!af) {
      return '<div class="af-empty"><i class="fas fa-info-circle"></i> No funding or IPS data available for this record.</div>';
    }

    /* ── funding progress ── */
    var fDone  = af.fundingChecklist.filter(function (x) { return x.done; }).length;
    var fTotal = af.fundingChecklist.length;
    var fPct   = Math.round((fDone / fTotal) * 100);
    var fPctColor = fPct === 100 ? '#059669' : af.fundingStatusCode === 'pending' ? '#ea580c' : '#3b82f6';

    /* ── IPS checklist progress ── */
    var iDone  = af.ipsChecklist.filter(function (x) { return x.done; }).length;
    var iTotal = af.ipsChecklist.length;
    var iPct   = Math.round((iDone / iTotal) * 100);

    /* ── risk score color ── */
    var rsColor = af.riskScore === null ? '#94a3b8'
      : af.riskScore >= 70 ? '#dc2626'
      : af.riskScore >= 45 ? '#ea580c'
      : '#059669';

    /* ── KPI strip ── */
    var kpiHtml =
      '<div class="af-kpi-strip">' +
        '<div class="af-kpi-card">' +
          '<div class="af-kpi-icon" style="background:#eff6ff;color:#003087"><i class="fas fa-dollar-sign"></i></div>' +
          '<div class="af-kpi-body"><div class="af-kpi-val" style="color:#003087">' + af.initialPremium + '</div><div class="af-kpi-lbl">Initial Premium</div></div>' +
        '</div>' +
        '<div class="af-kpi-card">' +
          '<div class="af-kpi-icon" style="background:#f0fdf4;color:#059669"><i class="fas fa-university"></i></div>' +
          '<div class="af-kpi-body"><div class="af-kpi-val" style="color:#059669">' + af.bankName + '</div><div class="af-kpi-lbl">Funding Bank</div></div>' +
        '</div>' +
        '<div class="af-kpi-card">' +
          '<div class="af-kpi-icon" style="background:#fef9c3;color:#b45309"><i class="fas fa-calendar-alt"></i></div>' +
          '<div class="af-kpi-body"><div class="af-kpi-val" style="color:#b45309">' + af.nextDueDate + '</div><div class="af-kpi-lbl">Next Premium Due</div></div>' +
        '</div>' +
        '<div class="af-kpi-card">' +
          '<div class="af-kpi-icon" style="background:#f5f3ff;color:#7c3aed"><i class="fas fa-chart-line"></i></div>' +
          '<div class="af-kpi-body"><div class="af-kpi-val" style="color:#7c3aed">' + (af.riskScore !== null ? af.riskScore + '/100' : 'Pending') + '</div><div class="af-kpi-lbl">IPS Risk Score</div></div>' +
        '</div>' +
      '</div>';

    /* ── Section A: Account Funding ── */
    var fundingHtml =
      '<div class="af-section">' +
        '<div class="af-section-hdr"><i class="fas fa-dollar-sign"></i> Account Funding ' + _afStatusBadge(af.fundingStatusCode, af.fundingStatus) + '</div>' +
        '<div class="af-two-col">' +

          /* left: funding details */
          '<div class="af-col">' +
            '<div class="af-detail-grid">' +
              '<div class="af-detail-row"><span class="af-detail-key">Method</span><span class="af-detail-val">' + af.fundingMethod + '</span></div>' +
              '<div class="af-detail-row"><span class="af-detail-key">Bank</span><span class="af-detail-val">' + af.bankName + '</span></div>' +
              '<div class="af-detail-row"><span class="af-detail-key">Account</span><span class="af-detail-val">···· ' + af.accountLast4 + '</span></div>' +
              '<div class="af-detail-row"><span class="af-detail-key">Routing</span><span class="af-detail-val">···· ' + af.routingLast4 + '</span></div>' +
              '<div class="af-detail-row"><span class="af-detail-key">Premium</span><span class="af-detail-val">' + af.initialPremium + '</span></div>' +
              '<div class="af-detail-row"><span class="af-detail-key">Mode</span><span class="af-detail-val">' + af.premiumMode + '</span></div>' +
              '<div class="af-detail-row"><span class="af-detail-key">Auto-Pay</span><span class="af-detail-val">' + af.autoPayStatus + '</span></div>' +
              '<div class="af-detail-row"><span class="af-detail-key">Confirmed</span><span class="af-detail-val">' + af.autoPayConfirm + '</span></div>' +
              '<div class="af-detail-row"><span class="af-detail-key">Next Due</span><span class="af-detail-val"><strong>' + af.nextDueDate + '</strong></span></div>' +
            '</div>' +
          '</div>' +

          /* right: funding checklist + progress */
          '<div class="af-col">' +
            '<div class="af-sub-hdr"><i class="fas fa-tasks"></i> Funding Checklist</div>' +
            '<div class="af-prog-row">' +
              '<div class="af-prog-track"><div class="af-prog-fill" style="width:' + fPct + '%;background:' + fPctColor + '"></div></div>' +
              '<span class="af-prog-lbl">' + fPct + '% complete (' + fDone + '/' + fTotal + ')</span>' +
            '</div>' +
            '<div class="af-checklist">' + _afChecklist(af.fundingChecklist) + '</div>' +
          '</div>' +

        '</div>' +
      '</div>';

    /* ── Section B: IPS ── */
    var allocHtml = _afAllocBars(af.targetAllocation);
    var benchHtml = af.benchmarks.length
      ? af.benchmarks.map(function (b) { return '<span class="af-bench-chip">' + b + '</span>'; }).join('')
      : '<span class="af-bench-chip af-bench-na">Not defined</span>';

    var ipsHtml =
      '<div class="af-section">' +
        '<div class="af-section-hdr"><i class="fas fa-file-contract"></i> Investment Policy Statement (IPS) ' + _ipsStatusBadge(af.ipsStatusCode, af.ipsStatus) + '</div>' +

        /* IPS meta row */
        '<div class="af-ips-meta">' +
          '<div class="af-ips-meta-item"><span class="af-detail-key">Version</span><span class="af-detail-val">' + af.ipsVersion + '</span></div>' +
          '<div class="af-ips-meta-item"><span class="af-detail-key">Date</span><span class="af-detail-val">' + af.ipsDate + '</span></div>' +
          '<div class="af-ips-meta-item"><span class="af-detail-key">Risk Profile</span><span class="af-detail-val">' + af.riskProfile + '</span></div>' +
          '<div class="af-ips-meta-item"><span class="af-detail-key">Time Horizon</span><span class="af-detail-val">' + af.timeHorizon + '</span></div>' +
          '<div class="af-ips-meta-item"><span class="af-detail-key">Rebalance</span><span class="af-detail-val">' + af.rebalanceFreq + '</span></div>' +
          '<div class="af-ips-meta-item"><span class="af-detail-key">ESG</span><span class="af-detail-val">' + af.esgPreference + '</span></div>' +
        '</div>' +

        /* IPS body: risk ring + allocation + checklist */
        '<div class="af-ips-body">' +

          /* left col: risk ring + narrative + benchmarks */
          '<div class="af-ips-left">' +
            '<div class="af-risk-ring-wrap">' +
              _afRing(af.riskScore, 100, rsColor, 80) +
              '<div class="af-risk-ring-label">' +
                '<div class="af-risk-profile-txt">' + af.riskProfile + '</div>' +
                (af.riskScore !== null ? '<div class="af-risk-score-sub">Score ' + af.riskScore + '/100</div>' : '<div class="af-risk-score-sub">Pending assessment</div>') +
              '</div>' +
            '</div>' +
            '<div class="af-sub-hdr" style="margin-top:14px"><i class="fas fa-bullseye"></i> Benchmarks</div>' +
            '<div class="af-bench-wrap">' + benchHtml + '</div>' +
            '<div class="af-sub-hdr" style="margin-top:14px"><i class="fas fa-align-left"></i> IPS Narrative</div>' +
            '<div class="af-ips-narrative">' + af.ipsNarrative + '</div>' +
          '</div>' +

          /* middle col: target allocation */
          '<div class="af-ips-mid">' +
            '<div class="af-sub-hdr"><i class="fas fa-chart-pie"></i> Target Allocation</div>' +
            '<div class="af-alloc-bars">' + allocHtml + '</div>' +
            '<div class="af-sub-hdr" style="margin-top:16px"><i class="fas fa-info-circle"></i> Additional Details</div>' +
            '<div class="af-detail-grid">' +
              '<div class="af-detail-row"><span class="af-detail-key">Liquidity</span><span class="af-detail-val">' + af.liquidityNeeds + '</span></div>' +
              '<div class="af-detail-row"><span class="af-detail-key">Tax Situation</span><span class="af-detail-val">' + af.taxSituation + '</span></div>' +
            '</div>' +
          '</div>' +

          /* right col: IPS checklist */
          '<div class="af-ips-right">' +
            '<div class="af-sub-hdr"><i class="fas fa-tasks"></i> IPS Checklist</div>' +
            '<div class="af-prog-row">' +
              '<div class="af-prog-track"><div class="af-prog-fill" style="width:' + iPct + '%;background:' + (iPct === 100 ? '#059669' : '#3b82f6') + '"></div></div>' +
              '<span class="af-prog-lbl">' + iPct + '% (' + iDone + '/' + iTotal + ')</span>' +
            '</div>' +
            '<div class="af-checklist">' + _afChecklist(af.ipsChecklist) + '</div>' +
          '</div>' +

        '</div>' +
      '</div>';

    /* ── Section C: AI Insight ── */
    var aiHtml =
      '<div class="af-ai-card">' +
        '<div class="af-ai-hdr"><i class="fas fa-robot"></i> AI Funding & IPS Insight</div>' +
        '<div class="af-ai-body">' + af.aiInsight + '</div>' +
        '<div class="af-ai-actions">' +
          '<button class="af-ai-btn" onclick="_afCopyIPS(\'' + d.id + '\')"><i class="fas fa-copy"></i> Copy IPS Summary</button>' +
          '<button class="af-ai-btn af-ai-btn-outline" onclick="_afOpenIPS(\'' + d.id + '\')"><i class="fas fa-external-link-alt"></i> Open Full IPS</button>' +
        '</div>' +
      '</div>';

    return kpiHtml + fundingHtml + ipsHtml + aiHtml;
  }

  /* ── 8. ACTION HELPERS (toast wrappers) ──────────────────────────────── */
  window._afCopyIPS = function (id) {
    var af = _afData[id];
    if (!af) return;
    _p6Toast('<i class="fas fa-copy"></i> IPS summary for <strong>' + af.client + '</strong> copied — ready to paste into email or compliance vault.', 2800);
  };
  window._afOpenIPS = function (id) {
    var af = _afData[id];
    if (!af) return;
    _p6Toast('<i class="fas fa-external-link-alt"></i> Opening IPS document vault for <strong>' + af.client + '</strong>…', 2000);
  };

  /* ── 9. MONKEY-PATCH p6BuildDetailHTML ───────────────────────────────── */
  /* Add 6th tab button and inject tab panel */
  var _orig_p6BuildDetailHTML = p6BuildDetailHTML;

  p6BuildDetailHTML = function (d) {
    var html = _orig_p6BuildDetailHTML.apply(this, arguments);

    /* Inject 6th tab button into the tab strip */
    var fundingBtn = '<button class="p6-tab-btn' +
      (_p6ActiveTab === 'funding' ? ' active' : '') +
      '" onclick="p6SwitchTab(\'funding\',this)">' +
      '<i class="fas fa-piggy-bank"></i> Funding &amp; IPS</button>';

    /* Inject tab panel */
    var panelHtml = '<div id="p6-tab-funding" class="p6-tab-panel" style="display:' +
      (_p6ActiveTab === 'funding' ? '' : 'none') + '">' +
      _p6TabFunding(d) +
      '</div>';

    /* Insert button before closing </div> of .p6-tabs */
    html = html.replace(/<\/div>\s*<div class="p6-tab-panels">/, fundingBtn + '</div><div class="p6-tab-panels">');

    /* Append panel before closing </div> of .p6-tab-panels */
    html = html.replace(/<\/div>\s*(<div class="p6-timeline-section">)/, panelHtml + '</div>$1');

    return html;
  };

  /* ── 10. MONKEY-PATCH p6SwitchTab ────────────────────────────────────── */
  /* Extend to handle the 'funding' tab key */
  var _orig_p6SwitchTab = p6SwitchTab;

  p6SwitchTab = function (tab, el) {
    _orig_p6SwitchTab.apply(this, arguments);
    /* The original already handles show/hide via getElementById('p6-tab-' + tab) */
    /* Nothing extra needed — the panel id 'p6-tab-funding' matches the pattern */
  };

  /* ── 11. DONE ─────────────────────────────────────────────────────────── */
  console.log('[INV Step 4] Account Funding & IPS tab loaded.');
  console.log('  Deliveries patched: DEL-001, DEL-002, DEL-003, DEL-R1, DEL-R2');
  console.log('  p6BuildDetailHTML patched — 6th tab: Funding & IPS');

})(); // 'INV Step 4 module loaded'
