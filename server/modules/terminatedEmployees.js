// server/modules/terminatedEmployees.js - Terminated Employees Management, Gratuity Calculator & Excel Import/Export
const { query, get, run } = require('../database/db');
const xlsx = require('xlsx');

function getAllTerminated(filters = {}) {
  let sql = `
    SELECT t.*
    FROM terminated_employees t
    WHERE 1=1
  `;
  const params = [];

  if (filters.termination_type) {
    sql += ` AND t.termination_type = ?`;
    params.push(filters.termination_type);
  }

  if (filters.clearance_status) {
    sql += ` AND t.clearance_status = ?`;
    params.push(filters.clearance_status);
  }

  if (filters.qiwa_status) {
    sql += ` AND t.qiwa_status = ?`;
    params.push(filters.qiwa_status);
  }

  if (filters.search) {
    sql += ` AND (t.emp_code LIKE ? OR t.full_name_ar LIKE ? OR t.national_id LIKE ? OR t.department_name LIKE ?)`;
    const term = `%${filters.search}%`;
    params.push(term, term, term, term);
  }

  sql += ` ORDER BY t.termination_date DESC, t.id DESC`;
  return query(sql, params);
}

function getTerminatedById(id) {
  return get('SELECT * FROM terminated_employees WHERE id = ?', [id]);
}

/**
 * Gratuity Calculation Engine based on Saudi Labor Law Articles 84 & 85
 */
function calculateSettlement(data) {
  const {
    emp_id,
    termination_date,
    termination_type = 'استقالة',
    deductions_amount = 0
  } = data;

  const emp = get(`
    SELECT e.*, d.name_ar AS department_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE e.id = ?
  `, [emp_id]);

  if (!emp) throw new Error('الموظف غير موجود');

  const termDate = termination_date ? new Date(termination_date) : new Date();
  const joinDate = emp.join_date ? new Date(emp.join_date) : new Date();

  // Calculate service years precisely
  const diffTime = Math.max(0, termDate.getTime() - joinDate.getTime());
  const serviceYears = Math.round((diffTime / (1000 * 60 * 60 * 24 * 365.25)) * 100) / 100;

  const grossSalary = emp.basic_salary + emp.housing_allowance + emp.transport_allowance + emp.other_allowance;
  const lastSalary = grossSalary > 0 ? grossSalary : (emp.basic_salary || 0);

  // Article 84 Standard Gratuity Base (نصف شهر عن كل سنة من الـ 5 الأولى + شهر عن كل سنة تالية)
  let baseGratuity = 0;
  if (serviceYears <= 5) {
    baseGratuity = serviceYears * (lastSalary * 0.5);
  } else {
    baseGratuity = (5 * (lastSalary * 0.5)) + ((serviceYears - 5) * lastSalary);
  }

  let finalGratuity = 0;

  if (termination_type.includes('مادة 80') || termination_type.includes('المادة 80') || termination_type.includes('فسخ بموجب')) {
    // Article 80: Forfeiture of end of service reward
    finalGratuity = 0;
  } else if (termination_type.includes('استقالة') || termination_type.includes('طلب العامل')) {
    // Article 85 (Resignation rules):
    if (serviceYears < 2) {
      finalGratuity = 0;
    } else if (serviceYears < 5) {
      finalGratuity = baseGratuity * (1 / 3);
    } else if (serviceYears < 10) {
      finalGratuity = baseGratuity * (2 / 3);
    } else {
      finalGratuity = baseGratuity;
    }
  } else {
    // Article 84 (Contract end, termination by employer, retirement, force majeure)
    finalGratuity = baseGratuity;
  }

  finalGratuity = Math.round(finalGratuity * 100) / 100;

  // Leave balance compensation (رصيد الإجازات المستحق مضروباً في الأجر اليومي)
  const leaveDays = Number(emp.annual_leave_balance) || 0;
  const dailyWage = lastSalary / 30.0;
  const leaveCompensation = Math.max(0, Math.round(leaveDays * dailyWage * 100) / 100);

  const deductions = Math.max(0, Number(deductions_amount) || 0);
  const totalSettlement = Math.max(0, Math.round((finalGratuity + leaveCompensation - deductions) * 100) / 100);

  return {
    employee: {
      id: emp.id,
      emp_code: emp.emp_code,
      full_name_ar: emp.full_name_ar,
      national_id: emp.national_id,
      nationality: emp.nationality,
      job_title_ar: emp.job_title_ar,
      department_name: emp.department_name,
      join_date: emp.join_date,
      basic_salary: emp.basic_salary,
      last_salary: lastSalary,
      leave_balance: leaveDays
    },
    termination_date: termDate.toISOString().split('T')[0],
    termination_type,
    service_years: serviceYears,
    base_gratuity: Math.round(baseGratuity * 100) / 100,
    end_of_service_reward: finalGratuity,
    leave_compensation: leaveCompensation,
    deductions_amount: deductions,
    total_settlement: totalSettlement
  };
}

