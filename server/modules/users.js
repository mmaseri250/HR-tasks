// server/modules/users.js - User Management, Authentication & Persistent Synchronization
const { query, get, run } = require('../database/db');
const fs = require('fs');
const path = require('path');

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
        is_active: u.is_active,
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
        if (!emp && u.username === 'shama.asiri') {
          emp = emps.find(e => normalizeAr(e.full_name_ar).includes('شامه') || e.emp_code === 'JM-1053');
        }
        if (!emp && u.username === 'abdulmalik') {
          emp = emps.find(e => normalizeAr(e.full_name_ar).includes('عبدالملك') || e.emp_code === 'JM-1000');
        }
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
 * Ensures no custom or administrator-created users are ever lost
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

      if (!existing) {
        run(`
          INSERT INTO users (username, password, full_name, email, role, permissions, emp_id, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [u.username.trim(), pass, fullName, email, role, permsStr, empId, isActive]);
      } else {
        // Keep updated details without losing password if not provided
        const finalPass = (u.password && u.password.trim() !== '') ? u.password.trim() : existing.password;
        run(`
          UPDATE users SET
            password = ?, full_name = ?, email = ?,
            role = ?, permissions = ?, emp_id = ?, is_active = ?
          WHERE id = ?
        `, [finalPass, fullName, email, role, permsStr, empId, isActive, existing.id]);
      }
    }
    reconcileUserEmployeeLinks();
  } catch (err) {
    console.error('Error restoring users from disk:', err.message);
  }
}

function login(username, password) {
  if (!username || !password) {
    throw new Error('اسم المستخدم وكلمة المرور مطلوبان');
  }

  const user = get('SELECT * FROM users WHERE username = ?', [username.trim()]);
  if (!user) {
    throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
  }

  if (user.password !== password) {
    throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
  }

  if (user.is_active === 0) {
    throw new Error('هذا الحساب معطل، يرجى التواصل مع إدارة النظام');
  }

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

  return userSafe;
}

function getAllUsers() {
  const users = query('SELECT id, username, full_name, email, role, permissions, emp_id, is_active, created_at FROM users ORDER BY id ASC');
  return users.map(u => {
    try {
      u.permissions = JSON.parse(u.permissions || '[]');
    } catch (e) {
      u.permissions = [];
    }
    return u;
  });
}

function createUser(data) {
  const { username, password, full_name, email = null, role = 'employee', permissions = [], emp_id = null } = data;

  if (!username || !password || !full_name) {
    throw new Error('اسم المستخدم، كلمة المرور، والاسم الكامل حقول مطلوبة');
  }

  const existing = get('SELECT id FROM users WHERE username = ?', [username.trim()]);
  if (existing) {
    throw new Error('اسم المستخدم مستخدم بالفعل، يرجى اختيار اسم مستخدم آخر');
  }

  const permsStr = typeof permissions === 'string' ? permissions : JSON.stringify(permissions);

  const result = run(`
    INSERT INTO users (username, password, full_name, email, role, permissions, emp_id, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `, [username.trim(), password, full_name.trim(), email ? email.trim() : null, role, permsStr, emp_id ? Number(emp_id) : null]);

  const newUser = get('SELECT id, username, full_name, email, role, permissions, emp_id, is_active, created_at FROM users WHERE id = ?', [result.lastInsertRowid]);
  try {
    newUser.permissions = JSON.parse(newUser.permissions || '[]');
  } catch (e) {
    newUser.permissions = [];
  }

  // Automatically persist to permanent JSON backup
  persistUsersToDisk();

  return newUser;
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

  let permsStr = existing.permissions;
  if (data.permissions !== undefined) {
    permsStr = typeof data.permissions === 'string' ? data.permissions : JSON.stringify(data.permissions);
  }

  run(`
    UPDATE users SET
      username = ?, password = ?, full_name = ?, email = ?,
      role = ?, permissions = ?, emp_id = ?, is_active = ?
    WHERE id = ?
  `, [username, password, fullName, email, role, permsStr, empId, isActive, id]);

  const updated = get('SELECT id, username, full_name, email, role, permissions, emp_id, is_active, created_at FROM users WHERE id = ?', [id]);
  try {
    updated.permissions = JSON.parse(updated.permissions || '[]');
  } catch (e) {
    updated.permissions = [];
  }

  // Automatically persist to permanent JSON backup
  persistUsersToDisk();

  return updated;
}

function deleteUser(id) {
  const user = get('SELECT * FROM users WHERE id = ?', [id]);
  if (!user) throw new Error('المستخدم غير موجود');

  if (user.username === 'admin') {
    throw new Error('لا يمكن حذف المستخدم الرئيسي للنظام (admin)');
  }

  const result = run('DELETE FROM users WHERE id = ?', [id]);

  // Automatically persist to permanent JSON backup
  persistUsersToDisk();

  return result;
}

/**
 * Synchronize and consolidate users from client or external payload
 * Ensures all entries are updated, new users inserted, and persisted safely
 */
function syncUsers(incomingUsers = []) {
  if (!Array.isArray(incomingUsers)) {
    incomingUsers = [];
  }

  for (const u of incomingUsers) {
    if (!u || !u.username) continue;
    const cleanUsername = u.username.trim();
    const existing = get('SELECT * FROM users WHERE username = ? OR (id IS NOT NULL AND id = ?)', [cleanUsername, u.id || -1]);

    const permsStr = typeof u.permissions === 'string' ? u.permissions : JSON.stringify(u.permissions || ['requests', 'selfservice']);
    const pass = (u.password && u.password.trim() !== '') ? u.password.trim() : (existing ? existing.password : 'Jj123');
    const fullName = u.full_name ? u.full_name.trim() : (existing ? existing.full_name : cleanUsername);
    const email = u.email ? u.email.trim() : (existing ? existing.email : null);
    const role = u.role || (existing ? existing.role : 'employee');
    const empId = u.emp_id ? Number(u.emp_id) : (existing ? existing.emp_id : null);
    const isActive = u.is_active !== undefined ? Number(u.is_active) : (existing ? existing.is_active : 1);

    if (existing) {
      run(`
        UPDATE users SET
          username = ?, password = ?, full_name = ?, email = ?,
          role = ?, permissions = ?, emp_id = ?, is_active = ?
        WHERE id = ?
      `, [cleanUsername, pass, fullName, email, role, permsStr, empId, isActive, existing.id]);
    } else {
      run(`
        INSERT INTO users (username, password, full_name, email, role, permissions, emp_id, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [cleanUsername, pass, fullName, email, role, permsStr, empId, isActive]);
    }
  }

  persistUsersToDisk();
  return getAllUsers();
}

// Ensure persisted users are synchronized upon module load
try {
  restoreUsersFromDisk();
} catch (e) {
  console.warn('Initial users restore error:', e.message);
}

module.exports = {
  login,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  syncUsers,
  persistUsersToDisk,
  restoreUsersFromDisk,
  reconcileUserEmployeeLinks
};
