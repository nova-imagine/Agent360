
// ============================================================
// PHASE 1 — PROSPECTING & LEAD IDENTIFICATION
// Leads · PMAIL Qualification · Prospect Creation · Campaigns
// ============================================================

console.log('Phase 1 module loaded — leadsData(14), PMAIL qualification, prospect creation, campaigns');

// ── RAW LEADS DATA ────────────────────────────────────────────
// These are pre-qualification leads — basic data only.
// After PMAIL scoring, agent converts a Lead → Prospect (rich record).
var leadsData = [
  {
    id: 'L001', name: 'Alex Rivera',      initials: 'AR', avatarColor: '#003087',
    age: 34, city: 'Manhattan, NY',
    occupation: 'Account Executive — Deloitte',
    estimatedIncome: '$140K–$160K/yr',
    email: 'alex.r@email.com', phone: '(917) 555-0134',
    lifeEventTrigger: 'Career Promotion',
    lifeEventDetail: 'Promoted to Senior AE — Jan 2026',
    referralSource: 'Referral — Robert Chen (existing client)',
    referralType: 'client-referral',
    productInterest: ['Life Insurance', 'Disability'],
    entryDate: 'Mar 28, 2026',
    status: 'converted',          // converted → Prospect P001
    prospectId: 'P001',
    notes: 'Robert Chen introduced via email. Mentioned budget ~$350/mo. Interested in WL.',
    contactAttempts: 2,
    lastContact: 'Apr 3, 2026'
  },
  {
    id: 'L002', name: 'Nancy Foster',     initials: 'NF', avatarColor: '#0369a1',
    age: 41, city: 'Brooklyn, NY',
    occupation: 'Healthcare Director — NYU Langone',
    estimatedIncome: '$185K–$210K/yr',
    email: 'n.foster@nyu.edu', phone: '(718) 555-0241',
    lifeEventTrigger: 'Home Purchase',
    lifeEventDetail: 'Purchased $740K home — Brooklyn, Mar 2026',
    referralSource: 'Public Record — Mortgage Filing',
    referralType: 'public-record',
    productInterest: ['Term Life', 'LTC'],
    entryDate: 'Apr 1, 2026',
    status: 'converted',
    prospectId: 'P002',
    notes: 'Mortgage filing flagged by AI. New homeowner, no life coverage on mortgage detected.',
    contactAttempts: 3,
    lastContact: 'Apr 8, 2026'
  },
  {
    id: 'L003', name: 'John Kim',         initials: 'JK', avatarColor: '#0f766e',
    age: 38, city: 'Jersey City, NJ',
    occupation: 'Staff Engineer — Google',
    estimatedIncome: '$210K–$235K/yr',
    email: 'john.kim@gmail.com', phone: '(201) 555-0338',
    lifeEventTrigger: 'Job Change / Income Event',
    lifeEventDetail: 'Joined Google as Staff Engineer — Sep 2024; ESPP vesting $42K Q1 2026',
    referralSource: 'LinkedIn Outreach',
    referralType: 'linkedin',
    productInterest: ['Disability Insurance', 'Investment'],
    entryDate: 'Mar 15, 2026',
    status: 'converted',
    prospectId: 'P003',
    notes: 'High income, no DI coverage detected. Tech profile — digital-first outreach preferred.',
    contactAttempts: 4,
    lastContact: 'Apr 5, 2026'
  },
  {
    id: 'L004', name: 'Michael Santos',   initials: 'MS', avatarColor: '#b45309',
    age: 47, city: 'Flushing, Queens, NY',
    occupation: 'Business Owner — Santos Tech Solutions LLC',
    estimatedIncome: '$560K–$600K/yr',
    email: 'm.santos@santech.com', phone: '(347) 555-0447',
    lifeEventTrigger: 'Business Event',
    lifeEventDetail: 'LLC revenue +22% YoY; new bank loan $200K; hired 4 employees Jan 2026',
    referralSource: 'Referral — Linda Morrison (client)',
    referralType: 'client-referral',
    productInterest: ['Key-Person Life', 'Buy-Sell', 'UL'],
    entryDate: 'Mar 20, 2026',
    status: 'converted',
    prospectId: 'P004',
    notes: 'Growing business, no key-person life detected. Linda Morrison gave warm intro.',
    contactAttempts: 1,
    lastContact: 'Mar 22, 2026'
  },
  {
    id: 'L005', name: 'Julia Chen',       initials: 'JC', avatarColor: '#7c3aed',
    age: 58, city: 'Hoboken, NJ',
    occupation: 'Retired Professor — Columbia University',
    estimatedIncome: '$75K–$82K/yr (Pension)',
    email: 'julia.chen@columbia.edu', phone: '(201) 555-0558',
    lifeEventTrigger: 'Retirement',
    lifeEventDetail: 'Retired from Columbia Jan 2026; $180K CD maturing May 2026',
    referralSource: 'Seminar — NYL Retirement Workshop',
    referralType: 'seminar',
    productInterest: ['Fixed Annuity', 'Income Annuity'],
    entryDate: 'Mar 18, 2026',
    status: 'converted',
    prospectId: 'P005',
    notes: 'Attended NYL retirement seminar. CD maturing = immediate opportunity window.',
    contactAttempts: 2,
    lastContact: 'Apr 2, 2026'
  },
  {
    id: 'L006', name: 'Grace Lee',        initials: 'GL', avatarColor: '#dc2626',
    age: 44, city: 'White Plains, NY',
    occupation: 'Physician — Westchester Medical Center',
    estimatedIncome: '$380K–$400K/yr',
    email: 'g.lee@westmed.org', phone: '(914) 555-0664',
    lifeEventTrigger: 'Career Promotion',
    lifeEventDetail: 'Promoted to Department Head Feb 2026; child starting college 2027',
    referralSource: 'Physician Financial Planning Event',
    referralType: 'event',
    productInterest: ['Whole Life', 'Estate Planning'],
    entryDate: 'Mar 10, 2026',
    status: 'converted',
    prospectId: 'P006',
    notes: 'High-income physician, estate planning need. Met at NYSMA physician event.',
    contactAttempts: 2,
    lastContact: 'Mar 28, 2026'
  },
  {
    id: 'L007', name: 'Rachel Adams',     initials: 'RA', avatarColor: '#059669',
    age: 29, city: 'Hoboken, NJ',
    occupation: 'Software Engineer — Stripe',
    estimatedIncome: '$160K–$170K/yr',
    email: 'r.adams@stripe.com', phone: '(201) 555-0729',
    lifeEventTrigger: 'New Baby',
    lifeEventDetail: 'Baby born Mar 2026; RSU vesting $40K Q2 2026',
    referralSource: 'Life Event Alert — Public Birth Notice',
    referralType: 'life-event-alert',
    productInterest: ['Term Life', '529 Plan'],
    entryDate: 'Apr 2, 2026',
    status: 'converted',
    prospectId: 'P007',
    notes: 'New parent. AI flagged public birth notice. Strong protection need + college savings.',
    contactAttempts: 1,
    lastContact: 'Apr 4, 2026'
  },
  {
    id: 'L008', name: 'Thomas Wright',    initials: 'TW', avatarColor: '#0369a1',
    age: 52, city: 'Park Ave, Manhattan, NY',
    occupation: 'CFO — FinTech Corp (Public Company)',
    estimatedIncome: '$800K–$850K/yr',
    email: 't.wright@fintechcorp.com', phone: '(212) 555-0852',
    lifeEventTrigger: 'IPO / Wealth Event',
    lifeEventDetail: 'Company IPO — stock options $480K vesting 2026; child to college Sep 2026',
    referralSource: 'LinkedIn — HNWI Prospect Campaign',
    referralType: 'campaign-linkedin',
    productInterest: ['UL $1M+', 'Estate Planning', 'Income Annuity'],
    entryDate: 'Apr 5, 2026',
    status: 'converted',
    prospectId: 'P008',
    notes: 'High-net-worth. IPO wealth event. LinkedIn campaign response. Trust outdated 2018.',
    contactAttempts: 2,
    lastContact: 'Apr 10, 2026'
  },
  {
    id: 'L009', name: 'Linda Chen',       initials: 'LC', avatarColor: '#0f766e',
    age: 45, city: 'Upper West Side, NY',
    occupation: 'Partner — Chen & Associates Law Firm',
    estimatedIncome: '$300K–$320K/yr',
    email: 'l.chen@chenlegal.com', phone: '(212) 555-0945',
    lifeEventTrigger: 'Estate / Legal Event',
    lifeEventDetail: 'Established revocable trust Jun 2024; firm revenue +18% 2025',
    referralSource: 'Referral — Robert Chen (client)',
    referralType: 'client-referral',
    productInterest: ['Estate Planning', 'Whole Life $500K'],
    entryDate: 'Apr 8, 2026',
    status: 'new',
    prospectId: null,
    notes: 'Robert Chen referred his sister-in-law. Attorney, estate-focused. No prior contact.',
    contactAttempts: 0,
    lastContact: null
  },
  {
    id: 'L010', name: 'Marcus Johnson',   initials: 'MJ', avatarColor: '#b45309',
    age: 39, city: 'Fort Lee, NJ',
    occupation: 'Founder — MJ Digital Media (2 LLCs)',
    estimatedIncome: '$400K–$440K/yr',
    email: 'marcus@mjdigital.com', phone: '(201) 555-1039',
    lifeEventTrigger: 'Business Event',
    lifeEventDetail: 'New real estate LLC filed Jan 2026; revenue +35% YoY',
    referralSource: 'Inbound — NYL Website + LinkedIn Ad',
    referralType: 'inbound-digital',
    productInterest: ['Whole Life $750K', 'Mutual Funds'],
    entryDate: 'Apr 3, 2026',
    status: 'qualified',
    prospectId: null,
    notes: 'Self-referred via website form. Multiple LLCs. Business protection + wealth building.',
    contactAttempts: 2,
    lastContact: 'Apr 7, 2026'
  },
  {
    id: 'L011', name: 'Priya Patel',      initials: 'PP', avatarColor: '#7c3aed',
    age: 33, city: 'Parsippany, NJ',
    occupation: 'Dentist — Solo Practice',
    estimatedIncome: '$275K–$295K/yr',
    email: 'priya.patel@dds.com', phone: '(973) 555-1133',
    lifeEventTrigger: 'Engagement / Marriage',
    lifeEventDetail: 'Engagement detected — ring purchase Mar 2026; student loans $88K',
    referralSource: 'ADA Partnership List',
    referralType: 'association-list',
    productInterest: ['Disability Insurance $12K/mo', 'SEP-IRA'],
    entryDate: 'Apr 6, 2026',
    status: 'new',
    prospectId: null,
    notes: 'ADA partnership lead. Newly engaged solo practitioner. DI gap critical for practice income.',
    contactAttempts: 0,
    lastContact: null
  },
  {
    id: 'L012', name: 'Derek Walton',     initials: 'DW', avatarColor: '#dc2626',
    age: 55, city: 'Staten Island, NY',
    occupation: 'VP Finance — Mid-Market Insurance Co.',
    estimatedIncome: '$235K–$245K/yr',
    email: 'd.walton@mmins.com', phone: '(718) 555-1255',
    lifeEventTrigger: 'Retirement / LTC Event',
    lifeEventDetail: '401k approaching $600K; spouse diagnosed — LTC now critical; pension eliminated',
    referralSource: 'NYL Retirement Seminar',
    referralType: 'seminar',
    productInterest: ['Deferred Annuity', 'LTC Insurance'],
    entryDate: 'Mar 25, 2026',
    status: 'qualified',
    prospectId: null,
    notes: 'Seminar attendee. Spouse health event creates LTC urgency. Rollover opportunity.',
    contactAttempts: 3,
    lastContact: 'Apr 9, 2026'
  },
  {
    id: 'L013', name: 'Sophia Reyes',     initials: 'SR', avatarColor: '#059669',
    age: 36, city: 'Riverdale, Bronx, NY',
    occupation: 'Marketing Director — NBCUniversal',
    estimatedIncome: '$160K–$170K/yr',
    email: 's.reyes@nbc.com', phone: '(718) 555-1336',
    lifeEventTrigger: 'New Baby / Mortgage',
    lifeEventDetail: 'Child age 2 (college 2042); second pregnancy signal Apr 2026; $45K cash-out refi',
    referralSource: 'Facebook Ad — 529 College Savings Campaign',
    referralType: 'campaign-social',
    productInterest: ['529 College Plan', 'Term Life $600K'],
    entryDate: 'Apr 4, 2026',
    status: 'qualified',
    prospectId: null,
    notes: 'Responded to 529 Facebook ad. Growing family, needs protection + education funding.',
    contactAttempts: 2,
    lastContact: 'Apr 9, 2026'
  },
  {
    id: 'L014', name: 'James Okafor',     initials: 'JO', avatarColor: '#0369a1',
    age: 48, city: 'Newark, NJ',
    occupation: 'Real Estate Developer — Okafor Properties LLC',
    estimatedIncome: '$370K–$390K/yr',
    email: 'j.okafor@okaforprop.com', phone: '(973) 555-1448',
    lifeEventTrigger: 'Business / Property Event',
    lifeEventDetail: 'New LLC filed Apr 2026 (3rd company); $1.4M property purchase Mar 2026',
    referralSource: 'AI Public Records Scan — LLC Filing',
    referralType: 'ai-scan',
    productInterest: ['Whole Life $1M', 'Business Succession'],
    entryDate: 'Apr 9, 2026',
    status: 'new',
    prospectId: null,
    notes: 'AI-identified via LLC filing. $2.1M mortgage debt with no life coverage = critical gap.',
    contactAttempts: 0,
    lastContact: null
  }
];

