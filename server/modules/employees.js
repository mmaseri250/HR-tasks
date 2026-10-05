// server/modules/employees.js
const { query, get, run } = require('../database/db');

function getAllEmployees(filters = {}) {
  let sql = `
    SELECT e.*, d.name_ar AS department_name_ar, d.name_en AS department_name_en,
           b.name_ar AS branch_name_ar,
           m.full_name_ar AS manager_name_ar
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    LEFT JOIN employees m ON e.manager_id = m.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.department_id) {
    sql += ` AND e.department_id = ?`;
    params.push(filters.department_id);
  }

  if (filters.branch_id) {
    sql += ` AND e.branch_id = ?`;
    params.push(filters.branch_id);
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
           b.name_ar AS branch_name_ar,
           m.full_name_ar AS manager_name_ar
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
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
      is_saudi, gender, birth_date, email, phone, department_id, branch_id,
      job_title_ar, job_title_en, grade_level, manager_id, policy_id, contract_type,
      join_date, contract_start, contract_end, iqama_expiry, passport_expiry,
      insurance_expiry, basic_salary, housing_allowance, transport_allowance,
      other_allowance, gosi_number, bank_name, bank_code, iban,
      annual_leave_balance, shift_type, status, role
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    data.branch_id ? Number(data.branch_id) : null,
    data.job_title_ar || 'موظف',
    data.job_title_en || 'Employee',
    data.grade_level || 'P-1',
    data.manager_id ? Number(data.manager_id) : null,
    data.policy_id ? Number(data.policy_id) : null,
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
      is_saudi = ?, gender = ?, birth_date = ?, email = ?, phone = ?, department_id = ?, branch_id = ?,
      job_title_ar = ?, job_title_en = ?, grade_level = ?, manager_id = ?, policy_id = ?, contract_type = ?,
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
    data.branch_id !== undefined ? (data.branch_id ? Number(data.branch_id) : null) : existing.branch_id,
    data.job_title_ar !== undefined ? data.job_title_ar : existing.job_title_ar,
    data.job_title_en !== undefined ? data.job_title_en : existing.job_title_en,
    data.grade_level !== undefined ? data.grade_level : existing.grade_level,
    data.manager_id !== undefined ? (data.manager_id ? Number(data.manager_id) : null) : existing.manager_id,
    data.policy_id !== undefined ? (data.policy_id ? Number(data.policy_id) : null) : existing.policy_id,
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

function getComplianceMetrics() {
  const now = new Date();
  const emps = query(`
    SELECT e.*, d.name_ar as department_name, b.name_ar as branch_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    WHERE e.status = 'نشط'
    ORDER BY e.id ASC
  `);

  const total = emps.length;
  const saudiCount = emps.filter(e => e.is_saudi === 1).length;
  const expatCount = total - saudiCount;
  const saudizationRate = total > 0 ? Math.round((saudiCount / total) * 1000) / 10 : 0;

  let totalIqamas = 0;
  let validIqamas = 0;
  let expiringSoonIqamas = 0;
  let expiredIqamas = 0;

  const complianceRoster = emps.map(emp => {
    let daysRemaining = null;
    let iqamaStatus = 'سارية وممتثلة';
    let statusClass = 'success';
    let workPermitStatus = 'سارية - منصة قوى';
    let workPermitCost = 0;
    let actionRequired = 'لا يتطلب إجراء';

    if (emp.is_saudi === 0) {
      totalIqamas++;
      if (emp.iqama_expiry) {
        const expDate = new Date(emp.iqama_expiry);
        daysRemaining = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysRemaining < 0) {
          expiredIqamas++;
          iqamaStatus = 'منتهية - غرامة تأخير';
          statusClass = 'danger';
          workPermitStatus = 'منتهية - تتطلب تجديد فوري';
          workPermitCost = 9600;
          actionRequired = 'تجديد عاجل عبر منصة مقيم وقوى';
        } else if (daysRemaining <= 60) {
          expiringSoonIqamas++;
          iqamaStatus = `تشارف على الانتهاء (${daysRemaining} يوم)`;
          statusClass = 'warning';
          workPermitStatus = 'تتطلب سداد المقابل المالي بقوى';
          workPermitCost = 9600;
          actionRequired = 'سداد المقابل المالي وتجديد الإقامة';
        } else {
          validIqamas++;
          iqamaStatus = `سارية وممتثلة (${daysRemaining} يوم)`;
          statusClass = 'success';
          workPermitStatus = 'سارية ومسددة بالكامل';
          actionRequired = 'ممتثل نظامياً';
        }
      }
    } else {
      // Saudi Citizen
      iqamaStatus = 'مواطن سعودي (هوية وطنية)';
      statusClass = 'saudi';
      workPermitStatus = 'معفى (توطين)';
      actionRequired = 'ممتثل - مسجل بالتأمينات';
    }

    return {
      id: emp.id,
      emp_code: emp.emp_code,
      full_name_ar: emp.full_name_ar,
      national_id: emp.national_id,
      nationality: emp.nationality,
      is_saudi: emp.is_saudi,
      job_title_ar: emp.job_title_ar,
      department_name: emp.department_name || 'عام',
      branch_name: emp.branch_name || 'الفرع الرئيسي',
      contract_end: emp.contract_end,
      iqama_expiry: emp.iqama_expiry,
      days_remaining: daysRemaining,
      iqama_status: iqamaStatus,
      status_class: statusClass,
      work_permit_status: workPermitStatus,
      work_permit_cost: workPermitCost,
      contract_authenticated: 1,
      gosi_registered: 1,
      action_required: actionRequired
    };
  });

  // Urgency sort: non-saudi expiring soon first
  complianceRoster.sort((a, b) => {
    if (a.is_saudi !== b.is_saudi) return a.is_saudi - b.is_saudi;
    if (a.days_remaining !== null && b.days_remaining !== null) return a.days_remaining - b.days_remaining;
    return 0;
  });

  const iqamaComplianceRate = totalIqamas > 0 ? Math.round(((totalIqamas - expiredIqamas) / totalIqamas) * 1000) / 10 : 100;
  const workPermitsComplianceRate = 100;
  const contractsComplianceRate = 100;
  const wpsComplianceRate = 100;
  const gosiComplianceRate = 100;

  const overallScore = Math.round(
    (iqamaComplianceRate * 0.35) +
    (workPermitsComplianceRate * 0.25) +
    (contractsComplianceRate * 0.15) +
    (wpsComplianceRate * 0.15) +
    (gosiComplianceRate * 0.10)
  );

  return {
    overallScore,
    overallStatus: overallScore >= 90 ? 'ممتثل بالكامل (نطاق أخضر مرتفع)' : 'يحتاج إلى متابعة',
    metrics: {
      totalEmployees: total,
      saudiCount,
      expatCount,
      saudizationRate,
      nitaqatBand: saudizationRate >= 30 ? 'النطاق البلاتيني' : 'النطاق الأخضر المرتفع',
      iqama: {
        total: totalIqamas,
        valid: validIqamas,
        expiringSoon: expiringSoonIqamas,
        expired: expiredIqamas,
        complianceRate: iqamaComplianceRate
      },
      workPermits: {
        total: totalIqamas,
        active: totalIqamas - expiredIqamas,
        pendingPayment: expiringSoonIqamas,
        feeAnnualPerWorker: 9600,
        complianceRate: workPermitsComplianceRate
      },
      contracts: {
        total,
        authenticated: total,
        complianceRate: contractsComplianceRate
      },
      wps: {
        complianceRate: wpsComplianceRate,
        status: 'ممتثل لنظام حماية الأجور (منصة مدد)'
      },
      gosi: {
        complianceRate: gosiComplianceRate,
        status: 'ممتثل للتأمينات الاجتماعية'
      }
    },
    roster: complianceRoster
  };
}

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDocumentExpiryAlerts,
  getSaudizationMetrics,
  getComplianceMetrics
};
