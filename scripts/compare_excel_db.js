const xlsx = require('xlsx');
const path = require('node:path');
const { db } = require('../server/database/db');

const excelPath = path.join(__dirname, '..', 'قاعدة بيانات موظفي جوهرة المجد .xlsx');
const wb = xlsx.readFile(excelPath);
const sheetName = wb.SheetNames[0];
const ws = wb.Sheets[sheetName];
const rows = xlsx.utils.sheet_to_json(ws);

console.log('Total rows in Excel:', rows.length);
console.log('Columns in first row:', Object.keys(rows[0] || {}));

// Let's inspect the first 2 rows
console.log('Row 0:', rows[0]);
console.log('Row 1:', rows[1]);

// Let's check employee codes and names
const excelCodes = new Set();
const excelDepts = new Set();
const excelBranches = new Set();
const excelSections = new Set();
const excelManagers = new Set();

rows.forEach(r => {
  const code = r['الرقم الوظيفي'] || r['كود الموظف'] || r['emp_code'];
  if (code) excelCodes.add(String(code).trim());
  const dept = r['الإدارة'] || r['الادارة'] || r['department'];
  if (dept) excelDepts.add(String(dept).trim());
  const branch = r['الفرع'] || r['branch'];
  if (branch) excelBranches.add(String(branch).trim());
  const section = r['القسم'] || r['section'];
  if (section) excelSections.add(String(section).trim());
  const mgr = r['المدير المباشر'] || r['direct_manager'];
  if (mgr) excelManagers.add(String(mgr).trim());
});

console.log('Excel Unique Codes count:', excelCodes.size);
console.log('Excel Departments:', Array.from(excelDepts));
console.log('Excel Branches:', Array.from(excelBranches));
console.log('Excel Sections:', Array.from(excelSections));
console.log('Excel Managers:', Array.from(excelManagers));

// Check DB employees
const dbEmps = db.prepare('SELECT id, emp_code, full_name_ar, status FROM employees').all();
console.log('DB total employees:', dbEmps.length);
const notInExcel = dbEmps.filter(e => !excelCodes.has(e.emp_code));
console.log('DB employees NOT in Excel:', notInExcel);
