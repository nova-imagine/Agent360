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
    claims: 'Claims Management'
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
    claims: 'Home / Claims'
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
    } else {
      card.style.display = 'block';
    }
  });

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
