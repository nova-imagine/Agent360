import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'

const app = new Hono()

// Layout renderer
app.use(
  jsxRenderer(({ children }) => {
    return (
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>NYL Agent 360 | New York Life</title>
          <link rel="stylesheet" href="/static/style.css" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" />
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body>
          {children}
          <script src="/static/app.js"></script>
        </body>
      </html>
    )
  })
)

// API Routes
app.get('/api/clients', (c) => {
  return c.json({ clients: mockClients })
})

app.get('/api/policies', (c) => {
  return c.json({ policies: mockPolicies })
})

app.get('/api/activities', (c) => {
  return c.json({ activities: mockActivities })
})

app.get('/api/stats', (c) => {
  return c.json(mockStats)
})

app.post('/api/ai-agent', async (c) => {
  const body = await c.req.json()
  const query = body.query || ''
  const response = generateAIResponse(query)
  return c.json({ response, timestamp: new Date().toISOString() })
})

// Main App Route
app.get('/', (c) => {
  return c.render(<MainApp />)
})

// ---- MOCK DATA ----
const mockStats = {
  totalClients: 247,
  activePolicies: 1842,
  monthlyPremium: 487250,
  pendingActions: 18,
  salesThisMonth: 34,
  claimsOpen: 7,
  renewalsDue: 23,
  clientSatisfaction: 94
}

const mockClients = [
  { id: 1, name: 'James Whitfield', age: 52, email: 'james.w@email.com', phone: '(212) 555-0101', policies: 3, premium: 12400, status: 'Active', segment: 'High Value', lastContact: '2026-04-05', city: 'New York', score: 92 },
  { id: 2, name: 'Patricia Nguyen', age: 38, email: 'patricia.n@email.com', phone: '(212) 555-0102', policies: 2, premium: 5800, status: 'Active', segment: 'Mid Market', lastContact: '2026-04-02', city: 'Brooklyn', score: 87 },
  { id: 3, name: 'Robert Chen', age: 45, email: 'robert.c@email.com', phone: '(212) 555-0103', policies: 4, premium: 21000, status: 'Active', segment: 'High Value', lastContact: '2026-04-08', city: 'Manhattan', score: 96 },
  { id: 4, name: 'Sandra Williams', age: 61, email: 'sandra.w@email.com', phone: '(718) 555-0104', policies: 2, premium: 8200, status: 'Review', segment: 'Mid Market', lastContact: '2026-03-20', city: 'Queens', score: 71 },
  { id: 5, name: 'David Thompson', age: 33, email: 'david.t@email.com', phone: '(646) 555-0105', policies: 1, premium: 2400, status: 'Active', segment: 'Emerging', lastContact: '2026-04-07', city: 'Bronx', score: 78 },
  { id: 6, name: 'Maria Gonzalez', age: 48, email: 'maria.g@email.com', phone: '(917) 555-0106', policies: 3, premium: 14600, status: 'Active', segment: 'High Value', lastContact: '2026-04-06', city: 'New York', score: 91 },
  { id: 7, name: 'Kevin Park', age: 29, email: 'kevin.p@email.com', phone: '(212) 555-0107', policies: 1, premium: 1800, status: 'Pending', segment: 'Emerging', lastContact: '2026-04-01', city: 'Jersey City', score: 65 },
  { id: 8, name: 'Linda Morrison', age: 56, email: 'linda.m@email.com', phone: '(718) 555-0108', policies: 5, premium: 32000, status: 'Active', segment: 'Premium', lastContact: '2026-04-09', city: 'Long Island', score: 98 },
]

const mockPolicies = [
  { id: 'P-100291', client: 'James Whitfield', type: 'Whole Life Insurance', premium: 4800, faceValue: 500000, status: 'Active', issued: '2019-06-15', renewal: '2026-06-15', beneficiary: 'Emily Whitfield' },
  { id: 'P-100292', client: 'James Whitfield', type: 'Term Life Insurance', premium: 3200, faceValue: 750000, status: 'Active', issued: '2021-03-01', renewal: '2031-03-01', beneficiary: 'Emily Whitfield' },
  { id: 'P-100293', client: 'James Whitfield', type: 'Long-term Care Insurance', premium: 4400, faceValue: 250000, status: 'Active', issued: '2022-11-10', renewal: '2027-11-10', beneficiary: 'N/A' },
  { id: 'P-100301', client: 'Patricia Nguyen', type: 'Universal Life Insurance', premium: 3000, faceValue: 400000, status: 'Active', issued: '2020-08-20', renewal: '2026-08-20', beneficiary: 'Tom Nguyen' },
  { id: 'P-100302', client: 'Patricia Nguyen', type: 'Variable Universal Life', premium: 2800, faceValue: 300000, status: 'Active', issued: '2023-01-15', renewal: '2028-01-15', beneficiary: 'Tom Nguyen' },
  { id: 'P-100310', client: 'Robert Chen', type: 'Whole Life Insurance', premium: 6000, faceValue: 1000000, status: 'Active', issued: '2018-04-12', renewal: '2028-04-12', beneficiary: 'Susan Chen' },
  { id: 'P-100320', client: 'Sandra Williams', type: 'Term Life Insurance', premium: 2800, faceValue: 350000, status: 'Review', issued: '2016-09-30', renewal: '2026-09-30', beneficiary: 'Michael Williams' },
  { id: 'P-100330', client: 'Linda Morrison', type: 'Whole Life Insurance', premium: 12000, faceValue: 2000000, status: 'Active', issued: '2015-12-01', renewal: '2030-12-01', beneficiary: 'Trust' },
]

const mockActivities = [
  { id: 1, type: 'renewal', client: 'Sandra Williams', desc: 'Policy P-100320 renewal due in 5 months', priority: 'high', date: '2026-04-10', icon: 'fa-sync-alt' },
  { id: 2, type: 'claim', client: 'Robert Chen', desc: 'Claim submitted for policy P-100310 — under review', priority: 'medium', date: '2026-04-09', icon: 'fa-file-alt' },
  { id: 3, type: 'followup', client: 'Kevin Park', desc: 'Follow-up needed on pending application', priority: 'high', date: '2026-04-09', icon: 'fa-phone' },
  { id: 4, type: 'opportunity', client: 'Patricia Nguyen', desc: 'Annuity upsell opportunity identified by AI', priority: 'medium', date: '2026-04-08', icon: 'fa-chart-line' },
  { id: 5, type: 'meeting', client: 'Linda Morrison', desc: 'Annual review meeting scheduled for Apr 15', priority: 'low', date: '2026-04-08', icon: 'fa-calendar' },
  { id: 6, type: 'alert', client: 'James Whitfield', desc: 'Estate planning review suggested — significant assets', priority: 'medium', date: '2026-04-07', icon: 'fa-exclamation-circle' },
]

