// tests/qiwa_settlement.test.js - Comprehensive Verification of Qiwa End-of-Service Calculator
const assert = require('assert');
const terminatedModule = require('../server/modules/terminatedEmployees');
const db = require('../server/database/db');

console.log('========================================================================');
console.log('   اختبار حاسبة مكافأة نهاية الخدمة المتوافقة 100% مع منصة قوى (Qiwa)');
console.log('========================================================================\n');

// 1. Verify all Qiwa Reasons exist
console.log('[1/5] التحقق من تحميل كافة أسباب الإنهاء المطابقة لمنصة قوى...');
assert.strictEqual(terminatedModule.QIWA_TERMINATION_REASONS.length, 17, 'يجب أن تحتوي القائمة على 17 سبباً معتمداً');

const requiredReasons = [
  'استقالة الموظف',
  'فسخ العقد خلال فترة التجربة وفقاً للمادة 53 من نظام العمل',
  'بإتفاق الطرفين وفقاً للمادة 74 من نظام العمل',
  'فسخ عقد العمل من قبل صاحب العمل وفقاً للمادة 80 من نظام العمل',
  'إنتهاء العقد بإنتهاء مدته',
  'بلوغ العامل سن التقاعد وفقاً للمادة 74 من نظام العمل',
  'إغلاق المنشأة نهائياً وفقاً للمادة 74 من نظام العمل',
  'إنهاء النشاط الذي يعمل فيه العامل وفقاً للمادة 74 من نظام العمل',
  'إنهاء العقد دون سبب مشروع وفقاً للمادة 77 من نظام العمل',
  'وفاة العامل وفقاً للمادة 79 من نظام العمل',
  'عجز العامل عن العمل (الناتج عن إصابة العمل) وفقاً للمادة 137 من نظام العمل',
  'إنتقال ملكية المنشأة (الفردية) إلى مالك جديد وفقاً للمادة 18 من نظام العمل',
  'إنهاء المرأة العاملة العقد بسبب الوضع وفقاً للمادة 87 من نظام العمل',
  'إنهاء المرأة العاملة العقد بسبب الزواج وفقاً للمادة 87 من نظام العمل',
  'وفاة صاحب العمل وفقاً للمادة 79 من نظام العمل إذا كانت شخصيته قد روعيت في عقد العمل',
  'فسخ العقد من قبل العامل وفقاً للمادة 81 من نظام العمل',
  'القوة القاهرة وفقاً للمادة 74 من نظام العمل'
];

requiredReasons.forEach(name => {
  const found = terminatedModule.QIWA_TERMINATION_REASONS.find(r => r.name === name);
  assert(found, `يجب توفر سبب الإنهاء: ${name}`);
});
console.log(`✓ نجح: تم التحقق من توفر جميع أسباب الإنهاء الـ 17 المعتمدة في منصة قوى.`);

// 2. Test Base Gratuity (Article 84)
console.log('\n[2/5] التحقق من احتساب المكافأة الأساسية (المادة 84 من نظام العمل)...');
// 6,000 SAR salary
// 3 years: 3 * (6000 * 0.5) = 9,000 SAR
assert.strictEqual(terminatedModule.calculateBaseGratuity(6000, 3), 9000);
// 5 years: 5 * (6000 * 0.5) = 15,000 SAR
assert.strictEqual(terminatedModule.calculateBaseGratuity(6000, 5), 15000);
// 7 years: (5 * 3000) + (2 * 6000) = 15000 + 12000 = 27,000 SAR
assert.strictEqual(terminatedModule.calculateBaseGratuity(6000, 7), 27000);
// 12 years: (5 * 3000) + (7 * 6000) = 15000 + 42000 = 57,000 SAR
assert.strictEqual(terminatedModule.calculateBaseGratuity(6000, 12), 57000);
console.log('✓ نجح: احتساب قاعدة المادة 84 (نصف شهر عن أول 5 سنوات وشهر عن السنوات التالية).');

// 3. Test Resignation Scale (Article 85)
console.log('\n[3/5] التحقق من شرائح استقالة الموظف (المادة 85 من نظام العمل)...');
const resignReason = terminatedModule.resolveTerminationReason('استقالة الموظف');

// Under 2 years: 0%
const entUnder2 = terminatedModule.calculateEntitlement(resignReason, 1.5);
assert.strictEqual(entUnder2.rate, 0);
assert(entUnder2.pctLabel.includes('0%'));

// Between 2 and 5 years: 1/3 (33.33%)
const ent2to5 = terminatedModule.calculateEntitlement(resignReason, 3);
assert(Math.abs(ent2to5.rate - (1 / 3)) < 0.0001);
assert(ent2to5.pctLabel.includes('33.33%'));

// Between 5 and 10 years: 2/3 (66.67%)
const ent5to10 = terminatedModule.calculateEntitlement(resignReason, 7);
assert(Math.abs(ent5to10.rate - (2 / 3)) < 0.0001);
assert(ent5to10.pctLabel.includes('66.67%'));

// 10 years and above: 100%
const ent10plus = terminatedModule.calculateEntitlement(resignReason, 11);
assert.strictEqual(ent10plus.rate, 1.0);
assert(ent10plus.pctLabel.includes('100%'));
console.log('✓ نجح: شرائح الاستقالة مطابقة 100% لنظام العمل وحاسبة قوى (0% -> 33.33% -> 66.67% -> 100%).');

