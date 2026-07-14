/* ERRORCATCH v7 — MutationObserver rebind + live click counter */
(function() {
  'use strict';
  var errors = [];
  var clickCount = 0;
  var suppressedCount = 0;
  var totalRebound = 0;
  var _banner = null;

  /* ── Suppress verbose module-loaded spam ───────────────────────── */
  var _origLog = console.log;
  var SPAM_PATTERNS = /loaded|module loaded|functions|ready|active|Phase \d+|LTC Phase|ADV Step|RET Step|INV Step|Pass \d+/i;

  console.log = function() {
    var msg = String(arguments[0] || '');
    if (SPAM_PATTERNS.test(msg) &&
        !msg.startsWith('[EC7]') &&
        !msg.startsWith('[P40]') &&
        !msg.startsWith('[P41]') &&
        !msg.startsWith('[HAL') &&
        !msg.startsWith('[ERRORCATCH]')) {
      suppressedCount++;
      return;
    }
    _origLog.apply(console, arguments);
  };

  /* ── Error capture ──────────────────────────────────────────────── */
  window.onerror = function(msg, src, line) {
    errors.push(msg.substring(0, 80) + ' @' + (src || '').split('/').pop() + ':' + line);
    _origLog('[EC7] ERROR:', errors[errors.length - 1]);
    return false;
  };
  window.addEventListener('unhandledrejection', function(e) {
    errors.push('PROMISE: ' + String(e.reason || '?').substring(0, 60));
    _origLog('[EC7] PROMISE ERROR:', errors[errors.length - 1]);
  });

  /* ── Click interceptor (capture phase — fires before anything else) */
  document.addEventListener('click', function(e) {
    clickCount++;
    updateBanner();
    /* Prevent href="#" from scrolling to top */
    var el = e.target;
    while (el && el !== document) {
      if (el.tagName === 'A') {
        var h = el.getAttribute('href');
        if (h === '#' || h === '' || h === 'javascript:void(0)') { e.preventDefault(); }
        break;
      }
      el = el.parentElement;
    }
  }, true);

  /* ── Rebind: attach addEventListener for every [onclick] element ── */
  function rebind(root) {
    var n = 0;
    var scope = root || document;
    scope.querySelectorAll('[onclick]').forEach(function(el) {
      if (el._r7) return;      /* already bound this version */
      var s = el.getAttribute('onclick');
      if (!s) return;
      el._r7 = true;
      el.addEventListener('click', function(e) {
        try { (new Function('event', s)).call(this, e); }
        catch (err) { _origLog('[EC7] onclick err:', err.message.substring(0, 60)); }
      });
      n++;
    });
    totalRebound += n;
    return n;
  }

  /* ── MutationObserver: rebind any new nodes injected into the DOM ─ */
  var _moTimer = null;
  var _observer = new MutationObserver(function(mutations) {
    var hasNew = false;
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { hasNew = true; } /* Element node */
      });
    });
    if (!hasNew) return;
    /* Debounce: wait 120ms after the last mutation burst before rebinding */
    clearTimeout(_moTimer);
    _moTimer = setTimeout(function() {
      var n = rebind();
      if (n > 0) {
        _origLog('[EC7] MO rebound ' + n + ' new handlers (total=' + totalRebound + ')');
        updateBanner();
      }
    }, 120);
  });

  /* Start observing as soon as possible */
  function startObserver() {
    if (document.body) {
      _observer.observe(document.body, { childList: true, subtree: true });
      _origLog('[EC7] MutationObserver active on body ✓');
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        _observer.observe(document.body, { childList: true, subtree: true });
        _origLog('[EC7] MutationObserver active on body (DOMContentLoaded) ✓');
      });
    }
  }
  startObserver();

  /* ── Banner update helper ────────────────────────────────────────── */
  function updateBanner() {
    if (!_banner) return;
    var errPart = errors.length
      ? '<span style="color:#f87171">' + errors.length + ' ERR ⚠</span>'
      : '<span style="color:#4ade80">no errors ✓</span>';
    _banner.innerHTML =
      '<b style="color:#e2e8f0">EC v7</b> ' + errPart + '<br>' +
      'clicks:<b style="color:#fbbf24">' + clickCount + '</b>' +
      ' rebound:<b style="color:#60a5fa">' + totalRebound + '</b><br>' +
      '<span style="color:#94a3b8">click to dismiss</span>';
  }

  /* ── POST-LOAD diagnostic ───────────────────────────────────────── */
  window.addEventListener('load', function() {
    var W = window.innerWidth, H = window.innerHeight;
    var navOk  = typeof window.navigateTo       === 'function';
    var p40ok  = typeof window._p40LifeAiTriage === 'function';

    _origLog('[EC7] ==========================================');
    _origLog('[EC7] POST-LOAD (suppressed', suppressedCount, 'spam logs)');
    _origLog('[EC7] viewport:', W + 'x' + H);
    _origLog('[EC7] navigateTo:', navOk ? 'FUNCTION ✓' : 'MISSING ✗');
    _origLog('[EC7] _p40LifeAiTriage:', p40ok ? 'FUNCTION ✓' : 'MISSING ✗');
    _origLog('[EC7] errors so far:', errors.length);
    if (errors.length) errors.forEach(function(e, i) { _origLog('[EC7] err[' + i + ']:', e); });

    /* elementFromPoint spot checks */
    var cx = Math.round(W / 2), cy = Math.round(H / 2);
    var cEl = document.elementFromPoint(cx, cy);
    _origLog('[EC7] center(' + cx + ',' + cy + '):', cEl ? (cEl.tagName + '#' + (cEl.id || '') + '.' + ((cEl.className || '').toString().split(' ')[0])) : 'NULL');

    var sEl = document.elementFromPoint(80, Math.round(H / 2));
    _origLog('[EC7] sidebar(80,' + Math.round(H / 2) + '):', sEl ? (sEl.tagName + '.' + ((sEl.className || '').toString().split(' ')[0])) : 'NULL');

    /* Computed styles on key elements */
    var bcs = window.getComputedStyle(document.body);
    _origLog('[EC7] body: pe=' + bcs.pointerEvents + ' overflow=' + bcs.overflow);

    var ar = document.getElementById('app-root');
    if (ar) {
      var arcs = window.getComputedStyle(ar);
      var arr  = ar.getBoundingClientRect();
      _origLog('[EC7] #app-root: pe=' + arcs.pointerEvents + ' ' + Math.round(arr.width) + 'x' + Math.round(arr.height));
    }

    var sb = document.getElementById('sidebar');
    if (sb) {
      var sbcs = window.getComputedStyle(sb);
      var sbr  = sb.getBoundingClientRect();
      _origLog('[EC7] #sidebar: pe=' + sbcs.pointerEvents + ' pos=' + sbcs.position +
               ' ' + Math.round(sbr.width) + 'x' + Math.round(sbr.height));
    }

    /* Blocker scan */
    var blk = [];
    document.querySelectorAll('*').forEach(function(el) {
      if (el.id === '_ec7') return;
      var cs = window.getComputedStyle(el);
      var r  = el.getBoundingClientRect();
      if (r.width >= W * 0.8 && r.height >= H * 0.8 && r.top <= 20 && r.left <= 20 &&
          cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.05) {
        var zi = parseInt(cs.zIndex) || 0;
        if (zi > 200 || cs.position === 'fixed') {
          _origLog('[EC7] BLOCKER:', el.tagName, el.id || '', (el.className || '').toString().substring(0, 30),
            'pe=' + cs.pointerEvents + ' zi=' + zi);
          blk.push(el);
        }
      }
    });
    if (!blk.length) _origLog('[EC7] No fullscreen blockers ✓');

    /* Fire navigateTo('dashboard') to settle initial page */
    if (navOk) {
      try {
        window.navigateTo('dashboard');
        _origLog('[EC7] navigateTo("dashboard") OK ✓');
      } catch (e) {
        _origLog('[EC7] navigateTo THREW:', e.message);
      }
    } else {
      _origLog('[EC7] *** navigateTo MISSING — onclick will fail! ***');
    }

    /* Full initial rebind */
    var nb = rebind();
    _origLog('[EC7] initial onclick rebound:', nb, '(total=' + totalRebound + ')');
    _origLog('[EC7] ==========================================');

    /* Banner */
    _banner = document.createElement('div');
    _banner.id = '_ec7';
    _banner.style.cssText =
      'position:fixed;bottom:8px;right:8px;z-index:2147483647;pointer-events:all;' +
      'background:rgba(15,23,42,0.95);color:#4ade80;font:11px monospace;padding:8px 12px;' +
      'border-radius:8px;min-width:230px;cursor:pointer;' +
      'border:1px solid rgba(74,222,128,0.4);line-height:1.8;user-select:none;';
    updateBanner();
    _banner.addEventListener('click', function(e) { e.stopPropagation(); _banner.remove(); _banner = null; });
    document.body.appendChild(_banner);
  });

  _origLog('[ERRORCATCH] v7 loaded — MutationObserver rebind + live click counter active');
})();
