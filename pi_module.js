function initProductsPage() {
  requestAnimationFrame(function() {
    setTimeout(function() {
      renderPIProducts();
      renderPIRecs();
      renderPIMatrix();
    }, 80);
  });
}

function filterPIProducts(cat, btn) {
  document.querySelectorAll('.pi-cat-pill').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  _piFilter = cat;
  renderPIProducts();
}

function renderPIProducts() {
  var el = document.getElementById('pi-product-list');
  if (!el) return;
  var items = _piFilter === 'all' ? piProductsData : piProductsData.filter(function(p) { return p.cat === _piFilter; });
  var recCounts = {};
  piRecsData.forEach(function(r) { recCounts[r.productId] = (recCounts[r.productId] || 0) + 1; });

  el.innerHTML = items.map(function(p) {
    var matches = recCounts[p.id] || 0;
    var isActive = _piSelectedProduct === p.id ? 'active' : '';
    var matchBadge = matches ? '<span class="pi-prod-match-count"><i class="fas fa-robot"></i> ' + matches + ' match' + (matches > 1 ? 'es' : '') + '</span>' : '';
    return '<div class="pi-prod-card ' + isActive + '" onclick="openPIProductDetail(\'' + p.id + '\')">'
      + '<div class="pi-prod-card-top">'
      +   '<div class="pi-prod-icon" style="background:' + p.color + '18;color:' + p.color + '"><i class="fas ' + p.icon + '"></i></div>'
      +   '<div class="pi-prod-name">' + p.name + '</div>'
      + '</div>'
      + '<div class="pi-prod-card-foot">'
      +   '<span class="pi-prod-premium">' + p.minPremium + '</span>'
      +   '<span class="pi-prod-risk pi-risk-' + p.riskLevel.toLowerCase() + '">' + p.riskLevel + '</span>'
      +   matchBadge
      + '</div>'
      + '</div>';
  }).join('');
}

function sortPIRecs(by) { renderPIRecs(by); }

function renderPIRecs(sortBy) {
  var el = document.getElementById('pi-rec-list');
  if (!el) return;
  var recs = piRecsData.slice().sort(function(a, b) {
    if (sortBy === 'segment') return a.segment.localeCompare(b.segment);
    return b.score - a.score;
  });

  function scoreColor(s) { return s >= 85 ? '#22c55e' : s >= 70 ? '#f59e0b' : '#ef4444'; }

  el.innerHTML = recs.map(function(r) {
    var prod = piProductsData.find(function(p) { return p.id === r.productId; });
    var sc = scoreColor(r.score);
    var isActive = _piSelectedRec === r.id ? 'active' : '';
    var isUrgent = r.score >= 85 && r.factors.some(function(f) {
      return f.toLowerCase().indexOf('alert') >= 0 || f.toLowerCase().indexOf('lapse') >= 0 || f.toLowerCase().indexOf('urgent') >= 0;
    });
    var urgBadge = isUrgent ? '<span class="pi-rec-urgency"><i class="fas fa-bolt"></i> Urgent</span>' : '';
    var shortReason = r.reason.length > 100 ? r.reason.slice(0, 100) + '\u2026' : r.reason;
    var prodIcon = prod ? prod.icon : 'fa-box';
    var prodName = prod ? prod.name : r.productId;
    return '<div class="pi-rec-card ' + isActive + '" onclick="openPIRecDetail(\'' + r.id + '\')">'
      + '<div class="pi-rec-card-top">'
      +   '<div class="pi-rec-avatar" style="background:' + r.avatarGrad + '">' + r.initials + '</div>'
      +   '<div class="pi-rec-info">'
      +     '<div class="pi-rec-name">' + r.client + '</div>'
      +     '<div class="pi-rec-prod"><i class="fas ' + prodIcon + '" style="font-size:10px"></i> ' + prodName + '</div>'
      +   '</div>'
      +   '<div class="pi-rec-score-ring" style="border-color:' + sc + ';color:' + sc + '">' + r.score + '</div>'
      + '</div>'
      + '<div class="pi-rec-reason">' + shortReason + '</div>'
      + '<div class="pi-rec-footer">'
      +   '<span class="pi-rec-value">' + r.value + '</span>'
      +   '<span class="pi-rec-comm"><i class="fas fa-coins"></i> ' + r.commission + '</span>'
      +   urgBadge
      + '</div>'
      + '</div>';
  }).join('');
}

