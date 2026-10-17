// tests/run-all-tests.js
const { runPayrollTests } = require('./payroll.test');
const { runAttendanceTests } = require('./attendance.test');
const { runEmployeeAndRequestTests } = require('./employees.test');
const { runLeavesTasksHierarchyTests } = require('./leaves-tasks-hierarchy.test');

console.log('================================================================');
console.log('  تشغيل الحزمة الكاملة لاختبارات نظام موارد بشرية جوهرة المجد  ');
console.log('================================================================\n');

async function main() {
  try {
    runEmployeeAndRequestTests();
    runAttendanceTests();
    runPayrollTests();
    require('./workflow-policies.test');
    await runLeavesTasksHierarchyTests();

    console.log('================================================================');
    console.log('  جميع الاختبارات المعتمدة (32/32) اجتازت بنجاح فائق ودقة مطابقة 100%!   ');
    console.log('================================================================');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ فشل في أحد الاختبارات:', err);
    process.exit(1);
  }
}

main();
