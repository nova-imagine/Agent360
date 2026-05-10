# Insurance Life Cycle — Full Sales & Servicing Reference

---

## PHASE 1 — PROSPECTING & LEAD IDENTIFICATION

### Agent Activities:
- **1.1** Define target market (age band, income, life event triggers)
- **1.2** Source leads:
  - Referrals from existing clients
  - Employer / worksite marketing
  - LinkedIn / social prospecting
  - Purchased lead lists
  - Networking events, seminars
  - Center of Influence (COI) referrals — CPAs, attorneys
  - Orphaned policy holders (clients whose agent left NYL)
- **1.3** Initial lead qualification (PMAIL: Product, Money, Authority, Insurability, Life event)
- **1.4** Log prospect in CRM, assign follow-up tasks
- **1.5** Initial outreach (call, email, text, LinkedIn)

### Key Data Captured:
- Name, age, contact info
- Estimated income / net worth
- Life event trigger (new baby, divorce, retirement, business sale)
- Referral source
- Product interest (life, disability, annuity, LTC, investment)

### Exit Criteria → move to Phase 2:
> Prospect agrees to a discovery/fact-find meeting

### 🤖 AI Opportunities — Phase 1:
| AI Feature | Description |
|---|---|
| **Lead Scoring** | AI scores each prospect 0–100 on likelihood to buy based on life event, age, income bracket, referral source, similar closed-deal patterns |
| **Best Time to Contact** | ML model predicts optimal call/email window per prospect |
| **Propensity Matching** | "This prospect looks like 47 closed cases — most bought Term + DI combo" |
| **Auto-drafted outreach** | AI writes personalized first email referencing the life trigger |
| **Orphan client identification** | AI surfaces policyholders in the book with no recent contact who are ripe for new needs |

---

## PHASE 2 — DISCOVERY / FACT-FIND

### Agent Activities:
- **2.1** Schedule and conduct fact-find meeting (in-person or virtual)
- **2.2** Complete a Financial Needs Analysis (FNA):
  - Income replacement needs
  - Debt obligations (mortgage, student loans)
  - Final expense / estate needs
  - Business insurance needs (key person, buy-sell)
  - Retirement income gap
  - LTC / disability income needs
- **2.3** Gather personal data:
  - Date of birth, gender, smoking status
  - Health history (major diagnoses, medications, surgeries)
  - Family health history
  - Occupation and hobbies (risk classification factors)
  - Existing coverage (in-force policies with other carriers)
  - Beneficiary intentions
- **2.4** Assess financial suitability:
  - Current savings, 401K, investments
  - Monthly budget for premiums
  - Short-term vs long-term financial goals
- **2.5** Document and confirm the need

### Key Output:
Completed FNA document + recommended coverage amount

### Exit Criteria → move to Phase 3:
> Agent identifies specific product(s) to illustrate; prospect is open to reviewing a proposal

### 🤖 AI Opportunities — Phase 2:
| AI Feature | Description |
|---|---|
| **FNA Auto-population** | Agent speaks or types notes; AI extracts structured data fields automatically |
| **Coverage Gap Calculator** | AI computes the coverage gap in real-time as data is entered — "Based on income and debts, recommend $850K face amount" |
| **Health Pre-screen** | AI flags potential underwriting concerns early ("mention of diabetes + age 58 = likely Table 2–4 rating, set expectations now") |
| **Suitability Check** | AI validates product suitability against FINRA/state rules before the agent even runs an illustration |
| **Meeting Summary** | AI auto-generates a post-meeting summary email to send to the prospect |

---

## PHASE 3 — PRODUCT ILLUSTRATION & PROPOSAL

### Agent Activities:
- **3.1** Select appropriate product(s):
  - Term Life (10/20/30 year)
  - Whole Life (participating, limited pay)
  - Universal Life (GUL, IUL, VUL)
  - Disability Income (DI)
  - Long Term Care (LTC) / hybrid
  - Annuity (fixed, variable, indexed)
  - Group / Worksite
