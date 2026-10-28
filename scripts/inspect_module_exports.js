const emp = require('../server/modules/employees');
const att = require('../server/modules/attendance');
const pay = require('../server/modules/payroll');
const leaves = require('../server/modules/leaves');
const tasks = require('../server/modules/tasks');
const pens = require('../server/modules/penalties');
const loans = require('../server/modules/loans');
const term = require('../server/modules/terminatedEmployees');
const abs = require('../server/modules/absenceNotices');

console.log('employees exports:', Object.keys(emp));
console.log('attendance exports:', Object.keys(att));
console.log('payroll exports:', Object.keys(pay));
console.log('leaves exports:', Object.keys(leaves));
console.log('tasks exports:', Object.keys(tasks));
console.log('penalties exports:', Object.keys(pens));
console.log('loans exports:', Object.keys(loans));
console.log('terminated exports:', Object.keys(term));
console.log('absenceNotices exports:', Object.keys(abs));
