#!/usr/bin/env python3
"""Inject all 12 feature page functions into dist/_worker.js"""

with open('dist/_worker.js', 'r') as f:
    c = f.read()

# ── Helper: build a standard feature page HTML string (returns JSX e() calls) ──
def page(cls, html_inner):
    return f'function {cls}(){{return e("div",{{class:"page feature-page",children:[{html_inner}]}});}}'

def hdr(icon, title, sub, btn1_label, btn1_fn, btn2_label=None, btn2_fn=None):
    btns = f'e("button",{{class:"btn btn-ai",onclick:"{btn1_fn}",children:[e("i",{{class:"fas {icon}"}}),\" {btn1_label}"]}})'
    if btn2_label:
        btns += f',e("button",{{class:"btn btn-primary",onclick:"{btn2_fn}",children:[e("i",{{class:"fas fa-plus"}}),\" {btn2_label}"]}})'
    return (
        f'e("div",{{class:"feature-page-header",children:['
        f'e("div",{{class:"fph-left",children:['
        f'e("h2",{{class:"fph-title",children:[e("i",{{class:"fas {icon}"}}),\" {title}"]}})'
        f',e("p",{{class:"fph-sub",children:"{sub}"}})'
        f']}})'
        f',e("div",{{class:"fph-actions",children:[{btns}]}})'
        f']}})'
    )

def kpi_strip(*kpis):
    items = []
    for (val, lbl, color, icon) in kpis:
        items.append(
            f'e("div",{{class:"fkpi",children:['
            f'e("div",{{class:"fkpi-icon",style:"background:{color}20;color:{color}",children:e("i",{{class:"fas {icon}"}})}})'
            f',e("div",{{class:"fkpi-body",children:['
            f'e("div",{{class:"fkpi-val",children:"{val}"}}),'
            f'e("div",{{class:"fkpi-lbl",children:"{lbl}"}}),'
            f']}})'
            f']}})' 
        )
    return f'e("div",{{class:"fkpi-strip",children:[{",".join(items)}]}})'

def ai_banner(title, sub, btn_label, btn_fn):
    return (
        f'e("div",{{class:"feature-ai-banner",children:['
        f'e("div",{{class:"fab-icon",children:[e("i",{{class:"fas fa-robot"}}),e("span",{{class:"fab-pulse"}})]}}),'
        f'e("div",{{class:"fab-text",children:[e("div",{{class:"fab-title",children:["{title} ",e("span",{{class:"fab-live",children:"AI"}})]}}),'
        f'e("div",{{class:"fab-sub",children:"{sub}"}})]}})'
        f',e("button",{{class:"btn btn-ai",onclick:"{btn_fn}",children:[e("i",{{class:"fas fa-robot"}}),\" {btn_label}"]}})'
        f']}})'
    )

def table_wrap(thead_cols, rows_html):
    th = ''.join([f'e("th",{{children:"{c}"}})' for c in thead_cols])
    return (
        f'e("div",{{class:"feature-table-wrap",children:'
        f'e("table",{{class:"data-table",children:['
        f'e("thead",{{children:e("tr",{{children:[{th}]}})}}),'
        f'e("tbody",{{id:"feat-tbody",children:[{rows_html}]}})'
        f']}})'
        f'}})'
    )

def card_grid(cards_html):
    return f'e("div",{{class:"feature-card-grid",children:[{cards_html}]}})'

def fcard(title, sub, badge_cls, badge_txt, body, btn1l, btn1fn, btn2l=None, btn2fn=None):
    btns = f'e("button",{{class:"btn btn-primary btn-sm",onclick:"{btn1fn}",children:"{btn1l}"}})'
    if btn2l:
        btns += f',e("button",{{class:"btn btn-ai btn-sm",onclick:"{btn2fn}",children:"{btn2l}"}})' 
    return (
        f'e("div",{{class:"fcard",children:['
        f'e("div",{{class:"fcard-header",children:['
        f'e("div",{{class:"fcard-title",children:"{title}"}}),'
        f'e("span",{{class:"fcard-badge {badge_cls}",children:"{badge_txt}"}})'
        f']}}),'
        f'e("div",{{class:"fcard-sub",children:"{sub}"}}),'
        f'e("div",{{class:"fcard-body",children:"{body}"}}),'
        f'e("div",{{class:"fcard-footer",children:[{btns}]}})'
        f']}})' 
    )


# ══════════════════════════════════════════════════════════════════════════════
# FEATURE 1 – Annual Review Scheduler (already has JS data in app.js)
# ══════════════════════════════════════════════════════════════════════════════
AR_HDR = hdr("fa-calendar-check","Annual Reviews","AI-scheduled · suitability documented · review completion tracked","AI Schedule All","arAIScheduleAll()","Export Report","arExportReport()")
AR_KPI = kpi_strip(
    ("3","Overdue (90d+)","#dc2626","fa-exclamation-circle"),
    ("5","Due This Month","#d97706","fa-clock"),
    ("14","Completed YTD","#059669","fa-check-circle"),
    ("6","Scheduled Ahead","#003087","fa-calendar-alt"),
    ("78%","Completion Rate","#7c3aed","fa-percentage"),
    ("$142K","Revenue @ Stake","#0891b2","fa-dollar-sign"),
)
AR_AI = ai_banner("Annual Review AI Scheduler","Flags overdue clients · auto-builds prep packets · generates post-meeting action items","Run AI Prep","arAIScheduleAll()")
AR_TOOLBAR = (
    'e("div",{class:"page-toolbar",children:['
    'e("div",{class:"toolbar-left",children:['
    'e("div",{class:"search-inline",children:[e("i",{class:"fas fa-search"}),e("input",{type:"text",id:"ar-search",placeholder:"Search clients...",oninput:"renderARCards()"})]}),'
    'e("select",{class:"filter-select",id:"ar-status-filter",onchange:"renderARCards()",children:['
    'e("option",{value:"",children:"All Status"}),e("option",{children:"Overdue"}),e("option",{children:"Due Soon"}),e("option",{children:"Scheduled"}),e("option",{children:"Completed"})'
    ']})'
    ']}),'
    'e("div",{class:"toolbar-right",children:['
    'e("button",{class:"btn btn-secondary",onclick:"arExportReport()",children:[e("i",{class:"fas fa-download"})," Export"]})'
    ']})'
    ']})'
)
AR_CARDS = 'e("div",{class:"ar-cards-grid",id:"ar-cards-grid"})'
AR_PAGE = (
    f'function AnnualReviewPage(){{return e("div",{{class:"page ar-page",children:['
    f'{AR_HDR},{AR_KPI},{AR_AI},{AR_TOOLBAR},{AR_CARDS}'
    f']}});}}' 
)

