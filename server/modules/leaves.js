// server/modules/leaves.js - Dedicated Leave Management System with Daily Accrual & 2-Tier Approvals
const { query, get, run } = require('../database/db');

/**
 * Calculate actual service years between join_date and target date
 */
function calculateServiceYears(joinDateStr, targetDate = new Date()) {
  if (!joinDateStr) return 0;
  const joinDate = new Date(joinDateStr);
  const diffTime = targetDate.getTime() - joinDate.getTime();
  const years = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, years);
}

/**
 * Determine annual accrual rate per Saudi Labor Law:
 * - Service <= 5 years: 21 days
 * - Service > 5 years: 30 days
 */
function getAnnualAccrualRate(joinDateStr) {
  const years = calculateServiceYears(joinDateStr);
  return years > 5 ? 30 : 21;
}

/**
 * Get or initialize leave balance for an employee, calculating daily accrual automatically
 */
function getEmployeeLeaveBalance(empId) {
  const emp = get(`
    SELECT e.id, e.emp_code, e.full_name_ar, e.join_date, e.annual_leave_balance,
           d.name_ar AS department_name, b.name_ar AS branch_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    WHERE e.id = ?
  `, [empId]);

  if (!emp) {
    throw new Error('الموظف غير موجود');
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const serviceYears = calculateServiceYears(emp.join_date, now);
  const annualEntitlement = serviceYears > 5 ? 30 : 21;
  const dailyRate = annualEntitlement / 365.0;

  let balanceRow = get('SELECT * FROM leave_balances WHERE emp_id = ?', [empId]);

  if (!balanceRow) {
    // Initialize if not present
    const baseBal = Number(emp.annual_leave_balance) || 0;
    run(`
      INSERT INTO leave_balances (
        emp_id, base_balance, accrual_rate_annual, accrued_days, used_days,
        manual_adjustment, current_balance, last_accrual_date, updated_at
      ) VALUES (?, ?, ?, 0, 0, 0, ?, ?, datetime('now'))
    `, [empId, baseBal, annualEntitlement, baseBal, todayStr]);

    balanceRow = get('SELECT * FROM leave_balances WHERE emp_id = ?', [empId]);
  }

  // Calculate daily accrual since last accrual date
  const lastDate = balanceRow.last_accrual_date ? new Date(balanceRow.last_accrual_date) : now;
  const daysElapsed = Math.max(0, Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)));

  let newAccrued = balanceRow.accrued_days;
  if (daysElapsed > 0) {
    newAccrued += daysElapsed * dailyRate;
  }

  // Calculate total used days from approved leaves
  const usedRow = get(`
    SELECT COALESCE(SUM(days_count), 0) AS total_used
    FROM leaves
    WHERE emp_id = ? AND status = 'معتمد نهائياً'
  `, [empId]);
  const approvedUsedDays = usedRow ? Number(usedRow.total_used) : 0;

  const currentBal = Math.max(0, Math.round((balanceRow.base_balance + newAccrued + balanceRow.manual_adjustment - approvedUsedDays) * 100) / 100);

  // Update table if days elapsed or rate changed
  if (daysElapsed > 0 || balanceRow.accrual_rate_annual !== annualEntitlement || balanceRow.used_days !== approvedUsedDays) {
    run(`
      UPDATE leave_balances
      SET accrual_rate_annual = ?,
          accrued_days = ?,
          used_days = ?,
          current_balance = ?,
          last_accrual_date = ?,
          updated_at = datetime('now')
      WHERE emp_id = ?
    `, [annualEntitlement, newAccrued, approvedUsedDays, currentBal, todayStr, empId]);

    // Keep employee annual_leave_balance synced
    run('UPDATE employees SET annual_leave_balance = ? WHERE id = ?', [currentBal, empId]);
  }

  return {
    emp_id: emp.id,
    emp_code: emp.emp_code,
    full_name_ar: emp.full_name_ar,
    department_name: emp.department_name,
    branch_name: emp.branch_name,
    join_date: emp.join_date,
    service_years: Math.round(serviceYears * 10) / 10,
    annual_entitlement: annualEntitlement,
    daily_accrual_rate: Math.round(dailyRate * 1000) / 1000,
    base_balance: balanceRow.base_balance,
    accrued_days: Math.round(newAccrued * 100) / 100,
    used_days: approvedUsedDays,
    manual_adjustment: balanceRow.manual_adjustment,
    current_balance: currentBal,
    last_accrual_date: todayStr
  };
}

