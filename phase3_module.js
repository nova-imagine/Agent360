/* ═══════════════════════════════════════════════════════════════════
   PHASE 3 — PRODUCT ILLUSTRATION & PROPOSAL ENGINE
   NYL Agent 360 · Product Illustration Hub
   ═══════════════════════════════════════════════════════════════════ */

/* ─── State ─────────────────────────────────────────────────────── */
var _p3ActiveProspect   = 'FNA-001';
var _p3ActiveProposal   = null;
var _p3IllustTab        = 'table';   // 'table' | 'chart'
var _p3SelectedOption   = 'A';
var _p3ObjCoachActive   = false;
var _p3ComplianceResult = null;

/* ─── Product Master Data ────────────────────────────────────────── */
var p3ProductCatalog = [
  {
    id: 'TERM10',   family: 'term',   name: 'Term Life 10-Year',
    shortName: 'Term 10', icon: 'fa-umbrella', color: '#3b82f6',
    desc: 'Level premium term protection for 10 years. Ideal for short-term income replacement needs.',
    minPremium: '$45/mo', riskLevel: 'Low',
    features: ['Level premiums for 10 years','Convertible to WL without evidence','Death benefit income-tax free','Return of premium rider available'],
    uwFactors: ['Age & gender','Smoker status','BMI','Medical history'],
    naicNote: 'Guaranteed column = level death benefit. Non-guaranteed = dividend projection N/A.'
  },
  {
    id: 'TERM20',   family: 'term',   name: 'Term Life 20-Year',
    shortName: 'Term 20', icon: 'fa-umbrella', color: '#2563eb',
    desc: '20-year level premium term — the most popular structure for mortgage protection and income replacement.',
    minPremium: '$68/mo', riskLevel: 'Low',
    features: ['Level premiums 20 years','Conversion privilege (no UW)','Children\'s term rider','Accelerated death benefit'],
    uwFactors: ['Age & gender','Smoker status','BMI','Occupation class'],
    naicNote: 'NAIC compliant — guaranteed vs illustrated columns required. Signature page mandatory.'
  },
  {
    id: 'TERM30',   family: 'term',   name: 'Term Life 30-Year',
    shortName: 'Term 30', icon: 'fa-umbrella', color: '#1d4ed8',
    desc: '30-year level premium — longest term available, suited for young families with large mortgages.',
    minPremium: '$95/mo', riskLevel: 'Low',
    features: ['Longest term available','Level death benefit through age 60–65','Waiver of premium rider','Convertible up to age 70'],
    uwFactors: ['Age & gender','Smoker status','Full UW required','Blood work & EKG for large amounts'],
    naicNote: 'Guaranteed column = guaranteed level premium. Non-guaranteed column N/A for term.'
  },
  {
    id: 'WL',       family: 'whole',  name: 'Whole Life (Participating)',
    shortName: 'Whole Life', icon: 'fa-shield-alt', color: '#0a0f1c',
    desc: 'Permanent protection with guaranteed cash value growth and annual dividends (not guaranteed).',
    minPremium: '$320/mo', riskLevel: 'Low',
    features: ['Guaranteed death benefit for life','Cash value grows tax-deferred','Annual dividends (not guaranteed)','Policy loans at favorable rates','Paid-up additions rider (PUAs)'],
    uwFactors: ['Full UW','Blood profile','EKG if age 45+','Aviation/hobbies'],
    naicNote: 'Illustration must show guaranteed and non-guaranteed columns. Dividend scale footnote required.'
  },
  {
    id: 'WLLP',     family: 'whole',  name: 'Whole Life Limited Pay (10-Pay)',
    shortName: 'WL 10-Pay', icon: 'fa-shield-alt', color: '#374151',
    desc: 'Premiums paid over 10 years; policy remains in-force for life. Higher premiums, faster cash value.',
    minPremium: '$680/mo', riskLevel: 'Low',
    features: ['Paid-up after 10 years','Higher cash value accumulation','Reduced paid-up option','Excellent for wealth transfer','Eligible for PUA rider'],
    uwFactors: ['Full UW','Same as standard WL'],
    naicNote: 'Show premium offset year in illustration. Dividend illustrations must include basis note.'
  },
  {
    id: 'GUL',      family: 'ul',     name: 'Guaranteed Universal Life (GUL)',
    shortName: 'GUL', icon: 'fa-layer-group', color: '#7c3aed',
    desc: 'Permanent no-lapse guarantee UL — lowest cost permanent death benefit, minimal cash value.',
    minPremium: '$210/mo', riskLevel: 'Medium',
    features: ['No-lapse guarantee to age 100','Lower cost than WL','Flexible premiums','Secondary guarantee clause','No dividend'],
    uwFactors: ['Full UW','Financial underwriting for large amounts'],
    naicNote: 'No-lapse guarantee must be clearly labeled. NAIC model reg illustration required.'
  },
  {
    id: 'IUL',      family: 'ul',     name: 'Indexed Universal Life (IUL)',
    shortName: 'IUL', icon: 'fa-chart-line', color: '#059669',
    desc: 'UL with cash value linked to S&P 500 index performance — upside cap, 0% floor protection.',
    minPremium: '$380/mo', riskLevel: 'Medium-High',
    features: ['S&P 500 indexed crediting','0% floor (no loss of cash value)','Cap rate 10–14% annually','Income rider available','Tax-advantaged retirement income'],
    uwFactors: ['Full UW','Financial justification for high face amounts'],
    naicNote: 'Must show AG49-B compliant illustrated rate. Non-guaranteed projections must use maximum and minimum scenarios.'
  },
  {
    id: 'VUL',      family: 'ul',     name: 'Variable Universal Life (VUL)',
    shortName: 'VUL', icon: 'fa-chart-area', color: '#dc2626',
    desc: 'UL with sub-accounts invested in market — highest growth potential, market risk.',
    minPremium: '$450/mo', riskLevel: 'High',
    features: ['Market-linked sub-accounts','Potential for high cash value','Death benefit flexibility','Series 6/63 licensed agent required','FINRA-regulated product'],
    uwFactors: ['Full UW','Series 6 license required to sell','Suitability assessment required'],
    naicNote: 'FINRA-regulated. Prospectus must be delivered. Illustration must show hypothetical, not projected, returns.'
  },
  {
    id: 'DI',       family: 'di',     name: 'Disability Income (DI)',
    shortName: 'DI', icon: 'fa-user-injured', color: '#f59e0b',
    desc: 'Replaces 60–70% of income if unable to work due to disability. Own-occupation definition.',
    minPremium: '$180/mo', riskLevel: 'Low',
    features: ['Own-occupation definition','60–70% of income replaced','90-day elimination period','Benefit to age 65','COLA rider available','Partial disability benefit'],
    uwFactors: ['Occupation class (A/B/C)','Income verification','Medical history','Mental/nervous condition history'],
    naicNote: 'Definition of disability must be clearly stated in illustration. Not subject to NAIC Life Illustration Reg.'
  },
  {
    id: 'LTC',      family: 'ltc',    name: 'Long Term Care (LTC)',
    shortName: 'LTC', icon: 'fa-hands-helping', color: '#06b6d4',
    desc: 'Covers nursing home, assisted living, and home care costs. Available as standalone or hybrid.',
    minPremium: '$250/mo', riskLevel: 'Low',
    features: ['$5,000–$10,000/mo benefit','Inflation protection rider','90-day elimination period','Shared care rider (couples)','Tax-deductible premiums (limits apply)'],
    uwFactors: ['ADL assessment','Cognitive screening','Medical history — significant restrictions'],
    naicNote: 'LTC Partnership compliant in most states. Benefit triggers must follow HIPAA guidelines.'
  },
  {
    id: 'LTCHYBRID',family: 'ltc',    name: 'LTC/Life Hybrid',
    shortName: 'LTC Hybrid', icon: 'fa-heart', color: '#0891b2',
    desc: 'Whole Life with long-term care acceleration rider — "use it or lose it" problem solved.',
    minPremium: '$420/mo', riskLevel: 'Low',
    features: ['Death benefit if LTC not used','LTC acceleration up to 100% of DB','Return of premium available','Single or multi-pay structures','Eliminates lapse risk of standalone LTC'],
    uwFactors: ['Combined UW for life + LTC','ADL assessment','Medical records review'],
    naicNote: 'Illustration must separately show life and LTC benefit streams. NAIC life illustration reg applies.'
  },
  {
    id: 'ANNUITY_FX',family: 'annuity',name: 'Fixed Annuity',
    shortName: 'Fixed Annuity', icon: 'fa-coins', color: '#d97706',
    desc: 'Guaranteed fixed interest rate for accumulation, tax-deferred. Ideal for conservative retirees.',
    minPremium: '$10,000 lump', riskLevel: 'Low',
    features: ['Guaranteed interest rate (4.2% current)','Tax-deferred growth','No market risk','Surrender charge period 5–10 years','Income stream options at annuitization'],
    uwFactors: ['Financial suitability (age + risk tolerance)','Surrender charge disclosure'],
    naicNote: 'Annuity illustration must show surrender schedule, accumulated value, and income projections.'
  },
  {
    id: 'ANNUITY_IDX',family: 'annuity',name: 'Indexed Annuity (FIA)',
    shortName: 'Indexed Annuity', icon: 'fa-chart-bar', color: '#b45309',
    desc: 'Fixed annuity with index-linked crediting — upside participation without market loss.',
    minPremium: '$25,000 lump', riskLevel: 'Low-Medium',
    features: ['S&P 500 participation rate 80–100%','0% floor on index performance','Income rider (+6%/yr rollup)','Retirement income stream for life','Tax-deferred accumulation'],
    uwFactors: ['Suitability assessment required','State-specific replacements disclosure'],
    naicNote: 'Annuity Best Interest regulation (Reg BI / NAIC Model 275) — suitability form required.'
  }
];

