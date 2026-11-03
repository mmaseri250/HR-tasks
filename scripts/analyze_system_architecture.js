// scripts/analyze_system_architecture.js
const db = require('../server/database/db');

console.log('================================================================');
console.log('         DEEP SYSTEM ARCHITECTURE & DATABASE ANALYSIS          ');
console.log('================================================================\n');

// 1. Tables and counts
console.log('--- 1. TABLES & RECORD COUNTS ---');
const tables = db.query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
tables.forEach(t => {
  const row = db.get(`SELECT COUNT(*) as c FROM ${t.name}`);
  console.log(`- ${t.name.padEnd(25)} : ${row.c} rows`);
});

// 2. Key Schemas
console.log('\n--- 2. KEY SCHEMAS ---');
['users', 'employees', 'departments', 'requests', 'leaves', 'workflow_steps', 'approvals', 'tasks', 'audit_logs', 'leave_balances', 'roles', 'permissions'].forEach(tbl => {
  try {
    const cols = db.query(`PRAGMA table_info(${tbl})`);
    if (cols.length > 0) {
      console.log(`\nTable [${tbl}]:`);
      cols.forEach(c => console.log(`  - ${c.name} (${c.type}) ${c.notnull ? 'NOT NULL' : ''} ${c.pk ? 'PK' : ''} ${c.dflt_value !== null ? 'DEFAULT ' + c.dflt_value : ''}`));
    }
  } catch (e) {
    console.log(`Table [${tbl}] does not exist.`);
  }
});

// 3. Users analysis
console.log('\n--- 3. USERS ANALYSIS ---');
const users = db.query('SELECT id, username, full_name, role, emp_id, is_active FROM users');
console.log(`Total users: ${users.length}`);
users.forEach(u => {
  let empInfo = 'NO EMP LINKED';
  if (u.emp_id) {
    const emp = db.get('SELECT id, emp_code, full_name_ar, department_id, manager_id FROM employees WHERE id = ?', [u.emp_id]);
    empInfo = emp ? `Linked to ${emp.emp_code} - ${emp.full_name_ar} (Dept: ${emp.department_id}, Mgr: ${emp.manager_id})` : `BROKEN LINK (emp_id: ${u.emp_id} not found)`;
  }
  console.log(`  User #${u.id} [${u.username}] Role: ${u.role} -> ${empInfo}`);
});

// 4. Employees & Reporting Lines
console.log('\n--- 4. EMPLOYEES & REPORTING LINES ---');
const totalEmps = db.get('SELECT COUNT(*) as c FROM employees').c;
const withManager = db.get('SELECT COUNT(*) as c FROM employees WHERE manager_id IS NOT NULL').c;
const withoutManager = db.get('SELECT COUNT(*) as c FROM employees WHERE manager_id IS NULL').c;
console.log(`Total employees: ${totalEmps}`);
console.log(`Employees WITH manager_id: ${withManager}`);
console.log(`Employees WITHOUT manager_id: ${withoutManager}`);

const topEmps = db.query('SELECT id, emp_code, full_name_ar, job_title_ar, manager_id, direct_manager_name FROM employees WHERE manager_id IS NULL');
console.log('Top Employees without manager_id:');
topEmps.forEach(e => console.log(`  - ${e.emp_code}: ${e.full_name_ar} (${e.job_title_ar})`));

// 5. Manager Subordinates Count
console.log('\n--- 5. DIRECT MANAGERS & SUBORDINATE COUNTS ---');
const mgrCounts = db.query(`
  SELECT m.id, m.emp_code, m.full_name_ar, COUNT(e.id) as sub_count
  FROM employees m
  JOIN employees e ON e.manager_id = m.id
  GROUP BY m.id
  ORDER BY sub_count DESC
`);
mgrCounts.forEach(m => console.log(`  Manager [${m.emp_code}] ${m.full_name_ar}: ${m.sub_count} direct subordinates`));

// 6. Departments & Managers
console.log('\n--- 6. DEPARTMENTS & MANAGERS ---');
const depts = db.query('SELECT d.id, d.code, d.name_ar, d.manager_name FROM departments d');
depts.forEach(d => console.log(`  Dept #${d.id} [${d.code}] ${d.name_ar} -> (${d.manager_name || 'None'})`));

// 7. Requests & Workflow Steps
console.log('\n--- 7. REQUESTS & WORKFLOW STEPS ---');
const reqs = db.query('SELECT id, request_no, emp_id, request_type, status, current_step, total_steps FROM requests');
console.log(`Total requests: ${reqs.length}`);
reqs.forEach(r => console.log(`  Request #${r.id} [${r.request_no}] Emp #${r.emp_id} Type: ${r.request_type} Status: ${r.status} Step: ${r.current_step}/${r.total_steps}`));

// 8. Tasks Analysis
console.log('\n--- 8. TASKS ANALYSIS ---');
const tasks = db.query('SELECT id, title, assigned_to_emp_id, created_by_emp_id, status FROM tasks LIMIT 10');
console.log(`Sample tasks: ${tasks.length}`);
tasks.forEach(t => console.log(`  Task #${t.id} "${t.title}" AssignedTo: ${t.assigned_to_emp_id} CreatedBy: ${t.created_by_emp_id} Status: ${t.status}`));

// 9. Leave Balances & Requests
console.log('\n--- 9. LEAVES ANALYSIS ---');
const leaves = db.query('SELECT id, request_no, emp_id, leave_type, days_count, status, manager_status, hr_verify_status, hr_director_status FROM leaves LIMIT 10');
console.log(`Sample leaves: ${leaves.length}`);
leaves.forEach(l => console.log(`  Leave #${l.id} [${l.request_no}] Emp #${l.emp_id} Days: ${l.days_count} Status: ${l.status} (Mgr: ${l.manager_status}, HR: ${l.hr_verify_status}, Dir: ${l.hr_director_status})`));
