// server/modules/loans.js - Employee Loans & Advances Management with Excel Import/Export & Payroll Integration
const { query, get, run } = require('../database/db');
const xlsx = require('xlsx');

function getAllLoans(filters = {}) {
  let sql = `
    SELECT l.*,
           e.emp_code, e.full_name_ar, e.job_title_ar, e.national_id,
           d.name_ar AS department_name, b.name_ar AS branch_name
    FROM loans l
    JOIN employees e ON l.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.emp_id) {
    sql += ` AND l.emp_id = ?`;
    params.push(filters.emp_id);
  }

  if (filters.status) {
    sql += ` AND l.status = ?`;
    params.push(filters.status);
  }

  if (filters.search) {
    sql += ` AND (l.loan_no LIKE ? OR e.full_name_ar LIKE ? OR e.emp_code LIKE ? OR l.reason LIKE ?)`;
    const term = `%${filters.search}%`;
    params.push(term, term, term, term);
  }

  sql += ` ORDER BY l.id DESC`;
  return query(sql, params);
}

function getLoanById(id) {
  const sql = `
    SELECT l.*,
           e.emp_code, e.full_name_ar, e.job_title_ar, e.national_id,
           d.name_ar AS department_name, b.name_ar AS branch_name
    FROM loans l
    JOIN employees e ON l.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    WHERE l.id = ?
  `;
  return get(sql, [id]);
}

function createLoan(data) {
  const {
    emp_id,
    loan_type = 'سلفة شخصية',
    total_amount,
    installments_count = 1,
    start_month,
    reason = '',
    approved_by = 'إدارة الموارد البشرية'
  } = data;

  if (!emp_id || !total_amount || !start_month) {
    throw new Error('بيانات السلفة غير مكتملة (الموظف، المبلغ الإجمالي، شهر بدء الخصم)');
  }

  const emp = get('SELECT id, emp_code, full_name_ar FROM employees WHERE id = ?', [emp_id]);
  if (!emp) throw new Error('الموظف غير موجود');

  const total = Number(total_amount);
  const count = Math.max(1, Number(installments_count) || 1);
  const monthly = Math.round((total / count) * 100) / 100;

  const year = new Date().getFullYear();
  const countRow = get('SELECT COUNT(*) AS total FROM loans');
  const seq = String((countRow.total || 0) + 1).padStart(4, '0');
  const loan_no = `LOAN-${year}-${seq}`;

  const sql = `
    INSERT INTO loans (
      loan_no, emp_id, emp_code, emp_name, loan_type, total_amount,
      installments_count, monthly_installment, paid_amount, remaining_amount,
      start_month, reason, status, approved_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, 'نشطة', ?, datetime('now'))
  `;

  const result = run(sql, [
    loan_no,
    emp.id,
    emp.emp_code,
    emp.full_name_ar,
    loan_type,
    total,
    count,
    monthly,
    total,
    start_month,
    reason,
    approved_by
  ]);

  return getLoanById(result.lastInsertRowid);
}

function exportLoansToExcel() {
  const loans = getAllLoans();
  const rows = loans.map((l, i) => ({
    'م': i + 1,
    'رقم السلفة': l.loan_no,
    'الرقم الوظيفي': l.emp_code,
    'اسم الموظف': l.emp_name,
    'الإدارة': l.department_name || '',
    'نوع السلفة': l.loan_type,
    'المبلغ الإجمالي': l.total_amount,
    'عدد الأقساط': l.installments_count,
    'القسط الشهري': l.monthly_installment,
    'المسدد': l.paid_amount,
    'المتبقي': l.remaining_amount,
    'شهر البدء': l.start_month,
    'الحالة': l.status,
    'السبب': l.reason || '',
    'تاريخ الإنشاء': l.created_at
  }));

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(rows);
  ws['!views'] = [{ rightToLeft: true }];
  xlsx.utils.book_append_sheet(wb, ws, 'سجل_السلف');
  return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

function generateLoanTemplateExcel() {
  const sample = [
    {
      'الرقم الوظيفي': 'JM-1025',
      'اسم الموظف': 'اسم الموظف',
      'نوع السلفة': 'سلفة شخصية',
      'المبلغ الإجمالي': 3000,
      'عدد الأقساط': 3,
      'شهر بدء الخصم': '2026-11',
      'سبب السلفة': 'ظرف عائلي طارئ'
    }
  ];
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(sample);
  ws['!views'] = [{ rightToLeft: true }];
  xlsx.utils.book_append_sheet(wb, ws, 'نموذج_استيراد_السلف');
  return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

function importLoansFromExcel(buffer) {
  const wb = xlsx.read(buffer, { type: 'buffer' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(ws);

  let imported = 0;
  for (const row of data) {
    const code = String(row['الرقم الوظيفي'] || '').trim();
    const name = String(row['اسم الموظف'] || row['الاسم الكامل'] || '').trim();
    if (!code && !name) continue;

    let emp = null;
    if (code) emp = get('SELECT * FROM employees WHERE emp_code = ?', [code]);
    if (!emp && name) emp = get('SELECT * FROM employees WHERE full_name_ar = ?', [name]);
    if (!emp) continue;

    const total = Number(row['المبلغ الإجمالي'] || row['مبلغ السلفة']) || 0;
    if (total <= 0) continue;

    const count = Math.max(1, Number(row['عدد الأقساط']) || 1);
    const monthly = Math.round((total / count) * 100) / 100;
    const startMonth = String(row['شهر بدء الخصم'] || row['شهر البدء'] || '2026-11').trim();
    const reason = String(row['سبب السلفة'] || row['السبب'] || 'استيراد من إكسل').trim();
    const loanType = String(row['نوع السلفة'] || 'سلفة شخصية').trim();

    const year = new Date().getFullYear();
    const countRow = get('SELECT COUNT(*) AS total FROM loans');
    const seq = String((countRow.total || 0) + 1).padStart(4, '0');
    const loan_no = `LOAN-${year}-${seq}`;

    run(`
      INSERT INTO loans (
        loan_no, emp_id, emp_code, emp_name, loan_type, total_amount,
        installments_count, monthly_installment, paid_amount, remaining_amount,
        start_month, reason, status, approved_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, 'نشطة', 'إدارة الموارد البشرية', datetime('now'))
    `, [loan_no, emp.id, emp.emp_code, emp.full_name_ar, loanType, total, count, monthly, total, startMonth, reason]);

    imported++;
  }

  return { success: true, count: imported };
}

function getLoansKPIs() {
  const totalAmount = get('SELECT COALESCE(SUM(total_amount), 0) AS s FROM loans').s || 0;
  const paidAmount = get('SELECT COALESCE(SUM(paid_amount), 0) AS s FROM loans').s || 0;
  const remainingAmount = get('SELECT COALESCE(SUM(remaining_amount), 0) AS s FROM loans WHERE status = "نشطة"').s || 0;
  const activeCount = get('SELECT COUNT(*) AS c FROM loans WHERE status = "نشطة"').c || 0;
  return { totalAmount, paidAmount, remainingAmount, activeCount };
}

/**
 * Monthly Payroll Advance Deduction Integration
 * Returns active monthly installment deduction for the employee in that payroll month
 */
function getEmployeeMonthlyLoanDeduction(empId, periodMonth) {
  const activeLoan = get(`
    SELECT * FROM loans
    WHERE emp_id = ? AND status = 'نشطة' AND start_month <= ? AND remaining_amount > 0
    ORDER BY id ASC LIMIT 1
  `, [empId, periodMonth]);

  if (!activeLoan) return 0;
  return Math.min(activeLoan.monthly_installment, activeLoan.remaining_amount);
}

/**
 * Apply loan deduction when payroll period is approved
 */
function applyLoanDeduction(empId, periodMonth, deductedAmount) {
  if (deductedAmount <= 0) return;
  const activeLoan = get(`
    SELECT * FROM loans
    WHERE emp_id = ? AND status = 'نشطة' AND start_month <= ? AND remaining_amount > 0
    ORDER BY id ASC LIMIT 1
  `, [empId, periodMonth]);

  if (!activeLoan) return;

  const newPaid = Math.round((activeLoan.paid_amount + deductedAmount) * 100) / 100;
  const newRemaining = Math.max(0, Math.round((activeLoan.remaining_amount - deductedAmount) * 100) / 100);
  const newStatus = newRemaining <= 0 ? 'مسددة بالكامل' : 'نشطة';

  run(`
    UPDATE loans
    SET paid_amount = ?,
        remaining_amount = ?,
        status = ?
    WHERE id = ?
  `, [newPaid, newRemaining, newStatus, activeLoan.id]);
}

module.exports = {
  getAllLoans,
  getLoanById,
  createLoan,
  exportLoansToExcel,
  generateLoanTemplateExcel,
  importLoansFromExcel,
  getLoansKPIs,
  getEmployeeMonthlyLoanDeduction,
  applyLoanDeduction
};