function generateAIResponse(query: string): string {
  const q = query.toLowerCase()
  if (q.includes('renewal') || q.includes('renew')) {
    return "📋 **Renewal Analysis**: I found 23 policies due for renewal in the next 90 days. High priority: Sandra Williams (P-100320, expires Sep 2026), James Whitfield (P-100291, expires Jun 2026). I recommend scheduling proactive outreach 90 days before renewal. Would you like me to draft personalized emails for these clients?"
  } else if (q.includes('upsell') || q.includes('cross-sell') || q.includes('opportunity')) {
    return "💡 **Upsell Opportunities Identified**: Based on client profiles and life stage analysis:\n\n• **Patricia Nguyen (38)** — Prime candidate for disability insurance (no current coverage)\n• **David Thompson (33)** — New parent profile; recommend adding term life rider\n• **James Whitfield (52)** — Approaching retirement; annuity conversion opportunity (~$180K potential premium)\n• **Robert Chen (45)** — Business owner profile; small business services and executive benefits gap\n\nTotal potential premium uplift: **$31,200/year**"
  } else if (q.includes('claim') || q.includes('claims')) {
    return "📂 **Claims Summary**: You currently have 7 open claims. Robert Chen's claim (P-100310) is in review — submitted Apr 9, estimated resolution in 5-7 business days. 3 claims are pending documentation from clients. Would you like me to send automated document request reminders?"
  } else if (q.includes('estate') || q.includes('planning')) {
    return "🏛️ **Estate Planning Opportunities**: 4 clients in your book qualify for estate planning consultation:\n\n• **Linda Morrison** — $2M+ in policies, trust beneficiary; recommend comprehensive estate review\n• **Robert Chen** — Business owner, needs business continuity and succession planning\n• **James Whitfield** — Multiple assets, suggest reviewing will & testament and POA\n\nThese conversations typically result in 2-3 additional products per client."
  } else if (q.includes('summar') || q.includes('dashboard') || q.includes('today')) {
    return "📊 **Daily Summary for April 10, 2026**:\n\n✅ **Active Clients**: 247 | **Active Policies**: 1,842\n📈 **Monthly Premium**: $487,250 (+12% MoM)\n⚡ **Action Items**: 18 pending | 3 urgent\n\n**Top Priorities Today**:\n1. Follow up with Kevin Park (pending application)\n2. Sandra Williams renewal review\n3. Robert Chen claim status update\n\n**AI Insight**: Your highest-value segment (Premium) is performing 23% above target this month."
  } else if (q.includes('linda') || q.includes('morrison')) {
    return "👤 **Linda Morrison Profile**:\n\n• **Segment**: Premium | **Score**: 98/100\n• **Policies**: 5 | **Annual Premium**: $32,000\n• **Largest Policy**: Whole Life $2M (P-100330)\n• **Last Contact**: April 9, 2026\n\n**AI Recommendations**:\n• Annual policy review overdue — schedule now\n• Long-term care coverage gap identified\n• Estate planning: trust review recommended\n• Potential for Unified Managed Account (UMA) — $500K+ investable assets estimated"
  } else if (q.includes('product') || q.includes('recommend')) {
    return "📦 **Product Recommendations Engine**:\n\nBased on your current book of business demographics:\n\n• **Whole Life Insurance** — Best fit for 45+ clients with estate goals\n• **Income Annuities** — Deferred annuity for clients 10+ years from retirement\n• **Disability Insurance** — High gap in 30-45 age bracket (only 12% covered)\n• **529 College Plans** — 8 clients with children under 10 identified\n• **Small Business Services** — 4 business-owner clients with employee benefits gap\n\nShall I generate targeted outreach lists for each product?"
  } else {
    return `🤖 **AI Agent Response**:\n\nI've analyzed your query: *"${query}"*\n\nHere's what I found based on your current book of business and policy data:\n\n• Your portfolio spans 247 active clients with $487K in monthly recurring premiums\n• I can help you with: client analysis, renewal tracking, cross-sell opportunities, claims management, estate planning reviews, and performance reporting\n• Try asking me: "Show renewal opportunities", "Which clients need follow-up?", or "Identify upsell opportunities"\n\nHow else can I assist you today?`
  }
}

// ---- JSX COMPONENTS ----

function MainApp() {
  return (
    <>
      <div id="app-root">
        <Sidebar />
        <div class="main-content" id="main-content">
          <TopBar />
          <div class="page-content" id="page-content">
            <DashboardPage />
          </div>
        </div>
      </div>

      {/* Hidden page templates */}
      <div id="page-templates" style="display:none">
        <div id="tpl-clients"><ClientsPage /></div>
        <div id="tpl-policies"><PoliciesPage /></div>
        <div id="tpl-ai-agents"><AIAgentsPage /></div>
        <div id="tpl-sales"><SalesPage /></div>
        <div id="tpl-products"><ProductsPage /></div>
        <div id="tpl-reports"><ReportsPage /></div>
        <div id="tpl-calendar"><CalendarPage /></div>
      </div>
    </>
  )
}

function Sidebar() {
  return (
    <nav class="sidebar" id="sidebar">
      <div class="sidebar-brand">
        <div class="brand-logo">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="brand-text">
          <span class="brand-name">NYL</span>
          <span class="brand-tagline">Agent 360</span>
        </div>
        <button class="sidebar-toggle" id="sidebar-toggle" onclick="toggleSidebar()">
          <i class="fas fa-bars"></i>
        </button>
      </div>

      <div class="agent-profile">
        <div class="agent-avatar">SR</div>
        <div class="agent-info">
          <div class="agent-name">Sridhar R.</div>
          <div class="agent-level">Senior Agent</div>
          <div class="agent-badge"><i class="fas fa-star"></i> Top Producer</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-label">MAIN</div>
        <a class="nav-item active" onclick="navigateTo('dashboard')" href="#">
          <i class="fas fa-th-large"></i>
          <span>Dashboard</span>
        </a>
        <a class="nav-item" onclick="navigateTo('clients')" href="#">
          <i class="fas fa-users"></i>
          <span>Clients</span>
          <span class="nav-badge">247</span>
        </a>
        <a class="nav-item" onclick="navigateTo('policies')" href="#">
          <i class="fas fa-file-contract"></i>
          <span>Policies</span>
          <span class="nav-badge">1.8K</span>
        </a>
        <a class="nav-item ai-nav" onclick="navigateTo('ai-agents')" href="#">
          <i class="fas fa-robot"></i>
          <span>AI Agents</span>
          <span class="nav-badge ai-pulse">AI</span>
        </a>

        <div class="nav-section-label">SALES</div>
        <a class="nav-item" onclick="navigateTo('sales')" href="#">
          <i class="fas fa-funnel-dollar"></i>
          <span>Sales Pipeline</span>
        </a>
        <a class="nav-item" onclick="navigateTo('products')" href="#">
          <i class="fas fa-box-open"></i>
          <span>Products</span>
        </a>
        <a class="nav-item" onclick="navigateTo('calendar')" href="#">
          <i class="fas fa-calendar-alt"></i>
          <span>Calendar</span>
          <span class="nav-badge alert">3</span>
        </a>

        <div class="nav-section-label">INSIGHTS</div>
        <a class="nav-item" onclick="navigateTo('reports')" href="#">
          <i class="fas fa-chart-bar"></i>
          <span>Reports</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <a href="#" class="nav-item small">
          <i class="fas fa-cog"></i>
          <span>Settings</span>
        </a>
        <a href="#" class="nav-item small">
          <i class="fas fa-question-circle"></i>
          <span>Help</span>
        </a>
      </div>
    </nav>
  )
}

