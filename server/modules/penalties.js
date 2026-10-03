// server/modules/penalties.js
const { query, get, run } = require('../database/db');

function getAllPenaltyRegulations(category) {
  let sql = 'SELECT * FROM penalty_regulations WHERE 1=1';
  const params = [];
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  sql += ' ORDER BY id ASC';
  return query(sql, params);
}

function getRegulationByCode(code) {
  return get('SELECT * FROM penalty_regulations WHERE code = ?', [code]);
}

function getAllIssuedPenalties(filters = {}) {
  let sql = `
    SELECT p.*, e.emp_code, e.full_name_ar, e.job_title_ar, e.national_id, d.name_ar AS department_name
    FROM penalties_issued p
    JOIN employees e ON p.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.emp_id) {
    sql += ' AND p.emp_id = ?';
    params.push(filters.emp_id);
  }

  if (filters.category) {
    sql += ' AND p.category = ?';
    params.push(filters.category);
  }

  if (filters.search) {
    sql += ' AND (e.full_name_ar LIKE ? OR e.emp_code LIKE ? OR p.decision_no LIKE ? OR p.violation_text LIKE ?)';
    const searchPattern = `%${filters.search}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }

  sql += ' ORDER BY p.id DESC';
  return query(sql, params);
}

function getIssuedPenaltyById(id) {
  const sql = `
    SELECT p.*, e.emp_code, e.full_name_ar, e.full_name_en, e.job_title_ar,
           e.national_id, e.nationality, e.basic_salary, d.name_ar AS department_name
    FROM penalties_issued p
    JOIN employees e ON p.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE p.id = ?
  `;
  return get(sql, [id]);
}

function issuePenaltyDecision(data) {
  const {
    emp_id,
    violation_code,
    repetition_level = 'المرة الأولى',
    incident_date,
    investigation_details,
    issued_by = 'إدارة الموارد البشرية'
  } = data;

  if (!emp_id || !violation_code || !incident_date) {
    throw new Error('يرجى اختيار الموظف وبند المخالفة وتاريخ الواقعة');
  }

  const emp = get('SELECT id, emp_code, full_name_ar, basic_salary FROM employees WHERE id = ?', [emp_id]);
  if (!emp) throw new Error('الموظف غير موجود');

  const reg = getRegulationByCode(violation_code);
  if (!reg) throw new Error('كود المخالفة غير صحيح');

  // Determine exact penalty text from regulation based on repetition
  let penaltyText = reg.penalty_1st;
  let deductionDays = 0;
  let deductionType = 'إنذار كتابي';

  if (repetition_level === 'المرة الثانية') {
    penaltyText = reg.penalty_2nd;
  } else if (repetition_level === 'المرة الثالثة') {
    penaltyText = reg.penalty_3rd;
  } else if (repetition_level === 'المرة الرابعة') {
    penaltyText = reg.penalty_4th;
  }

  if (penaltyText.includes('خصم') || penaltyText.includes('يوم') || penaltyText.includes('نصف')) {
    deductionType = 'خصم راتب';
    if (penaltyText.includes('نصف')) deductionDays = 0.5;
    else if (penaltyText.includes('ثلاثة أيام')) deductionDays = 3;
    else if (penaltyText.includes('يومان') || penaltyText.includes('يومين')) deductionDays = 2;
    else if (penaltyText.includes('يوم كامل') || penaltyText.includes('يوم')) deductionDays = 1;
    else if (penaltyText.includes('خمسة أيام')) deductionDays = 5;
    else if (penaltyText.includes('25%')) deductionDays = 0.25;
    else if (penaltyText.includes('50%')) deductionDays = 0.5;
    else if (penaltyText.includes('10%')) deductionDays = 0.1;
    else if (penaltyText.includes('15%')) deductionDays = 0.15;
    else if (penaltyText.includes('5%')) deductionDays = 0.05;
  } else if (penaltyText.includes('فصل')) {
    deductionType = 'فصل من الخدمة';
  }

  // Generate decision number DEC-YYYY-XXXX
  const year = new Date().getFullYear();
  const countRow = get('SELECT COUNT(*) AS total FROM penalties_issued');
  const seq = String((countRow.total || 0) + 1).padStart(4, '0');
  const decision_no = `DEC-${year}-${seq}`;

  const sql = `
    INSERT INTO penalties_issued (
      decision_no, emp_id, violation_code, violation_text, category,
      repetition_level, penalty_text, deduction_type, deduction_days,
      incident_date, investigation_details, status, issued_by, issued_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'معتمد ومطبق', ?, datetime('now'))
  `;

  const result = run(sql, [
    decision_no, emp_id, reg.code, reg.violation_text, reg.category,
    repetition_level, penaltyText, deductionType, deductionDays,
    incident_date, investigation_details || 'تم استجواب الموظف وتطبيق العقوبة وفق جدول الجزاءات المعتمد',
    issued_by
  ]);

  return getIssuedPenaltyById(result.lastInsertRowid);
}

// Generate Printable Penalty Action Form
function generatePenaltyFormPrintData(id) {
  const decision = getIssuedPenaltyById(id);
  if (!decision) throw new Error('القرار الجزائي غير موجود');

  const settings = get('SELECT * FROM company_settings WHERE id = 1') || {};

  return {
    company: settings,
    decision
  };
}

module.exports = {
  getAllPenaltyRegulations,
  getRegulationByCode,
  getAllIssuedPenalties,
  getIssuedPenaltyById,
  issuePenaltyDecision,
  generatePenaltyFormPrintData
};
