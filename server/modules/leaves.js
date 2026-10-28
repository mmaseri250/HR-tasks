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

  const emp = get(`
    SELECT e.id, e.emp_code, e.full_name_ar, e.manager_id, e.direct_manager_name,
           m.full_name_ar AS manager_full_name
    FROM employees e
    LEFT JOIN employees m ON e.manager_id = m.id
    WHERE e.id = ?
  `, [emp_id]);
  if (!emp) {
    throw new Error('الموظف غير موجود');
  }

  const managerId = emp.manager_id || null;
  const managerName = emp.direct_manager_name || emp.manager_full_name || 'المدير المباشر';

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

  const initialStatus = 'معلق - بانتظار موافقة المدير المباشر';

  const sql = `
    INSERT INTO leaves (
      request_no, emp_id, leave_type, start_date, end_date, days_count,
      reason, substitute_emp_id, attachment, status, manager_id, manager_name,
      manager_status, hr_verify_status, hr_director_status, hr_status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'معلق', 'معلق', 'معلق', 'معلق', datetime('now'), datetime('now'))
  `;

  const result = run(sql, [
    request_no, emp_id, leave_type, start_date, end_date, days,
    reason, substitute_emp_id, attachment, initialStatus, managerId, managerName
  ]);
  const leaveId = result.lastInsertRowid;

  // 1. Two-way sync: Also mirror in requests table
  let reqId = null;
  try {
    const reqRes = run(`
      INSERT INTO requests (
        request_no, emp_id, request_type, start_date, end_date, days_count,
        amount, destination_entity, reason, status, manager_id, manager_name,
        manager_status, hr_verify_status, hr_director_status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 0, NULL, ?, ?, ?, ?, 'معلق', 'معلق', 'معلق', datetime('now'), datetime('now'))
    `, [request_no, emp_id, leave_type, start_date, end_date, days, reason, initialStatus, managerId, managerName]);
    reqId = reqRes.lastInsertRowid;
  } catch (e) {
    console.warn('Requests mirror error:', e.message);
  }

  // 2. Initialize Workflow Pipeline Steps
  try {
    run(`
      INSERT INTO workflow_steps (request_id, leave_id, step_order, step_name, role_required, assigned_to_emp_id, assigned_to_name, status, created_at, updated_at)
      VALUES (?, ?, 1, 'موافقة المدير المباشر', 'direct_manager', ?, ?, 'معلق', datetime('now'), datetime('now'))
    `, [reqId, leaveId, managerId, managerName]);

    run(`
      INSERT INTO workflow_steps (request_id, leave_id, step_order, step_name, role_required, assigned_to_emp_id, assigned_to_name, status, created_at, updated_at)
      VALUES (?, ?, 2, 'تدقيق وتحقق قسم الموارد البشرية', 'hr_specialist', NULL, 'قسم الموارد البشرية', 'مؤجل', datetime('now'), datetime('now'))
    `, [reqId, leaveId]);

    run(`
      INSERT INTO workflow_steps (request_id, leave_id, step_order, step_name, role_required, assigned_to_emp_id, assigned_to_name, status, created_at, updated_at)
      VALUES (?, ?, 3, 'اعتماد مدير الموارد البشرية', 'hr_director', 9551, 'عبدالملك سعيد الشريف', 'مؤجل', datetime('now'), datetime('now'))
    `, [reqId, leaveId]);
  } catch (e) {
    console.warn('Workflow steps error in leaves:', e.message);
  }

  // 3. Create Notification for Direct Manager
  try {
    if (managerId) {
      run(`
        INSERT INTO notifications (emp_id, title, message, link, type, is_read, created_at)
        VALUES (?, 'طلب إجازة جديد بانتظار موافقتك', ?, '/#leaves', 'approval', 0, datetime('now'))
      `, [managerId, `قدم الموظف (${emp.full_name_ar}) طلب (${leave_type}) برقم ${request_no} لمدة ${days} يوم بانتظار موافقتك.`]);
    }
  } catch (e) {}

  // 4. Create Audit Log
  try {
    run(`
      INSERT INTO audit_logs (entity_type, entity_id, action, performed_by_id, performed_by_name, performed_by_role, old_status, new_status, stage, comment, created_at)
      VALUES ('leave', ?, 'CREATE_LEAVE_REQUEST', ?, ?, 'employee', NULL, ?, 'المرحلة 1: موافقة المدير المباشر', ?, datetime('now'))
    `, [leaveId, emp.id, emp.full_name_ar, initialStatus, reason]);
  } catch (e) {}

  return getLeaveById(leaveId);
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
function approveLeave(id, action, role = 'manager', comment = '', approverName = '', userContext = null) {
  const leave = getLeaveById(id);
  if (!leave) {
    throw new Error('طلب الإجازة غير موجود');
  }

  let userRole = 'admin';
  let userEmpId = null;
  let userPerms = [];

  if (typeof userContext === 'object' && userContext !== null) {
    userRole = userContext.role || 'employee';
    userEmpId = userContext.emp_id ? Number(userContext.emp_id) : null;
    userPerms = userContext.permissions || [];
  }

  // 1. Strict Self-Approval Prevention
  if (userEmpId && Number(userEmpId) === Number(leave.emp_id)) {
    throw new Error('غير مصرح: لا يحق للموظف مقدم الطلب اعتماد أو تدقيق طلب إجازته الشخصية إطلاقاً.');
  }

  if (role === 'reset' || role === 'revert') {
    run(`
      UPDATE leaves
      SET status = 'معلق - بانتظار موافقة المدير المباشر',
          manager_status = 'معلق',
          manager_comment = NULL,
          manager_action_at = NULL,
          hr_verify_status = 'معلق',
          hr_verify_comment = NULL,
          hr_verify_at = NULL,
          hr_verifier_name = NULL,
          hr_director_status = 'معلق',
          hr_director_comment = NULL,
          hr_director_action_at = NULL,
          hr_director_name = NULL,
          hr_status = 'معلق',
          hr_comment = NULL,
          hr_action_at = NULL,
          updated_at = datetime('now')
      WHERE id = ?
    `, [id]);
    // Recalculate balance
    getEmployeeLeaveBalance(leave.emp_id);
    return getLeaveById(id);
  }

  if (role === 'manager' || role === 'direct_manager') {
    const isDirectManager = userEmpId && Number(userEmpId) === Number(leave.manager_id);
    const isAdmin = userRole === 'admin' || userRole === 'general_manager';
    if (userContext && !isDirectManager && !isAdmin) {
      throw new Error(`غير مصرح: اعتماد هذه الخطوة مقتصر على المدير المباشر (${leave.direct_manager_name || 'المدير المباشر'}) أو مدير النظام.`);
    }

    if (action === 'approve') {
      run(`
        UPDATE leaves
        SET manager_status = 'موافق',
            manager_name = ?,
            manager_comment = ?,
            manager_action_at = datetime('now'),
            status = 'معلق - بانتظار تحقق قسم الموارد البشرية',
            updated_at = datetime('now')
        WHERE id = ?
      `, [approverName || leave.direct_manager_name || 'المدير المباشر', comment || 'موافقة مبدئية من قبل المدير المباشر', id]);
    } else {
      run(`
        UPDATE leaves
        SET manager_status = 'مرفوض',
            manager_name = ?,
            manager_comment = ?,
            manager_action_at = datetime('now'),
            status = 'مرفوض من المدير المباشر',
            updated_at = datetime('now')
        WHERE id = ?
      `, [approverName || leave.direct_manager_name || 'المدير المباشر', comment || 'تم رفض الطلب من قبل المدير المباشر', id]);
    }
  } else if (role === 'hr_verify' || role === 'hr_specialist') {
    const isHR = userRole === 'admin' || userRole === 'hr_manager' || userPerms.includes('approvals') || userPerms.includes('leaves');
    if (userContext && !isHR) {
      throw new Error('غير مصرح: هذه الخطوة مخصصة لتدقيق قسم الموارد البشرية أو مدير النظام.');
    }

    if (action === 'approve' || action === 'verify') {
      run(`
        UPDATE leaves
        SET hr_verify_status = 'تم التحقق',
            hr_verifier_name = ?,
            hr_verify_comment = ?,
            hr_verify_at = datetime('now'),
            status = 'معلق - بانتظار اعتماد مدير الموارد البشرية',
            updated_at = datetime('now')
        WHERE id = ?
      `, [approverName || 'قسم الموارد البشرية', comment || 'تم التحقق والتدقيق من قسم الموارد البشرية', id]);
    } else {
      run(`
        UPDATE leaves
        SET hr_verify_status = 'مرفوض',
            hr_verifier_name = ?,
            hr_verify_comment = ?,
            hr_verify_at = datetime('now'),
            status = 'مرفوض من قسم الموارد البشرية',
            updated_at = datetime('now')
        WHERE id = ?
      `, [approverName || 'قسم الموارد البشرية', comment || 'تم رفض الطلب من قبل قسم الموارد البشرية', id]);
    }
  } else {
    // HR Director / Admin (Final Step)
    const isDirector = userRole === 'admin' || userRole === 'hr_manager' || userRole === 'general_manager';
    if (userContext && !isDirector) {
      throw new Error('غير مصرح: هذه الخطوة مخصصة لاعتماد مدير الموارد البشرية أو مدير النظام.');
    }

    if (action === 'approve') {
      run(`
        UPDATE leaves
        SET hr_director_status = 'معتمد',
            hr_director_name = ?,
            hr_director_comment = ?,
            hr_director_action_at = datetime('now'),
            hr_status = 'موافق',
            hr_comment = ?,
            hr_action_at = datetime('now'),
            status = 'معتمد نهائياً',
            updated_at = datetime('now')
        WHERE id = ?
      `, [
        approverName || 'مدير الموارد البشرية',
        comment || 'تم الاعتماد النهائي من قبل مدير الموارد البشرية',
        comment || 'تم الاعتماد النهائي من قبل إدارة الموارد البشرية',
        id
      ]);

      // Trigger balance update and deduction
      getEmployeeLeaveBalance(leave.emp_id);
    } else {
      run(`
        UPDATE leaves
        SET hr_director_status = 'مرفوض',
            hr_director_name = ?,
            hr_director_comment = ?,
            hr_director_action_at = datetime('now'),
            hr_status = 'مرفوض',
            hr_comment = ?,
            hr_action_at = datetime('now'),
            status = 'مرفوض من مدير الموارد البشرية',
            updated_at = datetime('now')
        WHERE id = ?
      `, [
        approverName || 'مدير الموارد البشرية',
        comment || 'تم رفض الطلب من قبل مدير الموارد البشرية',
        comment || 'تم رفض الطلب من قبل إدارة الموارد البشرية',
        id
      ]);
    }
  }

  // 1. Two-way Synchronous Mirroring with requests table
  const reqRow = get('SELECT id, status, request_type FROM requests WHERE request_no = ? OR (emp_id = ? AND start_date = ?)', [leave.request_no, leave.emp_id, leave.start_date]);
  if (reqRow) {
    if (role === 'reset' || role === 'revert') {
      run(`
        UPDATE requests
        SET status = 'معلق - بانتظار موافقة المدير المباشر',
            manager_status = 'معلق', manager_comment = NULL, manager_approved_at = NULL, manager_action_at = NULL,
            hr_verify_status = 'معلق', hr_verify_comment = NULL, hr_verify_at = NULL, hr_verifier_name = NULL,
            hr_director_status = 'معلق', hr_director_comment = NULL, hr_director_action_at = NULL, hr_director_name = NULL,
            hr_comment = NULL, hr_approved_at = NULL, hr_approver_name = NULL,
            updated_at = datetime('now')
        WHERE id = ?
      `, [reqRow.id]);
    } else if (role === 'manager' || role === 'direct_manager') {
      const isRej = action !== 'approve';
      run(`
        UPDATE requests
        SET status = ?, manager_status = ?, manager_comment = ?, manager_name = ?,
            manager_approved_at = datetime('now'), manager_action_at = datetime('now'), updated_at = datetime('now')
        WHERE id = ?
      `, [isRej ? 'مرفوض من المدير المباشر' : 'معلق - بانتظار تحقق قسم الموارد البشرية', isRej ? 'مرفوض' : 'موافق', comment || (isRej ? 'تم الرفض' : 'موافقة المدير'), approverName || leave.direct_manager_name || 'المدير المباشر', reqRow.id]);
    } else if (role === 'hr_verify' || role === 'hr_specialist') {
      const isRej = action !== 'approve' && action !== 'verify';
      run(`
        UPDATE requests
        SET status = ?, hr_verify_status = ?, hr_verify_comment = ?, hr_verifier_name = ?,
            hr_verify_at = datetime('now'), updated_at = datetime('now')
        WHERE id = ?
      `, [isRej ? 'مرفوض من قسم الموارد البشرية' : 'معلق - بانتظار اعتماد مدير الموارد البشرية', isRej ? 'مرفوض' : 'تم التحقق', comment || '', approverName || 'قسم الموارد البشرية', reqRow.id]);
    } else {
      const isRej = action !== 'approve';
      run(`
        UPDATE requests
        SET status = ?, hr_director_status = ?, hr_director_comment = ?, hr_director_name = ?,
            hr_director_action_at = datetime('now'), hr_comment = ?, hr_approver_name = ?, hr_approved_at = datetime('now'), updated_at = datetime('now')
        WHERE id = ?
      `, [isRej ? 'مرفوض من مدير الموارد البشرية' : 'معتمد نهائياً', isRej ? 'مرفوض' : 'معتمد', comment || '', approverName || 'مدير الموارد البشرية', comment || '', approverName || 'مدير الموارد البشرية', reqRow.id]);
    }
  }

  // 2. Real Approval History in approvals table
  const reqId = reqRow ? reqRow.id : null;
  const isRej = (action !== 'approve' && action !== 'verify' && action !== 'reset' && action !== 'revert');
  const actionType = (role === 'reset' || role === 'revert') ? 'revert' : (isRej ? 'reject' : 'approve');
  const stepNum = (role === 'manager' || role === 'direct_manager') ? 1 : ((role === 'hr_verify' || role === 'hr_specialist') ? 2 : ((role === 'reset' || role === 'revert') ? 0 : 3));
  const stepLabel = stepNum === 1 ? 'موافقة المدير المباشر' : (stepNum === 2 ? 'تدقيق وتحقق قسم الموارد البشرية' : (stepNum === 3 ? 'اعتماد مدير الموارد البشرية' : 'تراجع عن الإجراء'));

  try {
    run(`
      INSERT INTO approvals (request_id, leave_id, step_number, step_name, approver_name, approver_role, action, comment, action_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `, [reqId, id, stepNum, stepLabel, approverName || 'المعتمد', role, actionType, comment]);
  } catch (e) {}

  // 3. Workflow Steps Pipeline Status Updates
  try {
    if (role === 'manager' || role === 'direct_manager') {
      if (isRej) {
        run(`UPDATE workflow_steps SET status = 'مرفوض', decision_by_name = ?, decision_date = datetime('now'), decision_notes = ?, updated_at = datetime('now') WHERE leave_id = ? AND step_order = 1`, [approverName, comment, id]);
      } else {
        run(`UPDATE workflow_steps SET status = 'منجز', decision_by_name = ?, decision_date = datetime('now'), decision_notes = ?, updated_at = datetime('now') WHERE leave_id = ? AND step_order = 1`, [approverName, comment, id]);
        run(`UPDATE workflow_steps SET status = 'معلق', updated_at = datetime('now') WHERE leave_id = ? AND step_order = 2`, [id]);
      }
    } else if (role === 'hr_verify' || role === 'hr_specialist') {
      if (isRej) {
        run(`UPDATE workflow_steps SET status = 'مرفوض', decision_by_name = ?, decision_date = datetime('now'), decision_notes = ?, updated_at = datetime('now') WHERE leave_id = ? AND step_order = 2`, [approverName, comment, id]);
      } else {
        run(`UPDATE workflow_steps SET status = 'منجز', decision_by_name = ?, decision_date = datetime('now'), decision_notes = ?, updated_at = datetime('now') WHERE leave_id = ? AND step_order = 2`, [approverName, comment, id]);
        run(`UPDATE workflow_steps SET status = 'معلق', updated_at = datetime('now') WHERE leave_id = ? AND step_order = 3`, [id]);
      }
    } else if (role === 'reset' || role === 'revert') {
      run(`UPDATE workflow_steps SET status = 'معلق', decision_notes = 'تم التراجع عن الإجراء', updated_at = datetime('now') WHERE leave_id = ? AND step_order = 1`, [id]);
      run(`UPDATE workflow_steps SET status = 'مؤجل', decision_by_name = NULL, decision_date = NULL, decision_notes = NULL, updated_at = datetime('now') WHERE leave_id = ? AND step_order >= 2`, [id]);
    } else {
      run(`UPDATE workflow_steps SET status = ?, decision_by_name = ?, decision_date = datetime('now'), decision_notes = ?, updated_at = datetime('now') WHERE leave_id = ? AND step_order = 3`, [isRej ? 'مرفوض' : 'منجز', approverName, comment, id]);
    }
  } catch (e) {}

  // 4. Audit Log Entry
  try {
    run(`
      INSERT INTO audit_logs (entity_type, entity_id, action, performed_by_name, performed_by_role, old_status, new_status, stage, comment, created_at)
      VALUES ('leave', ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `, [id, actionType.toUpperCase(), approverName || 'النظام', role, leave.status, (action === 'approve' ? 'موافق' : 'إجراء'), stepLabel, comment]);
  } catch (e) {}

  // 5. In-System Notifications
  try {
    if (action === 'approve' && role !== 'manager' && role !== 'hr_verify') {
      run(`
        INSERT INTO notifications (emp_id, title, message, link, type, is_read, created_at)
        VALUES (?, 'تم اعتماد إجازتك نهائياً', ?, '/#leaves', 'approval', 0, datetime('now'))
      `, [leave.emp_id, `تم اعتماد طلب إجازتك (${leave.leave_type}) برقم ${leave.request_no} نهائياً بنجاح.`]);
    } else if (isRej) {
      run(`
        INSERT INTO notifications (emp_id, title, message, link, type, is_read, created_at)
        VALUES (?, 'تم رفض طلب الإجازة', ?, '/#leaves', 'approval', 0, datetime('now'))
      `, [leave.emp_id, `تم رفض طلب إجازتك (${leave.leave_type}) برقم ${leave.request_no}. السبب: ${comment || 'لم يحدد'}`]);
    } else if ((role === 'manager' || role === 'direct_manager') && action === 'approve') {
      run(`
        INSERT INTO notifications (user_id, title, message, link, type, is_read, created_at)
        VALUES (2, 'طلب إجازة جديد بانتظار تدقيق الموارد البشرية', ?, '/#leaves', 'approval', 0, datetime('now'))
      `, [`تمت موافقة المدير المباشر على طلب إجازة (${leave.leave_type}) برقم ${leave.request_no} للموظف ${leave.full_name_ar || 'الموظف'}.`]);
    }
  } catch (e) {}

  return getLeaveById(id);
}