/* ─── Prospects ready for illustration (from FNA phase) ─────────── */
var p3Prospects = [
  {
    id: 'FNA-001', name: 'Alex Rivera', initials: 'AR', avatarGrad: 'linear-gradient(135deg,#1e3a5f,#3b82f6)',
    age: 34, gender: 'Male', smoker: false, riskClass: 'Preferred Plus',
    occupation: 'VP of Technology', income: 185000,
    coverageNeeded: 780000, annualBudget: 4200,
    gaps: ['No disability coverage','No LTC rider'],
    aiRec: 'WL $500K + DI $8,500/mo + PUAs · strong candidate for limited pay',
    fnaStatus: 'Gap Analysis Complete', urgency: 'high',
    existingCoverage: [{ type: 'Whole Life', carrier: 'NYL', faceAmount: 500000, premium: 2400 }]
  },
  {
    id: 'FNA-002', name: 'Nancy Foster', initials: 'NF', avatarGrad: 'linear-gradient(135deg,#6d28d9,#7c3aed)',
    age: 41, gender: 'Female', smoker: false, riskClass: 'Standard Plus',
    occupation: 'Healthcare Director', income: 220000,
    coverageNeeded: 1000000, annualBudget: 3600,
    gaps: ['No LTC coverage','Income gap $310K'],
    aiRec: 'Term 20-yr $1M + LTC Hybrid · flag mild HTN for UW rating',
    fnaStatus: 'Fact-Find Complete', urgency: 'medium',
    existingCoverage: [{ type: 'Term Life', carrier: 'External', faceAmount: 500000, premium: 1800 }]
  },
  {
    id: 'FNA-003', name: 'Patricia Nguyen', initials: 'PN', avatarGrad: 'linear-gradient(135deg,#dc2626,#f59e0b)',
    age: 48, gender: 'Female', smoker: false, riskClass: 'Table 2',
    occupation: 'Senior Operations Manager', income: 148000,
    coverageNeeded: 640000, annualBudget: 6200,
    gaps: ['$240K income gap','UL underfunded — lapse risk'],
    aiRec: 'UL premium increase OR convert to WL + PUAs · urgent action needed',
    fnaStatus: 'AI Recommendation Ready', urgency: 'urgent',
    existingCoverage: [{ type: 'Universal Life', carrier: 'NYL', faceAmount: 400000, premium: 2100 }]
  }
];

/* ─── Pre-built multi-product proposals ─────────────────────────── */
var p3ProposalData = {
  'FNA-001': {
    prospectId: 'FNA-001',
    prospectName: 'Alex Rivera',
    createdDate: 'May 8, 2026',
    agentNotes: 'Discuss PUA rider benefits at the next meeting. Alex is receptive to cash value growth story.',
    complianceStatus: 'pass',
    signatureObtained: false,
    options: [
      {
        id: 'A', label: 'Option A', tagline: 'Base Protection + Income Protection',
        recommended: true,
        products: [
          { productId: 'WL', faceAmount: 500000, annualPremium: 2400, riskClass: 'Preferred Plus', riders: ['PUA Rider $200/mo','WP Rider'] },
          { productId: 'DI', faceAmount: null, monthlyBenefit: 8500, annualPremium: 2160, riskClass: 'Class 4A', riders: ['COLA 3%','Future Purchase Option'] }
        ],
        totalAnnualPremium: 4560,
        aiSummary: 'Best overall fit — permanent coverage plus income protection addresses both identified gaps. Preferred Plus WL builds strong cash value trajectory reaching $284K by age 65.',
        projectedCashValue65: 284000,
        internalRateOfReturn: '4.8%',
        deathBenefitAt65: 610000,
        suitabilityScore: 94
      },
      {
        id: 'B', label: 'Option B', tagline: 'Whole Life with Maximum PUAs',
        recommended: false,
        products: [
          { productId: 'WLLP', faceAmount: 500000, annualPremium: 5400, riskClass: 'Preferred Plus', riders: ['PUA Rider $500/mo — maximize CSV','WP Rider'] }
        ],
        totalAnnualPremium: 5400,
        aiSummary: 'High cash value accumulation strategy — 10-pay structure frees up cash flow after year 10. Best for clients prioritizing tax-advantaged growth and wealth transfer.',
        projectedCashValue65: 412000,
        internalRateOfReturn: '5.1%',
        deathBenefitAt65: 730000,
        suitabilityScore: 88
      },
      {
        id: 'C', label: 'Option C', tagline: 'IUL with Retirement Income Rider',
        recommended: false,
        products: [
          { productId: 'IUL', faceAmount: 500000, annualPremium: 4200, riskClass: 'Preferred Plus', riders: ['Income Rider','Overloan Protection'] }
        ],
        totalAnnualPremium: 4200,
        aiSummary: 'Market-linked growth with downside protection. Income rider provides $28K/yr tax-free retirement income starting at age 65. Higher upside potential vs WL, less guarantees.',
        projectedCashValue65: 520000,
        internalRateOfReturn: '6.2% (illustrated, not guaranteed)',
        deathBenefitAt65: 580000,
        suitabilityScore: 81
      }
    ],
    illustrationYears: [
      { year: 1,  age: 35, annualPremium: 4560, guaranteedCV: 3200,  nonGuaranteedCV: 3800,  guaranteedDB: 500000, nonGuaranteedDB: 500000 },
      { year: 5,  age: 39, annualPremium: 4560, guaranteedCV: 19400, nonGuaranteedCV: 24600, guaranteedDB: 500000, nonGuaranteedDB: 524000 },
      { year: 10, age: 44, annualPremium: 4560, guaranteedCV: 46800, nonGuaranteedCV: 62400, guaranteedDB: 500000, nonGuaranteedDB: 558000 },
      { year: 15, age: 49, annualPremium: 4560, guaranteedCV: 82300, nonGuaranteedCV: 118000,guaranteedDB: 500000, nonGuaranteedDB: 596000 },
      { year: 20, age: 54, annualPremium: 4560, guaranteedCV: 128000,nonGuaranteedCV: 196000,guaranteedDB: 500000, nonGuaranteedDB: 638000 },
      { year: 25, age: 59, annualPremium: 4560, guaranteedCV: 184000,nonGuaranteedCV: 290000,guaranteedDB: 500000, nonGuaranteedDB: 682000 },
      { year: 31, age: 65, annualPremium: 4560, guaranteedCV: 246000,nonGuaranteedCV: 418000,guaranteedDB: 500000, nonGuaranteedDB: 740000 }
    ]
  },
  'FNA-002': {
    prospectId: 'FNA-002',
    prospectName: 'Nancy Foster',
    createdDate: 'May 7, 2026',
    agentNotes: 'Standard Plus rating due to mild HTN. LTC Hybrid particularly compelling — addresses both life and care needs.',
    complianceStatus: 'warn',
    signatureObtained: false,
    options: [
      {
        id: 'A', label: 'Option A', tagline: 'Term + LTC Hybrid Bundle',
        recommended: true,
        products: [
          { productId: 'TERM20', faceAmount: 1000000, annualPremium: 2160, riskClass: 'Standard Plus', riders: ['Accelerated DB','Children\'s Term'] },
          { productId: 'LTCHYBRID', faceAmount: 250000, annualPremium: 5040, riskClass: 'Standard Plus', riders: ['Inflation 3% Compound'] }
        ],
        totalAnnualPremium: 7200,
        aiSummary: 'Closes both identified gaps — $1M income replacement + LTC hybrid solves "use it or lose it" concern. Standard Plus adds modest rating but remains competitive.',
        projectedCashValue65: 180000,
        internalRateOfReturn: '3.8%',
        deathBenefitAt65: 1250000,
        suitabilityScore: 91
      },
      {
        id: 'B', label: 'Option B', tagline: 'Whole Life + Standalone LTC',
        recommended: false,
        products: [
          { productId: 'WL', faceAmount: 750000, annualPremium: 5760, riskClass: 'Standard Plus', riders: ['PUA Rider','WP'] },
          { productId: 'LTC', faceAmount: null, monthlyBenefit: 8000, annualPremium: 3840, riskClass: 'Standard Plus', riders: ['COLA 3%'] }
        ],
        totalAnnualPremium: 9600,
        aiSummary: 'Higher premium but maximum permanent coverage with strong LTC protection. Best for clients who want to maximize death benefit and have robust LTC benefits.',
        projectedCashValue65: 320000,
        internalRateOfReturn: '4.6%',
        deathBenefitAt65: 950000,
        suitabilityScore: 84
      },
      {
        id: 'C', label: 'Option C', tagline: 'Budget-Conscious Term Only',
        recommended: false,
        products: [
          { productId: 'TERM30', faceAmount: 1000000, annualPremium: 1560, riskClass: 'Standard Plus', riders: ['WP Rider'] }
        ],
        totalAnnualPremium: 1560,
        aiSummary: 'Lowest cost option. Addresses income replacement only — LTC gap remains open. Recommend converting term if budget improves. Leave-behind option for price objections.',
        projectedCashValue65: 0,
        internalRateOfReturn: 'N/A (term)',
        deathBenefitAt65: 1000000,
        suitabilityScore: 72
      }
    ],
    illustrationYears: [
      { year: 1,  age: 42, annualPremium: 7200, guaranteedCV: 4200,  nonGuaranteedCV: 5100,  guaranteedDB: 1000000, nonGuaranteedDB: 1000000 },
      { year: 5,  age: 46, annualPremium: 7200, guaranteedCV: 26000, nonGuaranteedCV: 33000, guaranteedDB: 1000000, nonGuaranteedDB: 1028000 },
      { year: 10, age: 51, annualPremium: 7200, guaranteedCV: 64000, nonGuaranteedCV: 86000, guaranteedDB: 1000000, nonGuaranteedDB: 1068000 },
      { year: 20, age: 61, annualPremium: 7200, guaranteedCV: 158000,nonGuaranteedCV: 248000,guaranteedDB: 1000000, nonGuaranteedDB: 1152000 },
      { year: 24, age: 65, annualPremium: 7200, guaranteedCV: 198000,nonGuaranteedCV: 328000,guaranteedDB: 1000000, nonGuaranteedDB: 1200000 }
    ]
  },
  'FNA-003': {
    prospectId: 'FNA-003',
    prospectName: 'Patricia Nguyen',
    createdDate: 'May 9, 2026',
    agentNotes: 'T2DM well-controlled — Table 2 rating expected. UL lapse risk is urgent. Client needs to act within 68 days.',
    complianceStatus: 'pass',
    signatureObtained: false,
    options: [
      {
        id: 'A', label: 'Option A', tagline: 'UL Premium Increase',
        recommended: false,
        products: [
          { productId: 'GUL', faceAmount: 400000, annualPremium: 5040, riskClass: 'Table 2', riders: ['No-lapse guarantee rider'] }
        ],
        totalAnnualPremium: 5040,
        aiSummary: 'Immediate action — increase monthly UL premium from $175 to $420 to secure no-lapse guarantee. Lowest disruption option but no cash value growth improvement.',
        projectedCashValue65: 42000,
        internalRateOfReturn: '2.1%',
        deathBenefitAt65: 400000,
        suitabilityScore: 77
      },
      {
        id: 'B', label: 'Option B', tagline: 'Convert UL → Whole Life + PUAs',
        recommended: true,
        products: [
          { productId: 'WL', faceAmount: 400000, annualPremium: 4320, riskClass: 'Table 2', riders: ['PUA Rider $150/mo','Waiver of Premium'] }
        ],
        totalAnnualPremium: 4320,
        aiSummary: 'Recommended — convert existing UL to WL using 1035 exchange. Eliminates lapse risk permanently, builds guaranteed cash value. PUAs accelerate cash value to $198K by age 65.',
        projectedCashValue65: 198000,
        internalRateOfReturn: '4.2%',
        deathBenefitAt65: 520000,
        suitabilityScore: 92
      },
      {
        id: 'C', label: 'Option C', tagline: 'WL + Retirement Income Gap Annuity',
        recommended: false,
        products: [
          { productId: 'WL', faceAmount: 300000, annualPremium: 3240, riskClass: 'Table 2', riders: ['PUA Rider'] },
          { productId: 'ANNUITY_IDX', faceAmount: null, lumpSum: 50000, annualPremium: 2400, riskClass: 'N/A', riders: ['Income Rider +6% rollup'] }
        ],
        totalAnnualPremium: 5640,
        aiSummary: 'Comprehensive — addresses lapse risk AND retirement income gap. FIA income rider projects $18K/yr starting at 65. Slightly higher premium but closes both gaps.',
        projectedCashValue65: 164000,
        internalRateOfReturn: '5.0%',
        deathBenefitAt65: 460000,
        suitabilityScore: 87
      }
    ],
    illustrationYears: [
      { year: 1,  age: 49, annualPremium: 4320, guaranteedCV: 2800,  nonGuaranteedCV: 3400,  guaranteedDB: 400000, nonGuaranteedDB: 400000 },
      { year: 5,  age: 53, annualPremium: 4320, guaranteedCV: 17200, nonGuaranteedCV: 21800, guaranteedDB: 400000, nonGuaranteedDB: 418000 },
      { year: 10, age: 58, annualPremium: 4320, guaranteedCV: 42600, nonGuaranteedCV: 56400, guaranteedDB: 400000, nonGuaranteedDB: 446000 },
      { year: 17, age: 65, annualPremium: 4320, guaranteedCV: 86000, nonGuaranteedCV: 132000,guaranteedDB: 400000, nonGuaranteedDB: 496000 }
    ]
  }
};

