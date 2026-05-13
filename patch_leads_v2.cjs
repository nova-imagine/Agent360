/**
 * patch_leads_v2.cjs
 * Full Leads page rebuild:
 *   - 6-stage lifecycle (new/contacted/qualified/in-campaign/responded/converted)
 *   - 3-domain propensity bar (Insurance / Investments / Retirement)
 *   - AI opener per lead
 *   - Contact log on each lead
 *   - Functional Schedule Call modal (3 AI slots + call script + outcome logging)
 *   - Functional Outreach modal (channel + AI draft + contact logging)
 *   - Add to Campaign modal (after PMAIL qualify)
 *   - Correct CTA per lifecycle stage
 *   - PMAIL result → "Add to Campaign" (not instant Prospect creation)
 *   - Converted CTA → "View Lead History"
 * Guard: LEADS_V2_PATCH_APPLIED
 */

'use strict';
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'public/static/app.js');
let src = fs.readFileSync(FILE, 'utf8');

if (src.includes('/* LEADS_V2_PATCH_APPLIED */')) {
  console.log('Already applied — skipping.');
  process.exit(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. REPLACE leadsData (add status stages, domainScores, contactLog, campaignLink)
// ─────────────────────────────────────────────────────────────────────────────
const OLD_LEADS_DATA = `var leadsData = [
  {
    id: 'L001', name: 'Alex Rivera',      initials: 'AR', avatarColor: '#003087',`;

const NEW_LEADS_DATA = `var leadsData = [
  {
    id: 'L001', name: 'Alex Rivera',      initials: 'AR', avatarColor: '#003087',
    domainScores: { ins: 88, inv: 42, ret: 18 },
    contactLog: [
      { date: 'Mar 29, 2026', type: 'call',  outcome: 'Left VM', note: 'Intro call — left voicemail' },
      { date: 'Apr 3,  2026', type: 'email', outcome: 'Replied', note: 'Confirmed interest in WL, budget ~$350/mo' }
    ],
    campaignLink: { id: 'CAM002', name: 'Business Owner Shield Campaign', responded: true, responseDate: 'Apr 3, 2026', responseNote: 'Replied to email Day 0 — confirmed interest' },`;

if (!src.includes(OLD_LEADS_DATA)) { console.error('ANCHOR 1 not found'); process.exit(1); }
src = src.replace(OLD_LEADS_DATA, NEW_LEADS_DATA);

// ── Patch each lead's status + add domainScores/contactLog/campaignLink ──────

// L002 Nancy Foster — status: converted
src = src.replace(
  `    lifeEventTrigger: 'Home Purchase',
    lifeEventDetail: 'Purchased $740K home — Brooklyn, Mar 2026',
    referralSource: 'Public Record — Mortgage Filing',
    referralType: 'public-record',
    productInterest: ['Term Life', 'LTC'],
    entryDate: 'Apr 1, 2026',
    status: 'converted',
    prospectId: 'P002',`,
  `    lifeEventTrigger: 'Home Purchase',
    lifeEventDetail: 'Purchased $740K home — Brooklyn, Mar 2026',
    referralSource: 'Public Record — Mortgage Filing',
    referralType: 'public-record',
    productInterest: ['Term Life', 'LTC'],
    domainScores: { ins: 82, inv: 18, ret: 34 },
    entryDate: 'Apr 1, 2026',
    status: 'converted',
    prospectId: 'P002',
    campaignLink: { id: 'CAM004', name: 'High-Income Mortgage Protection', responded: true, responseDate: 'Apr 6, 2026', responseNote: 'Opened email Day 5, replied "what do you recommend?"' },
    contactLog: [
      { date: 'Apr 2, 2026', type: 'email', outcome: 'Delivered', note: 'Campaign email sent' },
      { date: 'Apr 6, 2026', type: 'email', outcome: 'Replied',   note: 'Client replied — confirmed interest in Term Life' },
      { date: 'Apr 8, 2026', type: 'call',  outcome: 'Reached',   note: 'Discovery call — PMAIL completed, qualified' }
    ],`
);

// L003 John Kim — status: converted
src = src.replace(
  `    lifeEventTrigger: 'Job Change / Income Event',
    lifeEventDetail: 'Joined Google as Staff Engineer — Sep 2024; ESPP vesting $42K Q1 2026',
    referralSource: 'LinkedIn Outreach',
    referralType: 'linkedin',
    productInterest: ['Disability Insurance', 'Investment'],
    entryDate: 'Mar 15, 2026',
    status: 'converted',
    prospectId: 'P003',`,
  `    lifeEventTrigger: 'Job Change / Income Event',
    lifeEventDetail: 'Joined Google as Staff Engineer — Sep 2024; ESPP vesting $42K Q1 2026',
    referralSource: 'LinkedIn Outreach',
    referralType: 'linkedin',
    productInterest: ['Disability Insurance', 'Investment'],
    domainScores: { ins: 62, inv: 81, ret: 44 },
    entryDate: 'Mar 15, 2026',
    status: 'converted',
    prospectId: 'P003',
    campaignLink: { id: 'CAM002', name: 'Business Owner Shield Campaign', responded: true, responseDate: 'Apr 5, 2026', responseNote: 'LinkedIn reply — "Tell me more about DI coverage"' },
    contactLog: [
      { date: 'Mar 16, 2026', type: 'linkedin', outcome: 'Sent',    note: 'LinkedIn connection + intro message' },
      { date: 'Mar 20, 2026', type: 'email',    outcome: 'Opened',  note: 'Follow-up email opened, no reply' },
      { date: 'Apr 2, 2026',  type: 'call',     outcome: 'Reached', note: 'DI gap discussion — ESPP vesting confirmed' },
      { date: 'Apr 5, 2026',  type: 'email',    outcome: 'Replied', note: 'Confirmed interest, PMAIL completed' }
    ],`
);

// L004 Michael Santos — status: converted
src = src.replace(
  `    lifeEventTrigger: 'Business Event',
    lifeEventDetail: 'LLC revenue +22% YoY; new bank loan $200K; hired 4 employees Jan 2026',
    referralSource: 'Referral — Linda Morrison (client)',
    referralType: 'client-referral',
    productInterest: ['Key-Person Life', 'Buy-Sell', 'UL'],
    entryDate: 'Mar 20, 2026',
    status: 'converted',
    prospectId: 'P004',`,
  `    lifeEventTrigger: 'Business Event',
    lifeEventDetail: 'LLC revenue +22% YoY; new bank loan $200K; hired 4 employees Jan 2026',
    referralSource: 'Referral — Linda Morrison (client)',
    referralType: 'client-referral',
    productInterest: ['Key-Person Life', 'Buy-Sell', 'UL'],
    domainScores: { ins: 96, inv: 28, ret: 22 },
    entryDate: 'Mar 20, 2026',
    status: 'converted',
    prospectId: 'P004',
    campaignLink: { id: 'CAM002', name: 'Business Owner Shield Campaign', responded: true, responseDate: 'Mar 22, 2026', responseNote: 'Took phone call Day 8 — "I\'ve been meaning to look into this"' },
    contactLog: [
      { date: 'Mar 20, 2026', type: 'call',  outcome: 'Reached', note: 'Linda Morrison intro — warm call, immediate interest' },
      { date: 'Mar 22, 2026', type: 'call',  outcome: 'Reached', note: 'PMAIL completed — key-person life + buy-sell confirmed' }
    ],`
);

// L005 Julia Chen — status: converted
src = src.replace(
  `    lifeEventTrigger: 'Retirement',
    lifeEventDetail: 'Retired from Columbia Jan 2026; $180K CD maturing May 2026',
    referralSource: 'Seminar — NYL Retirement Workshop',
    referralType: 'seminar',
    productInterest: ['Fixed Annuity', 'Income Annuity'],
    entryDate: 'Mar 18, 2026',
    status: 'converted',
    prospectId: 'P005',`,
  `    lifeEventTrigger: 'Retirement',
    lifeEventDetail: 'Retired from Columbia Jan 2026; $180K CD maturing May 2026',
    referralSource: 'Seminar — NYL Retirement Workshop',
    referralType: 'seminar',
    productInterest: ['Fixed Annuity', 'Income Annuity'],
    domainScores: { ins: 38, inv: 45, ret: 91 },
    entryDate: 'Mar 18, 2026',
    status: 'converted',
    prospectId: 'P005',
    campaignLink: { id: 'CAM003', name: 'Retirement Income Readiness', responded: true, responseDate: 'Mar 18, 2026', responseNote: 'Replied to seminar follow-up email same day — "Yes please send the analysis"' },
    contactLog: [
      { date: 'Mar 18, 2026', type: 'email', outcome: 'Replied',  note: 'Seminar follow-up email — immediate reply' },
      { date: 'Mar 20, 2026', type: 'call',  outcome: 'Reached',  note: 'CD maturity discussion — annuity proposal requested' },
      { date: 'Apr 2, 2026',  type: 'call',  outcome: 'Reached',  note: 'PMAIL completed — annuity confirmed as primary product' }
    ],`
);

// L006 Grace Lee — status: converted
src = src.replace(
  `    lifeEventTrigger: 'Career Promotion',
    lifeEventDetail: 'Promoted to Department Head Feb 2026; child starting college 2027',
    referralSource: 'Physician Financial Planning Event',
    referralType: 'event',
    productInterest: ['Whole Life', 'Estate Planning'],
    entryDate: 'Mar 10, 2026',
    status: 'converted',
    prospectId: 'P006',`,
  `    lifeEventTrigger: 'Career Promotion',
    lifeEventDetail: 'Promoted to Department Head Feb 2026; child starting college 2027',
    referralSource: 'Physician Financial Planning Event',
    referralType: 'event',
    productInterest: ['Whole Life', 'Estate Planning'],
    domainScores: { ins: 91, inv: 38, ret: 55 },
    entryDate: 'Mar 10, 2026',
    status: 'converted',
    prospectId: 'P006',
    campaignLink: { id: 'CAM005', name: 'HNWI Estate & Wealth Transfer', responded: true, responseDate: 'Mar 28, 2026', responseNote: 'Email reply — "Send me the estate analysis"' },
    contactLog: [
      { date: 'Mar 10, 2026', type: 'email', outcome: 'Sent',    note: 'Event follow-up email sent' },
      { date: 'Mar 15, 2026', type: 'call',  outcome: 'Left VM', note: 'Intro call — voicemail left' },
      { date: 'Mar 28, 2026', type: 'email', outcome: 'Replied', note: 'Replied requesting estate analysis — PMAIL started' }
    ],`
);

// L007 Rachel Adams — status: converted
src = src.replace(
  `    lifeEventTrigger: 'New Baby',
    lifeEventDetail: 'Baby born Mar 2026; RSU vesting $40K Q2 2026',
    referralSource: 'Life Event Alert — Public Birth Notice',
    referralType: 'life-event-alert',
    productInterest: ['Term Life', '529 Plan'],
    entryDate: 'Apr 2, 2026',
    status: 'converted',
    prospectId: 'P007',`,
  `    lifeEventTrigger: 'New Baby',
    lifeEventDetail: 'Baby born Mar 2026; RSU vesting $40K Q2 2026',
    referralSource: 'Life Event Alert — Public Birth Notice',
    referralType: 'life-event-alert',
    productInterest: ['Term Life', '529 Plan'],
    domainScores: { ins: 85, inv: 52, ret: 28 },
    entryDate: 'Apr 2, 2026',
    status: 'converted',
    prospectId: 'P007',
    campaignLink: { id: 'CAM001', name: 'New Parent Protection Drive', responded: true, responseDate: 'Apr 5, 2026', responseNote: 'Replied to email Day 3 — "Yes, let\'s talk"' },
    contactLog: [
      { date: 'Apr 2, 2026', type: 'email', outcome: 'Sent',    note: 'New parent campaign email delivered' },
      { date: 'Apr 5, 2026', type: 'email', outcome: 'Replied', note: 'Replied "Yes, let\'s talk" — meeting booked' }
    ],`
);

// L008 Thomas Wright — status: converted
src = src.replace(
  `    lifeEventTrigger: 'IPO / Wealth Event',
    lifeEventDetail: 'Company IPO — stock options $480K vesting 2026; child to college Sep 2026',
    referralSource: 'LinkedIn — HNWI Prospect Campaign',
    referralType: 'campaign-linkedin',
    productInterest: ['UL $1M+', 'Estate Planning', 'Income Annuity'],
    entryDate: 'Apr 5, 2026',
    status: 'converted',
    prospectId: 'P008',`,
  `    lifeEventTrigger: 'IPO / Wealth Event',
    lifeEventDetail: 'Company IPO — stock options $480K vesting 2026; child to college Sep 2026',
    referralSource: 'LinkedIn — HNWI Prospect Campaign',
    referralType: 'campaign-linkedin',
    productInterest: ['UL $1M+', 'Estate Planning', 'Income Annuity'],
    domainScores: { ins: 78, inv: 62, ret: 84 },
    entryDate: 'Apr 5, 2026',
    status: 'converted',
    prospectId: 'P008',
    campaignLink: { id: 'CAM005', name: 'HNWI Estate & Wealth Transfer', responded: true, responseDate: 'Apr 5, 2026', responseNote: 'LinkedIn reply Day 0 — "Good timing, let\'s connect"' },
    contactLog: [
      { date: 'Apr 5, 2026',  type: 'linkedin', outcome: 'Replied', note: 'LinkedIn InMail — immediate reply "Good timing"' },
      { date: 'Apr 8, 2026',  type: 'email',    outcome: 'Replied', note: 'Estate analysis email — confirmed UL + estate interest' },
      { date: 'Apr 10, 2026', type: 'call',     outcome: 'Reached', note: 'PMAIL completed — UL $1M+ + annuity confirmed' }
    ],`
);

// L009 Linda Chen — status: new → contacted (she has 0 attempts currently, keep new)
src = src.replace(
  `    lifeEventTrigger: 'Estate / Legal Event',
    lifeEventDetail: 'Established revocable trust Jun 2024; firm revenue +18% 2025',
    referralSource: 'Referral — Robert Chen (client)',
    referralType: 'client-referral',
    productInterest: ['Estate Planning', 'Whole Life $500K'],
    entryDate: 'Apr 8, 2026',
    status: 'new',
    prospectId: null,
    notes: 'Robert Chen referred his sister-in-law. Attorney, estate-focused. No prior contact.',
    contactAttempts: 0,
    lastContact: null`,
  `    lifeEventTrigger: 'Estate / Legal Event',
    lifeEventDetail: 'Established revocable trust Jun 2024; firm revenue +18% 2025',
    referralSource: 'Referral — Robert Chen (client)',
    referralType: 'client-referral',
    productInterest: ['Estate Planning', 'Whole Life $500K'],
    domainScores: { ins: 74, inv: 38, ret: 48 },
    entryDate: 'Apr 8, 2026',
    status: 'new',
    prospectId: null,
    campaignLink: null,
    contactLog: [],
    notes: 'Robert Chen referred his sister-in-law. Attorney, estate-focused. No prior contact.',
    contactAttempts: 0,
    lastContact: null`
);

// L010 Marcus Johnson — status: qualified → in-campaign
src = src.replace(
  `    lifeEventTrigger: 'Business Event',
    lifeEventDetail: 'New real estate LLC filed Jan 2026; revenue +35% YoY',
    referralSource: 'Inbound — NYL Website + LinkedIn Ad',
    referralType: 'inbound-digital',
    productInterest: ['Whole Life $750K', 'Mutual Funds'],
    entryDate: 'Apr 3, 2026',
    status: 'qualified',
    prospectId: null,
    notes: 'Self-referred via website form. Multiple LLCs. Business protection + wealth building.',
    contactAttempts: 2,
    lastContact: 'Apr 7, 2026'`,
  `    lifeEventTrigger: 'Business Event',
    lifeEventDetail: 'New real estate LLC filed Jan 2026; revenue +35% YoY',
    referralSource: 'Inbound — NYL Website + LinkedIn Ad',
    referralType: 'inbound-digital',
    productInterest: ['Whole Life $750K', 'Mutual Funds'],
    domainScores: { ins: 88, inv: 74, ret: 32 },
    entryDate: 'Apr 3, 2026',
    status: 'in-campaign',
    prospectId: null,
    campaignLink: { id: 'CAM002', name: 'Business Owner Shield Campaign', responded: false, responseDate: null, responseNote: null },
    contactLog: [
      { date: 'Apr 3, 2026', type: 'email',    outcome: 'Sent',    note: 'Inbound lead — auto-response sent' },
      { date: 'Apr 5, 2026', type: 'call',     outcome: 'Reached', note: 'Intro call — PMAIL completed, score 92/100' },
      { date: 'Apr 7, 2026', type: 'linkedin', outcome: 'Sent',    note: 'Added to Business Owner campaign — LinkedIn msg sent' }
    ],
    notes: 'Self-referred via website form. Multiple LLCs. Business protection + wealth building.',
    contactAttempts: 2,
    lastContact: 'Apr 7, 2026'`
);

// L011 Priya Patel — status: new → contacted
src = src.replace(
  `    lifeEventTrigger: 'Engagement / Marriage',
    lifeEventDetail: 'Engagement detected — ring purchase Mar 2026; student loans $88K',
    referralSource: 'ADA Partnership List',
    referralType: 'association-list',
    productInterest: ['Disability Insurance $12K/mo', 'SEP-IRA'],
    entryDate: 'Apr 6, 2026',
    status: 'new',
    prospectId: null,
    notes: 'ADA partnership lead. Newly engaged solo practitioner. DI gap critical for practice income.',
    contactAttempts: 0,
    lastContact: null`,
  `    lifeEventTrigger: 'Engagement / Marriage',
    lifeEventDetail: 'Engagement detected — ring purchase Mar 2026; student loans $88K',
    referralSource: 'ADA Partnership List',
    referralType: 'association-list',
    productInterest: ['Disability Insurance $12K/mo', 'SEP-IRA'],
    domainScores: { ins: 78, inv: 54, ret: 44 },
    entryDate: 'Apr 6, 2026',
    status: 'contacted',
    prospectId: null,
    campaignLink: null,
    contactLog: [
      { date: 'Apr 7, 2026', type: 'email', outcome: 'Opened', note: 'ADA intro email sent — opened, no reply yet' },
      { date: 'Apr 9, 2026', type: 'call',  outcome: 'Left VM', note: 'First call attempt — left voicemail about DI coverage for dentists' }
    ],
    notes: 'ADA partnership lead. Newly engaged solo practitioner. DI gap critical for practice income.',
    contactAttempts: 2,
    lastContact: 'Apr 9, 2026'`
);

// L012 Derek Walton — status: qualified → responded
src = src.replace(
  `    lifeEventTrigger: 'Retirement / LTC Event',
    lifeEventDetail: '401k approaching $600K; spouse diagnosed — LTC now critical; pension eliminated',
    referralSource: 'NYL Retirement Seminar',
    referralType: 'seminar',
    productInterest: ['Deferred Annuity', 'LTC Insurance'],
    entryDate: 'Mar 25, 2026',
    status: 'qualified',
    prospectId: null,
    notes: 'Seminar attendee. Spouse health event creates LTC urgency. Rollover opportunity.',
    contactAttempts: 3,
    lastContact: 'Apr 9, 2026'`,
  `    lifeEventTrigger: 'Retirement / LTC Event',
    lifeEventDetail: '401k approaching $600K; spouse diagnosed — LTC now critical; pension eliminated',
    referralSource: 'NYL Retirement Seminar',
    referralType: 'seminar',
    productInterest: ['Deferred Annuity', 'LTC Insurance'],
    domainScores: { ins: 48, inv: 38, ret: 92 },
    entryDate: 'Mar 25, 2026',
    status: 'responded',
    prospectId: null,
    campaignLink: { id: 'CAM003', name: 'Retirement Income Readiness', responded: true, responseDate: 'Mar 27, 2026', responseNote: 'Took phone call Day 2 — "I need to sort out my wife\'s LTC situation"' },
    contactLog: [
      { date: 'Mar 25, 2026', type: 'email', outcome: 'Opened',  note: 'Seminar follow-up email — opened same day' },
      { date: 'Mar 27, 2026', type: 'call',  outcome: 'Reached', note: 'Took call — LTC urgency confirmed, rollover interest' },
      { date: 'Apr 2, 2026',  type: 'email', outcome: 'Replied', note: 'Replied to annuity comparison email — ready to move forward' },
      { date: 'Apr 9, 2026',  type: 'call',  outcome: 'Reached', note: 'PMAIL 84/100 — qualified. Campaign response confirmed.' }
    ],
    notes: 'Seminar attendee. Spouse health event creates LTC urgency. Rollover opportunity.',
    contactAttempts: 3,
    lastContact: 'Apr 9, 2026'`
);

// L013 Sophia Reyes — qualified → in-campaign
src = src.replace(
  `    lifeEventTrigger: 'New Baby / Mortgage',
    lifeEventDetail: 'Child age 2 (college 2042); second pregnancy signal Apr 2026; $45K cash-out refi',
    referralSource: 'Facebook Ad — 529 College Savings Campaign',
    referralType: 'campaign-social',
    productInterest: ['529 College Plan', 'Term Life $600K'],
    entryDate: 'Apr 4, 2026',
    status: 'qualified',
    prospectId: null,
    notes: 'Responded to 529 Facebook ad. Growing family, needs protection + education funding.',
    contactAttempts: 2,
    lastContact: 'Apr 9, 2026'`,
  `    lifeEventTrigger: 'New Baby / Mortgage',
    lifeEventDetail: 'Child age 2 (college 2042); second pregnancy signal Apr 2026; $45K cash-out refi',
    referralSource: 'Facebook Ad — 529 College Savings Campaign',
    referralType: 'campaign-social',
    productInterest: ['529 College Plan', 'Term Life $600K'],
    domainScores: { ins: 84, inv: 66, ret: 28 },
    entryDate: 'Apr 4, 2026',
    status: 'in-campaign',
    prospectId: null,
    campaignLink: { id: 'CAM001', name: 'New Parent Protection Drive', responded: false, responseDate: null, responseNote: null },
    contactLog: [
      { date: 'Apr 4, 2026', type: 'email',  outcome: 'Opened',  note: 'Facebook ad click — filled form, campaign email sent' },
      { date: 'Apr 7, 2026', type: 'social', outcome: 'Clicked', note: 'Retargeted Facebook ad — clicked 529 calculator' },
      { date: 'Apr 9, 2026', type: 'call',   outcome: 'Left VM', note: 'PMAIL 88/100 — added to New Parent campaign' }
    ],
    notes: 'Responded to 529 Facebook ad. Growing family, needs protection + education funding.',
    contactAttempts: 2,
    lastContact: 'Apr 9, 2026'`
);

// L014 James Okafor — status: new
src = src.replace(
  `    lifeEventTrigger: 'Business / Property Event',
    lifeEventDetail: 'New LLC filed Apr 2026 (3rd company); $1.4M property purchase Mar 2026',
    referralSource: 'AI Public Records Scan — LLC Filing',
    referralType: 'ai-scan',
    productInterest: ['Whole Life $1M', 'Business Succession'],
    entryDate: 'Apr 9, 2026',
    status: 'new',
    prospectId: null,
    notes: 'AI-identified via LLC filing. $2.1M mortgage debt with no life coverage = critical gap.',
    contactAttempts: 0,
    lastContact: null`,
  `    lifeEventTrigger: 'Business / Property Event',
    lifeEventDetail: 'New LLC filed Apr 2026 (3rd company); $1.4M property purchase Mar 2026',
    referralSource: 'AI Public Records Scan — LLC Filing',
    referralType: 'ai-scan',
    productInterest: ['Whole Life $1M', 'Business Succession'],
    domainScores: { ins: 92, inv: 44, ret: 26 },
    entryDate: 'Apr 9, 2026',
    status: 'new',
    prospectId: null,
    campaignLink: null,
    contactLog: [],
    notes: 'AI-identified via LLC filing. $2.1M mortgage debt with no life coverage = critical gap.',
    contactAttempts: 0,
    lastContact: null`
);

console.log('✓ leadsData patched');

// ─────────────────────────────────────────────────────────────────────────────
// 2. REPLACE propensityProfiles — add ins/inv/ret + aiOpener
// ─────────────────────────────────────────────────────────────────────────────
const OLD_PROP = `var propensityProfiles = {
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
};`;

const NEW_PROP = `var propensityProfiles = {
  L001: { closedCasesLike: 47, topProducts: 'Whole Life + Disability', closePct: 82,
    ins: 88, inv: 42, ret: 18,
    aiOpener: 'Congratulations on your promotion, Alex! Robert Chen mentioned you\'re thinking about protecting your new income level — I ran the numbers and a Whole Life policy makes a lot of sense for where you are right now.',
    matchDesc: 'Matches 47 closed cases: Age 28–36, referral source, income $120K–$160K, recent promotion. 89% bought WL as primary; 61% added DI within 6 months.' },
  L002: { closedCasesLike: 38, topProducts: 'Term Life + LTC Rider', closePct: 61,
    ins: 82, inv: 18, ret: 34,
    aiOpener: 'Hi Nancy — congrats on the new home in Brooklyn! Most new homeowners overlook one thing: your $740K mortgage has no life coverage attached. A 20-year term policy would protect that investment for less than you might think.',
    matchDesc: 'Matches 38 closed cases: Female, 38–45, healthcare professional, new mortgage. 74% bought Term $750K–$1M; 45% added LTC rider.' },
  L003: { closedCasesLike: 29, topProducts: 'DI + Investment Account', closePct: 44,
    ins: 62, inv: 81, ret: 44,
    aiOpener: 'John — your ESPP is vesting $42K this quarter with no DI coverage protecting the income that generates it. Tech engineers at your income level are the most underinsured professionals in our book. Worth a 15-minute conversation?',
    matchDesc: 'Matches 29 closed cases: Tech engineer, 35–42, LinkedIn outreach, ESPP event. 66% bought DI first; 38% added investment account within 12 months.' },
  L004: { closedCasesLike: 22, topProducts: 'Key-Person UL + Buy-Sell', closePct: 91,
    ins: 96, inv: 28, ret: 22,
    aiOpener: 'Michael — Linda Morrison asked me to reach out. Your business grew 22% last year and you have 4 new employees. What happens to Santos Tech Solutions if something happens to you? Key-person life solves that in one conversation.',
    matchDesc: 'Matches 22 closed cases: Business owner, 44–52, referral, $500K+ income. 95% bought Key-Person Life; 82% added buy-sell funding within 90 days.' },
  L005: { closedCasesLike: 31, topProducts: 'Fixed Annuity + Income Rider', closePct: 58,
    ins: 38, inv: 45, ret: 91,
    aiOpener: 'Julia — your $180K CD matures in May and you\'re getting 4.8% right now. I can show you a fixed annuity that beats that rate AND provides guaranteed income for life. Let\'s talk before that CD renews automatically.',
    matchDesc: 'Matches 31 closed cases: Retired, 55–62, seminar attendee, pension income. 71% bought fixed annuity; 52% added income rider for guaranteed lifetime income.' },
  L006: { closedCasesLike: 18, topProducts: 'Whole Life $1M+ + Estate', closePct: 73,
    ins: 91, inv: 38, ret: 55,
    aiOpener: 'Dr. Lee — congratulations on becoming Department Head. At your income level, a Whole Life policy does double duty: it\'s the most tax-efficient way to build wealth AND it anchors your estate plan. Many of my physician clients start here.',
    matchDesc: 'Matches 18 closed cases: Physician, 40–48, event source, $350K+ income. 83% bought WL $1M+; 67% added estate planning engagement within 6 months.' },
  L007: { closedCasesLike: 52, topProducts: 'Term Life + 529 Plan', closePct: 55,
    ins: 85, inv: 52, ret: 28,
    aiOpener: 'Rachel — congratulations on your new baby! Your RSU vest is coming up in Q2 — that\'s actually the perfect time to lock in a Term Life policy and start a 529. Both take 20 minutes to set up and I can walk you through both on one call.',
    matchDesc: 'Matches 52 closed cases: New parent, 27–33, life event alert, dual income. 88% bought Term first; 61% added 529 at same meeting.' },
  L008: { closedCasesLike: 14, topProducts: 'UL $1M+ + Estate + Annuity', closePct: 84,
    ins: 78, inv: 62, ret: 84,
    aiOpener: 'Thomas — the IPO vesting creates a wealth transfer challenge most CFOs don\'t think about until it\'s too late. A Universal Life policy at your level does three things at once: protects the asset, reduces estate exposure, and provides a tax-free legacy.',
    matchDesc: 'Matches 14 closed cases: C-suite, 50–55, LinkedIn campaign, $700K+ income. 93% bought UL $1M+; 79% added estate strategy; avg premium $22K/yr.' },
  L009: { closedCasesLike: 24, topProducts: 'Estate Planning + WL', closePct: 67,
    ins: 74, inv: 38, ret: 48,
    aiOpener: 'Linda — Robert Chen speaks very highly of you. As an attorney who established a trust last year, you know better than most how important it is to have the right coverage behind it. I\'d love to run a quick analysis — 20 minutes, no obligation.',
    matchDesc: 'Matches 24 closed cases: Attorney partner, 42–48, client referral, $280K+ income. 75% bought WL + estate; 58% started with trust review conversation.' },
  L010: { closedCasesLike: 19, topProducts: 'WL + Mutual Funds', closePct: 88,
    ins: 88, inv: 74, ret: 32,
    aiOpener: 'Marcus — you built two LLCs and just filed a third. At $400K+ income, your biggest financial risk right now is something happening to you with no key-person coverage and no tax-sheltered wealth strategy. Whole Life solves both.',
    matchDesc: 'Matches 19 closed cases: Digital entrepreneur, 36–42, inbound lead, multi-LLC. 84% bought WL as business asset; 63% added mutual funds within 12 months.' },
  L011: { closedCasesLike: 33, topProducts: 'DI $12K/mo + SEP-IRA', closePct: 51,
    ins: 78, inv: 54, ret: 44,
    aiOpener: 'Priya — congratulations on your engagement! As a solo dentist, your practice income stops the day you can\'t work. Disability Insurance at $12K/month is the single most important policy you\'ll ever own. Let\'s make sure you\'re protected before the wedding.',
    matchDesc: 'Matches 33 closed cases: Solo practitioner, 30–38, association list, newly engaged. 79% bought DI as priority; 54% added SEP-IRA for retirement.' },
  L012: { closedCasesLike: 27, topProducts: 'LTC Insurance + Deferred Annuity', closePct: 63,
    ins: 48, inv: 38, ret: 92,
    aiOpener: 'Derek — I heard about your wife\'s diagnosis and I\'m sorry. LTC coverage is exactly what you need right now, and your 401k rollover timing is actually perfect for a deferred annuity that creates guaranteed income regardless of what happens. Let\'s talk this week.',
    matchDesc: 'Matches 27 closed cases: Finance professional, 52–58, seminar, spouse health event. 81% bought LTC first; 67% rolled 401k into deferred annuity.' },
  L013: { closedCasesLike: 44, topProducts: 'Term Life $600K + 529 Plan', closePct: 80,
    ins: 84, inv: 66, ret: 28,
    aiOpener: 'Sophia — with a toddler, a second on the way, and a cash-out refi, this is exactly the moment to lock in Term Life and start that 529. The 529 calculator you clicked shows college costs $340K in 2042 — let\'s close that gap now.',
    matchDesc: 'Matches 44 closed cases: Young family, 33–39, social ad response, dual income. 86% bought Term; 72% added 529 at delivery meeting.' },
  L014: { closedCasesLike: 16, topProducts: 'WL $1M + Business Succession', closePct: 48,
    ins: 92, inv: 44, ret: 26,
    aiOpener: 'James — your AI identified your LLC filing and $1.4M property purchase. With $2.1M in mortgage debt across your portfolio and no life coverage, you have a significant gap. A Whole Life policy at your asset level is both protection and a business asset.',
    matchDesc: 'Matches 16 closed cases: Real estate developer, 45–52, AI-identified, LLC portfolio. 75% bought WL $1M+; 62% needed business succession planning.' }
};`;

if (!src.includes(OLD_PROP)) { console.error('ANCHOR propensityProfiles not found'); process.exit(1); }
src = src.replace(OLD_PROP, NEW_PROP);
console.log('✓ propensityProfiles patched');

// ─────────────────────────────────────────────────────────────────────────────
// 3. REPLACE renderLeadStats (add contacted/in-campaign/responded counts)
// ─────────────────────────────────────────────────────────────────────────────
const OLD_STATS = `function renderLeadStats() {
  var total    = leadsData.length;
  var newLeads = leadsData.filter(function(l){ return l.status==='new'; }).length;
  var qual     = leadsData.filter(function(l){ return l.status==='qualified'; }).length;
  var conv     = leadsData.filter(function(l){ return l.status==='converted'; }).length;

  var s = document.getElementById('lead-stat-total');    if(s) s.textContent = total;
  var n = document.getElementById('lead-stat-new');      if(n) n.textContent = newLeads;
  var q = document.getElementById('lead-stat-qualified');if(q) q.textContent = qual;
  var c = document.getElementById('lead-stat-converted');if(c) c.textContent = conv;
}`;

const NEW_STATS = `function renderLeadStats() {
  var total      = leadsData.length;
  var newLeads   = leadsData.filter(function(l){ return l.status==='new'; }).length;
  var contacted  = leadsData.filter(function(l){ return l.status==='contacted'; }).length;
  var qual       = leadsData.filter(function(l){ return l.status==='qualified'; }).length;
  var inCamp     = leadsData.filter(function(l){ return l.status==='in-campaign'; }).length;
  var responded  = leadsData.filter(function(l){ return l.status==='responded'; }).length;
  var conv       = leadsData.filter(function(l){ return l.status==='converted'; }).length;

  function _set(id, val) { var el = document.getElementById(id); if(el) el.textContent = val; }
  _set('lead-stat-total',     total);
  _set('lead-stat-new',       newLeads);
  _set('lead-stat-contacted', contacted);
  _set('lead-stat-qualified', qual);
  _set('lead-stat-incampaign',inCamp);
  _set('lead-stat-responded', responded);
  _set('lead-stat-converted', conv);

  // update filter tab counts
  _set('leads-count-all',         total);
  _set('leads-count-new',         newLeads);
  _set('leads-count-contacted',   contacted);
  _set('leads-count-qualified',   qual);
  _set('leads-count-incampaign',  inCamp);
  _set('leads-count-responded',   responded);
  _set('leads-count-converted',   conv);
}`;

if (!src.includes(OLD_STATS)) { console.error('ANCHOR renderLeadStats not found'); process.exit(1); }
src = src.replace(OLD_STATS, NEW_STATS);
console.log('✓ renderLeadStats patched');

// ─────────────────────────────────────────────────────────────────────────────
// 4. REPLACE filterLeadsByStatus (support all 6 stages)
// ─────────────────────────────────────────────────────────────────────────────
const OLD_FILTER = `function filterLeadsByStatus(status) {
  _leadsCurrentFilter = status;
  document.querySelectorAll('.leads-filter-tab').forEach(function(t){
    t.classList.toggle('active', t.dataset.filter === status);
  });
  renderLeadsList();
}`;

const NEW_FILTER = `function filterLeadsByStatus(status) {
  _leadsCurrentFilter = status;
  document.querySelectorAll('.leads-filter-tab').forEach(function(t){
    t.classList.toggle('active', t.dataset.filter === status);
  });
  renderLeadsList();
}

// Status metadata helper — single source of truth
function _leadStatusMeta(status) {
  return {
    'new':         { label: 'New Lead',    cls: 'lead-status-new',         color: '#64748b' },
    'contacted':   { label: 'Contacted',   cls: 'lead-status-contacted',   color: '#0891b2' },
    'qualified':   { label: 'Qualified',   cls: 'lead-status-qualified',   color: '#d97706' },
    'in-campaign': { label: 'In Campaign', cls: 'lead-status-incampaign',  color: '#7c3aed' },
    'responded':   { label: 'Responded',   cls: 'lead-status-responded',   color: '#059669' },
    'converted':   { label: 'Converted',   cls: 'lead-status-converted',   color: '#003087' }
  }[status] || { label: status, cls: 'lead-status-new', color: '#64748b' };
}`;

if (!src.includes(OLD_FILTER)) { console.error('ANCHOR filterLeadsByStatus not found'); process.exit(1); }
src = src.replace(OLD_FILTER, NEW_FILTER);
console.log('✓ filterLeadsByStatus + _leadStatusMeta patched');

// ─────────────────────────────────────────────────────────────────────────────
// 5. REPLACE renderLeadsList
// ─────────────────────────────────────────────────────────────────────────────
const OLD_RENDER_LIST = `function renderLeadsList() {
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
}`;

const NEW_RENDER_LIST = `function renderLeadsList() {
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
    var pp  = propensityProfiles[lead.id];
    var pm  = pmailScores[lead.id];
    var sm  = _leadStatusMeta(lead.status);
    var scoreColor = pp.closePct >= 80 ? '#059669' : pp.closePct >= 60 ? '#d97706' : '#dc2626';
    var sourceIcon = {
      'client-referral':'fa-users', 'linkedin':'fa-linkedin', 'seminar':'fa-chalkboard-teacher',
      'public-record':'fa-file-alt', 'life-event-alert':'fa-bell', 'event':'fa-calendar-alt',
      'campaign-linkedin':'fa-bullhorn', 'campaign-social':'fa-hashtag',
      'inbound-digital':'fa-globe', 'association-list':'fa-id-card', 'ai-scan':'fa-robot'
    }[lead.referralType] || 'fa-user';

    // Domain mini-bars
    var domBars = '';
    if (lead.domainScores) {
      var ds = lead.domainScores;
      var domLabel = ds.ins >= ds.inv && ds.ins >= ds.ret ? 'Insurance-first'
                   : ds.ret >= ds.inv ? 'Retirement-first' : 'Investment-first';
      domBars = '<div class="lead-domain-bars">' +
        '<div class="lead-domain-bar-row"><span class="ldb-lbl">INS</span><div class="ldb-track"><div class="ldb-fill ldb-ins" style="width:' + ds.ins + '%"></div></div><span class="ldb-pct">' + ds.ins + '%</span></div>' +
        '<div class="lead-domain-bar-row"><span class="ldb-lbl">INV</span><div class="ldb-track"><div class="ldb-fill ldb-inv" style="width:' + ds.inv + '%"></div></div><span class="ldb-pct">' + ds.inv + '%</span></div>' +
        '<div class="lead-domain-bar-row"><span class="ldb-lbl">RET</span><div class="ldb-track"><div class="ldb-fill ldb-ret" style="width:' + ds.ret + '%"></div></div><span class="ldb-pct">' + ds.ret + '%</span></div>' +
        '<span class="ldb-strategy">' + domLabel + '</span>' +
      '</div>';
    }

    // PMAIL dots (only if scored)
    var pmailHtml = '';
    if (pm && (lead.status === 'qualified' || lead.status === 'in-campaign' || lead.status === 'responded' || lead.status === 'converted')) {
      pmailHtml = '<div class="lead-pmail-row">' +
        ['P','M','A','I','L'].map(function(letter, i) {
          var sc = [pm.P, pm.M, pm.A, pm.I, pm.L][i];
          var cls = sc >= 5 ? 'pmail-dot-full' : sc >= 3 ? 'pmail-dot-partial' : 'pmail-dot-low';
          return '<span class="pmail-dot ' + cls + '" title="' + letter + ': ' + sc + '/5">' + letter + '</span>';
        }).join('') +
        '<span class="pmail-total" style="color:#059669">✓ ' + pm.total + '/100</span>' +
      '</div>';
    }

    // Campaign tag
    var campTag = '';
    if (lead.campaignLink) {
      var campColor = lead.campaignLink.responded ? '#059669' : '#7c3aed';
      var campIcon  = lead.campaignLink.responded ? 'fa-reply' : 'fa-bullhorn';
      campTag = '<div class="lead-camp-tag" style="color:' + campColor + '"><i class="fas ' + campIcon + '"></i> ' +
        lead.campaignLink.name.substring(0,32) + (lead.campaignLink.responded ? ' · Responded' : ' · Active') + '</div>';
    }

    // CTA button per lifecycle stage
    var actionBtn = _leadListCTA(lead);

    return '<div class="lead-card" id="lead-' + lead.id + '" onclick="selectLead(\'' + lead.id + '\')">' +
      '<div class="lead-card-top">' +
        '<div class="lead-avatar" style="background:' + lead.avatarColor + '">' + lead.initials + '</div>' +
        '<div class="lead-card-info">' +
          '<div class="lead-card-name">' + lead.name + '</div>' +
          '<div class="lead-card-occ">' + lead.occupation + '</div>' +
          '<div class="lead-card-city"><i class="fas fa-map-marker-alt"></i> ' + lead.city + '</div>' +
        '</div>' +
        '<div class="lead-card-right">' +
          '<span class="lead-status-pill ' + sm.cls + '">' + sm.label + '</span>' +
          '<div class="lead-score-badge" style="background:' + scoreColor + '">' +
            '<span class="lead-score-num">' + pp.closePct + '%</span>' +
            '<span class="lead-score-lbl">Close</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="lead-event-strip">' +
        '<i class="fas fa-bolt lead-event-icon"></i>' +
        '<span class="lead-event-text">' + lead.lifeEventTrigger + ' — ' + lead.lifeEventDetail.substring(0,58) + (lead.lifeEventDetail.length>58?'…':'') + '</span>' +
      '</div>' +
      domBars +
      campTag +
      pmailHtml +
      '<div class="lead-card-footer">' +
        '<span class="lead-foot-date"><i class="fas fa-calendar"></i> ' + lead.entryDate + '</span>' +
        actionBtn +
      '</div>' +
    '</div>';
  }).join('');
}

function _leadListCTA(lead) {
  switch(lead.status) {
    case 'new':
      return '<button class="lead-action-btn lead-action-qualify" onclick="event.stopPropagation();openPMAILModal(\'' + lead.id + '\')"><i class="fas fa-clipboard-check"></i> Run PMAIL</button>';
    case 'contacted':
      return '<button class="lead-action-btn lead-action-qualify" onclick="event.stopPropagation();openPMAILModal(\'' + lead.id + '\')"><i class="fas fa-clipboard-check"></i> Run PMAIL</button>';
    case 'qualified':
      return '<button class="lead-action-btn lead-action-convert" onclick="event.stopPropagation();openAddToCampaignModal(\'' + lead.id + '\')"><i class="fas fa-bullhorn"></i> Add to Campaign</button>';
    case 'in-campaign':
      return '<button class="lead-action-btn lead-action-incampaign" onclick="event.stopPropagation();selectLead(\'' + lead.id + '\')"><i class="fas fa-satellite-dish"></i> Campaign Active</button>';
    case 'responded':
      return '<button class="lead-action-btn lead-action-respond" onclick="event.stopPropagation();openConvertToProspect(\'' + lead.id + '\')"><i class="fas fa-user-plus"></i> Convert to Prospect</button>';
    case 'converted':
      return '<button class="lead-action-btn lead-action-view" onclick="event.stopPropagation();openLeadHistory(\'' + lead.id + '\')"><i class="fas fa-history"></i> View Lead History</button>';
    default:
      return '';
  }
}`;

if (!src.includes(OLD_RENDER_LIST)) { console.error('ANCHOR renderLeadsList not found'); process.exit(1); }
src = src.replace(OLD_RENDER_LIST, NEW_RENDER_LIST);
console.log('✓ renderLeadsList + _leadListCTA patched');

// ─────────────────────────────────────────────────────────────────────────────
// 6. REPLACE renderLeadDetail (full rewrite with 3-domain bar, AI opener, contact log, correct CTAs)
// ─────────────────────────────────────────────────────────────────────────────
const OLD_DETAIL = `function renderLeadDetail(id) {
  var panel = document.getElementById('lead-detail-panel');
  if (!panel) return;
  // Always ensure panel is visible and empty state is hidden
  var emptyState = document.getElementById('lead-detail-empty');
  if (emptyState) emptyState.style.display = 'none';
  panel.style.display = 'block';
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
}`;

const NEW_DETAIL = `function renderLeadDetail(id) {
  var panel = document.getElementById('lead-detail-panel');
  if (!panel) return;
  var emptyState = document.getElementById('lead-detail-empty');
  if (emptyState) emptyState.style.display = 'none';
  panel.style.display = 'block';
  var lead = leadsData.find(function(l){ return l.id === id; });
  if (!lead) return;
  var pp = propensityProfiles[id];
  var pm = pmailScores[id];
  var sm = _leadStatusMeta(lead.status);
  var scoreColor = pp.closePct >= 80 ? '#059669' : pp.closePct >= 60 ? '#d97706' : '#dc2626';

  // ── AI Opener box ──
  var openerHtml = pp.aiOpener
    ? '<div class="ld-opener-box"><div class="ld-opener-label"><i class="fas fa-robot"></i> AI Recommended Opening</div>' +
      '<div class="ld-opener-text">"' + pp.aiOpener + '"</div>' +
      '<button class="ld-opener-copy" onclick="navigator.clipboard&&navigator.clipboard.writeText(\'' + pp.aiOpener.replace(/'/g,"\\'") + '\');showToast(\'Opening copied to clipboard\',\'success\')"><i class="fas fa-copy"></i> Copy</button></div>'
    : '';

  // ── 3-Domain propensity bar ──
  var domHtml = '';
  if (pp.ins !== undefined) {
    var domLabel  = pp.ins >= pp.inv && pp.ins >= pp.ret ? 'Insurance-led opportunity'
                  : pp.ret >= pp.inv ? 'Retirement-led opportunity' : 'Investment-led opportunity';
    var domStrategy = pp.ins >= pp.inv && pp.ins >= pp.ret
      ? 'Lead with insurance conversation — cross-sell investments/retirement as part of holistic plan.'
      : pp.ret >= pp.inv
      ? 'Lead with retirement income conversation — insurance products as protection layer.'
      : 'Lead with investment/wealth conversation — insurance as income protection complement.';
    domHtml = '<div class="ld-section">' +
      '<div class="ld-section-title"><i class="fas fa-layer-group"></i> AI Propensity by Domain</div>' +
      '<div class="ld-domain-grid">' +
        _domainBarBlock('Insurance',   pp.ins, '#003087', 'fa-shield-alt') +
        _domainBarBlock('Investments', pp.inv, '#0891b2', 'fa-chart-line') +
        _domainBarBlock('Retirement',  pp.ret, '#7c3aed', 'fa-umbrella-beach') +
      '</div>' +
      '<div class="ld-domain-strategy"><i class="fas fa-lightbulb"></i> <strong>' + domLabel + '</strong> — ' + domStrategy + '</div>' +
    '</div>';
  }

  // ── PMAIL detail (only once scored) ──
  var pmailDetailHtml = '';
  var hasPmail = pm && (lead.status === 'qualified' || lead.status === 'in-campaign' || lead.status === 'responded' || lead.status === 'converted');
  if (hasPmail) {
    var pmItems = [
      { letter:'P', label:'Product Fit',         score:pm.P },
      { letter:'M', label:'Money / Budget',       score:pm.M },
      { letter:'A', label:'Authority',            score:pm.A },
      { letter:'I', label:'Insurability',         score:pm.I },
      { letter:'L', label:'Life Event / Urgency', score:pm.L }
    ];
    var pmColors = ['#003087','#059669','#7c3aed','#d97706','#dc2626'];
    pmailDetailHtml = '<div class="ld-section">' +
      '<div class="ld-section-title"><i class="fas fa-clipboard-check"></i> PMAIL Score — ' + pm.total + '/100' +
        '<span class="ld-pmail-qual-badge" style="background:' + (pm.total>=72?'#059669':'#d97706') + '">' + (pm.total>=80?'Strong Qualify':pm.total>=72?'Qualified':'Conditional') + '</span>' +
      '</div>' +
      '<div class="ld-pmail-compact">' +
      pmItems.map(function(item, idx) {
        var pct = (item.score/5)*100;
        var col = pmColors[idx];
        return '<div class="ld-pmail-compact-row">' +
          '<div class="ld-pmail-letter" style="background:' + col + '">' + item.letter + '</div>' +
          '<div class="ld-pmail-compact-label">' + item.label + '</div>' +
          '<div class="ld-pmail-compact-bar"><div class="ld-pmail-fill" style="width:' + pct + '%;background:' + col + '"></div></div>' +
          '<div class="ld-pmail-compact-score">' + item.score + '/5</div>' +
        '</div>';
      }).join('') +
      '</div>' +
      '<div class="ld-pmail-notes"><i class="fas fa-robot"></i> ' + pm.qualNotes + '</div>' +
    '</div>';
  }

  // ── Campaign section ──
  var campHtml = '';
  if (lead.campaignLink) {
    var cl = lead.campaignLink;
    campHtml = '<div class="ld-section">' +
      '<div class="ld-section-title"><i class="fas fa-bullhorn"></i> Campaign</div>' +
      '<div class="ld-camp-box">' +
        '<div class="ld-camp-name">' + cl.name + '</div>' +
        '<div class="ld-camp-status ' + (cl.responded ? 'ld-camp-responded' : 'ld-camp-active') + '">' +
          (cl.responded ? '<i class="fas fa-reply"></i> Responded — ' + cl.responseDate : '<i class="fas fa-satellite-dish"></i> Active — awaiting response') +
        '</div>' +
        (cl.responseNote ? '<div class="ld-camp-note">"' + cl.responseNote + '"</div>' : '') +
      '</div>' +
    '</div>';
  }

  // ── Contact log ──
  var logHtml = '';
  if (lead.contactLog && lead.contactLog.length > 0) {
    var typeIcon = { call:'fa-phone', email:'fa-envelope', linkedin:'fa-linkedin', text:'fa-sms', social:'fa-hashtag' };
    var outcomeColor = { Reached:'#059669', Replied:'#059669', Opened:'#0891b2', Sent:'#64748b', 'Left VM':'#d97706', Delivered:'#64748b', Clicked:'#0891b2' };
    logHtml = '<div class="ld-section">' +
      '<div class="ld-section-title"><i class="fas fa-history"></i> Contact Log (' + lead.contactLog.length + ')</div>' +
      '<div class="ld-contact-log">' +
      lead.contactLog.slice().reverse().map(function(entry) {
        var ic = typeIcon[entry.type] || 'fa-circle';
        var oc = outcomeColor[entry.outcome] || '#64748b';
        return '<div class="ld-log-row">' +
          '<div class="ld-log-icon" style="background:' + oc + '15;color:' + oc + '"><i class="fas ' + ic + '"></i></div>' +
          '<div class="ld-log-body">' +
            '<div class="ld-log-top"><span class="ld-log-date">' + entry.date + '</span><span class="ld-log-outcome" style="color:' + oc + '">' + entry.outcome + '</span></div>' +
            '<div class="ld-log-note">' + entry.note + '</div>' +
          '</div>' +
        '</div>';
      }).join('') +
    '</div></div>';
  }

  // ── Action buttons per lifecycle stage ──
  var actionsHtml = _leadDetailActions(lead);

  panel.innerHTML = '<div class="lead-detail-content">' +
    // Header
    '<div class="ld-header">' +
      '<div class="ld-avatar" style="background:' + lead.avatarColor + '">' + lead.initials + '</div>' +
      '<div class="ld-header-info">' +
        '<div class="ld-name">' + lead.name + '</div>' +
        '<div class="ld-occ">' + lead.occupation + '</div>' +
        '<div class="ld-location"><i class="fas fa-map-marker-alt"></i> ' + lead.city + '</div>' +
        '<span class="ld-status-badge ' + sm.cls + '">' + sm.label + '</span>' +
      '</div>' +
      '<div class="ld-score-circle" style="border-color:' + scoreColor + ';color:' + scoreColor + '">' +
        '<span class="ld-score-num">' + pp.closePct + '%</span>' +
        '<span class="ld-score-lbl">Close Prob.</span>' +
      '</div>' +
    '</div>' +
    // Contact row
    '<div class="ld-contact-row">' +
      '<a href="mailto:' + lead.email + '" class="ld-contact-btn"><i class="fas fa-envelope"></i>' + lead.email + '</a>' +
      '<a href="tel:' + lead.phone + '" class="ld-contact-btn"><i class="fas fa-phone"></i>' + lead.phone + '</a>' +
    '</div>' +
    // Life event
    '<div class="ld-section">' +
      '<div class="ld-section-title"><i class="fas fa-bolt"></i> Life Event Trigger</div>' +
      '<div class="ld-life-event-box">' +
        '<div class="ld-life-event-trigger">' + lead.lifeEventTrigger + '</div>' +
        '<div class="ld-life-event-detail">' + lead.lifeEventDetail + '</div>' +
      '</div>' +
    '</div>' +
    // AI opener
    openerHtml +
    // Domain propensity
    domHtml +
    // Propensity stats + match
    '<div class="ld-section">' +
      '<div class="ld-section-title"><i class="fas fa-brain"></i> AI Propensity — Case Match</div>' +
      '<div class="ld-propensity-box">' +
        '<div class="ld-prop-stat"><span class="ld-prop-num">' + pp.closedCasesLike + '</span><span class="ld-prop-lbl">Closed Case Matches</span></div>' +
        '<div class="ld-prop-stat"><span class="ld-prop-num" style="color:' + scoreColor + '">' + pp.closePct + '%</span><span class="ld-prop-lbl">Close Probability</span></div>' +
        '<div class="ld-prop-stat"><span class="ld-prop-num">' + pp.topProducts + '</span><span class="ld-prop-lbl">Top Product Match</span></div>' +
        '<div class="ld-prop-insight">' + pp.matchDesc + '</div>' +
      '</div>' +
    '</div>' +
    // Lead profile grid
    '<div class="ld-section">' +
      '<div class="ld-section-title"><i class="fas fa-user"></i> Lead Profile</div>' +
      '<div class="ld-grid">' +
        '<div class="ld-field"><div class="ld-field-label">Age</div><div class="ld-field-val">' + lead.age + '</div></div>' +
        '<div class="ld-field"><div class="ld-field-label">Est. Income</div><div class="ld-field-val">' + lead.estimatedIncome + '</div></div>' +
        '<div class="ld-field"><div class="ld-field-label">Source</div><div class="ld-field-val">' + lead.referralSource + '</div></div>' +
        '<div class="ld-field"><div class="ld-field-label">Entry Date</div><div class="ld-field-val">' + lead.entryDate + '</div></div>' +
        '<div class="ld-field"><div class="ld-field-label">Contacts</div><div class="ld-field-val">' + lead.contactAttempts + (lead.lastContact ? ' · Last: ' + lead.lastContact : ' · None yet') + '</div></div>' +
        '<div class="ld-field"><div class="ld-field-label">Product Interest</div><div class="ld-field-val">' + lead.productInterest.join(', ') + '</div></div>' +
      '</div>' +
    '</div>' +
    // PMAIL (if scored)
    pmailDetailHtml +
    // Campaign linkage
    campHtml +
    // Contact log
    logHtml +
    // Notes
    (lead.notes ? '<div class="ld-section"><div class="ld-section-title"><i class="fas fa-sticky-note"></i> Agent Notes</div><div class="ld-notes">' + lead.notes + '</div></div>' : '') +
    // Actions
    actionsHtml +
  '</div>';
}

function _domainBarBlock(label, pct, color, icon) {
  return '<div class="ld-domain-block">' +
    '<div class="ld-domain-block-header"><i class="fas ' + icon + '" style="color:' + color + '"></i> ' + label + '</div>' +
    '<div class="ld-domain-track"><div class="ld-domain-fill" style="width:' + pct + '%;background:' + color + '"></div></div>' +
    '<div class="ld-domain-pct" style="color:' + color + '">' + pct + '%</div>' +
  '</div>';
}

function _leadDetailActions(lead) {
  var primary = '';
  switch(lead.status) {
    case 'new':
      primary = '<button class="ld-act-btn ld-act-primary" onclick="openPMAILModal(\'' + lead.id + '\')"><i class="fas fa-clipboard-check"></i> Run PMAIL Qualification</button>';
      break;
    case 'contacted':
      primary = '<button class="ld-act-btn ld-act-primary" onclick="openPMAILModal(\'' + lead.id + '\')"><i class="fas fa-clipboard-check"></i> Run PMAIL Qualification</button>';
      break;
    case 'qualified':
      primary = '<button class="ld-act-btn ld-act-green" onclick="openAddToCampaignModal(\'' + lead.id + '\')"><i class="fas fa-bullhorn"></i> Add to Campaign</button>';
      break;
    case 'in-campaign':
      primary = '<button class="ld-act-btn ld-act-purple" onclick="showToast(\'Campaign manager coming soon\',\'info\')"><i class="fas fa-satellite-dish"></i> Manage Campaign</button>';
      break;
    case 'responded':
      primary = '<button class="ld-act-btn ld-act-green" onclick="openConvertToProspect(\'' + lead.id + '\')"><i class="fas fa-user-plus"></i> Convert to Prospect</button>';
      break;
    case 'converted':
      primary = '<button class="ld-act-btn ld-act-primary" onclick="openLeadHistory(\'' + lead.id + '\')"><i class="fas fa-history"></i> View Lead History</button>';
      break;
  }
  return '<div class="ld-actions">' +
    primary +
    '<button class="ld-act-btn ld-act-secondary" onclick="openOutreachModal(\'' + lead.id + '\')"><i class="fas fa-paper-plane"></i> Send Outreach</button>' +
    '<button class="ld-act-btn ld-act-secondary" onclick="openScheduleCallModal(\'' + lead.id + '\')"><i class="fas fa-calendar-plus"></i> Schedule Call</button>' +
  '</div>';
}`;

if (!src.includes(OLD_DETAIL)) { console.error('ANCHOR renderLeadDetail not found'); process.exit(1); }
src = src.replace(OLD_DETAIL, NEW_DETAIL);
console.log('✓ renderLeadDetail + helpers patched');

// ─────────────────────────────────────────────────────────────────────────────
// 7. FIX PMAIL result CTA — "Add to Campaign" instead of "Qualify & Create Prospect"
// ─────────────────────────────────────────────────────────────────────────────
const OLD_PMAIL_CTA = `      (qualified ?
        '<button class="pmail-btn-next pmail-btn-qualify" onclick="savePMAILAndQualify(' + P + ',' + M + ',' + A + ',' + I + ',' + L + ',' + total + ')"><i class="fas fa-user-plus"></i> Qualify & Create Prospect</button>' :
        '<button class="pmail-btn-next pmail-btn-nurture" onclick="savePMAILNurture(' + total + ')"><i class="fas fa-inbox"></i> Save & Nurture</button>');`;

const NEW_PMAIL_CTA = `      (qualified ?
        '<button class="pmail-btn-next pmail-btn-qualify" onclick="savePMAILAndQualify(' + P + ',' + M + ',' + A + ',' + I + ',' + L + ',' + total + ')"><i class="fas fa-check-circle"></i> Qualify — Add to Campaign</button>' :
        '<button class="pmail-btn-next pmail-btn-nurture" onclick="savePMAILNurture(' + total + ')"><i class="fas fa-inbox"></i> Save & Nurture</button>');`;

if (!src.includes(OLD_PMAIL_CTA)) { console.error('ANCHOR PMAIL CTA not found'); process.exit(1); }
src = src.replace(OLD_PMAIL_CTA, NEW_PMAIL_CTA);
console.log('✓ PMAIL CTA patched');

// ─────────────────────────────────────────────────────────────────────────────
// 8. FIX savePMAILAndQualify toast message
// ─────────────────────────────────────────────────────────────────────────────
const OLD_PMAIL_TOAST = `  closePMAILModal();
  showToast('✓ ' + lead.name + ' qualified (PMAIL ' + total + '/100) — ready to create Prospect', 'success');`;

const NEW_PMAIL_TOAST = `  closePMAILModal();
  showToast('✓ ' + lead.name + ' qualified (PMAIL ' + total + '/100) — ready to add to Campaign', 'success');`;

if (!src.includes(OLD_PMAIL_TOAST)) { console.error('ANCHOR PMAIL toast not found'); process.exit(1); }
src = src.replace(OLD_PMAIL_TOAST, NEW_PMAIL_TOAST);
console.log('✓ PMAIL toast patched');

// ─────────────────────────────────────────────────────────────────────────────
// 9. FIX openConvertToProspect title + "What happens next" flow
// ─────────────────────────────────────────────────────────────────────────────
const OLD_CONV_TITLE = `      '<div class="convert-modal-title"><i class="fas fa-user-plus"></i> Create Prospect from Lead</div>'`;
const NEW_CONV_TITLE = `      '<div class="convert-modal-title"><i class="fas fa-user-plus"></i> Convert to Prospect — Campaign Response Confirmed</div>'`;

if (!src.includes(OLD_CONV_TITLE)) { console.error('ANCHOR convert title not found'); process.exit(1); }
src = src.replace(OLD_CONV_TITLE, NEW_CONV_TITLE);

const OLD_NEXT_STEPS = `        '<div class="convert-next-step"><span class="convert-next-num">3</span> Lead marked as converted — linked to new Prospect record</div>' +
        '<div class="convert-next-step"><span class="convert-next-num">4</span> You can then schedule discovery meeting → FNA Discovery</div>'`;
const NEW_NEXT_STEPS = `        '<div class="convert-next-step"><span class="convert-next-num">3</span> Lead marked as converted — full history preserved and linked to Prospect</div>' +
        '<div class="convert-next-step"><span class="convert-next-num">4</span> Schedule discovery meeting → FNA Discovery to begin the sales process</div>'`;

if (!src.includes(OLD_NEXT_STEPS)) { console.error('ANCHOR next steps not found'); process.exit(1); }
src = src.replace(OLD_NEXT_STEPS, NEW_NEXT_STEPS);
console.log('✓ Convert modal patched');

// ─────────────────────────────────────────────────────────────────────────────
// 10. APPEND new modal functions + lead history
// ─────────────────────────────────────────────────────────────────────────────
const OLD_VIEW_LINKED = `function viewLinkedProspect(prospectId) {
  if (!prospectId) return;
  navigateTo('prospects');
  setTimeout(function() {
    if (typeof openProspectModal === 'function') openProspectModal(prospectId);
  }, 300);
}`;

const NEW_VIEW_LINKED = `function viewLinkedProspect(prospectId) {
  if (!prospectId) return;
  navigateTo('prospects');
  setTimeout(function() {
    if (typeof openProspectModal === 'function') openProspectModal(prospectId);
  }, 300);
}

// ── SCHEDULE CALL MODAL ────────────────────────────────────────
var _schedCallLeadId = null;

function openScheduleCallModal(leadId) {
  _schedCallLeadId = leadId;
  var lead = leadsData.find(function(l){ return l.id === leadId; });
  var pp   = propensityProfiles[leadId];
  if (!lead) return;

  // Generate 3 AI-suggested slots (based on today + patterns)
  var today = new Date(2026, 3, 11); // Apr 11 2026 (sandbox date)
  var slots = [];
  var slotDays = [1, 2, 4]; // tomorrow, day after, skip weekend
  var slotTimes = ['9:00 AM', '11:00 AM', '2:00 PM'];
  var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  slotDays.forEach(function(d, i) {
    var dt = new Date(today); dt.setDate(today.getDate() + d);
    slots.push({ label: dayNames[dt.getDay()] + ' ' + monthNames[dt.getMonth()] + ' ' + dt.getDate(), time: slotTimes[i] });
  });

  // Call script based on propensity
  var scriptLines = [
    'Hi ' + lead.name.split(' ')[0] + ', this is Sridhar from New York Life.',
    'I\'m reaching out because ' + (lead.lifeEventTrigger === 'Referral' ? 'one of my clients mentioned you' : lead.lifeEventTrigger.toLowerCase() + ' caught my attention') + '.',
    'I help people in your situation with ' + pp.topProducts + '.',
    'Do you have 15 minutes ' + slots[0].label + ' at ' + slots[0].time + '? No commitment — just a conversation.'
  ];

  var overlay = document.createElement('div');
  overlay.id   = 'schedcall-overlay';
  overlay.className = 'pmail-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) closeScheduleCallModal(); };
  overlay.innerHTML =
    '<div class="sched-modal">' +
      '<div class="sched-modal-header">' +
        '<div class="sched-modal-title"><i class="fas fa-calendar-plus"></i> Schedule Call — ' + lead.name + '</div>' +
        '<button class="pmail-modal-close" onclick="closeScheduleCallModal()">×</button>' +
      '</div>' +
      '<div class="sched-modal-body">' +
        // AI slots
        '<div class="sched-section-label"><i class="fas fa-robot"></i> AI Suggested Times</div>' +
        '<div class="sched-slots">' +
          slots.map(function(s, i) {
            return '<div class="sched-slot" id="sched-slot-' + i + '" onclick="selectSchedSlot(' + i + ')">' +
              '<i class="fas fa-clock"></i> <strong>' + s.label + '</strong> &nbsp;' + s.time +
            '</div>';
          }).join('') +
          '<div class="sched-slot sched-slot-custom" onclick="selectSchedSlot(3)">' +
            '<i class="fas fa-pencil-alt"></i> Custom date/time' +
          '</div>' +
        '</div>' +
        // Custom input (hidden by default)
        '<div id="sched-custom-wrap" style="display:none;margin:8px 0">' +
          '<input type="text" class="sched-custom-input" id="sched-custom-input" placeholder="e.g. Apr 18 at 3:00 PM" />' +
        '</div>' +
        // Call script
        '<div class="sched-section-label" style="margin-top:14px"><i class="fas fa-microphone"></i> AI Call Script</div>' +
        '<div class="sched-script">' +
          scriptLines.map(function(line) { return '<div class="sched-script-line">' + line + '</div>'; }).join('') +
        '</div>' +
        // Outcome (shown after call)
        '<div class="sched-section-label" style="margin-top:14px"><i class="fas fa-clipboard"></i> Log Outcome</div>' +
        '<div class="sched-outcomes">' +
          ['Reached — interested','Reached — not interested','Left Voicemail','No Answer','Rescheduled'].map(function(o) {
            return '<div class="sched-outcome-chip" onclick="selectSchedOutcome(this,\'' + o + '\')">' + o + '</div>';
          }).join('') +
        '</div>' +
        '<div id="sched-outcome-note-wrap" style="display:none;margin-top:8px">' +
          '<input type="text" class="sched-custom-input" id="sched-outcome-note" placeholder="Optional note..." />' +
        '</div>' +
      '</div>' +
      '<div class="sched-modal-footer">' +
        '<button class="pmail-btn-back" onclick="closeScheduleCallModal()">Cancel</button>' +
        '<button class="pmail-btn-next pmail-btn-qualify" onclick="confirmScheduleCall()"><i class="fas fa-check"></i> Confirm &amp; Log</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
}

var _schedSlotSelected = null;
var _schedOutcomeSelected = null;

function selectSchedSlot(idx) {
  _schedSlotSelected = idx;
  document.querySelectorAll('.sched-slot').forEach(function(el, i) { el.classList.toggle('sched-slot-active', i === idx); });
  var custom = document.getElementById('sched-custom-wrap');
  if (custom) custom.style.display = idx === 3 ? 'block' : 'none';
}

function selectSchedOutcome(el, outcome) {
  _schedOutcomeSelected = outcome;
  document.querySelectorAll('.sched-outcome-chip').forEach(function(c){ c.classList.remove('sched-outcome-active'); });
  el.classList.add('sched-outcome-active');
  var noteWrap = document.getElementById('sched-outcome-note-wrap');
  if (noteWrap) noteWrap.style.display = 'block';
}

function confirmScheduleCall() {
  var lead = leadsData.find(function(l){ return l.id === _schedCallLeadId; });
  if (!lead) return;

  var slotLabels = ['Mon Apr 13 · 9:00 AM','Tue Apr 14 · 11:00 AM','Thu Apr 16 · 2:00 PM','Custom'];
  var slotLabel  = _schedSlotSelected !== null ? slotLabels[_schedSlotSelected] || 'Custom' : 'Unspecified';
  var outcome    = _schedOutcomeSelected || 'Scheduled';
  var note       = (document.getElementById('sched-outcome-note') || {}).value || '';

  // Log contact attempt
  if (!lead.contactLog) lead.contactLog = [];
  lead.contactLog.push({ date: 'Apr 11, 2026', type: 'call', outcome: outcome, note: slotLabel + (note ? ' — ' + note : '') });
  lead.contactAttempts = (lead.contactAttempts || 0) + 1;
  lead.lastContact = 'Apr 11, 2026';

  // Advance status: new → contacted
  if (lead.status === 'new') lead.status = 'contacted';

  closeScheduleCallModal();
  showToast('<i class="fas fa-calendar-check"></i> Call scheduled — ' + slotLabel + ' · Outcome: ' + outcome, 'success');
  renderLeadsList();
  renderLeadStats();
  selectLead(_schedCallLeadId);
}

function closeScheduleCallModal() {
  var el = document.getElementById('schedcall-overlay');
  if (el) el.remove();
  _schedSlotSelected = null;
  _schedOutcomeSelected = null;
}

// ── OUTREACH MODAL ─────────────────────────────────────────────
var _outreachLeadId = null;

function openOutreachModal(leadId) {
  _outreachLeadId = leadId;
  var lead = leadsData.find(function(l){ return l.id === leadId; });
  var pp   = propensityProfiles[leadId];
  if (!lead) return;

  // Auto-select channel based on referral type
  var channelMap = {
    'linkedin':'LinkedIn', 'campaign-linkedin':'LinkedIn', 'inbound-digital':'Email',
    'client-referral':'Email', 'seminar':'Email', 'public-record':'Email',
    'life-event-alert':'Email', 'event':'Email', 'campaign-social':'Facebook',
    'association-list':'Email', 'ai-scan':'Email'
  };
  var defaultChannel = channelMap[lead.referralType] || 'Email';

  // AI draft message
  var draft = pp.aiOpener || ('Hi ' + lead.name.split(' ')[0] + ' — ' + pp.topProducts + ' looks like a strong fit based on your recent ' + lead.lifeEventTrigger + '. Worth a quick conversation?');

  var channels = ['Email','Text','LinkedIn','Phone','Direct Mail'];

  var overlay = document.createElement('div');
  overlay.id   = 'outreach-overlay';
  overlay.className = 'pmail-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) closeOutreachModal(); };
  overlay.innerHTML =
    '<div class="sched-modal">' +
      '<div class="sched-modal-header">' +
        '<div class="sched-modal-title"><i class="fas fa-paper-plane"></i> Send Outreach — ' + lead.name + '</div>' +
        '<button class="pmail-modal-close" onclick="closeOutreachModal()">×</button>' +
      '</div>' +
      '<div class="sched-modal-body">' +
        '<div class="sched-section-label"><i class="fas fa-robot"></i> AI Recommended Channel: <strong>' + defaultChannel + '</strong> (based on source: ' + lead.referralType.replace(/-/g,' ') + ')</div>' +
        '<div class="outreach-channels">' +
          channels.map(function(ch) {
            var active = ch === defaultChannel;
            return '<div class="outreach-channel-chip ' + (active?'outreach-channel-active':'') + '" onclick="selectOutreachChannel(this,\'' + ch + '\')">' + ch + '</div>';
          }).join('') +
        '</div>' +
        '<div class="sched-section-label" style="margin-top:14px"><i class="fas fa-robot"></i> AI-Drafted Message</div>' +
        '<textarea class="outreach-draft-area" id="outreach-draft-text">' + draft + '</textarea>' +
        '<div class="outreach-draft-hint">Personalised to life event trigger · Edit freely before sending</div>' +
        '<div class="sched-section-label" style="margin-top:14px"><i class="fas fa-info-circle"></i> Context</div>' +
        '<div class="outreach-context-pills">' +
          '<span class="outreach-ctx-pill"><i class="fas fa-bolt"></i> ' + lead.lifeEventTrigger + '</span>' +
          '<span class="outreach-ctx-pill"><i class="fas fa-dollar-sign"></i> ' + lead.estimatedIncome + '</span>' +
          '<span class="outreach-ctx-pill"><i class="fas fa-tag"></i> ' + lead.productInterest[0] + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="sched-modal-footer">' +
        '<button class="pmail-btn-back" onclick="closeOutreachModal()">Cancel</button>' +
        '<button class="pmail-btn-next pmail-btn-qualify" onclick="confirmOutreach()"><i class="fas fa-paper-plane"></i> Send &amp; Log</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
}

var _outreachChannelSelected = null;

function selectOutreachChannel(el, channel) {
  _outreachChannelSelected = channel;
  document.querySelectorAll('.outreach-channel-chip').forEach(function(c){ c.classList.remove('outreach-channel-active'); });
  el.classList.add('outreach-channel-active');
}

function confirmOutreach() {
  var lead = leadsData.find(function(l){ return l.id === _outreachLeadId; });
  if (!lead) return;
  var channel  = _outreachChannelSelected || 'Email';
  var draftEl  = document.getElementById('outreach-draft-text');
  var msgSnip  = draftEl ? draftEl.value.substring(0,60) + (draftEl.value.length>60?'…':'') : '';

  if (!lead.contactLog) lead.contactLog = [];
  lead.contactLog.push({ date: 'Apr 11, 2026', type: channel.toLowerCase(), outcome: 'Sent', note: channel + ' outreach sent: "' + msgSnip + '"' });
  lead.contactAttempts = (lead.contactAttempts || 0) + 1;
  lead.lastContact = 'Apr 11, 2026';
  if (lead.status === 'new') lead.status = 'contacted';

  closeOutreachModal();
  showToast('<i class="fas fa-paper-plane"></i> ' + channel + ' outreach sent to ' + lead.name + ' — contact logged', 'success');
  renderLeadsList();
  renderLeadStats();
  selectLead(_outreachLeadId);
}

function closeOutreachModal() {
  var el = document.getElementById('outreach-overlay');
  if (el) el.remove();
  _outreachChannelSelected = null;
}

// ── ADD TO CAMPAIGN MODAL ──────────────────────────────────────
function openAddToCampaignModal(leadId) {
  var lead = leadsData.find(function(l){ return l.id === leadId; });
  var pp   = propensityProfiles[leadId];
  if (!lead) return;

  // Pick relevant campaigns based on domain scores
  var relevantCamps = campaignData.filter(function(c){ return c.status === 'active'; });

  var overlay = document.createElement('div');
  overlay.id   = 'addcamp-overlay';
  overlay.className = 'pmail-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) closeAddToCampaignModal(); };
  overlay.innerHTML =
    '<div class="sched-modal">' +
      '<div class="sched-modal-header">' +
        '<div class="sched-modal-title"><i class="fas fa-bullhorn"></i> Add to Campaign — ' + lead.name + '</div>' +
        '<button class="pmail-modal-close" onclick="closeAddToCampaignModal()">×</button>' +
      '</div>' +
      '<div class="sched-modal-body">' +
        '<div class="addcamp-lead-summary">' +
          '<div class="lead-avatar" style="background:' + lead.avatarColor + ';width:36px;height:36px;font-size:0.85rem">' + lead.initials + '</div>' +
          '<div><div class="addcamp-lead-name">' + lead.name + '</div>' +
          '<div class="addcamp-lead-sub"><i class="fas fa-brain"></i> ' + pp.topProducts + ' · PMAIL ' + (pmailScores[leadId] ? pmailScores[leadId].total : '—') + '/100</div></div>' +
        '</div>' +
        '<div class="sched-section-label"><i class="fas fa-robot"></i> AI-Recommended Campaigns</div>' +
        '<div class="addcamp-list">' +
          relevantCamps.map(function(camp) {
            var match = camp.targetLeads && camp.targetLeads.includes(leadId);
            return '<div class="addcamp-row ' + (match?'addcamp-row-match':'') + '" onclick="selectCampaignForLead(\'' + camp.id + '\',this)">' +
              '<div class="addcamp-row-left">' +
                '<div class="addcamp-camp-icon" style="background:' + camp.statusColor + '22;color:' + camp.statusColor + '"><i class="fas ' + camp.typeIcon + '"></i></div>' +
                '<div>' +
                  '<div class="addcamp-camp-name">' + camp.name + (match?' <span class="addcamp-match-tag">Best match</span>':'') + '</div>' +
                  '<div class="addcamp-camp-sub">' + camp.targetSegment + '</div>' +
                  '<div class="addcamp-camp-stats"><i class="fas fa-percentage"></i> ' + camp.responseRate + '% response · ' + camp.channel + '</div>' +
                '</div>' +
              '</div>' +
              '<div class="addcamp-row-check" id="addcamp-check-' + camp.id + '"><i class="fas fa-circle"></i></div>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="sched-modal-footer">' +
        '<button class="pmail-btn-back" onclick="closeAddToCampaignModal()">Cancel</button>' +
        '<button class="pmail-btn-next pmail-btn-qualify" onclick="confirmAddToCampaign(\'' + leadId + '\')"><i class="fas fa-plus-circle"></i> Add to Campaign</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
}

var _selectedCampaignId = null;

function selectCampaignForLead(campId, el) {
  _selectedCampaignId = campId;
  document.querySelectorAll('.addcamp-row').forEach(function(r){ r.classList.remove('addcamp-row-selected'); });
  document.querySelectorAll('.addcamp-row-check').forEach(function(c){ c.innerHTML = '<i class="fas fa-circle"></i>'; });
  el.classList.add('addcamp-row-selected');
  var check = document.getElementById('addcamp-check-' + campId);
  if (check) check.innerHTML = '<i class="fas fa-check-circle" style="color:#059669"></i>';
}

function confirmAddToCampaign(leadId) {
  if (!_selectedCampaignId) { showToast('Please select a campaign first', 'info'); return; }
  var lead = leadsData.find(function(l){ return l.id === leadId; });
  var camp = campaignData.find(function(c){ return c.id === _selectedCampaignId; });
  if (!lead || !camp) return;

  lead.status = 'in-campaign';
  lead.campaignLink = { id: camp.id, name: camp.name, responded: false, responseDate: null, responseNote: null };
  if (!lead.contactLog) lead.contactLog = [];
  lead.contactLog.push({ date: 'Apr 11, 2026', type: 'email', outcome: 'Sent', note: 'Added to campaign: ' + camp.name + ' — first message queued' });
  lead.contactAttempts = (lead.contactAttempts || 0) + 1;
  lead.lastContact = 'Apr 11, 2026';

  closeAddToCampaignModal();
  showToast('<i class="fas fa-bullhorn"></i> ' + lead.name + ' added to "' + camp.name + '" — first message queued', 'success');
  renderLeadsList();
  renderLeadStats();
  selectLead(leadId);
}

function closeAddToCampaignModal() {
  var el = document.getElementById('addcamp-overlay');
  if (el) el.remove();
  _selectedCampaignId = null;
}

// ── LEAD HISTORY MODAL (converted leads) ──────────────────────
function openLeadHistory(leadId) {
  var lead = leadsData.find(function(l){ return l.id === leadId; });
  var pm   = pmailScores[leadId];
  var pp   = propensityProfiles[leadId];
  if (!lead) return;

  var typeIcon = { call:'fa-phone', email:'fa-envelope', linkedin:'fa-linkedin', text:'fa-sms', social:'fa-hashtag' };
  var outcomeColor = { Reached:'#059669', Replied:'#059669', Opened:'#0891b2', Sent:'#64748b', 'Left VM':'#d97706', Delivered:'#64748b', Clicked:'#0891b2' };

  var logRows = (lead.contactLog || []).map(function(entry) {
    var ic = typeIcon[entry.type] || 'fa-circle';
    var oc = outcomeColor[entry.outcome] || '#64748b';
    return '<div class="ld-log-row">' +
      '<div class="ld-log-icon" style="background:' + oc + '15;color:' + oc + '"><i class="fas ' + ic + '"></i></div>' +
      '<div class="ld-log-body">' +
        '<div class="ld-log-top"><span class="ld-log-date">' + entry.date + '</span><span class="ld-log-outcome" style="color:' + oc + '">' + entry.outcome + '</span></div>' +
        '<div class="ld-log-note">' + entry.note + '</div>' +
      '</div>' +
    '</div>';
  }).join('') || '<div style="color:#94a3b8;font-size:0.82rem">No contact history recorded.</div>';

  var overlay = document.createElement('div');
  overlay.id   = 'leadhist-overlay';
  overlay.className = 'pmail-overlay';
  overlay.onclick = function(e) { if (e.target === overlay) closeLeadHistory(); };
  overlay.innerHTML =
    '<div class="sched-modal" style="max-width:560px">' +
      '<div class="sched-modal-header">' +
        '<div class="sched-modal-title"><i class="fas fa-history"></i> Lead History — ' + lead.name + '</div>' +
        '<button class="pmail-modal-close" onclick="closeLeadHistory()">×</button>' +
      '</div>' +
      '<div class="sched-modal-body">' +
        '<div class="leadhist-summary">' +
          '<div class="leadhist-row"><span class="lh-lbl">Lead ID</span><span>' + lead.id + '</span></div>' +
          '<div class="leadhist-row"><span class="lh-lbl">Entry Date</span><span>' + lead.entryDate + '</span></div>' +
          '<div class="leadhist-row"><span class="lh-lbl">Source</span><span>' + lead.referralSource + '</span></div>' +
          '<div class="leadhist-row"><span class="lh-lbl">Life Event</span><span>' + lead.lifeEventTrigger + '</span></div>' +
          '<div class="leadhist-row"><span class="lh-lbl">PMAIL Score</span><span>' + (pm ? pm.total + '/100 · ' + pm.qualDate : '—') + '</span></div>' +
          '<div class="leadhist-row"><span class="lh-lbl">Campaign</span><span>' + (lead.campaignLink ? lead.campaignLink.name : '—') + '</span></div>' +
          '<div class="leadhist-row"><span class="lh-lbl">Response</span><span>' + (lead.campaignLink && lead.campaignLink.responded ? lead.campaignLink.responseDate + ' — ' + (lead.campaignLink.responseNote||'') : 'No response recorded') + '</span></div>' +
          '<div class="leadhist-row"><span class="lh-lbl">Prospect ID</span><span><a href="#" onclick="closeLeadHistory();viewLinkedProspect(\'' + lead.prospectId + '\');return false" style="color:#003087;font-weight:600">' + (lead.prospectId || '—') + ' →</a></span></div>' +
        '</div>' +
        '<div class="sched-section-label" style="margin-top:12px"><i class="fas fa-history"></i> Contact Timeline</div>' +
        '<div class="ld-contact-log">' + logRows + '</div>' +
      '</div>' +
      '<div class="sched-modal-footer">' +
        '<button class="pmail-btn-back" onclick="closeLeadHistory()">Close</button>' +
        (lead.prospectId ? '<button class="pmail-btn-next pmail-btn-qualify" onclick="closeLeadHistory();viewLinkedProspect(\'' + lead.prospectId + '\')"><i class="fas fa-user"></i> Open Prospect Record</button>' : '') +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
}

function closeLeadHistory() {
  var el = document.getElementById('leadhist-overlay');
  if (el) el.remove();
}`;

if (!src.includes(OLD_VIEW_LINKED)) { console.error('ANCHOR viewLinkedProspect not found'); process.exit(1); }
src = src.replace(OLD_VIEW_LINKED, NEW_VIEW_LINKED);
console.log('✓ New modals appended (Schedule Call, Outreach, Add to Campaign, Lead History)');

// ─────────────────────────────────────────────────────────────────────────────
// 11. Guard
// ─────────────────────────────────────────────────────────────────────────────
src += '\n/* LEADS_V2_PATCH_APPLIED */\n';

fs.writeFileSync(FILE, src, 'utf8');
console.log('✓ app.js written successfully');
console.log('All LEADS_V2 patches applied.');