# ══════════════════════════════════════════════════════════════════════════════
# FEATURE 3 – Life Event Trigger Engine
# ══════════════════════════════════════════════════════════════════════════════
LE_HDR = hdr("fa-bolt","Life Event Trigger Engine","AI monitors public records & data signals · turns life events into revenue opportunities","Run AI Scan","leRunScan()","Add Trigger","leAddManual()")
LE_KPI = kpi_strip(
    ("12","Active Triggers","#ea580c","fa-bolt"),
    ("4","High Priority","#dc2626","fa-exclamation-circle"),
    ("$89K","Potential Revenue","#059669","fa-dollar-sign"),
    ("3","New This Week","#7c3aed","fa-star"),
    ("68%","Conversion Rate","#0891b2","fa-chart-line"),
)
LE_AI = ai_banner("Life Event Intelligence","Scans mortgage filings, public records, LinkedIn & social signals · scores revenue potential","AI Scan All Clients","leRunScan()")
LE_CARDS = (
    'e("div",{class:"le-cards-grid",children:['
    + ','.join([
        fcard(n,sub,"le-badge-"+bc,bt,body,b1l,b1fn,"AI Script","sendContextMessage('"+ai_msg+"','advisor')")
        for (n,sub,bc,bt,body,b1l,b1fn,ai_msg) in [
            ("Maria Gonzalez","New Baby Detected — Apr 2026","red","🍼 New Baby","Life insurance gap: $500K coverage needed. DI rider opportunity.","Schedule Call","showToast('Call scheduled for Maria Gonzalez')","Generate life insurance conversation script for Maria Gonzalez — new baby, needs $500K coverage + DI rider"),
            ("Kevin Park","Job Promotion — Mar 2026","orange","💼 Promotion","Income up 40%. New 401k contribution room. Executive bonus plan opportunity.","Review Opportunity","showToast('Opening Kevin Park profile')","Kevin Park received a promotion — income up 40%. Generate NQDC and executive bonus plan conversation."),
            ("Sandra Williams","Home Purchase — Feb 2026","blue","🏠 New Home","Mortgage $620K. Mortgage life, homeowners bundle, updated estate plan.","Create Opportunity","showToast('Opportunity created for Sandra Williams')","Sandra Williams bought a home — $620K mortgage. Generate mortgage life insurance and estate update script."),
            ("David Thompson","Marriage — Jan 2026","green","💍 Marriage","Joint life policy, beneficiary updates, income protection review.","Schedule Call","showToast('Call scheduled for David Thompson')","David Thompson got married. Generate joint life insurance and beneficiary update conversation script."),
            ("Patricia Nguyen","Divorce Filing — Mar 2026","red","⚖️ Divorce","Policy beneficiary update urgent. QDRO review for retirement assets.","Urgent Action","showToast('Urgent action created for Patricia Nguyen')","Patricia Nguyen is divorcing — urgent beneficiary update and QDRO review needed. Generate sensitive conversation script."),
            ("James Whitfield","Child Starting College — Aug 2026","purple","🎓 College","529 plan review. Life coverage gap during college years. DI update.","Review Plan","showToast('Opening James Whitfield financial plan')","James Whitfield's child is starting college. Generate 529 review and coverage gap conversation."),
        ]
    ])
    + ']}'
)
LE_PAGE = (
    f'function LifeEventsPage(){{return e("div",{{class:"page le-page",children:['
    f'{LE_HDR},{LE_KPI},{LE_AI},{LE_CARDS}'
    f']}});}}' 
)

