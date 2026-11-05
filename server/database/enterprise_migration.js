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

  // Zero mock data policy: No automatic seeding of vehicles or licenses.
  // Vehicles and licenses are only populated by user import or manual entries.

  // Zero mock data policy: No default medical insurance policy seeding.
  // Policies are managed strictly by user entry or import.

  console.log('✅ Enterprise Schema Migration Completed Successfully!');
}

if (require.main === module) {
  runEnterpriseMigration();
}

module.exports = { runEnterpriseMigration };
