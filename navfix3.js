
/* ═══════════════════════════════════════════════════════════════════════
   NAVFIX3 — Second-batch broken pages + RFP removal
   
   PAGES FIXED:
   ────────────────────────────────────────────────────────────────────────
   1. ltc-claimant        — call initLtcClaimantPage() + swapRetry
   2. ltc-bre             — inline BRE page (no existing renderer)
   3. insurance-carrier-360  — call initInsuranceCarrier360() + swapRetry
   4. healthcare-provider-360 — call initHealthcareProvider360() + swapRetry
   5. hybrid-ops          — call initHybridOpsPage() + swapRetry
   6. ai-modernization    — call initAiModernizationPage() + swapRetry
   7. hal-policyholder    — write shell + call _p30switchTab('dashboard')
   8. hal-provider-net    — write shell + call _p31switchTab('directory')
   9. hal-workforce       — write shell + call _p32switchTab('capacity')
   10. hal-litigation     — write shell + call _qw1switchTab('heatmap')
   11. hal-interop        — write shell + call _qw2switchTab('fhir')

   RFP REMOVED:
   ────────────────────────────────────────────────────────────────────────
   - Hides the RFP Response Center nav item via DOM query on DOMContentLoaded
     and on every navigateTo call (since nav may re-render).

   ROOT CAUSE NOTES:
   ────────────────────────────────────────────────────────────────────────
   - ltc-claimant/carrier-360/provider-360: NAVFIX Group F delegates to
     _prevNav which eventually calls initXxx() → _ltcBuildPage(tplId, html).
     Content goes into the tpl div but is NEVER copied to #page-content.
     FIX: call init directly + _nf3swapRetry to poll until tpl is filled.

   - hybrid-ops / ai-modernization: enh wrapper calls initXxxPage() → 
     _enh_bld(tplId, html) which writes to tpl div. Same copy-missing bug.
     FIX: call init directly + _nf3swapRetry.

   - hal-policyholder/hal-provider-net/hal-workforce/hal-litigation/hal-interop:
     These pages are NOT in NAVFIX CUSTOM_PAGES. NAVFIX intercepts them,
     tries getElementById('tpl-hal-policyholder') → null → silently returns.
     The P30/P31/P32/qw1/qw2 wrappers (which WRITE to page-content directly)
     sit BELOW NAVFIX in the chain and are never reached.
     FIX: write a minimal page shell directly into #page-content that contains
     the required DOM anchor elements (p30-tab-content etc.), then call the
     already-exposed _p30switchTab/etc. to fill the active tab content.

   - ltc-bre: No renderer exists anywhere in the codebase. nav item links to
     it but no initXxxPage or tpl was ever built. FIX: inline page content.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── save outermost chain (= NAVFIX2 at this point) ── */
  var _nf3Prev = window.navigateTo;

  /* ── P30-P32/qw1-qw2 color tokens (mirroring each phase IIFE) ── */
  var _PS1='#059669', _PS3='#064e3b';   /* P30 Policyholder — green */
  var _PN1='#0891b2', _PN3='#164e63';   /* P31 Provider Net — teal */
  var _WA1='#d97706', _WA3='#78350f';   /* P32 Workforce — amber */
  var _LT1='#dc2626', _LT3='#7f1d1d';   /* qw1 Litigation — red */
  var _IO1='#7c3aed', _IO3='#2e1065';   /* qw2 Interop — violet */

  /* ── Helpers ── */
  function _nf3ui(page, title, bc) {
    var tEl = document.getElementById('page-title');
    var bEl = document.getElementById('page-breadcrumb') ||
              document.getElementById('breadcrumb-page');
    if (tEl) tEl.textContent = title || page;
    if (bEl) bEl.textContent = bc || '';
    document.querySelectorAll('.nav-item').forEach(function(el){ el.classList.remove('active'); });
    var hit = Array.from(document.querySelectorAll('.nav-item')).find(function(el){
      var oc = el.getAttribute('onclick') || '';
      return oc.indexOf("'" + page + "'") !== -1 || oc.indexOf('"' + page + '"') !== -1;
    });
    if (hit) hit.classList.add('active');
  }

  /* poll until tplId has real content, then copy to #page-content */
  function _nf3swapRetry(tplId, maxAttempts, intervalMs) {
    var attempts = 0;
    var max = maxAttempts || 12;
    var iv  = intervalMs  || 150;
    var timer = setInterval(function () {
      attempts++;
      var content = document.getElementById('page-content');
      var tpl     = document.getElementById(tplId);
      if (tpl && tpl.innerHTML.trim().length > 50) {
        if (content) content.innerHTML = tpl.innerHTML;
        clearInterval(timer);
        return;
      }
      if (attempts >= max) {
        /* Last resort: if tpl still empty, try _nf3Prev one more time */
        clearInterval(timer);
      }
    }, iv);
  }

  /* ── Helper: write P3x/qwX minimal page shell then trigger switchTab ── */
  function _nf3buildShell(opts) {
    /*
     * opts = {
     *   tabContainerId : 'p30-tab-content',
     *   switchFn       : '_p30switchTab',
     *   activeTab      : 'dashboard',
     *   color1         : '#059669',
     *   color3         : '#064e3b',
     *   badgeText      : 'PSP',
     *   title          : 'Policyholder Self-Service Portal',
     *   subtitle       : 'EP Status · Document Center · ...',
     *   tabs           : [['dashboard','fa-tachometer-alt','Dashboard'], ...]
     * }
     */
    var pc = document.getElementById('page-content');
    if (!pc) return;

    var tabButtons = opts.tabs.map(function (t) {
      var active = t[0] === opts.activeTab;
      return '<button onclick="window.' + opts.switchFn + '(\'' + t[0] + '\')" '
        + 'style="flex:1;padding:10px 12px;border:none;border-radius:7px;cursor:pointer;'
        + 'font-size:13px;font-weight:600;background:' + (active ? opts.color1 : 'transparent') + ';'
        + 'color:' + (active ? '#fff' : '#6b7280') + ';transition:all .2s">'
        + '<i class="fas ' + t[1] + '" style="margin-right:6px"></i>' + t[2] + '</button>';
    }).join('');

    pc.innerHTML =
      '<div style="font-family:\'Inter\',sans-serif;background:#f8fafc;min-height:100vh;padding:0">'
      + '<div style="background:linear-gradient(135deg,' + opts.color3 + ' 0%,' + opts.color1 + ' 100%);color:#fff;padding:28px 32px">'
      +   '<div style="display:flex;align-items:center;gap:16px;margin-bottom:8px">'
      +     '<div style="background:rgba(255,255,255,.18);border-radius:10px;padding:10px 16px;font-weight:800;font-size:16px">' + opts.badgeText + '</div>'
      +     '<div>'
      +       '<h1 style="font-size:22px;font-weight:800;margin:0">' + opts.title + '</h1>'
      +       '<p style="font-size:13px;opacity:.85;margin:4px 0 0">' + opts.subtitle + '</p>'
      +     '</div>'
      +   '</div>'
      + '</div>'
      + '<div style="padding:24px 32px">'
      +   '<div style="display:flex;gap:4px;margin-bottom:24px;background:#fff;border-radius:10px;padding:6px;box-shadow:0 1px 4px rgba(0,0,0,.08)">'
      +     tabButtons
      +   '</div>'
      +   '<div id="' + opts.tabContainerId + '">'
      +     '<div style="text-align:center;padding:60px 20px;color:#6b7280;">'
      +       '<i class="fas fa-circle-notch fa-spin" style="font-size:28px;margin-bottom:12px;display:block;color:' + opts.color1 + '"></i>'
      +       'Loading ' + opts.title + '...'
      +     '</div>'
      +   '</div>'
      + '</div>'
      + '</div>';

    /* Trigger the switchTab to fill content */
    setTimeout(function () {
      if (typeof window[opts.switchFn] === 'function') {
        window[opts.switchFn](opts.activeTab);
      }
    }, 80);
  }

  /* ── Remove RFP Response Center nav item ── */
  function _nf3removeRfp() {
    document.querySelectorAll('.nav-item, a[class*="nav"]').forEach(function (el) {
      var txt = el.textContent || '';
      var oc  = el.getAttribute('onclick') || '';
      if (txt.indexOf('RFP Response') !== -1 || oc.indexOf('rfp-showcase') !== -1) {
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /* Run RFP removal now (in case nav already exists) and after DOM ready */
  if (document.readyState !== 'loading') {
    _nf3removeRfp();
  } else {
    document.addEventListener('DOMContentLoaded', _nf3removeRfp);
  }

  /* ═══════════════════════════════════════════════════════════════════
     MAIN navigateTo WRAPPER
  ═══════════════════════════════════════════════════════════════════ */
  window.navigateTo = function (page, opts) {

    /* Always remove RFP nav on every navigation */
    setTimeout(_nf3removeRfp, 50);
    setTimeout(_nf3removeRfp, 350);

    /* ── 1. ltc-claimant ── */
    if (page === 'ltc-claimant') {
      _nf3ui(page, 'Claimant 360°', 'Home / LTC Operations / Claimant 360');
      requestAnimationFrame(function () {
        setTimeout(function () {
          if (typeof window.initLtcClaimantPage === 'function') {
            window.initLtcClaimantPage();
          }
          _nf3swapRetry('tpl-ltc-claimant', 14, 130);
        }, 60);
      });
      return;
    }

    /* ── 2. ltc-bre (Business Rules Engine — no native renderer, build inline) ── */
    if (page === 'ltc-bre') {
      _nf3ui(page, 'Business Rules Engine', 'Home / LTC Operations / Business Rules Engine');
      var pc = document.getElementById('page-content');
      if (pc) {
        pc.innerHTML =
          '<div style="font-family:\'Inter\',sans-serif;padding:24px">'
          /* Header */
          + '<div style="background:linear-gradient(135deg,#4c1d95,#7c3aed);color:#fff;border-radius:14px;padding:22px 28px;margin-bottom:24px">'
          +   '<div style="display:flex;align-items:center;gap:14px">'
          +     '<div style="background:rgba(255,255,255,.18);border-radius:10px;padding:10px 16px;font-weight:800;font-size:15px">BRE</div>'
          +     '<div>'
          +       '<h1 style="font-size:21px;font-weight:800;margin:0">SMARTS Business Rules Engine</h1>'
          +       '<p style="font-size:13px;opacity:.85;margin:4px 0 0">Sparkling Logic SMARTS — Auto-adjudication rules engine integrated with LTCAS, eLTCAS &amp; LTC Claims</p>'
          +     '</div>'
          +   '</div>'
          + '</div>'
          /* KPI row */
          + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px">'
          + _nf3kpi('847', 'Active Rules', 'fa-cogs', '#7c3aed', 'Auto-adjudication logic')
          + _nf3kpi('94.2%', 'STP Rate', 'fa-robot', '#059669', 'Straight-through processing')
          + _nf3kpi('12ms', 'Avg Rule Eval Time', 'fa-bolt', '#0891b2', 'Per claim decision')
          + _nf3kpi('3', 'Pending Changes', 'fa-exclamation-circle', '#d97706', 'Awaiting approval')
          + '</div>'
          /* Rule categories */
          + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">'
          +   _nf3ruleCategory('Eligibility Rules', '#7c3aed', [
                ['ADL Assessment Score ≥ 2', 'Active', 'Critical'],
                ['90-day Elimination Period — Satisfied', 'Active', 'High'],
                ['Policy in Force — Premium Current', 'Active', 'Critical'],
                ['LTCAS Eligibility Decision = Approved', 'Active', 'High'],
                ['Care Setting Authorized by UW', 'Active', 'Medium']
              ])
          +   _nf3ruleCategory('Payment Calculation Rules', '#0891b2', [
                ['Daily Benefit Amount × Care Days', 'Active', 'Critical'],
                ['Inflation Protection Rider Applied', 'Active', 'High'],
                ['Coordination of Benefits — Medicare Primary', 'Active', 'High'],
                ['Max Monthly Benefit Cap Enforced', 'Active', 'Medium'],
                ['Shared Care Rider — Balance Check', 'Active', 'Low']
              ])
          +   _nf3ruleCategory('Fraud Detection Rules', '#dc2626', [
                ['Provider Billing Frequency Anomaly > 2σ', 'Active', 'High'],
                ['Duplicate Claim — Same Date/Provider', 'Active', 'Critical'],
                ['CMS Excluded Provider List Check', 'Active', 'Critical'],
                ['ADL Score Inconsistency Flag', 'Active', 'High'],
                ['Billing Amount vs Care Plan Mismatch', 'Active', 'Medium']
              ])
          +   _nf3ruleCategory('Compliance Rules', '#d97706', [
                ['State Regulatory Filing — 30-day Deadline', 'Active', 'High'],
                ['NAIC LTC Model Regulation Compliance', 'Active', 'Critical'],
                ['HIPAA PHI Audit Trail Required', 'Active', 'Critical'],
                ['Prior Authorization — SNF Stays > 30d', 'Active', 'Medium'],
                ['Care Plan Review — 90-day Renewal', 'Active', 'Low']
              ])
          + '</div>'
          /* Recent decisions */
          + '<div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:18px">'
          +   '<div style="font-size:15px;font-weight:800;color:#111827;margin-bottom:14px;display:flex;align-items:center;gap:8px">'
          +     '<i class="fas fa-history" style="color:#7c3aed"></i> Recent Auto-Adjudication Decisions — Last 24 Hours</div>'
          +   '<table style="width:100%;border-collapse:collapse">'
          +   '<thead><tr style="background:#f8fafc">'
          +     '<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase">Claim ID</th>'
          +     '<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase">Claimant</th>'
          +     '<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase">Rules Triggered</th>'
          +     '<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase">Decision</th>'
          +     '<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase">Eval Time</th>'
          +   '</tr></thead><tbody>'
          +   _nf3adjRow('LTC-2026-0312','Eleanor Vasquez','ADL≥2 ✓ · ELP Satisfied ✓ · Provider OK ✓','Auto-Approved','9ms','#059669')
          +   _nf3adjRow('LTC-2026-0311','Marcus Delgado','ADL≥2 ✓ · Premium Lapse ✗','Denied — Premium','14ms','#dc2626')
          +   _nf3adjRow('LTC-2026-0310','Patricia O\'Brien','ADL≥2 ✓ · Billing Freq Anomaly ✗','Flagged — Fraud Review','11ms','#d97706')
          +   _nf3adjRow('LTC-2026-0309','Harold Steinberg','All Eligibility ✓ · CoB Applied ✓','Auto-Approved','8ms','#059669')
          +   _nf3adjRow('LTC-2026-0308','Clara Hutchinson','ADL Score Inconsistency ✗','Pended — Clinical Review','16ms','#0891b2')
          +   '</tbody></table>'
          + '</div>'
          + '</div>';
      }
      return;
    }

    /* ── 3. insurance-carrier-360 ── */
    if (page === 'insurance-carrier-360') {
      _nf3ui(page, 'Insurance Carrier 360°', 'Home / LTC Operations / Insurance Carrier 360');
      requestAnimationFrame(function () {
        setTimeout(function () {
          if (typeof window.initInsuranceCarrier360 === 'function') {
            window.initInsuranceCarrier360();
          }
          _nf3swapRetry('tpl-insurance-carrier-360', 14, 130);
        }, 60);
      });
      return;
    }

    /* ── 4. healthcare-provider-360 ── */
    if (page === 'healthcare-provider-360') {
      _nf3ui(page, 'Healthcare Provider 360°', 'Home / LTC Operations / Healthcare Provider 360');
      requestAnimationFrame(function () {
        setTimeout(function () {
          if (typeof window.initHealthcareProvider360 === 'function') {
            window.initHealthcareProvider360();
          }
          _nf3swapRetry('tpl-healthcare-provider-360', 14, 130);
        }, 60);
      });
      return;
    }

    /* ── 5. hybrid-ops ── */
    if (page === 'hybrid-ops') {
      _nf3ui(page, 'Hybrid LTC+HAL Hub', 'Home / Hybrid Intelligence / Hybrid Hub');
      requestAnimationFrame(function () {
        setTimeout(function () {
          if (typeof window.initHybridOpsPage === 'function') {
            window.initHybridOpsPage();
          }
          _nf3swapRetry('tpl-hybrid-ops', 14, 130);
        }, 60);
      });
      return;
    }

    /* ── 6. ai-modernization ── */
    if (page === 'ai-modernization') {
      _nf3ui(page, 'AI Modernization', 'Home / AI Modernization');
      requestAnimationFrame(function () {
        setTimeout(function () {
          if (typeof window.initAiModernizationPage === 'function') {
            window.initAiModernizationPage();
          }
          _nf3swapRetry('tpl-ai-modernization', 14, 130);
        }, 60);
      });
      return;
    }

    /* ── 7. hal-policyholder (P30 — Policyholder Self-Service Portal) ── */
    if (page === 'hal-policyholder') {
      _nf3ui(page, 'Policyholder Self-Service Portal', 'Home / Hybrid Intelligence / Policyholder');
      _nf3buildShell({
        tabContainerId: 'p30-tab-content',
        switchFn:       '_p30switchTab',
        activeTab:      'dashboard',
        color1:         _PS1,
        color3:         _PS3,
        badgeText:      'PSP',
        title:          'Policyholder Self-Service Portal',
        subtitle:       'EP Status &bull; Document Center &bull; Benefit Tracking &bull; Care Plan Management &bull; Assessment Requests',
        tabs: [
          ['dashboard',  'fa-tachometer-alt', 'Dashboard'],
          ['documents',  'fa-file-alt',       'Document Center'],
          ['benefits',   'fa-dollar-sign',    'Benefit Tracker'],
          ['careplan',   'fa-heartbeat',      'Care Plan & Assessments']
        ]
      });
      return;
    }

    /* ── 8. hal-provider-net (P31 — Provider Network Intelligence) ── */
    if (page === 'hal-provider-net') {
      _nf3ui(page, 'Provider Network Intelligence', 'Home / Hybrid Intelligence / Provider Network');
      _nf3buildShell({
        tabContainerId: 'p31-tab-content',
        switchFn:       '_p31switchTab',
        activeTab:      'directory',
        color1:         _PN1,
        color3:         _PN3,
        badgeText:      'PNI',
        title:          'Provider Network Intelligence',
        subtitle:       'Provider Directory &bull; EVV Compliance &bull; Quality Scorecard &bull; Contract Management',
        tabs: [
          ['directory',  'fa-hospital',    'Provider Directory'],
          ['evv',        'fa-mobile-alt',  'EVV Compliance'],
          ['quality',    'fa-star',        'Quality Scorecard'],
          ['contracts',  'fa-file-contract','Contracts']
        ]
      });
      return;
    }

    /* ── 9. hal-workforce (P32 — Workforce & Staffing Analytics) ── */
    if (page === 'hal-workforce') {
      _nf3ui(page, 'Workforce & Capacity Analytics', 'Home / Hybrid Intelligence / Workforce');
      _nf3buildShell({
        tabContainerId: 'p32-tab-content',
        switchFn:       '_p32switchTab',
        activeTab:      'capacity',
        color1:         _WA1,
        color3:         _WA3,
        badgeText:      'WFA',
        title:          'Workforce & Staffing Analytics',
        subtitle:       'Adjuster Capacity &bull; Staffing Model &bull; Training Pipeline &bull; Carrier Intelligence',
        tabs: [
          ['capacity',  'fa-users',        'Adjuster Capacity'],
          ['staffing',  'fa-chart-bar',    'Staffing Model'],
          ['training',  'fa-graduation-cap','Training Pipeline'],
          ['carriers',  'fa-building',     'Carrier Intelligence']
        ]
      });
      return;
    }

    /* ── 10. hal-litigation (qw1 — Litigation Risk Heatmap) ── */
    if (page === 'hal-litigation') {
      _nf3ui(page, 'Litigation & SIU Intelligence', 'Home / Hybrid Intelligence / Litigation');
      _nf3buildShell({
        tabContainerId: 'qw1-tab-content',
        switchFn:       '_qw1switchTab',
        activeTab:      'heatmap',
        color1:         _LT1,
        color3:         _LT3,
        badgeText:      'LIT',
        title:          'Litigation Risk & SIU Intelligence',
        subtitle:       'Risk Heatmap &bull; Open Matters &bull; SIU Referrals &bull; External Counsel',
        tabs: [
          ['heatmap',   'fa-fire',         'Risk Heatmap'],
          ['matters',   'fa-gavel',        'Open Matters'],
          ['siu',       'fa-shield-alt',   'SIU Referrals'],
          ['counsel',   'fa-user-tie',     'External Counsel']
        ]
      });
      return;
    }

    /* ── 11. hal-interop (qw2 — Interoperability Hub) ── */
    if (page === 'hal-interop') {
      _nf3ui(page, 'Interoperability & FHIR Hub', 'Home / Hybrid Intelligence / Interop');
      _nf3buildShell({
        tabContainerId: 'qw2-tab-content',
        switchFn:       '_qw2switchTab',
        activeTab:      'fhir',
        color1:         _IO1,
        color3:         _IO3,
        badgeText:      'IOP',
        title:          'Interoperability & FHIR Hub',
        subtitle:       'FHIR R4 APIs &bull; HL7 Integration &bull; EDI Pipelines &bull; Partner Connections',
        tabs: [
          ['fhir',      'fa-exchange-alt', 'FHIR R4 APIs'],
          ['hl7',       'fa-plug',         'HL7 Integration'],
          ['edi',       'fa-file-code',    'EDI Pipelines'],
          ['partners',  'fa-handshake',    'Partner Connections']
        ]
      });
      return;
    }

    /* ── DEFAULT: pass everything else to the existing chain ── */
    if (typeof _nf3Prev === 'function') _nf3Prev(page, opts);
  };

  /* Keep bare global in sync */
  var navigateTo = window.navigateTo;

  /* ── BRE inline helper functions ── */
  function _nf3kpi(val, lbl, icon, color, sub) {
    return '<div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;">'
      + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">'
      +   '<div style="width:28px;height:28px;background:' + color + '18;border-radius:7px;display:flex;align-items:center;justify-content:center;">'
      +     '<i class="fas ' + icon + '" style="color:' + color + ';font-size:13px;"></i></div>'
      +   '<div style="font-size:20px;font-weight:800;color:#111827;">' + val + '</div>'
      + '</div>'
      + '<div style="font-size:12px;font-weight:600;color:#374151;">' + lbl + '</div>'
      + '<div style="font-size:11px;color:#9ca3af;">' + sub + '</div>'
      + '</div>';
  }

  function _nf3ruleCategory(title, color, rules) {
    var rows = rules.map(function (r) {
      var pColor = r[2]==='Critical'?'#dc2626':r[2]==='High'?'#d97706':r[2]==='Medium'?'#0891b2':'#6b7280';
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid #f3f4f6;">'
        + '<div style="font-size:12px;color:#374151;">' + r[0] + '</div>'
        + '<div style="display:flex;gap:6px;align-items:center;">'
        +   '<span style="background:#dcfce7;color:#059669;border-radius:8px;padding:2px 8px;font-size:10px;font-weight:700;">' + r[1] + '</span>'
        +   '<span style="background:' + pColor + '15;color:' + pColor + ';border-radius:8px;padding:2px 8px;font-size:10px;font-weight:700;">' + r[2] + '</span>'
        + '</div>'
        + '</div>';
    }).join('');
    return '<div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px;">'
      + '<div style="font-size:13px;font-weight:800;color:#111827;margin-bottom:12px;display:flex;align-items:center;gap:8px;">'
      +   '<i class="fas fa-tag" style="color:' + color + '"></i> ' + title + '</div>'
      + rows
      + '</div>';
  }

  function _nf3adjRow(claimId, name, rules, decision, time, color) {
    return '<tr style="border-bottom:1px solid #f3f4f6;">'
      + '<td style="padding:10px 12px;font-size:12px;font-weight:700;color:#003087;">' + claimId + '</td>'
      + '<td style="padding:10px 12px;font-size:12px;color:#374151;">' + name + '</td>'
      + '<td style="padding:10px 12px;font-size:11px;color:#6b7280;">' + rules + '</td>'
      + '<td style="padding:10px 12px;"><span style="background:' + color + '15;color:' + color + ';border-radius:8px;padding:3px 10px;font-size:11px;font-weight:700;">' + decision + '</span></td>'
      + '<td style="padding:10px 12px;font-size:12px;color:#9ca3af;">' + time + '</td>'
      + '</tr>';
  }

  console.log('[NAVFIX3] Installed — fixes: ltc-claimant · ltc-bre · insurance-carrier-360 · healthcare-provider-360 · hybrid-ops · ai-modernization · hal-policyholder · hal-provider-net · hal-workforce · hal-litigation · hal-interop | removed: rfp-showcase nav');
})();
