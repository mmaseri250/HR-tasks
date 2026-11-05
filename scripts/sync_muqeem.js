const { db } = require('../server/database/db');
const path = require('node:path');
const xlsx = require('xlsx');

const excelPath = path.join(__dirname, '..', 'المقيمين النشطين 04_11_2026.xlsx');
const wb = xlsx.readFile(excelPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(ws);

console.log('Muqeem Excel Rows:', data.length);

const stmt = db.prepare(`
  INSERT INTO muqeem_residents (
    iqama_number, full_name, gender, nationality, occupation,
    passport_number, passport_expiry, iqama_issue_date,
    iqama_expiry_gregorian, iqama_expiry_hijri, birth_date,
    is_outside_ksa, employer_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(iqama_number) DO UPDATE SET
    full_name = excluded.full_name,
    gender = excluded.gender,
    nationality = excluded.nationality,
    occupation = excluded.occupation,
    passport_number = excluded.passport_number,
    passport_expiry = excluded.passport_expiry,
    iqama_issue_date = excluded.iqama_issue_date,
    iqama_expiry_gregorian = excluded.iqama_expiry_gregorian,
    iqama_expiry_hijri = excluded.iqama_expiry_hijri,
    birth_date = excluded.birth_date,
    is_outside_ksa = excluded.is_outside_ksa
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

// Sync into employees table
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

const residentCount = db.prepare('SELECT count(*) as c FROM muqeem_residents').get().c;
console.log('Muqeem Residents in DB:', residentCount);

const expatWithExpiry = db.prepare("SELECT count(*) as c FROM employees WHERE is_saudi = 0 AND iqama_expiry IS NOT NULL").get().c;
console.log('Expat Employees with Iqama Expiry:', expatWithExpiry);