/* ─── Objection library ──────────────────────────────────────────── */
var p3Objections = [
  {
    id: 'price',
    trigger: 'too expensive|too much|can\'t afford|out of budget|cost too high',
    label: 'Price / Affordability',
    icon: 'fa-dollar-sign',
    color: '#ef4444',
    responses: [
      'Adjust face amount down by $100K — monthly premium drops from $380 to $310.',
      'Switch from Whole Life to 20-Year Term — same death benefit at 60% lower cost.',
      'Reduce paid-up addition rider to minimum — keeps core protection, cuts premium.',
      'Offer Option C (term only) as the leave-behind — simplest and most affordable.',
      '"What part of the budget concerns you most — the monthly amount or the commitment period?"'
    ],
    scriptCard: 'The price concern tells me this protection matters to you — otherwise you wouldn\'t be engaged. Let me show you two options at 30% less that still close your biggest gap. Which matters more to you right now — the monthly amount or the length of commitment?'
  },
  {
    id: 'complexity',
    trigger: 'too complicated|confusing|hard to understand|don\'t understand|complex',
    label: 'Complexity / Confusion',
    icon: 'fa-question-circle',
    color: '#f59e0b',
    responses: [
      'Simplify to one product: 20-year term covers the single biggest gap.',
      'Use plain-English explainer — "Think of it as renting vs. owning protection."',
      'Show just two columns: what your family gets if something happens vs. what you pay.',
      'Leave the multi-product comparison behind — focus on Option A only today.',
      '"Which part would you like me to explain differently?"'
    ],
    scriptCard: 'You\'re absolutely right — let me step back and focus on just one thing: the most important gap in your plan today. Everything else we can revisit. Here\'s the one number that matters most…'
  },
  {
    id: 'think',
    trigger: 'need to think|think about it|not ready|want to wait|check with|talk to spouse|call you back',
    label: 'Need to Think It Over',
    icon: 'fa-clock',
    color: '#6366f1',
    responses: [
      'Leave behind the one-page meeting summary (auto-generated by AI).',
      'Offer a 48-hour follow-up call to answer remaining questions.',
      'Lock in today\'s age/rate: "Premiums increase every birthday — today\'s rate is your best rate."',
      'Send digital illustration to their email so they can review at home.',
      'Identify the real hesitation: "Is it the coverage, the cost, or the timing that feels off?"'
    ],
    scriptCard: 'Of course — this is an important decision. What I\'d suggest is I leave you the summary and we schedule a 20-minute call in 48 hours. I\'ll also note that today\'s premiums are based on your current age — every day we wait costs a bit more. What would make you feel confident to move forward?'
  },
  {
    id: 'trust',
    trigger: 'trust|not sure|need to research|look around|compare|another agent|shop around',
    label: 'Trust / Competition',
    icon: 'fa-handshake',
    color: '#0891b2',
    responses: [
      'Share NYL\'s 178-year track record and #1 market share.',
      'Offer side-by-side competitive comparison with available data.',
      'Introduce your client service model — "I\'m your agent for life, not just for the sale."',
      'Provide reference from existing client (with permission).',
      'Acknowledge the concern: "Shopping around is smart. Here\'s what to look for when you do."'
    ],
    scriptCard: 'I respect that — you should feel completely confident. What I can share is that New York Life has been paying claims for 178 years and has never missed a dividend. I\'m also here as your advisor long after the policy is issued. What specific concerns do you want me to address?'
  },
  {
    id: 'health',
    trigger: 'health|medical|condition|diabetes|blood pressure|decline|rating|table',
    label: 'Health / UW Rating Concern',
    icon: 'fa-heartbeat',
    color: '#dc2626',
    responses: [
      'Pre-screen health informally to set expectations before formal application.',
      'Explain table rating: "A Table 2 means +50% premium but you ARE insurable."',
      'Guaranteed Issue options: GUL with limited underwriting for certain amounts.',
      'Graded benefit option for severe impairments.',
      'Remind that any coverage today locks in your insurability permanently.'
    ],
    scriptCard: 'Your health history is important to get right — and the good news is that being insurable at any rating is far better than waiting until you\'re not. A Table 2 rating adds a modest premium but your family still gets the full benefit. Let me walk you through exactly what to expect from underwriting.'
  }
];

