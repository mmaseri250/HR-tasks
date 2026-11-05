const { db } = require('../server/database/db');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name ASC").all().map(r => r.name);
console.log('TABLES:', tables);

console.log('\n--- VEHICLES TABLES ---');
const vehicleTables = tables.filter(t => t.includes('vehicle') || t.includes('fleet') || t.includes('car'));
console.log('Vehicle tables:', vehicleTables);
vehicleTables.forEach(t => {
  console.log(`Table ${t} count:`, db.prepare(`SELECT count(*) as c FROM ${t}`).get().c);
  console.log(`Table ${t} sample:`, db.prepare(`SELECT * FROM ${t} LIMIT 3`).all());
});

console.log('\n--- LICENSES TABLES ---');
const licTables = tables.filter(t => t.includes('license'));
console.log('License tables:', licTables);
licTables.forEach(t => {
  console.log(`Table ${t} count:`, db.prepare(`SELECT count(*) as c FROM ${t}`).get().c);
  console.log(`Table ${t} sample:`, db.prepare(`SELECT * FROM ${t} LIMIT 3`).all());
});

console.log('\n--- REQUESTS / TASKS / PENALTIES / NOTICES / LEAVES ---');
['requests', 'leaves', 'workflow_steps', 'approvals', 'tasks', 'penalties_issued', 'absence_notices', 'notifications', 'audit_logs'].forEach(t => {
  if (tables.includes(t)) {
    console.log(`Table ${t} count:`, db.prepare(`SELECT count(*) as c FROM ${t}`).get().c);
    console.log(`Table ${t} sample:`, db.prepare(`SELECT * FROM ${t} LIMIT 2`).all());
  }
});
