// tests/crud_all_modules.test.js
const assert = require('assert');
const db = require('../server/database/db');
const employeesModule = require('../server/modules/employees');
const attendanceModule = require('../server/modules/attendance');
const payrollModule = require('../server/modules/payroll');
const leavesModule = require('../server/modules/leaves');
const tasksModule = require('../server/modules/tasks');
const penaltiesModule = require('../server/modules/penalties');
const loansModule = require('../server/modules/loans');
const terminatedEmployeesModule = require('../server/modules/terminatedEmployees');
const absenceNoticesModule = require('../server/modules/absenceNotices');

function runAllModulesCrudTests() {
  console.log('================================================================');
  console.log('   اختبار العمليات الشاملة لكافة وحدات النظام (CRUD & Actions)   ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function runSubTest(name, fn) {
    try {
      fn();
      console.log(`✓ [نجاح]: ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ [فشل]: ${name}`);
      console.error(`  الخطأ: ${err.message}\n`);
      failed++;
    }
  }

  // 1. لوحة المؤشرات والإحصائيات العامة
  runSubTest('الوحدة 1 (لوحة المؤشرات): جلب الإحصائيات المركزية وتوزيع الموظفين', () => {
    const stats = db.get(`
      SELECT 
        (SELECT COUNT(*) FROM employees WHERE status = 'نشط') AS activeEmps,
        (SELECT COUNT(*) FROM departments) AS totalDepts,
        (SELECT COUNT(*) FROM branches) AS totalBranches,
        (SELECT COUNT(*) FROM leaves WHERE status LIKE '%بانتظار%') AS pendingLeaves
    `);
    assert.strictEqual(stats.activeEmps, 114);
    assert.strictEqual(stats.totalDepts, 15);
    assert.strictEqual(stats.totalBranches, 10);
  });

  // 2. وحدة الموظفين (Employees CRUD & Search & Filter)
  let testEmpId = null;
  runSubTest('الوحدة 2 (الموظفون): إضافة وتعديل وبحث وتصفية وحذف موظف', () => {
    const dept = db.get("SELECT id FROM departments LIMIT 1");
    const branch = db.get("SELECT id FROM branches LIMIT 1");

    // Add
    const created = employeesModule.createEmployee({
      emp_code: 'JM-TEST-999',
      full_name_ar: 'موظف تجريبي للاختبار التقني',
      full_name_en: 'Test Employee for Technical Audit',
      national_id: '1099887766',
      email: 'test.emp.audit@jalmajd.com',
      phone: '0501234567',
      nationality: 'سعودي',
      is_saudi: 1,
      gender: 'M',
      department_id: dept.id,
      branch_id: branch.id,
      job_title_ar: 'أخصائي جودة',
      basic_salary: 8000,
      housing_allowance: 2000,
      transport_allowance: 1000,
      other_allowance: 0,
      bank_name: 'مصرف الراجحي',
      iban: 'SA0000000000000000000000'
    });
    assert.ok(created.id);
    testEmpId = created.id;

    // Search & Filter
    const searched = employeesModule.getAllEmployees({ search: 'موظف تجريبي' });
    assert.ok(searched.length >= 1);

    const filtered = employeesModule.getAllEmployees({ dept: String(dept.id) });
    assert.ok(filtered.some(e => e.id === testEmpId));

    // Edit
    employeesModule.updateEmployee(testEmpId, {
      job_title_ar: 'أخصائي جودة أول',
      basic_salary: 9500
    });
    const updated = employeesModule.getEmployeeById(testEmpId);
    assert.strictEqual(updated.basic_salary, 9500);

    // Delete
    employeesModule.deleteEmployee(testEmpId);
    const deleted = employeesModule.getEmployeeById(testEmpId);
    assert.strictEqual(deleted, undefined);
  });

  // 3. وحدة الحضور والانصراف (Attendance & Biometrics)
  runSubTest('الوحدة 3 (الحضور والانصراف): تسجيل بصمة داخل النطاق وحساب ساعات العمل', () => {
    const today = new Date().toISOString().split('T')[0];
    const chairman = db.get("SELECT id FROM employees WHERE emp_code = 'JM-0001'");

    // Record punch
    const punch = attendanceModule.recordPunch({
      emp_id: chairman.id,
      punch_time: `${today} 08:05:00`,
      punch_type: 'CHECK_IN',
      lat: 18.2164,
      lng: 42.5053,
      auth_method: 'biometric'
    });
    assert.ok(punch);

    // Daily attendance query
    const daily = attendanceModule.getDailyAttendance(today);
    assert.ok(Array.isArray(daily));

    // Clean up
    db.run("DELETE FROM attendance_logs WHERE emp_id = ? AND punch_time LIKE ?", [chairman.id, `${today}%`]);
  });

  // 4. وحدة الإجازات وسير الموافقات (Leaves & Workflows)
  let testLeaveId = null;
  runSubTest('الوحدة 4 (الإجازات والاعتمادات): تقديم إجازة وموافقتها بالكامل وتخصيم الرصيد', () => {
    const shama = db.get("SELECT id, manager_id FROM employees WHERE emp_code = 'JM-1053'");
    const leave = leavesModule.submitLeaveRequest({
      emp_id: shama.id,
      leave_type: 'إجازة سنوية',
      start_date: '2026-12-01',
      end_date: '2026-12-02',
      days_count: 2,
      reason: 'إجازة اختبارية مؤقتة'
    });
    assert.ok(leave.id);
    testLeaveId = leave.id;

    // Step 1: Direct Manager Approval
    leavesModule.processLeaveStep(testLeaveId, 'manager', 'approve', 'موافقة المدير', {
      emp_id: shama.manager_id,
      role: 'hr_manager',
      full_name: 'عبدالملك سعيد الشريف'
    });

    // Step 2: HR Verification
    leavesModule.processLeaveStep(testLeaveId, 'hr_verify', 'approve', 'تدقيق الموارد', {
      role: 'hr_manager',
      full_name: 'أخصائي الموارد'
    });

    // Step 3: HR Director Final Approval
    leavesModule.processLeaveStep(testLeaveId, 'hr_director', 'approve', 'اعتماد نهائي', {
      role: 'admin',
      full_name: 'مدير الموارد البشرية'
    });

    const approvedLeave = leavesModule.getLeaveById(testLeaveId);
    assert.strictEqual(approvedLeave.status, 'معتمد نهائياً');

    // Clean up test leave
    leavesModule.deleteLeave(testLeaveId);
  });

  // 5. وحدة المهام والمتابعة (Tasks & Progress)
  runSubTest('الوحدة 5 (المهام): إنشاء مهمة وتحديث نسبة الإنجاز والتحقق من لوحة المديرين', () => {
    const mgr = db.get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-1000'");
    const emp = db.get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-1053'");

    const task = tasksModule.createTask({
      title: 'مهمة مراجعة ملفات التوظيف',
      description: 'تدقيق ملفات الموظفين الجدد لشهر أكتوبر',
      assigned_to: emp.id,
      assigned_by: mgr.id,
      priority: 'high',
      start_date: '2026-10-01',
      due_date: '2026-11-15'
    });
    assert.ok(task.id);

    // Update progress to 100%
    const updated = tasksModule.updateTask(task.id, {
      progress_percentage: 100,
      status: 'مكتمل'
    });
    assert.strictEqual(updated.status, 'مكتمل');
    assert.strictEqual(updated.progress_percentage, 100);

    // Manager dashboard
    const dash = tasksModule.getTasksDashboardMetrics();
    assert.ok(dash.total >= 1);

    // Clean up
    tasksModule.deleteTask(task.id);
  });

  // 6. وحدة الجزاءات واللوائح (Penalties & Regulations)
  runSubTest('الوحدة 6 (الجزاءات والقرارات): إصدار قرار جزائي رسمي وحذفه بنجاح', () => {
    const emp = db.get("SELECT id FROM employees WHERE emp_code = 'JM-1053'");
    const penalty = penaltiesModule.issuePenaltyDecision({
      emp_id: emp.id,
      violation_code: 'v1',
      incident_date: '2026-10-25',
      investigation_details: 'تأخر عن موعد الحضور الصباحي بمقدار 10 دقائق',
      issued_by: 'عبدالملك سعيد الشريف'
    });
    assert.ok(penalty.id);

    const deleted = penaltiesModule.deleteIssuedPenalty(penalty.id);
    assert.ok(deleted);
  });

  // 7. وحدة مسيرات الرواتب (Payroll & WPS)
  runSubTest('الوحدة 7 (مسيرات الرواتب): احتساب مسير الشهر وإصدار ملف WPS SIF', () => {
    const result = payrollModule.calculateMonthlyPayroll('2026-10');
    assert.ok(result && result.period);

    const wpsContent = payrollModule.generateWpsSifContent(result.period.id);
    assert.ok(wpsContent);
    assert.ok(wpsContent.includes('SCR') && wpsContent.includes('EDR'));
  });

  // 8. وحدة السلف واستقطاع الأقساط (Loans)
  runSubTest('الوحدة 8 (السلف المالية): تسجيل سلفة واحتساب القسط الشهري وتصدير الإكسل', () => {
    const emp = db.get("SELECT id FROM employees WHERE emp_code = 'JM-1053'");
    const loan = loansModule.createLoan({
      emp_id: emp.id,
      loan_type: 'سلفة شخصية',
      total_amount: 6000,
      installments_count: 6,
      start_month: '2026-11',
      reason: 'سلفة زواج طارئة'
    });
    assert.ok(loan.id);
    assert.strictEqual(loan.monthly_installment, 1000);

    const exportBuf = loansModule.exportLoansToExcel();
    assert.ok(Buffer.isBuffer(exportBuf));

    // Clean up
    db.run("DELETE FROM loans WHERE id = ?", [loan.id]);
  });

  // 9. وحدة الموظفين المنهية خدماتهم (Terminated Employees & Settlement)
  runSubTest('الوحدة 9 (نهاية الخدمة): احتساب مكافأة نهاية الخدمة وفق المادتين 84 و 85', () => {
    const emp = db.get("SELECT id FROM employees WHERE emp_code = 'JM-1053'");
    const settlement = terminatedEmployeesModule.calculateSettlement({
      emp_id: emp.id,
      termination_date: '2026-10-31',
      termination_type: 'انتهاء مدة العقد المحدد (المادة 74/1)',
      deductions_amount: 0
    });
    assert.ok(settlement.service_years !== undefined);
    assert.ok(settlement.end_of_service_reward >= 0);
  });

  // 10. وحدة إشعارات الغياب الرسمية (Absence Notices)
  runSubTest('الوحدة 10 (إشعارات الغياب): إصدار إشعار غياب رسمي وتوثيق الإقرار', () => {
    const emp = db.get("SELECT id FROM employees WHERE emp_code = 'JM-0002'");
    const notice = absenceNoticesModule.createAbsenceNotice({
      emp_id: emp.id,
      absence_type: 'single',
      absence_date: '2026-10-20',
      days_count: 1,
      reason: 'غياب بدون عذر مسبق',
      issued_by: 'مدير الموارد البشرية'
    });
    assert.ok(notice.id);

    absenceNoticesModule.acknowledgeAbsenceNotice(notice.id, 'تم الاستلام والإقرار بالغياب');
    const updated = absenceNoticesModule.getAbsenceNoticeById(notice.id);
    assert.strictEqual(updated.status, 'تم الإقرار');

    // Clean up
    db.run("DELETE FROM attendance_notices WHERE id = ?", [notice.id]);
  });

  // 11. وحدة إدارة المستخدمين والصلاحيات (Users & RBAC)
  runSubTest('الوحدة 11 (المستخدمون والصلاحيات): التحقق من مستخدمي النظام والصلاحيات', () => {
    const users = db.query("SELECT id, username, role, permissions FROM users");
    assert.ok(users.length >= 2);
    const admin = users.find(u => u.username === 'admin');
    const hr = users.find(u => u.username === 'abdulmalik');
    assert.strictEqual(admin.role, 'admin');
    assert.strictEqual(hr.role, 'hr_manager');
  });

  // 12. إعدادات المنشأة (Company Settings)
  runSubTest('الوحدة 12 (إعدادات المنشأة): جلب وحفظ بيانات السجل التجاري وحماية الأجور', () => {
    const settings = db.get("SELECT * FROM company_settings WHERE id = 1");
    assert.strictEqual(settings.cr_number, '7004872169');
    assert.strictEqual(settings.wps_payer_id, 'EST7004872169');
    assert.strictEqual(settings.bank_code, 'RJHI');
  });

  console.log('\n================================================================');
  console.log(`إجمالي اختبارات العمليات الشاملة: ${passed + failed} | الناجحة: ${passed} | الفاشلة: ${failed}`);
  console.log(`نسبة النجاح: ${Math.round((passed / (passed + failed)) * 100)}%`);
  console.log('================================================================\n');

  if (failed > 0) {
    throw new Error(`فشل في ${failed} اختبار من اختبارات العمليات.`);
  }
}

if (require.main === module) {
  runAllModulesCrudTests();
}

module.exports = { runAllModulesCrudTests };