/* ─── NAIC compliance checks ─────────────────────────────────────── */
var p3ComplianceRules = [
  { id: 'C1', rule: 'Guaranteed vs Non-Guaranteed columns', status: 'pass', note: 'Both columns present in illustration table.' },
  { id: 'C2', rule: 'Dividend basis footnote (WL/participating)', status: 'pass', note: 'Dividend scale footnote included on signature page.' },
  { id: 'C3', rule: 'Signature acknowledgment page', status: 'warn', note: 'Signature page generated — not yet signed by prospect.' },
  { id: 'C4', rule: 'AG49-B rate compliance (IUL)', status: 'pass', note: 'Illustrated rate ≤ AG49-B maximum for S&P crediting strategy.' },
  { id: 'C5', rule: 'Non-guaranteed label on projections', status: 'pass', note: 'All non-guaranteed columns clearly labeled.' },
  { id: 'C6', rule: 'FINRA suitability (VUL/annuity)', status: 'pass', note: 'No VUL in current proposal. FIA suitability form pending.' }
];

/* ─────────────────────────────────────────────────────────────────
   INIT & ROUTING
   ───────────────────────────────────────────────────────────────── */
function initProductsPage() {
  _p3ActiveProspect = 'FNA-001';
  _p3ActiveProposal = null;
  _p3SelectedOption = 'A';
  requestAnimationFrame(function() {
    setTimeout(function() {
      p3RenderProspectList();
      p3SelectProspect('FNA-001');
    }, 80);
  });
}

/* ─────────────────────────────────────────────────────────────────
   PROSPECT LIST
   ───────────────────────────────────────────────────────────────── */
function p3RenderProspectList() {
  var el = document.getElementById('p3-prospect-list');
  if (!el) return;
  el.innerHTML = p3Prospects.map(function(pr) {
    var active = _p3ActiveProspect === pr.id ? 'p3-prospect-active' : '';
    var urgencyBadge = '';
    if (pr.urgency === 'urgent') urgencyBadge = '<span class="p3-urg-badge urgent"><i class="fas fa-bolt"></i> Urgent</span>';
    else if (pr.urgency === 'high') urgencyBadge = '<span class="p3-urg-badge high">High Priority</span>';
    else urgencyBadge = '<span class="p3-urg-badge med">In Progress</span>';
    var proposalIcon = p3ProposalData[pr.id] ? '<i class="fas fa-file-alt p3-has-proposal" title="Proposal ready"></i>' : '';
    return '<div class="p3-prospect-card ' + active + '" onclick="p3SelectProspect(\'' + pr.id + '\')" id="p3-pc-' + pr.id + '">'
      + '<div class="p3-pc-top">'
      +   '<div class="p3-pc-avatar" style="background:' + pr.avatarGrad + '">' + pr.initials + '</div>'
      +   '<div class="p3-pc-info">'
      +     '<div class="p3-pc-name">' + pr.name + ' ' + proposalIcon + '</div>'
      +     '<div class="p3-pc-sub">' + pr.occupation + ' · Age ' + pr.age + '</div>'
      +   '</div>'
      +   urgencyBadge
      + '</div>'
      + '<div class="p3-pc-fna-status"><i class="fas fa-clipboard-check"></i> ' + pr.fnaStatus + '</div>'
      + '<div class="p3-pc-ai-rec"><i class="fas fa-robot"></i> ' + pr.aiRec + '</div>'
      + '</div>';
  }).join('');
}

function p3SelectProspect(id) {
  _p3ActiveProspect = id;
  _p3ActiveProposal = p3ProposalData[id] || null;
  _p3SelectedOption = _p3ActiveProposal ? _p3ActiveProposal.options[0].id : 'A';
  p3RenderProspectList();
  p3RenderMainPanel();
}

/* ─────────────────────────────────────────────────────────────────
   MAIN RIGHT PANEL
   ───────────────────────────────────────────────────────────────── */
function p3RenderMainPanel() {
  var panel = document.getElementById('p3-main-panel');
  if (!panel) return;
  var pr = p3Prospects.find(function(p) { return p.id === _p3ActiveProspect; });
  if (!pr) return;
  var proposal = _p3ActiveProposal;

  // Header strip
  var urgClass = pr.urgency === 'urgent' ? 'p3-panel-header urgent' : pr.urgency === 'high' ? 'p3-panel-header high' : 'p3-panel-header';
  var compBadge = '';
  if (proposal) {
    var cs = proposal.complianceStatus;
    compBadge = '<span class="p3-compliance-pill ' + cs + '">'
      + (cs === 'pass' ? '<i class="fas fa-check-shield"></i> Compliance OK' : '<i class="fas fa-exclamation-triangle"></i> Review Needed')
      + '</span>';
  }

  var html = '<div class="' + urgClass + '">'
    + '<div class="p3-panel-header-left">'
    +   '<div class="p3-panel-avatar" style="background:' + pr.avatarGrad + '">' + pr.initials + '</div>'
    +   '<div>'
    +     '<div class="p3-panel-name">' + pr.name + '</div>'
    +     '<div class="p3-panel-meta">' + pr.occupation + ' · Age ' + pr.age + ' · ' + pr.riskClass + ' · ' + pr.fnaStatus + '</div>'
    +   '</div>'
    + '</div>'
    + '<div class="p3-panel-header-right">'
    +   compBadge
    +   '<button class="p3-ai-illustrate-btn" onclick="p3OpenIllustrationEngine()"><i class="fas fa-calculator"></i> Run Illustration</button>'
    + '</div>'
    + '</div>';

  // AI recommendation bar
  html += '<div class="p3-ai-rec-bar">'
    + '<i class="fas fa-robot p3-ai-rec-icon"></i>'
    + '<div class="p3-ai-rec-body">'
    +   '<span class="p3-ai-rec-label">AI Illustration Assistant</span>'
    +   '<span class="p3-ai-rec-text">' + pr.aiRec + '</span>'
    + '</div>'
    + '<button class="p3-ai-compare-btn" onclick="p3RunAIComparison()"><i class="fas fa-magic"></i> AI Compare</button>'
    + '</div>';

  if (proposal) {
    html += p3BuildProposalView(proposal, pr);
  } else {
    html += p3BuildEmptyProposalState(pr);
  }

  panel.innerHTML = html;
}

/* ─────────────────────────────────────────────────────────────────
   PROPOSAL VIEW (3-option cards + illustration table + compliance)
   ───────────────────────────────────────────────────────────────── */
function p3BuildProposalView(proposal, pr) {
  var html = '';

  // ── Section label + actions
  html += '<div class="p3-section-bar">'
    + '<span class="p3-section-title"><i class="fas fa-file-contract"></i> Multi-Product Proposal · ' + proposal.prospectName + '</span>'
    + '<div class="p3-section-actions">'
    +   '<span class="p3-proposal-date"><i class="fas fa-calendar-alt"></i> ' + proposal.createdDate + '</span>'
    +   '<button class="p3-btn-sm outline" onclick="p3OpenObjCoach()"><i class="fas fa-comments"></i> Objection Coach</button>'
    +   '<button class="p3-btn-sm primary" onclick="p3OpenSignaturePage()"><i class="fas fa-signature"></i> Get Signature</button>'
    + '</div>'
    + '</div>';

  // ── Option selector cards
  html += '<div class="p3-options-row">';
  proposal.options.forEach(function(opt) {
    var active = _p3SelectedOption === opt.id ? 'active' : '';
    var recBadge = opt.recommended ? '<span class="p3-rec-badge"><i class="fas fa-star"></i> AI Recommended</span>' : '';
    var scoreColor = opt.suitabilityScore >= 90 ? '#16a34a' : opt.suitabilityScore >= 80 ? '#d97706' : '#6b7280';
    html += '<div class="p3-option-card ' + active + '" onclick="p3SelectOption(\'' + proposal.prospectId + '\',\'' + opt.id + '\')">'
      + recBadge
      + '<div class="p3-opt-label">' + opt.label + '</div>'
      + '<div class="p3-opt-tagline">' + opt.tagline + '</div>'
      + '<div class="p3-opt-premium">$' + opt.totalAnnualPremium.toLocaleString() + '<span>/yr</span></div>'
      + '<div class="p3-opt-products">'
      +   opt.products.map(function(pp) {
            var prod = p3ProductCatalog.find(function(c) { return c.id === pp.productId; });
            return '<span class="p3-opt-prod-chip" style="background:' + (prod ? prod.color : '#374151') + '22;color:' + (prod ? prod.color : '#374151') + '">'
              + (prod ? '<i class="fas ' + prod.icon + '"></i> ' : '') + (prod ? prod.shortName : pp.productId)
              + '</span>';
          }).join('')
      + '</div>'
      + '<div class="p3-opt-score" style="color:' + scoreColor + '">Suitability ' + opt.suitabilityScore + '</div>'
      + '</div>';
  });
  html += '</div>';

  // ── Selected option detail
  var selOpt = proposal.options.find(function(o) { return o.id === _p3SelectedOption; }) || proposal.options[0];
  html += p3BuildOptionDetail(selOpt, pr);

  // ── Illustration table
  html += p3BuildIllustrationTable(proposal);

  // ── Compliance check
  html += p3BuildComplianceSection(proposal);

  // ── Agent notes
  html += '<div class="p3-agent-notes-card">'
    + '<div class="p3-anc-title"><i class="fas fa-sticky-note"></i> Agent Notes</div>'
    + '<div class="p3-anc-body">' + proposal.agentNotes + '</div>'
    + '</div>';

  return html;
}

