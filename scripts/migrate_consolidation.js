const fs = require('node:fs');
const path = require('node:path');
const xlsx = require('xlsx');
const { db } = require('../server/database/db');

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

console.log('--- Starting Migration & Consolidation ---');

// 1. Schema Updates
console.log('1. Ensuring DB Schema & Tables...');

db.exec(`
  CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_id INTEGER,
    branch_id INTEGER,
    name_ar TEXT NOT NULL,
    name_en TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS employee_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    emp_id INTEGER NOT NULL,
    doc_type TEXT NOT NULL,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER DEFAULT 0,
    mime_type TEXT,
    uploaded_by INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_emp_docs_emp ON employee_documents(emp_id);
`);

const alterCols = [
  'ALTER TABLE employees ADD COLUMN opening_leave_balance REAL DEFAULT 0;',
  'ALTER TABLE employees ADD COLUMN accrual_start_date TEXT DEFAULT "2026-11-05";',
  'ALTER TABLE employees ADD COLUMN monthly_accrual_rate REAL DEFAULT 1.75;',
  'ALTER TABLE employees ADD COLUMN photo_url TEXT;',
  'ALTER TABLE employees ADD COLUMN termination_date TEXT;',
  'ALTER TABLE employees ADD COLUMN termination_reason TEXT;',
  'ALTER TABLE employees ADD COLUMN section_id INTEGER;',
  'ALTER TABLE leaves ADD COLUMN replacement_emp_id INTEGER;',
  'ALTER TABLE leaves ADD COLUMN rejection_reason TEXT;',
  'ALTER TABLE requests ADD COLUMN replacement_emp_id INTEGER;',
  'ALTER TABLE requests ADD COLUMN target_dept_id INTEGER;',
  'ALTER TABLE requests ADD COLUMN target_branch_id INTEGER;',
  'ALTER TABLE requests ADD COLUMN target_section_id INTEGER;',
  'ALTER TABLE requests ADD COLUMN transfer_reason TEXT;',
  'ALTER TABLE requests ADD COLUMN rejection_reason TEXT;'
];

alterCols.forEach(cmd => {
  try { db.exec(cmd); } catch (e) {}
});

// 2. Setup Official 6 Departments & 5 Branches
console.log('2. Setting up 6 Departments and 5 Branches...');

