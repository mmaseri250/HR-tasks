// server/modules/users.js - User Management, Authentication & Persistent Synchronization
// Jawharat Al-Majd HRMS - Strict RBAC, 24-Hour Activation & Password Setup

const { query, get, run } = require('../database/db');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const rbacEngine = require('./rbacEngine');

const PERSISTED_USERS_FILE = path.join(__dirname, '../database/persisted_users.json');

/**
 * Persists all current database users to a permanent JSON file backup
 */
function persistUsersToDisk() {
  try {
    const users = query('SELECT * FROM users ORDER BY id ASC');
    const cleanUsers = users.map(u => {
      let perms = [];
      try {
        perms = typeof u.permissions === 'string' ? JSON.parse(u.permissions) : (u.permissions || []);
      } catch (e) {
        perms = ['all'];
      }
      return {
        id: u.id,
        username: u.username,
        password: u.password,
        full_name: u.full_name,
        email: u.email,
        role: u.role,
        permissions: perms,
        emp_id: u.emp_id,
        custom_data_scope: u.custom_data_scope,
        avatar_url: u.avatar_url || null,
        is_active: u.is_active,
        status: u.status || (u.is_active === 1 ? 'نشط' : 'معلق - بانتظار تعيين كلمة المرور'),
        activation_token: u.activation_token || null,
        activation_token_expires_at: u.activation_token_expires_at || null,
        activated_at: u.activated_at || null,
        created_at: u.created_at
      };
    });

    fs.writeFileSync(PERSISTED_USERS_FILE, JSON.stringify(cleanUsers, null, 2), 'utf8');
    return cleanUsers;
  } catch (err) {
    console.error('Error persisting users to disk:', err.message);
    return [];
  }
}

