// server/modules/payroll.js
const { query, get, run } = require('../database/db');

function calculateMonthlyPayroll(periodMonth) {
  // periodMonth format: 'YYYY-MM' e.g. '2026-09'
  const employees = query(`SELECT * FROM employees WHERE status = 'نشط' ORDER BY id ASC`);
  const settings = get(`SELECT * FROM company_settings WHERE id = 1`) || {};

  // Check if period already exists
  let period = get(`SELECT * FROM payroll_periods WHERE period_month = ?`, [periodMonth]);

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const [year, monthNum] = periodMonth.split('-');
  const monthNameAr = monthNames[parseInt(monthNum, 10) - 1] || periodMonth;
  const periodNameAr = `مسير رواتب شهر ${monthNameAr} ${year}م`;

  if (!period) {
    const result = run(`
      INSERT INTO payroll_periods (
        period_month, period_name_ar, status, created_at
      ) VALUES (?, ?, 'مسودة', datetime('now'))
    `, [periodMonth, periodNameAr]);
    period = get(`SELECT * FROM payroll_periods WHERE id = ?`, [result.lastInsertRowid]);
  } else if (period.status === 'مدفوع') {
    throw new Error('لا يمكن إعادة احتساب مسير رواتب تم اعتماده وصرفه مسبقاً');
  } else {
    // Clear existing draft items for this period
    run(`DELETE FROM payroll_items WHERE payroll_period_id = ?`, [period.id]);
  }

  let totalBasic = 0;
  let totalHousing = 0;
  let totalTransport = 0;
  let totalAllowances = 0;
  let totalOvertime = 0;
  let totalGross = 0;
  let totalGosiEmp = 0;
  let totalGosiComp = 0;
  let totalDeductions = 0;
  let totalNet = 0;

  for (const emp of employees) {
    const basic = Number(emp.basic_salary) || 0;
    const housing = Number(emp.housing_allowance) || 0;
    const transport = Number(emp.transport_allowance) || 0;
    const other = Number(emp.other_allowance) || 0;

    // Fetch attendance summary stats for this month
    const attStats = get(`
      SELECT
        COALESCE(SUM(overtime_hours), 0) AS total_ot_hours,
        COALESCE(SUM(delay_minutes), 0) AS total_delay_min,
        COALESCE(SUM(CASE WHEN status = 'غائب' THEN 1 ELSE 0 END), 0) AS absence_days
      FROM attendance_daily_summary
      WHERE emp_id = ? AND date LIKE ?
    `, [emp.id, `${periodMonth}%`]);

    const otHours = attStats ? Number(attStats.total_ot_hours) : 0;
    const delayMin = attStats ? Number(attStats.total_delay_min) : 0;
    const absenceDays = attStats ? Number(attStats.absence_days) : 0;

    // Overtime: Saudi Labor Law Article 107
    // Overtime Hourly Rate = (Basic Salary / 240) * 1.5
    const hourlyRate = basic / 240;
    const overtimePay = Math.round(hourlyRate * otHours * 1.5 * 100) / 100;

    const bonusPay = 0;
    const gross = basic + housing + transport + other + overtimePay + bonusPay;

    // GOSI Calculation
    // Subject to GOSI: Basic + Housing up to ceiling 45,000 SAR
    const gosiContributoryWage = Math.min(basic + housing, 45000);
    let gosiEmp = 0;
    let gosiComp = 0;

    if (emp.is_saudi === 1) {
      // Saudi: 9% pension + 0.75% Saned unemployment insurance = 9.75%
      gosiEmp = Math.round(gosiContributoryWage * 0.0975 * 100) / 100;
      // Employer: 9% pension + 0.75% Saned + 2% occupational hazards = 11.75%
      gosiComp = Math.round(gosiContributoryWage * 0.1175 * 100) / 100;
    } else {
      // Non-Saudi: 0% deducted from employee
      gosiEmp = 0;
      // Employer: 2% occupational hazards
      gosiComp = Math.round(gosiContributoryWage * 0.02 * 100) / 100;
    }

    // Deductions:
    // Daily rate for absence = Total Monthly Wage / 30
    const dailyWage = gross / 30;
    const absenceDeduction = Math.round(dailyWage * absenceDays * 100) / 100;

    // Delay penalty: if > 60 total minutes in month, deduct equivalent hours
    let delayDeduction = 0;
    if (delayMin > 60) {
      delayDeduction = Math.round((delayMin / 60) * hourlyRate * 100) / 100;
    }

    // Advances / Loans repayment
    let advanceDeduction = 0;
    const activeLoan = get(`
      SELECT id, amount FROM requests
      WHERE emp_id = ? AND request_type = 'سلفة مالية' AND status = 'معتمد نهائياً'
      LIMIT 1
    `, [emp.id]);
    if (activeLoan && activeLoan.amount > 0) {
      // Monthly installment e.g. 500 SAR
      advanceDeduction = Math.min(500, activeLoan.amount);
    }

    const otherDeduct = 0;
    const totalDeduct = Math.round((gosiEmp + absenceDeduction + delayDeduction + advanceDeduction + otherDeduct) * 100) / 100;
    const net = Math.round((gross - totalDeduct) * 100) / 100;

    run(`
      INSERT INTO payroll_items (
        payroll_period_id, emp_id, basic_salary, housing_allowance, transport_allowance,
        other_allowance, overtime_pay, bonus_pay, gross_salary, gosi_employee_share,
        gosi_company_share, absence_deduction, delay_deduction, advance_deduction,
        other_deductions, total_deductions, net_salary, payment_status, bank_name, bank_code, iban
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'جاهز للصرف', ?, ?, ?)
    `, [
      period.id, emp.id, basic, housing, transport, other, overtimePay, bonusPay, gross,
      gosiEmp, gosiComp, absenceDeduction, delayDeduction, advanceDeduction, otherDeduct,
      totalDeduct, net, emp.bank_name, emp.bank_code || 'RJHI', emp.iban
    ]);

    totalBasic += basic;
    totalHousing += housing;
    totalTransport += transport;
    totalAllowances += (other + bonusPay);
    totalOvertime += overtimePay;
    totalGross += gross;
    totalGosiEmp += gosiEmp;
    totalGosiComp += gosiComp;
    totalDeductions += totalDeduct;
    totalNet += net;
  }

  // Update Period Totals
  run(`
    UPDATE payroll_periods SET
      total_basic = ?,
      total_housing = ?,
      total_transport = ?,
      total_allowances = ?,
      total_overtime = ?,
      total_gross = ?,
      total_gosi_employee = ?,
      total_gosi_company = ?,
      total_deductions = ?,
      total_net = ?,
      employee_count = ?
    WHERE id = ?
  `, [
    totalBasic, totalHousing, totalTransport, totalAllowances, totalOvertime,
    totalGross, totalGosiEmp, totalGosiComp, totalDeductions, totalNet,
    employees.length, period.id
  ]);

  return getPayrollPeriodDetails(period.id);
}

