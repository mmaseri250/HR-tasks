const db = require('../server/database/db');

console.log('====================================');
console.log('DIAGNOSIS 1: Employee Shama Record');
console.log('====================================');
const shama = db.get("SELECT * FROM employees WHERE full_name_ar LIKE '%شامة%'");
console.log(shama);

console.log('\n====================================');
console.log('DIAGNOSIS 2: Users in system');
console.log('====================================');
const users = db.query("SELECT id, username, full_name, role, emp_id FROM users");
console.log(users);

console.log('\n====================================');
console.log('DIAGNOSIS 3: Requests Table');
console.log('====================================');
const requests = db.query("SELECT * FROM requests");
console.log('Total in requests:', requests.length);
console.log(requests);

console.log('\n====================================');
console.log('DIAGNOSIS 4: Leaves Table');
console.log('====================================');
const leaves = db.query("SELECT * FROM leaves");
console.log('Total in leaves:', leaves.length);
console.log(leaves);

console.log('\n====================================');
console.log('DIAGNOSIS 5: Direct Manager Check for all employees');
console.log('====================================');
const noManager = db.query("SELECT id, emp_code, full_name_ar, department_id, manager_id, direct_manager_name FROM employees WHERE manager_id IS NULL");
console.log('Employees with manager_id IS NULL count:', noManager.length);
console.log(noManager.slice(0, 10));
