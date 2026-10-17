// tests/attendance.test.js
const assert = require('node:assert');
const { seedDatabase } = require('../server/database/seedData');
const db = require('../server/database/db');
const employeesModule = require('../server/modules/employees');
const attendanceModule = require('../server/modules/attendance');

function runAttendanceTests() {
  console.log('--- تشغيل اختبارات وحدة الحضور والانصراف والبصمة البيومترية ---');

  seedDatabase();

  // Test 1: Geofence calculation
  // Company coords: Abha City Park (18.2164, 42.5053)
  // Inside office (approx 50m away): 18.2168, 42.5055
  const distInside = attendanceModule.calculateDistanceInMeters(18.2164, 42.5053, 18.2168, 42.5055);
  assert(distInside < 100, 'المسافة داخل المقر يجب أن تكون أقل من 100 متر');

  // Outside office (e.g. Riyadh coords: 24.7136, 46.6753)
  const distOutside = attendanceModule.calculateDistanceInMeters(18.2164, 42.5053, 24.7136, 46.6753);
  assert(distOutside > 500000, 'المسافة إلى الرياض يجب أن تتجاوز 500 كم');
  console.log(`✓ نجح: خوارزمية النطاق الجغرافي (Geo-fencing Haversine) تحسب المسافات بدقة (${Math.round(distInside)} م داخل المقر vs ${Math.round(distOutside / 1000)} كم خارج المقر)`);

  const depts = db.query('SELECT id FROM departments');
  const branches = db.query('SELECT id FROM branches');

  // Create temporary test employee for attendance tests
  const testEmp = employeesModule.createEmployee({
    emp_code: 'JM-TEST-ATT',
    full_name_ar: 'موظف تجربة الحضور والبصمة',
    national_id: '1099881122',
    nationality: 'سعودي',
    email: 'test.att@jalmajd.com',
    phone: '0551122334',
    department_id: depts.length ? depts[0].id : null,
    branch_id: branches.length ? branches[0].id : null,
    job_title_ar: 'أخصائي جودة',
    basic_salary: 8000,
    housing_allowance: 2000,
    transport_allowance: 800
  });

  // Test 2: Record punch within geofence
  const punchInRes = attendanceModule.recordPunch({
    emp_id: testEmp.id,
    punch_type: 'CHECK_IN',
    punch_time: '2026-10-01 07:58:00',
    verification_method: 'FINGERPRINT',
    latitude: 18.2164,
    longitude: 42.5053
  });
  assert(punchInRes.success, 'يجب تسجيل البصمة بنجاح');
  assert.strictEqual(punchInRes.isWithinGeofence, 1, 'البصمة داخل النطاق الجغرافي المعتمد');
  console.log('✓ نجح: تسجيل بصمة الدخول بالبصمة البيومترية والموقع الجغرافي');

  // Test 3: Record late punch and detect delay minutes
  // Scheduled: 08:00, Grace: 08:15. Punch at 08:45 -> 45 minutes delay
  attendanceModule.recordPunch({
    emp_id: testEmp.id,
    punch_type: 'CHECK_IN',
    punch_time: '2026-10-02 08:45:00',
    verification_method: 'FACE'
  });
  const dailySummary = attendanceModule.getDailyAttendance('2026-10-02');
  const empSummary = dailySummary.find(s => s.emp_id === testEmp.id);
  assert(empSummary, 'يجب وجود ملخص الحضور اليومي للموظف');
  assert.strictEqual(empSummary.status, 'متأخر', 'حالة الحضور يجب أن تسجل كـ متأخر');
  assert.strictEqual(empSummary.delay_minutes, 45, 'دقائق التأخير يجب أن تكون 45 دقيقة بالضبط');
  console.log('✓ نجح: الكشف التلقائي عن التأخير الصباحي بعد فترة السماح وحساب الدقائق بدقة');

  // Test 4: Record punch out - strictly 0 overtime per Company Attendance Policy
  // Check out at 18:30 -> workHours recorded, overtime is strictly 0.0
  attendanceModule.recordPunch({
    emp_id: testEmp.id,
    punch_type: 'CHECK_OUT',
    punch_time: '2026-10-01 18:30:00'
  });
  const updatedDaily = attendanceModule.getDailyAttendance('2026-10-01');
  const empSummaryOt = updatedDaily.find(s => s.emp_id === testEmp.id);
  assert(empSummaryOt && empSummaryOt.work_hours > 8.0, 'ساعات العمل الفعلية يجب أن تسجل بدقة');
  assert.strictEqual(empSummaryOt.overtime_hours, 0, 'وفق سياسات الدوام لشركة جوهرة المجد، يمنع احتساب أو توليد ساعات عمل إضافية نهائياً');
  console.log(`✓ نجح: الالتزام الصارم بسياسة منع احتساب الساعات الإضافية (ساعات العمل: ${empSummaryOt.work_hours}، الإضافي: ${empSummaryOt.overtime_hours})`);

  // Test 4b: Flexible Policy Rule (min 3 hours, target 8 hours)
  const flexEmp = employeesModule.createEmployee({
    emp_code: 'JM-TEST-FLEX',
    full_name_ar: 'موظف دوام مرن للاختبار',
    national_id: '1099881133',
    nationality: 'سعودي',
    email: 'flex.test@jalmajd.com',
    phone: '0551122339',
    job_title_ar: 'مبرمج',
    shift_type: 'flexible',
    basic_salary: 9000
  });

  // Short punch (< 3 hours: 09:00 to 11:30 = 2.5 hours) -> status 'غير مستوفٍ للحد الأدنى'
  attendanceModule.recordPunch({ emp_id: flexEmp.id, punch_type: 'CHECK_IN', punch_time: '2026-10-04 09:00:00' });
  attendanceModule.recordPunch({ emp_id: flexEmp.id, punch_type: 'CHECK_OUT', punch_time: '2026-10-04 11:30:00' });
  const flexDaily1 = attendanceModule.getDailyAttendance('2026-10-04');
  const flexSummary1 = flexDaily1.find(s => s.emp_id === flexEmp.id);
  assert.strictEqual(flexSummary1.status, 'غير مستوفٍ للحد الأدنى', 'في حال لم يكمل الموظف 3 ساعات فعلية فلا يعتبر اليوم مستوفياً للحد الأدنى');

  // Full punch (8 hours: 10:00 to 18:00 = 8.0 hours) -> status 'مستوفٍ'
  attendanceModule.recordPunch({ emp_id: flexEmp.id, punch_type: 'CHECK_IN', punch_time: '2026-10-05 10:00:00' });
  attendanceModule.recordPunch({ emp_id: flexEmp.id, punch_type: 'CHECK_OUT', punch_time: '2026-10-05 18:00:00' });
  const flexDaily2 = attendanceModule.getDailyAttendance('2026-10-05');
  const flexSummary2 = flexDaily2.find(s => s.emp_id === flexEmp.id);
  assert.strictEqual(flexSummary2.status, 'مستوفٍ', 'إكمال 8 ساعات في الدوام المرن يعتبر مستوفياً لليوم كاملاً');
  assert.strictEqual(flexSummary2.overtime_hours, 0, 'الدوام المرن لا يحتوي على إضافي نهائياً');
  console.log('✓ نجح: تطبيق ضوابط سياسة الدوام المرن بالكامل (الحد الأدنى 3 ساعات، واشتراط 8 ساعات عمل يومياً)');

  // Cleanup flex test employee
  db.run('DELETE FROM attendance_logs WHERE emp_id = ?', [flexEmp.id]);
  db.run('DELETE FROM attendance_daily_summary WHERE emp_id = ?', [flexEmp.id]);
  employeesModule.deleteEmployee(flexEmp.id);

  // Test 5: Bulk Punch Import
  const bulkPunches = [
    { emp_code: 'JM-TEST-ATT', punch_type: 'CHECK_IN', punch_time: '2026-10-03 07:55:00', verification_method: 'CARD' },
    { emp_code: 'JM-TEST-ATT', punch_type: 'CHECK_OUT', punch_time: '2026-10-03 16:05:00', verification_method: 'FINGERPRINT' }
  ];
  const importRes = attendanceModule.importBiometricPunches(bulkPunches);
  assert.strictEqual(importRes.count, 2, 'يجب استيراد كافة سجلات البصمة الدفعية');
  console.log('✓ نجح: استيراد سجلات البصمة الحيوية الدفعية بنجاح');

  // Cleanup test employee & punches
  db.run('DELETE FROM attendance_logs WHERE emp_id = ?', [testEmp.id]);
  db.run('DELETE FROM attendance_daily_summary WHERE emp_id = ?', [testEmp.id]);
  employeesModule.deleteEmployee(testEmp.id);

  console.log('--- اكتملت اختبارات وحدة الحضور والانصراف بنجاح 100% ---\n');
}

module.exports = { runAttendanceTests };

if (require.main === module) {
  runAttendanceTests();
}
