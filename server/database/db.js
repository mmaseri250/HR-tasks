// server/database/db.js
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const dbPath = path.join(__dirname, 'hrms.db');
const db = new DatabaseSync(dbPath);

// Enable foreign keys and WAL mode for reliability
db.exec('PRAGMA foreign_keys = ON;');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS company_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      company_name_ar TEXT NOT NULL,
      company_name_en TEXT NOT NULL,
      cr_number TEXT NOT NULL,
      mhrsd_est_number TEXT NOT NULL,
      tax_number TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      address_ar TEXT,
      bank_name TEXT,
      bank_code TEXT,
      corporate_account TEXT,
      wps_payer_id TEXT,
      office_lat REAL,
      office_lng REAL,
      geofence_radius_meters INTEGER DEFAULT 250,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE,
      role TEXT NOT NULL DEFAULT 'admin',
      permissions TEXT DEFAULT '["all"]',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS branches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name_ar TEXT NOT NULL,
      name_en TEXT,
      city TEXT DEFAULT 'أبها',
      address TEXT,
      phone TEXT,
      manager_name TEXT,
      is_main INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name_ar TEXT NOT NULL,
      name_en TEXT NOT NULL,
      manager_name TEXT,
      budget REAL DEFAULT 0,
      location TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      emp_code TEXT UNIQUE NOT NULL,
      full_name_ar TEXT NOT NULL,
      full_name_en TEXT NOT NULL,
      national_id TEXT UNIQUE,
      nationality TEXT NOT NULL,
      is_saudi INTEGER NOT NULL DEFAULT 1,
      gender TEXT CHECK(gender IN ('M', 'F')) NOT NULL,
      birth_date TEXT,
      email TEXT,
      phone TEXT,
      department_id INTEGER,
      job_title_ar TEXT NOT NULL,
      job_title_en TEXT NOT NULL,
      grade_level TEXT,
      manager_id INTEGER,
      contract_type TEXT DEFAULT 'محدد المدة',
      join_date TEXT,
      contract_start TEXT,
      contract_end TEXT,
      iqama_expiry TEXT,
      passport_expiry TEXT,
      insurance_expiry TEXT,
      basic_salary REAL NOT NULL DEFAULT 0,
      housing_allowance REAL NOT NULL DEFAULT 0,
      transport_allowance REAL NOT NULL DEFAULT 0,
      other_allowance REAL NOT NULL DEFAULT 0,
      gosi_number TEXT,
      bank_name TEXT DEFAULT '',
      bank_code TEXT,
      iban TEXT DEFAULT '',
      annual_leave_balance REAL DEFAULT 0,
      section TEXT,
      direct_manager_name TEXT,
      qualification_degree TEXT,
      qualification_major TEXT,
      emergency_phone TEXT,
      shift_type TEXT DEFAULT 'دوام صباحي',
      status TEXT DEFAULT 'نشط',
      role TEXT DEFAULT 'employee',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
      FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS attendance_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      emp_id INTEGER NOT NULL,
      punch_time TEXT NOT NULL,
      punch_type TEXT CHECK(punch_type IN ('CHECK_IN', 'CHECK_OUT')) NOT NULL,
      device_id TEXT,
      device_name TEXT,
      verification_method TEXT DEFAULT 'FINGERPRINT',
      latitude REAL,
      longitude REAL,
      is_within_geofence INTEGER DEFAULT 1,
      raw_data TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS attendance_daily_summary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      emp_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      check_in TEXT,
      check_out TEXT,
      work_hours REAL DEFAULT 0,
      expected_hours REAL DEFAULT 8.0,
      delay_minutes INTEGER DEFAULT 0,
      early_departure_minutes INTEGER DEFAULT 0,
      overtime_hours REAL DEFAULT 0,
      status TEXT DEFAULT 'حاضر',
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(emp_id, date),
      FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS payroll_periods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      period_month TEXT UNIQUE NOT NULL,
      period_name_ar TEXT NOT NULL,
      total_basic REAL DEFAULT 0,
      total_housing REAL DEFAULT 0,
      total_transport REAL DEFAULT 0,
      total_allowances REAL DEFAULT 0,
      total_overtime REAL DEFAULT 0,
      total_gross REAL DEFAULT 0,
      total_gosi_employee REAL DEFAULT 0,
      total_gosi_company REAL DEFAULT 0,
      total_deductions REAL DEFAULT 0,
      total_net REAL DEFAULT 0,
      employee_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'مسودة',
      wps_file_name TEXT,
      approved_by TEXT,
      approved_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payroll_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      payroll_period_id INTEGER NOT NULL,
      emp_id INTEGER NOT NULL,
      basic_salary REAL NOT NULL,
      housing_allowance REAL NOT NULL DEFAULT 0,
      transport_allowance REAL NOT NULL DEFAULT 0,
      other_allowance REAL NOT NULL DEFAULT 0,
      overtime_pay REAL NOT NULL DEFAULT 0,
      bonus_pay REAL NOT NULL DEFAULT 0,
      gross_salary REAL NOT NULL,
      gosi_employee_share REAL NOT NULL DEFAULT 0,
      gosi_company_share REAL NOT NULL DEFAULT 0,
      absence_deduction REAL NOT NULL DEFAULT 0,
      delay_deduction REAL NOT NULL DEFAULT 0,
      advance_deduction REAL NOT NULL DEFAULT 0,
      other_deductions REAL NOT NULL DEFAULT 0,
      total_deductions REAL NOT NULL DEFAULT 0,
      net_salary REAL NOT NULL,
      payment_status TEXT DEFAULT 'جاهز للصرف',
      bank_name TEXT,
      bank_code TEXT,
      iban TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(payroll_period_id, emp_id),
      FOREIGN KEY (payroll_period_id) REFERENCES payroll_periods(id) ON DELETE CASCADE,
      FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_no TEXT UNIQUE NOT NULL,
      emp_id INTEGER NOT NULL,
      request_type TEXT NOT NULL,
      start_date TEXT,
      end_date TEXT,
      days_count REAL DEFAULT 0,
      amount REAL DEFAULT 0,
      destination_entity TEXT,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'معلق - بانتظار موافقة المدير المباشر',
      manager_id INTEGER,
      manager_name TEXT,
      manager_status TEXT DEFAULT 'معلق',
      manager_comment TEXT,
      manager_action_at TEXT,
      hr_verify_status TEXT DEFAULT 'معلق',
      hr_verify_comment TEXT,
      hr_verify_at TEXT,
      hr_verifier_name TEXT,
      hr_director_status TEXT DEFAULT 'معلق',
      hr_director_comment TEXT,
      hr_director_action_at TEXT,
      hr_director_name TEXT,
      manager_comment_legacy TEXT,
      hr_comment TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE,
      FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS biometric_devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_name TEXT NOT NULL,
      device_code TEXT UNIQUE NOT NULL,
      ip_address TEXT NOT NULL,
      port INTEGER DEFAULT 4370,
      location TEXT NOT NULL,
      status TEXT DEFAULT 'متصل',
      last_sync TEXT,
      model TEXT DEFAULT 'ZKTeco SilkBio-101TC',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Disciplinary Regulations (لائحة المخالفات والجزاءات - 50 بنداً)
    CREATE TABLE IF NOT EXISTS penalty_regulations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      violation_text TEXT NOT NULL,
      penalty_1st TEXT NOT NULL,
      penalty_2nd TEXT NOT NULL,
      penalty_3rd TEXT NOT NULL,
      penalty_4th TEXT NOT NULL,
      notes TEXT
    );

    -- Issued Disciplinary Decisions (القرارات الجزائية الصادرة)
    CREATE TABLE IF NOT EXISTS penalties_issued (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      decision_no TEXT UNIQUE NOT NULL,
      emp_id INTEGER NOT NULL,
      violation_code TEXT NOT NULL,
      violation_text TEXT NOT NULL,
      category TEXT,
      repetition_level TEXT NOT NULL,
      penalty_text TEXT NOT NULL,
      deduction_type TEXT DEFAULT 'خصم راتب',
      deduction_days REAL DEFAULT 0,
      incident_date TEXT NOT NULL,
      investigation_details TEXT,
      status TEXT DEFAULT 'معتمد ومطبق',
      issued_by TEXT NOT NULL,
      issued_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_emp_dept ON employees(department_id);
    CREATE INDEX IF NOT EXISTS idx_emp_code ON employees(emp_code);
    CREATE INDEX IF NOT EXISTS idx_att_date ON attendance_daily_summary(date);
    CREATE INDEX IF NOT EXISTS idx_att_emp_date ON attendance_daily_summary(emp_id, date);
    CREATE INDEX IF NOT EXISTS idx_payroll_item_period ON payroll_items(payroll_period_id);
    CREATE INDEX IF NOT EXISTS idx_req_emp ON requests(emp_id);
    CREATE INDEX IF NOT EXISTS idx_penalty_emp ON penalties_issued(emp_id);

    -- Attendance & Shift Policies (سياسات الدوام والورديات)
    CREATE TABLE IF NOT EXISTS attendance_policies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      policy_name TEXT NOT NULL,
      shift_type TEXT NOT NULL DEFAULT 'دوام صباحي',
      start_time TEXT DEFAULT '08:00',
      end_time TEXT DEFAULT '16:00',
      grace_period_mins INTEGER DEFAULT 15,
      daily_hours REAL DEFAULT 8.0,
      work_days TEXT DEFAULT 'السبت إلى الخميس',
      flexible_hours INTEGER DEFAULT 0,
      overtime_allowed INTEGER DEFAULT 0,
      min_hours REAL DEFAULT 3.0,
      notes TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Dedicated Leave Management System (إدارة الإجازات وسير الموافقات الرباعي)
    CREATE TABLE IF NOT EXISTS leaves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_no TEXT UNIQUE NOT NULL,
      emp_id INTEGER NOT NULL,
      leave_type TEXT NOT NULL DEFAULT 'إجازة سنوية',
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      days_count REAL NOT NULL,
      reason TEXT,
      substitute_emp_id INTEGER,
      attachment TEXT,
      status TEXT DEFAULT 'معلق - بانتظار موافقة المدير المباشر',
      manager_id INTEGER,
      manager_name TEXT,
      manager_status TEXT DEFAULT 'معلق',
      manager_comment TEXT,
      manager_action_at TEXT,
      hr_verify_status TEXT DEFAULT 'معلق',
      hr_verify_comment TEXT,
      hr_verify_at TEXT,
      hr_verifier_name TEXT,
      hr_director_status TEXT DEFAULT 'معلق',
      hr_director_comment TEXT,
      hr_director_action_at TEXT,
      hr_director_name TEXT,
      hr_status TEXT DEFAULT 'معلق',
      hr_comment TEXT,
      hr_action_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE,
      FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL,
      FOREIGN KEY (substitute_emp_id) REFERENCES employees(id) ON DELETE SET NULL
    );

    -- Attendance Notices & Disciplinary Warnings (نظام إشعارات وإنذارات الغياب والتأخير والانقطاع - المادة 80)
    CREATE TABLE IF NOT EXISTS attendance_notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      notice_no TEXT UNIQUE NOT NULL,
      emp_id INTEGER NOT NULL,
      emp_code TEXT,
      emp_name TEXT NOT NULL,
      department TEXT,
      branch TEXT,
      notice_type TEXT NOT NULL,
      incident_date TEXT NOT NULL,
      duration_mins INTEGER DEFAULT 0,
      absence_days REAL DEFAULT 0,
      consecutive_days INTEGER DEFAULT 0,
      legal_basis TEXT,
      details TEXT,
      penalty_applied TEXT,
      status TEXT DEFAULT 'صادر',
      acknowledged_at TEXT,
      employee_notes TEXT,
      issued_by TEXT DEFAULT 'إدارة الموارد البشرية',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    -- Terminated & Resigned Employees (الموظفون المنهي خدماتهم ومكافأة نهاية الخدمة)
    CREATE TABLE IF NOT EXISTS terminated_employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      emp_id INTEGER,
      emp_code TEXT NOT NULL,
      full_name_ar TEXT NOT NULL,
      national_id TEXT,
      nationality TEXT,
      department_name TEXT,
      job_title_ar TEXT,
      join_date TEXT,
      termination_date TEXT NOT NULL,
      termination_type TEXT NOT NULL,
      termination_reason TEXT,
      service_years REAL DEFAULT 0,
      last_salary REAL DEFAULT 0,
      end_of_service_reward REAL DEFAULT 0,
      leave_compensation REAL DEFAULT 0,
      deductions_amount REAL DEFAULT 0,
      total_settlement REAL DEFAULT 0,
      clearance_status TEXT DEFAULT 'قيد إجراءات إخلاء الطرف',
      qiwa_status TEXT DEFAULT 'بانتظار الإسقاط من قوى',
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Employee Loans & Advances (إدارة واستيراد السلف والأقساط الشهرية)
    CREATE TABLE IF NOT EXISTS loans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      loan_no TEXT UNIQUE NOT NULL,
      emp_id INTEGER NOT NULL,
      emp_code TEXT,
      emp_name TEXT NOT NULL,
      loan_type TEXT DEFAULT 'سلفة شخصية',
      total_amount REAL NOT NULL,
      installments_count INTEGER NOT NULL DEFAULT 1,
      monthly_installment REAL NOT NULL,
      paid_amount REAL DEFAULT 0,
      remaining_amount REAL NOT NULL,
      start_month TEXT NOT NULL,
      reason TEXT,
      status TEXT DEFAULT 'نشطة',
      approved_by TEXT DEFAULT 'إدارة الموارد البشرية',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    -- Daily Accrual and Leave Balances (أرصدة الإجازات والاستحقاق اليومي)
    CREATE TABLE IF NOT EXISTS leave_balances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      emp_id INTEGER UNIQUE NOT NULL,
      base_balance REAL NOT NULL DEFAULT 0,
      accrual_rate_annual REAL NOT NULL DEFAULT 21,
      accrued_days REAL NOT NULL DEFAULT 0,
      used_days REAL NOT NULL DEFAULT 0,
      manual_adjustment REAL NOT NULL DEFAULT 0,
      current_balance REAL NOT NULL DEFAULT 0,
      last_accrual_date TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    -- Leave Balance Audit Log (سجل تعديلات أرصدة الإجازات - صلاحية الموارد البشرية فقط)
    CREATE TABLE IF NOT EXISTS leave_balance_adjustments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      emp_id INTEGER NOT NULL,
      adjusted_by TEXT NOT NULL,
      adjustment_days REAL NOT NULL,
      balance_before REAL NOT NULL,
      balance_after REAL NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    -- Independent Tasks System (نظام المهام المستقل)
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_no TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      assigned_to INTEGER NOT NULL,
      assigned_by INTEGER,
      assigned_by_name TEXT,
      start_date TEXT NOT NULL,
      due_date TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'متوسطة',
      progress_percent INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'جديدة',
      attachments TEXT,
      manager_approval TEXT DEFAULT 'معلق',
      manager_comment TEXT,
      hr_comment TEXT,
      completed_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assigned_to) REFERENCES employees(id) ON DELETE CASCADE,
      FOREIGN KEY (assigned_by) REFERENCES employees(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_leaves_emp ON leaves(emp_id);
    CREATE INDEX IF NOT EXISTS idx_leaves_status ON leaves(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_emp ON tasks(assigned_to);
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

    -- Dedicated Absence Notices (نظام إشعارات الغياب وربط بريد الشركة)
    CREATE TABLE IF NOT EXISTS absence_notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      notice_no TEXT UNIQUE NOT NULL,
      emp_id INTEGER NOT NULL,
      emp_code TEXT,
      emp_name TEXT NOT NULL,
      department_name TEXT,
      job_title TEXT,
      recipient_email TEXT DEFAULT '',
      manager_name TEXT DEFAULT '',
      manager_email TEXT DEFAULT '',
      absence_date TEXT NOT NULL,
      absence_end_date TEXT,
      days_count REAL DEFAULT 1,
      absence_type TEXT NOT NULL,
      warning_tier TEXT NOT NULL,
      legal_basis TEXT,
      reason TEXT,
      action_required TEXT,
      email_subject TEXT,
      email_body_html TEXT,
      email_status TEXT DEFAULT 'جاهز للربط ببريد الشركة',
      email_sent_at TEXT,
      status TEXT DEFAULT 'صادر',
      acknowledged_at TEXT,
      employee_notes TEXT,
      created_by TEXT DEFAULT 'إدارة الموارد البشرية',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS company_email_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      smtp_host TEXT DEFAULT '',
      smtp_port INTEGER DEFAULT 587,
      smtp_user TEXT DEFAULT '',
      smtp_pass TEXT DEFAULT '',
      from_email TEXT DEFAULT 'hr@jawharat-almajd.com',
      from_name TEXT DEFAULT 'شركة جوهرة المجد للمقاولات - الموارد البشرية',
      is_ssl INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 0,
      last_tested_at TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    INSERT OR IGNORE INTO company_email_settings (id, smtp_host, smtp_port, smtp_user, smtp_pass, from_email, from_name, is_ssl, is_active, updated_at)
    VALUES (1, '', 587, '', '', 'hr@jawharat-almajd.com', 'شركة جوهرة المجد للمقاولات - الموارد البشرية', 0, 0, CURRENT_TIMESTAMP);

    CREATE INDEX IF NOT EXISTS idx_absence_notices_emp ON absence_notices(emp_id);
    CREATE INDEX IF NOT EXISTS idx_absence_notices_status ON absence_notices(status);
    CREATE INDEX IF NOT EXISTS idx_absence_notices_email ON absence_notices(email_status);
  `);

  try {
    db.exec('ALTER TABLE users ADD COLUMN emp_id INTEGER;');
  } catch (e) {
    // Column already exists
  }

  try { db.exec('ALTER TABLE requests ADD COLUMN manager_id INTEGER;'); } catch (e) {}
  try { db.exec('ALTER TABLE requests ADD COLUMN manager_approved_at TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE requests ADD COLUMN manager_action_at TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE requests ADD COLUMN manager_name TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE requests ADD COLUMN manager_comment TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE requests ADD COLUMN manager_status TEXT DEFAULT "معلق";'); } catch (e) {}
  try { db.exec('ALTER TABLE requests ADD COLUMN hr_verify_status TEXT DEFAULT "معلق";'); } catch (e) {}
  try { db.exec('ALTER TABLE requests ADD COLUMN hr_verify_comment TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE requests ADD COLUMN hr_verify_at TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE requests ADD COLUMN hr_verifier_name TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE requests ADD COLUMN hr_director_status TEXT DEFAULT "معلق";'); } catch (e) {}
  try { db.exec('ALTER TABLE requests ADD COLUMN hr_director_comment TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE requests ADD COLUMN hr_director_action_at TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE requests ADD COLUMN hr_director_name TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE requests ADD COLUMN hr_approved_at TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE requests ADD COLUMN hr_approver_name TEXT;'); } catch (e) {}

  try { db.exec('ALTER TABLE leaves ADD COLUMN manager_id INTEGER;'); } catch (e) {}
  try { db.exec('ALTER TABLE leaves ADD COLUMN manager_name TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE leaves ADD COLUMN manager_status TEXT DEFAULT "معلق";'); } catch (e) {}
  try { db.exec('ALTER TABLE leaves ADD COLUMN manager_comment TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE leaves ADD COLUMN manager_action_at TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE leaves ADD COLUMN hr_verify_status TEXT DEFAULT "معلق";'); } catch (e) {}
  try { db.exec('ALTER TABLE leaves ADD COLUMN hr_verify_comment TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE leaves ADD COLUMN hr_verify_at TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE leaves ADD COLUMN hr_verifier_name TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE leaves ADD COLUMN hr_director_status TEXT DEFAULT "معلق";'); } catch (e) {}
  try { db.exec('ALTER TABLE leaves ADD COLUMN hr_director_comment TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE leaves ADD COLUMN hr_director_action_at TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE leaves ADD COLUMN hr_director_name TEXT;'); } catch (e) {}

  try { db.exec('ALTER TABLE employees ADD COLUMN section TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE employees ADD COLUMN direct_manager_name TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE employees ADD COLUMN policy_id INTEGER;'); } catch (e) {}
  try { db.exec('ALTER TABLE employees ADD COLUMN branch_id INTEGER;'); } catch (e) {}
  try { db.exec('ALTER TABLE biometric_devices ADD COLUMN branch_id INTEGER;'); } catch (e) {}
  try { db.exec('ALTER TABLE biometric_devices ADD COLUMN is_active INTEGER DEFAULT 1;'); } catch (e) {}
  try { db.exec('ALTER TABLE attendance_policies ADD COLUMN min_hours REAL DEFAULT 3.0;'); } catch (e) {}
  try { db.exec('ALTER TABLE attendance_policies ADD COLUMN is_default INTEGER DEFAULT 0;'); } catch (e) {}
  try { db.exec('ALTER TABLE tasks ADD COLUMN attachments TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE employees ADD COLUMN qualification_degree TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE employees ADD COLUMN qualification_major TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE employees ADD COLUMN emergency_phone TEXT;'); } catch (e) {}

  // 1. Audit Logs Table (سجل الرقابة والعمليات الشامل)
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      entity_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      performed_by_id INTEGER,
      performed_by_name TEXT,
      performed_by_role TEXT,
      old_status TEXT,
      new_status TEXT,
      stage TEXT,
      comment TEXT,
      ip_address TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
    CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
  `);

  // 2. Multi-Tier Approvals History (سجل الموافقات الفعلي)
  db.exec(`
    CREATE TABLE IF NOT EXISTS approvals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id INTEGER,
      leave_id INTEGER,
      step_number INTEGER NOT NULL,
      step_name TEXT NOT NULL,
      approver_id INTEGER,
      approver_name TEXT NOT NULL,
      approver_role TEXT NOT NULL,
      action TEXT NOT NULL,
      comment TEXT,
      action_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
      FOREIGN KEY (leave_id) REFERENCES leaves(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_approvals_req ON approvals(request_id);
    CREATE INDEX IF NOT EXISTS idx_approvals_leave ON approvals(leave_id);
  `);

  // 3. Workflow Steps Pipeline (مراحل سير العمل الرباعي المعتمد)
  db.exec(`
    CREATE TABLE IF NOT EXISTS workflow_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id INTEGER,
      leave_id INTEGER,
      step_order INTEGER NOT NULL,
      step_name TEXT NOT NULL,
      role_required TEXT NOT NULL,
      assigned_to_emp_id INTEGER,
      assigned_to_name TEXT,
      status TEXT DEFAULT 'معلق',
      decision_by_id INTEGER,
      decision_by_name TEXT,
      decision_date TEXT,
      decision_notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
      FOREIGN KEY (leave_id) REFERENCES leaves(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_wf_req ON workflow_steps(request_id);
    CREATE INDEX IF NOT EXISTS idx_wf_leave ON workflow_steps(leave_id);
  `);

  // 4. In-System Notifications (إشعارات النظام اللحظية للمديرين والموظفين)
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      emp_id INTEGER,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      link TEXT,
      type TEXT DEFAULT 'approval',
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_notif_emp ON notifications(emp_id);
    CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notif_read ON notifications(is_read);
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS employee_qualifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      emp_id INTEGER NOT NULL,
      degree TEXT NOT NULL,
      major TEXT NOT NULL,
      institution TEXT,
      graduation_year INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
    );
  `);


  db.exec(`
    CREATE TABLE IF NOT EXISTS muqeem_residents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      iqama_number TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      gender TEXT DEFAULT 'ذكر',
      nationality TEXT NOT NULL,
      occupation TEXT NOT NULL,
      passport_number TEXT,
      passport_expiry TEXT,
      iqama_issue_date TEXT,
      iqama_expiry_gregorian TEXT,
      iqama_expiry_hijri TEXT,
      birth_date TEXT,
      is_outside_ksa INTEGER DEFAULT 0,
      employer_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_muqeem_iqama ON muqeem_residents(iqama_number);
    CREATE INDEX IF NOT EXISTS idx_muqeem_outside ON muqeem_residents(is_outside_ksa);
  `);

  try {
    const countCheck = db.prepare('SELECT count(*) as cnt FROM muqeem_residents').get();
    if (countCheck && countCheck.cnt === 0) {
      seedMuqeemResidentsFromExcel();
    }
  } catch (e) {
    console.error('Error checking muqeem_residents seed:', e.message);
  }
}

function seedMuqeemResidentsFromExcel() {
  try {
    const xlsx = require('xlsx');
    const excelPath = path.join(__dirname, '..', '..', 'المقيمين النشطين10_5_2026.xlsx');
    if (!fs.existsSync(excelPath)) return;
    const wb = xlsx.readFile(excelPath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(ws);

    // Retrieve active expat employees from employee database
    const expatEmps = db.prepare('SELECT national_id, full_name_ar, gender, nationality, job_title_ar, iqama_expiry, passport_expiry FROM employees WHERE is_saudi = 0').all();
    const expatMap = new Map();
    expatEmps.forEach(e => expatMap.set(String(e.national_id).trim(), e));

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO muqeem_residents (
        iqama_number, full_name, gender, nationality, occupation,
        passport_number, passport_expiry, iqama_issue_date,
        iqama_expiry_gregorian, iqama_expiry_hijri, birth_date,
        is_outside_ksa, employer_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Only insert rows that match the employee database!
    for (const row of data) {
      const iqama = String(row['رقم الاقامة'] || '').trim();
      if (!iqama || !expatMap.has(iqama)) continue;

      stmt.run(
        iqama,
        String(row['الاسم'] || '').trim(),
        String(row['الجنس'] || 'ذكر').trim(),
        String(row['الجنسية'] || '').trim(),
        String(row['المهنة'] || '').trim(),
        String(row['رقم الجواز'] || '').trim(),
        String(row['تاريخ انتهاء الجواز'] || '').trim(),
        String(row['تاريخ اصدار الاقامة'] || '').trim(),
        String(row['تاريخ انتهاء الاقامة'] || '').trim(),
        String(row['تاريخ انتهاء الاقامة بالهجري'] || '').trim(),
        String(row['تاريخ الميلاد'] || '').trim(),
        String(row['خارج المملكه'] || '').trim() === 'نعم' ? 1 : 0,
        String(row['رقم صاحب العمل'] || '7013999755').trim()
      );
    }

    // Only residents genuinely present in the Muqeem Excel sheet are inserted.
    // Zero fabrication: do NOT synthesize fake passport or iqama dates for missing records.

    // Delete any resident not in the company's employee database
    db.prepare('DELETE FROM muqeem_residents WHERE iqama_number NOT IN (SELECT national_id FROM employees WHERE is_saudi = 0)').run();
  } catch (err) {
    console.error('Could not auto-seed muqeem residents:', err.message);
  }
}

function syncEmployeeIqamaExpiries() {
  try {
    db.prepare(`
      UPDATE employees SET
        iqama_expiry = (
          SELECT iqama_expiry_gregorian FROM muqeem_residents WHERE muqeem_residents.iqama_number = employees.national_id
        ),
        passport_expiry = (
          SELECT passport_expiry FROM muqeem_residents WHERE muqeem_residents.iqama_number = employees.national_id
        )
      WHERE is_saudi = 0 AND national_id IN (SELECT iqama_number FROM muqeem_residents);
    `).run();
  } catch (err) {
    console.error('Error syncing employee iqama expiries:', err.message);
  }
}

initSchema();
syncEmployeeIqamaExpiries();

module.exports = {
  db,
  query(sql, params = []) {
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  },
  get(sql, params = []) {
    const stmt = db.prepare(sql);
    return stmt.get(...params);
  },
  run(sql, params = []) {
    const stmt = db.prepare(sql);
    return stmt.run(...params);
  }
};