function recordTermination(data) {
  const {
    emp_id,
    termination_date,
    termination_type = 'استقالة',
    termination_reason = '',
    clearance_status = 'قيد إجراءات إخلاء الطرف',
    qiwa_status = 'بانتظار الإسقاط من قوى',
    notes = '',
    deductions_amount = 0
  } = data;

  const calc = calculateSettlement({ emp_id, termination_date, termination_type, deductions_amount });
  const emp = calc.employee;

  const sql = `
    INSERT INTO terminated_employees (
      emp_id, emp_code, full_name_ar, national_id, nationality,
      department_name, job_title_ar, join_date, termination_date,
      termination_type, termination_reason, service_years, last_salary,
      end_of_service_reward, leave_compensation, deductions_amount,
      total_settlement, clearance_status, qiwa_status, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `;

  const result = run(sql, [
    emp.id,
    emp.emp_code || '',
    emp.full_name_ar || '',
    emp.national_id || '',
    emp.nationality || '',
    emp.department_name || '',
    emp.job_title_ar || '',
    emp.join_date || '',
    calc.termination_date || '',
    termination_type || '',
    termination_reason || '',
    calc.service_years || 0,
    calc.employee.last_salary || 0,
    calc.end_of_service_reward || 0,
    calc.leave_compensation || 0,
    calc.deductions_amount || 0,
    calc.total_settlement || 0,
    clearance_status || '',
    qiwa_status || '',
    notes || ''
  ]);

  // Update employee status to 'منهي خدماته'
  run("UPDATE employees SET status = 'منهي خدماته' WHERE id = ?", [emp.id]);

  return getTerminatedById(result.lastInsertRowid);
}