// 4. Test Statutory Exceptions & 0% / 100% rules
console.log('\n[4/5] التحقق من الحالات الخاصة والاستثناءات النظامية...');
// Article 80: 0%
const art80 = terminatedModule.resolveTerminationReason('فسخ عقد العمل من قبل صاحب العمل وفقاً للمادة 80 من نظام العمل');
assert.strictEqual(terminatedModule.calculateEntitlement(art80, 8).rate, 0);

// Probation (Article 53): 0%
const probation = terminatedModule.resolveTerminationReason('فسخ العقد خلال فترة التجربة وفقاً للمادة 53 من نظام العمل');
assert.strictEqual(terminatedModule.calculateEntitlement(probation, 0.2).rate, 0);

// Contract Expiry: 100%
const expiry = terminatedModule.resolveTerminationReason('إنتهاء العقد بإنتهاء مدته');
assert.strictEqual(terminatedModule.calculateEntitlement(expiry, 3).rate, 1.0);

// Mutual agreement (Article 74/1): 100%
const mutual = terminatedModule.resolveTerminationReason('بإتفاق الطرفين وفقاً للمادة 74 من نظام العمل');
assert.strictEqual(terminatedModule.calculateEntitlement(mutual, 4).rate, 1.0);

// Maternity Exception (Article 87): 100%
const maternity = terminatedModule.resolveTerminationReason('إنهاء المرأة العاملة العقد بسبب الوضع وفقاً للمادة 87 من نظام العمل');
assert.strictEqual(terminatedModule.calculateEntitlement(maternity, 3).rate, 1.0);

// Marriage Exception (Article 87): 100%
const marriage = terminatedModule.resolveTerminationReason('إنهاء المرأة العاملة العقد بسبب الزواج وفقاً للمادة 87 من نظام العمل');
assert.strictEqual(terminatedModule.calculateEntitlement(marriage, 2.5).rate, 1.0);

// Article 81: 100%
const art81 = terminatedModule.resolveTerminationReason('فسخ العقد من قبل العامل وفقاً للمادة 81 من نظام العمل');
assert.strictEqual(terminatedModule.calculateEntitlement(art81, 4).rate, 1.0);

console.log('✓ نجح: اختبار الحالات المستثناة وحالات الاستحقاق الكامل والحرمان.');

// 5. Test Live Employee Calculation & Settlement Recording
console.log('\n[5/5] اختبار احتساب مستحقات موظف حقيقي في قاعدة البيانات وتسجيل الإنهاء...');
const testEmp = db.get("SELECT * FROM employees WHERE emp_code = 'JM-1053'");
assert(testEmp, 'يجب العثور على الموظف JM-1053');

const originalStatus = testEmp.status;

// Calculate settlement for testEmp with resignation
const calcResignation = terminatedModule.calculateSettlement({
  emp_id: testEmp.id,
  termination_date: '2026-10-31',
  termination_type: 'استقالة الموظف',
  deductions_amount: 500
});

assert(calcResignation.service_years > 0, 'يجب احتساب سنوات الخدمة');
assert(calcResignation.service_period.formatted, 'يجب توفير صيغة مقروءة للمدة');
assert(calcResignation.base_gratuity > 0, 'يجب احتساب المكافأة الأساسية');
assert.strictEqual(calcResignation.deductions_amount, 500, 'يجب تطبيق الاستقطاعات');
assert(calcResignation.total_settlement >= 0, 'صافي المستحقات يجب أن يكون موجباً');

// Calculate settlement with contract expiry (100%)
const calcExpiry = terminatedModule.calculateSettlement({
  emp_id: testEmp.id,
  termination_date: '2026-10-31',
  termination_type: 'إنتهاء العقد بإنتهاء مدته',
  deductions_amount: 0
});
assert.strictEqual(calcExpiry.end_of_service_reward, calcExpiry.base_gratuity, 'يجب استحقاق المكافأة كاملة');

// Record termination and verify record insertion
const recorded = terminatedModule.recordTermination({
  emp_id: testEmp.id,
  termination_date: '2026-10-31',
  termination_type: 'إنتهاء العقد بإنتهاء مدته',
  notes: 'اختبار الحسابات النظامية'
});

assert(recorded && recorded.id, 'يجب حفظ سجل إنهاء الخدمة');
assert.strictEqual(recorded.termination_type, 'إنتهاء العقد بإنتهاء مدته');

// Verify employee status updated
const updatedEmp = db.get("SELECT status FROM employees WHERE id = ?", [testEmp.id]);
assert.strictEqual(updatedEmp.status, 'منهي خدماته', 'يجب تحديث حالة الموظف إلى منهي خدماته');

// Cleanup test record and restore employee status
db.run("DELETE FROM terminated_employees WHERE id = ?", [recorded.id]);
db.run("UPDATE employees SET status = ? WHERE id = ?", [originalStatus, testEmp.id]);

const restoredEmp = db.get("SELECT status FROM employees WHERE id = ?", [testEmp.id]);
assert.strictEqual(restoredEmp.status, originalStatus, 'يجب استعادة حالة الموظف الأصلية بعد الاختبار');

console.log('✓ نجح: احتساب وتوثيق إنهاء الخدمة وتنظيف البيانات بنجاح 100%.');

console.log('\n========================================================================');
console.log('   جميع اختبارات حاسبة نهاية الخدمة ومنصة قوى نجحت بنسبة 100%');
console.log('========================================================================');
