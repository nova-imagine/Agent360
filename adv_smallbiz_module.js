(function() {
  'use strict';

  // ── ADV Small Business Services Module ────────────────────────────────────
  // NYL pillar: Small Business Services — "Insurance planning and retirement
  // for employees, executives, or business owners, plus many other options
  // to help a small business thrive."
  // Container IDs (from tpl-adv-smallbiz shell):
  //   pf-kpi-bar, pf-client-list, pf-detail-empty, pf-detail-panel
  // ──────────────────────────────────────────────────────────────────────────

  var SB_CLIENTS = [
    {
      id: 'sb001',
      name: 'James Whitfield',
      bizName: 'Whitfield Dental Group',
      bizType: 'Medical Practice',
      employees: 18,
      status: 'needs-review',
      statusLabel: 'Needs Review',
      avatar: 'JW',
      color: '#f59e0b',
      lastReview: '11 months ago',
      summary: 'Group benefits last reviewed pre-pandemic. Key-man coverage insufficient relative to current practice valuation. Executive bonus plan not yet implemented.',
      products: {
        keyman: { status: 'partial', label: 'Key-Man Insurance — Underinsured', note: 'Current policy: $500K. Practice valuation: $2.1M. Gap of $1.6M if owner becomes disabled or dies.' },
        group: { status: 'active', label: 'Group Benefits — Active', note: 'Group health (15 enrolled), group dental/vision, $50K group term life. Up for renewal in 4 months.' },
        execComp: { status: 'missing', label: 'Executive Comp — Not Implemented', note: 'No formal executive bonus or deferred compensation plan. 3 associate dentists are retention risk.' },
        succession: { status: 'partial', label: 'Business Succession — Draft', note: 'Buy-sell agreement in draft with partner Dr. Nguyen. Life insurance funding not yet in place.' },
        retirement: { status: 'active', label: 'Retirement Plan — SIMPLE IRA', note: 'SIMPLE IRA with 3% match for all employees. May benefit from upgrading to Solo 401(k) or defined benefit.' }
      },
      aiRec: 'Priority: increase key-man coverage to at least $1.5M and fund the buy-sell agreement with cross-purchase life insurance. Review group benefits before renewal window closes.'
    },
    {
      id: 'sb002',
      name: 'Sandra Williams',
      bizName: 'Williams Marketing LLC',
      bizType: 'Marketing Consultancy',
      employees: 7,
      status: 'current',
      statusLabel: 'Current',
      avatar: 'SW',
      color: '#22c55e',
      lastReview: '3 months ago',
      summary: 'Comprehensive small business plan in place. All products reviewed and current. Annual review scheduled.',
      products: {
        keyman: { status: 'active', label: 'Key-Man Insurance — Adequate', note: '$1.2M policy on owner. Covers outstanding business loan and 2-year revenue replacement.' },
        group: { status: 'active', label: 'Group Benefits — Active', note: 'Group health, dental, vision, life, and short-term disability. 100% employee participation.' },
        execComp: { status: 'active', label: 'Executive Comp — In Place', note: 'Executive bonus (Section 162) plan for owner and office manager. NYL whole life vehicles in use.' },
        succession: { status: 'active', label: 'Business Succession — Funded', note: 'Buy-sell agreement signed and fully funded with cross-purchase life insurance policies.' },
        retirement: { status: 'active', label: 'Retirement Plan — SEP IRA', note: 'SEP IRA with maximum contributions. Planning review suggests Solo 401(k) transition for higher limits.' }
      },
      aiRec: 'Excellent coverage across all pillars. Consider upgrading SEP IRA to Solo 401(k) to allow catch-up contributions ($7,500/year). Next annual review due June 2024.'
    },
    {
      id: 'sb003',
      name: 'Robert Chen',
      bizName: 'Chen Tech Solutions',
      bizType: 'IT Consulting',
      employees: 12,
      status: 'urgent',
      statusLabel: 'Urgent',
      avatar: 'RC',
      color: '#ef4444',
      lastReview: 'Never',
      summary: 'Growing tech firm with no business insurance or retirement plan. Key-man and succession planning completely absent. High risk profile.',
      products: {
        keyman: { status: 'missing', label: 'Key-Man Insurance — None', note: 'Owner is sole revenue driver. No coverage if Chen is disabled or dies. Business would likely fail.' },
        group: { status: 'missing', label: 'Group Benefits — None', note: 'No group benefits. Competing for tech talent without standard benefits package is a significant disadvantage.' },
        execComp: { status: 'missing', label: 'Executive Comp — None', note: 'No retention strategy for two senior engineers who are critical to $1.8M annual revenue.' },
        succession: { status: 'missing', label: 'Business Succession — None', note: 'No buy-sell agreement. No succession plan. Business has no defined path in owner disability or death scenario.' },
        retirement: { status: 'missing', label: 'Retirement Plan — None', note: 'No business retirement plan. Owner is funding personal IRA only ($6,500/year).' }
      },
      aiRec: 'Immediate action on key-man insurance and group benefits. A $1M key-man policy is affordable given Chen\'s age and health. Group benefits package will help retain critical talent. This client represents a significant opportunity across all five pillars.'
    },
    {
      id: 'sb004',
      name: 'Maria Gonzalez',
      bizName: 'Gonzalez Catering & Events',
      bizType: 'Food & Hospitality',
      employees: 24,
      status: 'in-progress',
      statusLabel: 'In Progress',
      avatar: 'MG',
      color: '#f59e0b',
      lastReview: '2 months ago',
      summary: 'Group health plan enrollment in progress. Key-man policy application submitted. Succession planning discussion initiated.',
      products: {
        keyman: { status: 'partial', label: 'Key-Man Insurance — Applied', note: 'Application submitted for $750K policy. Underwriting in progress. Expected approval in 2 weeks.' },
        group: { status: 'partial', label: 'Group Benefits — Enrolling', note: 'Group health plan selected. Open enrollment running this month. 18 of 24 employees enrolled so far.' },
        execComp: { status: 'missing', label: 'Executive Comp — Not Started', note: 'Discussion deferred until group plan is in place. Two managers flagged for retention review.' },
        succession: { status: 'partial', label: 'Business Succession — Discussing', note: 'Daughter identified as potential successor. Valuation not yet completed. Buy-sell terms under discussion.' },
        retirement: { status: 'missing', label: 'Retirement Plan — None', note: 'SIMPLE IRA proposal prepared. Waiting for group plan to finalize before presenting to owner.' }
      },
      aiRec: 'Good progress — follow up on underwriting status weekly. Once key-man is approved, pivot to SIMPLE IRA presentation and set executive comp meeting. Target full coverage by Q3.'
    },
    {
      id: 'sb005',
      name: 'Dorothy Wilson',
      bizName: 'Wilson Family Properties',
      bizType: 'Real Estate Holdings',
      employees: 4,
      status: 'current',
      statusLabel: 'Current',
      avatar: 'DW',
      color: '#22c55e',
      lastReview: '5 months ago',
      summary: 'Closely-held family business with comprehensive succession and executive comp strategy. All products current.',
      products: {
        keyman: { status: 'active', label: 'Key-Man Insurance — Adequate', note: '$2M survivorship policy covering Dorothy and son Thomas. Tied to estate and succession plan.' },
        group: { status: 'active', label: 'Group Benefits — Active', note: 'Small group plan covering 4 FTEs. Simple HRA arrangement in place for owner.' },
        execComp: { status: 'active', label: 'Executive Comp — Active', note: 'Executive bonus plan for son Thomas as part of succession grooming. Whole life vehicle accumulating.' },
        succession: { status: 'active', label: 'Business Succession — Funded', note: 'Family LLC transfer in progress. Buy-sell funded with survivorship policy. Trust coordinates transfer.' },
        retirement: { status: 'active', label: 'Retirement Plan — Defined Benefit', note: 'Defined benefit pension plan for Dorothy (age 79) — maximizes current-year deduction of $265K.' }
      },
      aiRec: 'Model client for small business services. LLC transfer nearing completion. Schedule annual strategy review to confirm defined benefit plan contributions align with current IRS limits.'
    },
    {
      id: 'sb006',
      name: 'Linda Morrison',
      bizName: 'Morrison Consulting Partners',
      bizType: 'Management Consulting',
      employees: 9,
      status: 'needs-review',
      statusLabel: 'Needs Review',
      avatar: 'LM',
      color: '#f59e0b',
      lastReview: '16 months ago',
      summary: 'Group benefits overdue for renewal review. Key-man coverage was adequate but practice has grown significantly since last assessment.',
      products: {
        keyman: { status: 'partial', label: 'Key-Man Insurance — May Be Insufficient', note: 'Policy written in 2020 for $600K. Firm revenue grew 40% since. Recommend re-evaluation.' },
        group: { status: 'partial', label: 'Group Benefits — Renewal Overdue', note: 'Group plan renewed on autopilot. 3 new hires not enrolled. Dependent coverage changes not recorded.' },
        execComp: { status: 'missing', label: 'Executive Comp — None', note: 'No executive bonus or deferred comp in place. Senior partner retains all comp as S-corp distributions.' },
        succession: { status: 'missing', label: 'Business Succession — None', note: 'No buy-sell agreement. Partner buyout terms not documented. High legal exposure.' },
        retirement: { status: 'active', label: 'Retirement Plan — Solo 401(k)', note: 'Solo 401(k) contributing $66K/year (max). Partners not covered — ERISA exposure if classified as employees.' }
      },
      aiRec: 'Schedule a full business review. Priority items: update group enrollment for new hires, increase key-man coverage by at least $400K, draft buy-sell agreement with attorney. ERISA risk re: 401(k) eligibility should be reviewed by plan counsel.'
    }
  ];

  var SB_TABS = [
    { key: 'overview',    label: 'Overview' },
    { key: 'keyman',      label: 'Key-Man' },
    { key: 'benefits',    label: 'Group Benefits' },
    { key: 'execcomp',    label: 'Exec Comp' },
    { key: 'succession',  label: 'Succession' },
    { key: 'ai',          label: 'AI Insights' }
  ];

  var selectedSbClient = null;

  // ── KPI bar ───────────────────────────────────────────────────────────────
  function renderSbKpiBar() {
    var bar = document.getElementById('pf-kpi-bar');
    if (!bar) return;
    var urgent  = SB_CLIENTS.filter(function(c) { return c.status === 'urgent'; }).length;
    var current = SB_CLIENTS.filter(function(c) { return c.status === 'current'; }).length;
    var inProg  = SB_CLIENTS.filter(function(c) { return c.status === 'in-progress'; }).length;
    var review  = SB_CLIENTS.filter(function(c) { return c.status === 'needs-review'; }).length;
    var totalEmp = SB_CLIENTS.reduce(function(sum, c) { return sum + c.employees; }, 0);
    bar.innerHTML =
      '<div class="sb-kpi-card sb-kpi-urgent"><div class="sb-kpi-value">' + urgent + '</div><div class="sb-kpi-label">Urgent Action</div></div>' +
      '<div class="sb-kpi-card sb-kpi-review"><div class="sb-kpi-value">' + review + '</div><div class="sb-kpi-label">Needs Review</div></div>' +
      '<div class="sb-kpi-card sb-kpi-progress"><div class="sb-kpi-value">' + inProg + '</div><div class="sb-kpi-label">In Progress</div></div>' +
      '<div class="sb-kpi-card sb-kpi-current"><div class="sb-kpi-value">' + current + '</div><div class="sb-kpi-label">Fully Covered</div></div>' +
      '<div class="sb-kpi-card sb-kpi-emp"><div class="sb-kpi-value">' + totalEmp + '</div><div class="sb-kpi-label">Total Employees</div></div>';
  }

  // ── Client list ───────────────────────────────────────────────────────────
  function renderSbClientList() {
    var list = document.getElementById('pf-client-list');
    if (!list) return;
    list.innerHTML = '<div class="sb-list-header"><span class="sb-list-title">Small Business Clients</span><span class="sb-list-sub">Click to open business profile</span></div>';
    SB_CLIENTS.forEach(function(c) {
      var div = document.createElement('div');
      div.className = 'sb-client-item' + (selectedSbClient && selectedSbClient.id === c.id ? ' sb-client-active' : '');
      div.onclick = function() { selectSbClient(c); };
      div.innerHTML =
        '<div class="sb-client-avatar" style="background:' + c.color + '">' + c.avatar + '</div>' +
        '<div class="sb-client-info">' +
          '<div class="sb-client-name">' + c.name + '</div>' +
          '<div class="sb-biz-name">' + c.bizName + '</div>' +
          '<div class="sb-client-meta">' + c.bizType + ' &middot; ' + c.employees + ' employees</div>' +
        '</div>' +
        '<div class="sb-status-badge sb-status-' + c.status + '">' + c.statusLabel + '</div>';
      list.appendChild(div);
    });
  }

  // ── Client detail ─────────────────────────────────────────────────────────
  function selectSbClient(client) {
    selectedSbClient = client;
    renderSbClientList();

    var empty = document.getElementById('pf-detail-empty');
    var panel = document.getElementById('pf-detail-panel');
    if (empty) empty.style.display = 'none';
    if (!panel) return;
    panel.style.display = 'block';

    // Score: count active products
    var score = Object.keys(client.products).filter(function(k) { return client.products[k].status === 'active'; }).length;
    var totalProducts = Object.keys(client.products).length;

    panel.innerHTML =
      '<div class="sb-detail-header">' +
        '<div class="sb-detail-avatar" style="background:' + client.color + '">' + client.avatar + '</div>' +
        '<div class="sb-detail-hinfo">' +
          '<div class="sb-detail-name">' + client.name + '</div>' +
          '<div class="sb-detail-biz">' + client.bizName + '</div>' +
          '<div class="sb-detail-meta">' + client.bizType + ' &middot; ' + client.employees + ' employees &middot; Last reviewed: ' + client.lastReview + '</div>' +
          '<div style="margin-top:6px"><span class="sb-status-badge sb-status-' + client.status + '">' + client.statusLabel + '</span></div>' +
        '</div>' +
        '<div class="sb-coverage-score">' +
          '<div class="sb-score-value">' + score + '/' + totalProducts + '</div>' +
          '<div class="sb-score-label">Pillars<br>Covered</div>' +
        '</div>' +
      '</div>' +
      '<div class="sb-summary-bar"><i class="fas fa-info-circle"></i> ' + client.summary + '</div>' +
      '<div class="sb-tab-bar">' +
        SB_TABS.map(function(tab) {
          return '<button class="sb-tab-btn" id="sb-tab-btn-' + tab.key + '" onclick="switchSbTab(\'' + tab.key + '\', this)">' + tab.label + '</button>';
        }).join('') +
      '</div>' +
      SB_TABS.map(function(tab) {
        return '<div class="sb-tab-panel" id="sb-tab-' + tab.key + '" style="display:none">' + renderSbTabContent(tab.key, client) + '</div>';
      }).join('');

    switchSbTab('overview', panel.querySelector('#sb-tab-btn-overview'));
  }

  function productStatusIcon(status) {
    var map = { active: 'fa-check-circle sb-icon-active', partial: 'fa-exclamation-circle sb-icon-partial', missing: 'fa-times-circle sb-icon-missing', 'needs-review': 'fa-clock sb-icon-review' };
    return map[status] || 'fa-circle sb-icon-partial';
  }

  function renderSbTabContent(key, c) {
    if (key === 'overview') {
      return '<div class="sb-overview-grid">' +
        Object.keys(c.products).map(function(pk) {
          var p = c.products[pk];
          return '<div class="sb-product-card">' +
            '<div class="sb-product-header"><i class="fas ' + productStatusIcon(p.status) + '"></i><span class="sb-product-label">' + p.label + '</span></div>' +
            '<div class="sb-product-note">' + p.note + '</div>' +
          '</div>';
        }).join('') +
      '</div>';
    }
    if (key === 'keyman') {
      var km = c.products.keyman;
      return '<div class="sb-keyman-section">' +
        '<div class="sb-section-header"><i class="fas fa-user-shield"></i> Key-Man Insurance</div>' +
        '<div class="sb-product-status-card sb-product-' + km.status + '">' +
          '<div class="sb-ps-label">' + km.label + '</div>' +
          '<div class="sb-ps-note">' + km.note + '</div>' +
        '</div>' +
        '<div class="sb-keyman-explainer">' +
          '<div class="sb-explainer-title">Why Key-Man Insurance Matters</div>' +
          '<div class="sb-explainer-grid">' +
            '<div class="sb-explainer-item"><i class="fas fa-building"></i><span>Covers business loan obligations if owner dies or is disabled</span></div>' +
            '<div class="sb-explainer-item"><i class="fas fa-users"></i><span>Provides capital to recruit and train a replacement</span></div>' +
            '<div class="sb-explainer-item"><i class="fas fa-chart-line"></i><span>Protects revenue during ownership transition</span></div>' +
            '<div class="sb-explainer-item"><i class="fas fa-handshake"></i><span>Can fund a buy-sell agreement between partners</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="sb-action-row">' +
          '<button class="sb-action-btn sb-action-primary"><i class="fas fa-calculator"></i> Run Coverage Analysis</button>' +
          '<button class="sb-action-btn"><i class="fas fa-file-alt"></i> Generate Illustration</button>' +
        '</div>' +
      '</div>';
    }
    if (key === 'benefits') {
      var gb = c.products.group;
      return '<div class="sb-benefits-section">' +
        '<div class="sb-section-header"><i class="fas fa-heartbeat"></i> Group Benefits</div>' +
        '<div class="sb-product-status-card sb-product-' + gb.status + '">' +
          '<div class="sb-ps-label">' + gb.label + '</div>' +
          '<div class="sb-ps-note">' + gb.note + '</div>' +
        '</div>' +
        '<div class="sb-benefits-grid">' +
          '<div class="sb-benefit-row"><i class="fas fa-hospital"></i><span class="sb-ben-name">Group Health Insurance</span><span class="sb-ben-status sb-ben-' + (gb.status === 'active' ? 'active' : 'missing') + '">' + (gb.status === 'active' ? 'Active' : 'Not in Place') + '</span></div>' +
          '<div class="sb-benefit-row"><i class="fas fa-tooth"></i><span class="sb-ben-name">Group Dental & Vision</span><span class="sb-ben-status sb-ben-' + (gb.status === 'active' ? 'active' : 'missing') + '">' + (gb.status === 'active' ? 'Active' : 'Not in Place') + '</span></div>' +
          '<div class="sb-benefit-row"><i class="fas fa-umbrella"></i><span class="sb-ben-name">Group Life Insurance</span><span class="sb-ben-status sb-ben-' + (gb.status === 'active' ? 'active' : 'missing') + '">' + (gb.status === 'active' ? 'Active' : 'Not in Place') + '</span></div>' +
          '<div class="sb-benefit-row"><i class="fas fa-wheelchair"></i><span class="sb-ben-name">Short-Term Disability</span><span class="sb-ben-status sb-ben-' + (gb.status === 'active' ? 'active' : 'missing') + '">' + (gb.status === 'active' ? 'Active' : 'Not in Place') + '</span></div>' +
        '</div>' +
        '<div class="sb-action-row">' +
          '<button class="sb-action-btn sb-action-primary"><i class="fas fa-plus-circle"></i> Add / Update Benefits</button>' +
          '<button class="sb-action-btn"><i class="fas fa-users"></i> Manage Enrollment</button>' +
        '</div>' +
      '</div>';
    }
    if (key === 'execcomp') {
      var ec = c.products.execComp;
      return '<div class="sb-execcomp-section">' +
        '<div class="sb-section-header"><i class="fas fa-briefcase"></i> Executive Compensation</div>' +
        '<div class="sb-product-status-card sb-product-' + ec.status + '">' +
          '<div class="sb-ps-label">' + ec.label + '</div>' +
          '<div class="sb-ps-note">' + ec.note + '</div>' +
        '</div>' +
        '<div class="sb-execcomp-options">' +
          '<div class="sb-ec-option"><div class="sb-ec-opt-title"><i class="fas fa-star"></i> Executive Bonus (Section 162)</div><div class="sb-ec-opt-desc">Business pays insurance premiums as a bonus — simple, flexible, tax-deductible for the business.</div></div>' +
          '<div class="sb-ec-option"><div class="sb-ec-opt-title"><i class="fas fa-lock"></i> Split Dollar Arrangement</div><div class="sb-ec-opt-desc">Business and executive share premium costs and death benefit. Excellent for retention of key talent.</div></div>' +
          '<div class="sb-ec-option"><div class="sb-ec-opt-title"><i class="fas fa-chart-bar"></i> Deferred Compensation (NQDC)</div><div class="sb-ec-opt-desc">Executive defers income, receives payout at retirement. Business retains flexibility on funding.</div></div>' +
          '<div class="sb-ec-option"><div class="sb-ec-opt-title"><i class="fas fa-shield-alt"></i> Business Owner Disability</div><div class="sb-ec-opt-desc">Replaces owner income if disability prevents them from working. Protects both personal and business cash flow.</div></div>' +
        '</div>' +
        '<div class="sb-action-row">' +
          '<button class="sb-action-btn sb-action-primary"><i class="fas fa-calculator"></i> Design Exec Comp Plan</button>' +
        '</div>' +
      '</div>';
    }
    if (key === 'succession') {
      var succ = c.products.succession;
      var ret  = c.products.retirement;
      return '<div class="sb-succession-section">' +
        '<div class="sb-section-header"><i class="fas fa-sitemap"></i> Succession & Retirement</div>' +
        '<div class="sb-product-status-card sb-product-' + succ.status + '">' +
          '<div class="sb-ps-label">' + succ.label + '</div>' +
          '<div class="sb-ps-note">' + succ.note + '</div>' +
        '</div>' +
        '<div class="sb-product-status-card sb-product-' + ret.status + '" style="margin-top:12px">' +
          '<div class="sb-ps-label">' + ret.label + '</div>' +
          '<div class="sb-ps-note">' + ret.note + '</div>' +
        '</div>' +
        '<div class="sb-succession-steps">' +
          '<div class="sb-succ-step"><div class="sb-succ-step-num">1</div><div class="sb-succ-step-text"><strong>Business Valuation</strong> — Establish current fair market value for buy-sell pricing</div></div>' +
          '<div class="sb-succ-step"><div class="sb-succ-step-num">2</div><div class="sb-succ-step-text"><strong>Buy-Sell Agreement</strong> — Define trigger events, pricing formula, and transfer terms</div></div>' +
          '<div class="sb-succ-step"><div class="sb-succ-step-num">3</div><div class="sb-succ-step-text"><strong>Insurance Funding</strong> — Life or disability insurance funds the agreement at trigger event</div></div>' +
          '<div class="sb-succ-step"><div class="sb-succ-step-num">4</div><div class="sb-succ-step-text"><strong>Successor Identification</strong> — Family member, partner, key employee, or third-party sale</div></div>' +
          '<div class="sb-succ-step"><div class="sb-succ-step-num">5</div><div class="sb-succ-step-text"><strong>Retirement Plan Alignment</strong> — Coordinate exit timing with retirement income strategy</div></div>' +
        '</div>' +
        '<div class="sb-action-row">' +
          '<button class="sb-action-btn sb-action-primary"><i class="fas fa-file-signature"></i> Start Succession Plan</button>' +
          '<button class="sb-action-btn"><i class="fas fa-piggy-bank"></i> Review Retirement Plan</button>' +
        '</div>' +
      '</div>';
    }
    if (key === 'ai') {
      var covered  = Object.keys(c.products).filter(function(k) { return c.products[k].status === 'active'; }).length;
      var total    = Object.keys(c.products).length;
      var pct      = Math.round((covered / total) * 100);
      return '<div class="sb-ai-section">' +
        '<div class="sb-ai-banner"><i class="fas fa-robot"></i> AI Business Planning Insights</div>' +
        '<div class="sb-ai-rec-card">' +
          '<div class="sb-ai-rec-icon"><i class="fas fa-lightbulb"></i></div>' +
          '<div class="sb-ai-rec-body">' +
            '<div class="sb-ai-rec-title">Primary Recommendation</div>' +
            '<div class="sb-ai-rec-text">' + c.aiRec + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="sb-coverage-bar-section">' +
          '<div class="sb-cov-bar-header">Coverage Completeness: ' + pct + '%</div>' +
          '<div class="sb-cov-bar-bg"><div class="sb-cov-bar-fill" style="width:' + pct + '%;background:' + (pct >= 80 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444') + '"></div></div>' +
        '</div>' +
        '<div class="sb-ai-checklist-header">Small Business Coverage Checklist</div>' +
        '<div class="sb-ai-checklist">' +
          Object.keys(c.products).map(function(pk) {
            var p = c.products[pk];
            var done = p.status === 'active';
            return '<div class="sb-ai-check-item sb-ai-check-' + (done ? 'ok' : 'pending') + '">' +
              '<i class="fas fa-' + (done ? 'check-circle' : 'circle') + '"></i>' +
              '<span>' + p.label + '</span>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>';
    }
    return '<div class="sb-placeholder">Content coming soon</div>';
  }

  // ── Tab switching ─────────────────────────────────────────────────────────
  window.switchSbTab = function(key, el) {
    SB_TABS.forEach(function(tab) {
      var panel = document.getElementById('sb-tab-' + tab.key);
      var btn   = document.getElementById('sb-tab-btn-' + tab.key);
      if (panel) panel.style.display = tab.key === key ? 'block' : 'none';
      if (btn)   btn.classList.toggle('sb-tab-active', tab.key === key);
    });
  };

  // ── Init ──────────────────────────────────────────────────────────────────
  function initSmallBizPage() {
    var kpi = document.getElementById('pf-kpi-bar');
    if (!kpi) return;

    renderSbKpiBar();
    renderSbClientList();

    // Auto-open Robert Chen (urgent — no coverage at all)
    var autoClient = SB_CLIENTS.find(function(c) { return c.id === 'sb003'; }) || SB_CLIENTS[0];
    selectSbClient(autoClient);
  }

  // ── NavigateTo intercept ──────────────────────────────────────────────────
  var _orig_navigateTo_sb = window.navigateTo;
  window.navigateTo = function(page) {
    _orig_navigateTo_sb(page);
    if (page === 'adv-smallbiz') {
      requestAnimationFrame(function() {
        setTimeout(function() {
          var t = document.getElementById('page-title');
          var b = document.getElementById('page-breadcrumb');
          if (t) t.textContent = 'Small Business Services';
          if (b) b.textContent = 'Advisory / Small Business';
          initSmallBizPage();
        }, 80);
      });
    }
  };

  console.log('ADV SmallBiz module loaded');
})();