function openPIProductDetail(id) {
  _piSelectedProduct = id;
  _piSelectedRec = null;
  renderPIProducts();
  var p = piProductsData.find(function(x) { return x.id === id; });
  if (!p) return;
  var emptyEl = document.getElementById('pi-detail-empty');
  var panelEl = document.getElementById('pi-detail-panel');
  if (emptyEl) emptyEl.style.display = 'none';
  if (!panelEl) return;
  panelEl.style.display = 'block';

  var recs = piRecsData.filter(function(r) { return r.productId === id; });
  function sc(s) { return s >= 85 ? '#22c55e' : s >= 70 ? '#f59e0b' : '#ef4444'; }
  var catLabel = p.cat.charAt(0).toUpperCase() + p.cat.slice(1);

  var recsHTML = '';
  if (recs.length) {
    recsHTML = '<div class="pi-det-section-label"><i class="fas fa-robot" style="color:#6366f1"></i> AI-Matched Clients (' + recs.length + ')</div>'
      + recs.map(function(r) {
          return '<div class="pi-det-match-row" onclick="openPIRecDetail(\'' + r.id + '\')">'
            + '<div class="pi-det-match-avatar" style="background:' + r.avatarGrad + '">' + r.initials + '</div>'
            + '<div style="flex:1"><div class="pi-det-match-name">' + r.client + '</div>'
            + '<div class="pi-det-match-val">' + r.value + ' &middot; ' + r.commission + ' commission</div></div>'
            + '<div class="pi-det-match-score" style="color:' + sc(r.score) + '">' + r.score + '</div>'
            + '</div>';
        }).join('');
  } else {
    recsHTML = '<div class="pi-det-no-match"><i class="fas fa-search"></i> No current client matches \u2014 run AI model to refresh.</div>';
  }

  panelEl.innerHTML = '<div class="pi-det-panel">'
    + '<div class="pi-det-header" style="border-left-color:' + p.color + '">'
    +   '<div class="pi-det-icon" style="background:' + p.color + '18;color:' + p.color + '"><i class="fas ' + p.icon + '"></i></div>'
    +   '<div><div class="pi-det-name">' + p.name + '</div>'
    +   '<div class="pi-det-cat">' + catLabel + ' &middot; ' + p.riskLevel + ' Risk &middot; from ' + p.minPremium + '</div></div>'
    + '</div>'
    + '<p style="font-size:13px;color:#475569;line-height:1.55;margin:0 0 14px">' + p.desc + '</p>'
    + '<div class="pi-det-section-label"><i class="fas fa-check-circle" style="color:#22c55e"></i> Key Features</div>'
    + '<ul class="pi-det-features">'
    + p.highlights.map(function(h) { return '<li><i class="fas fa-check" style="color:' + p.color + '"></i> ' + h + '</li>'; }).join('')
    + '</ul>'
    + recsHTML
    + '<div class="pi-det-actions">'
    +   '<button class="btn btn-ai" onclick="runProductPropensity()"><i class="fas fa-robot"></i> Match Clients</button>'
    +   '<button class="btn btn-outline" onclick="openQuickQuoteModal()"><i class="fas fa-calculator"></i> Quick Quote</button>'
    + '</div>'
    + '</div>';
}

