// server/modules/users.js - User Management, Authentication & Persistent Synchronization
// Jawharat Al-Majd HRMS - Strict RBAC, 8-Hour Temporary Passwords & Certified Tiers

const { query, get, run } = require('../database/db');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const rbacEngine = require('./rbacEngine');

const PERSISTED_USERS_FILE = path.join(__dirname, '../database/persisted_users.json');

/**
 * Hash password using PBKDF2 with SHA-512 and unique salt
 */
function hashPassword(password) {
  if (!password) return '';
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
  return `pbkdf2$sha512$${iterations}$${salt}$${hash}`;
}

/**
 * Verify password against stored hash or legacy fallback
 */
function verifyPassword(password, storedPassword) {
  if (!storedPassword || !password) return false;
  if (typeof storedPassword === 'string' && storedPassword.startsWith('pbkdf2$sha512$')) {
    const parts = storedPassword.split('$');
    if (parts.length === 5) {
      const iterations = parseInt(parts[2], 10);
      const salt = parts[3];
      const expectedHash = parts[4];
      const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
      try {
        return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
      } catch (e) {
        return false;
      }
    }
  }
  // Plaintext or legacy fallback (e.g. initial 'Jj123')
  return storedPassword === password;
}

/**
 * Generate a cryptographically secure random temporary password (10 characters)
 */
function generateSecureTempPassword() {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const digits = '23456789';
  const special = '!@#$%&*';
  const all = upper + lower + digits + special;

  // Guarantee: Jm# + 1 digit + 1 upper + 5 random chars = exactly 10 characters
  let pass = 'Jm#' + digits.charAt(crypto.randomInt(0, digits.length)) + upper.charAt(crypto.randomInt(0, upper.length));
  for (let i = 0; i < 5; i++) {
    pass += all.charAt(crypto.randomInt(0, all.length));
  }
  return pass;
}

/**
 * Calculate 8-hour expiry times in UTC ISO and Saudi Arabia Local Time (+03:00)
 */
