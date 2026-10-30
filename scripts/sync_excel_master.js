// scripts/sync_excel_master.js
const xlsx = require('xlsx');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const usersModule = require('../server/modules/users');

const excelPath = 'C:/Users/alnwa/.gemini/antigravity/brain/592c605b-19a2-4a29-9e0a-591b298c485a/.user_uploaded/media_1793397778726_2d91ffdf.xlsx';
const dbPath = path.join(__dirname, '../server/database/hrms.db');
const db = new DatabaseSync(dbPath);

console.log('=== Starting Master Data & Manager Approval Sync ===');

function normalizeArabic(s) {
  if (!s) return '';
  return String(s).trim().replace(/ة/g, 'ه').replace(/[أإآ]/g, 'ا').replace(/\s+/g, ' ');
}

function parseExcelDate(val) {
  if (!val) return null;
  if (typeof val === 'number') {
    const d = new Date(Math.round((val - 25569) * 86400 * 1000));
    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
  }
  if (typeof val === 'string') {
    const s = val.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toISOString().split('T')[0];
  }
  return null;
}

// 1. Ensure Department 'إدارة الدعم الإداري والمساندة' exists
let supportDept = db.prepare('SELECT id, name_ar FROM departments WHERE name_ar LIKE ? OR name_ar LIKE ?').get('%الدعم الإداري%', '%الدعم الاداري%');
if (!supportDept) {
  db.prepare('INSERT INTO departments (code, name_ar, name_en) VALUES (?, ?, ?)').run('ADM-SUP', 'إدارة الدعم الإداري والمساندة', 'Administrative Support Department');
  supportDept = db.prepare('SELECT id, name_ar FROM departments WHERE name_ar = ?').get('إدارة الدعم الإداري والمساندة');
  console.log('Created department: إدارة الدعم الإداري والمساندة with ID:', supportDept.id);
} else {
  console.log('Department already exists:', supportDept.name_ar, 'ID:', supportDept.id);
}

// Load lookup dictionaries
const depts = db.prepare('SELECT id, name_ar FROM departments').all();
const branches = db.prepare('SELECT id, name_ar FROM branches').all();
const allEmps = db.prepare('SELECT id, emp_code, full_name_ar, national_id FROM employees').all();

function findDeptId(name) {
  if (!name) return null;
  const norm = normalizeArabic(name);
  const found = depts.find(d => normalizeArabic(d.name_ar) === norm || normalizeArabic(d.name_ar).includes(norm) || norm.includes(normalizeArabic(d.name_ar)));
  return found ? found.id : null;
}

function findBranchId(name) {
  if (!name) return null;
  const norm = normalizeArabic(name);
  const found = branches.find(b => normalizeArabic(b.name_ar) === norm || normalizeArabic(b.name_ar).includes(norm) || norm.includes(normalizeArabic(b.name_ar)));
  return found ? found.id : null;
}

function findEmp(name, idNumber) {
  if (idNumber) {
    const byId = allEmps.find(e => String(e.national_id).trim() === String(idNumber).trim());
    if (byId) return byId;
  }
  const norm = normalizeArabic(name);
  const exact = allEmps.find(e => normalizeArabic(e.full_name_ar) === norm);
  if (exact) return exact;
  return allEmps.find(e => {
    const eNorm = normalizeArabic(e.full_name_ar);
    return eNorm.includes(norm) || norm.includes(eNorm);
  });
}

function resolveManager(mgrName) {
  if (!mgrName) return { id: null, name: null };
  const norm = normalizeArabic(mgrName);

  if (norm.includes('هاني عبدالرحمن صالح القحطاني')) {
    const m = allEmps.find(e => e.emp_code === 'JM-1041' || normalizeArabic(e.full_name_ar) === norm);
    return m ? { id: m.id, name: m.full_name_ar } : { id: null, name: mgrName };
  }
  if (norm === normalizeArabic('عبدالرحمن صالح القحطاني')) {
    const m = allEmps.find(e => e.emp_code === 'JM-0001');
    return m ? { id: m.id, name: m.full_name_ar } : { id: null, name: mgrName };
  }
  if (norm.includes('عبدالملك سعيد الشريف')) {
    const m = allEmps.find(e => e.emp_code === 'JM-1000' || normalizeArabic(e.full_name_ar).includes('عبدالملك سعيد'));
    return m ? { id: m.id, name: m.full_name_ar } : { id: null, name: mgrName };
  }

  const exact = allEmps.find(e => normalizeArabic(e.full_name_ar) === norm);
  if (exact) return { id: exact.id, name: exact.full_name_ar };

  const sub = allEmps.find(e => {
    const eNorm = normalizeArabic(e.full_name_ar);
    return eNorm.includes(norm) || norm.includes(eNorm);
  });
  if (sub) return { id: sub.id, name: sub.full_name_ar };

  return { id: null, name: mgrName };
}

