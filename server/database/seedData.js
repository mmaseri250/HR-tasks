// server/database/seedData.js - Official Seed Database for Jawharat Al-Majd Co.
const { db, get, query, run } = require('./db');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

function dateConvert(val) {
  if (!val) return null;
  if (typeof val === 'string') {
    if (val.includes('-')) return val.trim();
    if (val.includes('/')) {
      const parts = val.split('/');
      if (parts.length === 3) return parts[2] + '-' + parts[1].padStart(2, '0') + '-' + parts[0].padStart(2, '0');
    }
    return val.trim();
  }
  if (typeof val === 'number') {
    const d = new Date(Math.round((val - 25569) * 86400 * 1000));
    return d.toISOString().split('T')[0];
  }
  return null;
}

function norm(s) {
  return (s || '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

function seedDatabase() {
  // 1. Company Settings
  run(`
    INSERT INTO company_settings (
      id, company_name_ar, company_name_en, cr_number, mhrsd_est_number,
      tax_number, phone, email, website, address_ar, bank_name,
      bank_code, corporate_account, wps_payer_id, office_lat, office_lng,
      geofence_radius_meters, updated_at
    ) VALUES (
      1,
      'شركة جوهرة المجد',
      'Jawharat Al-Majd Co.',
      '7004872169',
      '7013999755',
      '310492837400003',
      '920012405',
      'info@jalmajd.com',
      'https://jalmajd.com',
      'المملكة العربية السعودية، منطقة عسير، أبها، حي الشرفية - مول سيتي بارك',
      'مصرف الراجحي',
      'RJHI',
      'SA4480000392608010049283',
      'EST7004872169',
      18.2164,
      42.5053,
      300,
      datetime('now')
    )
    ON CONFLICT(id) DO UPDATE SET
      company_name_ar = 'شركة جوهرة المجد',
      company_name_en = 'Jawharat Al-Majd Co.',
      cr_number = '7004872169',
      wps_payer_id = 'EST7004872169',
      updated_at = datetime('now')
  `);

  // 2. Users System: Preserve all custom and existing users (NEVER DELETE)
  const hrPermissions = JSON.stringify([
    'requests', 'payslips', 'approvals', 'employees',
    'attendance', 'penalties', 'payroll', 'loans',
    'terminated_employees', 'notices', 'reports'
  ]);

  const existingAdmin = get("SELECT id FROM users WHERE username = 'admin'");
  if (!existingAdmin) {
    run(`
      INSERT INTO users (id, username, password, full_name, email, role, permissions, emp_id, is_active)
      VALUES (1, 'admin', 'Jj123', 'مدير النظام (Admin)', 'admin@jalmajd.com', 'admin', '["all"]', NULL, 1)
    `);
  }

  const existingHr = get("SELECT id FROM users WHERE username = 'abdulmalik'");
  if (!existingHr) {
    run(`
      INSERT INTO users (id, username, password, full_name, email, role, permissions, emp_id, is_active)
      VALUES (2, 'abdulmalik', 'Hr123', 'عبدالملك سعيد الشريف', 'abdulmalik.saeed@jalmajd.com', 'hr_manager', ?, NULL, 1)
    `, [hrPermissions]);
  }

  // Restore any persisted users from disk backup
  try {
    const usersModule = require('../modules/users');
    usersModule.restoreUsersFromDisk();
  } catch (e) {
    console.warn('Could not restore users during seed:', e.message);
  }

  // 3. Departments: Exactly 15 departments matching the Excel file (No empty departments!)
  run(`DELETE FROM departments`);
  const departments = [
    { code: 'HR', name_ar: 'إدارة الموارد البشرية', name_en: 'Human Resources Department', manager: 'عبدالملك سعيد الشريف', budget: 250000, loc: 'مقر الإدارة العامة - أبها' },
    { code: 'SALES', name_ar: 'إدارة المبيعات', name_en: 'Sales Department', manager: 'خالد احمد محمد راعي', budget: 500000, loc: 'سيتي بارك وفروع المعارض' },
    { code: 'TAQEEB', name_ar: 'إدارة التعقيب', name_en: 'Government Relations (Taqeeb)', manager: 'عبدالملك سعيد الشريف', budget: 150000, loc: 'مقر الإدارة العامة - أبها' },
    { code: 'PROJECTS', name_ar: 'إدارة المشاريع والمقاولات', name_en: 'Projects & Contracting', manager: 'فارس عبدالرحمن القحطاني', budget: 600000, loc: 'مواقع المشاريع والمقاولات' },
    { code: 'BUFFET', name_ar: 'خدمات البوفيه', name_en: 'Buffet Services', manager: 'عبدالملك سعيد الشريف', budget: 80000, loc: 'مقر الإدارة العامة والفروع' },
    { code: 'WAREHOUSE', name_ar: 'إدارة المستودعات والمخازن', name_en: 'Warehousing & Inventory', manager: 'فيروز علي جان محمد', budget: 300000, loc: 'المستودع الرئيسي - أبها' },
    { code: 'MAINT', name_ar: 'إدارة الصيانة والتشغيل', name_en: 'Maintenance & Operations', manager: 'فهمي سالم عبيد باعمير', budget: 200000, loc: 'الورشة المركزية للصيانة' },
    { code: 'BAKERY', name_ar: 'إدارة المخبز', name_en: 'Bakery Department', manager: 'تامر جمعة احمد عبدالله', budget: 350000, loc: 'مخبز سيتي بارك' },
    { code: 'ENG', name_ar: 'الإدارة الهندسية', name_en: 'Engineering Department', manager: 'فارس عبدالرحمن القحطاني', budget: 400000, loc: 'مقر الإدارة العامة - أبها' },
    { code: 'OPS', name_ar: 'إدارة التشغيل', name_en: 'Operations Department', manager: 'ريان يحي عبدالله', budget: 300000, loc: 'مركز محطة المرح الترفيهي' },
    { code: 'SUPPORT', name_ar: 'إدارة الخدمات المساندة والنظافة', name_en: 'Support & Cleaning Services', manager: 'فهمي سالم عبيد باعمير', budget: 180000, loc: 'كافة الفروع والمرافق' },
    { code: 'IT', name_ar: 'إدارة تقنية المعلومات', name_en: 'Information Technology', manager: 'عبدالملك سعيد الشريف', budget: 250000, loc: 'مقر الإدارة العامة - أبها' },
    { code: 'FIN', name_ar: 'الإدارة المالية', name_en: 'Finance Department', manager: 'هاني عبدالرحمن صالح القحطاني', budget: 350000, loc: 'مقر الإدارة العامة - أبها' },
    { code: 'PROC', name_ar: 'إدارة المشتريات', name_en: 'Procurement Department', manager: 'عبدالملك سعيد الشريف', budget: 220000, loc: 'مقر الإدارة العامة - أبها' },
    { code: 'GEN', name_ar: 'الإدارة العامة', name_en: 'General Administration', manager: 'صالح سعيد القحطاني', budget: 800000, loc: 'مقر الإدارة العامة - برج جوهرة المجد' }
  ];

  for (const dept of departments) {
    run(`
      INSERT INTO departments (code, name_ar, name_en, manager_name, budget, location)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [dept.code, dept.name_ar, dept.name_en, dept.manager, dept.budget, dept.loc]);
  }

  // 4. Branches: Exactly 10 branches matching the Excel file
  run(`DELETE FROM branches`);
  const branches = [
    { code: 'BR-GEN', name_ar: 'الإدارة العامة', name_en: 'General Administration HQ', city: 'أبها', address: 'أبها - شارع الملك عبدالعزيز - برج جوهرة المجد', phone: '0172201122', manager: 'صالح سعيد القحطاني', is_main: 1 },
    { code: 'BR-CITYPARK', name_ar: 'فرع سيتي بارك', name_en: 'City Park Branch', city: 'أبها', address: 'أبها - حي الشرفية - سيتي بارك مول', phone: '0172203344', manager: 'خالد احمد محمد راعي', is_main: 0 },
    { code: 'BR-MUWADAF', name_ar: 'فرع حي الموظفين', name_en: 'Hay Al-Muwadhafeen Branch', city: 'أبها', address: 'أبها - حي الموظفين - الشارع التجاري العام', phone: '0172205566', manager: 'علي سعد حسين البشري', is_main: 0 },
    { code: 'BR-PROJECTS', name_ar: 'إدارة المشاريع والمقاولات', name_en: 'Projects & Contracting Branch', city: 'أبها', address: 'أبها - منطقة عسير - قطاع المشاريع', phone: '0172207788', manager: 'فارس عبدالرحمن القحطاني', is_main: 0 },
    { code: 'BR-DOWNTOWN', name_ar: 'فرع وسط البلد التجاري', name_en: 'Downtown Commercial Branch', city: 'أبها', address: 'أبها - السوق التجاري القديم - وسط البلد', phone: '0172208899', manager: 'احمد عبدالرحمن علي يعن الله', is_main: 0 },
    { code: 'BR-WAREHOUSE', name_ar: 'المستودع الرئيسي', name_en: 'Central Warehouse', city: 'أبها', address: 'أبها - المنطقة الصناعية - المستودع المركزي', phone: '0172209900', manager: 'فيروز علي جان محمد', is_main: 0 },
    { code: 'BR-WORKSHOP', name_ar: 'الورشة للصيانة', name_en: 'Maintenance Workshop', city: 'أبها', address: 'أبها - حي المحالة - الورشة الفنية', phone: '0172209911', manager: 'فهمي سالم عبيد باعمير', is_main: 0 },
    { code: 'BR-BAKERY', name_ar: 'مخبز سيتي بارك', name_en: 'City Park Bakery', city: 'أبها', address: 'أبها - مجمع سيتي بارك التجاري', phone: '0172209922', manager: 'تامر جمعة احمد عبدالله', is_main: 0 },
    { code: 'BR-FUN', name_ar: 'مركز محطة المرح الترفيهي', name_en: 'Fun Station Entertainment', city: 'أبها', address: 'أبها - طريق الملك فهد - مركز محطة المرح', phone: '0172209933', manager: 'ريان يحي عبدالله', is_main: 0 },
    { code: 'BR-HABIL', name_ar: 'فرع الحبيل', name_en: 'Al-Habil Branch', city: 'رجال ألمع', address: 'عسير - مركز الحبيل التجاري', phone: '0172209944', manager: 'هاني عبدالرحمن صالح القحطاني', is_main: 0 }
  ];

  for (const b of branches) {
    run(`
      INSERT INTO branches (code, name_ar, name_en, city, address, phone, manager_name, is_main)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [b.code, b.name_ar, b.name_en, b.city, b.address, b.phone, b.manager, b.is_main]);
  }

  // 5. Biometric Devices: Purge demo devices (Hardware ready for live registration)
  run(`DELETE FROM biometric_devices`);

  // 6. Attendance & Shift Policies
  run(`DELETE FROM attendance_policies`);
  const policies = [
    {
      policy_name: 'سياسة الإدارة',
      shift_type: 'دوام صباحي',
      start_time: '08:00',
      end_time: '16:00',
      grace_period_mins: 15,
      daily_hours: 8.0,
      work_days: 'السبت إلى الخميس',
      flexible_hours: 0,
      overtime_allowed: 0,
      min_hours: 3.0,
      notes: 'أيام العمل: السبت إلى الخميس، وقت الدوام: 08:00 صباحاً إلى 04:00 مساءً. لا يتم احتساب أي ساعات إضافية.'
    },
    {
      policy_name: 'سياسة الدوام المرن',
      shift_type: 'دوام مرن',
      start_time: '00:00',
      end_time: '23:59',
      grace_period_mins: 0,
      daily_hours: 8.0,
      work_days: 'السبت إلى الخميس',
      flexible_hours: 1,
      overtime_allowed: 0,
      min_hours: 3.0,
      notes: 'المطلوب إكمال 8 ساعات عمل يومياً بدون وقت دخول أو خروج محدد. الحد الأدنى لاحتساب يوم العمل 3 ساعات فعلية. لا يتم احتساب أي ساعات إضافية.'
    }
  ];

  for (const p of policies) {
    run(`
      INSERT INTO attendance_policies (
        policy_name, shift_type, start_time, end_time, grace_period_mins,
        daily_hours, work_days, flexible_hours, overtime_allowed, min_hours, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [p.policy_name, p.shift_type, p.start_time, p.end_time, p.grace_period_mins, p.daily_hours, p.work_days, p.flexible_hours, p.overtime_allowed, p.min_hours, p.notes]);
  }

  // 7. Purge existing operational and demo records
  run(`DELETE FROM employees`);
  run(`DELETE FROM requests`);
  run(`DELETE FROM leaves`);
  run(`DELETE FROM leave_balances`);
  run(`DELETE FROM leave_balance_adjustments`);
  run(`DELETE FROM tasks`);
  run(`DELETE FROM penalties_issued`);
  run(`DELETE FROM attendance_logs`);
  run(`DELETE FROM attendance_daily_summary`);
  run(`DELETE FROM payroll_items`);
  run(`DELETE FROM payroll_periods`);
  run(`DELETE FROM attendance_notices`);
  run(`DELETE FROM terminated_employees`);
  run(`DELETE FROM loans`);

  // 8. Seed all official employees from Excel
  seedEmployees();

  // 9. Seed Disciplinary Regulations (50 clauses)
  seedPenaltyRegulations();

  // 10. Ensure Hierarchy and Workflow Integrity
  const chairman = get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-0001'");
  const abdulmalik = get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-1000'");
  if (chairman && abdulmalik) {
    run("UPDATE employees SET manager_id = ?, direct_manager_name = ? WHERE id = ?", [chairman.id, chairman.full_name_ar, abdulmalik.id]);
    run("UPDATE users SET emp_id = ? WHERE username = 'abdulmalik'", [abdulmalik.id]);
  }
  run("UPDATE employees SET direct_manager_name = 'تامر جمعه احمد عبدالله' WHERE direct_manager_name = 'تامر جمعة احمد عبدالله'");

  // 11. Re-establish official request REQ-2026-0001 for Shama Ali Asiri
  const shama = get("SELECT id, full_name_ar FROM employees WHERE emp_code = 'JM-1053' OR full_name_ar LIKE '%شامة%'");
  if (shama && abdulmalik) {
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
    `, [shama.id, abdulmalik.id, abdulmalik.full_name_ar]);

    run(`
      INSERT INTO leaves (
        id, request_no, emp_id, leave_type, start_date, end_date, days_count,
        reason, status, manager_id, manager_name,
        manager_status, hr_verify_status, hr_director_status, hr_status, created_at, updated_at
      ) VALUES (
        16, 'REQ-2026-0001', ?, 'إجازة سنوية', '2026-10-26', '2026-10-26', 1,
        'طلب اجازه ', 'معلق - بانتظار موافقة المدير المباشر', ?, ?,
        'معلق', 'معلق', 'معلق', 'معلق', datetime('now'), datetime('now')
      )
    `, [shama.id, abdulmalik.id, abdulmalik.full_name_ar]);

    run(`INSERT INTO workflow_steps (request_id, step_order, step_name, role_required, status) VALUES (26, 1, 'موافقة المدير المباشر', 'direct_manager', 'معلق')`);
    run(`INSERT INTO workflow_steps (request_id, step_order, step_name, role_required, status) VALUES (26, 2, 'تدقيق قسم الموارد البشرية', 'hr_specialist', 'مؤجل')`);
    run(`INSERT INTO workflow_steps (request_id, step_order, step_name, role_required, status) VALUES (26, 3, 'اعتماد مدير الموارد البشرية', 'hr_director', 'مؤجل')`);

    run(`
      INSERT INTO notifications (user_id, emp_id, title, message, link, is_read, created_at)
      VALUES (2, ?, 'طلب جديد بانتظار موافقتك', 'قدمت شامة علي محمد عسيري طلب إجازة سنوية برقم REQ-2026-0001 بانتظار موافقتك كمدير مباشر.', '#requests', 0, datetime('now'))
    `, [abdulmalik.id]);

    run(`
      INSERT INTO audit_logs (performed_by_id, performed_by_name, performed_by_role, entity_type, entity_id, action, old_status, new_status, comment, created_at)
      VALUES (NULL, 'نظام الخدمة الذاتية', 'system', 'request', 26, 'CREATE', NULL, 'معلق - بانتظار موافقة المدير المباشر', 'إنشاء طلب الإجازة السنوية للموظفة شامة علي عسيري', datetime('now'))
    `);
  }
}

function seedEmployees() {
  const excelPath = path.join(__dirname, '..', '..', 'قاعدة البيانات وسير الموافقات.xlsx');
  let rawRows = [];

  if (fs.existsSync(excelPath)) {
    const wb = xlsx.readFile(excelPath);
    const ws = wb.Sheets['بيانات موظفي جوهرة المجد'] || wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(ws, { header: 1 });
    rawRows = data.slice(5).filter(r => r && r[1]);
  }

  const deptRows = query('SELECT id, name_ar FROM departments');
  const deptMap = {};
  deptRows.forEach(d => {
    deptMap[d.name_ar.trim()] = d.id;
  });

  const branchRows = query('SELECT id, name_ar FROM branches');
  const branchMap = {};
  branchRows.forEach(b => {
    branchMap[b.name_ar.trim()] = b.id;
  });

  const pols = query('SELECT id, policy_name FROM attendance_policies');
  const mgmtPolicyId = pols.find(p => p.policy_name === 'سياسة الإدارة')?.id || 1;
  const flexPolicyId = pols.find(p => p.policy_name === 'سياسة الدوام المرن')?.id || 2;

  const defaultDeptId = deptMap['الإدارة العامة'] || deptRows[0]?.id || 1;
  const defaultBranchId = branchMap['الإدارة العامة'] || branchRows[0]?.id || 1;

  // The 4 Top Executive Leaders of Jawharat Al-Majd
  const executives = [
    {
      emp_code: 'JM-0001',
      full_name_ar: 'عبدالرحمن صالح القحطاني',
      full_name_en: 'Abdulrahman Saleh Al-Qahtani',
      job_title_ar: 'رئيس مجلس الإدارة',
      dept_name: 'الإدارة العامة',
      branch_name: 'الإدارة العامة',
      section: 'الإدارة العامة',
      direct_manager_name: null,
      national_id: '1001122331',
      nationality: 'سعودي',
      gender: 'M',
      is_saudi: 1,
      basic_salary: 0,
      housing_allowance: 0,
      transport_allowance: 0,
      other_allowance: 0,
      leave_balance: 0,
      join_date: '2015-01-01',
      iban: '',
      iqama_expiry: null,
      phone: '',
      email: 'chairman@jalmajd.com'
    },
    {
      emp_code: 'JM-0002',
      full_name_ar: 'سعيد محمد القحطاني',
      full_name_en: 'Saeed Mohammed Al-Qahtani',
      job_title_ar: 'نائب رئيس مجلس الإدارة',
      dept_name: 'الإدارة العامة',
      branch_name: 'الإدارة العامة',
      section: 'الإدارة العامة',
      direct_manager_name: 'عبدالرحمن صالح القحطاني',
      national_id: '1001122332',
      nationality: 'سعودي',
      gender: 'M',
      is_saudi: 1,
      basic_salary: 0,
      housing_allowance: 0,
      transport_allowance: 0,
      other_allowance: 0,
      leave_balance: 0,
      join_date: '2015-01-01',
      iban: '',
      iqama_expiry: null,
      phone: '',
      email: 'vice_chairman@jalmajd.com'
    },
    {
      emp_code: 'JM-0003',
      full_name_ar: 'صالح سعيد القحطاني',
      full_name_en: 'Saleh Saeed Al-Qahtani',
      job_title_ar: 'المدير العام',
      dept_name: 'الإدارة العامة',
      branch_name: 'الإدارة العامة',
      section: 'الإدارة العامة',
      direct_manager_name: 'سعيد محمد القحطاني',
      national_id: '1001122333',
      nationality: 'سعودي',
      gender: 'M',
      is_saudi: 1,
      basic_salary: 0,
      housing_allowance: 0,
      transport_allowance: 0,
      other_allowance: 0,
      leave_balance: 0,
      join_date: '2016-01-01',
      iban: '',
      iqama_expiry: null,
      phone: '',
      email: 'gm@jalmajd.com'
    },
    {
      emp_code: 'JM-0004',
      full_name_ar: 'فارس عبدالرحمن القحطاني',
      full_name_en: 'Faris Abdulrahman Al-Qahtani',
      job_title_ar: 'مدير المشاريع',
      dept_name: 'إدارة المشاريع والمقاولات',
      branch_name: 'إدارة المشاريع والمقاولات',
      section: 'المقاولات',
      direct_manager_name: 'صالح سعيد القحطاني',
      national_id: '1001122334',
      nationality: 'سعودي',
      gender: 'M',
      is_saudi: 1,
      basic_salary: 0,
      housing_allowance: 0,
      transport_allowance: 0,
      other_allowance: 0,
      leave_balance: 0,
      join_date: '2017-01-01',
      iban: '',
      iqama_expiry: null,
      phone: '',
      email: 'projects.dir@jalmajd.com'
    }
  ];

  // Try to match existing official employee codes if available
  const oldOfficialPath = path.join(__dirname, 'officialEmployees.json');
  let oldOfficialMap = new Map();
  if (fs.existsSync(oldOfficialPath)) {
    try {
      const oldList = JSON.parse(fs.readFileSync(oldOfficialPath, 'utf8'));
      oldList.forEach(e => {
        if (e.national_id) oldOfficialMap.set(String(e.national_id).trim(), e.emp_code);
        if (e.full_name_ar) oldOfficialMap.set(norm(e.full_name_ar), e.emp_code);
      });
    } catch (e) {}
  }

  // Parse Excel employee rows
  const parsedEmployees = rawRows.map((r, idx) => {
    const name = String(r[1]).trim();
    const natId = r[2] ? String(r[2]).trim() : null;
    const nationality = String(r[3] || 'سعودي').trim();
    const deptName = String(r[4] || '').trim();
    const branchName = String(r[5] || '').trim();
    const jobTitle = String(r[6] || '').trim();
    const phone = r[7] ? String(r[7]).trim() : '';
    const email = r[8] ? String(r[8]).trim() : '';
    const joinDate = dateConvert(r[9]);
    const leaveBal = Number(r[10]) || 0;
    const gross = Number(r[11]) || 0;
    const genderStr = String(r[12] || '').trim();
    const gender = (genderStr === 'انثى' || genderStr === 'أنثى' || genderStr === 'F') ? 'F' : 'M';
    const section = String(r[13] || '').trim();
    const basic = Number(r[14]) || 0;
    const housing = Number(r[15]) || 0;
    const transport = Number(r[16]) || 0;
    const other = Number(r[17]) || 0;
    const iban = r[18] ? String(r[18]).trim() : '';
    const iqamaExp = dateConvert(r[19]);
    const directMgr = r[20] ? String(r[20]).trim() : null;
    const isSaudi = nationality.includes('سعود') ? 1 : 0;

    let empCode = null;
    if (natId && oldOfficialMap.has(natId)) {
      empCode = oldOfficialMap.get(natId);
    } else if (oldOfficialMap.has(norm(name))) {
      empCode = oldOfficialMap.get(norm(name));
    }
    if (!empCode) {
      if (name.includes('عبدالملك سعيد')) {
        empCode = 'JM-1000';
      } else {
        empCode = 'JM-' + String(1005 + idx).padStart(4, '0');
      }
    }

    return {
      emp_code: empCode,
      full_name_ar: name,
      full_name_en: name,
      job_title_ar: jobTitle,
      dept_name: deptName,
      branch_name: branchName,
      section: section,
      direct_manager_name: directMgr,
      national_id: natId,
      nationality: nationality,
      gender: gender,
      is_saudi: isSaudi,
      basic_salary: basic,
      housing_allowance: housing,
      transport_allowance: transport,
      other_allowance: other,
      leave_balance: leaveBal,
      join_date: joinDate,
      iban: iban,
      iqama_expiry: iqamaExp,
      phone: phone,
      email: email
    };
  });

  const allEmployeesToInsert = [...executives, ...parsedEmployees];

  // 1. Insert employees into database
  for (const emp of allEmployeesToInsert) {
    const deptId = deptMap[emp.dept_name] || defaultDeptId;
    const branchId = branchMap[emp.branch_name] || defaultBranchId;
    const policyId = (emp.section || '').includes('تقنية') ? flexPolicyId : mgmtPolicyId;
    const shiftType = policyId === flexPolicyId ? 'دوام مرن' : 'دوام صباحي';

    run(`
      INSERT INTO employees (
        emp_code, full_name_ar, full_name_en, national_id, nationality,
        is_saudi, gender, email, phone, department_id, branch_id, section,
        job_title_ar, job_title_en, grade_level, basic_salary, housing_allowance,
        transport_allowance, other_allowance, bank_name, bank_code, iban,
        annual_leave_balance, direct_manager_name, shift_type, policy_id, join_date, iqama_expiry, status, role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      emp.emp_code,
      emp.full_name_ar,
      emp.full_name_en || emp.full_name_ar,
      emp.national_id || null,
      emp.nationality,
      emp.is_saudi,
      emp.gender,
      emp.email || null,
      emp.phone || null,
      deptId,
      branchId,
      emp.section,
      emp.job_title_ar,
      emp.job_title_ar,
      'P-1',
      emp.basic_salary,
      emp.housing_allowance,
      emp.transport_allowance,
      emp.other_allowance,
      'مصرف الراجحي',
      'RJHI',
      emp.iban,
      emp.leave_balance,
      emp.direct_manager_name,
      shiftType,
      policyId,
      emp.join_date,
      emp.iqama_expiry,
      'نشط',
      'employee'
    ]);
  }

  // 2. Link Direct Managers (100% precision)
  const inserted = query('SELECT id, emp_code, full_name_ar, direct_manager_name FROM employees');
  for (const emp of inserted) {
    if (!emp.direct_manager_name) continue;
    const targetNorm = norm(emp.direct_manager_name);
    const mgrMatch = inserted.find(m => norm(m.full_name_ar) === targetNorm);
    if (mgrMatch) {
      run('UPDATE employees SET manager_id = ? WHERE id = ?', [mgrMatch.id, emp.id]);
    }
  }

  // Link user 'abdulmalik' to his employee id
  const abdulmalikEmp = inserted.find(e => norm(e.full_name_ar).includes('عبدالملك سعيد'));
  if (abdulmalikEmp) {
    run('UPDATE users SET emp_id = ? WHERE username = ?', [abdulmalikEmp.id, 'abdulmalik']);
  }

  // 3. Initialize Leave Balances and Daily Accruals
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  for (const emp of allEmployeesToInsert) {
    const dbEmp = get('SELECT id, join_date, annual_leave_balance FROM employees WHERE emp_code = ?', [emp.emp_code]);
    if (!dbEmp) continue;

    const hasJoinDate = dbEmp.join_date && !isNaN(new Date(dbEmp.join_date).getTime());
    let serviceYears = 0;
    let annualRate = 21;
    if (hasJoinDate) {
      const joinDate = new Date(dbEmp.join_date);
      serviceYears = Math.max(0, (now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
      annualRate = serviceYears > 5 ? 30 : 21;
    }
    const baseBal = Number(emp.leave_balance) || 0;

    run(`
      INSERT INTO leave_balances (
        emp_id, base_balance, accrual_rate_annual, accrued_days, used_days,
        manual_adjustment, current_balance, last_accrual_date, updated_at
      ) VALUES (?, ?, ?, 0, 0, 0, ?, ?, datetime('now'))
    `, [dbEmp.id, baseBal, annualRate, baseBal, todayStr]);
  }

  // 4. Save clean official employees JSON
  const cleanEmployeesJson = allEmployeesToInsert.map(e => ({
    ...e,
    total_salary: e.basic_salary + e.housing_allowance + e.transport_allowance + e.other_allowance
  }));
  fs.writeFileSync(path.join(__dirname, 'officialEmployeesClean.json'), JSON.stringify(cleanEmployeesJson, null, 2), 'utf8');
  fs.writeFileSync(path.join(__dirname, 'officialEmployees.json'), JSON.stringify(cleanEmployeesJson, null, 2), 'utf8');
}

function seedPenaltyRegulations() {
  run('DELETE FROM penalty_regulations');

  const regulations = [
    // مخالفات مواعيد العمل (1 - 16)
    { code: 'v1', cat: 'مخالفات مواعيد العمل', text: 'التأخر عن مواعيد الحضور للعمل لغاية (15) دقيقة دون إذن أو عذر مقبول إذا لم يترتب عليه تعطيل عمال آخرين', p1: 'إنذار كتابي', p2: 'خصم 5% من أجر اليوم', p3: 'خصم 10% من أجر اليوم', p4: 'خصم 20% من أجر اليوم' },
    { code: 'v2', cat: 'مخالفات مواعيد العمل', text: 'التأخر عن مواعيد الحضور للعمل لغاية (15) دقيقة دون إذن إذا ترتب عليه تعطيل عمال آخرين', p1: 'إنذار كتابي', p2: 'خصم 15% من أجر اليوم', p3: 'خصم 25% من أجر اليوم', p4: 'خصم 50% من أجر اليوم' },
    { code: 'v3', cat: 'مخالفات مواعيد العمل', text: 'التأخر عن مواعيد الحضور للعمل من (15) دقيقة إلى (30) دقيقة دون إذن إذا لم يترتب عليه تعطيل', p1: 'خصم 10% من أجر اليوم', p2: 'خصم 15% من أجر اليوم', p3: 'خصم 25% من أجر اليوم', p4: 'خصم نصف يوم' },
    { code: 'v4', cat: 'مخالفات مواعيد العمل', text: 'التأخر عن مواعيد الحضور للعمل من (15) دقيقة إلى (30) دقيقة إذا ترتب عليه تعطيل عمال آخرين', p1: 'خصم 25% من أجر اليوم', p2: 'خصم 50% من أجر اليوم', p3: 'خصم 75% من أجر اليوم', p4: 'خصم أجر يوم كامل' },
    { code: 'v5', cat: 'مخالفات مواعيد العمل', text: 'التأخر عن مواعيد الحضور للعمل أكثر من (30) دقيقة لغاية (60) دقيقة دون عذر إذا لم يترتب عليه تعطيل', p1: 'خصم 25% من أجر اليوم', p2: 'خصم 50% من أجر اليوم', p3: 'خصم 75% من أجر اليوم', p4: 'خصم أجر يوم كامل' },
    { code: 'v6', cat: 'مخالفات مواعيد العمل', text: 'التأخر عن مواعيد الحضور للعمل أكثر من (30) دقيقة لغاية (60) دقيقة إذا ترتب عليه تعطيل عمال آخرين', p1: 'خصم 30% من أجر اليوم', p2: 'خصم 50% من أجر اليوم', p3: 'خصم أجر يوم كامل', p4: 'خصم أجر يومين' },
    { code: 'v7', cat: 'مخالفات مواعيد العمل', text: 'التأخر عن مواعيد الحضور للعمل لمدة تزيد على ساعة دون إذن أو عذر مقبول', p1: 'إنذار كتابي', p2: 'خصم أجر يوم كامل', p3: 'خصم أجر يومين', p4: 'خصم أجر ثلاثة أيام' },
    { code: 'v8', cat: 'مخالفات مواعيد العمل', text: 'ترك العمل أو الانصراف قبل الميعاد دون إذن أو عذر بما لا يتجاوز (15) دقيقة', p1: 'إنذار كتابي', p2: 'خصم 10% من أجر اليوم', p3: 'خصم 25% من أجر اليوم', p4: 'خصم أجر يوم كامل' },
    { code: 'v9', cat: 'مخالفات مواعيد العمل', text: 'ترك العمل أو الانصراف قبل الميعاد دون إذن بما يتجاوز (15) دقيقة', p1: 'خصم 10% من أجر اليوم', p2: 'خصم 25% من أجر اليوم', p3: 'خصم نصف يوم', p4: 'خصم أجر يوم كامل' },
    { code: 'v10', cat: 'مخالفات مواعيد العمل', text: 'البقاء في أماكن العمل أو العودة إليها بعد انتهاء مواعيد العمل دون إذن مسبق', p1: 'إنذار كتابي', p2: 'خصم 10% من أجر اليوم', p3: 'خصم 25% من أجر اليوم', p4: 'خصم أجر يوم كامل' },
    { code: 'v11', cat: 'مخالفات مواعيد العمل', text: 'الغياب دون إذن كتابي أو عذر مقبول لمدة يوم خلال السنة العقدية الواحدة', p1: 'خصم نصف يوم', p2: 'خصم أجر يوم كامل', p3: 'خصم أجر يومين', p4: 'خصم أجر ثلاثة أيام' },
    { code: 'v12', cat: 'مخالفات مواعيد العمل', text: 'الغياب المتصل دون إذن كتابي أو عذر مقبول من يومين إلى ستة أيام خلال السنة', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر أربعة أيام', p4: 'تأجيل الترقية أو الحرمان من العلاوة' },
    { code: 'v13', cat: 'مخالفات مواعيد العمل', text: 'الغياب المتصل دون إذن كتابي أو عذر مقبول من سبعة أيام إلى عشرة أيام خلال السنة', p1: 'خصم أجر أربعة أيام', p2: 'خصم أجر خمسة أيام', p3: 'تأجيل الترقية أو الحرمان من العلاوة', p4: 'فصل مع المكافأة إذا لم يتجاوز 30 يوماً' },
    { code: 'v14', cat: 'مخالفات مواعيد العمل', text: 'الغياب المتصل دون إذن كتابي أو عذر مقبول من أحد عشر يوماً إلى أربعة عشر يوماً', p1: 'خصم أجر خمسة أيام', p2: 'تأجيل الترقية أو الحرمان من العلاوة + إنذار بالفصل', p3: 'فصل من الخدمة مع المكافأة', p4: 'فصل من الخدمة' },
    { code: 'v15', cat: 'مخالفات مواعيد العمل', text: 'الانقطاع عن العمل دون سبب مشروع مدة تزيد على خمسة عشر يوماً متصلة (م 80)', p1: 'الفصل دون مكافأة أو إشعار', p2: '-', p3: '-', p4: '-' },
    { code: 'v16', cat: 'مخالفات مواعيد العمل', text: 'الغياب المتقطع دون سبب مشروع مدداً تزيد في مجموعها على ثلاثين يوماً (م 80)', p1: 'الفصل دون مكافأة أو إشعار', p2: '-', p3: '-', p4: '-' },

    // مخالفات السلوك والعمل (17 - 34)
    { code: 'v17', cat: 'مخالفات السلوك والعمل', text: 'التواجد دون مبرر في غير مكان العمل المخصص للعامل أثناء وقت الدوام', p1: 'خصم 10% من أجر اليوم', p2: 'خصم 25% من أجر اليوم', p3: 'خصم نصف يوم', p4: 'خصم أجر يوم كامل' },
    { code: 'v18', cat: 'مخالفات السلوك والعمل', text: 'استقبال زائرين في غير أمور عمل المنشأة دون إذن مسبق', p1: 'إنذار كتابي', p2: 'خصم 10% من أجر اليوم', p3: 'خصم 15% من أجر اليوم', p4: 'خصم 25% من أجر اليوم' },
    { code: 'v19', cat: 'مخالفات السلوك والعمل', text: 'استعمال آلات ومعدات المنشأة لأغراض شخصية دون إذن', p1: 'إنذار كتابي', p2: 'خصم 10% من أجر اليوم', p3: 'خصم 25% من أجر اليوم', p4: 'خصم نصف يوم' },
    { code: 'v20', cat: 'مخالفات السلوك والعمل', text: 'تدخل العامل دون وجه حق في أي عمل ليس في اختصاصه ومسؤولياته', p1: 'خصم نصف يوم', p2: 'خصم أجر يوم كامل', p3: 'خصم أجر يومين', p4: 'خصم أجر ثلاثة أيام' },
    { code: 'v21', cat: 'مخالفات السلوك والعمل', text: 'الخروج أو الدخول من غير الأبواب والمداخل المخصصة لذلك', p1: 'إنذار كتابي', p2: 'خصم 10% من أجر اليوم', p3: 'خصم 15% من أجر اليوم', p4: 'خصم 25% من أجر اليوم' },
    { code: 'v22', cat: 'مخالفات السلوك والعمل', text: 'الإهمال في صيانة الأجهزة والآلات أو عدم العناية بنظافتها', p1: 'خصم نصف يوم', p2: 'خصم أجر يوم كامل', p3: 'خصم أجر يومين', p4: 'خصم أجر ثلاثة أيام' },
    { code: 'v23', cat: 'مخالفات السلوك والعمل', text: 'عدم وضع أدوات الإصلاح والصيانة في أماكنها المخصصة', p1: 'إنذار كتابي', p2: 'خصم 25% من أجر اليوم', p3: 'خصم نصف يوم', p4: 'خصم أجر يوم كامل' },
    { code: 'v24', cat: 'مخالفات السلوك والعمل', text: 'تمزيق أو إتلاف إعلانات المنشأة أو التعليمات الإدارية المعلقة', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v25', cat: 'مخالفات السلوك والعمل', text: 'الإهمال أو التفريط في العهد العينية المسلمة إليه بحكم وظيفته', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v26', cat: 'مخالفات السلوك والعمل', text: 'الأكل في مكان العمل في غير الأوقات أو الأماكن المعدة لذلك', p1: 'إنذار كتابي', p2: 'خصم 10% من أجر اليوم', p3: 'خصم 15% من أجر اليوم', p4: 'خصم 25% من أجر اليوم' },
    { code: 'v27', cat: 'مخالفات السلوك والعمل', text: 'النوم أثناء ساعات العمل المعتادة', p1: 'إنذار كتابي', p2: 'خصم 10% من أجر اليوم', p3: 'خصم 25% من أجر اليوم', p4: 'خصم نصف يوم' },
    { code: 'v28', cat: 'مخالفات السلوك والعمل', text: 'النوم أثناء العمل في الحالات والوظائف التي تستدعي يقظة مستمرة (أمن، رقابة)', p1: 'خصم نصف يوم', p2: 'خصم أجر يوم كامل', p3: 'خصم أجر يومين', p4: 'خصم أجر ثلاثة أيام' },
    { code: 'v29', cat: 'مخالفات السلوك والعمل', text: 'التسكع أو وجود العامل في غير موقع عمله وتعطيل زملائه', p1: 'خصم 10% من أجر اليوم', p2: 'خصم 25% من أجر اليوم', p3: 'خصم نصف يوم', p4: 'خصم أجر يوم كامل' },
    { code: 'v30', cat: 'مخالفات السلوك والعمل', text: 'التلاعب في إثبات الحضور والانصراف أو تسجيل بصمة لزميل آخر', p1: 'خصم أجر يوم كامل', p2: 'خصم أجر يومين', p3: 'تأجيل الترقية أو الحرمان من العلاوة', p4: 'فصل من الخدمة مع المكافأة' },
    { code: 'v31', cat: 'مخالفات السلوك والعمل', text: 'عدم إطاعة الأوامر والتعليمات الإدارية العادية الخاصة بالعمل', p1: 'خصم 25% من أجر اليوم', p2: 'خصم نصف يوم', p3: 'خصم أجر يوم كامل', p4: 'خصم أجر يومين' },
    { code: 'v32', cat: 'مخالفات السلوك والعمل', text: 'التحريض على مخالفة الأوامر والتعليمات أو تعطيل سير العمل', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v33', cat: 'مخالفات السلوك والعمل', text: 'التدخين في الأماكن المحظورة داخل مقرات ومرافق المنشأة', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v34', cat: 'مخالفات السلوك والعمل', text: 'الإهمال أو التهاون في أداء العمل الذي قد ينشأ عنه ضرر بالممتلكات', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },

    // مخالفات السلوك العام والسلامة (35 - 50)
    { code: 'v35', cat: 'مخالفات السلوك العام', text: 'التشاجر مع الزملاء أو مع الغير أو إحداث مشاغبات داخل المنشأة', p1: 'خصم أجر يوم كامل', p2: 'خصم أجر يومين', p3: 'خصم أجر ثلاثة أيام', p4: 'خصم أجر خمسة أيام' },
    { code: 'v36', cat: 'مخالفات السلوك العام', text: 'التمارض أو ادعاء الإصابة والمرض كذباً للتهرب من العمل', p1: 'خصم أجر يوم كامل', p2: 'خصم أجر يومين', p3: 'خصم أجر ثلاثة أيام', p4: 'خصم أجر خمسة أيام' },
    { code: 'v37', cat: 'مخالفات السلوك العام', text: 'الامتناع عن الكشف الطبي المقرر أو مخالفة التعليمات الطبية', p1: 'خصم أجر يوم كامل', p2: 'خصم أجر يومين', p3: 'خصم أجر ثلاثة أيام', p4: 'خصم أجر خمسة أيام' },
    { code: 'v38', cat: 'مخالفات السلوك العام', text: 'مخالفة التعليمات الصحية والإجراءات الوقائية المقررة بالمنشأة', p1: 'خصم نصف يوم', p2: 'خصم أجر يوم كامل', p3: 'خصم أجر يومين', p4: 'خصم أجر خمسة أيام' },
    { code: 'v39', cat: 'مخالفات السلوك العام', text: 'الكتابة على جدران المنشأة أو لصق إعلانات دون موافقة الإدارة', p1: 'إنذار كتابي', p2: 'خصم 10% من أجر اليوم', p3: 'خصم 25% من أجر اليوم', p4: 'خصم نصف يوم' },
    { code: 'v40', cat: 'مخالفات السلوك العام', text: 'رفض التفتيش الإداري عند الدخول أو الانصراف حال طلب ذلك', p1: 'خصم 25% من أجر اليوم', p2: 'خصم نصف يوم', p3: 'خصم أجر يوم كامل', p4: 'خصم أجر يومين' },
    { code: 'v41', cat: 'مخالفات السلوك العام', text: 'عدم تسليم المبالغ النقدية المحصلة لحساب المنشأة في مواعيدها', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v42', cat: 'مخالفات السلوك العام', text: 'الامتناع عن ارتداء ملابس وأدوات الوقاية والسلامة أثناء العمل', p1: 'إنذار كتابي', p2: 'خصم أجر يوم كامل', p3: 'خصم أجر يومين', p4: 'خصم أجر خمسة أيام' },
    { code: 'v43', cat: 'مخالفات السلوك العام', text: 'تعمد الخلوة أو ارتكاب سلوكيات مخالفة للآداب والذوق العام', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v44', cat: 'مخالفات السلوك العام', text: 'التلفظ أو الإيحاء بأقوال أو حركات تخدش الحياء العام', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v45', cat: 'مخالفات السلوك العام', text: 'الاعتداء على زملاء العمل بالقول أو الإشارة أو التهديد', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v46', cat: 'مخالفات السلوك العام', text: 'الاعتداء الجسدي بالضرب على أحد الزملاء أو المرؤوسين (م 80)', p1: 'فصل فوري دون مكافأة أو إشعار', p2: '-', p3: '-', p4: '-' },
    { code: 'v47', cat: 'مخالفات السلوك العام', text: 'الاعتداء على صاحب العمل أو المدير المسؤول أو أحد الرؤساء أثناء العمل (م 80)', p1: 'فصل فوري دون مكافأة أو إشعار', p2: '-', p3: '-', p4: '-' },
    { code: 'v48', cat: 'مخالفات السلوك العام', text: 'تقديم بلاغ أو شكوى كيدية ضد أحد منسوبي المنشأة', p1: 'خصم أجر ثلاثة أيام', p2: 'خصم أجر خمسة أيام', p3: 'فصل مع المكافأة', p4: '-' },
    { code: 'v49', cat: 'مخالفات السلوك العام', text: 'الامتناع عن الإدلاء بالشهادة أو الحضور أمام لجنة التحقيق الإداري', p1: 'خصم أجر يومين', p2: 'خصم أجر ثلاثة أيام', p3: 'خصم أجر خمسة أيام', p4: 'فصل مع المكافأة' },
    { code: 'v50', cat: 'مخالفات السلوك العام', text: 'عدم التقيد بالزي الرسمي المعتمد أو المظهر المهني اللائق بالمنشأة', p1: 'خصم أجر يوم كامل', p2: 'خصم أجر يومين', p3: 'خصم أجر ثلاثة أيام', p4: 'خصم أجر خمسة أيام' }
  ];

  for (const reg of regulations) {
    run(`
      INSERT INTO penalty_regulations (code, category, violation_text, penalty_1st, penalty_2nd, penalty_3rd, penalty_4th)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [reg.code, reg.cat, reg.text, reg.p1, reg.p2, reg.p3, reg.p4]);
  }
}

module.exports = {
  seedDatabase,
  seedEmployees,
  seedPenaltyRegulations
};