/**
 * Get all leave balances across company
 */
function getAllLeaveBalances() {
  const emps = query(`SELECT id FROM employees WHERE status = 'نشط' ORDER BY id ASC`);
  return emps.map(e => getEmployeeLeaveBalance(e.id));
}

/**
 * HR-Only Manual Balance Adjustment (strictly auditable)
 */
function adjustLeaveBalance(empIdOrObj, adjustmentDays, reason, adjustedBy = 'إدارة الموارد البشرية') {
  let empId = empIdOrObj;
  let days = adjustmentDays;
  let reasonText = reason;
  let byUser = adjustedBy;

  if (typeof empIdOrObj === 'object' && empIdOrObj !== null) {
    empId = empIdOrObj.emp_id || empIdOrObj.empId;
    days = empIdOrObj.days_adjusted !== undefined ? empIdOrObj.days_adjusted : empIdOrObj.adjustment_days;
    reasonText = empIdOrObj.reason;
    byUser = empIdOrObj.adjusted_by_name || empIdOrObj.adjusted_by || 'إدارة الموارد البشرية';
  }

  if (!empId || days === undefined || !reasonText) {
    throw new Error('يرجى تحديد الموظف وقيمة التعديل وسبب التعديل');
  }

  const currentInfo = getEmployeeLeaveBalance(empId);
  const daysNumber = Number(days);
  if (isNaN(daysNumber)) {
    throw new Error('قيمة التعديل غير صحيحة');
  }

  const balanceBefore = currentInfo.current_balance;
  const balanceAfter = Math.max(0, Math.round((balanceBefore + daysNumber) * 100) / 100);

  // Update leave_balances manual_adjustment
  run(`
    UPDATE leave_balances
    SET manual_adjustment = manual_adjustment + ?,
        current_balance = ?,
        updated_at = datetime('now')
    WHERE emp_id = ?
  `, [daysNumber, balanceAfter, empId]);

  // Sync employees table
  run('UPDATE employees SET annual_leave_balance = ? WHERE id = ?', [balanceAfter, empId]);

  // Record audit log
  run(`
    INSERT INTO leave_balance_adjustments (
      emp_id, adjusted_by, adjustment_days, balance_before, balance_after, reason, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `, [empId, byUser, daysNumber, balanceBefore, balanceAfter, reasonText]);

  const updatedBal = getEmployeeLeaveBalance(empId);
  return {
    ...updatedBal,
    success: true,
    balance_before: balanceBefore,
    balance_after: balanceAfter,
    days_adjusted: daysNumber
  };
}

/**
 * Get leave balance adjustments audit log
 */
function getBalanceAdjustments(empId = null) {
  let sql = `
    SELECT a.*, e.emp_code, e.full_name_ar
    FROM leave_balance_adjustments a
    JOIN employees e ON a.emp_id = e.id
  `;
  const params = [];
  if (empId) {
    sql += ` WHERE a.emp_id = ?`;
    params.push(empId);
  }
  sql += ` ORDER BY a.created_at DESC, a.id DESC`;
  return query(sql, params);
}

/**
 * Submit a new leave request (routes through Direct Manager -> HR Manager)
 */
