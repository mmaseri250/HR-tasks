const db = require('../server/database/db');

console.log('=== USERS TABLE ===');
const users = db.query('SELECT id, username, full_name, role, emp_id, permissions FROM users');
console.log(users);

console.log('\n=== EMPLOYEES CHECK ===');
const shama = db.get("SELECT id, emp_code, full_name_ar, manager_id, direct_manager_name, annual_leave_balance FROM employees WHERE full_name_ar LIKE '%شامة%'");
console.log('Shama:', shama);

if (shama && shama.manager_id) {
  const manager = db.get('SELECT id, emp_code, full_name_ar, manager_id, direct_manager_name FROM employees WHERE id = ?', [shama.manager_id]);
  console.log('Direct Manager of Shama:', manager);
}

const abdulmalik = db.get("SELECT id, emp_code, full_name_ar, manager_id, direct_manager_name FROM employees WHERE full_name_ar LIKE '%عبدالملك%'");
console.log('Abdulmalik:', abdulmalik);

const gm = db.get("SELECT id, emp_code, full_name_ar, manager_id, direct_manager_name FROM employees WHERE full_name_ar LIKE '%عبدالرحمن%'");
console.log('General Manager:', gm);