# ══════════════════════════════════════════════════════════════════════════════
# FEATURE 4 – RMD Center
# ══════════════════════════════════════════════════════════════════════════════
RMD_HDR = hdr("fa-umbrella-beach","RMD Center","Required Minimum Distribution tracking · AI calculates amounts · conversation scripts ready","Calculate All RMDs","rmdCalculateAll()","Add Client","showToast('Select client from Clients page')")
RMD_KPI = kpi_strip(
    ("5","Clients Turning 73","#7c3aed","fa-birthday-cake"),
    ("$284K","Total RMDs Due 2026","#dc2626","fa-dollar-sign"),
    ("3","Roth Conversion Opps","#059669","fa-random"),
    ("2","Late-Filer Alerts","#d97706","fa-exclamation-triangle"),
)
RMD_AI = ai_banner("RMD Intelligence Engine","Flags age-73 clients · calculates IRS RMD amounts · identifies Roth conversion windows · generates client conversation scripts","Run RMD Analysis","rmdCalculateAll()")
RMD_TABLE = table_wrap(
    ["Client","Age","RMD Account","Balance","2026 RMD","Due Date","Status","Action"],
    ','.join([
        (f'e("tr",{{children:['
         f'e("td",{{children:e("div",{{class:"client-cell",children:[e("div",{{class:"mini-avatar",children:"{av}"}}),e("span",{{children:"{name}"}})]}})}}),'
         f'e("td",{{children:e("span",{{class:"rmd-age-badge {acls}",children:"{age}"}})}})'
         f',e("td",{{children:"{acct}"}})'
         f',e("td",{{class:"text-right",children:"{bal}"}})'
         f',e("td",{{class:"text-right rmd-amount",children:"{rmd}"}})'
         f',e("td",{{class:"text-muted",children:"{due}"}})'
         f',e("td",{{children:e("span",{{class:"status-badge {scls}",children:"{status}"}})}})' 
         f',e("td",{{children:e("button",{{class:"btn-icon ai-btn",title:"AI Script",onclick:"sendContextMessage(\'RMD conversation script for {name}, age {age}, {acct} balance {bal}, RMD due {rmd}\',\'advisor\')",children:e("i",{{class:"fas fa-robot"}})}})}})'
         f']}})')
        for (av,name,age,acls,acct,bal,rmd,due,scls,status) in [
            ("JW","James Whitfield","73","rmd-age-now","Traditional IRA","$420,000","$15,328","Apr 1, 2026","review","Due Now"),
            ("LM","Linda Morrison","74","rmd-age-now","401(k) — Rollover","$680,000","$26,150","Dec 31, 2026","active","Pending"),
            ("RB","Robert Brown","75","rmd-age-now","SEP-IRA","$310,000","$12,800","Dec 31, 2026","active","Pending"),
            ("SC","Sarah Chen","71","rmd-age-near","Traditional IRA","$290,000","N/A — 2 yrs","2028","review","Planning"),
            ("DP","Daniel Park","72","rmd-age-near","Inherited IRA","$180,000","$6,200 est.","2027","active","Est. Next Yr"),
        ]
    ])
)
RMD_PAGE = (
    f'function RMDCenterPage(){{return e("div",{{class:"page rmd-page",children:['
    f'{RMD_HDR},{RMD_KPI},{RMD_AI},{RMD_TABLE}'
    f']}});}}' 
)

# ══════════════════════════════════════════════════════════════════════════════
# FEATURE 5 – Tax Planning Overlay
# ══════════════════════════════════════════════════════════════════════════════
TAX_HDR = hdr("fa-receipt","Tax Planning Overlay","AI monitors brackets · flags loss harvesting · Roth conversion windows · 1035 exchanges","Run Tax Scan","taxRunScan()","Add Note","showToast('Tax note added')")
TAX_KPI = kpi_strip(
    ("7","Clients w/ Tax Opps","#059669","fa-lightbulb"),
    ("3","Roth Conversion Alerts","#7c3aed","fa-random"),
    ("2","Loss Harvest Windows","#d97706","fa-chart-line"),
    ("$48K","Estimated Tax Savings","#0891b2","fa-piggy-bank"),
    ("4","1035 Exchange Candidates","#dc2626","fa-exchange-alt"),
)
TAX_AI = ai_banner("Tax Intelligence Engine","Monitors tax brackets · flags Roth conversion & loss-harvesting windows · generates talking points for CPA coordination","AI Tax Scan","taxRunScan()")
TAX_CARDS = (
    'e("div",{class:"feature-card-grid",children:['
    + ','.join([
        fcard(n,sub,"tax-badge-"+bc,bt,body,b1l,b1fn,"AI Script",f"sendContextMessage('{ai_msg}','advisor')")
        for (n,sub,bc,bt,body,b1l,b1fn,ai_msg) in [
            ("James Whitfield","37% bracket → optimal Roth conversion window","purple","Roth Conversion","Convert $80K Traditional IRA → Roth before year-end. Save est. ~$18K in future RMD taxes.","Run Illustration","navigateTo('clients')","James Whitfield Roth conversion illustration: convert $80K, 37% bracket, impact on future RMDs"),
            ("Sandra Williams","Term life expiry = 1035 exchange opportunity","orange","1035 Exchange","P-100320 term expires Sep 2026. 1035 into permanent policy preserves basis tax-free.","Review Policy","navigateTo('policies')","Sandra Williams 1035 exchange analysis: term to permanent policy, tax-free basis transfer"),
            ("Patricia Nguyen","UL policy basis for partial surrender","red","Partial Surrender","Policy basis $42K. Partial surrender $15K tax-free. Review for Roth funding.","Schedule Call","showToast('Call scheduled for Patricia Nguyen')","Patricia Nguyen partial policy surrender analysis for tax-free Roth IRA funding"),
            ("Robert Chen","Business — QSBS + Section 1202 exclusion","blue","Business Tax","Chen Holdings shares may qualify for $10M QSBS exclusion on exit. Review now.","Refer to CPA","showToast('CPA referral initiated for Robert Chen')","Robert Chen QSBS Section 1202 exclusion analysis — Chen Holdings business exit planning"),
            ("Kevin Park","22% bracket — maximize Roth contributions","green","Roth Eligible","22% bracket in prime Roth years. Increase Roth 401k + backdoor Roth strategy.","Review Plan","navigateTo('clients')","Kevin Park Roth contribution maximization strategy — 22% bracket, backdoor Roth analysis"),
            ("Linda Morrison","32% → 22% bracket drop in retirement","teal","Bracket Drop","Linda retires 2027: drops from 32% to 22%. Accelerate income recognition before drop.","Plan Review","showToast('Opening Linda Morrison financial plan')","Linda Morrison pre-retirement income acceleration strategy — bracket drop from 32% to 22%"),
        ]
    ])
    + ']}'
)
TAX_PAGE = (
    f'function TaxPlanningPage(){{return e("div",{{class:"page tax-page",children:['
    f'{TAX_HDR},{TAX_KPI},{TAX_AI},{TAX_CARDS}'
    f']}});}}' 
)

