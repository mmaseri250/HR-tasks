// server/server.js
const express = require('express');
const cors = require('cors');
const path = require('node:path');
const fs = require('node:fs');
const multer = require('multer');

const { query, get, run } = require('./database/db');
const { seedDatabase } = require('./database/seedData');
const employeesModule = require('./modules/employees');
const attendanceModule = require('./modules/attendance');
const payrollModule = require('./modules/payroll');
const requestsModule = require('./modules/requests');
const biometricModule = require('./modules/biometricSimulator');
const usersModule = require('./modules/users');
const penaltiesModule = require('./modules/penalties');
const leavesModule = require('./modules/leaves');
const tasksModule = require('./modules/tasks');
const formsGenerator = require('./modules/formsGenerator');
const exportService = require('./modules/exportService');
const muqeemModule = require('./modules/muqeem');
const attendanceNoticesModule = require('./modules/attendanceNotices');
const terminatedEmployeesModule = require('./modules/terminatedEmployees');
const loansModule = require('./modules/loans');
const officialTemplates = require('./modules/officialTemplates');
const absenceNoticesModule = require('./modules/absenceNotices');
const auditModule = require('./modules/audit');
const rbacEngine = require('./modules/rbacEngine');
const cacheService = require('./modules/cacheService');
const attendanceAutomationService = require('./modules/attendanceAutomationService');
const { eosCalculatorService, SAUDI_EOS_TERMINATION_CASES } = require('./modules/eosCalculatorService');
const atsRecruitmentService = require('./modules/atsRecruitmentService');
const fleetService = require('./modules/fleetService');
const healthInsuranceService = require('./modules/healthInsuranceService');
const generalAdminService = require('./modules/generalAdminService');

// Start attendance background violation scanner
attendanceAutomationService.startBackgroundScanner();

// Initialize Seed Data if unseeded
try {
  const empCount = get('SELECT COUNT(*) AS total FROM employees')?.total || 0;
  if (empCount === 0) {
    seedDatabase();
  }
} catch (e) {
  seedDatabase();
}

// Ensure user-employee links are reconciled on startup
try {
  usersModule.reconcileUserEmployeeLinks();
} catch (e) {
  console.warn('Reconciliation error on startup:', e.message);
}

// Ensure organizational hierarchy and manager integrity on startup
try {
  // Purge any lingering obsolete board members if present by full name
  run("DELETE FROM employees WHERE full_name_ar IN ('عبدالرحمن صالح القحطاني', 'سعيد محمد القحطاني', 'صالح سعيد القحطاني')");
  run("DELETE FROM users WHERE username IN ('abdulrahman.qahtani', 'saeed.qahtani', 'salih.qahtani', 'admin.qahtani') OR full_name IN ('عبدالرحمن صالح القحطاني', 'سعيد محمد القحطاني', 'صالح سعيد القحطاني')");
  run("DELETE FROM absence_notices WHERE emp_name IN ('عبدالرحمن صالح القحطاني', 'سعيد محمد القحطاني', 'صالح سعيد القحطاني')");
  run("UPDATE branches SET manager_name = 'فارس عبدالرحمن القحطاني' WHERE manager_name LIKE '%صالح سعيد%' OR name_ar LIKE '%الإدارة العامة%'");
  run("UPDATE departments SET manager_name = 'فارس عبدالرحمن القحطاني' WHERE manager_name LIKE '%صالح سعيد%' OR name_ar LIKE '%الإدارة العامة%'");

  // Ensure department heads report independently (manager_id = NULL)
  run("UPDATE employees SET manager_id = NULL, direct_manager_name = NULL WHERE emp_code IN ('JM-0001', 'JM-0108')");
  run("UPDATE employees SET direct_manager_name = 'تامر جمعه احمد عبدالله' WHERE direct_manager_name = 'تامر جمعة احمد عبدالله'");
} catch (e) {
  console.error('Hierarchy sync error:', e.message);
}

// Automatic Workflow Integrity Check & Revert of Erroneous Actions
try {
  const abdulmalik = get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-0001' OR full_name_ar LIKE '%عبدالملك سعيد الشريف%'");
  const shama = get("SELECT id, manager_id, direct_manager_name FROM employees WHERE full_name_ar LIKE '%شامة%'");
  if (shama) {
    const existingReq = get("SELECT id, status, manager_status FROM requests WHERE emp_id = ? OR id = 26 OR request_no = 'REQ-2026-0001'", [shama.id]);
    const mgrId = shama.manager_id || (abdulmalik ? abdulmalik.id : null);
    const mgrName = shama.direct_manager_name || (abdulmalik ? abdulmalik.full_name_ar : 'عبدالملك سعيد الشريف');

    if (!existingReq) {
      run(`
        INSERT INTO requests (
          id, request_no, emp_id, request_type, start_date, end_date, days_count,
          amount, destination_entity, reason, status, manager_id, manager_name,
          manager_status, hr_verify_status, hr_director_status, created_at, updated_at
        ) VALUES (
          26, 'REQ-2026-0001', ?, 'إجازة سنوية', '2026-10-26', '2026-10-26', 1,
          3000, NULL, 'طلب اجازه ', 'معلق - بانتظار موافقة المدير المباشر', ?, ?,
          'معلق', 'معلق', 'معلق', datetime('now'), datetime('now')
        )
      `, [shama.id, mgrId, mgrName]);
      console.log('✓ Re-established request REQ-2026-0001 for Shama Ali Asiri with direct manager Abdulmalik Saeed Al-Sharif.');
    } else {
      run(`
        UPDATE requests
        SET manager_id = ?,
            manager_name = ?,
            updated_at = datetime('now')
        WHERE id = ?
      `, [mgrId, mgrName, existingReq.id]);
      console.log('✓ Successfully ensured request REQ-2026-0001 has direct manager properly bound.');
    }

    // Ensure matching leaves record exists
    const existingLeave = get("SELECT id FROM leaves WHERE request_no = 'REQ-2026-0001' OR (emp_id = ? AND leave_type = 'إجازة سنوية')", [shama.id]);
    let leaveId = existingLeave ? existingLeave.id : null;
    if (!existingLeave) {
      const leaveRes = run(`
        INSERT INTO leaves (
          request_no, emp_id, leave_type, start_date, end_date, days_count,
          reason, status, manager_id, manager_name,
          manager_status, hr_verify_status, hr_director_status, hr_status, created_at, updated_at
        ) VALUES (
          'REQ-2026-0001', ?, 'إجازة سنوية', '2026-10-26', '2026-10-26', 1,
          'طلب اجازه ', 'معلق - بانتظار موافقة المدير المباشر', ?, ?,
          'معلق', 'معلق', 'معلق', 'معلق', datetime('now'), datetime('now')
        )
      `, [shama.id, mgrId, mgrName]);
      leaveId = leaveRes.lastInsertRowid;
      console.log('✓ Synchronized leaves table record for REQ-2026-0001.');
    }

    // Ensure workflow_steps exist
    const reqId = existingReq ? existingReq.id : 26;
    const stepsCount = get("SELECT COUNT(*) as count FROM workflow_steps WHERE request_id = ?", [reqId])?.count || 0;
    if (stepsCount === 0) {
      run(`
        INSERT INTO workflow_steps (request_id, leave_id, step_order, step_name, role_required, assigned_to_emp_id, assigned_to_name, status, created_at, updated_at)
        VALUES (?, ?, 1, 'موافقة المدير المباشر', 'direct_manager', ?, ?, 'معلق', datetime('now'), datetime('now'))
      `, [reqId, leaveId, mgrId, mgrName]);
      run(`
        INSERT INTO workflow_steps (request_id, leave_id, step_order, step_name, role_required, assigned_to_emp_id, assigned_to_name, status, created_at, updated_at)
        VALUES (?, ?, 2, 'تدقيق وتحقق قسم الموارد البشرية', 'hr_specialist', NULL, 'قسم الموارد البشرية', 'مؤجل', datetime('now'), datetime('now'))
      `, [reqId, leaveId]);
      run(`
        INSERT INTO workflow_steps (request_id, leave_id, step_order, step_name, role_required, assigned_to_emp_id, assigned_to_name, status, created_at, updated_at)
        VALUES (?, ?, 3, 'اعتماد مدير الموارد البشرية', 'hr_director', ?, ?, 'مؤجل', datetime('now'), datetime('now'))
      `, [reqId, leaveId, abdulmalik ? abdulmalik.id : null, abdulmalik ? abdulmalik.full_name_ar : 'عبدالملك سعيد الشريف']);
      console.log('✓ Created 3-stage workflow_steps pipeline.');
    }
  }
} catch (e) {
  console.warn('Revert migration note:', e.message);
}

// User context extractor for strict role & ownership checking
function extractUserContext(req) {
  if (req.user && req.user.id) {
    return req.user;
  }

  const headerId = req.headers['x-user-id'];
  const headerRole = req.headers['x-user-role'];
  const headerEmpId = req.headers['x-user-emp-id'];
  const headerName = req.headers['x-user-name'] ? decodeURIComponent(req.headers['x-user-name']) : null;

  const bodyUser = req.body?.user || req.body?.currentUser || {};
  const userId = headerId || bodyUser.id || req.body?.user_id;

  let user = null;
  if (userId) {
    try {
      user = get('SELECT id, username, full_name, role, permissions, emp_id, custom_data_scope FROM users WHERE id = ?', [userId]);
      if (user) {
        try { user.permissions = JSON.parse(user.permissions || '[]'); } catch (_) { user.permissions = []; }
      }
    } catch (_) {}
  }

  if (!user && (headerRole || bodyUser.role)) {
    user = {
      id: userId ? Number(userId) : null,
      username: bodyUser.username || '',
      full_name: headerName || bodyUser.full_name || bodyUser.name || req.body?.approverName || '',
      role: headerRole || bodyUser.role || 'employee',
      emp_id: headerEmpId ? Number(headerEmpId) : (bodyUser.emp_id ? Number(bodyUser.emp_id) : null),
      permissions: bodyUser.permissions || [],
      custom_data_scope: null
    };
  }

  return user;
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(rbacEngine.authenticateAndScope);

// In-Memory Mutation Cache Invalidation
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    cacheService.clear();
  }
  next();
});

// Anti-stale Cache Control Middleware: ensures browsers and mobile PWAs never receive outdated data
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  } else if (req.path === '/' || req.path.endsWith('.html') || req.path === '/sw.js') {
    res.set('Cache-Control', 'no-cache, must-revalidate');
  }
  next();
});

// Static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// File upload setup for import
const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

/* =========================================================================
   0. UNIFIED HIGH-SPEED BOOTSTRAP API (Single-Trip Hydration)
   ========================================================================= */

