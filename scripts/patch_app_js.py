import os

path = r'C:\jawharat-hrms\public\js\app.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content_norm = content.replace('\r\n', '\n')

# 1. Update TAB_PERMISSION_MAP and userHasPermissionForTab
old_perm_map_block = '''const TAB_PERMISSION_MAP = {
  'dashboard': ['dashboard.view', 'dashboard'],
  'employees-db': ['employees.view', 'employees'],
  'leaves': ['leaves.view', 'leaves', 'requests.view', 'requests'],
  'tasks': ['tasks.view', 'tasks'],
  'forms': ['forms.view', 'forms'],
  'compliance': ['compliance.view', 'compliance'],
  'penalties': ['penalties.view', 'penalties'],
  'attendance': ['attendance.view', 'attendance'],
  'payroll': ['payroll.view', 'payroll'],
  'loans': ['loans.view', 'loans'],
  'terminated': ['terminated.view', 'terminated'],
  'attendance-notices': ['attendance.view', 'attendance'],
  'absence': ['attendance.view', 'attendance'],
  'selfservice': ['selfservice.view', 'selfservice'],
  'organization': ['hierarchy.view', 'organization'],
  'branches': ['branches.view', 'branches'],
  'users': ['users.view', 'users'],
  'audit-log': ['audit.view', 'audit'],
  'data-exchange': ['data_exchange.view', 'data_exchange'],
  'docs': ['docs.view', 'docs']
};

function userHasPermissionForTab(tabId) {
  if (!state.currentUser) return false;
  const role = state.currentUser.role;
  if (role === 'admin') return true;

  // Dashboard, ESS and Circulars portals are universally accessible to all authenticated users
  if (tabId === 'dashboard' || tabId === 'selfservice' || tabId === 'circulars') return true;
  if (tabId === 'hr-center') {
    return role === 'admin' || role === 'hr_manager' || role === 'dept_manager' || role === 'direct_manager' || role === 'hr_specialist';
  }

  const effPerms = state.currentUser.effective_permissions || state.currentUser.permissions || [];
  if (effPerms.includes('all') || effPerms.includes('*')) return true;

  // HR Manager has access to all operational modules except users and audit
  if (role === 'hr_manager') {
    if (tabId === 'users' && !effPerms.includes('users.view') && !effPerms.includes('users')) return false;
    if (tabId === 'audit-log' && !effPerms.includes('audit.view') && !effPerms.includes('audit')) return false;
    return true;
  }

  // Dept Manager has access to department scopes
  if (role === 'dept_manager') {
    const deptAllowedTabs = ['dashboard', 'employees-db', 'leaves', 'tasks', 'attendance', 'compliance', 'organization', 'forms', 'selfservice', 'circulars', 'licenses', 'reports'];
    if (deptAllowedTabs.includes(tabId)) return true;
  }

  // Direct Manager
  if (role === 'direct_manager') {
    const dmAllowedTabs = ['dashboard', 'leaves', 'tasks', 'forms', 'selfservice'];
    if (dmAllowedTabs.includes(tabId)) return true;
  }

  // Regular Employee has dashboard and selfservice access
  if (role === 'employee') {
    const empAllowedTabs = ['dashboard', 'selfservice'];
    if (empAllowedTabs.includes(tabId)) return true;
  }

  const required = TAB_PERMISSION_MAP[tabId];
  if (!required) return true;

  return required.some(req => effPerms.includes(req));
}'''

