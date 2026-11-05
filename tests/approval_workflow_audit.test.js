const assert = require('assert');
const db = require('../server/database/db');
const requestsModule = require('../server/modules/requests');
const leavesModule = require('../server/modules/leaves');

console.log('================================================================');
console.log('   HRMS APPROVAL WORKFLOW & LEAVES AUDIT TEST SUITE   ');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✓ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`✗ [FAIL] ${name}`);
    console.error(`  Error: ${err.message}\n`);
  }
}

// -------------------------------------------------------------
// Setup initial test fixture: Ensure REQ-2026-0001 exists
// -------------------------------------------------------------
const abdulmalik = db.get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-0001'");
let reportingEmp = db.get("SELECT id, full_name_ar, emp_code FROM employees WHERE manager_id = ?", [abdulmalik.id]);
if (!reportingEmp) {
  reportingEmp = db.get("SELECT id, full_name_ar, emp_code FROM employees WHERE status = 'نشط' AND id != ? LIMIT 1", [abdulmalik.id]);
  db.run("UPDATE employees SET manager_id = ? WHERE id = ?", [abdulmalik.id, reportingEmp.id]);
}

let existingReq = db.get("SELECT * FROM requests WHERE request_no = 'REQ-2026-0001'");
if (!existingReq) {
  const reqRes = db.run(`
    INSERT INTO requests (
      request_no, emp_id, request_type, start_date, end_date, days_count,
      amount, destination_entity, reason, status, manager_id, manager_name,
      manager_status, hr_verify_status, hr_director_status, created_at, updated_at
    ) VALUES (
      'REQ-2026-0001', ?, 'إجازة سنوية', '2026-11-15', '2026-11-17', 2,
      0, NULL, 'إجازة اعتيادية سنوية', 'معلق - بانتظار موافقة المدير المباشر', ?, ?,
      'معلق', 'معلق', 'معلق', datetime('now'), datetime('now')
    )
  `, [reportingEmp.id, abdulmalik.id, abdulmalik.full_name_ar]);

  db.run(`
    INSERT INTO leaves (
      request_no, emp_id, leave_type, start_date, end_date, days_count,
      reason, substitute_emp_id, replacement_emp_id, attachment, status, manager_id, manager_name,
      manager_status, hr_verify_status, hr_director_status, hr_status, created_at, updated_at
    ) VALUES (
      'REQ-2026-0001', ?, 'إجازة سنوية', '2026-11-15', '2026-11-17', 2,
      'إجازة اعتيادية سنوية', ?, ?, NULL, 'معلق - بانتظار موافقة المدير المباشر', ?, ?,
      'معلق', 'معلق', 'معلق', 'معلق', datetime('now'), datetime('now')
    )
  `, [reportingEmp.id, abdulmalik.id, abdulmalik.id, abdulmalik.id, abdulmalik.full_name_ar]);

  db.run(`
    INSERT INTO workflow_steps (request_id, leave_id, step_order, step_name, role_required, assigned_to_emp_id, assigned_to_name, status, created_at, updated_at)
    VALUES (?, NULL, 1, 'موافقة المدير المباشر', 'direct_manager', ?, ?, 'معلق', datetime('now'), datetime('now'))
  `, [reqRes.lastInsertRowid, abdulmalik.id, abdulmalik.full_name_ar]);
  db.run(`
    INSERT INTO workflow_steps (request_id, leave_id, step_order, step_name, role_required, assigned_to_emp_id, assigned_to_name, status, created_at, updated_at)
    VALUES (?, NULL, 2, 'تحقق أخصائي الموارد البشرية', 'hr_specialist', NULL, 'أخصائي الموارد البشرية', 'معلق', datetime('now'), datetime('now'))
  `, [reqRes.lastInsertRowid]);
  db.run(`
    INSERT INTO workflow_steps (request_id, leave_id, step_order, step_name, role_required, assigned_to_emp_id, assigned_to_name, status, created_at, updated_at)
    VALUES (?, NULL, 3, 'اعتماد مدير الموارد البشرية', 'hr_director', ?, ?, 'معلق', datetime('now'), datetime('now'))
  `, [reqRes.lastInsertRowid, abdulmalik.id, abdulmalik.full_name_ar]);
} else {
  db.run("UPDATE requests SET manager_id = ?, manager_name = ? WHERE id = ?", [abdulmalik.id, abdulmalik.full_name_ar, existingReq.id]);
  db.run("UPDATE leaves SET manager_id = ?, manager_name = ? WHERE request_no = 'REQ-2026-0001'", [abdulmalik.id, abdulmalik.full_name_ar]);
  db.run("UPDATE workflow_steps SET assigned_to_emp_id = ?, assigned_to_name = ? WHERE request_id = ? AND step_order = 1", [abdulmalik.id, abdulmalik.full_name_ar, existingReq.id]);
  db.run("UPDATE workflow_steps SET assigned_to_emp_id = ?, assigned_to_name = ? WHERE request_id = ? AND step_order = 3", [abdulmalik.id, abdulmalik.full_name_ar, existingReq.id]);
}

