
/* ═══════════════════════════════════════════════════════════════════════════
   P33 — HEALTHCARE PROVIDER 360: AI NETWORK SCAN + ENHANCED FULL 360 (6-TAB)
         + COMPELLING AI DEEP REVIEW
   ─ AI Network Scan: enterprise network dashboard w/ provider scorecard
   ─ Full 360 per provider: 6-tab modal (Overview·Clinical·Billing·Compliance·Risk·AI)
   ─ AI Deep Review: composite scoring + deep clinical + fraud intelligence
   ═══════════════════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  /* ── PROVIDER MARKET INTELLIGENCE DATABASE ─────────────────────────────── */
  var _p33providers = {
    'PRV-001': {
      id: 'PRV-001', name: 'Sunrise Manor SNF', shortName: 'Sunrise Manor',
      type: 'Skilled Nursing Facility', city: 'Dallas, TX', state: 'TX',
      npi: '1234567890', ein: '75-1234567', medicaidId: 'TX-SNF-0441',
      founded: 2001, beds: 120, staffRNs: 18, staffCNAs: 42, staffTotal: 88,
      cmsRating: 4.5, cmsQuality: 4, cmsStaffing: 5, cmsHealth: 4,
      activePats: 18, openClaims: 3, avgDailyRate: '$218', monthlyBilling: '$118K',
      ytdBilling: '$812K', billingAccuracy: 98.2, evv: true, w9: true,
      license: 'Current', licenseExp: 'Dec 2027', lastVisit: 'Apr 15, 2026',
      nextVisit: 'Oct 15, 2026', fraudScore: 5, aiHealth: 'Excellent',
      contact: 'Patricia Wells, Administrator', phone: '(214) 555-0198',
      email: 'p.wells@sunrisemanor.com',
      specialties: ['Post-Acute Rehab', 'Memory Care', 'Wound Care', 'IV Therapy'],
      payorMix: { Medicare: 48, Medicaid: 31, LTC_Insurance: 18, Private: 3 },
      qualityMetrics: [
        { metric: 'Pressure Ulcer Rate', value: '0.8%', benchmark: '2.1%', trend: '↓ Best', color: '#059669' },
        { metric: 'Fall Rate / 1000 Days', value: '1.9', benchmark: '3.4', trend: '↓ Best', color: '#059669' },
        { metric: 'Hospital Readmission', value: '11.2%', benchmark: '17.6%', trend: '↓ Best', color: '#059669' },
        { metric: 'Antipsychotic Use', value: '13.4%', benchmark: '15.3%', trend: 'At benchmark', color: '#d97706' }
      ],
      billingChecks: [
        { check: 'EVV vs Billing Match', status: 'Clean', detail: 'All 18 visits verified — GPS-backed' },
        { check: 'Procedure Code Accuracy', status: 'Clean', detail: 'Within peer norm — no upcoding' },
        { check: 'Duplicate Claims', status: 'Clean', detail: 'No duplicates detected in 90-day review' },
        { check: 'W-9 / Tax Documentation', status: 'Clean', detail: 'Current · Expires Dec 2027' },
        { check: 'Medicaid Certification', status: 'Clean', detail: 'TX Medicaid certified · No issues' }
      ],
      complianceItems: [],
      tpaValue: [
        { metric: 'Monthly LTC Claims Managed', value: '$118K', trend: '+4% YoY' },
        { metric: 'Claims-to-Payment Cycle', value: '8.2 days', trend: 'vs 12.4-day avg' },
        { metric: 'Billing Accuracy Rate', value: '98.2%', trend: 'Network top performer' },
        { metric: 'Fraud Savings (AI Sentry)', value: '$0', trend: 'Zero incidents YTD' }
      ],
      aiOpportunities: [
        { title: 'Preferred SNF Partner Tier Upgrade', value: 'Strategic', description: 'Sunrise Manor consistently outperforms all SNF quality benchmarks. Propose Preferred Partner Tier 1 designation — priority referral routing for high-acuity LTC claimants.' },
        { title: 'Care Coordination Co-Management', value: '$42K ARR', description: 'Offer WealthAI care plan AI integration to streamline LTC claim authorization — reduce auth-to-care-start from 4.2 days to 1.8 days.' },
        { title: 'Predictive Length-of-Stay Modeling', value: '$28K ARR', description: 'Deploy WealthAI LOS prediction at Sunrise Manor to optimize benefit-period management for the 18 active LTC patients.' }
      ],
      networkInsights: [
        'Sunrise Manor is the top-performing SNF in the IllumiFin network — 4.5 CMS stars, 98.2% billing accuracy.',
        'Staffing ratio: 18 RNs and 42 CNAs for 120 beds — 0.5 RN/patient, 40% above CMS recommended minimum.',
        'Hospital readmission rate 11.2% vs 17.6% national benchmark — highest quality outcome metric in our SNF category.',
        'EVV GPS coverage: 100% of visit records backed by CareExchange GPS — zero manual documentation exceptions.',
        'Zero fraud flags in 24 months — lowest fraud risk in the provider network.',
        'Accreditation: JCAHO Gold Seal of Approval · AHCA/NCAL Quality Award recipient (2024).'
      ],
      deepInsight: 'Sunrise Manor SNF is IllumiFin\'s highest-quality skilled nursing partner in the Texas market. Their 4.5-star CMS composite rating places them in the top 8% of SNFs nationally, reflecting disciplined clinical operations and strong administrative processes. The 98.2% billing accuracy — best in our network — means minimal rework, faster payment cycles, and lower administrative friction for claims operations. Their hospital readmission rate of 11.2% (vs 17.6% national benchmark) translates directly into lower benefit utilization costs for our LTC carriers, making Sunrise Manor a genuine value driver. For IllumiFin\'s HAL and LTC TPA books, high-quality SNF placements reduce average claim duration, lower secondary complication rates, and protect loss ratios. Recommended Q3 actions: (1) Nominate for Preferred Network Partner — publish in carrier quality reports to drive referral volume; (2) Offer WealthAI care coordination API integration to eliminate the 4.2-day auth lag; (3) Use Sunrise Manor as case study in Prudential and MassMutual carrier reviews to demonstrate TPA network quality value.',
      contractRisks: 'Very Low. Active contract, current license, zero compliance issues. EVV fully integrated. Next QA visit Oct 2026. No action items.'
    },
    'PRV-002': {
      id: 'PRV-002', name: 'ComfortCare Home Health', shortName: 'ComfortCare',
      type: 'Home Health Agency', city: 'Houston, TX', state: 'TX',
      npi: '2345678901', ein: '76-2345678', medicaidId: 'TX-HHA-1872',
      founded: 2009, beds: 0, staffRNs: 24, staffCNAs: 0, staffTotal: 62,
      cmsRating: 4.2, cmsQuality: 4, cmsStaffing: 4, cmsHealth: 4,
      activePats: 31, openClaims: 5, avgDailyRate: '$185', monthlyBilling: '$174K',
      ytdBilling: '$1.18M', billingAccuracy: 96.8, evv: true, w9: true,
      license: 'Current', licenseExp: 'Sep 2027', lastVisit: 'Mar 20, 2026',
      nextVisit: 'Sep 20, 2026', fraudScore: 8, aiHealth: 'Good',
      contact: 'Michael Torres, Director', phone: '(713) 555-0442',
      email: 'm.torres@comfortcarehh.com',
      specialties: ['Skilled Nursing Visits', 'Physical Therapy', 'Occupational Therapy', 'Social Work'],
      payorMix: { Medicare: 52, LTC_Insurance: 29, Medicaid: 12, Private: 7 },
      qualityMetrics: [
        { metric: 'Improvement in Ambulation', value: '68%', benchmark: '58%', trend: '↑ Above avg', color: '#059669' },
        { metric: 'Pain Management Success', value: '74%', benchmark: '67%', trend: '↑ Above avg', color: '#059669' },
        { metric: 'EVV Compliance Rate', value: '94.2%', benchmark: '95%', trend: '⚠ Minor gap', color: '#d97706' },
        { metric: 'Hospitalization Rate', value: '15.8%', benchmark: '17.1%', trend: '↓ Good', color: '#059669' }
      ],
      billingChecks: [
        { check: 'EVV vs Billing Match', status: 'Minor gap', detail: '2 of 31 visits missing GPS — manual log submitted' },
        { check: 'Procedure Code Accuracy', status: 'Clean', detail: '96.8% accuracy — within acceptable range' },
        { check: 'Duplicate Claims', status: 'Clean', detail: 'No duplicates in 90-day lookback' },
        { check: 'W-9 / Tax Documentation', status: 'Clean', detail: 'Current · Expires Sep 2027' },
        { check: 'Medicare Certification', status: 'Clean', detail: 'Certified · OASIS reporting current' }
      ],
      complianceItems: [
        'EVV gap: 2 visits lacking GPS log — follow up with field nurses for manual attestation',
        'Annual OASIS accuracy review due Aug 2026 — schedule with clinical supervisor'
      ],
      tpaValue: [
        { metric: 'Monthly LTC Claims Managed', value: '$174K', trend: '+7% YoY' },
        { metric: 'Claims-to-Payment Cycle', value: '9.8 days', trend: 'vs 12.4-day avg' },
        { metric: 'Billing Accuracy Rate', value: '96.8%', trend: 'Good — watch EVV' },
        { metric: 'AI Detected Savings', value: '$8.4K', trend: 'EVV gap prevention YTD' }
      ],
      aiOpportunities: [
        { title: 'EVV Full Compliance Program', value: '$18K ARR', description: 'Close the 2-visit EVV gap with WealthAI automated GPS attestation module — prevents billing disputes and improves accuracy score to 98%+.' },
        { title: 'Home Health Outcomes Dashboard', value: '$24K ARR', description: 'Provide ComfortCare with WealthAI outcomes tracking — patient improvement scoring aligned to OASIS — creates carrier value narrative for renewals.' },
        { title: 'Expanded LTC Referral Volume', value: 'Strategic', description: 'Resolve EVV gap and OASIS accuracy to qualify ComfortCare for Preferred Network status — unlock priority LTC claim routing from Prudential and Lincoln books.' }
      ],
      networkInsights: [
        'ComfortCare is the highest-volume home health provider in the IllumiFin Houston network — 31 active LTC patients generating $174K/month in managed claims.',
        'CMS 4.2-star rating reflects solid clinical outcomes — especially physical therapy functional improvement (68% vs 58% benchmark).',
        'EVV gap (2 of 31 visits missing GPS) is a minor but trackable compliance issue — follow-up required within 30 days.',
        'Fraud score 8/100 — low risk. Minor billing discrepancy pattern is attributable to EVV logging delays, not intentional manipulation.',
        'OASIS data quality review due Aug 2026 — critical for Medicare reimbursement accuracy and CMS star rating maintenance.',
        'Staff mix: 24 RNs + PT/OT/SW specialists — well-structured for complex LTC home health cases.'
      ],
      deepInsight: 'ComfortCare Home Health is a solid mid-tier provider with the highest patient volume in our Houston network. The 31 active LTC patients and $174K monthly claims managed represent meaningful TPA revenue concentration in a single HHA. Their CMS 4.2-star rating and strong therapy outcomes (68% ambulation improvement) are genuine differentiators in a competitive Houston market. The minor EVV gap (2 visits) is the principal watch item — while not indicative of fraud at a score of 8/100, uncorrected EVV gaps can erode billing accuracy below the 95% threshold and trigger audit scrutiny from Medicare and carrier SIU teams. The OASIS accuracy review due in August is equally important: OASIS score degradation triggers automatic CMS star rating re-evaluation and can suppress Medicare Home Health Compare rankings, affecting referral volume. Recommended Q3 actions: (1) Deploy WealthAI EVV auto-attestation module to close GPS gaps within 14 days; (2) Schedule OASIS clinical review by Aug 15; (3) Evaluate for Preferred Network candidacy once EVV compliance reaches 99%+.',
      contractRisks: 'Low. Two minor compliance items (EVV gap, OASIS review). License current. 2 action items due within 60 days.'
    },
    'PRV-003': {
      id: 'PRV-003', name: 'Memory Lane Care Center', shortName: 'Memory Lane',
      type: 'Memory Care Facility', city: 'Phoenix, AZ', state: 'AZ',
      npi: '3456789012', ein: '86-3456789', medicaidId: 'AZ-MCF-0229',
      founded: 2013, beds: 80, staffRNs: 12, staffCNAs: 28, staffTotal: 54,
      cmsRating: 4.0, cmsQuality: 3, cmsStaffing: 4, cmsHealth: 4,
      activePats: 12, openClaims: 2, avgDailyRate: '$265', monthlyBilling: '$96K',
      ytdBilling: '$648K', billingAccuracy: 94.1, evv: false, w9: true,
      license: 'Current', licenseExp: 'Mar 2027', lastVisit: 'May 8, 2026',
      nextVisit: 'Aug 8, 2026', fraudScore: 14, aiHealth: 'Needs Attention',
      contact: 'Dr. Rebecca Shin, Medical Director', phone: '(602) 555-0317',
      email: 'r.shin@memorylanecare.com',
      specialties: ['Alzheimer\'s Care', 'Dementia Care', 'Behavioral Health', 'Palliative Care'],
      payorMix: { LTC_Insurance: 44, Medicare: 28, Medicaid: 22, Private: 6 },
      qualityMetrics: [
        { metric: 'Restraint-Free Rate', value: '97.2%', benchmark: '92%', trend: '↑ Strong', color: '#059669' },
        { metric: 'Antipsychotic Use', value: '18.9%', benchmark: '15.3%', trend: '⚠ Elevated', color: '#dc2626' },
        { metric: 'EVV Coverage', value: '0%', benchmark: '95%', trend: '❌ Not integrated', color: '#dc2626' },
        { metric: 'Billing Accuracy', value: '94.1%', benchmark: '95%', trend: '⚠ Below threshold', color: '#d97706' }
      ],
      billingChecks: [
        { check: 'EVV vs Billing Match', status: 'Cannot verify', detail: 'EVV not integrated — manual visit logs only' },
        { check: 'Procedure Code Accuracy', status: 'Borderline', detail: '94.1% — below 95% minimum threshold' },
        { check: 'Duplicate Claims', status: 'Clean', detail: 'No duplicates in 90-day lookback' },
        { check: 'W-9 / Tax Documentation', status: 'Clean', detail: 'Current · Expires Mar 2027' },
        { check: 'AZ DHS License', status: 'Current', detail: 'Licensed through Mar 2027 · Memory care endorsement active' }
      ],
      complianceItems: [
        'EVV not integrated — manual visit logs accepted on interim basis only. CareExchange onboarding REQUIRED within 60 days per contract §7.4',
        'Billing accuracy 94.1% — below 95% contractual minimum. Billing corrective action plan required within 30 days',
        'Antipsychotic usage 18.9% vs 15.3% CMS benchmark — review prescribing practices with medical director',
        'AI fraud score 14 — elevated. Manual log submission without EVV increases fraud exposure. 2 claims flagged for secondary review'
      ],
      tpaValue: [
        { metric: 'Monthly LTC Claims Managed', value: '$96K', trend: 'Stable YoY' },
        { metric: 'LTC Insurance Payor Mix', value: '44%', trend: 'Highest in network' },
        { metric: 'Billing Accuracy Rate', value: '94.1%', trend: '⚠ Below threshold' },
        { metric: 'Manual Review Cost', value: '+$12K/mo', trend: 'Due to EVV absence' }
      ],
      aiOpportunities: [
        { title: 'EVV Onboarding — Urgent', value: '$12K/mo savings', description: 'Eliminating manual visit log review will save $12K/month in claims ops cost while improving billing accuracy above 95% threshold.' },
        { title: 'Antipsychotic Prescribing Consultation', value: 'Risk Reduction', description: 'WealthAI clinical intelligence: share peer benchmark data with Dr. Shin — supporting evidence-based prescribing protocol reduces DOI regulatory risk.' },
        { title: 'Memory Care Specialized Billing Module', value: '$14K ARR', description: 'Memory care facilities have unique billing complexity (ADL assessments, behavioral interventions) — offer WealthAI specialty billing module to improve accuracy to 97%+.' }
      ],
      networkInsights: [
        'Memory Lane is the only specialty memory care facility in our Arizona network — unique referral value for Alzheimer\'s and dementia LTC cases.',
        'LTC insurance payor mix is 44% — highest in the network, reflecting the specialized LTC patient population.',
        'EVV absence is the critical compliance gap: without GPS-backed visit verification, all 12 active patients\' visits rely on manual attestation — fraud exposure is structurally elevated.',
        'Billing accuracy 94.1% has declined from 96.2% in Q1 2026 — trend requires immediate corrective action before next carrier audit.',
        'Antipsychotic usage at 18.9% vs 15.3% benchmark — AZ DHS has flagged memory care facilities statewide for prescribing reviews in 2026.',
        'Dr. Rebecca Shin is a board-certified geriatric psychiatrist — clinical leadership is strong. Administrative billing controls are the weakness.'
      ],
      deepInsight: 'Memory Lane Care Center occupies a strategically valuable but operationally fragile position in the IllumiFin network. As the sole specialized memory care facility in our Arizona book, it serves an LTC-intensive patient population where 44% of billing is LTC insurance — the highest payor mix concentration in our provider network. This makes Memory Lane both critical to carrier satisfaction and disproportionately exposed to any claims compliance failure. The two active compliance deficiencies — EVV absence and 94.1% billing accuracy — are interrelated: without EVV GPS validation, billing exceptions increase because manual attestation is inherently error-prone and audit-vulnerable. The AZ DHS antipsychotic prescribing review (statewide for memory care facilities) adds regulatory risk that could result in a license condition if usage is not reduced to benchmark levels. Fraud score 14/100 reflects structural EVV risk, not proven intent — a critical distinction. Recommended Q3 actions: (1) Immediate EVV onboarding — set 45-day hard deadline with escalation to Medical Director; (2) Billing corrective action plan with weekly accuracy tracking; (3) Quarterly antipsychotic prescribing review with WealthAI peer data delivered to Dr. Shin. Failure to remediate within 60 days triggers contract §7.4 remediation clause.',
      contractRisks: 'ELEVATED. 4 open action items. EVV non-compliance under contract §7.4. Billing accuracy below 95% minimum. Antipsychotic prescribing watch. 60-day corrective action window active.'
    },
    'PRV-004': {
      id: 'PRV-004', name: 'Sunrise Gardens ALF', shortName: 'Sunrise Gardens',
      type: 'Assisted Living Facility', city: 'Atlanta, GA', state: 'GA',
      npi: '4567890123', ein: '58-4567890', medicaidId: 'GA-ALF-0882',
      founded: 2007, beds: 95, staffRNs: 8, staffCNAs: 31, staffTotal: 67,
      cmsRating: 4.3, cmsQuality: 4, cmsStaffing: 4, cmsHealth: 5,
      activePats: 8, openClaims: 1, avgDailyRate: '$178', monthlyBilling: '$43K',
      ytdBilling: '$298K', billingAccuracy: 97.4, evv: true, w9: true,
      license: 'Current', licenseExp: 'Jun 2028', lastVisit: 'Jun 1, 2026',
      nextVisit: 'Dec 1, 2026', fraudScore: 3, aiHealth: 'Excellent',
      contact: 'James Holloway, CEO', phone: '(404) 555-0621',
      email: 'j.holloway@sunrisegardens.com',
      specialties: ['Assisted Daily Living', 'Medication Management', 'Activity Programs', 'Respite Care'],
      payorMix: { LTC_Insurance: 55, Private: 32, Medicaid_Waiver: 13 },
      qualityMetrics: [
        { metric: 'Resident Satisfaction', value: '94%', benchmark: '82%', trend: '↑ Outstanding', color: '#059669' },
        { metric: 'Medication Error Rate', value: '0.3%', benchmark: '1.2%', trend: '↓ Best', color: '#059669' },
        { metric: 'Fall Rate / 1000 Days', value: '1.4', benchmark: '2.8', trend: '↓ Best', color: '#059669' },
        { metric: 'Billing Accuracy', value: '97.4%', benchmark: '95%', trend: '↑ Above threshold', color: '#059669' }
      ],
      billingChecks: [
        { check: 'EVV vs Billing Match', status: 'Clean', detail: 'All 8 patients\' service records GPS-verified' },
        { check: 'Procedure Code Accuracy', status: 'Clean', detail: '97.4% — strong performance' },
        { check: 'Duplicate Claims', status: 'Clean', detail: 'No duplicates detected' },
        { check: 'W-9 / Tax Documentation', status: 'Clean', detail: 'Current · Expires Jun 2028' },
        { check: 'GA DBHDD License', status: 'Clean', detail: 'Licensed ALF · Personal care home endorsement active' }
      ],
      complianceItems: [],
      tpaValue: [
        { metric: 'Monthly LTC Claims Managed', value: '$43K', trend: 'Stable' },
        { metric: 'LTC Insurance Payor Mix', value: '55%', trend: 'Second highest in network' },
        { metric: 'Billing Accuracy Rate', value: '97.4%', trend: 'Above threshold' },
        { metric: 'Resident Satisfaction Score', value: '94%', trend: 'Network-leading' }
      ],
      aiOpportunities: [
        { title: 'LTC Insurance Direct Referral Program', value: '$32K ARR', description: 'Sunrise Gardens\' 55% LTC payor mix and 94% resident satisfaction make it ideal for direct referral from Prudential and MassMutual claim coordinators.' },
        { title: 'Respite Care Expansion', value: 'Strategic', description: 'Develop a structured respite care program with IllumiFin — growing demand from LTC caregiver support programs, especially post-COVID family caregiver burnout.' },
        { title: 'QA Showcase Partnership', value: 'Reputational', description: 'Use Sunrise Gardens ALF as a quality showcase in carrier network presentations — their metrics support the IllumiFin "best-in-class network" narrative.' }
      ],
      networkInsights: [
        'Sunrise Gardens ALF carries the highest LTC insurance payor concentration (55%) among ALFs in the network — strong alignment with the IllumiFin book.',
        'CMS 5-star health inspection rating — the highest available. No regulatory actions in 6 years of operation.',
        'Medication error rate 0.3% vs 1.2% benchmark — outstanding pharmacy and nursing management.',
        'Fraud score 3/100 — lowest in the entire provider network. Clean billing record across 7 years.',
        'One active claim is stable, within normal authorization. No payment concerns.',
        'James Holloway (CEO) is an active participant in the GA ALF Association — regulatory intelligence asset for IllumiFin.'
      ],
      deepInsight: 'Sunrise Gardens ALF is IllumiFin\'s exemplary assisted living partner in the Southeast market. With a 4.3-star CMS rating, 97.4% billing accuracy, and the network\'s lowest fraud score (3/100), this facility represents the quality benchmark for the ALF category. The 55% LTC insurance payor mix — the second-highest in our network after Memory Lane — reflects a patient population that is precisely aligned with the HAL and LTC TPA books we administer. The 94% resident satisfaction score, medication error rate of 0.3%, and fall rate of 1.4 per 1,000 days are all best-in-class metrics that directly protect carrier loss ratios by minimizing complications, rehospitalizations, and care escalations. This facility warrants proactive relationship investment. Recommended Q3 actions: (1) Propose formal Preferred Network Partner designation and publish in Q3 carrier quality reports; (2) Develop a structured LTC care coordinator direct-referral protocol with Prudential and MassMutual claim teams; (3) Offer Sunrise Gardens participation in the inaugural IllumiFin Provider Quality Forum as keynote facility.',
      contractRisks: 'Very Low. Zero compliance items. License valid through 2028. EVV integrated. Next QA visit Dec 2026.'
    },
    'PRV-005': {
      id: 'PRV-005', name: 'BrightPath Homecare', shortName: 'BrightPath',
      type: 'Home Health Agency', city: 'Chicago, IL', state: 'IL',
      npi: '5678901234', ein: '36-5678901', medicaidId: 'IL-HHA-2241',
      founded: 2016, beds: 0, staffRNs: 16, staffCNAs: 0, staffTotal: 38,
      cmsRating: 3.9, cmsQuality: 3, cmsStaffing: 4, cmsHealth: 3,
      activePats: 22, openClaims: 4, avgDailyRate: '$162', monthlyBilling: '$108K',
      ytdBilling: '$712K', billingAccuracy: 93.2, evv: true, w9: false,
      license: 'Current', licenseExp: 'Nov 2026', lastVisit: 'Feb 14, 2026',
      nextVisit: 'Aug 14, 2026 (Overdue — reschedule)', fraudScore: 22, aiHealth: 'Needs Attention',
      contact: 'Sandra Yi, Operations', phone: '(312) 555-0889',
      email: 's.yi@brightpathhomecare.com',
      specialties: ['Skilled Nursing Visits', 'Wound Care', 'Medication Management', 'Chronic Disease Management'],
      payorMix: { LTC_Insurance: 38, Medicare: 35, Medicaid: 20, Private: 7 },
      qualityMetrics: [
        { metric: 'Timely Medication Init.', value: '81%', benchmark: '88%', trend: '⚠ Below avg', color: '#d97706' },
        { metric: 'Hospitalization Rate', value: '19.4%', benchmark: '17.1%', trend: '⚠ Elevated', color: '#d97706' },
        { metric: 'EVV Compliance Rate', value: '91.3%', benchmark: '95%', trend: '❌ Below minimum', color: '#dc2626' },
        { metric: 'Billing Accuracy', value: '93.2%', benchmark: '95%', trend: '❌ Below threshold', color: '#dc2626' }
      ],
      billingChecks: [
        { check: 'EVV vs Billing Match', status: 'Flagged', detail: '8.7% of visits missing GPS — 2 anomalous billing patterns in May' },
        { check: 'Procedure Code Accuracy', status: 'Below threshold', detail: '93.2% — 1.8% below 95% minimum' },
        { check: 'Duplicate Claims', status: 'Clean', detail: 'No duplicates, but 2 billing patterns flagged for review' },
        { check: 'W-9 / Tax Documentation', status: '⚠ MISSING', detail: 'W-9 not on file — PAYMENT HOLD ACTIVE' },
        { check: 'IL License', status: 'Current', detail: 'Expires Nov 2026 — renewal due in 4 months' }
      ],
      complianceItems: [
        'W-9 NOT ON FILE — payment hold active on all pending claims until received. Contact Sandra Yi immediately',
        'Billing accuracy 93.2% — below 95% minimum. Corrective action plan required within 30 days',
        'EVV compliance 91.3% — 8.7% of visits unverified. 2 anomalous billing patterns under SIU secondary review',
        'Site visit overdue (last: Feb 14, 2026) — reschedule immediately per QA protocol',
        'License expiry Nov 2026 — renewal process must begin within 30 days to avoid lapse',
        'Hospitalization rate 19.4% vs 17.1% benchmark — review care plan adherence protocols'
      ],
      tpaValue: [
        { metric: 'Monthly LTC Claims Managed', value: '$108K', trend: 'Stable but at risk' },
        { metric: 'W-9 Hold Impact', value: '$108K frozen', trend: 'Until W-9 received' },
        { metric: 'SIU Investigation Cost', value: '$3.2K', trend: 'Active YTD 2026' },
        { metric: 'Manual Review Cost', value: '+$8K/mo', trend: 'EVV gap remediation' }
      ],
      aiOpportunities: [
        { title: 'W-9 Collection — URGENT', value: 'IMMEDIATE', description: 'Payment hold on $108K/month in claims. W-9 must be received within 5 business days or claims will be formally denied per IRS compliance protocol.' },
        { title: 'EVV Compliance Recovery Program', value: 'Risk Reduction', description: 'Close 8.7% EVV gap with WealthAI auto-attestation — reduces SIU exposure and improves billing accuracy toward 95% threshold.' },
        { title: 'License Renewal Monitoring', value: 'Risk Reduction', description: 'IL HHA license expires Nov 2026. WealthAI can monitor regulatory renewal pipeline and alert 90 days in advance — preventing the catastrophic scenario of billing while unlicensed.' }
      ],
      networkInsights: [
        'BrightPath is the highest-risk active provider in the IllumiFin network — W-9 missing, EVV gap 8.7%, billing below threshold, and site visit overdue.',
        'Payment hold is ACTIVE — $108K in monthly claims pending until W-9 is received from Sandra Yi.',
        'Fraud score 22/100 — two anomalous billing patterns flagged in May 2026 under SIU secondary review.',
        'License expires November 2026 — if renewal is not initiated within 30 days, the agency faces a potential lapse that would require immediate patient case transfers.',
        'Hospitalization rate 19.4% exceeds benchmark — may indicate care coordination gaps for complex chronic disease patients.',
        'CMS 3.9-star rating is the second-lowest in our network — reflecting both quality metric deficiencies and outcome performance.'
      ],
      deepInsight: 'BrightPath Homecare represents the most acute risk management challenge in the IllumiFin provider network — not because any single issue is catastrophic, but because multiple compliance deficiencies are active simultaneously. The W-9 absence is the most urgent: it creates a legal payment hold that freezes $108K in monthly billing and, if unresolved within 30 days, escalates to formal claim denial under IRS B-Notice compliance. The 8.7% EVV gap and two SIU-flagged billing patterns raise fraud exposure above the threshold where passive monitoring is sufficient — active investigation is warranted. The 93.2% billing accuracy, 19.4% hospitalization rate, and delinquent site visit combine to form a pattern of administrative disengagement that requires forceful corrective intervention. The license expiry in November 2026 creates a hard deadline: if BrightPath does not renew by October, IllumiFin must begin emergency patient case transfers to alternate providers — an operationally complex and carrier-visible event. Recommended IMMEDIATE actions: (1) Direct call to Sandra Yi — W-9 within 5 business days or deny claims; (2) Schedule unannounced site visit within 2 weeks; (3) Issue formal 30-day corrective action plan (billing accuracy + EVV); (4) Alert carrier clients (Prudential, MassMutual) that 4 open claims at BrightPath are under enhanced review.',
      contractRisks: 'HIGH. W-9 missing — payment hold active. Billing below threshold. EVV gap with SIU patterns. Site visit overdue. License expires Nov 2026. 6 open action items. Formal corrective action plan required.'
    },
    'PRV-006': {
      id: 'PRV-006', name: 'Oakwood Care Center', shortName: 'Oakwood',
      type: 'Skilled Nursing Facility', city: 'Boston, MA', state: 'MA',
      npi: '6789012345', ein: '04-6789012', medicaidId: 'MA-SNF-0118',
      founded: 1998, beds: 140, staffRNs: 14, staffCNAs: 38, staffTotal: 82,
      cmsRating: 3.6, cmsQuality: 2, cmsStaffing: 4, cmsHealth: 3,
      activePats: 9, openClaims: 3, avgDailyRate: '$248', monthlyBilling: '$67K',
      ytdBilling: '$442K', billingAccuracy: 91.4, evv: true, w9: true,
      license: 'Review', licenseExp: 'Under State Review (MA DPH)', lastVisit: 'Jan 28, 2026',
      nextVisit: 'IMMEDIATE — triggered by license review', fraudScore: 31, aiHealth: 'Critical',
      contact: 'Frank Donovan, Administrator', phone: '(617) 555-0244',
      email: 'f.donovan@oakwoodcarecenter.com',
      specialties: ['Post-Acute Rehab', 'Long-Term Care', 'Respiratory Therapy', 'Wound Care'],
      payorMix: { Medicare: 52, Medicaid: 31, LTC_Insurance: 13, Private: 4 },
      qualityMetrics: [
        { metric: 'Pressure Ulcer Rate', value: '4.8%', benchmark: '2.1%', trend: '↑ Critical', color: '#dc2626' },
        { metric: 'Fall Rate / 1000 Days', value: '5.2', benchmark: '3.4', trend: '↑ Critical', color: '#dc2626' },
        { metric: 'Hospital Readmission', value: '23.1%', benchmark: '17.6%', trend: '↑ High', color: '#dc2626' },
        { metric: 'Billing Accuracy', value: '91.4%', benchmark: '95%', trend: '❌ Below minimum', color: '#dc2626' }
      ],
      billingChecks: [
        { check: 'EVV vs Billing Match', status: '⚠ Flagged', detail: '2 anomalous billing patterns — dates not matching care logs on Claims 2026-0107 and 2026-0092' },
        { check: 'Procedure Code Accuracy', status: '❌ Below standard', detail: '91.4% — 3.6% below 95% minimum threshold' },
        { check: 'Duplicate Claims', status: 'Possible', detail: 'Claims 2026-0107 and 2026-0092 show overlapping service dates — SIU reviewing' },
        { check: 'W-9 / Tax Documentation', status: 'Clean', detail: 'On file · Current' },
        { check: 'MA DPH License', status: '⚠ UNDER REVIEW', detail: 'License status review initiated by MA DPH following facility inspection Jan 2026. Outcome expected Sep 2026.' }
      ],
      complianceItems: [
        'CRITICAL: MA DPH license under state review — new patient referrals SUSPENDED pending resolution (est. Sep 2026)',
        'Fraud score 31/100 — highest in network. SIU investigation ACTIVE on Claims 2026-0107 and 2026-0092',
        'Billing accuracy 91.4% — 3.6% below minimum. Formal billing corrective action plan REQUIRED',
        'Pressure ulcer rate 4.8% vs 2.1% benchmark — MA DPH likely cited this in license review',
        'Fall rate 5.2 per 1000 days vs 3.4 benchmark — staffing adequacy investigation recommended',
        'Ruth Blackwood (LTC-2026-0107) is an active IllumiFin LTC claimant at this facility — claim escalated'
      ],
      tpaValue: [
        { metric: 'Monthly LTC Claims Managed', value: '$67K', trend: 'Suspended for new refs' },
        { metric: 'SIU Investigation Cost', value: '$14K', trend: 'YTD 2026' },
        { metric: 'Billing Accuracy Rate', value: '91.4%', trend: '❌ Below minimum' },
        { metric: 'Carrier Exposure', value: '$67K/mo at risk', trend: 'Until license resolved' }
      ],
      aiOpportunities: [
        { title: 'Immediate Patient Review — Ruth Blackwood', value: 'CRITICAL', description: 'Active LTC claimant Ruth Blackwood (LTC-2026-0107) is at Oakwood. Review care plan adherence and assess transfer necessity given license review and quality deficiencies.' },
        { title: 'SIU Investigation Support', value: 'Risk Reduction', description: 'WealthAI Fraud Sentry has flagged Claims 2026-0107 and 2026-0092 for duplicate service date overlap. Provide SIU team with AI evidence package to support investigation.' },
        { title: 'Contingency Transfer Planning', value: 'URGENT', description: 'If MA DPH revokes or conditions Oakwood\'s license, IllumiFin must execute emergency patient transfers for all 9 active patients. Begin contingency planning now — identify alternate SNFs in Boston network.' }
      ],
      networkInsights: [
        'Oakwood is the ONLY CRITICAL-status provider in the IllumiFin network — MA DPH license under state review following an unannounced inspection.',
        'Fraud score 31/100 — highest in the network. Two billing patterns under active SIU investigation for overlapping service dates.',
        'Pressure ulcer rate 4.8% and fall rate 5.2 per 1,000 days are both classified as "significantly below average" by CMS — contributing to the 3.6-star composite (lowest in network).',
        'Active LTC claimant: Ruth Blackwood (LTC-2026-0107) — claim is on escalated status. Care plan review is a PRIORITY action item.',
        'New referrals SUSPENDED per IllumiFin policy — no new LTC patients should be placed at Oakwood until license status is resolved.',
        'MA DPH license outcome expected September 2026 — three possible outcomes: (1) License reinstated with conditions, (2) Probationary license, (3) License suspension/revocation requiring immediate patient transfers.'
      ],
      deepInsight: 'Oakwood Care Center is the most serious risk management situation in the IllumiFin provider network. The concurrent presence of a MA DPH license review, a 31/100 fraud score, an active SIU investigation on two claims, and the worst quality metrics in the SNF category creates a convergence of operational, regulatory, and financial exposure that requires executive-level attention. The 91.4% billing accuracy and duplicate claim patterns on Cases 2026-0107 and 2026-0092 suggest systemic billing control failure, not incidental error. The clinical quality deficiencies — 4.8% pressure ulcer rate and 5.2 falls per 1,000 days — are likely the basis of the MA DPH inspection findings and represent genuine patient safety concerns that extend beyond financial risk. The presence of Ruth Blackwood, an active IllumiFin LTC claimant, at this facility elevates legal and carrier liability exposure. If care quality failures contribute to an adverse patient event, IllumiFin\'s provider network credentialing process will face scrutiny from carriers and potentially regulators. Recommended IMMEDIATE actions: (1) Activate executive escalation — VP Claims + Compliance Officer + Legal; (2) Direct case review for Ruth Blackwood within 48 hours; (3) Prepare contingency transfer plan for all 9 active patients; (4) Engage Frank Donovan directly for SIU document preservation notice; (5) Suspend all new referrals pending license resolution.',
      contractRisks: 'CRITICAL. License under state review. SIU active. Fraud score 31. Billing 3.6% below minimum. Active LTC claimant at risk. New referrals suspended. Executive escalation required.'
    }
  };

  /* ── SHARED HELPERS (reuse P32 helpers if available, define own as fallback) ── */
  var _p33ov = (typeof _p32ov === 'function') ? _p32ov : function(id, html) {
    var existing = document.getElementById(id);
    if (existing) existing.remove();
    var el = document.createElement('div');
    el.id = id;
    el.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99990;display:flex;align-items:center;justify-content:center;padding:16px;';
    el.addEventListener('click', function(e){ if(e.target===el) el.remove(); });
    el.innerHTML = html;
    document.body.appendChild(el);
  };

  var _p33close = function(id) { var el = document.getElementById(id); if(el) el.remove(); };

  var _p33toast = function(msg, dur) {
    var t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#111827;color:#fff;border-radius:12px;padding:13px 18px;font-size:12px;font-weight:600;z-index:99999;box-shadow:0 8px 32px rgba(0,0,0,.35);max-width:420px;line-height:1.5;animation:fadeIn .3s;';
    t.innerHTML = msg;
    document.body.appendChild(t);
    setTimeout(function(){ if(t.parentNode) t.remove(); }, dur||4000);
  };

  function _p33kpi(val, lbl, icon, color, sub) {
    return '<div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:14px;text-align:center;">'
      +'<div style="width:32px;height:32px;background:'+color+'1a;border-radius:9px;display:flex;align-items:center;justify-content:center;margin:0 auto 8px;">'
      +'<i class="fas '+icon+'" style="color:'+color+';font-size:14px;"></i></div>'
      +'<div style="font-size:18px;font-weight:900;color:'+color+';">'+val+'</div>'
      +'<div style="font-size:11px;font-weight:700;color:#374151;">'+lbl+'</div>'
      +'<div style="font-size:10px;color:#9ca3af;margin-top:2px;">'+sub+'</div>'
      +'</div>';
  }

  function _p33row(lbl, val) {
    return '<div style="background:#f8fafc;border-radius:8px;padding:9px 12px;">'
      +'<div style="font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase;margin-bottom:2px;">'+lbl+'</div>'
      +'<div style="font-size:12px;font-weight:700;color:#111827;line-height:1.5;">'+val+'</div>'
      +'</div>';
  }

  function _p33ai(html, color) {
    var c = color || 'linear-gradient(135deg,#7c3aed,#6d28d9)';
    return '<div style="background:linear-gradient(135deg,rgba(124,58,237,.07),rgba(109,40,217,.07));border:1.5px solid #7c3aed33;border-radius:12px;padding:16px;margin-bottom:16px;">'
      +'<div style="font-size:12px;font-weight:800;color:#7c3aed;margin-bottom:8px;display:flex;align-items:center;gap:7px;"><div style="width:22px;height:22px;background:'+c+';border-radius:6px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-robot" style="color:#fff;font-size:10px;"></i></div> WealthAI Intelligence</div>'
      +'<div style="font-size:12px;color:#374151;line-height:1.75;">'+html+'</div>'
      +'</div>';
  }

  function _p33badge(txt, color, bg) {
    return '<span style="background:'+(bg||color+'22')+';color:'+color+';border:1px solid '+color+'44;border-radius:20px;padding:3px 10px;font-size:11px;font-weight:700;">'+txt+'</span>';
  }

  function _p33section(title, icon, color) {
    return '<div style="font-size:13px;font-weight:800;color:#111827;margin:18px 0 10px;display:flex;align-items:center;gap:8px;">'
      +'<div style="width:26px;height:26px;background:'+color+'1a;border-radius:7px;display:flex;align-items:center;justify-content:center;"><i class="fas '+icon+'" style="color:'+color+';font-size:11px;"></i></div>'
      + title+'</div>';
  }

  function _p33qualRow(q) {
    return '<div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;padding:11px 14px;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:8px;align-items:center;margin-bottom:7px;">'
      +'<div style="font-size:12px;font-weight:700;color:#111827;">'+q.metric+'</div>'
      +'<div style="font-size:13px;font-weight:800;color:'+q.color+';">'+q.value+'</div>'
      +'<div style="font-size:11px;color:#9ca3af;">Benchmark: '+q.benchmark+'</div>'
      +'<span style="font-size:11px;font-weight:700;color:'+q.color+';">'+q.trend+'</span>'
      +'</div>';
  }

  function _p33billingRow(b) {
    var sc = b.status === 'Clean' ? '#059669' : b.status.indexOf('MISSING') > -1 || b.status.indexOf('REVIEW') > -1 ? '#dc2626' : '#d97706';
    return '<div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;padding:11px 14px;display:grid;grid-template-columns:2fr 1fr 2fr;gap:8px;align-items:center;margin-bottom:7px;">'
      +'<div style="font-size:12px;font-weight:700;color:#111827;">'+b.check+'</div>'
      +'<span style="background:'+sc+'1a;color:'+sc+';border:1px solid '+sc+'44;border-radius:20px;padding:2px 9px;font-size:10px;font-weight:700;text-align:center;">'+b.status+'</span>'
      +'<div style="font-size:11px;color:#6b7280;">'+b.detail+'</div>'
      +'</div>';
  }

  function _p33oppCard(o, hc) {
    var valColor = o.value === 'IMMEDIATE' || o.value === 'CRITICAL' ? '#dc2626' : o.value === 'URGENT' ? '#d97706' : o.value === 'Strategic' || o.value === 'Reputational' ? '#0891b2' : o.value === 'Risk Reduction' ? '#d97706' : '#059669';
    return '<div style="background:#fff;border:1px solid #e5e7eb;border-left:3px solid '+(hc||'#7c3aed')+';border-radius:10px;padding:12px 14px;margin-bottom:8px;">'
      +'<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:5px;">'
      +'<div style="font-size:12px;font-weight:800;color:#111827;">'+o.title+'</div>'
      +'<span style="background:'+valColor+';color:#fff;border-radius:20px;padding:2px 10px;font-size:11px;font-weight:700;white-space:nowrap;margin-left:8px;">'+o.value+'</span>'
      +'</div>'
      +'<div style="font-size:11px;color:#6b7280;line-height:1.6;">'+o.description+'</div>'
      +'</div>';
  }

  function _p33insightBullet(txt) {
    return '<div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:7px;font-size:12px;color:#374151;line-height:1.6;">'
      +'<i class="fas fa-circle-dot" style="color:#0891b2;font-size:8px;margin-top:5px;flex-shrink:0;"></i>'
      +'<span>'+txt+'</span></div>';
  }

  /* ─── TAB SYSTEM ─────────────────────────────────────────────────────── */
  function _p33tab(idx, id, label, icon) {
    return '<button id="p33t-'+id+'-'+idx+'" onclick="_p33switchTab(\''+id+'\','+idx+')" style="display:flex;align-items:center;gap:6px;padding:9px 14px;border:none;border-bottom:3px solid transparent;background:transparent;font-size:12px;font-weight:600;color:#6b7280;cursor:pointer;white-space:nowrap;">'
      +'<i class="fas '+icon+'" style="font-size:11px;"></i>'+label+'</button>';
  }

  window._p33switchTab = function(id, idx) {
    var panels = document.querySelectorAll('[id^="p33pan-'+id+'-"]');
    var tabs   = document.querySelectorAll('[id^="p33t-'+id+'-"]');
    panels.forEach(function(p, i){
      p.style.display = i === idx ? 'block' : 'none';
    });
    tabs.forEach(function(t, i){
      t.style.color        = i === idx ? '#0891b2' : '#6b7280';
      t.style.borderBottom = i === idx ? '3px solid #0891b2' : '3px solid transparent';
      t.style.fontWeight   = i === idx ? '700' : '600';
    });
  };

  /* ═══════════════════════════════════════════════════════════════════════
     ENHANCED FULL 360 MODAL — 6 TABS PER PROVIDER
  ═══════════════════════════════════════════════════════════════════════ */
  window.ltcOpenProvider360 = function(providerId) {
    var d = _p33providers[providerId];
    if (!d) {
      var allP = window.ltcProviderData360 || [];
      var p2 = allP.find(function(x){ return x.id === providerId; });
      if (p2) _p33toast('<i class="fas fa-hospital"></i> Loading '+p2.name+' 360° — provider data', 3000);
      return;
    }
    var hc = { Excellent:'#059669', Good:'#0891b2', 'Needs Attention':'#d97706', Critical:'#dc2626' }[d.aiHealth] || '#6b7280';
    var bc = d.billingAccuracy >= 97 ? '#059669' : d.billingAccuracy >= 95 ? '#d97706' : '#dc2626';
    var fc = d.fraudScore < 10 ? '#059669' : d.fraudScore < 20 ? '#d97706' : '#dc2626';
    var uid = 'prov360-'+providerId;

    var tabDefs = [
      { label:'Overview',    icon:'fa-th-large'       },
      { label:'Clinical',    icon:'fa-heartbeat'      },
      { label:'Billing',     icon:'fa-dollar-sign'    },
      { label:'Compliance',  icon:'fa-clipboard-check'},
      { label:'Risk & Fraud',icon:'fa-shield-alt'     },
      { label:'AI Insights', icon:'fa-robot'          }
    ];

    /* ── Panel 0: Overview ── */
    var pan0 = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px;">'
      + _p33kpi(d.activePats+'', 'Active Patients', 'fa-user-injured', '#dc2626', 'Currently in care')
      + _p33kpi(d.billingAccuracy+'%', 'Billing Accuracy', 'fa-dollar-sign', bc, 'Min threshold: 95%')
      + _p33kpi(d.cmsRating+'/5 ⭐', 'CMS Rating', 'fa-star', d.cmsRating >= 4.3 ? '#059669' : d.cmsRating >= 4.0 ? '#d97706' : '#dc2626', 'CMS Star Quality')
      + _p33kpi(d.fraudScore+'/100', 'Fraud Risk Score', 'fa-shield-alt', fc, d.fraudScore < 10 ? 'Clear' : d.fraudScore < 20 ? 'Elevated — Watch' : 'HIGH — SIU')
      +'</div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">'
      + _p33row('Provider Type', d.type)
      + _p33row('Location', d.city + ' · ' + d.state)
      + _p33row('NPI Number', d.npi)
      + _p33row('Founded', d.founded)
      + (d.beds > 0 ? _p33row('Licensed Beds', d.beds) : _p33row('Active Field Staff', d.staffRNs + ' RNs · ' + d.staffTotal + ' total'))
      + _p33row('Total Staff', d.staffTotal + ' employees')
      + _p33row('EVV Status', d.evv ? '✅ GPS-backed · CareExchange integrated' : '❌ NOT INTEGRATED — Contract §7.4 breach')
      + _p33row('W-9 on File', d.w9 ? '✅ Current · EIN: '+d.ein : '⚠️ MISSING — Payment hold active')
      + _p33row('License Status', d.license === 'Current' ? '✅ Current · Exp: '+d.licenseExp : '⚠️ '+d.license+' — '+d.licenseExp)
      + _p33row('Contact', d.contact)
      + _p33row('Last Site Visit', d.lastVisit)
      + _p33row('Next Visit Due', d.nextVisit)
      +'</div>'
      + _p33ai('<strong>AI Network Context:</strong> '+d.deepInsight.substring(0, 300)+'...', 'linear-gradient(135deg,#0891b2,#0e7490)');

    /* ── Panel 1: Clinical ── */
    var payorRows = Object.entries(d.payorMix).map(function(e){
      var pColor = e[0] === 'LTC_Insurance' ? '#7c3aed' : e[0] === 'Medicare' ? '#003087' : e[0] === 'Medicaid' ? '#0891b2' : '#059669';
      return '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
        +'<div style="font-size:12px;font-weight:700;color:#374151;">'+e[0].replace(/_/g,' ')+'</div>'
        +'<div style="display:flex;align-items:center;gap:8px;">'
        +'<div style="width:120px;background:#f3f4f6;border-radius:20px;height:8px;">'
        +'<div style="width:'+e[1]+'%;background:'+pColor+';height:8px;border-radius:20px;"></div></div>'
        +'<div style="font-size:12px;font-weight:800;color:'+pColor+';width:35px;text-align:right;">'+e[1]+'%</div>'
        +'</div></div>';
    }).join('');

    var pan1 = _p33section('Clinical Quality Metrics', 'fa-heartbeat', '#dc2626')
      +'<div style="background:#f8fafc;border-radius:8px;padding:8px 14px;margin-bottom:6px;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:8px;">'
      +'<span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;">Metric</span>'
      +'<span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;">Value</span>'
      +'<span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;">Benchmark</span>'
      +'<span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;">Trend</span>'
      +'</div>'
      + d.qualityMetrics.map(function(q){ return _p33qualRow(q); }).join('')
      + _p33section('Specialties & Services', 'fa-stethoscope', '#0891b2')
      +'<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px;">'
      + d.specialties.map(function(s){
        return '<span style="background:#e0f2fe;color:#0369a1;border:1px solid #bae6fd;border-radius:20px;padding:4px 12px;font-size:11px;font-weight:700;">'+s+'</span>';
      }).join('')
      +'</div>'
      + _p33section('Payor Mix', 'fa-chart-pie', '#7c3aed')
      +'<div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:14px;">'
      + payorRows
      +'</div>'
      + _p33ai('<strong>Clinical Intelligence:</strong> '
        + (d.aiHealth === 'Excellent' ? 'This provider\'s quality metrics are consistently above CMS benchmarks across all measured dimensions. Clinical outcomes translate directly into lower claim complication rates and shorter average benefit utilization for LTC carriers.'
        : d.aiHealth === 'Good' ? 'Clinical performance is solid overall with one area needing attention. Outcomes are tracking at or above benchmark in primary metrics. Minor documentation or compliance gaps should be addressed within 60 days.'
        : d.aiHealth === 'Needs Attention' ? '⚠️ Multiple clinical metrics are at or below benchmark levels. The combination of EVV gaps and billing accuracy issues suggests administrative processes are not keeping pace with clinical activity. Corrective plan required.'
        : '🚨 CRITICAL: Clinical quality metrics are significantly below CMS benchmarks. Pressure ulcer, fall, and readmission rates all exceed acceptable thresholds. This represents both patient safety risk and carrier liability exposure. Executive review required.'));

    /* ── Panel 2: Billing ── */
    var pan2 = _p33section('Billing Integrity Review', 'fa-dollar-sign', bc)
      +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">'
      + _p33kpi(d.billingAccuracy+'%', 'Billing Accuracy', 'fa-percent', bc, 'vs 95% threshold')
      + _p33kpi(d.monthlyBilling, 'Monthly Billing', 'fa-dollar-sign', '#059669', 'YTD: '+d.ytdBilling)
      + _p33kpi(d.avgDailyRate, 'Avg Daily Rate', 'fa-calendar-day', '#003087', 'Per patient per day')
      +'</div>'
      + _p33section('Billing Check Results', 'fa-check-circle', '#059669')
      +'<div style="background:#f8fafc;border-radius:8px;padding:8px 14px;margin-bottom:6px;display:grid;grid-template-columns:2fr 1fr 2fr;gap:8px;">'
      +'<span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;">Check</span>'
      +'<span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;">Status</span>'
      +'<span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;">Detail</span>'
      +'</div>'
      + d.billingChecks.map(function(b){ return _p33billingRow(b); }).join('')
      + _p33section('TPA Administrative Value', 'fa-chart-line', '#059669')
      +'<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:14px;">'
      + d.tpaValue.map(function(t){
        return '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px;">'
          +'<div style="font-size:15px;font-weight:800;color:#059669;">'+t.value+'</div>'
          +'<div style="font-size:11px;font-weight:700;color:#374151;margin-top:2px;">'+t.metric+'</div>'
          +'<div style="font-size:10px;color:#6b7280;">'+t.trend+'</div></div>';
      }).join('')
      +'</div>'
      + _p33ai('<strong>Billing Intelligence:</strong> Billing accuracy of <strong>'+d.billingAccuracy+'%</strong> is '
        +(d.billingAccuracy >= 97 ? 'top-tier — well above the 95% contractual minimum. EVV GPS coverage ensures billing integrity. Payment cycles are averaging '+d.tpaValue[1].value+' — faster than the 12.4-day network average.'
        : d.billingAccuracy >= 95 ? 'acceptable but approaching the warning zone. EVV compliance is the primary driver of billing accuracy — any degradation in EVV log submission will push accuracy below threshold.'
        : '⚠️ BELOW the 95% contractual minimum. Immediate corrective action plan required. WealthAI analysis indicates the billing accuracy gap is primarily driven by '+(d.evv ? 'procedure code selection errors and documentation gaps' : 'EVV absence — manual visit log submission introduces systematic inaccuracies.')));

    /* ── Panel 3: Compliance ── */
    var pan3 = _p33section('Compliance Status', 'fa-clipboard-check', d.complianceItems.length === 0 ? '#059669' : d.complianceItems.length <= 2 ? '#d97706' : '#dc2626')
      + (d.complianceItems.length === 0
        ? '<div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:18px;margin-bottom:16px;text-align:center;">'
          +'<i class="fas fa-check-circle" style="color:#059669;font-size:28px;margin-bottom:8px;display:block;"></i>'
          +'<div style="font-size:14px;font-weight:800;color:#059669;">Fully Compliant</div>'
          +'<div style="font-size:12px;color:#374151;margin-top:4px;">No open compliance items · Zero action items · All documentation current</div>'
          +'</div>'
        : '<div style="background:#fef2f2;border:1.5px solid #fecaca;border-radius:12px;padding:16px;margin-bottom:16px;">'
          +'<div style="font-size:12px;font-weight:800;color:#dc2626;margin-bottom:10px;"><i class="fas fa-exclamation-triangle" style="margin-right:6px;"></i>Open Compliance Items ('+d.complianceItems.length+')</div>'
          + d.complianceItems.map(function(item, i){
            return '<div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:9px;font-size:12px;color:#7f1d1d;line-height:1.6;">'
              +'<span style="background:#dc2626;color:#fff;border-radius:50%;width:18px;height:18px;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">'+(i+1)+'</span>'
              +'<span>'+item+'</span></div>';
          }).join('')
          +'</div>')
      + _p33section('License & Certification', 'fa-certificate', '#003087')
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">'
      + _p33row('License Status', d.license === 'Current' ? '<span style="color:#059669;font-weight:800;">✅ Current</span>' : '<span style="color:#dc2626;font-weight:800;">⚠️ '+d.license+'</span>')
      + _p33row('License Expiry', d.licenseExp)
      + _p33row('Medicaid ID', d.medicaidId)
      + _p33row('EIN / Tax ID', d.ein)
      + _p33row('EVV Certification', d.evv ? '✅ CareExchange GPS Active' : '❌ Not Integrated')
      + _p33row('W-9 Tax Form', d.w9 ? '✅ On File · Current' : '⚠️ MISSING — Payment Hold')
      +'</div>'
      + _p33section('Contract Risk Assessment', 'fa-file-contract', '#d97706')
      +'<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px;margin-bottom:14px;font-size:12px;color:#92400e;line-height:1.7;">'
      + d.contractRisks
      +'</div>'
      + _p33ai('<strong>Compliance Intelligence:</strong> '
        + (d.complianceItems.length === 0 ? 'Full compliance across all tracked dimensions. This provider is a model for the network. No corrective actions, no regulatory watch items, no documentation gaps. WealthAI recommends using this provider\'s compliance record as the benchmark in carrier quality presentations.'
        : d.complianceItems.length <= 2 ? 'Minor compliance gaps detected. These items are manageable with targeted follow-up within 30-60 days. No immediate payment or regulatory risk — but left unaddressed, these gaps will accumulate into material issues at the next carrier audit.'
        : '🚨 Significant compliance burden. '+d.complianceItems.length+' active items span billing, EVV, licensing, and/or regulatory dimensions. This pattern suggests systemic administrative control failure. WealthAI recommends a structured 30-day corrective action plan with weekly progress reporting to IllumiFin account management.'));

    /* ── Panel 4: Risk & Fraud ── */
    var riskDims = [
      { dim: 'Fraud Score', score: Math.max(0, 100 - d.fraudScore*2), color: fc, weight: '30%' },
      { dim: 'Billing Integrity', score: Math.min(100, Math.round(d.billingAccuracy)), color: bc, weight: '25%' },
      { dim: 'License Risk', score: d.license === 'Current' ? 90 : d.license === 'Review' ? 35 : 10, color: d.license === 'Current' ? '#059669' : '#dc2626', weight: '20%' },
      { dim: 'Clinical Quality', score: Math.round(d.cmsRating / 5 * 100), color: d.cmsRating >= 4 ? '#059669' : d.cmsRating >= 3.5 ? '#d97706' : '#dc2626', weight: '15%' },
      { dim: 'EVV Compliance', score: d.evv ? 92 : 15, color: d.evv ? '#059669' : '#dc2626', weight: '10%' }
    ];

    var compositeScore = Math.round(
      riskDims[0].score * 0.30 +
      riskDims[1].score * 0.25 +
      riskDims[2].score * 0.20 +
      riskDims[3].score * 0.15 +
      riskDims[4].score * 0.10
    );
    var compColor = compositeScore >= 80 ? '#059669' : compositeScore >= 65 ? '#d97706' : '#dc2626';
    var compLabel = compositeScore >= 80 ? 'Low Risk' : compositeScore >= 65 ? 'Moderate Risk' : 'High Risk';

    var pan4 = '<div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:18px;margin-bottom:16px;">'
      +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">'
      +'<div>'
      +'<div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:3px;">WealthAI Risk Composite Score</div>'
      +'<div style="font-size:36px;font-weight:900;color:'+compColor+';">'+compositeScore+'<span style="font-size:18px;color:#9ca3af;">/100</span></div>'
      +'</div>'
      + _p33badge(compLabel, compColor)
      +'</div>'
      + riskDims.map(function(r){
        return '<div style="margin-bottom:12px;">'
          +'<div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px;">'
          +'<span style="font-weight:700;color:#374151;">'+r.dim+'</span>'
          +'<span style="font-weight:800;color:'+r.color+';">'+r.score+'/100 <span style="color:#9ca3af;font-weight:400;">(weight: '+r.weight+')</span></span>'
          +'</div>'
          +'<div style="background:#f3f4f6;border-radius:20px;height:8px;">'
          +'<div style="height:8px;border-radius:20px;background:'+r.color+';width:'+r.score+'%;transition:width 1s;"></div></div>'
          +'</div>';
      }).join('')
      +'</div>'
      + _p33section('Fraud Risk Analysis', 'fa-shield-alt', fc)
      +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px;">'
      + _p33kpi(d.fraudScore+'/100', 'AI Fraud Score', 'fa-shield-alt', fc, d.fraudScore < 10 ? 'Clear' : d.fraudScore < 20 ? 'Elevated' : 'High Risk')
      + _p33kpi(d.openClaims+'', 'Open Claims', 'fa-file-medical-alt', '#0891b2', 'Under management')
      + _p33kpi(d.billingAccuracy+'%', 'Billing Accuracy', 'fa-percent', bc, 'Fraud indicator proxy')
      +'</div>'
      + (d.fraudScore >= 20
        ? '<div style="background:#fef2f2;border:1.5px solid #fecaca;border-radius:10px;padding:14px;margin-bottom:14px;">'
          +'<div style="font-size:12px;font-weight:800;color:#dc2626;margin-bottom:8px;"><i class="fas fa-exclamation-triangle" style="margin-right:6px;"></i>SIU Alert — Elevated Fraud Indicators</div>'
          +'<div style="font-size:12px;color:#7f1d1d;line-height:1.7;">'
          + d.billingChecks.filter(function(b){ return b.status !== 'Clean' && b.status !== 'Current'; }).map(function(b){
            return '<div style="margin-bottom:6px;">⚠️ <strong>'+b.check+':</strong> '+b.detail+'</div>';
          }).join('')
          +'</div></div>'
        : '')
      + _p33ai('<strong>Fraud Risk Intelligence:</strong> WealthAI Fraud Sentry composite score: <strong>'+d.fraudScore+'/100</strong>. '
        + (d.fraudScore < 10 ? 'Risk level is CLEAR. No anomalous billing patterns detected in 90-day lookback. EVV GPS coverage matches billing records. Provider has a clean fraud history spanning the entire TPA relationship.'
        : d.fraudScore < 20 ? 'Risk level is ELEVATED but not at investigation threshold. The primary fraud exposure vector is '+(d.evv ? 'minor billing documentation inconsistencies' : 'EVV absence — manual attestation creates unverifiable billing gaps')+'. Recommend enhanced monitoring and EVV compliance enforcement.'
        : '🚨 FRAUD RISK HIGH. Score '+d.fraudScore+'/100 exceeds the 20-point SIU referral threshold. WealthAI has detected anomalous billing patterns that require active investigation. Claims under review should have payment suspended pending SIU clearance.'));

    /* ── Panel 5: AI Insights ── */
    var pan5 = _p33section('Network Intelligence', 'fa-lightbulb', '#7c3aed')
      + d.networkInsights.map(function(i){ return _p33insightBullet(i); }).join('')
      + _p33section('WealthAI Deep Strategic Analysis', 'fa-brain', '#7c3aed')
      + _p33ai('<strong>'+d.name+' — Complete Provider Intelligence</strong><br><br>'+d.deepInsight, 'linear-gradient(135deg,#7c3aed,#4c1d95)')
      + _p33section('AI Action Opportunities', 'fa-bolt', '#059669')
      + d.aiOpportunities.map(function(o){ return _p33oppCard(o, hc); }).join('');

    /* ── Assemble 6 panels ── */
    var panels = [pan0, pan1, pan2, pan3, pan4, pan5];
    var panelHtml = panels.map(function(pHtml, i){
      return '<div id="p33pan-'+uid+'-'+i+'" style="display:'+(i===0?'block':'none')+';">'+ pHtml +'</div>';
    }).join('');

    /* ── Compose full modal HTML ── */
    var html = '<div style="background:#fff;border-radius:16px;width:860px;max-width:96vw;max-height:92vh;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.35);display:flex;flex-direction:column;">'
      // Header
      +'<div style="background:linear-gradient(135deg,#0891b2,#0e7490);padding:20px 26px;color:#fff;display:flex;align-items:center;gap:14px;flex-shrink:0;">'
      +'<div style="width:46px;height:46px;background:rgba(255,255,255,.2);border-radius:12px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-hospital" style="font-size:22px;"></i></div>'
      +'<div>'
      +'<div style="font-size:18px;font-weight:900;">'+d.name+' — Full 360°</div>'
      +'<div style="font-size:12px;opacity:.85;">'+d.type+' · '+d.city+' · '+d.activePats+' active patients · '+_p33badge(d.aiHealth, d.aiHealth==='Excellent'?'#059669':d.aiHealth==='Good'?'#0891b2':d.aiHealth==='Needs Attention'?'#d97706':'#dc2626', 'rgba(255,255,255,.2)')+'</div>'
      +'</div>'
      +'<button onclick="_p33close(\'p33-full-'+providerId+'\')" style="margin-left:auto;background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:8px;padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;">✕ Close</button>'
      +'</div>'
      // Tab bar
      +'<div style="display:flex;border-bottom:1.5px solid #e5e7eb;background:#fafafa;overflow-x:auto;flex-shrink:0;">'
      + tabDefs.map(function(t, i){ return _p33tab(i, uid, t.label, t.icon); }).join('')
      +'</div>'
      // Scrollable body
      +'<div style="padding:22px;overflow-y:auto;flex:1;">'
      + panelHtml
      +'</div>'
      // Action footer
      +'<div style="display:flex;gap:8px;flex-wrap:wrap;padding:16px 22px;border-top:1px solid #f3f4f6;background:#fafafa;flex-shrink:0;">'
      +'<button onclick="ltcProviderAction(\'contact\',\''+providerId+'\')" style="background:#0891b2;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:12px;font-weight:700;cursor:pointer;"><i class="fas fa-phone" style="margin-right:6px;"></i>Contact '+d.contact.split(',')[0]+'</button>'
      +'<button onclick="ltcProviderAction(\'site-visit\',\''+providerId+'\')" style="background:#003087;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:12px;font-weight:700;cursor:pointer;"><i class="fas fa-map-marker-alt" style="margin-right:6px;"></i>Site Visit</button>'
      +'<button onclick="ltcProviderAction(\'audit\',\''+providerId+'\')" style="background:#d97706;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:12px;font-weight:700;cursor:pointer;"><i class="fas fa-search" style="margin-right:6px;"></i>Billing Audit</button>'
      +(d.fraudScore >= 20 || d.aiHealth === 'Critical' ? '<button onclick="ltcProviderAction(\'claims\',\''+providerId+'\')" style="background:#dc2626;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:12px;font-weight:700;cursor:pointer;"><i class="fas fa-file-medical-alt" style="margin-right:6px;"></i>Review Claims</button>' : '')
      +'<button onclick="_p33close(\'p33-full-'+providerId+'\');_p33openDeepReview(\''+providerId+'\')" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:12px;font-weight:700;cursor:pointer;"><i class="fas fa-robot" style="margin-right:6px;"></i>AI Deep Review</button>'
      +'</div>'
      +'</div>';

    _p33ov('p33-full-'+providerId, html);
    setTimeout(function(){ window._p33switchTab(uid, 0); }, 50);
  };

  /* ═══════════════════════════════════════════════════════════════════════
     AI NETWORK SCAN — ENTERPRISE NETWORK INTELLIGENCE DASHBOARD
  ═══════════════════════════════════════════════════════════════════════ */
  function _p33openNetworkScan() {
    var allD    = Object.values(_p33providers);
    var hcMap   = { Excellent:'#059669', Good:'#0891b2', 'Needs Attention':'#d97706', Critical:'#dc2626' };
    var totalPats  = allD.reduce(function(s,x){ return s + x.activePats; }, 0);
    var totalClaims= allD.reduce(function(s,x){ return s + x.openClaims; }, 0);
    var totalBill  = allD.reduce(function(s,x){
      return s + parseFloat((x.monthlyBilling||'$0').replace(/[^0-9.]/g,''));
    }, 0);
    var avgBilling = (allD.reduce(function(s,x){ return s + x.billingAccuracy; }, 0) / allD.length).toFixed(1);
    var avgFraud   = (allD.reduce(function(s,x){ return s + x.fraudScore; }, 0) / allD.length).toFixed(1);
    var avgCMS     = (allD.reduce(function(s,x){ return s + x.cmsRating; }, 0) / allD.length).toFixed(1);

    var healthDist = { Excellent:0, Good:0, 'Needs Attention':0, Critical:0 };
    allD.forEach(function(x){ healthDist[x.aiHealth] = (healthDist[x.aiHealth]||0)+1; });

    // Provider table rows
    var provRows = allD.map(function(x){
      var hc  = hcMap[x.aiHealth] || '#6b7280';
      var bc  = x.billingAccuracy >= 97 ? '#059669' : x.billingAccuracy >= 95 ? '#d97706' : '#dc2626';
      var fc  = x.fraudScore < 10 ? '#059669' : x.fraudScore < 20 ? '#d97706' : '#dc2626';
      return '<tr style="border-bottom:1px solid #f3f4f6;">'
        +'<td style="padding:10px 12px;font-size:12px;font-weight:800;color:#111827;"><i class="fas fa-hospital" style="color:#0891b2;margin-right:7px;"></i>'+x.name+'</td>'
        +'<td style="padding:10px 12px;font-size:11px;color:#6b7280;">'+x.type.replace('Skilled Nursing Facility','SNF').replace('Home Health Agency','HHA').replace('Assisted Living Facility','ALF').replace('Memory Care Facility','MCF')+'</td>'
        +'<td style="padding:10px 12px;font-size:12px;font-weight:700;color:#374151;">'+x.activePats+'</td>'
        +'<td style="padding:10px 12px;font-size:12px;font-weight:800;color:'+bc+';">'+x.billingAccuracy+'%</td>'
        +'<td style="padding:10px 12px;font-size:12px;font-weight:800;color:'+fc+';">'+x.fraudScore+'/100</td>'
        +'<td style="padding:10px 12px;font-size:12px;font-weight:700;color:#374151;">'+x.cmsRating+'⭐</td>'
        +'<td style="padding:10px 12px;font-size:12px;font-weight:700;color:'+(x.license==='Current'?'#059669':'#dc2626')+';">'+(x.license==='Current'?'✅ Current':'⚠️ '+x.license)+'</td>'
        +'<td style="padding:10px 12px;font-size:11px;"><span style="background:'+hc+'1a;color:'+hc+';border:1px solid '+hc+'44;border-radius:20px;padding:2px 9px;font-size:10px;font-weight:700;">'+x.aiHealth+'</span></td>'
        +'<td style="padding:10px 12px;">'
        +'<button onclick="_p33close(\'p33-network-scan-ov\');ltcOpenProvider360(\''+x.id+'\')" style="background:#0891b2;color:#fff;border:none;border-radius:6px;padding:4px 10px;font-size:10px;font-weight:700;cursor:pointer;margin-right:4px;">Full 360</button>'
        +'<button onclick="_p33close(\'p33-network-scan-ov\');_p33openDeepReview(\''+x.id+'\')" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;border:none;border-radius:6px;padding:4px 10px;font-size:10px;font-weight:700;cursor:pointer;">AI Review</button>'
        +'</td>'
        +'</tr>';
    }).join('');

    // Network intelligence bullets
    var networkInsights = [
      'Network total: <strong>'+totalPats+' active LTC patients</strong> across 6 providers — <strong>$'+totalBill.toFixed(0)+'K/month</strong> in claims managed ($'+(totalBill*12/1000).toFixed(1)+'M ARR).',
      'Billing accuracy range: <strong>'+Math.min.apply(null, allD.map(function(x){return x.billingAccuracy;}))+'% (Oakwood) to '+Math.max.apply(null, allD.map(function(x){return x.billingAccuracy;}))+'% (Sunrise Manor SNF)</strong>. Network average '+avgBilling+'% vs 95% contractual floor.',
      'Fraud risk distribution: 2 providers HIGH risk (BrightPath: 22, Oakwood: 31), 1 ELEVATED (Memory Lane: 14), 3 LOW risk. Network average fraud score: '+avgFraud+'/100.',
      'EVV compliance: <strong>5 of 6 providers</strong> have GPS-backed EVV active. Memory Lane Care Center has EVV not integrated — contract §7.4 remediation in progress.',
      'W-9 compliance: <strong>5 of 6 providers</strong> have W-9 on file. BrightPath Homecare W-9 is missing — payment hold active on $108K/month.',
      'License status: <strong>5 of 6 providers</strong> have current licenses. Oakwood Care Center is under MA DPH review — new referrals suspended.',
      'CMS quality average across network: <strong>'+avgCMS+' stars</strong>. Sunrise Manor (4.5⭐) and Sunrise Gardens (4.3⭐) lead quality. Oakwood (3.6⭐) is below acceptable threshold.',
      'IMMEDIATE priorities: (1) Oakwood — executive escalation + patient review (2) BrightPath — W-9 collection + unannounced site visit (3) Memory Lane — EVV onboarding + billing corrective plan.'
    ];

    // Action Plan
    var actionPlan = [
      { priority:'🔴 IMMEDIATE', action:'Oakwood Care Center executive escalation', owner:'VP Claims + Legal', due:'Jul 12, 2026' },
      { priority:'🔴 IMMEDIATE', action:'Ruth Blackwood (LTC-2026-0107) care plan review at Oakwood', owner:'Senior Care Manager', due:'Jul 14, 2026' },
      { priority:'🔴 IMMEDIATE', action:'BrightPath W-9 collection — payment hold lift', owner:'Provider Relations', due:'Jul 17, 2026' },
      { priority:'🟠 HIGH', action:'BrightPath unannounced site visit', owner:'QA Director + RN', due:'Jul 22, 2026' },
      { priority:'🟠 HIGH', action:'Memory Lane EVV onboarding — 45-day deadline', owner:'Tech Integration', due:'Aug 25, 2026' },
      { priority:'🟠 HIGH', action:'Memory Lane billing corrective action plan', owner:'Claims Ops', due:'Aug 1, 2026' },
      { priority:'🟡 MEDIUM', action:'ComfortCare EVV gap (2 visits) — attestation follow-up', owner:'Provider Relations', due:'Jul 25, 2026' },
      { priority:'🟢 STRATEGIC', action:'Sunrise Manor + Sunrise Gardens Preferred Network designation', owner:'EVP Provider Relations', due:'Aug 15, 2026' }
    ];

    var actionRows = actionPlan.map(function(a){
      return '<tr style="border-bottom:1px solid #f3f4f6;">'
        +'<td style="padding:9px 12px;font-size:11px;font-weight:700;">'+a.priority+'</td>'
        +'<td style="padding:9px 12px;font-size:12px;color:#111827;font-weight:600;">'+a.action+'</td>'
        +'<td style="padding:9px 12px;font-size:11px;color:#6b7280;">'+a.owner+'</td>'
        +'<td style="padding:9px 12px;font-size:11px;font-weight:700;color:#374151;">'+a.due+'</td>'
        +'</tr>';
    }).join('');

    var html = '<div style="background:#fff;border-radius:16px;width:980px;max-width:96vw;box-shadow:0 24px 80px rgba(0,0,0,.35);overflow:hidden;">'
      // Header
      +'<div style="background:linear-gradient(135deg,#0891b2,#0e7490);padding:22px 28px;color:#fff;display:flex;align-items:center;gap:14px;">'
      +'<div style="width:50px;height:50px;background:rgba(255,255,255,.15);border-radius:14px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-robot" style="font-size:24px;"></i></div>'
      +'<div><div style="font-size:20px;font-weight:900;">AI Network Scan — All Providers</div>'
      +'<div style="font-size:12px;opacity:.85;">Enterprise healthcare provider network intelligence · IllumiFin WealthAI · Q3 2026</div></div>'
      +'<button onclick="_p33close(\'p33-network-scan-ov\')" style="margin-left:auto;background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:8px;padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;">✕ Close</button>'
      +'</div>'
      +'<div style="padding:24px;max-height:82vh;overflow-y:auto;">'

      // Network KPIs
      +'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:22px;">'
      + _p33kpi(allD.length+'', 'Network Providers', 'fa-hospital', '#0891b2', 'Active + Review')
      + _p33kpi(totalPats+'', 'Active Patients', 'fa-user-injured', '#dc2626', 'Across all facilities')
      + _p33kpi(totalClaims+'', 'Open Claims', 'fa-file-medical-alt', '#d97706', 'Under TPA management')
      + _p33kpi('$'+totalBill.toFixed(0)+'K/mo', 'Claims Managed', 'fa-dollar-sign', '#059669', 'YTD ~$'+(totalBill*7/1000).toFixed(1)+'M')
      + _p33kpi(avgBilling+'%', 'Avg Billing Accuracy', 'fa-percent', parseFloat(avgBilling) >= 95 ? '#059669' : '#d97706', 'vs 95% minimum')
      +'</div>'

      // Health Distribution
      +'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:22px;">'
      + Object.entries(healthDist).map(function(e){
        var hc2 = hcMap[e[0]] || '#6b7280';
        return '<div style="background:'+hc2+'0f;border:1.5px solid '+hc2+'33;border-radius:12px;padding:14px;text-align:center;">'
          +'<div style="font-size:28px;font-weight:900;color:'+hc2+';">'+e[1]+'</div>'
          +'<div style="font-size:11px;font-weight:700;color:'+hc2+';margin-top:4px;">'+e[0]+'</div>'
          +'</div>';
      }).join('')
      +'</div>'

      // WealthAI Network Analysis
      + _p33ai('<strong>WEALTHAI NETWORK INTELLIGENCE BRIEF — Q3 2026</strong><br><br>'
        +'<strong>Network Health:</strong> 6 active provider relationships across SNF, HHA, ALF, and Memory Care. 2 Excellent · 1 Good · 2 Needs Attention · 1 CRITICAL (Oakwood — license review + fraud).<br><br>'
        +'<strong>Billing Integrity:</strong> Network average billing accuracy '+avgBilling+'% — '+(parseFloat(avgBilling) >= 95 ? 'within threshold but skewed by top performers. Oakwood (91.4%) and BrightPath (93.2%) are below the 95% minimum — corrective plans active.' : 'BELOW 95% threshold — urgent corrective action required across multiple providers.')+'<br><br>'
        +'<strong>Fraud Exposure:</strong> Network average fraud score '+avgFraud+'/100. Two providers exceed the 20-point SIU threshold (BrightPath: 22, Oakwood: 31). Active SIU investigation on 4 claims. Estimated fraud exposure: $42K in claims under secondary review.<br><br>'
        +'<strong>Strategic Priorities:</strong> (1) Oakwood executive escalation — license + SIU + patient safety convergence; (2) BrightPath W-9 + EVV + site visit — multi-failure remediation; (3) Memory Lane EVV onboarding; (4) Elevate Sunrise Manor and Sunrise Gardens to Preferred Network status.', 'linear-gradient(135deg,#0891b2,#0e7490)')

      // Provider Scorecard Table
      +'<div style="font-size:13px;font-weight:800;color:#111827;margin:18px 0 10px;display:flex;align-items:center;gap:8px;"><i class="fas fa-table" style="color:#0891b2;"></i> Provider Performance Scorecard</div>'
      +'<div style="overflow-x:auto;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:22px;">'
      +'<table style="width:100%;border-collapse:collapse;">'
      +'<thead><tr style="background:#f8fafc;">'
      +'<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;">Provider</th>'
      +'<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;">Type</th>'
      +'<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;">Patients</th>'
      +'<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;">Billing Acc.</th>'
      +'<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;">Fraud Score</th>'
      +'<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;">CMS Stars</th>'
      +'<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;">License</th>'
      +'<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;">Health</th>'
      +'<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;">Actions</th>'
      +'</tr></thead>'
      +'<tbody>'+provRows+'</tbody>'
      +'</table></div>'

      // Network Intelligence
      +'<div style="font-size:13px;font-weight:800;color:#111827;margin:18px 0 10px;display:flex;align-items:center;gap:8px;"><i class="fas fa-lightbulb" style="color:#7c3aed;"></i> Network Intelligence</div>'
      +'<div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:16px;margin-bottom:22px;">'
      + networkInsights.map(function(i){ return _p33insightBullet(i); }).join('')
      +'</div>'

      // Action Plan
      +'<div style="font-size:13px;font-weight:800;color:#111827;margin:18px 0 10px;display:flex;align-items:center;gap:8px;"><i class="fas fa-tasks" style="color:#dc2626;"></i> AI-Recommended Action Plan</div>'
      +'<div style="overflow-x:auto;border:1px solid #e5e7eb;border-radius:12px;margin-bottom:22px;">'
      +'<table style="width:100%;border-collapse:collapse;">'
      +'<thead><tr style="background:#f8fafc;">'
      +'<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;width:130px;">Priority</th>'
      +'<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;">Action</th>'
      +'<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;">Owner</th>'
      +'<th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;">Due</th>'
      +'</tr></thead>'
      +'<tbody>'+actionRows+'</tbody>'
      +'</table></div>'

      // Action Buttons
      +'<div style="display:flex;gap:10px;flex-wrap:wrap;">'
      +'<button onclick="_p33close(\'p33-network-scan-ov\');_p33toast(\'<i class=\"fas fa-file-pdf\"></i> AI Network Scan Report exported · PDF sent to VP Claims and Provider Relations · Ref: NETSCAN-Q3-2026\',4500);" style="background:#0891b2;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:12px;font-weight:700;cursor:pointer;"><i class="fas fa-file-pdf" style="margin-right:6px;"></i>Export Report</button>'
      +'<button onclick="_p33close(\'p33-network-scan-ov\');ltcOpenProvider360(\'PRV-006\')" style="background:#dc2626;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:12px;font-weight:700;cursor:pointer;"><i class="fas fa-exclamation-triangle" style="margin-right:6px;"></i>Escalate Oakwood</button>'
      +'<button onclick="_p33close(\'p33-network-scan-ov\');_p33toast(\'<i class=\"fas fa-calendar\"></i> Network QA review meeting scheduled · All provider managers notified · Agenda: Oakwood escalation · BrightPath remediation · Memory Lane EVV · Date: Jul 18, 2026 · 10:00 AM\',5000);" style="background:#003087;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:12px;font-weight:700;cursor:pointer;"><i class="fas fa-calendar" style="margin-right:6px;"></i>Schedule Network Review</button>'
      +'<button onclick="_p33close(\'p33-network-scan-ov\');_p33toast(\'<i class=\"fas fa-envelope\"></i> AI Action Plan emailed to VP Claims · Provider Relations Director · Compliance Officer · Q3 2026 network remediation tracker activated\',4500);" style="background:#7c3aed;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:12px;font-weight:700;cursor:pointer;"><i class="fas fa-envelope" style="margin-right:6px;"></i>Email Action Plan</button>'
      +'</div>'
      +'</div></div>';

    _p33ov('p33-network-scan-ov', html);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     AI DEEP REVIEW — COMPOSITE SCORE + STRATEGIC INTELLIGENCE
  ═══════════════════════════════════════════════════════════════════════ */
  window._p33openDeepReview = function(providerId) {
    var d = _p33providers[providerId];
    if (!d) { _p33toast('<i class="fas fa-robot"></i> Provider not found in intelligence database', 3000); return; }

    var hc = { Excellent:'#059669', Good:'#0891b2', 'Needs Attention':'#d97706', Critical:'#dc2626' }[d.aiHealth] || '#6b7280';
    var bc = d.billingAccuracy >= 97 ? '#059669' : d.billingAccuracy >= 95 ? '#d97706' : '#dc2626';
    var fc = d.fraudScore < 10 ? '#059669' : d.fraudScore < 20 ? '#d97706' : '#dc2626';

    // Composite scoring model (0-100)
    var scoreDims = [
      { label:'Billing Accuracy',    weight:0.25, raw: Math.min(100, Math.round(d.billingAccuracy)),     color:'#059669', wPct:'25%' },
      { label:'Clinical Quality',    weight:0.20, raw: Math.min(100, Math.round(d.cmsRating / 5 * 100)), color:'#0891b2', wPct:'20%' },
      { label:'Fraud Risk Inverse',  weight:0.20, raw: Math.max(0, 100 - d.fraudScore * 2),              color:'#7c3aed', wPct:'20%' },
      { label:'Compliance Score',    weight:0.15, raw: Math.max(0, 100 - d.complianceItems.length * 15), color:'#d97706', wPct:'15%' },
      { label:'EVV & Documentation', weight:0.10, raw: d.evv ? (d.billingAccuracy >= 95 ? 95 : 80) : 20, color:'#0891b2', wPct:'10%' },
      { label:'License & Standing',  weight:0.10, raw: d.license === 'Current' ? 95 : d.license === 'Review' ? 30 : 5, color:'#003087', wPct:'10%' }
    ];

    var composite = Math.round(scoreDims.reduce(function(s, dim){ return s + dim.raw * dim.weight; }, 0));
    var compColor = composite >= 80 ? '#059669' : composite >= 65 ? '#d97706' : '#dc2626';
    var compLabel = composite >= 80 ? 'Excellent' : composite >= 65 ? 'Good Standing' : composite >= 50 ? 'Needs Attention' : 'Critical';

    var html = '<div style="background:#fff;border-radius:16px;width:900px;max-width:96vw;box-shadow:0 24px 80px rgba(0,0,0,.35);overflow:hidden;">'
      // Header
      +'<div style="background:linear-gradient(135deg,#7c3aed,#4c1d95);padding:22px 28px;color:#fff;display:flex;align-items:center;gap:14px;">'
      +'<div style="width:50px;height:50px;background:rgba(255,255,255,.15);border-radius:14px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-robot" style="font-size:24px;"></i></div>'
      +'<div><div style="font-size:20px;font-weight:900;">AI Deep Review — '+d.name+'</div>'
      +'<div style="font-size:12px;opacity:.85;">WealthAI Intelligence · '+d.type+' · '+d.city+' · Q3 2026</div></div>'
      +'<button onclick="_p33close(\'p33-deep-'+providerId+'\')" style="margin-left:auto;background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:8px;padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;">✕ Close</button>'
      +'</div>'
      +'<div style="padding:24px;max-height:84vh;overflow-y:auto;">'

      // Composite Score
      +'<div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:20px;margin-bottom:20px;">'
      +'<div style="display:flex;align-items:flex-start;gap:22px;margin-bottom:18px;">'
      +'<div style="text-align:center;flex-shrink:0;">'
      +'<div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:4px;">WealthAI Score</div>'
      +'<div style="font-size:52px;font-weight:900;line-height:1;color:'+compColor+';">'+composite+'</div>'
      +'<div style="font-size:13px;color:#9ca3af;">/100</div>'
      +'<div style="margin-top:6px;">' + _p33badge(compLabel, compColor) + '</div>'
      +'</div>'
      +'<div style="flex:1;">'
      + scoreDims.map(function(dim){
        return '<div style="margin-bottom:11px;">'
          +'<div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px;">'
          +'<span style="font-weight:700;color:#374151;">'+dim.label+'</span>'
          +'<span style="font-weight:800;color:'+dim.color+';">'+dim.raw+'/100 <span style="color:#9ca3af;font-weight:400;">('+dim.wPct+')</span></span>'
          +'</div>'
          +'<div style="background:#f3f4f6;border-radius:20px;height:8px;">'
          +'<div style="height:8px;border-radius:20px;background:'+dim.color+';width:'+dim.raw+'%;transition:width 1.2s;"></div></div>'
          +'</div>';
      }).join('')
      +'</div></div>'
      +'</div>'

      // 4 KPIs
      +'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;">'
      + _p33kpi(d.activePats+'', 'Active Patients', 'fa-user-injured', '#dc2626', 'Currently in care')
      + _p33kpi(d.billingAccuracy+'%', 'Billing Accuracy', 'fa-percent', bc, 'vs 95% threshold')
      + _p33kpi(d.fraudScore+'/100', 'Fraud Risk Score', 'fa-shield-alt', fc, d.fraudScore < 10 ? 'Clear' : 'SIU Watch')
      + _p33kpi(d.cmsRating+'⭐', 'CMS Quality Stars', 'fa-star', d.cmsRating >= 4 ? '#059669' : '#d97706', d.city)
      +'</div>'

      // Deep Strategic Analysis
      + _p33ai('<strong>'+d.shortName+' — WealthAI Strategic Intelligence</strong><br><br>'+d.deepInsight, 'linear-gradient(135deg,#7c3aed,#4c1d95)')

      // Network Intelligence bullets
      + _p33section('Network Intelligence', 'fa-lightbulb', '#7c3aed')
      +'<div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:14px;margin-bottom:18px;">'
      + d.networkInsights.map(function(i){ return _p33insightBullet(i); }).join('')
      +'</div>'

      // Clinical Quality Metrics
      + _p33section('Quality Metrics vs Benchmark', 'fa-heartbeat', '#0891b2')
      + '<div style="background:#f8fafc;border-radius:8px;padding:8px 14px;margin-bottom:6px;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:8px;">'
      +'<span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;">Metric</span>'
      +'<span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;">Value</span>'
      +'<span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;">Benchmark</span>'
      +'<span style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;">Trend</span>'
      +'</div>'
      + d.qualityMetrics.map(function(q){ return _p33qualRow(q); }).join('')

      // Compliance Summary
      + (d.complianceItems.length > 0
        ? _p33section('Open Compliance Items', 'fa-exclamation-triangle', '#d97706')
          +'<div style="background:#fef2f2;border:1.5px solid #fecaca;border-radius:12px;padding:14px;margin-bottom:18px;">'
          + d.complianceItems.map(function(item, i){
            return '<div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;font-size:12px;color:#7f1d1d;line-height:1.6;">'
              +'<span style="background:#dc2626;color:#fff;border-radius:50%;width:18px;height:18px;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">'+(i+1)+'</span>'
              +'<span>'+item+'</span></div>';
          }).join('')
          +'</div>'
        : '')

      // AI Action Opportunities
      + _p33section('AI-Identified Action Opportunities', 'fa-bolt', '#059669')
      + d.aiOpportunities.map(function(o){ return _p33oppCard(o, hc); }).join('')

      // TPA Value
      + _p33section('TPA Administrative Value', 'fa-chart-bar', '#003087')
      +'<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:22px;">'
      + d.tpaValue.map(function(t){
        return '<div style="background:#f0f4ff;border:1px solid #c7d2fe;border-radius:10px;padding:13px;">'
          +'<div style="font-size:15px;font-weight:800;color:#003087;">'+t.value+'</div>'
          +'<div style="font-size:11px;font-weight:700;color:#374151;margin-top:2px;">'+t.metric+'</div>'
          +'<div style="font-size:10px;color:#6b7280;">'+t.trend+'</div></div>';
      }).join('')
      +'</div>'

      // Action buttons
      +'<div style="display:flex;gap:8px;flex-wrap:wrap;padding-top:16px;border-top:1px solid #f3f4f6;">'
      +'<button onclick="_p33close(\'p33-deep-'+providerId+'\');_p33toast(\'<i class=\"fas fa-file-pdf\"></i> AI Deep Review for '+d.shortName+' exported · PDF sent to VP Claims · Ref: AIREV-'+providerId+'-Q3-2026\',4500);" style="background:#7c3aed;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:12px;font-weight:700;cursor:pointer;"><i class="fas fa-file-pdf" style="margin-right:6px;"></i>Export PDF</button>'
      +(d.aiHealth === 'Critical' || d.fraudScore >= 20 ? '<button onclick="_p33close(\'p33-deep-'+providerId+'\');ltcProviderAction(\'site-visit\',\''+providerId+'\')" style="background:#dc2626;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:12px;font-weight:700;cursor:pointer;"><i class="fas fa-exclamation-triangle" style="margin-right:6px;"></i>Escalate</button>' : '')
      +'<button onclick="ltcProviderAction(\'contact\',\''+providerId+'\')" style="background:#0891b2;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:12px;font-weight:700;cursor:pointer;"><i class="fas fa-phone" style="margin-right:6px;"></i>Contact Provider</button>'
      +'<button onclick="_p33close(\'p33-deep-'+providerId+'\');ltcOpenProvider360(\''+providerId+'\')" style="background:#003087;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:12px;font-weight:700;cursor:pointer;"><i class="fas fa-id-badge" style="margin-right:6px;"></i>Back to Full 360</button>'
      +'<button onclick="_p33close(\'p33-deep-'+providerId+'\')" style="background:#f3f4f6;color:#374151;border:none;border-radius:8px;padding:10px 16px;font-size:12px;font-weight:700;cursor:pointer;">Close</button>'
      +'</div>'
      +'</div></div>';

    _p33ov('p33-deep-'+providerId, html);
  };

  /* ═══════════════════════════════════════════════════════════════════════
     OVERRIDE ltcProviderAction to wire AI Network Scan + AI Deep Review
  ═══════════════════════════════════════════════════════════════════════ */
  var _p33origProviderAction = window.ltcProviderAction;

  window.ltcProviderAction = function(action, providerId) {
    if (action === 'ai-scan') {
      _p33openNetworkScan();
      return;
    }
    if (action === 'ai-review') {
      _p33close('ltc-provider-360-ov');
      _p33close('p33-full-'+providerId);
      _p33openDeepReview(providerId);
      return;
    }
    // Delegate all other actions to the existing handler
    if (_p33origProviderAction) _p33origProviderAction(action, providerId);
  };

  console.log('[P33] Healthcare Provider 360: AI Network Scan dashboard · Enhanced Full 360 (6-tab: Overview·Clinical·Billing·Compliance·Risk·AI) · AI Deep Review with composite scoring · Providers: Sunrise Manor · ComfortCare · Memory Lane · Sunrise Gardens · BrightPath · Oakwood');
})();
