// server/database/seedData.js - Official Seed Database for Jawharat Al-Majd Co.
const { db, get, query, run } = require('./db');
const fs = require('fs');
const path = require('path');

function seedDatabase() {
  // Update or insert company settings with exact name: "شركة جوهرة المجد"
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
      '',
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

  // 1. Users System: Admin and HR Manager users
  run(`DELETE FROM users`);
  run(`
    INSERT INTO users (id, username, password, full_name, email, role, permissions, emp_id, is_active)
    VALUES 
    (1, 'admin', 'Jj123', 'مدير النظام (Admin)', 'admin@jalmajd.com', 'admin', '["all"]', NULL, 1),
    (2, 'abdulmalik', 'Hr123', 'عبدالملك سعيد القحطاني', 'abdulmalik.saeed@jalmajd.com', 'hr', '["all"]', NULL, 1)
  `);

  // 2. Departments: Seed all departments from the official organizational statement
  run(`DELETE FROM departments`);
  const departments = [
    { code: 'EXEC', name_ar: 'الادارة التنفيذيه', name_en: 'Executive Management', manager: 'صالح سعيد القحطاني', budget: 500000, loc: 'مقر أبها - الطابق الإداري' },
    { code: 'ENG', name_ar: 'الادارة الهندسية', name_en: 'Engineering Department', manager: 'فارس عبدالرحمن القحطاني', budget: 350000, loc: 'مقر أبها - قسم المشاريع' },
    { code: 'HR', name_ar: 'ادارة الموارد البشرية', name_en: 'Human Resources', manager: 'عبدالملك سعيد القحطاني', budget: 250000, loc: 'مقر أبها - مبنى الإدارة' },
    { code: 'FIN', name_ar: 'الادارة المالية', name_en: 'Finance Department', manager: 'هاني عبدالرحمن القحطاني', budget: 300000, loc: 'مقر أبها - الإدارة المالية' },
    { code: 'PROC', name_ar: 'ادارة المشتريات', name_en: 'Procurement & Purchasing', manager: 'هاني عبدالله عبدالكريم', budget: 350000, loc: 'مقر أبها - قسم المشتريات' },
    { code: 'SALES', name_ar: 'ادارة المبيعات', name_en: 'Sales Department', manager: 'مشرف المبيعات', budget: 400000, loc: 'مقر أبها - الإدارة التجارية' },
    { code: 'IT', name_ar: 'ادارة تقنية المعلومات', name_en: 'Information Technology', manager: 'محمد شكيل', budget: 300000, loc: 'مقر أبها - مركز العمليات الرقمية' },
    { code: 'MKT', name_ar: 'ادارة التسويق', name_en: 'Marketing Department', manager: 'مشرف التسويق', budget: 200000, loc: 'مقر أبها - الجناح الإعلامي' },
    { code: 'TAQEEB', name_ar: 'التعقيب', name_en: 'Government Relations', manager: 'عبدالعزيز سعيد مفرح', budget: 150000, loc: 'مقر أبها - العلاقات الحكومية' }
  ];

  for (const dept of departments) {
    run(`
      INSERT INTO departments (code, name_ar, name_en, manager_name, budget, location)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [dept.code, dept.name_ar, dept.name_en, dept.manager, dept.budget, dept.loc]);
  }

  // 3. Branches: Seed exact 4 branches requested
  run(`DELETE FROM branches`);
  const branches = [
    { code: 'BR-ABHA-01', name_ar: 'فرع ابها الرئيسي', name_en: 'Abha Main Branch', city: 'أبها', address: 'أبها - شارع الملك عبدالعزيز - برج جوهرة المجد', phone: '0172201122', manager: 'مدير فرع أبها الرئيسي', is_main: 1 },
    { code: 'BR-MANSAK-02', name_ar: 'فرع المنسك', name_en: 'Al-Mansak Branch', city: 'أبها', address: 'أبها - حي المنسك - طريق الأربعين', phone: '0172203344', manager: 'مشرف فرع المنسك', is_main: 0 },
    { code: 'BR-MUWADAF-03', name_ar: 'فرع حي الموظفين', name_en: 'Hay Al-Muwadhafeen Branch', city: 'أبها', address: 'أبها - حي الموظفين - الشارع التجاري العام', phone: '0172205566', manager: 'مشرف فرع حي الموظفين', is_main: 0 },
    { code: 'BR-MUHAYIL-04', name_ar: 'فرع محايل عسير', name_en: 'Muhayil Asir Branch', city: 'محايل عسير', address: 'محايل عسير - طريق الشعبين الرئيسي - مجمع جوهرة المجد', phone: '0172851122', manager: 'مشرف فرع محايل عسير', is_main: 0 }
  ];

  for (const b of branches) {
    run(`
      INSERT INTO branches (code, name_ar, name_en, city, address, phone, manager_name, is_main)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [b.code, b.name_ar, b.name_en, b.city, b.address, b.phone, b.manager, b.is_main]);
  }

  // 4. Biometric Devices: Purge demo devices (Hardware ready for real registration)
  run(`DELETE FROM biometric_devices`);

  // 5. Attendance & Shift Policies (سياسات الدوام - تطبيق السياستين المعتمدتين فقط)
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

  // 6. Purge existing operational and demo records
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

  // 7. Seed all 109 official employees of Jawharat Al-Majd directly from Excel files
  seedEmployees();

  // 8. Seed Disciplinary Regulations (50 clauses from Desktop لائحة الجزاءات)
  seedPenaltyRegulations();
}

