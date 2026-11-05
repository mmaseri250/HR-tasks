// server/modules/aiJobDescriptionService.js
// Enterprise AI Job Description Engine conforming to Saudi Labor Market Standards
const { query, get, run } = require('../database/db');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, HeadingLevel } = require('docx');

function initJobDescriptionsTable() {
  run(`
    CREATE TABLE IF NOT EXISTS job_descriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_code TEXT UNIQUE,
      job_title_ar TEXT NOT NULL,
      job_title_en TEXT,
      department_id INTEGER,
      department_name TEXT,
      job_level TEXT,
      reporting_to TEXT,
      general_objective TEXT,
      main_duties TEXT,
      authorities TEXT,
      qualifications TEXT,
      experience_years TEXT,
      skills_and_competencies TEXT,
      kpis TEXT,
      working_conditions TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `);
}

initJobDescriptionsTable();

// Rich Pre-trained Role Archetypes for Saudi Enterprise & Jawharat Al-Majd Business
const ROLE_ARCHETYPES = {
  'hr': {
    title_ar: 'أخصائي أول موارد بشرية',
    title_en: 'Senior Human Resources Specialist',
    department: 'إدارة الموارد البشرية',
    level: 'تخصصي أول',
    reporting: 'مدير الموارد البشرية',
    objective: 'إدارة العمليات اليومية للموارد البشرية، وتطبيق سياسات ولوائح العمل السعودية، والإشراف على التوظيف، وإدارة الأداء، والامتثال للمنصات الحكومية (قوى، مُدد، مقيم، التأمينات الاجتماعية).',
    duties: [
      'متابعة وتحديث ملفات وسجلات الموظفين والتأكد من مطابقتها لنظام العمل السعودي ولائحة تنظيم العمل المعتمدة.',
      'إدارة العمليات على المنصات الحكومية الرقمية (منصة قوى، نظام مقيم، مدد لحماية الأجور، والتأمينات الاجتماعية).',
      'إعداد ومراجعة مسيرات الرواتب الشهرية والبدلات والاستقطاعات النظامية والتأكد من الالتزام بحماية الأجور WPS.',
      'استقطاب الكفاءات وإجراء المقابلات الوظيفية المبدئية وصياغة العروض الوظيفية وعقود العمل الموحدة.',
      'متابعة تجديد الإقامات ورخص العمل والتأمين الطبي وتوثيق الإجازات السنوية والمرضية وسجلات الحضور والغياب.',
      'التحقيق المبدئي في المخالفات العمالية وتطبيق جدول الجزاءات المعتمد برقم الاعتماد (229400).'
    ],
    authorities: [
      'التوصية باعتماد الإجازات والبدلات والسلف لموظفي الفروع.',
      'إصدار خطابات التعريف والمخاطبات الرسمية بعد مراجعة مدير الإدارة.',
      'إيقاف وتجميد سجل الموظف في حال وجود مخالفات جسيمة لحين انتهاء التحقيق.'
    ],
    qualifications: 'بكالوريوس في إدارة الموارد البشرية، إدارة الأعمال، أو تخصص ذي صلة. يفضل شهادة مهنية (CIPD أو SHRM).',
    experience: 'لا تقل عن 3 إلى 5 سنوات في إدارة الموارد البشرية بالمملكة العربية السعودية.',
    competencies: [
      'معرفة متعمقة بنظام العمل ولائحته التنفيذية وتعديلاته الأخيرة.',
      'إتقان التعامل مع منصات قوى، مقيم، مدد، والتأمينات الاجتماعية (GOSI).',
      'مهارات تواصل وتفاوض استثنائية وإدارة النزاعات العمالية.',
      'السرية التامة والأمانة في التعامل مع البيانات والرواتب.'
    ],
    kpis: [
      'نسبة الالتزام بحماية الأجور (WPS) لا تقل عن 95%.',
      'صفر غرامات أو مخالفات من وزارة الموارد البشرية أو الجوازات.',
      'متوسط وقت إغلاق الشواغر الوظيفية لا يتجاوز 25 يوماً.',
      'نسبة رضا الموظفين عن خدمات الموارد البشرية لا تقل عن 90%.'
    ],
    conditions: 'بيئة مكتبية حديثة بمقر الشركة الرئيسي مع زيارات ميدانية دورية لفروع الشركة ومراكزها.'
  },
  'accountant': {
    title_ar: 'محاسب عام أول',
    title_en: 'Senior General Accountant',
    department: 'الإدارة المالية',
    level: 'تخصصي',
    reporting: 'المدير المالي',
    objective: 'إدارة وتدقيق السجلات المحاسبية والقيود اليومية، وإعداد الإقرارات الضريبية (ZATCA)، ومطابقة الحسابات البنكية ومسيرات الرواتب والمخزون، وإعداد التقارير المالية الدورية.',
    duties: [
      'تسجيل ومراجعة القيود اليومية وسندات الصرف والقبض وفق المعايير المحاسبية الدولية (IFRS).',
      'إعداد وتقديم إقرارات ضريبة القيمة المضافة (VAT) وإقرارات الزكاة لهيئة الزكاة والضريبة والجمارك (ZATCA).',
      'مطابقة الحسابات البنكية الشهرية وتدقيق التسويات ومطابقة حسابات الموردين والعملاء.',
      'التدقيق المالي لمسيرات الرواتب وسداد مستحقات التأمينات وحساب مخصصات نهاية الخدمة والإجازات.',
      'المشاركة في الجرد الدوري والسنوي للمخزون ومطابقة الأرصدة الدفترية مع الفعلية ومعالجة الفروقات.',
      'إعداد موازين المراجعة والقوائم المالية الشهرية (قائمة الدخل، المركز المالي، التدفقات النقدية).'
    ],
    authorities: [
      'اعتماد القيود المحاسبية وسندات التسوية ضمن الصلاحيات المالية المعتمدة.',
      'رفض صرف أي معاملة غير مستوفية للمستندات المؤيدة والفواتير الضريبية النظامية.'
    ],
    qualifications: 'بكالوريوس محاسبة أو مالية. يفضل شهادة SOCPA أو CMA.',
    experience: 'من 4 إلى 6 سنوات في المحاسبة المالية والتجارية بالمملكة.',
    competencies: [
      'إتقان الفوترة الإلكترونية ومعايير هيئة الزكاة والضريبة والجمارك ZATCA.',
      'إجادة متقدمة لبرامج ERP المحاسبية وبرنامج Microsoft Excel (النمذجة المالية).',
      'دقة عالية في العمليات الحسابية والتحليل المالي.'
    ],
    kpis: [
      'تقديم الإقرارات الضريبية قبل الموعد النهائي بنسبة 100%.',
      'إغلاق القوائم المالية الشهرية في موعد أقصاه اليوم الخامس من الشهر التالي.',
      'دقة التسويات البنكية ومطابقات الموردين بنسبة 99%.'
    ],
    conditions: 'بيئة عمل مكتبية مع استخدام مكثف للأنظمة المالية الرقمية.'
  },
  'sales_supervisor': {
    title_ar: 'مشرف مبيعات وصالة',
    title_en: 'Sales & Floor Supervisor',
    department: 'إدارة العمليات والمبيعات',
    level: 'إشرافي',
    reporting: 'مدير العمليات / مدير الفرع',
    objective: 'الإشراف على حركة البيع اليومية في الصالة، وتوجيه فريق موظفي المبيعات وصناديق المحاسبة، وضمان تجربة تسوق متميزة للعملاء، وتحقيق المستهدفات البيعية.',
    duties: [
      'متابعة تشغيل صالة المبيعات وجاهزية نقاط البيع (POS) وتوافر الكاشيرات والمشرفين.',
      'مراقبة عروض الأسعار والتأكد من وضوح بطاقات الأسعار ومطابقتها لنظام الباركود.',
      'الإشراف على ترتيب المنتجات في الرفوف وتطبيق سياسة FIFO لمنع انتهاء الصلاحيات.',
      'معالجة استفسارات وشكاوى العملاء بشكل فوري ومهني لضمان رضاهم التام.',
      'متابعة التوريدات اليومية للبضائع وسرعة تنزيلها وتنسيقها في الصالة.',
      'إعداد التقارير اليومية عن الإيرادات ومعدل المبيعات وحركة الأصناف الأكثر طلباً.'
    ],
    authorities: [
      'توزيع الورديات والمهام اليومية على موظفي الصالة والكاشيرات.',
      'الموافقة على عمليات استرجاع أو استبدال البضائع وفق سياسة الشركة.'
    ],
    qualifications: 'دبلوم أو بكالوريوس في إدارة الأعمال، التسويق، أو ما يعادلها.',
    experience: 'لا تقل عن 3 سنوات في قطاع التجزئة والسوبرماركت (Retail/FMCG).',
    competencies: [
      'مهارات قيادة وتوجيه فرق العمل الميدانية.',
      'القدرة على حل المشكلات تحت ضغط العمل وأوقات الذروة.',
      'التركيز العالي على خدمة العملاء وتحقيق أهداف المبيعات.'
    ],
    kpis: [
      'تحقيق مستهدف المبيعات الشهري بنسبة لا تقل عن 95%.',
      'صفر هدر أو بضائع منتهية الصلاحية في الصالة.',
      'نسبة رضاء العملاء لا تقل عن 92%.'
    ],
    conditions: 'عمل ميداني بصالة العرض مع مرونة العمل في الورديات المسائية وعطلات نهاية الأسبوع.'
  },
  'fleet_supervisor': {
    title_ar: 'مشرف حركة ونقليات (أسطول المركبات)',
    title_en: 'Fleet & Logistics Supervisor',
    department: 'إدارة الخدمات المساندة والأسطول',
    level: 'إشرافي',
    reporting: 'مدير الخدمات العامة',
    objective: 'إدارة أسطول مركبات الشركة (23 مركبة)، ومتابعة التفويضات في منصة تم، وجداول الصيانة الدورية، وتأمين المركبات، وتوزيع السائقين بما يضمن انسيابية التوريد والتوصيل.',
    duties: [
      'إدارة أسطول المركبات في منصة تم الحكومية وإصدار وإلغاء التفويضات الداخلية والخارجية.',
      'متابعة سريان رخص السير (الاستمارات)، والفحص الدوري، وبوالص التأمين لكافة المركبات وتجديدها في مواعيدها.',
      'جدولة أعمال الصيانة الوقائية والإصلاحات الطارئة ومتابعة ورش الصيانة المعتمدة.',
      'مراقبة استهلاك الوقود عبر بطاقات الوقود ومطابقة الفواتير مع المسافات المقطوعة (عدادات Odometer).',
      'توجيه السائقين ومتابعة مسارات النقل والتوصيل لفروع الشركة والمستودعات المركزية.',
      'متابعة الحوادث المرورية وبلاغات نجم والمرور وتوثيقها في سجلات الأسطول وحساب التعويضات.'
    ],
    authorities: [
      'إيقاف أي مركبة عن العمل في حال وجود أعطال تهدد السلامة أو انتهاء الفحص/التأمين.',
      'تسليم واستلام عهد المركبات وتحديد مسؤولية السائقين عن الأضرار الناتجة عن الإهمال.'
    ],
    qualifications: 'دبلوم فني أو إدارة لوجستيات وسلاسل إمداد أو ما يعادلها مع رخصة قيادة سارية.',
    experience: 'من 3 إلى 5 سنوات في إدارة النقليات والأساطيل التجارية ومنصة تم بالمملكة.',
    competencies: [
      'إتقان منصة تم الحكومية وأنظمة تتبع المركبات GPS.',
      'معرفة فنية بميكانيكا وكهرباء السيارات وإجراءات السلامة المرورية.',
      'مهارات تخطيط المسارات وإدارة الوقت وضبط التكاليف.'
    ],
    kpis: [
      'جاهزية وتشغيل أسطول المركبات بنسبة لا تقل عن 98%.',
      'صفر غرامات أو مخالفات ناتجة عن انتهاء الاستمارة أو الفحص أو التأمين.',
      'ترشيد تكاليف الوقود والصيانة بنسبة 10% سنوياً.'
    ],
    conditions: 'عمل ميداني وإشرافي متنقل بين الفروع ومراكز الصيانة ومواقع التوزيع.'
  },
  'it_specialist': {
    title_ar: 'أخصائي دعم تقنية المعلومات والشبكات',
    title_en: 'IT & Network Support Specialist',
    department: 'إدارة تقنية المعلومات',
    level: 'تخصصي',
    reporting: 'مدير تقنية المعلومات',
    objective: 'ضمان استمرارية تشغيل البنية التحتية التقنية، وشبكات الفروع، وأجهزة نقاط البيع POS، وسيرفرات النظام، وحماية البيانات وأنظمة النسخ الاحتياطي.',
    duties: [
      'صيانة ودعم أجهزة نقاط البيع (POS) وطابعات الفواتير وقارئات الباركود في جميع الفروع.',
      'إدارة شبكات الاتصال المحلية (LAN/WAN) والراوترات وأجهزة المراقبة وكاميرات الفروع.',
      'متابعة أجهزة البصمة البيومترية ومزامنة سجلات الحضور والانصراف مع نظام HRMS المركزي.',
      'تثبيت وتحديث أنظمة التشغيل والبرمجيات المؤسسية وحماية الشبكة من الهجمات والفيروسات.',
      'إجراء النسخ الاحتياطي اليومي والأسبوعي لقواعد البيانات ومطابقة سلامة النسخ المسترجعة.',
      'تقديم الدعم الفني المباشر للمستخدمين وحل المشكلات التقنية والأعطال بالسرعة القصوى.'
    ],
    authorities: [
      'منح أو تقييد صلاحيات الوصول للشبكة الداخلية وأجهزة الحاسب الآلي.',
      'إجراء الصيانة العاجلة وإعادة تشغيل الخوادم والراوترات عند الطوارئ.'
    ],
    qualifications: 'بكالوريوس علوم حاسب، تقنية معلومات، أو هندسة شبكات (CCNA/CompTIA Network+ ميزة إضافية).',
    experience: 'من 2 إلى 4 سنوات في الدعم الفني وشبكات التجزئة والـ POS.',
    competencies: [
      'خبرة في أنظمة التشغيل Windows Server وLinux وشبكات TCP/IP والـ VPN.',
      'معرفة متخصصة في صيانة أجهزة نقاط البيع (POS) وقواعد بيانات SQL.',
      'سرعة الاستجابة ومهارات استكشاف الأخطاء وإصلاحها (Troubleshooting).'
    ],
    kpis: [
      'استمرارية تشغيل أنظمة نقاط البيع والشبكة بنسبة لا تقل عن 99.8%.',
      'متوسط وقت حل التذاكر التقنية العاجلة لا يتجاوز 15 دقيقة.',
      'تنفيذ النسخ الاحتياطي لقواعد البيانات بنسبة نجاح 100% يومياً.'
    ],
    conditions: 'بيئة تقنية مع الاستعداد للاستجابة للأعطال الطارئة في الفروع ومراكز البيع.'
  }
};

