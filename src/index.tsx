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

// Full product holdings per client across all 4 domains
const clientProducts: Record<number, {
  insurance: { id: string; product: string; type: string; premium: number; faceValue: string; status: string; since: string }[];
  investments: { id: string; product: string; type: string; value: string; return: string; status: string; since: string }[];
  retirement: { id: string; product: string; type: string; value: string; income: string; status: string; since: string }[];
  advisory: { id: string; product: string; type: string; value: string; fee: string; status: string; since: string }[];
}> = {
  1: { // James Whitfield
    insurance: [
      { id: 'P-100291', product: 'Whole Life Insurance', type: 'Permanent', premium: 4800, faceValue: '$500K', status: 'Active', since: '2019' },
      { id: 'P-100292', product: 'Term Life Insurance', type: '20-Year Term', premium: 3200, faceValue: '$750K', status: 'Active', since: '2021' },
      { id: 'P-100293', product: 'Long-term Care Insurance', type: 'LTC', premium: 4400, faceValue: '$250K', status: 'Active', since: '2022' },
    ],
    investments: [],
    retirement: [
      { id: 'R-200112', product: 'Deferred Annuity', type: 'Fixed Deferred', value: '$0 (illustrating)', income: '~$2,800/mo at 65', status: 'Prospect', since: '2026' },
    ],
    advisory: [
      { id: 'A-300091', product: 'Estate Planning', type: 'Will & Trust Review', value: 'In Progress', fee: 'Included', status: 'Active', since: '2025' },
    ],
  },
  2: { // Patricia Nguyen
    insurance: [
      { id: 'P-100301', product: 'Universal Life Insurance', type: 'Permanent', premium: 3000, faceValue: '$400K', status: 'Active', since: '2020' },
      { id: 'P-100302', product: 'Variable Universal Life', type: 'VUL', premium: 2800, faceValue: '$300K', status: 'Active', since: '2023' },
    ],
    investments: [],
    retirement: [],
    advisory: [],
  },
  3: { // Robert Chen
    insurance: [
      { id: 'P-100310', product: 'Whole Life Insurance', type: 'Permanent', premium: 6000, faceValue: '$1M', status: 'Active', since: '2018' },
      { id: 'P-100311', product: 'Variable Universal Life', type: 'VUL', premium: 8400, faceValue: '$800K', status: 'Active', since: '2020' },
    ],
    investments: [
      { id: 'I-400221', product: 'VUL Sub-accounts', type: 'Market-linked', value: '$180K AUM', return: '+11.2% YTD', status: 'Active', since: '2020' },
    ],
    retirement: [],
    advisory: [
      { id: 'A-300102', product: 'Business Services', type: 'Key-Person Life + Buy-Sell', value: '$500K coverage', fee: '$1,200/yr', status: 'Active', since: '2021' },
      { id: 'A-300103', product: 'Executive Benefits', type: 'NQDC Plan', value: '$150K deferred', fee: '$800/yr', status: 'Active', since: '2022' },
    ],
  },
  4: { // Sandra Williams
    insurance: [
      { id: 'P-100320', product: 'Term Life Insurance', type: '20-Year Term', premium: 2800, faceValue: '$350K', status: 'Review', since: '2016' },
      { id: 'P-100321', product: 'Long-term Care Insurance', type: 'LTC', premium: 5400, faceValue: '$180K', status: 'Active', since: '2020' },
    ],
    investments: [],
    retirement: [
      { id: 'R-200198', product: 'Immediate Income Annuity', type: 'Fixed Immediate', value: '$120K premium', income: '$680/mo lifetime', status: 'Prospect', since: '2026' },
    ],
    advisory: [],
  },
  5: { // David Thompson
    insurance: [
      { id: 'P-100330', product: 'Term Life Insurance', type: '20-Year Term', premium: 2400, faceValue: '$300K', status: 'Active', since: '2023' },
    ],
    investments: [],
    retirement: [],
    advisory: [],
  },
  6: { // Maria Gonzalez
    insurance: [
      { id: 'P-100340', product: 'Universal Life Insurance', type: 'Permanent', premium: 5600, faceValue: '$600K', status: 'Active', since: '2017' },
      { id: 'P-100341', product: 'Disability Insurance', type: 'Individual DI', premium: 3200, faceValue: '60% income', status: 'Active', since: '2021' },
    ],
    investments: [
      { id: 'I-400301', product: 'Fixed Annuity', type: 'Fixed Deferred', value: '$95K AUM', return: '+4.8% guaranteed', status: 'Active', since: '2019' },
    ],
    retirement: [
      { id: 'R-200211', product: 'Immediate Annuity', type: 'Fixed Immediate', value: '$95K', income: '$520/mo interest', status: 'Active', since: '2019' },
    ],
    advisory: [],
  },
  7: { // Kevin Park
    insurance: [
      { id: 'P-100350', product: 'Term Life Insurance', type: '20-Year Term', premium: 1800, faceValue: '$250K', status: 'Pending', since: '2026' },
    ],
    investments: [],
    retirement: [],
    advisory: [],
  },
  8: { // Linda Morrison
    insurance: [
      { id: 'P-100360', product: 'Whole Life Insurance', type: 'Permanent', premium: 12000, faceValue: '$2M', status: 'Active', since: '2015' },
      { id: 'P-100361', product: 'Long-term Care Insurance', type: 'LTC', premium: 7200, faceValue: '$300K', status: 'Active', since: '2019' },
      { id: 'P-100362', product: 'Variable Universal Life', type: 'VUL', premium: 9600, faceValue: '$1.5M', status: 'Active', since: '2021' },
    ],
    investments: [
      { id: 'I-400401', product: 'Mutual Funds', type: 'MainStay Balanced', value: '$180K AUM', return: '+9.4% YTD', status: 'Active', since: '2018' },
      { id: 'I-400402', product: 'ETF Portfolio', type: 'Core Equity ETFs', value: '$100K AUM', return: '+12.1% YTD', status: 'Active', since: '2022' },
    ],
    retirement: [
      { id: 'R-200301', product: 'Deferred Annuity', type: 'Variable Deferred', value: '$280K AUM', income: 'Est. $3,200/mo at 65', status: 'Active', since: '2020' },
    ],
    advisory: [
      { id: 'A-300201', product: 'Unified Managed Account', type: 'UMA — Discretionary', value: '$280K AUM', fee: '$2,800/yr (1%)', status: 'Active', since: '2022' },
      { id: 'A-300202', product: 'Estate Planning', type: 'Trust + Will + POA', value: '$2M+ estate', fee: 'Included', status: 'Active', since: '2020' },
    ],
  },
}

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
  } else if (q.includes('investment') || q.includes('portfolio gap') || q.includes('aum') || q.includes('rebalanc') || q.includes('mutual fund') || q.includes('etf') || q.includes('529')) {
    return "📈 **Investment Opportunities Identified**:\n\n**AUM Overview**: $4.2M across 62 investment clients (+14% YTD)\n\n**Gaps & Opportunities**:\n• **Patricia Nguyen (38)** — No investment products; prime annuity candidate ($3K/yr)\n• **James Whitfield (52)** — No investment products; deferred annuity could generate $12K/yr\n• **David Thompson (33)** — New parent; 529 college savings plan opportunity ($1.2K/yr)\n\n**Rebalancing Alerts**:\n• **Robert Chen** — VUL sub-accounts drifted 8% from target allocation\n• **Maria Gonzalez** — Fixed annuity maturing; consider ladder strategy\n\n**Total Investment Potential**: ~$16K+ in new annual premiums/contributions. Want me to draft outreach emails?"
  } else if (q.includes('retirement') || q.includes('annuity') || q.includes('income gap') || q.includes('deferred')) {
    return "🏖️ **Retirement Planning Analysis**:\n\n**Retirement Clients**: 38 active (goal: 45 by year-end)\n\n**Top Candidates for Retirement Planning**:\n• **James Whitfield (52)** — 13 yrs to retirement; deferred annuity could provide $2,800/mo income\n• **Maria Gonzalez (48)** — Interested in immediate income annuity; follow up on Apr 5 discussion\n• **Sandra Williams (61)** — Near retirement; Social Security + income annuity income gap analysis needed\n• **Linda Morrison (56)** — $500K+ investable assets; UMA + deferred annuity combo recommended\n\n**Income Gap Total**: 4 clients with projected retirement income shortfalls averaging $1,400/mo\n\nShall I generate retirement income illustrations for these clients?"
  } else if (q.includes('product') || q.includes('recommend')) {
    return "📦 **Holistic Product Recommendations Engine**:\n\nBased on your book of business across all four domains:\n\n🛡️ **Insurance Gaps**: Disability coverage missing for 30-45 age bracket (David Thompson, Patricia Nguyen)\n📈 **Investment Gaps**: 185 clients with no investment products — annuity or fund opportunity\n🏖️ **Retirement Gaps**: 4 high-priority clients need income projections (James Whitfield, Sandra Williams)\n🤝 **Advisory Gaps**: 4 clients qualify for estate planning (Linda Morrison, Robert Chen, James Whitfield)\n\n**Revenue Potential**: $31.2K/year from top 6 cross-domain opportunities\n\nShall I generate targeted outreach lists for each product domain?"
  } else if (q.includes('advisory') || q.includes('wealth management') || q.includes('uma') || q.includes('business') || q.includes('nqdc') || q.includes('coli')) {
    return "🤝 **Advisory Services Opportunities**:\n\n**Wealth Management / UMA**:\n• **Linda Morrison** — $500K+ investable assets; excellent UMA candidate ($5K advisory fee/yr)\n\n**Estate Planning** (4 clients qualified):\n• **Linda Morrison** — $2M+ WL policy, trust beneficiary; comprehensive estate review overdue\n• **Robert Chen** — Business owner; succession planning + NQDC gap\n• **James Whitfield** — Multiple assets; will, POA, and trust review recommended\n\n**Business Services** (2 clients):\n• **Robert Chen** — NQDC, key-person insurance, buy-sell agreement funding\n• **James Whitfield** — Executive bonus plan (Section 162) and SERP review\n\nTotal advisory revenue potential: **$13K+/year**. Want me to draft client meeting agendas?"
  } else {
    return `🤖 **AI Agent Response**:\n\nI've analyzed your query: *"${query}"*\n\nHere's what I found based on your complete book of business across all four service domains:\n\n🛡️ **Insurance**: 247 clients · 1,842 policies · $487K monthly premium · 23 renewals due\n📈 **Investments**: $4.2M AUM · 62 clients · 3 portfolio gaps · 2 rebalances pending\n🏖️ **Retirement**: 38 clients · 4 income gap alerts · $89K annuity premium\n🤝 **Advisory**: 59 clients · 4 estate planning opportunities · 2 UMA candidates\n\nTry asking me: "Show investment opportunities", "Which clients need retirement planning?", "Show estate planning alerts", or "Identify upsell opportunities"\n\nHow else can I assist you today?`
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
        <div id="tpl-claims"><ClaimsPage /></div>
        <div id="tpl-ai-agents"><AIAgentsPage /></div>
        <div id="tpl-sales"><SalesPage /></div>
        <div id="tpl-underwriting"><UnderwritingPage /></div>
        <div id="tpl-products"><ProductsPage /></div>
        <div id="tpl-reports"><ReportsPage /></div>
        <div id="tpl-calendar"><CalendarPage /></div>
        <div id="tpl-ai-insights"><AIImpactScorecardPage /></div>
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
        <div class="nav-sub-group">
          <a class="nav-item nav-sub-item claims-nav" onclick="navigateTo('claims')" href="#">
            <i class="fas fa-file-medical-alt"></i>
            <span>Claims</span>
            <span class="nav-badge alert">7</span>
          </a>
        </div>
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
        <div class="nav-sub-group">
          <a class="nav-sub-item" onclick="navigateTo('underwriting')" href="#">
            <i class="fas fa-microscope"></i>
            <span>Underwriting</span>
            <span class="nav-badge" style="background:#f59e0b;color:white">4</span>
          </a>
        </div>
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
        <a class="nav-item ai-insights-nav" onclick="navigateTo('ai-insights')" href="#">
          <i class="fas fa-brain"></i>
          <span>AI Insights</span>
          <span class="nav-badge ai-pulse">NEW</span>
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
    <div class="page dashboard-page" id="dashboard-page">

      {/* Welcome Banner */}
      <div class="welcome-banner">
        <div class="welcome-text">
          <h2>Good morning, Sridhar! 👋</h2>
          <p>You have <strong>18 pending actions</strong> and <strong>3 urgent items</strong> today. · <span class="date-chip">Friday, April 10, 2026</span></p>
        </div>
        <div class="welcome-actions">
          <button class="btn btn-primary" onclick="navigateTo('ai-agents')"><i class="fas fa-robot"></i> Ask AI Agent</button>
          <button class="btn btn-outline" onclick="navigateTo('clients')"><i class="fas fa-plus"></i> New Client</button>
        </div>
      </div>

      {/* ── HOLISTIC BOOK SNAPSHOT STRIP ── */}
      <div class="book-snapshot-strip">
        <div class="bss-card bss-insurance" onclick="navigateTo('policies')" style="cursor:pointer">
          <div class="bss-icon"><i class="fas fa-shield-alt"></i></div>
          <div class="bss-body">
            <div class="bss-label">Insurance</div>
            <div class="bss-primary">$312K <span class="bss-sub">annual premium</span></div>
            <div class="bss-meta">1,842 policies · 23 renewals due</div>
          </div>
          <div class="bss-trend up"><i class="fas fa-arrow-up"></i>+9%</div>
        </div>
        <div class="bss-card bss-investments" onclick="navigateTo('products')" style="cursor:pointer">
          <div class="bss-icon"><i class="fas fa-chart-line"></i></div>
          <div class="bss-body">
            <div class="bss-label">Investments</div>
            <div class="bss-primary">$4.2M <span class="bss-sub">AUM</span></div>
            <div class="bss-meta">Annuities · Mutual Funds · ETFs · 529s</div>
          </div>
          <div class="bss-trend up"><i class="fas fa-arrow-up"></i>+14%</div>
        </div>
        <div class="bss-card bss-retirement" onclick="navigateTo('products')" style="cursor:pointer">
          <div class="bss-icon"><i class="fas fa-umbrella-beach"></i></div>
          <div class="bss-body">
            <div class="bss-label">Retirement</div>
            <div class="bss-primary">$1.8M <span class="bss-sub">income assets</span></div>
            <div class="bss-meta">38 clients in accumulation phase</div>
          </div>
          <div class="bss-trend up"><i class="fas fa-arrow-up"></i>+6%</div>
        </div>
        <div class="bss-card bss-advisory" onclick="navigateTo('products')" style="cursor:pointer">
          <div class="bss-icon"><i class="fas fa-handshake"></i></div>
          <div class="bss-body">
            <div class="bss-label">Advisory Services</div>
            <div class="bss-primary">$2.1M <span class="bss-sub">managed assets</span></div>
            <div class="bss-meta">Wealth · Estate · Business Services</div>
          </div>
          <div class="bss-trend up"><i class="fas fa-arrow-up"></i>+11%</div>
        </div>
      </div>

      {/* ── KPI ROW ── */}
      <div class="kpi-grid">
        <div class="kpi-card" onclick="navigateTo('clients')" style="cursor:pointer">
          <div class="kpi-icon blue"><i class="fas fa-users"></i></div>
          <div class="kpi-data">
            <div class="kpi-value">247</div>
            <div class="kpi-label">Total Clients</div>
            <div class="kpi-trend up"><i class="fas fa-arrow-up"></i> +8 this month</div>
          </div>
        </div>
        <div class="kpi-card" onclick="navigateTo('reports')" style="cursor:pointer">
          <div class="kpi-icon gold"><i class="fas fa-dollar-sign"></i></div>
          <div class="kpi-data">
            <div class="kpi-value">$487K</div>
            <div class="kpi-label">Monthly Revenue</div>
            <div class="kpi-trend up"><i class="fas fa-arrow-up"></i> +12% MoM</div>
          </div>
        </div>
        <div class="kpi-card" onclick="navigateTo('reports')" style="cursor:pointer">
          <div class="kpi-icon green"><i class="fas fa-layer-group"></i></div>
          <div class="kpi-data">
            <div class="kpi-value">$8.1M</div>
            <div class="kpi-label">Total AUM + Premiums</div>
            <div class="kpi-trend up"><i class="fas fa-arrow-up"></i> +8% QoQ</div>
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

      {/* ── ROW 1: Revenue by Product Line + Action Items ── */}
      <div class="dashboard-grid">
        <div class="dash-card chart-card">
          <div class="card-header">
            <h3><i class="fas fa-chart-line"></i> Revenue by Product Line — 2026</h3>
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
              <div class="act-icon ins-color"><i class="fas fa-sync-alt"></i></div>
              <div class="act-content">
                <div class="act-title">Renewal Due — Sandra Williams</div>
                <div class="act-desc"><span class="act-domain-pill ins">Insurance</span> Policy P-100320 expires Sep 2026</div>
              </div>
              <span class="act-badge high">Urgent</span>
            </div>
            <div class="activity-item high">
              <div class="act-icon inv-color"><i class="fas fa-coins"></i></div>
              <div class="act-content">
                <div class="act-title">Annuity Review — Patricia Nguyen</div>
                <div class="act-desc"><span class="act-domain-pill inv">Investments</span> Deferred annuity illustration ready</div>
              </div>
              <span class="act-badge ai">AI Alert</span>
            </div>
            <div class="activity-item high">
              <div class="act-icon ins-color"><i class="fas fa-phone"></i></div>
              <div class="act-content">
                <div class="act-title">Follow-up — Kevin Park</div>
                <div class="act-desc"><span class="act-domain-pill ins">Insurance</span> Pending application needs response</div>
              </div>
              <span class="act-badge high">Urgent</span>
            </div>
            <div class="activity-item medium">
              <div class="act-icon ret-color"><i class="fas fa-umbrella-beach"></i></div>
              <div class="act-content">
                <div class="act-title">Retirement Planning — James Whitfield</div>
                <div class="act-desc"><span class="act-domain-pill ret">Retirement</span> Income annuity conversation at age 52</div>
              </div>
              <span class="act-badge ai">AI Insight</span>
            </div>
            <div class="activity-item medium">
              <div class="act-icon adv-color"><i class="fas fa-landmark"></i></div>
              <div class="act-content">
                <div class="act-title">Estate Planning — James Whitfield</div>
                <div class="act-desc"><span class="act-domain-pill adv">Advisory</span> Trust review + will update recommended</div>
              </div>
              <span class="act-badge ai">AI Insight</span>
            </div>
            <div class="activity-item medium">
              <div class="act-icon adv-color"><i class="fas fa-gem"></i></div>
              <div class="act-content">
                <div class="act-title">Wealth Management — Linda Morrison</div>
                <div class="act-desc"><span class="act-domain-pill adv">Advisory</span> UMA account candidate — $500K+ assets</div>
              </div>
              <span class="act-badge medium">Scheduled</span>
            </div>
            <div class="activity-item medium">
              <div class="act-icon ins-color"><i class="fas fa-file-alt"></i></div>
              <div class="act-content">
                <div class="act-title">Claim Review — Robert Chen</div>
                <div class="act-desc"><span class="act-domain-pill ins">Insurance</span> Policy P-100310 awaiting adjuster</div>
              </div>
              <span class="act-badge medium">In Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Book Composition + Opportunity Radar + Commission ── */}
      <div class="dash-row-3">

        {/* Book Composition Donut */}
        <div class="dash-card goal-card">
          <div class="card-header">
            <h3><i class="fas fa-chart-pie"></i> Book Composition</h3>
            <span class="goal-days-left">All Products</span>
          </div>
          <div class="chart-container donut-container" style="height:180px">
            <canvas id="bookCompositionChart"></canvas>
          </div>
          <div class="donut-legend" style="margin-top:10px">
            <div class="legend-item"><span class="dot blue"></span>Insurance 38% · $312K</div>
            <div class="legend-item"><span class="dot green"></span>Investments 26% · $4.2M AUM</div>
            <div class="legend-item"><span class="dot gold"></span>Retirement 22% · $1.8M</div>
            <div class="legend-item"><span class="dot purple"></span>Advisory 14% · $2.1M</div>
          </div>
          <div class="goal-list" style="margin-top:12px;padding-top:12px;border-top:1px solid var(--gray-100)">
            <div class="goal-item">
              <div class="goal-meta"><span class="goal-name"><i class="fas fa-shield-alt" style="color:#003087;width:14px"></i> Insurance Coverage</span><span class="goal-val">87%<span class="goal-target"> of clients</span></span></div>
              <div class="goal-bar-outer"><div class="goal-bar-inner" style="width:87%"></div></div>
            </div>
            <div class="goal-item">
              <div class="goal-meta"><span class="goal-name"><i class="fas fa-chart-line" style="color:#059669;width:14px"></i> Investment Products</span><span class="goal-val">52%<span class="goal-target"> of clients</span></span></div>
              <div class="goal-bar-outer"><div class="goal-bar-inner green" style="width:52%"></div></div>
            </div>
            <div class="goal-item">
              <div class="goal-meta"><span class="goal-name"><i class="fas fa-umbrella-beach" style="color:#d97706;width:14px"></i> Retirement Plans</span><span class="goal-val">38%<span class="goal-target"> of clients</span></span></div>
              <div class="goal-bar-outer"><div class="goal-bar-inner gold" style="width:38%"></div></div>
            </div>
            <div class="goal-item">
              <div class="goal-meta"><span class="goal-name"><i class="fas fa-handshake" style="color:#7c3aed;width:14px"></i> Advisory Services</span><span class="goal-val">24%<span class="goal-target"> of clients</span></span></div>
              <div class="goal-bar-outer"><div class="goal-bar-inner purple" style="width:24%"></div></div>
            </div>
          </div>
        </div>

        {/* Opportunity Radar */}
        <div class="dash-card commission-card">
          <div class="card-header">
            <h3><i class="fas fa-crosshairs"></i> Opportunity Radar</h3>
            <span class="comm-ytd-badge">AI Detected</span>
          </div>
          <div class="opp-list">
            <div class="opp-item">
              <div class="opp-domain-icon inv-bg"><i class="fas fa-lock"></i></div>
              <div class="opp-info">
                <div class="opp-title">Annuity Conversion — Patricia Nguyen</div>
                <div class="opp-meta"><span class="act-domain-pill inv">Investments</span> Deferred annuity · age 38 · lock in rates now</div>
              </div>
              <div class="opp-value">$3K/yr</div>
            </div>
            <div class="opp-item">
              <div class="opp-domain-icon ret-bg"><i class="fas fa-umbrella-beach"></i></div>
              <div class="opp-info">
                <div class="opp-title">Income Annuity — James Whitfield</div>
                <div class="opp-meta"><span class="act-domain-pill ret">Retirement</span> Age 52 · retirement in ~13 yrs</div>
              </div>
              <div class="opp-value">$12K/yr</div>
            </div>
            <div class="opp-item">
              <div class="opp-domain-icon adv-bg"><i class="fas fa-network-wired"></i></div>
              <div class="opp-info">
                <div class="opp-title">UMA Account — Linda Morrison</div>
                <div class="opp-meta"><span class="act-domain-pill adv">Advisory</span> $500K+ assets · Unified Managed Account</div>
              </div>
              <div class="opp-value">$5K/yr</div>
            </div>
            <div class="opp-item">
              <div class="opp-domain-icon adv-bg"><i class="fas fa-landmark"></i></div>
              <div class="opp-info">
                <div class="opp-title">Estate Review — Robert Chen</div>
                <div class="opp-meta"><span class="act-domain-pill adv">Advisory</span> Business owner · succession + NQDC gap</div>
              </div>
              <div class="opp-value">$8K/yr</div>
            </div>
            <div class="opp-item">
              <div class="opp-domain-icon inv-bg"><i class="fas fa-graduation-cap"></i></div>
              <div class="opp-info">
                <div class="opp-title">529 Plan — David Thompson</div>
                <div class="opp-meta"><span class="act-domain-pill inv">Investments</span> New parent · child college savings</div>
              </div>
              <div class="opp-value">$1.2K/yr</div>
            </div>
            <div class="opp-item">
              <div class="opp-domain-icon ins-bg"><i class="fas fa-user-shield"></i></div>
              <div class="opp-info">
                <div class="opp-title">Disability Insurance — Patricia Nguyen</div>
                <div class="opp-meta"><span class="act-domain-pill ins">Insurance</span> No disability coverage · age 38</div>
              </div>
              <div class="opp-value">$2K/yr</div>
            </div>
          </div>
          <div class="comm-stats-row" style="margin-top:12px">
            <div class="comm-stat"><div class="cs-num green-text">$31.2K</div><div class="cs-lbl2">Total Potential</div></div>
            <div class="comm-stat"><div class="cs-num">6</div><div class="cs-lbl2">Opportunities</div></div>
            <div class="comm-stat"><div class="cs-num" style="color:#7c3aed">3 Domains</div><div class="cs-lbl2">Inv/Ret/Adv</div></div>
          </div>
          <button class="btn btn-ai" style="width:100%;margin-top:10px" onclick="sendContextMessage('Show me all cross-sell and upsell opportunities across 247 clients — rank by revenue potential','advisor')"><i class="fas fa-robot"></i> Full AI Opportunity Analysis</button>
        </div>

        {/* Lapse Risk + Commission combined */}
        <div class="dash-card lapse-card">
          <div class="card-header">
            <h3><i class="fas fa-wallet"></i> Commission Tracker</h3>
            <span class="comm-ytd-badge">YTD 2026</span>
          </div>
          <div class="comm-total" style="text-align:center;margin-bottom:12px">
            <div class="comm-total-val">$42,180</div>
            <div class="comm-total-lbl">Earned This Month</div>
          </div>
          <div class="comm-breakdown">
            <div class="comm-row">
              <span class="comm-type"><i class="fas fa-circle" style="color:#003087"></i> Insurance</span>
              <div class="comm-bar-outer"><div class="comm-bar" style="width:55%;background:#003087"></div></div>
              <span class="comm-amt">$23,200</span>
            </div>
            <div class="comm-row">
              <span class="comm-type"><i class="fas fa-circle" style="color:#059669"></i> Investments</span>
              <div class="comm-bar-outer"><div class="comm-bar" style="width:24%;background:#059669"></div></div>
              <span class="comm-amt">$10,100</span>
            </div>
            <div class="comm-row">
              <span class="comm-type"><i class="fas fa-circle" style="color:#d97706"></i> Retirement</span>
              <div class="comm-bar-outer"><div class="comm-bar" style="width:13%;background:#d97706"></div></div>
              <span class="comm-amt">$5,480</span>
            </div>
            <div class="comm-row">
              <span class="comm-type"><i class="fas fa-circle" style="color:#7c3aed"></i> Advisory</span>
              <div class="comm-bar-outer"><div class="comm-bar" style="width:8%;background:#7c3aed"></div></div>
              <span class="comm-amt">$3,400</span>
            </div>
          </div>
          <div class="comm-stats-row" style="margin-top:12px">
            <div class="comm-stat"><div class="cs-num">$187K</div><div class="cs-lbl2">YTD Earned</div></div>
            <div class="comm-stat"><div class="cs-num">$240K</div><div class="cs-lbl2">Annual Target</div></div>
            <div class="comm-stat"><div class="cs-num green-text">78%</div><div class="cs-lbl2">Progress</div></div>
          </div>
          <div style="padding-top:12px;margin-top:4px;border-top:1px solid var(--gray-100)">
            <div class="card-header" style="padding:0;margin-bottom:8px"><h3><i class="fas fa-exclamation-triangle"></i> Lapse Risk Monitor</h3><button class="btn-link" onclick="sendContextMessage('Show all 4 lapse-risk clients with risk scores, triggers, and recommended retention actions','renewal')">AI Analysis →</button></div>
            <div class="lapse-summary-bar">
              <div class="lapse-seg high-risk"><span class="lapse-count">4</span><span class="lapse-lbl">High Risk</span></div>
              <div class="lapse-seg med-risk"><span class="lapse-count">11</span><span class="lapse-lbl">Medium Risk</span></div>
              <div class="lapse-seg low-risk"><span class="lapse-count">232</span><span class="lapse-lbl">Low Risk</span></div>
            </div>
            {/* ── Retention Intelligence rows ── */}
            <div class="ri-rows">
              <div class="ri-row ri-high" onclick="openRetentionModal('ret-patricia')">
                <div class="ri-risk-badge high">HIGH</div>
                <div class="ri-info">
                  <div class="ri-name">Patricia Nguyen</div>
                  <div class="ri-trigger"><i class="fas fa-battery-quarter"></i> UL Under-funded · Lapse ~Jun 20</div>
                </div>
                <div class="ri-score-wrap"><div class="ri-score high">87</div><div class="ri-score-lbl">Risk</div></div>
                <button class="ri-action-btn" onclick="event.stopPropagation();openRetentionModal('ret-patricia')"><i class="fas fa-bolt"></i> Act</button>
              </div>
              <div class="ri-row ri-high" onclick="openRetentionModal('ret-sandra')">
                <div class="ri-risk-badge high">HIGH</div>
                <div class="ri-info">
                  <div class="ri-name">Sandra Williams</div>
                  <div class="ri-trigger"><i class="fas fa-calendar-times"></i> Term Renewal · Sep 2026 · 153 days</div>
                </div>
                <div class="ri-score-wrap"><div class="ri-score high">79</div><div class="ri-score-lbl">Risk</div></div>
                <button class="ri-action-btn" onclick="event.stopPropagation();openRetentionModal('ret-sandra')"><i class="fas fa-bolt"></i> Act</button>
              </div>
              <div class="ri-row ri-med" onclick="openRetentionModal('ret-kevin')">
                <div class="ri-risk-badge med">MED</div>
                <div class="ri-info">
                  <div class="ri-name">Kevin Park</div>
                  <div class="ri-trigger"><i class="fas fa-pause-circle"></i> Policy Pending · No contact 12 days</div>
                </div>
                <div class="ri-score-wrap"><div class="ri-score med">61</div><div class="ri-score-lbl">Risk</div></div>
                <button class="ri-action-btn med" onclick="event.stopPropagation();openRetentionModal('ret-kevin')"><i class="fas fa-phone"></i> Call</button>
              </div>
              <div class="ri-row ri-med" onclick="openRetentionModal('ret-david')">
                <div class="ri-risk-badge med">MED</div>
                <div class="ri-info">
                  <div class="ri-name">David Thompson</div>
                  <div class="ri-trigger"><i class="fas fa-shield-alt"></i> Single policy · Under-insured · Age 33</div>
                </div>
                <div class="ri-score-wrap"><div class="ri-score med">54</div><div class="ri-score-lbl">Risk</div></div>
                <button class="ri-action-btn med" onclick="event.stopPropagation();openRetentionModal('ret-david')"><i class="fas fa-phone"></i> Call</button>
              </div>
            </div>
            {/* ── Retention Forecast Mini-Strip ── */}
            <div class="ri-forecast-strip">
              <div class="ri-fc-card urgent">
                <div class="ri-fc-icon"><i class="fas fa-battery-quarter"></i></div>
                <div class="ri-fc-body">
                  <div class="ri-fc-label">Patricia Nguyen</div>
                  <div class="ri-fc-val red">Lapse in ~68d</div>
                  <div class="ri-fc-bar-outer"><div class="ri-fc-bar red" style="width:87%"></div></div>
                </div>
              </div>
              <div class="ri-fc-card high">
                <div class="ri-fc-icon"><i class="fas fa-calendar-times"></i></div>
                <div class="ri-fc-body">
                  <div class="ri-fc-label">Sandra Williams</div>
                  <div class="ri-fc-val orange">Term Expiry 153d</div>
                  <div class="ri-fc-bar-outer"><div class="ri-fc-bar orange" style="width:79%"></div></div>
                </div>
              </div>
              <div class="ri-fc-card med">
                <div class="ri-fc-icon"><i class="fas fa-coins"></i></div>
                <div class="ri-fc-body">
                  <div class="ri-fc-label">James Whitfield</div>
                  <div class="ri-fc-val purple">LTC Gap — Review</div>
                  <div class="ri-fc-bar-outer"><div class="ri-fc-bar purple" style="width:48%"></div></div>
                </div>
              </div>
            </div>
            <button class="ri-view-all-btn" onclick="navigateTo('policies')"><i class="fas fa-heartbeat"></i> Lapse Prevention Dashboard →</button>
          </div>
        </div>

      </div>

      {/* ── ROW 3: Top Clients (holistic view) + Appointments + Book Activity ── */}
      <div class="dash-row-bottom">

        {/* Top Clients — Holistic */}
        <div class="dash-card clients-card">
          <div class="card-header">
            <h3><i class="fas fa-crown"></i> Top Clients — Full Book View</h3>
            <button class="btn-link" onclick="navigateTo('clients')">View All →</button>
          </div>
          <div class="client-table">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Insurance</th>
                  <th>Investments</th>
                  <th>Retirement</th>
                  <th>Advisory</th>
                  <th>Total Value</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div class="client-cell"><div class="mini-avatar lm">LM</div><span>Linda Morrison</span></div></td>
                  <td><span class="domain-dot ins-dot" title="Whole Life · $32K"></span></td>
                  <td><span class="domain-dot inv-dot" title="Mutual Funds · $280K AUM"></span></td>
                  <td><span class="domain-dot ret-dot" title="Deferred Annuity"></span></td>
                  <td><span class="domain-dot adv-dot" title="Estate Planning + UMA"></span></td>
                  <td class="premium">$812K</td>
                  <td><div class="score-bar"><div class="score-fill" style="width:98%"></div><span>98</span></div></td>
                </tr>
                <tr>
                  <td><div class="client-cell"><div class="mini-avatar rc">RC</div><span>Robert Chen</span></div></td>
                  <td><span class="domain-dot ins-dot" title="Whole Life · $21K"></span></td>
                  <td><span class="domain-dot inv-dot" title="VUL sub-accounts · $180K"></span></td>
                  <td><span class="domain-empty" title="No retirement product yet">—</span></td>
                  <td><span class="domain-dot adv-dot" title="Business Services · Key Person"></span></td>
                  <td class="premium">$421K</td>
                  <td><div class="score-bar"><div class="score-fill" style="width:96%"></div><span>96</span></div></td>
                </tr>
                <tr>
                  <td><div class="client-cell"><div class="mini-avatar mg">MG</div><span>Maria Gonzalez</span></div></td>
                  <td><span class="domain-dot ins-dot" title="UL · $14.6K"></span></td>
                  <td><span class="domain-dot inv-dot" title="Annuities · $95K"></span></td>
                  <td><span class="domain-dot ret-dot" title="Immediate Annuity interest"></span></td>
                  <td><span class="domain-empty" title="Estate planning gap">—</span></td>
                  <td class="premium">$209K</td>
                  <td><div class="score-bar"><div class="score-fill" style="width:91%"></div><span>91</span></div></td>
                </tr>
                <tr>
                  <td><div class="client-cell"><div class="mini-avatar jw">JW</div><span>James Whitfield</span></div></td>
                  <td><span class="domain-dot ins-dot" title="WL + Term + LTC · $12.4K"></span></td>
                  <td><span class="domain-empty" title="No investment product">—</span></td>
                  <td><span class="domain-dot ret-dot" title="Deferred annuity candidate"></span></td>
                  <td><span class="domain-dot adv-dot" title="Estate planning in progress"></span></td>
                  <td class="premium">$162K</td>
                  <td><div class="score-bar"><div class="score-fill" style="width:92%"></div><span>92</span></div></td>
                </tr>
                <tr>
                  <td><div class="client-cell"><div class="mini-avatar pn">PN</div><span>Patricia Nguyen</span></div></td>
                  <td><span class="domain-dot ins-dot" title="UL + VUL · $5.8K"></span></td>
                  <td><span class="domain-empty" title="Annuity opportunity pending">—</span></td>
                  <td><span class="domain-empty" title="No retirement yet">—</span></td>
                  <td><span class="domain-empty" title="No advisory">—</span></td>
                  <td class="premium text-orange">$58K <span style="font-size:10px;color:#d97706">⚠ gaps</span></td>
                  <td><div class="score-bar"><div class="score-fill" style="width:87%"></div><span>87</span></div></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="client-table-legend">
            <span><span class="domain-dot ins-dot"></span> Insurance</span>
            <span><span class="domain-dot inv-dot"></span> Investments</span>
            <span><span class="domain-dot ret-dot"></span> Retirement</span>
            <span><span class="domain-dot adv-dot"></span> Advisory</span>
            <span><span class="domain-empty">—</span> Gap / Opportunity</span>
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
              <div class="appt-time"><span class="appt-hr">10:30</span><span class="appt-ampm">AM</span></div>
              <div class="appt-bar appt-bar-red"></div>
              <div class="appt-detail">
                <div class="appt-title">Kevin Park — Follow-up Call</div>
                <div class="appt-sub"><span class="act-domain-pill ins">Insurance</span> Phone · 30 min</div>
              </div>
              <span class="appt-now-chip">Now</span>
            </div>
            <div class="appt-item">
              <div class="appt-time"><span class="appt-hr">2:00</span><span class="appt-ampm">PM</span></div>
              <div class="appt-bar appt-bar-blue"></div>
              <div class="appt-detail">
                <div class="appt-title">Robert Chen — Claim Update</div>
                <div class="appt-sub"><span class="act-domain-pill ins">Insurance</span> Video · 45 min</div>
              </div>
            </div>
            <div class="appt-item">
              <div class="appt-time"><span class="appt-hr">4:30</span><span class="appt-ampm">PM</span></div>
              <div class="appt-bar appt-bar-gold"></div>
              <div class="appt-detail">
                <div class="appt-title">Alex Rivera — New Prospect</div>
                <div class="appt-sub"><span class="act-domain-pill inv">Investments</span> In Person · 60 min</div>
              </div>
            </div>
          </div>
          <div class="appt-date-header" style="margin-top:10px">Upcoming</div>
          <div class="appt-list">
            <div class="appt-item">
              <div class="appt-time"><span class="appt-hr">Apr</span><span class="appt-ampm">15</span></div>
              <div class="appt-bar appt-bar-purple"></div>
              <div class="appt-detail">
                <div class="appt-title">Linda Morrison — Annual Review</div>
                <div class="appt-sub"><span class="act-domain-pill adv">Advisory</span> UMA + Estate · 90 min</div>
              </div>
            </div>
            <div class="appt-item">
              <div class="appt-time"><span class="appt-hr">Apr</span><span class="appt-ampm">18</span></div>
              <div class="appt-bar appt-bar-green"></div>
              <div class="appt-detail">
                <div class="appt-title">James Whitfield — Retirement Plan</div>
                <div class="appt-sub"><span class="act-domain-pill ret">Retirement</span> Deferred annuity illustration</div>
              </div>
            </div>
            <div class="appt-item">
              <div class="appt-time"><span class="appt-hr">Apr</span><span class="appt-ampm">22</span></div>
              <div class="appt-bar appt-bar-blue"></div>
              <div class="appt-detail">
                <div class="appt-title">Team Review — Roger Putnam</div>
                <div class="appt-sub"><span class="act-domain-pill ins">Insurance</span> Q1 Results · All lines</div>
              </div>
            </div>
          </div>
        </div>

        {/* Book Activity + Recent Comms */}
        <div class="dash-card donut-card">
          <div class="card-header">
            <h3><i class="fas fa-chart-bar"></i> Monthly Goals</h3>
            <span class="goal-days-left">21 days left</span>
          </div>
          <div class="goal-list">
            <div class="goal-item">
              <div class="goal-meta"><span class="goal-name"><i class="fas fa-shield-alt" style="color:#003087;width:14px;margin-right:4px"></i>Insurance Premium</span><span class="goal-val">$312K<span class="goal-target"> / $360K</span></span></div>
              <div class="goal-bar-outer"><div class="goal-bar-inner" style="width:87%"></div></div>
              <div class="goal-footer"><span class="goal-pct">87%</span><span class="goal-gap">$48K to target</span></div>
            </div>
            <div class="goal-item">
              <div class="goal-meta"><span class="goal-name"><i class="fas fa-chart-line" style="color:#059669;width:14px;margin-right:4px"></i>Investment AUM</span><span class="goal-val">$4.2M<span class="goal-target"> / $5M</span></span></div>
              <div class="goal-bar-outer"><div class="goal-bar-inner green" style="width:84%"></div></div>
              <div class="goal-footer"><span class="goal-pct">84%</span><span class="goal-gap">$800K to target</span></div>
            </div>
            <div class="goal-item">
              <div class="goal-meta"><span class="goal-name"><i class="fas fa-umbrella-beach" style="color:#d97706;width:14px;margin-right:4px"></i>Retirement Clients</span><span class="goal-val">38<span class="goal-target"> / 45</span></span></div>
              <div class="goal-bar-outer"><div class="goal-bar-inner gold" style="width:84%"></div></div>
              <div class="goal-footer"><span class="goal-pct">84%</span><span class="goal-gap">7 more needed</span></div>
            </div>
            <div class="goal-item">
              <div class="goal-meta"><span class="goal-name"><i class="fas fa-handshake" style="color:#7c3aed;width:14px;margin-right:4px"></i>Advisory Clients</span><span class="goal-val">59<span class="goal-target"> / 80</span></span></div>
              <div class="goal-bar-outer"><div class="goal-bar-inner purple" style="width:74%"></div></div>
              <div class="goal-footer"><span class="goal-pct">74%</span><span class="goal-gap">21 more needed</span></div>
            </div>
            <div class="goal-item">
              <div class="goal-meta"><span class="goal-name"><i class="fas fa-layer-group" style="color:#dc2626;width:14px;margin-right:4px"></i>Multi-Product Clients</span><span class="goal-val">1.8<span class="goal-target"> / 2.5 avg</span></span></div>
              <div class="goal-bar-outer"><div class="goal-bar-inner orange" style="width:72%"></div></div>
              <div class="goal-footer"><span class="goal-pct">72%</span><span class="goal-gap">Cross-sell gap</span></div>
            </div>
          </div>
          <div class="card-header" style="margin-top:14px;padding-top:12px;border-top:1px solid var(--gray-100)">
            <h3><i class="fas fa-comments"></i> Recent Communications</h3>
          </div>
          <div class="recent-comms">
            <div class="comm-item">
              <div class="comm-avatar ca-rc">RC</div>
              <div class="comm-info">
                <div class="comm-name">Robert Chen</div>
                <div class="comm-msg">Re: Claim P-100310 — docs received</div>
              </div>
              <div class="comm-meta"><i class="fas fa-envelope"></i> 2h ago</div>
            </div>
            <div class="comm-item">
              <div class="comm-avatar ca-lm">LM</div>
              <div class="comm-info">
                <div class="comm-name">Linda Morrison</div>
                <div class="comm-msg">Confirmed Apr 15 estate + UMA review</div>
              </div>
              <div class="comm-meta"><i class="fas fa-comment"></i> 5h ago</div>
            </div>
            <div class="comm-item">
              <div class="comm-avatar ca-mg">MG</div>
              <div class="comm-info">
                <div class="comm-name">Maria Gonzalez</div>
                <div class="comm-msg">Interested in income annuity discussion</div>
              </div>
              <div class="comm-meta"><i class="fas fa-phone"></i> Yesterday</div>
            </div>
          </div>
        </div>

      </div>

      {/* ── AI HOLISTIC INSIGHTS BANNER ── */}
      <div class="ai-highlight-banner" onclick="navigateTo('ai-agents')">
        <div class="ai-banner-icon"><i class="fas fa-robot"></i></div>
        <div class="ai-banner-content">
          <h4>AI Agent has 9 cross-domain insights ready</h4>
          <p>$31.2K revenue potential · 3 investment gaps · 4 retirement planning opportunities · 2 estate planning alerts · 4 lapse risks</p>
        </div>
        <button class="btn btn-white">View All AI Insights <i class="fas fa-arrow-right"></i></button>
      </div>

      {/* ── Retention Intelligence Modal ── */}
      <div class="detail-modal-overlay" id="retention-modal-overlay" onclick="closeRetentionModal()">
        <div class="detail-modal retention-modal" onclick="event.stopPropagation()">
          <div class="detail-modal-header" id="retention-modal-header">
            <div class="detail-modal-title">
              <span class="detail-modal-icon" id="retention-modal-icon" style="background:linear-gradient(135deg,#dc2626,#b91c1c)"><i class="fas fa-shield-alt"></i></span>
              <div>
                <h3 id="retention-modal-title">Retention Intelligence</h3>
                <p id="retention-modal-subtitle" class="detail-modal-sub"></p>
              </div>
            </div>
            <div class="detail-modal-header-actions">
              <div class="detail-modal-tabs" id="retention-modal-tabs">
                <button class="dmt-tab active" onclick="switchRetentionTab('analysis',this)"><i class="fas fa-chart-bar"></i> Risk Analysis</button>
                <button class="dmt-tab" onclick="switchRetentionTab('signals',this)"><i class="fas fa-signal"></i> Signals</button>
                <button class="dmt-tab ai-tab" onclick="switchRetentionTab('action',this)"><i class="fas fa-robot"></i> AI Action Plan</button>
              </div>
              <button class="detail-modal-close" onclick="closeRetentionModal()"><i class="fas fa-times"></i></button>
            </div>
          </div>
          <div class="detail-modal-body" id="retention-modal-body"></div>
        </div>
      </div>

    </div>
  )
}