// Read Excel
const wb = xlsx.readFile(excelPath);
const sheet = wb.Sheets['بيانات موظفي جوهرة المجد'];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
const dataRows = rows.slice(5).filter(r => r && r[1]);

console.log('Total employee rows in Excel:', dataRows.length);

const updateStmt = db.prepare(`
  UPDATE employees SET
    full_name_ar = ?,
    national_id = ?,
    nationality = ?,
    is_saudi = ?,
    department_id = ?,
    branch_id = ?,
    job_title_ar = ?,
    phone = ?,
    email = ?,
    join_date = ?,
    contract_start = ?,
    annual_leave_balance = ?,
    gender = ?,
    section = ?,
    basic_salary = ?,
    housing_allowance = ?,
    transport_allowance = ?,
    other_allowance = ?,
    iban = ?,
    iqama_expiry = ?,
    manager_id = ?,
    direct_manager_name = ?
  WHERE id = ?
`);

let updatedCount = 0;
dataRows.forEach(r => {
  const rawJobNo = r[0];
  const name = String(r[1]).trim();
  const natId = r[2] ? String(r[2]).trim() : null;
  const nationality = r[3] ? String(r[3]).trim() : 'سعودي';
  const isSaudi = nationality.includes('سعود') ? 1 : 0;
  const deptName = r[4] ? String(r[4]).trim() : null;
  const deptId = findDeptId(deptName);
  const branchName = r[5] ? String(r[5]).trim() : null;
  const branchId = findBranchId(branchName);
  const jobTitle = r[6] ? String(r[6]).trim() : '';
  const phone = r[7] ? String(r[7]).trim() : '';
  const email = r[8] ? String(r[8]).trim() : '';
  const joinDate = parseExcelDate(r[9]);
  const leaveBalance = typeof r[10] === 'number' ? r[10] : (Number(r[10]) || 21);
  const rawGender = r[12] ? String(r[12]).trim() : '';
  const gender = rawGender.includes('انث') || rawGender.includes('أنث') || rawGender === 'F' ? 'F' : 'M';
  const section = r[13] ? String(r[13]).trim() : '';
  const basicSalary = typeof r[14] === 'number' ? r[14] : (Number(r[14]) || 0);
  const housingAllowance = typeof r[15] === 'number' ? r[15] : (Number(r[15]) || 0);
  const transportAllowance = typeof r[16] === 'number' ? r[16] : (Number(r[16]) || 0);
  const otherAllowance = typeof r[17] === 'number' ? r[17] : (Number(r[17]) || 0);
  const iban = r[18] ? String(r[18]).trim() : '';
  const iqamaExpiry = parseExcelDate(r[19]);
  const rawManagerName = r[20] ? String(r[20]).trim() : null;

  const emp = findEmp(name, natId);
  if (!emp) {
    console.error('NOT FOUND in DB:', name, natId);
    return;
  }

  const mgr = resolveManager(rawManagerName);
  // If no manager is specified in Excel (e.g. Abdulmalik), report to Chairman
  let finalMgrId = mgr.id;
  let finalMgrName = mgr.name;
  if (!finalMgrId && emp.emp_code === 'JM-1000') {
    const chairman = allEmps.find(e => e.emp_code === 'JM-0001');
    finalMgrId = chairman ? chairman.id : null;
    finalMgrName = chairman ? chairman.full_name_ar : 'عبدالرحمن صالح القحطاني';
  }

  updateStmt.run(
    name,
    natId,
    nationality,
    isSaudi,
    deptId,
    branchId,
    jobTitle,
    phone,
    email,
    joinDate,
    joinDate, // contract_start
    leaveBalance,
    gender,
    section,
    basicSalary,
    housingAllowance,
    transportAllowance,
    otherAllowance,
    iban,
    iqamaExpiry,
    finalMgrId,
    finalMgrName,
    emp.id
  );
  updatedCount++;
});

