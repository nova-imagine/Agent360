#!/usr/bin/env node
'use strict';
/**
 * patch_cm_tabs_v2.cjs
 * ─────────────────────────────────────────────────────────────────────
 * 1. Merges _cmGoals() content into _cmPlanning() as a top section
 * 2. Adds 4 new tab render functions:
 *    _cmPortfolio(), _cmRetirement(), _cmEstateProt(), _cmServiceClaims()
 * 3. Adds their switch cases to _renderCMTab()
 *
 * All changes operate on public/static/app.js only.
 * src/index.tsx tab bar is patched separately (see below in this file via
 * a second pass on index.tsx — or done manually).
 *
 * Guard string: CM_TABS_V2_PATCH_APPLIED — prevents double application.
 */

const fs   = require('fs');
const path = require('path');

const APPJS  = path.join(__dirname, 'public', 'static', 'app.js');
const GUARD  = '/* CM_TABS_V2_PATCH_APPLIED */';

// ── Load ────────────────────────────────────────────────────────────
let src = fs.readFileSync(APPJS, 'utf8');

if (src.includes(GUARD)) {
  console.log('⚠️  Guard string found — patch already applied. Skipping.');
  process.exit(0);
}

let changed = 0;

// ════════════════════════════════════════════════════════════════════
// PATCH 1 — Add 4 new switch cases to _renderCMTab()
// ════════════════════════════════════════════════════════════════════
const OLD_SWITCH = `    case 'illust':     body.innerHTML = _cmIllustrations(client); break;
    default:           body.innerHTML = '';`;

const NEW_SWITCH = `    case 'illust':     body.innerHTML = _cmIllustrations(client); break;
    case 'portfolio':   body.innerHTML = _cmPortfolio(client);    break;
    case 'retirement':  body.innerHTML = _cmRetirement(client);   break;
    case 'estateprot':  body.innerHTML = _cmEstateProt(client);   break;
    case 'serviceclaims': body.innerHTML = _cmServiceClaims(client); break;
    default:           body.innerHTML = '';`;

if (!src.includes(OLD_SWITCH)) {
  console.error('❌ PATCH 1 anchor not found — switch cases. Aborting.');
  process.exit(1);
}
src = src.replace(OLD_SWITCH, NEW_SWITCH);
changed++;
console.log('✅ PATCH 1: Added 4 new switch cases to _renderCMTab()');

// ════════════════════════════════════════════════════════════════════
// PATCH 2 — Inject Goals content at top of _cmPlanning()
//           Insert immediately after the plan-kpi-bar closing div
// ════════════════════════════════════════════════════════════════════
const OLD_PLANNING_NEEDS = `      <!-- Needs Analysis -->
      <div class="plan-section">
        <div class="plan-section-hdr"><i class="fas fa-search-dollar"></i> Needs Analysis — \${pd.needsAnalysis.length} Categories Reviewed</div>`;

const NEW_PLANNING_NEEDS = `      <!-- Goals & Milestones (merged from Goals tab) -->
      <div class="plan-section" id="plan-goals-section">
        <div class="plan-section-hdr"><i class="fas fa-bullseye" style="color:#003087"></i> Financial Goals &amp; Milestones</div>
        \${(function(){
          const gd = cmGoalsData[client.id] || { goals:[], milestones:[] };
          const lsc = ({'Peak Earner':'#003087','Young Family':'#059669','Wealth Accumulation':'#7c3aed','Pre-Retirement':'#0891b2','Wealth Preservation':'#d97706','Early Career':'#10b981'})[gd.lifeStage] || '#003087';
          const goalsHtml = gd.goals.map(g => {
            const pc = parseInt(g.prog);
            const bc = pc>=80?'#059669':pc>=50?'#0891b2':pc>=25?'#f59e0b':'#dc2626';
            return '<div class="cm-goal-row"><div class="cm-goal-icon" style="background:'+bc+'20;color:'+bc+'"><i class="fas '+g.icon+'"></i></div><div class="cm-goal-info"><div class="cm-goal-label">'+g.label+'</div><div class="cm-goal-sub">'+g.current+' of '+g.target+' · Due: '+g.due+'</div><div class="cm-goal-track"><div class="cm-goal-fill" style="width:'+pc+'%;background:'+bc+'"></div></div></div><div class="cm-goal-pct" style="color:'+bc+'">'+pc+'%</div></div>';
          }).join('');
          const msTypes = { urgent:'#dc2626', family:'#7c3aed', financial:'#059669', policy:'#003087', meeting:'#0891b2' };
          const msHtml = gd.milestones.map(m => '<div class="cm-milestone-row"><div class="cm-ms-dot" style="background:'+(msTypes[m.type]||'#6b7280')+'20;color:'+(msTypes[m.type]||'#6b7280')+'"><i class="fas '+m.icon+'"></i></div><div class="cm-ms-info"><div class="cm-ms-label">'+m.label+'</div><div class="cm-ms-date">'+m.date+'</div></div><span class="cm-ms-badge" style="background:'+(msTypes[m.type]||'#6b7280')+'20;color:'+(msTypes[m.type]||'#6b7280')+'">'+m.type+'</span></div>').join('');
          return '<div class="cm-life-stage-banner" style="background:'+lsc+'15;border-left:4px solid '+lsc+';margin-bottom:12px"><i class="fas fa-map-signs" style="color:'+lsc+';font-size:18px"></i><div><div class="cm-ls-label">Life Stage</div><div class="cm-ls-val" style="color:'+lsc+'">'+gd.lifeStage+'</div></div><div class="cm-ls-hint">Goals and milestones aligned to financial plan</div></div>'
            + (gd.goals.length ? '<div class="cm-goals-section-title"><i class="fas fa-bullseye" style="color:#003087"></i> Financial Goals ('+gd.goals.length+')</div><div class="cm-goals-list">'+goalsHtml+'</div>' : '')
            + (gd.milestones.length ? '<div class="cm-goals-section-title" style="margin-top:14px"><i class="fas fa-flag" style="color:#d97706"></i> Upcoming Milestones</div><div class="cm-milestones-list">'+msHtml+'</div>' : '');
        })()}
      </div>

      <!-- Needs Analysis -->
      <div class="plan-section">
        <div class="plan-section-hdr"><i class="fas fa-search-dollar"></i> Needs Analysis — \${pd.needsAnalysis.length} Categories Reviewed</div>`;