// ── PMAIL SCORES for qualified/converted leads ─────────────────
// P = Product fit, M = Money (budget), A = Authority (decision maker),
// I = Insurability (health OK), L = Life event present
var pmailScores = {
  L001: { P:5, M:5, A:5, I:5, L:5, total:100, qualified:true,  qualDate:'Apr 3, 2026',  qualNotes:'Strong referral. Budget $350+/mo confirmed. Decision maker. Healthy 34yo. Recent promotion trigger.' },
  L002: { P:5, M:5, A:5, I:4, L:5, total:96,  qualified:true,  qualDate:'Apr 5, 2026',  qualNotes:'Clear product need (mortgage + no life). High income. Sole decision maker. Minor health history (hypertension, controlled). Home purchase = strong trigger.' },
  L003: { P:4, M:5, A:4, I:5, L:4, total:88,  qualified:true,  qualDate:'Apr 6, 2026',  qualNotes:'DI product match strong. High income. Authority unclear (partner involved). Healthy. ESPP vesting = financial event.' },
  L004: { P:5, M:5, A:5, I:4, L:5, total:96,  qualified:true,  qualDate:'Mar 22, 2026', qualNotes:'Key-person + buy-sell = perfect fit. Very high income. Business owner = sole authority. Pre-existing back condition (minor). Active business growth = urgent trigger.' },
  L005: { P:5, M:4, A:5, I:3, L:5, total:84,  qualified:true,  qualDate:'Mar 20, 2026', qualNotes:'Annuity is ideal product. Pension income is modest but CD maturity = lump sum. Sole decision maker. Age 58, mild health questions. Retirement = clear trigger.' },
  L006: { P:5, M:5, A:5, I:5, L:4, total:96,  qualified:true,  qualDate:'Mar 14, 2026', qualNotes:'WL + estate = strong fit for physician. High income. Decision maker. Very healthy. Promotion trigger strong but no acute event — slightly lower urgency.' },
  L007: { P:5, M:4, A:3, I:5, L:5, total:88,  qualified:true,  qualDate:'Apr 4, 2026',  qualNotes:'Term + 529 = perfect new parent match. Good income. Authority shared with spouse (not yet engaged). Healthy 29yo. New baby = strongest possible trigger.' },
  L008: { P:5, M:5, A:5, I:3, L:5, total:92,  qualified:true,  qualDate:'Apr 8, 2026',  qualNotes:'UL + estate = HNWI product fit. Very high income / wealth. CFO = decision authority. Age 52, mild health markers. IPO wealth event = urgent.' },
  L009: { P:4, M:5, A:5, I:5, L:3, total:80,  qualified:false, qualDate:null,           qualNotes:'Good fit potential. Income confirmed high. Solo decision maker. Healthy 45yo. Trust event is older — need clearer current trigger before qualifying.' },
  L010: { P:5, M:5, A:5, I:5, L:4, total:92,  qualified:true,  qualDate:'Apr 7, 2026',  qualNotes:'WL + business planning = good fit. High income. LLC owner = authority. Healthy 39yo. LLC filing = recent trigger but not acute life event.' },
  L011: { P:5, M:4, A:4, I:5, L:5, total:88,  qualified:false, qualDate:null,           qualNotes:'DI critical for practice. Good income but student loans reduce net capacity. Engagement is strong trigger. Need to confirm fiancé involvement in decision.' },
  L012: { P:5, M:4, A:4, I:3, L:5, total:84,  qualified:true,  qualDate:'Apr 9, 2026',  qualNotes:'LTC + annuity = spot-on. Pension eliminated = immediate annuity gap. Spouse health = LTC urgency. Budget constrained by rollover timing. Spouse is co-decision maker.' },
  L013: { P:5, M:4, A:4, I:5, L:5, total:88,  qualified:true,  qualDate:'Apr 9, 2026',  qualNotes:'529 + term = ideal young family. Income solid. Both parents in decision (spouse not met yet). Healthy. New baby + cash-out refi = dual trigger.' },
  L014: { P:5, M:5, A:5, I:4, L:4, total:88,  qualified:false, qualDate:null,           qualNotes:'WL + succession = strong fit. High income / assets. LLC owner = authority. Age 48, unknown health. LLC filing = business trigger but no direct life event yet.' }
};

