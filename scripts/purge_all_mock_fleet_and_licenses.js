// scripts/purge_all_mock_fleet_and_licenses.js
const { db } = require('../server/database/db.js');

console.log('--- PURGING ALL MOCK FLEET AND LICENSES DATA ---');

// 1. Purge vehicles
const vResult = db.prepare('DELETE FROM vehicles').run();
console.log(`✓ Deleted ${vResult.changes} mock vehicles from vehicles table.`);

// 2. Purge company licenses
const lResult = db.prepare('DELETE FROM company_licenses').run();
console.log(`✓ Deleted ${lResult.changes} mock licenses from company_licenses table.`);

// 3. Purge medical insurance policies
const mResult = db.prepare('DELETE FROM medical_insurance_policies').run();
console.log(`✓ Deleted ${mResult.changes} mock policies from medical_insurance_policies table.`);

// 4. Log in audit_logs
try {
  db.prepare(`
    INSERT INTO audit_logs (entity_type, entity_id, action, performed_by_name, comment, old_values, new_values, ip_address, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).run(
    'SYSTEM',
    0,
    'PURGE_MOCK_DATA',
    'مدير النظام',
    'تطهير كامل لبيانات الأسطول والمركبات والتراخيص الوهمية تحت مبدأ خلو النظام من البيانات المصطنعة',
    JSON.stringify({ vehicles: vResult.changes, licenses: lResult.changes, policies: mResult.changes }),
    JSON.stringify({ vehicles: 0, licenses: 0, policies: 0, policy: 'ZERO_MOCK_DATA_ENFORCED' }),
    '127.0.0.1'
  );
  console.log('✓ Recorded immutable audit log entry for purge.');
} catch (err) {
  console.error('Audit log record error:', err.message);
}

// 5. Vacuum database
db.exec('VACUUM;');
console.log('✓ Database vacuumed and optimized.');

console.log('--- PURGE COMPLETED SUCCESSFULLY ---');
