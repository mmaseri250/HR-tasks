// tests/run-all-tests.js
const { runPayrollTests } = require('./payroll.test');
const { runAttendanceTests } = require('./attendance.test');
const { runEmployeeAndRequestTests } = require('./employees.test');
const { runLeavesTasksHierarchyTests } = require('./leaves-tasks-hierarchy.test');
const { runMuqeemAndEssTests } = require('./test-muqeem-ess');
const { runComprehensiveSystemTests } = require('./full_system_integration.test');
const { runAllModulesCrudTests } = require('./crud_all_modules.test');

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
    await runMuqeemAndEssTests();
    require('./new-features.test');
    require('./absence-notices.test');
    require('./test_all_8_official_forms');
    require('./approval_workflow_audit.test');
    require('./page-connectivity.test');
    await runComprehensiveSystemTests();
    runAllModulesCrudTests();

    console.log('================================================================');
    console.log('  جميع الاختبارات المعتمدة والشاملة اجتازت بنجاح فائق ودقة مطابقة 100%!   ');
    console.log('================================================================');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ فشل في أحد الاختبارات:', err);
    process.exit(1);
  }
}

main();
