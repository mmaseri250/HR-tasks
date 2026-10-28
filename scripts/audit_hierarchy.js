const db = require('../server/database/db');

console.log('=== ORGANIZATIONAL HIERARCHY AUDIT ===');
const emps = db.query(`
  SELECT e.id, e.emp_code, e.full_name_ar, e.job_title_ar, e.manager_id, e.direct_manager_name,
         d.name_ar AS department_name
  FROM employees e
  LEFT JOIN departments d ON e.department_id = d.id
  ORDER BY e.id ASC
`);

console.log(`Total Employees: ${emps.length}`);

const noManager = emps.filter(e => !e.manager_id);
console.log(`\nEmployees with NO manager_id (${noManager.length}):`);
noManager.forEach(e => console.log(`  - [${e.emp_code}] ${e.full_name_ar} (${e.job_title_ar}) - Dept: ${e.department_name}`));

// Check if any manager_id points to non-existent employee
const invalidManagers = [];
for (const e of emps) {
  if (e.manager_id) {
    const mgr = emps.find(m => m.id === e.manager_id);
    if (!mgr) {
      invalidManagers.push({ emp: e, missing_manager_id: e.manager_id });
    }
  }
}
console.log(`\nInvalid manager_ids (points to non-existent employee): ${invalidManagers.length}`);
invalidManagers.forEach(inv => console.log(`  - [${inv.emp.emp_code}] ${inv.emp.full_name_ar} -> manager_id: ${inv.missing_manager_id}`));

// Check name discrepancies
const nameMismatches = [];
for (const e of emps) {
  if (e.manager_id) {
    const mgr = emps.find(m => m.id === e.manager_id);
    if (mgr && e.direct_manager_name && e.direct_manager_name.trim() !== mgr.full_name_ar.trim()) {
      nameMismatches.push({ emp: e, mgr_name_in_emp: e.direct_manager_name, actual_mgr_name: mgr.full_name_ar });
    }
  }
}
console.log(`\nManager name mismatches between direct_manager_name and actual manager record: ${nameMismatches.length}`);
nameMismatches.forEach(m => console.log(`  - [${m.emp.emp_code}] ${m.emp.full_name_ar} has "${m.mgr_name_in_emp}", actual manager is "${m.actual_mgr_name}"`));