// ── PROPENSITY MATCH PROFILES ─────────────────────────────────
// AI matches each lead/prospect to historical closed-case patterns
var propensityProfiles = {
  L001: { closedCasesLike: 47, topProducts: 'Whole Life + Disability', closePct: 82, matchDesc: 'Matches 47 closed cases: Age 28–36, referral source, income $120K–$160K, recent promotion. 89% bought WL as primary; 61% added DI within 6 months.' },
  L002: { closedCasesLike: 38, topProducts: 'Term Life + LTC Rider',   closePct: 61, matchDesc: 'Matches 38 closed cases: Female, 38–45, healthcare professional, new mortgage. 74% bought Term $750K–$1M; 45% added LTC rider.' },
  L003: { closedCasesLike: 29, topProducts: 'DI + Investment',          closePct: 44, matchDesc: 'Matches 29 closed cases: Tech engineer, 35–42, LinkedIn outreach, ESPP event. 66% bought DI first; 38% added investment account within 12 months.' },
  L004: { closedCasesLike: 22, topProducts: 'Key-Person UL + Buy-Sell', closePct: 91, matchDesc: 'Matches 22 closed cases: Business owner, 44–52, referral, $500K+ income. 95% bought Key-Person Life; 82% added buy-sell funding within 90 days.' },
  L005: { closedCasesLike: 31, topProducts: 'Fixed Annuity + Income',   closePct: 58, matchDesc: 'Matches 31 closed cases: Retired, 55–62, seminar attendee, pension income. 71% bought fixed annuity; 52% added income rider for guaranteed lifetime income.' },
  L006: { closedCasesLike: 18, topProducts: 'Whole Life + Estate',      closePct: 73, matchDesc: 'Matches 18 closed cases: Physician, 40–48, event source, $350K+ income. 83% bought WL $1M+; 67% added estate planning engagement within 6 months.' },
  L007: { closedCasesLike: 52, topProducts: 'Term Life + 529',          closePct: 55, matchDesc: 'Matches 52 closed cases: New parent, 27–33, life event alert, dual income. 88% bought Term first; 61% added 529 at same meeting.' },
  L008: { closedCasesLike: 14, topProducts: 'UL + Estate + Annuity',    closePct: 84, matchDesc: 'Matches 14 closed cases: C-suite, 50–55, LinkedIn campaign, $700K+ income. 93% bought UL $1M+; 79% added estate strategy; avg premium $22K/yr.' },
  L009: { closedCasesLike: 24, topProducts: 'Estate + WL',              closePct: 67, matchDesc: 'Matches 24 closed cases: Attorney partner, 42–48, client referral, $280K+ income. 75% bought WL + estate; 58% started with trust review conversation.' },
  L010: { closedCasesLike: 19, topProducts: 'WL + Business Planning',   closePct: 88, matchDesc: 'Matches 19 closed cases: Digital entrepreneur, 36–42, inbound lead, multi-LLC. 84% bought WL as business asset; 63% added mutual funds within 12 months.' },
  L011: { closedCasesLike: 33, topProducts: 'DI + SEP-IRA',             closePct: 51, matchDesc: 'Matches 33 closed cases: Solo practitioner, 30–38, association list, newly engaged. 79% bought DI as priority; 54% added SEP-IRA for retirement.' },
  L012: { closedCasesLike: 27, topProducts: 'LTC + Deferred Annuity',   closePct: 63, matchDesc: 'Matches 27 closed cases: Finance professional, 52–58, seminar, spouse health event. 81% bought LTC first; 67% rolled 401k into deferred annuity.' },
  L013: { closedCasesLike: 44, topProducts: 'Term Life + 529',          closePct: 80, matchDesc: 'Matches 44 closed cases: Young family, 33–39, social ad response, dual income. 86% bought Term; 72% added 529 at delivery meeting.' },
  L014: { closedCasesLike: 16, topProducts: 'WL + Business Succession',  closePct: 48, matchDesc: 'Matches 16 closed cases: Real estate developer, 45–52, AI-identified, LLC portfolio. 75% bought WL $1M+; 62% needed business succession planning.' }
};

// ── CAMPAIGN DATA ─────────────────────────────────────────────
var campaignData = [
  {
    id: 'CAM001',
    name: 'New Parent Protection Drive',
    status: 'active',
    statusColor: '#059669',
    type: 'Life Event — New Baby',
    typeIcon: 'fa-baby',
    qualifier: 'Life event trigger = New Baby; age 25–40; income $80K+',
    targetSegment: 'New Parents — Term Life + 529',
    channel: 'Email + Text + Facebook',
    startDate: 'Apr 1, 2026',
    endDate: 'Apr 30, 2026',
    targetLeads: ['L007', 'L013'],
    prospectIds: ['P007', 'P002'],
    totalTargeted: 12,
    delivered: 12,
    opened: 9,
    responded: 5,
    meetingsBooked: 3,
    converted: 1,
    responseRate: 42,
    conversionRate: 8,
    expectedRevenue: '$18,400/yr',
    expectedCommission: '$2,208',
    aiInsight: 'New parent leads respond 3.2x faster to "protect your family now" messaging vs. product-first messaging. Best send window: Tuesday–Thursday 7–9 PM.',
    messages: [
      { seq: 1, channel: 'Email',    day: 0,  subject: 'Your new arrival deserves a safety net — 5-min read', openRate: 78 },
      { seq: 2, channel: 'Text',     day: 3,  subject: 'Quick question about protecting baby [FirstName]…', openRate: 91 },
      { seq: 3, channel: 'Facebook', day: 7,  subject: 'Retargeted ad: "529 Calculator — What will college cost in 2044?"', openRate: 34 },
      { seq: 4, channel: 'Email',    day: 10, subject: 'I ran the numbers for your family — here\'s what I found', openRate: 62 }
    ],
    respondedLeads: [
      { id:'L007', name:'Rachel Adams',  response:'Replied to email Day 3 — "Yes, let\'s talk"', stage:'Meeting booked Apr 14' },
      { id:'L013', name:'Sophia Reyes',  response:'Clicked Facebook ad Day 7, filled form', stage:'Meeting booked Apr 16' }
    ]
  },
  {
    id: 'CAM002',
    name: 'Business Owner Shield Campaign',
    status: 'active',
    statusColor: '#059669',
    type: 'Business Event — New LLC / Revenue Growth',
    typeIcon: 'fa-briefcase',
    qualifier: 'Business owner; income $300K+; LLC filing or revenue event within 90 days',
    targetSegment: 'Business Owners — Key-Person + Buy-Sell + UL',
    channel: 'LinkedIn + Email + Phone',
    startDate: 'Mar 20, 2026',
    endDate: 'May 1, 2026',
    targetLeads: ['L004', 'L010', 'L014'],
    prospectIds: ['P004', 'P010'],
    totalTargeted: 8,
    delivered: 8,
    opened: 7,
    responded: 4,
    meetingsBooked: 3,
    converted: 2,
    responseRate: 50,
    conversionRate: 25,
    expectedRevenue: '$42,600/yr',
    expectedCommission: '$5,112',
    aiInsight: 'Business owners with LLC filings < 60 days respond best to risk-framing: "What happens to your business if you can\'t work?" Close rate 2.1x higher than product-first approach.',
    messages: [
      { seq: 1, channel: 'LinkedIn', day: 0,  subject: 'Congrats on Santos Tech Solutions growth — quick question', openRate: 85 },
      { seq: 2, channel: 'Email',    day: 4,  subject: 'The #1 risk most business owners overlook (and how to fix it)', openRate: 71 },
      { seq: 3, channel: 'Phone',    day: 8,  subject: 'Outbound call — business protection review offer', openRate: 60 },
      { seq: 4, channel: 'Email',    day: 14, subject: 'Key-person analysis I ran for your business profile', openRate: 55 }
    ],
    respondedLeads: [
      { id:'L004', name:'Michael Santos', response:'Took phone call Day 8 — "I\'ve been meaning to look into this"', stage:'Meeting booked Mar 22, negotiating' },
      { id:'L010', name:'Marcus Johnson',  response:'LinkedIn reply Day 0 — "Tell me more"', stage:'Meeting booked Apr 7, qualified' }
    ]
  },
  {
    id: 'CAM003',
    name: 'Retirement Income Readiness',
    status: 'active',
    statusColor: '#059669',
    type: 'Life Event — Retirement / CD Maturity',
    typeIcon: 'fa-umbrella-beach',
    qualifier: 'Age 55+; recently retired or CD/pension event; income $60K–$120K',
    targetSegment: 'Pre/Post Retirees — Annuity + LTC',
    channel: 'Email + Seminar Follow-up + Phone',
    startDate: 'Mar 18, 2026',
    endDate: 'May 15, 2026',
    targetLeads: ['L005', 'L012'],
    prospectIds: ['P005', 'P012'],
    totalTargeted: 18,
    delivered: 18,
    opened: 14,
    responded: 7,
    meetingsBooked: 4,
    converted: 2,
    responseRate: 39,
    conversionRate: 11,
    expectedRevenue: '$14,200/yr',
    expectedCommission: '$1,704',
    aiInsight: 'Seminar attendees respond 4.8x better to follow-up within 48hrs. Post-retirement leads with a specific "money in motion" event (CD, 401k rollover) close at 31% vs 8% without.',
    messages: [
      { seq: 1, channel: 'Email',    day: 0,  subject: 'Great meeting you at the Retirement Workshop — here\'s your income analysis', openRate: 82 },
      { seq: 2, channel: 'Phone',    day: 2,  subject: 'Follow-up call — 10-min retirement income review', openRate: 55 },
      { seq: 3, channel: 'Email',    day: 7,  subject: 'Your CD matures in 6 weeks — here are 3 options', openRate: 68 },
      { seq: 4, channel: 'Email',    day: 14, subject: 'Annuity income comparison: what $180K buys you for life', openRate: 51 }
    ],
    respondedLeads: [
      { id:'L005', name:'Julia Chen',   response:'Replied email Day 0 — "Yes please send the analysis"', stage:'Proposal sent, in review' },
      { id:'L012', name:'Derek Walton', response:'Took phone call Day 2 — "I need to sort out my wife\'s LTC situation"', stage:'Qualified, meeting scheduled' }
    ]
  },
  {
    id: 'CAM004',
    name: 'High-Income Mortgage Protection',
    status: 'completed',
    statusColor: '#64748b',
    type: 'Public Record — Mortgage Filing',
    typeIcon: 'fa-home',
    qualifier: 'Mortgage > $500K filed within 30 days; household income $150K+; no life coverage on property detected',
    targetSegment: 'New Homeowners — Term Life + LTC',
    channel: 'Direct Mail + Email + Phone',
    startDate: 'Mar 1, 2026',
    endDate: 'Mar 31, 2026',
    targetLeads: ['L002'],
    prospectIds: ['P002'],
    totalTargeted: 22,
    delivered: 21,
    opened: 16,
    responded: 8,
    meetingsBooked: 5,
    converted: 3,
    responseRate: 36,
    conversionRate: 14,
    expectedRevenue: '$28,800/yr',
    expectedCommission: '$3,456',
    aiInsight: 'Mortgage-triggered outreach works best when it references the specific property and loan amount. "Your $740K home is unprotected" outperforms generic "life insurance for homeowners" by 2.8x.',
    messages: [
      { seq: 1, channel: 'Direct Mail', day: 0,  subject: 'Congratulations on your new home at [Address]', openRate: 45 },
      { seq: 2, channel: 'Email',       day: 5,  subject: 'One thing most new homeowners forget (it\'s not the mortgage payment)', openRate: 63 },
      { seq: 3, channel: 'Phone',       day: 10, subject: 'Outbound call — mortgage protection review', openRate: 50 }
    ],
    respondedLeads: [
      { id:'L002', name:'Nancy Foster', response:'Opened email Day 5, replied "what do you recommend?"', stage:'Proposal sent, reviewing' }
    ]
  },
  {
    id: 'CAM005',
    name: 'HNWI Estate & Wealth Transfer',
    status: 'active',
    statusColor: '#059669',
    type: 'LinkedIn HNWI Campaign — IPO / Wealth Event',
    typeIcon: 'fa-crown',
    qualifier: 'Income $500K+; IPO / equity event / wealth milestone; age 45–60; no estate plan or outdated',
    targetSegment: 'High Net Worth — UL $1M+ + Estate',
    channel: 'LinkedIn + Personalized Email + In-Person',
    startDate: 'Apr 5, 2026',
    endDate: 'May 31, 2026',
    targetLeads: ['L008', 'L006'],
    prospectIds: ['P008', 'P006'],
    totalTargeted: 6,
    delivered: 6,
    opened: 6,
    responded: 4,
    meetingsBooked: 3,
    converted: 1,
    responseRate: 67,
    conversionRate: 17,
    expectedRevenue: '$68,400/yr',
    expectedCommission: '$8,208',
    aiInsight: 'HNWI prospects require 1:1 personalization — bulk messaging kills response rate. LinkedIn InMail with specific wealth event reference (IPO, vesting) achieves 67% response vs 12% generic. Avg close cycle: 45–90 days.',
    messages: [
      { seq: 1, channel: 'LinkedIn InMail', day: 0,  subject: 'Congratulations on the FinTech Corp IPO — a thought on protecting that wealth', openRate: 92 },
      { seq: 2, channel: 'Email',           day: 5,  subject: 'Estate transfer strategy for $480K vesting event — 3 options', openRate: 84 },
      { seq: 3, channel: 'Phone / Zoom',    day: 10, subject: 'Personal call — wealth protection conversation', openRate: 70 }
    ],
    respondedLeads: [
      { id:'L008', name:'Thomas Wright', response:'LinkedIn reply Day 0 — "Good timing, let\'s connect"', stage:'Meeting scheduled Apr 12' },
      { id:'L006', name:'Grace Lee',     response:'Email reply Day 5 — "Send me the estate analysis"', stage:'Qualified, follow-up Apr 14' }
    ]
  }
];

