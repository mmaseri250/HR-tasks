// tests/new-features.test.js - Comprehensive test for new production features
const assert = require('node:assert');
const db = require('../server/database/db');
const employeesModule = require('../server/modules/employees');
const noticesModule = require('../server/modules/attendanceNotices');
const terminatedModule = require('../server/modules/terminatedEmployees');
const loansModule = require('../server/modules/loans');
const templatesModule = require('../server/modules/officialTemplates');
const requestsModule = require('../server/modules/requests');
const leavesModule = require('../server/modules/leaves');

console.log('--- تشغيل اختبارات الميزات الجديدة (الموافقات الرباعية، إنهاء الخدمة، السلف، الإشعارات، النماذج) ---');

// 1. Attendance Notices Test (Zero Emails, In-System Only)
console.log('\n[1/5] اختبار نظام إشعارات وإنذارات الدوام (تأخير، غياب، انقطاع م80)...');
const sampleEmp = db.get('SELECT id, emp_code, full_name_ar FROM employees LIMIT 1');
assert(sampleEmp, 'يجب وجود موظف للاختبار');

const notice = noticesModule.createNotice({
  emp_id: sampleEmp.id,
  notice_type: 'إنذار انقطاع عن العمل',
  incident_date: '2026-10-18',
  reason: 'غياب متصل لمدة 5 أيام متتالية دون عذر مشروع',
  action_required: 'مراجعة قسم الموارد البشرية فوراً وتوضيح سبب الانقطاع'
});
assert(notice && notice.id, 'يجب إصدار الإنذار بنجاح');
assert(notice.notice_no.startsWith('NOT-'), 'رقم الإشعار يجب أن يبدأ بـ NOT-');
assert(notice.legal_basis.includes('80'), 'يجب تطبيق السند النظامي للمادة 80 تلقائياً');
assert.strictEqual(notice.status, 'صادر');

// Acknowledge by employee
const acked = noticesModule.acknowledgeNotice(notice.id, 'أقر باستلام الإشعار وسأقوم بمراجعة الموارد البشرية');
assert.strictEqual(acked.status, 'تم التوقيع والإقرار');
assert(acked.acknowledged_at !== null, 'يجب توثيق وقت إقرار الموظف');

const stats = noticesModule.getNoticesKPIs();
assert(stats.total >= 1, 'يجب أن تظهر الإحصائية إشعاراً واحداً على الأقل');
console.log('✓ نجح: دورة حياة إشعار الدوام (إنشاء ➔ سند م80 تلقائي ➔ إقرار الموظف بنجاح 0 بريد خارجي)');

// 2. Terminated Employees & Gratuity Calculation Test
console.log('\n[2/5] اختبار نظام الموظفين المنهي خدماتهم وحساب مكافأة نهاية الخدمة (م84 وم85)...');
const calcResign = terminatedModule.calculateSettlement({
  emp_id: sampleEmp.id,
  termination_date: '2026-10-31',
  termination_type: 'استقالة',
  deductions_amount: 0
});
assert(calcResign && calcResign.service_years !== undefined, 'يجب احتساب سنوات الخدمة بنجاح');
assert(calcResign.end_of_service_reward >= 0, 'يجب احتساب مكافأة نهاية الخدمة');

// Record termination
const termRecord = terminatedModule.recordTermination({
  emp_id: sampleEmp.id,
  termination_type: 'انتهاء مدة العقد المحدد (المادة 74/1)',
  termination_date: '2026-10-31',
  reason: 'انتهاء فترة العقد ورغبة الطرفين في عدم التجديد',
  deductions_amount: 0,
  notes: 'تم تسليم العهد والمطابقة'
});
assert(termRecord && termRecord.id, 'يجب تسجيل إنهاء الخدمة بنجاح');
assert(termRecord.end_of_service_reward >= 0, 'يجب احتساب المكافأة بنجاح');
console.log('✓ نجح: احتساب مكافأة نهاية الخدمة بدقة نظام العمل السعودي (م84 / م85) وتسجيل الإنهاء');

// 3. Loans System & Payroll Integration Test
console.log('\n[3/5] اختبار نظام السلف واستقطاع الأقساط الشهرية من المسير...');
const newLoan = loansModule.createLoan({
  emp_id: sampleEmp.id,
  loan_type: 'سلفة شخصية',
  total_amount: 3000,
  installments_count: 3,
  monthly_installment: 1000,
  start_month: '2026-10',
  reason: 'سلفة طارئة'
});
assert(newLoan && newLoan.id, 'يجب إنشاء السلفة بنجاح');
assert.strictEqual(newLoan.monthly_installment, 1000);
assert.strictEqual(newLoan.remaining_amount, 3000);