# ══════════════════════════════════════════════════════════════════════════════
# FEATURE 6 – Business Owner Hub
# ══════════════════════════════════════════════════════════════════════════════
BO_HDR = hdr("fa-building","Business Owner Hub","Dedicated view for business-owner clients · key-person gaps · buy-sell · NQDC · COLI · succession","AI Business Scan","boRunScan()","Add Business","showToast('Select business owner from Clients page')")
BO_KPI = kpi_strip(
    ("3","Business Owner Clients","#0891b2","fa-building"),
    ("$38.4K","New Premium Potential","#059669","fa-dollar-sign"),
    ("2","Key-Person Gaps","#dc2626","fa-user-shield"),
    ("1","Buy-Sell Gap","#d97706","fa-handshake"),
    ("3","NQDC Opportunities","#7c3aed","fa-landmark"),
)
BO_AI = ai_banner("Business Advisory AI","Identifies key-person insurance gaps · models buy-sell funding · calculates NQDC deferral benefits · COLI tax analysis","Run Business Review","boRunScan()")
BO_CARDS = (
    'e("div",{class:"feature-card-grid",children:['
    + ','.join([
        fcard(n,sub,"bo-badge-"+bc,bt,body,b1l,b1fn,"AI Analysis",f"sendContextMessage('{ai_msg}','advisor')")
        for (n,sub,bc,bt,body,b1l,b1fn,ai_msg) in [
            ("Robert Chen","Chen Holdings · Technology Consulting · $4M Valuation","blue","Key-Person Gap","No key-person life in place. Rec: $2M 20-yr Term @ $8,400/yr. NQDC + COLI opps.","Full Analysis","boOpenClient('robert')","Full business services analysis for Robert Chen — Chen Holdings, key-person life, NQDC, COLI opportunities"),
            ("James Whitfield","Executive · Whitfield Capital · $380K Income","purple","NQDC Eligible","Not enrolled in employer NQDC. Defer $80K/yr. Section 162 bonus plan via WL policy.","Review Benefits","boOpenClient('james')","James Whitfield NQDC deferral and Section 162 executive bonus plan analysis — $380K income"),
            ("Maria Gonzalez","Sole Proprietor · Medical Practice · $280K Revenue","orange","Succession Gap","No succession plan. Buy-sell needed. Solo 401k not maxed. Key-person DI gap.","Create Plan","boOpenClient('maria')","Maria Gonzalez medical practice succession plan — buy-sell, solo 401k maximization, key-person DI"),
        ]
    ])
    + ']}'
)
BO_PAGE = (
    f'function BusinessOwnerPage(){{return e("div",{{class:"page bo-page",children:['
    f'{BO_HDR},{BO_KPI},{BO_AI},{BO_CARDS}'
    f']}});}}' 
)

# ══════════════════════════════════════════════════════════════════════════════
# FEATURE 7 – Suitability & Compliance Dashboard
# ══════════════════════════════════════════════════════════════════════════════
SUIT_HDR = hdr("fa-shield-alt","Suitability & Compliance","Reg BI documentation · suitability scores · risk-profile monitoring · E&O tracking","Run Compliance Scan","suitRunScan()","Export Docs","suitExport()")
SUIT_KPI = kpi_strip(
    ("2","Review Required","#dc2626","fa-exclamation-circle"),
    ("247","Clients Reviewed","#059669","fa-check-circle"),
    ("94%","Avg Suitability Score","#0891b2","fa-star"),
    ("3","Reg BI Disclosures Due","#d97706","fa-file-alt"),
    ("0","Open Complaints","#059669","fa-thumbs-up"),
)
SUIT_AI = ai_banner("Compliance Intelligence","Monitors suitability scores · flags risk-profile drift · auto-generates Reg BI documentation · complaint tracking","Run Reg BI Scan","suitRunScan()")
SUIT_TABLE = table_wrap(
    ["Client","Suitability Score","Risk Profile","Last Review","Products","Reg BI Status","Action"],
    ','.join([
        (f'e("tr",{{children:['
         f'e("td",{{children:e("div",{{class:"client-cell",children:[e("div",{{class:"mini-avatar",children:"{av}"}}),e("span",{{children:"{name}"}})]}})}}),'
         f'e("td",{{children:e("div",{{class:"suit-score-bar",children:[e("div",{{class:"suit-fill",style:"width:{score}%"}}),e("span",{{children:"{score}/100"}})]}})}})'
         f',e("td",{{children:e("span",{{class:"risk-badge risk-{rp.lower().replace(\" \",\"-\")}",children:"{rp}"}})}})'
         f',e("td",{{class:"text-muted",children:"{rev}"}})'
         f',e("td",{{class:"text-muted",children:"{prods}"}})'
         f',e("td",{{children:e("span",{{class:"status-badge {rcls}",children:"{rstatus}"}})}})'
         f',e("td",{{children:e("button",{{class:"btn-icon ai-btn",title:"AI Reg BI Docs",onclick:"sendContextMessage(\'Generate Reg BI best-interest documentation for {name}, suitability {score}/100, {rp} risk profile\',\'advisor\')",children:e("i",{{class:"fas fa-file-alt"}})}})}})'
         f']}})')
        for (av,name,score,rp,rev,prods,rcls,rstatus) in [
            ("JW","James Whitfield",91,"Aggressive","Apr 9, 2026","UL $1M, LTC, VUL","active","Compliant"),
            ("LM","Linda Morrison",98,"Moderate","Mar 22, 2026","WL $1.5M, Annuity","active","Compliant"),
            ("KP","Kevin Park",83,"Moderate","Feb 14, 2026","Term $500K","review","Review Needed"),
            ("PN","Patricia Nguyen",79,"Conservative","Jan 10, 2026","UL $300K","review","Review Needed"),
            ("RC","Robert Chen",94,"Aggressive","Apr 9, 2026","VUL $1M, Key-Person","active","Compliant"),
            ("SW","Sandra Williams",77,"Conservative","Mar 5, 2026","Term $1M","active","Compliant"),
            ("DT","David Thompson",71,"Moderate","Dec 15, 2025","Term $250K","lapsed","Overdue"),
            ("MG","Maria Gonzalez",85,"Moderate","Feb 28, 2026","WL $500K, DI","active","Compliant"),
        ]
    ])
)
SUIT_PAGE = (
    f'function SuitabilityPage(){{return e("div",{{class:"page suit-page",children:['
    f'{SUIT_HDR},{SUIT_KPI},{SUIT_AI},{SUIT_TABLE}'
    f']}});}}' 
)

