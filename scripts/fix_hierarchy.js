const db = require('../server/database/db');

// 1. Set Abdulmalik's manager to General Manager Abdulrahman Al-Qahtani
const gm = db.get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-0001'");
if (gm) {
  db.run(`
    UPDATE employees
    SET manager_id = ?, direct_manager_name = ?
    WHERE emp_code = 'JM-1000'
  `, [gm.id, gm.full_name_ar]);
  console.log(`Updated JM-1000 manager to [${gm.id}] ${gm.full_name_ar}`);
}

// 2. Normalize any manager name variations
db.run(`
  UPDATE employees
  SET direct_manager_name = 'تامر جمعه احمد عبدالله'
  WHERE direct_manager_name = 'تامر جمعة احمد عبدالله'
`);

console.log('Hierarchy fix completed successfully.');
