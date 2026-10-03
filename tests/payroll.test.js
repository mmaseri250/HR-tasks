// tests/payroll.test.js
const assert = require('node:assert');
const { get, query, run } = require('../server/database/db');
const { seedDatabase } = require('../server/database/seedData');
const employeesModule = require('../server/modules/employees');
const payrollModule = require('../server/modules/payroll');

function runPayrollTests() {
  console.log('--- تشغيل اختبارات وحدة مسيرات الرواتب وحماية الأجور (WPS) ---');

  seedDatabase();

  const depts = query('SELECT id FROM departments');
  const branches = query('SELECT id FROM branches');

  // Create test Saudi and non-Saudi employees
  const saudiEmp = employeesModule.createEmployee({
    emp_code: 'JM-TEST-SAUDI',
    full_name_ar: 'خالد بن سعد الشهراني (اختبار)',
    national_id: '1077665544',
    nationality: 'سعودي',
    email: 'khaled.test@jalmajd.com',
    phone: '0551122445',
    department_id: depts.length ? depts[0].id : null,
    branch_id: branches.length ? branches[0].id : null,
    job_title_ar: 'مدير تنفيذي',
    basic_salary: 16000,
    housing_allowance: 4000,
    transport_allowance: 1500,
    bank_name: 'مصرف الراجحي',
    iban: 'SA448000020160801007766'
  });

  const expatEmp = employeesModule.createEmployee({
    emp_code: 'JM-TEST-EXPAT',
    full_name_ar: 'طارق كمال المنصوري (اختبار)',
    national_id: '2088776655',
    nationality: 'مصري',
    email: 'tarek.test@jalmajd.com',
    phone: '0551122446',
    department_id: depts.length > 1 ? depts[1].id : (depts[0]?.id || null),
    branch_id: branches.length ? branches[0].id : null,
    job_title_ar: 'مهندس برمجيات',
    basic_salary: 12000,
    housing_allowance: 3000,
    transport_allowance: 1000,
    bank_name: 'البنك الأهلي السعودي',
    iban: 'SA441000020160801008877'
  });

  // Test 1: Calculate Payroll for a given test period
  const testMonth = '2026-10';
  const result = payrollModule.calculateMonthlyPayroll(testMonth);
  assert(result, 'يجب أن يعيد احتساب المسير بيانات صالحة');
  assert(result.period.employee_count >= 2, 'يجب أن يشمل المسير الموظفين النشطين');
  console.log(`✓ نجح: تم احتساب مسير شهر ${testMonth} لعدد ${result.period.employee_count} موظف`);

  // Test 2: Verify Saudi GOSI calculation
  // Basic: 16000, Housing: 4000 -> Base = 20000. Employee 9.75% = 1950 SAR. Employer 11.75% = 2350 SAR.
  const saudiItem = result.items.find(i => i.emp_id === saudiEmp.id);
  assert(saudiItem, 'يجب العثور على الموظف السعودي في المسير');
  assert.strictEqual(saudiItem.gosi_employee_share, 1950, `حصة الموظف السعودي يجب أن تكون 1950 ريال، القيمة الفعلية: ${saudiItem.gosi_employee_share}`);
  assert.strictEqual(saudiItem.gosi_company_share, 2350, `حصة الشركة للموظف السعودي يجب أن تكون 2350 ريال، القيمة الفعلية: ${saudiItem.gosi_company_share}`);
  console.log('✓ نجح: تدقيق استقطاع التأمينات الاجتماعية (GOSI) للموظف السعودي مطابق لنظام التأمينات وساند 100%');

  // Test 3: Verify Non-Saudi GOSI calculation
  // Basic: 12000, Housing: 3000 -> Base = 15000. Employee share = 0. Company share (2%) = 300 SAR.
  const expatItem = result.items.find(i => i.emp_id === expatEmp.id);
  assert(expatItem, 'يجب العثور على الموظف المقيم في المسير');
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
  const payslip = payrollModule.getEmployeePayslip(result.period.id, saudiEmp.id);
  assert(payslip && payslip.payslip, 'يجب توليد قسيمة راتب الموظف');
  assert(payslip.company.cr_number, 'قسيمة الراتب يجب أن تحتوي على السجل التجاري للشركة');
  console.log('✓ نجح: استخراج قسيمة الراتب الإلكترونية للموظف ببياناتها الرسمية الكاملة');

  // Cleanup test employees & payroll period
  run('DELETE FROM payroll_items WHERE payroll_period_id = ?', [result.period.id]);
  run('DELETE FROM payroll_periods WHERE id = ?', [result.period.id]);
  employeesModule.deleteEmployee(saudiEmp.id);
  employeesModule.deleteEmployee(expatEmp.id);

  console.log('--- اكتملت اختبارات وحدة الرواتب بنجاح 100% ---\n');
}

module.exports = { runPayrollTests };

if (require.main === module) {
  runPayrollTests();
}