function normalizeAr(s) {
  return (s || '').replace(/\s+/g, ' ').replace(/[إأآا]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim().toLowerCase();
}

/**
 * Reconciles user accounts with employees table to ensure emp_id is never stale
 */
function reconcileUserEmployeeLinks() {
  try {
    const users = query('SELECT * FROM users');
    const emps = query('SELECT e.*, d.name_ar AS department_name FROM employees e LEFT JOIN departments d ON e.department_id = d.id');
    let modified = false;

    for (const u of users) {
      if (u.role === 'admin') continue;
      let emp = emps.find(e => e.id === u.emp_id);
      if (!emp) {
        emp = emps.find(e => normalizeAr(e.full_name_ar) === normalizeAr(u.full_name) || (u.username && normalizeAr(e.emp_code) === normalizeAr(u.username)));
        if (emp) {
          run('UPDATE users SET emp_id = ? WHERE id = ?', [emp.id, u.id]);
          u.emp_id = emp.id;
          modified = true;
        }
      }
    }
    if (modified) {
      persistUsersToDisk();
    }
  } catch (err) {
    console.error('Error reconciling user employee links:', err.message);
  }
}

/**
 * Restores all persisted users from disk to SQLite database
 */
function restoreUsersFromDisk() {
  try {
    if (!fs.existsSync(PERSISTED_USERS_FILE)) {
      persistUsersToDisk();
      return;
    }

    const raw = fs.readFileSync(PERSISTED_USERS_FILE, 'utf8');
    const users = JSON.parse(raw);
    if (!Array.isArray(users) || users.length === 0) return;

    for (const u of users) {
      if (!u.username) continue;
      const existing = get('SELECT id, password FROM users WHERE username = ?', [u.username.trim()]);
      const permsStr = typeof u.permissions === 'string' ? u.permissions : JSON.stringify(u.permissions || []);
      const pass = u.password || 'Jj123';
      const role = u.role || 'employee';
      const fullName = u.full_name || u.username;
      const email = u.email || null;
      const empId = u.emp_id ? Number(u.emp_id) : null;
      const isActive = u.is_active !== undefined ? Number(u.is_active) : 1;
      const status = u.status || (isActive === 1 ? 'نشط' : 'معلق - بانتظار تعيين كلمة المرور');
      const activationToken = u.activation_token || null;
      const activationExpiresAt = u.activation_token_expires_at || null;
      const activatedAt = u.activated_at || null;
      const avatarUrl = u.avatar_url || null;

      if (!existing) {
        const ins = run(`
          INSERT INTO users (username, password, full_name, email, role, permissions, emp_id, is_active, status, activation_token, activation_token_expires_at, activated_at, avatar_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [u.username.trim(), pass, fullName, email, role, permsStr, empId, isActive, status, activationToken, activationExpiresAt, activatedAt, avatarUrl]);
        syncUserPermissionsTable(ins.lastInsertRowid, u.permissions);
      } else {
        const finalPass = (u.password && u.password.trim() !== '') ? u.password.trim() : existing.password;
        run(`
          UPDATE users SET
            password = ?, full_name = ?, email = ?,
            role = ?, permissions = ?, emp_id = ?, is_active = ?,
            status = COALESCE(status, ?),
            avatar_url = COALESCE(?, avatar_url)
          WHERE id = ?
        `, [finalPass, fullName, email, role, permsStr, empId, isActive, status, avatarUrl, existing.id]);
        syncUserPermissionsTable(existing.id, u.permissions);
      }
    }
    reconcileUserEmployeeLinks();
  } catch (err) {
    console.error('Error restoring users from disk:', err.message);
  }
}

function generateActivationToken() {
  return crypto.randomBytes(32).toString('hex');
}

function getActivationExpiryDate() {
  // Strict 24 hours duration from creation time
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
}

/**
 * Synchronize user permissions table for granular enforcement
 */
function syncUserPermissionsTable(userId, permsArray) {
  try {
    run('DELETE FROM user_permissions WHERE user_id = ?', [userId]);

    const perms = Array.isArray(permsArray) ? permsArray : (typeof permsArray === 'string' ? JSON.parse(permsArray || '[]') : []);

    const CODE_MAP = {
      'all': ['all'],
      'employees': ['employees.view', 'employees.create', 'employees.edit', 'employees.export', 'employees'],
      'payroll': ['payroll.view', 'payroll.calculate', 'payroll.export', 'payroll.wps', 'payroll'],
      'attendance': ['attendance.view', 'attendance.clock', 'attendance.edit', 'attendance'],
      'leaves': ['leaves.view', 'leaves.create', 'leaves.approve', 'leaves', 'requests'],
      'approvals': ['leaves.approve', 'requests.approve', 'leaves.view', 'requests.view', 'approvals'],
      'penalties': ['penalties.view', 'penalties.issue', 'penalties'],
      'tasks': ['tasks.view', 'tasks.create', 'tasks.update', 'tasks'],
      'loans': ['loans.view', 'loans.create', 'loans.approve', 'loans'],
      'compliance': ['compliance.view', 'compliance'],
      'fleet': ['fleet.view', 'fleet.create', 'fleet.edit', 'fleet'],
      'insurance': ['insurance.view', 'insurance'],
      'licenses': ['licenses.view', 'licenses.edit', 'licenses'],
      'recruitment': ['recruitment.view', 'recruitment.create', 'recruitment'],
      'job_descriptions': ['job_descriptions.view', 'job_descriptions.create', 'job_descriptions'],
      'reports': ['reports.view', 'reports.export', 'reports'],
      'organization': ['hierarchy.view', 'branches.view', 'organization'],
      'branches': ['branches.view', 'branches.edit', 'branches'],
      'users': ['users.view', 'users.create', 'users.edit', 'users'],
      'audit': ['audit.view', 'audit'],
      'requests': ['requests.view', 'requests.create', 'selfservice.view', 'selfservice'],
      'payslips': ['payslips.view', 'salary_cert.view'],
      'notices': ['notices.view', 'notices.create'],
      'edit_balances': ['leaves.edit_balances'],
      'edit_attendance': ['attendance.edit'],
      'delete': ['delete.records']
    };

    const grantedCodes = new Set();
    perms.forEach(p => {
      grantedCodes.add(p);
      if (CODE_MAP[p]) {
        CODE_MAP[p].forEach(c => grantedCodes.add(c));
      }
    });

    for (const code of grantedCodes) {
      try {
        run('INSERT INTO user_permissions (user_id, permission_code, is_granted) VALUES (?, ?, 1)', [userId, code]);
      } catch (err) {}
    }
  } catch (err) {
    console.error('Error syncing user_permissions table:', err.message);
  }
}

/**
 * Authentication login with 24-hour activation check
 */
function login(username, password) {
  if (!username || !password) {
    throw new Error('اسم المستخدم وكلمة المرور مطلوبان');
  }

  const user = get('SELECT * FROM users WHERE username = ?', [username.trim()]);
  if (!user) {
    throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
  }

  // 1. Mandatory Activation & 24-Hour Expiration Check (Exempt only initial Super Admin)
  if (user.username !== 'admin') {
    const isPending = user.status === 'معلق - بانتظار تعيين كلمة المرور' || (!user.activated_at && user.activation_token);

    if (isPending) {
      if (user.activation_token_expires_at && new Date(user.activation_token_expires_at) < new Date()) {
        run("UPDATE users SET status = 'منتهي صلاحية التفعيل', is_active = 0 WHERE id = ?", [user.id]);
        persistUsersToDisk();
        throw new Error('انتهت مهلة الـ 24 ساعة المحددة لتفعيل الحساب وتعيين كلمة المرور. يرجى مراجعة إدارة النظام لإعادة إرسال رابط التفعيل.');
      }
      throw new Error('هذا الحساب معلق بانتظار التفعيل. شرط إلزامي: يجب الدخول عبر رابط الدعوة وتعيين كلمة المرور أولاً (صلاحية الرابط 24 ساعة من تاريخ الإنشاء).');
    }

    if (user.status === 'منتهي صلاحية التفعيل') {
      throw new Error('انتهت مهلة الـ 24 ساعة لتفعيل الحساب. يرجى مراجعة إدارة النظام لإعادة إصدار رابط تفعيل جديد.');
    }

    if (user.is_active === 0 || user.status === 'معطل') {
      throw new Error('تم تعطيل هذا الحساب من قِبل إدارة النظام، يرجى التواصل مع الإدارة.');
    }
  }

  // 2. Password Check
  if (user.password !== password) {
    throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
  }

  // Record login timestamp
  try {
    run('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
  } catch (e) {}

  // Ensure emp_id is live and accurate
  if (user.emp_id) {
    const checkEmp = get('SELECT id, emp_code, full_name_ar, job_title_ar, department_id, annual_leave_balance FROM employees WHERE id = ?', [user.emp_id]);
    if (!checkEmp) {
      reconcileUserEmployeeLinks();
      const updatedUser = get('SELECT * FROM users WHERE id = ?', [user.id]);
      if (updatedUser) {
        user.emp_id = updatedUser.emp_id;
      }
    }
  } else if (user.role !== 'admin') {
    reconcileUserEmployeeLinks();
    const updatedUser = get('SELECT * FROM users WHERE id = ?', [user.id]);
    if (updatedUser && updatedUser.emp_id) {
      user.emp_id = updatedUser.emp_id;
    }
  }

  // Return user without password
  const { password: _, ...userSafe } = user;
  try {
    userSafe.permissions = JSON.parse(user.permissions || '[]');
  } catch (e) {
    userSafe.permissions = ['all'];
  }

  const empDetails = user.emp_id ? get(`
    SELECT e.id, e.emp_code, e.full_name_ar, e.job_title_ar, e.department_id, e.annual_leave_balance,
           d.name_ar AS department_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE e.id = ?
  `, [user.emp_id]) : null;

  if (empDetails) {
    userSafe.emp_code = empDetails.emp_code;
    userSafe.job_title_ar = empDetails.job_title_ar;
    userSafe.department_name = empDetails.department_name;
    userSafe.annual_leave_balance = empDetails.annual_leave_balance;
  }

  userSafe.effective_permissions = rbacEngine.getUserEffectivePermissions(user.id);
  userSafe.data_scope = rbacEngine.getDataScope(user);

  return userSafe;
}

/**
 * Fetch all users with live activation status and expiration flags
 */
function getAllUsers() {
  const users = query(`
    SELECT id, username, full_name, email, role, permissions, emp_id,
           custom_data_scope, avatar_url, is_active, status,
           activation_token, activation_token_expires_at, activated_at,
           last_login_at, created_at
    FROM users
    ORDER BY id ASC
  `);

  const now = new Date();

  return users.map(u => {
    try {
      u.permissions = JSON.parse(u.permissions || '[]');
    } catch (e) {
      u.permissions = [];
    }
    u.effective_permissions = rbacEngine.getUserEffectivePermissions(u.id);
    u.data_scope = rbacEngine.getDataScope(u);

    // Compute live activation status
    const isPending = (u.status === 'معلق - بانتظار تعيين كلمة المرور') || (!u.activated_at && u.activation_token && u.username !== 'admin');
    const isExpired = u.activation_token_expires_at ? (new Date(u.activation_token_expires_at) < now) : false;

    if (isPending && isExpired) {
      u.status = 'منتهي صلاحية التفعيل';
      u.is_expired = true;
    } else if (isPending) {
      u.status = 'معلق - بانتظار تعيين كلمة المرور';
      u.is_pending_activation = true;
      u.is_expired = false;
    } else if (u.is_active === 1) {
      u.status = 'نشط';
    } else {
      u.status = 'معطل';
    }

    if (u.activation_token && !u.activated_at) {
      u.activation_link = `/activate-account.html?token=${u.activation_token}`;
    } else {
      u.activation_link = null;
    }

    return u;
  });
}

/**
 * Create a new user with mandatory 24-hour activation link
 */
function createUser(data) {
  const {
    username,
    full_name,
    email = null,
    role = 'employee',
    permissions = [],
    emp_id = null,
    custom_data_scope = null,
    password = null
  } = data;

  if (!username || !full_name) {
    throw new Error('اسم المستخدم والاسم الكامل حقول مطلوبة');
  }

  const existing = get('SELECT id FROM users WHERE username = ?', [username.trim()]);
  if (existing) {
    throw new Error('اسم المستخدم مستخدم بالفعل، يرجى اختيار اسم مستخدم آخر');
  }

  const permsStr = typeof permissions === 'string' ? permissions : JSON.stringify(permissions);

  // Mandatory Rule: New user is inactive and pending password setup (24-hour window)
  const isSuperAdmin = (role === 'admin' && username.trim() === 'admin');
  const token = isSuperAdmin ? null : generateActivationToken();
  const expiresAt = isSuperAdmin ? null : getActivationExpiryDate();
  const status = isSuperAdmin ? 'نشط' : 'معلق - بانتظار تعيين كلمة المرور';
  const isActive = isSuperAdmin ? 1 : 0;
  const activatedAt = isSuperAdmin ? new Date().toISOString() : null;
  const tempPassword = (password && password.trim()) ? password.trim() : ('PENDING_' + crypto.randomBytes(8).toString('hex'));

  const result = run(`
    INSERT INTO users (
      username, password, full_name, email, role, permissions,
      emp_id, custom_data_scope, is_active, status,
      activation_token, activation_token_expires_at, activated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    username.trim(),
    tempPassword,
    full_name.trim(),
    email ? email.trim() : null,
    role,
    permsStr,
    emp_id ? Number(emp_id) : null,
    custom_data_scope || null,
    isActive,
    status,
    token,
    expiresAt,
    activatedAt
  ]);

  const newId = result.lastInsertRowid;

  // Sync to granular user_permissions table
  syncUserPermissionsTable(newId, permissions);

  const newUser = get(`
    SELECT id, username, full_name, email, role, permissions, emp_id,
           is_active, status, activation_token, activation_token_expires_at,
           activated_at, created_at
    FROM users WHERE id = ?
  `, [newId]);

  try {
    newUser.permissions = JSON.parse(newUser.permissions || '[]');
  } catch (e) {
    newUser.permissions = [];
  }

  newUser.activation_link = token ? `/activate-account.html?token=${token}` : null;
  newUser.expires_at = expiresAt;

  persistUsersToDisk();

  return newUser;
}

/**
 * Re-send activation link with a fresh 24-hour window
 */
function resendActivation(userId) {
  const user = get('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) throw new Error('المستخدم غير موجود');
  if (user.username === 'admin') throw new Error('لا يمكن إعادة تعيين رابط تفعيل لحساب مدير النظام الرئيسي');

  const token = generateActivationToken();
  const expiresAt = getActivationExpiryDate();

  run(`
    UPDATE users SET
      activation_token = ?,
      activation_token_expires_at = ?,
      status = 'معلق - بانتظار تعيين كلمة المرور',
      is_active = 0,
      activated_at = NULL
    WHERE id = ?
  `, [token, expiresAt, userId]);

  persistUsersToDisk();

  return {
    success: true,
    message: 'تم توليد رابط تفعيل جديد بصلاحية 24 ساعة تبدأ من الآن.',
    activation_token: token,
    activation_link: `/activate-account.html?token=${token}`,
    expires_at: expiresAt,
    user: {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      email: user.email
    }
  };
}

/**
 * Verify token validity when opening activation link
 */
function verifyActivationToken(token) {
  if (!token) throw new Error('رمز التفعيل مطلوب');

  const user = get(`
    SELECT id, username, full_name, email, role,
           activation_token_expires_at, activated_at, status
    FROM users
    WHERE activation_token = ?
  `, [token.trim()]);

  if (!user) {
    throw new Error('رابط التفعيل غير صالح أو تم استخدامه مسبقاً وتفعيل الحساب');
  }

  const isExpired = user.activation_token_expires_at && (new Date(user.activation_token_expires_at) < new Date());

  if (isExpired) {
    run("UPDATE users SET status = 'منتهي صلاحية التفعيل' WHERE id = ?", [user.id]);
    persistUsersToDisk();
    return {
      success: false,
      is_expired: true,
      error: 'انتهت مهلة الـ 24 ساعة المحددة لتفعيل هذا الحساب. يرجى التواصل مع إدارة النظام لإعادة إصدار رابط تفعيل جديد.',
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name
      }
    };
  }

  return {
    success: true,
    is_expired: false,
    user: {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      expires_at: user.activation_token_expires_at
    }
  };
}

/**
 * Activate user account and set permanent password within the 24-hour limit
 */
function activateAccount(token, password) {
  if (!token) throw new Error('رمز التفعيل مطلوب');
  if (!password || password.trim().length < 6) {
    throw new Error('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام');
  }

  const user = get('SELECT * FROM users WHERE activation_token = ?', [token.trim()]);
  if (!user) {
    throw new Error('رابط التفعيل غير صالح أو تم استخدامه مسبقاً');
  }

  // Strict 24-hour check
  if (user.activation_token_expires_at && (new Date(user.activation_token_expires_at) < new Date())) {
    run("UPDATE users SET status = 'منتهي صلاحية التفعيل', is_active = 0 WHERE id = ?", [user.id]);
    persistUsersToDisk();
    throw new Error('انتهت مهلة الـ 24 ساعة المحددة لتفعيل الحساب. يرجى التواصل مع إدارة النظام لإعادة إرسال رابط تفعيل جديد.');
  }

  const now = new Date().toISOString();
  run(`
    UPDATE users SET
      password = ?,
      status = 'نشط',
      is_active = 1,
      activated_at = ?,
      activation_token = NULL,
      activation_token_expires_at = NULL
    WHERE id = ?
  `, [password.trim(), now, user.id]);

  persistUsersToDisk();

  return {
    success: true,
    message: 'تم تفعيل حسابك وتعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول للنظام.',
    username: user.username,
    full_name: user.full_name
  };
}

function updateUser(id, data) {
  const existing = get('SELECT * FROM users WHERE id = ?', [id]);
  if (!existing) {
    throw new Error('المستخدم غير موجود');
  }

  const username = data.username ? data.username.trim() : existing.username;
  const fullName = data.full_name ? data.full_name.trim() : existing.full_name;
  const email = data.email !== undefined ? data.email : existing.email;
  const role = data.role || existing.role;
  const password = (data.password && data.password.trim() !== '') ? data.password.trim() : existing.password;
  const empId = data.emp_id !== undefined ? (data.emp_id ? Number(data.emp_id) : null) : existing.emp_id;
  const isActive = data.is_active !== undefined ? Number(data.is_active) : existing.is_active;
  const status = data.status || (isActive === 1 ? 'نشط' : existing.status);

  const customDataScope = data.custom_data_scope !== undefined ? (data.custom_data_scope || null) : (existing.custom_data_scope || null);

  let permsStr = existing.permissions;
  if (data.permissions !== undefined) {
    permsStr = typeof data.permissions === 'string' ? data.permissions : JSON.stringify(data.permissions);
    syncUserPermissionsTable(id, data.permissions);
  }

  run(`
    UPDATE users SET
      username = ?, password = ?, full_name = ?, email = ?,
      role = ?, permissions = ?, emp_id = ?, custom_data_scope = ?, is_active = ?, status = ?
    WHERE id = ?
  `, [username, password, fullName, email, role, permsStr, empId, customDataScope, isActive, status, id]);

  const updated = get(`
    SELECT id, username, full_name, email, role, permissions, emp_id,
           is_active, status, activation_token, activation_token_expires_at, activated_at, created_at
    FROM users WHERE id = ?
  `, [id]);

  try {
    updated.permissions = JSON.parse(updated.permissions || '[]');
  } catch (e) {
    updated.permissions = [];
  }

  persistUsersToDisk();

  return updated;
}

function deleteUser(id) {
  const user = get('SELECT * FROM users WHERE id = ?', [id]);
  if (!user) throw new Error('المستخدم غير موجود');

  if (user.username === 'admin') {
    throw new Error('لا يمكن حذف المستخدم الرئيسي للنظام (admin)');
  }

  run('DELETE FROM user_permissions WHERE user_id = ?', [id]);
  const result = run('DELETE FROM users WHERE id = ?', [id]);

  persistUsersToDisk();

  return result;
}

function syncUsers(clientUsers) {
  if (!Array.isArray(clientUsers) || clientUsers.length === 0) {
    return getAllUsers();
  }

  for (const u of clientUsers) {
    if (!u.username) continue;
    const existing = get('SELECT id, password FROM users WHERE username = ?', [u.username.trim()]);
    const permsStr = typeof u.permissions === 'string' ? u.permissions : JSON.stringify(u.permissions || []);
    const pass = u.password || 'Jj123';
    const role = u.role || 'employee';
    const fullName = u.full_name || u.username;
    const email = u.email || null;
    const empId = u.emp_id ? Number(u.emp_id) : null;
    const isActive = u.is_active !== undefined ? Number(u.is_active) : 1;
    const status = u.status || (isActive === 1 ? 'نشط' : 'معلق - بانتظار تعيين كلمة المرور');

    if (!existing) {
      const ins = run(`
        INSERT INTO users (username, password, full_name, email, role, permissions, emp_id, is_active, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [u.username.trim(), pass, fullName, email, role, permsStr, empId, isActive, status]);
      syncUserPermissionsTable(ins.lastInsertRowid, u.permissions);
    } else {
      const finalPass = (u.password && u.password.trim() !== '') ? u.password.trim() : existing.password;
      run(`
        UPDATE users SET
          password = ?, full_name = ?, email = ?,
          role = ?, permissions = ?, emp_id = ?, is_active = ?, status = ?
        WHERE id = ?
      `, [finalPass, fullName, email, role, permsStr, empId, isActive, status, existing.id]);
      syncUserPermissionsTable(existing.id, u.permissions);
    }
  }

  persistUsersToDisk();
  return getAllUsers();
}

module.exports = {
  login,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  syncUsers,
  resendActivation,
  verifyActivationToken,
  activateAccount,
  persistUsersToDisk,
  restoreUsersFromDisk,
  reconcileUserEmployeeLinks,
  syncUserPermissionsTable
};