# ══════════════════════════════════════════════════════════════════════════════
# FEATURE 8 – LTC & Medicare Planning Center
# ══════════════════════════════════════════════════════════════════════════════
LTC_HDR = hdr("fa-heartbeat","LTC & Medicare Planning","AI flags ages 55-70 · estimates care costs · tracks Medicare enrollment · hybrid product comparison","Run LTC Scan","ltcRunScan()","New Plan","showToast('Select client to create LTC plan')")
LTC_KPI = kpi_strip(
    ("9","Clients 55–70 Unprotected","#be123c","fa-heartbeat"),
    ("3","Medicare Enrollment Due","#d97706","fa-plus-circle"),
    ("$312K","Avg LTC Cost Exposure","#dc2626","fa-dollar-sign"),
    ("4","Hybrid Product Candidates","#7c3aed","fa-random"),
    ("$7.8K","New Premium Potential","#059669","fa-chart-line"),
)
LTC_AI = ai_banner("LTC & Medicare Intelligence","Flags age-55-70 clients · calculates local care costs · compares hybrid products · tracks Medicare Part B/D enrollment","Run Full LTC Scan","ltcRunScan()")
LTC_CARDS = (
    'e("div",{class:"feature-card-grid",children:['
    + ','.join([
        fcard(n,sub,"ltc-badge-"+bc,bt,body,b1l,b1fn,"AI Script",f"sendContextMessage('{ai_msg}','advisor')")
        for (n,sub,bc,bt,body,b1l,b1fn,ai_msg) in [
            ("James Whitfield","Age 52 · LTC gap $180/day · 6-yr benefit depletes 2032","red","⚠ LTC Gap","Current coverage $120/day. Avg NH cost $290/day. Gap $170/day × 3yr = $186K exposed.","Review Coverage","navigateTo('clients')","James Whitfield LTC gap analysis — current coverage vs. local care costs, hybrid product comparison"),
            ("Sandra Williams","Age 48 · No LTC coverage · Medicare Part B gap","orange","No LTC","Age-eligible for hybrid LTC+life. $2,500/mo benefit for 5 yrs = $150K pool. Act by 55.","Create Plan","showToast('LTC plan created for Sandra Williams')","Sandra Williams LTC planning — hybrid life/LTC product analysis, cost projections, Medicare coordination"),
            ("Linda Morrison","Age 58 · Medicare Part B enrollment window 2027","purple","Medicare Alert","Retiring 2027. 8-month Medicare enrollment window. Part D drug coverage selection needed.","Schedule Planning","showToast('Medicare planning scheduled for Linda Morrison')","Linda Morrison Medicare planning — Part B enrollment, Part D drug plan, Medigap supplement comparison"),
            ("Kevin Park","Age 34 · Parent LTC exposure · Planning ahead","green","Parent LTC Risk","Kevin's parents (68, 71) have no LTC. Gifting strategy + family LTC policy.","Advisory Call","showToast('Advisory call scheduled for Kevin Park')","Kevin Park family LTC planning — parents aging, gifting strategy, family LTC policy options"),
            ("Patricia Nguyen","Age 45 · High care-cost zip code · DI gap too","red","High-Risk Area","San Jose NH cost $4,200/mo. No LTC, no DI. Double gap. Hybrid policy + DI bundle.","Urgent Review","showToast('Urgent review created for Patricia Nguyen')","Patricia Nguyen LTC + DI gap analysis — San Jose care costs, hybrid product recommendation"),
        ]
    ])
    + ']}'
)
LTC_PAGE = (
    f'function LTCMedicarePage(){{return e("div",{{class:"page ltc-page",children:['
    f'{LTC_HDR},{LTC_KPI},{LTC_AI},{LTC_CARDS}'
    f']}});}}' 
)