function submitLeaveRequest(data) {
  const {
    emp_id,
    leave_type = 'إجازة سنوية',
    start_date,
    end_date,
    days_count,
    reason = '',
    substitute_emp_id = null,
    attachment = null
  } = data;

  if (!emp_id || !start_date || !end_date || !days_count) {
    throw new Error('بيانات الإجازة غير مكتملة (الموظف، تاريخ البداية، تاريخ النهاية، عدد الأيام)');
  }

  const days = Number(days_count);
  if (days <= 0) {
    throw new Error('عدد أيام الإجازة يجب أن يكون أكبر من صفر');
  }

  const emp = get('SELECT id, full_name_ar, manager_id FROM employees WHERE id = ?', [emp_id]);
  if (!emp) {
    throw new Error('الموظف غير موجود');
  }

  // Validate balance for annual leave
  if (leave_type === 'إجازة سنوية') {
    const balInfo = getEmployeeLeaveBalance(emp_id);
    if (days > balInfo.current_balance) {
      throw new Error(`رصيد إجازاتك الحالي (${balInfo.current_balance} يوم) لا يغطي مدة الإجازة المطلوبة (${days} يوم)`);
    }
  }

  const year = new Date().getFullYear();
  const countRow = get('SELECT COUNT(*) AS total FROM leaves');
  const seq = String((countRow.total || 0) + 1).padStart(4, '0');
  const request_no = `LV-${year}-${seq}`;

  const initialStatus = emp.manager_id
    ? 'معلق بانتظار موافقة المدير المباشر'
    : 'معلق بانتظار اعتماد الموارد البشرية';

  const sql = `
    INSERT INTO leaves (
      request_no, emp_id, leave_type, start_date, end_date, days_count,
      reason, substitute_emp_id, attachment, status, manager_id,
      manager_status, hr_status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'معلق', 'معلق', datetime('now'), datetime('now'))
  `;

  const result = run(sql, [
    request_no, emp_id, leave_type, start_date, end_date, days,
    reason, substitute_emp_id, attachment, initialStatus, emp.manager_id
  ]);

  return getLeaveById(result.lastInsertRowid);
}

/**
 * Get leave details by ID
 */
function getLeaveById(id) {
  const sql = `
    SELECT l.*,
           e.emp_code, e.full_name_ar, e.job_title_ar, e.join_date, e.annual_leave_balance,
           d.name_ar AS department_name, b.name_ar AS branch_name,
           m.full_name_ar AS direct_manager_name,
           sub.full_name_ar AS substitute_emp_name
    FROM leaves l
    JOIN employees e ON l.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    LEFT JOIN employees m ON l.manager_id = m.id
    LEFT JOIN employees sub ON l.substitute_emp_id = sub.id
    WHERE l.id = ?
  `;
  return get(sql, [id]);
}

/**
 * Get all leave requests with filters
 */
