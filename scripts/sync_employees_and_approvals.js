// scripts/sync_employees_and_approvals.js
const xlsx = require('xlsx');
const path = require('node:path');
const fs = require('node:fs');
const { query, run, get } = require('../server/database/db');

function syncEmployeesAndApprovals() {
  const rootDir = path.resolve(__dirname, '..');
  const excelPath = path.join(rootDir, 'قاعدة البيانات وسير الموافقات.xlsx');

  if (!fs.existsSync(excelPath)) {
    throw new Error('ملف قاعدة البيانات وسير الموافقات غير موجود');
  }

  console.log('Reading Excel:', excelPath);
  const wb = xlsx.readFile(excelPath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Map all managers by normalized name to their employee ID
  const allEmps = query('SELECT id, emp_code, full_name_ar, national_id FROM employees');
  const managerMap = new Map();

  const normalize = (str) => {
    if (!str) return '';
    return String(str).trim()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/\s+/g, ' ');
  };

  allEmps.forEach(e => {
    managerMap.set(normalize(e.full_name_ar), e);
  });

  console.log('Loaded employee records in DB:', allEmps.length);

  const empsByNid = new Map();
  const empsByName = new Map();
  allEmps.forEach(e => {
    if (e.national_id) empsByNid.set(String(e.national_id).trim(), e);
    empsByName.set(normalize(e.full_name_ar), e);
  });

  let updatedCount = 0;
  let managerAssignedCount = 0;

  for (let i = 5; i < data.length; i++) {
    const r = data[i];
    if (!r || !r[1]) continue;

    const rawName = String(r[1]).trim();
    const rawNid = r[2] ? String(r[2]).trim() : '';

    let emp = empsByNid.get(rawNid) || empsByName.get(normalize(rawName));
    if (!emp) {
      console.warn(`Row ${i}: Could not find employee in DB: ${rawName} (${rawNid})`);
      continue;
    }

    const jobTitle = r[6] ? String(r[6]).trim() : null;
    const phone = r[7] ? String(r[7]).trim() : null;
    const email = r[8] ? String(r[8]).trim() : null;
    const joinDate = r[9] ? String(r[9]).trim() : null;
    const leaveBalance = r[10] !== undefined && r[10] !== null && r[10] !== '' ? Number(r[10]) : null;
    const section = r[13] ? String(r[13]).trim() : null;
    const basicSalary = r[14] !== undefined && r[14] !== null && r[14] !== '' ? Number(r[14]) : null;
    const housing = r[15] !== undefined && r[15] !== null && r[15] !== '' ? Number(r[15]) : null;
    const transport = r[16] !== undefined && r[16] !== null && r[16] !== '' ? Number(r[16]) : null;
    const otherAllow = r[17] !== undefined && r[17] !== null && r[17] !== '' ? Number(r[17]) : null;
    const iban = r[18] ? String(r[18]).trim() : null;
    const iqamaExpiry = r[19] ? String(r[19]).trim() : null;
    const rawMgrName = r[20] ? String(r[20]).trim() : null;

    let managerId = null;
    if (rawMgrName) {
      const matchedMgr = managerMap.get(normalize(rawMgrName));
      if (matchedMgr) {
        managerId = matchedMgr.id;
        managerAssignedCount++;
      } else {
        console.warn(`Manager "${rawMgrName}" not matched for ${rawName}`);
      }
    }

    run(`
      UPDATE employees SET
        job_title_ar = COALESCE(?, job_title_ar),
        phone = COALESCE(?, phone),
        email = COALESCE(?, email),
        join_date = COALESCE(?, join_date),
        annual_leave_balance = COALESCE(?, annual_leave_balance),
        section = COALESCE(?, section),
        basic_salary = COALESCE(?, basic_salary),
        housing_allowance = COALESCE(?, housing_allowance),
        transport_allowance = COALESCE(?, transport_allowance),
        other_allowance = COALESCE(?, other_allowance),
        iban = COALESCE(?, iban),
        iqama_expiry = COALESCE(?, iqama_expiry),
        direct_manager_name = ?,
        manager_id = ?
      WHERE id = ?
    `, [
      jobTitle, phone, email, joinDate, leaveBalance, section,
      basicSalary, housing, transport, otherAllow, iban, iqamaExpiry,
      rawMgrName, managerId, emp.id
    ]);

    updatedCount++;
  }

  console.log(`Successfully synced ${updatedCount} employees from approvals sheet.`);
  console.log(`Assigned direct managers: ${managerAssignedCount}`);

  // Verify Rule #1
  const activeCount = query("SELECT count(*) as c FROM employees WHERE status = 'نشط'")[0].c;
  const boardCount = query("SELECT count(*) as c FROM employees WHERE emp_code IN ('JM-0001', 'JM-0002', 'JM-0003')")[0].c;
  const userCount = query("SELECT count(*) as c FROM users")[0].c;

  console.log(`Verification:`);
  console.log(`- Active operational employees: ${activeCount} (Expected: 111)`);
  console.log(`- Board members in operational pool: ${boardCount} (Expected: 0)`);
  console.log(`- Users in system: ${userCount} (Expected: 14)`);

  if (activeCount !== 111 || boardCount !== 0 || userCount !== 14) {
    throw new Error('RULE #1 VIOLATION! Database integrity constraint failed.');
  }
  console.log('✓ Rule #1 verified with 100% compliance.');
}

syncEmployeesAndApprovals();