/**
 * Generates an Enterprise Standard Job Description dynamically.
 */
function generateJobDescription(params = {}) {
  const titleInput = (params.job_title || '').trim();
  const deptInput = (params.department || '').trim();
  const levelInput = (params.level || 'تخصصي').trim();
  const expInput = (params.experience_years || '3-5 سنوات').trim();
  const eduInput = (params.education || 'بكالوريوس في التخصص ذي الصلة').trim();
  const notes = (params.notes || '').trim();

  // Find best archetype match or generate custom
  let matchKey = 'hr';
  const lower = titleInput.toLowerCase();
  if (lower.includes('محاسب') || lower.includes('مالي') || lower.includes('حسابات') || lower.includes('account')) {
    matchKey = 'accountant';
  } else if (lower.includes('مبيع') || lower.includes('صالة') || lower.includes('كاشير') || lower.includes('sales') || lower.includes('تسويق')) {
    matchKey = 'sales_supervisor';
  } else if (lower.includes('أسطول') || lower.includes('نقليات') || lower.includes('حركة') || lower.includes('سائق') || lower.includes('fleet') || lower.includes('تم')) {
    matchKey = 'fleet_supervisor';
  } else if (lower.includes('تقني') || lower.includes('شبك') || lower.includes('حاسب') || lower.includes('it') || lower.includes('مبرمج')) {
    matchKey = 'it_specialist';
  }

  const base = ROLE_ARCHETYPES[matchKey];
  const finalTitleAr = titleInput || base.title_ar;
  const finalDept = deptInput || base.department;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const jobCode = `JD-JM-${randomSuffix}`;

  const result = {
    job_code: jobCode,
    job_title_ar: finalTitleAr,
    job_title_en: base.title_en,
    department_name: finalDept,
    job_level: levelInput || base.level,
    reporting_to: base.reporting,
    general_objective: base.objective + (notes ? ` بالإضافة إلى: ${notes}` : ''),
    main_duties: base.duties,
    authorities: base.authorities,
    qualifications: eduInput || base.qualifications,
    experience_years: expInput || base.experience,
    skills_and_competencies: base.competencies,
    kpis: base.kpis,
    working_conditions: base.conditions
  };

  return result;
}