// Client domain coverage data (Insurance, Investments, Retirement, Advisory)
const clientDomains: Record<number, { ins: boolean; inv: boolean; ret: boolean; adv: boolean; aum?: string; gaps: string[] }> = {
  1: { ins: true,  inv: false, ret: true,  adv: true,  aum: undefined,  gaps: ['Investments', 'Disability'] },
  2: { ins: true,  inv: false, ret: false, adv: false, aum: undefined,  gaps: ['Investments', 'Retirement', 'Advisory', 'Disability'] },
  3: { ins: true,  inv: true,  ret: false, adv: true,  aum: '$180K',    gaps: ['Retirement'] },
  4: { ins: true,  inv: false, ret: false, adv: false, aum: undefined,  gaps: ['Investments', 'Retirement', 'Advisory'] },
  5: { ins: true,  inv: false, ret: false, adv: false, aum: undefined,  gaps: ['Investments', 'Retirement', '529 Plan'] },
  6: { ins: true,  inv: true,  ret: true,  adv: false, aum: '$95K',     gaps: ['Advisory / Estate'] },
  7: { ins: true,  inv: false, ret: false, adv: false, aum: undefined,  gaps: ['Multiple — new client'] },
  8: { ins: true,  inv: true,  ret: true,  adv: true,  aum: '$280K',    gaps: [] },
}

