// scripts/sync_muqeem.js
const xlsx = require('xlsx');
const path = require('node:path');
const fs = require('node:fs');
const { query, run, get } = require('../server/database/db');

function syncMuqeem() {
  const rootDir = path.resolve(__dirname, '..');
  const primaryPath = path.join(rootDir, 'المقيمين النشطين 04_11_2026.xlsx');
  const excelPath = fs.existsSync(primaryPath) ? primaryPath : path.join(rootDir, 'المقيمين النشطين10_5_2026.xlsx');

  console.log('Using Muqeem Excel file:', excelPath);
  const wb = xlsx.readFile(excelPath);
  const data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  console.log('Total rows in Excel:', data.length);

  const currentIqamas = new Set(data.map(r => String(r['رقم الاقامة'] || '').trim()).filter(Boolean));

  // Remove any resident from muqeem_residents that is not in the active sheet
  const oldResidents = query('SELECT iqama_number FROM muqeem_residents');
  let removed = 0;
  for (const r of oldResidents) {
    if (!currentIqamas.has(String(r.iqama_number).trim())) {
      run('DELETE FROM muqeem_residents WHERE iqama_number = ?', [r.iqama_number]);
      removed++;
    }
  }
  console.log('Removed obsolete residents:', removed);

  let inserted = 0;
  let updated = 0;
  let syncedToEmployees = 0;

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

    const existing = get('SELECT id FROM muqeem_residents WHERE iqama_number = ?', [iqama]);
    if (existing) {
      run(`
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
      run(`
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

    // Sync to employees if present
    const emp = get('SELECT id FROM employees WHERE national_id = ?', [iqama]);
    if (emp) {
      run(`
        UPDATE employees SET
          iqama_expiry = COALESCE(?, iqama_expiry),
          passport_expiry = COALESCE(?, passport_expiry)
        WHERE id = ?
      `, [iqamaExpiryGregorian || null, passportExpiry || null, emp.id]);
      syncedToEmployees++;
    }
  }

  console.log(`Sync completed: inserted=${inserted}, updated=${updated}, syncedToEmployees=${syncedToEmployees}`);
  const finalCount = query('SELECT COUNT(*) as c FROM muqeem_residents')[0].c;
  console.log(`Total residents in muqeem_residents: ${finalCount}`);
}

syncMuqeem();