new_perm_map_block = '''const TAB_PERMISSION_MAP = {
  'dashboard': ['dashboard.view', 'dashboard'],
  'hr-center': ['hr_center.view', 'hr_center', 'employees.view', 'employees'],
  'employees-db': ['employees.view', 'employees'],
  'leaves': ['leaves.view', 'leaves', 'requests.view', 'requests'],
  'tasks': ['tasks.view', 'tasks'],
  'forms': ['forms.view', 'forms'],
  'compliance': ['compliance.view', 'compliance'],
  'penalties': ['penalties.view', 'penalties'],
  'attendance': ['attendance.view', 'attendance'],
  'payroll': ['payroll.view', 'payroll'],
  'loans': ['loans.view', 'loans'],
  'terminated': ['terminated.view', 'terminated', 'employees.view', 'employees'],
  'recruitment': ['recruitment.view', 'recruitment'],
  'job-descriptions': ['job_descriptions.view', 'job_descriptions', 'recruitment.view', 'recruitment'],
  'fleet': ['fleet.view', 'fleet'],
  'insurance': ['fleet.view', 'fleet', 'insurance.view', 'insurance'],
  'attendance-notices': ['attendance.view', 'attendance', 'notices.view', 'notices'],
  'absence': ['attendance.view', 'attendance', 'notices.view', 'notices'],
  'selfservice': ['selfservice.view', 'selfservice', 'requests.view', 'requests'],
  'circulars': ['circulars.view', 'circulars'],
  'licenses': ['licenses.view', 'licenses'],
  'reports': ['reports.view', 'reports'],
  'organization': ['hierarchy.view', 'organization'],
  'branches': ['branches.view', 'branches', 'organization'],
  'users': ['users.view', 'users'],
  'audit-log': ['audit.view', 'audit'],
  'data-exchange': ['data_exchange.view', 'data_exchange'],
  'docs': ['docs.view', 'docs']
};

function userHasPermissionForTab(tabId) {
  if (!state.currentUser) return false;
  const role = state.currentUser.role;
  // Admin has full access to all tabs
  if (role === 'admin') return true;

  // Universally accessible portals for all authenticated staff
  if (tabId === 'dashboard' || tabId === 'selfservice' || tabId === 'circulars') return true;

  const effPerms = state.currentUser.effective_permissions || state.currentUser.permissions || [];
  if (effPerms.includes('all') || effPerms.includes('*')) return true;

  // Strict RBAC: Any unmapped tab is denied by default to eliminate overlapping/unintended access
  const required = TAB_PERMISSION_MAP[tabId];
  if (!required || required.length === 0) return false;

  // Explicit permission check: checks full dot-code (e.g. fleet.view) or base module code (e.g. fleet)
  return required.some(req => {
    if (effPerms.includes(req)) return true;
    const prefix = req.split('.')[0];
    if (effPerms.includes(prefix)) return true;
    return false;
  });
}'''

if old_perm_map_block in content_norm:
    content_norm = content_norm.replace(old_perm_map_block, new_perm_map_block, 1)
    print('1. Updated TAB_PERMISSION_MAP & userHasPermissionForTab')
else:
    print('1. Could not find old_perm_map_block')

# 2. Update ALL_RBAC_PERM_KEYS and applyRbacPreset
old_rbac_keys_block = '''const ALL_RBAC_PERM_KEYS = [
  'requests', 'payslips', 'approvals', 'employees',
  'attendance', 'penalties', 'payroll', 'tasks', 'loans',
  'notices', 'compliance', 'users', 'audit',
  'edit_attendance', 'edit_balances', 'delete'
];

function applyRbacPreset(preset) {
  ALL_RBAC_PERM_KEYS.forEach(k => {
    const el = document.getElementById(`perm_${k}`);
    if (!el) return;
    el.disabled = false;
    if (preset === 'admin') {
      el.checked = true;
    } else if (preset === 'hr') {
      const hrExcluded = ['edit_attendance', 'edit_balances', 'delete', 'users', 'audit'];
      el.checked = !hrExcluded.includes(k);
      if (hrExcluded.includes(k)) el.disabled = true;
    } else if (preset === 'manager') {
      const mgrAllowed = ['requests', 'payslips', 'approvals', 'employees', 'tasks', 'attendance'];
      el.checked = mgrAllowed.includes(k);
    } else if (preset === 'employee') {
      const empAllowed = ['requests', 'payslips'];
      el.checked = empAllowed.includes(k);
    }
  });
}'''

new_rbac_keys_block = '''const ALL_RBAC_PERM_KEYS = [
  'requests', 'payslips', 'approvals', 'employees',
  'attendance', 'penalties', 'payroll', 'tasks', 'loans',
  'notices', 'compliance', 'fleet', 'licenses', 'recruitment',
  'job_descriptions', 'reports', 'organization', 'users', 'audit',
  'edit_attendance', 'edit_balances', 'delete'
];

function applyRbacPreset(preset) {
  ALL_RBAC_PERM_KEYS.forEach(k => {
    const el = document.getElementById(`perm_${k}`);
    if (!el) return;
    el.disabled = false;
    if (preset === 'admin') {
      el.checked = true;
    } else if (preset === 'hr') {
      const hrExcluded = ['edit_attendance', 'edit_balances', 'delete', 'users', 'audit'];
      el.checked = !hrExcluded.includes(k);
      if (hrExcluded.includes(k)) el.disabled = true;
    } else if (preset === 'manager') {
      const mgrAllowed = ['requests', 'payslips', 'approvals', 'employees', 'tasks', 'attendance', 'reports'];
      el.checked = mgrAllowed.includes(k);
    } else if (preset === 'employee') {
      const empAllowed = ['requests', 'payslips'];
      el.checked = empAllowed.includes(k);
    }
  });
}'''

