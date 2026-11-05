// server/database/seedData.js - Official Production Seed for Jawharat Al-Majd Co.
const { db, get, query, run } = require('./db');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

function excelDateToJSDate(serial) {
  if (!serial || serial === 'لايوجد' || serial === 'غير محدد') return null;
  if (typeof serial === 'string') {
    const s = serial.trim();
    if (s.match(/^\d{4}-\d{2}-\d{2}$/)) return s;
    if (s.includes('/')) {
      const parts = s.split('/');
      if (parts.length === 3) {
        if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    return s;
  }
  if (typeof serial === 'number') {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    return date_info.toISOString().split('T')[0];
  }
  return null;
}

function seedDatabase() {
  console.log('--- Executing Official Seed for Jawharat Al-Majd HRMS ---');

  // Purge any temporary test artifacts
  run("DELETE FROM employees WHERE emp_code LIKE 'JM-TEST%' OR emp_code = 'JM-2001'");

  // 1. Company Settings
  run(`
    INSERT INTO company_settings (
      id, company_name_ar, company_name_en, cr_number, mhrsd_est_number,
      tax_number, phone, email, website, address_ar, bank_name,
      bank_code, corporate_account, wps_payer_id, office_lat, office_lng,
      geofence_radius_meters, updated_at
    ) VALUES (
      1,
      'شركة جوهرة المجد للمقاولات والتجارة',
      'Jawharat Al-Majd Contracting & Trading Co.',
      '5850024190',
      '7013999755',
      '310123456700003',
      '920012405',
      'info@jalmajd.com',
      'https://jalmajd.com',
      'المملكة العربية السعودية، منطقة عسير، أبها، حي الشرفية - مول سيتي بارك',
      'مصرف الراجحي',
      'RJHI',
      'SA4480000392608010049283',
      'EST5850024190',
      18.2164,
      42.5053,
      300,
      datetime('now')
    )
    ON CONFLICT(id) DO UPDATE SET
      company_name_ar = 'شركة جوهرة المجد للمقاولات والتجارة',
      company_name_en = 'Jawharat Al-Majd Contracting & Trading Co.',
      cr_number = '5850024190',
      tax_number = '310123456700003',
      wps_payer_id = 'EST5850024190',
      updated_at = datetime('now')
  `);

  // 2. Setup Official 9 Departments & 5 Branches
  run("DELETE FROM departments WHERE code NOT IN ('DEPT-HQ', 'DEPT-BR-CITYPARK', 'DEPT-BR-MUWADAF', 'DEPT-BR-DOWNTOWN', 'DEPT-BR-HABIL', 'DEPT-WH', 'DEPT-CONTRACTS', 'DEPT-MAINT', 'DEPT-ENG')");
  run("DELETE FROM branches WHERE code NOT IN ('BR-HQ', 'BR-MUWADAF', 'BR-CITYPARK', 'BR-HABIL', 'BR-DOWNTOWN')");

  const officialDepartments = [
    { code: 'DEPT-HQ', name_ar: 'الإدارة الرئيسية', name_en: 'Headquarters', manager_name: 'عبدالملك سعيد الشريف' },
    { code: 'DEPT-BR-CITYPARK', name_ar: 'إدارة الفروع — سيتي بارك', name_en: 'Branches Management — City Park', manager_name: 'هاني عبدالرحمن صالح القحطاني' },
    { code: 'DEPT-BR-MUWADAF', name_ar: 'إدارة الفروع — حي الموظفين', name_en: 'Branches Management — Hay Al-Muwadafeen', manager_name: 'علي سعد حسين البشري' },
    { code: 'DEPT-BR-DOWNTOWN', name_ar: 'إدارة الفروع — مجمع وسط البلد', name_en: 'Branches Management — Downtown Complex', manager_name: 'احمد عبدالرحمن علي يعن الله' },
    { code: 'DEPT-BR-HABIL', name_ar: 'إدارة الفروع — الحبيل', name_en: 'Branches Management — Al-Habil', manager_name: 'تامر جمعه احمد عبدالله' },
    { code: 'DEPT-WH', name_ar: 'إدارة المستودع الرئيسي', name_en: 'Main Warehouse Management', manager_name: 'فيروز علي جان محمد' },
    { code: 'DEPT-CONTRACTS', name_ar: 'إدارة المقاولات', name_en: 'Contracting Department', manager_name: 'فارس عبدالرحمن القحطاني' },
    { code: 'DEPT-MAINT', name_ar: 'إدارة الصيانة والورشة', name_en: 'Maintenance & Workshop Department', manager_name: 'عبدالملك سعيد الشريف' },
    { code: 'DEPT-ENG', name_ar: 'الإدارة الهندسية', name_en: 'Engineering Department', manager_name: 'فارس عبدالرحمن القحطاني' }
  ];

  const deptStmt = db.prepare(`
    INSERT INTO departments (code, name_ar, name_en, manager_name)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(code) DO UPDATE SET
      name_ar = excluded.name_ar,
      name_en = excluded.name_en,
      manager_name = excluded.manager_name
  `);
  officialDepartments.forEach(d => deptStmt.run(d.code, d.name_ar, d.name_en, d.manager_name));

  const allDepts = db.prepare('SELECT id, code, name_ar FROM departments').all();
  const deptMap = {};
  allDepts.forEach(d => {
    deptMap[d.name_ar.trim()] = d.id;
    deptMap[d.code.trim()] = d.id;
  });

  const officialBranches = [
    { code: 'BR-HQ', name_ar: 'المقر الرئيسي', name_en: 'Headquarters', city: 'أبها', is_main: 1, manager_name: 'عبدالملك سعيد الشريف' },
    { code: 'BR-MUWADAF', name_ar: 'حي الموظفين', name_en: 'Al Muwadafeen Branch', city: 'أبها', is_main: 0, manager_name: 'علي سعد حسين البشري' },
    { code: 'BR-CITYPARK', name_ar: 'سيتي بارك', name_en: 'City Park Branch', city: 'أبها', is_main: 0, manager_name: 'هاني عبدالرحمن صالح القحطاني' },
    { code: 'BR-HABIL', name_ar: 'الحبيل', name_en: 'Al Habil Branch', city: 'رجال ألمع - الحبيل', is_main: 0, manager_name: 'تامر جمعه احمد عبدالله' },
    { code: 'BR-DOWNTOWN', name_ar: 'مجمع وسط البلد', name_en: 'Downtown Commercial Complex', city: 'أبها', is_main: 0, manager_name: 'احمد عبدالرحمن علي يعن الله' }
  ];

  const branchStmt = db.prepare(`
    INSERT INTO branches (code, name_ar, name_en, city, is_main, manager_name)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(code) DO UPDATE SET
      name_ar = excluded.name_ar,
      name_en = excluded.name_en,
      city = excluded.city,
      is_main = excluded.is_main,
      manager_name = excluded.manager_name
  `);
  officialBranches.forEach(b => branchStmt.run(b.code, b.name_ar, b.name_en, b.city, b.is_main, b.manager_name));

  const allBranches = db.prepare('SELECT id, code, name_ar FROM branches').all();
  const branchMap = {};
  allBranches.forEach(b => {
    branchMap[b.name_ar.trim()] = b.id;
    branchMap[b.code.trim()] = b.id;
  });

  // 18 Sections
  const officialSections = [
    'الصالات ومنافذ البيع', 'المخبز', 'الموارد البشرية', 'الهندسية',
    'الصناديق والخزنة', 'الخدمات والدعم الإداري', 'المشتريات', 'المقاولات',
    'تقنية المعلومات', 'مشرفي الصالات', 'المالية', 'المستودعات',
    'الورشة والصيانة', 'النقل', 'محطة المرح الترفيهي', 'الخضار والفواكه',
    'الأمن', 'الأجبان'
  ];
  const secStmt = db.prepare('INSERT OR IGNORE INTO sections (name_ar) VALUES (?)');
  officialSections.forEach(s => secStmt.run(s));

  const allSections = db.prepare('SELECT id, name_ar FROM sections').all();
  const sectionMap = {};
  allSections.forEach(s => { sectionMap[s.name_ar.trim()] = s.id; });

  // Map Excel Department to Dept ID & Branch ID
  function mapDeptAndBranch(deptStr) {
    if (!deptStr || deptStr === 'لايوجد') {
      return { deptId: deptMap['الإدارة الرئيسية'], branchId: branchMap['المقر الرئيسي'] };
    }
    const s = deptStr.trim();
    if (s.includes('حي الموظفين')) return { deptId: deptMap['إدارة الفروع — حي الموظفين'], branchId: branchMap['حي الموظفين'] };
    if (s.includes('سيتي بارك')) return { deptId: deptMap['إدارة الفروع — سيتي بارك'], branchId: branchMap['سيتي بارك'] };
    if (s.includes('الحبيل')) return { deptId: deptMap['إدارة الفروع — الحبيل'], branchId: branchMap['الحبيل'] };
    if (s.includes('وسط البلد')) return { deptId: deptMap['إدارة الفروع — مجمع وسط البلد'], branchId: branchMap['مجمع وسط البلد'] };
    if (s.includes('المقاولات')) return { deptId: deptMap['إدارة المقاولات'], branchId: branchMap['المقر الرئيسي'] };
    if (s.includes('المستودع الرئيسي')) return { deptId: deptMap['إدارة المستودع الرئيسي'], branchId: branchMap['المقر الرئيسي'] };
    if (s.includes('الصيانة والورشة')) return { deptId: deptMap['إدارة الصيانة والورشة'], branchId: branchMap['المقر الرئيسي'] };
    if (s.includes('الهندسية')) return { deptId: deptMap['الإدارة الهندسية'], branchId: branchMap['المقر الرئيسي'] };
    return { deptId: deptMap['الإدارة الرئيسية'], branchId: branchMap['المقر الرئيسي'] };
  }

  // 3. Seed 108 Employees from Excel
  const rootDir = path.join(__dirname, '..', '..');
  const excelFile1 = path.join(rootDir, 'قاعدة بيانات موظفي جوهرة المجد .xlsx');
  const excelFile2 = path.join(rootDir, 'قاعدة بيانات موظفي جوهرة المجد.xlsx');
  const excelPath = fs.existsSync(excelFile1) ? excelFile1 : excelFile2;

  if (fs.existsSync(excelPath)) {
    const wb = xlsx.readFile(excelPath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const excelRows = xlsx.utils.sheet_to_json(ws);

    const upsertEmpStmt = db.prepare(`
      INSERT INTO employees (
        emp_code, full_name_ar, full_name_en, national_id, nationality,
        is_saudi, gender, phone, email, department_id, branch_id, section,
        section_id, job_title_ar, job_title_en, join_date, basic_salary,
        housing_allowance, transport_allowance, other_allowance, iban,
        iqama_expiry, direct_manager_name, opening_leave_balance,
        accrual_start_date, monthly_accrual_rate, annual_leave_balance, status
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, 'نشط'
      )
      ON CONFLICT(emp_code) DO UPDATE SET
        full_name_ar = excluded.full_name_ar,
        national_id = excluded.national_id,
        nationality = excluded.nationality,
        is_saudi = excluded.is_saudi,
        gender = excluded.gender,
        phone = excluded.phone,
        email = excluded.email,
        department_id = excluded.department_id,
        branch_id = excluded.branch_id,
        section = excluded.section,
        section_id = excluded.section_id,
        job_title_ar = excluded.job_title_ar,
        join_date = excluded.join_date,
        basic_salary = excluded.basic_salary,
        housing_allowance = excluded.housing_allowance,
        transport_allowance = excluded.transport_allowance,
        other_allowance = excluded.other_allowance,
        iban = excluded.iban,
        iqama_expiry = excluded.iqama_expiry,
        direct_manager_name = excluded.direct_manager_name,
        opening_leave_balance = excluded.opening_leave_balance,
        accrual_start_date = excluded.accrual_start_date,
        monthly_accrual_rate = excluded.monthly_accrual_rate,
        annual_leave_balance = excluded.annual_leave_balance,
        status = 'نشط'
    `);

    for (const row of excelRows) {
      const code = String(row['الرقم الوظيفي'] || '').trim();
      if (!code) continue;

      const nameAr = String(row['الاسم الرباعي'] || '').trim();
      const rawNid = String(row['رقم الهوية / الإقامة'] || '').trim();
      const nationalId = (rawNid && rawNid !== 'لايوجد') ? rawNid : null;
      const nationality = String(row['الجنسية'] || 'السعودية').trim();
      const isSaudi = nationality === 'السعودية' ? 1 : 0;
      const rawGender = String(row['الجنس'] || 'ذكر').trim();
      const gender = rawGender.includes('أنثى') || rawGender.includes('انثى') ? 'F' : 'M';
      const phone = String(row['رقم الجوال'] || '').replace('لايوجد', '').trim();
      const email = String(row['البريد الإلكتروني'] || '').replace('لايوجد', '').trim();
      const jobTitleAr = String(row['المسمى الوظيفي'] || '').trim();
      const jobTitleEn = jobTitleAr;
      const joinDate = excelDateToJSDate(row['تاريخ المباشرة']);
      const iqamaExpiry = excelDateToJSDate(row['تاريخ انتهاء الإقامة']);

      const basicSalary = typeof row['الراتب الأساسي'] === 'number' ? row['الراتب الأساسي'] : 0;
      const housingAllowance = typeof row['بدل السكن'] === 'number' ? row['بدل السكن'] : 0;
      const transportAllowance = typeof row['بدل المواصلات'] === 'number' ? row['بدل المواصلات'] : 0;
      const otherAllowance = typeof row['بدلات أخرى'] === 'number' ? row['بدلات أخرى'] : 0;
      const iban = String(row['رقم الآيبان'] || '').replace('لايوجد', '').trim();

      const rawOpeningBal = row['رصيد الإجازات حتى 2026-11-05'];
      const openingLeaveBalance = typeof rawOpeningBal === 'number' ? rawOpeningBal : 0;
      const rawRate = row['الاحتساب الشهري للاجازات'];
      const monthlyAccrualRate = typeof rawRate === 'number' ? rawRate : (isSaudi ? 1.75 : 1.75);
      const annualLeaveBalance = Math.floor(openingLeaveBalance);

      const { deptId, branchId } = mapDeptAndBranch(row['الإدارة']);
      const sectionText = String(row['القسم'] || '').replace('لايوجد', '').trim();
      const sectionId = sectionMap[sectionText] || null;
      const directMgrName = String(row['المدير المباشر'] || '').replace('لايوجد', '').trim();

      upsertEmpStmt.run(
        code, nameAr, jobTitleEn, nationalId, nationality,
        isSaudi, gender, phone, email, deptId, branchId, sectionText,
        sectionId, jobTitleAr, jobTitleEn, joinDate, basicSalary,
        housingAllowance, transportAllowance, otherAllowance, iban,
        iqamaExpiry, directMgrName, openingLeaveBalance,
        '2026-11-05', monthlyAccrualRate, annualLeaveBalance
      );
    }
  } else {
    const jsonPath = path.join(__dirname, 'officialEmployeesClean.json');
    if (fs.existsSync(jsonPath)) {
      const emps = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const upsertEmpStmt = db.prepare(`
        INSERT INTO employees (
          emp_code, full_name_ar, full_name_en, national_id, nationality,
          is_saudi, gender, phone, email, department_id, branch_id, section,
          section_id, job_title_ar, job_title_en, join_date, basic_salary,
          housing_allowance, transport_allowance, other_allowance, iban,
          iqama_expiry, direct_manager_name, opening_leave_balance,
          accrual_start_date, monthly_accrual_rate, annual_leave_balance, status
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, 'نشط'
        )
        ON CONFLICT(emp_code) DO UPDATE SET
          full_name_ar = excluded.full_name_ar,
          national_id = excluded.national_id,
          nationality = excluded.nationality,
          is_saudi = excluded.is_saudi,
          gender = excluded.gender,
          phone = excluded.phone,
          email = excluded.email,
          department_id = excluded.department_id,
          branch_id = excluded.branch_id,
          section = excluded.section,
          section_id = excluded.section_id,
          job_title_ar = excluded.job_title_ar,
          join_date = excluded.join_date,
          basic_salary = excluded.basic_salary,
          housing_allowance = excluded.housing_allowance,
          transport_allowance = excluded.transport_allowance,
          other_allowance = excluded.other_allowance,
          iban = excluded.iban,
          iqama_expiry = excluded.iqama_expiry,
          direct_manager_name = excluded.direct_manager_name,
          opening_leave_balance = excluded.opening_leave_balance,
          annual_leave_balance = excluded.annual_leave_balance,
          status = 'نشط'
      `);

      for (const e of emps) {
        if (e.status !== 'نشط') continue;
        upsertEmpStmt.run(
          e.emp_code, e.full_name_ar, e.full_name_en, e.national_id, e.nationality,
          e.is_saudi, e.gender, e.phone, e.email, e.department_id, e.branch_id, e.section || '',
          e.section_id, e.job_title_ar, e.job_title_en, e.join_date, e.basic_salary,
          e.housing_allowance, e.transport_allowance, e.other_allowance, e.iban,
          e.iqama_expiry, e.direct_manager_name, e.opening_leave_balance || 0,
          e.accrual_start_date || '2026-11-05', e.monthly_accrual_rate || 1.75, e.annual_leave_balance || 0
        );
      }
    }
  }

  // 4. Seed 5 Terminated Employees
  const terminatedEmployees = [
    { emp_code: 'JM-1094', full_name_ar: 'معدي موسى محمد عسيري', full_name_en: 'Madi Mousa Mohammed Asiri', national_id: '1126762093', nationality: 'السعودية', is_saudi: 1, gender: 'M', job_title_ar: 'بائع', job_title_en: 'Salesperson', status: 'منتهي الخدمة', termination_date: '2026-10-31', termination_reason: 'انتهاء عقد العمل' },
    { emp_code: 'JM-1104', full_name_ar: 'مشعل عبدالرحمن علي يعن الله', full_name_en: 'Mishaal Abdulrahman Ali Yanallah', national_id: '1125621555', nationality: 'السعودية', is_saudi: 1, gender: 'M', job_title_ar: 'بائع خضار', job_title_en: 'Vegetables Seller', status: 'منتهي الخدمة', termination_date: '2026-10-31', termination_reason: 'استقالة الموظف' },
    { emp_code: 'JM-1003', full_name_ar: 'مصطفى مجدى مصطفى العادلى', full_name_en: 'Mustafa Magdy Mustafa Al-Adly', national_id: '2241107842', nationality: 'مصر', is_saudi: 0, gender: 'M', job_title_ar: 'محاسب', job_title_en: 'Accountant', status: 'منتهي الخدمة', termination_date: '2026-10-31', termination_reason: 'انتهاء عقد العمل' },
    { emp_code: 'JM-1011', full_name_ar: 'دل بهادر رسمي مقار', full_name_en: 'Dil Bahadur Magar', national_id: '2165360732', nationality: 'نيبال', is_saudi: 0, gender: 'M', job_title_ar: 'صانع حلويات عام', job_title_en: 'Pastry Chef', status: 'منتهي الخدمة', termination_date: '2026-10-31', termination_reason: 'انتهاء عقد العمل' },
    { emp_code: 'JM-1047', full_name_ar: 'عبدالعزيز سعيد مفرح آل الحضيري', full_name_en: 'Abdulaziz Saeed Mofreh Al-Hudaifi', national_id: '1021592801', nationality: 'السعودية', is_saudi: 1, gender: 'M', job_title_ar: 'معقب', job_title_en: 'Government Relations Representative', status: 'منتهي الخدمة', termination_date: '2026-10-31', termination_reason: 'استقالة الموظف' }
  ];

  const termStmt = db.prepare(`
    INSERT INTO employees (emp_code, full_name_ar, full_name_en, national_id, nationality, is_saudi, gender, job_title_ar, job_title_en, status, termination_date, termination_reason)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(emp_code) DO UPDATE SET
      status = 'منتهي الخدمة',
      termination_date = excluded.termination_date,
      termination_reason = excluded.termination_reason
  `);
  terminatedEmployees.forEach(t => {
    termStmt.run(t.emp_code, t.full_name_ar, t.full_name_en || t.full_name_ar, t.national_id, t.nationality, t.is_saudi, t.gender, t.job_title_ar, t.job_title_en || 'Employee', t.status, t.termination_date, t.termination_reason);
  });

  // 5. Connect Direct Managers strictly
  const allActiveEmps = db.prepare("SELECT id, emp_code, full_name_ar, direct_manager_name FROM employees WHERE status = 'نشط'").all();
  const activeByName = new Map();
  allActiveEmps.forEach(e => { activeByName.set(e.full_name_ar.trim(), e.id); });
  if (activeByName.has('عبدالملك سعيد الشريف')) activeByName.set('عبدالملك الشريف', activeByName.get('عبدالملك سعيد الشريف'));
  if (activeByName.has('تامر جمعه احمد عبدالله')) activeByName.set('تامر جمعة احمد عبدالله', activeByName.get('تامر جمعه احمد عبدالله'));

  const updateMgrStmt = db.prepare('UPDATE employees SET manager_id = ? WHERE id = ?');
  for (const emp of allActiveEmps) {
    if (emp.direct_manager_name && activeByName.has(emp.direct_manager_name.trim())) {
      const mgrId = activeByName.get(emp.direct_manager_name.trim());
      if (mgrId !== emp.id) updateMgrStmt.run(mgrId, emp.id);
    }
  }

  // 6. Seed Official Disciplinary Regulations if empty
  seedPenaltyRegulations();

  console.log('--- Official Seed Completed Successfully ---');
}

function seedPenaltyRegulations() {
  const count = get('SELECT count(*) as c FROM penalty_regulations')?.c || 0;
  if (count === 48) return;

  const regPath = path.join(__dirname, 'official_accredited_regulations.json');
  if (fs.existsSync(regPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(regPath, 'utf8'));
      run('DELETE FROM penalty_regulations');
      const stmt = db.prepare(`
        INSERT INTO penalty_regulations (
          code, category, violation_text, penalty_1st, penalty_2nd, penalty_3rd, penalty_4th, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const v of data.violations) {
        stmt.run(
          v.code,
          v.category,
          v.violation_text,
          v.penalty_1st,
          v.penalty_2nd,
          v.penalty_3rd,
          v.penalty_4th,
          `معتمد بالقرار الوزاري رقم ${data.approval_number} وتاريخ ${data.approval_date_hijri}`
        );
      }
      console.log(`✓ Seeded ${data.violations.length} official accredited violations (قرار اعتماد رقم 229400).`);
    } catch (e) {
      console.error('Failed to seed official regulations:', e.message);
    }
  }
}

module.exports = {
  seedDatabase
};