function seedEmployees() {
  const empsFile = path.join(__dirname, 'officialEmployees.json');
  if (!fs.existsSync(empsFile)) return;

  const employees = JSON.parse(fs.readFileSync(empsFile, 'utf8'));

  const depts = query('SELECT id, code, name_ar FROM departments');
  const deptMap = {};
  depts.forEach(d => {
    deptMap[d.code] = d.id;
  });

  const brs = query('SELECT id, code, name_ar FROM branches');
  const brMap = {};
  brs.forEach(b => {
    brMap[b.code] = b.id;
  });

  const pols = query('SELECT id, policy_name, shift_type FROM attendance_policies');
  const mgmtPolicyId = pols.find(p => p.policy_name === 'سياسة الإدارة')?.id || (pols[0]?.id || 1);
  const flexPolicyId = pols.find(p => p.policy_name === 'سياسة الدوام المرن')?.id || (pols[1]?.id || 2);

  // Helper to resolve department ID
  function resolveDeptId(emp) {
    const sec = emp.section_name || '';
    const dept = emp.department_name || '';
    const job = emp.job_title_ar || '';

    if (dept.includes('هندس') || sec.includes('هندس') || job.includes('مهندس') || job.includes('مشاريع')) {
      return deptMap['ENG'] || deptMap['EXEC'];
    }
    if (dept.includes('مالي') || sec.includes('مالي') || job.includes('محاسب') || job.includes('المالي') || sec.includes('خزنة')) {
      return deptMap['FIN'] || deptMap['EXEC'];
    }
    if (dept.includes('موارد') || sec.includes('موارد') || job.includes('موارد') || sec.includes('HR')) {
      return deptMap['HR'] || deptMap['EXEC'];
    }
    if (dept.includes('تعقيب') || sec.includes('تعقيب') || job.includes('معقب')) {
      return deptMap['TAQEEB'] || deptMap['EXEC'];
    }
    if (sec.includes('تقنية') || sec.includes('شبكات') || sec.includes('حاسب') || job.includes('شبكات') || job.includes('تقنية') || sec.includes('IT')) {
      return deptMap['IT'] || deptMap['EXEC'];
    }
    if (sec.includes('مشتريات') || sec.includes('مستودع') || job.includes('مشتريات') || job.includes('فرز')) {
      return deptMap['PROC'] || deptMap['EXEC'];
    }
    if (sec.includes('تسويق') || job.includes('تسويق')) {
      return deptMap['MKT'] || deptMap['EXEC'];
    }
    if (
      sec.includes('صالة') || sec.includes('صاله') || sec.includes('سوق') ||
      sec.includes('مخبز') || sec.includes('خضار') || sec.includes('محطة') ||
      sec.includes('بوفيه') || sec.includes('بسطة') || sec.includes('اجبان')
    ) {
      return deptMap['SALES'] || deptMap['EXEC'];
    }
    return deptMap['EXEC'];
  }

  // Helper to resolve branch ID
  function resolveBranchId(emp) {
    const dept = (emp.department_name || '') + ' ' + (emp.section_name || '');
    if (dept.includes('المنسك')) return brMap['BR-MANSAK-02'];
    if (dept.includes('حي الموظفين') || dept.includes('الموظفين')) return brMap['BR-MUWADAF-03'];
    if (dept.includes('محايل')) return brMap['BR-MUHAYIL-04'];
    return brMap['BR-ABHA-01'];
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // 1. Insert employees
  for (const emp of employees) {
    const deptId = resolveDeptId(emp);
    const branchId = resolveBranchId(emp);
    const policyId = (emp.section_name || '').includes('تقنية') ? flexPolicyId : mgmtPolicyId;
    const shiftType = policyId === flexPolicyId ? 'دوام مرن' : 'دوام صباحي';

    run(`
      INSERT INTO employees (
        emp_code, full_name_ar, full_name_en, national_id, nationality,
        is_saudi, gender, email, phone, department_id, branch_id,
        job_title_ar, job_title_en, grade_level, basic_salary, housing_allowance,
        transport_allowance, other_allowance, bank_name, bank_code, iban,
        annual_leave_balance, shift_type, policy_id, join_date, status, role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      emp.emp_code,
      emp.full_name_ar,
      emp.full_name_en || emp.full_name_ar,
      emp.national_id,
      emp.nationality,
      emp.is_saudi,
      emp.gender || 'M',
      emp.email,
      emp.phone,
      deptId,
      branchId,
      emp.job_title_ar,
      emp.job_title_en || emp.job_title_ar,
      'P-1',
      emp.basic_salary || 0,
      emp.housing_allowance || 0,
      emp.transport_allowance || 0,
      emp.other_allowance || 0,
      'مصرف الراجحي',
      'RJHI',
      emp.iban || '',
      emp.leave_balance || 0,
      shiftType,
      policyId,
      emp.join_date || '2023-01-01',
      'نشط',
      'employee'
    ]);
  }

  // 2. Map Direct Managers according to the official organizational statement
  const insertedEmployees = query('SELECT id, emp_code, department_id, branch_id, job_title_ar, full_name_ar FROM employees');
  const chairman = insertedEmployees.find(e => e.emp_code === 'JM-0001');
  const viceChairman = insertedEmployees.find(e => e.emp_code === 'JM-0002');
  const generalManager = insertedEmployees.find(e => e.emp_code === 'JM-0003');
  const projectsManager = insertedEmployees.find(e => e.emp_code === 'JM-0004');
  const hrManager = insertedEmployees.find(e => e.emp_code === 'JM-1000'); // عبدالملك سعيد القحطاني
  const financeManager = insertedEmployees.find(e => e.emp_code === 'JM-1041'); // هاني عبدالرحمن صالح القحطاني

  const hrManagerId = hrManager ? hrManager.id : null;
  const gmId = generalManager ? generalManager.id : null;
  const vcId = viceChairman ? viceChairman.id : null;
  const chId = chairman ? chairman.id : null;
  const projId = projectsManager ? projectsManager.id : gmId;
  const finId = financeManager ? financeManager.id : gmId;

  // Link user 'abdulmalik' to his employee id in users table
  if (hrManagerId) {
    run('UPDATE users SET emp_id = ? WHERE username = ?', [hrManagerId, 'abdulmalik']);
  }

  for (const emp of insertedEmployees) {
    if (emp.emp_code === 'JM-0001') {
      // Chairman has no direct manager
      run('UPDATE employees SET manager_id = NULL WHERE id = ?', [emp.id]);
    } else if (emp.emp_code === 'JM-0002') {
      // Vice Chairman reports to Chairman
      run('UPDATE employees SET manager_id = ? WHERE id = ?', [chId, emp.id]);
    } else if (emp.emp_code === 'JM-0003') {
      // General Manager reports to Vice Chairman
      run('UPDATE employees SET manager_id = ? WHERE id = ?', [vcId, emp.id]);
    } else if (emp.emp_code === 'JM-0004' || emp.emp_code === 'JM-1041' || emp.emp_code === 'JM-1000') {
      // Executive Directors report to General Manager
      run('UPDATE employees SET manager_id = ? WHERE id = ?', [gmId, emp.id]);
    } else if (emp.emp_code === 'JM-1071') {
      // Civil Engineer reports to Projects Manager
      run('UPDATE employees SET manager_id = ? WHERE id = ?', [projId, emp.id]);
    } else if (emp.emp_code === 'JM-1003' || emp.emp_code === 'JM-1002') {
      // Accountants report to Finance Manager
      run('UPDATE employees SET manager_id = ? WHERE id = ?', [finId, emp.id]);
    } else {
      // All other staff across the company report directly to HR Manager Abdulmalik Saeed Al-Qahtani
      run('UPDATE employees SET manager_id = ? WHERE id = ?', [hrManagerId, emp.id]);
    }
  }

  // 3. Initialize Leave Balances and calculate daily entitlement based on service years
  for (const emp of employees) {
    const dbEmp = get('SELECT id, join_date, annual_leave_balance FROM employees WHERE emp_code = ?', [emp.emp_code]);
    if (!dbEmp) continue;

    const joinDate = new Date(dbEmp.join_date);
    const serviceYears = Math.max(0, (now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    const annualRate = serviceYears > 5 ? 30 : 21;
    const baseBal = Number(emp.leave_balance) || 0;

    run(`
      INSERT INTO leave_balances (
        emp_id, base_balance, accrual_rate_annual, accrued_days, used_days,
        manual_adjustment, current_balance, last_accrual_date, updated_at
      ) VALUES (?, ?, ?, 0, 0, 0, ?, ?, datetime('now'))
    `, [dbEmp.id, baseBal, annualRate, baseBal, todayStr]);
  }
}

function seedPenaltyRegulations() {
  const count = get('SELECT COUNT(*) AS count FROM penalty_regulations').count;
  if (count >= 50) return;

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

    // مخالفات السلوك العام (35 - 50)
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