// ── STATE ─────────────────────────────────────────────────────
var _leadsCurrentFilter = 'all';
var _leadsSearchTerm = '';
var _currentLeadId = null;
var _pmailModalLeadId = null;
var _pmailStep = 1;
var _pmailAnswers = {};

// ── LEADS PAGE INIT ───────────────────────────────────────────
function initLeadsPage() {
  renderLeadsList();
  renderLeadStats();
  console.log('Leads page initialised — ' + leadsData.length + ' leads loaded');
}

function renderLeadStats() {
  var total    = leadsData.length;
  var newLeads = leadsData.filter(function(l){ return l.status==='new'; }).length;
  var qual     = leadsData.filter(function(l){ return l.status==='qualified'; }).length;
  var conv     = leadsData.filter(function(l){ return l.status==='converted'; }).length;

  var s = document.getElementById('lead-stat-total');    if(s) s.textContent = total;
  var n = document.getElementById('lead-stat-new');      if(n) n.textContent = newLeads;
  var q = document.getElementById('lead-stat-qualified');if(q) q.textContent = qual;
  var c = document.getElementById('lead-stat-converted');if(c) c.textContent = conv;
}

function filterLeadsByStatus(status) {
  _leadsCurrentFilter = status;
  document.querySelectorAll('.leads-filter-tab').forEach(function(t){
    t.classList.toggle('active', t.dataset.filter === status);
  });
  renderLeadsList();
}

function searchLeads(term) {
  _leadsSearchTerm = term.toLowerCase();
  renderLeadsList();
}

