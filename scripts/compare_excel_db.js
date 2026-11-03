// scripts/compare_excel_db.js
const xlsx = require('xlsx');
const db = require('../server/database/db');

const wb = xlsx.readFile('./قاعدة البيانات وسير الموافقات.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

console.log('--- EXCEL ROWS SCAN ---');
const excelEmps = [];
for (let i = 5; i < data.length; i++) {
  const row = data[i];
  if (!row || !row[1]) continue;
  excelEmps.push({
    rowIdx: i + 1,
    emp_code: row[0] ? String(row[0]).trim() : null,
    full_name_ar: String(row[1]).trim(),
    national_id: row[2] ? String(row[2]).trim() : null,
    nationality: row[3] ? String(row[3]).trim() : '',
    department: row[4] ? String(row[4]).trim() : '',
    branch: row[5] ? String(row[5]).trim() : '',
    job_title: row[6] ? String(row[6]).trim() : '',
    phone: row[7] ? String(row[7]).trim() : null,
    email: row[8] ? String(row[8]).trim() : null,
    join_date: row[9],
    leave_balance: row[10] !== undefined ? Number(row[10]) : 0,
    gross_salary: row[11] !== undefined ? Number(row[11]) : 0,
    gender: row[12] ? String(row[12]).trim() : '',
    section: row[13] ? String(row[13]).trim() : '',
    basic_salary: row[14] !== undefined ? Number(row[14]) : 0,
    housing: row[15] !== undefined ? Number(row[15]) : 0,
    transport: row[16] !== undefined ? Number(row[16]) : 0,
    other: row[17] !== undefined ? Number(row[17]) : 0,
    iban: row[18] ? String(row[18]).trim() : '',
    iqama_expiry: row[19] || null,
    direct_manager: row[20] ? String(row[20]).trim() : ''
  });
}

console.log(`Total valid employee rows in Excel: ${excelEmps.length}`);

// Compare with DB employees
const dbEmps = db.query('SELECT * FROM employees');
console.log(`Total employees in DB: ${dbEmps.length}`);

let matchedCount = 0;
let unmatchedExcel = [];
let matchedByCode = 0;
let matchedByNationalId = 0;
let matchedByName = 0;

excelEmps.forEach(ee => {
  let dbMatch = null;
  if (ee.emp_code) {
    dbMatch = dbEmps.find(de => de.emp_code === ee.emp_code);
    if (dbMatch) matchedByCode++;
  }
  if (!dbMatch && ee.national_id) {
    dbMatch = dbEmps.find(de => de.national_id === ee.national_id);
    if (dbMatch) matchedByNationalId++;
  }
  if (!dbMatch) {
    const norm = s => (s || '').replace(/\s+/g, ' ').replace(/[أإآا]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim();
    dbMatch = dbEmps.find(de => norm(de.full_name_ar) === norm(ee.full_name_ar));
    if (dbMatch) matchedByName++;
  }

  if (dbMatch) {
    matchedCount++;
  } else {
    unmatchedExcel.push(ee);
  }
});

console.log(`Matched: ${matchedCount} / ${excelEmps.length} (By Code: ${matchedByCode}, By NatID: ${matchedByNationalId}, By Name: ${matchedByName})`);
if (unmatchedExcel.length > 0) {
  console.log('Unmatched Excel employees:', unmatchedExcel.map(x => `${x.full_name_ar} (Code: ${x.emp_code}, NatID: ${x.national_id})`));
}

// Find DB emps not in Excel
const norm = s => (s || '').replace(/\s+/g, ' ').replace(/[أإآا]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim();
const dbOnly = dbEmps.filter(de => {
  return !excelEmps.some(ee => (ee.emp_code && ee.emp_code === de.emp_code) || (ee.national_id && ee.national_id === de.national_id) || norm(ee.full_name_ar) === norm(de.full_name_ar));
});
console.log(`DB employees not in Excel (${dbOnly.length}):`, dbOnly.map(x => `${x.emp_code} - ${x.full_name_ar} (${x.job_title_ar})`));

// Check unique Direct Managers in Excel
const managersInExcel = {};
excelEmps.forEach(e => {
  const m = e.direct_manager || 'None';
  managersInExcel[m] = (managersInExcel[m] || 0) + 1;
});
console.log('\nDirect Managers in Excel and subordinate counts:');
Object.keys(managersInExcel).sort().forEach(m => console.log(`  - "${m}": ${managersInExcel[m]} subordinates`));

// Check unique Sections in Excel
const sectionsInExcel = {};
excelEmps.forEach(e => {
  const s = e.section || 'None';
  sectionsInExcel[s] = (sectionsInExcel[s] || 0) + 1;
});
console.log('\nSections in Excel:');
Object.keys(sectionsInExcel).sort().forEach(s => console.log(`  - "${s}": ${sectionsInExcel[s]} employees`));
