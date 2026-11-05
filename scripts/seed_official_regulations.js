const { db, get, query, run } = require('../server/database/db');
const fs = require('fs');
const path = require('path');

const regPath = path.join(__dirname, '..', 'server', 'database', 'official_accredited_regulations.json');
const data = JSON.parse(fs.readFileSync(regPath, 'utf8'));

console.log('Approval number:', data.approval_number);
console.log('Approval date:', data.approval_date_hijri);
console.log('Total violations to seed:', data.violations.length);

// Clear old unaccredited penalty regulations
run('DELETE FROM penalty_regulations');

// Insert the 48 official accredited violations
const stmt = db.prepare(`
  INSERT INTO penalty_regulations (
    code, category, violation_text, penalty_1st, penalty_2nd, penalty_3rd, penalty_4th, notes
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const v of data.violations) {
  stmt.run(
    v.code,
    v.category,
    v.violation_text,
    v.penalty_1st,
    v.penalty_2nd,
    v.penalty_3rd,
    v.penalty_4th,
    `معتمد بالقرار الوزاري رقم ${data.approval_number} وتاريخ ${data.approval_date_hijri}`
  );
}

const count = get('SELECT COUNT(*) as c FROM penalty_regulations').c;
console.log('✓ Successfully seeded', count, 'official accredited violations into penalty_regulations!');
