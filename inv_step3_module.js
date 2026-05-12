/* ═══════════════════════════════════════════════════════════════════
   INV TRACK STEP 3 MODULE
   ① Account Opening tab — Sales page (p4) detail panel, 6th tab
   ② Suitability Review tab — Underwriting page (p5), tab strip above
      the pipeline board switching between Insurance and Investment views
   ═══════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────
     PART A: ACCOUNT OPENING TAB — Sales page (p4) detail panel
     Patches: p4RenderDetailPanel() to inject 6th tab "Account Opening"
              p4SwitchTab() to handle tab id 'account-opening'
     Adds:   _p4TabAccountOpening(p)
     ───────────────────────────────────────────────────────────────── */

  // ── A1. Account opening data per prospect ──────────────────────
  var _aoData = {
    'P4-001': {
      custodian: 'Pershing / BNY Mellon',
      custodianCode: 'PRSH',
      accountTypes: [
        { type: 'Traditional IRA Rollover', code: 'TIRA', selected: true,
          rationale: 'Roll 401(k) ($295K) — broader fund access, lower fees vs employer plan' },
        { type: 'Individual Taxable Brokerage', code: 'TAXB', selected: true,
          rationale: 'Manage $167K existing investments tax-efficiently' },
        { type: 'Short-Term Bond Account', code: 'STBD', selected: true,
          rationale: 'College funding sleeve — 2–3 yr laddered bonds/CDs' }
      ],
      cifNumber: 'CIF-2026-4418',
      repCode: 'MR-0044',
      branchCode: 'NYL-NYC-01',
      investmentObjective: 'Growth & Income',
      riskTolerance: 'Moderate',
      timeHorizon: '12 years',
      dividendInstruction: 'Reinvest',
      marginEnabled: false,
      optionsEnabled: false,
      documents: [
        { name: 'New Account Application (NAA)', status: 'complete', date: 'Jun 10, 2025' },
        { name: 'Customer Identification Program (CIP)', status: 'complete', date: 'Jun 10, 2025' },
        { name: 'Investment Profile Questionnaire', status: 'complete', date: 'Jun 10, 2025' },
        { name: 'Form ADV Part 2A — Brochure', status: 'pending', date: null },
        { name: 'Form ADV Part 2B — Supplement', status: 'pending', date: null },
        { name: 'Reg BI Best Interest Disclosure', status: 'complete', date: 'Jun 10, 2025' },
        { name: 'IRA Rollover Certification', status: 'pending', date: null },
        { name: 'ACH / EFT Authorization', status: 'not-started', date: null },
        { name: 'Trusted Contact Form', status: 'complete', date: 'Jun 10, 2025' }
      ],
      amlChecks: [
        { check: 'OFAC Sanctions Screening', status: 'pass', note: 'No match — cleared Jun 10' },
        { check: 'FinCEN CDD Rule — Beneficial Ownership', status: 'pass', note: 'Individual account — threshold not triggered' },
        { check: 'PEP Screening', status: 'pass', note: 'No politically exposed person match' },
        { check: 'Adverse Media Scan', status: 'pass', note: 'No adverse media found' },
        { check: 'Source of Funds Verification', status: 'pending', note: '401(k) rollover documentation requested from Fidelity' }
      ],
      custodianChecklist: [
        { item: 'Account application submitted to Pershing', done: true },
        { item: 'CIF number assigned', done: true },
        { item: 'Rep code linked to account', done: true },
        { item: 'Rollover paperwork sent to Fidelity', done: false },
        { item: 'Welcome letter sent to client', done: false },
        { item: 'Client portal login provisioned', done: false },
        { item: 'Initial funding confirmation pending', done: false }
      ],
      aiNarrative: 'Account opening is 61% complete. Three accounts are being opened simultaneously (IRA Rollover, Taxable, Bond Sleeve). Primary outstanding items: ADV Part 2 delivery acknowledgment, rollover certification from Fidelity, and ACH setup. AML/KYC is fully cleared except for source of funds (rollover docs). Estimated account ready date: Jun 17, 2025 — 7 days from application. No regulatory flags. Client trust contact (Michael Nguyen) documented.',
      estimatedReadyDate: 'Jun 17, 2025',
      overallProgress: 61
    },
    'P4-002': {
      custodian: 'Pershing / BNY Mellon',
      custodianCode: 'PRSH',
      accountTypes: [
        { type: 'Roth IRA', code: 'ROTH', selected: true,
          rationale: 'Max contributions at 22% bracket — tax-free growth' },
        { type: 'ESG Taxable Brokerage', code: 'ESGT', selected: true,
          rationale: 'ESG-screened portfolio for core savings' }
      ],
      cifNumber: 'CIF-2026-4421',
      repCode: 'MR-0044',
      branchCode: 'NYL-NYC-01',
      investmentObjective: 'Capital Preservation & Income',
      riskTolerance: 'Conservative-Moderate',
      timeHorizon: '6 years',
      dividendInstruction: 'Reinvest',
      marginEnabled: false,
      optionsEnabled: false,
      documents: [
        { name: 'New Account Application (NAA)', status: 'complete', date: 'Jun 9, 2025' },
        { name: 'Customer Identification Program (CIP)', status: 'complete', date: 'Jun 9, 2025' },
        { name: 'Investment Profile Questionnaire', status: 'complete', date: 'Jun 9, 2025' },
        { name: 'Form ADV Part 2A — Brochure', status: 'complete', date: 'Jun 9, 2025' },
        { name: 'Form ADV Part 2B — Supplement', status: 'complete', date: 'Jun 9, 2025' },
        { name: 'Reg BI Best Interest Disclosure', status: 'complete', date: 'Jun 9, 2025' },
        { name: 'ESG Mandate Letter', status: 'pending', date: null },
        { name: 'ACH / EFT Authorization', status: 'complete', date: 'Jun 9, 2025' },
        { name: 'Trusted Contact Form', status: 'complete', date: 'Jun 9, 2025' }
      ],
      amlChecks: [
        { check: 'OFAC Sanctions Screening', status: 'pass', note: 'No match — cleared Jun 9' },
        { check: 'FinCEN CDD Rule — Beneficial Ownership', status: 'pass', note: 'Individual account — threshold not triggered' },
        { check: 'PEP Screening', status: 'pass', note: 'No match' },
        { check: 'Adverse Media Scan', status: 'pass', note: 'No adverse media' },
        { check: 'Source of Funds Verification', status: 'pass', note: 'Bank transfer from Chase confirmed' }
      ],
      custodianChecklist: [
        { item: 'Account application submitted to Pershing', done: true },
        { item: 'CIF number assigned', done: true },
        { item: 'Rep code linked to account', done: true },
        { item: 'ESG screening mandate configured', done: false },
        { item: 'Welcome letter sent to client', done: true },
        { item: 'Client portal login provisioned', done: true },
        { item: 'Initial funding confirmation pending', done: false }
      ],
      aiNarrative: 'Account opening is 79% complete. Both Roth IRA and ESG taxable accounts are in final setup. All AML/KYC checks passed. Only outstanding items: ESG mandate configuration in Pershing (firm ops task, 1–2 days) and initial funding confirmation. Client portal already active. Estimated account ready date: Jun 12, 2025.',
      estimatedReadyDate: 'Jun 12, 2025',
      overallProgress: 79
    },
    'P4-003': {
      custodian: 'Pershing / BNY Mellon',
      custodianCode: 'PRSH',
      accountTypes: [
        { type: 'Managed Discretionary Account', code: 'MDA', selected: true,
          rationale: 'Core managed account for long-term growth' }
      ],
      cifNumber: null,
      repCode: 'MR-0044',
      branchCode: 'NYL-NYC-01',
      investmentObjective: 'Growth',
      riskTolerance: 'Moderate-Aggressive',
      timeHorizon: '15 years',
      dividendInstruction: 'Reinvest',
      marginEnabled: false,
      optionsEnabled: false,
      documents: [
        { name: 'New Account Application (NAA)', status: 'not-started', date: null },
        { name: 'Customer Identification Program (CIP)', status: 'not-started', date: null },
        { name: 'Investment Profile Questionnaire', status: 'complete', date: 'Jun 8, 2025' },
        { name: 'Form ADV Part 2A — Brochure', status: 'not-started', date: null },
        { name: 'Form ADV Part 2B — Supplement', status: 'not-started', date: null },
        { name: 'Reg BI Best Interest Disclosure', status: 'not-started', date: null },
        { name: 'ACH / EFT Authorization', status: 'not-started', date: null },
        { name: 'Trusted Contact Form', status: 'not-started', date: null }
      ],
      amlChecks: [
        { check: 'OFAC Sanctions Screening', status: 'pending', note: 'Not yet initiated' },
        { check: 'FinCEN CDD Rule — Beneficial Ownership', status: 'pending', note: 'Not yet initiated' },
        { check: 'PEP Screening', status: 'pending', note: 'Not yet initiated' },
        { check: 'Adverse Media Scan', status: 'pending', note: 'Not yet initiated' },
        { check: 'Source of Funds Verification', status: 'pending', note: 'Not yet initiated' }
      ],
      custodianChecklist: [
        { item: 'Account application submitted to Pershing', done: false },
        { item: 'CIF number assigned', done: false },
        { item: 'Rep code linked to account', done: false },
        { item: 'Welcome letter sent to client', done: false },
        { item: 'Client portal login provisioned', done: false },
        { item: 'Initial funding confirmation pending', done: false }
      ],
      aiNarrative: 'Account opening has not yet started. Investment Profile Questionnaire is the only completed step. Recommend initiating NAA and CIP immediately. AML/KYC screening can be launched now using client data from the FNA fact-find. Estimated time to account ready: 10–14 days from initiation.',
      estimatedReadyDate: 'TBD — not yet initiated',
      overallProgress: 8
    }
  };

  var _aoDefault = {
    custodian: 'Pershing / BNY Mellon',
    custodianCode: 'PRSH',
    accountTypes: [{ type: 'Managed Discretionary Account', code: 'MDA', selected: true, rationale: 'Core managed account based on investment profile' }],
    cifNumber: null, repCode: 'MR-0044', branchCode: 'NYL-NYC-01',
    investmentObjective: 'Growth', riskTolerance: 'Moderate', timeHorizon: '10+ years',
    dividendInstruction: 'Reinvest', marginEnabled: false, optionsEnabled: false,
    documents: [
      { name: 'New Account Application (NAA)', status: 'not-started', date: null },
      { name: 'Customer Identification Program (CIP)', status: 'not-started', date: null },
      { name: 'Investment Profile Questionnaire', status: 'not-started', date: null },
      { name: 'Form ADV Part 2A', status: 'not-started', date: null },
      { name: 'Reg BI Disclosure', status: 'not-started', date: null },
      { name: 'ACH / EFT Authorization', status: 'not-started', date: null }
    ],
    amlChecks: [
      { check: 'OFAC Sanctions Screening', status: 'pending', note: 'Not yet initiated' },
      { check: 'FinCEN CDD — Beneficial Ownership', status: 'pending', note: 'Not yet initiated' },
      { check: 'PEP Screening', status: 'pending', note: 'Not yet initiated' },
      { check: 'Source of Funds Verification', status: 'pending', note: 'Not yet initiated' }
    ],
    custodianChecklist: [
      { item: 'Account application submitted', done: false },
      { item: 'CIF number assigned', done: false },
      { item: 'Client portal provisioned', done: false }
    ],
    aiNarrative: 'Account opening not yet initiated. Complete Investment Profile, then launch account opening workflow.',
    estimatedReadyDate: 'TBD', overallProgress: 0
  };

  // ── A2. Render: Account Opening tab body ───────────────────────
  window._p4TabAccountOpening = function(p) {
    var ao = _aoData[p.id] || _aoDefault;
    var progColor = ao.overallProgress >= 75 ? '#16a34a' : ao.overallProgress >= 40 ? '#d97706' : '#dc2626';
    var progLabel = ao.overallProgress >= 75 ? 'Near Complete' : ao.overallProgress >= 40 ? 'In Progress' : 'Early Stage';

    // Progress ring
    var circumference = 2 * 3.14159 * 36;
    var dashArr = (circumference * ao.overallProgress / 100).toFixed(1) + ' ' + circumference.toFixed(1);

    // Account type chips
    var acctChips = ao.accountTypes.map(function(a) {
      return '<div class="ao-acct-chip' + (a.selected ? ' selected' : '') + '">'
        + '<div class="ao-acct-chip-top">'
        +   '<span class="ao-acct-code">' + a.code + '</span>'
        +   '<span class="ao-acct-type">' + a.type + '</span>'
        + '</div>'
        + '<div class="ao-acct-rationale">' + a.rationale + '</div>'
        + '</div>';
    }).join('');

    // Document checklist rows
    var docRows = ao.documents.map(function(d) {
      var cls = d.status === 'complete' ? 'ao-doc-done' : d.status === 'pending' ? 'ao-doc-pending' : 'ao-doc-ns';
      var icon = d.status === 'complete' ? 'fa-check-circle' : d.status === 'pending' ? 'fa-hourglass-half' : 'fa-circle';
      var badge = d.status === 'complete'
        ? '<span class="ao-doc-badge done">Done ' + (d.date ? '· ' + d.date : '') + '</span>'
        : d.status === 'pending'
        ? '<span class="ao-doc-badge pending">Pending</span>'
        : '<span class="ao-doc-badge ns">Not Started</span>';
      var actionBtn = d.status !== 'complete'
        ? '<button class="ao-doc-btn" onclick="aoSendDocument(\'' + d.name + '\')">'
          + '<i class="fas fa-paper-plane"></i> Send</button>'
        : '';
      return '<div class="ao-doc-row ' + cls + '">'
        + '<i class="fas ' + icon + ' ao-doc-icon"></i>'
        + '<span class="ao-doc-name">' + d.name + '</span>'
        + badge
        + actionBtn
        + '</div>';
    }).join('');

    // AML check rows
    var amlRows = ao.amlChecks.map(function(c) {
      var cls = c.status === 'pass' ? 'ao-aml-pass' : 'ao-aml-pending';
      var icon = c.status === 'pass' ? 'fa-check-shield' : 'fa-hourglass-half';
      return '<div class="ao-aml-row ' + cls + '">'
        + '<i class="fas ' + icon + ' ao-aml-icon"></i>'
        + '<div class="ao-aml-body">'
        +   '<div class="ao-aml-check">' + c.check + '</div>'
        +   '<div class="ao-aml-note">' + c.note + '</div>'
        + '</div>'
        + '<span class="ao-aml-badge ' + (c.status === 'pass' ? 'pass' : 'pend') + '">'
        + (c.status === 'pass' ? 'Cleared' : 'Pending') + '</span>'
        + '</div>';
    }).join('');

    // Custodian checklist
    var custRows = ao.custodianChecklist.map(function(item) {
      return '<div class="ao-cust-row' + (item.done ? ' done' : '') + '">'
        + '<i class="fas ' + (item.done ? 'fa-check-circle' : 'fa-circle') + ' ao-cust-icon"></i>'
        + '<span class="ao-cust-item">' + item.item + '</span>'
        + '</div>';
    }).join('');

    // Account details grid
    var detailRows = [
      ['Custodian', ao.custodian],
      ['CIF Number', ao.cifNumber || '<span style="color:#d97706">Pending assignment</span>'],
      ['Rep Code', ao.repCode],
      ['Branch', ao.branchCode],
      ['Investment Objective', ao.investmentObjective],
      ['Risk Tolerance', ao.riskTolerance],
      ['Time Horizon', ao.timeHorizon],
      ['Dividend Instruction', ao.dividendInstruction],
      ['Margin', ao.marginEnabled ? 'Enabled' : 'Not enabled'],
      ['Options', ao.optionsEnabled ? 'Enabled' : 'Not enabled']
    ].map(function(r) {
      return '<div class="ao-detail-row"><span class="ao-detail-lbl">' + r[0] + '</span><span class="ao-detail-val">' + r[1] + '</span></div>';
    }).join('');

    return '<div class="ao-wrap">'

      // ── Top strip: progress + ready date
      + '<div class="ao-progress-strip">'
      +   '<div class="ao-prog-ring-wrap">'
      +     '<svg class="ao-prog-ring" viewBox="0 0 88 88">'
      +       '<circle cx="44" cy="44" r="36" fill="none" stroke="#e5e7eb" stroke-width="8"/>'
      +       '<circle cx="44" cy="44" r="36" fill="none" stroke="' + progColor + '" stroke-width="8"'
      +         ' stroke-dasharray="' + dashArr + '" stroke-linecap="round" transform="rotate(-90 44 44)"/>'
      +       '<text x="44" y="40" text-anchor="middle" class="ao-ring-pct" fill="' + progColor + '">' + ao.overallProgress + '%</text>'
      +       '<text x="44" y="54" text-anchor="middle" class="ao-ring-lbl" fill="#6b7280">Complete</text>'
      +     '</svg>'
      +   '</div>'
      +   '<div class="ao-prog-info">'
      +     '<div class="ao-prog-status" style="color:' + progColor + '">' + progLabel + '</div>'
      +     '<div class="ao-prog-ready"><i class="fas fa-calendar-check"></i> Est. Ready: <strong>' + ao.estimatedReadyDate + '</strong></div>'
      +     '<div class="ao-prog-cust"><i class="fas fa-building"></i> ' + ao.custodian + ' &nbsp;·&nbsp; Rep ' + ao.repCode + '</div>'
      +   '</div>'
      +   '<div class="ao-prog-actions">'
      +     '<button class="ao-btn primary" onclick="aoLaunchWorkflow()"><i class="fas fa-rocket"></i> Launch Workflow</button>'
      +     '<button class="ao-btn outline" onclick="aoOpenInAccounts()"><i class="fas fa-chart-line"></i> Open in Accounts</button>'
      +   '</div>'
      + '</div>'

      // ── Account types
      + '<div class="ao-section-title"><i class="fas fa-layer-group"></i> Account Types Being Opened</div>'
      + '<div class="ao-acct-chips">' + acctChips + '</div>'

      // ── Account details
      + '<div class="ao-section-title"><i class="fas fa-info-circle"></i> Account Setup Details</div>'
      + '<div class="ao-detail-grid">' + detailRows + '</div>'

      // ── Two-col: Documents + AML
      + '<div class="ao-two-col">'

        // Documents
        + '<div class="ao-card">'
        +   '<div class="ao-card-title"><i class="fas fa-file-signature"></i> Required Documents</div>'
        +   '<div class="ao-doc-list">' + docRows + '</div>'
        +   '<button class="ao-btn outline ao-btn-full" style="margin-top:12px" onclick="aoSendAllPending()">'
        +     '<i class="fas fa-paper-plane"></i> Send All Pending</button>'
        + '</div>'

        // AML / KYC
        + '<div class="ao-card">'
        +   '<div class="ao-card-title"><i class="fas fa-shield-alt"></i> AML / KYC Checks</div>'
        +   '<div class="ao-aml-list">' + amlRows + '</div>'
        +   '<div class="ao-card-title" style="margin-top:16px"><i class="fas fa-tasks"></i> Custodian Checklist</div>'
        +   '<div class="ao-cust-list">' + custRows + '</div>'
        + '</div>'

      + '</div>'

      // ── AI narrative
      + '<div class="ao-ai-card">'
      +   '<div class="ao-ai-header"><i class="fas fa-robot"></i> AI Account Opening Analysis</div>'
      +   '<div class="ao-ai-text">' + ao.aiNarrative + '</div>'
      +   '<div class="ao-ai-actions">'
      +     '<button class="ao-btn primary" onclick="aoRunAMLScan()"><i class="fas fa-sync"></i> Re-run AML Scan</button>'
      +     '<button class="ao-btn outline" onclick="aoOpenInAccounts()"><i class="fas fa-link"></i> Go to Investment Accounts</button>'
      +     '<button class="ao-btn outline" onclick="aoExportChecklist()"><i class="fas fa-file-pdf"></i> Export Checklist</button>'
      +   '</div>'
      + '</div>'

    + '</div>'; // ao-wrap
  };

  // ── A3. Patch p4RenderDetailPanel to inject 6th tab ───────────
  if (typeof p4RenderDetailPanel === 'function') {
    var _orig_p4RenderDetailPanel = p4RenderDetailPanel;
    p4RenderDetailPanel = function(pid) {
      _orig_p4RenderDetailPanel.apply(this, arguments);
      // After original renders, find the tab strip and inject the 6th tab
      var tabsEl = document.getElementById('p4-detail-tabs');
      if (!tabsEl) return;
      // Only inject if not already there
      if (tabsEl.querySelector('[data-tab="account-opening"]')) return;
      var btn = document.createElement('button');
      btn.className = 'p4-tab';
      btn.setAttribute('data-tab', 'account-opening');
      btn.setAttribute('onclick', 'p4SwitchTab(\'account-opening\', this)');
      btn.innerHTML = '<i class="fas fa-folder-open"></i> Account Opening';
      tabsEl.appendChild(btn);
    };
  }

  // ── A4. Patch p4SwitchTab to handle 'account-opening' ─────────
  if (typeof p4SwitchTab === 'function') {
    var _orig_p4SwitchTab = p4SwitchTab;
    p4SwitchTab = function(tabId, btn) {
      if (tabId === 'account-opening') {
        var pid = (typeof _p4ActiveProspect !== 'undefined') ? _p4ActiveProspect : null;
        var p = (pid && typeof p4Prospects !== 'undefined')
          ? p4Prospects.find(function(x) { return x.id === pid; }) : null;
        // Deactivate all tabs
        document.querySelectorAll('.p4-tab').forEach(function(b) { b.classList.remove('active'); });
        if (btn) btn.classList.add('active');
        var body = document.getElementById('p4-tab-body');
        if (!body) return;
        body.innerHTML = p ? _p4TabAccountOpening(p) : '<div class="ao-empty">Select a prospect to view account opening status.</div>';
      } else {
        _orig_p4SwitchTab.apply(this, arguments);
      }
    };
  }

  // ── A5. Action stubs ────────────────────────────────────────────
  window.aoLaunchWorkflow = function() {
    var btn = event && event.target ? event.target.closest('button') : null;
    if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Launching…'; btn.disabled = true; }
    setTimeout(function() {
      if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> Workflow Active'; btn.disabled = false; }
    }, 1400);
  };
  window.aoOpenInAccounts = function() {
    if (typeof navigateTo === 'function') navigateTo('inv-accounts');
  };
  window.aoSendDocument = function(docName) {
    if (typeof _p5Toast === 'function') {
      _p5Toast('<i class="fas fa-paper-plane"></i> Document sent: <strong>' + docName + '</strong>', 2500);
    } else { alert('Sent: ' + docName); }
  };
  window.aoSendAllPending = function() {
    if (typeof _p5Toast === 'function') {
      _p5Toast('<i class="fas fa-paper-plane"></i> All pending documents dispatched via DocuSign', 3000);
    } else { alert('All pending documents sent.'); }
  };
  window.aoRunAMLScan = function() {
    var btn = event && event.target ? event.target.closest('button') : null;
    if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning…'; btn.disabled = true; }
    setTimeout(function() {
      if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> AML Scan Complete'; btn.disabled = false; }
    }, 2000);
  };
  window.aoExportChecklist = function() {
    alert('Account Opening Checklist PDF — connected to compliance document generation.');
  };


  /* ─────────────────────────────────────────────────────────────────
     PART B: SUITABILITY REVIEW TAB — Underwriting page (p5)
     Strategy: patch initUnderwritingPage to inject a tab strip
     above the p5-case-queue that toggles between
     "Insurance UW Pipeline" and "Investment Suitability Review"
     ───────────────────────────────────────────────────────────────── */

  // ── B1. State ──────────────────────────────────────────────────
  window._p5ActiveTab = window._p5ActiveTab || 'insurance';

  window.p5SwitchUWTab = function(tab) {
    window._p5ActiveTab = tab;
    var insBtn = document.getElementById('p5-tab-ins');
    var invBtn = document.getElementById('p5-tab-inv');
    var queue  = document.getElementById('p5-case-queue');
    var srPanel= document.getElementById('p5-sr-panel');

    if (insBtn) insBtn.classList.toggle('active', tab === 'insurance');
    if (invBtn) invBtn.classList.toggle('active', tab === 'investment');
    if (queue)  queue.style.display  = (tab === 'insurance') ? '' : 'none';
    if (srPanel) srPanel.style.display = (tab === 'investment') ? '' : 'none';

    if (tab === 'investment' && srPanel && !srPanel.dataset.rendered) {
      srPanel.innerHTML = srBuildPanel();
      srPanel.dataset.rendered = '1';
    }
  };

  // ── B2. Patch initUnderwritingPage ────────────────────────────
  if (typeof initUnderwritingPage === 'function') {
    var _orig_initUnderwritingPage = initUnderwritingPage;
    initUnderwritingPage = function() {
      _orig_initUnderwritingPage.apply(this, arguments);

      // Inject tab strip between toolbar and p5-case-queue
      var queue = document.getElementById('p5-case-queue');
      if (!queue) return;

      // Tab strip container — insert before p5-case-queue
      if (!document.getElementById('p5-uw-tab-strip')) {
        var strip = document.createElement('div');
        strip.id = 'p5-uw-tab-strip';
        strip.className = 'p5-uw-tab-strip';
        strip.innerHTML = srBuildTabStrip();
        queue.parentNode.insertBefore(strip, queue);
      }

      // SR panel container — insert after p5-case-queue
      if (!document.getElementById('p5-sr-panel')) {
        var srDiv = document.createElement('div');
        srDiv.id = 'p5-sr-panel';
        srDiv.style.display = 'none';
        queue.parentNode.insertBefore(srDiv, queue.nextSibling);
      }

      // Reset to insurance tab on init
      window._p5ActiveTab = 'insurance';
    };
  }

  function srBuildTabStrip() {
    return '<button class="p5-uw-tab-btn active" id="p5-tab-ins" onclick="p5SwitchUWTab(\'insurance\')">'
      + '<i class="fas fa-heartbeat"></i> Insurance UW Pipeline</button>'
      + '<button class="p5-uw-tab-btn" id="p5-tab-inv" onclick="p5SwitchUWTab(\'investment\')">'
      + '<i class="fas fa-chart-line"></i> Investment Suitability Review</button>';
  }

  // ── B3. Suitability review data ───────────────────────────────
  var _srCases = [
    {
      id: 'SR-2026-001',
      client: 'Patricia Nguyen',
      initials: 'PN',
      avatarColor: '#7c3aed',
      accountType: 'IRA Rollover + Managed Account',
      totalAUM: '$542,000',
      riskProfile: 'Moderate',
      suitabilityScore: 78,
      regBIStatus: 'review',
      stage: 'Pending Advisor Sign-off',
      stageCode: 'pending',
      daysIn: 2,
      flags: [
        { level: 'warn', rule: 'Concentration Risk', detail: 'Employer stock 12% > 5% guideline — reduction plan documented' },
        { level: 'warn', rule: 'Form ADV Delivery', detail: 'Client acknowledgment pending — DocuSign sent Jun 10' }
      ],
      checks: [
        { name: 'FINRA Rule 2111 — Suitability', status: 'pass' },
        { name: 'Reg BI — Best Interest', status: 'warn' },
        { name: 'Form ADV Part 2 Delivery', status: 'warn' },
        { name: 'Investment Profile Completeness', status: 'pass' },
        { name: 'Fee Disclosure (Form CRS)', status: 'pass' },
        { name: 'Concentration Risk Review', status: 'warn' },
        { name: 'Liquidity Suitability', status: 'pass' },
        { name: 'Tax Suitability Check', status: 'pass' }
      ],
      aiDecision: 'Conditionally Approved — resolve 3 flags',
      aiColor: '#d97706',
      model: 'Balanced Growth 60/40',
      blendedFee: '0.87%',
      aiNarrative: 'Suitability is conditionally met. Reg BI documentation requires ADV Part 2 client acknowledgment before account funding. Employer stock concentration reduction plan is documented and acceptable per FINRA guidance. Recommend approval contingent on ADV signature and rollover source-of-funds documentation.'
    },
    {
      id: 'SR-2026-002',
      client: 'James Rivera',
      initials: 'JR',
      avatarColor: '#0891b2',
      accountType: 'Roth IRA + ESG Brokerage',
      totalAUM: '$137,000',
      riskProfile: 'Conservative-Moderate',
      suitabilityScore: 91,
      regBIStatus: 'pass',
      stage: 'Approved — Pending Funding',
      stageCode: 'approved',
      daysIn: 1,
      flags: [],
      checks: [
        { name: 'FINRA Rule 2111 — Suitability', status: 'pass' },
        { name: 'Reg BI — Best Interest', status: 'pass' },
        { name: 'Form ADV Part 2 Delivery', status: 'pass' },
        { name: 'Investment Profile Completeness', status: 'pass' },
        { name: 'Fee Disclosure (Form CRS)', status: 'pass' },
        { name: 'ESG Mandate Disclosure', status: 'pass' },
        { name: 'Liquidity Suitability', status: 'pass' },
        { name: 'Tax Suitability Check', status: 'pass' }
      ],
      aiDecision: 'Approved — All Checks Passed',
      aiColor: '#16a34a',
      model: 'ESG Conservative 35/65',
      blendedFee: '0.72%',
      aiNarrative: 'Full suitability confirmed. All 8 regulatory checks passed. ESG mandate properly documented per SEC guidance. Conservative-Moderate profile correctly aligned with 6-year horizon and capital preservation objective. Ready for initial funding.'
    },
    {
      id: 'SR-2026-003',
      client: 'Nancy Foster',
      initials: 'NF',
      avatarColor: '#059669',
      accountType: 'Managed Discretionary Account',
      totalAUM: '$210,000',
      riskProfile: 'Moderate-Aggressive',
      suitabilityScore: 65,
      regBIStatus: 'fail',
      stage: 'Incomplete — Documents Missing',
      stageCode: 'incomplete',
      daysIn: 5,
      flags: [
        { level: 'fail', rule: 'Investment Profile', detail: 'Risk tolerance questionnaire not completed — cannot score suitability' },
        { level: 'fail', rule: 'Form ADV Delivery', detail: 'ADV Part 2A not yet sent to client' },
        { level: 'warn', rule: 'Source of Funds', detail: 'Funding source not documented — required for accounts > $100K' }
      ],
      checks: [
        { name: 'FINRA Rule 2111 — Suitability', status: 'fail' },
        { name: 'Reg BI — Best Interest', status: 'fail' },
        { name: 'Form ADV Part 2 Delivery', status: 'fail' },
        { name: 'Investment Profile Completeness', status: 'fail' },
        { name: 'Fee Disclosure (Form CRS)', status: 'pending' },
        { name: 'Concentration Risk Review', status: 'pending' },
        { name: 'Liquidity Suitability', status: 'pending' },
        { name: 'Tax Suitability Check', status: 'pending' }
      ],
      aiDecision: 'Blocked — Critical Items Missing',
      aiColor: '#dc2626',
      model: 'Growth 70/30',
      blendedFee: '0.95%',
      aiNarrative: 'Account opening is blocked pending completion of regulatory documents. Investment Profile Questionnaire must be completed before suitability can be assessed. ADV Part 2 must be delivered and acknowledged. Source of funds for $210K must be documented. Recommend immediate outreach to client to complete onboarding documentation.'
    }
  ];

  // ── B4. Build the full SR panel HTML ─────────────────────────
  function srBuildPanel() {

    // Summary KPI strip
    var total   = _srCases.length;
    var approved = _srCases.filter(function(c) { return c.stageCode === 'approved'; }).length;
    var pending  = _srCases.filter(function(c) { return c.stageCode === 'pending'; }).length;
    var blocked  = _srCases.filter(function(c) { return c.stageCode === 'incomplete'; }).length;
    var totalAUM = '$889,000';

    var kpiHtml = '<div class="sr-kpi-strip">'
      + '<div class="sr-kpi"><div class="sr-kpi-val">' + total + '</div><div class="sr-kpi-lbl">Cases In Review</div></div>'
      + '<div class="sr-kpi green"><div class="sr-kpi-val">' + approved + '</div><div class="sr-kpi-lbl">Approved</div></div>'
      + '<div class="sr-kpi amber"><div class="sr-kpi-val">' + pending + '</div><div class="sr-kpi-lbl">Pending Sign-off</div></div>'
      + '<div class="sr-kpi red"><div class="sr-kpi-val">' + blocked + '</div><div class="sr-kpi-lbl">Blocked</div></div>'
      + '<div class="sr-kpi blue"><div class="sr-kpi-val">' + totalAUM + '</div><div class="sr-kpi-lbl">Total AUM</div></div>'
      + '</div>';

    // AI banner
    var aiBanner = '<div class="sr-ai-banner">'
      + '<i class="fas fa-robot sr-ai-icon"></i>'
      + '<div class="sr-ai-body">'
      +   '<span class="sr-ai-label">AI Suitability Engine</span>'
      +   '<span class="sr-ai-text">Reg BI checks · FINRA 2111 · Concentration risk · Fee disclosure · Liquidity suitability — continuous real-time monitoring</span>'
      + '</div>'
      + '<button class="sr-ai-btn" onclick="srRunAllChecks()"><i class="fas fa-sync"></i> Re-run All Checks</button>'
      + '</div>';

    // Case cards
    var cards = _srCases.map(function(c) {
      var stageCls = c.stageCode === 'approved' ? 'sr-stage-approved'
        : c.stageCode === 'pending' ? 'sr-stage-pending' : 'sr-stage-incomplete';
      var scoreColor = c.suitabilityScore >= 85 ? '#16a34a' : c.suitabilityScore >= 70 ? '#d97706' : '#dc2626';

      // Mini check pills
      var checkPills = c.checks.map(function(ch) {
        var cls = ch.status === 'pass' ? 'sr-pill-pass' : ch.status === 'warn' ? 'sr-pill-warn' : ch.status === 'fail' ? 'sr-pill-fail' : 'sr-pill-pend';
        var icon = ch.status === 'pass' ? 'fa-check' : ch.status === 'warn' ? 'fa-exclamation' : ch.status === 'fail' ? 'fa-times' : 'fa-clock';
        return '<span class="sr-check-pill ' + cls + '" title="' + ch.name + '"><i class="fas ' + icon + '"></i></span>';
      }).join('');

      // Flag rows
      var flagRows = c.flags.map(function(f) {
        var fcls = f.level === 'fail' ? 'sr-flag-fail' : f.level === 'warn' ? 'sr-flag-warn' : 'sr-flag-info';
        var ficon = f.level === 'fail' ? 'fa-times-circle' : 'fa-exclamation-triangle';
        return '<div class="sr-flag ' + fcls + '">'
          + '<i class="fas ' + ficon + '"></i>'
          + '<div><div class="sr-flag-rule">' + f.rule + '</div>'
          + '<div class="sr-flag-detail">' + f.detail + '</div></div>'
          + '</div>';
      }).join('');

      return '<div class="sr-case-card ' + stageCls + '">'
        + '<div class="sr-card-header">'
        +   '<div class="sr-card-avatar" style="background:' + c.avatarColor + '">' + c.initials + '</div>'
        +   '<div class="sr-card-info">'
        +     '<div class="sr-card-name">' + c.client + ' <span class="sr-case-id">' + c.id + '</span></div>'
        +     '<div class="sr-card-acct">' + c.accountType + ' · ' + c.totalAUM + ' AUM</div>'
        +     '<div class="sr-card-model">' + c.model + ' · ' + c.blendedFee + ' fee</div>'
        +   '</div>'
        +   '<div class="sr-card-score">'
        +     '<div class="sr-score-num" style="color:' + scoreColor + '">' + c.suitabilityScore + '</div>'
        +     '<div class="sr-score-lbl">/ 100</div>'
        +   '</div>'
        + '</div>'
        + '<div class="sr-card-stage ' + stageCls + '">'
        +   '<span class="sr-stage-dot"></span>' + c.stage + ' · ' + c.daysIn + 'd in review'
        + '</div>'
        + '<div class="sr-checks-row">' + checkPills + '</div>'
        + (flagRows ? '<div class="sr-flags">' + flagRows + '</div>' : '')
        + '<div class="sr-ai-rec" style="color:' + c.aiColor + '">'
        +   '<i class="fas fa-robot"></i> ' + c.aiDecision
        + '</div>'
        + '<div class="sr-card-narrative">' + c.aiNarrative + '</div>'
        + '<div class="sr-card-actions">'
        +   '<button class="sr-btn primary" onclick="srApproveCase(\'' + c.id + '\')">'
        +     '<i class="fas fa-check-shield"></i> Approve</button>'
        +   '<button class="sr-btn outline" onclick="srRequestDocs(\'' + c.id + '\')">'
        +     '<i class="fas fa-paper-plane"></i> Request Docs</button>'
        +   '<button class="sr-btn outline" onclick="srOpenFullReview(\'' + c.id + '\')">'
        +     '<i class="fas fa-search"></i> Full Review</button>'
        + '</div>'
        + '</div>';
    }).join('');

    // Reg BI summary table
    var regBiRows = _srCases.map(function(c) {
      var cls = c.regBIStatus === 'pass' ? 'sr-regbi-pass' : c.regBIStatus === 'warn' ? 'sr-regbi-warn' : 'sr-regbi-fail';
      var icon = c.regBIStatus === 'pass' ? 'fa-check-circle' : c.regBIStatus === 'warn' ? 'fa-exclamation-triangle' : 'fa-times-circle';
      var passCount = c.checks.filter(function(x) { return x.status === 'pass'; }).length;
      return '<tr class="' + cls + '">'
        + '<td><div class="sr-mini-avatar" style="background:' + c.avatarColor + '">' + c.initials + '</div></td>'
        + '<td>' + c.client + '</td>'
        + '<td>' + c.accountType + '</td>'
        + '<td><span class="sr-score-badge" style="color:' + (c.suitabilityScore >= 85 ? '#16a34a' : c.suitabilityScore >= 70 ? '#d97706' : '#dc2626') + '">' + c.suitabilityScore + '/100</span></td>'
        + '<td>' + passCount + '/' + c.checks.length + '</td>'
        + '<td><i class="fas ' + icon + '"></i> ' + c.stage + '</td>'
        + '</tr>';
    }).join('');

    var regBiTable = '<div class="sr-regbi-card">'
      + '<div class="sr-section-title"><i class="fas fa-balance-scale"></i> Reg BI Compliance Summary</div>'
      + '<div class="sr-table-wrap"><table class="sr-regbi-table">'
      + '<thead><tr><th></th><th>Client</th><th>Account Type</th><th>Score</th><th>Checks</th><th>Status</th></tr></thead>'
      + '<tbody>' + regBiRows + '</tbody>'
      + '</table></div>'
      + '</div>';

    return '<div class="sr-wrap">'
      + kpiHtml
      + aiBanner
      + '<div class="sr-section-title"><i class="fas fa-clipboard-check"></i> Suitability Review Cases</div>'
      + '<div class="sr-cards-grid">' + cards + '</div>'
      + regBiTable
      + '</div>';
  }

  // ── B5. SR action stubs ────────────────────────────────────────
  window.srRunAllChecks = function() {
    var btn = event && event.target ? event.target.closest('button') : null;
    if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running…'; btn.disabled = true; }
    setTimeout(function() {
      if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> Checks Complete'; btn.disabled = false; }
    }, 2000);
  };

  window.srApproveCase = function(id) {
    var c = _srCases.find(function(x) { return x.id === id; });
    var name = c ? c.client : id;
    if (typeof _p5Toast === 'function') {
      _p5Toast('<i class="fas fa-check-shield"></i> Suitability approved for <strong>' + name + '</strong> — proceeding to account funding', 3000);
    } else { alert('Approved: ' + name); }
  };

  window.srRequestDocs = function(id) {
    var c = _srCases.find(function(x) { return x.id === id; });
    var name = c ? c.client : id;
    if (typeof _p5Toast === 'function') {
      _p5Toast('<i class="fas fa-paper-plane"></i> Document request sent to <strong>' + name + '</strong>', 2500);
    } else { alert('Docs requested: ' + name); }
  };

  window.srOpenFullReview = function(id) {
    var c = _srCases.find(function(x) { return x.id === id; });
    if (!c) return;
    alert('Full Suitability Review — ' + c.id + '\n\nClient: ' + c.client + '\nScore: ' + c.suitabilityScore + '/100\nDecision: ' + c.aiDecision + '\n\nDetailed review modal — Step 4 implementation.');
  };

  console.log('[INV Step 3] Account Opening (Sales p4) + Suitability Review (UW p5) loaded.');

})();