function p3BuildOptionDetail(opt, pr) {
  var html = '<div class="p3-opt-detail-card">'
    + '<div class="p3-opt-det-header">'
    +   '<div class="p3-opt-det-title">' + opt.label + ' — ' + opt.tagline + '</div>'
    +   '<div class="p3-opt-det-kpis">'
    +     '<div class="p3-det-kpi"><div class="p3-det-kpi-val">$' + (opt.projectedCashValue65 > 0 ? opt.projectedCashValue65.toLocaleString() : '—') + '</div><div class="p3-det-kpi-lbl">CSV @ Age 65</div></div>'
    +     '<div class="p3-det-kpi"><div class="p3-det-kpi-val">$' + opt.deathBenefitAt65.toLocaleString() + '</div><div class="p3-det-kpi-lbl">DB @ Age 65</div></div>'
    +     '<div class="p3-det-kpi"><div class="p3-det-kpi-val">' + opt.internalRateOfReturn + '</div><div class="p3-det-kpi-lbl">IRR</div></div>'
    +     '<div class="p3-det-kpi"><div class="p3-det-kpi-val hi">$' + opt.totalAnnualPremium.toLocaleString() + '/yr</div><div class="p3-det-kpi-lbl">Total Premium</div></div>'
    +   '</div>'
    + '</div>'
    + '<div class="p3-ai-summary-box"><i class="fas fa-robot"></i> ' + opt.aiSummary + '</div>'
    + '<div class="p3-opt-products-table">';

  opt.products.forEach(function(pp) {
    var prod = p3ProductCatalog.find(function(c) { return c.id === pp.productId; });
    var prodName = prod ? prod.name : pp.productId;
    var prodColor = prod ? prod.color : '#374151';
    var prodIcon  = prod ? prod.icon  : 'fa-box';
    var faceStr   = pp.faceAmount ? '$' + pp.faceAmount.toLocaleString() : (pp.monthlyBenefit ? '$' + pp.monthlyBenefit.toLocaleString() + '/mo' : (pp.lumpSum ? '$' + pp.lumpSum.toLocaleString() + ' single' : 'See policy'));
    html += '<div class="p3-prod-line">'
      + '<div class="p3-prod-line-icon" style="background:' + prodColor + '18;color:' + prodColor + '"><i class="fas ' + prodIcon + '"></i></div>'
      + '<div class="p3-prod-line-info">'
      +   '<div class="p3-prod-line-name">' + prodName + '</div>'
      +   '<div class="p3-prod-line-meta">' + pp.riskClass + (pp.riders && pp.riders.length ? ' · ' + pp.riders.join(' · ') : '') + '</div>'
      + '</div>'
      + '<div class="p3-prod-line-right">'
      +   '<div class="p3-prod-line-face">' + faceStr + '</div>'
      +   '<div class="p3-prod-line-prem">$' + pp.annualPremium.toLocaleString() + '/yr</div>'
      + '</div>'
      + '</div>';
  });

  html += '</div>'    // p3-opt-products-table
    + '<div class="p3-opt-det-footer">'
    +   '<button class="p3-btn-sm outline" onclick="p3OpenExplainerModal(\'' + opt.id + '\')"><i class="fas fa-comment-alt"></i> Plain-English Explainer</button>'
    +   '<button class="p3-btn-sm outline" onclick="p3RunComplianceCheck()"><i class="fas fa-check-shield"></i> Compliance Pre-check</button>'
    +   '<button class="p3-btn-sm primary" onclick="p3OpenSignaturePage()"><i class="fas fa-signature"></i> Present &amp; Get Signature</button>'
    + '</div>'
    + '</div>';
  return html;
}

function p3BuildIllustrationTable(proposal) {
  var html = '<div class="p3-illust-card">'
    + '<div class="p3-illust-header">'
    +   '<span class="p3-illust-title"><i class="fas fa-table"></i> Illustration Table — NAIC Compliant</span>'
    +   '<div class="p3-illust-tabs">'
    +     '<button class="p3-illust-tab ' + (_p3IllustTab === 'table' ? 'active' : '') + '" onclick="p3SwitchIllustTab(\'table\')">Table View</button>'
    +     '<button class="p3-illust-tab ' + (_p3IllustTab === 'chart' ? 'active' : '') + '" onclick="p3SwitchIllustTab(\'chart\')">Chart View</button>'
    +   '</div>'
    +   '<span class="p3-naic-badge"><i class="fas fa-shield-alt"></i> NAIC Illustration Reg</span>'
    + '</div>';

  if (_p3IllustTab === 'table') {
    html += '<div class="p3-illust-table-wrap"><table class="p3-illust-table">'
      + '<thead><tr>'
      + '<th>Year</th><th>Age</th>'
      + '<th class="p3-col-guar">Annual Premium</th>'
      + '<th class="p3-col-guar"><i class="fas fa-lock"></i> Guar. Cash Value</th>'
      + '<th class="p3-col-nonguar"><i class="fas fa-chart-line"></i> Non-Guar. Cash Value <sup>†</sup></th>'
      + '<th class="p3-col-guar"><i class="fas fa-lock"></i> Guar. Death Benefit</th>'
      + '<th class="p3-col-nonguar"><i class="fas fa-chart-line"></i> Non-Guar. Death Benefit <sup>†</sup></th>'
      + '</tr></thead><tbody>';
    proposal.illustrationYears.forEach(function(row) {
      html += '<tr>'
        + '<td>' + row.year + '</td>'
        + '<td>' + row.age + '</td>'
        + '<td>$' + row.annualPremium.toLocaleString() + '</td>'
        + '<td class="p3-col-guar">$' + row.guaranteedCV.toLocaleString() + '</td>'
        + '<td class="p3-col-nonguar">$' + row.nonGuaranteedCV.toLocaleString() + '</td>'
        + '<td class="p3-col-guar">$' + row.guaranteedDB.toLocaleString() + '</td>'
        + '<td class="p3-col-nonguar">$' + row.nonGuaranteedDB.toLocaleString() + '</td>'
        + '</tr>';
    });
    html += '</tbody></table></div>'
      + '<div class="p3-illust-footnote"><sup>†</sup> Non-guaranteed values assume current dividend/interest scale. Actual values may be higher or lower. Not a contract. Past performance does not guarantee future results.</div>';
  } else {
    // Chart view — ASCII-style bar chart using CSS
    var maxVal = 0;
    proposal.illustrationYears.forEach(function(r) { if (r.nonGuaranteedCV > maxVal) maxVal = r.nonGuaranteedCV; });
    html += '<div class="p3-chart-wrap">';
    proposal.illustrationYears.forEach(function(row) {
      var gPct = maxVal > 0 ? Math.round((row.guaranteedCV / maxVal) * 100) : 0;
      var ngPct = maxVal > 0 ? Math.round((row.nonGuaranteedCV / maxVal) * 100) : 0;
      html += '<div class="p3-chart-row">'
        + '<div class="p3-chart-lbl">Yr ' + row.year + '</div>'
        + '<div class="p3-chart-bars">'
        +   '<div class="p3-chart-bar-wrap">'
        +     '<div class="p3-chart-bar guar" style="width:' + gPct + '%" title="Guaranteed CV: $' + row.guaranteedCV.toLocaleString() + '"></div>'
        +     '<span class="p3-chart-bar-val">$' + row.guaranteedCV.toLocaleString() + '</span>'
        +   '</div>'
        +   '<div class="p3-chart-bar-wrap">'
        +     '<div class="p3-chart-bar non-guar" style="width:' + ngPct + '%" title="Non-Guar CV: $' + row.nonGuaranteedCV.toLocaleString() + '"></div>'
        +     '<span class="p3-chart-bar-val non-guar">$' + row.nonGuaranteedCV.toLocaleString() + '</span>'
        +   '</div>'
        + '</div>'
        + '</div>';
    });
    html += '<div class="p3-chart-legend">'
      + '<span class="p3-chart-leg-item guar"><span class="p3-chart-leg-dot"></span> Guaranteed CSV</span>'
      + '<span class="p3-chart-leg-item non-guar"><span class="p3-chart-leg-dot"></span> Non-Guaranteed CSV †</span>'
      + '</div></div>'
      + '<div class="p3-illust-footnote"><sup>†</sup> Non-guaranteed values assume current dividend scale and are not guaranteed.</div>';
  }

  html += '</div>'; // p3-illust-card
  return html;
}

