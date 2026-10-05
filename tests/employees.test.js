// tests/employees.test.js
const assert = require('node:assert');
const { seedDatabase } = require('../server/database/seedData');
const db = require('../server/database/db');
const employeesModule = require('../server/modules/employees');
const requestsModule = require('../server/modules/requests');

function runEmployeeAndRequestTests() {
  console.log('--- تشغيل اختبارات وحدة شؤون الموظفين والخدمة الذاتية ---');

  seedDatabase();

  // Test 1: Verify Initial Database State (109 official employees, 0 demo biometric devices)
  const initialEmployees = employeesModule.getAllEmployees();
  assert.strictEqual(initialEmployees.length, 109, 'يجب أن تحتوي قاعدة البيانات على 109 موظف رسمي من ملف جوهرة المجد');
  
  const depts = db.query('SELECT * FROM departments');
  assert.strictEqual(depts.length, 6, 'يجب أن تتوفر الإدارات الـ 6 المطلوبة بالكامل');

  const branches = db.query('SELECT * FROM branches');
  assert.strictEqual(branches.length, 4, 'يجب أن تتوفر الفروع الـ 4 المطلوبة بالكامل');

  const devices = db.query('SELECT * FROM biometric_devices');
  assert.strictEqual(devices.length, 0, 'يجب أن تبدأ أجهزة البصمة بـ 0 بعد حذف الأجهزة التجريبية');

  const users = db.query('SELECT * FROM users');
  assert.strictEqual(users.length, 1, 'يجب أن يحتوي النظام على حساب المدير العام فقط (admin)');
  assert.strictEqual(users[0].username, 'admin', 'اسم مستخدم المدير العام يجب أن يكون admin');

  // Verify Compliance Metrics for Official Employees
  const compMetrics = employeesModule.getComplianceMetrics();
  assert.strictEqual(compMetrics.metrics.expatCount, 74, 'يجب أن يكون عدد غير السعوديين 74 موظف');
  assert.strictEqual(compMetrics.metrics.saudiCount, 35, 'يجب أن يكون عدد السعوديين 35 موظف');
  assert.strictEqual(compMetrics.metrics.iqama.expiringSoon, 16, 'يجب أن يكون عدد الإقامات التي تنتهي قريباً 16 إقامة');
  assert.strictEqual(compMetrics.metrics.workPermits.active, 74, 'يجب أن تتوفر 74 رخصة عمل في قوى');
  assert.strictEqual(compMetrics.metrics.wps.complianceRate, 100, 'نسبة الالتزام بحماية الأجور يجب أن تكون 100%');

  console.log('✓ نجح: التحقق من استيراد 109 موظف رسمي، 0 أجهزة بصمة تجريبية، ومؤشر الامتثال الوزاري بنجاح');

  // Test 2: Create Real Employee with branch and department
  const branch1 = branches[0];
  const dept1 = depts[0];

  const newEmpData = {
    emp_code: 'JM-2001',
    full_name_ar: 'عبدالله بن محمد القحطاني',
    full_name_en: 'Abdullah Mohammed Al-Qahtani',
    national_id: '1088776655',
    nationality: 'سعودي',
    gender: 'M',
    email: 'abdullah.q@jalmajd.com',
    phone: '0551122334',
    department_id: dept1.id,
    branch_id: branch1.id,
    job_title_ar: 'مدير تنفيذي للعمليات',
    basic_salary: 16000,
    housing_allowance: 4000,
    transport_allowance: 1500,
    other_allowance: 500,
    bank_name: 'مصرف الراجحي',
    iban: 'SA448000020160801002001'
  };

  const created = employeesModule.createEmployee(newEmpData);
  assert(created && created.id, 'يجب إنشاء الموظف بنجاح');
  assert.strictEqual(created.is_saudi, 1, 'يجب تحديد جنسية الموظف كسعودي آلياً عبر رقم الهوية');
  assert.strictEqual(created.branch_id, branch1.id, 'يجب ربط الموظف بالفرع المحدد');
  console.log(`✓ نجح: تسجيل موظف فعلي جديد (${created.full_name_ar}) وربطه بالإدارة والفرع بنجاح`);

  // Test 3: Update Employee
  const updated = employeesModule.updateEmployee(created.id, {
    ...created,
    job_title_ar: 'الرئيس التنفيذي للعمليات',
    basic_salary: 18000
  });
  assert.strictEqual(updated.basic_salary, 18000, 'يجب تحديث الراتب بنجاح');
  console.log('✓ نجح: تعديل بيانات الموظف والمسمى والراتب بنجاح');

  // Test 4: Saudization Metrics with active employee
  const metrics = employeesModule.getSaudizationMetrics();
  assert(metrics.saudizationRate > 30, 'نسبة التوطين يجب أن تتجاوز 30% مع الموظفين السعوديين');
  assert.strictEqual(metrics.nitaqatBand, 'النطاق الأخضر المتوسط', 'المنشأة يجب أن تكون في النطاق الأخضر المتوسط');
  console.log(`✓ نجح: احتساب مؤشر التوطين ونطاقات (${metrics.saudizationRate}% - ${metrics.nitaqatBand})`);

  // Test 5: Submit Self-Service Request
  const leaveReq = requestsModule.submitRequest({
    emp_id: created.id,
    request_type: 'إجازة سنوية',
    start_date: '2026-11-01',
    end_date: '2026-11-05',
    days_count: 5,
    reason: 'إجازة اعتيادية سنوية'
  });
  assert(leaveReq && leaveReq.id, 'يجب حفظ طلب الإجازة بنجاح');
  assert(leaveReq.status.includes('بانتظار موافقة المدير المباشر'), 'حالة الطلب المبدئية يجب أن تكون معلق بانتظار موافقة المدير المباشر');
  console.log(`✓ نجح: تقديم طلب إجازة عبر الخدمة الذاتية بالرقم: ${leaveReq.request_no}`);

  // Test 6: Approval Workflow Stepper
  const mgrApproved = requestsModule.updateRequestStatus(leaveReq.id, 'موافقة مبدئية - بانتظار اعتماد الموارد البشرية', 'manager', 'موافقة المدير', 'المدير المباشر');
  assert.strictEqual(mgrApproved.status, 'موافقة مبدئية - بانتظار اعتماد الموارد البشرية');

  const finalApproved = requestsModule.updateRequestStatus(leaveReq.id, 'معتمد نهائياً', 'admin', 'اعتماد HR', 'مدير الموارد البشرية');
  assert.strictEqual(finalApproved.status, 'معتمد نهائياً');
  console.log('✓ نجح: اكتمال مسار الاعتمادات الثنائي (المدير المباشر ➔ الموارد البشرية)');

  // Test 7: Certified Salary Certificate with QR Code
  const certLetter = requestsModule.generateCertifiedSalaryLetter(created.id, 'مصرف الراجحي');
  assert(certLetter.certId.startsWith('JM-CERT-'), 'يجب توليد رقم مرجعي رسمي للشهادة');
  assert(certLetter.qrPayload.includes('AUTHENTIC_VERIFIED'), 'يجب تضمين كود التحقق الرقمي المشفر');
  assert.strictEqual(certLetter.employee.basic_salary, 18000, 'الراتب يجب أن يطابق القيمة المحدثة');
  console.log(`✓ نجح: إصدار خطاب تعريف بالراتب موثق برمز التحقق QR: ${certLetter.certId}`);

  // Test 8: Delete Employee (Clean up after test)
  employeesModule.deleteEmployee(created.id);
  const remaining = employeesModule.getAllEmployees();
  assert.strictEqual(remaining.length, 109, 'يجب حذف الموظف التجريبي بنجاح ليبقى في النظام الـ 109 موظف رسمي');
  console.log('✓ نجح: حذف الموظف وإعادة قاعدة البيانات لحالة الـ 109 موظف رسمي المعتمدين');

  console.log('--- اكتملت اختبارات شؤون الموظفين والخدمة الذاتية بنجاح 100% ---\n');
}

module.exports = { runEmployeeAndRequestTests };

if (require.main === module) {
  runEmployeeAndRequestTests();
}
