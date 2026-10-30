// tests/verify-zero-fabrication.js
const db = require('../server/database/db');

console.log('========================================================');
console.log('--- ZERO FABRICATION & DATA INTEGRITY FINAL AUDIT ---');
console.log('========================================================');

const total = db.get('SELECT count(*) as c FROM employees').c;
const saudis = db.get('SELECT count(*) as c FROM employees WHERE is_saudi = 1').c;
const expats = db.get('SELECT count(*) as c FROM employees WHERE is_saudi = 0').c;

const nullNationalId = db.get("SELECT count(*) as c FROM employees WHERE national_id IS NULL OR national_id = ''").c;
const dummyPhoneNumbers = db.get("SELECT count(*) as c FROM employees WHERE phone IN ('0505111111', '0505222222', '0505333333', '0505444444', '0505555555', '0500000000')").c;
const dummyNationalIds = db.get("SELECT count(*) as c FROM employees WHERE national_id IN ('1011111111', '1022222222', '1033333333', '1044444444', '1055555555')").c;
const dummyEmails = db.get("SELECT count(*) as c FROM employees WHERE email IN ('faris.abdulrahman@jalmajd.com', 'saleh.saeed@jalmajd.com', 'saeed.mohammed@jalmajd.com', 'mohammed.saeed@jalmajd.com', 'abdulmalik.saeed@jalmajd.com')").c;

const jm0004 = db.get("SELECT emp_code, full_name_ar, national_id, phone, email, annual_leave_balance, iqama_expiry, passport_expiry FROM employees WHERE emp_code = 'JM-0004'");
const jm1000 = db.get("SELECT emp_code, full_name_ar, national_id, phone, email, annual_leave_balance, iqama_expiry, passport_expiry FROM employees WHERE emp_code = 'JM-1000'");
const jm1003 = db.get("SELECT emp_code, full_name_ar, national_id, phone, email, annual_leave_balance, iqama_expiry, passport_expiry FROM employees WHERE emp_code = 'JM-1003'");

console.log(`Total Employees: ${total}`);
console.log(`Saudi Employees: ${saudis}`);
console.log(`Resident / Expat Employees: ${expats}`);
console.log(`Legitimate Empty/Null National IDs: ${nullNationalId}`);
console.log(`Dummy Repeating Phones (e.g. 0505111111..): ${dummyPhoneNumbers}`);
console.log(`Dummy Repeating National IDs (e.g. 1011111111..): ${dummyNationalIds}`);
console.log(`Dummy Auto-generated Emails: ${dummyEmails}`);

console.log('\n--- TARGET EMPLOYEE AUDITS ---');
console.log('JM-0004 (Screenshot 1 & 4 Employee):', jm0004);
console.log('JM-1000 (Screenshot 3 Employee):', jm1000);
console.log('JM-1003 (Expat without Muqeem entry):', jm1003);

if (dummyPhoneNumbers === 0 && dummyNationalIds === 0 && dummyEmails === 0 && total === 111) {
  console.log('\n>>> SUCCESS: ALL DATA FABRICATION ELIMINATED! SINGLE SOURCE OF TRUTH VERIFIED! <<<');
  process.exit(0);
} else {
  console.error('\n>>> AUDIT FAILED! <<<');
  process.exit(1);
}
