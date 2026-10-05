// server/database/seedData.js
const { db, get, query, run } = require('./db');

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

  // 1. Users System: Keep ONLY admin user
  run(`DELETE FROM users`);
  run(`
    INSERT INTO users (id, username, password, full_name, email, role, permissions, emp_id, is_active)
    VALUES (1, 'admin', 'Jj123', 'مدير النظام (Admin)', 'admin@jalmajd.com', 'admin', '["all"]', NULL, 1)
  `);

  // 2. Departments: Seed exact 6 departments requested
  run(`DELETE FROM departments`);
  const departments = [
    { code: 'EXEC', name_ar: 'الادارة التنفيذيه', name_en: 'Executive Management', manager: 'الرئيس التنفيذي', budget: 500000, loc: 'مقر أبها - الطابق الإداري' },
    { code: 'HR', name_ar: 'ادارة الموارد البشرية', name_en: 'Human Resources', manager: 'مدير الموارد البشرية', budget: 250000, loc: 'مقر أبها - مبنى الإدارة' },
    { code: 'PROC', name_ar: 'ادارة المشتريات', name_en: 'Procurement & Purchasing', manager: 'مدير المشتريات', budget: 350000, loc: 'مقر أبها - قسم المشتريات' },
    { code: 'SALES', name_ar: 'ادارة المبيعات', name_en: 'Sales Department', manager: 'مدير المبيعات', budget: 400000, loc: 'مقر أبها - الإدارة التجارية' },
    { code: 'IT', name_ar: 'ادارة تقنية المعلومات', name_en: 'Information Technology', manager: 'مدير تقنية المعلومات', budget: 300000, loc: 'مقر أبها - مركز العمليات الرقمية' },
    { code: 'MKT', name_ar: 'ادارة التسويق', name_en: 'Marketing Department', manager: 'مدير التسويق', budget: 200000, loc: 'مقر أبها - الجناح الإعلامي' }
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

  // 5. Purge requests, penalties, logs, and seed official employees from Excel
  run(`DELETE FROM employees`);
  run(`DELETE FROM requests`);
  run(`DELETE FROM penalties_issued`);
  run(`DELETE FROM attendance_logs`);
  run(`DELETE FROM attendance_daily_summary`);
  run(`DELETE FROM payroll_items`);
  run(`DELETE FROM payroll_periods`);

  // Seed all 109 official employees of Jawharat Al-Majd
  seedEmployees();

  // 6. Attendance & Shift Policies (سياسات الدوام)
  const policyCount = get('SELECT COUNT(*) AS count FROM attendance_policies').count;
  if (policyCount === 0) {
    const defaultPolicies = [
      {
        policy_name: 'سياسة دوام المقر الرئيسي المعتمد (سيتي بارك)',
        shift_type: 'دوام صباحي',
        start_time: '08:00',
        end_time: '16:00',
        grace_period_mins: 15,
        daily_hours: 8.0,
        work_days: 'الأحد إلى الخميس',
        flexible_hours: 0,
        overtime_allowed: 1,
        notes: 'الدوام الرسمي المعتمد للإدارة العامة بمقر مول سيتي بارك في أبها. تحسب ساعات التأخير بعد 08:15 صباحاً وفق لائحة الجزاءات.'
      },
      {
        policy_name: 'سياسة دوام الفرق الفنية والتقنية (دوام مرن)',
        shift_type: 'دوام مرن',
        start_time: '07:30',
        end_time: '15:30',
        grace_period_mins: 30,
        daily_hours: 8.0,
        work_days: 'الأحد إلى الخميس',
        flexible_hours: 1,
        overtime_allowed: 1,
        notes: 'حضور مرن بين 07:30 و 09:30 صباحاً مع إكمال 8 ساعات عمل يومية، مخصص لمهندسي البرمجيات والأنظمة.'
      },
      {
        policy_name: 'سياسة دوام العمليات والمشاريع الميدانية',
        shift_type: 'دوام ميداني',
        start_time: '09:00',
        end_time: '17:00',
        grace_period_mins: 15,
        daily_hours: 8.0,
        work_days: 'الأحد إلى الخميس',
        flexible_hours: 0,
        overtime_allowed: 1,
        notes: 'خاص بفرق العمليات والتشغيل وإشراف المواقع والمشاريع الخارجية.'
      }
    ];

    for (const p of defaultPolicies) {
      run(`
        INSERT INTO attendance_policies (policy_name, shift_type, start_time, end_time, grace_period_mins, daily_hours, work_days, flexible_hours, overtime_allowed, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [p.policy_name, p.shift_type, p.start_time, p.end_time, p.grace_period_mins, p.daily_hours, p.work_days, p.flexible_hours, p.overtime_allowed, p.notes]);
    }
  }

  // 7. Seed Disciplinary Regulations (50 clauses from Desktop اكواد المخالفات.xlsx)
  seedPenaltyRegulations();
}

function seedEmployees() {
  const fs = require('fs');
  const path = require('path');
  const empsFile = path.join(__dirname, 'officialEmployees.json');
  if (!fs.existsSync(empsFile)) return;

  const employees = JSON.parse(fs.readFileSync(empsFile, 'utf8'));

  const depts = query('SELECT id, code FROM departments');
  const deptMap = {};
  depts.forEach(d => deptMap[d.code] = d.id);

  const brs = query('SELECT id, code FROM branches ORDER BY id ASC');

  for (const emp of employees) {
    const deptId = deptMap[emp.dept_code] || (depts.length ? depts[0].id : null);
    const branchId = brs.length ? brs[(emp.branch_idx - 1) % brs.length].id : null;

    run(`
      INSERT INTO employees (
        emp_code, full_name_ar, full_name_en, national_id, nationality,
        is_saudi, gender, birth_date, email, phone, department_id, branch_id,
        job_title_ar, job_title_en, grade_level, basic_salary, housing_allowance,
        transport_allowance, other_allowance, bank_name, bank_code, iban,
        annual_leave_balance, shift_type, join_date, contract_start, contract_end, iqama_expiry, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      emp.emp_code, emp.full_name_ar, emp.full_name_en, emp.national_id, emp.nationality,
      emp.is_saudi, emp.gender, emp.birth_date, emp.email, emp.phone, deptId, branchId,
      emp.job_title_ar, emp.job_title_en, 'P-1', emp.basic_salary, emp.housing_allowance,
      emp.transport_allowance, emp.other_allowance, emp.bank_name, emp.bank_code, emp.iban,
      30, 'دوام صباحي', emp.join_date, emp.contract_start, emp.contract_end, emp.iqama_expiry, 'نشط'
    ]);
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

function seedIssuedPenalties() {
  const sampleDecisions = [
    {
      decision_no: 'DEC-2026-0012',
      emp_id: 4, // Mohammed Al-Otaibi
      violation_code: 'v1',
      violation_text: 'التأخر عن مواعيد الحضور للعمل لغاية (15) دقيقة دون إذن أو عذر مقبول إذا لم يترتب عليه تعطيل عمال آخرين',
      category: 'مخالفات مواعيد العمل',
      repetition_level: 'المرة الأولى',
      penalty_text: 'إنذار كتابي رسمي',
      deduction_type: 'إنذار كتابي',
      deduction_days: 0,
      incident_date: '2026-09-25',
      investigation_details: 'تأخر الموظف عن بدء الدوام الصباحي بمقدار 12 دقيقة دون إشعار مسبق. تمت مساءلته وتوجيه إنذار كتابي أول.',
      status: 'معتمد ومطبق',
      issued_by: 'خالد سعد الشهراني (مدير الموارد البشرية)'
    },
    {
      decision_no: 'DEC-2026-0013',
      emp_id: 14, // Kamal Eldin Morsi
      violation_code: 'v11',
      violation_text: 'الغياب دون إذن كتابي أو عذر مقبول لمدة يوم خلال السنة العقدية الواحدة',
      category: 'مخالفات مواعيد العمل',
      repetition_level: 'المرة الأولى',
      penalty_text: 'خصم أجر نصف يوم من الراتب',
      deduction_type: 'خصم راتب',
      deduction_days: 0.5,
      incident_date: '2026-09-22',
      investigation_details: 'تغيب الموظف عن العمل يوم 22 سبتمبر دون تقديم عذر طبي أو إجازة معتمدة. تقرر حسم نصف يوم وفق اللائحة.',
      status: 'معتمد ومطبق',
      issued_by: 'خالد سعد الشهراني (مدير الموارد البشرية)'
    },
    {
      decision_no: 'DEC-2026-0014',
      emp_id: 11, // Omar Bashir
      violation_code: 'v23',
      violation_text: 'عدم وضع أدوات الإصلاح والصيانة في أماكنها المخصصة',
      category: 'مخالفات السلوك والعمل',
      repetition_level: 'المرة الأولى',
      penalty_text: 'إنذار كتابي رسمي',
      deduction_type: 'إنذار كتابي',
      deduction_days: 0,
      incident_date: '2026-09-18',
      investigation_details: 'ترك معدات الفحص اللوجستي خارج مستودع المستلزمات مما عرضها للتلف الجزئي.',
      status: 'معتمد ومطبق',
      issued_by: 'عبدالرحمن علي عسيري (مدير العمليات)'
    }
  ];

  for (const dec of sampleDecisions) {
    run(`
      INSERT INTO penalties_issued (
        decision_no, emp_id, violation_code, violation_text, category,
        repetition_level, penalty_text, deduction_type, deduction_days,
        incident_date, investigation_details, status, issued_by, issued_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-5 days'))
    `, [
      dec.decision_no, dec.emp_id, dec.violation_code, dec.violation_text, dec.category,
      dec.repetition_level, dec.penalty_text, dec.deduction_type, dec.deduction_days,
      dec.incident_date, dec.investigation_details, dec.status, dec.issued_by
    ]);
  }
}

module.exports = {
  seedDatabase
};
