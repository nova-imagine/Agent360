/* ================================================================
   PHASE 6 — Policy Delivery & Onboarding  (phase6_module.js)
   6.1 Receive policy · 6.2 Schedule meeting · 6.3 Delivery meeting
   6.4 CRM entry · 6.5 Service reminders · 6.6 Welcome letter
   6.7 Portal onboarding
   AI: Delivery Prep · Plain-English Summary · Beneficiary Validation
       Portal Onboarding Guide · Post-Delivery AI Check-in
   ================================================================ */

console.log('[Phase 6] Policy Delivery & Onboarding module loading…');
console.log('  p6Deliveries[5] · p6ChecklistDefs · p6PortalSteps');
console.log('  Functions: initDeliveryPage(override) · p6RenderQueue · p6OpenDelivery');

/* ── DATA ─────────────────────────────────────────────────────── */

var p6Deliveries = [
  {
    id: 'DEL-001',
    client: 'Alex Rivera', initials: 'AR', age: 34,
    policyId: 'P-100360', product: 'Whole Life (Participating)', carrier: 'New York Life',
    faceAmount: '$500,000', premium: '$4,800/yr', premiumMode: 'Annual',
    issueDate: 'Apr 8, 2026', meetingDate: 'Apr 14, 2026', meetingTime: '2:00 PM',
    meetingType: 'In-Person', location: '285 Lexington Ave, Suite 1200, New York',
    status: 'ready', daysOut: 2, urgency: 'normal',
    stage: 'Scheduled',
    freeLookDays: 30, freeLookDeadline: 'May 8, 2026',
    gracePeriodDays: 31,
    crmEntered: false, remindersSet: false, welcomeSent: false, portalOnboarded: false,
    receiptCaptured: false,
    checklistDone: 6, checklistTotal: 10,
    checklist: [
      { key: 'issued',       label: 'Policy package received from carrier',       done: true,  required: true  },
      { key: 'docs',         label: 'Policy documents organised in folder/binder', done: true,  required: true  },
      { key: 'ai_brief',     label: 'AI delivery brief generated',                 done: true,  required: true  },
      { key: 'meeting_sched',label: 'Delivery meeting scheduled with client',      done: true,  required: true  },
      { key: 'premium_coll', label: 'Initial premium collected',                   done: true,  required: true  },
      { key: 'review',       label: 'Policy reviewed page-by-page with client',    done: false, required: true  },
      { key: 'bene_confirm', label: 'Beneficiary designations confirmed',           done: false, required: true  },
      { key: 'free_look',    label: 'Free-look period explained (30 days)',         done: false, required: true  },
      { key: 'receipt',      label: 'Signed delivery receipt captured',             done: false, required: true  },
      { key: 'portal',       label: 'Client onboarded to portal/mobile app',       done: false, required: false }
    ],
    beneficiaries: [
      { role: 'Primary',    name: 'Sarah Rivera',  relation: 'Spouse',           pct: 100, issues: [] },
      { role: 'Contingent', name: 'Emily Rivera',  relation: 'Daughter (minor)', pct: 100, issues: ['Minor beneficiary — recommend UTMA or trust'] }
    ],
    riders: ['Waiver of Premium Rider', 'Paid-Up Additions (PUA) Rider'],
    anniversaryDate: 'Apr 8 annually',
    reviewDate: 'Apr 2027',
    agent: 'You',
    aiBrief: {
      summary: 'Alex Rivera, 34, VP of Technology — first life insurance policy triggered by newborn daughter (Dec 2025). Detail-oriented and technical; use clear, logical explanations with data.',
      agenda: [
        'Welcome and congratulate on the policy issuance',
        'Walk through policy contract cover page — confirm policy number, face amount, issue date',
        'Review premium schedule — $4,800/yr annual, due Apr 8 each year',
        'Explain Waiver of Premium rider — premiums waived if totally disabled',
        'Show cash value projection table — highlight wealth-building potential',
        'Explain Paid-Up Additions (PUA) rider — accelerates cash value growth',
        'Confirm beneficiaries: Sarah (100% primary), Emily (contingent — flag UTMA)',
        'Explain free-look period — 30 days to return for full refund, ends May 8',
        'Explain grace period — 31 days after missed premium before lapse',
        'Collect signed delivery receipt',
        'Walk through portal login and mobile app setup',
        'Schedule first annual review — Apr 2027'
      ],
      keyPoints: [
        'Guaranteed $500K death benefit secures Emily\'s future and Sarah\'s income replacement',
        'Cash value grows tax-deferred — show the 20-year projection ($180K+ by age 54)',
        'PUA rider compounds growth — explain as "buying more paid-up insurance each year"',
        'Waiver of Premium rider is critical — he is primary household earner',
        'Emily is a minor beneficiary — strongly recommend UTMA or family trust designation'
      ],
      objectionScript: 'If he says the premium feels high: "Alex, at $400/month that\'s less than your car payment — and unlike a car, this builds guaranteed tax-free wealth for Emily\'s future while protecting Sarah today."',
      plainEnglishSummary: 'Your New York Life Whole Life policy #P-100360 protects your family with a guaranteed $500,000 payout if you pass away — no matter when. You also build up real cash savings inside the policy that grow tax-free. You can borrow against this cash value if you ever need it. Your premium is $4,800 per year, due every April 8th. If you miss a payment, you have a 31-day grace period before anything changes. You have 30 days from today to return the policy for a full refund if you change your mind.',
      freelookNote: '30-day free-look period ends May 8, 2026. Set 7-day AI check-in for April 21.',
      beneficiaryAlert: 'Emily Rivera is listed as a minor contingent beneficiary. If Sarah predeceases Alex and Emily is still a minor, the court would appoint a guardian to manage the $500K. Strongly recommend a UTMA account or family trust as contingent.',
      postDeliveryCheckin: 'Apr 21, 2026 — automated AI message: "Hi Alex, it\'s been a week since your policy delivery. Any questions about your Whole Life policy or cash value projections? Reply here and I\'ll follow up within 24 hours."'
    },
    statusUpdates: [
      { date: 'Apr 8',  icon: 'fa-file-alt',      text: 'Policy P-100360 issued by New York Life' },
      { date: 'Apr 8',  icon: 'fa-robot',          text: 'AI delivery brief auto-generated' },
      { date: 'Apr 10', icon: 'fa-calendar-check', text: 'Delivery meeting scheduled for Apr 14, 2:00 PM' },
      { date: 'Apr 11', icon: 'fa-dollar-sign',    text: 'Initial annual premium $4,800 collected' }
    ]
  },
  {
    id: 'DEL-002',
    client: 'Nancy Foster', initials: 'NF', age: 41,
    policyId: 'P-100365', product: 'Term Life 20-Year', carrier: 'New York Life',
    faceAmount: '$1,000,000', premium: '$3,600/yr', premiumMode: 'Annual',
    issueDate: 'Apr 9, 2026', meetingDate: 'Apr 16, 2026', meetingTime: '10:00 AM',
    meetingType: 'Video Call', location: 'Zoom — link sent to client',
    status: 'scheduled', daysOut: 4, urgency: 'normal',
    stage: 'Scheduled',
    freeLookDays: 30, freeLookDeadline: 'May 9, 2026',
    gracePeriodDays: 31,
    crmEntered: true, remindersSet: true, welcomeSent: false, portalOnboarded: false,
    receiptCaptured: false,
    checklistDone: 5, checklistTotal: 10,
    checklist: [
      { key: 'issued',        label: 'Policy package received from carrier',      done: true,  required: true  },
      { key: 'docs',          label: 'Policy documents ready',                    done: true,  required: true  },
      { key: 'ai_brief',      label: 'AI delivery brief generated',               done: true,  required: true  },
      { key: 'meeting_sched', label: 'Delivery meeting scheduled',                done: true,  required: true  },
      { key: 'premium_coll',  label: 'Initial premium collected',                 done: true,  required: true  },
      { key: 'review',        label: 'Policy reviewed page-by-page with client',  done: false, required: true  },
      { key: 'bene_confirm',  label: 'Beneficiary designations confirmed',         done: false, required: true  },
      { key: 'free_look',     label: 'Free-look period explained (30 days)',       done: false, required: true  },
      { key: 'receipt',       label: 'Signed delivery receipt captured',           done: false, required: true  },
      { key: 'portal',        label: 'Client onboarded to portal/mobile app',     done: false, required: false }
    ],
    beneficiaries: [
      { role: 'Primary', name: 'Dr. Marcus Foster', relation: 'Spouse', pct: 100, issues: [] }
    ],
    riders: ['Conversion Privilege Rider (to Permanent — no medical exam required)'],
    anniversaryDate: 'Apr 9 annually',
    reviewDate: 'Apr 2027',
    agent: 'You',
    aiBrief: {
      summary: 'Nancy Foster, 41, Healthcare Director — $1M 20-year term triggered by new home purchase (Mar 2026, $820K mortgage). Highly analytical — prepare with numbers.',
      agenda: [
        'Confirm policy number, face amount $1M, 20-year term expiry date Apr 9, 2046',
        'Explain how $1M covers both the $820K mortgage AND income replacement',
        'Walk through premium schedule — $3,600/yr at Standard rating',
        'Explain the Standard rating and why BP medication puts her in that tier',
        'Highlight conversion privilege — convert to permanent with no new medical',
        'Confirm beneficiary: Dr. Marcus Foster (100% primary)',
        'Explain free-look and grace periods',
        'Collect signed receipt via DocuSign',
        'Set up portal access',
        'Note LTC rider discussion for Apr 2027 annual review'
      ],
      keyPoints: [
        '$1M benefit covers $820K mortgage in full plus 2+ years of income replacement',
        'Conversion privilege is extremely valuable — no medical exam needed if health changes',
        'Standard rating vs Preferred: only $18/month difference — excellent value for $1M',
        'LTC rider conversation deferred to annual review — set reminder now',
        'No contingent beneficiary named — recommend adding children or estate'
      ],
      objectionScript: 'If she questions the Standard rating: "Nancy, the BP medication puts you at Standard — but over 20 years, that\'s only $18/month more than Preferred. For $1M of coverage that protects your $820K mortgage and Marcus\'s income, that\'s exceptional value."',
      plainEnglishSummary: 'Your New York Life term policy #P-100365 pays your family $1,000,000 if you pass away at any time during the next 20 years. This fully covers your mortgage ($820K) with money left over. Your premium is $3,600 per year. If you ever develop a health issue, your conversion privilege lets you switch to a permanent policy with NO new medical exam — this is very valuable. You have 30 days from today to return the policy for a full refund.',
      freelookNote: '30-day free-look period ends May 9, 2026. Schedule 7-day check-in for April 23.',
      beneficiaryAlert: 'No contingent beneficiary named. If Dr. Marcus Foster predeceases Nancy, the $1M benefit would pass through the estate — recommend adding children or a trust as contingent.',
      postDeliveryCheckin: 'Apr 23, 2026 — automated AI message: "Hi Nancy, checking in after your policy delivery. Any questions about your term coverage or conversion options? I\'m here to help."'
    },
    statusUpdates: [
      { date: 'Apr 9',  icon: 'fa-file-alt',      text: 'Policy P-100365 issued by New York Life' },
      { date: 'Apr 9',  icon: 'fa-database',       text: 'Policy entered into CRM — anniversary Apr 9' },
      { date: 'Apr 10', icon: 'fa-bell',            text: 'Service reminders set — anniversary, renewal, review' },
      { date: 'Apr 11', icon: 'fa-calendar-check', text: 'Meeting scheduled Apr 16, 10:00 AM (Zoom)' },
      { date: 'Apr 12', icon: 'fa-dollar-sign',    text: 'Annual premium $3,600 collected' }
    ]
  },
  {
    id: 'DEL-003',
    client: 'Kevin Park', initials: 'KP', age: 29,
    policyId: 'P-100350', product: 'Term Life 20-Year', carrier: 'New York Life',
    faceAmount: '$250,000', premium: '$3,200/yr', premiumMode: 'Monthly auto-pay',
    issueDate: 'Apr 1, 2026', meetingDate: 'NOT SCHEDULED', meetingTime: '',
    meetingType: 'TBD', location: 'TBD',
    status: 'overdue', daysOut: -8, urgency: 'urgent',
    stage: 'Overdue',
    freeLookDays: 30, freeLookDeadline: 'May 1, 2026',
    gracePeriodDays: 31,
    crmEntered: false, remindersSet: false, welcomeSent: false, portalOnboarded: false,
    receiptCaptured: false,
    checklistDone: 2, checklistTotal: 10,
    checklist: [
      { key: 'issued',        label: 'Policy package received from carrier',      done: true,  required: true  },
      { key: 'docs',          label: 'Policy documents ready',                    done: true,  required: true  },
      { key: 'ai_brief',      label: 'AI delivery brief generated',               done: false, required: true  },
      { key: 'meeting_sched', label: 'Delivery meeting scheduled',                done: false, required: true  },
      { key: 'premium_coll',  label: 'Initial premium collected',                 done: false, required: true  },
      { key: 'review',        label: 'Policy reviewed page-by-page with client',  done: false, required: true  },
      { key: 'bene_confirm',  label: 'Beneficiary designations confirmed',         done: false, required: true  },
      { key: 'free_look',     label: 'Free-look period explained (30 days)',       done: false, required: true  },
      { key: 'receipt',       label: 'Signed delivery receipt captured',           done: false, required: true  },
      { key: 'portal',        label: 'Client onboarded to portal/mobile app',     done: false, required: false }
    ],
    beneficiaries: [
      { role: 'Primary', name: 'Jennifer Park', relation: 'Spouse', pct: 100, issues: [] }
    ],
    riders: [],
    anniversaryDate: 'Apr 1 annually',
    reviewDate: 'Apr 2027',
    agent: 'You',
    aiBrief: {
      summary: 'Kevin Park, 29, Software Engineer — policy issued 8 days ago but undelivered. Free-look deadline May 1 is approaching. Sensitive due to recent hospital claim (CLM-2026-0035).',
      agenda: [
        '⚡ URGENT: Schedule delivery immediately — only 20 days to free-look deadline',
        'Keep meeting brief, warm, and positive — focus on protection now active',
        'Confirm monthly auto-pay from Chase checking account',
        'Confirm Jennifer Park (100% primary beneficiary)',
        'Walk through policy basics — do NOT dwell on claim details',
        'Explain free-look and grace period clearly',
        'Capture signed delivery receipt',
        'Onboard to portal — show claim status transparency feature'
      ],
      keyPoints: [
        '⚡ Free-look deadline May 1 — only 20 days remaining — schedule TODAY',
        'Recent hospital claim (CLM-2026-0035) makes delivery meeting emotionally sensitive',
        'Monthly auto-pay $266.67/month from Chase checking — confirm bank details',
        'No riders on this policy — suggest Waiver of Premium at annual review',
        'Jennifer Park is sole beneficiary — no contingent named'
      ],
      objectionScript: 'If he hesitates to meet: "Kevin, your policy is already active and protecting Jennifer right now — this meeting just walks you through what you own. It takes 30 minutes and we can do it on a video call at your convenience."',
      plainEnglishSummary: 'Your New York Life term policy #P-100350 pays Jennifer $250,000 if you pass away at any time during the next 20 years. You pay $266.67/month by automatic bank transfer. If you ever miss a payment, you have a 31-day grace period before anything changes. ⚡ Important: You have until May 1, 2026 to return this policy for a full refund if you change your mind.',
      freelookNote: '⚡ URGENT — free-look deadline May 1, 2026. Only 20 days remaining. Deliver before April 28.',
      beneficiaryAlert: 'No contingent beneficiary named. If Jennifer predeceases Kevin, the $250K would pass through the estate. Recommend adding parents or a secondary beneficiary.',
      postDeliveryCheckin: '7 days post-delivery — automated AI message: "Hi Kevin, hope the policy delivery went smoothly. Any questions about your coverage or how to access your policy online? I\'m here to help."'
    },
    statusUpdates: [
      { date: 'Apr 1',  icon: 'fa-file-alt',           text: 'Policy P-100350 issued by New York Life' },
      { date: 'Apr 1',  icon: 'fa-exclamation-circle', text: 'Delivery not scheduled — 8 days overdue' },
      { date: 'Apr 9',  icon: 'fa-robot',              text: 'AI alert: free-look deadline May 1 — 20 days remaining' }
    ]
  },
  {
    id: 'DEL-R1',
    client: 'Sandra Williams', initials: 'SW', age: 58,
    policyId: 'P-100320', product: 'Term Life 20-Year (Conversion)', carrier: 'New York Life',
    faceAmount: '$350,000', premium: '$6,400/yr', premiumMode: 'Semi-annual',
    issueDate: 'Mar 28, 2026', meetingDate: 'Apr 3, 2026', meetingTime: '1:00 PM',
    meetingType: 'In-Person', location: 'Client\'s home — 14 Oak Street, Greenwich, CT',
    status: 'delivered', daysOut: null, urgency: 'normal',
    stage: 'Delivered',
    freeLookDays: 30, freeLookDeadline: 'Apr 27, 2026',
    gracePeriodDays: 31,
    crmEntered: true, remindersSet: true, welcomeSent: true, portalOnboarded: true,
    receiptCaptured: true,
    checklistDone: 10, checklistTotal: 10,
    checklist: [
      { key: 'issued',        label: 'Policy package received from carrier',      done: true, required: true  },
      { key: 'docs',          label: 'Policy documents organised in folder',       done: true, required: true  },
      { key: 'ai_brief',      label: 'AI delivery brief generated',               done: true, required: true  },
      { key: 'meeting_sched', label: 'Delivery meeting scheduled',                done: true, required: true  },
      { key: 'premium_coll',  label: 'Initial premium collected',                 done: true, required: true  },
      { key: 'review',        label: 'Policy reviewed page-by-page with client',  done: true, required: true  },
      { key: 'bene_confirm',  label: 'Beneficiary designations confirmed',         done: true, required: true  },
      { key: 'free_look',     label: 'Free-look period explained (30 days)',       done: true, required: true  },
      { key: 'receipt',       label: 'Signed delivery receipt captured',           done: true, required: true  },
      { key: 'portal',        label: 'Client onboarded to portal/mobile app',     done: true, required: false }
    ],
    beneficiaries: [
      { role: 'Primary',    name: 'Michael Williams', relation: 'Spouse',      pct: 100, issues: [] },
      { role: 'Contingent', name: 'Thomas Williams',  relation: 'Son (adult)', pct: 100, issues: [] }
    ],
    riders: ['Conversion Privilege Rider'],
    anniversaryDate: 'Mar 28 annually',
    reviewDate: 'Mar 2027',
    agent: 'You',
    aiBrief: {
      summary: 'Sandra Williams, 58 — successful conversion delivery. Policy renewed without new medical exam. All steps completed. Portal onboarded. 7-day check-in scheduled.',
      agenda: [],
      keyPoints: ['All 10 checklist items complete', 'Receipt on file', 'Portal active', 'Annual review Mar 2027'],
      objectionScript: '',
      plainEnglishSummary: 'Delivered.',
      freelookNote: 'Free-look period expires Apr 27, 2026. 7-day check-in completed Apr 10.',
      beneficiaryAlert: '',
      postDeliveryCheckin: 'Completed Apr 10 — no questions from client.'
    },
    statusUpdates: [
      { date: 'Mar 28', icon: 'fa-file-alt',          text: 'Policy P-100320 issued — term conversion' },
      { date: 'Apr 3',  icon: 'fa-handshake',         text: 'Policy delivery meeting completed — in person' },
      { date: 'Apr 3',  icon: 'fa-file-signature',    text: 'Signed delivery receipt captured' },
      { date: 'Apr 3',  icon: 'fa-laptop',            text: 'Client onboarded to NYL portal' },
      { date: 'Apr 10', icon: 'fa-robot',             text: 'AI 7-day check-in sent — no issues reported' }
    ]
  },
  {
    id: 'DEL-R2',
    client: 'James Whitfield', initials: 'JW', age: 52,
    policyId: 'P-100291', product: 'Whole Life (Participating)', carrier: 'New York Life',
    faceAmount: '$500,000', premium: '$12,400/yr', premiumMode: 'Annual',
    issueDate: 'Jan 15, 2026', meetingDate: 'Jan 22, 2026', meetingTime: '3:00 PM',
    meetingType: 'In-Person', location: 'Office — 285 Lexington Ave',
    status: 'delivered', daysOut: null, urgency: 'normal',
    stage: 'Delivered',
    freeLookDays: 30, freeLookDeadline: 'Feb 14, 2026',
    gracePeriodDays: 31,
    crmEntered: true, remindersSet: true, welcomeSent: true, portalOnboarded: true,
    receiptCaptured: true,
    checklistDone: 10, checklistTotal: 10,
    checklist: [
      { key: 'issued',        label: 'Policy package received from carrier',     done: true, required: true  },
      { key: 'docs',          label: 'Policy documents organised',               done: true, required: true  },
      { key: 'ai_brief',      label: 'AI delivery brief generated',              done: true, required: true  },
      { key: 'meeting_sched', label: 'Delivery meeting scheduled',               done: true, required: true  },
      { key: 'premium_coll',  label: 'Initial premium collected',                done: true, required: true  },
      { key: 'review',        label: 'Policy reviewed page-by-page',             done: true, required: true  },
      { key: 'bene_confirm',  label: 'Beneficiary designations confirmed',        done: true, required: true  },
      { key: 'free_look',     label: 'Free-look period explained',               done: true, required: true  },
      { key: 'receipt',       label: 'Signed delivery receipt captured',          done: true, required: true  },
      { key: 'portal',        label: 'Client onboarded to portal',               done: true, required: false }
    ],
    beneficiaries: [
      { role: 'Primary',    name: 'Margaret Whitfield', relation: 'Spouse',         pct: 60,  issues: [] },
      { role: 'Primary',    name: 'Daniel Whitfield',   relation: 'Son (adult)',     pct: 20,  issues: [] },
      { role: 'Primary',    name: 'Claire Whitfield',   relation: 'Daughter (adult)',pct: 20,  issues: [] },
      { role: 'Contingent', name: 'Whitfield Family Trust', relation: 'Trust',      pct: 100, issues: [] }
    ],
    riders: ['Waiver of Premium Rider', 'Paid-Up Additions (PUA) Rider', 'Long-Term Care Rider'],
    anniversaryDate: 'Jan 15 annually',
    reviewDate: 'Jan 2027',
    agent: 'You',
    aiBrief: {
      summary: 'James Whitfield, 52, CEO — all delivery steps complete. High-value client, $12.4K/yr premium, multiple riders, family trust as contingent. Annual review Jan 2027.',
      agenda: [],
      keyPoints: ['All 10 checklist items complete', 'Trust properly named as contingent', 'LTC rider active'],
      objectionScript: '',
      plainEnglishSummary: 'Delivered.',
      freelookNote: 'Free-look period expired Feb 14, 2026.',
      beneficiaryAlert: '',
      postDeliveryCheckin: 'Completed Jan 29 — client emailed with additional PUA questions, responded same day.'
    },
    statusUpdates: [
      { date: 'Jan 15', icon: 'fa-file-alt',       text: 'Policy P-100291 issued — Whole Life Participating' },
      { date: 'Jan 22', icon: 'fa-handshake',      text: 'Delivery meeting completed — in person' },
      { date: 'Jan 22', icon: 'fa-file-signature', text: 'Signed delivery receipt on file' },
      { date: 'Jan 29', icon: 'fa-robot',          text: '7-day check-in: client asked about PUA projections — answered' }
    ]
  }
];

