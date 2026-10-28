// server/modules/requests.js
const { query, get, run } = require('../database/db');

function getAllRequests(filters = {}) {
  let sql = `
    SELECT r.*, e.emp_code, e.full_name_ar, e.job_title_ar, e.manager_id,
           d.name_ar AS department_name, m.full_name_ar AS direct_manager_name
    FROM requests r
    JOIN employees e ON r.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN employees m ON e.manager_id = m.id
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
    SELECT r.*, e.emp_code, e.full_name_ar, e.full_name_en, e.job_title_ar, e.manager_id,
           e.national_id, e.nationality, e.is_saudi, e.join_date, e.basic_salary,
           e.housing_allowance, e.transport_allowance, e.other_allowance,
           d.name_ar AS department_name, m.full_name_ar AS direct_manager_name
    FROM requests r
    JOIN employees e ON r.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN employees m ON e.manager_id = m.id
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

  const emp = get(`
    SELECT e.id, e.emp_code, e.full_name_ar, e.annual_leave_balance, e.manager_id, e.direct_manager_name,
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
      amount, destination_entity, reason, status, manager_id, manager_name,
      manager_status, hr_verify_status, hr_director_status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'معلق - بانتظار موافقة المدير المباشر', ?, ?, 'معلق', 'معلق', 'معلق', datetime('now'), datetime('now'))
  `;

  const result = run(sql, [
    request_no, emp_id, request_type, start_date, end_date,
    days_count, amount, destination_entity, reason, managerId, managerName
  ]);
  const reqId = result.lastInsertRowid;

  // 1. Two-way sync: If it is a leave request, mirror synchronously in leaves table
  let leaveId = null;
  if (request_type.includes('إجازة')) {
    try {
      const leaveRes = run(`
        INSERT INTO leaves (
          request_no, emp_id, leave_type, start_date, end_date, days_count,
          reason, status, manager_id, manager_name,
          manager_status, hr_verify_status, hr_director_status, hr_status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'معلق - بانتظار موافقة المدير المباشر', ?, ?, 'معلق', 'معلق', 'معلق', 'معلق', datetime('now'), datetime('now'))
      `, [
        request_no, emp_id, request_type,
        start_date || new Date().toISOString().split('T')[0],
        end_date || new Date().toISOString().split('T')[0],
        days_count || 1, reason, managerId, managerName
      ]);
      leaveId = leaveRes.lastInsertRowid;
    } catch (e) {
      console.warn('Leaves sync notice:', e.message);
    }
  }

  // 2. Initialize 3 Workflow Pipeline Steps (سير العمل المعتمد)
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
    console.warn('Workflow steps notice:', e.message);
  }

  // 3. Create In-System Notification for Direct Manager
  try {
    if (managerId) {
      run(`
        INSERT INTO notifications (emp_id, title, message, link, type, is_read, created_at)
        VALUES (?, 'طلب جديد بانتظار موافقتك', ?, '/#leaves', 'approval', 0, datetime('now'))
      `, [managerId, `قدم الموظف (${emp.full_name_ar}) طلب (${request_type}) برقم ${request_no} بانتظار موافقتك المباشرة.`]);
    }
  } catch (e) {
    console.warn('Notification notice:', e.message);
  }

  // 4. Create Audit Log
  try {
    run(`
      INSERT INTO audit_logs (entity_type, entity_id, action, performed_by_id, performed_by_name, performed_by_role, old_status, new_status, stage, comment, created_at)
      VALUES ('request', ?, 'CREATE_REQUEST', ?, ?, 'employee', NULL, 'معلق - بانتظار موافقة المدير المباشر', 'المرحلة 1: موافقة المدير المباشر', ?, datetime('now'))
    `, [reqId, emp.id, emp.full_name_ar, reason]);
  } catch (e) {
    console.warn('Audit log notice:', e.message);
  }

  return getRequestById(reqId);
}

function updateRequestStatus(id, newStatus, role, comment, approverName = '') {
  const req = getRequestById(id);
  if (!req) {
    throw new Error('الطلب غير موجود');
  }

  let sql = '';
  let params = [];

  if (role === 'reset' || role === 'revert') {
    sql = `
      UPDATE requests
      SET status = 'معلق - بانتظار موافقة المدير المباشر',
          manager_status = 'معلق',
          manager_comment = NULL,
          manager_approved_at = NULL,
          manager_action_at = NULL,
          hr_verify_status = 'معلق',
          hr_verify_comment = NULL,
          hr_verify_at = NULL,
          hr_verifier_name = NULL,
          hr_director_status = 'معلق',
          hr_director_comment = NULL,
          hr_director_action_at = NULL,
          hr_director_name = NULL,
          hr_comment = NULL,
          hr_approved_at = NULL,
          hr_approver_name = NULL,
          updated_at = datetime('now')
      WHERE id = ?
    `;
    params = [id];
  } else if (role === 'manager' || role === 'dept_manager') {
    const isRej = newStatus.includes('مرفوض');
    sql = `
      UPDATE requests
      SET status = ?,
          manager_status = ?,
          manager_comment = ?,
          manager_name = ?,
          manager_approved_at = datetime('now'),
          manager_action_at = datetime('now'),
          updated_at = datetime('now')
      WHERE id = ?
    `;
    params = [
      newStatus,
      isRej ? 'مرفوض' : 'موافق',
      comment || (isRej ? 'تم الرفض من قبل المدير المباشر' : 'موافقة مبدئية من قبل المدير المباشر'),
      approverName || req.direct_manager_name || 'المدير المباشر',
      id
    ];
  } else if (role === 'hr_verify') {
    const isRej = newStatus.includes('مرفوض');
    sql = `
      UPDATE requests
      SET status = ?,
          hr_verify_status = ?,
          hr_verify_comment = ?,
          hr_verifier_name = ?,
          hr_verify_at = datetime('now'),
          updated_at = datetime('now')
      WHERE id = ?
    `;
    params = [
      newStatus,
      isRej ? 'مرفوض' : 'تم التحقق',
      comment || (isRej ? 'تم الرفض من قبل قسم الموارد البشرية' : 'تم التحقق والتدقيق من قسم الموارد البشرية'),
      approverName || 'قسم الموارد البشرية',
      id
    ];
  } else {
    // Admin / HR Director (Final Step)
    const isRej = newStatus.includes('مرفوض');
    sql = `
      UPDATE requests
      SET status = ?,
          hr_director_status = ?,
          hr_director_comment = ?,
          hr_director_name = ?,
          hr_director_action_at = datetime('now'),
          hr_comment = ?,
          hr_approver_name = ?,
          hr_approved_at = datetime('now'),
          updated_at = datetime('now')
      WHERE id = ?
    `;
    params = [
      newStatus,
      isRej ? 'مرفوض' : 'معتمد',
      comment || (isRej ? 'تم الرفض من قبل مدير الموارد البشرية' : 'تم الاعتماد النهائي من مدير الموارد البشرية'),
      approverName || 'مدير الموارد البشرية',
      comment || (isRej ? 'تم الرفض من قبل الموارد البشرية' : 'تم الاعتماد النهائي من إدارة الموارد البشرية'),
      approverName || 'إدارة الموارد البشرية',
      id
    ];

    // If approved and it's annual leave, deduct from balance
    if (newStatus.includes('معتمد نهائياً') && req.request_type === 'إجازة سنوية' && req.days_count > 0) {
      run(`
        UPDATE employees
        SET annual_leave_balance = MAX(0, annual_leave_balance - ?)
        WHERE id = ?
      `, [req.days_count, req.emp_id]);

      // Keep leave_balances table synced
      try {
        const balRow = get('SELECT * FROM leave_balances WHERE emp_id = ?', [req.emp_id]);
        if (balRow) {
          const newUsed = (balRow.used_days || 0) + req.days_count;
          const newCurrent = Math.max(0, balRow.current_balance - req.days_count);
          run(`
            UPDATE leave_balances
            SET used_days = ?, current_balance = ?, updated_at = datetime('now')
            WHERE emp_id = ?
          `, [newUsed, newCurrent, req.emp_id]);
        }
      } catch (e) {}
    }
  }

  run(sql, params);

  // 1. Two-way Synchronous Mirroring with Leaves Table
  const leave = get('SELECT id, emp_id, leave_type, days_count FROM leaves WHERE request_no = ? OR (emp_id = ? AND start_date = ?)', [req.request_no, req.emp_id, req.start_date]);
  if (leave) {
    if (role === 'reset' || role === 'revert') {
      run(`
        UPDATE leaves
        SET status = 'معلق - بانتظار موافقة المدير المباشر',
            manager_status = 'معلق', manager_comment = NULL, manager_action_at = NULL,
            hr_verify_status = 'معلق', hr_verify_comment = NULL, hr_verify_at = NULL, hr_verifier_name = NULL,
            hr_director_status = 'معلق', hr_director_comment = NULL, hr_director_action_at = NULL, hr_director_name = NULL,
            hr_status = 'معلق', hr_comment = NULL, hr_action_at = NULL,
            updated_at = datetime('now')
        WHERE id = ?
      `, [leave.id]);
    } else if (role === 'manager' || role === 'dept_manager') {
      const isRej = newStatus.includes('مرفوض');
      run(`
        UPDATE leaves
        SET status = ?,
            manager_status = ?,
            manager_comment = ?,
            manager_name = ?,
            manager_action_at = datetime('now'),
            updated_at = datetime('now')
        WHERE id = ?
      `, [newStatus, isRej ? 'مرفوض' : 'موافق', comment || (isRej ? 'تم الرفض من قبل المدير المباشر' : 'موافقة مبدئية من قبل المدير المباشر'), approverName || req.direct_manager_name || 'المدير المباشر', leave.id]);
    } else if (role === 'hr_verify') {
      const isRej = newStatus.includes('مرفوض');
      run(`
        UPDATE leaves
        SET status = ?,
            hr_verify_status = ?,
            hr_verify_comment = ?,
            hr_verifier_name = ?,
            hr_verify_at = datetime('now'),
            updated_at = datetime('now')
        WHERE id = ?
      `, [newStatus, isRej ? 'مرفوض' : 'تم التحقق', comment || (isRej ? 'تم الرفض من قبل قسم الموارد البشرية' : 'تم التحقق والتدقيق من قسم الموارد البشرية'), approverName || 'قسم الموارد البشرية', leave.id]);
    } else {
      const isRej = newStatus.includes('مرفوض');
      run(`
        UPDATE leaves
        SET status = ?,
            hr_director_status = ?,
            hr_director_comment = ?,
            hr_director_name = ?,
            hr_director_action_at = datetime('now'),
            hr_status = ?,
            hr_comment = ?,
            hr_action_at = datetime('now'),
            updated_at = datetime('now')
        WHERE id = ?
      `, [newStatus, isRej ? 'مرفوض' : 'معتمد', comment || (isRej ? 'تم الرفض من قبل مدير الموارد البشرية' : 'تم الاعتماد النهائي من مدير الموارد البشرية'), approverName || 'مدير الموارد البشرية', isRej ? 'مرفوض' : 'موافق', comment || '', leave.id]);
    }
  }

  // 2. Real Approval History in approvals table
  const leaveId = leave ? leave.id : null;
  const isRej = newStatus.includes('مرفوض');
  const actionType = (role === 'reset' || role === 'revert') ? 'revert' : (isRej ? 'reject' : 'approve');
  const stepNum = (role === 'manager' || role === 'dept_manager') ? 1 : ((role === 'hr_verify') ? 2 : ((role === 'reset' || role === 'revert') ? 0 : 3));
  const stepLabel = stepNum === 1 ? 'موافقة المدير المباشر' : (stepNum === 2 ? 'تدقيق وتحقق قسم الموارد البشرية' : (stepNum === 3 ? 'اعتماد مدير الموارد البشرية' : 'تراجع عن الإجراء'));

  try {
    run(`
      INSERT INTO approvals (request_id, leave_id, step_number, step_name, approver_name, approver_role, action, comment, action_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `, [id, leaveId, stepNum, stepLabel, approverName || 'المعتمد', role, actionType, comment]);
  } catch (e) {
    console.warn('Approvals log notice:', e.message);
  }

  // 3. Workflow Steps Pipeline Status Updates
  try {
    if (role === 'manager' || role === 'dept_manager') {
      if (isRej) {
        run(`UPDATE workflow_steps SET status = 'مرفوض', decision_by_name = ?, decision_date = datetime('now'), decision_notes = ?, updated_at = datetime('now') WHERE request_id = ? AND step_order = 1`, [approverName, comment, id]);
      } else {
        run(`UPDATE workflow_steps SET status = 'منجز', decision_by_name = ?, decision_date = datetime('now'), decision_notes = ?, updated_at = datetime('now') WHERE request_id = ? AND step_order = 1`, [approverName, comment, id]);
        run(`UPDATE workflow_steps SET status = 'معلق', updated_at = datetime('now') WHERE request_id = ? AND step_order = 2`, [id]);
      }
    } else if (role === 'hr_verify') {
      if (isRej) {
        run(`UPDATE workflow_steps SET status = 'مرفوض', decision_by_name = ?, decision_date = datetime('now'), decision_notes = ?, updated_at = datetime('now') WHERE request_id = ? AND step_order = 2`, [approverName, comment, id]);
      } else {
        run(`UPDATE workflow_steps SET status = 'منجز', decision_by_name = ?, decision_date = datetime('now'), decision_notes = ?, updated_at = datetime('now') WHERE request_id = ? AND step_order = 2`, [approverName, comment, id]);
        run(`UPDATE workflow_steps SET status = 'معلق', updated_at = datetime('now') WHERE request_id = ? AND step_order = 3`, [id]);
      }
    } else if (role === 'reset' || role === 'revert') {
      run(`UPDATE workflow_steps SET status = 'معلق', decision_notes = 'تم التراجع عن الإجراء', updated_at = datetime('now') WHERE request_id = ? AND step_order = 1`, [id]);
      run(`UPDATE workflow_steps SET status = 'مؤجل', decision_by_name = NULL, decision_date = NULL, decision_notes = NULL, updated_at = datetime('now') WHERE request_id = ? AND step_order >= 2`, [id]);
    } else {
      // Step 3 (Final)
      run(`UPDATE workflow_steps SET status = ?, decision_by_name = ?, decision_date = datetime('now'), decision_notes = ?, updated_at = datetime('now') WHERE request_id = ? AND step_order = 3`, [isRej ? 'مرفوض' : 'منجز', approverName, comment, id]);
    }
  } catch (e) {
    console.warn('Workflow steps update notice:', e.message);
  }

  // 4. Audit Log Entry
  try {
    run(`
      INSERT INTO audit_logs (entity_type, entity_id, action, performed_by_name, performed_by_role, old_status, new_status, stage, comment, created_at)
      VALUES ('request', ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `, [id, actionType.toUpperCase(), approverName || 'النظام', role, req.status, newStatus, stepLabel, comment]);
  } catch (e) {
    console.warn('Audit log notice:', e.message);
  }

  // 5. In-System Notifications
  try {
    if (newStatus.includes('معتمد نهائياً')) {
      run(`
        INSERT INTO notifications (emp_id, title, message, link, type, is_read, created_at)
        VALUES (?, 'تم اعتماد طلبك نهائياً', ?, '/#leaves', 'approval', 0, datetime('now'))
      `, [req.emp_id, `تم اعتماد طلبك (${req.request_type}) برقم ${req.request_no} نهائياً من قبل إدارة الموارد البشرية.`]);
    } else if (newStatus.includes('مرفوض')) {
      run(`
        INSERT INTO notifications (emp_id, title, message, link, type, is_read, created_at)
        VALUES (?, 'تم رفض طلبك', ?, '/#leaves', 'approval', 0, datetime('now'))
      `, [req.emp_id, `نعتذر، تم رفض طلبك (${req.request_type}) برقم ${req.request_no}. السبب: ${comment || 'لم يحدد'}`]);
    } else if ((role === 'manager' || role === 'dept_manager') && !isRej) {
      run(`
        INSERT INTO notifications (user_id, title, message, link, type, is_read, created_at)
        VALUES (2, 'طلب جديد بانتظار تدقيق الموارد البشرية', ?, '/#leaves', 'approval', 0, datetime('now'))
      `, [`تمت موافقة المدير المباشر على طلب (${req.request_type}) برقم ${req.request_no} للموظف ${req.full_name_ar}، وهو بانتظار تدقيق HR.`]);
    }
  } catch (e) {
    console.warn('Notification send notice:', e.message);
  }

  return getRequestById(id);
}

/**
 * 4-Step Approval Processing for General Requests with Strict Role & Identity Enforcement:
 * Rule 1: Applicant employee can NEVER approve/verify their own request.
 * Step 1: Direct Manager (or Admin)
 * Step 2: HR Verification (HR specialist/manager or Admin)
 * Step 3: HR Director Final Approval (HR Director or Admin)
 */
function processRequestStep(id, step, action, comment = '', userContext = null) {
  const req = getRequestById(id);
  if (!req) throw new Error('الطلب غير موجود');

  let approverName = '';
  let userRole = 'admin';
  let userEmpId = null;
  let userPerms = [];

  if (typeof userContext === 'string') {
    approverName = userContext;
  } else if (typeof userContext === 'object' && userContext !== null) {
    approverName = userContext.full_name || userContext.name || userContext.username || '';
    userRole = userContext.role || 'employee';
    userEmpId = userContext.emp_id ? Number(userContext.emp_id) : null;
    userPerms = userContext.permissions || [];
  }

  // 1. Strict Self-Approval Prevention
  if (userEmpId && Number(userEmpId) === Number(req.emp_id)) {
    throw new Error('غير مصرح: لا يحق للموظف مقدم الطلب اعتماد أو تدقيق طلبه الخاص إطلاقاً.');
  }

  // 2. Step 1: Direct Manager Approval
  if (step === 'manager') {
    const isDirectManager = userEmpId && Number(userEmpId) === Number(req.manager_id);
    const isAdmin = userRole === 'admin' || userRole === 'general_manager';
    if (!isDirectManager && !isAdmin) {
      throw new Error(`غير مصرح: اعتماد هذه الخطوة مقتصر على المدير المباشر للموظف (${req.direct_manager_name || 'المدير المباشر'}) أو مدير النظام.`);
    }

    const newStatus = action === 'approve'
      ? 'معلق - بانتظار تحقق قسم الموارد البشرية'
      : 'مرفوض من المدير المباشر';
    return updateRequestStatus(id, newStatus, 'manager', comment, approverName || req.direct_manager_name);
  }

  // 3. Step 2: HR Verification
  if (step === 'hr_verify') {
    const isHR = userRole === 'admin' || userRole === 'hr_manager' || userPerms.includes('approvals') || userPerms.includes('requests');
    if (!isHR) {
      throw new Error('غير مصرح: هذه الخطوة مخصصة لتدقيق وتحقق قسم الموارد البشرية أو مدير النظام.');
    }

    const newStatus = action === 'approve' || action === 'verify'
      ? 'معلق - بانتظار اعتماد مدير الموارد البشرية'
      : 'مرفوض من قسم الموارد البشرية';
    return updateRequestStatus(id, newStatus, 'hr_verify', comment, approverName || 'قسم الموارد البشرية');
  }

  // 4. Step 3: HR Director Final Approval
  if (step === 'hr_director' || step === 'final') {
    const isDirector = userRole === 'admin' || userRole === 'hr_manager' || userRole === 'general_manager';
    if (!isDirector) {
      throw new Error('غير مصرح: هذه الخطوة مخصصة لاعتماد مدير الموارد البشرية أو مدير النظام.');
    }

    const newStatus = action === 'approve'
      ? 'معتمد نهائياً'
      : 'مرفوض من مدير الموارد البشرية';
    return updateRequestStatus(id, newStatus, 'hr_director', comment, approverName || 'مدير الموارد البشرية');
  }

  throw new Error('خطوة الاعتماد غير معروفة');
}

/**
 * Revert request action back to direct manager pending state
 */
function revertRequestAction(id, userContext = null, reason = 'تراجع عن الإجراء') {
  const req = getRequestById(id);
  if (!req) throw new Error('الطلب غير موجود');

  let userRole = 'admin';
  let userEmpId = null;
  if (typeof userContext === 'object' && userContext !== null) {
    userRole = userContext.role || 'employee';
    userEmpId = userContext.emp_id ? Number(userContext.emp_id) : null;
  }

  const isDirectManager = userEmpId && Number(userEmpId) === Number(req.manager_id);
  const isHR = userRole === 'admin' || userRole === 'hr_manager';
  if (!isDirectManager && !isHR) {
    throw new Error('غير مصرح: التراجع عن الإجراء متاح فقط للمدير المباشر أو إدارة الموارد البشرية.');
  }

  return updateRequestStatus(id, 'معلق - بانتظار موافقة المدير المباشر', 'reset', reason, '');
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

function getRequestWorkflow(id) {
  const req = getRequestById(id);
  if (!req) throw new Error('الطلب غير موجود');

  const steps = query(`
    SELECT * FROM workflow_steps
    WHERE request_id = ?
    ORDER BY step_order ASC
  `, [id]);

  const approvalHistory = query(`
    SELECT * FROM approvals
    WHERE request_id = ?
    ORDER BY id ASC
  `, [id]);

  const auditHistory = query(`
    SELECT * FROM audit_logs
    WHERE entity_type = 'request' AND entity_id = ?
    ORDER BY id ASC
  `, [id]);

  return {
    request: req,
    steps,
    approvals: approvalHistory,
    auditLogs: auditHistory
  };
}

function getPendingApprovalsForUser(userContext) {
  let userRole = 'employee';
  let userEmpId = null;
  let userPerms = [];

  if (typeof userContext === 'object' && userContext !== null) {
    userRole = userContext.role || 'employee';
    userEmpId = userContext.emp_id ? Number(userContext.emp_id) : null;
    userPerms = userContext.permissions || [];
  }

  const isAdmin = userRole === 'admin' || userRole === 'general_manager';
  const isHR = isAdmin || userRole === 'hr_manager' || userPerms.includes('approvals');

  let sql = `
    SELECT r.*, e.emp_code, e.full_name_ar, e.job_title_ar,
           d.name_ar AS department_name, m.full_name_ar AS direct_manager_name
    FROM requests r
    JOIN employees e ON r.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN employees m ON r.manager_id = m.id
    WHERE 1=1
  `;
  const params = [];

  if (isAdmin) {
    sql += ` AND r.status LIKE 'معلق%'`;
  } else if (isHR && userEmpId) {
    sql += ` AND (
      (r.manager_id = ? AND r.status LIKE '%بانتظار موافقة المدير%')
      OR r.status LIKE '%تحقق قسم الموارد%'
      OR r.status LIKE '%بانتظار اعتماد مدير الموارد%'
    )`;
    params.push(userEmpId);
  } else if (userEmpId) {
    sql += ` AND r.manager_id = ? AND r.status LIKE '%بانتظار موافقة المدير%'`;
    params.push(userEmpId);
  } else {
    return [];
  }

  sql += ` ORDER BY r.created_at DESC, r.id DESC`;
  return query(sql, params);
}

module.exports = {
  getAllRequests,
  getRequestById,
  submitRequest,
  updateRequestStatus,
  processRequestStep,
  revertRequestAction,
  generateCertifiedSalaryLetter,
  getRequestWorkflow,
  getPendingApprovalsForUser
};
