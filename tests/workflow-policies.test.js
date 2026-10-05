// tests/workflow-policies.test.js
const assert = require('assert');
const db = require('../server/database/db');
const employeesModule = require('../server/modules/employees');
const requestsModule = require('../server/modules/requests');
const { seedDatabase } = require('../server/database/seedData');

console.log('--- تشغيل اختبارات سياسات الدوام، الإدارات، الفروع، وسير الموافقات ---');

// 1. Attendance Policies Test
const policies = db.query('SELECT * FROM attendance_policies WHERE is_active = 1');
assert(policies.length >= 3, 'يجب أن تتوفر 3 سياسات دوام افتراضية على الأقل');
console.log(`✓ نجح: تم استرجاع ${policies.length} سياسات دوام معتمدة (دوام صباحي، مرن، وميداني)`);

const testPolicy = db.run(`
  INSERT INTO attendance_policies (policy_name, shift_type, start_time, end_time, grace_period_mins, daily_hours, work_days, flexible_hours, overtime_allowed, notes)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`, ['سياسة الدوام الجزئي التجريبية', 'part_time', '10:00', '14:00', 10, 4.0, 'الأحد إلى الخميس', 1, 0, 'سياسة دوام مؤقتة للاختبار']);
assert(testPolicy.lastInsertRowid, 'يجب إنشاء سياسة دوام جديدة بنجاح وحقولها مفتوحة');

db.run('DELETE FROM attendance_policies WHERE id = ?', [testPolicy.lastInsertRowid]);
console.log('✓ نجح: إنشاء وحذف سياسة دوام مفتوحة الحقول والتخصيص');

// 2. Departments Management Test
const depts = db.query('SELECT * FROM departments');
assert.strictEqual(depts.length, 6, 'يجب أن تتوفر 6 إدارات أساسية معتمدة');
console.log(`✓ نجح: ربط الإدارات بعدد ${depts.length} إدارة مع مدراء الإدارات`);

// 3. Branches Management Test
const branches = db.query('SELECT * FROM branches');
assert.strictEqual(branches.length, 4, 'يجب أن تتوفر الفروع الـ 4 الأساسية');
const mainBranch = branches.find(b => b.is_main === 1);
assert(mainBranch && mainBranch.name_ar.includes('الرئيسي'), 'يجب تعيين فرع أبها كفرع رئيسي');
console.log(`✓ نجح: التحقق من الفروع بعدد ${branches.length} فروع (مع تحديد ${mainBranch.name_ar})`);

// 4. Biometric Devices Test
const devices = db.query('SELECT * FROM biometric_devices');
assert.strictEqual(devices.length, 0, 'يجب أن تبدأ أجهزة البصمة بقائمة نظيفة 0 جهاز بعد حذف الأجهزة التجريبية');

const newDevice = db.run(`
  INSERT INTO biometric_devices (device_code, device_name, ip_address, port, branch_id, location, model, status, last_sync)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`, ['ZK-MAIN-01', 'جهاز بصمة الاستقبال - الفرع الرئيسي', '192.168.1.201', 4370, branches[0].id, 'المدخل الرئيسي', 'ZKTeco ProFace X', 'متصل', '2026-10-05 08:00:00']);
assert(newDevice.lastInsertRowid, 'يجب إضافة جهاز بصمة جديد بنجاح');
const addedDevice = db.get('SELECT * FROM biometric_devices WHERE id = ?', [newDevice.lastInsertRowid]);
assert.strictEqual(addedDevice.device_code, 'ZK-MAIN-01');
console.log(`✓ نجح: التحقق من نظافة قائمة الأجهزة وإضافة جهاز بصمة رسمي جديد بنجاح (${addedDevice.device_name})`);
db.run('DELETE FROM biometric_devices WHERE id = ?', [newDevice.lastInsertRowid]);