var p6PortalSteps = [
  { step: 1, icon: 'fa-envelope',    title: 'Send Welcome Email',        desc: 'Personalised onboarding email with login credentials and portal tour link', time: '2 min' },
  { step: 2, icon: 'fa-key',         title: 'Activate Portal Account',   desc: 'Client activates account via email link — sets password and security questions', time: '5 min' },
  { step: 3, icon: 'fa-mobile-alt',  title: 'Download Mobile App',       desc: 'Guide client to download NYL mobile app — iOS and Android', time: '3 min' },
  { step: 4, icon: 'fa-file-alt',    title: 'View Policy Documents',     desc: 'Show client how to access policy contract, summary, and benefit illustrations', time: '5 min' },
  { step: 5, icon: 'fa-dollar-sign', title: 'Set Up Premium Payments',   desc: 'Configure auto-pay from bank account or credit card — show payment history', time: '5 min' },
  { step: 6, icon: 'fa-bell',        title: 'Enable Notifications',      desc: 'Turn on payment reminders, anniversary alerts, and policy update notifications', time: '2 min' },
  { step: 7, icon: 'fa-phone-alt',   title: 'Save Agent Contact Info',   desc: 'Ensure agent phone/email saved in portal for direct contact', time: '1 min' }
];

var p6ReminderTypes = [
  { key: 'anniversary', label: 'Policy Anniversary',     icon: 'fa-birthday-cake', color: '#3b82f6', desc: 'Annual reminder 30 days before policy anniversary date' },
  { key: 'renewal',     label: 'Renewal/Premium Due',    icon: 'fa-dollar-sign',   color: '#059669', desc: 'Reminder 14 days before annual premium due date' },
  { key: 'review',      label: 'Annual Policy Review',   icon: 'fa-search',        color: '#7c3aed', desc: '12-month review meeting reminder — sent to agent and client' },
  { key: 'freelook',    label: 'Free-Look Follow-Up',    icon: 'fa-undo',          color: '#f59e0b', desc: '7-day and 25-day check-ins during free-look period' },
  { key: 'checkin',     label: 'Post-Delivery Check-In', icon: 'fa-robot',         color: '#0891b2', desc: 'AI-sent 7-day check-in message to client after delivery' }
];