if old_rbac_keys_block in content_norm:
    content_norm = content_norm.replace(old_rbac_keys_block, new_rbac_keys_block, 1)
    print('2. Updated ALL_RBAC_PERM_KEYS & presets')
else:
    print('2. Could not find old_rbac_keys_block')

# 3. Update handleAddUserSubmit
old_handle_user = '''  if (!username || !fullName || (!isEditing && !password)) {
    alert('يرجى تعبئة كافة الحقول المطلوبة');
    return;
  }

  const perms = [];
  ALL_RBAC_PERM_KEYS.forEach(k => {
    const chk = document.getElementById(`perm_${k}`);
    if (chk && chk.checked) perms.push(k);
  });
  if (role === 'admin') perms.push('all');

  const userData = {
    username,
    full_name: fullName,
    role,
    permissions: perms,
    emp_id: empId ? Number(empId) : null,
    custom_data_scope: customScope || null,
    is_active: 1
  };
  if (password) {
    userData.password = password;
  }

  if (isEditing) {
    const res = await apiFetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const updated = (res && res.success && res.data) ? res.data : { ...userData, id: userId };
    const idx = state.users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      state.users[idx] = { ...state.users[idx], ...updated };
    }

    if (state.currentUser && state.currentUser.id === userId) {
      state.currentUser = { ...state.currentUser, ...updated };
      sessionStorage.setItem('jawharat_auth_user', JSON.stringify(state.currentUser));
      localStorage.setItem('jm_hrms_user', JSON.stringify(state.currentUser));
      updateHeaderUserDisplay();
      applyRolePermissions();
    }

    closeModal('modalAddUser');
    alert(`تم تحديث بيانات وصلاحيات المستخدم [${username}] بنجاح`);
  } else {
    const res = await apiFetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (res && res.success && res.data) {
      state.users.push(res.data);
    } else {
      userData.id = Date.now();
      userData.created_at = new Date().toISOString().split('T')[0];
      state.users.push(userData);
    }

    closeModal('modalAddUser');
    alert(`تم إنشاء حساب المستخدم [${username}] بنجاح وتعيين الصلاحيات`);
  }'''

new_handle_user = '''  if (!username || !fullName) {
    alert('يرجى كتابة اسم المستخدم والاسم الكامل للمتابعة');
    return;
  }

  const perms = [];
  ALL_RBAC_PERM_KEYS.forEach(k => {
    const chk = document.getElementById(`perm_${k}`);
    if (chk && chk.checked) perms.push(k);
  });
  if (role === 'admin') perms.push('all');

  const userData = {
    username,
    full_name: fullName,
    role,
    permissions: perms,
    emp_id: empId ? Number(empId) : null,
    custom_data_scope: customScope || null,
    is_active: isEditing ? 1 : 0
  };
  if (password) {
    userData.password = password;
  }

  if (isEditing) {
    const res = await apiFetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const updated = (res && res.success && res.data) ? res.data : { ...userData, id: userId };
    const idx = state.users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      state.users[idx] = { ...state.users[idx], ...updated };
    }

    if (state.currentUser && state.currentUser.id === userId) {
      state.currentUser = { ...state.currentUser, ...updated };
      sessionStorage.setItem('jawharat_auth_user', JSON.stringify(state.currentUser));
      localStorage.setItem('jm_hrms_user', JSON.stringify(state.currentUser));
      updateHeaderUserDisplay();
      applyRolePermissions();
    }

    closeModal('modalAddUser');
    alert(`تم تحديث بيانات وصلاحيات المستخدم [${username}] بنجاح`);
    renderUsersTable();
  } else {
    const res = await apiFetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    closeModal('modalAddUser');

    if (res && res.success && res.data) {
      state.users.push(res.data);
      renderUsersTable();
      openActivationNoticeModal(res.data);
    } else {
      userData.id = Date.now();
      userData.created_at = new Date().toISOString().split('T')[0];
      userData.status = 'معلق - بانتظار تعيين كلمة المرور';
      state.users.push(userData);
      renderUsersTable();
      alert(`تم إنشاء حساب المستخدم [${username}] بنجاح بحالة: معلق بانتظار تعيين كلمة المرور.`);
    }
  }'''

