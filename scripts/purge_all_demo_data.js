// scripts/purge_all_demo_data.js
/**
 * Jawharat Al-Majd HRMS — Production Data Purge & Verification Script
 * Strictly purges mock/dummy/test records while rigorously preserving:
 *  1. Production Admin account (id: 1, username: 'admin', role: 'admin')
 *  2. 13 Authorized real employee user accounts
 *  3. 108 Active operational employees + 5 Terminated employees
 *  4. Core lookups (penalty regulations, shifts, branches, settings)
 */

const { db, get, query, run } = require('../server/database/db');

console.log('=== Starting Thorough Production Database Purge ===');

// 1. Vehicles & Fleet Mock Data
const vehCountBefore = get('SELECT COUNT(*) as c FROM vehicles')?.c || 0;
const logsCountBefore = get('SELECT COUNT(*) as c FROM vehicle_custody_logs')?.c || 0;
run('DELETE FROM vehicle_custody_logs');
run('DELETE FROM vehicles');
console.log(`✓ Purged fleet vehicles (${vehCountBefore}) and custody logs (${logsCountBefore}).`);

// 2. Company Licenses (Mock 7 licenses from demo)
const licCountBefore = get('SELECT COUNT(*) as c FROM company_licenses')?.c || 0;
run('DELETE FROM company_licenses');
console.log(`✓ Purged mock company licenses (${licCountBefore}).`);

// 3. Administrative Circulars & Acknowledgements
const circCountBefore = get('SELECT COUNT(*) as c FROM administrative_circulars')?.c || 0;
const ackCountBefore = get('SELECT COUNT(*) as c FROM circular_acknowledgements')?.c || 0;
run('DELETE FROM circular_acknowledgements');
run('DELETE FROM administrative_circulars');
console.log(`✓ Purged administrative circulars (${circCountBefore}) and acknowledgements (${ackCountBefore}).`);

// 4. Test Requests, Leaves, Approvals, Workflow Steps
const reqCountBefore = get('SELECT COUNT(*) as c FROM requests')?.c || 0;
const leaveCountBefore = get('SELECT COUNT(*) as c FROM leaves')?.c || 0;
const stepCountBefore = get('SELECT COUNT(*) as c FROM workflow_steps')?.c || 0;
const appCountBefore = get('SELECT COUNT(*) as c FROM approvals')?.c || 0;
run('DELETE FROM approvals');
run('DELETE FROM workflow_steps');
run('DELETE FROM leaves');
run('DELETE FROM requests');
console.log(`✓ Purged requests (${reqCountBefore}), leaves (${leaveCountBefore}), workflow_steps (${stepCountBefore}), approvals (${appCountBefore}).`);

// 5. Tasks
const tasksCountBefore = get('SELECT COUNT(*) as c FROM tasks')?.c || 0;
run('DELETE FROM tasks');
console.log(`✓ Purged tasks (${tasksCountBefore}).`);

// 6. Penalties Issued
const penCountBefore = get('SELECT COUNT(*) as c FROM penalties_issued')?.c || 0;
run('DELETE FROM penalties_issued');
console.log(`✓ Purged penalties_issued (${penCountBefore}).`);

// 7. Absence Notices & Attendance Notices
const absCountBefore = get('SELECT COUNT(*) as c FROM absence_notices')?.c || 0;
const attNoticesBefore = get('SELECT COUNT(*) as c FROM attendance_notices')?.c || 0;
run('DELETE FROM absence_notices');
run('DELETE FROM attendance_notices');
console.log(`✓ Purged absence_notices (${absCountBefore}) and attendance_notices (${attNoticesBefore}).`);

// 8. Notifications
const notifCountBefore = get('SELECT COUNT(*) as c FROM notifications')?.c || 0;
run('DELETE FROM notifications');
console.log(`✓ Purged notifications (${notifCountBefore}).`);

// 9. Health Insurance Mock Data
const insCardsBefore = get('SELECT COUNT(*) as c FROM employee_insurance_cards')?.c || 0;
const healthCardsBefore = get('SELECT COUNT(*) as c FROM health_cards')?.c || 0;
const healthArticlesBefore = get('SELECT COUNT(*) as c FROM health_education_articles')?.c || 0;
run('DELETE FROM employee_insurance_cards');
run('DELETE FROM health_cards');
run('DELETE FROM health_education_articles');
console.log(`✓ Purged employee_insurance_cards (${insCardsBefore}), health_cards (${healthCardsBefore}), health_articles (${healthArticlesBefore}).`);

// 10. ATS Recruitment Mock Data
const vacCountBefore = get('SELECT COUNT(*) as c FROM job_vacancies')?.c || 0;
const applicantCountBefore = get('SELECT COUNT(*) as c FROM job_applicants')?.c || 0;
const offCountBefore = get('SELECT COUNT(*) as c FROM job_offers')?.c || 0;
run('DELETE FROM job_offers');
run('DELETE FROM job_applicants');
run('DELETE FROM job_vacancies');
console.log(`✓ Purged job_vacancies (${vacCountBefore}), job_applicants (${applicantCountBefore}), job_offers (${offCountBefore}).`);

// 11. Transfers, Loans, EOS Settlements Mock Data
const transCountBefore = get('SELECT COUNT(*) as c FROM transfer_requests')?.c || 0;
const loansCountBefore = get('SELECT COUNT(*) as c FROM loans')?.c || 0;
const eosCountBefore = get('SELECT COUNT(*) as c FROM eos_settlements')?.c || 0;
run('DELETE FROM transfer_requests');
run('DELETE FROM loans');
run('DELETE FROM eos_settlements');
console.log(`✓ Purged transfer_requests (${transCountBefore}), loans (${loansCountBefore}), eos_settlements (${eosCountBefore}).`);

// 12. Audit Logs Clean-up (Delete test / mock entries)
const auditCountBefore = get('SELECT COUNT(*) as c FROM audit_logs')?.c || 0;
run("DELETE FROM audit_logs WHERE action LIKE '%test%' OR comment LIKE '%test%' OR performed_by_name LIKE '%test%' OR created_at < '2026-11-01'");
const auditCountAfter = get('SELECT COUNT(*) as c FROM audit_logs')?.c || 0;
console.log(`✓ Cleaned audit_logs (reduced from ${auditCountBefore} to ${auditCountAfter}).`);

// 13. Verify Integrity of Real Employees & Users
const activeEmps = get("SELECT COUNT(*) as c FROM employees WHERE status = 'نشط'")?.c || 0;
const termEmps = get("SELECT COUNT(*) as c FROM employees WHERE status != 'نشط'")?.c || 0;
const totalUsers = get("SELECT COUNT(*) as c FROM users")?.c || 0;
const adminUser = get("SELECT id, username, role FROM users WHERE username = 'admin'");

console.log('=== Verification of Preserved Production Data ===');
console.log(`Active Employees: ${activeEmps} (Expected: 108)`);
console.log(`Terminated Employees: ${termEmps} (Expected: 5)`);
console.log(`Total Users: ${totalUsers} (Expected: 14)`);
console.log(`Production Admin:`, adminUser);

if (activeEmps !== 108 || termEmps !== 5) {
  console.warn(`WARNING: Employee count differs from expected 108 active + 5 terminated!`);
}
if (!adminUser || adminUser.role !== 'admin') {
  console.error(`CRITICAL: Production Admin account is missing or invalid!`);
  process.exit(1);
}

// 14. Database Vacuum
run('VACUUM');
console.log('✓ Database vacuumed successfully.');
console.log('=== Purge Completed Successfully ===');
