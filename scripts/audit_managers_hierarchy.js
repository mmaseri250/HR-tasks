const { query, get } = require('../server/database/db.js');

console.log('=== USERS WITH NON-EMPLOYEE ROLE ===');
const users = query(`
  SELECT u.id, u.username, u.full_name, u.role, u.emp_id, e.emp_code, e.full_name_ar 
  FROM users u 
  LEFT JOIN employees e ON u.emp_id = e.id
  WHERE u.role != 'employee'
`);
console.table(users);

console.log('\n=== MANAGERS WITH SUBORDINATES (Active Employees) ===');
const mgrs = query(`
  SELECT 
    e.manager_id, 
    m.emp_code AS mgr_code, 
    m.full_name_ar AS mgr_name, 
    u.id AS user_id,
    u.username AS user_name,
    u.role AS user_role,
    COUNT(e.id) as subordinates_count
  FROM employees e
  LEFT JOIN employees m ON e.manager_id = m.id
  LEFT JOIN users u ON u.emp_id = m.id
  WHERE e.status = 'نشط'
  GROUP BY e.manager_id
  ORDER BY subordinates_count DESC
`);
console.table(mgrs);

console.log('\n=== EMPLOYEES WITH NO MANAGER_ID (Active) ===');
const noMgr = query(`
  SELECT id, emp_code, full_name_ar, job_title_ar, direct_manager_name, department_id, branch_id
  FROM employees
  WHERE status = 'نشط' AND (manager_id IS NULL OR manager_id = 0)
`);
console.table(noMgr);

console.log('\n=== TOTAL ACTIVE EMPLOYEES ===');
const activeCount = get("SELECT COUNT(*) as count FROM employees WHERE status = 'نشط'");
console.log('Active employees count:', activeCount.count);

console.log('\n=== TOTAL TERMINATED EMPLOYEES ===');
const termCount = get("SELECT COUNT(*) as count FROM employees WHERE status = 'منتهي الخدمة'");
console.log('Terminated employees count:', termCount.count);