if old_handle_user in content_norm:
    content_norm = content_norm.replace(old_handle_user, new_handle_user, 1)
    print('3. Updated handleAddUserSubmit')
else:
    print('3. Could not find old_handle_user')

# 4. Update renderUsersTable
old_render_users = '''    const permLabels = {
      all: 'كامل الصلاحيات',
      requests: 'الخدمة الذاتية',
      payslips: 'قسائم الرواتب',
      approvals: 'الاعتمادات',
      employees: 'قاعدة الموظفين',
      attendance: 'الحضور والبصمة',
      penalties: 'لائحة الجزاءات',
      payroll: 'مسيرات الرواتب',
      users: 'إدارة المستخدمين',
      edit_attendance: 'تعديل الحضور',
      edit_balances: 'تعديل الأرصدة',
      delete: 'الحذف النهائي'
    };

    let permsBadges = perms.map(p => `<span class="inline-block text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">${permLabels[p] || p}</span>`).join(' ');
    if (u.role === 'admin' || perms.includes('all')) {
      permsBadges = '<span class="text-[9px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-black">كافة صلاحيات النظام</span>';
    }

    tbody.innerHTML += `
      <tr class="hover:bg-slate-50 transition">
        <td class="py-3 px-4 font-mono font-bold text-brand">${u.username}</td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900">${u.full_name}</div>
          <div class="mt-0.5">${scopeBadge}</div>
        </td>
        <td class="py-3 px-4">${roleBadge}</td>
        <td class="py-3 px-4 flex flex-wrap gap-1 max-w-xs">${permsBadges}</td>
        <td class="py-3 px-4"><span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> نشط</span></td>
        <td class="py-3 px-4 text-center">
          <div class="flex items-center justify-center gap-1.5 flex-wrap">
            <button onclick="openEffectivePermissionsInspector(${u.id})" class="text-purple-600 hover:text-purple-800 font-bold text-xs px-2 py-1 rounded bg-purple-50 hover:bg-purple-100 transition shadow-xs" title="كاشف الصلاحيات الفعلية">
              <i class="fa-solid fa-shield-halved"></i> كاشف الصلاحيات
            </button>
            <button onclick="editUserAccount(${u.id})" class="text-blue-600 hover:text-blue-800 font-bold text-xs px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 transition shadow-xs" title="تعديل الصلاحيات والحساب">
              <i class="fa-solid fa-user-pen"></i> تعديل
            </button>
            ${(u.username === 'admin' || !canDelete()) ? '' : `
              <button onclick="deleteUserAccount(${u.id})" class="text-rose-600 hover:text-rose-800 font-bold text-xs px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 transition shadow-xs" title="حذف المستخدم">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            `}
          </div>
        </td>
      </tr>
    `;'''

