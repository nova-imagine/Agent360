// splice_inv_step4.cjs — appends inv_step4_module.js to public/static/app.js
// Guard prevents double-splice.
const fs = require('fs');
const path = require('path');

const appJs  = path.join(__dirname, 'public/static/app.js');
const modJs  = path.join(__dirname, 'inv_step4_module.js');
const GUARD  = 'INV Step 4 module loaded';

const current = fs.readFileSync(appJs, 'utf8');
if (current.includes(GUARD)) {
  console.log('SKIP: inv_step4_module.js already spliced (guard found).');
  process.exit(0);
}

const module4 = fs.readFileSync(modJs, 'utf8');
const separator = '\n\n/* ================================================\n' +
                  '   INV Step 4 — Account Funding & IPS Tab (p6)\n' +
                  '   ================================================ */\n';

fs.writeFileSync(appJs, current + separator + module4, 'utf8');
const final = fs.readFileSync(appJs, 'utf8');
console.log('OK: inv_step4_module.js spliced into app.js (' + final.length + ' chars total)');
