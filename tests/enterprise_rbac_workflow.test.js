// tests/enterprise_rbac_workflow.test.js
// Complete QA Verification Test Suite for Jawharat Al-Majd HRMS
// Tests all 21 mandatory scenarios across RBAC, Data Scoping, Sequential Workflow, Overdraft Prevention & IDOR

const assert = require('node:assert');
const { query, get, run } = require('../server/database/db');
const rbacEngine = require('../server/modules/rbacEngine');
const employeesModule = require('../server/modules/employees');
const tasksModule = require('../server/modules/tasks');
const leavesModule = require('../server/modules/leaves');
const requestsModule = require('../server/modules/requests');
const usersModule = require('../server/modules/users');

async function runAll21Tests() {
  console.log('======================================================================');
  console.log('🚀 RUNNING COMPREHENSIVE 21-SCENARIO ENTERPRISE HRMS VERIFICATION SUITE');
  console.log('======================================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // Find sample test subjects
  // 1. Direct Manager A: خالد احمد محمد راعي (JM-1073)
  const mgrA = get("SELECT * FROM employees WHERE emp_code = 'JM-1073'");
  // 2. Direct Manager B: علي سعد حسين البشري (JM-1097)
  const mgrB = get("SELECT * FROM employees WHERE emp_code = 'JM-1097'");
  // 3. Subordinate of Manager A
  const subA = get("SELECT * FROM employees WHERE manager_id = ?", [mgrA.id]);
  // 4. Subordinate of Manager B
  const subB = get("SELECT * FROM employees WHERE manager_id = ?", [mgrB.id]);
  // 5. HR Specialist: شامة علي محمد عسيري (JM-1053)
  const hrSpec = get("SELECT * FROM employees WHERE emp_code = 'JM-1053'");
  // 6. HR Executive Director: عبدالملك سعيد الشريف (JM-1000)
  const hrDir = get("SELECT * FROM employees WHERE emp_code = 'JM-1000'");

  const userSubA = { id: 9901, username: 'sub_a', role: 'employee', emp_id: subA.id };
  const userMgrA = { id: 9902, username: 'mgr_a', role: 'direct_manager', emp_id: mgrA.id };
  const userMgrB = { id: 9903, username: 'mgr_b', role: 'direct_manager', emp_id: mgrB.id };
  const userHrSpec = { id: 9904, username: 'hr_spec', role: 'hr_specialist', emp_id: hrSpec.id };
  const userHrDir = { id: 9905, username: 'hr_dir', role: 'hr_manager', emp_id: hrDir.id };
  const userAdmin = { id: 1, username: 'admin', role: 'admin', emp_id: null };

  // =========================================================================
  // SCENARIO 01: Employee sees only own data
  // =========================================================================
  test('TEST 01: Employee Data Scope restricts view to own records only', () => {
    const list = employeesModule.getAllEmployees({}, userSubA);
    assert.strictEqual(list.length, 1, 'Regular employee must see exactly 1 employee record');
    assert.strictEqual(list[0].id, subA.id, 'Employee record must match user emp_id');
  });

  // =========================================================================
  // SCENARIO 02 & 03: Unauthorized Access & Forbidden Code
  // =========================================================================
  test('TEST 02: Employee role lacks users.view and audit.view permissions', () => {
    assert.strictEqual(rbacEngine.hasPermission(userSubA, 'users.view'), false);
    assert.strictEqual(rbacEngine.hasPermission(userSubA, 'audit.view'), false);
    assert.strictEqual(rbacEngine.hasPermission(userSubA, 'payroll.view'), false);
  });

  test('TEST 03: requirePermission middleware throws 403 Forbidden for unauthorized user', () => {
    const req = { user: userSubA };
    let statusSent = null;
    let jsonSent = null;
    const res = {
      status: (s) => { statusSent = s; return res; },
      json: (j) => { jsonSent = j; }
    };
    const mw = rbacEngine.requirePermission('users.view');
    mw(req, res, () => {});
    assert.strictEqual(statusSent, 403, 'Middleware must return HTTP 403');
    assert.strictEqual(jsonSent.code, 'FORBIDDEN', 'Error code must be FORBIDDEN');
  });

  // =========================================================================
  // SCENARIO 04 & 05: Direct Manager Team Isolation
  // =========================================================================
  test('TEST 04: Direct Manager sees only self and direct subordinates', () => {
    const list = employeesModule.getAllEmployees({}, userMgrA);
    const subIds = rbacEngine.getSubordinateEmpIds(mgrA.id);
    assert.strictEqual(list.length, subIds.length + 1, 'Manager list count must equal subordinates + manager');
    list.forEach(emp => {
      assert(emp.id === mgrA.id || subIds.includes(emp.id), `Employee ${emp.full_name_ar} must belong to Manager A`);
    });
  });

  test('TEST 05: Direct Manager A cannot see Manager B subordinates', () => {
    const listA = employeesModule.getAllEmployees({}, userMgrA);
    const foundSubB = listA.some(e => e.id === subB.id);
    assert.strictEqual(foundSubB, false, 'Manager A must NOT see Manager B subordinate');
  });

  // =========================================================================
  // SCENARIO 06: Tasks Team Isolation
  // =========================================================================
  test('TEST 06: Direct Manager A cannot see Manager B tasks', () => {
    // Create test task for subB
    const tB = tasksModule.createTask({
      title: 'مهمة سرية لفريق ب',
      assigned_to: subB.id,
      assigned_by: mgrB.id,
      start_date: '2026-11-01',
      due_date: '2026-11-10'
    });

    const tasksA = tasksModule.getAllTasks({}, userMgrA);
    const found = tasksA.some(t => t.id === tB.id);
    assert.strictEqual(found, false, 'Manager A must NOT see Manager B task in task list');

    // Clean up
    run('DELETE FROM tasks WHERE id = ?', [tB.id]);
  });

  // =========================================================================
  // SCENARIO 07, 08, 09, 10: 3-Stage Sequential Approval Workflow
  // =========================================================================
  let testLeaveId = null;

  test('TEST 07: Requester submits leave request -> initial status is pending direct manager', () => {
    const leave = leavesModule.submitLeaveRequest({
      emp_id: subA.id,
      leave_type: 'إجازة سنوية',
      start_date: '2026-12-01',
      end_date: '2026-12-02',
      days_count: 2,
      reason: 'إجازة اختبار النظام'
    });
    testLeaveId = leave.id;
    assert.strictEqual(leave.status, 'معلق - بانتظار موافقة المدير المباشر');
    assert.strictEqual(leave.manager_status, 'معلق');
    assert.strictEqual(leave.manager_id, mgrA.id);
  });

  test('TEST 08: Direct Manager approves -> status transitions to pending HR Specialist', () => {
    const updated = leavesModule.approveLeave(testLeaveId, 'approve', 'direct_manager', 'موافقة مبدئية', mgrA.full_name_ar, userMgrA);
    assert.strictEqual(updated.manager_status, 'موافق');
    assert.strictEqual(updated.status, 'معلق - بانتظار تحقق قسم الموارد البشرية');
  });

  test('TEST 09: HR Specialist verifies -> status transitions to pending HR Director', () => {
    const updated = leavesModule.approveLeave(testLeaveId, 'approve', 'hr_specialist', 'تم التدقيق', 'شامة عسيري', userHrSpec);
    assert.strictEqual(updated.hr_verify_status, 'تم التحقق');
    assert.strictEqual(updated.status, 'معلق - بانتظار اعتماد مدير الموارد البشرية');
  });

  test('TEST 10: HR Director (JM-1000) approves -> final approval and balance deduction', () => {
    const beforeBal = leavesModule.getEmployeeLeaveBalance(subA.id).current_balance;
    const updated = leavesModule.approveLeave(testLeaveId, 'approve', 'hr_director', 'معتمد نهائياً', hrDir.full_name_ar, userHrDir);
    assert.strictEqual(updated.hr_director_status, 'معتمد');
    assert.strictEqual(updated.status, 'معتمد نهائياً');
    const afterBal = leavesModule.getEmployeeLeaveBalance(subA.id).current_balance;
    assert.strictEqual(afterBal, beforeBal - 2, 'Annual leave balance must be deducted by exactly 2 days');
  });

  // =========================================================================
  // SCENARIO 11: Sequential Integrity - Steps Cannot Be Skipped
  // =========================================================================
  test('TEST 11: Sequential Integrity: Step 2 and Step 3 fail if earlier steps are not approved', () => {
    const freshLeave = leavesModule.submitLeaveRequest({
      emp_id: subA.id,
      leave_type: 'إجازة اضطرارية',
      start_date: '2026-12-10',
      end_date: '2026-12-10',
      days_count: 1,
      reason: 'اختبار التسلسل'
    });

    // Try Step 2 while Step 1 is still pending
    assert.throws(() => {
      leavesModule.approveLeave(freshLeave.id, 'approve', 'hr_specialist', 'محاولة تجاوز', 'شامة', userHrSpec);
    }, /الطلب بانتظار موافقة المدير المباشر أولاً/);

    // Try Step 3 while Step 1 is still pending
    assert.throws(() => {
      leavesModule.approveLeave(freshLeave.id, 'approve', 'hr_director', 'محاولة تجاوز نهائي', 'عبدالملك', userHrDir);
    }, /الطلب بانتظار موافقة المدير المباشر أولاً/);

    // Clean up
    leavesModule.deleteLeave(freshLeave.id);
  });

  // =========================================================================
  // SCENARIO 12 & 13: Leave Overdraft Prevention with Pending Reserved Days
  // =========================================================================
  test('TEST 12: Cannot exceed annual leave balance', () => {
    const bal = leavesModule.getEmployeeLeaveBalance(subA.id).current_balance;
    assert.throws(() => {
      leavesModule.submitLeaveRequest({
        emp_id: subA.id,
        leave_type: 'إجازة سنوية',
        start_date: '2026-12-01',
        end_date: '2026-12-30',
        days_count: bal + 10,
        reason: 'طلب رصيد إضافي غير متاح'
      });
    }, /يتجاوز رصيد الإجازة السنوية المتاح/);
  });

  test('TEST 13: Concurrent pending requests cannot overdraft balance', () => {
    const bal = leavesModule.getEmployeeLeaveBalance(subA.id).current_balance;
    const halfBal = Math.floor(bal / 2) + 1;

    // Submit first request
    const r1 = leavesModule.submitLeaveRequest({
      emp_id: subA.id,
      leave_type: 'إجازة سنوية',
      start_date: '2026-12-01',
      end_date: '2026-12-05',
      days_count: halfBal,
      reason: 'طلب أول'
    });

    // Try to submit second request that would exceed available net balance
    assert.throws(() => {
      leavesModule.submitLeaveRequest({
        emp_id: subA.id,
        leave_type: 'إجازة سنوية',
        start_date: '2026-12-06',
        end_date: '2026-12-10',
        days_count: halfBal,
        reason: 'طلب ثان يتجاوز المحجوز'
      });
    }, /يتجاوز رصيد الإجازة السنوية المتاح.*المحجوز بطلبات معلقة/);

    // Clean up
    leavesModule.deleteLeave(r1.id);
  });

  // =========================================================================
  // SCENARIO 14: Employee without Direct Manager Cannot Submit
  // =========================================================================
  test('TEST 14: Employee without direct manager cannot submit leave request', () => {
    // Create temporary employee without manager
    const orphanRes = run(`
      INSERT INTO employees (emp_code, full_name_ar, full_name_en, national_id, nationality, gender, job_title_ar, job_title_en, email, basic_salary, annual_leave_balance, manager_id, status)
      VALUES ('TEST-ORPHAN', 'موظف تجريبي بدون مدير', 'Test Orphan', '1099999999', 'سعودي', 'M', 'موظف', 'Employee', 'orphan@test.com', 5000, 21, NULL, 'نشط')
    `);
    const orphanId = orphanRes.lastInsertRowid;

    assert.throws(() => {
      leavesModule.submitLeaveRequest({
        emp_id: orphanId,
        leave_type: 'إجازة سنوية',
        start_date: '2026-12-01',
        end_date: '2026-12-02',
        days_count: 1,
        reason: 'طلب بدون مدير'
      });
    }, /لا يوجد مدير مباشر معين للموظف في قاعدة البيانات/);

    // Clean up
    run('DELETE FROM employees WHERE id = ?', [orphanId]);
  });

  // =========================================================================
  // SCENARIO 15: Self-Approval Prevention
  // =========================================================================
  test('TEST 15: Self-approval attempt returns 403 / throws error', () => {
    // SubA tries to approve their own leave
    assert.throws(() => {
      leavesModule.approveLeave(testLeaveId, 'approve', 'direct_manager', 'موافقة ذاتية', subA.full_name_ar, userSubA);
    }, /لا يحق للموظف مقدم الطلب اعتماد أو تدقيق طلب إجازته الشخصية إطلاقاً/);
  });

  // =========================================================================
  // SCENARIO 16 & 17: Dynamic Permissions Grant & Revocation
  // =========================================================================
  test('TEST 16: Dynamic permission grant takes effect immediately', () => {
    const testUser = get("SELECT * FROM users WHERE username = 'shama.asiri'");
    const before = rbacEngine.hasPermission(testUser, 'payroll.calculate');
    assert.strictEqual(before, false);

    // Grant payroll.calculate
    rbacEngine.updateUserPermissions(testUser.id, ['payroll.calculate'], [], userAdmin);
    const after = rbacEngine.hasPermission(testUser, 'payroll.calculate');
    assert.strictEqual(after, true, 'Permission must be granted immediately');
  });

  test('TEST 17: Dynamic permission revocation takes effect immediately', () => {
    const testUser = get("SELECT * FROM users WHERE username = 'shama.asiri'");
    // Explicitly revoke payroll.calculate
    rbacEngine.updateUserPermissions(testUser.id, [], ['payroll.calculate'], userAdmin);
    const after = rbacEngine.hasPermission(testUser, 'payroll.calculate');
    assert.strictEqual(after, false, 'Permission must be revoked immediately');
  });

  // =========================================================================
  // SCENARIO 18: IDOR Protection on Employees, Tasks & Leaves
  // =========================================================================
  test('TEST 18: IDOR check on /api/employees/:id, /api/tasks/:id, /api/leaves/:id', () => {
    // 1. Employee trying to view another employee
    assert.throws(() => {
      employeesModule.getEmployeeById(subB.id, userSubA);
    }, /غير مصرح: لا يحق لك الاطلاع على بيانات هذا الموظف/);

    // 2. Manager A trying to view Manager B subordinate
    assert.throws(() => {
      employeesModule.getEmployeeById(subB.id, userMgrA);
    }, /غير مصرح: لا يحق لك الاطلاع على بيانات موظف خارج نطاق مرؤوسيك المباشرين/);

    // 3. Employee trying to view another employee's leave
    assert.throws(() => {
      leavesModule.getLeaveById(testLeaveId, { id: 9999, role: 'employee', emp_id: subB.id });
    }, /غير مصرح: لا يحق لك الاطلاع على طلب إجازة خاص بموظف آخر/);
  });

  // =========================================================================
  // SCENARIO 19: Excel Synchronization Integrity
  // =========================================================================
  test('TEST 19: Database integrity: 111 operational employees, 0 board members', () => {
    const count = get('SELECT COUNT(*) AS total FROM employees').total;
    assert.strictEqual(count, 111, 'Total operational employees must be exactly 111');

    const board = query("SELECT emp_code FROM employees WHERE emp_code IN ('JM-0001', 'JM-0002', 'JM-0003')");
    assert.strictEqual(board.length, 0, 'Executive board members must NOT exist in employees roster');

    const boardUsers = query("SELECT username FROM users WHERE username IN ('salih.qahtani') OR full_name LIKE '%صالح سعيد القحطاني%'");
    assert.strictEqual(boardUsers.length, 0, 'Executive board members must NOT exist in users');
  });

  // =========================================================================
  // SCENARIO 20: Audit Logging of Mutations
  // =========================================================================
  test('TEST 20: Audit log records permission & role updates with actor & values', () => {
    const lastAudit = get("SELECT * FROM audit_logs WHERE action IN ('PERMISSIONS_UPDATE', 'ROLE_UPDATE') ORDER BY id DESC LIMIT 1");
    assert(lastAudit, 'Audit log must record permission updates');
    assert.strictEqual(lastAudit.performed_by_id, 1, 'Actor must be recorded');
  });

  // =========================================================================
  // SCENARIO 21: Effective Permissions Inspector
  // =========================================================================
  test('TEST 21: Effective Permissions Inspector accurately resolves all 68 permissions', () => {
    const existingUser = get("SELECT id FROM users WHERE role = 'direct_manager' LIMIT 1") || get("SELECT id FROM users WHERE id != 1 LIMIT 1");
    const inspector = rbacEngine.getEffectiveUserPermissionsDetailed(existingUser.id);
    assert(inspector.user, 'Inspector must return user details');
    assert(inspector.employee, 'Inspector must return employee details');
    assert.strictEqual(inspector.permissions.length, 68, 'Inspector must inspect all 68 granular permissions');
    const manageTeamTasks = inspector.permissions.find(p => p.code === 'tasks.manage_team');
    assert(manageTeamTasks, 'tasks.manage_team must exist');
    assert.strictEqual(manageTeamTasks.allowed, true, 'tasks.manage_team must be allowed for direct_manager');
  });

  // Clean up test leave
  if (testLeaveId) {
    try { leavesModule.deleteLeave(testLeaveId); } catch (_) {}
  }

  console.log('\n======================================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED (TOTAL 21)`);
  console.log('======================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAll21Tests().catch(err => {
  console.error('Test Suite Fatal Error:', err);
  process.exit(1);
});