function exportToExcel() {
  const records = getAllTerminated();
  const rows = records.map((r, i) => ({
    'م': i + 1,
    'الرقم الوظيفي': r.emp_code,
    'الاسم الكامل': r.full_name_ar,
    'الهوية / الإقامة': r.national_id || '',
    'الجنسية': r.nationality,
    'الإدارة': r.department_name || '',
    'المسمى الوظيفي': r.job_title_ar,
    'تاريخ التعيين': r.join_date || '',
    'تاريخ إنهاء الخدمة': r.termination_date,
    'نوع الإنهاء': r.termination_type,
    'سنوات الخدمة': r.service_years,
    'آخر راتب': r.last_salary,
    'مكافأة نهاية الخدمة': r.end_of_service_reward,
    'تعويض رصيد الإجازات': r.leave_compensation,
    'الخصومات': r.deductions_amount,
    'صافي المستحقات': r.total_settlement,
    'حالة إخلاء الطرف': r.clearance_status,
    'حالة منصة قوى': r.qiwa_status,
    'ملاحظات': r.notes || ''
  }));

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(rows);
  ws['!views'] = [{ rightToLeft: true }];
  xlsx.utils.book_append_sheet(wb, ws, 'الموظفون المنهي خدماتهم');
  return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

function generateTemplateExcel() {
  const sample = [
    {
      'الرقم الوظيفي': 'JM-1050',
      'الاسم الكامل': 'اسم الموظف التجريبي',
      'الهوية / الإقامة': '1088990011',
      'الجنسية': 'سعودي',
      'الإدارة': 'إدارة المبيعات',
      'المسمى الوظيفي': 'بائع',
      'تاريخ التعيين': '2022-01-01',
      'تاريخ إنهاء الخدمة': '2026-10-01',
      'نوع الإنهاء': 'استقالة',
      'سبب الإنهاء': 'ظروف شخصية',
      'مكافأة نهاية الخدمة': 5000,
      'تعويض رصيد الإجازات': 1200,
      'الخصومات': 0,
      'صافي المستحقات': 6200,
      'حالة إخلاء الطرف': 'مكتمل',
      'حالة منصة قوى': 'تم الإسقاط',
      'ملاحظات': 'تم تسليم كافة العهد'
    }
  ];
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(sample);
  ws['!views'] = [{ rightToLeft: true }];
  xlsx.utils.book_append_sheet(wb, ws, 'نموذج_استيراد_المنهي_خدماتهم');
  return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

function importFromExcel(buffer) {
  const wb = xlsx.read(buffer, { type: 'buffer' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(ws);

  let imported = 0;
  for (const row of data) {
    const code = String(row['الرقم الوظيفي'] || '').trim();
    const name = String(row['الاسم الكامل'] || row['اسم الموظف'] || '').trim();
    if (!name && !code) continue;

    // Find employee by code or national_id or name
    let emp = null;
    if (code) emp = get('SELECT * FROM employees WHERE emp_code = ?', [code]);
    if (!emp && row['الهوية / الإقامة']) {
      emp = get('SELECT * FROM employees WHERE national_id = ?', [String(row['الهوية / الإقامة']).trim()]);
    }
    if (!emp && name) {
      emp = get('SELECT * FROM employees WHERE full_name_ar = ?', [name]);
    }

    const termDate = row['تاريخ إنهاء الخدمة'] || new Date().toISOString().split('T')[0];
    const termType = row['نوع الإنهاء'] || 'استقالة';
    const reward = Number(row['مكافأة نهاية الخدمة']) || 0;
    const leaveComp = Number(row['تعويض رصيد الإجازات']) || 0;
    const deduct = Number(row['الخصومات']) || 0;
    const total = Number(row['صافي المستحقات']) || (reward + leaveComp - deduct);

    run(`
      INSERT INTO terminated_employees (
        emp_id, emp_code, full_name_ar, national_id, nationality,
        department_name, job_title_ar, join_date, termination_date,
        termination_type, termination_reason, service_years, last_salary,
        end_of_service_reward, leave_compensation, deductions_amount,
        total_settlement, clearance_status, qiwa_status, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `, [
      emp ? emp.id : null,
      code || (emp ? emp.emp_code : 'JM-TERM'),
      name || (emp ? emp.full_name_ar : 'موظف'),
      row['الهوية / الإقامة'] || (emp ? emp.national_id : ''),
      row['الجنسية'] || (emp ? emp.nationality : 'سعودي'),
      row['الإدارة'] || (emp ? emp.department_name : ''),
      row['المسمى الوظيفي'] || (emp ? emp.job_title_ar : ''),
      row['تاريخ التعيين'] || (emp ? emp.join_date : ''),
      termDate,
      termType,
      row['سبب الإنهاء'] || '',
      Number(row['سنوات الخدمة']) || 0,
      Number(row['آخر راتب']) || (emp ? emp.basic_salary : 0),
      reward,
      leaveComp,
      deduct,
      total,
      row['حالة إخلاء الطرف'] || 'مكتمل',
      row['حالة منصة قوى'] || 'تم الإسقاط',
      row['ملاحظات'] || ''
    ]);

    if (emp) {
      run("UPDATE employees SET status = 'منهي خدماته' WHERE id = ?", [emp.id]);
    }
    imported++;
  }

  return { success: true, count: imported };
}

function getTerminatedKPIs() {
  const total = get('SELECT COUNT(*) AS c FROM terminated_employees').c || 0;
  const resignations = get("SELECT COUNT(*) AS c FROM terminated_employees WHERE termination_type LIKE '%استقالة%'").c || 0;
  const contracts = get("SELECT COUNT(*) AS c FROM terminated_employees WHERE termination_type LIKE '%عقد%' OR termination_type LIKE '%إنهاء%'").c || 0;
  const pendingClearance = get("SELECT COUNT(*) AS c FROM terminated_employees WHERE clearance_status != 'مكتمل'").c || 0;
  const totalSettlements = get('SELECT COALESCE(SUM(total_settlement), 0) AS s FROM terminated_employees').s || 0;
  return { total, resignations, contracts, pendingClearance, totalSettlements };
}

module.exports = {
  getAllTerminated,
  getTerminatedById,
  calculateSettlement,
  recordTermination,
  exportToExcel,
  generateTemplateExcel,
  importFromExcel,
  getTerminatedKPIs
};
