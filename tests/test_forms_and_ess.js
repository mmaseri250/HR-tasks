const db = require('../server/database/db.js');
const usersModule = require('../server/modules/users.js');
const formsGen = require('../server/modules/formsGenerator.js');
const officialTemplates = require('../server/modules/officialTemplates.js');

async function testAll() {
  console.log('--- 1. Reconciling users ---');
  usersModule.reconcileUserEmployeeLinks();

  const user = usersModule.login('shama.asiri', 'Emp123');
  console.log('Shama login result:', user.username, 'emp_id:', user.emp_id, 'emp_code:', user.emp_code, 'job:', user.job_title_ar);

  console.log('--- 2. Checking tasks ---');
  const taskCount = (await db.get('SELECT COUNT(*) AS total FROM tasks'))?.total || 0;
  if (taskCount === 0) {
    const shama = await db.get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-1053' OR full_name_ar LIKE '%شامة%'");
    const abdulmalik = await db.get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-1000' OR full_name_ar LIKE '%عبدالملك%'");
    await db.run(`
      INSERT INTO tasks (
        task_no, title, description, assigned_to, assigned_by, assigned_by_name,
        start_date, due_date, priority, progress_percent, status, created_at, updated_at
      ) VALUES (
        'TSK-2026-0001', 'مراجعة وتدقيق إشعارات العقود محددة المدة',
        'مراجعة العقود التي تنتهي خلال 30 يوماً وتجهيز إشعارات عدم التجديد الرسمية وإخلاء الطرف للموظفين.',
        ?, ?, ?, date('now'), date('now', '+7 days'), 'عالية', 50, 'قيد التنفيذ', datetime('now'), datetime('now')
      )
    `, [shama.id, abdulmalik.id, abdulmalik.full_name_ar]);

    await db.run(`
      INSERT INTO tasks (
        task_no, title, description, assigned_to, assigned_by, assigned_by_name,
        start_date, due_date, priority, progress_percent, status, created_at, updated_at
      ) VALUES (
        'TSK-2026-0002', 'أرشفة وتوثيق نماذج الموارد البشرية الجديدة',
        'التحقق من اعتماد نماذج Word الرسمية السبعة وربطها بالسجلات الانضباطية وملفات الموظفين.',
        ?, ?, ?, date('now'), date('now', '+3 days'), 'متوسطة', 80, 'بانتظار الاعتماد', datetime('now'), datetime('now')
      )
    `, [shama.id, abdulmalik.id, abdulmalik.full_name_ar]);
    console.log('Seeded 2 tasks for Shama.');
  }

  const shamaTasks = await db.query('SELECT * FROM tasks WHERE assigned_to = ?', [user.emp_id]);
  console.log('Shama tasks count:', shamaTasks.length);

  console.log('--- 3. Testing 7 Word Form Builders ---');
  const formsToTest = [
    'leave_request',
    'absence_penalty',
    'instruction_penalty',
    'clearance',
    'contract_non_renewal',
    'penalty_procedure',
    'resignation_termination'
  ];

  for (const f of formsToTest) {
    const res = await formsGen.generateWordForm(f, user.emp_id, {});
    console.log('Word form generated:', f, 'filename:', res.filename, 'buffer length:', res.buffer.length);
  }

  console.log('--- 4. Testing HTML Form Renderers ---');
  console.log('HTML absence:', officialTemplates.renderAbsencePenaltyNoticeHtml(user.emp_id).length);
  console.log('HTML instruction:', officialTemplates.renderInstructionPenaltyNoticeHtml(user.emp_id).length);
  console.log('HTML clearance:', officialTemplates.renderClearanceFormHtml(user.emp_id).length);
  console.log('HTML contract:', officialTemplates.renderContractNonRenewalHtml(user.emp_id).length);
  console.log('HTML leave:', officialTemplates.renderLeaveFormHtml(16).length);

  console.log('ALL TESTS PASSED SUCCESSFULLY!');
}

testAll().then(() => process.exit(0)).catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