function getPayrollPeriods() {
  return query(`SELECT * FROM payroll_periods ORDER BY period_month DESC`);
}

function getPayrollPeriodDetails(periodId) {
  const period = get(`SELECT * FROM payroll_periods WHERE id = ?`, [periodId]);
  if (!period) return null;

  const items = query(`
    SELECT pi.*, e.emp_code, e.full_name_ar, e.full_name_en, e.national_id, e.nationality,
           e.is_saudi, e.job_title_ar, d.name_ar AS department_name
    FROM payroll_items pi
    JOIN employees e ON pi.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE pi.payroll_period_id = ?
    ORDER BY e.id ASC
  `, [periodId]);

  return {
    period,
    items
  };
}

function approvePayrollPeriod(periodId, approverName) {
  const period = get(`SELECT * FROM payroll_periods WHERE id = ?`, [periodId]);
  if (!period) throw new Error('مسير الرواتب غير موجود');

  const wpsFileName = `WPS_JM_${period.period_month.replace('-', '')}_SIF.txt`;

  run(`
    UPDATE payroll_periods
    SET status = 'معتمد',
        approved_by = ?,
        approved_at = datetime('now'),
        wps_file_name = ?
    WHERE id = ?
  `, [approverName || 'خالد سعد الشهراني (مدير الموارد البشرية)', wpsFileName, periodId]);

  return getPayrollPeriodDetails(periodId);
}