function get8HourExpiryDates() {
  const now = new Date();
  const expiresAtUtc = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const expiresIso = expiresAtUtc.toISOString();

  const saudiFormatter = new Intl.DateTimeFormat('ar-SA', {
    timeZone: 'Asia/Riyadh',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const saudiTimeStr = saudiFormatter.format(expiresAtUtc);

  return {
    issued_at_utc: now.toISOString(),
    expires_at_utc: expiresIso,
    expires_at_saudi: saudiTimeStr
  };
}

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
        status: u.status || 'نشط',
        is_temporary_password: u.is_temporary_password || 0,
        temp_password_issued_at: u.temp_password_issued_at || null,
        temp_password_expires_at: u.temp_password_expires_at || null,
        must_change_password: u.must_change_password || 0,
        password_hash_algo: u.password_hash_algo || 'pbkdf2',
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
      return;
    }

    const raw = fs.readFileSync(PERSISTED_USERS_FILE, 'utf8');
    const users = JSON.parse(raw);
    if (!Array.isArray(users) || users.length === 0) return;

    for (const u of users) {
      if (!u.username) continue;
      const existing = get('SELECT id, password FROM users WHERE username = ?', [u.username.trim()]);
      const permsStr = typeof u.permissions === 'string' ? u.permissions : JSON.stringify(u.permissions || []);
      const pass = u.password || hashPassword('Jj123');
      const role = u.role || 'employee';
      const fullName = u.full_name || u.username;
      const email = u.email || null;
      const empId = u.emp_id ? Number(u.emp_id) : null;
      const isActive = u.is_active !== undefined ? Number(u.is_active) : 1;
      const status = u.status || 'نشط';
      const isTempPass = u.is_temporary_password !== undefined ? Number(u.is_temporary_password) : 0;
      const tempIssuedAt = u.temp_password_issued_at || null;
      const tempExpiresAt = u.temp_password_expires_at || null;
      const mustChangePass = u.must_change_password !== undefined ? Number(u.must_change_password) : 0;
      const hashAlgo = u.password_hash_algo || 'pbkdf2';
      const avatarUrl = u.avatar_url || null;

      if (!existing) {
        const ins = run(`
          INSERT INTO users (
            username, password, full_name, email, role, permissions, emp_id,
            is_active, status, is_temporary_password, temp_password_issued_at,
            temp_password_expires_at, must_change_password, password_hash_algo, avatar_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          u.username.trim(), pass, fullName, email, role, permsStr, empId,
          isActive, status, isTempPass, tempIssuedAt, tempExpiresAt, mustChangePass, hashAlgo, avatarUrl
        ]);
        syncUserPermissionsTable(ins.lastInsertRowid, u.permissions);
      } else {
        run(`
          UPDATE users SET
            password = ?, full_name = ?, email = ?,
            role = ?, permissions = ?, emp_id = ?, is_active = ?,
            status = COALESCE(status, ?),
            is_temporary_password = ?, temp_password_issued_at = ?,
            temp_password_expires_at = ?, must_change_password = ?,
            password_hash_algo = ?, avatar_url = COALESCE(?, avatar_url)
          WHERE id = ?
        `, [
          pass, fullName, email, role, permsStr, empId, isActive, status,
          isTempPass, tempIssuedAt, tempExpiresAt, mustChangePass, hashAlgo, avatarUrl, existing.id
        ]);
        syncUserPermissionsTable(existing.id, u.permissions);
      }
    }
    reconcileUserEmployeeLinks();
  } catch (err) {
    console.error('Error restoring users from disk:', err.message);
  }
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
 * Authentication login with 8-hour temporary password check
 */
function login(username, password) {
  if (!username || !password) {
    throw new Error('اسم المستخدم وكلمة المرور مطلوبان');
  }

  const user = get('SELECT * FROM users WHERE username = ?', [username.trim()]);
  if (!user) {
    throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
  }

  // 1. Password Verification
  if (!verifyPassword(password, user.password)) {
    throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
  }

  // 2. Active Status Check
  if (user.is_active === 0 || user.status === 'معطل') {
    throw new Error('تم تعطيل هذا الحساب من قِبل إدارة النظام، يرجى التواصل مع الإدارة.');
  }

  // 3. Temporary Password 8-Hour Expiration Check (Phase 3 Requirement)
  if (user.is_temporary_password === 1 && user.temp_password_expires_at) {
    const now = new Date();
    const expiry = new Date(user.temp_password_expires_at);
    if (now > expiry) {
      throw new Error('انتهت صلاحية كلمة المرور المؤقتة، يرجى التواصل مع مدير النظام.');
    }
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

  userSafe.must_change_password = Boolean(user.must_change_password);
  userSafe.is_temporary_password = Boolean(user.is_temporary_password);
  userSafe.temp_password_expires_at = user.temp_password_expires_at;

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
 * Fetch all users with live status and temporary password flags
 */
function getAllUsers() {
  const users = query(`
    SELECT id, username, full_name, email, role, permissions, emp_id,
           custom_data_scope, avatar_url, is_active, status,
           is_temporary_password, temp_password_issued_at, temp_password_expires_at,
           must_change_password, password_hash_algo,
           last_login_at, created_at
    FROM users
    ORDER BY id ASC
  `);

  const now = new Date();
  const saudiFormatter = new Intl.DateTimeFormat('ar-SA', {
    timeZone: 'Asia/Riyadh',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return users.map(u => {
    try {
      u.permissions = JSON.parse(u.permissions || '[]');
    } catch (e) {
      u.permissions = [];
    }
    u.effective_permissions = rbacEngine.getUserEffectivePermissions(u.id);
    u.data_scope = rbacEngine.getDataScope(u);

    // Compute live temporary password status
    if (u.is_temporary_password === 1 && u.temp_password_expires_at) {
      const expDate = new Date(u.temp_password_expires_at);
      u.is_temp_expired = expDate < now;
      try {
        u.temp_password_expires_saudi = saudiFormatter.format(expDate);
      } catch (e) {
        u.temp_password_expires_saudi = u.temp_password_expires_at;
      }
      u.temp_status = u.is_temp_expired ? 'منتهية الصلاحية' : 'مؤقتة صالحة';
    } else {
      u.is_temp_expired = false;
      u.temp_status = 'دائمة';
      u.temp_password_expires_saudi = null;
    }

    return u;
  });
}

/**
 * Get available employees eligible for user creation (those who do not have an active user account)
 */
function getAvailableEmployeesForUserCreation() {
  const { getCertifiedPermissionsForEmp } = require('../database/applyMasterUpdate');
  const emps = query(`
    SELECT e.id, e.emp_code, e.full_name_ar, e.job_title_ar, e.direct_manager_name,
           e.national_id, e.phone, e.email, d.name_ar AS department_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE e.status = 'نشط'
      AND e.id NOT IN (SELECT emp_id FROM users WHERE emp_id IS NOT NULL)
      AND e.emp_code NOT IN (SELECT username FROM users)
    ORDER BY e.emp_code ASC
  `);

  return emps.map(emp => {
    const cert = getCertifiedPermissionsForEmp(emp.emp_code);
    return {
      ...emp,
      certified_role: cert.role,
      certified_permissions: cert.permissions,
      certified_tier: cert.tier
    };
  });
}

/**
 * Create a new user from an employee record with an 8-hour temporary password
 */
function createUserFromEmployee({ emp_id, emp_code }, adminUser) {
  if (!adminUser || adminUser.role !== 'admin') {
    throw new Error('غير مصرح. إجراء إضافة مستخدم حصري لمدير النظام admin');
  }

  let emp = null;
  if (emp_id) {
    emp = get("SELECT * FROM employees WHERE id = ? AND status = 'نشط'", [emp_id]);
  } else if (emp_code) {
    emp = get("SELECT * FROM employees WHERE emp_code = ? AND status = 'نشط'", [emp_code.trim()]);
  }
  if (!emp) throw new Error('الموظف غير موجود أو غير نشط');

  const existingByEmpId = get('SELECT id FROM users WHERE emp_id = ?', [emp.id]);
  if (existingByEmpId) throw new Error(`الموظف (${emp.full_name_ar}) لديه حساب مسجل مسبقاً`);

  const existingByUsername = get('SELECT id FROM users WHERE username = ?', [emp.emp_code]);
  if (existingByUsername) throw new Error(`اسم المستخدم (${emp.emp_code}) مسجل بالفعل`);

  const { getCertifiedPermissionsForEmp } = require('../database/applyMasterUpdate');
  const cert = getCertifiedPermissionsForEmp(emp.emp_code);

  const rawTempPass = generateSecureTempPassword();
  const hashedPassword = hashPassword(rawTempPass);
  const { issued_at_utc, expires_at_utc, expires_at_saudi } = get8HourExpiryDates();
  const permsStr = JSON.stringify(cert.permissions);

  const res = run(`
    INSERT INTO users (
      username, password, full_name, email, role, permissions,
      emp_id, is_active, status,
      is_temporary_password, temp_password_issued_at, temp_password_expires_at,
      must_change_password, password_hash_algo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'نشط', 1, ?, ?, 1, 'pbkdf2')
  `, [
    emp.emp_code,
    hashedPassword,
    emp.full_name_ar,
    emp.email || `${emp.emp_code.toLowerCase()}@jalmajd.com`,
    cert.role,
    permsStr,
    emp.id,
    issued_at_utc,
    expires_at_utc
  ]);

  const newUserId = res.lastInsertRowid;
  syncUserPermissionsTable(newUserId, cert.permissions);

  // Log in audit_logs
  try {
    run(`
      INSERT INTO audit_logs (user_id, action, target_type, target_id, details, created_at)
      VALUES (?, 'CREATE_USER_TEMP_PASS', 'users', ?, ?, CURRENT_TIMESTAMP)
    `, [
      adminUser.id,
      newUserId,
      `إنشاء حساب جديد للموظف ${emp.full_name_ar} (${emp.emp_code}) بكلمة مرور مؤقتة لمدة 8 ساعات تنتهي في ${expires_at_saudi}`
    ]);
  } catch (e) {}

  persistUsersToDisk();

  return {
    success: true,
    user: {
      id: newUserId,
      username: emp.emp_code,
      full_name: emp.full_name_ar,
      role: cert.role,
      tier: cert.tier,
      emp_id: emp.id,
      is_temporary_password: 1,
      temp_password_expires_at: expires_at_utc,
      temp_password_expires_saudi: expires_at_saudi,
      must_change_password: 1
    },
    credentials: {
      username: emp.emp_code,
      temp_password: rawTempPass,
      expires_at_utc: expires_at_utc,
      expires_at_saudi: expires_at_saudi,
      role: cert.role,
      tier: cert.tier,
      full_name: emp.full_name_ar
    }
  };
}

/**
 * Regenerate an 8-hour temporary password for a user (Admin only)
 */
function regenerateTempPassword(userId, adminUser) {
  if (!adminUser || adminUser.role !== 'admin') {
    throw new Error('غير مصرح. إعادة تعيين كلمة المرور المؤقتة حصري لمدير النظام admin');
  }

  const user = get('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) throw new Error('المستخدم غير موجود');
  if (user.username === 'admin') throw new Error('لا يمكن إصدار كلمة مرور مؤقتة لحساب المدير العام المستقل');

  const rawTempPass = generateSecureTempPassword();
  const hashedPassword = hashPassword(rawTempPass);
  const { issued_at_utc, expires_at_utc, expires_at_saudi } = get8HourExpiryDates();

  run(`
    UPDATE users SET
      password = ?,
      is_temporary_password = 1,
      temp_password_issued_at = ?,
      temp_password_expires_at = ?,
      must_change_password = 1,
      password_hash_algo = 'pbkdf2',
      is_active = 1,
      status = 'نشط'
    WHERE id = ?
  `, [hashedPassword, issued_at_utc, expires_at_utc, userId]);

  try {
    run(`
      INSERT INTO audit_logs (user_id, action, target_type, target_id, details, created_at)
      VALUES (?, 'REGENERATE_TEMP_PASS', 'users', ?, ?, CURRENT_TIMESTAMP)
    `, [
      adminUser.id,
      userId,
      `إعادة إصدار كلمة مرور مؤقتة للمستخدم ${user.username} لمدة 8 ساعات تنتهي في ${expires_at_saudi}`
    ]);
  } catch (e) {}

  persistUsersToDisk();

  return {
    success: true,
    message: 'تم إعادة إصدار كلمة المرور المؤقتة بنجاح لمدة 8 ساعات تبدأ من الآن.',
    credentials: {
      user_id: user.id,
      username: user.username,
      full_name: user.full_name,
      temp_password: rawTempPass,
      expires_at_utc: expires_at_utc,
      expires_at_saudi: expires_at_saudi
    }
  };
}

/**
 * Mandatory Password Change (for both first-login temporary passwords and user profile changes)
 */
function changePassword(userId, currentPassword, newPassword) {
  const user = get('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) throw new Error('المستخدم غير موجود');

  // Verify current password
  if (!verifyPassword(currentPassword, user.password)) {
    throw new Error('كلمة المرور الحالية غير صحيحة');
  }

  // If user has a temporary password, check if it already expired
  if (user.is_temporary_password === 1 && user.temp_password_expires_at) {
    if (new Date() > new Date(user.temp_password_expires_at)) {
      throw new Error('انتهت صلاحية كلمة المرور المؤقتة، يرجى التواصل مع مدير النظام.');
    }
  }

  // Validate new password: minimum 8 characters
  if (!newPassword || newPassword.trim().length < 8) {
    throw new Error('كلمة المرور الجديدة يجب أن لا تقل عن 8 خانات وتحتوي على أرقام وحروف');
  }

  const hashedPassword = hashPassword(newPassword.trim());

  run(`
    UPDATE users SET
      password = ?,
      is_temporary_password = 0,
      temp_password_expires_at = NULL,
      must_change_password = 0,
      password_hash_algo = 'pbkdf2',
      status = 'نشط',
      is_active = 1
    WHERE id = ?
  `, [hashedPassword, userId]);

  try {
    run(`
      INSERT INTO audit_logs (user_id, action, target_type, target_id, details, created_at)
      VALUES (?, 'CHANGE_PASSWORD', 'users', ?, 'قام المستخدم بتغيير كلمة المرور وتعيين كلمة مرور دائمة', CURRENT_TIMESTAMP)
    `, [userId, userId]);
  } catch (e) {}

  persistUsersToDisk();

  return {
    success: true,
    message: 'تم تغيير كلمة المرور وتعيين كلمة المرور الدائمة بنجاح!'
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
  const password = (data.password && data.password.trim() !== '') ? hashPassword(data.password.trim()) : existing.password;
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

  persistUsersToDisk();

  return get('SELECT * FROM users WHERE id = ?', [id]);
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

module.exports = {
  login,
  getAllUsers,
  createUserFromEmployee,
  regenerateTempPassword,
  changePassword,
  getAvailableEmployeesForUserCreation,
  hashPassword,
  verifyPassword,
  generateSecureTempPassword,
  get8HourExpiryDates,
  updateUser,
  deleteUser,
  persistUsersToDisk,
  restoreUsersFromDisk,
  reconcileUserEmployeeLinks,
  syncUserPermissionsTable
};