const officialDepartments = [
  { code: 'DEPT-HQ', name_ar: 'الإدارة الرئيسية', name_en: 'Headquarters', manager_name: 'عبدالملك سعيد الشريف' },
  { code: 'DEPT-BRANCHES', name_ar: 'إدارة الفروع', name_en: 'Branches Management', manager_name: 'علي سعد حسين البشري' },
  { code: 'DEPT-CONTRACTS', name_ar: 'إدارة المقاولات', name_en: 'Contracting Department', manager_name: 'فارس عبدالرحمن القحطاني' },
  { code: 'DEPT-WH', name_ar: 'إدارة المستودع الرئيسي', name_en: 'Central Warehouse', manager_name: 'هاني علي شامي عسيري' },
  { code: 'DEPT-MAINT', name_ar: 'إدارة الصيانة والورشة', name_en: 'Maintenance & Workshop', manager_name: 'فيروز علي جان محمد' },
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

officialDepartments.forEach(d => {
  deptStmt.run(d.code, d.name_ar, d.name_en, d.manager_name);
});

// Map of departments by name
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

officialBranches.forEach(b => {
  branchStmt.run(b.code, b.name_ar, b.name_en, b.city, b.is_main, b.manager_name);
});

const allBranches = db.prepare('SELECT id, code, name_ar FROM branches').all();
const branchMap = {};
allBranches.forEach(b => {
  branchMap[b.name_ar.trim()] = b.id;
  branchMap[b.code.trim()] = b.id;
});

// 18 Sections
console.log('3. Setting up 18 Sections...');
const officialSections = [
  'الصالات ومنافذ البيع', 'المخبز', 'الموارد البشرية', 'الهندسية',
  'الصناديق والخزنة', 'الخدمات والدعم الإداري', 'المشتريات', 'المقاولات',
  'تقنية المعلومات', 'مشرفي الصالات', 'المالية', 'المستودعات',
  'الورشة والصيانة', 'النقل', 'محطة المرح الترفيهي', 'الخضار والفواكه',
  'الأمن', 'الأجبان'
];

const secStmt = db.prepare(`
  INSERT OR IGNORE INTO sections (name_ar) VALUES (?)
`);
officialSections.forEach(s => secStmt.run(s));

const allSections = db.prepare('SELECT id, name_ar FROM sections').all();
const sectionMap = {};
allSections.forEach(s => {
  sectionMap[s.name_ar.trim()] = s.id;
});

// 4. Read Excel and Sync Employees
console.log('4. Syncing 108 Employees from Excel...');
const excelPath = path.join(__dirname, '..', 'قاعدة بيانات موظفي جوهرة المجد .xlsx');
const wb = xlsx.readFile(excelPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const excelRows = xlsx.utils.sheet_to_json(ws);

const employeesByCode = new Map();
for (const row of excelRows) {
  const code = String(row['الرقم الوظيفي'] || '').trim();
  if (!code) continue;
  employeesByCode.set(code, row);
}

// Map Excel Department to Dept ID & Branch ID
function mapDeptAndBranch(deptStr) {
  if (!deptStr || deptStr === 'لايوجد') {
    return { deptId: deptMap['الإدارة الرئيسية'], branchId: branchMap['المقر الرئيسي'] };
  }
  const s = deptStr.trim();
  if (s.includes('حي الموظفين')) {
    return { deptId: deptMap['إدارة الفروع'], branchId: branchMap['حي الموظفين'] };
  }
  if (s.includes('سيتي بارك')) {
    return { deptId: deptMap['إدارة الفروع'], branchId: branchMap['سيتي بارك'] };
  }
  if (s.includes('الحبيل')) {
    return { deptId: deptMap['إدارة الفروع'], branchId: branchMap['الحبيل'] };
  }
  if (s.includes('وسط البلد')) {
    return { deptId: deptMap['إدارة الفروع'], branchId: branchMap['مجمع وسط البلد'] };
  }
  if (s.includes('المقاولات')) {
    return { deptId: deptMap['إدارة المقاولات'], branchId: branchMap['المقر الرئيسي'] };
  }
  if (s.includes('المستودع الرئيسي')) {
    return { deptId: deptMap['إدارة المستودع الرئيسي'], branchId: branchMap['المقر الرئيسي'] };
  }
  if (s.includes('الصيانة والورشة')) {
    return { deptId: deptMap['إدارة الصيانة والورشة'], branchId: branchMap['المقر الرئيسي'] };
  }
  if (s.includes('الهندسية')) {
    return { deptId: deptMap['الإدارة الهندسية'], branchId: branchMap['المقر الرئيسي'] };
  }
  return { deptId: deptMap['الإدارة الرئيسية'], branchId: branchMap['المقر الرئيسي'] };
}

// Prefix all existing emp_codes with 'TMP-' to avoid UNIQUE collision during reallocation
console.log('Temporarily prefixing existing employee codes with TMP- to avoid collision...');
db.exec("UPDATE employees SET emp_code = 'TMP-' || id || '-' || emp_code WHERE emp_code NOT LIKE 'TMP-%';");

// Identify terminated employees
const existingInDb = db.prepare('SELECT id, emp_code, full_name_ar, national_id FROM employees').all();
const existingNidMap = new Map();
const existingNameMap = new Map();
existingInDb.forEach(e => {
  if (e.national_id) existingNidMap.set(e.national_id.trim(), e);
  if (e.full_name_ar) existingNameMap.set(e.full_name_ar.trim(), e);
});

console.log('Identifying and tagging terminated employees...');
for (const dbEmp of existingInDb) {
  let isExcelEmp = false;
  for (const [code, r] of employeesByCode.entries()) {
    const rNid = String(r['رقم الهوية / الإقامة'] || '').trim();
    const rName = String(r['الاسم الرباعي'] || '').trim();
    if ((rNid && rNid !== 'لايوجد' && rNid === dbEmp.national_id) || (rName && rName === dbEmp.full_name_ar)) {
      isExcelEmp = true;
      break;
    }
  }
  if (!isExcelEmp) {
    const cleanTerminatedCode = dbEmp.emp_code.replace(/^TMP-\d+-/, '');
    console.log(`Setting employee ${cleanTerminatedCode} (${dbEmp.full_name_ar}) to 'منتهي الخدمة'`);
    db.prepare(`
      UPDATE employees SET
        emp_code = ?,
        status = 'منتهي الخدمة',
        termination_date = COALESCE(termination_date, '2026-10-31'),
        termination_reason = COALESCE(termination_reason, 'انتهاء عقد')
      WHERE id = ?
    `).run(cleanTerminatedCode, dbEmp.id);
  }
}

// Upsert the 108 Employees
const insertEmpStmt = db.prepare(`
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
`);

const updateEmpStmt = db.prepare(`
  UPDATE employees SET
    emp_code = ?,
    full_name_ar = ?,
    full_name_en = ?,
    national_id = ?,
    nationality = ?,
    is_saudi = ?,
    gender = ?,
    phone = ?,
    email = ?,
    department_id = ?,
    branch_id = ?,
    section = ?,
    section_id = ?,
    job_title_ar = ?,
    job_title_en = ?,
    join_date = ?,
    basic_salary = ?,
    housing_allowance = ?,
    transport_allowance = ?,
    other_allowance = ?,
    iban = ?,
    iqama_expiry = ?,
    direct_manager_name = ?,
    opening_leave_balance = ?,
    accrual_start_date = '2026-11-05',
    monthly_accrual_rate = ?,
    annual_leave_balance = ?,
    status = 'نشط'
  WHERE id = ?
`);

for (const [code, row] of employeesByCode.entries()) {
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

  // Match existing record
  let existingEmp = null;
  if (nationalId && existingNidMap.has(nationalId)) {
    existingEmp = existingNidMap.get(nationalId);
  } else if (existingNameMap.has(nameAr)) {
    existingEmp = existingNameMap.get(nameAr);
  }

  if (existingEmp) {
    updateEmpStmt.run(
      code, nameAr, jobTitleEn, nationalId, nationality,
      isSaudi, gender, phone, email, deptId, branchId, sectionText,
      sectionId, jobTitleAr, jobTitleEn, joinDate, basicSalary,
      housingAllowance, transportAllowance, otherAllowance, iban,
      iqamaExpiry, directMgrName, openingLeaveBalance,
      monthlyAccrualRate, annualLeaveBalance, existingEmp.id
    );
  } else {
    insertEmpStmt.run(
      code, nameAr, jobTitleEn, nationalId, nationality,
      isSaudi, gender, phone, email, deptId, branchId, sectionText,
      sectionId, jobTitleAr, jobTitleEn, joinDate, basicSalary,
      housingAllowance, transportAllowance, otherAllowance, iban,
      iqamaExpiry, directMgrName, openingLeaveBalance,
      '2026-11-05', monthlyAccrualRate, annualLeaveBalance
    );
  }
}

// 5. Connect Direct Managers strictly
console.log('5. Mapping Direct Managers by ID...');
const allActiveEmps = db.prepare("SELECT id, emp_code, full_name_ar, direct_manager_name FROM employees WHERE status = 'نشط'").all();
const activeByName = new Map();
allActiveEmps.forEach(e => {
  activeByName.set(e.full_name_ar.trim(), e.id);
});
// Aliases for managers
if (activeByName.has('عبدالملك سعيد الشريف')) {
  activeByName.set('عبدالملك الشريف', activeByName.get('عبدالملك سعيد الشريف'));
}
if (activeByName.has('تامر جمعه احمد عبدالله')) {
  activeByName.set('تامر جمعة احمد عبدالله', activeByName.get('تامر جمعه احمد عبدالله'));
}

const updateMgrStmt = db.prepare('UPDATE employees SET manager_id = ? WHERE id = ?');
let mappedCount = 0;
for (const emp of allActiveEmps) {
  if (emp.direct_manager_name && activeByName.has(emp.direct_manager_name.trim())) {
    const mgrId = activeByName.get(emp.direct_manager_name.trim());
    if (mgrId !== emp.id) { // Prevent self-referencing
      updateMgrStmt.run(mgrId, emp.id);
      mappedCount++;
    }
  }
}
console.log(`Mapped ${mappedCount} active employees to their direct managers.`);

// 6. Connect Users to Employees
console.log('6. Re-linking Users to Employees...');
const userLinkMap = [
  { username: 'abdulmalik', name: 'عبدالملك سعيد الشريف' },
  { username: 'shama.asiri', name: 'شامة علي  محمد عسيري' },
  { username: 'faris.qahtani', name: 'فارس عبدالرحمن القحطاني' },
  { username: 'khaled.raee', name: 'خالد احمد محمد راعي' },
  { username: 'ali.boshra', name: 'علي سعد حسين البشري' },
  { username: 'ahmed.yeanallah', name: 'احمد عبدالرحمن علي يعن الله' },
  { username: 'fayrouz.ali', name: 'فيروز علي جان محمد' },
  { username: 'tamer.gomaa', name: 'تامر جمعه احمد عبدالله' },
  { username: 'hani.asiri', name: 'هاني علي شامي عسيري' },
  { username: 'fahmi.baameer', name: 'فهمي سالم عبيد باعمير' },
  { username: 'fahd.aowari', name: 'فهد إبراهيم جعفر الاعوري' },
  { username: 'hani.qahtani', name: 'هاني عبدالرحمن صالح القحطاني' }
];

const updateUserStmt = db.prepare('UPDATE users SET emp_id = ? WHERE username = ?');
userLinkMap.forEach(u => {
  const emp = db.prepare('SELECT id FROM employees WHERE full_name_ar = ? OR full_name_ar LIKE ?').get(u.name, `%${u.name.split(' ')[0]}%${u.name.split(' ')[1]}%`);
  if (emp) {
    updateUserStmt.run(emp.id, u.username);
    console.log(`Linked user ${u.username} to employee ID ${emp.id}`);
  }
});

// 7. Verify Counts
const activeCount = db.prepare("SELECT count(*) as c FROM employees WHERE status = 'نشط'").get().c;
const terminatedCount = db.prepare("SELECT count(*) as c FROM employees WHERE status = 'منتهي الخدمة'").get().c;
const totalCount = db.prepare("SELECT count(*) as c FROM employees").get().c;

console.log('--- Migration Summary ---');
console.log(`Active Employees (على رأس العمل): ${activeCount} (Expected: 108)`);
console.log(`Terminated Employees (منتهي الخدمة): ${terminatedCount} (Expected: 5)`);
console.log(`Total Employees in DB: ${totalCount} (Expected: 113)`);
console.log('--- Migration Completed Successfully ---');