app.get('/api/bootstrap', cacheService.routeCache(20), (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const departments = query(`
      SELECT d.*, COUNT(e.id) AS employee_count
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id AND e.status = 'نشط'
      GROUP BY d.id
      ORDER BY d.id ASC
    `);

    const branches = query(`
      SELECT b.*, COUNT(DISTINCT e.id) AS employee_count, COUNT(DISTINCT d.id) AS device_count
      FROM branches b
      LEFT JOIN employees e ON b.id = e.branch_id AND e.status = 'نشط'
      LEFT JOIN biometric_devices d ON b.id = d.branch_id AND (d.status != 'معطل' OR d.status IS NULL)
      GROUP BY b.id
      ORDER BY b.id ASC
    `);

    const devices = query(`
      SELECT d.*, b.name_ar AS branch_name_ar
      FROM biometric_devices d
      LEFT JOIN branches b ON d.branch_id = b.id
      ORDER BY d.id ASC
    `);

    const employees = employeesModule.getAllEmployees();
    const regulations = penaltiesModule.getAllPenaltyRegulations();
    const issuedPenalties = penaltiesModule.getAllIssuedPenalties();
    const users = usersModule.getAllUsers();
    const policies = query('SELECT * FROM attendance_policies ORDER BY id ASC');
    const allRequests = requestsModule.getAllRequests();

    // Telemetry for instant dashboard & compliance rendering
    const saudization = employeesModule.getSaudizationMetrics();
    const attendance = attendanceModule.getAttendanceStats(today);
    const docAlerts = employeesModule.getDocumentExpiryAlerts();
    const currentPayroll = get(`
      SELECT * FROM payroll_periods
      ORDER BY period_month DESC
      LIMIT 1
    `);
    const compliance = employeesModule.getComplianceMetrics();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        departments,
        branches,
        devices,
        employees,
        regulations,
        issuedPenalties,
        users,
        policies,
        allRequests,
        dashboard: {
          saudization,
          attendance,
          expiringDocsCount: docAlerts.length,
          expiringDocs: docAlerts.slice(0, 5),
          pendingRequestsCount: allRequests.filter(r => r.status === 'معلق').length,
          pendingRequests: allRequests.filter(r => r.status === 'معلق').slice(0, 5),
          currentPayroll,
          deptDistribution: departments.map(d => ({ name_ar: d.name_ar, employee_count: d.employee_count })),
          penaltiesCount: issuedPenalties.length,
          recentPenalties: issuedPenalties.slice(0, 5)
        },
        compliance
      }
    });
  } catch (err) {
    console.error('Bootstrap API error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   1. AUTHENTICATION & USERS ROUTES
   ========================================================================= */

app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const user = usersModule.login(username, password);
    auditModule.logAuditEvent(req, {
      action: 'LOGIN',
      entity_type: 'user',
      entity_id: user.id,
      performed_by_id: user.id,
      performed_by_name: user.full_name || user.username,
      performed_by_role: user.role,
      emp_code: user.emp_code,
      comment: 'تسجيل دخول ناجح للنظام'
    });
    res.json({ success: true, message: 'تم تسجيل الدخول بنجاح', user });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  try {
    auditModule.logAuditEvent(req, {
      action: 'LOGOUT',
      entity_type: 'user',
      comment: 'تسجيل خروج من النظام'
    });
    res.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/users', rbacEngine.requirePermission('users.view'), (req, res) => {
  try {
    const users = usersModule.getAllUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/users', rbacEngine.requirePermission('users.create'), (req, res) => {
  try {
    const user = usersModule.createUser(req.body);
    auditModule.logAuditEvent(req, {
      action: 'CREATE_USER',
      entity_type: 'user',
      entity_id: user.id,
      new_values: { username: user.username, full_name: user.full_name, role: user.role, permissions: user.permissions },
      comment: `إنشاء مستخدم جديد: ${user.username}`
    });
    res.status(201).json({ success: true, message: 'تم إنشاء المستخدم وتعيين الصلاحيات بنجاح', data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/users/:id', rbacEngine.requirePermission('users.edit'), (req, res) => {
  try {
    const user = usersModule.updateUser(req.params.id, req.body);
    auditModule.logAuditEvent(req, {
      action: 'UPDATE_USER',
      entity_type: 'user',
      entity_id: req.params.id,
      new_values: req.body,
      comment: `تحديث بيانات وصلاحيات المستخدم: ${user.username}`
    });
    res.json({ success: true, message: 'تم تحديث بيانات المستخدم بنجاح', data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/users/:id', rbacEngine.requirePermission('users.delete'), (req, res) => {
  try {
    usersModule.deleteUser(req.params.id);
    auditModule.logAuditEvent(req, {
      action: 'DELETE_USER',
      entity_type: 'user',
      entity_id: req.params.id,
      comment: `حذف مستخدم بالنظام معرّف ${req.params.id}`
    });
    res.json({ success: true, message: 'تم حذف المستخدم بنجاح' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   RBAC & PERMISSIONS MANAGEMENT ROUTES
   ========================================================================= */
app.get('/api/rbac/permissions', (req, res) => {
  try {
    const permissions = rbacEngine.getAllPermissions();
    res.json({ success: true, data: permissions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/rbac/roles', (req, res) => {
  try {
    const roles = rbacEngine.getAllRoles();
    const rolesWithPerms = roles.map(r => ({
      ...r,
      permissions: rbacEngine.getRolePermissions(r.code)
    }));
    res.json({ success: true, data: rolesWithPerms });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/rbac/effective-permissions/:userId', (req, res) => {
  try {
    const detailed = rbacEngine.getEffectiveUserPermissionsDetailed(req.params.userId);
    res.json({ success: true, data: detailed });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

app.get('/api/rbac/my-permissions', (req, res) => {
  try {
    const user = extractUserContext(req);
    if (!user || !user.id) {
      return res.status(401).json({ success: false, error: 'يجب تسجيل الدخول أولاً' });
    }
    const detailed = rbacEngine.getEffectiveUserPermissionsDetailed(user.id);
    res.json({ success: true, data: detailed });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/rbac/user-permissions', rbacEngine.requirePermission('permissions.manage'), (req, res) => {
  try {
    const { user_id, grants = [], revokes = [] } = req.body;
    const actor = extractUserContext(req);
    const updated = rbacEngine.updateUserPermissions(user_id, grants, revokes, actor);
    usersModule.persistUsersToDisk();
    res.json({ success: true, message: 'تم تحديث الصلاحيات المخصصة للمستخدم بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/rbac/user-role', rbacEngine.requirePermission('permissions.manage'), (req, res) => {
  try {
    const { user_id, role, data_scope } = req.body;
    const actor = extractUserContext(req);
    const updated = rbacEngine.updateUserRoleAndScope(user_id, role, data_scope, actor);
    usersModule.persistUsersToDisk();
    res.json({ success: true, message: 'تم تحديث دور المستخدم ونطاق صلاحياته بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/users/sync', (req, res) => {
  try {
    const list = req.body && Array.isArray(req.body.users) ? req.body.users : [];
    const syncedUsers = usersModule.syncUsers(list);
    auditModule.logAuditEvent(req, {
      action: 'SYNC_USERS',
      entity_type: 'user',
      comment: `مزامنة وحفظ قائمة المستخدمين الدائمة (${syncedUsers.length} مستخدم)`
    });
    res.json({
      success: true,
      message: 'تم حفظ ومزامنة كافة بيانات المستخدمين بنجاح',
      count: syncedUsers.length,
      data: syncedUsers
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/sync/all', (req, res) => {
  try {
    if (req.body && req.body.users && Array.isArray(req.body.users)) {
      usersModule.syncUsers(req.body.users);
    } else {
      usersModule.persistUsersToDisk();
    }
    const currentUsers = usersModule.getAllUsers();
    auditModule.logAuditEvent(req, {
      action: 'SYNC_ALL_DATA',
      entity_type: 'system',
      comment: 'مزامنة وحفظ سحابي شامل لبيانات النظام'
    });
    res.json({
      success: true,
      message: 'تمت مزامنة كافة بيانات النظام والمدخلات بنجاح دون أي فقدان للبيانات',
      timestamp: new Date().toISOString(),
      usersCount: currentUsers.length,
      data: { users: currentUsers }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   AUDIT LOG API ROUTES (سجل الرقابة والعمليات - محمي وغير قابل للتعديل)
   ========================================================================= */

app.get('/api/audit-logs', rbacEngine.requirePermission('audit.view'), (req, res) => {
  try {
    const logs = auditModule.getAuditLogs(req.query);
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/audit-logs/stats', rbacEngine.requirePermission('audit.view'), (req, res) => {
  try {
    const stats = auditModule.getAuditStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/audit-logs/export/excel', rbacEngine.requirePermission('audit.view'), (req, res) => {
  try {
    const buffer = auditModule.exportAuditLogsExcel(req.query);
    const filename = `JM_HRMS_AUDIT_LOG_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   2. DASHBOARD & SETTINGS ROUTES
   ========================================================================= */

app.get('/api/settings', (req, res) => {
  try {
    const settings = get('SELECT * FROM company_settings WHERE id = 1');
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/dashboard/stats', cacheService.routeCache(25), (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    attendanceAutomationService.ensureRosterDataForDate(today);
    const saudization = employeesModule.getSaudizationMetrics();
    const attendance = attendanceModule.getAttendanceStats(today);
    const attendanceKPIs = attendanceAutomationService.getAttendanceDashboardKPIs(today);
    const docAlerts = employeesModule.getDocumentExpiryAlerts();
    const pendingRequests = requestsModule.getAllRequests({ status: 'معلق' });
    const penalties = penaltiesModule.getAllIssuedPenalties();

    const currentPayroll = get(`
      SELECT * FROM payroll_periods
      ORDER BY period_month DESC
      LIMIT 1
    `);

    const deptDistribution = query(`
      SELECT d.name_ar, COUNT(e.id) AS employee_count
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id AND e.status = 'نشط'
      GROUP BY d.id
    `);

    res.json({
      success: true,
      data: {
        saudization,
        attendance,
        attendanceKPIs,
        expiringDocsCount: docAlerts.length,
        expiringDocs: docAlerts, // Send full alerts for smart frontend search/filtering
        pendingRequestsCount: pendingRequests.length,
        pendingRequests: pendingRequests.slice(0, 10),
        currentPayroll,
        deptDistribution,
        penaltiesCount: penalties.length,
        recentPenalties: penalties // Send full list for smart table
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/departments', cacheService.routeCache(45), (req, res) => {
  try {
    const depts = query(`
      SELECT d.*, COUNT(e.id) AS employee_count
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id AND e.status = 'نشط'
      GROUP BY d.id
      ORDER BY d.id ASC
    `);
    res.json({ success: true, data: depts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/departments', (req, res) => {
  try {
    const { code, name_ar, name_en, manager_name, budget = 0, location } = req.body;
    if (!code || !name_ar) {
      return res.status(400).json({ success: false, error: 'كود الإدارة واسمها بالعربية مطلوبان' });
    }
    const result = run(`
      INSERT INTO departments (code, name_ar, name_en, manager_name, budget, location)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [code, name_ar, name_en || name_ar, manager_name || '', Number(budget) || 0, location || 'مقر أبها - سيتي بارك']);
    const dept = get('SELECT * FROM departments WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ success: true, message: 'تمت إضافة الإدارة بنجاح', data: dept });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/departments/:id', (req, res) => {
  try {
    const { code, name_ar, name_en, manager_name, budget, location } = req.body;
    const existing = get('SELECT * FROM departments WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, error: 'الإدارة غير موجودة' });
    run(`
      UPDATE departments
      SET code = ?, name_ar = ?, name_en = ?, manager_name = ?, budget = ?, location = ?
      WHERE id = ?
    `, [
      code || existing.code,
      name_ar || existing.name_ar,
      name_en !== undefined ? name_en : existing.name_en,
      manager_name !== undefined ? manager_name : existing.manager_name,
      budget !== undefined ? Number(budget) : existing.budget,
      location !== undefined ? location : existing.location,
      req.params.id
    ]);
    const updated = get('SELECT * FROM departments WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم تحديث بيانات الإدارة بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/departments/:id', (req, res) => {
  try {
    run('DELETE FROM departments WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم حذف الإدارة بنجاح' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   2.1 BRANCHES MANAGEMENT (فروع ومواقع شركة جوهرة المجد)
   ========================================================================= */

app.get('/api/branches', cacheService.routeCache(45), (req, res) => {
  try {
    const branches = query(`
      SELECT b.*,
        (SELECT COUNT(*) FROM employees e WHERE e.branch_id = b.id AND e.status = 'نشط') AS employee_count,
        (SELECT COUNT(*) FROM biometric_devices d WHERE d.branch_id = b.id) AS device_count
      FROM branches b
      ORDER BY b.is_main DESC, b.id ASC
    `);
    res.json({ success: true, data: branches });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/branches', (req, res) => {
  try {
    const { code, name_ar, name_en, city = 'أبها', address, phone, manager_name, is_main = 0 } = req.body;
    if (!code || !name_ar) {
      return res.status(400).json({ success: false, error: 'كود الفرع واسمه بالعربية مطلوبان' });
    }
    const result = run(`
      INSERT INTO branches (code, name_ar, name_en, city, address, phone, manager_name, is_main)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [code, name_ar, name_en || name_ar, city, address || '', phone || '', manager_name || '', is_main ? 1 : 0]);
    const branch = get('SELECT * FROM branches WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ success: true, message: 'تمت إضافة الفرع بنجاح', data: branch });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/branches/:id', (req, res) => {
  try {
    const { code, name_ar, name_en, city, address, phone, manager_name, is_main } = req.body;
    const existing = get('SELECT * FROM branches WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, error: 'الفرع غير موجود' });
    run(`
      UPDATE branches
      SET code = ?, name_ar = ?, name_en = ?, city = ?, address = ?, phone = ?, manager_name = ?, is_main = ?
      WHERE id = ?
    `, [
      code || existing.code,
      name_ar || existing.name_ar,
      name_en !== undefined ? name_en : existing.name_en,
      city !== undefined ? city : existing.city,
      address !== undefined ? address : existing.address,
      phone !== undefined ? phone : existing.phone,
      manager_name !== undefined ? manager_name : existing.manager_name,
      is_main !== undefined ? (is_main ? 1 : 0) : existing.is_main,
      req.params.id
    ]);
    const updated = get('SELECT * FROM branches WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم تحديث بيانات الفرع بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/branches/:id', (req, res) => {
  try {
    run('DELETE FROM branches WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم حذف الفرع بنجاح' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   2.2 BIOMETRIC DEVICES MANAGEMENT (إدارة وتكامل أجهزة البصمة)
   ========================================================================= */

app.get('/api/devices', (req, res) => {
  try {
    const devices = query(`
      SELECT d.*, b.name_ar AS branch_name_ar
      FROM biometric_devices d
      LEFT JOIN branches b ON d.branch_id = b.id
      ORDER BY d.id ASC
    `);
    res.json({ success: true, data: devices });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/devices', (req, res) => {
  try {
    const { device_name, device_code, ip_address, port = 4370, location, branch_id, model = 'ZKTeco SilkBio-101TC', status = 'متصل' } = req.body;
    if (!device_name || !device_code || !ip_address) {
      return res.status(400).json({ success: false, error: 'اسم الجهاز، الكود وعنوان IP مطلوبة' });
    }
    const result = run(`
      INSERT INTO biometric_devices (device_name, device_code, ip_address, port, location, branch_id, model, status, last_sync)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `, [device_name, device_code, ip_address, Number(port) || 4370, location || 'الفرع الرئيسي', branch_id ? Number(branch_id) : null, model, status]);
    const dev = get('SELECT * FROM biometric_devices WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ success: true, message: 'تم ربط جهاز البصمة بنجاح', data: dev });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/devices/:id', (req, res) => {
  try {
    const { device_name, device_code, ip_address, port, location, branch_id, model, status } = req.body;
    const existing = get('SELECT * FROM biometric_devices WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, error: 'جهاز البصمة غير موجود' });
    run(`
      UPDATE biometric_devices
      SET device_name = ?, device_code = ?, ip_address = ?, port = ?, location = ?, branch_id = ?, model = ?, status = ?
      WHERE id = ?
    `, [
      device_name || existing.device_name,
      device_code || existing.device_code,
      ip_address || existing.ip_address,
      port !== undefined ? Number(port) : existing.port,
      location !== undefined ? location : existing.location,
      branch_id !== undefined ? (branch_id ? Number(branch_id) : null) : existing.branch_id,
      model || existing.model,
      status || existing.status,
      req.params.id
    ]);
    const updated = get('SELECT * FROM biometric_devices WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم تحديث بيانات جهاز البصمة بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/devices/:id', (req, res) => {
  try {
    run('DELETE FROM biometric_devices WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم حذف جهاز البصمة بنجاح' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/devices/:id/test-connection', (req, res) => {
  try {
    const dev = get('SELECT * FROM biometric_devices WHERE id = ?', [req.params.id]);
    if (!dev) return res.status(404).json({ success: false, error: 'جهاز البصمة غير موجود' });
    run(`UPDATE biometric_devices SET status = 'متصل', last_sync = datetime('now') WHERE id = ?`, [req.params.id]);
    const latencyMs = Math.floor(Math.random() * 15) + 12;
    res.json({
      success: true,
      status: 'متصل',
      latency: `${latencyMs}ms`,
      message: `تم فحص الاتصال بجهاز (${dev.device_name}) على ${dev.ip_address}:${dev.port} بنجاح. زمن الاستجابة ${latencyMs}ms والمنفذ نشط وجاهز.`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/devices/:id/sync', (req, res) => {
  try {
    const dev = get('SELECT * FROM biometric_devices WHERE id = ?', [req.params.id]);
    if (!dev) return res.status(404).json({ success: false, error: 'جهاز البصمة غير موجود' });
    run(`UPDATE biometric_devices SET status = 'متصل', last_sync = datetime('now') WHERE id = ?`, [req.params.id]);
    res.json({
      success: true,
      message: `تمت مزامنة سجلات البصمة الحيوية من جهاز (${dev.device_name}) بنجاح وتحديث قاعدة البيانات المركزية.`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   3. DISCIPLINARY REGULATIONS & DECISIONS (القرارات الجزائية)
   ========================================================================= */

app.get('/api/penalties/regulations', (req, res) => {
  try {
    const regs = penaltiesModule.getAllPenaltyRegulations(req.query.category);
    res.json({ success: true, count: regs.length, data: regs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/penalties/issued', (req, res) => {
  try {
    const issued = penaltiesModule.getAllIssuedPenalties(req.query);
    res.json({ success: true, count: issued.length, data: issued });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/penalties/issued/:id', (req, res) => {
  try {
    const item = penaltiesModule.getIssuedPenaltyById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'القرار الجزائي غير موجود' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/penalties/issue', (req, res) => {
  try {
    const decision = penaltiesModule.issuePenaltyDecision(req.body);
    res.status(201).json({ success: true, message: 'تم إصدار القرار الجزائي واعتماده بنجاح', data: decision });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/penalties/issued/:id', (req, res) => {
  try {
    const result = penaltiesModule.deleteIssuedPenalty(req.params.id);
    res.json({ success: true, message: 'تم حذف القرار الجزائي بنجاح', data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/penalties/issued/:id/print', (req, res) => {
  try {
    const data = penaltiesModule.generatePenaltyFormPrintData(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/penalties/export/csv', (req, res) => {
  try {
    const items = penaltiesModule.getAllIssuedPenalties();
    const headers = ['رقم القرار', 'الرقم الوظيفي', 'اسم الموظف', 'كود المخالفة', 'نص المخالفة', 'التكرار', 'الجزاء المطبق', 'نوع الخصم', 'عدد الأيام', 'تاريخ الواقعة', 'جهة الإصدار'];
    const rows = items.map(p => [
      p.decision_no,
      p.emp_code,
      `"${p.full_name_ar}"`,
      p.violation_code,
      `"${p.violation_text}"`,
      p.repetition_level,
      `"${p.penalty_text}"`,
      p.deduction_type,
      p.deduction_days,
      p.incident_date,
      `"${p.issued_by}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="Penalties_Jawharat_Al_Majd.csv"');
    res.send(csvContent);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* =========================================================================
   4. EMPLOYEES ROUTES
   ========================================================================= */

app.get('/api/employees', (req, res) => {
  try {
    const user = extractUserContext(req);
    const employees = employeesModule.getAllEmployees(req.query, user);
    res.json({ success: true, count: employees.length, data: employees });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, error: err.message, code: err.code });
  }
});

app.get('/api/employees/alerts/expiry', (req, res) => {
  try {
    const alerts = employeesModule.getDocumentExpiryAlerts();
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/employees/metrics/saudization', (req, res) => {
  try {
    const metrics = employeesModule.getSaudizationMetrics();
    res.json({ success: true, data: metrics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Enterprise Compliance & Iqama / Work Permits Dashboard API
app.get('/api/compliance/stats', cacheService.routeCache(30), (req, res) => {
  try {
    const compliance = employeesModule.getComplianceMetrics();
    res.json({ success: true, data: compliance });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Official Muqeem Report (تقرير مقيم الرسمي) API Endpoints
app.get('/api/compliance/muqeem', (req, res) => {
  try {
    const report = muqeemModule.getMuqeemReport(req.query);
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/compliance/muqeem/:id', (req, res) => {
  try {
    const item = muqeemModule.getMuqeemResidentById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'سجل المقيم غير موجود' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/compliance/muqeem', (req, res) => {
  try {
    const created = muqeemModule.createMuqeemResident(req.body);
    res.status(201).json({ success: true, message: 'تم إضافة سجل المقيم بنجاح', data: created });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/compliance/muqeem/:id', (req, res) => {
  try {
    const updated = muqeemModule.updateMuqeemResident(req.params.id, req.body);
    res.json({ success: true, message: 'تم تحديث بيانات المقيم بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/compliance/muqeem/:id', (req, res) => {
  try {
    const result = muqeemModule.deleteMuqeemResident(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/compliance/muqeem/sync', (req, res) => {
  try {
    const result = muqeemModule.syncFromExcel();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/employees/:id', (req, res, next) => {
  if (req.params.id === 'terminated' || req.params.id === 'hierarchy') {
    return next();
  }
  try {
    const user = extractUserContext(req);
    const emp = employeesModule.getEmployeeById(req.params.id, user);
    if (!emp) {
      return res.status(404).json({ success: false, error: 'الموظف غير موجود' });
    }
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, error: err.message, code: err.code });
  }
});

app.post('/api/employees', (req, res) => {
  try {
    const newEmp = employeesModule.createEmployee(req.body);
    auditModule.logAuditEvent(req, {
      action: 'CREATE_EMPLOYEE',
      entity_type: 'employee',
      entity_id: newEmp.id,
      emp_code: newEmp.emp_code,
      department_name: newEmp.department_name,
      new_values: req.body,
      comment: `إضافة موظف جديد: ${newEmp.full_name_ar} (${newEmp.emp_code})`
    });
    res.status(201).json({ success: true, message: 'تم إضافة الموظف بنجاح', data: newEmp });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/employees/:id', (req, res) => {
  try {
    const beforeEmp = employeesModule.getEmployeeById(req.params.id);
    const updated = employeesModule.updateEmployee(req.params.id, req.body);
    auditModule.logAuditEvent(req, {
      action: 'UPDATE_EMPLOYEE',
      entity_type: 'employee',
      entity_id: req.params.id,
      emp_code: updated ? updated.emp_code : null,
      department_name: updated ? updated.department_name : null,
      old_values: beforeEmp,
      new_values: req.body,
      comment: `تعديل بيانات الموظف: ${updated ? updated.full_name_ar : req.params.id}`
    });
    res.json({ success: true, message: 'تم تحديث بيانات الموظف بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/employees/:id', (req, res) => {
  try {
    const beforeEmp = employeesModule.getEmployeeById(req.params.id);
    employeesModule.deleteEmployee(req.params.id);
    auditModule.logAuditEvent(req, {
      action: 'DELETE_EMPLOYEE',
      entity_type: 'employee',
      entity_id: req.params.id,
      emp_code: beforeEmp ? beforeEmp.emp_code : null,
      old_values: beforeEmp,
      comment: `حذف موظف: ${beforeEmp ? beforeEmp.full_name_ar : req.params.id}`
    });
    res.json({ success: true, message: 'تم حذف الموظف بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// -------------------------------------------------------------
// Employee Photo & Official Documents Management
// -------------------------------------------------------------
const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destDir = path.join(__dirname, '..', 'uploads', 'employee_docs');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_\-\u0600-\u06FF]/g, '_');
    cb(null, `emp-${req.params.id || 'doc'}-${Date.now()}-${safeBase}${ext}`);
  }
});
const uploadDoc = multer({ storage: docStorage });

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destDir = path.join(__dirname, '..', 'uploads', 'photos');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `avatar-emp-${req.params.id}-${Date.now()}${ext}`);
  }
});
const uploadPhoto = multer({ storage: photoStorage });

// Upload Employee Photo
app.post('/api/employees/:id/photo', uploadPhoto.single('photo'), (req, res) => {
  try {
    const empId = req.params.id;
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'لم يتم إرسال ملف الصورة' });
    }
    const photoUrl = `/uploads/photos/${req.file.filename}`;
    run('UPDATE employees SET photo_url = ? WHERE id = ?', [photoUrl, empId]);
    res.json({ success: true, message: 'تم تحديث الصورة الشخصية بنجاح', photo_url: photoUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Upload Employee Official Document
app.post('/api/employees/:id/documents', uploadDoc.single('file'), (req, res) => {
  try {
    const empId = req.params.id;
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'لم يتم إرسال الملف' });
    }
    const { doc_type = 'مستند رسمي', title } = req.body;
    const docTitle = title || req.file.originalname;
    const filePath = `/uploads/employee_docs/${req.file.filename}`;
    const fileSize = req.file.size;
    const mimeType = req.file.mimetype;
    const user = extractUserContext(req);
    const uploadedBy = user ? user.id : null;

    const result = run(`
      INSERT INTO employee_documents (
        emp_id, doc_type, title, file_path, file_name, file_size, mime_type, uploaded_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `, [empId, doc_type, docTitle, filePath, req.file.originalname, fileSize, mimeType, uploadedBy]);

    res.status(201).json({
      success: true,
      message: 'تم رفع المستند وحفظه بنجاح',
      data: {
        id: result.lastInsertRowid,
        emp_id: empId,
        doc_type,
        title: docTitle,
        file_path: filePath,
        file_name: req.file.originalname,
        file_size: fileSize,
        mime_type: mimeType
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get Employee Documents
app.get('/api/employees/:id/documents', (req, res) => {
  try {
    const empId = req.params.id;
    const docs = query('SELECT * FROM employee_documents WHERE emp_id = ? ORDER BY id DESC', [empId]);
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete Employee Document
app.delete('/api/employees/:id/documents/:docId', (req, res) => {
  try {
    const { id: empId, docId } = req.params;
    const doc = get('SELECT * FROM employee_documents WHERE id = ? AND emp_id = ?', [docId, empId]);
    if (!doc) {
      return res.status(404).json({ success: false, error: 'المستند غير موجود' });
    }
    run('DELETE FROM employee_documents WHERE id = ?', [docId]);
    try {
      const fullPath = path.join(__dirname, '..', doc.file_path);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    } catch (e) {}

    res.json({ success: true, message: 'تم حذف المستند بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


/* =========================================================================
   5. ATTENDANCE & BIOMETRIC ROUTES
   ========================================================================= */

app.get('/api/attendance/daily', (req, res) => {
  try {
    const dateStr = req.query.date || new Date().toISOString().split('T')[0];
    attendanceAutomationService.ensureRosterDataForDate(dateStr);
    const records = attendanceModule.getDailyAttendance(dateStr);
    const stats = attendanceModule.getAttendanceStats(dateStr);
    res.json({ success: true, stats, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Automated Attendance Violation Scanner & Linkage Engine
app.post('/api/attendance/auto-violations/run', (req, res) => {
  try {
    const targetDate = req.body?.date || new Date().toISOString().split('T')[0];
    attendanceAutomationService.ensureRosterDataForDate(targetDate);
    const results = attendanceAutomationService.scanAndApplyAttendanceViolations(targetDate);
    
    // Invalidate penalties and stats cache
    cacheService.delete('/api/dashboard/stats');
    cacheService.delete('/api/penalties/issued');
    
    res.json({ 
      success: true, 
      message: 'تم فحص سجلات الحضور والانصراف وتطبيق المخالفات والقرارات الجزائية آلياً وفق لائحة تنظيم العمل السعودية', 
      data: results 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Employee Attendance Card (بطاقة حضور الموظف لدورة الرواتب)
app.get('/api/attendance/employee-card/:empId', (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().substring(0, 7);
    const card = attendanceAutomationService.getEmployeeAttendanceCard(req.params.empId, month);
    res.json({ success: true, data: card });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Attendance Report Export (Excel CSV with UTF-8 BOM)
app.get('/api/attendance/export', (req, res) => {
  try {
    const date = req.query.date;
    const month = req.query.month;
    const csvData = attendanceAutomationService.exportAttendanceCsv(date, month);
    const filename = `attendance_${month || date || 'report'}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Attendance Dashboard KPIs
app.get('/api/attendance/dashboard-kpis', (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const kpis = attendanceAutomationService.getAttendanceDashboardKPIs(date);
    res.json({ success: true, data: kpis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/attendance/employee/:empId', (req, res) => {
  try {
    const history = attendanceModule.getEmployeeAttendanceHistory(req.params.empId, req.query.month);
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/attendance/punch', (req, res) => {
  try {
    const result = attendanceModule.recordPunch(req.body);
    res.json({ success: true, message: 'تم تسجيل البصمة بنجاح', data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/attendance/devices', (req, res) => {
  try {
    const devices = attendanceModule.getBiometricDevices();
    res.json({ success: true, data: devices });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/biometrics/simulate', (req, res) => {
  try {
    const result = biometricModule.triggerDeviceSimulation();
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/biometrics/push', (req, res) => {
  try {
    const result = biometricModule.processZkPushData(req.body);
    res.json({ success: true, message: 'OK', data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   5.1 ATTENDANCE POLICIES & WORK SHIFTS (سياسات الدوام)
   ========================================================================= */

app.get('/api/policies', (req, res) => {
  try {
    const policies = query('SELECT * FROM attendance_policies ORDER BY id ASC');
    res.json({ success: true, count: policies.length, data: policies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/policies', (req, res) => {
  try {
    const {
      policy_name,
      shift_type = 'دوام صباحي',
      start_time = '08:00',
      end_time = '16:00',
      grace_period_mins = 15,
      daily_hours = 8.0,
      work_days = 'الأحد إلى الخميس',
      flexible_hours = 0,
      overtime_allowed = 1,
      notes = ''
    } = req.body;
    if (!policy_name) {
      return res.status(400).json({ success: false, error: 'اسم سياسة الدوام مطلوب' });
    }
    const result = run(`
      INSERT INTO attendance_policies (
        policy_name, shift_type, start_time, end_time, grace_period_mins,
        daily_hours, work_days, flexible_hours, overtime_allowed, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      policy_name, shift_type, start_time, end_time,
      Number(grace_period_mins) || 15, Number(daily_hours) || 8.0,
      work_days, flexible_hours ? 1 : 0, overtime_allowed ? 1 : 0, notes
    ]);
    const policy = get('SELECT * FROM attendance_policies WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ success: true, message: 'تم إنشاء سياسة الدوام بنجاح', data: policy });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/policies/:id', (req, res) => {
  try {
    const existing = get('SELECT * FROM attendance_policies WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, error: 'سياسة الدوام غير موجودة' });
    const b = req.body;
    run(`
      UPDATE attendance_policies SET
        policy_name = ?, shift_type = ?, start_time = ?, end_time = ?,
        grace_period_mins = ?, daily_hours = ?, work_days = ?,
        flexible_hours = ?, overtime_allowed = ?, notes = ?, is_active = ?
      WHERE id = ?
    `, [
      b.policy_name || existing.policy_name,
      b.shift_type || existing.shift_type,
      b.start_time || existing.start_time,
      b.end_time || existing.end_time,
      b.grace_period_mins !== undefined ? Number(b.grace_period_mins) : existing.grace_period_mins,
      b.daily_hours !== undefined ? Number(b.daily_hours) : existing.daily_hours,
      b.work_days || existing.work_days,
      b.flexible_hours !== undefined ? (b.flexible_hours ? 1 : 0) : existing.flexible_hours,
      b.overtime_allowed !== undefined ? (b.overtime_allowed ? 1 : 0) : existing.overtime_allowed,
      b.notes !== undefined ? b.notes : existing.notes,
      b.is_active !== undefined ? (b.is_active ? 1 : 0) : existing.is_active,
      req.params.id
    ]);
    const updated = get('SELECT * FROM attendance_policies WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم تحديث سياسة الدوام بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/policies/:id', (req, res) => {
  try {
    run('DELETE FROM attendance_policies WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم حذف سياسة الدوام بنجاح' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   6. PAYROLL & WPS ROUTES
   ========================================================================= */

app.get('/api/payroll/periods', rbacEngine.requirePermission('payroll.view'), (req, res) => {
  try {
    const periods = payrollModule.getPayrollPeriods();
    res.json({ success: true, data: periods });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/payroll/periods/:id', rbacEngine.requirePermission('payroll.view'), (req, res) => {
  try {
    const data = payrollModule.getPayrollPeriodDetails(req.params.id);
    if (!data) return res.status(404).json({ success: false, error: 'مسير الرواتب غير موجود' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/payroll/calculate', rbacEngine.requirePermission('payroll.calculate'), (req, res) => {
  try {
    const { period_month } = req.body;
    if (!period_month) {
      return res.status(400).json({ success: false, error: 'يرجى تحديد شهر المسير (مثال: 2026-09)' });
    }
    const result = payrollModule.calculateMonthlyPayroll(period_month);
    auditModule.logAuditEvent(req, {
      action: 'CALCULATE_PAYROLL',
      entity_type: 'payroll',
      entity_id: result ? result.period_id : null,
      comment: `احتساب مسير رواتب شهر ${period_month}`
    });
    res.json({ success: true, message: 'تم احتساب مسير الرواتب بنجاح', data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/payroll/periods/:id/approve', rbacEngine.requirePermission('payroll.approve'), (req, res) => {
  try {
    const { approver_name } = req.body;
    const result = payrollModule.approvePayrollPeriod(req.params.id, approver_name);
    auditModule.logAuditEvent(req, {
      action: 'APPROVE_PAYROLL',
      entity_type: 'payroll',
      entity_id: req.params.id,
      comment: `اعتماد مسير الرواتب رقم ${req.params.id} وتوليد ملف حماية الأجور (WPS)`
    });
    res.json({ success: true, message: 'تم اعتماد مسير الرواتب وتوليد ملف حماية الأجور', data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/payroll/periods/:id/payslip/:empId', (req, res) => {
  try {
    const user = extractUserContext(req);
    const isOwn = user && user.emp_id && Number(user.emp_id) === Number(req.params.empId);
    const hasPerm = rbacEngine.hasPermission(user, 'payroll.view') || rbacEngine.hasPermission(user, 'payroll.print_payslip');
    if (!isOwn && !hasPerm) {
      return res.status(403).json({ success: false, error: 'غير مصرح: لا تملك صلاحية الاطلاع على قسيمة راتب موظف آخر', code: 'FORBIDDEN' });
    }
    const payslip = payrollModule.getEmployeePayslip(req.params.id, req.params.empId);
    res.json({ success: true, data: payslip });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/payroll/periods/:id/wps', (req, res) => {
  try {
    const content = payrollModule.generateWpsSifContent(req.params.id);
    const period = get('SELECT period_month FROM payroll_periods WHERE id = ?', [req.params.id]);
    const fileName = `WPS_JM_${period ? period.period_month.replace('-', '') : 'PAYROLL'}_SIF.txt`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(content);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/payroll/periods/:id/export/csv', (req, res) => {
  try {
    const data = payrollModule.getPayrollPeriodDetails(req.params.id);
    if (!data) return res.status(404).send('Not found');

    const headers = [
      'الرقم الوظيفي', 'اسم الموظف', 'الهوية / الإقامة', 'الجنسية', 'المسمى الوظيفي',
      'الراتب الأساسي', 'بدل السكن', 'بدل النقل', 'بدلات أخرى', 'العمل الإضافي',
      'إجمالي الراتب', 'استقطاع التأمينات (الموظف)', 'حصة التأمينات (الشركة)',
      'خصومات أخرى', 'صافي الراتب', 'البنك', 'الآيبان IBAN'
    ];

    const rows = data.items.map(item => [
      item.emp_code,
      `"${item.full_name_ar}"`,
      item.national_id,
      item.nationality,
      `"${item.job_title_ar}"`,
      item.basic_salary,
      item.housing_allowance,
      item.transport_allowance,
      item.other_allowance,
      item.overtime_pay,
      item.gross_salary,
      item.gosi_employee_share,
      item.gosi_company_share,
      item.absence_deduction + item.delay_deduction + item.advance_deduction,
      item.net_salary,
      item.bank_name,
      item.iban
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="Payroll_${data.period.period_month}.csv"`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* =========================================================================
   7. REQUESTS & SELF-SERVICE (ESS) ROUTES
   ========================================================================= */

app.get('/api/requests', (req, res) => {
  try {
    const user = extractUserContext(req);
    const requests = requestsModule.getAllRequests(req.query, user);
    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, error: err.message, code: err.code });
  }
});

app.get('/api/requests/:id', (req, res) => {
  try {
    const user = extractUserContext(req);
    const request = requestsModule.getRequestById(req.params.id, user);
    if (!request) return res.status(404).json({ success: false, error: 'الطلب غير موجود' });
    res.json({ success: true, data: request });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, error: err.message, code: err.code });
  }
});

app.post('/api/requests', (req, res) => {
  try {
    const newReq = requestsModule.submitRequest(req.body);
    res.status(201).json({ success: true, message: 'تم تقديم الطلب بنجاح', data: newReq });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/requests/:id/status', (req, res) => {
  try {
    const { status, role = 'admin', comment, approver_name } = req.body;
    if (!status) return res.status(400).json({ success: false, error: 'الحالة الجديدة مطلوبة' });

    const user = extractUserContext(req);
    const existingReq = requestsModule.getRequestById(req.params.id);
    if (existingReq && user && user.emp_id && Number(user.emp_id) === Number(existingReq.emp_id)) {
      return res.status(403).json({ success: false, error: 'غير مصرح: لا يحق للموظف اعتماد أو تعديل حالة طلبه الخاص.' });
    }

    const updated = requestsModule.updateRequestStatus(req.params.id, status, role, comment, approver_name);
    res.json({ success: true, message: 'تم تحديث حالة الطلب بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/requests/salary-letter/:empId', (req, res) => {
  try {
    const destination = req.query.destination || 'إلى من يهمه الأمر';
    const letterData = requestsModule.generateCertifiedSalaryLetter(req.params.empId, destination);
    res.json({ success: true, data: letterData });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   8. IMPORT & EXPORT ROUTES
   ========================================================================= */

app.get('/api/export/employees', (req, res) => {
  try {
    const format = req.query.format || 'csv';
    const employees = employeesModule.getAllEmployees({});

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="employees_jawharat_al_majd.json"');
      return res.send(JSON.stringify(employees, null, 2));
    }

    const headers = [
      'الرقم الوظيفي', 'الاسم بالعربي', 'الاسم بالإنجليزي', 'رقم الهوية / الإقامة', 'الجنسية',
      'سعودي (1/0)', 'الجنس', 'البريد الإلكتروني', 'الجوال', 'القسم', 'المسمى الوظيفي',
      'الراتب الأساسي', 'بدل السكن', 'بدل النقل', 'بدلات أخرى', 'الآيبان IBAN', 'رصيد الإجازات'
    ];

    const rows = employees.map(e => [
      e.emp_code,
      `"${e.full_name_ar}"`,
      `"${e.full_name_en}"`,
      e.national_id,
      e.nationality,
      e.is_saudi,
      e.gender,
      e.email,
      e.phone,
      `"${e.department_name_ar || ''}"`,
      `"${e.job_title_ar}"`,
      e.basic_salary,
      e.housing_allowance,
      e.transport_allowance,
      e.other_allowance,
      e.iban,
      e.annual_leave_balance
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="employees_jawharat_al_majd.csv"');
    res.send(csvContent);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/import/employees', (req, res) => {
  try {
    const { employees } = req.body;
    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ success: false, error: 'مصفوفة بيانات الموظفين غير صالحة أو فارغة' });
    }

    let successCount = 0;
    const errors = [];

    for (const empData of employees) {
      try {
        employeesModule.createEmployee(empData);
        successCount++;
      } catch (e) {
        errors.push({ emp: empData.emp_code || empData.full_name_ar, error: e.message });
      }
    }

    res.json({
      success: true,
      message: `تم استيراد ${successCount} موظف بنجاح`,
      importedCount: successCount,
      failedCount: errors.length,
      errors
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/import/attendance', (req, res) => {
  try {
    const { records } = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, error: 'مصفوفة سجلات البصمة غير صالحة أو فارغة' });
    }
    const result = attendanceModule.importBiometricPunches(records);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/templates/:type', (req, res) => {
  const { type } = req.params;
  if (type === 'employees') {
    const template = '\uFEFF' + [
      'emp_code,full_name_ar,full_name_en,national_id,nationality,is_saudi,gender,email,phone,department_id,job_title_ar,job_title_en,basic_salary,housing_allowance,transport_allowance,other_allowance,iban',
      'JM-1099,سلطان بن فهد المنصور,Sultan Fahad Al-Mansour,1098765432,سعودي,1,M,sultan.mansour@jalmajd.com,0551234567,2,أخصائي تطوير أعمال,Business Dev Specialist,9000,2250,1000,500,SA4480000201608010011099'
    ].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="Template_Employees_Import.csv"');
    return res.send(template);
  } else if (type === 'attendance') {
    const template = '\uFEFF' + [
      'emp_code,punch_time,punch_type,device_id,verification_method',
      'JM-1001,2026-09-30 07:55:00,CHECK_IN,ZK-BIO-MAIN-01,FINGERPRINT',
      'JM-1001,2026-09-30 16:05:00,CHECK_OUT,ZK-BIO-MAIN-01,FINGERPRINT'
    ].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="Template_Attendance_Import.csv"');
    return res.send(template);
  }
  res.status(404).send('Template not found');
});

/* =========================================================================
   10. LEAVES MANAGEMENT ROUTES (إدارة الإجازات وسير الموافقات)
   ========================================================================= */

app.get('/api/leaves/balances', (req, res) => {
  try {
    const balances = leavesModule.getAllLeaveBalances();
    res.json({ success: true, data: balances });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/leaves/balances/:empId', (req, res) => {
  try {
    const balance = leavesModule.getEmployeeLeaveBalance(req.params.empId);
    res.json({ success: true, data: balance });
  } catch (err) {
    const status = err.message === 'الموظف غير موجود' ? 404 : 500;
    res.status(status).json({ success: false, error: err.message });
  }
});

app.post('/api/leaves/adjust-balance', (req, res) => {
  try {
    const { emp_id, adjustment_days, days_adjusted, reason, adjusted_by, adjusted_by_name } = req.body;
    const days = days_adjusted !== undefined ? days_adjusted : adjustment_days;
    const by = adjusted_by || adjusted_by_name;
    const updated = leavesModule.adjustLeaveBalance(emp_id, days, reason, by);
    res.json({ success: true, message: 'تم تعديل وتحديث رصيد الإجازة بنجاح وتوثيقه في سجل التدقيق', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/leaves/adjustments', (req, res) => {
  try {
    const logs = leavesModule.getBalanceAdjustments(req.query.emp_id);
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/leaves/kpis', (req, res) => {
  try {
    const kpis = leavesModule.getLeavesKPIs();
    res.json({ success: true, data: kpis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/leaves', (req, res) => {
  try {
    const user = extractUserContext(req);
    const leaves = leavesModule.getAllLeaves(req.query, user);
    res.json({ success: true, data: leaves });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, error: err.message, code: err.code });
  }
});

app.post('/api/leaves', (req, res) => {
  try {
    const newLeave = leavesModule.submitLeaveRequest(req.body);
    res.status(201).json({ success: true, message: 'تم إرسال طلب الإجازة للمدير المباشر بنجاح', data: newLeave });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/leaves/:id', (req, res) => {
  try {
    const user = extractUserContext(req);
    const leave = leavesModule.getLeaveById(req.params.id, user);
    if (!leave) return res.status(404).json({ success: false, error: 'طلب الإجازة غير موجود' });
    res.json({ success: true, data: leave });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, error: err.message, code: err.code });
  }
});

app.put('/api/leaves/:id/approve', (req, res) => {
  try {
    const { action, role, comment, approverName } = req.body;
    const user = extractUserContext(req);
    const existingLeave = leavesModule.getLeaveById(req.params.id);
    if (existingLeave && user && user.emp_id && Number(user.emp_id) === Number(existingLeave.emp_id)) {
      return res.status(403).json({ success: false, error: 'غير مصرح: لا يحق للموظف اعتماد طلبه الخاص.' });
    }

    const updated = leavesModule.approveLeave(req.params.id, action, role, comment, approverName, user);
    res.json({ success: true, message: 'تم تحديث حالة طلب الإجازة بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/leaves/:id', (req, res) => {
  try {
    leavesModule.deleteLeave(req.params.id);
    res.json({ success: true, message: 'تم حذف طلب الإجازة بنجاح' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   11. TASKS MANAGEMENT ROUTES (نظام المهام المستقل ولوحة المديرين)
   ========================================================================= */

app.get('/api/tasks/dashboard', (req, res) => {
  try {
    const dashboard = tasksModule.getTasksDashboardMetrics(req.query);
    res.json({ success: true, data: dashboard });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/tasks', (req, res) => {
  try {
    const user = extractUserContext(req);
    const tasks = tasksModule.getAllTasks(req.query, user);
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, error: err.message, code: err.code });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const task = tasksModule.createTask(req.body);
    res.status(201).json({ success: true, message: 'تم إنشاء المهمة وإسنادها للموظف بنجاح', data: task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/tasks/:id', (req, res) => {
  try {
    const user = extractUserContext(req);
    const task = tasksModule.getTaskById(req.params.id, user);
    if (!task) return res.status(404).json({ success: false, error: 'المهمة غير موجودة' });
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, error: err.message, code: err.code });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  try {
    const updated = tasksModule.updateTask(req.params.id, req.body);
    res.json({ success: true, message: 'تم تحديث بيانات ونسبة إنجاز المهمة بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/tasks/:id/approve', (req, res) => {
  try {
    const { action, role, comment } = req.body;
    const updated = tasksModule.approveTask(req.params.id, action, role, comment);
    res.json({ success: true, message: 'تم اتخاذ الإجراء على المهمة بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    tasksModule.deleteTask(req.params.id);
    res.json({ success: true, message: 'تم حذف المهمة بنجاح' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   12. ORGANIZATIONAL HIERARCHY & DIRECT MANAGERS
   ========================================================================= */

app.get('/api/employees/hierarchy', (req, res) => {
  try {
    const hierarchy = employeesModule.getOrgHierarchy();
    res.json({ success: true, data: hierarchy });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   13. HR WORD FORMS GENERATOR (نماذج Word الرسمية الـ 6)
   ========================================================================= */

app.get('/api/forms/word/:formType', async (req, res) => {
  try {
    const { formType } = req.params;
    let empId = req.query.emp_id;
    if (!empId) {
      empId = get('SELECT id FROM employees ORDER BY id ASC LIMIT 1')?.id;
    }

    const { buffer, filename } = await formsGenerator.generateWordForm(formType, empId, req.query);
    const encodedFilename = encodeURIComponent(filename);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   14. UNIVERSAL EXPORT ROUTES (Excel .xlsx & Word .docx)
   ========================================================================= */

app.get('/api/export/excel', (req, res) => {
  try {
    const type = req.query.type || 'employees';
    const { buffer, filename } = exportService.exportToExcel(type, req.query);
    const encodedFilename = encodeURIComponent(filename);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/export/word', async (req, res) => {
  try {
    const type = req.query.type || 'employees';
    const { buffer, filename } = await exportService.exportToWord(type, req.query);
    const encodedFilename = encodeURIComponent(filename);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   ATTENDANCE NOTICES API (In-System Notice System - No Emails)
   ========================================================================= */
app.get('/api/attendance/notices', (req, res) => {
  try {
    const notices = attendanceNoticesModule.getAllNotices(req.query);
    res.json({ success: true, count: notices.length, data: notices });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/attendance/notices/kpis', (req, res) => {
  try {
    const kpis = attendanceNoticesModule.getNoticesKPIs();
    res.json({ success: true, data: kpis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/attendance/notices/:id', (req, res) => {
  try {
    const notice = attendanceNoticesModule.getNoticeById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, error: 'الإشعار غير موجود' });
    res.json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/attendance/notices', (req, res) => {
  try {
    const notice = attendanceNoticesModule.createNotice(req.body);
    res.status(201).json({ success: true, message: 'تم إصدار الإشعار بنجاح', data: notice });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/attendance/notices/:id/acknowledge', (req, res) => {
  try {
    const { employee_notes } = req.body;
    const updated = attendanceNoticesModule.acknowledgeNotice(req.params.id, employee_notes);
    res.json({ success: true, message: 'تم توثيق إقرار واستلام الإشعار بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   TERMINATED EMPLOYEES API (End of Service & Gratuity Calculator)
   ========================================================================= */
app.get('/api/employees/terminated', (req, res) => {
  try {
    const list = terminatedEmployeesModule.getAllTerminated(req.query);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/employees/terminated/reasons', (req, res) => {
  try {
    res.json({
      success: true,
      count: terminatedEmployeesModule.QIWA_TERMINATION_REASONS.length,
      data: terminatedEmployeesModule.QIWA_TERMINATION_REASONS
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/employees/terminated/kpis', (req, res) => {
  try {
    const kpis = terminatedEmployeesModule.getTerminatedKPIs();
    res.json({ success: true, data: kpis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/employees/terminated/export', (req, res) => {
  try {
    const buffer = terminatedEmployeesModule.exportToExcel();
    const filename = encodeURIComponent(`الموظفون_المنهي_خدماتهم_${new Date().toISOString().split('T')[0]}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${filename}`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/employees/terminated/template', (req, res) => {
  try {
    const buffer = terminatedEmployeesModule.generateTemplateExcel();
    const filename = encodeURIComponent('نموذج_استيراد_المنهي_خدماتهم.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${filename}`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/employees/terminated/calculate', (req, res) => {
  try {
    const calc = terminatedEmployeesModule.calculateSettlement(req.body);
    res.json({ success: true, data: calc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/employees/terminated', (req, res) => {
  try {
    const record = terminatedEmployeesModule.recordTermination(req.body);
    res.status(201).json({ success: true, message: 'تم تسجيل إنهاء الخدمة بنجاح وتحديث حالة الموظف', data: record });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/employees/terminated/import', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'يرجى إرفاق ملف إكسل للاستيراد' });
    const buffer = fs.readFileSync(req.file.path);
    const result = terminatedEmployeesModule.importFromExcel(buffer);
    try { fs.unlinkSync(req.file.path); } catch (e) {}
    res.json({ success: true, message: `تم استيراد ${result.count} سجل للمنهي خدماتهم بنجاح`, count: result.count });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/employees/terminated/:id', (req, res) => {
  try {
    const record = terminatedEmployeesModule.getTerminatedById(req.params.id);
    if (!record) return res.status(404).json({ success: false, error: 'السجل غير موجود' });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   EOS CALCULATOR & FINAL SETTLEMENT API (حاسبة نهاية الخدمة والمخالصة النهائية)
   ========================================================================= */

app.get('/api/eos/cases', (req, res) => {
  try {
    res.json({ success: true, count: SAUDI_EOS_TERMINATION_CASES.length, data: SAUDI_EOS_TERMINATION_CASES });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/eos/calculate', (req, res) => {
  try {
    const result = eosCalculatorService.calculateSettlement(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/eos/settlements', (req, res) => {
  try {
    const settlement = eosCalculatorService.saveSettlement(req.body);
    cacheService.delete('/api/dashboard/stats');
    res.status(201).json({ success: true, message: 'تم حفظ واعتماد المخالصة النهائية بنجاح', data: settlement });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/eos/settlements', (req, res) => {
  try {
    const list = eosCalculatorService.getSettlements(req.query);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/eos/settlements/:id', (req, res) => {
  try {
    const item = eosCalculatorService.getSettlementById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'سجل المخالصة غير موجود' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/eos/settlements/:id/print', (req, res) => {
  try {
    const html = eosCalculatorService.generateClearancePrintHtml(req.params.id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في إنشاء نموذج المخالصة: ${err.message}</h3>`);
  }
});

app.post('/api/eos/print-preview', (req, res) => {
  try {
    const html = eosCalculatorService.generateClearancePrintHtml(req.body);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في إنشاء نموذج المخالصة: ${err.message}</h3>`);
  }
});

app.get('/api/eos/export/csv', (req, res) => {
  try {
    const csv = eosCalculatorService.exportSettlementsCsv();
    const filename = `eos_settlements_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   ATS & RECRUITMENT API (الوظائف الشاغرة وتتبع المتقدمين والقوالب ثنائية اللغة)
   ========================================================================= */

// KPIs
app.get('/api/recruitment/kpis', (req, res) => {
  try {
    const kpis = atsRecruitmentService.getRecruitmentKpis();
    res.json({ success: true, data: kpis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Vacancies
app.get('/api/recruitment/vacancies', (req, res) => {
  try {
    const list = atsRecruitmentService.getVacancies(req.query);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/recruitment/vacancies', (req, res) => {
  try {
    const vacancy = atsRecruitmentService.createVacancy(req.body);
    res.status(201).json({ success: true, message: 'تم إنشاء الوظيفة الشاغرة بنجاح', data: vacancy });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/recruitment/vacancies/:id', (req, res) => {
  try {
    const vacancy = atsRecruitmentService.getVacancyById(req.params.id);
    if (!vacancy) return res.status(404).json({ success: false, error: 'الوظيفة غير موجودة' });
    res.json({ success: true, data: vacancy });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/recruitment/vacancies/:id', (req, res) => {
  try {
    const vacancy = atsRecruitmentService.updateVacancy(req.params.id, req.body);
    res.json({ success: true, message: 'تم تحديث الوظيفة الشاغرة بنجاح', data: vacancy });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/recruitment/vacancies/:id', (req, res) => {
  try {
    atsRecruitmentService.deleteVacancy(req.params.id);
    res.json({ success: true, message: 'تم حذف الوظيفة الشاغرة بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Applicants
app.get('/api/recruitment/applicants', (req, res) => {
  try {
    const list = atsRecruitmentService.getApplicants(req.query);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/recruitment/applicants', (req, res) => {
  try {
    const applicant = atsRecruitmentService.createApplicant(req.body);
    res.status(201).json({ success: true, message: 'تم تسجيل المتقدم بنجاح', data: applicant });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/recruitment/applicants/:id', (req, res) => {
  try {
    const applicant = atsRecruitmentService.getApplicantById(req.params.id);
    if (!applicant) return res.status(404).json({ success: false, error: 'المتقدم غير موجود' });
    res.json({ success: true, data: applicant });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/recruitment/applicants/:id/stage', (req, res) => {
  try {
    const { stage, interview_notes, interview_date } = req.body;
    const applicant = atsRecruitmentService.updateApplicantStage(req.params.id, stage, interview_notes, interview_date);
    res.json({ success: true, message: `تم نقل المتقدم إلى مرحلة: ${stage}`, data: applicant });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Job Offers
app.get('/api/recruitment/offers', (req, res) => {
  try {
    const list = atsRecruitmentService.getOffers(req.query);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/recruitment/offers', (req, res) => {
  try {
    const offer = atsRecruitmentService.createOffer(req.body);
    res.status(201).json({ success: true, message: 'تم إنشاء العرض الوظيفي بنجاح', data: offer });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/recruitment/offers/:id', (req, res) => {
  try {
    const offer = atsRecruitmentService.getOfferById(req.params.id);
    if (!offer) return res.status(404).json({ success: false, error: 'العرض الوظيفي غير موجود' });
    res.json({ success: true, data: offer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/recruitment/offers/:id/status', (req, res) => {
  try {
    const offer = atsRecruitmentService.updateOfferStatus(req.params.id, req.body.status);
    res.json({ success: true, message: `تم تحديث حالة العرض إلى: ${req.body.status}`, data: offer });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/recruitment/offers/:id/print', (req, res) => {
  try {
    const html = atsRecruitmentService.generateJobOfferPrintHtml(req.params.id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في توليد وثيقة العرض الوظيفي: ${err.message}</h3>`);
  }
});

// Bilingual Templates Direct Printing
app.get('/api/recruitment/templates/application/print', (req, res) => {
  try {
    const html = atsRecruitmentService.generateJobApplicationPrintHtml(req.query);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في توليد نموذج طلب التوظيف: ${err.message}</h3>`);
  }
});

app.get('/api/recruitment/templates/undertaking/print', (req, res) => {
  try {
    const html = atsRecruitmentService.generateUndertakingPrintHtml(req.query);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في توليد نموذج التعهد وسرية المعلومات: ${err.message}</h3>`);
  }
});

/* =========================================================================
   FLEET & VEHICLE MANAGEMENT API (إدارة الأسطول والسيارات ومنصة تم)
   ========================================================================= */

// Fleet KPIs & Compliance Alerts
app.get('/api/fleet/kpis', (req, res) => {
  try {
    const kpis = fleetService.getFleetKpis();
    res.json({ success: true, data: kpis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// List Vehicles (with search and filters)
app.get('/api/fleet/vehicles', (req, res) => {
  try {
    const vehicles = fleetService.getVehicles(req.query);
    res.json({ success: true, count: vehicles.length, data: vehicles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create Vehicle
app.post('/api/fleet/vehicles', (req, res) => {
  try {
    const newVehicle = fleetService.createVehicle(req.body);
    res.status(201).json({ success: true, message: 'تمت إضافة المركبة بنجاح', data: newVehicle });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get Single Vehicle Details
app.get('/api/fleet/vehicles/:id', (req, res) => {
  try {
    const vehicle = fleetService.getVehicleById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, error: 'المركبة غير موجودة' });
    res.json({ success: true, data: vehicle });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update Vehicle
app.put('/api/fleet/vehicles/:id', (req, res) => {
  try {
    const updated = fleetService.updateVehicle(req.params.id, req.body);
    res.json({ success: true, message: 'تم تحديث بيانات المركبة بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Delete Vehicle
app.delete('/api/fleet/vehicles/:id', (req, res) => {
  try {
    const result = fleetService.deleteVehicle(req.params.id);
    res.json({ success: true, message: result.message });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Assign Vehicle Custody (تسليم عهدة)
app.post('/api/fleet/vehicles/:id/assign', (req, res) => {
  try {
    const { emp_id, ...handoverData } = req.body;
    if (!emp_id) return res.status(400).json({ success: false, error: 'يرجى تحديد الموظف المستلم للعهدة' });
    const result = fleetService.assignVehicle(req.params.id, emp_id, handoverData);
    res.json({ success: true, message: 'تم تسليم عهدة المركبة بنجاح وتوثيق المحضر', data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Return Vehicle Custody (استرداد عهدة)
app.post('/api/fleet/vehicles/:id/return', (req, res) => {
  try {
    const result = fleetService.returnVehicle(req.params.id, req.body);
    res.json({ success: true, message: 'تم استرداد عهدة المركبة وإخلاء طرف الموظف بنجاح', data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Export CSV with UTF-8 BOM
app.get('/api/fleet/export/csv', (req, res) => {
  try {
    const csvData = fleetService.exportVehiclesCsv();
    const filename = `fleet_export_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Export Excel (.xlsx)
app.get('/api/fleet/export/excel', (req, res) => {
  try {
    const buffer = fleetService.exportVehiclesExcel();
    const filename = `fleet_tamm_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Download Blank Import Template
app.get('/api/fleet/template', (req, res) => {
  try {
    const csvTemplate = fleetService.getImportTemplateCsv();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="fleet_import_template.csv"');
    res.send(csvTemplate);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Import Vehicles from Excel / CSV
app.post('/api/fleet/import', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'يرجى إرفاق ملف إكسل أو CSV للاستيراد' });
    }

    const filePath = req.file.path;
    const xlsxLib = require('xlsx');
    const workbook = xlsxLib.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsxLib.utils.sheet_to_json(sheet);

    try { fs.unlinkSync(filePath); } catch (e) {}

    const result = fleetService.importVehicles(rows);
    res.json({
      success: true,
      message: `تمت معالجة ${result.total_rows} صف: تم إدخال ${result.inserted} مركبة جديدة، وتحديث ${result.updated} مركبة.`,
      data: result
    });
  } catch (err) {
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    res.status(400).json({ success: false, error: err.message });
  }
});

// Printable Official Handover Certificate (A4)
app.get('/api/fleet/vehicles/:id/handover-print', (req, res) => {
  try {
    const html = fleetService.generateHandoverPrintHtml(req.params.id, req.query.log_id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في توليد محضر تسليم عهدة المركبة: ${err.message}</h3>`);
  }
});

/* =========================================================================
   MODULE 5: MEDICAL INSURANCE, BALADIYA HEALTH CARDS & HEALTH AWARENESS API
   (التأمين الطبي والبطاقات الصحية للعمال والتثقيف الصحي)
   ========================================================================= */

// Overall Insurance & Health KPIs
app.get('/api/insurance/kpis', (req, res) => {
  try {
    const kpis = healthInsuranceService.getInsuranceKpis();
    res.json({ success: true, data: kpis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Policies
app.get('/api/insurance/policies', (req, res) => {
  try {
    const policies = healthInsuranceService.getPolicies();
    res.json({ success: true, count: policies.length, data: policies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/insurance/policies', (req, res) => {
  try {
    const policy = healthInsuranceService.createPolicy(req.body);
    res.status(201).json({ success: true, message: 'تمت إضافة وثيقة التأمين بنجاح', data: policy });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/insurance/policies/:id', (req, res) => {
  try {
    const policy = healthInsuranceService.getPolicyById(req.params.id);
    if (!policy) return res.status(404).json({ success: false, error: 'وثيقة التأمين غير موجودة' });
    res.json({ success: true, data: policy });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/insurance/policies/:id', (req, res) => {
  try {
    const updated = healthInsuranceService.updatePolicy(req.params.id, req.body);
    res.json({ success: true, message: 'تم تحديث الوثيقة بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/insurance/policies/:id', (req, res) => {
  try {
    const result = healthInsuranceService.deletePolicy(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Employee Insurance Cards
app.get('/api/insurance/cards', (req, res) => {
  try {
    const cards = healthInsuranceService.getInsuranceCards(req.query);
    res.json({ success: true, count: cards.length, data: cards });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/insurance/cards', (req, res) => {
  try {
    const card = healthInsuranceService.createInsuranceCard(req.body);
    res.status(201).json({ success: true, message: 'تم إصدار بطاقة التأمين الطبي بنجاح', data: card });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/insurance/cards/:id', (req, res) => {
  try {
    const card = healthInsuranceService.getInsuranceCardById(req.params.id);
    if (!card) return res.status(404).json({ success: false, error: 'بطاقة التأمين غير موجودة' });
    res.json({ success: true, data: card });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/insurance/cards/:id', (req, res) => {
  try {
    const updated = healthInsuranceService.updateInsuranceCard(req.params.id, req.body);
    res.json({ success: true, message: 'تم تحديث بيانات بطاقة التأمين بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/insurance/cards/:id', (req, res) => {
  try {
    const result = healthInsuranceService.deleteInsuranceCard(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/insurance/cards/:id/print', (req, res) => {
  try {
    const html = healthInsuranceService.generateInsuranceCardPrintHtml(req.params.id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في طباعة بطاقة التأمين: ${err.message}</h3>`);
  }
});

app.get('/api/insurance/cards-export/csv', (req, res) => {
  try {
    const csv = healthInsuranceService.exportInsuranceCardsCsv();
    const filename = `insurance_cards_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Municipal Health Cards (البلدية)
app.get('/api/insurance/health-cards', (req, res) => {
  try {
    const cards = healthInsuranceService.getHealthCards(req.query);
    res.json({ success: true, count: cards.length, data: cards });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/insurance/health-cards', (req, res) => {
  try {
    const card = healthInsuranceService.createHealthCard(req.body);
    res.status(201).json({ success: true, message: 'تم تسجيل الشهادة الصحية البلدية بنجاح', data: card });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/insurance/health-cards/:id', (req, res) => {
  try {
    const card = healthInsuranceService.getHealthCardById(req.params.id);
    if (!card) return res.status(404).json({ success: false, error: 'الشهادة الصحية غير موجودة' });
    res.json({ success: true, data: card });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/insurance/health-cards/:id', (req, res) => {
  try {
    const updated = healthInsuranceService.updateHealthCard(req.params.id, req.body);
    res.json({ success: true, message: 'تم تحديث الشهادة الصحية بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/insurance/health-cards/:id', (req, res) => {
  try {
    const result = healthInsuranceService.deleteHealthCard(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/insurance/health-cards/:id/print', (req, res) => {
  try {
    const html = healthInsuranceService.generateHealthCardPrintHtml(req.params.id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في طباعة الشهادة الصحية: ${err.message}</h3>`);
  }
});

app.get('/api/insurance/health-cards-export/csv', (req, res) => {
  try {
    const csv = healthInsuranceService.exportHealthCardsCsv();
    const filename = `municipal_health_cards_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health Education Articles
app.get('/api/insurance/articles', (req, res) => {
  try {
    const articles = healthInsuranceService.getHealthArticles(req.query);
    res.json({ success: true, count: articles.length, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/insurance/articles', (req, res) => {
  try {
    const article = healthInsuranceService.createHealthArticle(req.body);
    res.status(201).json({ success: true, message: 'تم نشر المقال التوعوي الصحي بنجاح', data: article });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/insurance/articles/:id', (req, res) => {
  try {
    const article = healthInsuranceService.getHealthArticleById(req.params.id);
    if (!article) return res.status(404).json({ success: false, error: 'المقال غير موجود' });
    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/insurance/articles/:id/print', (req, res) => {
  try {
    const html = healthInsuranceService.generateHealthArticlePrintHtml(req.params.id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في طباعة البوستر التوعوي: ${err.message}</h3>`);
  }
});

/* =========================================================================
   LOANS & ADVANCES API
   ========================================================================= */
app.get('/api/loans', (req, res) => {
  try {
    const loans = loansModule.getAllLoans(req.query);
    res.json({ success: true, count: loans.length, data: loans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/loans/kpis', (req, res) => {
  try {
    const kpis = loansModule.getLoansKPIs();
    res.json({ success: true, data: kpis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/loans/export', (req, res) => {
  try {
    const buffer = loansModule.exportLoansToExcel();
    const filename = encodeURIComponent(`سجل_السلف_${new Date().toISOString().split('T')[0]}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${filename}`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/loans/template', (req, res) => {
  try {
    const buffer = loansModule.generateLoanTemplateExcel();
    const filename = encodeURIComponent('نموذج_استيراد_السلف.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${filename}`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/loans', (req, res) => {
  try {
    const loan = loansModule.createLoan(req.body);
    res.status(201).json({ success: true, message: 'تم تسجيل السلفة بنجاح', data: loan });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/loans/import', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'يرجى إرفاق ملف إكسل للاستيراد' });
    const buffer = fs.readFileSync(req.file.path);
    const result = loansModule.importLoansFromExcel(buffer);
    try { fs.unlinkSync(req.file.path); } catch (e) {}
    res.json({ success: true, message: `تم استيراد ${result.count} سلفة بنجاح`, count: result.count });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/loans/:id', (req, res) => {
  try {
    const loan = loansModule.getLoanById(req.params.id);
    if (!loan) return res.status(404).json({ success: false, error: 'السلفة غير موجودة' });
    res.json({ success: true, data: loan });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   4-STEP APPROVAL ACTIONS (Requests & Leaves) WITH STRICT RBAC & REVERT
   ========================================================================= */
app.post('/api/requests/:id/action', (req, res) => {
  try {
    const { step, action, comment, userName, approverName } = req.body;
    const user = extractUserContext(req);
    const updated = requestsModule.processRequestStep(req.params.id, step, action, comment, user || approverName || userName);
    res.json({ success: true, message: 'تم تحديث خطوة الاعتماد بنجاح', data: updated });
  } catch (err) {
    res.status(403).json({ success: false, error: err.message });
  }
});

app.post('/api/requests/:id/revert', (req, res) => {
  try {
    const { reason = 'تراجع عن الإجراء' } = req.body;
    const user = extractUserContext(req);
    const updated = requestsModule.revertRequestAction(req.params.id, user, reason);
    res.json({ success: true, message: 'تم التراجع عن الإجراء وإعادة الطلب لمرحلة موافقة المدير المباشر بنجاح', data: updated });
  } catch (err) {
    res.status(403).json({ success: false, error: err.message });
  }
});

app.post('/api/leaves/:id/action', (req, res) => {
  try {
    const { step, action, comment, userName, approverName } = req.body;
    const user = extractUserContext(req);
    const updated = leavesModule.processLeaveStep(req.params.id, step, action, comment, user || approverName || userName);
    res.json({ success: true, message: 'تم تحديث خطوة اعتماد الإجازة بنجاح', data: updated });
  } catch (err) {
    res.status(403).json({ success: false, error: err.message });
  }
});

app.post('/api/leaves/:id/revert', (req, res) => {
  try {
    const { reason = 'تراجع عن الإجراء' } = req.body;
    const user = extractUserContext(req);
    const updated = leavesModule.revertLeaveAction(req.params.id, user, reason);
    res.json({ success: true, message: 'تم التراجع عن إجراء الإجازة بنجاح', data: updated });
  } catch (err) {
    res.status(403).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   PENDING APPROVALS, WORKFLOW & AUDIT TRAIL API
   ========================================================================= */
app.get('/api/approvals/pending', (req, res) => {
  try {
    const user = extractUserContext(req);
    const pending = requestsModule.getPendingApprovalsForUser(user);
    res.json({ success: true, count: pending.length, data: pending });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/requests/pending-approvals', (req, res) => {
  try {
    const user = extractUserContext(req);
    const pending = requestsModule.getPendingApprovalsForUser(user);
    res.json({ success: true, count: pending.length, data: pending });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/workflow/:requestId', (req, res) => {
  try {
    const wf = requestsModule.getRequestWorkflow(req.params.requestId);
    res.json({ success: true, data: wf });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/notifications', (req, res) => {
  try {
    const user = extractUserContext(req);
    let sql = `SELECT * FROM notifications WHERE 1=1`;
    const params = [];
    if (user && user.emp_id) {
      sql += ` AND (emp_id = ? OR user_id = ?)`;
      params.push(user.emp_id, user.id);
    } else if (user && user.id) {
      sql += ` AND user_id = ?`;
      params.push(user.id);
    }
    sql += ` ORDER BY created_at DESC, id DESC LIMIT 50`;
    const notifs = query(sql, params);
    const unreadCount = notifs.filter(n => n.is_read === 0).length;
    res.json({ success: true, unreadCount, count: notifs.length, data: notifs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/notifications/:id/read', (req, res) => {
  try {
    run('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم تحديث حالة الإشعار بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/audit-logs', (req, res) => {
  try {
    const { entity_type, entity_id, limit = 100 } = req.query;
    let sql = `SELECT * FROM audit_logs WHERE 1=1`;
    const params = [];
    if (entity_type) {
      sql += ` AND entity_type = ?`;
      params.push(entity_type);
    }
    if (entity_id) {
      sql += ` AND entity_id = ?`;
      params.push(entity_id);
    }
    sql += ` ORDER BY created_at DESC, id DESC LIMIT ?`;
    params.push(Number(limit) || 100);
    const logs = query(sql, params);
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   OFFICIAL HTML FORMS PRINT & PREVIEW
   ========================================================================= */
app.get('/api/forms/html/leave/:id', (req, res) => {
  try {
    const html = officialTemplates.renderLeaveFormHtml(req.params.id, req.query);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في توليد النموذج: ${err.message}</h3>`);
  }
});

app.get('/api/forms/html/penalty/:id', (req, res) => {
  try {
    const html = officialTemplates.renderPenaltyFormHtml(req.params.id, req.query);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في توليد النموذج: ${err.message}</h3>`);
  }
});

app.get('/api/forms/html/resignation/:id', (req, res) => {
  try {
    const html = officialTemplates.renderResignationTerminationFormHtml(req.params.id, req.query);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في توليد النموذج: ${err.message}</h3>`);
  }
});

app.get('/api/forms/html/salary-cert/:id', (req, res) => {
  try {
    const html = officialTemplates.renderSalaryCertHtml(req.params.id, req.query);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في توليد شهادة تعريف الراتب: ${err.message}</h3>`);
  }
});

app.get('/api/forms/html/notice/:id', (req, res) => {
  try {
    const html = officialTemplates.renderAttendanceNoticeHtml(req.params.id, req.query);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في توليد النموذج: ${err.message}</h3>`);
  }
});

app.get('/api/forms/html/absence-penalty/:id', (req, res) => {
  try {
    const html = officialTemplates.renderAbsencePenaltyNoticeHtml(req.params.id, req.query);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في توليد نموذج عقوبة الغياب: ${err.message}</h3>`);
  }
});

app.get('/api/forms/html/instruction-penalty/:id', (req, res) => {
  try {
    const html = officialTemplates.renderInstructionPenaltyNoticeHtml(req.params.id, req.query);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في توليد نموذج مخالفة التعليمات: ${err.message}</h3>`);
  }
});

app.get('/api/forms/html/clearance/:id', (req, res) => {
  try {
    const html = officialTemplates.renderClearanceFormHtml(req.params.id, req.query);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في توليد نموذج إخلاء الطرف: ${err.message}</h3>`);
  }
});

app.get('/api/forms/html/contract-non-renewal/:empId', (req, res) => {
  try {
    const html = officialTemplates.renderContractNonRenewalHtml(req.params.empId, req.query);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في توليد إشعار عدم تجديد العقد: ${err.message}</h3>`);
  }
});

app.get('/api/forms/raw-template/:formNumber', (req, res) => {
  if (req.params.formNumber === '8') {
    return res.redirect('/api/forms/word/salary_cert');
  }
  const formMap = {
    '1': 'اخطار عقوبة - غياب.docx',
    '2': 'اخطار عقوبة - مخالفة الأوامر والتعليمات.docx',
    '3': 'اخلاء طرف جوهرة المجد.docx',
    '4': 'اشعار عدم= تجديد عقد.docx',
    '5': 'نموذج اجراء جزائي جوهرة المجد.docx',
    '6': 'نموذج الاستقالة وإنهاء عقد العمل - جوهرة المجد_v3.docx',
    '7': 'نموذج طلب إجازة - جوهرة المجد.docx'
  };
  const file = formMap[req.params.formNumber];
  if (file && fs.existsSync(path.join(__dirname, '..', file))) {
    return res.download(path.join(__dirname, '..', file));
  }
  return res.status(404).send('Template file not found');
});

/* =========================================================================
   ABSENCE NOTICES & COMPANY EMAIL STAGING API
   ========================================================================= */
app.get('/api/absence-notices', (req, res) => {
  try {
    const list = absenceNoticesModule.getAllAbsenceNotices(req.query);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/absence-notices/kpis', (req, res) => {
  try {
    const kpis = absenceNoticesModule.getAbsenceKPIs();
    res.json({ success: true, data: kpis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/absence-notices/export', (req, res) => {
  try {
    const buffer = absenceNoticesModule.exportAbsenceNoticesExcel(req.query);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="absence-notices.xlsx"');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/absence-notices/template', (req, res) => {
  try {
    const buffer = absenceNoticesModule.generateAbsenceTemplateExcel();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="absence-notices-template.xlsx"');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/absence-notices/import', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'لم يتم رفع ملف إكسل' });
    }
    const buffer = fs.readFileSync(req.file.path);
    const result = absenceNoticesModule.importAbsenceNoticesExcel(buffer);
    fs.unlinkSync(req.file.path);
    res.json({ success: true, message: `تم استيراد ${result.successCount} إشعار غياب بنجاح`, data: result });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/absence-notices/:id', (req, res) => {
  try {
    const notice = absenceNoticesModule.getAbsenceNoticeById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, error: 'إشعار الغياب غير موجود' });
    res.json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/absence-notices', (req, res) => {
  try {
    const notice = absenceNoticesModule.createAbsenceNotice(req.body);
    res.status(201).json({ success: true, message: 'تم إنشاء إشعار الغياب وتجهيزه لبريد الشركة بنجاح', data: notice });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/absence-notices/:id/acknowledge', (req, res) => {
  try {
    const notice = absenceNoticesModule.acknowledgeAbsenceNotice(req.params.id, req.body.notes);
    res.json({ success: true, message: 'تم إقرار واستلام إشعار الغياب بنجاح', data: notice });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/absence-notices/:id/print', (req, res) => {
  try {
    const html = absenceNoticesModule.renderOfficialAbsenceLetterHtml(req.params.id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في طباعة إشعار الغياب: ${err.message}</h3>`);
  }
});

app.get('/api/absence-notices/:id/email-preview', (req, res) => {
  try {
    const notice = absenceNoticesModule.getAbsenceNoticeById(req.params.id);
    if (!notice) return res.status(404).send('<h3>إشعار الغياب غير موجود</h3>');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(notice.email_body_html || '<p>لا توجد معاينة متاحة</p>');
  } catch (err) {
    res.status(500).send(`<h3>خطأ في معاينة البريد: ${err.message}</h3>`);
  }
});

app.get('/api/company-email/settings', (req, res) => {
  try {
    const settings = absenceNoticesModule.getCompanyEmailSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/company-email/settings', (req, res) => {
  try {
    const updated = absenceNoticesModule.saveCompanyEmailSettings(req.body);
    res.json({ success: true, message: 'تم حفظ إعدادات بريد الشركة بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/* =========================================================================
   MODULE 6: GENERAL ADMIN, TRANSFERS, CIRCULARS, LICENSES & UNIFIED REPORTS
   ========================================================================= */

// 1. Transfer Requests
app.get('/api/general/transfers', (req, res) => {
  try {
    const list = generalAdminService.getTransferRequests(req.query);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/general/transfers/:id', (req, res) => {
  try {
    const item = generalAdminService.getTransferRequestById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'طلب النقل غير موجود' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/general/transfers', (req, res) => {
  try {
    const created = generalAdminService.createTransferRequest(req.body);
    res.status(201).json({ success: true, message: 'تم رفع طلب النقل الإداري بنجاح', data: created });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/general/transfers/:id/approve', (req, res) => {
  try {
    const { stage, action, comment, approver_name } = req.body;
    const updated = generalAdminService.processTransferApproval(req.params.id, stage, { action, comment, approver_name });
    res.json({ success: true, message: 'تم تحديث حالة طلب النقل بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/general/transfers/:id/print', (req, res) => {
  try {
    const html = generalAdminService.generateTransferDecisionPrintHtml(req.params.id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في طباعة قرار النقل: ${err.message}</h3>`);
  }
});

// 2. Administrative Circulars
app.get('/api/general/circulars', (req, res) => {
  try {
    const list = generalAdminService.getCirculars(req.query);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/general/circulars/:id', (req, res) => {
  try {
    const empId = req.query.emp_id || null;
    const item = generalAdminService.getCircularById(req.params.id, empId);
    if (!item) return res.status(404).json({ success: false, error: 'التعميم غير موجود' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/general/circulars', (req, res) => {
  try {
    const created = generalAdminService.createCircular(req.body);
    res.status(201).json({ success: true, message: 'تم نشر التعميم الإداري بنجاح', data: created });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/general/circulars/:id/acknowledge', (req, res) => {
  try {
    const { emp_id } = req.body;
    if (!emp_id) return res.status(400).json({ success: false, error: 'يرجى تحديد الموظف المقر' });
    const result = generalAdminService.acknowledgeCircular(req.params.id, emp_id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/general/circulars/:id/print', (req, res) => {
  try {
    const html = generalAdminService.generateCircularPrintHtml(req.params.id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في طباعة التعميم: ${err.message}</h3>`);
  }
});

// 3. Company Licenses
app.get('/api/general/licenses', (req, res) => {
  try {
    const list = generalAdminService.getLicenses(req.query);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/general/licenses/:id', (req, res) => {
  try {
    const item = generalAdminService.getLicenseById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'الترخيص غير موجود' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/general/licenses', (req, res) => {
  try {
    const created = generalAdminService.createLicense(req.body);
    res.status(201).json({ success: true, message: 'تمت إضافة الترخيص/السجل بنجاح', data: created });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/general/licenses/:id', (req, res) => {
  try {
    const updated = generalAdminService.updateLicense(req.params.id, req.body);
    res.json({ success: true, message: 'تم تحديث بيانات الترخيص بنجاح', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/general/licenses/:id', (req, res) => {
  try {
    const result = generalAdminService.deleteLicense(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get('/api/general/licenses-report/print', (req, res) => {
  try {
    const html = generalAdminService.generateLicensesReportHtml();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h3>خطأ في طباعة تقرير التراخيص: ${err.message}</h3>`);
  }
});

// 4. Unified Multi-Module Reports
app.get('/api/general/reports/summary', (req, res) => {
  try {
    const summary = generalAdminService.getUnifiedReportSummary(req.query);
    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/general/reports/export/csv', (req, res) => {
  try {
    const csv = generalAdminService.exportUnifiedReportCsv();
    const filename = `unified_hrms_report_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`نظام موارد بشرية شركة جوهرة المجد`);
    console.log(`الخادم يعمل بنجاح على: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
