// tests/absence-notices.test.js - Comprehensive test for Absence Notice System & Company Email Staging
const assert = require('node:assert');
const db = require('../server/database/db');
const absenceModule = require('../server/modules/absenceNotices');

console.log('--- تشغيل اختبارات نظام إشعارات الغياب وربط بريد الشركة ---');

// 1. Fetch real active employee from database
const sampleEmp = db.get(`
  SELECT id, emp_code, full_name_ar, job_title_ar, email, department_id, manager_id, direct_manager_name
  FROM employees
  WHERE status = 'نشط'
  LIMIT 1
`);
assert(sampleEmp, 'يجب وجود موظف نشط في قاعدة البيانات للاختبار');

console.log(`[1/6] فحص بيانات الموظف والمدير المباشر (${sampleEmp.emp_code} - ${sampleEmp.full_name_ar})...`);

// 2. Issue a Single-day Absence Notice
console.log('[2/6] اختبار إصدار إشعار غياب يوم واحد...');
const notice1 = absenceModule.createAbsenceNotice({
  emp_id: sampleEmp.id,
  absence_date: '2026-10-25',
  absence_type: 'غياب يوم واحد بدون إذن',
  warning_tier: 'إشعار غياب أولي',
  reason: 'غياب غير مبرر عن العمل في الفترة الصباحية',
  action_required: 'تقديم تقرير طبي معتمد خلال 48 ساعة'
});

assert(notice1 && notice1.id, 'يجب إنشاء إشعار الغياب بنجاح');
assert(notice1.notice_no.startsWith('ABS-'), 'رقم الإشعار يجب أن يبدأ بـ ABS-');
assert.strictEqual(notice1.days_count, 1, 'عدد أيام الغياب يجب أن يكون 1');
assert.strictEqual(notice1.email_status, 'جاهز للربط ببريد الشركة', 'حالة البريد يجب أن تكون: جاهز للربط ببريد الشركة');
assert.strictEqual(notice1.status, 'صادر', 'حالة الإشعار يجب أن تكون صادر');
assert(notice1.email_subject.includes(notice1.notice_no), 'عنوان البريد يجب أن يحتوي على رقم الإشعار');
assert(notice1.email_body_html.includes('شركة جوهرة المجد للتجارة والمقاولات'), 'قالب البريد يجب أن يحمل اسم الشركة الرسمي');
assert(notice1.email_body_html.includes(sampleEmp.full_name_ar), 'قالب البريد يجب أن يحمل اسم الموظف');
console.log(`✓ نجح: تم إصدار إشعار الغياب (${notice1.notice_no}) وتجهيز قالب البريد المؤسسي.`);

// 3. Issue a Multi-day / Article 80 Notice (Consecutive Absence)
console.log('[3/6] اختبار إصدار إشعار غياب متصل وإنذار المادة 80 مع السند النظامي...');
const notice2 = absenceModule.createAbsenceNotice({
  emp_id: sampleEmp.id,
  absence_date: '2026-10-20',
  absence_end_date: '2026-10-24',
  absence_type: 'انقطاع عن العمل (المادة 80)',
  warning_tier: 'إنذار نهائي / فصل م80',
  reason: 'انقطاع متواصل عن العمل دون إبلاغ الإدارة'
});

assert(notice2 && notice2.id, 'يجب إنشاء إنذار المادة 80 بنجاح');
assert(notice2.days_count >= 5, 'يجب احتساب أيام الغياب تلقائياً بين تاريخ البداية والنهاية');
assert(notice2.legal_basis.includes('80'), 'يجب تطبيق السند النظامي للمادة 80 من نظام العمل تلقائياً');
assert(notice2.email_body_html.includes('المادة (80)'), 'قالب البريد المؤسسي يجب أن يتضمن نص المادة 80');
console.log(`✓ نجح: احتساب أيام الغياب المتصل (${notice2.days_count} أيام) وتضمين السند النظامي لم80.`);