# ══════════════════════════════════════════════════════════════════════════════
# FEATURE 9 – AI Voice Call Prep & Post-Call Summary
# ══════════════════════════════════════════════════════════════════════════════
VC_HDR = hdr("fa-phone-alt","Call Prep & Post-Call Summary","AI generates 60-second briefings · structures post-call notes · extracts sentiment · schedules follow-ups","Schedule Calls","vcScheduleCalls()","New Summary","vcNewSummary()")
VC_KPI = kpi_strip(
    ("4","Calls Today","#0891b2","fa-phone-alt"),
    ("2","Pending Summaries","#d97706","fa-file-alt"),
    ("18","Calls This Month","#059669","fa-calendar-check"),
    ("92%","Action Item Capture","#7c3aed","fa-tasks"),
)
VC_AI = ai_banner("Call Intelligence Engine","Generates pre-call briefings · transcribes voice notes into CRM · extracts sentiment & objections · auto-schedules follow-ups","Generate Today's Briefs","vcGenerateBriefs()")
VC_UPCOMING = (
    'e("div",{class:"vc-section",children:['
    'e("div",{class:"vc-section-title",children:[e("i",{class:"fas fa-calendar-alt"})," Upcoming Calls — Today"]}),'
    'e("div",{class:"vc-call-list",children:['
    + ','.join([
        (f'e("div",{{class:"vc-call-card",children:['
         f'e("div",{{class:"vc-call-time",children:"{time}"}})'
         f',e("div",{{class:"vc-call-info",children:[e("div",{{class:"vc-call-name",children:"{name}"}}),e("div",{{class:"vc-call-topic",children:"{topic}"}})]}})'
         f',e("div",{{class:"vc-call-actions",children:['
         f'e("button",{{class:"btn btn-ai btn-sm",onclick:"sendContextMessage(\'Generate 60-second call prep brief for {name}: {topic}. Include key talking points, objections to expect, and recommended next steps.\',\'advisor\')",children:[e("i",{{class:"fas fa-robot"}}),\" AI Brief"]}})'
         f',e("button",{{class:"btn btn-primary btn-sm",onclick:"showToast(\'Adding {name} call to calendar...\')  ",children:[e("i",{{class:"fas fa-calendar-plus"}}),\" Schedule"]}})'
         f']}})'
         f']}})')
        for (time,name,topic) in [
            ("9:00 AM","James Whitfield","Annual review prep + income annuity discussion"),
            ("11:30 AM","Patricia Nguyen","UL policy funding review — lapse prevention"),
            ("2:00 PM","Sandra Williams","Term expiry + conversion options"),
            ("4:00 PM","Kevin Park","Follow-up on pending application"),
        ]
    ])
    + ']})]}'
)
VC_SUMMARIES = (
    'e("div",{class:"vc-section",children:['
    'e("div",{class:"vc-section-title",children:[e("i",{class:"fas fa-file-alt"})," Recent Post-Call Summaries"]}),'
    'e("div",{class:"vc-summary-list",children:['
    + ','.join([
        (f'e("div",{{class:"vc-summary-card",children:['
         f'e("div",{{class:"vc-sum-header",children:[e("span",{{class:"vc-sum-name",children:"{name}"}}),e("span",{{class:"vc-sum-date",children:"{date}"}}),e("span",{{class:"vc-sum-sentiment vc-sent-{sent}",children:"{slbl}"}})]}}),'
         f'e("div",{{class:"vc-sum-body",children:"{summary}"}})'
         f',e("div",{{class:"vc-sum-actions",children:[e("span",{{class:"vc-sum-follow",children:"Next: {follow}"}}),e("button",{{class:"btn btn-ai btn-sm",onclick:"sendContextMessage(\'Expand post-call summary for {name} — {date}: {summary}\',\'advisor\')",children:[e("i",{{class:"fas fa-expand-alt"}}),\" Expand\"]}})]}})'
         f']}})')
        for (name,date,sent,slbl,summary,follow) in [
            ("Linda Morrison","Apr 9 · 10:00 AM","positive","😊 Positive","Discussed WL cash value strategy. Client very engaged. Interested in adding annuity rider. No objections.","Send annuity illustration by Apr 12"),
            ("Robert Chen","Apr 8 · 2:30 PM","neutral","😐 Neutral","Key-person life review. Client wants valuation done before committing. Mentions budget concerns.","Follow-up after valuation — May 1"),
            ("David Thompson","Apr 7 · 11:00 AM","concerned","😟 Concerned","Client expressed concern about premium cost. Discussed term conversion. Wants to see lower-cost options.","Send term alternative illustrations"),
        ]
    ])
    + ']})]}'
)
VC_PAGE = (
    f'function VoiceCallPage(){{return e("div",{{class:"page vc-page",children:['
    f'{VC_HDR},{VC_KPI},{VC_AI},{VC_UPCOMING},{VC_SUMMARIES}'
    f']}});}}' 
)