if (!src.includes(OLD_PLANNING_NEEDS)) {
  console.error('❌ PATCH 2 anchor not found — planning needs analysis header. Aborting.');
  process.exit(1);
}
src = src.replace(OLD_PLANNING_NEEDS, NEW_PLANNING_NEEDS);
changed++;
console.log('✅ PATCH 2: Goals + Milestones injected at top of Financial Plan tab');

// ════════════════════════════════════════════════════════════════════
// PATCH 3 — Append 4 new tab render functions before the guard
// ════════════════════════════════════════════════════════════════════

const NEW_FUNCTIONS = `

${GUARD}

// ══════════════════════════════════════════════════════════════════
// NEW TAB: Portfolio
// ══════════════════════════════════════════════════════════════════
function _cmPortfolio(client) {
  const inv = (cmIntelData[client.id] || {}).investments || {};
  const products = cmProducts[client.id] || { insurance:[], investments:[], retirement:[], advisory:[] };

  // Combine retirement + taxable into a single array with source label
  const retAccts  = (inv.retirement || []).map(a => Object.assign({}, a, {src:'Retirement'}));
  const taxAccts  = (inv.taxable    || []).map(a => Object.assign({}, a, {src:'Taxable'}));
  const allAccts  = retAccts.concat(taxAccts);

  // NYL investment products (from cmProducts)
  const nylInvRows = products.investments.map(p =>
    '<div class="port-acct-card" style="border-left:3px solid #003087">' +
      '<div class="port-acct-top"><span class="port-acct-type" style="background:#003087;color:#fff">NYL Managed</span><span class="port-acct-prov">New York Life Investments</span></div>' +
      '<div class="port-acct-name">' + p.name + '</div>' +
      '<div class="port-acct-row"><span class="port-acct-bal">' + p.val + '</span><span class="port-acct-ret" style="color:#059669">' + (p.ret || '—') + '</span></div>' +
    '</div>'
  ).join('');

  // External accounts (from 3rd-Party Intel)
  const extRows = allAccts.map(a => {
    const isRet = a.src === 'Retirement';
    const clr   = isRet ? '#0891b2' : '#7c3aed';
    const lbl   = isRet ? 'Retirement' : 'Taxable';
    return '<div class="port-acct-card" style="border-left:3px solid ' + clr + '">' +
      '<div class="port-acct-top"><span class="port-acct-type" style="background:' + clr + ';color:#fff">' + lbl + '</span><span class="port-acct-prov">' + (a.provider || '') + '</span></div>' +
      '<div class="port-acct-name">' + (a.type || '') + '</div>' +
      '<div class="port-acct-row"><span class="port-acct-bal">' + (a.balance || '—') + '</span><span class="port-acct-alloc">' + (a.allocation || '') + '</span></div>' +
      (a.employer ? '<div class="port-acct-emp"><i class="fas fa-building" style="color:#6b7280;margin-right:4px"></i>' + a.employer + '</div>' : '') +
    '</div>';
  }).join('');

  // AUM totals (rough parse)
  function parseVal(s) {
    if (!s) return 0;
    var m = String(s).replace(/,/g,'').match(/([\d.]+)\s*([KMB]?)/i);
    if (!m) return 0;
    var n = parseFloat(m[1]);
    var u = (m[2]||'').toUpperCase();
    return u==='M'?n*1000000:u==='K'?n*1000:n;
  }
  var totalNYL = products.investments.reduce(function(s,p){ return s + parseVal(p.val); }, 0);
  var totalExt = allAccts.reduce(function(s,a){ return s + parseVal(a.balance); }, 0);
  var grandTotal = totalNYL + totalExt;
  function fmt(n){ return n>=1000000 ? '$'+(n/1000000).toFixed(2)+'M' : n>=1000 ? '$'+(n/1000).toFixed(0)+'K' : '$'+n.toFixed(0); }

  var hasData = allAccts.length > 0 || products.investments.length > 0;

  return '<div class="port-container">' +

    // AUM Summary bar
    '<div class="port-aum-bar">' +
      '<div class="port-aum-card" style="background:linear-gradient(135deg,#003087,#1e40af)">' +
        '<div class="port-aum-lbl">Total Tracked AUM</div>' +
        '<div class="port-aum-val">' + (hasData ? fmt(grandTotal) : '—') + '</div>' +
        '<div class="port-aum-sub">All accounts (external + NYL)</div>' +
      '</div>' +
      '<div class="port-aum-card" style="background:linear-gradient(135deg,#0891b2,#0e7490)">' +
        '<div class="port-aum-lbl">NYL Managed</div>' +
        '<div class="port-aum-val">' + (totalNYL ? fmt(totalNYL) : '—') + '</div>' +
        '<div class="port-aum-sub">' + products.investments.length + ' product(s)</div>' +
      '</div>' +
      '<div class="port-aum-card" style="background:linear-gradient(135deg,#7c3aed,#6d28d9)">' +
        '<div class="port-aum-lbl">External Accounts</div>' +
        '<div class="port-aum-val">' + (totalExt ? fmt(totalExt) : '—') + '</div>' +
        '<div class="port-aum-sub">' + allAccts.length + ' account(s) via 3rd-party intel</div>' +
      '</div>' +
    '</div>' +

    // NYL section
    (nylInvRows ? '<div class="port-section-hdr"><i class="fas fa-star" style="color:#003087"></i> NYL Managed Products</div><div class="port-accts-grid">' + nylInvRows + '</div>' : '') +

    // External accounts
    '<div class="port-section-hdr"><i class="fas fa-university"></i> External Investment Accounts <span class="port-intel-badge">3rd-Party Intel</span></div>' +
    (extRows ? '<div class="port-accts-grid">' + extRows + '</div>' : '<div class="cm-empty">No external investment accounts on record.</div>') +

    // Pension row
    (inv.pension && inv.pension.status ? '<div class="port-section-hdr" style="margin-top:14px"><i class="fas fa-landmark" style="color:#d97706"></i> Pension</div><div class="port-pension-card"><i class="fas fa-landmark" style="color:#d97706;font-size:20px"></i><div>' + inv.pension.status + '</div></div>' : '') +

    // AI nudge
    '<div class="intel-agent-callout" style="margin-top:16px;background:linear-gradient(135deg,#eff6ff,#f0fdf4)">' +
      '<i class="fas fa-robot" style="color:#003087"></i>' +
      '<div class="intel-agent-text"><strong>NOVA Portfolio Intelligence:</strong> ' +
        (grandTotal > 500000 ?
          'High-net-worth client with significant external AUM. Consider consolidation conversation — moving assets under NYL advisory could increase AUM under management.' :
          'Review asset allocation for rebalancing opportunities aligned to risk profile and time horizon.') +
        ' <button class="intel-ai-btn" onclick="sendQuickMessage(\'Analyze ' + client.name.split(' ')[0] + '\\\'s portfolio and identify consolidation or rebalancing opportunities\')"><i class="fas fa-robot"></i> Ask NOVA</button>' +
      '</div>' +
    '</div>' +

  '</div>';
}

// ══════════════════════════════════════════════════════════════════
// NEW TAB: Retirement
// ══════════════════════════════════════════════════════════════════
function _cmRetirement(client) {
  const inv  = (cmIntelData[client.id] || {}).investments || {};
  const prods = cmProducts[client.id] || { insurance:[], investments:[], retirement:[], advisory:[] };
  const prof  = cmProfileExt[client.id] || {};

  const ss   = inv.socialSecurity || {};
  const pen  = inv.pension;
  const retAccts = inv.retirement || [];

  // Annuities from cmProducts.retirement
  const annuityRows = prods.retirement.map(r =>
    '<div class="ret-product-card">' +
      '<div class="ret-prod-badge" style="background:#003087;color:#fff"><i class="fas fa-shield-alt"></i> NYL Annuity</div>' +
      '<div class="ret-prod-name">' + r.name + '</div>' +
      '<div class="ret-prod-row">' +
        '<span><i class="fas fa-dollar-sign" style="color:#059669"></i> Value / Status: <strong>' + r.val + '</strong></span>' +
        (r.inc ? '<span><i class="fas fa-calendar-check" style="color:#0891b2"></i> Income: <strong>' + r.inc + '</strong></span>' : '') +
      '</div>' +
    '</div>'
  ).join('');

  // Retirement accounts (from intel)
  const retAcctRows = retAccts.map(a =>
    '<div class="ret-product-card" style="border-left:3px solid #0891b2">' +
      '<div class="ret-prod-badge" style="background:#0891b2;color:#fff">' + (a.type || 'Retirement Acct') + '</div>' +
      '<div class="ret-prod-name">' + (a.provider || '') + (a.employer ? ' · ' + a.employer : '') + '</div>' +
      '<div class="ret-prod-row">' +
        '<span><i class="fas fa-wallet" style="color:#059669"></i> Balance: <strong>' + (a.balance || '—') + '</strong></span>' +
        '<span><i class="fas fa-chart-pie" style="color:#7c3aed"></i> Allocation: <strong>' + (a.allocation || '—') + '</strong></span>' +
      '</div>' +
    '</div>'
  ).join('');

  // RMD estimate (age-based, simplified)
  var age = client.age || 0;
  var rmdNote = '';
  if (age >= 73) {
    rmdNote = '<div class="ret-rmd-alert" style="background:#fef2f2;border-left:4px solid #dc2626;padding:10px 14px;border-radius:6px;margin-bottom:14px"><i class="fas fa-exclamation-triangle" style="color:#dc2626;margin-right:6px"></i><strong>RMD Active:</strong> Client is ' + age + ' — Required Minimum Distributions apply. Review account balances to calculate current year RMD.</div>';
  } else if (age >= 68) {
    rmdNote = '<div class="ret-rmd-alert" style="background:#fff7ed;border-left:4px solid #f59e0b;padding:10px 14px;border-radius:6px;margin-bottom:14px"><i class="fas fa-clock" style="color:#f59e0b;margin-right:6px"></i><strong>RMD Approaching:</strong> Client turns 73 in ' + (73 - age) + ' year(s). Begin RMD planning conversation.</div>';
  }

  // Retirement readiness score (simple heuristic)
  function parseVal(s) {
    if (!s) return 0;
    var m = String(s).replace(/,/g,'').match(/([\d.]+)\s*([KMB]?)/i);
    if (!m) return 0;
    var n = parseFloat(m[1]);
    var u = (m[2]||'').toUpperCase();
    return u==='M'?n*1000000:u==='K'?n*1000:n;
  }
  var totalRetAssets = retAccts.reduce(function(s,a){ return s + parseVal(a.balance); }, 0);
  totalRetAssets += prods.retirement.reduce(function(s,r){ return s + parseVal(r.val); }, 0);
  var lifeStage = prof.lifeStage || '';
  var readinessScore = 0;
  var readinessLabel = '';
  var readinessColor = '';
  if (lifeStage === 'Wealth Preservation' || lifeStage === 'Pre-Retirement') {
    readinessScore = totalRetAssets > 1000000 ? 90 : totalRetAssets > 500000 ? 72 : 50;
  } else if (lifeStage === 'Peak Earner' || lifeStage === 'Wealth Accumulation') {
    readinessScore = totalRetAssets > 800000 ? 80 : totalRetAssets > 300000 ? 65 : 45;
  } else {
    readinessScore = totalRetAssets > 100000 ? 55 : 30;
  }
  readinessColor = readinessScore >= 80 ? '#059669' : readinessScore >= 60 ? '#f59e0b' : '#dc2626';
  readinessLabel = readinessScore >= 80 ? 'On Track' : readinessScore >= 60 ? 'Needs Attention' : 'At Risk';

  return '<div class="ret-container">' +

    // Readiness + SS bar
    '<div class="port-aum-bar">' +
      '<div class="port-aum-card" style="background:linear-gradient(135deg,' + readinessColor + ',' + readinessColor + 'cc)">' +
        '<div class="port-aum-lbl">Retirement Readiness</div>' +
        '<div class="port-aum-val">' + readinessScore + '/100</div>' +
        '<div class="port-aum-sub">' + readinessLabel + ' — ' + (lifeStage || 'Unknown') + '</div>' +
      '</div>' +
      (ss.estimatedAtFRA ? '<div class="port-aum-card" style="background:linear-gradient(135deg,#0891b2,#0e7490)"><div class="port-aum-lbl">Social Security (FRA)</div><div class="port-aum-val">' + ss.estimatedAtFRA + '</div><div class="port-aum-sub">' + (ss.estimatedAt62 ? 'At 62: ' + ss.estimatedAt62 : 'Est. monthly benefit') + '</div></div>' : '') +
      (pen && pen.status ? '<div class="port-aum-card" style="background:linear-gradient(135deg,#d97706,#b45309)"><div class="port-aum-lbl">Pension</div><div class="port-aum-val"><i class="fas fa-landmark"></i></div><div class="port-aum-sub" style="font-size:11px">' + pen.status + '</div></div>' : '') +
    '</div>' +

    rmdNote +

    // NYL Annuities
    (annuityRows ? '<div class="port-section-hdr"><i class="fas fa-shield-alt" style="color:#003087"></i> NYL Annuities In-Force</div><div class="ret-products-list">' + annuityRows + '</div>' : '<div class="port-section-hdr"><i class="fas fa-shield-alt" style="color:#6b7280"></i> NYL Annuities</div><div class="cm-empty">No annuities in force. <strong>Opportunity:</strong> Retirement income gap identified.</div>') +

    // External retirement accounts
    '<div class="port-section-hdr" style="margin-top:14px"><i class="fas fa-university" style="color:#0891b2"></i> External Retirement Accounts <span class="port-intel-badge">3rd-Party Intel</span></div>' +
    (retAcctRows ? '<div class="ret-products-list">' + retAcctRows + '</div>' : '<div class="cm-empty">No external retirement accounts on record.</div>') +

    // AI nudge
    '<div class="intel-agent-callout" style="margin-top:16px;background:linear-gradient(135deg,#eff6ff,#ecfdf5)">' +
      '<i class="fas fa-robot" style="color:#003087"></i>' +
      '<div class="intel-agent-text"><strong>NOVA Retirement Planner:</strong> ' +
        (readinessScore < 70 ? 'Retirement readiness gap detected. Consider annuity income strategy to close projected shortfall. ' : 'Retirement assets are tracking well. ') +
        (ss.estimatedAtFRA ? 'Social Security at FRA: ' + ss.estimatedAtFRA + '. ' : '') +
        '<button class="intel-ai-btn" onclick="sendQuickMessage(\'Build a retirement income projection for ' + client.name.split(' ')[0] + ' — annuity income, Social Security timing, and RMD schedule\')"><i class="fas fa-robot"></i> Ask NOVA</button>' +
      '</div>' +
    '</div>' +

  '</div>';
}

// ══════════════════════════════════════════════════════════════════
// NEW TAB: Estate & Protection
// ══════════════════════════════════════════════════════════════════
function _cmEstateProt(client) {
  const prods  = cmProducts[client.id] || { insurance:[], investments:[], retirement:[], advisory:[] };
  const prof   = cmProfileExt[client.id] || {};
  const intel  = cmIntelData[client.id] || {};
  const docs   = cmDocsData[client.id]  || [];

  // Estate documents on file
  const estateDocs = docs.filter(d => d.category === 'advisory' || d.name.toLowerCase().includes('trust') || d.name.toLowerCase().includes('will') || d.name.toLowerCase().includes('estate'));

  // Advisory products (trusts, estate planning, business)
  const advisoryRows = prods.advisory.map(a => {
    var isEstate = a.name.toLowerCase().includes('estate') || a.name.toLowerCase().includes('trust') || a.name.toLowerCase().includes('advisory');
    var clr = isEstate ? '#7c3aed' : '#003087';
    return '<div class="ret-product-card" style="border-left:3px solid ' + clr + '">' +
      '<div class="ret-prod-badge" style="background:' + clr + ';color:#fff"><i class="fas fa-gavel"></i> Advisory</div>' +
      '<div class="ret-prod-name">' + a.name + '</div>' +
      '<div class="ret-prod-row">' +
        '<span><i class="fas fa-dollar-sign" style="color:#059669"></i> Value: <strong>' + (a.val || '—') + '</strong></span>' +
        (a.fee ? '<span><i class="fas fa-tag" style="color:#6b7280"></i> Fee: <strong>' + a.fee + '</strong></span>' : '') +
      '</div>' +
    '</div>';
  }).join('');

  // Protection products: LTC, DI, key-person (from insurance)
  const protectionProducts = prods.insurance.filter(p =>
    p.name.toLowerCase().includes('ltc') ||
    p.name.toLowerCase().includes('long-term') ||
    p.name.toLowerCase().includes('disability') ||
    p.name.toLowerCase().includes('key')
  );
  const lifeProducts = prods.insurance.filter(p =>
    p.name.toLowerCase().includes('life') || p.name.toLowerCase().includes('ul') ||
    p.name.toLowerCase().includes('wl')   || p.name.toLowerCase().includes('vul') ||
    p.name.toLowerCase().includes('term') || p.name.toLowerCase().includes('whole')
  );

  const protRows = protectionProducts.map(p => {
    var sc = p.status === 'Active' ? '#059669' : p.status === 'Review' ? '#f59e0b' : '#6b7280';
    return '<div class="ret-product-card" style="border-left:3px solid #d97706">' +
      '<div class="ret-prod-badge" style="background:#d97706;color:#fff"><i class="fas fa-umbrella"></i> Protection</div>' +
      '<div class="ret-prod-name">' + p.name + '</div>' +
      '<div class="ret-prod-row">' +
        '<span style="color:' + sc + '"><i class="fas fa-circle"></i> ' + (p.status || '—') + '</span>' +
        '<span>Premium: <strong>$' + (p.prem || 0).toLocaleString() + '/yr</strong></span>' +
      '</div>' +
    '</div>';
  }).join('');

  // Death benefit / life insurance summary
  var totalDeathBenefit = lifeProducts.reduce(function(s, p) {
    var m = p.name.match(/([\d,.]+)\s*[KM]?\b/);
    if (!m) return s;
    var str = p.name;
    var dm = str.match(/\$?([\d,]+)\s*(K|M)?/i);
    if (!dm) return s;
    var n = parseFloat(dm[1].replace(/,/g,''));
    var u = (dm[2]||'').toUpperCase();
    return s + (u==='M'?n*1000000:u==='K'?n*1000:n);
  }, 0);

  function fmt(n){ return n>=1000000 ? '$'+(n/1000000).toFixed(1)+'M' : n>=1000 ? '$'+(n/1000).toFixed(0)+'K' : '$'+n; }

  // Net worth from profile
  var nwStr = prof.netWorth || '—';

  // Gaps
  var gaps = [];
  if (!protectionProducts.some(p => p.name.toLowerCase().includes('ltc') || p.name.toLowerCase().includes('long-term')))
    gaps.push({ icon:'fa-hospital', label:'LTC Coverage Gap', desc:'No long-term care policy in force. Significant risk given net worth of ' + nwStr + '.', color:'#dc2626' });
  if (!protectionProducts.some(p => p.name.toLowerCase().includes('disability') || p.name.toLowerCase().includes('di')))
    gaps.push({ icon:'fa-wheelchair', label:'Disability Insurance Gap', desc:'No disability insurance identified. Income protection exposure.', color:'#f59e0b' });
  if (!prods.advisory.length)
    gaps.push({ icon:'fa-gavel', label:'Estate Plan Not On File', desc:'No estate planning advisory relationship recorded.', color:'#f59e0b' });

  const gapRows = gaps.map(g =>
    '<div class="cm-gap-item" style="border-left:4px solid ' + g.color + ';background:' + g.color + '10;padding:10px 14px;border-radius:6px;margin-bottom:8px">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><i class="fas ' + g.icon + '" style="color:' + g.color + '"></i><strong style="color:' + g.color + '">' + g.label + '</strong></div>' +
      '<div style="font-size:12px;color:#64748b">' + g.desc + '</div>' +
    '</div>'
  ).join('');

  // Estate docs
  const estateDocRows = estateDocs.map(d => {
    var sc = d.status === 'urgent' ? '#dc2626' : d.status === 'review' ? '#f59e0b' : '#059669';
    return '<div class="cm-doc-row">' +
      '<div class="cm-doc-icon" style="background:#7c3aed15;color:#7c3aed"><i class="fas fa-gavel"></i></div>' +
      '<div class="cm-doc-info"><div class="cm-doc-name">' + d.name + '</div><div class="cm-doc-meta">' + d.type + ' · ' + d.format + ' · ' + d.date + '</div></div>' +
      '<span class="cm-doc-status" style="background:' + sc + '15;color:' + sc + '">' + (d.status === 'urgent' ? 'Urgent' : d.status === 'review' ? 'Review' : 'Current') + '</span>' +
    '</div>';
  }).join('');

  return '<div class="port-container">' +

    // Summary bar
    '<div class="port-aum-bar">' +
      '<div class="port-aum-card" style="background:linear-gradient(135deg,#7c3aed,#6d28d9)">' +
        '<div class="port-aum-lbl">Total Death Benefit</div>' +
        '<div class="port-aum-val">' + (totalDeathBenefit ? fmt(totalDeathBenefit) : '—') + '</div>' +
        '<div class="port-aum-sub">' + lifeProducts.length + ' life insurance policy/ies</div>' +
      '</div>' +
      '<div class="port-aum-card" style="background:linear-gradient(135deg,#d97706,#b45309)">' +
        '<div class="port-aum-lbl">Protection Policies</div>' +
        '<div class="port-aum-val">' + protectionProducts.length + '</div>' +
        '<div class="port-aum-sub">LTC / DI / key-person</div>' +
      '</div>' +
      '<div class="port-aum-card" style="background:' + (gaps.length ? 'linear-gradient(135deg,#dc2626,#b91c1c)' : 'linear-gradient(135deg,#059669,#047857)') + '">' +
        '<div class="port-aum-lbl">Protection Gaps</div>' +
        '<div class="port-aum-val">' + gaps.length + '</div>' +
        '<div class="port-aum-sub">' + (gaps.length ? 'Action needed' : 'Fully protected') + '</div>' +
      '</div>' +
    '</div>' +

    // Gaps
    (gapRows ? '<div class="port-section-hdr"><i class="fas fa-exclamation-triangle" style="color:#dc2626"></i> Protection Gaps — Action Required</div>' + gapRows : '') +

    // Estate Advisory
    '<div class="port-section-hdr" style="margin-top:14px"><i class="fas fa-gavel" style="color:#7c3aed"></i> Estate Planning &amp; Advisory</div>' +
    (advisoryRows ? '<div class="ret-products-list">' + advisoryRows + '</div>' : '<div class="cm-empty">No estate advisory relationship on file.</div>') +

    // Protection policies (LTC, DI)
    (protRows ? '<div class="port-section-hdr" style="margin-top:14px"><i class="fas fa-umbrella" style="color:#d97706"></i> Protection Policies (LTC / DI)</div><div class="ret-products-list">' + protRows + '</div>' : '') +

    // Estate documents
    (estateDocRows ? '<div class="port-section-hdr" style="margin-top:14px"><i class="fas fa-folder-open" style="color:#7c3aed"></i> Estate Documents on File</div><div class="cm-docs-list">' + estateDocRows + '</div>' : '') +

    // AI nudge
    '<div class="intel-agent-callout" style="margin-top:16px;background:linear-gradient(135deg,#f5f3ff,#faf5ff)">' +
      '<i class="fas fa-robot" style="color:#7c3aed"></i>' +
      '<div class="intel-agent-text"><strong>NOVA Estate Intelligence:</strong> ' +
        (gaps.length ? gaps.length + ' protection gap(s) identified. ' : 'Protection profile looks solid. ') +
        'Net worth: <strong>' + nwStr + '</strong>. ' +
        '<button class="intel-ai-btn" onclick="sendQuickMessage(\'Review estate and protection gaps for ' + client.name.split(' ')[0] + ' — LTC, disability, trust structure, and beneficiary alignment\')"><i class="fas fa-robot"></i> Ask NOVA</button>' +
      '</div>' +
    '</div>' +

  '</div>';
}

// ══════════════════════════════════════════════════════════════════
// NEW TAB: Service & Claims
// ══════════════════════════════════════════════════════════════════
function _cmServiceClaims(client) {
  // Pull claims from global claimsData if available (defined in claims management section)
  var allClaims = (typeof claimsData !== 'undefined') ? Object.values(claimsData) : [];
  var clientClaims = allClaims.filter(function(c) {
    return c.client && c.client.toLowerCase().indexOf(client.name.split(' ')[0].toLowerCase()) !== -1;
  });

  // Also check documents for claim documents as fallback
  var docs = cmDocsData[client.id] || [];
  var claimDocs = docs.filter(function(d) { return d.category === 'claims'; });

  // Timeline events (service history from cmTimelineData)
  var timeline = (typeof cmTimelineData !== 'undefined') ? (cmTimelineData[client.id] || []) : [];
  var serviceEvents = timeline.filter(function(e) {
    var txt = (e.event || '').toLowerCase();
    return txt.indexOf('claim') !== -1 || txt.indexOf('service') !== -1 ||
           txt.indexOf('renewal') !== -1 || txt.indexOf('review') !== -1 ||
           txt.indexOf('policy') !== -1 || txt.indexOf('payment') !== -1;
  }).slice(0, 6);

  var statusColors = { 'Under Review':'#f59e0b', 'Pending Docs':'#f59e0b', 'Open':'#0891b2', 'Approved':'#059669', 'Closed':'#6b7280', 'Urgent':'#dc2626', 'In Progress':'#0891b2' };
  var typeBadgeColors = { death:'#dc2626', disability:'#f59e0b', ltc:'#7c3aed', waiver:'#0891b2', adb:'#d97706' };

  // Claims rows
  var claimRows = clientClaims.map(function(c) {
    var sc = statusColors[c.status] || '#6b7280';
    var tc = typeBadgeColors[c.typeBadge] || '#003087';
    return '<div class="svc-claim-card">' +
      '<div class="svc-claim-top">' +
        '<span class="svc-claim-id">' + c.id + '</span>' +
        '<span class="svc-claim-badge" style="background:' + tc + ';color:#fff">' + c.type + '</span>' +
        '<span class="svc-status-badge" style="background:' + sc + '20;color:' + sc + ';border:1px solid ' + sc + '40">' + c.status + '</span>' +
        (c.priority === 'Urgent' ? '<span class="svc-urgent-flag"><i class="fas fa-bolt"></i> Urgent</span>' : '') +
      '</div>' +
      '<div class="svc-claim-name">' + c.claimant + '</div>' +
      '<div class="svc-claim-meta">' +
        'Policy: <strong>' + c.policy + '</strong> · ' +
        'Amount: <strong>' + c.amount + '</strong> · ' +
        'Filed: <strong>' + c.filedDate + '</strong>' +
      '</div>' +
      '<div class="svc-claim-desc">' + c.description + '</div>' +
      '<div class="svc-claim-docs">' +
        (c.docsRequired || []).map(function(d) {
          var done = d.includes('✅');
          return '<span class="svc-doc-pill" style="background:' + (done?'#d1fae5':'#fef3c7') + ';color:' + (done?'#065f46':'#92400e') + '">' + d + '</span>';
        }).join('') +
      '</div>' +
    '</div>';
  }).join('');

  // Fallback: claim documents from cmDocsData
  var claimDocRows = claimDocs.map(function(d) {
    var sc = d.status === 'pending' ? '#f59e0b' : d.status === 'urgent' ? '#dc2626' : '#059669';
    return '<div class="cm-doc-row">' +
      '<div class="cm-doc-icon" style="background:#f59e0b15;color:#f59e0b"><i class="fas fa-file-medical-alt"></i></div>' +
      '<div class="cm-doc-info"><div class="cm-doc-name">' + d.name + '</div><div class="cm-doc-meta">' + d.type + ' · ' + d.date + '</div></div>' +
      '<span class="cm-doc-status" style="background:' + sc + '15;color:' + sc + '">' + (d.status === 'pending' ? 'Pending' : d.status === 'urgent' ? 'Urgent' : 'On File') + '</span>' +
    '</div>';
  }).join('');

  // Service history events
  var svcRows = serviceEvents.map(function(e) {
    return '<div class="cm-timeline-row">' +
      '<div class="cm-tl-icon" style="background:' + (e.color||'#003087') + '15;color:' + (e.color||'#003087') + '"><i class="fas ' + (e.icon||'fa-circle') + '"></i></div>' +
      '<div class="cm-tl-content"><div class="cm-tl-event">' + e.event + '</div><div class="cm-tl-date">' + e.date + '</div></div>' +
    '</div>';
  }).join('');

  // Summary bar
  var openCount    = clientClaims.filter(function(c){ return c.status !== 'Closed' && c.status !== 'Approved'; }).length;
  var urgentCount  = clientClaims.filter(function(c){ return c.priority === 'Urgent'; }).length;
  var totalAmount  = 0; // too complex to parse varied formats safely

  return '<div class="port-container">' +

    // Summary bar
    '<div class="port-aum-bar">' +
      '<div class="port-aum-card" style="background:linear-gradient(135deg,#f59e0b,#d97706)">' +
        '<div class="port-aum-lbl">Open Claims</div>' +
        '<div class="port-aum-val">' + openCount + '</div>' +
        '<div class="port-aum-sub">' + clientClaims.length + ' total claims</div>' +
      '</div>' +
      (urgentCount ? '<div class="port-aum-card" style="background:linear-gradient(135deg,#dc2626,#b91c1c)"><div class="port-aum-lbl">Urgent</div><div class="port-aum-val">' + urgentCount + '</div><div class="port-aum-sub">Immediate action needed</div></div>' : '') +
      '<div class="port-aum-card" style="background:linear-gradient(135deg,#0891b2,#0e7490)">' +
        '<div class="port-aum-lbl">Service Events</div>' +
        '<div class="port-aum-val">' + serviceEvents.length + '</div>' +
        '<div class="port-aum-sub">Recent policy service history</div>' +
      '</div>' +
    '</div>' +

    // Active claims
    '<div class="port-section-hdr"><i class="fas fa-file-medical-alt" style="color:#f59e0b"></i> Active Claims</div>' +
    (claimRows
      ? '<div class="svc-claims-list">' + claimRows + '</div>'
      : (claimDocRows
          ? '<div class="port-section-hdr" style="color:#6b7280;font-size:13px">Claim Documents on File</div><div class="cm-docs-list">' + claimDocRows + '</div>'
          : '<div class="cm-empty">No active claims on record for this client.</div>')) +

    // Service history
    '<div class="port-section-hdr" style="margin-top:16px"><i class="fas fa-clipboard-list" style="color:#0891b2"></i> Service History</div>' +
    (svcRows ? '<div class="cm-timeline-list">' + svcRows + '</div>' : '<div class="cm-empty">No recent service events.</div>') +

    // Policy service requests placeholder
    '<div class="port-section-hdr" style="margin-top:14px"><i class="fas fa-wrench" style="color:#7c3aed"></i> Policy Service Actions</div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">' +
      '<button class="btn btn-outline" style="font-size:12px" onclick="cmToast(\'Address Change request initiated\')"><i class="fas fa-map-marker-alt"></i> Address Change</button>' +
      '<button class="btn btn-outline" style="font-size:12px" onclick="cmToast(\'Beneficiary update form sent\')"><i class="fas fa-user-edit"></i> Beneficiary Update</button>' +
      '<button class="btn btn-outline" style="font-size:12px" onclick="cmToast(\'Payment method update initiated\')"><i class="fas fa-credit-card"></i> Payment Update</button>' +
      '<button class="btn btn-outline" style="font-size:12px" onclick="switchClientTab(\'documents\',document.getElementById(\'cm-tab-documents\'))"><i class="fas fa-folder-open"></i> View All Docs</button>' +
    '</div>' +

    // AI nudge
    '<div class="intel-agent-callout" style="margin-top:16px;background:linear-gradient(135deg,#fff7ed,#fef3c7)">' +
      '<i class="fas fa-robot" style="color:#d97706"></i>' +
      '<div class="intel-agent-text"><strong>NOVA Claims Intelligence:</strong> ' +
        (urgentCount ? urgentCount + ' urgent claim(s) need immediate attention. ' : '') +
        (openCount ? openCount + ' open claim(s) in progress. ' : 'No open claims — good standing. ') +
        '<button class="intel-ai-btn" onclick="sendQuickMessage(\'What is the current claims status for ' + client.name.split(' ')[0] + ' and what actions are needed?\')"><i class="fas fa-robot"></i> Ask NOVA</button>' +
      '</div>' +
    '</div>' +

  '</div>';
}

// ── cmToast helper (if not already defined) ──────────────────────
if (typeof cmToast === 'undefined') {
  function cmToast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1e293b;color:#f1f5f9;padding:10px 18px;border-radius:8px;font-size:13px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.3)';
    document.body.appendChild(t);
    setTimeout(function(){ t.remove(); }, 3000);
  }
}
`;

// Append new functions at the very end of the file
src = src + NEW_FUNCTIONS;
changed++;
console.log('✅ PATCH 3: Appended _cmPortfolio, _cmRetirement, _cmEstateProt, _cmServiceClaims functions');

// ── Write ────────────────────────────────────────────────────────
fs.writeFileSync(APPJS, src, 'utf8');
console.log(`\n✅ All ${changed} patches applied → public/static/app.js`);
console.log('   Next: node --check public/static/app.js');
