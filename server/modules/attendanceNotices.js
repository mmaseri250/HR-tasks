// server/modules/attendanceNotices.js - In-System Absence, Delay & Work Abandonment Notice System
// Strictly in-system only; no emails or external mail bindings are executed.
const { query, get, run } = require('../database/db');

function getAllNotices(filters = {}) {
  let sql = `
    SELECT n.*,
           e.emp_code, e.full_name_ar, e.job_title_ar, e.national_id,
           d.name_ar AS department_name, b.name_ar AS branch_name
    FROM attendance_notices n
    JOIN employees e ON n.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.emp_id) {
    sql += ` AND n.emp_id = ?`;
    params.push(filters.emp_id);
  }

  if (filters.notice_type) {
    sql += ` AND n.notice_type = ?`;
    params.push(filters.notice_type);
  }

  if (filters.status) {
    sql += ` AND n.status = ?`;
    params.push(filters.status);
  }

  if (filters.search) {
    sql += ` AND (n.notice_no LIKE ? OR e.full_name_ar LIKE ? OR e.emp_code LIKE ? OR n.details LIKE ?)`;
    const term = `%${filters.search}%`;
    params.push(term, term, term, term);
  }

  sql += ` ORDER BY n.incident_date DESC, n.id DESC`;
  return query(sql, params);
}

function getNoticeById(id) {
  const sql = `
    SELECT n.*,
           e.emp_code, e.full_name_ar, e.job_title_ar, e.national_id, e.nationality,
           d.name_ar AS department_name, b.name_ar AS branch_name, m.full_name_ar AS direct_manager_name
    FROM attendance_notices n
    JOIN employees e ON n.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    LEFT JOIN employees m ON e.manager_id = m.id
    WHERE n.id = ?
  `;
  return get(sql, [id]);
}

function createNotice(data) {
  const {
    emp_id,
    notice_type = 'إشعار تأخير',
    incident_date,
    duration_mins = 0,
    absence_days = 0,
    consecutive_days = 0,
    legal_basis = '',
    details = '',
    penalty_applied = '',
    issued_by = 'إدارة الموارد البشرية'
  } = data;

  if (!emp_id || !incident_date || !notice_type) {
    throw new Error('بيانات الإشعار غير مكتملة (الموظف، نوع الإشعار، تاريخ الواقعة)');
  }

  const emp = get(`
    SELECT e.id, e.emp_code, e.full_name_ar, d.name_ar AS dept_name, b.name_ar AS branch_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    WHERE e.id = ?
  `, [emp_id]);

  if (!emp) throw new Error('الموظف غير موجود بقاعدة البيانات');

  // Automatic Legal Basis per Saudi Labor Law if not provided
  let determinedLegalBasis = legal_basis;
  if (!determinedLegalBasis) {
    if (notice_type.includes('المادة 80') || notice_type.includes('انقطاع')) {
      determinedLegalBasis = 'المادة (80) من نظام العمل السعودي - الفقرة 7 (الانقطاع عن العمل دون سبب مشروع لأكثر من 15 يوماً متصلة أو 30 يوماً متفرقة)';
    } else if (notice_type.includes('غياب')) {
      determinedLegalBasis = 'المادتان (80) و (84) من نظام العمل ولائحة تنظيم العمل بالمنشأة (الفصل الأول - مخالفات مواعيد العمل)';
    } else {
      determinedLegalBasis = 'لائحة تنظيم العمل المعتمدة بالمنشأة - قواعد وضوابط الحضور والانصراف';
    }
  }

  const year = new Date().getFullYear();
  const countRow = get('SELECT COUNT(*) AS total FROM attendance_notices');
  const seq = String((countRow.total || 0) + 1).padStart(4, '0');
  const notice_no = `NOT-${year}-${seq}`;

  const sql = `
    INSERT INTO attendance_notices (
      notice_no, emp_id, emp_code, emp_name, department, branch,
      notice_type, incident_date, duration_mins, absence_days, consecutive_days,
      legal_basis, details, penalty_applied, status, issued_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'صادر', ?, datetime('now'))
  `;

  const result = run(sql, [
    notice_no,
    emp.id,
    emp.emp_code,
    emp.full_name_ar,
    emp.dept_name || 'الإدارة العامة',
    emp.branch_name || 'الإدارة العامة',
    notice_type,
    incident_date,
    Number(duration_mins) || 0,
    Number(absence_days) || 0,
    Number(consecutive_days) || 0,
    determinedLegalBasis,
    details || `إشعار إداري رسمي بخصوص ${notice_type} بتاريخ ${incident_date}`,
    penalty_applied || 'تطبيق لائحة الجزاءات والإنذار الإداري',
    issued_by || 'إدارة الموارد البشرية'
  ]);

  return getNoticeById(result.lastInsertRowid);
}

function acknowledgeNotice(id, employeeNotes = '') {
  const notice = getNoticeById(id);
  if (!notice) throw new Error('الإشعار غير موجود');

  run(`
    UPDATE attendance_notices
    SET status = 'تم التوقيع والإقرار',
        acknowledged_at = datetime('now'),
        employee_notes = ?
    WHERE id = ?
  `, [employeeNotes || 'أقر بالاطلاع واستلام الإشعار', id]);

  return getNoticeById(id);
}

function getNoticesKPIs() {
  const total = get('SELECT COUNT(*) AS c FROM attendance_notices').c || 0;
  const late = get("SELECT COUNT(*) AS c FROM attendance_notices WHERE notice_type LIKE '%تأخير%'").c || 0;
  const absence = get("SELECT COUNT(*) AS c FROM attendance_notices WHERE notice_type LIKE '%غياب%'").c || 0;
  const abandon = get("SELECT COUNT(*) AS c FROM attendance_notices WHERE notice_type LIKE '%المادة 80%' OR notice_type LIKE '%انقطاع%'").c || 0;
  const pendingAck = get("SELECT COUNT(*) AS c FROM attendance_notices WHERE status = 'صادر'").c || 0;
  return { total, late, absence, abandon, pendingAck };
}

module.exports = {
  getAllNotices,
  getNoticeById,
  createNotice,
  acknowledgeNotice,
  getNoticesKPIs
};
