// server/modules/employees.js
const { query, get, run } = require('../database/db');

function getAllEmployees(filters = {}) {
  let sql = `
    SELECT e.*, d.name_ar AS department_name_ar, d.name_en AS department_name_en,
           m.full_name_ar AS manager_name_ar
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN employees m ON e.manager_id = m.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.department_id) {
    sql += ` AND e.department_id = ?`;
    params.push(filters.department_id);
  }

  if (filters.status) {
    sql += ` AND e.status = ?`;
    params.push(filters.status);
  }

  if (filters.is_saudi !== undefined && filters.is_saudi !== '') {
    sql += ` AND e.is_saudi = ?`;
    params.push(parseInt(filters.is_saudi, 10));
  }

  if (filters.search) {
    sql += ` AND (e.full_name_ar LIKE ? OR e.full_name_en LIKE ? OR e.emp_code LIKE ? OR e.national_id LIKE ?)`;
    const searchPattern = `%${filters.search}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }

  sql += ` ORDER BY e.id ASC`;
  return query(sql, params);
}

function getEmployeeById(id) {
  const sql = `
    SELECT e.*, d.name_ar AS department_name_ar, d.name_en AS department_name_en,
           m.full_name_ar AS manager_name_ar
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN employees m ON e.manager_id = m.id
    WHERE e.id = ?
  `;
  return get(sql, [id]);
}