var _p6ActiveDelivery = null;
var _p6ActiveTab      = 'checklist';

/* ── INIT OVERRIDE ────────────────────────────────────────────── */

function initDeliveryPage() {
  p6RenderQueue();
  p6UpdateKPIs();
}

/* ── KPI UPDATE ───────────────────────────────────────────────── */

function p6UpdateKPIs() {
  var pending   = p6Deliveries.filter(function(d){ return d.status === 'ready' || d.status === 'scheduled'; }).length;
  var overdue   = p6Deliveries.filter(function(d){ return d.status === 'overdue'; }).length;
  var delivered = p6Deliveries.filter(function(d){ return d.status === 'delivered'; }).length;
  var freeLook  = p6Deliveries.filter(function(d){ return d.status !== 'delivered' && d.freeLookDays > 0; }).length;

  var kpiEl = document.getElementById('p6-kpi-strip');
  if (!kpiEl) return;
  kpiEl.innerHTML =
    _p6KpiCard('fa-clock',            'Pending Delivery', pending,   '#ea580c', '#fff7ed', "filterDeliveries('pending')") +
    _p6KpiCard('fa-exclamation-triangle','Overdue (&gt;7d)', overdue, '#dc2626', '#fef2f2', "filterDeliveries('overdue')") +
    _p6KpiCard('fa-check-double',     'Delivered YTD',    delivered, '#003087', '#eff6ff', "filterDeliveries('delivered')") +
    _p6KpiCard('fa-undo',             'Free-Look Active', freeLook,  '#7c3aed', '#f5f3ff', '');
}

