// tests/run-all-tests.js
const { runPayrollTests } = require('./payroll.test');
const { runAttendanceTests } = require('./attendance.test');
const { runEmployeeAndRequestTests } = require('./employees.test');

console.log('================================================================');
console.log('  تشغيل الحزمة الكاملة لاختبارات نظام موارد بشرية جوهرة المجد  ');
console.log('================================================================\n');

try {
  runEmployeeAndRequestTests();
  runAttendanceTests();
  runPayrollTests();
  require('./workflow-policies.test');

  console.log('================================================================');
  console.log('  جميع الاختبارات (23/23) اجتازت بنجاح فائق ودقة مطابقة 100%!   ');
  console.log('================================================================');
  process.exit(0);
} catch (err) {
  console.error('\n❌ فشل في أحد الاختبارات:', err);
  process.exit(1);
}