function renderLeadsList() {
  var container = document.getElementById('leads-list-container');
  if (!container) return;

  var filtered = leadsData.filter(function(l) {
    var matchFilter = _leadsCurrentFilter === 'all' || l.status === _leadsCurrentFilter;
    var matchSearch = !_leadsSearchTerm ||
      l.name.toLowerCase().includes(_leadsSearchTerm) ||
      l.city.toLowerCase().includes(_leadsSearchTerm) ||
      l.occupation.toLowerCase().includes(_leadsSearchTerm) ||
      l.lifeEventTrigger.toLowerCase().includes(_leadsSearchTerm);
    return matchFilter && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="leads-empty"><i class="fas fa-search"></i><p>No leads match your filter.</p></div>';
    return;
  }

  container.innerHTML = filtered.map(function(lead) {
    var pp = propensityProfiles[lead.id];
    var pm = pmailScores[lead.id];
    var statusClass = { new:'lead-status-new', qualified:'lead-status-qualified', converted:'lead-status-converted' }[lead.status] || 'lead-status-new';
    var statusLabel = { new:'New Lead', qualified:'Qualified', converted:'Prospect' }[lead.status] || 'New';
    var scoreColor = pp.closePct >= 80 ? '#059669' : pp.closePct >= 60 ? '#d97706' : '#dc2626';
    var sourceIcon = {
      'client-referral':'fa-users', 'linkedin':'fa-linkedin', 'seminar':'fa-chalkboard-teacher',
      'public-record':'fa-file-alt', 'life-event-alert':'fa-bell', 'event':'fa-calendar-alt',
      'campaign-linkedin':'fa-bullhorn', 'campaign-social':'fa-hashtag',
      'inbound-digital':'fa-globe', 'association-list':'fa-id-card',
      'ai-scan':'fa-robot'
    }[lead.referralType] || 'fa-user';

    var pmailHtml = '';
    if (pm) {
      var letters = ['P','M','A','I','L'];
      var scores  = [pm.P, pm.M, pm.A, pm.I, pm.L];
      pmailHtml = '<div class="lead-pmail-row">' +
        letters.map(function(l,i){
          var sc = scores[i];
          var cls = sc >= 5 ? 'pmail-dot-full' : sc >= 3 ? 'pmail-dot-partial' : 'pmail-dot-low';
          return '<span class="pmail-dot ' + cls + '" title="' + l + ': ' + sc + '/5">' + l + '</span>';
        }).join('') +
        '<span class="pmail-total" style="color:' + (pm.qualified?'#059669':'#dc2626') + '">' + (pm.qualified ? '✓ Qualified' : '⏳ Pending') + '</span>' +
      '</div>';
    }

    var actionBtn = '';
    if (lead.status === 'new') {
      actionBtn = '<button class="lead-action-btn lead-action-qualify" onclick="openPMAILModal(\'' + lead.id + '\')"><i class="fas fa-clipboard-check"></i> Run PMAIL</button>';
    } else if (lead.status === 'qualified') {
      actionBtn = '<button class="lead-action-btn lead-action-convert" onclick="openConvertToProspect(\'' + lead.id + '\')"><i class="fas fa-user-plus"></i> Create Prospect</button>';
    } else {
      actionBtn = '<button class="lead-action-btn lead-action-view" onclick="viewLinkedProspect(\'' + lead.prospectId + '\')"><i class="fas fa-eye"></i> View Prospect</button>';
    }

    return '<div class="lead-card" id="lead-' + lead.id + '" onclick="selectLead(\'' + lead.id + '\')">' +
      '<div class="lead-card-top">' +
        '<div class="lead-avatar" style="background:' + lead.avatarColor + '">' + lead.initials + '</div>' +
        '<div class="lead-card-info">' +
          '<div class="lead-card-name">' + lead.name + '</div>' +
          '<div class="lead-card-occ">' + lead.occupation + '</div>' +
          '<div class="lead-card-city"><i class="fas fa-map-marker-alt"></i> ' + lead.city + '</div>' +
        '</div>' +
        '<div class="lead-card-right">' +
          '<span class="lead-status-pill ' + statusClass + '">' + statusLabel + '</span>' +
          '<div class="lead-score-badge" style="background:' + scoreColor + '">' +
            '<span class="lead-score-num">' + pp.closePct + '</span>' +
            '<span class="lead-score-lbl">AI Score</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="lead-event-strip">' +
        '<i class="fas fa-bolt lead-event-icon"></i>' +
        '<span class="lead-event-text">' + lead.lifeEventTrigger + ' — ' + lead.lifeEventDetail.substring(0,60) + (lead.lifeEventDetail.length>60?'…':'') + '</span>' +
      '</div>' +
      '<div class="lead-meta-row">' +
        '<span class="lead-meta-item"><i class="fas fa-dollar-sign"></i> ' + lead.estimatedIncome + '</span>' +
        '<span class="lead-meta-item"><i class="fas ' + sourceIcon + '"></i> ' + lead.referralType.replace(/-/g,' ') + '</span>' +
        '<span class="lead-meta-item"><i class="fas fa-tag"></i> ' + lead.productInterest.slice(0,2).join(', ') + '</span>' +
      '</div>' +
      '<div class="lead-propensity-chip">' +
        '<i class="fas fa-brain"></i> Matches <strong>' + pp.closedCasesLike + ' closed cases</strong> — ' + pp.topProducts +
      '</div>' +
      pmailHtml +
      '<div class="lead-card-footer">' +
        '<span class="lead-foot-date"><i class="fas fa-calendar"></i> Added ' + lead.entryDate + '</span>' +
        actionBtn +
      '</div>' +
    '</div>';
  }).join('');
}

function selectLead(id) {
  _currentLeadId = id;
  document.querySelectorAll('.lead-card').forEach(function(c){ c.classList.remove('lead-card-active'); });
  var card = document.getElementById('lead-' + id);
  if (card) card.classList.add('lead-card-active');
  renderLeadDetail(id);
}

function renderLeadDetail(id) {
  var panel = document.getElementById('lead-detail-panel');
  if (!panel) return;
  var lead = leadsData.find(function(l){ return l.id === id; });
  if (!lead) return;
  var pp = propensityProfiles[id];
  var pm = pmailScores[id];
  var scoreColor = pp.closePct >= 80 ? '#059669' : pp.closePct >= 60 ? '#d97706' : '#dc2626';

  var pmailDetailHtml = '';
  if (pm) {
    var items = [
      { letter:'P', label:'Product Fit',        score:pm.P, desc:'Does a specific NYL product clearly address this prospect\'s need?' },
      { letter:'M', label:'Money (Budget)',      score:pm.M, desc:'Can they afford the premium? Is there a clear budget or financial event?' },
      { letter:'A', label:'Authority',           score:pm.A, desc:'Is this person the sole or primary decision maker?' },
      { letter:'I', label:'Insurability',        score:pm.I, desc:'Based on available data, are there significant health barriers?' },
      { letter:'L', label:'Life Event / Urgency',score:pm.L, desc:'Is there a current trigger that creates urgency to act now?' }
    ];
    pmailDetailHtml = '<div class="ld-section">' +
      '<div class="ld-section-title"><i class="fas fa-clipboard-check"></i> PMAIL Qualification Score — ' + pm.total + '/100</div>' +
      '<div class="ld-pmail-grid">' +
      items.map(function(item){
        var pct = (item.score/5)*100;
        var color = item.score>=5?'#059669':item.score>=3?'#d97706':'#dc2626';
        return '<div class="ld-pmail-item">' +
          '<div class="ld-pmail-letter" style="background:' + color + '">' + item.letter + '</div>' +
          '<div class="ld-pmail-body">' +
            '<div class="ld-pmail-label">' + item.label + ' — <strong>' + item.score + '/5</strong></div>' +
            '<div class="ld-pmail-bar"><div class="ld-pmail-fill" style="width:' + pct + '%;background:' + color + '"></div></div>' +
            '<div class="ld-pmail-desc">' + item.desc + '</div>' +
          '</div>' +
        '</div>';
      }).join('') +
      '</div>' +
      '<div class="ld-pmail-notes"><i class="fas fa-robot"></i> ' + pm.qualNotes + '</div>' +
    '</div>';
  }

  panel.innerHTML = '<div class="lead-detail-content">' +
    '<div class="ld-header">' +
      '<div class="ld-avatar" style="background:' + lead.avatarColor + '">' + lead.initials + '</div>' +
      '<div class="ld-header-info">' +
        '<div class="ld-name">' + lead.name + '</div>' +
        '<div class="ld-occ">' + lead.occupation + '</div>' +
        '<div class="ld-location"><i class="fas fa-map-marker-alt"></i> ' + lead.city + '</div>' +
      '</div>' +
      '<div class="ld-score-circle" style="background:' + scoreColor + '">' +
        '<span class="ld-score-num">' + pp.closePct + '</span>' +
        '<span class="ld-score-lbl">AI Score</span>' +
      '</div>' +
    '</div>' +

    '<div class="ld-contact-row">' +
      '<a href="mailto:' + lead.email + '" class="ld-contact-btn"><i class="fas fa-envelope"></i>' + lead.email + '</a>' +
      '<a href="tel:' + lead.phone + '" class="ld-contact-btn"><i class="fas fa-phone"></i>' + lead.phone + '</a>' +
    '</div>' +

    '<div class="ld-section">' +
      '<div class="ld-section-title"><i class="fas fa-bolt"></i> Life Event Trigger</div>' +
      '<div class="ld-life-event-box">' +
        '<div class="ld-life-event-trigger">' + lead.lifeEventTrigger + '</div>' +
        '<div class="ld-life-event-detail">' + lead.lifeEventDetail + '</div>' +
      '</div>' +
    '</div>' +

    '<div class="ld-section">' +
      '<div class="ld-section-title"><i class="fas fa-info-circle"></i> Lead Profile</div>' +
      '<div class="ld-grid">' +
        '<div class="ld-field"><div class="ld-field-label">Age</div><div class="ld-field-val">' + lead.age + '</div></div>' +
        '<div class="ld-field"><div class="ld-field-label">Est. Income</div><div class="ld-field-val">' + lead.estimatedIncome + '</div></div>' +
        '<div class="ld-field"><div class="ld-field-label">Source</div><div class="ld-field-val">' + lead.referralSource + '</div></div>' +
        '<div class="ld-field"><div class="ld-field-label">Entry Date</div><div class="ld-field-val">' + lead.entryDate + '</div></div>' +
        '<div class="ld-field"><div class="ld-field-label">Contact Attempts</div><div class="ld-field-val">' + lead.contactAttempts + (lead.lastContact ? ' · Last: ' + lead.lastContact : '') + '</div></div>' +
        '<div class="ld-field"><div class="ld-field-label">Product Interest</div><div class="ld-field-val">' + lead.productInterest.join(', ') + '</div></div>' +
      '</div>' +
    '</div>' +

    '<div class="ld-section">' +
      '<div class="ld-section-title"><i class="fas fa-brain"></i> AI Propensity Match</div>' +
      '<div class="ld-propensity-box">' +
        '<div class="ld-prop-stat"><span class="ld-prop-num">' + pp.closedCasesLike + '</span><span class="ld-prop-lbl">Similar Closed Cases</span></div>' +
        '<div class="ld-prop-stat"><span class="ld-prop-num" style="color:' + scoreColor + '">' + pp.closePct + '%</span><span class="ld-prop-lbl">Close Probability</span></div>' +
        '<div class="ld-prop-stat"><span class="ld-prop-num">' + pp.topProducts + '</span><span class="ld-prop-lbl">Top Product Match</span></div>' +
        '<div class="ld-prop-insight">' + pp.matchDesc + '</div>' +
      '</div>' +
    '</div>' +

    pmailDetailHtml +

    (lead.notes ? '<div class="ld-section"><div class="ld-section-title"><i class="fas fa-sticky-note"></i> Agent Notes</div><div class="ld-notes">' + lead.notes + '</div></div>' : '') +

    '<div class="ld-actions">' +
      (lead.status === 'new' ?
        '<button class="ld-act-btn ld-act-primary" onclick="openPMAILModal(\'' + lead.id + '\')"><i class="fas fa-clipboard-check"></i> Run PMAIL Qualification</button>' : '') +
      (lead.status === 'qualified' ?
        '<button class="ld-act-btn ld-act-green" onclick="openConvertToProspect(\'' + lead.id + '\')"><i class="fas fa-user-plus"></i> Create Prospect in CRM</button>' : '') +
      (lead.status === 'converted' ?
        '<button class="ld-act-btn ld-act-primary" onclick="viewLinkedProspect(\'' + lead.prospectId + '\')"><i class="fas fa-eye"></i> View Prospect Record</button>' : '') +
      '<button class="ld-act-btn ld-act-secondary" onclick="openOutreachModal(\'' + lead.id + '\')"><i class="fas fa-paper-plane"></i> Outreach</button>' +
      '<button class="ld-act-btn ld-act-secondary"><i class="fas fa-calendar-plus"></i> Schedule Call</button>' +
    '</div>' +
  '</div>';
}

// ── PMAIL QUALIFICATION MODAL ─────────────────────────────────
var pmailQuestions = [
  {
    letter: 'P', label: 'Product Fit',
    color: '#003087',
    question: 'Is there a specific NYL product that clearly matches this prospect\'s stated need or detected gap?',
    options: [
      { score: 5, label: 'Strong match — clear primary product identified and prospect has shown interest' },
      { score: 4, label: 'Good match — product identified, prospect open but not yet expressed strong interest' },
      { score: 3, label: 'Possible match — some alignment but product mix uncertain' },
      { score: 2, label: 'Weak match — prospect needs exist but no clear product fit yet' },
      { score: 1, label: 'No clear match — prospect profile does not align with current product offerings' }
    ]
  },
  {
    letter: 'M', label: 'Money / Budget',
    color: '#059669',
    question: 'Does the prospect have the financial capacity to afford the recommended premium? Is there a budget or financial event that creates capacity?',
    options: [
      { score: 5, label: 'Budget confirmed — prospect stated willingness to pay OR clear financial event (CD maturity, IPO vesting, income increase)' },
      { score: 4, label: 'Income suggests capacity — est. income supports premium, no direct confirmation yet' },
      { score: 3, label: 'Marginal capacity — income is sufficient but tight; may require product adjustment' },
      { score: 2, label: 'Financial constraints present — student loans, high debt, or limited disposable income' },
      { score: 1, label: 'Clear financial barrier — income or debt situation makes premium unlikely affordable' }
    ]
  },
  {
    letter: 'A', label: 'Authority / Decision Maker',
    color: '#7c3aed',
    question: 'Is this prospect the primary or sole decision maker for purchasing insurance?',
    options: [
      { score: 5, label: 'Sole decision maker — confirmed single adult, business owner, or stated they make financial decisions independently' },
      { score: 4, label: 'Primary decision maker — spouse/partner exists but prospect leads financial decisions' },
      { score: 3, label: 'Joint decision — spouse/partner must be involved; both parties reasonably accessible' },
      { score: 2, label: 'Influencer, not buyer — this person influences but another party holds final authority' },
      { score: 1, label: 'Not the decision maker — prospect has explicitly deferred to another person' }
    ]
  },
  {
    letter: 'I', label: 'Insurability',
    color: '#d97706',
    question: 'Based on available data, are there likely significant health barriers that could affect insurability or rating class?',
    options: [
      { score: 5, label: 'Excellent insurability — age/profile suggests Preferred or Preferred Plus; no known health issues' },
      { score: 4, label: 'Good insurability — minor issues possible (controlled BP, weight) but Standard+ likely' },
      { score: 3, label: 'Moderate risk — some health history (diabetes controlled, past surgery); Table 2–4 possible' },
      { score: 2, label: 'Elevated risk — significant health history; rated or modified offer likely; set expectations' },
      { score: 1, label: 'High risk / likely uninsurable — recent major diagnosis, active cancer, etc.' }
    ]
  },
  {
    letter: 'L', label: 'Life Event / Urgency',
    color: '#dc2626',
    question: 'Is there a current life event or trigger that creates urgency for the prospect to act now?',
    options: [
      { score: 5, label: 'Acute event — new baby, recent home purchase, death of loved one, imminent CD maturity, IPO vesting within 90 days' },
      { score: 4, label: 'Recent event — event within 3–6 months (promotion, new business, marriage, divorce)' },
      { score: 3, label: 'Emerging trigger — event is anticipated within 12 months (planned retirement, child approaching college)' },
      { score: 2, label: 'Mild trigger — general life stage (mid-career, income growth) without specific event' },
      { score: 1, label: 'No clear trigger — prospect is stable with no identified life event driving urgency' }
    ]
  }
];

function openPMAILModal(leadId) {
  _pmailModalLeadId = leadId;
  _pmailStep = 1;
  _pmailAnswers = {};
  var lead = leadsData.find(function(l){ return l.id === leadId; });
  if (!lead) return;

  // Build and inject the modal
  var overlay = document.createElement('div');
  overlay.id = 'pmail-overlay';
  overlay.className = 'pmail-overlay';
  overlay.innerHTML = buildPMAILModalHTML(lead);
  document.body.appendChild(overlay);
  renderPMAILStep();
}

function buildPMAILModalHTML(lead) {
  var pp = propensityProfiles[lead.id];
  return '<div class="pmail-modal">' +
    '<div class="pmail-modal-header">' +
      '<div class="pmail-modal-title-block">' +
        '<div class="pmail-modal-lead-avatar" style="background:' + lead.avatarColor + '">' + lead.initials + '</div>' +
        '<div>' +
          '<div class="pmail-modal-title">PMAIL Qualification — ' + lead.name + '</div>' +
          '<div class="pmail-modal-sub">' + lead.lifeEventTrigger + ' · ' + lead.estimatedIncome + ' · ' + lead.referralType.replace(/-/g,' ') + '</div>' +
        '</div>' +
      '</div>' +
      '<button class="pmail-modal-close" onclick="closePMAILModal()">×</button>' +
    '</div>' +
    '<div class="pmail-progress-bar">' +
      [1,2,3,4,5].map(function(i){
        return '<div class="pmail-prog-step" id="pmail-prog-' + i + '">' +
          pmailQuestions[i-1].letter +
        '</div>';
      }).join('<div class="pmail-prog-arrow">›</div>') +
    '</div>' +
    '<div class="pmail-modal-body" id="pmail-modal-body"></div>' +
    '<div class="pmail-modal-footer">' +
      '<button class="pmail-btn-back" id="pmail-btn-back" onclick="pmailBack()" style="display:none"><i class="fas fa-arrow-left"></i> Back</button>' +
      '<div class="pmail-step-indicator" id="pmail-step-indicator">Step 1 of 5</div>' +
      '<button class="pmail-btn-next" id="pmail-btn-next" onclick="pmailNext()" disabled>Next <i class="fas fa-arrow-right"></i></button>' +
    '</div>' +
  '</div>';
}

function renderPMAILStep() {
  var body = document.getElementById('pmail-modal-body');
  if (!body) return;
  var q = pmailQuestions[_pmailStep - 1];
  var lead = leadsData.find(function(l){ return l.id === _pmailModalLeadId; });
  var pp = propensityProfiles[_pmailModalLeadId];

  // Update progress dots
  for (var i = 1; i <= 5; i++) {
    var dot = document.getElementById('pmail-prog-' + i);
    if (!dot) continue;
    dot.className = 'pmail-prog-step';
    if (i < _pmailStep) dot.className += ' done';
    else if (i === _pmailStep) dot.className += ' active';
    dot.style.background = i === _pmailStep ? q.color : i < _pmailStep ? '#059669' : '#e2e8f0';
    dot.style.color = (i === _pmailStep || i < _pmailStep) ? '#fff' : '#94a3b8';
  }

  // Update step indicator
  var si = document.getElementById('pmail-step-indicator');
  if (si) si.textContent = 'Step ' + _pmailStep + ' of 5';

  // Back / Next buttons
  var back = document.getElementById('pmail-btn-back');
  var next = document.getElementById('pmail-btn-next');
  if (back) back.style.display = _pmailStep > 1 ? 'inline-flex' : 'none';
  if (next) {
    next.disabled = !_pmailAnswers[_pmailStep];
    if (_pmailStep === 5) {
      next.innerHTML = 'Calculate Score <i class="fas fa-calculator"></i>';
    } else {
      next.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }
  }

  // Context hint based on lead data
  var contextHint = '';
  if (_pmailStep === 1) contextHint = 'AI Detected: ' + lead.productInterest.join(', ');
  if (_pmailStep === 2) contextHint = 'AI Detected Income: ' + lead.estimatedIncome;
  if (_pmailStep === 3) contextHint = 'Source: ' + lead.referralSource;
  if (_pmailStep === 4) contextHint = 'Age: ' + lead.age + ' · Profile: ' + lead.occupation.split('—')[0];
  if (_pmailStep === 5) contextHint = 'Life Event: ' + lead.lifeEventDetail;

  body.innerHTML = '<div class="pmail-question-block">' +
    '<div class="pmail-q-header" style="border-left:4px solid ' + q.color + '">' +
      '<div class="pmail-q-letter" style="background:' + q.color + '">' + q.letter + '</div>' +
      '<div class="pmail-q-label-group">' +
        '<div class="pmail-q-label">' + q.label + '</div>' +
        '<div class="pmail-q-hint"><i class="fas fa-robot"></i> ' + contextHint + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="pmail-q-text">' + q.question + '</div>' +
    '<div class="pmail-options">' +
      q.options.map(function(opt) {
        var selected = _pmailAnswers[_pmailStep] === opt.score;
        return '<div class="pmail-option ' + (selected ? 'pmail-option-selected' : '') + '" onclick="selectPMAILOption(' + opt.score + ')" style="' + (selected ? 'border-color:' + q.color + ';background:' + q.color + '10' : '') + '">' +
          '<div class="pmail-option-score" style="' + (selected ? 'background:' + q.color + ';color:#fff' : '') + '">' + opt.score + '</div>' +
          '<div class="pmail-option-label">' + opt.label + '</div>' +
        '</div>';
      }).join('') +
    '</div>' +
  '</div>';
}

function selectPMAILOption(score) {
  _pmailAnswers[_pmailStep] = score;
  var next = document.getElementById('pmail-btn-next');
  if (next) next.disabled = false;
  renderPMAILStep();
}

function pmailNext() {
  if (!_pmailAnswers[_pmailStep]) return;
  if (_pmailStep < 5) {
    _pmailStep++;
    renderPMAILStep();
  } else {
    showPMAILResult();
  }
}

function pmailBack() {
  if (_pmailStep > 1) {
    _pmailStep--;
    renderPMAILStep();
  }
}

function showPMAILResult() {
  var body = document.getElementById('pmail-modal-body');
  if (!body) return;
  var lead = leadsData.find(function(l){ return l.id === _pmailModalLeadId; });
  var pp = propensityProfiles[_pmailModalLeadId];

  var P = _pmailAnswers[1] || 0;
  var M = _pmailAnswers[2] || 0;
  var A = _pmailAnswers[3] || 0;
  var I = _pmailAnswers[4] || 0;
  var L = _pmailAnswers[5] || 0;
  var total = Math.round((P + M + A + I + L) / 25 * 100);
  var qualified = total >= 72;

  var color = total >= 80 ? '#059669' : total >= 60 ? '#d97706' : '#dc2626';
  var verdict = total >= 80 ? 'Strong Qualify' : total >= 72 ? 'Qualify' : total >= 50 ? 'Conditional' : 'Do Not Qualify';
  var verdictDesc = total >= 80 ? 'This lead is highly qualified. Move immediately to Prospect creation and schedule discovery meeting.' :
    total >= 72 ? 'Lead meets qualification threshold. Create Prospect record and begin outreach sequence.' :
    total >= 50 ? 'Lead shows potential but has qualification gaps. Address barriers before advancing.' :
    'Lead does not meet qualification criteria at this time. Nurture and re-evaluate in 90 days.';

  // Update footer buttons
  var footer = document.querySelector('.pmail-modal-footer');
  if (footer) {
    footer.innerHTML = '<button class="pmail-btn-back" onclick="pmailBackToStep5()"><i class="fas fa-arrow-left"></i> Revise</button>' +
      '<div class="pmail-step-indicator">PMAIL Score: ' + total + '/100</div>' +
      (qualified ?
        '<button class="pmail-btn-next pmail-btn-qualify" onclick="savePMAILAndQualify(' + P + ',' + M + ',' + A + ',' + I + ',' + L + ',' + total + ')"><i class="fas fa-user-plus"></i> Qualify & Create Prospect</button>' :
        '<button class="pmail-btn-next pmail-btn-nurture" onclick="savePMAILNurture(' + total + ')"><i class="fas fa-inbox"></i> Save & Nurture</button>');
  }

  body.innerHTML = '<div class="pmail-result-block">' +
    '<div class="pmail-result-score-ring" style="border-color:' + color + '">' +
      '<div class="pmail-result-score-num" style="color:' + color + '">' + total + '</div>' +
      '<div class="pmail-result-score-label">/ 100</div>' +
    '</div>' +
    '<div class="pmail-result-verdict" style="color:' + color + '">' + verdict + '</div>' +
    '<div class="pmail-result-desc">' + verdictDesc + '</div>' +
    '<div class="pmail-result-breakdown">' +
      [['P','Product Fit',P,pmailQuestions[0].color],
       ['M','Money',M,pmailQuestions[1].color],
       ['A','Authority',A,pmailQuestions[2].color],
       ['I','Insurability',I,pmailQuestions[3].color],
       ['L','Life Event',L,pmailQuestions[4].color]].map(function(r){
        var pct = (r[2]/5)*100;
        return '<div class="pmail-result-row">' +
          '<div class="pmail-result-letter" style="background:' + r[3] + '">' + r[0] + '</div>' +
          '<div class="pmail-result-name">' + r[1] + '</div>' +
          '<div class="pmail-result-bar"><div class="pmail-result-fill" style="width:' + pct + '%;background:' + r[3] + '"></div></div>' +
          '<div class="pmail-result-score">' + r[2] + '/5</div>' +
        '</div>';
      }).join('') +
    '</div>' +
    '<div class="pmail-result-propensity">' +
      '<i class="fas fa-brain"></i> <strong>AI Propensity:</strong> This lead matches ' + pp.closedCasesLike + ' closed cases — ' + pp.matchDesc +
    '</div>' +
  '</div>';
}

function pmailBackToStep5() {
  _pmailStep = 5;
  var footer = document.querySelector('.pmail-modal-footer');
  if (footer) {
    footer.innerHTML = '<button class="pmail-btn-back" id="pmail-btn-back" onclick="pmailBack()" style="display:inline-flex"><i class="fas fa-arrow-left"></i> Back</button>' +
      '<div class="pmail-step-indicator" id="pmail-step-indicator">Step 5 of 5</div>' +
      '<button class="pmail-btn-next" id="pmail-btn-next" onclick="pmailNext()">Calculate Score <i class="fas fa-calculator"></i></button>';
  }
  renderPMAILStep();
}

function savePMAILAndQualify(P, M, A, I, L, total) {
  var lead = leadsData.find(function(l){ return l.id === _pmailModalLeadId; });
  if (!lead) return;

  // Update lead status to qualified
  lead.status = 'qualified';
  pmailScores[_pmailModalLeadId] = {
    P: P, M: M, A: A, I: I, L: L, total: total,
    qualified: true,
    qualDate: new Date().toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'}),
    qualNotes: 'PMAIL completed by agent. Score: ' + total + '/100. Moving to prospect creation.'
  };

  closePMAILModal();
  showToast('✓ ' + lead.name + ' qualified (PMAIL ' + total + '/100) — ready to create Prospect', 'success');
  renderLeadsList();
  renderLeadStats();
  selectLead(_pmailModalLeadId);
}

function savePMAILNurture(total) {
  var lead = leadsData.find(function(l){ return l.id === _pmailModalLeadId; });
  if (!lead) return;
  closePMAILModal();
  showToast('Lead saved to nurture queue — PMAIL score: ' + total + '/100', 'info');
}

function closePMAILModal() {
  var overlay = document.getElementById('pmail-overlay');
  if (overlay) overlay.remove();
}

// ── CONVERT LEAD → PROSPECT ───────────────────────────────────
function openConvertToProspect(leadId) {
  var lead = leadsData.find(function(l){ return l.id === leadId; });
  if (!lead) return;
  var pm = pmailScores[leadId];
  var pp = propensityProfiles[leadId];
  var scoreColor = pp.closePct >= 80 ? '#059669' : pp.closePct >= 60 ? '#d97706' : '#dc2626';

  var overlay = document.createElement('div');
  overlay.id = 'convert-overlay';
  overlay.className = 'pmail-overlay';
  overlay.innerHTML = '<div class="convert-modal">' +
    '<div class="convert-modal-header">' +
      '<div class="convert-modal-title"><i class="fas fa-user-plus"></i> Create Prospect from Lead</div>' +
      '<button class="pmail-modal-close" onclick="closeConvertModal()">×</button>' +
    '</div>' +
    '<div class="convert-modal-body">' +
      '<div class="convert-lead-summary">' +
        '<div class="convert-lead-avatar" style="background:' + lead.avatarColor + '">' + lead.initials + '</div>' +
        '<div class="convert-lead-info">' +
          '<div class="convert-lead-name">' + lead.name + '</div>' +
          '<div class="convert-lead-sub">' + lead.occupation + ' · ' + lead.city + '</div>' +
          '<div class="convert-lead-event"><i class="fas fa-bolt"></i> ' + lead.lifeEventTrigger + '</div>' +
        '</div>' +
        '<div class="convert-score-badge" style="background:' + scoreColor + '">' +
          '<div class="convert-score-num">' + (pm ? pm.total : '—') + '</div>' +
          '<div class="convert-score-lbl">PMAIL</div>' +
        '</div>' +
      '</div>' +

      '<div class="convert-ai-prefill">' +
        '<div class="convert-ai-title"><i class="fas fa-robot"></i> AI Pre-filling Prospect Record…</div>' +
        '<div class="convert-prefill-list">' +
          '<div class="convert-prefill-item done"><i class="fas fa-check-circle"></i> Contact info copied from lead</div>' +
          '<div class="convert-prefill-item done"><i class="fas fa-check-circle"></i> PMAIL scores transferred (' + (pm ? pm.total : '—') + '/100)</div>' +
          '<div class="convert-prefill-item done"><i class="fas fa-check-circle"></i> Life event trigger logged</div>' +
          '<div class="convert-prefill-item done"><i class="fas fa-check-circle"></i> Propensity profile attached (' + pp.closedCasesLike + ' case matches)</div>' +
          '<div class="convert-prefill-item done"><i class="fas fa-check-circle"></i> Product interest flagged: ' + lead.productInterest.join(', ') + '</div>' +
          '<div class="convert-prefill-item done"><i class="fas fa-check-circle"></i> Source attribution saved: ' + lead.referralSource + '</div>' +
          '<div class="convert-prefill-item pending"><i class="fas fa-clock"></i> 3rd-party data enrichment (D&amp;B, Experian) — scheduled</div>' +
          '<div class="convert-prefill-item pending"><i class="fas fa-clock"></i> AI strategy brief — will generate at prospect creation</div>' +
        '</div>' +
      '</div>' +

      '<div class="convert-next-actions">' +
        '<div class="convert-next-title">What happens next:</div>' +
        '<div class="convert-next-step"><span class="convert-next-num">1</span> Prospect record created in CRM with full data</div>' +
        '<div class="convert-next-step"><span class="convert-next-num">2</span> AI generates outreach recommendation and talking points</div>' +
        '<div class="convert-next-step"><span class="convert-next-num">3</span> Lead marked as converted — linked to new Prospect record</div>' +
        '<div class="convert-next-step"><span class="convert-next-num">4</span> You can then schedule discovery meeting → FNA Discovery</div>' +
      '</div>' +
    '</div>' +
    '<div class="convert-modal-footer">' +
      '<button class="pmail-btn-back" onclick="closeConvertModal()">Cancel</button>' +
      '<button class="pmail-btn-next pmail-btn-qualify" onclick="executeConversion(\'' + leadId + '\')"><i class="fas fa-user-plus"></i> Create Prospect Record</button>' +
    '</div>' +
  '</div>';
  document.body.appendChild(overlay);
}

function executeConversion(leadId) {
  var lead = leadsData.find(function(l){ return l.id === leadId; });
  if (!lead) return;

  // Mark lead as converted
  lead.status = 'converted';
  // Assign the matching prospect ID (L001→P001, L010→P010, etc.)
  var num = leadId.replace('L','');
  lead.prospectId = 'P' + num;

  closeConvertModal();
  showToast('✓ Prospect created — ' + lead.name + ' added to Prospects. AI brief generating…', 'success');
  renderLeadsList();
  renderLeadStats();
  selectLead(leadId);

  // Simulate a brief delay then show "view prospect" prompt
  setTimeout(function() {
    showToast('AI strategy brief ready for ' + lead.name + ' — view in Prospects', 'info');
  }, 2500);
}

function closeConvertModal() {
  var overlay = document.getElementById('convert-overlay');
  if (overlay) overlay.remove();
}

function viewLinkedProspect(prospectId) {
  if (!prospectId) return;
  navigateTo('prospects');
  setTimeout(function() {
    if (typeof openProspectModal === 'function') openProspectModal(prospectId);
  }, 300);
}

// ── CAMPAIGNS PAGE ────────────────────────────────────────────
function initCampaignsPage() {
  renderCampaignGrid();
  renderCampaignStats();
  console.log('Campaigns page (Phase 1) initialised — ' + campaignData.length + ' campaigns');
}

function renderCampaignStats() {
  var active    = campaignData.filter(function(c){ return c.status==='active'; }).length;
  var totalResp = campaignData.reduce(function(s,c){ return s+c.responded; }, 0);
  var totalMtgs = campaignData.reduce(function(s,c){ return s+c.meetingsBooked; }, 0);
  var avgRate   = Math.round(campaignData.reduce(function(s,c){ return s+c.responseRate; },0)/campaignData.length);

  var sa = document.getElementById('camp-stat-active');      if(sa) sa.textContent = active;
  var sr = document.getElementById('camp-stat-responses');   if(sr) sr.textContent = totalResp;
  var sm = document.getElementById('camp-stat-meetings');    if(sm) sm.textContent = totalMtgs;
  var sg = document.getElementById('camp-stat-rate');        if(sg) sg.textContent = avgRate + '%';
}

function renderCampaignGrid() {
  var container = document.getElementById('campaigns-grid-container');
  if (!container) return;

  container.innerHTML = campaignData.map(function(camp) {
    var respPct = camp.responseRate;
    var convPct = camp.conversionRate;
    var statusBadge = camp.status === 'active'
      ? '<span class="camp-status-live"><i class="fas fa-circle"></i> LIVE</span>'
      : '<span class="camp-status-done">Completed</span>';

    var respondedHtml = camp.respondedLeads.map(function(r) {
      var lead = leadsData.find(function(l){ return l.id === r.id; });
      var initials = lead ? lead.initials : r.name.split(' ').map(function(w){ return w[0]; }).join('');
      var color = lead ? lead.avatarColor : '#64748b';
      return '<div class="camp-resp-item">' +
        '<div class="camp-resp-avatar" style="background:' + color + '">' + initials + '</div>' +
        '<div class="camp-resp-info">' +
          '<div class="camp-resp-name">' + r.name + '</div>' +
          '<div class="camp-resp-detail">' + r.response.substring(0,55) + (r.response.length>55?'…':'') + '</div>' +
          '<div class="camp-resp-stage"><i class="fas fa-arrow-right"></i> ' + r.stage + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    var msgHtml = camp.messages.map(function(msg) {
      return '<div class="camp-msg-item">' +
        '<span class="camp-msg-seq">Seq ' + msg.seq + '</span>' +
        '<span class="camp-msg-channel camp-ch-' + msg.channel.toLowerCase().replace(/[^a-z]/g,'') + '">' + msg.channel + '</span>' +
        '<span class="camp-msg-day">Day ' + msg.day + '</span>' +
        '<span class="camp-msg-subject">' + msg.subject.substring(0,45) + (msg.subject.length>45?'…':'') + '</span>' +
        '<span class="camp-msg-open">' + msg.openRate + '% open</span>' +
      '</div>';
    }).join('');

    return '<div class="camp-card" id="camp-' + camp.id + '">' +
      '<div class="camp-card-header">' +
        '<div class="camp-card-left">' +
          '<div class="camp-type-icon" style="background:' + camp.statusColor + '15;color:' + camp.statusColor + '"><i class="fas ' + camp.typeIcon + '"></i></div>' +
          '<div>' +
            '<div class="camp-card-name">' + camp.name + '</div>' +
            '<div class="camp-card-type">' + camp.type + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="camp-card-right">' +
          statusBadge +
          '<div class="camp-date-range">' + camp.startDate + ' – ' + camp.endDate + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="camp-qualifier-box">' +
        '<i class="fas fa-filter"></i> <strong>Qualifier:</strong> ' + camp.qualifier +
      '</div>' +

      '<div class="camp-metrics-row">' +
        '<div class="camp-metric">' +
          '<div class="camp-metric-val">' + camp.totalTargeted + '</div>' +
          '<div class="camp-metric-lbl">Targeted</div>' +
        '</div>' +
        '<div class="camp-metric">' +
          '<div class="camp-metric-val">' + camp.opened + '</div>' +
          '<div class="camp-metric-lbl">Opened</div>' +
        '</div>' +
        '<div class="camp-metric camp-metric-highlight">' +
          '<div class="camp-metric-val" style="color:#003087">' + camp.responded + '</div>' +
          '<div class="camp-metric-lbl">Responded</div>' +
        '</div>' +
        '<div class="camp-metric">' +
          '<div class="camp-metric-val">' + camp.meetingsBooked + '</div>' +
          '<div class="camp-metric-lbl">Meetings</div>' +
        '</div>' +
        '<div class="camp-metric">' +
          '<div class="camp-metric-val" style="color:#059669">' + camp.converted + '</div>' +
          '<div class="camp-metric-lbl">Converted</div>' +
        '</div>' +
      '</div>' +

      '<div class="camp-rate-bars">' +
        '<div class="camp-rate-row">' +
          '<span class="camp-rate-label">Response Rate</span>' +
          '<div class="camp-rate-bar"><div class="camp-rate-fill" style="width:' + respPct + '%;background:#003087"></div></div>' +
          '<span class="camp-rate-pct">' + respPct + '%</span>' +
        '</div>' +
        '<div class="camp-rate-row">' +
          '<span class="camp-rate-label">Conversion Rate</span>' +
          '<div class="camp-rate-bar"><div class="camp-rate-fill" style="width:' + Math.min(convPct*3,100) + '%;background:#059669"></div></div>' +
          '<span class="camp-rate-pct">' + convPct + '%</span>' +
        '</div>' +
      '</div>' +

      '<div class="camp-section-title"><i class="fas fa-users"></i> Responded Prospects</div>' +
      '<div class="camp-resp-list">' + respondedHtml + '</div>' +

      '<div class="camp-section-title"><i class="fas fa-envelope-open"></i> Message Sequence</div>' +
      '<div class="camp-msg-list">' + msgHtml + '</div>' +

      '<div class="camp-ai-insight"><i class="fas fa-lightbulb"></i> <strong>AI Insight:</strong> ' + camp.aiInsight + '</div>' +

      '<div class="camp-revenue-row">' +
        '<span class="camp-revenue-item"><i class="fas fa-dollar-sign"></i> Expected Revenue: <strong>' + camp.expectedRevenue + '</strong></span>' +
        '<span class="camp-revenue-item"><i class="fas fa-coins"></i> Expected Commission: <strong>' + camp.expectedCommission + '</strong></span>' +
      '</div>' +

      '<div class="camp-card-actions">' +
        '<button class="camp-act-btn camp-act-primary" onclick="viewCampaignProspects(\'' + camp.id + '\')"><i class="fas fa-users"></i> View Prospects</button>' +
        (camp.status === 'active' ? '<button class="camp-act-btn camp-act-secondary" onclick="openNewCampaignModal()"><i class="fas fa-plus"></i> New Campaign</button>' : '') +
        '<button class="camp-act-btn camp-act-secondary" onclick="openCampAIWizard()"><i class="fas fa-robot"></i> AI Wizard</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function viewCampaignProspects(campId) {
  var camp = campaignData.find(function(c){ return c.id === campId; });
  if (!camp) return;
  showToast('Showing ' + camp.respondedLeads.length + ' responded prospects for "' + camp.name + '"', 'info');
}

// ── TOAST HELPER ──────────────────────────────────────────────
function showToast(msg, type) {
  var existing = document.getElementById('phase1-toast');
  if (existing) existing.remove();
  var t = document.createElement('div');
  t.id = 'phase1-toast';
  t.className = 'phase1-toast phase1-toast-' + (type || 'success');
  t.innerHTML = msg;
  document.body.appendChild(t);
  setTimeout(function(){ t.classList.add('phase1-toast-show'); }, 10);
  setTimeout(function(){ t.classList.remove('phase1-toast-show'); setTimeout(function(){ t.remove(); }, 400); }, 3500);
}
