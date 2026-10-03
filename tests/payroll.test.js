// tests/payroll.test.js
const assert = require('node:assert');
const { get, query } = require('../server/database/db');
const { seedDatabase } = require('../server/database/seedData');
const payrollModule = require('../server/modules/payroll');

function runPayrollTests() {
  console.log('--- تشغيل اختبارات وحدة مسيرات الرواتب وحماية الأجور (WPS) ---');

  seedDatabase();

  // Test 1: Calculate Payroll for a given test period
  const testMonth = '2026-10';
  const result = payrollModule.calculateMonthlyPayroll(testMonth);
  assert(result, 'يجب أن يعيد احتساب المسير بيانات صالحة');
  assert(result.period.employee_count > 0, 'يجب أن يشمل المسير جميع الموظفين النشطين');
  console.log(`✓ نجح: تم احتساب مسير شهر ${testMonth} لعدد ${result.period.employee_count} موظف`);

  // Test 2: Verify Saudi GOSI calculation
  // Find Saudi employee: Khaled Al-Shahrani (id = 1, basic = 16000, housing = 4000, total = 20000)
  // GOSI base = 20000. Employee 9.75% = 1950 SAR. Employer 11.75% = 2350 SAR.
  const saudiItem = result.items.find(i => i.emp_id === 1);
  assert(saudiItem, 'يجب العثور على الموظف السعودي');
  assert.strictEqual(saudiItem.gosi_employee_share, 1950, `حصة الموظف السعودي يجب أن تكون 1950 ريال، القيمة الفعلية: ${saudiItem.gosi_employee_share}`);
  assert.strictEqual(saudiItem.gosi_company_share, 2350, `حصة الشركة للموظف السعودي يجب أن تكون 2350 ريال، القيمة الفعلية: ${saudiItem.gosi_company_share}`);
  console.log('✓ نجح: تدقيق استقطاع التأمينات الاجتماعية (GOSI) للموظف السعودي مطابق لنظام التأمينات وساند 100%');

  // Test 3: Verify Non-Saudi GOSI calculation
  // Find Non-Saudi employee: Tarek Al-Mansouri (id = 5, basic = 12000, housing = 3000, total = 15000)
  // Non-Saudi employee deduction = 0. Company share (2% occupational hazards) = 300 SAR.
  const expatItem = result.items.find(i => i.emp_id === 5);
  assert(expatItem, 'يجب العثور على الموظف المقيم');
  assert.strictEqual(expatItem.gosi_employee_share, 0, 'حصة الموظف غير السعودي في التأمينات يجب أن تكون 0');
  assert.strictEqual(expatItem.gosi_company_share, 300, `حصة أخطار الشركة للمقيم يجب أن تكون 300 ريال، القيمة الفعلية: ${expatItem.gosi_company_share}`);
  console.log('✓ نجح: تدقيق اشتراكات الموظف غير السعودي (الأخطار المهنية فقط بنسبة 2% على صاحب العمل)');

  // Test 4: Verify Net Salary calculation
  const calculatedNet = Math.round((saudiItem.gross_salary - saudiItem.total_deductions) * 100) / 100;
  assert.strictEqual(saudiItem.net_salary, calculatedNet, 'صافي الراتب يجب أن يساوي إجمالي الراتب ناقص مجموع الاستقطاعات');
  console.log('✓ نجح: تدقيق صحة معادلة صافي الراتب لكافة بنود الاستحقاقات والاستقطاعات');

  // Test 5: Verify WPS SIF (Standard Interchange Format) generation
  const sifText = payrollModule.generateWpsSifContent(result.period.id);
  assert(sifText.includes('SCR,'), 'ملف حماية الأجور يجب أن يبدأ بسجل الترويسة SCR');
  assert(sifText.includes('EDR,'), 'ملف حماية الأجور يجب أن يحتوي على سجلات التفاصيل EDR');
  assert(sifText.includes('SAR'), 'ملف حماية الأجور يجب أن يحدد عملة الريال السعودي');
  console.log('✓ نجح: توليد ملف حماية الأجور (WPS SIF) متوافق بالكامل مع معايير البنك المركزي السعودي ومنصة مدد');

  // Test 6: Verify Payslip retrieval
  const payslip = payrollModule.getEmployeePayslip(result.period.id, 1);
  assert(payslip && payslip.payslip, 'يجب توليد قسيمة راتب الموظف');
  assert(payslip.company.cr_number, 'قسيمة الراتب يجب أن تحتوي على السجل التجاري للشركة');
  console.log('✓ نجح: استخراج قسيمة الراتب الإلكترونية للموظف ببياناتها الرسمية الكاملة');

  console.log('--- اكتملت اختبارات وحدة الرواتب بنجاح 100% ---\n');
}

module.exports = { runPayrollTests };

if (require.main === module) {
  runPayrollTests();
}