function _p6KpiCard(icon, label, val, color, bg, onclick) {
  return '<div class="p6-kpi-card"' + (onclick ? ' onclick="' + onclick + '"' : '') + ' style="cursor:' + (onclick ? 'pointer' : 'default') + '">' +
    '<div class="p6-kpi-icon" style="background:' + bg + ';color:' + color + '"><i class="fas ' + icon + '"></i></div>' +
    '<div class="p6-kpi-body"><div class="p6-kpi-val" style="color:' + color + '">' + val + '</div><div class="p6-kpi-lbl">' + label + '</div></div>' +
  '</div>';
}

/* ── RENDER QUEUE ─────────────────────────────────────────────── */

function p6RenderQueue() {
  var el = document.getElementById('p6-queue');
  if (!el) return;

  var overdue   = p6Deliveries.filter(function(d){ return d.status === 'overdue'; });
  var ready     = p6Deliveries.filter(function(d){ return d.status === 'ready'; });
  var scheduled = p6Deliveries.filter(function(d){ return d.status === 'scheduled'; });
  var delivered = p6Deliveries.filter(function(d){ return d.status === 'delivered'; });

  var html = '';

  if (overdue.length) {
    html += '<div class="p6-section-hdr p6-section-urgent"><i class="fas fa-fire"></i> Overdue — Act Now</div>';
    overdue.forEach(function(d){ html += p6RenderCard(d); });
  }

  if (ready.length) {
    html += '<div class="p6-section-hdr"><i class="fas fa-hourglass-half" style="color:#ea580c"></i> Ready for Delivery</div>';
    ready.forEach(function(d){ html += p6RenderCard(d); });
  }

  if (scheduled.length) {
    html += '<div class="p6-section-hdr"><i class="fas fa-calendar-check" style="color:#059669"></i> Scheduled</div>';
    scheduled.forEach(function(d){ html += p6RenderCard(d); });
  }

  if (delivered.length) {
    html += '<div class="p6-section-hdr" style="margin-top:8px"><i class="fas fa-check-double" style="color:#059669"></i> Recently Delivered</div>';
    delivered.forEach(function(d){ html += p6RenderCard(d); });
  }

  el.innerHTML = html;
}