// 4. Employee Acknowledgment Test
console.log('[4/6] اختبار توثيق إقرار الموظف باستلام الإشعار...');
const acked = absenceModule.acknowledgeAbsenceNotice(notice1.id, 'أقر باستلام الإشعار وسيتم إحضار التقرير الطبي');
assert.strictEqual(acked.status, 'تم الإقرار', 'حالة الإشعار يجب أن تصبح تم الإقرار');
assert(acked.acknowledged_at !== null, 'يجب توثيق تاريخ ووقت الإقرار');
assert.strictEqual(acked.employee_notes, 'أقر باستلام الإشعار وسيتم إحضار التقرير الطبي');
console.log('✓ نجح: توثيق إقرار واستلام الموظف بنجاح داخل النظام.');

// 5. KPIs & Company Email Settings Test
console.log('[5/6] اختبار الإحصائيات وإعدادات خادم بريد الشركة (SMTP)...');
const kpis = absenceModule.getAbsenceKPIs();
assert(kpis.total >= 2, 'إجمالي الإشعارات يجب أن يكون 2 على الأقل');
assert(kpis.readyForEmail >= 2, 'إشعارات جاهز للربط ببريد الشركة يجب أن تكون 2 على الأقل');
assert(kpis.acknowledged >= 1, 'الإشعارات المقرة يجب أن تكون 1 على الأقل');

// Company Email settings check
const initialSettings = absenceModule.getCompanyEmailSettings();
assert(initialSettings && typeof initialSettings.is_active === 'number', 'يجب استرجاع إعدادات البريد بنجاح');

const updatedSettings = absenceModule.saveCompanyEmailSettings({
  smtp_host: 'mail.jawharat-almajd.com',
  smtp_port: 587,
  smtp_user: 'hr@jawharat-almajd.com',
  smtp_pass: 'Secret@2026',
  from_email: 'hr@jawharat-almajd.com',
  from_name: 'شركة جوهرة المجد للمقاولات - الموارد البشرية',
  is_ssl: 1,
  is_active: 0 // Staged mode
});

assert.strictEqual(updatedSettings.smtp_host, 'mail.jawharat-almajd.com');
assert.strictEqual(updatedSettings.smtp_pass, '••••••••', 'كلمة المرور يجب أن تكون محجوبة لأغراض الأمان');
assert.strictEqual(updatedSettings.has_password, true);
console.log('✓ نجح: احتساب المؤشرات بدقة وحفظ وتشفير إعدادات بريد الشركة.');

// 6. Excel Export & Official Paper Letter Test
console.log('[6/6] اختبار تصدير إكسل وتوليد الخطاب الرسمي الموثق...');
const excelBuffer = absenceModule.exportAbsenceNoticesExcel();
assert(Buffer.isBuffer(excelBuffer) && excelBuffer.length > 500, 'يجب توليد ملف Excel سليم');

const templateBuffer = absenceModule.generateAbsenceTemplateExcel();
assert(Buffer.isBuffer(templateBuffer) && templateBuffer.length > 500, 'يجب توليد نموذج Excel للاستيراد');

const letterHtml = absenceModule.renderOfficialAbsenceLetterHtml(notice1.id);
assert(letterHtml.includes('شركة جوهرة المجد للتجارة والمقاولات'), 'الخطاب الرسمي يجب أن يحمل ترويسة الشركة');
assert(letterHtml.includes(notice1.notice_no), 'الخطاب الرسمي يجب أن يحمل رقم الإشعار');
assert(letterHtml.includes('الختم'), 'الخطاب الرسمي يجب أن يتضمن خانة الختم والاعتماد');

// Clean up test records
db.run('DELETE FROM absence_notices WHERE id IN (?, ?)', [notice1.id, notice2.id]);
console.log('✓ نجح: تصدير إكسل، نموذج الاستيراد، وتوليد الخطاب الرسمي، مع تنظيف سجلات الاختبار بالكامل.');

console.log('================================================================');
console.log('  جميع اختبارات نظام إشعارات الغياب وربط بريد الشركة اجتازت بنجاح 100%!  ');
console.log('================================================================');
