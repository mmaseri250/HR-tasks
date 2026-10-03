// server/modules/requests.js
const { query, get, run } = require('../database/db');

function getAllRequests(filters = {}) {
  let sql = `
    SELECT r.*, e.emp_code, e.full_name_ar, e.job_title_ar, d.name_ar AS department_name
    FROM requests r
    JOIN employees e ON r.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.emp_id) {
    sql += ` AND r.emp_id = ?`;
    params.push(filters.emp_id);
  }

  if (filters.status) {
    sql += ` AND r.status = ?`;
    params.push(filters.status);
  }

  if (filters.request_type) {
    sql += ` AND r.request_type = ?`;
    params.push(filters.request_type);
  }

  sql += ` ORDER BY r.created_at DESC, r.id DESC`;
  return query(sql, params);
}

function getRequestById(id) {
  const sql = `
    SELECT r.*, e.emp_code, e.full_name_ar, e.full_name_en, e.job_title_ar,
           e.national_id, e.nationality, e.is_saudi, e.join_date, e.basic_salary,
           e.housing_allowance, e.transport_allowance, e.other_allowance,
           d.name_ar AS department_name
    FROM requests r
    JOIN employees e ON r.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE r.id = ?
  `;
  return get(sql, [id]);
}

function submitRequest(data) {
  const {
    emp_id,
    request_type,
    start_date = null,
    end_date = null,
    days_count = 0,
    amount = 0,
    destination_entity = null,
    reason
  } = data;

  if (!emp_id || !request_type || !reason) {
    throw new Error('يرجى تحديد الموظف ونوع الطلب وسبب الطلب');
  }

  const emp = get('SELECT id, annual_leave_balance FROM employees WHERE id = ?', [emp_id]);
  if (!emp) {
    throw new Error('الموظف غير موجود');
  }

  // Validate leave balance if annual leave
  if (request_type === 'إجازة سنوية' && days_count > emp.annual_leave_balance) {
    throw new Error(`رصيد إجازاتك الحالي (${emp.annual_leave_balance} يوم) لا يكفي لتغطية الإجازة المطلوبة (${days_count} يوم)`);
  }

  const year = new Date().getFullYear();
  const countRow = get('SELECT COUNT(*) AS total FROM requests');
  const seq = String((countRow.total || 0) + 1).padStart(4, '0');
  const request_no = `REQ-${year}-${seq}`;

  const sql = `
    INSERT INTO requests (
      request_no, emp_id, request_type, start_date, end_date, days_count,
      amount, destination_entity, reason, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'معلق', datetime('now'), datetime('now'))
  `;

  const result = run(sql, [
    request_no, emp_id, request_type, start_date, end_date,
    days_count, amount, destination_entity, reason
  ]);

  return getRequestById(result.lastInsertRowid);
}

function updateRequestStatus(id, newStatus, role, comment) {
  const req = getRequestById(id);
  if (!req) {
    throw new Error('الطلب غير موجود');
  }

  let sql = '';
  let params = [];

  if (role === 'manager') {
    sql = `
      UPDATE requests
      SET status = ?, manager_comment = ?, updated_at = datetime('now')
      WHERE id = ?
    `;
    params = [newStatus, comment || 'تمت مراجعة الطلب من قبل المدير المباشر', id];
  } else {
    // Admin / HR
    sql = `
      UPDATE requests
      SET status = ?, hr_comment = ?, updated_at = datetime('now')
      WHERE id = ?
    `;
    params = [newStatus, comment || 'تم اعتماد الطلب من قبل إدارة الموارد البشرية', id];

    // If approved and it's annual leave, deduct from balance
    if (newStatus === 'معتمد نهائياً' && req.request_type === 'إجازة سنوية' && req.days_count > 0) {
      run(`
        UPDATE employees
        SET annual_leave_balance = MAX(0, annual_leave_balance - ?)
        WHERE id = ?
      `, [req.days_count, req.emp_id]);
    }
  }

  run(sql, params);
  return getRequestById(id);
}

// Generate Official Salary Certificate Data for instant preview & printing
function generateCertifiedSalaryLetter(empId, destination = 'إلى من يهمه الأمر') {
  const emp = get(`
    SELECT e.*, d.name_ar AS department_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE e.id = ?
  `, [empId]);

  if (!emp) throw new Error('الموظف غير موجود');

  const settings = get('SELECT * FROM company_settings WHERE id = 1') || {};

  const certYear = new Date().getFullYear();
  const certId = `JM-CERT-${certYear}-${String(emp.id).padStart(4, '0')}${Math.floor(100 + Math.random() * 900)}`;

  const totalGross = emp.basic_salary + emp.housing_allowance + emp.transport_allowance + emp.other_allowance;

  const today = new Date();
  const gregorianDate = today.toISOString().split('T')[0];
  // Calculate approximate Hijri date
  const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const hijriDate = hijriFormatter.format(today);

  // Digital verification payload encoded in QR Code
  const qrVerificationData = JSON.stringify({
    ref: certId,
    company: 'Jawharat Al-Majd Trading & Services Co.',
    cr: settings.cr_number,
    emp_code: emp.emp_code,
    national_id: emp.national_id,
    gross_salary: totalGross,
    issue_date: gregorianDate,
    status: 'AUTHENTIC_VERIFIED'
  });

  return {
    certId,
    issueDateGregorian: gregorianDate,
    issueDateHijri: hijriDate,
    destinationEntity: destination || 'إلى من يهمه الأمر',
    company: settings,
    employee: {
      emp_code: emp.emp_code,
      full_name_ar: emp.full_name_ar,
      full_name_en: emp.full_name_en,
      national_id: emp.national_id,
      nationality: emp.nationality,
      is_saudi: emp.is_saudi,
      job_title_ar: emp.job_title_ar,
      department_name: emp.department_name,
      join_date: emp.join_date,
      basic_salary: emp.basic_salary,
      housing_allowance: emp.housing_allowance,
      transport_allowance: emp.transport_allowance,
      other_allowance: emp.other_allowance,
      total_gross: totalGross
    },
    qrPayload: qrVerificationData
  };
}

module.exports = {
  getAllRequests,
  getRequestById,
  submitRequest,
  updateRequestStatus,
  generateCertifiedSalaryLetter
};
