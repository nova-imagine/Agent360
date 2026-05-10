const fs = require('fs');

// ── 1. Splice phase1_module.js into app.js ──
const appJs = fs.readFileSync('/home/user/webapp/public/static/app.js', 'utf8');
const phase1 = fs.readFileSync('/home/user/webapp/phase1_module.js', 'utf8');

let updated = appJs + '\n\n' + phase1;
console.log('✓ phase1_module.js appended (' + phase1.length + ' chars)');

// ── 2. Update titles{} — add leads ──
const OLD_TITLES = "    fna: 'FNA Discovery Center',\n    delivery: 'Policy Delivery'\n  };";
const NEW_TITLES = "    fna: 'FNA Discovery Center',\n    delivery: 'Policy Delivery',\n    leads: 'Leads — Pre-Qualification'\n  };";
if (updated.includes(OLD_TITLES)) {
  updated = updated.replace(OLD_TITLES, NEW_TITLES);
  console.log('✓ titles{} updated — leads added');
} else {
  console.log('✗ titles{} NOT FOUND — check exact string');
}

// ── 3. Update breadcrumbs{} — add leads ──
const OLD_BC = "    fna: 'Home / Prospecting / FNA Discovery',\n    delivery: 'Home / Onboarding / Policy Delivery'\n  };";
const NEW_BC = "    fna: 'Home / Prospecting / FNA Discovery',\n    delivery: 'Home / Onboarding / Policy Delivery',\n    leads: 'Home / Prospecting / Leads'\n  };";
if (updated.includes(OLD_BC)) {
  updated = updated.replace(OLD_BC, NEW_BC);
  console.log('✓ breadcrumbs{} updated — leads added');
} else {
  console.log('✗ breadcrumbs{} NOT FOUND — check exact string');
}

// ── 4. Update init block — add leads + update campaigns ──
const OLD_INIT = "    } else if (page === 'delivery') {\n      requestAnimationFrame(() => setTimeout(() => initDeliveryPage(), 80));\n    }\n  }\n}";
const NEW_INIT = "    } else if (page === 'delivery') {\n      requestAnimationFrame(() => setTimeout(() => initDeliveryPage(), 80));\n    } else if (page === 'leads') {\n      requestAnimationFrame(() => setTimeout(() => initLeadsPage(), 80));\n    } else if (page === 'campaigns') {\n      requestAnimationFrame(() => setTimeout(() => initCampaignsPage(), 80));\n    }\n  }\n}";
if (updated.includes(OLD_INIT)) {
  updated = updated.replace(OLD_INIT, NEW_INIT);
  console.log('✓ init block updated — leads + campaigns added');
} else {
  console.log('✗ init block NOT FOUND — check exact string');
}

fs.writeFileSync('/home/user/webapp/public/static/app.js', updated);
console.log('✓ app.js written. New size: ' + updated.length + ' chars');