function ClientsPage() {
  return (
    <div class="page clients-page">

      {/* ── Product Type Filter Tabs ── */}
      <div class="client-product-tabs">
        <button class="cpt-tab active" onclick="filterClientsByProductTab('all', this)">
          <i class="fas fa-users"></i>
          <div class="cpt-tab-content">
            <span class="cpt-count">247</span>
            <span class="cpt-label">All Clients</span>
          </div>
        </button>
        <button class="cpt-tab ins-tab" onclick="filterClientsByProductTab('insurance', this)">
          <i class="fas fa-shield-alt"></i>
          <div class="cpt-tab-content">
            <span class="cpt-count">247</span>
            <span class="cpt-label">Insurance</span>
            <span class="cpt-sub">1,842 policies</span>
          </div>
        </button>
        <button class="cpt-tab inv-tab" onclick="filterClientsByProductTab('investments', this)">
          <i class="fas fa-chart-line"></i>
          <div class="cpt-tab-content">
            <span class="cpt-count">62</span>
            <span class="cpt-label">Investments</span>
            <span class="cpt-sub">$4.2M AUM</span>
          </div>
        </button>
        <button class="cpt-tab ret-tab" onclick="filterClientsByProductTab('retirement', this)">
          <i class="fas fa-umbrella-beach"></i>
          <div class="cpt-tab-content">
            <span class="cpt-count">38</span>
            <span class="cpt-label">Retirement</span>
            <span class="cpt-sub">$1.8M assets</span>
          </div>
        </button>
        <button class="cpt-tab adv-tab" onclick="filterClientsByProductTab('advisory', this)">
          <i class="fas fa-handshake"></i>
          <div class="cpt-tab-content">
            <span class="cpt-count">59</span>
            <span class="cpt-label">Advisory</span>
            <span class="cpt-sub">$2.1M managed</span>
          </div>
        </button>
        <button class="cpt-tab gaps-tab" onclick="filterClientsByProductTab('gaps', this)">
          <i class="fas fa-exclamation-circle"></i>
          <div class="cpt-tab-content">
            <span class="cpt-count">128</span>
            <span class="cpt-label">Has Gaps</span>
            <span class="cpt-sub">$31.2K potential</span>
          </div>
        </button>
        <button class="cpt-tab lapse-tab" onclick="filterClientsByProductTab('lapse', this)">
          <i class="fas fa-exclamation-triangle"></i>
          <div class="cpt-tab-content">
            <span class="cpt-count">15</span>
            <span class="cpt-label">Lapse Risk</span>
            <span class="cpt-sub">4 high · 11 med</span>
          </div>
        </button>
      </div>

      {/* ── Retention Intelligence Panel (shown when lapse tab active) ── */}
      <div class="ri-clients-panel" id="ri-clients-panel" style="display:none">
        <div class="ri-panel-header">
          <div class="ri-panel-title"><i class="fas fa-shield-alt"></i> Retention Intelligence — 15 At-Risk Clients</div>
          <div class="ri-panel-stats">
            <span class="ri-pstat high"><i class="fas fa-circle"></i> 4 High Risk</span>
            <span class="ri-pstat med"><i class="fas fa-circle"></i> 11 Medium Risk</span>
            <span class="ri-pstat">AI Last Scan: 2 min ago</span>
          </div>
        </div>
        <div class="ri-panel-table">
          <div class="ri-table-header">
            <span>Client</span><span>Risk Level</span><span>Primary Trigger</span><span>Policy</span><span>Days Left</span><span>Action</span>
          </div>
          <div class="ri-table-row high" onclick="openRetentionModal('ret-patricia')">
            <div class="ri-tc-client"><div class="mini-avatar pn">PN</div>Patricia Nguyen</div>
            <div><span class="ri-level-badge high">HIGH · 87</span></div>
            <div class="ri-tc-trigger"><i class="fas fa-battery-quarter"></i> UL Under-funded (2 qtrs)</div>
            <div class="ri-tc-policy">P-100301 · Universal Life</div>
            <div class="ri-tc-days high">~68 days</div>
            <button class="ri-tbl-btn" onclick="event.stopPropagation();openRetentionModal('ret-patricia')"><i class="fas fa-bolt"></i> Take Action</button>
          </div>
          <div class="ri-table-row high" onclick="openRetentionModal('ret-sandra')">
            <div class="ri-tc-client"><div class="mini-avatar sw">SW</div>Sandra Williams</div>
            <div><span class="ri-level-badge high">HIGH · 79</span></div>
            <div class="ri-tc-trigger"><i class="fas fa-calendar-times"></i> Term Renewal Expiring</div>
            <div class="ri-tc-policy">P-100320 · Term Life $350K</div>
            <div class="ri-tc-days high">153 days</div>
            <button class="ri-tbl-btn" onclick="event.stopPropagation();openRetentionModal('ret-sandra')"><i class="fas fa-bolt"></i> Take Action</button>
          </div>
          <div class="ri-table-row high" onclick="openRetentionModal('ret-kevin')">
            <div class="ri-tc-client"><div class="mini-avatar kp">KP</div>Kevin Park</div>
            <div><span class="ri-level-badge high">HIGH · 72</span></div>
            <div class="ri-tc-trigger"><i class="fas fa-user-clock"></i> Death Claim — Policy Pending</div>
            <div class="ri-tc-policy">P-100350 · Term Life $250K</div>
            <div class="ri-tc-days high">Urgent</div>
            <button class="ri-tbl-btn" onclick="event.stopPropagation();openRetentionModal('ret-kevin')"><i class="fas fa-bolt"></i> Take Action</button>
          </div>
          <div class="ri-table-row med" onclick="openRetentionModal('ret-david')">
            <div class="ri-tc-client"><div class="mini-avatar dt">DT</div>David Thompson</div>
            <div><span class="ri-level-badge med">MED · 54</span></div>
            <div class="ri-tc-trigger"><i class="fas fa-shield-alt"></i> Single Policy · Under-insured</div>
            <div class="ri-tc-policy">P-100380 · Term Life $300K</div>
            <div class="ri-tc-days">—</div>
            <button class="ri-tbl-btn med" onclick="event.stopPropagation();openRetentionModal('ret-david')"><i class="fas fa-phone"></i> Contact</button>
          </div>
          <div class="ri-table-row med" onclick="openRetentionModal('ret-james')">
            <div class="ri-tc-client"><div class="mini-avatar jw">JW</div>James Whitfield</div>
            <div><span class="ri-level-badge med">MED · 48</span></div>
            <div class="ri-tc-trigger"><i class="fas fa-coins"></i> LTC Gap — Daily Benefit Insufficient</div>
            <div class="ri-tc-policy">P-100293 · LTC $200/day</div>
            <div class="ri-tc-days">Next renewal</div>
            <button class="ri-tbl-btn med" onclick="event.stopPropagation();openRetentionModal('ret-james')"><i class="fas fa-phone"></i> Contact</button>
          </div>
        </div>
        <div class="ri-panel-footer">
          <span style="font-size:11px;color:#6b7280">Showing 5 of 15 at-risk clients · AI monitors all 247 clients continuously</span>
          <button class="btn btn-ai" style="font-size:11px;padding:6px 12px" onclick="sendContextMessage('Show all lapse-risk clients — retention action plan ranked by premium at risk and probability of lapse','renewal')"><i class="fas fa-robot"></i> Full AI Retention Analysis</button>
        </div>
      </div>

      {/* ── Outreach Hub Panel ── */}
      <div class="outreach-hub" id="outreach-hub">
        <div class="oh-header">
          <div class="oh-header-left">
            <div class="oh-icon"><i class="fas fa-paper-plane"></i><span class="ai-pulse-ring"></span></div>
            <div>
              <div class="oh-title">AI Outreach Hub <span class="oh-live-badge">LIVE</span></div>
              <div class="oh-subtitle">AI-ranked queue · 10 clients prioritized by revenue opportunity, lapse risk &amp; life events</div>
            </div>
          </div>
          <div class="oh-header-right">
            <div class="oh-stat"><span class="oh-stat-val">10</span><span class="oh-stat-lbl">In Queue</span></div>
            <div class="oh-stat"><span class="oh-stat-val green">3</span><span class="oh-stat-lbl">Urgent</span></div>
            <div class="oh-stat"><span class="oh-stat-val amber">4</span><span class="oh-stat-lbl">This Week</span></div>
            <div class="oh-stat"><span class="oh-stat-val">$41.2K</span><span class="oh-stat-lbl">Revenue Potential</span></div>
            <button class="oh-collapse-btn" onclick="toggleOutreachHub()"><i class="fas fa-chevron-up" id="oh-chevron"></i></button>
          </div>
        </div>

        <div class="oh-body" id="oh-body">
          <div class="oh-table">
            <div class="oh-table-header">
              <span>Priority</span>
              <span>Client</span>
              <span>Trigger</span>
              <span>Outreach Type</span>
              <span>Channel</span>
              <span>Revenue Potential</span>
              <span>Action</span>
            </div>

            {/* Row 1 */}
            <div class="oh-row oh-urgent" onclick="openOutreachModal('OR-001')">
              <div class="oh-priority"><span class="oh-rank urgent">1</span></div>
              <div class="oh-client-cell"><div class="mini-avatar pn">PN</div><div><div class="oh-cname">Patricia Nguyen</div><div class="oh-csub">Mid Market · UL + VUL</div></div></div>
              <div class="oh-trigger"><span class="oh-trigger-badge lapse"><i class="fas fa-exclamation-triangle"></i> Lapse Risk · 94% probability</span></div>
              <div><span class="oh-type-badge retention">Retention Save</span></div>
              <div><span class="oh-channel email"><i class="fas fa-envelope"></i> Email</span></div>
              <div class="oh-rev green">$5,800/yr</div>
              <div><button class="oh-gen-btn" onclick="event.stopPropagation();openOutreachModal('OR-001')"><i class="fas fa-robot"></i> Generate</button></div>
            </div>

            {/* Row 2 */}
            <div class="oh-row oh-urgent" onclick="openOutreachModal('OR-002')">
              <div class="oh-priority"><span class="oh-rank urgent">2</span></div>
              <div class="oh-client-cell"><div class="mini-avatar sw">SW</div><div><div class="oh-cname">Sandra Williams</div><div class="oh-csub">Mid Market · Term expiring 153d</div></div></div>
              <div class="oh-trigger"><span class="oh-trigger-badge renewal"><i class="fas fa-calendar-alt"></i> Term Renewal · 153 days</span></div>
              <div><span class="oh-type-badge upsell">Conversion Upsell</span></div>
              <div><span class="oh-channel email"><i class="fas fa-envelope"></i> Email + SMS</span></div>
              <div class="oh-rev green">$8,200/yr</div>
              <div><button class="oh-gen-btn" onclick="event.stopPropagation();openOutreachModal('OR-002')"><i class="fas fa-robot"></i> Generate</button></div>
            </div>

            {/* Row 3 */}
            <div class="oh-row oh-urgent" onclick="openOutreachModal('OR-003')">
              <div class="oh-priority"><span class="oh-rank urgent">3</span></div>
              <div class="oh-client-cell"><div class="mini-avatar kp">KP</div><div><div class="oh-cname">Kevin Park</div><div class="oh-csub">Emerging · Term pending</div></div></div>
              <div class="oh-trigger"><span class="oh-trigger-badge lifecycle"><i class="fas fa-signature"></i> E-Signature Pending · 2 days</span></div>
              <div><span class="oh-type-badge close">Close Deal</span></div>
              <div><span class="oh-channel sms"><i class="fas fa-sms"></i> SMS</span></div>
              <div class="oh-rev green">$1,800/yr</div>
              <div><button class="oh-gen-btn" onclick="event.stopPropagation();openOutreachModal('OR-003')"><i class="fas fa-robot"></i> Generate</button></div>
            </div>

            {/* Row 4 */}
            <div class="oh-row" onclick="openOutreachModal('OR-004')">
              <div class="oh-priority"><span class="oh-rank high">4</span></div>
              <div class="oh-client-cell"><div class="mini-avatar lm">LM</div><div><div class="oh-cname">Linda Morrison</div><div class="oh-csub">Premium · $812K portfolio</div></div></div>
              <div class="oh-trigger"><span class="oh-trigger-badge portfolio"><i class="fas fa-chart-line"></i> UMA Transfer + Estate Review</span></div>
              <div><span class="oh-type-badge cross-sell">Cross-Sell</span></div>
              <div><span class="oh-channel email"><i class="fas fa-envelope"></i> Email</span></div>
              <div class="oh-rev green">$2,800/yr fee</div>
              <div><button class="oh-gen-btn" onclick="event.stopPropagation();openOutreachModal('OR-004')"><i class="fas fa-robot"></i> Generate</button></div>
            </div>

            {/* Row 5 */}
            <div class="oh-row" onclick="openOutreachModal('OR-005')">
              <div class="oh-priority"><span class="oh-rank high">5</span></div>
              <div class="oh-client-cell"><div class="mini-avatar rc">RC</div><div><div class="oh-cname">Robert Chen</div><div class="oh-csub">High Value · Business owner</div></div></div>
              <div class="oh-trigger"><span class="oh-trigger-badge portfolio"><i class="fas fa-briefcase"></i> Estate Plan + NQDC Review Due</span></div>
              <div><span class="oh-type-badge advisory">Advisory</span></div>
              <div><span class="oh-channel call"><i class="fas fa-phone"></i> Call</span></div>
              <div class="oh-rev green">$2,000/yr</div>
              <div><button class="oh-gen-btn" onclick="event.stopPropagation();openOutreachModal('OR-005')"><i class="fas fa-robot"></i> Generate</button></div>
            </div>

            {/* Row 6 */}
            <div class="oh-row" onclick="openOutreachModal('OR-006')">
              <div class="oh-priority"><span class="oh-rank mid">6</span></div>
              <div class="oh-client-cell"><div class="mini-avatar jw">JW</div><div><div class="oh-cname">James Whitfield</div><div class="oh-csub">High Value · Retirement gap</div></div></div>
              <div class="oh-trigger"><span class="oh-trigger-badge lifecycle"><i class="fas fa-umbrella-beach"></i> Retirement Income Gap $8,500/mo</span></div>
              <div><span class="oh-type-badge retirement">Retirement</span></div>
              <div><span class="oh-channel email"><i class="fas fa-envelope"></i> Email</span></div>
              <div class="oh-rev green">$4,800/yr</div>
              <div><button class="oh-gen-btn" onclick="event.stopPropagation();openOutreachModal('OR-006')"><i class="fas fa-robot"></i> Generate</button></div>
            </div>

            {/* Row 7 */}
            <div class="oh-row" onclick="openOutreachModal('OR-007')">
              <div class="oh-priority"><span class="oh-rank mid">7</span></div>
              <div class="oh-client-cell"><div class="mini-avatar mg">MG</div><div><div class="oh-cname">Maria Gonzalez</div><div class="oh-csub">High Value · No Advisory</div></div></div>
              <div class="oh-trigger"><span class="oh-trigger-badge gap"><i class="fas fa-exclamation-circle"></i> No Advisory Services — Gap Detected</span></div>
              <div><span class="oh-type-badge cross-sell">Cross-Sell</span></div>
              <div><span class="oh-channel email"><i class="fas fa-envelope"></i> Email</span></div>
              <div class="oh-rev green">$2,400/yr</div>
              <div><button class="oh-gen-btn" onclick="event.stopPropagation();openOutreachModal('OR-007')"><i class="fas fa-robot"></i> Generate</button></div>
            </div>

            {/* Row 8 */}
            <div class="oh-row" onclick="openOutreachModal('OR-008')">
              <div class="oh-priority"><span class="oh-rank mid">8</span></div>
              <div class="oh-client-cell"><div class="mini-avatar dt">DT</div><div><div class="oh-cname">David Thompson</div><div class="oh-csub">Emerging · Single policy only</div></div></div>
              <div class="oh-trigger"><span class="oh-trigger-badge gap"><i class="fas fa-plus-circle"></i> No Investments or Retirement</span></div>
              <div><span class="oh-type-badge upsell">Upsell</span></div>
              <div><span class="oh-channel sms"><i class="fas fa-sms"></i> SMS</span></div>
              <div class="oh-rev amber">$1,200/yr</div>
              <div><button class="oh-gen-btn" onclick="event.stopPropagation();openOutreachModal('OR-008')"><i class="fas fa-robot"></i> Generate</button></div>
            </div>

            {/* Row 9 */}
            <div class="oh-row" onclick="openOutreachModal('OR-009')">
              <div class="oh-priority"><span class="oh-rank low">9</span></div>
              <div class="oh-client-cell"><div class="mini-avatar rc">RC</div><div><div class="oh-cname">Alex Rivera</div><div class="oh-csub">Prospect · WL $500K</div></div></div>
              <div class="oh-trigger"><span class="oh-trigger-badge lifecycle"><i class="fas fa-calendar-check"></i> Meeting Apr 12 — Pre-brief ready</span></div>
              <div><span class="oh-type-badge close">Meeting Prep</span></div>
              <div><span class="oh-channel email"><i class="fas fa-envelope"></i> Email</span></div>
              <div class="oh-rev amber">$4,800/yr</div>
              <div><button class="oh-gen-btn" onclick="event.stopPropagation();openOutreachModal('OR-009')"><i class="fas fa-robot"></i> Generate</button></div>
            </div>

            {/* Row 10 */}
            <div class="oh-row" onclick="openOutreachModal('OR-010')">
              <div class="oh-priority"><span class="oh-rank low">10</span></div>
              <div class="oh-client-cell"><div class="mini-avatar ms">MS</div><div><div class="oh-cname">Michael Santos</div><div class="oh-csub">Prospect · UL $750K hot deal</div></div></div>
              <div class="oh-trigger"><span class="oh-trigger-badge portfolio"><i class="fas fa-fire"></i> Lab Results Apr 14 — Follow-up</span></div>
              <div><span class="oh-type-badge close">Close Deal</span></div>
              <div><span class="oh-channel call"><i class="fas fa-phone"></i> Call + Email</span></div>
              <div class="oh-rev amber">$6,400/yr</div>
              <div><button class="oh-gen-btn" onclick="event.stopPropagation();openOutreachModal('OR-010')"><i class="fas fa-robot"></i> Generate</button></div>
            </div>

          </div>{/* end oh-table */}

          <div class="oh-footer">
            <button class="oh-ai-btn" onclick="sendContextMessage('AI Outreach Optimizer — show all 10 prioritized clients with personalized outreach strategy, timing, and revenue impact for each','smart-advisor')">
              <i class="fas fa-robot"></i> Full AI Outreach Strategy
            </button>
            <button class="oh-ai-btn oh-ai-btn-secondary" onclick="sendContextMessage('Generate bulk outreach campaign for all lapse-risk clients — Patricia Nguyen, Sandra Williams, Kevin Park — with urgency messaging','renewal')">
              <i class="fas fa-broadcast-tower"></i> Bulk Lapse Risk Campaign
            </button>
          </div>
        </div>{/* end oh-body */}
      </div>{/* end outreach-hub */}

      {/* ── Toolbar ── */}
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
          <select class="filter-select" id="domain-filter" onchange="filterByDomain(this.value)">
            <option value="">All Services</option>
            <option value="insurance">Has Insurance</option>
            <option value="investments">Has Investments</option>
            <option value="retirement">Has Retirement</option>
            <option value="advisory">Has Advisory</option>
            <option value="gaps">Has Gaps</option>
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

      {/* ── Client Cards with Product Holdings ── */}
      <div class="clients-grid" id="clients-grid">
        {mockClients.map(client => {
          const dom = clientDomains[client.id] || { ins: true, inv: false, ret: false, adv: false, gaps: [] }
          const prods = clientProducts[client.id] || { insurance: [], investments: [], retirement: [], advisory: [] }
          const initials = client.name.split(' ').map((n:string) => n[0]).join('')
          const avatarKey = initials.toLowerCase()
          const lapseRiskMap: Record<number,{level:string,score:number,retId:string}> = {
            2: { level:'high', score:87, retId:'ret-patricia' },
            4: { level:'high', score:79, retId:'ret-sandra'  },
            7: { level:'high', score:72, retId:'ret-kevin'   },
            5: { level:'med',  score:54, retId:'ret-david'   },
            1: { level:'med',  score:48, retId:'ret-james'   },
          }
          const lapseInfo = lapseRiskMap[client.id]
          return (
            <div class={`client-card segment-${client.segment.replace(' ', '-').toLowerCase()}${lapseInfo ? ' has-lapse-risk' : ''}`} data-lapse={lapseInfo ? lapseInfo.level : ''}>

              {/* ── Card Header ── */}
              <div class="client-card-header" onclick={`toggleClientProducts(${client.id})`} style="cursor:pointer">
                <div class={`client-avatar-lg ca-${avatarKey}`}>{initials}</div>
                <div class="client-card-info">
                  <h4>{client.name}</h4>
                  <p>{client.city} · Age {client.age}</p>
                  <span class={`segment-tag seg-${client.segment.replace(' ', '-').toLowerCase()}`}>{client.segment}</span>
                </div>
                {lapseInfo && <div class={`cc-lapse-badge ${lapseInfo.level}`} title="Lapse Risk"><i class="fas fa-exclamation-triangle"></i> {lapseInfo.level === 'high' ? 'HIGH' : 'MED'} {lapseInfo.score}</div>}
                <div class="client-score-circle"><span>{client.score}</span></div>
                <i class="fas fa-chevron-down client-expand-icon" id={`expand-icon-${client.id}`}></i>
              </div>

              {/* ── Domain Coverage Pills ── */}
              <div class="client-domain-row">
                <div class={`cdomain-pill ${dom.ins ? 'active-ins' : 'inactive'}`} title="Insurance">
                  <i class="fas fa-shield-alt"></i> Ins
                </div>
                <div class={`cdomain-pill ${dom.inv ? 'active-inv' : 'inactive'}`} title="Investments">
                  <i class="fas fa-chart-line"></i> Inv
                </div>
                <div class={`cdomain-pill ${dom.ret ? 'active-ret' : 'inactive'}`} title="Retirement">
                  <i class="fas fa-umbrella-beach"></i> Ret
                </div>
                <div class={`cdomain-pill ${dom.adv ? 'active-adv' : 'inactive'}`} title="Advisory">
                  <i class="fas fa-handshake"></i> Adv
                </div>
                {dom.aum && <div class="cdomain-aum"><i class="fas fa-coins"></i> {dom.aum}</div>}
              </div>

              {/* ── Key Stats ── */}
              <div class="client-card-stats">
                <div class="cs-stat">
                  <span class="cs-val">{prods.insurance.length + prods.investments.length + prods.retirement.length + prods.advisory.length}</span>
                  <span class="cs-lbl">Products</span>
                </div>
                <div class="cs-stat">
                  <span class="cs-val">${(client.premium/1000).toFixed(1)}K</span>
                  <span class="cs-lbl">Ins Premium</span>
                </div>
                <div class="cs-stat">
                  <span class={`status-dot ${client.status.toLowerCase()}`}></span>
                  <span class="cs-lbl">{client.status}</span>
                </div>
              </div>

              {/* ── Gaps Row ── */}
              {dom.gaps.length > 0 && (
                <div class="client-gaps-row">
                  <i class="fas fa-exclamation-circle" style="color:#d97706;font-size:11px"></i>
                  <span class="gaps-label">Gaps: {dom.gaps.slice(0,2).join(' · ')}{dom.gaps.length > 2 ? ` +${dom.gaps.length-2}` : ''}</span>
                </div>
              )}

              {/* ── Expandable Product Holdings ── */}
              <div class="client-products-panel" id={`products-panel-${client.id}`} style="display:none">

                {/* Insurance Products */}
                {prods.insurance.length > 0 && (
                  <div class="cp-domain-section">
                    <div class="cp-domain-header ins-header">
                      <i class="fas fa-shield-alt"></i> Insurance Products
                      <span class="cp-count">{prods.insurance.length}</span>
                    </div>
                    {prods.insurance.map(p => (
                      <div class="cp-product-row">
                        <div class="cp-prod-icon ins-bg"><i class="fas fa-file-contract"></i></div>
                        <div class="cp-prod-info">
                          <div class="cp-prod-name">{p.product} <span class="cp-prod-type">{p.type}</span></div>
                          <div class="cp-prod-meta">{p.id} · Since {p.since}</div>
                        </div>
                        <div class="cp-prod-vals">
                          <div class="cp-val">${(p.premium/1000).toFixed(1)}K<span class="cp-val-lbl">/yr</span></div>
                          <div class="cp-sub">{p.faceValue} face</div>
                        </div>
                        <span class={`cp-status-badge ${p.status.toLowerCase()}`}>{p.status}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Investment Products */}
                {prods.investments.length > 0 ? (
                  <div class="cp-domain-section">
                    <div class="cp-domain-header inv-header">
                      <i class="fas fa-chart-line"></i> Investment Products
                      <span class="cp-count">{prods.investments.length}</span>
                    </div>
                    {prods.investments.map(p => (
                      <div class="cp-product-row">
                        <div class="cp-prod-icon inv-bg"><i class="fas fa-coins"></i></div>
                        <div class="cp-prod-info">
                          <div class="cp-prod-name">{p.product} <span class="cp-prod-type">{p.type}</span></div>
                          <div class="cp-prod-meta">{p.id} · Since {p.since}</div>
                        </div>
                        <div class="cp-prod-vals">
                          <div class="cp-val">{p.value}</div>
                          <div class="cp-sub" style="color:#059669">{p.return}</div>
                        </div>
                        <span class={`cp-status-badge ${p.status.toLowerCase()}`}>{p.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div class="cp-gap-notice inv-gap">
                    <i class="fas fa-chart-line"></i>
                    <span>No Investment products · <strong>Opportunity</strong></span>
                    <button class="cp-gap-btn" onclick={`navigateTo('products')`}>Explore Products</button>
                  </div>
                )}

                {/* Retirement Products */}
                {prods.retirement.length > 0 ? (
                  <div class="cp-domain-section">
                    <div class="cp-domain-header ret-header">
                      <i class="fas fa-umbrella-beach"></i> Retirement Products
                      <span class="cp-count">{prods.retirement.length}</span>
                    </div>
                    {prods.retirement.map(p => (
                      <div class="cp-product-row">
                        <div class="cp-prod-icon ret-bg"><i class="fas fa-umbrella-beach"></i></div>
                        <div class="cp-prod-info">
                          <div class="cp-prod-name">{p.product} <span class="cp-prod-type">{p.type}</span></div>
                          <div class="cp-prod-meta">{p.id} · Since {p.since}</div>
                        </div>
                        <div class="cp-prod-vals">
                          <div class="cp-val">{p.value}</div>
                          <div class="cp-sub">{p.income}</div>
                        </div>
                        <span class={`cp-status-badge ${p.status.toLowerCase()}`}>{p.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div class="cp-gap-notice ret-gap">
                    <i class="fas fa-umbrella-beach"></i>
                    <span>No Retirement products · <strong>Opportunity</strong></span>
                    <button class="cp-gap-btn" onclick={`navigateTo('products')`}>Explore Products</button>
                  </div>
                )}

                {/* Advisory Products */}
                {prods.advisory.length > 0 ? (
                  <div class="cp-domain-section">
                    <div class="cp-domain-header adv-header">
                      <i class="fas fa-handshake"></i> Advisory Services
                      <span class="cp-count">{prods.advisory.length}</span>
                    </div>
                    {prods.advisory.map(p => (
                      <div class="cp-product-row">
                        <div class="cp-prod-icon adv-bg"><i class="fas fa-landmark"></i></div>
                        <div class="cp-prod-info">
                          <div class="cp-prod-name">{p.product} <span class="cp-prod-type">{p.type}</span></div>
                          <div class="cp-prod-meta">{p.id} · Since {p.since}</div>
                        </div>
                        <div class="cp-prod-vals">
                          <div class="cp-val">{p.value}</div>
                          <div class="cp-sub">{p.fee} fee</div>
                        </div>
                        <span class={`cp-status-badge ${p.status.toLowerCase()}`}>{p.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div class="cp-gap-notice adv-gap">
                    <i class="fas fa-handshake"></i>
                    <span>No Advisory services · <strong>Opportunity</strong></span>
                    <button class="cp-gap-btn" onclick={`navigateTo('products')`}>Explore Products</button>
                  </div>
                )}

                <div class="cp-panel-footer">
                  <button class="btn btn-ai" onclick={`event.stopPropagation(); aiAnalyzeClient(${client.id})`}><i class="fas fa-robot"></i> AI Product Recommendation</button>
                  <button class="btn btn-outline-sm" onclick="navigateTo('products')"><i class="fas fa-box-open"></i> Browse Products</button>
                </div>
              </div>

              {/* ── Footer ── */}
              <div class="client-card-footer">
                <span><i class="fas fa-clock"></i> {client.lastContact}</span>
                <button class="btn-icon" title="Call" onclick="event.stopPropagation()"><i class="fas fa-phone"></i></button>
                <button class="btn-icon" title="Email" onclick="event.stopPropagation()"><i class="fas fa-envelope"></i></button>
                <button class="btn-icon outreach-btn" title="Generate AI Outreach Message" onclick={`event.stopPropagation(); openOutreachModalForClient(${client.id})`}><i class="fas fa-paper-plane"></i></button>
                {lapseInfo
                  ? <button class="btn-icon retention-btn" title="Retention Action" onclick={`event.stopPropagation(); openRetentionModal('${lapseInfo.retId}')`}><i class="fas fa-shield-alt"></i></button>
                  : <button class="btn-icon ai-btn" title="AI Analysis" onclick={`event.stopPropagation(); aiAnalyzeClient(${client.id})`}><i class="fas fa-robot"></i></button>
                }
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Outreach Composer Modal ── */}
      <div class="oc-overlay" id="oc-overlay" onclick="closeOutreachModal(event)" style="display:none">
        <div class="oc-modal">

          {/* Header */}
          <div class="oc-header" id="oc-header">
            <div class="oc-header-left">
              <div class="oc-header-icon"><i class="fas fa-paper-plane"></i></div>
              <div>
                <div class="oc-header-title" id="oc-header-title">AI Outreach Composer</div>
                <div class="oc-header-sub" id="oc-header-sub">Hyperpersonalized message · AI-generated</div>
              </div>
            </div>
            <button class="oc-close-btn" onclick="closeOutreachModal()"><i class="fas fa-times"></i></button>
          </div>

          {/* Channel Tabs */}
          <div class="oc-channel-tabs">
            <button class="oc-ch-tab active" id="tab-email" onclick="switchOutreachChannel('email')"><i class="fas fa-envelope"></i> Email</button>
            <button class="oc-ch-tab" id="tab-sms" onclick="switchOutreachChannel('sms')"><i class="fas fa-sms"></i> SMS</button>
            <button class="oc-ch-tab" id="tab-call" onclick="switchOutreachChannel('call')"><i class="fas fa-phone"></i> Call Script</button>
          </div>

          {/* Body — two columns: message + context */}
          <div class="oc-body">

            {/* Left: Message Composer */}
            <div class="oc-composer">
              <div class="oc-field-row">
                <label class="oc-label">To</label>
                <input class="oc-input" id="oc-to" type="text" readonly />
              </div>
              <div class="oc-field-row" id="oc-subject-row">
                <label class="oc-label">Subject</label>
                <input class="oc-input" id="oc-subject" type="text" />
              </div>
              <div class="oc-field-row">
                <label class="oc-label">Message <span class="oc-ai-tag"><i class="fas fa-robot"></i> AI-drafted</span></label>
                <textarea class="oc-textarea" id="oc-body" rows={12}></textarea>
              </div>
              <div class="oc-token-bar">
                <span class="oc-token-lbl">Insert token:</span>
                <button class="oc-token" onclick="insertToken('[Client Name]')">[Client Name]</button>
                <button class="oc-token" onclick="insertToken('[Agent Name]')">[Agent Name]</button>
                <button class="oc-token" onclick="insertToken('[Policy #]')">[Policy #]</button>
                <button class="oc-token" onclick="insertToken('[Product]')">[Product]</button>
                <button class="oc-token" onclick="insertToken('[Premium]')">[Premium]</button>
                <button class="oc-token" onclick="insertToken('[Date]')">[Date]</button>
              </div>
            </div>

            {/* Right: Context Panel */}
            <div class="oc-context">
              <div class="oc-ctx-section">
                <div class="oc-ctx-title"><i class="fas fa-user"></i> Client Context</div>
                <div class="oc-ctx-body" id="oc-ctx-client"></div>
              </div>
              <div class="oc-ctx-section">
                <div class="oc-ctx-title"><i class="fas fa-robot"></i> AI Rationale</div>
                <div class="oc-ctx-body oc-ctx-ai" id="oc-ctx-ai"></div>
              </div>
              <div class="oc-ctx-section">
                <div class="oc-ctx-title"><i class="fas fa-bullseye"></i> Goal &amp; Tone</div>
                <div class="oc-ctx-body" id="oc-ctx-goal"></div>
              </div>
              <div class="oc-regen-section">
                <button class="oc-regen-btn" onclick="regenOutreachMessage()"><i class="fas fa-sync-alt"></i> Regenerate</button>
                <select class="oc-tone-select" id="oc-tone" onchange="regenOutreachMessage()">
                  <option value="professional">Professional</option>
                  <option value="warm">Warm &amp; Personal</option>
                  <option value="urgent">Urgent</option>
                  <option value="educational">Educational</option>
                </select>
              </div>
            </div>

          </div>{/* end oc-body */}

          {/* Footer Actions */}
          <div class="oc-footer">
            <div class="oc-footer-left">
              <button class="oc-btn-secondary" onclick="closeOutreachModal()"><i class="fas fa-times"></i> Cancel</button>
            </div>
            <div class="oc-footer-right">
              <button class="oc-btn-schedule" onclick="scheduleOutreach()"><i class="fas fa-calendar-alt"></i> Schedule</button>
              <button class="oc-btn-ai" onclick="askAIOutreach()"><i class="fas fa-robot"></i> Ask AI Agent</button>
              <button class="oc-btn-send" onclick="sendOutreach()"><i class="fas fa-paper-plane"></i> Send Now</button>
            </div>
          </div>

        </div>{/* end oc-modal */}
      </div>{/* end oc-overlay */}

      {/* Client Detail Modal */}
      <div class="modal-overlay" id="client-modal" onclick="closeClientModal()">
        <div class="modal-box" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3 id="modal-client-name">Client Details</h3>
            <button class="modal-close" onclick="closeClientModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body" id="modal-client-body"></div>
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
          <button class="btn btn-ai" onclick="openNLPReview('all')">
            <i class="fas fa-brain"></i> NLP Policy Scan
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-plus"></i> New Policy
          </button>
        </div>
      </div>

      {/* ── NLP Policy Review & Risk Expert Banner ── */}
      <div class="nlp-banner">
        <div class="nlp-banner-left">
          <div class="nlp-banner-icon">
            <i class="fas fa-brain"></i>
            <span class="nlp-pulse"></span>
          </div>
          <div class="nlp-banner-text">
            <div class="nlp-banner-title">NLP Policy Review &amp; Risk Expert <span class="nlp-live-badge">LIVE</span></div>
            <div class="nlp-banner-sub">AI reads every policy clause · flags exclusions, ambiguities &amp; regulatory risks · plain-language summaries</div>
          </div>
        </div>
        <div class="nlp-banner-stats">
          <div class="nlp-stat">
            <span class="nlp-stat-val red">2</span>
            <span class="nlp-stat-lbl">Urgent Risks</span>
          </div>
          <div class="nlp-stat">
            <span class="nlp-stat-val orange">3</span>
            <span class="nlp-stat-lbl">Clauses Flagged</span>
          </div>
          <div class="nlp-stat">
            <span class="nlp-stat-val blue">8</span>
            <span class="nlp-stat-lbl">Policies Scanned</span>
          </div>
          <div class="nlp-stat">
            <span class="nlp-stat-val green">94%</span>
            <span class="nlp-stat-lbl">NLP Accuracy</span>
          </div>
        </div>
        <div class="nlp-banner-actions">
          <button class="nlp-btn-scan" onclick="openNLPReview('all')"><i class="fas fa-search-plus"></i> Full Portfolio Scan</button>
          <button class="nlp-btn-risk" onclick="openNLPReview('risk')"><i class="fas fa-exclamation-triangle"></i> Risk Report</button>
        </div>
      </div>

      {/* ── Retention Intelligence & Lapse Prevention Banner ── */}
      <div class="ri-banner">
        <div class="ri-banner-left">
          <div class="ri-banner-icon">
            <i class="fas fa-heartbeat"></i>
            <span class="ri-pulse"></span>
          </div>
          <div class="ri-banner-text">
            <div class="ri-banner-title">Retention Intelligence &amp; Lapse Prevention Engine <span class="ri-live-badge">LIVE</span></div>
            <div class="ri-banner-sub">AI monitors cash values, renewal windows &amp; coverage gaps · predicts lapse 60–90 days early · generates personalised save scripts</div>
          </div>
        </div>
        <div class="ri-banner-stats">
          <div class="ri-bstat">
            <span class="ri-bstat-val red">2</span>
            <span class="ri-bstat-lbl">Urgent Lapses</span>
          </div>
          <div class="ri-bstat">
            <span class="ri-bstat-val orange">4</span>
            <span class="ri-bstat-lbl">High Risk</span>
          </div>
          <div class="ri-bstat">
            <span class="ri-bstat-val gold">23</span>
            <span class="ri-bstat-lbl">Renewals Due</span>
          </div>
          <div class="ri-bstat">
            <span class="ri-bstat-val green">$62.6K</span>
            <span class="ri-bstat-lbl">Premium at Risk</span>
          </div>
        </div>
        <div class="ri-banner-actions">
          <button class="ri-btn-lapse" onclick="openRetentionFullReport()"><i class="fas fa-exclamation-triangle"></i> Lapse Report</button>
          <button class="ri-btn-renewal" onclick="openRenewalCenter()"><i class="fas fa-sync-alt"></i> Renewal Center</button>
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
              <th><i class="fas fa-file-import" style="color:#7c3aed;margin-right:4px"></i>Doc Status</th>
              <th><i class="fas fa-brain" style="color:#7c3aed;margin-right:4px"></i>NLP Risk</th>
              <th><i class="fas fa-heartbeat" style="color:#dc2626;margin-right:4px"></i>Lapse Risk</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockPolicies.map(p => {
              const policyIDPStatus: Record<string,{badge:string,fill:string,cls:string,pct:number}> = {
                'P-100291': {badge:'3/3 Docs',fill:'idp-fill-green',cls:'idp-complete',pct:100},
                'P-100292': {badge:'3/3 Docs',fill:'idp-fill-green',cls:'idp-complete',pct:100},
                'P-100293': {badge:'2/3 Docs',fill:'',cls:'idp-partial',pct:67},
                'P-100301': {badge:'1/3 Docs',fill:'idp-fill-orange',cls:'idp-missing idp-urgent',pct:33},
                'P-100302': {badge:'3/3 Docs',fill:'idp-fill-green',cls:'idp-complete',pct:100},
                'P-100310': {badge:'2/4 Docs',fill:'',cls:'idp-partial',pct:50},
                'P-100320': {badge:'1/2 Docs',fill:'idp-fill-orange',cls:'idp-missing idp-urgent',pct:50},
                'P-100330': {badge:'3/3 Docs',fill:'idp-fill-green',cls:'idp-complete',pct:100},
              };
              const idp = policyIDPStatus[p.id] || {badge:'—',fill:'',cls:'idp-partial',pct:0};
              const nlpRiskMap: Record<string,{score:number,level:string,cls:string,flag:string}> = {
                'P-100291': {score:94,level:'Low',cls:'nlp-low',flag:'Clean — no exclusions flagged'},
                'P-100292': {score:88,level:'Low',cls:'nlp-low',flag:'Term conversion clause clear'},
                'P-100293': {score:72,level:'Medium',cls:'nlp-med',flag:'LTC trigger ambiguity detected'},
                'P-100301': {score:38,level:'Urgent',cls:'nlp-urgent',flag:'⚠ Under-funding lapse clause'},
                'P-100302': {score:81,level:'Low',cls:'nlp-low',flag:'VUL market risk disclosed'},
                'P-100310': {score:76,level:'Medium',cls:'nlp-med',flag:'Contestability window active'},
                'P-100320': {score:44,level:'High',cls:'nlp-high',flag:'⚠ Renewal exclusion — age 61+'},
                'P-100330': {score:97,level:'Low',cls:'nlp-low',flag:'Flagship — all clauses clear'},
              };
              const nlp = nlpRiskMap[p.id] || {score:0,level:'—',cls:'',flag:'Not scanned'};
              const lapseRiskMap: Record<string,{score:number,level:string,cls:string,trigger:string,retId:string}> = {
                'P-100291': {score:22,level:'Low',   cls:'lapse-low',   trigger:'Paid-up status — stable',           retId:'ret-james'},
                'P-100292': {score:18,level:'Low',   cls:'lapse-low',   trigger:'WL flagship — no risk',             retId:''},
                'P-100293': {score:48,level:'Medium',cls:'lapse-med',   trigger:'LTC gap — coverage review',         retId:'ret-james'},
                'P-100301': {score:87,level:'Urgent',cls:'lapse-urgent',trigger:'⚠ Under-funded lapse ~Jun 20',      retId:'ret-patricia'},
                'P-100302': {score:24,level:'Low',   cls:'lapse-low',   trigger:'VUL — market risk only',            retId:''},
                'P-100310': {score:35,level:'Low',   cls:'lapse-low',   trigger:'Contestability — monitor',          retId:''},
                'P-100320': {score:79,level:'High',  cls:'lapse-high',  trigger:'⚠ Term expiry Sep 2026 — 153d',    retId:'ret-sandra'},
                'P-100330': {score:14,level:'Low',   cls:'lapse-low',   trigger:'WL strong — $168K cash value',      retId:''},
              };
              const lapse = lapseRiskMap[p.id] || {score:0,level:'—',cls:'',trigger:'Not scored',retId:''};
              return (
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
                <td><div class="idp-status-cell" onclick={`openIDPModal('${p.id}')`}><span class={`idp-badge ${idp.cls}`}><i class={`fas ${idp.cls.includes('complete') ? 'fa-check-circle' : idp.cls.includes('urgent') ? 'fa-exclamation-circle' : 'fa-file-import'}`}></i> {idp.badge}</span><div class="idp-scan-bar"><div class={`idp-scan-fill ${idp.fill}`} style={`width:${idp.pct}%`}></div></div></div></td>
                <td><div class={`nlp-risk-cell ${nlp.cls}`} onclick={`openNLPReview('${p.id}')`} title={nlp.flag}><span class="nlp-score">{nlp.score}</span><span class="nlp-level-badge">{nlp.level}</span><div class="nlp-flag-tip">{nlp.flag}</div></div></td>
                <td><div class={`lapse-risk-cell ${lapse.cls}`} onclick={lapse.retId ? `openRetentionModal('${lapse.retId}')` : ''} title={lapse.trigger}><span class="lapse-score">{lapse.score}</span><span class="lapse-level-badge">{lapse.level}</span><div class="lapse-trigger-tip">{lapse.trigger}</div></div></td>
                <td>
                  <div class="action-btns">
                    <button class="btn-icon" title="View Details" onclick={`openPolicyModal('${p.id}','view')`}><i class="fas fa-eye"></i></button>
                    <button class="btn-icon" title="Edit Policy"  onclick={`openPolicyModal('${p.id}','edit')`}><i class="fas fa-edit"></i></button>
                    <button class="btn-icon ai-btn" title="NLP Policy Review" onclick={`openNLPReview('${p.id}')`}><i class="fas fa-brain"></i></button>
                    <button class={`btn-icon ${lapse.retId ? 'ri-btn-icon' : ''}`} title="Retention Analysis" onclick={lapse.retId ? `openRetentionModal('${lapse.retId}')` : ''}><i class="fas fa-heartbeat"></i></button>
                  </div>
                </td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>

      {/* ── Renewal Action Center ── */}
      <div class="renewal-action-center" id="renewal-action-center">
        <div class="rac-header">
          <div class="rac-title-wrap">
            <i class="fas fa-sync-alt"></i>
            <div>
              <div class="rac-title">Renewal Action Center <span class="rac-badge">23 Due in 90 Days</span></div>
              <div class="rac-sub">AI-prioritised renewal queue · auto-drafts emails · tracks conversion window</div>
            </div>
          </div>
          <div class="rac-header-right">
            <button class="rac-run-btn" onclick="runRenewalCampaign()"><i class="fas fa-paper-plane"></i> Run Campaign</button>
            <button class="rac-close-btn" onclick="toggleRenewalCenter()"><i class="fas fa-chevron-up"></i></button>
          </div>
        </div>
        <div class="rac-kpi-strip">
          <div class="rac-kpi"><span class="rac-kpi-val red">2</span><span class="rac-kpi-lbl">Urgent (≤30d)</span></div>
          <div class="rac-kpi"><span class="rac-kpi-val orange">8</span><span class="rac-kpi-lbl">High (31–60d)</span></div>
          <div class="rac-kpi"><span class="rac-kpi-val blue">13</span><span class="rac-kpi-lbl">Normal (61–90d)</span></div>
          <div class="rac-kpi"><span class="rac-kpi-val green">65%</span><span class="rac-kpi-lbl">Email Open Rate</span></div>
          <div class="rac-kpi"><span class="rac-kpi-val purple">15/23</span><span class="rac-kpi-lbl">Emails Sent</span></div>
        </div>
        <div class="rac-priority-list">
          <div class="rac-item rac-urgent">
            <div class="rac-priority-badge urgent">URGENT</div>
            <div class="rac-client-info">
              <div class="rac-client-name">Patricia Nguyen</div>
              <div class="rac-policy-info">P-100301 · Universal Life · $5,800/yr</div>
            </div>
            <div class="rac-trigger-info">
              <i class="fas fa-battery-quarter red-icon"></i>
              <span>UL Under-funded — Lapse predicted Jun 20, 2026</span>
            </div>
            <div class="rac-days-badge urgent">Lapse in ~68d</div>
            <button class="rac-action-btn urgent" onclick="openRetentionModal('ret-patricia')"><i class="fas fa-bolt"></i> Act Now</button>
            <button class="rac-email-btn" onclick="draftRetentionEmail('patricia')"><i class="fas fa-envelope"></i> Draft Email</button>
          </div>
          <div class="rac-item rac-urgent">
            <div class="rac-priority-badge urgent">URGENT</div>
            <div class="rac-client-info">
              <div class="rac-client-name">Sandra Williams</div>
              <div class="rac-policy-info">P-100320 · Term Life 20-yr · $8,200/yr</div>
            </div>
            <div class="rac-trigger-info">
              <i class="fas fa-calendar-times orange-icon"></i>
              <span>Term expiry Sep 15, 2026 — conversion window closing</span>
            </div>
            <div class="rac-days-badge high">153 days</div>
            <button class="rac-action-btn high" onclick="openRetentionModal('ret-sandra')"><i class="fas fa-bolt"></i> Act Now</button>
            <button class="rac-email-btn" onclick="draftRetentionEmail('sandra')"><i class="fas fa-envelope"></i> Draft Email</button>
          </div>
          <div class="rac-item rac-med">
            <div class="rac-priority-badge med">MED</div>
            <div class="rac-client-info">
              <div class="rac-client-name">James Whitfield</div>
              <div class="rac-policy-info">P-100293 · Long-Term Care · $12,400/yr</div>
            </div>
            <div class="rac-trigger-info">
              <i class="fas fa-coins purple-icon"></i>
              <span>LTC coverage gap $180/day — review at renewal</span>
            </div>
            <div class="rac-days-badge med">Coverage Review</div>
            <button class="rac-action-btn med" onclick="openRetentionModal('ret-james')"><i class="fas fa-eye"></i> Review</button>
            <button class="rac-email-btn" onclick="draftRetentionEmail('james')"><i class="fas fa-envelope"></i> Draft Email</button>
          </div>
          <div class="rac-item rac-low">
            <div class="rac-priority-badge low">LOW</div>
            <div class="rac-client-info">
              <div class="rac-client-name">David Thompson</div>
              <div class="rac-policy-info">P-100380 · Term Life · $2,400/yr</div>
            </div>
            <div class="rac-trigger-info">
              <i class="fas fa-shield-alt blue-icon"></i>
              <span>Under-insured · no DI/retirement — upsell opportunity</span>
            </div>
            <div class="rac-days-badge low">30-Day Engage</div>
            <button class="rac-action-btn low" onclick="openRetentionModal('ret-david')"><i class="fas fa-phone"></i> Engage</button>
            <button class="rac-email-btn" onclick="draftRetentionEmail('david')"><i class="fas fa-envelope"></i> Draft Email</button>
          </div>
        </div>
        <div class="rac-footer">
          <button class="rac-footer-btn" onclick="sendQuickMessage('Show all 23 renewal cases ranked by urgency and premium at risk')"><i class="fas fa-robot"></i> AI Full Renewal Analysis</button>
          <button class="rac-footer-btn" onclick="sendQuickMessage('Draft personalised renewal emails for all 23 clients due in 90 days')"><i class="fas fa-envelope-open-text"></i> Batch Draft Emails</button>
          <button class="rac-footer-btn" onclick="navigateTo('clients')"><i class="fas fa-users"></i> View All At-Risk Clients</button>
        </div>
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

      {/* ── Policy Modal ── */}
      <div class="detail-modal-overlay" id="policy-modal-overlay" onclick="closePolicyModal()">
        <div class="detail-modal" onclick="event.stopPropagation()">
          <div class="detail-modal-header" id="policy-modal-header">
            <div class="detail-modal-title">
              <span class="detail-modal-icon" id="policy-modal-icon"><i class="fas fa-file-contract"></i></span>
              <div>
                <h3 id="policy-modal-title">Policy Details</h3>
                <p id="policy-modal-subtitle" class="detail-modal-sub"></p>
              </div>
            </div>
            <div class="detail-modal-header-actions">
              <div class="detail-modal-tabs" id="policy-modal-tabs">
                <button class="dmt-tab active" onclick="switchPolicyTab('view',this)"><i class="fas fa-eye"></i> View</button>
                <button class="dmt-tab" onclick="switchPolicyTab('edit',this)"><i class="fas fa-edit"></i> Edit</button>
                <button class="dmt-tab ai-tab" onclick="switchPolicyTab('ai',this)"><i class="fas fa-robot"></i> AI Analysis</button>
                <button class="dmt-tab nlp-tab" onclick="switchPolicyTab('nlp',this)"><i class="fas fa-brain"></i> NLP Risk</button>
                <button class="dmt-tab ri-tab" onclick="switchPolicyTab('retention',this)"><i class="fas fa-heartbeat"></i> Retention</button>
              </div>
              <button class="detail-modal-close" onclick="closePolicyModal()"><i class="fas fa-times"></i></button>
            </div>
          </div>
          <div class="detail-modal-body" id="policy-modal-body"></div>
        </div>
      </div>

      {/* ── Retention Intelligence Full Report Modal ── */}
      <div class="ri-overlay" id="ri-overlay" onclick="closeRetentionFullReport(event)">
        <div class="ri-report-modal" onclick="event.stopPropagation()">
          <div class="ri-report-header">
            <div class="ri-report-title-wrap">
              <div class="ri-report-icon"><i class="fas fa-heartbeat"></i></div>
              <div>
                <div class="ri-report-title">Retention Intelligence Full Report</div>
                <div class="ri-report-sub" id="ri-report-sub">AI lapse predictions · renewal risk matrix · recommended actions</div>
              </div>
            </div>
            <div class="ri-report-header-right">
              <div class="ri-report-tabs">
                <button class="ri-rtab active" onclick="switchRIReportTab('overview',this)"><i class="fas fa-chart-bar"></i> Overview</button>
                <button class="ri-rtab" onclick="switchRIReportTab('clients',this)"><i class="fas fa-users"></i> At-Risk Clients</button>
                <button class="ri-rtab" onclick="switchRIReportTab('forecast',this)"><i class="fas fa-chart-line"></i> Forecast</button>
              </div>
              <button class="ri-report-close" onclick="closeRetentionFullReport()"><i class="fas fa-times"></i></button>
            </div>
          </div>
          <div class="ri-report-body" id="ri-report-body">
            {/* JS-populated */}
          </div>
        </div>
      </div>

      {/* ── Retention Email Draft Modal ── */}
      <div class="ri-email-overlay" id="ri-email-overlay" onclick="closeRetentionEmailModal(event)">
        <div class="ri-email-modal" onclick="event.stopPropagation()">
          <div class="ri-email-header">
            <div class="ri-email-icon"><i class="fas fa-envelope-open-text"></i></div>
            <div>
              <div class="ri-email-title">AI-Drafted Retention Email</div>
              <div class="ri-email-sub" id="ri-email-sub"></div>
            </div>
            <button class="ri-report-close" onclick="closeRetentionEmailModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="ri-email-body" id="ri-email-body"></div>
        </div>
      </div>

      {/* ── NLP Policy Review & Risk Expert Modal ── */}
      <div class="nlp-overlay" id="nlp-overlay" onclick="closeNLPReview(event)">
        <div class="nlp-modal" onclick="event.stopPropagation()">
          <div class="nlp-modal-header">
            <div class="nlp-modal-title-wrap">
              <div class="nlp-modal-icon"><i class="fas fa-brain"></i></div>
              <div>
                <div class="nlp-modal-title">NLP Policy Review &amp; Risk Expert</div>
                <div class="nlp-modal-sub" id="nlp-modal-sub">AI-powered clause analysis · risk flags · plain-language summary</div>
              </div>
            </div>
            <div class="nlp-modal-header-right">
              <div class="nlp-modal-tabs">
                <button class="nlp-mtab active" onclick="switchNLPTab('summary',this)"><i class="fas fa-align-left"></i> Plain Summary</button>
                <button class="nlp-mtab" onclick="switchNLPTab('clauses',this)"><i class="fas fa-list-ul"></i> Clause Analysis</button>
                <button class="nlp-mtab" onclick="switchNLPTab('risk',this)"><i class="fas fa-exclamation-triangle"></i> Risk Flags</button>
                <button class="nlp-mtab" onclick="switchNLPTab('compare',this)"><i class="fas fa-balance-scale"></i> Benchmark</button>
              </div>
              <button class="nlp-close-btn" onclick="closeNLPReview()"><i class="fas fa-times"></i></button>
            </div>
          </div>
          <div class="nlp-modal-body" id="nlp-modal-body">
            {/* JS-populated */}
          </div>
        </div>
      </div>
    </div>
  )
}

function ClaimsPage() {
  return (
    <div class="page claims-page">

      {/* ── Claims Summary Strip ── */}
      <div class="claims-summary-strip">
        <div class="cls-stat cls-open">
          <div class="cls-icon"><i class="fas fa-folder-open"></i></div>
          <div class="cls-body"><div class="cls-val">7</div><div class="cls-lbl">Open Claims</div></div>
        </div>
        <div class="cls-stat cls-review">
          <div class="cls-icon"><i class="fas fa-search"></i></div>
          <div class="cls-body"><div class="cls-val">3</div><div class="cls-lbl">Under Review</div></div>
        </div>
        <div class="cls-stat cls-pending">
          <div class="cls-icon"><i class="fas fa-hourglass-half"></i></div>
          <div class="cls-body"><div class="cls-val">2</div><div class="cls-lbl">Pending Docs</div></div>
        </div>
        <div class="cls-stat cls-approved">
          <div class="cls-icon"><i class="fas fa-check-circle"></i></div>
          <div class="cls-body"><div class="cls-val">14</div><div class="cls-lbl">Approved YTD</div></div>
        </div>
        <div class="cls-stat cls-paid">
          <div class="cls-icon"><i class="fas fa-dollar-sign"></i></div>
          <div class="cls-body"><div class="cls-val">$284K</div><div class="cls-lbl">Paid Out YTD</div></div>
        </div>
        <div class="cls-stat cls-avg">
          <div class="cls-icon"><i class="fas fa-clock"></i></div>
          <div class="cls-body"><div class="cls-val">5.2d</div><div class="cls-lbl">Avg Resolution</div></div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div class="page-toolbar">
        <div class="toolbar-left">
          <div class="search-inline">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search claims, clients, policy IDs..." />
          </div>
          <select class="filter-select">
            <option value="">All Types</option>
            <option>Death Benefit</option>
            <option>Disability</option>
            <option>Long-term Care</option>
            <option>Accelerated Benefit</option>
            <option>Waiver of Premium</option>
          </select>
          <select class="filter-select">
            <option value="">All Status</option>
            <option>Open</option>
            <option>Under Review</option>
            <option>Pending Documentation</option>
            <option>Approved</option>
            <option>Paid</option>
            <option>Denied</option>
          </select>
          <select class="filter-select">
            <option value="">All Priority</option>
            <option>Urgent</option>
            <option>Normal</option>
            <option>Low</option>
          </select>
        </div>
        <div class="toolbar-right">
          <button class="btn btn-ai" onclick="navigateTo('ai-agents')">
            <i class="fas fa-robot"></i> AI Claims Analysis
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-plus"></i> File New Claim
          </button>
        </div>
      </div>

      {/* ── AI Claims Intelligence Banner ── */}
      <div class="ci-banner" id="ci-banner">
        <div class="ci-banner-left">
          <div class="ci-banner-icon"><i class="fas fa-brain"></i><span class="ci-pulse"></span></div>
          <div class="ci-banner-text">
            <div class="ci-banner-title">AI Claims Intelligence <span class="ci-live-badge">● LIVE</span></div>
            <div class="ci-banner-sub">ML fraud detection · NLP doc extraction · Predictive resolution · Real-time triage</div>
          </div>
        </div>
        <div class="ci-kpis">
          <div class="ci-kpi ci-kpi-red">
            <div class="ci-kpi-val">1</div>
            <div class="ci-kpi-lbl">Fraud Flagged</div>
          </div>
          <div class="ci-kpi ci-kpi-orange">
            <div class="ci-kpi-val">2</div>
            <div class="ci-kpi-lbl">Watch List</div>
          </div>
          <div class="ci-kpi ci-kpi-blue">
            <div class="ci-kpi-val">94%</div>
            <div class="ci-kpi-lbl">NLP Accuracy</div>
          </div>
          <div class="ci-kpi ci-kpi-green">
            <div class="ci-kpi-val">5.2d</div>
            <div class="ci-kpi-lbl">Avg Resolution</div>
          </div>
          <div class="ci-kpi ci-kpi-purple">
            <div class="ci-kpi-val">+32%</div>
            <div class="ci-kpi-lbl">Detection Lift</div>
          </div>
        </div>
        <div class="ci-banner-actions">
          <button class="btn-ci-action primary" onclick="openCIReviewModal()"><i class="fas fa-search-plus"></i> Full Intelligence Report</button>
          <button class="btn-ci-action secondary" onclick="openFraudReportModal()"><i class="fas fa-shield-virus"></i> Fraud Report</button>
          <button class="btn-ci-action secondary" onclick="sendContextMessage('Run full claims triage — prioritize by fraud risk, resolution urgency and document completeness','claims')"><i class="fas fa-robot"></i> AI Triage</button>
        </div>
      </div>

      {/* ── Proactive AI Alert Card ── */}
      <div class="proactive-alert-card">
        <div class="pac-header">
          <div class="pac-header-left">
            <div class="pac-icon"><i class="fas fa-brain"></i><span class="pac-pulse"></span></div>
            <div>
              <div class="pac-title">Proactive AI Detection Engine</div>
              <div class="pac-sub">Monitoring obituaries, lapse signals, renewal windows &amp; coverage events · Updated <span class="pac-updated">just now</span></div>
            </div>
          </div>
          <div class="pac-header-stats">
            <div class="pac-hstat"><span class="pac-hstat-val red">1</span><span class="pac-hstat-lbl">Death Detected</span></div>
            <div class="pac-hstat"><span class="pac-hstat-val orange">2</span><span class="pac-hstat-lbl">Lapse Risk</span></div>
            <div class="pac-hstat"><span class="pac-hstat-val gold">1</span><span class="pac-hstat-lbl">Renewal Alert</span></div>
            <div class="pac-hstat"><span class="pac-hstat-val blue">4</span><span class="pac-hstat-lbl">Total Alerts</span></div>
          </div>
          <button class="btn-pac-dismiss" onclick="togglePACPanel(this)" title="Collapse alerts"><i class="fas fa-chevron-up"></i></button>
        </div>

        <div class="pac-alerts-body" id="pac-alerts-body">

          {/* Alert 1 — Obituary / Death Detected */}
          <div class="pac-alert pac-alert-death" id="pac-alert-1">
            <div class="pac-alert-type-icon death"><i class="fas fa-heart-broken"></i></div>
            <div class="pac-alert-content">
              <div class="pac-alert-badges">
                <span class="pac-badge death"><i class="fas fa-exclamation-circle"></i> Death Detected</span>
                <span class="pac-badge urgent">Urgent</span>
                <span class="pac-badge new">New — 14 mins ago</span>
              </div>
              <div class="pac-alert-headline">Obituary Match — Kevin Park · Policy P-100350</div>
              <div class="pac-alert-detail">AI cross-referenced public obituary data with client registry. Kevin Park (age 29, Jersey City) confirmed deceased 2026-04-10. Policy P-100350 (Term Life $250K) currently in <strong>Pending</strong> status — coverage determination required before claim processing. Estate contact not yet identified.</div>
              <div class="pac-alert-meta">
                <span><i class="fas fa-search"></i> Source: Public obituary registry · NJ DoH cross-match</span>
                <span><i class="fas fa-file-contract"></i> Policy P-100350 · $250,000 Death Benefit</span>
                <span><i class="fas fa-shield-virus"></i> Fraud Score: 78 / 100 — Flagged</span>
              </div>
            </div>
            <div class="pac-alert-actions">
              <button class="btn-pac-action primary" onclick="openPACModal('obituary-kevin')"><i class="fas fa-arrow-circle-right"></i> Take Action</button>
              <button class="btn-pac-action secondary" onclick="openClaimModal('CLM-2026-0025','view')"><i class="fas fa-eye"></i> View Claim</button>
            </div>
          </div>

          {/* Alert 2 — Policy Lapse Risk (UL under-funded) */}
          <div class="pac-alert pac-alert-lapse" id="pac-alert-2">
            <div class="pac-alert-type-icon lapse"><i class="fas fa-battery-quarter"></i></div>
            <div class="pac-alert-content">
              <div class="pac-alert-badges">
                <span class="pac-badge lapse"><i class="fas fa-exclamation-triangle"></i> Lapse Risk</span>
                <span class="pac-badge high">High Priority</span>
                <span class="pac-badge new2">2 quarters under-funded</span>
              </div>
              <div class="pac-alert-headline">Policy Lapse Risk — Patricia Nguyen · P-100301 Universal Life</div>
              <div class="pac-alert-detail">AI cash-flow model predicts policy lapse within <strong>60–90 days</strong> if premiums are not increased. P-100301 has been under-funded for 2 consecutive quarters. Current cash value $21,400 is below minimum threshold. Client age 38 — re-qualification after lapse would require new medical underwriting.</div>
              <div class="pac-alert-meta">
                <span><i class="fas fa-chart-line"></i> Cash value: $21,400 · Minimum required: $28,000</span>
                <span><i class="fas fa-file-contract"></i> Policy P-100301 · $400K face value</span>
                <span><i class="fas fa-calendar-times"></i> Predicted lapse: ~2026-06-20 if no action</span>
              </div>
            </div>
            <div class="pac-alert-actions">
              <button class="btn-pac-action primary" onclick="openPACModal('lapse-patricia')"><i class="fas fa-arrow-circle-right"></i> Take Action</button>
              <button class="btn-pac-action secondary" onclick="openPolicyModal('P-100301','ai')"><i class="fas fa-robot"></i> AI Analysis</button>
            </div>
          </div>

          {/* Alert 3 — Conversion Window Closing */}
          <div class="pac-alert pac-alert-renewal" id="pac-alert-3">
            <div class="pac-alert-type-icon renewal"><i class="fas fa-hourglass-end"></i></div>
            <div class="pac-alert-content">
              <div class="pac-alert-badges">
                <span class="pac-badge renewal"><i class="fas fa-sync"></i> Renewal Window</span>
                <span class="pac-badge urgent2">5 Months Left</span>
              </div>
              <div class="pac-alert-headline">Conversion Window Closing — Sandra Williams · P-100320 Term Life</div>
              <div class="pac-alert-detail">Policy P-100320 (20-year term, $350K face value) expires <strong>September 2026 — 5 months away</strong>. Sandra Williams, age 61, can convert to permanent life without medical evidence only until renewal. After expiry, new underwriting at age 61 will significantly increase premiums or risk denial. AI recommends immediate outreach to schedule conversion discussion.</div>
              <div class="pac-alert-meta">
                <span><i class="fas fa-calendar-alt"></i> Renewal date: 2026-09-30 · 150 days remaining</span>
                <span><i class="fas fa-file-contract"></i> Policy P-100320 · $350K · Beneficiary: Michael Williams</span>
                <span><i class="fas fa-user-clock"></i> Client age 61 — conversion premium savings est. $4,200/yr if acted now</span>
              </div>
            </div>
            <div class="pac-alert-actions">
              <button class="btn-pac-action primary" onclick="openPACModal('renewal-sandra')"><i class="fas fa-arrow-circle-right"></i> Take Action</button>
              <button class="btn-pac-action secondary" onclick="openPolicyModal('P-100320','ai')"><i class="fas fa-robot"></i> AI Analysis</button>
            </div>
          </div>

          {/* Alert 4 — Proactive New Coverage */}
          <div class="pac-alert pac-alert-coverage" id="pac-alert-4">
            <div class="pac-alert-type-icon coverage"><i class="fas fa-user-plus"></i></div>
            <div class="pac-alert-content">
              <div class="pac-alert-badges">
                <span class="pac-badge coverage"><i class="fas fa-shield-alt"></i> Coverage Gap</span>
                <span class="pac-badge normal2">Opportunity</span>
              </div>
              <div class="pac-alert-headline">Surviving Family — New Coverage Opportunity · Robert Chen Estate</div>
              <div class="pac-alert-detail">Following the active death benefit claim (CLM-2026-0041), AI identified that <strong>Susan Chen (beneficiary, est. age 42)</strong> has no existing NYL coverage. Upon claim resolution, proactively reach out with a new coverage needs analysis. Estate payout of $1M creates an ideal window for investment, insurance and estate planning conversations.</div>
              <div class="pac-alert-meta">
                <span><i class="fas fa-dollar-sign"></i> Expected payout: $1,000,000 to Susan Chen</span>
                <span><i class="fas fa-lightbulb"></i> Opportunity: Whole Life + investment + estate planning</span>
                <span><i class="fas fa-calendar-check"></i> Outreach timing: After claim resolves ~2026-04-17</span>
              </div>
            </div>
            <div class="pac-alert-actions">
              <button class="btn-pac-action primary" onclick="openPACModal('coverage-susan')"><i class="fas fa-arrow-circle-right"></i> Take Action</button>
              <button class="btn-pac-action secondary" onclick="openClaimModal('CLM-2026-0041','view')"><i class="fas fa-eye"></i> View Claim</button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Fraud Detection Panel ── */}
      <div class="fraud-detection-panel">
        <div class="fdp-header">
          <div class="fdp-title">
            <div class="fdp-icon"><i class="fas fa-shield-virus"></i></div>
            <div>
              <div class="fdp-heading">AI Fraud Detection Engine</div>
              <div class="fdp-sub">Continuously monitoring 11 active &amp; resolved claims · Last scan 2 mins ago</div>
            </div>
          </div>
          <div class="fdp-stats">
            <div class="fdp-stat">
              <span class="fdp-stat-val green">8</span>
              <span class="fdp-stat-lbl">Clear</span>
            </div>
            <div class="fdp-stat">
              <span class="fdp-stat-val gold">2</span>
              <span class="fdp-stat-lbl">Watch</span>
            </div>
            <div class="fdp-stat">
              <span class="fdp-stat-val red">1</span>
              <span class="fdp-stat-lbl">Flagged</span>
            </div>
            <div class="fdp-divider"></div>
            <div class="fdp-stat">
              <span class="fdp-stat-val blue">+32%</span>
              <span class="fdp-stat-lbl">Detection Lift</span>
            </div>
          </div>
          <button class="btn btn-ai fdp-btn" onclick="openFraudReportModal()">
            <i class="fas fa-search-plus"></i> Full Fraud Report
          </button>
        </div>
        {/* ML Risk Matrix */}
        <div class="fdp-risk-matrix">
          <div class="fdp-matrix-col">
            <div class="fdp-matrix-label">Claim Timing</div>
            <div class="fdp-matrix-bar"><div class="fdp-matrix-fill red" style="width:72%"></div></div>
            <div class="fdp-matrix-val red">High</div>
          </div>
          <div class="fdp-matrix-col">
            <div class="fdp-matrix-label">Doc Completeness</div>
            <div class="fdp-matrix-bar"><div class="fdp-matrix-fill orange" style="width:55%"></div></div>
            <div class="fdp-matrix-val orange">Med</div>
          </div>
          <div class="fdp-matrix-col">
            <div class="fdp-matrix-label">Policy History</div>
            <div class="fdp-matrix-bar"><div class="fdp-matrix-fill green" style="width:90%"></div></div>
            <div class="fdp-matrix-val green">Low</div>
          </div>
          <div class="fdp-matrix-col">
            <div class="fdp-matrix-label">Beneficiary Match</div>
            <div class="fdp-matrix-bar"><div class="fdp-matrix-fill orange" style="width:60%"></div></div>
            <div class="fdp-matrix-val orange">Med</div>
          </div>
          <div class="fdp-matrix-col">
            <div class="fdp-matrix-label">Claim Amount</div>
            <div class="fdp-matrix-bar"><div class="fdp-matrix-fill red" style="width:80%"></div></div>
            <div class="fdp-matrix-val red">High</div>
          </div>
        </div>
        <div class="fdp-flags">
          <div class="fdp-flag flagged" onclick="openFraudDetailModal('CLM-2026-0025')">
            <i class="fas fa-exclamation-triangle"></i>
            <span class="fdp-flag-id">CLM-2026-0025</span>
            <span class="fdp-flag-reason">Policy in Pending status at time of death · Coverage determination required · Medical records inconsistency · ML: 3 anomalies detected</span>
            <div class="fdp-flag-signals">
              <span class="fdp-signal red">Timing</span>
              <span class="fdp-signal red">Coverage Gap</span>
              <span class="fdp-signal orange">Doc Delay</span>
            </div>
            <span class="fdp-flag-score">Risk: 78</span>
          </div>
          <div class="fdp-flag watch" onclick="openFraudDetailModal('CLM-2026-0041')">
            <i class="fas fa-eye"></i>
            <span class="fdp-flag-id">CLM-2026-0041</span>
            <span class="fdp-flag-reason">$1M claim · Claimant ID docs pending · High-value threshold monitoring active · ML: enhanced review protocol</span>
            <div class="fdp-flag-signals">
              <span class="fdp-signal orange">High Value</span>
              <span class="fdp-signal orange">ID Pending</span>
            </div>
            <span class="fdp-flag-score">Risk: 42</span>
          </div>
          <div class="fdp-flag watch" onclick="openFraudDetailModal('CLM-2026-0028')">
            <i class="fas fa-eye"></i>
            <span class="fdp-flag-id">CLM-2026-0028</span>
            <span class="fdp-flag-reason">Terminal certification pending · ADB claim filed 30 days post-diagnosis · NLP: document language inconsistency detected</span>
            <div class="fdp-flag-signals">
              <span class="fdp-signal orange">Cert Delay</span>
              <span class="fdp-signal yellow">NLP Flag</span>
            </div>
            <span class="fdp-flag-score">Risk: 38</span>
          </div>
        </div>
      </div>

      {/* ── IDP Hub Panel ── */}
      <div class="idp-hub-panel">
        <div class="idp-hub-header">
          <div class="idp-hub-title">
            <div class="idp-hub-icon"><i class="fas fa-file-import"></i></div>
            <div>
              <div class="idp-hub-name">Intelligent Document Processing Hub</div>
              <div class="idp-hub-sub">AI-powered auto-extraction · Last scan <span class="idp-scan-time">3 mins ago</span></div>
            </div>
          </div>
          <div class="idp-hub-stats">
            <div class="idp-stat"><div class="idp-stat-val green">5</div><div class="idp-stat-lbl">Docs Verified</div></div>
            <div class="idp-stat"><div class="idp-stat-val orange">6</div><div class="idp-stat-lbl">Pending Upload</div></div>
            <div class="idp-stat"><div class="idp-stat-val purple">4</div><div class="idp-stat-lbl">AI Extracting</div></div>
            <div class="idp-stat"><div class="idp-stat-val blue">94%</div><div class="idp-stat-lbl">Accuracy Rate</div></div>
          </div>
          <div class="idp-hub-actions">
            <div class="idp-drop-zone" id="idp-drop-zone" ondragover="event.preventDefault();this.classList.add('idp-drag-over')" ondragleave="this.classList.remove('idp-drag-over')" ondrop="handleIDPDrop(event)">
              <i class="fas fa-cloud-upload-alt"></i>
              <span>Drop documents here to scan</span>
            </div>
            <button class="btn btn-idp-scan" onclick="runIDPScan()"><i class="fas fa-search"></i> Run IDP Scan</button>
          </div>
        </div>
        <div class="idp-queue" id="idp-queue">
          <div class="idp-queue-item idp-qi-extracting">
            <div class="idp-qi-icon"><i class="fas fa-file-pdf"></i></div>
            <div class="idp-qi-info">
              <div class="idp-qi-name">Death_Certificate_RC_2026.pdf</div>
              <div class="idp-qi-meta">CLM-2026-0041 · Robert Chen · Uploaded 2026-04-09</div>
            </div>
            <div class="idp-qi-status extracting"><i class="fas fa-cog fa-spin"></i> Extracting fields…</div>
            <div class="idp-qi-confidence">—</div>
          </div>
          <div class="idp-queue-item idp-qi-verified">
            <div class="idp-qi-icon"><i class="fas fa-file-medical"></i></div>
            <div class="idp-qi-info">
              <div class="idp-qi-name">Medical_Certificate_Cardiac.pdf</div>
              <div class="idp-qi-meta">CLM-2026-0041 · Robert Chen · Uploaded 2026-04-09</div>
            </div>
            <div class="idp-qi-status verified"><i class="fas fa-check-circle"></i> Verified</div>
            <div class="idp-qi-confidence">Confidence: <strong>98%</strong></div>
          </div>
          <div class="idp-queue-item idp-qi-pending">
            <div class="idp-qi-icon"><i class="fas fa-file-alt"></i></div>
            <div class="idp-qi-info">
              <div class="idp-qi-name">Terminal_Illness_Certification.pdf</div>
              <div class="idp-qi-meta">CLM-2026-0028 · Maria Gonzalez · Awaiting oncologist</div>
            </div>
            <div class="idp-qi-status pending"><i class="fas fa-clock"></i> Awaiting Upload</div>
            <div class="idp-qi-confidence">—</div>
          </div>
          <div class="idp-queue-item idp-qi-verified">
            <div class="idp-qi-icon"><i class="fas fa-file-contract"></i></div>
            <div class="idp-qi-info">
              <div class="idp-qi-name">LTC_Eligibility_Cert_SW.pdf</div>
              <div class="idp-qi-meta">CLM-2026-0038 · Sandra Williams · Uploaded 2026-04-01</div>
            </div>
            <div class="idp-qi-status verified"><i class="fas fa-check-circle"></i> Verified</div>
            <div class="idp-qi-confidence">Confidence: <strong>99%</strong></div>
          </div>
          <div class="idp-queue-item idp-qi-extracting">
            <div class="idp-qi-icon"><i class="fas fa-file-medical-alt"></i></div>
            <div class="idp-qi-info">
              <div class="idp-qi-name">APS_DrHernandez_MG.pdf</div>
              <div class="idp-qi-meta">CLM-2026-0035 · Maria Gonzalez · Uploading…</div>
            </div>
            <div class="idp-qi-status extracting"><i class="fas fa-cog fa-spin"></i> Extracting fields…</div>
            <div class="idp-qi-confidence">—</div>
          </div>
        </div>
      </div>

      {/* ── Open / Active Claims ── */}
      <div class="claims-section-label">
        <i class="fas fa-folder-open"></i> Open &amp; Active Claims
        <span class="claims-count-badge">7</span>
      </div>

      <div class="claims-table-wrapper">
        <table class="data-table claims-table">
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Client</th>
              <th>Policy</th>
              <th>Claim Type</th>
              <th>Amount</th>
              <th>Filed Date</th>
              <th>Status</th>
              <th>Priority</th>
              <th><i class="fas fa-shield-virus" style="color:#dc2626;margin-right:4px"></i>Fraud Score</th>
              <th><i class="fas fa-file-import" style="color:#7c3aed;margin-right:4px"></i>Doc Status</th>
              <th><i class="fas fa-brain" style="color:#0ea5e9;margin-right:4px"></i>AI Triage</th>
              <th><i class="fas fa-hourglass-half" style="color:#d97706;margin-right:4px"></i>Resolution</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr class="claim-row urgent">
              <td><span class="claim-id">CLM-2026-0041</span></td>
              <td><div class="client-cell"><div class="mini-avatar rc">RC</div><span>Robert Chen</span></div></td>
              <td><span class="policy-id">P-100310</span></td>
              <td><span class="claim-type-badge death">Death Benefit</span></td>
              <td class="premium">$1,000,000</td>
              <td class="text-muted">2026-04-09</td>
              <td><span class="claim-status-badge review">Under Review</span></td>
              <td><span class="priority-badge urgent">Urgent</span></td>
              <td><div class="fraud-score-cell watch" onclick="openFraudDetailModal('CLM-2026-0041')"><span class="fraud-score-num">42</span><span class="fraud-score-lbl">Watch</span><i class="fas fa-eye"></i></div></td>
              <td><div class="idp-status-cell" onclick="openIDPModal('CLM-2026-0041')"><span class="idp-badge idp-partial"><i class="fas fa-file-import"></i> 2/4 Docs</span><div class="idp-scan-bar"><div class="idp-scan-fill" style="width:50%"></div></div></div></td>
              <td class="text-muted">Claims Dept.</td>
              <td><div class="ci-triage-cell urgent" onclick="openClaimModal('CLM-2026-0041','ci')"><span class="ci-triage-label">⚡ Expedite</span><span class="ci-triage-sub">Missing ID docs</span></div></td>
              <td><div class="ci-res-timer urgent"><i class="fas fa-hourglass-half"></i><span class="ci-res-days">1d left</span><div class="ci-res-bar"><div class="ci-res-fill urgent" style="width:85%"></div></div></div></td>
              <td>
                <div class="action-btns">
                  <button class="btn-icon" title="View Claim" onclick="openClaimModal('CLM-2026-0041','view')"><i class="fas fa-eye"></i></button>
                  <button class="btn-icon" title="Upload Documents"><i class="fas fa-upload"></i></button>
                  <button class="btn-icon ai-btn" title="AI Analysis" onclick="openClaimModal('CLM-2026-0041','ci')"><i class="fas fa-robot"></i></button>
                </div>
              </td>
            </tr>
            <tr class="claim-row">
              <td><span class="claim-id">CLM-2026-0038</span></td>
              <td><div class="client-cell"><div class="mini-avatar sw">SW</div><span>Sandra Williams</span></div></td>
              <td><span class="policy-id">P-100321</span></td>
              <td><span class="claim-type-badge ltc">Long-term Care</span></td>
              <td class="premium">$18,000</td>
              <td class="text-muted">2026-04-01</td>
              <td><span class="claim-status-badge open">Open</span></td>
              <td><span class="priority-badge normal">Normal</span></td>
              <td><div class="fraud-score-cell clear" onclick="openFraudDetailModal('CLM-2026-0038')"><span class="fraud-score-num">12</span><span class="fraud-score-lbl">Clear</span><i class="fas fa-check"></i></div></td>
              <td><div class="idp-status-cell" onclick="openIDPModal('CLM-2026-0038')"><span class="idp-badge idp-partial"><i class="fas fa-file-import"></i> 2/4 Docs</span><div class="idp-scan-bar"><div class="idp-scan-fill" style="width:50%"></div></div></div></td>
              <td class="text-muted">LTC Team</td>
              <td><div class="ci-triage-cell normal" onclick="openClaimModal('CLM-2026-0038','ci')"><span class="ci-triage-label">📋 Doc Request</span><span class="ci-triage-sub">Plan of care pending</span></div></td>
              <td><div class="ci-res-timer normal"><i class="fas fa-clock"></i><span class="ci-res-days">8d est.</span><div class="ci-res-bar"><div class="ci-res-fill normal" style="width:45%"></div></div></div></td>
              <td>
                <div class="action-btns">
                  <button class="btn-icon" title="View Claim" onclick="openClaimModal('CLM-2026-0038','view')"><i class="fas fa-eye"></i></button>
                  <button class="btn-icon" title="Upload Documents"><i class="fas fa-upload"></i></button>
                  <button class="btn-icon ai-btn" title="AI Analysis" onclick="openClaimModal('CLM-2026-0038','ci')"><i class="fas fa-robot"></i></button>
                </div>
              </td>
            </tr>
            <tr class="claim-row">
              <td><span class="claim-id">CLM-2026-0035</span></td>
              <td><div class="client-cell"><div class="mini-avatar mg">MG</div><span>Maria Gonzalez</span></div></td>
              <td><span class="policy-id">P-100341</span></td>
              <td><span class="claim-type-badge disability">Disability</span></td>
              <td class="premium">$4,200/mo</td>
              <td class="text-muted">2026-03-22</td>
              <td><span class="claim-status-badge pending">Pending Docs</span></td>
              <td><span class="priority-badge normal">Normal</span></td>
              <td><div class="fraud-score-cell clear" onclick="openFraudDetailModal('CLM-2026-0035')"><span class="fraud-score-num">18</span><span class="fraud-score-lbl">Clear</span><i class="fas fa-check"></i></div></td>
              <td><div class="idp-status-cell" onclick="openIDPModal('CLM-2026-0035')"><span class="idp-badge idp-missing"><i class="fas fa-hourglass-half"></i> 2/4 Docs</span><div class="idp-scan-bar"><div class="idp-scan-fill" style="width:50%"></div></div></div></td>
              <td class="text-muted">DI Unit</td>
              <td><div class="ci-triage-cell watch" onclick="openClaimModal('CLM-2026-0035','ci')"><span class="ci-triage-label">🩺 APS Needed</span><span class="ci-triage-sub">Physician stmt pending</span></div></td>
              <td><div class="ci-res-timer watch"><i class="fas fa-clock"></i><span class="ci-res-days">21d est.</span><div class="ci-res-bar"><div class="ci-res-fill watch" style="width:30%"></div></div></div></td>
              <td>
                <div class="action-btns">
                  <button class="btn-icon" title="View Claim" onclick="openClaimModal('CLM-2026-0035','view')"><i class="fas fa-eye"></i></button>
                  <button class="btn-icon" title="Upload Documents"><i class="fas fa-upload"></i></button>
                  <button class="btn-icon ai-btn" title="AI Analysis" onclick="openClaimModal('CLM-2026-0035','ci')"><i class="fas fa-robot"></i></button>
                </div>
              </td>
            </tr>
            <tr class="claim-row">
              <td><span class="claim-id">CLM-2026-0033</span></td>
              <td><div class="client-cell"><div class="mini-avatar jw">JW</div><span>James Whitfield</span></div></td>
              <td><span class="policy-id">P-100293</span></td>
              <td><span class="claim-type-badge ltc">Long-term Care</span></td>
              <td class="premium">$9,600</td>
              <td class="text-muted">2026-03-15</td>
              <td><span class="claim-status-badge review">Under Review</span></td>
              <td><span class="priority-badge normal">Normal</span></td>
              <td><div class="fraud-score-cell clear" onclick="openFraudDetailModal('CLM-2026-0033')"><span class="fraud-score-num">9</span><span class="fraud-score-lbl">Clear</span><i class="fas fa-check"></i></div></td>
              <td><div class="idp-status-cell" onclick="openIDPModal('CLM-2026-0033')"><span class="idp-badge idp-complete"><i class="fas fa-check-circle"></i> 4/4 Docs</span><div class="idp-scan-bar"><div class="idp-scan-fill idp-fill-green" style="width:100%"></div></div></div></td>
              <td class="text-muted">LTC Team</td>
              <td><div class="ci-triage-cell ok" onclick="openClaimModal('CLM-2026-0033','ci')"><span class="ci-triage-label">✅ On Track</span><span class="ci-triage-sub">Approval imminent</span></div></td>
              <td><div class="ci-res-timer ok"><i class="fas fa-check-circle"></i><span class="ci-res-days">3d est.</span><div class="ci-res-bar"><div class="ci-res-fill ok" style="width:80%"></div></div></div></td>
              <td>
                <div class="action-btns">
                  <button class="btn-icon" title="View Claim" onclick="openClaimModal('CLM-2026-0033','view')"><i class="fas fa-eye"></i></button>
                  <button class="btn-icon" title="Upload Documents"><i class="fas fa-upload"></i></button>
                  <button class="btn-icon ai-btn" title="AI Analysis" onclick="openClaimModal('CLM-2026-0033','ci')"><i class="fas fa-robot"></i></button>
                </div>
              </td>
            </tr>
            <tr class="claim-row">
              <td><span class="claim-id">CLM-2026-0031</span></td>
              <td><div class="client-cell"><div class="mini-avatar lm">LM</div><span>Linda Morrison</span></div></td>
              <td><span class="policy-id">P-100362</span></td>
              <td><span class="claim-type-badge waiver">Waiver of Premium</span></td>
              <td class="premium">$9,600/yr</td>
              <td class="text-muted">2026-03-10</td>
              <td><span class="claim-status-badge open">Open</span></td>
              <td><span class="priority-badge low">Low</span></td>
              <td><div class="fraud-score-cell clear" onclick="openFraudDetailModal('CLM-2026-0031')"><span class="fraud-score-num">7</span><span class="fraud-score-lbl">Clear</span><i class="fas fa-check"></i></div></td>
              <td><div class="idp-status-cell" onclick="openIDPModal('CLM-2026-0031')"><span class="idp-badge idp-complete"><i class="fas fa-check-circle"></i> 4/4 Docs</span><div class="idp-scan-bar"><div class="idp-scan-fill idp-fill-green" style="width:100%"></div></div></div></td>
              <td class="text-muted">Agent Support</td>
              <td><div class="ci-triage-cell ok" onclick="openClaimModal('CLM-2026-0031','ci')"><span class="ci-triage-label">✅ Waiver Active</span><span class="ci-triage-sub">Monitor recovery</span></div></td>
              <td><div class="ci-res-timer ok"><i class="fas fa-check-circle"></i><span class="ci-res-days">Open</span><div class="ci-res-bar"><div class="ci-res-fill ok" style="width:60%"></div></div></div></td>
              <td>
                <div class="action-btns">
                  <button class="btn-icon" title="View Claim" onclick="openClaimModal('CLM-2026-0031','view')"><i class="fas fa-eye"></i></button>
                  <button class="btn-icon" title="Upload Documents"><i class="fas fa-upload"></i></button>
                  <button class="btn-icon ai-btn" title="AI Analysis" onclick="openClaimModal('CLM-2026-0031','ci')"><i class="fas fa-robot"></i></button>
                </div>
              </td>
            </tr>
            <tr class="claim-row">
              <td><span class="claim-id">CLM-2026-0028</span></td>
              <td><div class="client-cell"><div class="mini-avatar mg">MG</div><span>Maria Gonzalez</span></div></td>
              <td><span class="policy-id">P-100340</span></td>
              <td><span class="claim-type-badge accelerated">Accelerated Benefit</span></td>
              <td class="premium">$120,000</td>
              <td class="text-muted">2026-03-05</td>
              <td><span class="claim-status-badge pending">Pending Docs</span></td>
              <td><span class="priority-badge urgent">Urgent</span></td>
              <td><div class="fraud-score-cell watch" onclick="openFraudDetailModal('CLM-2026-0028')"><span class="fraud-score-num">38</span><span class="fraud-score-lbl">Watch</span><i class="fas fa-eye"></i></div></td>
              <td><div class="idp-status-cell" onclick="openIDPModal('CLM-2026-0028')"><span class="idp-badge idp-missing idp-urgent"><i class="fas fa-exclamation-circle"></i> 2/4 Docs</span><div class="idp-scan-bar"><div class="idp-scan-fill idp-fill-orange" style="width:50%"></div></div></div></td>
              <td class="text-muted">Claims Dept.</td>
              <td><div class="ci-triage-cell urgent" onclick="openClaimModal('CLM-2026-0028','ci')"><span class="ci-triage-label">⚡ Compassionate</span><span class="ci-triage-sub">Terminal — expedite</span></div></td>
              <td><div class="ci-res-timer urgent"><i class="fas fa-fire"></i><span class="ci-res-days">9d est.</span><div class="ci-res-bar"><div class="ci-res-fill urgent" style="width:70%"></div></div></div></td>
              <td>
                <div class="action-btns">
                  <button class="btn-icon" title="View Claim" onclick="openClaimModal('CLM-2026-0028','view')"><i class="fas fa-eye"></i></button>
                  <button class="btn-icon" title="Upload Documents"><i class="fas fa-upload"></i></button>
                  <button class="btn-icon ai-btn" title="AI Analysis" onclick="openClaimModal('CLM-2026-0028','ci')"><i class="fas fa-robot"></i></button>
                </div>
              </td>
            </tr>
            <tr class="claim-row">
              <td><span class="claim-id">CLM-2026-0025</span></td>
              <td><div class="client-cell"><div class="mini-avatar kp">KP</div><span>Kevin Park</span></div></td>
              <td><span class="policy-id">P-100350</span></td>
              <td><span class="claim-type-badge death">Death Benefit</span></td>
              <td class="premium">$250,000</td>
              <td class="text-muted">2026-02-28</td>
              <td><span class="claim-status-badge review">Under Review</span></td>
              <td><span class="priority-badge normal">Normal</span></td>
              <td><div class="fraud-score-cell flagged" onclick="openFraudDetailModal('CLM-2026-0025')"><span class="fraud-score-num">78</span><span class="fraud-score-lbl">Flagged</span><i class="fas fa-exclamation-triangle"></i></div></td>
              <td><div class="idp-status-cell" onclick="openIDPModal('CLM-2026-0025')"><span class="idp-badge idp-missing idp-urgent"><i class="fas fa-exclamation-circle"></i> 1/4 Docs</span><div class="idp-scan-bar"><div class="idp-scan-fill idp-fill-red" style="width:25%"></div></div></div></td>
              <td class="text-muted">Claims Dept.</td>
              <td><div class="ci-triage-cell flagged" onclick="openClaimModal('CLM-2026-0025','ci')"><span class="ci-triage-label">🚨 Fraud Review</span><span class="ci-triage-sub">Coverage pending</span></div></td>
              <td><div class="ci-res-timer flagged"><i class="fas fa-exclamation-triangle"></i><span class="ci-res-days">Hold</span><div class="ci-res-bar"><div class="ci-res-fill flagged" style="width:15%"></div></div></div></td>
              <td>
                <div class="action-btns">
                  <button class="btn-icon" title="View Claim" onclick="openClaimModal('CLM-2026-0025','view')"><i class="fas fa-eye"></i></button>
                  <button class="btn-icon" title="Upload Documents"><i class="fas fa-upload"></i></button>
                  <button class="btn-icon ai-btn" title="AI Analysis" onclick="openClaimModal('CLM-2026-0025','ci')"><i class="fas fa-robot"></i></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Recently Resolved Claims ── */}
      <div class="claims-section-label" style="margin-top:28px">
        <i class="fas fa-check-circle" style="color:#059669"></i> Recently Resolved Claims
        <span class="claims-count-badge resolved">14 YTD</span>
      </div>

      <div class="claims-table-wrapper">
        <table class="data-table claims-table">
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Client</th>
              <th>Policy</th>
              <th>Claim Type</th>
              <th>Amount Paid</th>
              <th>Filed</th>
              <th>Resolved</th>
              <th>Status</th>
              <th>Resolution Days</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="claim-id">CLM-2026-0022</span></td>
              <td><div class="client-cell"><div class="mini-avatar lm">LM</div><span>Linda Morrison</span></div></td>
              <td><span class="policy-id">P-100360</span></td>
              <td><span class="claim-type-badge death">Death Benefit (Rider)</span></td>
              <td class="premium">$50,000</td>
              <td class="text-muted">2026-02-10</td>
              <td class="text-muted">2026-02-17</td>
              <td><span class="claim-status-badge paid">Paid</span></td>
              <td><span class="res-days good">7 days</span></td>
              <td><div class="action-btns"><button class="btn-icon" title="View" onclick="openClaimModal('CLM-2026-0022','view')"><i class="fas fa-eye"></i></button></div></td>
            </tr>
            <tr>
              <td><span class="claim-id">CLM-2026-0019</span></td>
              <td><div class="client-cell"><div class="mini-avatar rc">RC</div><span>Robert Chen</span></div></td>
              <td><span class="policy-id">P-100311</span></td>
              <td><span class="claim-type-badge waiver">Waiver of Premium</span></td>
              <td class="premium">$8,400/yr</td>
              <td class="text-muted">2026-01-20</td>
              <td class="text-muted">2026-01-24</td>
              <td><span class="claim-status-badge paid">Approved</span></td>
              <td><span class="res-days good">4 days</span></td>
              <td><div class="action-btns"><button class="btn-icon" title="View" onclick="openClaimModal('CLM-2026-0019','view')"><i class="fas fa-eye"></i></button></div></td>
            </tr>
            <tr>
              <td><span class="claim-id">CLM-2026-0015</span></td>
              <td><div class="client-cell"><div class="mini-avatar jw">JW</div><span>James Whitfield</span></div></td>
              <td><span class="policy-id">P-100291</span></td>
              <td><span class="claim-type-badge accelerated">Accelerated Benefit</span></td>
              <td class="premium">$75,000</td>
              <td class="text-muted">2026-01-08</td>
              <td class="text-muted">2026-01-15</td>
              <td><span class="claim-status-badge paid">Paid</span></td>
              <td><span class="res-days good">7 days</span></td>
              <td><div class="action-btns"><button class="btn-icon" title="View" onclick="openClaimModal('CLM-2026-0015','view')"><i class="fas fa-eye"></i></button></div></td>
            </tr>
            <tr>
              <td><span class="claim-id">CLM-2025-0198</span></td>
              <td><div class="client-cell"><div class="mini-avatar sw">SW</div><span>Sandra Williams</span></div></td>
              <td><span class="policy-id">P-100320</span></td>
              <td><span class="claim-type-badge disability">Disability</span></td>
              <td class="premium">$12,600</td>
              <td class="text-muted">2025-12-01</td>
              <td class="text-muted">2025-12-08</td>
              <td><span class="claim-status-badge paid">Paid</span></td>
              <td><span class="res-days good">7 days</span></td>
              <td><div class="action-btns"><button class="btn-icon" title="View" onclick="openClaimModal('CLM-2025-0198','view')"><i class="fas fa-eye"></i></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Smart Doc Request Automation Panel ── */}
      <div class="smart-doc-panel">
        <div class="sdp-header">
          <div class="sdp-title-area">
            <div class="sdp-icon"><i class="fas fa-paper-plane"></i></div>
            <div>
              <div class="sdp-title">Smart Doc Request Automation</div>
              <div class="sdp-sub">AI drafts and sends personalized document reminder emails · Last run: 4 mins ago</div>
            </div>
          </div>
          <div class="sdp-stats">
            <div class="sdp-stat"><span class="sdp-stat-val orange">3</span><span class="sdp-stat-lbl">Pending Requests</span></div>
            <div class="sdp-stat"><span class="sdp-stat-val green">8</span><span class="sdp-stat-lbl">Sent This Week</span></div>
            <div class="sdp-stat"><span class="sdp-stat-val blue">67%</span><span class="sdp-stat-lbl">Response Rate</span></div>
          </div>
          <button class="btn btn-ai sdp-run-btn" onclick="runSmartDocRequests()"><i class="fas fa-paper-plane"></i> Send All Reminders</button>
        </div>
        <div class="sdp-queue">
          <div class="sdp-item sdp-urgent">
            <div class="sdp-item-icon"><i class="fas fa-file-signature"></i></div>
            <div class="sdp-item-content">
              <div class="sdp-item-title">Identity Documents — Susan Chen (Beneficiary)</div>
              <div class="sdp-item-meta">CLM-2026-0041 · Robert Chen · Death Benefit $1M · Overdue 1 day</div>
              <div class="sdp-item-draft">"Dear Susan Chen, to process your $1,000,000 death benefit claim, we need your government-issued photo ID and bank account details. These are the final steps before we can release your payment…"</div>
            </div>
            <button class="btn-sdp-send" onclick="sendDocRequest('CLM-2026-0041','Susan Chen')"><i class="fas fa-paper-plane"></i> Send</button>
          </div>
          <div class="sdp-item sdp-urgent">
            <div class="sdp-item-icon"><i class="fas fa-file-medical"></i></div>
            <div class="sdp-item-content">
              <div class="sdp-item-title">Terminal Illness Certification — Dr. Hernandez Office</div>
              <div class="sdp-item-meta">CLM-2026-0028 · Maria Gonzalez · ADB $120,000 · 9 days pending</div>
              <div class="sdp-item-draft">"Dear Dr. Hernandez's Office, we are processing a compassionate accelerated benefit claim for Maria Gonzalez. We respectfully request expedited completion of the terminal illness certification form…"</div>
            </div>
            <button class="btn-sdp-send" onclick="sendDocRequest('CLM-2026-0028','Dr. Hernandez')"><i class="fas fa-paper-plane"></i> Send</button>
          </div>
          <div class="sdp-item sdp-normal">
            <div class="sdp-item-icon"><i class="fas fa-file-alt"></i></div>
            <div class="sdp-item-content">
              <div class="sdp-item-title">Attending Physician Statement — Dr. Hernandez</div>
              <div class="sdp-item-meta">CLM-2026-0035 · Maria Gonzalez · Disability $4,200/mo · 22 days pending</div>
              <div class="sdp-item-draft">"Dear Dr. Hernandez, we are processing a disability insurance claim for your patient Maria Gonzalez. Please complete the Attending Physician Statement to allow us to begin benefit payments…"</div>
            </div>
            <button class="btn-sdp-send" onclick="sendDocRequest('CLM-2026-0035','Dr. Hernandez APS')"><i class="fas fa-paper-plane"></i> Send</button>
          </div>
        </div>
      </div>

      {/* ── Claims by Type Summary ── */}
      <div class="claims-type-grid">
        <div class="ctype-card death-type">
          <div class="ctype-icon"><i class="fas fa-heart-broken"></i></div>
          <div class="ctype-body">
            <div class="ctype-name">Death Benefit</div>
            <div class="ctype-count">2 open · 4 resolved</div>
            <div class="ctype-value">$1.25M total</div>
          </div>
        </div>
        <div class="ctype-card disability-type">
          <div class="ctype-icon"><i class="fas fa-user-injured"></i></div>
          <div class="ctype-body">
            <div class="ctype-name">Disability</div>
            <div class="ctype-count">1 open · 3 resolved</div>
            <div class="ctype-value">$50K/yr total</div>
          </div>
        </div>
        <div class="ctype-card ltc-type">
          <div class="ctype-icon"><i class="fas fa-hospital"></i></div>
          <div class="ctype-body">
            <div class="ctype-name">Long-term Care</div>
            <div class="ctype-count">2 open · 4 resolved</div>
            <div class="ctype-value">$27.6K total</div>
          </div>
        </div>
        <div class="ctype-card accelerated-type">
          <div class="ctype-icon"><i class="fas fa-bolt"></i></div>
          <div class="ctype-body">
            <div class="ctype-name">Accelerated Benefit</div>
            <div class="ctype-count">1 open · 2 resolved</div>
            <div class="ctype-value">$195K total</div>
          </div>
        </div>
        <div class="ctype-card waiver-type">
          <div class="ctype-icon"><i class="fas fa-ban"></i></div>
          <div class="ctype-body">
            <div class="ctype-name">Waiver of Premium</div>
            <div class="ctype-count">1 open · 1 resolved</div>
            <div class="ctype-value">$18K/yr total</div>
          </div>
        </div>
        <div class="ctype-card ai-card">
          <div class="ctype-icon"><i class="fas fa-robot"></i></div>
          <div class="ctype-body">
            <div class="ctype-name">AI Claims Assistant</div>
            <div class="ctype-count">3 pending doc requests</div>
            <div class="ctype-value">Auto-follow-ups ready</div>
          </div>
          <button class="btn btn-ai" style="width:100%;margin-top:10px;font-size:12px" onclick="sendContextMessage('Show all open claims and urgent actions needed — triage by priority and expected resolution','claims')">Run AI Triage</button>
        </div>
      </div>

      {/* ── Claims Intelligence Full Report Modal ── */}
      <div class="detail-modal-overlay" id="ci-review-overlay" onclick="closeCIReviewModal()">
        <div class="detail-modal ci-review-modal" onclick="event.stopPropagation()">
          <div class="detail-modal-header" style="border-bottom-color:#0ea5e9">
            <div class="detail-modal-title">
              <span class="detail-modal-icon" style="background:linear-gradient(135deg,#0ea5e9,#0284c7)"><i class="fas fa-brain"></i></span>
              <div>
                <h3>Claims Intelligence Report</h3>
                <p class="detail-modal-sub">ML Fraud · NLP Analysis · Predictive Resolution · Smart Triage · Generated Apr 13, 2026</p>
              </div>
            </div>
            <button class="detail-modal-close" onclick="closeCIReviewModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="detail-modal-body" id="ci-review-body">
            <div class="ci-report-grid">
              <div class="ci-report-section">
                <div class="ci-report-section-title"><i class="fas fa-shield-virus"></i> Fraud Risk Summary</div>
                <div class="ci-report-fraud-list">
                  <div class="ci-report-fraud-item flagged"><span class="ci-rflag red">78 FLAGGED</span><span class="ci-rfid">CLM-2026-0025</span><span class="ci-rfname">Kevin Park</span><span class="ci-rfreason">Policy pending at death · Coverage gap · 3 ML anomalies</span></div>
                  <div class="ci-report-fraud-item watch"><span class="ci-rflag orange">42 WATCH</span><span class="ci-rfid">CLM-2026-0041</span><span class="ci-rfname">Robert Chen</span><span class="ci-rfreason">High-value $1M · ID docs pending · Enhanced review</span></div>
                  <div class="ci-report-fraud-item watch"><span class="ci-rflag orange">38 WATCH</span><span class="ci-rfid">CLM-2026-0028</span><span class="ci-rfname">Maria Gonzalez</span><span class="ci-rfreason">Terminal cert pending · NLP inconsistency</span></div>
                  <div class="ci-report-fraud-item clear"><span class="ci-rflag green">18 CLEAR</span><span class="ci-rfid">CLM-2026-0035</span><span class="ci-rfname">Maria Gonzalez</span><span class="ci-rfreason">Disability — no signals detected</span></div>
                  <div class="ci-report-fraud-item clear"><span class="ci-rflag green">12 CLEAR</span><span class="ci-rfid">CLM-2026-0038</span><span class="ci-rfname">Sandra Williams</span><span class="ci-rfreason">LTC — all clear</span></div>
                  <div class="ci-report-fraud-item clear"><span class="ci-rflag green">9 CLEAR</span><span class="ci-rfid">CLM-2026-0033</span><span class="ci-rfname">James Whitfield</span><span class="ci-rfreason">LTC — file complete</span></div>
                  <div class="ci-report-fraud-item clear"><span class="ci-rflag green">7 CLEAR</span><span class="ci-rfid">CLM-2026-0031</span><span class="ci-rfname">Linda Morrison</span><span class="ci-rfreason">Premium waiver — no signals</span></div>
                </div>
              </div>
              <div class="ci-report-section">
                <div class="ci-report-section-title"><i class="fas fa-hourglass-half"></i> Predictive Resolution Timeline</div>
                <div class="ci-res-timeline-list">
                  <div class="ci-rtl-item urgent"><span class="ci-rtl-id">CLM-2026-0041</span><span class="ci-rtl-client">Robert Chen</span><div class="ci-rtl-bar-wrap"><div class="ci-rtl-bar urgent" style="width:85%"></div></div><span class="ci-rtl-eta">~1d</span></div>
                  <div class="ci-rtl-item ok"><span class="ci-rtl-id">CLM-2026-0033</span><span class="ci-rtl-client">James Whitfield</span><div class="ci-rtl-bar-wrap"><div class="ci-rtl-bar ok" style="width:80%"></div></div><span class="ci-rtl-eta">~3d</span></div>
                  <div class="ci-rtl-item normal"><span class="ci-rtl-id">CLM-2026-0038</span><span class="ci-rtl-client">Sandra Williams</span><div class="ci-rtl-bar-wrap"><div class="ci-rtl-bar normal" style="width:45%"></div></div><span class="ci-rtl-eta">~8d</span></div>
                  <div class="ci-rtl-item urgent"><span class="ci-rtl-id">CLM-2026-0028</span><span class="ci-rtl-client">Maria Gonzalez</span><div class="ci-rtl-bar-wrap"><div class="ci-rtl-bar urgent" style="width:70%"></div></div><span class="ci-rtl-eta">~9d</span></div>
                  <div class="ci-rtl-item watch"><span class="ci-rtl-id">CLM-2026-0035</span><span class="ci-rtl-client">Maria Gonzalez</span><div class="ci-rtl-bar-wrap"><div class="ci-rtl-bar watch" style="width:30%"></div></div><span class="ci-rtl-eta">~21d</span></div>
                  <div class="ci-rtl-item flagged"><span class="ci-rtl-id">CLM-2026-0025</span><span class="ci-rtl-client">Kevin Park</span><div class="ci-rtl-bar-wrap"><div class="ci-rtl-bar flagged" style="width:15%"></div></div><span class="ci-rtl-eta">HOLD</span></div>
                </div>
              </div>
              <div class="ci-report-section ci-report-full-width">
                <div class="ci-report-section-title"><i class="fas fa-file-alt"></i> NLP Document Analysis</div>
                <div class="ci-nlp-findings">
                  <div class="ci-nlp-item"><span class="ci-nlp-badge red">Inconsistency</span><span class="ci-nlp-text">CLM-2026-0028: Terminal illness certification — date discrepancy between diagnosis report (2025-12-10) and oncologist referral (2026-01-15). Requires clarification before payout.</span></div>
                  <div class="ci-nlp-item"><span class="ci-nlp-badge orange">Missing Field</span><span class="ci-nlp-text">CLM-2026-0035: APS form — employer verification section left blank. Auto-reminder drafted and ready to send.</span></div>
                  <div class="ci-nlp-item"><span class="ci-nlp-badge green">Verified</span><span class="ci-nlp-text">CLM-2026-0033: All 4 documents NLP-verified. LTC eligibility certification matches policy terms. Ready for approval.</span></div>
                  <div class="ci-nlp-item"><span class="ci-nlp-badge green">Verified</span><span class="ci-nlp-text">CLM-2026-0041: Death certificate verified against public registry. Cause of death consistent with medical history. Identity docs pending from beneficiary.</span></div>
                </div>
              </div>
            </div>
            <div class="ci-report-actions">
              <button class="btn btn-ai" onclick="sendContextMessage('Full claims intelligence debrief — fraud, NLP findings, resolution forecast for all open claims','claims')"><i class="fas fa-robot"></i> Ask AI Agent</button>
              <button class="btn btn-outline-sm" onclick="closeCIReviewModal()"><i class="fas fa-times"></i> Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Fraud Detail Modal ── */}
      <div class="detail-modal-overlay" id="fraud-modal-overlay" onclick="closeFraudModal()">
        <div class="detail-modal" onclick="event.stopPropagation()">
          <div class="detail-modal-header fraud-modal-header" id="fraud-modal-header">
            <div class="detail-modal-title">
              <span class="detail-modal-icon" style="background:#fef2f2;color:#dc2626"><i class="fas fa-shield-virus"></i></span>
              <div>
                <h3 id="fraud-modal-title">Fraud Risk Analysis</h3>
                <p id="fraud-modal-subtitle" class="detail-modal-sub"></p>
              </div>
            </div>
            <div class="detail-modal-header-actions">
              <button class="detail-modal-close" onclick="closeFraudModal()"><i class="fas fa-times"></i></button>
            </div>
          </div>
          <div class="detail-modal-body" id="fraud-modal-body"></div>
        </div>
      </div>

      {/* ── Fraud Full Report Modal ── */}
      <div class="detail-modal-overlay" id="fraud-report-overlay" onclick="closeFraudReportModal()">
        <div class="detail-modal" onclick="event.stopPropagation()">
          <div class="detail-modal-header" style="border-bottom-color:#dc2626">
            <div class="detail-modal-title">
              <span class="detail-modal-icon" style="background:#fef2f2;color:#dc2626"><i class="fas fa-search-plus"></i></span>
              <div>
                <h3>AI Fraud Detection — Full Report</h3>
                <p class="detail-modal-sub">11 claims analysed · Generated Apr 10, 2026 02:47 AM</p>
              </div>
            </div>
            <button class="detail-modal-close" onclick="closeFraudReportModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="detail-modal-body" id="fraud-report-body"></div>
        </div>
      </div>

      {/* ── Claim Detail Modal ── */}
      <div class="detail-modal-overlay" id="claim-modal-overlay" onclick="closeClaimModal()">
        <div class="detail-modal" onclick="event.stopPropagation()">
          <div class="detail-modal-header claim-modal-header" id="claim-modal-header">
            <div class="detail-modal-title">
              <span class="detail-modal-icon" id="claim-modal-icon"><i class="fas fa-file-medical-alt"></i></span>
              <div>
                <h3 id="claim-modal-title">Claim Details</h3>
                <p id="claim-modal-subtitle" class="detail-modal-sub"></p>
              </div>
            </div>
            <div class="detail-modal-header-actions">
              <div class="detail-modal-tabs" id="claim-modal-tabs">
                <button class="dmt-tab active" onclick="switchClaimTab('view',this)"><i class="fas fa-eye"></i> View Claim</button>
                <button class="dmt-tab ai-tab" onclick="switchClaimTab('ai',this)"><i class="fas fa-robot"></i> AI Analysis</button>
                <button class="dmt-tab ci-tab" onclick="switchClaimTab('ci',this)"><i class="fas fa-brain"></i> Intelligence</button>
              </div>
              <button class="detail-modal-close" onclick="closeClaimModal()"><i class="fas fa-times"></i></button>
            </div>
          </div>
          <div class="detail-modal-body" id="claim-modal-body"></div>
        </div>
      </div>

      {/* ── IDP Document Modal ── */}
      <div class="detail-modal-overlay" id="idp-modal-overlay" onclick="closeIDPModal()">
        <div class="detail-modal idp-modal" onclick="event.stopPropagation()">
          <div class="detail-modal-header" id="idp-modal-header" style="border-bottom-color:#7c3aed">
            <div class="detail-modal-title">
              <span class="detail-modal-icon" style="background:linear-gradient(135deg,#7c3aed,#6d28d9)"><i class="fas fa-file-import"></i></span>
              <div>
                <h3 id="idp-modal-title">IDP — Document Status</h3>
                <p id="idp-modal-subtitle" class="detail-modal-sub"></p>
              </div>
            </div>
            <div class="detail-modal-header-actions">
              <button class="detail-modal-close" onclick="closeIDPModal()"><i class="fas fa-times"></i></button>
            </div>
          </div>
          <div class="detail-modal-body" id="idp-modal-body"></div>
        </div>
      </div>

      {/* ── Proactive Alert Action Modal ── */}
      <div class="detail-modal-overlay" id="pac-modal-overlay" onclick="closePACModal()">
        <div class="detail-modal pac-modal" onclick="event.stopPropagation()">
          <div class="detail-modal-header" id="pac-modal-header">
            <div class="detail-modal-title">
              <span class="detail-modal-icon" id="pac-modal-icon"><i class="fas fa-brain"></i></span>
              <div>
                <h3 id="pac-modal-title">Proactive AI Alert</h3>
                <p id="pac-modal-subtitle" class="detail-modal-sub"></p>
              </div>
            </div>
            <div class="detail-modal-header-actions">
              <button class="detail-modal-close" onclick="closePACModal()"><i class="fas fa-times"></i></button>
            </div>
          </div>
          <div class="detail-modal-body" id="pac-modal-body"></div>
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
          <p>Holistic Agentic AI — Insurance · Investments · Retirement · Advisory Services</p>
        </div>
        <div class="ai-status-indicator">
          <span class="ai-online-dot"></span>
          <span>AI Online · GPT-4 Turbo</span>
        </div>
      </div>

      {/* Domain Insight Strip */}
      <div class="ai-domain-strip">
        <div class="ai-ds-card ins-theme">
          <div class="ai-ds-icon"><i class="fas fa-shield-alt"></i></div>
          <div class="ai-ds-body">
            <div class="ai-ds-label">Insurance Insights</div>
            <div class="ai-ds-val">23 renewals · 7 claims · 4 lapse risks</div>
          </div>
          <button class="btn-ds" onclick="sendQuickMessage('Show me insurance renewal and lapse risks')">Ask AI</button>
        </div>
        <div class="ai-ds-card inv-theme">
          <div class="ai-ds-icon"><i class="fas fa-chart-line"></i></div>
          <div class="ai-ds-body">
            <div class="ai-ds-label">Investment Insights</div>
            <div class="ai-ds-val">$4.2M AUM · 3 portfolio gaps · 2 rebalances due</div>
          </div>
          <button class="btn-ds" onclick="sendQuickMessage('Show investment opportunities and portfolio gaps')">Ask AI</button>
        </div>
        <div class="ai-ds-card ret-theme">
          <div class="ai-ds-icon"><i class="fas fa-umbrella-beach"></i></div>
          <div class="ai-ds-body">
            <div class="ai-ds-label">Retirement Insights</div>
            <div class="ai-ds-val">4 annuity candidates · 2 income gap clients</div>
          </div>
          <button class="btn-ds" onclick="sendQuickMessage('Which clients need retirement planning?')">Ask AI</button>
        </div>
        <div class="ai-ds-card adv-theme">
          <div class="ai-ds-icon"><i class="fas fa-handshake"></i></div>
          <div class="ai-ds-body">
            <div class="ai-ds-label">Advisory Insights</div>
            <div class="ai-ds-val">4 estate planning · 2 UMA candidates · 3 biz reviews</div>
          </div>
          <button class="btn-ds" onclick="sendQuickMessage('Show estate planning and advisory opportunities')">Ask AI</button>
        </div>
      </div>

      <div class="ai-layout">
        {/* Agent Cards */}
        <div class="ai-agents-panel">
          <h3 class="panel-title">Available AI Agents</h3>

          {/* Insurance agents */}
          <div class="agent-domain-label"><i class="fas fa-shield-alt"></i> Insurance</div>

          <div class="agent-card active-agent" onclick="selectAgent('advisor')">
            <div class="agent-card-icon gold"><i class="fas fa-brain"></i></div>
            <div class="agent-card-info">
              <h4>Smart Advisor Agent</h4>
              <p>Analyzes your entire book — insurance, investments, retirement and advisory — to surface the highest-value opportunities</p>
              <div class="agent-tags">
                <span>All Domains</span><span>Cross-sell</span><span>Upsell</span>
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

          <div class="agent-card ci-agent-card" onclick="selectAgent('claims-intelligence')">
            <div class="agent-card-icon ci-agent-icon"><i class="fas fa-brain"></i></div>
            <div class="agent-card-info">
              <h4>Claims Intelligence Agent <span class="agent-new-badge">NEW</span></h4>
              <p>ML fraud detection, NLP document analysis, predictive resolution timers and smart doc request automation</p>
              <div class="agent-tags">
                <span>Fraud Detection</span><span>NLP Analysis</span><span>Smart Triage</span>
              </div>
              <div class="ci-agent-stats">
                <span class="ci-ast red">1 Flagged</span>
                <span class="ci-ast orange">2 Watch</span>
                <span class="ci-ast blue">94% NLP</span>
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

          <div class="agent-card ri-agent-card active-agent" onclick="selectAgent('retention')">
            <div class="agent-card-icon ri-agent-icon"><i class="fas fa-heartbeat"></i></div>
            <div class="agent-card-info">
              <h4>Retention Intelligence Agent <span class="agent-new-badge">NEW</span></h4>
              <p>Predicts policy lapses 60–90 days in advance, monitors cash-value thresholds, scores renewal risk, and auto-generates personalised save scripts</p>
              <div class="agent-tags">
                <span>Lapse Prediction</span><span>Renewal Risk</span><span>Save Scripts</span>
              </div>
              <div class="ri-agent-stats">
                <span class="ri-ast red">2 Urgent</span>
                <span class="ri-ast orange">$62.6K at Risk</span>
                <span class="ri-ast green">23 Renewals</span>
              </div>
            </div>
            <div class="agent-status active"><i class="fas fa-circle"></i> Active</div>
          </div>

          {/* Investments agents */}
          <div class="agent-domain-label inv-label"><i class="fas fa-chart-line"></i> Investments</div>

          <div class="agent-card" onclick="selectAgent('portfolio')">
            <div class="agent-card-icon inv-green"><i class="fas fa-coins"></i></div>
            <div class="agent-card-info">
              <h4>Portfolio Optimizer Agent</h4>
              <p>Monitors AUM, identifies rebalancing opportunities, recommends annuities, mutual funds, ETFs and 529 plans</p>
              <div class="agent-tags">
                <span>AUM Monitoring</span><span>Rebalancing</span><span>529</span>
              </div>
            </div>
            <div class="agent-status active"><i class="fas fa-circle"></i> Active</div>
          </div>

          {/* Retirement agents */}
          <div class="agent-domain-label ret-label"><i class="fas fa-umbrella-beach"></i> Retirement</div>

          <div class="agent-card" onclick="selectAgent('retirement')">
            <div class="agent-card-icon ret-gold"><i class="fas fa-piggy-bank"></i></div>
            <div class="agent-card-info">
              <h4>Retirement Planning Agent</h4>
              <p>Identifies clients approaching retirement, calculates income gaps, and recommends immediate or deferred annuities</p>
              <div class="agent-tags">
                <span>Income Gap</span><span>Annuities</span><span>Projections</span>
              </div>
            </div>
            <div class="agent-status active"><i class="fas fa-circle"></i> Active</div>
          </div>

          {/* Advisory agents */}
          <div class="agent-domain-label adv-label"><i class="fas fa-handshake"></i> Advisory</div>

          <div class="agent-card" onclick="selectAgent('estate')">
            <div class="agent-card-icon purple"><i class="fas fa-landmark"></i></div>
            <div class="agent-card-info">
              <h4>Estate Planning Agent</h4>
              <p>Identifies estate planning needs, generates client-ready briefs, and coordinates trust and wealth reviews</p>
              <div class="agent-tags">
                <span>Estate Analysis</span><span>Trust Review</span><span>UMA</span>
              </div>
            </div>
            <div class="agent-status standby"><i class="fas fa-circle"></i> Standby</div>
          </div>

          <div class="agent-card" onclick="selectAgent('business')">
            <div class="agent-card-icon orange"><i class="fas fa-building"></i></div>
            <div class="agent-card-info">
              <h4>Business Services Agent</h4>
              <p>Handles small business insurance, executive benefits, NQDC, COLI, and employee benefits design</p>
              <div class="agent-tags">
                <span>SMB Insurance</span><span>NQDC</span><span>COLI</span>
              </div>
            </div>
            <div class="agent-status standby"><i class="fas fa-circle"></i> Standby</div>
          </div>

          <div class="agent-card" onclick="selectAgent('compliance')">
            <div class="agent-card-icon red"><i class="fas fa-shield-alt"></i></div>
            <div class="agent-card-info">
              <h4>Compliance & Reporting Agent</h4>
              <p>Automates regulatory reporting, flags compliance risks across all product lines, and generates audit-ready docs</p>
              <div class="agent-tags">
                <span>Regulatory</span><span>Audit</span><span>Risk</span>
              </div>
            </div>
            <div class="agent-status standby"><i class="fas fa-circle"></i> Standby</div>
          </div>

          {/* NLP Policy Risk Expert — NEW */}
          <div class="agent-domain-label nlp-label"><i class="fas fa-brain"></i> NLP Policy Intelligence</div>

          <div class="agent-card nlp-agent-card active-agent" onclick="openNLPReview('all')">
            <div class="agent-card-icon nlp-purple"><i class="fas fa-brain"></i></div>
            <div class="agent-card-info">
              <h4>NLP Policy Risk Expert <span class="agent-new-badge">NEW</span></h4>
              <p>Reads every policy clause with NLP — flags exclusions, ambiguities, regulatory risks, and lapse triggers. Generates plain-language client summaries and benchmarks against industry standards.</p>
              <div class="agent-tags">
                <span>Clause Analysis</span><span>Risk Flags</span><span>Plain Language</span><span>Benchmark</span>
              </div>
              <div class="nlp-agent-stats">
                <span class="nlp-as-chip red"><i class="fas fa-exclamation-circle"></i> 2 Urgent</span>
                <span class="nlp-as-chip orange"><i class="fas fa-flag"></i> 3 Flagged</span>
                <span class="nlp-as-chip blue"><i class="fas fa-file-contract"></i> 8 Scanned</span>
              </div>
            </div>
            <div class="agent-status active"><i class="fas fa-circle"></i> Active</div>
          </div>
        </div>

        {/* Chat Interface */}
        <div class="ai-chat-panel">
          <div class="chat-header">
            <div class="chat-agent-info">
              <div class="chat-agent-icon" id="chat-agent-icon-wrap"><i class="fas fa-robot"></i></div>
              <div>
                <h4 id="chat-agent-name">Smart Advisor Agent</h4>
                <p id="chat-agent-sub">Insurance · Investments · Retirement · Advisory</p>
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
                <p>Hello Sridhar! I'm your <strong>NYL Smart Advisor AI Agent</strong>. I've analyzed your complete book of business across all four service domains.</p>
                <p>Here's what I can do for you today:</p>
                <ul>
                  <li>🛡️ <strong>Insurance:</strong> Renewals, claims, lapse risk, new coverage gaps</li>
                  <li>📈 <strong>Investments:</strong> AUM opportunities, portfolio rebalancing, annuity candidates</li>
                  <li>🏖️ <strong>Retirement:</strong> Income gap analysis, deferred/immediate annuity candidates</li>
                  <li>🤝 <strong>Advisory:</strong> Estate planning, wealth management, business services</li>
                  <li>📊 Cross-domain performance reports and commission tracking</li>
                  <li>✉️ Draft personalized multi-product client communications</li>
                </ul>
                <p>What would you like to explore?</p>
                <div class="quick-suggestions">
                  <button onclick="sendQuickMessage('Show me upsell opportunities')">All opportunities</button>
                  <button onclick="sendQuickMessage('Which policies are up for renewal?')">Renewals due</button>
                  <button onclick="sendQuickMessage('Which clients need retirement planning?')">Retirement gaps</button>
                  <button onclick="sendQuickMessage('Show estate planning opportunities')">Estate planning</button>
                  <button onclick="sendQuickMessage('Show investment opportunities and portfolio gaps')">Investment gaps</button>
                  <button onclick="sendQuickMessage('Summarize my dashboard for today')">Daily summary</button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Context Button Toolbar ── */}
          <div class="ctx-btn-toolbar" id="ctx-btn-toolbar">

            {/* Clients */}
            <div class="ctx-group">
              <span class="ctx-group-label"><i class="fas fa-users"></i> Clients</span>
              <div class="ctx-btns">
                <button class="ctx-btn ctx-ins" onclick="sendQuickMessage('Analyze Linda Morrison full portfolio — insurance, investments, estate')">Linda Morrison</button>
                <button class="ctx-btn ctx-ins" onclick="sendQuickMessage('Analyze James Whitfield retirement planning and LTC claim status')">James Whitfield</button>
                <button class="ctx-btn ctx-inv" onclick="sendQuickMessage('Analyze Robert Chen estate planning and $1M death benefit claim CLM-2026-0041')">Robert Chen</button>
                <button class="ctx-btn ctx-inv" onclick="sendQuickMessage('Analyze Maria Gonzalez ADB claim and annuity opportunity')">Maria Gonzalez</button>
                <button class="ctx-btn ctx-ret" onclick="sendQuickMessage('Show all high-value client opportunities across insurance, investments and advisory')">All High-Value</button>
              </div>
            </div>

            {/* Pipeline */}
            <div class="ctx-group">
              <span class="ctx-group-label"><i class="fas fa-funnel-dollar"></i> Pipeline</span>
              <div class="ctx-btns">
                <button class="ctx-btn ctx-ins" onclick="sendQuickMessage('Show all active underwriting cases and STP scores')">UW Cases</button>
                <button class="ctx-btn ctx-ins" onclick="sendQuickMessage('Which underwriting cases can be auto-approved today?')">Auto-Approve Ready</button>
                <button class="ctx-btn ctx-inv" onclick="sendQuickMessage('Show full sales pipeline — value, conversion rate, and top opportunities')">Sales Pipeline</button>
                <button class="ctx-btn ctx-ret" onclick="sendQuickMessage('Which prospects are most likely to close this month?')">Close This Month</button>
                <button class="ctx-btn ctx-adv" onclick="sendQuickMessage('Run AI scan on all pending underwriting cases and flag any APS requirements')">Run AI Scan</button>
              </div>
            </div>

            {/* Meetings */}
            <div class="ctx-group">
              <span class="ctx-group-label"><i class="fas fa-calendar-alt"></i> Meetings</span>
              <div class="ctx-btns">
                <button class="ctx-btn ctx-ins" onclick="sendQuickMessage('Generate pre-meeting brief for Linda Morrison annual review on Apr 15')">Linda Apr 15</button>
                <button class="ctx-btn ctx-ins" onclick="sendQuickMessage('Generate pre-meeting brief for Sandra Williams policy renewal on Apr 28')">Sandra Apr 28</button>
                <button class="ctx-btn ctx-inv" onclick="sendQuickMessage('What are the key talking points for the Alex Rivera prospect meeting on Apr 12?')">Alex Apr 12</button>
                <button class="ctx-btn ctx-ret" onclick="sendQuickMessage('Summarize follow-up actions from the Maria Gonzalez annuity meeting on Apr 5')">Post: Maria Apr 5</button>
                <button class="ctx-btn ctx-adv" onclick="sendQuickMessage('What follow-ups are outstanding from the Patricia Nguyen UL review meeting?')">Post: Patricia Apr 3</button>
              </div>
            </div>

            {/* Claims */}
            <div class="ctx-group">
              <span class="ctx-group-label"><i class="fas fa-clipboard-check"></i> Claims</span>
              <div class="ctx-btns">
                <button class="ctx-btn ctx-urgent" onclick="sendQuickMessage('Give me full status on Robert Chen $1M death benefit claim CLM-2026-0041 — what is needed to expedite?')">CLM-0041 Urgent</button>
                <button class="ctx-btn ctx-urgent" onclick="sendQuickMessage('Maria Gonzalez ADB claim CLM-2026-0028 — how do I expedite the oncologist certification?')">ADB: Maria Urgent</button>
                <button class="ctx-btn ctx-ins" onclick="sendQuickMessage('Show all open claims and their current status')">All Open Claims</button>
                <button class="ctx-btn ctx-ins" onclick="sendQuickMessage('Which claims have pending documents and what actions are needed?')">Pending Docs</button>
                <button class="ctx-btn ctx-inv" onclick="sendQuickMessage('Draft a compassionate follow-up email to Susan Chen regarding the $1M death benefit claim')">Draft: Susan Chen</button>
              </div>
            </div>

            {/* Claims Intelligence */}
            <div class="ctx-group ci-ctx-group">
              <span class="ctx-group-label ci-ctx-label"><i class="fas fa-brain"></i> Claims Intelligence</span>
              <div class="ctx-btns">
                <button class="ctx-btn ctx-fraud" onclick="sendQuickMessage('Run full fraud analysis on all open claims — rank by risk score with ML signal breakdown')">Fraud Analysis</button>
                <button class="ctx-btn ctx-fraud" onclick="sendQuickMessage('CLM-2026-0025 Kevin Park — what are the fraud indicators and what investigation steps are needed?')">CLM-0025 Fraud</button>
                <button class="ctx-btn ctx-ci" onclick="sendQuickMessage('Predict resolution timelines for all 7 open claims based on document completeness and claim type')">Predict Resolution</button>
                <button class="ctx-btn ctx-ci" onclick="sendQuickMessage('Which claims should I send automated document reminders to today? Draft the messages.')">Smart Doc Reminders</button>
                <button class="ctx-btn ctx-ci" onclick="sendQuickMessage('NLP document analysis — flag any inconsistencies in claim documents across all open claims')">NLP Doc Analysis</button>
              </div>
            </div>

            {/* Retention */}
            <div class="ctx-group">
              <span class="ctx-group-label"><i class="fas fa-heartbeat"></i> Retention</span>
              <div class="ctx-btns">
                <button class="ctx-btn ctx-urgent" onclick="sendQuickMessage('Patricia Nguyen UL lapse risk — what is the catch-up premium plan and timeline?')">Patricia Lapse</button>
                <button class="ctx-btn ctx-urgent" onclick="sendQuickMessage('Sandra Williams term renewal — what is the conversion window and what should I present?')">Sandra Renewal</button>
                <button class="ctx-btn ctx-ins" onclick="sendQuickMessage('Show all 4 lapse-risk clients with risk scores and recommended actions')">All Lapse Risks</button>
                <button class="ctx-btn ctx-inv" onclick="sendQuickMessage('Which retention actions have the highest ROI — rank by premium at risk')">Highest ROI</button>
                <button class="ctx-btn ctx-ret" onclick="sendQuickMessage('Draft a retention email for Sandra Williams about converting her term policy before expiry')">Draft: Sandra Email</button>
              </div>
            </div>

            {/* Retention Intelligence */}
            <div class="ctx-group ri-ctx-group">
              <span class="ctx-group-label ri-ctx-label"><i class="fas fa-heartbeat"></i> Retention Intelligence</span>
              <div class="ctx-btns">
                <button class="ctx-btn ctx-ri" onclick="openRetentionModal('ret-patricia')">Patricia Risk 87 ⚡</button>
                <button class="ctx-btn ctx-ri" onclick="openRetentionModal('ret-sandra')">Sandra Renewal ⚡</button>
                <button class="ctx-btn ctx-ri" onclick="sendQuickMessage('Run full retention intelligence scan — score all 247 clients for lapse risk, renewal risk, and coverage gaps')">Full RI Scan</button>
                <button class="ctx-btn ctx-ri" onclick="sendQuickMessage('Generate personalised save scripts for all high-risk clients based on their trigger type')">Gen Save Scripts</button>
                <button class="ctx-btn ctx-ri" onclick="openRetentionFullReport()">Lapse Report</button>
              </div>
            </div>

            {/* Reports */}
            <div class="ctx-group">
              <span class="ctx-group-label"><i class="fas fa-chart-bar"></i> Reports</span>
              <div class="ctx-btns">
                <button class="ctx-btn ctx-ret" onclick="sendQuickMessage('Summarize my dashboard for today — performance, alerts, and priority actions')">Today's Dashboard</button>
                <button class="ctx-btn ctx-adv" onclick="sendQuickMessage('Show Q1 2026 performance summary — commissions, conversion rate, STP improvements')">Q1 Performance</button>
                <button class="ctx-btn ctx-inv" onclick="sendQuickMessage('What is my total revenue opportunity across all domains — rank by value')">Revenue Opportunity</button>
                <button class="ctx-btn ctx-ins" onclick="sendQuickMessage('Generate a week-ahead action plan for April 14-18 2026')">Week Ahead Plan</button>
                <button class="ctx-btn ctx-adv" onclick="sendQuickMessage('Which clients should I prioritize for outreach this week and why?')">Priority Outreach</button>
              </div>
            </div>

            {/* NLP Policy Review */}
            <div class="ctx-group">
              <span class="ctx-group-label nlp-ctx-label"><i class="fas fa-brain"></i> NLP Policy Review</span>
              <div class="ctx-btns">
                <button class="ctx-btn ctx-nlp" onclick="openNLPReview('P-100301')">Patricia — UL Risk ⚠</button>
                <button class="ctx-btn ctx-nlp" onclick="openNLPReview('P-100320')">Sandra — Term Renewal ⚠</button>
                <button class="ctx-btn ctx-nlp" onclick="openNLPReview('P-100330')">Linda — Flagship WL</button>
                <button class="ctx-btn ctx-nlp" onclick="openNLPReview('P-100291')">James — Whole Life</button>
                <button class="ctx-btn ctx-nlp" onclick="openNLPReview('all')">Full Portfolio Scan</button>
              </div>
            </div>

          </div>

          <div class="chat-input-area">
            <div class="chat-input-row">
              <input
                type="text"
                id="chat-input"
                placeholder="Ask anything across all 4 service domains..."
                onkeydown="handleChatKey(event)"
              />
              <button class="btn-send" onclick="sendChatMessage()">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
            <div class="chat-input-hints">
              <span onclick="sendQuickMessage('Show me all cross-sell opportunities across 247 clients')"><i class="fas fa-bolt"></i> Cross-sell</span>
              <span onclick="sendQuickMessage('Which clients have the highest revenue potential right now?')"><i class="fas fa-dollar-sign"></i> Revenue</span>
              <span onclick="sendQuickMessage('Show open claims status and any urgent actions needed')"><i class="fas fa-file-alt"></i> Claims</span>
              <span onclick="sendQuickMessage('Show investment portfolio gaps and rebalancing opportunities')"><i class="fas fa-chart-line"></i> Investments</span>
              <span onclick="sendQuickMessage('Generate a client communication for the top retention risk')"><i class="fas fa-envelope"></i> Draft Email</span>
            </div>
          </div>
        </div>
      </div>

      {/* Automation Workflows — holistic */}
      <div class="automation-section">
        <h3><i class="fas fa-magic"></i> Active Automation Workflows — All Domains</h3>
        <div class="workflow-grid">
          <div class="workflow-card running">
            <div class="wf-domain-tag ins-tag"><i class="fas fa-shield-alt"></i> Insurance</div>
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
            <div class="wf-domain-tag ins-tag"><i class="fas fa-shield-alt"></i> Insurance</div>
            <div class="wf-status"><span class="pulse-dot"></span> Running</div>
            <div class="wf-icon"><i class="fas fa-chart-line"></i></div>
            <h4>Portfolio Health Monitor</h4>
            <p>Continuously monitoring 1,842 policies for lapse risk, coverage gaps, and opportunities</p>
            <div class="wf-progress">
              <div class="wf-progress-bar" style="width: 100%"></div>
              <span>Always On</span>
            </div>
          </div>
          <div class="workflow-card running">
            <div class="wf-domain-tag inv-tag"><i class="fas fa-chart-line"></i> Investments</div>
            <div class="wf-status"><span class="pulse-dot"></span> Running</div>
            <div class="wf-icon"><i class="fas fa-balance-scale"></i></div>
            <h4>AUM Rebalancing Monitor</h4>
            <p>Tracks drift in $4.2M AUM across 62 investment clients; flags rebalancing needs</p>
            <div class="wf-progress">
              <div class="wf-progress-bar" style="width: 100%;background:#059669"></div>
              <span>2 rebalances pending</span>
            </div>
          </div>
          <div class="workflow-card running">
            <div class="wf-domain-tag ret-tag"><i class="fas fa-umbrella-beach"></i> Retirement</div>
            <div class="wf-status"><span class="pulse-dot"></span> Running</div>
            <div class="wf-icon"><i class="fas fa-piggy-bank"></i></div>
            <h4>Retirement Income Gap Scan</h4>
            <p>Analyzes clients aged 50+ for retirement income shortfalls and annuity suitability</p>
            <div class="wf-progress">
              <div class="wf-progress-bar" style="width:100%;background:#d97706"></div>
              <span>4 candidates found</span>
            </div>
          </div>
          <div class="workflow-card paused">
            <div class="wf-domain-tag ins-tag"><i class="fas fa-shield-alt"></i> Insurance</div>
            <div class="wf-status paused">Paused</div>
            <div class="wf-icon"><i class="fas fa-birthday-cake"></i></div>
            <h4>Life Events Trigger</h4>
            <p>Detects life events (marriage, birth, retirement) and suggests appropriate coverage updates</p>
            <div class="wf-stats">3 events detected this month</div>
          </div>
          <div class="workflow-card paused">
            <div class="wf-domain-tag adv-tag"><i class="fas fa-handshake"></i> Advisory</div>
            <div class="wf-status paused">Paused</div>
            <div class="wf-icon"><i class="fas fa-landmark"></i></div>
            <h4>Estate Planning Trigger</h4>
            <p>Flags clients with $1M+ total assets or business ownership for estate planning review</p>
            <div class="wf-stats">4 clients qualified</div>
          </div>
          <div class="workflow-card idle">
            <div class="wf-domain-tag ins-tag"><i class="fas fa-shield-alt"></i> Insurance</div>
            <div class="wf-status idle">Idle</div>
            <div class="wf-icon"><i class="fas fa-file-signature"></i></div>
            <h4>Claims Triage Automation</h4>
            <p>Routes incoming claims to appropriate teams and requests required documentation automatically</p>
            <div class="wf-stats">7 open claims tracked</div>
          </div>
          <div class="workflow-card idle">
            <div class="wf-domain-tag adv-tag"><i class="fas fa-handshake"></i> Advisory</div>
            <div class="wf-status idle">Idle</div>
            <div class="wf-icon"><i class="fas fa-briefcase"></i></div>
            <h4>Business Client Review</h4>
            <p>Scans business-owner clients for NQDC, COLI, key-person and group benefits gaps</p>
            <div class="wf-stats">2 business clients eligible</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
//  UNDERWRITING PAGE  (#4)
// ============================================================
function UnderwritingPage() {
  return (
    <div class="page underwriting-page">

      {/* ── KPI Strip ── */}
      <div class="uw-kpi-strip">
        <div class="uw-kpi">
          <div class="uw-kpi-icon blue"><i class="fas fa-microscope"></i></div>
          <div class="uw-kpi-data">
            <div class="uw-kpi-val">4.2 hrs</div>
            <div class="uw-kpi-lbl">Avg Decision Time</div>
            <div class="uw-kpi-delta green"><i class="fas fa-arrow-down"></i> vs 8 days manual</div>
          </div>
        </div>
        <div class="uw-kpi">
          <div class="uw-kpi-icon green"><i class="fas fa-bolt"></i></div>
          <div class="uw-kpi-data">
            <div class="uw-kpi-val">73%</div>
            <div class="uw-kpi-lbl">STP Rate</div>
            <div class="uw-kpi-delta green"><i class="fas fa-arrow-up"></i> +18% vs last quarter</div>
          </div>
        </div>
        <div class="uw-kpi">
          <div class="uw-kpi-icon purple"><i class="fas fa-file-medical"></i></div>
          <div class="uw-kpi-data">
            <div class="uw-kpi-val">18</div>
            <div class="uw-kpi-lbl">APS Avoided / Month</div>
            <div class="uw-kpi-delta green"><i class="fas fa-arrow-up"></i> AI evidence substitution</div>
          </div>
        </div>
        <div class="uw-kpi">
          <div class="uw-kpi-icon gold"><i class="fas fa-layer-group"></i></div>
          <div class="uw-kpi-data">
            <div class="uw-kpi-val">11</div>
            <div class="uw-kpi-lbl">Cases In Pipeline</div>
            <div class="uw-kpi-delta orange"><i class="fas fa-dot-circle"></i> 4 need attention</div>
          </div>
        </div>
        <div class="uw-kpi">
          <div class="uw-kpi-icon teal"><i class="fas fa-shield-check"></i></div>
          <div class="uw-kpi-data">
            <div class="uw-kpi-val">94.6%</div>
            <div class="uw-kpi-lbl">AI Accuracy</div>
            <div class="uw-kpi-delta green"><i class="fas fa-robot"></i> vs 89% manual</div>
          </div>
        </div>
      </div>

      {/* ── AI STP Engine Banner ── */}
      <div class="uw-stp-banner">
        <div class="uw-stp-left">
          <div class="uw-stp-icon"><i class="fas fa-robot"></i></div>
          <div>
            <div class="uw-stp-title">AI Straight-Through Processing Engine</div>
            <div class="uw-stp-sub">Automatically scores applications using rx history, MIB, motor vehicle, credit, and lab data · No APS needed for scores ≥ 75</div>
          </div>
        </div>
        <div class="uw-stp-stats">
          <div class="uw-stp-stat"><span class="uw-stp-val green">5</span><span class="uw-stp-lbl">Auto-Approved</span></div>
          <div class="uw-stp-stat"><span class="uw-stp-val gold">4</span><span class="uw-stp-lbl">Under Review</span></div>
          <div class="uw-stp-stat"><span class="uw-stp-val orange">2</span><span class="uw-stp-lbl">APS Required</span></div>
          <div class="uw-stp-stat"><span class="uw-stp-val blue">30–50%</span><span class="uw-stp-lbl">Faster vs Manual</span></div>
        </div>
        <button class="btn-uw-scan" onclick="runUWScan()"><i class="fas fa-sync-alt"></i> Run AI Scan</button>
      </div>

      {/* ── AI Enrollment Automation Banner ── */}
      <div class="eapp-uw-banner">
        <div class="eapp-uw-banner-left">
          <div class="eapp-uw-icon"><i class="fas fa-file-contract"></i></div>
          <div>
            <div class="eapp-uw-title">AI Automated Enrollment Engine <span class="eapp-live-badge">LIVE</span></div>
            <div class="eapp-uw-sub">Auto-prefills E-App forms using client profile, health data, and policy details · Reduces data entry by 87% · Average enrollment: 4 min (vs 35 min manual)</div>
          </div>
        </div>
        <div class="eapp-uw-stats">
          <div class="eapp-uw-stat"><span class="eapp-uw-val green">5</span><span class="eapp-uw-lbl">Auto-Prefilled</span></div>
          <div class="eapp-uw-stat"><span class="eapp-uw-val blue">2</span><span class="eapp-uw-lbl">Awaiting Sig.</span></div>
          <div class="eapp-uw-stat"><span class="eapp-uw-val gold">87%</span><span class="eapp-uw-lbl">Fields Auto-Filled</span></div>
          <div class="eapp-uw-stat"><span class="eapp-uw-val purple">4 min</span><span class="eapp-uw-lbl">Avg. Enrollment</span></div>
        </div>
        <button class="eapp-uw-launch-btn" onclick="openEApp('EA-NEW')"><i class="fas fa-plus"></i> New E-App</button>
      </div>

      {/* ── Pipeline Board ── */}
      <div class="uw-pipeline">

        {/* Stage 1: Application Received */}
        <div class="uw-stage">
          <div class="uw-stage-header received">
            <span><i class="fas fa-inbox"></i> Application Received</span>
            <span class="uw-stage-count">3</span>
          </div>
          <div class="uw-case-card" onclick="openUWModal('UW-2026-0018')">
            <div class="uw-case-header">
              <div class="uw-case-client">Alex Rivera</div>
              <div class="uw-stp-score stp-high">STP 88</div>
            </div>
            <div class="uw-case-product">Whole Life — $500K · $4,800/yr</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Received Apr 10 · Age 34</div>
            <div class="uw-evidence-bar">
              <span class="uw-ev ev-done" title="Rx History">Rx ✓</span>
              <span class="uw-ev ev-done" title="MIB Check">MIB ✓</span>
              <span class="uw-ev ev-done" title="Motor Vehicle">MVR ✓</span>
              <span class="uw-ev ev-pending" title="Credit">Credit…</span>
            </div>
            <div class="uw-case-footer">
              <span class="uw-status-pill received">New</span>
              <span class="uw-ai-rec auto"><i class="fas fa-bolt"></i> Auto-Approve Eligible</span>
            </div>
          </div>
          <div class="uw-case-card" onclick="openUWModal('UW-2026-0017')">
            <div class="uw-case-header">
              <div class="uw-case-client">Nancy Foster</div>
              <div class="uw-stp-score stp-high">STP 82</div>
            </div>
            <div class="uw-case-product">Term Life — $1M · $3,200/yr</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Received Apr 9 · Age 41</div>
            <div class="uw-evidence-bar">
              <span class="uw-ev ev-done">Rx ✓</span>
              <span class="uw-ev ev-done">MIB ✓</span>
              <span class="uw-ev ev-pending">MVR…</span>
              <span class="uw-ev ev-pending">Credit…</span>
            </div>
            <div class="uw-case-footer">
              <span class="uw-status-pill received">New</span>
              <span class="uw-ai-rec review"><i class="fas fa-search"></i> Review Pending</span>
            </div>
          </div>
          <div class="uw-case-card" onclick="openUWModal('UW-2026-0016')">
            <div class="uw-case-header">
              <div class="uw-case-client">John Kim</div>
              <div class="uw-stp-score stp-med">STP 61</div>
            </div>
            <div class="uw-case-product">Disability Ins. · $2,100/yr</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Received Apr 8 · Age 38</div>
            <div class="uw-evidence-bar">
              <span class="uw-ev ev-done">Rx ✓</span>
              <span class="uw-ev ev-flag">MIB ⚠</span>
              <span class="uw-ev ev-pending">MVR…</span>
              <span class="uw-ev ev-pending">Credit…</span>
            </div>
            <div class="uw-case-footer">
              <span class="uw-status-pill received">New</span>
              <span class="uw-ai-rec aps"><i class="fas fa-file-medical"></i> APS Required</span>
            </div>
          </div>
        </div>

        {/* Stage 2: Evidence Gathering */}
        <div class="uw-stage">
          <div class="uw-stage-header evidence">
            <span><i class="fas fa-search-plus"></i> Evidence Gathering</span>
            <span class="uw-stage-count">3</span>
          </div>
          <div class="uw-case-card" onclick="openUWModal('UW-2026-0015')">
            <div class="uw-case-header">
              <div class="uw-case-client">Michael Santos</div>
              <div class="uw-stp-score stp-high">STP 79</div>
            </div>
            <div class="uw-case-product">Universal Life — $750K · $6,400/yr</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Apr 5 · Age 47 · Hot Lead</div>
            <div class="uw-evidence-bar">
              <span class="uw-ev ev-done">Rx ✓</span>
              <span class="uw-ev ev-done">MIB ✓</span>
              <span class="uw-ev ev-done">MVR ✓</span>
              <span class="uw-ev ev-pending">Lab…</span>
            </div>
            <div class="uw-case-footer">
              <span class="uw-status-pill evidence">In Progress</span>
              <span class="uw-ai-rec auto"><i class="fas fa-bolt"></i> Near Auto-Approve</span>
            </div>
          </div>
          <div class="uw-case-card" onclick="openUWModal('UW-2026-0014')">
            <div class="uw-case-header">
              <div class="uw-case-client">Julia Chen</div>
              <div class="uw-stp-score stp-low">STP 44</div>
            </div>
            <div class="uw-case-product">Annuity Deferred · $8,000/yr</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Apr 3 · Age 58</div>
            <div class="uw-evidence-bar">
              <span class="uw-ev ev-done">Rx ✓</span>
              <span class="uw-ev ev-flag">MIB ⚠</span>
              <span class="uw-ev ev-flag">Lab ⚠</span>
              <span class="uw-ev ev-pending">APS…</span>
            </div>
            <div class="uw-case-footer">
              <span class="uw-status-pill evidence">In Progress</span>
              <span class="uw-ai-rec aps"><i class="fas fa-file-medical"></i> APS Required</span>
            </div>
          </div>
          <div class="uw-case-card" onclick="openUWModal('UW-2026-0013')">
            <div class="uw-case-header">
              <div class="uw-case-client">Rachel Adams</div>
              <div class="uw-stp-score stp-high">STP 85</div>
            </div>
            <div class="uw-case-product">Whole Life — $300K · $3,600/yr</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Apr 1 · Age 29</div>
            <div class="uw-evidence-bar">
              <span class="uw-ev ev-done">Rx ✓</span>
              <span class="uw-ev ev-done">MIB ✓</span>
              <span class="uw-ev ev-done">MVR ✓</span>
              <span class="uw-ev ev-done">Credit ✓</span>
            </div>
            <div class="uw-case-footer">
              <span class="uw-status-pill evidence">In Progress</span>
              <span class="uw-ai-rec auto"><i class="fas fa-bolt"></i> Auto-Approve Eligible</span>
            </div>
          </div>
        </div>

        {/* Stage 3: AI Review */}
        <div class="uw-stage">
          <div class="uw-stage-header ai-review">
            <span><i class="fas fa-robot"></i> AI Review</span>
            <span class="uw-stage-count">2</span>
          </div>
          <div class="uw-case-card" onclick="openUWModal('UW-2026-0012')">
            <div class="uw-case-header">
              <div class="uw-case-client">Thomas Wright</div>
              <div class="uw-stp-score stp-high">STP 91</div>
            </div>
            <div class="uw-case-product">Whole Life — $1M · $9,600/yr</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Mar 28 · Age 52 · Medical Exam Done</div>
            <div class="uw-evidence-bar">
              <span class="uw-ev ev-done">Rx ✓</span>
              <span class="uw-ev ev-done">MIB ✓</span>
              <span class="uw-ev ev-done">MVR ✓</span>
              <span class="uw-ev ev-done">Lab ✓</span>
            </div>
            <div class="uw-case-footer">
              <span class="uw-status-pill ai-review">AI Scoring</span>
              <span class="uw-ai-rec auto"><i class="fas fa-bolt"></i> STP Auto-Approve</span>
            </div>
          </div>
          <div class="uw-case-card" onclick="openUWModal('UW-2026-0011')">
            <div class="uw-case-header">
              <div class="uw-case-client">Grace Lee</div>
              <div class="uw-stp-score stp-med">STP 67</div>
            </div>
            <div class="uw-case-product">VUL — $250K · $3,800/yr</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Mar 25 · Age 44</div>
            <div class="uw-evidence-bar">
              <span class="uw-ev ev-done">Rx ✓</span>
              <span class="uw-ev ev-done">MIB ✓</span>
              <span class="uw-ev ev-flag">Lab ⚠</span>
              <span class="uw-ev ev-pending">APS…</span>
            </div>
            <div class="uw-case-footer">
              <span class="uw-status-pill ai-review">AI Scoring</span>
              <span class="uw-ai-rec review"><i class="fas fa-search"></i> Manual Review Needed</span>
            </div>
          </div>
        </div>

        {/* Stage 4: Decision */}
        <div class="uw-stage">
          <div class="uw-stage-header decision">
            <span><i class="fas fa-gavel"></i> Decision</span>
            <span class="uw-stage-count">1</span>
          </div>
          <div class="uw-case-card urgent-case" onclick="openUWModal('UW-2026-0010')">
            <div class="uw-case-header">
              <div class="uw-case-client">David Thompson</div>
              <div class="uw-stp-score stp-high">STP 78</div>
            </div>
            <div class="uw-case-product">Term Life — $300K · $2,400/yr</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Mar 20 · Age 33 · Decision Due Today</div>
            <div class="uw-evidence-bar">
              <span class="uw-ev ev-done">Rx ✓</span>
              <span class="uw-ev ev-done">MIB ✓</span>
              <span class="uw-ev ev-done">MVR ✓</span>
              <span class="uw-ev ev-done">Credit ✓</span>
            </div>
            <div class="uw-case-footer">
              <span class="uw-status-pill decision">Pending Decision</span>
              <span class="uw-ai-rec auto"><i class="fas fa-bolt"></i> Approve Recommended</span>
            </div>
          </div>
        </div>

        {/* Stage 5: Approved */}
        <div class="uw-stage">
          <div class="uw-stage-header approved">
            <span><i class="fas fa-check-circle"></i> Approved</span>
            <span class="uw-stage-count">2</span>
          </div>
          <div class="uw-case-card" onclick="openUWModal('UW-2026-0009')">
            <div class="uw-case-header">
              <div class="uw-case-client">Linda Morrison</div>
              <div class="uw-stp-score stp-high">STP 99</div>
            </div>
            <div class="uw-case-product">WL Rider Add-on · $1,200/yr</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Mar 18 · Age 56 · STP Auto</div>
            <div class="uw-evidence-bar">
              <span class="uw-ev ev-done">Rx ✓</span>
              <span class="uw-ev ev-done">MIB ✓</span>
              <span class="uw-ev ev-done">MVR ✓</span>
              <span class="uw-ev ev-done">Lab ✓</span>
            </div>
            <div class="uw-case-footer">
              <span class="uw-status-pill approved">Approved</span>
              <span class="uw-ai-rec issued"><i class="fas fa-file-signature"></i> Awaiting Signature</span>
            </div>
            <button class="uw-eapp-btn" onclick="event.stopPropagation();openEApp('EA-UW-009')"><i class="fas fa-file-contract"></i> Open E-App <span class="uw-eapp-ai-tag">AI 100%</span></button>
          </div>
          <div class="uw-case-card" onclick="openUWModal('UW-2026-0008')">
            <div class="uw-case-header">
              <div class="uw-case-client">Maria Gonzalez</div>
              <div class="uw-stp-score stp-high">STP 86</div>
            </div>
            <div class="uw-case-product">DI Policy Increase · $800/yr</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Mar 15 · Age 48</div>
            <div class="uw-evidence-bar">
              <span class="uw-ev ev-done">Rx ✓</span>
              <span class="uw-ev ev-done">MIB ✓</span>
              <span class="uw-ev ev-done">MVR ✓</span>
              <span class="uw-ev ev-done">Credit ✓</span>
            </div>
            <div class="uw-case-footer">
              <span class="uw-status-pill approved">Approved</span>
              <span class="uw-ai-rec issued"><i class="fas fa-file-signature"></i> Awaiting Signature</span>
            </div>
            <button class="uw-eapp-btn" onclick="event.stopPropagation();openEApp('EA-UW-008')"><i class="fas fa-file-contract"></i> Open E-App <span class="uw-eapp-ai-tag">AI 87%</span></button>
          </div>
        </div>

        {/* Stage 6: Issued / Declined */}
        <div class="uw-stage">
          <div class="uw-stage-header issued">
            <span><i class="fas fa-badge-check"></i> Issued</span>
            <span class="uw-stage-count">2</span>
          </div>
          <div class="uw-case-card issued-card" onclick="openUWModal('UW-2026-0007')">
            <div class="uw-case-header">
              <div class="uw-case-client">Robert Chen</div>
              <div class="uw-stp-score stp-high">STP 96</div>
            </div>
            <div class="uw-case-product">VUL Add-on Rider · $1,800/yr</div>
            <div class="uw-case-meta"><i class="fas fa-check-circle" style="color:#059669"></i> Issued Apr 2 · 1.8 hrs total</div>
            <div class="uw-evidence-bar">
              <span class="uw-ev ev-done">Rx ✓</span>
              <span class="uw-ev ev-done">MIB ✓</span>
              <span class="uw-ev ev-done">MVR ✓</span>
              <span class="uw-ev ev-done">Lab ✓</span>
            </div>
            <div class="uw-case-footer">
              <span class="uw-status-pill issued">Issued</span>
              <span class="uw-ai-rec issued"><i class="fas fa-bolt"></i> STP — 1.8 hrs</span>
            </div>
          </div>
          <div class="uw-case-card issued-card" onclick="openUWModal('UW-2026-0006')">
            <div class="uw-case-header">
              <div class="uw-case-client">James Whitfield</div>
              <div class="uw-stp-score stp-high">STP 94</div>
            </div>
            <div class="uw-case-product">LTC Rider · $4,400/yr</div>
            <div class="uw-case-meta"><i class="fas fa-check-circle" style="color:#059669"></i> Issued Mar 30 · 3.1 hrs total</div>
            <div class="uw-evidence-bar">
              <span class="uw-ev ev-done">Rx ✓</span>
              <span class="uw-ev ev-done">MIB ✓</span>
              <span class="uw-ev ev-done">MVR ✓</span>
              <span class="uw-ev ev-done">Lab ✓</span>
            </div>
            <div class="uw-case-footer">
              <span class="uw-status-pill issued">Issued</span>
              <span class="uw-ai-rec issued"><i class="fas fa-bolt"></i> STP — 3.1 hrs</span>
            </div>
          </div>
        </div>

      </div>{/* end uw-pipeline */}

      {/* ══════════════════════════════════════════════════
          E-APP WIZARD MODAL
          ══════════════════════════════════════════════════ */}
      <div class="eapp-overlay" id="eapp-overlay" onclick="closeEApp(event)" style="display:none">
        <div class="eapp-modal">

          {/* Header */}
          <div class="eapp-header">
            <div class="eapp-header-left">
              <div class="eapp-header-icon"><i class="fas fa-file-contract"></i></div>
              <div>
                <div class="eapp-header-title" id="eapp-header-title">AI-Assisted E-Application</div>
                <div class="eapp-header-sub" id="eapp-header-sub">Auto-prefilled from client profile · Review and confirm each section</div>
              </div>
            </div>
            <div class="eapp-header-right">
              <div class="eapp-ai-badge"><i class="fas fa-robot"></i> AI Pre-filled <span id="eapp-ai-pct">87%</span></div>
              <button class="eapp-close-btn" onclick="closeEApp()"><i class="fas fa-times"></i></button>
            </div>
          </div>

          {/* Step Progress Bar */}
          <div class="eapp-progress-wrap">
            <div class="eapp-progress-bar-track">
              <div class="eapp-progress-bar-fill" id="eapp-progress-fill" style="width:20%"></div>
            </div>
            <div class="eapp-steps">
              <div class="eapp-step active" id="eapp-step-dot-1" onclick="goToEAppStep(1)">
                <div class="eapp-step-circle"><i class="fas fa-user"></i></div>
                <div class="eapp-step-lbl">Client Info</div>
              </div>
              <div class="eapp-step" id="eapp-step-dot-2" onclick="goToEAppStep(2)">
                <div class="eapp-step-circle"><i class="fas fa-shield-alt"></i></div>
                <div class="eapp-step-lbl">Product</div>
              </div>
              <div class="eapp-step" id="eapp-step-dot-3" onclick="goToEAppStep(3)">
                <div class="eapp-step-circle"><i class="fas fa-heartbeat"></i></div>
                <div class="eapp-step-lbl">Health</div>
              </div>
              <div class="eapp-step" id="eapp-step-dot-4" onclick="goToEAppStep(4)">
                <div class="eapp-step-circle"><i class="fas fa-file-signature"></i></div>
                <div class="eapp-step-lbl">Documents</div>
              </div>
              <div class="eapp-step" id="eapp-step-dot-5" onclick="goToEAppStep(5)">
                <div class="eapp-step-circle"><i class="fas fa-check-double"></i></div>
                <div class="eapp-step-lbl">Review</div>
              </div>
            </div>
          </div>

          {/* Body: step content */}
          <div class="eapp-body" id="eapp-body">
            {/* Content injected by JS */}
          </div>

          {/* Footer */}
          <div class="eapp-footer">
            <div class="eapp-footer-left">
              <button class="eapp-btn-secondary" id="eapp-btn-back" onclick="eAppStepNav(-1)"><i class="fas fa-arrow-left"></i> Back</button>
              <button class="eapp-btn-save" onclick="eAppSaveDraft()"><i class="fas fa-save"></i> Save Draft</button>
            </div>
            <div class="eapp-footer-center">
              <span class="eapp-step-indicator">Step <span id="eapp-cur-step">1</span> of 5</span>
            </div>
            <div class="eapp-footer-right">
              <button class="eapp-btn-ai" onclick="eAppAIFill()"><i class="fas fa-robot"></i> AI Auto-Fill</button>
              <button class="eapp-btn-next" id="eapp-btn-next" onclick="eAppStepNav(1)">Next <i class="fas fa-arrow-right"></i></button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Underwriting Modal ── */}
      <div class="detail-modal-overlay" id="uw-modal-overlay" onclick="closeUWModal()">
        <div class="detail-modal uw-modal" onclick="event.stopPropagation()">
          <div class="detail-modal-header" id="uw-modal-header">
            <div class="detail-modal-title">
              <span class="detail-modal-icon" id="uw-modal-icon" style="background:linear-gradient(135deg,#003087,#1e40af)"><i class="fas fa-microscope"></i></span>
              <div>
                <h3 id="uw-modal-title">Underwriting Case</h3>
                <p id="uw-modal-subtitle" class="detail-modal-sub"></p>
              </div>
            </div>
            <div class="detail-modal-header-actions">
              <div class="detail-modal-tabs" id="uw-modal-tabs">
                <button class="dmt-tab active" onclick="switchUWTab('overview',this)"><i class="fas fa-file-alt"></i> Overview</button>
                <button class="dmt-tab" onclick="switchUWTab('evidence',this)"><i class="fas fa-search-plus"></i> Evidence</button>
                <button class="dmt-tab ai-tab" onclick="switchUWTab('ai',this)"><i class="fas fa-robot"></i> AI Score</button>
              </div>
              <button class="detail-modal-close" onclick="closeUWModal()"><i class="fas fa-times"></i></button>
            </div>
          </div>
          <div class="detail-modal-body" id="uw-modal-body"></div>
        </div>
      </div>

    </div>
  )
}

function SalesPage() {
  return (
    <div class="page sales-page">

      {/* ── KPI Strip ── */}
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
        <div class="sales-kpi-card">
          <div class="skpi-icon purple"><i class="fas fa-dollar-sign"></i></div>
          <div class="skpi-data">
            <div class="skpi-val">$42,180</div>
            <div class="skpi-lbl">Commission MTD</div>
          </div>
        </div>
        <div class="sales-kpi-card">
          <div class="skpi-icon red"><i class="fas fa-trophy"></i></div>
          <div class="skpi-data">
            <div class="skpi-val">78%</div>
            <div class="skpi-lbl">YTD Target ($187K / $240K)</div>
          </div>
        </div>
      </div>

      {/* ── Main body: Kanban + right sidebar ── */}
      <div class="sales-body-layout">

        {/* ── Pipeline Kanban ── */}
        <div class="sales-kanban-wrap">
          <div class="kanban-board">

            {/* Prospect */}
            <div class="kanban-col">
              <div class="kanban-col-header prospect">
                <span><i class="fas fa-binoculars"></i> Prospect</span>
                <span class="col-count">8</span>
              </div>
              <div class="kanban-card" onclick="openDealModal('D001')">
                <div class="kc-score-badge score-hi">AI 82</div>
                <div class="kc-client">Alex Rivera</div>
                <div class="kc-product">Whole Life — $500K</div>
                <div class="kc-value">$4,800/yr · <span class="kc-comm">$576 comm</span></div>
                <div class="kc-tags"><span class="tag-priority">High Priority</span><span>Referral</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-brief" onclick="event.stopPropagation();openMeetingBrief('MTG-001')"><i class="fas fa-file-alt"></i> Brief</button>
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();sendContextMessage('AI analysis for Alex Rivera prospect — Whole Life $500K, close probability, next best action','smart-advisor')"><i class="fas fa-robot"></i> AI</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D001','Quoted')"><i class="fas fa-arrow-right"></i> Move</button>
                </div>
              </div>
              <div class="kanban-card" onclick="openDealModal('D002')">
                <div class="kc-score-badge score-mid">AI 61</div>
                <div class="kc-client">Nancy Foster</div>
                <div class="kc-product">Term Life — $1M</div>
                <div class="kc-value">$3,200/yr · <span class="kc-comm">$384 comm</span></div>
                <div class="kc-tags"><span>Online Inquiry</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-brief" onclick="event.stopPropagation();openMeetingBrief('MTG-005')"><i class="fas fa-file-alt"></i> Brief</button>
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();sendContextMessage('Nancy Foster — Term Life $1M prospect, credit check pending, close strategy','smart-advisor')"><i class="fas fa-robot"></i> AI</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D002','Quoted')"><i class="fas fa-arrow-right"></i> Move</button>
                </div>
              </div>
              <div class="kanban-card" onclick="openDealModal('D003')">
                <div class="kc-score-badge score-lo">AI 44</div>
                <div class="kc-client">John Kim</div>
                <div class="kc-product">Disability Insurance</div>
                <div class="kc-value">$2,100/yr · <span class="kc-comm">$252 comm</span></div>
                <div class="kc-tags"><span>Warm Lead</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();sendContextMessage('John Kim DI prospect — diabetes flag, APS required, objection handling strategy','smart-advisor')"><i class="fas fa-robot"></i> AI</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D003','Quoted')"><i class="fas fa-arrow-right"></i> Move</button>
                </div>
              </div>
              <button class="add-card-btn"><i class="fas fa-plus"></i> Add Prospect</button>
            </div>

            {/* Quoted */}
            <div class="kanban-col">
              <div class="kanban-col-header quoted">
                <span><i class="fas fa-file-invoice-dollar"></i> Quoted</span>
                <span class="col-count">6</span>
              </div>
              <div class="kanban-card hot" onclick="openDealModal('D004')">
                <div class="kc-hot-tag"><i class="fas fa-fire"></i> Hot</div>
                <div class="kc-score-badge score-hi">AI 91</div>
                <div class="kc-client">Michael Santos</div>
                <div class="kc-product">Universal Life — $750K</div>
                <div class="kc-value">$6,400/yr · <span class="kc-comm">$896 comm</span></div>
                <div class="kc-tags"><span>Quote Sent</span><span class="tag-ai">+AI Rec</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-brief" onclick="event.stopPropagation();sendContextMessage('Michael Santos UL $750K — labs pending, objection handling and close strategy','smart-advisor')"><i class="fas fa-robot"></i> AI</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D004','Underwriting')"><i class="fas fa-arrow-right"></i> Move</button>
                </div>
              </div>
              <div class="kanban-card" onclick="openDealModal('D005')">
                <div class="kc-score-badge score-mid">AI 73</div>
                <div class="kc-client">Julia Chen</div>
                <div class="kc-product">Deferred Annuity</div>
                <div class="kc-value">$8,000/yr · <span class="kc-comm">$640 comm</span></div>
                <div class="kc-tags"><span>Reviewing</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();sendContextMessage('Julia Chen deferred annuity quote — income projection, tax advantage talking points','smart-advisor')"><i class="fas fa-robot"></i> AI</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D005','Underwriting')"><i class="fas fa-arrow-right"></i> Move</button>
                </div>
              </div>
              <button class="add-card-btn"><i class="fas fa-plus"></i> Add</button>
            </div>

            {/* Underwriting */}
            <div class="kanban-col">
              <div class="kanban-col-header underwriting">
                <span><i class="fas fa-stethoscope"></i> Underwriting</span>
                <span class="col-count">4</span>
              </div>
              <div class="kanban-card" onclick="openDealModal('D006')">
                <div class="kc-score-badge score-hi">AI 88</div>
                <div class="kc-client">Thomas Wright</div>
                <div class="kc-product">Whole Life — $1M</div>
                <div class="kc-value">$9,600/yr · <span class="kc-comm">$1,152 comm</span></div>
                <div class="kc-tags"><span>Medical Exam Done</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();sendContextMessage('Thomas Wright WL $1M underwriting status — medical exam done, expected decision timeline','smart-advisor')"><i class="fas fa-robot"></i> AI</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D006','Approved')"><i class="fas fa-arrow-right"></i> Move</button>
                </div>
              </div>
              <div class="kanban-card" onclick="openDealModal('D007')">
                <div class="kc-score-badge score-mid">AI 69</div>
                <div class="kc-client">Grace Lee</div>
                <div class="kc-product">VUL — $250K</div>
                <div class="kc-value">$3,800/yr · <span class="kc-comm">$456 comm</span></div>
                <div class="kc-tags"><span>In Review</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();sendContextMessage('Grace Lee VUL $250K underwriting — in review, APS status, next steps','smart-advisor')"><i class="fas fa-robot"></i> AI</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D007','Approved')"><i class="fas fa-arrow-right"></i> Move</button>
                </div>
              </div>
              <button class="add-card-btn"><i class="fas fa-plus"></i> Add</button>
            </div>

            {/* Approved */}
            <div class="kanban-col">
              <div class="kanban-col-header approved">
                <span><i class="fas fa-check-circle"></i> Approved</span>
                <span class="col-count">3</span>
              </div>
              <div class="kanban-card" onclick="openDealModal('D008')">
                <div class="kc-score-badge score-hi">AI 95</div>
                <div class="kc-client">Kevin Park</div>
                <div class="kc-product">Term Life — $500K</div>
                <div class="kc-value">$1,800/yr · <span class="kc-comm">$216 comm</span></div>
                <div class="kc-tags"><span class="tag-urgent">Awaiting Signature</span></div>
                <div class="kc-eapp-bar"><span class="kc-eapp-ai-tag"><i class="fas fa-robot"></i> AI Pre-filled</span><span class="kc-eapp-pct">95% complete</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-eapp" onclick="event.stopPropagation();openEApp('EA-008')"><i class="fas fa-file-contract"></i> E-App</button>
                  <button class="kca-btn kca-brief" onclick="event.stopPropagation();openMeetingBrief('MTG-001')"><i class="fas fa-file-alt"></i> Brief</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D008','Closed Won')"><i class="fas fa-trophy"></i> Close</button>
                </div>
              </div>
              <div class="kanban-card" onclick="openDealModal('D009')">
                <div class="kc-score-badge score-hi">AI 90</div>
                <div class="kc-client">Linda Morrison</div>
                <div class="kc-product">UMA — $280K AUM</div>
                <div class="kc-value">$2,800/yr fee · <span class="kc-comm">$280 comm</span></div>
                <div class="kc-tags"><span>Docs Signed</span></div>
                <div class="kc-eapp-bar"><span class="kc-eapp-ai-tag"><i class="fas fa-robot"></i> AI Pre-filled</span><span class="kc-eapp-pct">100% complete</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-eapp" onclick="event.stopPropagation();openEApp('EA-009')"><i class="fas fa-file-contract"></i> E-App</button>
                  <button class="kca-btn kca-brief" onclick="event.stopPropagation();openMeetingBrief('MTG-003')"><i class="fas fa-file-alt"></i> Brief</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D009','Closed Won')"><i class="fas fa-trophy"></i> Close</button>
                </div>
              </div>
              <button class="add-card-btn"><i class="fas fa-plus"></i> Add</button>
            </div>

            {/* Closed Won */}
            <div class="kanban-col">
              <div class="kanban-col-header closed">
                <span><i class="fas fa-trophy"></i> Closed Won</span>
                <span class="col-count">34</span>
              </div>
              <div class="kanban-card won">
                <div class="kc-client">David Thompson</div>
                <div class="kc-product">Term Life — $500K</div>
                <div class="kc-value">$2,400/yr · <span class="kc-comm">$288 comm</span></div>
                <div class="kc-tags"><span>Apr 7 · Issued</span></div>
              </div>
              <div class="kanban-card won">
                <div class="kc-client">Lisa Brown</div>
                <div class="kc-product">Long-term Care</div>
                <div class="kc-value">$5,200/yr · <span class="kc-comm">$624 comm</span></div>
                <div class="kc-tags"><span>Apr 5 · Issued</span></div>
              </div>
              <div class="kanban-card won">
                <div class="kc-client">Robert Chen</div>
                <div class="kc-product">Whole Life — $1M</div>
                <div class="kc-value">$12,400/yr · <span class="kc-comm">$1,488 comm</span></div>
                <div class="kc-tags"><span>Apr 2 · Issued</span></div>
              </div>
              <div class="view-more-btn" onclick="openDealModal('closed-all')">+ 31 more this month →</div>
            </div>

          </div>{/* end kanban-board */}
        </div>{/* end sales-kanban-wrap */}

        {/* ── Right Sidebar: AI Pipeline Optimizer + Commission Tracker ── */}
        <div class="sales-sidebar">

          {/* AI Pipeline Optimizer */}
          <div class="pipeline-ai-panel">
            <div class="pai-header">
              <div class="pai-title"><i class="fas fa-robot"></i> AI Pipeline Optimizer</div>
              <span class="pai-badge">LIVE</span>
            </div>
            <div class="pai-subtitle">Top 5 deals ranked by AI close probability</div>
            <div class="pai-list">

              <div class="pai-item" onclick="openDealModal('D004')">
                <div class="pai-rank">1</div>
                <div class="pai-info">
                  <div class="pai-client">Michael Santos</div>
                  <div class="pai-product">Universal Life $750K</div>
                  <div class="pai-action ai-action-green"><i class="fas fa-bolt"></i> Follow up on lab results — close window: 3 days</div>
                </div>
                <div class="pai-score pai-score-green">91%</div>
              </div>

              <div class="pai-item" onclick="openDealModal('D008')">
                <div class="pai-rank">2</div>
                <div class="pai-info">
                  <div class="pai-client">Kevin Park</div>
                  <div class="pai-product">Term Life $500K</div>
                  <div class="pai-action ai-action-green"><i class="fas fa-signature"></i> E-signature pending — send reminder today</div>
                </div>
                <div class="pai-score pai-score-green">95%</div>
              </div>

              <div class="pai-item" onclick="openDealModal('D009')">
                <div class="pai-rank">3</div>
                <div class="pai-info">
                  <div class="pai-client">Linda Morrison</div>
                  <div class="pai-product">UMA $280K AUM</div>
                  <div class="pai-action ai-action-green"><i class="fas fa-check"></i> Docs signed — initiate account transfer</div>
                </div>
                <div class="pai-score pai-score-green">90%</div>
              </div>

              <div class="pai-item" onclick="openDealModal('D006')">
                <div class="pai-rank">4</div>
                <div class="pai-info">
                  <div class="pai-client">Thomas Wright</div>
                  <div class="pai-product">Whole Life $1M</div>
                  <div class="pai-action ai-action-amber"><i class="fas fa-hourglass-half"></i> UW decision expected Apr 16 — prepare e-delivery</div>
                </div>
                <div class="pai-score pai-score-amber">88%</div>
              </div>

              <div class="pai-item" onclick="openDealModal('D001')">
                <div class="pai-rank">5</div>
                <div class="pai-info">
                  <div class="pai-client">Alex Rivera</div>
                  <div class="pai-product">Whole Life $500K</div>
                  <div class="pai-action ai-action-amber"><i class="fas fa-calendar-alt"></i> Meeting Apr 12 — send pre-brief now</div>
                </div>
                <div class="pai-score pai-score-amber">82%</div>
              </div>

            </div>
            <button class="pai-ask-btn" onclick="sendContextMessage('AI Pipeline Optimizer — show all deals ranked by close probability with specific next actions for each','smart-advisor')">
              <i class="fas fa-robot"></i> Full AI Pipeline Analysis
            </button>
          </div>

          {/* Commission Tracker */}
          <div class="comm-tracker">
            <div class="comm-header">
              <div class="comm-title"><i class="fas fa-dollar-sign"></i> Commission Tracker</div>
              <span class="comm-period">2026</span>
            </div>

            {/* YTD Progress */}
            <div class="comm-ytd-block">
              <div class="comm-ytd-row">
                <span class="comm-ytd-lbl">YTD Commission</span>
                <span class="comm-ytd-val">$187,000</span>
              </div>
              <div class="comm-ytd-row">
                <span class="comm-ytd-lbl">Annual Target</span>
                <span class="comm-ytd-val comm-target">$240,000</span>
              </div>
              <div class="comm-progress-bar-wrap">
                <div class="comm-progress-bar" style="width:77.9%">
                  <span class="comm-progress-pct">78%</span>
                </div>
              </div>
              <div class="comm-gap-note">$53,000 to target · <span class="comm-on-track">On Track ↑</span></div>
            </div>

            {/* Monthly bars */}
            <div class="comm-monthly-chart">
              <div class="comm-chart-title">Monthly Commission — 2026</div>
              <div class="comm-bars">
                <div class="comm-bar-group">
                  <div class="comm-bar-fill" style="height:72%" title="Jan: $38.4K"></div>
                  <div class="comm-bar-lbl">J</div>
                </div>
                <div class="comm-bar-group">
                  <div class="comm-bar-fill" style="height:82%" title="Feb: $43.8K"></div>
                  <div class="comm-bar-lbl">F</div>
                </div>
                <div class="comm-bar-group">
                  <div class="comm-bar-fill" style="height:89%" title="Mar: $47.5K"></div>
                  <div class="comm-bar-lbl">M</div>
                </div>
                <div class="comm-bar-group comm-bar-current">
                  <div class="comm-bar-fill active" style="height:79%" title="Apr (MTD): $42.2K"></div>
                  <div class="comm-bar-lbl">A</div>
                </div>
                <div class="comm-bar-group comm-bar-proj">
                  <div class="comm-bar-fill projected" style="height:85%" title="May (proj): $45K"></div>
                  <div class="comm-bar-lbl">M</div>
                </div>
                <div class="comm-bar-group comm-bar-proj">
                  <div class="comm-bar-fill projected" style="height:80%" title="Jun (proj): $42.8K"></div>
                  <div class="comm-bar-lbl">J</div>
                </div>
              </div>
              <div class="comm-chart-legend">
                <span class="cl-dot cl-actual"></span> Actual&nbsp;&nbsp;
                <span class="cl-dot cl-current"></span> MTD&nbsp;&nbsp;
                <span class="cl-dot cl-proj"></span> Projected
              </div>
            </div>

            {/* Domain breakdown */}
            <div class="comm-domain-breakdown">
              <div class="comm-domain-title">By Domain</div>
              <div class="comm-domain-row">
                <span class="comm-domain-lbl ins-lbl"><i class="fas fa-shield-alt"></i> Insurance</span>
                <div class="comm-domain-bar-wrap"><div class="comm-domain-bar ins-bar" style="width:64%"></div></div>
                <span class="comm-domain-val">$119.7K</span>
              </div>
              <div class="comm-domain-row">
                <span class="comm-domain-lbl inv-lbl"><i class="fas fa-chart-line"></i> Investments</span>
                <div class="comm-domain-bar-wrap"><div class="comm-domain-bar inv-bar" style="width:18%"></div></div>
                <span class="comm-domain-val">$33.7K</span>
              </div>
              <div class="comm-domain-row">
                <span class="comm-domain-lbl ret-lbl"><i class="fas fa-umbrella-beach"></i> Retirement</span>
                <div class="comm-domain-bar-wrap"><div class="comm-domain-bar ret-bar" style="width:9%"></div></div>
                <span class="comm-domain-val">$16.8K</span>
              </div>
              <div class="comm-domain-row">
                <span class="comm-domain-lbl adv-lbl"><i class="fas fa-handshake"></i> Advisory</span>
                <div class="comm-domain-bar-wrap"><div class="comm-domain-bar adv-bar" style="width:9%"></div></div>
                <span class="comm-domain-val">$16.8K</span>
              </div>
            </div>

            {/* Top 5 closed deals */}
            <div class="comm-top-deals">
              <div class="comm-domain-title">Top Closed Deals — April</div>
              <div class="comm-deal-row">
                <span class="comm-deal-rank">1</span>
                <span class="comm-deal-client">Robert Chen</span>
                <span class="comm-deal-product">WL $1M</span>
                <span class="comm-deal-val green">$1,488</span>
              </div>
              <div class="comm-deal-row">
                <span class="comm-deal-rank">2</span>
                <span class="comm-deal-client">Lisa Brown</span>
                <span class="comm-deal-product">LTC</span>
                <span class="comm-deal-val green">$624</span>
              </div>
              <div class="comm-deal-row">
                <span class="comm-deal-rank">3</span>
                <span class="comm-deal-client">David Thompson</span>
                <span class="comm-deal-product">Term $500K</span>
                <span class="comm-deal-val green">$288</span>
              </div>
              <div class="comm-deal-row">
                <span class="comm-deal-rank">4</span>
                <span class="comm-deal-client">Sandra Williams</span>
                <span class="comm-deal-product">Term Renewal</span>
                <span class="comm-deal-val green">$240</span>
              </div>
              <div class="comm-deal-row">
                <span class="comm-deal-rank">5</span>
                <span class="comm-deal-client">Patricia Nguyen</span>
                <span class="comm-deal-product">UL Conversion</span>
                <span class="comm-deal-val green">$210</span>
              </div>
            </div>

          </div>{/* end comm-tracker */}

        </div>{/* end sales-sidebar */}
      </div>{/* end sales-body-layout */}

      {/* ── Quick Quote Tool ── */}
      <div class="quick-quote-section">
        <h3><i class="fas fa-calculator"></i> Quick Quote Tool</h3>
        <div class="quote-form">
          <div class="quote-form-grid">
            <div class="form-group">
              <label>Client Name</label>
              <input type="text" id="qq-name" placeholder="Enter client name" class="form-input" />
            </div>
            <div class="form-group">
              <label>Age</label>
              <input type="number" id="qq-age" placeholder="Age" class="form-input" min="18" max="85" value="42" />
            </div>
            <div class="form-group">
              <label>Product Type</label>
              <select id="qq-product" class="form-input">
                <option value="wl">Whole Life Insurance</option>
                <option value="term" selected>Term Life Insurance</option>
                <option value="ul">Universal Life Insurance</option>
                <option value="vul">Variable Universal Life</option>
                <option value="ltc">Long-term Care Insurance</option>
                <option value="di">Individual Disability Insurance</option>
                <option value="fa">Fixed Annuity</option>
                <option value="va">Variable Annuity</option>
              </select>
            </div>
            <div class="form-group">
              <label>Coverage Amount</label>
              <select id="qq-coverage" class="form-input">
                <option value="100000">$100,000</option>
                <option value="250000">$250,000</option>
                <option value="500000" selected>$500,000</option>
                <option value="1000000">$1,000,000</option>
                <option value="2000000">$2,000,000</option>
              </select>
            </div>
            <div class="form-group">
              <label>Health Class</label>
              <select id="qq-health" class="form-input">
                <option value="pp">Preferred Plus</option>
                <option value="p" selected>Preferred</option>
                <option value="sp">Standard Plus</option>
                <option value="s">Standard</option>
              </select>
            </div>
            <div class="form-group">
              <label>Gender</label>
              <select id="qq-gender" class="form-input">
                <option value="m">Male</option>
                <option value="f">Female</option>
              </select>
            </div>
          </div>
          <div class="quote-actions">
            <button class="btn btn-ai" onclick="runAIQuote()"><i class="fas fa-robot"></i> AI-Assisted Quote</button>
            <button class="btn btn-primary" onclick="runQuoteCalc()"><i class="fas fa-calculator"></i> Calculate Premium</button>
          </div>
          <div class="quote-result" id="quote-result" style="display:none">
            <div class="qr-grid">
              <div class="qr-main">
                <div class="quote-result-header">Estimated Annual Premium</div>
                <div class="quote-result-value" id="qq-result-val">—</div>
                <div class="quote-result-note" id="qq-result-note"></div>
              </div>
              <div class="qr-breakdown" id="qq-breakdown"></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Deal Detail Modal ── */}
      <div class="deal-modal-overlay" id="deal-modal-overlay" onclick="closeDealModal(event)" style="display:none">
        <div class="deal-modal">
          <div class="deal-modal-header" id="deal-modal-header">
            <div>
              <div class="deal-modal-client" id="deal-modal-client">Client Name</div>
              <div class="deal-modal-product" id="deal-modal-product">Product</div>
            </div>
            <button class="deal-modal-close" onclick="closeDealModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="deal-modal-body" id="deal-modal-body"></div>
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
                    <button class="btn btn-primary-sm" onclick="sendContextMessage('Recommend the best products for each client based on their profile, gaps, and life stage','advisor')"><i class="fas fa-robot"></i> AI Client Match</button>
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
                    <button class="btn btn-primary-sm" onclick="sendContextMessage('Review all 4 estate planning opportunities and generate prioritized action plan with revenue estimates','estate')"><i class="fas fa-robot"></i> Estate AI Review</button>
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
                    <button class="btn btn-primary-sm" onclick="sendContextMessage('Audit all business owner clients for NQDC, key-person life, COLI and group benefits gaps','business')"><i class="fas fa-robot"></i> Business AI Audit</button>
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

      {/* Domain KPI summary row */}
      <div class="report-domain-kpis">
        <div class="rdkpi-card ins-theme">
          <div class="rdkpi-icon"><i class="fas fa-shield-alt"></i></div>
          <div class="rdkpi-body">
            <div class="rdkpi-label">Insurance Revenue</div>
            <div class="rdkpi-val">$312K</div>
            <div class="rdkpi-sub">YTD · $1.87M / $2.16M target <span class="rdkpi-delta up">+9%</span></div>
          </div>
        </div>
        <div class="rdkpi-card inv-theme">
          <div class="rdkpi-icon"><i class="fas fa-chart-line"></i></div>
          <div class="rdkpi-body">
            <div class="rdkpi-label">Investment AUM</div>
            <div class="rdkpi-val">$4.2M</div>
            <div class="rdkpi-sub">62 clients · Avg $67.7K <span class="rdkpi-delta up">+14%</span></div>
          </div>
        </div>
        <div class="rdkpi-card ret-theme">
          <div class="rdkpi-icon"><i class="fas fa-umbrella-beach"></i></div>
          <div class="rdkpi-body">
            <div class="rdkpi-label">Retirement Annuity Premium</div>
            <div class="rdkpi-val">$89K</div>
            <div class="rdkpi-sub">38 clients · Deferred + Immediate <span class="rdkpi-delta up">+22%</span></div>
          </div>
        </div>
        <div class="rdkpi-card adv-theme">
          <div class="rdkpi-icon"><i class="fas fa-handshake"></i></div>
          <div class="rdkpi-body">
            <div class="rdkpi-label">Advisory Revenue</div>
            <div class="rdkpi-val">$86K</div>
            <div class="rdkpi-sub">59 clients · Estate + WM + Biz <span class="rdkpi-delta up">+31%</span></div>
          </div>
        </div>
      </div>

      <div class="reports-grid">
        <div class="report-card main-chart">
          <div class="card-header">
            <h3><i class="fas fa-chart-line"></i> Total Revenue by Domain — YTD 2026</h3>
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
            <h3><i class="fas fa-chart-pie"></i> Book Mix by Domain</h3>
          </div>
          <div class="report-chart-wrap" style="position:relative;height:160px">
            <canvas id="reportProductChart"></canvas>
          </div>
          <div class="report-chart-legend">
            <span><span class="rcl-dot" style="background:#003087"></span> Insurance 64%</span>
            <span><span class="rcl-dot" style="background:#059669"></span> Investments 18%</span>
            <span><span class="rcl-dot" style="background:#d97706"></span> Retirement 9%</span>
            <span><span class="rcl-dot" style="background:#7c3aed"></span> Advisory 9%</span>
          </div>
        </div>

        <div class="report-card">
          <div class="card-header">
            <h3><i class="fas fa-users"></i> Client Segments</h3>
          </div>
          <div class="report-chart-wrap" style="position:relative;height:160px">
            <canvas id="reportSegmentChart"></canvas>
          </div>
          <div class="report-chart-legend">
            <span><span class="rcl-dot" style="background:#7c3aed"></span> Premium: 18</span>
            <span><span class="rcl-dot" style="background:#003087"></span> High Value: 62</span>
            <span><span class="rcl-dot" style="background:#059669"></span> Mid Market: 94</span>
            <span><span class="rcl-dot" style="background:#d97706"></span> Emerging: 73</span>
          </div>
        </div>

        {/* Holistic Performance Scorecard */}
        <div class="report-card wide-card">
          <div class="card-header">
            <h3><i class="fas fa-trophy"></i> Holistic Performance Scorecard — All Domains</h3>
          </div>
          <div class="scorecard-domain-tabs">
            <div class="sdt-section">
              <div class="sdt-header ins-header"><i class="fas fa-shield-alt"></i> Insurance</div>
              <div class="scorecard-grid">
                <div class="score-item">
                  <div class="score-label">Premium vs Target</div>
                  <div class="score-bar-outer"><div class="score-bar-inner" style="width:87%"></div></div>
                  <div class="score-pct">87% <span class="score-delta up">+9%</span></div>
                </div>
                <div class="score-item">
                  <div class="score-label">Policy Renewal Rate</div>
                  <div class="score-bar-outer"><div class="score-bar-inner green" style="width:89%"></div></div>
                  <div class="score-pct">89% <span class="score-delta neutral">0%</span></div>
                </div>
                <div class="score-item">
                  <div class="score-label">Claims Resolved (30d)</div>
                  <div class="score-bar-outer"><div class="score-bar-inner green" style="width:91%"></div></div>
                  <div class="score-pct">91% <span class="score-delta up">+5%</span></div>
                </div>
                <div class="score-item">
                  <div class="score-label">Lapse Prevention</div>
                  <div class="score-bar-outer"><div class="score-bar-inner gold" style="width:94%"></div></div>
                  <div class="score-pct">94% <span class="score-delta up">+3%</span></div>
                </div>
              </div>
            </div>
            <div class="sdt-section">
              <div class="sdt-header inv-header"><i class="fas fa-chart-line"></i> Investments</div>
              <div class="scorecard-grid">
                <div class="score-item">
                  <div class="score-label">AUM Growth</div>
                  <div class="score-bar-outer"><div class="score-bar-inner" style="width:84%;background:#059669"></div></div>
                  <div class="score-pct">84% <span class="score-delta up">+14%</span></div>
                </div>
                <div class="score-item">
                  <div class="score-label">Client Adoption Rate</div>
                  <div class="score-bar-outer"><div class="score-bar-inner" style="width:25%;background:#059669"></div></div>
                  <div class="score-pct">25% <span class="score-delta up">+6%</span></div>
                </div>
                <div class="score-item">
                  <div class="score-label">Annuity Conversions</div>
                  <div class="score-bar-outer"><div class="score-bar-inner" style="width:68%;background:#059669"></div></div>
                  <div class="score-pct">68% <span class="score-delta up">+11%</span></div>
                </div>
                <div class="score-item">
                  <div class="score-label">529 Plans Opened</div>
                  <div class="score-bar-outer"><div class="score-bar-inner" style="width:55%;background:#059669"></div></div>
                  <div class="score-pct">55% <span class="score-delta up">+8%</span></div>
                </div>
              </div>
            </div>
            <div class="sdt-section">
              <div class="sdt-header ret-header"><i class="fas fa-umbrella-beach"></i> Retirement</div>
              <div class="scorecard-grid">
                <div class="score-item">
                  <div class="score-label">Retirement Clients (vs Target)</div>
                  <div class="score-bar-outer"><div class="score-bar-inner" style="width:84%;background:#d97706"></div></div>
                  <div class="score-pct">84% <span class="score-delta up">+22%</span></div>
                </div>
                <div class="score-item">
                  <div class="score-label">Income Gap Resolved</div>
                  <div class="score-bar-outer"><div class="score-bar-inner" style="width:58%;background:#d97706"></div></div>
                  <div class="score-pct">58% <span class="score-delta up">+18%</span></div>
                </div>
              </div>
            </div>
            <div class="sdt-section">
              <div class="sdt-header adv-header"><i class="fas fa-handshake"></i> Advisory</div>
              <div class="scorecard-grid">
                <div class="score-item">
                  <div class="score-label">Advisory Clients (vs Target)</div>
                  <div class="score-bar-outer"><div class="score-bar-inner" style="width:74%;background:#7c3aed"></div></div>
                  <div class="score-pct">74% <span class="score-delta up">+31%</span></div>
                </div>
                <div class="score-item">
                  <div class="score-label">Estate Plans Initiated</div>
                  <div class="score-bar-outer"><div class="score-bar-inner" style="width:80%;background:#7c3aed"></div></div>
                  <div class="score-pct">80% <span class="score-delta up">+15%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cross-domain scorecard */}
        <div class="report-card wide-card">
          <div class="card-header">
            <h3><i class="fas fa-layer-group"></i> Cross-Domain Metrics</h3>
          </div>
          <div class="scorecard-grid">
            <div class="score-item">
              <div class="score-label">Client Satisfaction (All)</div>
              <div class="score-bar-outer"><div class="score-bar-inner gold" style="width:94%"></div></div>
              <div class="score-pct">94% <span class="score-delta up">+2%</span></div>
            </div>
            <div class="score-item">
              <div class="score-label">Client Retention (All)</div>
              <div class="score-bar-outer"><div class="score-bar-inner green" style="width:96%"></div></div>
              <div class="score-pct">96% <span class="score-delta up">+2%</span></div>
            </div>
            <div class="score-item">
              <div class="score-label">Multi-Domain Cross-Sell</div>
              <div class="score-bar-outer"><div class="score-bar-inner purple" style="width:62%"></div></div>
              <div class="score-pct">62% <span class="score-delta up">+8%</span></div>
            </div>
            <div class="score-item">
              <div class="score-label">Avg Products per Client</div>
              <div class="score-bar-outer"><div class="score-bar-inner" style="width:72%"></div></div>
              <div class="score-pct">1.8 <span class="score-delta up">of 2.5 goal</span></div>
            </div>
            <div class="score-item">
              <div class="score-label">Commission YTD vs Target</div>
              <div class="score-bar-outer"><div class="score-bar-inner gold" style="width:78%"></div></div>
              <div class="score-pct">78% <span class="score-delta up">$187K / $240K</span></div>
            </div>
            <div class="score-item">
              <div class="score-label">AI Insights Acted Upon</div>
              <div class="score-bar-outer"><div class="score-bar-inner green" style="width:71%"></div></div>
              <div class="score-pct">71% <span class="score-delta up">+18%</span></div>
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

      {/* Domain legend strip */}
      <div class="cal-legend-strip">
        <span class="cal-legend-item"><span class="cal-leg-dot ins-dot"></span> Insurance</span>
        <span class="cal-legend-item"><span class="cal-leg-dot inv-dot"></span> Investments</span>
        <span class="cal-legend-item"><span class="cal-leg-dot ret-dot"></span> Retirement</span>
        <span class="cal-legend-item"><span class="cal-leg-dot adv-dot"></span> Advisory</span>
        <span class="cal-legend-item"><span class="cal-leg-dot urgent-dot"></span> Urgent</span>
      </div>

      <div class="calendar-layout">
        <div class="calendar-main">
          <div class="cal-header">
            <button class="cal-nav"><i class="fas fa-chevron-left"></i></button>
            <h3>April 2026</h3>
            <button class="cal-nav"><i class="fas fa-chevron-right"></i></button>
            <div class="cal-header-right">
              <select class="filter-select cal-domain-filter" style="margin-right:8px">
                <option value="">All Domains</option>
                <option value="ins">Insurance</option>
                <option value="inv">Investments</option>
                <option value="ret">Retirement</option>
                <option value="adv">Advisory</option>
              </select>
              <button class="btn btn-primary cal-add-btn"><i class="fas fa-plus"></i> Add Event</button>
            </div>
          </div>
          <div class="cal-grid">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div class="cal-day-header">{d}</div>
            ))}
            {[...Array(30)].map((_, i) => {
              const day = i + 1
              const hasEvent = [5, 10, 12, 15, 17, 18, 22, 25, 28].includes(day)
              const isToday = day === 10
              return (
                <div class={`cal-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-events' : ''}`}>
                  <span class="cal-day-num">{day}</span>
                  {day === 5  && <div class="cal-event cal-ev-inv">Maria G. — Annuity Review</div>}
                  {day === 10 && <div class="cal-event urgent">Kevin Park Follow-up</div>}
                  {day === 10 && <div class="cal-event cal-ev-ins">Robert Chen — Claim Update</div>}
                  {day === 12 && <div class="cal-event cal-ev-inv">Alex Rivera — New Prospect</div>}
                  {day === 15 && <div class="cal-event cal-ev-adv">Linda Morrison Annual Review</div>}
                  {day === 17 && <div class="cal-event cal-ev-ins">Nancy Foster — New Client</div>}
                  {day === 18 && <div class="cal-event cal-ev-ret">James Whitfield — Ret. Plan</div>}
                  {day === 22 && <div class="cal-event cal-ev-ins">Team Q1 Review</div>}
                  {day === 25 && <div class="cal-event cal-ev-adv">Robert Chen — Estate Plan</div>}
                  {day === 28 && <div class="cal-event renewal">Sandra Williams Renewal</div>}
                </div>
              )
            })}
          </div>
        </div>
        <div class="calendar-sidebar">

          {/* --- UPCOMING MEETINGS --- */}
          <div class="cal-sidebar-section-header">
            <h4><i class="fas fa-calendar-alt"></i> Upcoming Meetings</h4>
            <span class="cal-section-badge upcoming-badge">8</span>
          </div>
          <div class="upcoming-list">

            <div class="upcoming-event urgent-event">
              <div class="ue-date"><span class="ue-d">10</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">Kevin Park — Follow-up Call</div>
                <div class="ue-desc"><span class="act-domain-pill ins">Insurance</span> Pending application · Urgent</div>
                <div class="ue-actions">
                  <button class="btn-pmb urgent-pmb" onclick="openMeetingBrief('MTG-001')"><i class="fas fa-file-alt"></i> Pre-Meeting Brief</button>
                </div>
              </div>
            </div>

            <div class="upcoming-event">
              <div class="ue-date"><span class="ue-d">10</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">Robert Chen — Claim Status</div>
                <div class="ue-desc"><span class="act-domain-pill ins">Insurance</span> Video · 45 min</div>
                <div class="ue-actions">
                  <button class="btn-pmb" onclick="openMeetingBrief('MTG-002')"><i class="fas fa-file-alt"></i> Pre-Meeting Brief</button>
                </div>
              </div>
            </div>

            <div class="upcoming-event">
              <div class="ue-date"><span class="ue-d">12</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">Alex Rivera — Prospect Intro</div>
                <div class="ue-desc"><span class="act-domain-pill inv">Investments</span> Annuity + WL interest · In Person</div>
                <div class="ue-actions">
                  <button class="btn-pmb" onclick="openMeetingBrief('MTG-003')"><i class="fas fa-file-alt"></i> Pre-Meeting Brief</button>
                </div>
              </div>
            </div>

            <div class="upcoming-event">
              <div class="ue-date"><span class="ue-d">15</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">Linda Morrison — Annual Review</div>
                <div class="ue-desc"><span class="act-domain-pill adv">Advisory</span> Estate + UMA + Insurance · 90 min</div>
                <div class="ue-actions">
                  <button class="btn-pmb" onclick="openMeetingBrief('MTG-004')"><i class="fas fa-file-alt"></i> Pre-Meeting Brief</button>
                </div>
              </div>
            </div>

            <div class="upcoming-event">
              <div class="ue-date"><span class="ue-d">18</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">James Whitfield — Retirement Plan</div>
                <div class="ue-desc"><span class="act-domain-pill ret">Retirement</span> Deferred annuity illustration</div>
                <div class="ue-actions">
                  <button class="btn-pmb" onclick="openMeetingBrief('MTG-005')"><i class="fas fa-file-alt"></i> Pre-Meeting Brief</button>
                </div>
              </div>
            </div>

            <div class="upcoming-event">
              <div class="ue-date"><span class="ue-d">22</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">Team Q1 Performance Review</div>
                <div class="ue-desc"><span class="act-domain-pill ins">Insurance</span> All lines · Roger Putnam</div>
                <div class="ue-actions">
                  <button class="btn-pmb" onclick="openMeetingBrief('MTG-006')"><i class="fas fa-file-alt"></i> Pre-Meeting Brief</button>
                </div>
              </div>
            </div>

            <div class="upcoming-event">
              <div class="ue-date"><span class="ue-d">25</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">Robert Chen — Estate Planning</div>
                <div class="ue-desc"><span class="act-domain-pill adv">Advisory</span> Business succession + NQDC</div>
                <div class="ue-actions">
                  <button class="btn-pmb" onclick="openMeetingBrief('MTG-007')"><i class="fas fa-file-alt"></i> Pre-Meeting Brief</button>
                </div>
              </div>
            </div>

            <div class="upcoming-event renewal-event">
              <div class="ue-date"><span class="ue-d">28</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">Sandra Williams — Policy Renewal</div>
                <div class="ue-desc"><span class="act-domain-pill ins">Insurance</span> P-100320 · Review meeting</div>
                <div class="ue-actions">
                  <button class="btn-pmb" onclick="openMeetingBrief('MTG-008')"><i class="fas fa-file-alt"></i> Pre-Meeting Brief</button>
                </div>
              </div>
            </div>

          </div>

          {/* --- RECENT MEETINGS (Post-Meeting Summary) --- */}
          <div class="cal-sidebar-section-header" style="margin-top:16px">
            <h4><i class="fas fa-clipboard-check"></i> Recent Meetings</h4>
            <span class="cal-section-badge past-badge">3</span>
          </div>
          <div class="upcoming-list past-meetings-list">

            <div class="upcoming-event past-event">
              <div class="ue-date"><span class="ue-d">05</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">Maria G. — Annuity Review</div>
                <div class="ue-desc"><span class="act-domain-pill inv">Investments</span> Income annuity discussion</div>
                <div class="ue-actions">
                  <button class="btn-pms" onclick="openMeetingBrief('MTG-P01')"><i class="fas fa-clipboard-list"></i> Post-Meeting Summary</button>
                </div>
              </div>
            </div>

            <div class="upcoming-event past-event">
              <div class="ue-date"><span class="ue-d">03</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">Patricia Nguyen — UL Review</div>
                <div class="ue-desc"><span class="act-domain-pill ins">Insurance</span> Premium funding strategy</div>
                <div class="ue-actions">
                  <button class="btn-pms" onclick="openMeetingBrief('MTG-P02')"><i class="fas fa-clipboard-list"></i> Post-Meeting Summary</button>
                </div>
              </div>
            </div>

            <div class="upcoming-event past-event">
              <div class="ue-date"><span class="ue-d">01</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">James Whitfield — Initial Consult</div>
                <div class="ue-desc"><span class="act-domain-pill ret">Retirement</span> Needs analysis</div>
                <div class="ue-actions">
                  <button class="btn-pms" onclick="openMeetingBrief('MTG-P03')"><i class="fas fa-clipboard-list"></i> Post-Meeting Summary</button>
                </div>
              </div>
            </div>

          </div>

          {/* Mini domain summary */}
          <div class="cal-sidebar-summary">
            <div class="css-item ins-theme"><i class="fas fa-shield-alt"></i> <span>5</span> Insurance events</div>
            <div class="css-item inv-theme"><i class="fas fa-chart-line"></i> <span>2</span> Investment meetings</div>
            <div class="css-item ret-theme"><i class="fas fa-umbrella-beach"></i> <span>1</span> Retirement review</div>
            <div class="css-item adv-theme"><i class="fas fa-handshake"></i> <span>2</span> Advisory sessions</div>
          </div>

          <button class="btn btn-ai full-width-btn" onclick="sendContextMessage('Review my upcoming calendar and suggest optimal meeting preparation priorities for this week','advisor')">
            <i class="fas fa-robot"></i> AI Schedule Optimizer
          </button>
        </div>
      </div>

      {/* ===== MEETING BRIEF / POST-MEETING MODAL ===== */}
      <div id="meeting-modal-overlay" class="meeting-modal-overlay" onclick="closeMeetingModal(event)" style="display:none">
        <div class="meeting-modal" onclick="event.stopPropagation()">
          <div class="meeting-modal-header" id="meeting-modal-header">
            <div class="mmh-left">
              <div class="mmh-icon" id="mmh-icon"><i class="fas fa-file-alt"></i></div>
              <div>
                <div class="mmh-title" id="mmh-title">Meeting Brief</div>
                <div class="mmh-meta" id="mmh-meta">Loading…</div>
              </div>
            </div>
            <button class="modal-close" onclick="closeMeetingModal()"><i class="fas fa-times"></i></button>
          </div>

          <div class="meeting-modal-tabs" id="meeting-modal-tabs"></div>

          <div class="meeting-modal-body" id="meeting-modal-body"></div>

          <div class="meeting-modal-footer" id="meeting-modal-footer"></div>
        </div>
      </div>

    </div>
  )
}

// ============================================================
// AI IMPACT SCORECARD PAGE  (#8)
// ============================================================
function AIImpactScorecardPage() {
  return (
    <div class="page ais-page">

      {/* ── Hero Banner ── */}
      <div class="ais-hero">
        <div class="ais-hero-left">
          <div class="ais-hero-icon"><i class="fas fa-robot"></i><span class="ai-pulse-ring"></span></div>
          <div>
            <h2>AI Impact Scorecard</h2>
            <p>Measurable AI-driven outcomes across Insurance · Investments · Retirement · Advisory</p>
          </div>
        </div>
        <div class="ais-hero-right">
          <div class="ais-hero-kpi">
            <span class="ais-hero-val">$31.2K</span>
            <span class="ais-hero-lbl">AI Revenue Unlocked</span>
          </div>
          <div class="ais-hero-kpi">
            <span class="ais-hero-val">94.6%</span>
            <span class="ais-hero-lbl">AI Decision Accuracy</span>
          </div>
          <div class="ais-hero-kpi">
            <span class="ais-hero-val">4.2 hrs</span>
            <span class="ais-hero-lbl">Avg UW Decision (vs 8d)</span>
          </div>
          <div class="ais-hero-kpi">
            <span class="ais-hero-val">247</span>
            <span class="ais-hero-lbl">Clients AI-Monitored</span>
          </div>
        </div>
      </div>

      {/* ── Overall AI Score ── */}
      <div class="ais-overall-row">
        <div class="ais-overall-card">
          <div class="ais-overall-gauge">
            <svg viewBox="0 0 120 70" class="ais-gauge-svg">
              <path d="M10,65 A50,50 0 0,1 110,65" fill="none" stroke="#e2e8f0" stroke-width="10" stroke-linecap="round"/>
              <path d="M10,65 A50,50 0 0,1 110,65" fill="none" stroke="url(#gaugeGrad)" stroke-width="10"
                    stroke-linecap="round" stroke-dasharray="157" stroke-dashoffset="20"/>
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#1d4ed8"/>
                  <stop offset="100%" stop-color="#7c3aed"/>
                </linearGradient>
              </defs>
              <text x="60" y="60" text-anchor="middle" class="ais-gauge-val">87</text>
            </svg>
            <div class="ais-gauge-label">Overall AI Score</div>
          </div>
          <div class="ais-overall-desc">
            <p>Your AI systems are performing at <strong>87/100</strong> — <span class="ais-trend-up">↑ 12 pts vs. Q4 2025</span>. Four domains are active. Key gains: underwriting STP (+18%), retention detection (+23%), and claims automation (+31%).</p>
            <div class="ais-overall-chips">
              <span class="ais-chip green"><i class="fas fa-check-circle"></i> Underwriting STP: Excellent</span>
              <span class="ais-chip green"><i class="fas fa-check-circle"></i> Retention AI: Strong</span>
              <span class="ais-chip amber"><i class="fas fa-exclamation-circle"></i> Investment AI: Growing</span>
              <span class="ais-chip green"><i class="fas fa-check-circle"></i> Claims AI: Strong</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Domain Scorecard Grid ── */}
      <div class="ais-domain-grid">

        {/* Insurance + Underwriting */}
        <div class="ais-domain-card ais-ins">
          <div class="ais-domain-header">
            <div class="ais-domain-icon ins-bg"><i class="fas fa-shield-alt"></i></div>
            <div>
              <div class="ais-domain-title">Insurance & Underwriting AI</div>
              <div class="ais-domain-score-row">
                <span class="ais-domain-score">91</span>
                <span class="ais-domain-score-lbl">/ 100</span>
                <span class="ais-trend-up ais-score-delta">↑ +15 vs Q4</span>
              </div>
            </div>
          </div>
          <div class="ais-metric-list">
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">STP Rate</span>
              <div class="ais-bar-wrap"><div class="ais-bar ins-bar" style="width:73%"></div></div>
              <span class="ais-metric-val">73% <span class="ais-trend-up">↑+18%</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Avg Decision Time</span>
              <div class="ais-bar-wrap"><div class="ais-bar ins-bar" style="width:88%"></div></div>
              <span class="ais-metric-val">4.2 hrs <span class="ais-trend-up">vs 8 days</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">APS Avoided / Mo</span>
              <div class="ais-bar-wrap"><div class="ais-bar ins-bar" style="width:72%"></div></div>
              <span class="ais-metric-val">18 cases <span class="ais-trend-up">↑+6</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">AI Accuracy</span>
              <div class="ais-bar-wrap"><div class="ais-bar ins-bar" style="width:94.6%"></div></div>
              <span class="ais-metric-val">94.6% <span class="ais-trend-up">vs 89% manual</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Renewal Email Open Rate</span>
              <div class="ais-bar-wrap"><div class="ais-bar ins-bar" style="width:68%"></div></div>
              <span class="ais-metric-val">68% <span class="ais-trend-up">↑+22%</span></span>
            </div>
          </div>
          <div class="ais-roi-box ins-roi">
            <i class="fas fa-dollar-sign"></i>
            <span><strong>AI ROI:</strong> 30-50% faster underwriting = ~$18K/yr in productivity gain. 18 APS avoided × $450 avg cost = <strong>$8,100 saved/mo</strong>.</span>
          </div>
        </div>

        {/* Retention AI */}
        <div class="ais-domain-card ais-ret-card">
          <div class="ais-domain-header">
            <div class="ais-domain-icon ret-bg"><i class="fas fa-heartbeat"></i></div>
            <div>
              <div class="ais-domain-title">Retention Intelligence AI</div>
              <div class="ais-domain-score-row">
                <span class="ais-domain-score">88</span>
                <span class="ais-domain-score-lbl">/ 100</span>
                <span class="ais-trend-up ais-score-delta">↑ +23 vs Q4</span>
              </div>
            </div>
          </div>
          <div class="ais-metric-list">
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Lapse Risk Clients Detected</span>
              <div class="ais-bar-wrap"><div class="ais-bar ret-bar" style="width:100%"></div></div>
              <span class="ais-metric-val">15 / 247 <span class="ais-trend-neutral">→ monitored</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Retention Actions Triggered</span>
              <div class="ais-bar-wrap"><div class="ais-bar ret-bar" style="width:80%"></div></div>
              <span class="ais-metric-val">4 active <span class="ais-trend-up">↑+3 vs Q4</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Avg Lapse Prediction Lead Time</span>
              <div class="ais-bar-wrap"><div class="ais-bar ret-bar" style="width:75%"></div></div>
              <span class="ais-metric-val">67 days <span class="ais-trend-up">+22d earlier</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">High-Risk Clients Saved (Q1)</span>
              <div class="ais-bar-wrap"><div class="ais-bar ret-bar" style="width:60%"></div></div>
              <span class="ais-metric-val">3 of 5 <span class="ais-trend-up">↑60%</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Premium Retained via AI Alerts</span>
              <div class="ais-bar-wrap"><div class="ais-bar ret-bar" style="width:70%"></div></div>
              <span class="ais-metric-val">$14,200 <span class="ais-trend-up">↑+$4.8K</span></span>
            </div>
          </div>
          <div class="ais-roi-box ret-roi">
            <i class="fas fa-dollar-sign"></i>
            <span><strong>AI ROI:</strong> 3 clients retained × avg $4,733 premium = <strong>$14,200 premium saved</strong>. Lifetime value protected: ~$142K over 10 yr avg.</span>
          </div>
        </div>

        {/* Claims AI */}
        <div class="ais-domain-card ais-clm">
          <div class="ais-domain-header">
            <div class="ais-domain-icon clm-bg"><i class="fas fa-clipboard-check"></i></div>
            <div>
              <div class="ais-domain-title">Claims Automation AI</div>
              <div class="ais-domain-score-row">
                <span class="ais-domain-score">85</span>
                <span class="ais-domain-score-lbl">/ 100</span>
                <span class="ais-trend-up ais-score-delta">↑ +31 vs Q4</span>
              </div>
            </div>
          </div>
          <div class="ais-metric-list">
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Claims Auto-Triaged</span>
              <div class="ais-bar-wrap"><div class="ais-bar clm-bar" style="width:100%"></div></div>
              <span class="ais-metric-val">6 / 6 <span class="ais-trend-up">100%</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Avg Triage Time</span>
              <div class="ais-bar-wrap"><div class="ais-bar clm-bar" style="width:82%"></div></div>
              <span class="ais-metric-val">&lt; 2 min <span class="ais-trend-up">vs 45 min manual</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Document Gap Detection</span>
              <div class="ais-bar-wrap"><div class="ais-bar clm-bar" style="width:91%"></div></div>
              <span class="ais-metric-val">91% accuracy <span class="ais-trend-up">↑+11%</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Avg Claim Resolution Time</span>
              <div class="ais-bar-wrap"><div class="ais-bar clm-bar" style="width:65%"></div></div>
              <span class="ais-metric-val">7.2 days <span class="ais-trend-up">↓-3.8d</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">IDP Extraction Accuracy</span>
              <div class="ais-bar-wrap"><div class="ais-bar clm-bar" style="width:97%"></div></div>
              <span class="ais-metric-val">97.3% <span class="ais-trend-up">↑+8%</span></span>
            </div>
          </div>
          <div class="ais-roi-box clm-roi">
            <i class="fas fa-dollar-sign"></i>
            <span><strong>AI ROI:</strong> Auto-triage saves ~43 min/claim × 6 claims = <strong>4.3 hrs/mo</strong> reclaimed. IDP: eliminates manual data entry on ~30 docs/mo.</span>
          </div>
        </div>

        {/* Proactive AI Alerts */}
        <div class="ais-domain-card ais-alert">
          <div class="ais-domain-header">
            <div class="ais-domain-icon alert-bg"><i class="fas fa-bell"></i></div>
            <div>
              <div class="ais-domain-title">Proactive Alert Engine</div>
              <div class="ais-domain-score-row">
                <span class="ais-domain-score">92</span>
                <span class="ais-domain-score-lbl">/ 100</span>
                <span class="ais-trend-up ais-score-delta">↑ +19 vs Q4</span>
              </div>
            </div>
          </div>
          <div class="ais-metric-list">
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Alerts Generated (Q1)</span>
              <div class="ais-bar-wrap"><div class="ais-bar alert-bar" style="width:84%"></div></div>
              <span class="ais-metric-val">42 alerts <span class="ais-trend-up">↑+18</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Agent Action Rate on Alerts</span>
              <div class="ais-bar-wrap"><div class="ais-bar alert-bar" style="width:78%"></div></div>
              <span class="ais-metric-val">78% acted <span class="ais-trend-up">↑+12%</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Alert → Revenue Conversion</span>
              <div class="ais-bar-wrap"><div class="ais-bar alert-bar" style="width:52%"></div></div>
              <span class="ais-metric-val">52% convert <span class="ais-trend-up">↑+9%</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Obituary / Death Detection</span>
              <div class="ais-bar-wrap"><div class="ais-bar alert-bar" style="width:100%"></div></div>
              <span class="ais-metric-val">4 detected <span class="ais-trend-neutral">→ all actioned</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Avg Alert Lead Time</span>
              <div class="ais-bar-wrap"><div class="ais-bar alert-bar" style="width:80%"></div></div>
              <span class="ais-metric-val">1.8 days <span class="ais-trend-up">before manual discovery</span></span>
            </div>
          </div>
          <div class="ais-roi-box alert-roi">
            <i class="fas fa-dollar-sign"></i>
            <span><strong>AI ROI:</strong> 52% of 42 alerts actioned = 22 revenue events. At avg $1,400/event = <strong>~$30.8K incremental revenue</strong> from AI alerting.</span>
          </div>
        </div>

        {/* Investment AI */}
        <div class="ais-domain-card ais-inv">
          <div class="ais-domain-header">
            <div class="ais-domain-icon inv-bg"><i class="fas fa-chart-line"></i></div>
            <div>
              <div class="ais-domain-title">Investment & Advisory AI</div>
              <div class="ais-domain-score-row">
                <span class="ais-domain-score">76</span>
                <span class="ais-domain-score-lbl">/ 100</span>
                <span class="ais-trend-up ais-score-delta">↑ +8 vs Q4</span>
              </div>
            </div>
          </div>
          <div class="ais-metric-list">
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Portfolio Gap Detection Rate</span>
              <div class="ais-bar-wrap"><div class="ais-bar inv-bar" style="width:89%"></div></div>
              <span class="ais-metric-val">89% <span class="ais-trend-up">↑+14%</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Annuity Candidates Identified</span>
              <div class="ais-bar-wrap"><div class="ais-bar inv-bar" style="width:80%"></div></div>
              <span class="ais-metric-val">4 clients <span class="ais-trend-up">↑+2</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">UMA Opportunity Flagged</span>
              <div class="ais-bar-wrap"><div class="ais-bar inv-bar" style="width:60%"></div></div>
              <span class="ais-metric-val">$280K AUM <span class="ais-trend-up">$2,800/yr fee</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Cross-Sell Insights Generated</span>
              <div class="ais-bar-wrap"><div class="ais-bar inv-bar" style="width:72%"></div></div>
              <span class="ais-metric-val">9 insights <span class="ais-trend-up">across 247 clients</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Investment AI Adoption Rate</span>
              <div class="ais-bar-wrap"><div class="ais-bar inv-bar" style="width:25%"></div></div>
              <span class="ais-metric-val">25% clients <span class="ais-trend-up">↑+6% growing</span></span>
            </div>
          </div>
          <div class="ais-roi-box inv-roi">
            <i class="fas fa-dollar-sign"></i>
            <span><strong>AI ROI:</strong> 9 cross-sell insights × avg $1,400 revenue each = <strong>$12,600 potential</strong>. UMA close: Linda Morrison $2,800/yr recurring fee.</span>
          </div>
        </div>

        {/* Meeting AI */}
        <div class="ais-domain-card ais-mtg">
          <div class="ais-domain-header">
            <div class="ais-domain-icon mtg-bg"><i class="fas fa-calendar-check"></i></div>
            <div>
              <div class="ais-domain-title">Meeting Intelligence AI</div>
              <div class="ais-domain-score-row">
                <span class="ais-domain-score">83</span>
                <span class="ais-domain-score-lbl">/ 100</span>
                <span class="ais-trend-up ais-score-delta">↑ New Feature</span>
              </div>
            </div>
          </div>
          <div class="ais-metric-list">
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Meetings with AI Brief</span>
              <div class="ais-bar-wrap"><div class="ais-bar mtg-bar" style="width:100%"></div></div>
              <span class="ais-metric-val">8 / 8 <span class="ais-trend-up">100% coverage</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Post-Meeting Summaries</span>
              <div class="ais-bar-wrap"><div class="ais-bar mtg-bar" style="width:100%"></div></div>
              <span class="ais-metric-val">3 / 3 <span class="ais-trend-up">auto-generated</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Follow-Up Actions Identified</span>
              <div class="ais-bar-wrap"><div class="ais-bar mtg-bar" style="width:82%"></div></div>
              <span class="ais-metric-val">11 actions <span class="ais-trend-up">3 urgent flagged</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">Avg Brief Prep Time Saved</span>
              <div class="ais-bar-wrap"><div class="ais-bar mtg-bar" style="width:90%"></div></div>
              <span class="ais-metric-val">~25 min/mtg <span class="ais-trend-up">↓ vs manual</span></span>
            </div>
            <div class="ais-metric-row">
              <span class="ais-metric-lbl">AI Sentiment Accuracy</span>
              <div class="ais-bar-wrap"><div class="ais-bar mtg-bar" style="width:87%"></div></div>
              <span class="ais-metric-val">87% match <span class="ais-trend-up">post-review</span></span>
            </div>
          </div>
          <div class="ais-roi-box mtg-roi">
            <i class="fas fa-dollar-sign"></i>
            <span><strong>AI ROI:</strong> 8 meetings × 25 min saved = <strong>3.3 hrs/mo</strong> reclaimed for selling. Better prep → estimated +12% meeting conversion rate.</span>
          </div>
        </div>

      </div>

      {/* ── AI vs. Manual Comparison Table ── */}
      <div class="ais-comparison-section">
        <h3 class="ais-section-title"><i class="fas fa-balance-scale"></i> AI vs. Manual — Side-by-Side Impact</h3>
        <div class="ais-comparison-table">
          <div class="ais-cmp-header">
            <span>Metric</span>
            <span class="cmp-manual-hdr"><i class="fas fa-user"></i> Manual</span>
            <span class="cmp-ai-hdr"><i class="fas fa-robot"></i> AI-Assisted</span>
            <span class="cmp-gain-hdr">Improvement</span>
          </div>
          <div class="ais-cmp-row">
            <span>Underwriting Decision Time</span>
            <span class="cmp-manual">8 days avg</span>
            <span class="cmp-ai">4.2 hrs avg</span>
            <span class="cmp-gain">↑ <strong>96% faster</strong></span>
          </div>
          <div class="ais-cmp-row">
            <span>Lapse Detection Lead Time</span>
            <span class="cmp-manual">~7 days (missed 40%)</span>
            <span class="cmp-ai">67 days ahead</span>
            <span class="cmp-gain">↑ <strong>+22 days earlier</strong></span>
          </div>
          <div class="ais-cmp-row">
            <span>Claim Triage Time</span>
            <span class="cmp-manual">45 min/claim</span>
            <span class="cmp-ai">&lt; 2 min/claim</span>
            <span class="cmp-gain">↑ <strong>95% faster</strong></span>
          </div>
          <div class="ais-cmp-row">
            <span>Document Extraction (IDP)</span>
            <span class="cmp-manual">30 min/doc, 82% accuracy</span>
            <span class="cmp-ai">&lt; 30 sec, 97.3% accuracy</span>
            <span class="cmp-gain">↑ <strong>60× faster, +15% accuracy</strong></span>
          </div>
          <div class="ais-cmp-row">
            <span>Meeting Prep Time</span>
            <span class="cmp-manual">25-40 min manual research</span>
            <span class="cmp-ai">~2 min (auto-brief)</span>
            <span class="cmp-gain">↑ <strong>93% faster</strong></span>
          </div>
          <div class="ais-cmp-row">
            <span>Cross-Sell Opportunity Detection</span>
            <span class="cmp-manual">Ad-hoc, 2-3 insights/mo</span>
            <span class="cmp-ai">9 insights, continuous</span>
            <span class="cmp-gain">↑ <strong>3× more insights</strong></span>
          </div>
          <div class="ais-cmp-row">
            <span>Portfolio Gap Identification</span>
            <span class="cmp-manual">Quarterly manual review</span>
            <span class="cmp-ai">Real-time, 89% detection</span>
            <span class="cmp-gain">↑ <strong>Continuous vs. quarterly</strong></span>
          </div>
          <div class="ais-cmp-row">
            <span>APS Required per Month</span>
            <span class="cmp-manual">~30 APS orders</span>
            <span class="cmp-ai">12 APS orders</span>
            <span class="cmp-gain">↓ <strong>18 APS avoided ($8,100 saved)</strong></span>
          </div>
        </div>
      </div>

      {/* ── Total ROI Summary ── */}
      <div class="ais-roi-summary">
        <h3 class="ais-section-title"><i class="fas fa-trophy"></i> Total AI Business Impact — Q1 2026</h3>
        <div class="ais-roi-grid">
          <div class="ais-roi-card roi-revenue">
            <div class="ais-roi-icon"><i class="fas fa-dollar-sign"></i></div>
            <div class="ais-roi-val">$31.2K</div>
            <div class="ais-roi-title">AI-Driven Revenue Unlocked</div>
            <div class="ais-roi-desc">From proactive alerts, cross-sell insights, retention saves, and UMA opportunity identification</div>
          </div>
          <div class="ais-roi-card roi-saved">
            <div class="ais-roi-icon"><i class="fas fa-piggy-bank"></i></div>
            <div class="ais-roi-val">$8,100</div>
            <div class="ais-roi-title">Cost Savings / Month</div>
            <div class="ais-roi-desc">18 APS orders avoided × $450 avg cost = $8,100/mo in underwriting cost reduction</div>
          </div>
          <div class="ais-roi-card roi-time">
            <div class="ais-roi-icon"><i class="fas fa-clock"></i></div>
            <div class="ais-roi-val">~41 hrs</div>
            <div class="ais-roi-title">Agent Time Reclaimed / Month</div>
            <div class="ais-roi-desc">UW (28 hrs) + Claims triage (4.3 hrs) + Meeting prep (3.3 hrs) + IDP (5.4 hrs)</div>
          </div>
          <div class="ais-roi-card roi-retained">
            <div class="ais-roi-icon"><i class="fas fa-shield-alt"></i></div>
            <div class="ais-roi-val">$14,200</div>
            <div class="ais-roi-title">Premium Retained via AI</div>
            <div class="ais-roi-desc">3 lapse-risk clients saved × avg $4,733 annual premium. LTV impact: ~$142K over 10 years</div>
          </div>
          <div class="ais-roi-card roi-nps">
            <div class="ais-roi-icon"><i class="fas fa-star"></i></div>
            <div class="ais-roi-val">+14 pts</div>
            <div class="ais-roi-title">Client Satisfaction Gain</div>
            <div class="ais-roi-desc">Faster claims (7.2 days), proactive alerts, and AI-assisted meeting preparation improve NPS</div>
          </div>
          <div class="ais-roi-card roi-pipeline">
            <div class="ais-roi-icon"><i class="fas fa-funnel-dollar"></i></div>
            <div class="ais-roi-val">+18%</div>
            <div class="ais-roi-title">Pipeline Conversion Lift</div>
            <div class="ais-roi-desc">AI-assisted UW, proactive outreach and meeting briefs improved pipeline conversion from 52% to 68%</div>
          </div>
        </div>
      </div>

      {/* ── AI Adoption Timeline ── */}
      <div class="ais-timeline-section">
        <h3 class="ais-section-title"><i class="fas fa-road"></i> AI Feature Adoption — NYL Agent 360</h3>
        <div class="ais-timeline">
          <div class="ais-tl-item tl-done">
            <div class="ais-tl-dot done-dot"></div>
            <div class="ais-tl-content">
              <div class="ais-tl-date">Q3 2025</div>
              <div class="ais-tl-title">IDP Document Intelligence</div>
              <div class="ais-tl-desc">AI-powered document extraction on claims and policies. 97.3% accuracy. 30 docs/mo automated.</div>
            </div>
          </div>
          <div class="ais-tl-item tl-done">
            <div class="ais-tl-dot done-dot"></div>
            <div class="ais-tl-content">
              <div class="ais-tl-date">Q4 2025</div>
              <div class="ais-tl-title">Proactive Alert Engine</div>
              <div class="ais-tl-desc">Death/obituary detection, renewal alerts, and lapse risk signals. 42 alerts generated Q1.</div>
            </div>
          </div>
          <div class="ais-tl-item tl-done">
            <div class="ais-tl-dot done-dot"></div>
            <div class="ais-tl-content">
              <div class="ais-tl-date">Q1 2026</div>
              <div class="ais-tl-title">Underwriting STP Engine</div>
              <div class="ais-tl-desc">AI straight-through processing: 73% STP rate, 4.2 hr avg decision time, 94.6% accuracy.</div>
            </div>
          </div>
          <div class="ais-tl-item tl-done">
            <div class="ais-tl-dot done-dot"></div>
            <div class="ais-tl-content">
              <div class="ais-tl-date">Q1 2026</div>
              <div class="ais-tl-title">Retention Intelligence</div>
              <div class="ais-tl-desc">ML lapse prediction 67 days ahead. 3 of 5 Q1 at-risk clients retained. $14.2K premium saved.</div>
            </div>
          </div>
          <div class="ais-tl-item tl-done">
            <div class="ais-tl-dot done-dot"></div>
            <div class="ais-tl-content">
              <div class="ais-tl-date">Q1 2026</div>
              <div class="ais-tl-title">Pre-Meeting Brief & Post-Meeting Summary</div>
              <div class="ais-tl-desc">AI-generated meeting briefs (client snapshot, AI alerts, talking points, documents). 25 min saved/meeting.</div>
            </div>
          </div>
          <div class="ais-tl-item tl-done">
            <div class="ais-tl-dot done-dot"></div>
            <div class="ais-tl-content">
              <div class="ais-tl-date">Q1 2026</div>
              <div class="ais-tl-title">AI Agent Hub + Context Buttons</div>
              <div class="ais-tl-desc">8 specialised AI agents across all 4 domains. 30 context buttons for instant deep-link queries.</div>
            </div>
          </div>
          <div class="ais-tl-item tl-next">
            <div class="ais-tl-dot next-dot"></div>
            <div class="ais-tl-content">
              <div class="ais-tl-date">Q2 2026</div>
              <div class="ais-tl-title">AI Portfolio Optimizer</div>
              <div class="ais-tl-desc">Automated rebalancing recommendations, FIA suitability scoring, and UMA candidate ranking across $4.2M AUM.</div>
            </div>
          </div>
          <div class="ais-tl-item tl-next">
            <div class="ais-tl-dot next-dot"></div>
            <div class="ais-tl-content">
              <div class="ais-tl-date">Q2 2026</div>
              <div class="ais-tl-title">AI Voice Assistant</div>
              <div class="ais-tl-desc">Hands-free AI querying via voice — client briefs, pipeline updates, and claim status on demand.</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default app
