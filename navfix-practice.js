/* ── NAVFIX-PRACTICE ── Practice nav item + iframe renderer ────────────── */
(function () {
  'use strict';

  var _nfpPrev = window.navigateTo;

  /* ── 1. Inject nav item into sidebar (covers the compiled Worker HTML) ── */
  function _nfpInjectNav() {
    if (document.getElementById('nav-practice')) return; // already injected

    // Find the AI Planner nav item as the insertion anchor
    var anchor = Array.from(document.querySelectorAll('.nav-item')).find(function (el) {
      var oc = el.getAttribute('onclick') || '';
      return oc.indexOf("'calendar'") !== -1 || oc.indexOf('"calendar"') !== -1;
    });
    if (!anchor) return; // sidebar not rendered yet — MO will retry

    var a = document.createElement('a');
    a.id = 'nav-practice';
    a.className = 'nav-item practice-nav nav-grp-carrier nav-grp-tpa';
    a.setAttribute('onclick', "navigateTo('practice')");
    a.setAttribute('href', 'javascript:void(0)');
    a.innerHTML = '<i class="fas fa-flask"></i><span>Practice</span>';
    anchor.insertAdjacentElement('afterend', a);
    console.log('[NAVFIX-PRACTICE] Nav item injected after AI Planner');
  }

  /* ── 2. navigateTo handler ── */
  function _nfpShowPage() {
    // Update page title & breadcrumb
    var tEl = document.getElementById('page-title');
    var bEl = document.getElementById('page-breadcrumb') ||
              document.getElementById('breadcrumb-page');
    if (tEl) tEl.textContent = 'Practice';
    if (bEl) bEl.textContent = 'Home / Practice';

    // Highlight nav item
    document.querySelectorAll('.nav-item').forEach(function (el) {
      el.classList.remove('active');
    });
    var hit = document.getElementById('nav-practice');
    if (!hit) {
      hit = Array.from(document.querySelectorAll('.nav-item')).find(function (el) {
        return (el.getAttribute('onclick') || '').indexOf("'practice'") !== -1;
      });
    }
    if (hit) hit.classList.add('active');

    // Render iframe into #page-content
    var content = document.getElementById('page-content');
    if (!content) return;
    content.innerHTML =
      '<div style="width:100%;height:calc(100vh - 64px);display:flex;flex-direction:column;">' +
        '<iframe ' +
          'src="https://arzbjbyh.gensparkspace.com/index.html" ' +
          'style="flex:1;width:100%;border:none;border-radius:0;" ' +
          'allow="fullscreen" ' +
          'loading="eager" ' +
          'title="Practice">' +
        '</iframe>' +
      '</div>';
  }

  /* ── 3. Override navigateTo ── */
  window.navigateTo = function (page, opts) {
    if (page === 'practice') {
      _nfpShowPage();
      return;
    }
    if (typeof _nfpPrev === 'function') _nfpPrev(page, opts);
  };

  /* ── 4. Inject nav on DOM ready (and retry via MutationObserver) ── */
  function _nfpTryInject() {
    _nfpInjectNav();
    if (!document.getElementById('nav-practice')) {
      // Sidebar not ready yet — observe
      var mo = new MutationObserver(function () {
        if (_nfpInjectNav() !== false) {
          if (document.getElementById('nav-practice')) mo.disconnect();
        }
      });
      mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _nfpTryInject);
  } else {
    _nfpTryInject();
    // Also try after a short delay for late-rendered sidebars
    setTimeout(_nfpTryInject, 800);
    setTimeout(_nfpTryInject, 2000);
  }

  console.log('[NAVFIX-PRACTICE] Installed — Practice nav item + iframe: https://arzbjbyh.gensparkspace.com/index.html');
})();