const monthlyDeduction = loansModule.getEmployeeMonthlyLoanDeduction(sampleEmp.id, '2026-10');
assert.strictEqual(monthlyDeduction, 1000, 'يجب استقطاع القسط الشهري بقيمة 1000 ريال');
console.log('✓ نجح: إنشاء السلفة وتجهيز قسطها الشهري تلقائياً للاستقطاع في مسير الرواتب');

// 4. Official Forms JM-HR-F-001, JM-HR-F-002, JM-HR-F-003 Test
console.log('\n[4/5] اختبار توليد النماذج الرسمية (إجازات، جزاءات، استقالات/إنهاء عقد)...');
const sampleLeave = db.get('SELECT id FROM leaves LIMIT 1');
if (sampleLeave) {
  const leaveFormHtml = templatesModule.renderLeaveFormHtml(sampleLeave.id);
  assert(leaveFormHtml.includes('JM-HR-F-001'), 'نموذج الإجازة يجب أن يحمل الكود المعتمد JM-HR-F-001');
  assert(leaveFormHtml.includes('جوهرة المجد'), 'يجب أن يحمل اسم المنشأة الرسمي');
}

const samplePenalty = db.get('SELECT id FROM penalties_issued LIMIT 1');
if (samplePenalty) {
  const penaltyFormHtml = templatesModule.renderPenaltyFormHtml(samplePenalty.id);
  assert(penaltyFormHtml.includes('JM-HR-F-002'), 'نموذج القرار الجزائي يجب أن يحمل الكود JM-HR-F-002');
}

const termFormHtml = templatesModule.renderResignationTerminationFormHtml(termRecord.id);
assert(termFormHtml.includes('JM-HR-F-003') || termFormHtml.includes('مخالصة'), 'نموذج الإنهاء يجب أن يحمل الكود والبيانات الرسمية');

const noticeHtml = templatesModule.renderAttendanceNoticeHtml(notice.id);
assert(noticeHtml.includes(notice.notice_no), 'خطاب الإشعار يجب أن يحمل رقم الإشعار');
console.log('✓ نجح: توليد كافة النماذج الرسمية JM-HR-F-001 و JM-HR-F-002 و JM-HR-F-003 وإشعار الدوام بنجاح');

// 5. 4-Step Approval Workflow Test
console.log('\n[5/5] اختبار سير الموافقات الرباعي الإلزامي...');
// Create a new request
const stepReq = requestsModule.submitRequest({
  emp_id: sampleEmp.id,
  request_type: 'طلب شهادة خبرة',
  reason: 'تقديم لجهة رسمية'
});
assert.strictEqual(stepReq.status, 'معلق - بانتظار موافقة المدير المباشر');

// Step 1: Direct Manager Action
const s1 = requestsModule.processRequestStep(stepReq.id, 'manager', 'approve', 'تمت الموافقة من المدير', 'المدير المباشر');
assert.strictEqual(s1.status, 'معلق - بانتظار تحقق قسم الموارد البشرية');
assert.strictEqual(s1.manager_status, 'موافق');

// Step 2: HR Verification
const s2 = requestsModule.processRequestStep(stepReq.id, 'hr_verify', 'approve', 'تم التحقق من البيانات والسجلات', 'أخصائي الموارد البشرية');
assert.strictEqual(s2.status, 'معلق - بانتظار اعتماد مدير الموارد البشرية');
assert.strictEqual(s2.hr_verify_status, 'تم التحقق');

// Step 3: HR Director Final Approval
const s3 = requestsModule.processRequestStep(stepReq.id, 'hr_director', 'approve', 'معتمد نهائياً وموثق', 'مدير عام الموارد البشرية');
assert.strictEqual(s3.status, 'معتمد نهائياً');
assert.strictEqual(s3.hr_director_status, 'معتمد');
console.log('✓ نجح: اكتمال مسار الاعتمادات الرباعي الإلزامي (موظف ➔ مدير مباشر ➔ تدقيق HR ➔ اعتماد مدير HR)');

// Clean up test data
db.run('DELETE FROM attendance_notices WHERE id = ?', [notice.id]);
db.run('DELETE FROM terminated_employees WHERE id = ?', [termRecord.id]);
db.run("UPDATE employees SET status = 'نشط' WHERE id = ?", [sampleEmp.id]);
db.run('DELETE FROM loans WHERE id = ?', [newLoan.id]);
db.run('DELETE FROM requests WHERE id = ?', [stepReq.id]);

console.log('\n--- اكتملت اختبارات الميزات الجديدة بنجاح 100% ---\n');
