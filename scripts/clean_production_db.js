// scripts/clean_production_db.js
// Purge test requests, dummy leaves, and vacuum database for production deployment
const db = require('../server/database/db');

console.log('--- Cleaning test artifacts from hrms.db ---');
db.run('DELETE FROM requests');
db.run('DELETE FROM leaves');
db.run('DELETE FROM approvals');
db.run('DELETE FROM notifications');
db.run('DELETE FROM absence_notices');
db.run('DELETE FROM penalties_issued');
db.run('DELETE FROM attendance_notices');
db.run('DELETE FROM tasks');
db.run('DELETE FROM loans');
db.run('DELETE FROM employee_documents');
db.run('DELETE FROM vehicle_documents');

// Ensure users table strictly has only admin
db.run("DELETE FROM users WHERE username != 'admin'");
db.run("UPDATE users SET full_name = 'مدير النظام' WHERE username = 'admin'");

// Reset primary key autoincrement sequences for cleaned tables
try {
  db.run("DELETE FROM sqlite_sequence WHERE name IN ('requests', 'leaves', 'approvals', 'notifications', 'absence_notices', 'tasks', 'loans')");
} catch (_) {}

// Vacuum database to compact it cleanly
db.run('VACUUM');

console.log('✓ Database cleaned and vacuumed successfully.');
console.log('  Employees:', db.get('SELECT COUNT(*) as c FROM employees').c);
console.log('  Vehicles:', db.get('SELECT COUNT(*) as c FROM vehicles').c);
console.log('  Licenses:', db.get('SELECT COUNT(*) as c FROM company_licenses').c);
console.log('  Muqeem:', db.get('SELECT COUNT(*) as c FROM muqeem_residents').c);
console.log('  Users:', db.get('SELECT COUNT(*) as c FROM users').c);
console.log('  Requests:', db.get('SELECT COUNT(*) as c FROM requests').c);
