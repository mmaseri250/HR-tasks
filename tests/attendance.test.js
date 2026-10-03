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

  // Test 4: Record punch out with overtime
  // Check out at 18:30 -> 2.5 hours overtime
  attendanceModule.recordPunch({
    emp_id: testEmp.id,
    punch_type: 'CHECK_OUT',
    punch_time: '2026-10-01 18:30:00'
  });
  const updatedDaily = attendanceModule.getDailyAttendance('2026-10-01');
  const empSummaryOt = updatedDaily.find(s => s.emp_id === testEmp.id);
  assert(empSummaryOt && empSummaryOt.overtime_hours >= 2.0, 'ساعات العمل الإضافي يجب أن تسجل بعد نهاية الدوام الرسمي');
  console.log(`✓ نجح: احتساب ساعات العمل الإضافي (${empSummaryOt.overtime_hours} ساعة) وفق المادة 107`);

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
