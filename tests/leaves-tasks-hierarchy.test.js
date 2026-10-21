// tests/leaves-tasks-hierarchy.test.js
const assert = require('node:assert');
const db = require('../server/database/db');
const { seedDatabase } = require('../server/database/seedData');
const employeesModule = require('../server/modules/employees');
const leavesModule = require('../server/modules/leaves');
const tasksModule = require('../server/modules/tasks');
const formsGenerator = require('../server/modules/formsGenerator');
const exportService = require('../server/modules/exportService');

async function runLeavesTasksHierarchyTests() {
  console.log('--- تشغيل اختبارات الإجازات، المهام، الهيكل الإداري، ونماذج Word والتصدير ---');

  seedDatabase();

  const employees = employeesModule.getAllEmployees();
  assert.strictEqual(employees.length, 114, 'يجب أن يكون عدد الموظفين 114 موظفاً معتمداً');

  // =========================================================================
  // 1. Leave Accrual & Balance Rules (نظام الإجازات والاستحقاق اليومي)
  // =========================================================================
  console.log('\n[1/5] اختبار قواعد رصيد الإجازات والاستحقاق اليومي (21 / 30 يوماً)...');

  // Case A: Service <= 5 years -> 21 days/year
  // Let's create an employee joined 2 years ago (2024-01-01)
  const empJunior = employeesModule.createEmployee({
    emp_code: 'JM-TEST-JUN',
    full_name_ar: 'موظف خدمة أقل من 5 سنوات',
    national_id: '1099112233',
    nationality: 'سعودي',
    email: 'junior.test@jalmajd.com',
    join_date: '2024-01-01',
    basic_salary: 7000,
    annual_leave_balance: 21
  });

  const juniorRate = leavesModule.getAnnualAccrualRate(empJunior.join_date, '2026-01-01');
  assert.strictEqual(juniorRate, 21, 'خدمة أقل من أو تساوي 5 سنوات يجب أن تستحق 21 يوماً سنوياً');

  // Case B: Service > 5 years -> 30 days/year
  // Let's create an employee joined 7 years ago (2019-01-01)
  const empSenior = employeesModule.createEmployee({
    emp_code: 'JM-TEST-SEN',
    full_name_ar: 'موظف خدمة أكثر من 5 سنوات',
    national_id: '1099112244',
    nationality: 'سعودي',
    email: 'senior.test@jalmajd.com',
    join_date: '2019-01-01',
    basic_salary: 12000
  });

  const seniorRate = leavesModule.getAnnualAccrualRate(empSenior.join_date, '2026-01-01');
  assert.strictEqual(seniorRate, 30, 'خدمة أكثر من 5 سنوات يجب أن تستحق 30 يوماً سنوياً');
  console.log('✓ نجح: تطبيق قاعدة 21 / 30 يوماً بحسب سنوات الخدمة الفعلية وتاريخ المباشرة بنجاح');

  // Test Balance retrieval
  const seniorBalance = leavesModule.getEmployeeLeaveBalance(empSenior.id);
  assert(seniorBalance, 'يجب استرجاع رصيد الإجازات');
  assert.strictEqual(seniorBalance.annual_entitlement, 30);
  assert(seniorBalance.current_balance >= 0, 'الرصيد الفعلي يجب أن يكون محسوباً بدقة');
  console.log(`✓ نجح: استرجاع رصيد الإجازات (الأساسي: ${seniorBalance.base_balance}، المستحق: ${seniorBalance.accrued_days}، الحالي: ${seniorBalance.current_balance})`);

  // =========================================================================
  // 2. Leave Request & 2-Tier Approval Flow (سير الموافقات: موظف -> مدير -> HR)
  // =========================================================================
  // Assign empSenior as direct manager of empJunior
  employeesModule.updateEmployee(empJunior.id, {
    ...empJunior,
    manager_id: empSenior.id
  });

  const leaveReq = leavesModule.submitLeaveRequest({
    emp_id: empJunior.id,
    leave_type: 'إجازة سنوية',
    start_date: '2026-11-10',
    end_date: '2026-11-14',
    days_count: 5,
    reason: 'إجازة عائلية اعتيادية'
  });

  assert(leaveReq && leaveReq.id, 'يجب إنشاء طلب الإجازة');
  assert(leaveReq.status.includes('بانتظار موافقة المدير المباشر'), 'حالة الطلب يجب أن تبدأ بانتظار موافقة المدير المباشر');
  assert(leaveReq.request_no.startsWith('LV-'), 'رقم الطلب يجب أن يبدأ بـ LV-');

  // Step 1: Direct Manager Approval
  const mgrApproved = leavesModule.approveLeave(leaveReq.id, 'approve', 'manager', 'موافقة المدير المباشر', 'مدير الإدارة المباشر');
  assert(mgrApproved.status.includes('الموارد البشرية'), 'حالة الطلب يجب أن تنتقل إلى الموارد البشرية');
  assert.strictEqual(mgrApproved.manager_status, 'موافق');

  // Step 2: HR Manager Final Approval
  const hrApproved = leavesModule.approveLeave(leaveReq.id, 'approve', 'hr', 'اعتماد نهائي وتحديث الرصيد', 'هاني عبدالرحمن القحطاني');
  assert.strictEqual(hrApproved.status, 'معتمد نهائياً');
  assert.strictEqual(hrApproved.hr_status, 'موافق');

  // Verify leave days deducted from balance
  const balAfterLeave = leavesModule.getEmployeeLeaveBalance(empJunior.id);
  assert.strictEqual(balAfterLeave.used_days, 5, 'الأيام المستهلكة يجب أن تزيد بـ 5 أيام بعد الاعتماد النهائي');
  console.log('✓ نجح: اكتمال دورة سير الموافقات المعتمدة وخصم الرصيد تلقائياً عند الاعتماد النهائي');

  // Test HR Manual Balance Adjustment & Audit Log
  const adjResult = leavesModule.adjustLeaveBalance({
    emp_id: empSenior.id,
    days_adjusted: 3.0,
    reason: 'مكافأة رصيد إجازة معتمدة من الإدارة',
    adjusted_by_name: 'مدير الموارد البشرية'
  });
  assert(adjResult.success, 'يجب نجاح تعديل الرصيد');
  assert.strictEqual(adjResult.balance_after - adjResult.balance_before, 3.0, 'فرق الرصيد يجب أن يساوي 3 أيام');

  const adjustmentsLog = leavesModule.getBalanceAdjustments(empSenior.id);
  assert(adjustmentsLog.length >= 1, 'يجب توثيق التعديل في سجل التدقيق الأمني');
  assert.strictEqual(adjustmentsLog[0].reason, 'مكافأة رصيد إجازة معتمدة من الإدارة');
  console.log('✓ نجح: تسوية وتعديل رصيد الإجازة بصلاحية HR وتوثيقه في سجل التدقيق (Audit Log)');

  // =========================================================================
  // 3. Tasks Management System (نظام المهام والمتابعة الإدارية)
  // =========================================================================
  console.log('\n[3/5] اختبار نظام المهام المستقل، نسب الإنجاز، ولوحة متابعة المديرين...');

  const newTask = tasksModule.createTask({
    title: 'تجهيز مستندات الأيزو لفرع محايل عسير',
    description: 'مراجعة إجراءات الجودة والتأكد من مطابقة السجلات الميدانية',
    assigned_to: empSenior.id,
    start_date: '2026-10-10',
    due_date: '2026-10-30',
    priority: 'عالية'
  });

  assert(newTask && newTask.id, 'يجب إنشاء المهمة بنجاح');
  assert.strictEqual(newTask.status, 'جديدة');
  assert.strictEqual(newTask.progress_percentage, 0);
  assert(newTask.task_no.startsWith('TSK-'), 'رقم المهمة يجب أن يبدأ بـ TSK-');

  // Update Progress %
  const updatedTask = tasksModule.updateTask(newTask.id, {
    progress_percentage: 60,
    status: 'قيد التنفيذ'
  });
  assert.strictEqual(updatedTask.progress_percentage, 60);
  assert.strictEqual(updatedTask.status, 'قيد التنفيذ');

  // Submit for Approval (100%)
  const readyTask = tasksModule.updateTask(newTask.id, {
    progress_percentage: 100,
    status: 'بانتظار الاعتماد'
  });
  assert.strictEqual(readyTask.status, 'بانتظار الاعتماد');

  // Manager Approval (Tier 1 - Direct Manager)
  const mgrTask = tasksModule.approveTask(newTask.id, 'approve', 'manager', 'موافقة المدير المباشر');
  assert.strictEqual(mgrTask.manager_approval, 'معتمد من المدير المباشر');

  // HR Manager Approval (Tier 2 - Final Approval)
  const approvedTask = tasksModule.approveTask(newTask.id, 'approve', 'hr', 'تم إنجاز المهمة بكفاءة واعتمادها');
  assert.strictEqual(approvedTask.status, 'مكتملة');

  // Test Manager Dashboard Metrics
  const dashMetrics = tasksModule.getTasksDashboardMetrics();
  assert(dashMetrics.total >= 1, 'إجمالي المهام يجب أن يكون 1 على الأقل');
  assert(dashMetrics.completed >= 1, 'المهام المكتملة يجب أن تتضمن المهمة المعتمدة');
  assert(dashMetrics.completionRate > 0, 'نسبة الإنجاز العامة يجب أن تكون محسوبة');
  console.log(`✓ نجح: نظام المهام ولوحة المديرين (الإجمالي: ${dashMetrics.total}، المكتملة: ${dashMetrics.completed}، نسبة الإنجاز: ${dashMetrics.completionRate}%)`);

  // =========================================================================
  // 4. Organizational Hierarchy & Direct Manager (الهيكل الإداري والمدير المباشر)
  // =========================================================================
  console.log('\n[4/5] اختبار تعيين المدير المباشر والهيكل الإداري الشجري...');

  // Assign empJunior to report to empSenior
  employeesModule.updateEmployee(empJunior.id, {
    ...empJunior,
    manager_id: empSenior.id
  });

  const updatedJunior = employeesModule.getEmployeeById(empJunior.id);
  assert.strictEqual(updatedJunior.manager_id, empSenior.id, 'يجب تعيين المدير المباشر بنجاح');

  const hierarchy = employeesModule.getOrgHierarchy();
  assert(hierarchy && hierarchy.tree, 'يجب استرجاع شجرة الهيكل التنظيمي');
  assert(hierarchy.flat.length >= 109, 'الهيكل المسطح يجب أن يضم موظفي الشركة');

  // Check senior's subordinates
  const seniorNode = hierarchy.tree.find(n => n.id === empSenior.id);
  if (seniorNode) {
    assert(seniorNode.subordinates.some(sub => sub.id === empJunior.id), 'يجب أن يظهر المرؤوس تحت مديره المباشر في الشجرة');
  }
  console.log('✓ نجح: تعيين المدير المباشر وعرض الهيكل الإداري الشجري بدقة');

  // =========================================================================
  // 5. HR Word Forms & Universal Exports (.docx and .xlsx)
  // =========================================================================
  console.log('\n[5/5] اختبار توليد نماذج Word الـ 6 الرسمية والتصدير الشامل (Excel / Word)...');

  const formTypes = ['leave_request', 'loan_advance', 'salary_cert', 'return_from_leave', 'permission_request', 'mission_request'];
  for (const ft of formTypes) {
    const { buffer, filename } = await formsGenerator.generateWordForm(ft, empSenior.id, {
      startDate: '2026-11-01',
      endDate: '2026-11-05',
      days: 5,
      amount: 4000,
      hours: 2,
      destination: 'فرع محايل عسير',
      directedTo: 'مصرف الراجحي',
      reason: 'نموذج تجريبي للتحقق'
    });
    assert(buffer && buffer.length > 1000, `نموذج ${ft} يجب أن يولد ملف Word غير فارغ (> 1KB)`);
    assert(filename.endsWith('.docx'), `ملف ${ft} يجب أن ينتهي بـ .docx`);
  }
  console.log('✓ نجح: توليد نماذج الموارد البشرية الـ 6 المعتمدة بصيغة Word (.docx) بهوية جوهرة المجد الرسمية');

  // Universal Export Service (Excel & Word)
  const exportTypes = ['employees', 'attendance', 'leaves', 'tasks', 'penalties', 'payroll', 'permissions', 'reports'];
  for (const et of exportTypes) {
    const xlsx = exportService.exportToExcel(et);
    assert(xlsx.buffer && xlsx.buffer.length > 500, `تصدير ${et} بصيغة Excel يجب أن يولد ملفاً غير فارغ`);
    assert(xlsx.filename.endsWith('.xlsx'), `اسم ملف Excel لـ ${et} يجب أن ينتهي بـ .xlsx`);

    const docx = await exportService.exportToWord(et);
    assert(docx.buffer && docx.buffer.length > 1000, `تصدير ${et} بصيغة Word يجب أن يولد ملفاً غير فارغ`);
    assert(docx.filename.endsWith('.docx'), `اسم ملف Word لـ ${et} يجب أن ينتهي بـ .docx`);
  }
  console.log('✓ نجح: تصدير كافة أقسام النظام الـ 8 الرئيسية بصيغتي Excel (.xlsx) و Word (.docx)');

  // Clean up temporary test data
  leavesModule.deleteLeave(leaveReq.id);
  tasksModule.deleteTask(newTask.id);
  employeesModule.deleteEmployee(empJunior.id);
  employeesModule.deleteEmployee(empSenior.id);
  seedDatabase();

  console.log('\n--- اكتملت اختبارات الإجازات والمهام والهيكل ونماذج Word والتصدير بنجاح 100% ---\n');
}

module.exports = { runLeavesTasksHierarchyTests };

if (require.main === module) {
  runLeavesTasksHierarchyTests().catch(err => {
    console.error('❌ خطأ في الاختبار:', err);
    process.exit(1);
  });
}