new_render_users = '''    const permLabels = {
      all: 'كامل الصلاحيات',
      requests: 'الخدمة الذاتية',
      payslips: 'قسائم الرواتب',
      approvals: 'الاعتمادات',
      employees: 'قاعدة الموظفين',
      attendance: 'الحضور والبصمة',
      penalties: 'لائحة الجزاءات',
      payroll: 'مسيرات الرواتب',
      tasks: 'إدارة المهام',
      loans: 'السلف والأقساط',
      notices: 'إشعارات الدوام',
      compliance: 'الامتثال ومقيم',
      fleet: 'أسطول المركبات',
      licenses: 'السجلات والتراخيص',
      recruitment: 'التوظيف',
      job_descriptions: 'الوصف الوظيفي',
      reports: 'التقارير التحليلية',
      organization: 'الهيكل والفروع',
      users: 'إدارة المستخدمين',
      audit: 'سجل الرقابة',
      edit_attendance: 'تعديل الحضور',
      edit_balances: 'تعديل الأرصدة',
      delete: 'الحذف النهائي'
    };

    let permsBadges = perms.map(p => `<span class="inline-block text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">${permLabels[p] || p}</span>`).join(' ');
    if (u.role === 'admin' || perms.includes('all')) {
      permsBadges = '<span class="text-[9px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-black">كافة صلاحيات النظام</span>';
    }

    // Dynamic Live Activation Status Badging
    const isPending = (u.status === 'معلق - بانتظار تعيين كلمة المرور') || (!u.activated_at && u.activation_token && u.username !== 'admin');
    const isExpired = u.status === 'منتهي صلاحية التفعيل' || (u.activation_token_expires_at && new Date(u.activation_token_expires_at) < new Date() && !u.activated_at && u.username !== 'admin');
    
    let statusBadge = '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> نشط</span>';
    if (isExpired) {
      statusBadge = '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200"><i class="fa-solid fa-triangle-exclamation"></i> منتهي الصلاحية</span>';
    } else if (isPending) {
      statusBadge = '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200"><i class="fa-solid fa-clock"></i> بانتظار التفعيل (24س)</span>';
    } else if (u.is_active === 0) {
      statusBadge = '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">معطل</span>';
    }

    tbody.innerHTML += `
      <tr class="hover:bg-slate-50 transition">
        <td class="py-3 px-4 font-mono font-bold text-brand">${u.username}</td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900">${u.full_name}</div>
          <div class="mt-0.5">${scopeBadge}</div>
        </td>
        <td class="py-3 px-4">${roleBadge}</td>
        <td class="py-3 px-4 flex flex-wrap gap-1 max-w-xs">${permsBadges}</td>
        <td class="py-3 px-4">${statusBadge}</td>
        <td class="py-3 px-4 text-center">
          <div class="flex items-center justify-center gap-1.5 flex-wrap">
            ${(isPending || isExpired) ? `
              <button onclick="copyUserActivationLink(${u.id})" class="text-amber-700 hover:text-amber-900 font-bold text-xs px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 transition shadow-xs" title="نسخ رابط التفعيل الصالح لـ 24 ساعة">
                <i class="fa-solid fa-link"></i> رابط التفعيل
              </button>
              <button onclick="resendUserActivation(${u.id})" class="text-blue-700 hover:text-blue-900 font-bold text-xs px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition shadow-xs" title="إعادة إرسال وتمديد صلاحية التفعيل لـ 24 ساعة">
                <i class="fa-solid fa-rotate-right"></i> تمديد 24س
              </button>
            ` : ''}
            <button onclick="openEffectivePermissionsInspector(${u.id})" class="text-purple-600 hover:text-purple-800 font-bold text-xs px-2 py-1 rounded bg-purple-50 hover:bg-purple-100 transition shadow-xs" title="كاشف الصلاحيات الفعلية">
              <i class="fa-solid fa-shield-halved"></i> كاشف الصلاحيات
            </button>
            <button onclick="editUserAccount(${u.id})" class="text-blue-600 hover:text-blue-800 font-bold text-xs px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 transition shadow-xs" title="تعديل الصلاحيات والحساب">
              <i class="fa-solid fa-user-pen"></i> تعديل
            </button>
            ${(u.username === 'admin' || !canDelete()) ? '' : `
              <button onclick="deleteUserAccount(${u.id})" class="text-rose-600 hover:text-rose-800 font-bold text-xs px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 transition shadow-xs" title="حذف المستخدم">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            `}
          </div>
        </td>
      </tr>
    `;'''

if old_render_users in content_norm:
    content_norm = content_norm.replace(old_render_users, new_render_users, 1)
    print('4. Updated renderUsersTable with dynamic statuses & activation actions')
else:
    print('4. Could not find old_render_users')