function TopBar() {
  return (
    <header class="topbar">
      <div class="topbar-left">
        <div class="page-title-area">
          <h1 class="page-title" id="page-title">Dashboard</h1>
          <div class="breadcrumb" id="page-breadcrumb">Home / Dashboard</div>
        </div>
      </div>
      <div class="topbar-right">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search clients, policies..." id="global-search" />
        </div>
        <button class="topbar-btn" title="AI Quick Actions" onclick="navigateTo('ai-agents')">
          <i class="fas fa-robot"></i>
          <span class="ai-indicator"></span>
        </button>
        <button class="topbar-btn notification-btn" title="Notifications">
          <i class="fas fa-bell"></i>
          <span class="notif-count">5</span>
        </button>
        <div class="topbar-avatar">SR</div>
      </div>
    </header>
  )
}

function DashboardPage() {
  return (
    <div class="page dashboard-page">
      {/* Welcome Banner */}
      <div class="welcome-banner">
        <div class="welcome-text">
          <h2>Good morning, Sridhar! 👋</h2>
          <p>You have <strong>18 pending actions</strong> and <strong>3 urgent items</strong> requiring attention today.</p>
        </div>
        <div class="welcome-actions">
          <button class="btn btn-primary" onclick="navigateTo('ai-agents')">
            <i class="fas fa-robot"></i> Ask AI Agent
          </button>
          <button class="btn btn-outline" onclick="navigateTo('clients')">
            <i class="fas fa-plus"></i> New Client
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon blue"><i class="fas fa-users"></i></div>
          <div class="kpi-data">
            <div class="kpi-value">247</div>
            <div class="kpi-label">Total Clients</div>
            <div class="kpi-trend up"><i class="fas fa-arrow-up"></i> +8 this month</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon green"><i class="fas fa-file-contract"></i></div>
          <div class="kpi-data">
            <div class="kpi-value">1,842</div>
            <div class="kpi-label">Active Policies</div>
            <div class="kpi-trend up"><i class="fas fa-arrow-up"></i> +34 this month</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon gold"><i class="fas fa-dollar-sign"></i></div>
          <div class="kpi-data">
            <div class="kpi-value">$487K</div>
            <div class="kpi-label">Monthly Premium</div>
            <div class="kpi-trend up"><i class="fas fa-arrow-up"></i> +12% MoM</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon orange"><i class="fas fa-sync-alt"></i></div>
          <div class="kpi-data">
            <div class="kpi-value">23</div>
            <div class="kpi-label">Renewals Due (90d)</div>
            <div class="kpi-trend warning"><i class="fas fa-exclamation-circle"></i> 5 urgent</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon red"><i class="fas fa-clipboard-list"></i></div>
          <div class="kpi-data">
            <div class="kpi-value">7</div>
            <div class="kpi-label">Open Claims</div>
            <div class="kpi-trend neutral"><i class="fas fa-minus"></i> Avg 5-day resolution</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon purple"><i class="fas fa-star"></i></div>
          <div class="kpi-data">
            <div class="kpi-value">94%</div>
            <div class="kpi-label">Client Satisfaction</div>
            <div class="kpi-trend up"><i class="fas fa-arrow-up"></i> +2% QoQ</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div class="dashboard-grid">
        {/* Sales Performance Chart */}
        <div class="dash-card chart-card">
          <div class="card-header">
            <h3><i class="fas fa-chart-line"></i> Premium Revenue — 2026</h3>
            <div class="card-actions">
              <button class="btn-tiny active">Monthly</button>
              <button class="btn-tiny">Quarterly</button>
            </div>
          </div>
          <div class="chart-container">
            <canvas id="revenueChart"></canvas>
          </div>
        </div>

        {/* Activity Feed */}
        <div class="dash-card activity-card">
          <div class="card-header">
            <h3><i class="fas fa-bolt"></i> Action Items</h3>
            <span class="badge badge-red">18</span>
          </div>
          <div class="activity-list">
            <div class="activity-item high">
              <div class="act-icon"><i class="fas fa-sync-alt"></i></div>
              <div class="act-content">
                <div class="act-title">Renewal Due — Sandra Williams</div>
                <div class="act-desc">Policy P-100320 expires Sep 2026 · 5 months away</div>
              </div>
              <span class="act-badge high">Urgent</span>
            </div>
            <div class="activity-item high">
              <div class="act-icon"><i class="fas fa-phone"></i></div>
              <div class="act-content">
                <div class="act-title">Follow-up — Kevin Park</div>
                <div class="act-desc">Pending application needs client response</div>
              </div>
              <span class="act-badge high">Urgent</span>
            </div>
            <div class="activity-item medium">
              <div class="act-icon"><i class="fas fa-file-alt"></i></div>
              <div class="act-content">
                <div class="act-title">Claim Review — Robert Chen</div>
                <div class="act-desc">Policy P-100310 — awaiting adjuster report</div>
              </div>
              <span class="act-badge medium">In Progress</span>
            </div>
            <div class="activity-item medium">
              <div class="act-icon"><i class="fas fa-robot"></i></div>
              <div class="act-content">
                <div class="act-title">AI Opportunity — Patricia Nguyen</div>
                <div class="act-desc">Annuity upsell opportunity — $3,000 potential premium</div>
              </div>
              <span class="act-badge ai">AI Alert</span>
            </div>
            <div class="activity-item low">
              <div class="act-icon"><i class="fas fa-calendar"></i></div>
              <div class="act-content">
                <div class="act-title">Annual Review — Linda Morrison</div>
                <div class="act-desc">Scheduled for Apr 15, 2026</div>
              </div>
              <span class="act-badge low">Scheduled</span>
            </div>
            <div class="activity-item medium">
              <div class="act-icon"><i class="fas fa-exclamation-circle"></i></div>
              <div class="act-content">
                <div class="act-title">Estate Planning Alert — James Whitfield</div>
                <div class="act-desc">AI detected estate planning review opportunity</div>
              </div>
              <span class="act-badge ai">AI Insight</span>
            </div>
          </div>
        </div>

        {/* Top Clients */}
        <div class="dash-card clients-card">
          <div class="card-header">
            <h3><i class="fas fa-crown"></i> Top Clients by Premium</h3>
            <button class="btn-link" onclick="navigateTo('clients')">View All →</button>
          </div>
          <div class="client-table">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Policies</th>
                  <th>Annual Premium</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div class="client-cell"><div class="mini-avatar lm">LM</div><span>Linda Morrison</span></div></td>
                  <td>5</td>
                  <td class="premium">$32,000</td>
                  <td><div class="score-bar"><div class="score-fill" style="width:98%"></div><span>98</span></div></td>
                  <td><span class="status-badge active">Active</span></td>
                </tr>
                <tr>
                  <td><div class="client-cell"><div class="mini-avatar rc">RC</div><span>Robert Chen</span></div></td>
                  <td>4</td>
                  <td class="premium">$21,000</td>
                  <td><div class="score-bar"><div class="score-fill" style="width:96%"></div><span>96</span></div></td>
                  <td><span class="status-badge active">Active</span></td>
                </tr>
                <tr>
                  <td><div class="client-cell"><div class="mini-avatar mg">MG</div><span>Maria Gonzalez</span></div></td>
                  <td>3</td>
                  <td class="premium">$14,600</td>
                  <td><div class="score-bar"><div class="score-fill" style="width:91%"></div><span>91</span></div></td>
                  <td><span class="status-badge active">Active</span></td>
                </tr>
                <tr>
                  <td><div class="client-cell"><div class="mini-avatar jw">JW</div><span>James Whitfield</span></div></td>
                  <td>3</td>
                  <td class="premium">$12,400</td>
                  <td><div class="score-bar"><div class="score-fill" style="width:92%"></div><span>92</span></div></td>
                  <td><span class="status-badge active">Active</span></td>
                </tr>
                <tr>
                  <td><div class="client-cell"><div class="mini-avatar sw">SW</div><span>Sandra Williams</span></div></td>
                  <td>2</td>
                  <td class="premium">$8,200</td>
                  <td><div class="score-bar"><div class="score-fill" style="width:71%"></div><span>71</span></div></td>
                  <td><span class="status-badge review">Review</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Distribution */}
        <div class="dash-card donut-card">
          <div class="card-header">
            <h3><i class="fas fa-chart-pie"></i> Policy Mix</h3>
          </div>
          <div class="chart-container donut-container">
            <canvas id="policyMixChart"></canvas>
          </div>
          <div class="donut-legend">
            <div class="legend-item"><span class="dot blue"></span>Whole Life 32%</div>
            <div class="legend-item"><span class="dot green"></span>Term Life 28%</div>
            <div class="legend-item"><span class="dot gold"></span>Universal Life 18%</div>
            <div class="legend-item"><span class="dot purple"></span>VUL 12%</div>
            <div class="legend-item"><span class="dot red"></span>Other 10%</div>
          </div>
        </div>
      </div>

      {/* AI Highlights Banner */}
      <div class="ai-highlight-banner" onclick="navigateTo('ai-agents')">
        <div class="ai-banner-icon"><i class="fas fa-robot"></i></div>
        <div class="ai-banner-content">
          <h4>AI Agent has 4 new insights for you</h4>
          <p>Potential revenue opportunity of $31,200 identified · 3 clients flagged for cross-sell · 1 estate planning alert</p>
        </div>
        <button class="btn btn-white">View AI Insights <i class="fas fa-arrow-right"></i></button>
      </div>
    </div>
  )
}