function p6RenderCard(d) {
  var pct  = Math.round((d.checklistDone / d.checklistTotal) * 100);
  var done = d.checklistDone;
  var tot  = d.checklistTotal;

  var pillCls = { ready: 'p6-pill-ready', scheduled: 'p6-pill-scheduled', overdue: 'p6-pill-overdue', delivered: 'p6-pill-delivered' };
  var pillTxt = {
    ready:     'Ready',
    scheduled: '<i class="fas fa-calendar-check"></i> ' + d.meetingDate,
    overdue:   '<i class="fas fa-fire"></i> ' + Math.abs(d.daysOut) + 'd Overdue',
    delivered: '<i class="fas fa-check-double"></i> Delivered'
  };

  var beneAlert = d.beneficiaries.some(function(b){ return b.issues && b.issues.length > 0; });
  var noContingent = !d.beneficiaries.some(function(b){ return b.role === 'Contingent'; });
  var beneWarn = (beneAlert || noContingent) && d.status !== 'delivered';

  var badges = '';
  if (d.status === 'overdue') badges += '<span class="p6-badge p6-badge-urgent"><i class="fas fa-fire"></i> Urgent</span>';
  if (beneWarn)               badges += '<span class="p6-badge p6-badge-warn"><i class="fas fa-exclamation-triangle"></i> Bene Alert</span>';
  if (!d.crmEntered && d.status !== 'delivered') badges += '<span class="p6-badge p6-badge-info"><i class="fas fa-database"></i> CRM Pending</span>';

  var cardCls = 'p6-card' + (d.status === 'overdue' ? ' p6-card-overdue' : d.status === 'delivered' ? ' p6-card-done' : ' p6-card-ready');
  var isActive = _p6ActiveDelivery === d.id ? ' p6-card-active' : '';

  return '<div class="' + cardCls + isActive + '" onclick="p6OpenDelivery(\'' + d.id + '\')">' +
    '<div class="p6-card-top">' +
      '<div class="p6-card-avatar p6-av-' + d.initials.toLowerCase() + '">' + d.initials + '</div>' +
      '<div class="p6-card-meta">' +
        '<div class="p6-card-name">' + d.client + '</div>' +
        '<div class="p6-card-pol">' + d.policyId + ' · ' + d.product + ' ' + d.faceAmount + '</div>' +
      '</div>' +
      '<span class="p6-status-pill ' + (pillCls[d.status] || '') + '">' + pillTxt[d.status] + '</span>' +
    '</div>' +
    (badges ? '<div class="p6-card-badges">' + badges + '</div>' : '') +
    '<div class="p6-card-prog-row">' +
      '<div class="p6-card-prog-track"><div class="p6-card-prog-fill" style="width:' + pct + '%;background:' + (pct === 100 ? '#059669' : d.status === 'overdue' ? '#dc2626' : '#3b82f6') + '"></div></div>' +
      '<span class="p6-card-prog-lbl">' + done + '/' + tot + ' steps</span>' +
    '</div>' +
    '<div class="p6-card-footer">' +
      '<span class="p6-card-premium">' + d.premium + '</span>' +
      (d.status === 'overdue'
        ? '<button class="p6-card-btn p6-card-btn-urgent" onclick="event.stopPropagation();p6ScheduleDelivery(\'' + d.id + '\')"><i class="fas fa-calendar-plus"></i> Schedule Now</button>'
        : d.status === 'delivered'
        ? '<button class="p6-card-btn p6-card-btn-ghost" onclick="event.stopPropagation();p6OpenDelivery(\'' + d.id + '\')"><i class="fas fa-eye"></i> View Record</button>'
        : '<button class="p6-card-btn p6-card-btn-ai" onclick="event.stopPropagation();p6OpenBrief(\'' + d.id + '\')"><i class="fas fa-robot"></i> AI Brief</button>') +
    '</div>' +
  '</div>';
}

/* ── OPEN / CLOSE DELIVERY DETAIL ─────────────────────────────── */

function p6OpenDelivery(id) {
  var d = p6Deliveries.find(function(x){ return x.id === id; });
  if (!d) return;
  _p6ActiveDelivery = id;
  _p6ActiveTab = 'checklist';
  p6RenderQueue(); // refresh active state
  p6RenderDetailPanel(d);
}

function p6RenderDetailPanel(d) {
  var empty = document.getElementById('del-detail-empty');
  var panel = document.getElementById('del-detail-panel');
  if (empty) empty.style.display = 'none';
  if (!panel) return;
  panel.style.display = '';
  panel.innerHTML = p6BuildDetailHTML(d);
}

