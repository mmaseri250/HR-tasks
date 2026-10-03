// tests/employees.test.js
const assert = require('node:assert');
const { seedDatabase } = require('../server/database/seedData');
const employeesModule = require('../server/modules/employees');
const requestsModule = require('../server/modules/requests');

function runEmployeeAndRequestTests() {
  console.log('--- تشغيل اختبارات وحدة شؤون الموظفين والخدمة الذاتية ---');

  seedDatabase();

  // Test 1: Fetch Employees
  const allEmployees = employeesModule.getAllEmployees();
  assert(allEmployees.length >= 15, 'يجب أن يحتوي النظام على موظفي العينة الافتراضية');
  console.log(`✓ نجح: استرجاع قائمة الموظفين بعدد ${allEmployees.length} موظف بنجاح`);

  // Test 2: Saudization & Nitaqat Metrics
  const metrics = employeesModule.getSaudizationMetrics();
  assert(metrics.saudizationRate > 50, 'نسبة التوطين يجب أن تتجاوز 50%');
  assert(metrics.nitaqatBand.includes('بلاتيني') || metrics.nitaqatBand.includes('أخضر'), 'النطاق يجب أن يكون بلاتيني أو أخضر');
  console.log(`✓ نجح: نسبة التوطين الحالية ${metrics.saudizationRate}% تقع ضمن ${metrics.nitaqatBand}`);

  // Test 3: Document Expiry Alerts
  const alerts = employeesModule.getDocumentExpiryAlerts();
  assert(alerts.length > 0, 'يجب اكتشاف الوثائق المنتهية أو التي تقترب من الانتهاء');
  const expiredDoc = alerts.find(a => a.status === 'منتهي');
  assert(expiredDoc, 'يجب اكتشاف إقامة كمال الدين مرسي المنتهية للتنبيه الحرج');
  console.log(`✓ نجح: نظام التنبيهات الذكية رصد ${alerts.length} وثيقة بحاجة للمتابعة والتجديد`);

  // Pre-cleanup for test idempotency
  const db = require('../server/database/db');
  db.run('DELETE FROM employees WHERE emp_code = ? OR email = ?', ['JM-9999', 'sultan.ghamdi@jalmajd.com']);

  // Test 4: Create New Employee with validation
  const newEmpData = {
    emp_code: 'JM-9999',
    full_name_ar: 'سلطان بن عبدالعزيز الغامدي',
    full_name_en: 'Sultan Abdulaziz Al-Ghamdi',
    national_id: '1099887766',
    nationality: 'سعودي',
    gender: 'M',
    email: 'sultan.ghamdi@jalmajd.com',
    phone: '0559988112',
    job_title_ar: 'مستشار قانوني',
    basic_salary: 14000,
    housing_allowance: 3500,
    transport_allowance: 1200,
    bank_name: 'مصرف الراجحي',
    iban: 'SA448000020160801009999'
  };

  const created = employeesModule.createEmployee(newEmpData);
  assert(created && created.id, 'يجب إنشاء الموظف بنجاح');
  assert.strictEqual(created.is_saudi, 1, 'يجب تحديد جنسية الموظف كسعودي آلياً عبر رقم الهوية');
  console.log(`✓ نجح: تسجيل موظف جديد (${created.full_name_ar}) مع التدقيق الآلي للهوية`);

  // Test 5: Submit Self-Service Request
  const leaveReq = requestsModule.submitRequest({
    emp_id: created.id,
    request_type: 'إجازة سنوية',
    start_date: '2026-11-01',
    end_date: '2026-11-05',
    days_count: 5,
    reason: 'إجازة شخصية'
  });
  assert(leaveReq && leaveReq.id, 'يجب حفظ طلب الإجازة بنجاح');
  assert(leaveReq.status.includes('بانتظار موافقة المدير المباشر'), 'حالة الطلب المبدئية يجب أن تكون معلق بانتظار موافقة المدير المباشر');
  console.log(`✓ نجح: تقديم طلب إجازة عبر بوابة الخدمة الذاتية برقم مرجعي: ${leaveReq.request_no}`);

  // Test 6: Multi-Stage Approve Request Workflow
  const mgrApproved = requestsModule.updateRequestStatus(leaveReq.id, 'موافقة مبدئية - بانتظار اعتماد الموارد البشرية', 'manager', 'موافقة مبدئية من المدير المباشر', 'م. فهد القحطاني');
  assert.strictEqual(mgrApproved.status, 'موافقة مبدئية - بانتظار اعتماد الموارد البشرية');
  assert.strictEqual(mgrApproved.manager_name, 'م. فهد القحطاني');
  console.log('✓ نجح: المرحلة الأولى - اعتماد وموافقة المدير المباشر');

  const finalApproved = requestsModule.updateRequestStatus(leaveReq.id, 'معتمد نهائياً', 'admin', 'معتمد نهائياً من الموارد البشرية', 'خالد سعد الشهراني');
  assert.strictEqual(finalApproved.status, 'معتمد نهائياً');
  assert.strictEqual(finalApproved.hr_approver_name, 'خالد سعد الشهراني');
  console.log('✓ نجح: المرحلة الثانية - الاعتماد النهائي من إدارة الموارد البشرية وتحديث الرصيد');

  // Test 7: Generate Certified Salary Letter with QR Code
  const certLetter = requestsModule.generateCertifiedSalaryLetter(created.id, 'بنك التنمية الاجتماعية');
  assert(certLetter.certId.startsWith('JM-CERT-'), 'يجب توليد رقم مرجعي رسمي للشهادة');
  assert(certLetter.qrPayload.includes('AUTHENTIC_VERIFIED'), 'يجب تضمين كود التحقق الرقمي المشفر');
  assert.strictEqual(certLetter.employee.basic_salary, 14000, 'بيانات الراتب في الشهادة يجب أن تطابق الملف المالي');
  console.log(`✓ نجح: إصدار خطاب تعريف بالراتب موثق برمز التحقق المشفر QR: ${certLetter.certId}`);

  // Cleanup test employee
  employeesModule.deleteEmployee(created.id);
  console.log('--- اكتملت اختبارات شؤون الموظفين والخدمة الذاتية بنجاح 100% ---\n');
}

module.exports = { runEmployeeAndRequestTests };

if (require.main === module) {
  runEmployeeAndRequestTests();
}