# ══════════════════════════════════════════════════════════════════════════════
# FEATURE 10 – Portfolio Drift & Rebalancing Alerts
# ══════════════════════════════════════════════════════════════════════════════
PD_HDR = hdr("fa-chart-line","Portfolio Drift & Rebalancing Alerts","AI monitors allocation drift · market-event alerts · rebalance proposals · surrender charge tracking","Run Drift Analysis","pdRunAnalysis()","Export Report","pdExportReport()")
PD_KPI = kpi_strip(
    ("4","Clients w/ Drift >5%","#d97706","fa-chart-line"),
    ("2","Market-Event Alerts","#dc2626","fa-exclamation-triangle"),
    ("$1.2M","AUM Needs Rebalancing","#0891b2","fa-balance-scale"),
    ("3","Surrender Windows Open","#059669","fa-door-open"),
    ("$28K","Est. Revenue at Rebalance","#7c3aed","fa-dollar-sign"),
)
PD_AI = ai_banner("Portfolio Intelligence Engine","Monitors allocation vs. target · calculates drift · flags surrender charge windows · generates rebalance proposals","AI Rebalance Scan","pdRunAnalysis()")
PD_CARDS = (
    'e("div",{class:"feature-card-grid",children:['
    + ','.join([
        fcard(n,sub,"pd-badge-"+bc,bt,body,b1l,b1fn,"AI Rebalance",f"sendContextMessage('{ai_msg}','advisor')")
        for (n,sub,bc,bt,body,b1l,b1fn,ai_msg) in [
            ("James Whitfield","Target: 70/30 → Actual: 81/19 · Drift: +11%","red","⚠ High Drift","Equity overweight by $48K. VUL sub-account drift. Rebalance before year-end to capture gains tax-efficiently.","Create Rebalance","showToast('Rebalance proposal created for James Whitfield')","James Whitfield portfolio rebalance proposal — 81/19 actual vs 70/30 target, VUL sub-account reallocation"),
            ("Linda Morrison","Target: 60/40 → Actual: 67/33 · Drift: +7%","orange","Moderate Drift","Fixed income underweight. Annuity allocation opportunity. Surrender charge expires Aug 2026.","Review Allocation","showToast('Opening Linda Morrison portfolio')","Linda Morrison rebalancing — surrender window Aug 2026, annuity allocation opportunity, 67/33 current vs 60/40 target"),
            ("Robert Chen","Market Event: Fed Rate +0.25% — May Impact","blue","Rate Alert","Bond fund values dropping. VUL fixed sub-account rate reset favorable. Review allocation now.","Review Impact","sendContextMessage('Robert Chen rate impact analysis — Fed rate increase effect on bond allocation and VUL fixed sub-account','advisor')","Robert Chen portfolio rate impact — Fed rate increase, bond fund review, VUL fixed sub-account reallocation"),
            ("Kevin Park","Target: 90/10 → Actual: 88/12 · Minor Drift","green","On Target","Portfolio within tolerance. 529 plan: equity 95% — slightly aggressive for 10-yr horizon. Review.","Review 529","showToast('Opening Kevin Park 529 review')","Kevin Park 529 plan review — 95% equity allocation, 10-year college horizon, glide path recommendation"),
        ]
    ])
    + ']}'
)
PD_PAGE = (
    f'function PortfolioDriftPage(){{return e("div",{{class:"page pd-page",children:['
    f'{PD_HDR},{PD_KPI},{PD_AI},{PD_CARDS}'
    f']}});}}' 
)

# ══════════════════════════════════════════════════════════════════════════════
# FEATURE 11 – Referral Network Manager
# ══════════════════════════════════════════════════════════════════════════════
RN_HDR = hdr("fa-share-alt","Referral Network Manager","AI prompts for ask-for-referral · COI activity tracking · reciprocity metrics · leaderboard","AI Referral Prompt","rnAIPrompt()","Add Referral","rnAddReferral()")
RN_KPI = kpi_strip(
    ("42","Total Referrals YTD","#059669","fa-share-alt"),
    ("$187K","Revenue from Referrals","#0891b2","fa-dollar-sign"),
    ("12","Active COI Partners","#7c3aed","fa-handshake"),
    ("8","Referrals This Month","#d97706","fa-star"),
    ("67%","Referral Conversion Rate","#059669","fa-chart-line"),
)
RN_AI = ai_banner("Referral Intelligence","Identifies clients with high NPS ready to refer · prompts optimal ask timing · tracks COI reciprocity · automates thank-you messages","AI Referral Opportunities","rnAIPrompt()")
RN_LEADERBOARD = (
    'e("div",{class:"rn-leaderboard",children:['
    'e("div",{class:"rn-lb-title",children:[e("i",{class:"fas fa-trophy"})," Top Referral Sources"]}),'
    'e("div",{class:"rn-lb-list",children:['
    + ','.join([
        (f'e("div",{{class:"rn-lb-item",children:['
         f'e("span",{{class:"rn-lb-rank",children:"#{rank}"}})'
         f',e("div",{{class:"mini-avatar",children:"{av}"}})'
         f',e("div",{{class:"rn-lb-info",children:[e("div",{{class:"rn-lb-name",children:"{name}"}}),e("div",{{class:"rn-lb-meta",children:"{meta}"}})]}})'
         f',e("span",{{class:"rn-lb-count",children:"{cnt} referrals"}})'
         f',e("button",{{class:"btn btn-ai btn-sm",onclick:"sendContextMessage(\'Generate personalized thank-you and referral ask message for {name}\',\'advisor\')",children:[e("i",{{class:"fas fa-robot"}}),\" AI Ask"]}})'
         f']}})')
        for (rank,av,name,meta,cnt) in [
            (1,"LM","Linda Morrison","NPS 94 · 3 referrals converted · Attorney network","8"),
            (2,"JW","James Whitfield","NPS 88 · 2 referrals closed · Executive circle","6"),
            (3,"RC","Robert Chen","NPS 91 · 3 COI connections · Tech community","5"),
            (4,"MG","Maria Gonzalez","NPS 82 · Medical professional network","4"),
            (5,"KP","Kevin Park","NPS 87 · Tech colleagues · Recent refers","3"),
        ]
    ])
    + ']})]}'
)
RN_COI = (
    'e("div",{class:"rn-coi-section",children:['
    'e("div",{class:"rn-coi-title",children:[e("i",{class:"fas fa-handshake"})," COI Partner Activity"]}),'
    'e("div",{class:"rn-coi-grid",children:['
    + ','.join([
        (f'e("div",{{class:"rn-coi-card",children:['
         f'e("div",{{class:"rn-coi-name",children:"{name}"}})'
         f',e("div",{{class:"rn-coi-type",children:"{ctype}"}})'
         f',e("div",{{class:"rn-coi-stats",children:[e("span",{{children:"Sent: {sent}"}})," · ",e("span",{{children:"Received: {recv}"}})]}})'
         f',e("span",{{class:"rn-coi-status {scls}",children:"{status}"}})'
         f']}})')
        for (name,ctype,sent,recv,scls,status) in [
            ("Sarah Kim, Esq.","Estate Attorney","12","4","rn-active","Active"),
            ("Dr. Brian Park","CPA / Tax Advisor","8","6","rn-active","Active"),
            ("Tom Reynolds","Real Estate Agent","5","9","rn-active","Active"),
            ("Amy Chen","Mortgage Broker","3","7","rn-active","Active"),
            ("Mark Davis","Business Consultant","2","1","rn-inactive","Follow-up Needed"),
        ]
    ])
    + ']})]}'
)
RN_PAGE = (
    f'function ReferralNetworkPage(){{return e("div",{{class:"page rn-page",children:['
    f'{RN_HDR},{RN_KPI},{RN_AI},{RN_LEADERBOARD},{RN_COI}'
    f']}});}}' 
)

