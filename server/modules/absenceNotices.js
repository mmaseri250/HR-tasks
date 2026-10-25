// server/modules/absenceNotices.js - Absence Notice System & Company Email Staging Integration
// Connects to company email in staged mode (ready for SMTP connection without external network transmission).
const { query, get, run } = require('../database/db');
const xlsx = require('xlsx');

const COMPANY = {
  nameAr: 'شركة جوهرة المجد للتجارة والمقاولات',
  nameEn: 'Jawharat Al-Majd Trading & Contracting Co.',
  cr: '7004872169',
  vat: '310492837400003',
  address: 'المملكة العربية السعودية، منطقة عسير، أبها - مول سيتي بارك',
  phone: '920012405',
  email: 'hr@jawharat-almajd.com',
  website: 'https://jalmajd.com'
};

function getAllAbsenceNotices(filters = {}) {
  let sql = `
    SELECT n.*,
           e.emp_code, e.full_name_ar, e.job_title_ar, e.national_id, e.nationality, e.email AS employee_db_email,
           d.name_ar AS department_name, b.name_ar AS branch_name,
           m.full_name_ar AS direct_manager_name, m.email AS direct_manager_email
    FROM absence_notices n
    JOIN employees e ON n.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    LEFT JOIN employees m ON e.manager_id = m.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.emp_id) {
    sql += ` AND n.emp_id = ?`;
    params.push(filters.emp_id);
  }

  if (filters.absence_type) {
    sql += ` AND n.absence_type = ?`;
    params.push(filters.absence_type);
  }

  if (filters.warning_tier) {
    sql += ` AND n.warning_tier = ?`;
    params.push(filters.warning_tier);
  }

  if (filters.email_status) {
    sql += ` AND n.email_status = ?`;
    params.push(filters.email_status);
  }

  if (filters.status) {
    sql += ` AND n.status = ?`;
    params.push(filters.status);
  }

  if (filters.search) {
    sql += ` AND (n.notice_no LIKE ? OR e.full_name_ar LIKE ? OR e.emp_code LIKE ? OR n.recipient_email LIKE ? OR n.reason LIKE ?)`;
    const term = `%${filters.search}%`;
    params.push(term, term, term, term, term);
  }

  sql += ` ORDER BY n.absence_date DESC, n.id DESC`;
  return query(sql, params);
}

function getAbsenceNoticeById(id) {
  const sql = `
    SELECT n.*,
           e.emp_code, e.full_name_ar, e.job_title_ar, e.national_id, e.nationality, e.email AS employee_db_email,
           d.name_ar AS department_name, b.name_ar AS branch_name,
           m.full_name_ar AS direct_manager_name, m.email AS direct_manager_email
    FROM absence_notices n
    JOIN employees e ON n.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    LEFT JOIN employees m ON e.manager_id = m.id
    WHERE n.id = ?
  `;
  return get(sql, [id]);
}

/**
 * Derives official legal basis under Saudi Labor Law
 */
function deriveLegalBasis(absenceType, warningTier) {
  if (absenceType.includes('المادة 80') || warningTier.includes('المادة 80') || warningTier.includes('فصل')) {
    return 'المادة (80) من نظام العمل السعودي - الفقرة (7): حق المنشأة في فسخ العقد دون مكافأة أو إشعار أو تعويض في حال الغياب دون عذر مشروع لأكثر من 15 يوماً متصلة أو 30 يوماً متقطعة خلال السنة العقدية بعد توجيه إنذار كتابي.';
  }
  if (absenceType.includes('متصل')) {
    return 'المادة (80) والمادة (84) من نظام العمل السعودي، واللائحة الداخلية لتنظيم العمل بالمنشأة (الفصل الأول - مخالفات مواعيد العمل والانقطاع المتصل).';
  }
  if (warningTier.includes('ثان')) {
    return 'اللائحة الداخلية لتنظيم العمل لشركة جوهرة المجد المعتمدة من وزارة الموارد البشرية والتنمية الاجتماعية - الإنذار الكتابي الثاني مع تطبيق خصم الراتب المقرر.';
  }
  return 'اللائحة الداخلية لتنظيم العمل لشركة جوهرة المجد المعتمدة من وزارة الموارد البشرية والتنمية الاجتماعية - ضوابط الحضور والانصراف والغياب بدون إذن مسبق.';
}

/**
 * Builds formatted HTML corporate email body matching Jawharat Al-Majd branding
 */
function buildCorporateEmailHtml({ notice_no, emp_name, emp_code, job_title, department_name, recipient_email, manager_name, manager_email, absence_date, absence_end_date, days_count, absence_type, warning_tier, legal_basis, reason, action_required }) {
  const isArt80 = absence_type.includes('المادة 80') || warning_tier.includes('80');
  const accentColor = isArt80 ? '#991b1b' : '#0f766e';
  const lightBg = isArt80 ? '#fef2f2' : '#f0fdfa';
  const borderColor = isArt80 ? '#fecaca' : '#ccfbf1';

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; color: #1e293b; direction: rtl; }
    .email-card { max-width: 680px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .email-header { background: #0f172a; padding: 24px 30px; text-align: center; border-bottom: 4px solid ${accentColor}; }
    .email-header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; }
    .email-header p { margin: 6px 0 0; color: #94a3b8; font-size: 12px; font-weight: 600; }
    .email-badge-bar { background: ${lightBg}; border-bottom: 1px solid ${borderColor}; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; }
    .email-badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; color: ${accentColor}; background: #ffffff; border: 1px solid ${borderColor}; }
    .email-content { padding: 30px; line-height: 1.8; font-size: 14px; }
    .greeting { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 14px; }
    .notice-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
    .notice-table th { background: #f8fafc; color: #475569; padding: 10px 14px; text-align: right; width: 28%; border: 1px solid #e2e8f0; font-weight: 700; }
    .notice-table td { padding: 10px 14px; border: 1px solid #e2e8f0; color: #0f172a; }
    .alert-box { background: ${lightBg}; border-right: 4px solid ${accentColor}; border: 1px solid ${borderColor}; border-right-width: 4px; padding: 16px; border-radius: 8px; margin: 20px 0; }
    .alert-box strong { color: ${accentColor}; display: block; margin-bottom: 4px; font-size: 13px; }
    .action-box { background: #f1f5f9; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0; }
    .email-footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; text-align: center; font-size: 11px; color: #64748b; line-height: 1.6; }
    .email-footer a { color: #0f766e; text-decoration: none; }
  </style>
</head>
<body>
  <div class="email-card">
    <div class="email-header">
      <h1>${COMPANY.nameAr}</h1>
      <p>${COMPANY.nameEn} - إدارة الموارد البشرية</p>
    </div>
    <div class="email-badge-bar">
      <span class="email-badge">رقم الإشعار: ${notice_no}</span>
      <span class="email-badge">${warning_tier}</span>
    </div>
    <div class="email-content">
      <div class="greeting">
        المكرم الموظف: <strong>${emp_name}</strong> (الرقم الوظيفي: ${emp_code}) المحترم،<br>
        السلام عليكم ورحمة الله وبركاته،،،
      </div>

      <p>
        إشارة إلى سجلات الحضور والانصراف الإلكترونية المعتمدة لدى المنشأة، نفيدكم بصدور <strong>${warning_tier}</strong> نتيجة تسجيل حالة الغياب الموضحة أدناه عن مقر العمل:
      </p>

      <table class="notice-table">
        <tr>
          <th>المسمى الوظيفي:</th>
          <td>${job_title || 'موظف'}</td>
          <th>الإدارة / القسم:</th>
          <td>${department_name || 'الإدارة العامة'}</td>
        </tr>
        <tr>
          <th>نوع الغياب:</th>
          <td><strong style="color: ${accentColor};">${absence_type}</strong></td>
          <th>درجة الإنذار:</th>
          <td><strong>${warning_tier}</strong></td>
        </tr>
        <tr>
          <th>تاريخ الغياب:</th>
          <td><strong>${absence_date}</strong> ${absence_end_date && absence_end_date !== absence_date ? `إلى <strong>${absence_end_date}</strong>` : ''}</td>
          <th>عدد أيام الغياب:</th>
          <td><strong style="color: ${accentColor};">${days_count} يوم</strong></td>
        </tr>
        <tr>
          <th>بريد الموظف:</th>
          <td>${recipient_email || 'غير مسجل'}</td>
          <th>المدير المباشر (CC):</th>
          <td>${manager_name || 'الإدارة العامة'} (${manager_email || 'غير مسجل'})</td>
        </tr>
        ${reason ? `
        <tr>
          <th>السبب المسجل:</th>
          <td colspan="3">${reason}</td>
        </tr>
        ` : ''}
      </table>

      <div class="alert-box">
        <strong>⚖️ السند النظامي والقانوني:</strong>
        <p style="margin: 0; font-size: 12px; color: #334155;">
          ${legal_basis}
        </p>
      </div>

      <div class="action-box">
        <strong style="color: #0f172a; font-size: 13px;">📋 الإجراء المطلوب من الموظف:</strong>
        <p style="margin: 6px 0 0; font-size: 12px; color: #475569;">
          ${action_required || 'يُرجى مراجعة إدارة الموارد البشرية أو تقديم عذر طبي/نظامي معتمد عبر بوابة الخدمة الذاتية خلال مدة أقصاها 48 ساعة من تاريخ هذا الإشعار، لتفادي اتخاذ الإجراءات النظامية وحسم أيام الغياب من الراتب.'}
        </p>
      </div>

      <p style="font-size: 12px; color: #64748b;">
        تم إرسال هذا الإشعار عبر النظام الداخلي للموارد البشرية بشركة جوهرة المجد، وتم تضمين بريد مديركم المباشر في نسخة الإرسال (CC).
      </p>
    </div>

    <div class="email-footer">
      <p style="margin: 0 0 6px;">
        <strong>${COMPANY.nameAr}</strong> | س.ت: ${COMPANY.cr} | الرقم الضريبي: ${COMPANY.vat}
      </p>
      <p style="margin: 0;">
        ${COMPANY.address} | هاتف: ${COMPANY.phone} | بريد: <a href="mailto:${COMPANY.email}">${COMPANY.email}</a>
      </p>
      <p style="margin: 6px 0 0; color: #94a3b8; font-size: 10px;">
        هذا البريد الإلكتروني رسمي وموجه للشخص المعني فقط ويحتوي على معلومات سرية وخاصة بالمنشأة.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function createAbsenceNotice(data) {
  const {
    emp_id,
    absence_date,
    absence_end_date = '',
    days_count,
    absence_type = 'غياب يوم واحد بدون إذن',
    warning_tier = 'إشعار غياب أولي',
    legal_basis = '',
    reason = '',
    action_required = '',
    recipient_email = '',
    manager_email = '',
    created_by = 'إدارة الموارد البشرية'
  } = data;

  if (!emp_id || !absence_date) {
    throw new Error('بيانات الإشعار غير مكتملة (الموظف وتاريخ الغياب إلزاميان)');
  }

  const emp = get(`
    SELECT e.id, e.emp_code, e.full_name_ar, e.job_title_ar, e.email, e.manager_id, e.direct_manager_name,
           d.name_ar AS department_name, b.name_ar AS branch_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    WHERE e.id = ?
  `, [emp_id]);

  if (!emp) throw new Error('الموظف غير موجود في قاعدة البيانات');

  // Resolve direct manager and manager email
  let resolvedManagerName = emp.direct_manager_name || '';
  let resolvedManagerEmail = manager_email || '';

  if (emp.manager_id) {
    const mgr = get('SELECT id, full_name_ar, email FROM employees WHERE id = ?', [emp.manager_id]);
    if (mgr) {
      resolvedManagerName = mgr.full_name_ar || resolvedManagerName;
      if (!resolvedManagerEmail && mgr.email) {
        resolvedManagerEmail = mgr.email;
      }
    }
  } else if (emp.direct_manager_name && !resolvedManagerEmail) {
    const mgrByName = get('SELECT email FROM employees WHERE full_name_ar = ? LIMIT 1', [emp.direct_manager_name]);
    if (mgrByName && mgrByName.email) {
      resolvedManagerEmail = mgrByName.email;
    }
  }

  const finalRecipientEmail = recipient_email || emp.email || 'غير مسجل';
  const finalManagerEmail = resolvedManagerEmail || 'غير مسجل';

  // Calculate days count
  let calculatedDays = Number(days_count) || 1;
  const endDate = absence_end_date || absence_date;
  if (!days_count && absence_end_date && absence_end_date !== absence_date) {
    const start = new Date(absence_date);
    const end = new Date(absence_end_date);
    const diffTime = Math.abs(end - start);
    calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  const determinedLegalBasis = legal_basis || deriveLegalBasis(absence_type, warning_tier);

  // Generate Notice Number
  const year = new Date().getFullYear();
  const countRow = get('SELECT COUNT(*) AS total FROM absence_notices');
  const seq = String((countRow.total || 0) + 1).padStart(4, '0');
  const notice_no = `ABS-${year}-${seq}`;

  const emailSubject = `[شركة جوهرة المجد] ${warning_tier} رقم ${notice_no} - الموظف: ${emp.full_name_ar}`;

  const defaultAction = action_required || 'مراجعة الموارد البشرية أو تقديم عذر رسمي معتمد خلال 48 ساعة لتفادي اتخاذ الإجراءات النظامية وحسم أيام الغياب.';

  const emailHtml = buildCorporateEmailHtml({
    notice_no,
    emp_name: emp.full_name_ar,
    emp_code: emp.emp_code,
    job_title: emp.job_title_ar,
    department_name: emp.department_name,
    recipient_email: finalRecipientEmail,
    manager_name: resolvedManagerName || 'الإدارة العامة',
    manager_email: finalManagerEmail,
    absence_date,
    absence_end_date: endDate,
    days_count: calculatedDays,
    absence_type,
    warning_tier,
    legal_basis: determinedLegalBasis,
    reason: reason || 'تسجيل غياب دون إذن مسبق بسجلات الدوام',
    action_required: defaultAction
  });

  const sql = `
    INSERT INTO absence_notices (
      notice_no, emp_id, emp_code, emp_name, department_name, job_title,
      recipient_email, manager_name, manager_email,
      absence_date, absence_end_date, days_count,
      absence_type, warning_tier, legal_basis, reason, action_required,
      email_subject, email_body_html, email_status,
      status, created_by, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, 'جاهز للربط ببريد الشركة',
      'صادر', ?, datetime('now'), datetime('now')
    )
  `;

  const result = run(sql, [
    notice_no,
    emp.id,
    emp.emp_code,
    emp.full_name_ar,
    emp.department_name || 'الإدارة العامة',
    emp.job_title_ar || 'موظف',
    finalRecipientEmail,
    resolvedManagerName || 'الإدارة العامة',
    finalManagerEmail,
    absence_date,
    endDate,
    calculatedDays,
    absence_type,
    warning_tier,
    determinedLegalBasis,
    reason || 'غياب غير مبرر',
    defaultAction,
    emailSubject,
    emailHtml,
    created_by
  ]);

  return getAbsenceNoticeById(result.lastInsertRowid);
}

function acknowledgeAbsenceNotice(id, employeeNotes = '') {
  const notice = getAbsenceNoticeById(id);
  if (!notice) throw new Error('إشعار الغياب غير موجود');

  run(`
    UPDATE absence_notices
    SET status = 'تم الإقرار',
        acknowledged_at = datetime('now'),
        employee_notes = ?,
        updated_at = datetime('now')
    WHERE id = ?
  `, [employeeNotes || 'أقر بالاستلام والعلم بمضمون إشعار الغياب', id]);

  return getAbsenceNoticeById(id);
}

function getAbsenceKPIs() {
  const total = get('SELECT COUNT(*) AS c FROM absence_notices').c || 0;
  const singleDay = get("SELECT COUNT(*) AS c FROM absence_notices WHERE absence_type LIKE '%يوم واحد%' OR days_count = 1").c || 0;
  const consecutive = get("SELECT COUNT(*) AS c FROM absence_notices WHERE absence_type LIKE '%متصل%' OR days_count > 1").c || 0;
  const article80 = get("SELECT COUNT(*) AS c FROM absence_notices WHERE absence_type LIKE '%80%' OR warning_tier LIKE '%80%' OR warning_tier LIKE '%فصل%'").c || 0;
  const readyForEmail = get("SELECT COUNT(*) AS c FROM absence_notices WHERE email_status = 'جاهز للربط ببريد الشركة'").c || 0;
  const acknowledged = get("SELECT COUNT(*) AS c FROM absence_notices WHERE status = 'تم الإقرار'").c || 0;

  return { total, singleDay, consecutive, article80, readyForEmail, acknowledged };
}

/**
 * Company Email Settings (SMTP Configuration Storage)
 */
function getCompanyEmailSettings() {
  const row = get('SELECT * FROM company_email_settings WHERE id = 1');
  if (!row) {
    return {
      smtp_host: '',
      smtp_port: 587,
      smtp_user: '',
      smtp_pass: '',
      has_password: false,
      from_email: 'hr@jawharat-almajd.com',
      from_name: 'شركة جوهرة المجد للمقاولات - الموارد البشرية',
      is_ssl: 0,
      is_active: 0,
      last_tested_at: null
    };
  }

  return {
    smtp_host: row.smtp_host || '',
    smtp_port: row.smtp_port || 587,
    smtp_user: row.smtp_user || '',
    smtp_pass: row.smtp_pass ? '••••••••' : '',
    has_password: Boolean(row.smtp_pass),
    from_email: row.from_email || 'hr@jawharat-almajd.com',
    from_name: row.from_name || 'شركة جوهرة المجد للمقاولات - الموارد البشرية',
    is_ssl: row.is_ssl || 0,
    is_active: row.is_active || 0,
    last_tested_at: row.last_tested_at
  };
}

function saveCompanyEmailSettings(data) {
  const existing = get('SELECT smtp_pass FROM company_email_settings WHERE id = 1');
  let finalPass = existing ? existing.smtp_pass : '';
  if (data.smtp_pass && data.smtp_pass !== '••••••••') {
    finalPass = data.smtp_pass;
  }

  const sql = `
    UPDATE company_email_settings
    SET smtp_host = ?,
        smtp_port = ?,
        smtp_user = ?,
        smtp_pass = ?,
        from_email = ?,
        from_name = ?,
        is_ssl = ?,
        is_active = ?,
        updated_at = datetime('now')
    WHERE id = 1
  `;

  run(sql, [
    data.smtp_host || '',
    Number(data.smtp_port) || 587,
    data.smtp_user || '',
    finalPass,
    data.from_email || 'hr@jawharat-almajd.com',
    data.from_name || 'شركة جوهرة المجد للمقاولات - الموارد البشرية',
    data.is_ssl ? 1 : 0,
    data.is_active ? 1 : 0
  ]);

  return getCompanyEmailSettings();
}

/**
 * Excel Export for Absence Notices
 */
function exportAbsenceNoticesExcel(filters = {}) {
  const notices = getAllAbsenceNotices(filters);

  const rows = notices.map((n, idx) => ({
    'م': idx + 1,
    'رقم الإشعار': n.notice_no,
    'الرقم الوظيفي': n.emp_code,
    'اسم الموظف': n.full_name_ar || n.emp_name,
    'المسمى الوظيفي': n.job_title || n.job_title_ar || '',
    'الإدارة': n.department_name || '',
    'بريد الموظف': n.recipient_email || '',
    'المدير المباشر': n.manager_name || '',
    'بريد المدير (CC)': n.manager_email || '',
    'تاريخ الغياب': n.absence_date,
    'تاريخ النهاية': n.absence_end_date || n.absence_date,
    'عدد الأيام': n.days_count,
    'نوع الغياب': n.absence_type,
    'درجة الإنذار': n.warning_tier,
    'السند النظامي': n.legal_basis || '',
    'حالة ربط البريد': n.email_status,
    'حالة الإشعار': n.status,
    'تاريخ الإصدار': n.created_at ? n.created_at.split(' ')[0] : ''
  }));

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(rows);

  ws['!cols'] = [
    { wch: 5 }, { wch: 16 }, { wch: 14 }, { wch: 28 }, { wch: 20 },
    { wch: 18 }, { wch: 26 }, { wch: 22 }, { wch: 26 }, { wch: 14 },
    { wch: 14 }, { wch: 10 }, { wch: 24 }, { wch: 20 }, { wch: 35 },
    { wch: 24 }, { wch: 14 }, { wch: 14 }
  ];

  xlsx.utils.book_append_sheet(wb, ws, 'إشعارات الغياب الرسمية');
  return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Downloadable Excel template for importing absence notices
 */
function generateAbsenceTemplateExcel() {
  const sample = [
    {
      'الرقم الوظيفي (إلزامي)': 'JM-001',
      'تاريخ بداية الغياب (YYYY-MM-DD)': '2026-10-25',
      'تاريخ نهاية الغياب (YYYY-MM-DD)': '2026-10-25',
      'نوع الغياب': 'غياب يوم واحد بدون إذن',
      'درجة الإنذار': 'إشعار غياب أولي',
      'السبب والتفاصيل': 'عدم الحضور وتأكيد البصمة بدون إشعار مسبق',
      'الإجراء المطلوب': 'تقديم عذر طبي خلال 48 ساعة'
    },
    {
      'الرقم الوظيفي (إلزامي)': 'JM-005',
      'تاريخ بداية الغياب (YYYY-MM-DD)': '2026-10-20',
      'تاريخ نهاية الغياب (YYYY-MM-DD)': '2026-10-23',
      'نوع الغياب': 'غياب متصل',
      'درجة الإنذار': 'إنذار كتابي أول',
      'السبب والتفاصيل': 'غياب متصل لمدة 4 أيام متتالية دون إذن',
      'الإجراء المطلوب': 'مراجعة الموارد البشرية وتوقيع الإقرار'
    }
  ];

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(sample);
  ws['!cols'] = [
    { wch: 22 }, { wch: 28 }, { wch: 28 }, { wch: 24 },
    { wch: 20 }, { wch: 40 }, { wch: 35 }
  ];

  xlsx.utils.book_append_sheet(wb, ws, 'نموذج استيراد إشعارات الغياب');
  return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Import absence notices from Excel
 */
function importAbsenceNoticesExcel(buffer) {
  const wb = xlsx.read(buffer, { type: 'buffer' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(ws);

  let successCount = 0;
  let skippedCount = 0;
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const empCode = String(row['الرقم الوظيفي (إلزامي)'] || row['الرقم الوظيفي'] || row['كود الموظف'] || '').trim();
    const absenceDate = String(row['تاريخ بداية الغياب (YYYY-MM-DD)'] || row['تاريخ الغياب'] || row['تاريخ البداية'] || '').trim();
    const absenceEndDate = String(row['تاريخ نهاية الغياب (YYYY-MM-DD)'] || row['تاريخ النهاية'] || absenceDate).trim();
    const absenceType = String(row['نوع الغياب'] || 'غياب يوم واحد بدون إذن').trim();
    const warningTier = String(row['درجة الإنذار'] || 'إشعار غياب أولي').trim();
    const reason = String(row['السبب والتفاصيل'] || row['السبب'] || '').trim();
    const actionRequired = String(row['الإجراء المطلوب'] || '').trim();

    if (!empCode || !absenceDate) {
      skippedCount++;
      errors.push(`السطر ${i + 2}: الرقم الوظيفي أو تاريخ الغياب مفقود`);
      continue;
    }

    const emp = get('SELECT id FROM employees WHERE emp_code = ?', [empCode]);
    if (!emp) {
      skippedCount++;
      errors.push(`السطر ${i + 2}: الموظف صاحب الرقم الوظيفي (${empCode}) غير موجود بالنظام`);
      continue;
    }

    try {
      createAbsenceNotice({
        emp_id: emp.id,
        absence_date: absenceDate,
        absence_end_date: absenceEndDate,
        absence_type: absenceType,
        warning_tier: warningTier,
        reason,
        action_required: actionRequired,
        created_by: 'استيراد إكسل'
      });
      successCount++;
    } catch (err) {
      skippedCount++;
      errors.push(`السطر ${i + 2}: ${err.message}`);
    }
  }

  return { successCount, skippedCount, errors };
}

/**
 * Printable Official Paper Letter with Seal & QR
 */
function renderOfficialAbsenceLetterHtml(noticeId) {
  const notice = getAbsenceNoticeById(noticeId);
  if (!notice) return '<h1>إشعار الغياب غير موجود</h1>';

  const isArticle80 = notice.absence_type.includes('المادة 80') || notice.warning_tier.includes('80');

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>إشعار غياب رسمي - ${notice.notice_no}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
    * { box-sizing: border-box; font-family: 'Cairo', sans-serif; }
    body { margin: 0; padding: 25px; background: #f8fafc; color: #1e293b; direction: rtl; }
    .doc-container { max-width: 820px; margin: 0 auto; background: #fff; padding: 35px 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; position: relative; }
    .doc-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${isArticle80 ? '#991b1b' : '#0f766e'}; padding-bottom: 15px; margin-bottom: 20px; }
    .doc-header-logo h1 { margin: 0; font-size: 20px; color: ${isArticle80 ? '#991b1b' : '#0f766e'}; font-weight: 900; }
    .doc-header-logo p { margin: 2px 0 0; font-size: 11px; color: #64748b; font-weight: 600; }
    .doc-meta { text-align: left; font-size: 11px; color: #475569; line-height: 1.6; }
    .doc-meta span { display: block; }
    .doc-title-box { background: ${isArticle80 ? '#fff1f2' : '#f0fdfa'}; border: 1px solid ${isArticle80 ? '#fecdd3' : '#ccfbf1'}; padding: 12px 16px; border-radius: 8px; text-align: center; margin-bottom: 22px; }
    .doc-title-box h2 { margin: 0; font-size: 19px; color: ${isArticle80 ? '#9f1239' : '#115e59'}; font-weight: 900; }
    .doc-title-box p { margin: 3px 0 0; font-size: 12px; color: ${isArticle80 ? '#be123c' : '#0d9488'}; font-weight: 700; }
    table.doc-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
    table.doc-table th, table.doc-table td { border: 1px solid #cbd5e1; padding: 9px 12px; text-align: right; }
    table.doc-table th { background: #f8fafc; color: #334155; font-weight: 700; width: 22%; }
    table.doc-table td { color: #0f172a; }
    .box-box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; font-size: 12px; }
    .signatures-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
    .sig-box { border: 1px dashed #cbd5e1; border-radius: 8px; padding: 12px; text-align: center; font-size: 11px; background: #f8fafc; }
    .sig-box h4 { margin: 0 0 6px; color: #0f766e; font-size: 12px; font-weight: 800; }
    .sig-box p { margin: 4px 0; color: #475569; }
    .sig-line { border-bottom: 1px solid #94a3b8; width: 80%; margin: 25px auto 8px; }
    .stamp-seal { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 10px; font-weight: 800; background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .qr-badge { text-align: center; margin-top: 22px; padding-top: 15px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #64748b; }
    .print-btn { position: fixed; bottom: 25px; left: 25px; background: #0f766e; color: #fff; border: none; padding: 10px 22px; border-radius: 999px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(15,118,110,0.4); display: flex; align-items: center; gap: 8px; font-size: 13px; z-index: 1000; }
    @media print {
      body { background: #fff; padding: 0; }
      .doc-container { box-shadow: none; border: none; padding: 15px; max-width: 100%; }
      .print-btn { display: none; }
    }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">🖨️ طباعة الإشعار الرسمي</button>

  <div class="doc-container">
    <div class="doc-header">
      <div class="doc-header-logo">
        <h1>${COMPANY.nameAr}</h1>
        <p>${COMPANY.nameEn}</p>
        <p>س.ت: ${COMPANY.cr} | الرقم الضريبي: ${COMPANY.vat}</p>
      </div>
      <div class="doc-meta">
        <span><strong>رقم الإشعار:</strong> ${notice.notice_no}</span>
        <span><strong>تاريخ الإصدار:</strong> ${notice.created_at ? notice.created_at.split(' ')[0] : ''}</span>
        <span><strong>حالة بريد الشركة:</strong> ${notice.email_status}</span>
      </div>
    </div>

    <div class="doc-title-box">
      <h2>${notice.warning_tier}</h2>
      <p>OFFICIAL ABSENCE NOTICE & LEGAL DIRECTIVE</p>
    </div>

    <p style="font-size: 13px; line-height: 1.8;">
      <strong>إلى الموظف المكرم:</strong> ${notice.emp_name} (الرقم الوظيفي: ${notice.emp_code})<br>
      <strong>المسمى الوظيفي:</strong> ${notice.job_title || 'موظف'} | <strong>الإدارة:</strong> ${notice.department_name || 'الإدارة العامة'}<br>
      <strong>بريد الموظف:</strong> ${notice.recipient_email || 'غير مسجل'} | <strong>المدير المباشر (نسخة CC):</strong> ${notice.manager_name} (${notice.manager_email || 'غير مسجل'})<br>
      <strong>السلام عليكم ورحمة الله وبركاته،،،</strong>
    </p>

    <p style="font-size: 13px; line-height: 1.8; text-align: justify;">
      إشارة إلى سجلات الدوام الإلكتروني وقواعد تنظيم العمل المعتمدة بالمنشأة، نفيدكم بصدور هذا الإشعار الإداري والإنذار الرسمي حيال واقعة الغياب التالية:
    </p>

    <table class="doc-table">
      <tr>
        <th>نوع الغياب:</th>
        <td><strong>${notice.absence_type}</strong></td>
        <th>تاريخ الغياب:</th>
        <td><strong>${notice.absence_date}</strong> ${notice.absence_end_date && notice.absence_end_date !== notice.absence_date ? `إلى <strong>${notice.absence_end_date}</strong>` : ''}</td>
      </tr>
      <tr>
        <th>عدد الأيام:</th>
        <td><strong style="color: #b91c1c;">${notice.days_count} يوم</strong></td>
        <th>درجة الإنذار:</th>
        <td><strong style="color: ${isArticle80 ? '#b91c1c' : '#0f766e'};">${notice.warning_tier}</strong></td>
      </tr>
      <tr>
        <th>السند النظامي والقانوني:</th>
        <td colspan="3" style="color: #0f766e; font-weight: 700;">${notice.legal_basis || 'نظام العمل السعودي ولائحة تنظيم العمل'}</td>
      </tr>
      <tr>
        <th>تفاصيل الواقعة:</th>
        <td colspan="3">${notice.reason}</td>
      </tr>
      <tr>
        <th>الإجراء المطلوب:</th>
        <td colspan="3"><strong style="color: #b91c1c;">${notice.action_required}</strong></td>
      </tr>
    </table>

    ${isArticle80 ? `
    <div class="box-box" style="background: #fff1f2; border: 2px solid #fda4af; color: #881337;">
      <strong>⚠️ إنذار كتابي نهائي بموجب أحكام المادة (80) من نظام العمل السعودي:</strong>
      <p style="margin: 4px 0 0; font-size: 11px; line-height: 1.7;">
        نلفت عنايتكم بأن استمرار الانقطاع عن العمل دون سبب مشروع يجاوز 15 يوماً متصلة أو 30 يوماً متقطعة خلال السنة العقدية يمنح صاحب العمل الحق القانوني في إنهاء العقد دون مكافأة أو إشعار أو تعويض بموجب أحكام الفقرة (7) من المادة (80) من نظام العمل السعودي.
      </p>
    </div>
    ` : `
    <div class="box-box" style="background: #f8fafc;">
      <strong>تنبيه إداري رسمي:</strong>
      <p style="margin: 4px 0 0; font-size: 11px; color: #475569;">
        يُرجى الالتزام التام بمواعيد العمل الرسمية وإبلاغ الإدارة مسبقاً قبل أي تغيب، تفادياً لتصعيد الجزاءات التأديبية المنصوص عليها في لائحة تنظيم العمل.
      </p>
    </div>
    `}

    <div class="signatures-grid">
      <div class="sig-box">
        <h4>إقرار الموظف بالاستلام</h4>
        <p>${notice.emp_name}</p>
        <p>الحالة: <strong>${notice.status}</strong></p>
        <div class="sig-line"></div>
        <p>التوقيع</p>
      </div>

      <div class="sig-box">
        <h4>المدير المباشر (علم واطلاع)</h4>
        <p>${notice.manager_name || 'مدير الإدارة'}</p>
        <p>${notice.manager_email || ''}</p>
        <div class="sig-line"></div>
        <p>التوقيع</p>
      </div>

      <div class="sig-box">
        <h4>إدارة الموارد البشرية</h4>
        <p>عبدالملك سعيد الشريف</p>
        <div class="sig-line"></div>
        <p><span class="stamp-seal">الختم الإداري والاعتماد الرسمي ✓</span></p>
      </div>
    </div>

    <div class="qr-badge">
      <span>وثيقة إدارية رسمية صادرة عبر النظام الداخلي لموارد بشرية جوهرة المجد</span>
      <span>رمز الإشعار: JM-${notice.notice_no}</span>
    </div>
  </div>
</body>
</html>
  `.trim();
}

module.exports = {
  getAllAbsenceNotices,
  getAbsenceNoticeById,
  createAbsenceNotice,
  acknowledgeAbsenceNotice,
  getAbsenceKPIs,
  getCompanyEmailSettings,
  saveCompanyEmailSettings,
  exportAbsenceNoticesExcel,
  generateAbsenceTemplateExcel,
  importAbsenceNoticesExcel,
  renderOfficialAbsenceLetterHtml
};
