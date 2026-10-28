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
// Test 1: Organizational Hierarchy & Reporting Lines
// -------------------------------------------------------------
runTest('Organizational Hierarchy: 100% of employees have valid reporting lines', () => {
  const emps = db.query('SELECT id, emp_code, full_name_ar, manager_id FROM employees');
  assert.strictEqual(emps.length, 114, 'Should have exactly 114 employees in database');

  const withoutManager = emps.filter(e => !e.manager_id);
  assert.strictEqual(withoutManager.length, 1, 'Only Chairman (JM-0001) should have manager_id IS NULL');
  assert.strictEqual(withoutManager[0].emp_code, 'JM-0001', 'The unmanaged employee must be Chairman JM-0001');

  // Verify Abdulmalik reports to Chairman
  const abdulmalik = emps.find(e => e.emp_code === 'JM-1000');
  const chairman = emps.find(e => e.emp_code === 'JM-0001');
  assert.strictEqual(abdulmalik.manager_id, chairman.id, 'Abdulmalik (JM-1000) must report to Chairman (JM-0001)');

  // Verify Shama reports to Abdulmalik
  const shama = emps.find(e => e.emp_code === 'JM-1053');
  assert.strictEqual(shama.manager_id, abdulmalik.id, 'Shama (JM-1053) must report to Abdulmalik (JM-1000)');
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
  const abdulmalik = db.get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-1000'");
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
  const abdulmalik = db.get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-1000'");
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
  const abdulmalik = db.get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-1000'");
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
  assert.strictEqual(kpis.total, 1, 'Total leaves count must be 1');
  assert.strictEqual(kpis.pendingManager, 1, 'pendingManager must be 1');
  assert.strictEqual(kpis.pendingHR, 0, 'pendingHR must be 0');
  assert.strictEqual(kpis.approved, 0, 'approved must be 0');
});

// -------------------------------------------------------------
// Test 10: New Leave Submission Auto-Sync & Pipeline Creation
// -------------------------------------------------------------
runTest('New Request Submission: Automatic manager binding and two-way sync', () => {
  const abdulmalik = db.get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-1000'");
  const shama = db.get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-1053'");

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

if (passedTests === totalTests) {
  console.log('★ ALL AUDIT AND APPROVAL WORKFLOW TESTS PASSED PERFECTLY ★');
  process.exit(0);
} else {
  console.error('SOME TESTS FAILED');
  process.exit(1);
}