function getEmployeePayslip(periodId, empId) {
  const settings = get(`SELECT * FROM company_settings WHERE id = 1`) || {};
  const period = get(`SELECT * FROM payroll_periods WHERE id = ?`, [periodId]);
  if (!period) throw new Error('مسير الرواتب غير موجود');

  const item = get(`
    SELECT pi.*, e.emp_code, e.full_name_ar, e.full_name_en, e.national_id, e.nationality,
           e.is_saudi, e.job_title_ar, e.job_title_en, e.join_date, e.gosi_number,
           d.name_ar AS department_name
    FROM payroll_items pi
    JOIN employees e ON pi.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE pi.payroll_period_id = ? AND pi.emp_id = ?
  `, [periodId, empId]);

  if (!item) throw new Error('قسيمة الراتب غير متوفرة لهذا الموظف');

  return {
    company: settings,
    period,
    payslip: item
  };
}

// Generate Wage Protection System (WPS / حماية الأجور) SIF Format File Content
function generateWpsSifContent(periodId) {
  const data = getPayrollPeriodDetails(periodId);
  if (!data) throw new Error('مسير الرواتب غير موجود');

  const settings = get(`SELECT * FROM company_settings WHERE id = 1`) || {};
  const { period, items } = data;

  const now = new Date();
  const fileDate = now.toISOString().split('T')[0].replace(/-/g, '');
  const fileTime = now.toTimeString().substring(0, 5).replace(':', '');
  const payerBank = settings.bank_code || 'RJHI';
  const employerCr = settings.cr_number || '7004872169';
  const employerEst = settings.wps_payer_id || `EST${employerCr}`;

  // Standard Header Record (SCR)
  // Format: SCR,Payer_CR,Payer_Bank,File_Creation_Date,File_Creation_Time,Company_Name,Payer_Account,Value_Date,Total_Salaries,Total_Records,Currency
  const valueDate = `${period.period_month.replace('-', '')}28`; // Typically 27th or 28th
  const header = `SCR,${employerCr},${payerBank},${fileDate},${fileTime},Jawharat Al-Majd Co,${settings.corporate_account || 'SA4480000392608010049283'},${valueDate},${period.total_net.toFixed(2)},${items.length},SAR`;

  // Employee Detail Records (EDR)
  // Format: EDR,Bank_Code,IBAN,Employee_Name,National_ID/Iqama,Basic_Salary,Housing_Allowance,Other_Earnings,Deductions,Net_Salary,Reference
  const records = items.map((item, index) => {
    const bankCode = item.bank_code || 'RJHI';
    const iban = item.iban.replace(/\s+/g, '');
    const empName = item.full_name_ar.replace(/,/g, '');
    const nationalId = item.national_id;
    const basic = item.basic_salary.toFixed(2);
    const housing = item.housing_allowance.toFixed(2);
    const otherEarnings = (item.transport_allowance + item.other_allowance + item.overtime_pay + item.bonus_pay).toFixed(2);
    const deductions = item.total_deductions.toFixed(2);
    const net = item.net_salary.toFixed(2);
    const refNo = `JM${period.period_month.replace('-', '')}${String(index + 1).padStart(4, '0')}`;

    return `EDR,${bankCode},${iban},${empName},${nationalId},${basic},${housing},${otherEarnings},${deductions},${net},${refNo}`;
  });

  return [header, ...records].join('\r\n');
}

module.exports = {
  calculateMonthlyPayroll,
  getPayrollPeriods,
  getPayrollPeriodDetails,
  approvePayrollPeriod,
  getEmployeePayslip,
  generateWpsSifContent
};
