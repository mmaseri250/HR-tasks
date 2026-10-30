// tests/emergency_recovery_audit.test.js
const assert = require('assert');
const { get, query, run } = require('../server/database/db');
const { getAuditLogs, getAuditStats, logAuditEvent } = require('../server/modules/audit');
const officialTemplates = require('../server/modules/officialTemplates');
const terminatedModule = require('../server/modules/terminatedEmployees');
const payrollModule = require('../server/modules/payroll');

console.log('--- بدء اختبارات التدقيق والتعافي الشامل للنظام (Emergency System Recovery Test) ---');

// 1. Audit Log Engine Verification
console.log('1. اختبار محرك سجل الرقابة والعمليات (Audit Log Engine)...');
const testEvent = {
  user_id: 1,
  username: 'admin',
  action_type: 'TEST_AUDIT',
  module_name: 'RECOVERY_VERIFICATION',
  record_id: '999',
  emp_code: 'JM-1000',
  department_name: 'الموارد البشرية',
  details: 'اختبار التدقيق والتعافي الشامل لنظام الموارد البشرية',
  status: 'SUCCESS',
  ip_address: '127.0.0.1'
};

const loggedId = logAuditEvent(null, testEvent);
assert(loggedId > 0, 'يجب أن يتم تسجيل عملية الرقابة بنجاح والحصول على معرف سجل');

const logsResult = getAuditLogs({ action: 'TEST_AUDIT', limit: 10 });
assert(logsResult.logs && logsResult.logs.length > 0, 'يجب أن يتم استرجاع سجلات الرقابة مع الفلاتر');
assert.strictEqual(logsResult.logs[0].action, 'TEST_AUDIT');

const stats = getAuditStats();
assert(stats.total_events > 0, 'إحصائيات سجل الرقابة يجب أن تحسب الأحداث بشكل صحيح');
console.log('✓ محرك سجل الرقابة يعمل بكفاءة وأمان تام.');

// 2. Database Schema & Integrity Check
console.log('2. التحقق من سلامة الجداول والعلاقات وعدم وجود سجلات يتيمة...');
const tables = query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").map(t => t.name);
assert(tables.includes('employees'), 'جدول الموظفين يجب أن يكون موجوداً');
assert(tables.includes('audit_logs'), 'جدول سجل الرقابة يجب أن يكون موجوداً');
assert(tables.includes('payroll_periods'), 'جدول فترات الرواتب يجب أن يكون موجوداً');
assert(tables.includes('payroll_items'), 'جدول بنود الرواتب يجب أن يكون موجوداً');
assert(tables.includes('leaves'), 'جدول الإجازات يجب أن يكون موجوداً');

const orphanLeaves = query('SELECT l.id FROM leaves l LEFT JOIN employees e ON l.emp_id = e.id WHERE e.id IS NULL');
assert.strictEqual(orphanLeaves.length, 0, 'يجب ألا توجد أي إجازات يتيمة');

const orphanPayrollItems = query('SELECT pi.id FROM payroll_items pi LEFT JOIN employees e ON pi.emp_id = e.id WHERE e.id IS NULL');
assert.strictEqual(orphanPayrollItems.length, 0, 'يجب ألا توجد أي بنود رواتب لموظفين غير موجودين');
console.log('✓ قاعدة البيانات سليمة 100% ولا توجد أي قيود منكسرة أو سجلات يتيمة.');

// 3. Payroll Period & Items Verification (Fix for the Blank Screen issue)
console.log('3. التحقق من مسيرات الرواتب (حماية الأجور WPS) ومعالجة الشاشة البيضاء...');
let latestPeriod = get('SELECT * FROM payroll_periods ORDER BY id DESC LIMIT 1');
if (!latestPeriod) {
  payrollModule.getPayrollPeriods();
  latestPeriod = get('SELECT * FROM payroll_periods ORDER BY id DESC LIMIT 1');
}
assert(latestPeriod, 'يجب أن توجد فترة مسير رواتب مسجلة في النظام');

const payrollItems = query('SELECT * FROM payroll_items WHERE payroll_period_id = ?', [latestPeriod.id]);
assert(payrollItems.length > 0, `مسير الرواتب ${latestPeriod.period_name} يجب أن يحتوي على بنود الموظفين`);
console.log(`✓ مسير الرواتب يحوي ${payrollItems.length} موظفاً بإجمالي صافي رواتب: ${latestPeriod.total_net} ر.س`);

