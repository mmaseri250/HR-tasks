const { db } = require('../server/database/db.js');
const vTables = ['vehicles', 'vehicle_maintenance_logs', 'vehicle_assignments', 'fuel_records', 'tamm_authorizations', 'company_licenses'];
for (const t of vTables) {
  try {
    const c = db.prepare(`SELECT count(*) as c FROM ${t}`).get()?.c;
    console.log(`${t}: ${c}`);
  } catch (e) {
    console.log(`${t}: does not exist`);
  }
}
