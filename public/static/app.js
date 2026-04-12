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
    calendar: 'Calendar & Events'
  };

  const breadcrumbs = {
    dashboard: 'Home / Dashboard',
    clients: 'Home / Clients',
    policies: 'Home / Policies',
    'ai-agents': 'Home / AI Agents',
    sales: 'Home / Sales',
    products: 'Home / Products',
    reports: 'Home / Reports',
    calendar: 'Home / Calendar'
  };

  const titleEl = document.getElementById('page-title');
  const bcEl = document.getElementById('page-breadcrumb');
  if (titleEl) titleEl.textContent = titles[page] || page;
  if (bcEl) bcEl.textContent = breadcrumbs[page] || '';

  // Load page content from template
  const templateId = `tpl-${page}`;
  const tpl = document.getElementById(templateId);
  const content = document.getElementById('page-content');
  if (!content) return;

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

  const policyMixEl = document.getElementById('policyMixChart');
  if (policyMixEl) {
    if (policyMixEl._chartInstance) policyMixEl._chartInstance.destroy();
    policyMixEl._chartInstance = new Chart(policyMixEl, {
      type: 'doughnut',
      data: {
        labels: ['Whole Life', 'Term Life', 'Universal Life', 'Variable UL', 'Other'],
        datasets: [{
          data: [32, 28, 18, 12, 10],
          backgroundColor: ['#003087', '#059669', '#d97706', '#7c3aed', '#dc2626'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a2744',
            callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` }
          }
        },
        cutout: '68%'
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

function openClientModal(clientId) {
  const client = clientData.find(c => c.id === clientId);
  if (!client) return;

  document.getElementById('modal-client-name').textContent = client.name;

  const aiInsights = {
    1: ['Estate planning review recommended', 'Whole Life cash value conversion opportunity', 'Annual review overdue by 2 weeks'],
    2: ['Disability insurance gap identified', 'Annuity upsell: $3,000/yr potential', 'Next renewal in 16 months'],
    3: ['Business owner: executive benefits gap', 'SMA or UMA wealth management candidate', 'Claim in progress — follow up needed'],
    4: ['⚠️ Renewal due soon — urgent', 'Coverage gap in long-term care', 'Last contact was 21 days ago'],
    5: ['New parent profile — term life rider suggested', '529 college savings plan opportunity', 'Consider disability insurance'],
    6: ['Estate planning: Trust review suggested', 'Wealth management candidate', 'High satisfaction — ask for referrals'],
    7: ['⚠️ Application pending — follow up immediately', 'Coverage level may be insufficient', 'Young professional — good long-term prospect'],
    8: ['Annual review overdue', 'Long-term care gap identified', 'UMA account candidate (~$500K+ assets)', 'Refer to estate planning specialist'],
  };

  const insights = aiInsights[clientId] || ['No insights available'];

  document.getElementById('modal-client-body').innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px">
      <div>
        <div style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:10px">Contact Info</div>
        <div style="display:flex;flex-direction:column;gap:8px;font-size:14px">
          <div><i class="fas fa-envelope" style="width:18px;color:#003087"></i> ${client.email}</div>
          <div><i class="fas fa-phone" style="width:18px;color:#003087"></i> ${client.phone}</div>
          <div><i class="fas fa-map-marker-alt" style="width:18px;color:#003087"></i> ${client.city}</div>
          <div><i class="fas fa-birthday-cake" style="width:18px;color:#003087"></i> Age ${client.age}</div>
        </div>
      </div>
      <div>
        <div style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:10px">Portfolio</div>
        <div style="display:flex;flex-direction:column;gap:8px;font-size:14px">
          <div><strong>${client.policies}</strong> Active Policies</div>
          <div>Annual Premium: <strong style="color:#059669">$${client.premium.toLocaleString()}</strong></div>
          <div>Segment: <strong>${client.segment}</strong></div>
          <div>Client Score: <strong style="color:#003087">${client.score}/100</strong></div>
        </div>
      </div>
    </div>
    
    <div style="background:linear-gradient(135deg,#667eea,#764ba2);border-radius:10px;padding:14px;margin-bottom:16px">
      <div style="color:white;font-size:13px;font-weight:700;margin-bottom:10px"><i class="fas fa-robot"></i> AI Agent Insights</div>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:6px">
        ${insights.map(i => `<li style="color:rgba(255,255,255,0.9);font-size:13px;display:flex;align-items:flex-start;gap:8px"><i class="fas fa-lightbulb" style="color:#fbbf24;margin-top:2px;flex-shrink:0"></i>${i}</li>`).join('')}
      </ul>
    </div>
    
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="closeClientModal()"><i class="fas fa-file-contract"></i> View Policies</button>
      <button class="btn btn-outline" onclick="closeClientModal()"><i class="fas fa-envelope"></i> Send Email</button>
      <button class="btn btn-outline" onclick="closeClientModal()"><i class="fas fa-phone"></i> Call</button>
      <button class="btn btn-ai" onclick="closeClientModal(); navigateTo('ai-agents')"><i class="fas fa-robot"></i> Full AI Analysis</button>
    </div>
  `;

  document.getElementById('client-modal').classList.add('open');
}

function closeClientModal() {
  const modal = document.getElementById('client-modal');
  if (modal) modal.classList.remove('open');
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

function selectAgent(agentId) {
  document.querySelectorAll('.agent-card').forEach(c => c.classList.remove('active-agent'));
  event.currentTarget.classList.add('active-agent');

  const names = {
    advisor: 'Smart Advisor Agent',
    claims: 'Claims Automation Agent',
    renewal: 'Renewal Automation Agent',
    estate: 'Estate Planning Agent',
    business: 'Business Services Agent',
    compliance: 'Compliance & Reporting Agent'
  };

  const nameEl = document.getElementById('chat-agent-name');
  if (nameEl) nameEl.textContent = names[agentId] || 'AI Agent';
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
            <button onclick="sendQuickMessage('Show me upsell opportunities')">Upsell opportunities</button>
            <button onclick="sendQuickMessage('Which policies are up for renewal?')">Renewals due</button>
            <button onclick="sendQuickMessage('Summarize my dashboard for today')">Daily summary</button>
          </div>
        </div>
      </div>
    `;
  }
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