function openPIRecDetail(id) {
  _piSelectedRec = id;
  _piSelectedProduct = null;
  renderPIProducts();
  renderPIRecs();
  var r = piRecsData.find(function(x) { return x.id === id; });
  if (!r) return;
  var p = piProductsData.find(function(x) { return x.id === r.productId; });
  var emptyEl = document.getElementById('pi-detail-empty');
  var panelEl = document.getElementById('pi-detail-panel');
  if (emptyEl) emptyEl.style.display = 'none';
  if (!panelEl) return;
  panelEl.style.display = 'block';

  var sc = r.score >= 85 ? '#22c55e' : r.score >= 70 ? '#f59e0b' : '#ef4444';
  var scoreLabel = r.score >= 85 ? 'High Confidence' : r.score >= 70 ? 'Moderate' : 'Low';
  var prodColor = p ? p.color : '#334155';
  var prodIcon  = p ? p.icon  : 'fa-box';
  var prodName  = p ? p.name  : r.productId;

  panelEl.innerHTML = '<div class="pi-det-panel">'
    + '<div class="pi-det-header" style="border-left-color:' + sc + '">'
    +   '<div class="pi-det-avatar" style="background:' + r.avatarGrad + '">' + r.initials + '</div>'
    +   '<div><div class="pi-det-name">' + r.client + '</div>'
    +   '<div class="pi-det-cat">Age ' + r.age + ' &middot; ' + r.segment + '</div></div>'
    +   '<div class="pi-det-score-badge" style="background:' + sc + '18;color:' + sc + ';border:1px solid ' + sc + '40">'
    +     r.score + '<small>' + scoreLabel + '</small>'
    +   '</div>'
    + '</div>'
    + '<div class="pi-det-product-pill" style="background:' + prodColor + '18;color:' + prodColor + '">'
    +   '<i class="fas ' + prodIcon + '"></i> Recommended: ' + prodName
    + '</div>'
    + '<div class="pi-det-section-label"><i class="fas fa-brain" style="color:#6366f1"></i> Why AI recommends this</div>'
    + '<div class="pi-det-reason-box">' + r.reason + '</div>'
    + '<div class="pi-det-kpi-row">'
    +   '<div class="pi-det-kpi"><div class="pi-det-kpi-val">' + r.value + '</div><div class="pi-det-kpi-lbl">Est. Value</div></div>'
    +   '<div class="pi-det-kpi"><div class="pi-det-kpi-val">' + r.commission + '</div><div class="pi-det-kpi-lbl">Commission</div></div>'
    +   '<div class="pi-det-kpi"><div class="pi-det-kpi-val" style="color:' + sc + '">' + r.score + '</div><div class="pi-det-kpi-lbl">AI Score</div></div>'
    + '</div>'
    + '<div class="pi-det-section-label"><i class="fas fa-check-circle" style="color:#22c55e"></i> Suitability Factors</div>'
    + '<div class="pi-det-factors">'
    + r.factors.map(function(f) { return '<span class="pi-det-factor"><i class="fas fa-check-circle"></i> ' + f + '</span>'; }).join('')
    + '</div>'
    + '<div class="pi-det-section-label"><i class="fas fa-arrow-right" style="color:#003087"></i> Recommended Next Action</div>'
    + '<div class="pi-det-next-action"><i class="fas fa-arrow-right" style="color:#003087"></i> ' + r.nextAction + '</div>'
    + '<div class="pi-det-actions">'
    +   '<button class="btn btn-ai" onclick="navigateTo(\'upsell\');showToast(\'Opening brief for ' + r.client + '\',\'info\')"><i class="fas fa-paper-plane"></i> Generate Brief</button>'
    +   '<button class="btn btn-outline" onclick="navigateTo(\'clients\');showToast(\'Opening client record\',\'info\')"><i class="fas fa-user"></i> View Client</button>'
    + '</div>'
    + '</div>';
}

function renderPIMatrix() {
  var wrap = document.getElementById('pi-matrix-wrap');
  if (!wrap) return;
  function cellClass(s) { return s >= 85 ? 'pmc-hot' : s >= 70 ? 'pmc-high' : s >= 50 ? 'pmc-low' : 'pmc-none'; }

  var html = '<table class="pi-matrix-table"><thead><tr><th class="row-h">Client</th>'
    + piMatrixProducts.map(function(p) {
        var label = p.length > 8 ? p.slice(0, 8) + '\u2026' : p;
        return '<th title="' + p + '">' + label + '</th>';
      }).join('')
    + '</tr></thead><tbody>';

  piMatrixClients.forEach(function(client, ci) {
    html += '<tr><td class="pi-matrix-client">' + client + '</td>';
    piMatrixScores[ci].forEach(function(score, pi2) {
      html += '<td class="' + cellClass(score) + '" title="' + client + ' \u00d7 ' + piMatrixProducts[pi2] + ': ' + score + '"'
        + ' onclick="showToast(\'' + client + ' \u00d7 ' + piMatrixProducts[pi2] + ': score ' + score + '\',\'info\')">'
        + score + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  wrap.innerHTML = html;
}

function runProductPropensity() {
  showToast('AI Propensity Model running across 8 clients \u00d7 13 products\u2026', 'info');
  setTimeout(function() {
    showToast('Model complete \u2014 8 high-confidence matches found. Top: Robert Chen \u00d7 Deferred Annuity (96)', 'success');
    renderPIMatrix();
    renderPIRecs();
  }, 2400);
}

console.log('Product Intelligence Hub module loaded \u2014 piProductsData(' + piProductsData.length + '), piRecsData(' + piRecsData.length + '), propensity matrix ready');
