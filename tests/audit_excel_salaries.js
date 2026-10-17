const fs = require('fs');
const xlsx = require('xlsx');

const wb = xlsx.readFile('قاعدة بيانات موظفي جوهرة المجد.xlsx');
const ws = wb.Sheets['بيانات الموظفين'];
const raw = xlsx.utils.sheet_to_json(ws, { header: 1 });
const headers = raw[2];
const rows = raw.slice(3).filter(r => r && r[1]);

console.log('Headers in Excel:', headers);
console.log('Total Employee rows:', rows.length);

const officialEmps = JSON.parse(fs.readFileSync('server/database/officialEmployees.json', 'utf8'));

// Check each column in Excel
// Index:
// 0: الرقم الوظيفي
// 1: الاسم
// 2: رقم الهوية
// 3: الجنس
// 4: الجنسية
// 5: تاريخ التعيين (Excel serial or date)
// 6: الإدارة
// 7: القسم
// 8: المسمى الوظيفي
// 9: رقم الجوال
// 10: الإيميل
// 11: رصيد الإجازات الحالي
// 12: الراتب الأساسي
// 13: بدل السكن
// 14: بدل المواصلات
// 15: بدلات أخرى
// 16: الإجمالي
// 17: رقم الآيبان
// 18: تاريخ انتهاء الإقامة

let dateConvert = (serial) => {
  if (!serial) return '';
  if (typeof serial === 'string' && serial.includes('-')) return serial;
  const d = new Date(Math.round((serial - 25569) * 86400 * 1000));
  return d.toISOString().split('T')[0];
};

let differences = [];
rows.forEach((r, idx) => {
  const name = String(r[1]).trim();
  const natId = r[2] ? String(r[2]).trim() : '';
  const basic = Number(r[12]) || 0;
  const housing = Number(r[13]) || 0;
  const transport = Number(r[14]) || 0;
  const other = Number(r[15]) || 0;
  const gross = Number(r[16]) || 0;
  const bal = Number(r[11]) || 0;
  const join = dateConvert(r[5]);
  const iqamaExp = dateConvert(r[18]);

  // Find in officialEmps
  const emp = officialEmps.find(e => (natId && String(e.national_id).trim() === natId) || String(e.full_name_ar).trim() === name);
  if (!emp) {
    differences.push({ type: 'MISSING_IN_OFFICIAL', name, natId });
  } else {
    // Check salary
    if (emp.basic_salary !== basic || emp.housing_allowance !== housing || emp.transport_allowance !== transport || emp.other_allowance !== other) {
      differences.push({
        type: 'SALARY_MISMATCH',
        name,
        excel: { basic, housing, transport, other, gross },
        json: { basic: emp.basic_salary, housing: emp.housing_allowance, transport: emp.transport_allowance, other: emp.other_allowance, gross: emp.total_salary }
      });
    }
  }
});

console.log('Total differences found:', differences.length);
if (differences.length > 0) {
  console.log('Sample differences:', differences.slice(0, 10));
} else {
  console.log('ALL 109 EMPLOYEES MATCH 100% WITH EXCEL FOR SALARIES AND ALLOWANCES!');
}