function ClientsPage() {
  return (
    <div class="page clients-page">
      <div class="page-toolbar">
        <div class="toolbar-left">
          <div class="search-inline">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search clients..." id="client-search" oninput="filterClients(this.value)" />
          </div>
          <select class="filter-select" onchange="filterBySegment(this.value)">
            <option value="">All Segments</option>
            <option value="Premium">Premium</option>
            <option value="High Value">High Value</option>
            <option value="Mid Market">Mid Market</option>
            <option value="Emerging">Emerging</option>
          </select>
          <select class="filter-select">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Review">Review</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div class="toolbar-right">
          <button class="btn btn-ai" onclick="aiClientInsights()">
            <i class="fas fa-robot"></i> AI Insights
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-plus"></i> Add Client
          </button>
        </div>
      </div>

      <div class="clients-grid" id="clients-grid">
        {mockClients.map(client => (
          <div class={`client-card segment-${client.segment.replace(' ', '-').toLowerCase()}`} onclick={`openClientModal(${client.id})`}>
            <div class="client-card-header">
              <div class={`client-avatar-lg ca-${client.name.split(' ').map((n:string) => n[0]).join('').toLowerCase()}`}>
                {client.name.split(' ').map((n:string) => n[0]).join('')}
              </div>
              <div class="client-card-info">
                <h4>{client.name}</h4>
                <p>{client.city} · Age {client.age}</p>
                <span class={`segment-tag seg-${client.segment.replace(' ', '-').toLowerCase()}`}>{client.segment}</span>
              </div>
              <div class="client-score-circle">
                <span>{client.score}</span>
              </div>
            </div>
            <div class="client-card-stats">
              <div class="cs-stat">
                <span class="cs-val">{client.policies}</span>
                <span class="cs-lbl">Policies</span>
              </div>
              <div class="cs-stat">
                <span class="cs-val">${(client.premium/1000).toFixed(1)}K</span>
                <span class="cs-lbl">Annual</span>
              </div>
              <div class="cs-stat">
                <span class={`status-dot ${client.status.toLowerCase()}`}></span>
                <span class="cs-lbl">{client.status}</span>
              </div>
            </div>
            <div class="client-card-footer">
              <span><i class="fas fa-clock"></i> Last contact: {client.lastContact}</span>
              <button class="btn-icon" title="Call"><i class="fas fa-phone"></i></button>
              <button class="btn-icon" title="Email"><i class="fas fa-envelope"></i></button>
              <button class="btn-icon ai-btn" title="AI Analysis" onclick="event.stopPropagation(); aiAnalyzeClient(this)"><i class="fas fa-robot"></i></button>
            </div>
          </div>
        ))}
      </div>

      {/* Client Detail Modal */}
      <div class="modal-overlay" id="client-modal" onclick="closeClientModal()">
        <div class="modal-box" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3 id="modal-client-name">Client Details</h3>
            <button class="modal-close" onclick="closeClientModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body" id="modal-client-body">
          </div>
        </div>
      </div>
    </div>
  )
}