// 4. Verification of All 8 Official HR Forms
console.log('4. التحقق من النماذج الرسمية الثمانية لشركة جوهرة المجد...');
const testEmp = get('SELECT * FROM employees ORDER BY id ASC LIMIT 1');
assert(testEmp, 'يجب أن يتوفر موظف لإجراء اختبار النماذج');

const formsToTest = [
  { name: 'JM-HR-F-001 (Leave)', fn: () => officialTemplates.renderLeaveFormHtml(testEmp.id) },
  { name: 'JM-HR-F-001/ABS (Absence Penalty)', fn: () => officialTemplates.renderAbsencePenaltyNoticeHtml(testEmp.id) },
  { name: 'JM-HR-F-002/INS (Instruction Penalty)', fn: () => officialTemplates.renderInstructionPenaltyNoticeHtml(testEmp.id) },
  { name: 'JM-HR-F-002 (Penalty Decision)', fn: () => officialTemplates.renderPenaltyFormHtml(testEmp.id) },
  { name: 'JM-HR-F-003 (Resignation)', fn: () => officialTemplates.renderResignationTerminationFormHtml(testEmp.id) },
  { name: 'JM-HR-F-004/CNR (Contract Non-Renewal)', fn: () => officialTemplates.renderContractNonRenewalHtml(testEmp.id) },
  { name: 'JM-HR-F-005 (Clearance)', fn: () => officialTemplates.renderClearanceFormHtml(testEmp.id) },
  { name: 'JM-HR-F-008 (Salary Certificate)', fn: () => officialTemplates.renderSalaryCertHtml(testEmp.id) }
];

for (const form of formsToTest) {
  const html = form.fn();
  assert(html && html.includes('شركة جوهرة المجد'), `النموذج ${form.name} يجب أن يحتوي على اسم الشركة`);
  assert(html.includes('7004872169') || html.includes('س.ت:'), `النموذج ${form.name} يجب أن يحتوي على السجل التجاري الرسمي`);
  console.log(`  ✓ ${form.name} تم التوليد بنجاح`);
}

// 5. Verification of Qiwa End-of-Service Calculator
console.log('5. التحقق من توافق حاسبة مكافأة نهاية الخدمة مع منصة قوى ونظام العمل...');
assert.strictEqual(terminatedModule.QIWA_TERMINATION_REASONS.length, 17, 'يجب أن تحتوي القائمة على 17 سبباً معتمداً مطابقة لقوى');

// Article 84 base calculation: 6000 SAR for 6 years = (5 * 3000) + (1 * 6000) = 21,000 SAR
const baseGrat = terminatedModule.calculateBaseGratuity(6000, 6);
assert.strictEqual(baseGrat, 21000, 'احتساب المادة 84 يجب أن يكون دقيقاً');

// Article 85 resignation: 6 years -> 2/3 entitlement
const resignReason = terminatedModule.resolveTerminationReason('استقالة الموظف');
const entResign = terminatedModule.calculateEntitlement(resignReason, 6);
assert(Math.abs(entResign.rate - (2 / 3)) < 0.0001, 'استحقاق الاستقالة لـ 6 سنوات يجب أن يكون ثلثي المكافأة');
console.log(`✓ استحقاق استقالة 6 سنوات: ${entResign.pctLabel} وفق المادة 85`);

// Article 80: 0% entitlement
const art80 = terminatedModule.resolveTerminationReason('فسخ عقد العمل من قبل صاحب العمل وفقاً للمادة 80 من نظام العمل');
const entArt80 = terminatedModule.calculateEntitlement(art80, 5);
assert.strictEqual(entArt80.rate, 0, 'المادة 80 يجب أن تعطي 0% مكافأة');
console.log('✓ إنهاء العقد وفق المادة 80 يعطي صفر مكافأة نظاماً.');

console.log('\n================================================================');
console.log('  جميع اختبارات التعافي والتدقيق الشامل (Recovery Audit) اجتازت بنجاح 100%!  ');
console.log('================================================================');
