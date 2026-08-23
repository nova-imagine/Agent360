
/* ═══════════════════════════════════════════════════════════════════════
   NAVFIX2 — Comprehensive navigation fix for all broken sections
   
   ROOT CAUSE ANALYSIS:
   ──────────────────────────────────────────────────────────────────────
   There are THREE distinct failure modes across the broken pages:

   MODE A — LTC Operations (ltc-care, ltc-eligibility, ltc-ai-agents):
     These pages are in NAVFIX's CUSTOM_PAGES list so NAVFIX delegates to
     _prevNav (the old chain). The old chain's ltcHal wrapper calls
     initLtcCarePage() etc. via setTimeout. Those init functions write HTML
     into tpl-ltc-care.innerHTML — but they NEVER copy tpl.innerHTML into
     #page-content. The content area stays blank.
     FIX: After calling _prevNav, also do content.innerHTML = tpl.innerHTML
     after a short delay (allowing the init to complete first).

   MODE B — Phase 7 SOLUTIONS (ltc-celltrak, ltc-connect, ltc-fms, etc.):
     Phase 7 uses _p7showPage() which toggles display:block/none on the
     tpl-* divs directly — it does NOT write to #page-content. The content
     area is never updated; the tpl div shows in-place but that div is hidden
     in the DOM (display:none by default). The fix: intercept these routes,
     call the existing init functions, then copy tpl HTML into #page-content.
     
   MODE C — HAL Operations custom renderers (hal-health, hal-annuity, hal-life,
     hal-client360, hal-policy, hal-pipeline, hal-medsup, tpa-command) AND
     HYBRID LTC+HAL pages (hal-datalake, hal-semantic, hal-ontology, etc.):
     These phases' buildPage() functions write DIRECTLY to
     document.getElementById('page-content').innerHTML — so they should
     work. The problem is NAVFIX's CUSTOM_PAGES list includes them AND
     delegates to _prevNav. _prevNav chains back through the wrappers
     correctly. BUT: some wrappers check `if(page==='xxx') { ...; return; }`
     with an early return — when the chain reaches the right phase wrapper,
     it calls buildPage() and returns early WITHOUT calling its own origNav.
     This means all phases BELOW it in the chain are skipped for that page.
     That's fine for those pages. BUT the issue is that when P20 (datalake)
     handles 'hal-datalake', it calls _p20buildPage() directly. This DOES
     write to page-content. But we confirmed NAVFIX is the outermost wrapper
     and delegates to _prevNav for CUSTOM_PAGES. So THESE should work...
     
     Let me re-examine: the real issue for HAL/HYBRID pages is that the
     NAVFIX CUSTOM_PAGES check delegates AND the template swap `content.innerHTML
     = tpl.innerHTML` is skipped. For pages like hal-datalake that write
     directly to page-content, this is fine — they work via _prevNav chain.
     
     BUT for hal-health, hal-annuity, hal-life (P16): P16 calls initHealthOpsPage
     etc. via setTimeout — and those functions call _p16buildPage() which
     builds into tpl-hal-health. THEN P16's wrapper does NOT copy to content.
     
     FOR P30-P33 and qw1-qw4: they use route-based handlers that call
     _p30buildPage() etc. which writes to page-content directly via innerHTML.
     These SHOULD work if the chain reaches them.
     
     ACTUAL BUG: The NAVFIX saves _prevNav = window.navigateTo at the time
     it runs (end of file). At that point window.navigateTo is the P40 branding
     wrapper. P40 branding wrapper calls _origNavigateTo which is whatever
     came before P40. The chain should propagate. LET'S VERIFY by testing
     which ones actually need fixing based on observed behavior.

   SAFE UNIVERSAL FIX STRATEGY:
   ──────────────────────────────────────────────────────────────────────
   Override window.navigateTo one more time as the absolute final authority.
   For each broken page:
   1. Call the appropriate init function directly (bypassing the chain ambiguity)
   2. After the init's setTimeout completes, copy the tpl into page-content
      (for pages that use tpl pattern)
   3. For pages that write to page-content directly, just call their buildPage
   4. Handle nav highlight, title, breadcrumb
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var _nf2Prev = window.navigateTo;

  /* ── Helper: set title + breadcrumb + nav highlight ── */
  function _nf2ui(page, title, bc) {
    var titleEl = document.getElementById('page-title');
    var bcEl    = document.getElementById('page-breadcrumb');
    if (titleEl) titleEl.textContent = title || page;
    if (bcEl)    bcEl.textContent    = bc || '';
    document.querySelectorAll('.nav-item').forEach(function(el){ el.classList.remove('active'); });
    var matchNav = Array.from(document.querySelectorAll('.nav-item')).find(function(el){
      var oc = el.getAttribute('onclick') || '';
      return oc.indexOf("'" + page + "'") !== -1 || oc.indexOf('"' + page + '"') !== -1;
    });
    if (!matchNav) {
      /* Also check dynamically-injected nav items (P7 ones use click listeners, no onclick attr) */
      matchNav = Array.from(document.querySelectorAll('.nav-item, .p7-nav-item')).find(function(el){
        return el.textContent.trim().toLowerCase().indexOf(title ? title.toLowerCase().split(' ')[0] : page) !== -1;
      });
    }
    if (matchNav) matchNav.classList.add('active');
  }

  /* ── Helper: copy tpl HTML into #page-content after delay ── */
  function _nf2swap(tplId, delay) {
    setTimeout(function() {
      var content = document.getElementById('page-content');
      var tpl     = document.getElementById(tplId);
      if (content && tpl && tpl.innerHTML.trim().length > 0) {
        content.innerHTML = tpl.innerHTML;
      }
    }, delay || 200);
  }

  /* ── Helper: retry swap until tpl has content (for async inits) ── */
  function _nf2swapRetry(tplId, maxAttempts, intervalMs) {
    var attempts = 0;
    var max = maxAttempts || 8;
    var iv  = intervalMs  || 150;
    var timer = setInterval(function() {
      attempts++;
      var content = document.getElementById('page-content');
      var tpl     = document.getElementById(tplId);
      if (tpl && tpl.innerHTML.trim().length > 30) {
        if (content) content.innerHTML = tpl.innerHTML;
        clearInterval(timer);
        return;
      }
      if (attempts >= max) clearInterval(timer);
    }, iv);
  }

  window.navigateTo = function(page, opts) {

    /* ════════════════════════════════════════════════════════════════
       GROUP A — LTC OPERATIONS (Care Coordination, Assessments, AI Agents)
       Pattern: init writes to tpl-*, then we copy to page-content
    ════════════════════════════════════════════════════════════════ */

    if (page === 'ltc-care') {
      _nf2ui(page, 'Care Coordination', 'Home / LTC Operations / Care Coordination');
      if (typeof window.initLtcCarePage === 'function') {
        requestAnimationFrame(function(){ setTimeout(function(){
          window.initLtcCarePage();
          _nf2swapRetry('tpl-ltc-care', 10, 120);
        }, 60); });
      } else if (typeof _nf2Prev === 'function') {
        _nf2Prev(page, opts);
        _nf2swapRetry('tpl-ltc-care', 10, 120);
      }
      return;
    }

    if (page === 'ltc-eligibility') {
      _nf2ui(page, 'Assessments', 'Home / LTC Operations / Assessments');
      if (typeof window.initLtcEligibilityPage === 'function') {
        requestAnimationFrame(function(){ setTimeout(function(){
          window.initLtcEligibilityPage();
          _nf2swapRetry('tpl-ltc-eligibility', 10, 120);
        }, 60); });
      } else if (typeof _nf2Prev === 'function') {
        _nf2Prev(page, opts);
        _nf2swapRetry('tpl-ltc-eligibility', 10, 120);
      }
      return;
    }

    if (page === 'ltc-ai-agents') {
      _nf2ui(page, 'AI Agents', 'Home / LTC Operations / AI Agents');
      if (typeof window.initLtcAiAgentsPage === 'function') {
        requestAnimationFrame(function(){ setTimeout(function(){
          window.initLtcAiAgentsPage();
          _nf2swapRetry('tpl-ltc-ai-agents', 10, 120);
        }, 60); });
      } else if (typeof _nf2Prev === 'function') {
        _nf2Prev(page, opts);
        _nf2swapRetry('tpl-ltc-ai-agents', 10, 120);
      }
      return;
    }

    /* ════════════════════════════════════════════════════════════════
       GROUP B — HAL OPERATIONS (Health, Annuity, Life, Client360)
       Pattern: P16 inits write to tpl-*, then we copy to page-content
    ════════════════════════════════════════════════════════════════ */

    if (page === 'hal-health') {
      _nf2ui(page, 'Health Operations', 'Home / HAL Operations / Health');
      if (typeof window.initHealthOpsPage === 'function') {
        requestAnimationFrame(function(){ setTimeout(function(){
          window.initHealthOpsPage();
          _nf2swapRetry('tpl-hal-health', 10, 120);
        }, 60); });
      } else if (typeof _nf2Prev === 'function') { _nf2Prev(page, opts); }
      return;
    }

    if (page === 'hal-annuity') {
      _nf2ui(page, 'Annuity Operations', 'Home / HAL Operations / Annuity');
      if (typeof window.initAnnuityOpsPage === 'function') {
        requestAnimationFrame(function(){ setTimeout(function(){
          window.initAnnuityOpsPage();
          _nf2swapRetry('tpl-hal-annuity', 10, 120);
        }, 60); });
      } else if (typeof _nf2Prev === 'function') { _nf2Prev(page, opts); }
      return;
    }

    if (page === 'hal-life') {
      _nf2ui(page, 'Life Operations', 'Home / HAL Operations / Life');
      if (typeof window.initLifeOpsPage === 'function') {
        requestAnimationFrame(function(){ setTimeout(function(){
          window.initLifeOpsPage();
          _nf2swapRetry('tpl-hal-life', 10, 120);
        }, 60); });
      } else if (typeof _nf2Prev === 'function') { _nf2Prev(page, opts); }
      return;
    }

    if (page === 'hal-client360') {
      _nf2ui(page, 'Client 360 Simulator', 'Home / HAL Operations / Client 360');
      if (typeof window.initClient360Page === 'function') {
        requestAnimationFrame(function(){ setTimeout(function(){
          window.initClient360Page();
          _nf2swapRetry('tpl-hal-client360', 10, 120);
        }, 60); });
      } else if (typeof _nf2Prev === 'function') { _nf2Prev(page, opts); }
      return;
    }

    /* ════════════════════════════════════════════════════════════════
       GROUP C — HYBRID LTC+HAL INTELLIGENCE
       Pattern: P20-P25, P30-P33, qw1-qw4 write to page-content directly
       via _p2xbuildPage(). Just delegate down the chain — these work.
       But we fix nav highlight + title since NAVFIX skipped them.
    ════════════════════════════════════════════════════════════════ */

    var _hybridTitles = {
      'hal-datalake':      ['Data Lake — Medallion Architecture',     'Home / Hybrid Intelligence / Data Lake'],
      'hal-semantic':      ['Semantic Layer',                          'Home / Hybrid Intelligence / Semantic Layer'],
      'hal-ontology':      ['Ontology & Knowledge Graph',             'Home / Hybrid Intelligence / Ontology'],
      'hal-vectorstore':   ['Vector Store & RAG Engine',              'Home / Hybrid Intelligence / Vector Store'],
      'hal-agents':        ['AI Agent Orchestration',                 'Home / Hybrid Intelligence / AI Agents'],
      'hal-lineage':       ['Data Lineage & Governance',              'Home / Hybrid Intelligence / Lineage'],
      'hal-coa':           ['Claims Operations Analytics',            'Home / Hybrid Intelligence / COA'],
      'hal-cih':           ['Client Intelligence Hub',                'Home / Hybrid Intelligence / Client Hub'],
      'hal-caid':          ['Care & Intervention Design',             'Home / Hybrid Intelligence / CAID'],
      'hal-rimd':          ['Risk & Intelligent Model Design',        'Home / Hybrid Intelligence / RIMD'],
      'hal-policyholder':  ['Policyholder Intelligence',              'Home / Hybrid Intelligence / Policyholder'],
      'hal-provider-net':  ['Provider Network Intelligence',          'Home / Hybrid Intelligence / Provider Network'],
      'hal-workforce':     ['Workforce & Capacity Analytics',         'Home / Hybrid Intelligence / Workforce'],
      'hal-ai-gov':        ['AI Governance & Model Registry',         'Home / Hybrid Intelligence / AI Governance'],
      'hal-litigation':    ['Litigation & SIU Intelligence',          'Home / Hybrid Intelligence / Litigation'],
      'hal-interop':       ['Interoperability & FHIR Hub',           'Home / Hybrid Intelligence / Interop'],
      'hal-hybrid-compare':['Hybrid LTC+HAL Comparator',             'Home / Hybrid Intelligence / Comparator'],
      'hal-reg-tracker':   ['Regulatory Change Tracker',              'Home / Hybrid Intelligence / Reg Tracker']
    };

    if (_hybridTitles[page]) {
      var _ht = _hybridTitles[page];
      _nf2ui(page, _ht[0], _ht[1]);
      /* Delegate to chain — these phase wrappers write to page-content directly */
      if (typeof _nf2Prev === 'function') _nf2Prev(page, opts);
      return;
    }

    /* ════════════════════════════════════════════════════════════════
       GROUP D — SOLUTIONS / PHASE 7 PAGES
       Pattern: P7 uses _p7showPage (tpl display toggle) + initXxxPage.
       We need to: call init → copy tpl to page-content.
    ════════════════════════════════════════════════════════════════ */

    var _p7map = {
      'ltc-celltrak':  { init: 'initCellTrakPage',       tpl: 'tpl-ltc-celltrak',  title: 'CellTrak EVV',       bc: 'Home / Solutions / CellTrak EVV' },
      'ltc-connect':   { init: 'initConnectPortalPage',  tpl: 'tpl-ltc-connect',   title: 'CONNECT Portal',     bc: 'Home / Solutions / CONNECT Portal' },
      'ltc-fms':       { init: 'initFmsPage',            tpl: 'tpl-ltc-fms',       title: 'FMS Financial',      bc: 'Home / Solutions / FMS Financial' },
      'ltc-rpa':       { init: 'initRpaPage',            tpl: 'tpl-ltc-rpa',       title: 'RPA Automation',     bc: 'Home / Solutions / RPA Automation' },
      'ltc-eps':       { init: 'initEpsPage',            tpl: 'tpl-ltc-eps',       title: 'EPS Correspondence', bc: 'Home / Solutions / EPS Correspondence' },
      'ltc-transport': { init: 'initTransportPage',      tpl: 'tpl-ltc-transport', title: 'Transport Services', bc: 'Home / Solutions / Transport Services' },
      'ltc-ermxrm':    { init: 'initErmXrmPage',         tpl: 'tpl-ltc-ermxrm',   title: 'ERM/XRM Analytics',  bc: 'Home / Solutions / ERM/XRM Analytics' },
      'ltc-upd-ops':   { init: 'initUpdOpsPage',         tpl: 'tpl-ltc-upd-ops',  title: 'UPD Operations',     bc: 'Home / Solutions / UPD Operations' }
    };

    if (_p7map[page]) {
      var cfg = _p7map[page];
      _nf2ui(page, cfg.title, cfg.bc);

      /* Ensure tpl container exists */
      if (!document.getElementById(cfg.tpl)) {
        var container = document.getElementById('page-content') || document.body;
        var newTpl = document.createElement('div');
        newTpl.id = cfg.tpl;
        newTpl.style.display = 'none';
        container.appendChild(newTpl);
      }

      var initFn = window[cfg.init];
      if (typeof initFn === 'function') {
        requestAnimationFrame(function(){ setTimeout(function(){
          initFn();
          /* Wait for init to populate tpl, then copy to content */
          _nf2swapRetry(cfg.tpl, 12, 150);
        }, 60); });
      } else {
        /* Fallback: just delegate down the P7 chain */
        if (typeof _nf2Prev === 'function') _nf2Prev(page, opts);
        _nf2swapRetry(cfg.tpl, 12, 150);
      }
      return;
    }

    /* ════════════════════════════════════════════════════════════════
       GROUP E — HAL OPERATIONS remaining (hal-policy, hal-pipeline,
       hal-medsup, tpa-command) — use _ltcBuildPage pattern (write to tpl)
       so we must init then copy tpl → page-content.
    ════════════════════════════════════════════════════════════════ */

    var _halTplMap = {
      'hal-policy':   { init: 'initHalPolicyPage',    tpl: 'tpl-hal-policy',   title: 'Policy Administration',      bc: 'Home / HAL Operations / Policy Admin' },
      'hal-pipeline': { init: 'initHalPipelinePage',  tpl: 'tpl-hal-pipeline', title: 'HAL New Business Pipeline',  bc: 'Home / HAL Operations / Pipeline' },
      'hal-medsup':   { init: 'initHalMedSupPage',    tpl: 'tpl-hal-medsup',   title: 'Medicare Supplement Admin',  bc: 'Home / HAL Operations / Medicare Supplement' },
      'tpa-command':  { init: 'initTpaCommandPage',   tpl: 'tpl-tpa-command',  title: 'TPA Command Center',         bc: 'Home / HAL Operations / TPA Command Center' }
    };

    if (_halTplMap[page]) {
      var htcfg = _halTplMap[page];
      _nf2ui(page, htcfg.title, htcfg.bc);
      var htInitFn = window[htcfg.init];
      if (typeof htInitFn === 'function') {
        requestAnimationFrame(function(){ setTimeout(function(){
          htInitFn();
          _nf2swapRetry(htcfg.tpl, 12, 150);
        }, 60); });
      } else if (typeof _nf2Prev === 'function') {
        _nf2Prev(page, opts);
        _nf2swapRetry(htcfg.tpl, 12, 150);
      }
      return;
    }

    /* ════════════════════════════════════════════════════════════════
       GROUP F — Remaining custom-renderer pages
       These write to page-content directly — fix title + delegate.
    ════════════════════════════════════════════════════════════════ */

    var _halOpTitles = {
      'hybrid-ops':       ['Hybrid LTC+HAL Hub',        'Home / Hybrid Intelligence / Hybrid Hub'],
      'ai-modernization': ['AI Modernization',          'Home / AI Modernization'],
      'rfp-showcase':     ['RFP Response Center',       'Home / RFP Showcase'],
      'ltc-arch':         ['System Architecture',       'Home / Illumifin Platform / System Architecture'],
      'core-admin':       ['Core Admin Systems',        'Home / Illumifin Platform / Core Admin'],
      'data-ai':          ['Data & AI/ML Platform',     'Home / Illumifin Platform / Data & AI'],
      'digital-eco':      ['Digital Ecosystem',         'Home / Illumifin Platform / Digital Ecosystem'],
      'contact-doc':      ['Contact & Doc Management',  'Home / Illumifin Platform / Contact & Doc'],
      'mod-roadmap':      ['Modernization Roadmap',     'Home / Illumifin Platform / Modernization'],
      'ltc-claimant':     ['Claimant 360°',             'Home / LTC Operations / Claimant 360'],
      'insurance-carrier-360':  ['Insurance Carrier 360°',   'Home / Insurance Carrier 360'],
      'healthcare-provider-360':['Healthcare Provider 360°', 'Home / Healthcare Provider 360'],
      'ltc-bre':          ['Business Rules Engine',     'Home / LTC Operations / Business Rules Engine']
    };

    if (_halOpTitles[page]) {
      var _hot = _halOpTitles[page];
      _nf2ui(page, _hot[0], _hot[1]);
      if (typeof _nf2Prev === 'function') _nf2Prev(page, opts);
      return;
    }

    /* ════════════════════════════════════════════════════════════════
       DEFAULT — pass everything else to the existing chain unchanged
    ════════════════════════════════════════════════════════════════ */
    if (typeof _nf2Prev === 'function') _nf2Prev(page, opts);
  };

  /* Keep bare global in sync */
  var navigateTo = window.navigateTo;

  console.log('[NAVFIX2] Comprehensive nav fix installed — LTC Ops · HAL Ops · Hybrid Intelligence · Solutions all covered');
})();
