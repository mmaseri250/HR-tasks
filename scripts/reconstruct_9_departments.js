// scripts/reconstruct_9_departments.js
const { db, get, query, run } = require('../server/database/db');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

console.log('=== Reconstructing Organizational Hierarchy to Exactly 9 Departments ===');

const official9Departments = [
  { code: 'DEPT-HQ', name_ar: 'الإدارة الرئيسية', name_en: 'Headquarters', manager_name: 'عبدالملك سعيد الشريف', location: 'المقر الرئيسي - أبها' },
  { code: 'DEPT-BR-CITYPARK', name_ar: 'إدارة الفروع — سيتي بارك', name_en: 'Branches Management — City Park', manager_name: 'هاني عبدالرحمن صالح القحطاني', location: 'مول سيتي بارك - أبها' },
  { code: 'DEPT-BR-MUWADAF', name_ar: 'إدارة الفروع — حي الموظفين', name_en: 'Branches Management — Hay Al-Muwadafeen', manager_name: 'علي سعد حسين البشري', location: 'حي الموظفين - أبها' },
  { code: 'DEPT-BR-DOWNTOWN', name_ar: 'إدارة الفروع — مجمع وسط البلد', name_en: 'Branches Management — Downtown Complex', manager_name: 'احمد عبدالرحمن علي يعن الله', location: 'مجمع وسط البلد - أبها' },
  { code: 'DEPT-BR-HABIL', name_ar: 'إدارة الفروع — الحبيل', name_en: 'Branches Management — Al-Habil', manager_name: 'تامر جمعه احمد عبدالله', location: 'رجال ألمع - الحبيل' },
  { code: 'DEPT-WH', name_ar: 'إدارة المستودع الرئيسي', name_en: 'Main Warehouse Management', manager_name: 'فيروز علي جان محمد', location: 'المستودع المركزي - أبها' },
  { code: 'DEPT-CONTRACTS', name_ar: 'إدارة المقاولات', name_en: 'Contracting Department', manager_name: 'فارس عبدالرحمن القحطاني', location: 'المقر الرئيسي - أبها' },
  { code: 'DEPT-MAINT', name_ar: 'إدارة الصيانة والورشة', name_en: 'Maintenance & Workshop Department', manager_name: 'عبدالملك سعيد الشريف', location: 'الورشة المركزية - أبها' },
  { code: 'DEPT-ENG', name_ar: 'الإدارة الهندسية', name_en: 'Engineering Department', manager_name: 'فارس عبدالرحمن القحطاني', location: 'المقر الرئيسي - أبها' }
];

// 1. Delete all old departments and reset table
run('DELETE FROM departments');

const insertDept = db.prepare(`
  INSERT INTO departments (code, name_ar, name_en, manager_name, location)
  VALUES (?, ?, ?, ?, ?)
`);

official9Departments.forEach(d => {
  insertDept.run(d.code, d.name_ar, d.name_en, d.manager_name, d.location);
});

// Map of name_ar to dept_id
const allDepts = query('SELECT id, code, name_ar FROM departments');
const deptMap = {};
allDepts.forEach(d => {
  deptMap[d.name_ar.trim()] = d.id;
});

console.log('✓ Successfully created 9 distinct departments:', Object.keys(deptMap));

// 2. Read Excel file and update employees
const rootDir = path.join(__dirname, '..');
const excelPath = path.join(rootDir, 'قاعدة بيانات موظفي جوهرة المجد .xlsx');
const wb = xlsx.readFile(excelPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const excelRows = xlsx.utils.sheet_to_json(ws);

const updateEmpDept = db.prepare('UPDATE employees SET department_id = ? WHERE emp_code = ?');

let updatedCount = 0;
excelRows.forEach(row => {
  const code = String(row['الرقم الوظيفي'] || '').trim();
  const deptStr = String(row['الإدارة'] || '').trim();
  if (code && deptMap[deptStr]) {
    updateEmpDept.run(deptMap[deptStr], code);
    updatedCount++;
  }
});

console.log(`✓ Updated department_id for ${updatedCount} employees.`);

// 3. Verify counts dynamically
const results = query(`
  SELECT d.code, d.name_ar, COUNT(e.id) AS emp_count
  FROM departments d
  LEFT JOIN employees e ON d.id = e.department_id AND e.status = 'نشط'
  GROUP BY d.id
  ORDER BY d.id ASC
`);

console.log('=== Dynamic Aggregated Employee Counts per Department ===');
let totalActive = 0;
results.forEach(r => {
  console.log(`- ${r.name_ar} (${r.code}): ${r.emp_count} موظف`);
  totalActive += r.emp_count;
});
console.log(`Total Active Headcount: ${totalActive} / 108`);

if (totalActive !== 108) {
  console.error('ERROR: Total active employee headcount does not match 108!');
  process.exit(1);
}

console.log('=== 9 Departments Reconstructed Perfectly! ===');
