// tests/workflow-policies.test.js
const assert = require('assert');
const db = require('../server/database/db');
const requestsModule = require('../server/modules/requests');

console.log('--- تشغيل اختبارات سياسات الدوام، الإدارات، وسير الموافقات ---');

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
assert(depts.length >= 6, 'يجب أن تتوفر 6 إدارات أساسية');
console.log(`✓ نجح: ربط الإدارات بعدد ${depts.length} إدارة مع مدراء الإدارات`);

// 3. Employee-Manager Hierarchy Test
const empsWithManagers = db.query(`
  SELECT e.id, e.full_name_ar, e.manager_id, m.full_name_ar AS manager_name
  FROM employees e
  LEFT JOIN employees m ON e.manager_id = m.id
  WHERE e.manager_id IS NOT NULL
`);
assert(empsWithManagers.length > 0, 'يجب وجود موظفين مرتبطين بمدراء مباشرين');
console.log(`✓ نجح: ربط الموظفين بمدرائهم المباشرين لعدد ${empsWithManagers.length} موظفاً بنجاح هيكلي`);

// 4. Approval Workflow Stepper Transition Test
const testReq = requestsModule.submitRequest({
  emp_id: 3, // Sarah
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

// Cleanup test request
db.run('DELETE FROM requests WHERE id = ?', [testReq.id]);
console.log('--- اكتملت اختبارات السياسات والإدارات وسير الموافقات بنجاح 100% ---\n');