function getAllLeaves(filters = {}) {
  let sql = `
    SELECT l.*,
           e.emp_code, e.full_name_ar, e.job_title_ar,
           d.name_ar AS department_name, b.name_ar AS branch_name,
           m.full_name_ar AS direct_manager_name,
           sub.full_name_ar AS substitute_emp_name
    FROM leaves l
    JOIN employees e ON l.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    LEFT JOIN employees m ON l.manager_id = m.id
    LEFT JOIN employees sub ON l.substitute_emp_id = sub.id
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

  if (filters.leave_type) {
    sql += ` AND l.leave_type = ?`;
    params.push(filters.leave_type);
  }

  if (filters.manager_id) {
    sql += ` AND l.manager_id = ?`;
    params.push(filters.manager_id);
  }

  sql += ` ORDER BY l.created_at DESC, l.id DESC`;
  return query(sql, params);
}

/**
 * 2-Tier Approval Workflow:
 * Tier 1: Direct Manager (موافقة مبدئية) -> moves to HR Manager
 * Tier 2: HR Manager (اعتماد نهائي) -> deducts from balance
 */
function approveLeave(id, action, role = 'manager', comment = '', approverName = '') {
  const leave = getLeaveById(id);
  if (!leave) {
    throw new Error('طلب الإجازة غير موجود');
  }

  if (role === 'manager' || role === 'direct_manager') {
    if (action === 'approve') {
      run(`
        UPDATE leaves
        SET manager_status = 'موافق',
            manager_comment = ?,
            manager_action_at = datetime('now'),
            status = 'معلق بانتظار اعتماد الموارد البشرية',
            updated_at = datetime('now')
        WHERE id = ?
      `, [comment || 'موافقة مبدئية من قبل المدير المباشر', id]);
    } else {
      run(`
        UPDATE leaves
        SET manager_status = 'مرفوض',
            manager_comment = ?,
            manager_action_at = datetime('now'),
            status = 'مرفوض من المدير المباشر',
            updated_at = datetime('now')
        WHERE id = ?
      `, [comment || 'تم رفض الطلب من قبل المدير المباشر', id]);
    }
  } else {
    // HR Manager / Admin (Tier 2 - Final Approval)
    if (action === 'approve') {
      run(`
        UPDATE leaves
        SET hr_status = 'موافق',
            hr_comment = ?,
            hr_action_at = datetime('now'),
            status = 'معتمد نهائياً',
            updated_at = datetime('now')
        WHERE id = ?
      `, [comment || 'تم الاعتماد النهائي من قبل إدارة الموارد البشرية', id]);

      // Trigger balance update and deduction
      getEmployeeLeaveBalance(leave.emp_id);
    } else {
      run(`
        UPDATE leaves
        SET hr_status = 'مرفوض',
            hr_comment = ?,
            hr_action_at = datetime('now'),
            status = 'مرفوض من الموارد البشرية',
            updated_at = datetime('now')
        WHERE id = ?
      `, [comment || 'تم رفض الطلب من قبل إدارة الموارد البشرية', id]);
    }
  }

  return getLeaveById(id);
}

/**
 * Delete leave request
 */
function deleteLeave(id) {
  const leave = getLeaveById(id);
  if (!leave) {
    throw new Error('طلب الإجازة غير موجود');
  }
  const result = run('DELETE FROM leaves WHERE id = ?', [id]);
  // Recalculate balance
  getEmployeeLeaveBalance(leave.emp_id);
  return result;
}

/**
 * Leaves summary statistics for KPIs
 */
function getLeavesKPIs() {
  const totalRow = get('SELECT COUNT(*) AS total FROM leaves');
  const pendingMgrRow = get(`SELECT COUNT(*) AS count FROM leaves WHERE status = 'معلق بانتظار موافقة المدير المباشر'`);
  const pendingHrRow = get(`SELECT COUNT(*) AS count FROM leaves WHERE status = 'معلق بانتظار اعتماد الموارد البشرية'`);
  const approvedRow = get(`SELECT COUNT(*) AS count FROM leaves WHERE status = 'معتمد نهائياً'`);
  const rejectedRow = get(`SELECT COUNT(*) AS count FROM leaves WHERE status LIKE 'مرفوض%'`);
  const totalDaysRow = get(`SELECT COALESCE(SUM(days_count), 0) AS total_days FROM leaves WHERE status = 'معتمد نهائياً'`);

  return {
    totalRequests: totalRow.total || 0,
    pendingManager: pendingMgrRow.count || 0,
    pendingHR: pendingHrRow.count || 0,
    approved: approvedRow.count || 0,
    rejected: rejectedRow.count || 0,
    totalApprovedDays: totalDaysRow.total_days || 0
  };
}

module.exports = {
  calculateServiceYears,
  getAnnualAccrualRate,
  getEmployeeLeaveBalance,
  getAllLeaveBalances,
  adjustLeaveBalance,
  getBalanceAdjustments,
  submitLeaveRequest,
  getLeaveById,
  getAllLeaves,
  approveLeave,
  deleteLeave,
  getLeavesKPIs
};