// 5. Hierarchy and Approval Workflow Test
const testEmp = employeesModule.createEmployee({
  emp_code: 'JM-TEST-WORKFLOW',
  full_name_ar: 'موظف تجربة سير الموافقات',
  national_id: '1066554433',
  nationality: 'سعودي',
  email: 'workflow.test@jalmajd.com',
  phone: '0551122338',
  department_id: depts[0].id,
  branch_id: branches[0].id,
  job_title_ar: 'منسق إداري',
  basic_salary: 7000,
  housing_allowance: 1750,
  transport_allowance: 700
});

const testReq = requestsModule.submitRequest({
  emp_id: testEmp.id,
  request_type: 'طلب استئذان',
  start_date: '2026-10-05',
  end_date: '2026-10-05',
  days_count: 0.25,
  reason: 'استئذان رسمي لساعتين'
});
assert(testReq.status.includes('بانتظار موافقة المدير المباشر'), 'الطلب يبدأ بانتظار المدير المباشر');

const mgrStep = requestsModule.updateRequestStatus(
  testReq.id,
  'موافقة مبدئية - بانتظار اعتماد الموارد البشرية',
  'manager',
  'موافقة مبدئية من المدير',
  'خالد سعد الشهراني'
);
assert.strictEqual(mgrStep.status, 'موافقة مبدئية - بانتظار اعتماد الموارد البشرية');
assert.strictEqual(mgrStep.manager_name, 'خالد سعد الشهراني');
assert(mgrStep.manager_approved_at !== null, 'يجب توثيق وقت موافقة المدير');

const hrStep = requestsModule.updateRequestStatus(
  testReq.id,
  'معتمد نهائياً',
  'admin',
  'اعتماد نهائي HR',
  'مدير عام الموارد البشرية'
);
assert.strictEqual(hrStep.status, 'معتمد نهائياً');
assert.strictEqual(hrStep.hr_approver_name, 'مدير عام الموارد البشرية');
assert(hrStep.hr_approved_at !== null, 'يجب توثيق وقت اعتماد الموارد البشرية');
console.log('✓ نجح: دورة سير الموافقات المكتملة (تقديم ➔ موافقة المدير ➔ اعتماد HR)');

// 6. Disciplinary Penalty Issuance and Deletion Test
const penaltiesModule = require('../server/modules/penalties');
const testPenalty = penaltiesModule.issuePenaltyDecision({
  emp_id: testEmp.id,
  violation_code: 'v1',
  repetition_level: 'المرة الأولى',
  incident_date: '2026-10-05',
  investigation_details: 'مخالفة تأخر تجريبية للتحقق من إمكانية الإصدار والحذف',
  issued_by: 'إدارة الموارد البشرية'
});
assert(testPenalty && testPenalty.id, 'يجب إصدار القرار الجزائي بنجاح');
assert.strictEqual(testPenalty.emp_id, testEmp.id);
console.log(`✓ نجح: إصدار قرار جزائي رسمي بنجاح (${testPenalty.decision_no})`);

// Test Deleting the Disciplinary Decision
const deleteResult = penaltiesModule.deleteIssuedPenalty(testPenalty.id);
assert(deleteResult && deleteResult.success, 'يجب حذف القرار الجزائي بنجاح');
const checkDeleted = penaltiesModule.getIssuedPenaltyById(testPenalty.id);
assert(!checkDeleted, 'يجب ألا يكون القرار الجزائي موجوداً في قاعدة البيانات بعد حذفه');
console.log(`✓ نجح: حذف القرار الجزائي (${testPenalty.decision_no}) بنجاح والتأكد من إزالته بالكامل`);

// Cleanup test records and re-seed to ensure pristine database state
db.run('DELETE FROM requests WHERE id = ?', [testReq.id]);
employeesModule.deleteEmployee(testEmp.id);
seedDatabase();

console.log('--- اكتملت اختبارات السياسات والإدارات والجزاءات وسير الموافقات بنجاح 100% ---\n');