function p6BuildDetailHTML(d) {
  var pct      = Math.round((d.checklistDone / d.checklistTotal) * 100);
  var statusCls = { ready: 'p6-pill-ready', scheduled: 'p6-pill-scheduled', overdue: 'p6-pill-overdue', delivered: 'p6-pill-delivered' };
  var statusTxt = { ready: 'Ready', scheduled: 'Scheduled', overdue: 'Overdue', delivered: 'Delivered' };

  var tabs = [
    { key: 'checklist',   icon: 'fa-tasks',         label: 'Checklist (' + d.checklistDone + '/' + d.checklistTotal + ')' },
    { key: 'brief',       icon: 'fa-robot',         label: 'AI Brief' },
    { key: 'beneficiary', icon: 'fa-user-shield',   label: 'Beneficiaries' },
    { key: 'crm',         icon: 'fa-database',      label: 'CRM & Reminders' },
    { key: 'portal',      icon: 'fa-laptop',        label: 'Portal Onboarding' }
  ];

  var tabBtns = tabs.map(function(t) {
    return '<button class="p6-tab-btn' + (t.key === _p6ActiveTab ? ' active' : '') + '" onclick="p6SwitchTab(\'' + t.key + '\',this)"><i class="fas ' + t.icon + '"></i> ' + t.label + '</button>';
  }).join('');

  var tabPanels = '';

  // ── TAB: CHECKLIST ──────────────────────────────────────────
  var clHtml = d.checklist.map(function(c, i) {
    return '<div class="p6-check-row ' + (c.done ? 'done' : '') + '" onclick="p6ToggleCheck(\'' + d.id + '\',' + i + ',this)">' +
      '<i class="fas ' + (c.done ? 'fa-check-square' : 'fa-square') + ' p6-check-icon"></i>' +
      '<span class="p6-check-label">' + c.label + '</span>' +
      (c.required ? '' : '<span class="p6-check-optional">optional</span>') +
    '</div>';
  }).join('');

  var clActions = d.status === 'delivered' ? '' :
    '<div class="p6-det-actions">' +
      (d.status === 'overdue'
        ? '<button class="btn btn-danger" onclick="p6ScheduleDelivery(\'' + d.id + '\')"><i class="fas fa-calendar-plus"></i> Schedule Now</button>'
        : '<button class="btn btn-outline" onclick="p6ScheduleDelivery(\'' + d.id + '\')"><i class="fas fa-calendar-plus"></i> Schedule Meeting</button>') +
      '<button class="btn btn-primary" onclick="p6CaptureReceipt(\'' + d.id + '\')"><i class="fas fa-file-signature"></i> Capture Signed Receipt</button>' +
    '</div>';

  tabPanels += '<div id="p6-tab-checklist" class="p6-tab-panel" style="display:' + (_p6ActiveTab === 'checklist' ? '' : 'none') + '">' +
    '<div class="p6-prog-row">' +
      '<div class="p6-prog-track"><div class="p6-prog-fill" style="width:' + pct + '%;background:' + (pct === 100 ? '#059669' : d.status === 'overdue' ? '#dc2626' : '#3b82f6') + '"></div></div>' +
      '<span class="p6-prog-lbl">' + pct + '% complete</span>' +
    '</div>' +
    '<div class="p6-checklist">' + clHtml + '</div>' +
    clActions +
  '</div>';

  // ── TAB: AI BRIEF ────────────────────────────────────────────
  var agendaHtml = d.aiBrief.agenda.length
    ? '<div class="p6-brief-section"><div class="p6-brief-title"><i class="fas fa-list-ol"></i> Delivery Meeting Agenda</div><ol class="p6-agenda-list">' +
        d.aiBrief.agenda.map(function(a){ return '<li class="p6-agenda-item' + (a.indexOf('⚡') >= 0 ? ' urgent' : '') + '">' + a + '</li>'; }).join('') +
      '</ol></div>' : '';

  var kpHtml = d.aiBrief.keyPoints.length
    ? '<div class="p6-brief-section"><div class="p6-brief-title"><i class="fas fa-lightbulb"></i> Key Points to Cover</div><ul class="p6-keypts-list">' +
        d.aiBrief.keyPoints.map(function(p){ return '<li class="p6-keypt' + (p.indexOf('⚡') >= 0 ? ' urgent' : '') + '">' + p + '</li>'; }).join('') +
      '</ul></div>' : '';

  var objHtml = d.aiBrief.objectionScript
    ? '<div class="p6-brief-section"><div class="p6-brief-title"><i class="fas fa-comments"></i> Objection Script</div><div class="p6-objection-card">' + d.aiBrief.objectionScript + '</div></div>'
    : '';

  var peHtml = d.aiBrief.plainEnglishSummary
    ? '<div class="p6-brief-section p6-pe-section"><div class="p6-brief-title"><i class="fas fa-align-left"></i> Plain-English Policy Summary <span class="p6-ai-chip">AI Generated · Share with Client</span></div>' +
        '<div class="p6-pe-card">' + d.aiBrief.plainEnglishSummary + '</div>' +
        '<button class="p6-pe-copy-btn" onclick="p6CopyPESummary(\'' + d.id + '\')"><i class="fas fa-copy"></i> Copy & Send to Client</button>' +
      '</div>'
    : '';

  var flHtml = d.aiBrief.freelookNote
    ? '<div class="p6-brief-section p6-freelook-section"><div class="p6-brief-title"><i class="fas fa-undo"></i> Free-Look Period Note</div>' +
        '<div class="p6-freelook-card' + (d.status === 'overdue' ? ' urgent' : '') + '">' + d.aiBrief.freelookNote + '</div>' +
      '</div>'
    : '';

  var checkinHtml = d.aiBrief.postDeliveryCheckin
    ? '<div class="p6-brief-section"><div class="p6-brief-title"><i class="fas fa-robot"></i> Post-Delivery AI Check-In</div>' +
        '<div class="p6-checkin-card"><i class="fas fa-robot p6-checkin-icon"></i><div>' + d.aiBrief.postDeliveryCheckin + '</div></div>' +
        (d.status !== 'delivered' ? '<button class="p6-checkin-btn" onclick="p6ScheduleCheckin(\'' + d.id + '\')"><i class="fas fa-clock"></i> Schedule AI Check-In</button>' : '') +
      '</div>'
    : '';

  tabPanels += '<div id="p6-tab-brief" class="p6-tab-panel" style="display:' + (_p6ActiveTab === 'brief' ? '' : 'none') + '">' +
    '<div class="p6-brief-summary"><i class="fas fa-robot p6-brief-bot-icon"></i><div>' + d.aiBrief.summary + '</div></div>' +
    agendaHtml + kpHtml + objHtml + peHtml + flHtml + checkinHtml +
  '</div>';

  // ── TAB: BENEFICIARIES ───────────────────────────────────────
  var beneHtml = d.beneficiaries.map(function(b) {
    var issueHtml = b.issues && b.issues.length
      ? '<div class="p6-bene-issue"><i class="fas fa-exclamation-triangle"></i> ' + b.issues.join(' · ') + '</div>'
      : '';
    return '<div class="p6-bene-row' + (b.issues && b.issues.length ? ' p6-bene-warn' : '') + '">' +
      '<span class="p6-bene-role ' + (b.role === 'Primary' ? 'primary' : 'contingent') + '">' + b.role + '</span>' +
      '<span class="p6-bene-name">' + b.name + '</span>' +
      '<span class="p6-bene-rel">' + b.relation + '</span>' +
      '<span class="p6-bene-pct">' + b.pct + '%</span>' +
      issueHtml +
    '</div>';
  }).join('');

  var beneAlerts = [];
  if (!d.beneficiaries.some(function(b){ return b.role === 'Contingent'; }))
    beneAlerts.push('No contingent beneficiary — if primary predeceases insured, benefit passes through estate.');
  d.beneficiaries.forEach(function(b){ if (b.issues) b.issues.forEach(function(i){ beneAlerts.push(i); }); });

  var aiAlertHtml = d.aiBrief.beneficiaryAlert
    ? '<div class="p6-bene-ai-alert"><i class="fas fa-robot"></i> <strong>AI Beneficiary Check:</strong> ' + d.aiBrief.beneficiaryAlert + '</div>'
    : (beneAlerts.length
        ? '<div class="p6-bene-ai-alert warn"><i class="fas fa-exclamation-triangle"></i> <strong>AI Flag:</strong> ' + beneAlerts[0] + '</div>'
        : '<div class="p6-bene-ai-alert ok"><i class="fas fa-check-circle"></i> <strong>AI Beneficiary Check:</strong> All designations appear complete and legally valid.</div>');

  tabPanels += '<div id="p6-tab-beneficiary" class="p6-tab-panel" style="display:' + (_p6ActiveTab === 'beneficiary' ? '' : 'none') + '">' +
    '<div class="p6-bene-table">' + beneHtml + '</div>' +
    aiAlertHtml +
    (d.status !== 'delivered'
      ? '<div class="p6-det-actions"><button class="btn btn-outline" onclick="p6EditBeneficiaries(\'' + d.id + '\')"><i class="fas fa-edit"></i> Edit Beneficiaries</button></div>'
      : '') +
  '</div>';

  // ── TAB: CRM & REMINDERS ─────────────────────────────────────
  var crmFields = [
    { label: 'Policy Number',    val: d.policyId,         done: true  },
    { label: 'Face Amount',      val: d.faceAmount,        done: true  },
    { label: 'Annual Premium',   val: d.premium,           done: true  },
    { label: 'Premium Mode',     val: d.premiumMode,       done: true  },
    { label: 'Riders',           val: d.riders.length ? d.riders.join(', ') : 'None', done: true },
    { label: 'Issue Date',       val: d.issueDate,         done: true  },
    { label: 'Anniversary Date', val: d.anniversaryDate,   done: true  },
    { label: 'CRM Entry Status', val: d.crmEntered ? 'Entered ✓' : '⚠ Pending entry', done: d.crmEntered }
  ];

  var crmHtml = crmFields.map(function(f) {
    return '<div class="p6-crm-row ' + (f.done ? 'done' : 'pending') + '">' +
      '<span class="p6-crm-label">' + f.label + '</span>' +
      '<span class="p6-crm-val">' + f.val + '</span>' +
    '</div>';
  }).join('');

  var remHtml = p6ReminderTypes.map(function(r) {
    return '<div class="p6-reminder-row ' + (d.remindersSet ? 'set' : 'pending') + '">' +
      '<div class="p6-reminder-icon" style="color:' + r.color + '"><i class="fas ' + r.icon + '"></i></div>' +
      '<div class="p6-reminder-body">' +
        '<div class="p6-reminder-label">' + r.label + '</div>' +
        '<div class="p6-reminder-desc">' + r.desc + '</div>' +
      '</div>' +
      '<span class="p6-reminder-status ' + (d.remindersSet ? 'set' : 'pending') + '">' + (d.remindersSet ? '<i class="fas fa-check"></i> Set' : 'Pending') + '</span>' +
    '</div>';
  }).join('');

  var welcomeHtml = '<div class="p6-welcome-row ' + (d.welcomeSent ? 'done' : '') + '">' +
    '<i class="fas fa-envelope p6-welcome-icon"></i>' +
    '<div class="p6-welcome-body">' +
      '<div class="p6-welcome-label">Welcome Letter / Onboarding Email</div>' +
      '<div class="p6-welcome-desc">Personalised welcome message with policy summary, agent contact, and portal login link</div>' +
    '</div>' +
    '<span class="p6-welcome-status ' + (d.welcomeSent ? 'done' : 'pending') + '">' + (d.welcomeSent ? '<i class="fas fa-check-circle"></i> Sent' : 'Not Sent') + '</span>' +
  '</div>';

  tabPanels += '<div id="p6-tab-crm" class="p6-tab-panel" style="display:' + (_p6ActiveTab === 'crm' ? '' : 'none') + '">' +
    '<div class="p6-crm-section-title"><i class="fas fa-database"></i> CRM Policy Entry</div>' +
    '<div class="p6-crm-table">' + crmHtml + '</div>' +
    (d.status !== 'delivered'
      ? '<button class="p6-crm-btn" onclick="p6EnterCRM(\'' + d.id + '\')"><i class="fas fa-database"></i> ' + (d.crmEntered ? 'Update CRM Record' : 'Enter Policy in CRM') + '</button>'
      : '') +
    '<div class="p6-crm-section-title" style="margin-top:20px"><i class="fas fa-bell"></i> Automated Service Reminders</div>' +
    '<div class="p6-reminders-list">' + remHtml + '</div>' +
    (d.status !== 'delivered'
      ? '<button class="p6-crm-btn" onclick="p6SetReminders(\'' + d.id + '\')"><i class="fas fa-bell"></i> ' + (d.remindersSet ? 'Reminders Active' : 'Activate All Reminders') + '</button>'
      : '') +
    '<div class="p6-crm-section-title" style="margin-top:20px"><i class="fas fa-envelope"></i> Welcome & Onboarding</div>' +
    welcomeHtml +
    (d.status !== 'delivered'
      ? '<button class="p6-crm-btn" onclick="p6SendWelcome(\'' + d.id + '\')"><i class="fas fa-paper-plane"></i> ' + (d.welcomeSent ? 'Resend Welcome Email' : 'Send Welcome Email') + '</button>'
      : '') +
  '</div>';

  // ── TAB: PORTAL ONBOARDING ────────────────────────────────────
  var portalStepsHtml = p6PortalSteps.map(function(s, i) {
    var isDone = d.portalOnboarded || (d.status === 'delivered');
    return '<div class="p6-portal-step ' + (isDone ? 'done' : i === 0 ? 'active' : '') + '">' +
      '<div class="p6-portal-step-num">' + (isDone ? '<i class="fas fa-check"></i>' : s.step) + '</div>' +
      '<div class="p6-portal-step-body">' +
        '<div class="p6-portal-step-icon" style="color:' + (isDone ? '#059669' : '#3b82f6') + '"><i class="fas ' + s.icon + '"></i></div>' +
        '<div class="p6-portal-step-content">' +
          '<div class="p6-portal-step-title">' + s.title + '</div>' +
          '<div class="p6-portal-step-desc">' + s.desc + '</div>' +
        '</div>' +
        '<span class="p6-portal-step-time">' + s.time + '</span>' +
      '</div>' +
    '</div>';
  }).join('');

  var portalStatus = d.portalOnboarded
    ? '<div class="p6-portal-status-banner done"><i class="fas fa-check-circle"></i> Client successfully onboarded to portal and mobile app</div>'
    : '<div class="p6-portal-status-banner pending"><i class="fas fa-hourglass-half"></i> Portal onboarding pending — total time: ~23 minutes</div>';

  tabPanels += '<div id="p6-tab-portal" class="p6-tab-panel" style="display:' + (_p6ActiveTab === 'portal' ? '' : 'none') + '">' +
    portalStatus +
    '<div class="p6-portal-ai-guide"><i class="fas fa-robot"></i> <strong>AI Portal Guide:</strong> AI walks the client through each step with a personalised tutorial tailored to ' + d.client + '\'s policy type and tech comfort level.</div>' +
    '<div class="p6-portal-steps">' + portalStepsHtml + '</div>' +
    (d.status !== 'delivered'
      ? '<div class="p6-det-actions">' +
          '<button class="btn btn-outline" onclick="p6SendWelcome(\'' + d.id + '\')"><i class="fas fa-envelope"></i> Send Welcome Email</button>' +
          '<button class="btn btn-primary" onclick="p6LaunchPortalOnboarding(\'' + d.id + '\')"><i class="fas fa-laptop"></i> ' + (d.portalOnboarded ? 'Re-run Onboarding' : 'Launch Portal Onboarding') + '</button>' +
        '</div>'
      : '') +
  '</div>';

  // ── TIMELINE / HISTORY ────────────────────────────────────────
  var timelineHtml = d.statusUpdates.map(function(u, i) {
    return '<div class="p6-timeline-row ' + (i === 0 ? 'latest' : '') + '">' +
      '<div class="p6-timeline-dot"><i class="fas ' + u.icon + '"></i></div>' +
      '<div class="p6-timeline-body">' +
        '<span class="p6-timeline-date">' + u.date + '</span>' +
        '<span class="p6-timeline-text">' + u.text + '</span>' +
      '</div>' +
    '</div>';
  }).join('');

  return '<div class="p6-detail-wrap">' +

    // Header
    '<div class="p6-det-header">' +
      '<div class="p6-det-avatar p6-av-' + d.initials.toLowerCase() + '">' + d.initials + '</div>' +
      '<div class="p6-det-header-body">' +
        '<div class="p6-det-name">' + d.client + ' <span style="font-size:13px;color:#64748b">Age ' + d.age + '</span></div>' +
        '<div class="p6-det-pol">' + d.policyId + ' · ' + d.product + ' · ' + d.faceAmount + ' · ' + d.premium + '</div>' +
        '<div class="p6-det-meta">' +
          '<span><i class="fas fa-building"></i> ' + d.carrier + '</span>' +
          '<span><i class="fas fa-calendar-alt"></i> Issued: ' + d.issueDate + '</span>' +
          (d.meetingDate !== 'NOT SCHEDULED' ? '<span><i class="fas fa-clock"></i> Meeting: ' + d.meetingDate + (d.meetingTime ? ' · ' + d.meetingTime : '') + '</span>' : '<span style="color:#dc2626"><i class="fas fa-exclamation-circle"></i> Meeting not scheduled</span>') +
        '</div>' +
      '</div>' +
      '<span class="p6-status-pill ' + (statusCls[d.status] || '') + '">' + (statusTxt[d.status] || d.status) + '</span>' +
    '</div>' +

    // Free-look banner for active cases
    (d.status !== 'delivered'
      ? '<div class="p6-freelook-banner ' + (d.status === 'overdue' ? 'urgent' : '') + '">' +
          '<i class="fas fa-undo"></i>' +
          '<div><strong>Free-Look Period:</strong> ' + d.freeLookDays + ' days · Deadline <strong>' + d.freeLookDeadline + '</strong></div>' +
        '</div>'
      : '') +

    // Tabs
    '<div class="p6-tabs">' + tabBtns + '</div>' +
    '<div class="p6-tab-panels">' + tabPanels + '</div>' +

    // Timeline
    '<div class="p6-timeline-section">' +
      '<div class="p6-timeline-title"><i class="fas fa-history"></i> Activity Timeline</div>' +
      '<div class="p6-timeline">' + timelineHtml + '</div>' +
    '</div>' +

  '</div>';
}

