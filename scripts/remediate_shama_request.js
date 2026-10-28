const db = require('../server/database/db');

console.log('=== REMEDIATE EXISTING REQUEST REQ-2026-0001 ===');

const req = db.get("SELECT * FROM requests WHERE request_no = 'REQ-2026-0001'");
if (!req) {
  console.log('Request REQ-2026-0001 not found.');
  process.exit(1);
}

console.log('Found request:', req);

// 1. Update requests table with manager details
db.run(`
  UPDATE requests
  SET manager_id = 9551,
      manager_name = 'عبدالملك سعيد الشريف',
      updated_at = datetime('now')
  WHERE id = ?
`, [req.id]);
console.log('Updated requests table: manager_id = 9551, manager_name = عبدالملك سعيد الشريف');

// Also update leaves table manager_name
db.run(`
  UPDATE leaves
  SET manager_id = 9551,
      manager_name = 'عبدالملك سعيد الشريف',
      updated_at = datetime('now')
  WHERE request_no = 'REQ-2026-0001'
`);
console.log('Updated leaves table: manager_id = 9551, manager_name = عبدالملك سعيد الشريف');

// 2. Insert into leaves table if not present
let leave = db.get("SELECT * FROM leaves WHERE request_no = 'REQ-2026-0001'");
if (!leave) {
  const result = db.run(`
    INSERT INTO leaves (
      request_no, emp_id, leave_type, start_date, end_date, days_count,
      reason, status, manager_id, manager_name,
      manager_status, hr_verify_status, hr_director_status, hr_status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'معلق', 'معلق', 'معلق', 'معلق', ?, datetime('now'))
  `, [
    req.request_no, req.emp_id, req.request_type, req.start_date, req.end_date,
    req.days_count, req.reason, req.status, 9551, 'عبدالملك سعيد الشريف', req.created_at
  ]);
  console.log('Created matching leaves record, id:', result.lastInsertRowid);
  leave = db.get("SELECT * FROM leaves WHERE id = ?", [result.lastInsertRowid]);
} else {
  console.log('Leaves record already exists, id:', leave.id);
}

// 3. Create workflow_steps
const existingSteps = db.query("SELECT * FROM workflow_steps WHERE request_id = ?", [req.id]);
if (existingSteps.length === 0) {
  db.run(`
    INSERT INTO workflow_steps (request_id, leave_id, step_order, step_name, role_required, assigned_to_emp_id, assigned_to_name, status, created_at, updated_at)
    VALUES (?, ?, 1, 'موافقة المدير المباشر', 'direct_manager', 9551, 'عبدالملك سعيد الشريف', 'معلق', datetime('now'), datetime('now'))
  `, [req.id, leave ? leave.id : null]);

  db.run(`
    INSERT INTO workflow_steps (request_id, leave_id, step_order, step_name, role_required, assigned_to_emp_id, assigned_to_name, status, created_at, updated_at)
    VALUES (?, ?, 2, 'تدقيق وتحقق قسم الموارد البشرية', 'hr_specialist', NULL, 'قسم الموارد البشرية', 'مؤجل', datetime('now'), datetime('now'))
  `, [req.id, leave ? leave.id : null]);

  db.run(`
    INSERT INTO workflow_steps (request_id, leave_id, step_order, step_name, role_required, assigned_to_emp_id, assigned_to_name, status, created_at, updated_at)
    VALUES (?, ?, 3, 'اعتماد مدير الموارد البشرية', 'hr_director', 9551, 'عبدالملك سعيد الشريف', 'مؤجل', datetime('now'), datetime('now'))
  `, [req.id, leave ? leave.id : null]);
  console.log('Created 3 workflow_steps.');
}

// 4. Create in-system notification for Abdulmalik
const existingNotifs = db.query("SELECT * FROM notifications WHERE emp_id = 9551 AND message LIKE '%REQ-2026-0001%'");
if (existingNotifs.length === 0) {
  db.run(`
    INSERT INTO notifications (emp_id, title, message, link, type, is_read, created_at)
    VALUES (9551, 'طلب إجازة بانتظار موافقتك', 'قدمت الموظفة شامة علي عسيري طلب إجازة سنوية برقم REQ-2026-0001 بانتظار موافقتك المباشرة.', '/#leaves', 'approval', 0, datetime('now'))
  `);
  console.log('Created notification for Abdulmalik.');
}

// 5. Create audit log
const existingLogs = db.query("SELECT * FROM audit_logs WHERE entity_type = 'request' AND entity_id = ?", [req.id]);
if (existingLogs.length === 0) {
  db.run(`
    INSERT INTO audit_logs (entity_type, entity_id, action, performed_by_id, performed_by_name, performed_by_role, old_status, new_status, stage, comment, created_at)
    VALUES ('request', ?, 'CREATE_REQUEST', 9442, 'شامة علي  محمد عسيري', 'employee', NULL, 'معلق - بانتظار موافقة المدير المباشر', 'المرحلة 1: موافقة المدير المباشر', ?, datetime('now'))
  `, [req.id, req.reason]);
  console.log('Created audit log entry.');
}

console.log('Remediation complete!');