function p3BuildComplianceSection(proposal) {
  var overall = proposal.complianceStatus;
  var overallCls = overall === 'pass' ? 'pass' : 'warn';
  var overallIcon = overall === 'pass' ? 'fa-check-shield' : 'fa-exclamation-triangle';
  var overallLabel = overall === 'pass' ? 'NAIC Compliance — All Checks Passed' : 'NAIC Compliance — Review Required';

  var html = '<div class="p3-compliance-card">'
    + '<div class="p3-comp-header">'
    +   '<span class="p3-comp-overall ' + overallCls + '"><i class="fas ' + overallIcon + '"></i> ' + overallLabel + '</span>'
    +   '<button class="p3-btn-sm outline" onclick="p3RunComplianceCheck()"><i class="fas fa-sync"></i> Re-run Check</button>'
    + '</div>'
    + '<div class="p3-comp-rules">';

  p3ComplianceRules.forEach(function(rule) {
    var ruleIcon = rule.status === 'pass' ? 'fa-check-circle' : rule.status === 'warn' ? 'fa-exclamation-triangle' : 'fa-times-circle';
    html += '<div class="p3-comp-rule ' + rule.status + '">'
      + '<i class="fas ' + ruleIcon + ' p3-comp-rule-icon"></i>'
      + '<div class="p3-comp-rule-body">'
      +   '<div class="p3-comp-rule-name">' + rule.rule + '</div>'
      +   '<div class="p3-comp-rule-note">' + rule.note + '</div>'
      + '</div>'
      + '</div>';
  });

  html += '</div></div>';
  return html;
}

function p3BuildEmptyProposalState(pr) {
  return '<div class="p3-empty-state">'
    + '<i class="fas fa-file-contract p3-empty-icon"></i>'
    + '<div class="p3-empty-title">No proposal yet for ' + pr.name + '</div>'
    + '<div class="p3-empty-sub">Use the AI Illustration Assistant to run scenarios and build a multi-product proposal based on the FNA fact-find data.</div>'
    + '<button class="p3-ai-illustrate-btn" onclick="p3OpenIllustrationEngine()"><i class="fas fa-calculator"></i> Run Illustration Engine</button>'
    + '</div>';
}

/* ─────────────────────────────────────────────────────────────────
   SELECT OPTION
   ───────────────────────────────────────────────────────────────── */
function p3SelectOption(prospectId, optId) {
  _p3SelectedOption = optId;
  p3RenderMainPanel();
}

function p3SwitchIllustTab(tab) {
  _p3IllustTab = tab;
  p3RenderMainPanel();
}

/* ─────────────────────────────────────────────────────────────────
   ILLUSTRATION ENGINE MODAL
   ───────────────────────────────────────────────────────────────── */