/* ── TAB SWITCH ───────────────────────────────────────────────── */

function p6SwitchTab(tab, el) {
  _p6ActiveTab = tab;
  document.querySelectorAll('.p6-tab-btn').forEach(function(b){ b.classList.remove('active'); });
  if (el) el.classList.add('active');
  document.querySelectorAll('.p6-tab-panel').forEach(function(p){ p.style.display = 'none'; });
  var tgt = document.getElementById('p6-tab-' + tab);
  if (tgt) tgt.style.display = '';
}

/* ── CHECKLIST TOGGLE ─────────────────────────────────────────── */

function p6ToggleCheck(id, idx, el) {
  var d = p6Deliveries.find(function(x){ return x.id === id; });
  if (!d) return;
  d.checklist[idx].done = !d.checklist[idx].done;
  d.checklistDone = d.checklist.filter(function(c){ return c.done; }).length;
  el.classList.toggle('done');
  var icon = el.querySelector('.p6-check-icon');
  if (icon) icon.className = 'fas ' + (el.classList.contains('done') ? 'fa-check-square' : 'fa-square') + ' p6-check-icon';
  var progTrack = document.querySelector('.p6-prog-fill');
  if (progTrack) {
    var pct = Math.round((d.checklistDone / d.checklistTotal) * 100);
    progTrack.style.width = pct + '%';
    progTrack.style.background = pct === 100 ? '#059669' : d.status === 'overdue' ? '#dc2626' : '#3b82f6';
  }
  var lbl = document.querySelector('.p6-prog-lbl');
  if (lbl) lbl.textContent = Math.round((d.checklistDone / d.checklistTotal) * 100) + '% complete';
  var tabBtn = document.querySelector('.p6-tab-btn.active');
  if (tabBtn) tabBtn.innerHTML = '<i class="fas fa-tasks"></i> Checklist (' + d.checklistDone + '/' + d.checklistTotal + ')';
  p6UpdateKPIs();
  p6RenderQueue();
}

