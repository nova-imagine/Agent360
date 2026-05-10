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
          <title>NOVA Analytics Agent 360 | New York Life</title>
          <link rel="stylesheet" href="/static/style.css?v=360d" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" />
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body>
          {children}
          <script src="/static/app.js?v=360d"></script>
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

  // ── Workflow-specific rich responses ──────────────────────────────────────

  if (q.includes('renewal email campaign') && (q.includes('results') || q.includes('contacted') || q.includes('next steps'))) {
    return "📧 **Renewal Email Campaign — Run Complete**\n\n**8 emails sent** this run · 15 previously sent · **23/23 clients reached**\n\n**Today's sends:**\n• Sandra Williams — \"Your Term Policy Renewal Options\"\n• Patricia Nguyen — \"Urgent: Avoid a Coverage Gap\"\n• David Thompson — \"Your Policy Renewal — Let's Review\"\n• Kevin Park — \"Your Renewal Options Are Ready\"\n• James Whitfield — \"Whole Life Annual Review\"\n• Maria Gonzalez — \"Renewal Reminder\"\n• Robert Chen — \"Coverage Review for 2026–27\"\n• Linda Morrison — \"Annual Premium Review\"\n\n**3 high-priority follow-ups scheduled this week:**\n• Sandra Williams (Apr 28 meeting confirmed)\n• Patricia Nguyen (May 1 call scheduled)\n• Kevin Park (Apr 18 call requested)\n\n📊 Open rate tracking will be available in 24 hours. Would you like to review or personalise any of these emails?"
  }

  if (q.includes('portfolio health report') || (q.includes('portfolio') && q.includes('1,842'))) {
    return "📊 **Portfolio Health Monitor — Full Scan Results**\n\n**1,842 policies scanned** in 3.2 seconds\n\n⚠️ **Lapse Risks (4 clients · $25,200/yr at risk):**\n• **Patricia Nguyen** — UL P-100301, risk score 87, catch-up needed by May 15\n• **Sandra Williams** — Term P-100320, expiry Sep 2026, conversion window open\n• **David Thompson** — Term P-100308, sub-standard, review overdue\n• **Kevin Park** — WL P-100315, 90-day window, action needed\n\n🔍 **Coverage Gaps (3 clients):**\n• Patricia Nguyen — No disability coverage\n• David Thompson — No LTC rider (new parent)\n• James Whitfield — No annuity or income bridge\n\n💡 **Top Upsell Opportunities:**\n• Linda Morrison — LTC rider (+$4,200/yr)\n• Robert Chen — Key-person + group life gap\n• Maria Gonzalez — Annuity ladder post-ADB claim\n\nTotal **upsell potential: $18,400/yr** · Shall I draft outreach for each?"
  }

  if ((q.includes('rebalanc') && q.includes('investment')) || (q.includes('aum') && q.includes('rebalanc'))) {
    return "⚖️ **AUM Rebalancing Monitor — Analysis Complete**\n\n**$4.2M AUM** across 62 clients · +14% YTD\n\n**Rebalancing Required (2 clients):**\n\n**Robert Chen — $180K VUL**\n• Drift: +8% equity vs. 60/40 target\n• Action: Move $14,400 from Growth → Bond Index\n• Revenue: $180 rebalancing fee\n\n**Maria Gonzalez — $75K Annuity Maturing June 15**\n• Option A: FIA rollover at 6.2% cap rate\n• Option B: Income annuity → $620/month at age 65\n• Revenue: $3,750 new commission\n\n**Portfolio highlights:**\n• Linda Morrison UMA: +18.4% YTD (top performer)\n• Kevin Park variable: -2.1% YTD — sector review recommended\n• 4 active 529 plans: all on-track\n\n**Total rebalancing revenue: $3,930** · Ready to generate client proposals?"
  }

  if (q.includes('retirement income gap') || (q.includes('income gap') && q.includes('4 candidate'))) {
    return "🏖️ **Retirement Income Gap Scan — 4 Clients Identified**\n\n**Gap 1 — James Whitfield (52) · $2,100/month shortfall**\n• SS: $3,200 · Expenses: $5,300/mo\n• ✅ Deferred annuity: $85K → $1,100/mo at 67\n• Illustration ready — schedule meeting\n\n**Gap 2 — Sandra Williams (61) · $1,800/month shortfall**\n• SS: $2,400 · Expenses: $4,200/mo\n• ✅ Immediate annuity: $120K → $1,400/mo\n• Near-retirement priority — act this month\n\n**Gap 3 — Linda Morrison (56) · $1,400/month shortfall**\n• SS: $2,800 · Expenses: $4,200/mo\n• ✅ FIA $150K + UMA income strategy\n• Present at April 15 annual review\n\n**Gap 4 — Maria Gonzalez (48) · $900/month shortfall**\n• SS: $2,100 · Expenses: $3,000/mo\n• ✅ FIA $75K → $620/mo at age 65\n\n**Total annuity opportunity: $430,000 · Est. commission: $19,350**\nShall I generate illustrated income projections for each client?"
  }

  if (q.includes('life events') || (q.includes('life event') && q.includes('detected'))) {
    return "🎉 **Life Events Trigger — 3 Events Actioned**\n\n**Event 1 — David Thompson · New Baby (Mar 28)**\n• Gap: No LTC, no disability coverage\n• Action: Increase term $300K→$600K + child rider + DI policy\n• Email drafted: 'Congratulations on your new arrival!'\n• Revenue: +$4,200/yr\n\n**Event 2 — Kevin Park · Marriage (Apr 2)**\n• Gap: Beneficiary update needed, no joint life review\n• Action: Beneficiary change + joint life policy + UL upgrade\n• Email drafted: 'Congratulations! A quick review protects both of you.'\n• Revenue: +$3,800/yr\n\n**Event 3 — Nancy Foster (Prospect) · Home Purchase (Mar 31)**\n• Public record: mortgage filed\n• Action: Mortgage protection term + home insurance referral\n• Email drafted: 'Congratulations on your new home!'\n• Revenue: +$2,400/yr\n\n**Total opportunity: $10,400/yr** · Workflow now Active · Next scan in 24 hours"
  }

  if (q.includes('estate planning') && (q.includes('qualified') || q.includes('briefs') || q.includes('trigger'))) {
    return "🏛️ **Estate Planning Trigger — 4 Clients Qualified**\n\n**1. Linda Morrison — Estate ~$3.2M**\n• WL: $2M death benefit · Investable: $500K+\n• Trust last updated: 2019 — overdue for review\n• Action: Trust update + UMA $280K + beneficiary review\n• Meeting: April 15 (estate agenda included) · Revenue: $2,800/yr fee\n\n**2. Robert Chen — Business Estate ~$4M**\n• No buy-sell agreement, no succession plan\n• Action: $2M key-person life + NQDC + buy-sell agreement\n• Revenue: $18,000 new premium + advisory fee\n\n**3. James Whitfield — Estate ~$1.8M**\n• Will last reviewed: 2017 — no POA on file\n• Action: Will refresh + NQDC enrolment + deferred annuity\n• Revenue: $12,000 annuity + advisory fee\n\n**4. Linda Chen (Prospect) — Estate ~$1.1M**\n• Referral from Robert Chen · No existing policies\n• Action: Initial estate consultation + WL proposal · Revenue: $8,000+\n\n**Total advisory revenue potential: $45,800** · Shall I schedule consultations?"
  }

  if (q.includes('claims triage') || (q.includes('triage') && q.includes('7 open'))) {
    return "📋 **Claims Triage Automation — 7 Claims Processed**\n\n🔴 **Urgent — Immediate Action:**\n• **CLM-2026-0041** Robert Chen $1M death benefit · Doc pending: certified death cert · Escalated to Sr. Claims Manager · ETA: 5–7 days\n• **CLM-2026-0028** Maria Gonzalez ADB · Doc pending: oncologist cert Form AB-12 · Medical review assigned · ETA: 3–5 days\n\n🟡 **Standard — Action This Week:**\n• CLM-2026-0033 James Whitfield LTC — care provider invoice pending (3 days)\n• CLM-2026-0029 David Thompson Disability — employer verification pending (2 days)\n• CLM-2026-0025 Kevin Park — contestability review (24 days remaining)\n\n⚪ **Monitoring:**\n• CLM-2026-0019 Linda Morrison — waiver approved, disbursement pending\n• CLM-2026-0014 Patricia Nguyen — documentation complete, final review\n\n**Workflow Active** · Auto-monitoring every 4 hours · 3 document requests sent automatically"
  }

  if (q.includes('business client review') || (q.includes('nqdc') && q.includes('coli') && q.includes('key-person'))) {
    return "🏢 **Business Client Review — 2 Clients · Proposals Ready**\n\n**Robert Chen — Chen Holdings ($4M valuation)**\n• Key-person life gap: $2M WL or term recommended → $8,400/yr\n• NQDC plan: Defer up to $200K/yr · Retire with $2M+ tax-deferred\n• COLI: 5 key employees $500K each → $12,000/yr premium\n• **Total Chen revenue: $20,400/yr**\n\n**James Whitfield — Executive ($380K income)**\n• NQDC enrolment: Defer $80K/yr → $14,400/yr retirement income at 67\n• Section 162 Bonus Plan: $500K WL policy funded by employer bonus ($18K/yr)\n• **Total Whitfield revenue: $18,000/yr**\n\n📄 **3 proposals generated and ready to send:**\n1. Chen Holdings Key-Person + COLI Proposal\n2. Chen Holdings NQDC Plan Overview\n3. Whitfield Executive Benefits Package\n\n**Total business services revenue: $38,400/yr** · Ready to schedule meetings?"
  }

  if (q.includes('all automation workflows') || (q.includes('run all') && q.includes('workflow'))) {
    return "⚡ **All Automation Workflows — Consolidated Status**\n\n✅ **Running (4):**\n• Renewal Email Campaign — 15/23 sent, 8 pending\n• Portfolio Health Monitor — 1,842 policies, 4 lapse risks flagged\n• AUM Rebalancing Monitor — $4.2M, 2 rebalances pending\n• Retirement Income Gap Scan — 4 candidates identified\n\n⏸️ **Paused (2) — Action Needed:**\n• Life Events Trigger — 3 events detected, resume to process\n• Estate Planning Trigger — 4 qualified clients, briefs ready to generate\n\n⏹️ **Idle (2) — Available to Activate:**\n• Claims Triage Automation — 7 open claims awaiting triage\n• Business Client Review — 2 business owners, proposals pending\n\n💰 **Total Revenue Opportunity Across All Workflows: $89,340/yr**\n\nWould you like me to resume the paused workflows or activate the idle ones?"
  }

  // ── Standard responses ─────────────────────────────────────────────────────
  if (q.includes('renewal') || q.includes('renew')) {
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
      {/* Hidden page templates */}
      <div id="page-templates" style="display:none">
        <div id="tpl-dashboard"><DashboardPage /></div>
        <div id="tpl-clients"><ClientsPage /></div>
        <div id="tpl-campaigns"><CampaignsPage /></div>
        <div id="tpl-upsell"><UpsellTrackPage /></div>
        <div id="tpl-prospects"><ProspectsPage /></div>
        <div id="tpl-opportunities"><OpportunitiesPage /></div>
        <div id="tpl-policies"><PoliciesPage /></div>
        <div id="tpl-claims"><ClaimsPage /></div>
        <div id="tpl-ai-agents"><AIAgentsPage /></div>
        <div id="tpl-sales"><SalesPage /></div>
        <div id="tpl-underwriting"><UnderwritingPage /></div>
        <div id="tpl-products"><ProductsPage /></div>
        <div id="tpl-reports"><ReportsPage /></div>
        <div id="tpl-calendar"><CalendarPage /></div>
        <div id="tpl-ai-insights"><AIImpactScorecardPage /></div>
        <div id="tpl-settings"><SettingsPage /></div>
        <div id="tpl-alerts"><PolicyAlertsPage /></div>
        <div id="tpl-pipeline-view"><PipelineViewPage /></div>
        <div id="tpl-help"><HelpPage /></div>
        <div id="tpl-fna"><FNADiscoveryPage /></div>
        <div id="tpl-delivery"><PolicyDeliveryPage /></div>
        <div id="tpl-leads"><LeadsPage /></div>
      </div>

      {/* ── Workflow Execution Modal ── */}
      <div id="wf-modal-overlay" class="wf-modal-overlay" onclick="closeWfModal(event)">
        <div class="wf-modal" id="wf-modal">
          <div class="wf-modal-header" id="wf-modal-header">
            <div class="wf-modal-title-row">
              <div class="wf-modal-icon" id="wf-modal-icon"><i class="fas fa-cog fa-spin"></i></div>
              <div>
                <div class="wf-modal-title" id="wf-modal-title">Running Workflow...</div>
                <div class="wf-modal-sub" id="wf-modal-sub">Executing automation steps</div>
              </div>
            </div>
            <button class="wf-modal-close" onclick="closeWfModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="wf-modal-progress-wrap">
            <div class="wf-modal-progress-bar" id="wf-modal-progress-bar" style="width:0%"></div>
          </div>
          <div class="wf-modal-steps" id="wf-modal-steps"></div>
          <div class="wf-modal-result" id="wf-modal-result" style="display:none">
            <div class="wf-modal-result-body" id="wf-modal-result-body"></div>
            <div class="wf-modal-footer">
              <button class="wf-modal-btn primary" onclick="openWfInChat()"><i class="fas fa-comment-alt"></i> Open in Chat</button>
              <button class="wf-modal-btn secondary" onclick="closeWfModal()"><i class="fas fa-times"></i> Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cmd+K Spotlight Search Modal ── */}
      <div id="spotlight-overlay" class="spotlight-overlay" onclick="closeSpotlight(event)">
        <div class="spotlight-modal" id="spotlight-modal">
          {/* Header */}
          <div class="spotlight-header">
            <i class="fas fa-search spotlight-search-icon"></i>
            <input
              type="text"
              id="spotlight-input"
              class="spotlight-input"
              placeholder="Search clients, policies, claims, deals…"
              oninput="runSpotlightSearch(this.value)"
              onkeydown="spotlightKeyNav(event)"
              autocomplete="off"
            />
            <button class="spotlight-clear" id="spotlight-clear" onclick="clearSpotlight()" style="display:none">
              <i class="fas fa-times"></i>
            </button>
            <kbd class="spotlight-esc-key">Esc</kbd>
          </div>

          {/* Scope filter pills */}
          <div class="spotlight-scopes">
            <button class="sp-scope active" data-scope="all"    onclick="setSpotlightScope('all',this)">All</button>
            <button class="sp-scope"        data-scope="clients" onclick="setSpotlightScope('clients',this)"><i class="fas fa-users"></i> Clients</button>
            <button class="sp-scope"        data-scope="policies" onclick="setSpotlightScope('policies',this)"><i class="fas fa-file-contract"></i> Policies</button>
            <button class="sp-scope"        data-scope="claims"  onclick="setSpotlightScope('claims',this)"><i class="fas fa-file-medical-alt"></i> Claims</button>
            <button class="sp-scope"        data-scope="deals"   onclick="setSpotlightScope('deals',this)"><i class="fas fa-handshake"></i> Deals</button>
          </div>

          {/* Results area */}
          <div class="spotlight-results" id="spotlight-results">
            {/* Default state – quick actions */}
            <div class="sp-section" id="sp-quick-actions">
              <div class="sp-section-label">Quick Actions</div>
              <div class="sp-row sp-action-row" onclick="navigateTo('clients'); closeSpotlight()">
                <span class="sp-row-icon sp-icon-clients"><i class="fas fa-users"></i></span>
                <span class="sp-row-label">View All Clients</span>
                <span class="sp-row-meta">Clients page</span>
              </div>
              <div class="sp-row sp-action-row" onclick="navigateTo('policies'); closeSpotlight()">
                <span class="sp-row-icon sp-icon-policies"><i class="fas fa-file-contract"></i></span>
                <span class="sp-row-label">View All Policies</span>
                <span class="sp-row-meta">Policies page</span>
              </div>
              <div class="sp-row sp-action-row" onclick="navigateTo('claims'); closeSpotlight()">
                <span class="sp-row-icon sp-icon-claims"><i class="fas fa-file-medical-alt"></i></span>
                <span class="sp-row-label">View All Claims</span>
                <span class="sp-row-meta">Claims page</span>
              </div>
              <div class="sp-row sp-action-row" onclick="navigateTo('sales'); closeSpotlight()">
                <span class="sp-row-icon sp-icon-deals"><i class="fas fa-handshake"></i></span>
                <span class="sp-row-label">Journey Pipeline</span>
                <span class="sp-row-meta">Journey Pipeline page</span>
              </div>
              <div class="sp-row sp-action-row" onclick="navigateTo('calendar'); closeSpotlight()">
                <span class="sp-row-icon sp-icon-cal"><i class="fas fa-calendar-alt"></i></span>
                <span class="sp-row-label">Open Calendar</span>
                <span class="sp-row-meta">Calendar page</span>
              </div>
              <div class="sp-row sp-action-row" onclick="openAddEventModal(); closeSpotlight()">
                <span class="sp-row-icon sp-icon-cal"><i class="fas fa-calendar-plus"></i></span>
                <span class="sp-row-label">Add Calendar Event</span>
                <span class="sp-row-meta">Calendar</span>
              </div>
            </div>

            {/* Live results (populated by JS) */}
            <div id="sp-live-results" style="display:none"></div>

            {/* Empty state */}
            <div id="sp-empty" class="sp-empty" style="display:none">
              <i class="fas fa-search-minus sp-empty-icon"></i>
              <div class="sp-empty-text">No results found</div>
              <div class="sp-empty-sub">Try a different name, ID, or keyword</div>
            </div>
          </div>

          {/* Footer hint */}
          <div class="spotlight-footer">
            <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
            <span><kbd>↵</kbd> open</span>
            <span><kbd>Esc</kbd> close</span>
            <span class="sp-footer-count" id="sp-result-count"></span>
          </div>
        </div>
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
          <span class="brand-nova">NOVA</span>
          <span class="brand-analytics">ANALYTICS</span>
          <span class="brand-tagline">Agent 360</span>
        </div>

      </div>

      <nav class="sidebar-nav">

        {/* ── MAIN ── */}
        <div class="nav-section-label">MAIN</div>
        <a class="nav-item active" onclick="navigateTo('dashboard')" href="#">
          <i class="fas fa-th-large"></i><span>Dashboard</span>
        </a>
        <a class="nav-item" onclick="navigateTo('clients')" href="#">
          <i class="fas fa-users"></i><span>Clients</span>
          <span class="nav-badge">247</span>
        </a>
        <a class="nav-item" onclick="navigateTo('calendar')" href="#">
          <i class="fas fa-calendar-alt"></i><span>Calendar</span>
          <span class="nav-badge alert">3</span>
        </a>

        {/* ── PROSPECTING (Phase 1–2) ── */}
        <div class="nav-section-label">PROSPECTING</div>
        <a class="nav-item leads-nav" onclick="navigateTo('leads')" href="#">
          <i class="fas fa-user-plus"></i><span>Leads</span>
          <span class="nav-badge" style="background:#f59e0b;color:#fff" id="leads-nav-badge">6</span>
        </a>
        <a class="nav-item campaigns-nav" onclick="navigateTo('campaigns')" href="#">
          <i class="fas fa-bullhorn"></i><span>Campaigns</span>
          <span class="nav-badge" style="background:#0891b2;color:#fff">5</span>
        </a>
        <a class="nav-item prospects-nav" onclick="navigateTo('prospects')" href="#">
          <i class="fas fa-user-clock"></i><span>Prospects</span>
          <span class="nav-badge" style="background:#7c3aed;color:#fff">14</span>
        </a>
        <a class="nav-item" onclick="navigateTo('fna')" href="#">
          <i class="fas fa-clipboard-list"></i><span>FNA Discovery</span>
          <span class="nav-badge" style="background:#059669;color:#fff">3</span>
        </a>

        {/* ── SALES (Phase 3–4) ── */}
        <div class="nav-section-label">SALES</div>
        <a class="nav-item opportunities-nav" onclick="navigateTo('opportunities')" href="#">
          <i class="fas fa-bolt"></i><span>Opportunities</span>
          <span class="nav-badge" style="background:#7c3aed;color:#fff" id="opp-nav-badge">5</span>
        </a>
        <a class="nav-item" onclick="navigateTo('products')" href="#">
          <i class="fas fa-flask"></i><span>Products &amp; Illustrations</span>
        </a>
        <a class="nav-item" onclick="navigateTo('sales')" href="#">
          <i class="fas fa-file-signature"></i><span>E-App &amp; Proposals</span>
          <span class="nav-badge" style="background:#003087;color:#fff">2</span>
        </a>
        <a class="nav-item pipeline-view-nav" id="pipeline-view-nav" onclick="navigateTo('pipeline-view')" href="#">
          <i class="fas fa-route"></i><span>Journey Pipeline</span>
        </a>

        {/* ── ONBOARDING (Phase 5–6) ── */}
        <div class="nav-section-label">ONBOARDING</div>
        <a class="nav-item" onclick="navigateTo('underwriting')" href="#">
          <i class="fas fa-microscope"></i><span>Underwriting</span>
          <span class="nav-badge" style="background:#0891b2;color:white">4</span>
        </a>
        <a class="nav-item delivery-nav" onclick="navigateTo('delivery')" href="#">
          <i class="fas fa-box-open"></i><span>Policy Delivery</span>
          <span class="nav-badge" style="background:#059669;color:#fff">2</span>
        </a>

        {/* ── SERVICE (Phase 7) ── */}
        <div class="nav-section-label">SERVICE</div>
        <a class="nav-item" onclick="navigateTo('policies')" href="#">
          <i class="fas fa-file-contract"></i><span>Policies</span>
          <span class="nav-badge">1.8K</span>
        </a>
        <a class="nav-item alerts-nav" onclick="navigateTo('alerts')" href="#">
          <i class="fas fa-bell"></i><span>Policy Alerts</span>
          <span class="nav-badge alert" id="alerts-nav-badge">4</span>
        </a>
        <a class="nav-item claims-nav" onclick="navigateTo('claims')" href="#">
          <i class="fas fa-file-medical-alt"></i><span>Claims</span>
          <span class="nav-badge alert">7</span>
        </a>
        <a class="nav-item upsell-nav" onclick="navigateTo('upsell')" href="#">
          <i class="fas fa-arrow-trend-up"></i><span>Upsell Track</span>
          <span class="nav-badge" style="background:#059669;color:#fff">8</span>
        </a>

        {/* ── ANALYTICS ── */}
        <div class="nav-section-label">ANALYTICS</div>
        <a class="nav-item" onclick="navigateTo('reports')" href="#">
          <i class="fas fa-chart-bar"></i><span>Business Intelligence</span>
        </a>
        <a class="nav-item ai-insights-nav" onclick="navigateTo('ai-insights')" href="#">
          <i class="fas fa-brain"></i><span>AI Insights</span>
          <span class="nav-badge ai-pulse">NEW</span>
        </a>
        <a class="nav-item ai-nav" onclick="navigateTo('ai-agents')" href="#">
          <i class="fas fa-robot"></i><span>AI Agents</span>
          <span class="nav-badge ai-pulse">AI</span>
        </a>

      </nav>

      <div class="sidebar-footer">
        <a href="#" class="nav-item small" onclick="navigateTo('settings');return false;">
          <i class="fas fa-cog"></i>
          <span>Settings</span>
        </a>
        <a href="#" class="nav-item small" onclick="navigateTo('help');return false;">
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
        <div class="search-box spotlight-trigger" onclick="openSpotlight()" title="Search (⌘K)">
          <i class="fas fa-search"></i>
          <span class="search-placeholder-text">Search clients, policies…</span>
          <kbd class="search-kbd">⌘K</kbd>
        </div>
        <button class="topbar-btn" title="AI Quick Actions" onclick="navigateTo('ai-agents')">
          <i class="fas fa-robot"></i>
          <span class="ai-indicator"></span>
        </button>
        <button class="topbar-btn notification-btn" title="Notifications" onclick="toggleNotifPanel()">
          <i class="fas fa-bell"></i>
          <span class="notif-count">5</span>
        </button>
        <div class="topbar-avatar-wrap">
          <div class="topbar-avatar" id="topbar-avatar" onclick="toggleProfileMenu()" title="Sridhar R — click to open profile">SR</div>
          <div class="topbar-online-dot"></div>
        </div>
        <div id="profile-dropdown" class="profile-dropdown" style="display:none"></div>
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

        </div>
      </div>

      {/* ── AI DAILY BRIEFING STRIP ── */}
      <div class="ai-briefing-strip">
        <div class="aib-label"><i class="fas fa-robot"></i> AI Daily Brief <span class="aib-time">7:02 AM</span></div>
        <div class="aib-items">
          <div class="aib-item urgent" onclick="openAIBriefAction('lapse-patricia')" style="cursor:pointer" title="Click to act on this alert">
            <i class="fas fa-exclamation-circle"></i>
            <span><strong>Patricia Nguyen</strong> — UL policy under-funded, lapse risk in ~68 days. Schedule call today.</span>
            <span class="aib-action-chip"><i class="fas fa-bolt"></i> Act Now</span>
          </div>
          <div class="aib-item opportunity" onclick="openAIBriefAction('fed-rate')" style="cursor:pointer" title="Click to review annuity rate opportunity">
            <i class="fas fa-bolt"></i>
            <span><strong>Fed rate +0.25%</strong> — Annuity pricing now favorable for 38 clients. Reach out before window closes.</span>
            <span class="aib-action-chip opp"><i class="fas fa-arrow-right"></i> Review</span>
          </div>
          <div class="aib-item insight" onclick="openAIBriefAction('annuity-james')" style="cursor:pointer" title="Click to view retirement opportunity">
            <i class="fas fa-lightbulb"></i>
            <span><strong>James Whitfield (52)</strong> — Retirement planning window: income annuity conversation aligns with life-stage. High close probability.</span>
            <span class="aib-action-chip ins"><i class="fas fa-arrow-right"></i> Review</span>
          </div>
        </div>
        <button class="aib-dismiss" onclick="this.closest('.ai-briefing-strip').style.display='none'" title="Dismiss"><i class="fas fa-times"></i></button>
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
            <span class="badge badge-red" onclick="navigateTo('clients')" style="cursor:pointer" title="View all clients">18</span>
          </div>
          <div class="activity-list">
            <div class="activity-item high" onclick="openActionItemModal('renewal-sandra')" style="cursor:pointer">
              <div class="act-icon ins-color"><i class="fas fa-sync-alt"></i></div>
              <div class="act-content">
                <div class="act-title">Renewal Due — Sandra Williams</div>
                <div class="act-desc"><span class="act-domain-pill ins">Insurance</span> Policy P-100320 expires Sep 2026</div>
              </div>
              <span class="act-badge high">Urgent</span>
            </div>
            <div class="activity-item high" onclick="openActionItemModal('annuity-patricia')" style="cursor:pointer">
              <div class="act-icon inv-color"><i class="fas fa-coins"></i></div>
              <div class="act-content">
                <div class="act-title">Annuity Review — Patricia Nguyen</div>
                <div class="act-desc"><span class="act-domain-pill inv">Investments</span> Deferred annuity illustration ready</div>
              </div>
              <span class="act-badge ai">AI Alert</span>
            </div>
            <div class="activity-item high" onclick="openActionItemModal('followup-kevin')" style="cursor:pointer">
              <div class="act-icon ins-color"><i class="fas fa-phone"></i></div>
              <div class="act-content">
                <div class="act-title">Follow-up — Kevin Park</div>
                <div class="act-desc"><span class="act-domain-pill ins">Insurance</span> Pending application needs response</div>
              </div>
              <span class="act-badge high">Urgent</span>
            </div>
            <div class="activity-item medium" onclick="openActionItemModal('retirement-james')" style="cursor:pointer">
              <div class="act-icon ret-color"><i class="fas fa-umbrella-beach"></i></div>
              <div class="act-content">
                <div class="act-title">Retirement Planning — James Whitfield</div>
                <div class="act-desc"><span class="act-domain-pill ret">Retirement</span> Income annuity conversation at age 52</div>
              </div>
              <span class="act-badge ai">AI Insight</span>
            </div>
            <div class="activity-item medium" onclick="openActionItemModal('estate-james')" style="cursor:pointer">
              <div class="act-icon adv-color"><i class="fas fa-landmark"></i></div>
              <div class="act-content">
                <div class="act-title">Estate Planning — James Whitfield</div>
                <div class="act-desc"><span class="act-domain-pill adv">Advisory</span> Trust review + will update recommended</div>
              </div>
              <span class="act-badge ai">AI Insight</span>
            </div>
            <div class="activity-item medium" onclick="openActionItemModal('wealth-linda')" style="cursor:pointer">
              <div class="act-icon adv-color"><i class="fas fa-gem"></i></div>
              <div class="act-content">
                <div class="act-title">Wealth Management — Linda Morrison</div>
                <div class="act-desc"><span class="act-domain-pill adv">Advisory</span> UMA account candidate — $500K+ assets</div>
              </div>
              <span class="act-badge medium">Scheduled</span>
            </div>
            <div class="activity-item medium" onclick="openActionItemModal('claim-robert')" style="cursor:pointer">
              <div class="act-icon ins-color"><i class="fas fa-file-alt"></i></div>
              <div class="act-content">
                <div class="act-title">Claim Review — Robert Chen</div>
                <div class="act-desc"><span class="act-domain-pill ins">Insurance</span> Policy P-100310 awaiting adjuster</div>
              </div>
              <span class="act-badge medium">In Progress</span>
            </div>
          </div>
          <div class="activity-footer">
            <button class="act-view-all-btn" onclick="navigateTo('clients')"><i class="fas fa-users"></i> All Clients</button>
            <button class="act-view-all-btn" onclick="navigateTo('policies')"><i class="fas fa-file-contract"></i> Policies</button>
            <button class="act-view-all-btn" onclick="navigateTo('claims')"><i class="fas fa-file-alt"></i> Claims</button>
            <button class="act-view-all-btn" onclick="navigateTo('calendar')"><i class="fas fa-calendar"></i> Calendar</button>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Book Composition + Opportunity Radar (2-col) ── */}
      <div class="dash-row-2col">

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
            <div class="legend-item"><span class="dot blue"></span>Insurance 38% · $312K premium</div>
            <div class="legend-item"><span class="dot green"></span>Investments 26% · $4.2M AUM</div>
            <div class="legend-item"><span class="dot gold"></span>Retirement 22% · $1.8M assets</div>
            <div class="legend-item"><span class="dot purple"></span>Advisory 14% · $2.1M managed</div>
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
            <div class="opp-item" onclick="openOpportunityModal('annuity-patricia')" style="cursor:pointer" title="Click to view opportunity details">
              <div class="opp-domain-icon inv-bg"><i class="fas fa-lock"></i></div>
              <div class="opp-info">
                <div class="opp-title">Annuity Conversion — Patricia Nguyen</div>
                <div class="opp-meta"><span class="act-domain-pill inv">Investments</span> Deferred annuity · age 38 · lock in rates now</div>
              </div>
              <div class="opp-value">$3K/yr</div>
            </div>
            <div class="opp-item" onclick="openOpportunityModal('annuity-james')" style="cursor:pointer" title="Click to view opportunity details">
              <div class="opp-domain-icon ret-bg"><i class="fas fa-umbrella-beach"></i></div>
              <div class="opp-info">
                <div class="opp-title">Income Annuity — James Whitfield</div>
                <div class="opp-meta"><span class="act-domain-pill ret">Retirement</span> Age 52 · retirement in ~13 yrs</div>
              </div>
              <div class="opp-value">$12K/yr</div>
            </div>
            <div class="opp-item" onclick="openOpportunityModal('uma-linda')" style="cursor:pointer" title="Click to view opportunity details">
              <div class="opp-domain-icon adv-bg"><i class="fas fa-network-wired"></i></div>
              <div class="opp-info">
                <div class="opp-title">UMA Account — Linda Morrison</div>
                <div class="opp-meta"><span class="act-domain-pill adv">Advisory</span> $500K+ assets · Unified Managed Account</div>
              </div>
              <div class="opp-value">$5K/yr</div>
            </div>
            <div class="opp-item" onclick="openOpportunityModal('estate-robert')" style="cursor:pointer" title="Click to view opportunity details">
              <div class="opp-domain-icon adv-bg"><i class="fas fa-landmark"></i></div>
              <div class="opp-info">
                <div class="opp-title">Estate Review — Robert Chen</div>
                <div class="opp-meta"><span class="act-domain-pill adv">Advisory</span> Business owner · succession + NQDC gap</div>
              </div>
              <div class="opp-value">$8K/yr</div>
            </div>
            <div class="opp-item" onclick="openOpportunityModal('529-david')" style="cursor:pointer" title="Click to view opportunity details">
              <div class="opp-domain-icon inv-bg"><i class="fas fa-graduation-cap"></i></div>
              <div class="opp-info">
                <div class="opp-title">529 Plan — David Thompson</div>
                <div class="opp-meta"><span class="act-domain-pill inv">Investments</span> New parent · child college savings</div>
              </div>
              <div class="opp-value">$1.2K/yr</div>
            </div>
            <div class="opp-item" onclick="openOpportunityModal('disability-patricia')" style="cursor:pointer" title="Click to view opportunity details">
              <div class="opp-domain-icon ins-bg"><i class="fas fa-user-shield"></i></div>
              <div class="opp-info">
                <div class="opp-title">Disability Insurance — Patricia Nguyen</div>
                <div class="opp-meta"><span class="act-domain-pill ins">Insurance</span> No disability coverage · age 38</div>
              </div>
              <div class="opp-value">$2K/yr</div>
            </div>
            <div class="opp-item" onclick="openOpportunityModal('401k-alex')" style="cursor:pointer" title="Click to view opportunity details">
              <div class="opp-domain-icon ret-bg"><i class="fas fa-piggy-bank"></i></div>
              <div class="opp-info">
                <div class="opp-title">401(k) Rollover — Alex Rivera</div>
                <div class="opp-meta"><span class="act-domain-pill ret">Retirement</span> Prospect · prior employer plan · $85K</div>
              </div>
              <div class="opp-value">$4K/yr</div>
            </div>
          </div>
          <div class="comm-stats-row" style="margin-top:12px">
            <div class="comm-stat"><div class="cs-num green-text">$35.2K</div><div class="cs-lbl2">Total Potential</div></div>
            <div class="comm-stat"><div class="cs-num">7</div><div class="cs-lbl2">Opportunities</div></div>
            <div class="comm-stat"><div class="cs-num" style="color:#7c3aed">4 Domains</div><div class="cs-lbl2">All Lines</div></div>
          </div>
          <button class="btn btn-ai" style="width:100%;margin-top:10px" onclick="sendContextMessage('Show me all cross-sell and upsell opportunities across 247 clients — rank by revenue potential','advisor')"><i class="fas fa-robot"></i> Full AI Opportunity Analysis</button>
        </div>

      </div>

      {/* ── ROW 3: Commission Tracker + Lapse Risk Monitor (2-col, equal weight) ── */}
      <div class="dash-row-2col">

        {/* Commission Tracker — standalone card */}
        <div class="dash-card">
          <div class="card-header">
            <h3><i class="fas fa-wallet"></i> Commission Tracker</h3>
            <span class="comm-ytd-badge">YTD 2026</span>
          </div>
          <div class="comm-total" onclick="openCommissionModal('monthly')" style="text-align:center;margin-bottom:14px;cursor:pointer" title="Click for monthly breakdown">
            <div class="comm-total-val">$42,180</div>
            <div class="comm-total-lbl">Earned This Month <i class="fas fa-external-link-alt" style="font-size:10px;margin-left:4px;opacity:0.6"></i></div>
          </div>
          <div class="comm-breakdown">
            <div class="comm-row" onclick="openCommissionModal('insurance')" style="cursor:pointer" title="Click to see Insurance commissions detail">
              <span class="comm-type"><i class="fas fa-circle" style="color:#003087"></i> Insurance</span>
              <div class="comm-bar-outer"><div class="comm-bar" style="width:55%;background:#003087"></div></div>
              <span class="comm-amt">$23,200</span>
            </div>
            <div class="comm-row" onclick="openCommissionModal('investments')" style="cursor:pointer" title="Click to see Investment commissions detail">
              <span class="comm-type"><i class="fas fa-circle" style="color:#059669"></i> Investments</span>
              <div class="comm-bar-outer"><div class="comm-bar" style="width:24%;background:#059669"></div></div>
              <span class="comm-amt">$10,100</span>
            </div>
            <div class="comm-row" onclick="openCommissionModal('retirement')" style="cursor:pointer" title="Click to see Retirement commissions detail">
              <span class="comm-type"><i class="fas fa-circle" style="color:#d97706"></i> Retirement</span>
              <div class="comm-bar-outer"><div class="comm-bar" style="width:13%;background:#d97706"></div></div>
              <span class="comm-amt">$5,480</span>
            </div>
            <div class="comm-row" onclick="openCommissionModal('advisory')" style="cursor:pointer" title="Click to see Advisory commissions detail">
              <span class="comm-type"><i class="fas fa-circle" style="color:#7c3aed"></i> Advisory</span>
              <div class="comm-bar-outer"><div class="comm-bar" style="width:8%;background:#7c3aed"></div></div>
              <span class="comm-amt">$3,400</span>
            </div>
          </div>
          <div class="comm-stats-row" style="margin-top:12px">
            <div class="comm-stat" onclick="openCommissionModal('ytd')" style="cursor:pointer" title="Click for YTD detail"><div class="cs-num">$187K</div><div class="cs-lbl2">YTD Earned</div></div>
            <div class="comm-stat" onclick="openCommissionModal('target')" style="cursor:pointer" title="Click for target detail"><div class="cs-num">$240K</div><div class="cs-lbl2">Annual Target</div></div>
            <div class="comm-stat" onclick="openCommissionModal('progress')" style="cursor:pointer" title="Click for progress detail"><div class="cs-num green-text">78%</div><div class="cs-lbl2">Progress</div></div>
          </div>
          <div class="comm-pending" onclick="openCommissionModal('pending')" style="margin-top:12px;cursor:pointer" title="Click to see pending commissions"><i class="fas fa-clock"></i> <strong>$8,400</strong> pending in underwriting · expected by Apr 20 <i class="fas fa-chevron-right" style="font-size:10px;opacity:0.5;margin-left:4px"></i></div>
        </div>

        {/* Lapse Risk Monitor — standalone card */}
        <div class="dash-card">
          <div class="card-header">
            <h3><i class="fas fa-exclamation-triangle"></i> Lapse Risk Monitor</h3>
            <button class="btn-link" onclick="sendContextMessage('Show all 4 lapse-risk clients with risk scores, triggers, and recommended retention actions','renewal')">AI Analysis →</button>
          </div>
          <div class="lapse-summary-bar">
            <div class="lapse-seg high-risk"><span class="lapse-count">4</span><span class="lapse-lbl">High Risk</span></div>
            <div class="lapse-seg med-risk"><span class="lapse-count">11</span><span class="lapse-lbl">Medium Risk</span></div>
            <div class="lapse-seg low-risk"><span class="lapse-count">232</span><span class="lapse-lbl">Low Risk</span></div>
          </div>
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
          <div class="ri-forecast-strip" style="margin-top:12px">
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

      {/* ── ROW 4: Top Clients (full width table) ── */}
      <div class="dash-card clients-card" style="margin-bottom:20px">
        <div class="card-header">
          <h3><i class="fas fa-crown"></i> Top Clients — Full Book View</h3>
          <button class="btn-link" onclick="navigateTo('clients')">View All 247 →</button>
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr onclick="openClientModal(8)" style="cursor:pointer">
                <td><div class="client-cell"><div class="mini-avatar lm">LM</div><span>Linda Morrison</span></div></td>
                <td><span class="domain-dot ins-dot" title="Whole Life · $32K premium"></span></td>
                <td><span class="domain-dot inv-dot" title="Mutual Funds · $280K AUM"></span></td>
                <td><span class="domain-dot ret-dot" title="Deferred Annuity · $145K"></span></td>
                <td><span class="domain-dot adv-dot" title="Estate Planning + UMA · $387K managed"></span></td>
                <td class="premium">$812K</td>
                <td><div class="score-bar"><div class="score-fill" style="width:98%"></div><span>98</span></div></td>
                <td><span class="status-badge active">Active</span></td>
              </tr>
              <tr onclick="openClientModal(3)" style="cursor:pointer">
                <td><div class="client-cell"><div class="mini-avatar rc">RC</div><span>Robert Chen</span></div></td>
                <td><span class="domain-dot ins-dot" title="Whole Life · $21K premium"></span></td>
                <td><span class="domain-dot inv-dot" title="VUL sub-accounts · $180K"></span></td>
                <td><span class="domain-empty" title="Retirement gap — annuity candidate">—</span></td>
                <td><span class="domain-dot adv-dot" title="Business Services · Key Person"></span></td>
                <td class="premium">$421K</td>
                <td><div class="score-bar"><div class="score-fill" style="width:96%"></div><span>96</span></div></td>
                <td><span class="status-badge active">Active</span></td>
              </tr>
              <tr onclick="openClientModal(6)" style="cursor:pointer">
                <td><div class="client-cell"><div class="mini-avatar mg">MG</div><span>Maria Gonzalez</span></div></td>
                <td><span class="domain-dot ins-dot" title="UL · $14.6K premium"></span></td>
                <td><span class="domain-dot inv-dot" title="Annuities · $95K AUM"></span></td>
                <td><span class="domain-dot ret-dot" title="Immediate Annuity · $72K"></span></td>
                <td><span class="domain-empty" title="Estate planning gap identified">—</span></td>
                <td class="premium">$209K</td>
                <td><div class="score-bar"><div class="score-fill" style="width:91%"></div><span>91</span></div></td>
                <td><span class="status-badge active">Active</span></td>
              </tr>
              <tr onclick="openClientModal(1)" style="cursor:pointer">
                <td><div class="client-cell"><div class="mini-avatar jw">JW</div><span>James Whitfield</span></div></td>
                <td><span class="domain-dot ins-dot" title="WL + Term + LTC · $12.4K"></span></td>
                <td><span class="domain-empty" title="No investment product yet">—</span></td>
                <td><span class="domain-dot ret-dot" title="Deferred annuity candidate · age 52"></span></td>
                <td><span class="domain-dot adv-dot" title="Estate planning in progress"></span></td>
                <td class="premium">$162K</td>
                <td><div class="score-bar"><div class="score-fill" style="width:92%"></div><span>92</span></div></td>
                <td><span class="status-badge review">Review</span></td>
              </tr>
              <tr onclick="openClientModal(2)" style="cursor:pointer">
                <td><div class="client-cell"><div class="mini-avatar pn">PN</div><span>Patricia Nguyen</span></div></td>
                <td><span class="domain-dot ins-dot" title="UL + VUL · $5.8K · under-funded risk"></span></td>
                <td><span class="domain-empty" title="Annuity opportunity pending">—</span></td>
                <td><span class="domain-empty" title="No retirement yet">—</span></td>
                <td><span class="domain-empty" title="No advisory services">—</span></td>
                <td class="premium text-orange">$58K <span style="font-size:10px;color:#d97706">⚠ gaps</span></td>
                <td><div class="score-bar"><div class="score-fill" style="width:87%"></div><span>87</span></div></td>
                <td><span class="status-badge pending">At Risk</span></td>
              </tr>
              <tr onclick="openClientModal(5)" style="cursor:pointer">
                <td><div class="client-cell"><div class="mini-avatar" style="background:linear-gradient(135deg,#0891b2,#06b6d4)">DT</div><span>David Thompson</span></div></td>
                <td><span class="domain-dot ins-dot" title="Term Life · $3.2K premium"></span></td>
                <td><span class="domain-dot inv-dot" title="529 Plan candidate · $12K start"></span></td>
                <td><span class="domain-empty" title="No retirement yet · age 33">—</span></td>
                <td><span class="domain-empty" title="No advisory">—</span></td>
                <td class="premium">$48K</td>
                <td><div class="score-bar"><div class="score-fill" style="width:74%"></div><span>74</span></div></td>
                <td><span class="status-badge active">Active</span></td>
              </tr>
              <tr onclick="openClientModal(4)" style="cursor:pointer" title="Sandra Williams — Renewal Due">
                <td><div class="client-cell"><div class="mini-avatar" style="background:linear-gradient(135deg,#be185d,#ec4899)">SW</div><span>Sandra Williams</span></div></td>
                <td><span class="domain-dot ins-dot" title="Term Life · $8.4K · renewal Sep 2026"></span></td>
                <td><span class="domain-empty" title="No investment product">—</span></td>
                <td><span class="domain-empty" title="No retirement plan">—</span></td>
                <td><span class="domain-empty" title="No advisory">—</span></td>
                <td class="premium text-orange">$84K <span style="font-size:10px;color:#d97706">⚠ renew</span></td>
                <td><div class="score-bar"><div class="score-fill" style="width:79%"></div><span>79</span></div></td>
                <td><span class="status-badge pending">Renewal</span></td>
              </tr>
              <tr onclick="navigateTo('clients')" style="cursor:pointer">
                <td><div class="client-cell"><div class="mini-avatar" style="background:linear-gradient(135deg,#047857,#10b981)">AR</div><span>Alex Rivera</span></div></td>
                <td><span class="domain-empty" title="No policy yet — prospect"></span></td>
                <td><span class="domain-dot inv-dot" title="401k rollover · $85K"></span></td>
                <td><span class="domain-dot ret-dot" title="Rollover IRA candidate"></span></td>
                <td><span class="domain-empty" title="No advisory">—</span></td>
                <td class="premium">$95K</td>
                <td><div class="score-bar"><div class="score-fill" style="width:68%"></div><span>68</span></div></td>
                <td><span class="status-badge review">Prospect</span></td>
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

      {/* ── ROW 5: Today & Upcoming + Monthly Goals (2-col) ── */}
      <div class="dash-row-2col" style="margin-bottom:20px">

        {/* Upcoming Appointments — expanded */}
        <div class="dash-card appt-card">
          <div class="card-header">
            <h3><i class="fas fa-calendar-check"></i> Today &amp; Upcoming</h3>
            <button class="btn-link" onclick="navigateTo('calendar')">Full Calendar →</button>
          </div>
          <div class="appt-date-header">Today — Friday, April 10, 2026</div>
          <div class="appt-list">
            <div class="appt-item appt-now">
              <div class="appt-time"><span class="appt-hr">10:30</span><span class="appt-ampm">AM</span></div>
              <div class="appt-bar appt-bar-red"></div>
              <div class="appt-detail">
                <div class="appt-title">Kevin Park — Policy Follow-up Call</div>
                <div class="appt-sub"><span class="act-domain-pill ins">Insurance</span> Phone · 30 min · Pending app response</div>
              </div>
              <span class="appt-now-chip">Now</span>
            </div>
            <div class="appt-item">
              <div class="appt-time"><span class="appt-hr">12:00</span><span class="appt-ampm">PM</span></div>
              <div class="appt-bar appt-bar-gold"></div>
              <div class="appt-detail">
                <div class="appt-title">Patricia Nguyen — UL Policy Review</div>
                <div class="appt-sub"><span class="act-domain-pill ins">Insurance</span> Phone · 20 min · Funding gap urgent</div>
              </div>
              <span class="appt-now-chip" style="background:#d97706">Urgent</span>
            </div>
            <div class="appt-item">
              <div class="appt-time"><span class="appt-hr">2:00</span><span class="appt-ampm">PM</span></div>
              <div class="appt-bar appt-bar-blue"></div>
              <div class="appt-detail">
                <div class="appt-title">Robert Chen — Claim Status Update</div>
                <div class="appt-sub"><span class="act-domain-pill ins">Insurance</span> Video · 45 min · CLM-2026-0041</div>
              </div>
            </div>
            <div class="appt-item">
              <div class="appt-time"><span class="appt-hr">4:30</span><span class="appt-ampm">PM</span></div>
              <div class="appt-bar appt-bar-green"></div>
              <div class="appt-detail">
                <div class="appt-title">Alex Rivera — New Prospect Meeting</div>
                <div class="appt-sub"><span class="act-domain-pill inv">Investments</span> In Person · 60 min · 401k rollover $85K</div>
              </div>
            </div>
          </div>
          <div class="appt-date-header" style="margin-top:12px">This Week</div>
          <div class="appt-list">
            <div class="appt-item">
              <div class="appt-time"><span class="appt-hr">Apr</span><span class="appt-ampm">11</span></div>
              <div class="appt-bar appt-bar-purple"></div>
              <div class="appt-detail">
                <div class="appt-title">Sandra Williams — Renewal Quote Review</div>
                <div class="appt-sub"><span class="act-domain-pill ins">Insurance</span> Phone · 30 min · Term expiry Sep 2026</div>
              </div>
            </div>
            <div class="appt-item">
              <div class="appt-time"><span class="appt-hr">Apr</span><span class="appt-ampm">12</span></div>
              <div class="appt-bar appt-bar-gold"></div>
              <div class="appt-detail">
                <div class="appt-title">Maria Gonzalez — Annuity Illustration</div>
                <div class="appt-sub"><span class="act-domain-pill ret">Retirement</span> Video · 45 min · Income annuity options</div>
              </div>
            </div>
          </div>
          <div class="appt-date-header" style="margin-top:12px">Upcoming</div>
          <div class="appt-list">
            <div class="appt-item">
              <div class="appt-time"><span class="appt-hr">Apr</span><span class="appt-ampm">15</span></div>
              <div class="appt-bar appt-bar-purple"></div>
              <div class="appt-detail">
                <div class="appt-title">Linda Morrison — Annual Review</div>
                <div class="appt-sub"><span class="act-domain-pill adv">Advisory</span> UMA + Estate planning · 90 min</div>
              </div>
            </div>
            <div class="appt-item">
              <div class="appt-time"><span class="appt-hr">Apr</span><span class="appt-ampm">18</span></div>
              <div class="appt-bar appt-bar-green"></div>
              <div class="appt-detail">
                <div class="appt-title">James Whitfield — Retirement Planning</div>
                <div class="appt-sub"><span class="act-domain-pill ret">Retirement</span> Deferred annuity illustration · 60 min</div>
              </div>
            </div>
            <div class="appt-item">
              <div class="appt-time"><span class="appt-hr">Apr</span><span class="appt-ampm">20</span></div>
              <div class="appt-bar appt-bar-blue"></div>
              <div class="appt-detail">
                <div class="appt-title">David Thompson — 529 Plan Introduction</div>
                <div class="appt-sub"><span class="act-domain-pill inv">Investments</span> In Person · 30 min · College savings</div>
              </div>
            </div>
            <div class="appt-item">
              <div class="appt-time"><span class="appt-hr">Apr</span><span class="appt-ampm">22</span></div>
              <div class="appt-bar appt-bar-blue"></div>
              <div class="appt-detail">
                <div class="appt-title">Team Review — Roger Putnam</div>
                <div class="appt-sub"><span class="act-domain-pill ins">Insurance</span> Q1 Results · All product lines · 90 min</div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Goals — standalone card */}
        <div class="dash-card donut-card">
          <div class="card-header">
            <h3><i class="fas fa-chart-bar"></i> Monthly Goals</h3>
            <span class="goal-days-left">21 days left</span>
          </div>
          <div class="goal-list">
            <div class="goal-item" onclick="openGoalModal('insurance-premium')" style="cursor:pointer" title="Click for Insurance Premium details">
              <div class="goal-meta"><span class="goal-name"><i class="fas fa-shield-alt" style="color:#003087;width:14px;margin-right:4px"></i>Insurance Premium</span><span class="goal-val">$312K<span class="goal-target"> / $360K</span></span></div>
              <div class="goal-bar-outer"><div class="goal-bar-inner" style="width:87%"></div></div>
              <div class="goal-footer"><span class="goal-pct">87%</span><span class="goal-gap">$48K to target</span></div>
            </div>
            <div class="goal-item" onclick="openGoalModal('investment-aum')" style="cursor:pointer" title="Click for Investment AUM details">
              <div class="goal-meta"><span class="goal-name"><i class="fas fa-chart-line" style="color:#059669;width:14px;margin-right:4px"></i>Investment AUM</span><span class="goal-val">$4.2M<span class="goal-target"> / $5M</span></span></div>
              <div class="goal-bar-outer"><div class="goal-bar-inner green" style="width:84%"></div></div>
              <div class="goal-footer"><span class="goal-pct">84%</span><span class="goal-gap">$800K to target</span></div>
            </div>
            <div class="goal-item" onclick="openGoalModal('retirement-clients')" style="cursor:pointer" title="Click for Retirement Clients details">
              <div class="goal-meta"><span class="goal-name"><i class="fas fa-umbrella-beach" style="color:#d97706;width:14px;margin-right:4px"></i>Retirement Clients</span><span class="goal-val">38<span class="goal-target"> / 45</span></span></div>
              <div class="goal-bar-outer"><div class="goal-bar-inner gold" style="width:84%"></div></div>
              <div class="goal-footer"><span class="goal-pct">84%</span><span class="goal-gap">7 more needed</span></div>
            </div>
            <div class="goal-item" onclick="openGoalModal('advisory-clients')" style="cursor:pointer" title="Click for Advisory Clients details">
              <div class="goal-meta"><span class="goal-name"><i class="fas fa-handshake" style="color:#7c3aed;width:14px;margin-right:4px"></i>Advisory Clients</span><span class="goal-val">59<span class="goal-target"> / 80</span></span></div>
              <div class="goal-bar-outer"><div class="goal-bar-inner purple" style="width:74%"></div></div>
              <div class="goal-footer"><span class="goal-pct">74%</span><span class="goal-gap">21 more needed</span></div>
            </div>
            <div class="goal-item" onclick="openGoalModal('multi-product')" style="cursor:pointer" title="Click for Multi-Product details">
              <div class="goal-meta"><span class="goal-name"><i class="fas fa-layer-group" style="color:#dc2626;width:14px;margin-right:4px"></i>Multi-Product Clients</span><span class="goal-val">1.8<span class="goal-target"> / 2.5 avg</span></span></div>
              <div class="goal-bar-outer"><div class="goal-bar-inner orange" style="width:72%"></div></div>
              <div class="goal-footer"><span class="goal-pct">72%</span><span class="goal-gap">Cross-sell gap</span></div>
            </div>
            <div class="goal-item" onclick="openGoalModal('new-appointments')" style="cursor:pointer" title="Click for Appointments details">
              <div class="goal-meta"><span class="goal-name"><i class="fas fa-calendar-check" style="color:#0891b2;width:14px;margin-right:4px"></i>New Appointments</span><span class="goal-val">14<span class="goal-target"> / 20</span></span></div>
              <div class="goal-bar-outer"><div class="goal-bar-inner" style="width:70%;background:#0891b2"></div></div>
              <div class="goal-footer"><span class="goal-pct" style="color:#0891b2">70%</span><span class="goal-gap">6 more needed</span></div>
            </div>
          </div>
        </div>

      </div>

      {/* ── ROW 6: Recent Communications + Today's Quick Wins (2-col) ── */}
      <div class="dash-row-2col" style="margin-bottom:20px">

        {/* Recent Communications — standalone card */}
        <div class="dash-card">
          <div class="card-header">
            <h3><i class="fas fa-comments"></i> Recent Communications</h3>
            <button class="btn-link" onclick="navigateTo('clients')">View All →</button>
          </div>
          <div class="recent-comms">
            <div class="comm-item" onclick="openCommModal('rc-claim')" style="cursor:pointer" title="Click to view full thread">
              <div class="comm-avatar ca-rc">RC</div>
              <div class="comm-info">
                <div class="comm-name">Robert Chen</div>
                <div class="comm-msg">Re: Claim P-100310 — documents received and uploaded</div>
              </div>
              <div class="comm-meta"><i class="fas fa-envelope"></i> 2h ago <i class="fas fa-chevron-right comm-arrow"></i></div>
            </div>
            <div class="comm-item" onclick="openCommModal('lm-appt')" style="cursor:pointer" title="Click to view full thread">
              <div class="comm-avatar ca-lm">LM</div>
              <div class="comm-info">
                <div class="comm-name">Linda Morrison</div>
                <div class="comm-msg">Confirmed Apr 15 estate + UMA review appointment</div>
              </div>
              <div class="comm-meta"><i class="fas fa-comment"></i> 5h ago <i class="fas fa-chevron-right comm-arrow"></i></div>
            </div>
            <div class="comm-item" onclick="openCommModal('mg-annuity')" style="cursor:pointer" title="Click to view full thread">
              <div class="comm-avatar ca-mg">MG</div>
              <div class="comm-info">
                <div class="comm-name">Maria Gonzalez</div>
                <div class="comm-msg">Interested in income annuity discussion — please send illustration</div>
              </div>
              <div class="comm-meta"><i class="fas fa-phone"></i> Yesterday <i class="fas fa-chevron-right comm-arrow"></i></div>
            </div>
            <div class="comm-item" onclick="openCommModal('sw-renewal')" style="cursor:pointer" title="Click to view full thread">
              <div class="comm-avatar" style="background:linear-gradient(135deg,#be185d,#ec4899)">SW</div>
              <div class="comm-info">
                <div class="comm-name">Sandra Williams</div>
                <div class="comm-msg">Received renewal quote — reviewing options with husband</div>
              </div>
              <div class="comm-meta"><i class="fas fa-envelope"></i> Yesterday <i class="fas fa-chevron-right comm-arrow"></i></div>
            </div>
            <div class="comm-item" onclick="openCommModal('jw-meeting')" style="cursor:pointer" title="Click to view full thread">
              <div class="comm-avatar" style="background:linear-gradient(135deg,#7c3aed,#a855f7)">JW</div>
              <div class="comm-info">
                <div class="comm-name">James Whitfield</div>
                <div class="comm-msg">Confirmed Apr 18 retirement planning meeting</div>
              </div>
              <div class="comm-meta"><i class="fas fa-comment"></i> 2d ago <i class="fas fa-chevron-right comm-arrow"></i></div>
            </div>
            <div class="comm-item" onclick="openCommModal('ar-prospect')" style="cursor:pointer" title="Click to view full thread">
              <div class="comm-avatar" style="background:linear-gradient(135deg,#047857,#10b981)">AR</div>
              <div class="comm-info">
                <div class="comm-name">Alex Rivera</div>
                <div class="comm-msg">Excited about the 401k rollover meeting — bringing statements</div>
              </div>
              <div class="comm-meta"><i class="fas fa-envelope"></i> 2d ago <i class="fas fa-chevron-right comm-arrow"></i></div>
            </div>
            <div class="comm-item" onclick="openCommModal('kp-voicemail')" style="cursor:pointer" title="Click to view full thread">
              <div class="comm-avatar" style="background:linear-gradient(135deg,#0891b2,#06b6d4)">KP</div>
              <div class="comm-info">
                <div class="comm-name">Kevin Park</div>
                <div class="comm-msg">Left voicemail — will call back after 10am today</div>
              </div>
              <div class="comm-meta"><i class="fas fa-phone"></i> 3d ago <i class="fas fa-chevron-right comm-arrow"></i></div>
            </div>
          </div>
        </div>

        {/* Today's Quick Wins — standalone card */}
        <div class="dash-card">
          <div class="card-header">
            <h3><i class="fas fa-trophy"></i> Today's Quick Wins</h3>
            <span style="font-size:11px;color:var(--green);font-weight:700;background:var(--green-light);padding:3px 10px;border-radius:20px">2 of 5 done</span>
          </div>
          <div class="quick-wins-list">
            <div class="qw-item done" onclick="openQuickWinModal('qw-sandra-renewal')" style="cursor:pointer" title="Click to view details">
              <span class="qw-check done"><i class="fas fa-check"></i></span>
              <span class="qw-text">Sent renewal quote to Sandra Williams</span>
              <span class="qw-badge done-badge">Done</span>
            </div>
            <div class="qw-item done" onclick="openQuickWinModal('qw-robert-claim')" style="cursor:pointer" title="Click to view details">
              <span class="qw-check done"><i class="fas fa-check"></i></span>
              <span class="qw-text">Reviewed Robert Chen claim P-100310 documents</span>
              <span class="qw-badge done-badge">Done</span>
            </div>
            <div class="qw-item" onclick="openQuickWinModal('qw-patricia-call')" style="cursor:pointer">
              <span class="qw-check"><i class="fas fa-circle"></i></span>
              <span class="qw-text">Call Patricia Nguyen re: UL policy funding gap</span>
              <span class="qw-badge urgent">Urgent</span>
            </div>
            <div class="qw-item" onclick="openQuickWinModal('qw-kevin-brief')" style="cursor:pointer">
              <span class="qw-check"><i class="fas fa-circle"></i></span>
              <span class="qw-text">Prepare Kevin Park follow-up call brief</span>
              <span class="qw-badge">Today</span>
            </div>
            <div class="qw-item" onclick="openQuickWinModal('qw-annuity-review')" style="cursor:pointer">
              <span class="qw-check"><i class="fas fa-circle"></i></span>
              <span class="qw-text">Review annuity rate change impact (38 clients)</span>
              <span class="qw-badge">AI Rec</span>
            </div>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════
          MARKET & NEWS IMPACT MONITOR  (Task #18)
          ══════════════════════════════════════════════════ */}
      <div class="market-monitor-panel" id="market-monitor-panel">
        <div class="mmp-header">
          <div class="mmp-header-left">
            <div class="mmp-icon"><i class="fas fa-satellite-dish"></i><span class="mmp-live-dot"></span></div>
            <div>
              <div class="mmp-title">Market &amp; News Impact Monitor <span class="mmp-live-badge">LIVE</span></div>
              <div class="mmp-sub">Real-time sentiment · Rate changes · Disaster alerts · Book-of-business impact scoring</div>
            </div>
          </div>
          <div class="mmp-header-right">
            <div class="mmp-alert-count"><i class="fas fa-bell"></i> 3 active alerts</div>
            <button class="mmp-expand-btn" onclick="openMarketMonitor()"><i class="fas fa-expand-alt"></i> Full View</button>
          </div>
        </div>
        <div class="mmp-alerts-row">
          <div class="mmp-alert critical" onclick="openMarketMonitor('rate')">
            <div class="mmp-alert-icon"><i class="fas fa-percentage"></i></div>
            <div class="mmp-alert-content">
              <div class="mmp-alert-title">Fed Rate Hike +0.25% — Apr 9, 2026</div>
              <div class="mmp-alert-detail">Annuity pricing favorable ↑ · 38 clients affected · $4.2M AUM rebalance opportunity</div>
            </div>
            <div class="mmp-alert-badge critical">HIGH IMPACT</div>
          </div>
          <div class="mmp-alert warning" onclick="openMarketMonitor('weather')">
            <div class="mmp-alert-icon"><i class="fas fa-cloud-rain"></i></div>
            <div class="mmp-alert-content">
              <div class="mmp-alert-title">Northeast Storm Event — Catastrophic Flooding Risk</div>
              <div class="mmp-alert-detail">4 client properties in affected zone · Check LTC &amp; disability riders · Claims spike likely</div>
            </div>
            <div class="mmp-alert-badge warning">WATCH</div>
          </div>
          <div class="mmp-alert info" onclick="openMarketMonitor('market')">
            <div class="mmp-alert-icon"><i class="fas fa-chart-line"></i></div>
            <div class="mmp-alert-content">
              <div class="mmp-alert-title">S&amp;P 500 +2.3% WTD — Equity markets rally</div>
              <div class="mmp-alert-detail">VUL sub-account performance up · 3 portfolio rebalance clients · Investment review opportunity</div>
            </div>
            <div class="mmp-alert-badge info">OPPORTUNITY</div>
          </div>
        </div>
        <div class="mmp-sentiment-row">
          <div class="mmp-sent-card">
            <div class="mmp-sent-label">Insurance Sentiment</div>
            <div class="mmp-sent-bar-wrap">
              <div class="mmp-sent-bar" style="width:72%;background:linear-gradient(90deg,#10b981,#059669)"></div>
            </div>
            <div class="mmp-sent-score positive">72 / 100 — Positive</div>
          </div>
          <div class="mmp-sent-card">
            <div class="mmp-sent-label">Market Volatility Index</div>
            <div class="mmp-sent-bar-wrap">
              <div class="mmp-sent-bar" style="width:38%;background:linear-gradient(90deg,#f59e0b,#d97706)"></div>
            </div>
            <div class="mmp-sent-score moderate">38 / 100 — Moderate</div>
          </div>
          <div class="mmp-sent-card">
            <div class="mmp-sent-label">Claims Risk Index</div>
            <div class="mmp-sent-bar-wrap">
              <div class="mmp-sent-bar" style="width:54%;background:linear-gradient(90deg,#f97316,#ea580c)"></div>
            </div>
            <div class="mmp-sent-score elevated">54 / 100 — Elevated</div>
          </div>
          <div class="mmp-sent-card">
            <div class="mmp-sent-label">Renewal Opportunity</div>
            <div class="mmp-sent-bar-wrap">
              <div class="mmp-sent-bar" style="width:81%;background:linear-gradient(90deg,#3b82f6,#1d4ed8)"></div>
            </div>
            <div class="mmp-sent-score positive">81 / 100 — Strong</div>
          </div>
        </div>
      </div>

      {/* ── Market Monitor Full Modal ── */}
      <div class="market-modal-overlay" id="market-modal-overlay" onclick="closeMarketMonitor()" style="display:none">
        <div class="market-modal" onclick="event.stopPropagation()">
          <div class="market-modal-header">
            <div class="market-modal-header-left">
              <div class="market-modal-icon"><i class="fas fa-satellite-dish"></i></div>
              <div>
                <div class="market-modal-title">Market &amp; News Impact Monitor</div>
                <div class="market-modal-sub">Real-time intelligence · Book-of-business impact · AI sentiment analysis · Apr 10, 2026</div>
              </div>
            </div>
            <button class="market-modal-close" onclick="closeMarketMonitor()"><i class="fas fa-times"></i></button>
          </div>
          <div class="market-modal-tabs" id="market-modal-tabs">
            <button class="mmt-tab active" onclick="switchMarketTab('alerts',this)"><i class="fas fa-bell"></i> Active Alerts</button>
            <button class="mmt-tab" onclick="switchMarketTab('rates',this)"><i class="fas fa-percentage"></i> Rate Impact</button>
            <button class="mmt-tab" onclick="switchMarketTab('news',this)"><i class="fas fa-newspaper"></i> News Feed</button>
            <button class="mmt-tab" onclick="switchMarketTab('book',this)"><i class="fas fa-book"></i> Book Impact</button>
          </div>
          <div class="market-modal-body" id="market-modal-body"></div>
        </div>
      </div>

      {/* ── AI HOLISTIC INSIGHTS BANNER ── */}
      <div class="ai-highlight-banner" onclick="navigateTo('ai-agents')">
        <div class="ai-banner-icon"><i class="fas fa-robot"></i></div>
        <div class="ai-banner-content">
          <h4>AI Agent has 9 cross-domain insights ready</h4>
          <p>$31.2K revenue potential · 3 investment gaps · 4 retirement planning opportunities · 2 estate planning alerts · 4 lapse risks</p>
        </div>
        <button class="btn btn-white" onclick="navigateTo('ai-insights')">View All AI Insights <i class="fas fa-arrow-right"></i></button>
      </div>

      {/* ── Generic Dashboard Modals Container ── */}
      <div id="dashboard-generic-modal-overlay" class="dgm-overlay" onclick="closeDashboardModal()" style="display:none">
        <div class="dgm-modal" onclick="event.stopPropagation()">
          <div class="dgm-header" id="dgm-header">
            <div class="dgm-header-left">
              <div class="dgm-icon" id="dgm-icon"><i class="fas fa-info-circle"></i></div>
              <div>
                <div class="dgm-title" id="dgm-title">Detail</div>
                <div class="dgm-sub" id="dgm-sub"></div>
              </div>
            </div>
            <button class="dgm-close" onclick="closeDashboardModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="dgm-body" id="dgm-body"></div>
          <div class="dgm-footer" id="dgm-footer"></div>
        </div>
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

      {/* ── Client 360 Segment Insights Bar ── */}
      <div class="seg-insights-bar" id="seg-insights-bar">
        <div class="seg-insight-card premium">
          <div class="seg-ic-header"><i class="fas fa-crown"></i> Premium</div>
          <div class="seg-ic-count">12 clients</div>
          <div class="seg-ic-val">$248K premium</div>
          <div class="seg-ic-trend up"><i class="fas fa-arrow-up"></i> +3 this quarter</div>
        </div>
        <div class="seg-insight-card high-value">
          <div class="seg-ic-header"><i class="fas fa-star"></i> High Value</div>
          <div class="seg-ic-count">48 clients</div>
          <div class="seg-ic-val">$189K premium</div>
          <div class="seg-ic-trend up"><i class="fas fa-arrow-up"></i> 2 upgrades pending</div>
        </div>
        <div class="seg-insight-card mid-market">
          <div class="seg-ic-header"><i class="fas fa-users"></i> Mid Market</div>
          <div class="seg-ic-count">124 clients</div>
          <div class="seg-ic-val">$108K premium</div>
          <div class="seg-ic-trend stable"><i class="fas fa-minus"></i> Stable</div>
        </div>
        <div class="seg-insight-card emerging">
          <div class="seg-ic-header"><i class="fas fa-seedling"></i> Emerging</div>
          <div class="seg-ic-count">63 clients</div>
          <div class="seg-ic-val">$29K premium</div>
          <div class="seg-ic-trend up"><i class="fas fa-arrow-up"></i> +8 new this quarter</div>
        </div>
        <div class="seg-insight-card ai-opps">
          <div class="seg-ic-header"><i class="fas fa-robot"></i> AI Opportunities</div>
          <div class="seg-ic-count">$31.2K/yr</div>
          <div class="seg-ic-val">6 cross-sell targets</div>
          <div class="seg-ic-trend"><i class="fas fa-bullseye"></i> Act now</div>
        </div>
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
          <select class="filter-select" id="client-status-filter" onchange="filterByStatus(this.value)">
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
          <button class="btn btn-primary" onclick="openAddClientModal()">
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

              {/* ── Card Header ── opens 9-tab Client 360 modal ── */}
              <div class="client-card-header" onclick={`openClientModal(${client.id})`} style="cursor:pointer" title="Open Client 360 Profile">
                <div class={`client-avatar-lg ca-${avatarKey}`}>{initials}</div>
                <div class="client-card-info">
                  <h4>{client.name}</h4>
                  <p>{client.city} · Age {client.age}</p>
                  <span class={`segment-tag seg-${client.segment.replace(' ', '-').toLowerCase()}`}>{client.segment}</span>
                </div>
                {lapseInfo && <div class={`cc-lapse-badge ${lapseInfo.level}`} title="Lapse Risk"><i class="fas fa-exclamation-triangle"></i> {lapseInfo.level === 'high' ? 'HIGH' : 'MED'} {lapseInfo.score}</div>}
                <div class="client-score-circle"><span>{client.score}</span></div>
                <button class="cc-expand-btn" onclick={`event.stopPropagation(); toggleClientProducts(${client.id})`} title="Quick product view">
                  <i class="fas fa-chevron-down" id={`expand-icon-${client.id}`}></i>
                </button>
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
                <button class="cc-profile-btn" onclick={`event.stopPropagation(); openClientModal(${client.id})`} title="Open Client 360 Profile">
                  <i class="fas fa-id-card"></i> View Profile
                </button>
                <button class="btn-icon" title="Call" onclick="event.stopPropagation()"><i class="fas fa-phone"></i></button>
                <button class="btn-icon" title="Email" onclick="event.stopPropagation()"><i class="fas fa-envelope"></i></button>
                <button class="btn-icon outreach-btn" title="Generate AI Outreach Message" onclick={`event.stopPropagation(); openOutreachModalForClient(${client.id})`}><i class="fas fa-paper-plane"></i></button>
                {lapseInfo
                  ? <button class="btn-icon retention-btn" title="Retention Action" onclick={`event.stopPropagation(); openRetentionModal('${lapseInfo.retId}')`}><i class="fas fa-shield-alt"></i></button>
                  : <button class="btn-icon ai-btn" title="AI Insights" onclick={`event.stopPropagation(); openClientModal(${client.id}); setTimeout(()=>switchClientTab('ai',document.getElementById('cm-tab-ai')),300)`}><i class="fas fa-robot"></i></button>
                }
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Add Client Modal ── */}
      <div class="acm-overlay" id="acm-overlay" onclick="closeAddClientModal(event)" style="display:none">
        <div class="acm-modal" onclick="event.stopPropagation()">
          <div class="acm-header">
            <div class="acm-header-left">
              <div class="acm-icon"><i class="fas fa-user-plus"></i></div>
              <div>
                <div class="acm-title">Add New Client</div>
                <div class="acm-sub">New York Life · Agent 360 · Pre-filled with smart defaults</div>
              </div>
            </div>
            <button class="acm-close" onclick="closeAddClientModal()"><i class="fas fa-times"></i></button>
          </div>

          <div class="acm-ai-banner">
            <i class="fas fa-robot"></i>
            <span><strong>AI Pre-fill Active</strong> — Smart defaults populated based on your book profile. Review and adjust as needed.</span>
          </div>

          <div class="acm-body">

            {/* Left column */}
            <div class="acm-col">
              <div class="acm-section-title"><i class="fas fa-id-card"></i> Personal Information</div>

              <div class="acm-field-row two-col">
                <div class="acm-field">
                  <label class="acm-label">First Name <span class="acm-req">*</span></label>
                  <input class="acm-input" id="acm-fname" type="text" placeholder="First name" />
                </div>
                <div class="acm-field">
                  <label class="acm-label">Last Name <span class="acm-req">*</span></label>
                  <input class="acm-input" id="acm-lname" type="text" placeholder="Last name" />
                </div>
              </div>

              <div class="acm-field-row two-col">
                <div class="acm-field">
                  <label class="acm-label">Age</label>
                  <input class="acm-input" id="acm-age" type="number" placeholder="Age" />
                </div>
                <div class="acm-field">
                  <label class="acm-label">Date of Birth</label>
                  <input class="acm-input" id="acm-dob" type="text" placeholder="MM/DD/YYYY" />
                </div>
              </div>

              <div class="acm-field-row">
                <div class="acm-field">
                  <label class="acm-label">Email Address <span class="acm-req">*</span></label>
                  <input class="acm-input" id="acm-email" type="email" placeholder="email@example.com" />
                </div>
              </div>

              <div class="acm-field-row two-col">
                <div class="acm-field">
                  <label class="acm-label">Phone</label>
                  <input class="acm-input" id="acm-phone" type="text" placeholder="(212) 555-0000" />
                </div>
                <div class="acm-field">
                  <label class="acm-label">City</label>
                  <input class="acm-input" id="acm-city" type="text" placeholder="City" />
                </div>
              </div>

              <div class="acm-field-row two-col">
                <div class="acm-field">
                  <label class="acm-label">Occupation</label>
                  <input class="acm-input" id="acm-occupation" type="text" placeholder="e.g. Business Owner" />
                </div>
                <div class="acm-field">
                  <label class="acm-label">Annual Income</label>
                  <select class="acm-select" id="acm-income">
                    <option value="under-50k">Under $50K</option>
                    <option value="50k-100k">$50K – $100K</option>
                    <option value="100k-200k" selected>$100K – $200K</option>
                    <option value="200k-500k">$200K – $500K</option>
                    <option value="500k-plus">$500K+</option>
                  </select>
                </div>
              </div>

              <div class="acm-section-title" style="margin-top:18px"><i class="fas fa-tag"></i> Client Classification</div>

              <div class="acm-field-row two-col">
                <div class="acm-field">
                  <label class="acm-label">Segment</label>
                  <select class="acm-select" id="acm-segment">
                    <option value="Emerging">Emerging</option>
                    <option value="Mid Market" selected>Mid Market</option>
                    <option value="High Value">High Value</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div class="acm-field">
                  <label class="acm-label">Status</label>
                  <select class="acm-select" id="acm-status">
                    <option value="Active" selected>Active</option>
                    <option value="Prospect">Prospect</option>
                    <option value="Pending">Pending</option>
                    <option value="Review">Review</option>
                  </select>
                </div>
              </div>

              <div class="acm-field-row">
                <div class="acm-field">
                  <label class="acm-label">Lead Source</label>
                  <select class="acm-select" id="acm-source">
                    <option value="referral" selected>Referral</option>
                    <option value="networking">Networking Event</option>
                    <option value="digital">Digital / Online</option>
                    <option value="cold-call">Cold Outreach</option>
                    <option value="existing-client">Existing Client</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div class="acm-col">
              <div class="acm-section-title"><i class="fas fa-layer-group"></i> Initial Product Interest</div>

              <div class="acm-product-checks">
                <label class="acm-check-row">
                  <input type="checkbox" id="acm-chk-ins" checked /> 
                  <span class="acm-check-icon ins-bg"><i class="fas fa-shield-alt"></i></span>
                  <span class="acm-check-label">Life Insurance</span>
                  <span class="acm-check-sub">Term · Whole Life · UL</span>
                </label>
                <label class="acm-check-row">
                  <input type="checkbox" id="acm-chk-inv" /> 
                  <span class="acm-check-icon inv-bg"><i class="fas fa-chart-line"></i></span>
                  <span class="acm-check-label">Investments</span>
                  <span class="acm-check-sub">Annuities · Mutual Funds · ETFs</span>
                </label>
                <label class="acm-check-row">
                  <input type="checkbox" id="acm-chk-ret" /> 
                  <span class="acm-check-icon ret-bg"><i class="fas fa-umbrella-beach"></i></span>
                  <span class="acm-check-label">Retirement Planning</span>
                  <span class="acm-check-sub">IRA · 401(k) Rollover · Annuities</span>
                </label>
                <label class="acm-check-row">
                  <input type="checkbox" id="acm-chk-adv" /> 
                  <span class="acm-check-icon adv-bg"><i class="fas fa-handshake"></i></span>
                  <span class="acm-check-label">Advisory Services</span>
                  <span class="acm-check-sub">Estate · Wealth · Business Planning</span>
                </label>
              </div>

              <div class="acm-section-title" style="margin-top:18px"><i class="fas fa-robot"></i> AI Profile Signals</div>

              <div class="acm-ai-signals">
                <div class="acm-signal">
                  <i class="fas fa-lightbulb" style="color:#d97706"></i>
                  <span>Life stage assessment will be auto-generated after save</span>
                </div>
                <div class="acm-signal">
                  <i class="fas fa-crosshairs" style="color:#059669"></i>
                  <span>Cross-sell opportunities identified based on age &amp; income</span>
                </div>
                <div class="acm-signal">
                  <i class="fas fa-chart-bar" style="color:#7c3aed"></i>
                  <span>AI score calculated from profile completeness &amp; risk factors</span>
                </div>
              </div>

              <div class="acm-section-title" style="margin-top:18px"><i class="fas fa-calendar-check"></i> First Appointment</div>

              <div class="acm-field-row two-col">
                <div class="acm-field">
                  <label class="acm-label">Preferred Date</label>
                  <input class="acm-input" id="acm-appt-date" type="text" placeholder="MM/DD/YYYY" />
                </div>
                <div class="acm-field">
                  <label class="acm-label">Preferred Time</label>
                  <select class="acm-select" id="acm-appt-time">
                    <option value="9am">9:00 AM</option>
                    <option value="10am">10:00 AM</option>
                    <option value="11am" selected>11:00 AM</option>
                    <option value="1pm">1:00 PM</option>
                    <option value="2pm">2:00 PM</option>
                    <option value="3pm">3:00 PM</option>
                    <option value="4pm">4:00 PM</option>
                  </select>
                </div>
              </div>

              <div class="acm-field-row">
                <div class="acm-field">
                  <label class="acm-label">Meeting Type</label>
                  <select class="acm-select" id="acm-appt-type">
                    <option value="phone" selected>Phone Call</option>
                    <option value="video">Video Call</option>
                    <option value="in-person">In-Person</option>
                  </select>
                </div>
              </div>

              <div class="acm-field-row">
                <div class="acm-field">
                  <label class="acm-label">Notes</label>
                  <textarea class="acm-textarea" id="acm-notes" rows={3} placeholder="Any additional context, referral details, or special needs…"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="acm-footer">
            <button class="btn btn-outline" onclick="closeAddClientModal()">Cancel</button>
            <button class="btn btn-ai" onclick="aiPreFillClient()"><i class="fas fa-robot"></i> AI Auto-Fill</button>
            <button class="btn btn-primary" onclick="saveNewClient()"><i class="fas fa-user-plus"></i> Add Client</button>
          </div>
        </div>
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
      {/* ── Client Detail Modal (Phase 2 — tabbed) ── */}
      <div class="cm-overlay" id="client-modal" onclick="closeClientModal(event)">
        <div class="cm-box" onclick="event.stopPropagation()">

          {/* Header */}
          <div class="cm-header" id="cm-header">
            <div class="cm-header-left">
              <div class="cm-avatar" id="cm-avatar">JW</div>
              <div class="cm-header-info">
                <div class="cm-name" id="cm-name">Client Name</div>
                <div class="cm-meta" id="cm-meta">Segment · City · Age</div>
              </div>
              <span class="cm-score-badge" id="cm-score-badge">92</span>
            </div>
            <div class="cm-header-right">
              <span class="cm-status-pill" id="cm-status-pill">Active</span>
              <button class="cm-close-btn" onclick="closeClientModal()"><i class="fas fa-times"></i></button>
            </div>
          </div>

          {/* Tab bar */}
          <div class="cm-tabs" id="cm-tabs">
            <button class="cm-tab active" id="cm-tab-overview"  onclick="switchClientTab('overview',this)"><i class="fas fa-user"></i> Overview</button>
            <button class="cm-tab"         id="cm-tab-policies"  onclick="switchClientTab('policies',this)"><i class="fas fa-file-contract"></i> Policies</button>
            <button class="cm-tab"         id="cm-tab-financial" onclick="switchClientTab('financial',this)"><i class="fas fa-chart-pie"></i> Financial Health</button>
            <button class="cm-tab"         id="cm-tab-goals"     onclick="switchClientTab('goals',this)"><i class="fas fa-bullseye"></i> Goals</button>
            <button class="cm-tab"         id="cm-tab-ai"        onclick="switchClientTab('ai',this)"><i class="fas fa-robot"></i> AI Insights</button>
            <button class="cm-tab"         id="cm-tab-outreach"  onclick="switchClientTab('outreach',this)"><i class="fas fa-paper-plane"></i> Outreach</button>
            <button class="cm-tab"         id="cm-tab-documents" onclick="switchClientTab('documents',this)"><i class="fas fa-folder-open"></i> Documents</button>
            <button class="cm-tab"         id="cm-tab-referrals" onclick="switchClientTab('referrals',this)"><i class="fas fa-users"></i> Referrals</button>
            <button class="cm-tab"         id="cm-tab-timeline"  onclick="switchClientTab('timeline',this)"><i class="fas fa-history"></i> Timeline</button>
            <button class="cm-tab cm-tab-intel"    id="cm-tab-intel"     onclick="switchClientTab('intel',this)"><i class="fas fa-satellite-dish"></i> 3rd-Party Intel</button>
            <button class="cm-tab cm-tab-planning" id="cm-tab-planning"  onclick="switchClientTab('planning',this)"><i class="fas fa-drafting-compass"></i> Financial Plan</button>
            <button class="cm-tab cm-tab-illust"   id="cm-tab-illust"    onclick="switchClientTab('illust',this)"><i class="fas fa-chart-area"></i> Illustrations</button>
          </div>

          {/* Tab body */}
          <div class="cm-body" id="cm-body"></div>

          {/* Footer actions */}
          <div class="cm-footer" id="cm-footer">
            <button class="btn btn-primary" onclick="closeClientModal();navigateTo('policies')"><i class="fas fa-file-contract"></i> View Policies</button>
            <button class="btn btn-outline" id="cm-btn-outreach" onclick="switchClientTab('outreach',document.getElementById('cm-tab-outreach'))"><i class="fas fa-paper-plane"></i> Outreach</button>
            <button class="btn btn-outline" id="cm-btn-call"><i class="fas fa-phone"></i> Call</button>
            <button class="btn btn-outline" id="cm-btn-meeting" onclick="scheduleCMeMeeting(_cmClientId)"><i class="fas fa-calendar-plus"></i> Schedule</button>
            <button class="btn btn-ai" onclick="closeClientModal();navigateTo('ai-agents')"><i class="fas fa-robot"></i> AI Analysis</button>
          </div>
        </div>
      </div>
    </div>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// CAMPAIGNS PAGE
// ─────────────────────────────────────────────────────────────────────────────
function CampaignsPage() {
  return (
    <div class="page campaigns-page">

      {/* ── Header ── */}
      <div class="camp-header">
        <div class="camp-header-left">
          <h2 class="camp-title"><i class="fas fa-bullhorn"></i> AI-Powered Campaigns</h2>
          <p class="camp-sub">6 active campaigns · 142 leads generated · $1.24M pipeline value · Revenue Generation engine</p>
        </div>
        <div class="camp-header-actions">
          <button class="btn btn-ai" onclick="openCampAIWizard()"><i class="fas fa-robot"></i> AI Campaign Wizard</button>
          <button class="btn btn-primary" onclick="openNewCampaignModal()"><i class="fas fa-plus"></i> New Campaign</button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div class="camp-kpi-strip">
        <div class="camp-kpi">
          <div class="camp-kpi-icon" style="background:#eff6ff;color:#003087"><i class="fas fa-bullhorn"></i></div>
          <div class="camp-kpi-body"><div class="camp-kpi-val">6</div><div class="camp-kpi-lbl">Active Campaigns</div></div>
        </div>
        <div class="camp-kpi">
          <div class="camp-kpi-icon" style="background:#fef3c7;color:#d97706"><i class="fas fa-user-plus"></i></div>
          <div class="camp-kpi-body"><div class="camp-kpi-val">142</div><div class="camp-kpi-lbl">Leads Generated</div></div>
        </div>
        <div class="camp-kpi">
          <div class="camp-kpi-icon" style="background:#ecfdf5;color:#059669"><i class="fas fa-bolt"></i></div>
          <div class="camp-kpi-body"><div class="camp-kpi-val">38</div><div class="camp-kpi-lbl">Opportunities Created</div></div>
        </div>
        <div class="camp-kpi">
          <div class="camp-kpi-icon" style="background:#f5f3ff;color:#7c3aed"><i class="fas fa-handshake"></i></div>
          <div class="camp-kpi-body"><div class="camp-kpi-val">11</div><div class="camp-kpi-lbl">Clients Converted</div></div>
        </div>
        <div class="camp-kpi">
          <div class="camp-kpi-icon" style="background:#fff7ed;color:#ea580c"><i class="fas fa-dollar-sign"></i></div>
          <div class="camp-kpi-body"><div class="camp-kpi-val">$1.24M</div><div class="camp-kpi-lbl">Pipeline Value</div></div>
        </div>
        <div class="camp-kpi">
          <div class="camp-kpi-icon" style="background:#fdf2f8;color:#9d174d"><i class="fas fa-percentage"></i></div>
          <div class="camp-kpi-body"><div class="camp-kpi-val">7.7%</div><div class="camp-kpi-lbl">Avg Conversion Rate</div></div>
        </div>
      </div>

      {/* ── AI Intelligence Banner ── */}
      <div class="camp-ai-banner">
        <div class="camp-ai-banner-left">
          <i class="fas fa-brain camp-ai-icon"></i>
          <div>
            <div class="camp-ai-title">AI Campaign Intelligence <span class="camp-ai-badge">LIVE</span></div>
            <div class="camp-ai-desc">Hyperpersonalized outreach · Customer 360 profiling · Predictive lead scoring · Auto-generated campaign briefs</div>
          </div>
        </div>
        <div class="camp-ai-banner-right">
          <div class="camp-ai-insight"><i class="fas fa-fire" style="color:#f59e0b"></i> <strong>Whole Life Campaign</strong> is outperforming — 24% conversion vs 8% avg. Scale budget by 2×?</div>
          <div class="camp-ai-insight"><i class="fas fa-lightbulb" style="color:#0891b2"></i> <strong>47 existing clients</strong> match the Retirement Annuity upsell profile — launch targeted campaign?</div>
          <button class="camp-ai-act-btn" onclick="openCampAIWizard()"><i class="fas fa-magic"></i> Run AI Analysis</button>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div class="camp-toolbar">
        <div class="camp-tb-left">
          <div class="camp-search">
            <i class="fas fa-search"></i>
            <input type="text" id="camp-search" placeholder="Search campaigns..." oninput="filterCampaigns()" />
          </div>
          <select class="camp-select" id="camp-type-filter" onchange="filterCampaigns()">
            <option value="">All Types</option>
            <option value="Life Insurance">Life Insurance</option>
            <option value="Retirement">Retirement</option>
            <option value="Investments">Investments</option>
            <option value="Wealth Management">Wealth Management</option>
            <option value="LTC">LTC</option>
          </select>
          <select class="camp-select" id="camp-status-filter" onchange="filterCampaigns()">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
        <div class="camp-tb-right">
          <button class="camp-view-btn active" id="camp-view-cards" onclick="setCampView('cards',this)"><i class="fas fa-th-large"></i></button>
          <button class="camp-view-btn" id="camp-view-table" onclick="setCampView('table',this)"><i class="fas fa-list"></i></button>
        </div>
      </div>

      {/* ── Campaign Funnel Summary ── */}
      <div class="camp-funnel-bar">
        <div class="camp-funnel-step">
          <div class="camp-funnel-num" style="color:#0891b2">6</div>
          <div class="camp-funnel-lbl">Campaigns</div>
        </div>
        <div class="camp-funnel-arrow"><i class="fas fa-chevron-right"></i></div>
        <div class="camp-funnel-step">
          <div class="camp-funnel-num" style="color:#f59e0b">142</div>
          <div class="camp-funnel-lbl">Leads</div>
        </div>
        <div class="camp-funnel-arrow"><i class="fas fa-chevron-right"></i></div>
        <div class="camp-funnel-step">
          <div class="camp-funnel-num" style="color:#7c3aed">38</div>
          <div class="camp-funnel-lbl">Opportunities</div>
        </div>
        <div class="camp-funnel-arrow"><i class="fas fa-chevron-right"></i></div>
        <div class="camp-funnel-step">
          <div class="camp-funnel-num" style="color:#059669">11</div>
          <div class="camp-funnel-lbl">Clients</div>
        </div>
        <div class="camp-funnel-arrow"><i class="fas fa-chevron-right"></i></div>
        <div class="camp-funnel-step">
          <div class="camp-funnel-num" style="color:#9d174d">4</div>
          <div class="camp-funnel-lbl">Upsold</div>
        </div>
      </div>

      {/* ── Campaign Cards Grid ── */}
      <div class="camp-grid" id="camp-grid">

        {/* Campaign 1: Whole Life */}
        <div class="camp-card" data-type="Life Insurance" data-status="Active" onclick="openCampaignDetail('C001')">
          <div class="camp-card-header">
            <div class="camp-card-icon" style="background:linear-gradient(135deg,#003087,#0055c8)">
              <i class="fas fa-shield-alt"></i>
            </div>
            <div class="camp-card-meta">
              <div class="camp-card-name">Whole Life Protection Campaign</div>
              <div class="camp-card-type">Life Insurance · AI-Powered</div>
            </div>
            <span class="camp-status-badge active">Active</span>
          </div>
          <div class="camp-card-ai-insight">
            <i class="fas fa-robot"></i> AI: Target 35–55yr professionals with dependents. Emphasis on cash value + living benefits.
          </div>
          <div class="camp-card-stats">
            <div class="camp-stat"><div class="camp-stat-val">34</div><div class="camp-stat-lbl">Leads</div></div>
            <div class="camp-stat"><div class="camp-stat-val">12</div><div class="camp-stat-lbl">Opps</div></div>
            <div class="camp-stat"><div class="camp-stat-val">4</div><div class="camp-stat-lbl">Clients</div></div>
            <div class="camp-stat"><div class="camp-stat-val">24%</div><div class="camp-stat-lbl">Conv. Rate</div></div>
          </div>
          <div class="camp-card-progress">
            <div class="camp-progress-label"><span>Progress to goal</span><span>68/100 leads</span></div>
            <div class="camp-progress-bar"><div class="camp-progress-fill" style="width:68%;background:#003087"></div></div>
          </div>
          <div class="camp-card-footer">
            <span class="camp-channel"><i class="fas fa-envelope"></i> Email</span>
            <span class="camp-channel"><i class="fas fa-phone"></i> Outbound</span>
            <span class="camp-channel"><i class="fas fa-share-alt"></i> Social</span>
            <span class="camp-budget">Budget: $4,200</span>
          </div>
          <div class="camp-card-actions">
            <button class="camp-btn-sm primary" onclick="event.stopPropagation();viewCampLeads('C001')"><i class="fas fa-users"></i> View Leads</button>
            <button class="camp-btn-sm secondary" onclick="event.stopPropagation();openCampaignDetail('C001')"><i class="fas fa-chart-line"></i> Analytics</button>
          </div>
        </div>

        {/* Campaign 2: Term Life */}
        <div class="camp-card" data-type="Life Insurance" data-status="Active" onclick="openCampaignDetail('C002')">
          <div class="camp-card-header">
            <div class="camp-card-icon" style="background:linear-gradient(135deg,#0891b2,#06b6d4)">
              <i class="fas fa-umbrella"></i>
            </div>
            <div class="camp-card-meta">
              <div class="camp-card-name">Term Life — Young Families</div>
              <div class="camp-card-type">Life Insurance · AI-Powered</div>
            </div>
            <span class="camp-status-badge active">Active</span>
          </div>
          <div class="camp-card-ai-insight">
            <i class="fas fa-robot"></i> AI: Target 28–40yr new parents. Lead with affordability + mortgage protection angle.
          </div>
          <div class="camp-card-stats">
            <div class="camp-stat"><div class="camp-stat-val">28</div><div class="camp-stat-lbl">Leads</div></div>
            <div class="camp-stat"><div class="camp-stat-val">7</div><div class="camp-stat-lbl">Opps</div></div>
            <div class="camp-stat"><div class="camp-stat-val">2</div><div class="camp-stat-lbl">Clients</div></div>
            <div class="camp-stat"><div class="camp-stat-val">7.1%</div><div class="camp-stat-lbl">Conv. Rate</div></div>
          </div>
          <div class="camp-card-progress">
            <div class="camp-progress-label"><span>Progress to goal</span><span>28/75 leads</span></div>
            <div class="camp-progress-bar"><div class="camp-progress-fill" style="width:37%;background:#0891b2"></div></div>
          </div>
          <div class="camp-card-footer">
            <span class="camp-channel"><i class="fas fa-envelope"></i> Email</span>
            <span class="camp-channel"><i class="fas fa-mobile-alt"></i> SMS</span>
            <span class="camp-budget">Budget: $2,800</span>
          </div>
          <div class="camp-card-actions">
            <button class="camp-btn-sm primary" onclick="event.stopPropagation();viewCampLeads('C002')"><i class="fas fa-users"></i> View Leads</button>
            <button class="camp-btn-sm secondary" onclick="event.stopPropagation();openCampaignDetail('C002')"><i class="fas fa-chart-line"></i> Analytics</button>
          </div>
        </div>

        {/* Campaign 3: Retirement Annuity */}
        <div class="camp-card" data-type="Retirement" data-status="Active" onclick="openCampaignDetail('C003')">
          <div class="camp-card-header">
            <div class="camp-card-icon" style="background:linear-gradient(135deg,#059669,#10b981)">
              <i class="fas fa-piggy-bank"></i>
            </div>
            <div class="camp-card-meta">
              <div class="camp-card-name">Retirement Income — Annuity</div>
              <div class="camp-card-type">Retirement · Upsell Campaign</div>
            </div>
            <span class="camp-status-badge active">Active</span>
          </div>
          <div class="camp-card-ai-insight">
            <i class="fas fa-robot"></i> AI: Existing clients 50–65yr with no annuity product. Cross-sell from life policies.
          </div>
          <div class="camp-card-stats">
            <div class="camp-stat"><div class="camp-stat-val">31</div><div class="camp-stat-lbl">Leads</div></div>
            <div class="camp-stat"><div class="camp-stat-val">9</div><div class="camp-stat-lbl">Opps</div></div>
            <div class="camp-stat"><div class="camp-stat-val">3</div><div class="camp-stat-lbl">Clients</div></div>
            <div class="camp-stat"><div class="camp-stat-val">9.7%</div><div class="camp-stat-lbl">Conv. Rate</div></div>
          </div>
          <div class="camp-card-progress">
            <div class="camp-progress-label"><span>Progress to goal</span><span>31/50 leads</span></div>
            <div class="camp-progress-bar"><div class="camp-progress-fill" style="width:62%;background:#059669"></div></div>
          </div>
          <div class="camp-card-footer">
            <span class="camp-channel"><i class="fas fa-calendar"></i> Seminar</span>
            <span class="camp-channel"><i class="fas fa-envelope"></i> Email</span>
            <span class="camp-budget">Budget: $5,500</span>
          </div>
          <div class="camp-card-actions">
            <button class="camp-btn-sm primary" onclick="event.stopPropagation();viewCampLeads('C003')"><i class="fas fa-users"></i> View Leads</button>
            <button class="camp-btn-sm secondary" onclick="event.stopPropagation();openCampaignDetail('C003')"><i class="fas fa-chart-line"></i> Analytics</button>
          </div>
        </div>

        {/* Campaign 4: Wealth Management */}
        <div class="camp-card" data-type="Wealth Management" data-status="Active" onclick="openCampaignDetail('C004')">
          <div class="camp-card-header">
            <div class="camp-card-icon" style="background:linear-gradient(135deg,#7c3aed,#9f67fa)">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="camp-card-meta">
              <div class="camp-card-name">Wealth Management — HNW Segment</div>
              <div class="camp-card-type">Wealth Management · Premium</div>
            </div>
            <span class="camp-status-badge active">Active</span>
          </div>
          <div class="camp-card-ai-insight">
            <i class="fas fa-robot"></i> AI: HNW clients $500K+ AUM potential. Lead with UMA + estate planning bundled offer.
          </div>
          <div class="camp-card-stats">
            <div class="camp-stat"><div class="camp-stat-val">19</div><div class="camp-stat-lbl">Leads</div></div>
            <div class="camp-stat"><div class="camp-stat-val">6</div><div class="camp-stat-lbl">Opps</div></div>
            <div class="camp-stat"><div class="camp-stat-val">2</div><div class="camp-stat-lbl">Clients</div></div>
            <div class="camp-stat"><div class="camp-stat-val">10.5%</div><div class="camp-stat-lbl">Conv. Rate</div></div>
          </div>
          <div class="camp-card-progress">
            <div class="camp-progress-label"><span>Progress to goal</span><span>19/40 leads</span></div>
            <div class="camp-progress-bar"><div class="camp-progress-fill" style="width:48%;background:#7c3aed"></div></div>
          </div>
          <div class="camp-card-footer">
            <span class="camp-channel"><i class="fas fa-handshake"></i> Referral</span>
            <span class="camp-channel"><i class="fas fa-calendar"></i> Event</span>
            <span class="camp-budget">Budget: $8,000</span>
          </div>
          <div class="camp-card-actions">
            <button class="camp-btn-sm primary" onclick="event.stopPropagation();viewCampLeads('C004')"><i class="fas fa-users"></i> View Leads</button>
            <button class="camp-btn-sm secondary" onclick="event.stopPropagation();openCampaignDetail('C004')"><i class="fas fa-chart-line"></i> Analytics</button>
          </div>
        </div>

        {/* Campaign 5: LTC */}
        <div class="camp-card" data-type="LTC" data-status="Paused" onclick="openCampaignDetail('C005')">
          <div class="camp-card-header">
            <div class="camp-card-icon" style="background:linear-gradient(135deg,#ea580c,#f97316)">
              <i class="fas fa-heartbeat"></i>
            </div>
            <div class="camp-card-meta">
              <div class="camp-card-name">Long-Term Care Awareness</div>
              <div class="camp-card-type">LTC · Education Campaign</div>
            </div>
            <span class="camp-status-badge paused">Paused</span>
          </div>
          <div class="camp-card-ai-insight">
            <i class="fas fa-robot"></i> AI: Clients 55–70yr without LTC coverage. Pair with Medicare awareness messaging.
          </div>
          <div class="camp-card-stats">
            <div class="camp-stat"><div class="camp-stat-val">18</div><div class="camp-stat-lbl">Leads</div></div>
            <div class="camp-stat"><div class="camp-stat-val">3</div><div class="camp-stat-lbl">Opps</div></div>
            <div class="camp-stat"><div class="camp-stat-val">0</div><div class="camp-stat-lbl">Clients</div></div>
            <div class="camp-stat"><div class="camp-stat-val">0%</div><div class="camp-stat-lbl">Conv. Rate</div></div>
          </div>
          <div class="camp-card-progress">
            <div class="camp-progress-label"><span>Progress to goal</span><span>18/60 leads</span></div>
            <div class="camp-progress-bar"><div class="camp-progress-fill" style="width:30%;background:#ea580c"></div></div>
          </div>
          <div class="camp-card-footer">
            <span class="camp-channel"><i class="fas fa-envelope"></i> Email</span>
            <span class="camp-channel"><i class="fas fa-newspaper"></i> Content</span>
            <span class="camp-budget">Budget: $3,100</span>
          </div>
          <div class="camp-card-actions">
            <button class="camp-btn-sm primary" onclick="event.stopPropagation();viewCampLeads('C005')"><i class="fas fa-users"></i> View Leads</button>
            <button class="camp-btn-sm warning" onclick="event.stopPropagation();resumeCampaign('C005')"><i class="fas fa-play"></i> Resume</button>
          </div>
        </div>

        {/* Campaign 6: Investments */}
        <div class="camp-card" data-type="Investments" data-status="Active" onclick="openCampaignDetail('C006')">
          <div class="camp-card-header">
            <div class="camp-card-icon" style="background:linear-gradient(135deg,#0e7490,#0891b2)">
              <i class="fas fa-chart-pie"></i>
            </div>
            <div class="camp-card-meta">
              <div class="camp-card-name">Investment Portfolio — Mid-Market</div>
              <div class="camp-card-type">Investments · Growth Campaign</div>
            </div>
            <span class="camp-status-badge active">Active</span>
          </div>
          <div class="camp-card-ai-insight">
            <i class="fas fa-robot"></i> AI: Clients with idle savings over $50K. Introduce MainStay Funds + VUL sub-accounts.
          </div>
          <div class="camp-card-stats">
            <div class="camp-stat"><div class="camp-stat-val">12</div><div class="camp-stat-lbl">Leads</div></div>
            <div class="camp-stat"><div class="camp-stat-val">4</div><div class="camp-stat-lbl">Opps</div></div>
            <div class="camp-stat"><div class="camp-stat-val">0</div><div class="camp-stat-lbl">Clients</div></div>
            <div class="camp-stat"><div class="camp-stat-val">0%</div><div class="camp-stat-lbl">Conv. Rate</div></div>
          </div>
          <div class="camp-card-progress">
            <div class="camp-progress-label"><span>Progress to goal</span><span>12/50 leads</span></div>
            <div class="camp-progress-bar"><div class="camp-progress-fill" style="width:24%;background:#0891b2"></div></div>
          </div>
          <div class="camp-card-footer">
            <span class="camp-channel"><i class="fas fa-laptop"></i> Webinar</span>
            <span class="camp-channel"><i class="fas fa-envelope"></i> Email</span>
            <span class="camp-budget">Budget: $3,600</span>
          </div>
          <div class="camp-card-actions">
            <button class="camp-btn-sm primary" onclick="event.stopPropagation();viewCampLeads('C006')"><i class="fas fa-users"></i> View Leads</button>
            <button class="camp-btn-sm secondary" onclick="event.stopPropagation();openCampaignDetail('C006')"><i class="fas fa-chart-line"></i> Analytics</button>
          </div>
        </div>

      </div>

      {/* ── Campaign Detail Modal ── */}
      <div class="camp-modal-overlay" id="camp-detail-overlay" onclick="closeCampaignDetail(event)">
        <div class="camp-modal" id="camp-detail-modal">
          <div class="camp-modal-header">
            <div class="camp-modal-title" id="camp-modal-title">Campaign Analytics</div>
            <button class="camp-modal-close" onclick="closeCampaignDetail()"><i class="fas fa-times"></i></button>
          </div>
          <div class="camp-modal-body" id="camp-modal-body">
            {/* Filled dynamically */}
          </div>
        </div>
      </div>

      {/* ── New Campaign Modal ── */}
      <div class="camp-modal-overlay" id="camp-new-overlay" onclick="closeNewCampaignModal(event)">
        <div class="camp-modal camp-new-modal">
          <div class="camp-modal-header">
            <div class="camp-modal-title"><i class="fas fa-plus-circle"></i> Create New Campaign</div>
            <button class="camp-modal-close" onclick="closeNewCampaignModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="camp-modal-body">
            <div class="camp-form-grid">
              <div class="camp-form-group camp-span2">
                <label class="camp-label">Campaign Name</label>
                <input type="text" class="camp-input" placeholder="e.g. Q3 Whole Life Drive" id="new-camp-name" />
              </div>
              <div class="camp-form-group">
                <label class="camp-label">Product Type</label>
                <select class="camp-input" id="new-camp-type">
                  <option>Life Insurance</option>
                  <option>Retirement</option>
                  <option>Investments</option>
                  <option>Wealth Management</option>
                  <option>LTC</option>
                </select>
              </div>
              <div class="camp-form-group">
                <label class="camp-label">Target Segment</label>
                <select class="camp-input" id="new-camp-segment">
                  <option>Young Families (28–40)</option>
                  <option>Mid-Career (40–55)</option>
                  <option>Pre-Retirement (55–65)</option>
                  <option>HNW Clients</option>
                  <option>Existing Clients (Upsell)</option>
                </select>
              </div>
              <div class="camp-form-group">
                <label class="camp-label">Channels</label>
                <select class="camp-input" id="new-camp-channel">
                  <option>Email + Outbound</option>
                  <option>Email + SMS</option>
                  <option>Seminar + Email</option>
                  <option>Referral + Event</option>
                  <option>Webinar + Email</option>
                </select>
              </div>
              <div class="camp-form-group">
                <label class="camp-label">Budget ($)</label>
                <input type="number" class="camp-input" placeholder="5000" id="new-camp-budget" />
              </div>
              <div class="camp-form-group camp-span2">
                <label class="camp-label">AI Campaign Goal</label>
                <textarea class="camp-input camp-textarea" rows="3" placeholder="Describe your campaign objective — AI will generate targeting criteria, messaging, and lead scoring rules..." id="new-camp-goal"></textarea>
              </div>
            </div>
            <div class="camp-ai-suggest-box" id="camp-ai-suggest">
              <i class="fas fa-robot"></i>
              <span>Fill in the fields above and click <strong>Generate AI Brief</strong> to get targeting recommendations, messaging strategy, and lead scoring criteria.</span>
            </div>
            <div class="camp-modal-footer">
              <button class="btn btn-ai" onclick="generateCampaignAIBrief()"><i class="fas fa-magic"></i> Generate AI Brief</button>
              <button class="btn btn-primary" onclick="saveNewCampaign()"><i class="fas fa-save"></i> Launch Campaign</button>
              <button class="btn btn-ghost" onclick="closeNewCampaignModal()">Cancel</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
//  UPSELL TRACK PAGE
// ═══════════════════════════════════════════════════════════════

function PolicyAlertsPage() {
  return (
    <div class="page alerts-page">

      {/* ── Header ── */}
      <div class="alerts-header">
        <div class="alerts-header-left">
          <h2 class="alerts-title"><i class="fas fa-bell"></i> Policy Alerts</h2>
          <p class="alerts-sub">AI-monitored renewal deadlines · lapse risk scores · at-risk client flags</p>
        </div>
        <div class="alerts-header-actions">
          <button class="btn btn-ai" onclick="runAlertScan()"><i class="fas fa-robot"></i> AI Scan</button>
          <button class="btn btn-outline" onclick="exportAlertList()"><i class="fas fa-download"></i> Export</button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div class="alerts-kpi-strip">
        <div class="al-kpi al-kpi-red">
          <div class="al-kpi-icon"><i class="fas fa-fire"></i></div>
          <div><div class="al-kpi-val" id="akpi-urgent">4</div><div class="al-kpi-lbl">Urgent Alerts</div></div>
        </div>
        <div class="al-kpi al-kpi-orange">
          <div class="al-kpi-icon"><i class="fas fa-sync-alt"></i></div>
          <div><div class="al-kpi-val">23</div><div class="al-kpi-lbl">Renewals Due (90d)</div></div>
        </div>
        <div class="al-kpi al-kpi-purple">
          <div class="al-kpi-icon"><i class="fas fa-heartbeat"></i></div>
          <div><div class="al-kpi-val">15</div><div class="al-kpi-lbl">Lapse Risk Clients</div></div>
        </div>
        <div class="al-kpi al-kpi-blue">
          <div class="al-kpi-icon"><i class="fas fa-dollar-sign"></i></div>
          <div><div class="al-kpi-val">$84K</div><div class="al-kpi-lbl">Premium at Risk</div></div>
        </div>
        <div class="al-kpi al-kpi-green">
          <div class="al-kpi-icon"><i class="fas fa-shield-alt"></i></div>
          <div><div class="al-kpi-val">89%</div><div class="al-kpi-lbl">Retention Rate</div></div>
        </div>
      </div>

      {/* ── AI Banner ── */}
      <div class="alerts-ai-banner">
        <div class="aab-icon"><i class="fas fa-brain"></i></div>
        <div class="aab-text">
          <span class="aab-hi">AI Risk Engine:</span> Patricia Nguyen's UL policy is under-funded — lapse predicted
          <strong>Jun 20, 2026</strong>. Sandra Williams' Term renewal window closes <strong>Sep 2026</strong>.
          <strong>2 clients need action within 7 days.</strong>
        </div>
        <button class="aab-cta" onclick="runAlertScan()"><i class="fas fa-bolt"></i> Act Now</button>
      </div>

      {/* ── Filter Tabs ── */}
      <div class="alerts-tab-bar">
        <button class="al-tab active" onclick="setAlertTab(this,'all')">
          All <span class="al-tab-count">12</span>
        </button>
        <button class="al-tab" onclick="setAlertTab(this,'renewal')">
          <i class="fas fa-sync-alt"></i> Renewals <span class="al-tab-count">5</span>
        </button>
        <button class="al-tab" onclick="setAlertTab(this,'lapse')">
          <i class="fas fa-heartbeat"></i> Lapse Risk <span class="al-tab-count">4</span>
        </button>
        <button class="al-tab" onclick="setAlertTab(this,'at-risk')">
          <i class="fas fa-exclamation-triangle"></i> At-Risk <span class="al-tab-count">3</span>
        </button>
        <button class="al-tab" onclick="setAlertTab(this,'coverage')">
          <i class="fas fa-shield-alt"></i> Coverage Gaps <span class="al-tab-count">0</span>
        </button>
      </div>

      {/* ── Two-Column Body ── */}
      <div class="alerts-body">

        {/* Left: Alert List */}
        <div class="alerts-list-col">
          <div class="alerts-list" id="alerts-list">
            <div class="al-loading"><i class="fas fa-circle-notch fa-spin"></i> Loading alerts…</div>
          </div>
        </div>

        {/* Right: Detail Panel */}
        <div class="alerts-detail-col">
          <div class="alerts-detail-empty" id="alerts-detail-empty">
            <i class="fas fa-bell-slash"></i>
            <p>Select an alert to view details and AI recommendations</p>
          </div>
          <div id="alerts-detail-panel" style="display:none"></div>
        </div>

      </div>

      {/* ── Renewal Timeline ── */}
      <div class="renewal-timeline-section">
        <div class="rts-header">
          <span class="rts-title"><i class="fas fa-calendar-alt"></i> 90-Day Renewal Timeline</span>
          <div class="rts-legend">
            <span><span class="rts-leg-dot urgent"></span> Urgent (&le;30d)</span>
            <span><span class="rts-leg-dot high"></span> High (31–60d)</span>
            <span><span class="rts-leg-dot normal"></span> Normal (61–90d)</span>
          </div>
        </div>
        <div class="rts-track" id="rts-track"></div>
      </div>

    </div>
  )
}


function PipelineViewPage() {
  return (
    <div class="page pipeline-view-page">

      {/* ── Header ── */}
      <div class="pv-header">
        <div class="pv-header-left">
          <h2 class="pv-title"><i class="fas fa-route"></i> Client Journey Pipeline</h2>
          <p class="pv-sub">Full lifecycle view · Lead → Opportunity → Client → Upsell · Includes Sales KPIs, quota tracking & forecasting</p>
        </div>
        <div class="pv-header-actions">
          <button class="pv-view-btn active" id="pvv-kanban" onclick="switchPVView('kanban',this)"><i class="fas fa-columns"></i> Kanban</button>
          <button class="pv-view-btn" id="pvv-sales" onclick="switchPVView('sales',this)"><i class="fas fa-chart-bar"></i> Sales KPIs</button>
          <select class="pv-filter-select" id="pv-filter-seg" onchange="filterPipelineView()">
            <option value="all">All Segments</option>
            <option value="Premium">Premium</option>
            <option value="High Value">High Value</option>
            <option value="Mid Market">Mid Market</option>
            <option value="Emerging">Emerging</option>
          </select>
          <button class="btn btn-ai" onclick="runPipelineAI()"><i class="fas fa-robot"></i> AI Insights</button>
          <button class="btn btn-outline" onclick="openAddDealModal()"><i class="fas fa-plus"></i> Add Deal</button>
        </div>
      </div>

      {/* ── Funnel KPI Bar ── */}
      <div class="pv-funnel-kpis">
        <div class="pvf-stage" onclick="filterPipelineView('leads')">
          <div class="pvf-num">14</div>
          <div class="pvf-lbl"><i class="fas fa-user-clock"></i> Leads</div>
          <div class="pvf-sub">$1.24M pipeline</div>
          <div class="pvf-arrow"><i class="fas fa-chevron-right"></i></div>
        </div>
        <div class="pvf-stage" onclick="filterPipelineView('opps')">
          <div class="pvf-num">5</div>
          <div class="pvf-lbl"><i class="fas fa-bolt"></i> Opportunities</div>
          <div class="pvf-sub">$21.5K est. value</div>
          <div class="pvf-arrow"><i class="fas fa-chevron-right"></i></div>
        </div>
        <div class="pvf-stage" onclick="filterPipelineView('clients')">
          <div class="pvf-num">8</div>
          <div class="pvf-lbl"><i class="fas fa-users"></i> Active Clients</div>
          <div class="pvf-sub">$63.4K/yr premium</div>
          <div class="pvf-arrow"><i class="fas fa-chevron-right"></i></div>
        </div>
        <div class="pvf-stage" onclick="filterPipelineView('upsell')">
          <div class="pvf-num">8</div>
          <div class="pvf-lbl"><i class="fas fa-arrow-trend-up"></i> Upsell Ready</div>
          <div class="pvf-sub">$2.84M opportunity</div>
        </div>
      </div>

      {/* ── Conversion Rate Bar ── */}
      <div class="pv-conv-bar">
        <div class="pv-conv-item">
          <span class="pv-conv-label">Lead → Opp</span>
          <div class="pv-conv-track"><div class="pv-conv-fill" style="width:36%"></div></div>
          <span class="pv-conv-pct">36%</span>
        </div>
        <div class="pv-conv-item">
          <span class="pv-conv-label">Opp → Client</span>
          <div class="pv-conv-track"><div class="pv-conv-fill" style="width:62%"></div></div>
          <span class="pv-conv-pct">62%</span>
        </div>
        <div class="pv-conv-item">
          <span class="pv-conv-label">Client → Upsell</span>
          <div class="pv-conv-track"><div class="pv-conv-fill" style="width:100%"></div></div>
          <span class="pv-conv-pct">100%</span>
        </div>
        <div class="pv-conv-item">
          <span class="pv-conv-label">Avg Days / Stage</span>
          <div class="pv-conv-track"><div class="pv-conv-fill amber" style="width:55%"></div></div>
          <span class="pv-conv-pct">18d</span>
        </div>
      </div>

      {/* ── KANBAN VIEW ── */}
      <div id="pv-view-kanban">
        {/* Stale deal alert */}
        <div class="pv-stale-alert">
          <i class="fas fa-exclamation-triangle"></i>
          <strong>2 stale deals</strong> have had no activity for &gt;10 days — D003 (15d idle, score dropped to 44%), D007 (12d idle)
          <button class="pv-stale-btn" onclick="showToast('Stale deal outreach queued','info')">Review Now</button>
        </div>

        <div class="pv-kanban" id="pv-kanban">
          <div class="pvk-col pvk-leads">
            <div class="pvk-col-header">
              <div class="pvk-col-title"><i class="fas fa-user-clock"></i> Leads</div>
              <span class="pvk-col-badge lead">14</span>
            </div>
            <div class="pvk-cards" id="pvk-leads"></div>
          </div>
          <div class="pvk-col pvk-opps">
            <div class="pvk-col-header">
              <div class="pvk-col-title"><i class="fas fa-bolt"></i> Opportunities</div>
              <span class="pvk-col-badge opp">5</span>
            </div>
            <div class="pvk-cards" id="pvk-opps"></div>
          </div>
          <div class="pvk-col pvk-clients">
            <div class="pvk-col-header">
              <div class="pvk-col-title"><i class="fas fa-users"></i> Active Clients</div>
              <span class="pvk-col-badge client">8</span>
            </div>
            <div class="pvk-cards" id="pvk-clients"></div>
          </div>
          <div class="pvk-col pvk-upsell">
            <div class="pvk-col-header">
              <div class="pvk-col-title"><i class="fas fa-arrow-trend-up"></i> Upsell Ready</div>
              <span class="pvk-col-badge upsell">8</span>
            </div>
            <div class="pvk-cards" id="pvk-upsell"></div>
          </div>
        </div>
      </div>

      {/* ── SALES KPIs VIEW ── */}
      <div id="pv-view-sales" style="display:none">

        {/* Sales KPI Cards */}
        <div class="skpi-grid">
          <div class="skpi-card skpi-blue">
            <div class="skpi-icon"><i class="fas fa-funnel-dollar"></i></div>
            <div class="skpi-body">
              <div class="skpi-val">$284K</div>
              <div class="skpi-lbl">Pipeline Value</div>
              <div class="skpi-trend up"><i class="fas fa-arrow-up"></i> +$47K vs last month</div>
            </div>
          </div>
          <div class="skpi-card skpi-green">
            <div class="skpi-icon"><i class="fas fa-handshake"></i></div>
            <div class="skpi-body">
              <div class="skpi-val">34</div>
              <div class="skpi-lbl">Closed This Month</div>
              <div class="skpi-trend up"><i class="fas fa-arrow-up"></i> +6 vs last month</div>
            </div>
          </div>
          <div class="skpi-card skpi-gold">
            <div class="skpi-icon"><i class="fas fa-percentage"></i></div>
            <div class="skpi-body">
              <div class="skpi-val">68%</div>
              <div class="skpi-lbl">Conversion Rate</div>
              <div class="skpi-trend up"><i class="fas fa-arrow-up"></i> +4% vs last month</div>
            </div>
          </div>
          <div class="skpi-card skpi-teal">
            <div class="skpi-icon"><i class="fas fa-clock"></i></div>
            <div class="skpi-body">
              <div class="skpi-val">12.4d</div>
              <div class="skpi-lbl">Avg Sales Cycle</div>
              <div class="skpi-trend good"><i class="fas fa-arrow-down"></i> −1.2d vs target</div>
            </div>
          </div>
          <div class="skpi-card skpi-purple">
            <div class="skpi-icon"><i class="fas fa-dollar-sign"></i></div>
            <div class="skpi-body">
              <div class="skpi-val">$42.2K</div>
              <div class="skpi-lbl">Commission MTD</div>
              <div class="skpi-trend up"><i class="fas fa-arrow-up"></i> On track</div>
            </div>
          </div>
          <div class="skpi-card skpi-navy">
            <div class="skpi-icon"><i class="fas fa-trophy"></i></div>
            <div class="skpi-body">
              <div class="skpi-val">78%</div>
              <div class="skpi-lbl">YTD Quota</div>
              <div class="skpi-trend up"><i class="fas fa-check"></i> $187K / $240K</div>
            </div>
          </div>
          <div class="skpi-card skpi-orange">
            <div class="skpi-icon"><i class="fas fa-hourglass-half"></i></div>
            <div class="skpi-body">
              <div class="skpi-val">9</div>
              <div class="skpi-lbl">Deals in Negotiation</div>
              <div class="skpi-trend warn"><i class="fas fa-exclamation-triangle"></i> 3 stalling</div>
            </div>
          </div>
          <div class="skpi-card skpi-rose">
            <div class="skpi-icon"><i class="fas fa-chart-line"></i></div>
            <div class="skpi-body">
              <div class="skpi-val">$52K</div>
              <div class="skpi-lbl">30-Day Forecast</div>
              <div class="skpi-trend up"><i class="fas fa-arrow-up"></i> High confidence</div>
            </div>
          </div>
        </div>

        {/* Quota Progress */}
        <div class="pv-sales-row">
          <div class="pv-quota-panel">
            <div class="pv-quota-header">
              <span class="pv-panel-title"><i class="fas fa-trophy"></i> Quota Tracker</span>
              <span class="pv-quota-pct">78%</span>
            </div>
            <div class="pv-quota-track">
              <div class="pv-quota-fill" style="width:78%"></div>
            </div>
            <div class="pv-quota-labels">
              <span>$0</span><span style="color:#003087;font-weight:700">$187K achieved</span><span>$240K goal</span>
            </div>
            <div class="pv-quota-breakdown">
              <div class="pv-qb-item"><span>Q1</span><div class="pv-qb-bar"><div style="width:100%;background:#22c55e"></div></div><span class="green">✓ $61K</span></div>
              <div class="pv-qb-item"><span>Q2</span><div class="pv-qb-bar"><div style="width:72%;background:#f59e0b"></div></div><span>$43K / $60K</span></div>
            </div>
          </div>

          <div class="pv-velocity-panel">
            <div class="pv-panel-title"><i class="fas fa-tachometer-alt"></i> Deal Velocity</div>
            <div class="pv-velocity-grid">
              <div class="pv-vel-item"><div class="pv-vel-val">12.4d</div><div class="pv-vel-lbl">Avg Cycle</div></div>
              <div class="pv-vel-item"><div class="pv-vel-val green">−1.2d</div><div class="pv-vel-lbl">vs Last Month</div></div>
              <div class="pv-vel-item"><div class="pv-vel-val">3.2</div><div class="pv-vel-lbl">Deals/Week</div></div>
              <div class="pv-vel-item"><div class="pv-vel-val orange">9d</div><div class="pv-vel-lbl">Avg First Contact</div></div>
            </div>
            <div class="pv-panel-title" style="margin-top:14px"><i class="fas fa-chart-pie"></i> Lead Source Mix</div>
            <div class="pv-source-list">
              <div class="pv-src-row"><span>Referrals</span><div class="pv-src-bar"><div style="width:52%;background:#003087"></div></div><span>52%</span></div>
              <div class="pv-src-row"><span>Digital</span><div class="pv-src-bar"><div style="width:28%;background:#4f46e5"></div></div><span>28%</span></div>
              <div class="pv-src-row"><span>Events</span><div class="pv-src-bar"><div style="width:12%;background:#0891b2"></div></div><span>12%</span></div>
              <div class="pv-src-row"><span>Other</span><div class="pv-src-bar"><div style="width:8%;background:#94a3b8"></div></div><span>8%</span></div>
            </div>
          </div>

          <div class="pv-forecast-panel">
            <div class="pv-panel-title"><i class="fas fa-chart-line"></i> AI Revenue Forecast</div>
            <div class="pv-forecast-months">
              <div class="pv-fm-bar-wrap">
                <div class="pv-fm-bar" style="height:70%;background:#003087"></div>
                <span class="pv-fm-lbl">Apr<br/>$42K</span>
              </div>
              <div class="pv-fm-bar-wrap">
                <div class="pv-fm-bar" style="height:87%;background:#1e40af"></div>
                <span class="pv-fm-lbl">May<br/>$52K</span>
              </div>
              <div class="pv-fm-bar-wrap">
                <div class="pv-fm-bar" style="height:60%;background:#94a3b8;opacity:.6"></div>
                <span class="pv-fm-lbl">Jun<br/>~$36K</span>
              </div>
            </div>
            <div class="pv-forecast-ai-note">
              <i class="fas fa-robot"></i> High confidence: Michael Santos ($6.4K) and Alex Rivera ($4.2K) likely to close by May 15.
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div class="pv-activity-panel">
          <div class="pv-panel-title"><i class="fas fa-history"></i> Recent Activity</div>
          <div class="pv-activity-list">
            <div class="pv-act-row"><span class="pv-act-dot green"></span><span class="pv-act-time">Today 2:14pm</span><span class="pv-act-text">Michael Santos — verbal commit received · closing paperwork sent</span></div>
            <div class="pv-act-row"><span class="pv-act-dot blue"></span><span class="pv-act-time">Today 10:30am</span><span class="pv-act-text">Alex Rivera — pre-meeting brief sent · meeting confirmed Apr 18</span></div>
            <div class="pv-act-row"><span class="pv-act-dot orange"></span><span class="pv-act-time">Yesterday</span><span class="pv-act-text">John Kim — APS request submitted · underwriting review pending</span></div>
            <div class="pv-act-row"><span class="pv-act-dot red"></span><span class="pv-act-time">Apr 10</span><span class="pv-act-text">D003 stale alert triggered — 15 days no activity, AI score dropped to 44%</span></div>
          </div>
        </div>

      </div>

      {/* ── Journey Detail Modal ── */}
      <div id="pv-journey-overlay" style="display:none" onclick="closePVModal(event)">
        <div class="pv-journey-modal">
          <div class="pvj-header" id="pvj-header"></div>
          <div class="pvj-body" id="pvj-body"></div>
          <div class="pvj-footer">
            <button class="btn btn-outline pvj-close-btn" onclick="closePVModal()">Close</button>
          </div>
        </div>
      </div>

    </div>
  )
}


function UpsellTrackPage() {
  return (
    <div class="page upsell-page">

      {/* ── Header ── */}
      <div class="upsell-header">
        <div class="upsell-header-left">
          <h2 class="upsell-title"><i class="fas fa-arrow-trend-up"></i> Upsell Track</h2>
          <p class="upsell-sub">AI-flagged clients ready for retirement · investment · wealth management upsell · Based on policy tenure &amp; life stage signals</p>
        </div>
        <div class="upsell-header-actions">
          <button class="btn btn-ai" onclick="runUpsellAIScan()"><i class="fas fa-robot"></i> AI Scan All</button>
          <button class="btn btn-outline" onclick="exportUpsellList()"><i class="fas fa-download"></i> Export List</button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div class="upsell-kpi-strip">
        <div class="upsell-kpi"><div class="upsell-kpi-val" id="ukpi-total">8</div><div class="upsell-kpi-lbl">Flagged Clients</div></div>
        <div class="upsell-kpi upsell-kpi-ret"><div class="upsell-kpi-val">5</div><div class="upsell-kpi-lbl"><i class="fas fa-umbrella"></i> Retirement</div></div>
        <div class="upsell-kpi upsell-kpi-inv"><div class="upsell-kpi-val">4</div><div class="upsell-kpi-lbl"><i class="fas fa-chart-pie"></i> Investments</div></div>
        <div class="upsell-kpi upsell-kpi-wlth"><div class="upsell-kpi-val">3</div><div class="upsell-kpi-lbl"><i class="fas fa-gem"></i> Wealth Mgmt</div></div>
        <div class="upsell-kpi upsell-kpi-val2"><div class="upsell-kpi-val">$2.84M</div><div class="upsell-kpi-lbl">Est. Upsell Value</div></div>
        <div class="upsell-kpi upsell-kpi-comm"><div class="upsell-kpi-val">$141K</div><div class="upsell-kpi-lbl">Est. Commission</div></div>
      </div>

      {/* ── AI Insight Banner ── */}
      <div class="upsell-ai-banner">
        <div class="upsell-ai-icon"><i class="fas fa-brain"></i></div>
        <div class="upsell-ai-text">
          <strong>AI Upsell Intelligence:</strong> 3 clients (Linda Morrison, Robert Chen, James Whitfield) show High-Priority signals — policy tenure &gt;5 yrs + no retirement product + AUM growth potential. 
          Recommended outreach window: <span class="upsell-ai-highlight">Next 30 days</span> before Q3 review season.
        </div>
        <button class="upsell-ai-cta" onclick="openUpsellBriefModal('all')"><i class="fas fa-paper-plane"></i> Generate Outreach</button>
      </div>

      {/* ── Filter Bar ── */}
      <div class="upsell-filter-bar">
        <div class="upsell-search-wrap">
          <i class="fas fa-search upsell-search-icon"></i>
          <input class="upsell-search" id="upsell-search" type="text" placeholder="Search clients…" oninput="filterUpsellCards()" />
        </div>
        <div class="upsell-filter-pills">
          <button class="upsell-pill active" data-filter="all"    onclick="setUpsellFilter(this,'all')">All (8)</button>
          <button class="upsell-pill"         data-filter="retirement" onclick="setUpsellFilter(this,'retirement')"><i class="fas fa-umbrella"></i> Retirement</button>
          <button class="upsell-pill"         data-filter="investment" onclick="setUpsellFilter(this,'investment')"><i class="fas fa-chart-pie"></i> Investment</button>
          <button class="upsell-pill"         data-filter="wealth"     onclick="setUpsellFilter(this,'wealth')"><i class="fas fa-gem"></i> Wealth Mgmt</button>
          <button class="upsell-pill"         data-filter="high"       onclick="setUpsellFilter(this,'high')"><i class="fas fa-fire"></i> High Priority</button>
        </div>
        <div class="upsell-sort-wrap">
          <select class="upsell-sort-sel" onchange="sortUpsellCards(this.value)">
            <option value="priority">Sort: AI Priority</option>
            <option value="value">Est. Value</option>
            <option value="tenure">Policy Tenure</option>
            <option value="score">Client Score</option>
          </select>
        </div>
      </div>

      {/* ── Client Cards Grid ── */}
      <div class="upsell-grid" id="upsell-grid">

        {/* ── C1: Linda Morrison — Premium, 10yr tenure ── */}
        <div class="upsell-card" data-id="UC001" data-priority="high" data-tracks="retirement,investment,wealth" onclick="openUpsellModal('UC001')">
          <div class="upsell-card-header">
            <div class="upsell-avatar upsell-av-lm" style="background:linear-gradient(135deg,#003087,#0057c8)">LM</div>
            <div class="upsell-card-info">
              <div class="upsell-client-name">Linda Morrison</div>
              <div class="upsell-client-meta">Age 56 · Premium · Long Island</div>
            </div>
            <div class="upsell-priority-badge high"><i class="fas fa-fire"></i> High</div>
          </div>
          <div class="upsell-tenure-bar">
            <span class="upsell-tenure-lbl"><i class="fas fa-clock"></i> Policy Tenure</span>
            <div class="upsell-tenure-track"><div class="upsell-tenure-fill" style="width:100%"></div></div>
            <span class="upsell-tenure-yrs">10 yrs</span>
          </div>
          <div class="upsell-existing-products">
            <span class="upsell-prod-chip ins">Whole Life $2M</span>
            <span class="upsell-prod-chip ins">LTC $300K</span>
            <span class="upsell-prod-chip ins">VUL $1.5M</span>
            <span class="upsell-prod-chip inv">Mutual Funds</span>
            <span class="upsell-prod-chip ret">Def. Annuity</span>
          </div>
          <div class="upsell-tracks-row">
            <div class="upsell-track-item ret"><i class="fas fa-umbrella"></i><span>Retirement</span><span class="upsell-track-status gap">Enhance</span></div>
            <div class="upsell-track-item inv"><i class="fas fa-chart-pie"></i><span>Investment</span><span class="upsell-track-status gap">Grow AUM</span></div>
            <div class="upsell-track-item wlth"><i class="fas fa-gem"></i><span>Wealth Mgmt</span><span class="upsell-track-status gap">UMA+</span></div>
          </div>
          <div class="upsell-card-footer">
            <div class="upsell-value-est"><span class="upsell-val-num">$820K</span><span class="upsell-val-lbl">Est. Upsell Value</span></div>
            <button class="upsell-brief-btn" onclick="event.stopPropagation();openUpsellBriefModal('UC001')"><i class="fas fa-paper-plane"></i> Brief</button>
          </div>
        </div>

        {/* ── C2: Robert Chen — High Value, 7yr tenure ── */}
        <div class="upsell-card" data-id="UC002" data-priority="high" data-tracks="retirement,investment" onclick="openUpsellModal('UC002')">
          <div class="upsell-card-header">
            <div class="upsell-avatar" style="background:linear-gradient(135deg,#7c3aed,#a855f7)">RC</div>
            <div class="upsell-card-info">
              <div class="upsell-client-name">Robert Chen</div>
              <div class="upsell-client-meta">Age 45 · High Value · Manhattan</div>
            </div>
            <div class="upsell-priority-badge high"><i class="fas fa-fire"></i> High</div>
          </div>
          <div class="upsell-tenure-bar">
            <span class="upsell-tenure-lbl"><i class="fas fa-clock"></i> Policy Tenure</span>
            <div class="upsell-tenure-track"><div class="upsell-tenure-fill" style="width:70%"></div></div>
            <span class="upsell-tenure-yrs">7 yrs</span>
          </div>
          <div class="upsell-existing-products">
            <span class="upsell-prod-chip ins">Whole Life $1M</span>
            <span class="upsell-prod-chip ins">VUL $800K</span>
            <span class="upsell-prod-chip inv">VUL Sub-accounts</span>
          </div>
          <div class="upsell-tracks-row">
            <div class="upsell-track-item ret"><i class="fas fa-umbrella"></i><span>Retirement</span><span class="upsell-track-status missing">Not Started</span></div>
            <div class="upsell-track-item inv"><i class="fas fa-chart-pie"></i><span>Investment</span><span class="upsell-track-status gap">Expand</span></div>
            <div class="upsell-track-item wlth-na"><i class="fas fa-gem"></i><span>Wealth Mgmt</span><span class="upsell-track-status present">Active</span></div>
          </div>
          <div class="upsell-card-footer">
            <div class="upsell-value-est"><span class="upsell-val-num">$650K</span><span class="upsell-val-lbl">Est. Upsell Value</span></div>
            <button class="upsell-brief-btn" onclick="event.stopPropagation();openUpsellBriefModal('UC002')"><i class="fas fa-paper-plane"></i> Brief</button>
          </div>
        </div>

        {/* ── C3: James Whitfield — High Value, 7yr tenure ── */}
        <div class="upsell-card" data-id="UC003" data-priority="high" data-tracks="retirement,investment,wealth" onclick="openUpsellModal('UC003')">
          <div class="upsell-card-header">
            <div class="upsell-avatar" style="background:linear-gradient(135deg,#0891b2,#22d3ee)">JW</div>
            <div class="upsell-card-info">
              <div class="upsell-client-name">James Whitfield</div>
              <div class="upsell-client-meta">Age 52 · High Value · New York</div>
            </div>
            <div class="upsell-priority-badge high"><i class="fas fa-fire"></i> High</div>
          </div>
          <div class="upsell-tenure-bar">
            <span class="upsell-tenure-lbl"><i class="fas fa-clock"></i> Policy Tenure</span>
            <div class="upsell-tenure-track"><div class="upsell-tenure-fill" style="width:70%"></div></div>
            <span class="upsell-tenure-yrs">7 yrs</span>
          </div>
          <div class="upsell-existing-products">
            <span class="upsell-prod-chip ins">Whole Life $500K</span>
            <span class="upsell-prod-chip ins">Term Life $750K</span>
            <span class="upsell-prod-chip ins">LTC $250K</span>
            <span class="upsell-prod-chip ret">Def. Annuity (prospect)</span>
          </div>
          <div class="upsell-tracks-row">
            <div class="upsell-track-item ret"><i class="fas fa-umbrella"></i><span>Retirement</span><span class="upsell-track-status gap">Confirm</span></div>
            <div class="upsell-track-item inv"><i class="fas fa-chart-pie"></i><span>Investment</span><span class="upsell-track-status missing">Not Started</span></div>
            <div class="upsell-track-item wlth"><i class="fas fa-gem"></i><span>Wealth Mgmt</span><span class="upsell-track-status gap">Estate+</span></div>
          </div>
          <div class="upsell-card-footer">
            <div class="upsell-value-est"><span class="upsell-val-num">$480K</span><span class="upsell-val-lbl">Est. Upsell Value</span></div>
            <button class="upsell-brief-btn" onclick="event.stopPropagation();openUpsellBriefModal('UC003')"><i class="fas fa-paper-plane"></i> Brief</button>
          </div>
        </div>

        {/* ── C4: Maria Gonzalez — High Value, 9yr tenure ── */}
        <div class="upsell-card" data-id="UC004" data-priority="medium" data-tracks="investment,wealth" onclick="openUpsellModal('UC004')">
          <div class="upsell-card-header">
            <div class="upsell-avatar" style="background:linear-gradient(135deg,#059669,#34d399)">MG</div>
            <div class="upsell-card-info">
              <div class="upsell-client-name">Maria Gonzalez</div>
              <div class="upsell-client-meta">Age 48 · High Value · New York</div>
            </div>
            <div class="upsell-priority-badge medium"><i class="fas fa-bolt"></i> Medium</div>
          </div>
          <div class="upsell-tenure-bar">
            <span class="upsell-tenure-lbl"><i class="fas fa-clock"></i> Policy Tenure</span>
            <div class="upsell-tenure-track"><div class="upsell-tenure-fill" style="width:90%"></div></div>
            <span class="upsell-tenure-yrs">9 yrs</span>
          </div>
          <div class="upsell-existing-products">
            <span class="upsell-prod-chip ins">Universal Life $600K</span>
            <span class="upsell-prod-chip ins">Disability</span>
            <span class="upsell-prod-chip inv">Fixed Annuity</span>
            <span class="upsell-prod-chip ret">Immediate Annuity</span>
          </div>
          <div class="upsell-tracks-row">
            <div class="upsell-track-item ret-na"><i class="fas fa-umbrella"></i><span>Retirement</span><span class="upsell-track-status present">Active</span></div>
            <div class="upsell-track-item inv"><i class="fas fa-chart-pie"></i><span>Investment</span><span class="upsell-track-status gap">Diversify</span></div>
            <div class="upsell-track-item wlth"><i class="fas fa-gem"></i><span>Wealth Mgmt</span><span class="upsell-track-status missing">Not Started</span></div>
          </div>
          <div class="upsell-card-footer">
            <div class="upsell-value-est"><span class="upsell-val-num">$320K</span><span class="upsell-val-lbl">Est. Upsell Value</span></div>
            <button class="upsell-brief-btn" onclick="event.stopPropagation();openUpsellBriefModal('UC004')"><i class="fas fa-paper-plane"></i> Brief</button>
          </div>
        </div>

        {/* ── C5: Patricia Nguyen — Mid Market, 6yr tenure ── */}
        <div class="upsell-card" data-id="UC005" data-priority="medium" data-tracks="retirement,investment" onclick="openUpsellModal('UC005')">
          <div class="upsell-card-header">
            <div class="upsell-avatar" style="background:linear-gradient(135deg,#d97706,#fbbf24)">PN</div>
            <div class="upsell-card-info">
              <div class="upsell-client-name">Patricia Nguyen</div>
              <div class="upsell-client-meta">Age 38 · Mid Market · Brooklyn</div>
            </div>
            <div class="upsell-priority-badge medium"><i class="fas fa-bolt"></i> Medium</div>
          </div>
          <div class="upsell-tenure-bar">
            <span class="upsell-tenure-lbl"><i class="fas fa-clock"></i> Policy Tenure</span>
            <div class="upsell-tenure-track"><div class="upsell-tenure-fill" style="width:60%"></div></div>
            <span class="upsell-tenure-yrs">6 yrs</span>
          </div>
          <div class="upsell-existing-products">
            <span class="upsell-prod-chip ins">Universal Life $400K</span>
            <span class="upsell-prod-chip ins">VUL $300K</span>
          </div>
          <div class="upsell-tracks-row">
            <div class="upsell-track-item ret"><i class="fas fa-umbrella"></i><span>Retirement</span><span class="upsell-track-status missing">Not Started</span></div>
            <div class="upsell-track-item inv"><i class="fas fa-chart-pie"></i><span>Investment</span><span class="upsell-track-status missing">Not Started</span></div>
            <div class="upsell-track-item wlth-na"><i class="fas fa-gem"></i><span>Wealth Mgmt</span><span class="upsell-track-status na">N/A</span></div>
          </div>
          <div class="upsell-card-footer">
            <div class="upsell-value-est"><span class="upsell-val-num">$240K</span><span class="upsell-val-lbl">Est. Upsell Value</span></div>
            <button class="upsell-brief-btn" onclick="event.stopPropagation();openUpsellBriefModal('UC005')"><i class="fas fa-paper-plane"></i> Brief</button>
          </div>
        </div>

        {/* ── C6: Sandra Williams — Mid Market, 10yr tenure ── */}
        <div class="upsell-card" data-id="UC006" data-priority="medium" data-tracks="retirement,investment" onclick="openUpsellModal('UC006')">
          <div class="upsell-card-header">
            <div class="upsell-avatar" style="background:linear-gradient(135deg,#be185d,#f472b6)">SW</div>
            <div class="upsell-card-info">
              <div class="upsell-client-name">Sandra Williams</div>
              <div class="upsell-client-meta">Age 61 · Mid Market · Queens</div>
            </div>
            <div class="upsell-priority-badge medium"><i class="fas fa-bolt"></i> Medium</div>
          </div>
          <div class="upsell-tenure-bar">
            <span class="upsell-tenure-lbl"><i class="fas fa-clock"></i> Policy Tenure</span>
            <div class="upsell-tenure-track"><div class="upsell-tenure-fill" style="width:100%"></div></div>
            <span class="upsell-tenure-yrs">10 yrs</span>
          </div>
          <div class="upsell-existing-products">
            <span class="upsell-prod-chip ins">Term Life $350K</span>
            <span class="upsell-prod-chip ins">LTC $180K</span>
            <span class="upsell-prod-chip ret">Income Annuity (prospect)</span>
          </div>
          <div class="upsell-tracks-row">
            <div class="upsell-track-item ret"><i class="fas fa-umbrella"></i><span>Retirement</span><span class="upsell-track-status gap">Confirm</span></div>
            <div class="upsell-track-item inv"><i class="fas fa-chart-pie"></i><span>Investment</span><span class="upsell-track-status missing">Not Started</span></div>
            <div class="upsell-track-item wlth-na"><i class="fas fa-gem"></i><span>Wealth Mgmt</span><span class="upsell-track-status na">N/A</span></div>
          </div>
          <div class="upsell-card-footer">
            <div class="upsell-value-est"><span class="upsell-val-num">$200K</span><span class="upsell-val-lbl">Est. Upsell Value</span></div>
            <button class="upsell-brief-btn" onclick="event.stopPropagation();openUpsellBriefModal('UC006')"><i class="fas fa-paper-plane"></i> Brief</button>
          </div>
        </div>

        {/* ── C7: David Thompson — Emerging, 3yr tenure ── */}
        <div class="upsell-card" data-id="UC007" data-priority="low" data-tracks="retirement" onclick="openUpsellModal('UC007')">
          <div class="upsell-card-header">
            <div class="upsell-avatar" style="background:linear-gradient(135deg,#64748b,#94a3b8)">DT</div>
            <div class="upsell-card-info">
              <div class="upsell-client-name">David Thompson</div>
              <div class="upsell-client-meta">Age 33 · Emerging · Bronx</div>
            </div>
            <div class="upsell-priority-badge low"><i class="fas fa-seedling"></i> Watch</div>
          </div>
          <div class="upsell-tenure-bar">
            <span class="upsell-tenure-lbl"><i class="fas fa-clock"></i> Policy Tenure</span>
            <div class="upsell-tenure-track"><div class="upsell-tenure-fill" style="width:30%"></div></div>
            <span class="upsell-tenure-yrs">3 yrs</span>
          </div>
          <div class="upsell-existing-products">
            <span class="upsell-prod-chip ins">Term Life $300K</span>
          </div>
          <div class="upsell-tracks-row">
            <div class="upsell-track-item ret"><i class="fas fa-umbrella"></i><span>Retirement</span><span class="upsell-track-status missing">Not Started</span></div>
            <div class="upsell-track-item inv-na"><i class="fas fa-chart-pie"></i><span>Investment</span><span class="upsell-track-status na">Future</span></div>
            <div class="upsell-track-item wlth-na"><i class="fas fa-gem"></i><span>Wealth Mgmt</span><span class="upsell-track-status na">Future</span></div>
          </div>
          <div class="upsell-card-footer">
            <div class="upsell-value-est"><span class="upsell-val-num">$80K</span><span class="upsell-val-lbl">Est. Upsell Value</span></div>
            <button class="upsell-brief-btn" onclick="event.stopPropagation();openUpsellBriefModal('UC007')"><i class="fas fa-paper-plane"></i> Brief</button>
          </div>
        </div>

        {/* ── C8: Kevin Park — Emerging, new client ── */}
        <div class="upsell-card" data-id="UC008" data-priority="low" data-tracks="retirement" onclick="openUpsellModal('UC008')">
          <div class="upsell-card-header">
            <div class="upsell-avatar" style="background:linear-gradient(135deg,#0f766e,#2dd4bf)">KP</div>
            <div class="upsell-card-info">
              <div class="upsell-client-name">Kevin Park</div>
              <div class="upsell-client-meta">Age 29 · Emerging · Jersey City</div>
            </div>
            <div class="upsell-priority-badge low"><i class="fas fa-seedling"></i> Watch</div>
          </div>
          <div class="upsell-tenure-bar">
            <span class="upsell-tenure-lbl"><i class="fas fa-clock"></i> Policy Tenure</span>
            <div class="upsell-tenure-track"><div class="upsell-tenure-fill" style="width:10%"></div></div>
            <span class="upsell-tenure-yrs">&lt; 1 yr</span>
          </div>
          <div class="upsell-existing-products">
            <span class="upsell-prod-chip ins-pend">Term Life $250K (Pending)</span>
          </div>
          <div class="upsell-tracks-row">
            <div class="upsell-track-item ret"><i class="fas fa-umbrella"></i><span>Retirement</span><span class="upsell-track-status missing">Not Started</span></div>
            <div class="upsell-track-item inv-na"><i class="fas fa-chart-pie"></i><span>Investment</span><span class="upsell-track-status na">Future</span></div>
            <div class="upsell-track-item wlth-na"><i class="fas fa-gem"></i><span>Wealth Mgmt</span><span class="upsell-track-status na">Future</span></div>
          </div>
          <div class="upsell-card-footer">
            <div class="upsell-value-est"><span class="upsell-val-num">$50K</span><span class="upsell-val-lbl">Est. Upsell Value</span></div>
            <button class="upsell-brief-btn" onclick="event.stopPropagation();openUpsellBriefModal('UC008')"><i class="fas fa-paper-plane"></i> Brief</button>
          </div>
        </div>

      </div>{/* end upsell-grid */}

      {/* ── Upsell Detail Modal ── */}
      <div class="upsell-modal-overlay" id="upsell-modal-overlay" style="display:none" onclick="if(event.target===this)closeUpsellModal()">
        <div class="upsell-modal" id="upsell-modal">
          <div class="upsell-modal-header" id="upsell-modal-header">
            <button class="upsell-modal-close" onclick="closeUpsellModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="upsell-modal-tabs" id="upsell-modal-tabs">
            <button class="upsell-tab active" onclick="switchUpsellTab('overview')">Overview</button>
            <button class="upsell-tab" onclick="switchUpsellTab('retirement')"><i class="fas fa-umbrella"></i> Retirement</button>
            <button class="upsell-tab" onclick="switchUpsellTab('investment')"><i class="fas fa-chart-pie"></i> Investment</button>
            <button class="upsell-tab" onclick="switchUpsellTab('wealth')"><i class="fas fa-gem"></i> Wealth</button>
            <button class="upsell-tab" onclick="switchUpsellTab('ai-brief')"><i class="fas fa-robot"></i> AI Brief</button>
          </div>
          <div class="upsell-modal-body" id="upsell-modal-body"></div>
          <div class="upsell-modal-footer" id="upsell-modal-footer">
            <button class="btn btn-outline" onclick="closeUpsellModal()">Close</button>
            <button class="btn btn-ai" onclick="openUpsellBriefModal(_currentUpsellId)"><i class="fas fa-paper-plane"></i> Generate Outreach Brief</button>
          </div>
        </div>
      </div>

      {/* ── AI Brief / Outreach Modal ── */}
      <div class="upsell-brief-overlay" id="upsell-brief-overlay" style="display:none" onclick="if(event.target===this)closeUpsellBriefModal()">
        <div class="upsell-brief-modal" id="upsell-brief-modal">
          <div class="upsell-brief-header">
            <h3><i class="fas fa-robot"></i> AI Upsell Outreach Brief</h3>
            <button class="upsell-modal-close" onclick="closeUpsellBriefModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="upsell-brief-body" id="upsell-brief-body"></div>
          <div class="upsell-brief-footer">
            <button class="btn btn-outline" onclick="closeUpsellBriefModal()">Close</button>
            <button class="btn btn-secondary" onclick="copyUpsellBrief()"><i class="fas fa-copy"></i> Copy Brief</button>
            <button class="btn btn-primary" onclick="scheduleUpsellMeeting()"><i class="fas fa-calendar-plus"></i> Schedule Meeting</button>
          </div>
        </div>
      </div>

    </div>
  )
}

function ProspectsPage() {
  return (
    <div class="page prospects-page">

      {/* ── Header ── */}
      <div class="prospects-header">
        <div class="ph-left">
          <h2 class="ph-title"><i class="fas fa-user-clock"></i> Leads Pipeline</h2>
          <p class="ph-sub">14 active leads · AI-scored · 3rd-party data enriched · $284K pipeline value</p>
        </div>
        <div class="ph-actions">
          <button class="btn btn-ai" onclick="openProspectAIAnalysis()"><i class="fas fa-robot"></i> AI Lead Score All</button>
          <button class="btn btn-primary" onclick="openAddProspectModal()"><i class="fas fa-plus"></i> Add Lead</button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div class="prosp-kpi-strip">
        <div class="prosp-kpi" onclick="filterProspects('all')" style="cursor:pointer">
          <div class="prosp-kpi-icon" style="background:#eff6ff;color:#003087"><i class="fas fa-users"></i></div>
          <div class="prosp-kpi-body"><div class="prosp-kpi-val">14</div><div class="prosp-kpi-lbl">Total Leads</div></div>
        </div>
        <div class="prosp-kpi" onclick="filterProspects('hot')" style="cursor:pointer">
          <div class="prosp-kpi-icon" style="background:#fef3c7;color:#d97706"><i class="fas fa-fire"></i></div>
          <div class="prosp-kpi-body"><div class="prosp-kpi-val">5</div><div class="prosp-kpi-lbl">Hot (Score 80+)</div></div>
        </div>
        <div class="prosp-kpi" onclick="filterProspects('contacted')" style="cursor:pointer">
          <div class="prosp-kpi-icon" style="background:#ecfdf5;color:#059669"><i class="fas fa-phone-alt"></i></div>
          <div class="prosp-kpi-body"><div class="prosp-kpi-val">9</div><div class="prosp-kpi-lbl">Contacted</div></div>
        </div>
        <div class="prosp-kpi" onclick="filterProspects('new')" style="cursor:pointer">
          <div class="prosp-kpi-icon" style="background:#f5f3ff;color:#7c3aed"><i class="fas fa-user-plus"></i></div>
          <div class="prosp-kpi-body"><div class="prosp-kpi-val">3</div><div class="prosp-kpi-lbl">New This Week</div></div>
        </div>
        <div class="prosp-kpi">
          <div class="prosp-kpi-icon" style="background:#fff7ed;color:#ea580c"><i class="fas fa-dollar-sign"></i></div>
          <div class="prosp-kpi-body"><div class="prosp-kpi-val">$284K</div><div class="prosp-kpi-lbl">Pipeline Value</div></div>
        </div>
        <div class="prosp-kpi">
          <div class="prosp-kpi-icon" style="background:#fdf2f8;color:#9d174d"><i class="fas fa-chart-line"></i></div>
          <div class="prosp-kpi-body"><div class="prosp-kpi-val">68%</div><div class="prosp-kpi-lbl">Avg Close Prob</div></div>
        </div>
      </div>

      {/* ── AI Workflow Guidance Banner (Phase 1–2) ── */}
      <div class="prosp-workflow-strip">
        <div class="prosp-wf-step active" onclick="navigateTo('campaigns')">
          <div class="prosp-wf-num">1</div>
          <div class="prosp-wf-body"><div class="prosp-wf-title">Campaigns</div><div class="prosp-wf-sub">Generate leads</div></div>
          <i class="fas fa-chevron-right prosp-wf-arrow"></i>
        </div>
        <div class="prosp-wf-step active" onclick="navigateTo('prospects')">
          <div class="prosp-wf-num">2</div>
          <div class="prosp-wf-body"><div class="prosp-wf-title">Qualify Lead</div><div class="prosp-wf-sub">AI score + PMAIL</div></div>
          <i class="fas fa-chevron-right prosp-wf-arrow"></i>
        </div>
        <div class="prosp-wf-step" onclick="navigateTo('fna')">
          <div class="prosp-wf-num">3</div>
          <div class="prosp-wf-body"><div class="prosp-wf-title">FNA Discovery</div><div class="prosp-wf-sub">Fact-find + gap analysis</div></div>
          <i class="fas fa-chevron-right prosp-wf-arrow"></i>
        </div>
        <div class="prosp-wf-step" onclick="navigateTo('products')">
          <div class="prosp-wf-num">4</div>
          <div class="prosp-wf-body"><div class="prosp-wf-title">Illustration</div><div class="prosp-wf-sub">Product + proposal</div></div>
          <i class="fas fa-chevron-right prosp-wf-arrow"></i>
        </div>
        <div class="prosp-wf-step" onclick="navigateTo('opportunities')">
          <div class="prosp-wf-num">5</div>
          <div class="prosp-wf-body"><div class="prosp-wf-title">Opportunity</div><div class="prosp-wf-sub">Submit E-App</div></div>
        </div>
      </div>

      {/* ── AI Intel Banner ── */}
      <div class="prosp-ai-banner">
        <div class="prosp-ai-banner-left">
          <i class="fas fa-brain prosp-ai-icon"></i>
          <div>
            <div class="prosp-ai-title">AI Prospect Intelligence <span class="prosp-ai-live">LIVE</span></div>
            <div class="prosp-ai-sub">3rd-party enrichment active: Wealth Data · Business Registry · Credit Signals · Social Footprint · Life Events · Public Records</div>
          </div>
        </div>
        <div class="prosp-ai-chips">
          <span class="prosp-ai-chip red"><i class="fas fa-exclamation-circle"></i> 2 Need Immediate Action</span>
          <span class="prosp-ai-chip amber"><i class="fas fa-clock"></i> 4 Meetings This Week</span>
          <span class="prosp-ai-chip green"><i class="fas fa-trophy"></i> 3 Ready to Convert</span>
        </div>
        <button class="prosp-fna-btn" onclick="openNewFNA()"><i class="fas fa-clipboard-list"></i> Start FNA</button>
      </div>

      {/* ── Toolbar ── */}
      <div class="prosp-toolbar">
        <div class="prosp-tb-left">
          <div class="prosp-search">
            <i class="fas fa-search"></i>
            <input type="text" id="prospect-search" placeholder="Search leads..." oninput="filterProspectCards()" />
          </div>
          <select class="prosp-select" id="prosp-stage-filter" onchange="filterProspectCards()">
            <option value="">All Stages</option>
            <option value="New Lead">New Lead</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Meeting Scheduled">Meeting Scheduled</option>
            <option value="Negotiating">Negotiating</option>
          </select>
          <select class="prosp-select" id="prosp-product-filter" onchange="filterProspectCards()">
            <option value="">All Products</option>
            <option value="Whole Life">Whole Life</option>
            <option value="Term Life">Term Life</option>
            <option value="Universal Life">Universal Life</option>
            <option value="Annuity">Annuity</option>
            <option value="Disability">Disability</option>
            <option value="Advisory">Advisory</option>
            <option value="529 Plan">529 Plan</option>
          </select>
          <select class="prosp-select" id="prosp-score-filter" onchange="filterProspectCards()">
            <option value="">All Scores</option>
            <option value="hot">Hot (80+)</option>
            <option value="warm">Warm (50–79)</option>
            <option value="cold">Cold (&lt;50)</option>
          </select>
        </div>
        <div class="prosp-tb-right">
          <span class="prosp-count-lbl" id="prosp-count-lbl">Showing 14 leads</span>
        </div>
      </div>

      {/* ── Prospect Cards Grid ── */}
      <div class="prosp-grid" id="prosp-grid">

        {/* P001 — Alex Rivera (Hot) */}
        <div class="prosp-card" data-id="P001" data-stage="Meeting Scheduled" data-product="Whole Life" data-score="82" onclick="openProspectModal('P001')" style="cursor:pointer">
          <div class="prosp-card-top">
            <div class="prosp-avatar prosp-av-ar">AR</div>
            <div class="prosp-card-meta">
              <div class="prosp-name">Alex Rivera</div>
              <div class="prosp-role">Executive · Age 34 · Manhattan</div>
            </div>
            <div class="prosp-score-badge hot">82</div>
          </div>
          <div class="prosp-stage-row">
            <span class="prosp-stage-pill meeting">Meeting Scheduled</span>
            <span class="prosp-days-lbl"><i class="fas fa-calendar-alt"></i> Apr 12</span>
          </div>
          <div class="prosp-product-interest">
            <span class="prosp-prod-chip ins">Whole Life $500K</span>
          </div>
          <div class="prosp-third-party-row">
            <span class="prosp-tp-chip" title="Wealth Data"><i class="fas fa-gem"></i> $340K Net Worth</span>
            <span class="prosp-tp-chip" title="Credit Signal"><i class="fas fa-star"></i> 760 Credit</span>
          </div>
                    <div class="prosp-camp-source-row">
            <span class="prosp-camp-tag" style="background:#6b728018;color:#6b7280;border:1px solid #6b728040"><i class="fas fa-user-friends"></i> Organic — Referral</span>
          </div>
          <div class="prosp-card-footer">
            <span class="prosp-value">$4,200/yr</span>
            <button class="prosp-convert-btn" onclick="event.stopPropagation();convertProspectToClient('P001')"><i class="fas fa-funnel-dollar"></i> Move to Sales Pipeline</button>
          </div>
        </div>

        {/* P002 — Nancy Foster (Warm) */}
        <div class="prosp-card" data-id="P002" data-stage="Proposal Sent" data-product="Term Life" data-score="61" onclick="openProspectModal('P002')" style="cursor:pointer">
          <div class="prosp-card-top">
            <div class="prosp-avatar prosp-av-nf">NF</div>
            <div class="prosp-card-meta">
              <div class="prosp-name">Nancy Foster</div>
              <div class="prosp-role">Healthcare Director · Age 41 · Brooklyn</div>
            </div>
            <div class="prosp-score-badge warm">61</div>
          </div>
          <div class="prosp-stage-row">
            <span class="prosp-stage-pill proposal">Proposal Sent</span>
            <span class="prosp-days-lbl"><i class="fas fa-clock"></i> 11d ago</span>
          </div>
          <div class="prosp-product-interest">
            <span class="prosp-prod-chip ins">Term Life $1M</span>
            <span class="prosp-prod-chip ins">LTC Rider</span>
          </div>
          <div class="prosp-third-party-row">
            <span class="prosp-tp-chip" title="Wealth Data"><i class="fas fa-gem"></i> $620K Net Worth</span>
            <span class="prosp-tp-chip" title="Life Event"><i class="fas fa-home"></i> New Home Mar 31</span>
          </div>
                    <div class="prosp-camp-source-row">
            <span class="prosp-camp-tag" style="background:#f59e0b18;color:#f59e0b;border:1px solid #f59e0b40"><i class="fas fa-shield-alt"></i> Term Life — Young Families</span>
          </div>
          <div class="prosp-card-footer">
            <span class="prosp-value">$3,600/yr</span>
            <button class="prosp-convert-btn" onclick="event.stopPropagation();convertProspectToClient('P002')"><i class="fas fa-funnel-dollar"></i> Move to Sales Pipeline</button>
          </div>
        </div>

        {/* P003 — John Kim (Cold - Stale) */}
        <div class="prosp-card prosp-card-stale" data-id="P003" data-stage="Contacted" data-product="Disability" data-score="44" onclick="openProspectModal('P003')" style="cursor:pointer">
          <div class="prosp-card-top">
            <div class="prosp-avatar prosp-av-jk">JK</div>
            <div class="prosp-card-meta">
              <div class="prosp-name">John Kim</div>
              <div class="prosp-role">Tech Engineer · Age 38 · Jersey City</div>
            </div>
            <div class="prosp-score-badge cold">44</div>
          </div>
          <div class="prosp-stage-row">
            <span class="prosp-stage-pill contacted">Contacted</span>
            <span class="prosp-days-lbl stale"><i class="fas fa-exclamation-triangle"></i> 15d stale</span>
          </div>
          <div class="prosp-product-interest">
            <span class="prosp-prod-chip ins">Disability $8K/mo</span>
          </div>
          <div class="prosp-third-party-row">
            <span class="prosp-tp-chip" title="Credit Signal"><i class="fas fa-star"></i> 690 Credit</span>
            <span class="prosp-tp-chip" title="Income Data"><i class="fas fa-briefcase"></i> $185K Income</span>
          </div>
                    <div class="prosp-camp-source-row">
            <span class="prosp-camp-tag" style="background:#00308718;color:#003087;border:1px solid #00308740"><i class="fas fa-heart"></i> Whole Life Protection</span>
          </div>
          <div class="prosp-card-footer">
            <span class="prosp-value">$2,400/yr</span>
            <button class="prosp-convert-btn" onclick="event.stopPropagation();convertProspectToClient('P003')"><i class="fas fa-funnel-dollar"></i> Move to Sales Pipeline</button>
          </div>
        </div>

        {/* P004 — Michael Santos (Hot) */}
        <div class="prosp-card" data-id="P004" data-stage="Negotiating" data-product="Universal Life" data-score="91" onclick="openProspectModal('P004')" style="cursor:pointer">
          <div class="prosp-card-top">
            <div class="prosp-avatar prosp-av-ms">MS</div>
            <div class="prosp-card-meta">
              <div class="prosp-name">Michael Santos</div>
              <div class="prosp-role">Business Owner · Age 47 · Queens</div>
            </div>
            <div class="prosp-score-badge hot">91</div>
          </div>
          <div class="prosp-stage-row">
            <span class="prosp-stage-pill negotiating">Negotiating</span>
            <span class="prosp-days-lbl"><i class="fas fa-fire"></i> Close 3d</span>
          </div>
          <div class="prosp-product-interest">
            <span class="prosp-prod-chip ins">Universal Life $750K</span>
            <span class="prosp-prod-chip adv">NQDC Plan</span>
          </div>
          <div class="prosp-third-party-row">
            <span class="prosp-tp-chip" title="Business Data"><i class="fas fa-building"></i> LLC Est. $2.4M</span>
            <span class="prosp-tp-chip" title="Wealth Data"><i class="fas fa-gem"></i> $1.8M Net Worth</span>
          </div>
                    <div class="prosp-camp-source-row">
            <span class="prosp-camp-tag" style="background:#6b728018;color:#6b7280;border:1px solid #6b728040"><i class="fas fa-user-friends"></i> Organic — Referral</span>
          </div>
          <div class="prosp-card-footer">
            <span class="prosp-value">$6,800/yr</span>
            <button class="prosp-convert-btn" onclick="event.stopPropagation();convertProspectToClient('P004')"><i class="fas fa-funnel-dollar"></i> Move to Sales Pipeline</button>
          </div>
        </div>

        {/* P005 — Julia Chen (Warm) */}
        <div class="prosp-card" data-id="P005" data-stage="Proposal Sent" data-product="Annuity" data-score="58" onclick="openProspectModal('P005')" style="cursor:pointer">
          <div class="prosp-card-top">
            <div class="prosp-avatar prosp-av-jc">JC</div>
            <div class="prosp-card-meta">
              <div class="prosp-name">Julia Chen</div>
              <div class="prosp-role">Retired Professor · Age 58 · Hoboken</div>
            </div>
            <div class="prosp-score-badge warm">58</div>
          </div>
          <div class="prosp-stage-row">
            <span class="prosp-stage-pill proposal">Proposal Sent</span>
            <span class="prosp-days-lbl stale"><i class="fas fa-clock"></i> 11d no reply</span>
          </div>
          <div class="prosp-product-interest">
            <span class="prosp-prod-chip ret">Fixed Annuity $120K</span>
            <span class="prosp-prod-chip ret">Income Annuity</span>
          </div>
          <div class="prosp-third-party-row">
            <span class="prosp-tp-chip" title="Wealth Data"><i class="fas fa-gem"></i> $890K Net Worth</span>
            <span class="prosp-tp-chip" title="Pension Data"><i class="fas fa-umbrella-beach"></i> Pension $4.2K/mo</span>
          </div>
                    <div class="prosp-camp-source-row">
            <span class="prosp-camp-tag" style="background:#7c3aed18;color:#7c3aed;border:1px solid #7c3aed40"><i class="fas fa-chart-line"></i> Retirement Income — Annuity</span>
          </div>
          <div class="prosp-card-footer">
            <span class="prosp-value">$9,600/yr</span>
            <button class="prosp-convert-btn" onclick="event.stopPropagation();convertProspectToClient('P005')"><i class="fas fa-funnel-dollar"></i> Move to Sales Pipeline</button>
          </div>
        </div>

        {/* P006 — Grace Lee (Warm) */}
        <div class="prosp-card" data-id="P006" data-stage="Qualified" data-product="Whole Life" data-score="73" onclick="openProspectModal('P006')" style="cursor:pointer">
          <div class="prosp-card-top">
            <div class="prosp-avatar prosp-av-gl">GL</div>
            <div class="prosp-card-meta">
              <div class="prosp-name">Grace Lee</div>
              <div class="prosp-role">Physician · Age 44 · Westchester</div>
            </div>
            <div class="prosp-score-badge warm">73</div>
          </div>
          <div class="prosp-stage-row">
            <span class="prosp-stage-pill qualified">Qualified</span>
            <span class="prosp-days-lbl"><i class="fas fa-stethoscope"></i> UW In Progress</span>
          </div>
          <div class="prosp-product-interest">
            <span class="prosp-prod-chip ins">Whole Life $1M</span>
            <span class="prosp-prod-chip adv">Estate Planning</span>
          </div>
          <div class="prosp-third-party-row">
            <span class="prosp-tp-chip" title="Income Data"><i class="fas fa-briefcase"></i> $390K Income</span>
            <span class="prosp-tp-chip" title="Wealth Data"><i class="fas fa-gem"></i> $2.1M Net Worth</span>
          </div>
                    <div class="prosp-camp-source-row">
            <span class="prosp-camp-tag" style="background:#0d948818;color:#0d9488;border:1px solid #0d948840"><i class="fas fa-gem"></i> Wealth Management — HNW</span>
          </div>
          <div class="prosp-card-footer">
            <span class="prosp-value">$14,400/yr</span>
            <button class="prosp-convert-btn" onclick="event.stopPropagation();convertProspectToClient('P006')"><i class="fas fa-funnel-dollar"></i> Move to Sales Pipeline</button>
          </div>
        </div>

        {/* P007 — Rachel Adams (New Lead) */}
        <div class="prosp-card prosp-card-new" data-id="P007" data-stage="New Lead" data-product="Term Life" data-score="55" onclick="openProspectModal('P007')" style="cursor:pointer">
          <div class="prosp-card-top">
            <div class="prosp-avatar prosp-av-ra">RA</div>
            <div class="prosp-card-meta">
              <div class="prosp-name">Rachel Adams</div>
              <div class="prosp-role">Software Engineer · Age 29 · Hoboken</div>
            </div>
            <div class="prosp-score-badge warm">55</div>
          </div>
          <div class="prosp-stage-row">
            <span class="prosp-stage-pill new-lead">New Lead</span>
            <span class="prosp-days-lbl new"><i class="fas fa-star"></i> Added Apr 9</span>
          </div>
          <div class="prosp-product-interest">
            <span class="prosp-prod-chip ins">Term Life $500K</span>
            <span class="prosp-prod-chip inv">529 Plan</span>
          </div>
          <div class="prosp-third-party-row">
            <span class="prosp-tp-chip" title="Life Event"><i class="fas fa-baby"></i> New Baby Mar 2026</span>
            <span class="prosp-tp-chip" title="Credit Signal"><i class="fas fa-star"></i> 730 Credit</span>
          </div>
                    <div class="prosp-camp-source-row">
            <span class="prosp-camp-tag" style="background:#f59e0b18;color:#f59e0b;border:1px solid #f59e0b40"><i class="fas fa-shield-alt"></i> Term Life — Young Families</span>
          </div>
          <div class="prosp-card-footer">
            <span class="prosp-value">$2,800/yr</span>
            <button class="prosp-convert-btn" onclick="event.stopPropagation();convertProspectToClient('P007')"><i class="fas fa-funnel-dollar"></i> Move to Sales Pipeline</button>
          </div>
        </div>

        {/* P008 — Thomas Wright (Hot) */}
        <div class="prosp-card" data-id="P008" data-stage="Meeting Scheduled" data-product="Universal Life" data-score="84" onclick="openProspectModal('P008')" style="cursor:pointer">
          <div class="prosp-card-top">
            <div class="prosp-avatar prosp-av-tw">TW</div>
            <div class="prosp-card-meta">
              <div class="prosp-name">Thomas Wright</div>
              <div class="prosp-role">CFO · Age 52 · Manhattan</div>
            </div>
            <div class="prosp-score-badge hot">84</div>
          </div>
          <div class="prosp-stage-row">
            <span class="prosp-stage-pill meeting">Meeting Scheduled</span>
            <span class="prosp-days-lbl"><i class="fas fa-calendar-alt"></i> Apr 15</span>
          </div>
          <div class="prosp-product-interest">
            <span class="prosp-prod-chip ins">UL $1M</span>
            <span class="prosp-prod-chip ret">Income Annuity</span>
            <span class="prosp-prod-chip adv">Estate Review</span>
          </div>
          <div class="prosp-third-party-row">
            <span class="prosp-tp-chip" title="Wealth Data"><i class="fas fa-gem"></i> $3.8M Net Worth</span>
            <span class="prosp-tp-chip" title="Business Data"><i class="fas fa-building"></i> C-Suite Executive</span>
          </div>
                    <div class="prosp-camp-source-row">
            <span class="prosp-camp-tag" style="background:#0d948818;color:#0d9488;border:1px solid #0d948840"><i class="fas fa-gem"></i> Wealth Management — HNW</span>
          </div>
          <div class="prosp-card-footer">
            <span class="prosp-value">$18,000/yr</span>
            <button class="prosp-convert-btn" onclick="event.stopPropagation();convertProspectToClient('P008')"><i class="fas fa-funnel-dollar"></i> Move to Sales Pipeline</button>
          </div>
        </div>

        {/* P009 — Linda Chen (Warm) */}
        <div class="prosp-card" data-id="P009" data-stage="Contacted" data-product="Advisory" data-score="67" onclick="openProspectModal('P009')" style="cursor:pointer">
          <div class="prosp-card-top">
            <div class="prosp-avatar prosp-av-lc">LC</div>
            <div class="prosp-card-meta">
              <div class="prosp-name">Linda Chen</div>
              <div class="prosp-role">Attorney · Age 45 · Upper West Side</div>
            </div>
            <div class="prosp-score-badge warm">67</div>
          </div>
          <div class="prosp-stage-row">
            <span class="prosp-stage-pill contacted">Contacted</span>
            <span class="prosp-days-lbl"><i class="fas fa-user"></i> Referred by R. Chen</span>
          </div>
          <div class="prosp-product-interest">
            <span class="prosp-prod-chip adv">Estate Planning</span>
            <span class="prosp-prod-chip ins">Whole Life $500K</span>
          </div>
          <div class="prosp-third-party-row">
            <span class="prosp-tp-chip" title="Wealth Data"><i class="fas fa-gem"></i> $1.1M Net Worth</span>
            <span class="prosp-tp-chip" title="Public Records"><i class="fas fa-gavel"></i> Trust Filed 2024</span>
          </div>
                    <div class="prosp-camp-source-row">
            <span class="prosp-camp-tag" style="background:#6b728018;color:#6b7280;border:1px solid #6b728040"><i class="fas fa-user-friends"></i> Organic — Referral</span>
          </div>
          <div class="prosp-card-footer">
            <span class="prosp-value">$8,200/yr</span>
            <button class="prosp-convert-btn" onclick="event.stopPropagation();convertProspectToClient('P009')"><i class="fas fa-funnel-dollar"></i> Move to Sales Pipeline</button>
          </div>
        </div>

        {/* P010 — Marcus Johnson (Hot) */}
        <div class="prosp-card" data-id="P010" data-stage="Qualified" data-product="Whole Life" data-score="88" onclick="openProspectModal('P010')" style="cursor:pointer">
          <div class="prosp-card-top">
            <div class="prosp-avatar prosp-av-mj">MJ</div>
            <div class="prosp-card-meta">
              <div class="prosp-name">Marcus Johnson</div>
              <div class="prosp-role">Entrepreneur · Age 39 · Fort Lee, NJ</div>
            </div>
            <div class="prosp-score-badge hot">88</div>
          </div>
          <div class="prosp-stage-row">
            <span class="prosp-stage-pill qualified">Qualified</span>
            <span class="prosp-days-lbl"><i class="fas fa-bolt"></i> Ready to Close</span>
          </div>
          <div class="prosp-product-interest">
            <span class="prosp-prod-chip ins">Whole Life $750K</span>
            <span class="prosp-prod-chip inv">Mutual Funds</span>
          </div>
          <div class="prosp-third-party-row">
            <span class="prosp-tp-chip" title="Business Data"><i class="fas fa-building"></i> 2 LLCs Active</span>
            <span class="prosp-tp-chip" title="Wealth Data"><i class="fas fa-gem"></i> $2.6M Net Worth</span>
          </div>
                    <div class="prosp-camp-source-row">
            <span class="prosp-camp-tag" style="background:#00308718;color:#003087;border:1px solid #00308740"><i class="fas fa-heart"></i> Whole Life Protection</span>
          </div>
          <div class="prosp-card-footer">
            <span class="prosp-value">$9,000/yr</span>
            <button class="prosp-convert-btn" onclick="event.stopPropagation();convertProspectToClient('P010')"><i class="fas fa-funnel-dollar"></i> Move to Sales Pipeline</button>
          </div>
        </div>

        {/* P011 — Priya Patel (New Lead) */}
        <div class="prosp-card prosp-card-new" data-id="P011" data-stage="New Lead" data-product="Disability" data-score="51" onclick="openProspectModal('P011')" style="cursor:pointer">
          <div class="prosp-card-top">
            <div class="prosp-avatar prosp-av-pp">PP</div>
            <div class="prosp-card-meta">
              <div class="prosp-name">Priya Patel</div>
              <div class="prosp-role">Dentist · Age 33 · Parsippany, NJ</div>
            </div>
            <div class="prosp-score-badge warm">51</div>
          </div>
          <div class="prosp-stage-row">
            <span class="prosp-stage-pill new-lead">New Lead</span>
            <span class="prosp-days-lbl new"><i class="fas fa-star"></i> Added Apr 10</span>
          </div>
          <div class="prosp-product-interest">
            <span class="prosp-prod-chip ins">Disability $12K/mo</span>
            <span class="prosp-prod-chip inv">SEP-IRA</span>
          </div>
          <div class="prosp-third-party-row">
            <span class="prosp-tp-chip" title="Business Data"><i class="fas fa-tooth"></i> Solo Practice Est. $480K</span>
            <span class="prosp-tp-chip" title="Credit Signal"><i class="fas fa-star"></i> 780 Credit</span>
          </div>
                    <div class="prosp-camp-source-row">
            <span class="prosp-camp-tag" style="background:#00308718;color:#003087;border:1px solid #00308740"><i class="fas fa-heart"></i> Whole Life Protection</span>
          </div>
          <div class="prosp-card-footer">
            <span class="prosp-value">$4,800/yr</span>
            <button class="prosp-convert-btn" onclick="event.stopPropagation();convertProspectToClient('P011')"><i class="fas fa-funnel-dollar"></i> Move to Sales Pipeline</button>
          </div>
        </div>

        {/* P012 — Derek Walton (Warm) */}
        <div class="prosp-card" data-id="P012" data-stage="Contacted" data-product="Annuity" data-score="63" onclick="openProspectModal('P012')" style="cursor:pointer">
          <div class="prosp-card-top">
            <div class="prosp-avatar prosp-av-dw">DW</div>
            <div class="prosp-card-meta">
              <div class="prosp-name">Derek Walton</div>
              <div class="prosp-role">VP Finance · Age 55 · Staten Island</div>
            </div>
            <div class="prosp-score-badge warm">63</div>
          </div>
          <div class="prosp-stage-row">
            <span class="prosp-stage-pill contacted">Contacted</span>
            <span class="prosp-days-lbl"><i class="fas fa-clock"></i> Follow-up Due</span>
          </div>
          <div class="prosp-product-interest">
            <span class="prosp-prod-chip ret">Deferred Annuity</span>
            <span class="prosp-prod-chip ins">LTC Insurance</span>
          </div>
          <div class="prosp-third-party-row">
            <span class="prosp-tp-chip" title="Pension Data"><i class="fas fa-umbrella-beach"></i> 401(k) $580K</span>
            <span class="prosp-tp-chip" title="Wealth Data"><i class="fas fa-gem"></i> $1.5M Net Worth</span>
          </div>
                    <div class="prosp-camp-source-row">
            <span class="prosp-camp-tag" style="background:#7c3aed18;color:#7c3aed;border:1px solid #7c3aed40"><i class="fas fa-chart-line"></i> Retirement Income — Annuity</span>
          </div>
          <div class="prosp-card-footer">
            <span class="prosp-value">$7,200/yr</span>
            <button class="prosp-convert-btn" onclick="event.stopPropagation();convertProspectToClient('P012')"><i class="fas fa-funnel-dollar"></i> Move to Sales Pipeline</button>
          </div>
        </div>

        {/* P013 — Sophia Reyes (Hot) */}
        <div class="prosp-card" data-id="P013" data-stage="Meeting Scheduled" data-product="529 Plan" data-score="80" onclick="openProspectModal('P013')" style="cursor:pointer">
          <div class="prosp-card-top">
            <div class="prosp-avatar prosp-av-sr">SR</div>
            <div class="prosp-card-meta">
              <div class="prosp-name">Sophia Reyes</div>
              <div class="prosp-role">Marketing Director · Age 36 · Bronx</div>
            </div>
            <div class="prosp-score-badge hot">80</div>
          </div>
          <div class="prosp-stage-row">
            <span class="prosp-stage-pill meeting">Meeting Scheduled</span>
            <span class="prosp-days-lbl"><i class="fas fa-calendar-alt"></i> Apr 14</span>
          </div>
          <div class="prosp-product-interest">
            <span class="prosp-prod-chip inv">529 Plan</span>
            <span class="prosp-prod-chip ins">Term Life $600K</span>
          </div>
          <div class="prosp-third-party-row">
            <span class="prosp-tp-chip" title="Life Event"><i class="fas fa-graduation-cap"></i> Child Age 2</span>
            <span class="prosp-tp-chip" title="Income Data"><i class="fas fa-briefcase"></i> $165K Income</span>
          </div>
                    <div class="prosp-camp-source-row">
            <span class="prosp-camp-tag" style="background:#10b98118;color:#10b981;border:1px solid #10b98140"><i class="fas fa-seedling"></i> Investment Portfolio — Mid-Market</span>
          </div>
          <div class="prosp-card-footer">
            <span class="prosp-value">$3,400/yr</span>
            <button class="prosp-convert-btn" onclick="event.stopPropagation();convertProspectToClient('P013')"><i class="fas fa-funnel-dollar"></i> Move to Sales Pipeline</button>
          </div>
        </div>

        {/* P014 — James Okafor (New Lead) */}
        <div class="prosp-card prosp-card-new" data-id="P014" data-stage="New Lead" data-product="Whole Life" data-score="48" onclick="openProspectModal('P014')" style="cursor:pointer">
          <div class="prosp-card-top">
            <div class="prosp-avatar prosp-av-jo">JO</div>
            <div class="prosp-card-meta">
              <div class="prosp-name">James Okafor</div>
              <div class="prosp-role">Real Estate Developer · Age 48 · Newark, NJ</div>
            </div>
            <div class="prosp-score-badge cold">48</div>
          </div>
          <div class="prosp-stage-row">
            <span class="prosp-stage-pill new-lead">New Lead</span>
            <span class="prosp-days-lbl new"><i class="fas fa-star"></i> Added Apr 8</span>
          </div>
          <div class="prosp-product-interest">
            <span class="prosp-prod-chip ins">Whole Life $1M</span>
            <span class="prosp-prod-chip adv">Business Succession</span>
          </div>
          <div class="prosp-third-party-row">
            <span class="prosp-tp-chip" title="Business Data"><i class="fas fa-building"></i> 3 Properties $4.2M</span>
            <span class="prosp-tp-chip" title="Public Records"><i class="fas fa-file-alt"></i> LLC Filing Apr 2026</span>
          </div>
                    <div class="prosp-camp-source-row">
            <span class="prosp-camp-tag" style="background:#0d948818;color:#0d9488;border:1px solid #0d948840"><i class="fas fa-gem"></i> Wealth Management — HNW</span>
          </div>
          <div class="prosp-card-footer">
            <span class="prosp-value">$12,000/yr</span>
            <button class="prosp-convert-btn" onclick="event.stopPropagation();convertProspectToClient('P014')"><i class="fas fa-funnel-dollar"></i> Move to Sales Pipeline</button>
          </div>
        </div>

      </div>{/* end prosp-grid */}

      {/* ── Prospect Detail Modal ── */}
      <div class="prosp-modal-overlay" id="prosp-modal-overlay" onclick="closeProspectModal(event)" style="display:none">
        <div class="prosp-modal" id="prosp-modal" onclick="event.stopPropagation()">
          <button class="prosp-modal-close" onclick="closeProspectModal()"><i class="fas fa-times"></i></button>
          <div class="prosp-modal-header" id="prosp-modal-header"></div>
          <div class="prosp-modal-tabs" id="prosp-modal-tabs">
            <button class="pmt active" data-tab="overview"   onclick="switchProspectTab('overview',this)"><i class="fas fa-user"></i> Overview</button>
            <button class="pmt" data-tab="thirdparty"         onclick="switchProspectTab('thirdparty',this)"><i class="fas fa-satellite-dish"></i> 3rd-Party Intel</button>
            <button class="pmt" data-tab="financial"          onclick="switchProspectTab('financial',this)"><i class="fas fa-chart-pie"></i> Financial Health</button>
            <button class="pmt" data-tab="goals"              onclick="switchProspectTab('goals',this)"><i class="fas fa-bullseye"></i> Goals</button>
            <button class="pmt" data-tab="products"           onclick="switchProspectTab('products',this)"><i class="fas fa-box-open"></i> Product Fit</button>
            <button class="pmt" data-tab="planning"           onclick="switchProspectTab('planning',this)"><i class="fas fa-drafting-compass"></i> Financial Plan</button>
            <button class="pmt" data-tab="illust"             onclick="switchProspectTab('illust',this)"><i class="fas fa-chart-area"></i> Illustrations</button>
            <button class="pmt" data-tab="outreach"           onclick="switchProspectTab('outreach',this)"><i class="fas fa-paper-plane"></i> Outreach</button>
            <button class="pmt" data-tab="documents"          onclick="switchProspectTab('documents',this)"><i class="fas fa-folder-open"></i> Documents</button>
            <button class="pmt" data-tab="ai"                 onclick="switchProspectTab('ai',this)"><i class="fas fa-robot"></i> AI Strategy</button>
            <button class="pmt" data-tab="timeline"           onclick="switchProspectTab('timeline',this)"><i class="fas fa-history"></i> Timeline</button>
          </div>
          <div class="prosp-modal-body" id="prosp-modal-body"></div>
          <div class="prosp-modal-footer" id="prosp-modal-footer"></div>
        </div>
      </div>

      {/* ── Convert to Client Modal ── */}
      <div class="prosp-convert-overlay" id="prosp-convert-overlay" style="display:none">
        <div class="prosp-convert-modal">
          <div class="pcm-header">
            <i class="fas fa-funnel-dollar pcm-icon"></i>
            <div>
              <div class="pcm-title">Move to Sales Pipeline</div>
              <div class="pcm-sub" id="pcm-sub">This will create a new deal in the Sales Pipeline at Prospect stage and begin the conversion journey.</div>
            </div>
          </div>
          <div class="pcm-body" id="pcm-body"></div>
          <div class="pcm-footer">
            <button class="btn btn-outline" onclick="document.getElementById('prosp-convert-overlay').style.display='none'">Cancel</button>
            <button class="btn btn-primary" id="pcm-confirm-btn" onclick="confirmProspectConversion()"><i class="fas fa-funnel-dollar"></i> Confirm — Move to Pipeline</button>
          </div>
        </div>
      </div>

    </div>
  )
}

function OpportunitiesPage() {
  return (
    <div class="page opportunities-page">

      {/* ── Header ── */}
      <div class="opp-page-header">
        <div class="opp-header-left">
          <h2 class="opp-page-title"><i class="fas fa-bolt"></i> Opportunities</h2>
          <p class="opp-page-sub">Qualified leads ready to close · AI-scored · linked to Financial Plans &amp; Illustrations</p>
        </div>
        <div class="opp-header-actions">
          <button class="btn btn-ai" onclick="oppAIAnalysis()"><i class="fas fa-robot"></i> AI Score All</button>
          <button class="btn btn-primary" onclick="openAddOppModal()"><i class="fas fa-plus"></i> Add Opportunity</button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div class="opp-kpi-strip" id="opp-kpi-strip">
        <div class="opp-kpi">
          <div class="opp-kpi-icon" style="background:#f5f3ff;color:#7c3aed"><i class="fas fa-bolt"></i></div>
          <div class="opp-kpi-body"><div class="opp-kpi-val" id="opp-kpi-total">5</div><div class="opp-kpi-lbl">Total Opportunities</div></div>
        </div>
        <div class="opp-kpi">
          <div class="opp-kpi-icon" style="background:#fef3c7;color:#d97706"><i class="fas fa-fire"></i></div>
          <div class="opp-kpi-body"><div class="opp-kpi-val" id="opp-kpi-hot">3</div><div class="opp-kpi-lbl">Hot (Score 80+)</div></div>
        </div>
        <div class="opp-kpi">
          <div class="opp-kpi-icon" style="background:#ecfdf5;color:#059669"><i class="fas fa-dollar-sign"></i></div>
          <div class="opp-kpi-body"><div class="opp-kpi-val" id="opp-kpi-value">$142K</div><div class="opp-kpi-lbl">Pipeline Value</div></div>
        </div>
        <div class="opp-kpi">
          <div class="opp-kpi-icon" style="background:#eff6ff;color:#003087"><i class="fas fa-hand-holding-usd"></i></div>
          <div class="opp-kpi-body"><div class="opp-kpi-val" id="opp-kpi-comm">$17.1K</div><div class="opp-kpi-lbl">Est. Commission</div></div>
        </div>
        <div class="opp-kpi">
          <div class="opp-kpi-icon" style="background:#fef2f2;color:#dc2626"><i class="fas fa-clock"></i></div>
          <div class="opp-kpi-body"><div class="opp-kpi-val" id="opp-kpi-closing">2</div><div class="opp-kpi-lbl">Closing This Week</div></div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div class="opp-toolbar">
        <div class="opp-tb-left">
          <div class="opp-search">
            <i class="fas fa-search"></i>
            <input type="text" id="opp-search" placeholder="Search opportunities..." oninput="filterOppCards()" />
          </div>
          <select class="opp-select" id="opp-stage-filter" onchange="filterOppCards()">
            <option value="">All Stages</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Meeting Scheduled">Meeting Scheduled</option>
            <option value="Negotiating">Negotiating</option>
            <option value="Verbal Commit">Verbal Commit</option>
            <option value="App Submitted">App Submitted</option>
          </select>
          <select class="opp-select" id="opp-score-filter" onchange="filterOppCards()">
            <option value="">All Scores</option>
            <option value="hot">Hot (80+)</option>
            <option value="warm">Warm (50-79)</option>
          </select>
        </div>
        <div class="opp-tb-right">
          <span class="opp-count-lbl" id="opp-count-lbl">Showing 5 opportunities</span>
        </div>
      </div>

      {/* ── Opportunity Cards Grid ── */}
      <div class="opp-cards-grid" id="opp-cards-grid">
        {/* Cards rendered by JS */}
      </div>

    </div>
  )
}

function PoliciesPage() {
  return (
    <div class="page policies-page">

      {/* ── Policy KPI Dashboard Bar ── */}
      <div class="policy-kpi-bar">
        <div class="pkpi-card pkpi-blue" onclick="filterPolicies()">
          <div class="pkpi-icon"><i class="fas fa-file-contract"></i></div>
          <div class="pkpi-data">
            <div class="pkpi-val">1,842</div>
            <div class="pkpi-lbl">Total Policies</div>
            <div class="pkpi-sub">+14 this month</div>
          </div>
        </div>
        <div class="pkpi-card pkpi-green">
          <div class="pkpi-icon"><i class="fas fa-dollar-sign"></i></div>
          <div class="pkpi-data">
            <div class="pkpi-val">$487K</div>
            <div class="pkpi-lbl">Monthly Premium</div>
            <div class="pkpi-sub pkpi-up"><i class="fas fa-arrow-up"></i> +12% MoM</div>
          </div>
        </div>
        <div class="pkpi-card pkpi-navy">
          <div class="pkpi-icon"><i class="fas fa-shield-alt"></i></div>
          <div class="pkpi-data">
            <div class="pkpi-val">$412M</div>
            <div class="pkpi-lbl">Total Face Value</div>
            <div class="pkpi-sub">Across all clients</div>
          </div>
        </div>
        <div class="pkpi-card pkpi-orange" onclick="openRenewalCenter()">
          <div class="pkpi-icon"><i class="fas fa-sync-alt"></i></div>
          <div class="pkpi-data">
            <div class="pkpi-val">23</div>
            <div class="pkpi-lbl">Renewals Due (90d)</div>
            <div class="pkpi-sub pkpi-warn">2 urgent — act now</div>
          </div>
        </div>
        <div class="pkpi-card pkpi-red" onclick="openRetentionFullReport()">
          <div class="pkpi-icon"><i class="fas fa-heartbeat"></i></div>
          <div class="pkpi-data">
            <div class="pkpi-val">15</div>
            <div class="pkpi-lbl">Lapse Risk</div>
            <div class="pkpi-sub pkpi-warn">4 high · 11 medium</div>
          </div>
        </div>
        <div class="pkpi-card pkpi-purple" onclick="openNLPReview('all')">
          <div class="pkpi-icon"><i class="fas fa-brain"></i></div>
          <div class="pkpi-data">
            <div class="pkpi-val">94%</div>
            <div class="pkpi-lbl">NLP Accuracy</div>
            <div class="pkpi-sub">2 urgent risks</div>
          </div>
        </div>
        <div class="pkpi-card pkpi-teal">
          <div class="pkpi-icon"><i class="fas fa-piggy-bank"></i></div>
          <div class="pkpi-data">
            <div class="pkpi-val">$312K</div>
            <div class="pkpi-lbl">Cash Value (Total)</div>
            <div class="pkpi-sub">Across whole life</div>
          </div>
        </div>
        <div class="pkpi-card pkpi-gold">
          <div class="pkpi-icon"><i class="fas fa-chart-line"></i></div>
          <div class="pkpi-data">
            <div class="pkpi-val">$31.2K</div>
            <div class="pkpi-lbl">Upsell Potential</div>
            <div class="pkpi-sub pkpi-up"><i class="fas fa-star"></i> 6 opportunities</div>
          </div>
        </div>
      </div>

      {/* ── Portfolio Health Strip ── */}
      <div class="portfolio-health-strip">
        <div class="phs-header">
          <div class="phs-title"><i class="fas fa-chart-pie"></i> Portfolio Composition &amp; Health</div>
          <div class="phs-subtitle">Policy type mix by count and annual premium · as of Apr 2026</div>
        </div>
        <div class="phs-bands">
          <div class="phs-band phs-wl">
            <div class="phs-band-header">
              <i class="fas fa-shield-alt"></i>
              <span>Whole Life</span>
            </div>
            <div class="phs-band-val">847</div>
            <div class="phs-band-bar"><div class="phs-bar-fill phs-fill-wl" style="width:46%"></div></div>
            <div class="phs-band-sub">$218K/mo · 46%</div>
          </div>
          <div class="phs-band phs-tl">
            <div class="phs-band-header">
              <i class="fas fa-clock"></i>
              <span>Term Life</span>
            </div>
            <div class="phs-band-val">523</div>
            <div class="phs-band-bar"><div class="phs-bar-fill phs-fill-tl" style="width:28%"></div></div>
            <div class="phs-band-sub">$136K/mo · 28%</div>
          </div>
          <div class="phs-band phs-ul">
            <div class="phs-band-header">
              <i class="fas fa-infinity"></i>
              <span>Universal Life</span>
            </div>
            <div class="phs-band-val">312</div>
            <div class="phs-band-bar"><div class="phs-bar-fill phs-fill-ul" style="width:17%"></div></div>
            <div class="phs-band-sub">$83K/mo · 17%</div>
          </div>
          <div class="phs-band phs-ltc">
            <div class="phs-band-header">
              <i class="fas fa-heartbeat"></i>
              <span>LTC / Other</span>
            </div>
            <div class="phs-band-val">160</div>
            <div class="phs-band-bar"><div class="phs-bar-fill phs-fill-ltc" style="width:9%"></div></div>
            <div class="phs-band-sub">$49K/mo · 9%</div>
          </div>
          <div class="phs-divider"></div>
          <div class="phs-health-panel">
            <div class="phs-hp-title">Portfolio Health</div>
            <div class="phs-hp-row"><span class="phs-dot green"></span><span>Active</span><strong>93%</strong></div>
            <div class="phs-hp-row"><span class="phs-dot orange"></span><span>Review</span><strong>4%</strong></div>
            <div class="phs-hp-row"><span class="phs-dot red"></span><span>Lapsed</span><strong>3%</strong></div>
            <div class="phs-hp-score">Retention Rate <span class="phs-hp-score-val">93%</span></div>
          </div>
          <div class="phs-action-panel">
            <div class="phs-hp-title">Quick Actions</div>
            <button class="phs-act-btn" onclick="openNLPReview('all')"><i class="fas fa-brain"></i> NLP Scan All</button>
            <button class="phs-act-btn" onclick="openRetentionFullReport()"><i class="fas fa-heartbeat"></i> Lapse Report</button>
            <button class="phs-act-btn" onclick="sendQuickMessage('Show portfolio premium trend for last 12 months')"><i class="fas fa-chart-line"></i> Premium Trend</button>
          </div>
        </div>
      </div>

      <div class="page-toolbar">
        <div class="toolbar-left">
          <div class="search-inline">
            <i class="fas fa-search"></i>
            <input type="text" id="policy-search" placeholder="Search policies, clients..." oninput="filterPolicies()" />
          </div>
          <select class="filter-select" id="policy-type-filter" onchange="filterPolicies()">
            <option value="">All Types</option>
            <option>Whole Life Insurance</option>
            <option>Term Life Insurance</option>
            <option>Universal Life Insurance</option>
            <option>Variable Universal Life</option>
            <option>Long-term Care Insurance</option>
          </select>
          <select class="filter-select" id="policy-status-filter" onchange="filterPolicies()">
            <option value="">All Status</option>
            <option>Active</option>
            <option>Review</option>
            <option>Lapsed</option>
          </select>
        </div>
        <div class="toolbar-right">
          <button class="btn btn-ai" onclick="openNLPReview('all')">
            <i class="fas fa-brain"></i> NLP Policy Scan
          </button>
          <button class="btn btn-primary" onclick="openNewPolicyModal()">
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

      {/* ── Phase 7 AI Service Actions Bar ── */}
      <div class="policy-ai-actions-bar">
        <div class="paa-title"><i class="fas fa-robot"></i> AI Service Intelligence</div>
        <button class="paa-btn paa-lapse" onclick="openLapseRiskDashboard()">
          <i class="fas fa-heartbeat"></i>
          <div><span class="paa-btn-val">6 Policies</span><span class="paa-btn-lbl">Lapse Risk</span></div>
          <span class="paa-urgency-dot red"></span>
        </button>
        <button class="paa-btn paa-conversion" onclick="openConversionAlerts()">
          <i class="fas fa-exchange-alt"></i>
          <div><span class="paa-btn-val">4 Policies</span><span class="paa-btn-lbl">Conversion Window</span></div>
          <span class="paa-urgency-dot amber"></span>
        </button>
        <button class="paa-btn paa-beneficiary" onclick="openBeneficiaryAudit()">
          <i class="fas fa-user-shield"></i>
          <div><span class="paa-btn-val">8 Policies</span><span class="paa-btn-lbl">Beneficiary Issues</span></div>
          <span class="paa-urgency-dot amber"></span>
        </button>
        <button class="paa-btn paa-renewal" onclick="openRenewalCenter()">
          <i class="fas fa-sync-alt"></i>
          <div><span class="paa-btn-val">23 Due</span><span class="paa-btn-lbl">Renewals (90d)</span></div>
          <span class="paa-urgency-dot green"></span>
        </button>
        <button class="paa-btn paa-premium" onclick="openPremiumChangeModal()">
          <i class="fas fa-sliders-h"></i>
          <div><span class="paa-btn-val">Model Impact</span><span class="paa-btn-lbl">Premium Change</span></div>
        </button>
        <button class="paa-btn paa-1035" onclick="open1035Analyzer()">
          <i class="fas fa-random"></i>
          <div><span class="paa-btn-val">3 Candidates</span><span class="paa-btn-lbl">1035 Exchange</span></div>
          <span class="paa-urgency-dot green"></span>
        </button>
      </div>

      {/* ── Lapse Risk Dashboard (Phase 7F) ── */}
      <div class="lapse-risk-panel" id="lapse-risk-panel" style="display:none">
        <div class="lrp-header">
          <div class="lrp-header-left">
            <i class="fas fa-heartbeat lrp-icon"></i>
            <div>
              <div class="lrp-title">AI Lapse Risk Dashboard <span class="lrp-live">LIVE</span></div>
              <div class="lrp-sub">Policies scored weekly · AI predicts lapse 60–90 days early · cash value monitoring active</div>
            </div>
          </div>
          <button class="lrp-close" onclick="closeLapseRiskDashboard()"><i class="fas fa-times"></i></button>
        </div>
        <div class="lrp-list" id="lrp-list">
          {/* Rendered by initLapseRiskPanel() */}
        </div>
      </div>

      {/* ── Conversion Alerts (Phase 7C) ── */}
      <div class="conversion-panel" id="conversion-panel" style="display:none">
        <div class="cvp-header">
          <div class="cvp-header-left">
            <i class="fas fa-exchange-alt cvp-icon"></i>
            <div>
              <div class="cvp-title">Term → Permanent Conversion Opportunities</div>
              <div class="cvp-sub">AI identifies term policies approaching conversion window · no new underwriting required</div>
            </div>
          </div>
          <button class="cvp-close" onclick="closeConversionAlerts()"><i class="fas fa-times"></i></button>
        </div>
        <div class="cvp-list" id="cvp-list">
          {/* Rendered by initConversionPanel() */}
        </div>
      </div>

      {/* ── Beneficiary Audit (Phase 7B) ── */}
      <div class="bene-audit-panel" id="bene-audit-panel" style="display:none">
        <div class="bap-header">
          <div class="bap-header-left">
            <i class="fas fa-user-shield bap-icon"></i>
            <div>
              <div class="bap-title">AI Beneficiary Audit Scanner <span class="bap-live">LIVE</span></div>
              <div class="bap-sub">Scans all policies for stale, incomplete, or legally problematic beneficiary designations</div>
            </div>
          </div>
          <button class="bap-close" onclick="closeBeneficiaryAudit()"><i class="fas fa-times"></i></button>
        </div>
        <div class="bap-list" id="bap-list">
          {/* Rendered by initBeneficiaryAudit() */}
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
              <th><i class="fas fa-credit-card" style="color:#0891b2;margin-right:4px"></i>Pay Mode</th>
              <th>Status</th>
              <th>Issued</th>
              <th>Renewal</th>
              <th>Beneficiary</th>
              <th><i class="fas fa-phone-alt" style="color:#059669;margin-right:4px"></i>Last Contact</th>
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
              const payModeMap: Record<string,{label:string,icon:string,cls:string}> = {
                'P-100291':{label:'Annual',  icon:'fa-calendar-check', cls:'pay-annual'},
                'P-100292':{label:'Monthly', icon:'fa-redo',           cls:'pay-monthly'},
                'P-100293':{label:'Annual',  icon:'fa-calendar-check', cls:'pay-annual'},
                'P-100301':{label:'Monthly', icon:'fa-redo',           cls:'pay-monthly pay-warn'},
                'P-100302':{label:'Quarterly',icon:'fa-calendar',      cls:'pay-quarterly'},
                'P-100310':{label:'Annual',  icon:'fa-calendar-check', cls:'pay-annual'},
                'P-100320':{label:'Semi-Ann',icon:'fa-calendar-alt',   cls:'pay-semi'},
                'P-100330':{label:'Annual',  icon:'fa-calendar-check', cls:'pay-annual'},
              };
              const lastContactMap: Record<string,{date:string,type:string,cls:string}> = {
                'P-100291':{date:'Apr 9',  type:'Call',  cls:'lc-call'},
                'P-100292':{date:'Mar 22', type:'Email', cls:'lc-email'},
                'P-100293':{date:'Apr 2',  type:'Meeting',cls:'lc-meeting'},
                'P-100301':{date:'Apr 10', type:'Urgent',cls:'lc-urgent'},
                'P-100302':{date:'Mar 15', type:'Email', cls:'lc-email'},
                'P-100310':{date:'Apr 9',  type:'Claim', cls:'lc-claim'},
                'P-100320':{date:'Apr 10', type:'Urgent',cls:'lc-urgent'},
                'P-100330':{date:'Apr 9',  type:'Meeting',cls:'lc-meeting'},
              };
              const pm = payModeMap[p.id] || {label:'—',icon:'fa-question',cls:''};
              const lc = lastContactMap[p.id] || {date:'—',type:'—',cls:''};
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
                <td><span class={`pay-mode-badge ${pm.cls}`}><i class={`fas ${pm.icon}`}></i> {pm.label}</span></td>
                <td><span class={`status-badge ${p.status.toLowerCase()}`}>{p.status}</span></td>
                <td class="text-muted">{p.issued}</td>
                <td class={p.status === 'Review' ? 'text-orange' : 'text-muted'}>{p.renewal}</td>
                <td class="text-muted">{p.beneficiary}</td>
                <td><span class={`last-contact-badge ${lc.cls}`}>{lc.date} · {lc.type}</span></td>
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
            <button class="rac-run-btn" onclick="openRunCampaignModal()"><i class="fas fa-paper-plane"></i> Run Campaign</button>
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

      {/* ── Coverage Gap & Opportunity Radar ── */}
      <div class="coverage-gap-radar">
        <div class="cgr-header">
          <div class="cgr-title-wrap">
            <i class="fas fa-crosshairs"></i>
            <div>
              <div class="cgr-title">Coverage Gap &amp; Opportunity Radar <span class="cgr-ai-badge">AI-Powered</span></div>
              <div class="cgr-sub">AI identifies missing coverage, upsell &amp; cross-sell opportunities across your full book · real-time</div>
            </div>
          </div>
          <button class="cgr-run-btn" onclick="openCoverageGapAnalysisModal()"><i class="fas fa-robot"></i> Run Full Analysis</button>
        </div>
        <div class="cgr-grid">
          <div class="cgr-gap-card cgr-gap-di">
            <div class="cgr-gap-icon"><i class="fas fa-user-shield"></i></div>
            <div class="cgr-gap-data">
              <div class="cgr-gap-count">47</div>
              <div class="cgr-gap-label">No Disability Insurance</div>
              <div class="cgr-gap-clients">David Thompson, Patricia Nguyen +45</div>
              <div class="cgr-gap-revenue">~$9.4K/yr potential</div>
            </div>
            <button class="cgr-act-btn" onclick="openGapOutreachModal('di')"><i class="fas fa-bolt"></i> Outreach</button>
          </div>
          <div class="cgr-gap-card cgr-gap-ltc">
            <div class="cgr-gap-icon"><i class="fas fa-hospital"></i></div>
            <div class="cgr-gap-data">
              <div class="cgr-gap-count">63</div>
              <div class="cgr-gap-label">LTC Coverage Gap</div>
              <div class="cgr-gap-clients">James Whitfield ($180/day gap) +62</div>
              <div class="cgr-gap-revenue">~$7.8K/yr potential</div>
            </div>
            <button class="cgr-act-btn" onclick="openGapOutreachModal('ltc')"><i class="fas fa-bolt"></i> Outreach</button>
          </div>
          <div class="cgr-gap-card cgr-gap-ret">
            <div class="cgr-gap-icon"><i class="fas fa-umbrella-beach"></i></div>
            <div class="cgr-gap-data">
              <div class="cgr-gap-count">38</div>
              <div class="cgr-gap-label">Retirement Income Gap</div>
              <div class="cgr-gap-clients">Sandra Williams, James Whitfield +36</div>
              <div class="cgr-gap-revenue">~$8.9K/yr potential</div>
            </div>
            <button class="cgr-act-btn" onclick="openGapOutreachModal('ret')"><i class="fas fa-bolt"></i> Outreach</button>
          </div>
          <div class="cgr-gap-card cgr-gap-est">
            <div class="cgr-gap-icon"><i class="fas fa-landmark"></i></div>
            <div class="cgr-gap-data">
              <div class="cgr-gap-count">12</div>
              <div class="cgr-gap-label">No Estate Plan</div>
              <div class="cgr-gap-clients">Linda Morrison, Robert Chen +10</div>
              <div class="cgr-gap-revenue">~$5.1K/yr potential</div>
            </div>
            <button class="cgr-act-btn" onclick="openGapOutreachModal('est')"><i class="fas fa-bolt"></i> Outreach</button>
          </div>
          <div class="cgr-gap-card cgr-gap-cnv">
            <div class="cgr-gap-icon"><i class="fas fa-exchange-alt"></i></div>
            <div class="cgr-gap-data">
              <div class="cgr-gap-count">8</div>
              <div class="cgr-gap-label">Term→Perm Conversion</div>
              <div class="cgr-gap-clients">Sandra Williams (urgent), James W.</div>
              <div class="cgr-gap-revenue">~$14.2K/yr if converted</div>
            </div>
            <button class="cgr-act-btn urgent" onclick="openRetentionFullReport()"><i class="fas fa-fire"></i> Urgent</button>
          </div>
          <div class="cgr-total-card">
            <div class="cgr-total-icon"><i class="fas fa-trophy"></i></div>
            <div class="cgr-total-val">$31.2K</div>
            <div class="cgr-total-lbl">Total Opportunity /yr</div>
            <div class="cgr-total-sub">Across 6 gap categories</div>
            <button class="cgr-total-btn" onclick="sendQuickMessage('Give me a comprehensive action plan to capture all identified coverage gap opportunities')"><i class="fas fa-robot"></i> Full AI Action Plan</button>
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
                <button class="dmt-tab active" onclick="switchPolicyTab('view',this)"><i class="fas fa-eye"></i> Overview</button>
                <button class="dmt-tab" onclick="switchPolicyTab('edit',this)"><i class="fas fa-edit"></i> Edit</button>
                <button class="dmt-tab ai-tab" onclick="switchPolicyTab('ai',this)"><i class="fas fa-robot"></i> AI Analysis</button>
                <button class="dmt-tab nlp-tab" onclick="switchPolicyTab('nlp',this)"><i class="fas fa-brain"></i> NLP Risk</button>
                <button class="dmt-tab ri-tab" onclick="switchPolicyTab('retention',this)"><i class="fas fa-heartbeat"></i> Retention</button>
                <button class="dmt-tab" onclick="switchPolicyTab('documents',this)"><i class="fas fa-folder-open"></i> Documents</button>
                <button class="dmt-tab" onclick="switchPolicyTab('timeline',this)"><i class="fas fa-stream"></i> Timeline</button>
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

      {/* ── New Policy Modal ── */}
      <div class="np-overlay" id="np-overlay" onclick="closeNewPolicyModal(event)">
        <div class="np-modal" onclick="event.stopPropagation()">
          <div class="np-header">
            <div class="np-header-left">
              <div class="np-header-icon"><i class="fas fa-file-medical-alt"></i></div>
              <div>
                <div class="np-title">Create New Policy</div>
                <div class="np-subtitle" id="np-subtitle">Step 1 of 4 — Client &amp; Policy Basics</div>
              </div>
            </div>
            <button class="np-close-btn" onclick="closeNewPolicyModal()"><i class="fas fa-times"></i></button>
          </div>
          {/* Step Progress Bar */}
          <div class="np-progress-bar">
            <div class="np-step active" id="np-step-1"><div class="np-step-num">1</div><div class="np-step-lbl">Client Info</div></div>
            <div class="np-step-line"></div>
            <div class="np-step" id="np-step-2"><div class="np-step-num">2</div><div class="np-step-lbl">Policy Details</div></div>
            <div class="np-step-line"></div>
            <div class="np-step" id="np-step-3"><div class="np-step-num">3</div><div class="np-step-lbl">Underwriting</div></div>
            <div class="np-step-line"></div>
            <div class="np-step" id="np-step-4"><div class="np-step-num">4</div><div class="np-step-lbl">Review &amp; Submit</div></div>
          </div>
          <div class="np-body" id="np-body">
            {/* JS-populated */}
          </div>
          <div class="np-footer">
            <button class="np-btn-cancel" onclick="closeNewPolicyModal()"><i class="fas fa-times"></i> Cancel</button>
            <div class="np-footer-right">
              <button class="np-btn-back" id="np-btn-back" onclick="npPrevStep()" style="display:none"><i class="fas fa-arrow-left"></i> Back</button>
              <button class="np-btn-ai" onclick="npAIEnrich()"><i class="fas fa-robot"></i> AI Pre-fill</button>
              <button class="np-btn-next" id="np-btn-next" onclick="npNextStep()">Next <i class="fas fa-arrow-right"></i></button>
              <button class="np-btn-submit" id="np-btn-submit" onclick="npSubmitPolicy()" style="display:none"><i class="fas fa-check"></i> Submit Policy</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Run Campaign Modal ── */}
      <div class="rc-overlay" id="rc-overlay" onclick="closeRunCampaignModal(event)">
        <div class="rc-modal" onclick="event.stopPropagation()">
          <div class="rc-header">
            <div class="rc-header-left">
              <div class="rc-header-icon"><i class="fas fa-paper-plane"></i></div>
              <div>
                <div class="rc-title">Renewal Email Campaign</div>
                <div class="rc-subtitle">AI-drafted · personalised · 23 clients</div>
              </div>
            </div>
            <button class="rc-close-btn" onclick="closeRunCampaignModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="rc-body" id="rc-body">
            {/* JS-populated */}
          </div>
        </div>
      </div>

      {/* ── Coverage Gap Full Analysis Modal ── */}
      <div class="cga-overlay" id="cga-overlay" onclick="closeCoverageGapAnalysisModal(event)">
        <div class="cga-modal" onclick="event.stopPropagation()">
          <div class="cga-header">
            <div class="cga-header-left">
              <div class="cga-header-icon"><i class="fas fa-crosshairs"></i></div>
              <div>
                <div class="cga-title">Coverage Gap &amp; Opportunity Full Analysis</div>
                <div class="cga-subtitle">AI-Powered · 1,842 policies scanned · real-time</div>
              </div>
            </div>
            <div class="cga-header-tabs">
              <button class="cga-tab active" id="cga-tab-overview" onclick="switchCGATab('overview',this)"><i class="fas fa-chart-bar"></i> Overview</button>
              <button class="cga-tab" id="cga-tab-clients" onclick="switchCGATab('clients',this)"><i class="fas fa-users"></i> Client List</button>
              <button class="cga-tab" id="cga-tab-plan" onclick="switchCGATab('plan',this)"><i class="fas fa-tasks"></i> Action Plan</button>
            </div>
            <button class="cga-close-btn" onclick="closeCoverageGapAnalysisModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="cga-body" id="cga-body">
            {/* JS-populated */}
          </div>
          <div class="cga-footer">
            <button class="cga-btn-ai" onclick="sendQuickMessage('Generate a prioritised action plan for all 6 coverage gap categories — include client names, products, and estimated revenue');closeCoverageGapAnalysisModal()"><i class="fas fa-robot"></i> Full AI Action Plan</button>
            <button class="cga-btn-close" onclick="closeCoverageGapAnalysisModal()"><i class="fas fa-times"></i> Close</button>
          </div>
        </div>
      </div>

      {/* ── Gap Outreach Composer Modal ── */}
      <div class="go-overlay" id="go-overlay" onclick="closeGapOutreachModal(event)">
        <div class="go-modal" onclick="event.stopPropagation()">
          <div class="go-header">
            <div class="go-header-left">
              <div class="go-header-icon" id="go-icon"><i class="fas fa-paper-plane"></i></div>
              <div>
                <div class="go-title" id="go-title">Outreach Campaign</div>
                <div class="go-subtitle" id="go-subtitle">AI-drafted personalised messages</div>
              </div>
            </div>
            <div class="go-channel-tabs">
              <button class="go-ch-tab active" id="go-tab-email" onclick="switchGOChannel('email',this)"><i class="fas fa-envelope"></i> Email</button>
              <button class="go-ch-tab" id="go-tab-sms" onclick="switchGOChannel('sms',this)"><i class="fas fa-sms"></i> SMS</button>
              <button class="go-ch-tab" id="go-tab-call" onclick="switchGOChannel('call',this)"><i class="fas fa-phone"></i> Call Script</button>
            </div>
            <button class="go-close-btn" onclick="closeGapOutreachModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="go-body" id="go-body">
            {/* JS-populated */}
          </div>
          <div class="go-footer">
            <button class="go-btn-regen" onclick="regenGOMessage()"><i class="fas fa-sync-alt"></i> Regenerate</button>
            <select class="go-tone-select" id="go-tone" onchange="regenGOMessage()">
              <option value="professional">Professional</option>
              <option value="warm">Warm &amp; Personal</option>
              <option value="urgent">Urgent</option>
              <option value="consultative">Consultative</option>
            </select>
            <div class="go-footer-right">
              <button class="go-btn-schedule" onclick="scheduleGOOutreach()"><i class="fas fa-calendar-alt"></i> Schedule</button>
              <button class="go-btn-send" onclick="sendGOOutreach()"><i class="fas fa-paper-plane"></i> Send All Now</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

function ClaimsPage() {
  return (
    <div class="page claims-page">

      {/* ── Claims KPI Dashboard Bar ── */}
      <div class="claim-kpi-bar">
        <div class="ckpi-card ckpi-open" onclick="filterClaimsByStatus('open')">
          <div class="ckpi-icon"><i class="fas fa-folder-open"></i></div>
          <div class="ckpi-body">
            <div class="ckpi-val">7</div>
            <div class="ckpi-lbl">Open Claims</div>
            <div class="ckpi-trend up"><i class="fas fa-arrow-up"></i> +2 this week</div>
          </div>
        </div>
        <div class="ckpi-card ckpi-review" onclick="filterClaimsByStatus('review')">
          <div class="ckpi-icon"><i class="fas fa-search"></i></div>
          <div class="ckpi-body">
            <div class="ckpi-val">3</div>
            <div class="ckpi-lbl">Under Review</div>
            <div class="ckpi-trend neutral"><i class="fas fa-minus"></i> Steady</div>
          </div>
        </div>
        <div class="ckpi-card ckpi-pending" onclick="filterClaimsByStatus('pending')">
          <div class="ckpi-icon"><i class="fas fa-hourglass-half"></i></div>
          <div class="ckpi-body">
            <div class="ckpi-val">2</div>
            <div class="ckpi-lbl">Pending Docs</div>
            <div class="ckpi-trend warn"><i class="fas fa-exclamation-triangle"></i> 1 overdue</div>
          </div>
        </div>
        <div class="ckpi-card ckpi-sla" onclick="filterClaimsBySLA()">
          <div class="ckpi-icon"><i class="fas fa-stopwatch"></i></div>
          <div class="ckpi-body">
            <div class="ckpi-val">2</div>
            <div class="ckpi-lbl">SLA At Risk</div>
            <div class="ckpi-trend warn"><i class="fas fa-exclamation-circle"></i> Act today</div>
          </div>
        </div>
        <div class="ckpi-card ckpi-exposure" onclick="filterClaimsByExposure()">
          <div class="ckpi-icon"><i class="fas fa-coins"></i></div>
          <div class="ckpi-body">
            <div class="ckpi-val">$1.41M</div>
            <div class="ckpi-lbl">Open Exposure</div>
            <div class="ckpi-trend up"><i class="fas fa-arrow-up"></i> +$1M (new death)</div>
          </div>
        </div>
        <div class="ckpi-card ckpi-approved" onclick="filterClaimsByStatus('approved')">
          <div class="ckpi-icon"><i class="fas fa-check-circle"></i></div>
          <div class="ckpi-body">
            <div class="ckpi-val">14</div>
            <div class="ckpi-lbl">Approved YTD</div>
            <div class="ckpi-trend up"><i class="fas fa-arrow-up"></i> +4 vs last yr</div>
          </div>
        </div>
        <div class="ckpi-card ckpi-paid" onclick="filterClaimsByStatus('paid')">
          <div class="ckpi-icon"><i class="fas fa-dollar-sign"></i></div>
          <div class="ckpi-body">
            <div class="ckpi-val">$284K</div>
            <div class="ckpi-lbl">Paid Out YTD</div>
            <div class="ckpi-trend up"><i class="fas fa-arrow-up"></i> On track</div>
          </div>
        </div>
        <div class="ckpi-card ckpi-avg" onclick="showClaimsResolutionChart()">
          <div class="ckpi-icon"><i class="fas fa-clock"></i></div>
          <div class="ckpi-body">
            <div class="ckpi-val">5.2d</div>
            <div class="ckpi-lbl">Avg Resolution</div>
            <div class="ckpi-trend good"><i class="fas fa-arrow-down"></i> −0.8d vs target</div>
          </div>
        </div>
        <div class="ckpi-card ckpi-docs" onclick="filterClaimsByDocStatus()">
          <div class="ckpi-icon"><i class="fas fa-file-check"></i></div>
          <div class="ckpi-body">
            <div class="ckpi-val">61%</div>
            <div class="ckpi-lbl">Doc Completion</div>
            <div class="ckpi-trend warn"><i class="fas fa-arrow-down"></i> Below 80% target</div>
          </div>
        </div>
        <div class="ckpi-card ckpi-payout" onclick="showPayoutTurnaroundPanel()">
          <div class="ckpi-icon"><i class="fas fa-bolt"></i></div>
          <div class="ckpi-body">
            <div class="ckpi-val">3.1d</div>
            <div class="ckpi-lbl">Avg Payout Turnaround</div>
            <div class="ckpi-trend good"><i class="fas fa-arrow-down"></i> −0.4d MoM</div>
          </div>
        </div>
      </div>

      {/* ── AI Claims Navigator (Phase 7G) ── */}
      <div class="claims-ai-navigator">
        <div class="can-left">
          <div class="can-icon"><i class="fas fa-robot"></i></div>
          <div>
            <div class="can-title">AI Claims Navigator <span class="can-live">LIVE</span></div>
            <div class="can-sub">Guides beneficiaries through claim submission · pre-fills forms · tracks document receipt · detects contestability flags · ADB eligibility screening</div>
          </div>
        </div>
        <div class="can-stats">
          <div class="can-stat"><span class="can-val red">2</span><span class="can-lbl">Contestability Flags</span></div>
          <div class="can-stat"><span class="can-val amber">1</span><span class="can-lbl">ADB Eligible</span></div>
          <div class="can-stat"><span class="can-val blue">4</span><span class="can-lbl">Docs Missing</span></div>
          <div class="can-stat"><span class="can-val green">61%</span><span class="can-lbl">Doc Completion</span></div>
        </div>
        <div class="can-actions">
          <button class="can-btn primary" onclick="openClaimsNavigator()"><i class="fas fa-compass"></i> Beneficiary Navigator</button>
          <button class="can-btn ghost" onclick="openADBScreener()"><i class="fas fa-heartbeat"></i> ADB Screener</button>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div class="page-toolbar">
        <div class="toolbar-left">
          <div class="search-inline">
            <i class="fas fa-search"></i>
            <input type="text" id="claim-search" placeholder="Search claims, clients, policy IDs..." oninput="filterClaims()" />
          </div>
          <select class="filter-select" id="claim-type-filter" onchange="filterClaims()">
            <option value="">All Types</option>
            <option>Death Benefit</option>
            <option>Disability</option>
            <option>Long-term Care</option>
            <option>Accelerated Benefit</option>
            <option>Waiver of Premium</option>
          </select>
          <select class="filter-select" id="claim-status-filter" onchange="filterClaims()">
            <option value="">All Status</option>
            <option>Open</option>
            <option>Under Review</option>
            <option>Pending Documentation</option>
            <option>Approved</option>
            <option>Paid</option>
            <option>Denied</option>
          </select>
          <select class="filter-select" id="claim-priority-filter" onchange="filterClaims()">
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

      {/* ── Claims Workbench / Priority Triage Queue ── */}
      <div class="claims-workbench" id="claims-workbench">
        <div class="cwb-header">
          <div class="cwb-header-left">
            <div class="cwb-icon"><i class="fas fa-tasks"></i></div>
            <div>
              <div class="cwb-title">Claims Workbench <span class="cwb-badge">4 Require Action</span></div>
              <div class="cwb-sub">AI-prioritised queue — work from left to right · Updated just now</div>
            </div>
          </div>
          <button class="cwb-collapse-btn" onclick="toggleWorkbench(this)" title="Collapse workbench"><i class="fas fa-chevron-up"></i></button>
        </div>
        <div class="cwb-cards" id="cwb-cards">

          {/* Card 1 — SLA breach imminent */}
          <div class="cwb-card cwb-urgent">
            <div class="cwb-card-top">
              <span class="cwb-priority-dot urgent"></span>
              <span class="cwb-claim-id">CLM-2026-0041</span>
              <span class="cwb-sla-badge breach"><i class="fas fa-fire"></i> SLA: 1d left</span>
            </div>
            <div class="cwb-client"><div class="mini-avatar rc" style="width:24px;height:24px;font-size:9px">RC</div><span>Robert Chen</span></div>
            <div class="cwb-reason"><i class="fas fa-exclamation-triangle"></i> Missing ID docs — $1M death benefit on hold</div>
            <div class="cwb-card-actions">
              <button class="cwb-action-btn primary" onclick="openClaimModal('CLM-2026-0041','view')"><i class="fas fa-upload"></i> Upload Docs</button>
              <button class="cwb-action-btn ghost" onclick="openClaimModal('CLM-2026-0041','ci')"><i class="fas fa-robot"></i> AI</button>
            </div>
          </div>

          {/* Card 2 — Fraud hold */}
          <div class="cwb-card cwb-fraud">
            <div class="cwb-card-top">
              <span class="cwb-priority-dot flagged"></span>
              <span class="cwb-claim-id">CLM-2026-0025</span>
              <span class="cwb-sla-badge fraud"><i class="fas fa-shield-virus"></i> Fraud Hold</span>
            </div>
            <div class="cwb-client"><div class="mini-avatar kp" style="width:24px;height:24px;font-size:9px">KP</div><span>Kevin Park</span></div>
            <div class="cwb-reason"><i class="fas fa-ban"></i> Risk score 78 — coverage determination required</div>
            <div class="cwb-card-actions">
              <button class="cwb-action-btn primary" onclick="openFraudDetailModal('CLM-2026-0025')"><i class="fas fa-search-plus"></i> Review</button>
              <button class="cwb-action-btn ghost" onclick="openClaimModal('CLM-2026-0025','ci')"><i class="fas fa-robot"></i> AI</button>
            </div>
          </div>

          {/* Card 3 — Compassionate / urgent ADB */}
          <div class="cwb-card cwb-compassionate">
            <div class="cwb-card-top">
              <span class="cwb-priority-dot urgent"></span>
              <span class="cwb-claim-id">CLM-2026-0028</span>
              <span class="cwb-sla-badge compassionate"><i class="fas fa-heart"></i> Compassionate</span>
            </div>
            <div class="cwb-client"><div class="mini-avatar mg" style="width:24px;height:24px;font-size:9px">MG</div><span>Maria Gonzalez</span></div>
            <div class="cwb-reason"><i class="fas fa-file-medical"></i> Terminal cert pending — ADB $120K expedite</div>
            <div class="cwb-card-actions">
              <button class="cwb-action-btn primary" onclick="sendDocRequest('CLM-2026-0028','Dr. Hernandez')"><i class="fas fa-paper-plane"></i> Chase Docs</button>
              <button class="cwb-action-btn ghost" onclick="openClaimModal('CLM-2026-0028','view')"><i class="fas fa-eye"></i> View</button>
            </div>
          </div>

          {/* Card 4 — Doc pending but near approval */}
          <div class="cwb-card cwb-normal">
            <div class="cwb-card-top">
              <span class="cwb-priority-dot normal"></span>
              <span class="cwb-claim-id">CLM-2026-0035</span>
              <span class="cwb-sla-badge watch"><i class="fas fa-clock"></i> 21d SLA</span>
            </div>
            <div class="cwb-client"><div class="mini-avatar mg" style="width:24px;height:24px;font-size:9px">MG</div><span>Maria Gonzalez</span></div>
            <div class="cwb-reason"><i class="fas fa-stethoscope"></i> APS from physician needed — disability $4.2K/mo</div>
            <div class="cwb-card-actions">
              <button class="cwb-action-btn primary" onclick="sendDocRequest('CLM-2026-0035','Dr. Hernandez APS')"><i class="fas fa-paper-plane"></i> Send Reminder</button>
              <button class="cwb-action-btn ghost" onclick="openClaimModal('CLM-2026-0035','view')"><i class="fas fa-eye"></i> View</button>
            </div>
          </div>

          {/* Card 5 — On track / informational */}
          <div class="cwb-card cwb-ok">
            <div class="cwb-card-top">
              <span class="cwb-priority-dot ok"></span>
              <span class="cwb-claim-id">CLM-2026-0033</span>
              <span class="cwb-sla-badge ok"><i class="fas fa-check-circle"></i> On Track</span>
            </div>
            <div class="cwb-client"><div class="mini-avatar jw" style="width:24px;height:24px;font-size:9px">JW</div><span>James Whitfield</span></div>
            <div class="cwb-reason"><i class="fas fa-thumbs-up"></i> All docs in — approval imminent (~3 days)</div>
            <div class="cwb-card-actions">
              <button class="cwb-action-btn primary" onclick="openClaimModal('CLM-2026-0033','view')"><i class="fas fa-eye"></i> Review &amp; Approve</button>
              <button class="cwb-action-btn ghost" onclick="openClaimModal('CLM-2026-0033','ci')"><i class="fas fa-robot"></i> AI</button>
            </div>
          </div>

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
          <div class="ci-kpi ci-kpi-red ci-kpi-sla">
            <div class="ci-kpi-val">2</div>
            <div class="ci-kpi-lbl">SLA At Risk</div>
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
            <div class="pac-hstat"><span class="pac-hstat-val red">2</span><span class="pac-hstat-lbl">SLA At Risk</span></div>
            <div class="pac-hstat"><span class="pac-hstat-val blue">5</span><span class="pac-hstat-lbl">Total Alerts</span></div>
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

          {/* Alert 4b — SLA Compliance Risk */}
          <div class="pac-alert pac-alert-sla" id="pac-alert-sla">
            <div class="pac-alert-type-icon sla"><i class="fas fa-stopwatch"></i></div>
            <div class="pac-alert-content">
              <div class="pac-alert-badges">
                <span class="pac-badge sla"><i class="fas fa-balance-scale"></i> SLA Breach Risk</span>
                <span class="pac-badge urgent">2 Claims</span>
                <span class="pac-badge new">Regulatory Deadline</span>
              </div>
              <div class="pac-alert-headline">State SLA Deadline — CLM-2026-0041 expires tomorrow · CLM-2026-0028 expires in 5 days</div>
              <div class="pac-alert-detail">New York State Insurance Law §3420 requires death benefit claims to be resolved within 30 days of notice. <strong>CLM-2026-0041 (Robert Chen, $1M)</strong> has 1 day remaining. Compassionate SLA applies to <strong>CLM-2026-0028 (Maria Gonzalez, $120K)</strong> — expedite immediately to avoid regulatory breach and potential fines of up to $5,000 per violation.</div>
              <div class="pac-alert-meta">
                <span><i class="fas fa-balance-scale"></i> NY Ins. Law §3420 · 30-day resolution requirement</span>
                <span><i class="fas fa-exclamation-circle"></i> 2 claims in breach window · Total exposure $1.12M</span>
                <span><i class="fas fa-calendar-times"></i> CLM-2026-0041: Apr 14 · CLM-2026-0028: Apr 19</span>
              </div>
            </div>
            <div class="pac-alert-actions">
              <button class="btn-pac-action primary" onclick="filterClaimsBySLA()"><i class="fas fa-stopwatch"></i> View SLA Queue</button>
              <button class="btn-pac-action secondary" onclick="openClaimModal('CLM-2026-0041','view')"><i class="fas fa-eye"></i> View Claim</button>
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

      {/* ── Open / Active Claims ── */}
      <div class="claims-section-header">
        <div class="claims-section-label-row">
          <div class="claims-section-label">
            <i class="fas fa-folder-open"></i> Open &amp; Active Claims
            <span class="claims-count-badge">7</span>
          </div>
          <div class="claims-batch-toolbar">
            <label class="batch-select-all"><input type="checkbox" id="select-all-claims" onchange="toggleAllClaims(this)" /> Select All</label>
            <button class="btn-batch" id="batch-send-btn" disabled onclick="batchSendDocReminders()"><i class="fas fa-paper-plane"></i> Send Reminders</button>
            <button class="btn-batch" id="batch-assign-btn" disabled onclick="batchAssignAdjuster()"><i class="fas fa-user-tag"></i> Assign Adjuster</button>
            <button class="btn-batch" id="batch-export-btn" onclick="batchExportClaims()"><i class="fas fa-file-export"></i> Export</button>
          </div>
        </div>
      </div>

      <div class="claims-table-wrapper">
        <table class="data-table claims-table">
          <thead>
            <tr>
              <th style="width:36px"><input type="checkbox" id="th-checkbox" /></th>
              <th>Claim ID</th>
              <th>Client</th>
              <th>Policy</th>
              <th>Claim Type</th>
              <th>Amount</th>
              <th>Filed Date</th>
              <th><i class="fas fa-calendar-day" style="color:#64748b;margin-right:4px"></i>Days Open</th>
              <th>Status</th>
              <th>Priority</th>
              <th><i class="fas fa-user-tie" style="color:#64748b;margin-right:4px"></i>Adjuster / Team</th>
              <th><i class="fas fa-shield-virus" style="color:#dc2626;margin-right:4px"></i>Fraud Score</th>
              <th><i class="fas fa-file-import" style="color:#7c3aed;margin-right:4px"></i>Doc Status</th>
              <th><i class="fas fa-brain" style="color:#0ea5e9;margin-right:4px"></i>AI Triage</th>
              <th><i class="fas fa-hourglass-half" style="color:#d97706;margin-right:4px"></i>Resolution</th>
              <th><i class="fas fa-stopwatch" style="color:#dc2626;margin-right:4px"></i>SLA Status</th>
              <th><i class="fas fa-gavel" style="color:#7c3aed;margin-right:4px"></i>Liability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr class="claim-row urgent">
              <td><input type="checkbox" class="claim-row-checkbox" onchange="updateBatchButtons()" /></td>
              <td><span class="claim-id">CLM-2026-0041</span></td>
              <td><div class="client-cell"><div class="mini-avatar rc">RC</div><span>Robert Chen</span></div></td>
              <td><span class="policy-id">P-100310</span></td>
              <td><span class="claim-type-badge death">Death Benefit</span></td>
              <td class="premium">$1,000,000</td>
              <td class="text-muted">2026-04-09</td>
              <td><span class="days-open-badge urgent">5d</span></td>
              <td><span class="claim-status-badge review">Under Review</span></td>
              <td><span class="priority-badge urgent">Urgent</span></td>
              <td><div class="adjuster-cell"><div class="adj-avatar cd">CD</div><div class="adj-info"><div class="adj-name">Chris Davis</div><div class="adj-team team-claims">Claims Dept.</div></div></div></td>
              <td><div class="fraud-score-cell watch" onclick="openFraudDetailModal('CLM-2026-0041')"><span class="fraud-score-num">42</span><span class="fraud-score-lbl">Watch</span><i class="fas fa-eye"></i></div></td>
              <td><div class="idp-status-cell" onclick="openIDPModal('CLM-2026-0041')"><span class="idp-badge idp-partial"><i class="fas fa-file-import"></i> 2/4 Docs</span><div class="idp-scan-bar"><div class="idp-scan-fill" style="width:50%"></div></div></div></td>
              <td><div class="ci-triage-cell urgent" onclick="openClaimModal('CLM-2026-0041','ci')"><span class="ci-triage-label">⚡ Expedite</span><span class="ci-triage-sub">Missing ID docs</span></div></td>
              <td><div class="ci-res-timer urgent"><i class="fas fa-hourglass-half"></i><span class="ci-res-days">1d left</span><div class="ci-res-bar"><div class="ci-res-fill urgent" style="width:85%"></div></div></div></td>
              <td><div class="sla-cell sla-breach"><div class="sla-bar-wrap"><div class="sla-bar sla-fill-breach" style="width:95%"></div></div><span class="sla-label breach"><i class="fas fa-fire"></i> 1d left</span><span class="sla-deadline">State SLA: Apr 14</span></div></td>
              <td><div class="liability-cell" onclick="openClaimModal('CLM-2026-0041','liability')"><div class="liab-score-wrap high"><span class="liab-score">72%</span></div><span class="liab-flag high">High</span><span class="litig-risk high"><i class="fas fa-gavel"></i> Litig.</span></div></td>
              <td>
                <div class="action-btns">
                  <button class="btn-icon" title="View Claim" onclick="openClaimModal('CLM-2026-0041','view')"><i class="fas fa-eye"></i></button>
                  <button class="btn-icon" title="Upload Documents"><i class="fas fa-upload"></i></button>
                  <button class="btn-icon ai-btn" title="AI Analysis" onclick="openClaimModal('CLM-2026-0041','ci')"><i class="fas fa-robot"></i></button>
                </div>
              </td>
            </tr>
            <tr class="claim-row">
              <td><input type="checkbox" class="claim-row-checkbox" onchange="updateBatchButtons()" /></td>
              <td><span class="claim-id">CLM-2026-0038</span></td>
              <td><div class="client-cell"><div class="mini-avatar sw">SW</div><span>Sandra Williams</span></div></td>
              <td><span class="policy-id">P-100321</span></td>
              <td><span class="claim-type-badge ltc">Long-term Care</span></td>
              <td class="premium">$18,000</td>
              <td class="text-muted">2026-04-01</td>
              <td><span class="days-open-badge normal">13d</span></td>
              <td><span class="claim-status-badge open">Open</span></td>
              <td><span class="priority-badge normal">Normal</span></td>
              <td><div class="adjuster-cell"><div class="adj-avatar lt">LT</div><div class="adj-info"><div class="adj-name">Lisa Torres</div><div class="adj-team team-ltc">LTC Team</div></div></div></td>
              <td><div class="fraud-score-cell clear" onclick="openFraudDetailModal('CLM-2026-0038')"><span class="fraud-score-num">12</span><span class="fraud-score-lbl">Clear</span><i class="fas fa-check"></i></div></td>
              <td><div class="idp-status-cell" onclick="openIDPModal('CLM-2026-0038')"><span class="idp-badge idp-partial"><i class="fas fa-file-import"></i> 2/4 Docs</span><div class="idp-scan-bar"><div class="idp-scan-fill" style="width:50%"></div></div></div></td>
              <td><div class="ci-triage-cell normal" onclick="openClaimModal('CLM-2026-0038','ci')"><span class="ci-triage-label">📋 Doc Request</span><span class="ci-triage-sub">Plan of care pending</span></div></td>
              <td><div class="ci-res-timer normal"><i class="fas fa-clock"></i><span class="ci-res-days">8d est.</span><div class="ci-res-bar"><div class="ci-res-fill normal" style="width:45%"></div></div></div></td>
              <td><div class="sla-cell sla-ok"><div class="sla-bar-wrap"><div class="sla-bar sla-fill-ok" style="width:38%"></div></div><span class="sla-label ok"><i class="fas fa-check-circle"></i> 22d left</span><span class="sla-deadline">State SLA: May 1</span></div></td>
              <td><div class="liability-cell" onclick="openClaimModal('CLM-2026-0038','liability')"><div class="liab-score-wrap low"><span class="liab-score">18%</span></div><span class="liab-flag low">Low</span><span class="litig-risk low"><i class="fas fa-check"></i> Clear</span></div></td>
              <td>
                <div class="action-btns">
                  <button class="btn-icon" title="View Claim" onclick="openClaimModal('CLM-2026-0038','view')"><i class="fas fa-eye"></i></button>
                  <button class="btn-icon" title="Upload Documents"><i class="fas fa-upload"></i></button>
                  <button class="btn-icon ai-btn" title="AI Analysis" onclick="openClaimModal('CLM-2026-0038','ci')"><i class="fas fa-robot"></i></button>
                </div>
              </td>
            </tr>
            <tr class="claim-row">
              <td><input type="checkbox" class="claim-row-checkbox" onchange="updateBatchButtons()" /></td>
              <td><span class="claim-id">CLM-2026-0035</span></td>
              <td><div class="client-cell"><div class="mini-avatar mg">MG</div><span>Maria Gonzalez</span></div></td>
              <td><span class="policy-id">P-100341</span></td>
              <td><span class="claim-type-badge disability">Disability</span></td>
              <td class="premium">$4,200/mo</td>
              <td class="text-muted">2026-03-22</td>
              <td><span class="days-open-badge warn">23d</span></td>
              <td><span class="claim-status-badge pending">Pending Docs</span></td>
              <td><span class="priority-badge normal">Normal</span></td>
              <td><div class="adjuster-cell"><div class="adj-avatar dr">DR</div><div class="adj-info"><div class="adj-name">David Reyes</div><div class="adj-team team-di">DI Unit</div></div></div></td>
              <td><div class="fraud-score-cell clear" onclick="openFraudDetailModal('CLM-2026-0035')"><span class="fraud-score-num">18</span><span class="fraud-score-lbl">Clear</span><i class="fas fa-check"></i></div></td>
              <td><div class="idp-status-cell" onclick="openIDPModal('CLM-2026-0035')"><span class="idp-badge idp-missing"><i class="fas fa-hourglass-half"></i> 2/4 Docs</span><div class="idp-scan-bar"><div class="idp-scan-fill" style="width:50%"></div></div></div></td>
              <td><div class="ci-triage-cell watch" onclick="openClaimModal('CLM-2026-0035','ci')"><span class="ci-triage-label">🩺 APS Needed</span><span class="ci-triage-sub">Physician stmt pending</span></div></td>
              <td><div class="ci-res-timer watch"><i class="fas fa-clock"></i><span class="ci-res-days">21d est.</span><div class="ci-res-bar"><div class="ci-res-fill watch" style="width:30%"></div></div></div></td>
              <td><div class="sla-cell sla-warn"><div class="sla-bar-wrap"><div class="sla-bar sla-fill-warn" style="width:55%"></div></div><span class="sla-label warn"><i class="fas fa-exclamation-triangle"></i> 9d left</span><span class="sla-deadline">State SLA: Apr 22</span></div></td>
              <td><div class="liability-cell" onclick="openClaimModal('CLM-2026-0035','liability')"><div class="liab-score-wrap med"><span class="liab-score">41%</span></div><span class="liab-flag med">Medium</span><span class="litig-risk med"><i class="fas fa-exclamation"></i> Watch</span></div></td>
              <td>
                <div class="action-btns">
                  <button class="btn-icon" title="View Claim" onclick="openClaimModal('CLM-2026-0035','view')"><i class="fas fa-eye"></i></button>
                  <button class="btn-icon" title="Upload Documents"><i class="fas fa-upload"></i></button>
                  <button class="btn-icon ai-btn" title="AI Analysis" onclick="openClaimModal('CLM-2026-0035','ci')"><i class="fas fa-robot"></i></button>
                </div>
              </td>
            </tr>
            <tr class="claim-row">
              <td><input type="checkbox" class="claim-row-checkbox" onchange="updateBatchButtons()" /></td>
              <td><span class="claim-id">CLM-2026-0033</span></td>
              <td><div class="client-cell"><div class="mini-avatar jw">JW</div><span>James Whitfield</span></div></td>
              <td><span class="policy-id">P-100293</span></td>
              <td><span class="claim-type-badge ltc">Long-term Care</span></td>
              <td class="premium">$9,600</td>
              <td class="text-muted">2026-03-15</td>
              <td><span class="days-open-badge normal">30d</span></td>
              <td><span class="claim-status-badge review">Under Review</span></td>
              <td><span class="priority-badge normal">Normal</span></td>
              <td><div class="adjuster-cell"><div class="adj-avatar lt">LT</div><div class="adj-info"><div class="adj-name">Lisa Torres</div><div class="adj-team team-ltc">LTC Team</div></div></div></td>
              <td><div class="fraud-score-cell clear" onclick="openFraudDetailModal('CLM-2026-0033')"><span class="fraud-score-num">9</span><span class="fraud-score-lbl">Clear</span><i class="fas fa-check"></i></div></td>
              <td><div class="idp-status-cell" onclick="openIDPModal('CLM-2026-0033')"><span class="idp-badge idp-complete"><i class="fas fa-check-circle"></i> 4/4 Docs</span><div class="idp-scan-bar"><div class="idp-scan-fill idp-fill-green" style="width:100%"></div></div></div></td>
              <td><div class="ci-triage-cell ok" onclick="openClaimModal('CLM-2026-0033','ci')"><span class="ci-triage-label">✅ On Track</span><span class="ci-triage-sub">Approval imminent</span></div></td>
              <td><div class="ci-res-timer ok"><i class="fas fa-check-circle"></i><span class="ci-res-days">3d est.</span><div class="ci-res-bar"><div class="ci-res-fill ok" style="width:80%"></div></div></div></td>
              <td><div class="sla-cell sla-ok"><div class="sla-bar-wrap"><div class="sla-bar sla-fill-ok" style="width:28%"></div></div><span class="sla-label ok"><i class="fas fa-check-circle"></i> 17d left</span><span class="sla-deadline">State SLA: Apr 30</span></div></td>
              <td><div class="liability-cell" onclick="openClaimModal('CLM-2026-0033','liability')"><div class="liab-score-wrap low"><span class="liab-score">12%</span></div><span class="liab-flag low">Low</span><span class="litig-risk low"><i class="fas fa-check"></i> Clear</span></div></td>
              <td>
                <div class="action-btns">
                  <button class="btn-icon" title="View Claim" onclick="openClaimModal('CLM-2026-0033','view')"><i class="fas fa-eye"></i></button>
                  <button class="btn-icon" title="Upload Documents"><i class="fas fa-upload"></i></button>
                  <button class="btn-icon ai-btn" title="AI Analysis" onclick="openClaimModal('CLM-2026-0033','ci')"><i class="fas fa-robot"></i></button>
                </div>
              </td>
            </tr>
            <tr class="claim-row">
              <td><input type="checkbox" class="claim-row-checkbox" onchange="updateBatchButtons()" /></td>
              <td><span class="claim-id">CLM-2026-0031</span></td>
              <td><div class="client-cell"><div class="mini-avatar lm">LM</div><span>Linda Morrison</span></div></td>
              <td><span class="policy-id">P-100362</span></td>
              <td><span class="claim-type-badge waiver">Waiver of Premium</span></td>
              <td class="premium">$9,600/yr</td>
              <td class="text-muted">2026-03-10</td>
              <td><span class="days-open-badge normal">35d</span></td>
              <td><span class="claim-status-badge open">Open</span></td>
              <td><span class="priority-badge low">Low</span></td>
              <td><div class="adjuster-cell"><div class="adj-avatar as">AS</div><div class="adj-info"><div class="adj-name">Amy Santos</div><div class="adj-team team-support">Agent Support</div></div></div></td>
              <td><div class="fraud-score-cell clear" onclick="openFraudDetailModal('CLM-2026-0031')"><span class="fraud-score-num">7</span><span class="fraud-score-lbl">Clear</span><i class="fas fa-check"></i></div></td>
              <td><div class="idp-status-cell" onclick="openIDPModal('CLM-2026-0031')"><span class="idp-badge idp-complete"><i class="fas fa-check-circle"></i> 4/4 Docs</span><div class="idp-scan-bar"><div class="idp-scan-fill idp-fill-green" style="width:100%"></div></div></div></td>
              <td><div class="ci-triage-cell ok" onclick="openClaimModal('CLM-2026-0031','ci')"><span class="ci-triage-label">✅ Waiver Active</span><span class="ci-triage-sub">Monitor recovery</span></div></td>
              <td><div class="ci-res-timer ok"><i class="fas fa-check-circle"></i><span class="ci-res-days">Open</span><div class="ci-res-bar"><div class="ci-res-fill ok" style="width:60%"></div></div></div></td>
              <td><div class="sla-cell sla-ok"><div class="sla-bar-wrap"><div class="sla-bar sla-fill-ok" style="width:20%"></div></div><span class="sla-label ok"><i class="fas fa-infinity"></i> Ongoing</span><span class="sla-deadline">Waiver · No SLA</span></div></td>
              <td><div class="liability-cell" onclick="openClaimModal('CLM-2026-0031','liability')"><div class="liab-score-wrap low"><span class="liab-score">8%</span></div><span class="liab-flag low">Low</span><span class="litig-risk low"><i class="fas fa-check"></i> Clear</span></div></td>
              <td>
                <div class="action-btns">
                  <button class="btn-icon" title="View Claim" onclick="openClaimModal('CLM-2026-0031','view')"><i class="fas fa-eye"></i></button>
                  <button class="btn-icon" title="Upload Documents"><i class="fas fa-upload"></i></button>
                  <button class="btn-icon ai-btn" title="AI Analysis" onclick="openClaimModal('CLM-2026-0031','ci')"><i class="fas fa-robot"></i></button>
                </div>
              </td>
            </tr>
            <tr class="claim-row compassionate-row">
              <td><input type="checkbox" class="claim-row-checkbox" onchange="updateBatchButtons()" /></td>
              <td><span class="claim-id">CLM-2026-0028</span></td>
              <td><div class="client-cell"><div class="mini-avatar mg">MG</div><span>Maria Gonzalez</span></div></td>
              <td><span class="policy-id">P-100340</span></td>
              <td><span class="claim-type-badge accelerated">Accelerated Benefit</span></td>
              <td class="premium">$120,000</td>
              <td class="text-muted">2026-03-05</td>
              <td><span class="days-open-badge warn">40d</span></td>
              <td><span class="claim-status-badge pending">Pending Docs</span></td>
              <td><span class="priority-badge urgent">Urgent <span class="compassionate-tag"><i class="fas fa-heart"></i> Compassionate</span></span></td>
              <td><div class="adjuster-cell"><div class="adj-avatar cd">CD</div><div class="adj-info"><div class="adj-name">Chris Davis</div><div class="adj-team team-claims">Claims Dept.</div></div></div></td>
              <td><div class="fraud-score-cell watch" onclick="openFraudDetailModal('CLM-2026-0028')"><span class="fraud-score-num">38</span><span class="fraud-score-lbl">Watch</span><i class="fas fa-eye"></i></div></td>
              <td><div class="idp-status-cell" onclick="openIDPModal('CLM-2026-0028')"><span class="idp-badge idp-missing idp-urgent"><i class="fas fa-exclamation-circle"></i> 2/4 Docs</span><div class="idp-scan-bar"><div class="idp-scan-fill idp-fill-orange" style="width:50%"></div></div></div></td>
              <td><div class="ci-triage-cell urgent" onclick="openClaimModal('CLM-2026-0028','ci')"><span class="ci-triage-label">⚡ Compassionate</span><span class="ci-triage-sub">Terminal — expedite</span></div></td>
              <td><div class="ci-res-timer urgent"><i class="fas fa-fire"></i><span class="ci-res-days">9d est.</span><div class="ci-res-bar"><div class="ci-res-fill urgent" style="width:70%"></div></div></div></td>
              <td><div class="sla-cell sla-warn"><div class="sla-bar-wrap"><div class="sla-bar sla-fill-warn" style="width:68%"></div></div><span class="sla-label warn"><i class="fas fa-heart"></i> 5d left</span><span class="sla-deadline">Compassionate SLA: Apr 19</span></div></td>
              <td><div class="liability-cell" onclick="openClaimModal('CLM-2026-0028','liability')"><div class="liab-score-wrap med"><span class="liab-score">29%</span></div><span class="liab-flag med">Medium</span><span class="litig-risk med"><i class="fas fa-exclamation"></i> Watch</span></div></td>
              <td>
                <div class="action-btns">
                  <button class="btn-icon" title="View Claim" onclick="openClaimModal('CLM-2026-0028','view')"><i class="fas fa-eye"></i></button>
                  <button class="btn-icon" title="Upload Documents"><i class="fas fa-upload"></i></button>
                  <button class="btn-icon ai-btn" title="AI Analysis" onclick="openClaimModal('CLM-2026-0028','ci')"><i class="fas fa-robot"></i></button>
                </div>
              </td>
            </tr>
            <tr class="claim-row">
              <td><input type="checkbox" class="claim-row-checkbox" onchange="updateBatchButtons()" /></td>
              <td><span class="claim-id">CLM-2026-0025</span></td>
              <td><div class="client-cell"><div class="mini-avatar kp">KP</div><span>Kevin Park</span></div></td>
              <td><span class="policy-id">P-100350</span></td>
              <td><span class="claim-type-badge death">Death Benefit</span></td>
              <td class="premium">$250,000</td>
              <td class="text-muted">2026-02-28</td>
              <td><span class="days-open-badge warn">45d</span></td>
              <td><span class="claim-status-badge review">Under Review</span></td>
              <td><span class="priority-badge normal">Normal</span></td>
              <td><div class="adjuster-cell"><div class="adj-avatar cd">CD</div><div class="adj-info"><div class="adj-name">Chris Davis</div><div class="adj-team team-claims">Claims Dept.</div></div></div></td>
              <td><div class="fraud-score-cell flagged" onclick="openFraudDetailModal('CLM-2026-0025')"><span class="fraud-score-num">78</span><span class="fraud-score-lbl">Flagged</span><i class="fas fa-exclamation-triangle"></i></div></td>
              <td><div class="idp-status-cell" onclick="openIDPModal('CLM-2026-0025')"><span class="idp-badge idp-missing idp-urgent"><i class="fas fa-exclamation-circle"></i> 1/4 Docs</span><div class="idp-scan-bar"><div class="idp-scan-fill idp-fill-red" style="width:25%"></div></div></div></td>
              <td><div class="ci-triage-cell flagged" onclick="openClaimModal('CLM-2026-0025','ci')"><span class="ci-triage-label">🚨 Fraud Review</span><span class="ci-triage-sub">Coverage pending</span></div></td>
              <td><div class="ci-res-timer flagged"><i class="fas fa-exclamation-triangle"></i><span class="ci-res-days">Hold</span><div class="ci-res-bar"><div class="ci-res-fill flagged" style="width:15%"></div></div></div></td>
              <td><div class="sla-cell sla-hold"><div class="sla-bar-wrap"><div class="sla-bar sla-fill-hold" style="width:100%"></div></div><span class="sla-label hold"><i class="fas fa-ban"></i> On Hold</span><span class="sla-deadline">Fraud review · Paused</span></div></td>
              <td><div class="liability-cell" onclick="openClaimModal('CLM-2026-0025','liability')"><div class="liab-score-wrap critical"><span class="liab-score">88%</span></div><span class="liab-flag critical">Critical</span><span class="litig-risk critical"><i class="fas fa-gavel"></i> Litig. Risk</span></div></td>
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

      {/* ── Fraud + IDP side-by-side grid ── */}
      <div class="fraud-idp-grid">

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
      <div class="idp-hub-panel idp-hub-panel-grid">
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

      </div>{/* ── end fraud-idp-grid ── */}


      {/* ── Recently Resolved Claims ── */}
      <div class="claims-section-label" style="margin-top:28px">
        <i class="fas fa-check-circle" style="color:#059669"></i> Recently Resolved Claims
        <span class="claims-count-badge resolved">14 YTD</span>
        <span class="claims-denied-badge"><i class="fas fa-times-circle"></i> 1 Denied · Appeal window open</span>
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
              <th><i class="fas fa-tag" style="color:#64748b;margin-right:4px"></i>Resolution Category</th>
              <th><i class="fas fa-times-circle" style="color:#dc2626;margin-right:4px"></i>Denial Reason</th>
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
              <td><span class="res-category fast-track"><i class="fas fa-bolt"></i> Fast-Track</span></td>
              <td><span class="denial-reason none">—</span></td>
              <td><div class="action-btns">
                <button class="btn-icon" title="View" onclick="openClaimModal('CLM-2026-0022','view')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" title="Re-open" onclick="openReopenModal('CLM-2026-0022')"><i class="fas fa-redo"></i></button>
              </div></td>
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
              <td><span class="res-category standard"><i class="fas fa-check"></i> Standard</span></td>
              <td><span class="denial-reason none">—</span></td>
              <td><div class="action-btns">
                <button class="btn-icon" title="View" onclick="openClaimModal('CLM-2026-0019','view')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" title="Re-open" onclick="openReopenModal('CLM-2026-0019')"><i class="fas fa-redo"></i></button>
              </div></td>
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
              <td><span class="res-category standard"><i class="fas fa-check"></i> Standard</span></td>
              <td><span class="denial-reason none">—</span></td>
              <td><div class="action-btns">
                <button class="btn-icon" title="View" onclick="openClaimModal('CLM-2026-0015','view')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" title="Re-open" onclick="openReopenModal('CLM-2026-0015')"><i class="fas fa-redo"></i></button>
              </div></td>
            </tr>
            <tr class="claim-row-denied">
              <td><span class="claim-id">CLM-2025-0201</span></td>
              <td><div class="client-cell"><div class="mini-avatar dk">DK</div><span>Daniel Kim</span></div></td>
              <td><span class="policy-id">P-100371</span></td>
              <td><span class="claim-type-badge disability">Disability</span></td>
              <td class="premium text-muted">$0</td>
              <td class="text-muted">2025-11-15</td>
              <td class="text-muted">2025-12-02</td>
              <td><span class="claim-status-badge denied">Denied</span></td>
              <td><span class="res-days slow">17 days</span></td>
              <td><span class="res-category escalated"><i class="fas fa-arrow-up"></i> Escalated</span></td>
              <td><span class="denial-reason active" title="Pre-existing condition exclusion — disability pre-dates policy by 8 months">Pre-existing Condition</span></td>
              <td><div class="action-btns">
                <button class="btn-icon" title="View" onclick="openClaimModal('CLM-2025-0201','view')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon appeal-btn" title="File Appeal" onclick="openAppealModal('CLM-2025-0201')"><i class="fas fa-balance-scale"></i></button>
                <button class="btn-icon" title="Re-open" onclick="openReopenModal('CLM-2025-0201')"><i class="fas fa-redo"></i></button>
              </div></td>
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
              <td><span class="res-category standard"><i class="fas fa-check"></i> Standard</span></td>
              <td><span class="denial-reason none">—</span></td>
              <td><div class="action-btns">
                <button class="btn-icon" title="View" onclick="openClaimModal('CLM-2025-0198','view')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" title="Re-open" onclick="openReopenModal('CLM-2025-0198')"><i class="fas fa-redo"></i></button>
              </div></td>
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

      {/* ── Claims Performance Analytics Panel ── */}
      <div class="cpa-panel" id="cpa-panel">
        <div class="cpa-header" onclick="toggleCPAPanel()">
          <div class="cpa-header-left">
            <div class="cpa-icon"><i class="fas fa-chart-line"></i></div>
            <div>
              <div class="cpa-title">My Claims Performance <span class="cpa-period">Q2 2026 (Apr 1 – Apr 13)</span></div>
              <div class="cpa-sub">Personal productivity metrics · AI-powered benchmarking against team averages</div>
            </div>
          </div>
          <button class="cpa-collapse-btn" id="cpa-collapse-btn" title="Toggle panel"><i class="fas fa-chevron-down"></i></button>
        </div>
        <div class="cpa-body" id="cpa-body">
          <div class="cpa-kpi-row">
            <div class="cpa-kpi green">
              <div class="cpa-kpi-val">7</div>
              <div class="cpa-kpi-lbl">Claims Active</div>
              <div class="cpa-kpi-bench"><i class="fas fa-users"></i> Team avg: 5.2</div>
            </div>
            <div class="cpa-kpi green">
              <div class="cpa-kpi-val">4</div>
              <div class="cpa-kpi-lbl">Closed This Month</div>
              <div class="cpa-kpi-bench"><i class="fas fa-users"></i> Team avg: 3.8</div>
            </div>
            <div class="cpa-kpi blue">
              <div class="cpa-kpi-val">5.2d</div>
              <div class="cpa-kpi-lbl">Avg Resolution Time</div>
              <div class="cpa-kpi-bench"><i class="fas fa-users"></i> Team avg: 6.1d</div>
            </div>
            <div class="cpa-kpi blue">
              <div class="cpa-kpi-val">3.1d</div>
              <div class="cpa-kpi-lbl">Avg Payout Turnaround</div>
              <div class="cpa-kpi-bench"><i class="fas fa-users"></i> Team avg: 3.8d</div>
            </div>
            <div class="cpa-kpi orange">
              <div class="cpa-kpi-val">67%</div>
              <div class="cpa-kpi-lbl">Doc Request Response Rate</div>
              <div class="cpa-kpi-bench"><i class="fas fa-arrow-down" style="color:#dc2626"></i> Below 75% target</div>
            </div>
            <div class="cpa-kpi green">
              <div class="cpa-kpi-val">93%</div>
              <div class="cpa-kpi-lbl">SLA Compliance Rate</div>
              <div class="cpa-kpi-bench"><i class="fas fa-check" style="color:#059669"></i> Above 90% target</div>
            </div>
            <div class="cpa-kpi red">
              <div class="cpa-kpi-val">1</div>
              <div class="cpa-kpi-lbl">SLA Breaches YTD</div>
              <div class="cpa-kpi-bench"><i class="fas fa-users"></i> Team avg: 2.1</div>
            </div>
            <div class="cpa-kpi purple">
              <div class="cpa-kpi-val">94%</div>
              <div class="cpa-kpi-lbl">AI Triage Accuracy</div>
              <div class="cpa-kpi-bench"><i class="fas fa-robot" style="color:#7c3aed"></i> AI-assisted</div>
            </div>
          </div>
          <div class="cpa-insights">
            <div class="cpa-insight good"><i class="fas fa-star"></i> <strong>Strength:</strong> Your resolution time (5.2d) is 15% faster than team average — keep it up.</div>
            <div class="cpa-insight warn"><i class="fas fa-exclamation-triangle"></i> <strong>Opportunity:</strong> Doc request response rate (67%) is below the 75% target — send reminders sooner after filing.</div>
            <div class="cpa-insight info"><i class="fas fa-robot"></i> <strong>AI Tip:</strong> Enabling auto-send reminders at 48h intervals could lift response rate to ~82% based on portfolio patterns.</div>
          </div>
          <div class="cpa-footer">
            <button class="btn btn-ai" onclick="sendContextMessage('Show my claims performance for Q2 2026 — resolution times, SLA compliance, doc response rates and recommendations','claims')"><i class="fas fa-robot"></i> Full AI Performance Analysis</button>
            <button class="btn btn-outline-sm" onclick="alert('Exporting performance report…')"><i class="fas fa-download"></i> Export Report</button>
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
                <button class="dmt-tab liability-tab" onclick="switchClaimTab('liability',this)"><i class="fas fa-gavel"></i> Liability</button>
                <button class="dmt-tab docs-tab" onclick="switchClaimTab('docs',this)"><i class="fas fa-file-import"></i> Documents</button>
                <button class="dmt-tab comms-tab" onclick="switchClaimTab('comms',this)"><i class="fas fa-comments"></i> Communications</button>
                <button class="dmt-tab bene-tab" onclick="switchClaimTab('bene',this)"><i class="fas fa-users"></i> Beneficiary</button>
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

      {/* ── Hero Header ── */}
      <div class="aah-hero">
        <div class="aah-hero-left">
          <div class="aah-hero-icon">
            <i class="fas fa-robot"></i>
            <span class="aah-pulse-ring"></span>
          </div>
          <div class="aah-hero-text">
            <h2 class="aah-hero-title">NOVA <span class="aah-hero-ai">AI Agent Hub</span></h2>
            <p class="aah-hero-sub">Holistic Agentic AI — Insurance · Investments · Retirement · Advisory</p>
          </div>
        </div>
        <div class="aah-hero-kpis">
          <div class="aah-kpi">
            <div class="aah-kpi-val">8</div>
            <div class="aah-kpi-lbl">Active Agents</div>
          </div>
          <div class="aah-kpi-divider"></div>
          <div class="aah-kpi">
            <div class="aah-kpi-val">247</div>
            <div class="aah-kpi-lbl">Clients Monitored</div>
          </div>
          <div class="aah-kpi-divider"></div>
          <div class="aah-kpi">
            <div class="aah-kpi-val">42</div>
            <div class="aah-kpi-lbl">Alerts Today</div>
          </div>
          <div class="aah-kpi-divider"></div>
          <div class="aah-kpi">
            <div class="aah-kpi-val">$31.2K</div>
            <div class="aah-kpi-lbl">AI Revenue</div>
          </div>
        </div>
        <div class="aah-hero-status">
          <span class="aah-online-dot"></span>
          <span class="aah-online-label">AI Online · GPT-4 Turbo</span>
          <button class="aah-settings-btn" onclick="switchSettingsTab('ai',null);navigateTo('settings')"><i class="fas fa-sliders-h"></i></button>
        </div>
      </div>

      {/* ── Domain Insight Strip ── */}
      <div class="aah-domain-strip">
        <div class="aah-ds-card aah-ins">
          <div class="aah-ds-top">
            <div class="aah-ds-icon" style="background:#dbeafe;color:#003087"><i class="fas fa-shield-alt"></i></div>
            <div class="aah-ds-head">
              <div class="aah-ds-label">Insurance</div>
              <div class="aah-ds-score"><span class="aah-score-dot green"></span>91/100</div>
            </div>
          </div>
          <div class="aah-ds-metrics">
            <span><i class="fas fa-sync-alt"></i> 23 renewals</span>
            <span><i class="fas fa-file-medical-alt"></i> 7 claims</span>
            <span class="aah-ds-alert"><i class="fas fa-exclamation-triangle"></i> 4 lapse risks</span>
          </div>
          <button class="aah-ds-btn" onclick="sendQuickMessage('Show me insurance renewal and lapse risks')"><i class="fas fa-robot"></i> Ask AI</button>
        </div>
        <div class="aah-ds-card aah-inv">
          <div class="aah-ds-top">
            <div class="aah-ds-icon" style="background:#d1fae5;color:#059669"><i class="fas fa-chart-line"></i></div>
            <div class="aah-ds-head">
              <div class="aah-ds-label">Investments</div>
              <div class="aah-ds-score"><span class="aah-score-dot green"></span>76/100</div>
            </div>
          </div>
          <div class="aah-ds-metrics">
            <span><i class="fas fa-coins"></i> $4.2M AUM</span>
            <span><i class="fas fa-chart-pie"></i> 3 gaps</span>
            <span class="aah-ds-alert"><i class="fas fa-balance-scale"></i> 2 rebalances</span>
          </div>
          <button class="aah-ds-btn" onclick="sendQuickMessage('Show investment opportunities and portfolio gaps')"><i class="fas fa-robot"></i> Ask AI</button>
        </div>
        <div class="aah-ds-card aah-ret">
          <div class="aah-ds-top">
            <div class="aah-ds-icon" style="background:#fef3c7;color:#d97706"><i class="fas fa-umbrella-beach"></i></div>
            <div class="aah-ds-head">
              <div class="aah-ds-label">Retirement</div>
              <div class="aah-ds-score"><span class="aah-score-dot amber"></span>82/100</div>
            </div>
          </div>
          <div class="aah-ds-metrics">
            <span><i class="fas fa-piggy-bank"></i> 4 annuity</span>
            <span><i class="fas fa-user-clock"></i> 2 income gaps</span>
            <span><i class="fas fa-chart-area"></i> 6 near-retire</span>
          </div>
          <button class="aah-ds-btn" onclick="sendQuickMessage('Which clients need retirement planning?')"><i class="fas fa-robot"></i> Ask AI</button>
        </div>
        <div class="aah-ds-card aah-adv">
          <div class="aah-ds-top">
            <div class="aah-ds-icon" style="background:#f5f3ff;color:#7c3aed"><i class="fas fa-handshake"></i></div>
            <div class="aah-ds-head">
              <div class="aah-ds-label">Advisory</div>
              <div class="aah-ds-score"><span class="aah-score-dot purple"></span>79/100</div>
            </div>
          </div>
          <div class="aah-ds-metrics">
            <span><i class="fas fa-landmark"></i> 4 estate</span>
            <span><i class="fas fa-building"></i> 2 UMA</span>
            <span><i class="fas fa-briefcase"></i> 3 biz reviews</span>
          </div>
          <button class="aah-ds-btn" onclick="sendQuickMessage('Show estate planning and advisory opportunities')"><i class="fas fa-robot"></i> Ask AI</button>
        </div>
      </div>

      <div class="ai-layout">
        {/* ── Agent Cards Panel ── */}
        <div class="aah-agents-panel">

          {/* Panel header */}
          <div class="aah-panel-header">
            <div class="aah-panel-title"><i class="fas fa-robot"></i> AI Agents</div>
            <div class="aah-panel-meta">
              <span class="aah-panel-badge active">8 Active</span>
              <span class="aah-panel-badge standby">3 Standby</span>
              <button class="aah-run-all-btn" onclick="sendQuickMessage('Run all agents — give me a consolidated summary of top actions across insurance, investments, retirement and advisory')"><i class="fas fa-bolt"></i> Run All</button>
            </div>
          </div>

          {/* ── Insurance ── */}
          <div class="aah-domain-label aah-dl-ins"><i class="fas fa-shield-alt"></i> Insurance &amp; Underwriting</div>

          <div class="aah-agent-card aah-featured" onclick="selectAgent('advisor')">
            <div class="aah-agent-icon aah-icon-gold"><i class="fas fa-brain"></i></div>
            <div class="aah-agent-body">
              <div class="aah-agent-header-row">
                <h4 class="aah-agent-name">Smart Advisor Agent</h4>
                <span class="aah-agent-status active"><i class="fas fa-circle"></i> Active</span>
              </div>
              <p class="aah-agent-desc">Analyzes your entire book — insurance, investments, retirement and advisory — to surface the highest-value opportunities</p>
              <div class="aah-agent-tags"><span>All Domains</span><span>Cross-sell</span><span>Upsell</span></div>
            </div>
          </div>

          <div class="aah-agent-card" onclick="selectAgent('renewal')">
            <div class="aah-agent-icon aah-icon-green"><i class="fas fa-sync-alt"></i></div>
            <div class="aah-agent-body">
              <div class="aah-agent-header-row">
                <h4 class="aah-agent-name">Renewal Automation Agent</h4>
                <span class="aah-agent-status active"><i class="fas fa-circle"></i> Active</span>
              </div>
              <p class="aah-agent-desc">Monitors policy renewals, sends proactive outreach, and prepares renewal packages automatically</p>
              <div class="aah-agent-tags"><span>Renewal Tracking</span><span>Auto-Outreach</span></div>
              <div class="aah-agent-stats-row">
                <span class="aah-stat green"><i class="fas fa-check"></i> 15/23 sent</span>
                <span class="aah-stat amber"><i class="fas fa-clock"></i> 8 pending</span>
              </div>
            </div>
          </div>

          <div class="aah-agent-card aah-highlighted" onclick="selectAgent('retention')">
            <div class="aah-agent-icon aah-icon-red"><i class="fas fa-heartbeat"></i></div>
            <div class="aah-agent-body">
              <div class="aah-agent-header-row">
                <h4 class="aah-agent-name">Retention Intelligence Agent <span class="aah-new-badge">NEW</span></h4>
                <span class="aah-agent-status active"><i class="fas fa-circle"></i> Active</span>
              </div>
              <p class="aah-agent-desc">Predicts policy lapses 60–90 days in advance, monitors cash-value thresholds, scores renewal risk, and auto-generates personalised save scripts</p>
              <div class="aah-agent-tags"><span>Lapse Prediction</span><span>Renewal Risk</span><span>Save Scripts</span></div>
              <div class="aah-agent-stats-row">
                <span class="aah-stat red"><i class="fas fa-exclamation-circle"></i> 2 Urgent</span>
                <span class="aah-stat amber"><i class="fas fa-dollar-sign"></i> $62.6K at Risk</span>
                <span class="aah-stat green"><i class="fas fa-redo"></i> 23 Renewals</span>
              </div>
            </div>
          </div>

          <div class="aah-agent-card aah-highlighted" onclick="selectAgent('underwriting-intelligence')">
            <div class="aah-agent-icon aah-icon-blue"><i class="fas fa-microscope"></i></div>
            <div class="aah-agent-body">
              <div class="aah-agent-header-row">
                <h4 class="aah-agent-name">Underwriting Intelligence Agent <span class="aah-new-badge">NEW</span></h4>
                <span class="aah-agent-status active"><i class="fas fa-circle"></i> Active</span>
              </div>
              <p class="aah-agent-desc">ML-powered STP scoring, NLP medical-record analysis, APS avoidance engine — auto-approves low-risk cases and eliminates 73% of unnecessary APS orders</p>
              <div class="aah-agent-tags"><span>STP Scoring</span><span>APS Avoidance</span><span>NLP Records</span></div>
              <div class="aah-agent-stats-row">
                <span class="aah-stat green"><i class="fas fa-bolt"></i> 5 Auto-Approved</span>
                <span class="aah-stat amber"><i class="fas fa-file-medical"></i> 18 APS Avoided</span>
                <span class="aah-stat blue"><i class="fas fa-bullseye"></i> 94.6% Acc.</span>
              </div>
            </div>
          </div>

          <div class="aah-agent-card aah-highlighted" onclick="selectAgent('claims')">
            <div class="aah-agent-icon aah-icon-cyan"><i class="fas fa-clipboard-check"></i></div>
            <div class="aah-agent-body">
              <div class="aah-agent-header-row">
                <h4 class="aah-agent-name">Claims Automation Agent</h4>
                <span class="aah-agent-status active"><i class="fas fa-circle"></i> Active</span>
              </div>
              <p class="aah-agent-desc">Processes claims, requests missing documents, auto-triages in &lt;2 min and provides real-time claim status updates</p>
              <div class="aah-agent-tags"><span>Claims Processing</span><span>Document Request</span><span>Auto-Triage</span></div>
              <div class="aah-agent-stats-row">
                <span class="aah-stat red"><i class="fas fa-fire"></i> 2 Urgent</span>
                <span class="aah-stat blue"><i class="fas fa-file-alt"></i> 7 Open</span>
                <span class="aah-stat green"><i class="fas fa-check-circle"></i> 6/6 Triaged</span>
              </div>
            </div>
          </div>

          <div class="aah-agent-card" onclick="selectAgent('claims-intelligence')">
            <div class="aah-agent-icon aah-icon-purple"><i class="fas fa-brain"></i></div>
            <div class="aah-agent-body">
              <div class="aah-agent-header-row">
                <h4 class="aah-agent-name">Claims Intelligence Agent <span class="aah-new-badge">NEW</span></h4>
                <span class="aah-agent-status active"><i class="fas fa-circle"></i> Active</span>
              </div>
              <p class="aah-agent-desc">ML fraud detection, NLP document analysis, predictive resolution timers and smart doc request automation</p>
              <div class="aah-agent-tags"><span>Fraud Detection</span><span>NLP Analysis</span><span>Smart Triage</span></div>
              <div class="aah-agent-stats-row">
                <span class="aah-stat red"><i class="fas fa-exclamation-circle"></i> 1 Flagged</span>
                <span class="aah-stat amber"><i class="fas fa-eye"></i> 2 Watch</span>
                <span class="aah-stat blue"><i class="fas fa-brain"></i> 94% NLP</span>
              </div>
            </div>
          </div>

          {/* ── Investments ── */}
          <div class="aah-domain-label aah-dl-inv"><i class="fas fa-chart-line"></i> Investments &amp; Advisory</div>

          <div class="aah-agent-card" onclick="selectAgent('portfolio')">
            <div class="aah-agent-icon aah-icon-emerald"><i class="fas fa-coins"></i></div>
            <div class="aah-agent-body">
              <div class="aah-agent-header-row">
                <h4 class="aah-agent-name">Portfolio Optimizer Agent</h4>
                <span class="aah-agent-status active"><i class="fas fa-circle"></i> Active</span>
              </div>
              <p class="aah-agent-desc">Monitors AUM, identifies rebalancing opportunities, recommends annuities, mutual funds, ETFs and 529 plans</p>
              <div class="aah-agent-tags"><span>AUM Monitoring</span><span>Rebalancing</span><span>529</span></div>
              <div class="aah-agent-stats-row">
                <span class="aah-stat green"><i class="fas fa-coins"></i> $4.2M AUM</span>
                <span class="aah-stat amber"><i class="fas fa-balance-scale"></i> 2 Rebalances</span>
              </div>
            </div>
          </div>

          <div class="aah-agent-card" onclick="selectAgent('estate')">
            <div class="aah-agent-icon aah-icon-violet"><i class="fas fa-landmark"></i></div>
            <div class="aah-agent-body">
              <div class="aah-agent-header-row">
                <h4 class="aah-agent-name">Estate Planning Agent</h4>
                <span class="aah-agent-status standby"><i class="fas fa-circle"></i> Standby</span>
              </div>
              <p class="aah-agent-desc">Identifies estate planning needs, generates client-ready briefs, and coordinates trust and wealth reviews</p>
              <div class="aah-agent-tags"><span>Estate Analysis</span><span>Trust Review</span><span>UMA</span></div>
            </div>
          </div>

          <div class="aah-agent-card" onclick="selectAgent('business')">
            <div class="aah-agent-icon aah-icon-orange"><i class="fas fa-building"></i></div>
            <div class="aah-agent-body">
              <div class="aah-agent-header-row">
                <h4 class="aah-agent-name">Business Services Agent</h4>
                <span class="aah-agent-status standby"><i class="fas fa-circle"></i> Standby</span>
              </div>
              <p class="aah-agent-desc">Handles small business insurance, executive benefits, NQDC, COLI, and employee benefits design</p>
              <div class="aah-agent-tags"><span>SMB Insurance</span><span>NQDC</span><span>COLI</span></div>
            </div>
          </div>

          {/* ── Retirement ── */}
          <div class="aah-domain-label aah-dl-ret"><i class="fas fa-umbrella-beach"></i> Retirement</div>

          <div class="aah-agent-card" onclick="selectAgent('retirement')">
            <div class="aah-agent-icon aah-icon-amber"><i class="fas fa-piggy-bank"></i></div>
            <div class="aah-agent-body">
              <div class="aah-agent-header-row">
                <h4 class="aah-agent-name">Retirement Planning Agent</h4>
                <span class="aah-agent-status active"><i class="fas fa-circle"></i> Active</span>
              </div>
              <p class="aah-agent-desc">Identifies clients approaching retirement, calculates income gaps, and recommends immediate or deferred annuities</p>
              <div class="aah-agent-tags"><span>Income Gap</span><span>Annuities</span><span>Projections</span></div>
              <div class="aah-agent-stats-row">
                <span class="aah-stat amber"><i class="fas fa-user-clock"></i> 4 Candidates</span>
                <span class="aah-stat red"><i class="fas fa-exclamation"></i> 2 Income Gaps</span>
              </div>
            </div>
          </div>

          {/* ── Compliance ── */}
          <div class="aah-domain-label aah-dl-cmp"><i class="fas fa-shield-alt"></i> Compliance</div>

          <div class="aah-agent-card" onclick="selectAgent('compliance')">
            <div class="aah-agent-icon aah-icon-slate"><i class="fas fa-gavel"></i></div>
            <div class="aah-agent-body">
              <div class="aah-agent-header-row">
                <h4 class="aah-agent-name">Compliance &amp; Reporting Agent</h4>
                <span class="aah-agent-status standby"><i class="fas fa-circle"></i> Standby</span>
              </div>
              <p class="aah-agent-desc">Automates regulatory reporting, flags compliance risks across all product lines, and generates audit-ready docs</p>
              <div class="aah-agent-tags"><span>Regulatory</span><span>Audit</span><span>Risk</span></div>
            </div>
          </div>

          {/* ── NLP Policy Intelligence ── */}
          <div class="aah-domain-label aah-dl-nlp"><i class="fas fa-brain"></i> NLP Policy Intelligence</div>

          <div class="aah-agent-card aah-highlighted" onclick="selectAgent('nlp')">
            <div class="aah-agent-icon aah-icon-nlp"><i class="fas fa-brain"></i></div>
            <div class="aah-agent-body">
              <div class="aah-agent-header-row">
                <h4 class="aah-agent-name">NLP Policy Risk Expert <span class="aah-new-badge">NEW</span></h4>
                <span class="aah-agent-status active"><i class="fas fa-circle"></i> Active</span>
              </div>
              <p class="aah-agent-desc">Reads every policy clause with NLP — flags exclusions, ambiguities, regulatory risks, and lapse triggers. Generates plain-language client summaries.</p>
              <div class="aah-agent-tags"><span>Clause Analysis</span><span>Risk Flags</span><span>Plain Language</span><span>Benchmark</span></div>
              <div class="aah-agent-stats-row">
                <span class="aah-stat red"><i class="fas fa-exclamation-circle"></i> 2 Urgent</span>
                <span class="aah-stat amber"><i class="fas fa-flag"></i> 3 Flagged</span>
                <span class="aah-stat blue"><i class="fas fa-file-contract"></i> 8 Scanned</span>
              </div>
            </div>
          </div>

        </div>{/* /aah-agents-panel */}

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
              <button class="btn-tiny" onclick="clearChat()"><i class="fas fa-redo-alt"></i> New Chat</button>
            </div>
          </div>

          <div class="chat-messages" id="chat-messages">
            <div class="chat-msg bot">
              <div class="msg-avatar" style="background:#fef3c7;color:#d97706"><i class="fas fa-brain"></i></div>
              <div class="msg-bubble">
                <p>Hello! I'm your <strong>NOVA Smart Advisor AI Agent</strong> — analyzing your complete book of business across all four domains.</p>
                <p><strong>Today's Snapshot:</strong> 8 active agents · 42 alerts · $31.2K AI revenue opportunity · 247 clients monitored</p>
                <p>Select an agent on the left to focus, or ask me anything:</p>
                <div class="quick-suggestions">
                  <button onclick="sendQuickMessage('Show me all upsell and cross-sell opportunities')">🎯 All opportunities</button>
                  <button onclick="sendQuickMessage('Which policies are up for renewal in the next 90 days?')">🔄 Renewals due</button>
                  <button onclick="sendQuickMessage('Which clients need retirement planning?')">🏖️ Retirement gaps</button>
                  <button onclick="sendQuickMessage('Show estate planning opportunities')">🏛️ Estate planning</button>
                  <button onclick="sendQuickMessage('Show investment portfolio gaps and rebalancing opportunities')">📈 Investment gaps</button>
                  <button onclick="sendQuickMessage('Summarize my dashboard for today — performance, alerts, and priority actions')">📊 Daily summary</button>
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

            {/* UW Intelligence */}
            <div class="ctx-group uwi-ctx-group">
              <span class="ctx-group-label uwi-ctx-label"><i class="fas fa-brain"></i> UW Intelligence</span>
              <div class="ctx-btns">
                <button class="ctx-btn ctx-uwi" onclick="openUWModal('UW-2026-0018')">Alex Rivera STP 88 ⚡</button>
                <button class="ctx-btn ctx-uwi" onclick="openUWModal('UW-2026-0012')">Thomas Wright STP 91 ✅</button>
                <button class="ctx-btn ctx-uwi" onclick="sendQuickMessage('Which underwriting cases qualify for auto-approval today? Provide STP scores and next steps.')">Auto-Approve Today</button>
                <button class="ctx-btn ctx-uwi" onclick="openAPSAvoidance()">APS Engine</button>
                <button class="ctx-btn ctx-uwi" onclick="openUWIReport()">UW Intel Report</button>
              </div>
            </div>

            {/* Sales AI Intelligence */}
            <div class="ctx-group sales-ai-ctx-group">
              <span class="ctx-group-label sales-ai-ctx-label"><i class="fas fa-funnel-dollar"></i> Sales AI</span>
              <div class="ctx-btns">
                <button class="ctx-btn ctx-sai" onclick="openDealAIModal('D008')">Kevin Park 95% ⚡</button>
                <button class="ctx-btn ctx-sai" onclick="openDealAIModal('D004')">Santos UL 91% 🔥</button>
                <button class="ctx-btn ctx-sai" onclick="openSalesAIReport()">AI Win Report</button>
                <button class="ctx-btn ctx-sai" onclick="openConversionForecast()">Conv. Forecast</button>
                <button class="ctx-btn ctx-sai" onclick="sendContextMessage('Run NBA engine — give me ranked next-best-actions for all 9 deals with urgency flags','smart-advisor')">NBA Engine</button>
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
        <div class="automation-section-header">
          <div class="automation-section-title"><i class="fas fa-magic"></i> Active Automation Workflows — All Domains</div>
          <button class="aah-run-all-btn" onclick="sendQuickMessage('Run all automation workflows — give me a consolidated status update and any actions needed')"><i class="fas fa-bolt"></i> Run All Workflows</button>
        </div>
        <div class="wf-summary-bar">
          <div class="wf-summary-chip running-chip"><div class="chip-dot"></div><span class="chip-count">3</span><span>Running</span></div>
          <div class="wf-summary-chip paused-chip"><div class="chip-dot"></div><span class="chip-count">2</span><span>Paused</span></div>
          <div class="wf-summary-chip idle-chip"><div class="chip-dot"></div><span class="chip-count">2</span><span>Idle</span></div>
          <div style="margin-left:auto;font-size:11px;color:#64748b;">Last synced: <strong style="color:#1e293b">2 min ago</strong></div>
        </div>
        <div class="workflow-grid">
          <div class="workflow-card running" id="wf-card-renewal-campaign">
            <div class="wf-domain-tag ins-tag"><i class="fas fa-shield-alt"></i> Insurance</div>
            <div class="wf-status" id="wf-status-renewal-campaign"><span class="pulse-dot"></span> Running</div>
            <div class="wf-icon"><i class="fas fa-envelope-open-text"></i></div>
            <h4>Renewal Email Campaign</h4>
            <p>Auto-sending personalized renewal reminders to 23 clients due in 90 days</p>
            <div class="wf-progress">
              <div class="wf-progress-bar-wrap"><div class="wf-progress-bar" id="wf-bar-renewal-campaign" style="width:65%"></div></div>
              <span id="wf-lbl-renewal-campaign">15/23 sent</span>
            </div>
            <div class="wf-actions">
              <button class="wf-btn primary" id="wf-run-renewal-campaign" onclick="runWorkflow('renewal-campaign')"><i class="fas fa-play"></i> Run Now</button>
              <button class="wf-btn secondary" onclick="viewWorkflow('renewal-campaign')"><i class="fas fa-eye"></i> View</button>
            </div>
          </div>
          <div class="workflow-card running" id="wf-card-portfolio-monitor">
            <div class="wf-domain-tag ins-tag"><i class="fas fa-shield-alt"></i> Insurance</div>
            <div class="wf-status" id="wf-status-portfolio-monitor"><span class="pulse-dot"></span> Running</div>
            <div class="wf-icon"><i class="fas fa-chart-line"></i></div>
            <h4>Portfolio Health Monitor</h4>
            <p>Continuously monitoring 1,842 policies for lapse risk, coverage gaps, and opportunities</p>
            <div class="wf-progress">
              <div class="wf-progress-bar-wrap"><div class="wf-progress-bar" id="wf-bar-portfolio-monitor" style="width:100%"></div></div>
              <span id="wf-lbl-portfolio-monitor">Always On</span>
            </div>
            <div class="wf-actions">
              <button class="wf-btn primary" id="wf-run-portfolio-monitor" onclick="runWorkflow('portfolio-monitor')"><i class="fas fa-file-alt"></i> Report</button>
              <button class="wf-btn secondary" onclick="viewWorkflow('portfolio-monitor')"><i class="fas fa-bell"></i> Alerts</button>
            </div>
          </div>
          <div class="workflow-card running" id="wf-card-aum-rebalancing">
            <div class="wf-domain-tag inv-tag"><i class="fas fa-chart-line"></i> Investments</div>
            <div class="wf-status" id="wf-status-aum-rebalancing"><span class="pulse-dot"></span> Running</div>
            <div class="wf-icon"><i class="fas fa-balance-scale"></i></div>
            <h4>AUM Rebalancing Monitor</h4>
            <p>Tracks drift in $4.2M AUM across 62 investment clients; flags rebalancing needs</p>
            <div class="wf-progress">
              <div class="wf-progress-bar-wrap"><div class="wf-progress-bar" id="wf-bar-aum-rebalancing" style="width:100%;background:#059669"></div></div>
              <span id="wf-lbl-aum-rebalancing">2 rebalances pending</span>
            </div>
            <div class="wf-actions">
              <button class="wf-btn primary" id="wf-run-aum-rebalancing" onclick="runWorkflow('aum-rebalancing')"><i class="fas fa-balance-scale"></i> Rebalance</button>
              <button class="wf-btn secondary" onclick="viewWorkflow('aum-rebalancing')"><i class="fas fa-coins"></i> AUM</button>
            </div>
          </div>
          <div class="workflow-card running" id="wf-card-retirement-gap">
            <div class="wf-domain-tag ret-tag"><i class="fas fa-umbrella-beach"></i> Retirement</div>
            <div class="wf-status" id="wf-status-retirement-gap"><span class="pulse-dot"></span> Running</div>
            <div class="wf-icon"><i class="fas fa-piggy-bank"></i></div>
            <h4>Retirement Income Gap Scan</h4>
            <p>Analyzes clients aged 50+ for retirement income shortfalls and annuity suitability</p>
            <div class="wf-progress">
              <div class="wf-progress-bar-wrap"><div class="wf-progress-bar" id="wf-bar-retirement-gap" style="width:100%;background:#d97706"></div></div>
              <span id="wf-lbl-retirement-gap">4 candidates found</span>
            </div>
            <div class="wf-actions">
              <button class="wf-btn primary" id="wf-run-retirement-gap" onclick="runWorkflow('retirement-gap')"><i class="fas fa-piggy-bank"></i> Details</button>
              <button class="wf-btn secondary" onclick="viewWorkflow('retirement-gap')"><i class="fas fa-user-clock"></i> Priority</button>
            </div>
          </div>
          <div class="workflow-card paused" id="wf-card-life-events">
            <div class="wf-domain-tag ins-tag"><i class="fas fa-shield-alt"></i> Insurance</div>
            <div class="wf-status paused" id="wf-status-life-events">Paused</div>
            <div class="wf-icon"><i class="fas fa-birthday-cake"></i></div>
            <h4>Life Events Trigger</h4>
            <p>Detects life events (marriage, birth, retirement) and suggests appropriate coverage updates</p>
            <div class="wf-stats" id="wf-lbl-life-events"><i class="fas fa-info-circle"></i> 3 events detected this month</div>
            <div class="wf-actions">
              <button class="wf-btn primary" id="wf-run-life-events" onclick="runWorkflow('life-events')"><i class="fas fa-play"></i> Resume</button>
              <button class="wf-btn secondary" onclick="viewWorkflow('life-events')"><i class="fas fa-eye"></i> Events</button>
            </div>
          </div>
          <div class="workflow-card paused" id="wf-card-estate-trigger">
            <div class="wf-domain-tag adv-tag"><i class="fas fa-handshake"></i> Advisory</div>
            <div class="wf-status paused" id="wf-status-estate-trigger">Paused</div>
            <div class="wf-icon"><i class="fas fa-landmark"></i></div>
            <h4>Estate Planning Trigger</h4>
            <p>Flags clients with $1M+ total assets or business ownership for estate planning review</p>
            <div class="wf-stats" id="wf-lbl-estate-trigger"><i class="fas fa-info-circle"></i> 4 clients qualified</div>
            <div class="wf-actions">
              <button class="wf-btn primary" id="wf-run-estate-trigger" onclick="runWorkflow('estate-trigger')"><i class="fas fa-play"></i> Resume</button>
              <button class="wf-btn secondary" onclick="viewWorkflow('estate-trigger')"><i class="fas fa-users"></i> Clients</button>
            </div>
          </div>
          <div class="workflow-card idle" id="wf-card-claims-triage">
            <div class="wf-domain-tag ins-tag"><i class="fas fa-shield-alt"></i> Insurance</div>
            <div class="wf-status idle" id="wf-status-claims-triage">Idle</div>
            <div class="wf-icon"><i class="fas fa-file-signature"></i></div>
            <h4>Claims Triage Automation</h4>
            <p>Routes incoming claims to appropriate teams and requests required documentation automatically</p>
            <div class="wf-stats" id="wf-lbl-claims-triage"><i class="fas fa-info-circle"></i> 7 open claims tracked</div>
            <div class="wf-actions">
              <button class="wf-btn primary" id="wf-run-claims-triage" onclick="runWorkflow('claims-triage')"><i class="fas fa-play"></i> Activate</button>
              <button class="wf-btn secondary" onclick="viewWorkflow('claims-triage')"><i class="fas fa-clipboard-list"></i> Claims</button>
            </div>
          </div>
          <div class="workflow-card idle" id="wf-card-biz-review">
            <div class="wf-domain-tag adv-tag"><i class="fas fa-handshake"></i> Advisory</div>
            <div class="wf-status idle" id="wf-status-biz-review">Idle</div>
            <div class="wf-icon"><i class="fas fa-briefcase"></i></div>
            <h4>Business Client Review</h4>
            <p>Scans business-owner clients for NQDC, COLI, key-person and group benefits gaps</p>
            <div class="wf-stats" id="wf-lbl-biz-review"><i class="fas fa-info-circle"></i> 2 business clients eligible</div>
            <div class="wf-actions">
              <button class="wf-btn primary" id="wf-run-biz-review" onclick="runWorkflow('biz-review')"><i class="fas fa-play"></i> Activate</button>
              <button class="wf-btn secondary" onclick="viewWorkflow('biz-review')"><i class="fas fa-building"></i> Clients</button>
            </div>
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

      {/* ── Expanded KPI Strip (7 cards) ── */}
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
          <div class="uw-kpi-icon cyan"><i class="fas fa-file-medical"></i></div>
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
          <div class="uw-kpi-icon teal"><i class="fas fa-shield-alt"></i></div>
          <div class="uw-kpi-data">
            <div class="uw-kpi-val">94.6%</div>
            <div class="uw-kpi-lbl">AI Accuracy</div>
            <div class="uw-kpi-delta green"><i class="fas fa-robot"></i> vs 89% manual</div>
          </div>
        </div>
        <div class="uw-kpi">
          <div class="uw-kpi-icon red"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="uw-kpi-data">
            <div class="uw-kpi-val">2</div>
            <div class="uw-kpi-lbl">Stale &gt;14 Days</div>
            <div class="uw-kpi-delta orange"><i class="fas fa-clock"></i> Julia Chen · John Kim</div>
          </div>
        </div>
        <div class="uw-kpi">
          <div class="uw-kpi-icon emerald"><i class="fas fa-dollar-sign"></i></div>
          <div class="uw-kpi-data">
            <div class="uw-kpi-val">$5,760</div>
            <div class="uw-kpi-lbl">APS Cost Saved MTD</div>
            <div class="uw-kpi-delta green"><i class="fas fa-arrow-up"></i> 18 × $320 avoided</div>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div class="uw-toolbar">
        <div class="uw-tb-left">
          <div class="uw-tb-search">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search cases, clients, products…" oninput="filterUWCases(this.value)" />
          </div>
          <select class="uw-tb-select" onchange="filterUWByStage(this.value)">
            <option value="">All Stages</option>
            <option>Application Received</option>
            <option>Evidence Gathering</option>
            <option>AI Review</option>
            <option>Decision</option>
            <option>Approved</option>
            <option>Issued</option>
            <option>Declined</option>
          </select>
          <select class="uw-tb-select" onchange="filterUWBySTP(this.value)">
            <option value="">All STP Scores</option>
            <option value="high">High ≥ 80</option>
            <option value="med">Medium 60–79</option>
            <option value="low">Low &lt; 60</option>
          </select>
          <select class="uw-tb-select" onchange="sortUWCases(this.value)">
            <option value="">Sort: Newest</option>
            <option value="stp-desc">STP Score ↓</option>
            <option value="stp-asc">STP Score ↑</option>
            <option value="days-desc">Days in Stage ↓</option>
            <option value="urgent">Urgent First</option>
          </select>
        </div>
        <div class="uw-tb-right">
          <button class="uw-tb-btn ghost" onclick="runUWScan()"><i class="fas fa-sync-alt"></i> AI Scan</button>
          <button class="uw-tb-btn primary" onclick="openEApp('EA-NEW')"><i class="fas fa-plus"></i> New Case</button>
        </div>
      </div>

      {/* ── APS Triage + Requirement Tracker (Phase 5) ── */}
      <div class="aps-triage-panel">
        <div class="atp-header">
          <div class="atp-header-left">
            <i class="fas fa-file-medical atp-icon"></i>
            <div>
              <div class="atp-title">AI APS Triage &amp; Requirement Tracker <span class="atp-live">LIVE</span></div>
              <div class="atp-sub">AI reads medical records (50–200 pages) · extracts diagnoses, Rx, lab dates · generates 1-page summary · auto-sends requirement requests</div>
            </div>
          </div>
          <div class="atp-stats">
            <div class="atp-stat"><span class="atp-val orange">2</span><span class="atp-lbl">APS In Review</span></div>
            <div class="atp-stat"><span class="atp-val green">18</span><span class="atp-lbl">APS Avoided MTD</span></div>
            <div class="atp-stat"><span class="atp-val blue">$5,760</span><span class="atp-lbl">Cost Saved</span></div>
            <div class="atp-stat"><span class="atp-val cyan">3</span><span class="atp-lbl">Reqs Pending</span></div>
          </div>
          <button class="atp-btn" onclick="openAPSTriageModal()"><i class="fas fa-file-medical-alt"></i> APS Triage Center</button>
        </div>
        <div class="atp-req-track">
          <div class="atp-req-item" onclick="openUWModal('UW-2026-0014')">
            <div class="atp-req-client"><div class="mini-avatar jc" style="width:24px;height:24px;font-size:9px;background:#7c3aed">JC</div><span>Julia Chen · UW-2026-0014</span></div>
            <div class="atp-reqs">
              <span class="atp-req done" title="Rx History received"><i class="fas fa-check-circle"></i> Rx</span>
              <span class="atp-req done" title="MIB check complete"><i class="fas fa-check-circle"></i> MIB</span>
              <span class="atp-req pending" title="APS from Dr. Martinez pending"><i class="fas fa-clock"></i> APS <span class="atp-req-days">8d</span></span>
              <span class="atp-req pending" title="Lab results pending"><i class="fas fa-clock"></i> Labs</span>
              <span class="atp-req miss" title="Financial docs not received"><i class="fas fa-times-circle"></i> Financials</span>
            </div>
            <div class="atp-ai-summary">AI summary ready · <strong>T2DM controlled · BMI 28 · No CV events</strong> → Est. Table 2</div>
            <button class="atp-follow-btn" onclick="event.stopPropagation();sendAPSFollowUp('UW-2026-0014')"><i class="fas fa-paper-plane"></i> Send Follow-up</button>
          </div>
          <div class="atp-req-item" onclick="openUWModal('UW-2026-0013')">
            <div class="atp-req-client"><div class="mini-avatar jk2" style="width:24px;height:24px;font-size:9px;background:#0891b2">JK</div><span>John Kim · UW-2026-0013</span></div>
            <div class="atp-reqs">
              <span class="atp-req done"><i class="fas fa-check-circle"></i> Rx</span>
              <span class="atp-req done"><i class="fas fa-check-circle"></i> MIB</span>
              <span class="atp-req done"><i class="fas fa-check-circle"></i> MVR</span>
              <span class="atp-req stale" title="APS overdue — 14+ days"><i class="fas fa-exclamation-triangle"></i> APS <span class="atp-req-days urgent">14d</span></span>
              <span class="atp-req pending"><i class="fas fa-clock"></i> Labs</span>
            </div>
            <div class="atp-ai-summary">AI summary: <strong>Hypertension Stage 1 · BP 142/88 · Metoprolol 50mg</strong> → Est. Standard / Table 2</div>
            <button class="atp-follow-btn urgent" onclick="event.stopPropagation();sendAPSFollowUp('UW-2026-0013')"><i class="fas fa-paper-plane"></i> Urgent Follow-up</button>
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
          <div class="eapp-uw-stat"><span class="eapp-uw-val cyan">4 min</span><span class="eapp-uw-lbl">Avg. Enrollment</span></div>
        </div>
        <button class="eapp-uw-launch-btn" onclick="openEApp('EA-NEW')"><i class="fas fa-plus"></i> New E-App</button>
      </div>

      {/* ── AI UW Intelligence Banner ── */}
      <div class="uwi-banner">
        <div class="uwi-banner-left">
          <div class="uwi-banner-icon">
            <i class="fas fa-brain"></i>
            <span class="uwi-live-badge">LIVE</span>
          </div>
          <div class="uwi-banner-info">
            <div class="uwi-banner-title">AI Underwriting Intelligence Engine <span class="uwi-pulse-dot"></span></div>
            <div class="uwi-banner-sub">ML risk scoring · NLP medical record analysis · APS avoidance engine · STP optimization · 94.6% accuracy vs 89% manual</div>
          </div>
        </div>
        <div class="uwi-banner-chips">
          <div class="uwi-chip green"><i class="fas fa-bolt"></i><span class="uwi-chip-val">5</span><span class="uwi-chip-lbl">Auto-Approved</span></div>
          <div class="uwi-chip orange"><i class="fas fa-file-medical"></i><span class="uwi-chip-val">18</span><span class="uwi-chip-lbl">APS Avoided</span></div>
          <div class="uwi-chip blue"><i class="fas fa-tachometer-alt"></i><span class="uwi-chip-val">94.6%</span><span class="uwi-chip-lbl">AI Accuracy</span></div>
          <div class="uwi-chip cyan"><i class="fas fa-clock"></i><span class="uwi-chip-val">4.2 hrs</span><span class="uwi-chip-lbl">Avg Decision</span></div>
        </div>
        <div class="uwi-banner-actions">
          <button class="uwi-btn-primary" onclick="openUWIReport()"><i class="fas fa-chart-bar"></i> UW Intel Report</button>
          <button class="uwi-btn-secondary" onclick="openAPSAvoidance()"><i class="fas fa-file-medical-alt"></i> APS Engine</button>
        </div>
      </div>

      {/* ── Pricing Intelligence Banner ── */}
      <div class="pricing-analysis-banner">
        <div class="pab-left">
          <div class="pab-icon"><i class="fas fa-chart-line"></i><span class="pab-live-badge">LIVE</span></div>
          <div class="pab-info">
            <div class="pab-title">AI Pricing Intelligence &amp; Risk Narrative Engine <span class="pab-pulse"></span></div>
            <div class="pab-sub">Real-time benchmark pricing · AI-generated risk narratives · Competitor rate comparison · Rating class optimization · Market-adjusted premium scoring</div>
          </div>
        </div>
        <div class="pab-chips">
          <div class="pab-chip green"><i class="fas fa-percentage"></i><span class="pab-chip-val">3.1%</span><span class="pab-chip-lbl">Avg Savings Found</span></div>
          <div class="pab-chip blue"><i class="fas fa-trophy"></i><span class="pab-chip-val">NYL #1</span><span class="pab-chip-lbl">Value Score</span></div>
          <div class="pab-chip orange"><i class="fas fa-file-alt"></i><span class="pab-chip-val">11</span><span class="pab-chip-lbl">Reports Ready</span></div>
          <div class="pab-chip cyan"><i class="fas fa-robot"></i><span class="pab-chip-val">AI-Written</span><span class="pab-chip-lbl">Narratives</span></div>
        </div>
        <div class="pab-actions">
          <button class="pab-btn-primary" onclick="openPricingReport()"><i class="fas fa-chart-bar"></i> Pricing Report</button>
          <button class="pab-btn-secondary" onclick="openBenchmarkModal()"><i class="fas fa-balance-scale"></i> Benchmarks</button>
        </div>
      </div>

      {/* ── Pipeline Board ── */}
      <div class="uw-pipeline" id="uw-pipeline-board">

        {/* Stage 1: Application Received */}
        <div class="uw-stage" id="uw-stage-received">
          <div class="uw-stage-header received">
            <div class="uw-stage-hd-left"><i class="fas fa-inbox"></i> Application Received</div>
            <div class="uw-stage-hd-right"><span class="uw-stage-count">3</span><span class="uw-stage-val">$10.1K/yr</span></div>
          </div>
          <div class="uw-case-card" onclick="openUWModal('UW-2026-0018')">
            <div class="uw-case-top-row">
              <span class="uw-days-badge ok"><i class="fas fa-clock"></i> 4d</span>
              <span class="uw-risk-tag low">Low Risk</span>
            </div>
            <div class="uw-case-header">
              <div class="uw-case-client">Alex Rivera</div>
              <div class="uw-stp-score stp-high">STP 88</div>
            </div>
            <div class="uw-case-product">Whole Life — $500K · $4,800/yr</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Apr 10 · Age 34 · Referral</div>
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
            <div class="uw-case-top-row">
              <span class="uw-days-badge ok"><i class="fas fa-clock"></i> 5d</span>
              <span class="uw-risk-tag med">Moderate Risk</span>
            </div>
            <div class="uw-case-header">
              <div class="uw-case-client">Nancy Foster</div>
              <div class="uw-stp-score stp-high">STP 82</div>
            </div>
            <div class="uw-case-product">Term Life — $1M · $3,200/yr</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Apr 9 · Age 41</div>
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
            <div class="uw-case-top-row">
              <span class="uw-days-badge warn"><i class="fas fa-clock"></i> 6d</span>
              <span class="uw-risk-tag high">High Risk</span>
            </div>
            <div class="uw-case-header">
              <div class="uw-case-client">John Kim</div>
              <div class="uw-stp-score stp-med">STP 61</div>
            </div>
            <div class="uw-case-product">Disability Ins. · $2,100/yr</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Apr 8 · Age 38 · MIB Flag</div>
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
        <div class="uw-stage" id="uw-stage-evidence">
          <div class="uw-stage-header evidence">
            <div class="uw-stage-hd-left"><i class="fas fa-search-plus"></i> Evidence Gathering</div>
            <div class="uw-stage-hd-right"><span class="uw-stage-count">3</span><span class="uw-stage-val">$18.0K/yr</span></div>
          </div>
          <div class="uw-case-card" onclick="openUWModal('UW-2026-0015')">
            <div class="uw-case-top-row">
              <span class="uw-days-badge ok"><i class="fas fa-clock"></i> 9d</span>
              <span class="uw-risk-tag low">Low Risk</span>
            </div>
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
          <div class="uw-case-card stale-uw-card" onclick="openUWModal('UW-2026-0014')">
            <div class="uw-case-top-row">
              <span class="uw-days-badge stale"><i class="fas fa-clock"></i> 11d 🔴</span>
              <span class="uw-risk-tag high">High Risk</span>
            </div>
            <div class="uw-case-header">
              <div class="uw-case-client">Julia Chen</div>
              <div class="uw-stp-score stp-low">STP 44</div>
            </div>
            <div class="uw-case-product">Annuity Deferred · $8,000/yr</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Apr 3 · Age 58 · APS Pending</div>
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
            <div class="uw-case-top-row">
              <span class="uw-days-badge ok"><i class="fas fa-clock"></i> 13d</span>
              <span class="uw-risk-tag low">Low Risk</span>
            </div>
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
        <div class="uw-stage" id="uw-stage-ai-review">
          <div class="uw-stage-header ai-review">
            <div class="uw-stage-hd-left"><i class="fas fa-robot"></i> AI Review</div>
            <div class="uw-stage-hd-right"><span class="uw-stage-count">2</span><span class="uw-stage-val">$13.4K/yr</span></div>
          </div>
          <div class="uw-case-card" onclick="openUWModal('UW-2026-0012')">
            <div class="uw-case-top-row">
              <span class="uw-days-badge ok"><i class="fas fa-clock"></i> 17d</span>
              <span class="uw-risk-tag low">Low Risk</span>
            </div>
            <div class="uw-case-header">
              <div class="uw-case-client">Thomas Wright</div>
              <div class="uw-stp-score stp-high">STP 91</div>
            </div>
            <div class="uw-case-product">Whole Life — $1M · $9,600/yr</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Mar 28 · Age 52 · Exam Done</div>
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
            <div class="uw-case-top-row">
              <span class="uw-days-badge warn"><i class="fas fa-clock"></i> 20d</span>
              <span class="uw-risk-tag med">Moderate Risk</span>
            </div>
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
        <div class="uw-stage" id="uw-stage-decision">
          <div class="uw-stage-header decision">
            <div class="uw-stage-hd-left"><i class="fas fa-gavel"></i> Decision</div>
            <div class="uw-stage-hd-right"><span class="uw-stage-count">1</span><span class="uw-stage-val">$2.4K/yr</span></div>
          </div>
          <div class="uw-case-card urgent-case decision-urgent" onclick="openUWModal('UW-2026-0010')">
            <div class="uw-urgent-ring"><i class="fas fa-bell"></i> Due Today — Awaiting Decision</div>
            <div class="uw-case-top-row">
              <span class="uw-days-badge stale"><i class="fas fa-clock"></i> 25d 🔴</span>
              <span class="uw-risk-tag low">Low Risk</span>
            </div>
            <div class="uw-case-header">
              <div class="uw-case-client">David Thompson</div>
              <div class="uw-stp-score stp-high">STP 78</div>
            </div>
            <div class="uw-case-product">Term Life — $300K · $2,400/yr</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Mar 20 · Age 33 · All Evidence Clear</div>
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
        <div class="uw-stage" id="uw-stage-approved">
          <div class="uw-stage-header approved">
            <div class="uw-stage-hd-left"><i class="fas fa-check-circle"></i> Approved</div>
            <div class="uw-stage-hd-right"><span class="uw-stage-count">2</span><span class="uw-stage-val">$2.0K/yr</span></div>
          </div>
          <div class="uw-case-card" onclick="openUWModal('UW-2026-0009')">
            <div class="uw-case-top-row">
              <span class="uw-days-badge ok"><i class="fas fa-clock"></i> 27d</span>
              <span class="uw-risk-tag low">Low Risk</span>
            </div>
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
            <div class="uw-case-top-row">
              <span class="uw-days-badge ok"><i class="fas fa-clock"></i> 30d</span>
              <span class="uw-risk-tag low">Low Risk</span>
            </div>
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

        {/* Stage 6: Issued */}
        <div class="uw-stage" id="uw-stage-issued">
          <div class="uw-stage-header issued">
            <div class="uw-stage-hd-left"><i class="fas fa-check-double"></i> Issued</div>
            <div class="uw-stage-hd-right"><span class="uw-stage-count">2</span><span class="uw-stage-val">$6.2K/yr</span></div>
          </div>
          <div class="uw-case-card issued-card" onclick="openUWModal('UW-2026-0007')">
            <div class="uw-case-top-row">
              <span class="uw-days-badge issued-badge"><i class="fas fa-check-circle"></i> 1.8 hrs</span>
              <span class="uw-risk-tag issued-risk">STP Issued</span>
            </div>
            <div class="uw-case-header">
              <div class="uw-case-client">Robert Chen</div>
              <div class="uw-stp-score stp-high">STP 96</div>
            </div>
            <div class="uw-case-product">VUL Add-on Rider · $1,800/yr</div>
            <div class="uw-case-meta"><i class="fas fa-check-circle" style="color:#059669"></i> Issued Apr 2 · record time</div>
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
            <div class="uw-case-top-row">
              <span class="uw-days-badge issued-badge"><i class="fas fa-check-circle"></i> 3.1 hrs</span>
              <span class="uw-risk-tag issued-risk">STP Issued</span>
            </div>
            <div class="uw-case-header">
              <div class="uw-case-client">James Whitfield</div>
              <div class="uw-stp-score stp-high">STP 94</div>
            </div>
            <div class="uw-case-product">LTC Rider · $4,400/yr</div>
            <div class="uw-case-meta"><i class="fas fa-check-circle" style="color:#059669"></i> Issued Mar 30 · STP speed</div>
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

        {/* Stage 7: Declined / Rated */}
        <div class="uw-stage" id="uw-stage-declined">
          <div class="uw-stage-header declined">
            <div class="uw-stage-hd-left"><i class="fas fa-times-circle"></i> Declined / Rated</div>
            <div class="uw-stage-hd-right"><span class="uw-stage-count">2</span><span class="uw-stage-val">—</span></div>
          </div>
          <div class="uw-case-card declined-card" onclick="openUWModal('UW-2026-0005')">
            <div class="uw-case-top-row">
              <span class="uw-days-badge stale"><i class="fas fa-times"></i> Declined</span>
              <span class="uw-risk-tag high">High Risk</span>
            </div>
            <div class="uw-case-header">
              <div class="uw-case-client">Steve Palmer</div>
              <div class="uw-stp-score stp-low">STP 28</div>
            </div>
            <div class="uw-case-product">Whole Life — $1M · Age 66</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Mar 10 · Multiple flags</div>
            <div class="uw-evidence-bar">
              <span class="uw-ev ev-flag">Rx ⚠</span>
              <span class="uw-ev ev-flag">MIB ⚠</span>
              <span class="uw-ev ev-flag">Lab ⚠</span>
              <span class="uw-ev ev-flag">DM Flag</span>
            </div>
            <div class="uw-case-footer">
              <span class="uw-status-pill declined">Declined</span>
              <span class="uw-ai-rec declined-rec"><i class="fas fa-times-circle"></i> AI: Decline · STP 28</span>
            </div>
          </div>
          <div class="uw-case-card rated-card" onclick="openUWModal('UW-2026-0004')">
            <div class="uw-case-top-row">
              <span class="uw-days-badge warn"><i class="fas fa-star-half-alt"></i> Rated +20%</span>
              <span class="uw-risk-tag med">Moderate Risk</span>
            </div>
            <div class="uw-case-header">
              <div class="uw-case-client">Carol Bennett</div>
              <div class="uw-stp-score stp-med">STP 55</div>
            </div>
            <div class="uw-case-product">Term Life — $500K · $2,800/yr base</div>
            <div class="uw-case-meta"><i class="fas fa-calendar"></i> Mar 22 · Age 51 · HTN Rx</div>
            <div class="uw-evidence-bar">
              <span class="uw-ev ev-done">Rx ✓</span>
              <span class="uw-ev ev-flag">MIB ⚠</span>
              <span class="uw-ev ev-done">MVR ✓</span>
              <span class="uw-ev ev-done">Lab ✓</span>
            </div>
            <div class="uw-case-footer">
              <span class="uw-status-pill rated">Table Rated</span>
              <span class="uw-ai-rec rated-rec"><i class="fas fa-star-half-alt"></i> Table 2 Recommended</span>
            </div>
          </div>
        </div>

      </div>{/* end uw-pipeline */}

      {/* ── Below-Pipeline Analytics Grid ── */}
      <div class="uw-analytics-grid">

        {/* STP Funnel Panel */}
        <div class="uw-analytics-panel">
          <div class="uwap-header">
            <div class="uwap-title"><i class="fas fa-filter"></i> STP Funnel — This Month</div>
            <span class="uwap-badge cyan">Live</span>
          </div>
          <div class="uw-funnel-stages">
            <div class="uw-funnel-row">
              <div class="uw-funnel-lbl">Applications In</div>
              <div class="uw-funnel-bar-wrap"><div class="uw-funnel-bar" style="width:100%;background:#0e7490"></div></div>
              <div class="uw-funnel-val">11</div>
            </div>
            <div class="uw-funnel-row">
              <div class="uw-funnel-lbl">Evidence Complete</div>
              <div class="uw-funnel-bar-wrap"><div class="uw-funnel-bar" style="width:73%;background:#0891b2"></div></div>
              <div class="uw-funnel-val">8</div>
            </div>
            <div class="uw-funnel-row">
              <div class="uw-funnel-lbl">AI Scored ≥ 75</div>
              <div class="uw-funnel-bar-wrap"><div class="uw-funnel-bar" style="width:64%;background:#06b6d4"></div></div>
              <div class="uw-funnel-val">7</div>
            </div>
            <div class="uw-funnel-row">
              <div class="uw-funnel-lbl">STP Auto-Approved</div>
              <div class="uw-funnel-bar-wrap"><div class="uw-funnel-bar" style="width:45%;background:#22d3ee"></div></div>
              <div class="uw-funnel-val green-val">5 ✓</div>
            </div>
            <div class="uw-funnel-row">
              <div class="uw-funnel-lbl">Manual Review</div>
              <div class="uw-funnel-bar-wrap"><div class="uw-funnel-bar" style="width:18%;background:#f59e0b"></div></div>
              <div class="uw-funnel-val orange-val">2</div>
            </div>
            <div class="uw-funnel-row">
              <div class="uw-funnel-lbl">APS Required</div>
              <div class="uw-funnel-bar-wrap"><div class="uw-funnel-bar" style="width:18%;background:#ef4444"></div></div>
              <div class="uw-funnel-val red-val">2</div>
            </div>
          </div>
          <div class="uw-funnel-insight"><i class="fas fa-robot"></i> <strong>AI:</strong> 73% STP rate (+18% vs last quarter). Chase Julia Chen &amp; John Kim APS to unblock pipeline.</div>
        </div>

        {/* Risk Triage Panel */}
        <div class="uw-analytics-panel">
          <div class="uwap-header">
            <div class="uwap-title"><i class="fas fa-shield-alt"></i> Risk Triage Matrix</div>
            <span class="uwap-badge orange">4 Flags</span>
          </div>
          <div class="uw-risk-matrix">
            <div class="uw-risk-row risk-high">
              <div class="uw-risk-label"><span class="uw-risk-dot red"></span> High Risk</div>
              <div class="uw-risk-cases">
                <div class="uw-risk-case">John Kim <span class="uw-risk-reason">MIB + DM Rx</span></div>
                <div class="uw-risk-case">Julia Chen <span class="uw-risk-reason">MIB + Lab flags · Age 58</span></div>
                <div class="uw-risk-case">Steve Palmer <span class="uw-risk-reason">Multiple flags · Declined</span></div>
              </div>
            </div>
            <div class="uw-risk-row risk-med">
              <div class="uw-risk-label"><span class="uw-risk-dot amber"></span> Moderate Risk</div>
              <div class="uw-risk-cases">
                <div class="uw-risk-case">Nancy Foster <span class="uw-risk-reason">MVR pending · Age 41</span></div>
                <div class="uw-risk-case">Grace Lee <span class="uw-risk-reason">Lab flag · APS needed</span></div>
                <div class="uw-risk-case">Carol Bennett <span class="uw-risk-reason">HTN Rx · Table rated</span></div>
              </div>
            </div>
            <div class="uw-risk-row risk-low">
              <div class="uw-risk-label"><span class="uw-risk-dot green"></span> Low Risk / STP</div>
              <div class="uw-risk-cases">
                <div class="uw-risk-case">Alex Rivera · Rachel Adams · Thomas Wright</div>
                <div class="uw-risk-case">Linda Morrison · Robert Chen · James Whitfield</div>
              </div>
            </div>
          </div>
          <button class="uw-triage-btn" onclick="openUWIReport()"><i class="fas fa-chart-bar"></i> Full Risk Report</button>
        </div>

        {/* Performance Stats Panel */}
        <div class="uw-analytics-panel">
          <div class="uwap-header">
            <div class="uwap-title"><i class="fas fa-tachometer-alt"></i> UW Performance — April</div>
            <span class="uwap-badge green">On Track</span>
          </div>
          <div class="uw-perf-stats">
            <div class="uw-perf-row">
              <div class="uw-perf-lbl">Avg Decision Time</div>
              <div class="uw-perf-bar-wrap"><div class="uw-perf-bar green-bar" style="width:90%"></div></div>
              <div class="uw-perf-val">4.2 hrs <span class="uw-perf-target">target 6 hrs ✓</span></div>
            </div>
            <div class="uw-perf-row">
              <div class="uw-perf-lbl">STP Rate</div>
              <div class="uw-perf-bar-wrap"><div class="uw-perf-bar cyan-bar" style="width:73%"></div></div>
              <div class="uw-perf-val">73% <span class="uw-perf-target">target 65% ✓</span></div>
            </div>
            <div class="uw-perf-row">
              <div class="uw-perf-lbl">AI Accuracy</div>
              <div class="uw-perf-bar-wrap"><div class="uw-perf-bar green-bar" style="width:94.6%"></div></div>
              <div class="uw-perf-val">94.6% <span class="uw-perf-target">target 90% ✓</span></div>
            </div>
            <div class="uw-perf-row">
              <div class="uw-perf-lbl">APS Avoided</div>
              <div class="uw-perf-bar-wrap"><div class="uw-perf-bar cyan-bar" style="width:82%"></div></div>
              <div class="uw-perf-val">18 <span class="uw-perf-target">target 15 ✓</span></div>
            </div>
            <div class="uw-perf-row">
              <div class="uw-perf-lbl">Cases Closed</div>
              <div class="uw-perf-bar-wrap"><div class="uw-perf-bar amber-bar" style="width:55%"></div></div>
              <div class="uw-perf-val">6 / 11 <span class="uw-perf-target">target 10</span></div>
            </div>
          </div>
          <div class="uw-perf-ai-note"><i class="fas fa-robot"></i> <strong>AI Coach:</strong> Decision time 30% below target. Increase close rate by chasing 4 pending cases.</div>
        </div>

        {/* Stale Cases Alert Panel */}
        <div class="uw-analytics-panel">
          <div class="uwap-header">
            <div class="uwap-title"><i class="fas fa-exclamation-triangle"></i> Stale Case Alerts</div>
            <span class="uwap-badge red">2 Idle</span>
          </div>
          <div class="uw-stale-list">
            <div class="uw-stale-item">
              <div class="uw-stale-avatar">JC</div>
              <div class="uw-stale-info">
                <div class="uw-stale-name">Julia Chen</div>
                <div class="uw-stale-prod">Annuity Deferred · STP 44</div>
                <div class="uw-stale-reason"><i class="fas fa-clock"></i> 11 days idle · APS not received</div>
              </div>
              <button class="uw-stale-btn" onclick="openUWModal('UW-2026-0014')"><i class="fas fa-bolt"></i> Chase</button>
            </div>
            <div class="uw-stale-item">
              <div class="uw-stale-avatar">JK</div>
              <div class="uw-stale-info">
                <div class="uw-stale-name">John Kim</div>
                <div class="uw-stale-prod">Disability Ins. · STP 61</div>
                <div class="uw-stale-reason"><i class="fas fa-clock"></i> 6 days · MVR &amp; Credit pending</div>
              </div>
              <button class="uw-stale-btn" onclick="openUWModal('UW-2026-0016')"><i class="fas fa-bolt"></i> Chase</button>
            </div>
            <div class="uw-stale-item">
              <div class="uw-stale-avatar">DT</div>
              <div class="uw-stale-info">
                <div class="uw-stale-name">David Thompson</div>
                <div class="uw-stale-prod">Term Life $300K · Decision Due</div>
                <div class="uw-stale-reason"><i class="fas fa-exclamation-circle"></i> 25 days · Decision overdue today</div>
              </div>
              <button class="uw-stale-btn urgent" onclick="openUWModal('UW-2026-0010')"><i class="fas fa-gavel"></i> Decide</button>
            </div>
          </div>
          <button class="uw-stale-scan-btn" onclick="runUWScan()"><i class="fas fa-sync-alt"></i> Re-scan All Cases</button>
        </div>

      </div>{/* end uw-analytics-grid */}

      {/* ══════════════════════════════════════════════════
          APS AVOIDANCE ENGINE PANEL  (Task #15d)
          ══════════════════════════════════════════════════ */}
      <div class="aps-avoidance-panel" id="aps-avoidance-panel" style="display:none">
        <div class="aps-panel-header">
          <div class="aps-panel-title-group">
            <div class="aps-panel-icon"><i class="fas fa-file-medical-alt"></i></div>
            <div>
              <div class="aps-panel-title">APS Avoidance Engine <span class="aps-live-badge">LIVE</span></div>
              <div class="aps-panel-sub">AI substitutes lab + MIB + Rx evidence to eliminate unnecessary APS orders · Saves avg. 14 days per case · $320 per APS avoided</div>
            </div>
          </div>
          <button class="aps-panel-close" onclick="closeAPSAvoidance()"><i class="fas fa-times"></i></button>
        </div>
        <div class="aps-kpi-strip">
          <div class="aps-kpi-card green"><div class="aps-kpi-val">18</div><div class="aps-kpi-lbl">APS Avoided This Month</div></div>
          <div class="aps-kpi-card blue"><div class="aps-kpi-val">$5,760</div><div class="aps-kpi-lbl">Cost Savings (@ $320/APS)</div></div>
          <div class="aps-kpi-card purple"><div class="aps-kpi-val">14 days</div><div class="aps-kpi-lbl">Avg. Time Saved / Case</div></div>
          <div class="aps-kpi-card gold"><div class="aps-kpi-val">94.6%</div><div class="aps-kpi-lbl">Avoidance Accuracy</div></div>
        </div>
        <div class="aps-cases-title"><i class="fas fa-check-circle"></i> Recently APS-Eliminated Cases</div>
        <div class="aps-cases-list">
          <div class="aps-case-row">
            <div class="aps-case-client"><div class="aps-case-avatar">AR</div><div><div class="aps-case-name">Alex Rivera</div><div class="aps-case-prod">Whole Life $500K · STP 88</div></div></div>
            <div class="aps-case-evidence"><span class="aps-ev-tag">Rx Clear</span><span class="aps-ev-tag">MIB Clear</span><span class="aps-ev-tag">BMI 22.4</span></div>
            <div class="aps-case-outcome"><span class="aps-outcome-badge green">APS Eliminated</span><span class="aps-outcome-note">Auto-Approve eligible · saves 14 days</span></div>
          </div>
          <div class="aps-case-row">
            <div class="aps-case-client"><div class="aps-case-avatar">MS</div><div><div class="aps-case-name">Michael Santos</div><div class="aps-case-prod">Universal Life $750K · STP 79</div></div></div>
            <div class="aps-case-evidence"><span class="aps-ev-tag">Rx Reviewed</span><span class="aps-ev-tag">MIB Clear</span><span class="aps-ev-tag">Lab Pending</span></div>
            <div class="aps-case-outcome"><span class="aps-outcome-badge green">APS Eliminated</span><span class="aps-outcome-note">Lab substituted for APS · Near auto-approve</span></div>
          </div>
          <div class="aps-case-row">
            <div class="aps-case-client"><div class="aps-case-avatar">RA</div><div><div class="aps-case-name">Rachel Adams</div><div class="aps-case-prod">Whole Life $300K · STP 85</div></div></div>
            <div class="aps-case-evidence"><span class="aps-ev-tag">All Clear</span><span class="aps-ev-tag">Age 29</span><span class="aps-ev-tag">No Flags</span></div>
            <div class="aps-case-outcome"><span class="aps-outcome-badge green">APS Eliminated</span><span class="aps-outcome-note">Full evidence clean · Auto-approve ready</span></div>
          </div>
          <div class="aps-case-row">
            <div class="aps-case-client"><div class="aps-case-avatar">TW</div><div><div class="aps-case-name">Thomas Wright</div><div class="aps-case-prod">Whole Life $1M · STP 91</div></div></div>
            <div class="aps-case-evidence"><span class="aps-ev-tag">Rx Clear</span><span class="aps-ev-tag">Lab Done</span><span class="aps-ev-tag">All Clear</span></div>
            <div class="aps-case-outcome"><span class="aps-outcome-badge green">APS Eliminated</span><span class="aps-outcome-note">Medical exam + labs fully substituted · STP 91</span></div>
          </div>
          <div class="aps-case-row aps-row-flag">
            <div class="aps-case-client"><div class="aps-case-avatar">JK</div><div><div class="aps-case-name">John Kim</div><div class="aps-case-prod">Disability Ins. · STP 61</div></div></div>
            <div class="aps-case-evidence"><span class="aps-ev-tag ev-flag">MIB Flag</span><span class="aps-ev-tag ev-flag">DM Rx</span><span class="aps-ev-tag ev-flag">Prior DI Claim</span></div>
            <div class="aps-case-outcome"><span class="aps-outcome-badge orange">APS Required</span><span class="aps-outcome-note">Evidence gaps cannot be substituted · Manual review</span></div>
          </div>
          <div class="aps-case-row aps-row-flag">
            <div class="aps-case-client"><div class="aps-case-avatar">JC</div><div><div class="aps-case-name">Julia Chen</div><div class="aps-case-prod">Annuity Deferred · STP 44</div></div></div>
            <div class="aps-case-evidence"><span class="aps-ev-tag ev-flag">MIB Flag</span><span class="aps-ev-tag ev-flag">Lab Flag</span><span class="aps-ev-tag ev-flag">Age 58</span></div>
            <div class="aps-case-outcome"><span class="aps-outcome-badge orange">APS Required</span><span class="aps-outcome-note">Multiple flags at age 58 · Full medical review needed</span></div>
          </div>
        </div>
        <div class="aps-panel-footer">
          <button class="aps-footer-btn" onclick="runUWScan()"><i class="fas fa-sync-alt"></i> Re-run APS Analysis</button>
          <button class="aps-footer-btn primary" onclick="openUWIReport()"><i class="fas fa-chart-bar"></i> Full UW Intelligence Report</button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          PRICING ANALYSIS REPORT MODAL  (Task #16b)
          ══════════════════════════════════════════════════ */}
      <div class="pricing-report-overlay" id="pricing-report-overlay" onclick="closePricingReport()" style="display:none">
        <div class="pricing-report-modal" onclick="event.stopPropagation()">
          <div class="pricing-report-header">
            <div class="pricing-report-header-left">
              <div class="pricing-report-icon"><i class="fas fa-chart-line"></i></div>
              <div>
                <div class="pricing-report-title">AI Pricing Analysis &amp; Risk Narrative Report</div>
                <div class="pricing-report-sub">Real-time benchmarks · 11 cases analyzed · Market-adjusted · Generated Apr 10, 2026</div>
              </div>
            </div>
            <button class="pricing-report-close" onclick="closePricingReport()"><i class="fas fa-times"></i></button>
          </div>
          <div class="pricing-report-tabs" id="pricing-report-tabs">
            <button class="pr-rtab active" onclick="switchPricingReportTab('overview',this)"><i class="fas fa-tachometer-alt"></i> Overview</button>
            <button class="pr-rtab" onclick="switchPricingReportTab('benchmark',this)"><i class="fas fa-balance-scale"></i> Benchmarks</button>
            <button class="pr-rtab" onclick="switchPricingReportTab('narratives',this)"><i class="fas fa-file-alt"></i> AI Narratives</button>
            <button class="pr-rtab" onclick="switchPricingReportTab('optimization',this)"><i class="fas fa-sliders-h"></i> Optimization</button>
          </div>
          <div class="pricing-report-body" id="pricing-report-body"></div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          UW INTELLIGENCE FULL REPORT MODAL  (Task #15)
          ══════════════════════════════════════════════════ */}
      <div class="uwi-report-overlay" id="uwi-report-overlay" onclick="closeUWIReport()" style="display:none">
        <div class="uwi-report-modal" onclick="event.stopPropagation()">
          <div class="uwi-report-header">
            <div class="uwi-report-header-left">
              <div class="uwi-report-icon"><i class="fas fa-brain"></i></div>
              <div>
                <div class="uwi-report-title">AI Underwriting Intelligence Report</div>
                <div class="uwi-report-sub">Real-time · 11 active cases · Last scan: just now · 94.6% accuracy</div>
              </div>
            </div>
            <button class="uwi-report-close" onclick="closeUWIReport()"><i class="fas fa-times"></i></button>
          </div>
          <div class="uwi-report-tabs" id="uwi-report-tabs">
            <button class="uwi-rtab active" onclick="switchUWIReportTab('overview',this)"><i class="fas fa-tachometer-alt"></i> Overview</button>
            <button class="uwi-rtab" onclick="switchUWIReportTab('pipeline',this)"><i class="fas fa-layer-group"></i> Pipeline</button>
            <button class="uwi-rtab" onclick="switchUWIReportTab('aps',this)"><i class="fas fa-file-medical-alt"></i> APS Avoidance</button>
            <button class="uwi-rtab" onclick="switchUWIReportTab('accuracy',this)"><i class="fas fa-bullseye"></i> Accuracy</button>
          </div>
          <div class="uwi-report-body" id="uwi-report-body"></div>
        </div>
      </div>

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
                <button class="dmt-tab uwi-tab" onclick="switchUWTab('intelligence',this)"><i class="fas fa-brain"></i> UW Intel</button>
                <button class="dmt-tab pricing-tab" onclick="switchUWTab('pricing',this)"><i class="fas fa-tag"></i> Pricing Report</button>
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

      {/* ── KPI Bar (10 cards, enriched with trends) ── */}
      <div class="sales-kpi-bar">
        <div class="skpi-card skpi-blue" onclick="filterPipelineByStatus('all')">
          <div class="skpi-card-icon"><i class="fas fa-funnel-dollar"></i></div>
          <div class="skpi-card-body">
            <div class="skpi-card-val">$284K</div>
            <div class="skpi-card-lbl">Pipeline Value</div>
            <div class="skpi-card-trend up"><i class="fas fa-arrow-up"></i> +$47K vs last month</div>
          </div>
        </div>
        <div class="skpi-card skpi-green" onclick="filterPipelineByStatus('won')">
          <div class="skpi-card-icon"><i class="fas fa-handshake"></i></div>
          <div class="skpi-card-body">
            <div class="skpi-card-val">34</div>
            <div class="skpi-card-lbl">Closed This Month</div>
            <div class="skpi-card-trend up"><i class="fas fa-arrow-up"></i> +6 vs last month</div>
          </div>
        </div>
        <div class="skpi-card skpi-gold" onclick="showConversionDetails()">
          <div class="skpi-card-icon"><i class="fas fa-percentage"></i></div>
          <div class="skpi-card-body">
            <div class="skpi-card-val">68%</div>
            <div class="skpi-card-lbl">Conversion Rate</div>
            <div class="skpi-card-trend up"><i class="fas fa-arrow-up"></i> +4% vs last month</div>
          </div>
        </div>
        <div class="skpi-card skpi-teal" onclick="showStageCycleDetails()">
          <div class="skpi-card-icon"><i class="fas fa-clock"></i></div>
          <div class="skpi-card-body">
            <div class="skpi-card-val">12.4d</div>
            <div class="skpi-card-lbl">Avg Sales Cycle</div>
            <div class="skpi-card-trend good"><i class="fas fa-arrow-down"></i> −1.2d vs target</div>
          </div>
        </div>
        <div class="skpi-card skpi-purple" onclick="showCommissionDetails()">
          <div class="skpi-card-icon"><i class="fas fa-dollar-sign"></i></div>
          <div class="skpi-card-body">
            <div class="skpi-card-val">$42.2K</div>
            <div class="skpi-card-lbl">Commission MTD</div>
            <div class="skpi-card-trend up"><i class="fas fa-arrow-up"></i> On track</div>
          </div>
        </div>
        <div class="skpi-card skpi-navy" onclick="showQuotaDetails()">
          <div class="skpi-card-icon"><i class="fas fa-trophy"></i></div>
          <div class="skpi-card-body">
            <div class="skpi-card-val">78%</div>
            <div class="skpi-card-lbl">YTD Quota ($187K / $240K)</div>
            <div class="skpi-card-trend up"><i class="fas fa-check"></i> On Track</div>
          </div>
        </div>
        <div class="skpi-card skpi-orange" onclick="showStageCycleDetails()">
          <div class="skpi-card-icon"><i class="fas fa-hourglass-half"></i></div>
          <div class="skpi-card-body">
            <div class="skpi-card-val">8.3d</div>
            <div class="skpi-card-lbl">Avg Days in Stage</div>
            <div class="skpi-card-trend warn"><i class="fas fa-exclamation-triangle"></i> 2 deals stale</div>
          </div>
        </div>
        <div class="skpi-card skpi-red" onclick="filterPipelineByRisk('at-risk')">
          <div class="skpi-card-icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="skpi-card-body">
            <div class="skpi-card-val">2</div>
            <div class="skpi-card-lbl">At-Risk Deals</div>
            <div class="skpi-card-trend warn"><i class="fas fa-arrow-down"></i> Score &lt; 50</div>
          </div>
        </div>
        <div class="skpi-card skpi-emerald" onclick="showUpsellPanel()">
          <div class="skpi-card-icon"><i class="fas fa-lightbulb"></i></div>
          <div class="skpi-card-body">
            <div class="skpi-card-val">$31.2K</div>
            <div class="skpi-card-lbl">Upsell Potential</div>
            <div class="skpi-card-trend up"><i class="fas fa-robot"></i> AI-identified</div>
          </div>
        </div>
        <div class="skpi-card skpi-slate" onclick="filterPipelineByStatus('lost')">
          <div class="skpi-card-icon"><i class="fas fa-times-circle"></i></div>
          <div class="skpi-card-body">
            <div class="skpi-card-val">3</div>
            <div class="skpi-card-lbl">Closed Lost MTD</div>
            <div class="skpi-card-trend neutral"><i class="fas fa-minus"></i> Steady</div>
          </div>
        </div>
      </div>

      {/* ── (consolidated) AI Sales Intelligence Banner ── */}
      <div class="sai-banner">
        <div class="sai-banner-left">
          <div class="sai-banner-icon">
            <i class="fas fa-brain"></i>
            <span class="sai-live-badge">LIVE</span>
          </div>
          <div class="sai-banner-info">
            <div class="sai-banner-title">AI Sales Pipeline Intelligence <span class="sai-pulse-dot"></span></div>
            <div class="sai-banner-sub">Win-probability ML scoring · Next-best-action engine · Conversion prediction · Close-window alerts · 9 deals tracked</div>
          </div>
        </div>
        <div class="sai-banner-chips">
          <div class="sai-chip green">
            <i class="fas fa-trophy"></i>
            <span class="sai-chip-val">$284K</span>
            <span class="sai-chip-lbl">Pipeline Value</span>
          </div>
          <div class="sai-chip blue">
            <i class="fas fa-bullseye"></i>
            <span class="sai-chip-val">73%</span>
            <span class="sai-chip-lbl">Avg Win Prob</span>
          </div>
          <div class="sai-chip orange">
            <i class="fas fa-fire"></i>
            <span class="sai-chip-val">3</span>
            <span class="sai-chip-lbl">Close This Week</span>
          </div>
          <div class="sai-chip purple">
            <i class="fas fa-bolt"></i>
            <span class="sai-chip-val">5</span>
            <span class="sai-chip-lbl">NBA Alerts</span>
          </div>
        </div>
        <div class="sai-banner-actions">
          <button class="sai-btn-primary" onclick="openSalesAIReport()"><i class="fas fa-chart-bar"></i> AI Win Report</button>
          <button class="sai-btn-secondary" onclick="openConversionPredict()"><i class="fas fa-chart-line"></i> Conversion Forecast</button>
        </div>
      </div>

      {/* ── Pipeline Toolbar ── */}
      <div class="pipeline-toolbar">
        <div class="ptb-left">
          <div class="ptb-search">
            <i class="fas fa-search"></i>
            <input type="text" id="pipeline-search" placeholder="Search deals, clients, products…" oninput="filterPipelineDeals()" />
          </div>
          <select class="ptb-select" id="ptb-stage-filter" onchange="filterPipelineDeals()">
            <option value="">All Stages</option>
            <option value="Prospect">Prospect</option>
            <option value="Quoted">Quoted</option>
            <option value="Underwriting">Underwriting</option>
            <option value="Approved">Approved</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>
          <select class="ptb-select" id="ptb-domain-filter" onchange="filterPipelineDeals()">
            <option value="">All Domains</option>
            <option value="ins">Insurance</option>
            <option value="inv">Investments</option>
            <option value="ret">Retirement</option>
            <option value="adv">Advisory</option>
          </select>
          <select class="ptb-select" id="ptb-sort" onchange="sortPipelineDeals()">
            <option value="win">Sort: Win %</option>
            <option value="value">Sort: Deal Value</option>
            <option value="days">Sort: Days in Stage</option>
            <option value="comm">Sort: Commission</option>
          </select>
        </div>
        <div class="ptb-right">
          <div class="ptb-view-toggle" id="ptb-view-toggle">
            <button class="ptb-view-btn active" id="ptb-btn-kanban" onclick="setPipelineView('kanban',this)" title="Kanban Board"><i class="fas fa-th-large"></i> Kanban</button>
            <button class="ptb-view-btn" id="ptb-btn-list" onclick="setPipelineView('list',this)" title="List / Table"><i class="fas fa-list"></i> List</button>
            <button class="ptb-view-btn" id="ptb-btn-focus" onclick="setPipelineView('focus',this)" title="Focus: Top 3 Deals"><i class="fas fa-crosshairs"></i> Focus</button>
          </div>
          <button class="ptb-add-btn" onclick="openAddDealModal()"><i class="fas fa-plus"></i> New Deal</button>
        </div>
      </div>

      {/* ── Stale Deal Alert Strip — full-width, outside grid ── */}
      <div class="stale-alert-strip" id="stale-alert-strip">
          <div class="sas-header">
            <div class="sas-header-left">
              <i class="fas fa-exclamation-triangle sas-icon"></i>
              <div>
                <div class="sas-title">Stale Deal Alerts <span class="sas-badge">2 Deals Idle &gt;10 days</span></div>
                <div class="sas-sub">Deals with no stage movement — act now to prevent going cold</div>
              </div>
            </div>
            <button class="sas-dismiss-btn" onclick="dismissStaleStrip()" title="Dismiss"><i class="fas fa-times"></i></button>
          </div>
          <div class="sas-cards">
            <div class="sas-card sas-card-red">
              <div class="sas-card-top">
                <span class="sas-claim-id">D003</span>
                <span class="sas-age-badge stale"><i class="fas fa-hourglass-end"></i> 15d in Prospect</span>
              </div>
              <div class="sas-client"><div class="mini-avatar jk" style="width:22px;height:22px;font-size:9px">JK</div><span>John Kim</span></div>
              <div class="sas-reason"><i class="fas fa-stethoscope"></i> APS delay stalling deal — score dropped to 44%</div>
              <div class="sas-actions">
                <button class="sas-action-btn primary" onclick="openDealAIModal('D003')"><i class="fas fa-brain"></i> AI Intel</button>
                <button class="sas-action-btn ghost" onclick="openDealModal('D003')"><i class="fas fa-eye"></i> View</button>
              </div>
            </div>
            <div class="sas-card sas-card-amber">
              <div class="sas-card-top">
                <span class="sas-claim-id">D005</span>
                <span class="sas-age-badge warn"><i class="fas fa-clock"></i> 11d in Quoted</span>
              </div>
              <div class="sas-client"><div class="mini-avatar jc" style="width:22px;height:22px;font-size:9px">JC</div><span>Julia Chen</span></div>
              <div class="sas-reason"><i class="fas fa-percentage"></i> Annuity quote under review — no response in 11 days</div>
              <div class="sas-actions">
                <button class="sas-action-btn primary" onclick="openDealAIModal('D005')"><i class="fas fa-paper-plane"></i> Follow Up</button>
                <button class="sas-action-btn ghost" onclick="openDealModal('D005')"><i class="fas fa-eye"></i> View</button>
              </div>
            </div>
            <div class="sas-card sas-card-info">
              <div class="sas-card-top">
                <span class="sas-claim-id">D007</span>
                <span class="sas-age-badge info"><i class="fas fa-clock"></i> 19d in UW</span>
              </div>
              <div class="sas-client"><div class="mini-avatar gl" style="width:22px;height:22px;font-size:9px">GL</div><span>Grace Lee</span></div>
              <div class="sas-reason"><i class="fas fa-file-medical"></i> UW review prolonged — APS received, awaiting decision</div>
              <div class="sas-actions">
                <button class="sas-action-btn primary" onclick="openDealModal('D007')"><i class="fas fa-phone"></i> Chase UW</button>
                <button class="sas-action-btn ghost" onclick="openDealAIModal('D007')"><i class="fas fa-robot"></i> AI</button>
              </div>
            </div>
          </div>
        </div>

      {/* ── Main body: full-width Kanban ── */}
      <div class="sales-main-col">

          {/* ── Pipeline List View (hidden by default) ── */}
          <div id="pipeline-list-view" style="display:none" class="pipeline-list-view">
            <table class="data-table pipeline-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Product</th>
                  <th>Stage</th>
                  <th>Value/yr</th>
                  <th>Commission</th>
                  <th>Win %</th>
                  <th>Days in Stage</th>
                  <th>Lead Source</th>
                  <th>Next Action</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="pipeline-list-tbody"></tbody>
            </table>
          </div>

          {/* ── Pipeline Focus View (hidden by default) ── */}
          <div id="pipeline-focus-view" style="display:none" class="pipeline-focus-view">
            <div class="pfv-header"><i class="fas fa-crosshairs"></i> Focus Mode — Top 3 Priority Deals <span class="pfv-sub">Ranked by AI Win Score</span></div>
            <div class="pfv-cards" id="pfv-cards"></div>
          </div>

          {/* ── Pipeline Kanban ── */}
          <div class="sales-kanban-wrap" id="pipeline-kanban-view">
          <div class="kanban-board">

            {/* Prospect */}
            <div class="kanban-col" id="kcol-Prospect">
              <div class="kanban-col-header prospect">
                <span><i class="fas fa-binoculars"></i> Prospect</span>
                <div class="kcol-meta">
                  <span class="col-count" id="kcount-Prospect">3</span>
                  <span class="col-value" id="kval-Prospect">$10.1K/yr</span>
                </div>
              </div>
              <div class="kanban-card" onclick="openDealModal('D001')">
                <div class="kc-top-row">
                  <div class="kc-win-gauge green" title="Win Probability 82%">
                    <svg viewBox="0 0 36 36" class="kc-gauge-svg"><circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" stroke-width="3"/><circle cx="18" cy="18" r="15" fill="none" stroke="#16a34a" stroke-width="3" stroke-dasharray="75 25" stroke-dashoffset="25" transform="rotate(-90 18 18)"/></svg>
                    <span class="kc-gauge-val">82</span>
                  </div>
                  <div class="kc-win-label green">82% Win</div>
                  <span class="kc-conv-badge green">↑ High</span>
                  <span class="kc-days-badge normal" title="Days in this stage">6d</span>
                </div>
                <div class="kc-client">Alex Rivera</div>
                <div class="kc-product">Whole Life — $500K</div>
                <div class="kc-value">$4,800/yr · <span class="kc-comm">$576 comm</span></div>
                <div class="kc-nba-pill orange"><i class="fas fa-calendar-alt"></i> Schedule Apr 12 pre-brief now</div>
                <div class="kc-upsell-flag"><i class="fas fa-lightbulb"></i> Upsell: Deferred Annuity — $280K investable assets</div>
                <div class="kc-tags"><span class="tag-priority">High Priority</span><span class="kc-source-tag referral"><i class="fas fa-user-friends"></i> Referral</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-brief" onclick="event.stopPropagation();openMeetingBrief('MTG-001')"><i class="fas fa-file-alt"></i> Brief</button>
                  <button class="kca-btn kca-quote" onclick="event.stopPropagation();openQuoteModal('D001')"><i class="fas fa-file-invoice-dollar"></i> Quote</button>
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();openDealAIModal('D001')"><i class="fas fa-brain"></i> AI Intel</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D001','Quoted')"><i class="fas fa-arrow-right"></i> Move</button>
                </div>
              </div>
              <div class="kanban-card" onclick="openDealModal('D002')">
                <div class="kc-top-row">
                  <div class="kc-win-gauge amber" title="Win Probability 61%">
                    <svg viewBox="0 0 36 36" class="kc-gauge-svg"><circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" stroke-width="3"/><circle cx="18" cy="18" r="15" fill="none" stroke="#d97706" stroke-width="3" stroke-dasharray="57 43" stroke-dashoffset="25" transform="rotate(-90 18 18)"/></svg>
                    <span class="kc-gauge-val">61</span>
                  </div>
                  <div class="kc-win-label amber">61% Win</div>
                  <span class="kc-conv-badge amber">→ Mid</span>
                  <span class="kc-days-badge normal" title="Days in this stage">3d</span>
                </div>
                <div class="kc-client">Nancy Foster</div>
                <div class="kc-product">Term Life — $1M</div>
                <div class="kc-value">$3,200/yr · <span class="kc-comm">$384 comm</span></div>
                <div class="kc-nba-pill blue"><i class="fas fa-file-alt"></i> Share Term vs WL comparison doc</div>
                <div class="kc-tags"><span class="kc-source-tag online"><i class="fas fa-globe"></i> Online Inquiry</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-brief" onclick="event.stopPropagation();openMeetingBrief('MTG-005')"><i class="fas fa-file-alt"></i> Brief</button>
                  <button class="kca-btn kca-quote" onclick="event.stopPropagation();openQuoteModal('D002')"><i class="fas fa-file-invoice-dollar"></i> Quote</button>
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();openDealAIModal('D002')"><i class="fas fa-brain"></i> AI Intel</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D002','Quoted')"><i class="fas fa-arrow-right"></i> Move</button>
                </div>
              </div>
              <div class="kanban-card stale-card" onclick="openDealModal('D003')">
                <div class="kc-stale-banner"><i class="fas fa-hourglass-end"></i> Stale — No movement in 15 days</div>
                <div class="kc-top-row">
                  <div class="kc-win-gauge red" title="Win Probability 44%">
                    <svg viewBox="0 0 36 36" class="kc-gauge-svg"><circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" stroke-width="3"/><circle cx="18" cy="18" r="15" fill="none" stroke="#dc2626" stroke-width="3" stroke-dasharray="41 59" stroke-dashoffset="25" transform="rotate(-90 18 18)"/></svg>
                    <span class="kc-gauge-val">44</span>
                  </div>
                  <div class="kc-win-label red">44% Win</div>
                  <span class="kc-conv-badge red">↓ At Risk</span>
                  <span class="kc-days-badge stale" title="Days in this stage — stale">15d</span>
                </div>
                <div class="kc-client">John Kim</div>
                <div class="kc-product">Disability Insurance</div>
                <div class="kc-value">$2,100/yr · <span class="kc-comm">$252 comm</span></div>
                <div class="kc-nba-pill red"><i class="fas fa-exclamation-triangle"></i> Address APS delay — send empathy script</div>
                <div class="kc-tags"><span class="kc-source-tag warm"><i class="fas fa-fire-alt"></i> Warm Lead</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-quote" onclick="event.stopPropagation();openQuoteModal('D003')"><i class="fas fa-file-invoice-dollar"></i> Quote</button>
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();openDealAIModal('D003')"><i class="fas fa-brain"></i> AI Intel</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D003','Quoted')"><i class="fas fa-arrow-right"></i> Move</button>
                </div>
              </div>
              <button class="add-card-btn" onclick="openAddDealModal('Prospect')"><i class="fas fa-plus"></i> Add Prospect</button>
            </div>

            {/* Quoted */}
            <div class="kanban-col" id="kcol-Quoted">
              <div class="kanban-col-header quoted">
                <span><i class="fas fa-file-invoice-dollar"></i> Quoted</span>
                <div class="kcol-meta">
                  <span class="col-count" id="kcount-Quoted">2</span>
                  <span class="col-value" id="kval-Quoted">$14.4K/yr</span>
                </div>
              </div>
              <div class="kanban-card hot" onclick="openDealModal('D004')">
                <div class="kc-hot-tag"><i class="fas fa-fire"></i> Hot — Close in 3 days</div>
                <div class="kc-top-row">
                  <div class="kc-win-gauge green" title="Win Probability 91%">
                    <svg viewBox="0 0 36 36" class="kc-gauge-svg"><circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" stroke-width="3"/><circle cx="18" cy="18" r="15" fill="none" stroke="#16a34a" stroke-width="3" stroke-dasharray="86 14" stroke-dashoffset="25" transform="rotate(-90 18 18)"/></svg>
                    <span class="kc-gauge-val">91</span>
                  </div>
                  <div class="kc-win-label green">91% Win</div>
                  <span class="kc-conv-badge green">⚡ Urgent</span>
                  <span class="kc-days-badge normal" title="Days in Quoted">2d</span>
                </div>
                <div class="kc-client">Michael Santos</div>
                <div class="kc-product">Universal Life — $750K</div>
                <div class="kc-value">$6,400/yr · <span class="kc-comm">$896 comm</span></div>
                <div class="kc-nba-pill green"><i class="fas fa-phone"></i> Call today — lab results in, close window 3 days</div>
                <div class="kc-upsell-flag"><i class="fas fa-lightbulb"></i> Upsell: Add $500K accidental death rider (+$120/yr) at close</div>
                <div class="kc-tags"><span>Quote Sent</span><span class="tag-ai">+AI Rec</span><span class="kc-source-tag referral"><i class="fas fa-user-friends"></i> Referral</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();openDealAIModal('D004')"><i class="fas fa-brain"></i> AI Intel</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D004','Underwriting')"><i class="fas fa-arrow-right"></i> Move</button>
                </div>
              </div>
              <div class="kanban-card stale-card" onclick="openDealModal('D005')">
                <div class="kc-stale-banner"><i class="fas fa-clock"></i> Idle — No response in 11 days</div>
                <div class="kc-top-row">
                  <div class="kc-win-gauge amber" title="Win Probability 73%">
                    <svg viewBox="0 0 36 36" class="kc-gauge-svg"><circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" stroke-width="3"/><circle cx="18" cy="18" r="15" fill="none" stroke="#d97706" stroke-width="3" stroke-dasharray="69 31" stroke-dashoffset="25" transform="rotate(-90 18 18)"/></svg>
                    <span class="kc-gauge-val">73</span>
                  </div>
                  <div class="kc-win-label amber">73% Win</div>
                  <span class="kc-conv-badge amber">→ Watch</span>
                  <span class="kc-days-badge stale" title="Days in Quoted — stale">11d</span>
                </div>
                <div class="kc-client">Julia Chen</div>
                <div class="kc-product">Deferred Annuity</div>
                <div class="kc-value">$8,000/yr · <span class="kc-comm">$640 comm</span></div>
                <div class="kc-nba-pill orange"><i class="fas fa-percentage"></i> Share Fed rate hike impact — annuity 6.1% now</div>
                <div class="kc-tags"><span class="kc-source-tag online"><i class="fas fa-globe"></i> Online Inquiry</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();openDealAIModal('D005')"><i class="fas fa-brain"></i> AI Intel</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D005','Underwriting')"><i class="fas fa-arrow-right"></i> Move</button>
                </div>
              </div>
              <button class="add-card-btn" onclick="openAddDealModal('Quoted')"><i class="fas fa-plus"></i> Add</button>
            </div>

            {/* Underwriting */}
            <div class="kanban-col" id="kcol-Underwriting">
              <div class="kanban-col-header underwriting">
                <span><i class="fas fa-stethoscope"></i> Underwriting</span>
                <div class="kcol-meta">
                  <span class="col-count" id="kcount-Underwriting">2</span>
                  <span class="col-value" id="kval-Underwriting">$13.4K/yr</span>
                </div>
              </div>
              <div class="kanban-card" onclick="openDealModal('D006')">
                <div class="kc-top-row">
                  <div class="kc-win-gauge green" title="Win Probability 88%">
                    <svg viewBox="0 0 36 36" class="kc-gauge-svg"><circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" stroke-width="3"/><circle cx="18" cy="18" r="15" fill="none" stroke="#16a34a" stroke-width="3" stroke-dasharray="83 17" stroke-dashoffset="25" transform="rotate(-90 18 18)"/></svg>
                    <span class="kc-gauge-val">88</span>
                  </div>
                  <div class="kc-win-label green">88% Win</div>
                  <span class="kc-conv-badge green">↑ On Track</span>
                  <span class="kc-days-badge normal" title="Days in UW">5d</span>
                </div>
                <div class="kc-client">Thomas Wright</div>
                <div class="kc-product">Whole Life — $1M</div>
                <div class="kc-value">$9,600/yr · <span class="kc-comm">$1,152 comm</span></div>
                <div class="kc-nba-pill blue"><i class="fas fa-hourglass-half"></i> UW decision Apr 16 — prepare e-delivery kit</div>
                <div class="kc-tags"><span>Medical Exam Done</span><span class="kc-source-tag referral"><i class="fas fa-user-friends"></i> Referral</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();openDealAIModal('D006')"><i class="fas fa-brain"></i> AI Intel</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D006','Approved')"><i class="fas fa-arrow-right"></i> Move</button>
                </div>
              </div>
              <div class="kanban-card stale-card" onclick="openDealModal('D007')">
                <div class="kc-stale-banner"><i class="fas fa-hourglass-half"></i> UW prolonged — 19 days awaiting decision</div>
                <div class="kc-top-row">
                  <div class="kc-win-gauge amber" title="Win Probability 69%">
                    <svg viewBox="0 0 36 36" class="kc-gauge-svg"><circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" stroke-width="3"/><circle cx="18" cy="18" r="15" fill="none" stroke="#d97706" stroke-width="3" stroke-dasharray="65 35" stroke-dashoffset="25" transform="rotate(-90 18 18)"/></svg>
                    <span class="kc-gauge-val">69</span>
                  </div>
                  <div class="kc-win-label amber">69% Win</div>
                  <span class="kc-conv-badge amber">→ Monitor</span>
                  <span class="kc-days-badge stale" title="Days in UW — stale">19d</span>
                </div>
                <div class="kc-client">Grace Lee</div>
                <div class="kc-product">VUL — $250K</div>
                <div class="kc-value">$3,800/yr · <span class="kc-comm">$456 comm</span></div>
                <div class="kc-nba-pill orange"><i class="fas fa-stethoscope"></i> Chase APS — delay risk, call doctor's office</div>
                <div class="kc-tags"><span class="kc-source-tag warm"><i class="fas fa-fire-alt"></i> Warm Lead</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();openDealAIModal('D007')"><i class="fas fa-brain"></i> AI Intel</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D007','Approved')"><i class="fas fa-arrow-right"></i> Move</button>
                </div>
              </div>
              <button class="add-card-btn" onclick="openAddDealModal('Underwriting')"><i class="fas fa-plus"></i> Add</button>
            </div>

            {/* Approved */}
            <div class="kanban-col" id="kcol-Approved">
              <div class="kanban-col-header approved">
                <span><i class="fas fa-check-circle"></i> Approved</span>
                <div class="kcol-meta">
                  <span class="col-count" id="kcount-Approved">2</span>
                  <span class="col-value" id="kval-Approved">$4.6K/yr</span>
                </div>
              </div>
              <div class="kanban-card hot" onclick="openDealModal('D008')">
                <div class="kc-hot-tag"><i class="fas fa-signature"></i> E-Sig Pending — Act Today</div>
                <div class="kc-top-row">
                  <div class="kc-win-gauge green" title="Win Probability 95%">
                    <svg viewBox="0 0 36 36" class="kc-gauge-svg"><circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" stroke-width="3"/><circle cx="18" cy="18" r="15" fill="none" stroke="#16a34a" stroke-width="3" stroke-dasharray="90 10" stroke-dashoffset="25" transform="rotate(-90 18 18)"/></svg>
                    <span class="kc-gauge-val">95</span>
                  </div>
                  <div class="kc-win-label green">95% Win</div>
                  <span class="kc-conv-badge green">⚡ Close Now</span>
                  <span class="kc-days-badge normal" title="Days in Approved">5d</span>
                </div>
                <div class="kc-client">Kevin Park</div>
                <div class="kc-product">Term Life — $500K</div>
                <div class="kc-value">$1,800/yr · <span class="kc-comm">$216 comm</span></div>
                <div class="kc-nba-pill green"><i class="fas fa-paper-plane"></i> Resend DocuSign reminder — 2-day close window</div>
                <div class="kc-tags"><span class="tag-urgent">Awaiting Signature</span><span class="kc-source-tag referral"><i class="fas fa-user-friends"></i> Referral</span></div>
                <div class="kc-eapp-bar"><span class="kc-eapp-ai-tag"><i class="fas fa-robot"></i> AI Pre-filled</span><span class="kc-eapp-pct">95% complete</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-eapp" onclick="event.stopPropagation();openEApp('EA-008')"><i class="fas fa-file-contract"></i> E-App</button>
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();openDealAIModal('D008')"><i class="fas fa-brain"></i> AI Intel</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D008','Closed Won')"><i class="fas fa-trophy"></i> Close</button>
                </div>
              </div>
              <div class="kanban-card" onclick="openDealModal('D009')">
                <div class="kc-top-row">
                  <div class="kc-win-gauge green" title="Win Probability 90%">
                    <svg viewBox="0 0 36 36" class="kc-gauge-svg"><circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" stroke-width="3"/><circle cx="18" cy="18" r="15" fill="none" stroke="#16a34a" stroke-width="3" stroke-dasharray="85 15" stroke-dashoffset="25" transform="rotate(-90 18 18)"/></svg>
                    <span class="kc-gauge-val">90</span>
                  </div>
                  <div class="kc-win-label green">90% Win</div>
                  <span class="kc-conv-badge green">↑ Near Close</span>
                  <span class="kc-days-badge normal" title="Days in Approved">1d</span>
                </div>
                <div class="kc-client">Linda Morrison</div>
                <div class="kc-product">UMA — $280K AUM</div>
                <div class="kc-value">$2,800/yr fee · <span class="kc-comm">$280 comm</span></div>
                <div class="kc-nba-pill blue"><i class="fas fa-exchange-alt"></i> Initiate ACAT transfer — schedule May 15 review</div>
                <div class="kc-upsell-flag"><i class="fas fa-lightbulb"></i> Upsell: NQDC plan + estate-planning review — high net worth profile</div>
                <div class="kc-tags"><span>Docs Signed</span><span class="kc-source-tag cold"><i class="fas fa-phone-alt"></i> Outreach</span></div>
                <div class="kc-eapp-bar"><span class="kc-eapp-ai-tag"><i class="fas fa-robot"></i> AI Pre-filled</span><span class="kc-eapp-pct">100% complete</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-eapp" onclick="event.stopPropagation();openEApp('EA-009')"><i class="fas fa-file-contract"></i> E-App</button>
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();openDealAIModal('D009')"><i class="fas fa-brain"></i> AI Intel</button>
                  <button class="kca-btn kca-move" onclick="event.stopPropagation();moveDealStage('D009','Closed Won')"><i class="fas fa-trophy"></i> Close</button>
                </div>
              </div>
              <button class="add-card-btn" onclick="openAddDealModal('Approved')"><i class="fas fa-plus"></i> Add</button>
            </div>

            {/* Closed Won */}
            <div class="kanban-col" id="kcol-Closed Won">
              <div class="kanban-col-header closed">
                <span><i class="fas fa-trophy"></i> Closed Won</span>
                <div class="kcol-meta">
                  <span class="col-count" id="kcount-Closed Won">34</span>
                  <span class="col-value col-value-won" id="kval-Closed Won">$171K/yr</span>
                </div>
              </div>
              <div class="kanban-card won" onclick="openClosedWonModal('CW-001')" style="cursor:pointer" title="Click to view deal details">
                <div class="kc-won-row">
                  <div class="kc-won-check"><i class="fas fa-check-circle"></i></div>
                  <div class="kc-won-info">
                    <div class="kc-client">David Thompson</div>
                    <div class="kc-product">Term Life — $500K</div>
                    <div class="kc-value">$2,400/yr · <span class="kc-comm">$288 comm</span></div>
                  </div>
                </div>
                <div class="kc-tags"><span class="kc-won-date">Apr 7 · Issued</span><span class="kc-source-tag referral"><i class="fas fa-user-friends"></i> Referral</span></div>
                <div class="kc-won-hint"><i class="fas fa-mouse-pointer"></i> Click for deal details &amp; upsell plan</div>
              </div>
              <div class="kanban-card won" onclick="openClosedWonModal('CW-002')" style="cursor:pointer" title="Click to view deal details">
                <div class="kc-won-row">
                  <div class="kc-won-check"><i class="fas fa-check-circle"></i></div>
                  <div class="kc-won-info">
                    <div class="kc-client">Lisa Brown</div>
                    <div class="kc-product">Long-term Care</div>
                    <div class="kc-value">$5,200/yr · <span class="kc-comm">$624 comm</span></div>
                  </div>
                </div>
                <div class="kc-tags"><span class="kc-won-date">Apr 5 · Issued</span><span class="kc-source-tag online"><i class="fas fa-globe"></i> Online</span></div>
                <div class="kc-won-hint"><i class="fas fa-mouse-pointer"></i> Click for deal details &amp; upsell plan</div>
              </div>
              <div class="kanban-card won" onclick="openClosedWonModal('CW-003')" style="cursor:pointer" title="Click to view deal details">
                <div class="kc-won-row">
                  <div class="kc-won-check"><i class="fas fa-check-circle"></i></div>
                  <div class="kc-won-info">
                    <div class="kc-client">Robert Chen</div>
                    <div class="kc-product">Whole Life — $1M</div>
                    <div class="kc-value">$12,400/yr · <span class="kc-comm">$1,488 comm</span></div>
                  </div>
                </div>
                <div class="kc-tags"><span class="kc-won-date">Apr 2 · Issued</span><span class="kc-source-tag referral"><i class="fas fa-user-friends"></i> Referral</span></div>
                <div class="kc-won-hint"><i class="fas fa-mouse-pointer"></i> Click for deal details &amp; upsell plan</div>
              </div>
              <div class="view-more-btn" onclick="openDealModal('closed-all')">+ 31 more this month →</div>
            </div>

            {/* Closed Lost */}
            <div class="kanban-col kcol-lost" id="kcol-Closed Lost">
              <div class="kanban-col-header lost">
                <span><i class="fas fa-times-circle"></i> Closed Lost</span>
                <div class="kcol-meta">
                  <span class="col-count col-count-lost" id="kcount-Closed Lost">3</span>
                  <span class="col-value col-value-lost" id="kval-Closed Lost">$9.1K/yr</span>
                </div>
              </div>
              <div class="kanban-card lost-card" onclick="openClosedLostModal('CL-001')" style="cursor:pointer" title="Click for loss analysis">
                <div class="kc-lost-reason"><i class="fas fa-ban"></i> Lost — Chose competitor</div>
                <div class="kc-client">Mark Henderson</div>
                <div class="kc-product">Term Life — $250K</div>
                <div class="kc-value">$1,800/yr · <span class="kc-comm text-muted">$0 comm</span></div>
                <div class="kc-tags"><span class="kc-won-date text-muted">Apr 10 · Lost</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();openClosedLostModal('CL-001')"><i class="fas fa-robot"></i> Loss Analysis</button>
                </div>
              </div>
              <div class="kanban-card lost-card" onclick="openClosedLostModal('CL-002')" style="cursor:pointer" title="Click for loss analysis">
                <div class="kc-lost-reason"><i class="fas fa-clock"></i> Lost — Budget objection</div>
                <div class="kc-client">Patricia Nguyen</div>
                <div class="kc-product">Disability Insurance</div>
                <div class="kc-value">$3,600/yr · <span class="kc-comm text-muted">$0 comm</span></div>
                <div class="kc-tags"><span class="kc-won-date text-muted">Apr 8 · Lost</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();openClosedLostModal('CL-002')"><i class="fas fa-robot"></i> Loss Analysis</button>
                </div>
              </div>
              <div class="kanban-card lost-card" onclick="openClosedLostModal('CL-003')" style="cursor:pointer" title="Click for loss analysis">
                <div class="kc-lost-reason"><i class="fas fa-user-times"></i> Lost — Unresponsive</div>
                <div class="kc-client">James Okafor</div>
                <div class="kc-product">Whole Life — $300K</div>
                <div class="kc-value">$3,700/yr · <span class="kc-comm text-muted">$0 comm</span></div>
                <div class="kc-tags"><span class="kc-won-date text-muted">Apr 3 · Closed</span></div>
                <div class="kc-actions">
                  <button class="kca-btn kca-ai" onclick="event.stopPropagation();openClosedLostModal('CL-003')"><i class="fas fa-robot"></i> Loss Analysis</button>
                </div>
              </div>
            </div>

          </div>{/* end kanban-board */}
        </div>{/* end sales-kanban-wrap */}
      </div>{/* end sales-main-col */}

      {/* ── Below-Kanban Intelligence Grid ── */}
      <div class="sales-intel-grid">

          {/* AI Win Engine Panel */}
          <div class="pipeline-ai-panel ai-win-engine">
            <div class="pai-header">
              <div class="pai-title"><i class="fas fa-brain"></i> AI Win Engine</div>
              <span class="pai-badge">LIVE</span>
            </div>
            <div class="pai-subtitle">9 deals · ranked by close probability · NBA auto-triggered</div>

            {/* Conversion Funnel Mini */}
            <div class="awe-funnel">
              <div class="awe-funnel-title"><i class="fas fa-filter"></i> Conversion Funnel</div>
              <div class="awe-funnel-stages">
                <div class="awe-funnel-stage">
                  <div class="awe-funnel-bar" style="width:100%;background:#6366f1"></div>
                  <div class="awe-funnel-lbl">Prospect <span>8</span></div>
                </div>
                <div class="awe-funnel-stage">
                  <div class="awe-funnel-bar" style="width:75%;background:#0ea5e9"></div>
                  <div class="awe-funnel-lbl">Quoted <span>6</span></div>
                </div>
                <div class="awe-funnel-stage">
                  <div class="awe-funnel-bar" style="width:50%;background:#f59e0b"></div>
                  <div class="awe-funnel-lbl">UW <span>4</span></div>
                </div>
                <div class="awe-funnel-stage">
                  <div class="awe-funnel-bar" style="width:38%;background:#22c55e"></div>
                  <div class="awe-funnel-lbl">Approved <span>3</span></div>
                </div>
              </div>
              <div class="awe-funnel-conv">AI-predicted close rate: <strong>68%</strong> · +4% vs last month</div>
            </div>

            {/* Top Deals */}
            <div class="awe-section-lbl"><i class="fas fa-trophy"></i> Top Deals by Win Probability</div>
            <div class="pai-list">

              <div class="pai-item awe-item" onclick="openDealAIModal('D008')">
                <div class="pai-rank awe-rank-1">1</div>
                <div class="pai-info">
                  <div class="pai-client">Kevin Park</div>
                  <div class="pai-product">Term Life $500K</div>
                  <div class="pai-action ai-action-green"><i class="fas fa-signature"></i> <strong>NOW:</strong> Resend DocuSign — closes in 2 days</div>
                </div>
                <div class="pai-score pai-score-green awe-score">
                  <div class="awe-score-val">95%</div>
                  <div class="awe-score-lbl">win</div>
                </div>
              </div>

              <div class="pai-item awe-item" onclick="openDealAIModal('D004')">
                <div class="pai-rank awe-rank-2">2</div>
                <div class="pai-info">
                  <div class="pai-client">Michael Santos</div>
                  <div class="pai-product">Universal Life $750K</div>
                  <div class="pai-action ai-action-green"><i class="fas fa-flask"></i> Lab results in — call to close</div>
                </div>
                <div class="pai-score pai-score-green awe-score">
                  <div class="awe-score-val">91%</div>
                  <div class="awe-score-lbl">win</div>
                </div>
              </div>

              <div class="pai-item awe-item" onclick="openDealAIModal('D009')">
                <div class="pai-rank awe-rank-3">3</div>
                <div class="pai-info">
                  <div class="pai-client">Linda Morrison</div>
                  <div class="pai-product">UMA $280K AUM</div>
                  <div class="pai-action ai-action-green"><i class="fas fa-exchange-alt"></i> Initiate ACAT — 5-day transfer</div>
                </div>
                <div class="pai-score pai-score-green awe-score">
                  <div class="awe-score-val">90%</div>
                  <div class="awe-score-lbl">win</div>
                </div>
              </div>

              <div class="pai-item awe-item" onclick="openDealAIModal('D006')">
                <div class="pai-rank">4</div>
                <div class="pai-info">
                  <div class="pai-client">Thomas Wright</div>
                  <div class="pai-product">Whole Life $1M</div>
                  <div class="pai-action ai-action-amber"><i class="fas fa-hourglass-half"></i> UW decision Apr 16 — prep e-delivery</div>
                </div>
                <div class="pai-score pai-score-amber awe-score">
                  <div class="awe-score-val">88%</div>
                  <div class="awe-score-lbl">win</div>
                </div>
              </div>

              <div class="pai-item awe-item" onclick="openDealAIModal('D001')">
                <div class="pai-rank">5</div>
                <div class="pai-info">
                  <div class="pai-client">Alex Rivera</div>
                  <div class="pai-product">Whole Life $500K</div>
                  <div class="pai-action ai-action-amber"><i class="fas fa-calendar-alt"></i> Meeting Apr 12 — send pre-brief</div>
                </div>
                <div class="pai-score pai-score-amber awe-score">
                  <div class="awe-score-val">82%</div>
                  <div class="awe-score-lbl">win</div>
                </div>
              </div>

            </div>

            {/* AI Forecast Strip */}
            <div class="awe-forecast-strip">
              <div class="awe-forecast-item">
                <div class="awe-forecast-val green">$47.2K</div>
                <div class="awe-forecast-lbl">Projected Close</div>
              </div>
              <div class="awe-forecast-item">
                <div class="awe-forecast-val blue">Apr 30</div>
                <div class="awe-forecast-lbl">Target Date</div>
              </div>
              <div class="awe-forecast-item">
                <div class="awe-forecast-val gold">3 deals</div>
                <div class="awe-forecast-lbl">Close-Ready</div>
              </div>
            </div>

            <div class="awe-btn-row">
              <button class="pai-ask-btn" onclick="openSalesAIReport()">
                <i class="fas fa-brain"></i> Full AI Win Analysis
              </button>
              <button class="pai-ask-btn pai-ask-btn-outline" onclick="sendContextMessage('Sales pipeline AI — give me conversion prediction and next best actions for all 9 active deals ranked by priority','smart-advisor')">
                <i class="fas fa-robot"></i> Ask AI Advisor
              </button>
            </div>
          </div>

          {/* ── Pipeline Velocity Widget ── */}
          <div class="pipeline-velocity-panel">
            <div class="pvp-header">
              <div class="pvp-title"><i class="fas fa-tachometer-alt"></i> Pipeline Velocity</div>
              <span class="pvp-badge">Avg 12.4d end-to-end</span>
            </div>
            <div class="pvp-sub">Average days per stage — highlights where deals stall</div>
            <div class="pvp-stages">
              <div class="pvp-stage">
                <div class="pvp-stage-label">Prospect</div>
                <div class="pvp-bar-wrap">
                  <div class="pvp-bar-fill pvp-ok" style="width:48%"></div>
                </div>
                <div class="pvp-stage-days">3.2d</div>
              </div>
              <div class="pvp-stage">
                <div class="pvp-stage-label">Quoted</div>
                <div class="pvp-bar-wrap">
                  <div class="pvp-bar-fill pvp-warn" style="width:72%"></div>
                </div>
                <div class="pvp-stage-days pvp-days-warn">4.8d ⚠</div>
              </div>
              <div class="pvp-stage">
                <div class="pvp-stage-label">Underwriting</div>
                <div class="pvp-bar-wrap">
                  <div class="pvp-bar-fill pvp-danger" style="width:100%"></div>
                </div>
                <div class="pvp-stage-days pvp-days-danger">12.1d 🔴</div>
              </div>
              <div class="pvp-stage">
                <div class="pvp-stage-label">Approved</div>
                <div class="pvp-bar-wrap">
                  <div class="pvp-bar-fill pvp-ok" style="width:36%"></div>
                </div>
                <div class="pvp-stage-days">2.4d</div>
              </div>
            </div>
            <div class="pvp-insight"><i class="fas fa-robot"></i> <strong>AI Insight:</strong> Underwriting is your biggest bottleneck — 12.1d avg vs. 6d target. Chase APS earlier to cut cycle time.</div>
            <button class="pvp-btn" onclick="sendContextMessage('Analyze my pipeline velocity — where are deals stalling and what can I do to speed up each stage?','smart-advisor')"><i class="fas fa-robot"></i> AI Velocity Tips</button>
          </div>

          {/* ── Lead Source Breakdown Panel ── */}
          <div class="lead-source-panel">
            <div class="lsp-header">
              <div class="lsp-title"><i class="fas fa-filter"></i> Lead Source Breakdown</div>
            </div>
            <div class="lsp-rows">
              <div class="lsp-row">
                <div class="lsp-source-label"><span class="lsp-dot referral"></span> Referral</div>
                <div class="lsp-bar-wrap"><div class="lsp-bar lsp-referral" style="width:55%"></div></div>
                <div class="lsp-meta"><span class="lsp-count">5 deals</span><span class="lsp-conv referral-conv">74% conv.</span></div>
              </div>
              <div class="lsp-row">
                <div class="lsp-source-label"><span class="lsp-dot online"></span> Online Inquiry</div>
                <div class="lsp-bar-wrap"><div class="lsp-bar lsp-online" style="width:30%"></div></div>
                <div class="lsp-meta"><span class="lsp-count">2 deals</span><span class="lsp-conv online-conv">61% conv.</span></div>
              </div>
              <div class="lsp-row">
                <div class="lsp-source-label"><span class="lsp-dot warm"></span> Warm Lead</div>
                <div class="lsp-bar-wrap"><div class="lsp-bar lsp-warm" style="width:22%"></div></div>
                <div class="lsp-meta"><span class="lsp-count">1 deal</span><span class="lsp-conv warm-conv">44% conv.</span></div>
              </div>
              <div class="lsp-row">
                <div class="lsp-source-label"><span class="lsp-dot cold"></span> Cold Outreach</div>
                <div class="lsp-bar-wrap"><div class="lsp-bar lsp-cold" style="width:15%"></div></div>
                <div class="lsp-meta"><span class="lsp-count">1 deal</span><span class="lsp-conv cold-conv">90% conv.</span></div>
              </div>
            </div>
            <div class="lsp-insight"><i class="fas fa-lightbulb"></i> Referrals generate 55% of pipeline with 74% conversion — prioritise referral asks at every close.</div>
          </div>

          {/* Commission Tracker */}
          <div class="comm-tracker">
            <div class="comm-header">
              <div class="comm-title"><i class="fas fa-dollar-sign"></i> Commission Tracker</div>
              <span class="comm-period">2026</span>
            </div>

            {/* YTD Progress */}
            {/* Quota Attainment Radial Gauge */}
            <div class="quota-gauge-wrap">
              <svg viewBox="0 0 120 70" class="quota-gauge-svg">
                {/* Background arc */}
                <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="#e2e8f0" stroke-width="10" stroke-linecap="round"/>
                {/* Fill arc — 78% = 0.78 * 180 = 140.4deg of the semicircle */}
                <path d="M 10 65 A 50 50 0 0 1 110 65" fill="none" stroke="url(#quotaGrad)" stroke-width="10" stroke-linecap="round" stroke-dasharray="140 180" />
                <defs>
                  <linearGradient id="quotaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#003087"/>
                    <stop offset="100%" stop-color="#22c55e"/>
                  </linearGradient>
                </defs>
                <text x="60" y="60" text-anchor="middle" font-size="16" font-weight="800" fill="#0f172a">78%</text>
              </svg>
              <div class="quota-gauge-labels">
                <span class="qgl-left">$0</span>
                <div class="qgl-center">
                  <div class="qgl-ytd">$187K YTD</div>
                  <div class="qgl-target">Target: $240K</div>
                </div>
                <span class="qgl-right">$240K</span>
              </div>
              <div class="quota-proj-note"><i class="fas fa-robot"></i> AI Projection: <strong>$241K</strong> by Dec 31 — on track to exceed target by <strong>0.4%</strong></div>
            </div>

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

      </div>{/* end sales-intel-grid */}

      {/* ── Activity Log / Follow-up Tracker ── */}
      <div class="activity-log-panel" id="activity-log-panel">
        <div class="alp-header" onclick="toggleActivityLog()">
          <div class="alp-header-left">
            <div class="alp-icon"><i class="fas fa-history"></i></div>
            <div>
              <div class="alp-title">Activity Log &amp; Follow-up Tracker <span class="alp-badge">12 activities · 4 follow-ups due</span></div>
              <div class="alp-sub">All deal touchpoints across calls, emails, docs, and NBA completions · Updated just now</div>
            </div>
          </div>
          <button class="alp-collapse-btn" id="alp-collapse-btn" title="Toggle"><i class="fas fa-chevron-down"></i></button>
        </div>
        <div class="alp-body" id="alp-body">
          <div class="alp-layout">
            {/* Left: recent activity feed */}
            <div class="alp-feed">
              <div class="alp-feed-title"><i class="fas fa-stream"></i> Recent Activity</div>
              <div class="alp-entry alp-call">
                <div class="alp-entry-icon call"><i class="fas fa-phone"></i></div>
                <div class="alp-entry-body">
                  <div class="alp-entry-title">Call — Michael Santos (D004)</div>
                  <div class="alp-entry-sub">Discussed UL $750K quote · Lab results confirmed · Client ready to proceed</div>
                  <div class="alp-entry-meta">Today · 10:32 AM · <span class="alp-outcome win">Positive — Close expected in 3d</span></div>
                </div>
              </div>
              <div class="alp-entry alp-email">
                <div class="alp-entry-icon email"><i class="fas fa-envelope"></i></div>
                <div class="alp-entry-body">
                  <div class="alp-entry-title">Email Sent — Kevin Park (D008)</div>
                  <div class="alp-entry-sub">DocuSign reminder sent — Term $500K approval awaiting e-signature</div>
                  <div class="alp-entry-meta">Today · 9:15 AM · <span class="alp-outcome pending">Pending response</span></div>
                </div>
              </div>
              <div class="alp-entry alp-doc">
                <div class="alp-entry-icon doc"><i class="fas fa-file-alt"></i></div>
                <div class="alp-entry-body">
                  <div class="alp-entry-title">Meeting Brief Sent — Alex Rivera (D001)</div>
                  <div class="alp-entry-sub">Pre-meeting brief emailed: WL $500K cash value story + living benefits</div>
                  <div class="alp-entry-meta">Apr 11 · 3:44 PM · <span class="alp-outcome neutral">Meeting Apr 12</span></div>
                </div>
              </div>
              <div class="alp-entry alp-nba">
                <div class="alp-entry-icon nba"><i class="fas fa-bolt"></i></div>
                <div class="alp-entry-body">
                  <div class="alp-entry-title">NBA Completed — Julia Chen (D005)</div>
                  <div class="alp-entry-sub">Fed rate hike comparison doc shared via secure portal</div>
                  <div class="alp-entry-meta">Apr 10 · 2:10 PM · <span class="alp-outcome pending">No response in 3d — follow up</span></div>
                </div>
              </div>
              <div class="alp-entry alp-call">
                <div class="alp-entry-icon call"><i class="fas fa-phone-slash"></i></div>
                <div class="alp-entry-body">
                  <div class="alp-entry-title">Call Missed — Grace Lee (D007)</div>
                  <div class="alp-entry-sub">No answer — left voicemail re: UW status update</div>
                  <div class="alp-entry-meta">Apr 9 · 11:00 AM · <span class="alp-outcome warn">Retry tomorrow</span></div>
                </div>
              </div>
              <div class="alp-entry alp-email">
                <div class="alp-entry-icon email"><i class="fas fa-envelope"></i></div>
                <div class="alp-entry-body">
                  <div class="alp-entry-title">Email Sent — John Kim (D003)</div>
                  <div class="alp-entry-sub">Empathy script sent re: APS delay — offered DI illustration update</div>
                  <div class="alp-entry-meta">Apr 9 · 9:30 AM · <span class="alp-outcome warn">No reply — stale</span></div>
                </div>
              </div>
            </div>
            {/* Right: follow-up due list */}
            <div class="alp-followups">
              <div class="alp-feed-title"><i class="fas fa-tasks"></i> Follow-ups Due</div>
              <div class="alp-fu-item alp-fu-today">
                <div class="alp-fu-when">Today</div>
                <div class="alp-fu-deal">D008 — Kevin Park</div>
                <div class="alp-fu-task">Chase DocuSign · Term $500K · 2-day close window</div>
                <div class="alp-fu-actions">
                  <button class="alp-fu-btn primary" onclick="openDealModal('D008')"><i class="fas fa-signature"></i> View E-App</button>
                  <button class="alp-fu-btn ghost" onclick="openDealAIModal('D008')"><i class="fas fa-robot"></i> AI</button>
                </div>
              </div>
              <div class="alp-fu-item alp-fu-today">
                <div class="alp-fu-when">Today</div>
                <div class="alp-fu-deal">D004 — Michael Santos</div>
                <div class="alp-fu-task">Call to close · Lab results in · UL $750K</div>
                <div class="alp-fu-actions">
                  <button class="alp-fu-btn primary" onclick="openDealModal('D004')"><i class="fas fa-phone"></i> Call</button>
                  <button class="alp-fu-btn ghost" onclick="openDealAIModal('D004')"><i class="fas fa-robot"></i> AI</button>
                </div>
              </div>
              <div class="alp-fu-item alp-fu-tomorrow">
                <div class="alp-fu-when">Apr 15</div>
                <div class="alp-fu-deal">D005 — Julia Chen</div>
                <div class="alp-fu-task">Follow-up on annuity quote · 11d idle</div>
                <div class="alp-fu-actions">
                  <button class="alp-fu-btn primary" onclick="openDealAIModal('D005')"><i class="fas fa-paper-plane"></i> Send</button>
                </div>
              </div>
              <div class="alp-fu-item alp-fu-overdue">
                <div class="alp-fu-when overdue">Overdue</div>
                <div class="alp-fu-deal">D003 — John Kim</div>
                <div class="alp-fu-task">3rd follow-up · APS empathy script · Stale 15d</div>
                <div class="alp-fu-actions">
                  <button class="alp-fu-btn primary" onclick="openDealAIModal('D003')"><i class="fas fa-brain"></i> AI Script</button>
                </div>
              </div>
            </div>
          </div>
          <div class="alp-footer">
            <button class="btn btn-ai" onclick="sendContextMessage('Review my sales activity log — summarise outreach efforts, identify gaps, and suggest the most impactful follow-ups for today','smart-advisor')"><i class="fas fa-robot"></i> AI Activity Summary</button>
            <button class="btn btn-outline-sm" onclick="alert('Exporting activity log…')"><i class="fas fa-download"></i> Export Log</button>
            <button class="btn btn-outline-sm" onclick="alert('Logging new activity…')"><i class="fas fa-plus"></i> Log Activity</button>
          </div>
        </div>
      </div>

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
        <div class="deal-modal deal-modal-tabbed">
          <div class="deal-modal-header" id="deal-modal-header">
            <div class="deal-modal-header-info">
              <div class="deal-modal-client" id="deal-modal-client">Client Name</div>
              <div class="deal-modal-product" id="deal-modal-product">Product</div>
            </div>
            <div class="deal-modal-kpi-row" id="deal-modal-kpi-row">
              <div class="dm-kpi"><div class="dm-kpi-val green" id="dm-win-val">—%</div><div class="dm-kpi-lbl">Win Prob.</div></div>
              <div class="dm-kpi"><div class="dm-kpi-val blue" id="dm-stage-val">—</div><div class="dm-kpi-lbl">Stage</div></div>
              <div class="dm-kpi"><div class="dm-kpi-val gold" id="dm-comm-val">—</div><div class="dm-kpi-lbl">Commission</div></div>
            </div>
            <button class="deal-modal-close" onclick="closeDealModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="deal-modal-tabs" id="deal-modal-tabs">
            <button class="dmt-tab active" onclick="switchDealTab('overview',this)"><i class="fas fa-chart-bar"></i> Overview</button>
            <button class="dmt-tab" onclick="switchDealTab('activity',this)"><i class="fas fa-history"></i> Activity</button>
            <button class="dmt-tab" onclick="switchDealTab('docs',this)"><i class="fas fa-file-alt"></i> Documents</button>
            <button class="dmt-tab" onclick="switchDealTab('upsell',this)"><i class="fas fa-lightbulb"></i> Upsell</button>
            <button class="dmt-tab" onclick="switchDealTab('competitive',this)"><i class="fas fa-chess"></i> Competitive</button>
          </div>
          <div class="deal-modal-body" id="deal-modal-body"></div>
        </div>
      </div>

      {/* ── Quote Generation Modal ── */}
      <div class="quote-gen-overlay" id="quote-gen-overlay" onclick="if(event.target===this)closeQuoteModal()" style="display:none">
        <div class="quote-gen-modal" onclick="event.stopPropagation()">
          <div class="qg-header">
            <div class="qg-header-left">
              <div class="qg-header-icon"><i class="fas fa-file-invoice-dollar"></i></div>
              <div>
                <div class="qg-header-title">Quote Generation Engine</div>
                <div class="qg-header-sub" id="qg-step-title">Step 1 of 3 — Client &amp; Health Profile</div>
              </div>
            </div>
            <div class="qg-step-tracker">
              <div class="qg-step-dot active" title="Client Profile"><span>1</span></div>
              <div class="qg-step-line"></div>
              <div class="qg-step-dot" title="Product Config"><span>2</span></div>
              <div class="qg-step-line"></div>
              <div class="qg-step-dot" title="Quote Results"><span>3</span></div>
            </div>
            <button class="deal-modal-close" onclick="closeQuoteModal()"><i class="fas fa-times"></i></button>
          </div>

          {/* Step 1 — Client & Health */}
          <div class="qg-step-body" id="qg-step-1">
            <div class="qg-ai-banner"><i class="fas fa-robot"></i> AI pre-filled from 3rd-party data — WealthEngine, Experian, LinkedIn. Review &amp; confirm.</div>
            <div class="qg-form-grid">
              <div class="qg-field">
                <label>Client / Prospect Name</label>
                <input type="text" id="qg-name" class="form-input" placeholder="Full name" />
              </div>
              <div class="qg-field">
                <label>Age</label>
                <input type="number" id="qg-age" class="form-input" min="18" max="85" placeholder="42" />
              </div>
              <div class="qg-field">
                <label>Gender</label>
                <select id="qg-gender" class="form-input">
                  <option value="m">Male</option>
                  <option value="f">Female</option>
                </select>
              </div>
              <div class="qg-field">
                <label>Health Classification</label>
                <select id="qg-health" class="form-input">
                  <option value="pp">Preferred Plus (Best)</option>
                  <option value="p" selected>Preferred</option>
                  <option value="sp">Standard Plus</option>
                  <option value="s">Standard</option>
                </select>
              </div>
              <div class="qg-field">
                <label>Annual Income <span class="qg-data-src"><i class="fas fa-database"></i> Experian</span></label>
                <input type="text" id="qg-income" class="form-input" placeholder="e.g. 150,000" />
              </div>
              <div class="qg-field">
                <label>Estimated Net Worth <span class="qg-data-src"><i class="fas fa-database"></i> WealthEngine</span></label>
                <input type="text" id="qg-networth" class="form-input" placeholder="e.g. 500,000" />
              </div>
            </div>
            <div class="qg-health-guide">
              <div class="qg-hg-title"><i class="fas fa-info-circle"></i> Health Class Quick Guide</div>
              <div class="qg-hg-items">
                <div class="qg-hg-item green"><strong>Preferred Plus</strong> — Excellent health, no major conditions, BMI 18–28, non-smoker</div>
                <div class="qg-hg-item blue"><strong>Preferred</strong> — Good health, minor controlled conditions, BMI 18–32</div>
                <div class="qg-hg-item amber"><strong>Standard Plus</strong> — Controlled BP/cholesterol, family history, BMI up to 35</div>
                <div class="qg-hg-item red"><strong>Standard</strong> — Managed chronic conditions, higher BMI, other risk factors</div>
              </div>
            </div>
            <div class="qg-footer">
              <button class="btn btn-outline" onclick="closeQuoteModal()"><i class="fas fa-times"></i> Cancel</button>
              <button class="btn btn-primary" onclick="qgNext()">Next — Product Config <i class="fas fa-arrow-right"></i></button>
            </div>
          </div>

          {/* Step 2 — Product Configuration */}
          <div class="qg-step-body" id="qg-step-2" style="display:none">
            <div class="qg-product-select-row">
              <label>Select Insurance Product</label>
              <select id="qg-product" class="form-input" onchange="_updateQuoteProductUI()">
                <option value="term">Term Life Insurance</option>
                <option value="wl">Whole Life Insurance</option>
                <option value="ul">Universal Life Insurance</option>
                <option value="vul">Variable Universal Life</option>
                <option value="ltc">Long-Term Care Insurance</option>
                <option value="di">Disability Income Insurance</option>
                <option value="fa">Fixed Annuity</option>
                <option value="va">Variable Annuity</option>
              </select>
              <div class="qg-product-badge" id="qg-product-badge" style="background:#003087"><i class="fas fa-shield-alt"></i> Term Life Insurance</div>
            </div>
            <div class="qg-form-grid">
              <div class="qg-field">
                <label>Coverage / Benefit Amount</label>
                <select id="qg-coverage" class="form-input"></select>
              </div>
              <div class="qg-field" id="qg-term-row" style="display:flex">
                <label>Term Length (years)</label>
                <select id="qg-term" class="form-input">
                  <option value="10">10 Years</option>
                  <option value="15">15 Years</option>
                  <option value="20" selected>20 Years</option>
                  <option value="25">25 Years</option>
                  <option value="30">30 Years</option>
                </select>
              </div>
            </div>
            <div class="qg-riders-section">
              <div class="qg-riders-title"><i class="fas fa-plus-circle"></i> Optional Riders &amp; Add-ons</div>
              <div class="qg-rider-list" id="qg-rider-list"></div>
            </div>
            <div class="qg-footer">
              <button class="btn btn-outline" onclick="qgBack()"><i class="fas fa-arrow-left"></i> Back</button>
              <button class="btn btn-success" onclick="qgNext()"><i class="fas fa-calculator"></i> Generate Quote</button>
            </div>
          </div>

          {/* Step 3 — Quote Results */}
          <div class="qg-step-body" id="qg-step-3" style="display:none">
            <div id="qg-results-body">
              <div class="qg-generating"><i class="fas fa-spinner fa-spin"></i> Generating quote…</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick-Add Deal Modal ── */}
      <div class="add-deal-overlay" id="add-deal-overlay" onclick="closeAddDealModal(event)" style="display:none">
        <div class="add-deal-modal" onclick="event.stopPropagation()">
          <div class="add-deal-header">
            <div><div class="add-deal-title"><i class="fas fa-plus-circle"></i> New Deal</div><div class="add-deal-sub">Add a prospect to the pipeline</div></div>
            <button class="deal-modal-close" onclick="closeAddDealModal()"><i class="fas fa-times"></i></button>
          </div>
          <div class="add-deal-body">
            <div class="add-deal-grid">
              <div class="adg-field">
                <label>Client Name <span class="req">*</span></label>
                <input type="text" id="ad-client" class="form-input" placeholder="Full name" />
              </div>
              <div class="adg-field">
                <label>Product</label>
                <select id="ad-product" class="form-input">
                  <option>Whole Life Insurance</option>
                  <option>Term Life Insurance</option>
                  <option>Universal Life Insurance</option>
                  <option>Variable UL (VUL)</option>
                  <option>Disability Insurance</option>
                  <option>Long-term Care</option>
                  <option>Fixed Annuity</option>
                  <option>Variable Annuity</option>
                  <option>UMA / Investment Account</option>
                </select>
              </div>
              <div class="adg-field">
                <label>Coverage / Amount</label>
                <input type="text" id="ad-amount" class="form-input" placeholder="e.g. $500K or $8,000/yr" />
              </div>
              <div class="adg-field">
                <label>Stage</label>
                <select id="ad-stage" class="form-input">
                  <option>Prospect</option>
                  <option>Quoted</option>
                  <option>Underwriting</option>
                  <option>Approved</option>
                </select>
              </div>
              <div class="adg-field">
                <label>Lead Source</label>
                <select id="ad-source" class="form-input">
                  <option value="referral">Referral</option>
                  <option value="online">Online Inquiry</option>
                  <option value="warm">Warm Lead</option>
                  <option value="cold">Cold Outreach</option>
                  <option value="walkin">Walk-in</option>
                </select>
              </div>
              <div class="adg-field">
                <label>Est. Close Date</label>
                <input type="date" id="ad-close-date" class="form-input" />
              </div>
              <div class="adg-field adg-full">
                <label>Notes</label>
                <textarea id="ad-notes" class="form-input" rows="3" placeholder="Key context, objections, referrer name…"></textarea>
              </div>
            </div>
          </div>
          <div class="add-deal-footer">
            <button class="btn btn-primary" onclick="submitNewDeal()"><i class="fas fa-plus"></i> Add to Pipeline</button>
            <button class="btn btn-outline-sm" onclick="closeAddDealModal()">Cancel</button>
          </div>
        </div>
      </div>

      {/* ── AI Deal Intelligence Modal ── */}
      <div class="deal-ai-modal-overlay" id="deal-ai-modal-overlay" onclick="closeDealAIModal(event)" style="display:none">
        <div class="deal-ai-modal">
          <div class="deal-ai-modal-header" id="dai-header">
            <div class="dai-header-left">
              <div class="dai-win-ring" id="dai-win-ring">
                <svg viewBox="0 0 80 80" class="dai-ring-svg">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="6"/>
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#22c55e" stroke-width="6" id="dai-ring-arc" stroke-dasharray="180 214" stroke-dashoffset="55" stroke-linecap="round" transform="rotate(-90 40 40)"/>
                </svg>
                <span class="dai-ring-val" id="dai-ring-val">95%</span>
              </div>
              <div class="dai-header-info">
                <div class="dai-client-name" id="dai-client-name">Kevin Park</div>
                <div class="dai-product-line" id="dai-product-line">Term Life · $500K</div>
                <div class="dai-stage-badge" id="dai-stage-badge"><i class="fas fa-check-circle"></i> Approved</div>
              </div>
            </div>
            <div class="dai-header-right">
              <div class="dai-kpi-row">
                <div class="dai-kpi"><div class="dai-kpi-val green" id="dai-conv-val">95%</div><div class="dai-kpi-lbl">Close Prob.</div></div>
                <div class="dai-kpi"><div class="dai-kpi-val blue" id="dai-days-val">2d</div><div class="dai-kpi-lbl">Close Window</div></div>
                <div class="dai-kpi"><div class="dai-kpi-val gold" id="dai-comm-val">$216</div><div class="dai-kpi-lbl">Commission</div></div>
                <div class="dai-kpi"><div class="dai-kpi-val purple" id="dai-priority-val">#1</div><div class="dai-kpi-lbl">AI Priority</div></div>
              </div>
            </div>
            <button class="dai-close-btn" onclick="closeDealAIModal()"><i class="fas fa-times"></i></button>
          </div>

          {/* Tabs */}
          <div class="dai-tabs">
            <button class="dai-tab active" id="dai-tab-overview" onclick="switchDaiTab('overview',this)"><i class="fas fa-chart-bar"></i> Win Score</button>
            <button class="dai-tab" id="dai-tab-nba" onclick="switchDaiTab('nba',this)"><i class="fas fa-bolt"></i> Next-Best-Action</button>
            <button class="dai-tab" id="dai-tab-conv" onclick="switchDaiTab('conv',this)"><i class="fas fa-funnel-dollar"></i> Conversion</button>
            <button class="dai-tab" id="dai-tab-timeline" onclick="switchDaiTab('timeline',this)"><i class="fas fa-history"></i> Timeline</button>
            <button class="dai-tab" id="dai-tab-forecast" onclick="switchDaiTab('forecast',this)"><i class="fas fa-crystal-ball"></i> Forecast</button>
          </div>
          <div class="dai-body" id="dai-body"></div>
        </div>
      </div>

      {/* ── Sales AI Report Modal ── */}
      <div class="sales-ai-report-overlay" id="sales-ai-report-overlay" onclick="closeSalesAIReport(event)" style="display:none">
        <div class="sales-ai-report-modal">
          <div class="sair-header">
            <div class="sair-header-left">
              <i class="fas fa-brain sair-icon"></i>
              <div>
                <div class="sair-title">AI Sales Intelligence Report</div>
                <div class="sair-subtitle">Real-time · 9 active deals · Generated Apr 13, 2026 · 91.2% accuracy</div>
              </div>
            </div>
            <button class="sair-close" onclick="closeSalesAIReport()"><i class="fas fa-times"></i></button>
          </div>
          <div class="sair-tabs">
            <button class="sair-tab active" id="sair-tab-overview" onclick="switchSairTab('overview',this)"><i class="fas fa-chart-pie"></i> Overview</button>
            <button class="sair-tab" id="sair-tab-winscores" onclick="switchSairTab('winscores',this)"><i class="fas fa-trophy"></i> Win Scores</button>
            <button class="sair-tab" id="sair-tab-nba" onclick="switchSairTab('nba',this)"><i class="fas fa-bolt"></i> NBA Actions</button>
            <button class="sair-tab" id="sair-tab-forecast" onclick="switchSairTab('forecast',this)"><i class="fas fa-chart-line"></i> Forecast</button>
          </div>
          <div class="sair-body" id="sair-body"></div>
        </div>
      </div>

    </div>
  )
}

function ProductsPage() {
  return (
    <div class="page pi-page">

      {/* ══ HEADER ══ */}
      <div class="pi-header">
        <div class="pi-header-left">
          <div class="pi-header-icon"><i class="fas fa-flask"></i></div>
          <div>
            <h2 class="pi-title">Product Intelligence Hub</h2>
            <p class="pi-sub">Research products · match to client profiles · AI propensity scoring · personalised recommendations</p>
          </div>
        </div>
        <div class="pi-header-actions">
          <button class="btn btn-outline" onclick="runProductPropensity()"><i class="fas fa-robot"></i> Re-run AI Model</button>
          <button class="btn btn-outline" onclick="openQuickQuoteModal()"><i class="fas fa-calculator"></i> Quick Quote</button>
        </div>
      </div>

      {/* ══ SECTION 1 — AI SUMMARY BAR: What to do today ══ */}
      <div class="pi-ai-summary-bar">
        <div class="pi-ai-summary-icon"><i class="fas fa-brain"></i></div>
        <div class="pi-ai-summary-body">
          <span class="pi-ai-summary-label">AI Propensity Model · Last run today 9:00 AM</span>
          <span class="pi-ai-summary-text">
            <strong>3 urgent actions:</strong>
            Patricia Nguyen — UL top-up needed (lapse risk, score 91) ·
            Robert Chen — Deferred Annuity gap (score 96) ·
            Linda Morrison — Fixed Annuity income gap (score 94)
          </span>
        </div>
        <div class="pi-ai-summary-kpis">
          <div class="pi-ai-sum-kpi"><span class="pi-ai-sum-val">8</span><span class="pi-ai-sum-lbl">Recommendations</span></div>
          <div class="pi-ai-sum-kpi hi"><span class="pi-ai-sum-val">3</span><span class="pi-ai-sum-lbl">Urgent</span></div>
          <div class="pi-ai-sum-kpi"><span class="pi-ai-sum-val">91%</span><span class="pi-ai-sum-lbl">Accuracy</span></div>
          <div class="pi-ai-sum-kpi"><span class="pi-ai-sum-val">$4.6M</span><span class="pi-ai-sum-lbl">Pipeline</span></div>
        </div>
      </div>

      {/* ══ MAIN BODY ══ */}
      <div class="pi-body">

        {/* ══ LEFT COLUMN: Products + Propensity Matrix ══ */}
        <div class="pi-left-col">

          {/* BLOCK A — Product Catalogue */}
          <div class="pi-block">
            <div class="pi-block-header">
              <span class="pi-block-title"><i class="fas fa-layer-group"></i> Product Catalogue</span>
              <div class="pi-cat-pills" id="pi-cat-pills">
                <button class="pi-cat-pill active" onclick="filterPIProducts('all',this)">All (13)</button>
                <button class="pi-cat-pill" onclick="filterPIProducts('insurance',this)">Insurance (6)</button>
                <button class="pi-cat-pill" onclick="filterPIProducts('retirement',this)">Retirement (3)</button>
                <button class="pi-cat-pill" onclick="filterPIProducts('investment',this)">Investment (3)</button>
                <button class="pi-cat-pill" onclick="filterPIProducts('wealth',this)">Wealth (1)</button>
              </div>
            </div>
            <div class="pi-product-grid" id="pi-product-list">
              {/* rendered by renderPIProducts() */}
            </div>
          </div>

          {/* BLOCK B — Propensity Matrix */}
          <div class="pi-block">
            <div class="pi-block-header">
              <span class="pi-block-title"><i class="fas fa-th"></i> AI Propensity Matrix</span>
              <span class="pi-block-sub">Client × Product fit scores — green = strong match, yellow = moderate, red = poor</span>
            </div>
            <div class="pi-matrix-scroll" id="pi-matrix-wrap">
              {/* rendered by renderPIMatrix() */}
            </div>
            <div class="pi-matrix-legend">
              <span class="pi-leg pi-leg-hot">≥85 Strong</span>
              <span class="pi-leg pi-leg-med">70–84 Moderate</span>
              <span class="pi-leg pi-leg-low">50–69 Possible</span>
              <span class="pi-leg pi-leg-none">&lt;50 Poor</span>
            </div>
          </div>

        </div>

        {/* ══ RIGHT COLUMN: AI Recommendations + Detail Panel ══ */}
        <div class="pi-right-col">

          {/* BLOCK C — AI Recommendations */}
          <div class="pi-block">
            <div class="pi-block-header">
              <span class="pi-block-title"><i class="fas fa-robot"></i> AI Recommendations</span>
              <div class="pi-rec-sort-wrap">
                <span class="pi-sort-lbl">Sort:</span>
                <select class="pi-rec-sort" onchange="sortPIRecs(this.value)">
                  <option value="score">By AI Score</option>
                  <option value="value">By Value</option>
                  <option value="segment">By Segment</option>
                </select>
              </div>
            </div>
            <p class="pi-block-desc">Each card shows a client–product match identified by AI. Click any card to see the full suitability analysis and next action.</p>
            <div class="pi-rec-list" id="pi-rec-list">
              {/* rendered by renderPIRecs() */}
            </div>
          </div>

          {/* BLOCK D — Detail / Suitability Panel */}
          <div class="pi-block pi-detail-block" id="pi-detail-block">
            <div class="pi-detail-empty" id="pi-detail-empty">
              <i class="fas fa-hand-pointer"></i>
              <strong>Select a recommendation or product</strong>
              <p>You'll see the full AI suitability analysis, matched client list, key product features, and recommended next action.</p>
            </div>
            <div id="pi-detail-panel" style="display:none">
              {/* rendered dynamically */}
            </div>
          </div>

        </div>

      </div>

      {/* Quick Quote Modal */}
      <div id="quick-quote-modal" style="display:none" onclick="closeQuickQuoteModal(event)">
        <div class="qq-modal">
          <div class="qq-header">
            <span><i class="fas fa-calculator"></i> Quick Quote</span>
            <button onclick="closeQuickQuoteModal()" class="qq-close">✕</button>
          </div>
          <div class="qq-body" id="qq-body">
            <div style="padding:20px;color:#64748b;text-align:center">
              <i class="fas fa-circle-notch fa-spin" style="font-size:24px;margin-bottom:10px"></i><br/>
              Loading quick quote tool…
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}


function ReportsPage() {
  return (
    <div class="page reports-page">

      {/* ── Page Header ── */}
      <div class="rpt-page-header">
        <div class="rpt-page-header-left">
          <h2><i class="fas fa-chart-bar"></i> Reports &amp; Analytics</h2>
          <p>Full-book performance · AI-powered insights · Multi-domain scorecard · Commission tracking</p>
        </div>
        <div class="rpt-page-header-right">
          <button class="btn btn-outline" onclick="exportReportPDF()"><i class="fas fa-download"></i> Export</button>
          <button class="btn btn-outline" onclick="shareReportWithManager()"><i class="fas fa-share-alt"></i> Share</button>
          <button class="btn btn-outline" onclick="scheduleReport()"><i class="fas fa-clock"></i> Schedule</button>
          <button class="btn btn-ai" onclick="openAIReportSummary()"><i class="fas fa-robot"></i> AI Summary</button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div class="rpt-kpi-strip">
        <div class="rpt-kpi-card" onclick="openReportDrillDown('insurance')" style="cursor:pointer">
          <div class="rpt-kpi-icon blue"><i class="fas fa-dollar-sign"></i></div>
          <div class="rpt-kpi-body">
            <div class="rpt-kpi-val">$487K</div>
            <div class="rpt-kpi-lbl">Monthly Revenue</div>
            <div class="rpt-kpi-delta up"><i class="fas fa-arrow-up"></i> +12% MoM</div>
          </div>
        </div>
        <div class="rpt-kpi-card" onclick="openReportDrillDown('insurance')" style="cursor:pointer">
          <div class="rpt-kpi-icon emerald"><i class="fas fa-layer-group"></i></div>
          <div class="rpt-kpi-body">
            <div class="rpt-kpi-val">$8.1M</div>
            <div class="rpt-kpi-lbl">Total AUM + Premiums</div>
            <div class="rpt-kpi-delta up"><i class="fas fa-arrow-up"></i> +8% QoQ</div>
          </div>
        </div>
        <div class="rpt-kpi-card">
          <div class="rpt-kpi-icon amber"><i class="fas fa-trophy"></i></div>
          <div class="rpt-kpi-body">
            <div class="rpt-kpi-val">78%</div>
            <div class="rpt-kpi-lbl">Commission vs Target</div>
            <div class="rpt-kpi-delta up">$187K / $240K</div>
          </div>
        </div>
        <div class="rpt-kpi-card">
          <div class="rpt-kpi-icon purple"><i class="fas fa-users"></i></div>
          <div class="rpt-kpi-body">
            <div class="rpt-kpi-val">247</div>
            <div class="rpt-kpi-lbl">Total Clients</div>
            <div class="rpt-kpi-delta up"><i class="fas fa-arrow-up"></i> +8 this month</div>
          </div>
        </div>
        <div class="rpt-kpi-card">
          <div class="rpt-kpi-icon teal"><i class="fas fa-star"></i></div>
          <div class="rpt-kpi-body">
            <div class="rpt-kpi-val">94%</div>
            <div class="rpt-kpi-lbl">Client Satisfaction</div>
            <div class="rpt-kpi-delta up"><i class="fas fa-arrow-up"></i> +2% QoQ</div>
          </div>
        </div>
        <div class="rpt-kpi-card">
          <div class="rpt-kpi-icon red"><i class="fas fa-robot"></i></div>
          <div class="rpt-kpi-body">
            <div class="rpt-kpi-val">87/100</div>
            <div class="rpt-kpi-lbl">AI Score</div>
            <div class="rpt-kpi-delta up"><i class="fas fa-arrow-up"></i> +12 pts vs Q4</div>
          </div>
        </div>
      </div>

      {/* ── AI Insight Banner ── */}
      <div class="rpt-ai-banner">
        <div class="rpt-ai-banner-left">
          <div class="rpt-ai-banner-icon"><i class="fas fa-brain"></i><span class="rpt-ai-live">LIVE</span></div>
          <div class="rpt-ai-banner-text">
            <div class="rpt-ai-banner-title">AI Report Intelligence — April 2026</div>
            <div class="rpt-ai-banner-sub">Your book is on track at <strong>78% of annual target</strong>. Advisory growing fastest at +31%. Top action: cross-sell investments to 62 single-product Insurance clients — estimated <strong>+$18K/yr</strong> opportunity.</div>
          </div>
        </div>
        <div class="rpt-ai-banner-actions">
          <button class="rpt-ai-banner-btn" onclick="openAIReportSummary()"><i class="fas fa-file-alt"></i> Full AI Summary</button>
          <button class="rpt-ai-banner-dismiss" onclick="this.closest('.rpt-ai-banner').style.display='none'" title="Dismiss"><i class="fas fa-times"></i></button>
        </div>
      </div>

      {/* ── Domain KPI Cards ── */}
      <div class="report-domain-kpis">
        <div class="rdkpi-card ins-theme" onclick="openReportDrillDown('insurance')" style="cursor:pointer" title="View Insurance detail">
          <div class="rdkpi-icon"><i class="fas fa-shield-alt"></i></div>
          <div class="rdkpi-body">
            <div class="rdkpi-label">Insurance Revenue</div>
            <div class="rdkpi-val">$312K</div>
            <div class="rdkpi-sub">YTD · $1.87M / $2.16M target <span class="rdkpi-delta up">+9%</span></div>
          </div>
          <div class="rdkpi-drill-hint"><i class="fas fa-chevron-right"></i></div>
        </div>
        <div class="rdkpi-card inv-theme" onclick="openReportDrillDown('investments')" style="cursor:pointer" title="View Investments detail">
          <div class="rdkpi-icon"><i class="fas fa-chart-line"></i></div>
          <div class="rdkpi-body">
            <div class="rdkpi-label">Investment AUM</div>
            <div class="rdkpi-val">$4.2M</div>
            <div class="rdkpi-sub">62 clients · Avg $67.7K <span class="rdkpi-delta up">+14%</span></div>
          </div>
          <div class="rdkpi-drill-hint"><i class="fas fa-chevron-right"></i></div>
        </div>
        <div class="rdkpi-card ret-theme" onclick="openReportDrillDown('retirement')" style="cursor:pointer" title="View Retirement detail">
          <div class="rdkpi-icon"><i class="fas fa-umbrella-beach"></i></div>
          <div class="rdkpi-body">
            <div class="rdkpi-label">Retirement Annuity Premium</div>
            <div class="rdkpi-val">$89K</div>
            <div class="rdkpi-sub">38 clients · Deferred + Immediate <span class="rdkpi-delta up">+22%</span></div>
          </div>
          <div class="rdkpi-drill-hint"><i class="fas fa-chevron-right"></i></div>
        </div>
        <div class="rdkpi-card adv-theme" onclick="openReportDrillDown('advisory')" style="cursor:pointer" title="View Advisory detail">
          <div class="rdkpi-icon"><i class="fas fa-handshake"></i></div>
          <div class="rdkpi-body">
            <div class="rdkpi-label">Advisory Revenue</div>
            <div class="rdkpi-val">$86K</div>
            <div class="rdkpi-sub">59 clients · Estate + WM + Biz <span class="rdkpi-delta up">+31%</span></div>
          </div>
          <div class="rdkpi-drill-hint"><i class="fas fa-chevron-right"></i></div>
        </div>
      </div>

      {/* ── Report Toolbar ── */}
      <div class="rpt-toolbar">
        <div class="rpt-toolbar-left">
          <div class="rpt-period-group">
            <button class="rpt-period-btn active" id="rptbtn-6M" onclick="setReportPeriod('6M',this)">6M</button>
            <button class="rpt-period-btn" id="rptbtn-12M" onclick="setReportPeriod('12M',this)">12M</button>
            <button class="rpt-period-btn" id="rptbtn-All" onclick="setReportPeriod('All',this)">All Time</button>
          </div>
          <select class="filter-select rpt-domain-filter" id="rpt-domain-filter" onchange="filterReportByDomain(this.value)">
            <option value="">All Domains</option>
            <option value="ins">Insurance</option>
            <option value="inv">Investments</option>
            <option value="ret">Retirement</option>
            <option value="adv">Advisory</option>
          </select>
        </div>
        <div class="rpt-toolbar-right">
          <span class="rpt-last-updated"><i class="fas fa-sync-alt"></i> Updated: Apr 15, 2026 · 7:02 AM</span>
        </div>
      </div>

      {/* ── Main Charts Row ── */}
      <div class="reports-grid">

        {/* Revenue trend — main wide chart */}
        <div class="report-card main-chart">
          <div class="card-header">
            <h3 id="rpt-rev-heading"><i class="fas fa-chart-area"></i> Revenue by Domain — Jan–Jun 2026</h3>
            <div class="card-actions">
              <button class="rpt-chart-tab active" id="rct-bar" onclick="switchRevenueChartType('bar',this)"><i class="fas fa-chart-bar"></i></button>
              <button class="rpt-chart-tab" id="rct-line" onclick="switchRevenueChartType('line',this)"><i class="fas fa-chart-line"></i></button>
            </div>
          </div>
          <div class="report-chart-wrap" style="position:relative;height:260px">
            <canvas id="reportRevenueChart"></canvas>
          </div>
          <div class="rpt-rev-legend">
            <span><span class="rcl-dot" style="background:#003087"></span> Insurance</span>
            <span><span class="rcl-dot" style="background:#059669"></span> Investments</span>
            <span><span class="rcl-dot" style="background:#d97706"></span> Retirement</span>
            <span><span class="rcl-dot" style="background:#7c3aed"></span> Advisory</span>
          </div>
        </div>

        {/* Book Mix donut */}
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

        {/* Client Segments */}
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

        {/* ── Commission Tracker Card ── */}
        <div class="report-card rpt-commission-card">
          <div class="card-header">
            <h3><i class="fas fa-wallet"></i> Commission Tracker — YTD 2026</h3>
            <span class="rpt-badge-teal">78% of target</span>
          </div>
          <div class="rpt-comm-gauge-row">
            <div class="rpt-comm-total">
              <div class="rpt-comm-earned">$187K</div>
              <div class="rpt-comm-label">Earned YTD</div>
            </div>
            <div class="rpt-comm-gauge-wrap">
              <div class="rpt-comm-bar-track">
                <div class="rpt-comm-bar-fill" style="width:78%"></div>
                <div class="rpt-comm-bar-marker" style="left:78%"><span>78%</span></div>
              </div>
              <div class="rpt-comm-targets">
                <span>$0</span><span>Target: $240K</span>
              </div>
            </div>
          </div>
          <div class="rpt-comm-breakdown">
            <div class="rpt-comm-row">
              <span class="rpt-comm-domain"><i class="fas fa-circle" style="color:#003087"></i> Insurance</span>
              <div class="rpt-comm-bar-mini-track"><div class="rpt-comm-bar-mini" style="width:55%;background:#003087"></div></div>
              <span class="rpt-comm-amt">$103K</span>
              <span class="rpt-comm-pct">55%</span>
            </div>
            <div class="rpt-comm-row">
              <span class="rpt-comm-domain"><i class="fas fa-circle" style="color:#059669"></i> Investments</span>
              <div class="rpt-comm-bar-mini-track"><div class="rpt-comm-bar-mini" style="width:28%;background:#059669"></div></div>
              <span class="rpt-comm-amt">$52K</span>
              <span class="rpt-comm-pct">28%</span>
            </div>
            <div class="rpt-comm-row">
              <span class="rpt-comm-domain"><i class="fas fa-circle" style="color:#d97706"></i> Retirement</span>
              <div class="rpt-comm-bar-mini-track"><div class="rpt-comm-bar-mini" style="width:10%;background:#d97706"></div></div>
              <span class="rpt-comm-amt">$19K</span>
              <span class="rpt-comm-pct">10%</span>
            </div>
            <div class="rpt-comm-row">
              <span class="rpt-comm-domain"><i class="fas fa-circle" style="color:#7c3aed"></i> Advisory</span>
              <div class="rpt-comm-bar-mini-track"><div class="rpt-comm-bar-mini" style="width:7%;background:#7c3aed"></div></div>
              <span class="rpt-comm-amt">$13K</span>
              <span class="rpt-comm-pct">7%</span>
            </div>
          </div>
          <div class="rpt-comm-pending"><i class="fas fa-hourglass-half"></i> <strong>$8,400</strong> pending in underwriting · est. Apr 20</div>
        </div>

        {/* ── Goal Progress Card ── */}
        <div class="report-card rpt-goals-card">
          <div class="card-header">
            <h3><i class="fas fa-bullseye"></i> Annual Goals Progress</h3>
            <span class="rpt-badge-blue">2026 YTD</span>
          </div>
          <div class="rpt-goals-list">
            <div class="rpt-goal-item">
              <div class="rpt-goal-meta">
                <span class="rpt-goal-name"><i class="fas fa-shield-alt" style="color:#003087"></i> Insurance Premium</span>
                <span class="rpt-goal-val">87% <span class="rpt-goal-target">of $2.16M</span></span>
              </div>
              <div class="rpt-goal-bar-outer"><div class="rpt-goal-bar-inner ins-fill" style="width:87%"></div></div>
              <div class="rpt-goal-footer"><span class="rpt-goal-earned">$1.87M earned</span><span class="rpt-goal-delta up">+9% vs plan</span></div>
            </div>
            <div class="rpt-goal-item">
              <div class="rpt-goal-meta">
                <span class="rpt-goal-name"><i class="fas fa-chart-line" style="color:#059669"></i> Investment AUM</span>
                <span class="rpt-goal-val">84% <span class="rpt-goal-target">of $5M</span></span>
              </div>
              <div class="rpt-goal-bar-outer"><div class="rpt-goal-bar-inner inv-fill" style="width:84%"></div></div>
              <div class="rpt-goal-footer"><span class="rpt-goal-earned">$4.2M AUM</span><span class="rpt-goal-delta up">+14% vs plan</span></div>
            </div>
            <div class="rpt-goal-item">
              <div class="rpt-goal-meta">
                <span class="rpt-goal-name"><i class="fas fa-umbrella-beach" style="color:#d97706"></i> Retirement Premium</span>
                <span class="rpt-goal-val">84% <span class="rpt-goal-target">of $106K</span></span>
              </div>
              <div class="rpt-goal-bar-outer"><div class="rpt-goal-bar-inner ret-fill" style="width:84%"></div></div>
              <div class="rpt-goal-footer"><span class="rpt-goal-earned">$89K earned</span><span class="rpt-goal-delta up">+22% vs plan</span></div>
            </div>
            <div class="rpt-goal-item">
              <div class="rpt-goal-meta">
                <span class="rpt-goal-name"><i class="fas fa-handshake" style="color:#7c3aed"></i> Advisory Revenue</span>
                <span class="rpt-goal-val">74% <span class="rpt-goal-target">of $116K</span></span>
              </div>
              <div class="rpt-goal-bar-outer"><div class="rpt-goal-bar-inner adv-fill" style="width:74%"></div></div>
              <div class="rpt-goal-footer"><span class="rpt-goal-earned">$86K earned</span><span class="rpt-goal-delta up">+31% vs plan</span></div>
            </div>
            <div class="rpt-goal-item">
              <div class="rpt-goal-meta">
                <span class="rpt-goal-name"><i class="fas fa-users" style="color:#0891b2"></i> New Clients</span>
                <span class="rpt-goal-val">83% <span class="rpt-goal-target">of 30 target</span></span>
              </div>
              <div class="rpt-goal-bar-outer"><div class="rpt-goal-bar-inner teal-fill" style="width:83%"></div></div>
              <div class="rpt-goal-footer"><span class="rpt-goal-earned">25 added YTD</span><span class="rpt-goal-delta up">+18% vs last yr</span></div>
            </div>
          </div>
        </div>

        {/* ── Holistic Performance Scorecard ── */}
        <div class="report-card wide-card">
          <div class="card-header">
            <h3><i class="fas fa-trophy"></i> Holistic Performance Scorecard — All Domains</h3>
            <button class="btn-link" onclick="openAIReportSummary()">AI Analysis →</button>
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
                  <div class="score-pct">89% <span class="score-delta neutral">stable</span></div>
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
                <div class="score-item">
                  <div class="score-label">Annuity Premium / Target</div>
                  <div class="score-bar-outer"><div class="score-bar-inner" style="width:84%;background:#d97706"></div></div>
                  <div class="score-pct">84% <span class="score-delta up">+6%</span></div>
                </div>
                <div class="score-item">
                  <div class="score-label">IRA Rollovers Captured</div>
                  <div class="score-bar-outer"><div class="score-bar-inner" style="width:62%;background:#d97706"></div></div>
                  <div class="score-pct">62% <span class="score-delta up">+12%</span></div>
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
                <div class="score-item">
                  <div class="score-label">UMA Accounts Opened</div>
                  <div class="score-bar-outer"><div class="score-bar-inner" style="width:65%;background:#7c3aed"></div></div>
                  <div class="score-pct">65% <span class="score-delta up">+20%</span></div>
                </div>
                <div class="score-item">
                  <div class="score-label">Business Succession Plans</div>
                  <div class="score-bar-outer"><div class="score-bar-inner" style="width:50%;background:#7c3aed"></div></div>
                  <div class="score-pct">50% <span class="score-delta up">+8%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Cross-Domain + AI Metrics ── */}
        <div class="report-card wide-card">
          <div class="card-header">
            <h3><i class="fas fa-layer-group"></i> Cross-Domain &amp; AI Performance Metrics</h3>
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
            <div class="score-item">
              <div class="score-label">Underwriting STP Rate</div>
              <div class="score-bar-outer"><div class="score-bar-inner" style="width:82%;background:#0891b2"></div></div>
              <div class="score-pct">82% <span class="score-delta up">+18%</span></div>
            </div>
            <div class="score-item">
              <div class="score-label">AI Decision Accuracy</div>
              <div class="score-bar-outer"><div class="score-bar-inner green" style="width:95%"></div></div>
              <div class="score-pct">94.6% <span class="score-delta up">+3%</span></div>
            </div>
            <div class="score-item">
              <div class="score-label">Meeting Prep Coverage</div>
              <div class="score-bar-outer"><div class="score-bar-inner" style="width:87%;background:#7c3aed"></div></div>
              <div class="score-pct">87% <span class="score-delta up">AI-prepared</span></div>
            </div>
          </div>
        </div>

        {/* ── Top AI Opportunities Table ── */}
        <div class="report-card wide-card">
          <div class="card-header">
            <h3><i class="fas fa-bolt"></i> Top AI-Identified Revenue Opportunities</h3>
            <span class="rpt-badge-purple">$35.2K potential</span>
          </div>
          <div class="rpt-opp-table-wrap">
            <table class="rpt-opp-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Opportunity</th>
                  <th>Domain</th>
                  <th>Est. Value</th>
                  <th>Confidence</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr class="rpt-opp-row" onclick="openReportDrillDown('investments')">
                  <td><div class="rpt-opp-client"><div class="rpt-opp-avatar" style="background:#f0fdf4;color:#059669">PG</div>Patricia Nguyen</div></td>
                  <td>Deferred Annuity Conversion</td>
                  <td><span class="act-domain-pill inv">Investments</span></td>
                  <td class="rpt-opp-val">$3K/yr</td>
                  <td><div class="rpt-conf-bar"><div class="rpt-conf-fill" style="width:91%;background:#059669"></div></div><span class="rpt-conf-pct">91%</span></td>
                  <td><span class="rpt-status-pill urgent">Urgent</span></td>
                  <td><button class="rpt-act-btn" onclick="event.stopPropagation();navigateTo('clients')"><i class="fas fa-arrow-right"></i></button></td>
                </tr>
                <tr class="rpt-opp-row" onclick="openReportDrillDown('retirement')">
                  <td><div class="rpt-opp-client"><div class="rpt-opp-avatar" style="background:#fffbeb;color:#d97706">JW</div>James Whitfield</div></td>
                  <td>Income Annuity at Retirement</td>
                  <td><span class="act-domain-pill ret">Retirement</span></td>
                  <td class="rpt-opp-val">$12K/yr</td>
                  <td><div class="rpt-conf-bar"><div class="rpt-conf-fill" style="width:85%;background:#d97706"></div></div><span class="rpt-conf-pct">85%</span></td>
                  <td><span class="rpt-status-pill high">High</span></td>
                  <td><button class="rpt-act-btn" onclick="event.stopPropagation();navigateTo('clients')"><i class="fas fa-arrow-right"></i></button></td>
                </tr>
                <tr class="rpt-opp-row" onclick="openReportDrillDown('advisory')">
                  <td><div class="rpt-opp-client"><div class="rpt-opp-avatar" style="background:#faf5ff;color:#7c3aed">LM</div>Linda Morrison</div></td>
                  <td>UMA Account — $500K+ assets</td>
                  <td><span class="act-domain-pill adv">Advisory</span></td>
                  <td class="rpt-opp-val">$5K/yr</td>
                  <td><div class="rpt-conf-bar"><div class="rpt-conf-fill" style="width:88%;background:#7c3aed"></div></div><span class="rpt-conf-pct">88%</span></td>
                  <td><span class="rpt-status-pill high">High</span></td>
                  <td><button class="rpt-act-btn" onclick="event.stopPropagation();navigateTo('clients')"><i class="fas fa-arrow-right"></i></button></td>
                </tr>
                <tr class="rpt-opp-row" onclick="openReportDrillDown('advisory')">
                  <td><div class="rpt-opp-client"><div class="rpt-opp-avatar" style="background:#eff6ff;color:#003087">RC</div>Robert Chen</div></td>
                  <td>Business Succession + NQDC</td>
                  <td><span class="act-domain-pill adv">Advisory</span></td>
                  <td class="rpt-opp-val">$8K/yr</td>
                  <td><div class="rpt-conf-bar"><div class="rpt-conf-fill" style="width:79%;background:#7c3aed"></div></div><span class="rpt-conf-pct">79%</span></td>
                  <td><span class="rpt-status-pill med">Medium</span></td>
                  <td><button class="rpt-act-btn" onclick="event.stopPropagation();navigateTo('clients')"><i class="fas fa-arrow-right"></i></button></td>
                </tr>
                <tr class="rpt-opp-row" onclick="openReportDrillDown('investments')">
                  <td><div class="rpt-opp-client"><div class="rpt-opp-avatar" style="background:#f0fdf4;color:#059669">AR</div>Alex Rivera</div></td>
                  <td>401(k) Rollover — $85K prior plan</td>
                  <td><span class="act-domain-pill ret">Retirement</span></td>
                  <td class="rpt-opp-val">$4K/yr</td>
                  <td><div class="rpt-conf-bar"><div class="rpt-conf-fill" style="width:74%;background:#d97706"></div></div><span class="rpt-conf-pct">74%</span></td>
                  <td><span class="rpt-status-pill med">Medium</span></td>
                  <td><button class="rpt-act-btn" onclick="event.stopPropagation();navigateTo('clients')"><i class="fas fa-arrow-right"></i></button></td>
                </tr>
                <tr class="rpt-opp-row" onclick="openReportDrillDown('insurance')">
                  <td><div class="rpt-opp-client"><div class="rpt-opp-avatar" style="background:#eff6ff;color:#003087">DT</div>David Thompson</div></td>
                  <td>Disability Insurance — no coverage</td>
                  <td><span class="act-domain-pill ins">Insurance</span></td>
                  <td class="rpt-opp-val">$2K/yr</td>
                  <td><div class="rpt-conf-bar"><div class="rpt-conf-fill" style="width:82%;background:#003087"></div></div><span class="rpt-conf-pct">82%</span></td>
                  <td><span class="rpt-status-pill med">Medium</span></td>
                  <td><button class="rpt-act-btn" onclick="event.stopPropagation();navigateTo('clients')"><i class="fas fa-arrow-right"></i></button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="rpt-opp-footer">
            <span><i class="fas fa-robot" style="color:#7c3aed"></i> AI-identified · Updated daily · 7 total opportunities · <strong>$35.2K</strong> combined potential</span>
            <button class="btn btn-ai" style="font-size:11px;padding:6px 12px" onclick="sendContextMessage('Show me all cross-sell and upsell opportunities across my 247 clients ranked by revenue potential and close probability','advisor')"><i class="fas fa-robot"></i> Full AI Opportunity Analysis</button>
          </div>
        </div>

      </div>

      {/* ── Action Bar ── */}
      <div class="rpt-action-bar">
        <div class="rpt-action-bar-left">
          <span class="rpt-action-info"><i class="fas fa-info-circle"></i> YTD 2026 · 247 clients · All 4 domains · Last updated Apr 15, 2026</span>
        </div>
        <div class="rpt-action-bar-right">
          <button class="btn btn-primary" onclick="exportReportPDF()"><i class="fas fa-download"></i> Export Full Report</button>
          <button class="btn btn-outline" onclick="shareReportWithManager()"><i class="fas fa-share-alt"></i> Share with Manager</button>
          <button class="btn btn-ai" onclick="openAIReportSummary()"><i class="fas fa-robot"></i> AI Report Summary</button>
          <button class="btn btn-outline" onclick="scheduleReport()"><i class="fas fa-calendar-alt"></i> Schedule</button>
        </div>
      </div>

    </div>
  )
}

function CalendarPage() {
  return (
    <div class="page calendar-page">

      {/* ── Page Header ── */}
      <div class="cal-page-header">
        <div class="cal-page-header-left">
          <h2><i class="fas fa-calendar-alt"></i> Calendar &amp; Schedule</h2>
          <p>AI-prepared meetings · Smart scheduling · Full activity history</p>
        </div>
        <div class="cal-page-header-right">
          <button class="btn btn-outline" onclick="switchCalView('week')" id="cal-view-week"><i class="fas fa-bars"></i> Week</button>
          <button class="btn btn-outline" onclick="switchCalView('agenda')" id="cal-view-agenda"><i class="fas fa-list"></i> Agenda</button>
          <button class="btn btn-outline" onclick="switchCalView('month')" id="cal-view-month" style="background:#003087;color:white;border-color:#003087"><i class="fas fa-calendar"></i> Month</button>
          <button class="btn btn-primary" onclick="openAddEventModal()"><i class="fas fa-plus"></i> Add Event</button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div class="cal-kpi-strip">
        <div class="cal-kpi-card">
          <div class="cal-kpi-icon blue"><i class="fas fa-calendar-check"></i></div>
          <div class="cal-kpi-body">
            <div class="cal-kpi-val">11</div>
            <div class="cal-kpi-lbl">Meetings This Month</div>
            <div class="cal-kpi-delta green"><i class="fas fa-arrow-up"></i> +3 vs last month</div>
          </div>
        </div>
        <div class="cal-kpi-card">
          <div class="cal-kpi-icon red"><i class="fas fa-bolt"></i></div>
          <div class="cal-kpi-body">
            <div class="cal-kpi-val">2</div>
            <div class="cal-kpi-lbl">Today's Meetings</div>
            <div class="cal-kpi-delta orange">Next: 2:00 PM</div>
          </div>
        </div>
        <div class="cal-kpi-card">
          <div class="cal-kpi-icon amber"><i class="fas fa-clock"></i></div>
          <div class="cal-kpi-body">
            <div class="cal-kpi-val">4</div>
            <div class="cal-kpi-lbl">Follow-ups Due</div>
            <div class="cal-kpi-delta orange">2 overdue</div>
          </div>
        </div>
        <div class="cal-kpi-card">
          <div class="cal-kpi-icon emerald"><i class="fas fa-robot"></i></div>
          <div class="cal-kpi-body">
            <div class="cal-kpi-val">8</div>
            <div class="cal-kpi-lbl">AI Briefs Ready</div>
            <div class="cal-kpi-delta green">All upcoming prepped</div>
          </div>
        </div>
        <div class="cal-kpi-card">
          <div class="cal-kpi-icon purple"><i class="fas fa-handshake"></i></div>
          <div class="cal-kpi-body">
            <div class="cal-kpi-val">87%</div>
            <div class="cal-kpi-lbl">Meeting Prep Score</div>
            <div class="cal-kpi-delta green">Above target</div>
          </div>
        </div>
        <div class="cal-kpi-card">
          <div class="cal-kpi-icon teal"><i class="fas fa-check-circle"></i></div>
          <div class="cal-kpi-body">
            <div class="cal-kpi-val">3</div>
            <div class="cal-kpi-lbl">Completed This Week</div>
            <div class="cal-kpi-delta green">100% with notes</div>
          </div>
        </div>
      </div>

      {/* ── AI Schedule Optimizer Panel ── */}
      <div class="cal-ai-optimizer">
        <div class="cal-ai-opt-header">
          <div class="cal-ai-opt-title">
            <i class="fas fa-brain"></i> AI Schedule Intelligence
            <span class="cal-ai-live-badge">LIVE</span>
          </div>
          <div class="cal-ai-opt-sub">Analysing your week · Priority-ranked preparation · Conflict detection · Optimal scheduling</div>
          <button class="cal-ai-opt-refresh" onclick="refreshCalAI()"><i class="fas fa-sync-alt"></i> Refresh</button>
        </div>

        {/* ── Feature Tabs ── */}
        <div class="cal-ai-tabs">
          <button class="cal-ai-tab active" id="tab-ai-insights" onclick="switchCalAITab('insights')"><i class="fas fa-lightbulb"></i> Insights</button>
          <button class="cal-ai-tab" id="tab-ai-annual" onclick="switchCalAITab('annual')"><i class="fas fa-calendar-check"></i> Annual Review</button>
          <button class="cal-ai-tab" id="tab-ai-life-events" onclick="switchCalAITab('life-events')"><i class="fas fa-heartbeat"></i> Life Events</button>
          <button class="cal-ai-tab" id="tab-ai-ltc" onclick="switchCalAITab('ltc')"><i class="fas fa-hand-holding-medical"></i> LTC &amp; Medicare</button>
          <button class="cal-ai-tab" id="tab-ai-drift" onclick="switchCalAITab('drift')"><i class="fas fa-chart-line"></i> Portfolio Drift</button>
        </div>

        {/* ── Tab: Insights (default) ── */}
        <div class="cal-ai-tab-panel" id="cal-ai-panel-insights">
          <div class="cal-ai-insights">
            <div class="cal-ai-insight priority-urgent">
              <div class="cai-icon"><i class="fas fa-exclamation-triangle"></i></div>
              <div class="cai-body">
                <div class="cai-title">Kevin Park call today — application 14 days stale</div>
                <div class="cai-detail">Pending application (Whole Life $500K) has been in review for 14 days. Client flagged as at-risk. Prepare: application status, next steps, objection-handling notes.</div>
              </div>
              <div class="cai-action">
                <span class="cai-priority red">Urgent</span>
                <button class="cai-btn" onclick="openMeetingBrief('MTG-001')">Brief <i class="fas fa-arrow-right"></i></button>
              </div>
            </div>
            <div class="cal-ai-insight priority-high">
              <div class="cai-icon"><i class="fas fa-gem"></i></div>
              <div class="cai-body">
                <div class="cai-title">Linda Morrison Apr 15 — highest-value meeting this month</div>
                <div class="cai-detail">Annual review: $2M WL policy + UMA opportunity ($500K investable assets) + estate plan trigger. 90-min meeting — AI brief prepared with 6 talking points.</div>
              </div>
              <div class="cai-action">
                <span class="cai-priority amber">High</span>
                <button class="cai-btn" onclick="openMeetingBrief('MTG-004')">Brief <i class="fas fa-arrow-right"></i></button>
              </div>
            </div>
            <div class="cal-ai-insight priority-normal">
              <div class="cai-icon"><i class="fas fa-calendar-plus"></i></div>
              <div class="cai-body">
                <div class="cai-title">Schedule gap — Apr 19–21 free (3 business days)</div>
                <div class="cai-detail">Ideal window for: Nancy Foster DI follow-up · David Thompson term review · Patricia Nguyen UL premium catch-up. AI suggests scheduling before month-end.</div>
              </div>
              <div class="cai-action">
                <span class="cai-priority blue">Opportunity</span>
                <button class="cai-btn" onclick="openAddEventModal()">Schedule <i class="fas fa-arrow-right"></i></button>
              </div>
            </div>
            <div class="cal-ai-insight priority-normal">
              <div class="cai-icon"><i class="fas fa-sync-alt"></i></div>
              <div class="cai-body">
                <div class="cai-title">Sandra Williams renewal Apr 28 — renewal package ready</div>
                <div class="cai-detail">P-100320 auto-renewal in 153 days. Prepare renewal quote, coverage review checklist, and upgrade options (LTC rider availability at age 52).</div>
              </div>
              <div class="cai-action">
                <span class="cai-priority teal">Renewal</span>
                <button class="cai-btn" onclick="openMeetingBrief('MTG-008')">Brief <i class="fas fa-arrow-right"></i></button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab: Annual Review Scheduler & AI Prep ── */}
        <div class="cal-ai-tab-panel" id="cal-ai-panel-annual" style="display:none">
          <div class="cal-ai-feature-header">
            <div class="cal-ai-feat-title"><i class="fas fa-calendar-check"></i> Annual Review Scheduler &amp; AI Prep</div>
            <div class="cal-ai-feat-sub">AI auto-identifies clients due for review, generates agendas, coverage-gap analysis, and talking points</div>
            <div class="cal-ai-feat-stats">
              <span class="feat-stat-pill green"><i class="fas fa-check-circle"></i> 3 Scheduled</span>
              <span class="feat-stat-pill amber"><i class="fas fa-clock"></i> 7 Due This Month</span>
              <span class="feat-stat-pill red"><i class="fas fa-exclamation-circle"></i> 2 Overdue</span>
              <span class="feat-stat-pill blue"><i class="fas fa-robot"></i> AI Briefs Ready: 5</span>
            </div>
          </div>
          <div class="cal-ai-ar-list">
            <div class="cal-ar-row priority-urgent">
              <div class="cal-ar-client">
                <div class="cal-ar-avatar">LM</div>
                <div class="cal-ar-info">
                  <div class="cal-ar-name">Linda Morrison</div>
                  <div class="cal-ar-meta">Last review: Apr 2025 · <span class="overdue-tag">371 days ago</span></div>
                </div>
              </div>
              <div class="cal-ar-policies">
                <span class="ar-policy-tag">WL $2M</span>
                <span class="ar-policy-tag">UMA $500K</span>
                <span class="ar-policy-tag">Estate Plan</span>
              </div>
              <div class="cal-ar-ai-score">
                <div class="ar-score-label">AI Priority</div>
                <div class="ar-score-bar"><div class="ar-score-fill" style="width:96%"></div></div>
                <div class="ar-score-val">96</div>
              </div>
              <div class="cal-ar-actions">
                <span class="ar-status-badge scheduled">Apr 15</span>
                <button class="cai-btn" onclick="openAnnualReviewBrief('LM')">AI Brief <i class="fas fa-robot"></i></button>
              </div>
            </div>
            <div class="cal-ar-row priority-high">
              <div class="cal-ar-client">
                <div class="cal-ar-avatar">JW</div>
                <div class="cal-ar-info">
                  <div class="cal-ar-name">James Whitfield</div>
                  <div class="cal-ar-meta">Last review: Mar 2025 · <span class="overdue-tag">400 days ago</span></div>
                </div>
              </div>
              <div class="cal-ar-policies">
                <span class="ar-policy-tag">Term $750K</span>
                <span class="ar-policy-tag">Annuity $430K</span>
                <span class="ar-policy-tag">IRA Gap</span>
              </div>
              <div class="cal-ar-ai-score">
                <div class="ar-score-label">AI Priority</div>
                <div class="ar-score-bar"><div class="ar-score-fill" style="width:88%"></div></div>
                <div class="ar-score-val">88</div>
              </div>
              <div class="cal-ar-actions">
                <span class="ar-status-badge overdue">Overdue</span>
                <button class="cai-btn" onclick="openAnnualReviewBrief('JW')">AI Brief <i class="fas fa-robot"></i></button>
              </div>
            </div>
            <div class="cal-ar-row priority-high">
              <div class="cal-ar-client">
                <div class="cal-ar-avatar">RC</div>
                <div class="cal-ar-info">
                  <div class="cal-ar-name">Robert Chen</div>
                  <div class="cal-ar-meta">Last review: Jun 2025 · 305 days ago</div>
                </div>
              </div>
              <div class="cal-ar-policies">
                <span class="ar-policy-tag">VUL $1M</span>
                <span class="ar-policy-tag">Claim Active</span>
                <span class="ar-policy-tag">Estate Plan</span>
              </div>
              <div class="cal-ar-ai-score">
                <div class="ar-score-label">AI Priority</div>
                <div class="ar-score-bar"><div class="ar-score-fill" style="width:82%"></div></div>
                <div class="ar-score-val">82</div>
              </div>
              <div class="cal-ar-actions">
                <span class="ar-status-badge pending">Due Apr 25</span>
                <button class="cai-btn" onclick="openAnnualReviewBrief('RC')">AI Brief <i class="fas fa-robot"></i></button>
              </div>
            </div>
            <div class="cal-ar-row priority-normal">
              <div class="cal-ar-client">
                <div class="cal-ar-avatar">SW</div>
                <div class="cal-ar-info">
                  <div class="cal-ar-name">Sandra Williams</div>
                  <div class="cal-ar-meta">Last review: May 2025 · 340 days ago</div>
                </div>
              </div>
              <div class="cal-ar-policies">
                <span class="ar-policy-tag">WL $500K</span>
                <span class="ar-policy-tag">Renewal Due</span>
              </div>
              <div class="cal-ar-ai-score">
                <div class="ar-score-label">AI Priority</div>
                <div class="ar-score-bar"><div class="ar-score-fill" style="width:74%"></div></div>
                <div class="ar-score-val">74</div>
              </div>
              <div class="cal-ar-actions">
                <span class="ar-status-badge scheduled">Apr 28</span>
                <button class="cai-btn" onclick="openAnnualReviewBrief('SW')">AI Brief <i class="fas fa-robot"></i></button>
              </div>
            </div>
          </div>
          <div class="cal-ar-footer">
            <button class="cal-ai-action-btn" onclick="scheduleAllAnnualReviews()"><i class="fas fa-magic"></i> AI Schedule All Overdue</button>
            <button class="cal-ai-action-btn secondary" onclick="exportAnnualReviewReport()"><i class="fas fa-file-export"></i> Export Report</button>
          </div>
        </div>

        {/* ── Tab: Life Event Trigger Engine ── */}
        <div class="cal-ai-tab-panel" id="cal-ai-panel-life-events" style="display:none">
          <div class="cal-ai-feature-header">
            <div class="cal-ai-feat-title"><i class="fas fa-heartbeat"></i> Life Event Trigger Engine</div>
            <div class="cal-ai-feat-sub">Real-time detection of life events from 3rd-party data — auto-triggers personalized outreach &amp; product recommendations</div>
            <div class="cal-ai-feat-stats">
              <span class="feat-stat-pill amber"><i class="fas fa-bell"></i> 3 New Events</span>
              <span class="feat-stat-pill green"><i class="fas fa-paper-plane"></i> 5 Outreach Sent</span>
              <span class="feat-stat-pill blue"><i class="fas fa-robot"></i> AI Drafts Ready: 3</span>
            </div>
          </div>
          <div class="cal-ai-le-list">
            <div class="cal-le-row le-new">
              <div class="le-event-icon marriage"><i class="fas fa-ring"></i></div>
              <div class="le-client-info">
                <div class="le-client-name">Patricia Nguyen</div>
                <div class="le-event-type">Marriage / Name Change Detected</div>
                <div class="le-event-source">Source: Public Records · Detected: 2 days ago</div>
              </div>
              <div class="le-recommendations">
                <span class="le-rec-tag">Beneficiary Update</span>
                <span class="le-rec-tag">Spouse Coverage</span>
                <span class="le-rec-tag">Joint Annuity</span>
              </div>
              <div class="le-actions">
                <span class="le-badge new">New</span>
                <button class="cai-btn" onclick="openLifeEventOutreach('PN', 'marriage')">Draft Outreach <i class="fas fa-robot"></i></button>
              </div>
            </div>
            <div class="cal-le-row le-new">
              <div class="le-event-icon baby"><i class="fas fa-baby"></i></div>
              <div class="le-client-info">
                <div class="le-client-name">David Thompson</div>
                <div class="le-event-type">New Child / Birth Record Detected</div>
                <div class="le-event-source">Source: Vital Records · Detected: 5 days ago</div>
              </div>
              <div class="le-recommendations">
                <span class="le-rec-tag">Term Life Rider</span>
                <span class="le-rec-tag">529 Education Plan</span>
                <span class="le-rec-tag">DI Coverage Review</span>
              </div>
              <div class="le-actions">
                <span class="le-badge new">New</span>
                <button class="cai-btn" onclick="openLifeEventOutreach('DT', 'newchild')">Draft Outreach <i class="fas fa-robot"></i></button>
              </div>
            </div>
            <div class="cal-le-row le-new">
              <div class="le-event-icon retirement"><i class="fas fa-umbrella-beach"></i></div>
              <div class="le-client-info">
                <div class="le-client-name">Maria Gonzalez</div>
                <div class="le-event-type">Approaching Retirement Age (62)</div>
                <div class="le-event-source">Source: DOB on File · Age milestone in 4 months</div>
              </div>
              <div class="le-recommendations">
                <span class="le-rec-tag">Social Security Brief</span>
                <span class="le-rec-tag">Medicare Enrollment</span>
                <span class="le-rec-tag">RMD Planning</span>
                <span class="le-rec-tag">Income Annuity</span>
              </div>
              <div class="le-actions">
                <span class="le-badge upcoming">Upcoming</span>
                <button class="cai-btn" onclick="openLifeEventOutreach('MG', 'retirement')">Draft Outreach <i class="fas fa-robot"></i></button>
              </div>
            </div>
            <div class="cal-le-row le-sent">
              <div class="le-event-icon home"><i class="fas fa-home"></i></div>
              <div class="le-client-info">
                <div class="le-client-name">James Whitfield</div>
                <div class="le-event-type">Home Purchase Detected</div>
                <div class="le-event-source">Source: Property Records · Detected: 12 days ago</div>
              </div>
              <div class="le-recommendations">
                <span class="le-rec-tag">Umbrella Policy</span>
                <span class="le-rec-tag">Mortgage Protection</span>
              </div>
              <div class="le-actions">
                <span class="le-badge sent">Outreach Sent</span>
                <button class="cai-btn secondary" onclick="viewLifeEventLog('JW', 'home')">View Log <i class="fas fa-eye"></i></button>
              </div>
            </div>
          </div>
          <div class="cal-ar-footer">
            <button class="cal-ai-action-btn" onclick="scanAllLifeEvents()"><i class="fas fa-satellite-dish"></i> Scan All Clients Now</button>
            <button class="cal-ai-action-btn secondary" onclick="openLifeEventSettings()"><i class="fas fa-cog"></i> Trigger Settings</button>
          </div>
        </div>

        {/* ── Tab: LTC & Medicare Planning ── */}
        <div class="cal-ai-tab-panel" id="cal-ai-panel-ltc" style="display:none">
          <div class="cal-ai-feature-header">
            <div class="cal-ai-feat-title"><i class="fas fa-hand-holding-medical"></i> LTC &amp; Medicare Planning Center</div>
            <div class="cal-ai-feat-sub">AI identifies clients approaching Medicare eligibility, LTC need windows, and hybrid product opportunities</div>
            <div class="cal-ai-feat-stats">
              <span class="feat-stat-pill red"><i class="fas fa-exclamation-circle"></i> 2 Medicare Urgent</span>
              <span class="feat-stat-pill amber"><i class="fas fa-shield-alt"></i> 4 LTC Candidates</span>
              <span class="feat-stat-pill blue"><i class="fas fa-exchange-alt"></i> 2 Hybrid Opportunities</span>
            </div>
          </div>
          <div class="cal-ai-ltc-grid">
            <div class="cal-ltc-card urgent">
              <div class="ltc-card-header">
                <div class="ltc-avatar">MG</div>
                <div class="ltc-client-info">
                  <div class="ltc-client-name">Maria Gonzalez</div>
                  <div class="ltc-client-age">Age 61 · Medicare eligible in 4 months</div>
                </div>
                <span class="ltc-urgency-badge red">Action Required</span>
              </div>
              <div class="ltc-timeline">
                <div class="ltc-timeline-item done"><i class="fas fa-check-circle"></i> Initial Medicare consultation scheduled</div>
                <div class="ltc-timeline-item active"><i class="fas fa-circle"></i> Part A &amp; B enrollment window opens Jul 2026</div>
                <div class="ltc-timeline-item upcoming"><i class="fas fa-clock"></i> Medigap / Part D comparison — due May 15</div>
                <div class="ltc-timeline-item upcoming"><i class="fas fa-clock"></i> LTC hybrid product review — recommended age 62</div>
              </div>
              <div class="ltc-products">
                <span class="ltc-product-tag">Medicare Supplement Plan G</span>
                <span class="ltc-product-tag">Part D Rx</span>
                <span class="ltc-product-tag">Hybrid LTC/Life</span>
              </div>
              <div class="ltc-card-actions">
                <button class="cai-btn" onclick="openLtcPlanningModal('MG')">Full Plan <i class="fas fa-arrow-right"></i></button>
                <button class="cai-btn secondary" onclick="openMeetingBrief('LTC-MG')">Brief <i class="fas fa-file-alt"></i></button>
              </div>
            </div>
            <div class="cal-ltc-card high">
              <div class="ltc-card-header">
                <div class="ltc-avatar">SW</div>
                <div class="ltc-client-info">
                  <div class="ltc-client-name">Sandra Williams</div>
                  <div class="ltc-client-age">Age 52 · LTC planning window open now</div>
                </div>
                <span class="ltc-urgency-badge amber">High Value</span>
              </div>
              <div class="ltc-timeline">
                <div class="ltc-timeline-item done"><i class="fas fa-check-circle"></i> WL policy includes LTC rider option</div>
                <div class="ltc-timeline-item active"><i class="fas fa-circle"></i> Hybrid LTC product analysis ready</div>
                <div class="ltc-timeline-item upcoming"><i class="fas fa-clock"></i> Renewal meeting Apr 28 — ideal LTC conversation</div>
              </div>
              <div class="ltc-products">
                <span class="ltc-product-tag">LTC Rider Add-on</span>
                <span class="ltc-product-tag">Hybrid Life/LTC</span>
                <span class="ltc-product-tag">Annuity w/ LTC</span>
              </div>
              <div class="ltc-card-actions">
                <button class="cai-btn" onclick="openLtcPlanningModal('SW')">Full Plan <i class="fas fa-arrow-right"></i></button>
                <button class="cai-btn secondary" onclick="openMeetingBrief('LTC-SW')">Brief <i class="fas fa-file-alt"></i></button>
              </div>
            </div>
            <div class="cal-ltc-card normal">
              <div class="ltc-card-header">
                <div class="ltc-avatar">LM</div>
                <div class="ltc-client-info">
                  <div class="ltc-client-name">Linda Morrison</div>
                  <div class="ltc-client-age">Age 58 · LTC gap in current portfolio</div>
                </div>
                <span class="ltc-urgency-badge blue">Opportunity</span>
              </div>
              <div class="ltc-timeline">
                <div class="ltc-timeline-item done"><i class="fas fa-check-circle"></i> WL $2M — no LTC coverage</div>
                <div class="ltc-timeline-item active"><i class="fas fa-circle"></i> AI gap analysis complete — $3,200/mo LTC exposure</div>
                <div class="ltc-timeline-item upcoming"><i class="fas fa-clock"></i> Annual review Apr 15 — include LTC in agenda</div>
              </div>
              <div class="ltc-products">
                <span class="ltc-product-tag">Standalone LTC Policy</span>
                <span class="ltc-product-tag">Asset-Based LTC</span>
              </div>
              <div class="ltc-card-actions">
                <button class="cai-btn" onclick="openLtcPlanningModal('LM')">Full Plan <i class="fas fa-arrow-right"></i></button>
                <button class="cai-btn secondary" onclick="openMeetingBrief('LTC-LM')">Brief <i class="fas fa-file-alt"></i></button>
              </div>
            </div>
          </div>
          <div class="cal-ar-footer">
            <button class="cal-ai-action-btn" onclick="runLtcScan()"><i class="fas fa-search-plus"></i> Scan All Clients for LTC Gaps</button>
            <button class="cal-ai-action-btn secondary" onclick="exportLtcReport()"><i class="fas fa-file-export"></i> Export LTC Report</button>
          </div>
        </div>

        {/* ── Tab: Portfolio Drift Monitor ── */}
        <div class="cal-ai-tab-panel" id="cal-ai-panel-drift" style="display:none">
          <div class="cal-ai-feature-header">
            <div class="cal-ai-feat-title"><i class="fas fa-chart-line"></i> Portfolio Drift Monitor</div>
            <div class="cal-ai-feat-sub">Real-time allocation drift detection · AI rebalancing proposals · Automated client alerts</div>
            <div class="cal-ai-feat-stats">
              <span class="feat-stat-pill red"><i class="fas fa-exclamation-triangle"></i> 2 Critical Drift</span>
              <span class="feat-stat-pill amber"><i class="fas fa-exclamation-circle"></i> 3 Moderate Drift</span>
              <span class="feat-stat-pill green"><i class="fas fa-check-circle"></i> 5 On Target</span>
              <span class="feat-stat-pill blue"><i class="fas fa-dollar-sign"></i> Total AUM: $4.2M</span>
            </div>
          </div>
          <div class="cal-ai-drift-list">
            <div class="cal-drift-row drift-critical">
              <div class="drift-client-col">
                <div class="cal-ar-avatar">RC</div>
                <div>
                  <div class="drift-client-name">Robert Chen</div>
                  <div class="drift-aum">AUM: $890K · VUL + Investment</div>
                </div>
              </div>
              <div class="drift-bars-col">
                <div class="drift-bar-row">
                  <span class="drift-asset-lbl">Equities</span>
                  <div class="drift-bar-wrap">
                    <div class="drift-bar-target" style="width:60%"></div>
                    <div class="drift-bar-actual drift-over" style="width:73%"></div>
                  </div>
                  <span class="drift-pct red">+13% <i class="fas fa-arrow-up"></i></span>
                </div>
                <div class="drift-bar-row">
                  <span class="drift-asset-lbl">Fixed Inc.</span>
                  <div class="drift-bar-wrap">
                    <div class="drift-bar-target" style="width:30%"></div>
                    <div class="drift-bar-actual drift-under" style="width:19%"></div>
                  </div>
                  <span class="drift-pct amber">-11% <i class="fas fa-arrow-down"></i></span>
                </div>
              </div>
              <div class="drift-action-col">
                <span class="drift-badge critical">8% Drift</span>
                <button class="cai-btn" onclick="openDriftRebalance('RC')">Rebalance <i class="fas fa-balance-scale"></i></button>
              </div>
            </div>
            <div class="cal-drift-row drift-critical">
              <div class="drift-client-col">
                <div class="cal-ar-avatar">MG</div>
                <div>
                  <div class="drift-client-name">Maria Gonzalez</div>
                  <div class="drift-aum">AUM: $340K · Annuity + IRA</div>
                </div>
              </div>
              <div class="drift-bars-col">
                <div class="drift-bar-row">
                  <span class="drift-asset-lbl">Growth</span>
                  <div class="drift-bar-wrap">
                    <div class="drift-bar-target" style="width:40%"></div>
                    <div class="drift-bar-actual drift-over" style="width:55%"></div>
                  </div>
                  <span class="drift-pct red">+15% <i class="fas fa-arrow-up"></i></span>
                </div>
                <div class="drift-bar-row">
                  <span class="drift-asset-lbl">Income</span>
                  <div class="drift-bar-wrap">
                    <div class="drift-bar-target" style="width:50%"></div>
                    <div class="drift-bar-actual drift-under" style="width:36%"></div>
                  </div>
                  <span class="drift-pct amber">-14% <i class="fas fa-arrow-down"></i></span>
                </div>
              </div>
              <div class="drift-action-col">
                <span class="drift-badge critical">7% Drift</span>
                <button class="cai-btn" onclick="openDriftRebalance('MG')">Rebalance <i class="fas fa-balance-scale"></i></button>
              </div>
            </div>
            <div class="cal-drift-row drift-moderate">
              <div class="drift-client-col">
                <div class="cal-ar-avatar">LM</div>
                <div>
                  <div class="drift-client-name">Linda Morrison</div>
                  <div class="drift-aum">AUM: $500K · UMA + WL</div>
                </div>
              </div>
              <div class="drift-bars-col">
                <div class="drift-bar-row">
                  <span class="drift-asset-lbl">Equities</span>
                  <div class="drift-bar-wrap">
                    <div class="drift-bar-target" style="width:55%"></div>
                    <div class="drift-bar-actual drift-over" style="width:60%"></div>
                  </div>
                  <span class="drift-pct amber">+5% <i class="fas fa-arrow-up"></i></span>
                </div>
                <div class="drift-bar-row">
                  <span class="drift-asset-lbl">Alts</span>
                  <div class="drift-bar-wrap">
                    <div class="drift-bar-target" style="width:15%"></div>
                    <div class="drift-bar-actual drift-under" style="width:10%"></div>
                  </div>
                  <span class="drift-pct amber">-5% <i class="fas fa-arrow-down"></i></span>
                </div>
              </div>
              <div class="drift-action-col">
                <span class="drift-badge moderate">4% Drift</span>
                <button class="cai-btn secondary" onclick="openDriftRebalance('LM')">Review <i class="fas fa-eye"></i></button>
              </div>
            </div>
            <div class="cal-drift-row drift-ok">
              <div class="drift-client-col">
                <div class="cal-ar-avatar">JW</div>
                <div>
                  <div class="drift-client-name">James Whitfield</div>
                  <div class="drift-aum">AUM: $430K · Annuity + IRA</div>
                </div>
              </div>
              <div class="drift-bars-col">
                <div class="drift-bar-row">
                  <span class="drift-asset-lbl">Balanced</span>
                  <div class="drift-bar-wrap">
                    <div class="drift-bar-target" style="width:50%"></div>
                    <div class="drift-bar-actual drift-ok" style="width:51%"></div>
                  </div>
                  <span class="drift-pct green">+1% <i class="fas fa-check"></i></span>
                </div>
              </div>
              <div class="drift-action-col">
                <span class="drift-badge ok">On Target</span>
                <button class="cai-btn secondary" onclick="openDriftRebalance('JW')">View <i class="fas fa-eye"></i></button>
              </div>
            </div>
          </div>
          <div class="cal-ar-footer">
            <button class="cal-ai-action-btn" onclick="runDriftScanAll()"><i class="fas fa-sync-alt"></i> Scan All Portfolios</button>
            <button class="cal-ai-action-btn secondary" onclick="autoRebalanceAll()"><i class="fas fa-magic"></i> AI Auto-Rebalance Proposals</button>
            <button class="cal-ai-action-btn secondary" onclick="exportDriftReport()"><i class="fas fa-file-export"></i> Export Report</button>
          </div>
        </div>

      </div>

      {/* ── Legend + Filter row ── */}
      <div class="cal-toolbar-row">
        <div class="cal-legend-strip">
          <span class="cal-legend-item"><span class="cal-leg-dot ins-dot"></span> Insurance</span>
          <span class="cal-legend-item"><span class="cal-leg-dot inv-dot"></span> Investments</span>
          <span class="cal-legend-item"><span class="cal-leg-dot ret-dot"></span> Retirement</span>
          <span class="cal-legend-item"><span class="cal-leg-dot adv-dot"></span> Advisory</span>
          <span class="cal-legend-item"><span class="cal-leg-dot urgent-dot"></span> Urgent</span>
          <span class="cal-legend-item"><span class="cal-leg-dot renewal-dot"></span> Renewal</span>
        </div>
        <div class="cal-toolbar-filters">
          <select class="filter-select cal-domain-filter" id="cal-domain-filter" onchange="calFilterDomain(this.value)">
            <option value="">All Domains</option>
            <option value="ins">Insurance</option>
            <option value="inv">Investments</option>
            <option value="ret">Retirement</option>
            <option value="adv">Advisory</option>
            <option value="urgent">Urgent</option>
          </select>
          <select class="filter-select" id="cal-type-filter" onchange="calFilterType(this.value)">
            <option value="">All Types</option>
            <option value="meeting">Client Meeting</option>
            <option value="review">Annual Review</option>
            <option value="renewal">Renewal</option>
            <option value="followup">Follow-up</option>
            <option value="internal">Internal</option>
          </select>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div class="calendar-layout">

        {/* ── MONTH VIEW (default) ── */}
        <div class="calendar-main" id="cal-view-month-panel">
          <div class="cal-header">
            <button class="cal-nav" id="cal-prev-btn" onclick="calNavMonth(-1)" title="Previous month"><i class="fas fa-chevron-left"></i></button>
            <h3 id="cal-month-label">April 2026</h3>
            <button class="cal-nav" id="cal-next-btn" onclick="calNavMonth(1)" title="Next month"><i class="fas fa-chevron-right"></i></button>
            <div class="cal-header-right">
              <button class="cal-today-btn" onclick="calGoToday()">Today</button>
            </div>
          </div>
          <div class="cal-grid" id="cal-grid">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div class="cal-day-header">{d}</div>
            ))}
            {[...Array(30)].map((_, i) => {
              const day = i + 1
              const hasEvent = [5, 10, 12, 15, 17, 18, 22, 25, 28].includes(day)
              const isToday = day === 15
              return (
                <div class={`cal-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-events' : ''}`} onclick={`calDayClick(${day},event)`}>
                  <span class="cal-day-num">{day}</span>
                  {day === 5  && <div class="cal-event cal-ev-inv" data-evid="EVT-005" onclick="calEventClick('EVT-005',event)"><i class="fas fa-circle ev-dot"></i>Maria G. — Annuity Review</div>}
                  {day === 10 && <div class="cal-event urgent" data-domain="urgent" data-evid="EVT-010a" onclick="calEventClick('EVT-010a',event)"><i class="fas fa-circle ev-dot"></i>Kevin Park Follow-up</div>}
                  {day === 10 && <div class="cal-event cal-ev-ins" data-domain="ins" data-evid="EVT-010b" onclick="calEventClick('EVT-010b',event)"><i class="fas fa-circle ev-dot"></i>Robert Chen — Claim</div>}
                  {day === 12 && <div class="cal-event cal-ev-inv" data-domain="inv" data-evid="EVT-012" onclick="calEventClick('EVT-012',event)"><i class="fas fa-circle ev-dot"></i>Alex Rivera — Prospect</div>}
                  {day === 15 && <div class="cal-event cal-ev-adv" data-domain="adv" data-evid="EVT-015" onclick="calEventClick('EVT-015',event)"><i class="fas fa-circle ev-dot"></i>Linda Morrison Review</div>}
                  {day === 17 && <div class="cal-event cal-ev-ins" data-domain="ins" data-evid="EVT-017" onclick="calEventClick('EVT-017',event)"><i class="fas fa-circle ev-dot"></i>Nancy Foster — New Client</div>}
                  {day === 18 && <div class="cal-event cal-ev-ret" data-domain="ret" data-evid="EVT-018" onclick="calEventClick('EVT-018',event)"><i class="fas fa-circle ev-dot"></i>James Whitfield — Ret.</div>}
                  {day === 22 && <div class="cal-event cal-ev-ins" data-domain="ins" data-evid="EVT-022" onclick="calEventClick('EVT-022',event)"><i class="fas fa-circle ev-dot"></i>Team Q1 Review</div>}
                  {day === 25 && <div class="cal-event cal-ev-adv" data-domain="adv" data-evid="EVT-025" onclick="calEventClick('EVT-025',event)"><i class="fas fa-circle ev-dot"></i>Robert Chen — Estate</div>}
                  {day === 28 && <div class="cal-event renewal" data-domain="ins" data-evid="EVT-028" onclick="calEventClick('EVT-028',event)"><i class="fas fa-circle ev-dot"></i>Sandra Williams Renewal</div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── WEEK VIEW (hidden by default) ── */}
        <div class="calendar-main cal-week-view" id="cal-view-week-panel" style="display:none">
          <div class="cal-header">
            <button class="cal-nav" onclick="calNavWeek(-1)"><i class="fas fa-chevron-left"></i></button>
            <h3 id="cal-week-label">Apr 13 – 19, 2026</h3>
            <button class="cal-nav" onclick="calNavWeek(1)"><i class="fas fa-chevron-right"></i></button>
            <div class="cal-header-right">
              <button class="cal-today-btn" onclick="calGoToday()">Today</button>
            </div>
          </div>
          <div class="cal-week-grid" id="cal-week-grid">
            <div class="cwg-time-col">
              {['8 AM','9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM'].map(t => (
                <div class="cwg-time-slot">{t}</div>
              ))}
            </div>
            {[
              {day:'Mon', date:'13', evs:[]},
              {day:'Tue', date:'14', evs:[]},
              {day:'Wed', date:'15', evs:[{time:'9AM',dur:2,title:'Linda Morrison Annual Review',cls:'cal-ev-adv',id:'EVT-015'}]},
              {day:'Thu', date:'16', evs:[]},
              {day:'Fri', date:'17', evs:[{time:'11AM',dur:1,title:'Nancy Foster — New Client',cls:'cal-ev-ins',id:'EVT-017'}]},
              {day:'Sat', date:'18', evs:[{time:'2PM',dur:1,title:'James Whitfield — Ret. Plan',cls:'cal-ev-ret',id:'EVT-018'}]},
              {day:'Sun', date:'19', evs:[]}
            ].map(col => (
              <div class="cwg-day-col">
                <div class={`cwg-day-header ${col.date==='15'?'cwg-today':''}`}>
                  <span class="cwg-day-name">{col.day}</span>
                  <span class="cwg-day-date">{col.date}</span>
                </div>
                <div class="cwg-day-slots">
                  {col.evs.map(ev => (
                    <div class={`cwg-event ${ev.cls}`} style={`top:${({'8AM':0,'9AM':44,'10AM':88,'11AM':132,'12PM':176,'1PM':220,'2PM':264,'3PM':308,'4PM':352}[ev.time]||0)}px;height:${ev.dur*42}px`} onclick={`openMeetingBrief('${ev.id.replace('EVT-','MTG-0')}')`}>
                      <div class="cwg-ev-title">{ev.title}</div>
                      <div class="cwg-ev-time">{ev.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── AGENDA VIEW (hidden by default) ── */}
        <div class="calendar-main" id="cal-view-agenda-panel" style="display:none">
          <div class="cal-header">
            <h3><i class="fas fa-list"></i> Agenda — April 2026</h3>
          </div>
          <div class="cal-agenda-list">
            <div class="cal-agenda-day-header">Today · Apr 15, 2026</div>
            <div class="cal-agenda-item urgent-agenda" onclick="openMeetingBrief('MTG-004')">
              <div class="cag-time"><span class="cag-t">9:00</span><span class="cag-ap">AM</span></div>
              <div class="cag-bar adv-bar"></div>
              <div class="cag-body">
                <div class="cag-title">Linda Morrison — Annual Review</div>
                <div class="cag-meta"><span class="act-domain-pill adv">Advisory</span> 90 min · In Person · Estate + UMA + Insurance</div>
                <div class="cag-prep"><i class="fas fa-robot"></i> AI Brief ready · 6 talking points · High-value meeting</div>
              </div>
              <button class="cag-brief-btn" onclick="event.stopPropagation();openMeetingBrief('MTG-004')"><i class="fas fa-file-alt"></i> Brief</button>
            </div>

            <div class="cal-agenda-day-header">Apr 17 · Friday</div>
            <div class="cal-agenda-item" onclick="openMeetingBrief('MTG-005')">
              <div class="cag-time"><span class="cag-t">11:00</span><span class="cag-ap">AM</span></div>
              <div class="cag-bar ins-bar"></div>
              <div class="cag-body">
                <div class="cag-title">Nancy Foster — New Client Onboarding</div>
                <div class="cag-meta"><span class="act-domain-pill ins">Insurance</span> 60 min · Video · Term Life + WL discussion</div>
                <div class="cag-prep"><i class="fas fa-robot"></i> AI Brief ready · New prospect profile prepared</div>
              </div>
              <button class="cag-brief-btn" onclick="event.stopPropagation();openMeetingBrief('MTG-005')"><i class="fas fa-file-alt"></i> Brief</button>
            </div>

            <div class="cal-agenda-day-header">Apr 18 · Saturday</div>
            <div class="cal-agenda-item" onclick="openMeetingBrief('MTG-005')">
              <div class="cag-time"><span class="cag-t">2:00</span><span class="cag-ap">PM</span></div>
              <div class="cag-bar ret-bar"></div>
              <div class="cag-body">
                <div class="cag-title">James Whitfield — Retirement Plan Review</div>
                <div class="cag-meta"><span class="act-domain-pill ret">Retirement</span> 60 min · Phone · Deferred annuity illustration</div>
                <div class="cag-prep"><i class="fas fa-robot"></i> AI Brief ready · Annuity illustration generated</div>
              </div>
              <button class="cag-brief-btn" onclick="event.stopPropagation();openMeetingBrief('MTG-005')"><i class="fas fa-file-alt"></i> Brief</button>
            </div>

            <div class="cal-agenda-day-header">Apr 22 · Wednesday</div>
            <div class="cal-agenda-item" onclick="openMeetingBrief('MTG-006')">
              <div class="cag-time"><span class="cag-t">10:00</span><span class="cag-ap">AM</span></div>
              <div class="cag-bar ins-bar"></div>
              <div class="cag-body">
                <div class="cag-title">Team Q1 Performance Review</div>
                <div class="cag-meta"><span class="act-domain-pill ins">Insurance</span> 120 min · In Person · Roger Putnam · All lines</div>
                <div class="cag-prep"><i class="fas fa-robot"></i> AI Summary prepared · Q1 scorecard ready</div>
              </div>
              <button class="cag-brief-btn" onclick="event.stopPropagation();openMeetingBrief('MTG-006')"><i class="fas fa-file-alt"></i> Brief</button>
            </div>

            <div class="cal-agenda-day-header">Apr 25 · Saturday</div>
            <div class="cal-agenda-item" onclick="openMeetingBrief('MTG-007')">
              <div class="cag-time"><span class="cag-t">3:00</span><span class="cag-ap">PM</span></div>
              <div class="cag-bar adv-bar"></div>
              <div class="cag-body">
                <div class="cag-title">Robert Chen — Estate Planning</div>
                <div class="cag-meta"><span class="act-domain-pill adv">Advisory</span> 90 min · In Person · Business succession + NQDC</div>
                <div class="cag-prep"><i class="fas fa-robot"></i> AI Brief ready · Business owner analysis prepared</div>
              </div>
              <button class="cag-brief-btn" onclick="event.stopPropagation();openMeetingBrief('MTG-007')"><i class="fas fa-file-alt"></i> Brief</button>
            </div>

            <div class="cal-agenda-day-header">Apr 28 · Tuesday</div>
            <div class="cal-agenda-item renewal-agenda" onclick="openMeetingBrief('MTG-008')">
              <div class="cag-time"><span class="cag-t">1:00</span><span class="cag-ap">PM</span></div>
              <div class="cag-bar renewal-bar"></div>
              <div class="cag-body">
                <div class="cag-title">Sandra Williams — Policy Renewal</div>
                <div class="cag-meta"><span class="act-domain-pill ins">Insurance</span> 45 min · Phone · P-100320 review</div>
                <div class="cag-prep"><i class="fas fa-robot"></i> AI Brief ready · Renewal package + upgrade options prepared</div>
              </div>
              <button class="cag-brief-btn" onclick="event.stopPropagation();openMeetingBrief('MTG-008')"><i class="fas fa-file-alt"></i> Brief</button>
            </div>
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div class="calendar-sidebar">

          {/* Today's Schedule */}
          <div class="cal-today-card">
            <div class="cal-today-header">
              <i class="fas fa-sun"></i>
              <span>Today — Apr 15, 2026</span>
              <span class="cal-today-count">2 meetings</span>
            </div>
            <div class="cal-today-meetings">
              <div class="ctm-row">
                <div class="ctm-time">9:00 AM</div>
                <div class="ctm-bar adv-bar"></div>
                <div class="ctm-body">
                  <div class="ctm-title">Linda Morrison</div>
                  <div class="ctm-sub">Annual Review · 90 min</div>
                </div>
                <div class="ctm-prep ready" title="AI Brief ready"><i class="fas fa-robot"></i></div>
              </div>
              <div class="ctm-row">
                <div class="ctm-time">2:00 PM</div>
                <div class="ctm-bar ins-bar"></div>
                <div class="ctm-body">
                  <div class="ctm-title">Team Q1 Prep</div>
                  <div class="ctm-sub">Internal · 30 min</div>
                </div>
                <div class="ctm-prep ready" title="Notes ready"><i class="fas fa-check-circle"></i></div>
              </div>
            </div>
          </div>

          {/* --- UPCOMING MEETINGS --- */}
          <div class="cal-sidebar-section-header" style="margin-top:14px">
            <h4><i class="fas fa-calendar-alt"></i> Upcoming Meetings</h4>
            <span class="cal-section-badge upcoming-badge">8</span>
          </div>
          <div class="upcoming-list">

            <div class="upcoming-event urgent-event">
              <div class="ue-date"><span class="ue-d">15</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">Linda Morrison — Annual Review</div>
                <div class="ue-meta-row">
                  <span class="act-domain-pill adv">Advisory</span>
                  <span class="ue-type-tag"><i class="fas fa-users"></i> In Person</span>
                  <span class="ue-duration">90 min</span>
                </div>
                <div class="ue-prep-bar">
                  <span class="ue-prep-label">AI Prep</span>
                  <div class="ue-prep-track"><div class="ue-prep-fill" style="width:92%"></div></div>
                  <span class="ue-prep-pct">92%</span>
                </div>
                <div class="ue-actions">
                  <button class="btn-pmb" onclick="openMeetingBrief('MTG-004')"><i class="fas fa-file-alt"></i> Pre-Meeting Brief</button>
                </div>
              </div>
            </div>

            <div class="upcoming-event">
              <div class="ue-date"><span class="ue-d">17</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">Nancy Foster — New Client</div>
                <div class="ue-meta-row">
                  <span class="act-domain-pill ins">Insurance</span>
                  <span class="ue-type-tag"><i class="fas fa-video"></i> Video</span>
                  <span class="ue-duration">60 min</span>
                </div>
                <div class="ue-prep-bar">
                  <span class="ue-prep-label">AI Prep</span>
                  <div class="ue-prep-track"><div class="ue-prep-fill" style="width:78%"></div></div>
                  <span class="ue-prep-pct">78%</span>
                </div>
                <div class="ue-actions">
                  <button class="btn-pmb" onclick="openMeetingBrief('MTG-005')"><i class="fas fa-file-alt"></i> Pre-Meeting Brief</button>
                </div>
              </div>
            </div>

            <div class="upcoming-event">
              <div class="ue-date"><span class="ue-d">18</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">James Whitfield — Ret. Plan</div>
                <div class="ue-meta-row">
                  <span class="act-domain-pill ret">Retirement</span>
                  <span class="ue-type-tag"><i class="fas fa-phone"></i> Phone</span>
                  <span class="ue-duration">60 min</span>
                </div>
                <div class="ue-prep-bar">
                  <span class="ue-prep-label">AI Prep</span>
                  <div class="ue-prep-track"><div class="ue-prep-fill" style="width:85%"></div></div>
                  <span class="ue-prep-pct">85%</span>
                </div>
                <div class="ue-actions">
                  <button class="btn-pmb" onclick="openMeetingBrief('MTG-005')"><i class="fas fa-file-alt"></i> Pre-Meeting Brief</button>
                </div>
              </div>
            </div>

            <div class="upcoming-event">
              <div class="ue-date"><span class="ue-d">22</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">Team Q1 Performance Review</div>
                <div class="ue-meta-row">
                  <span class="act-domain-pill ins">Insurance</span>
                  <span class="ue-type-tag"><i class="fas fa-users"></i> In Person</span>
                  <span class="ue-duration">120 min</span>
                </div>
                <div class="ue-actions">
                  <button class="btn-pmb" onclick="openMeetingBrief('MTG-006')"><i class="fas fa-file-alt"></i> Pre-Meeting Brief</button>
                </div>
              </div>
            </div>

            <div class="upcoming-event">
              <div class="ue-date"><span class="ue-d">25</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">Robert Chen — Estate Planning</div>
                <div class="ue-meta-row">
                  <span class="act-domain-pill adv">Advisory</span>
                  <span class="ue-type-tag"><i class="fas fa-users"></i> In Person</span>
                  <span class="ue-duration">90 min</span>
                </div>
                <div class="ue-actions">
                  <button class="btn-pmb" onclick="openMeetingBrief('MTG-007')"><i class="fas fa-file-alt"></i> Pre-Meeting Brief</button>
                </div>
              </div>
            </div>

            <div class="upcoming-event renewal-event">
              <div class="ue-date"><span class="ue-d">28</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">Sandra Williams — Policy Renewal</div>
                <div class="ue-meta-row">
                  <span class="act-domain-pill ins">Insurance</span>
                  <span class="ue-type-tag"><i class="fas fa-phone"></i> Phone</span>
                  <span class="ue-duration">45 min</span>
                </div>
                <div class="ue-actions">
                  <button class="btn-pmb" onclick="openMeetingBrief('MTG-008')"><i class="fas fa-file-alt"></i> Pre-Meeting Brief</button>
                </div>
              </div>
            </div>

          </div>

          {/* --- RECENT MEETINGS --- */}
          <div class="cal-sidebar-section-header" style="margin-top:14px">
            <h4><i class="fas fa-clipboard-check"></i> Recent Meetings</h4>
            <span class="cal-section-badge past-badge">3</span>
          </div>
          <div class="upcoming-list past-meetings-list">

            <div class="upcoming-event past-event">
              <div class="ue-date"><span class="ue-d">12</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">Alex Rivera — Prospect Intro</div>
                <div class="ue-meta-row">
                  <span class="act-domain-pill inv">Investments</span>
                  <span class="ue-outcome-tag success"><i class="fas fa-check"></i> Positive</span>
                </div>
                <div class="ue-actions">
                  <button class="btn-pms" onclick="openMeetingBrief('MTG-P01')"><i class="fas fa-clipboard-list"></i> Post-Meeting Summary</button>
                </div>
              </div>
            </div>

            <div class="upcoming-event past-event">
              <div class="ue-date"><span class="ue-d">10</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">Kevin Park — Follow-up Call</div>
                <div class="ue-meta-row">
                  <span class="act-domain-pill ins">Insurance</span>
                  <span class="ue-outcome-tag pending"><i class="fas fa-clock"></i> Pending</span>
                </div>
                <div class="ue-actions">
                  <button class="btn-pms" onclick="openMeetingBrief('MTG-P02')"><i class="fas fa-clipboard-list"></i> Post-Meeting Summary</button>
                </div>
              </div>
            </div>

            <div class="upcoming-event past-event">
              <div class="ue-date"><span class="ue-d">05</span><span class="ue-m">Apr</span></div>
              <div class="ue-info">
                <div class="ue-title">Maria G. — Annuity Review</div>
                <div class="ue-meta-row">
                  <span class="act-domain-pill inv">Investments</span>
                  <span class="ue-outcome-tag success"><i class="fas fa-check"></i> Positive</span>
                </div>
                <div class="ue-actions">
                  <button class="btn-pms" onclick="openMeetingBrief('MTG-P03')"><i class="fas fa-clipboard-list"></i> Post-Meeting Summary</button>
                </div>
              </div>
            </div>

          </div>

          {/* Domain summary */}
          <div class="cal-sidebar-summary">
            <div class="css-item ins-theme"><i class="fas fa-shield-alt"></i> <span>5</span> Insurance</div>
            <div class="css-item inv-theme"><i class="fas fa-chart-line"></i> <span>2</span> Investments</div>
            <div class="css-item ret-theme"><i class="fas fa-umbrella-beach"></i> <span>1</span> Retirement</div>
            <div class="css-item adv-theme"><i class="fas fa-handshake"></i> <span>2</span> Advisory</div>
          </div>

          <button class="btn btn-ai full-width-btn" style="margin-top:10px" onclick="sendContextMessage('Review my upcoming calendar and suggest optimal meeting preparation priorities, identify any scheduling gaps, and recommend which clients need outreach this week','advisor')">
            <i class="fas fa-robot"></i> AI Schedule Optimizer
          </button>
        </div>
      </div>

      {/* ── Activity Heatmap & Cadence Strip ── */}
      <div class="cal-activity-strip">
        <div class="cal-activity-header">
          <div class="cal-activity-title"><i class="fas fa-chart-bar"></i> Meeting Cadence — Last 12 Weeks</div>
          <div class="cal-activity-legend">
            <span class="cal-heat-leg low">1–2</span>
            <span class="cal-heat-leg med">3–4</span>
            <span class="cal-heat-leg high">5+</span>
          </div>
        </div>
        <div class="cal-heatmap">
          {[
            {w:'Jan W3',n:2},{w:'Jan W4',n:3},{w:'Feb W1',n:1},{w:'Feb W2',n:4},
            {w:'Feb W3',n:3},{w:'Feb W4',n:2},{w:'Mar W1',n:5},{w:'Mar W2',n:4},
            {w:'Mar W3',n:3},{w:'Mar W4',n:6},{w:'Apr W1',n:4},{w:'Apr W2',n:3}
          ].map(w => (
            <div class="cal-heat-col">
              <div class={`cal-heat-cell ${w.n>=5?'heat-high':w.n>=3?'heat-med':'heat-low'}`} title={`${w.w}: ${w.n} meetings`}></div>
              <div class="cal-heat-label">{w.w.split(' ')[1]}</div>
            </div>
          ))}
        </div>
        <div class="cal-cadence-stats">
          <div class="cal-cadence-stat"><span class="ccs-val">3.5</span><span class="ccs-lbl">Avg meetings/week</span></div>
          <div class="cal-cadence-stat"><span class="ccs-val">6</span><span class="ccs-lbl">Peak (Mar W4)</span></div>
          <div class="cal-cadence-stat"><span class="ccs-val">14</span><span class="ccs-lbl">New leads met</span></div>
          <div class="cal-cadence-stat"><span class="ccs-val">87%</span><span class="ccs-lbl">Show rate</span></div>
          <div class="cal-cadence-stat"><span class="ccs-val green-text">+22%</span><span class="ccs-lbl">vs Q4 2025</span></div>
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

      {/* ── Page Header ── */}
      <div class="ais-page-header">
        <div class="ais-page-header-left">
          <div class="ais-page-icon"><i class="fas fa-robot"></i><span class="ai-pulse-ring"></span></div>
          <div>
            <h2 class="ais-page-title">AI Impact Scorecard</h2>
            <p class="ais-page-sub">Measurable AI-driven outcomes across Insurance · Investments · Retirement · Advisory · Q1 2026</p>
          </div>
        </div>
        <div class="ais-page-actions">
          <button class="btn btn-outline ais-btn-sm" onclick="openAIFeedback()"><i class="fas fa-comment-alt"></i> Feedback</button>
          <button class="btn btn-outline ais-btn-sm" onclick="refreshAIInsights()"><i class="fas fa-sync-alt"></i> Refresh</button>
          <button class="btn btn-outline ais-btn-sm" onclick="shareAIScorecard()"><i class="fas fa-share-alt"></i> Share</button>
          <button class="btn btn-primary ais-btn-sm" onclick="exportAIScorecard()"><i class="fas fa-download"></i> Export PDF</button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div class="ais-kpi-strip">
        <div class="ais-kpi-card">
          <div class="ais-kpi-icon blue"><i class="fas fa-dollar-sign"></i></div>
          <div class="ais-kpi-body">
            <div class="ais-kpi-val">$31.2K</div>
            <div class="ais-kpi-lbl">AI Revenue Unlocked</div>
            <div class="ais-kpi-delta up"><i class="fas fa-arrow-up"></i> +$8.4K vs Q4</div>
          </div>
        </div>
        <div class="ais-kpi-card">
          <div class="ais-kpi-icon emerald"><i class="fas fa-bullseye"></i></div>
          <div class="ais-kpi-body">
            <div class="ais-kpi-val">94.6%</div>
            <div class="ais-kpi-lbl">AI Decision Accuracy</div>
            <div class="ais-kpi-delta up"><i class="fas fa-arrow-up"></i> +5.6% vs manual</div>
          </div>
        </div>
        <div class="ais-kpi-card">
          <div class="ais-kpi-icon purple"><i class="fas fa-clock"></i></div>
          <div class="ais-kpi-body">
            <div class="ais-kpi-val">~41 hrs</div>
            <div class="ais-kpi-lbl">Agent Time Saved/Mo</div>
            <div class="ais-kpi-delta up"><i class="fas fa-arrow-up"></i> +12 hrs vs Q4</div>
          </div>
        </div>
        <div class="ais-kpi-card">
          <div class="ais-kpi-icon teal"><i class="fas fa-users"></i></div>
          <div class="ais-kpi-body">
            <div class="ais-kpi-val">247</div>
            <div class="ais-kpi-lbl">Clients AI-Monitored</div>
            <div class="ais-kpi-delta up"><i class="fas fa-arrow-up"></i> +31 new this quarter</div>
          </div>
        </div>
        <div class="ais-kpi-card">
          <div class="ais-kpi-icon amber"><i class="fas fa-shield-alt"></i></div>
          <div class="ais-kpi-body">
            <div class="ais-kpi-val">$14.2K</div>
            <div class="ais-kpi-lbl">Premium Retained</div>
            <div class="ais-kpi-delta up"><i class="fas fa-arrow-up"></i> 3 clients saved</div>
          </div>
        </div>
        <div class="ais-kpi-card">
          <div class="ais-kpi-icon red"><i class="fas fa-star"></i></div>
          <div class="ais-kpi-body">
            <div class="ais-kpi-val">87 / 100</div>
            <div class="ais-kpi-lbl">Overall AI Score</div>
            <div class="ais-kpi-delta up"><i class="fas fa-arrow-up"></i> +12 pts vs Q4</div>
          </div>
        </div>
      </div>

      {/* ── AI Live Intelligence Banner ── */}
      <div class="ais-live-banner">
        <div class="ais-live-banner-left">
          <span class="ais-live-badge"><i class="fas fa-circle"></i> LIVE</span>
          <span class="ais-live-title"><i class="fas fa-brain"></i> AI Priority Actions — 4 items require your attention today</span>
        </div>
        <button class="ais-live-refresh" onclick="refreshAIInsights()"><i class="fas fa-sync-alt"></i> Refresh</button>
      </div>
      <div class="ais-live-actions">
        <div class="ais-live-item urgent">
          <div class="ais-live-icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="ais-live-body">
            <div class="ais-live-action-title">Urgent — Patricia Nguyen UL Policy</div>
            <div class="ais-live-action-sub">2 consecutive under-funded quarters detected · $3,200 premium gap · Lapse risk: HIGH</div>
          </div>
          <button class="ais-live-btn" onclick="sendContextMessage('AI analysis for Patricia Nguyen UL policy underfunding')">Act Now</button>
        </div>
        <div class="ais-live-item high">
          <div class="ais-live-icon"><i class="fas fa-bell"></i></div>
          <div class="ais-live-body">
            <div class="ais-live-action-title">High — Linda Morrison UMA Opportunity</div>
            <div class="ais-live-action-sub">$280K+ AUM consolidation identified · $2,800/yr recurring fee · Schedule proposal</div>
          </div>
          <button class="ais-live-btn" onclick="sendContextMessage('Investment proposal for Linda Morrison UMA opportunity')">Schedule</button>
        </div>
        <div class="ais-live-item high">
          <div class="ais-live-icon"><i class="fas fa-clipboard-check"></i></div>
          <div class="ais-live-body">
            <div class="ais-live-action-title">High — CLM-2026-0041 Document Gap</div>
            <div class="ais-live-action-sub">Robert Chen estate claim · Missing identity docs from Susan Chen · Follow up required</div>
          </div>
          <button class="ais-live-btn" onclick="sendContextMessage('Claims follow up for CLM-2026-0041 Robert Chen')">Follow Up</button>
        </div>
        <div class="ais-live-item normal">
          <div class="ais-live-icon"><i class="fas fa-calendar-check"></i></div>
          <div class="ais-live-body">
            <div class="ais-live-action-title">Opportunity — Sandra Williams Renewal Window</div>
            <div class="ais-live-action-sub">Term-to-perm conversion closing Sept 2026 · $2,800/yr at risk · Start conversation now</div>
          </div>
          <button class="ais-live-btn" onclick="sendContextMessage('Renewal strategy for Sandra Williams term conversion')">Prepare</button>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div class="ais-toolbar">
        <div class="ais-toolbar-left">
          <span class="ais-toolbar-label"><i class="fas fa-filter"></i> Domain:</span>
          <div class="ais-domain-filters" id="aisDomainFilters">
            <button class="ais-filter-btn active" onclick="filterAIDomain('all',this)">All</button>
            <button class="ais-filter-btn" onclick="filterAIDomain('underwriting',this)">Underwriting</button>
            <button class="ais-filter-btn" onclick="filterAIDomain('retention',this)">Retention</button>
            <button class="ais-filter-btn" onclick="filterAIDomain('claims',this)">Claims</button>
            <button class="ais-filter-btn" onclick="filterAIDomain('alerts',this)">Alerts</button>
            <button class="ais-filter-btn" onclick="filterAIDomain('investment',this)">Investment</button>
            <button class="ais-filter-btn" onclick="filterAIDomain('meetings',this)">Meetings</button>
          </div>
        </div>
        <div class="ais-toolbar-right">
          <span class="ais-toolbar-timestamp"><i class="fas fa-clock"></i> Last synced: Apr 15, 2026 · 9:42 AM</span>
          <button class="btn btn-outline ais-btn-sm" onclick="openAIScoreDetail('underwriting')"><i class="fas fa-chart-bar"></i> Deep Dive</button>
          <button class="btn btn-outline ais-btn-sm" onclick="sendContextMessage('AI domain improvement recommendations across all domains')"><i class="fas fa-magic"></i> Ask AI</button>
        </div>
      </div>

      {/* ── Overall AI Score ── */}
      <div class="ais-overall-row">
        <div class="ais-overall-card">
          <div class="ais-overall-inner">
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
              <p>Your AI systems are at <strong>87/100</strong> — <span class="ais-trend-up">↑ 12 pts vs. Q4 2025</span>. Six domains active. Key gains: underwriting STP (+18%), retention (+23%), claims (+31%).</p>
              <div class="ais-overall-chips">
                <span class="ais-chip green"><i class="fas fa-check-circle"></i> Underwriting: Excellent</span>
                <span class="ais-chip green"><i class="fas fa-check-circle"></i> Retention AI: Strong</span>
                <span class="ais-chip amber"><i class="fas fa-exclamation-circle"></i> Investment AI: Growing</span>
                <span class="ais-chip green"><i class="fas fa-check-circle"></i> Claims AI: Strong</span>
                <span class="ais-chip green"><i class="fas fa-check-circle"></i> Alerts: Excellent</span>
                <span class="ais-chip green"><i class="fas fa-check-circle"></i> Meeting AI: Strong</span>
              </div>
            </div>
          </div>
          <div class="ais-overall-benchmarks">
            <div class="ais-bench-row">
              <span class="ais-bench-lbl">NYL Top Agent Avg</span>
              <div class="ais-bench-bar-wrap"><div class="ais-bench-bar" style="width:74%"></div></div>
              <span class="ais-bench-val">74 / 100</span>
            </div>
            <div class="ais-bench-row">
              <span class="ais-bench-lbl">Your Score</span>
              <div class="ais-bench-bar-wrap"><div class="ais-bench-bar your-bench" style="width:87%"></div></div>
              <span class="ais-bench-val ais-trend-up">87 / 100 ↑</span>
            </div>
            <div class="ais-bench-row">
              <span class="ais-bench-lbl">Q2 2026 Target</span>
              <div class="ais-bench-bar-wrap"><div class="ais-bench-bar target-bench" style="width:92%"></div></div>
              <span class="ais-bench-val" style="color:#94a3b8">92 / 100</span>
            </div>
          </div>
        </div>
        <div class="ais-score-trend-card">
          <div class="ais-score-trend-header">
            <span class="ais-score-trend-title"><i class="fas fa-chart-line"></i> AI Score Trend — 9 Months</span>
            <span class="ais-trend-up" style="font-size:11px">+35 pts since Aug 2025</span>
          </div>
          <div class="ais-chart-wrap">
            <canvas id="aisOverallTrendChart"></canvas>
          </div>
        </div>
      </div>

      {/* ── Domain Scorecard Grid ── */}
      <div class="ais-domain-grid" id="aisDomainGrid">

        {/* Insurance + Underwriting */}
        <div class="ais-domain-card ais-ins ais-card-clickable" data-domain="underwriting" onclick="openAIScoreDetail('underwriting')" title="View Underwriting AI detail">
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
          <div class="ais-domain-footer"><button class="btn-ais-drill" onclick="event.stopPropagation();openAIScoreDetail('underwriting')"><i class="fas fa-chart-bar"></i> View Trend &amp; Actions</button></div>
        </div>

        {/* Retention AI */}
        <div class="ais-domain-card ais-ret-card ais-card-clickable" data-domain="retention" onclick="openAIScoreDetail('retention')" title="View Retention AI detail">
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
          <div class="ais-domain-footer"><button class="btn-ais-drill" onclick="event.stopPropagation();openAIScoreDetail('retention')"><i class="fas fa-chart-bar"></i> View Trend &amp; Actions</button></div>
        </div>

        {/* Claims AI */}
        <div class="ais-domain-card ais-clm ais-card-clickable" data-domain="claims" onclick="openAIScoreDetail('claims')" title="View Claims AI detail">
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
          <div class="ais-domain-footer"><button class="btn-ais-drill" onclick="event.stopPropagation();openAIScoreDetail('claims')"><i class="fas fa-chart-bar"></i> View Trend &amp; Actions</button></div>
        </div>

        {/* Proactive AI Alerts */}
        <div class="ais-domain-card ais-alert ais-card-clickable" data-domain="alerts" onclick="openAIScoreDetail('alerts')" title="View Alert Engine detail">
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
          <div class="ais-domain-footer"><button class="btn-ais-drill" onclick="event.stopPropagation();openAIScoreDetail('alerts')"><i class="fas fa-chart-bar"></i> View Trend &amp; Actions</button></div>
        </div>

        {/* Investment AI */}
        <div class="ais-domain-card ais-inv ais-card-clickable" data-domain="investment" onclick="openAIScoreDetail('investment')" title="View Investment AI detail">
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
          <div class="ais-domain-footer"><button class="btn-ais-drill" onclick="event.stopPropagation();openAIScoreDetail('investment')"><i class="fas fa-chart-bar"></i> View Trend &amp; Actions</button></div>
        </div>

        {/* Meeting AI */}
        <div class="ais-domain-card ais-mtg ais-card-clickable" data-domain="meetings" onclick="openAIScoreDetail('meetings')" title="View Meeting Intelligence detail">
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
          <div class="ais-domain-footer"><button class="btn-ais-drill" onclick="event.stopPropagation();openAIScoreDetail('meetings')"><i class="fas fa-chart-bar"></i> View Trend &amp; Actions</button></div>
        </div>

      </div>

      {/* ── AI Activity Feed + Recommendations ── */}
      <div class="ais-bottom-row">

        {/* Activity Feed */}
        <div class="ais-activity-feed-card">
          <div class="ais-section-header">
            <span class="ais-section-title-sm"><i class="fas fa-stream"></i> Recent AI Activity</span>
            <span class="ais-activity-count">12 events today</span>
          </div>
          <div class="ais-activity-list">
            <div class="ais-activity-item">
              <div class="ais-activity-dot blue"></div>
              <div class="ais-activity-body">
                <div class="ais-activity-text"><strong>Underwriting STP</strong> — Robert Chen application approved in 3.8 hrs</div>
                <div class="ais-activity-time">Today, 8:14 AM</div>
              </div>
              <span class="ais-activity-tag ins">Insurance</span>
            </div>
            <div class="ais-activity-item">
              <div class="ais-activity-dot amber"></div>
              <div class="ais-activity-body">
                <div class="ais-activity-text"><strong>Lapse Alert</strong> — Patricia Nguyen flagged HIGH risk · 2nd consecutive quarter underfunded</div>
                <div class="ais-activity-time">Today, 7:52 AM</div>
              </div>
              <span class="ais-activity-tag ret">Retention</span>
            </div>
            <div class="ais-activity-item">
              <div class="ais-activity-dot green"></div>
              <div class="ais-activity-body">
                <div class="ais-activity-text"><strong>IDP Extraction</strong> — 4 docs processed from CLM-2026-0041, 97.3% accuracy</div>
                <div class="ais-activity-time">Today, 7:31 AM</div>
              </div>
              <span class="ais-activity-tag clm">Claims</span>
            </div>
            <div class="ais-activity-item">
              <div class="ais-activity-dot purple"></div>
              <div class="ais-activity-body">
                <div class="ais-activity-text"><strong>Portfolio Gap</strong> — Linda Morrison UMA opportunity $280K identified</div>
                <div class="ais-activity-time">Yesterday, 4:05 PM</div>
              </div>
              <span class="ais-activity-tag inv">Investment</span>
            </div>
            <div class="ais-activity-item">
              <div class="ais-activity-dot teal"></div>
              <div class="ais-activity-body">
                <div class="ais-activity-text"><strong>Meeting Brief</strong> — Auto-generated for Kevin Park (Apr 15, 10:00 AM)</div>
                <div class="ais-activity-time">Yesterday, 3:30 PM</div>
              </div>
              <span class="ais-activity-tag mtg">Meeting</span>
            </div>
            <div class="ais-activity-item">
              <div class="ais-activity-dot amber"></div>
              <div class="ais-activity-body">
                <div class="ais-activity-text"><strong>Renewal Alert</strong> — Sandra Williams term policy renewal window · 5 months remaining</div>
                <div class="ais-activity-time">Yesterday, 11:18 AM</div>
              </div>
              <span class="ais-activity-tag ins">Insurance</span>
            </div>
          </div>
        </div>

        {/* AI Recommendations Panel */}
        <div class="ais-reco-card">
          <div class="ais-section-header">
            <span class="ais-section-title-sm"><i class="fas fa-magic"></i> AI-Recommended Actions</span>
            <span class="ais-reco-count">9 open</span>
          </div>
          <div class="ais-reco-list">
            <div class="ais-reco-item">
              <div class="ais-reco-priority urgent">URGENT</div>
              <div class="ais-reco-body">
                <div class="ais-reco-title">Call Patricia Nguyen — Premium Gap</div>
                <div class="ais-reco-sub">UL policy · 2 underfunded quarters · Est. $3,200 catch-up</div>
              </div>
              <button class="ais-reco-btn" onclick="sendContextMessage('Retention outreach for Patricia Nguyen UL policy')"><i class="fas fa-phone"></i></button>
            </div>
            <div class="ais-reco-item">
              <div class="ais-reco-priority high">HIGH</div>
              <div class="ais-reco-body">
                <div class="ais-reco-title">Schedule UMA Proposal — Linda Morrison</div>
                <div class="ais-reco-sub">$280K consolidation · $2,800/yr recurring fee opportunity</div>
              </div>
              <button class="ais-reco-btn" onclick="sendContextMessage('UMA proposal preparation for Linda Morrison')"><i class="fas fa-calendar-plus"></i></button>
            </div>
            <div class="ais-reco-item">
              <div class="ais-reco-priority high">HIGH</div>
              <div class="ais-reco-body">
                <div class="ais-reco-title">Follow Up — CLM-2026-0041 Docs</div>
                <div class="ais-reco-sub">Robert Chen estate · Missing ID docs from Susan Chen</div>
              </div>
              <button class="ais-reco-btn" onclick="sendContextMessage('Claims document follow up CLM-2026-0041')"><i class="fas fa-file-alt"></i></button>
            </div>
            <div class="ais-reco-item">
              <div class="ais-reco-priority med">MED</div>
              <div class="ais-reco-body">
                <div class="ais-reco-title">Start Sandra Williams Renewal Conversation</div>
                <div class="ais-reco-sub">Term-to-perm · Window closes Sept 2026 · $2,800/yr at risk</div>
              </div>
              <button class="ais-reco-btn" onclick="sendContextMessage('Renewal strategy for Sandra Williams')"><i class="fas fa-envelope"></i></button>
            </div>
            <div class="ais-reco-item">
              <div class="ais-reco-priority med">MED</div>
              <div class="ais-reco-body">
                <div class="ais-reco-title">Review 12 Clients in 60-90 Day Lapse Window</div>
                <div class="ais-reco-sub">AI-detected risk cohort · Avg $3,400 annual premium each</div>
              </div>
              <button class="ais-reco-btn" onclick="sendContextMessage('Lapse risk client cohort review 60-90 day window')"><i class="fas fa-list-check"></i></button>
            </div>
            <div class="ais-reco-item">
              <div class="ais-reco-priority low">LOW</div>
              <div class="ais-reco-body">
                <div class="ais-reco-title">David Thompson — 90+ Day No Touchpoint</div>
                <div class="ais-reco-sub">Advisory client · Schedule proactive check-in call</div>
              </div>
              <button class="ais-reco-btn" onclick="sendContextMessage('Proactive outreach David Thompson 90 day check-in')"><i class="fas fa-user-check"></i></button>
            </div>
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
        <h3 class="ais-section-title"><i class="fas fa-road"></i> AI Feature Adoption — NOVA Analytics Agent 360</h3>
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

      {/* ── Sticky Action Bar ── */}
      <div class="ais-action-bar">
        <div class="ais-action-bar-left">
          <i class="fas fa-robot" style="color:#1d4ed8"></i>
          <span class="ais-action-info">AI Scorecard · Q1 2026 · Last updated Apr 15, 9:42 AM</span>
        </div>
        <div class="ais-action-bar-right">
          <button class="btn btn-outline ais-btn-sm" onclick="openAIFeedback()"><i class="fas fa-thumbs-up"></i> Rate AI</button>
          <button class="btn btn-outline ais-btn-sm" onclick="shareAIScorecard()"><i class="fas fa-share-alt"></i> Share</button>
          <button class="btn btn-primary ais-btn-sm" onclick="exportAIScorecard()"><i class="fas fa-file-pdf"></i> Export PDF</button>
        </div>
      </div>

    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   SETTINGS PAGE
   ════════════════════════════════════════════════════════════════ */
function SettingsPage() {
  return (
    <div class="settings-page">

      {/* ── Page Header ── */}
      <div class="settings-header">
        <div class="settings-header-left">
          <div class="settings-header-icon"><i class="fas fa-cog"></i></div>
          <div>
            <h2 class="settings-header-title">Settings</h2>
            <p class="settings-header-sub">Manage your account, preferences, and integrations</p>
          </div>
        </div>
        <div class="settings-header-actions">
          <button class="btn btn-outline" onclick="settingsDiscardChanges()"><i class="fas fa-undo"></i> Discard</button>
          <button class="btn btn-primary" onclick="settingsSaveAll()"><i class="fas fa-save"></i> Save Changes</button>
        </div>
      </div>

      {/* ── Layout: Tabs + Content ── */}
      <div class="settings-layout">

        {/* Vertical tab nav */}
        <nav class="settings-nav" id="settings-nav">
          <button class="stab active" data-tab="profile" onclick="switchSettingsTab('profile',this)">
            <i class="fas fa-user-circle"></i> Profile
          </button>
          <button class="stab" data-tab="notifications" onclick="switchSettingsTab('notifications',this)">
            <i class="fas fa-bell"></i> Notifications
          </button>
          <button class="stab" data-tab="ai" onclick="switchSettingsTab('ai',this)">
            <i class="fas fa-robot"></i> AI Preferences
          </button>
          <button class="stab" data-tab="integrations" onclick="switchSettingsTab('integrations',this)">
            <i class="fas fa-plug"></i> Integrations
          </button>
          <button class="stab" data-tab="security" onclick="switchSettingsTab('security',this)">
            <i class="fas fa-shield-alt"></i> Security
          </button>
          <button class="stab" data-tab="appearance" onclick="switchSettingsTab('appearance',this)">
            <i class="fas fa-palette"></i> Appearance
          </button>
        </nav>

        {/* ── Tab Panels ── */}
        <div class="settings-content" id="settings-content">

          {/* ─── PROFILE ─── */}
          <div class="stab-panel active" id="stab-profile">
            <div class="settings-section-title"><i class="fas fa-user-circle"></i> Profile & Contact</div>

            <div class="settings-avatar-row">
              <div class="settings-avatar">SR</div>
              <div>
                <div class="settings-avatar-name">Sridhar Ramalingam</div>
                <div class="settings-avatar-role">Senior Financial Advisor · Manhattan, NY</div>
                <button class="btn btn-outline stn-sm" onclick="showToast('Photo upload coming soon','info')"><i class="fas fa-camera"></i> Change Photo</button>
              </div>
            </div>

            <div class="settings-grid-2">
              <div class="stg-field">
                <label>First Name</label>
                <input type="text" class="stg-input" value="Sridhar" id="set-first-name"/>
              </div>
              <div class="stg-field">
                <label>Last Name</label>
                <input type="text" class="stg-input" value="Ramalingam" id="set-last-name"/>
              </div>
              <div class="stg-field">
                <label>Email Address</label>
                <input type="email" class="stg-input" value="sridhar.ramalingam@nyl.com" id="set-email"/>
              </div>
              <div class="stg-field">
                <label>Phone</label>
                <input type="tel" class="stg-input" value="+1 (212) 555-0193" id="set-phone"/>
              </div>
              <div class="stg-field">
                <label>Office Location</label>
                <input type="text" class="stg-input" value="Manhattan · 51 Madison Ave" id="set-office"/>
              </div>
              <div class="stg-field">
                <label>Agent ID</label>
                <input type="text" class="stg-input" value="NYL-SR-2019-0047" readonly style="background:#f1f5f9;color:#64748b;cursor:not-allowed"/>
              </div>
              <div class="stg-field stg-full">
                <label>Bio / Professional Summary</label>
                <textarea class="stg-input stg-textarea" id="set-bio">Senior Financial Advisor with 12+ years at New York Life. Specializing in life insurance, retirement planning, and investment advisory for high-net-worth clients in the Greater New York area.</textarea>
              </div>
            </div>

            <div class="settings-section-title" style="margin-top:24px"><i class="fas fa-certificate"></i> Licenses &amp; Credentials</div>
            <div class="stg-license-list">
              <div class="stg-license-row">
                <div class="stg-lic-badge active">Active</div>
                <div class="stg-lic-info"><strong>Series 6</strong> — Investment Company &amp; Variable Contracts<span class="stg-lic-exp">Exp: Mar 2027</span></div>
              </div>
              <div class="stg-license-row">
                <div class="stg-lic-badge active">Active</div>
                <div class="stg-lic-info"><strong>Series 63</strong> — Uniform Securities Agent State Law<span class="stg-lic-exp">Exp: Mar 2027</span></div>
              </div>
              <div class="stg-license-row">
                <div class="stg-lic-badge active">Active</div>
                <div class="stg-lic-info"><strong>NYS Life &amp; Health License</strong> — NY-LH-0047392<span class="stg-lic-exp">Exp: Jun 2026</span></div>
              </div>
              <div class="stg-license-row">
                <div class="stg-lic-badge warn">Renew Soon</div>
                <div class="stg-lic-info"><strong>CFP® Certification</strong> — Certified Financial Planner<span class="stg-lic-exp">Exp: Aug 2025</span></div>
              </div>
            </div>
          </div>

          {/* ─── NOTIFICATIONS ─── */}
          <div class="stab-panel" id="stab-notifications">
            <div class="settings-section-title"><i class="fas fa-bell"></i> Notification Preferences</div>
            <p class="stg-sub">Choose how and when you receive updates from NOVA Analytics Agent 360.</p>

            <div class="stg-notif-group">
              <div class="stg-notif-header">Email Notifications</div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Lapse Risk Alerts</strong><span>When AI detects a client at high lapse risk</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="nt-lapse" checked/><label for="nt-lapse"></label></div>
              </div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Policy Renewal Reminders</strong><span>30 / 60 / 90 days before expiry</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="nt-renewal" checked/><label for="nt-renewal"></label></div>
              </div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Claim Status Updates</strong><span>When a claim moves to a new stage</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="nt-claims" checked/><label for="nt-claims"></label></div>
              </div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Weekly AI Performance Report</strong><span>Summary of AI score trends every Monday</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="nt-weekly"/><label for="nt-weekly"></label></div>
              </div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>New Client Assignments</strong><span>When a client is added to your book</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="nt-newclient" checked/><label for="nt-newclient"></label></div>
              </div>
            </div>

            <div class="stg-notif-group" style="margin-top:20px">
              <div class="stg-notif-header">In-App Notifications</div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>AI Proactive Alerts</strong><span>Obituary detections, birthday alerts, NBA signals</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="nt-ai-alerts" checked/><label for="nt-ai-alerts"></label></div>
              </div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Deal Stage Changes</strong><span>When a deal moves through the pipeline</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="nt-deals" checked/><label for="nt-deals"></label></div>
              </div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Calendar Event Reminders</strong><span>15 min before scheduled meetings</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="nt-cal" checked/><label for="nt-cal"></label></div>
              </div>
            </div>

            <div class="stg-notif-group" style="margin-top:20px">
              <div class="stg-notif-header">Quiet Hours</div>
              <div class="settings-grid-2">
                <div class="stg-field">
                  <label>Do Not Disturb From</label>
                  <input type="time" class="stg-input" value="20:00"/>
                </div>
                <div class="stg-field">
                  <label>Do Not Disturb Until</label>
                  <input type="time" class="stg-input" value="08:00"/>
                </div>
              </div>
            </div>
          </div>

          {/* ─── AI PREFERENCES ─── */}
          <div class="stab-panel" id="stab-ai">
            <div class="settings-section-title"><i class="fas fa-robot"></i> AI Preferences</div>
            <p class="stg-sub">Control how AI Agents behave and which insights are surfaced for you.</p>

            <div class="stg-notif-group">
              <div class="stg-notif-header">AI Features</div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Proactive Alert Engine</strong><span>Life-event detection, obituaries, NBA signals</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="ai-alerts" checked/><label for="ai-alerts"></label></div>
              </div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Pre-Meeting AI Brief</strong><span>Auto-generate client brief 1 hr before meetings</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="ai-brief" checked/><label for="ai-brief"></label></div>
              </div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Post-Meeting Summary</strong><span>Auto-draft follow-up notes after calendar events</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="ai-summary" checked/><label for="ai-summary"></label></div>
              </div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Underwriting STP Engine</strong><span>Straight-through processing for low-risk applications</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="ai-stp" checked/><label for="ai-stp"></label></div>
              </div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Cross-Sell Recommendations</strong><span>AI surfaces portfolio gap opportunities per client</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="ai-xsell" checked/><label for="ai-xsell"></label></div>
              </div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Lapse Prediction Model</strong><span>67-day advance warning for at-risk clients</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="ai-lapse" checked/><label for="ai-lapse"></label></div>
              </div>
            </div>

            <div class="stg-notif-group" style="margin-top:20px">
              <div class="stg-notif-header">AI Response Style</div>
              <div class="stg-radio-group">
                <label class="stg-radio"><input type="radio" name="ai-style" value="concise" checked/> <span><strong>Concise</strong> — Short summaries and bullet points</span></label>
                <label class="stg-radio"><input type="radio" name="ai-style" value="detailed"/> <span><strong>Detailed</strong> — Full explanations with supporting data</span></label>
                <label class="stg-radio"><input type="radio" name="ai-style" value="executive"/> <span><strong>Executive</strong> — Key decision points only, no filler</span></label>
              </div>
            </div>

            <div class="stg-notif-group" style="margin-top:20px">
              <div class="stg-notif-header">AI Insight Frequency</div>
              <div class="settings-grid-2">
                <div class="stg-field">
                  <label>Alert Sensitivity</label>
                  <select class="stg-input">
                    <option>High — Surface all signals</option>
                    <option selected>Medium — Balanced</option>
                    <option>Low — Critical only</option>
                  </select>
                </div>
                <div class="stg-field">
                  <label>Report Auto-Refresh</label>
                  <select class="stg-input">
                    <option>Every hour</option>
                    <option selected>Every 4 hours</option>
                    <option>Daily</option>
                    <option>Manual only</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ─── INTEGRATIONS ─── */}
          <div class="stab-panel" id="stab-integrations">
            <div class="settings-section-title"><i class="fas fa-plug"></i> Integrations &amp; Connected Apps</div>
            <p class="stg-sub">Manage connections to external platforms and data sources.</p>

            <div class="stg-integration-list">
              <div class="stg-int-row connected">
                <div class="stg-int-icon" style="background:#e0f2fe;color:#0369a1"><i class="fas fa-envelope"></i></div>
                <div class="stg-int-info"><strong>Microsoft Outlook</strong><span>Calendar sync, email threading, meeting invites</span></div>
                <div class="stg-int-status connected">Connected</div>
                <button class="btn btn-outline stn-sm" onclick="showToast('Outlook settings opened','info')">Manage</button>
              </div>
              <div class="stg-int-row connected">
                <div class="stg-int-icon" style="background:#dcfce7;color:#15803d"><i class="fas fa-file-alt"></i></div>
                <div class="stg-int-info"><strong>DocuSign</strong><span>E-signature for applications and client agreements</span></div>
                <div class="stg-int-status connected">Connected</div>
                <button class="btn btn-outline stn-sm" onclick="showToast('DocuSign settings opened','info')">Manage</button>
              </div>
              <div class="stg-int-row connected">
                <div class="stg-int-icon" style="background:#fef3c7;color:#d97706"><i class="fas fa-star"></i></div>
                <div class="stg-int-info"><strong>Salesforce CRM</strong><span>Bi-directional client and pipeline sync</span></div>
                <div class="stg-int-status connected">Connected</div>
                <button class="btn btn-outline stn-sm" onclick="showToast('Salesforce settings opened','info')">Manage</button>
              </div>
              <div class="stg-int-row">
                <div class="stg-int-icon" style="background:#f5f3ff;color:#6d28d9"><i class="fas fa-video"></i></div>
                <div class="stg-int-info"><strong>Zoom</strong><span>Auto-generate meeting links for client appointments</span></div>
                <div class="stg-int-status">Not connected</div>
                <button class="btn btn-primary stn-sm" onclick="showToast('Zoom OAuth flow starting…','info')"><i class="fas fa-plus"></i> Connect</button>
              </div>
              <div class="stg-int-row">
                <div class="stg-int-icon" style="background:#fff1f2;color:#e11d48"><i class="fab fa-google"></i></div>
                <div class="stg-int-info"><strong>Google Workspace</strong><span>Gmail, Google Calendar, Google Drive sync</span></div>
                <div class="stg-int-status">Not connected</div>
                <button class="btn btn-primary stn-sm" onclick="showToast('Google OAuth flow starting…','info')"><i class="fas fa-plus"></i> Connect</button>
              </div>
              <div class="stg-int-row">
                <div class="stg-int-icon" style="background:#eff6ff;color:#1d4ed8"><i class="fab fa-linkedin"></i></div>
                <div class="stg-int-info"><strong>LinkedIn Sales Navigator</strong><span>Prospect intelligence and social selling insights</span></div>
                <div class="stg-int-status">Not connected</div>
                <button class="btn btn-primary stn-sm" onclick="showToast('LinkedIn OAuth flow starting…','info')"><i class="fas fa-plus"></i> Connect</button>
              </div>
            </div>

            <div class="settings-section-title" style="margin-top:24px"><i class="fas fa-key"></i> API &amp; Webhooks</div>
            <div class="stg-field">
              <label>Personal API Token</label>
              <div class="stg-api-row">
                <input type="password" class="stg-input" value="nyl_sk_live_•••••••••••••••••" id="set-api-token" readonly style="flex:1;font-family:monospace"/>
                <button class="btn btn-outline stn-sm" onclick="settingsToggleToken()"><i class="fas fa-eye"></i></button>
                <button class="btn btn-outline stn-sm" onclick="settingsRegenToken()"><i class="fas fa-sync"></i> Regen</button>
              </div>
            </div>
          </div>

          {/* ─── SECURITY ─── */}
          <div class="stab-panel" id="stab-security">
            <div class="settings-section-title"><i class="fas fa-shield-alt"></i> Security &amp; Access</div>

            <div class="stg-notif-group">
              <div class="stg-notif-header">Authentication</div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Two-Factor Authentication (2FA)</strong><span>Require TOTP code on every login</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="sec-2fa" checked/><label for="sec-2fa"></label></div>
              </div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Biometric Login</strong><span>Use Face ID or fingerprint where available</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="sec-bio"/><label for="sec-bio"></label></div>
              </div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Session Timeout</strong><span>Auto-lock after 30 minutes of inactivity</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="sec-timeout" checked/><label for="sec-timeout"></label></div>
              </div>
            </div>

            <div class="stg-notif-group" style="margin-top:20px">
              <div class="stg-notif-header">Change Password</div>
              <div class="settings-grid-2">
                <div class="stg-field stg-full">
                  <label>Current Password</label>
                  <input type="password" class="stg-input" placeholder="Enter current password"/>
                </div>
                <div class="stg-field">
                  <label>New Password</label>
                  <input type="password" class="stg-input" placeholder="Min 12 characters"/>
                </div>
                <div class="stg-field">
                  <label>Confirm New Password</label>
                  <input type="password" class="stg-input" placeholder="Repeat new password"/>
                </div>
              </div>
              <button class="btn btn-primary stn-sm" style="margin-top:12px" onclick="showToast('Password updated successfully','success')"><i class="fas fa-lock"></i> Update Password</button>
            </div>

            <div class="stg-notif-group" style="margin-top:20px">
              <div class="stg-notif-header">Active Sessions</div>
              <div class="stg-session-row">
                <i class="fas fa-laptop" style="color:#003087"></i>
                <div class="stg-session-info"><strong>MacBook Pro · Chrome 124</strong><span class="stg-session-loc">New York, NY · Current session</span></div>
                <span class="stg-session-badge current">Current</span>
              </div>
              <div class="stg-session-row">
                <i class="fas fa-mobile-alt" style="color:#64748b"></i>
                <div class="stg-session-info"><strong>iPhone 15 · Safari</strong><span class="stg-session-loc">New York, NY · 2 hrs ago</span></div>
                <button class="btn btn-outline stn-sm" onclick="showToast('Session revoked','success')">Revoke</button>
              </div>
              <div class="stg-session-row">
                <i class="fas fa-desktop" style="color:#64748b"></i>
                <div class="stg-session-info"><strong>Windows PC · Edge 122</strong><span class="stg-session-loc">White Plains, NY · Yesterday</span></div>
                <button class="btn btn-outline stn-sm" onclick="showToast('Session revoked','success')">Revoke</button>
              </div>
            </div>
          </div>

          {/* ─── APPEARANCE ─── */}
          <div class="stab-panel" id="stab-appearance">
            <div class="settings-section-title"><i class="fas fa-palette"></i> Appearance</div>
            <p class="stg-sub">Customize the look and feel of NOVA Analytics Agent 360.</p>

            <div class="stg-notif-group">
              <div class="stg-notif-header">Theme</div>
              <div class="stg-theme-grid">
                <div class="stg-theme-card active" onclick="settingsSetTheme('light',this)">
                  <div class="stg-theme-preview light-preview"></div>
                  <span>Light</span>
                  <i class="fas fa-check stg-theme-check"></i>
                </div>
                <div class="stg-theme-card" onclick="settingsSetTheme('dark',this)">
                  <div class="stg-theme-preview dark-preview"></div>
                  <span>Dark</span>
                  <i class="fas fa-check stg-theme-check"></i>
                </div>
                <div class="stg-theme-card" onclick="settingsSetTheme('system',this)">
                  <div class="stg-theme-preview system-preview"></div>
                  <span>System</span>
                  <i class="fas fa-check stg-theme-check"></i>
                </div>
              </div>
            </div>

            <div class="stg-notif-group" style="margin-top:20px">
              <div class="stg-notif-header">Accent Color</div>
              <div class="stg-color-row">
                <button class="stg-color-btn active" style="background:#003087" title="NYL Navy" onclick="settingsSetAccent('#003087',this)"></button>
                <button class="stg-color-btn" style="background:#0ea5e9" title="Sky Blue" onclick="settingsSetAccent('#0ea5e9',this)"></button>
                <button class="stg-color-btn" style="background:#6d28d9" title="Violet" onclick="settingsSetAccent('#6d28d9',this)"></button>
                <button class="stg-color-btn" style="background:#059669" title="Emerald" onclick="settingsSetAccent('#059669',this)"></button>
                <button class="stg-color-btn" style="background:#dc2626" title="Red" onclick="settingsSetAccent('#dc2626',this)"></button>
                <button class="stg-color-btn" style="background:#d97706" title="Amber" onclick="settingsSetAccent('#d97706',this)"></button>
              </div>
            </div>

            <div class="stg-notif-group" style="margin-top:20px">
              <div class="stg-notif-header">Display</div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Compact Sidebar</strong><span>Collapse nav labels to icon-only mode</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="app-compact"/><label for="app-compact"></label></div>
              </div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Animations</strong><span>Page transitions and micro-animations</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="app-anim" checked/><label for="app-anim"></label></div>
              </div>
              <div class="stg-toggle-row">
                <div class="stg-toggle-info"><strong>Dense Tables</strong><span>Reduce row height in data tables</span></div>
                <div class="stg-toggle-wrap"><input type="checkbox" class="stg-toggle" id="app-dense"/><label for="app-dense"></label></div>
              </div>
              <div class="settings-grid-2" style="margin-top:12px">
                <div class="stg-field">
                  <label>Font Size</label>
                  <select class="stg-input" onchange="settingsFontSize(this.value)">
                    <option>Small (13px)</option>
                    <option selected>Medium (14px)</option>
                    <option>Large (16px)</option>
                  </select>
                </div>
                <div class="stg-field">
                  <label>Dashboard Default View</label>
                  <select class="stg-input">
                    <option selected>Full Dashboard</option>
                    <option>AI Insights First</option>
                    <option>Client List</option>
                    <option>Sales Pipeline</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>{/* /settings-content */}
      </div>{/* /settings-layout */}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   HELP PAGE
   ════════════════════════════════════════════════════════════════ */
function HelpPage() {
  return (
    <div class="help-page">

      {/* ── Hero Search ── */}
      <div class="help-hero">
        <div class="help-hero-icon"><i class="fas fa-life-ring"></i></div>
        <h2 class="help-hero-title">How can we help you?</h2>
        <p class="help-hero-sub">Search our knowledge base or browse topics below</p>
        <div class="help-search-bar">
          <i class="fas fa-search help-search-icon"></i>
          <input type="text" class="help-search-input" id="help-search-input" placeholder="Search articles, guides, shortcuts…" oninput="helpSearch(this.value)" onkeydown="if(event.key==='Enter')helpSearch(this.value)"/>
          <button class="help-search-btn" onclick="helpSearch(document.getElementById('help-search-input').value)">Search</button>
        </div>
        <div class="help-search-results" id="help-search-results" style="display:none"></div>
      </div>

      {/* ── Quick Action Cards ── */}
      <div class="help-quick-grid">
        <div class="help-quick-card" onclick="helpOpenArticle('getting-started')">
          <div class="help-quick-icon" style="background:#eff6ff;color:#003087"><i class="fas fa-rocket"></i></div>
          <div class="help-quick-label">Getting Started</div>
          <div class="help-quick-desc">New to NOVA Analytics Agent 360? Start here</div>
        </div>
        <div class="help-quick-card" onclick="helpOpenArticle('ai-guide')">
          <div class="help-quick-icon" style="background:#f5f3ff;color:#6d28d9"><i class="fas fa-robot"></i></div>
          <div class="help-quick-label">AI Features Guide</div>
          <div class="help-quick-desc">Learn how to use AI Agents and Insights</div>
        </div>
        <div class="help-quick-card" onclick="helpOpenArticle('keyboard')">
          <div class="help-quick-icon" style="background:#dcfce7;color:#15803d"><i class="fas fa-keyboard"></i></div>
          <div class="help-quick-label">Keyboard Shortcuts</div>
          <div class="help-quick-desc">Speed up your workflow with shortcuts</div>
        </div>
        <div class="help-quick-card" onclick="helpOpenArticle('video-tutorials')">
          <div class="help-quick-icon" style="background:#fef3c7;color:#d97706"><i class="fas fa-play-circle"></i></div>
          <div class="help-quick-label">Video Tutorials</div>
          <div class="help-quick-desc">Step-by-step walkthroughs</div>
        </div>
        <div class="help-quick-card" onclick="helpOpenArticle('release-notes')">
          <div class="help-quick-icon" style="background:#fff1f2;color:#e11d48"><i class="fas fa-star"></i></div>
          <div class="help-quick-label">What's New</div>
          <div class="help-quick-desc">Latest features and release notes</div>
        </div>
        <div class="help-quick-card" onclick="helpOpenTicket()">
          <div class="help-quick-icon" style="background:#f0fdf4;color:#059669"><i class="fas fa-headset"></i></div>
          <div class="help-quick-label">Contact Support</div>
          <div class="help-quick-desc">Open a ticket or live chat</div>
        </div>
      </div>

      {/* ── Main content: FAQ + Articles ── */}
      <div class="help-main-grid">

        {/* FAQ */}
        <div class="help-faq-col">
          <div class="help-section-title"><i class="fas fa-question-circle"></i> Frequently Asked Questions</div>

          <div class="help-faq-list" id="help-faq-list">
            <div class="help-faq-item" onclick="helpToggleFaq(this)">
              <div class="help-faq-q"><i class="fas fa-chevron-right help-faq-arrow"></i> How does the Lapse Prediction AI work?</div>
              <div class="help-faq-a">Our Retention Intelligence AI analyzes 47 behavioral signals — payment history, engagement frequency, policy age, and life events — to predict lapse risk up to 67 days in advance. Clients above the threshold appear in the Retention module with recommended outreach actions.</div>
            </div>
            <div class="help-faq-item" onclick="helpToggleFaq(this)">
              <div class="help-faq-q"><i class="fas fa-chevron-right help-faq-arrow"></i> What is the STP (Straight-Through Processing) rate?</div>
              <div class="help-faq-a">STP Rate measures the percentage of underwriting applications that AI approves automatically without manual review. A 73% STP rate means 73 out of every 100 applications are processed in under 4.2 hours with no human intervention, compared to the 8-day manual average.</div>
            </div>
            <div class="help-faq-item" onclick="helpToggleFaq(this)">
              <div class="help-faq-q"><i class="fas fa-chevron-right help-faq-arrow"></i> How do I add a new client?</div>
              <div class="help-faq-a">Navigate to <strong>Client Management</strong> and click the <strong>+ Add Client</strong> button in the top-right. Fill in the contact details, assign a risk profile, and link any existing policies. The AI will immediately begin building a profile and surface relevant cross-sell opportunities.</div>
            </div>
            <div class="help-faq-item" onclick="helpToggleFaq(this)">
              <div class="help-faq-q"><i class="fas fa-chevron-right help-faq-arrow"></i> Can I export reports to PDF or Excel?</div>
              <div class="help-faq-a">Yes. On any report page, click the <strong>Export PDF</strong> button in the top-right. For data exports, use the <strong>Share</strong> button which offers CSV and Excel formats. The AI Scorecard can also be exported as a branded PDF from the AI Insights page.</div>
            </div>
            <div class="help-faq-item" onclick="helpToggleFaq(this)">
              <div class="help-faq-q"><i class="fas fa-chevron-right help-faq-arrow"></i> What does the AI Score (0–100) represent?</div>
              <div class="help-faq-a">The AI Score is a composite index measuring AI utilization, accuracy, and ROI impact across six domains: Underwriting, Retention, Claims, Alerts, Investment, and Meetings. A score of 87 (your current score) places you in the top 15% of NYL advisors nationally. The score is updated daily.</div>
            </div>
            <div class="help-faq-item" onclick="helpToggleFaq(this)">
              <div class="help-faq-q"><i class="fas fa-chevron-right help-faq-arrow"></i> How do I use the Cmd+K search?</div>
              <div class="help-faq-a">Press <kbd>⌘K</kbd> (Mac) or <kbd>Ctrl+K</kbd> (Windows) to open the Spotlight Search from anywhere in the app. You can search clients by name, policies by number, deals by stage, or use natural language like "show me high-risk clients" or "open James Whitfield".</div>
            </div>
            <div class="help-faq-item" onclick="helpToggleFaq(this)">
              <div class="help-faq-q"><i class="fas fa-chevron-right help-faq-arrow"></i> How is my data protected?</div>
              <div class="help-faq-a">All data is encrypted at rest (AES-256) and in transit (TLS 1.3). NOVA Analytics Agent 360 is SOC 2 Type II certified and fully compliant with FINRA, SEC, and NAIC regulations. Client PII is never used to train external AI models. You can review active sessions and revoke access in Settings → Security.</div>
            </div>
          </div>
        </div>

        {/* Articles & Resources */}
        <div class="help-articles-col">
          <div class="help-section-title"><i class="fas fa-book-open"></i> Knowledge Base</div>

          <div class="help-article-group">
            <div class="help-article-group-title">📋 Guides &amp; How-Tos</div>
            <div class="help-article-row" onclick="helpOpenArticle('uw-guide')">
              <i class="fas fa-file-alt help-art-icon"></i>
              <div class="help-art-info"><strong>Underwriting Pipeline — Complete Guide</strong><span>STP rules, manual review triggers, APS workflow</span></div>
              <i class="fas fa-chevron-right help-art-chevron"></i>
            </div>
            <div class="help-article-row" onclick="helpOpenArticle('retention-guide')">
              <i class="fas fa-file-alt help-art-icon"></i>
              <div class="help-art-info"><strong>Retention Intelligence — Best Practices</strong><span>Acting on lapse risk alerts to maximize retention</span></div>
              <i class="fas fa-chevron-right help-art-chevron"></i>
            </div>
            <div class="help-article-row" onclick="helpOpenArticle('claims-guide')">
              <i class="fas fa-file-alt help-art-icon"></i>
              <div class="help-art-info"><strong>Claims Automation — IDP &amp; Triage</strong><span>Document processing, gap detection, escalation</span></div>
              <i class="fas fa-chevron-right help-art-chevron"></i>
            </div>
            <div class="help-article-row" onclick="helpOpenArticle('reports-guide')">
              <i class="fas fa-file-alt help-art-icon"></i>
              <div class="help-art-info"><strong>Reports &amp; Analytics — Data Glossary</strong><span>Every metric defined and explained</span></div>
              <i class="fas fa-chevron-right help-art-chevron"></i>
            </div>
          </div>

          <div class="help-article-group" style="margin-top:16px">
            <div class="help-article-group-title">⌨️ Keyboard Shortcuts</div>
            <div class="help-shortcuts-grid">
              <div class="help-shortcut-row"><kbd>G D</kbd><span>Go to Dashboard</span></div>
              <div class="help-shortcut-row"><kbd>G C</kbd><span>Go to Clients</span></div>
              <div class="help-shortcut-row"><kbd>G P</kbd><span>Go to Pipeline</span></div>
              <div class="help-shortcut-row"><kbd>G A</kbd><span>Go to AI Agents</span></div>
              <div class="help-shortcut-row"><kbd>⌘K</kbd><span>Spotlight Search</span></div>
              <div class="help-shortcut-row"><kbd>Esc</kbd><span>Close any modal</span></div>
              <div class="help-shortcut-row"><kbd>G R</kbd><span>Go to Reports</span></div>
              <div class="help-shortcut-row"><kbd>G I</kbd><span>Go to AI Insights</span></div>
            </div>
          </div>

          <div class="help-article-group" style="margin-top:16px">
            <div class="help-article-group-title">🔔 What's New — Q1 2026</div>
            <div class="help-release-list">
              <div class="help-release-row">
                <span class="help-release-tag new">New</span>
                <div class="help-release-info"><strong>AI Insights Dashboard</strong> — Full AI scorecard with 6 domain scores and trend charts</div>
              </div>
              <div class="help-release-row">
                <span class="help-release-tag new">New</span>
                <div class="help-release-info"><strong>View Trend &amp; Actions</strong> — Drill-down modals with 9-month score trends and prioritized actions</div>
              </div>
              <div class="help-release-row">
                <span class="help-release-tag improved">Improved</span>
                <div class="help-release-info"><strong>Underwriting STP Engine</strong> — 73% straight-through rate (up from 61% in Q4 2025)</div>
              </div>
              <div class="help-release-row">
                <span class="help-release-tag improved">Improved</span>
                <div class="help-release-info"><strong>Retention Intelligence</strong> — Lapse prediction now 67 days ahead (was 45 days)</div>
              </div>
              <div class="help-release-row">
                <span class="help-release-tag fixed">Fixed</span>
                <div class="help-release-info"><strong>Claims Triage</strong> — Document gap detection accuracy improved to 91%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contact Support Banner ── */}
      <div class="help-contact-banner">
        <div class="help-contact-left">
          <i class="fas fa-headset help-contact-icon"></i>
          <div>
            <div class="help-contact-title">Still need help?</div>
            <div class="help-contact-sub">Our support team is available Mon–Fri, 8 AM – 8 PM ET</div>
          </div>
        </div>
        <div class="help-contact-actions">
          <button class="btn btn-outline" onclick="helpOpenTicket()"><i class="fas fa-ticket-alt"></i> Open Ticket</button>
          <button class="btn btn-outline" onclick="showToast('Connecting to live chat…','info')"><i class="fas fa-comments"></i> Live Chat</button>
          <button class="btn btn-primary" onclick="showToast('Calling support: 1-800-NYL-HELP','info')"><i class="fas fa-phone"></i> Call Support</button>
        </div>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PHASE 1–2 · FNA DISCOVERY PAGE
   Financial Needs Analysis — structured discovery capture
   ═══════════════════════════════════════════════════════════ */
function FNADiscoveryPage() {
  return (
    <div class="page fna-page">

      {/* Header */}
      <div class="fna-header">
        <div class="fna-header-left">
          <div class="fna-header-icon"><i class="fas fa-clipboard-list"></i></div>
          <div>
            <h2 class="fna-title">FNA Discovery Center</h2>
            <p class="fna-sub">Financial Needs Analysis · structured fact-finding · AI-powered coverage gap calculation</p>
          </div>
        </div>
        <div class="fna-header-actions">
          <button class="btn btn-ai" onclick="openFNAAIAssist()"><i class="fas fa-robot"></i> AI Pre-fill from Notes</button>
          <button class="btn btn-primary" onclick="openNewFNA()"><i class="fas fa-plus"></i> New FNA</button>
        </div>
      </div>

      {/* AI Summary Bar */}
      <div class="fna-ai-bar">
        <div class="fna-ai-bar-icon"><i class="fas fa-brain"></i></div>
        <div class="fna-ai-bar-body">
          <span class="fna-ai-bar-label">AI Discovery Assistant · Analysing 3 in-progress FNAs</span>
          <span class="fna-ai-bar-text"><strong>Coverage gaps detected:</strong> Patricia Nguyen — $240K income gap · Alex Rivera — no DI coverage · Nancy Foster — no LTC rider</span>
        </div>
        <div class="fna-ai-bar-kpis">
          <div class="fna-ai-kpi"><span class="fna-ai-kpi-val">3</span><span class="fna-ai-kpi-lbl">In Progress</span></div>
          <div class="fna-ai-kpi hi"><span class="fna-ai-kpi-val">5</span><span class="fna-ai-kpi-lbl">Gaps Found</span></div>
          <div class="fna-ai-kpi"><span class="fna-ai-kpi-val">$1.4M</span><span class="fna-ai-kpi-lbl">Uncovered Need</span></div>
          <div class="fna-ai-kpi good"><span class="fna-ai-kpi-val">8</span><span class="fna-ai-kpi-lbl">Completed</span></div>
        </div>
      </div>

      {/* Phase workflow */}
      <div class="fna-phase-bar">
        <div class="fna-phase active" onclick="switchFNAPhase('discovery',this)">
          <div class="fna-phase-num">1</div>
          <div class="fna-phase-body"><div class="fna-phase-title">Prospect Discovery</div><div class="fna-phase-sub">Lead qualification · PMAIL</div></div>
        </div>
        <div class="fna-phase-arrow"><i class="fas fa-chevron-right"></i></div>
        <div class="fna-phase" onclick="switchFNAPhase('factfind',this)">
          <div class="fna-phase-num">2</div>
          <div class="fna-phase-body"><div class="fna-phase-title">Fact-Find</div><div class="fna-phase-sub">Personal · health · financial</div></div>
        </div>
        <div class="fna-phase-arrow"><i class="fas fa-chevron-right"></i></div>
        <div class="fna-phase" onclick="switchFNAPhase('gap',this)">
          <div class="fna-phase-num">3</div>
          <div class="fna-phase-body"><div class="fna-phase-title">Gap Analysis</div><div class="fna-phase-sub">AI coverage gap calc</div></div>
        </div>
        <div class="fna-phase-arrow"><i class="fas fa-chevron-right"></i></div>
        <div class="fna-phase" onclick="switchFNAPhase('recommend',this)">
          <div class="fna-phase-num">4</div>
          <div class="fna-phase-body"><div class="fna-phase-title">AI Recommendation</div><div class="fna-phase-sub">Product + face amount</div></div>
        </div>
        <div class="fna-phase-arrow"><i class="fas fa-chevron-right"></i></div>
        <div class="fna-phase" onclick="switchFNAPhase('illustration',this)">
          <div class="fna-phase-num">5</div>
          <div class="fna-phase-body"><div class="fna-phase-title">Run Illustration</div><div class="fna-phase-sub">→ E-App submission</div></div>
        </div>
      </div>

      {/* Main 2-col body */}
      <div class="fna-body">

        {/* LEFT — Active FNA list */}
        <div class="fna-list-col">
          <div class="fna-list-header">
            <span class="fna-list-title">Active FNAs</span>
            <input type="text" class="fna-search" placeholder="Search client…" oninput="filterFNAs(this.value)" />
          </div>
          <div class="fna-list" id="fna-list">
            {/* FNA Card 1 */}
            <div class="fna-card fna-card-active" onclick="openFNADetail('FNA-001')" data-id="FNA-001">
              <div class="fna-card-top">
                <div class="fna-avatar fna-av-ar">AR</div>
                <div class="fna-card-meta">
                  <div class="fna-card-name">Alex Rivera</div>
                  <div class="fna-card-sub">Executive · Age 34 · Phase 3 of 5</div>
                </div>
                <span class="fna-status-pill gap">Gap Found</span>
              </div>
              <div class="fna-card-progress">
                <div class="fna-prog-bar"><div class="fna-prog-fill" style="width:60%"></div></div>
                <span class="fna-prog-lbl">60% complete</span>
              </div>
              <div class="fna-card-chips">
                <span class="fna-chip ins"><i class="fas fa-shield-alt"></i> Whole Life $500K</span>
                <span class="fna-chip warn"><i class="fas fa-exclamation-triangle"></i> No DI</span>
              </div>
              <div class="fna-card-footer">
                <span class="fna-foot-date"><i class="fas fa-clock"></i> Updated 2h ago</span>
                <button class="fna-foot-btn" onclick="event.stopPropagation();continueFNA('FNA-001')">Continue <i class="fas fa-arrow-right"></i></button>
              </div>
            </div>
            {/* FNA Card 2 */}
            <div class="fna-card" onclick="openFNADetail('FNA-002')" data-id="FNA-002">
              <div class="fna-card-top">
                <div class="fna-avatar fna-av-nf">NF</div>
                <div class="fna-card-meta">
                  <div class="fna-card-name">Nancy Foster</div>
                  <div class="fna-card-sub">Healthcare Director · Age 41 · Phase 2 of 5</div>
                </div>
                <span class="fna-status-pill progress">In Progress</span>
              </div>
              <div class="fna-card-progress">
                <div class="fna-prog-bar"><div class="fna-prog-fill" style="width:40%"></div></div>
                <span class="fna-prog-lbl">40% complete</span>
              </div>
              <div class="fna-card-chips">
                <span class="fna-chip ins"><i class="fas fa-shield-alt"></i> Term $1M</span>
                <span class="fna-chip warn"><i class="fas fa-exclamation-triangle"></i> No LTC</span>
              </div>
              <div class="fna-card-footer">
                <span class="fna-foot-date"><i class="fas fa-clock"></i> Updated 1d ago</span>
                <button class="fna-foot-btn" onclick="event.stopPropagation();continueFNA('FNA-002')">Continue <i class="fas fa-arrow-right"></i></button>
              </div>
            </div>
            {/* FNA Card 3 */}
            <div class="fna-card" onclick="openFNADetail('FNA-003')" data-id="FNA-003">
              <div class="fna-card-top">
                <div class="fna-avatar fna-av-pn">PN</div>
                <div class="fna-card-meta">
                  <div class="fna-card-name">Patricia Nguyen</div>
                  <div class="fna-card-sub">Senior Manager · Age 48 · Phase 4 of 5</div>
                </div>
                <span class="fna-status-pill urgent">Urgent Gap</span>
              </div>
              <div class="fna-card-progress">
                <div class="fna-prog-bar"><div class="fna-prog-fill urgent" style="width:80%"></div></div>
                <span class="fna-prog-lbl">80% complete</span>
              </div>
              <div class="fna-card-chips">
                <span class="fna-chip warn"><i class="fas fa-exclamation-circle"></i> $240K income gap</span>
                <span class="fna-chip ins"><i class="fas fa-shield-alt"></i> UL top-up needed</span>
              </div>
              <div class="fna-card-footer">
                <span class="fna-foot-date"><i class="fas fa-clock"></i> Updated today</span>
                <button class="fna-foot-btn urgent" onclick="event.stopPropagation();continueFNA('FNA-003')">Act Now <i class="fas fa-arrow-right"></i></button>
              </div>
            </div>
          </div>

          {/* Completed FNA section */}
          <div class="fna-completed-header" onclick="toggleFNACompleted(this)">
            <i class="fas fa-check-circle" style="color:#059669"></i> 8 Completed FNAs
            <i class="fas fa-chevron-down fna-toggle-icon"></i>
          </div>
          <div class="fna-completed-list" id="fna-completed-list" style="display:none">
            <div class="fna-card fna-card-done" onclick="openFNADetail('FNA-004')">
              <div class="fna-card-top">
                <div class="fna-avatar fna-av-jw">JW</div>
                <div class="fna-card-meta">
                  <div class="fna-card-name">James Whitfield</div>
                  <div class="fna-card-sub">Completed · Mar 2026 · Whole Life + Annuity</div>
                </div>
                <span class="fna-status-pill done">Complete</span>
              </div>
            </div>
            <div class="fna-card fna-card-done" onclick="openFNADetail('FNA-005')">
              <div class="fna-card-top">
                <div class="fna-avatar fna-av-rc">RC</div>
                <div class="fna-card-meta">
                  <div class="fna-card-name">Robert Chen</div>
                  <div class="fna-card-sub">Completed · Feb 2026 · Whole Life $1M</div>
                </div>
                <span class="fna-status-pill done">Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — FNA Detail Panel */}
        <div class="fna-detail-col" id="fna-detail-col">
          <div class="fna-detail-empty" id="fna-detail-empty">
            <i class="fas fa-clipboard-list fna-empty-icon"></i>
            <strong>Select an FNA to view details</strong>
            <p>Or start a new FNA with the button above</p>
          </div>
          <div id="fna-detail-panel" style="display:none">
            {/* Rendered by JS */}
          </div>
        </div>

      </div>

      {/* New FNA Modal */}
      <div id="new-fna-overlay" class="fna-overlay" style="display:none" onclick="closeFNAOverlay(event)">
        <div class="fna-modal" onclick="event.stopPropagation()">
          <div class="fna-modal-header">
            <div class="fna-modal-title"><i class="fas fa-clipboard-list"></i> New Financial Needs Analysis</div>
            <button class="fna-modal-close" onclick="closeFNAOverlay()"><i class="fas fa-times"></i></button>
          </div>
          <div class="fna-modal-body" id="new-fna-body">
            {/* Step 1 — Client Selection */}
            <div class="fna-step" id="fna-step-1">
              <div class="fna-step-label">Step 1 of 5 — Client / Prospect</div>
              <div class="fna-field-group">
                <label class="fna-label">Select existing client or prospect</label>
                <select class="fna-select">
                  <option value="">— Choose client / prospect —</option>
                  <option>Alex Rivera (Lead)</option>
                  <option>Nancy Foster (Lead)</option>
                  <option>James Whitfield (Client)</option>
                  <option>Patricia Nguyen (Client)</option>
                  <option>Robert Chen (Client)</option>
                </select>
                <div class="fna-or-line"><span>or</span></div>
                <label class="fna-label">New prospect name</label>
                <input type="text" class="fna-input" placeholder="Full name" />
              </div>
              <div class="fna-step-actions">
                <button class="btn btn-primary" onclick="fnaNextStep(2)">Next — Personal Info <i class="fas fa-arrow-right"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FNA EDITOR OVERLAY ── full 4-section fact-find modal */}
      <div id="fna-editor-overlay" class="fna-editor-overlay" style="display:none" onclick="_closeFNAEditorBg(event)">
        <div class="fna-ed-modal" onclick="event.stopPropagation()">
          {/* Modal header */}
          <div class="fna-ed-header">
            <div class="fna-ed-header-left">
              <i class="fas fa-clipboard-list"></i>
              <span id="fna-ed-title">Financial Needs Analysis — Fact-Find</span>
            </div>
            <div class="fna-ed-header-right">
              <button class="fna-ed-ai-btn" onclick="openFNAAIPrefill()"><i class="fas fa-robot"></i> AI Pre-fill</button>
              <button class="fna-ed-close-btn" onclick="_closeFNAEditorForce()"><i class="fas fa-times"></i></button>
            </div>
          </div>
          {/* Section nav tabs */}
          <div class="fna-ed-nav-tabs" id="fna-ed-nav-tabs">
            <button class="fna-ed-nav-btn active" onclick="fnaEditorNav(0)" data-idx="0">
              <i class="fas fa-user"></i> Personal &amp; Profile
            </button>
            <button class="fna-ed-nav-btn" onclick="fnaEditorNav(1)" data-idx="1">
              <i class="fas fa-heartbeat"></i> Health History
            </button>
            <button class="fna-ed-nav-btn" onclick="fnaEditorNav(2)" data-idx="2">
              <i class="fas fa-dollar-sign"></i> Financial Suitability
            </button>
            <button class="fna-ed-nav-btn" onclick="fnaEditorNav(3)" data-idx="3">
              <i class="fas fa-shield-alt"></i> Coverage Needs
            </button>
          </div>
          {/* Section body — rendered by JS */}
          <div class="fna-ed-body" id="fna-ed-body">
            <div class="fna-ed-loading"><i class="fas fa-spinner fa-spin"></i> Loading FNA data…</div>
          </div>
        </div>
      </div>

      {/* ── AI PRE-FILL PANEL ── floating side-panel for note extraction */}
      <div id="fna-ai-prefill-panel" class="fna-ai-prefill-panel" style="display:none">
        <div class="fna-prefill-header">
          <span class="fna-prefill-title"><i class="fas fa-robot"></i> AI Pre-fill from Notes</span>
          <button class="fna-prefill-close" onclick="closeFNAAIPrefill()"><i class="fas fa-times"></i></button>
        </div>
        <p class="fna-prefill-hint">Paste meeting notes, a call transcript, or spoken summary below. AI will extract and pre-populate FNA fields.</p>
        <textarea id="fna-ai-notes-input" class="fna-prefill-textarea" placeholder="e.g. 'Client is 42, non-smoker, earns $120K, has $450K mortgage, existing $500K term policy expires 2029, concerned about retirement income gap…'"></textarea>
        <button class="fna-prefill-run-btn" onclick="runAIPrefill()"><i class="fas fa-magic"></i> Extract &amp; Pre-fill Fields</button>
        <div id="fna-prefill-results" class="fna-prefill-results" style="display:none">
          {/* Rendered by runAIPrefill() */}
        </div>
      </div>

      {/* ── MEETING SUMMARY OVERLAY ── generated email summary modal */}
      <div id="fna-summary-overlay" class="fna-summary-overlay" style="display:none" onclick="closeFNASummary(event)">
        <div class="fna-summary-modal" onclick="event.stopPropagation()">
          <div class="fna-sum-header">
            <div class="fna-sum-header-left">
              <i class="fas fa-envelope"></i>
              <span>AI Meeting Summary Email</span>
            </div>
            <button class="fna-ed-close-btn" onclick="closeFNASummary()"><i class="fas fa-times"></i></button>
          </div>
          <div id="fna-summary-body" class="fna-sum-body">
            {/* Rendered by generateMeetingSummary() */}
          </div>
          <div class="fna-sum-actions">
            <button class="fna-sum-send-btn" onclick="sendMeetingSummary()"><i class="fas fa-paper-plane"></i> Send to Client</button>
            <button class="fna-sum-copy-btn" onclick="copyMeetingSummary()"><i class="fas fa-copy"></i> Copy to Clipboard</button>
            <button class="fna-sum-cancel-btn" onclick="closeFNASummary()"><i class="fas fa-times"></i> Close</button>
          </div>
        </div>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PHASE 6 · POLICY DELIVERY PAGE
   Delivery checklist · receipt capture · AI prep brief
   ═══════════════════════════════════════════════════════════ */
function PolicyDeliveryPage() {
  return (
    <div class="page delivery-page">

      {/* Header */}
      <div class="del-header">
        <div class="del-header-left">
          <div class="del-header-icon"><i class="fas fa-box-open"></i></div>
          <div>
            <h2 class="del-title">Policy Delivery</h2>
            <p class="del-sub">Deliver issued policies · capture signed receipts · AI-powered delivery preparation · client onboarding</p>
          </div>
        </div>
        <div class="del-header-actions">
          <button class="btn btn-ai" onclick="openDeliveryAIPrep()"><i class="fas fa-robot"></i> AI Delivery Brief</button>
          <button class="btn btn-primary" onclick="openNewDelivery()"><i class="fas fa-plus"></i> Schedule Delivery</button>
        </div>
      </div>

      {/* AI Summary bar */}
      <div class="del-ai-bar">
        <div class="del-ai-icon"><i class="fas fa-brain"></i></div>
        <div class="del-ai-body">
          <span class="del-ai-label">AI Delivery Assistant · 2 policies ready for delivery · 1 overdue</span>
          <span class="del-ai-text"><strong>Overdue:</strong> Kevin Park — Policy P-100350 issued 8 days ago, delivery not scheduled · <strong>Ready:</strong> Alex Rivera (Whole Life $500K) · Nancy Foster (Term $1M)</span>
        </div>
        <div class="del-ai-kpis">
          <div class="del-ai-kpi warn"><span class="del-ai-kpi-val">1</span><span class="del-ai-kpi-lbl">Overdue</span></div>
          <div class="del-ai-kpi"><span class="del-ai-kpi-val">2</span><span class="del-ai-kpi-lbl">Ready</span></div>
          <div class="del-ai-kpi good"><span class="del-ai-kpi-val">11</span><span class="del-ai-kpi-lbl">Delivered YTD</span></div>
          <div class="del-ai-kpi"><span class="del-ai-kpi-val">97%</span><span class="del-ai-kpi-lbl">Free-look Retained</span></div>
        </div>
      </div>

      {/* KPI Strip */}
      <div class="del-kpi-strip">
        <div class="del-kpi" onclick="filterDeliveries('pending')">
          <div class="del-kpi-icon" style="background:#fff7ed;color:#ea580c"><i class="fas fa-clock"></i></div>
          <div class="del-kpi-data"><div class="del-kpi-val">2</div><div class="del-kpi-lbl">Pending Delivery</div></div>
        </div>
        <div class="del-kpi del-kpi-alert" onclick="filterDeliveries('overdue')">
          <div class="del-kpi-icon" style="background:#fef2f2;color:#dc2626"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="del-kpi-data"><div class="del-kpi-val">1</div><div class="del-kpi-lbl">Overdue (&gt;7d)</div></div>
        </div>
        <div class="del-kpi" onclick="filterDeliveries('scheduled')">
          <div class="del-kpi-icon" style="background:#f0fdf4;color:#059669"><i class="fas fa-calendar-check"></i></div>
          <div class="del-kpi-data"><div class="del-kpi-val">1</div><div class="del-kpi-lbl">Scheduled</div></div>
        </div>
        <div class="del-kpi" onclick="filterDeliveries('delivered')">
          <div class="del-kpi-icon" style="background:#eff6ff;color:#003087"><i class="fas fa-check-double"></i></div>
          <div class="del-kpi-data"><div class="del-kpi-val">11</div><div class="del-kpi-lbl">Delivered YTD</div></div>
        </div>
        <div class="del-kpi">
          <div class="del-kpi-icon" style="background:#f5f3ff;color:#7c3aed"><i class="fas fa-undo"></i></div>
          <div class="del-kpi-data"><div class="del-kpi-val">0</div><div class="del-kpi-lbl">Free-Look Returns</div></div>
        </div>
        <div class="del-kpi">
          <div class="del-kpi-icon" style="background:#ecfdf5;color:#059669"><i class="fas fa-dollar-sign"></i></div>
          <div class="del-kpi-data"><div class="del-kpi-val">$48.2K</div><div class="del-kpi-lbl">Premium Delivered YTD</div></div>
        </div>
      </div>

      {/* Main 2-col body */}
      <div class="del-body">

        {/* LEFT — Delivery Queue */}
        <div class="del-list-col">

          {/* Overdue */}
          <div class="del-section-label del-section-urgent"><i class="fas fa-fire"></i> Overdue — Act Now</div>
          <div class="del-card del-card-overdue" onclick="openDeliveryDetail('DEL-003')">
            <div class="del-card-top">
              <div class="del-avatar del-av-kp">KP</div>
              <div class="del-card-meta">
                <div class="del-card-name">Kevin Park</div>
                <div class="del-card-pol">Policy P-100350 · Term Life $250K</div>
              </div>
              <span class="del-status-pill overdue"><i class="fas fa-fire"></i> 8d Overdue</span>
            </div>
            <div class="del-card-checklist">
              <span class="del-check done"><i class="fas fa-check-circle"></i> Policy issued</span>
              <span class="del-check done"><i class="fas fa-check-circle"></i> Documents ready</span>
              <span class="del-check miss"><i class="fas fa-times-circle"></i> Delivery not scheduled</span>
              <span class="del-check miss"><i class="fas fa-times-circle"></i> Receipt not captured</span>
            </div>
            <div class="del-card-footer">
              <span class="del-premium">$3,200/yr premium</span>
              <button class="del-action-btn urgent" onclick="event.stopPropagation();scheduleDelivery('DEL-003')"><i class="fas fa-calendar-plus"></i> Schedule Now</button>
            </div>
          </div>

          {/* Pending */}
          <div class="del-section-label"><i class="fas fa-hourglass-half"></i> Ready for Delivery</div>
          <div class="del-card del-card-ready" onclick="openDeliveryDetail('DEL-001')">
            <div class="del-card-top">
              <div class="del-avatar del-av-ar">AR</div>
              <div class="del-card-meta">
                <div class="del-card-name">Alex Rivera</div>
                <div class="del-card-pol">Policy P-100360 · Whole Life $500K</div>
              </div>
              <span class="del-status-pill ready">Ready</span>
            </div>
            <div class="del-card-checklist">
              <span class="del-check done"><i class="fas fa-check-circle"></i> Policy issued Apr 8</span>
              <span class="del-check done"><i class="fas fa-check-circle"></i> AI delivery brief ready</span>
              <span class="del-check done"><i class="fas fa-check-circle"></i> Meeting Apr 14 scheduled</span>
              <span class="del-check miss"><i class="fas fa-circle"></i> Receipt pending</span>
            </div>
            <div class="del-card-footer">
              <span class="del-premium">$4,800/yr premium</span>
              <button class="del-action-btn" onclick="event.stopPropagation();openDeliveryBrief('DEL-001')"><i class="fas fa-robot"></i> AI Brief</button>
            </div>
          </div>
          <div class="del-card del-card-ready" onclick="openDeliveryDetail('DEL-002')">
            <div class="del-card-top">
              <div class="del-avatar del-av-nf">NF</div>
              <div class="del-card-meta">
                <div class="del-card-name">Nancy Foster</div>
                <div class="del-card-pol">Policy P-100365 · Term Life $1M</div>
              </div>
              <span class="del-status-pill scheduled"><i class="fas fa-calendar-check"></i> Apr 16</span>
            </div>
            <div class="del-card-checklist">
              <span class="del-check done"><i class="fas fa-check-circle"></i> Policy issued Apr 9</span>
              <span class="del-check done"><i class="fas fa-check-circle"></i> AI brief generated</span>
              <span class="del-check done"><i class="fas fa-check-circle"></i> Meeting Apr 16 confirmed</span>
              <span class="del-check miss"><i class="fas fa-circle"></i> Receipt pending</span>
            </div>
            <div class="del-card-footer">
              <span class="del-premium">$3,600/yr premium</span>
              <button class="del-action-btn" onclick="event.stopPropagation();openDeliveryBrief('DEL-002')"><i class="fas fa-robot"></i> AI Brief</button>
            </div>
          </div>

          {/* Recent Deliveries */}
          <div class="del-section-label" style="margin-top:8px"><i class="fas fa-check-double" style="color:#059669"></i> Recently Delivered</div>
          <div class="del-card del-card-done" onclick="openDeliveryDetail('DEL-R1')">
            <div class="del-card-top">
              <div class="del-avatar del-av-sw">SW</div>
              <div class="del-card-meta">
                <div class="del-card-name">Sandra Williams</div>
                <div class="del-card-pol">P-100320 · Term $350K · Delivered Apr 3</div>
              </div>
              <span class="del-status-pill delivered"><i class="fas fa-check-double"></i> Delivered</span>
            </div>
            <div class="del-card-receipt"><i class="fas fa-file-signature"></i> Signed receipt on file · Premium active</div>
          </div>
        </div>

        {/* RIGHT — Delivery Detail / AI Brief */}
        <div class="del-detail-col" id="del-detail-col">
          <div class="del-detail-empty" id="del-detail-empty">
            <i class="fas fa-box-open del-empty-icon"></i>
            <strong>Select a delivery to view details</strong>
            <p>View AI delivery brief, checklist, and receipt capture</p>
          </div>
          <div id="del-detail-panel" style="display:none">
            {/* Rendered by JS — see openDeliveryDetail() */}
          </div>
        </div>

      </div>

    </div>
  )
}

// ============================================================
// LEADS PAGE — Phase 1 Prospecting & Lead Identification
// ============================================================
function LeadsPage() {
  return (
    <div class="leads-page">

      {/* ── STAT STRIP ── */}
      <div class="lead-stats-strip">
        <div class="lead-stat-card">
          <div class="lead-stat-num" id="lead-stat-total">14</div>
          <div class="lead-stat-lbl">Total Leads</div>
        </div>
        <div class="lead-stat-card lead-stat-new">
          <div class="lead-stat-num" id="lead-stat-new">3</div>
          <div class="lead-stat-lbl"><i class="fas fa-star"></i> New</div>
        </div>
        <div class="lead-stat-card lead-stat-qualified">
          <div class="lead-stat-num" id="lead-stat-qualified">3</div>
          <div class="lead-stat-lbl"><i class="fas fa-check-circle"></i> Qualified</div>
        </div>
        <div class="lead-stat-card lead-stat-converted">
          <div class="lead-stat-num" id="lead-stat-converted">8</div>
          <div class="lead-stat-lbl"><i class="fas fa-user-check"></i> Converted</div>
        </div>
        <div class="lead-stat-card lead-stat-avg">
          <div class="lead-stat-num" id="lead-stat-avg">84</div>
          <div class="lead-stat-lbl"><i class="fas fa-brain"></i> Avg AI Score</div>
        </div>
        <div class="lead-stat-card lead-stat-pipeline">
          <div class="lead-stat-num" id="lead-stat-pipeline">$2.4M</div>
          <div class="lead-stat-lbl"><i class="fas fa-dollar-sign"></i> Est. Pipeline</div>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div class="leads-filter-bar">
        <div class="leads-filter-tabs">
          <button class="leads-filter-tab active" data-filter="all" onclick="filterLeadsByStatus('all')" id="leads-tab-all">
            All <span class="leads-tab-count" id="leads-count-all">14</span>
          </button>
          <button class="leads-filter-tab" data-filter="new" onclick="filterLeadsByStatus('new')" id="leads-tab-new">
            <i class="fas fa-star"></i> New <span class="leads-tab-count" id="leads-count-new">3</span>
          </button>
          <button class="leads-filter-tab" data-filter="qualified" onclick="filterLeadsByStatus('qualified')" id="leads-tab-qualified">
            <i class="fas fa-check-circle"></i> Qualified <span class="leads-tab-count" id="leads-count-qualified">3</span>
          </button>
          <button class="leads-filter-tab" data-filter="converted" onclick="filterLeadsByStatus('converted')" id="leads-tab-converted">
            <i class="fas fa-user-check"></i> Converted <span class="leads-tab-count" id="leads-count-converted">8</span>
          </button>
        </div>
        <div class="leads-search-wrap">
          <i class="fas fa-search leads-search-icon"></i>
          <input
            type="text"
            class="leads-search-input"
            id="leads-search-input"
            placeholder="Search leads by name, trigger, source..."
            oninput="searchLeads(this.value)"
          />
        </div>
        <button class="leads-add-btn" onclick="showToast('Add Lead form coming soon','info')">
          <i class="fas fa-plus"></i> Add Lead
        </button>
      </div>

      {/* ── AI BANNER ── */}
      <div class="leads-ai-banner">
        <i class="fas fa-robot leads-ai-icon"></i>
        <div class="leads-ai-text">
          <strong>AI Lead Intelligence</strong> — 3 new leads identified this week.
          Top priority: <strong>L009 (Marcus Thompson)</strong> — New baby + $195K income matches 61 closed cases.
          Run PMAIL qualification to advance to prospect pipeline.
        </div>
        <button class="leads-ai-action-btn" onclick="selectLead('L009')">
          <i class="fas fa-arrow-right"></i> Review Top Lead
        </button>
      </div>

      {/* ── TWO-COLUMN BODY ── */}
      <div class="leads-body">

        {/* LEFT — Lead List */}
        <div class="leads-list-col">
          <div class="leads-list-header">
            <span class="leads-list-label" id="leads-list-label">All Leads (14)</span>
            <select class="leads-sort-select" onchange="sortLeads(this.value)">
              <option value="score">Sort: AI Score</option>
              <option value="date">Sort: Entry Date</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>
          <div id="leads-list-container">
            {/* Rendered by renderLeadsList() */}
            <div class="leads-empty" id="leads-empty-state" style="display:none">
              <i class="fas fa-inbox" style="font-size:2rem;color:#cbd5e1;margin-bottom:8px"></i>
              <div>No leads match this filter</div>
            </div>
          </div>
        </div>

        {/* RIGHT — Lead Detail Panel */}
        <div class="lead-detail-col" id="lead-detail-col">
          <div class="lead-detail-empty" id="lead-detail-empty">
            <i class="fas fa-user-plus lead-detail-empty-icon"></i>
            <strong>Select a lead to view details</strong>
            <p>View AI score, PMAIL qualification status, propensity match, and conversion options</p>
          </div>
          <div id="lead-detail-panel" style="display:none">
            {/* Rendered by renderLeadDetail() */}
          </div>
        </div>

      </div>

      {/* ── PMAIL MODAL (hidden, rendered by JS) ── */}
      <div class="pmail-overlay" id="pmail-overlay" style="display:none" onclick="closePMAILModal()">
        <div class="pmail-modal" id="pmail-modal" onclick="event.stopPropagation()">
          <div id="pmail-modal-inner">
            {/* Rendered by buildPMAILModalHTML() */}
          </div>
        </div>
      </div>

      {/* ── CONVERT TO PROSPECT MODAL (hidden, rendered by JS) ── */}
      <div class="pmail-overlay" id="convert-overlay" style="display:none" onclick="closeConvertModal()">
        <div class="convert-modal" id="convert-modal" onclick="event.stopPropagation()">
          <div id="convert-modal-inner">
            {/* Rendered by openConvertToProspect() */}
          </div>
        </div>
      </div>

      {/* ── TOAST ── */}
      <div class="phase1-toast" id="phase1-toast"></div>

    </div>
  )
}

export default app
