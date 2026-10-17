const xlsx = require('xlsx');
const path = require('path');
const db = require('../server/database/db');

// 1. Create table
db.run(`
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
  )
`);

// 2. Read excel
const excelPath = path.join(__dirname, '..', 'المقيمين النشطين10_5_2026.xlsx');
const wb = xlsx.readFile(excelPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(ws);

console.log(`Read ${data.length} records from Excel`);

let inserted = 0;
let updated = 0;

for (const row of data) {
  const iqama = String(row['رقم الاقامة'] || '').trim();
  if (!iqama) continue;

  const fullName = String(row['الاسم'] || '').trim();
  const gender = String(row['الجنس'] || 'ذكر').trim();
  const nationality = String(row['الجنسية'] || '').trim();
  const occupation = String(row['المهنة'] || '').trim();
  const passportNumber = String(row['رقم الجواز'] || '').trim();
  const passportExpiry = String(row['تاريخ انتهاء الجواز'] || '').trim();
  const iqamaIssueDate = String(row['تاريخ اصدار الاقامة'] || '').trim();
  const iqamaExpiryGregorian = String(row['تاريخ انتهاء الاقامة'] || '').trim();
  const iqamaExpiryHijri = String(row['تاريخ انتهاء الاقامة بالهجري'] || '').trim();
  const birthDate = String(row['تاريخ الميلاد'] || '').trim();
  const isOutside = String(row['خارج المملكه'] || '').trim() === 'نعم' ? 1 : 0;
  const employerId = String(row['رقم صاحب العمل'] || '7013999755').trim();

  const existing = db.get('SELECT id FROM muqeem_residents WHERE iqama_number = ?', [iqama]);
  if (existing) {
    db.run(`
      UPDATE muqeem_residents SET
        full_name = ?, gender = ?, nationality = ?, occupation = ?,
        passport_number = ?, passport_expiry = ?, iqama_issue_date = ?,
        iqama_expiry_gregorian = ?, iqama_expiry_hijri = ?, birth_date = ?,
        is_outside_ksa = ?, employer_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      fullName, gender, nationality, occupation,
      passportNumber, passportExpiry, iqamaIssueDate,
      iqamaExpiryGregorian, iqamaExpiryHijri, birthDate,
      isOutside, employerId, existing.id
    ]);
    updated++;
  } else {
    db.run(`
      INSERT INTO muqeem_residents (
        iqama_number, full_name, gender, nationality, occupation,
        passport_number, passport_expiry, iqama_issue_date,
        iqama_expiry_gregorian, iqama_expiry_hijri, birth_date,
        is_outside_ksa, employer_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      iqama, fullName, gender, nationality, occupation,
      passportNumber, passportExpiry, iqamaIssueDate,
      iqamaExpiryGregorian, iqamaExpiryHijri, birthDate,
      isOutside, employerId
    ]);
    inserted++;
  }

  // Also sync matching employees in `employees` table!
  const emp = db.get('SELECT id FROM employees WHERE national_id = ?', [iqama]);
  if (emp) {
    db.run(`
      UPDATE employees SET
        iqama_expiry = ?,
        passport_expiry = ?
      WHERE id = ?
    `, [iqamaExpiryGregorian, passportExpiry, emp.id]);
  }
}

console.log(`Import completed: ${inserted} inserted, ${updated} updated`);
const total = db.get('SELECT count(*) as count FROM muqeem_residents');
console.log('Total in muqeem_residents table:', total.count);