/* ── SCHEDULE DELIVERY ────────────────────────────────────────── */

function p6ScheduleDelivery(id) {
  var d = p6Deliveries.find(function(x){ return x.id === id; });
  if (!d) return;
  _p6Toast('<i class="fas fa-calendar-plus"></i> Opening calendar to schedule delivery meeting for <strong>' + d.client + '</strong>…', 2500);
  setTimeout(function(){ navigateTo('calendar'); }, 700);
}

/* ── AI BRIEF SHORTCUT ────────────────────────────────────────── */

function p6OpenBrief(id) {
  _p6ActiveTab = 'brief';
  p6OpenDelivery(id);
}

/* ── CAPTURE RECEIPT ──────────────────────────────────────────── */

function p6CaptureReceipt(id) {
  var d = p6Deliveries.find(function(x){ return x.id === id; });
  if (!d) return;
  d.receiptCaptured = true;
  var receiptItem = d.checklist.find(function(c){ return c.key === 'receipt'; });
  if (receiptItem && !receiptItem.done) {
    receiptItem.done = true;
    d.checklistDone++;
  }
  d.statusUpdates.unshift({ date: 'Today', icon: 'fa-file-signature', text: 'Signed delivery receipt captured via DocuSign' });
  _p6Toast('<i class="fas fa-file-signature"></i> <strong>Receipt captured</strong> — DocuSign e-signature workflow sent to ' + d.client + '.', 3000);
  p6OpenDelivery(id);
}

/* ── CRM ENTRY ────────────────────────────────────────────────── */

function p6EnterCRM(id) {
  var d = p6Deliveries.find(function(x){ return x.id === id; });
  if (!d) return;
  d.crmEntered = true;
  var crmItem = d.checklist.find(function(c){ return c.key === 'crm'; });
  if (crmItem && !crmItem.done) { crmItem.done = true; d.checklistDone++; }
  d.statusUpdates.unshift({ date: 'Today', icon: 'fa-database', text: 'Policy entered in CRM — policy number, face amount, premium, riders, anniversary date' });
  _p6Toast('<i class="fas fa-database"></i> <strong>CRM updated</strong> — ' + d.policyId + ' for ' + d.client + ' entered with all policy details.', 3000);
  p6OpenDelivery(id);
}

/* ── SET REMINDERS ────────────────────────────────────────────── */

function p6SetReminders(id) {
  var d = p6Deliveries.find(function(x){ return x.id === id; });
  if (!d) return;
  d.remindersSet = true;
  d.statusUpdates.unshift({ date: 'Today', icon: 'fa-bell', text: 'Automated service reminders activated — anniversary, renewal, review, free-look, check-in' });
  _p6Toast('<i class="fas fa-bell"></i> <strong>Reminders set</strong> — 5 automated reminders activated for ' + d.client + '.', 3000);
  p6OpenDelivery(id);
}

/* ── SEND WELCOME EMAIL ───────────────────────────────────────── */

function p6SendWelcome(id) {
  var d = p6Deliveries.find(function(x){ return x.id === id; });
  if (!d) return;
  d.welcomeSent = true;
  d.statusUpdates.unshift({ date: 'Today', icon: 'fa-envelope', text: 'Welcome & onboarding email sent to ' + d.client });
  _p6Toast('<i class="fas fa-envelope"></i> <strong>Welcome email sent</strong> to ' + d.client + ' — includes policy summary, portal login link, and agent contact.', 3500);
  p6OpenDelivery(id);
}

/* ── PORTAL ONBOARDING ────────────────────────────────────────── */

function p6LaunchPortalOnboarding(id) {
  var d = p6Deliveries.find(function(x){ return x.id === id; });
  if (!d) return;
  d.portalOnboarded = true;
  var portalItem = d.checklist.find(function(c){ return c.key === 'portal'; });
  if (portalItem && !portalItem.done) { portalItem.done = true; d.checklistDone++; }
  d.statusUpdates.unshift({ date: 'Today', icon: 'fa-laptop', text: d.client + ' onboarded to NYL portal — account activated, mobile app installed, auto-pay configured' });
  _p6Toast('<i class="fas fa-laptop"></i> <strong>Portal onboarding complete</strong> — ' + d.client + ' has full access to policy, payments, and documents online.', 3500);
  p6OpenDelivery(id);
}

/* ── SCHEDULE POST-DELIVERY CHECK-IN ─────────────────────────── */

function p6ScheduleCheckin(id) {
  var d = p6Deliveries.find(function(x){ return x.id === id; });
  if (!d) return;
  d.statusUpdates.unshift({ date: '+7 days', icon: 'fa-robot', text: 'AI 7-day check-in scheduled — automated message to ' + d.client });
  _p6Toast('<i class="fas fa-robot"></i> <strong>AI check-in scheduled</strong> — automated 7-day post-delivery message queued for ' + d.client + '.', 3000);
}

/* ── COPY PLAIN-ENGLISH SUMMARY ───────────────────────────────── */

function p6CopyPESummary(id) {
  var d = p6Deliveries.find(function(x){ return x.id === id; });
  if (!d) return;
  _p6Toast('<i class="fas fa-copy"></i> <strong>Plain-English summary copied</strong> — ready to paste into email or text message to ' + d.client + '.', 2500);
}

/* ── EDIT BENEFICIARIES ───────────────────────────────────────── */

function p6EditBeneficiaries(id) {
  _p6Toast('<i class="fas fa-user-shield"></i> Opening beneficiary change form for carrier submission…', 2000);
}

/* ── OPEN DELIVERY BRIEF (global shortcut from JSX buttons) ───── */

function openDeliveryBrief(id) {
  p6OpenBrief(id);
}

/* ── OPEN DELIVERY DETAIL (global shortcut from JSX cards) ───── */

function openDeliveryDetail(id) {
  p6OpenDelivery(id);
}

/* ── FILTER DELIVERIES ────────────────────────────────────────── */

function filterDeliveries(status) {
  var cards = document.querySelectorAll('.p6-card');
  cards.forEach(function(c){ c.style.display = ''; });
  if (status === 'all') return;
  _p6Toast('<i class="fas fa-filter"></i> Showing ' + status + ' deliveries.', 1800);
}

/* ── GLOBAL STUBS (override old stubs) ───────────────────────── */

function scheduleDelivery(id)       { p6ScheduleDelivery(id); }
function captureDeliveryReceipt(id) { p6CaptureReceipt(id); }
function openDeliveryAIPrep()       { p6OpenBrief(p6Deliveries[0] && p6Deliveries[0].id || 'DEL-001'); }
function openNewDelivery()          { _p6Toast('<i class="fas fa-plus"></i> Opening schedule-delivery form…', 1800); }
function editBeneficiaries(id)      { p6EditBeneficiaries(id); }

/* ── TOAST ────────────────────────────────────────────────────── */

function _p6Toast(html, duration) {
  var existing = document.getElementById('p6-toast-el');
  if (existing) existing.remove();
  var el = document.createElement('div');
  el.id = 'p6-toast-el';
  el.className = 'p6-toast';
  el.innerHTML = html;
  document.body.appendChild(el);
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('p6-toast-show'); }); });
  setTimeout(function(){
    el.classList.remove('p6-toast-show');
    setTimeout(function(){ el.remove(); }, 400);
  }, duration || 3000);
}

console.log('[Phase 6] Policy Delivery & Onboarding module ready.');
console.log('  p6Deliveries[5] · p6PortalSteps[7] · p6ReminderTypes[5]');
console.log('  initDeliveryPage(override) · p6RenderQueue · p6OpenDelivery · p6BuildDetailHTML');
console.log('  p6ToggleCheck · p6CaptureReceipt · p6EnterCRM · p6SetReminders · p6SendWelcome');
console.log('  p6LaunchPortalOnboarding · p6CopyPESummary · p6ScheduleCheckin · _p6Toast');
