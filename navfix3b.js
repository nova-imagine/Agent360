
/* ═══════════════════════════════════════════════════════════════════════
   NAVFIX3b — ltc-bre BRE page upgrade
   
   P41 has a FULL Business Rules Engine renderer (_p41buildBREPage) that
   writes to getElementById('tpl-ltc-bre'). NAVFIX3's inline stub is
   replaced here: we delegate to the chain (which triggers P41), then
   poll tpl-ltc-bre and copy to #page-content.
   
   Also: P41 wraps navigateTo to call _p41onNavigate(page) AFTER the
   original chain runs. So when NAVFIX3b delegates to _nf3bPrev, P41's
   wrapper fires _p41buildBREPage() after 80ms. We poll for 2 seconds.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var _nf3bPrev = window.navigateTo;

  function _nf3bUI(page, title, bc) {
    var tEl = document.getElementById('page-title');
    var bEl = document.getElementById('page-breadcrumb') ||
              document.getElementById('breadcrumb-page');
    if (tEl) tEl.textContent = title || page;
    if (bEl) bEl.textContent = bc || '';
    document.querySelectorAll('.nav-item').forEach(function(el){ el.classList.remove('active'); });
    var hit = Array.from(document.querySelectorAll('.nav-item')).find(function(el){
      var oc = el.getAttribute('onclick') || '';
      return oc.indexOf("'" + page + "'") !== -1 || oc.indexOf('"' + page + '"') !== -1;
    });
    if (!hit) {
      hit = document.getElementById('nav-ltc-bre');
    }
    if (hit) hit.classList.add('active');
  }

  function _nf3bSwapRetry(tplId, maxAttempts, intervalMs) {
    var attempts = 0;
    var max = maxAttempts || 16;
    var iv  = intervalMs  || 125;
    var timer = setInterval(function () {
      attempts++;
      var content = document.getElementById('page-content');
      var tpl     = document.getElementById(tplId);
      if (tpl && tpl.innerHTML.trim().length > 100) {
        if (content) content.innerHTML = tpl.innerHTML;
        clearInterval(timer);
        return;
      }
      if (attempts >= max) clearInterval(timer);
    }, iv);
  }

  window.navigateTo = function (page, opts) {

    if (page === 'ltc-bre') {
      _nf3bUI(page, 'Business Rules Engine', 'Home / LTC Operations / Business Rules Engine');

      /* Ensure tpl container exists (P41 writes here) */
      if (!document.getElementById('tpl-ltc-bre')) {
        var tpl = document.createElement('div');
        tpl.id = 'tpl-ltc-bre';
        tpl.style.display = 'none';
        document.body.appendChild(tpl);
      }

      /* Trigger the chain (P41 wrapper fires _p41buildBREPage in 80ms) */
      if (typeof _nf3bPrev === 'function') _nf3bPrev(page, opts);

      /* Poll for tpl-ltc-bre to fill, then copy to page-content */
      _nf3bSwapRetry('tpl-ltc-bre', 16, 125);
      return;
    }

    /* Everything else → pass through */
    if (typeof _nf3bPrev === 'function') _nf3bPrev(page, opts);
  };

  var navigateTo = window.navigateTo;

  console.log('[NAVFIX3b] ltc-bre upgraded — delegates to P41 renderer + swapRetry(tpl-ltc-bre)');
})();