function processLeaveStep(id, step, action, comment = '', userContext = null) {
  let approverName = '';
  if (typeof userContext === 'string') {
    approverName = userContext;
  } else if (typeof userContext === 'object' && userContext !== null) {
    approverName = userContext.full_name || userContext.name || userContext.username || '';
  }

  if (step === 'manager') {
    return approveLeave(id, action, 'manager', comment, approverName, userContext);
  } else if (step === 'hr_verify') {
    return approveLeave(id, action, 'hr_verify', comment, approverName, userContext);
  } else if (step === 'hr_director' || step === 'final') {
    return approveLeave(id, action, 'hr_director', comment, approverName, userContext);
  }
  throw new Error('خطوة اعتماد الإجازة غير صحيحة');
}

function revertLeaveAction(id, userContext = null, reason = 'تراجع عن الإجراء') {
  return approveLeave(id, 'revert', 'reset', reason, '', userContext);
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
  // Also clean matching request
  try { run('DELETE FROM requests WHERE request_no = ?', [leave.request_no]); } catch (e) {}
  // Recalculate balance
  getEmployeeLeaveBalance(leave.emp_id);
  return result;
}

/**
 * Leaves summary statistics for KPIs
 */
function getLeavesKPIs() {
  const stats = get(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status LIKE '%بانتظار موافقة المدير%' THEN 1 ELSE 0 END) AS pendingManager,
      SUM(CASE WHEN status LIKE '%تحقق%' OR status LIKE '%بانتظار اعتماد%' THEN 1 ELSE 0 END) AS pendingHR,
      SUM(CASE WHEN status = 'معتمد نهائياً' THEN 1 ELSE 0 END) AS approved,
      SUM(CASE WHEN status LIKE 'مرفوض%' THEN 1 ELSE 0 END) AS rejected,
      COALESCE(SUM(CASE WHEN status = 'معتمد نهائياً' THEN days_count ELSE 0 END), 0) AS approvedDays
    FROM leaves
  `);

  const total = stats ? (stats.total || 0) : 0;
  const pendingManager = stats ? (stats.pendingManager || 0) : 0;
  const pendingHR = stats ? (stats.pendingHR || 0) : 0;
  const approved = stats ? (stats.approved || 0) : 0;
  const rejected = stats ? (stats.rejected || 0) : 0;
  const approvedDays = stats ? (stats.approvedDays || 0) : 0;

  return {
    total,
    totalRequests: total,
    pendingManager,
    pendingHR,
    approved,
    rejected,
    approvedDays,
    totalApprovedDays: approvedDays
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
  processLeaveStep,
  revertLeaveAction,
  deleteLeave,
  getLeavesKPIs
};
