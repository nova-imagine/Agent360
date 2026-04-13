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

  // ── AI Insights: render external app inside an iframe panel ──
  if (page === 'ai-insights') {
    content.innerHTML = `
      <div class="ai-insights-shell">
        <div class="ai-insights-topbar">
          <div class="ai-insights-title">
            <i class="fas fa-brain"></i>
            <span>AI Insights — Powered by GenSpark</span>
          </div>
          <div class="ai-insights-actions">
            <a href="https://toydxqyp.gensparkspace.com/" target="_blank" class="btn btn-outline-sm">
              <i class="fas fa-external-link-alt"></i> Open in New Tab
            </a>
          </div>
        </div>
        <div class="ai-insights-frame-wrap">
          <iframe
            src="https://toydxqyp.gensparkspace.com/"
            class="ai-insights-iframe"
            title="AI Insights"
            allowfullscreen
            allow="clipboard-read; clipboard-write"
          ></iframe>
        </div>
      </div>
    `;
    return;
  }

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
  _currentPolicyTab = tab || 'view';
  const overlay = document.getElementById('policy-modal-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Set active tab
  document.querySelectorAll('#policy-modal-tabs .dmt-tab').forEach(t => t.classList.remove('active'));
  const tabMap = { view: 0, edit: 1, ai: 2 };
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