function createEmployee(data) {
  // Validate mandatory fields
  if (!data.emp_code || !data.full_name_ar || !data.national_id || !data.email) {
    throw new Error('بيانات الموظف الأساسية (الرقم الوظيفي، الاسم، الهوية، البريد) مطلوبة');
  }

  // Check national ID format: 10 digits
  if (!/^\d{10}$/.test(data.national_id)) {
    throw new Error('رقم الهوية الوطنية أو الإقامة يجب أن يتكون من 10 أرقام');
  }

  // Saudi nationality detection if national ID starts with 1
  const isSaudi = data.is_saudi !== undefined ? Number(data.is_saudi) : (data.national_id.startsWith('1') ? 1 : 0);

  const sql = `
    INSERT INTO employees (
      emp_code, full_name_ar, full_name_en, national_id, nationality,
      is_saudi, gender, birth_date, email, phone, department_id,
      job_title_ar, job_title_en, grade_level, manager_id, contract_type,
      join_date, contract_start, contract_end, iqama_expiry, passport_expiry,
      insurance_expiry, basic_salary, housing_allowance, transport_allowance,
      other_allowance, gosi_number, bank_name, bank_code, iban,
      annual_leave_balance, shift_type, status, role
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const result = run(sql, [
    data.emp_code,
    data.full_name_ar,
    data.full_name_en || data.full_name_ar,
    data.national_id,
    data.nationality || (isSaudi ? 'سعودي' : 'مقيم'),
    isSaudi,
    data.gender || 'M',
    data.birth_date || null,
    data.email,
    data.phone || '',
    data.department_id || null,
    data.job_title_ar || 'موظف',
    data.job_title_en || 'Employee',
    data.grade_level || 'P-1',
    data.manager_id || null,
    data.contract_type || 'محدد المدة',
    data.join_date || new Date().toISOString().split('T')[0],
    data.contract_start || null,
    data.contract_end || null,
    data.iqama_expiry || null,
    data.passport_expiry || null,
    data.insurance_expiry || null,
    Number(data.basic_salary) || 0,
    Number(data.housing_allowance) || 0,
    Number(data.transport_allowance) || 0,
    Number(data.other_allowance) || 0,
    data.gosi_number || '',
    data.bank_name || 'مصرف الراجحي',
    data.bank_code || 'RJHI',
    data.iban || '',
    data.annual_leave_balance !== undefined ? Number(data.annual_leave_balance) : 30,
    data.shift_type || 'دوام صباحي',
    data.status || 'نشط',
    data.role || 'employee'
  ]);

  return getEmployeeById(result.lastInsertRowid);
}

function updateEmployee(id, data) {
  const existing = getEmployeeById(id);
  if (!existing) {
    throw new Error('الموظف غير موجود');
  }

  const isSaudi = data.is_saudi !== undefined ? Number(data.is_saudi) : existing.is_saudi;

  const sql = `
    UPDATE employees SET
      emp_code = ?, full_name_ar = ?, full_name_en = ?, national_id = ?, nationality = ?,
      is_saudi = ?, gender = ?, birth_date = ?, email = ?, phone = ?, department_id = ?,
      job_title_ar = ?, job_title_en = ?, grade_level = ?, manager_id = ?, contract_type = ?,
      join_date = ?, contract_start = ?, contract_end = ?, iqama_expiry = ?, passport_expiry = ?,
      insurance_expiry = ?, basic_salary = ?, housing_allowance = ?, transport_allowance = ?,
      other_allowance = ?, gosi_number = ?, bank_name = ?, bank_code = ?, iban = ?,
      annual_leave_balance = ?, shift_type = ?, status = ?, role = ?
    WHERE id = ?
  `;

  run(sql, [
    data.emp_code !== undefined ? data.emp_code : existing.emp_code,
    data.full_name_ar !== undefined ? data.full_name_ar : existing.full_name_ar,
    data.full_name_en !== undefined ? data.full_name_en : existing.full_name_en,
    data.national_id !== undefined ? data.national_id : existing.national_id,
    data.nationality !== undefined ? data.nationality : existing.nationality,
    isSaudi,
    data.gender !== undefined ? data.gender : existing.gender,
    data.birth_date !== undefined ? data.birth_date : existing.birth_date,
    data.email !== undefined ? data.email : existing.email,
    data.phone !== undefined ? data.phone : existing.phone,
    data.department_id !== undefined ? data.department_id : existing.department_id,
    data.job_title_ar !== undefined ? data.job_title_ar : existing.job_title_ar,
    data.job_title_en !== undefined ? data.job_title_en : existing.job_title_en,
    data.grade_level !== undefined ? data.grade_level : existing.grade_level,
    data.manager_id !== undefined ? data.manager_id : existing.manager_id,
    data.contract_type !== undefined ? data.contract_type : existing.contract_type,
    data.join_date !== undefined ? data.join_date : existing.join_date,
    data.contract_start !== undefined ? data.contract_start : existing.contract_start,
    data.contract_end !== undefined ? data.contract_end : existing.contract_end,
    data.iqama_expiry !== undefined ? data.iqama_expiry : existing.iqama_expiry,
    data.passport_expiry !== undefined ? data.passport_expiry : existing.passport_expiry,
    data.insurance_expiry !== undefined ? data.insurance_expiry : existing.insurance_expiry,
    data.basic_salary !== undefined ? Number(data.basic_salary) : existing.basic_salary,
    data.housing_allowance !== undefined ? Number(data.housing_allowance) : existing.housing_allowance,
    data.transport_allowance !== undefined ? Number(data.transport_allowance) : existing.transport_allowance,
    data.other_allowance !== undefined ? Number(data.other_allowance) : existing.other_allowance,
    data.gosi_number !== undefined ? data.gosi_number : existing.gosi_number,
    data.bank_name !== undefined ? data.bank_name : existing.bank_name,
    data.bank_code !== undefined ? data.bank_code : existing.bank_code,
    data.iban !== undefined ? data.iban : existing.iban,
    data.annual_leave_balance !== undefined ? Number(data.annual_leave_balance) : existing.annual_leave_balance,
    data.shift_type !== undefined ? data.shift_type : existing.shift_type,
    data.status !== undefined ? data.status : existing.status,
    data.role !== undefined ? data.role : existing.role,
    id
  ]);

  return getEmployeeById(id);
}

function deleteEmployee(id) {
  return run('DELETE FROM employees WHERE id = ?', [id]);
}

function getDocumentExpiryAlerts() {
  const employees = query(`
    SELECT e.id, e.emp_code, e.full_name_ar, e.nationality, e.is_saudi,
           e.iqama_expiry, e.passport_expiry, e.contract_end, e.insurance_expiry,
           d.name_ar AS department_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE e.status = 'نشط'
  `);

  const now = new Date();
  const alerts = [];

  for (const emp of employees) {
    const docFields = [
      { type: 'إقامة / هوية مقيم', dateStr: emp.iqama_expiry },
      { type: 'عقد العمل الموثق (قوى)', dateStr: emp.contract_end },
      { type: 'جواز السفر', dateStr: emp.passport_expiry },
      { type: 'التأمين الطبي (مجلس الضمان)', dateStr: emp.insurance_expiry }
    ];

    for (const doc of docFields) {
      if (!doc.dateStr) continue;
      const targetDate = new Date(doc.dateStr);
      const diffTime = targetDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let alertStatus = 'valid';
      let alertLevel = 'info';

      if (diffDays < 0) {
        alertStatus = 'منتهي';
        alertLevel = 'critical';
      } else if (diffDays <= 30) {
        alertStatus = 'ينتهي خلال 30 يوم';
        alertLevel = 'danger';
      } else if (diffDays <= 60) {
        alertStatus = 'ينتهي خلال 60 يوم';
        alertLevel = 'warning';
      }

      if (alertLevel !== 'info') {
        alerts.push({
          emp_id: emp.id,
          emp_code: emp.emp_code,
          full_name_ar: emp.full_name_ar,
          department_name: emp.department_name,
          document_type: doc.type,
          expiry_date: doc.dateStr,
          days_remaining: diffDays,
          status: alertStatus,
          level: alertLevel
        });
      }
    }
  }

  // Sort by urgency (least days remaining first)
  alerts.sort((a, b) => a.days_remaining - b.days_remaining);
  return alerts;
}

function getSaudizationMetrics() {
  const totalRow = get(`SELECT COUNT(*) AS total FROM employees WHERE status = 'نشط'`);
  const saudiRow = get(`SELECT COUNT(*) AS saudi_count FROM employees WHERE status = 'نشط' AND is_saudi = 1`);

  const total = totalRow.total || 0;
  const saudiCount = saudiRow.saudi_count || 0;
  const expatCount = total - saudiCount;
  const rate = total > 0 ? Math.round((saudiCount / total) * 1000) / 10 : 0;

  // Nitaqat Band determination based on MHRSD rules for commercial/services medium enterprises
  let nitaqatBand = 'أخضر منخفض';
  let bandColor = '#27ae60';

  if (rate >= 45) {
    nitaqatBand = 'النطاق البلاتيني (أعلى درجات التوطين)';
    bandColor = '#2c3e50';
  } else if (rate >= 35) {
    nitaqatBand = 'النطاق الأخضر المرتفع';
    bandColor = '#27ae60';
  } else if (rate >= 25) {
    nitaqatBand = 'النطاق الأخضر المتوسط';
    bandColor = '#2ecc71';
  } else if (rate >= 15) {
    nitaqatBand = 'النطاق الأخضر المنخفض';
    bandColor = '#f39c12';
  } else {
    nitaqatBand = 'النطاق الأحمر (غير ملتزم بنسب التوطين)';
    bandColor = '#e74c3c';
  }

  return {
    totalEmployees: total,
    saudiCount,
    expatCount,
    saudizationRate: rate,
    nitaqatBand,
    bandColor
  };
}

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDocumentExpiryAlerts,
  getSaudizationMetrics
};
