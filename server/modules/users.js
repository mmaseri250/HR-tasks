// server/modules/users.js
const { query, get, run } = require('../database/db');

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

  // Return user without password
  const { password: _, ...userSafe } = user;
  try {
    userSafe.permissions = JSON.parse(user.permissions || '[]');
  } catch (e) {
    userSafe.permissions = ['all'];
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
  return updated;
}

function deleteUser(id) {
  const user = get('SELECT * FROM users WHERE id = ?', [id]);
  if (!user) throw new Error('المستخدم غير موجود');

  if (user.username === 'admin') {
    throw new Error('لا يمكن حذف المستخدم الرئيسي للنظام (admin)');
  }

  return run('DELETE FROM users WHERE id = ?', [id]);
}

module.exports = {
  login,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