/**
 * Saves a generated or edited job description to SQLite database
 */
function saveJobDescription(data) {
  initJobDescriptionsTable();
  const jobCode = data.job_code || `JD-JM-${Math.floor(1000 + Math.random() * 9000)}`;
  const titleAr = data.job_title_ar || 'مسمى وظيفي';
  const titleEn = data.job_title_en || '';
  const deptName = data.department_name || 'الإدارة العامة';
  const deptId = data.department_id ? Number(data.department_id) : null;
  const level = data.job_level || 'تخصصي';
  const reporting = data.reporting_to || '';
  const objective = data.general_objective || '';
  const dutiesStr = Array.isArray(data.main_duties) ? JSON.stringify(data.main_duties) : (data.main_duties || '[]');
  const authStr = Array.isArray(data.authorities) ? JSON.stringify(data.authorities) : (data.authorities || '[]');
  const quals = data.qualifications || '';
  const expYears = data.experience_years || '';
  const skillsStr = Array.isArray(data.skills_and_competencies) ? JSON.stringify(data.skills_and_competencies) : (data.skills_and_competencies || '[]');
  const kpisStr = Array.isArray(data.kpis) ? JSON.stringify(data.kpis) : (data.kpis || '[]');
  const conditions = data.working_conditions || '';

  const existing = get("SELECT id FROM job_descriptions WHERE job_code = ?", [jobCode]);
  if (existing) {
    run(`
      UPDATE job_descriptions SET
        job_title_ar = ?, job_title_en = ?, department_id = ?, department_name = ?,
        job_level = ?, reporting_to = ?, general_objective = ?, main_duties = ?,
        authorities = ?, qualifications = ?, experience_years = ?, skills_and_competencies = ?,
        kpis = ?, working_conditions = ?, updated_at = datetime('now', 'localtime')
      WHERE id = ?
    `, [titleAr, titleEn, deptId, deptName, level, reporting, objective, dutiesStr, authStr, quals, expYears, skillsStr, kpisStr, conditions, existing.id]);
    return { success: true, id: existing.id, job_code: jobCode, action: 'updated' };
  } else {
    const res = run(`
      INSERT INTO job_descriptions (
        job_code, job_title_ar, job_title_en, department_id, department_name,
        job_level, reporting_to, general_objective, main_duties, authorities,
        qualifications, experience_years, skills_and_competencies, kpis,
        working_conditions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [jobCode, titleAr, titleEn, deptId, deptName, level, reporting, objective, dutiesStr, authStr, quals, expYears, skillsStr, kpisStr, conditions]);
    return { success: true, id: res.lastInsertRowid, job_code: jobCode, action: 'created' };
  }
}

/**
 * Lists all saved job descriptions
 */
function getAllJobDescriptions() {
  initJobDescriptionsTable();
  const rows = query("SELECT * FROM job_descriptions ORDER BY id DESC");
  return rows.map(r => {
    try { r.main_duties = JSON.parse(r.main_duties); } catch (_) {}
    try { r.authorities = JSON.parse(r.authorities); } catch (_) {}
    try { r.skills_and_competencies = JSON.parse(r.skills_and_competencies); } catch (_) {}
    try { r.kpis = JSON.parse(r.kpis); } catch (_) {}
    return r;
  });
}

/**
 * Gets a single job description by ID
 */
function getJobDescriptionById(id) {
  initJobDescriptionsTable();
  const r = get("SELECT * FROM job_descriptions WHERE id = ?", [id]);
  if (!r) return null;
  try { r.main_duties = JSON.parse(r.main_duties); } catch (_) {}
  try { r.authorities = JSON.parse(r.authorities); } catch (_) {}
  try { r.skills_and_competencies = JSON.parse(r.skills_and_competencies); } catch (_) {}
  try { r.kpis = JSON.parse(r.kpis); } catch (_) {}
  return r;
}

/**
 * Renders an official printable HTML Job Description Card
 */
function renderJobDescriptionHtml(jd) {
  const dutiesList = Array.isArray(jd.main_duties) ? jd.main_duties : [];
  const authList = Array.isArray(jd.authorities) ? jd.authorities : [];
  const skillsList = Array.isArray(jd.skills_and_competencies) ? jd.skills_and_competencies : [];
  const kpisList = Array.isArray(jd.kpis) ? jd.kpis : [];

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>بطاقة الوصف الوظيفي المعيارية - ${jd.job_title_ar}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; color: #1e293b; background: #fff; line-height: 1.5; font-size: 12px; }
    .header-box { border-bottom: 2px solid #700c14; padding-bottom: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
    .company-title { font-size: 16px; font-weight: 900; color: #700c14; margin: 0; }
    .company-sub { font-size: 11px; color: #64748b; font-weight: bold; margin: 2px 0 0 0; }
    .doc-badge { background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 14px; border-radius: 8px; text-align: left; }
    .doc-badge p { margin: 0; font-size: 10px; font-weight: bold; color: #475569; }
    .section-title { background: #f1f5f9; border-right: 4px solid #700c14; padding: 6px 12px; font-size: 12px; font-weight: 900; color: #0f172a; margin: 12px 0 8px 0; border-radius: 0 4px 4px 0; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .meta-table td { padding: 6px 10px; border: 1px solid #e2e8f0; font-size: 11px; }
    .meta-label { background: #f8fafc; font-weight: bold; color: #475569; width: 18%; }
    .meta-val { font-weight: 600; color: #0f172a; }
    .content-box { border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; margin-bottom: 10px; font-size: 11px; line-height: 1.6; }
    ul { margin: 4px 0; padding-right: 20px; }
    li { margin-bottom: 4px; font-size: 11px; color: #334155; }
    .footer-box { margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; font-size: 10px; color: #64748b; }
    .sig-box { text-align: center; width: 30%; }
    .sig-space { height: 40px; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div style="text-align: left; padding: 10px 0;" class="no-print">
    <button onclick="window.print()" style="background: #700c14; color: #fff; border: none; padding: 8px 18px; border-radius: 8px; font-weight: bold; cursor: pointer;">
      🖨️ طباعة بطاقة الوصف الوظيفي
    </button>
  </div>

  <div class="header-box">
    <div>
      <h1 class="company-title">شركة جوهرة المجد للتجارة</h1>
      <p class="company-sub">إدارة الموارد البشرية والامتثال الإداري | بطاقة الوصف الوظيفي المعيارية</p>
    </div>
    <div class="doc-badge">
      <p>رمز الوظيفة: <span style="color:#700c14; font-family: monospace;">${jd.job_code || 'JD-JM-001'}</span></p>
      <p>رقم الاعتماد: <span style="color:#0f172a;">229400</span></p>
      <p>تاريخ الإصدار: <span>${new Date().toISOString().split('T')[0]}</span></p>
    </div>
  </div>

  <div class="section-title">1. بطاقة التعريف بالوظيفة (Job Identification)</div>
  <table class="meta-table">
    <tr>
      <td class="meta-label">المسمى الوظيفي:</td>
      <td class="meta-val" style="color: #700c14; font-size: 12px;">${jd.job_title_ar}</td>
      <td class="meta-label">المسمى بالإنجليزية:</td>
      <td class="meta-val" style="font-family: sans-serif;">${jd.job_title_en || '-'}</td>
    </tr>
    <tr>
      <td class="meta-label">الإدارة / القسم:</td>
      <td class="meta-val">${jd.department_name || 'عام'}</td>
      <td class="meta-label">المستوى الوظيفي:</td>
      <td class="meta-val">${jd.job_level || 'تخصصي'}</td>
    </tr>
    <tr>
      <td class="meta-label">المسؤول المباشر:</td>
      <td class="meta-val">${jd.reporting_to || 'مدير الإدارة'}</td>
      <td class="meta-label">سنوات الخبرة:</td>
      <td class="meta-val">${jd.experience_years || '3-5 سنوات'}</td>
    </tr>
  </table>

  <div class="section-title">2. الهدف العام للوظيفة (Job Purpose)</div>
  <div class="content-box">
    ${jd.general_objective}
  </div>

  <div class="section-title">3. المهام والمسؤوليات الرئيسية (Core Duties & Responsibilities)</div>
  <div class="content-box">
    <ul>
      ${dutiesList.map(d => `<li>${d}</li>`).join('')}
    </ul>
  </div>

  <div class="section-title">4. نطاق الصلاحيات وسلطة اتخاذ القرار (Authorities & Scope)</div>
  <div class="content-box">
    <ul>
      ${authList.map(a => `<li>${a}</li>`).join('')}
    </ul>
  </div>

  <div class="section-title">5. المؤهلات والجدارات المطلوبة (Qualifications & Competencies)</div>
  <table class="meta-table">
    <tr>
      <td class="meta-label">المؤهل العلمي:</td>
      <td class="meta-val" colspan="3">${jd.qualifications}</td>
    </tr>
    <tr>
      <td class="meta-label">الجدارات والمهارات:</td>
      <td class="meta-val" colspan="3">
        <ul>
          ${skillsList.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </td>
    </tr>
  </table>

  <div class="section-title">6. مؤشرات قياس الأداء الرئيسية (Key Performance Indicators - KPIs)</div>
  <div class="content-box">
    <ul>
      ${kpisList.map(k => `<li>${k}</li>`).join('')}
    </ul>
  </div>

  <div class="footer-box">
    <div class="sig-box">
      <p style="font-weight: bold; margin: 0;">شاغل الوظيفة (الموظف)</p>
      <div class="sig-space"></div>
      <p style="margin: 0;">التوقيع: ............................</p>
    </div>
    <div class="sig-box">
      <p style="font-weight: bold; margin: 0;">المدير المباشر</p>
      <div class="sig-space"></div>
      <p style="margin: 0;">التوقيع: ............................</p>
    </div>
    <div class="sig-box">
      <p style="font-weight: bold; margin: 0;">مدير إدارة الموارد البشرية</p>
      <div class="sig-space"></div>
      <p style="margin: 0;">الختم والاعتماد: ............................</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generates an official Word document (.docx) for the Job Description
 */
async function generateJobDescriptionDocx(jd) {
  const duties = Array.isArray(jd.main_duties) ? jd.main_duties : [];
  const auths = Array.isArray(jd.authorities) ? jd.authorities : [];
  const skills = Array.isArray(jd.skills_and_competencies) ? jd.skills_and_competencies : [];
  const kpis = Array.isArray(jd.kpis) ? jd.kpis : [];

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 }
        }
      },
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: "شركة جوهرة المجد للتجارة", bold: true, size: 30, color: "700C14" }),
          ],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "بطاقة الوصف الوظيفي المعيارية (Enterprise Job Description)", bold: true, size: 22, color: "333333" }),
          ],
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({ text: "" }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "المسمى الوظيفي:", bold: true })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: jd.job_title_ar || '', bold: true, color: "700C14" })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "رمز الوظيفة:", bold: true })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: jd.job_code || '' })] })] })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "الإدارة / القسم:", bold: true })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: jd.department_name || '' })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "المستوى الوظيفي:", bold: true })] })] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: jd.job_level || '' })] })] })
              ]
            })
          ]
        }),
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [new TextRun({ text: "الهدف العام للوظيفة:", bold: true, size: 22, color: "700C14" })]
        }),
        new Paragraph({
          children: [new TextRun({ text: jd.general_objective || '', size: 20 })]
        }),
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [new TextRun({ text: "المهام والمسؤوليات الرئيسية:", bold: true, size: 22, color: "700C14" })]
        }),
        ...duties.map(d => new Paragraph({
          children: [new TextRun({ text: `• ${d}`, size: 20 })]
        })),
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [new TextRun({ text: "المؤهلات والجدارات المطلوبة:", bold: true, size: 22, color: "700C14" })]
        }),
        new Paragraph({
          children: [new TextRun({ text: `المؤهل: ${jd.qualifications || ''}`, size: 20 })]
        }),
        ...skills.map(s => new Paragraph({
          children: [new TextRun({ text: `• ${s}`, size: 20 })]
        })),
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [new TextRun({ text: "مؤشرات قياس الأداء الرئيسية (KPIs):", bold: true, size: 22, color: "700C14" })]
        }),
        ...kpis.map(k => new Paragraph({
          children: [new TextRun({ text: `• ${k}`, size: 20 })]
        }))
      ]
    }]
  });

  return await Packer.toBuffer(doc);
}

module.exports = {
  generateJobDescription,
  saveJobDescription,
  getAllJobDescriptions,
  getJobDescriptionById,
  renderJobDescriptionHtml,
  generateJobDescriptionDocx
};