function p3OpenIllustrationEngine() {
  var pr = p3Prospects.find(function(p) { return p.id === _p3ActiveProspect; });
  if (!pr) return;
  var overlay = document.getElementById('p3-illustration-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';

  var body = document.getElementById('p3-illust-engine-body');
  if (!body) return;

  body.innerHTML = '<div class="p3-ie-form">'
    + '<div class="p3-ie-prospect-badge" style="background:' + pr.avatarGrad + '">'
    +   '<div class="p3-ie-pb-initials">' + pr.initials + '</div>'
    +   '<div class="p3-ie-pb-info"><div class="p3-ie-pb-name">' + pr.name + '</div>'
    +   '<div class="p3-ie-pb-meta">Age ' + pr.age + ' · ' + pr.riskClass + ' · ' + (pr.smoker ? 'Smoker' : 'Non-Smoker') + '</div></div>'
    + '</div>'
    + '<div class="p3-ie-row">'
    +   p3IEField('Product Family', 'p3-ie-product',
        '<select class="p3-ie-select" id="p3-ie-product">'
        + '<option value="TERM20">Term Life 20-Year</option>'
        + '<option value="TERM30">Term Life 30-Year</option>'
        + '<option value="WL" selected>Whole Life (Participating)</option>'
        + '<option value="WLLP">WL 10-Pay</option>'
        + '<option value="GUL">GUL</option>'
        + '<option value="IUL">IUL</option>'
        + '<option value="DI">Disability Income</option>'
        + '<option value="LTC">Long Term Care</option>'
        + '<option value="LTCHYBRID">LTC/Life Hybrid</option>'
        + '<option value="ANNUITY_FX">Fixed Annuity</option>'
        + '<option value="ANNUITY_IDX">Indexed Annuity (FIA)</option>'
        + '</select>')
    +   p3IEField('Face Amount', 'p3-ie-face', '<input type="text" class="p3-ie-input" id="p3-ie-face" value="$' + pr.coverageNeeded.toLocaleString() + '" />')
    + '</div>'
    + '<div class="p3-ie-row">'
    +   p3IEField('Risk Class', 'p3-ie-risk',
        '<select class="p3-ie-select" id="p3-ie-risk">'
        + ['Preferred Plus','Preferred','Standard Plus','Standard','Table 2','Table 4','Table 6'].map(function(rc) {
            return '<option' + (rc === pr.riskClass ? ' selected' : '') + '>' + rc + '</option>';
          }).join('')
        + '</select>')
    +   p3IEField('Annual Premium', 'p3-ie-prem', '<input type="text" class="p3-ie-input" id="p3-ie-prem" value="$' + pr.annualBudget.toLocaleString() + '" />')
    + '</div>'
    + '<div class="p3-ie-row">'
    +   p3IEField('Illustration Years', 'p3-ie-years', '<input type="number" class="p3-ie-input" id="p3-ie-years" value="30" min="5" max="40" />')
    +   p3IEField('Dividend Scale', 'p3-ie-div',
        '<select class="p3-ie-select" id="p3-ie-div">'
        + '<option>Current (6.2%)</option>'
        + '<option>Conservative (5.5%)</option>'
        + '<option>Guaranteed Only</option>'
        + '</select>')
    + '</div>'
    + '<div class="p3-ie-riders-section">'
    +   '<div class="p3-ie-riders-label">Optional Riders</div>'
    +   '<div class="p3-ie-riders-grid">'
    +     ['Paid-Up Additions (PUA)', 'Waiver of Premium', 'Accelerated Death Benefit', 'COLA Rider (DI/LTC)', 'Income Rider (IUL)', 'Children\'s Term'].map(function(r) {
            var checked = (r === 'Paid-Up Additions (PUA)' || r === 'Waiver of Premium') ? 'checked' : '';
            return '<label class="p3-ie-rider-check"><input type="checkbox" ' + checked + ' /> ' + r + '</label>';
          }).join('')
    +   '</div>'
    + '</div>'
    + '<button class="p3-ie-run-btn" onclick="p3RunIllustration()"><i class="fas fa-play-circle"></i> Run Illustration</button>'
    + '</div>'
    + '<div id="p3-ie-results" class="p3-ie-results" style="display:none"></div>';
}

function p3IEField(label, id, inputHtml) {
  return '<div class="p3-ie-field">'
    + '<label class="p3-ie-label">' + label + '</label>'
    + inputHtml
    + '</div>';
}

function p3RunIllustration() {
  var resultsEl = document.getElementById('p3-ie-results');
  if (!resultsEl) return;
  resultsEl.style.display = 'block';
  resultsEl.innerHTML = '<div class="p3-ie-running"><i class="fas fa-cog fa-spin"></i> Running illustration… analysing product parameters, applying risk class adjustments, computing projected values…</div>';

  setTimeout(function() {
    var pr = p3Prospects.find(function(p) { return p.id === _p3ActiveProspect; });
    if (!pr) return;
    var proposal = p3ProposalData[_p3ActiveProspect];
    if (!proposal) return;

    resultsEl.innerHTML = '<div class="p3-ie-result-header">'
      + '<i class="fas fa-check-circle" style="color:#16a34a"></i> Illustration Complete — 3 options generated'
      + '</div>'
      + '<div class="p3-ie-result-options">'
      + proposal.options.map(function(opt) {
          var prod = p3ProductCatalog.find(function(c) { return c.id === opt.products[0].productId; });
          return '<div class="p3-ie-result-option">'
            + '<div class="p3-ie-ro-label">' + opt.label + '</div>'
            + '<div class="p3-ie-ro-tagline">' + opt.tagline + '</div>'
            + '<div class="p3-ie-ro-kpi">$' + opt.totalAnnualPremium.toLocaleString() + '/yr · CSV@65 $' + (opt.projectedCashValue65 > 0 ? opt.projectedCashValue65.toLocaleString() : 'N/A') + ' · IRR ' + opt.internalRateOfReturn + '</div>'
            + '</div>';
        }).join('')
      + '</div>'
      + '<button class="p3-ie-load-btn" onclick="p3LoadGeneratedProposal();closeP3IllustrationOverlay()"><i class="fas fa-file-contract"></i> Load Full Proposal</button>';
  }, 2200);
}

function p3LoadGeneratedProposal() {
  _p3ActiveProposal = p3ProposalData[_p3ActiveProspect] || null;
  _p3SelectedOption = _p3ActiveProposal ? _p3ActiveProposal.options[0].id : 'A';
  p3RenderMainPanel();
  showToast('Proposal loaded — 3 options ready for presentation', 'success');
}

function closeP3IllustrationOverlay() {
  var overlay = document.getElementById('p3-illustration-overlay');
  if (overlay) overlay.style.display = 'none';
}

function p3CloseIllustBg(e) {
  if (e && e.target !== e.currentTarget) return;
  closeP3IllustrationOverlay();
}

/* ─────────────────────────────────────────────────────────────────
   OBJECTION HANDLING COACH MODAL
   ───────────────────────────────────────────────────────────────── */
function p3OpenObjCoach() {
  var overlay = document.getElementById('p3-objcoach-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  p3RenderObjCoach(null);
}

function p3CloseObjCoach(e) {
  if (e && e.target !== e.currentTarget) return;
  var overlay = document.getElementById('p3-objcoach-overlay');
  if (overlay) overlay.style.display = 'none';
}

function p3RenderObjCoach(activeId) {
  var body = document.getElementById('p3-objcoach-body');
  if (!body) return;

  // Category buttons
  var catHtml = '<div class="p3-oc-cats">'
    + p3Objections.map(function(o) {
        var active = activeId === o.id ? 'active' : '';
        return '<button class="p3-oc-cat-btn ' + active + '" style="' + (activeId === o.id ? 'border-color:' + o.color + ';color:' + o.color : '') + '" onclick="p3RenderObjCoach(\'' + o.id + '\')">'
          + '<i class="fas ' + o.icon + '"></i> ' + o.label
          + '</button>';
      }).join('')
    + '</div>';

  var detailHtml = '';
  if (activeId) {
    var obj = p3Objections.find(function(o) { return o.id === activeId; });
    if (obj) {
      detailHtml = '<div class="p3-oc-detail">'
        + '<div class="p3-oc-det-header" style="border-left-color:' + obj.color + '">'
        +   '<i class="fas ' + obj.icon + '" style="color:' + obj.color + '"></i>'
        +   '<div>'
        +     '<div class="p3-oc-det-title">' + obj.label + ' Objection</div>'
        +     '<div class="p3-oc-det-triggers">Triggered by: <em>' + obj.trigger.replace(/\|/g, ', ') + '</em></div>'
        +   '</div>'
        + '</div>'
        + '<div class="p3-oc-script-card">'
        +   '<div class="p3-oc-sc-label"><i class="fas fa-microphone-alt"></i> Suggested Script</div>'
        +   '<div class="p3-oc-sc-text">' + obj.scriptCard + '</div>'
        + '</div>'
        + '<div class="p3-oc-responses-label"><i class="fas fa-list-ul"></i> Tactical Responses</div>'
        + '<div class="p3-oc-responses">'
        + obj.responses.map(function(r, i) {
            return '<div class="p3-oc-response-item">'
              + '<span class="p3-oc-resp-num">' + (i + 1) + '</span>'
              + '<span>' + r + '</span>'
              + '</div>';
          }).join('')
        + '</div>'
        + '<div class="p3-oc-product-suggestions">'
        +   '<div class="p3-oc-prod-sug-label"><i class="fas fa-lightbulb"></i> Product Adjustments</div>'
        +   p3GetObjProductSuggestions(activeId)
        + '</div>'
        + '</div>';
    }
  } else {
    detailHtml = '<div class="p3-oc-empty"><i class="fas fa-comments"></i><p>Select an objection type to see real-time coaching prompts, suggested scripts, and product adjustment tactics.</p></div>';
  }

  body.innerHTML = catHtml + detailHtml;
}

function p3GetObjProductSuggestions(objId) {
  var pr = p3Prospects.find(function(p) { return p.id === _p3ActiveProspect; });
  var suggestions = {
    price: [
      'Switch Option A (WL $500K) → Term 20-yr $500K: saves ~$1,800/yr',
      'Remove DI rider for now — revisit at next renewal',
      'Reduce face amount to $350K — premium drops by $520/yr'
    ],
    complexity: [
      'Present Option C only (single product, simplest)',
      'Use the plain-English explainer to walk through one key metric',
      'Focus on the "What happens if…" story, not the numbers'
    ],
    think: [
      'Email digital illustration to prospect tonight',
      'Schedule 20-min follow-up call in 48 hours',
      'Point out today\'s age lock-in benefit'
    ],
    trust: [
      'Share NYL 178-year track record card',
      'Offer introductory call with your field manager',
      'Provide one client testimonial (with consent)'
    ],
    health: [
      'Pre-order MIB report to confirm rating expectation',
      'Explore Table Shave program if applicable',
      'Consider Graded Benefit or Guaranteed Issue options'
    ]
  };
  var items = suggestions[objId] || [];
  return '<div class="p3-oc-sug-list">'
    + items.map(function(s) { return '<div class="p3-oc-sug-item"><i class="fas fa-arrow-right"></i> ' + s + '</div>'; }).join('')
    + '</div>';
}

/* ─────────────────────────────────────────────────────────────────
   PLAIN-ENGLISH EXPLAINER MODAL
   ───────────────────────────────────────────────────────────────── */
function p3OpenExplainerModal(optId) {
  var overlay = document.getElementById('p3-explainer-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';

  var pr = p3Prospects.find(function(p) { return p.id === _p3ActiveProspect; });
  var proposal = _p3ActiveProposal;
  if (!pr || !proposal) return;
  var opt = proposal.options.find(function(o) { return o.id === optId; }) || proposal.options[0];

  var body = document.getElementById('p3-explainer-body');
  if (!body) return;

  body.innerHTML = '<div class="p3-exp-header-strip">'
    + '<i class="fas fa-robot"></i> AI Illustration Explainer — Plain English'
    + '</div>'
    + '<div class="p3-exp-content">'
    + p3BuildExplainerText(pr, opt, proposal)
    + '</div>'
    + '<div class="p3-exp-actions">'
    +   '<button class="p3-btn-sm primary" onclick="p3PrintExplainer()"><i class="fas fa-print"></i> Print Leave-Behind</button>'
    +   '<button class="p3-btn-sm outline" onclick="closeP3ExplainerOverlay()"><i class="fas fa-times"></i> Close</button>'
    + '</div>';
}

function p3BuildExplainerText(pr, opt, proposal) {
  var firstProd = p3ProductCatalog.find(function(c) { return c.id === opt.products[0].productId; });
  var prodName  = firstProd ? firstProd.name : 'this policy';
  var csvAge65  = opt.projectedCashValue65 > 0 ? '$' + opt.projectedCashValue65.toLocaleString() : 'minimal';
  var dbAge65   = '$' + opt.deathBenefitAt65.toLocaleString();
  var annPrem   = '$' + opt.totalAnnualPremium.toLocaleString();
  var mo        = '$' + Math.round(opt.totalAnnualPremium / 12).toLocaleString();

  return '<div class="p3-exp-section">'
    + '<div class="p3-exp-section-title"><i class="fas fa-hand-point-right"></i> What You\'re Getting</div>'
    + '<p>' + pr.name + ', here\'s what this coverage means in plain language:</p>'
    + '<p>You\'re looking at <strong>' + opt.tagline + '</strong> — ' + (opt.products.length > 1 ? opt.products.length + ' policies working together' : 'a single policy') + ' that directly addresses the coverage gaps we found in your fact-find.</p>'
    + '</div>'
    + '<div class="p3-exp-section">'
    + '<div class="p3-exp-section-title"><i class="fas fa-calendar-alt"></i> What You Pay</div>'
    + '<p><strong>' + annPrem + ' per year</strong> — that\'s roughly <strong>' + mo + ' per month</strong>. Think of it as the cost of protecting your family\'s financial security. At your income of $' + pr.income.toLocaleString() + '/yr, this represents about ' + (Math.round((opt.totalAnnualPremium / pr.income) * 1000) / 10) + '% of your annual income.</p>'
    + '</div>'
    + '<div class="p3-exp-section">'
    + '<div class="p3-exp-section-title"><i class="fas fa-gift"></i> What Your Family Gets</div>'
    + '<p>If something were to happen to you, your beneficiaries receive <strong>' + dbAge65 + ' tax-free</strong>. That\'s ' + Math.round(opt.deathBenefitAt65 / (pr.income / 12)) + ' months of your current income replaced immediately, with no income tax.</p>'
    + '</div>'
    + (opt.projectedCashValue65 > 0
        ? '<div class="p3-exp-section">'
        + '<div class="p3-exp-section-title"><i class="fas fa-piggy-bank"></i> Your Living Benefit — Cash Value</div>'
        + '<p>This isn\'t just life insurance — it\'s also a financial asset. By the time you reach age 65, your guaranteed cash value reaches <strong>' + csvAge65 + '</strong>. You can borrow against this for tax-free retirement income, emergencies, or college funding — all while your death benefit remains intact.</p>'
        + '</div>'
        : '')
    + '<div class="p3-exp-section">'
    + '<div class="p3-exp-section-title"><i class="fas fa-check-circle"></i> Bottom Line</div>'
    + '<p>' + opt.aiSummary + '</p>'
    + '<p style="margin-top:10px;font-weight:700;color:#1e3a5f">Your coverage gaps are real — this proposal closes them at a cost that fits your budget. The only question is when you want your family to be protected.</p>'
    + '</div>';
}

function closeP3ExplainerOverlay(e) {
  if (e && e.target !== e.currentTarget) return;
  var overlay = document.getElementById('p3-explainer-overlay');
  if (overlay) overlay.style.display = 'none';
}

function p3PrintExplainer() {
  showToast('Leave-behind summary sent to printer / PDF…', 'success');
  closeP3ExplainerOverlay();
}

/* ─────────────────────────────────────────────────────────────────
   SIGNATURE PAGE MODAL
   ───────────────────────────────────────────────────────────────── */
function p3OpenSignaturePage() {
  var overlay = document.getElementById('p3-signature-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';

  var pr = p3Prospects.find(function(p) { return p.id === _p3ActiveProspect; });
  var proposal = _p3ActiveProposal;
  var body = document.getElementById('p3-signature-body');
  if (!body || !pr) return;

  var selOpt = proposal ? proposal.options.find(function(o) { return o.id === _p3SelectedOption; }) : null;

  body.innerHTML = '<div class="p3-sig-intro">'
    + '<div class="p3-sig-nyl-logo"><i class="fas fa-building-columns"></i> New York Life Insurance Company</div>'
    + '<div class="p3-sig-title">ILLUSTRATION ACKNOWLEDGMENT</div>'
    + '<div class="p3-sig-subtitle">NAIC Model Illustration Regulation — Client Signature Required</div>'
    + '</div>'
    + '<div class="p3-sig-fields">'
    +   p3SigField('Insured Name', pr.name)
    +   p3SigField('Date of Birth', 'Age ' + pr.age)
    +   p3SigField('Risk Classification', pr.riskClass)
    +   p3SigField('Product Selected', selOpt ? selOpt.tagline : 'Pending selection')
    +   p3SigField('Annual Premium', selOpt ? '$' + selOpt.totalAnnualPremium.toLocaleString() + '/yr' : 'Pending')
    +   p3SigField('Illustration Date', 'May 10, 2026')
    +   p3SigField('Agent', 'Sarah Thompson · NYL · License #TX-28847')
    + '</div>'
    + '<div class="p3-sig-acknowledgment">'
    +   '<div class="p3-sig-ack-title"><i class="fas fa-info-circle"></i> Acknowledgment Statement</div>'
    +   '<div class="p3-sig-ack-text">I have received and reviewed the illustration for the policy described above. I understand that:'
    +   '<ul>'
    +     '<li>Non-guaranteed values shown in this illustration are not guaranteed and actual results may vary.</li>'
    +     '<li>Dividends are not guaranteed and are declared annually by the Board of Directors.</li>'
    +     '<li>The guaranteed values shown are the minimum values payable under the policy if all premiums are paid on time.</li>'
    +     '<li>This illustration is not a contract and does not modify the terms of any policy.</li>'
    +   '</ul></div>'
    + '</div>'
    + '<div class="p3-sig-pad">'
    +   '<div class="p3-sig-line-wrap">'
    +     '<canvas id="p3-sig-canvas" class="p3-sig-canvas" width="380" height="80"></canvas>'
    +     '<div class="p3-sig-line-label">Prospect Signature</div>'
    +   '</div>'
    +   '<div class="p3-sig-line-wrap">'
    +     '<div class="p3-sig-typed-line" id="p3-sig-typed"></div>'
    +     '<div class="p3-sig-line-label">Date: May 10, 2026</div>'
    +   '</div>'
    + '</div>'
    + '<div class="p3-sig-actions">'
    +   '<button class="p3-btn-sm outline" onclick="p3SimulateSignature()"><i class="fas fa-pen-nib"></i> Simulate Signature</button>'
    +   '<button class="p3-btn-sm primary" id="p3-sig-confirm-btn" onclick="p3ConfirmSignature()" disabled><i class="fas fa-check"></i> Confirm &amp; Save</button>'
    +   '<button class="p3-btn-sm outline" onclick="p3SendDigitalSignRequest()"><i class="fas fa-envelope"></i> Send for Digital Signature</button>'
    + '</div>';

  p3InitSigCanvas();
}

function p3SigField(label, value) {
  return '<div class="p3-sig-field-row">'
    + '<span class="p3-sig-field-lbl">' + label + '</span>'
    + '<span class="p3-sig-field-val">' + value + '</span>'
    + '</div>';
}

function p3InitSigCanvas() {
  // Simple draw-to-sign canvas
  var canvas = document.getElementById('p3-sig-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var drawing = false;
  ctx.strokeStyle = '#1e3a5f';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  canvas.addEventListener('mousedown', function(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });
  canvas.addEventListener('mousemove', function(e) {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  });
  canvas.addEventListener('mouseup', function() {
    drawing = false;
    var btn = document.getElementById('p3-sig-confirm-btn');
    if (btn) btn.removeAttribute('disabled');
  });
  // Touch support
  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    drawing = true;
    var r = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
  });
  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    if (!drawing) return;
    var r = canvas.getBoundingClientRect();
    ctx.lineTo(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
    ctx.stroke();
  });
  canvas.addEventListener('touchend', function() {
    drawing = false;
    var btn = document.getElementById('p3-sig-confirm-btn');
    if (btn) btn.removeAttribute('disabled');
  });
}

function p3SimulateSignature() {
  var canvas = document.getElementById('p3-sig-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  // Draw a simulated cursive signature path
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#1e3a5f';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  var pts = [
    [20,55],[28,35],[38,25],[50,40],[55,55],[62,40],[70,28],[80,38],[85,55],
    [95,42],[105,30],[118,38],[122,55],[130,48],[140,35],[152,42],[158,55],
    [168,50],[178,38],[188,30],[200,38],[205,55],[215,50],[228,38],[240,45],[255,52],[268,48],[280,42]
  ];
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (var i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i][0], pts[i][1]);
  }
  ctx.stroke();
  var btn = document.getElementById('p3-sig-confirm-btn');
  if (btn) btn.removeAttribute('disabled');
}