console.log('Successfully updated employees count:', updatedCount);

// 3. Link Board Members cleanly
const chairman = allEmps.find(e => e.emp_code === 'JM-0001');
if (chairman) {
  db.prepare('UPDATE employees SET manager_id = NULL, direct_manager_name = NULL WHERE id = ?').run(chairman.id);
  const viceChair = allEmps.find(e => e.emp_code === 'JM-0002');
  if (viceChair) db.prepare('UPDATE employees SET manager_id = ?, direct_manager_name = ? WHERE id = ?').run(chairman.id, chairman.full_name_ar, viceChair.id);
  const gm = allEmps.find(e => e.emp_code === 'JM-0003');
  if (gm) db.prepare('UPDATE employees SET manager_id = ?, direct_manager_name = ? WHERE id = ?').run(chairman.id, chairman.full_name_ar, gm.id);
  const projectsMgr = allEmps.find(e => e.emp_code === 'JM-0004');
  if (projectsMgr) db.prepare('UPDATE employees SET manager_id = ?, direct_manager_name = ? WHERE id = ?').run(chairman.id, chairman.full_name_ar, projectsMgr.id);
}

// 4. Create Manager Accounts in users table
const managersToCreate = [
  { name: 'خالد احمد محمد راعي', username: 'khaled.raee', email: 'khaled.raee@jalmajd.com', code: 'JM-1080' },
  { name: 'علي سعد حسين البشري', username: 'ali.boshra', email: 'ali.boshra@jalmajd.com', code: 'JM-1104' },
  { name: 'احمد عبدالرحمن علي يعن الله', username: 'ahmed.yeanallah', email: 'ahmed.yeanallah@jalmajd.com', code: 'JM-1075' },
  { name: 'فيروز علي جان محمد', username: 'fayrouz.ali', email: 'fayrouz.ali@jalmajd.com', code: 'JM-1147' },
  { name: 'تامر جمعه احمد عبدالله', username: 'tamer.gomaa', email: 'tamer.gomaa@jalmajd.com', code: 'JM-1151' },
  { name: 'هاني علي شامي عسيري', username: 'hani.asiri', email: 'hani.asiri@jalmajd.com', code: 'JM-1136' },
  { name: 'ريان يحي عبدالله', username: 'rayan.yahya', email: 'rayan.yahya@jalmajd.com', code: 'JM-1116' },
  { name: 'فهمي سالم عبيد باعمير', username: 'fahmi.baameer', email: 'fahmi.baameer@jalmajd.com', code: 'JM-1123' },
  { name: 'فهد إبراهيم جعفر الاعوري', username: 'fahd.aowari', email: 'fahd.aowari@jalmajd.com', code: 'JM-1159' },
  { name: 'هاني عبدالرحمن صالح القحطاني', username: 'hani.qahtani', email: 'hani.qahtani@jalmajd.com', code: 'JM-1041' }
];

const checkUserStmt = db.prepare('SELECT id FROM users WHERE username = ? OR full_name = ?');
const insertUserStmt = db.prepare(`
  INSERT INTO users (username, password, full_name, email, role, permissions, emp_id, is_active)
  VALUES (?, ?, ?, ?, ?, ?, ?, 1)
`);
const updateUserEmpStmt = db.prepare('UPDATE users SET emp_id = ? WHERE id = ?');

const mgrPerms = JSON.stringify(['requests', 'approvals', 'employees', 'attendance', 'tasks', 'reports']);

managersToCreate.forEach(m => {
  const emp = findEmp(m.name, null);
  const empId = emp ? emp.id : null;
  const existing = checkUserStmt.get(m.username, m.name);
  if (!existing) {
    insertUserStmt.run(m.username, 'Mgr123', m.name, m.email, 'dept_manager', mgrPerms, empId);
    console.log(`Created manager user: ${m.username} (${m.name}) linked to emp_id: ${empId}`);
  } else {
    if (empId) updateUserEmpStmt.run(empId, existing.id);
    console.log(`Updated existing manager user: ${m.username} with emp_id: ${empId}`);
  }
});

// Also ensure abdulmalik, shama, faris, salih are linked to their live emp_id
usersModule.reconcileUserEmployeeLinks();
usersModule.persistUsersToDisk();

console.log('=== Master Data Synchronization Complete! ===');
