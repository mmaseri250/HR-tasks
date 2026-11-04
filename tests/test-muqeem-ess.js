const assert = require('node:assert');
const muqeemModule = require('../server/modules/muqeem');
const tasksModule = require('../server/modules/tasks');
const employeesModule = require('../server/modules/employees');
const exportService = require('../server/modules/exportService');

async function runMuqeemAndEssTests() {
  console.log('--- تشغيل اختبارات وحدة تقرير مقيم ومهام الخدمة الذاتية ---');

  // Test 1: getMuqeemReport()
  const report = muqeemModule.getMuqeemReport({});
  assert.ok(report, 'Report should be returned');
  assert.strictEqual(report.summary.totalResidents, 87, 'Should have exactly 87 residents from updated Muqeem file');
  assert.strictEqual(report.summary.insideKsa, 84, 'Should have 84 inside KSA');
  assert.strictEqual(report.summary.outsideKsa, 3, 'Should have 3 outside KSA');
  assert.strictEqual(report.summary.validIqamas, 22, 'Valid iqamas should be 22 (including valid and expiring soon)');
  assert.strictEqual(report.summary.strictlyValid, 7, 'Strictly valid iqamas (> 60 days) should be 7');
  assert.strictEqual(report.summary.expiringSoon, 15, 'Expiring soon iqamas (<= 60 days) should be 15');
  assert.strictEqual(report.summary.expiredIqamas, 65, 'Expired iqamas should be 65');
  assert.strictEqual(report.summary.totalMonthlyFees, 67200, 'Monthly Qiwa fees should be 67,200 SAR (84 * 800)');
  console.log('✓ نجح: التحقق من إجمالي مقيمي جوهرة المجد (87 مقيم، 22 سارية تشمل التي قاربت على الانتهاء، و 65 منتهية، ورسوم قوى 67,200 ر.س/شهر)');

  // Test 2: Filter inside vs outside & valid vs expiring
  const reportInside = muqeemModule.getMuqeemReport({ status: 'inside' });
  assert.strictEqual(reportInside.residents.length, 84, 'Inside filter should return 84 residents');

  const reportOutside = muqeemModule.getMuqeemReport({ status: 'outside' });
  assert.strictEqual(reportOutside.residents.length, 3, 'Outside filter should return 3 residents');

  const reportValid = muqeemModule.getMuqeemReport({ status: 'valid' });
  assert.strictEqual(reportValid.residents.length, 22, 'Valid filter should return 22 residents (including expiring soon)');

  const reportExpiring = muqeemModule.getMuqeemReport({ status: 'expiring_soon' });
  assert.strictEqual(reportExpiring.residents.length, 15, 'Expiring soon filter should return 15 residents');

  const reportExpired = muqeemModule.getMuqeemReport({ status: 'expired' });
  assert.strictEqual(reportExpired.residents.length, 65, 'Expired filter should return 65 residents');
  console.log('✓ نجح: تصفية المقيمين (داخل 84، خارج 3، سارية تشمل التي قاربت على الانتهاء 22، تشارف 15، منتهية 65) بدقة');

  // Test 3: Add new resident, toggle location, update, delete
  const newResidentData = {
    iqama_number: '9999888877',
    full_name: 'مهندس اختبار مؤتمت تجريبي',
    nationality: 'مصري',
    occupation: 'مهندس برمجيات',
    is_outside_ksa: 0,
    iqama_expiry_gregorian: '2027-01-01',
    iqama_expiry_hijri: '1448-07-23',
    passport_number: 'A12345678',
    passport_expiry: '2028-05-15',
    notes: 'سجل تجريبي للاختبار'
  };

  const created = muqeemModule.createMuqeemResident(newResidentData);
  assert.ok(created && created.id, 'New resident ID should exist');
  assert.strictEqual(created.iqama_number, '9999888877');

  // Update resident: toggle location to outside
  const updated = muqeemModule.updateMuqeemResident(created.id, {
    ...newResidentData,
    is_outside_ksa: 1,
    notes: 'تم نقله لخارج السعودية مؤقتاً'
  });
  assert.strictEqual(updated.is_outside_ksa, 1, 'Resident should now be marked outside KSA');

  // Delete test resident
  const deleted = muqeemModule.deleteMuqeemResident(created.id);
  assert.strictEqual(deleted.success, true, 'Resident should be deleted successfully');
  console.log('✓ نجح: دورة العمليات الكاملة (إضافة، تعديل، تغيير الموقع داخل/خارج، وحذف مقيم)');

  // Test 4: Excel export for Muqeem
  const excelResult = exportService.exportToExcel('muqeem');
  assert.ok(excelResult && excelResult.buffer && excelResult.buffer.length > 1000, 'Muqeem Excel export should produce a valid buffer');
  console.log('✓ نجح: توليد تقرير مقيم الرسمي بصيغة Excel (.xlsx) بهوية وتنسيق احترافي');

  // Test 5: Tasks assigned to employee and query by assigned_to
  const allEmployees = employeesModule.getAllEmployees();
  assert.ok(allEmployees.length > 0);
  const targetEmp = allEmployees[0];

  const taskPayload = {
    title: 'مهمة فحص دوري لنظام الموارد البشرية',
    description: 'التحقق من اكتمال تقرير مقيم ومؤشرات الامتثال في الخدمة الذاتية',
    assigned_to: targetEmp.id,
    start_date: '2026-10-17',
    due_date: '2026-10-31',
    priority: 'عالية'
  };

  const createdTask = tasksModule.createTask(taskPayload);
  assert.ok(createdTask && createdTask.id);

  // Retrieve tasks for this employee (as done by ESS self-service)
  const empTasks = tasksModule.getAllTasks({ assigned_to: targetEmp.id });
  const foundTask = empTasks.find(t => t.id === createdTask.id);
  assert.ok(foundTask, 'Task should be returned in employee self-service query');
  assert.strictEqual(foundTask.assigned_to, targetEmp.id);

  // Complete the task
  const updatedTask = tasksModule.updateTask(createdTask.id, {
    status: 'مكتملة',
    progress_percent: 100,
    manager_comment: 'تم إنجاز المهمة عبر بوابة الخدمة الذاتية بنجاح'
  });
  assert.strictEqual(updatedTask.status, 'مكتملة');
  assert.strictEqual(updatedTask.progress_percent, 100);

  // Clean up
  tasksModule.deleteTask(createdTask.id);
  console.log('✓ نجح: ربط المهام بموظفي الخدمة الذاتية (ESS) ومتابعة الإنجاز والإغلاق');

  console.log('================================================================');
  console.log('  جميع اختبارات تقرير مقيم وتكامل الخدمة الذاتية اجتازت بنجاح 100%!  ');
  console.log('================================================================');
}

module.exports = { runMuqeemAndEssTests };

if (require.main === module) {
  runMuqeemAndEssTests().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
  });
}
