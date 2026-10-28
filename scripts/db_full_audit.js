const db = require('../server/database/db');

console.log('=== DATABASE AUDIT REPORT ===');
const tables = db.query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
console.log(`Total Tables: ${tables.length}`);

for (const t of tables) {
  try {
    const count = db.get(`SELECT COUNT(*) as c FROM "${t.name}"`).c;
    console.log(`  - ${t.name.padEnd(30)}: ${count} rows`);
  } catch (e) {
    console.log(`  - ${t.name.padEnd(30)}: ERROR (${e.message})`);
  }
}