function p3ConfirmSignature() {
  var proposal = p3ProposalData[_p3ActiveProspect];
  if (proposal) proposal.signatureObtained = true;
  closeP3SignatureOverlay();
  showToast('Illustration acknowledgment signed and saved. Moving to Phase 4 — Application', 'success');
  setTimeout(function() {
    showToast('Prospect verbal commitment received. E-App ready to launch.', 'ai');
  }, 2000);
}

function p3SendDigitalSignRequest() {
  var pr = p3Prospects.find(function(p) { return p.id === _p3ActiveProspect; });
  closeP3SignatureOverlay();
  showToast('Digital signature request sent to ' + (pr ? pr.name : 'prospect') + '\'s email. DocuSign link expires in 72 hours.', 'success');
}

function closeP3SignatureOverlay(e) {
  if (e && e.target !== e.currentTarget) return;
  var overlay = document.getElementById('p3-signature-overlay');
  if (overlay) overlay.style.display = 'none';
}

/* ─────────────────────────────────────────────────────────────────
   AI ACTIONS — Comparison + Compliance
   ───────────────────────────────────────────────────────────────── */
function p3RunAIComparison() {
  showToast('AI building side-by-side product comparison for ' + (_p3ActiveProspect ? p3Prospects.find(function(p){return p.id===_p3ActiveProspect;}).name : 'prospect') + '…', 'ai');
  setTimeout(function() {
    showToast('Comparison ready — Option A scores highest on long-term value and gap closure. Option C offers best flexibility.', 'success');
    _p3SelectedOption = 'A';
    p3RenderMainPanel();
  }, 1800);
}

function p3RunComplianceCheck() {
  showToast('Running NAIC compliance pre-check…', 'ai');
  setTimeout(function() {
    var warn = p3ComplianceRules.filter(function(r) { return r.status === 'warn'; });
    if (warn.length) {
      showToast('Compliance check complete — ' + warn.length + ' item(s) need attention before presenting to prospect.', 'warning');
    } else {
      showToast('Compliance check passed — all NAIC illustration rules satisfied.', 'success');
    }
    p3RenderMainPanel();
  }, 1600);
}

/* ─────────────────────────────────────────────────────────────────
   OVERRIDE: launchIllustrationFromFNA
   Called from FNA detail panel "Run Illustration →" button
   ───────────────────────────────────────────────────────────────── */
function launchIllustrationFromFNA(fnaId) {
  navigateTo('products');
  setTimeout(function() {
    _p3ActiveProspect = fnaId;
    _p3ActiveProposal = p3ProposalData[fnaId] || null;
    _p3SelectedOption = _p3ActiveProposal ? _p3ActiveProposal.options[0].id : 'A';
    p3RenderProspectList();
    p3RenderMainPanel();
    showToast('FNA data pre-loaded for ' + fnaId + ' — illustration engine ready', 'ai');
  }, 400);
}

console.log('Phase 3 — Product Illustration & Proposal engine loaded. Prospects: ' + p3Prospects.length + ', Proposals: ' + Object.keys(p3ProposalData).length + ', Products: ' + p3ProductCatalog.length + ', Objections: ' + p3Objections.length);
