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
        <div id="tpl-dashboard"><DashboardPage /></div>
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
          <p>You have <strong>18 pending actions</strong> and <strong>3 urgent items</strong> requiring attention today. · <span class="date-chip">Friday, April 10, 2026</span></p>
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
        <div class="kpi-card" onclick="navigateTo('clients')" style="cursor:pointer">
          <div class="kpi-icon blue"><i class="fas fa-users"></i></div>
          <div class="kpi-data">
            <div class="kpi-value">247</div>
            <div class="kpi-label">Total Clients</div>
            <div class="kpi-trend up"><i class="fas fa-arrow-up"></i> +8 this month</div>
          </div>
        </div>
        <div class="kpi-card" onclick="navigateTo('policies')" style="cursor:pointer">
          <div class="kpi-icon green"><i class="fas fa-file-contract"></i></div>
          <div class="kpi-data">
            <div class="kpi-value">1,842</div>
            <div class="kpi-label">Active Policies</div>
            <div class="kpi-trend up"><i class="fas fa-arrow-up"></i> +34 this month</div>
          </div>
        </div>
        <div class="kpi-card" onclick="navigateTo('reports')" style="cursor:pointer">
          <div class="kpi-icon gold"><i class="fas fa-dollar-sign"></i></div>
          <div class="kpi-data">
            <div class="kpi-value">$487K</div>
            <div class="kpi-label">Monthly Premium</div>
            <div class="kpi-trend up"><i class="fas fa-arrow-up"></i> +12% MoM</div>
          </div>
        </div>
        <div class="kpi-card" onclick="navigateTo('policies')" style="cursor:pointer">
          <div class="kpi-icon orange"><i class="fas fa-sync-alt"></i></div>
          <div class="kpi-data">
            <div class="kpi-value">23</div>
            <div class="kpi-label">Renewals Due (90d)</div>
            <div class="kpi-trend warning"><i class="fas fa-exclamation-circle"></i> 5 urgent</div>
          </div>
        </div>
        <div class="kpi-card" onclick="navigateTo('policies')" style="cursor:pointer">
          <div class="kpi-icon red"><i class="fas fa-clipboard-list"></i></div>
          <div class="kpi-data">
            <div class="kpi-value">7</div>
            <div class="kpi-label">Open Claims</div>
            <div class="kpi-trend neutral"><i class="fas fa-minus"></i> Avg 5-day resolution</div>
          </div>
        </div>
        <div class="kpi-card" onclick="navigateTo('reports')" style="cursor:pointer">
          <div class="kpi-icon purple"><i class="fas fa-star"></i></div>
          <div class="kpi-data">
            <div class="kpi-value">94%</div>
            <div class="kpi-label">Client Satisfaction</div>
            <div class="kpi-trend up"><i class="fas fa-arrow-up"></i> +2% QoQ</div>
          </div>
        </div>
      </div>

      {/* Row 1: Revenue Chart + Action Items */}
      <div class="dashboard-grid">
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
                <div class="act-desc">Annuity upsell — $3,000 potential premium</div>
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
                <div class="act-desc">AI detected estate planning opportunity</div>
              </div>
              <span class="act-badge ai">AI Insight</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Goal Tracker + Commission Tracker + Lapse Risk */}
      <div class="dash-row-3">

        {/* Monthly Goal Tracker */}
        <div class="dash-card goal-card">
          <div class="card-header">
            <h3><i class="fas fa-bullseye"></i> Monthly Goals — April 2026</h3>
            <span class="goal-days-left">21 days left</span>
          </div>
          <div class="goal-list">
            <div class="goal-item">
              <div class="goal-meta">
                <span class="goal-name">New Policies</span>
                <span class="goal-val">34 <span class="goal-target">/ 45</span></span>
              </div>
              <div class="goal-bar-outer">
                <div class="goal-bar-inner" style="width:75.5%"></div>
              </div>
              <div class="goal-footer"><span class="goal-pct">75%</span><span class="goal-gap">11 more needed</span></div>
            </div>
            <div class="goal-item">
              <div class="goal-meta">
                <span class="goal-name">New Premium ($K)</span>
                <span class="goal-val">$487K <span class="goal-target">/ $550K</span></span>
              </div>
              <div class="goal-bar-outer">
                <div class="goal-bar-inner green" style="width:88.5%"></div>
              </div>
              <div class="goal-footer"><span class="goal-pct">88%</span><span class="goal-gap">$63K more needed</span></div>
            </div>
            <div class="goal-item">
              <div class="goal-meta">
                <span class="goal-name">Client Retention</span>
                <span class="goal-val">96% <span class="goal-target">/ 95%</span></span>
              </div>
              <div class="goal-bar-outer">
                <div class="goal-bar-inner gold" style="width:100%"></div>
              </div>
              <div class="goal-footer"><span class="goal-pct achieved">✓ Goal Met!</span><span class="goal-gap">+1% above target</span></div>
            </div>
            <div class="goal-item">
              <div class="goal-meta">
                <span class="goal-name">Cross-Sell Ratio</span>
                <span class="goal-val">1.8 <span class="goal-target">/ 2.5</span></span>
              </div>
              <div class="goal-bar-outer">
                <div class="goal-bar-inner orange" style="width:72%"></div>
              </div>
              <div class="goal-footer"><span class="goal-pct">72%</span><span class="goal-gap">0.7 avg products gap</span></div>
            </div>
            <div class="goal-item">
              <div class="goal-meta">
                <span class="goal-name">Renewals Completed</span>
                <span class="goal-val">18 <span class="goal-target">/ 23</span></span>
              </div>
              <div class="goal-bar-outer">
                <div class="goal-bar-inner purple" style="width:78%"></div>
              </div>
              <div class="goal-footer"><span class="goal-pct">78%</span><span class="goal-gap">5 renewals pending</span></div>
            </div>
          </div>
        </div>

        {/* Commission Tracker */}
        <div class="dash-card commission-card">
          <div class="card-header">
            <h3><i class="fas fa-wallet"></i> Commission Tracker</h3>
            <span class="comm-ytd-badge">YTD 2026</span>
          </div>
          <div class="comm-summary">
            <div class="comm-total">
              <div class="comm-total-val">$42,180</div>
              <div class="comm-total-lbl">Earned This Month</div>
            </div>
            <div class="comm-breakdown">
              <div class="comm-row">
                <span class="comm-type"><i class="fas fa-circle" style="color:#003087"></i> New Business</span>
                <div class="comm-bar-outer"><div class="comm-bar" style="width:68%;background:#003087"></div></div>
                <span class="comm-amt">$28,680</span>
              </div>
              <div class="comm-row">
                <span class="comm-type"><i class="fas fa-circle" style="color:#059669"></i> Renewals</span>
                <div class="comm-bar-outer"><div class="comm-bar" style="width:28%;background:#059669"></div></div>
                <span class="comm-amt">$11,200</span>
              </div>
              <div class="comm-row">
                <span class="comm-type"><i class="fas fa-circle" style="color:#d97706"></i> Trails / Overrides</span>
                <div class="comm-bar-outer"><div class="comm-bar" style="width:6%;background:#d97706"></div></div>
                <span class="comm-amt">$2,300</span>
              </div>
            </div>
          </div>
          <div class="comm-stats-row">
            <div class="comm-stat">
              <div class="cs-num">$187,420</div>
              <div class="cs-lbl2">YTD Earned</div>
            </div>
            <div class="comm-stat">
              <div class="cs-num">$240,000</div>
              <div class="cs-lbl2">Annual Target</div>
            </div>
            <div class="comm-stat">
              <div class="cs-num green-text">78%</div>
              <div class="cs-lbl2">Target Progress</div>
            </div>
          </div>
          <div class="comm-pending">
            <i class="fas fa-clock"></i> <strong>$6,420 pending</strong> — 3 policies awaiting issuance
          </div>
        </div>

        {/* Lapse Risk Monitor */}
        <div class="dash-card lapse-card">
          <div class="card-header">
            <h3><i class="fas fa-exclamation-triangle"></i> Lapse Risk Monitor</h3>
            <button class="btn-link" onclick="navigateTo('ai-agents')">AI Analysis →</button>
          </div>
          <div class="lapse-summary-bar">
            <div class="lapse-seg high-risk">
              <span class="lapse-count">4</span>
              <span class="lapse-lbl">High Risk</span>
            </div>
            <div class="lapse-seg med-risk">
              <span class="lapse-count">11</span>
              <span class="lapse-lbl">Medium Risk</span>
            </div>
            <div class="lapse-seg low-risk">
              <span class="lapse-count">232</span>
              <span class="lapse-lbl">Low Risk</span>
            </div>
          </div>
          <div class="lapse-list">
            <div class="lapse-item high-lapse">
              <div class="lapse-avatar">SW</div>
              <div class="lapse-info">
                <div class="lapse-name">Sandra Williams</div>
                <div class="lapse-detail">Missed 2 payments · Policy P-100320</div>
              </div>
              <div class="lapse-risk-pill high-pill">High</div>
            </div>
            <div class="lapse-item high-lapse">
              <div class="lapse-avatar">KP</div>
              <div class="lapse-info">
                <div class="lapse-name">Kevin Park</div>
                <div class="lapse-detail">No response in 14 days · Pending app</div>
              </div>
              <div class="lapse-risk-pill high-pill">High</div>
            </div>
            <div class="lapse-item med-lapse">
              <div class="lapse-avatar">DT</div>
              <div class="lapse-info">
                <div class="lapse-name">David Thompson</div>
                <div class="lapse-detail">Grace period expires in 12 days</div>
              </div>
              <div class="lapse-risk-pill med-pill">Medium</div>
            </div>
            <div class="lapse-item med-lapse">
              <div class="lapse-avatar">PN</div>
              <div class="lapse-info">
                <div class="lapse-name">Patricia Nguyen</div>
                <div class="lapse-detail">EFT declined last cycle · Follow up</div>
              </div>
              <div class="lapse-risk-pill med-pill">Medium</div>
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Top Clients + Upcoming Appointments + Policy Mix */}
      <div class="dash-row-bottom">

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
                  <td>5</td><td class="premium">$32,000</td>
                  <td><div class="score-bar"><div class="score-fill" style="width:98%"></div><span>98</span></div></td>
                  <td><span class="status-badge active">Active</span></td>
                </tr>
                <tr>
                  <td><div class="client-cell"><div class="mini-avatar rc">RC</div><span>Robert Chen</span></div></td>
                  <td>4</td><td class="premium">$21,000</td>
                  <td><div class="score-bar"><div class="score-fill" style="width:96%"></div><span>96</span></div></td>
                  <td><span class="status-badge active">Active</span></td>
                </tr>
                <tr>
                  <td><div class="client-cell"><div class="mini-avatar mg">MG</div><span>Maria Gonzalez</span></div></td>
                  <td>3</td><td class="premium">$14,600</td>
                  <td><div class="score-bar"><div class="score-fill" style="width:91%"></div><span>91</span></div></td>
                  <td><span class="status-badge active">Active</span></td>
                </tr>
                <tr>
                  <td><div class="client-cell"><div class="mini-avatar jw">JW</div><span>James Whitfield</span></div></td>
                  <td>3</td><td class="premium">$12,400</td>
                  <td><div class="score-bar"><div class="score-fill" style="width:92%"></div><span>92</span></div></td>
                  <td><span class="status-badge active">Active</span></td>
                </tr>
                <tr>
                  <td><div class="client-cell"><div class="mini-avatar sw">SW</div><span>Sandra Williams</span></div></td>
                  <td>2</td><td class="premium">$8,200</td>
                  <td><div class="score-bar"><div class="score-fill" style="width:71%"></div><span>71</span></div></td>
                  <td><span class="status-badge review">Review</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div class="dash-card appt-card">
          <div class="card-header">
            <h3><i class="fas fa-calendar-check"></i> Today &amp; Upcoming</h3>
            <button class="btn-link" onclick="navigateTo('calendar')">Full Calendar →</button>
          </div>
          <div class="appt-date-header">Today — April 10, 2026</div>
          <div class="appt-list">
            <div class="appt-item appt-now">
              <div class="appt-time">
                <span class="appt-hr">10:30</span>
                <span class="appt-ampm">AM</span>
              </div>
              <div class="appt-bar appt-bar-red"></div>
              <div class="appt-detail">
                <div class="appt-title">Kevin Park — Urgent Follow-up Call</div>
                <div class="appt-sub"><i class="fas fa-phone"></i> Phone · 30 min</div>
              </div>
              <span class="appt-now-chip">Now</span>
            </div>
            <div class="appt-item">
              <div class="appt-time">
                <span class="appt-hr">2:00</span>
                <span class="appt-ampm">PM</span>
              </div>
              <div class="appt-bar appt-bar-blue"></div>
              <div class="appt-detail">
                <div class="appt-title">Robert Chen — Claim Status Update</div>
                <div class="appt-sub"><i class="fas fa-video"></i> Video Call · 45 min</div>
              </div>
            </div>
            <div class="appt-item">
              <div class="appt-time">
                <span class="appt-hr">4:30</span>
                <span class="appt-ampm">PM</span>
              </div>
              <div class="appt-bar appt-bar-gold"></div>
              <div class="appt-detail">
                <div class="appt-title">New Prospect — Alex Rivera Intro</div>
                <div class="appt-sub"><i class="fas fa-map-marker-alt"></i> In Person · 60 min</div>
              </div>
            </div>
          </div>
          <div class="appt-date-header" style="margin-top:10px">Upcoming</div>
          <div class="appt-list">
            <div class="appt-item">
              <div class="appt-time">
                <span class="appt-hr">Apr</span>
                <span class="appt-ampm">15</span>
              </div>
              <div class="appt-bar appt-bar-purple"></div>
              <div class="appt-detail">
                <div class="appt-title">Linda Morrison — Annual Policy Review</div>
                <div class="appt-sub"><i class="fas fa-building"></i> Office · 90 min</div>
              </div>
            </div>
            <div class="appt-item">
              <div class="appt-time">
                <span class="appt-hr">Apr</span>
                <span class="appt-ampm">17</span>
              </div>
              <div class="appt-bar appt-bar-green"></div>
              <div class="appt-detail">
                <div class="appt-title">New Client Intro — Nancy Foster</div>
                <div class="appt-sub"><i class="fas fa-phone"></i> Phone · 30 min</div>
              </div>
            </div>
            <div class="appt-item">
              <div class="appt-time">
                <span class="appt-hr">Apr</span>
                <span class="appt-ampm">22</span>
              </div>
              <div class="appt-bar appt-bar-blue"></div>
              <div class="appt-detail">
                <div class="appt-title">Team Review — Roger Putnam</div>
                <div class="appt-sub"><i class="fas fa-users"></i> Group · Q1 Results</div>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Mix donut */}
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
          {/* Recent Comms */}
          <div class="card-header" style="margin-top:16px;padding-top:14px;border-top:1px solid var(--gray-100)">
            <h3><i class="fas fa-comments"></i> Recent Communications</h3>
          </div>
          <div class="recent-comms">
            <div class="comm-item">
              <div class="comm-avatar ca-rc">RC</div>
              <div class="comm-info">
                <div class="comm-name">Robert Chen</div>
                <div class="comm-msg">Re: Claim P-100310 — documents received</div>
              </div>
              <div class="comm-meta"><i class="fas fa-envelope"></i> 2h ago</div>
            </div>
            <div class="comm-item">
              <div class="comm-avatar ca-lm">LM</div>
              <div class="comm-info">
                <div class="comm-name">Linda Morrison</div>
                <div class="comm-msg">Confirmed Apr 15 annual review meeting</div>
              </div>
              <div class="comm-meta"><i class="fas fa-comment"></i> 5h ago</div>
            </div>
            <div class="comm-item">
              <div class="comm-avatar ca-mg">MG</div>
              <div class="comm-info">
                <div class="comm-name">Maria Gonzalez</div>
                <div class="comm-msg">Interested in estate planning discussion</div>
              </div>
              <div class="comm-meta"><i class="fas fa-phone"></i> Yesterday</div>
            </div>
          </div>
        </div>

      </div>

      {/* AI Highlights Banner */}
      <div class="ai-highlight-banner" onclick="navigateTo('ai-agents')">
        <div class="ai-banner-icon"><i class="fas fa-robot"></i></div>
        <div class="ai-banner-content">
          <h4>AI Agent has 4 new insights for you</h4>
          <p>Potential revenue opportunity of $31,200 identified · 3 clients flagged for cross-sell · 1 estate planning alert · 4 lapse risks detected</p>
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

      {/* Page Header */}
      <div class="products-page-header">
        <div class="products-header-text">
          <h2><i class="fas fa-box-open"></i> New York Life Product Portfolio</h2>
          <p>Comprehensive suite of insurance, investment, retirement and advisory solutions — curated for every client life stage</p>
        </div>
        <button class="btn btn-ai" onclick="navigateTo('sales')">
          <i class="fas fa-calculator"></i> Quick Quote
        </button>
      </div>

      {/* Main Category Tabs (left nav + right content — NYL-style) */}
      <div class="products-layout">

        {/* Left Tab Nav */}
        <div class="products-tab-nav">
          <div class="tab-nav-item active" id="ptab-insurance" onclick="switchProductTab('insurance')">
            <i class="fas fa-shield-alt"></i>
            <span>Insurance</span>
            <i class="fas fa-chevron-right tab-arrow"></i>
          </div>
          <div class="tab-nav-item" id="ptab-investments" onclick="switchProductTab('investments')">
            <i class="fas fa-chart-line"></i>
            <span>Investments</span>
            <i class="fas fa-chevron-right tab-arrow"></i>
          </div>
          <div class="tab-nav-item" id="ptab-retirement" onclick="switchProductTab('retirement')">
            <i class="fas fa-umbrella-beach"></i>
            <span>Retirement</span>
            <i class="fas fa-chevron-right tab-arrow"></i>
          </div>
          <div class="tab-nav-item" id="ptab-advisory" onclick="switchProductTab('advisory')">
            <i class="fas fa-handshake"></i>
            <span>Advisory Services</span>
            <i class="fas fa-chevron-right tab-arrow"></i>
          </div>

          {/* Info Panel beneath tabs */}
          <div class="tab-nav-info">
            <div class="tab-info-title">Learn about your life insurance options</div>
            <div class="tab-info-desc">We can help you create a temporary, long-term, or permanent life insurance solution that meets your needs and your budget</div>
            <button class="tab-info-link" onclick="navigateTo('sales')">Life insurance <i class="fas fa-arrow-right"></i></button>
          </div>
        </div>

        {/* Right Content Panels */}
        <div class="products-tab-content">

          {/* ========== INSURANCE ========== */}
          <div class="ptab-panel active" id="panel-insurance">
            <div class="ptab-panel-header">
              <h3><i class="fas fa-shield-alt"></i> Insurance</h3>
              <p>Protect your clients and their families with NYL's full suite of life and disability insurance products</p>
            </div>

            <div class="product-subsections">

              {/* Term Life */}
              <div class="prod-subsection">
                <div class="prod-sub-header">
                  <div class="prod-sub-icon blue"><i class="fas fa-hourglass-half"></i></div>
                  <div>
                    <h4>Term life insurance</h4>
                    <p>Temporary protection, at a lower cost than other options, that can be converted to permanent</p>
                  </div>
                </div>
                <div class="prod-sub-details">
                  <div class="prod-detail-grid">
                    <div class="prod-detail-card">
                      <div class="pdc-label">Coverage Duration</div>
                      <div class="pdc-val">10, 15, 20, or 30 years</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Face Amount</div>
                      <div class="pdc-val">$100K – $10M+</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Convertibility</div>
                      <div class="pdc-val">Convertible to Whole Life</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Avg Monthly Premium</div>
                      <div class="pdc-val green-text">$25 – $80/mo</div>
                    </div>
                  </div>
                  <ul class="prod-feature-list">
                    <li><i class="fas fa-check"></i> Level premiums locked in for term duration</li>
                    <li><i class="fas fa-check"></i> Renewable at end of term period</li>
                    <li><i class="fas fa-check"></i> Conversion privilege — no medical exam required</li>
                    <li><i class="fas fa-check"></i> Optional riders: waiver of premium, accidental death</li>
                  </ul>
                  <div class="prod-ai-tip"><i class="fas fa-robot"></i> <strong>AI Insight:</strong> 3 clients aged 28–40 in your book have no term coverage — potential new business opportunity.</div>
                  <div class="prod-sub-actions">
                    <button class="btn btn-outline-sm">Product Details</button>
                    <button class="btn btn-primary-sm" onclick="navigateTo('sales')"><i class="fas fa-calculator"></i> Quote Now</button>
                  </div>
                </div>
              </div>

              {/* Whole Life */}
              <div class="prod-subsection">
                <div class="prod-sub-header">
                  <div class="prod-sub-icon green"><i class="fas fa-infinity"></i></div>
                  <div>
                    <h4>Whole life insurance</h4>
                    <p>Permanent policies with a guaranteed death benefit and guaranteed cash value that grows over time</p>
                  </div>
                </div>
                <div class="prod-sub-details">
                  <div class="prod-detail-grid">
                    <div class="prod-detail-card">
                      <div class="pdc-label">Coverage Duration</div>
                      <div class="pdc-val">Lifetime (permanent)</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Cash Value</div>
                      <div class="pdc-val">Guaranteed growth</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Dividends</div>
                      <div class="pdc-val">Eligible (not guaranteed)</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Policy Loans</div>
                      <div class="pdc-val green-text">Available anytime</div>
                    </div>
                  </div>
                  <ul class="prod-feature-list">
                    <li><i class="fas fa-check"></i> Guaranteed death benefit — never decreases</li>
                    <li><i class="fas fa-check"></i> Cash value grows at guaranteed rate tax-deferred</li>
                    <li><i class="fas fa-check"></i> Eligible for annual dividends (NYL paid for 170+ years)</li>
                    <li><i class="fas fa-check"></i> Can borrow against cash value — no credit check</li>
                    <li><i class="fas fa-check"></i> Paid-up additions rider to accelerate growth</li>
                  </ul>
                  <div class="prod-ai-tip"><i class="fas fa-robot"></i> <strong>AI Insight:</strong> Linda Morrison's Whole Life policy (P-100330) is eligible for a paid-up additions rider — could add $18K in cash value over 10 years.</div>
                  <div class="prod-sub-actions">
                    <button class="btn btn-outline-sm">Product Details</button>
                    <button class="btn btn-primary-sm" onclick="navigateTo('sales')"><i class="fas fa-calculator"></i> Quote Now</button>
                  </div>
                </div>
              </div>

              {/* Universal Life */}
              <div class="prod-subsection">
                <div class="prod-sub-header">
                  <div class="prod-sub-icon purple"><i class="fas fa-sliders-h"></i></div>
                  <div>
                    <h4>Universal life insurance</h4>
                    <p>Long-term coverage that's highly customizable to your needs and budget</p>
                  </div>
                </div>
                <div class="prod-sub-details">
                  <div class="prod-detail-grid">
                    <div class="prod-detail-card">
                      <div class="pdc-label">Premium Flexibility</div>
                      <div class="pdc-val">Adjustable</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Death Benefit</div>
                      <div class="pdc-val">Adjustable</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Interest Crediting</div>
                      <div class="pdc-val">Current rate + minimum</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Best Fit Age</div>
                      <div class="pdc-val green-text">35 – 60 yrs</div>
                    </div>
                  </div>
                  <ul class="prod-feature-list">
                    <li><i class="fas fa-check"></i> Flexible premium payments — pay more or less as cash flow changes</li>
                    <li><i class="fas fa-check"></i> Adjustable death benefit — increase or decrease coverage</li>
                    <li><i class="fas fa-check"></i> Cash value earns interest at current declared rate</li>
                    <li><i class="fas fa-check"></i> Guaranteed minimum interest rate floor</li>
                  </ul>
                  <div class="prod-ai-tip"><i class="fas fa-robot"></i> <strong>AI Insight:</strong> Patricia Nguyen's UL policy (P-100301) has been underfunded for 2 quarters — consider a premium catch-up review.</div>
                  <div class="prod-sub-actions">
                    <button class="btn btn-outline-sm">Product Details</button>
                    <button class="btn btn-primary-sm" onclick="navigateTo('sales')"><i class="fas fa-calculator"></i> Quote Now</button>
                  </div>
                </div>
              </div>

              {/* Variable Universal Life */}
              <div class="prod-subsection">
                <div class="prod-sub-header">
                  <div class="prod-sub-icon gold"><i class="fas fa-chart-line"></i></div>
                  <div>
                    <h4>Variable universal life insurance</h4>
                    <p>Long-term coverage protection with the ability to invest your policy's cash value in the market</p>
                  </div>
                </div>
                <div class="prod-sub-details">
                  <div class="prod-detail-grid">
                    <div class="prod-detail-card">
                      <div class="pdc-label">Investment Options</div>
                      <div class="pdc-val">30+ sub-accounts</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Market Risk</div>
                      <div class="pdc-val orange-text">Client bears risk</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Upside Potential</div>
                      <div class="pdc-val">Unlimited</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Min Death Benefit</div>
                      <div class="pdc-val green-text">Guaranteed</div>
                    </div>
                  </div>
                  <ul class="prod-feature-list">
                    <li><i class="fas fa-check"></i> Invest cash value in stocks, bonds, and money market sub-accounts</li>
                    <li><i class="fas fa-check"></i> Flexible premiums and adjustable death benefit</li>
                    <li><i class="fas fa-check"></i> Tax-deferred investment growth</li>
                    <li><i class="fas fa-check"></i> Minimum guaranteed death benefit floor</li>
                    <li><i class="fas fa-check"></i> Access to cash value via loans and withdrawals</li>
                  </ul>
                  <div class="prod-ai-tip"><i class="fas fa-robot"></i> <strong>AI Insight:</strong> Robert Chen (business owner, age 45) is a strong VUL candidate — risk-tolerant profile with $21K annual premium capacity.</div>
                  <div class="prod-sub-actions">
                    <button class="btn btn-outline-sm">Product Details</button>
                    <button class="btn btn-primary-sm" onclick="navigateTo('sales')"><i class="fas fa-calculator"></i> Quote Now</button>
                  </div>
                </div>
              </div>

              {/* Long-Term Care */}
              <div class="prod-subsection">
                <div class="prod-sub-header">
                  <div class="prod-sub-icon red"><i class="fas fa-heartbeat"></i></div>
                  <div>
                    <h4>Long-term care insurance</h4>
                    <p>Helps to pay for someone to help you with everyday tasks, if you ever need it</p>
                  </div>
                </div>
                <div class="prod-sub-details">
                  <div class="prod-detail-grid">
                    <div class="prod-detail-card">
                      <div class="pdc-label">Daily Benefit</div>
                      <div class="pdc-val">$100 – $400/day</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Benefit Period</div>
                      <div class="pdc-val">2 – 5 years (or lifetime)</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Elimination Period</div>
                      <div class="pdc-val">30, 60, or 90 days</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Best Fit Age</div>
                      <div class="pdc-val green-text">50 – 65 yrs</div>
                    </div>
                  </div>
                  <ul class="prod-feature-list">
                    <li><i class="fas fa-check"></i> Covers nursing home, assisted living, and home care</li>
                    <li><i class="fas fa-check"></i> Inflation protection rider available (3% or 5% compound)</li>
                    <li><i class="fas fa-check"></i> Shared care benefit for spouses / partners</li>
                    <li><i class="fas fa-check"></i> Return of premium option if never used</li>
                  </ul>
                  <div class="prod-ai-tip"><i class="fas fa-robot"></i> <strong>AI Insight:</strong> 4 clients aged 55+ in your book have no LTC coverage — combined gap premium potential of ~$12,000/year.</div>
                  <div class="prod-sub-actions">
                    <button class="btn btn-outline-sm">Product Details</button>
                    <button class="btn btn-primary-sm" onclick="navigateTo('sales')"><i class="fas fa-calculator"></i> Quote Now</button>
                  </div>
                </div>
              </div>

              {/* Individual Disability */}
              <div class="prod-subsection">
                <div class="prod-sub-header">
                  <div class="prod-sub-icon orange"><i class="fas fa-user-shield"></i></div>
                  <div>
                    <h4>Individual disability insurance</h4>
                    <p>Helps to replace lost income if sickness or injury prevent you from working</p>
                  </div>
                </div>
                <div class="prod-sub-details">
                  <div class="prod-detail-grid">
                    <div class="prod-detail-card">
                      <div class="pdc-label">Income Replacement</div>
                      <div class="pdc-val">Up to 60–70% of income</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Benefit Period</div>
                      <div class="pdc-val">2 yr, 5 yr, to age 65</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Definition</div>
                      <div class="pdc-val">Own-occupation</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Non-cancelable</div>
                      <div class="pdc-val green-text">Available</div>
                    </div>
                  </div>
                  <ul class="prod-feature-list">
                    <li><i class="fas fa-check"></i> Own-occupation definition — most favorable for professionals</li>
                    <li><i class="fas fa-check"></i> Non-cancelable and guaranteed renewable options</li>
                    <li><i class="fas fa-check"></i> Partial/residual disability benefit included</li>
                    <li><i class="fas fa-check"></i> Future purchase option rider — increase coverage without underwriting</li>
                  </ul>
                  <div class="prod-ai-tip"><i class="fas fa-robot"></i> <strong>AI Insight:</strong> David Thompson (age 33) and Patricia Nguyen (age 38) have no disability coverage — high-priority gap opportunity.</div>
                  <div class="prod-sub-actions">
                    <button class="btn btn-outline-sm">Product Details</button>
                    <button class="btn btn-primary-sm" onclick="navigateTo('sales')"><i class="fas fa-calculator"></i> Quote Now</button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ========== INVESTMENTS ========== */}
          <div class="ptab-panel" id="panel-investments">
            <div class="ptab-panel-header">
              <h3><i class="fas fa-chart-line"></i> Investments</h3>
              <p>Grow your clients' wealth with professionally managed investment solutions tailored to their goals and risk tolerance</p>
            </div>

            <div class="product-subsections">

              {/* Annuities */}
              <div class="prod-subsection">
                <div class="prod-sub-header">
                  <div class="prod-sub-icon blue"><i class="fas fa-lock"></i></div>
                  <div>
                    <h4>Annuities</h4>
                    <p>Stable, long-term options that eventually provide an income stream</p>
                  </div>
                </div>
                <div class="prod-sub-details">
                  <div class="prod-detail-grid">
                    <div class="prod-detail-card">
                      <div class="pdc-label">Types Available</div>
                      <div class="pdc-val">Fixed & Variable</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Payment Mode</div>
                      <div class="pdc-val">Single premium</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Death Benefit</div>
                      <div class="pdc-val green-text">Included</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Principal Guarantee</div>
                      <div class="pdc-val green-text">Fixed type only</div>
                    </div>
                  </div>
                  <ul class="prod-feature-list">
                    <li><i class="fas fa-check"></i> Guaranteed income stream for life (immediate or deferred)</li>
                    <li><i class="fas fa-check"></i> Tax-deferred accumulation during growth phase</li>
                    <li><i class="fas fa-check"></i> Variable annuities offer sub-account investment options</li>
                    <li><i class="fas fa-check"></i> Death benefit passes to beneficiary outside of probate</li>
                    <li><i class="fas fa-check"></i> Optional riders: enhanced death benefit, GLWB, GMIB</li>
                  </ul>
                  <div class="prod-comparison-mini">
                    <div class="pcm-row header"><span>Feature</span><span>Fixed Annuity</span><span>Variable Annuity</span></div>
                    <div class="pcm-row"><span>Market Risk</span><span class="check-sm"><i class="fas fa-times text-red"></i> None</span><span class="check-sm orange-text">Client bears</span></div>
                    <div class="pcm-row"><span>Principal Guarantee</span><span class="check-sm"><i class="fas fa-check text-green"></i></span><span class="check-sm"><i class="fas fa-times text-red"></i></span></div>
                    <div class="pcm-row"><span>Income Conversion</span><span class="check-sm"><i class="fas fa-check text-green"></i></span><span class="check-sm"><i class="fas fa-check text-green"></i></span></div>
                    <div class="pcm-row"><span>Investment Options</span><span class="check-sm"><i class="fas fa-times text-red"></i></span><span class="check-sm"><i class="fas fa-check text-green"></i></span></div>
                  </div>
                  <div class="prod-ai-tip"><i class="fas fa-robot"></i> <strong>AI Insight:</strong> James Whitfield (age 52) approaching retirement — deferred annuity conversion could provide ~$180K in guaranteed income at 65.</div>
                  <div class="prod-sub-actions">
                    <button class="btn btn-outline-sm">Product Details</button>
                    <button class="btn btn-primary-sm" onclick="navigateTo('sales')"><i class="fas fa-calculator"></i> Illustrate</button>
                  </div>
                </div>
              </div>

              {/* Mutual Funds */}
              <div class="prod-subsection">
                <div class="prod-sub-header">
                  <div class="prod-sub-icon green"><i class="fas fa-coins"></i></div>
                  <div>
                    <h4>Mutual funds</h4>
                    <p>Professionally managed investments with potential market gains</p>
                  </div>
                </div>
                <div class="prod-sub-details">
                  <div class="prod-detail-grid">
                    <div class="prod-detail-card">
                      <div class="pdc-label">Fund Families</div>
                      <div class="pdc-val">MainStay Funds + 3rd Party</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Minimum Investment</div>
                      <div class="pdc-val">$500 (IRA) / $1,000</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Liquidity</div>
                      <div class="pdc-val green-text">Daily (T+1)</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Management</div>
                      <div class="pdc-val">Active / Passive</div>
                    </div>
                  </div>
                  <ul class="prod-feature-list">
                    <li><i class="fas fa-check"></i> Access to MainStay Funds — NYL's proprietary fund family</li>
                    <li><i class="fas fa-check"></i> Diversified across equity, fixed income, and blended strategies</li>
                    <li><i class="fas fa-check"></i> Automatic rebalancing available</li>
                    <li><i class="fas fa-check"></i> Systematic investment plan — dollar-cost averaging</li>
                    <li><i class="fas fa-check"></i> Available in IRA, Roth IRA, and taxable accounts</li>
                  </ul>
                  <div class="prod-ai-tip"><i class="fas fa-robot"></i> <strong>AI Insight:</strong> Maria Gonzalez (age 48) has investable assets — mutual fund program may be a natural transition before recommending an SMA.</div>
                  <div class="prod-sub-actions">
                    <button class="btn btn-outline-sm">Fund Lineup</button>
                    <button class="btn btn-primary-sm" onclick="navigateTo('sales')"><i class="fas fa-calculator"></i> Explore</button>
                  </div>
                </div>
              </div>

              {/* ETFs */}
              <div class="prod-subsection">
                <div class="prod-sub-header">
                  <div class="prod-sub-icon purple"><i class="fas fa-exchange-alt"></i></div>
                  <div>
                    <h4>Exchange traded funds (ETFs)</h4>
                    <p>Bundled investments with low fees that you can quickly buy or sell</p>
                  </div>
                </div>
                <div class="prod-sub-details">
                  <div class="prod-detail-grid">
                    <div class="prod-detail-card">
                      <div class="pdc-label">Fee Structure</div>
                      <div class="pdc-val">0.03% – 0.25% avg</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Trading</div>
                      <div class="pdc-val">Intraday (like stocks)</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Tax Efficiency</div>
                      <div class="pdc-val green-text">High</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Min Investment</div>
                      <div class="pdc-val">1 share</div>
                    </div>
                  </div>
                  <ul class="prod-feature-list">
                    <li><i class="fas fa-check"></i> Ultra-low expense ratios vs. active mutual funds</li>
                    <li><i class="fas fa-check"></i> Broad market exposure — S&P 500, total market, sector ETFs</li>
                    <li><i class="fas fa-check"></i> High tax efficiency due to in-kind creation/redemption</li>
                    <li><i class="fas fa-check"></i> Transparent holdings — published daily</li>
                    <li><i class="fas fa-check"></i> Excellent for low-cost core portfolio building</li>
                  </ul>
                  <div class="prod-ai-tip"><i class="fas fa-robot"></i> <strong>AI Insight:</strong> Younger clients (David Thompson, Kevin Park) are ideal ETF candidates — low-cost entry point to build long-term wealth habits.</div>
                  <div class="prod-sub-actions">
                    <button class="btn btn-outline-sm">ETF Catalog</button>
                    <button class="btn btn-primary-sm" onclick="navigateTo('sales')"><i class="fas fa-calculator"></i> Explore</button>
                  </div>
                </div>
              </div>

              {/* 529 Plans */}
              <div class="prod-subsection">
                <div class="prod-sub-header">
                  <div class="prod-sub-icon gold"><i class="fas fa-graduation-cap"></i></div>
                  <div>
                    <h4>529 college savings plans</h4>
                    <p>Investments designed to help you pay for college or other education expenses</p>
                  </div>
                </div>
                <div class="prod-sub-details">
                  <div class="prod-detail-grid">
                    <div class="prod-detail-card">
                      <div class="pdc-label">Tax Treatment</div>
                      <div class="pdc-val">Tax-free growth + withdrawal</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Annual Gift Exclusion</div>
                      <div class="pdc-val">$18,000 / $90K (5-yr)</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Contribution Limit</div>
                      <div class="pdc-val">$400K+ (varies by state)</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Qualified Uses</div>
                      <div class="pdc-val green-text">College + K-12 + Trade</div>
                    </div>
                  </div>
                  <ul class="prod-feature-list">
                    <li><i class="fas fa-check"></i> Earnings grow federal tax-free when used for qualified education</li>
                    <li><i class="fas fa-check"></i> State income tax deduction available in most states</li>
                    <li><i class="fas fa-check"></i> Superfunding: contribute 5 years of gifts upfront ($90,000)</li>
                    <li><i class="fas fa-check"></i> Can be transferred to another family member</li>
                    <li><i class="fas fa-check"></i> SECURE 2.0: unused funds can roll to Roth IRA (up to $35K)</li>
                  </ul>
                  <div class="prod-ai-tip"><i class="fas fa-robot"></i> <strong>AI Insight:</strong> 8 clients in your book have children under 10 — 529 plan conversations could add $4,800+ in annual premium.</div>
                  <div class="prod-sub-actions">
                    <button class="btn btn-outline-sm">529 Calculator</button>
                    <button class="btn btn-primary-sm" onclick="navigateTo('sales')"><i class="fas fa-calculator"></i> Illustrate</button>
                  </div>
                </div>
              </div>

            </div>

            {/* Investment Comparison Table */}
            <div class="comparison-section" style="margin-top:24px">
              <h4 class="comparison-title"><i class="fas fa-table"></i> Compare Investment Options</h4>
              <div class="table-wrapper">
                <table class="comparison-table">
                  <thead>
                    <tr>
                      <th>Product</th><th>Payments</th><th>Death Benefit</th><th>Income Stream</th>
                      <th>Market Investment</th><th>Principal Guarantee</th><th>Fees</th><th>Liquidity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td class="product-name-cell">Fixed Annuities</td><td>Single premium</td><td class="check"><i class="fas fa-check-circle"></i></td><td></td><td></td><td class="check"><i class="fas fa-check-circle"></i></td><td></td><td></td></tr>
                    <tr><td class="product-name-cell">Variable Annuities</td><td>Single premium</td><td class="check"><i class="fas fa-check-circle"></i></td><td class="check"><i class="fas fa-check-circle"></i></td><td class="check"><i class="fas fa-check-circle"></i></td><td></td><td class="check"><i class="fas fa-check-circle"></i></td><td></td></tr>
                    <tr><td class="product-name-cell">Mutual Funds</td><td>You choose</td><td></td><td></td><td class="check"><i class="fas fa-check-circle"></i></td><td></td><td class="check"><i class="fas fa-check-circle"></i></td><td class="check"><i class="fas fa-check-circle"></i></td></tr>
                    <tr><td class="product-name-cell">ETFs</td><td>You choose</td><td></td><td></td><td class="check"><i class="fas fa-check-circle"></i></td><td></td><td class="check"><i class="fas fa-check-circle"></i></td><td class="check"><i class="fas fa-check-circle"></i></td></tr>
                    <tr><td class="product-name-cell">529 Plans</td><td>You choose</td><td></td><td></td><td class="check"><i class="fas fa-check-circle"></i></td><td></td><td class="check"><i class="fas fa-check-circle"></i></td><td></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ========== RETIREMENT ========== */}
          <div class="ptab-panel" id="panel-retirement">
            <div class="ptab-panel-header">
              <h3><i class="fas fa-umbrella-beach"></i> Retirement</h3>
              <p>Help your clients build a secure retirement income strategy with guaranteed income solutions that last a lifetime</p>
            </div>

            <div class="product-subsections">

              {/* Immediate Income Annuities */}
              <div class="prod-subsection">
                <div class="prod-sub-header">
                  <div class="prod-sub-icon blue"><i class="fas fa-play-circle"></i></div>
                  <div>
                    <h4>Immediate income annuities</h4>
                    <p>Start to receive income now, for as long as you need it, with potential for additional earnings</p>
                  </div>
                </div>
                <div class="prod-sub-details">
                  <div class="prod-detail-grid">
                    <div class="prod-detail-card">
                      <div class="pdc-label">Income Start</div>
                      <div class="pdc-val">Within 1–12 months</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Income Duration</div>
                      <div class="pdc-val">Life / Joint Life / Period</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Payment Options</div>
                      <div class="pdc-val">Monthly / Quarterly / Annual</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Best Fit Age</div>
                      <div class="pdc-val green-text">65 – 80 yrs</div>
                    </div>
                  </div>
                  <ul class="prod-feature-list">
                    <li><i class="fas fa-check"></i> Guaranteed income payments that cannot be outlived</li>
                    <li><i class="fas fa-check"></i> Joint-life option covers both spouses for life</li>
                    <li><i class="fas fa-check"></i> Period certain option — minimum payment guarantee (e.g., 10 yrs)</li>
                    <li><i class="fas fa-check"></i> Potential dividend participation for income increases</li>
                    <li><i class="fas fa-check"></i> Backed by NYL's 178+ years of financial strength</li>
                  </ul>
                  <div class="prod-retire-highlight">
                    <div class="rh-item">
                      <i class="fas fa-shield-alt"></i>
                      <div><strong>Guaranteed Income</strong><p>Payments for as long as you live — regardless of market conditions</p></div>
                    </div>
                    <div class="rh-item">
                      <i class="fas fa-university"></i>
                      <div><strong>Financial Reliability</strong><p>Backed by NYL's 178-year legacy and highest financial strength ratings</p></div>
                    </div>
                    <div class="rh-item">
                      <i class="fas fa-hand-holding-usd"></i>
                      <div><strong>Stretch Your Savings</strong><p>Potential annual dividends can increase your income over time</p></div>
                    </div>
                  </div>
                  <div class="prod-ai-tip"><i class="fas fa-robot"></i> <strong>AI Insight:</strong> Linda Morrison (age 56) and James Whitfield (age 52) are ideal immediate annuity candidates in 8–12 years — begin the conversation now.</div>
                  <div class="prod-sub-actions">
                    <button class="btn btn-outline-sm">Income Illustration</button>
                    <button class="btn btn-primary-sm" onclick="navigateTo('sales')"><i class="fas fa-calculator"></i> Quote Now</button>
                  </div>
                </div>
              </div>

              {/* Deferred Income Annuities */}
              <div class="prod-subsection">
                <div class="prod-sub-header">
                  <div class="prod-sub-icon green"><i class="fas fa-hourglass-end"></i></div>
                  <div>
                    <h4>Deferred income annuities</h4>
                    <p>Receive income for life and larger payouts by delaying them for at least a few years</p>
                  </div>
                </div>
                <div class="prod-sub-details">
                  <div class="prod-detail-grid">
                    <div class="prod-detail-card">
                      <div class="pdc-label">Deferral Period</div>
                      <div class="pdc-val">2 – 40 years</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Income Boost</div>
                      <div class="pdc-val green-text">Higher payout at start</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Purchase Age</div>
                      <div class="pdc-val">40 – 70 yrs</div>
                    </div>
                    <div class="prod-detail-card">
                      <div class="pdc-label">Payments</div>
                      <div class="pdc-val">Single or periodic</div>
                    </div>
                  </div>
                  <ul class="prod-feature-list">
                    <li><i class="fas fa-check"></i> Lock in today's rates for future income — the longer you wait, the higher the payout</li>
                    <li><i class="fas fa-check"></i> Excellent hedge against longevity risk for clients in their 40s–50s</li>
                    <li><i class="fas fa-check"></i> Flexible start date — you choose when income begins</li>
                    <li><i class="fas fa-check"></i> Survivor benefit — return of premium to beneficiary if client dies early</li>
                    <li><i class="fas fa-check"></i> Can fund with rollovers from IRA, 401(k), or taxable savings</li>
                  </ul>
                  <div class="prod-retire-highlight">
                    <div class="rh-item">
                      <i class="fas fa-clock"></i>
                      <div><strong>Personal Flexibility</strong><p>You select when income starts — as short as 2 years or up to 40 years out</p></div>
                    </div>
                    <div class="rh-item">
                      <i class="fas fa-chart-bar"></i>
                      <div><strong>Larger Payouts</strong><p>Delaying income payments means significantly larger guaranteed income amounts</p></div>
                    </div>
                  </div>
                  <div class="prod-ai-tip"><i class="fas fa-robot"></i> <strong>AI Insight:</strong> Patricia Nguyen (age 38) could lock in a deferred annuity now at today's rates — projected income starting at age 65 of ~$2,800/month.</div>
                  <div class="prod-sub-actions">
                    <button class="btn btn-outline-sm">Deferral Calculator</button>
                    <button class="btn btn-primary-sm" onclick="navigateTo('sales')"><i class="fas fa-calculator"></i> Illustrate</button>
                  </div>
                </div>
              </div>

            </div>

            {/* Retirement Income Comparison */}
            <div class="comparison-section" style="margin-top:24px">
              <h4 class="comparison-title"><i class="fas fa-balance-scale"></i> Immediate vs. Deferred Income Annuities</h4>
              <div class="retire-compare-grid">
                <div class="rc-card blue-border">
                  <div class="rc-title"><i class="fas fa-play-circle"></i> Immediate Income Annuity</div>
                  <div class="rc-rows">
                    <div class="rc-row"><span>Income Starts</span><strong>Within 1–12 months</strong></div>
                    <div class="rc-row"><span>Best For</span><strong>Already retired or retiring soon</strong></div>
                    <div class="rc-row"><span>Payout Level</span><strong>Moderate</strong></div>
                    <div class="rc-row"><span>Flexibility</span><strong>Lower — locked in</strong></div>
                    <div class="rc-row"><span>Longevity Risk</span><strong class="green-text">Fully covered</strong></div>
                  </div>
                </div>
                <div class="rc-card green-border">
                  <div class="rc-title"><i class="fas fa-hourglass-end"></i> Deferred Income Annuity</div>
                  <div class="rc-rows">
                    <div class="rc-row"><span>Income Starts</span><strong>2 – 40 years from now</strong></div>
                    <div class="rc-row"><span>Best For</span><strong>Mid-career planners (40s–50s)</strong></div>
                    <div class="rc-row"><span>Payout Level</span><strong class="green-text">Higher — worth the wait</strong></div>
                    <div class="rc-row"><span>Flexibility</span><strong>Higher — choose start date</strong></div>
                    <div class="rc-row"><span>Longevity Risk</span><strong class="green-text">Fully covered</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========== ADVISORY SERVICES ========== */}
          <div class="ptab-panel" id="panel-advisory">
            <div class="ptab-panel-header">
              <h3><i class="fas fa-handshake"></i> Advisory Services</h3>
              <p>Expert guidance across wealth management, estate planning, and small business solutions — for your most complex client needs</p>
            </div>

            <div class="product-subsections">

              {/* Wealth Management */}
              <div class="prod-subsection">
                <div class="prod-sub-header">
                  <div class="prod-sub-icon gold"><i class="fas fa-gem"></i></div>
                  <div>
                    <h4>Wealth management</h4>
                    <p>Expertise and guidance to create your investment strategy and help you plan for future financial needs</p>
                  </div>
                </div>
                <div class="prod-sub-details">
                  <div class="advisory-programs-grid">
                    <div class="adv-program-card">
                      <div class="adv-prog-icon"><i class="fas fa-tasks"></i></div>
                      <div class="adv-prog-name">Fund Advisory Program</div>
                      <div class="adv-prog-desc">Professionally managed model portfolios using mutual funds. Ongoing monitoring and automatic rebalancing.</div>
                      <div class="adv-prog-min">Min: $25,000</div>
                    </div>
                    <div class="adv-program-card">
                      <div class="adv-prog-icon"><i class="fas fa-layer-group"></i></div>
                      <div class="adv-prog-name">Separately Managed Account (SMA)</div>
                      <div class="adv-prog-desc">Direct ownership of individual securities managed by institutional money managers. Greater customization and tax efficiency.</div>
                      <div class="adv-prog-min">Min: $100,000</div>
                    </div>
                    <div class="adv-program-card">
                      <div class="adv-prog-icon"><i class="fas fa-user-tie"></i></div>
                      <div class="adv-prog-name">Rep-Directed Program</div>
                      <div class="adv-prog-desc">Your advisor builds and manages a customized portfolio based on your specific investment goals and preferences.</div>
                      <div class="adv-prog-min">Min: $50,000</div>
                    </div>
                    <div class="adv-program-card">
                      <div class="adv-prog-icon"><i class="fas fa-network-wired"></i></div>
                      <div class="adv-prog-name">Unified Managed Account (UMA)</div>
                      <div class="adv-prog-desc">Combines multiple investment strategies — mutual funds, ETFs, SMAs — in a single account for maximum diversification.</div>
                      <div class="adv-prog-min">Min: $250,000</div>
                    </div>
                  </div>
                  <div class="prod-ai-tip"><i class="fas fa-robot"></i> <strong>AI Insight:</strong> Linda Morrison and Robert Chen are strong UMA candidates with estimated investable assets of $500K+. Schedule wealth management conversations.</div>
                  <div class="prod-sub-actions">
                    <button class="btn btn-outline-sm">Program Comparison</button>
                    <button class="btn btn-primary-sm" onclick="navigateTo('ai-agents')"><i class="fas fa-robot"></i> AI Client Match</button>
                  </div>
                </div>
              </div>

              {/* Estate Planning */}
              <div class="prod-subsection">
                <div class="prod-sub-header">
                  <div class="prod-sub-icon purple"><i class="fas fa-landmark"></i></div>
                  <div>
                    <h4>Estate planning</h4>
                    <p>Guidance to help identify potential needs and set you up with an estate plan that can protect your legacy</p>
                  </div>
                </div>
                <div class="prod-sub-details">
                  <div class="estate-features-grid">
                    <div class="estate-feature-card">
                      <div class="ef-icon"><i class="fas fa-scroll"></i></div>
                      <div class="ef-name">Last Will &amp; Testament</div>
                      <div class="ef-desc">Directs distribution of assets, names guardians for minor children, and designates an executor</div>
                    </div>
                    <div class="estate-feature-card">
                      <div class="ef-icon"><i class="fas fa-gavel"></i></div>
                      <div class="ef-name">Power of Attorney</div>
                      <div class="ef-desc">Authorizes a trusted person to make financial and legal decisions if you become incapacitated</div>
                    </div>
                    <div class="estate-feature-card">
                      <div class="ef-icon"><i class="fas fa-balance-scale"></i></div>
                      <div class="ef-name">Trusts</div>
                      <div class="ef-desc">Revocable living trusts, irrevocable trusts, and special needs trusts to manage and protect assets</div>
                    </div>
                    <div class="estate-feature-card">
                      <div class="ef-icon"><i class="fas fa-gift"></i></div>
                      <div class="ef-name">Lifetime Gifts</div>
                      <div class="ef-desc">Strategic gifting strategies to transfer wealth during life and reduce future estate tax exposure</div>
                    </div>
                    <div class="estate-feature-card">
                      <div class="ef-icon"><i class="fas fa-percentage"></i></div>
                      <div class="ef-name">Tax Strategies</div>
                      <div class="ef-desc">Federal and state estate tax minimization, including ILIT, GRAT, and charitable giving strategies</div>
                    </div>
                    <div class="estate-feature-card">
                      <div class="ef-icon"><i class="fas fa-star-of-life"></i></div>
                      <div class="ef-name">Special Provisions</div>
                      <div class="ef-desc">Provisions for beneficiaries with special needs, spendthrift clauses, and pet trusts</div>
                    </div>
                  </div>
                  <div class="prod-ai-tip"><i class="fas fa-robot"></i> <strong>AI Insight:</strong> 4 clients qualify for estate planning reviews: Linda Morrison ($2M+ policy), James Whitfield (multiple assets), Robert Chen (business owner), Maria Gonzalez (interest flagged).</div>
                  <div class="prod-sub-actions">
                    <button class="btn btn-outline-sm">Estate Checklist</button>
                    <button class="btn btn-primary-sm" onclick="navigateTo('ai-agents')"><i class="fas fa-robot"></i> Estate AI Review</button>
                  </div>
                </div>
              </div>

              {/* Small Business */}
              <div class="prod-subsection">
                <div class="prod-sub-header">
                  <div class="prod-sub-icon orange"><i class="fas fa-building"></i></div>
                  <div>
                    <h4>Small business</h4>
                    <p>Insurance for employees, executives, or business owners, plus many other options to help a small business thrive</p>
                  </div>
                </div>
                <div class="prod-sub-details">
                  <div class="biz-solutions-grid">
                    <div class="biz-solution-card orange-border">
                      <div class="biz-sol-header"><i class="fas fa-user-tie"></i> Business Owners</div>
                      <ul>
                        <li>Buy-sell agreement funding</li>
                        <li>Key person life insurance</li>
                        <li>Business succession planning</li>
                        <li>Split-dollar arrangements</li>
                        <li>Deferred compensation plans</li>
                      </ul>
                    </div>
                    <div class="biz-solution-card blue-border">
                      <div class="biz-sol-header"><i class="fas fa-crown"></i> Executive Benefits</div>
                      <ul>
                        <li>Non-qualified deferred compensation (NQDC)</li>
                        <li>Supplemental executive retirement plans (SERP)</li>
                        <li>Executive bonus (Section 162) plans</li>
                        <li>Corporate-owned life insurance (COLI)</li>
                        <li>Supplemental disability insurance</li>
                      </ul>
                    </div>
                    <div class="biz-solution-card green-border">
                      <div class="biz-sol-header"><i class="fas fa-users"></i> Employee Benefits</div>
                      <ul>
                        <li>Group life and disability insurance</li>
                        <li>401(k) and retirement plan setup</li>
                        <li>Voluntary benefits programs</li>
                        <li>Pension and defined benefit plans</li>
                        <li>Employee education and wellness plans</li>
                      </ul>
                    </div>
                  </div>
                  <div class="prod-ai-tip"><i class="fas fa-robot"></i> <strong>AI Insight:</strong> Robert Chen (business owner) and James Whitfield have identified business planning needs — schedule a small business review to explore NQDC and key person coverage.</div>
                  <div class="prod-sub-actions">
                    <button class="btn btn-outline-sm">Business Solutions Guide</button>
                    <button class="btn btn-primary-sm" onclick="navigateTo('ai-agents')"><i class="fas fa-robot"></i> Business AI Audit</button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>{/* end products-tab-content */}
      </div>{/* end products-layout */}
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
          <div class="report-chart-wrap" style="position:relative;height:260px">
            <canvas id="reportRevenueChart"></canvas>
          </div>
        </div>

        <div class="report-card">
          <div class="card-header">
            <h3><i class="fas fa-chart-pie"></i> Product Distribution</h3>
          </div>
          <div class="report-chart-wrap" style="position:relative;height:200px">
            <canvas id="reportProductChart"></canvas>
          </div>
        </div>

        <div class="report-card">
          <div class="card-header">
            <h3><i class="fas fa-users"></i> Client Segments</h3>
          </div>
          <div class="report-chart-wrap" style="position:relative;height:200px">
            <canvas id="reportSegmentChart"></canvas>
          </div>
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
