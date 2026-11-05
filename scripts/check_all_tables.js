const { db } = require('../server/database/db.js');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
console.log('--- ALL TABLES AND ROW COUNTS ---');
for (const t of tables) {
  try {
    const c = db.prepare(`SELECT count(*) as c FROM ${t.name}`).get().c;
    if (c > 0) {
      console.log(`${t.name}: ${c}`);
    }
  } catch (e) {
    console.log(`${t.name}: error - ${e.message}`);
  }
}
