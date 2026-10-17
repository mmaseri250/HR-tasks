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
      national_id TEXT UNIQUE NOT NULL,
      nationality TEXT NOT NULL,
      is_saudi INTEGER NOT NULL DEFAULT 1,
      gender TEXT CHECK(gender IN ('M', 'F')) NOT NULL,
      birth_date TEXT,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      department_id INTEGER,
      job_title_ar TEXT NOT NULL,
      job_title_en TEXT NOT NULL,
      grade_level TEXT,
      manager_id INTEGER,
      contract_type TEXT DEFAULT 'محدد المدة',
      join_date TEXT NOT NULL,
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
      bank_name TEXT NOT NULL,
      bank_code TEXT,
      iban TEXT NOT NULL,
      annual_leave_balance INTEGER DEFAULT 30,
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
      status TEXT DEFAULT 'معلق',
      manager_comment TEXT,
      hr_comment TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
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

    -- Dedicated Leave Management System (إدارة الإجازات وسير الموافقات)
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
      status TEXT DEFAULT 'معلق بانتظار موافقة المدير المباشر',
      manager_id INTEGER,
      manager_status TEXT DEFAULT 'معلق',
      manager_comment TEXT,
      manager_action_at TEXT,
      hr_status TEXT DEFAULT 'معلق',
      hr_comment TEXT,
      hr_action_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE,
      FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL,
      FOREIGN KEY (substitute_emp_id) REFERENCES employees(id) ON DELETE SET NULL
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
  `);

  try {
    db.exec('ALTER TABLE users ADD COLUMN emp_id INTEGER;');
  } catch (e) {
    // Column already exists
  }

  try {
    db.exec('ALTER TABLE requests ADD COLUMN manager_approved_at TEXT;');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE requests ADD COLUMN manager_name TEXT;');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE requests ADD COLUMN hr_approved_at TEXT;');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE requests ADD COLUMN hr_approver_name TEXT;');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE employees ADD COLUMN policy_id INTEGER;');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE employees ADD COLUMN branch_id INTEGER;');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE biometric_devices ADD COLUMN branch_id INTEGER;');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE attendance_policies ADD COLUMN min_hours REAL DEFAULT 3.0;');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE tasks ADD COLUMN attachments TEXT;');
  } catch (e) {}

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
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO muqeem_residents (
        iqama_number, full_name, gender, nationality, occupation,
        passport_number, passport_expiry, iqama_issue_date,
        iqama_expiry_gregorian, iqama_expiry_hijri, birth_date,
        is_outside_ksa, employer_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const row of data) {
      const iqama = String(row['رقم الاقامة'] || '').trim();
      if (!iqama) continue;
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
  } catch (err) {
    console.error('Could not auto-seed muqeem residents:', err.message);
  }
}

initSchema();

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
