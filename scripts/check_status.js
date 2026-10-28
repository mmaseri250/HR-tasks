const db = require('../server/database/db');
db.run("UPDATE employees SET status = 'نشط' WHERE emp_code = 'JM-0001'");
console.log('Active count:', db.get("SELECT COUNT(id) AS total FROM employees WHERE status = 'نشط'").total);