# ══════════════════════════════════════════════════════════════════════════════
# FEATURE 12 – Client Portal & Digital Engagement Score
# ══════════════════════════════════════════════════════════════════════════════
ENG_HDR = hdr("fa-signal","Engagement Score","AI scores client digital activity · flags dark clients · preferred channel tracking · NPS monitoring","Run Engagement Scan","engRunScan()","Export Report","engExport()")
ENG_KPI = kpi_strip(
    ("18","Dark Clients (90d+)","#dc2626","fa-moon"),
    ("247","Total Engagement Tracked","#0891b2","fa-signal"),
    ("4.2","Avg NPS Score","#059669","fa-star"),
    ("73%","Portal Adoption Rate","#7c3aed","fa-globe"),
    ("12","Re-Engagement Scheduled","#d97706","fa-redo"),
)
ENG_AI = ai_banner("Digital Engagement Intelligence","Scores email/portal activity · flags unresponsive clients · records preferred channel · auto-schedules re-engagement campaigns","AI Engagement Scan","engRunScan()")
ENG_TABLE = table_wrap(
    ["Client","Engagement Score","Last Contact","Preferred Channel","Portal Activity","NPS","Status","Action"],
    ','.join([
        (f'e("tr",{{children:['
         f'e("td",{{children:e("div",{{class:"client-cell",children:[e("div",{{class:"mini-avatar",children:"{av}"}}),e("span",{{children:"{name}"}})]}})}}),'
         f'e("td",{{children:e("div",{{class:"eng-score-bar",children:[e("div",{{class:"eng-fill eng-fill-{ecls}",style:"width:{score}%"}}),e("span",{{children:"{score}/100"}})]}})}})'
         f',e("td",{{class:"text-muted",children:"{last}"}})'
         f',e("td",{{children:e("span",{{class:"channel-badge channel-{ch.lower()}",children:"{ch}"}})}})'
         f',e("td",{{class:"text-muted",children:"{portal}"}})'
         f',e("td",{{children:e("div",{{class:"nps-stars",children:"{nps}★"}})}})'
         f',e("td",{{children:e("span",{{class:"status-badge {scls}",children:"{status}"}})}})'
         f',e("td",{{children:e("button",{{class:"btn-icon ai-btn",title:"AI Re-Engage",onclick:"sendContextMessage(\'Re-engagement strategy for {name} — last contact {last}, preferred channel {ch}. Generate personalized outreach.\',\'advisor\')",children:e("i",{{class:"fas fa-robot"}})}})}})'
         f']}})')
        for (av,name,score,ecls,last,ch,portal,nps,scls,status) in [
            ("LM","Linda Morrison",94,"high","Apr 9, 2026","Phone","Active weekly","9.4","active","Highly Engaged"),
            ("JW","James Whitfield",88,"high","Apr 9, 2026","Email","Active monthly","8.8","active","Engaged"),
            ("RC","Robert Chen",82,"high","Apr 8, 2026","In-Person","Portal login 2/wk","9.1","active","Engaged"),
            ("KP","Kevin Park",76,"med","Mar 22, 2026","Digital","Active","8.7","active","Active"),
            ("MG","Maria Gonzalez",71,"med","Mar 15, 2026","Phone","Occasional","8.2","active","Active"),
            ("PN","Patricia Nguyen",44,"low","Jan 10, 2026","Email","Last login 90d","7.1","review","Dark — Alert"),
            ("DT","David Thompson",38,"low","Dec 15, 2025","Phone","No portal","6.8","lapsed","Dark — Urgent"),
            ("SW","Sandra Williams",62,"med","Feb 28, 2026","Email","Monthly","7.9","active","Moderate"),
        ]
    ])
)
ENG_PAGE = (
    f'function EngagementPage(){{return e("div",{{class:"page eng-page",children:['
    f'{ENG_HDR},{ENG_KPI},{ENG_AI},{ENG_TABLE}'
    f']}});}}' 
)

# ══════════════════════════════════════════════════════════════════════════════
# COMBINE ALL PAGE FUNCTIONS
# ══════════════════════════════════════════════════════════════════════════════
ALL_PAGES = '\n'.join([
    AR_PAGE, LE_PAGE, RMD_PAGE, TAX_PAGE, BO_PAGE,
    SUIT_PAGE, LTC_PAGE, VC_PAGE, PD_PAGE, RN_PAGE, ENG_PAGE
])

# Find injection point: before function Pl() (main app)
ANCHOR = 'function Pl(){'
idx = c.find(ANCHOR)
if idx == -1:
    # Try alternate - find the export default handler area
    idx = c.rfind('function Kl()')
    print(f"Using Kl fallback, idx={idx}")
else:
    print(f"Found Pl at {idx}")

if idx >= 0:
    c = c[:idx] + ALL_PAGES + '\n' + c[idx:]
    print("✅ Injected all 12 page functions")
else:
    print("❌ Could not find injection point")

with open('dist/_worker.js', 'w') as f:
    f.write(c)
print(f"Saved. Size: {len(c)} chars")