- **3.2** Run illustration software (NYL's proprietary system):
  - Input: age, gender, risk class, face amount, premium
  - Output: projected values, death benefit, cash value growth, dividend projections (for WL), internal rate of return
- **3.3** Compliance review of illustration:
  - Must comply with NAIC Illustration Model Regulation
  - Guaranteed vs non-guaranteed columns
  - Signature pages required
- **3.4** Build a multi-product proposal (often multiple options):
  - Option A: Base term + DI
  - Option B: Whole Life + paid-up additions
  - Option C: IUL with income rider
- **3.5** Present proposal to prospect
- **3.6** Handle objections:
  - Price → adjust face amount or premium
  - Complexity → simplify to one product
  - "Need to think about it" → leave-behind summary
- **3.7** Obtain signed illustration acknowledgment page

### Key Output:
Signed illustration + prospect verbal commitment

### Exit Criteria → move to Phase 4:
> Prospect agrees to apply ("I want to move forward")

### 🤖 AI Opportunities — Phase 3:
| AI Feature | Description |
|---|---|
| **AI Illustration Assistant** | "For a 45-year-old non-smoker needing $500K coverage, here are 3 illustrations ranked by long-term value and premium affordability" |
| **Objection Handling Coach** | Real-time AI prompt cards when an objection is detected — "Prospect said 'too expensive' → suggest 20-year term or reduced paid-up option" |
| **Side-by-Side Comparisons** | AI auto-builds product comparison tables tailored to the specific prospect's profile |
| **Illustration Explainer** | AI generates a plain-English explanation of the illustration for the prospect ("Your guaranteed cash value at age 65 means…") |
| **Compliance Pre-check** | AI scans illustration for NAIC compliance issues before it's shown to the prospect |

---

## PHASE 4 — APPLICATION SUBMISSION

### Agent Activities:
- **4.1** Complete the application (electronic / e-App):
  - Personal information
  - Coverage details (product, face amount, riders)
  - Health questions (Part 1: non-medical)
  - Financial questions (income justification for large amounts)
  - Beneficiary designation (primary + contingent)
  - Payment method and premium mode (annual/monthly/quarterly)
- **4.2** Paramedical exam scheduling (if required by face amount/age):
  - < $1M face / < age 45: often no exam (accelerated underwriting)
  - > $1M or age 50+: full paramed (blood, urine, vitals, EKG)
  - Attending Physician Statement (APS) for health conditions
- **4.3** Financial underwriting documents (if face amount > $1M+):
  - Tax returns, W-2s, financial statements
  - Business financials for key-person/buy-sell
- **4.4** Agent's statement / field underwriting report:
  - Agent's assessment of insurability and financial need
  - Any unusual circumstances or disclosures
- **4.5** Initial premium collection (with application or at delivery)
- **4.6** Submit application to home office / carrier

### Key Output:
Application submitted with case number assigned

### Exit Criteria → move to Phase 5:
> New business case opened; requirements checklist generated

### 🤖 AI Opportunities — Phase 4:
| AI Feature | Description |
|---|---|
| **Smart e-App** | AI pre-fills known fields from the FNA and CRM data — agent only reviews, doesn't re-enter |
| **Good Order Check** | AI validates application completeness before submission — "Missing beneficiary date of birth — this will cause a requirement" |
| **Exam Scheduler** | AI automatically schedules paramed exam based on prospect's calendar availability and nearest exam vendor |
| **Accelerated UW Eligibility** | AI predicts in real time whether the case qualifies for no-exam processing ("87% probability of straight-through processing based on health answers") |
| **APS Prediction** | AI flags which health conditions will trigger APS orders so agent can set timeline expectations |
| **Financial Justification Builder** | AI drafts the financial justification narrative for large face amounts |

---

## PHASE 5 — UNDERWRITING

### Underwriter / Case Manager Activities:
- **5.1** Application received and case opened in UW system
- **5.2** Requirements checklist auto-generated:
  - Paramed results
  - APS orders (sent to treating physicians)
  - Lab results (blood profile, urinalysis)
  - MVR (Motor Vehicle Report)
  - MIB (Medical Information Bureau) check
  - Financial documents (if applicable)
  - Prescription drug database check (Rx check)
- **5.3** Medical underwriting:
  - Review all labs and APS
  - Mortality risk classification:
    - Preferred Plus / Preferred / Standard Plus / Standard
    - Table 2 / Table 4 / Table 6 / Table 8 (rated)
    - Flat Extra ($/1000 surcharge for specific conditions)
    - Declined
- **5.4** Financial underwriting:
  - Confirm insurable interest
  - Verify income multiple justification
  - Anti-money laundering (AML) screening
  - OFAC check (Office of Foreign Assets Control)
- **5.5** Underwriter decision:
  - Approved as applied
  - Approved with modification (rated, reduced face)
  - Counter-offer
  - Postponed (pending surgery, recent diagnosis)
  - Declined
- **5.6** If approved: Policy issued, documents generated
- **5.7** If modified: Offer communicated to agent → agent presents to applicant → applicant accepts or appeals
- **5.8** If declined: Decline letter with reason (vague per regulations)

### Key Output:
Underwriting decision + policy ready to issue (if approved)

### Exit Criteria → move to Phase 6:
> Applicant accepts the offer; delivery requirements met

### 🤖 AI Opportunities — Phase 5:
| AI Feature | Description |
|---|---|
| **Predictive Risk Scoring** | AI scores mortality/morbidity risk from structured app data before labs arrive — "This case has a 73% probability of Standard rating based on BMI, Rx history, and age" |
| **APS Triage** | AI reads APS documents (often 50–200 pages) and extracts relevant diagnoses, medications, dates, and physician notes — underwriter reviews a 1-page AI summary instead of 150 pages |
| **Automated STP** | For low-risk cases, AI approves at Preferred/Standard without human UW review — common for <$1M accelerated UW |
| **Requirement Gap Detection** | AI identifies missing requirements in real time and auto-sends request letters to physicians/applicants |
| **Rating Recommendation Engine** | AI suggests the mortality table classification with supporting evidence citations from the medical records |
| **Fraud Detection** | AI flags patterns inconsistent with the financial justification or suspicious application timing (e.g., recent medical diagnosis + large face amount) |
| **Case Status Updates** | AI sends automated status updates to the agent ("APS received from Dr. Smith; estimated review complete by Tuesday") |

---

## PHASE 6 — POLICY DELIVERY & ONBOARDING

### Agent Activities:
- **6.1** Receive issued policy package from carrier
- **6.2** Schedule policy delivery meeting with client
- **6.3** Policy delivery meeting:
  - Review policy contract page by page
  - Confirm beneficiary designations are correct
  - Explain premium schedule and payment method
  - Explain free-look period (10–30 days to cancel)
  - Explain grace period (30–31 days for missed payment)
  - Collect initial premium (if not collected at application)
  - Obtain signed delivery receipt
  - Leave policy folder / binder with client
- **6.4** Enter policy into CRM (policy number, face amount, premium, riders, issue date, anniversary date)
- **6.5** Set up automated service reminders (anniversary, renewal, review)
- **6.6** Welcome letter / onboarding email sent to client
- **6.7** Introduce client to online portal / mobile app

### Key Output:
Delivered policy + signed delivery receipt + client onboarded to portal

### Exit Criteria → move to Phase 7:
> Policy active; first premium paid; delivery receipt on file

### 🤖 AI Opportunities — Phase 6:
| AI Feature | Description |
|---|---|
| **Policy Delivery Prep** | AI generates a personalized delivery meeting agenda and client-facing summary ("Here's what to review with James Whitfield at today's delivery meeting") |
| **Plain-English Policy Summary** | AI translates the policy contract into a simple 1-page explainer the client can actually read |
| **Beneficiary Validation** | AI checks that beneficiary designations are legally complete and flags common errors (no contingent, minor as primary) |
| **Portal Onboarding Guide** | AI walks the client through their online portal with a personalized tutorial |
| **Post-Delivery AI Check-in** | 7-day automated AI message to client: "Do you have any questions about your new policy?" — flags responses for agent follow-up |

---

## PHASE 7 — POLICY SERVICING (Ongoing)

> This is the longest phase — a policy can be in-force for 30–50+ years.

### 7A. ROUTINE SERVICING
- **7A.1** Premium payment processing (monthly auto-pay, lapse prevention)
- **7A.2** Annual policy review meetings
- **7A.3** Address changes, phone/email updates
- **7A.4** Dividend election changes (for Whole Life):
  - Accumulate at interest
  - Apply to reduce premium
  - Purchase paid-up additions (PUAs)
  - Take as cash
- **7A.5** Premium mode changes (annual → monthly → quarterly)
- **7A.6** Reinstatement (after lapse — within 3–5 years with evidence of insurability)

### 7B. BENEFICIARY CHANGES
- **7B.1** Add / remove / change primary beneficiary
- **7B.2** Add / remove / change contingent beneficiary
- **7B.3** Irrevocable beneficiary changes (requires beneficiary consent)
- **7B.4** Trust as beneficiary setup
- **7B.5** Minor beneficiary → trustee designation

### 7C. COVERAGE CHANGES
- **7C.1** Face amount increases (requires new underwriting if significant)
- **7C.2** Face amount decreases / partial surrender
- **7C.3** Rider additions:
  - Waiver of Premium (WOP)
  - Accidental Death Benefit (ADB)
  - Child Term rider
  - Long Term Care rider
  - Accelerated Death Benefit (ADB/ADBR)
- **7C.4** Rider removals
- **7C.5** Conversion: Term → Permanent (no new underwriting within conversion privilege)
- **7C.6** Extended Term / Reduced Paid-Up (non-forfeiture options when premium stops)

### 7D. LOAN & CASH VALUE TRANSACTIONS
- **7D.1** Policy loan request (borrow against CSV)
- **7D.2** Policy loan repayment
- **7D.3** Partial withdrawal (UL/VUL/IUL)
- **7D.4** Full surrender (policy terminated, CSV paid minus loans and surrender charges)
- **7D.5** 1035 Exchange (tax-free transfer to new policy)

### 7E. OWNERSHIP & ASSIGNMENT CHANGES
- **7E.1** Ownership transfer (individual → trust, individual → individual, e.g., divorce)
- **7E.2** Absolute assignment (collateral for loan)
- **7E.3** Business ownership changes (buy-sell funding)

### 7F. LAPSE MANAGEMENT & RETENTION
- **7F.1** Premium reminder outreach (30/60/90 days)
- **7F.2** Grace period management
- **7F.3** Automatic Premium Loan (APL) activation
- **7F.4** Reinstatement processing

### 7G. CLAIMS PROCESSING
- **7G.1** Death claim:
  - Claimant notifies carrier
  - Proof of death (death certificate)
  - Proof of identity of claimant
  - Claim form completion
  - Contestability review (< 2 years from issue)
  - Investigation (if suspicious circumstances)
  - Payment to beneficiary (lump sum or settlement options)
- **7G.2** Living benefit claims:
  - Accelerated Death Benefit (terminal illness)
  - Chronic illness benefit
  - Long-term care benefit
  - Disability waiver of premium
- **7G.3** Claim appeal process

### 🤖 AI Opportunities — Phase 7:
| AI Feature | Phase | Description |
|---|---|---|
| **Lapse Prediction** | 7F | AI scores every in-force policy monthly on lapse risk — "Patricia Nguyen's UL has a 78% lapse probability in next 90 days due to cash value erosion" → triggers agent outreach |
| **Policy Review Assistant** | 7A | Before annual review meetings, AI generates a full brief: what changed in the client's life, what the policy is doing, what to recommend this year |
| **Beneficiary Audit** | 7B | AI scans book of business and flags policies where beneficiary designations are outdated (e.g., ex-spouse still named, deceased beneficiary, minor child with no trust) |
| **Conversion Opportunity** | 7C | AI identifies term policies approaching end of conversion window — "Robert Chen's 20-year term expires in 14 months; conversion conversation needed now" |
| **Premium Change Modeling** | 7A | Client asks "what if I increase my premium by $200/month?" — AI instantly models the impact on cash value, paid-up date, retirement income |
| **1035 Exchange Analysis** | 7D | AI identifies in-force policies that would benefit from a 1035 exchange into a newer, better-performing product |
| **Claims Navigator** | 7G | AI guides beneficiary through claim submission step-by-step; pre-fills forms; tracks document receipt; provides status updates |
| **ADB Eligibility Screener** | 7G | AI screens policyholder health events against accelerated death benefit eligibility criteria and alerts agent proactively |

---

## 🔄 END-TO-END FLOW DIAGRAM

```
PROSPECT
   │
   ▼
[1. PROSPECTING] ──────────────────── AI: Lead scoring, propensity match,
   │                                       outreach drafting
   ▼
[2. DISCOVERY / FNA] ──────────────── AI: FNA auto-fill, coverage gap calc,
   │                                       health pre-screen, suitability check
   ▼
[3. ILLUSTRATION] ─────────────────── AI: Product recommendation, objection
   │                                       coaching, compliance pre-check
   ▼
[4. APPLICATION] ──────────────────── AI: Smart e-App, good-order check,
   │                                       exam scheduling, STP prediction
   │
   ▼
[5. UNDERWRITING] ─────────────────── AI: Risk scoring, APS triage,
   │                                       STP automation, fraud detection
   ▼
[6. POLICY DELIVERY] ──────────────── AI: Delivery prep, plain-English
   │                                       summary, beneficiary validation
   │
   ├──────────────────────────────────────────────────────────┐
   ▼                                                          ▼
[7A. ROUTINE SERVICE] ─── AI: Lapse alerts    [7G. CLAIMS] ── AI: Claims
[7B. BENEFICIARY CHG] ─── AI: Beneficiary          navigator,
[7C. COVERAGE CHANGES] ── AI: Conversion           contestability
[7D. LOANS / CSV]  ─────── AI: Impact modeling     analysis
[7E. OWNERSHIP CHG] ────── AI: Doc prep
[7F. LAPSE MGMT] ────────── AI: Retention scoring
```

---

## 📊 HOW THIS MAPS TO YOUR CURRENT CRM

| Phase | Current CRM Module | Gap / Opportunity |
|---|---|---|
| Prospecting | Leads (Prospects) | ✅ Exists — add AI lead score display |
| Discovery | Client record + FNA notes | ⚠️ FNA capture is informal — needs structured form |
| Illustration | Products (PI Hub) | ⚠️ No illustration runner — links to external tool |
| Application | E-App Wizard | ✅ Exists — add good-order check + STP indicator |
| Underwriting | Underwriting module | ✅ Exists — add APS triage + requirement tracker |
| Delivery | No dedicated module | ❌ Missing — policy delivery checklist + receipt |
| Servicing | Policies module | ⚠️ Service requests exist but no AI lapse/conversion alerts |
| Claims | Claims module | ✅ Exists — add beneficiary claims navigator |

---

## 🎯 TOP AI IMPACT OPPORTUNITIES FOR YOUR CRM

Ranked by business value × implementation feasibility:

| Priority | AI Feature | Phase | Persona Helped | Business Impact |
|---|---|---|---|---|
| 🔴 1 | Lapse Risk Scoring (live score on every policy) | 7F | Agent + CSR | Direct revenue retention |
| 🔴 2 | APS Triage Summarizer (AI reads medical records) | 5 | Underwriter | 60–80% UW time savings |
| 🔴 3 | Conversion Window Alerts (term → perm) | 7C | Agent | New premium revenue |
| 🟡 4 | Smart e-App Pre-fill (FNA → application) | 4 | Agent | Reduces not-in-good-order (NIGO) |
| 🟡 5 | Beneficiary Audit Scanner | 7B | Agent + Client | Compliance + client retention |
| 🟡 6 | Coverage Gap Calculator (real-time FNA) | 2 | Agent + Prospect | Increases face amount sold |
| 🟢 7 | Objection Coaching Cards | 3 | Agent | Conversion rate improvement |
| 🟢 8 | Claims Navigator (beneficiary-facing) | 7G | Beneficiary | Client family satisfaction |
| 🟢 9 | Policy Delivery Brief (pre-meeting AI prep) | 6 | Agent | Client experience |
| 🟢 10 | Post-delivery AI Check-in | 6 | Client | Free-look retention |

---

## 💡 SUGGESTED CRM CHANGES

### New / Enhanced Modules:

1. **FNA Capture Form** — structured discovery form that feeds directly into illustration and application (currently ad-hoc)
2. **Policy Delivery Checklist** — a dedicated delivery workflow with checkboxes, delivery receipt capture, and post-delivery AI follow-up scheduling
3. **Lapse Risk Dashboard** — surface every at-risk policy sorted by probability × premium at risk (currently buried)
4. **Underwriting Case Tracker** — real-time requirement status per case with AI-drafted follow-up messages to physicians/applicants
5. **Beneficiary Health Check** — a one-click scan of the entire book that flags stale/problematic beneficiary designations

### AI Enhancements to Existing Modules:

| Module | Enhancement |
|---|---|
| Prospects | Add AI propensity score badge + suggested first message |
| Products (PI Hub) | Add "Run Illustration" button that feeds directly into E-App |
| E-App Wizard | Add NIGO pre-check indicator before submission |
| Underwriting | Add APS upload + AI summary panel |
| Policies | Add lapse risk score + conversion opportunity flag per policy |
| Claims | Add beneficiary-facing claims guide |

---

## 📋 IMPLEMENTATION NOTES

- All Phase 1–7 changes have been implemented in the NYL Agent 360 CRM
- Nav structure: **MAIN → PROSPECTING → SALES → ONBOARDING → SERVICE → ANALYTICS**
- New pages built: **FNA Discovery Center** (Phase 2), **Policy Delivery** (Phase 6)
- AI panels added to: Prospects, Policies, Claims, Underwriting
- Commit: `254508a` — Phase 1-7: Full insurance lifecycle AI modules
