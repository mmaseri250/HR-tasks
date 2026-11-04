// scripts/purge_test_data.js
const { query, run } = require('../server/database/db');

function purgeTestData() {
  console.log('--- تنظيف البيانات التجريبية والمكررة ---');

  // 1. Purge test records from eos_settlements
  const eosCount = query('SELECT count(*) as c FROM eos_settlements')[0].c;
  run('DELETE FROM eos_settlements');
  console.log(`تم مسح ${eosCount} سجلات نهاية خدمة تجريبية سابقة.`);

  // 2. Purge duplicate test applicants
  const appDeleted = run('DELETE FROM job_applicants WHERE id > 5');
  console.log('تم تنظيف المرشحين التجريبيين والإبقاء على الـ 5 مرشحين الأساسيين.');

  // 3. Purge duplicate test job offers
  const offerDeleted = run('DELETE FROM job_offers WHERE id > 1');
  console.log('تم تنظيف العروض الوظيفية التجريبية والإبقاء على العرض المعتمد الأساسي.');

  // 4. Purge duplicate test vacancies
  const vacDeleted = run('DELETE FROM job_vacancies WHERE id > 4');
  console.log('تم تنظيف الوظائف الشاغرة التجريبية والإبقاء على الـ 4 شواغر الرسمية.');

  // 5. Clean up test entries in notifications or audit_logs if any
  run("DELETE FROM notifications WHERE title LIKE '%تجريبي%' OR message LIKE '%اختبار%'");
  run("DELETE FROM audit_logs WHERE comment LIKE '%test%' OR action LIKE '%TEST%'");
  console.log('تم تنظيف سجلات التدقيق والإشعارات التجريبية.');

  // 6. Verification
  console.log('\n--- نتائج فحص الجداول بعد التنظيف ---');
  console.log('- الشواغر الوظيفية المعتمدة (job_vacancies):', query('SELECT count(*) as c FROM job_vacancies')[0].c);
  console.log('- المتقدمين المعتمدين (job_applicants):', query('SELECT count(*) as c FROM job_applicants')[0].c);
  console.log('- العروض الوظيفية الرسمية (job_offers):', query('SELECT count(*) as c FROM job_offers')[0].c);
  console.log('- تسويات نهاية الخدمة (eos_settlements):', query('SELECT count(*) as c FROM eos_settlements')[0].c);
  console.log('- المقيمين في تقرير مقيم (muqeem_residents):', query('SELECT count(*) as c FROM muqeem_residents')[0].c);
  console.log('- الموظفين التشغيليين الفعليين (employees):', query("SELECT count(*) as c FROM employees WHERE status = 'نشط'")[0].c);
  console.log('- مستخدمي النظام (users):', query('SELECT count(*) as c FROM users')[0].c);
}

purgeTestData();