# 5. Add Activation link helpers and Job Description functions at end of app.js
helpers_code = '''
/* =========================================================================
   USER ACTIVATION & 24-HOUR TOKEN HELPERS
   ========================================================================= */

function openActivationNoticeModal(data) {
  if (!data) return;
  const usernameEl = document.getElementById('actNoticeUsername');
  const nameEl = document.getElementById('actNoticeFullName');
  const expEl = document.getElementById('actNoticeExpires');
  const inputEl = document.getElementById('actNoticeLinkInput');

  if (usernameEl) usernameEl.textContent = data.username || '--';
  if (nameEl) nameEl.textContent = data.full_name || '--';
  if (expEl) expEl.textContent = data.activation_token_expires_at ? new Date(data.activation_token_expires_at).toLocaleString('ar-SA') : 'بعد 24 ساعة';
  
  const link = data.activation_link || `${window.location.origin}/activate-account.html?token=${data.activation_token || ''}`;
  if (inputEl) inputEl.value = link;

  openModal('modalUserActivationNotice');
}

function copyActivationNoticeLink() {
  const inputEl = document.getElementById('actNoticeLinkInput');
  if (!inputEl || !inputEl.value) return;
  inputEl.select();
  navigator.clipboard.writeText(inputEl.value).then(() => {
    alert('✓ تم نسخ رابط التفعيل (الصالح لـ 24 ساعة) بنجاح إلى الحافظة.');
  }).catch(() => {
    prompt('انسخ الرابط التالي:', inputEl.value);
  });
}

async function copyUserActivationLink(userId) {
  const u = (state.users || []).find(x => Number(x.id) === Number(userId));
  if (!u) {
    alert('لم يتم العثور على المستخدم');
    return;
  }
  if (!u.activation_token) {
    // Re-issue activation token automatically
    await resendUserActivation(userId);
    return;
  }
  const link = `${window.location.origin}/activate-account.html?token=${u.activation_token}`;
  openActivationNoticeModal({
    username: u.username,
    full_name: u.full_name,
    activation_token_expires_at: u.activation_token_expires_at,
    activation_link: link
  });
}

async function resendUserActivation(userId) {
  try {
    const res = await apiFetch(`/api/users/${userId}/resend-activation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res && res.success && res.data) {
      const idx = (state.users || []).findIndex(x => Number(x.id) === Number(userId));
      if (idx !== -1) {
        state.users[idx] = { ...state.users[idx], ...res.data };
      }
      renderUsersTable();
      openActivationNoticeModal(res.data);
    } else {
      alert('فشل تمديد رابط التفعيل: ' + (res?.error || 'خطأ غير معروف'));
    }
  } catch (err) {
    alert('حدث خطأ أثناء طلب التمديد: ' + err.message);
  }
}

/* =========================================================================
   JOB DESCRIPTION SHEET ENHANCEMENTS
   ========================================================================= */

function openNewJobDescriptionModal() {
  switchTab('job-descriptions');
  const titleInput = document.getElementById('aiJdTitleInput');
  const notesInput = document.getElementById('aiJdNotesInput');
  if (titleInput) {
    titleInput.value = '';
    titleInput.focus();
  }
  if (notesInput) notesInput.value = '';
  const preview = document.getElementById('aiJdPreviewContainer');
  if (preview) {
    preview.innerHTML = `
      <div class="p-8 text-center text-slate-400">
        <i class="fa-solid fa-wand-magic-sparkles text-4xl mb-3 text-amber-500"></i>
        <p class="font-bold">أدخل المسمى الوظيفي واضغط "توليد الوصف الوظيفي الذكي" لإنشاء البطاقة المعيارية فوراً.</p>
      </div>
    `;
  }
}

async function openJobDescriptionForEmployee(empId) {
  const emp = (state.employees || []).find(e => Number(e.id) === Number(empId) || String(e.emp_id) === String(empId));
  if (!emp) {
    alert('لم يتم العثور على بيانات الموظف');
    return;
  }
  const jobTitle = emp.job_title || emp.position || 'موظف';
  const dept = emp.department || 'إدارة الموارد البشرية';

  try {
    const listRes = await apiFetch('/api/recruitment/job-descriptions');
    if (listRes && listRes.success && Array.isArray(listRes.data)) {
      const existing = listRes.data.find(j => j.job_title_ar === jobTitle || (j.job_title_ar && j.job_title_ar.includes(jobTitle)));
      if (existing) {
        window.open(`/api/recruitment/job-descriptions/${existing.id}/print`, '_blank');
        return;
      }
    }

    // Auto-generate if not pre-existing
    const genRes = await apiFetch('/api/recruitment/job-descriptions/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job_title_ar: jobTitle,
        department_ar: dept,
        job_level: 'تخصصي',
        experience_years: '3 إلى 5 سنوات',
        custom_instructions: `بطاقة وصف وظيفي معتمدة لموظف شركة جوهرة المجد: ${emp.full_name_ar || emp.name} (${emp.emp_id || emp.id})`
      })
    });

    if (genRes && genRes.success && genRes.data) {
      const saveRes = await apiFetch('/api/recruitment/job-descriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(genRes.data)
      });
      if (saveRes && saveRes.success && saveRes.data?.id) {
        window.open(`/api/recruitment/job-descriptions/${saveRes.data.id}/print`, '_blank');
        return;
      }
    }
  } catch (err) {
    console.error('Error fetching/generating JD for employee:', err);
  }

  // Fallback: switch to JD tab and pre-fill title
  switchTab('job-descriptions');
  const titleInput = document.getElementById('aiJdTitleInput');
  if (titleInput) {
    titleInput.value = jobTitle;
    titleInput.focus();
  }
}
'''

