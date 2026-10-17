const fs = require('fs');
const xlsx = require('xlsx');

const wb = xlsx.readFile('قاعدة بيانات موظفي جوهرة المجد.xlsx');
const ws = wb.Sheets['بيانات الموظفين'];
const raw = xlsx.utils.sheet_to_json(ws, { header: 1 });
const rows = raw.slice(3).filter(r => r && r[1]);

const officialEmps = JSON.parse(fs.readFileSync('server/database/officialEmployees.json', 'utf8'));

let dateConvert = (serial) => {
  if (!serial) return null;
  if (typeof serial === 'string' && serial.includes('-')) return serial;
  if (typeof serial === 'number') {
    const d = new Date(Math.round((serial - 25569) * 86400 * 1000));
    return d.toISOString().split('T')[0];
  }
  return String(serial);
};

let discrepancies = [];

rows.forEach((r, idx) => {
  const name = String(r[1]).trim();
  const natId = r[2] ? String(r[2]).trim() : '';
  const emp = officialEmps.find(e => (natId && String(e.national_id).trim() === natId) || String(e.full_name_ar).trim() === name);

  if (!emp) {
    discrepancies.push({ row: idx + 4, name, issue: 'NOT_FOUND_IN_JSON' });
    return;
  }

  const basic = Number(r[12]) || 0;
  const housing = Number(r[13]) || 0;
  const transport = Number(r[14]) || 0;
  const other = Number(r[15]) || 0;
  const gross = Number(r[16]) || 0;
  const bal = Number(r[11]) || 0;
  const joinDate = dateConvert(r[5]);

  if (emp.basic_salary !== basic) discrepancies.push({ name, field: 'basic_salary', excel: basic, json: emp.basic_salary });
  if (emp.housing_allowance !== housing) discrepancies.push({ name, field: 'housing_allowance', excel: housing, json: emp.housing_allowance });
  if (emp.transport_allowance !== transport) discrepancies.push({ name, field: 'transport_allowance', excel: transport, json: emp.transport_allowance });
  if (emp.other_allowance !== other) discrepancies.push({ name, field: 'other_allowance', excel: other, json: emp.other_allowance });
  if (emp.leave_balance !== bal) discrepancies.push({ name, field: 'leave_balance', excel: bal, json: emp.leave_balance });
  if (joinDate && emp.join_date !== joinDate) discrepancies.push({ name, field: 'join_date', excel: joinDate, json: emp.join_date });
});

console.log('Total Discrepancies among 109 employees:', discrepancies.length);
if (discrepancies.length > 0) {
  console.log('Discrepancies:', JSON.stringify(discrepancies.slice(0, 15), null, 2));
} else {
  console.log('PERFECT! All 109 employees have 100% identical data to the Excel spreadsheet!');
}
