(function() {
  'use strict';

  // ── ADV Estate Planning Module ─────────────────────────────────────────────
  // NYL pillar: Estate Planning — "Guidance to identify potential needs in
  // coordination with your other advisors and set you up with an estate plan
  // that can protect your legacy."
  // Container IDs (from tpl-adv-estate shell):
  //   prop-kpi-bar, prop-list, prop-detail-empty, prop-detail-panel
  // ──────────────────────────────────────────────────────────────────────────

  var EP_CLIENTS = [
    {
      id: 'ep001',
      name: 'James Whitfield',
      age: 68,
      estateValue: '$4.2M',
      status: 'needs-review',
      statusLabel: 'Needs Review',
      lastReview: '14 months ago',
      avatar: 'JW',
      color: '#ef4444',
      summary: 'Will is 12 years old and does not reflect current asset distribution. Trust documents need updating following 2022 property sale.',
      pillars: {
        will: { status: 'outdated', label: 'Will — Outdated', note: 'Last updated 2012. Does not include Lakewood property or 401(k) rollover IRA.' },
        trust: { status: 'partial', label: 'Trust — Needs Update', note: 'Revocable living trust in place; schedule of assets not updated since 2019.' },
        beneficiary: { status: 'alert', label: 'Beneficiaries — Alert', note: 'Ex-spouse still listed as primary on $380K IRA. Update required immediately.' },
        pow: { status: 'ok', label: 'Power of Attorney — On File', note: 'Durable POA executed 2021. Healthcare proxy current.' },
        legacy: { status: 'partial', label: 'Legacy Plan — Partial', note: 'Charitable giving strategy in draft. Foundation structure not yet established.' }
      },
      coordinators: ['Estate Attorney: Michael Crane (Crane & Webb)', 'CPA: Linda Torres'],
      aiRec: 'Priority: update IRA beneficiary designation immediately — this overrides any will. Schedule estate attorney review within 60 days.'
    },
    {
      id: 'ep002',
      name: 'Sandra Williams',
      age: 61,
      estateValue: '$1.8M',
      status: 'current',
      statusLabel: 'Current',
      lastReview: '4 months ago',
      avatar: 'SW',
      color: '#22c55e',
      summary: 'Estate plan fully updated following 2023 review. All documents current. Annual beneficiary check-in scheduled.',
      pillars: {
        will: { status: 'ok', label: 'Will — Current', note: 'Updated June 2023. Reflects all assets and distribution wishes.' },
        trust: { status: 'ok', label: 'Trust — Current', note: 'Irrevocable life insurance trust (ILIT) in place. NYL policy correctly owned by trust.' },
        beneficiary: { status: 'ok', label: 'Beneficiaries — Verified', note: 'All designations reviewed June 2023. Primary and contingent confirmed.' },
        pow: { status: 'ok', label: 'Power of Attorney — On File', note: 'Healthcare proxy and financial POA both current.' },
        legacy: { status: 'ok', label: 'Legacy Plan — Active', note: 'Charitable remainder trust funded. Donor-advised fund established.' }
      },
      coordinators: ['Estate Attorney: Patricia Holt (Holt Law Group)', 'CPA: James Nguyen', 'Financial Advisor: Self-directed'],
      aiRec: 'Estate plan in excellent shape. Next annual check-in due October 2024. Consider reviewing ILIT premium funding strategy before year-end.'
    },
    {
      id: 'ep003',
      name: 'Linda Morrison',
      age: 74,
      estateValue: '$2.9M',
      status: 'urgent',
      statusLabel: 'Urgent',
      lastReview: '3 years ago',
      avatar: 'LM',
      color: '#ef4444',
      summary: 'No trust structure in place. Estate will pass through probate without action. Potential estate tax exposure above federal exemption threshold.',
      pillars: {
        will: { status: 'outdated', label: 'Will — Very Outdated', note: 'Will dated 2009. Three major asset changes not reflected. Probate risk is high.' },
        trust: { status: 'missing', label: 'Trust — Not Established', note: 'No living trust in place. Estate will require full probate — 12–18 month process.' },
        beneficiary: { status: 'alert', label: 'Beneficiaries — Critical', note: 'Deceased sibling listed as beneficiary on $220K annuity. Must be corrected now.' },
        pow: { status: 'outdated', label: 'Power of Attorney — Expired Agent', note: 'POA agent (former spouse) no longer valid. New agent must be designated.' },
        legacy: { status: 'missing', label: 'Legacy Plan — None', note: 'No legacy or charitable giving strategy documented.' }
      },
      coordinators: ['Estate Attorney: None on file — referral needed'],
      aiRec: 'Urgent: correct annuity beneficiary today. Refer to estate attorney immediately. Trust formation could save $80K+ in probate costs and 12+ months of estate settlement time.'
    },
    {
      id: 'ep004',
      name: 'Maria Gonzalez',
      age: 58,
      estateValue: '$1.1M',
      status: 'in-progress',
      statusLabel: 'In Progress',
      lastReview: '2 months ago',
      avatar: 'MG',
      color: '#f59e0b',
      summary: 'Estate planning initiated following life insurance review. Trust formation in progress with referred estate attorney.',
      pillars: {
        will: { status: 'partial', label: 'Will — In Draft', note: 'Attorney has draft will for review. Signing appointment scheduled next month.' },
        trust: { status: 'partial', label: 'Trust — In Formation', note: 'Revocable living trust being drafted. Funding schedule to follow execution.' },
        beneficiary: { status: 'ok', label: 'Beneficiaries — Updated', note: 'All NYL policy and account beneficiaries updated as of last month.' },
        pow: { status: 'partial', label: 'Power of Attorney — Pending', note: 'Healthcare proxy drafted; financial POA pending attorney appointment.' },
        legacy: { status: 'partial', label: 'Legacy Plan — Discussing', note: 'Wants to leave $50K to university scholarship fund. Mechanism TBD.' }
      },
      coordinators: ['Estate Attorney: Robert Vega (referred by NYL)', 'CPA: Carlos Reyes'],
      aiRec: 'Good momentum — keep attorney appointment on track. Once trust is executed, ensure NYL life policy ownership is transferred into trust before next renewal.'
    },
    {
      id: 'ep005',
      name: 'Robert Chen',
      age: 52,
      estateValue: '$870K',
      status: 'no-plan',
      statusLabel: 'No Plan',
      lastReview: 'Never',
      avatar: 'RC',
      color: '#ef4444',
      summary: 'No estate documents on file. Young family with two minor children — guardianship must be established urgently.',
      pillars: {
        will: { status: 'missing', label: 'Will — None', note: 'No will on file. Minor children have no designated guardian. High legal exposure.' },
        trust: { status: 'missing', label: 'Trust — None', note: 'No trust structure. Life insurance proceeds would go to court-administered account for minors.' },
        beneficiary: { status: 'partial', label: 'Beneficiaries — Partial', note: 'NYL policy has spouse as primary. No contingent beneficiary for children.' },
        pow: { status: 'missing', label: 'Power of Attorney — None', note: 'No POA or healthcare directive on file.' },
        legacy: { status: 'missing', label: 'Legacy Plan — None', note: 'No legacy planning discussion initiated.' }
      },
      coordinators: ['Estate Attorney: None — referral needed urgently'],
      aiRec: 'Most urgent case on book: minor children with no guardianship document. A simple will can resolve this within weeks. Refer to estate attorney today and add contingent beneficiary to policy immediately.'
    },
    {
      id: 'ep006',
      name: 'Dorothy Wilson',
      age: 79,
      estateValue: '$3.6M',
      status: 'current',
      statusLabel: 'Current',
      lastReview: '6 months ago',
      avatar: 'DW',
      color: '#22c55e',
      summary: 'Comprehensive estate plan in place. Irrevocable trust, charitable giving, and generation-skipping transfer strategy all active.',
      pillars: {
        will: { status: 'ok', label: 'Will — Current', note: 'Pour-over will updated 2023. Coordinates with trust for seamless transfer.' },
        trust: { status: 'ok', label: 'Trust — Active', note: 'Irrevocable trust funded with real estate and investment portfolio. GST exemption allocated.' },
        beneficiary: { status: 'ok', label: 'Beneficiaries — Verified', note: 'All designations reviewed and aligned with trust strategy.' },
        pow: { status: 'ok', label: 'Power of Attorney — On File', note: 'Son designated as agent. Healthcare directive current.' },
        legacy: { status: 'ok', label: 'Legacy Plan — Fully Active', note: 'Community foundation donor-advised fund active. $200K annual grant cycle in place.' }
      },
      coordinators: ['Estate Attorney: Harrison Wolfe (Wolfe & Associates)', 'CPA: Patricia Kim', 'Trust Officer: First National Bank'],
      aiRec: 'Exemplary plan. Monitor federal estate tax exemption changes (sunsets 2025). Recommend scheduling mid-year review with attorney to assess any GST strategy adjustments.'
    }
  ];

  var EP_TABS = [
    { key: 'overview',    label: 'Overview' },
    { key: 'documents',   label: 'Documents' },
    { key: 'beneficiary', label: 'Beneficiaries' },
    { key: 'advisors',    label: 'Advisors' },
    { key: 'legacy',      label: 'Legacy Plan' },
    { key: 'ai',          label: 'AI Insights' }
  ];

  var selectedEpClient = null;

  // ── KPI bar ───────────────────────────────────────────────────────────────
  function renderEpKpiBar() {
    var bar = document.getElementById('prop-kpi-bar');
    if (!bar) return;
    var urgent   = EP_CLIENTS.filter(function(c) { return c.status === 'urgent' || c.status === 'no-plan'; }).length;
    var current  = EP_CLIENTS.filter(function(c) { return c.status === 'current'; }).length;
    var inProg   = EP_CLIENTS.filter(function(c) { return c.status === 'in-progress'; }).length;
    var needsRev = EP_CLIENTS.filter(function(c) { return c.status === 'needs-review'; }).length;
    bar.innerHTML =
      '<div class="ep-kpi-card ep-kpi-urgent"><div class="ep-kpi-value">' + urgent + '</div><div class="ep-kpi-label">Urgent Action</div></div>' +
      '<div class="ep-kpi-card ep-kpi-review"><div class="ep-kpi-value">' + needsRev + '</div><div class="ep-kpi-label">Needs Review</div></div>' +
      '<div class="ep-kpi-card ep-kpi-progress"><div class="ep-kpi-value">' + inProg + '</div><div class="ep-kpi-label">In Progress</div></div>' +
      '<div class="ep-kpi-card ep-kpi-current"><div class="ep-kpi-value">' + current + '</div><div class="ep-kpi-label">Fully Current</div></div>' +
      '<div class="ep-kpi-card ep-kpi-total"><div class="ep-kpi-value">' + EP_CLIENTS.length + '</div><div class="ep-kpi-label">Estate Clients</div></div>';
  }

  // ── Client list ───────────────────────────────────────────────────────────
  function renderEpClientList() {
    var list = document.getElementById('prop-list');
    if (!list) return;
    list.innerHTML = '<div class="ep-list-header"><span class="ep-list-title">Estate Planning Clients</span><span class="ep-list-sub">Click to open estate profile</span></div>';
    EP_CLIENTS.forEach(function(c) {
      var div = document.createElement('div');
      div.className = 'ep-client-item' + (selectedEpClient && selectedEpClient.id === c.id ? ' ep-client-active' : '');
      div.onclick = function() { selectEpClient(c); };
      div.innerHTML =
        '<div class="ep-client-avatar" style="background:' + c.color + '">' + c.avatar + '</div>' +
        '<div class="ep-client-info">' +
          '<div class="ep-client-name">' + c.name + '</div>' +
          '<div class="ep-client-meta">Age ' + c.age + ' &middot; Estate: ' + c.estateValue + '</div>' +
          '<div class="ep-client-review">Last reviewed: ' + c.lastReview + '</div>' +
        '</div>' +
        '<div class="ep-status-badge ep-status-' + c.status + '">' + c.statusLabel + '</div>';
      list.appendChild(div);
    });
  }

  // ── Client detail ─────────────────────────────────────────────────────────
  function selectEpClient(client) {
    selectedEpClient = client;
    renderEpClientList();

    var empty = document.getElementById('prop-detail-empty');
    var panel = document.getElementById('prop-detail-panel');
    if (empty) empty.style.display = 'none';
    if (!panel) return;
    panel.style.display = 'block';

    panel.innerHTML =
      '<div class="ep-detail-header">' +
        '<div class="ep-detail-avatar" style="background:' + client.color + '">' + client.avatar + '</div>' +
        '<div class="ep-detail-hinfo">' +
          '<div class="ep-detail-name">' + client.name + '</div>' +
          '<div class="ep-detail-meta">Age ' + client.age + ' &middot; Estate Value: ' + client.estateValue + '</div>' +
          '<div class="ep-detail-meta" style="margin-top:4px">' +
            '<span class="ep-status-badge ep-status-' + client.status + '">' + client.statusLabel + '</span>' +
            ' &nbsp; Last reviewed: ' + client.lastReview +
          '</div>' +
        '</div>' +
        '<button class="ep-schedule-btn" onclick="window.openEpSchedule && window.openEpSchedule(\'' + client.id + '\')"><i class="fas fa-calendar-plus"></i> Schedule Review</button>' +
      '</div>' +
      '<div class="ep-summary-bar"><i class="fas fa-info-circle"></i> ' + client.summary + '</div>' +
      '<div class="ep-tab-bar">' +
        EP_TABS.map(function(tab) {
          return '<button class="ep-tab-btn" id="ep-tab-btn-' + tab.key + '" onclick="switchEpTab(\'' + tab.key + '\', this)">' + tab.label + '</button>';
        }).join('') +
      '</div>' +
      EP_TABS.map(function(tab) {
        return '<div class="ep-tab-panel" id="ep-tab-' + tab.key + '" style="display:none">' + renderEpTabContent(tab.key, client) + '</div>';
      }).join('');

    // Activate first tab
    switchEpTab('overview', panel.querySelector('#ep-tab-btn-overview'));
  }

  function renderEpTabContent(key, c) {
    if (key === 'overview') {
      return '<div class="ep-overview-grid">' +
        Object.keys(c.pillars).map(function(pk) {
          var p = c.pillars[pk];
          var iconMap = { ok: 'fa-check-circle ep-icon-ok', partial: 'fa-exclamation-circle ep-icon-partial', outdated: 'fa-clock ep-icon-outdated', alert: 'fa-exclamation-triangle ep-icon-alert', missing: 'fa-times-circle ep-icon-missing' };
          var icon = iconMap[p.status] || 'fa-circle ep-icon-partial';
          return '<div class="ep-pillar-card">' +
            '<div class="ep-pillar-header"><i class="fas ' + icon + '"></i><span class="ep-pillar-label">' + p.label + '</span></div>' +
            '<div class="ep-pillar-note">' + p.note + '</div>' +
          '</div>';
        }).join('') +
      '</div>';
    }
    if (key === 'documents') {
      var docs = [
        { name: 'Last Will & Testament', status: c.pillars.will.status, updated: c.lastReview },
        { name: 'Revocable Living Trust', status: c.pillars.trust.status, updated: c.lastReview },
        { name: 'Power of Attorney', status: c.pillars.pow.status, updated: c.lastReview },
        { name: 'Healthcare Directive / Proxy', status: c.pillars.pow.status, updated: c.lastReview }
      ];
      return '<div class="ep-docs-list">' +
        docs.map(function(d) {
          var icon = d.status === 'ok' ? 'fa-file-alt ep-icon-ok' : d.status === 'missing' ? 'fa-file ep-icon-missing' : 'fa-file-alt ep-icon-partial';
          return '<div class="ep-doc-row">' +
            '<i class="fas ' + icon + '"></i>' +
            '<span class="ep-doc-name">' + d.name + '</span>' +
            '<span class="ep-doc-status ep-doc-' + d.status + '">' + d.status.charAt(0).toUpperCase() + d.status.slice(1) + '</span>' +
            '<span class="ep-doc-updated">Last: ' + d.updated + '</span>' +
            '<button class="ep-doc-action">Request Update</button>' +
          '</div>';
        }).join('') +
        '<div class="ep-upload-row"><i class="fas fa-upload"></i> <button class="ep-upload-btn">Upload Signed Documents</button></div>' +
      '</div>';
    }
    if (key === 'beneficiary') {
      var bStatus = c.pillars.beneficiary;
      return '<div class="ep-beneficiary-section">' +
        '<div class="ep-bene-alert ep-bene-' + bStatus.status + '">' +
          '<i class="fas fa-' + (bStatus.status === 'ok' ? 'check-circle' : 'exclamation-triangle') + '"></i>' +
          '<div>' +
            '<div class="ep-bene-alert-title">' + bStatus.label + '</div>' +
            '<div class="ep-bene-alert-note">' + bStatus.note + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="ep-bene-grid">' +
          '<div class="ep-bene-col"><div class="ep-bene-col-header">NYL Policies</div>' +
            '<div class="ep-bene-row"><span>Whole Life #WL-4821</span><span class="ep-bene-who">Primary: Spouse</span><span class="ep-bene-tag ep-bene-ok">Verified</span></div>' +
            '<div class="ep-bene-row"><span>Term Life #TL-9904</span><span class="ep-bene-who">Primary: Spouse</span><span class="ep-bene-tag ep-bene-ok">Verified</span></div>' +
          '</div>' +
          '<div class="ep-bene-col"><div class="ep-bene-col-header">Retirement Accounts</div>' +
            '<div class="ep-bene-row"><span>IRA Rollover</span><span class="ep-bene-who">See status above</span><span class="ep-bene-tag ep-bene-' + bStatus.status + '">' + bStatus.statusLabel + '</span></div>' +
            '<div class="ep-bene-row"><span>401(k)</span><span class="ep-bene-who">Primary: Spouse</span><span class="ep-bene-tag ep-bene-ok">Verified</span></div>' +
          '</div>' +
        '</div>' +
        '<button class="ep-bene-update-btn"><i class="fas fa-edit"></i> Initiate Beneficiary Update</button>' +
      '</div>';
    }
    if (key === 'advisors') {
      return '<div class="ep-advisors-section">' +
        '<div class="ep-advisors-header">Coordinating Advisors</div>' +
        '<div class="ep-advisors-note">NYL agents coordinate with the client\'s broader advisory team for a holistic estate strategy.</div>' +
        '<div class="ep-advisor-list">' +
          c.coordinators.map(function(coord) {
            var parts = coord.split(':');
            var role = parts[0].trim();
            var name = parts.slice(1).join(':').trim();
            return '<div class="ep-advisor-row">' +
              '<div class="ep-advisor-icon"><i class="fas fa-user-tie"></i></div>' +
              '<div class="ep-advisor-info">' +
                '<div class="ep-advisor-role">' + role + '</div>' +
                '<div class="ep-advisor-name">' + name + '</div>' +
              '</div>' +
              '<button class="ep-advisor-contact">Contact</button>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<div class="ep-referral-box">' +
          '<i class="fas fa-handshake"></i>' +
          '<div><div class="ep-referral-title">Need an Estate Attorney?</div>' +
          '<div class="ep-referral-note">NYL can provide a warm referral to a vetted estate planning attorney in your client\'s area.</div></div>' +
          '<button class="ep-referral-btn">Request Referral</button>' +
        '</div>' +
      '</div>';
    }
    if (key === 'legacy') {
      var legacyStatus = c.pillars.legacy;
      return '<div class="ep-legacy-section">' +
        '<div class="ep-legacy-header"><i class="fas fa-heart"></i> Legacy & Charitable Planning</div>' +
        '<div class="ep-legacy-status ep-legacy-' + legacyStatus.status + '">' +
          '<div class="ep-legacy-status-label">' + legacyStatus.label + '</div>' +
          '<div class="ep-legacy-status-note">' + legacyStatus.note + '</div>' +
        '</div>' +
        '<div class="ep-legacy-options">' +
          '<div class="ep-legacy-option"><i class="fas fa-landmark"></i><div><div class="ep-legacy-opt-title">Donor-Advised Fund</div><div class="ep-legacy-opt-desc">Flexible charitable giving with immediate tax deduction</div></div></div>' +
          '<div class="ep-legacy-option"><i class="fas fa-university"></i><div><div class="ep-legacy-opt-title">Charitable Remainder Trust</div><div class="ep-legacy-opt-desc">Income stream to client, remainder to charity at death</div></div></div>' +
          '<div class="ep-legacy-option"><i class="fas fa-users"></i><div><div class="ep-legacy-opt-title">Generation-Skipping Transfer</div><div class="ep-legacy-opt-desc">Pass assets to grandchildren tax-efficiently</div></div></div>' +
          '<div class="ep-legacy-option"><i class="fas fa-building"></i><div><div class="ep-legacy-opt-title">Private Foundation</div><div class="ep-legacy-opt-desc">Structured philanthropy with family governance</div></div></div>' +
        '</div>' +
      '</div>';
    }
    if (key === 'ai') {
      return '<div class="ep-ai-section">' +
        '<div class="ep-ai-banner"><i class="fas fa-robot"></i> AI Estate Planning Insights</div>' +
        '<div class="ep-ai-rec-card">' +
          '<div class="ep-ai-rec-icon"><i class="fas fa-lightbulb"></i></div>' +
          '<div class="ep-ai-rec-body">' +
            '<div class="ep-ai-rec-title">Primary Recommendation</div>' +
            '<div class="ep-ai-rec-text">' + c.aiRec + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="ep-ai-checklist-header">Estate Readiness Checklist</div>' +
        '<div class="ep-ai-checklist">' +
          Object.keys(c.pillars).map(function(pk) {
            var p = c.pillars[pk];
            var done = p.status === 'ok';
            return '<div class="ep-ai-check-item ep-ai-check-' + (done ? 'ok' : 'pending') + '">' +
              '<i class="fas fa-' + (done ? 'check-circle' : 'circle') + '"></i>' +
              '<span>' + p.label + '</span>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>';
    }
    return '<div class="ep-placeholder">Content coming soon</div>';
  }

  // ── Tab switching ─────────────────────────────────────────────────────────
  window.switchEpTab = function(key, el) {
    EP_TABS.forEach(function(tab) {
      var panel = document.getElementById('ep-tab-' + tab.key);
      var btn   = document.getElementById('ep-tab-btn-' + tab.key);
      if (panel) panel.style.display = tab.key === key ? 'block' : 'none';
      if (btn)   btn.classList.toggle('ep-tab-active', tab.key === key);
    });
  };

  // ── Init ──────────────────────────────────────────────────────────────────
  function initEstatePlanningPage() {
    var kpi = document.getElementById('prop-kpi-bar');
    if (!kpi) return;

    renderEpKpiBar();
    renderEpClientList();

    // Auto-open Linda Morrison (urgent — most critical)
    var autoClient = EP_CLIENTS.find(function(c) { return c.id === 'ep003'; }) || EP_CLIENTS[0];
    selectEpClient(autoClient);
  }

  // ── NavigateTo intercept ──────────────────────────────────────────────────
  var _orig_navigateTo_ep = window.navigateTo;
  window.navigateTo = function(page) {
    _orig_navigateTo_ep(page);
    if (page === 'adv-estate') {
      requestAnimationFrame(function() {
        setTimeout(function() {
          var t = document.getElementById('page-title');
          var b = document.getElementById('page-breadcrumb');
          if (t) t.textContent = 'Estate Planning';
          if (b) b.textContent = 'Advisory / Estate Planning';
          initEstatePlanningPage();
        }, 80);
      });
    }
  };

  console.log('ADV Estate module loaded');
})();