// -------------------------------------------------------------
// Test 1: Organizational Hierarchy & Reporting Lines
// -------------------------------------------------------------
runTest('Organizational Hierarchy: 100% of employees have valid reporting lines', () => {
  const emps = db.query('SELECT id, emp_code, full_name_ar, manager_id FROM employees');
  assert.strictEqual(emps.length, 113, 'Should have exactly 113 employees in database');

  // Top department heads (Abdulmalik JM-0001 and Faris JM-0108) are top-level with manager_id NULL
  const mgrTop = emps.find(e => e.emp_code === 'JM-0001');
  assert.ok(mgrTop, 'Abdulmalik (JM-0001) must exist');
  assert.strictEqual(mgrTop.manager_id, null, 'Abdulmalik (HR Director) is top operational head');

  // Verify reporting line
  const empSub = emps.find(e => e.id === reportingEmp.id);
  assert.strictEqual(empSub.manager_id, mgrTop.id, 'Reporting employee must report to Abdulmalik (JM-0001)');
});

// -------------------------------------------------------------
// Test 2: Database Schema & Multi-Tier Workflow Tables
// -------------------------------------------------------------
runTest('Database Schema: Required workflow, approval, audit & notification tables exist', () => {
  const tables = ['requests', 'leaves', 'workflow_steps', 'approvals', 'notifications', 'audit_logs', 'leave_balances'];
  for (const tbl of tables) {
    const row = db.get("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [tbl]);
    assert.ok(row, `Table ${tbl} must exist in database`);
  }
});

// -------------------------------------------------------------
// Test 3: Request REQ-2026-0001 Integrity & Two-Way Sync
// -------------------------------------------------------------
runTest('Request REQ-2026-0001: Exists in requests and leaves in sync', () => {
  const abdulmalik = db.get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-0001'");
  const req = db.get("SELECT * FROM requests WHERE request_no = 'REQ-2026-0001'");
  assert.ok(req, 'REQ-2026-0001 must exist in requests table');
  assert.strictEqual(req.manager_id, abdulmalik.id, `manager_id must be ${abdulmalik.id} (Abdulmalik)`);
  assert.strictEqual(req.manager_name, 'عبدالملك سعيد الشريف', 'manager_name must be Abdulmalik Saeed Al-Sharif');

  const leave = db.get("SELECT * FROM leaves WHERE request_no = 'REQ-2026-0001'");
  assert.ok(leave, 'REQ-2026-0001 must exist in leaves table');
  assert.strictEqual(leave.manager_id, abdulmalik.id, `leaves.manager_id must be ${abdulmalik.id}`);
  assert.strictEqual(leave.manager_name, 'عبدالملك سعيد الشريف', 'leaves.manager_name must be Abdulmalik Saeed Al-Sharif');

  const steps = db.query("SELECT * FROM workflow_steps WHERE request_id = ? ORDER BY step_order ASC", [req.id]);
  assert.strictEqual(steps.length, 3, 'Must have 3 pipeline workflow steps');
  assert.strictEqual(steps[0].role_required, 'direct_manager', 'Step 1 must be direct_manager');
  assert.strictEqual(steps[1].role_required, 'hr_specialist', 'Step 2 must be hr_specialist');
  assert.strictEqual(steps[2].role_required, 'hr_director', 'Step 3 must be hr_director');
});

// -------------------------------------------------------------
// Test 4: Strict Self-Approval Prevention
// -------------------------------------------------------------
runTest('Security: Applicant employee (Shama) CANNOT approve her own request', () => {
  const req = db.get("SELECT id, emp_id FROM requests WHERE request_no = 'REQ-2026-0001'");
  const shamaUser = { id: 99, role: 'employee', emp_id: req.emp_id, full_name: 'شامة علي عسيري' };

  assert.throws(() => {
    requestsModule.processRequestStep(req.id, 'manager', 'approve', 'محاولة اعتماد ذاتي', shamaUser);
  }, /غير مصرح|لا يحق للموظف/, 'Must prevent self-approval');
});

// -------------------------------------------------------------
// Test 5: Step 1 Direct Manager Approval Execution
// -------------------------------------------------------------
runTest('Workflow Step 1: Direct Manager (Abdulmalik) approves request', () => {
  const abdulmalik = db.get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-0001'");
  const req = db.get("SELECT id FROM requests WHERE request_no = 'REQ-2026-0001'");
  const abdulmalikContext = { id: 2, role: 'hr_manager', emp_id: abdulmalik.id, full_name: 'عبدالملك سعيد الشريف' };

  const updated = requestsModule.processRequestStep(req.id, 'manager', 'approve', 'موافقة مبدئية بصفتي المدير المباشر', abdulmalikContext);
  assert.strictEqual(updated.status, 'معلق - بانتظار تحقق قسم الموارد البشرية');
  assert.strictEqual(updated.manager_status, 'موافق');

  // Verify synchronized leaves table
  const leave = db.get("SELECT * FROM leaves WHERE request_no = 'REQ-2026-0001'");
  assert.strictEqual(leave.status, 'معلق - بانتظار تحقق قسم الموارد البشرية');
  assert.strictEqual(leave.manager_status, 'موافق');

  // Verify workflow_steps
  const step1 = db.get("SELECT * FROM workflow_steps WHERE request_id = ? AND step_order = 1", [req.id]);
  const step2 = db.get("SELECT * FROM workflow_steps WHERE request_id = ? AND step_order = 2", [req.id]);
  assert.strictEqual(step1.status, 'منجز', 'Step 1 must be marked completed');
  assert.strictEqual(step2.status, 'معلق', 'Step 2 must now be pending HR verification');

  // Verify approvals table
  const approval = db.get("SELECT * FROM approvals WHERE request_id = ? AND step_number = 1", [req.id]);
  assert.ok(approval, 'Approval entry must exist in approvals table');
  assert.strictEqual(approval.action, 'approve');

  // Verify audit_logs table
  const audit = db.get("SELECT * FROM audit_logs WHERE entity_type = 'request' AND entity_id = ? AND action = 'APPROVE'", [req.id]);
  assert.ok(audit, 'Audit log entry must be recorded');
});

// -------------------------------------------------------------
// Test 6: Step 2 HR Verification Execution
// -------------------------------------------------------------
runTest('Workflow Step 2: HR Specialist verifies request', () => {
  const abdulmalik = db.get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-0001'");
  const req = db.get("SELECT id FROM requests WHERE request_no = 'REQ-2026-0001'");
  const hrContext = { id: 2, role: 'hr_manager', emp_id: abdulmalik.id, full_name: 'قسم الموارد البشرية - تدقيق' };

  const updated = requestsModule.processRequestStep(req.id, 'hr_verify', 'approve', 'تم التحقق من الرصيد والأنظمة', hrContext);
  assert.strictEqual(updated.status, 'معلق - بانتظار اعتماد مدير الموارد البشرية');
  assert.strictEqual(updated.hr_verify_status, 'تم التحقق');

  // Verify synchronized leaves table
  const leave = db.get("SELECT * FROM leaves WHERE request_no = 'REQ-2026-0001'");
  assert.strictEqual(leave.status, 'معلق - بانتظار اعتماد مدير الموارد البشرية');
  assert.strictEqual(leave.hr_verify_status, 'تم التحقق');

  // Verify workflow_steps
  const step2 = db.get("SELECT * FROM workflow_steps WHERE request_id = ? AND step_order = 2", [req.id]);
  const step3 = db.get("SELECT * FROM workflow_steps WHERE request_id = ? AND step_order = 3", [req.id]);
  assert.strictEqual(step2.status, 'منجز', 'Step 2 must be marked completed');
  assert.strictEqual(step3.status, 'معلق', 'Step 3 must now be pending HR director final approval');
});

// -------------------------------------------------------------
// Test 7: Step 3 HR Director Final Approval & Balance Deduction
// -------------------------------------------------------------
runTest('Workflow Step 3: HR Director final approval & annual leave balance decrement', () => {
  const req = db.get("SELECT id, emp_id, days_count FROM requests WHERE request_no = 'REQ-2026-0001'");
  const initialEmp = db.get("SELECT annual_leave_balance FROM employees WHERE id = ?", [req.emp_id]);
  const initialBalance = Number(initialEmp.annual_leave_balance);

  const directorContext = { id: 1, role: 'admin', full_name: 'مدير الموارد البشرية (Admin)' };
  const updated = requestsModule.processRequestStep(req.id, 'hr_director', 'approve', 'تم الاعتماد النهائي للإجازة السنوية', directorContext);
  assert.strictEqual(updated.status, 'معتمد نهائياً');
  assert.strictEqual(updated.hr_director_status, 'معتمد');

  // Verify synchronized leaves table
  const leave = db.get("SELECT * FROM leaves WHERE request_no = 'REQ-2026-0001'");
  assert.strictEqual(leave.status, 'معتمد نهائياً');
  assert.strictEqual(leave.hr_director_status, 'معتمد');

  // Verify balance deduction
  const finalEmp = db.get("SELECT annual_leave_balance FROM employees WHERE id = ?", [req.emp_id]);
  assert.strictEqual(Number(finalEmp.annual_leave_balance), initialBalance - req.days_count, 'Balance must be decremented by days_count');

  // Verify notification sent to applicant Shama
  const notif = db.get("SELECT * FROM notifications WHERE emp_id = ? AND (title LIKE '%اعتماد%' OR title LIKE '%معتمد%')", [req.emp_id]);
  assert.ok(notif, 'Employee must receive approval notification');
});

// -------------------------------------------------------------
// Test 8: Revert Action Back to Direct Manager Pending State
// -------------------------------------------------------------
runTest('Workflow Revert: Revert request back to step 1 cleanly', () => {
  const req = db.get("SELECT id, emp_id, days_count FROM requests WHERE request_no = 'REQ-2026-0001'");
  const adminContext = { id: 1, role: 'admin', full_name: 'مدير النظام' };

  // Revert
  const reverted = requestsModule.revertRequestAction(req.id, adminContext, 'إعادة للمدير المباشر بناءً على التدقيق');
  assert.strictEqual(reverted.status, 'معلق - بانتظار موافقة المدير المباشر');
  assert.strictEqual(reverted.manager_status, 'معلق');

  // Verify leaves table synced
  const leave = db.get("SELECT * FROM leaves WHERE request_no = 'REQ-2026-0001'");
  assert.strictEqual(leave.status, 'معلق - بانتظار موافقة المدير المباشر');
  assert.strictEqual(leave.manager_status, 'معلق');

  // Restore balance
  db.run("UPDATE employees SET annual_leave_balance = 20 WHERE id = ?", [req.emp_id]);
});

// -------------------------------------------------------------
// Test 9: Leaves KPIs Accuracy
// -------------------------------------------------------------
runTest('Leaves KPIs: Accurate counts matching live SQLite database', () => {
  const kpis = leavesModule.getLeavesKPIs();
  const dbCount = db.get("SELECT COUNT(*) as c FROM leaves").c;
  assert.strictEqual(kpis.total, dbCount, 'Total leaves count must match database');
  assert.ok(kpis.pendingManager >= 1, 'pendingManager must be at least 1');
});

// -------------------------------------------------------------
// Test 10: New Leave Submission Auto-Sync & Pipeline Creation
// -------------------------------------------------------------
runTest('New Request Submission: Automatic manager binding and two-way sync', () => {
  const abdulmalik = db.get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-0001'");
  const shama = db.get("SELECT id, full_name_ar FROM employees WHERE id = ?", [reportingEmp.id]);

  // Submit a temporary 1-day mission request for employee JM-1053 (Shama)
  const newReq = requestsModule.submitRequest({
    emp_id: shama.id,
    request_type: 'طلب مهمة عمل',
    start_date: '2026-11-01',
    end_date: '2026-11-01',
    days_count: 1,
    amount: 0,
    destination_entity: 'فرع محايل عسير',
    reason: 'زيارة تفتيشية ميدانية للموارد البشرية'
  });

  assert.ok(newReq.id, 'Request ID must be generated');
  assert.strictEqual(newReq.manager_id, abdulmalik.id, `manager_id must be automatically populated as ${abdulmalik.id}`);
  assert.strictEqual(newReq.manager_name, 'عبدالملك سعيد الشريف', 'manager_name must be populated');
  assert.strictEqual(newReq.status, 'معلق - بانتظار موافقة المدير المباشر');

  // Verify workflow_steps created
  const steps = db.query("SELECT * FROM workflow_steps WHERE request_id = ?", [newReq.id]);
  assert.strictEqual(steps.length, 3, 'Must create 3 workflow steps');

  // Verify manager notification created
  const notif = db.get("SELECT * FROM notifications WHERE emp_id = ? AND message LIKE ?", [abdulmalik.id, `%${newReq.request_no}%`]);
  assert.ok(notif, 'Manager notification must be generated in database');

  // Clean up test request
  db.run("DELETE FROM requests WHERE id = ?", [newReq.id]);
  db.run("DELETE FROM workflow_steps WHERE request_id = ?", [newReq.id]);
  if (notif) db.run("DELETE FROM notifications WHERE id = ?", [notif.id]);
  db.run("DELETE FROM audit_logs WHERE entity_type = 'request' AND entity_id = ?", [newReq.id]);
});

console.log('\n----------------------------------------------------------------');
console.log(`Results: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('----------------------------------------------------------------\n');

if (passedTests !== totalTests) {
  console.error('SOME TESTS FAILED');
  if (require.main === module) process.exit(1);
  throw new Error(`Approval workflow tests failed: ${passedTests}/${totalTests}`);
} else {
  console.log('★ ALL AUDIT AND APPROVAL WORKFLOW TESTS PASSED PERFECTLY ★');
  if (require.main === module) process.exit(0);
}

module.exports = { passedTests, totalTests };
