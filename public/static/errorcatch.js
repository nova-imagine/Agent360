/* Error catcher + Edge/tracking-prevention fix + click diagnostic - P40 */
(function() {
  'use strict';
  var errors = [];
  var clickCount = 0;
  var fixCount = 0;

  /* ── FIX 1: Intercept all href="#" links and prevent default scroll jump ── */
  /* This fixes Edge Tracking Prevention interfering with onclick on anchor tags */
  document.addEventListener('click', function(e) {
    clickCount++;
    
    // Walk up from click target to find the anchor
    var el = e.target;
    while (el && el !== document) {
      if (el.tagName === 'A') {
        var href = el.getAttribute('href');
        // Prevent href="#" from jumping to top of page / interfering with onclick
        if (href === '#' || href === '' || href === 'javascript:void(0)') {
          e.preventDefault();
          fixCount++;
        }
        break;
      }
      el = el.parentElement;
    }
    
    updateBanner();
  }, true); // capture=true: runs before element's own handler
  
  /* ── FIX 2: Ensure onclick attributes work by re-binding them as event listeners ── */
  /* Edge sometimes blocks inline onclick on cross-origin pages */
  function rebindOnclickHandlers() {
    var count = 0;
    document.querySelectorAll('[onclick]').forEach(function(el) {
      if (el._onclickRebound) return; // already done
      var onclickStr = el.getAttribute('onclick');
      if (!onclickStr) return;
      
      el._onclickRebound = true;
      el._onclickStr = onclickStr;
      
      // Add a native event listener that calls the onclick string
      el.addEventListener('click', function(e) {
        try {
          // Execute the onclick string in window context
          var fn = new Function('event', onclickStr);
          fn.call(this, e);
        } catch(err) {
          console.warn('[ERRORCATCH] onclick rebind error:', err.message, 'on', onclickStr.substring(0,60));
        }
      });
      count++;
    });
    if (count > 0) {
      console.log('[ERRORCATCH] Rebound ' + count + ' onclick handlers as event listeners');
    }
    return count;
  }
  
  /* ── FIX 3: Remove stuck blocking overlays ── */
  function cleanStuckOverlays() {
    var removed = 0;
    try {
      document.querySelectorAll('div, section').forEach(function(el) {
        if (el.id === '_diag_banner') return;
        var cs = window.getComputedStyle(el);
        if (cs.position === 'fixed' && 
            (parseInt(cs.zIndex) || 0) > 1000 &&
            cs.display !== 'none' &&
            cs.visibility !== 'hidden' &&
            parseFloat(cs.opacity) > 0.1) {
          var rect = el.getBoundingClientRect();
          if (rect.width > window.innerWidth * 0.8 && rect.height > window.innerHeight * 0.8) {
            console.log('[ERRORCATCH] Removing blocking overlay:', el.id || el.className.substring(0,40));
            el.remove();
            removed++;
          }
        }
      });
    } catch(err) {}
    return removed;
  }

  /* ── Error capture ── */
  window.onerror = function(msg, src, line, col, err) {
    errors.push((msg||'') + ' @ ' + (src||'?').split('/').pop() + ':' + line);
    updateBanner();
    return false;
  };
  window.addEventListener('unhandledrejection', function(e) {
    errors.push('PROMISE: ' + (e.reason||'?'));
    updateBanner();
  });

  /* ── Diagnostic banner (bottom-right corner) ── */
  function createBanner() {
    var b = document.createElement('div');
    b.id = '_diag_banner';
    b.style.cssText = 'position:fixed;bottom:8px;right:8px;z-index:2147483647;' +
      'background:rgba(15,23,42,0.92);color:#4ade80;font-family:monospace;' +
      'font-size:11px;padding:8px 12px;border-radius:8px;min-width:220px;' +
      'box-shadow:0 4px 16px rgba(0,0,0,0.4);cursor:pointer;user-select:none;' +
      'border:1px solid rgba(74,222,128,0.3);line-height:1.6;';
    b.title = 'Diagnostic panel — click to dismiss';
    b.addEventListener('click', function(ev) { ev.stopPropagation(); b.style.display='none'; });
    document.body.appendChild(b);
    return b;
  }
  
  function updateBanner() {
    var b = document.getElementById('_diag_banner');
    if (!b) {
      if (!document.body) return;
      b = createBanner();
    }
    var navOk  = typeof window.navigateTo === 'function';
    var p40ok  = typeof window._p40LifeAiTriage === 'function';
    var errTxt = errors.length ? '<br><span style="color:#f87171">⚠ ' + errors.slice(-2).join('</span><br><span style="color:#f87171">⚠ ') + '</span>' : '';
    b.style.color = errors.length ? '#f87171' : '#4ade80';
    b.innerHTML = 
      '<b style="color:#fff">Diagnostic panel</b><br>' +
      'clicks: <b>' + clickCount + '</b> | href# fixed: <b>' + fixCount + '</b><br>' +
      'navigateTo: ' + (navOk ? '<span style="color:#4ade80">✓</span>' : '<span style="color:#f87171">✗ MISSING</span>') + '  ' +
      '_p40Triage: ' + (p40ok ? '<span style="color:#4ade80">✓</span>' : '<span style="color:#f87171">✗ MISSING</span>') +
      errTxt;
  }

  /* ── Init sequence ── */
  function init() {
    // Clean stuck overlays at multiple times
    cleanStuckOverlays();
    setTimeout(cleanStuckOverlays, 500);
    setTimeout(cleanStuckOverlays, 1500);
    
    // Show banner
    updateBanner();
    setTimeout(updateBanner, 2000);
    setTimeout(updateBanner, 5000);
    
    // Rebind onclick handlers (fixes Edge tracking prevention)
    setTimeout(function() {
      var n = rebindOnclickHandlers();
      console.log('[ERRORCATCH] onclick rebind pass 1: ' + n + ' handlers');
      updateBanner();
    }, 1500);
    
    setTimeout(function() {
      // Second pass after dynamic content renders
      var n = rebindOnclickHandlers();
      if (n > 0) console.log('[ERRORCATCH] onclick rebind pass 2: ' + n + ' new handlers');
      updateBanner();
    }, 4000);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 0);
  }
  
  console.log('[ERRORCATCH] v3 — Edge-fix + click capture + overlay cleanup active');
})();
