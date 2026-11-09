// scripts/sync_certified_users.js
const { query, get, run } = require('../server/database/db');
const fs = require('fs');
const path = require('path');

function syncCertifiedUsers() {
  console.log('=== SYNCING CERTIFIED 108 USERS ===');
  const matrixPath = path.join(__dirname, 'rbac_certified_108_matrix.json');
  const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
  const emps = query("SELECT * FROM employees WHERE status = 'نشط'");

  console.log(`Loaded ${matrix.length} matrix entries, ${emps.length} active employees in DB.`);

  let created = 0;
  let updated = 0;

  for (const item of matrix) {
    const emp = emps.find(e => e.emp_code === item.emp_code);
    if (!emp) {
      console.warn(`Employee not found for code: ${item.emp_code}`);
      continue;
    }

    const existing = get('SELECT id FROM users WHERE username = ? OR emp_id = ?', [emp.emp_code, emp.id]);
    const defaultPass = item.role === 'dept_manager' ? 'Mgr123' : (item.role.startsWith('hr_') ? 'Hr123' : 'Emp123');
    const email = emp.email || `${emp.emp_code.toLowerCase()}@jalmajd.com`;
    
    let perms = ['requests.create', 'leaves.create', 'profile.view'];
    if (item.role === 'dept_manager') {
      perms = ['requests', 'approvals', 'employees', 'tasks', 'reports', 'leaves.approve'];
    } else if (item.role === 'hr_manager') {
      perms = ['all'];
    } else if (item.role === 'hr_specialist') {
      perms = ['employees.view', 'leaves.verify', 'requests.verify', 'reports'];
    }

    const permsStr = JSON.stringify(perms);

    if (!existing) {
      run(`
        INSERT INTO users (username, password, full_name, email, role, permissions, emp_id, is_active, status, activated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'نشط', CURRENT_TIMESTAMP)
      `, [emp.emp_code, defaultPass, emp.full_name_ar, email, item.role, permsStr, emp.id]);
      created++;
    } else {
      run(`
        UPDATE users SET 
          role = ?, permissions = ?, emp_id = ?, full_name = ?, email = ?, is_active = 1, status = 'نشط'
        WHERE id = ?
      `, [item.role, permsStr, emp.id, emp.full_name_ar, email, existing.id]);
      updated++;
    }
  }

  // Ensure Admin user (ID 1) is active with role admin and permissions ['all']
  run("UPDATE users SET role = 'admin', permissions = '[\"all\"]', is_active = 1, status = 'نشط' WHERE username = 'admin' OR id = 1");

  console.log(`Result: Created = ${created}, Updated = ${updated}.`);
  const total = get('SELECT COUNT(*) as c FROM users');
  console.log(`Total users in database: ${total.c}`);

  // Summary by role
  const roleBreakdown = query(`
    SELECT role, COUNT(*) as count 
    FROM users 
    GROUP BY role 
    ORDER BY count DESC
  `);
  console.table(roleBreakdown);
}

if (require.main === module) {
  syncCertifiedUsers();
}

module.exports = { syncCertifiedUsers };
