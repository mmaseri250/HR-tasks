// server/modules/rbacEngine.js
// Enterprise RBAC, Data Scoping, IDOR Protection & Permission Inspector Engine
// Jawharat Al-Majd Trading & Contracting Co.

const { query, get, run } = require('../database/db');

/**
 * 1. PERMISSIONS REGISTRY ACCESSORS
 */
function getAllPermissions() {
  return query('SELECT * FROM permissions ORDER BY module ASC, code ASC');
}

function getAllRoles() {
  return query('SELECT * FROM roles ORDER BY id ASC');
}

function getRolePermissions(roleCode) {
  if (roleCode === 'admin') {
    return query('SELECT code FROM permissions').map(p => p.code);
  }
  const rows = query(`
    SELECT p.code
    FROM role_permissions rp
    JOIN permissions p ON rp.permission_code = p.code
    WHERE rp.role_code = ?
  `, [roleCode]);
  return rows.map(r => r.code);
}

/**
 * Resolves effective permissions list for a user (Role + Direct Grants/Denials)
 */
function getUserEffectivePermissions(userId) {
  const user = get('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) return [];

  if (user.role === 'admin') {
    return query('SELECT code FROM permissions').map(p => p.code);
  }

  // 1. Role base permissions
  const rolePerms = new Set(getRolePermissions(user.role));

  // 2. Direct user overrides
  const directOverrides = query(`
    SELECT permission_code, is_granted
    FROM user_permissions
    WHERE user_id = ?
  `, [userId]);

  directOverrides.forEach(o => {
    if (o.is_granted === 1) {
      rolePerms.add(o.permission_code);
    } else {
      rolePerms.delete(o.permission_code);
    }
  });

  // 3. Direct JSON permissions grants from users table
  try {
    const jsonPerms = typeof user.permissions === 'string' ? JSON.parse(user.permissions || '[]') : (user.permissions || []);
    if (Array.isArray(jsonPerms)) {
      jsonPerms.forEach(p => {
        if (p) rolePerms.add(p);
      });
    }
  } catch (e) {}

  return Array.from(rolePerms);
}

/**
 * Check if a user has a specific permission
 */
function hasPermission(user, permissionCode) {
  if (!user) return false;
  if (user.role === 'admin') return true;

  // If user object has pre-computed effective_permissions
  const perms = (user.effective_permissions && Array.isArray(user.effective_permissions))
    ? user.effective_permissions
    : getUserEffectivePermissions(user.id);

  if (perms.includes('all') || perms.includes('*')) return true;
  if (perms.includes(permissionCode)) return true;

  // Prefix matching: e.g. 'employees' covers 'employees.view', 'employees.edit'
  if (typeof permissionCode === 'string') {
    const prefix = permissionCode.split('.')[0];
    if (perms.includes(prefix)) return true;
  }

  return false;
}

/**
 * 2. DATA SCOPING & HIERARCHY ENGINE
 */
function getDataScope(user) {
  if (!user) return 'OWN';
  if (user.role === 'admin' || user.role === 'hr_manager') return 'ALL';
  if (user.custom_data_scope) return user.custom_data_scope;

  const roleObj = get('SELECT default_data_scope FROM roles WHERE code = ?', [user.role]);
  return roleObj ? roleObj.default_data_scope : 'OWN';
}

/**
 * Get all employee IDs subordinate to a given employee ID
 */
function getSubordinateEmpIds(managerEmpId) {
  if (!managerEmpId) return [];
  const rows = query('SELECT id FROM employees WHERE manager_id = ?', [managerEmpId]);
  return rows.map(r => r.id);
}

/**
 * Builds SQL filter for Employee Data Scoping
 */
function getEmployeeScopeFilter(user, tableAlias = 'employees') {
  const scope = getDataScope(user);
  const empId = user?.emp_id ? Number(user.emp_id) : null;

  if (scope === 'ALL' || !empId) {
    return { sql: '1=1', params: [], scope: 'ALL' };
  }

  if (scope === 'DIRECT_SUBORDINATES') {
    const subIds = getSubordinateEmpIds(empId);
    const allowedIds = [empId, ...subIds];
    const placeholders = allowedIds.map(() => '?').join(',');
    return {
      sql: `${tableAlias}.id IN (${placeholders})`,
      params: allowedIds,
      scope: 'DIRECT_SUBORDINATES',
      subordinateCount: subIds.length
    };
  }

  if (scope === 'DEPARTMENT') {
    // If user is linked to a department
    const emp = get('SELECT department_id FROM employees WHERE id = ?', [empId]);
    if (emp && emp.department_id) {
      return {
        sql: `${tableAlias}.department_id = ? OR ${tableAlias}.id = ?`,
        params: [emp.department_id, empId],
        scope: 'DEPARTMENT'
      };
    }
  }

  // Default: OWN
  return {
    sql: `${tableAlias}.id = ?`,
    params: [empId],
    scope: 'OWN'
  };
}

/**
 * Builds SQL filter for Task Data Scoping
 */
function getTaskScopeFilter(user, tableAlias = 'tasks') {
  const scope = getDataScope(user);
  const empId = user?.emp_id ? Number(user.emp_id) : null;

  if (scope === 'ALL' || !empId) {
    return { sql: '1=1', params: [], scope: 'ALL' };
  }

  if (scope === 'DIRECT_SUBORDINATES') {
    const subIds = getSubordinateEmpIds(empId);
    const allowedAssignees = [empId, ...subIds];
    const placeholders = allowedAssignees.map(() => '?').join(',');
    return {
      sql: `(${tableAlias}.assigned_to IN (${placeholders}) OR ${tableAlias}.assigned_by = ?)`,
      params: [...allowedAssignees, empId],
      scope: 'DIRECT_SUBORDINATES'
    };
  }

  // Default: OWN
  return {
    sql: `(${tableAlias}.assigned_to = ? OR ${tableAlias}.assigned_by = ?)`,
    params: [empId, empId],
    scope: 'OWN'
  };
}

/**
 * Builds SQL filter for Leave Data Scoping
 */
function getLeaveScopeFilter(user, tableAlias = 'leaves') {
  const scope = getDataScope(user);
  const empId = user?.emp_id ? Number(user.emp_id) : null;

  if (scope === 'ALL' || !empId) {
    return { sql: '1=1', params: [], scope: 'ALL' };
  }

  if (scope === 'DIRECT_SUBORDINATES') {
    const subIds = getSubordinateEmpIds(empId);
    const allowedEmpIds = [empId, ...subIds];
    const placeholders = allowedEmpIds.map(() => '?').join(',');
    return {
      sql: `(${tableAlias}.emp_id IN (${placeholders}) OR ${tableAlias}.manager_id = ?)`,
      params: [...allowedEmpIds, empId],
      scope: 'DIRECT_SUBORDINATES'
    };
  }

  // Default: OWN
  return {
    sql: `${tableAlias}.emp_id = ?`,
    params: [empId],
    scope: 'OWN'
  };
}

/**
 * 3. EFFECTIVE PERMISSIONS INSPECTOR
 */
function getEffectiveUserPermissionsDetailed(userId) {
  const user = get('SELECT id, username, full_name, email, role, emp_id, custom_data_scope, is_active FROM users WHERE id = ?', [userId]);
  if (!user) throw new Error('المستخدم غير موجود');

  let emp = null;
  if (user.emp_id) {
    emp = get(`
      SELECT e.id, e.emp_code, e.full_name_ar, e.job_title_ar, e.section,
             d.name_ar AS department_name,
             m.full_name_ar AS direct_manager_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN employees m ON e.manager_id = m.id
      WHERE e.id = ?
    `, [user.emp_id]);
  }

  const effectiveScope = getDataScope(user);
  const allPerms = getAllPermissions();
  const rolePerms = new Set(getRolePermissions(user.role));
  const directOverrides = query('SELECT permission_code, is_granted FROM user_permissions WHERE user_id = ?', [user.id]);
  const overrideMap = new Map();
  directOverrides.forEach(o => overrideMap.set(o.permission_code, o.is_granted));

  const detailedPerms = allPerms.map(p => {
    let allowed = false;
    let source = 'NONE';

    if (user.role === 'admin') {
      allowed = true;
      source = 'ADMIN';
    } else if (overrideMap.has(p.code)) {
      allowed = overrideMap.get(p.code) === 1;
      source = allowed ? 'DIRECT_GRANT' : 'DIRECT_DENIAL';
    } else if (rolePerms.has(p.code)) {
      allowed = true;
      source = 'ROLE';
    }

    return {
      code: p.code,
      module: p.module,
      action: p.action,
      name_ar: p.name_ar,
      description_ar: p.description_ar,
      allowed,
      source
    };
  });

  return {
    user,
    employee: emp,
    data_scope: effectiveScope,
    role_name_ar: get('SELECT name_ar FROM roles WHERE code = ?', [user.role])?.name_ar || user.role,
    permissions: detailedPerms
  };
}

/**
 * 4. PERMISSIONS & ROLES MUTATION
 */
function updateUserPermissions(targetUserId, grants = [], revokes = [], actorUser = null) {
  const targetUser = get('SELECT * FROM users WHERE id = ?', [targetUserId]);
  if (!targetUser) throw new Error('المستخدم المطلوب غير موجود');

  // Clear existing overrides
  run('DELETE FROM user_permissions WHERE user_id = ?', [targetUserId]);

  // Insert grants
  const insertStmt = (code, isGranted) => {
    run(`
      INSERT INTO user_permissions (user_id, permission_code, is_granted, granted_by_user_id)
      VALUES (?, ?, ?, ?)
    `, [targetUserId, code, isGranted, actorUser ? actorUser.id : 1]);
  };

  grants.forEach(c => insertStmt(c, 1));
  revokes.forEach(c => insertStmt(c, 0));

  // Log in audit_logs
  const actorId = actorUser && actorUser.id ? Number(actorUser.id) : 1;
  const actorName = actorUser ? (actorUser.full_name || actorUser.username || 'مدير النظام (Admin)') : 'مدير النظام (Admin)';
  const actorRole = actorUser ? (actorUser.role || 'admin') : 'admin';

  run(`
    INSERT INTO audit_logs (performed_by_id, performed_by_name, performed_by_role, action, entity_type, entity_id, comment, old_values, new_values, ip_address)
    VALUES (?, ?, ?, 'PERMISSIONS_UPDATE', 'USER', ?, ?, ?, ?, '127.0.0.1')
  `, [
    actorId, actorName, actorRole, targetUserId,
    `تحديث صلاحيات المستخدم [${targetUser.username}]: ${grants.length} منح، ${revokes.length} حجب`,
    JSON.stringify(targetUser.permissions || []),
    JSON.stringify({ grants, revokes })
  ]);

  return getEffectiveUserPermissionsDetailed(targetUserId);
}

function updateUserRoleAndScope(targetUserId, newRole, newDataScope = null, actorUser = null) {
  const targetUser = get('SELECT * FROM users WHERE id = ?', [targetUserId]);
  if (!targetUser) throw new Error('المستخدم المطلوب غير موجود');

  const oldRole = targetUser.role;
  const oldScope = targetUser.custom_data_scope;

  run('UPDATE users SET role = ?, custom_data_scope = ? WHERE id = ?', [newRole, newDataScope || null, targetUserId]);

  // Log in audit_logs
  const actorId = actorUser && actorUser.id ? Number(actorUser.id) : 1;
  const actorName = actorUser ? (actorUser.full_name || actorUser.username || 'مدير النظام (Admin)') : 'مدير النظام (Admin)';
  const actorRole = actorUser ? (actorUser.role || 'admin') : 'admin';

  run(`
    INSERT INTO audit_logs (performed_by_id, performed_by_name, performed_by_role, action, entity_type, entity_id, comment, old_values, new_values, ip_address)
    VALUES (?, ?, ?, 'ROLE_UPDATE', 'USER', ?, ?, ?, ?, '127.0.0.1')
  `, [
    actorId, actorName, actorRole, targetUserId,
    `تغيير دور المستخدم [${targetUser.username}] من ${oldRole} إلى ${newRole} (النطاق: ${newDataScope || 'افتراضي'})`,
    JSON.stringify({ role: oldRole, custom_data_scope: oldScope }),
    JSON.stringify({ role: newRole, custom_data_scope: newDataScope })
  ]);

  return getEffectiveUserPermissionsDetailed(targetUserId);
}

/**
 * 5. EXPRESS MIDDLEWARE
 */
function authenticateAndScope(req, res, next) {
  const headerId = req.headers['x-user-id'];
  const headerRole = req.headers['x-user-role'];
  const headerEmpId = req.headers['x-user-emp-id'];

  const userId = headerId || req.body?.user?.id || req.body?.user_id;

  let user = null;
  if (userId) {
    try {
      user = get('SELECT id, username, full_name, role, emp_id, custom_data_scope, is_active FROM users WHERE id = ?', [userId]);
    } catch (_) {}
  }

  if (!user && (headerRole || req.body?.role)) {
    user = {
      id: userId ? Number(userId) : null,
      username: req.body?.username || '',
      full_name: req.headers['x-user-name'] ? decodeURIComponent(req.headers['x-user-name']) : (req.body?.name || 'مستخدم'),
      role: headerRole || req.body?.role || 'employee',
      emp_id: headerEmpId ? Number(headerEmpId) : (req.body?.emp_id ? Number(req.body.emp_id) : null),
      custom_data_scope: null
    };
  }

  if (user) {
    user.effective_permissions = getUserEffectivePermissions(user.id);
    user.data_scope = getDataScope(user);
    req.user = user;
  } else {
    // Guest / Anonymous fallback
    req.user = {
      id: null,
      username: 'guest',
      role: 'guest',
      emp_id: null,
      effective_permissions: [],
      data_scope: 'OWN'
    };
  }

  next();
}

/**
 * Enforce Permission Middleware
 */
function requirePermission(permCode) {
  return (req, res, next) => {
    if (!req.user || req.user.role === 'guest') {
      return res.status(401).json({ success: false, error: 'يجب تسجيل الدخول أولاً للوصول إلى هذا المورد', code: 'UNAUTHORIZED' });
    }

    if (!hasPermission(req.user, permCode)) {
      return res.status(403).json({
        success: false,
        error: `غير مصرح: لا تملك صلاحية (${permCode}) لتنفيذ هذه العملية أو عرض هذه الصفحة`,
        code: 'FORBIDDEN',
        requiredPermission: permCode
      });
    }

    next();
  };
}

module.exports = {
  getAllPermissions,
  getAllRoles,
  getRolePermissions,
  getUserEffectivePermissions,
  hasPermission,
  getDataScope,
  getSubordinateEmpIds,
  getEmployeeScopeFilter,
  getTaskScopeFilter,
  getLeaveScopeFilter,
  getEffectiveUserPermissionsDetailed,
  updateUserPermissions,
  updateUserRoleAndScope,
  authenticateAndScope,
  requirePermission
};