function PoliciesPage() {
  return (
    <div class="page policies-page">
      <div class="page-toolbar">
        <div class="toolbar-left">
          <div class="search-inline">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search policies, clients..." />
          </div>
          <select class="filter-select">
            <option value="">All Types</option>
            <option>Whole Life Insurance</option>
            <option>Term Life Insurance</option>
            <option>Universal Life Insurance</option>
            <option>Variable Universal Life</option>
            <option>Long-term Care Insurance</option>
          </select>
          <select class="filter-select">
            <option>All Status</option>
            <option>Active</option>
            <option>Review</option>
            <option>Lapsed</option>
          </select>
        </div>
        <div class="toolbar-right">
          <button class="btn btn-ai" onclick="navigateTo('ai-agents')">
            <i class="fas fa-robot"></i> AI Policy Review
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-plus"></i> New Policy
          </button>
        </div>
      </div>

      <div class="policies-table-wrapper">
        <table class="data-table" id="policies-table">
          <thead>
            <tr>
              <th>Policy ID</th>
              <th>Client</th>
              <th>Type</th>
              <th>Face Value</th>
              <th>Annual Premium</th>
              <th>Status</th>
              <th>Issued</th>
              <th>Renewal</th>
              <th>Beneficiary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockPolicies.map(p => (
              <tr>
                <td><span class="policy-id">{p.id}</span></td>
                <td>
                  <div class="client-cell">
                    <div class="mini-avatar">{p.client.split(' ').map((n:string) => n[0]).join('')}</div>
                    <span>{p.client}</span>
                  </div>
                </td>
                <td><span class="policy-type-badge">{p.type}</span></td>
                <td class="text-right">${(p.faceValue/1000).toFixed(0)}K</td>
                <td class="text-right premium">${p.premium.toLocaleString()}</td>
                <td><span class={`status-badge ${p.status.toLowerCase()}`}>{p.status}</span></td>
                <td class="text-muted">{p.issued}</td>
                <td class={p.status === 'Review' ? 'text-orange' : 'text-muted'}>{p.renewal}</td>
                <td class="text-muted">{p.beneficiary}</td>
                <td>
                  <div class="action-btns">
                    <button class="btn-icon" title="View Details"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon" title="Edit Policy"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon ai-btn" title="AI Analysis"><i class="fas fa-robot"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Policy Summary Cards */}
      <div class="policy-summary-grid">
        <div class="summary-card">
          <div class="sc-icon blue"><i class="fas fa-shield-alt"></i></div>
          <div class="sc-data">
            <div class="sc-val">$5.55M</div>
            <div class="sc-lbl">Total Face Value</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="sc-icon green"><i class="fas fa-dollar-sign"></i></div>
          <div class="sc-data">
            <div class="sc-val">$62,600</div>
            <div class="sc-lbl">Annual Premium (Shown)</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="sc-icon orange"><i class="fas fa-sync"></i></div>
          <div class="sc-data">
            <div class="sc-val">1 Policy</div>
            <div class="sc-lbl">Pending Review</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="sc-icon purple"><i class="fas fa-calendar-check"></i></div>
          <div class="sc-data">
            <div class="sc-val">2026-06-15</div>
            <div class="sc-lbl">Next Renewal</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AIAgentsPage() {
  return (
    <div class="page ai-agents-page">
      <div class="ai-page-header">
        <div class="ai-header-icon">
          <i class="fas fa-robot"></i>
          <span class="ai-pulse-ring"></span>
        </div>
        <div class="ai-header-text">
          <h2>NYL AI Agent Hub</h2>
          <p>Powered by Agentic AI — Automate tasks, surface insights, and streamline your workflow</p>
        </div>
        <div class="ai-status-indicator">
          <span class="ai-online-dot"></span>
          <span>AI Online · GPT-4 Turbo</span>
        </div>
      </div>

      <div class="ai-layout">
        {/* Agent Cards */}
        <div class="ai-agents-panel">
          <h3 class="panel-title">Available AI Agents</h3>

          <div class="agent-card active-agent" onclick="selectAgent('advisor')">
            <div class="agent-card-icon gold"><i class="fas fa-brain"></i></div>
            <div class="agent-card-info">
              <h4>Smart Advisor Agent</h4>
              <p>Analyzes client portfolios, surfaces opportunities, and provides personalized recommendations</p>
              <div class="agent-tags">
                <span>Portfolio Analysis</span><span>Cross-sell</span><span>Upsell</span>
              </div>
            </div>
            <div class="agent-status active"><i class="fas fa-circle"></i> Active</div>
          </div>

          <div class="agent-card" onclick="selectAgent('claims')">
            <div class="agent-card-icon blue"><i class="fas fa-clipboard-check"></i></div>
            <div class="agent-card-info">
              <h4>Claims Automation Agent</h4>
              <p>Processes claims, requests missing documents, and provides real-time claim status updates</p>
              <div class="agent-tags">
                <span>Claims Processing</span><span>Document Request</span>
              </div>
            </div>
            <div class="agent-status active"><i class="fas fa-circle"></i> Active</div>
          </div>

          <div class="agent-card" onclick="selectAgent('renewal')">
            <div class="agent-card-icon green"><i class="fas fa-sync-alt"></i></div>
            <div class="agent-card-info">
              <h4>Renewal Automation Agent</h4>
              <p>Monitors policy renewals, sends proactive outreach, and prepares renewal packages automatically</p>
              <div class="agent-tags">
                <span>Renewal Tracking</span><span>Auto-Outreach</span>
              </div>
            </div>
            <div class="agent-status active"><i class="fas fa-circle"></i> Active</div>
          </div>

          <div class="agent-card" onclick="selectAgent('estate')">
            <div class="agent-card-icon purple"><i class="fas fa-landmark"></i></div>
            <div class="agent-card-info">
              <h4>Estate Planning Agent</h4>
              <p>Identifies estate planning needs, generates client-ready briefs and coordinates with advisors</p>
              <div class="agent-tags">
                <span>Estate Analysis</span><span>Trust Review</span>
              </div>
            </div>
            <div class="agent-status standby"><i class="fas fa-circle"></i> Standby</div>
          </div>

          <div class="agent-card" onclick="selectAgent('business')">
            <div class="agent-card-icon orange"><i class="fas fa-building"></i></div>
            <div class="agent-card-info">
              <h4>Business Services Agent</h4>
              <p>Handles small business insurance analysis, executive benefits planning, and employee benefits design</p>
              <div class="agent-tags">
                <span>SMB Insurance</span><span>Exec Benefits</span>
              </div>
            </div>
            <div class="agent-status standby"><i class="fas fa-circle"></i> Standby</div>
          </div>

          <div class="agent-card" onclick="selectAgent('compliance')">
            <div class="agent-card-icon red"><i class="fas fa-shield-alt"></i></div>
            <div class="agent-card-info">
              <h4>Compliance & Reporting Agent</h4>
              <p>Automates regulatory reporting, flags compliance risks, and generates audit-ready documentation</p>
              <div class="agent-tags">
                <span>Regulatory</span><span>Audit</span><span>Risk</span>
              </div>
            </div>
            <div class="agent-status standby"><i class="fas fa-circle"></i> Standby</div>
          </div>
        </div>

        {/* Chat Interface */}
        <div class="ai-chat-panel">
          <div class="chat-header">
            <div class="chat-agent-info">
              <div class="chat-agent-icon"><i class="fas fa-robot"></i></div>
              <div>
                <h4 id="chat-agent-name">Smart Advisor Agent</h4>
                <p>Ask me anything about your clients and policies</p>
              </div>
            </div>
            <div class="chat-actions">
              <button class="btn-tiny" onclick="clearChat()"><i class="fas fa-trash"></i> Clear</button>
            </div>
          </div>

          <div class="chat-messages" id="chat-messages">
            <div class="chat-msg bot">
              <div class="msg-avatar"><i class="fas fa-robot"></i></div>
              <div class="msg-bubble">
                <p>Hello Sridhar! I'm your <strong>NYL Smart Advisor AI Agent</strong>. I've analyzed your complete book of business and I'm ready to help.</p>
                <p>Here's what I can do for you today:</p>
                <ul>
                  <li>🎯 Identify cross-sell and upsell opportunities</li>
                  <li>🔄 Track and manage policy renewals</li>
                  <li>📋 Analyze claims and flag issues</li>
                  <li>🏛️ Identify estate planning opportunities</li>
                  <li>📊 Generate performance reports</li>
                  <li>✉️ Draft personalized client communications</li>
                </ul>
                <p>What would you like to work on?</p>
                <div class="quick-suggestions">
                  <button onclick="sendQuickMessage('Show me upsell opportunities')">Upsell opportunities</button>
                  <button onclick="sendQuickMessage('Which policies are up for renewal?')">Renewals due</button>
                  <button onclick="sendQuickMessage('Summarize my dashboard for today')">Daily summary</button>
                  <button onclick="sendQuickMessage('Show estate planning opportunities')">Estate planning</button>
                </div>
              </div>
            </div>
          </div>

          <div class="chat-input-area">
            <div class="chat-input-row">
              <input
                type="text"
                id="chat-input"
                placeholder="Ask your AI agent... (e.g., 'Who needs follow-up this week?')"
                onkeydown="handleChatKey(event)"
              />
              <button class="btn-send" onclick="sendChatMessage()">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
            <div class="chat-input-hints">
              <span onclick="sendQuickMessage('Analyze Linda Morrison portfolio')"><i class="fas fa-user"></i> Client analysis</span>
              <span onclick="sendQuickMessage('Which clients need product recommendations?')"><i class="fas fa-box"></i> Product match</span>
              <span onclick="sendQuickMessage('Show open claims status')"><i class="fas fa-file-alt"></i> Claims status</span>
            </div>
          </div>
        </div>
      </div>

      {/* Automation Workflows */}
      <div class="automation-section">
        <h3><i class="fas fa-magic"></i> Active Automation Workflows</h3>
        <div class="workflow-grid">
          <div class="workflow-card running">
            <div class="wf-status"><span class="pulse-dot"></span> Running</div>
            <div class="wf-icon"><i class="fas fa-envelope-open-text"></i></div>
            <h4>Renewal Email Campaign</h4>
            <p>Auto-sending personalized renewal reminders to 23 clients due in 90 days</p>
            <div class="wf-progress">
              <div class="wf-progress-bar" style="width: 65%"></div>
              <span>15/23 sent</span>
            </div>
          </div>
          <div class="workflow-card running">
            <div class="wf-status"><span class="pulse-dot"></span> Running</div>
            <div class="wf-icon"><i class="fas fa-chart-line"></i></div>
            <h4>Portfolio Health Monitor</h4>
            <p>Continuously monitoring 1,842 policies for lapse risk, coverage gaps, and opportunities</p>
            <div class="wf-progress">
              <div class="wf-progress-bar" style="width: 100%"></div>
              <span>Always On</span>
            </div>
          </div>
          <div class="workflow-card paused">
            <div class="wf-status paused">Paused</div>
            <div class="wf-icon"><i class="fas fa-birthday-cake"></i></div>
            <h4>Life Events Trigger</h4>
            <p>Detects life events (marriage, birth, retirement) and suggests appropriate coverage updates</p>
            <div class="wf-stats">3 events detected this month</div>
          </div>
          <div class="workflow-card idle">
            <div class="wf-status idle">Idle</div>
            <div class="wf-icon"><i class="fas fa-file-signature"></i></div>
            <h4>Claims Triage Automation</h4>
            <p>Routes incoming claims to appropriate teams and requests required documentation automatically</p>
            <div class="wf-stats">7 open claims tracked</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SalesPage() {
  return (
    <div class="page sales-page">
      <div class="sales-header-cards">
        <div class="sales-kpi-card">
          <div class="skpi-icon"><i class="fas fa-funnel-dollar"></i></div>
          <div class="skpi-data">
            <div class="skpi-val">$284,000</div>
            <div class="skpi-lbl">Pipeline Value</div>
          </div>
        </div>
        <div class="sales-kpi-card">
          <div class="skpi-icon green"><i class="fas fa-handshake"></i></div>
          <div class="skpi-data">
            <div class="skpi-val">34</div>
            <div class="skpi-lbl">Closed This Month</div>
          </div>
        </div>
        <div class="sales-kpi-card">
          <div class="skpi-icon gold"><i class="fas fa-percentage"></i></div>
          <div class="skpi-data">
            <div class="skpi-val">68%</div>
            <div class="skpi-lbl">Conversion Rate</div>
          </div>
        </div>
        <div class="sales-kpi-card">
          <div class="skpi-icon blue"><i class="fas fa-clock"></i></div>
          <div class="skpi-data">
            <div class="skpi-val">12.4 days</div>
            <div class="skpi-lbl">Avg Sales Cycle</div>
          </div>
        </div>
      </div>

      {/* Pipeline Kanban */}
      <div class="kanban-board">
        <div class="kanban-col">
          <div class="kanban-col-header prospect">
            <span>Prospect</span>
            <span class="col-count">8</span>
          </div>
          <div class="kanban-card">
            <div class="kc-client">Alex Rivera</div>
            <div class="kc-product">Whole Life — $500K</div>
            <div class="kc-value">$4,800/yr</div>
            <div class="kc-tags"><span>High Priority</span><span>Referral</span></div>
          </div>
          <div class="kanban-card">
            <div class="kc-client">Nancy Foster</div>
            <div class="kc-product">Term Life — $1M</div>
            <div class="kc-value">$3,200/yr</div>
            <div class="kc-tags"><span>Online Inquiry</span></div>
          </div>
          <div class="kanban-card">
            <div class="kc-client">John Kim</div>
            <div class="kc-product">Disability Insurance</div>
            <div class="kc-value">$2,100/yr</div>
            <div class="kc-tags"><span>Warm Lead</span></div>
          </div>
          <button class="add-card-btn"><i class="fas fa-plus"></i> Add Prospect</button>
        </div>

        <div class="kanban-col">
          <div class="kanban-col-header quoted">
            <span>Quoted</span>
            <span class="col-count">6</span>
          </div>
          <div class="kanban-card hot">
            <div class="kc-hot-tag"><i class="fas fa-fire"></i> Hot</div>
            <div class="kc-client">Michael Santos</div>
            <div class="kc-product">Universal Life — $750K</div>
            <div class="kc-value">$6,400/yr</div>
            <div class="kc-tags"><span>Quote Sent</span><span>+AI Rec</span></div>
          </div>
          <div class="kanban-card">
            <div class="kc-client">Julia Chen</div>
            <div class="kc-product">Annuity — Deferred</div>
            <div class="kc-value">$8,000/yr</div>
            <div class="kc-tags"><span>Reviewing</span></div>
          </div>
          <button class="add-card-btn"><i class="fas fa-plus"></i> Add</button>
        </div>

        <div class="kanban-col">
          <div class="kanban-col-header underwriting">
            <span>Underwriting</span>
            <span class="col-count">4</span>
          </div>
          <div class="kanban-card">
            <div class="kc-client">Thomas Wright</div>
            <div class="kc-product">Whole Life — $1M</div>
            <div class="kc-value">$9,600/yr</div>
            <div class="kc-tags"><span>Medical Exam Done</span></div>
          </div>
          <div class="kanban-card">
            <div class="kc-client">Grace Lee</div>
            <div class="kc-product">VUL — $250K</div>
            <div class="kc-value">$3,800/yr</div>
            <div class="kc-tags"><span>In Review</span></div>
          </div>
          <button class="add-card-btn"><i class="fas fa-plus"></i> Add</button>
        </div>

        <div class="kanban-col">
          <div class="kanban-col-header approved">
            <span>Approved</span>
            <span class="col-count">3</span>
          </div>
          <div class="kanban-card">
            <div class="kc-client">Kevin Park</div>
            <div class="kc-product">Term Life — $500K</div>
            <div class="kc-value">$1,800/yr</div>
            <div class="kc-tags"><span>Awaiting Signature</span></div>
          </div>
          <button class="add-card-btn"><i class="fas fa-plus"></i> Add</button>
        </div>

        <div class="kanban-col">
          <div class="kanban-col-header closed">
            <span>Closed Won</span>
            <span class="col-count">34</span>
          </div>
          <div class="kanban-card won">
            <div class="kc-client">David Thompson</div>
            <div class="kc-product">Term Life — $500K</div>
            <div class="kc-value">$2,400/yr</div>
            <div class="kc-tags"><span>Apr 7 · Issued</span></div>
          </div>
          <div class="kanban-card won">
            <div class="kc-client">Lisa Brown</div>
            <div class="kc-product">Long-term Care</div>
            <div class="kc-value">$5,200/yr</div>
            <div class="kc-tags"><span>Apr 5 · Issued</span></div>
          </div>
          <div class="view-more-btn">+ 32 more this month</div>
        </div>
      </div>

      {/* Quick Quote Tool */}
      <div class="quick-quote-section">
        <h3><i class="fas fa-calculator"></i> Quick Quote Tool</h3>
        <div class="quote-form">
          <div class="quote-form-grid">
            <div class="form-group">
              <label>Client Name</label>
              <input type="text" placeholder="Enter client name" class="form-input" />
            </div>
            <div class="form-group">
              <label>Age</label>
              <input type="number" placeholder="Age" class="form-input" min="18" max="85" />
            </div>
            <div class="form-group">
              <label>Product Type</label>
              <select class="form-input">
                <option>Whole Life Insurance</option>
                <option>Term Life Insurance</option>
                <option>Universal Life Insurance</option>
                <option>Variable Universal Life</option>
                <option>Long-term Care Insurance</option>
                <option>Individual Disability Insurance</option>
                <option>Fixed Annuity</option>
                <option>Variable Annuity</option>
              </select>
            </div>
            <div class="form-group">
              <label>Coverage Amount</label>
              <select class="form-input">
                <option>$100,000</option>
                <option>$250,000</option>
                <option>$500,000</option>
                <option selected>$1,000,000</option>
                <option>$2,000,000</option>
                <option>Custom</option>
              </select>
            </div>
            <div class="form-group">
              <label>Health Class</label>
              <select class="form-input">
                <option>Preferred Plus</option>
                <option>Preferred</option>
                <option selected>Standard Plus</option>
                <option>Standard</option>
              </select>
            </div>
            <div class="form-group">
              <label>Gender</label>
              <select class="form-input">
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>
          <div class="quote-actions">
            <button class="btn btn-ai"><i class="fas fa-robot"></i> AI-Assisted Quote</button>
            <button class="btn btn-primary"><i class="fas fa-calculator"></i> Calculate Premium</button>
          </div>
          <div class="quote-result" id="quote-result" style="display:none">
            <div class="quote-result-header">Estimated Annual Premium</div>
            <div class="quote-result-value">$6,840 — $8,120</div>
            <div class="quote-result-note">Range based on final underwriting. AI suggests adding disability rider (+$480/yr) for comprehensive coverage.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductsPage() {
  return (
    <div class="page products-page">
      <div class="products-intro">
        <h2>New York Life Product Portfolio</h2>
        <p>Comprehensive suite of insurance and financial products to serve your clients at every life stage</p>
      </div>

      <div class="product-category">
        <div class="product-cat-header">
          <i class="fas fa-shield-alt"></i>
          <h3>Life Insurance Products</h3>
        </div>
        <div class="product-cards-grid">
          {[
            { name: 'Term Life Insurance', desc: 'Temporary protection that can be converted to permanent coverage', icon: 'fa-hourglass-half', color: 'blue', features: ['Convertible to permanent', 'Level premiums', 'Renewable options', 'Death benefit'] },
            { name: 'Whole Life Insurance', desc: 'Permanent policies with guaranteed death benefit and cash value that grows over time', icon: 'fa-infinity', color: 'green', features: ['Guaranteed death benefit', 'Cash value growth', 'Potential dividends', 'Lifetime coverage'] },
            { name: 'Universal Life Insurance', desc: 'Long-term coverage that\'s highly customizable to your needs and budget', icon: 'fa-sliders-h', color: 'purple', features: ['Flexible premiums', 'Adjustable death benefit', 'Cash value component', 'Long-term coverage'] },
            { name: 'Variable Universal Life', desc: 'Long-term coverage with the ability to invest your policy\'s cash value in the market', icon: 'fa-chart-line', color: 'gold', features: ['Market investment options', 'Flexible premiums', 'Potential for higher returns', 'Death benefit'] },
            { name: 'Long-term Care Insurance', desc: 'Helps to pay for someone to help you with everyday tasks, if you ever need it', icon: 'fa-heartbeat', color: 'red', features: ['Daily living assistance', 'Nursing home coverage', 'Home care benefits', 'Inflation protection'] },
            { name: 'Individual Disability Insurance', desc: 'Helps to replace a portion of lost income if sickness or injury prevent you from working', icon: 'fa-user-shield', color: 'orange', features: ['Income replacement', 'Own-occupation definition', 'Partial disability', 'Non-cancelable options'] },
          ].map(p => (
            <div class={`product-card pc-${p.color}`}>
              <div class="pc-icon"><i class={`fas ${p.icon}`}></i></div>
              <h4>{p.name}</h4>
              <p>{p.desc}</p>
              <ul class="pc-features">
                {p.features.map(f => <li><i class="fas fa-check"></i> {f}</li>)}
              </ul>
              <div class="pc-actions">
                <button class="btn btn-outline-sm">Learn More</button>
                <button class="btn btn-primary-sm" onclick="navigateTo('sales')">Quote Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div class="product-category">
        <div class="product-cat-header">
          <i class="fas fa-chart-bar"></i>
          <h3>Financial & Investment Products</h3>
        </div>
        <div class="product-cards-grid four-col">
          {[
            { name: 'Fixed Annuities', desc: 'Stable, long-term retirement savings options that eventually provide an income stream', icon: 'fa-lock', color: 'blue' },
            { name: 'Variable Annuities', desc: 'Single premium with death benefit, income conversion, and market investment capabilities', icon: 'fa-chart-line', color: 'green' },
            { name: 'Mutual Funds', desc: 'Professionally managed investments with exposure in the market', icon: 'fa-coins', color: 'gold' },
            { name: 'ETFs', desc: 'Passively managed, low-fee investments that mimic the overall market or a specific segment', icon: 'fa-exchange-alt', color: 'purple' },
            { name: '529 College Savings Plans', desc: 'Investments designed to help you save for college or other education expenses', icon: 'fa-graduation-cap', color: 'blue' },
            { name: 'Wealth Management', desc: 'Expertise and guidance to create an investment strategy for your future financial needs', icon: 'fa-gem', color: 'gold' },
            { name: 'Estate Planning', desc: 'Guidance to protect your legacy including will, trust, POA, and tax strategies', icon: 'fa-landmark', color: 'purple' },
            { name: 'Small Business Services', desc: 'Insurance planning and retirement for employees, executives, or business owners', icon: 'fa-building', color: 'orange' },
          ].map(p => (
            <div class={`product-card compact pc-${p.color}`}>
              <div class="pc-icon"><i class={`fas ${p.icon}`}></i></div>
              <h4>{p.name}</h4>
              <p>{p.desc}</p>
              <button class="btn btn-primary-sm" onclick="navigateTo('sales')">Explore</button>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Comparison Table */}
      <div class="comparison-section">
        <h3><i class="fas fa-table"></i> Investment Options Comparison</h3>
        <div class="table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Payments</th>
                <th>Death Benefit</th>
                <th>Income Stream</th>
                <th>Market Investment</th>
                <th>Principal Guarantee</th>
                <th>Fees & Expenses</th>
                <th>Liquidity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="product-name-cell"><a href="#">Fixed Annuities</a></td>
                <td>Single premium</td>
                <td class="check"><i class="fas fa-check-circle"></i></td>
                <td></td>
                <td></td>
                <td class="check"><i class="fas fa-check-circle"></i></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td class="product-name-cell"><a href="#">Variable Annuities</a></td>
                <td>Single premium</td>
                <td class="check"><i class="fas fa-check-circle"></i></td>
                <td class="check"><i class="fas fa-check-circle"></i></td>
                <td class="check"><i class="fas fa-check-circle"></i></td>
                <td></td>
                <td class="check"><i class="fas fa-check-circle"></i></td>
                <td></td>
              </tr>
              <tr>
                <td class="product-name-cell"><a href="#">Mutual Funds</a></td>
                <td>You choose</td>
                <td></td>
                <td></td>
                <td class="check"><i class="fas fa-check-circle"></i></td>
                <td></td>
                <td class="check"><i class="fas fa-check-circle"></i></td>
                <td class="check"><i class="fas fa-check-circle"></i></td>
              </tr>
              <tr>
                <td class="product-name-cell"><a href="#">ETFs</a></td>
                <td>You choose</td>
                <td></td>
                <td></td>
                <td class="check"><i class="fas fa-check-circle"></i></td>
                <td></td>
                <td class="check"><i class="fas fa-check-circle"></i></td>
                <td class="check"><i class="fas fa-check-circle"></i></td>
              </tr>
              <tr>
                <td class="product-name-cell"><a href="#">529 Plans</a></td>
                <td>You choose</td>
                <td></td>
                <td></td>
                <td class="check"><i class="fas fa-check-circle"></i></td>
                <td></td>
                <td class="check"><i class="fas fa-check-circle"></i></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ReportsPage() {
  return (
    <div class="page reports-page">
      <div class="reports-grid">
        <div class="report-card main-chart">
          <div class="card-header">
            <h3><i class="fas fa-chart-line"></i> Premium Revenue — YTD 2026</h3>
            <div class="card-actions">
              <button class="btn-tiny active">6M</button>
              <button class="btn-tiny">12M</button>
              <button class="btn-tiny">All</button>
            </div>
          </div>
          <canvas id="reportRevenueChart" style="height:280px"></canvas>
        </div>

        <div class="report-card">
          <div class="card-header">
            <h3><i class="fas fa-chart-pie"></i> Product Distribution</h3>
          </div>
          <canvas id="reportProductChart" style="height:220px"></canvas>
        </div>

        <div class="report-card">
          <div class="card-header">
            <h3><i class="fas fa-users"></i> Client Segments</h3>
          </div>
          <canvas id="reportSegmentChart" style="height:220px"></canvas>
        </div>

        <div class="report-card wide-card">
          <div class="card-header">
            <h3><i class="fas fa-trophy"></i> Performance Scorecard</h3>
          </div>
          <div class="scorecard-grid">
            <div class="score-item">
              <div class="score-label">Sales vs Target</div>
              <div class="score-bar-outer">
                <div class="score-bar-inner" style="width:87%"></div>
              </div>
              <div class="score-pct">87% <span class="score-delta up">+12%</span></div>
            </div>
            <div class="score-item">
              <div class="score-label">Retention Rate</div>
              <div class="score-bar-outer">
                <div class="score-bar-inner green" style="width:96%"></div>
              </div>
              <div class="score-pct">96% <span class="score-delta up">+2%</span></div>
            </div>
            <div class="score-item">
              <div class="score-label">Client Satisfaction</div>
              <div class="score-bar-outer">
                <div class="score-bar-inner gold" style="width:94%"></div>
              </div>
              <div class="score-pct">94% <span class="score-delta up">+2%</span></div>
            </div>
            <div class="score-item">
              <div class="score-label">Renewal Rate</div>
              <div class="score-bar-outer">
                <div class="score-bar-inner" style="width:89%"></div>
              </div>
              <div class="score-pct">89% <span class="score-delta neutral">0%</span></div>
            </div>
            <div class="score-item">
              <div class="score-label">Cross-sell Rate</div>
              <div class="score-bar-outer">
                <div class="score-bar-inner purple" style="width:62%"></div>
              </div>
              <div class="score-pct">62% <span class="score-delta up">+8%</span></div>
            </div>
            <div class="score-item">
              <div class="score-label">Claims Resolved (30d)</div>
              <div class="score-bar-outer">
                <div class="score-bar-inner green" style="width:91%"></div>
              </div>
              <div class="score-pct">91% <span class="score-delta up">+5%</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="report-actions-row">
        <button class="btn btn-primary"><i class="fas fa-download"></i> Export Full Report (PDF)</button>
        <button class="btn btn-outline"><i class="fas fa-share"></i> Share with Manager</button>
        <button class="btn btn-ai"><i class="fas fa-robot"></i> AI Report Summary</button>
        <button class="btn btn-outline"><i class="fas fa-calendar"></i> Schedule Report</button>
      </div>
    </div>
  )
}

function CalendarPage() {
  return (
    <div class="page calendar-page">
      <div class="calendar-layout">
        <div class="calendar-main">
          <div class="cal-header">
            <button class="cal-nav"><i class="fas fa-chevron-left"></i></button>
            <h3>April 2026</h3>
            <button class="cal-nav"><i class="fas fa-chevron-right"></i></button>
            <button class="btn btn-primary cal-add-btn"><i class="fas fa-plus"></i> Add Event</button>
          </div>
          <div class="cal-grid">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div class="cal-day-header">{d}</div>
            ))}
            {[...Array(30)].map((_, i) => {
              const day = i + 1
              const hasEvent = [5, 10, 15, 17, 22, 28].includes(day)
              const isToday = day === 10
              return (
                <div class={`cal-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-events' : ''}`}>
                  <span class="cal-day-num">{day}</span>
                  {day === 10 && <div class="cal-event urgent">Kevin Park Follow-up</div>}
                  {day === 15 && <div class="cal-event">Linda Morrison Annual Review</div>}
                  {day === 17 && <div class="cal-event">New Client Intro — Alex Rivera</div>}
                  {day === 22 && <div class="cal-event">Team Performance Review</div>}
                  {day === 28 && <div class="cal-event renewal">Sandra Williams Renewal</div>}
                </div>
              )
            })}
          </div>
        </div>
        <div class="calendar-sidebar">
          <h4>Upcoming Events</h4>
          <div class="upcoming-list">
            <div class="upcoming-event urgent-event">
              <div class="ue-date">Apr 10</div>
              <div class="ue-info">
                <div class="ue-title">Kevin Park Follow-up</div>
                <div class="ue-desc">Pending application response needed</div>
              </div>
            </div>
            <div class="upcoming-event">
              <div class="ue-date">Apr 15</div>
              <div class="ue-info">
                <div class="ue-title">Linda Morrison Annual Review</div>
                <div class="ue-desc">Policy review + estate planning discussion</div>
              </div>
            </div>
            <div class="upcoming-event">
              <div class="ue-date">Apr 17</div>
              <div class="ue-info">
                <div class="ue-title">New Client Intro — Alex Rivera</div>
                <div class="ue-desc">Initial consultation · Whole Life interest</div>
              </div>
            </div>
            <div class="upcoming-event">
              <div class="ue-date">Apr 22</div>
              <div class="ue-info">
                <div class="ue-title">Team Performance Review</div>
                <div class="ue-desc">Q1 results with Roger Putnam</div>
              </div>
            </div>
            <div class="upcoming-event renewal-event">
              <div class="ue-date">Sep 30</div>
              <div class="ue-info">
                <div class="ue-title">Sandra Williams Renewal</div>
                <div class="ue-desc">Policy P-100320 — 5 months away</div>
              </div>
            </div>
          </div>
          <button class="btn btn-ai full-width-btn" onclick="navigateTo('ai-agents')">
            <i class="fas fa-robot"></i> AI Schedule Optimizer
          </button>
        </div>
      </div>
    </div>
  )
}

export default app