# 6. Update printActiveJd and exportActiveJdDocx
old_jd_actions = '''function printActiveJd() {
  if (!activeGeneratedJd) return;
  const w = window.open('', '_blank');
  w.document.write(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head><title>بطاقة الوصف الوظيفي - ${activeGeneratedJd.job_title_ar}</title></head>
    <body onload="window.print()">
      ${document.getElementById('aiJdPreviewContainer').innerHTML}
    </body>
    </html>
  `);
  w.document.close();
}

function exportActiveJdDocx() {
  if (!activeGeneratedJd || !activeGeneratedJd.id) {
    alert('يرجى حفظ الوصف الوظيفي أولاً لإنشاء ملف Word رسمي معتمد');
    return;
  }
  window.location.href = `/api/recruitment/job-descriptions/${activeGeneratedJd.id}/export/docx`;
}'''

new_jd_actions = '''async function printActiveJd() {
  if (!activeGeneratedJd) {
    alert('يرجى توليد أو اختيار بطاقة وصف وظيفي أولاً.');
    return;
  }
  if (!activeGeneratedJd.id) {
    try {
      const res = await apiFetch('/api/recruitment/job-descriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeGeneratedJd)
      });
      if (res && res.success && res.data?.id) {
        activeGeneratedJd.id = res.data.id;
        await loadJobDescriptionsView();
      }
    } catch (e) {
      console.warn('Auto-save JD failed:', e);
    }
  }
  if (activeGeneratedJd.id) {
    window.open(`/api/recruitment/job-descriptions/${activeGeneratedJd.id}/print`, '_blank');
  } else {
    const w = window.open('', '_blank');
    w.document.write(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="utf-8">
        <title>بطاقة الوصف الوظيفي - ${activeGeneratedJd.job_title_ar}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
          * { font-family: 'Cairo', sans-serif; }
          body { direction: rtl; padding: 24px; background: white; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body onload="setTimeout(() => window.print(), 300)">
        <div class="max-w-4xl mx-auto border border-slate-300 p-6 rounded-2xl">
          ${document.getElementById('aiJdPreviewContainer')?.innerHTML || ''}
        </div>
      </body>
      </html>
    `);
    w.document.close();
  }
}

async function exportActiveJdDocx() {
  if (!activeGeneratedJd) {
    alert('يرجى توليد أو اختيار بطاقة وصف وظيفي أولاً.');
    return;
  }
  if (!activeGeneratedJd.id) {
    try {
      const res = await apiFetch('/api/recruitment/job-descriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeGeneratedJd)
      });
      if (res && res.success && res.data?.id) {
        activeGeneratedJd.id = res.data.id;
        await loadJobDescriptionsView();
      }
    } catch (e) {
      console.warn('Auto-save JD failed:', e);
    }
  }
  if (!activeGeneratedJd.id) {
    alert('يرجى حفظ الوصف الوظيفي أولاً لإنشاء ملف Word معتمد.');
    return;
  }
  window.location.href = `/api/recruitment/job-descriptions/${activeGeneratedJd.id}/export/docx`;
}'''

if old_jd_actions in content_norm:
    content_norm = content_norm.replace(old_jd_actions, new_jd_actions, 1)
    print('6. Updated printActiveJd & exportActiveJdDocx')
else:
    print('6. Could not find old_jd_actions')

# 7. Add window exports
window_exports_addition = '''
// Global Window Exports for Activation & Job Descriptions
window.openActivationNoticeModal = openActivationNoticeModal;
window.copyActivationNoticeLink = copyActivationNoticeLink;
window.copyUserActivationLink = copyUserActivationLink;
window.resendUserActivation = resendUserActivation;
window.openNewJobDescriptionModal = openNewJobDescriptionModal;
window.openJobDescriptionForEmployee = openJobDescriptionForEmployee;
'''

content_norm += helpers_code + window_exports_addition

with open(path, 'w', encoding='utf-8') as f:
    f.write(content_norm)

print('Done writing C:\\jawharat-hrms\\public\\js\\app.js')
