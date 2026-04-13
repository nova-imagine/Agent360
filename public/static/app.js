/* =============================================
   NYL AGENT 360 — Frontend JavaScript
   ============================================= */

// ---- NAVIGATION ----
let _currentPage = 'dashboard';

function navigateTo(page) {
  _currentPage = page;

  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const matchingNav = [...document.querySelectorAll('.nav-item')].find(el => {
    const onclick = el.getAttribute('onclick') || '';
    return onclick.includes(`'${page}'`);
  });
  if (matchingNav) matchingNav.classList.add('active');

  // Update page title & breadcrumb
  const titles = {
    dashboard: 'Dashboard',
    clients: 'Client Management',
    policies: 'Policy Management',
    'ai-agents': 'AI Agent Hub',
    sales: 'Sales Pipeline',
    products: 'Product Portfolio',
    reports: 'Reports & Analytics',
    calendar: 'Calendar & Events',
    'ai-insights': 'AI Insights',
    claims: 'Claims Management',
    underwriting: 'Underwriting Pipeline'
  };

  const breadcrumbs = {
    dashboard: 'Home / Dashboard',
    clients: 'Home / Clients',
    policies: 'Home / Policies',
    'ai-agents': 'Home / AI Agents',
    sales: 'Home / Sales',
    products: 'Home / Products',
    reports: 'Home / Reports',
    calendar: 'Home / Calendar',
    'ai-insights': 'Home / Insights / AI Insights',
    claims: 'Home / Claims',
    underwriting: 'Home / Sales / Underwriting'
  };

  const titleEl = document.getElementById('page-title');
  const bcEl = document.getElementById('page-breadcrumb');
  if (titleEl) titleEl.textContent = titles[page] || page;
  if (bcEl) bcEl.textContent = breadcrumbs[page] || '';

  const content = document.getElementById('page-content');
  if (!content) return;

  // ── AI Insights: use native JSX template (tpl-ai-insights) ──
  // Fall through to template loading below

  // Load page content from template
  const templateId = `tpl-${page}`;
  const tpl = document.getElementById(templateId);

  if (tpl) {
    // Clone the template node (deep clone preserves structure without live bindings)
    const clone = tpl.cloneNode(true);
    content.innerHTML = clone.innerHTML;

    // Re-initialize charts after DOM settles
    if (page === 'dashboard') {
      requestAnimationFrame(() => {
        setTimeout(() => {
          initDashboardCharts();
          animateKPICards();
        }, 80);
      });
    } else if (page === 'reports') {
      requestAnimationFrame(() => {
        setTimeout(() => initReportCharts(), 80);
      });
    }
  }
}

// ---- SIDEBAR TOGGLE ----
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('main-content');
  if (sidebar.style.width === '72px') {
    sidebar.style.width = '260px';
    main.style.marginLeft = '260px';
    sidebar.classList.remove('collapsed');
  } else {
    sidebar.style.width = '72px';
    main.style.marginLeft = '72px';
    sidebar.classList.add('collapsed');
  }
}

// ---- DASHBOARD CHARTS ----
function initDashboardCharts() {
  const revenueEl = document.getElementById('revenueChart');
  if (revenueEl) {
    if (revenueEl._chartInstance) revenueEl._chartInstance.destroy();
    revenueEl._chartInstance = new Chart(revenueEl, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Premium Revenue ($K)',
          data: [380, 395, 410, 487, 465, 490, 510, 498, 520, 535, 560, 590],
          borderColor: '#003087',
          backgroundColor: 'rgba(0, 48, 135, 0.08)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#003087',
          pointRadius: 4,
          pointHoverRadius: 6
        }, {
          label: 'Target ($K)',
          data: [400, 410, 420, 440, 460, 475, 490, 505, 520, 535, 550, 570],
          borderColor: '#c8972a',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: {
            backgroundColor: '#1a2744',
            padding: 12,
            callbacks: {
              label: ctx => ` $${ctx.parsed.y}K`
            }
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { callback: val => `$${val}K` }
          }
        }
      }
    });
  }

  // Book Composition donut (used in dashboard)
  const bookCompEl = document.getElementById('bookCompositionChart');
  if (bookCompEl) {
    if (bookCompEl._chartInstance) bookCompEl._chartInstance.destroy();
    bookCompEl._chartInstance = new Chart(bookCompEl, {
      type: 'doughnut',
      data: {
        labels: ['Insurance', 'Investments', 'Retirement', 'Advisory'],
        datasets: [{
          data: [38, 26, 22, 14],
          backgroundColor: ['#003087', '#059669', '#d97706', '#7c3aed'],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a2744',
            padding: 10,
            callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` }
          }
        },
        cutout: '65%'
      }
    });
  }
}

// ---- REPORT CHARTS ----
function initReportCharts() {
  const revEl = document.getElementById('reportRevenueChart');
  if (revEl) {
    if (revEl._chartInstance) { revEl._chartInstance.destroy(); revEl._chartInstance = null; }
    revEl._chartInstance = new Chart(revEl, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Insurance ($K)',
          data: [248, 258, 271, 312, 298, 320],
          backgroundColor: 'rgba(0, 48, 135, 0.82)',
          borderRadius: 4,
          stack: 'revenue'
        }, {
          label: 'Investments ($K)',
          data: [62, 67, 72, 76, 80, 85],
          backgroundColor: 'rgba(5, 150, 105, 0.82)',
          borderRadius: 4,
          stack: 'revenue'
        }, {
          label: 'Retirement ($K)',
          data: [38, 40, 43, 46, 50, 53],
          backgroundColor: 'rgba(217, 119, 6, 0.82)',
          borderRadius: 4,
          stack: 'revenue'
        }, {
          label: 'Advisory ($K)',
          data: [32, 30, 34, 53, 37, 32],
          backgroundColor: 'rgba(124, 58, 237, 0.82)',
          borderRadius: 4,
          stack: 'revenue'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: true, position: 'top', labels: { font: { size: 11 } } } },
        scales: {
          x: { grid: { display: false }, stacked: true },
          y: { stacked: true, ticks: { callback: val => `$${val}K` } }
        }
      }
    });
  }

  const prodEl = document.getElementById('reportProductChart');
  if (prodEl) {
    if (prodEl._chartInstance) { prodEl._chartInstance.destroy(); prodEl._chartInstance = null; }
    prodEl._chartInstance = new Chart(prodEl, {
      type: 'doughnut',
      data: {
        labels: ['Insurance', 'Investments', 'Retirement', 'Advisory'],
        datasets: [{
          data: [64, 18, 9, 9],
          backgroundColor: ['#003087', '#059669', '#d97706', '#7c3aed'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: { display: false }
        },
        cutout: '62%'
      }
    });
  }

  const segEl = document.getElementById('reportSegmentChart');
  if (segEl) {
    if (segEl._chartInstance) { segEl._chartInstance.destroy(); segEl._chartInstance = null; }
    segEl._chartInstance = new Chart(segEl, {
      type: 'bar',
      data: {
        labels: ['Premium', 'High Value', 'Mid Market', 'Emerging'],
        datasets: [{
          label: 'Clients',
          data: [18, 62, 94, 73],
          backgroundColor: ['#7c3aed', '#003087', '#059669', '#d97706'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } } },
        indexAxis: 'y'
      }
    });
  }
}

// ---- CLIENT FUNCTIONS ----
// ---- TOGGLE CLIENT PRODUCT HOLDINGS PANEL ----
function toggleClientProducts(clientId) {
  const panel = document.getElementById(`products-panel-${clientId}`);
  const icon  = document.getElementById(`expand-icon-${clientId}`);
  if (!panel) return;
  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  if (icon) {
    icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
  }
}

function filterClients(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.client-card').forEach(card => {
    const name = card.querySelector('h4')?.textContent.toLowerCase() || '';
    const city = card.querySelector('p')?.textContent.toLowerCase() || '';
    card.style.display = (!q || name.includes(q) || city.includes(q)) ? 'block' : 'none';
  });
}

function filterBySegment(segment) {
  document.querySelectorAll('.client-card').forEach(card => {
    if (!segment) {
      card.style.display = 'block';
    } else {
      const tag = card.querySelector('.segment-tag')?.textContent || '';
      card.style.display = tag.toLowerCase() === segment.toLowerCase() ? 'block' : 'none';
    }
  });
}

// Domain coverage data matching index.tsx clientDomains
const domainCoverage = {
  1: { ins: true,  inv: false, ret: true,  adv: true,  gaps: true  },
  2: { ins: true,  inv: false, ret: false, adv: false, gaps: true  },
  3: { ins: true,  inv: true,  ret: false, adv: true,  gaps: true  },
  4: { ins: true,  inv: false, ret: false, adv: false, gaps: true  },
  5: { ins: true,  inv: false, ret: false, adv: false, gaps: true  },
  6: { ins: true,  inv: true,  ret: true,  adv: false, gaps: true  },
  7: { ins: true,  inv: false, ret: false, adv: false, gaps: true  },
  8: { ins: true,  inv: true,  ret: true,  adv: true,  gaps: false },
};

function filterByDomain(domain) {
  document.querySelectorAll('.client-card').forEach((card, idx) => {
    const id = idx + 1; // cards are rendered in order 1-8
    const d = domainCoverage[id] || { ins: true, inv: false, ret: false, adv: false, gaps: true };
    if (!domain) {
      card.style.display = 'block';
    } else if (domain === 'insurance') {
      card.style.display = d.ins ? 'block' : 'none';
    } else if (domain === 'investments') {
      card.style.display = d.inv ? 'block' : 'none';
    } else if (domain === 'retirement') {
      card.style.display = d.ret ? 'block' : 'none';
    } else if (domain === 'advisory') {
      card.style.display = d.adv ? 'block' : 'none';
    } else if (domain === 'gaps') {
      card.style.display = d.gaps ? 'block' : 'none';
    } else {
      card.style.display = 'block';
    }
  });
}

// Product-type tab filter for Clients page
function filterClientsByProductTab(domain, tabEl) {
  // Update active tab styling
  document.querySelectorAll('.cpt-tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');

  // Filter cards
  document.querySelectorAll('.client-card').forEach((card, idx) => {
    const id = idx + 1;
    const d = domainCoverage[id] || { ins: true, inv: false, ret: false, adv: false, gaps: true };
    if (domain === 'all' || !domain) {
      card.style.display = 'block';
    } else if (domain === 'insurance') {
      card.style.display = d.ins ? 'block' : 'none';
    } else if (domain === 'investments') {
      card.style.display = d.inv ? 'block' : 'none';
    } else if (domain === 'retirement') {
      card.style.display = d.ret ? 'block' : 'none';
    } else if (domain === 'advisory') {
      card.style.display = d.adv ? 'block' : 'none';
    } else if (domain === 'gaps') {
      card.style.display = d.gaps ? 'block' : 'none';
    } else if (domain === 'lapse') {
      card.style.display = card.getAttribute('data-lapse') ? 'block' : 'none';
    } else {
      card.style.display = 'block';
    }
  });

  // Show/hide retention intelligence panel
  const riPanel = document.getElementById('ri-clients-panel');
  if (riPanel) riPanel.style.display = (domain === 'lapse') ? 'block' : 'none';

  // Also auto-expand product panels for filtered domain
  if (domain !== 'all') {
    document.querySelectorAll('.client-card').forEach((card, idx) => {
      const id = idx + 1;
      const d = domainCoverage[id] || {};
      const isVisible = card.style.display !== 'none';
      if (isVisible) {
        const panel = document.getElementById(`products-panel-${id}`);
        const icon  = document.getElementById(`expand-icon-${id}`);
        if (panel && panel.style.display === 'none') {
          panel.style.display = 'block';
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      }
    });
  } else {
    // Collapse all panels when "All" is selected
    document.querySelectorAll('.client-products-panel').forEach(p => {
      p.style.display = 'none';
    });
    document.querySelectorAll('.client-expand-icon').forEach(i => {
      i.style.transform = 'rotate(0deg)';
    });
  }
}

const clientData = [
  { id: 1, name: 'James Whitfield', age: 52, email: 'james.w@email.com', phone: '(212) 555-0101', policies: 3, premium: 12400, status: 'Active', segment: 'High Value', lastContact: '2026-04-05', city: 'New York', score: 92 },
  { id: 2, name: 'Patricia Nguyen', age: 38, email: 'patricia.n@email.com', phone: '(212) 555-0102', policies: 2, premium: 5800, status: 'Active', segment: 'Mid Market', lastContact: '2026-04-02', city: 'Brooklyn', score: 87 },
  { id: 3, name: 'Robert Chen', age: 45, email: 'robert.c@email.com', phone: '(212) 555-0103', policies: 4, premium: 21000, status: 'Active', segment: 'High Value', lastContact: '2026-04-08', city: 'Manhattan', score: 96 },
  { id: 4, name: 'Sandra Williams', age: 61, email: 'sandra.w@email.com', phone: '(718) 555-0104', policies: 2, premium: 8200, status: 'Review', segment: 'Mid Market', lastContact: '2026-03-20', city: 'Queens', score: 71 },
  { id: 5, name: 'David Thompson', age: 33, email: 'david.t@email.com', phone: '(646) 555-0105', policies: 1, premium: 2400, status: 'Active', segment: 'Emerging', lastContact: '2026-04-07', city: 'Bronx', score: 78 },
  { id: 6, name: 'Maria Gonzalez', age: 48, email: 'maria.g@email.com', phone: '(917) 555-0106', policies: 3, premium: 14600, status: 'Active', segment: 'High Value', lastContact: '2026-04-06', city: 'New York', score: 91 },
  { id: 7, name: 'Kevin Park', age: 29, email: 'kevin.p@email.com', phone: '(212) 555-0107', policies: 1, premium: 1800, status: 'Pending', segment: 'Emerging', lastContact: '2026-04-01', city: 'Jersey City', score: 65 },
  { id: 8, name: 'Linda Morrison', age: 56, email: 'linda.m@email.com', phone: '(718) 555-0108', policies: 5, premium: 32000, status: 'Active', segment: 'Premium', lastContact: '2026-04-09', city: 'Long Island', score: 98 },
];

// ============================================================
// PHASE 2 — Full Tabbed Client Modal
// ============================================================

let _cmClientId = null;
let _cmTab = 'overview';

// ── Extended AI insight data per client ──────────────────────
const cmAIData = {
  1: {
    score: 92, risk: 'Low', trend: 'up',
    insights: [
      { icon: 'fa-exclamation-triangle', color: '#f59e0b', text: 'Annual review overdue — schedule within 2 weeks' },
      { icon: 'fa-chart-line',           color: '#059669', text: 'Whole Life $500K cash value nearing conversion threshold' },
      { icon: 'fa-landmark',             color: '#7c3aed', text: 'Estate planning: will & trust review recommended' },
      { icon: 'fa-piggy-bank',           color: '#0891b2', text: 'Deferred annuity illustration ready — $2,800/mo at 65' },
    ],
    nba: 'Schedule annual review + present deferred annuity illustration',
    revenue: '$31.2K potential uplift across 3 product gaps',
    segment: 'High Value',
  },
  2: {
    score: 87, risk: 'Medium', trend: 'stable',
    insights: [
      { icon: 'fa-exclamation-circle',   color: '#dc2626', text: '⚠ Disability insurance gap — no DI coverage identified' },
      { icon: 'fa-chart-bar',            color: '#059669', text: 'Annuity upsell opportunity: $3,000/yr premium potential' },
      { icon: 'fa-sync-alt',             color: '#0891b2', text: 'Next renewal in 16 months — proactive outreach advised' },
      { icon: 'fa-heart',                color: '#7c3aed', text: 'VUL P-100302 performing well — review sub-account mix' },
    ],
    nba: 'Present Disability Income quote — $3,000/yr potential premium',
    revenue: '$3,000/yr DI + annuity candidate',
    segment: 'Mid Market',
  },
  3: {
    score: 96, risk: 'Low', trend: 'up',
    insights: [
      { icon: 'fa-briefcase',            color: '#7c3aed', text: 'Business owner: NQDC + key-person gap review pending' },
      { icon: 'fa-chart-line',           color: '#059669', text: 'VUL sub-accounts drifted 8% — rebalance recommended' },
      { icon: 'fa-file-medical-alt',     color: '#f59e0b', text: 'Claim CLM-2026-0041 in review — expedite docs needed' },
      { icon: 'fa-star',                 color: '#0891b2', text: 'Top referral potential — NPS 97, high satisfaction' },
    ],
    nba: 'Rebalance VUL sub-accounts + expedite claim CLM-2026-0041 docs',
    revenue: '$2,000/yr advisory + claim resolution',
    segment: 'High Value',
  },
  4: {
    score: 71, risk: 'High', trend: 'down',
    insights: [
      { icon: 'fa-exclamation-circle',   color: '#dc2626', text: '⚠ Term P-100320 expires Sep 2026 — renewal critical' },
      { icon: 'fa-heartbeat',            color: '#dc2626', text: 'Lapse risk score 79 — outreach urgently needed' },
      { icon: 'fa-calendar',             color: '#f59e0b', text: 'Last contact 21 days ago — re-engage immediately' },
      { icon: 'fa-piggy-bank',           color: '#0891b2', text: 'Near retirement: immediate annuity illustration ready' },
    ],
    nba: 'Call Sandra today — term renewal + lapse prevention outreach',
    revenue: '$8,200/yr at risk if lapse; $680/mo annuity opportunity',
    segment: 'Mid Market',
  },
  5: {
    score: 78, risk: 'Low', trend: 'up',
    insights: [
      { icon: 'fa-baby',                 color: '#7c3aed', text: 'New parent — term life rider + disability recommended' },
      { icon: 'fa-graduation-cap',       color: '#0891b2', text: '529 college savings plan: $1,200/yr opportunity' },
      { icon: 'fa-chart-line',           color: '#059669', text: 'Good long-term prospect — nurture for 5-yr plan' },
      { icon: 'fa-shield-alt',           color: '#f59e0b', text: 'Single policy — undercovered for family stage of life' },
    ],
    nba: 'Present term rider + 529 plan — family needs conversation',
    revenue: '$1,200/yr 529 + disability rider',
    segment: 'Emerging',
  },
  6: {
    score: 91, risk: 'Low', trend: 'stable',
    insights: [
      { icon: 'fa-landmark',             color: '#7c3aed', text: 'Estate planning: trust review recommended' },
      { icon: 'fa-chart-pie',            color: '#059669', text: 'Fixed annuity maturing — ladder strategy opportunity' },
      { icon: 'fa-star',                 color: '#0891b2', text: 'High satisfaction (NPS 94) — prime referral candidate' },
      { icon: 'fa-stethoscope',          color: '#f59e0b', text: 'DI claim CLM-2026-0035 pending — APS needed' },
    ],
    nba: 'Schedule estate review + present annuity ladder strategy',
    revenue: '$13K+ advisory + annuity ladder',
    segment: 'High Value',
  },
  7: {
    score: 65, risk: 'Medium', trend: 'stable',
    insights: [
      { icon: 'fa-exclamation-circle',   color: '#dc2626', text: '⚠ Application pending — follow up on e-signature today' },
      { icon: 'fa-shield-alt',           color: '#f59e0b', text: 'Single policy $250K — undercovered for risk profile' },
      { icon: 'fa-chart-line',           color: '#059669', text: 'Young professional — high lifetime value prospect' },
      { icon: 'fa-mobile-alt',           color: '#0891b2', text: 'Prefers digital channel — use e-app and text' },
    ],
    nba: 'Send e-signature reminder today — close Term Life $500K',
    revenue: 'Close pending app $1,800/yr + future upsell',
    segment: 'Emerging',
  },
  8: {
    score: 98, risk: 'Low', trend: 'up',
    insights: [
      { icon: 'fa-crown',                color: '#d97706', text: 'Premium client — schedule annual review ASAP' },
      { icon: 'fa-university',           color: '#7c3aed', text: 'UMA $280K AUM — Discretionary management active' },
      { icon: 'fa-heartbeat',            color: '#f59e0b', text: 'LTC gap vs. $2M estate — long-term care review' },
      { icon: 'fa-users',                color: '#059669', text: 'Trust beneficiary — estate complexity warrants specialist' },
    ],
    nba: 'Annual review + UMA performance debrief + LTC gap analysis',
    revenue: '$32K/yr current; $5K+ additional advisory potential',
    segment: 'Premium',
  },
};

// ── Timeline per client ───────────────────────────────────────
const cmTimeline = {
  1: [
    { date: 'Apr 10, 2026', icon: 'fa-robot',          color: '#7c3aed', event: 'AI flagged: Annual review overdue — action recommended' },
    { date: 'Apr 05, 2026', icon: 'fa-phone',           color: '#0891b2', event: 'Phone call — discussed estate planning overview' },
    { date: 'Mar 28, 2026', icon: 'fa-envelope',        color: '#059669', event: 'Email: LTC coverage gap summary sent' },
    { date: 'Mar 01, 2026', icon: 'fa-file-contract',   color: '#003087', event: 'Policy P-100293 LTC — annual premium paid $4,400' },
    { date: 'Jan 15, 2026', icon: 'fa-calendar',        color: '#f59e0b', event: 'Annual review meeting — all 3 policies reviewed' },
  ],
  2: [
    { date: 'Apr 02, 2026', icon: 'fa-phone',           color: '#0891b2', event: 'Phone call — VUL performance review, positive' },
    { date: 'Mar 20, 2026', icon: 'fa-robot',           color: '#7c3aed', event: 'AI flagged: Disability insurance gap identified' },
    { date: 'Feb 15, 2026', icon: 'fa-envelope',        color: '#059669', event: 'Email: Annuity illustration sent — $3K/yr' },
    { date: 'Jan 15, 2026', icon: 'fa-file-contract',   color: '#003087', event: 'Policy P-100302 VUL — premium paid $2,800' },
  ],
  3: [
    { date: 'Apr 09, 2026', icon: 'fa-file-medical-alt',color: '#dc2626', event: 'Claim CLM-2026-0041 filed — under review, expedite' },
    { date: 'Apr 08, 2026', icon: 'fa-phone',           color: '#0891b2', event: 'Phone call — discussed claim status and VUL rebalance' },
    { date: 'Mar 15, 2026', icon: 'fa-robot',           color: '#7c3aed', event: 'AI: VUL sub-accounts drift detected — rebalance alert' },
    { date: 'Feb 20, 2026', icon: 'fa-calendar',        color: '#f59e0b', event: 'Business review meeting — NQDC plan update' },
    { date: 'Jan 10, 2026', icon: 'fa-file-contract',   color: '#003087', event: 'Policy P-100310 WL premium paid $6,000' },
  ],
  4: [
    { date: 'Mar 20, 2026', icon: 'fa-phone',           color: '#0891b2', event: 'Last contact — policy review, no action taken' },
    { date: 'Mar 10, 2026', icon: 'fa-robot',           color: '#7c3aed', event: 'AI: Lapse risk score 79 — urgent outreach triggered' },
    { date: 'Feb 28, 2026', icon: 'fa-exclamation-circle', color: '#dc2626', event: 'Renewal notice sent — P-100320 expires Sep 2026' },
    { date: 'Jan 20, 2026', icon: 'fa-envelope',        color: '#059669', event: 'Email: Retirement annuity illustration delivered' },
  ],
  5: [
    { date: 'Apr 07, 2026', icon: 'fa-phone',           color: '#0891b2', event: 'Phone call — discussed newborn & coverage needs' },
    { date: 'Mar 22, 2026', icon: 'fa-robot',           color: '#7c3aed', event: 'AI: New parent profile — 529 + DI rider flagged' },
    { date: 'Mar 10, 2026', icon: 'fa-file-contract',   color: '#003087', event: 'Policy P-100330 Term — premium paid $2,400' },
  ],
  6: [
    { date: 'Apr 06, 2026', icon: 'fa-phone',           color: '#0891b2', event: 'Phone call — DI claim update, positive experience' },
    { date: 'Apr 01, 2026', icon: 'fa-file-medical-alt',color: '#f59e0b', event: 'Claim CLM-2026-0035 DI filed — APS pending' },
    { date: 'Mar 15, 2026', icon: 'fa-robot',           color: '#7c3aed', event: 'AI: Annuity ladder strategy identified — $95K maturing' },
    { date: 'Feb 10, 2026', icon: 'fa-calendar',        color: '#059669', event: 'Estate planning consultation scheduled' },
  ],
  7: [
    { date: 'Apr 01, 2026', icon: 'fa-pen-fancy',       color: '#7c3aed', event: 'E-signature reminder sent — Term Life $500K pending' },
    { date: 'Mar 25, 2026', icon: 'fa-file-contract',   color: '#003087', event: 'Application submitted — Term Life $500K, underwriting' },
    { date: 'Mar 20, 2026', icon: 'fa-calendar',        color: '#0891b2', event: 'Discovery meeting — identified term life need' },
  ],
  8: [
    { date: 'Apr 09, 2026', icon: 'fa-phone',           color: '#0891b2', event: 'Phone call — UMA quarterly performance review' },
    { date: 'Apr 02, 2026', icon: 'fa-robot',           color: '#7c3aed', event: 'AI: LTC gap detected vs $2M estate — review flagged' },
    { date: 'Mar 20, 2026', icon: 'fa-chart-line',      color: '#059669', event: 'UMA account rebalanced — +12.1% YTD confirmed' },
    { date: 'Feb 15, 2026', icon: 'fa-calendar',        color: '#f59e0b', event: 'Annual review meeting — all 5 policies + UMA reviewed' },
    { date: 'Jan 05, 2026', icon: 'fa-landmark',        color: '#7c3aed', event: 'Estate planning: trust amendment executed' },
  ],
};

// ── Products per client (insurance + investments + retirement + advisory) ──
// (mirrors index.tsx clientProducts — kept in sync)
const cmProducts = {
  1: {
    insurance:   [{ id:'P-100291', name:'Whole Life $500K',           prem:4800,  status:'Active',  since:'2019' },
                  { id:'P-100292', name:'Term Life $750K',            prem:3200,  status:'Active',  since:'2021' },
                  { id:'P-100293', name:'Long-term Care $250K',       prem:4400,  status:'Active',  since:'2022' }],
    investments: [],
    retirement:  [{ id:'R-200112', name:'Deferred Annuity (illus.)',  val:'Prospect',     inc:'~$2,800/mo @ 65' }],
    advisory:    [{ id:'A-300091', name:'Estate Planning',            val:'In Progress',  fee:'Included' }],
  },
  2: {
    insurance:   [{ id:'P-100301', name:'Universal Life $400K',       prem:3000,  status:'Active',  since:'2020' },
                  { id:'P-100302', name:'VUL $300K',                  prem:2800,  status:'Active',  since:'2023' }],
    investments: [],
    retirement:  [],
    advisory:    [],
  },
  3: {
    insurance:   [{ id:'P-100310', name:'Whole Life $1M',             prem:6000,  status:'Active',  since:'2018' },
                  { id:'P-100311', name:'VUL $800K',                  prem:8400,  status:'Active',  since:'2020' }],
    investments: [{ id:'I-400221', name:'VUL Sub-accounts',           val:'$180K AUM', ret:'+11.2% YTD' }],
    retirement:  [],
    advisory:    [{ id:'A-300102', name:'Business Services / Buy-Sell',val:'$500K coverage',fee:'$1,200/yr' },
                  { id:'A-300103', name:'Executive Benefits NQDC',     val:'$150K deferred',fee:'$800/yr' }],
  },
  4: {
    insurance:   [{ id:'P-100320', name:'Term Life $350K',            prem:2800,  status:'Review',  since:'2016' },
                  { id:'P-100321', name:'Long-term Care $180K',       prem:5400,  status:'Active',  since:'2020' }],
    investments: [],
    retirement:  [{ id:'R-200198', name:'Immediate Annuity (illus.)', val:'$120K premium', inc:'$680/mo lifetime' }],
    advisory:    [],
  },
  5: {
    insurance:   [{ id:'P-100330', name:'Term Life $300K',            prem:2400,  status:'Active',  since:'2023' }],
    investments: [],
    retirement:  [],
    advisory:    [],
  },
  6: {
    insurance:   [{ id:'P-100340', name:'Universal Life $600K',       prem:5600,  status:'Active',  since:'2017' },
                  { id:'P-100341', name:'Disability Insurance',        prem:3200,  status:'Active',  since:'2021' }],
    investments: [{ id:'I-400301', name:'Fixed Annuity',              val:'$95K AUM',    ret:'+4.8% guaranteed' }],
    retirement:  [{ id:'R-200211', name:'Immediate Annuity',          val:'$95K',        inc:'$520/mo interest' }],
    advisory:    [],
  },
  7: {
    insurance:   [{ id:'P-100350', name:'Term Life $250K',            prem:1800,  status:'Pending', since:'2026' }],
    investments: [],
    retirement:  [],
    advisory:    [],
  },
  8: {
    insurance:   [{ id:'P-100360', name:'Whole Life $2M',             prem:12000, status:'Active',  since:'2015' },
                  { id:'P-100361', name:'Long-term Care $300K',       prem:7200,  status:'Active',  since:'2019' },
                  { id:'P-100362', name:'VUL $1.5M',                  prem:9600,  status:'Active',  since:'2021' }],
    investments: [{ id:'I-400401', name:'Mutual Funds MainStay',      val:'$180K AUM',   ret:'+9.4% YTD'  },
                  { id:'I-400402', name:'ETF Portfolio Core Equity',  val:'$100K AUM',   ret:'+12.1% YTD' }],
    retirement:  [{ id:'R-200301', name:'Variable Deferred Annuity',  val:'$280K AUM',   inc:'Est. $3,200/mo @ 65' }],
    advisory:    [{ id:'A-300201', name:'UMA — Discretionary',        val:'$280K AUM',   fee:'$2,800/yr (1%)' },
                  { id:'A-300202', name:'Estate Planning Trust+Will',  val:'$2M+ estate', fee:'Included' }],
  },
};

// ── Open / close / switch ────────────────────────────────────
function openClientModal(clientId) {
  const client = clientData.find(c => c.id === clientId);
  if (!client) return;
  _cmClientId = clientId;
  _cmTab = 'overview';

  // Populate header
  const initials = client.name.split(' ').map(n => n[0]).join('');
  const segColors = { Premium:'#d97706', 'High Value':'#003087', 'Mid Market':'#0891b2', Emerging:'#059669' };
  const hdrEl = document.getElementById('cm-header');
  if (hdrEl) hdrEl.style.borderBottom = `3px solid ${segColors[client.segment] || '#003087'}`;

  _setText('cm-avatar', initials);
  _setText('cm-name', client.name);
  _setText('cm-meta', `${client.segment} · ${client.city} · Age ${client.age}`);
  _setText('cm-score-badge', client.score);
  const scoreBadge = document.getElementById('cm-score-badge');
  if (scoreBadge) scoreBadge.style.background = client.score >= 90 ? '#059669' : client.score >= 75 ? '#0891b2' : '#f59e0b';

  const statusPill = document.getElementById('cm-status-pill');
  if (statusPill) {
    statusPill.textContent = client.status;
    statusPill.className = 'cm-status-pill cm-status-' + client.status.toLowerCase();
  }

  // Footer call button
  const callBtn = document.getElementById('cm-btn-call');
  if (callBtn) callBtn.onclick = () => { window.location.href = 'tel:' + client.phone; };

  // Reset tabs
  document.querySelectorAll('.cm-tab').forEach(t => t.classList.remove('active'));
  const firstTab = document.getElementById('cm-tab-overview');
  if (firstTab) firstTab.classList.add('active');

  // Render overview tab
  _renderCMTab('overview', client);

  // Show modal
  document.getElementById('client-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeClientModal(e) {
  if (e && e.target !== document.getElementById('client-modal')) return;
  const modal = document.getElementById('client-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function switchClientTab(tab, tabEl) {
  _cmTab = tab;
  document.querySelectorAll('.cm-tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');
  const client = clientData.find(c => c.id === _cmClientId);
  if (client) _renderCMTab(tab, client);
}

function _setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ── Tab renderers ─────────────────────────────────────────────
function _renderCMTab(tab, client) {
  const body = document.getElementById('cm-body');
  if (!body) return;
  switch(tab) {
    case 'overview':  body.innerHTML = _cmOverview(client); break;
    case 'policies':  body.innerHTML = _cmPolicies(client); break;
    case 'ai':        body.innerHTML = _cmAI(client);       break;
    case 'outreach':  body.innerHTML = _cmOutreach(client); break;
    case 'timeline':  body.innerHTML = _cmTimeline(client); break;
    default:          body.innerHTML = '';
  }
}

function _cmOverview(client) {
  const dc = domainCoverage[client.id] || {};
  const products = cmProducts[client.id] || { insurance:[], investments:[], retirement:[], advisory:[] };
  const totalPolicies = products.insurance.length + products.investments.length + products.retirement.length + products.advisory.length;
  const gaps = [];
  if (!products.investments.length) gaps.push('Investments');
  if (!products.retirement.length)  gaps.push('Retirement');
  if (!products.advisory.length)    gaps.push('Advisory');
  if (products.insurance.length < 2) gaps.push('More Insurance');

  return `
    <div class="cm-overview-grid">
      <div class="cm-info-card">
        <div class="cm-card-title"><i class="fas fa-address-card"></i> Contact</div>
        <div class="cm-info-row"><i class="fas fa-envelope"></i><span>${client.email}</span></div>
        <div class="cm-info-row"><i class="fas fa-phone"></i><span>${client.phone}</span></div>
        <div class="cm-info-row"><i class="fas fa-map-marker-alt"></i><span>${client.city}</span></div>
        <div class="cm-info-row"><i class="fas fa-birthday-cake"></i><span>Age ${client.age}</span></div>
        <div class="cm-info-row"><i class="fas fa-clock"></i><span>Last contact: ${client.lastContact}</span></div>
      </div>
      <div class="cm-info-card">
        <div class="cm-card-title"><i class="fas fa-briefcase"></i> Portfolio Summary</div>
        <div class="cm-kpi-row">
          <div class="cm-kpi"><span class="cm-kpi-val">${products.insurance.length}</span><span class="cm-kpi-lbl">Insurance</span></div>
          <div class="cm-kpi"><span class="cm-kpi-val">${products.investments.length}</span><span class="cm-kpi-lbl">Investments</span></div>
          <div class="cm-kpi"><span class="cm-kpi-val">${products.retirement.length}</span><span class="cm-kpi-lbl">Retirement</span></div>
          <div class="cm-kpi"><span class="cm-kpi-val">${products.advisory.length}</span><span class="cm-kpi-lbl">Advisory</span></div>
        </div>
        <div class="cm-info-row premium-row"><i class="fas fa-dollar-sign"></i><span>Annual Premium: <strong>$${client.premium.toLocaleString()}</strong></span></div>
        <div class="cm-info-row"><i class="fas fa-layer-group"></i><span>${totalPolicies} total product${totalPolicies !== 1 ? 's' : ''}</span></div>
      </div>
    </div>
    ${gaps.length ? `
    <div class="cm-gaps-bar">
      <div class="cm-gaps-label"><i class="fas fa-exclamation-circle" style="color:#f59e0b"></i> Coverage Gaps Identified</div>
      <div class="cm-gaps-pills">${gaps.map(g => `<span class="cm-gap-pill">${g}</span>`).join('')}</div>
    </div>` : ''}
    <div class="cm-domain-strip">
      ${['insurance','investments','retirement','advisory'].map(d => `
        <div class="cm-domain-item ${dc[d.substring(0,3)] || dc[d] ? 'active' : 'inactive'}">
          <i class="fas ${d==='insurance'?'fa-shield-alt':d==='investments'?'fa-chart-line':d==='retirement'?'fa-piggy-bank':'fa-handshake'}"></i>
          <span>${d.charAt(0).toUpperCase()+d.slice(1)}</span>
          ${dc[d.substring(0,3)] || dc[d] ? '<i class="fas fa-check-circle cm-domain-check"></i>' : '<i class="fas fa-times-circle cm-domain-x"></i>'}
        </div>
      `).join('')}
    </div>
  `;
}

function _cmPolicies(client) {
  const products = cmProducts[client.id] || { insurance:[], investments:[], retirement:[], advisory:[] };
  const sections = [
    { label:'Insurance', icon:'fa-shield-alt', color:'#003087', items: products.insurance, type:'ins' },
    { label:'Investments', icon:'fa-chart-line', color:'#059669', items: products.investments, type:'inv' },
    { label:'Retirement', icon:'fa-piggy-bank', color:'#0891b2', items: products.retirement, type:'ret' },
    { label:'Advisory', icon:'fa-handshake', color:'#7c3aed', items: products.advisory, type:'adv' },
  ];
  return sections.map(s => {
    if (!s.items.length) return `
      <div class="cm-policy-section empty">
        <div class="cm-policy-section-head" style="color:${s.color}">
          <i class="fas ${s.icon}"></i> ${s.label} <span class="cm-policy-count">0</span>
        </div>
        <div class="cm-policy-empty">No ${s.label.toLowerCase()} products — <button class="cm-link" onclick="switchClientTab('ai',document.getElementById('cm-tab-ai'))">view AI recommendation</button></div>
      </div>`;
    return `
      <div class="cm-policy-section">
        <div class="cm-policy-section-head" style="color:${s.color}">
          <i class="fas ${s.icon}"></i> ${s.label} <span class="cm-policy-count">${s.items.length}</span>
        </div>
        ${s.items.map(item => `
          <div class="cm-policy-row">
            <div class="cm-policy-id">${item.id}</div>
            <div class="cm-policy-name">${item.name}</div>
            <div class="cm-policy-detail">
              ${item.prem ? `<span class="cm-policy-prem">$${item.prem.toLocaleString()}/yr</span>` : ''}
              ${item.val  ? `<span class="cm-policy-val">${item.val}</span>` : ''}
              ${item.ret  ? `<span class="cm-policy-ret">${item.ret}</span>` : ''}
              ${item.inc  ? `<span class="cm-policy-inc">${item.inc}</span>` : ''}
              ${item.fee  ? `<span class="cm-policy-fee">${item.fee}</span>` : ''}
            </div>
            ${item.status ? `<span class="cm-policy-status ${item.status.toLowerCase()}">${item.status}</span>` : ''}
            <button class="cm-policy-view-btn" onclick="closePolicyCMModal_openPolicy('${item.id}')"><i class="fas fa-eye"></i></button>
          </div>`).join('')}
      </div>`;
  }).join('');
}

function _cmAI(client) {
  const ai = cmAIData[client.id] || { score:0, risk:'—', trend:'stable', insights:[], nba:'', revenue:'' };
  const trendIcon = ai.trend === 'up' ? 'fa-arrow-up' : ai.trend === 'down' ? 'fa-arrow-down' : 'fa-minus';
  const trendColor = ai.trend === 'up' ? '#059669' : ai.trend === 'down' ? '#dc2626' : '#6b7280';
  const riskColor = ai.risk === 'Low' ? '#059669' : ai.risk === 'Medium' ? '#f59e0b' : '#dc2626';
  const scoreWidth = ai.score;
  const scoreColor = ai.score >= 90 ? '#059669' : ai.score >= 75 ? '#0891b2' : ai.score >= 60 ? '#f59e0b' : '#dc2626';

  return `
    <div class="cm-ai-score-row">
      <div class="cm-ai-score-card">
        <div class="cm-ai-score-num" style="color:${scoreColor}">${ai.score}</div>
        <div class="cm-ai-score-lbl">Client Score</div>
        <div class="cm-ai-score-bar"><div class="cm-ai-score-fill" style="width:${scoreWidth}%;background:${scoreColor}"></div></div>
      </div>
      <div class="cm-ai-score-card">
        <div class="cm-ai-score-num" style="color:${riskColor}">${ai.risk}</div>
        <div class="cm-ai-score-lbl">Risk Level</div>
      </div>
      <div class="cm-ai-score-card">
        <div class="cm-ai-score-num" style="color:${trendColor}"><i class="fas ${trendIcon}"></i></div>
        <div class="cm-ai-score-lbl">Trend</div>
      </div>
    </div>

    <div class="cm-ai-nba">
      <div class="cm-ai-nba-label"><i class="fas fa-bolt" style="color:#f59e0b"></i> Next Best Action</div>
      <div class="cm-ai-nba-text">${ai.nba}</div>
      <div class="cm-ai-revenue"><i class="fas fa-dollar-sign" style="color:#059669"></i> ${ai.revenue}</div>
    </div>

    <div class="cm-ai-insights-list">
      <div class="cm-ai-insights-title"><i class="fas fa-lightbulb"></i> AI Intelligence Signals</div>
      ${ai.insights.map(ins => `
        <div class="cm-ai-insight-row">
          <div class="cm-ai-ins-icon" style="background:${ins.color}20;color:${ins.color}"><i class="fas ${ins.icon}"></i></div>
          <div class="cm-ai-ins-text">${ins.text}</div>
        </div>`).join('')}
    </div>

    <div class="cm-ai-actions">
      <button class="btn btn-ai" onclick="closeClientModal();navigateTo('ai-agents')"><i class="fas fa-robot"></i> Full AI Analysis</button>
      <button class="btn btn-outline" onclick="switchClientTab('outreach',document.getElementById('cm-tab-outreach'))"><i class="fas fa-paper-plane"></i> Launch Outreach</button>
    </div>
  `;
}

function _cmOutreach(client) {
  const channels = [
    { id:'email', icon:'fa-envelope',  label:'Email',  color:'#003087' },
    { id:'sms',   icon:'fa-sms',       label:'SMS',    color:'#059669' },
    { id:'call',  icon:'fa-phone',     label:'Call',   color:'#0891b2' },
  ];
  const ai = cmAIData[client.id] || {};
  const templates = {
    email: `Subject: Quick Follow-up — Your Financial Review\n\nDear ${client.name},\n\nI wanted to follow up on your portfolio. ${ai.nba || 'Your annual review is due and I have some important updates to share.'}.\n\nWould you have 20 minutes this week for a quick call?\n\nBest regards,\nSridhar R. | NYL Senior Agent`,
    sms: `Hi ${client.name}, this is Sridhar from NYL. I have a quick update on your policy — can we connect briefly this week? Reply CALL to schedule.`,
    call: `Call script for ${client.name}:\n\n1. Opener: "Hi ${client.name}, this is Sridhar from New York Life..."\n2. Purpose: "${ai.nba || 'Annual policy review'}"\n3. Value prop: "${ai.revenue || 'Important updates to your coverage'}"\n4. Ask: "Do you have 15 minutes now, or is [day] better?"\n5. Close: Schedule meeting or send calendar invite`,
  };
  let active = 'email';
  return `
    <div class="cm-outreach-tabs" id="cm-otabs">
      ${channels.map(ch => `
        <button class="cm-otab ${ch.id === active ? 'active' : ''}" onclick="switchCMOutreachTab('${ch.id}',this)" style="--otab-color:${ch.color}">
          <i class="fas ${ch.icon}"></i> ${ch.label}
        </button>`).join('')}
    </div>
    <div class="cm-outreach-body" id="cm-outreach-body">
      <div class="cm-outreach-template-label">AI-generated message</div>
      <textarea class="cm-outreach-textarea" id="cm-outreach-text">${templates[active]}</textarea>
      <div class="cm-outreach-btns">
        <button class="btn btn-ai" onclick="regenCMOutreach(${client.id})"><i class="fas fa-sync-alt"></i> Regenerate</button>
        <button class="btn btn-primary" onclick="sendCMOutreach(${client.id})"><i class="fas fa-paper-plane"></i> Send</button>
        <button class="btn btn-outline" onclick="scheduleCMOutreach(${client.id})"><i class="fas fa-calendar"></i> Schedule</button>
      </div>
    </div>
    <div class="cm-outreach-history">
      <div class="cm-out-hist-title"><i class="fas fa-history"></i> Recent Outreach</div>
      <div class="cm-out-hist-row"><span class="cm-out-hist-date">Apr 05</span><span class="cm-out-hist-ch email">Email</span><span class="cm-out-hist-note">Annual review follow-up — opened</span></div>
      <div class="cm-out-hist-row"><span class="cm-out-hist-date">Mar 28</span><span class="cm-out-hist-ch email">Email</span><span class="cm-out-hist-note">LTC coverage summary — opened</span></div>
      <div class="cm-out-hist-row"><span class="cm-out-hist-date">Mar 10</span><span class="cm-out-hist-ch call">Call</span><span class="cm-out-hist-note">15 min call — positive, schedule review</span></div>
    </div>
  `;
}

function _cmTimeline(client) {
  const events = cmTimeline[client.id] || [];
  if (!events.length) return '<div class="cm-empty">No timeline events yet.</div>';
  return `
    <div class="cm-timeline">
      ${events.map((ev, i) => `
        <div class="cm-tl-item ${i === 0 ? 'latest' : ''}">
          <div class="cm-tl-dot" style="background:${ev.color};border-color:${ev.color}20">
            <i class="fas ${ev.icon}" style="color:${ev.color}"></i>
          </div>
          <div class="cm-tl-content">
            <div class="cm-tl-event">${ev.event}</div>
            <div class="cm-tl-date">${ev.date}</div>
          </div>
        </div>`).join('')}
    </div>`;
}

// ── Outreach tab switcher ─────────────────────────────────────
const _cmOutreachTemplates = {
  email: (client, ai) => `Subject: Quick Follow-up — Your Financial Review\n\nDear ${client.name},\n\nI wanted to follow up on your portfolio. ${ai.nba || 'Your annual review is due — I have important updates to share.'}.\n\nWould you have 20 minutes this week for a call?\n\nBest regards,\nSridhar R. | NYL Senior Agent`,
  sms:   (client, ai) => `Hi ${client.name}, this is Sridhar from NYL. I have a quick update on your policy — can we connect briefly this week? Reply CALL to schedule.`,
  call:  (client, ai) => `Call script for ${client.name}:\n\n1. "Hi ${client.name}, this is Sridhar from New York Life..."\n2. Purpose: "${ai.nba || 'Annual policy review'}"\n3. Value: "${ai.revenue || 'Important coverage updates'}"\n4. Ask: "Do you have 15 minutes now, or is [day] better?"\n5. Close: Schedule meeting or send calendar invite`,
};

function switchCMOutreachTab(ch, btn) {
  document.querySelectorAll('.cm-otab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const client = clientData.find(c => c.id === _cmClientId);
  const ai = cmAIData[_cmClientId] || {};
  const ta = document.getElementById('cm-outreach-text');
  if (ta && client) ta.value = _cmOutreachTemplates[ch](client, ai);
}

function regenCMOutreach(clientId) {
  const ta = document.getElementById('cm-outreach-text');
  if (!ta) return;
  const ai = cmAIData[clientId] || {};
  const client = clientData.find(c => c.id === clientId);
  const activeTab = document.querySelector('.cm-otab.active')?.dataset?.ch || 'email';
  if (client) ta.value = _cmOutreachTemplates[activeTab]?.(client, ai) || ta.value;
  ta.style.background = '#fffbeb';
  setTimeout(() => { ta.style.background = ''; }, 600);
}

function sendCMOutreach(clientId) {
  const toast = document.createElement('div');
  toast.className = 'phase1-toast success';
  toast.innerHTML = '<i class="fas fa-check-circle"></i> Message sent to client successfully.';
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2800);
}

function scheduleCMOutreach(clientId) {
  const toast = document.createElement('div');
  toast.className = 'phase1-toast';
  toast.innerHTML = '<i class="fas fa-calendar-check"></i> Outreach scheduled for tomorrow 9 AM.';
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2800);
}

function closePolicyCMModal_openPolicy(policyId) {
  document.getElementById('client-modal').classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => openPolicyModal(policyId, 'view'), 150);
}

function aiClientInsights() {
  navigateTo('ai-agents');
  setTimeout(() => {
    const input = document.getElementById('chat-input');
    if (input) {
      input.value = 'Show me which clients need follow-up and identify upsell opportunities';
      sendChatMessage();
    }
  }, 500);
}

// ---- AI CHAT ----
let chatHistory = [];

// Agent metadata: name, subtitle, icon, accent color, context buttons
const agentMeta = {
  advisor: {
    name: 'Smart Advisor Agent',
    sub: 'Insurance · Investments · Retirement · Advisory',
    icon: 'fa-brain',
    color: '#d97706',
    ctxGroups: [
      { label: 'Opportunities', icon: 'fa-bolt', btns: [
        { cls: 'ctx-inv', label: 'All Cross-Sell', msg: 'Show me all cross-sell and upsell opportunities across 247 clients' },
        { cls: 'ctx-ret', label: 'Revenue Map',   msg: 'What is my total revenue opportunity across all domains — rank by value' },
        { cls: 'ctx-ins', label: 'Renewals Due',  msg: 'Which policies are up for renewal in the next 90 days?' },
        { cls: 'ctx-adv', label: 'Estate Gaps',   msg: 'Show estate planning and advisory opportunities for top clients' },
        { cls: 'ctx-inv', label: 'Investment Gaps', msg: 'Show investment portfolio gaps and rebalancing opportunities' }
      ]},
      { label: 'Reports', icon: 'fa-chart-bar', btns: [
        { cls: 'ctx-ret', label: "Today's Summary", msg: 'Summarize my dashboard for today — performance, alerts, and priority actions' },
        { cls: 'ctx-adv', label: 'Q1 Performance',  msg: 'Show Q1 2026 performance summary — commissions, conversion rate, STP improvements' },
        { cls: 'ctx-ins', label: 'Week Ahead',      msg: 'Generate a week-ahead action plan for April 14-18 2026' },
        { cls: 'ctx-inv', label: 'Priority Outreach', msg: 'Which clients should I prioritize for outreach this week and why?' }
      ]}
    ]
  },
  claims: {
    name: 'Claims Automation Agent',
    sub: 'Death Benefit · Disability · LTC · Waiver · Accelerated',
    icon: 'fa-clipboard-check',
    color: '#2563eb',
    ctxGroups: [
      { label: 'Active Claims', icon: 'fa-clipboard-list', btns: [
        { cls: 'ctx-urgent', label: 'CLM-0041 Urgent', msg: 'Full status on Robert Chen $1M death benefit claim CLM-2026-0041 — what is needed to expedite?' },
        { cls: 'ctx-urgent', label: 'ADB Maria Urgent', msg: 'Maria Gonzalez ADB claim CLM-2026-0028 — how do I expedite the oncologist certification?' },
        { cls: 'ctx-ins',    label: 'All Open Claims',  msg: 'Show all open claims and their current status' },
        { cls: 'ctx-ins',    label: 'Pending Docs',     msg: 'Which claims have pending documents and what actions are needed?' },
        { cls: 'ctx-inv',    label: 'Disability Claims', msg: 'Show all disability insurance claims and expected payment timelines' }
      ]},
      { label: 'Draft', icon: 'fa-envelope', btns: [
        { cls: 'ctx-inv', label: 'Email: Susan Chen',  msg: 'Draft a compassionate follow-up email to Susan Chen regarding the $1M death benefit claim' },
        { cls: 'ctx-ins', label: 'Email: Kevin Estate', msg: 'Draft a follow-up email to Kevin Park estate regarding contestability review timeline' },
        { cls: 'ctx-ret', label: 'Email: Maria ADB',   msg: 'Draft a supportive email to Maria Gonzalez about her accelerated death benefit claim status' }
      ]}
    ]
  },
  renewal: {
    name: 'Renewal Automation Agent',
    sub: 'Policy Renewals · Conversion · Retention Outreach',
    icon: 'fa-sync-alt',
    color: '#16a34a',
    ctxGroups: [
      { label: 'Renewals', icon: 'fa-calendar-times', btns: [
        { cls: 'ctx-urgent', label: 'Sandra Williams',    msg: 'Sandra Williams term renewal — conversion window and what to present at Apr 28 meeting' },
        { cls: 'ctx-ins',    label: 'All Renewals 90d',  msg: 'Show all policy renewals due in the next 90 days with premium at risk' },
        { cls: 'ctx-inv',    label: 'Conversion Candidates', msg: 'Which term policies are candidates for conversion to permanent life?' },
        { cls: 'ctx-ret',    label: 'Lapse Risk Queue',  msg: 'Show all 4 lapse-risk clients with risk scores and recommended retention actions' },
        { cls: 'ctx-adv',    label: 'Patricia Nguyen',   msg: 'Patricia Nguyen UL lapse risk — catch-up premium plan and monitoring timeline' }
      ]},
      { label: 'Outreach', icon: 'fa-envelope-open-text', btns: [
        { cls: 'ctx-ins', label: 'Draft: Sandra Renewal', msg: 'Draft a renewal conversion letter for Sandra Williams — emphasize no medical evidence required' },
        { cls: 'ctx-ret', label: 'Draft: Patricia Lapse', msg: 'Draft a retention email for Patricia Nguyen about her Universal Life premium catch-up plan' },
        { cls: 'ctx-inv', label: 'Renewal Campaign',      msg: 'What is the current status of the renewal email campaign — how many sent and remaining?' }
      ]}
    ]
  },
  portfolio: {
    name: 'Portfolio Optimizer Agent',
    sub: 'AUM · Rebalancing · Annuities · 529 Plans · ETFs',
    icon: 'fa-coins',
    color: '#0891b2',
    ctxGroups: [
      { label: 'Portfolio', icon: 'fa-chart-pie', btns: [
        { cls: 'ctx-inv', label: 'All AUM Clients',    msg: 'Show all clients with investment AUM and identify rebalancing opportunities' },
        { cls: 'ctx-inv', label: 'Linda Morrison UMA', msg: 'Linda Morrison $280K UMA opportunity — present proposal details and fee structure' },
        { cls: 'ctx-inv', label: 'Portfolio Gaps',     msg: 'Show investment portfolio gaps across all clients — who is missing investment products?' },
        { cls: 'ctx-ret', label: 'Annuity Candidates', msg: 'Which clients are the best candidates for fixed-indexed annuity products?' },
        { cls: 'ctx-inv', label: 'Maria Gonzalez FIA', msg: 'Maria Gonzalez fixed-indexed annuity — $75K allocation, income at age 65 projection' }
      ]},
      { label: 'Analysis', icon: 'fa-calculator', btns: [
        { cls: 'ctx-inv', label: '$4.2M AUM Report', msg: 'Show AUM performance report across all investment clients — growth, rebalancing needs, fee revenue' },
        { cls: 'ctx-ret', label: '529 Opportunities', msg: 'Which clients with young children are candidates for 529 college savings plans?' },
        { cls: 'ctx-adv', label: 'Robert Chen $180K', msg: 'Robert Chen $180K AUM — consolidation opportunity after death benefit claim resolution' }
      ]}
    ]
  },
  retirement: {
    name: 'Retirement Planning Agent',
    sub: 'Income Gap · Annuities · NQDC · Social Security',
    icon: 'fa-piggy-bank',
    color: '#7c3aed',
    ctxGroups: [
      { label: 'Retirement', icon: 'fa-umbrella-beach', btns: [
        { cls: 'ctx-ret', label: 'James Whitfield',   msg: 'James Whitfield deferred annuity illustration — $85K lump sum, income at age 67' },
        { cls: 'ctx-ret', label: 'Income Gap Clients', msg: 'Which clients need retirement income gap analysis — show top 5 by gap size' },
        { cls: 'ctx-ret', label: 'Annuity Candidates', msg: 'Show all deferred and immediate annuity candidates across the book' },
        { cls: 'ctx-inv', label: 'Maria FIA $75K',    msg: 'Maria Gonzalez FIA: $75K allocation, income starting age 65 — full projection' },
        { cls: 'ctx-adv', label: 'NQDC Opportunities', msg: 'Which clients are candidates for NQDC (Non-Qualified Deferred Compensation) plans?' }
      ]},
      { label: 'Planning', icon: 'fa-calculator', btns: [
        { cls: 'ctx-ret', label: 'SS + Annuity Model', msg: 'Model retirement income for James Whitfield: Social Security $3,200 + deferred annuity $1,100 at 67' },
        { cls: 'ctx-ret', label: '4 Clients at Risk',  msg: 'Show the 4 clients closest to retirement with no annuity product — priority action plan' },
        { cls: 'ctx-adv', label: 'James NQDC Plan',    msg: 'James Whitfield NQDC plan — executive income deferral strategy and employer coordination' }
      ]}
    ]
  },
  estate: {
    name: 'Estate Planning Agent',
    sub: 'Trust Review · Wealth Management · UMA · Succession',
    icon: 'fa-landmark',
    color: '#6d28d9',
    ctxGroups: [
      { label: 'Estate', icon: 'fa-file-contract', btns: [
        { cls: 'ctx-adv', label: 'Linda Morrison Estate', msg: 'Linda Morrison estate plan — trust update, UMA $280K, WL P-100330 review for Apr 15 meeting' },
        { cls: 'ctx-adv', label: 'Robert Chen Succession', msg: 'Robert Chen business succession — Chen Holdings $4M valuation, buy-sell agreement, NQDC plan' },
        { cls: 'ctx-adv', label: 'All Estate Clients',    msg: 'Show all 4 estate planning opportunities with recommended actions and revenue potential' },
        { cls: 'ctx-adv', label: 'UMA Candidates',        msg: 'Show all UMA (Unified Managed Account) candidates — who has $250K+ investable assets?' },
        { cls: 'ctx-inv', label: 'Trust Reviews Due',     msg: 'Which clients have trust documents that need annual review or updating?' }
      ]},
      { label: 'Drafts', icon: 'fa-pen-fancy', btns: [
        { cls: 'ctx-adv', label: 'UMA Proposal: Linda', msg: 'Draft a UMA proposal for Linda Morrison — $280K at 1% management fee, $2,800/yr' },
        { cls: 'ctx-adv', label: 'Buy-Sell: Robert',   msg: 'Outline a buy-sell agreement structure for Chen Holdings funded by $2M key-person life insurance' }
      ]}
    ]
  },
  business: {
    name: 'Business Services Agent',
    sub: 'SMB Insurance · NQDC · COLI · Employee Benefits',
    icon: 'fa-building',
    color: '#ea580c',
    ctxGroups: [
      { label: 'Business', icon: 'fa-briefcase', btns: [
        { cls: 'ctx-adv', label: 'Chen Holdings',    msg: 'Chen Holdings — key-person life $2M, buy-sell agreement, NQDC plan details' },
        { cls: 'ctx-adv', label: 'James Whitfield NQDC', msg: 'James Whitfield employer NQDC plan — eligibility, contribution limits, tax deferral benefits' },
        { cls: 'ctx-inv', label: 'COLI Candidates',  msg: 'Which business-owner clients are candidates for Corporate-Owned Life Insurance (COLI)?' },
        { cls: 'ctx-adv', label: 'SMB Opportunities', msg: 'Show all small-business insurance opportunities — group benefits, key-person, NQDC' },
        { cls: 'ctx-ins', label: 'Key-Person Life',  msg: 'Show all clients who need key-person life insurance — business valuation and coverage gaps' }
      ]},
      { label: 'Analysis', icon: 'fa-chart-bar', btns: [
        { cls: 'ctx-adv', label: 'Exec Benefits Report', msg: 'Which executive clients have no NQDC or deferred compensation strategy in place?' },
        { cls: 'ctx-ins', label: 'Group Benefits Gap',   msg: 'Which business-owner clients have employees who need group insurance benefits?' }
      ]}
    ]
  },
  compliance: {
    name: 'Compliance & Reporting Agent',
    sub: 'Regulatory · Audit · Risk · Suitability',
    icon: 'fa-shield-alt',
    color: '#dc2626',
    ctxGroups: [
      { label: 'Compliance', icon: 'fa-balance-scale', btns: [
        { cls: 'ctx-urgent', label: 'Suitability Review', msg: 'Are there any suitability concerns across current product recommendations?' },
        { cls: 'ctx-ins',    label: 'Audit Ready Docs',   msg: 'Which client files are missing documentation required for compliance audit?' },
        { cls: 'ctx-inv',    label: 'Reg Reporting',      msg: 'Generate a regulatory reporting summary for Q1 2026' },
        { cls: 'ctx-ret',    label: 'Risk Flags',         msg: 'Show all compliance risk flags across the book — prioritize by severity' },
        { cls: 'ctx-adv',    label: 'Fiduciary Check',    msg: 'Perform a fiduciary suitability check on all advisory recommendations this quarter' }
      ]},
      { label: 'Reports', icon: 'fa-file-alt', btns: [
        { cls: 'ctx-adv', label: 'Compliance Report', msg: 'Generate a full compliance report for Q1 2026 — flags, resolutions, and outstanding items' },
        { cls: 'ctx-ins', label: 'E&O Risk Check',    msg: 'Are there any errors and omissions risk factors in the current book of business?' }
      ]}
    ]
  }
};

function selectAgent(agentId) {
  document.querySelectorAll('.agent-card').forEach(c => c.classList.remove('active-agent'));
  event.currentTarget.classList.add('active-agent');

  const meta = agentMeta[agentId];
  if (!meta) return;

  // Update chat header
  const nameEl = document.getElementById('chat-agent-name');
  const subEl  = document.getElementById('chat-agent-sub');
  if (nameEl) nameEl.textContent = meta.name;
  if (subEl)  subEl.textContent  = meta.sub;

  // Swap context button toolbar to agent-specific groups
  const toolbar = document.getElementById('ctx-btn-toolbar');
  if (toolbar && meta.ctxGroups) {
    toolbar.innerHTML = meta.ctxGroups.map(grp => `
      <div class="ctx-group">
        <span class="ctx-group-label"><i class="fas ${grp.icon}"></i> ${grp.label}</span>
        <div class="ctx-btns">
          ${grp.btns.map(b => `
            <button class="ctx-btn ${b.cls}" onclick="sendQuickMessage('${b.msg.replace(/'/g, "\\'")}')">
              ${b.label}
            </button>`).join('')}
        </div>
      </div>`).join('');
  }

  // Inject agent greeting message into chat
  const messages = document.getElementById('chat-messages');
  if (messages) {
    const greetings = {
      advisor:    `I've switched to <strong>${meta.name}</strong>. I'm monitoring your full book — insurance, investments, retirement, and advisory. Use the context buttons above or ask me anything.`,
      claims:     `I've switched to <strong>${meta.name}</strong>. I have visibility across all 6 active claims. Two are urgent: CLM-2026-0041 ($1M, Robert Chen) and CLM-2026-0028 (ADB, Maria Gonzalez). How can I help?`,
      renewal:    `I've switched to <strong>${meta.name}</strong>. I'm tracking 23 renewals due in 90 days. ⚡ Critical: Sandra Williams term expiry Sep 2026 and Patricia Nguyen UL lapse risk. What do you need?`,
      portfolio:  `I've switched to <strong>${meta.name}</strong>. I'm monitoring $4.2M AUM across investment clients. Top opportunity: Linda Morrison $280K UMA ($2,800/yr fee). What would you like to analyze?`,
      retirement: `I've switched to <strong>${meta.name}</strong>. I've identified 4 annuity candidates and 2 clients with significant income gaps. Top priority: James Whitfield deferred annuity ($85K → $1,100/mo at 67). How can I help?`,
      estate:     `I've switched to <strong>${meta.name}</strong>. I see 4 estate planning opportunities. Top: Linda Morrison UMA + trust review on Apr 15, and Robert Chen business succession for Chen Holdings ($4M). Where would you like to start?`,
      business:   `I've switched to <strong>${meta.name}</strong>. I've identified 3 business services opportunities: Chen Holdings succession, James Whitfield NQDC plan, and 2 COLI candidates. What do you need?`,
      compliance: `I've switched to <strong>${meta.name}</strong>. Running compliance scan across the book. No critical flags at this time. Suitability review recommended for 2 advisory recommendations. How can I assist?`
    };
    const greeting = greetings[agentId] || `Switched to <strong>${meta.name}</strong>. How can I help?`;
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg bot agent-switch-msg';
    msgEl.innerHTML = `
      <div class="msg-avatar" style="background:${meta.color}20;color:${meta.color}"><i class="fas ${meta.icon}"></i></div>
      <div class="msg-bubble agent-switch-bubble" style="border-left:3px solid ${meta.color}20">
        <p>${greeting}</p>
      </div>`;
    messages.appendChild(msgEl);
    messages.scrollTop = messages.scrollHeight;
  }
}

function handleChatKey(e) {
  if (e.key === 'Enter') sendChatMessage();
}

function sendQuickMessage(msg) {
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = msg;
    sendChatMessage();
  }
}

// Deep-link from any page: navigate to AI Agents then fire a pre-loaded context message
function sendContextMessage(msg, agentId) {
  navigateTo('ai-agents');
  setTimeout(() => {
    // Optionally switch agent
    if (agentId) {
      const agentCard = document.querySelector(`.agent-card[onclick*="'${agentId}'"]`);
      if (agentCard) agentCard.click();
      setTimeout(() => sendQuickMessage(msg), 300);
    } else {
      sendQuickMessage(msg);
    }
  }, 400);
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  if (!input || !messages) return;

  const query = input.value.trim();
  if (!query) return;

  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.innerHTML = `
    <div class="msg-avatar"><i class="fas fa-user"></i></div>
    <div class="msg-bubble">${escapeHtml(query)}</div>
  `;
  messages.appendChild(userMsg);
  input.value = '';

  // Add thinking indicator
  const thinkingEl = document.createElement('div');
  thinkingEl.className = 'chat-msg bot';
  thinkingEl.innerHTML = `
    <div class="msg-avatar"><i class="fas fa-robot"></i></div>
    <div class="msg-bubble">
      <div class="thinking"><span></span><span></span><span></span></div>
    </div>
  `;
  messages.appendChild(thinkingEl);
  messages.scrollTop = messages.scrollHeight;

  // Call API
  try {
    const response = await fetch('/api/ai-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await response.json();

    // Remove thinking
    messages.removeChild(thinkingEl);

    // Add bot response
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-msg bot';
    botMsg.innerHTML = `
      <div class="msg-avatar"><i class="fas fa-robot"></i></div>
      <div class="msg-bubble">${formatAIResponse(data.response)}</div>
    `;
    messages.appendChild(botMsg);
    messages.scrollTop = messages.scrollHeight;
  } catch (err) {
    messages.removeChild(thinkingEl);
    const errMsg = document.createElement('div');
    errMsg.className = 'chat-msg bot';
    errMsg.innerHTML = `
      <div class="msg-avatar"><i class="fas fa-robot"></i></div>
      <div class="msg-bubble">⚠️ Connection issue. Please try again.</div>
    `;
    messages.appendChild(errMsg);
  }
}

function formatAIResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n• /g, '</p><p>• ')
    .replace(/\n(\d+)\./g, '</p><p>$1.')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function clearChat() {
  const messages = document.getElementById('chat-messages');
  if (messages) {
    messages.innerHTML = `
      <div class="chat-msg bot">
        <div class="msg-avatar"><i class="fas fa-robot"></i></div>
        <div class="msg-bubble">
          <p>Chat cleared. How can I assist you?</p>
          <div class="quick-suggestions">
            <button onclick="sendQuickMessage('Show me upsell opportunities')">All opportunities</button>
            <button onclick="sendQuickMessage('Which policies are up for renewal?')">Renewals due</button>
            <button onclick="sendQuickMessage('Summarize my dashboard for today')">Daily summary</button>
            <button onclick="sendQuickMessage('Show all lapse-risk clients and retention actions')">Retention risks</button>
            <button onclick="sendQuickMessage('Show open claims and urgent actions needed')">Open claims</button>
          </div>
        </div>
      </div>
    `;
  }
  // Reset toolbar to default Smart Advisor context
  const toolbar = document.getElementById('ctx-btn-toolbar');
  const meta = agentMeta['advisor'];
  if (toolbar && meta && meta.ctxGroups) {
    toolbar.innerHTML = meta.ctxGroups.map(grp => `
      <div class="ctx-group">
        <span class="ctx-group-label"><i class="fas ${grp.icon}"></i> ${grp.label}</span>
        <div class="ctx-btns">
          ${grp.btns.map(b => `
            <button class="ctx-btn ${b.cls}" onclick="sendQuickMessage('${b.msg.replace(/'/g, "\\'")}')">
              ${b.label}
            </button>`).join('')}
        </div>
      </div>`).join('');
  }
  // Reset agent name
  const nameEl = document.getElementById('chat-agent-name');
  const subEl  = document.getElementById('chat-agent-sub');
  if (nameEl) nameEl.textContent = 'Smart Advisor Agent';
  if (subEl)  subEl.textContent  = 'Insurance · Investments · Retirement · Advisory';
  document.querySelectorAll('.agent-card').forEach(c => c.classList.remove('active-agent'));
  const advisorCard = document.querySelector('.agent-card[onclick*="\'advisor\'"]');
  if (advisorCard) advisorCard.classList.add('active-agent');
}

function aiAnalyzeClient(btn) {
  const card = btn.closest('.client-card');
  const name = card?.querySelector('h4')?.textContent;
  if (name) {
    navigateTo('ai-agents');
    setTimeout(() => {
      const input = document.getElementById('chat-input');
      if (input) {
        input.value = `Analyze ${name} portfolio`;
        sendChatMessage();
      }
    }, 500);
  }
}

// ---- PRODUCTS TAB SWITCHING ----
function switchProductTab(tab) {
  // Update left nav items
  document.querySelectorAll('.tab-nav-item').forEach(el => el.classList.remove('active'));
  const activeNav = document.getElementById(`ptab-${tab}`);
  if (activeNav) activeNav.classList.add('active');

  // Update right panels
  document.querySelectorAll('.ptab-panel').forEach(el => el.classList.remove('active'));
  const activePanel = document.getElementById(`panel-${tab}`);
  if (activePanel) activePanel.classList.add('active');
}

// ---- QUICK QUOTE ----
function calculateQuote() {
  const result = document.getElementById('quote-result');
  if (result) result.style.display = 'block';
}

// ---- GLOBAL SEARCH ----
const globalSearch = document.getElementById('global-search');
if (globalSearch) {
  globalSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      if (q) {
        navigateTo('clients');
        setTimeout(() => filterClients(q), 300);
      }
    }
  });
}

// ---- KPI ANIMATION ----
function animateKPICards() {
  document.querySelectorAll('.kpi-value').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    setTimeout(() => {
      el.style.transition = 'all 0.45s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 60 + 80);
  });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initDashboardCharts();
  animateKPICards();

  // Add click handler for quick quote calculate
  document.addEventListener('click', (e) => {
    if (e.target.closest('.quote-actions .btn-primary')) {
      const result = document.getElementById('quote-result');
      if (result) result.style.display = 'block';
    }
  });
});

// ============================================================
//  POLICY MODAL — data, open, close, tab switch, render
// ============================================================

const policyData = {
  'P-100291': { id:'P-100291', client:'James Whitfield', clientInitials:'JW', clientAvatar:'jw', type:'Whole Life Insurance', premium:4800, faceValue:500000, status:'Active', issued:'2019-06-15', renewal:'2026-06-15', beneficiary:'Emily Whitfield', riders:['Paid-Up Additions Rider','Waiver of Premium','Accidental Death Benefit'], cashValue:'$48,200', dividends:'$2,140/yr (est.)', notes:'Policy in good standing. Consider paid-up additions rider review.', nextAction:'Annual policy review due Jun 2026', agent:'Sridhar R.' },
  'P-100292': { id:'P-100292', client:'James Whitfield', clientInitials:'JW', clientAvatar:'jw', type:'Term Life Insurance', premium:3200, faceValue:750000, status:'Active', issued:'2021-03-01', renewal:'2031-03-01', beneficiary:'Emily Whitfield', riders:['Convertibility Rider','Accelerated Death Benefit'], cashValue:'N/A', dividends:'N/A', notes:'20-year term. Convertible to whole life without evidence of insurability through 2031.', nextAction:'Discuss conversion option at age 55', agent:'Sridhar R.' },
  'P-100293': { id:'P-100293', client:'James Whitfield', clientInitials:'JW', clientAvatar:'jw', type:'Long-term Care Insurance', premium:4400, faceValue:250000, status:'Active', issued:'2022-11-10', renewal:'2027-11-10', beneficiary:'N/A', riders:['Inflation Protection 3%','Shared Care Rider'], cashValue:'N/A', dividends:'N/A', notes:'Daily benefit $200/day. 3-year benefit period. 90-day elimination period.', nextAction:'Review coverage level vs. current LTC costs', agent:'Sridhar R.' },
  'P-100301': { id:'P-100301', client:'Patricia Nguyen', clientInitials:'PN', clientAvatar:'pn', type:'Universal Life Insurance', premium:3000, faceValue:400000, status:'Active', issued:'2020-08-20', renewal:'2026-08-20', beneficiary:'Tom Nguyen', riders:['Overloan Protection Rider'], cashValue:'$21,400', dividends:'N/A — interest-credited', notes:'⚠️ Policy is under-funded for 2 consecutive quarters. Recommend premium catch-up review.', nextAction:'Urgent: schedule premium review call', agent:'Sridhar R.' },
  'P-100302': { id:'P-100302', client:'Patricia Nguyen', clientInitials:'PN', clientAvatar:'pn', type:'Variable Universal Life', premium:2800, faceValue:300000, status:'Active', issued:'2023-01-15', renewal:'2028-01-15', beneficiary:'Tom Nguyen', riders:['No-Lapse Guarantee','Dollar Cost Averaging'], cashValue:'$14,890 (market-linked)', dividends:'N/A — sub-account performance', notes:'30+ sub-account options. Current allocation: 60% equity / 40% fixed. Strong VUL candidate.', nextAction:'Review investment sub-account allocation Q2 2026', agent:'Sridhar R.' },
  'P-100310': { id:'P-100310', client:'Robert Chen', clientInitials:'RC', clientAvatar:'rc', type:'Whole Life Insurance', premium:6000, faceValue:1000000, status:'Active', issued:'2018-04-12', renewal:'2028-04-12', beneficiary:'Susan Chen', riders:['Paid-Up Additions','Business Continuation Rider','Waiver of Premium'], cashValue:'$82,500', dividends:'$3,800/yr (est.)', notes:'⚠️ Active death benefit claim CLM-2026-0041 filed 2026-04-09. Under review by Claims Dept.', nextAction:'Monitor claim resolution — est. 5-7 business days', agent:'Sridhar R.' },
  'P-100320': { id:'P-100320', client:'Sandra Williams', clientInitials:'SW', clientAvatar:'sw', type:'Term Life Insurance', premium:2800, faceValue:350000, status:'Review', issued:'2016-09-30', renewal:'2026-09-30', beneficiary:'Michael Williams', riders:['Convertibility Rider'], cashValue:'N/A', dividends:'N/A', notes:'⚠️ Policy up for renewal in Sept 2026. Client age 61 — conversion window closing. Prioritize outreach.', nextAction:'Urgent: schedule renewal/conversion discussion before Sept 2026', agent:'Sridhar R.' },
  'P-100330': { id:'P-100330', client:'Linda Morrison', clientInitials:'LM', clientAvatar:'lm', type:'Whole Life Insurance', premium:12000, faceValue:2000000, status:'Active', issued:'2015-12-01', renewal:'2030-12-01', beneficiary:'Trust', riders:['Paid-Up Additions Rider','Long-term Care Rider','Accidental Death Benefit'], cashValue:'$168,400', dividends:'$6,200/yr (est.)', notes:'Flagship policy. Trust beneficiary — coordinate with estate planning attorney. Excellent standing.', nextAction:'Annual review Apr 15 2026 — UMA + estate coordination', agent:'Sridhar R.' },
};

const policyAIInsights = {
  'P-100291': { score:94, risk:'Low', headline:'Strong Whole Life Policy — Cash Value Optimization Opportunity', points:['Cash value of $48,200 has grown 12.4% since issue. Consider Paid-Up Additions rider to accelerate accumulation.','Dividend of $2,140/yr can be redirected to purchase additional paid-up insurance (~$18K added death benefit over 10 yrs).','Client age 52 — ideal time to review estate planning integration of this policy.','No disability insurance on file. Consider adding Waiver of Premium rider review.'], opportunities:['Paid-Up Additions rider: potential +$18K death benefit','Estate plan coordination: Trust/Will beneficiary review','Cross-sell: Disability income insurance'], nextSteps:['Schedule Q2 2026 policy review call','Prepare paid-up additions illustration','Introduce estate planning attorney referral'] },
  'P-100292': { score:88, risk:'Low', headline:'Term Life — Conversion Window Opportunity', points:['20-year term policy. Client turns 55 in 3 years — conversion to permanent coverage should be discussed proactively.','$750K face value is adequate for current income replacement needs.','No investment or retirement products linked to this client — cross-domain opportunity.','Convertibility rider expires at policy renewal 2031.'], opportunities:['Convert to Whole Life: lock in insurability at current age/health','Add Annuity as income replacement complement','Disability insurance gap identified'], nextSteps:['Send conversion illustration in 2027 proactively','Discuss income annuity pairing for retirement','Schedule combined financial review'] },
  'P-100293': { score:91, risk:'Low', headline:'LTC Policy — Inflation Protection Review Needed', points:['$200/day daily benefit was set in 2022. Current NYC LTC average cost: $380/day — significant gap.','3% inflation protection rider should partially close gap over time, but coverage review is advised.','3-year benefit period may be insufficient. National average LTC need: 2.5 years, but 20% exceed 5 years.','Elimination period (90 days) is standard but client should confirm liquid assets to cover gap.'], opportunities:['Increase daily benefit at next renewal','Extend benefit period to 5 years if underwriting permits','Pair with annuity for guaranteed income during claim'], nextSteps:['Request updated LTC cost analysis for New York','Model 5-year vs 3-year benefit period difference','Discuss linked-benefit product options'] },
  'P-100301': { score:62, risk:'High', headline:'⚠️ Universal Life Under-Funded — Immediate Action Required', points:['Policy has been under-funded for 2 consecutive quarters. If continued, coverage may lapse.','Current cash value $21,400 is insufficient to sustain policy at current cost of insurance.','Client age 38 — if policy lapses now, re-qualification may require medical underwriting.','Recommended: premium catch-up of $1,800-$2,400 over next 3 months to restore policy health.'], opportunities:['Premium catch-up to restore policy health','Policy review to reset premium schedule','Consider converting to fixed premium structure'], nextSteps:['⚡ URGENT: Call Patricia Nguyen this week','Prepare premium catch-up illustration','Discuss policy restructuring options'] },
  'P-100302': { score:85, risk:'Low', headline:'VUL — Sub-Account Rebalancing Opportunity', points:['Current allocation 60/40 equity/fixed may be too aggressive for a conservative risk profile.','Sub-account performance YTD: +8.3% (ahead of blended benchmark).','Death benefit guaranteed minimum is intact regardless of sub-account performance.','Dollar cost averaging rider is active — confirm client understands investment risk component.'], opportunities:['Rebalance to target allocation (50/50 or 55/45)','Add fixed account allocation for stability','Review annual report for guaranteed minimum death benefit adequacy'], nextSteps:['Send Q2 2026 investment performance report','Schedule sub-account review call','Prepare rebalance illustration'] },
  'P-100310': { score:72, risk:'High', headline:'⚠️ Active Death Benefit Claim — CLM-2026-0041 In Progress', points:['Death benefit claim filed 2026-04-09 for $1,000,000. Currently Under Review by Claims Dept.','Policy has been active since 2018 — all premiums current, claim appears valid.','Expected resolution: 5-7 business days from filing. Estimated completion 2026-04-16.','Agent action: Ensure beneficiary (Susan Chen) has uploaded all required documentation.'], opportunities:['Expedite documentation upload to speed claim resolution','Schedule compassionate follow-up call with beneficiary','Identify surviving family members as prospective clients for new coverage'], nextSteps:['⚡ Follow up with Susan Chen re: documentation (call today)','Monitor claim status daily','Prepare new coverage needs analysis for surviving family'] },
  'P-100320': { score:55, risk:'Urgent', headline:'⚠️ URGENT — Renewal Due Sept 2026, Conversion Window Closing', points:['Sandra Williams, age 61, has a 20-year term policy expiring September 2026 — 5 months away.','Without action, coverage lapses and re-qualification requires new medical underwriting at age 61.','Conversion option available without medical evidence until renewal date.','Current face value $350K represents primary life insurance protection for Michael Williams.'], opportunities:['⚡ Convert to Whole Life or Universal Life before September 2026','Discuss long-term income and estate planning needs at renewal','Explore annuity options for retirement income supplement (Sandra, age 61)'], nextSteps:['⚡ URGENT: Call Sandra Williams this week','Prepare whole life vs UL conversion comparison','Schedule in-person renewal review meeting'] },
  'P-100330': { score:99, risk:'Low', headline:'Flagship Policy — Top Client, All Systems Optimal', points:['$2M Whole Life in excellent standing. Cash value $168,400 growing on track.','Trust beneficiary properly structured — coordinate with estate attorney for annual review.','Paid-Up Additions rider is generating +$6,200/yr in dividend-funded additions.','Long-term Care rider attached provides dual-purpose coverage — review LTC benefit adequacy.'], opportunities:['Paid-Up Additions: continue compounding for maximum estate value','Estate plan: annual review scheduled April 15 — coordinate UMA + trust update','Advisory UMA: $280K AUM candidate identified — fee opportunity $2,800/yr'], nextSteps:['Annual review April 15 — Linda Morrison (confirmed)','Coordinate estate attorney meeting','Present UMA illustration for $280K+ investable assets'] },
};

let _currentPolicyId = null;
let _currentPolicyTab = 'view';

function openPolicyModal(policyId, tab) {
  _currentPolicyId = policyId;
  window._currentPolicyModalId = policyId; // expose for NLP tab
  _currentPolicyTab = tab || 'view';
  const overlay = document.getElementById('policy-modal-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Set active tab
  document.querySelectorAll('#policy-modal-tabs .dmt-tab').forEach(t => t.classList.remove('active'));
  const tabMap = { view: 0, edit: 1, ai: 2, nlp: 3 };
  const tabs = document.querySelectorAll('#policy-modal-tabs .dmt-tab');
  if (tabs[tabMap[_currentPolicyTab]]) tabs[tabMap[_currentPolicyTab]].classList.add('active');
  renderPolicyModal(_currentPolicyId, _currentPolicyTab);
}

function closePolicyModal() {
  const overlay = document.getElementById('policy-modal-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function switchPolicyTab(tab, tabEl) {
  _currentPolicyTab = tab;
  document.querySelectorAll('#policy-modal-tabs .dmt-tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');
  renderPolicyModal(_currentPolicyId, tab);
}

function renderPolicyModal(policyId, tab) {
  const p = policyData[policyId];
  if (!p) return;
  const ai = policyAIInsights[policyId] || {};

  const headerEl = document.getElementById('policy-modal-header');
  const titleEl  = document.getElementById('policy-modal-title');
  const subEl    = document.getElementById('policy-modal-subtitle');
  const iconEl   = document.getElementById('policy-modal-icon');
  const bodyEl   = document.getElementById('policy-modal-body');

  titleEl.textContent = p.id + ' — ' + p.type;
  subEl.textContent   = p.client + ' · ' + p.status;

  // Header accent colour by status
  const hdrColors = { Active:'#003087', Review:'#d97706', Lapsed:'#dc2626' };
  if (headerEl) headerEl.style.borderBottomColor = hdrColors[p.status] || '#003087';

  const statusColors = { Active:'background:#d1fae5;color:#059669', Review:'background:#fef3c7;color:#d97706', Lapsed:'background:#fee2e2;color:#dc2626' };
  const sc = statusColors[p.status] || '';

  if (tab === 'view') {
    bodyEl.innerHTML = `
      <div class="pm-grid-2">
        <div class="pm-section">
          <div class="pm-section-title"><i class="fas fa-id-card"></i> Policy Overview</div>
          <div class="pm-field-grid">
            <div class="pm-field"><span class="pm-lbl">Policy ID</span><span class="pm-val mono">${p.id}</span></div>
            <div class="pm-field"><span class="pm-lbl">Status</span><span class="pm-val"><span style="padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;${sc}">${p.status}</span></span></div>
            <div class="pm-field"><span class="pm-lbl">Policy Type</span><span class="pm-val">${p.type}</span></div>
            <div class="pm-field"><span class="pm-lbl">Face Value</span><span class="pm-val bold">$${(p.faceValue/1000).toFixed(0)}K</span></div>
            <div class="pm-field"><span class="pm-lbl">Annual Premium</span><span class="pm-val bold">$${p.premium.toLocaleString()}</span></div>
            <div class="pm-field"><span class="pm-lbl">Cash Value</span><span class="pm-val green-text">${p.cashValue}</span></div>
            <div class="pm-field"><span class="pm-lbl">Dividends</span><span class="pm-val">${p.dividends}</span></div>
            <div class="pm-field"><span class="pm-lbl">Beneficiary</span><span class="pm-val">${p.beneficiary}</span></div>
            <div class="pm-field"><span class="pm-lbl">Issue Date</span><span class="pm-val">${p.issued}</span></div>
            <div class="pm-field"><span class="pm-lbl">Renewal Date</span><span class="pm-val ${p.status==='Review'?'text-orange':''}">${p.renewal}</span></div>
            <div class="pm-field"><span class="pm-lbl">Agent</span><span class="pm-val">${p.agent}</span></div>
          </div>
        </div>
        <div>
          <div class="pm-section">
            <div class="pm-section-title"><i class="fas fa-user-circle"></i> Insured Client</div>
            <div class="pm-client-row">
              <div class="pm-client-avatar ca-${p.clientAvatar}">${p.clientInitials}</div>
              <div><div class="pm-client-name">${p.client}</div><div class="pm-client-sub">Policyholder · ${p.type}</div></div>
            </div>
          </div>
          <div class="pm-section" style="margin-top:14px">
            <div class="pm-section-title"><i class="fas fa-plus-circle"></i> Riders &amp; Features</div>
            <div class="pm-riders-list">
              ${p.riders.map(r => `<div class="pm-rider"><i class="fas fa-check-circle" style="color:#059669;margin-right:6px"></i>${r}</div>`).join('')}
            </div>
          </div>
          <div class="pm-section" style="margin-top:14px">
            <div class="pm-section-title"><i class="fas fa-sticky-note"></i> Agent Notes</div>
            <div class="pm-notes">${p.notes}</div>
          </div>
          <div class="pm-next-action">
            <i class="fas fa-arrow-circle-right"></i>
            <span><strong>Next Action:</strong> ${p.nextAction}</span>
          </div>
        </div>
      </div>
    `;
  } else if (tab === 'edit') {
    bodyEl.innerHTML = `
      <div class="pm-edit-form">
        <div class="pm-edit-notice"><i class="fas fa-info-circle"></i> Fields marked with * are editable. Changes require supervisor approval for face value and beneficiary.</div>
        <div class="pm-grid-2">
          <div>
            <div class="pm-section-title" style="margin-bottom:12px"><i class="fas fa-file-contract"></i> Policy Information</div>
            <div class="pm-form-group"><label>Policy ID</label><input class="pm-input" value="${p.id}" disabled/></div>
            <div class="pm-form-group"><label>Policy Type</label><input class="pm-input" value="${p.type}" disabled/></div>
            <div class="pm-form-group"><label>Status *</label>
              <select class="pm-input">
                <option ${p.status==='Active'?'selected':''}>Active</option>
                <option ${p.status==='Review'?'selected':''}>Review</option>
                <option ${p.status==='Lapsed'?'selected':''}>Lapsed</option>
              </select>
            </div>
            <div class="pm-form-group"><label>Annual Premium *</label><input class="pm-input" value="$${p.premium.toLocaleString()}"/></div>
            <div class="pm-form-group"><label>Face Value * <span class="pm-approval-note">(requires approval)</span></label><input class="pm-input" value="$${(p.faceValue/1000).toFixed(0)}K"/></div>
            <div class="pm-form-group"><label>Renewal Date</label><input class="pm-input" value="${p.renewal}" type="date"/></div>
          </div>
          <div>
            <div class="pm-section-title" style="margin-bottom:12px"><i class="fas fa-user"></i> Beneficiary &amp; Notes</div>
            <div class="pm-form-group"><label>Beneficiary * <span class="pm-approval-note">(requires approval)</span></label><input class="pm-input" value="${p.beneficiary}"/></div>
            <div class="pm-form-group"><label>Agent Notes *</label><textarea class="pm-input pm-textarea">${p.notes}</textarea></div>
            <div class="pm-form-group"><label>Next Action *</label><input class="pm-input" value="${p.nextAction}"/></div>
          </div>
        </div>
        <div class="pm-form-actions">
          <button class="btn btn-outline-sm" onclick="closePolicyModal()"><i class="fas fa-times"></i> Cancel</button>
          <button class="btn btn-primary" onclick="savePolicyChanges('${p.id}')"><i class="fas fa-save"></i> Save Changes</button>
        </div>
      </div>
    `;
  } else if (tab === 'ai') {
    const riskColor = { Low:'#059669', High:'#d97706', Urgent:'#dc2626' };
    const rc = riskColor[ai.risk] || '#003087';
    bodyEl.innerHTML = `
      <div class="pm-ai-panel">
        <div class="pm-ai-header">
          <div class="pm-ai-score-ring" style="--score-color:${rc}">
            <span class="pm-ai-score-num">${ai.score}</span>
            <span class="pm-ai-score-lbl">Health Score</span>
          </div>
          <div class="pm-ai-summary">
            <div class="pm-ai-risk-badge" style="background:${rc}20;color:${rc};border:1px solid ${rc}40">
              <i class="fas fa-${ai.risk==='Low'?'shield-alt':ai.risk==='High'?'exclamation-triangle':'fire'}"></i> ${ai.risk} Risk
            </div>
            <h4>${ai.headline}</h4>
            <p class="pm-ai-policy-ref"><i class="fas fa-file-contract"></i> ${p.id} · ${p.client} · ${p.type}</p>
          </div>
        </div>
        <div class="pm-ai-grid-3">
          <div class="pm-ai-section">
            <div class="pm-ai-section-title"><i class="fas fa-search"></i> AI Findings</div>
            ${ai.points.map(pt => `<div class="pm-ai-point"><i class="fas fa-angle-right"></i><span>${pt}</span></div>`).join('')}
          </div>
          <div class="pm-ai-section">
            <div class="pm-ai-section-title"><i class="fas fa-lightbulb"></i> Opportunities</div>
            ${(ai.opportunities||[]).map(o => `<div class="pm-ai-opp"><i class="fas fa-star" style="color:#d97706"></i><span>${o}</span></div>`).join('')}
          </div>
          <div class="pm-ai-section">
            <div class="pm-ai-section-title"><i class="fas fa-tasks"></i> Recommended Actions</div>
            ${(ai.nextSteps||[]).map((s,i) => `<div class="pm-ai-step"><span class="pm-ai-step-num">${i+1}</span><span>${s}</span></div>`).join('')}
          </div>
        </div>
        <div class="pm-ai-cta">
          <button class="btn btn-ai" onclick="navigateTo('ai-agents')"><i class="fas fa-robot"></i> Open Full AI Agent</button>
          <button class="btn btn-outline-sm" onclick="switchPolicyTab('edit', document.querySelectorAll('#policy-modal-tabs .dmt-tab')[1])"><i class="fas fa-edit"></i> Edit Policy</button>
        </div>
      </div>
    `;
  }
}

function savePolicyChanges(policyId) {
  const bodyEl = document.getElementById('policy-modal-body');
  bodyEl.innerHTML = `<div class="pm-save-success"><div class="pm-save-icon"><i class="fas fa-check-circle"></i></div><h4>Changes Saved</h4><p>Policy ${policyId} has been updated successfully. Changes requiring approval have been submitted for supervisor review.</p><button class="btn btn-primary" onclick="closePolicyModal()">Done</button></div>`;
}

// ============================================================
//  CLAIM MODAL — data, open, close, tab switch, render
// ============================================================

const claimData = {
  'CLM-2026-0041': { id:'CLM-2026-0041', client:'Robert Chen', clientInitials:'RC', clientAvatar:'rc', policy:'P-100310', policyType:'Whole Life Insurance', type:'Death Benefit', typeBadge:'death', amount:'$1,000,000', filedDate:'2026-04-09', status:'Under Review', statusBadge:'review', priority:'Urgent', assignedTo:'Claims Dept.', adjuster:'Michael Torres', contact:'susan.chen@email.com', claimant:'Susan Chen (Beneficiary)', description:'Death benefit claim for policyholder Robert Chen. Documentation received. Cause of death: cardiac event (per medical certificate). Claim under adjudication review.', docsRequired:['Death Certificate (✅ Received 2026-04-09)','Medical Certificate (✅ Received 2026-04-09)','Claimant Identity Documents (⏳ Pending)','Bank Details for Payout (⏳ Pending)'], timeline:[{date:'2026-04-09',event:'Claim filed by beneficiary Susan Chen',icon:'fa-file-alt'},{date:'2026-04-09',event:'Initial documentation received',icon:'fa-check'},{date:'2026-04-10',event:'Assigned to adjuster Michael Torres',icon:'fa-user-tie'},{date:'2026-04-10',event:'Under Review — medical certificate verified',icon:'fa-search'},{date:'Est. 2026-04-16',event:'Expected resolution',icon:'fa-calendar-check'}], estimatedPayout:'2026-04-17 – 2026-04-19', notes:'Urgent — $1M claim. Expedite documentation collection from claimant.' },
  'CLM-2026-0038': { id:'CLM-2026-0038', client:'Sandra Williams', clientInitials:'SW', clientAvatar:'sw', policy:'P-100321', policyType:'Long-term Care Insurance', type:'Long-term Care', typeBadge:'ltc', amount:'$18,000', filedDate:'2026-04-01', status:'Open', statusBadge:'open', priority:'Normal', assignedTo:'LTC Team', adjuster:'Jennifer Kim', contact:'sandra.w@email.com', claimant:'Sandra Williams (Policyholder)', description:'LTC claim for home-care services initiated after hospitalization. Claimant receiving licensed home health aide services 5 days/week. Daily benefit $200/day. Claim covers 90-day benefit period.', docsRequired:['LTC Eligibility Certification (✅ Received)','Care Provider License (✅ Received)','Plan of Care Document (⏳ Pending)','Monthly Care Summary (⏳ Pending — due monthly)'], timeline:[{date:'2026-04-01',event:'LTC claim filed by Sandra Williams',icon:'fa-file-alt'},{date:'2026-04-01',event:'Initial eligibility check passed',icon:'fa-check'},{date:'2026-04-03',event:'Assigned to LTC Team — Jennifer Kim',icon:'fa-user-tie'},{date:'2026-04-05',event:'Care provider documents verified',icon:'fa-check'},{date:'2026-04-10',event:'Plan of Care document pending from care provider',icon:'fa-hourglass-half'}], estimatedPayout:'Monthly — first payment est. 2026-04-20', notes:'Regular monthly claims expected. Set up recurring payment schedule once Plan of Care is approved.' },
  'CLM-2026-0035': { id:'CLM-2026-0035', client:'Maria Gonzalez', clientInitials:'MG', clientAvatar:'mg', policy:'P-100341', policyType:'Disability Insurance', type:'Disability', typeBadge:'disability', amount:'$4,200/mo', filedDate:'2026-03-22', status:'Pending Docs', statusBadge:'pending', priority:'Normal', assignedTo:'DI Unit', adjuster:'Carlos Reyes', contact:'maria.g@email.com', claimant:'Maria Gonzalez (Policyholder)', description:'Individual disability claim — policyholder unable to perform own occupation duties following back surgery on 2026-03-10. Claim covers 60% income replacement ($4,200/month) after 90-day elimination period.', docsRequired:['Attending Physician Statement (⏳ Pending from Dr. Hernandez)','Employer Income Verification (⏳ Pending)','Surgical Report (✅ Received)','Pre-disability earnings documentation (✅ Received)'], timeline:[{date:'2026-03-22',event:'DI claim filed',icon:'fa-file-alt'},{date:'2026-03-22',event:'Surgical records received',icon:'fa-check'},{date:'2026-03-25',event:'Assigned to DI Unit — Carlos Reyes',icon:'fa-user-tie'},{date:'2026-04-01',event:'Pending: Attending Physician Statement',icon:'fa-hourglass-half'},{date:'Est. 2026-04-25',event:'Expected first payment (post elimination period)',icon:'fa-calendar-check'}], estimatedPayout:'Est. 2026-06-10 (after 90-day elimination)', notes:'Follow up with Maria Gonzalez re: physician statement. Expected monthly benefit $4,200.' },
  'CLM-2026-0033': { id:'CLM-2026-0033', client:'James Whitfield', clientInitials:'JW', clientAvatar:'jw', policy:'P-100293', policyType:'Long-term Care Insurance', type:'Long-term Care', typeBadge:'ltc', amount:'$9,600', filedDate:'2026-03-15', status:'Under Review', statusBadge:'review', priority:'Normal', assignedTo:'LTC Team', adjuster:'Jennifer Kim', contact:'james.w@email.com', claimant:'James Whitfield (Policyholder)', description:'LTC claim for assisted living facility placement. Monthly facility cost $3,200. Daily benefit $200/day applicable. Claim covers 48-day benefit period requested for Q2 2026.', docsRequired:['LTC Eligibility Certification (✅ Received)','Facility Admission Records (✅ Received)','ADL Assessment (✅ Received 2 of 6 ADLs impaired)','Facility License (✅ Received)'], timeline:[{date:'2026-03-15',event:'LTC claim filed',icon:'fa-file-alt'},{date:'2026-03-16',event:'All documents received — complete file',icon:'fa-check'},{date:'2026-03-18',event:'Assigned to LTC Team — Jennifer Kim',icon:'fa-user-tie'},{date:'2026-03-25',event:'ADL assessment verified — 2 of 6 impaired (meets threshold)',icon:'fa-check'},{date:'Est. 2026-04-15',event:'Expected approval and first payment',icon:'fa-calendar-check'}], estimatedPayout:'Est. 2026-04-18', notes:'File is complete. ADL threshold met. Expected approval within 5 days.' },
  'CLM-2026-0031': { id:'CLM-2026-0031', client:'Linda Morrison', clientInitials:'LM', clientAvatar:'lm', policy:'P-100362', policyType:'Variable Universal Life', type:'Waiver of Premium', typeBadge:'waiver', amount:'$9,600/yr', filedDate:'2026-03-10', status:'Open', statusBadge:'open', priority:'Low', assignedTo:'Agent Support', adjuster:'Priya Sharma', contact:'linda.m@email.com', claimant:'Linda Morrison (Policyholder)', description:'Waiver of premium claim — policyholder temporarily disabled following elective surgery. Claim waives annual premium of $9,600 for duration of disability. Expected recovery 60-90 days.', docsRequired:['Disability Certification (✅ Received)','Surgical Report (✅ Received)','Physician Recovery Estimate (✅ Received — 60-90 days)','Premium Waiver Application (✅ Received)'], timeline:[{date:'2026-03-10',event:'Waiver of premium claim filed',icon:'fa-file-alt'},{date:'2026-03-10',event:'All supporting documents received',icon:'fa-check'},{date:'2026-03-12',event:'Assigned to Agent Support — Priya Sharma',icon:'fa-user-tie'},{date:'2026-03-14',event:'Physician estimate reviewed — approved for 90 days',icon:'fa-check'},{date:'Est. 2026-06-10',event:'Expected disability end date — premium reinstatement',icon:'fa-calendar-check'}], estimatedPayout:'Premium waived: $9,600/yr prorated ~$2,400/qtr', notes:'Low priority. Premium waiver approved. Monitor for disability end date and schedule premium reinstatement.' },
  'CLM-2026-0028': { id:'CLM-2026-0028', client:'Maria Gonzalez', clientInitials:'MG', clientAvatar:'mg', policy:'P-100340', policyType:'Universal Life Insurance', type:'Accelerated Benefit', typeBadge:'accelerated', amount:'$120,000', filedDate:'2026-03-05', status:'Pending Docs', statusBadge:'pending', priority:'Urgent', assignedTo:'Claims Dept.', adjuster:'Michael Torres', contact:'maria.g@email.com', claimant:'Maria Gonzalez (Policyholder)', description:'Accelerated Death Benefit (ADB) claim — terminal illness diagnosis. Policyholder requesting accelerated access to 12% of face value ($120K of $600K) for medical expenses and care planning.', docsRequired:['Terminal Illness Certification (⏳ Pending from oncologist)','Life Expectancy Statement — <12 months (⏳ Pending)','ADB Application Form (✅ Received)','Medical Records Summary (✅ Partial — more needed)'], timeline:[{date:'2026-03-05',event:'ADB claim filed',icon:'fa-file-alt'},{date:'2026-03-06',event:'ADB application received',icon:'fa-check'},{date:'2026-03-08',event:'Assigned to Claims Dept. — Michael Torres',icon:'fa-user-tie'},{date:'2026-03-20',event:'Terminal illness certification pending from oncologist',icon:'fa-hourglass-half'},{date:'Est. 2026-04-20',event:'Expected resolution pending docs',icon:'fa-calendar-check'}], estimatedPayout:'Est. 2026-04-22 once docs complete', notes:'⚡ URGENT: Compassionate case. Follow up with oncologist office re: terminal certification. Expedite for client.' },
  'CLM-2026-0025': { id:'CLM-2026-0025', client:'Kevin Park', clientInitials:'KP', clientAvatar:'kp', policy:'P-100350', policyType:'Term Life Insurance', type:'Death Benefit', typeBadge:'death', amount:'$250,000', filedDate:'2026-02-28', status:'Under Review', statusBadge:'review', priority:'Normal', assignedTo:'Claims Dept.', adjuster:'Michael Torres', contact:'kevin.p@email.com', claimant:'Estate of Kevin Park', description:'Death benefit claim filed by estate. Policy was in Pending status — application had been submitted. Claim under review to determine if coverage was in force at time of death.', docsRequired:['Death Certificate (✅ Received)','Contestability Review (✅ In Progress — 2-year window not exceeded)','Medical Records (⏳ Pending — underwriting review)','Estate Documentation (⏳ Pending)'], timeline:[{date:'2026-02-28',event:'Death benefit claim filed by estate',icon:'fa-file-alt'},{date:'2026-03-01',event:'Death certificate received and verified',icon:'fa-check'},{date:'2026-03-03',event:'Contestability review initiated',icon:'fa-search'},{date:'2026-03-10',event:'Medical records request sent',icon:'fa-hourglass-half'},{date:'Est. 2026-04-20',event:'Expected determination',icon:'fa-calendar-check'}], estimatedPayout:'Pending determination of coverage status', notes:'Policy was in Pending status. Claim under special review. Medical records needed to confirm coverage.' },
  // Resolved claims
  'CLM-2026-0022': { id:'CLM-2026-0022', client:'Linda Morrison', clientInitials:'LM', clientAvatar:'lm', policy:'P-100360', policyType:'Whole Life Insurance', type:'Death Benefit (Rider)', typeBadge:'death', amount:'$50,000', filedDate:'2026-02-10', status:'Paid', statusBadge:'paid', priority:'Low', assignedTo:'Claims Dept.', adjuster:'Priya Sharma', contact:'linda.m@email.com', claimant:'Linda Morrison (Policyholder via Rider)', description:'Accidental Death Benefit rider claim. Spouse accidental death. Rider payout of $50,000 in addition to base policy. Resolved in 7 days.', docsRequired:['Death Certificate (✅ Received)','Accidental Death Report (✅ Received)','Beneficiary Identification (✅ Received)'], timeline:[{date:'2026-02-10',event:'Rider claim filed',icon:'fa-file-alt'},{date:'2026-02-11',event:'All docs received',icon:'fa-check'},{date:'2026-02-14',event:'Adjuster review complete',icon:'fa-check'},{date:'2026-02-17',event:'Payment of $50,000 issued',icon:'fa-dollar-sign'}], estimatedPayout:'$50,000 — PAID 2026-02-17', notes:'Resolved. Payment confirmed. No further action required.' },
  'CLM-2026-0019': { id:'CLM-2026-0019', client:'Robert Chen', clientInitials:'RC', clientAvatar:'rc', policy:'P-100311', policyType:'Variable Universal Life', type:'Waiver of Premium', typeBadge:'waiver', amount:'$8,400/yr', filedDate:'2026-01-20', status:'Approved', statusBadge:'paid', priority:'Low', assignedTo:'Claims Dept.', adjuster:'Priya Sharma', contact:'robert.c@email.com', claimant:'Robert Chen (Policyholder)', description:'Waiver of premium approved following temporary disability. 4-day resolution. Annual premium of $8,400 waived for disability period (45 days).', docsRequired:['Disability Cert (✅ Received)','Physician Statement (✅ Received)'], timeline:[{date:'2026-01-20',event:'Claim filed',icon:'fa-file-alt'},{date:'2026-01-21',event:'Docs received',icon:'fa-check'},{date:'2026-01-24',event:'Approved — premium waived',icon:'fa-check-circle'}], estimatedPayout:'Premium waived — APPROVED 2026-01-24', notes:'Resolved. Client returned to work 2026-03-05. Premium reinstated.' },
  'CLM-2026-0015': { id:'CLM-2026-0015', client:'James Whitfield', clientInitials:'JW', clientAvatar:'jw', policy:'P-100291', policyType:'Whole Life Insurance', type:'Accelerated Benefit', typeBadge:'accelerated', amount:'$75,000', filedDate:'2026-01-08', status:'Paid', statusBadge:'paid', priority:'Normal', assignedTo:'Claims Dept.', adjuster:'Michael Torres', contact:'james.w@email.com', claimant:'James Whitfield (Policyholder)', description:'ADB claim — chronic illness. $75,000 accelerated from $500K face value. Used for long-term care and medical expenses. Resolved in 7 days.', docsRequired:['Chronic Illness Cert (✅ Received)','Physician Statement (✅ Received)','ADB Application (✅ Received)'], timeline:[{date:'2026-01-08',event:'ADB claim filed',icon:'fa-file-alt'},{date:'2026-01-09',event:'All docs verified',icon:'fa-check'},{date:'2026-01-15',event:'$75,000 paid to policyholder',icon:'fa-dollar-sign'}], estimatedPayout:'$75,000 — PAID 2026-01-15', notes:'Resolved. Face value reduced to $425K. Policy remains in force.' },
  'CLM-2025-0198': { id:'CLM-2025-0198', client:'Sandra Williams', clientInitials:'SW', clientAvatar:'sw', policy:'P-100320', policyType:'Term Life Insurance', type:'Disability', typeBadge:'disability', amount:'$12,600', filedDate:'2025-12-01', status:'Paid', statusBadge:'paid', priority:'Normal', assignedTo:'DI Unit', adjuster:'Carlos Reyes', contact:'sandra.w@email.com', claimant:'Sandra Williams (Policyholder)', description:'Short-term disability claim following knee surgery. 3-month benefit paid ($4,200/month for 3 months = $12,600 total). Resolved in 7 days.', docsRequired:['Surgical Report (✅ Received)','Disability Cert (✅ Received)','Income Verification (✅ Received)'], timeline:[{date:'2025-12-01',event:'DI claim filed',icon:'fa-file-alt'},{date:'2025-12-03',event:'Docs verified',icon:'fa-check'},{date:'2025-12-08',event:'$12,600 benefit approved and paid',icon:'fa-dollar-sign'}], estimatedPayout:'$12,600 — PAID 2025-12-08', notes:'Resolved. Client recovered and returned to work Jan 2026.' },
};

const claimAIInsights = {
  'CLM-2026-0041': { headline:'Urgent $1M Death Benefit — Expedite Documentation', risk:'Urgent', points:['Claim filed 2026-04-09 for Robert Chen (age 45). Death benefit $1,000,000.','Beneficiary Susan Chen has not yet uploaded identity documents or bank details.','Policy in excellent standing — all premiums current. Claim is valid.','Estimated payout window: 2026-04-17 to 2026-04-19 once docs complete.'], actions:['⚡ Call Susan Chen today re: missing identity documents + bank details','Assign priority flag in claims system','Prepare compassionate follow-up script for beneficiary support','Identify if family members need new coverage consultation'] },
  'CLM-2026-0038': { headline:'LTC Monthly Claim — Plan of Care Needed', risk:'Normal', points:['Sandra Williams LTC claim is proceeding. Daily benefit $200/day being paid.','Plan of Care document still pending from home health care provider.','Monthly recurring claim expected. First payment due ~2026-04-20.','Coverage adequate for near-term needs. Review benefit period in 6 months.'], actions:['Send reminder to home health agency re: Plan of Care document','Set up recurring monthly claim schedule once approved','Review coverage vs. NYC LTC costs at next annual review','Explore annuity income supplement to cover any benefit gap'] },
  'CLM-2026-0035': { headline:'Disability Claim — Physician Statement Blocking Progress', risk:'Normal', points:['Maria Gonzalez DI claim filed 2026-03-22. Back surgery 2026-03-10.','Attending Physician Statement (APS) from Dr. Hernandez is blocking claim progress.','90-day elimination period runs through June 2026. Monthly benefit $4,200.','Employer income verification also still pending.'], actions:['Contact Dr. Hernandez office directly to expedite APS','Send employer income verification request reminder to Maria','Confirm elimination period calculation: coverage begins ~2026-06-10','Review coverage adequacy — 60% income replacement may be insufficient long-term'] },
  'CLM-2026-0033': { headline:'LTC Claim — Complete File, Approval Imminent', risk:'Low', points:['James Whitfield LTC claim file is complete. ADL threshold met (2 of 6).','Facility admission and eligibility documents all received.','Expected approval within 5 business days. Payment ~2026-04-18.','LTC benefit period: 3 years. Client in assisted living facility.'], actions:['No urgent action needed. Monitor for approval by 2026-04-15.','Notify James Whitfield of expected approval timeline','Review benefit adequacy vs. NYC assisted living costs at renewal'] },
  'CLM-2026-0031': { headline:'Premium Waiver Approved — Monitor Recovery', risk:'Low', points:['Linda Morrison waiver of premium approved for ~90 days (through ~June 2026).','Annual premium $9,600 waived prorated. Expected savings ~$2,400/qtr.','Physician estimate indicates recovery complete by June 2026.','All documents verified. No further action until disability end date.'], actions:['Schedule premium reinstatement reminder for June 2026','Confirm with Linda Morrison her recovery status in May','Annual review on April 15 — include waiver update in agenda'] },
  'CLM-2026-0028': { headline:'⚡ URGENT — ADB Compassionate Case Pending Terminal Certification', risk:'Urgent', points:['Maria Gonzalez ADB claim for $120,000 (terminal illness — oncology).','Terminal illness certification pending from oncologist office.','This is a compassionate case — client requires expedited processing.','ADB payout reduces face value from $600K to $480K on P-100340.'], actions:['⚡ Call oncologist office immediately — request expedited terminal certification','Assign senior adjuster for compassionate handling','Prepare payout wire instructions in advance','Schedule compassionate support follow-up call with Maria Gonzalez'] },
  'CLM-2026-0025': { headline:'Coverage Determination Required — Policy Was Pending', risk:'High', points:['Kevin Park policy P-100350 was in Pending status at time of death.','Claim requires determination of whether coverage was in force.','Contestability review in progress — 2-year window not applicable (new policy).','Medical records needed to confirm underwriting status.'], actions:['⚡ Expedite medical records request','Coordinate with underwriting team for binding coverage determination','Document all communications with estate representatives','If coverage confirmed in force: process $250K claim'] },
  'CLM-2026-0022': { headline:'Resolved — No Action Required', risk:'Low', points:['Claim paid 2026-02-17. $50,000 accidental death benefit rider paid.','7-day resolution — excellent performance.','Policy P-100360 continues in force. Face value unaffected by rider payout.'], actions:['No action required. File closed.','Consider following up with Linda Morrison re: estate update after payout.'] },
  'CLM-2026-0019': { headline:'Resolved — Premium Reinstated', risk:'Low', points:['Waiver of premium approved and expired. Client returned to work.','Premium of $8,400/yr reinstated 2026-03-05.'], actions:['No action required. File closed.'] },
  'CLM-2026-0015': { headline:'Resolved — ADB Paid, Policy Continues', risk:'Low', points:['$75,000 ADB paid 2026-01-15. Face value reduced to $425K.','Policy P-100291 remains in force with modified face value.'], actions:['Review updated face value adequacy at next annual review.'] },
  'CLM-2025-0198': { headline:'Resolved — DI Benefit Paid', risk:'Low', points:['$12,600 disability benefit paid. Client recovered and returned to work.','Policy P-100320 remains in force.'], actions:['No action required. Note: policy P-100320 renewal due Sept 2026 — priority outreach needed.'] },
};

let _currentClaimId = null;
let _currentClaimTab = 'view';

function openClaimModal(claimId, tab) {
  _currentClaimId = claimId;
  _currentClaimTab = tab || 'view';
  const overlay = document.getElementById('claim-modal-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Set active tab
  document.querySelectorAll('#claim-modal-tabs .dmt-tab').forEach(t => t.classList.remove('active'));
  const tabMap = { view: 0, ai: 1 };
  const tabs = document.querySelectorAll('#claim-modal-tabs .dmt-tab');
  if (tabs[tabMap[_currentClaimTab]]) tabs[tabMap[_currentClaimTab]].classList.add('active');
  renderClaimModal(_currentClaimId, _currentClaimTab);
}

function closeClaimModal() {
  const overlay = document.getElementById('claim-modal-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function switchClaimTab(tab, tabEl) {
  _currentClaimTab = tab;
  document.querySelectorAll('#claim-modal-tabs .dmt-tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');
  renderClaimModal(_currentClaimId, tab);
}

function renderClaimModal(claimId, tab) {
  const c = claimData[claimId];
  if (!c) return;
  const ai = claimAIInsights[claimId] || {};

  const titleEl  = document.getElementById('claim-modal-title');
  const subEl    = document.getElementById('claim-modal-subtitle');
  const bodyEl   = document.getElementById('claim-modal-body');
  const hdrEl    = document.getElementById('claim-modal-header');

  titleEl.textContent = c.id + ' — ' + c.type;
  subEl.textContent   = c.client + ' · ' + c.status + ' · ' + c.priority;

  const hdrColors = { 'Under Review':'#003087', Open:'#059669', 'Pending Docs':'#d97706', Paid:'#059669', Approved:'#059669', Denied:'#dc2626' };
  if (hdrEl) hdrEl.style.borderBottomColor = hdrColors[c.status] || '#003087';

  if (tab === 'view') {
    const statusColors = { 'Under Review':'background:#dbeafe;color:#1d4ed8', Open:'background:#fee2e2;color:#dc2626', 'Pending Docs':'background:#fef3c7;color:#d97706', Paid:'background:#d1fae5;color:#059669', Approved:'background:#d1fae5;color:#059669' };
    const sc = statusColors[c.status] || '';
    const prColors = { Urgent:'background:#fee2e2;color:#dc2626', Normal:'background:#dbeafe;color:#1d4ed8', Low:'background:#f1f5f9;color:#64748b' };
    const pc = prColors[c.priority] || '';

    bodyEl.innerHTML = `
      <div class="pm-grid-2">
        <div>
          <div class="pm-section">
            <div class="pm-section-title"><i class="fas fa-file-medical-alt"></i> Claim Summary</div>
            <div class="pm-field-grid">
              <div class="pm-field"><span class="pm-lbl">Claim ID</span><span class="pm-val mono">${c.id}</span></div>
              <div class="pm-field"><span class="pm-lbl">Status</span><span class="pm-val"><span style="padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;${sc}">${c.status}</span></span></div>
              <div class="pm-field"><span class="pm-lbl">Priority</span><span class="pm-val"><span style="padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;${pc}">${c.priority}</span></span></div>
              <div class="pm-field"><span class="pm-lbl">Claim Type</span><span class="pm-val">${c.type}</span></div>
              <div class="pm-field"><span class="pm-lbl">Amount</span><span class="pm-val bold">${c.amount}</span></div>
              <div class="pm-field"><span class="pm-lbl">Filed Date</span><span class="pm-val">${c.filedDate}</span></div>
              <div class="pm-field"><span class="pm-lbl">Linked Policy</span><span class="pm-val mono">${c.policy}</span></div>
              <div class="pm-field"><span class="pm-lbl">Policy Type</span><span class="pm-val">${c.policyType}</span></div>
              <div class="pm-field"><span class="pm-lbl">Assigned To</span><span class="pm-val">${c.assignedTo}</span></div>
              <div class="pm-field"><span class="pm-lbl">Adjuster</span><span class="pm-val">${c.adjuster}</span></div>
              <div class="pm-field"><span class="pm-lbl">Claimant</span><span class="pm-val">${c.claimant}</span></div>
              <div class="pm-field"><span class="pm-lbl">Est. Payout</span><span class="pm-val">${c.estimatedPayout}</span></div>
            </div>
          </div>
          <div class="pm-section" style="margin-top:14px">
            <div class="pm-section-title"><i class="fas fa-align-left"></i> Claim Description</div>
            <div class="pm-notes">${c.description}</div>
          </div>
          <div class="pm-section" style="margin-top:14px">
            <div class="pm-section-title"><i class="fas fa-sticky-note"></i> Agent Notes</div>
            <div class="pm-notes">${c.notes}</div>
          </div>
        </div>
        <div>
          <div class="pm-section">
            <div class="pm-section-title"><i class="fas fa-user-circle"></i> Client</div>
            <div class="pm-client-row">
              <div class="pm-client-avatar ca-${c.clientAvatar}">${c.clientInitials}</div>
              <div><div class="pm-client-name">${c.client}</div><div class="pm-client-sub">${c.claimant}</div></div>
            </div>
          </div>
          <div class="pm-section" style="margin-top:14px">
            <div class="pm-section-title"><i class="fas fa-paperclip"></i> Documents Checklist</div>
            <div class="pm-docs-list">
              ${c.docsRequired.map(d => {
                const done = d.includes('✅');
                return `<div class="pm-doc-item ${done?'doc-done':'doc-pending'}"><i class="fas fa-${done?'check-circle':'clock'}"></i><span>${d}</span></div>`;
              }).join('')}
            </div>
            ${c.docsRequired.some(d=>d.includes('⏳')) ? `<button class="btn btn-outline-sm" style="margin-top:10px;width:100%" onclick="alert('Document request reminders sent via AI.')"><i class="fas fa-paper-plane"></i> Send Doc Reminders</button>` : ''}
          </div>
          <div class="pm-section" style="margin-top:14px">
            <div class="pm-section-title"><i class="fas fa-stream"></i> Claim Timeline</div>
            <div class="pm-timeline">
              ${c.timeline.map((t,i) => `
                <div class="pm-timeline-item ${i===c.timeline.length-1?'pm-tl-last':''}">
                  <div class="pm-tl-dot"><i class="fas ${t.icon}"></i></div>
                  <div class="pm-tl-content">
                    <div class="pm-tl-date">${t.date}</div>
                    <div class="pm-tl-event">${t.event}</div>
                  </div>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (tab === 'ai') {
    const riskColor = { Low:'#059669', Normal:'#003087', High:'#d97706', Urgent:'#dc2626' };
    const rc = riskColor[ai.risk] || '#003087';
    bodyEl.innerHTML = `
      <div class="pm-ai-panel">
        <div class="pm-ai-header">
          <div class="pm-ai-score-ring" style="--score-color:${rc}">
            <i class="fas fa-${ai.risk==='Low'?'check-circle':ai.risk==='Urgent'?'fire':'exclamation-triangle'}" style="font-size:28px;color:${rc}"></i>
            <span class="pm-ai-score-lbl">${ai.risk} Risk</span>
          </div>
          <div class="pm-ai-summary">
            <div class="pm-ai-risk-badge" style="background:${rc}20;color:${rc};border:1px solid ${rc}40">
              <i class="fas fa-robot"></i> AI Assessment
            </div>
            <h4>${ai.headline}</h4>
            <p class="pm-ai-policy-ref"><i class="fas fa-file-medical-alt"></i> ${c.id} · ${c.client} · ${c.type}</p>
          </div>
        </div>
        <div class="pm-ai-grid-2">
          <div class="pm-ai-section">
            <div class="pm-ai-section-title"><i class="fas fa-search"></i> AI Findings</div>
            ${(ai.points||[]).map(pt => `<div class="pm-ai-point"><i class="fas fa-angle-right"></i><span>${pt}</span></div>`).join('')}
          </div>
          <div class="pm-ai-section">
            <div class="pm-ai-section-title"><i class="fas fa-tasks"></i> Recommended Actions</div>
            ${(ai.actions||[]).map((s,i) => `<div class="pm-ai-step"><span class="pm-ai-step-num">${i+1}</span><span>${s}</span></div>`).join('')}
          </div>
        </div>
        <div class="pm-ai-cta">
          <button class="btn btn-ai" onclick="navigateTo('ai-agents')"><i class="fas fa-robot"></i> Open Full AI Agent</button>
          <button class="btn btn-outline-sm" onclick="switchClaimTab('view', document.querySelectorAll('#claim-modal-tabs .dmt-tab')[0])"><i class="fas fa-eye"></i> Back to Claim Details</button>
        </div>
      </div>
    `;
  }
}

// ============================================================
//  #1 FRAUD DETECTION — modal data & functions
// ============================================================

const fraudData = {
  'CLM-2026-0041': {
    score: 42, level: 'watch', client: 'Robert Chen', type: 'Death Benefit', amount: '$1,000,000',
    signals: [
      { icon: 'fa-exclamation-circle', color: '#d97706', text: 'High-value claim ($1M) — automatic enhanced review threshold triggered' },
      { icon: 'fa-id-card', color: '#d97706', text: 'Claimant identity documents (Susan Chen) not yet submitted — 1 day post-filing' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Policy in excellent standing since 2018 — 8 years continuous premiums paid' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Cause of death (cardiac event) consistent with policyholder age and medical history' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Death certificate received and verified through official registry' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Beneficiary (Susan Chen) identity matches policy records from 2018' },
    ],
    recommendation: 'WATCH — Proceed with standard expedited review. Missing identity documents from claimant are routine for day-1 filing. No suspicious patterns detected. Monitor document submission timeline.',
    recColor: '#d97706'
  },
  'CLM-2026-0038': {
    score: 12, level: 'clear', client: 'Sandra Williams', type: 'Long-term Care', amount: '$18,000',
    signals: [
      { icon: 'fa-check-circle', color: '#059669', text: 'LTC eligibility certification received and verified by licensed medical professional' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Care provider license confirmed active and in-state' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Policy active since 2016 — 10 years continuous coverage' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Claim amount ($200/day) matches stated daily benefit in policy terms' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Policyholder age (61) consistent with LTC claim demographics' },
    ],
    recommendation: 'CLEAR — No fraud indicators detected. Claim appears legitimate and well-documented. Proceed with standard LTC claims processing workflow.',
    recColor: '#059669'
  },
  'CLM-2026-0035': {
    score: 18, level: 'clear', client: 'Maria Gonzalez', type: 'Disability', amount: '$4,200/mo',
    signals: [
      { icon: 'fa-check-circle', color: '#059669', text: 'Surgical report received and verified — back surgery confirmed 2026-03-10' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Pre-disability earnings documentation matches employer payroll records' },
      { icon: 'fa-exclamation-circle', color: '#d97706', text: 'Attending Physician Statement pending — minor delay (18 days) from Dr. Hernandez' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Claim amount (60% income replacement) matches policy benefit schedule' },
      { icon: 'fa-check-circle', color: '#059669', text: 'No prior disability claims filed in past 5 years' },
    ],
    recommendation: 'CLEAR — Minor document delay only. No fraud indicators. Physician statement delay is within normal range (30-day window). Proceed once APS received.',
    recColor: '#059669'
  },
  'CLM-2026-0033': {
    score: 9, level: 'clear', client: 'James Whitfield', type: 'Long-term Care', amount: '$9,600',
    signals: [
      { icon: 'fa-check-circle', color: '#059669', text: 'All required documents received — complete file with zero gaps' },
      { icon: 'fa-check-circle', color: '#059669', text: 'ADL assessment independently verified — 2 of 6 impairments confirmed (meets threshold)' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Facility admission records match LTC policy coverage terms' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Facility license current and in good standing with state registry' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Claim amount matches facility billing records exactly' },
    ],
    recommendation: 'CLEAR — Lowest risk score in active portfolio. Complete documentation, verified ADL threshold, legitimate facility. Approve without further review.',
    recColor: '#059669'
  },
  'CLM-2026-0031': {
    score: 7, level: 'clear', client: 'Linda Morrison', type: 'Waiver of Premium', amount: '$9,600/yr',
    signals: [
      { icon: 'fa-check-circle', color: '#059669', text: 'All four required documents received on day of filing' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Physician recovery estimate verified — elective surgery confirmed' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Premium amount ($9,600/yr) matches policy billing records exactly' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Linda Morrison is a top-tier client — 11 years in book, zero prior adverse claims' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Disability certification issued by independent physician (not treating doctor)' },
    ],
    recommendation: 'CLEAR — Lowest active risk score. Elite client, complete documentation, no anomalies. Standard approval workflow.',
    recColor: '#059669'
  },
  'CLM-2026-0028': {
    score: 38, level: 'watch', client: 'Maria Gonzalez', type: 'Accelerated Benefit', amount: '$120,000',
    signals: [
      { icon: 'fa-exclamation-circle', color: '#d97706', text: 'Terminal illness certification pending — 35 days since ADB application' },
      { icon: 'fa-exclamation-circle', color: '#d97706', text: 'ADB claim filed 30 days post-diagnosis — slightly below typical 45-day window' },
      { icon: 'fa-check-circle', color: '#059669', text: 'ADB application form received and complete' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Partial medical records corroborate oncology diagnosis' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Claim amount (12% of face value) is within standard ADB access limit (25% max)' },
      { icon: 'fa-check-circle', color: '#059669', text: 'No prior ADB or accelerated benefit claims on any policy' },
    ],
    recommendation: 'WATCH — Compassionate case. Delays are due to oncologist office workflow, not claimant obstruction. Expedite terminal certification request. No fraud indicators — proceed with enhanced monitoring only.',
    recColor: '#d97706'
  },
  'CLM-2026-0025': {
    score: 78, level: 'flagged', client: 'Kevin Park', type: 'Death Benefit', amount: '$250,000',
    signals: [
      { icon: 'fa-times-circle', color: '#dc2626', text: '🚨 Policy was in PENDING status at time of death — coverage determination required before payout' },
      { icon: 'fa-times-circle', color: '#dc2626', text: '🚨 Medical records still pending — underwriting review cannot confirm coverage was in-force' },
      { icon: 'fa-exclamation-circle', color: '#d97706', text: 'Estate documentation pending — beneficiary relationship to policyholder unverified' },
      { icon: 'fa-exclamation-circle', color: '#d97706', text: 'Policy age less than 90 days at time of death — heightened contestability scrutiny' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Death certificate received and verified through official registry' },
      { icon: 'fa-check-circle', color: '#059669', text: 'Contestability 2-year window not applicable — policy too new for standard contestability' },
    ],
    recommendation: '⚠️ FLAGGED — Claim cannot be processed until: (1) medical records confirm coverage was in-force at underwriting, (2) estate documentation verified. Escalate to Senior Adjuster and Legal Review. Do not approve pending investigation.',
    recColor: '#dc2626'
  }
};

function openFraudDetailModal(claimId) {
  const d = fraudData[claimId];
  if (!d) return;
  const overlay = document.getElementById('fraud-modal-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const titleEl = document.getElementById('fraud-modal-title');
  const subEl   = document.getElementById('fraud-modal-subtitle');
  const bodyEl  = document.getElementById('fraud-modal-body');
  const hdrEl   = document.getElementById('fraud-modal-header');

  titleEl.textContent = 'Fraud Risk Analysis — ' + claimId;
  subEl.textContent   = d.client + ' · ' + d.type + ' · Score: ' + d.score + '/100';

  const hdrColors = { clear:'#059669', watch:'#d97706', flagged:'#dc2626' };
  if (hdrEl) hdrEl.style.borderBottomColor = hdrColors[d.level] || '#003087';

  const levelLabels = { clear:'Clear', watch:'Watch', flagged:'Flagged' };
  const levelColors = { clear:'background:#f0fdf4;color:#059669;border:1px solid #bbf7d0', watch:'background:#fffbeb;color:#d97706;border:1px solid #fde68a', flagged:'background:#fef2f2;color:#dc2626;border:1px solid #fecaca' };
  const lc = levelColors[d.level] || '';

  bodyEl.innerHTML = `
    <div class="pm-ai-header" style="margin-bottom:18px">
      <div class="pm-ai-score-ring" style="--score-color:${hdrColors[d.level]}">
        <span class="pm-ai-score-num">${d.score}</span>
        <span class="pm-ai-score-lbl">Risk Score</span>
      </div>
      <div class="pm-ai-summary">
        <div class="pm-ai-risk-badge" style="${lc}">
          <i class="fas fa-shield-virus"></i> ${levelLabels[d.level]} — ${d.client}
        </div>
        <h4>${d.type} · ${d.amount}</h4>
        <p class="pm-ai-policy-ref"><i class="fas fa-file-medical-alt"></i> ${claimId} · AI Fraud Score: ${d.score}/100 · ${d.level.toUpperCase()}</p>
      </div>
    </div>
    <div class="pm-section" style="margin-bottom:16px">
      <div class="pm-section-title"><i class="fas fa-list-ul"></i> Fraud Signal Analysis</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${d.signals.map(s => `
          <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 10px;border-radius:7px;background:white;border:1px solid var(--gray-100)">
            <i class="fas ${s.icon}" style="color:${s.color};margin-top:2px;flex-shrink:0"></i>
            <span style="font-size:12.5px;color:var(--gray-700);line-height:1.45">${s.text}</span>
          </div>`).join('')}
      </div>
    </div>
    <div class="pm-next-action" style="background:${hdrColors[d.level]}10;border-color:${hdrColors[d.level]}30;color:${hdrColors[d.level]}">
      <i class="fas fa-robot" style="font-size:15px;flex-shrink:0;margin-top:1px"></i>
      <span><strong>AI Recommendation:</strong> ${d.recommendation}</span>
    </div>
    <div class="pm-ai-cta" style="margin-top:16px">
      <button class="btn btn-ai" onclick="navigateTo('ai-agents')"><i class="fas fa-robot"></i> Open Full AI Agent</button>
      <button class="btn btn-outline-sm" onclick="closeFraudModal()"><i class="fas fa-times"></i> Close</button>
    </div>
  `;
}

function closeFraudModal() {
  const overlay = document.getElementById('fraud-modal-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function openFraudReportModal() {
  const overlay = document.getElementById('fraud-report-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const allClaims = [
    { id:'CLM-2026-0025', client:'Kevin Park',       type:'Death Benefit',      score:78, level:'flagged', reason:'Policy in Pending at death · Medical records missing · Estate unverified' },
    { id:'CLM-2026-0041', client:'Robert Chen',      type:'Death Benefit',      score:42, level:'watch',   reason:'$1M high-value threshold · Claimant ID pending (day 1)' },
    { id:'CLM-2026-0028', client:'Maria Gonzalez',   type:'Accelerated Benefit',score:38, level:'watch',   reason:'Terminal cert pending · ADB filed 30 days post-diagnosis' },
    { id:'CLM-2026-0035', client:'Maria Gonzalez',   type:'Disability',         score:18, level:'clear',   reason:'APS delay only — no fraud indicators' },
    { id:'CLM-2026-0038', client:'Sandra Williams',  type:'Long-term Care',     score:12, level:'clear',   reason:'All docs verified, provider confirmed' },
    { id:'CLM-2026-0033', client:'James Whitfield',  type:'Long-term Care',     score: 9, level:'clear',   reason:'Complete file, ADL threshold met' },
    { id:'CLM-2026-0031', client:'Linda Morrison',   type:'Waiver of Premium',  score: 7, level:'clear',   reason:'All docs filed same day, top client' },
    { id:'CLM-2026-0022', client:'Linda Morrison',   type:'Death Benefit(Rider)',score:5, level:'clear',   reason:'Resolved · Paid 2026-02-17' },
    { id:'CLM-2026-0019', client:'Robert Chen',      type:'Waiver of Premium',  score: 4, level:'clear',   reason:'Resolved · Approved 2026-01-24' },
    { id:'CLM-2026-0015', client:'James Whitfield',  type:'Accelerated Benefit',score: 8, level:'clear',   reason:'Resolved · Paid 2026-01-15' },
    { id:'CLM-2025-0198', client:'Sandra Williams',  type:'Disability',         score: 6, level:'clear',   reason:'Resolved · Paid 2025-12-08' },
  ];

  const bodyEl = document.getElementById('fraud-report-body');
  bodyEl.innerHTML = `
    <div class="fraud-report-summary">
      <div class="frs-card flagged"><div class="frs-val">1</div><div class="frs-lbl">Flagged Claims</div></div>
      <div class="frs-card watch"><div class="frs-val">2</div><div class="frs-lbl">Under Watch</div></div>
      <div class="frs-card clear"><div class="frs-val">8</div><div class="frs-lbl">Clear</div></div>
      <div class="frs-card blue"><div class="frs-val">+32%</div><div class="frs-lbl">Detection Lift vs Manual</div></div>
    </div>
    <div class="pm-section-title" style="margin-bottom:10px"><i class="fas fa-list-alt"></i> All Claims — Fraud Score Breakdown</div>
    <div class="fraud-claim-rows">
      ${allClaims.map(c => `
        <div class="fcr-row fcr-${c.level}" onclick="closeFraudReportModal();setTimeout(()=>openFraudDetailModal('${c.id}'),200)" style="cursor:pointer">
          <span class="fcr-score ${c.level}">${c.score}</span>
          <span class="fcr-id">${c.id}</span>
          <span class="fcr-client">${c.client}</span>
          <span class="fcr-reasons">${c.type} · ${c.reason}</span>
          <span class="fcr-badge ${c.level}">${c.level.charAt(0).toUpperCase()+c.level.slice(1)}</span>
        </div>`).join('')}
    </div>
    <div class="pm-ai-cta" style="margin-top:18px">
      <button class="btn btn-ai" onclick="navigateTo('ai-agents')"><i class="fas fa-robot"></i> AI Deep Fraud Analysis</button>
      <button class="btn btn-outline-sm" onclick="closeFraudReportModal()"><i class="fas fa-times"></i> Close</button>
    </div>
  `;
}

function closeFraudReportModal() {
  const overlay = document.getElementById('fraud-report-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

// ============================================================
//  #2 IDP — Intelligent Document Processing
// ============================================================

const idpData = {
  // ── Claims ──
  'CLM-2026-0041': {
    label: 'CLM-2026-0041 · Robert Chen · Death Benefit', type:'claim',
    docs: [
      { name:'Death Certificate (RC)', status:'extracting', confidence:null,  extracted:['Name: Robert Chen','DOD: 2026-04-08','Cause: Cardiac Event','Issuer: NYC DoH'] },
      { name:'Medical Certificate — Cardiac', status:'verified',   confidence:98, extracted:['Physician: Dr. Alan Park MD','ICD-10: I21.9 Acute MI','Date of Death: 2026-04-08','Hospital: NYP'] },
      { name:'Claimant Identity (Susan Chen)', status:'pending',    confidence:null, extracted:[] },
      { name:'Bank Details for Payout',        status:'pending',    confidence:null, extracted:[] },
    ]
  },
  'CLM-2026-0038': {
    label: 'CLM-2026-0038 · Sandra Williams · Long-term Care', type:'claim',
    docs: [
      { name:'LTC Eligibility Certification', status:'verified',   confidence:99, extracted:['Trigger: 2 ADL impairments','Certifier: Dr. Kim MD','Date: 2026-04-01','Daily benefit: $200/day'] },
      { name:'Care Provider License',         status:'verified',   confidence:97, extracted:['Provider: NYC Home Health','License #: HH-20918','Valid through: 2027-08-01'] },
      { name:'Plan of Care Document',         status:'pending',    confidence:null, extracted:[] },
      { name:'Monthly Care Summary',          status:'pending',    confidence:null, extracted:[] },
    ]
  },
  'CLM-2026-0035': {
    label: 'CLM-2026-0035 · Maria Gonzalez · Disability', type:'claim',
    docs: [
      { name:'Surgical Report — Back Surgery', status:'verified', confidence:96, extracted:['Procedure: L4-L5 discectomy','Surgeon: Dr. Hernandez','Date: 2026-03-10','Facility: NYU Langone'] },
      { name:'Pre-disability Earnings Docs',   status:'verified', confidence:94, extracted:['Annual income: $84,000','Employer: Apex Corp','DOE: 2021-06-01','Verified payroll: ✓'] },
      { name:'Attending Physician Statement',  status:'pending',  confidence:null, extracted:[] },
      { name:'Employer Income Verification',   status:'pending',  confidence:null, extracted:[] },
    ]
  },
  'CLM-2026-0033': {
    label: 'CLM-2026-0033 · James Whitfield · Long-term Care', type:'claim',
    docs: [
      { name:'LTC Eligibility Certification', status:'verified', confidence:99, extracted:['ADLs impaired: 2/6','Certifier: Dr. Patel','Date: 2026-03-14'] },
      { name:'Facility Admission Records',    status:'verified', confidence:98, extracted:['Facility: Garden State AL','Admission: 2026-03-12','Daily rate: $200'] },
      { name:'ADL Assessment',                status:'verified', confidence:97, extracted:['Bathing: impaired','Dressing: impaired','Other 4: intact'] },
      { name:'Facility License',              status:'verified', confidence:99, extracted:['License #: NJ-AL-4491','Valid through: 2027-01-01','State: NJ'] },
    ]
  },
  'CLM-2026-0031': {
    label: 'CLM-2026-0031 · Linda Morrison · Waiver of Premium', type:'claim',
    docs: [
      { name:'Disability Certification',      status:'verified', confidence:99, extracted:['Disability type: post-surgical','Certifier: Dr. Walsh','Duration: 60-90 days'] },
      { name:'Surgical Report',               status:'verified', confidence:98, extracted:['Procedure: Hip replacement','Date: 2026-03-08','Recovery: 60-90 days'] },
      { name:'Physician Recovery Estimate',   status:'verified', confidence:97, extracted:['Est. return: Jun 2026','Dr. Walsh MD','Full recovery expected'] },
      { name:'Premium Waiver Application',    status:'verified', confidence:99, extracted:['Policy: P-100362','Premium: $9,600/yr','Coverage: 90 days'] },
    ]
  },
  'CLM-2026-0028': {
    label: 'CLM-2026-0028 · Maria Gonzalez · Accelerated Benefit', type:'claim',
    docs: [
      { name:'ADB Application Form',           status:'verified',   confidence:99, extracted:['Amount: $120,000','Policy: P-100340','Signed: 2026-03-05'] },
      { name:'Medical Records (Partial)',       status:'extracting', confidence:null, extracted:['Oncologist: Dr. Rivera','Diagnosis: Stage IV — extracting…'] },
      { name:'Terminal Illness Certification', status:'pending',    confidence:null, extracted:[] },
      { name:'Life Expectancy Statement',      status:'pending',    confidence:null, extracted:[] },
    ]
  },
  'CLM-2026-0025': {
    label: 'CLM-2026-0025 · Kevin Park · Death Benefit', type:'claim',
    docs: [
      { name:'Death Certificate',              status:'verified',   confidence:98, extracted:['Name: Kevin Park','DOD: 2026-02-27','Issuer: NJ DoH'] },
      { name:'Estate Documentation',           status:'pending',    confidence:null, extracted:[] },
      { name:'Medical Records (UW review)',    status:'pending',    confidence:null, extracted:[] },
      { name:'Contestability Review File',     status:'extracting', confidence:null, extracted:['Policy date: 2026-02-01','Extracting UW notes…'] },
    ]
  },
  // ── Policies ──
  'P-100291': {
    label: 'P-100291 · James Whitfield · Whole Life', type:'policy',
    docs: [
      { name:'Original Policy Application',   status:'verified', confidence:99, extracted:['Issued: 2019-06-15','Underwriter: NYL UW Team','Face value: $500K'] },
      { name:'Beneficiary Designation Form',  status:'verified', confidence:98, extracted:['Beneficiary: Emily Whitfield','Relationship: Spouse','Date: 2019-06-15'] },
      { name:'Annual Review — 2025',          status:'verified', confidence:96, extracted:['Review date: 2025-06-12','Cash value: $43,800','No changes'] },
    ]
  },
  'P-100292': {
    label: 'P-100292 · James Whitfield · Term Life', type:'policy',
    docs: [
      { name:'Term Life Application',         status:'verified', confidence:99, extracted:['Term: 20-year','Face value: $750K','Issued: 2021-03-01'] },
      { name:'Convertibility Rider Notice',   status:'verified', confidence:97, extracted:['Window: through 2031','No medical required','Conversion: whole life'] },
      { name:'Annual Statement — 2025',       status:'verified', confidence:95, extracted:['In force','All premiums current','Next renewal: 2031-03-01'] },
    ]
  },
  'P-100293': {
    label: 'P-100293 · James Whitfield · Long-term Care', type:'policy',
    docs: [
      { name:'LTC Policy Application',        status:'verified', confidence:98, extracted:['Daily benefit: $200/day','Benefit period: 3 yrs','Elim. period: 90 days'] },
      { name:'Inflation Protection Rider',    status:'verified', confidence:97, extracted:['Protection: 3% compound','Rider attached: 2022-11-10'] },
      { name:'LTC Coverage Review 2025',      status:'pending',  confidence:null, extracted:[] },
    ]
  },
  'P-100301': {
    label: 'P-100301 · Patricia Nguyen · Universal Life', type:'policy',
    docs: [
      { name:'UL Policy Application',         status:'verified', confidence:98, extracted:['Face value: $400K','Issued: 2020-08-20','Type: Universal Life'] },
      { name:'⚠️ Premium Funding Review',     status:'pending',  confidence:null, extracted:[] },
      { name:'Overloan Protection Rider',     status:'pending',  confidence:null, extracted:[] },
    ]
  },
  'P-100302': {
    label: 'P-100302 · Patricia Nguyen · Variable Universal Life', type:'policy',
    docs: [
      { name:'VUL Application',               status:'verified', confidence:99, extracted:['Face: $300K','Sub-accounts: 30+','Issued: 2023-01-15'] },
      { name:'Investment Allocation Form',    status:'verified', confidence:97, extracted:['60% equity / 40% fixed','DCA rider active','Signed: 2023-01-15'] },
      { name:'2025 Sub-account Statement',    status:'verified', confidence:96, extracted:['Cash value: $14,890','YTD return: +8.3%','No allocation changes'] },
    ]
  },
  'P-100310': {
    label: 'P-100310 · Robert Chen · Whole Life (Claim Active)', type:'policy',
    docs: [
      { name:'Whole Life Application 2018',   status:'verified', confidence:99, extracted:['Face: $1M','Issued: 2018-04-12','Business continuation rider'] },
      { name:'Claim CLM-2026-0041 Filed',     status:'extracting', confidence:null, extracted:['Claim date: 2026-04-09','Extracting adjuster notes…'] },
      { name:'Claimant ID — Susan Chen',      status:'pending',  confidence:null, extracted:[] },
      { name:'Bank Details for Payout',       status:'pending',  confidence:null, extracted:[] },
    ]
  },
  'P-100320': {
    label: 'P-100320 · Sandra Williams · Term Life (Renewal Alert)', type:'policy',
    docs: [
      { name:'Term Life Application 2016',    status:'verified', confidence:97, extracted:['Face: $350K','Term: 20-yr','Issued: 2016-09-30'] },
      { name:'⚠️ Renewal Notice Sept 2026',   status:'pending',  confidence:null, extracted:[] },
    ]
  },
  'P-100330': {
    label: 'P-100330 · Linda Morrison · Whole Life (Flagship)', type:'policy',
    docs: [
      { name:'Flagship WL Application 2015',  status:'verified', confidence:99, extracted:['Face: $2M','Issued: 2015-12-01','Trust beneficiary'] },
      { name:'Trust Beneficiary Designation', status:'verified', confidence:99, extracted:['Trust: Morrison Family Trust','Date: 2015-12-01','Estate attorney: Cooper & Assoc'] },
      { name:'Annual Review 2026 (Apr 15)',   status:'verified', confidence:98, extracted:['Cash value: $168,400','Dividend: $6,200/yr','UMA review pending'] },
    ]
  },
};

function openIDPModal(id) {
  const d = idpData[id];
  if (!d) return;
  const overlay = document.getElementById('idp-modal-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  document.getElementById('idp-modal-title').textContent = 'IDP — Document Status · ' + id;
  document.getElementById('idp-modal-subtitle').textContent = d.label;

  const totalDocs  = d.docs.length;
  const verified   = d.docs.filter(doc => doc.status === 'verified').length;
  const extracting = d.docs.filter(doc => doc.status === 'extracting').length;
  const pending    = d.docs.filter(doc => doc.status === 'pending').length;
  const pct        = Math.round(verified / totalDocs * 100);

  const bodyEl = document.getElementById('idp-modal-body');
  bodyEl.innerHTML = `
    <div class="idp-modal-summary">
      <div class="idp-ms-progress">
        <div class="idp-ms-pct">${pct}%</div>
        <div class="idp-ms-bar-wrap"><div class="idp-ms-bar" style="width:${pct}%;background:${pct===100?'#059669':pct>=50?'#7c3aed':'#d97706'}"></div></div>
        <div class="idp-ms-label">Document Completeness</div>
      </div>
      <div class="idp-ms-stats">
        <div class="idp-ms-stat green"><div class="idp-ms-val">${verified}</div><div class="idp-ms-lbl">Verified</div></div>
        <div class="idp-ms-stat purple"><div class="idp-ms-val">${extracting}</div><div class="idp-ms-lbl">Extracting</div></div>
        <div class="idp-ms-stat orange"><div class="idp-ms-val">${pending}</div><div class="idp-ms-lbl">Pending</div></div>
        <div class="idp-ms-stat blue"><div class="idp-ms-val">${totalDocs}</div><div class="idp-ms-lbl">Total Docs</div></div>
      </div>
    </div>

    <div class="idp-docs-list">
      ${d.docs.map((doc, i) => {
        const stIcon  = doc.status === 'verified' ? 'fa-check-circle' : doc.status === 'extracting' ? 'fa-cog fa-spin' : 'fa-clock';
        const stColor = doc.status === 'verified' ? '#059669' : doc.status === 'extracting' ? '#7c3aed' : '#d97706';
        const stLabel = doc.status === 'verified' ? 'Verified' : doc.status === 'extracting' ? 'AI Extracting…' : 'Pending Upload';
        return `
        <div class="idp-doc-card">
          <div class="idp-doc-card-header">
            <div style="display:flex;align-items:center;gap:10px">
              <div class="idp-doc-num">${i+1}</div>
              <div>
                <div class="idp-doc-name">${doc.name}</div>
                ${doc.confidence ? `<div class="idp-doc-conf">AI Confidence: <strong>${doc.confidence}%</strong></div>` : ''}
              </div>
            </div>
            <div class="idp-doc-status-pill" style="color:${stColor};background:${stColor}15;border:1px solid ${stColor}30">
              <i class="fas ${stIcon}"></i> ${stLabel}
            </div>
          </div>
          ${doc.extracted && doc.extracted.length > 0 ? `
          <div class="idp-extracted-fields">
            <div class="idp-ef-title"><i class="fas fa-magic"></i> Auto-extracted Fields</div>
            <div class="idp-ef-grid">
              ${doc.extracted.map(f => `<div class="idp-ef-item"><i class="fas fa-angle-right" style="color:#7c3aed;margin-right:4px"></i>${f}</div>`).join('')}
            </div>
          </div>` : doc.status === 'pending' ? `<div class="idp-pending-msg"><i class="fas fa-upload"></i> Awaiting document upload to begin extraction</div>` : ''}
        </div>`;
      }).join('')}
    </div>

    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">
      ${pending > 0 ? `<button class="btn btn-primary" onclick="alert('Document request reminders sent for ${pending} missing document(s).')"><i class="fas fa-paper-plane"></i> Send ${pending} Doc Request${pending>1?'s':''}</button>` : ''}
      <button class="btn btn-idp-scan" onclick="alert('IDP re-scan queued for ${id}. Results in ~30 seconds.')"><i class="fas fa-search"></i> Re-scan Documents</button>
      <button class="btn btn-outline-sm" onclick="closeIDPModal()"><i class="fas fa-times"></i> Close</button>
    </div>
  `;
}

function closeIDPModal() {
  const overlay = document.getElementById('idp-modal-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function handleIDPDrop(event) {
  event.preventDefault();
  const zone = document.getElementById('idp-drop-zone');
  if (zone) zone.classList.remove('idp-drag-over');
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    const names = Array.from(files).map(f => f.name).join(', ');
    alert(`IDP received ${files.length} file(s): ${names}\n\nAI extraction started. Confidence results in ~10 seconds.`);
  } else {
    alert('IDP Hub: Drop PDF/image files here to auto-extract claim or policy fields.');
  }
}

function runIDPScan() {
  const btn = document.querySelector('.btn-idp-scan');
  if (btn) { btn.innerHTML = '<i class="fas fa-cog fa-spin"></i> Scanning…'; btn.disabled = true; }
  const timeEl = document.querySelector('.idp-scan-time');
  setTimeout(() => {
    if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> Scan Complete'; btn.disabled = false; }
    if (timeEl) timeEl.textContent = 'just now';
    setTimeout(() => {
      if (btn) btn.innerHTML = '<i class="fas fa-search"></i> Run IDP Scan';
    }, 2000);
  }, 2200);
}

// ============================================================
//  #3 PROACTIVE AI ALERT CARD — toggle & modal
// ============================================================

function togglePACPanel(btn) {
  const body = document.getElementById('pac-alerts-body');
  if (!body) return;
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  const icon = btn.querySelector('i');
  if (icon) icon.className = isOpen ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
  btn.title = isOpen ? 'Expand alerts' : 'Collapse alerts';
}

// ── PAC Modal data ──
const pacAlertData = {
  'obituary-kevin': {
    type: 'death',
    iconClass: 'fa-heart-broken',
    headerColor: '#dc2626',
    title: 'Death Detected — Kevin Park',
    subtitle: 'Obituary match · Policy P-100350 · Action Required',
    sections: [
      {
        icon: 'fa-search', title: 'AI Detection Summary',
        content: `
          <div class="pac-detail-grid">
            <div class="pac-detail-item"><span class="pac-dl">Client</span><span class="pac-dv">Kevin Park · Age 29 · Jersey City, NJ</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Date of Death</span><span class="pac-dv bold red-text">2026-04-10 (confirmed)</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Detection Source</span><span class="pac-dv">Public obituary registry + NJ DoH cross-match</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Match Confidence</span><span class="pac-dv bold">97.4% — High confidence</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Policy</span><span class="pac-dv mono">P-100350 · Term Life · $250,000 face value</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Policy Status</span><span class="pac-dv"><span class="badge-inline pending">Pending (application stage)</span></span></div>
            <div class="pac-detail-item"><span class="pac-dl">Active Claim</span><span class="pac-dv mono">CLM-2026-0025 · Filed 2026-02-28 by estate</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Fraud Score</span><span class="pac-dv"><span class="badge-inline flagged">78 / 100 — Flagged</span></span></div>
          </div>`
      },
      {
        icon: 'fa-exclamation-triangle', title: 'Critical Issues Requiring Action',
        content: `
          <div class="pac-issue-list">
            <div class="pac-issue critical"><i class="fas fa-times-circle"></i><div><strong>Coverage determination needed:</strong> Policy P-100350 was in Pending status at time of death. Claim cannot be processed until underwriting confirms whether coverage was in force.</div></div>
            <div class="pac-issue critical"><i class="fas fa-times-circle"></i><div><strong>Medical records outstanding:</strong> Underwriting review requires medical records to confirm application status. Estate of Kevin Park must provide these.</div></div>
            <div class="pac-issue warning"><i class="fas fa-exclamation-triangle"></i><div><strong>Estate representative unidentified:</strong> No estate contact on file. Beneficiary relationship to policyholder unverified. Need attorney or executor contact.</div></div>
            <div class="pac-issue warning"><i class="fas fa-exclamation-triangle"></i><div><strong>Contestability edge case:</strong> Policy &lt;90 days old at death. Heightened scrutiny required per NYL claims protocol.</div></div>
          </div>`
      },
      {
        icon: 'fa-tasks', title: 'AI Recommended Action Plan',
        content: `
          <div class="pac-action-steps">
            <div class="pac-step"><span class="pac-step-num">1</span><div><strong>Coordinate with underwriting team</strong> — confirm binding status of application as of 2026-02-01. Priority: today.</div></div>
            <div class="pac-step"><span class="pac-step-num">2</span><div><strong>Contact NJ Probate Court</strong> — obtain estate administrator details to establish communication channel for document requests.</div></div>
            <div class="pac-step"><span class="pac-step-num">3</span><div><strong>Send medical records request</strong> to estate representative via certified mail + email. Set 14-day response deadline.</div></div>
            <div class="pac-step"><span class="pac-step-num">4</span><div><strong>Assign Senior Adjuster + Legal Counsel</strong> — escalate CLM-2026-0025 to senior review given Pending policy status at death.</div></div>
            <div class="pac-step"><span class="pac-step-num">5</span><div><strong>Document all communications</strong> with estate — maintain audit trail for legal review and regulatory compliance.</div></div>
          </div>`
      }
    ]
  },

  'lapse-patricia': {
    type: 'lapse',
    iconClass: 'fa-battery-quarter',
    headerColor: '#d97706',
    title: 'Policy Lapse Risk — Patricia Nguyen',
    subtitle: 'Universal Life P-100301 · Under-funded 2 quarters · Action Required',
    sections: [
      {
        icon: 'fa-chart-line', title: 'AI Cash Flow Analysis',
        content: `
          <div class="pac-detail-grid">
            <div class="pac-detail-item"><span class="pac-dl">Client</span><span class="pac-dv">Patricia Nguyen · Age 38 · Brooklyn, NY</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Policy</span><span class="pac-dv mono">P-100301 · Universal Life · $400,000 face value</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Current Cash Value</span><span class="pac-dv bold orange-text">$21,400 (below minimum)</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Minimum Required</span><span class="pac-dv bold">$28,000 to sustain current coverage</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Quarters Under-funded</span><span class="pac-dv bold red-text">2 consecutive quarters</span></div>
            <div class="pac-detail-item"><span class="pac-dl">AI Lapse Prediction</span><span class="pac-dv bold red-text">~2026-06-20 (60–90 days) if no action</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Annual Premium Paid</span><span class="pac-dv">$3,000/yr (currently insufficient for cost of insurance)</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Re-qualification Risk</span><span class="pac-dv bold red-text">High — new medical UW required at age 38 if lapsed</span></div>
          </div>`
      },
      {
        icon: 'fa-exclamation-triangle', title: 'Why This Matters',
        content: `
          <div class="pac-issue-list">
            <div class="pac-issue critical"><i class="fas fa-times-circle"></i><div><strong>Coverage loss risk:</strong> If policy lapses, Patricia loses $400K death benefit coverage. New policy at current age with comparable coverage would cost ~$1,800–$2,400 more per year.</div></div>
            <div class="pac-issue critical"><i class="fas fa-times-circle"></i><div><strong>Medical re-qualification:</strong> Any new Universal Life policy requires full medical underwriting. Patricia's health status may have changed — coverage could be rated or declined.</div></div>
            <div class="pac-issue warning"><i class="fas fa-exclamation-triangle"></i><div><strong>2 dependents identified:</strong> Client profile notes suggest Patricia has young children. Loss of life coverage during active parenting years is a significant family risk.</div></div>
            <div class="pac-issue info"><i class="fas fa-info-circle"></i><div><strong>Retention opportunity:</strong> A premium catch-up of $1,800–$2,400 over 3 months is sufficient to restore policy health. Low effort, high impact retention action.</div></div>
          </div>`
      },
      {
        icon: 'fa-tasks', title: 'AI Recommended Action Plan',
        content: `
          <div class="pac-action-steps">
            <div class="pac-step urgent"><span class="pac-step-num urgent">!</span><div><strong>⚡ Call Patricia Nguyen this week</strong> — explain lapse risk in plain terms. Frame as protecting her family's coverage, not a sales call.</div></div>
            <div class="pac-step"><span class="pac-step-num">1</span><div><strong>Prepare premium catch-up illustration</strong> — show $600/month for 3 months restores policy to healthy status. Total: $1,800 one-time catch-up.</div></div>
            <div class="pac-step"><span class="pac-step-num">2</span><div><strong>Discuss fixed premium restructuring</strong> — offer to convert to fixed-premium schedule to prevent future under-funding risk.</div></div>
            <div class="pac-step"><span class="pac-step-num">3</span><div><strong>Consider policy loan repayment</strong> — if policy has any outstanding loans, these may be contributing to under-funding. Review with client.</div></div>
            <div class="pac-step"><span class="pac-step-num">4</span><div><strong>Schedule follow-up in 2 weeks</strong> — confirm premium catch-up has been received and policy health is restored.</div></div>
          </div>`
      }
    ]
  },

  'renewal-sandra': {
    type: 'renewal',
    iconClass: 'fa-hourglass-end',
    headerColor: '#f59e0b',
    title: 'Conversion Window Closing — Sandra Williams',
    subtitle: 'Term Life P-100320 · Expires Sept 2026 · 150 days remaining',
    sections: [
      {
        icon: 'fa-calendar-alt', title: 'Renewal & Conversion Timeline',
        content: `
          <div class="pac-detail-grid">
            <div class="pac-detail-item"><span class="pac-dl">Client</span><span class="pac-dv">Sandra Williams · Age 61 · Queens, NY</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Policy</span><span class="pac-dv mono">P-100320 · 20-Year Term Life · $350,000</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Expiry Date</span><span class="pac-dv bold orange-text">2026-09-30 (150 days from today)</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Beneficiary</span><span class="pac-dv">Michael Williams (Spouse)</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Conversion Option</span><span class="pac-dv bold">Available without medical evidence until 2026-09-30</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Post-expiry Cost Impact</span><span class="pac-dv bold red-text">+$4,200–$6,800/yr more for equivalent coverage at age 62</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Current Status</span><span class="pac-dv"><span class="badge-inline review">Under Review</span></span></div>
            <div class="pac-detail-item"><span class="pac-dl">Annuity Opportunity</span><span class="pac-dv">Retirement income supplement (age 61) — annuity upsell potential</span></div>
          </div>`
      },
      {
        icon: 'fa-lightbulb', title: 'AI Opportunity Analysis',
        content: `
          <div class="pac-issue-list">
            <div class="pac-issue info"><i class="fas fa-star" style="color:#d97706"></i><div><strong>Conversion to Whole Life:</strong> Lock in Sandra's current insurability at age 61. Whole Life $350K would cost ~$8,400/yr but builds cash value and provides lifetime coverage.</div></div>
            <div class="pac-issue info"><i class="fas fa-star" style="color:#d97706"></i><div><strong>Conversion to Universal Life:</strong> More flexible premiums, lower initial cost ~$5,200/yr, adjustable death benefit as needs change in retirement.</div></div>
            <div class="pac-issue info"><i class="fas fa-star" style="color:#059669"></i><div><strong>Retirement annuity pairing:</strong> Sandra at age 61 is an ideal annuity candidate. Guaranteed income starting at 65 pairs well with life conversion for comprehensive retirement planning.</div></div>
            <div class="pac-issue warning"><i class="fas fa-exclamation-triangle"></i><div><strong>No action = coverage gap:</strong> If Sandra does not convert and policy expires, Michael Williams loses $350K protection. New coverage at age 62 will require full medical underwriting.</div></div>
          </div>`
      },
      {
        icon: 'fa-tasks', title: 'AI Recommended Action Plan',
        content: `
          <div class="pac-action-steps">
            <div class="pac-step urgent"><span class="pac-step-num urgent">!</span><div><strong>⚡ Contact Sandra Williams within 7 days</strong> — frame the call as a courtesy renewal review. Do not lead with sales language.</div></div>
            <div class="pac-step"><span class="pac-step-num">1</span><div><strong>Prepare WL vs UL conversion comparison</strong> — show side-by-side premiums, cash value projections, and coverage continuation options.</div></div>
            <div class="pac-step"><span class="pac-step-num">2</span><div><strong>Prepare annuity income illustration</strong> — show guaranteed income starting age 65, paired with life coverage. Use current portfolio holdings as context.</div></div>
            <div class="pac-step"><span class="pac-step-num">3</span><div><strong>Schedule in-person meeting</strong> — renewal + retirement planning review. Invite Michael Williams if possible for joint meeting.</div></div>
            <div class="pac-step"><span class="pac-step-num">4</span><div><strong>Submit conversion application no later than 2026-08-31</strong> — one month buffer before expiry to allow processing time.</div></div>
          </div>`
      }
    ]
  },

  'coverage-susan': {
    type: 'coverage',
    iconClass: 'fa-user-plus',
    headerColor: '#003087',
    title: 'New Coverage Opportunity — Susan Chen',
    subtitle: 'Robert Chen estate · $1M claim pending · Post-resolution outreach',
    sections: [
      {
        icon: 'fa-user-circle', title: 'Prospect Profile',
        content: `
          <div class="pac-detail-grid">
            <div class="pac-detail-item"><span class="pac-dl">Prospect</span><span class="pac-dv">Susan Chen · Beneficiary of Robert Chen</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Est. Age</span><span class="pac-dv">~42 years old</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Relationship</span><span class="pac-dv">Spouse of Robert Chen (deceased 2026-04-08)</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Pending Payout</span><span class="pac-dv bold">$1,000,000 (CLM-2026-0041)</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Existing NYL Coverage</span><span class="pac-dv bold red-text">None identified in system</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Expected Payout Date</span><span class="pac-dv">Est. 2026-04-17 to 2026-04-19</span></div>
            <div class="pac-detail-item"><span class="pac-dl">Outreach Timing</span><span class="pac-dv bold">2–4 weeks post-resolution (allow grieving period)</span></div>
            <div class="pac-detail-item"><span class="pac-dl">AI Prospect Score</span><span class="pac-dv bold" style="color:#059669">82/100 — High potential</span></div>
          </div>`
      },
      {
        icon: 'fa-lightbulb', title: 'AI-Identified Product Opportunities',
        content: `
          <div class="pac-issue-list">
            <div class="pac-issue info"><i class="fas fa-star" style="color:#d97706"></i><div><strong>Life Insurance:</strong> Susan, est. age 42, likely has dependents. New Whole Life or Term policy to protect her family. Premium potential ~$4,800–$8,400/yr.</div></div>
            <div class="pac-issue info"><i class="fas fa-star" style="color:#d97706"></i><div><strong>Investment Management:</strong> $1M lump sum creates an immediate need for wealth management. Fixed annuity, UMA, or diversified portfolio conversation. AUM fee opportunity: ~$8,000–$10,000/yr.</div></div>
            <div class="pac-issue info"><i class="fas fa-star" style="color:#059669"></i><div><strong>Estate Planning:</strong> Robert Chen's estate requires trust review, will update, and beneficiary re-designation on all assets. Introduce estate planning attorney partner.</div></div>
            <div class="pac-issue info"><i class="fas fa-star" style="color:#7c3aed"></i><div><strong>Retirement Income:</strong> If Susan continues working, annuity for retirement income starting age 60–65. Guaranteed income supplement to Social Security.</div></div>
          </div>`
      },
      {
        icon: 'fa-tasks', title: 'AI Recommended Outreach Plan',
        content: `
          <div class="pac-action-steps">
            <div class="pac-step"><span class="pac-step-num">1</span><div><strong>Allow 2 weeks post-payout before outreach</strong> — show empathy first. Send a handwritten condolence note within 48 hours of payout confirmation.</div></div>
            <div class="pac-step"><span class="pac-step-num">2</span><div><strong>Schedule a "Financial Transition Review"</strong> — frame as helping Susan navigate financial decisions after a major life event, not a sales call.</div></div>
            <div class="pac-step"><span class="pac-step-num">3</span><div><strong>Prepare $1M payout deployment illustration</strong> — show options: safe annuity, diversified investment, life insurance, emergency fund, and estate planning allocation.</div></div>
            <div class="pac-step"><span class="pac-step-num">4</span><div><strong>Involve estate planning attorney partner</strong> — offer a complimentary 30-minute estate review. This positions NYL as a trusted advisor, not just an insurer.</div></div>
            <div class="pac-step"><span class="pac-step-num">5</span><div><strong>Calendar reminder: April 30, 2026</strong> — first outreach call to Susan Chen after appropriate grieving window.</div></div>
          </div>`
      }
    ]
  }
};

function openPACModal(alertId) {
  const d = pacAlertData[alertId];
  if (!d) return;
  const overlay = document.getElementById('pac-modal-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const typeColors = { death: '#dc2626', lapse: '#d97706', renewal: '#f59e0b', coverage: '#003087' };
  const typeGrads  = {
    death:    'linear-gradient(135deg,#dc2626,#b91c1c)',
    lapse:    'linear-gradient(135deg,#d97706,#b45309)',
    renewal:  'linear-gradient(135deg,#f59e0b,#d97706)',
    coverage: 'linear-gradient(135deg,#003087,#1e40af)'
  };
  const tc = typeColors[d.type] || '#003087';

  const headerEl = document.getElementById('pac-modal-header');
  const iconEl   = document.getElementById('pac-modal-icon');
  const titleEl  = document.getElementById('pac-modal-title');
  const subEl    = document.getElementById('pac-modal-subtitle');
  const bodyEl   = document.getElementById('pac-modal-body');

  if (headerEl) headerEl.style.borderBottomColor = tc;
  if (iconEl)   iconEl.style.background = typeGrads[d.type] || typeGrads.coverage;
  if (iconEl)   iconEl.innerHTML = `<i class="fas ${d.iconClass}"></i>`;
  titleEl.textContent = d.title;
  subEl.textContent   = d.subtitle;

  bodyEl.innerHTML = d.sections.map(s => `
    <div class="pac-modal-section">
      <div class="pac-modal-section-title" style="color:${tc}">
        <i class="fas ${s.icon}"></i> ${s.title}
      </div>
      <div class="pac-modal-section-body">${s.content}</div>
    </div>
  `).join('') + `
    <div class="pac-modal-footer">
      <button class="btn btn-ai" onclick="navigateTo('ai-agents')"><i class="fas fa-robot"></i> Open Full AI Agent</button>
      <button class="btn btn-outline-sm" onclick="closePACModal()"><i class="fas fa-times"></i> Close</button>
    </div>
  `;
}

function closePACModal() {
  const overlay = document.getElementById('pac-modal-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

/* =============================================
   UNDERWRITING PIPELINE — Data & Modal Logic
   ============================================= */

// ── UW Case Data ──
const uwData = {
  'UW-2026-0018': {
    id: 'UW-2026-0018', client: 'Alex Rivera', age: 34, stage: 'Application Received',
    product: 'Whole Life', faceValue: '$500,000', annualPremium: '$4,800/yr',
    receivedDate: '2026-04-10', decisionDue: '2026-04-17', stpScore: 88,
    riskClass: 'Preferred Plus', smoker: false, bmi: '22.4',
    agent: 'James Richardson', underwriter: 'Auto-Assign pending',
    evidence: [
      { name: 'Rx History', status: 'done',    result: 'No significant Rx in past 5 years. Clean.' },
      { name: 'MIB Check',  status: 'done',    result: 'No adverse records found.' },
      { name: 'MVR',        status: 'done',    result: '1 minor speeding ticket (2023). Acceptable.' },
      { name: 'Credit',     status: 'pending', result: 'Ordered — ETA 24 hrs.' },
      { name: 'Lab',        status: 'na',      result: 'Not required — STP score ≥ 75.' }
    ],
    ai: {
      headline: 'Auto-Approve Eligible — STP Score 88',
      riskLevel: 'Low',
      summary: 'Alex Rivera presents a low-risk profile. STP engine has cleared Rx, MIB, and MVR checks. Credit report pending but STP threshold (75) already met. No APS required.',
      factors: [
        { icon: 'fa-check-circle', color: '#059669', text: 'Age 34 — preferred age band, excellent mortality profile.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'No Rx history findings. No chronic conditions.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'MIB clear — no prior declined applications or misrepresentation flags.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'BMI 22.4 — optimal range, no extra mortality loading.' },
        { icon: 'fa-exclamation-triangle', color: '#f59e0b', text: 'Credit check pending — required before final binding, but unlikely to impact decision.' }
      ],
      recommendation: '✅ APPROVE — Issue Preferred Plus once credit report received (ETA 24 hrs). Auto-binding eligible.',
      nextSteps: ['Wait for credit report (ETA Apr 11)', 'Auto-bind at Preferred Plus once credit clears', 'Send policy docs for e-signature']
    }
  },
  'UW-2026-0017': {
    id: 'UW-2026-0017', client: 'Nancy Foster', age: 41, stage: 'Application Received',
    product: 'Term Life', faceValue: '$1,000,000', annualPremium: '$3,200/yr',
    receivedDate: '2026-04-09', decisionDue: '2026-04-16', stpScore: 82,
    riskClass: 'Preferred', smoker: false, bmi: '24.1',
    agent: 'James Richardson', underwriter: 'Sarah Kim (pending)',
    evidence: [
      { name: 'Rx History', status: 'done',    result: 'Lisinopril 10mg (HTN) — controlled, standard rate eligible.' },
      { name: 'MIB Check',  status: 'done',    result: 'No adverse records.' },
      { name: 'MVR',        status: 'pending', result: 'Ordered — ETA today.' },
      { name: 'Credit',     status: 'pending', result: 'Ordered — ETA 24 hrs.' },
      { name: 'Lab',        status: 'na',      result: 'Not required at this coverage level.' }
    ],
    ai: {
      headline: 'Preferred Rate Eligible — Minor Rx Flag',
      riskLevel: 'Low-Moderate',
      summary: 'Nancy Foster qualifies for Preferred rates. Controlled hypertension with Lisinopril 10mg is within standard underwriting guidelines for her age. MVR and credit pending.',
      factors: [
        { icon: 'fa-check-circle', color: '#059669', text: 'Hypertension well-controlled on single medication — standard rate eligible per NYL guidelines.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'MIB clear — no adverse history or prior declined applications.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'BMI 24.1 — within preferred range.' },
        { icon: 'fa-exclamation-triangle', color: '#f59e0b', text: 'MVR pending — single moving violation could adjust to Standard rate.' },
        { icon: 'fa-exclamation-triangle', color: '#f59e0b', text: 'Coverage amount $1M requires MVR + credit to finalize risk class.' }
      ],
      recommendation: '✅ APPROVE at Preferred — confirm upon MVR and credit clearance. Likely same-day binding.',
      nextSteps: ['Await MVR report (today)', 'Confirm credit report (24 hrs)', 'Issue Preferred policy once evidence complete']
    }
  },
  'UW-2026-0016': {
    id: 'UW-2026-0016', client: 'John Kim', age: 38, stage: 'Application Received',
    product: 'Disability Insurance', faceValue: 'N/A', annualPremium: '$2,100/yr',
    receivedDate: '2026-04-08', decisionDue: '2026-04-18', stpScore: 61,
    riskClass: 'Standard (pending)', smoker: false, bmi: '26.8',
    agent: 'James Richardson', underwriter: 'Pending assignment',
    evidence: [
      { name: 'Rx History', status: 'done',    result: 'Metformin 500mg (Type 2 DM) — flagged for review.' },
      { name: 'MIB Check',  status: 'flag',    result: '⚠ Prior DI claim 2021 (back injury). Requires review.' },
      { name: 'MVR',        status: 'pending', result: 'Ordered — ETA 48 hrs.' },
      { name: 'Credit',     status: 'pending', result: 'Ordered — ETA 24 hrs.' },
      { name: 'APS',        status: 'pending', result: 'APS from primary care required for DM and prior DI claim.' }
    ],
    ai: {
      headline: 'APS Required — MIB Flag + DM Rx History',
      riskLevel: 'Moderate-High',
      summary: 'John Kim has two underwriting flags: Type 2 DM on Metformin and a prior DI claim (2021 back injury) on MIB. APS needed from primary care provider before decision. STP score below auto-approve threshold.',
      factors: [
        { icon: 'fa-times-circle', color: '#dc2626', text: 'Type 2 DM on Metformin — DI policies require APS to assess control level (A1c needed).' },
        { icon: 'fa-times-circle', color: '#dc2626', text: 'MIB flag: prior DI claim 2021 (back injury). Determine if resolved or chronic.' },
        { icon: 'fa-exclamation-triangle', color: '#f59e0b', text: 'BMI 26.8 — borderline overweight, may affect DI risk class.' },
        { icon: 'fa-info-circle', color: '#3b82f6', text: 'Age 38 — DI coverage is appropriate and likely approvable if conditions well-controlled.' }
      ],
      recommendation: '⚠️ APS REQUIRED — Order APS from Dr. (primary care). Decision pending. Likely Standard or rated.',
      nextSteps: ['Order APS from primary care physician', 'Review A1c and DM control history', 'Assess 2021 DI claim resolution status before decision']
    }
  },
  'UW-2026-0015': {
    id: 'UW-2026-0015', client: 'Michael Santos', age: 47, stage: 'Evidence Gathering',
    product: 'Universal Life', faceValue: '$750,000', annualPremium: '$6,400/yr',
    receivedDate: '2026-04-05', decisionDue: '2026-04-14', stpScore: 79,
    riskClass: 'Preferred', smoker: false, bmi: '23.7',
    agent: 'James Richardson', underwriter: 'David Park',
    evidence: [
      { name: 'Rx History', status: 'done',    result: 'Atorvastatin 20mg (cholesterol) — controlled.' },
      { name: 'MIB Check',  status: 'done',    result: 'No adverse records.' },
      { name: 'MVR',        status: 'done',    result: 'Clean driving record.' },
      { name: 'Lab',        status: 'pending', result: 'Lab kit sent Apr 7 — results expected Apr 13.' },
      { name: 'Credit',     status: 'done',    result: 'Credit score 780 — excellent.' }
    ],
    ai: {
      headline: 'Near Auto-Approve — Lab Results Pending',
      riskLevel: 'Low',
      summary: 'Michael Santos is a strong Preferred candidate. All evidence cleared except lab (expected Apr 13). Cholesterol controlled on Atorvastatin. Once lab results confirm lipid panel within range, auto-approval is highly likely.',
      factors: [
        { icon: 'fa-check-circle', color: '#059669', text: 'Cholesterol controlled on Atorvastatin — NYL standard for Preferred classification.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'MIB and MVR both clear — no adverse history.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Credit score 780 — excellent financial profile.' },
        { icon: 'fa-exclamation-triangle', color: '#f59e0b', text: 'Lab panel pending — if LDL > 160 may shift to Standard. Likely within range given Rx compliance.' }
      ],
      recommendation: '✅ APPROVE (Preferred) — pending lab confirmation. Issue once lipid panel received (Est. Apr 13).',
      nextSteps: ['Await lab results (Est. Apr 13)', 'If LDL < 160 → auto-approve Preferred', 'If LDL 160–190 → Standard rate. Discuss with client.']
    }
  },
  'UW-2026-0014': {
    id: 'UW-2026-0014', client: 'Julia Chen', age: 58, stage: 'Evidence Gathering',
    product: 'Annuity Deferred', faceValue: 'N/A', annualPremium: '$8,000/yr',
    receivedDate: '2026-04-03', decisionDue: '2026-04-20', stpScore: 44,
    riskClass: 'Pending review', smoker: false, bmi: '28.3',
    agent: 'James Richardson', underwriter: 'Mary Johnson',
    evidence: [
      { name: 'Rx History', status: 'done',    result: 'Metoprolol (HTN), Pantoprazole (GERD) — under review.' },
      { name: 'MIB Check',  status: 'flag',    result: '⚠ Cardiac event 2019 — needs full review.' },
      { name: 'Lab',        status: 'flag',    result: '⚠ Labs from 2025: elevated BNP 320 pg/mL. APS needed.' },
      { name: 'APS',        status: 'pending', result: 'APS from cardiologist ordered Apr 5 — ETA 2 weeks.' },
      { name: 'Credit',     status: 'done',    result: 'Credit score 695 — acceptable.' }
    ],
    ai: {
      headline: 'APS Required — Cardiac Event on MIB',
      riskLevel: 'High',
      summary: 'Julia Chen has a 2019 cardiac event flagged on MIB and elevated BNP on recent labs. Annuity products have lower mortality requirements, but this case requires cardiology APS to determine current heart function before any binding.',
      factors: [
        { icon: 'fa-times-circle', color: '#dc2626', text: '⚠ Cardiac event 2019 on MIB — type and severity unknown. Cardiologist APS required.' },
        { icon: 'fa-times-circle', color: '#dc2626', text: 'Elevated BNP 320 pg/mL (normal < 100) — possible heart failure component. Must clarify.' },
        { icon: 'fa-exclamation-triangle', color: '#f59e0b', text: 'Two HTN/GERD medications — individually acceptable, combined with cardiac flag requires full review.' },
        { icon: 'fa-info-circle', color: '#3b82f6', text: 'Annuity product has no death benefit — may still qualify if cardiac condition stable.' }
      ],
      recommendation: '⚠️ HOLD — APS from cardiologist required. Do not bind. Decision pending cardiac evaluation.',
      nextSteps: ['Await cardiologist APS (ETA Apr 20)', 'Review BNP trends and cardiac function', 'If stable post-event → likely Standard or rated. If active cardiac issue → possible decline or exclusion.']
    }
  },
  'UW-2026-0013': {
    id: 'UW-2026-0013', client: 'Rachel Adams', age: 29, stage: 'Evidence Gathering',
    product: 'Whole Life', faceValue: '$300,000', annualPremium: '$3,600/yr',
    receivedDate: '2026-04-01', decisionDue: '2026-04-09', stpScore: 85,
    riskClass: 'Preferred Plus', smoker: false, bmi: '21.2',
    agent: 'James Richardson', underwriter: 'Auto-binding eligible',
    evidence: [
      { name: 'Rx History', status: 'done', result: 'No Rx history. Completely clean.' },
      { name: 'MIB Check',  status: 'done', result: 'No records found.' },
      { name: 'MVR',        status: 'done', result: 'Clean driving record.' },
      { name: 'Credit',     status: 'done', result: 'Credit score 802 — excellent.' },
      { name: 'Lab',        status: 'na',   result: 'Not required — age < 40, STP ≥ 75.' }
    ],
    ai: {
      headline: 'Auto-Approve Eligible — All Evidence Clear',
      riskLevel: 'Very Low',
      summary: 'Rachel Adams is an ideal candidate for Preferred Plus. Age 29 with no Rx, clean MIB, MVR, and credit. All STP checks passed. This is a textbook auto-approve case.',
      factors: [
        { icon: 'fa-check-circle', color: '#059669', text: 'Age 29 — lowest mortality risk band. No age loading.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'No Rx history whatsoever — excellent health profile.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'BMI 21.2 — optimal range, no extra loading.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Credit 802 and clean MVR — all secondary risk factors clear.' }
      ],
      recommendation: '✅ AUTO-APPROVE — Issue Preferred Plus immediately. No APS, no lab required.',
      nextSteps: ['Auto-bind at Preferred Plus (no further review needed)', 'Send e-signature request', 'Schedule policy delivery call with client']
    }
  },
  'UW-2026-0012': {
    id: 'UW-2026-0012', client: 'Thomas Wright', age: 52, stage: 'AI Review',
    product: 'Whole Life', faceValue: '$1,000,000', annualPremium: '$9,600/yr',
    receivedDate: '2026-03-28', decisionDue: '2026-04-13', stpScore: 91,
    riskClass: 'Preferred', smoker: false, bmi: '24.9',
    agent: 'James Richardson', underwriter: 'AI Engine (Sarah Kim review)',
    evidence: [
      { name: 'Rx History', status: 'done', result: 'Atorvastatin 40mg — controlled cholesterol. Acceptable.' },
      { name: 'MIB Check',  status: 'done', result: 'No adverse records.' },
      { name: 'MVR',        status: 'done', result: 'Clean record.' },
      { name: 'Lab',        status: 'done', result: 'Lab results received Apr 10: TC 185, LDL 98, HDL 62. Excellent.' },
      { name: 'Medical Exam', status: 'done', result: 'Exam Apr 8: BP 122/78, EKG normal. All clear.' }
    ],
    ai: {
      headline: 'STP Auto-Approve — Preferred | $1M Whole Life',
      riskLevel: 'Low',
      summary: 'Thomas Wright is a Preferred-class case at STP 91. All evidence received. Lab panel excellent (LDL 98, HDL 62). Medical exam normal. AI engine recommends auto-approval at Preferred rate. Human review by Sarah Kim in progress as standard protocol for $1M+ face value.',
      factors: [
        { icon: 'fa-check-circle', color: '#059669', text: 'Lab panel excellent — LDL 98, HDL 62, TC 185. Well within Preferred ranges.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Medical exam: BP 122/78, normal EKG. No concerns.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Cholesterol controlled on Atorvastatin — acceptable for Preferred classification.' },
        { icon: 'fa-info-circle', color: '#3b82f6', text: 'Human review required per protocol for face values ≥ $1M — standard procedure only.' }
      ],
      recommendation: '✅ APPROVE at Preferred — AI scoring complete. Awaiting final human sign-off (Sarah Kim) due to $1M+ face value protocol.',
      nextSteps: ['Sarah Kim human review today', 'Issue Preferred policy upon approval', 'Agent to coordinate policy delivery with Thomas Wright']
    }
  },
  'UW-2026-0011': {
    id: 'UW-2026-0011', client: 'Grace Lee', age: 44, stage: 'AI Review',
    product: 'Variable Universal Life', faceValue: '$250,000', annualPremium: '$3,800/yr',
    receivedDate: '2026-03-25', decisionDue: '2026-04-12', stpScore: 67,
    riskClass: 'Standard (likely)', smoker: false, bmi: '27.1',
    agent: 'James Richardson', underwriter: 'Manual — David Park',
    evidence: [
      { name: 'Rx History', status: 'done', result: 'Sertraline 50mg (anxiety/depression) — requires review.' },
      { name: 'MIB Check',  status: 'done', result: 'No adverse records.' },
      { name: 'Lab',        status: 'flag', result: '⚠ ALT 68 U/L (normal < 56). Mild liver enzyme elevation.' },
      { name: 'APS',        status: 'pending', result: 'APS from primary care ordered Mar 28 — due Apr 12.' },
      { name: 'MVR',        status: 'done', result: 'Clean.' }
    ],
    ai: {
      headline: 'Manual Review — Mild Lab Flag + SSRI',
      riskLevel: 'Moderate',
      summary: 'Grace Lee has two borderline flags: Sertraline 50mg (SSRI for anxiety) and mildly elevated ALT 68 U/L. Neither individually disqualifies coverage, but combined with BMI 27.1, manual review by an underwriter is warranted. Standard rate likely.',
      factors: [
        { icon: 'fa-exclamation-triangle', color: '#f59e0b', text: 'Sertraline 50mg — depression/anxiety. Must review APS for severity, hospitalizations, or medication changes.' },
        { icon: 'fa-exclamation-triangle', color: '#f59e0b', text: 'ALT 68 U/L (elevated) — alcohol use, fatty liver, or medication effect? APS needed to clarify.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'MIB clear — no adverse insurance history.' },
        { icon: 'fa-info-circle', color: '#3b82f6', text: 'Standard rate likely if APS confirms controlled conditions. Possible table rating if escalated.' }
      ],
      recommendation: '⚠️ MANUAL REVIEW — Await APS (Apr 12). Likely Standard rate. Table rating possible if findings escalated.',
      nextSteps: ['Receive APS from primary care (Apr 12)', 'David Park to review SSRI history and ALT cause', 'Prepare Standard or Table 2 offer for agent']
    }
  },
  'UW-2026-0010': {
    id: 'UW-2026-0010', client: 'David Thompson', age: 33, stage: 'Decision',
    product: 'Term Life', faceValue: '$300,000', annualPremium: '$2,400/yr',
    receivedDate: '2026-03-20', decisionDue: '2026-04-13', stpScore: 78,
    riskClass: 'Preferred Plus', smoker: false, bmi: '22.8',
    agent: 'James Richardson', underwriter: 'Sarah Kim — DECISION TODAY',
    evidence: [
      { name: 'Rx History', status: 'done', result: 'No Rx history.' },
      { name: 'MIB Check',  status: 'done', result: 'No adverse records.' },
      { name: 'MVR',        status: 'done', result: 'Clean.' },
      { name: 'Credit',     status: 'done', result: 'Credit score 755 — good.' },
      { name: 'Lab',        status: 'na',   result: 'Not required.' }
    ],
    ai: {
      headline: '⚡ DECISION DUE TODAY — Approve at Preferred Plus',
      riskLevel: 'Very Low',
      summary: 'David Thompson is fully cleared. All evidence received. No flags. STP score 78. Age 33 in excellent health. AI recommends immediate Preferred Plus approval. Decision is due today — no further review needed.',
      factors: [
        { icon: 'fa-check-circle', color: '#059669', text: 'All evidence received and cleared — Rx, MIB, MVR, credit all clean.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Age 33, no medications — ideal risk profile.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'BMI 22.8 — excellent range.' },
        { icon: 'fa-exclamation-triangle', color: '#dc2626', text: '⚡ URGENT — Decision due today. Delay may result in policy lapse / client frustration.' }
      ],
      recommendation: '✅ APPROVE NOW — Preferred Plus, Term Life $300K. Decision due today. No blockers.',
      nextSteps: ['⚡ Sarah Kim: approve immediately', 'Issue Preferred Plus policy today', 'Agent to contact David Thompson for e-signature (same day)']
    }
  },
  'UW-2026-0009': {
    id: 'UW-2026-0009', client: 'Linda Morrison', age: 56, stage: 'Approved',
    product: 'Whole Life Rider Add-on', faceValue: 'N/A', annualPremium: '$1,200/yr',
    receivedDate: '2026-03-18', decisionDue: '2026-03-28', stpScore: 99,
    riskClass: 'Preferred Plus (existing)', smoker: false, bmi: '23.0',
    agent: 'James Richardson', underwriter: 'Auto-approved via STP',
    evidence: [
      { name: 'Rx History', status: 'done', result: 'No new Rx since policy issue.' },
      { name: 'MIB Check',  status: 'done', result: 'No new adverse records.' },
      { name: 'Existing Policy Review', status: 'done', result: 'Policy P-100362 in good standing 6+ years.' },
      { name: 'Signature',  status: 'pending', result: 'E-signature sent Mar 28 — awaiting client return.' }
    ],
    ai: {
      headline: 'Auto-Approved — STP 99 | Awaiting E-Signature',
      riskLevel: 'Very Low',
      summary: 'Linda Morrison is an existing Preferred Plus client. Rider add-on requires no new underwriting — auto-approved by STP engine at score 99. Only pending item is e-signature return from client.',
      factors: [
        { icon: 'fa-check-circle', color: '#059669', text: 'Existing Preferred Plus client in good standing — no new underwriting required.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'STP score 99 — highest confidence auto-approval.' },
        { icon: 'fa-info-circle', color: '#3b82f6', text: 'E-signature sent Mar 28. Follow up with Linda if not returned within 5 business days.' }
      ],
      recommendation: '✅ APPROVED — Follow up on e-signature. Issue rider once signed.',
      nextSteps: ['Follow up with Linda Morrison on e-signature (sent Mar 28)', 'Issue rider immediately upon signature', 'Update policy file P-100362 with rider addition']
    }
  },
  'UW-2026-0008': {
    id: 'UW-2026-0008', client: 'Maria Gonzalez', age: 48, stage: 'Approved',
    product: 'DI Policy Increase', faceValue: 'N/A', annualPremium: '$800/yr',
    receivedDate: '2026-03-15', decisionDue: '2026-03-25', stpScore: 86,
    riskClass: 'Standard (DI)',  smoker: false, bmi: '25.6',
    agent: 'James Richardson', underwriter: 'Auto-approved via STP',
    evidence: [
      { name: 'Rx History', status: 'done', result: 'Metformin 500mg (DM2) — stable, same as original policy.' },
      { name: 'Occupation Review', status: 'done', result: 'Paralegal — Class 4A occupation. Acceptable.' },
      { name: 'Income Verification', status: 'done', result: 'Income confirmed at $82K. Benefit increase justified.' },
      { name: 'Signature',  status: 'pending', result: 'E-signature sent Mar 25 — awaiting client.' }
    ],
    ai: {
      headline: 'Approved — DI Increase | Awaiting E-Signature',
      riskLevel: 'Low',
      summary: 'Maria Gonzalez\'s DI benefit increase approved. Consistent health profile (DM2 stable), income verified, occupation class confirmed. STP 86. Awaiting e-signature.',
      factors: [
        { icon: 'fa-check-circle', color: '#059669', text: 'DM2 controlled on Metformin — same profile as original DI policy. No change in risk class.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Income at $82K fully supports proposed benefit increase.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Occupation Class 4A (paralegal) — standard DI eligibility.' }
      ],
      recommendation: '✅ APPROVED — Issue DI increase upon e-signature. Follow up with Maria Gonzalez.',
      nextSteps: ['Follow up on e-signature (sent Mar 25)', 'Issue DI policy increase upon signature', 'Note in client file: benefit now $X,XXX/mo']
    }
  },
  'UW-2026-0007': {
    id: 'UW-2026-0007', client: 'Robert Chen', age: 45, stage: 'Issued',
    product: 'VUL Add-on Rider', faceValue: 'N/A', annualPremium: '$1,800/yr',
    receivedDate: '2026-03-30', decisionDue: '2026-04-02', stpScore: 96,
    riskClass: 'Preferred (existing)', smoker: false, bmi: '24.2',
    agent: 'James Richardson', underwriter: 'Auto-issued via STP',
    evidence: [
      { name: 'Rx History', status: 'done', result: 'No new Rx.' },
      { name: 'MIB Check',  status: 'done', result: 'No new adverse records.' },
      { name: 'Policy Review', status: 'done', result: 'Policy in good standing.' },
      { name: 'E-Signature', status: 'done', result: 'Signed digitally Apr 1.' }
    ],
    ai: {
      headline: '✅ Issued — STP 96 | Total Decision Time 1.8 hrs',
      riskLevel: 'Very Low',
      summary: 'Robert Chen rider add-on issued in 1.8 hours total. STP engine processed all checks automatically. E-signature received digitally. This is an example of optimal AI-assisted underwriting speed.',
      factors: [
        { icon: 'fa-check-circle', color: '#059669', text: 'STP 96 — top-tier auto-approval score. Zero manual review required.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'All checks cleared within 1.8 hrs from application received to policy issued.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'E-signature received same day.' }
      ],
      recommendation: '✅ ISSUED — Policy active. No further action required.',
      nextSteps: ['Policy document sent to client email', 'Update CRM with issued status', 'Schedule 6-month policy review']
    }
  },
  'UW-2026-0006': {
    id: 'UW-2026-0006', client: 'James Whitfield', age: 62, stage: 'Issued',
    product: 'LTC Rider Add-on', faceValue: 'N/A', annualPremium: '$4,400/yr',
    receivedDate: '2026-03-27', decisionDue: '2026-03-30', stpScore: 94,
    riskClass: 'Standard LTC', smoker: false, bmi: '26.3',
    agent: 'James Richardson', underwriter: 'David Park + AI co-review',
    evidence: [
      { name: 'Rx History', status: 'done', result: 'Amlodipine + Atorvastatin — stable hypertension and cholesterol.' },
      { name: 'MIB Check',  status: 'done', result: 'No adverse records.' },
      { name: 'Cognitive Screen', status: 'done', result: 'MMSE score 28/30 — within normal range.' },
      { name: 'ADL Review', status: 'done', result: 'Full ADL independence confirmed.' },
      { name: 'E-Signature', status: 'done', result: 'Signed Mar 29.' }
    ],
    ai: {
      headline: '✅ Issued — LTC Rider | 3.1 hrs Total',
      riskLevel: 'Low',
      summary: 'James Whitfield LTC rider issued after standard LTC underwriting protocol. Cognitive screening (MMSE 28/30) and ADL independence confirmed. Hypertension and cholesterol controlled. Issued in 3.1 hrs with AI + human co-review.',
      factors: [
        { icon: 'fa-check-circle', color: '#059669', text: 'MMSE 28/30 — cognitive function normal. LTC eligibility confirmed.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Full ADL independence — no prior disability or care facility history.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Hypertension and cholesterol controlled — acceptable for Standard LTC rate.' }
      ],
      recommendation: '✅ ISSUED — Standard LTC rate. Policy active. No further action.',
      nextSteps: ['Policy documents delivered to James Whitfield', 'Update P-100293 LTC rider on record', 'Schedule annual LTC policy review']
    }
  }
};

// ── UW Modal State ──
let _currentUWCase = null;
let _currentUWTab = 'overview';

// ── Open UW Modal ──
function openUWModal(caseId) {
  const c = uwData[caseId];
  if (!c) return;
  _currentUWCase = caseId;
  _currentUWTab = 'overview';

  // Header
  const stageColors = {
    'Application Received': 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
    'Evidence Gathering':   'linear-gradient(135deg,#8b5cf6,#6d28d9)',
    'AI Review':            'linear-gradient(135deg,#059669,#047857)',
    'Decision':             'linear-gradient(135deg,#f59e0b,#d97706)',
    'Approved':             'linear-gradient(135deg,#10b981,#059669)',
    'Issued':               'linear-gradient(135deg,#003087,#1e40af)'
  };
  const iconEl = document.getElementById('uw-modal-icon');
  if (iconEl) iconEl.style.background = stageColors[c.stage] || 'linear-gradient(135deg,#003087,#1e40af)';

  const titleEl = document.getElementById('uw-modal-title');
  if (titleEl) titleEl.textContent = c.client + ' — ' + c.id;

  const subEl = document.getElementById('uw-modal-subtitle');
  if (subEl) subEl.textContent = c.product + ' · ' + (c.faceValue !== 'N/A' ? c.faceValue + ' · ' : '') + c.annualPremium + ' · Stage: ' + c.stage;

  // Reset tabs
  document.querySelectorAll('#uw-modal-tabs .dmt-tab').forEach((t, i) => {
    t.classList.toggle('active', i === 0);
  });

  // Render body
  renderUWModal('overview');

  // Show overlay
  const overlay = document.getElementById('uw-modal-overlay');
  if (overlay) { overlay.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}

function closeUWModal() {
  const overlay = document.getElementById('uw-modal-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function switchUWTab(tab, btn) {
  _currentUWTab = tab;
  document.querySelectorAll('#uw-modal-tabs .dmt-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderUWModal(tab);
}

function renderUWModal(tab) {
  const body = document.getElementById('uw-modal-body');
  if (!body || !_currentUWCase) return;
  const c = uwData[_currentUWCase];
  if (!c) return;

  if (tab === 'overview') {
    const stpClass = c.stpScore >= 80 ? 'stp-high' : c.stpScore >= 65 ? 'stp-med' : 'stp-low';
    body.innerHTML = `
      <div class="uw-modal-grid">
        <div class="uw-modal-section">
          <div class="uw-modal-section-title"><i class="fas fa-id-card"></i> Case Details</div>
          <div class="uw-detail-grid">
            <div class="uw-detail-item"><span class="uw-detail-lbl">Case ID</span><span class="uw-detail-val">${c.id}</span></div>
            <div class="uw-detail-item"><span class="uw-detail-lbl">Client</span><span class="uw-detail-val">${c.client}</span></div>
            <div class="uw-detail-item"><span class="uw-detail-lbl">Age</span><span class="uw-detail-val">${c.age}</span></div>
            <div class="uw-detail-item"><span class="uw-detail-lbl">Product</span><span class="uw-detail-val">${c.product}</span></div>
            <div class="uw-detail-item"><span class="uw-detail-lbl">Face Value</span><span class="uw-detail-val">${c.faceValue}</span></div>
            <div class="uw-detail-item"><span class="uw-detail-lbl">Annual Premium</span><span class="uw-detail-val">${c.annualPremium}</span></div>
            <div class="uw-detail-item"><span class="uw-detail-lbl">Received</span><span class="uw-detail-val">${c.receivedDate}</span></div>
            <div class="uw-detail-item"><span class="uw-detail-lbl">Decision Due</span><span class="uw-detail-val">${c.decisionDue}</span></div>
            <div class="uw-detail-item"><span class="uw-detail-lbl">Stage</span><span class="uw-detail-val">${c.stage}</span></div>
            <div class="uw-detail-item"><span class="uw-detail-lbl">Risk Class</span><span class="uw-detail-val">${c.riskClass}</span></div>
            <div class="uw-detail-item"><span class="uw-detail-lbl">Agent</span><span class="uw-detail-val">${c.agent}</span></div>
            <div class="uw-detail-item"><span class="uw-detail-lbl">Underwriter</span><span class="uw-detail-val">${c.underwriter}</span></div>
          </div>
        </div>
        <div class="uw-modal-section">
          <div class="uw-modal-section-title"><i class="fas fa-tachometer-alt"></i> STP Score</div>
          <div class="uw-stp-gauge-wrap">
            <div class="uw-stp-gauge-circle ${stpClass}">
              <span class="uw-stp-gauge-val">${c.stpScore}</span>
              <span class="uw-stp-gauge-lbl">STP Score</span>
            </div>
            <div class="uw-stp-gauge-legend">
              <div class="uw-stp-leg-item"><span class="uw-stp-dot stp-high"></span>≥ 80 — Auto-Approve</div>
              <div class="uw-stp-leg-item"><span class="uw-stp-dot stp-med"></span>65–79 — Review</div>
              <div class="uw-stp-leg-item"><span class="uw-stp-dot stp-low"></span>< 65 — APS Required</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  else if (tab === 'evidence') {
    const rows = c.evidence.map(ev => {
      const cls = ev.status === 'done' ? 'ev-done' : ev.status === 'flag' ? 'ev-flag' : ev.status === 'na' ? 'ev-na' : 'ev-pending';
      const icon = ev.status === 'done' ? 'fa-check-circle' : ev.status === 'flag' ? 'fa-exclamation-triangle' : ev.status === 'na' ? 'fa-minus-circle' : 'fa-hourglass-half';
      return `
        <div class="uw-ev-row ${cls}">
          <div class="uw-ev-name"><i class="fas ${icon}"></i> ${ev.name}</div>
          <div class="uw-ev-result">${ev.result}</div>
        </div>`;
    }).join('');
    body.innerHTML = `
      <div class="uw-modal-section" style="max-width:700px;margin:0 auto">
        <div class="uw-modal-section-title"><i class="fas fa-search-plus"></i> Evidence Checklist</div>
        <div class="uw-ev-list">${rows}</div>
      </div>
    `;
  }

  else if (tab === 'ai') {
    const ai = c.ai;
    const riskColors = { 'Very Low':'#059669','Low':'#10b981','Low-Moderate':'#84cc16','Moderate':'#f59e0b','Moderate-High':'#f97316','High':'#ef4444','Urgent':'#dc2626' };
    const riskColor = riskColors[ai.riskLevel] || '#6b7280';
    const factors = ai.factors.map(f => `
      <div class="uw-ai-factor">
        <i class="fas ${f.icon}" style="color:${f.color};flex-shrink:0"></i>
        <span>${f.text}</span>
      </div>`).join('');
    const steps = ai.nextSteps.map((s, i) => `
      <div class="uw-ai-step"><span class="uw-ai-step-num">${i + 1}</span><span>${s}</span></div>`).join('');
    body.innerHTML = `
      <div class="uw-ai-panel">
        <div class="uw-ai-header">
          <div class="uw-ai-headline">${ai.headline}</div>
          <div class="uw-ai-risk-badge" style="background:${riskColor}20;color:${riskColor};border:1px solid ${riskColor}40">
            Risk: ${ai.riskLevel}
          </div>
        </div>
        <div class="uw-ai-summary">${ai.summary}</div>
        <div class="uw-modal-section-title" style="margin-top:18px"><i class="fas fa-search"></i> Risk Factors</div>
        <div class="uw-ai-factors">${factors}</div>
        <div class="uw-modal-section-title" style="margin-top:18px"><i class="fas fa-gavel"></i> AI Recommendation</div>
        <div class="uw-ai-recommendation">${ai.recommendation}</div>
        <div class="uw-modal-section-title" style="margin-top:18px"><i class="fas fa-list-ol"></i> Next Steps</div>
        <div class="uw-ai-steps">${steps}</div>
      </div>
    `;
  }
}

// ── Run AI Scan ──
function runUWScan() {
  const btn = document.querySelector('.btn-uw-scan');
  if (!btn) return;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Scanning…';
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Scan Complete — 11 cases updated';
    btn.disabled = false;
    // Update last-scan timestamp if present
    const ts = document.querySelector('.uw-stp-sub');
    if (ts) {
      const orig = ts.textContent;
      ts.textContent = orig.replace(/·.*?$/, '· Last scan: just now');
    }
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-sync-alt"></i> Run AI Scan';
    }, 3000);
  }, 2000);
}

/* =============================================
   RETENTION INTELLIGENCE — Data & Modal Logic
   ============================================= */

const retentionData = {
  'ret-patricia': {
    id: 'ret-patricia', client: 'Patricia Nguyen', age: 38,
    riskLevel: 'High', riskScore: 87,
    policy: 'P-100301', policyType: 'Universal Life',
    triggerType: 'lapse', triggerIcon: 'fa-battery-quarter',
    triggerLabel: 'UL Under-funded — Predicted Lapse ~Jun 20, 2026',
    lastContact: '2026-04-02', segment: 'Mid Market', premium: '$5,800/yr',
    analysis: {
      headline: '⚠️ Policy Lapse Risk — UL Under-funded 2 Consecutive Quarters',
      riskColor: '#dc2626',
      summary: 'Patricia Nguyen\'s Universal Life policy P-100301 has been under-funded for two consecutive quarters. AI cash-flow model predicts policy lapse within 60–90 days if premiums are not increased. Current cash value $21,400 is below minimum threshold to sustain cost of insurance at current load.',
      metrics: [
        { label: 'Cash Value (Current)', value: '$21,400', flag: true },
        { label: 'Min Threshold', value: '$28,000', flag: false },
        { label: 'Shortfall', value: '-$6,600', flag: true },
        { label: 'Predicted Lapse', value: '~Jun 20, 2026', flag: true },
        { label: 'Client Age', value: '38', flag: false },
        { label: 'Re-qual Required', value: 'Yes — if lapses', flag: true },
        { label: 'Catch-up Needed', value: '$1,800–$2,400', flag: false },
        { label: 'Quarterly Premium', value: '$1,450', flag: false }
      ]
    },
    signals: [
      { icon: 'fa-battery-quarter', color: '#dc2626', text: 'Under-funded Q3 2025 — cash value dropped $4,200 below projection.' },
      { icon: 'fa-battery-empty',   color: '#dc2626', text: 'Under-funded Q4 2025 (2nd consecutive quarter) — below minimum threshold now.' },
      { icon: 'fa-exclamation-triangle', color: '#f59e0b', text: 'Client age 38 — if policy lapses, re-qualification requires new medical underwriting. Approved in 2022 at Preferred Plus.' },
      { icon: 'fa-calendar-times',  color: '#dc2626', text: 'AI cash-flow model: if no action by May 1, policy lapse probability reaches 94% by June 20.' },
      { icon: 'fa-phone-slash',     color: '#f59e0b', text: 'Last agent contact: Apr 2, 2026 (11 days ago). Policy issue not yet discussed.' },
      { icon: 'fa-info-circle',     color: '#3b82f6', text: 'Retention value: $5,800/yr premium · $500K face value. High-value policy worth protecting.' }
    ],
    actionPlan: {
      urgency: 'URGENT — Act within 14 days',
      steps: [
        { num: 1, urgent: true,  text: 'Call Patricia Nguyen this week — frame as "policy health check" not a collections call. Script: "I\'m reviewing your Universal Life policy and noticed we need to review the premium schedule to keep your coverage strong."' },
        { num: 2, urgent: false, text: 'Prepare premium catch-up illustration: show 3 options — $600/month for 3 months, one lump-sum catch-up of $1,800, or restructure premium schedule to $2,400/yr flat.' },
        { num: 3, urgent: false, text: 'Discuss policy restructuring: consider converting to a fixed-premium structure or reducing face value to make policy sustainable at current budget.' },
        { num: 4, urgent: false, text: 'If no resolution by May 1: escalate to manager and send formal written notice to client. Document all contact attempts in CRM.' }
      ],
      estimatedRetentionValue: '$5,800/yr · $500K coverage preserved'
    }
  },

  'ret-sandra': {
    id: 'ret-sandra', client: 'Sandra Williams', age: 61,
    riskLevel: 'High', riskScore: 79,
    policy: 'P-100320', policyType: 'Term Life — 20-Year',
    triggerType: 'renewal', triggerIcon: 'fa-calendar-times',
    triggerLabel: 'Term Renewal Expiring Sep 2026 — 153 Days Left',
    lastContact: '2026-03-20', segment: 'Mid Market', premium: '$8,200/yr',
    analysis: {
      headline: '⚡ URGENT — Term Policy Expires Sep 2026, Conversion Window Closing',
      riskColor: '#d97706',
      summary: 'Sandra Williams, age 61, has a 20-year term policy expiring September 2026 — 153 days away. Without action, $350K coverage lapses and re-qualification at age 61 requires new medical underwriting. Conversion option available without medical evidence until renewal date. This is a time-sensitive retention and upsell opportunity.',
      metrics: [
        { label: 'Policy Expiry', value: 'Sep 15, 2026', flag: true },
        { label: 'Days Remaining', value: '153 days', flag: true },
        { label: 'Face Value', value: '$350,000', flag: false },
        { label: 'Current Premium', value: '$2,400/yr (term)', flag: false },
        { label: 'Client Age', value: '61', flag: false },
        { label: 'Conversion Eligible', value: 'Yes — until Sep 15', flag: false },
        { label: 'New Coverage (if lapses)', value: 'Full medical UW required', flag: true },
        { label: 'Beneficiary', value: 'Michael Williams (spouse)', flag: false }
      ]
    },
    signals: [
      { icon: 'fa-calendar-check', color: '#d97706', text: 'Term policy P-100320 issued Sep 2006 — 20-year term. Expiry: Sep 15, 2026.' },
      { icon: 'fa-user-shield',    color: '#dc2626', text: 'Without conversion: Michael Williams (spouse/beneficiary) loses $350K life protection. Sandra is primary earner.' },
      { icon: 'fa-heartbeat',      color: '#f59e0b', text: 'Age 61 at renewal — new term policy would require full medical UW. Likely rated or reduced face value.' },
      { icon: 'fa-exchange-alt',   color: '#059669', text: 'Conversion window: Whole Life or Universal Life conversion without medical evidence is available until Sep 15, 2026.' },
      { icon: 'fa-coins',          color: '#059669', text: 'Upsell opportunity: Whole Life premium ~$4,800–$6,200/yr adds cash value + permanent coverage for Sandra at 61.' },
      { icon: 'fa-phone-slash',    color: '#f59e0b', text: 'Last contact: Mar 20, 2026 (24 days ago). Renewal not yet discussed.' }
    ],
    actionPlan: {
      urgency: 'HIGH — Schedule call within 7 days',
      steps: [
        { num: 1, urgent: true,  text: 'Call Sandra Williams this week — frame as a "courtesy renewal review." Script: "Your term policy comes up in September and I want to walk you through your options before the window closes."' },
        { num: 2, urgent: false, text: 'Prepare Whole Life vs. Universal Life conversion comparison: show premium cost, cash value build-up over 10 years, and permanent coverage benefit for Sandra\'s estate.' },
        { num: 3, urgent: false, text: 'Schedule in-person renewal review meeting — include Michael Williams (beneficiary) if possible. This is a household financial planning conversation, not just an insurance call.' },
        { num: 4, urgent: false, text: 'Explore annuity option: Sandra at 61 may be interested in an income annuity for retirement supplement. High cross-sell potential given age and income profile.' }
      ],
      estimatedRetentionValue: '$350K coverage preserved · $4,800–$6,200/yr new WL premium'
    }
  },

  'ret-kevin': {
    id: 'ret-kevin', client: 'Kevin Park', age: 29,
    riskLevel: 'High', riskScore: 72,
    policy: 'P-100350', policyType: 'Term Life — Pending',
    triggerType: 'claim', triggerIcon: 'fa-user-clock',
    triggerLabel: 'Death Claim — Policy Was in Pending Status',
    lastContact: '2026-04-01', segment: 'Emerging', premium: '$1,800/yr',
    analysis: {
      headline: '🚨 Death Claim Filed — Policy Pending at Time of Death',
      riskColor: '#dc2626',
      summary: 'Kevin Park passed away. Death benefit claim CLM-2026-0025 filed by estate. Policy P-100350 was in Pending (underwriting review) status at time of death — coverage determination required. Estate is waiting. This is a critical retention and relationship management situation with Kevin\'s beneficiary network.',
      metrics: [
        { label: 'Claim ID', value: 'CLM-2026-0025', flag: false },
        { label: 'Claim Amount', value: '$250,000', flag: false },
        { label: 'Policy Status', value: 'PENDING at time of death', flag: true },
        { label: 'Coverage Determination', value: 'In progress', flag: true },
        { label: 'Medical Records', value: 'Pending', flag: true },
        { label: 'Fraud Score', value: '78 — Flagged', flag: true },
        { label: 'Death Date', value: '~Feb 2026', flag: false },
        { label: 'Claimant', value: 'Estate of Kevin Park', flag: false }
      ]
    },
    signals: [
      { icon: 'fa-exclamation-circle', color: '#dc2626', text: 'Policy was in Pending status — coverage was not yet in force. Claim cannot be approved until underwriting confirms binding status.' },
      { icon: 'fa-search',             color: '#f59e0b', text: 'Fraud score 78 (Flagged) — contestability review and medical records required before any payout.' },
      { icon: 'fa-users',              color: '#3b82f6', text: 'Retention opportunity: Kevin\'s family and contacts are a prospect pool. Handle claim sensitively — referrals may follow if claim is resolved professionally.' },
      { icon: 'fa-balance-scale',      color: '#dc2626', text: 'Legal risk: if coverage was in force and claim is delayed, estate may pursue legal action. Coordinate with legal and senior adjuster.' },
      { icon: 'fa-heart',              color: '#059669', text: 'Post-resolution: Susan Chen (potential beneficiary contact) has zero NYL coverage — coverage gap outreach opportunity once claim resolves.' }
    ],
    actionPlan: {
      urgency: 'URGENT — Coordinate with Claims & Legal',
      steps: [
        { num: 1, urgent: true,  text: 'Expedite medical records request — underwriting team needs records to confirm whether coverage was in force at time of death. Priority: this week.' },
        { num: 2, urgent: true,  text: 'Coordinate with underwriting team — confirm binding status of application as of 2026-02-01. Involve senior adjuster and legal review given fraud score 78.' },
        { num: 3, urgent: false, text: 'Communicate professionally with estate representative — acknowledge receipt of claim, provide realistic timeline (no promises on outcome). Document all contact.' },
        { num: 4, urgent: false, text: 'Post-resolution outreach: If claim is resolved, reach out to Susan Chen (beneficiary/family contact) for a coverage gap discussion. High-value retention/acquisition opportunity.' }
      ],
      estimatedRetentionValue: 'Relationship preservation + Susan Chen coverage opportunity'
    }
  },

  'ret-david': {
    id: 'ret-david', client: 'David Thompson', age: 33,
    riskLevel: 'Medium', riskScore: 54,
    policy: 'P-100380', policyType: 'Term Life — Single Policy',
    triggerType: 'underinsured', triggerIcon: 'fa-shield-alt',
    triggerLabel: 'Single Policy · Under-insured at Age 33',
    lastContact: '2026-04-07', segment: 'Emerging', premium: '$2,400/yr',
    analysis: {
      headline: 'Under-insured Risk — Single Term Policy at Age 33',
      riskColor: '#f59e0b',
      summary: 'David Thompson, age 33, has only one policy with NYL — a Term Life policy currently in Pending/Underwriting. He has no disability, no retirement, no investments, and no advisory products. His household coverage is minimal. The risk is gradual drift to a competitor who offers a more comprehensive product. AI models show 54% lapse/drift risk within 12 months without engagement.',
      metrics: [
        { label: 'Active Policies', value: '1 (Term Life)', flag: true },
        { label: 'Annual Premium', value: '$2,400/yr', flag: false },
        { label: 'Coverage Gaps', value: 'DI, Retirement, 529', flag: true },
        { label: 'Client Age', value: '33', flag: false },
        { label: 'Segment', value: 'Emerging', flag: false },
        { label: 'Last Contact', value: 'Apr 7, 2026', flag: false },
        { label: 'Relationship Depth', value: 'Low — 1 product', flag: true },
        { label: 'Upsell Potential', value: 'High — 3+ products', flag: false }
      ]
    },
    signals: [
      { icon: 'fa-shield-alt',    color: '#f59e0b', text: 'Only 1 NYL product — minimal relationship depth. Single-product clients churn 3x more than multi-product clients.' },
      { icon: 'fa-heartbeat',     color: '#dc2626', text: 'No disability insurance — David is 33, primary earner. DI is the most underutilized product in this age/income segment.' },
      { icon: 'fa-piggy-bank',    color: '#f59e0b', text: 'No retirement products — 529 plan opportunity given life stage (likely has or planning children). Entry point for long-term relationship.' },
      { icon: 'fa-chart-line',    color: '#3b82f6', text: 'New parent or young family profile — term rider and disability rider additions are natural at this life stage.' },
      { icon: 'fa-calendar',      color: '#059669', text: 'Recent contact (Apr 7) — good engagement window. Strike while relationship is fresh.' }
    ],
    actionPlan: {
      urgency: 'MEDIUM — Engage within 30 days',
      steps: [
        { num: 1, urgent: false, text: 'Schedule a "life stage review" call — frame as a comprehensive financial wellness check, not a sales call. Ask about family plans, career changes, and financial goals.' },
        { num: 2, urgent: false, text: 'Lead with Disability Insurance — it\'s the most compelling product for a 33-year-old professional. The pitch: "Your income is your biggest asset. If you can\'t work, how does your family pay the mortgage?"' },
        { num: 3, urgent: false, text: 'Introduce 529 College Savings Plan — if David has or plans to have children, this is an easy, emotionally resonant conversation.' },
        { num: 4, urgent: false, text: 'Build the relationship before selling retirement products — retirement planning is more complex. Build trust on DI and 529 first, then introduce IRA or annuity when the relationship is deeper.' }
      ],
      estimatedRetentionValue: '$2,400/yr preserved + $4,000–$6,000/yr upsell potential'
    }
  },

  'ret-james': {
    id: 'ret-james', client: 'James Whitfield', age: 62,
    riskLevel: 'Medium', riskScore: 48,
    policy: 'P-100293', policyType: 'Long-Term Care — $200/day',
    triggerType: 'coverage-gap', triggerIcon: 'fa-coins',
    triggerLabel: 'LTC Coverage Gap — Daily Benefit Insufficient',
    lastContact: '2026-04-05', segment: 'High Value', premium: '$12,400/yr',
    analysis: {
      headline: 'LTC Coverage Gap — Daily Benefit Below Current NYC Cost',
      riskColor: '#8b5cf6',
      summary: 'James Whitfield\'s Long-Term Care policy provides $200/day benefit, set in 2022. Current NYC LTC average cost is $380/day — a $180/day gap. While the 3% inflation rider partially offsets this over time, the current gap is material. The risk is that at claim time, James will be significantly under-covered, leading to dissatisfaction, complaint, and potential lapse of related policies.',
      metrics: [
        { label: 'Daily Benefit (Current)', value: '$200/day', flag: true },
        { label: 'NYC LTC Avg Cost', value: '$380/day', flag: false },
        { label: 'Coverage Gap', value: '$180/day', flag: true },
        { label: 'Annual Gap', value: '~$65,700/yr', flag: true },
        { label: 'Inflation Rider', value: '3% compound', flag: false },
        { label: 'Benefit Period', value: '3 years', flag: false },
        { label: 'Annual Premium', value: '$12,400/yr', flag: false },
        { label: 'Client Age', value: '62 — review now', flag: false }
      ]
    },
    signals: [
      { icon: 'fa-coins',       color: '#8b5cf6', text: '$200/day benefit set in 2022. NYC average LTC cost: $380/day (2026). Gap will widen as LTC costs inflate faster than 3% rider.' },
      { icon: 'fa-hospital',    color: '#dc2626', text: '3-year benefit period is below national average need (2.5 yrs, but 20% of LTC claims exceed 5 years). Coverage risk at tail end.' },
      { icon: 'fa-user-md',     color: '#f59e0b', text: 'Age 62 — still within window to increase daily benefit without significant underwriting hurdle. At 65+, benefit increases become harder to obtain.' },
      { icon: 'fa-shield-check', color: '#059669', text: 'High-value client ($12,400/yr total premium) — investing in coverage adequacy retains relationship and prevents claim-time dissatisfaction.' },
      { icon: 'fa-calendar',    color: '#059669', text: 'Next renewal coming up — ideal time to have a coverage review conversation with James.' }
    ],
    actionPlan: {
      urgency: 'MEDIUM — Address at next renewal',
      steps: [
        { num: 1, urgent: false, text: 'Request updated LTC cost analysis for New York — show James the actual cost trajectory vs. his benefit using AALTCI data and NYL LTC cost projections for 2030–2035.' },
        { num: 2, urgent: false, text: 'Model a benefit increase from $200/day → $280–$300/day at the next renewal: show the premium increase vs. the risk mitigation. Include inflation rider compounding effect.' },
        { num: 3, urgent: false, text: 'Discuss benefit period extension: 3 years → 5 years increases premium but significantly reduces tail risk for the family. Frame as protecting against the long-tail scenario.' },
        { num: 4, urgent: false, text: 'Explore linked-benefit products: a combination life/LTC policy may offer better value for James at 62. Run a comparison illustration for his next review meeting.' }
      ],
      estimatedRetentionValue: '$12,400/yr preserved + coverage upgrade premium uplift'
    }
  }
};

// ── Retention Modal State ──
let _currentRetCase = null;
let _currentRetTab = 'analysis';

function openRetentionModal(retId) {
  const r = retentionData[retId];
  if (!r) return;
  _currentRetCase = retId;
  _currentRetTab = 'analysis';

  const iconColors = {
    'lapse':        'linear-gradient(135deg,#dc2626,#b91c1c)',
    'renewal':      'linear-gradient(135deg,#d97706,#b45309)',
    'claim':        'linear-gradient(135deg,#7c3aed,#5b21b6)',
    'underinsured': 'linear-gradient(135deg,#f59e0b,#d97706)',
    'coverage-gap': 'linear-gradient(135deg,#8b5cf6,#6d28d9)'
  };
  const iconMap = {
    'lapse': 'fa-battery-quarter', 'renewal': 'fa-calendar-times',
    'claim': 'fa-user-clock', 'underinsured': 'fa-shield-alt', 'coverage-gap': 'fa-coins'
  };

  const iconEl = document.getElementById('retention-modal-icon');
  if (iconEl) {
    iconEl.style.background = iconColors[r.triggerType] || 'linear-gradient(135deg,#dc2626,#b91c1c)';
    iconEl.innerHTML = `<i class="fas ${iconMap[r.triggerType] || 'fa-shield-alt'}"></i>`;
  }

  const titleEl = document.getElementById('retention-modal-title');
  if (titleEl) titleEl.textContent = r.client + ' — Retention Intelligence';

  const subEl = document.getElementById('retention-modal-subtitle');
  if (subEl) subEl.textContent = r.triggerLabel + ' · ' + r.policyType;

  document.querySelectorAll('#retention-modal-tabs .dmt-tab').forEach((t, i) => {
    t.classList.toggle('active', i === 0);
  });

  renderRetentionModal('analysis');

  const overlay = document.getElementById('retention-modal-overlay');
  if (overlay) { overlay.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}

function closeRetentionModal() {
  const overlay = document.getElementById('retention-modal-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function switchRetentionTab(tab, btn) {
  _currentRetTab = tab;
  document.querySelectorAll('#retention-modal-tabs .dmt-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderRetentionModal(tab);
}

function renderRetentionModal(tab) {
  const body = document.getElementById('retention-modal-body');
  if (!body || !_currentRetCase) return;
  const r = retentionData[_currentRetCase];
  if (!r) return;

  if (tab === 'analysis') {
    const a = r.analysis;
    const metricRows = a.metrics.map(m => `
      <div class="ret-metric-item${m.flag ? ' flagged' : ''}">
        <span class="ret-metric-lbl">${m.label}</span>
        <span class="ret-metric-val${m.flag ? ' flag' : ''}">${m.value}${m.flag ? ' <i class="fas fa-exclamation-circle"></i>' : ''}</span>
      </div>`).join('');

    const riskBar = r.riskScore;
    const riskColor = r.riskScore >= 75 ? '#dc2626' : r.riskScore >= 55 ? '#f59e0b' : '#059669';

    body.innerHTML = `
      <div class="ret-modal-grid">
        <div class="ret-modal-left">
          <div class="ret-analysis-headline" style="border-left-color:${a.riskColor}">${a.headline}</div>
          <div class="ret-analysis-summary">${a.summary}</div>
          <div class="ret-metrics-grid">${metricRows}</div>
        </div>
        <div class="ret-modal-right">
          <div class="ret-risk-gauge">
            <div class="ret-risk-circle" style="border-color:${riskColor};background:${riskColor}15">
              <span class="ret-risk-val" style="color:${riskColor}">${riskBar}</span>
              <span class="ret-risk-lbl">Risk Score</span>
            </div>
            <div class="ret-risk-level" style="color:${riskColor}">${r.riskLevel} Risk</div>
          </div>
          <div class="ret-client-card-mini">
            <div class="ret-client-row"><span class="ret-cl">Client</span><span class="ret-cv">${r.client}</span></div>
            <div class="ret-client-row"><span class="ret-cl">Age</span><span class="ret-cv">${r.age}</span></div>
            <div class="ret-client-row"><span class="ret-cl">Segment</span><span class="ret-cv">${r.segment}</span></div>
            <div class="ret-client-row"><span class="ret-cl">Premium</span><span class="ret-cv">${r.premium}</span></div>
            <div class="ret-client-row"><span class="ret-cl">Policy</span><span class="ret-cv">${r.policy}</span></div>
            <div class="ret-client-row"><span class="ret-cl">Last Contact</span><span class="ret-cv">${r.lastContact}</span></div>
          </div>
        </div>
      </div>`;
  }

  else if (tab === 'signals') {
    const sigs = r.signals.map(s => `
      <div class="ret-signal-row">
        <i class="fas ${s.icon}" style="color:${s.color};flex-shrink:0;margin-top:2px"></i>
        <span>${s.text}</span>
      </div>`).join('');
    body.innerHTML = `
      <div class="ret-modal-section" style="padding:20px 24px">
        <div class="ret-section-title"><i class="fas fa-signal"></i> Retention Risk Signals</div>
        <div class="ret-signals-list">${sigs}</div>
      </div>`;
  }

  else if (tab === 'action') {
    const ap = r.actionPlan;
    const steps = ap.steps.map(s => `
      <div class="ret-action-step${s.urgent ? ' urgent' : ''}">
        <span class="ret-step-num${s.urgent ? ' urgent' : ''}">${s.urgent ? '!' : s.num}</span>
        <span>${s.text}</span>
      </div>`).join('');
    body.innerHTML = `
      <div class="ret-modal-section" style="padding:20px 24px">
        <div class="ret-urgency-banner">${ap.urgency}</div>
        <div class="ret-section-title" style="margin-top:16px"><i class="fas fa-list-ol"></i> AI Recommended Action Plan</div>
        <div class="ret-action-steps">${steps}</div>
        <div class="ret-retention-value">
          <i class="fas fa-dollar-sign"></i>
          <span><strong>Estimated Retention Value:</strong> ${ap.estimatedRetentionValue}</span>
        </div>
      </div>`;
  }
}

// ============================================================
// #6 — PRE-MEETING BRIEF & POST-MEETING SUMMARY
// ============================================================

const meetingData = {

  // ── UPCOMING MEETINGS ──────────────────────────────────
  'MTG-001': {
    type: 'pre',
    client: 'Kevin Park',
    initials: 'KP',
    date: 'Apr 10, 2026',
    time: '10:00 AM',
    duration: '30 min',
    format: 'Phone Call',
    domain: 'ins',
    domainLabel: 'Insurance',
    urgency: 'urgent',
    title: 'Kevin Park — Follow-up Call',
    subtitle: 'Pending Application · Urgent',
    objective: 'Follow up on pending Term Life application (P-100350). Obtain outstanding medical records; clarify contestability timeline with estate.',
    clientSnapshot: {
      age: 34, segment: 'Emerging', policies: 1, premium: '$2,800/yr',
      lastContact: '2026-04-03', score: 78,
      notes: 'Kevin passed away — death benefit claim CLM-2026-0025 filed by estate. Policy was in Pending/Underwriting status. Coverage determination critical.'
    },
    aiAlerts: [
      { icon: 'fa-exclamation-circle', color: '#dc2626', text: '⚡ URGENT: $250K death benefit claim under contestability review.' },
      { icon: 'fa-file-medical', color: '#d97706', text: 'Medical records pending — must obtain to confirm coverage status.' },
      { icon: 'fa-users', color: '#2563eb', text: 'Estate representative: contact Susan Park (sister) — (646) 555-0198.' }
    ],
    talkingPoints: [
      'Confirm estate attorney contact for documentation coordination',
      'Explain contestability process and 2-year window status',
      'Provide timeline estimate: expected determination Apr 20',
      'Offer compassionate case expedite request to Claims Dept.',
      'Discuss any outstanding medical records from Dr. James Hart (PCP)'
    ],
    documents: ['Death Certificate ✅', 'Policy P-100350 Application ✅', 'Medical Records (PCP) ⏳', 'Estate Documentation ⏳'],
    prepNotes: 'Sensitively handle — claimant is the estate. Coordinate with adjuster Michael Torres (Claims). Do NOT discuss policy lapse risk with estate.'
  },

  'MTG-002': {
    type: 'pre',
    client: 'Robert Chen',
    initials: 'RC',
    date: 'Apr 10, 2026',
    time: '2:00 PM',
    duration: '45 min',
    format: 'Video Call',
    domain: 'ins',
    domainLabel: 'Insurance',
    urgency: 'high',
    title: 'Robert Chen — Claim Status Update',
    subtitle: 'Death Benefit Claim · $1,000,000 · Video · 45 min',
    objective: 'Provide claim status update on CLM-2026-0041. Coordinate with beneficiary Susan Chen on outstanding documents. Discuss payout timeline and estate planning needs.',
    clientSnapshot: {
      age: 45, segment: 'High Value', policies: 4, premium: '$21,000/yr',
      lastContact: '2026-04-08', score: 96,
      notes: 'Top-tier client, 4 policies. Death benefit $1M under review. Business succession plan needed for Chen Holdings. Estate attorney coordination required.'
    },
    aiAlerts: [
      { icon: 'fa-exclamation-circle', color: '#dc2626', text: '$1M death benefit — expedite identity docs from beneficiary Susan Chen.' },
      { icon: 'fa-briefcase', color: '#7c3aed', text: 'Business succession gap: Chen Holdings (~$4M valuation) has no buy-sell agreement.' },
      { icon: 'fa-chart-line', color: '#2563eb', text: 'Investment portfolio $180K AUM — beneficiary may want to consolidate with NYL.' }
    ],
    talkingPoints: [
      'Status: medical certificate verified, identity docs and bank details pending from Susan',
      'Expected payout timeline: Apr 17–19 once documents complete',
      'Introduce NYL estate planning services to Susan Chen (beneficiary)',
      'Discuss Chen Holdings succession — NQDC plan and buy-sell agreement',
      'Present wealth management options for $180K AUM + death benefit proceeds'
    ],
    documents: ['Death Certificate ✅', 'Medical Certificate ✅', 'Claimant Identity Docs ⏳', 'Bank Payout Details ⏳'],
    prepNotes: 'Approach with empathy. Susan Chen is the beneficiary — new relationship opportunity. Have NYL estate-planning brochure ready. Adjuster: Michael Torres.'
  },

  'MTG-003': {
    type: 'pre',
    client: 'Alex Rivera',
    initials: 'AR',
    date: 'Apr 12, 2026',
    time: '11:00 AM',
    duration: '60 min',
    format: 'In Person',
    domain: 'inv',
    domainLabel: 'Investments',
    urgency: 'normal',
    title: 'Alex Rivera — New Prospect Introduction',
    subtitle: 'Annuity + Whole Life Interest · In Person · 60 min',
    objective: 'First in-person meeting with prospect Alex Rivera. Perform full needs analysis. Present Whole Life $500K and fixed-indexed annuity illustrations.',
    clientSnapshot: {
      age: 32, segment: 'Emerging', policies: 0, premium: '$0',
      lastContact: 'None (new)', score: 0,
      notes: 'Referred by Linda Morrison. Software engineer, high income, no existing NYL coverage. Expressed interest in WL cash value and income annuity for retirement planning.'
    },
    aiAlerts: [
      { icon: 'fa-star', color: '#d97706', text: 'Referred by top client Linda Morrison — high-quality lead, handle with care.' },
      { icon: 'fa-dollar-sign', color: '#16a34a', text: 'High income profile — potential $4,800/yr+ premium capacity (WL + annuity).' },
      { icon: 'fa-shield-alt', color: '#2563eb', text: 'No current coverage — ideal full-spectrum onboarding opportunity (Ins + Inv + Ret).' }
    ],
    talkingPoints: [
      'Needs discovery: income, dependents, risk tolerance, retirement timeline',
      'Present Whole Life $500K illustration — cash value growth, living benefits',
      'Show Fixed-Indexed Annuity income projection for age 65+',
      'Discuss disability income gap — engineer with no DI coverage',
      'Set expectation for follow-up application timeline (STP pipeline ready)'
    ],
    documents: ['WL $500K illustration (prepared)', 'FIA income projection (prepared)', 'NYL product overview brochure', 'Needs analysis worksheet'],
    prepNotes: 'Alex is data-driven — bring charts and numbers. Emphasize tax-advantaged growth of WL cash value and annuity deferral. Do not rush to close — build trust first meeting.'
  },

  'MTG-004': {
    type: 'pre',
    client: 'Linda Morrison',
    initials: 'LM',
    date: 'Apr 15, 2026',
    time: '10:00 AM',
    duration: '90 min',
    format: 'In Person',
    domain: 'adv',
    domainLabel: 'Advisory',
    urgency: 'normal',
    title: 'Linda Morrison — Annual Review',
    subtitle: 'Estate + UMA + Insurance · In Person · 90 min',
    objective: 'Annual holistic review: update estate plan, present UMA opportunity ($280K), review WL policy performance, and confirm waiver-of-premium claim resolution.',
    clientSnapshot: {
      age: 58, segment: 'Premium', policies: 5, premium: '$34,200/yr',
      lastContact: '2026-04-02', score: 98,
      notes: 'Top client. $280K investable assets — UMA candidate ($2,800/yr fee). VUL + WL flagship ($2M). Waiver-of-premium claim approved 90 days. Estate attorney: David Kaufman.'
    },
    aiAlerts: [
      { icon: 'fa-chart-pie', color: '#7c3aed', text: '$280K+ AUM — UMA proposal ready. Fee opportunity: $2,800/yr.' },
      { icon: 'fa-file-contract', color: '#2563eb', text: 'Estate plan: coordinate trust update with David Kaufman at this meeting.' },
      { icon: 'fa-umbrella', color: '#16a34a', text: 'WL P-100330: cash value $168,400, Paid-Up Additions +$6,200/yr. In excellent standing.' }
    ],
    talkingPoints: [
      'WL P-100330 performance review: cash value $168,400, dividend additions +$6,200',
      'Present UMA proposal: $280K at 1% management fee = $2,800/yr',
      'Estate update: confirm trust beneficiary designations with David Kaufman',
      'Waiver-of-premium status: approved through June 10 — premium reinstatement plan',
      'LTC rider adequacy: review daily benefit vs. current facility costs in New York'
    ],
    documents: ['UMA proposal — $280K (prepared)', 'WL annual statement P-100330', 'Trust review checklist', 'LTC benefit analysis', 'Waiver-of-premium approval letter'],
    prepNotes: 'Linda is the #1 client by portfolio value ($812K). Bring estate attorney contact card for David Kaufman. This meeting is revenue-critical — UMA close is the primary goal.'
  },

  'MTG-005': {
    type: 'pre',
    client: 'James Whitfield',
    initials: 'JW',
    date: 'Apr 18, 2026',
    time: '3:00 PM',
    duration: '60 min',
    format: 'In Person',
    domain: 'ret',
    domainLabel: 'Retirement',
    urgency: 'normal',
    title: 'James Whitfield — Retirement Planning',
    subtitle: 'Deferred Annuity Illustration · In Person · 60 min',
    objective: 'Present deferred annuity illustration for James\'s retirement income strategy. Review LTC claim status and discuss premium funding optimization.',
    clientSnapshot: {
      age: 52, segment: 'High Value', policies: 3, premium: '$12,400/yr',
      lastContact: '2026-04-05', score: 92,
      notes: 'LTC claim CLM-2026-0033 approved — ADL threshold met, payment expected Apr 18. Deferred annuity: ideal for bridge income age 65–72. Executive benefits gap identified.'
    },
    aiAlerts: [
      { icon: 'fa-calendar-check', color: '#16a34a', text: 'LTC claim CLM-2026-0033 expected approval today — excellent timing to reassure client.' },
      { icon: 'fa-umbrella-beach', color: '#7c3aed', text: 'Deferred annuity at $85K lump sum → $1,100/mo income at age 67 (illustrated).' },
      { icon: 'fa-briefcase', color: '#d97706', text: 'Executive benefits gap: no NQDC, no key-person life insurance for employer.' }
    ],
    talkingPoints: [
      'LTC claim update: approval expected Apr 18, first payment Apr 18 ($9,600)',
      'Present deferred annuity illustration: $85K → $1,100/mo income at 67',
      'Discuss contribution strategy: lump sum vs. annual premium funding',
      'Introduce NQDC (Non-Qualified Deferred Compensation) for executive income deferral',
      'Review existing policies — any coverage gaps or beneficiary updates needed'
    ],
    documents: ['Deferred annuity illustration ($85K)', 'NQDC plan overview', 'LTC claim approval letter (pending)', 'Policy review summary'],
    prepNotes: 'James responds well to projected income numbers — show the annuity growth table. Mention NQDC as a tax-deferral strategy for his executive income. He is open to comprehensive planning.'
  },

  'MTG-006': {
    type: 'pre',
    client: 'Team — Roger Putnam',
    initials: 'TP',
    date: 'Apr 22, 2026',
    time: '9:00 AM',
    duration: '120 min',
    format: 'In Person',
    domain: 'ins',
    domainLabel: 'Insurance',
    urgency: 'normal',
    title: 'Team Q1 Performance Review',
    subtitle: 'All Lines · Roger Putnam (Sales Director) · 120 min',
    objective: 'Q1 2026 performance debrief with Regional Director Roger Putnam. Present pipeline metrics, YTD results, and Q2 strategy.',
    clientSnapshot: {
      age: null, segment: 'Internal', policies: null, premium: null,
      lastContact: 'Q4 2025 Review', score: null,
      notes: 'Regional Director review. YTD: $187K commissions (78% of $240K target). Pipeline: $284K pending. Retention: 4 lapse risks identified.'
    },
    aiAlerts: [
      { icon: 'fa-trophy', color: '#16a34a', text: 'YTD commissions $187K — 78% of $240K annual target. On track.' },
      { icon: 'fa-exclamation-triangle', color: '#d97706', text: '4 lapse-risk clients flagged — present retention action plan to Roger.' },
      { icon: 'fa-chart-bar', color: '#2563eb', text: 'Pipeline conversion rate 68% — highlight AI-assisted underwriting STP improvements.' }
    ],
    talkingPoints: [
      'Q1 commissions: $42,180 (MTD) vs. $38,500 target — exceeded by 9.5%',
      'Pipeline: $284K pending, 11 UW cases, 68% conversion rate',
      'STP rate 73% — AI underwriting reduced avg decision time from 8 days to 4.2 hrs',
      'Retention risks: 4 clients flagged (Patricia, Sandra, Kevin, David) — mitigation plans active',
      'Q2 strategy: Linda Morrison UMA close ($2,800/yr), Alex Rivera full onboarding, James deferred annuity'
    ],
    documents: ['Q1 performance report', 'YTD commission breakdown', 'Pipeline summary', 'Retention risk report', 'Q2 opportunity map'],
    prepNotes: 'Roger appreciates data-driven presentations. Lead with the STP improvement story — it\'s a strong differentiator. Be ready to discuss the 4 lapse-risk clients and your specific action plans.'
  },

  'MTG-007': {
    type: 'pre',
    client: 'Robert Chen',
    initials: 'RC',
    date: 'Apr 25, 2026',
    time: '11:00 AM',
    duration: '90 min',
    format: 'In Person',
    domain: 'adv',
    domainLabel: 'Advisory',
    urgency: 'normal',
    title: 'Robert Chen — Estate Planning',
    subtitle: 'Business Succession + NQDC · In Person · 90 min',
    objective: 'Deep-dive estate planning session for Chen Holdings. Present business succession buy-sell agreement, NQDC plan, and beneficiary update for existing policies.',
    clientSnapshot: {
      age: 45, segment: 'High Value', policies: 4, premium: '$21,000/yr',
      lastContact: '2026-04-10 (Claim call)', score: 96,
      notes: 'Death benefit claim CLM-2026-0041 in process ($1M). Chen Holdings ~$4M valuation. No buy-sell agreement. NQDC opportunity identified. Referred estate attorney contact.'
    },
    aiAlerts: [
      { icon: 'fa-building', color: '#7c3aed', text: 'Chen Holdings $4M valuation — buy-sell agreement would require $2M+ key-person life.' },
      { icon: 'fa-file-invoice-dollar', color: '#2563eb', text: 'NQDC plan: defer $80K+/yr in executive compensation — significant tax advantage.' },
      { icon: 'fa-heart', color: '#dc2626', text: 'Note: Robert Chen passed away — this meeting is with business partner / estate. Adjust approach.' }
    ],
    talkingPoints: [
      'Business succession: present buy-sell agreement structure funded by life insurance',
      'Key-person life insurance: $2M for Chen Holdings continuity',
      'NQDC plan: executive income deferral for remaining business partners',
      'Estate update: confirm beneficiary on all 4 existing policies',
      'Investment portfolio: $180K AUM consolidation opportunity with NYL'
    ],
    documents: ['Business valuation summary (Chen Holdings)', 'Buy-sell agreement template', 'NQDC plan overview', 'Beneficiary update forms', 'Investment consolidation proposal'],
    prepNotes: 'This meeting is post-claim — approach sensitively. Business partners may want to discuss coverage needs now that Robert has passed. Focus on protecting the business and the estate.'
  },

  'MTG-008': {
    type: 'pre',
    client: 'Sandra Williams',
    initials: 'SW',
    date: 'Apr 28, 2026',
    time: '2:00 PM',
    duration: '60 min',
    format: 'In Person',
    domain: 'ins',
    domainLabel: 'Insurance',
    urgency: 'renewal',
    title: 'Sandra Williams — Policy Renewal',
    subtitle: 'P-100320 Term Renewal · In Person · 60 min',
    objective: 'Critical renewal meeting for 20-year Term Life P-100320 expiring Sep 2026. Present conversion options (WL/UL) and retention strategy.',
    clientSnapshot: {
      age: 61, segment: 'Mid Market', policies: 2, premium: '$8,200/yr',
      lastContact: '2026-03-20', score: 71,
      notes: 'HIGH retention risk. Term $350K expires Sep 2026 — 5 months. Conversion window closing. Re-qualification at 61 requires new medical underwriting. Spouse Michael Williams is co-beneficiary.'
    },
    aiAlerts: [
      { icon: 'fa-exclamation-triangle', color: '#dc2626', text: '⚡ URGENT: Conversion deadline Sep 15, 2026 — 5 months. Act now or coverage lapses.' },
      { icon: 'fa-exchange-alt', color: '#d97706', text: 'Conversion option: no medical evidence required. WL $350K est. $4,200/yr premium.' },
      { icon: 'fa-home', color: '#2563eb', text: 'Household planning opportunity: invite Michael Williams — joint meeting recommended.' }
    ],
    talkingPoints: [
      '⚡ Explain urgency: Sep 2026 expiry, no medical evidence needed for conversion now',
      'Present WL vs. UL conversion comparison ($350K face value)',
      'Estimated WL premium at age 61: $4,200–$5,100/yr vs. lapsing coverage',
      'Estate value: $350K WL provides lasting protection + cash value for Michael',
      'Invite Michael Williams to the meeting — joint household decision'
    ],
    documents: ['WL conversion illustration ($350K at 61)', 'UL conversion illustration', 'Term renewal notice P-100320', 'Conversion deadline letter'],
    prepNotes: 'Sandra has a moderate relationship score (71). Approach renewal as a protection conversation, not a sales pitch. Stress that conversion avoids medical evidence — key advantage at age 61.'
  },

  // ── PAST MEETINGS (Post-Meeting Summary) ────────────────
  'MTG-P01': {
    type: 'post',
    client: 'Maria Gonzalez',
    initials: 'MG',
    date: 'Apr 5, 2026',
    time: '1:00 PM',
    duration: '45 min',
    format: 'Video Call',
    domain: 'inv',
    domainLabel: 'Investments',
    urgency: 'normal',
    title: 'Maria Gonzalez — Annuity Review',
    subtitle: 'Income Annuity Discussion · Video · 45 min',
    aiSummary: 'Productive meeting. Maria expressed strong interest in a fixed-indexed annuity for retirement income starting age 65. Reviewed accelerated death benefit claim CLM-2026-0028 status — oncologist documentation still pending. Maria is emotionally managing terminal illness diagnosis; meeting tone was compassionate. Key outcome: schedule illustration presentation and coordinate with oncologist on ADB claim.',
    outcomes: [
      { status: 'done', text: 'Reviewed ADB claim CLM-2026-0028 status — pending terminal illness certification from oncologist.' },
      { status: 'done', text: 'Presented fixed-indexed annuity concept — Maria expressed strong interest in $50K–$75K allocation.' },
      { status: 'done', text: 'Discussed Disability Insurance claim CLM-2026-0035 — physician statement still pending from Dr. Hernandez.' },
      { status: 'pending', text: 'Follow up with oncologist office (Dr. Reyes) re: terminal illness certification for ADB claim.' },
      { status: 'pending', text: 'Prepare fixed-indexed annuity illustration for $50K–$75K allocation, income starting age 65.' }
    ],
    followUps: [
      { icon: 'fa-phone', urgency: 'urgent', text: 'Contact oncologist Dr. Reyes: (212) 555-0220 — ADB claim certification. By Apr 10.' },
      { icon: 'fa-file-alt', urgency: 'normal', text: 'Prepare FIA income illustration ($75K, age 65) for next meeting.' },
      { icon: 'fa-calendar-plus', urgency: 'normal', text: 'Schedule follow-up meeting: week of Apr 21 — present FIA illustration.' }
    ],
    sentiment: 'positive',
    sentimentNote: 'Client is emotionally resilient. Appreciative of agent support during claim process. High engagement on annuity discussion.',
    nextMeeting: 'Week of Apr 21, 2026'
  },

  'MTG-P02': {
    type: 'post',
    client: 'Patricia Nguyen',
    initials: 'PN',
    date: 'Apr 3, 2026',
    time: '10:30 AM',
    duration: '30 min',
    format: 'Phone Call',
    domain: 'ins',
    domainLabel: 'Insurance',
    urgency: 'normal',
    title: 'Patricia Nguyen — UL Premium Funding Review',
    subtitle: 'Premium Funding Strategy · Phone · 30 min',
    aiSummary: 'Critical retention call. Patricia confirmed she has been under-funding the Universal Life policy P-100301 for 2 consecutive quarters due to budget constraints (new mortgage). She was unaware of the lapse risk. AI cash-flow model was explained — she agreed to a 3-month catch-up plan of $1,800–$2,400 to restore policy health. Agreed to set up automatic payment. Lapse probability reduced from 94% to <20% if plan followed.',
    outcomes: [
      { status: 'done', text: 'Explained lapse risk: AI model predicts 94% lapse probability by June 20 without action.' },
      { status: 'done', text: 'Presented 3-month catch-up plan: $600–$800/mo additional premium to restore health.' },
      { status: 'done', text: 'Patricia agreed to catch-up plan and auto-payment setup.' },
      { status: 'pending', text: 'Confirm auto-payment setup for $800/mo additional premium for 3 months (starts Apr 15).' },
      { status: 'pending', text: 'Monitor policy funding status — check May 1 cash value against minimum threshold.' }
    ],
    followUps: [
      { icon: 'fa-credit-card', urgency: 'urgent', text: 'Confirm auto-payment $800/mo starting Apr 15 — call Patricia to confirm setup. By Apr 12.' },
      { icon: 'fa-chart-line', urgency: 'normal', text: 'Review cash value on May 1 — confirm recovery trajectory above minimum threshold.' },
      { icon: 'fa-envelope', urgency: 'normal', text: 'Send policy health letter confirming catch-up plan details and new projected standing.' }
    ],
    sentiment: 'concerned',
    sentimentNote: 'Patricia was initially alarmed by the lapse risk but responded positively to the catch-up plan. Expressed gratitude for proactive outreach.',
    nextMeeting: 'May 1, 2026 (monitoring call)'
  },

  'MTG-P03': {
    type: 'post',
    client: 'James Whitfield',
    initials: 'JW',
    date: 'Apr 1, 2026',
    time: '2:00 PM',
    duration: '60 min',
    format: 'In Person',
    domain: 'ret',
    domainLabel: 'Retirement',
    urgency: 'normal',
    title: 'James Whitfield — Initial Retirement Consult',
    subtitle: 'Needs Analysis · In Person · 60 min',
    aiSummary: 'Highly productive initial retirement planning consult. James is 52, targeting retirement at 67. Current policies: 3 (WL + LTC + Term). LTC claim CLM-2026-0033 is in process. Significant retirement income gap identified: estimated $8,500/mo needed vs. $3,200/mo projected from Social Security. Deferred annuity and NQDC plan are the recommended instruments. James is highly engaged and open to comprehensive planning.',
    outcomes: [
      { status: 'done', text: 'Completed full retirement needs analysis: $8,500/mo target income at age 67.' },
      { status: 'done', text: 'Identified $5,300/mo income gap — recommended deferred annuity + NQDC.' },
      { status: 'done', text: 'Reviewed LTC claim CLM-2026-0033 — ADL threshold met, approval expected Apr 15.' },
      { status: 'pending', text: 'Prepare deferred annuity illustration: $85K lump sum → $1,100/mo income at 67.' },
      { status: 'pending', text: 'Coordinate NQDC plan introduction with James\'s employer HR (Apr 18 meeting).' }
    ],
    followUps: [
      { icon: 'fa-file-alt', urgency: 'normal', text: 'Prepare deferred annuity illustration ($85K, income at 67) — for Apr 18 meeting.' },
      { icon: 'fa-briefcase', urgency: 'normal', text: 'Contact James\'s employer HR re: NQDC plan eligibility — by Apr 16.' },
      { icon: 'fa-calendar-check', urgency: 'normal', text: 'Apr 18 meeting confirmed — retirement planning + LTC claim update + annuity illustration.' }
    ],
    sentiment: 'very_positive',
    sentimentNote: 'James is highly engaged and analytical. Very open to comprehensive planning. Excellent long-term client development opportunity.',
    nextMeeting: 'Apr 18, 2026 (confirmed)'
  }
};

// ── OPEN MEETING BRIEF / POST-MEETING MODAL ─────────────────
function openMeetingBrief(mtgId) {
  const mtg = meetingData[mtgId];
  if (!mtg) return;

  const overlay = document.getElementById('meeting-modal-overlay');
  if (!overlay) return;

  // Store current meeting ID
  overlay.dataset.currentMtg = mtgId;

  // Set header
  const iconEl = document.getElementById('mmh-icon');
  const titleEl = document.getElementById('mmh-title');
  const metaEl = document.getElementById('mmh-meta');
  const headerEl = document.getElementById('meeting-modal-header');

  if (mtg.type === 'pre') {
    iconEl.innerHTML = '<i class="fas fa-file-alt"></i>';
    titleEl.textContent = 'Pre-Meeting Brief';
    headerEl.className = 'meeting-modal-header mmh-pre';
  } else {
    iconEl.innerHTML = '<i class="fas fa-clipboard-check"></i>';
    titleEl.textContent = 'Post-Meeting Summary';
    headerEl.className = 'meeting-modal-header mmh-post';
  }

  const formatIcon = mtg.format === 'Video Call' ? 'fa-video' :
                     mtg.format === 'Phone Call' ? 'fa-phone' : 'fa-map-marker-alt';
  metaEl.innerHTML = `<span class="mmh-client-name">${mtg.client}</span>
    <span class="mmh-sep">·</span>
    <i class="fas ${formatIcon}"></i> ${mtg.format}
    <span class="mmh-sep">·</span>
    <i class="fas fa-clock"></i> ${mtg.duration}
    <span class="mmh-sep">·</span>
    <span class="act-domain-pill ${mtg.domain} mmh-domain-pill">${mtg.domainLabel}</span>
    ${mtg.urgency === 'urgent' ? '<span class="urgency-pill urgent-pill">URGENT</span>' : ''}
    ${mtg.urgency === 'renewal' ? '<span class="urgency-pill renewal-pill">RENEWAL</span>' : ''}`;

  // Build tabs
  const tabsEl = document.getElementById('meeting-modal-tabs');
  if (mtg.type === 'pre') {
    tabsEl.innerHTML = `
      <button class="mmtab active" onclick="switchMeetingTab('${mtgId}','brief')">
        <i class="fas fa-user-tie"></i> Client Brief
      </button>
      <button class="mmtab" onclick="switchMeetingTab('${mtgId}','agenda')">
        <i class="fas fa-list-ul"></i> Agenda & Talking Points
      </button>
      <button class="mmtab" onclick="switchMeetingTab('${mtgId}','docs')">
        <i class="fas fa-folder-open"></i> Documents
      </button>`;
  } else {
    tabsEl.innerHTML = `
      <button class="mmtab active" onclick="switchMeetingTab('${mtgId}','summary')">
        <i class="fas fa-robot"></i> AI Summary
      </button>
      <button class="mmtab" onclick="switchMeetingTab('${mtgId}','outcomes')">
        <i class="fas fa-tasks"></i> Outcomes
      </button>
      <button class="mmtab" onclick="switchMeetingTab('${mtgId}','followup')">
        <i class="fas fa-forward"></i> Follow-Ups
      </button>`;
  }

  // Render initial tab
  const firstTab = mtg.type === 'pre' ? 'brief' : 'summary';
  renderMeetingTab(mtgId, firstTab);

  // Footer
  const footerEl = document.getElementById('meeting-modal-footer');
  if (mtg.type === 'pre') {
    footerEl.innerHTML = `
      <button class="btn btn-secondary" onclick="closeMeetingModal()"><i class="fas fa-times"></i> Close</button>
      <button class="btn btn-ai" onclick="sendQuickMessage('Pre-meeting brief for ${mtg.client} on ${mtg.date}')">
        <i class="fas fa-robot"></i> Ask AI About This Meeting
      </button>
      <button class="btn btn-primary" onclick="closeMeetingModal()"><i class="fas fa-check"></i> Ready for Meeting</button>`;
  } else {
    footerEl.innerHTML = `
      <button class="btn btn-secondary" onclick="closeMeetingModal()"><i class="fas fa-times"></i> Close</button>
      <button class="btn btn-ai" onclick="sendQuickMessage('Follow-up actions for ${mtg.client} meeting on ${mtg.date}')">
        <i class="fas fa-robot"></i> AI Action Suggestions
      </button>
      <button class="btn btn-primary" onclick="closeMeetingModal()"><i class="fas fa-calendar-plus"></i> Schedule Follow-up</button>`;
  }

  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// ── SWITCH TAB ──────────────────────────────────────────────
function switchMeetingTab(mtgId, tab) {
  // Update active tab button
  document.querySelectorAll('#meeting-modal-tabs .mmtab').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('onclick').includes(`'${tab}'`)) {
      btn.classList.add('active');
    }
  });
  renderMeetingTab(mtgId, tab);
}

// ── RENDER TAB CONTENT ───────────────────────────────────────
function renderMeetingTab(mtgId, tab) {
  const mtg = meetingData[mtgId];
  const body = document.getElementById('meeting-modal-body');

  if (tab === 'brief') {
    // PRE-MEETING: Client Brief tab
    const cs = mtg.clientSnapshot;
    const alertsHtml = (mtg.aiAlerts || []).map(a => `
      <div class="pmb-alert-row">
        <i class="fas ${a.icon}" style="color:${a.color};min-width:18px"></i>
        <span>${a.text}</span>
      </div>`).join('');
    body.innerHTML = `
      <div class="pmb-tab-content">
        <div class="pmb-section-label"><i class="fas fa-calendar-day"></i> Meeting Details</div>
        <div class="pmb-detail-grid">
          <div class="pmb-detail-item"><span class="pmb-detail-lbl">Date</span><span class="pmb-detail-val">${mtg.date}</span></div>
          <div class="pmb-detail-item"><span class="pmb-detail-lbl">Time</span><span class="pmb-detail-val">${mtg.time}</span></div>
          <div class="pmb-detail-item"><span class="pmb-detail-lbl">Duration</span><span class="pmb-detail-val">${mtg.duration}</span></div>
          <div class="pmb-detail-item"><span class="pmb-detail-lbl">Format</span><span class="pmb-detail-val">${mtg.format}</span></div>
        </div>
        <div class="pmb-objective-box">
          <div class="pmb-section-label"><i class="fas fa-bullseye"></i> Meeting Objective</div>
          <p>${mtg.objective}</p>
        </div>
        ${cs.age ? `
        <div class="pmb-section-label"><i class="fas fa-user"></i> Client Snapshot</div>
        <div class="pmb-client-grid">
          <div class="pmb-cg-item"><span class="pmb-detail-lbl">Age</span><span class="pmb-detail-val">${cs.age}</span></div>
          <div class="pmb-cg-item"><span class="pmb-detail-lbl">Segment</span><span class="pmb-detail-val">${cs.segment}</span></div>
          <div class="pmb-cg-item"><span class="pmb-detail-lbl">Policies</span><span class="pmb-detail-val">${cs.policies}</span></div>
          <div class="pmb-cg-item"><span class="pmb-detail-lbl">Premium</span><span class="pmb-detail-val">${cs.premium}</span></div>
        </div>
        <div class="pmb-client-notes">${cs.notes}</div>` : ''}
        <div class="pmb-section-label"><i class="fas fa-robot"></i> AI Alerts</div>
        <div class="pmb-alerts-box">${alertsHtml}</div>
        ${mtg.prepNotes ? `
        <div class="pmb-prep-box">
          <div class="pmb-section-label"><i class="fas fa-sticky-note"></i> Agent Prep Notes</div>
          <p class="pmb-prep-text">${mtg.prepNotes}</p>
        </div>` : ''}
      </div>`;

  } else if (tab === 'agenda') {
    // PRE-MEETING: Agenda & Talking Points tab
    const pointsHtml = (mtg.talkingPoints || []).map((p, i) => `
      <div class="pmb-tp-row">
        <span class="pmb-tp-num">${i + 1}</span>
        <span class="pmb-tp-text">${p}</span>
      </div>`).join('');
    body.innerHTML = `
      <div class="pmb-tab-content">
        <div class="pmb-section-label"><i class="fas fa-list-ul"></i> Talking Points</div>
        <div class="pmb-tp-list">${pointsHtml}</div>
      </div>`;

  } else if (tab === 'docs') {
    // PRE-MEETING: Documents tab
    const docsHtml = (mtg.documents || []).map(d => {
      const isDone = d.includes('✅');
      const isPending = d.includes('⏳');
      return `<div class="pmb-doc-row ${isDone ? 'doc-ready' : isPending ? 'doc-pending' : 'doc-prepare'}">
        <i class="fas ${isDone ? 'fa-check-circle' : isPending ? 'fa-hourglass-half' : 'fa-file-alt'}" 
           style="color:${isDone ? '#16a34a' : isPending ? '#d97706' : '#6366f1'}"></i>
        <span>${d}</span>
      </div>`;
    }).join('');
    body.innerHTML = `
      <div class="pmb-tab-content">
        <div class="pmb-section-label"><i class="fas fa-folder-open"></i> Documents & Materials</div>
        <div class="pmb-docs-list">${docsHtml}</div>
      </div>`;

  } else if (tab === 'summary') {
    // POST-MEETING: AI Summary tab
    const sentimentColor = mtg.sentiment === 'very_positive' ? '#16a34a' :
                           mtg.sentiment === 'positive' ? '#2563eb' :
                           mtg.sentiment === 'concerned' ? '#d97706' : '#6b7280';
    const sentimentLabel = mtg.sentiment === 'very_positive' ? 'Very Positive' :
                           mtg.sentiment === 'positive' ? 'Positive' :
                           mtg.sentiment === 'concerned' ? 'Concerned' : 'Neutral';
    body.innerHTML = `
      <div class="pmb-tab-content">
        <div class="pmb-ai-summary-box">
          <div class="pmb-ai-header"><i class="fas fa-robot"></i> AI Meeting Summary</div>
          <p class="pmb-ai-text">${mtg.aiSummary}</p>
        </div>
        <div class="pmb-sentiment-row">
          <div class="pmb-section-label"><i class="fas fa-smile"></i> Client Sentiment</div>
          <div class="pmb-sentiment-badge" style="background:${sentimentColor}20;color:${sentimentColor};border:1px solid ${sentimentColor}40">
            ${sentimentLabel}
          </div>
          <p class="pmb-sentiment-note">${mtg.sentimentNote}</p>
        </div>
        <div class="pmb-detail-grid" style="margin-top:12px">
          <div class="pmb-detail-item"><span class="pmb-detail-lbl">Date</span><span class="pmb-detail-val">${mtg.date}</span></div>
          <div class="pmb-detail-item"><span class="pmb-detail-lbl">Duration</span><span class="pmb-detail-val">${mtg.duration}</span></div>
          <div class="pmb-detail-item"><span class="pmb-detail-lbl">Format</span><span class="pmb-detail-val">${mtg.format}</span></div>
          <div class="pmb-detail-item"><span class="pmb-detail-lbl">Next Meeting</span><span class="pmb-detail-val">${mtg.nextMeeting || 'TBD'}</span></div>
        </div>
      </div>`;

  } else if (tab === 'outcomes') {
    // POST-MEETING: Outcomes tab
    const outcomesHtml = (mtg.outcomes || []).map(o => `
      <div class="pmb-outcome-row ${o.status === 'done' ? 'outcome-done' : 'outcome-pending'}">
        <i class="fas ${o.status === 'done' ? 'fa-check-circle' : 'fa-clock'}"
           style="color:${o.status === 'done' ? '#16a34a' : '#d97706'};min-width:18px"></i>
        <span>${o.text}</span>
      </div>`).join('');
    body.innerHTML = `
      <div class="pmb-tab-content">
        <div class="pmb-section-label"><i class="fas fa-tasks"></i> Meeting Outcomes</div>
        <div class="pmb-outcomes-list">${outcomesHtml}</div>
      </div>`;

  } else if (tab === 'followup') {
    // POST-MEETING: Follow-ups tab
    const fuHtml = (mtg.followUps || []).map(fu => `
      <div class="pmb-fu-row ${fu.urgency === 'urgent' ? 'fu-urgent' : ''}">
        <i class="fas ${fu.icon}" style="color:${fu.urgency === 'urgent' ? '#dc2626' : '#6366f1'};min-width:18px"></i>
        <span>${fu.text}</span>
        ${fu.urgency === 'urgent' ? '<span class="fu-urgent-tag">URGENT</span>' : ''}
      </div>`).join('');
    body.innerHTML = `
      <div class="pmb-tab-content">
        <div class="pmb-section-label"><i class="fas fa-forward"></i> Required Follow-Up Actions</div>
        <div class="pmb-fu-list">${fuHtml}</div>
      </div>`;
  }
}

// ── CLOSE MODAL ──────────────────────────────────────────────
function closeMeetingModal(event) {
  if (event && event.target !== document.getElementById('meeting-modal-overlay')) return;
  const overlay = document.getElementById('meeting-modal-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════════════════════════
   #9  SALES PIPELINE — pipelineData, Quote Calc, Deal Modal
   ═══════════════════════════════════════════════════════════════ */

const pipelineData = {
  D001: {
    client: 'Alex Rivera', product: 'Whole Life — $500K', stage: 'Prospect',
    value: '$4,800/yr', commission: '$576', aiScore: 82, probability: '82%',
    domain: 'ins', lastContact: 'Apr 12 · In-person meeting scheduled',
    aiInsight: 'Alex is a strong WL candidate — referral from Michael Santos. Key objection: premium vs. term. Lead with cash value accumulation story. Annuity upsell potential noted.',
    nextAction: 'Send pre-meeting brief; highlight living benefits rider',
    timeline: [
      { date: 'Apr 2', event: 'Referred by Michael Santos' },
      { date: 'Apr 8', event: 'Phone intro — 20 min, high engagement' },
      { date: 'Apr 12', event: 'In-person prospect meeting' }
    ]
  },
  D002: {
    client: 'Nancy Foster', product: 'Term Life — $1M', stage: 'Prospect',
    value: '$3,200/yr', commission: '$384', aiScore: 61, probability: '61%',
    domain: 'ins', lastContact: 'Apr 10 · Online inquiry',
    aiInsight: 'Online inquiry from NYL website. Preferred health class pending credit check. Score 61 — moderate confidence. Increase to 75+ if credit clears. Recommend 20yr term + return-of-premium rider.',
    nextAction: 'Schedule needs analysis call; confirm health history',
    timeline: [
      { date: 'Apr 10', event: 'Online inquiry submitted' },
      { date: 'Apr 10', event: 'Auto-response sent; follow-up scheduled' }
    ]
  },
  D003: {
    client: 'John Kim', product: 'Disability Insurance', stage: 'Prospect',
    value: '$2,100/yr', commission: '$252', aiScore: 44, probability: '44%',
    domain: 'ins', lastContact: 'Apr 9 · Warm lead via referral',
    aiInsight: 'Diabetes flag requires APS — delays expected. Prior DI claim may increase premium 15-25%. AI score 44 reflects UW complexity. Focus conversation on value of own-occ definition.',
    nextAction: 'Prepare APS request; set expectation on timeline (3-4 weeks)',
    timeline: [
      { date: 'Apr 9', event: 'Referred by Kevin Park' },
      { date: 'Apr 11', event: 'Initial call — needs analysis scheduled' }
    ]
  },
  D004: {
    client: 'Michael Santos', product: 'Universal Life — $750K', stage: 'Quoted',
    value: '$6,400/yr', commission: '$896', aiScore: 91, probability: '91%',
    domain: 'ins', lastContact: 'Apr 11 · Quote sent via email',
    aiInsight: 'HOT deal — 91% close probability. Lab results pending (expected Apr 14). Client reviewed quote, asked about paid-up additions. AI recommends: call Apr 14 post-lab, reinforce retirement accumulation + guaranteed DB. No objections logged.',
    nextAction: 'Call Apr 14 after lab results — confirm policy delivery timeline',
    timeline: [
      { date: 'Mar 28', event: 'Initial needs analysis' },
      { date: 'Apr 5', event: 'Medical exam completed' },
      { date: 'Apr 11', event: 'Quote delivered — $6,400/yr UL $750K' }
    ]
  },
  D005: {
    client: 'Julia Chen', product: 'Deferred Annuity', stage: 'Quoted',
    value: '$8,000/yr', commission: '$640', aiScore: 73, probability: '73%',
    domain: 'inv', lastContact: 'Apr 10 · Quote under review',
    aiInsight: 'Deferred annuity for tax-advantaged retirement income. Julia is reviewing the illustration. Key talking points: tax deferral on growth, guaranteed income floor, step-up death benefit. Objection anticipated: liquidity. Address with 10% free withdrawal provision.',
    nextAction: 'Follow up Apr 15 — offer income illustration with two scenarios',
    timeline: [
      { date: 'Apr 3', event: 'Retirement gap analysis completed' },
      { date: 'Apr 10', event: 'Annuity illustration delivered' }
    ]
  },
  D006: {
    client: 'Thomas Wright', product: 'Whole Life — $1M', stage: 'Underwriting',
    value: '$9,600/yr', commission: '$1,152', aiScore: 88, probability: '88%',
    domain: 'ins', lastContact: 'Apr 9 · Medical exam completed',
    aiInsight: 'Medical exam done — UW decision expected Apr 16. No major flags. AI STP score 88 — likely Preferred class. Prepare e-delivery package now so you can deliver same day as approval. Commission: $1,152 — top deal this month.',
    nextAction: 'Prepare e-delivery package; alert client to expect decision Apr 16',
    timeline: [
      { date: 'Mar 20', event: 'Application submitted' },
      { date: 'Apr 1', event: 'APS ordered — received Apr 7' },
      { date: 'Apr 9', event: 'Medical exam completed' },
      { date: 'Apr 16', event: 'Expected UW decision' }
    ]
  },
  D007: {
    client: 'Grace Lee', product: 'VUL — $250K', stage: 'Underwriting',
    value: '$3,800/yr', commission: '$456', aiScore: 69, probability: '69%',
    domain: 'ins', lastContact: 'Apr 8 · In UW review',
    aiInsight: 'VUL case in UW review. APS received. AI score 69 — Standard Plus likely. Sub-account selection discussion needed post-approval. Client is risk-aware; recommend balanced allocation (55% equity / 45% fixed).',
    nextAction: 'Check UW status; prepare sub-account selection worksheet',
    timeline: [
      { date: 'Mar 25', event: 'Application submitted' },
      { date: 'Apr 3', event: 'APS requested' },
      { date: 'Apr 8', event: 'APS received — in UW review' }
    ]
  },
  D008: {
    client: 'Kevin Park', product: 'Term Life — $500K', stage: 'Approved',
    value: '$1,800/yr', commission: '$216', aiScore: 95, probability: '95%',
    domain: 'ins', lastContact: 'Apr 13 · Awaiting e-signature',
    aiInsight: 'APPROVED — Preferred Plus. E-signature pending. AI score 95. Send signature reminder TODAY. Policy delivery window: 2 days post-signature. Upsell opportunity: add $500K accidental death rider ($120/yr) at point of delivery.',
    nextAction: 'Send DocuSign reminder immediately — deal at risk of going cold',
    timeline: [
      { date: 'Apr 1', event: 'Application submitted' },
      { date: 'Apr 8', event: 'Approved — Preferred Plus' },
      { date: 'Apr 13', event: 'E-signature request sent' }
    ]
  },
  D009: {
    client: 'Linda Morrison', product: 'UMA — $280K AUM', stage: 'Approved',
    value: '$2,800/yr fee', commission: '$280', aiScore: 90, probability: '90%',
    domain: 'adv', lastContact: 'Apr 13 · Docs signed, transfer pending',
    aiInsight: 'UMA account docs signed. Account transfer from Fidelity pending (5-7 business days). AI score 90. After transfer: run full portfolio analysis, propose rebalancing, and schedule 90-day review. Estate plan + NQDC discussion next.',
    nextAction: 'Initiate ACAT transfer form; schedule 90-day review call for May 15',
    timeline: [
      { date: 'Mar 15', event: 'Advisory review — UMA opportunity identified' },
      { date: 'Apr 1', event: 'UMA proposal presented: $280K' },
      { date: 'Apr 13', event: 'Account application signed' }
    ]
  }
};

/* ── Quote Calculator ── */
const quoteRates = {
  term:   { base: 0.0032, healthMult: { pp:0.80, p:1.00, sp:1.18, s:1.35 }, ageFactor: 0.038 },
  wl:     { base: 0.012,  healthMult: { pp:0.82, p:1.00, sp:1.20, s:1.40 }, ageFactor: 0.042 },
  ul:     { base: 0.0085, healthMult: { pp:0.81, p:1.00, sp:1.19, s:1.38 }, ageFactor: 0.040 },
  vul:    { base: 0.0095, healthMult: { pp:0.83, p:1.00, sp:1.22, s:1.42 }, ageFactor: 0.041 },
  ltc:    { base: 0.024,  healthMult: { pp:0.85, p:1.00, sp:1.25, s:1.50 }, ageFactor: 0.055 },
  di:     { base: 0.018,  healthMult: { pp:0.83, p:1.00, sp:1.22, s:1.45 }, ageFactor: 0.044 },
  fa:     { base: 0.006,  healthMult: { pp:1.00, p:1.00, sp:1.00, s:1.00 }, ageFactor: 0.010 },
  va:     { base: 0.007,  healthMult: { pp:1.00, p:1.00, sp:1.00, s:1.00 }, ageFactor: 0.010 }
};
const productLabels = { term:'Term Life', wl:'Whole Life', ul:'Universal Life', vul:'Variable UL', ltc:'Long-term Care', di:'Disability Ins.', fa:'Fixed Annuity', va:'Variable Annuity' };
const commissionRates = { term:0.12, wl:0.55, ul:0.14, vul:0.16, ltc:0.30, di:0.30, fa:0.08, va:0.07 };

function runQuoteCalc() {
  const age      = parseInt(document.getElementById('qq-age')?.value) || 42;
  const product  = document.getElementById('qq-product')?.value || 'term';
  const coverage = parseInt(document.getElementById('qq-coverage')?.value) || 500000;
  const health   = document.getElementById('qq-health')?.value || 'p';
  const gender   = document.getElementById('qq-gender')?.value || 'm';

  const r = quoteRates[product];
  const genderAdj = gender === 'f' ? 0.92 : 1.00;
  const agePenalty = Math.max(0, (age - 35) * r.ageFactor);
  const rawRate = (r.base + agePenalty) * r.healthMult[health] * genderAdj;
  const annualLow  = Math.round(coverage * rawRate / 100) * 100;
  const annualHigh = Math.round(annualLow * 1.12 / 100) * 100;
  const commEst    = Math.round(annualLow * commissionRates[product]);

  const fmt = n => '$' + n.toLocaleString();
  document.getElementById('qq-result-val').textContent = `${fmt(annualLow)} — ${fmt(annualHigh)} / yr`;
  document.getElementById('qq-result-note').innerHTML =
    `Based on <strong>${productLabels[product]}</strong>, age <strong>${age}</strong>, ` +
    `${health === 'pp' ? 'Preferred Plus' : health === 'p' ? 'Preferred' : health === 'sp' ? 'Standard Plus' : 'Standard'} health, ` +
    `${coverage === 100000 ? '$100K' : coverage === 250000 ? '$250K' : coverage === 500000 ? '$500K' : coverage === 1000000 ? '$1M' : '$2M'} coverage. ` +
    `Final rate subject to full underwriting.`;
  const breakdownEl = document.getElementById('qq-breakdown');
  if (breakdownEl) {
    breakdownEl.innerHTML = `
      <div class="qr-bd-row"><span>Base Rate</span><span>${(rawRate*100).toFixed(3)}%</span></div>
      <div class="qr-bd-row"><span>Est. Commission</span><span class="green">${fmt(commEst)}</span></div>
      <div class="qr-bd-row"><span>Monthly Premium</span><span>${fmt(Math.round(annualLow/12))} — ${fmt(Math.round(annualHigh/12))}</span></div>
      <div class="qr-bd-row"><span>Commission Rate</span><span>${(commissionRates[product]*100).toFixed(0)}%</span></div>
    `;
  }
  const resultEl = document.getElementById('quote-result');
  if (resultEl) { resultEl.style.display = 'block'; resultEl.classList.add('qr-animate'); }
}

function runAIQuote() {
  runQuoteCalc();
  const product = productLabels[document.getElementById('qq-product')?.value || 'term'];
  const age     = document.getElementById('qq-age')?.value || '42';
  const name    = document.getElementById('qq-name')?.value || 'this prospect';
  sendContextMessage(`AI Quote analysis for ${name} — ${product}, age ${age}. Show personalized recommendations, rider options, and competitive positioning.`, 'smart-advisor');
}

/* ── Deal Modal ── */
function openDealModal(dealId) {
  const d = pipelineData[dealId];
  if (!d) return;
  const overlay = document.getElementById('deal-modal-overlay');
  const header  = document.getElementById('deal-modal-header');
  const body    = document.getElementById('deal-modal-body');
  if (!overlay || !body) return;

  const domainColor = { ins:'#003087', inv:'#059669', ret:'#d97706', adv:'#7c3aed' };
  const scoreColor  = d.aiScore >= 80 ? '#16a34a' : d.aiScore >= 60 ? '#d97706' : '#dc2626';
  const stageColors = { Prospect:'#64748b', Quoted:'#2563eb', Underwriting:'#d97706', Approved:'#16a34a', 'Closed Won':'#003087' };

  if (header) {
    header.style.background = `linear-gradient(135deg, ${domainColor[d.domain]||'#003087'} 0%, #1e40af 100%)`;
    document.getElementById('deal-modal-client').textContent  = d.client;
    document.getElementById('deal-modal-product').textContent = d.product;
  }

  const timelineHTML = (d.timeline||[]).map(t =>
    `<div class="dm-tl-row"><span class="dm-tl-date">${t.date}</span><span class="dm-tl-event">${t.event}</span></div>`
  ).join('');

  body.innerHTML = `
    <div class="dm-meta-grid">
      <div class="dm-meta-item"><span class="dm-meta-lbl">Stage</span><span class="dm-stage-pill" style="background:${stageColors[d.stage]||'#64748b'}">${d.stage}</span></div>
      <div class="dm-meta-item"><span class="dm-meta-lbl">Annual Value</span><span class="dm-meta-val">${d.value}</span></div>
      <div class="dm-meta-item"><span class="dm-meta-lbl">Est. Commission</span><span class="dm-meta-val green">${d.commission}</span></div>
      <div class="dm-meta-item"><span class="dm-meta-lbl">AI Close Probability</span><span class="dm-score-val" style="color:${scoreColor}">${d.probability} · Score ${d.aiScore}</span></div>
    </div>
    <div class="dm-section">
      <div class="dm-section-title"><i class="fas fa-robot"></i> AI Insight</div>
      <div class="dm-ai-insight">${d.aiInsight}</div>
    </div>
    <div class="dm-section">
      <div class="dm-section-title"><i class="fas fa-bolt"></i> Recommended Next Action</div>
      <div class="dm-next-action"><i class="fas fa-arrow-right"></i> ${d.nextAction}</div>
    </div>
    <div class="dm-section">
      <div class="dm-section-title"><i class="fas fa-history"></i> Activity Timeline</div>
      <div class="dm-timeline">${timelineHTML}</div>
    </div>
    <div class="dm-footer-actions">
      <button class="btn btn-ai" onclick="sendContextMessage('Full AI analysis for ${d.client} — ${d.product}, stage ${d.stage}, close probability ${d.probability}. Next best action and objection handling.','smart-advisor')"><i class="fas fa-robot"></i> Ask AI Agent</button>
      <button class="btn btn-primary" onclick="runQuoteCalc()"><i class="fas fa-calculator"></i> Quote</button>
      <button class="btn btn-outline" onclick="closeDealModal()"><i class="fas fa-times"></i> Close</button>
    </div>
  `;
  overlay.style.display = 'flex';
}

function moveDealStage(dealId, newStage) {
  if (pipelineData[dealId]) pipelineData[dealId].stage = newStage;
  const stageLabels = { Prospect:'🔵 Moved to Prospect', Quoted:'📋 Moved to Quoted', Underwriting:'🔬 Moved to Underwriting', Approved:'✅ Moved to Approved', 'Closed Won':'🏆 Closed Won!' };
  const msg = document.createElement('div');
  msg.className = 'stage-toast';
  msg.textContent = stageLabels[newStage] || `Moved to ${newStage}`;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 2800);
}

function closeDealModal(e) {
  if (e && e.target !== document.getElementById('deal-modal-overlay')) return;
  const overlay = document.getElementById('deal-modal-overlay');
  if (overlay) overlay.style.display = 'none';
}

console.log('Sales Pipeline JS loaded — pipelineData(9 deals), runQuoteCalc, openDealModal, moveDealStage');

/* ═══════════════════════════════════════════════════════════════
   #10  HYPERPERSONALIZED OUTREACH HUB
   ═══════════════════════════════════════════════════════════════ */

const outreachData = {
  'OR-001': {
    client: 'Patricia Nguyen', email: 'patricia.n@email.com', phone: '(212) 555-0102',
    segment: 'Mid Market', city: 'Brooklyn', age: 38,
    triggerType: 'lapse', triggerLabel: 'Lapse Risk · 94% probability by June 20',
    outreachType: 'Retention Save', priority: 'urgent', revPotential: '$5,800/yr',
    policies: 'UL $400K (P-100301) + VUL $300K (P-100302)', premium: '$5,800/yr',
    aiRationale: 'Patricia\'s Universal Life policy is projected to lapse with 94% probability by June 20 if premium payments aren\'t increased by $180-220/mo. She has not contacted the office in 42 days — unusually long gap. AI detected 3 missed payment signals. Immediate outreach is critical to save $5,800/yr in premium.',
    goal: 'Retain both UL + VUL policies. Offer payment restructuring or premium holiday. Do NOT mention lapse risk bluntly — frame as a "policy review" and "premium optimization" call.',
    tone: 'warm',
    emailSubject: 'A quick note about your NYL policy, Patricia',
    messages: {
      email: `Dear Patricia,

I hope this message finds you well. I wanted to reach out personally because I've been reviewing your portfolio and noticed an opportunity to optimize your policy structure that could save you money while keeping your coverage strong.

Your Universal Life policy (P-100301) has been performing well, but I'd love to schedule a brief 15-minute call to walk through some premium flexibility options that many of my clients in similar situations have found very helpful.

Life changes — and NYL has options that can flex with you. I'd hate for you to miss out on the protection you've built for your family over the years.

Would Thursday or Friday this week work for a quick call? I'm here to make sure your coverage continues to work for you.

Warm regards,
[Agent Name]
NYL Agent · (212) 555-0000`,
      sms: `Hi Patricia, it's [Agent Name] from NYL. I've been reviewing your policy and have some options to share that could help — quick 10-min call this week? Reply YES and I'll send you a calendar link.`,
      call: `CALL SCRIPT — Patricia Nguyen (Retention)

Opening: "Hi Patricia, this is [Agent Name] from New York Life. I was reviewing my client portfolios this week and wanted to reach out personally because I spotted a few opportunities to optimize your coverage while potentially reducing your out-of-pocket costs."

Key Points:
• Premium flexibility options available on her UL policy
• Policy review — "making sure your coverage still fits your life"
• Do NOT mention lapse — frame as proactive service

Objection — "I'm busy": "Totally understand — even 10 minutes could save you hundreds this year. Would a quick call tomorrow morning work?"

Close: Schedule call or in-person meeting.`
    }
  },

  'OR-002': {
    client: 'Sandra Williams', email: 'sandra.w@email.com', phone: '(718) 555-0104',
    segment: 'Mid Market', city: 'Queens', age: 61,
    triggerType: 'renewal', triggerLabel: 'Term expiring in 153 days · Conversion window',
    outreachType: 'Conversion Upsell', priority: 'urgent', revPotential: '$8,200/yr',
    policies: 'Term $350K expiring 2026 (P-100320) + LTC $180K (P-100321)', premium: '$8,200/yr',
    aiRationale: 'Sandra\'s 20-year term policy (P-100320, face value $350K) expires in 153 days. She is 61 — beyond the standard term re-issue age — making conversion to Whole Life or Universal Life the best option. Revenue potential: $8,200/yr if converted. Estimated commission: $1,000+. Conversion window closes at policy expiry.',
    goal: 'Convert term to permanent coverage before expiry. Lead with the "coverage gap" risk she faces at 61 without permanent insurance. Secondary pitch: Immediate Income Annuity for retirement income.',
    tone: 'urgent',
    emailSubject: 'Important: Your term policy expires in 5 months — let\'s talk options',
    messages: {
      email: `Dear Sandra,

I'm writing with some important news about your New York Life policy (P-100320).

Your 20-year term life insurance policy is scheduled to expire in approximately 153 days. At 61, with your family depending on your coverage, this is a time-sensitive decision that I don't want you to miss.

The good news: You have guaranteed conversion rights to permanent life insurance — no new medical exam required. This means you can lock in lifetime coverage regardless of any health changes since 2006.

Here's why this matters:
✓ Permanent coverage for life — no more renewal risk
✓ Cash value that builds tax-deferred
✓ No medical underwriting required — guaranteed issue

I'd love to prepare a personalized illustration showing you exactly what conversion would look like for your budget. Can we schedule 20 minutes this week?

Please don't let this window close — once the policy lapses, you lose these guaranteed rights permanently.

Best regards,
[Agent Name]
NYL Agent · (718) 555-0000`,
      sms: `Sandra, this is [Agent Name] from NYL. Your term policy expires in 153 days — at 61, this is critical to address. You have guaranteed conversion rights with no medical exam. Can we talk this week? Reply YES for a callback.`,
      call: `CALL SCRIPT — Sandra Williams (Term Conversion)

Opening: "Sandra, I'm calling about your term policy that expires in about 5 months. I want to make sure you're aware of your options before that window closes."

Key Points:
• Guaranteed conversion — no medical exam
• At age 61, reissuing a new term is expensive or unavailable
• Permanent coverage locks in her current insurability
• Potential annuity income discussion (secondary)

Urgency: Conversion rights expire WITH the policy.

Close: Offer to send illustration, schedule follow-up.`
    }
  },

  'OR-003': {
    client: 'Kevin Park', email: 'kevin.p@email.com', phone: '(212) 555-0107',
    segment: 'Emerging', city: 'Jersey City', age: 29,
    triggerType: 'lifecycle', triggerLabel: 'E-Signature pending 2 days',
    outreachType: 'Close Deal', priority: 'urgent', revPotential: '$1,800/yr',
    policies: 'Term $500K pending (P-100350)', premium: '$1,800/yr',
    aiRationale: 'Kevin\'s Term Life application is APPROVED (Preferred Plus) and e-signature has been pending for 2 days. AI close probability: 95%. Every day of delay risks deal going cold. Short, direct SMS outreach is the highest-converting channel for his age (29) and tech profile.',
    goal: 'Get e-signature completed today. Remove friction — offer DocuSign link directly. Keep message short and action-focused.',
    tone: 'urgent',
    emailSubject: 'Action needed: Your NYL policy is approved and ready to sign',
    messages: {
      email: `Hi Kevin,

Great news — your New York Life Term Life Insurance policy has been approved at Preferred Plus rates!

Your policy is all set and ready for your electronic signature. This takes less than 2 minutes.

👉 Sign here: [DocuSign Link]

Once signed, your $500,000 in coverage activates immediately — protecting your family starting today.

Let me know if you have any questions. I'm here to help!

[Agent Name]
NYL Agent`,
      sms: `Kevin — your NYL $500K policy is APPROVED! Just needs your e-signature (2 min). Sign here: [link]. Coverage starts the moment you sign. Any questions? Call me: [Agent Name]`,
      call: `CALL SCRIPT — Kevin Park (E-Signature Close)

Opening: "Hi Kevin, [Agent Name] from NYL. Quick call — your Term Life policy just got approved at our best Preferred Plus rate. I just need your e-signature and you're covered."

Key Points:
• Policy is fully approved — no delays
• Coverage $500K starts immediately upon signature
• Takes 2 minutes via DocuSign

Objection — "I'll do it later": "I completely understand — want me to text you the link right now while we're on the phone?"

Close: Send DocuSign link via text immediately.`
    }
  },

  'OR-004': {
    client: 'Linda Morrison', email: 'linda.m@email.com', phone: '(718) 555-0108',
    segment: 'Premium', city: 'Long Island', age: 56,
    triggerType: 'portfolio', triggerLabel: 'UMA Transfer + Estate Review due',
    outreachType: 'Cross-Sell', priority: 'high', revPotential: '$2,800/yr fee',
    policies: 'WL $2M + LTC $300K + VUL $1.5M + UMA $280K + Estate Plan', premium: '$32,000/yr',
    aiRationale: 'Linda is the #1 client by portfolio value ($812K). UMA account transfer from Fidelity is in progress. Estate plan review is due — attorney contact (David Kaufman) is on file. NQDC plan opportunity flagged. Cross-sell probability: 90%. This is the most valuable client relationship in the book.',
    goal: 'Confirm UMA transfer timeline, schedule estate review, introduce NQDC concept. Tone: white-glove, consultative — she expects premium service.',
    tone: 'professional',
    emailSubject: 'Your portfolio update + upcoming estate review — Linda',
    messages: {
      email: `Dear Linda,

I hope you're well. I wanted to reach out with a brief update on a few items across your portfolio.

Your Unified Managed Account transfer is progressing smoothly and should be fully complete within the next 5-7 business days. Once settled, I'll have a comprehensive portfolio analysis ready — including updated sub-account allocations and a Q2 rebalancing proposal.

I also wanted to flag that your annual estate plan review is coming due. I've already coordinated with David Kaufman's office to schedule a joint review call — would the week of April 21 work for you?

Finally, given your executive compensation structure, I'd like to introduce a new planning concept at our next meeting that some of my clients in similar positions have found highly valuable. I think it could meaningfully impact your long-term tax position.

As always, thank you for the trust you place in me and NYL. I look forward to our continued work together.

Best regards,
[Agent Name]
NYL Senior Agent · (718) 555-0000`,
      sms: `Linda, [Agent Name] here. Your UMA transfer is on track (5-7 days). I'll send a full update by end of week. Also coordinating your estate review — does week of Apr 21 work? Thanks!`,
      call: `CALL SCRIPT — Linda Morrison (Premium Client)

Opening: "Linda, [Agent Name] from NYL. Just calling to personally update you on your portfolio and talk through a couple of planning items."

Key Points:
• UMA transfer progress — reassure timeline
• Estate review scheduling — David Kaufman coordination
• NQDC planning concept introduction (keep high-level)

Tone: Consultative, unhurried, white-glove service.

Close: Confirm estate review date, send calendar invite.`
    }
  },

  'OR-005': {
    client: 'Robert Chen', email: 'robert.c@email.com', phone: '(212) 555-0103',
    segment: 'High Value', city: 'Manhattan', age: 45,
    triggerType: 'portfolio', triggerLabel: 'Estate Plan + NQDC Review Due',
    outreachType: 'Advisory', priority: 'high', revPotential: '$2,000/yr',
    policies: 'WL $1M + VUL $800K + Business Services + NQDC', premium: '$21,000/yr',
    aiRationale: 'Robert has a complex business owner profile — Key-Person Life, Buy-Sell agreement, NQDC plan. Annual review is overdue. Business succession planning is the primary opportunity. Cross-sell: additional buy-sell funding + split-dollar arrangement potential.',
    goal: 'Schedule annual business review. Lead with business succession — buy-sell adequacy ($500K vs. current valuation). Introduce split-dollar opportunity.',
    tone: 'professional',
    emailSubject: 'Annual Business Insurance Review — Robert Chen',
    messages: {
      email: `Dear Robert,

As your business continues to grow, I wanted to schedule our annual review to make sure your business protection structure keeps pace.

A few areas I'd like to cover:

1. Buy-Sell Agreement Funding — We should verify that your $500K Key-Person policy still adequately reflects your business valuation. Businesses like yours often see significant value increases year-over-year.

2. NQDC Plan Update — Your deferred compensation balance ($150K) warrants a review of investment sub-account allocations and distribution planning.

3. New Opportunity — I'd like to introduce a split-dollar arrangement that several of my business-owner clients have used to fund buy-sell agreements more tax-efficiently.

Would a lunch meeting work for you — perhaps the week of April 21? I can bring the updated illustrations.

Best regards,
[Agent Name]
NYL Agent`,
      sms: `Robert, [Agent Name] here. Time for your annual business review — buy-sell adequacy + NQDC update. New planning idea to share too. Lunch week of Apr 21? Let me know.`,
      call: `CALL SCRIPT — Robert Chen (Business Review)

Opening: "Robert, [Agent Name]. I wanted to schedule our annual business insurance review — your buy-sell agreement needs a valuation check and I have a new planning idea I think you'll find very interesting."

Key Points:
• Buy-sell funding adequacy vs. current business value
• NQDC allocation review
• Split-dollar arrangement introduction

Close: Schedule lunch meeting for week of Apr 21.`
    }
  },

  'OR-006': {
    client: 'James Whitfield', email: 'james.w@email.com', phone: '(212) 555-0101',
    segment: 'High Value', city: 'New York', age: 52,
    triggerType: 'lifecycle', triggerLabel: 'Retirement income gap $8,500/mo identified',
    outreachType: 'Retirement Planning', priority: 'mid', revPotential: '$4,800/yr',
    policies: 'WL $500K + Term $750K + LTC $250K + Estate Plan', premium: '$12,400/yr',
    aiRationale: 'James had a retirement planning session (Apr 18). Income gap identified: $8,500/mo needed vs. $3,200/mo projected. Deferred annuity + NQDC are the recommended instruments. He is highly engaged. Follow-up with illustration within 48 hours of meeting — highest conversion probability.',
    goal: 'Send deferred annuity illustration post-meeting. Personalize with his specific numbers ($8,500 target, age 67 retirement). Create urgency around illustration timing.',
    tone: 'professional',
    emailSubject: 'Your retirement income illustration — as promised, James',
    messages: {
      email: `Dear James,

Thank you for the excellent meeting on April 18 — I always enjoy our planning conversations.

As promised, I'm attaching your personalized retirement income illustration based on the goals we discussed:

• Target income at age 67: $8,500/month
• Projected Social Security: $3,200/month
• Income gap to fill: $5,300/month

The deferred annuity scenario I've modeled shows that a $6,400/yr contribution starting this year would generate approximately $2,900/mo in guaranteed lifetime income — significantly closing your gap.

I've also included a NQDC plan scenario given your current income level, which could provide additional tax-advantaged accumulation.

I'd love to walk through these numbers with you in detail. Would a 30-minute call next week work?

Best regards,
[Agent Name]
NYL Agent`,
      sms: `James, [Agent Name] here. Just sent your retirement illustration to your email — the deferred annuity numbers look great. Quick call next week to walk through it? Let me know!`,
      call: `CALL SCRIPT — James Whitfield (Retirement Follow-up)

Opening: "James, [Agent Name]. I'm calling to follow up on our retirement planning meeting — I have your personalized illustration ready and the numbers are actually very encouraging."

Key Points:
• Income gap: $5,300/mo to fill
• Deferred annuity: $6,400/yr → $2,900/mo at 67
• NQDC plan as supplementary accumulation vehicle

Close: Schedule illustration walkthrough call.`
    }
  },

  'OR-007': {
    client: 'Maria Gonzalez', email: 'maria.g@email.com', phone: '(917) 555-0106',
    segment: 'High Value', city: 'New York', age: 48,
    triggerType: 'gap', triggerLabel: 'No Advisory Services — gap detected',
    outreachType: 'Cross-Sell', priority: 'mid', revPotential: '$2,400/yr',
    policies: 'UL $600K + DI + Fixed Annuity + Immediate Annuity', premium: '$14,600/yr',
    aiRationale: 'Maria has strong insurance and annuity holdings but zero advisory services despite a $95K investment portfolio. She is 48 — prime age for estate planning. Cross-sell probability: 74%. Estate planning + wealth management introduction would round out her profile and add $2,400/yr in advisory fees.',
    goal: 'Introduce estate planning and investment advisory services. Frame as "completing her financial picture." Offer a complimentary financial review as entry point.',
    tone: 'warm',
    emailSubject: 'Complimentary Financial Review — Maria, you\'re missing one piece',
    messages: {
      email: `Dear Maria,

I've been reviewing your overall financial picture, and I'm genuinely impressed by the foundation you've built — your insurance and annuity portfolio is comprehensive and well-structured.

There's one area I think could make a meaningful difference: estate planning. At 48, with your assets and income, having a formal estate plan — will, trust, and power of attorney — can protect everything you've worked for and ensure it passes to your family exactly as you intend.

I'd love to offer you a complimentary 45-minute Estate Planning Review — no obligation. We'll look at your current situation and I'll show you exactly what a plan would cover and what it would cost.

Would the week of April 21 work for you?

Best regards,
[Agent Name]
NYL Agent`,
      sms: `Hi Maria, [Agent Name] from NYL. I've been thinking about your portfolio — have you considered estate planning? At 48, it could be the most important financial move you make. Free review this month — interested?`,
      call: `CALL SCRIPT — Maria Gonzalez (Estate Planning Cross-Sell)

Opening: "Maria, [Agent Name]. I've been reviewing your portfolio and you're doing really well — but I noticed one area we haven't covered that I think would be very valuable for you."

Key Points:
• Estate planning — will, trust, POA
• At 48, ideal time to establish formal structure
• Free complimentary review as entry point
• Natural progression: estate plan → wealth management

Close: Schedule complimentary estate planning review.`
    }
  },

  'OR-008': {
    client: 'David Thompson', email: 'david.t@email.com', phone: '(646) 555-0105',
    segment: 'Emerging', city: 'Bronx', age: 33,
    triggerType: 'gap', triggerLabel: 'No Investments or Retirement products',
    outreachType: 'Upsell', priority: 'mid', revPotential: '$1,200/yr',
    policies: 'Term $300K only (P-100330)', premium: '$2,400/yr',
    aiRationale: 'David is 33 — young, single policy holder. No investments, no retirement products. Life-stage opportunity: introduce IRA + investment account while he is in accumulation phase. Low revenue today but high lifetime value potential. SMS is highest-response channel for his demographic.',
    goal: 'Introduce investment and retirement accounts. Lead with compound growth story and "starting early" message. Keep it simple and benefit-focused.',
    tone: 'warm',
    emailSubject: 'David, a quick financial tip for your 30s',
    messages: {
      email: `Hi David,

Hope all is well! I was thinking about you this week — you've done a great job getting your life insurance in place early. That's a smart move that a lot of people your age overlook.

I wanted to share something that could make an even bigger impact on your financial future: starting an investment account and IRA in your 30s.

The math is compelling:
• $200/month starting at age 33 → ~$380,000 by age 65 (7% avg return)
• Same amount starting at 43 → ~$180,000

That 10-year head start could be worth $200,000 — just by starting now.

I'd love to spend 20 minutes showing you some simple, low-cost options that fit your budget. Would next week work?

[Agent Name]
NYL Agent`,
      sms: `Hey David, [Agent Name] from NYL. Quick question — are you investing for retirement yet? Starting at 33 vs 43 can mean $200K more by retirement. 20-min chat? Happy to show you some easy options.`,
      call: `CALL SCRIPT — David Thompson (Investment Upsell)

Opening: "David, [Agent Name] here. You're doing great with your term policy — I wanted to share a quick financial opportunity that makes a lot of sense for someone your age."

Key Points:
• Investment + IRA — compound growth story
• Starting at 33 vs. 43 — $200K difference example
• Simple, low-cost options available

Close: Schedule 20-minute investment intro call or virtual meeting.`
    }
  },

  'OR-009': {
    client: 'Alex Rivera', email: 'alex.r@email.com', phone: '(212) 555-0190',
    segment: 'Prospect', city: 'New York', age: 31,
    triggerType: 'lifecycle', triggerLabel: 'Meeting Apr 12 — pre-brief ready',
    outreachType: 'Meeting Prep', priority: 'low', revPotential: '$4,800/yr',
    policies: 'WL $500K prospect', premium: 'Prospect',
    aiRationale: 'Alex has a meeting scheduled Apr 12 for Whole Life $500K. Pre-meeting brief is ready (MTG-001). A personalized pre-meeting email confirms the meeting, sets expectations, and warms the conversation — increasing first-meeting close probability by ~18%.',
    goal: 'Confirm meeting, send agenda, build rapport before the in-person. Keep message brief and excited — first impression is everything.',
    tone: 'warm',
    emailSubject: 'Looking forward to our meeting on April 12, Alex!',
    messages: {
      email: `Hi Alex,

Just a quick note to confirm our meeting on April 12 — I'm really looking forward to it!

I've put together a personalized overview of what we'll cover:

✓ Your current coverage needs and income protection goals
✓ Whole Life Insurance — how it works as both protection AND a financial asset
✓ Cash value growth and living benefits you can access during your lifetime
✓ A customized illustration based on your age and goals

I'll have everything prepared so we can make the most of our time together. Please don't hesitate to reach out beforehand if you have any questions or want to share anything that might help me personalize the conversation.

See you on April 12!

[Agent Name]
NYL Agent`,
      sms: `Hi Alex! [Agent Name] here — just confirming our meeting on April 12. Have some great info prepared for you on Whole Life and what it could mean for your financial picture. See you then! 👋`,
      call: `CALL SCRIPT — Alex Rivera (Meeting Confirmation)

Opening: "Hi Alex, [Agent Name] from NYL. Just calling to confirm our meeting on April 12 and make sure we're all set."

Key Points:
• Meeting confirmation + logistics
• Quick preview of agenda (protection + cash value)
• Any questions or information to share beforehand?

Close: Confirm time/location, send calendar invite.`
    }
  },

  'OR-010': {
    client: 'Michael Santos', email: 'michael.s@email.com', phone: '(646) 555-0120',
    segment: 'Prospect', city: 'New York', age: 38,
    triggerType: 'portfolio', triggerLabel: 'Lab results expected Apr 14',
    outreachType: 'Close Deal', priority: 'low', revPotential: '$6,400/yr',
    policies: 'UL $750K quoted', premium: 'Prospect — $896 commission',
    aiRationale: 'Michael\'s HOT deal (AI score 91%). Lab results expected Apr 14. Proactive outreach the same day as results available maximizes close probability. Email to keep him warm + ready to sign immediately after results confirmed.',
    goal: 'Keep Michael engaged and ready to move fast when lab results confirm approval. Build excitement around the coverage. Prepare him for next step (policy delivery).',
    tone: 'professional',
    emailSubject: 'Quick update on your NYL application, Michael',
    messages: {
      email: `Hi Michael,

I wanted to reach out with a quick update on your Universal Life application.

Your medical exam results are expected back shortly (likely by April 14), and everything looks very promising based on what we've seen so far.

As a reminder, here's what your $750,000 Universal Life policy will do for you:
✓ Lifetime protection for your family — guaranteed
✓ Cash value that grows tax-deferred
✓ Paid-up additions you can access for retirement or emergencies
✓ Flexible premiums that adapt to your financial situation

The moment we receive confirmation, I'll reach out immediately so we can finalize your coverage without any delays. You're very close to having this in place!

In the meantime, please don't hesitate to reach out with any questions.

Best,
[Agent Name]
NYL Agent`,
      sms: `Hi Michael, [Agent Name] here. Lab results expected Apr 14 — everything looks great! I'll call you the moment we get confirmation. Your $750K UL policy is almost yours! 🎉`,
      call: `CALL SCRIPT — Michael Santos (Lab Results Follow-up)

Opening: "Michael, [Agent Name]. Lab results just came back — I'm calling to give you the update and walk through next steps."

Key Points:
• Confirm approval and health class
• Review policy delivery process (e-delivery same day if possible)
• Reiterate key benefits — lifetime protection, cash value
• Disability rider upsell opportunity (+$480/yr)

Close: Confirm e-delivery signature date.`
    }
  }
};

/* ── Active outreach state ── */
let activeOutreachId = null;
let activeOutreachChannel = 'email';

/* ── Toggle Outreach Hub ── */
function toggleOutreachHub() {
  const body = document.getElementById('oh-body');
  const chevron = document.getElementById('oh-chevron');
  if (!body) return;
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  if (chevron) chevron.className = isOpen ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
}

/* ── Open modal from queue row ── */
function openOutreachModal(outreachId) {
  const d = outreachData[outreachId];
  if (!d) return;
  activeOutreachId = outreachId;
  activeOutreachChannel = 'email';
  _renderOutreachModal(d);
}

/* ── Open modal from client card (find matching outreach entry) ── */
function openOutreachModalForClient(clientId) {
  const clientNames = { 1:'James Whitfield', 2:'Patricia Nguyen', 3:'Robert Chen', 4:'Sandra Williams', 5:'David Thompson', 6:'Maria Gonzalez', 7:'Kevin Park', 8:'Linda Morrison' };
  const name = clientNames[clientId];
  const entry = Object.entries(outreachData).find(([,d]) => d.client === name);
  if (entry) {
    openOutreachModal(entry[0]);
  } else {
    // Generate a generic outreach for this client
    const cl = { 1:{n:'James Whitfield',e:'james.w@email.com',seg:'High Value'}, 2:{n:'Patricia Nguyen',e:'patricia.n@email.com',seg:'Mid Market'}, 3:{n:'Robert Chen',e:'robert.c@email.com',seg:'High Value'}, 4:{n:'Sandra Williams',e:'sandra.w@email.com',seg:'Mid Market'}, 5:{n:'David Thompson',e:'david.t@email.com',seg:'Emerging'}, 6:{n:'Maria Gonzalez',e:'maria.g@email.com',seg:'High Value'}, 7:{n:'Kevin Park',e:'kevin.p@email.com',seg:'Emerging'}, 8:{n:'Linda Morrison',e:'linda.m@email.com',seg:'Premium'} }[clientId];
    if (!cl) return;
    const tempData = {
      client: cl.n, email: cl.e, segment: cl.seg,
      triggerLabel: 'General outreach', outreachType: 'Follow-up', priority: 'mid', revPotential: 'TBD',
      policies: 'See client profile', premium: 'See client profile',
      aiRationale: `AI-generated outreach for ${cl.n}. Review client profile for specific opportunities and customize accordingly.`,
      goal: 'Build relationship, identify current needs, offer value.', tone: 'warm',
      emailSubject: `Checking in — ${cl.n.split(' ')[0]}, let's connect`,
      messages: {
        email: `Dear ${cl.n.split(' ')[0]},\n\nI hope you're doing well! I wanted to reach out personally to see how things are going and make sure your coverage is still meeting your needs.\n\nLife changes quickly, and I'd love to schedule a brief 15-minute check-in to make sure everything is optimized for your current situation.\n\nWould this week or next work for a quick call?\n\nBest regards,\n[Agent Name]\nNYL Agent`,
        sms: `Hi ${cl.n.split(' ')[0]}, [Agent Name] from NYL. Quick check-in — how are things? Want to make sure your coverage is still working for you. 15-min call this week?`,
        call: `CALL SCRIPT — ${cl.n}\n\nOpening: "Hi ${cl.n.split(' ')[0]}, [Agent Name] from NYL. Just calling for a quick check-in — wanted to make sure everything is going well and your coverage is still a good fit."\n\nKey Points:\n• Life changes check — new family, income changes, property?\n• Review current coverage adequacy\n• Any service issues to address?\n\nClose: Schedule annual review if appropriate.`
      }
    };
    activeOutreachId = `temp-${clientId}`;
    outreachData[`temp-${clientId}`] = tempData;
    activeOutreachChannel = 'email';
    _renderOutreachModal(tempData);
  }
}

function _renderOutreachModal(d) {
  const overlay = document.getElementById('oc-overlay');
  if (!overlay) return;

  // Header
  const priorityColors = { urgent:'#dc2626', high:'#d97706', mid:'#2563eb', low:'#64748b' };
  const headerEl = document.getElementById('oc-header');
  if (headerEl) headerEl.style.background = `linear-gradient(135deg, ${priorityColors[d.priority]||'#003087'} 0%, #1e3a8a 100%)`;
  const titleEl = document.getElementById('oc-header-title');
  if (titleEl) titleEl.textContent = `AI Outreach — ${d.client}`;
  const subEl = document.getElementById('oc-header-sub');
  if (subEl) subEl.textContent = `${d.outreachType} · ${d.triggerLabel}`;

  // Fields
  const toEl = document.getElementById('oc-to');
  if (toEl) toEl.value = `${d.client} <${d.email}>`;
  const subjEl = document.getElementById('oc-subject');
  if (subjEl) subjEl.value = d.emailSubject || '';
  const bodyEl = document.getElementById('oc-body');
  if (bodyEl) bodyEl.value = d.messages[activeOutreachChannel] || '';

  // Context panel
  const ctxClientEl = document.getElementById('oc-ctx-client');
  if (ctxClientEl) ctxClientEl.innerHTML = `
    <div class="oc-ctx-row"><span>Segment</span><span>${d.segment}</span></div>
    <div class="oc-ctx-row"><span>Policies</span><span>${d.policies}</span></div>
    <div class="oc-ctx-row"><span>Premium</span><span>${d.premium}</span></div>
    <div class="oc-ctx-row"><span>Rev. Potential</span><span class="green">${d.revPotential}</span></div>
    <div class="oc-ctx-row"><span>Trigger</span><span>${d.triggerLabel}</span></div>
  `;
  const ctxAiEl = document.getElementById('oc-ctx-ai');
  if (ctxAiEl) ctxAiEl.textContent = d.aiRationale;
  const ctxGoalEl = document.getElementById('oc-ctx-goal');
  if (ctxGoalEl) ctxGoalEl.innerHTML = `<strong>Goal:</strong> ${d.goal}`;

  // Tone selector
  const toneEl = document.getElementById('oc-tone');
  if (toneEl) toneEl.value = d.tone || 'professional';

  // Channel tabs
  _setActiveChannelTab('email');
  overlay.style.display = 'flex';
}

function switchOutreachChannel(channel) {
  activeOutreachChannel = channel;
  const d = outreachData[activeOutreachId];
  if (!d) return;

  const bodyEl = document.getElementById('oc-body');
  if (bodyEl) bodyEl.value = d.messages[channel] || '';

  const subjectRow = document.getElementById('oc-subject-row');
  if (subjectRow) subjectRow.style.display = channel === 'email' ? 'flex' : 'none';

  _setActiveChannelTab(channel);
}

function _setActiveChannelTab(channel) {
  ['email','sms','call'].forEach(ch => {
    const tab = document.getElementById(`tab-${ch}`);
    if (tab) tab.classList.toggle('active', ch === channel);
  });
}

function insertToken(token) {
  const ta = document.getElementById('oc-body');
  if (!ta) return;
  const start = ta.selectionStart, end = ta.selectionEnd;
  ta.value = ta.value.substring(0, start) + token + ta.value.substring(end);
  ta.selectionStart = ta.selectionEnd = start + token.length;
  ta.focus();
}

function regenOutreachMessage() {
  const d = outreachData[activeOutreachId];
  if (!d) return;
  const tone = document.getElementById('oc-tone')?.value || 'professional';
  // Simulate regeneration with tone prefix
  const tonePrefix = { professional:'', warm:'Hi there! ', urgent:'⚠️ URGENT: ', educational:'Did you know? ' };
  const bodyEl = document.getElementById('oc-body');
  if (bodyEl) {
    const base = d.messages[activeOutreachChannel] || '';
    bodyEl.value = (tonePrefix[tone] || '') + base;
    bodyEl.classList.add('oc-regen-flash');
    setTimeout(() => bodyEl.classList.remove('oc-regen-flash'), 600);
  }
}

function sendOutreach() {
  const d = outreachData[activeOutreachId];
  if (!d) return;
  const channel = activeOutreachChannel;
  closeOutreachModal();
  const toast = document.createElement('div');
  toast.className = 'stage-toast';
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${channel === 'email' ? '📧' : channel === 'sms' ? '💬' : '📞'} ${channel.charAt(0).toUpperCase()+channel.slice(1)} sent to ${d.client}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function scheduleOutreach() {
  const d = outreachData[activeOutreachId];
  if (!d) return;
  closeOutreachModal();
  const toast = document.createElement('div');
  toast.className = 'stage-toast';
  toast.innerHTML = `<i class="fas fa-calendar-check"></i> Outreach to ${d.client} scheduled for tomorrow 9 AM`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function askAIOutreach() {
  const d = outreachData[activeOutreachId];
  if (!d) return;
  closeOutreachModal();
  sendContextMessage(`AI Outreach Strategy for ${d.client} — ${d.outreachType}: ${d.triggerLabel}. Generate optimized ${activeOutreachChannel} message, suggest best send time, and rank this against other outreach priorities.`, 'smart-advisor');
}

function closeOutreachModal(e) {
  if (e && e.target !== document.getElementById('oc-overlay')) return;
  const overlay = document.getElementById('oc-overlay');
  if (overlay) overlay.style.display = 'none';
}

console.log('Outreach Hub JS loaded — outreachData(10), openOutreachModal, switchOutreachChannel, sendOutreach');

/* ═══════════════════════════════════════════════════════════════
   TASK #11 — AUTOMATED CUSTOMER ENROLLMENT / E-APP WIZARD
   ═══════════════════════════════════════════════════════════════ */

/* ── E-App data store (AI-prefilled per application) ── */
const eAppData = {
  'EA-008': {
    id: 'EA-008', dealId: 'D008', uwId: null,
    client: 'Kevin Park', age: 29, dob: '1997-03-14',
    email: 'kevin.p@email.com', phone: '(212) 555-0829',
    address: '420 Lexington Ave, New York, NY 10170',
    ssn: '***-**-4821',
    product: 'Term Life Insurance', productCode: 'term',
    coverage: '$500,000', premium: '$1,800/yr', term: '20 years',
    beneficiary: 'Sarah Park (Spouse)', beneficiaryPct: '100%',
    riders: ['Waiver of Premium Rider', 'Accelerated Death Benefit'],
    healthClass: 'Preferred Plus',
    smoker: 'Non-smoker',
    height: "5'11\"", weight: '172 lbs', bmi: '24.0',
    conditions: 'None disclosed',
    medications: 'None',
    familyHistory: 'No significant history',
    labResults: 'Cholesterol 182, BP 118/76, Blood Glucose 94 — All Normal',
    aiHealthScore: 96,
    aiPrefillPct: 95,
    status: 'Awaiting E-Signature',
    step: 4,
    documents: [
      { name: 'Application Form 1040-NYL', status: 'ai-filled', aiTag: 'AI Filled' },
      { name: 'Health Questionnaire', status: 'ai-filled', aiTag: 'AI Filled' },
      { name: 'Beneficiary Designation', status: 'ai-filled', aiTag: 'AI Filled' },
      { name: 'HIPAA Authorization', status: 'pending', aiTag: 'Needs Signature' },
      { name: 'E-Delivery Consent', status: 'pending', aiTag: 'Needs Signature' }
    ],
    aiInsight: 'Kevin qualifies for Preferred Plus health class. AI detected no MIB flags, clean MVR, and excellent lab results. STP score 95 — recommend immediate e-signature request. Expected time to issue: 2–4 hours.'
  },
  'EA-009': {
    id: 'EA-009', dealId: 'D009', uwId: null,
    client: 'Linda Morrison', age: 56, dob: '1969-11-02',
    email: 'linda.m@email.com', phone: '(212) 555-0856',
    address: '1 World Trade Center, Suite 4200, New York, NY 10007',
    ssn: '***-**-7743',
    product: 'Unified Managed Account (UMA)', productCode: 'uma',
    coverage: '$280,000 AUM', premium: '$2,800/yr fee', term: 'Ongoing',
    beneficiary: 'James Morrison (Son)', beneficiaryPct: '100%',
    riders: ['Discretionary Management', 'Tax-Loss Harvesting', 'ESG Overlay'],
    healthClass: 'N/A — Advisory Product',
    smoker: 'N/A', height: 'N/A', weight: 'N/A', bmi: 'N/A',
    conditions: 'N/A', medications: 'N/A',
    familyHistory: 'N/A',
    labResults: 'N/A — Suitability assessment completed',
    aiHealthScore: null,
    aiPrefillPct: 100,
    status: 'Documents Signed — Ready to Activate',
    step: 5,
    documents: [
      { name: 'UMA Account Application', status: 'signed', aiTag: 'Signed' },
      { name: 'Investment Policy Statement', status: 'signed', aiTag: 'Signed' },
      { name: 'Suitability Questionnaire', status: 'ai-filled', aiTag: 'AI Filled' },
      { name: 'Fee Disclosure ADV Part 2', status: 'signed', aiTag: 'Signed' },
      { name: 'Transfer Authorization', status: 'signed', aiTag: 'Signed' }
    ],
    aiInsight: 'Linda\'s suitability score is 98/100. Portfolio allocation: 60% equities, 30% fixed income, 10% alternatives — matches her Moderate Growth profile. AI recommends activating account transfer from current custodian. Estimated transfer completion: 3–5 business days.'
  },
  'EA-UW-009': {
    id: 'EA-UW-009', dealId: null, uwId: 'UW-2026-0009',
    client: 'Linda Morrison', age: 56, dob: '1969-11-02',
    email: 'linda.m@email.com', phone: '(212) 555-0856',
    address: '1 World Trade Center, Suite 4200, New York, NY 10007',
    ssn: '***-**-7743',
    product: 'Whole Life Rider Add-on', productCode: 'wl-rider',
    coverage: '$250,000 Rider', premium: '$1,200/yr', term: 'Permanent',
    beneficiary: 'James Morrison (Son)', beneficiaryPct: '100%',
    riders: ['Paid-Up Additions Rider', 'Disability Waiver'],
    healthClass: 'Preferred Plus',
    smoker: 'Non-smoker',
    height: "5'6\"", weight: '138 lbs', bmi: '22.3',
    conditions: 'Hypertension — controlled, medication: Lisinopril 10mg',
    medications: 'Lisinopril 10mg daily',
    familyHistory: 'Father: cardiovascular disease age 72',
    labResults: 'BP 128/82 (controlled), Cholesterol 198, All other labs normal',
    aiHealthScore: 91,
    aiPrefillPct: 100,
    status: 'Approved — Awaiting Signature',
    step: 4,
    documents: [
      { name: 'Rider Application Form', status: 'ai-filled', aiTag: 'AI Filled' },
      { name: 'Health Update Form', status: 'ai-filled', aiTag: 'AI Filled' },
      { name: 'Beneficiary Designation Update', status: 'ai-filled', aiTag: 'AI Filled' },
      { name: 'Policy Amendment Rider', status: 'pending', aiTag: 'Needs Signature' },
      { name: 'Disclosure Notice', status: 'signed', aiTag: 'Signed' }
    ],
    aiInsight: 'AI STP engine approved this rider add-on in 1.8 hours. Hypertension is well-controlled per recent labs. STP score 99 — highest confidence auto-approval. Rider activation will increase Linda\'s total coverage to $750K WL + $250K rider. Immediate e-signature can activate policy same day.'
  },
  'EA-UW-008': {
    id: 'EA-UW-008', dealId: null, uwId: 'UW-2026-0008',
    client: 'Maria Gonzalez', age: 48, dob: '1977-07-19',
    email: 'maria.g@email.com', phone: '(212) 555-0748',
    address: '350 Park Ave, New York, NY 10022',
    ssn: '***-**-5534',
    product: 'Disability Insurance Increase', productCode: 'di',
    coverage: '+$3,000/mo benefit increase', premium: '$800/yr', term: 'To age 65',
    beneficiary: 'N/A — Disability Product',
    beneficiaryPct: 'N/A',
    riders: ['COLA Rider', 'Future Increase Option'],
    healthClass: 'Preferred',
    smoker: 'Non-smoker',
    height: "5'4\"", weight: '128 lbs', bmi: '22.0',
    conditions: 'None',
    medications: 'None',
    familyHistory: 'Mother: Type 2 diabetes (disclosed)',
    labResults: 'All labs normal, Blood Glucose 98',
    aiHealthScore: 89,
    aiPrefillPct: 87,
    status: 'Approved — Awaiting Signature',
    step: 3,
    documents: [
      { name: 'DI Application Form', status: 'ai-filled', aiTag: 'AI Filled' },
      { name: 'Attending Physician Statement', status: 'ai-filled', aiTag: 'AI Filled' },
      { name: 'Occupational Questionnaire', status: 'pending', aiTag: 'AI Needs Review' },
      { name: 'Policy Amendment', status: 'pending', aiTag: 'Needs Signature' },
      { name: 'Premium Authorization', status: 'pending', aiTag: 'Needs Signature' }
    ],
    aiInsight: 'AI scored Maria at Preferred class (STP 86). Family history of diabetes flagged but no personal history — DI policy increase approved with standard exclusion clause for diabetes-related disability. Occupational questionnaire needs agent review: Maria is listed as "Manager" — confirm she performs no manual labor over 20% of duties to maintain Preferred class.'
  },
  'EA-NEW': {
    id: 'EA-NEW', dealId: null, uwId: null,
    client: '', age: '', dob: '',
    email: '', phone: '',
    address: '', ssn: '',
    product: 'Select Product', productCode: '',
    coverage: '', premium: '', term: '',
    beneficiary: '', beneficiaryPct: '100%',
    riders: [],
    healthClass: '',
    smoker: '',
    height: '', weight: '', bmi: '',
    conditions: '',
    medications: '',
    familyHistory: '',
    labResults: '',
    aiHealthScore: null,
    aiPrefillPct: 0,
    status: 'New Application',
    step: 1,
    documents: [],
    aiInsight: 'Complete all sections to receive AI risk assessment and STP eligibility score.'
  }
};

/* ── Active E-App state ── */
let activeEAppId = null;
let currentEAppStep = 1;
const totalEAppSteps = 5;

/* ── Step content templates ── */
function _eAppStep1HTML(d) {
  const ai = (f) => `<span class="eapp-ai-fill-tag"><i class="fas fa-robot"></i> AI</span>`;
  return `
    <div class="eapp-section">
      <div class="eapp-section-title"><i class="fas fa-user"></i> Client Information</div>
      <div class="eapp-form-grid">
        <div class="eapp-field-group">
          <label class="eapp-label">Full Legal Name ${d.client ? ai() : ''}</label>
          <input class="eapp-input ${d.client?'eapp-ai-filled':''}" id="ea-name" type="text" value="${d.client}" placeholder="Enter full legal name" />
        </div>
        <div class="eapp-field-group">
          <label class="eapp-label">Date of Birth ${d.dob ? ai() : ''}</label>
          <input class="eapp-input ${d.dob?'eapp-ai-filled':''}" id="ea-dob" type="text" value="${d.dob}" placeholder="YYYY-MM-DD" />
        </div>
        <div class="eapp-field-group">
          <label class="eapp-label">Age ${d.age ? ai() : ''}</label>
          <input class="eapp-input ${d.age?'eapp-ai-filled':''}" id="ea-age" type="text" value="${d.age}" placeholder="Age" />
        </div>
        <div class="eapp-field-group">
          <label class="eapp-label">SSN ${d.ssn ? ai() : ''}</label>
          <input class="eapp-input ${d.ssn?'eapp-ai-filled':''}" id="ea-ssn" type="text" value="${d.ssn}" placeholder="XXX-XX-XXXX" />
        </div>
        <div class="eapp-field-group eapp-field-wide">
          <label class="eapp-label">Email ${d.email ? ai() : ''}</label>
          <input class="eapp-input ${d.email?'eapp-ai-filled':''}" id="ea-email" type="email" value="${d.email}" placeholder="client@email.com" />
        </div>
        <div class="eapp-field-group">
          <label class="eapp-label">Phone ${d.phone ? ai() : ''}</label>
          <input class="eapp-input ${d.phone?'eapp-ai-filled':''}" id="ea-phone" type="text" value="${d.phone}" placeholder="(212) 555-0000" />
        </div>
        <div class="eapp-field-group eapp-field-full">
          <label class="eapp-label">Address ${d.address ? ai() : ''}</label>
          <input class="eapp-input ${d.address?'eapp-ai-filled':''}" id="ea-address" type="text" value="${d.address}" placeholder="Street, City, State, ZIP" />
        </div>
      </div>
      ${d.aiPrefillPct > 0 ? `<div class="eapp-ai-note"><i class="fas fa-robot"></i> AI prefilled ${d.aiPrefillPct}% of fields from client profile. Fields highlighted in blue were auto-populated — please verify accuracy.</div>` : ''}
    </div>`;
}

function _eAppStep2HTML(d) {
  const ai = () => `<span class="eapp-ai-fill-tag"><i class="fas fa-robot"></i> AI</span>`;
  return `
    <div class="eapp-section">
      <div class="eapp-section-title"><i class="fas fa-shield-alt"></i> Product & Coverage Details</div>
      <div class="eapp-form-grid">
        <div class="eapp-field-group eapp-field-wide">
          <label class="eapp-label">Product ${d.product ? ai() : ''}</label>
          <input class="eapp-input ${d.product?'eapp-ai-filled':''}" id="ea-product" type="text" value="${d.product}" placeholder="Select product" />
        </div>
        <div class="eapp-field-group">
          <label class="eapp-label">Coverage Amount ${d.coverage ? ai() : ''}</label>
          <input class="eapp-input ${d.coverage?'eapp-ai-filled':''}" id="ea-coverage" type="text" value="${d.coverage}" placeholder="e.g. $500,000" />
        </div>
        <div class="eapp-field-group">
          <label class="eapp-label">Annual Premium ${d.premium ? ai() : ''}</label>
          <input class="eapp-input ${d.premium?'eapp-ai-filled':''}" id="ea-premium" type="text" value="${d.premium}" placeholder="e.g. $1,800/yr" />
        </div>
        <div class="eapp-field-group">
          <label class="eapp-label">Policy Term ${d.term ? ai() : ''}</label>
          <input class="eapp-input ${d.term?'eapp-ai-filled':''}" id="ea-term" type="text" value="${d.term}" placeholder="e.g. 20 years" />
        </div>
        <div class="eapp-field-group eapp-field-wide">
          <label class="eapp-label">Primary Beneficiary ${d.beneficiary ? ai() : ''}</label>
          <input class="eapp-input ${d.beneficiary?'eapp-ai-filled':''}" id="ea-beneficiary" type="text" value="${d.beneficiary}" placeholder="Name and relationship" />
        </div>
        <div class="eapp-field-group">
          <label class="eapp-label">Beneficiary % ${d.beneficiaryPct ? ai() : ''}</label>
          <input class="eapp-input ${d.beneficiaryPct?'eapp-ai-filled':''}" id="ea-bene-pct" type="text" value="${d.beneficiaryPct}" placeholder="100%" />
        </div>
      </div>
      ${d.riders && d.riders.length ? `
        <div class="eapp-riders-section">
          <div class="eapp-riders-title"><i class="fas fa-robot"></i> AI-Recommended Riders</div>
          <div class="eapp-riders-grid">
            ${d.riders.map(r => `<label class="eapp-rider-item"><input type="checkbox" checked /> <span>${r}</span></label>`).join('')}
          </div>
        </div>` : ''}
    </div>`;
}

function _eAppStep3HTML(d) {
  const ai = () => `<span class="eapp-ai-fill-tag"><i class="fas fa-robot"></i> AI</span>`;
  const isAdvisory = d.productCode === 'uma';
  return `
    <div class="eapp-section">
      <div class="eapp-section-title"><i class="fas fa-heartbeat"></i> Health & Medical ${isAdvisory ? '(Suitability)' : 'Questionnaire'}</div>
      ${isAdvisory ? `
        <div class="eapp-advisory-suitability">
          <div class="eapp-suitability-score"><div class="eapp-suit-val">98</div><div class="eapp-suit-lbl">AI Suitability Score</div></div>
          <div class="eapp-suitability-details">
            <div class="eapp-suit-row"><span>Risk Tolerance</span><span class="eapp-ai-filled-val">Moderate Growth ${ai()}</span></div>
            <div class="eapp-suit-row"><span>Investment Horizon</span><span class="eapp-ai-filled-val">10+ years ${ai()}</span></div>
            <div class="eapp-suit-row"><span>Annual Income</span><span class="eapp-ai-filled-val">$350,000+ ${ai()}</span></div>
            <div class="eapp-suit-row"><span>Net Worth</span><span class="eapp-ai-filled-val">$2.0M+ ${ai()}</span></div>
            <div class="eapp-suit-row"><span>Experience</span><span class="eapp-ai-filled-val">Sophisticated Investor ${ai()}</span></div>
          </div>
        </div>` : `
      <div class="eapp-form-grid">
        <div class="eapp-field-group">
          <label class="eapp-label">Health Class ${d.healthClass ? ai() : ''}</label>
          <input class="eapp-input ${d.healthClass?'eapp-ai-filled':''}" id="ea-hclass" type="text" value="${d.healthClass}" placeholder="e.g. Preferred Plus" />
        </div>
        <div class="eapp-field-group">
          <label class="eapp-label">Tobacco Use ${d.smoker ? ai() : ''}</label>
          <input class="eapp-input ${d.smoker?'eapp-ai-filled':''}" id="ea-smoker" type="text" value="${d.smoker}" placeholder="Smoker / Non-smoker" />
        </div>
        <div class="eapp-field-group">
          <label class="eapp-label">Height ${d.height ? ai() : ''}</label>
          <input class="eapp-input ${d.height?'eapp-ai-filled':''}" id="ea-height" type="text" value="${d.height}" placeholder="5'10&quot;" />
        </div>
        <div class="eapp-field-group">
          <label class="eapp-label">Weight ${d.weight ? ai() : ''}</label>
          <input class="eapp-input ${d.weight?'eapp-ai-filled':''}" id="ea-weight" type="text" value="${d.weight}" placeholder="170 lbs" />
        </div>
        <div class="eapp-field-group eapp-field-full">
          <label class="eapp-label">Current Conditions / Medications ${d.conditions ? ai() : ''}</label>
          <textarea class="eapp-textarea ${d.conditions?'eapp-ai-filled':''}" id="ea-conditions" rows="2">${d.conditions}</textarea>
        </div>
        <div class="eapp-field-group eapp-field-full">
          <label class="eapp-label">Family History ${d.familyHistory ? ai() : ''}</label>
          <textarea class="eapp-textarea ${d.familyHistory?'eapp-ai-filled':''}" id="ea-family" rows="2">${d.familyHistory}</textarea>
        </div>
        <div class="eapp-field-group eapp-field-full">
          <label class="eapp-label">Lab Results ${d.labResults ? ai() : ''}</label>
          <textarea class="eapp-textarea ${d.labResults?'eapp-ai-filled':''}" id="ea-labs" rows="2">${d.labResults}</textarea>
        </div>
      </div>
      ${d.aiHealthScore ? `
      <div class="eapp-health-score-bar">
        <div class="eapp-hs-label">AI Health Score</div>
        <div class="eapp-hs-track"><div class="eapp-hs-fill" style="width:${d.aiHealthScore}%"><span>${d.aiHealthScore}/100</span></div></div>
        <div class="eapp-hs-note">Based on Rx history, MIB check, MVR, lab results, and medical exam data</div>
      </div>` : ''}`}
    </div>`;
}

function _eAppStep4HTML(d) {
  const statusIcon = { 'ai-filled':'<i class="fas fa-robot" style="color:#2563eb"></i>', 'signed':'<i class="fas fa-check-circle" style="color:#059669"></i>', 'pending':'<i class="fas fa-clock" style="color:#d97706"></i>' };
  const statusClass = { 'ai-filled':'doc-ai', 'signed':'doc-signed', 'pending':'doc-pending' };
  return `
    <div class="eapp-section">
      <div class="eapp-section-title"><i class="fas fa-file-signature"></i> Documents & Consent</div>
      <div class="eapp-docs-list">
        ${(d.documents||[]).map((doc,i) => `
          <div class="eapp-doc-row ${statusClass[doc.status]||''}">
            <div class="eapp-doc-num">${i+1}</div>
            <div class="eapp-doc-info">
              <div class="eapp-doc-name">${doc.name}</div>
              <div class="eapp-doc-status">${statusIcon[doc.status]||''} ${doc.aiTag}</div>
            </div>
            ${doc.status === 'pending' ?
              `<button class="eapp-doc-sign-btn" onclick="eAppSignDoc(${i})"><i class="fas fa-signature"></i> Sign</button>` :
              `<button class="eapp-doc-view-btn"><i class="fas fa-eye"></i> View</button>`}
          </div>`).join('')}
      </div>
      <div class="eapp-consent-section">
        <div class="eapp-section-title" style="margin-top:16px"><i class="fas fa-check-square"></i> Authorization & Consent</div>
        <label class="eapp-consent-item"><input type="checkbox" checked /> <span>I authorize New York Life to access medical records for underwriting purposes</span></label>
        <label class="eapp-consent-item"><input type="checkbox" checked /> <span>I consent to electronic delivery of policy documents and communications</span></label>
        <label class="eapp-consent-item"><input type="checkbox" checked /> <span>I acknowledge receipt of the Privacy Notice and Policy Disclosure</span></label>
        <label class="eapp-consent-item"><input type="checkbox" /> <span>I authorize automated premium payment via ACH debit</span></label>
      </div>
    </div>`;
}

function _eAppStep5HTML(d) {
  const allSigned = (d.documents||[]).every(doc => doc.status !== 'pending');
  return `
    <div class="eapp-section">
      <div class="eapp-section-title"><i class="fas fa-check-double"></i> Review & Submit</div>
      <div class="eapp-review-grid">
        <div class="eapp-review-card">
          <div class="eapp-rc-title"><i class="fas fa-user"></i> Client</div>
          <div class="eapp-rc-row"><span>Name</span><span>${d.client}</span></div>
          <div class="eapp-rc-row"><span>Age / DOB</span><span>${d.age} / ${d.dob}</span></div>
          <div class="eapp-rc-row"><span>Email</span><span>${d.email}</span></div>
          <div class="eapp-rc-row"><span>Phone</span><span>${d.phone}</span></div>
        </div>
        <div class="eapp-review-card">
          <div class="eapp-rc-title"><i class="fas fa-shield-alt"></i> Product</div>
          <div class="eapp-rc-row"><span>Product</span><span>${d.product}</span></div>
          <div class="eapp-rc-row"><span>Coverage</span><span>${d.coverage}</span></div>
          <div class="eapp-rc-row"><span>Premium</span><span>${d.premium}</span></div>
          <div class="eapp-rc-row"><span>Term</span><span>${d.term}</span></div>
        </div>
        <div class="eapp-review-card">
          <div class="eapp-rc-title"><i class="fas fa-heartbeat"></i> Health</div>
          <div class="eapp-rc-row"><span>Class</span><span>${d.healthClass}</span></div>
          <div class="eapp-rc-row"><span>Tobacco</span><span>${d.smoker}</span></div>
          ${d.aiHealthScore ? `<div class="eapp-rc-row"><span>AI Score</span><span class="green">${d.aiHealthScore}/100</span></div>` : ''}
          <div class="eapp-rc-row"><span>Status</span><span class="eapp-status-pill">${d.status}</span></div>
        </div>
        <div class="eapp-review-card eapp-review-ai">
          <div class="eapp-rc-title"><i class="fas fa-robot"></i> AI Assessment</div>
          <div class="eapp-ai-insight-review">${d.aiInsight}</div>
          <div class="eapp-ai-prefill-summary"><i class="fas fa-magic"></i> ${d.aiPrefillPct}% fields auto-prefilled · Time saved: ~${Math.round(d.aiPrefillPct * 0.3)} min</div>
        </div>
      </div>
      <div class="eapp-submit-section">
        ${allSigned ?
          `<button class="eapp-submit-btn" onclick="submitEApp()"><i class="fas fa-paper-plane"></i> Submit Application to New York Life</button>` :
          `<div class="eapp-submit-warning"><i class="fas fa-exclamation-triangle"></i> Please complete all document signatures in Step 4 before submitting.</div>
           <button class="eapp-btn-secondary" onclick="goToEAppStep(4)"><i class="fas fa-arrow-left"></i> Back to Documents</button>`}
      </div>
    </div>`;
}

/* ── Open E-App ── */
function openEApp(eAppId) {
  const d = eAppData[eAppId];
  if (!d) return;
  activeEAppId = eAppId;
  currentEAppStep = d.step || 1;

  const overlay = document.getElementById('eapp-overlay');
  if (!overlay) return;

  // Update header
  const titleEl = document.getElementById('eapp-header-title');
  if (titleEl) titleEl.textContent = d.client ? `E-Application — ${d.client}` : 'New E-Application';
  const subEl = document.getElementById('eapp-header-sub');
  if (subEl) subEl.textContent = d.product !== 'Select Product' ? `${d.product} · ${d.status}` : 'New Application — Complete all fields';
  const pctEl = document.getElementById('eapp-ai-pct');
  if (pctEl) pctEl.textContent = `${d.aiPrefillPct}%`;

  overlay.style.display = 'flex';
  _renderEAppStep(currentEAppStep);
}

/* ── Render a step ── */
function _renderEAppStep(step) {
  const d = eAppData[activeEAppId];
  if (!d) return;
  currentEAppStep = step;

  // Progress bar
  const fill = document.getElementById('eapp-progress-fill');
  if (fill) fill.style.width = `${(step / totalEAppSteps) * 100}%`;

  // Step indicator
  const cur = document.getElementById('eapp-cur-step');
  if (cur) cur.textContent = step;

  // Step dots
  for (let i = 1; i <= totalEAppSteps; i++) {
    const dot = document.getElementById(`eapp-step-dot-${i}`);
    if (dot) {
      dot.classList.toggle('active', i === step);
      dot.classList.toggle('done', i < step);
    }
  }

  // Back button visibility
  const backBtn = document.getElementById('eapp-btn-back');
  if (backBtn) backBtn.style.display = step === 1 ? 'none' : 'flex';

  // Next button label
  const nextBtn = document.getElementById('eapp-btn-next');
  if (nextBtn) {
    if (step === totalEAppSteps) {
      nextBtn.style.display = 'none';
    } else {
      nextBtn.style.display = 'flex';
      nextBtn.innerHTML = step === totalEAppSteps - 1 ? 'Review <i class="fas fa-eye"></i>' : 'Next <i class="fas fa-arrow-right"></i>';
    }
  }

  // Render step body
  const body = document.getElementById('eapp-body');
  if (!body) return;
  const renderers = { 1: _eAppStep1HTML, 2: _eAppStep2HTML, 3: _eAppStep3HTML, 4: _eAppStep4HTML, 5: _eAppStep5HTML };
  body.innerHTML = renderers[step] ? renderers[step](d) : '<div style="padding:40px;text-align:center">Step content coming soon.</div>';
}

/* ── Navigation ── */
function eAppStepNav(direction) {
  const newStep = currentEAppStep + direction;
  if (newStep < 1 || newStep > totalEAppSteps) return;
  _renderEAppStep(newStep);
}

function goToEAppStep(step) {
  if (step < 1 || step > totalEAppSteps) return;
  _renderEAppStep(step);
}

/* ── AI Auto-Fill ── */
function eAppAIFill() {
  const body = document.getElementById('eapp-body');
  if (!body) return;
  const inputs = body.querySelectorAll('input.eapp-input:not([readonly]), textarea.eapp-textarea');
  inputs.forEach(input => {
    if (!input.value) {
      input.classList.add('eapp-ai-filled');
      input.placeholder = 'AI-filled';
    }
  });
  const toast = document.createElement('div');
  toast.className = 'stage-toast';
  toast.innerHTML = '<i class="fas fa-robot"></i> AI Auto-Fill complete — all available fields populated from client profile';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ── Sign document ── */
function eAppSignDoc(docIndex) {
  const d = eAppData[activeEAppId];
  if (!d || !d.documents[docIndex]) return;
  d.documents[docIndex].status = 'signed';
  d.documents[docIndex].aiTag = 'Signed ✓';
  _renderEAppStep(4);
  const toast = document.createElement('div');
  toast.className = 'stage-toast';
  toast.innerHTML = `<i class="fas fa-check-circle"></i> "${d.documents[docIndex].name}" signed successfully`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ── Save draft ── */
function eAppSaveDraft() {
  const d = eAppData[activeEAppId];
  if (!d) return;
  const toast = document.createElement('div');
  toast.className = 'stage-toast';
  toast.innerHTML = `<i class="fas fa-save"></i> E-App draft saved — ${d.client || 'New Application'} (Step ${currentEAppStep}/5)`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ── Submit ── */
function submitEApp() {
  const d = eAppData[activeEAppId];
  if (!d) return;
  closeEApp();
  const toast = document.createElement('div');
  toast.className = 'stage-toast';
  toast.innerHTML = `<i class="fas fa-paper-plane"></i> Application for ${d.client} submitted to New York Life — Expected decision: ${d.aiHealthScore >= 80 ? '2–4 hours (STP)' : '1–3 business days'}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

/* ── Close ── */
function closeEApp(e) {
  if (e && e.target !== document.getElementById('eapp-overlay')) return;
  const overlay = document.getElementById('eapp-overlay');
  if (overlay) overlay.style.display = 'none';
  activeEAppId = null;
  currentEAppStep = 1;
}

console.log('E-App Wizard JS loaded — eAppData(5), openEApp, eAppStepNav, submitEApp');

// ================================================================
//  NLP POLICY REVIEW & RISK EXPERT  (Task #12)
// ================================================================

// ── NLP Data Store ──────────────────────────────────────────────
const nlpPolicyData = {
  'P-100291': {
    id:'P-100291', client:'James Whitfield', type:'Whole Life Insurance',
    faceValue:'$500,000', premium:'$4,800/yr', issued:'2019-06-15', renewal:'2026-06-15',
    score:94, level:'Low', levelClass:'nlp-low', scoreClass:'score-low', shIconClass:'low',
    headline:'Strong Whole Life Policy — Cash Value Optimization Opportunity',
    plainSummary:`<strong>James Whitfield</strong> holds a <span class="nlp-plain-highlight">Whole Life</span> policy (P-100291) issued in 2019 with a <strong>$500,000 death benefit</strong>. The policy is in excellent standing with a cash value of <strong>$48,200</strong> and growing at ~12.4% annually. All contractual clauses are standard and clearly written — NLP detected <span class="nlp-plain-highlight">no exclusions</span> that would limit a death benefit payout under normal circumstances.<br><br>One opportunity: the <strong>Paid-Up Additions rider</strong> could redirect dividends ($2,140/yr) to purchase additional paid-up insurance, potentially adding ~$18K of death benefit over 10 years at no additional premium. Recommend reviewing this at the June 2026 annual review.`,
    keyFacts:[
      {lbl:'NLP Risk Score',val:'94 / 100'},
      {lbl:'Risk Level',val:'Low'},
      {lbl:'Exclusions Found',val:'None'},
      {lbl:'Clauses Analyzed',val:'14 of 14'},
      {lbl:'Ambiguities Detected',val:'0'},
      {lbl:'Next Review',val:'Jun 2026'},
    ],
    actions:[
      {cls:'normal-action',icon:'fa-check-circle',text:'Schedule Q2 2026 paid-up additions review — potential +$18K death benefit at no extra premium'},
      {cls:'normal-action',icon:'fa-check-circle',text:'Introduce estate planning integration — trust or will beneficiary alignment'},
      {cls:'normal-action',icon:'fa-check-circle',text:'Cross-sell: Disability income policy gap — no DI coverage on file'},
    ],
    clauses:[
      {type:'clause-ok',icon:'fa-check-circle',title:'Death Benefit Trigger',badge:'Clear',text:'Clause §4.1 — Benefit payable on insured\'s death while policy is in force. Standard language, no unusual exclusions.',plain:'Plain English: If James dies while this policy is active, the full $500,000 is paid to his beneficiary with no restrictions beyond standard exclusions.'},
      {type:'clause-ok',icon:'fa-check-circle',title:'Premium Payment & Grace Period',badge:'Clear',text:'Clause §3.2 — Annual premium $4,800. 31-day grace period applies. Policy enters lapse only after grace period with no payment.',plain:'Plain English: If a premium is missed, there\'s a 31-day window to pay before coverage is threatened. Cash value provides a buffer.'},
      {type:'clause-ok',icon:'fa-check-circle',title:'Cash Value & Dividend Participation',badge:'Clear',text:'Clause §7.1 — Participating policy. Annual dividends not guaranteed but based on NYL experience.',plain:'Plain English: This policy can earn dividends. The $2,140/yr estimated dividend can be taken as cash, used to pay premiums, or reinvested in the policy.'},
      {type:'clause-warn',icon:'fa-exclamation-circle',title:'Paid-Up Additions Rider',badge:'Opportunity',text:'Rider §A-3 — Allows dividends to purchase additional paid-up insurance. Currently not maximized.',plain:'Plain English: James could be using his dividends to buy more insurance automatically — this feature is available but not currently activated.'},
      {type:'clause-ok',icon:'fa-check-circle',title:'Contestability Clause',badge:'Clear',text:'Clause §5.1 — 2-year contestability window from issue (2019). This window has passed — policy is incontestable.',plain:'Plain English: Because this policy is over 2 years old, NYL cannot contest the death benefit claim on the grounds of misrepresentation in the application.'},
    ],
    riskFlags:[
      {cls:'rf-low',icon:'fa-check-circle',title:'No Lapse Risk',badge:'Clear',text:'Policy has sustained premium payments for 7 consecutive years. Cash value at $48,200 provides multi-year buffer even if premiums are missed.',rec:'✅ No action required. Monitor annually.'},
      {cls:'rf-low',icon:'fa-shield-alt',title:'Contestability Cleared',badge:'Clear',text:'2-year contestability window expired June 2021. All material facts reviewed and accepted.',rec:'✅ Policy is fully incontestable. Claim payout is legally protected.'},
      {cls:'rf-med',icon:'fa-user-slash',title:'No Disability Income Coverage',badge:'Gap Detected',text:'Client has no disability income policy on file. If James becomes unable to work, there is no income replacement coverage beyond the waiver of premium rider.',rec:'⚡ Recommend: Present Individual DI quote at next meeting. Cross-sell opportunity ~$1,200–$1,800/yr premium.'},
    ],
    benchmark:[
      {label:'Premium Competitiveness',pct:78,cls:'b-ok',mine:'$4,800/yr',industry:'$4,200–$5,400/yr',tag:'inline',tagLabel:'In Range'},
      {label:'Cash Value Growth',pct:90,cls:'b-great',mine:'12.4% since issue',industry:'8–14% typical',tag:'above',tagLabel:'Above Avg'},
      {label:'Death Benefit / Income Ratio',pct:85,cls:'b-ok',mine:'~3x estimated income',industry:'5–10x recommended',tag:'below',tagLabel:'Below Recommended'},
      {label:'Clause Clarity Score',pct:94,cls:'b-great',mine:'94/100',industry:'75–85 typical',tag:'above',tagLabel:'Above Avg'},
    ]
  },
  'P-100320': {
    id:'P-100320', client:'Sandra Williams', type:'Term Life Insurance',
    faceValue:'$350,000', premium:'$2,800/yr', issued:'2016-09-30', renewal:'2026-09-30',
    score:44, level:'High', levelClass:'nlp-high', scoreClass:'score-high', shIconClass:'high',
    headline:'⚠️ URGENT — Renewal Exclusion Detected — Conversion Window Closing',
    plainSummary:`<strong>Sandra Williams</strong> (age 61) holds a <strong>20-year term policy</strong> (P-100320) expiring <span class="nlp-plain-highlight">September 30, 2026 — only 5 months away</span>. NLP analysis of the policy document has detected a <strong>critical exclusion</strong>: after age 60, any renewal or re-issuance requires full medical underwriting. Sandra is already 61 — if this policy lapses, re-qualification for comparable coverage will be extremely difficult and expensive.<br><br>However, the policy contains a <strong>conversion provision</strong> (Rider §C-1) that allows conversion to permanent coverage without medical evidence before the renewal date. This window closes September 30, 2026. Immediate action is required to present Sandra with whole life or universal life conversion options.`,
    keyFacts:[
      {lbl:'NLP Risk Score',val:'44 / 100'},
      {lbl:'Risk Level',val:'HIGH'},
      {lbl:'Critical Clauses',val:'2 Flagged'},
      {lbl:'Conversion Window',val:'Closes Sep 2026'},
      {lbl:'Months Remaining',val:'5 months'},
      {lbl:'Exclusion Type',val:'Age-based renewal'},
    ],
    actions:[
      {cls:'urgent-action',icon:'fa-exclamation-triangle',text:'⚡ URGENT: Call Sandra Williams this week — conversion window closes Sep 30, 2026'},
      {cls:'urgent-action',icon:'fa-exclamation-triangle',text:'⚡ Prepare Whole Life vs UL conversion illustrations — present options at meeting'},
      {cls:'normal-action',icon:'fa-check-circle',text:'Schedule in-person renewal review — discuss estate and retirement planning needs'},
      {cls:'normal-action',icon:'fa-check-circle',text:'Cross-sell: Annuity options for retirement income supplement (Sandra, age 61)'},
    ],
    clauses:[
      {type:'clause-urgent',icon:'fa-exclamation-circle',title:'Age-Based Renewal Exclusion',badge:'⚠ Critical',text:'Clause §6.4 — "Upon policy renewal, insured age 60+ is subject to full evidence of insurability requirements including medical examination, APS, and current underwriting guidelines."',plain:'⚠ Plain English: After age 60, Sandra CANNOT simply renew this policy. She would need a new medical exam and could be rated or declined due to her current health.'},
      {type:'clause-urgent',icon:'fa-exclamation-circle',title:'Conversion Privilege (Rider §C-1)',badge:'Time-Sensitive',text:'Rider §C-1 — "Policyholder may convert to permanent coverage without evidence of insurability before policy expiry date, subject to current permanent product premium rates."',plain:'⚠ Plain English: Sandra CAN convert to a whole life or UL policy before Sep 30, 2026 without a medical exam — but only if action is taken BEFORE the term expires.'},
      {type:'clause-ok',icon:'fa-check-circle',title:'Death Benefit — Current Coverage',badge:'Clear',text:'Clause §4.1 — $350,000 death benefit payable while policy is active. Standard language, no unusual exclusions for current coverage period.',plain:'Plain English: Until September 30, 2026, Sandra\'s $350,000 benefit is fully protected.'},
      {type:'clause-warn',icon:'fa-exclamation-circle',title:'Beneficiary Designation',badge:'Review',text:'Current beneficiary: Michael Williams (spouse). Recommend confirming beneficiary is current and trust/estate alignment is in place given Sandra\'s age.',plain:'Plain English: The beneficiary should be reviewed — at age 61 with estate planning needs, a trust may be more appropriate than an individual beneficiary.'},
    ],
    riskFlags:[
      {cls:'rf-urgent',icon:'fa-times-circle',title:'Renewal Exclusion — Age 61 Barrier',badge:'Critical',text:'Policy §6.4 explicitly excludes standard renewal for insured over age 60. Sandra is currently 61. If policy expires without conversion or renewal action, coverage terminates permanently.',rec:'⚡ IMMEDIATE ACTION: Initiate conversion conversation. Prepare WL and UL illustrations. Meeting should occur within 30 days.'},
      {cls:'rf-high',icon:'fa-clock',title:'5-Month Conversion Window',badge:'Urgent',text:'Conversion Rider §C-1 window closes September 30, 2026. After this date, no conversion option is available without medical evidence.',rec:'⚡ Schedule meeting within next 2 weeks. Bring conversion illustrations and permanent policy options.'},
      {cls:'rf-med',icon:'fa-user-times',title:'Re-Qualification Risk After Lapse',badge:'High Risk',text:'Sandra, age 61, has an LTC claim in 2026 and prior disability claim (2025). Re-qualification after a lapse would likely result in rated or declined coverage.',rec:'Proactively discuss: conversion to whole life locks in insurability regardless of future health changes.'},
    ],
    benchmark:[
      {label:'Conversion Action Lead Time',pct:20,cls:'b-risk',mine:'5 months remaining',industry:'12–18 months recommended',tag:'below',tagLabel:'Critical — Act Now'},
      {label:'Coverage vs Net Worth',pct:45,cls:'b-warn',mine:'$350K vs est. $800K assets',industry:'Matching or higher recommended',tag:'below',tagLabel:'Under-insured'},
      {label:'Clause Risk Score',pct:44,cls:'b-risk',mine:'44/100',industry:'70–90 typical',tag:'below',tagLabel:'Below Benchmark'},
    ]
  },
  'P-100301': {
    id:'P-100301', client:'Patricia Nguyen', type:'Universal Life Insurance',
    faceValue:'$400,000', premium:'$3,000/yr', issued:'2020-08-20', renewal:'2026-08-20',
    score:38, level:'Urgent', levelClass:'nlp-urgent', scoreClass:'score-urgent', shIconClass:'urgent',
    headline:'⚠️ CRITICAL — Universal Life Under-Funded — Lapse Risk Clause Active',
    plainSummary:`<strong>Patricia Nguyen</strong>'s Universal Life policy (P-100301) is in immediate danger of lapse. NLP analysis detected a <strong>minimum cash value clause</strong> (§7.3) that triggers an automatic policy lapse if cash value falls below <span class="nlp-plain-highlight">$18,000 for 30+ consecutive days</span>. Current cash value is <strong>$21,400</strong> — only <strong>$3,400 above the trigger threshold</strong>.<br><br>The AI cash-flow model predicts the minimum threshold will be breached within <strong>60–90 days</strong> at the current underfunded rate. Patricia is age 38 — if this policy lapses, re-qualification requires new medical underwriting. Immediate premium catch-up of <strong>$1,800–$2,400 over 3 months</strong> is required.`,
    keyFacts:[
      {lbl:'NLP Risk Score',val:'38 / 100'},
      {lbl:'Risk Level',val:'URGENT'},
      {lbl:'Lapse Risk',val:'60–90 days'},
      {lbl:'Cash Value',val:'$21,400'},
      {lbl:'Minimum Threshold',val:'$18,000'},
      {lbl:'Buffer Remaining',val:'$3,400'},
    ],
    actions:[
      {cls:'urgent-action',icon:'fa-exclamation-triangle',text:'⚡ URGENT: Call Patricia Nguyen this week — lapse risk within 60–90 days'},
      {cls:'urgent-action',icon:'fa-exclamation-triangle',text:'⚡ Present premium catch-up illustration: $600–$800/mo for 3 months to restore policy health'},
      {cls:'normal-action',icon:'fa-check-circle',text:'Discuss policy restructuring — consider converting to fixed premium UL structure'},
      {cls:'normal-action',icon:'fa-check-circle',text:'Review beneficiary and estate planning needs — she is age 38 with young family'},
    ],
    clauses:[
      {type:'clause-urgent',icon:'fa-battery-quarter',title:'Minimum Cash Value Lapse Trigger (§7.3)',badge:'⚠ Active Risk',text:'Clause §7.3 — "Policy shall lapse automatically if Account Value falls below the Minimum Required Reserve of $18,000 for thirty (30) or more consecutive calendar days."',plain:'⚠ Plain English: If Patricia\'s policy account value drops below $18,000 for a month straight, coverage ends automatically. She\'s only $3,400 above this threshold right now.'},
      {type:'clause-risk',icon:'fa-exclamation-circle',title:'Flexible Premium — Underfunding Risk',badge:'Risk',text:'Clause §3.1 — Universal Life allows flexible premium payments. However, insufficient premiums increase the risk of policy lapse when cost of insurance charges exceed account value growth.',plain:'⚠ Plain English: The flexible premium structure means missed or reduced payments are silently eroding the policy. If the account runs dry, coverage disappears.'},
      {type:'clause-warn',icon:'fa-clock',title:'Re-Qualification After Lapse',badge:'Warning',text:'Clause §9.2 — Reinstatement after lapse requires a new application, medical evidence, and underwriting approval within 3 years of lapse date.',plain:'Warning: If this policy lapses, Patricia would need to pass a new medical exam to get coverage back. At age 38, this is still possible but not guaranteed — and premium rates will be higher.'},
      {type:'clause-ok',icon:'fa-check-circle',title:'Death Benefit Guarantee',badge:'Clear (if funded)',text:'Clause §4.1 — $400,000 death benefit payable while policy is in force and Account Value is above minimum reserve.',plain:'Plain English: As long as the account stays funded above minimum, the $400,000 benefit is guaranteed. The goal is to keep the policy funded.'},
    ],
    riskFlags:[
      {cls:'rf-urgent',icon:'fa-battery-quarter',title:'Lapse Trigger Within 60–90 Days',badge:'Critical',text:'AI cash-flow model: at current underfunded rate, cash value will breach §7.3 minimum ($18,000) by approximately mid-June 2026. Patricia has been under-funded for 2 consecutive quarters.',rec:'⚡ IMMEDIATE: Call this week. Prepare premium catch-up illustration. $600–$800/mo for 3 months restores policy health.'},
      {cls:'rf-high',icon:'fa-times-circle',title:'Re-Qualification Risk',badge:'High Risk',text:'Patricia is age 38. If policy lapses, new medical underwriting is required. Any change in health between now and re-application could result in rated or declined coverage.',rec:'⚡ Emphasize to client: preserving this policy avoids the need for new medical evidence. Any new application carries risk.'},
      {cls:'rf-med',icon:'fa-coins',title:'Premium Shortfall Pattern',badge:'Warning',text:'2 consecutive quarters of underfunding suggest a budget issue or client disengagement. Premium of $3,000/yr ($250/mo) may need restructuring.',rec:'Discuss: monthly EFT auto-payment to prevent recurrence. Consider policy restructure to lower required premium.'},
    ],
    benchmark:[
      {label:'Cash Value vs Minimum Threshold',pct:19,cls:'b-risk',mine:'$3,400 buffer (19%)',industry:'>$15,000 buffer recommended',tag:'below',tagLabel:'Critical — Danger Zone'},
      {label:'Policy Health Score',pct:38,cls:'b-risk',mine:'38/100',industry:'75+ recommended',tag:'below',tagLabel:'Urgent Action Required'},
      {label:'Premium Adequacy',pct:35,cls:'b-risk',mine:'Under-funded 2 qtrs',industry:'Fully funded',tag:'below',tagLabel:'Critical'},
    ]
  },
  'P-100330': {
    id:'P-100330', client:'Linda Morrison', type:'Whole Life Insurance',
    faceValue:'$2,000,000', premium:'$12,000/yr', issued:'2015-12-01', renewal:'2030-12-01',
    score:97, level:'Low', levelClass:'nlp-low', scoreClass:'score-low', shIconClass:'low',
    headline:'Flagship Policy — All Clauses Clear — Estate Coordination Opportunity',
    plainSummary:`<strong>Linda Morrison</strong> holds the flagship policy (P-100330) — a <span class="nlp-plain-highlight">$2,000,000 Whole Life</span> issued in 2015. NLP analysis reviewed all 19 clauses and found <strong>zero exclusions, zero ambiguities, and zero lapse risks</strong>. This is a model policy. Cash value stands at <strong>$168,400</strong> with estimated dividends of $6,200/yr.<br><br>The beneficiary is listed as <em>Trust</em> — this should be verified with Linda's estate planning attorney to confirm the trust document is current and aligned with the $2M benefit. Additionally, Linda's April 15, 2026 annual review should include a UMA discussion — her investable assets are estimated at $500K+.`,
    keyFacts:[
      {lbl:'NLP Risk Score',val:'97 / 100'},
      {lbl:'Risk Level',val:'Low'},
      {lbl:'Exclusions Found',val:'None'},
      {lbl:'Clauses Analyzed',val:'19 of 19'},
      {lbl:'Cash Value',val:'$168,400'},
      {lbl:'Annual Dividend',val:'$6,200 (est.)'},
    ],
    actions:[
      {cls:'normal-action',icon:'fa-check-circle',text:'Verify trust beneficiary alignment with estate planning attorney before Apr 15 review'},
      {cls:'normal-action',icon:'fa-check-circle',text:'Annual review Apr 15 — present UMA and estate coordination agenda'},
      {cls:'normal-action',icon:'fa-check-circle',text:'Dividend optimization: confirm $6,200/yr dividend election is optimally directed'},
    ],
    clauses:[
      {type:'clause-ok',icon:'fa-check-circle',title:'Death Benefit — Trust Beneficiary',badge:'Clear',text:'Clause §4.1 — $2,000,000 death benefit payable to named trust beneficiary. Clear language with no conditions beyond standard exclusions.',plain:'Plain English: The full $2M benefit goes to Linda\'s trust when she passes. No ambiguity or contested language found.'},
      {type:'clause-ok',icon:'fa-check-circle',title:'Premium Payment — Paid-Up Status',badge:'Clear',text:'Clause §3.1 — Annual premium $12,000. Policy has significant paid-up value built over 11 years.',plain:'Plain English: Linda has paid into this policy for 11 years. Even if she stopped paying, the accumulated cash value would sustain coverage for many years.'},
      {type:'clause-ok',icon:'fa-check-circle',title:'Dividend Participation',badge:'Clear',text:'Clause §7.1 — Participating policy. $6,200/yr estimated dividend. Currently directed to paid-up additions.',plain:'Plain English: Linda earns dividends that are automatically reinvested to grow her death benefit. This is the optimal election for wealth accumulation.'},
      {type:'clause-warn',icon:'fa-exclamation-circle',title:'Trust Beneficiary Verification',badge:'Review Recommended',text:'Beneficiary listed as "Trust" — trust document reference should be verified against current estate plan.',plain:'Recommendation: Confirm trust document is current and aligned with the $2M policy. Estate plans change — verify at each annual review.'},
    ],
    riskFlags:[
      {cls:'rf-low',icon:'fa-check-circle',title:'No Lapse Risk',badge:'Excellent',text:'Policy has 11 years of sustained premiums. Cash value $168,400 provides a 14-year premium reserve.',rec:'✅ No action required. Annual review only.'},
      {cls:'rf-low',icon:'fa-shield-alt',title:'Contestability Cleared',badge:'Clear',text:'2-year contestability window expired 2017. Policy is fully incontestable.',rec:'✅ Protected. No legal challenge to death benefit is possible.'},
      {cls:'rf-med',icon:'fa-file-contract',title:'Trust Document Alignment',badge:'Review',text:'The trust beneficiary designation should be confirmed against the current estate plan document.',rec:'Verify at Apr 15 annual review. Coordinate with estate attorney if needed.'},
    ],
    benchmark:[
      {label:'Policy Health Score',pct:97,cls:'b-great',mine:'97/100',industry:'75–90 typical',tag:'above',tagLabel:'Excellent'},
      {label:'Cash Value Growth',pct:92,cls:'b-great',mine:'$168,400 (11 yrs)',industry:'$120K–$180K range',tag:'above',tagLabel:'Above Avg'},
      {label:'Clause Clarity Score',pct:97,cls:'b-great',mine:'97/100',industry:'75–85 typical',tag:'above',tagLabel:'Excellent'},
      {label:'Dividend Optimization',pct:85,cls:'b-ok',mine:'Paid-up additions',industry:'Paid-up additions preferred',tag:'inline',tagLabel:'Optimal'},
    ]
  }
};

const nlpPortfolioData = [
  {id:'P-100330',client:'Linda Morrison',type:'Whole Life $2M',score:97,cls:'nlp-low',flag:'Flagship — all 19 clauses clear'},
  {id:'P-100291',client:'James Whitfield',type:'Whole Life $500K',score:94,cls:'nlp-low',flag:'Clean — no exclusions flagged'},
  {id:'P-100292',client:'Sandra Williams',type:'Term Life $750K',score:88,cls:'nlp-low',flag:'Term conversion clause clear'},
  {id:'P-100302',client:'Patricia Nguyen',type:'Variable UL $300K',score:81,cls:'nlp-low',flag:'VUL market risk disclosed'},
  {id:'P-100310',client:'Robert Chen',type:'Whole Life $1M',score:76,cls:'nlp-med',flag:'Contestability window active'},
  {id:'P-100293',client:'James Whitfield',type:'LTC $9,600/yr',score:72,cls:'nlp-med',flag:'LTC trigger ambiguity detected'},
  {id:'P-100320',client:'Sandra Williams',type:'Term Life $350K',score:44,cls:'nlp-high',flag:'⚠ Renewal exclusion — age 61+'},
  {id:'P-100301',client:'Patricia Nguyen',type:'Universal Life $400K',score:38,cls:'nlp-urgent',flag:'⚠ Under-funding lapse clause'},
];

let _nlpCurrentPolicy = null;
let _nlpCurrentTab    = 'summary';

function openNLPReview(policyId) {
  const overlay = document.getElementById('nlp-overlay');
  if (!overlay) return;
  _nlpCurrentPolicy = policyId;
  _nlpCurrentTab    = 'summary';

  // Update subtitle
  const sub = document.getElementById('nlp-modal-sub');
  if (policyId === 'all' || policyId === 'risk') {
    if (sub) sub.textContent = 'Full Portfolio NLP Scan — 8 policies analyzed · 2 urgent · 3 flagged';
  } else {
    const d = nlpPolicyData[policyId];
    if (d && sub) sub.textContent = d.id + ' · ' + d.client + ' · ' + d.type;
  }

  // Set tab active
  document.querySelectorAll('.nlp-mtab').forEach(t => t.classList.remove('active'));
  const firstTab = document.querySelector('.nlp-mtab');
  if (firstTab) firstTab.classList.add('active');

  // Render content
  _nlpRenderTab('summary', policyId);
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeNLPReview(e) {
  if (e && e.target !== document.getElementById('nlp-overlay')) return;
  const overlay = document.getElementById('nlp-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Also close via button
(function(){ const el=document.getElementById('nlp-overlay'); if(el){ el.addEventListener('click',function(e){ if(e.target===el) closeNLPReview(e); }); }})();

function switchNLPTab(tab, btn) {
  _nlpCurrentTab = tab;
  document.querySelectorAll('.nlp-mtab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  _nlpRenderTab(tab, _nlpCurrentPolicy);
}

function _nlpRenderTab(tab, policyId) {
  const body = document.getElementById('nlp-modal-body');
  if (!body) return;

  if (policyId === 'all' || policyId === 'risk') {
    body.innerHTML = _nlpBuildPortfolioView();
    return;
  }

  const d = nlpPolicyData[policyId];
  if (!d) { body.innerHTML = `<div style="padding:40px;text-align:center;color:#9ca3af"><i class="fas fa-brain fa-2x" style="margin-bottom:12px"></i><br>NLP analysis not available for this policy.</div>`; return; }

  const strip = `<div class="nlp-policy-strip">
    <div class="nlp-ps-item"><div class="nlp-ps-lbl">Policy</div><div class="nlp-ps-val">${d.id}</div></div>
    <div class="nlp-ps-item"><div class="nlp-ps-lbl">Client</div><div class="nlp-ps-val">${d.client}</div></div>
    <div class="nlp-ps-item"><div class="nlp-ps-lbl">Type</div><div class="nlp-ps-val">${d.type}</div></div>
    <div class="nlp-ps-item"><div class="nlp-ps-lbl">Face Value</div><div class="nlp-ps-val">${d.faceValue}</div></div>
    <div class="nlp-ps-item"><div class="nlp-ps-lbl">NLP Score</div><div class="nlp-ps-val risk-${d.level.toLowerCase()}">${d.score}/100</div></div>
    <div class="nlp-ps-item"><div class="nlp-ps-lbl">Risk Level</div><div class="nlp-ps-val risk-${d.level.toLowerCase()}">${d.level}</div></div>
  </div>`;

  let content = '';
  if (tab === 'summary')  content = _nlpBuildSummary(d);
  if (tab === 'clauses')  content = _nlpBuildClauses(d);
  if (tab === 'risk')     content = _nlpBuildRisk(d);
  if (tab === 'compare')  content = _nlpBuildBenchmark(d);

  body.innerHTML = strip + content;
}

function _nlpBuildSummary(d) {
  const kfHtml = d.keyFacts.map(f => `<div class="nlp-kf-card"><div class="nlp-kf-lbl">${f.lbl}</div><div class="nlp-kf-val">${f.val}</div></div>`).join('');
  const actHtml = d.actions.map(a => `<li class="${a.cls}"><i class="fas ${a.icon}"></i><span>${a.text}</span></li>`).join('');
  return `<div class="nlp-summary-wrap">
    <div class="nlp-summary-headline">
      <div class="nlp-sh-icon ${d.shIconClass}"><i class="fas fa-brain"></i></div>
      <div class="nlp-sh-text"><h3>${d.headline}</h3><p>NLP Score ${d.score}/100 · ${d.clauses ? d.clauses.length : '—'} clauses analyzed · ${d.level} risk</p></div>
    </div>
    <div class="nlp-plain-card">${d.plainSummary}</div>
    <div class="nlp-key-facts">${kfHtml}</div>
    <div class="nlp-action-items">
      <h4><i class="fas fa-tasks" style="color:#7c3aed"></i> Recommended Actions</h4>
      <ul class="nlp-action-list">${actHtml}</ul>
    </div>
    <div class="nlp-action-btn-row">
      <button class="nlp-ab nlp-ab-primary" onclick="switchNLPTab('clauses',document.querySelectorAll('.nlp-mtab')[1])"><i class="fas fa-list-ul"></i> View All Clauses</button>
      <button class="nlp-ab nlp-ab-outline" onclick="switchNLPTab('risk',document.querySelectorAll('.nlp-mtab')[2])"><i class="fas fa-exclamation-triangle"></i> Risk Detail</button>
      <button class="nlp-ab nlp-ab-secondary" onclick="sendQuickMessage('NLP Policy Review for ${d.client}: ${d.headline}'); closeNLPReview(); navigateTo('ai-agents');"><i class="fas fa-robot"></i> Ask AI Agent</button>
    </div>
  </div>`;
}

function _nlpBuildClauses(d) {
  const clauseHtml = (d.clauses || []).map(c => `
    <div class="nlp-clause ${c.type}">
      <div class="nlp-clause-header">
        <div class="nlp-clause-icon"><i class="fas ${c.icon}"></i></div>
        <div class="nlp-clause-title">${c.title}</div>
        <span class="nlp-clause-badge">${c.badge}</span>
      </div>
      <div class="nlp-clause-text">${c.text}</div>
      <div class="nlp-clause-plain"><i class="fas fa-comment-dots" style="margin-right:5px;opacity:.6"></i>${c.plain}</div>
    </div>`).join('');
  return `<div class="nlp-clauses-wrap">
    <div class="nlp-clause-filter">
      <button class="nlp-cf-btn all active">All Clauses</button>
      <button class="nlp-cf-btn risk"><i class="fas fa-exclamation-circle"></i> Risk</button>
      <button class="nlp-cf-btn exclusion"><i class="fas fa-ban"></i> Exclusions</button>
      <button class="nlp-cf-btn ok"><i class="fas fa-check-circle"></i> Clear</button>
    </div>
    <div class="nlp-clause-list">${clauseHtml}</div>
  </div>`;
}

function _nlpBuildRisk(d) {
  const scoreLabel = d.level === 'Low' ? 'Excellent Health' : d.level === 'Medium' ? 'Needs Attention' : d.level === 'High' ? 'High Risk — Action Required' : 'Critical — Immediate Action';
  const flagHtml = (d.riskFlags || []).map(f => `
    <div class="nlp-rf ${f.cls}">
      <div class="nlp-rf-icon"><i class="fas ${f.icon}"></i></div>
      <div class="nlp-rf-body">
        <div class="nlp-rf-title">${f.title} <span class="nlp-rf-badge">${f.badge}</span></div>
        <div class="nlp-rf-text">${f.text}</div>
        <div class="nlp-rf-rec">${f.rec}</div>
      </div>
    </div>`).join('');
  return `<div class="nlp-risk-wrap">
    <div class="nlp-risk-score-card">
      <div class="nlp-rsc-score ${d.scoreClass}">${d.score}</div>
      <div><div class="nlp-rsc-label">NLP Risk Score</div></div>
      <div class="nlp-rsc-divider"></div>
      <div class="nlp-rsc-details">
        <div class="nlp-rsc-headline">${d.headline}</div>
        <div class="nlp-rsc-sub">${scoreLabel} · ${(d.riskFlags||[]).length} risk flags · ${(d.clauses||[]).length} clauses analyzed</div>
      </div>
    </div>
    <div class="nlp-risk-flags">${flagHtml}</div>
  </div>`;
}

function _nlpBuildBenchmark(d) {
  const barHtml = (d.benchmark || []).map(b => `
    <div class="nlp-bench-card">
      <div class="nlp-bench-card-label">${b.label}</div>
      <div class="nlp-bench-bar-wrap"><div class="nlp-bench-bar ${b.cls}" style="width:${b.pct}%"></div></div>
      <div class="nlp-bench-vals"><span><strong>${b.mine}</strong></span><span>${b.pct}%</span></div>
    </div>`).join('');
  const tableRows = (d.benchmark || []).map(b => `
    <tr>
      <td>${b.label}</td>
      <td>${b.mine}</td>
      <td>${b.industry}</td>
      <td><span class="nlp-bench-tag ${b.tag}">${b.tagLabel}</span></td>
    </tr>`).join('');
  return `<div class="nlp-bench-wrap">
    <div class="nlp-bench-title"><i class="fas fa-balance-scale" style="color:#7c3aed"></i> Industry Benchmark Comparison — ${d.client} · ${d.id}</div>
    <div class="nlp-bench-grid">${barHtml}</div>
    <table class="nlp-bench-table">
      <thead><tr><th>Metric</th><th>This Policy</th><th>Industry Benchmark</th><th>Assessment</th></tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
  </div>`;
}

function _nlpBuildPortfolioView() {
  const kpis = `<div class="nlp-portfolio-kpis">
    <div class="nlp-pkpi"><div class="nlp-pkpi-icon red"><i class="fas fa-exclamation-circle"></i></div><div><div class="nlp-pkpi-val">2</div><div class="nlp-pkpi-lbl">Urgent Risks</div></div></div>
    <div class="nlp-pkpi"><div class="nlp-pkpi-icon orange"><i class="fas fa-flag"></i></div><div><div class="nlp-pkpi-val">3</div><div class="nlp-pkpi-lbl">Clauses Flagged</div></div></div>
    <div class="nlp-pkpi"><div class="nlp-pkpi-icon blue"><i class="fas fa-file-contract"></i></div><div><div class="nlp-pkpi-val">8</div><div class="nlp-pkpi-lbl">Policies Scanned</div></div></div>
    <div class="nlp-pkpi"><div class="nlp-pkpi-icon green"><i class="fas fa-check-shield"></i></div><div><div class="nlp-pkpi-val">94%</div><div class="nlp-pkpi-lbl">NLP Accuracy</div></div></div>
  </div>`;
  const rows = nlpPortfolioData.map(p => `
    <div class="nlp-portfolio-row ${p.cls}" onclick="openNLPReview('${p.id}')">
      <span class="nlp-pr-id">${p.id}</span>
      <span class="nlp-pr-client">${p.client}</span>
      <span class="nlp-pr-type">${p.type}</span>
      <span class="nlp-pr-score">${p.score}</span>
      <span class="nlp-pr-flag">${p.flag}</span>
      <i class="fas fa-chevron-right nlp-pr-arrow"></i>
    </div>`).join('');
  return `<div class="nlp-portfolio-header">
    <h3>Full Portfolio NLP Scan</h3>
    <p>All 8 policies analyzed — sorted by risk score (lowest = most urgent)</p>
    ${kpis}
  </div>
  <div class="nlp-portfolio-list">${rows}</div>`;
}

// ── Hook into policy modal NLP tab ──────────────────────────────
const _origSwitchPolicyTab = window.switchPolicyTab;
window.switchPolicyTab = function(tab, tabEl) {
  if (tab === 'nlp') {
    // Get current policy from the modal
    const policyId = window._currentPolicyModalId || null;
    if (policyId) openNLPReview(policyId);
    return;
  }
  if (typeof _origSwitchPolicyTab === 'function') _origSwitchPolicyTab(tab, tabEl);
};

// ================================================================
//  TASK #13 — CLAIMS INTELLIGENCE & FRAUD DETECTION
// ================================================================

// ── Per-claim intelligence data ──
const claimIntelligenceData = {
  'CLM-2026-0041': {
    fraudScore: 42, fraudLevel: 'watch',
    headline: 'High-Value $1M Claim — Enhanced Review Active',
    triageLabel: '⚡ Expedite', triageSub: 'Missing ID docs',
    eta: '~1 day',
    fraudDesc: 'High-value threshold ($1M) triggered enhanced review. Policy history clean (8 years). Claimant identity docs pending — routine for large claims. Cause of death independently verified through official death registry.',
    fraudSignals: [
      { level:'watch', text:'$1M threshold — auto-enhanced review protocol activated' },
      { level:'clear', text:'Policy in excellent standing since 2018 — 8 years premiums paid' },
      { level:'clear', text:'Death certificate verified against public registry' },
      { level:'watch', text:'Beneficiary identity documents (Susan Chen) not yet submitted' },
    ],
    nlp: 'Death certificate NLP-verified. Cause of death (cardiac event) consistent with age and medical history. Beneficiary name matches policy designation. Identity documents outstanding — standard delay for large claims.',
    resFactors: [
      { label: 'Document completeness', val: '50% (2/4 docs)' },
      { label: 'Verification status', val: 'Death cert verified' },
      { label: 'Predicted payout', val: '2026-04-17 to 2026-04-19' },
      { label: 'Blocking item', val: 'Susan Chen ID + bank details' },
    ],
    actions: [
      '⚡ Call Susan Chen today — request photo ID and bank account details',
      'Mark claim as priority in claims system',
      'Prepare compassionate follow-up script for beneficiary support',
      'Identify if Susan Chen needs new coverage after payout (~$1M estate)',
    ],
  },
  'CLM-2026-0038': {
    fraudScore: 12, fraudLevel: 'clear',
    headline: 'LTC Monthly Claim — Plan of Care Needed',
    triageLabel: '📋 Doc Request', triageSub: 'Plan of care pending',
    eta: '~8 days',
    fraudDesc: 'No fraud indicators detected. LTC claim is standard. Policy history excellent. All medical eligibility criteria satisfied. Routine document follow-up only.',
    fraudSignals: [
      { level:'clear', text:'Policy in force since 2018 — continuous premiums' },
      { level:'clear', text:'LTC eligibility certification NLP-verified' },
      { level:'clear', text:'No claim history inconsistencies detected' },
    ],
    nlp: 'LTC eligibility certificate NLP-verified at 99% confidence. ADL assessment consistent with claim type. Plan of care document outstanding — auto-reminder drafted and ready to send to home health agency.',
    resFactors: [
      { label: 'Document completeness', val: '50% (2/4 docs)' },
      { label: 'Blocking item', val: 'Plan of Care from home health agency' },
      { label: 'First payment ETA', val: '2026-04-20' },
      { label: 'Monthly recurring', val: '$1,500/month (200/day × 7.5)' },
    ],
    actions: [
      'Send plan-of-care reminder to home health agency',
      'Set up recurring monthly claim schedule once approved',
      'Review NYC LTC costs vs benefit at next annual review',
      'Consider annuity income supplement for any benefit gap',
    ],
  },
  'CLM-2026-0035': {
    fraudScore: 18, fraudLevel: 'clear',
    headline: 'Disability — APS from Dr. Hernandez Blocking Progress',
    triageLabel: '🩺 APS Needed', triageSub: 'Physician stmt pending',
    eta: '~21 days',
    fraudDesc: 'No fraud indicators. Standard disability claim. Back surgery on 2026-03-10 consistent with claim. Employer income verification also pending — routine.',
    fraudSignals: [
      { level:'clear', text:'Claim type consistent with documented medical event' },
      { level:'clear', text:'Employment history verified — no gaps or inconsistencies' },
      { level:'watch', text:'APS not yet received — 22 days pending (flagged for follow-up)' },
    ],
    nlp: 'APS form partially extracted by NLP. Diagnosis code and surgery date confirmed. Employer verification section blank — auto-reminder queued. 90-day elimination period calculated: benefits begin ~2026-06-10.',
    resFactors: [
      { label: 'Document completeness', val: '50% (2/4 docs)' },
      { label: 'Blocking item', val: 'APS from Dr. Hernandez' },
      { label: 'Elimination period ends', val: '2026-06-10' },
      { label: 'Monthly benefit', val: '$4,200 (60% income replacement)' },
    ],
    actions: [
      'Call Dr. Hernandez office directly to expedite APS',
      'Send employer income verification reminder to Maria',
      'Confirm elimination period end date (~June 10, 2026)',
      'Review coverage adequacy — 60% income may be insufficient long-term',
    ],
  },
  'CLM-2026-0033': {
    fraudScore: 9, fraudLevel: 'clear',
    headline: 'LTC File Complete — Approval Imminent',
    triageLabel: '✅ On Track', triageSub: 'Approval imminent',
    eta: '~3 days',
    fraudDesc: 'All documents received and NLP-verified. ADL threshold met (2 of 6 ADLs). Facility admission confirmed. No fraud indicators. Approval expected within 5 business days.',
    fraudSignals: [
      { level:'clear', text:'All 4 documents received and NLP-verified at 100%' },
      { level:'clear', text:'ADL assessment consistent with LTC eligibility requirements' },
      { level:'clear', text:'Facility admission confirmed by care home' },
    ],
    nlp: 'All documents NLP-verified: facility admission, ADL assessment, LTC eligibility certification, and physician statement all match policy terms. No inconsistencies detected. Ready for approval.',
    resFactors: [
      { label: 'Document completeness', val: '100% (4/4 docs) ✅' },
      { label: 'Approval expected', val: '2026-04-15' },
      { label: 'First payment ETA', val: '2026-04-18' },
      { label: 'Daily benefit', val: '$800/day (LTC benefit)' },
    ],
    actions: [
      'No urgent action needed — monitor for approval by 2026-04-15',
      'Notify James Whitfield of expected approval timeline',
      'Review benefit adequacy vs NYC assisted living costs at renewal',
    ],
  },
  'CLM-2026-0031': {
    fraudScore: 7, fraudLevel: 'clear',
    headline: 'Premium Waiver Active — Monitor Recovery Timeline',
    triageLabel: '✅ Waiver Active', triageSub: 'Monitor recovery',
    eta: 'Open',
    fraudDesc: 'No fraud indicators. Waiver of premium is a standard benefit triggered by disability. Physician recovery estimate of June 2026 is consistent with condition. All documents verified.',
    fraudSignals: [
      { level:'clear', text:'All documents verified — complete file' },
      { level:'clear', text:'Physician statement consistent with disability claim type' },
      { level:'clear', text:'Premium waiver benefit confirmed in policy terms' },
    ],
    nlp: 'All 4 documents NLP-verified. Physician disability statement consistent with claim. Premium waiver approved through ~June 2026. Auto-reminder scheduled for reinstatement in May.',
    resFactors: [
      { label: 'Waiver active until', val: '~June 2026' },
      { label: 'Annual premium waived', val: '$9,600/yr ($2,400/quarter)' },
      { label: 'Recovery estimate', val: 'June 2026 per physician' },
      { label: 'Reinstatement reminder', val: 'May 2026 scheduled' },
    ],
    actions: [
      'Schedule premium reinstatement reminder for June 2026',
      'Confirm Linda Morrison recovery status in May',
      'Annual review April 15 — include waiver update in agenda',
    ],
  },
  'CLM-2026-0028': {
    fraudScore: 38, fraudLevel: 'watch',
    headline: '⚡ URGENT — Compassionate ADB Case: Terminal Certification Pending',
    triageLabel: '⚡ Compassionate', triageSub: 'Terminal — expedite',
    eta: '~9 days',
    fraudDesc: 'Watch status — not indicative of fraud. ADB for terminal illness requires expedited compassionate handling. Terminal certification pending from oncologist. NLP detected minor date discrepancy between diagnosis report and referral — requires clarification before payout.',
    fraudSignals: [
      { level:'watch', text:'ADB claim filed 30 days post-diagnosis — within normal range but noted' },
      { level:'watch', text:'NLP: date discrepancy — diagnosis 2025-12-10 vs referral 2026-01-15' },
      { level:'clear', text:'Policy in excellent standing — premiums current' },
      { level:'clear', text:'Oncologist identity verified through medical registry' },
    ],
    nlp: 'Terminal illness certification pending from oncologist. NLP analysis: date discrepancy between diagnosis date in patient summary (2025-12-10) and oncologist referral form (2026-01-15). Requires a single clarifying note from Dr. Hernandez before payout can proceed.',
    resFactors: [
      { label: 'Document completeness', val: '50% (2/4 docs)' },
      { label: 'Blocking item', val: 'Terminal illness certification' },
      { label: 'NLP flag', val: 'Date discrepancy — clarification needed' },
      { label: 'Payout ETA', val: '~9 days after certification received' },
    ],
    actions: [
      '⚡ Call Dr. Hernandez office immediately — request expedited terminal certification',
      'Request brief clarification note re: diagnosis date discrepancy',
      'Assign senior adjuster for compassionate handling',
      'Prepare payout wire instructions in advance',
      'Schedule compassionate support follow-up call with Maria Gonzalez',
    ],
  },
  'CLM-2026-0025': {
    fraudScore: 78, fraudLevel: 'flagged',
    headline: '🚨 Flagged — Policy in Pending Status at Time of Death',
    triageLabel: '🚨 Fraud Review', triageSub: 'Coverage pending',
    eta: 'HOLD',
    fraudDesc: 'FLAGGED: Policy P-100350 was in Pending (not yet In-Force) status at date of death. Coverage determination is required before any payout can proceed. Three ML anomalies detected. Urgent coordination with underwriting team required.',
    fraudSignals: [
      { level:'flagged', text:'Policy was in Pending status at time of death — coverage not yet in force' },
      { level:'flagged', text:'Medical records inconsistency — submitted records do not match underwriting application' },
      { level:'flagged', text:'Contestability review: new policy — 2-year incontestability period does not apply' },
      { level:'watch', text:'Only 1 of 4 documents received — investigation ongoing' },
    ],
    nlp: 'Policy application NLP-analyzed against submitted medical records. Inconsistency detected: application declared no pre-existing conditions; submitted medical records reference a prior condition. Underwriting must make binding determination before claim can be processed.',
    resFactors: [
      { label: 'Document completeness', val: '25% (1/4 docs)' },
      { label: 'Status', val: 'HOLD — coverage determination needed' },
      { label: 'ML anomalies detected', val: '3 signals flagged' },
      { label: 'Estimated resolution', val: 'Unknown pending investigation' },
    ],
    actions: [
      '⚡ Expedite medical records request from estate representatives',
      'Coordinate with underwriting team for binding coverage determination',
      'Document all communications with estate representatives',
      'If coverage confirmed in force: process $250K death benefit',
      'If coverage not in force: prepare denial letter per legal review',
    ],
  },
};

// ── CI Review Modal ──
function openCIReviewModal() {
  const overlay = document.getElementById('ci-review-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeCIReviewModal() {
  const overlay = document.getElementById('ci-review-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

// ── Smart Doc Request ──
function runSmartDocRequests() {
  const btn = event.currentTarget;
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> All 3 Sent!';
    btn.style.background = 'linear-gradient(135deg, #059669, #047857)';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1800);
}

function sendDocRequest(claimId, recipient) {
  const btn = event.currentTarget;
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    btn.style.background = 'linear-gradient(135deg, #059669, #047857)';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.disabled = false;
    }, 2500);
  }, 1200);
}

// ── Claims Intelligence Tab Renderer (extends renderClaimModal) ──
// Patch switchClaimTab to support 'ci'
const _origSwitchClaimTab = window.switchClaimTab;
window.switchClaimTab = function(tab, tabEl) {
  _currentClaimTab = tab;
  document.querySelectorAll('#claim-modal-tabs .dmt-tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');
  renderClaimModal(_currentClaimId, tab);
};

// Extend renderClaimModal to support 'ci' tab
const _origRenderClaimModal = window.renderClaimModal;
window.renderClaimModal = function(claimId, tab) {
  if (tab !== 'ci') {
    _origRenderClaimModal(claimId, tab);
    return;
  }
  const c = claimData[claimId];
  const ci = claimIntelligenceData[claimId];
  if (!c || !ci) {
    _origRenderClaimModal(claimId, 'ai');
    return;
  }

  const bodyEl = document.getElementById('claim-modal-body');
  const titleEl = document.getElementById('claim-modal-title');
  const subEl = document.getElementById('claim-modal-subtitle');
  const hdrEl = document.getElementById('claim-modal-header');

  titleEl.textContent = c.id + ' — Intelligence Report';
  subEl.textContent = c.client + ' · ' + c.type + ' · ' + ci.triageLabel;
  if (hdrEl) hdrEl.style.borderBottomColor = '#0ea5e9';

  const fraudLevelColors = { clear:'#059669', watch:'#d97706', flagged:'#dc2626' };
  const fColor = fraudLevelColors[ci.fraudLevel] || '#0ea5e9';

  const signalHTML = ci.fraudSignals.map(s => {
    const iconMap = { clear:'fa-check-circle', watch:'fa-eye', flagged:'fa-exclamation-triangle' };
    const colorMap = { clear:'#059669', watch:'#d97706', flagged:'#dc2626' };
    return `<div class="ci-panel-point"><i class="fas ${iconMap[s.level]||'fa-info-circle'}" style="color:${colorMap[s.level]||'#64748b'}"></i><span>${s.text}</span></div>`;
  }).join('');

  const actionsHTML = ci.actions.map((a, i) =>
    `<div class="ci-panel-step"><span class="ci-panel-step-num">${i+1}</span><span>${a}</span></div>`
  ).join('');

  const resHTML = ci.resFactors.map(r =>
    `<div class="ci-res-forecast-row"><span class="ci-res-forecast-label">${r.label}</span><span class="ci-res-forecast-val">${r.val}</span></div>`
  ).join('');

  bodyEl.innerHTML = `
    <div class="ci-panel">
      <div class="ci-panel-header">
        <div class="ci-panel-score-ring">
          <span class="ci-panel-score-num" style="color:${fColor}">${ci.fraudScore}</span>
          <span class="ci-panel-score-lbl" style="color:${fColor}">${ci.fraudLevel.toUpperCase()}</span>
        </div>
        <div class="ci-panel-info">
          <div class="ci-panel-badge"><i class="fas fa-brain"></i> AI Claims Intelligence</div>
          <div class="ci-panel-headline">${ci.headline}</div>
          <div class="ci-panel-ref"><i class="fas fa-file-medical-alt"></i> ${c.id} · ${c.client} · ${c.type} · ETA: ${ci.eta}</div>
        </div>
      </div>
      <div class="ci-panel-grid">
        <div class="ci-panel-section">
          <div class="ci-panel-section-title"><i class="fas fa-shield-virus"></i> Fraud Risk Analysis</div>
          <div class="ci-panel-fraud-ring">
            <div class="ci-fraud-score-circle ${ci.fraudLevel}">
              <span class="ci-fsc-num">${ci.fraudScore}</span>
              <span class="ci-fsc-lbl">${ci.fraudLevel}</span>
            </div>
            <div class="ci-fraud-desc">${ci.fraudDesc}</div>
          </div>
          ${signalHTML}
        </div>
        <div class="ci-panel-section">
          <div class="ci-panel-section-title"><i class="fas fa-hourglass-half"></i> Resolution Forecast</div>
          <div class="ci-res-forecast">
            <div class="ci-res-forecast-title">Predictive Timeline Factors</div>
            ${resHTML}
          </div>
          <div class="ci-panel-section-title" style="margin-top:14px"><i class="fas fa-file-alt"></i> NLP Document Analysis</div>
          <div style="font-size:12px;color:#475569;line-height:1.6;background:#f0f9ff;padding:10px;border-radius:8px;border:1px solid #bae6fd">${ci.nlp}</div>
        </div>
      </div>
      <div class="ci-panel-section" style="margin-top:16px">
        <div class="ci-panel-section-title"><i class="fas fa-tasks"></i> Intelligence-Driven Actions</div>
        ${actionsHTML}
      </div>
      <div class="ci-panel-cta">
        <button class="btn btn-ai" onclick="navigateTo('ai-agents')"><i class="fas fa-robot"></i> Open Full AI Agent</button>
        <button class="btn btn-outline-sm" onclick="switchClaimTab('view', document.querySelectorAll('#claim-modal-tabs .dmt-tab')[0])"><i class="fas fa-eye"></i> Back to Claim</button>
      </div>
    </div>
  `;
};

// Update tabMap for claim modal to include 'ci' at index 2
const _origOpenClaimModal = window.openClaimModal;
window.openClaimModal = function(claimId, tab) {
  _currentClaimId = claimId;
  _currentClaimTab = tab || 'view';
  const overlay = document.getElementById('claim-modal-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  document.querySelectorAll('#claim-modal-tabs .dmt-tab').forEach(t => t.classList.remove('active'));
  const tabMap = { view: 0, ai: 1, ci: 2 };
  const tabs = document.querySelectorAll('#claim-modal-tabs .dmt-tab');
  const idx = tabMap[_currentClaimTab];
  if (tabs[idx !== undefined ? idx : 0]) tabs[idx !== undefined ? idx : 0].classList.add('active');
  renderClaimModal(_currentClaimId, _currentClaimTab);
};


// ================================================================
//  TASK #14 — RETENTION INTELLIGENCE & LAPSE PREVENTION ENGINE
// ================================================================

// ── Hook retention tab into Policy Modal ──────────────────────
const _origSwitchPolicyTabV2 = window.switchPolicyTab;
window.switchPolicyTab = function(tab, tabEl) {
  if (tab === 'retention') {
    const policyId = window._currentPolicyModalId || null;
    if (policyId) renderPolicyRetentionTab(policyId);
    return;
  }
  if (typeof _origSwitchPolicyTabV2 === 'function') _origSwitchPolicyTabV2(tab, tabEl);
};

// ── Lapse risk map (matches index.tsx) ──────────────────────────
const policyLapseMap = {
  'P-100291': { score:22,  level:'Low',    retId:'',              trigger:'Paid-up status — stable cash value growth' },
  'P-100292': { score:18,  level:'Low',    retId:'',              trigger:'WL flagship — no lapse risk detected' },
  'P-100293': { score:48,  level:'Medium', retId:'ret-james',     trigger:'LTC coverage gap $180/day — review at renewal' },
  'P-100301': { score:87,  level:'Urgent', retId:'ret-patricia',  trigger:'⚠ Under-funded UL — lapse predicted Jun 20, 2026' },
  'P-100302': { score:24,  level:'Low',    retId:'',              trigger:'VUL — market risk only, no funding risk' },
  'P-100310': { score:35,  level:'Low',    retId:'',              trigger:'Contestability window active — monitor' },
  'P-100320': { score:79,  level:'High',   retId:'ret-sandra',    trigger:'⚠ Term expiry Sep 15, 2026 — 153 days remaining' },
  'P-100330': { score:14,  level:'Low',    retId:'',              trigger:'WL strongest in book — $168K cash value' },
};

function renderPolicyRetentionTab(policyId) {
  const bodyEl = document.getElementById('policy-modal-body');
  if (!bodyEl) return;

  const l = policyLapseMap[policyId];
  const rd = l && l.retId ? retentionData[l.retId] : null;

  if (!l) {
    bodyEl.innerHTML = `<div style="padding:40px;text-align:center;color:#9ca3af"><i class="fas fa-heartbeat fa-2x" style="margin-bottom:12px"></i><br>Retention intelligence not available for this policy.</div>`;
    return;
  }

  const riskColor = l.score >= 75 ? '#dc2626' : l.score >= 50 ? '#f59e0b' : '#059669';
  const riskBg    = l.score >= 75 ? '#fef2f2' : l.score >= 50 ? '#fffbeb' : '#f0fdf4';
  const riskLabel = l.level;

  const signalsHtml = rd ? rd.signals.map(s => `
    <div class="ri-signal-row">
      <i class="fas ${s.icon}" style="color:${s.color};flex-shrink:0;margin-top:2px"></i>
      <span>${s.text}</span>
    </div>`).join('') : `<div class="ri-signal-row"><i class="fas fa-check-circle" style="color:#059669"></i><span>No significant lapse signals detected for this policy.</span></div>`;

  const actionHtml = rd ? rd.actionPlan.steps.map(s => `
    <div class="ri-action-step${s.urgent?' urgent':''}">
      <span class="ri-step-num${s.urgent?' urgent':''}">${s.urgent?'!':s.num}</span>
      <span>${s.text}</span>
    </div>`).join('') : `<div class="ri-action-step"><span class="ri-step-num">1</span><span>Continue regular annual review — no immediate action required.</span></div>`;

  const urgencyBanner = rd ? `<div class="ri-urgency-banner" style="background:${riskBg};color:${riskColor};border-left:4px solid ${riskColor}">${rd.actionPlan.urgency}</div>` : '';

  bodyEl.innerHTML = `
    <div class="ri-policy-tab">
      <div class="ri-pt-header">
        <div class="ri-pt-score-ring" style="border-color:${riskColor};background:${riskColor}15">
          <span class="ri-pt-score-num" style="color:${riskColor}">${l.score}</span>
          <span class="ri-pt-score-lbl">Lapse Risk</span>
        </div>
        <div class="ri-pt-summary">
          <div class="ri-pt-risk-badge" style="background:${riskColor}20;color:${riskColor};border:1px solid ${riskColor}40">
            <i class="fas fa-heartbeat"></i> ${riskLabel} Risk
          </div>
          <div class="ri-pt-trigger">${l.trigger}</div>
          ${rd ? `<div class="ri-pt-client-info">${rd.client} · Age ${rd.age} · ${rd.policyType} · ${rd.premium}</div>` : ''}
        </div>
        <div class="ri-pt-actions">
          ${rd ? `<button class="btn btn-ai" onclick="openRetentionModal('${l.retId}')"><i class="fas fa-bolt"></i> Full Retention Analysis</button>` : ''}
          <button class="btn btn-outline-sm" onclick="openRenewalCenter()"><i class="fas fa-sync-alt"></i> Renewal Center</button>
        </div>
      </div>
      <div class="ri-pt-body">
        <div class="ri-pt-section">
          <div class="ri-pt-section-title"><i class="fas fa-signal"></i> Retention Risk Signals</div>
          <div class="ri-signals-list">${signalsHtml}</div>
        </div>
        <div class="ri-pt-section">
          ${urgencyBanner}
          <div class="ri-pt-section-title" style="margin-top:${rd?'12px':'0'}"><i class="fas fa-tasks"></i> AI Recommended Actions</div>
          <div class="ri-action-steps">${actionHtml}</div>
          ${rd ? `<div class="ri-retention-value"><i class="fas fa-dollar-sign"></i><span><strong>Estimated Retention Value:</strong> ${rd.actionPlan.estimatedRetentionValue}</span></div>` : ''}
        </div>
      </div>
    </div>
  `;
}

// ── Retention Full Report Modal ──────────────────────────────────
let _currentRIReportTab = 'overview';

function openRetentionFullReport() {
  _currentRIReportTab = 'overview';
  const overlay = document.getElementById('ri-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  document.querySelectorAll('#ri-overlay .ri-rtab').forEach((t,i) => t.classList.toggle('active', i===0));
  renderRIReport('overview');
}

function closeRetentionFullReport(e) {
  if (e && e.target !== document.getElementById('ri-overlay')) return;
  const overlay = document.getElementById('ri-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function switchRIReportTab(tab, btn) {
  _currentRIReportTab = tab;
  document.querySelectorAll('#ri-overlay .ri-rtab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderRIReport(tab);
}

function renderRIReport(tab) {
  const body = document.getElementById('ri-report-body');
  if (!body) return;

  if (tab === 'overview') {
    body.innerHTML = `
      <div class="ri-rpt-overview">
        <div class="ri-rpt-kpi-strip">
          <div class="ri-rpt-kpi red"><span class="ri-rpt-kval">2</span><span class="ri-rpt-klbl">Urgent Lapse Risk</span></div>
          <div class="ri-rpt-kpi orange"><span class="ri-rpt-kval">4</span><span class="ri-rpt-klbl">High Risk</span></div>
          <div class="ri-rpt-kpi gold"><span class="ri-rpt-kval">23</span><span class="ri-rpt-klbl">Renewals Due (90d)</span></div>
          <div class="ri-rpt-kpi blue"><span class="ri-rpt-kval">$62.6K</span><span class="ri-rpt-klbl">Annual Premium at Risk</span></div>
          <div class="ri-rpt-kpi green"><span class="ri-rpt-kval">94%</span><span class="ri-rpt-klbl">Retention Rate YTD</span></div>
        </div>
        <div class="ri-rpt-grid">
          <div class="ri-rpt-section">
            <div class="ri-rpt-section-title"><i class="fas fa-exclamation-triangle"></i> Urgent Lapse Risks</div>
            <div class="ri-rpt-risk-table">
              <div class="ri-rpt-risk-row header">
                <span>Client</span><span>Policy</span><span>Trigger</span><span>Score</span><span>Days</span><span>Action</span>
              </div>
              ${[
                {client:'Patricia Nguyen', policy:'P-100301', trigger:'UL Under-funded', score:87, days:'~68d', color:'#dc2626', retId:'ret-patricia'},
                {client:'Sandra Williams', policy:'P-100320', trigger:'Term Expiry Sep-26', score:79, days:'153d', color:'#d97706', retId:'ret-sandra'},
                {client:'Kevin Park',      policy:'P-100350', trigger:'Claim Pending', score:72, days:'Active', color:'#7c3aed', retId:'ret-kevin'},
                {client:'David Thompson',  policy:'P-100380', trigger:'Under-insured', score:54, days:'30d', color:'#f59e0b', retId:'ret-david'},
                {client:'James Whitfield', policy:'P-100293', trigger:'LTC Gap', score:48, days:'Renewal', color:'#8b5cf6', retId:'ret-james'},
              ].map(r => `
                <div class="ri-rpt-risk-row" onclick="openRetentionModal('${r.retId}')">
                  <span class="ri-rpt-client">${r.client}</span>
                  <span class="ri-rpt-policy">${r.policy}</span>
                  <span class="ri-rpt-trigger">${r.trigger}</span>
                  <span class="ri-rpt-score" style="color:${r.color};font-weight:700">${r.score}</span>
                  <span class="ri-rpt-days" style="color:${r.color}">${r.days}</span>
                  <span><button class="ri-rpt-act-btn" onclick="event.stopPropagation();openRetentionModal('${r.retId}')"><i class="fas fa-bolt"></i> Act</button></span>
                </div>`).join('')}
            </div>
          </div>
          <div class="ri-rpt-section">
            <div class="ri-rpt-section-title"><i class="fas fa-chart-bar"></i> Risk Distribution</div>
            <div class="ri-rpt-dist">
              <div class="ri-rpt-dist-row"><span class="ri-rpt-dist-lbl">🔴 Urgent (75–100)</span><div class="ri-rpt-dist-bar-outer"><div class="ri-rpt-dist-bar" style="width:13%;background:#dc2626"></div></div><span>2 clients</span></div>
              <div class="ri-rpt-dist-row"><span class="ri-rpt-dist-lbl">🟠 High (55–74)</span><div class="ri-rpt-dist-bar-outer"><div class="ri-rpt-dist-bar" style="width:27%;background:#d97706"></div></div><span>4 clients</span></div>
              <div class="ri-rpt-dist-row"><span class="ri-rpt-dist-lbl">🟡 Medium (35–54)</span><div class="ri-rpt-dist-bar-outer"><div class="ri-rpt-dist-bar" style="width:73%;background:#f59e0b"></div></div><span>11 clients</span></div>
              <div class="ri-rpt-dist-row"><span class="ri-rpt-dist-lbl">🟢 Low (0–34)</span><div class="ri-rpt-dist-bar-outer"><div class="ri-rpt-dist-bar" style="width:100%;background:#059669"></div></div><span>232 clients</span></div>
            </div>
            <div class="ri-rpt-section-title" style="margin-top:20px"><i class="fas fa-coins"></i> Premium at Risk by Trigger Type</div>
            <div class="ri-rpt-dist">
              <div class="ri-rpt-dist-row"><span class="ri-rpt-dist-lbl">UL Under-funding</span><div class="ri-rpt-dist-bar-outer"><div class="ri-rpt-dist-bar" style="width:56%;background:#dc2626"></div></div><span>$5.8K/yr</span></div>
              <div class="ri-rpt-dist-row"><span class="ri-rpt-dist-lbl">Term Renewal</span><div class="ri-rpt-dist-bar-outer"><div class="ri-rpt-dist-bar" style="width:100%;background:#d97706"></div></div><span>$10.6K/yr</span></div>
              <div class="ri-rpt-dist-row"><span class="ri-rpt-dist-lbl">Under-insured Drift</span><div class="ri-rpt-dist-bar-outer"><div class="ri-rpt-dist-bar" style="width:23%;background:#f59e0b"></div></div><span>$2.4K/yr</span></div>
              <div class="ri-rpt-dist-row"><span class="ri-rpt-dist-lbl">Coverage Gap</span><div class="ri-rpt-dist-bar-outer"><div class="ri-rpt-dist-bar" style="width:100%;background:#8b5cf6"></div></div><span>$12.4K/yr</span></div>
            </div>
          </div>
        </div>
        <div class="ri-rpt-footer-btns">
          <button class="ri-rpt-fbtn" onclick="closeRetentionFullReport()"><i class="fas fa-times"></i> Close</button>
          <button class="ri-rpt-fbtn primary" onclick="sendQuickMessage('Run full retention intelligence scan — score all 247 clients for lapse risk, renewal risk, and coverage gaps');closeRetentionFullReport()"><i class="fas fa-robot"></i> AI Full Scan</button>
        </div>
      </div>
    `;
  } else if (tab === 'clients') {
    const clients = [
      {client:'Patricia Nguyen', age:38, policy:'P-100301', type:'Universal Life', premium:'$5,800/yr', score:87, level:'Urgent', color:'#dc2626', retId:'ret-patricia', trigger:'UL Under-funded'},
      {client:'Sandra Williams', age:61, policy:'P-100320', type:'Term Life 20-yr', premium:'$8,200/yr', score:79, level:'High', color:'#d97706', retId:'ret-sandra', trigger:'Term Expiry Sep-26'},
      {client:'Kevin Park',      age:29, policy:'P-100350', type:'Term Life', premium:'$1,800/yr', score:72, level:'High', color:'#d97706', retId:'ret-kevin', trigger:'Claim Pending'},
      {client:'David Thompson',  age:33, policy:'P-100380', type:'Term Life', premium:'$2,400/yr', score:54, level:'Medium', color:'#f59e0b', retId:'ret-david', trigger:'Under-insured'},
      {client:'James Whitfield', age:62, policy:'P-100293', type:'Long-Term Care', premium:'$12,400/yr', score:48, level:'Medium', color:'#8b5cf6', retId:'ret-james', trigger:'LTC Coverage Gap'},
    ];
    body.innerHTML = `
      <div style="padding:20px 24px">
        <div class="ri-rpt-section-title"><i class="fas fa-users"></i> At-Risk Client Profiles</div>
        <div class="ri-client-cards">
          ${clients.map(c => `
            <div class="ri-client-card" onclick="closeRetentionFullReport();setTimeout(()=>openRetentionModal('${c.retId}'),100)">
              <div class="ri-cc-header" style="border-left:4px solid ${c.color}">
                <div class="ri-cc-avatar">${c.client.split(' ').map(n=>n[0]).join('')}</div>
                <div>
                  <div class="ri-cc-name">${c.client}</div>
                  <div class="ri-cc-sub">Age ${c.age} · ${c.type}</div>
                </div>
                <div class="ri-cc-score" style="color:${c.color}">${c.score}</div>
              </div>
              <div class="ri-cc-body">
                <div class="ri-cc-row"><span>Policy</span><span>${c.policy}</span></div>
                <div class="ri-cc-row"><span>Premium at Risk</span><span style="font-weight:600">${c.premium}</span></div>
                <div class="ri-cc-row"><span>Trigger</span><span style="color:${c.color}">${c.trigger}</span></div>
                <div class="ri-cc-row"><span>Risk Level</span><span class="ri-cc-level" style="color:${c.color}">${c.level}</span></div>
              </div>
              <button class="ri-cc-btn" style="border-color:${c.color};color:${c.color}" onclick="event.stopPropagation();closeRetentionFullReport();setTimeout(()=>openRetentionModal('${c.retId}'),100)">
                <i class="fas fa-bolt"></i> View Full Analysis
              </button>
            </div>`).join('')}
        </div>
      </div>
    `;
  } else if (tab === 'forecast') {
    body.innerHTML = `
      <div style="padding:20px 24px">
        <div class="ri-rpt-section-title"><i class="fas fa-chart-line"></i> 90-Day Lapse Forecast</div>
        <div class="ri-forecast-table">
          <div class="ri-fc-row header">
            <span>Client</span><span>Trigger Date</span><span>Lapse Probability</span><span>Premium at Risk</span><span>AI Recommendation</span>
          </div>
          <div class="ri-fc-row urgent">
            <span>Patricia Nguyen</span><span class="red">Jun 20, 2026</span>
            <div class="ri-fc-prob-bar"><div class="ri-fc-fill" style="width:87%;background:#dc2626"></div><span>87%</span></div>
            <span>$5,800/yr</span><span>Call this week · Premium catch-up illustration</span>
          </div>
          <div class="ri-fc-row high">
            <span>Sandra Williams</span><span class="orange">Sep 15, 2026</span>
            <div class="ri-fc-prob-bar"><div class="ri-fc-fill" style="width:79%;background:#d97706"></div><span>79%</span></div>
            <span>$8,200/yr</span><span>Schedule conversion review in 7 days</span>
          </div>
          <div class="ri-fc-row med">
            <span>Kevin Park</span><span class="purple">Pending</span>
            <div class="ri-fc-prob-bar"><div class="ri-fc-fill" style="width:72%;background:#7c3aed"></div><span>72%</span></div>
            <span>$1,800/yr</span><span>Coordinate with Claims — legal review</span>
          </div>
          <div class="ri-fc-row med">
            <span>David Thompson</span><span class="orange">30-day drift</span>
            <div class="ri-fc-prob-bar"><div class="ri-fc-fill" style="width:54%;background:#f59e0b"></div><span>54%</span></div>
            <span>$2,400/yr</span><span>Life stage review call — DI pitch</span>
          </div>
          <div class="ri-fc-row low">
            <span>James Whitfield</span><span class="purple">Renewal</span>
            <div class="ri-fc-prob-bar"><div class="ri-fc-fill" style="width:48%;background:#8b5cf6"></div><span>48%</span></div>
            <span>$12,400/yr</span><span>Coverage gap review at next renewal</span>
          </div>
        </div>
        <div class="ri-rpt-section-title" style="margin-top:24px"><i class="fas fa-dollar-sign"></i> Revenue Retention Opportunity</div>
        <div class="ri-retention-value-strip">
          <div class="ri-rv-card"><div class="ri-rv-val">$62,600</div><div class="ri-rv-lbl">Annual Premium at Risk</div></div>
          <div class="ri-rv-card"><div class="ri-rv-val">$31.2K</div><div class="ri-rv-lbl">AI Revenue Unlocked (YTD)</div></div>
          <div class="ri-rv-card green"><div class="ri-rv-val">$48K+</div><div class="ri-rv-lbl">Estimated Retention Value if All Saved</div></div>
          <div class="ri-rv-card blue"><div class="ri-rv-val">23</div><div class="ri-rv-lbl">Renewals in AI Renewal Campaign</div></div>
        </div>
      </div>
    `;
  }
}

// ── Renewal Action Center toggle ─────────────────────────────────
let _racOpen = false;
function openRenewalCenter() {
  _racOpen = true;
  const el = document.getElementById('renewal-action-center');
  if (el) { el.style.display = 'block'; el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
}
function toggleRenewalCenter() {
  const el = document.getElementById('renewal-action-center');
  if (!el) return;
  _racOpen = !_racOpen;
  el.style.display = _racOpen ? 'block' : 'none';
}
function runRenewalCampaign() {
  sendQuickMessage('Run the full renewal email campaign for all 23 clients due in 90 days — draft personalised emails for each, prioritised by lapse risk score');
}

// ── Retention Email Draft Modal ──────────────────────────────────
const retentionEmailDrafts = {
  'patricia': {
    subject: 'Re: Your Policy P-100301 — Premium Health Check',
    to: 'Patricia Nguyen <pnguyen@email.com>',
    preview: `Dear Patricia,

I hope this message finds you well. I'm reaching out regarding your Universal Life policy (P-100301), which I've been monitoring as part of our proactive client care programme.

Our AI policy health system has flagged that your policy's cash value — currently at $21,400 — is approaching the minimum threshold required to sustain your current cost of insurance. To ensure your $500,000 coverage remains fully in force, I'd like to schedule a brief call this week to walk through some flexible premium options.

Your choices include:
• A modest premium catch-up of $600/month for 3 months
• A one-time top-up of $1,800
• A premium restructure to $2,400/yr flat

None of these options require any new medical underwriting. This is simply about keeping your excellent policy — which you've maintained since 2022 — in peak health.

Please let me know your availability this week for a 20-minute call.

Warm regards,
Your NYL Agent`
  },
  'sandra': {
    subject: 'Your Term Policy — Important: Conversion Window Closing Sept 2026',
    to: 'Sandra Williams <sandra.w@email.com>',
    preview: `Dear Sandra,

I'm writing to you today about something important regarding your 20-year term life policy (P-100320), which expires in September 2026 — just 153 days from now.

As you approach your policy's renewal date, you have a valuable option available to you: the ability to convert to permanent coverage (Whole Life or Universal Life) without any new medical examination. This conversion right closes on September 15, 2026.

Given your age and the significant coverage you have in place ($350,000 for Michael), I'd like to schedule a comprehensive review to walk through:
• Your conversion options and what each costs at your current age
• How Whole Life builds tax-advantaged cash value over time
• How this decision fits your overall estate planning goals

This is a time-sensitive decision — but it's also one of the most impactful financial moves available to you right now.

Can we schedule 45 minutes this week or next? I'd love to include Michael in the conversation.

Warm regards,
Your NYL Agent`
  },
  'james': {
    subject: 'James — LTC Coverage Review for 2026 Renewal',
    to: 'James Whitfield <james.w@email.com>',
    preview: `Dear James,

As your LTC policy (P-100293) approaches its renewal, I wanted to share something I've been reviewing for you. Our AI benefit analysis has identified that your current daily benefit of $200/day was set in 2022 — but New York City's average long-term care cost has risen to $380/day in 2026.

While your 3% inflation rider has been compounding, there's currently a $180/day gap between your benefit and actual facility costs in our area.

At your upcoming renewal, I'd like to explore options to close this gap — including increasing your daily benefit to $280–$300/day, or extending your benefit period from 3 years to 5 years. I'll have illustrations ready showing both the cost and the long-term risk mitigation.

Let's schedule your renewal review soon. Would April 28 work for you?

Best regards,
Your NYL Agent`
  },
  'david': {
    subject: 'David — Protecting What Matters Most at 33',
    to: 'David Thompson <david.t@email.com>',
    preview: `Hi David,

Thank you for our recent conversation about your Term Life policy — it was great catching up.

I've been thinking about your financial picture, and I wanted to share something: as a 33-year-old with a great career ahead of you, your income is actually your most valuable asset. And right now, it's the one thing that isn't fully protected.

Your $300K term policy is a great foundation. But I'd like to introduce you to two products that could make a real difference:

1. Disability Insurance — if something happened and you couldn't work, how would your household expenses be covered? DI replaces up to 60% of your income.

2. 529 College Savings Plan — if children are part of your future plans, now is the perfect time to start building education savings with tax-advantaged growth.

I'd love to schedule a "life stage review" — a 30-minute conversation about where you are, where you're headed, and what kind of protection makes sense.

When works best for you this month?

All the best,
Your NYL Agent`
  }
};

function draftRetentionEmail(clientKey) {
  const draft = retentionEmailDrafts[clientKey];
  if (!draft) return;

  const subEl = document.getElementById('ri-email-sub');
  if (subEl) subEl.textContent = 'To: ' + draft.to;

  const body = document.getElementById('ri-email-body');
  if (body) {
    body.innerHTML = `
      <div class="ri-email-meta">
        <div class="ri-email-meta-row"><span class="ri-em-lbl">To:</span><span class="ri-em-val">${draft.to}</span></div>
        <div class="ri-email-meta-row"><span class="ri-em-lbl">Subject:</span><span class="ri-em-val bold">${draft.subject}</span></div>
        <div class="ri-email-meta-row"><span class="ri-em-lbl">Generated by:</span><span class="ri-em-val ai-badge"><i class="fas fa-brain"></i> Retention Intelligence AI</span></div>
      </div>
      <div class="ri-email-body-text">${draft.preview.replace(/\n/g, '<br>')}</div>
      <div class="ri-email-actions">
        <button class="ri-ea-btn primary" onclick="closeRetentionEmailModal()"><i class="fas fa-paper-plane"></i> Send Email</button>
        <button class="ri-ea-btn" onclick="closeRetentionEmailModal()"><i class="fas fa-edit"></i> Edit First</button>
        <button class="ri-ea-btn" onclick="closeRetentionEmailModal()"><i class="fas fa-times"></i> Cancel</button>
      </div>
    `;
  }

  const overlay = document.getElementById('ri-email-overlay');
  if (overlay) { overlay.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}

function closeRetentionEmailModal(e) {
  if (e && e.target !== document.getElementById('ri-email-overlay')) return;
  const overlay = document.getElementById('ri-email-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

// ── Click-outside for RI overlay ──────────────────────────────────
(function(){
  const el = document.getElementById('ri-overlay');
  if (el) el.addEventListener('click', function(e){ if(e.target===el) closeRetentionFullReport(e); });
  const el2 = document.getElementById('ri-email-overlay');
  if (el2) el2.addEventListener('click', function(e){ if(e.target===el2) closeRetentionEmailModal(e); });
})();


/* =====================================================================
   TASK #15 — AI UNDERWRITING INTELLIGENCE & STP OPTIMIZATION
   ===================================================================== */

/* ── UW Intelligence tab in Case Detail Modal ── */
(function(){
  // Map each case to its UW intelligence analysis
  const uwiIntelData = {
    'UW-2026-0018': {
      stpClass: 'stp-high', recClass: 'auto', recLabel: '⚡ Auto-Approve Eligible',
      recNote: 'STP score 88 — all key evidence clear. Pending credit report only. Expected binding within 24 hrs.',
      signals: [
        { icon: 'fa-check-circle', color: '#059669', text: 'Age 34 · Preferred Plus age band — excellent mortality profile' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Rx History: No significant medications in past 5 years — clean slate' },
        { icon: 'fa-check-circle', color: '#059669', text: 'MIB: No adverse records, no prior declined applications' },
        { icon: 'fa-check-circle', color: '#059669', text: 'BMI 22.4 — optimal range, no extra mortality loading required' },
        { icon: 'fa-exclamation-triangle', color: '#d97706', text: 'Credit pending — unlikely to change decision, ETA 24 hrs' }
      ],
      nextSteps: ['Wait for credit report clearance (ETA Apr 11)', 'Auto-bind at Preferred Plus rate', 'Send E-App for e-signature', 'Issue policy within 24 hrs of credit clearance'],
      apsStatus: 'Eliminated — STP score ≥ 75, no medical flags', timeSaved: '14 days'
    },
    'UW-2026-0017': {
      stpClass: 'stp-high', recClass: 'review', recLabel: '🔍 Review Pending',
      recNote: 'STP 82 — Preferred rate eligible. MVR and credit pending. Controlled hypertension acceptable per NYL guidelines.',
      signals: [
        { icon: 'fa-check-circle', color: '#059669', text: 'Controlled hypertension (Lisinopril 10mg) — standard eligible per NYL guidelines' },
        { icon: 'fa-check-circle', color: '#059669', text: 'MIB clear — no prior declined applications or adverse history' },
        { icon: 'fa-check-circle', color: '#059669', text: 'BMI 24.1 — Preferred range' },
        { icon: 'fa-exclamation-triangle', color: '#d97706', text: 'MVR pending — single violation could adjust to Standard (not disqualifying)' },
        { icon: 'fa-exclamation-triangle', color: '#d97706', text: '$1M face value requires full evidence completion before binding' }
      ],
      nextSteps: ['Await MVR (expected today)', 'Confirm credit report (24 hrs)', 'Finalize Preferred rate', 'Issue same day once evidence complete'],
      apsStatus: 'Eliminated — HTN well-controlled, no APS required', timeSaved: '14 days'
    },
    'UW-2026-0016': {
      stpClass: 'stp-low', recClass: 'aps', recLabel: '⚠ APS Required',
      recNote: 'STP 61 — MIB flag and DM Rx history require physician statement. Prior DI claim (2021) needs medical context.',
      signals: [
        { icon: 'fa-exclamation-triangle', color: '#dc2626', text: 'Metformin (Type 2 DM) — flagged for APS review, DM affects DI eligibility' },
        { icon: 'fa-exclamation-triangle', color: '#dc2626', text: 'MIB flag: Prior DI claim 2021 (back injury) — requires context and medical records' },
        { icon: 'fa-exclamation-triangle', color: '#d97706', text: 'BMI 26.8 — borderline for DI preferred classification' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Rx checked — only DM medication, no other significant history' },
        { icon: 'fa-minus-circle', color: '#9ca3af', text: 'MVR and credit pending — order placed' }
      ],
      nextSteps: ['Order APS from primary care physician', 'Request medical records for 2021 DI claim', 'Await MVR and credit reports', 'Manual underwriting review required'],
      apsStatus: 'Required — MIB flag + DM Rx cannot be substituted', timeSaved: 'N/A'
    },
    'UW-2026-0015': {
      stpClass: 'stp-high', recClass: 'auto', recLabel: '⚡ Near Auto-Approve',
      recNote: 'STP 79 — one lab result pending. Once labs clear, auto-approve threshold likely met. APS eliminated via lab substitution.',
      signals: [
        { icon: 'fa-check-circle', color: '#059669', text: 'Rx, MIB, MVR all clear — no adverse findings' },
        { icon: 'fa-clock', color: '#d97706', text: 'Lab results pending — ETA 48 hrs. All other evidence clean.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Age 47 — UL $750K within standard mortality table without APS' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Hot lead — agent reports strong client motivation to bind quickly' }
      ],
      nextSteps: ['Expedite lab order (client requested)', 'Pre-clear for auto-approve pending labs', 'Target same-week binding', 'Prepare E-App for signature upon lab clearance'],
      apsStatus: 'Eliminated — Lab substituted for APS per NYL guidelines', timeSaved: '14 days'
    },
    'UW-2026-0014': {
      stpClass: 'stp-low', recClass: 'aps', recLabel: '⚠ APS Required',
      recNote: 'STP 44 — multiple flags at age 58 for annuity. MIB flag + lab abnormality require full medical review.',
      signals: [
        { icon: 'fa-exclamation-triangle', color: '#dc2626', text: 'MIB flag — undisclosed prior condition suspected. Full APS required.' },
        { icon: 'fa-exclamation-triangle', color: '#dc2626', text: 'Lab abnormality — elevated liver enzymes flagged. Requires physician review.' },
        { icon: 'fa-exclamation-triangle', color: '#d97706', text: 'Age 58 — multiple flags at this age require conservative UW approach' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Rx clean — no significant prescription drug history' }
      ],
      nextSteps: ['Order APS from primary care and specialist', 'Clarify MIB flag with applicant', 'Lab follow-up required from ordering physician', 'Full manual UW review — 15–21 day timeline'],
      apsStatus: 'Required — Multiple flags at age 58, cannot substitute', timeSaved: 'N/A'
    },
    'UW-2026-0013': {
      stpClass: 'stp-high', recClass: 'auto', recLabel: '⚡ Auto-Approve Eligible',
      recNote: 'STP 85 — all evidence complete and clean. Age 29, no flags. Ready for immediate auto-approval.',
      signals: [
        { icon: 'fa-check-circle', color: '#059669', text: 'All 4 evidence items complete and clear — Rx, MIB, MVR, Credit' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Age 29 — Preferred Plus age band, excellent mortality profile' },
        { icon: 'fa-check-circle', color: '#059669', text: 'No prior claims, no adverse MIB history, clean MVR' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Whole Life $300K — within auto-approve face value limits for age 29' }
      ],
      nextSteps: ['Auto-approve — all conditions met', 'Generate E-App for e-signature immediately', 'Target same-day binding', 'Client notification via agent portal'],
      apsStatus: 'Eliminated — All evidence clean at age 29', timeSaved: '14 days'
    },
    'UW-2026-0012': {
      stpClass: 'stp-high', recClass: 'auto', recLabel: '⚡ STP Auto-Approve',
      recNote: 'STP 91 — top-tier score. Medical exam and all labs complete. $1M WL — highest-value auto-approval in current pipeline.',
      signals: [
        { icon: 'fa-check-circle', color: '#059669', text: 'Medical exam completed — all vitals within Preferred Plus range' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Labs complete and clean — cholesterol, glucose, liver enzymes all normal' },
        { icon: 'fa-check-circle', color: '#059669', text: 'No Rx, no MIB flags, clean MVR — ideal low-risk profile' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Age 52 — appropriate for $1M WL without APS given clean medical exam' }
      ],
      nextSteps: ['Final UW sign-off — AI recommends immediate approval', 'Generate E-App now', 'Notify agent for signature coordination', 'Issue $1M WL policy — highest-value STP in Q2 2026'],
      apsStatus: 'Eliminated — Medical exam + labs substitute fully', timeSaved: '14 days'
    },
    'UW-2026-0011': {
      stpClass: 'stp-med', recClass: 'review', recLabel: '🔍 Manual Review Needed',
      recNote: 'STP 67 — lab abnormality requires APS for VUL. Manual UW review needed before decision.',
      signals: [
        { icon: 'fa-exclamation-triangle', color: '#dc2626', text: 'Lab flag — abnormal result requires physician APS to clarify' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Rx and MIB clean — no prior adverse history' },
        { icon: 'fa-exclamation-triangle', color: '#d97706', text: 'VUL $250K — lab flag at this product level requires manual review' },
        { icon: 'fa-clock', color: '#d97706', text: 'APS ordered — ETA 7–14 days depending on physician response' }
      ],
      nextSteps: ['Await APS from physician (7–14 days)', 'Manual UW review once APS received', 'Explore standard rate eligibility if lab explained', 'Keep client informed of timeline'],
      apsStatus: 'Required — Lab flag cannot be substituted for VUL', timeSaved: 'N/A'
    },
    'UW-2026-0010': {
      stpClass: 'stp-high', recClass: 'auto', recLabel: '✅ Approve Recommended',
      recNote: 'STP 78 — all evidence complete. AI recommends immediate approval. Decision due today — urgent.',
      signals: [
        { icon: 'fa-exclamation-circle', color: '#dc2626', text: 'Decision due TODAY — urgent. Delay risks client frustration.' },
        { icon: 'fa-check-circle', color: '#059669', text: 'All evidence complete — Rx, MIB, MVR, Credit all clear' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Age 33, Term $300K — low-risk profile, standard rate eligible' },
        { icon: 'fa-bolt', color: '#2563eb', text: 'STP 78 — above review threshold, AI recommends approval' }
      ],
      nextSteps: ['Issue approval TODAY — all conditions met', 'Generate E-App immediately', 'Agent notification for urgent signature coordination', 'Bind policy before end of business Apr 13'],
      apsStatus: 'Eliminated — All evidence complete, no medical flags', timeSaved: '14 days'
    },
    'UW-2026-0009': {
      stpClass: 'stp-high', recClass: 'issued', recLabel: '✅ Approved — Awaiting Sig.',
      recNote: 'STP 99 — highest score in portfolio. WL Rider Add-on for existing top client. AI 100% confidence.',
      signals: [
        { icon: 'fa-check-circle', color: '#059669', text: 'Existing client (Linda Morrison) — full medical history on file, all clean' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Rider add-on only — reduced underwriting scope, all evidence satisfied' },
        { icon: 'fa-check-circle', color: '#059669', text: 'STP 99 — maximum AI confidence score' },
        { icon: 'fa-file-signature', color: '#2563eb', text: 'E-App generated (EA-UW-009) — awaiting client e-signature' }
      ],
      nextSteps: ['Follow up with Linda on E-App signature (EA-UW-009)', 'Expected issue within 24 hrs of signature', 'Update CRM with new rider details'],
      apsStatus: 'Eliminated — Existing client, rider only', timeSaved: '14 days'
    },
    'UW-2026-0008': {
      stpClass: 'stp-high', recClass: 'issued', recLabel: '✅ Approved — Awaiting Sig.',
      recNote: 'STP 86 — AI 87% confidence. DI policy increase for existing client. Clean evidence.',
      signals: [
        { icon: 'fa-check-circle', color: '#059669', text: 'Existing client — medical history verified, all evidence clean' },
        { icon: 'fa-check-circle', color: '#059669', text: 'DI increase within existing coverage limits — reduced UW scope' },
        { icon: 'fa-check-circle', color: '#059669', text: 'All 4 evidence items complete (Rx, MIB, MVR, Credit)' },
        { icon: 'fa-file-signature', color: '#2563eb', text: 'E-App generated (EA-UW-008) — pending Maria e-signature' }
      ],
      nextSteps: ['Follow up with Maria on E-App signature (EA-UW-008)', 'Coordinate with claim team re: open ADB claim', 'Issue DI increase upon signature'],
      apsStatus: 'Eliminated — Existing client, DI increase only', timeSaved: '14 days'
    },
    'UW-2026-0007': {
      stpClass: 'stp-high', recClass: 'issued', recLabel: '✅ Issued — STP 1.8 hrs',
      recNote: 'STP 96 — issued in 1.8 hrs. Fastest STP case in Q2 2026. Robert Chen VUL rider add-on.',
      signals: [
        { icon: 'fa-trophy', color: '#d97706', text: 'Fastest STP case Q2 2026 — issued in 1.8 hrs (vs 8-day manual average)' },
        { icon: 'fa-check-circle', color: '#059669', text: 'All evidence complete and clean — fully automated processing' },
        { icon: 'fa-bolt', color: '#2563eb', text: 'STP 96 — near-perfect score, no manual intervention required' },
        { icon: 'fa-check-circle', color: '#059669', text: 'Policy active — $1,800/yr VUL rider successfully issued Apr 2' }
      ],
      nextSteps: ['No action required — policy issued Apr 2', 'Update client record with new rider details', 'Schedule annual review with Robert Chen'],
      apsStatus: 'Eliminated — STP 96, all evidence clean', timeSaved: '14 days'
    },
    'UW-2026-0006': {
      stpClass: 'stp-high', recClass: 'issued', recLabel: '✅ Issued — STP 3.1 hrs',
      recNote: 'STP 94 — issued in 3.1 hrs. James Whitfield LTC Rider. All evidence complete, clean APS-free processing.',
      signals: [
        { icon: 'fa-check-circle', color: '#059669', text: 'LTC Rider issued Mar 30 — $4,400/yr, STP 94' },
        { icon: 'fa-check-circle', color: '#059669', text: 'All labs, Rx, MIB, MVR complete and clean' },
        { icon: 'fa-bolt', color: '#2563eb', text: '3.1 hrs end-to-end vs 8-day manual baseline — 98% time reduction' },
        { icon: 'fa-check-circle', color: '#059669', text: 'No APS required — full evidence substitution successful' }
      ],
      nextSteps: ['No action required — policy issued Mar 30', 'Update James Whitfield record with LTC rider', 'Consider additional coverage review at next annual meeting'],
      apsStatus: 'Eliminated — All labs substituted APS successfully', timeSaved: '14 days'
    }
  };

  // Hook into the UW modal tab switching to handle 'intelligence' tab
  const _origSwitchUWTab = window.switchUWTab;
  window.switchUWTab = function(tab, btn) {
    if (tab === 'intelligence') {
      document.querySelectorAll('#uw-modal-tabs .dmt-tab').forEach(t => t.classList.remove('active'));
      if (btn) btn.classList.add('active');
      renderUWIntelligenceTab();
      return;
    }
    if (_origSwitchUWTab) _origSwitchUWTab(tab, btn);
  };

  window.renderUWIntelligenceTab = function() {
    const body = document.getElementById('uw-modal-body');
    if (!body || !window._currentUWCase) return;
    const c = uwData[window._currentUWCase];
    const intel = uwiIntelData[window._currentUWCase];
    if (!c || !intel) {
      body.innerHTML = '<div style="padding:30px;text-align:center;color:#94a3b8"><i class="fas fa-brain" style="font-size:32px;margin-bottom:10px"></i><br>Intelligence analysis not available for this case</div>';
      return;
    }

    const stpClass = intel.stpClass;
    const signals = intel.signals.map(s => `
      <div class="uw-intel-signal-row">
        <i class="fas ${s.icon}" style="color:${s.color}"></i>
        <span>${s.text}</span>
      </div>`).join('');

    const evPills = c.evidence.map(ev => {
      const cls = ev.status === 'done' ? 'done' : ev.status === 'flag' ? 'flag' : ev.status === 'na' ? 'na' : 'pending';
      const icon = ev.status === 'done' ? 'fa-check-circle' : ev.status === 'flag' ? 'fa-exclamation-triangle' : ev.status === 'na' ? 'fa-minus-circle' : 'fa-hourglass-half';
      return `<div class="uw-intel-ev-pill ${cls}"><i class="fas ${icon}"></i> ${ev.name}</div>`;
    }).join('');

    const steps = intel.nextSteps.map((s, i) => `
      <div class="uw-intel-step">
        <span class="uw-intel-step-num">${i + 1}</span>
        <span>${s}</span>
      </div>`).join('');

    body.innerHTML = `
      <div class="uw-intel-panel">
        <div class="uw-intel-top">
          <div class="uw-intel-card">
            <div class="uw-intel-card-title"><i class="fas fa-tachometer-alt"></i> STP Intelligence Score</div>
            <div class="uw-intel-stp-gauge">
              <div class="uw-intel-stp-circle ${stpClass}">
                <span class="uw-intel-stp-val">${c.stpScore}</span>
                <span class="uw-intel-stp-lbl">STP</span>
              </div>
              <div class="uw-intel-stp-info">
                <div class="uw-intel-stp-rec ${intel.recClass}">${intel.recLabel}</div>
                <div class="uw-intel-stp-note">${intel.recNote}</div>
              </div>
            </div>
          </div>
          <div class="uw-intel-card">
            <div class="uw-intel-card-title"><i class="fas fa-file-medical"></i> APS Avoidance Status</div>
            <div style="font-size:13px;color:#374151;line-height:1.5;margin-bottom:8px">${intel.apsStatus}</div>
            ${intel.timeSaved !== 'N/A'
              ? `<div style="display:inline-flex;align-items:center;gap:6px;background:#dcfce7;color:#15803d;padding:5px 10px;border-radius:8px;font-size:12px;font-weight:700">
                  <i class="fas fa-clock"></i> ${intel.timeSaved} saved vs manual APS</div>`
              : `<div style="display:inline-flex;align-items:center;gap:6px;background:#ffedd5;color:#c2410c;padding:5px 10px;border-radius:8px;font-size:12px;font-weight:700">
                  <i class="fas fa-exclamation-circle"></i> APS Required — Cannot Substitute</div>`}
          </div>
        </div>
        <div class="uw-intel-evidence-section">
          <div class="uw-intel-section-title"><i class="fas fa-search-plus"></i> Evidence Intelligence Summary</div>
          <div class="uw-intel-ev-grid">${evPills}</div>
        </div>
        <div class="uw-intel-evidence-section">
          <div class="uw-intel-section-title"><i class="fas fa-signal"></i> AI Risk Signals</div>
          <div class="uw-intel-signals">${signals}</div>
        </div>
        <div class="uw-intel-action-plan">
          <div class="uw-intel-section-title"><i class="fas fa-list-ol"></i> AI Action Plan</div>
          <div class="uw-intel-action-banner ${intel.recClass}">
            <i class="fas fa-robot"></i> AI Recommendation: ${intel.recLabel}
          </div>
          <div class="uw-intel-steps">${steps}</div>
        </div>
      </div>
    `;
  };
})();

/* ── APS Avoidance Panel toggle ── */
function openAPSAvoidance() {
  const panel = document.getElementById('aps-avoidance-panel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  if (panel.style.display === 'block') {
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
function closeAPSAvoidance() {
  const panel = document.getElementById('aps-avoidance-panel');
  if (panel) panel.style.display = 'none';
}

/* ── UW Intelligence Full Report Modal ── */
function openUWIReport() {
  const overlay = document.getElementById('uwi-report-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  renderUWIReport('overview');
}
function closeUWIReport() {
  const overlay = document.getElementById('uwi-report-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}
function switchUWIReportTab(tab, btn) {
  document.querySelectorAll('#uwi-report-tabs .uwi-rtab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderUWIReport(tab);
}

function renderUWIReport(tab) {
  const body = document.getElementById('uwi-report-body');
  if (!body) return;

  if (tab === 'overview') {
    body.innerHTML = `
      <div class="uwi-rpt-kpi-grid">
        <div class="uwi-rpt-kpi"><div class="uwi-rpt-kpi-val green">5</div><div class="uwi-rpt-kpi-lbl">Auto-Approved (MTD)</div><div class="uwi-rpt-kpi-delta"><i class="fas fa-arrow-up"></i> +2 vs last month</div></div>
        <div class="uwi-rpt-kpi"><div class="uwi-rpt-kpi-val blue">73%</div><div class="uwi-rpt-kpi-lbl">STP Rate</div><div class="uwi-rpt-kpi-delta"><i class="fas fa-arrow-up"></i> +18% QoQ</div></div>
        <div class="uwi-rpt-kpi"><div class="uwi-rpt-kpi-val purple">18</div><div class="uwi-rpt-kpi-lbl">APS Avoided / Month</div><div class="uwi-rpt-kpi-delta"><i class="fas fa-dollar-sign"></i> $5,760 saved</div></div>
        <div class="uwi-rpt-kpi"><div class="uwi-rpt-kpi-val gold">4.2 hrs</div><div class="uwi-rpt-kpi-lbl">Avg Decision Time</div><div class="uwi-rpt-kpi-delta"><i class="fas fa-arrow-down"></i> vs 8 days manual</div></div>
        <div class="uwi-rpt-kpi"><div class="uwi-rpt-kpi-val green">94.6%</div><div class="uwi-rpt-kpi-lbl">AI Accuracy</div><div class="uwi-rpt-kpi-delta"><i class="fas fa-robot"></i> vs 89% manual</div></div>
        <div class="uwi-rpt-kpi"><div class="uwi-rpt-kpi-val red">2</div><div class="uwi-rpt-kpi-lbl">APS Required</div><div class="uwi-rpt-kpi-delta"><i class="fas fa-info-circle"></i> John Kim, Julia Chen</div></div>
      </div>
      <div class="uwi-rpt-section-title"><i class="fas fa-chart-bar"></i> STP Distribution</div>
      <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap">
        <div style="flex:1;min-width:140px;background:#dcfce7;border-radius:10px;padding:14px;text-align:center">
          <div style="font-size:26px;font-weight:800;color:#059669">7</div>
          <div style="font-size:12px;color:#15803d;font-weight:600">Auto-Approve (STP ≥ 80)</div>
        </div>
        <div style="flex:1;min-width:140px;background:#fef9c3;border-radius:10px;padding:14px;text-align:center">
          <div style="font-size:26px;font-weight:800;color:#d97706">2</div>
          <div style="font-size:12px;color:#92400e;font-weight:600">Review (65–79)</div>
        </div>
        <div style="flex:1;min-width:140px;background:#fee2e2;border-radius:10px;padding:14px;text-align:center">
          <div style="font-size:26px;font-weight:800;color:#dc2626">2</div>
          <div style="font-size:12px;color:#991b1b;font-weight:600">APS Required (< 65)</div>
        </div>
      </div>
      <div class="uwi-rpt-section-title"><i class="fas fa-trophy"></i> Top STP Wins This Quarter</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:#f0fdf4;border-radius:10px;border:1px solid #bbf7d0">
          <div><strong>Robert Chen — VUL Rider</strong><div style="font-size:12px;color:#64748b">STP 96 · Issued in 1.8 hrs · $1,800/yr</div></div>
          <span style="background:#dcfce7;color:#15803d;padding:4px 10px;border-radius:10px;font-size:12px;font-weight:700">⚡ 1.8 hrs</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:#f0fdf4;border-radius:10px;border:1px solid #bbf7d0">
          <div><strong>James Whitfield — LTC Rider</strong><div style="font-size:12px;color:#64748b">STP 94 · Issued in 3.1 hrs · $4,400/yr</div></div>
          <span style="background:#dcfce7;color:#15803d;padding:4px 10px;border-radius:10px;font-size:12px;font-weight:700">⚡ 3.1 hrs</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:#f0fdf4;border-radius:10px;border:1px solid #bbf7d0">
          <div><strong>Linda Morrison — WL Rider Add-on</strong><div style="font-size:12px;color:#64748b">STP 99 · AI 100% confidence · $1,200/yr</div></div>
          <span style="background:#dcfce7;color:#15803d;padding:4px 10px;border-radius:10px;font-size:12px;font-weight:700">⚡ Auto</span>
        </div>
      </div>
    `;
  }

  else if (tab === 'pipeline') {
    const cases = [
      { id: 'UW-2026-0018', client: 'Alex Rivera',    product: 'Whole Life $500K',  stp: 88,  stage: 'Received',  rec: 'auto',   recLbl: 'Auto-Approve' },
      { id: 'UW-2026-0017', client: 'Nancy Foster',   product: 'Term Life $1M',     stp: 82,  stage: 'Received',  rec: 'review', recLbl: 'Review' },
      { id: 'UW-2026-0016', client: 'John Kim',       product: 'Disability Ins.',   stp: 61,  stage: 'Received',  rec: 'aps',    recLbl: 'APS Required' },
      { id: 'UW-2026-0015', client: 'Michael Santos', product: 'Universal Life $750K', stp: 79, stage: 'Evidence', rec: 'auto',  recLbl: 'Near Auto' },
      { id: 'UW-2026-0014', client: 'Julia Chen',     product: 'Annuity Deferred',  stp: 44,  stage: 'Evidence',  rec: 'aps',    recLbl: 'APS Required' },
      { id: 'UW-2026-0013', client: 'Rachel Adams',   product: 'Whole Life $300K',  stp: 85,  stage: 'Evidence',  rec: 'auto',   recLbl: 'Auto-Approve' },
      { id: 'UW-2026-0012', client: 'Thomas Wright',  product: 'Whole Life $1M',    stp: 91,  stage: 'AI Review', rec: 'auto',   recLbl: 'Auto-Approve' },
      { id: 'UW-2026-0011', client: 'Grace Lee',      product: 'VUL $250K',         stp: 67,  stage: 'AI Review', rec: 'review', recLbl: 'Manual Review' },
      { id: 'UW-2026-0010', client: 'David Thompson', product: 'Term Life $300K',   stp: 78,  stage: 'Decision',  rec: 'auto',   recLbl: 'Approve Now' },
      { id: 'UW-2026-0009', client: 'Linda Morrison', product: 'WL Rider Add-on',   stp: 99,  stage: 'Approved',  rec: 'issued', recLbl: 'Awaiting Sig.' },
      { id: 'UW-2026-0008', client: 'Maria Gonzalez', product: 'DI Policy Increase', stp: 86, stage: 'Approved',  rec: 'issued', recLbl: 'Awaiting Sig.' }
    ];
    const rows = cases.map(c => {
      const cls = c.stp >= 80 ? 'high' : c.stp >= 65 ? 'med' : 'low';
      return `<tr>
        <td><strong>${c.id}</strong></td>
        <td>${c.client}</td>
        <td style="color:#64748b">${c.product}</td>
        <td><span class="uwi-rpt-stp-chip ${cls}">${c.stp}</span></td>
        <td style="color:#64748b">${c.stage}</td>
        <td><span class="uwi-rpt-stp-chip ${c.rec === 'auto' ? 'high' : c.rec === 'review' ? 'med' : c.rec === 'issued' ? 'high' : 'low'}">${c.recLbl}</span></td>
        <td><button style="background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;padding:4px 10px;border-radius:6px;font-size:11px;cursor:pointer" onclick="openUWModal('${c.id}')">View</button></td>
      </tr>`;
    }).join('');
    body.innerHTML = `
      <div class="uwi-rpt-section-title"><i class="fas fa-layer-group"></i> Full Pipeline — 11 Active Cases</div>
      <table class="uwi-rpt-table">
        <thead><tr><th>Case ID</th><th>Client</th><th>Product</th><th>STP</th><th>Stage</th><th>AI Recommendation</th><th>Action</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  else if (tab === 'aps') {
    body.innerHTML = `
      <div class="uwi-rpt-section-title"><i class="fas fa-file-medical-alt"></i> APS Avoidance Performance</div>
      <div class="uwi-rpt-kpi-grid" style="grid-template-columns:repeat(4,1fr)">
        <div class="uwi-rpt-kpi"><div class="uwi-rpt-kpi-val green">18</div><div class="uwi-rpt-kpi-lbl">APS Avoided MTD</div><div class="uwi-rpt-kpi-delta">+4 vs last month</div></div>
        <div class="uwi-rpt-kpi"><div class="uwi-rpt-kpi-val blue">$5,760</div><div class="uwi-rpt-kpi-lbl">Cost Saved</div><div class="uwi-rpt-kpi-delta">@ $320 per APS</div></div>
        <div class="uwi-rpt-kpi"><div class="uwi-rpt-kpi-val purple">14 days</div><div class="uwi-rpt-kpi-lbl">Avg Time Saved</div><div class="uwi-rpt-kpi-delta">Per eliminated APS</div></div>
        <div class="uwi-rpt-kpi"><div class="uwi-rpt-kpi-val gold">2</div><div class="uwi-rpt-kpi-lbl">APS Still Required</div><div class="uwi-rpt-kpi-delta">John Kim, Julia Chen</div></div>
      </div>
      <div class="uwi-rpt-section-title" style="margin-top:10px"><i class="fas fa-info-circle"></i> APS Required Cases — Next Steps</div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
        <div style="padding:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px">
          <div style="font-weight:700;color:#92400e;margin-bottom:4px"><i class="fas fa-user"></i> John Kim — Disability Ins. (STP 61)</div>
          <div style="font-size:12px;color:#64748b;margin-bottom:8px">MIB flag + Type 2 DM Rx + Prior DI claim 2021 — 3 concurrent flags prevent APS substitution</div>
          <div style="font-size:12px;color:#374151"><strong>Action:</strong> APS ordered from primary care. ETA 7–10 business days. Manual UW review to follow.</div>
        </div>
        <div style="padding:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px">
          <div style="font-weight:700;color:#92400e;margin-bottom:4px"><i class="fas fa-user"></i> Julia Chen — Annuity Deferred (STP 44)</div>
          <div style="font-size:12px;color:#64748b;margin-bottom:8px">MIB flag + Lab abnormality at age 58 — conservative UW approach required for deferred annuity</div>
          <div style="font-size:12px;color:#374151"><strong>Action:</strong> APS from primary care + specialist. Full manual review. 15–21 day timeline.</div>
        </div>
      </div>
      <div class="uwi-rpt-section-title"><i class="fas fa-check-circle"></i> Substitution Methods Used</div>
      <table class="uwi-rpt-table">
        <thead><tr><th>Substitution</th><th>Cases</th><th>Success Rate</th><th>APS Eliminated</th></tr></thead>
        <tbody>
          <tr><td>Lab Results + Rx History</td><td>8</td><td>100%</td><td>8 APS removed</td></tr>
          <tr><td>MIB Clear + Medical Exam</td><td>5</td><td>100%</td><td>5 APS removed</td></tr>
          <tr><td>MVR + Credit (low-face-value)</td><td>3</td><td>100%</td><td>3 APS removed</td></tr>
          <tr><td>Existing Client History</td><td>2</td><td>100%</td><td>2 APS removed</td></tr>
        </tbody>
      </table>
    `;
  }

  else if (tab === 'accuracy') {
    body.innerHTML = `
      <div class="uwi-rpt-section-title"><i class="fas fa-bullseye"></i> AI Accuracy & Performance Metrics</div>
      <div class="uwi-rpt-kpi-grid">
        <div class="uwi-rpt-kpi"><div class="uwi-rpt-kpi-val green">94.6%</div><div class="uwi-rpt-kpi-lbl">Overall AI Accuracy</div><div class="uwi-rpt-kpi-delta">vs 89% manual baseline</div></div>
        <div class="uwi-rpt-kpi"><div class="uwi-rpt-kpi-val blue">0.8%</div><div class="uwi-rpt-kpi-lbl">False Positive Rate</div><div class="uwi-rpt-kpi-delta">Auto-approve later declined</div></div>
        <div class="uwi-rpt-kpi"><div class="uwi-rpt-kpi-val purple">1.2%</div><div class="uwi-rpt-kpi-lbl">False Negative Rate</div><div class="uwi-rpt-kpi-delta">APS recommended unnecessarily</div></div>
        <div class="uwi-rpt-kpi"><div class="uwi-rpt-kpi-val gold">30–50%</div><div class="uwi-rpt-kpi-lbl">Faster Processing</div><div class="uwi-rpt-kpi-delta">vs manual underwriting</div></div>
      </div>
      <div class="uwi-rpt-section-title" style="margin-top:10px"><i class="fas fa-chart-line"></i> Accuracy by Evidence Type</div>
      <table class="uwi-rpt-table">
        <thead><tr><th>Evidence Type</th><th>AI Accuracy</th><th>Manual Accuracy</th><th>Improvement</th></tr></thead>
        <tbody>
          <tr><td>Rx History Analysis</td><td><span class="uwi-rpt-stp-chip high">97.2%</span></td><td>91.4%</td><td style="color:#059669">+5.8%</td></tr>
          <tr><td>MIB Record Review</td><td><span class="uwi-rpt-stp-chip high">95.8%</span></td><td>88.2%</td><td style="color:#059669">+7.6%</td></tr>
          <tr><td>Lab Result Interpretation</td><td><span class="uwi-rpt-stp-chip high">93.4%</span></td><td>87.6%</td><td style="color:#059669">+5.8%</td></tr>
          <tr><td>MVR + Credit Scoring</td><td><span class="uwi-rpt-stp-chip high">96.1%</span></td><td>90.3%</td><td style="color:#059669">+5.8%</td></tr>
          <tr><td>APS Avoidance Decision</td><td><span class="uwi-rpt-stp-chip med">91.7%</span></td><td>84.2%</td><td style="color:#059669">+7.5%</td></tr>
        </tbody>
      </table>
      <div style="margin-top:16px;padding:14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;font-size:13px;color:#374151">
        <strong><i class="fas fa-robot"></i> AI Model Notes:</strong><br>
        The UW Intelligence Engine uses a gradient-boosted ML model trained on 14,200 NYL underwriting cases (2018–2025). 
        NLP medical-record analysis uses clinical BERT fine-tuned on insurance-specific terminology. 
        APS avoidance decisions are validated against NYL guidelines v23.1. 
        Next model refresh scheduled Q3 2026.
      </div>
    `;
  }
}

// ── Click-outside handler for UWI report overlay ──
(function(){
  const el = document.getElementById('uwi-report-overlay');
  if (el) el.addEventListener('click', function(e){ if(e.target === el) closeUWIReport(); });
})();


// ═══════════════════════════════════════════════════════════════════
// TASK #17 — LIABILITY DETERMINATION & LITIGATION RISK FLAG
// ═══════════════════════════════════════════════════════════════════

const liabilityData = {
  'CLM-2026-0041': {
    client: 'Robert Chen', policy: 'P-100310', type: 'Death Benefit',
    amount: '$1,000,000', filed: '2026-04-09',
    liabilityScore: 72, liabilityClass: 'high', liabilityLabel: 'High Liability',
    litigationRisk: 68, litigationClass: 'high',
    litigationDesc: 'High litigation probability. Estate attorney already retained. Dispute over beneficiary designation change filed 14 days prior to death.',
    factors: [
      { type: 'negative', icon: 'fa-exclamation-triangle', text: 'Beneficiary change filed 14 days pre-death — contestability period applies', weight: '+28 pts' },
      { type: 'negative', icon: 'fa-user-times', text: 'Estate attorney retained by primary beneficiary — formal dispute signaled', weight: '+18 pts' },
      { type: 'negative', icon: 'fa-file-medical', text: 'Death benefit > $500K triggers enhanced review protocol', weight: '+12 pts' },
      { type: 'neutral',  icon: 'fa-search', text: 'Policy in force 4 years — past incontestability threshold for original terms', weight: '0 pts' },
      { type: 'positive', icon: 'fa-shield-alt', text: 'Premium payments current — no lapse or reinstatement issues', weight: '-6 pts' }
    ],
    settlement: { recommended: '$800,000 – $950,000', probability: '74%', timeline: '6–9 months', authority: 'VP Claims Required' },
    aiSummary: 'AI analysis indicates high liability exposure primarily driven by the beneficiary change contestability issue. The 14-day window before death significantly elevates litigation probability. Recommend proactive outreach to retained estate attorney for early settlement discussion. All documentation is complete. Legal review should be initiated within 48 hours.',
    earlySettleTrigger: true
  },
  'CLM-2026-0038': {
    client: 'Nancy Foster', policy: 'P-100320', type: 'Disability Income',
    amount: '$4,200/mo', filed: '2026-04-05',
    liabilityScore: 18, liabilityClass: 'low', liabilityLabel: 'Low Liability',
    litigationRisk: 12, litigationClass: 'low',
    litigationDesc: 'Low litigation risk. Straightforward disability claim with verified medical documentation. No contestability issues identified.',
    factors: [
      { type: 'positive', icon: 'fa-check-circle', text: 'Attending Physician Statement received and verified — disability confirmed', weight: '-20 pts' },
      { type: 'positive', icon: 'fa-calendar-check', text: 'Elimination period satisfied (180 days) — benefit period begins Apr 2026', weight: '-15 pts' },
      { type: 'positive', icon: 'fa-file-contract', text: 'Policy 6 years in force — no incontestability risk', weight: '-10 pts' },
      { type: 'neutral',  icon: 'fa-stethoscope', text: 'Occupation Class 2 — moderate risk category, standard terms apply', weight: '0 pts' },
      { type: 'negative', icon: 'fa-clock', text: 'Claimant requested benefit review at 12-month mark — note for file', weight: '+5 pts' }
    ],
    settlement: { recommended: 'Standard benefit — no settlement needed', probability: '4%', timeline: 'N/A', authority: 'Claims Examiner' },
    aiSummary: 'Low-risk disability claim. All required evidence received and verified. Recommend routine processing at standard benefit amount. No legal review required. Set calendar reminder for 12-month benefit review per claimant request.',
    earlySettleTrigger: false
  },
  'CLM-2026-0035': {
    client: 'James Whitfield', policy: 'P-100295', type: 'Long-Term Care',
    amount: '$6,800/mo', filed: '2026-03-28',
    liabilityScore: 41, liabilityClass: 'med', liabilityLabel: 'Medium Liability',
    litigationRisk: 33, litigationClass: 'med',
    litigationDesc: 'Moderate litigation risk. Dispute over care-facility qualification under policy definition. Claimant attorney sent inquiry letter.',
    factors: [
      { type: 'negative', icon: 'fa-hospital', text: 'Facility not on approved provider list — claim under definition review', weight: '+22 pts' },
      { type: 'negative', icon: 'fa-envelope-open-text', text: 'Attorney inquiry letter received — dispute possible if claim denied', weight: '+14 pts' },
      { type: 'neutral',  icon: 'fa-file-medical-alt', text: 'APS confirms ADL deficiencies (3 of 6) — meets policy threshold', weight: '+5 pts' },
      { type: 'positive', icon: 'fa-shield-alt', text: 'Claimant has not yet escalated to formal dispute', weight: '-8 pts' },
      { type: 'positive', icon: 'fa-handshake', text: 'Agent relationship strong — proactive communication possible', weight: '-5 pts' }
    ],
    settlement: { recommended: '$38,000 – $55,000 retroactive', probability: '38%', timeline: '2–4 months', authority: 'Claims Manager' },
    aiSummary: 'Medium-risk LTC claim with facility definition dispute. Recommend proactive communication with claimant representative before formal denial. Consider facility waiver review given confirmed ADL deficiencies. Early resolution preferred to avoid escalation.',
    earlySettleTrigger: false
  },
  'CLM-2026-0033': {
    client: 'Maria Gonzalez', policy: 'P-100298', type: 'Critical Illness',
    amount: '$50,000', filed: '2026-03-20',
    liabilityScore: 12, liabilityClass: 'low', liabilityLabel: 'Low Liability',
    litigationRisk: 8, litigationClass: 'low',
    litigationDesc: 'Very low litigation risk. Clean critical illness claim with confirmed diagnosis and all documentation received.',
    factors: [
      { type: 'positive', icon: 'fa-check-circle', text: 'Oncology report confirms Stage II breast cancer — CI trigger met', weight: '-18 pts' },
      { type: 'positive', icon: 'fa-file-medical', text: 'All required documentation received within 30 days', weight: '-12 pts' },
      { type: 'positive', icon: 'fa-calendar-check', text: 'Survival period (30 days) confirmed', weight: '-10 pts' },
      { type: 'neutral',  icon: 'fa-search', text: 'Pre-existing condition review: DX date after 2-year exclusion window — clear', weight: '0 pts' }
    ],
    settlement: { recommended: 'Full benefit — $50,000 lump sum', probability: '2%', timeline: 'N/A', authority: 'Claims Examiner' },
    aiSummary: 'Clean critical illness claim. All documentation verified, diagnosis confirmed, survival period met, no pre-existing condition conflict. Recommend immediate approval and payment. No further review required.',
    earlySettleTrigger: false
  },
  'CLM-2026-0031': {
    client: 'Patricia Nguyen', policy: 'P-100301', type: 'Waiver of Premium',
    amount: '$8,600/yr', filed: '2026-03-15',
    liabilityScore: 8, liabilityClass: 'low', liabilityLabel: 'Low Liability',
    litigationRisk: 5, litigationClass: 'low',
    litigationDesc: 'Very low litigation risk. Standard waiver of premium claim with verified disability documentation.',
    factors: [
      { type: 'positive', icon: 'fa-check-circle', text: 'Disability verified by attending physician and independent review', weight: '-15 pts' },
      { type: 'positive', icon: 'fa-shield-alt', text: 'Policy 5 years in force — no contestability concern', weight: '-10 pts' },
      { type: 'positive', icon: 'fa-clock', text: 'Waiting period (6 months) satisfied per policy terms', weight: '-8 pts' }
    ],
    settlement: { recommended: 'Waiver approved — standard processing', probability: '2%', timeline: 'N/A', authority: 'Claims Examiner' },
    aiSummary: 'Routine waiver of premium claim. All eligibility criteria met. Recommend approval and retroactive waiver from disability onset date. No legal concerns.',
    earlySettleTrigger: false
  },
  'CLM-2026-0028': {
    client: 'David Park', policy: 'P-100288', type: 'Accidental Death',
    amount: '$500,000', filed: '2026-03-05',
    liabilityScore: 29, liabilityClass: 'med', liabilityLabel: 'Medium Liability',
    litigationRisk: 24, litigationClass: 'med',
    litigationDesc: 'Moderate risk. Accidental death classification under review — toxicology report indicates alcohol involvement.',
    factors: [
      { type: 'negative', icon: 'fa-flask', text: 'Toxicology: BAC 0.09% — borderline intoxication exclusion review required', weight: '+18 pts' },
      { type: 'negative', icon: 'fa-car-crash', text: 'Accident circumstances under police investigation — final report pending', weight: '+12 pts' },
      { type: 'positive', icon: 'fa-file-contract', text: 'AD&D rider clearly defined — exclusion threshold review in progress', weight: '-8 pts' },
      { type: 'neutral',  icon: 'fa-user-friends', text: 'Beneficiary cooperative — no formal dispute raised', weight: '0 pts' }
    ],
    settlement: { recommended: '$400,000 – $500,000 (pending final review)', probability: '28%', timeline: '1–3 months', authority: 'Claims Manager' },
    aiSummary: 'Medium-risk accidental death claim pending toxicology and police investigation outcomes. BAC level is borderline for intoxication exclusion clause. Recommend holding payment pending final police report. Proactive communication with beneficiary advised.',
    earlySettleTrigger: false
  },
  'CLM-2026-0025': {
    client: 'Kevin Park', policy: 'P-100350', type: 'Death Benefit',
    amount: '$250,000', filed: '2026-04-10',
    liabilityScore: 88, liabilityClass: 'critical', liabilityLabel: 'Critical Liability',
    litigationRisk: 82, litigationClass: 'critical',
    litigationDesc: 'CRITICAL — Obituary match on pending policy. Death confirmed 2026-04-10. Policy in Pending status with no insurable interest investigation complete. Fraud score 78/100.',
    factors: [
      { type: 'negative', icon: 'fa-skull-crossbones', text: 'Death confirmed during PENDING policy — coverage determination required', weight: '+35 pts' },
      { type: 'negative', icon: 'fa-user-secret', text: 'Fraud score 78/100 — suspicious timing of application vs death date', weight: '+25 pts' },
      { type: 'negative', icon: 'fa-search', text: 'No insurable interest investigation completed pre-death', weight: '+15 pts' },
      { type: 'negative', icon: 'fa-file-alt', text: 'Estate attorney contact not yet identified — estate unknown', weight: '+8 pts' },
      { type: 'neutral',  icon: 'fa-balance-scale', text: 'NJ DoH cross-match confirms identity — death is verified', weight: '0 pts' }
    ],
    settlement: { recommended: 'HOLD — Legal review required before any determination', probability: '85%', timeline: 'Unknown', authority: 'General Counsel Required' },
    aiSummary: 'CRITICAL: Death occurred during policy pending period. This case requires immediate General Counsel review before any coverage determination. High fraud score combined with pending status creates significant liability exposure. Do NOT communicate any coverage decision to estate contacts without legal clearance.',
    earlySettleTrigger: true
  }
};

// Extend the existing switchClaimTab / renderClaimModal for 'liability' tab
(function() {
  const _origSwitch = window.switchClaimTab;
  const _origRender = window.renderClaimModal;

  window.switchClaimTab = function(tab, tabEl) {
    if (tab === 'liability') {
      document.querySelectorAll('#claim-modal-tabs .dmt-tab').forEach(t => t.classList.remove('active'));
      if (tabEl) tabEl.classList.add('active');
      window._currentClaimTab = 'liability';
      renderClaimModal(window._currentClaimId, 'liability');
    } else {
      _origSwitch(tab, tabEl);
    }
  };

  window.renderClaimModal = function(claimId, tab) {
    if (tab === 'liability') {
      const body = document.getElementById('claim-modal-body');
      if (!body) return;
      const ld = liabilityData[claimId];
      if (!ld) {
        body.innerHTML = '<div style="padding:20px;color:#64748b">No liability data available for this claim.</div>';
        return;
      }
      const litigPanelClass = ld.liabilityScore >= 70 ? '' : (ld.liabilityScore >= 40 ? 'med' : 'low');
      const factorsHtml = ld.factors.map(f => `
        <div class="liab-factor-item ${f.type}">
          <i class="fas ${f.icon} liab-factor-icon"></i>
          <div>
            <div class="liab-factor-text">${f.text}</div>
            <div class="liab-factor-weight">${f.weight}</div>
          </div>
        </div>`).join('');
      const earlySettleHtml = ld.earlySettleTrigger ? `
        <div class="liab-settlement-box" style="border-color:#dc2626;background:linear-gradient(135deg,#fef2f2,#fee2e2)">
          <div class="liab-settlement-title" style="color:#991b1b"><i class="fas fa-bolt"></i> ⚡ EARLY SETTLEMENT TRIGGER ACTIVE</div>
          <div class="liab-settlement-row"><span>Recommended Settlement Range</span><span class="liab-settlement-val">${ld.settlement.recommended}</span></div>
          <div class="liab-settlement-row"><span>Litigation Probability</span><span class="liab-settlement-val">${ld.settlement.probability}</span></div>
          <div class="liab-settlement-row"><span>Estimated Timeline</span><span class="liab-settlement-val">${ld.settlement.timeline}</span></div>
          <div class="liab-settlement-row"><span>Authorization Required</span><span class="liab-settlement-val" style="color:#dc2626;font-weight:700">${ld.settlement.authority}</span></div>
        </div>` : `
        <div class="liab-settlement-box">
          <div class="liab-settlement-title"><i class="fas fa-balance-scale"></i> Settlement Assessment</div>
          <div class="liab-settlement-row"><span>Settlement Recommended</span><span class="liab-settlement-val">${ld.settlement.recommended}</span></div>
          <div class="liab-settlement-row"><span>Litigation Probability</span><span class="liab-settlement-val">${ld.settlement.probability}</span></div>
          <div class="liab-settlement-row"><span>Authorization</span><span class="liab-settlement-val">${ld.settlement.authority}</span></div>
        </div>`;

      body.innerHTML = `
        <div class="liab-panel">
          <div class="liab-header-bar">
            <div class="liab-header-icon"><i class="fas fa-gavel"></i></div>
            <div class="liab-header-info">
              <div class="liab-header-title">AI Liability Determination — ${ld.client}</div>
              <div class="liab-header-sub">${ld.policy} · ${ld.type} · ${ld.amount} · Filed ${ld.filed}</div>
            </div>
            <div class="liab-score-circle ${ld.liabilityClass}">
              <div class="liab-circle-val">${ld.liabilityScore}%</div>
              <div class="liab-circle-lbl">Liability</div>
              <div class="liab-circle-flag">${ld.liabilityLabel.split(' ')[0]}</div>
            </div>
          </div>

          <div class="liab-kpi-strip">
            <div class="liab-kpi"><div class="liab-kpi-val" style="color:${ld.liabilityScore>=70?'#dc2626':ld.liabilityScore>=40?'#d97706':'#16a34a'}">${ld.liabilityScore}%</div><div class="liab-kpi-lbl">Liability Score</div></div>
            <div class="liab-kpi"><div class="liab-kpi-val" style="color:${ld.litigationRisk>=60?'#dc2626':ld.litigationRisk>=30?'#d97706':'#16a34a'}">${ld.litigationRisk}%</div><div class="liab-kpi-lbl">Litigation Risk</div></div>
            <div class="liab-kpi"><div class="liab-kpi-val">${ld.settlement.timeline}</div><div class="liab-kpi-lbl">Est. Timeline</div></div>
            <div class="liab-kpi"><div class="liab-kpi-val" style="font-size:11px">${ld.settlement.authority}</div><div class="liab-kpi-lbl">Authority</div></div>
          </div>

          <div class="liab-section-title"><i class="fas fa-list-ul"></i> Liability Factors (${ld.factors.length} analyzed)</div>
          <div class="liab-factors-list">${factorsHtml}</div>

          <div class="litig-risk-panel ${litigPanelClass}">
            <div class="litig-risk-title"><i class="fas fa-gavel"></i> Litigation Risk Assessment</div>
            <div class="litig-risk-score-bar">
              <div class="litig-bar-outer"><div class="litig-bar-fill" style="width:${ld.litigationRisk}%"></div></div>
              <div class="litig-pct">${ld.litigationRisk}%</div>
            </div>
            <div class="litig-risk-desc">${ld.litigationDesc}</div>
          </div>

          ${earlySettleHtml}

          <div class="liab-ai-box">
            <div class="liab-ai-title"><i class="fas fa-robot"></i> AI Recommendation</div>
            <div class="liab-ai-text">${ld.aiSummary}</div>
          </div>

          <div class="liab-action-row">
            <button class="liab-btn-primary" onclick="sendContextMessage('Generate full liability analysis for claim ${claimId} — ${ld.client}','claims')"><i class="fas fa-file-alt"></i> Full Report</button>
            ${ld.earlySettleTrigger ? `<button class="liab-btn-secondary" onclick="sendContextMessage('Initiate early settlement discussion for claim ${claimId}','claims')"><i class="fas fa-handshake"></i> Start Settlement</button>` : ''}
            <button class="liab-btn-secondary" onclick="sendContextMessage('Escalate claim ${claimId} for legal review','claims')"><i class="fas fa-balance-scale"></i> Legal Review</button>
          </div>
        </div>`;
    } else {
      _origRender(claimId, tab);
    }
  };
})();

// ═══════════════════════════════════════════════════════════════════
// TASK #16 — REAL-TIME PRICING ANALYSIS & AI RISK NARRATIVE REPORT
// ═══════════════════════════════════════════════════════════════════

const pricingData = {
  overview: {
    kpis: [
      { val: '3.1%', lbl: 'Avg Premium Savings', delta: '↑ vs manual review' },
      { val: 'NYL #1', lbl: 'Value Score Rank', delta: 'vs 8 competitors' },
      { val: '11', lbl: 'Reports Generated', delta: 'All cases analyzed' },
      { val: '94.6%', lbl: 'AI Accuracy', delta: 'vs 89% manual' }
    ]
  },
  benchmarks: [
    { client: 'Alex Rivera',    product: 'WL $500K',    nyl: '$4,800', metlife: '$5,100', prudential: '$5,340', northwestern: '$5,020', verdict: 'NYL Best', verdictClass: 'pr-best' },
    { client: 'Nancy Foster',   product: 'Term $1M',    nyl: '$3,200', metlife: '$3,450', prudential: '$3,290', northwestern: '$3,580', verdict: 'NYL Best', verdictClass: 'pr-best' },
    { client: 'John Kim',       product: 'DI $2.1K/mo', nyl: '$2,800', metlife: '$2,650', prudential: '$2,900', northwestern: '$2,740', verdict: 'MetLife Lower', verdictClass: 'pr-mid' },
    { client: 'Michael Santos', product: 'UL $750K',    nyl: '$6,200', metlife: '$6,500', prudential: '$6,350', northwestern: '$6,100', verdict: 'NWM -1.6%', verdictClass: 'pr-mid' },
    { client: 'Julia Chen',     product: 'Annuity $8K', nyl: '$8,400', metlife: '$8,100', prudential: '$8,600', northwestern: '$8,250', verdict: 'MetLife Lower', verdictClass: 'pr-mid' },
    { client: 'Thomas Wright',  product: 'WL $1M',      nyl: '$9,800', metlife: '$10,400', prudential: '$10,200', northwestern: '$10,100', verdict: 'NYL Best', verdictClass: 'pr-best' }
  ],
  narratives: [
    {
      initials: 'AR', name: 'Alex Rivera', product: 'Whole Life $500K', riskClass: 'Preferred Plus', riskPill: 'preferred',
      text: 'Alex Rivera presents an exceptionally clean risk profile for a 34-year-old male applicant. BMI 22.4, non-smoker, no chronic conditions, and a single minor MVR event represent minimal underwriting concern. The STP score of 88 reflects near-optimal insurability. Recommended rating class is Preferred Plus. NYL\'s premium of $4,800/year is the most competitive in the market, offering a 5.9% savings versus the median competitor rate of $5,115. Upon credit clearance, auto-approval is advised. Long-term policy value for NYL is significant: 30-year NPV estimated at $142K.'
    },
    {
      initials: 'NF', name: 'Nancy Foster', product: 'Term Life $1M', riskClass: 'Preferred', riskPill: 'preferred',
      text: 'Nancy Foster is a 41-year-old female applicant with controlled hypertension managed by Lisinopril. Blood pressure readings are within acceptable range for Preferred classification. The Rx flag introduces a minor underwriting consideration; however, MIB is clear and no adverse lifestyle factors are present. STP score of 82 indicates strong auto-approve eligibility post-MVR receipt. NYL\'s $3,200/year rate is the most competitive among top-tier carriers, representing $285/year savings versus next-best competitor. Preferred rate class is recommended upon completion of outstanding evidence.'
    },
    {
      initials: 'JK', name: 'John Kim', product: 'Disability Insurance $2.1K/mo', riskClass: 'Standard (Pending)', riskPill: 'standard',
      text: 'John Kim presents a more complex risk profile due to Type 2 Diabetes managed by Metformin and a prior DI claim flagged in MIB. The combination of metabolic condition and prior claim history requires APS review before final classification. Standard rating class is anticipated pending APS outcomes. The competitive analysis shows MetLife offers a marginally lower premium ($2,650/year vs NYL $2,800), primarily because MetLife applies a more lenient DM1 rating table. NYL\'s value proposition here lies in superior claims-paying history and DI benefit features. If APS confirms stable glycemic control (A1C < 7.5%), Preferred Standard classification may be achievable.'
    }
  ],
  optimization: [
    { icon: 'fa-arrow-up', title: 'Upgrade Alex Rivera to Preferred Plus', desc: 'Current provisional rating is Preferred. Clean evidence supports upgrade upon credit clear.', saving: 'Saves client $320/yr · Boosts placement probability' },
    { icon: 'fa-clock', title: 'Expedite MVR for Nancy Foster', desc: 'MVR still pending. Expedited request enables same-day decision and locks in Preferred rate.', saving: 'Prevents rate expiry · $285/yr competitive advantage vs market' },
    { icon: 'fa-file-medical-alt', title: 'APS Alternative for John Kim', desc: 'TeleHealth exam + recent A1C lab results may substitute full APS, reducing delay by 14 days.', saving: 'Saves $320 APS cost · 14 days faster · STP score could reach 72+' },
    { icon: 'fa-balance-scale', title: 'Julia Chen Annuity Rate Lock', desc: 'Fed rate hike Apr 9 increases NYL annuity crediting rates. Current rate advantageous vs MetLife.', saving: 'Rate lock window: 30 days · $4.2K/yr guaranteed income advantage' }
  ]
};

let _currentPricingTab = 'overview';

function openPricingReport() {
  const overlay = document.getElementById('pricing-report-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  renderPricingReport('overview');
  document.querySelectorAll('.pr-rtab').forEach(t => t.classList.remove('active'));
  const first = document.querySelector('.pr-rtab');
  if (first) first.classList.add('active');
}
function closePricingReport() {
  const overlay = document.getElementById('pricing-report-overlay');
  if (overlay) overlay.style.display = 'none';
}
function openBenchmarkModal() {
  openPricingReport();
  setTimeout(() => {
    const tabs = document.querySelectorAll('.pr-rtab');
    tabs.forEach(t => t.classList.remove('active'));
    if (tabs[1]) tabs[1].classList.add('active');
    renderPricingReport('benchmark');
  }, 100);
}
function switchPricingReportTab(tab, tabEl) {
  document.querySelectorAll('.pr-rtab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');
  _currentPricingTab = tab;
  renderPricingReport(tab);
}
function renderPricingReport(tab) {
  const body = document.getElementById('pricing-report-body');
  if (!body) return;
  if (tab === 'overview') {
    const kpis = pricingData.overview.kpis.map(k => `
      <div class="pr-kpi">
        <div class="pr-kpi-val">${k.val}</div>
        <div class="pr-kpi-lbl">${k.lbl}</div>
        <div class="pr-kpi-delta">${k.delta}</div>
      </div>`).join('');
    body.innerHTML = `
      <div class="pr-kpi-strip">${kpis}</div>
      <div class="liab-section-title" style="font-size:14px;margin-bottom:14px"><i class="fas fa-chart-line" style="color:#1d4ed8"></i> Pipeline Pricing Summary — Apr 10, 2026</div>
      <p style="font-size:12px;color:#475569;margin-bottom:16px;line-height:1.6">AI Pricing Intelligence has analyzed all 11 active underwriting cases against 8 competitor carriers. NYL leads on value score in 7 of 11 cases. Three cases present optimization opportunities. Real-time rate adjustments triggered by the April 9 Fed rate hike have been incorporated into all annuity benchmarks.</p>
      <div class="pr-kpi-strip" style="grid-template-columns:repeat(3,1fr)">
        <div class="pr-kpi" style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border-color:#86efac"><div class="pr-kpi-val" style="color:#166534">7</div><div class="pr-kpi-lbl" style="color:#16a34a">NYL Best Value</div></div>
        <div class="pr-kpi" style="background:linear-gradient(135deg,#fffbeb,#fef3c7);border-color:#fde68a"><div class="pr-kpi-val" style="color:#854d0e">3</div><div class="pr-kpi-lbl" style="color:#d97706">Competitive — Within 5%</div></div>
        <div class="pr-kpi" style="background:linear-gradient(135deg,#fef2f2,#fee2e2);border-color:#fca5a5"><div class="pr-kpi-val" style="color:#991b1b">1</div><div class="pr-kpi-lbl" style="color:#dc2626">Optimization Needed</div></div>
      </div>`;
  } else if (tab === 'benchmark') {
    const rows = pricingData.benchmarks.map(b => `
      <tr>
        <td><strong>${b.client}</strong></td>
        <td>${b.product}</td>
        <td class="pr-best">${b.nyl}</td>
        <td>${b.metlife}</td>
        <td>${b.prudential}</td>
        <td>${b.northwestern}</td>
        <td class="${b.verdictClass}">${b.verdict}</td>
      </tr>`).join('');
    body.innerHTML = `
      <div class="liab-section-title" style="font-size:14px;margin-bottom:14px"><i class="fas fa-balance-scale" style="color:#1d4ed8"></i> Competitor Benchmark Comparison — Annual Premium</div>
      <table class="pr-bench-table">
        <thead><tr>
          <th>Client</th><th>Product</th>
          <th><i class="fas fa-star" style="color:#fbbf24"></i> NYL (You)</th>
          <th>MetLife</th><th>Prudential</th><th>Northwestern</th><th>Verdict</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="font-size:11px;color:#94a3b8;margin-top:8px"><i class="fas fa-info-circle"></i> Rates as of Apr 10, 2026. Competitor quotes sourced from rate API feeds. Subject to underwriting. Annuity rates reflect Apr 9 Fed rate adjustment.</p>`;
  } else if (tab === 'narratives') {
    const cards = pricingData.narratives.map(n => `
      <div class="pr-narrative-card">
        <div class="pr-narrative-header">
          <div class="pr-narrative-avatar">${n.initials}</div>
          <div>
            <div class="pr-narrative-name">${n.name} — ${n.product}</div>
            <div class="pr-narrative-meta">Risk Class: <span class="pr-risk-pill ${n.riskPill}">${n.riskClass}</span></div>
          </div>
        </div>
        <div class="pr-narrative-body">${n.text}</div>
      </div>`).join('');
    body.innerHTML = `
      <div class="liab-section-title" style="font-size:14px;margin-bottom:14px"><i class="fas fa-file-alt" style="color:#1d4ed8"></i> AI-Generated Risk Narratives</div>
      <p style="font-size:12px;color:#475569;margin-bottom:16px">Each narrative is generated by the AI Underwriting Intelligence Engine based on evidence collected, STP scoring, market benchmarks, and actuarial risk tables. Narratives are ready for case file documentation.</p>
      ${cards}`;
  } else if (tab === 'optimization') {
    const items = pricingData.optimization.map(o => `
      <div class="pr-optim-item">
        <div class="pr-optim-icon"><i class="fas ${o.icon}"></i></div>
        <div>
          <div class="pr-optim-title">${o.title}</div>
          <div class="pr-optim-desc">${o.desc}</div>
          <div class="pr-optim-saving"><i class="fas fa-check-circle"></i> ${o.saving}</div>
        </div>
      </div>`).join('');
    body.innerHTML = `
      <div class="liab-section-title" style="font-size:14px;margin-bottom:14px"><i class="fas fa-sliders-h" style="color:#1d4ed8"></i> Rate Optimization Opportunities</div>
      <p style="font-size:12px;color:#475569;margin-bottom:16px">AI has identified ${pricingData.optimization.length} rating class and processing optimizations that can improve client outcomes and competitive positioning.</p>
      <div class="pr-optim-list">${items}</div>`;
  }
}

// Extend renderUWModal to support 'pricing' tab
(function() {
  const _origRenderUW = window.renderUWModal;
  window.renderUWModal = function(tab) {
    if (tab === 'pricing') {
      const body = document.getElementById('uw-modal-body');
      if (!body) return;
      const id = window._currentUWId;
      const uw = window.uwData ? window.uwData[id] : null;
      if (!uw) { body.innerHTML = '<div style="padding:20px;color:#64748b">No pricing data.</div>'; return; }
      // Find narrative if available
      const narrative = pricingData.narratives.find(n => n.name && uw.name && n.name.split(' ')[0] === uw.name.split(' ')[0]);
      const bench = pricingData.benchmarks.find(b => b.client && uw.name && b.client.split(' ')[0] === uw.name.split(' ')[0]);
      body.innerHTML = `
        <div style="padding:4px">
          <div style="background:linear-gradient(135deg,#0f172a,#1e293b);border-radius:12px;padding:16px 20px;margin-bottom:16px;color:#f1f5f9">
            <div style="font-size:14px;font-weight:700;margin-bottom:4px"><i class="fas fa-chart-line" style="color:#60a5fa;margin-right:8px"></i>AI Pricing Analysis — ${uw.name || id}</div>
            <div style="font-size:11px;color:#94a3b8">Real-time benchmark · AI-generated narrative · Rating optimization</div>
          </div>
          ${bench ? `
          <div class="liab-section-title"><i class="fas fa-balance-scale"></i> Competitor Benchmark (Annual Premium)</div>
          <table class="pr-bench-table" style="margin-bottom:16px">
            <thead><tr><th>NYL (You)</th><th>MetLife</th><th>Prudential</th><th>Northwestern</th><th>Verdict</th></tr></thead>
            <tbody><tr>
              <td class="pr-best">${bench.nyl}</td><td>${bench.metlife}</td><td>${bench.prudential}</td><td>${bench.northwestern}</td>
              <td class="${bench.verdictClass}">${bench.verdict}</td>
            </tr></tbody>
          </table>` : ''}
          ${narrative ? `
          <div class="liab-section-title"><i class="fas fa-file-alt"></i> AI Risk Narrative</div>
          <div class="pr-narrative-body" style="margin-bottom:16px">${narrative.text}</div>` : `<div style="font-size:12px;color:#64748b;padding:16px;background:#f8fafc;border-radius:8px">AI narrative being generated for this case. Check full Pricing Report for complete analysis.</div>`}
          <div style="display:flex;gap:8px;margin-top:4px">
            <button class="pab-btn-primary" onclick="openPricingReport()"><i class="fas fa-chart-bar"></i> Full Pricing Report</button>
            <button class="pab-btn-secondary" onclick="openBenchmarkModal()"><i class="fas fa-balance-scale"></i> All Benchmarks</button>
          </div>
        </div>`;
    } else {
      _origRenderUW(tab);
    }
  };
})();

// ═══════════════════════════════════════════════════════════════════
// TASK #18 — MARKET & NEWS IMPACT MONITOR
// ═══════════════════════════════════════════════════════════════════

const marketData = {
  alerts: [
    {
      type: 'critical', icon: 'fa-percentage',
      title: 'Federal Reserve Rate Hike +0.25% — April 9, 2026',
      detail: 'The Fed raised the federal funds rate by 25 basis points to 5.50–5.75%. This directly impacts NYL annuity crediting rates (now 6.1% for 5-yr fixed), making annuity products significantly more competitive. Immediate action: Contact all annuity prospects and review $4.2M AUM for rebalancing opportunities.',
      chips: ['38 clients affected', '$4.2M AUM rebalance', 'Annuity rates up +0.3%', 'Julia Chen — act now']
    },
    {
      type: 'warning', icon: 'fa-cloud-rain',
      title: 'Northeast Storm Event — Catastrophic Flooding Risk',
      detail: 'NOAA has issued a severe weather advisory for NJ, NY, and CT effective Apr 11–14, 2026. 4 NYL clients have primary residences in flood-affected zones. Disability and LTC riders may see claims activity. Property damage is outside our coverage scope, but stress events often trigger accelerated lapse or surrender requests.',
      chips: ['4 clients in affected zone', 'Patricia Nguyen (Newark)', 'James Whitfield (Hoboken)', 'Monitor for claims']
    },
    {
      type: 'info', icon: 'fa-chart-line',
      title: 'S&P 500 +2.3% WTD — Equity Markets Rally',
      detail: 'Equity markets gained 2.3% week-to-date driven by tech earnings beats and rate hike clarity. VUL sub-accounts are performing strongly. This creates a natural opportunity for portfolio reviews and rebalancing discussions with investment clients. AUM growth of ~$97K across book estimated from market movement alone.',
      chips: ['VUL sub-accounts +2.1%', '$97K AUM gain est.', '3 rebalance candidates', 'Investment review opportunity']
    }
  ],
  news: [
    { title: 'Fed Signals End to Rate Hike Cycle — Insurance Journal', source: 'Insurance Journal · Apr 10', sentiment: 'positive', score: '+82' },
    { title: 'Life Insurance Applications Rise 4.2% in Q1 2026 — LIMRA', source: 'LIMRA · Apr 9', sentiment: 'positive', score: '+74' },
    { title: 'Northeast Storm to Test Property & Casualty Reserves', source: 'A.M. Best · Apr 10', sentiment: 'negative', score: '-61' },
    { title: 'Annuity Sales Hit Record $112B in Q1 — LIMRA', source: 'LIMRA · Apr 8', sentiment: 'positive', score: '+88' },
    { title: 'Disability Claims Rising Post-COVID — Industry Trend', source: 'Insurance Journal · Apr 7', sentiment: 'negative', score: '-43' },
    { title: 'NYL Maintains AAA Rating — Moody\'s Annual Review', source: 'Moody\'s · Apr 5', sentiment: 'positive', score: '+95' },
    { title: 'Long-Term Care Insurance Market Contraction Continues', source: 'Insurance Business · Apr 6', sentiment: 'negative', score: '-52' },
    { title: 'VUL Sub-Account Performance Strong in Tech-Heavy Portfolios', source: 'Financial Planning · Apr 9', sentiment: 'positive', score: '+67' }
  ],
  bookImpact: [
    {
      title: 'Rate Hike Impact on Your Book',
      rows: [
        { label: 'Annuity crediting rate increase', val: '+0.30%' },
        { label: 'Clients benefiting from rate hike', val: '18 annuity clients' },
        { label: 'VUL sub-account uplift (est.)', val: '+$97,000 AUM' },
        { label: 'Term renewal pricing impact', val: 'Neutral — locked rates' }
      ]
    },
    {
      title: 'Storm Event — Client Exposure',
      rows: [
        { label: 'Clients in affected zone', val: '4 clients' },
        { label: 'Potential LTC/DI claim exposure', val: '$14,800/mo risk' },
        { label: 'Lapse risk from financial stress', val: '2 flagged clients' },
        { label: 'Property coverage gap (refer out)', val: '$1.2M uncovered' }
      ]
    },
    {
      title: 'Market Rally Opportunities',
      rows: [
        { label: 'Investment review candidates', val: '3 clients' },
        { label: 'VUL rebalance needed', val: '2 clients (>5% drift)' },
        { label: 'AUM opportunity (cross-sell)', val: '$280K potential' },
        { label: 'Annuity → VUL migration cases', val: '1 candidate' }
      ]
    },
    {
      title: 'Overall Book Health Score',
      rows: [
        { label: 'Insurance sentiment score', val: '72 / 100' },
        { label: 'Market volatility index', val: '38 / 100' },
        { label: 'Claims risk index', val: '54 / 100' },
        { label: 'Renewal opportunity score', val: '81 / 100' }
      ]
    }
  ]
};

let _currentMarketTab = 'alerts';

function openMarketMonitor(tab) {
  const overlay = document.getElementById('market-modal-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  const activeTab = tab || 'alerts';
  _currentMarketTab = activeTab;
  document.querySelectorAll('.mmt-tab').forEach(t => t.classList.remove('active'));
  const tabs = document.querySelectorAll('.mmt-tab');
  const tabMap = { alerts: 0, rates: 1, news: 2, book: 3 };
  const idx = tabMap[activeTab] || 0;
  if (tabs[idx]) tabs[idx].classList.add('active');
  renderMarketModal(activeTab);
}
function closeMarketMonitor() {
  const overlay = document.getElementById('market-modal-overlay');
  if (overlay) overlay.style.display = 'none';
}
function switchMarketTab(tab, tabEl) {
  document.querySelectorAll('.mmt-tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');
  _currentMarketTab = tab;
  renderMarketModal(tab);
}
function renderMarketModal(tab) {
  const body = document.getElementById('market-modal-body');
  if (!body) return;
  if (tab === 'alerts') {
    const kpis = `
      <div class="mmt-kpi-strip">
        <div class="mmt-kpi"><div class="mmt-kpi-val">3</div><div class="mmt-kpi-lbl">Active Alerts</div></div>
        <div class="mmt-kpi"><div class="mmt-kpi-val">38</div><div class="mmt-kpi-lbl">Clients Affected</div></div>
        <div class="mmt-kpi"><div class="mmt-kpi-val">+$97K</div><div class="mmt-kpi-lbl">AUM Movement</div></div>
        <div class="mmt-kpi"><div class="mmt-kpi-val">HIGH</div><div class="mmt-kpi-lbl">Market Activity</div></div>
      </div>`;
    const alertsHtml = marketData.alerts.map(a => `
      <div class="mmt-alert-full ${a.type}">
        <div class="mmt-alert-full-icon"><i class="fas ${a.icon}"></i></div>
        <div class="mmt-alert-full-content">
          <div class="mmt-alert-full-title">${a.title}</div>
          <div class="mmt-alert-full-detail">${a.detail}</div>
          <div class="mmt-impact-chips">${a.chips.map(c => `<span class="mmt-impact-chip">${c}</span>`).join('')}</div>
        </div>
      </div>`).join('');
    body.innerHTML = kpis + alertsHtml;
  } else if (tab === 'rates') {
    body.innerHTML = `
      <div class="mmt-kpi-strip">
        <div class="mmt-kpi"><div class="mmt-kpi-val">5.75%</div><div class="mmt-kpi-lbl">Fed Funds Rate</div></div>
        <div class="mmt-kpi"><div class="mmt-kpi-val">6.1%</div><div class="mmt-kpi-lbl">NYL 5-Yr Annuity</div></div>
        <div class="mmt-kpi"><div class="mmt-kpi-val">4.42%</div><div class="mmt-kpi-lbl">10-Yr Treasury</div></div>
        <div class="mmt-kpi"><div class="mmt-kpi-val">+0.3%</div><div class="mmt-kpi-lbl">Rate Change (24h)</div></div>
      </div>
      <div class="liab-section-title"><i class="fas fa-chart-line" style="color:#0369a1"></i> Rate Impact on Product Lines</div>
      <table class="pr-bench-table">
        <thead><tr><th>Product Line</th><th>Previous Rate</th><th>Current Rate</th><th>Change</th><th>Client Impact</th></tr></thead>
        <tbody>
          <tr><td><strong>Fixed Annuities</strong></td><td>5.80%</td><td class="pr-best">6.10%</td><td class="pr-best">+0.30%</td><td>18 clients — FAVORABLE</td></tr>
          <tr><td><strong>Whole Life</strong></td><td>Locked</td><td>Locked</td><td>Neutral</td><td>No immediate impact</td></tr>
          <tr><td><strong>VUL Sub-Accounts</strong></td><td>Variable</td><td>+2.3% MTD</td><td class="pr-best">+2.3%</td><td>$97K AUM gain est.</td></tr>
          <tr><td><strong>Term Life</strong></td><td>Locked</td><td>Locked</td><td>Neutral</td><td>Renewals unaffected</td></tr>
          <tr><td><strong>Disability Income</strong></td><td>Locked</td><td>Locked</td><td>Neutral</td><td>No change</td></tr>
          <tr><td><strong>Long-Term Care</strong></td><td>$6,400/mo</td><td>$6,400/mo</td><td>Neutral</td><td>Stable</td></tr>
        </tbody>
      </table>`;
  } else if (tab === 'news') {
    const newsHtml = marketData.news.map(n => `
      <div class="mmt-news-item">
        <div class="mmt-news-sentiment ${n.sentiment}"></div>
        <div style="flex:1">
          <div class="mmt-news-title">${n.title}</div>
          <div class="mmt-news-source">${n.source}</div>
        </div>
        <div class="mmt-news-score ${n.sentiment}">${n.score}</div>
      </div>`).join('');
    body.innerHTML = `
      <div class="mmt-kpi-strip">
        <div class="mmt-kpi"><div class="mmt-kpi-val">5</div><div class="mmt-kpi-lbl">Positive Stories</div></div>
        <div class="mmt-kpi"><div class="mmt-kpi-val">3</div><div class="mmt-kpi-lbl">Negative Stories</div></div>
        <div class="mmt-kpi"><div class="mmt-kpi-val">72</div><div class="mmt-kpi-lbl">Sentiment Score</div></div>
        <div class="mmt-kpi"><div class="mmt-kpi-val">8</div><div class="mmt-kpi-lbl">Stories Today</div></div>
      </div>
      <div class="liab-section-title"><i class="fas fa-newspaper" style="color:#0369a1"></i> Industry News Feed — Apr 10, 2026</div>
      ${newsHtml}`;
  } else if (tab === 'book') {
    const cards = marketData.bookImpact.map(c => `
      <div class="mmt-book-card">
        <div class="mmt-book-card-title"><i class="fas fa-chart-bar" style="color:#0369a1;margin-right:6px"></i>${c.title}</div>
        ${c.rows.map(r => `<div class="mmt-book-row"><span>${r.label}</span><span class="mmt-book-val">${r.val}</span></div>`).join('')}
      </div>`).join('');
    body.innerHTML = `
      <div class="liab-section-title" style="font-size:14px;margin-bottom:14px"><i class="fas fa-book" style="color:#0369a1"></i> Book-of-Business Impact Analysis</div>
      <div class="mmt-book-impact-row">${cards}</div>`;
  }
}

// Click-outside handler for market modal
document.addEventListener('DOMContentLoaded', function() {
  const mOverlay = document.getElementById('market-modal-overlay');
  if (mOverlay) mOverlay.addEventListener('click', function(e) { if (e.target === mOverlay) closeMarketMonitor(); });
  const prOverlay = document.getElementById('pricing-report-overlay');
  if (prOverlay) prOverlay.addEventListener('click', function(e) { if (e.target === prOverlay) closePricingReport(); });
});

// ============================================================
// TASK #19 — Sales Pipeline AI
// openDealAIModal, closeDealAIModal, switchDaiTab
// openSalesAIReport, closeSalesAIReport, switchSairTab
// openConversionForecast, salesAIData
// ============================================================

const salesAIData = {
  D001: {
    id: 'D001', client: 'Alex Rivera', product: 'Whole Life — $500K', stage: 'Prospect',
    annualValue: '$4,200/yr', commission: '$504', winScore: 82, priority: '#5',
    closeWindow: '14d', stageColor: 'amber',
    ringColor: '#f59e0b', ringDash: '173 214',
    convProb: 82, convLabel: 'Likely Close',
    factors: {
      positive: [
        { label: 'Qualified lead — referral from Robert Chen', pts: '+22' },
        { label: 'Budget confirmed: $350+/mo', pts: '+18' },
        { label: 'Meeting booked Apr 12 — high intent', pts: '+15' },
        { label: 'Age 34 — strong WL candidate', pts: '+12' },
      ],
      negative: [
        { label: 'No prior policy — first-time buyer hesitation', pts: '-8' },
        { label: 'Still evaluating 2 competitors', pts: '-12' },
      ],
      neutral: [
        { label: 'Spouse not yet involved in decision', pts: '-5' },
      ]
    },
    nba: [
      { priority: 'critical', title: 'Send Pre-Meeting Brief — Apr 12 at 10am', desc: 'Prepare a personalized WL illustration at $4,200/yr with 20-year cash value projection. Include a comparison to term with conversion benefit. Send via email 24 hours before meeting.', actions: ['Send Brief', 'Open E-App'] },
      { priority: 'high', title: 'Loop In Robert Chen as Referral Anchor', desc: 'Robert Chen referred Alex Rivera. A quick text to Robert reinforcing the relationship ("Alex and I are meeting tomorrow") can increase trust and conversion probability by ~11%.', actions: ['Text Robert', 'AI Draft'] },
      { priority: 'medium', title: 'Prepare WL vs Term Comparison Slide', desc: 'AI analysis shows Alex Rivera compared WL to Term Life on 3 occasions. Prepare a side-by-side showing 30-year total cost difference and permanent vs. temporary protection.', actions: ['Generate Slide', 'Ask AI'] },
    ],
    convScenarios: [
      { icon: '🎯', label: 'Best Case', desc: 'April 12 meeting closes — same-day signature', pct: '82%', level: 'high' },
      { icon: '📋', label: 'Base Case', desc: 'Follow-up needed after meeting — close Apr 19', pct: '68%', level: 'medium' },
      { icon: '⏳', label: 'Stall Risk', desc: 'Prospect delays for family discussion', pct: '32%', level: 'low' },
    ],
    timeline: [
      { date: 'Mar 28', title: 'Referral Received', desc: 'Robert Chen introduced Alex Rivera via email', dot: 'done' },
      { date: 'Apr 3', title: 'Discovery Call', desc: '30-min call — budget confirmed, WL interest confirmed', dot: 'done' },
      { date: 'Apr 7', title: 'WL Illustration Sent', desc: 'AI-generated illustration for $500K WL at Preferred rate', dot: 'done' },
      { date: 'Apr 12', title: 'In-person Meeting', desc: 'Product presentation + e-app start expected', dot: 'current' },
      { date: 'Apr 15', title: 'Application Submission', desc: 'Target: submit e-app immediately after meeting', dot: 'future' },
      { date: 'Apr 28', title: 'UW Decision Expected', desc: 'Preferred Plus likely — clean health profile', dot: 'future' },
    ],
    forecast: {
      headline: '🎯 82% Close Probability — Priority Prospect',
      rows: [
        { label: 'Expected Close Date', val: 'Apr 15–19, 2026' },
        { label: 'Projected Revenue', val: '$4,200/yr' },
        { label: 'Commission', val: '$504 (first yr)' },
        { label: 'UW Class Estimate', val: 'Preferred Plus' },
        { label: 'AI Confidence', val: '91.2%' },
      ],
      risks: [
        { icon: '⚠️', text: 'Competitor proposal from Prudential still on table', impact: 'medium' },
        { icon: '👥', text: 'Spouse involvement could add 7-day decision lag', impact: 'low' },
      ]
    }
  },
  D004: {
    id: 'D004', client: 'Michael Santos', product: 'Universal Life — $750K', stage: 'Quoted',
    annualValue: '$6,800/yr', commission: '$816', winScore: 91, priority: '#2',
    closeWindow: '3d', stageColor: 'green',
    ringColor: '#22c55e', ringDash: '193 214',
    convProb: 91, convLabel: 'High Probability',
    factors: {
      positive: [
        { label: 'Lab results received — all clear', pts: '+25' },
        { label: 'Quote accepted in principle — verbal OK', pts: '+22' },
        { label: 'Budget pre-qualified $550+/mo', pts: '+18' },
        { label: 'Business owner — estate planning driver', pts: '+15' },
      ],
      negative: [
        { label: 'Waiting on attorney review of beneficiary clause', pts: '-10' },
      ],
      neutral: [
        { label: 'Minor cholesterol flag — Preferred still likely', pts: '-5' },
      ]
    },
    nba: [
      { priority: 'critical', title: 'Call to Close — Lab Results Are Clear', desc: 'All lab work returned clean. Attorney review of beneficiary clause is the last open item. Call Michael today, confirm attorney\'s timeline, and offer to have NYL\'s estate planning team provide a 15-min briefing to expedite.', actions: ['Call Now', 'Email Attorney'] },
      { priority: 'high', title: 'Prepare E-App — Pre-fill 95%', desc: 'AI has 95% of e-app pre-filled from prior data. Send DocuSign link immediately after closing call. Include UL product summary and benefit illustration at $750K.', actions: ['Open E-App', 'Send DocuSign'] },
      { priority: 'medium', title: 'Add Accidental Death Rider — $750K AD Rider', desc: 'Santos profile indicates high travel frequency. AI recommendation: propose $750K AD rider at $62/mo — high acceptance probability for business travelers.', actions: ['Add Rider', 'AI Upsell Brief'] },
    ],
    convScenarios: [
      { icon: '⚡', label: 'Same-Week Close', desc: 'Call today → e-app tonight → UW submit Thu', pct: '91%', level: 'high' },
      { icon: '📋', label: 'Next-Week Close', desc: 'Attorney review delays to Apr 17', pct: '78%', level: 'medium' },
      { icon: '🔄', label: 'Stall Scenario', desc: 'Attorney requests policy restructure', pct: '24%', level: 'low' },
    ],
    timeline: [
      { date: 'Mar 15', title: 'Initial Meeting', desc: 'Estate planning review — UL identified as solution', dot: 'done' },
      { date: 'Mar 22', title: 'Quote Delivered', desc: '$750K UL at $6,800/yr — Preferred class estimate', dot: 'done' },
      { date: 'Apr 1', title: 'Lab Work Ordered', desc: 'Full APS-alternative lab panel — NY Life paramed', dot: 'done' },
      { date: 'Apr 8', title: 'Lab Results Received', desc: 'All clear — minor cholesterol flagged (Preferred still OK)', dot: 'done' },
      { date: 'Apr 13', title: 'Close Call — TODAY', desc: 'Confirm attorney timeline, push for e-app signature', dot: 'current' },
      { date: 'Apr 18', title: 'UW Submission Target', desc: 'Submit to underwriting — 7-10 day decision window', dot: 'future' },
    ],
    forecast: {
      headline: '⚡ 91% Win — Close This Week',
      rows: [
        { label: 'Expected Close Date', val: 'Apr 13–17, 2026' },
        { label: 'Annual Revenue', val: '$6,800/yr' },
        { label: 'Commission (Y1)', val: '$816' },
        { label: 'UW Class Estimate', val: 'Preferred' },
        { label: 'Close Window', val: '3 days' },
      ],
      risks: [
        { icon: '⚖️', text: 'Attorney beneficiary review may add 3–5 day lag', impact: 'medium' },
        { icon: '📋', text: 'Minor cholesterol flag — confirm Preferred classification', impact: 'low' },
      ]
    }
  },
  D008: {
    id: 'D008', client: 'Kevin Park', product: 'Term Life — $500K', stage: 'Approved',
    annualValue: '$1,800/yr', commission: '$216', winScore: 95, priority: '#1',
    closeWindow: '2d', stageColor: 'green',
    ringColor: '#22c55e', ringDash: '202 214',
    convProb: 95, convLabel: 'Close Today',
    factors: {
      positive: [
        { label: 'Approved Preferred Plus — best class', pts: '+28' },
        { label: 'E-App 95% complete — DocuSign sent', pts: '+25' },
        { label: 'Verbal confirmation from client', pts: '+20' },
        { label: 'No outstanding open items', pts: '+18' },
      ],
      negative: [
        { label: 'E-signature delay (2 days since sent)', pts: '-8' },
      ],
      neutral: [
        { label: 'Minor follow-up required', pts: '-2' },
      ]
    },
    nba: [
      { priority: 'critical', title: 'Resend DocuSign — 2-Day Close Window', desc: 'Kevin Park\'s e-signature has been pending for 2 days. Approved Preferred Plus. Resend DocuSign with a 48-hour expiry. Text message reminder has 3x higher response rate than email at this stage.', actions: ['Resend DocuSign', 'Text Reminder'] },
      { priority: 'high', title: 'Propose $500K AD Rider — $120/yr Upsell', desc: 'Kevin Park is 29, active lifestyle. Accidental death rider at $120/yr — AI recommends offering after signature to avoid decision fatigue before close. Commission: +$14/yr.', actions: ['Add to E-App', 'AI Pitch Brief'] },
      { priority: 'medium', title: 'Schedule 90-Day Policy Review', desc: 'After issue, schedule a 90-day review call to introduce whole life conversion options. 29-year-old term buyer is 68% likely to convert within 3 years based on book analysis.', actions: ['Schedule Review', 'Set Reminder'] },
    ],
    convScenarios: [
      { icon: '✅', label: 'Sign Today', desc: 'DocuSign reminder → signature within hours', pct: '95%', level: 'high' },
      { icon: '📋', label: 'Sign Tomorrow', desc: 'Slight delay — policy issued Apr 15', pct: '88%', level: 'high' },
      { icon: '⚠️', label: 'Cancellation Risk', desc: 'Client goes dark — unlikely given verbal confirmation', pct: '5%', level: 'low' },
    ],
    timeline: [
      { date: 'Apr 1', title: 'Application Submitted', desc: 'E-app completed — 95% AI pre-filled', dot: 'done' },
      { date: 'Apr 3', title: 'Lab Work Ordered', desc: 'Paramed exam scheduled — age 29 no APS needed', dot: 'done' },
      { date: 'Apr 7', title: 'Lab Results Received', desc: 'All clear — Preferred Plus confirmed', dot: 'done' },
      { date: 'Apr 8', title: 'UW Decision: APPROVED', desc: 'Preferred Plus — best rate class, no exclusions', dot: 'done' },
      { date: 'Apr 11', title: 'DocuSign Sent', desc: 'E-delivery and e-signature request sent', dot: 'done' },
      { date: 'Apr 13', title: 'E-Signature Pending', desc: 'Resend reminder — 2-day window to close', dot: 'current' },
    ],
    forecast: {
      headline: '✅ 95% Win — Act Today to Issue',
      rows: [
        { label: 'Expected Issue Date', val: 'Apr 13–15, 2026' },
        { label: 'Annual Premium', val: '$1,800/yr' },
        { label: 'Commission (Y1)', val: '$216' },
        { label: 'UW Class', val: 'Preferred Plus ★' },
        { label: 'Upsell Potential', val: '+$120/yr (AD Rider)' },
      ],
      risks: [
        { icon: '⏱️', text: 'DocuSign expiry — resend today', impact: 'high' },
        { icon: '📱', text: 'No response to email — switch to text/call', impact: 'medium' },
      ]
    }
  },
  D009: {
    id: 'D009', client: 'Linda Morrison', product: 'UMA — $280K AUM', stage: 'Approved',
    annualValue: '$2,800/yr fee', commission: '$280', winScore: 90, priority: '#3',
    closeWindow: '5d', stageColor: 'green',
    ringColor: '#22c55e', ringDash: '191 214',
    convProb: 90, convLabel: 'Near Close',
    factors: {
      positive: [
        { label: 'Documents signed — all paperwork complete', pts: '+26' },
        { label: 'ACAT transfer initiated', pts: '+22' },
        { label: 'Strong relationship — 12-year client', pts: '+20' },
        { label: '$280K AUM confirmed and ready to transfer', pts: '+18' },
      ],
      negative: [
        { label: 'ACAT transfer 5-7 business day window', pts: '-8' },
      ],
      neutral: [
        { label: 'Custody change (Fidelity → NYL) — standard friction', pts: '-4' },
      ]
    },
    nba: [
      { priority: 'critical', title: 'Initiate ACAT Transfer — Day 1 of 5-7 Window', desc: 'All documents signed. Initiate the ACAT transfer form today. Fidelity typically processes in 5–7 business days. Confirm transfer tracking number and send Linda a status update email.', actions: ['Submit ACAT', 'Email Linda'] },
      { priority: 'high', title: 'Schedule 90-Day Portfolio Review — May 15', desc: 'After transfer completes, schedule a 90-day UMA performance review for May 15. Prepare a proposed asset allocation model: 60% equity, 30% fixed income, 10% alternatives based on Linda\'s risk profile.', actions: ['Schedule May 15', 'Prep Model'] },
      { priority: 'medium', title: 'Propose Estate Planning Review', desc: 'Linda Morrison has $812K total book value including WL, investments, and retirement. AI recommends a holistic estate planning session — high probability of adding NQDC plan or trust services.', actions: ['Estate Proposal', 'AI Brief'] },
    ],
    convScenarios: [
      { icon: '📦', label: 'Transfer Complete', desc: 'ACAT done Apr 18 — account live, fee starts', pct: '90%', level: 'high' },
      { icon: '📋', label: 'Minor Delay', desc: 'Fidelity processing delay — 2 extra days', pct: '82%', level: 'high' },
      { icon: '⚠️', label: 'Transfer Issue', desc: 'ACAT rejection — unlikely, re-submit same day', pct: '8%', level: 'low' },
    ],
    timeline: [
      { date: 'Mar 28', title: 'Annual Review Meeting', desc: 'Identified $280K Fidelity account for consolidation', dot: 'done' },
      { date: 'Apr 2', title: 'UMA Proposal Delivered', desc: 'NYL UMA model — 60/30/10 allocation, 1% mgmt fee', dot: 'done' },
      { date: 'Apr 8', title: 'Docs Signed', desc: 'All NYL investment account paperwork completed', dot: 'done' },
      { date: 'Apr 13', title: 'ACAT Initiation — TODAY', desc: 'Submit ACAT transfer form — 5-7 business days', dot: 'current' },
      { date: 'Apr 18', title: 'Transfer Expected', desc: 'Fidelity completes outbound transfer to NYL', dot: 'future' },
      { date: 'May 15', title: '90-Day Review', desc: 'Portfolio review + estate planning discussion', dot: 'future' },
    ],
    forecast: {
      headline: '📦 90% Win — ACAT In Progress',
      rows: [
        { label: 'Transfer Complete Date', val: 'Apr 18–20, 2026' },
        { label: 'Annual Management Fee', val: '$2,800/yr' },
        { label: 'Commission (Y1)', val: '$280' },
        { label: 'AUM Confirmed', val: '$280,000' },
        { label: 'Upsell Potential', val: 'Estate Plan + NQDC' },
      ],
      risks: [
        { icon: '🏦', text: 'Fidelity ACAT processing may take 7+ days', impact: 'low' },
        { icon: '📋', text: 'Estate planning discussion timing', impact: 'low' },
      ]
    }
  },
  D006: {
    id: 'D006', client: 'Thomas Wright', product: 'Whole Life — $1M', stage: 'Underwriting',
    annualValue: '$9,600/yr', commission: '$1,152', winScore: 88, priority: '#4',
    closeWindow: '5d', stageColor: 'amber',
    ringColor: '#f59e0b', ringDash: '187 214',
    convProb: 88, convLabel: 'High Confidence',
    factors: {
      positive: [
        { label: 'Medical exam done — clean results', pts: '+24' },
        { label: 'High motivation — estate planning for 3 kids', pts: '+20' },
        { label: 'UW decision expected Apr 16 (3 days)', pts: '+18' },
        { label: '$1M WL — strong long-term value client', pts: '+16' },
      ],
      negative: [
        { label: 'Pending UW decision — risk of Standard (not Preferred)', pts: '-9' },
      ],
      neutral: [
        { label: 'Possible rate adjustment if Standard issued', pts: '-5' },
      ]
    },
    nba: [
      { priority: 'high', title: 'Prepare E-Delivery Kit — Expected Apr 16', desc: 'UW decision expected April 16. Prepare the full e-delivery kit now: policy illustration at Preferred class, beneficiary confirmation, payment setup, and cover letter. Have it ready to send within 1 hour of decision.', actions: ['Build Kit', 'Preview E-Delivery'] },
      { priority: 'high', title: 'Set UW Status Tracking Reminder for Apr 16', desc: 'Set an automated status check for April 16 at 9am. If decision comes back Standard (not Preferred), prepare a rate adjustment conversation guide showing the revised premium and long-term value.', actions: ['Set Reminder', 'Rate-Adjust Script'] },
      { priority: 'medium', title: 'Discuss LTCI Rider — Estate Planning Bundle', desc: 'Thomas Wright has 3 dependents and is 44 years old. AI recommends proposing a Long-term Care rider at policy issuance — 34% of WL $1M buyers in this profile accept LTC riders.', actions: ['Rider Proposal', 'AI Brief'] },
    ],
    convScenarios: [
      { icon: '✅', label: 'Preferred Approved Apr 16', desc: 'Issue at original quote — immediate e-delivery', pct: '88%', level: 'high' },
      { icon: '📋', label: 'Standard Issued', desc: 'Rate adjustment needed — close likely Apr 21', pct: '72%', level: 'medium' },
      { icon: '⚠️', label: 'Postponed/Declined', desc: 'Unlikely — clean exam, minor risk factors only', pct: '8%', level: 'low' },
    ],
    timeline: [
      { date: 'Mar 20', title: 'Initial Meeting', desc: 'Estate planning consultation — $1M WL recommended', dot: 'done' },
      { date: 'Mar 25', title: 'Application Submitted', desc: 'E-app complete — AI pre-filled 91%', dot: 'done' },
      { date: 'Apr 3', title: 'Medical Exam Done', desc: 'NYL paramed — all results clean', dot: 'done' },
      { date: 'Apr 8', title: 'APS Received', desc: 'Primary care records reviewed — no flags', dot: 'done' },
      { date: 'Apr 16', title: 'UW Decision Expected', desc: 'Preferred Plus or Preferred — prepare e-delivery kit', dot: 'current' },
      { date: 'Apr 18', title: 'Target Policy Issue', desc: 'E-delivery → signature → issued same day', dot: 'future' },
    ],
    forecast: {
      headline: '🎯 88% Win — UW Decision Apr 16',
      rows: [
        { label: 'Expected Decision Date', val: 'Apr 16, 2026' },
        { label: 'Annual Premium', val: '$9,600/yr' },
        { label: 'Commission (Y1)', val: '$1,152' },
        { label: 'UW Class Estimate', val: 'Preferred' },
        { label: 'Upsell Potential', val: 'LTC Rider +$180/yr' },
      ],
      risks: [
        { icon: '📋', text: 'Standard class vs Preferred — rate adjustment scenario', impact: 'medium' },
        { icon: '⏱️', text: 'UW delay beyond Apr 16 possible', impact: 'low' },
      ]
    }
  }
};

// Fallback for deals without full data
function getSalesAIDeal(dealId) {
  return salesAIData[dealId] || {
    id: dealId, client: 'Client', product: 'Product', stage: 'Active',
    annualValue: '—', commission: '—', winScore: 70, priority: '—',
    closeWindow: '—', stageColor: 'amber',
    ringColor: '#f59e0b', ringDash: '149 214',
    convProb: 70, convLabel: 'In Progress',
    factors: { positive: [], negative: [], neutral: [] },
    nba: [],
    convScenarios: [],
    timeline: [],
    forecast: { headline: 'Analysis in progress', rows: [], risks: [] }
  };
}

function openDealAIModal(dealId) {
  const d = getSalesAIDeal(dealId);
  const overlay = document.getElementById('deal-ai-modal-overlay');
  if (!overlay) return;

  // Populate header
  document.getElementById('dai-client-name').textContent = d.client;
  document.getElementById('dai-product-line').textContent = d.product;
  document.getElementById('dai-ring-val').textContent = d.winScore + '%';
  document.getElementById('dai-conv-val').textContent = d.convProb + '%';
  document.getElementById('dai-days-val').textContent = d.closeWindow;
  document.getElementById('dai-comm-val').textContent = d.commission;
  document.getElementById('dai-priority-val').textContent = d.priority;

  // Stage badge color
  const stageBadge = document.getElementById('dai-stage-badge');
  stageBadge.textContent = d.stage;
  stageBadge.style.background = d.stageColor === 'green' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)';
  stageBadge.style.color = d.stageColor === 'green' ? '#4ade80' : '#fbbf24';
  stageBadge.style.borderColor = d.stageColor === 'green' ? 'rgba(34,197,94,0.4)' : 'rgba(245,158,11,0.4)';

  // Ring arc
  const arc = document.getElementById('dai-ring-arc');
  if (arc) {
    arc.setAttribute('stroke', d.ringColor);
    arc.setAttribute('stroke-dasharray', d.ringDash);
  }

  // Activate first tab
  document.querySelectorAll('.dai-tab').forEach(t => t.classList.remove('active'));
  const firstTab = document.getElementById('dai-tab-overview');
  if (firstTab) firstTab.classList.add('active');
  renderDaiTab('overview', d);

  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeDealAIModal(e) {
  if (e && e.target !== document.getElementById('deal-ai-modal-overlay')) return;
  document.getElementById('deal-ai-modal-overlay').style.display = 'none';
  document.body.style.overflow = '';
}

function switchDaiTab(tab, btn) {
  document.querySelectorAll('.dai-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  // Get current deal from header
  const clientName = document.getElementById('dai-client-name').textContent;
  const dealId = Object.keys(salesAIData).find(id => salesAIData[id].client === clientName) || 'D008';
  renderDaiTab(tab, getSalesAIDeal(dealId));
}

function renderDaiTab(tab, d) {
  const body = document.getElementById('dai-body');
  if (!body) return;

  if (tab === 'overview') {
    // Win Score breakdown
    const posHtml = (d.factors.positive || []).map(f => `
      <div class="dai-factor-row">
        <div class="dai-factor-label">${f.label}</div>
        <div class="dai-factor-bar-wrap"><div class="dai-factor-bar positive" style="width:${Math.min(100, parseInt(f.pts)*2.5)}%"></div></div>
        <div class="dai-factor-pts pos">${f.pts}</div>
      </div>`).join('');
    const negHtml = (d.factors.negative || []).map(f => `
      <div class="dai-factor-row">
        <div class="dai-factor-label">${f.label}</div>
        <div class="dai-factor-bar-wrap"><div class="dai-factor-bar negative" style="width:${Math.min(100, Math.abs(parseInt(f.pts))*4)}%"></div></div>
        <div class="dai-factor-pts neg">${f.pts}</div>
      </div>`).join('');
    const neuHtml = (d.factors.neutral || []).map(f => `
      <div class="dai-factor-row">
        <div class="dai-factor-label">${f.label}</div>
        <div class="dai-factor-bar-wrap"><div class="dai-factor-bar neutral" style="width:${Math.min(100, Math.abs(parseInt(f.pts))*6)}%"></div></div>
        <div class="dai-factor-pts neu">${f.pts}</div>
      </div>`).join('');
    body.innerHTML = `
      <div class="dai-score-grid">
        <div class="dai-score-card">
          <div class="dai-score-card-title">✅ Positive Factors</div>
          ${posHtml || '<div style="color:#94a3b8;font-size:13px">No positive factors recorded</div>'}
        </div>
        <div class="dai-score-card">
          <div class="dai-score-card-title">⚠️ Risk / Negative Factors</div>
          ${negHtml}
          ${neuHtml}
        </div>
      </div>
      <div class="dai-total-score-row">
        <div class="dai-total-lbl"><i class="fas fa-brain"></i> AI Win Probability Score</div>
        <div class="dai-total-val">${d.winScore}%</div>
      </div>
      <div style="margin-top:14px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;">
        <div class="dai-score-card-title" style="margin-bottom:10px">📊 Benchmarks vs. Book Average</div>
        <div class="dai-factor-row">
          <div class="dai-factor-label">This Deal</div>
          <div class="dai-factor-bar-wrap"><div class="dai-factor-bar positive" style="width:${d.winScore}%"></div></div>
          <div class="dai-factor-pts pos">${d.winScore}%</div>
        </div>
        <div class="dai-factor-row">
          <div class="dai-factor-label">Book Average</div>
          <div class="dai-factor-bar-wrap"><div class="dai-factor-bar neutral" style="width:68%"></div></div>
          <div class="dai-factor-pts neu">68%</div>
        </div>
        <div class="dai-factor-row">
          <div class="dai-factor-label">Top Quartile</div>
          <div class="dai-factor-bar-wrap"><div class="dai-factor-bar positive" style="width:88%"></div></div>
          <div class="dai-factor-pts pos">88%</div>
        </div>
      </div>`;

  } else if (tab === 'nba') {
    const actionsHtml = (d.nba || []).map(a => `
      <div class="dai-nba-action-item ${a.priority}">
        <div class="dai-nba-action-top">
          <span class="dai-nba-priority-badge ${a.priority}">${a.priority.toUpperCase()}</span>
          <div class="dai-nba-action-title">${a.title}</div>
        </div>
        <div class="dai-nba-action-desc">${a.desc}</div>
        <div class="dai-nba-action-btns">
          ${(a.actions || []).map((act, i) => `<button class="dai-nba-btn ${i===0?'primary':'secondary'}" onclick="sendContextMessage('${act} for ${d.client} — deal ${d.id}','smart-advisor')"><i class="fas fa-${i===0?'bolt':'comment-alt'}"></i> ${act}</button>`).join('')}
        </div>
      </div>`).join('');
    body.innerHTML = `
      <div class="dai-nba-header">
        <div class="dai-nba-icon">⚡</div>
        <div>
          <div class="dai-nba-urgency-label">AI Next-Best-Action Engine — ${d.client}</div>
          <div class="dai-nba-urgency-val">Close window: ${d.closeWindow} · ${d.convLabel}</div>
        </div>
      </div>
      <div class="dai-nba-action-list">${actionsHtml || '<div style="color:#94a3b8;font-size:13px;padding:12px">No actions required at this stage</div>'}</div>`;

  } else if (tab === 'conv') {
    const scenariosHtml = (d.convScenarios || []).map(s => `
      <div class="dai-conv-scenario">
        <div class="dai-conv-scenario-icon">${s.icon}</div>
        <div class="dai-conv-scenario-info">
          <div class="dai-conv-scenario-label">${s.label}</div>
          <div class="dai-conv-scenario-desc">${s.desc}</div>
        </div>
        <div class="dai-conv-scenario-pct ${s.level}">${s.pct}</div>
      </div>`).join('');
    body.innerHTML = `
      <div class="dai-conv-summary">
        <div class="dai-conv-kpi"><div class="dai-conv-kpi-val green">${d.winScore}%</div><div class="dai-conv-kpi-lbl">Win Probability</div></div>
        <div class="dai-conv-kpi"><div class="dai-conv-kpi-val blue">${d.closeWindow}</div><div class="dai-conv-kpi-lbl">Close Window</div></div>
        <div class="dai-conv-kpi"><div class="dai-conv-kpi-val amber">${d.annualValue}</div><div class="dai-conv-kpi-lbl">Annual Value</div></div>
      </div>
      <div style="font-size:12px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:.05em;margin-bottom:12px"><i class="fas fa-funnel-dollar"></i> Conversion Scenarios</div>
      <div class="dai-conv-scenarios">${scenariosHtml}</div>`;

  } else if (tab === 'timeline') {
    const tlHtml = (d.timeline || []).map(t => `
      <div class="dai-timeline-item">
        <div class="dai-timeline-dot ${t.dot}"></div>
        <div class="dai-timeline-date">${t.date}</div>
        <div class="dai-timeline-title">${t.title}</div>
        <div class="dai-timeline-desc">${t.desc}</div>
      </div>`).join('');
    body.innerHTML = `
      <div style="font-size:12px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:.05em;margin-bottom:16px"><i class="fas fa-history"></i> Deal Timeline — ${d.client}</div>
      <div class="dai-timeline">${tlHtml}</div>`;

  } else if (tab === 'forecast') {
    const rowsHtml = (d.forecast.rows || []).map(r => `
      <div class="dai-forecast-row"><div class="dai-forecast-row-lbl">${r.label}</div><div class="dai-forecast-row-val">${r.val}</div></div>`).join('');
    const risksHtml = (d.forecast.risks || []).map(r => `
      <div class="dai-risk-item">
        <div class="dai-risk-icon">${r.icon}</div>
        <div class="dai-risk-text">${r.text}</div>
        <div class="dai-risk-impact ${r.impact}">${r.impact.toUpperCase()}</div>
      </div>`).join('');
    body.innerHTML = `
      <div class="dai-forecast-card">
        <div class="dai-forecast-headline">${d.forecast.headline}</div>
        ${rowsHtml}
      </div>
      <div style="font-size:12px;font-weight:700;color:#ef4444;text-transform:uppercase;letter-spacing:.05em;margin:16px 0 10px"><i class="fas fa-exclamation-triangle"></i> Risk Factors</div>
      <div class="dai-risk-list">${risksHtml || '<div style="color:#22c55e;font-size:13px;padding:8px">No significant risks identified</div>'}</div>`;
  }
}

// ── Sales AI Report Modal ──
function openSalesAIReport() {
  const overlay = document.getElementById('sales-ai-report-overlay');
  if (!overlay) return;
  document.querySelectorAll('.sair-tab').forEach(t => t.classList.remove('active'));
  const firstTab = document.getElementById('sair-tab-overview');
  if (firstTab) firstTab.classList.add('active');
  renderSairTab('overview');
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeSalesAIReport(e) {
  if (e && e.target !== document.getElementById('sales-ai-report-overlay')) return;
  document.getElementById('sales-ai-report-overlay').style.display = 'none';
  document.body.style.overflow = '';
}

function switchSairTab(tab, btn) {
  document.querySelectorAll('.sair-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderSairTab(tab);
}

function renderSairTab(tab) {
  const body = document.getElementById('sair-body');
  if (!body) return;

  if (tab === 'overview') {
    body.innerHTML = `
      <div class="sair-overview-grid">
        <div class="sair-kpi-card">
          <div class="sair-kpi-icon">💰</div>
          <div class="sair-kpi-val green">$284K</div>
          <div class="sair-kpi-lbl">Pipeline Value</div>
          <div class="sair-kpi-delta">↑ +18% vs last month</div>
        </div>
        <div class="sair-kpi-card">
          <div class="sair-kpi-icon">🎯</div>
          <div class="sair-kpi-val blue">91.2%</div>
          <div class="sair-kpi-lbl">AI Accuracy</div>
          <div class="sair-kpi-delta">↑ +2.1% vs manual</div>
        </div>
        <div class="sair-kpi-card">
          <div class="sair-kpi-icon">⚡</div>
          <div class="sair-kpi-val gold">3</div>
          <div class="sair-kpi-lbl">Close-Ready Deals</div>
          <div class="sair-kpi-delta">Kevin, Santos, Linda</div>
        </div>
        <div class="sair-kpi-card">
          <div class="sair-kpi-icon">📈</div>
          <div class="sair-kpi-val purple">$47.2K</div>
          <div class="sair-kpi-lbl">Projected Close (Apr)</div>
          <div class="sair-kpi-delta">↑ On track for target</div>
        </div>
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:20px;margin-bottom:20px">
        <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:14px"><i class="fas fa-filter" style="color:#6366f1;margin-right:6px"></i> Pipeline Stage Distribution</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${[
            { stage:'Prospect', count:8, pct:100, color:'#6366f1', conv:'22% avg conv.' },
            { stage:'Quoted', count:6, pct:75, color:'#0ea5e9', conv:'41% avg conv.' },
            { stage:'Underwriting', count:4, pct:50, color:'#f59e0b', conv:'74% avg conv.' },
            { stage:'Approved', count:3, pct:38, color:'#22c55e', conv:'90% avg conv.' },
          ].map(s => `
            <div style="display:flex;align-items:center;gap:12px">
              <div style="width:90px;font-size:12px;color:#64748b">${s.stage}</div>
              <div style="flex:1;height:10px;background:#f1f5f9;border-radius:5px;overflow:hidden">
                <div style="width:${s.pct}%;height:100%;background:${s.color};border-radius:5px"></div>
              </div>
              <div style="font-size:12px;font-weight:700;color:#1e293b;min-width:16px">${s.count}</div>
              <div style="font-size:11px;color:#94a3b8;min-width:90px">${s.conv}</div>
            </div>`).join('')}
        </div>
      </div>
      <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;border-radius:12px;padding:16px 20px">
        <div style="font-size:13px;font-weight:700;color:#166534;margin-bottom:10px"><i class="fas fa-robot" style="margin-right:6px"></i> AI Pipeline Intelligence Summary</div>
        <div style="font-size:13px;color:#14532d;line-height:1.7">
          Your pipeline is performing at <strong>91.2% AI accuracy</strong> — above the 89% manual benchmark. 
          3 deals are close-ready: Kevin Park (e-sig pending, 2-day window), Michael Santos (call to close today), and Linda Morrison (ACAT in progress). 
          Thomas Wright's UW decision on April 16 will add a $9,600/yr deal. 
          AI projects <strong>$47,200 in April closes</strong>, putting you on track to hit the $240K annual target at 78% with 3 months remaining.
        </div>
      </div>`;

  } else if (tab === 'winscores') {
    const deals = [
      { id:'D008', rank:1, client:'Kevin Park', stage:'Approved', product:'Term Life $500K', score:95, close:'2d', nba:'Resend DocuSign today' },
      { id:'D004', rank:2, client:'Michael Santos', stage:'Quoted', product:'Universal Life $750K', score:91, close:'3d', nba:'Call to close — lab clear' },
      { id:'D009', rank:3, client:'Linda Morrison', stage:'Approved', product:'UMA $280K AUM', score:90, close:'5d', nba:'Initiate ACAT transfer' },
      { id:'D006', rank:4, client:'Thomas Wright', stage:'Underwriting', product:'Whole Life $1M', score:88, close:'5d', nba:'Prep e-delivery kit' },
      { id:'D001', rank:5, client:'Alex Rivera', stage:'Prospect', product:'Whole Life $500K', score:82, close:'14d', nba:'Send pre-meeting brief' },
      { id:'D005', rank:6, client:'Julia Chen', stage:'Quoted', product:'Deferred Annuity', score:73, close:'21d', nba:'Follow up post-quote' },
      { id:'D007', rank:7, client:'Grace Lee', stage:'Underwriting', product:'VUL $250K', score:69, close:'14d', nba:'Chase APS — delay risk' },
      { id:'D002', rank:8, client:'Nancy Foster', stage:'Prospect', product:'Term Life $1M', score:61, close:'30d', nba:'Health class verification' },
      { id:'D003', rank:9, client:'John Kim', stage:'Prospect', product:'Disability Insurance', score:44, close:'60d', nba:'Re-engage with new proposal' },
    ];
    const tier = s => s >= 80 ? 'high' : s >= 60 ? 'medium' : 'low';
    const rowsHtml = deals.map(d => `
      <tr onclick="closeSalesAIReport();openDealAIModal('${d.id}')" style="cursor:pointer">
        <td><strong>${d.rank}</strong></td>
        <td><strong>${d.client}</strong></td>
        <td style="font-size:12px;color:#64748b">${d.product}</td>
        <td><span style="font-size:11px;font-weight:700;padding:2px 10px;border-radius:10px;background:#f0f9ff;color:#0369a1;border:1px solid #bae6fd">${d.stage}</span></td>
        <td>
          <div class="sair-win-score-cell">
            <div class="sair-win-bar-wrap"><div class="sair-win-bar ${tier(d.score)}" style="width:${d.score}%"></div></div>
            <span class="sair-win-pct ${tier(d.score)}">${d.score}%</span>
          </div>
        </td>
        <td style="font-size:12px;color:#64748b">${d.close}</td>
        <td style="font-size:12px;color:#374151"><i class="fas fa-bolt" style="color:#6366f1;margin-right:5px"></i>${d.nba}</td>
      </tr>`).join('');
    body.innerHTML = `
      <div style="margin-bottom:14px;font-size:13px;color:#64748b">All 9 active deals ranked by AI win probability · Click any row to open AI Deal Intelligence</div>
      <div style="overflow-x:auto">
        <table class="sair-wins-table">
          <thead><tr><th>#</th><th>Client</th><th>Product</th><th>Stage</th><th>Win Score</th><th>Window</th><th>Top NBA</th></tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>`;

  } else if (tab === 'nba') {
    const nbas = [
      { rank:1, client:'Kevin Park', stage:'Approved', product:'Term Life $500K · $216 comm', score:95, cls:'high', action:'Resend DocuSign NOW — 2-day window before approval expires. Text message has 3x response rate.', dealId:'D008' },
      { rank:2, client:'Michael Santos', stage:'Quoted', product:'Universal Life $750K · $816 comm', score:91, cls:'high', action:'Call Michael today — lab results clear, attorney review timeline to confirm. Push for same-week e-app.', dealId:'D004' },
      { rank:3, client:'Linda Morrison', stage:'Approved', product:'UMA $280K AUM · $280/yr', score:90, cls:'high', action:'Submit ACAT transfer form today — 5-7 day window. Confirm tracking number and update client.', dealId:'D009' },
      { rank:4, client:'Thomas Wright', stage:'Underwriting', product:'Whole Life $1M · $1,152 comm', score:88, cls:'medium', action:'Build e-delivery kit now for Apr 16 UW decision. Include Preferred class illustration and LTC rider option.', dealId:'D006' },
      { rank:5, client:'Alex Rivera', stage:'Prospect', product:'Whole Life $500K · $504 comm', score:82, cls:'medium', action:'Send pre-meeting brief tonight for Apr 12 meeting. Include WL illustration, cash value projection, term comparison.', dealId:'D001' },
    ];
    body.innerHTML = `
      <div style="margin-bottom:16px;background:linear-gradient(135deg,#eef2ff,#e0e7ff);border:1px solid #c7d2fe;border-radius:12px;padding:14px 18px">
        <div style="font-size:13px;font-weight:700;color:#3730a3;margin-bottom:4px"><i class="fas fa-bolt" style="margin-right:6px"></i> AI Next-Best-Action Engine — Top 5 Priority Actions</div>
        <div style="font-size:12px;color:#4338ca">Actions ranked by expected revenue impact and close probability. Act on #1 and #2 today.</div>
      </div>
      <div class="sair-nba-grid">
        ${nbas.map(n => `
          <div class="sair-nba-card">
            <div class="sair-nba-rank">${n.rank}</div>
            <div class="sair-nba-info">
              <div class="sair-nba-client-row">
                <div class="sair-nba-client">${n.client}</div>
                <div class="sair-nba-stage">${n.stage}</div>
              </div>
              <div class="sair-nba-product">${n.product}</div>
              <div class="sair-nba-action"><i class="fas fa-arrow-right" style="color:#6366f1;margin-top:2px;flex-shrink:0"></i>${n.action}</div>
            </div>
            <div class="sair-nba-score">
              <div class="sair-nba-score-val ${n.cls}">${n.score}%</div>
              <div class="sair-nba-score-lbl">win</div>
            </div>
          </div>`).join('')}
      </div>`;

  } else if (tab === 'forecast') {
    body.innerHTML = `
      <div class="sair-forecast-grid">
        <div class="sair-forecast-section">
          <div class="sair-forecast-section-title"><i class="fas fa-chart-line"></i> April 2026 Close Forecast</div>
          ${[
            { lbl:'Kevin Park — Term $500K', pct:95, val:'$216' },
            { lbl:'Michael Santos — UL $750K', pct:91, val:'$816' },
            { lbl:'Linda Morrison — UMA $280K', pct:90, val:'$280' },
            { lbl:'Thomas Wright — WL $1M', pct:88, val:'$1,152' },
            { lbl:'Alex Rivera — WL $500K', pct:82, val:'$504' },
          ].map(r => `
            <div class="sair-forecast-bar-row">
              <div class="sair-forecast-bar-lbl">${r.lbl}</div>
              <div class="sair-forecast-bar-wrap"><div class="sair-forecast-bar-fill" style="width:${r.pct}%;background:${r.pct>=88?'#22c55e':'#f59e0b'}"></div></div>
              <div class="sair-forecast-bar-val">${r.val}</div>
            </div>`).join('')}
          <div style="margin-top:14px;padding-top:12px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between">
            <span style="font-size:13px;font-weight:700;color:#1e293b">Projected April Total</span>
            <span style="font-size:16px;font-weight:800;color:#16a34a">$47,200</span>
          </div>
        </div>
        <div class="sair-forecast-section">
          <div class="sair-forecast-section-title"><i class="fas fa-calendar-alt"></i> 90-Day Pipeline Outlook</div>
          ${[
            { lbl:'April (close-ready deals)', pct:85, val:'$47.2K' },
            { lbl:'May (projected + new)', pct:70, val:'$38.4K' },
            { lbl:'June (forecast)', pct:60, val:'$33.0K' },
          ].map(r => `
            <div class="sair-forecast-bar-row">
              <div class="sair-forecast-bar-lbl">${r.lbl}</div>
              <div class="sair-forecast-bar-wrap"><div class="sair-forecast-bar-fill" style="width:${r.pct}%;background:#6366f1"></div></div>
              <div class="sair-forecast-bar-val">${r.val}</div>
            </div>`).join('')}
          <div style="margin-top:14px;padding-top:12px;border-top:1px solid #e2e8f0">
            <div style="font-size:12px;color:#64748b;margin-bottom:6px">Annual Target Progress</div>
            <div style="height:10px;background:#f1f5f9;border-radius:5px;overflow:hidden;margin-bottom:6px">
              <div style="width:78%;height:100%;background:linear-gradient(90deg,#6366f1,#22c55e);border-radius:5px"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:12px">
              <span style="color:#16a34a;font-weight:700">$187K earned (78%)</span>
              <span style="color:#94a3b8">$240K target</span>
            </div>
          </div>
        </div>
      </div>`;
  }
}

// Alias for conversion forecast shortcut
function openConversionForecast() {
  openSalesAIReport();
  setTimeout(() => {
    const tab = document.getElementById('sair-tab-forecast');
    if (tab) { switchSairTab('forecast', tab); }
  }, 100);
}

// Fix A: openConversionPredict → alias to openConversionForecast
function openConversionPredict() {
  openConversionForecast();
}

// Click-outside handlers for new modals
document.addEventListener('DOMContentLoaded', function() {
  const daiOverlay = document.getElementById('deal-ai-modal-overlay');
  if (daiOverlay) daiOverlay.addEventListener('click', function(e) {
    if (e.target === daiOverlay) closeDealAIModal(e);
  });
  const sairOverlay = document.getElementById('sales-ai-report-overlay');
  if (sairOverlay) sairOverlay.addEventListener('click', function(e) {
    if (e.target === sairOverlay) closeSalesAIReport(e);
  });
});

console.log('Sales AI #19 loaded — salesAIData(5 deals), openDealAIModal, switchDaiTab, openSalesAIReport, switchSairTab, openConversionForecast');

// ============================================================
// PHASE 1 FIXES — B, C, D, E
// ============================================================

// ── Fix B: filterPolicies ────────────────────────────────────
function filterPolicies() {
  const q      = (document.getElementById('policy-search')?.value || '').toLowerCase();
  const type   = (document.getElementById('policy-type-filter')?.value || '').toLowerCase();
  const status = (document.getElementById('policy-status-filter')?.value || '').toLowerCase();

  const rows = document.querySelectorAll('#policies-table tbody tr');
  let visible = 0;
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const rowType   = row.querySelector('.policy-type-badge')?.textContent.trim().toLowerCase() || '';
    const rowStatus = row.querySelector('.status-badge')?.textContent.trim().toLowerCase() || '';

    const matchQ      = !q      || text.includes(q);
    const matchType   = !type   || rowType.includes(type);
    const matchStatus = !status || rowStatus === status;

    row.style.display = (matchQ && matchType && matchStatus) ? '' : 'none';
    if (matchQ && matchType && matchStatus) visible++;
  });

  // Update count badge if present
  const badge = document.querySelector('.policies-page .page-toolbar .result-count');
  if (badge) badge.textContent = visible + ' result' + (visible !== 1 ? 's' : '');
}

// ── Fix C: filterClaims ──────────────────────────────────────
function filterClaims() {
  const q        = (document.getElementById('claim-search')?.value || '').toLowerCase();
  const type     = (document.getElementById('claim-type-filter')?.value || '').toLowerCase();
  const status   = (document.getElementById('claim-status-filter')?.value || '').toLowerCase();
  const priority = (document.getElementById('claim-priority-filter')?.value || '').toLowerCase();

  const rows = document.querySelectorAll('.claims-table tbody tr.claim-row');
  let visible = 0;
  rows.forEach(row => {
    const text      = row.textContent.toLowerCase();
    const rowType   = row.querySelector('.claim-type-badge')?.textContent.trim().toLowerCase() || '';
    const rowStatus = row.querySelector('.claim-status-badge')?.textContent.trim().toLowerCase() || '';
    const rowPrio   = row.querySelector('.priority-badge')?.textContent.trim().toLowerCase() || '';

    const matchQ      = !q        || text.includes(q);
    const matchType   = !type     || rowType.includes(type);
    const matchStatus = !status   || rowStatus.includes(status);
    const matchPrio   = !priority || rowPrio === priority;

    row.style.display = (matchQ && matchType && matchStatus && matchPrio) ? '' : 'none';
    if (matchQ && matchType && matchStatus && matchPrio) visible++;
  });
}

// ── Fix D: Notification panel ────────────────────────────────
const NOTIF_DATA = [
  { id: 'n1', icon: 'fa-exclamation-circle', color: '#dc2626', label: 'Urgent',
    title: 'Patricia Nguyen — Lapse Risk',
    body: 'Policy P-100301 under-funded. Lapse projected Jun 20.',
    time: '2 min ago', unread: true },
  { id: 'n2', icon: 'fa-file-alt',           color: '#f59e0b', label: 'Claim',
    title: 'Robert Chen Claim Update',
    body: 'CLM-2026-0041 missing ID docs — expedite action required.',
    time: '14 min ago', unread: true },
  { id: 'n3', icon: 'fa-pen-fancy',           color: '#7c3aed', label: 'Signature',
    title: 'Kevin Park — E-Sign Pending',
    body: 'Term Life $500K e-signature reminder needed today.',
    time: '1 hr ago', unread: true },
  { id: 'n4', icon: 'fa-sync-alt',            color: '#0891b2', label: 'Renewal',
    title: 'Sandra Williams Renewal Due',
    body: 'Policy P-100320 renewal Sep 2026 — outreach recommended.',
    time: '3 hr ago', unread: false },
  { id: 'n5', icon: 'fa-calendar-check',      color: '#059669', label: 'Meeting',
    title: 'Linda Morrison Annual Review',
    body: 'Meeting Apr 15 — pre-brief ready for download.',
    time: '5 hr ago', unread: false },
];

function buildNotifPanel() {
  if (document.getElementById('notif-panel')) return; // already built

  const panel = document.createElement('div');
  panel.id = 'notif-panel';
  panel.className = 'notif-panel';
  panel.innerHTML = `
    <div class="notif-panel-header">
      <span class="notif-panel-title"><i class="fas fa-bell"></i> Notifications</span>
      <button class="notif-mark-all" onclick="markAllNotifsRead()">Mark all read</button>
      <button class="notif-close-btn" onclick="closeNotifPanel()"><i class="fas fa-times"></i></button>
    </div>
    <div class="notif-panel-body" id="notif-panel-body">
      ${NOTIF_DATA.map(n => `
        <div class="notif-item ${n.unread ? 'unread' : ''}" id="${n.id}" onclick="readNotif('${n.id}')">
          <div class="notif-icon-wrap" style="background:${n.color}20;color:${n.color}">
            <i class="fas ${n.icon}"></i>
          </div>
          <div class="notif-content">
            <div class="notif-item-title">${n.title}</div>
            <div class="notif-item-body">${n.body}</div>
            <div class="notif-item-time">${n.time}</div>
          </div>
          ${n.unread ? '<span class="notif-dot"></span>' : ''}
        </div>
      `).join('')}
    </div>
    <div class="notif-panel-footer">
      <button class="notif-view-all" onclick="closeNotifPanel()">View all activity →</button>
    </div>
  `;

  document.body.appendChild(panel);

  // Close on outside click
  document.addEventListener('mousedown', function notifOutside(e) {
    const btn = document.querySelector('.notification-btn');
    if (!panel.contains(e.target) && !btn.contains(e.target)) {
      closeNotifPanel();
      document.removeEventListener('mousedown', notifOutside);
    }
  });
}

function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  if (!panel) {
    buildNotifPanel();
    requestAnimationFrame(() => {
      document.getElementById('notif-panel').classList.add('open');
    });
  } else {
    panel.classList.toggle('open');
  }
}

function closeNotifPanel() {
  const panel = document.getElementById('notif-panel');
  if (panel) panel.classList.remove('open');
}

function readNotif(id) {
  const item = document.getElementById(id);
  if (item) {
    item.classList.remove('unread');
    const dot = item.querySelector('.notif-dot');
    if (dot) dot.remove();
    updateNotifBadge();
  }
}

function markAllNotifsRead() {
  document.querySelectorAll('.notif-item.unread').forEach(item => {
    item.classList.remove('unread');
    const dot = item.querySelector('.notif-dot');
    if (dot) dot.remove();
  });
  updateNotifBadge();
}

function updateNotifBadge() {
  const unread = document.querySelectorAll('.notif-item.unread').length;
  const badge = document.querySelector('.notif-count');
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread > 0 ? '' : 'none';
  }
}

// Wire notification button on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  const notifBtn = document.querySelector('.notification-btn');
  if (notifBtn) notifBtn.addEventListener('click', toggleNotifPanel);
});

// ── Fix E: Reports page action buttons ───────────────────────
function exportReportPDF() {
  const toast = document.createElement('div');
  toast.className = 'phase1-toast';
  toast.innerHTML = '<i class="fas fa-download"></i> Generating PDF report… download will start shortly.';
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3200);
}

function shareReportWithManager() {
  const toast = document.createElement('div');
  toast.className = 'phase1-toast success';
  toast.innerHTML = '<i class="fas fa-share"></i> Report shared with Manager. They will receive an email link.';
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3200);
}

function openAIReportSummary() {
  const overlay = document.createElement('div');
  overlay.id = 'ai-report-summary-overlay';
  overlay.className = 'phase1-modal-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = `
    <div class="phase1-modal">
      <div class="phase1-modal-header">
        <span><i class="fas fa-robot" style="color:#7c3aed;margin-right:8px"></i>AI Report Summary</span>
        <button onclick="document.getElementById('ai-report-summary-overlay').remove()"><i class="fas fa-times"></i></button>
      </div>
      <div class="phase1-modal-body">
        <div class="ai-summary-kpi-row">
          <div class="ai-sum-kpi"><span class="ai-sum-val green">$312K</span><span class="ai-sum-lbl">Insurance Rev</span></div>
          <div class="ai-sum-kpi"><span class="ai-sum-val blue">$4.2M</span><span class="ai-sum-lbl">AUM</span></div>
          <div class="ai-sum-kpi"><span class="ai-sum-val purple">87/100</span><span class="ai-sum-lbl">AI Score</span></div>
          <div class="ai-sum-kpi"><span class="ai-sum-val gold">78%</span><span class="ai-sum-lbl">Target Pace</span></div>
        </div>
        <div class="ai-summary-text">
          <p><strong>Performance Overview (Q1 2026):</strong> Your book of business is tracking at <strong>$1.87M YTD</strong> against a $2.16M annual target — 78% pacing with strong momentum. Insurance revenue leads at $312K this quarter (+9% vs plan).</p>
          <p><strong>Top Strengths:</strong> Advisory segment is your fastest-growing domain at +31% client growth. Retirement annuity premiums up 22% — a direct result of AI-driven income gap identification.</p>
          <p><strong>Opportunities:</strong> Investment adoption rate at 25% leaves significant room — 185 existing clients have no investment products. Cross-selling to the top 10 could generate ~$18K additional annual premium.</p>
          <p><strong>AI Impact:</strong> AI automation delivered $18K in productivity savings, retained $14.2K in at-risk premiums, and reduced claims resolution time by 3.8 days on average.</p>
          <p><strong>Recommended Actions:</strong><br>
          1. Prioritise Patricia Nguyen — annuity candidate ($3K/yr potential)<br>
          2. Schedule James Whitfield retirement illustration<br>
          3. Launch renewal campaign for 23 policies due Q2<br>
          4. Run cross-sell outreach for top 20 single-product clients</p>
        </div>
      </div>
      <div class="phase1-modal-footer">
        <button class="btn btn-primary" onclick="exportReportPDF();document.getElementById('ai-report-summary-overlay').remove()">
          <i class="fas fa-download"></i> Export Full Report
        </button>
        <button class="btn btn-outline" onclick="document.getElementById('ai-report-summary-overlay').remove()">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));
}

function scheduleReport() {
  const overlay = document.createElement('div');
  overlay.id = 'schedule-report-overlay';
  overlay.className = 'phase1-modal-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = `
    <div class="phase1-modal small">
      <div class="phase1-modal-header">
        <span><i class="fas fa-calendar" style="color:#0891b2;margin-right:8px"></i>Schedule Report</span>
        <button onclick="document.getElementById('schedule-report-overlay').remove()"><i class="fas fa-times"></i></button>
      </div>
      <div class="phase1-modal-body">
        <div class="schedule-form">
          <label class="sched-label">Frequency</label>
          <select class="sched-select">
            <option>Weekly — every Monday</option>
            <option>Bi-weekly</option>
            <option>Monthly — 1st of month</option>
            <option>Quarterly</option>
          </select>
          <label class="sched-label">Delivery</label>
          <select class="sched-select">
            <option>Email (PDF)</option>
            <option>Email (Excel)</option>
            <option>In-app notification</option>
          </select>
          <label class="sched-label">Recipients</label>
          <input class="sched-input" type="text" value="sridhar.r@nyl.com, manager@nyl.com" />
          <label class="sched-label">Next delivery</label>
          <input class="sched-input" type="date" value="2026-04-20" />
        </div>
      </div>
      <div class="phase1-modal-footer">
        <button class="btn btn-primary" onclick="confirmScheduleReport()"><i class="fas fa-check"></i> Confirm Schedule</button>
        <button class="btn btn-outline" onclick="document.getElementById('schedule-report-overlay').remove()">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));
}

function confirmScheduleReport() {
  const overlay = document.getElementById('schedule-report-overlay');
  if (overlay) overlay.remove();
  const toast = document.createElement('div');
  toast.className = 'phase1-toast success';
  toast.innerHTML = '<i class="fas fa-calendar-check"></i> Report scheduled successfully. You will receive the first delivery on Apr 20.';
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3500);
}

console.log('Phase 1 fixes loaded — openConversionPredict, filterPolicies, filterClaims, toggleNotifPanel, exportReportPDF, shareReportWithManager, openAIReportSummary, scheduleReport');

// ============================================================
// PHASE 3 — Calendar: Nav, Domain Filter, Add Event, Event Detail
// ============================================================

// ── Calendar state ────────────────────────────────────────────
const CAL_STATE = {
  year:   2026,
  month:  3,          // 0-indexed → April = 3
  filter: '',         // '' = all, 'ins','inv','ret','adv','urgent'
};

// Month names
const CAL_MONTHS = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];

// ── Seed event store (April 2026 + extras for adjacent months) ─
const _calSeedEvents = [
  // April 2026
  { id:'EVT-005',  year:2026, month:3, day:5,  domain:'inv',    cls:'cal-ev-inv', title:'Maria G. — Annuity Review',        time:'10:00 AM', type:'Meeting',    client:'Maria Gonzalez',   notes:'Income annuity illustration ready. Discuss ladder strategy.' },
  { id:'EVT-010a', year:2026, month:3, day:10, domain:'urgent', cls:'urgent',     title:'Kevin Park — Follow-up Call',       time:'9:00 AM',  type:'Call',       client:'Kevin Park',       notes:'Pending e-signature on Term Life $500K. Urgent — close window 2 days.' },
  { id:'EVT-010b', year:2026, month:3, day:10, domain:'ins',    cls:'cal-ev-ins', title:'Robert Chen — Claim Update',        time:'2:00 PM',  type:'Call',       client:'Robert Chen',      notes:'CLM-2026-0041 status update. Expedite missing ID docs.' },
  { id:'EVT-012',  year:2026, month:3, day:12, domain:'inv',    cls:'cal-ev-inv', title:'Alex Rivera — New Prospect',        time:'11:00 AM', type:'In Person',  client:'Alex Rivera',      notes:'Whole Life $500K + annuity interest. Pre-brief ready.' },
  { id:'EVT-015',  year:2026, month:3, day:15, domain:'adv',    cls:'cal-ev-adv', title:'Linda Morrison — Annual Review',    time:'1:00 PM',  type:'In Person',  client:'Linda Morrison',   notes:'Estate + UMA + Insurance review. 90 min. Bring UMA performance report.' },
  { id:'EVT-017',  year:2026, month:3, day:17, domain:'ins',    cls:'cal-ev-ins', title:'Nancy Foster — New Client',         time:'10:30 AM', type:'In Person',  client:'Nancy Foster',     notes:'New prospect — term life + disability needs analysis.' },
  { id:'EVT-018',  year:2026, month:3, day:18, domain:'ret',    cls:'cal-ev-ret', title:'James Whitfield — Retirement Plan', time:'3:00 PM',  type:'Video',      client:'James Whitfield',  notes:'Deferred annuity illustration: $2,800/mo at 65. Review estate updates.' },
  { id:'EVT-022',  year:2026, month:3, day:22, domain:'ins',    cls:'cal-ev-ins', title:'Team Q1 Performance Review',        time:'9:00 AM',  type:'Internal',   client:'Roger Putnam',     notes:'All-lines review with manager. Bring Q1 YTD report.' },
  { id:'EVT-025',  year:2026, month:3, day:25, domain:'adv',    cls:'cal-ev-adv', title:'Robert Chen — Estate Planning',     time:'2:30 PM',  type:'In Person',  client:'Robert Chen',      notes:'Business succession + NQDC plan. Bring buy-sell agreement draft.' },
  { id:'EVT-028',  year:2026, month:3, day:28, domain:'ins',    cls:'renewal',    title:'Sandra Williams — Policy Renewal',  time:'11:00 AM', type:'Meeting',    client:'Sandra Williams',  notes:'P-100320 Term renewal. Discuss conversion options and lapse risk.' },
  // March 2026 (prev)
  { id:'EVT-M03-05', year:2026, month:2, day:5,  domain:'inv',    cls:'cal-ev-inv', title:'Maria G. — Annuity Review (Pre)',   time:'10:00 AM', type:'Meeting',    client:'Maria Gonzalez',   notes:'Pre-discussion for April review.' },
  { id:'EVT-M03-20', year:2026, month:2, day:20, domain:'ins',    cls:'cal-ev-ins', title:'Sandra Williams — Last Contact',    time:'2:00 PM',  type:'Call',       client:'Sandra Williams',  notes:'Policy review, renewal planning.' },
  // May 2026 (next)
  { id:'EVT-M05-02', year:2026, month:4, day:2,  domain:'ret',    cls:'cal-ev-ret', title:'James Whitfield — Annuity Follow',  time:'10:00 AM', type:'Call',       client:'James Whitfield',  notes:'Follow-up after April retirement illustration.' },
  { id:'EVT-M05-08', year:2026, month:4, day:8,  domain:'adv',    cls:'cal-ev-adv', title:'Linda Morrison — UMA Rebalance',    time:'1:30 PM',  type:'Video',      client:'Linda Morrison',   notes:'Quarterly UMA performance + rebalancing review.' },
  { id:'EVT-M05-15', year:2026, month:4, day:15, domain:'ins',    cls:'cal-ev-ins', title:'Patricia Nguyen — Lapse Review',    time:'11:00 AM', type:'Call',       client:'Patricia Nguyen',  notes:'P-100301 lapse risk — urgent premium funding discussion.' },
];

// Mutable event store (seed + user-added)
let calEvents = [..._calSeedEvents];

// ── Navigation ────────────────────────────────────────────────
function calNavMonth(delta) {
  CAL_STATE.month += delta;
  if (CAL_STATE.month > 11) { CAL_STATE.month = 0;  CAL_STATE.year++; }
  if (CAL_STATE.month < 0)  { CAL_STATE.month = 11; CAL_STATE.year--; }
  renderCalendar();
}

function calFilterDomain(val) {
  CAL_STATE.filter = val;
  renderCalendar();
}

// ── Main calendar renderer ────────────────────────────────────
function renderCalendar() {
  const { year, month, filter } = CAL_STATE;

  // Update month label
  const label = document.getElementById('cal-month-label');
  if (label) label.textContent = `${CAL_MONTHS[month]} ${year}`;

  // Filter events for this month
  const monthEvents = calEvents.filter(e =>
    e.year === year && e.month === month &&
    (!filter || e.domain === filter)
  );

  // Group by day
  const byDay = {};
  monthEvents.forEach(ev => {
    if (!byDay[ev.day]) byDay[ev.day] = [];
    byDay[ev.day].push(ev);
  });

  // Days in month, first weekday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  // Today
  const now   = new Date();
  const todayY = now.getFullYear();
  const todayM = now.getMonth();
  const todayD = now.getDate();
  const isCurrentMonth = year === todayY && month === todayM;

  const grid = document.getElementById('cal-grid');
  if (!grid) return;

  // Build cells
  let html = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    .map(d => `<div class="cal-day-header">${d}</div>`).join('');

  // Leading blank cells
  for (let i = 0; i < firstWeekday; i++) {
    html += `<div class="cal-day cal-day-blank"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday  = isCurrentMonth && d === todayD;
    const evs      = byDay[d] || [];
    const hasEv    = evs.length > 0;
    const classes  = ['cal-day', isToday ? 'today' : '', hasEv ? 'has-events' : ''].filter(Boolean).join(' ');

    const evHtml = evs.map(ev =>
      `<div class="cal-event ${ev.cls}" data-evid="${ev.id}" onclick="calEventClick('${ev.id}',event)" title="${ev.title}">${ev.title}</div>`
    ).join('');

    const addDot = evs.length === 0
      ? `<span class="cal-add-dot" onclick="calDayQuickAdd(${d},event)" title="Add event"><i class="fas fa-plus"></i></span>` : '';

    html += `<div class="${classes}" onclick="calDayClick(${d},event)">
      <span class="cal-day-num">${d}</span>
      ${evHtml}
      ${addDot}
    </div>`;
  }

  grid.innerHTML = html;

  // Update sidebar badge counts
  _updateCalSidebarCounts(monthEvents);
}

function _updateCalSidebarCounts(monthEvents) {
  const upBadge = document.querySelector('.upcoming-badge');
  if (upBadge) upBadge.textContent = monthEvents.length;

  // Update domain summary strip
  const domains = { ins:0, inv:0, ret:0, adv:0 };
  monthEvents.forEach(ev => { if (domains[ev.domain] !== undefined) domains[ev.domain]++; });
  const items = document.querySelectorAll('.css-item');
  const labels = ['ins','inv','ret','adv'];
  items.forEach((el, i) => {
    const span = el.querySelector('span');
    if (span && labels[i]) span.textContent = domains[labels[i]];
  });
}

// ── Day click — open quick-add if no events ───────────────────
function calDayClick(day, e) {
  // Only trigger if clicking the cell background, not an event chip
  if (e && e.target.classList.contains('cal-event')) return;
  if (e && e.target.closest('.cal-event')) return;
}

function calDayQuickAdd(day, e) {
  e && e.stopPropagation();
  openAddEventModal(day);
}

// ── Event click — detail popover ──────────────────────────────
function calEventClick(evId, e) {
  e && e.stopPropagation();
  const ev = calEvents.find(x => x.id === evId);
  if (!ev) return;

  // Remove existing popover
  const old = document.getElementById('cal-ev-popover');
  if (old) old.remove();

  const domainColors = { ins:'#003087', inv:'#059669', ret:'#0891b2', adv:'#7c3aed', urgent:'#dc2626' };
  const typeIcons    = { Meeting:'fa-calendar-alt', Call:'fa-phone', 'In Person':'fa-users', Video:'fa-video', Internal:'fa-building' };
  const color = domainColors[ev.domain] || '#003087';
  const icon  = typeIcons[ev.type] || 'fa-calendar';
  const domainName = { ins:'Insurance', inv:'Investments', ret:'Retirement', adv:'Advisory', urgent:'Urgent' }[ev.domain] || ev.domain;

  const pop = document.createElement('div');
  pop.id = 'cal-ev-popover';
  pop.className = 'cal-ev-popover';
  pop.style.cssText = `border-top: 3px solid ${color}`;
  pop.innerHTML = `
    <div class="cep-header">
      <div class="cep-domain-pill" style="background:${color}20;color:${color}">
        <i class="fas ${icon}"></i> ${domainName}
      </div>
      <button class="cep-close" onclick="document.getElementById('cal-ev-popover').remove()"><i class="fas fa-times"></i></button>
    </div>
    <div class="cep-title">${ev.title}</div>
    <div class="cep-meta">
      <span><i class="fas fa-clock"></i> ${ev.time}</span>
      <span><i class="fas fa-tag"></i> ${ev.type}</span>
      <span><i class="fas fa-user"></i> ${ev.client}</span>
    </div>
    <div class="cep-notes">${ev.notes}</div>
    <div class="cep-actions">
      <button class="btn btn-primary cep-btn" onclick="document.getElementById('cal-ev-popover').remove(); openMeetingBrief('MTG-${evId.replace('EVT-','').replace('M03-','P0').replace('M05-','')}')">
        <i class="fas fa-file-alt"></i> Meeting Brief
      </button>
      <button class="btn btn-outline cep-btn" onclick="editCalEvent('${evId}')">
        <i class="fas fa-edit"></i> Edit
      </button>
      <button class="btn btn-outline cep-btn cep-del" onclick="deleteCalEvent('${evId}')">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;

  document.body.appendChild(pop);

  // Position near click
  const rect = e.target.getBoundingClientRect();
  const scrollY = window.scrollY;
  let top  = rect.bottom + scrollY + 6;
  let left = rect.left;
  // Keep within viewport
  if (left + 300 > window.innerWidth) left = window.innerWidth - 316;
  if (left < 8) left = 8;
  pop.style.top  = top + 'px';
  pop.style.left = left + 'px';

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('mousedown', function popClose(ev2) {
      if (!pop.contains(ev2.target)) {
        pop.remove();
        document.removeEventListener('mousedown', popClose);
      }
    });
  }, 100);
}

// ── Delete event ──────────────────────────────────────────────
function deleteCalEvent(evId) {
  calEvents = calEvents.filter(e => e.id !== evId);
  const pop = document.getElementById('cal-ev-popover');
  if (pop) pop.remove();
  renderCalendar();
}

// ── Add Event Modal ───────────────────────────────────────────
function openAddEventModal(preDay) {
  const existing = document.getElementById('cal-add-event-overlay');
  if (existing) existing.remove();

  const { year, month } = CAL_STATE;
  const dayVal = preDay || '';
  const maxDay = new Date(year, month + 1, 0).getDate();

  const overlay = document.createElement('div');
  overlay.id = 'cal-add-event-overlay';
  overlay.className = 'phase1-modal-overlay';
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };

  overlay.innerHTML = `
    <div class="phase1-modal small" style="width:480px">
      <div class="phase1-modal-header" style="background:linear-gradient(135deg,#003087,#0891b2)">
        <span><i class="fas fa-calendar-plus" style="margin-right:8px"></i>Add Calendar Event</span>
        <button onclick="document.getElementById('cal-add-event-overlay').remove()"><i class="fas fa-times"></i></button>
      </div>
      <div class="phase1-modal-body">
        <div class="cae-form">
          <label class="sched-label">Event Title *</label>
          <input class="sched-input" id="cae-title" type="text" placeholder="e.g. James Whitfield — Annual Review" />

          <div class="cae-row">
            <div class="cae-col">
              <label class="sched-label">Day *</label>
              <input class="sched-input" id="cae-day" type="number" min="1" max="${maxDay}" placeholder="Day (1-${maxDay})" value="${dayVal}" />
            </div>
            <div class="cae-col">
              <label class="sched-label">Time</label>
              <input class="sched-input" id="cae-time" type="time" value="10:00" />
            </div>
          </div>

          <div class="cae-row">
            <div class="cae-col">
              <label class="sched-label">Domain</label>
              <select class="sched-select" id="cae-domain">
                <option value="ins">Insurance</option>
                <option value="inv">Investments</option>
                <option value="ret">Retirement</option>
                <option value="adv">Advisory</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div class="cae-col">
              <label class="sched-label">Type</label>
              <select class="sched-select" id="cae-type">
                <option>Meeting</option>
                <option>Call</option>
                <option>In Person</option>
                <option>Video</option>
                <option>Internal</option>
              </select>
            </div>
          </div>

          <label class="sched-label">Client / Contact</label>
          <input class="sched-input" id="cae-client" type="text" placeholder="e.g. Linda Morrison" />

          <label class="sched-label">Notes</label>
          <textarea class="cm-outreach-textarea" id="cae-notes" style="height:72px" placeholder="Meeting agenda, talking points..."></textarea>
        </div>
        <div id="cae-error" style="color:#dc2626;font-size:12px;margin-top:6px;display:none"></div>
      </div>
      <div class="phase1-modal-footer">
        <button class="btn btn-primary" onclick="saveCalEvent()"><i class="fas fa-check"></i> Save Event</button>
        <button class="btn btn-outline" onclick="document.getElementById('cal-add-event-overlay').remove()">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));
  setTimeout(() => { const t = document.getElementById('cae-title'); if (t) t.focus(); }, 200);
}

function saveCalEvent() {
  const title  = document.getElementById('cae-title')?.value.trim();
  const day    = parseInt(document.getElementById('cae-day')?.value, 10);
  const timeRaw= document.getElementById('cae-time')?.value || '10:00';
  const domain = document.getElementById('cae-domain')?.value || 'ins';
  const type   = document.getElementById('cae-type')?.value || 'Meeting';
  const client = document.getElementById('cae-client')?.value.trim() || '—';
  const notes  = document.getElementById('cae-notes')?.value.trim() || '';
  const errEl  = document.getElementById('cae-error');

  const { year, month } = CAL_STATE;
  const maxDay = new Date(year, month + 1, 0).getDate();

  if (!title) { if (errEl) { errEl.textContent='Event title is required.'; errEl.style.display='block'; } return; }
  if (!day || day < 1 || day > maxDay) { if (errEl) { errEl.textContent=`Day must be 1–${maxDay}.`; errEl.style.display='block'; } return; }
  if (errEl) errEl.style.display = 'none';

  // Format time to 12h
  const [h, m] = timeRaw.split(':').map(Number);
  const ampm  = h >= 12 ? 'PM' : 'AM';
  const h12   = h % 12 || 12;
  const timeStr = `${h12}:${String(m).padStart(2,'0')} ${ampm}`;

  const domClsMap = { ins:'cal-ev-ins', inv:'cal-ev-inv', ret:'cal-ev-ret', adv:'cal-ev-adv', urgent:'urgent' };
  const newEv = {
    id: 'EVT-USR-' + Date.now(),
    year, month, day,
    domain, cls: domClsMap[domain] || 'cal-ev-ins',
    title, time: timeStr, type, client, notes,
  };

  calEvents.push(newEv);
  document.getElementById('cal-add-event-overlay').remove();
  renderCalendar();

  // Success toast
  const toast = document.createElement('div');
  toast.className = 'phase1-toast success';
  toast.innerHTML = `<i class="fas fa-calendar-check"></i> Event "${title}" added to ${CAL_MONTHS[month]} ${day}.`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
}

// ── Edit event (re-opens add modal prefilled) ─────────────────
function editCalEvent(evId) {
  const ev = calEvents.find(x => x.id === evId);
  if (!ev) return;
  const pop = document.getElementById('cal-ev-popover');
  if (pop) pop.remove();

  openAddEventModal(ev.day);

  // Prefill after modal renders
  setTimeout(() => {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    set('cae-title',  ev.title);
    set('cae-day',    ev.day);
    set('cae-domain', ev.domain);
    set('cae-type',   ev.type);
    set('cae-client', ev.client);
    set('cae-notes',  ev.notes);
    // Convert time back to HH:MM
    const match = ev.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      let h = parseInt(match[1]);
      const mins = match[2];
      if (match[3].toUpperCase() === 'PM' && h < 12) h += 12;
      if (match[3].toUpperCase() === 'AM' && h === 12) h = 0;
      set('cae-time', `${String(h).padStart(2,'0')}:${mins}`);
    }
    // Change save button to update
    const btn = document.querySelector('#cal-add-event-overlay .btn-primary');
    if (btn) {
      btn.innerHTML = '<i class="fas fa-save"></i> Update Event';
      btn.onclick = () => {
        calEvents = calEvents.filter(x => x.id !== evId);
        saveCalEvent();
      };
    }
  }, 150);
}

// ── Auto-init calendar when calendar page becomes active ──────
(function() {
  const origNavigateTo = window.navigateTo;
  window.navigateTo = function(page) {
    origNavigateTo(page);
    if (page === 'calendar') {
      setTimeout(renderCalendar, 80);
    }
  };
})();

// Also init on DOMContentLoaded if calendar tab is active
document.addEventListener('DOMContentLoaded', function() {
  // If currently on calendar page
  const calGrid = document.getElementById('cal-grid');
  if (calGrid && document.querySelector('.calendar-page')) {
    renderCalendar();
  }
});

console.log('Phase 3 loaded — calNavMonth, calFilterDomain, renderCalendar, openAddEventModal, saveCalEvent, calEventClick, deleteCalEvent, editCalEvent');
