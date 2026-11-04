/**
 * server/database/enterprise_migration.js
 * Migration for HRMS Enterprise Expansion Modules:
 * - End of Service (EOS) Settlements
 * - ATS & Recruitment
 * - AI Job Descriptions
 * - Fleet & Vehicle Management (Tamm)
 * - Medical Insurance & Baladiya Health Cards
 * - Transfer Requests & Workflow
 * - Administrative Circulars & Acknowledgements
 * - Government & Commercial Licenses
 */

const { db } = require('./db');

function runEnterpriseMigration() {
  console.log('🚀 Running HRMS Enterprise Schema Migration...');

  db.exec(`
    -- 1. End of Service Settlements (نهاية الخدمة والمخالصات)
    CREATE TABLE IF NOT EXISTS eos_settlements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      settlement_no TEXT UNIQUE NOT NULL,
      emp_id INTEGER NOT NULL,
      emp_code TEXT NOT NULL,
      full_name_ar TEXT NOT NULL,
      national_id TEXT,
      job_title TEXT,
      department_name TEXT,
      hire_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      service_years INTEGER DEFAULT 0,
      service_months INTEGER DEFAULT 0,
      service_days INTEGER DEFAULT 0,
      total_service_years REAL DEFAULT 0,
      basic_salary REAL NOT NULL,
      gross_salary REAL NOT NULL,
      termination_type TEXT NOT NULL, -- resignation, contract_end, employer_end, article_77, probation, force_majeure
      award_amount REAL DEFAULT 0,
      vacation_compensation REAL DEFAULT 0,
      remaining_leave_days REAL DEFAULT 0,
      unpaid_salary REAL DEFAULT 0,
      loans_deduction REAL DEFAULT 0,
      other_deductions REAL DEFAULT 0,
      net_payable REAL DEFAULT 0,
      reason TEXT,
      clearance_status TEXT DEFAULT 'مسودة', -- مسودة, معتمد, مصروف
      approved_by TEXT,
      approved_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_eos_emp ON eos_settlements(emp_id);
    CREATE INDEX IF NOT EXISTS idx_eos_date ON eos_settlements(end_date);

    -- 2. Job Vacancies (الوظائف الشاغرة ATS)
    CREATE TABLE IF NOT EXISTS job_vacancies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_code TEXT UNIQUE NOT NULL,
      title_ar TEXT NOT NULL,
      title_en TEXT,
      department_id INTEGER,
      branch_id INTEGER,
      experience_years INTEGER DEFAULT 0,
      employment_type TEXT DEFAULT 'دوام كامل',
      openings_count INTEGER DEFAULT 1,
      salary_range TEXT,
      status TEXT DEFAULT 'مفتوح', -- مفتوح, معلق, مغلق
      description_id INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Job Applicants (المتقدمين للوظائف)
    CREATE TABLE IF NOT EXISTS job_applicants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      applicant_no TEXT UNIQUE NOT NULL,
      vacancy_id INTEGER,
      full_name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      nationality TEXT DEFAULT 'سعودي',
      experience_years INTEGER DEFAULT 0,
      education_level TEXT,
      current_employer TEXT,
      expected_salary REAL,
      stage TEXT DEFAULT 'جديد', -- جديد, فرز_أولي, مقابلة_شخصية, عرض_وظيفي, مقبول, مرفوض
      interview_date TEXT,
      interview_notes TEXT,
      resume_file TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_applicants_vacancy ON job_applicants(vacancy_id);
    CREATE INDEX IF NOT EXISTS idx_applicants_stage ON job_applicants(stage);

    -- 4. AI Job Descriptions (الأوصاف الوظيفية بالذكاء الاصطناعي)
    CREATE TABLE IF NOT EXISTS job_descriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      department_id INTEGER,
      department_name TEXT,
      experience_level TEXT,
      keywords TEXT,
      language TEXT DEFAULT 'ar',
      overview TEXT,
      responsibilities TEXT,
      qualifications TEXT,
      skills TEXT,
      full_content TEXT,
      created_by TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- 5. Fleet & Vehicles (إدارة الأسطول ومنصة تم)
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plate_number_ar TEXT NOT NULL,
      plate_number_en TEXT,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      color TEXT,
      vin_serial TEXT UNIQUE,
      assigned_emp_id INTEGER,
      assigned_emp_name TEXT,
      assigned_date TEXT,
      istimara_expiry TEXT,
      fahas_expiry TEXT,
      insurance_company TEXT,
      insurance_policy_no TEXT,
      insurance_expiry TEXT,
      odometer INTEGER DEFAULT 0,
      status TEXT DEFAULT 'نشط', -- نشط, صيانة, معطل, مسقط
      tamm_status TEXT DEFAULT 'ساري',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_vehicles_emp ON vehicles(assigned_emp_id);
    CREATE INDEX IF NOT EXISTS idx_vehicles_istimara ON vehicles(istimara_expiry);

    -- 6. Medical Insurance Policies (وثائق التأمين الطبي)
    CREATE TABLE IF NOT EXISTS medical_insurance_policies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      policy_no TEXT UNIQUE NOT NULL,
      provider_name TEXT NOT NULL,
      policy_start TEXT,
      policy_end TEXT,
      category TEXT DEFAULT 'شامل',
      status TEXT DEFAULT 'سارية',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- 7. Employee Medical Insurance Cards (بطاقات التأمين الطبي للموظفين)
    CREATE TABLE IF NOT EXISTS employee_insurance_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      emp_id INTEGER NOT NULL,
      emp_code TEXT,
      policy_id INTEGER,
      member_id TEXT,
      class_category TEXT DEFAULT 'B', -- VIP, A, B, C
      issue_date TEXT,
      expiry_date TEXT,
      dependents_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'سارية',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_ins_emp ON employee_insurance_cards(emp_id);

    -- 8. Municipal Health Cards (البطاقات الصحية للعمال - البلدية)
    CREATE TABLE IF NOT EXISTS health_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      emp_id INTEGER NOT NULL,
      emp_code TEXT,
      card_no TEXT UNIQUE NOT NULL,
      municipality_name TEXT DEFAULT 'أمانة منطقة عسير',
      issue_date TEXT,
      expiry_date TEXT,
      medical_center TEXT,
      status TEXT DEFAULT 'سارية',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_health_emp ON health_cards(emp_id);
    CREATE INDEX IF NOT EXISTS idx_health_exp ON health_cards(expiry_date);

    -- 9. Transfer Requests (طلبات النقل وسير الموافقات)
    CREATE TABLE IF NOT EXISTS transfer_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_no TEXT UNIQUE NOT NULL,
      emp_id INTEGER NOT NULL,
      current_dept_id INTEGER,
      target_dept_id INTEGER,
      current_branch_id INTEGER,
      target_branch_id INTEGER,
      reason TEXT,
      desired_transfer_date TEXT,
      status TEXT DEFAULT 'معلق', -- معلق, موافقة_المدير, موافقة_الموارد_البشرية, معتمد_نهائياً, مرفوض
      manager_status TEXT DEFAULT 'معلق',
      manager_comment TEXT,
      manager_action_at TEXT,
      hr_status TEXT DEFAULT 'معلق',
      hr_comment TEXT,
      hr_action_at TEXT,
      exec_status TEXT DEFAULT 'معلق',
      exec_comment TEXT,
      exec_action_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_transfer_emp ON transfer_requests(emp_id);

    -- 10. Administrative Circulars (التعاميم الإدارية)
    CREATE TABLE IF NOT EXISTS administrative_circulars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      circular_no TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT DEFAULT 'إداري',
      target_audience TEXT DEFAULT 'الكل',
      issued_by TEXT NOT NULL,
      issued_at TEXT NOT NULL,
      is_urgent INTEGER DEFAULT 0,
      acknowledgement_required INTEGER DEFAULT 0,
      status TEXT DEFAULT 'منشور',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- 11. Circular Acknowledgements (إقرارات الاطلاع على التعاميم)
    CREATE TABLE IF NOT EXISTS circular_acknowledgements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      circular_id INTEGER NOT NULL,
      emp_id INTEGER NOT NULL,
      acknowledged_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(circular_id, emp_id)
    );

    -- 12. Company Government & Municipal Licenses (السجلات والتراخيص)
    CREATE TABLE IF NOT EXISTS company_licenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      license_type TEXT NOT NULL,
      license_name_ar TEXT NOT NULL,
      license_no TEXT NOT NULL,
      issuing_authority TEXT NOT NULL,
      issue_date TEXT,
      expiry_date TEXT NOT NULL,
      alert_days_before INTEGER DEFAULT 60,
      status TEXT DEFAULT 'سارية',
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_lic_exp ON company_licenses(expiry_date);
  `);

  // Seed default company licenses if empty
  const licCount = db.prepare('SELECT COUNT(*) as c FROM company_licenses').get().c;
  if (licCount === 0) {
    db.prepare(`
      INSERT INTO company_licenses (license_type, license_name_ar, license_no, issuing_authority, issue_date, expiry_date, status, notes)
      VALUES 
      ('commercial_reg', 'السجل التجاري الرئيسي - شركة جوهرة المجد', '5850024190', 'وزارة التجارة', '2023-01-15', '2027-01-14', 'سارية', 'المركز الرئيسي - أبها'),
      ('baladiya', 'رخصة الأنشطة البلدية والمقر الرئيسي', '4409120391', 'أمانة منطقة عسير', '2024-03-01', '2027-02-28', 'سارية', 'مبنى الإدارة - سيتي بارك'),
      ('civil_defense', 'شهادة استيفاء متطلبات السلامة والوقاية', 'CD-ASR-2024-88', 'المديرية العامة للدفاع المدني', '2025-01-10', '2027-01-09', 'سارية', 'نظام إنذار وإطفاء معتمد'),
      ('chamber', 'اشتراك الغرفة التجارية بأبها', 'CH-774920', 'غرفة أبها', '2024-01-01', '2027-01-01', 'سارية', 'الدرجة الممتازة'),
      ('saudization_cert', 'شهادة التوطين الرسمية ونطاقات', 'SAUDI-2026-901', 'وزارة الموارد البشرية', '2026-01-01', '2027-01-01', 'سارية', 'النطاق الأخضر المتوسط'),
      ('zakat_cert', 'شهادة الزكاة والضريبة والجمارك (ZATCA)', 'ZATCA-1029384', 'هيئة الزكاة والضريبة والجمارك', '2025-04-30', '2026-04-30', 'سارية', 'إقرار زكوي ساري')
    `).run();
    console.log('✓ Seeded 6 official company licenses.');
  }

  // Seed default vehicle fleet if empty
  const vCount = db.prepare('SELECT COUNT(*) as c FROM vehicles').get().c;
  if (vCount === 0) {
    db.prepare(`
      INSERT INTO vehicles (plate_number_ar, plate_number_en, make, model, year, color, vin_serial, assigned_emp_id, assigned_emp_name, istimara_expiry, fahas_expiry, insurance_company, insurance_policy_no, insurance_expiry, status, tamm_status, odometer)
      VALUES
      ('أ ب ج 1122', 'ABJ 1122', 'تويوتا', 'هايلكس غمارتين', 2023, 'أبيض', 'VIN-TOY-HLX-99812', 9552, 'فارس عبدالرحمن القحطاني', '2027-05-20', '2026-11-15', 'التعاونية للتأمين', 'POL-TAW-8819', '2026-12-31', 'نشط', 'ساري', 45200),
      ('د هـ و 3344', 'DHW 3344', 'إيسوزو', 'ديماكس بيك أب', 2022, 'فضي', 'VIN-ISZ-DMX-44312', 9553, 'خالد صالح الراعي', '2026-09-10', '2026-10-05', 'بوبا للتأمين', 'POL-BUP-2234', '2026-11-20', 'نشط', 'ساري', 78400),
      ('ح ط ي 5566', 'HTY 5566', 'هيونداي', 'إلنترا سيدان', 2024, 'أبيض', 'VIN-HYU-ELN-11209', 9554, 'علي حسين بشرى', '2027-08-15', '2027-02-10', 'ميدغلف', 'POL-MED-5512', '2027-04-15', 'نشط', 'ساري', 21300),
      ('ك ل م 7788', 'KLM 7788', 'تويوتا', 'لاندكروزر برادو', 2023, 'أسود', 'VIN-TOY-PRD-77291', 9551, 'عبدالملك سعيد الشريف', '2027-11-30', '2026-12-01', 'التعاونية للتأمين', 'POL-TAW-9921', '2027-01-15', 'نشط', 'ساري', 38900)
    `).run();
    console.log('✓ Seeded 4 official company fleet vehicles.');
  }

  // Seed default medical insurance policy if empty
  const insCount = db.prepare('SELECT COUNT(*) as c FROM medical_insurance_policies').get().c;
  if (insCount === 0) {
    db.prepare(`
      INSERT INTO medical_insurance_policies (policy_no, provider_name, policy_start, policy_end, category, status)
      VALUES ('POL-MED-JM-2026', 'شركة بوبا العربية للتأمين التعاوني', '2026-01-01', '2026-12-31', 'وثيقة الموظفين الموحدة CCHI', 'سارية')
    `).run();
    console.log('✓ Seeded default medical insurance policy.');
  }

  console.log('✅ Enterprise Schema Migration Completed Successfully!');
}

if (require.main === module) {
  runEnterpriseMigration();
}

module.exports = { runEnterpriseMigration };
