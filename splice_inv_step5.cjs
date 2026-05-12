// splice_inv_step5.cjs — appends inv_step5_module.js to public/static/app.js
// Guard prevents double-splice.
const fs = require('fs');
const path = require('path');

const appJs  = path.join(__dirname, 'public/static/app.js');
const modJs  = path.join(__dirname, 'inv_step5_module.js');
const GUARD  = 'INV Step 5 module loaded';

const current = fs.readFileSync(appJs, 'utf8');
if (current.includes(GUARD)) {
  console.log('SKIP: inv_step5_module.js already spliced (guard found).');
  process.exit(0);
}

const module5 = fs.readFileSync(modJs, 'utf8');
const separator = '\n\n/* ================================================\n' +
                  '   INV Step 5 — Annual Review Tab (inv-accounts)\n' +
                  '   ================================================ */\n';

fs.writeFileSync(appJs, current + separator + module5, 'utf8');
const final = fs.readFileSync(appJs, 'utf8');
console.log('OK: inv_step5_module.js spliced into app.js (' + final.length + ' chars total)');
