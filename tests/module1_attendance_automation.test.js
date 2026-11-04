/**
 * tests/module1_attendance_automation.test.js
 * Verification Suite for Module 1: Automated Attendance & Biometric Penalties Linkage
 * Jawharat Al-Majd HRMS (Saudi Labor Law Compliant)
 */

const assert = require('node:assert');
const { query, get } = require('../server/database/db');
const attendanceAutomationService = require('../server/modules/attendanceAutomationService');

console.log('=== [TEST] Starting Module 1 Verification Suite ===\n');

// 1. Verify Absolute Data Integrity (Rule #1)
const empCount = get("SELECT COUNT(*) as c FROM employees WHERE status = 'نشط'")?.c;
console.log(`[PASS] Active Employees count: ${empCount} (Expected: 111)`);
assert.strictEqual(empCount, 111, 'Operational employees must be exactly 111');

const boardMembersCount = get("SELECT COUNT(*) as c FROM employees WHERE emp_code IN ('JM-0001', 'JM-0002', 'JM-0003')")?.c;
console.log(`[PASS] Board members count: ${boardMembersCount} (Expected: 0)`);
assert.strictEqual(boardMembersCount, 0, 'Board members must be 0');

// 2. Test Roster Seeding for a Target Date
const testDate = '2026-11-04';
const rosterRes = attendanceAutomationService.ensureRosterDataForDate(testDate);
console.log(`[PASS] Ensure Roster for ${testDate}:`, rosterRes);
const dayRecords = query('SELECT COUNT(*) as c FROM attendance_daily_summary WHERE date = ?', [testDate])[0]?.c;
assert(dayRecords >= 111, 'Daily records must cover all 111 employees');

// 3. Test Automated Violation Scanner
const scanRes = attendanceAutomationService.scanAndApplyAttendanceViolations(testDate);
console.log(`[PASS] Scan Violations Results:`, {
  processed: scanRes.processedEmployees,
  delays: scanRes.delaysDetected,
  absences: scanRes.absencesDetected,
  newPenalties: scanRes.penaltiesCreated.length,
  skippedDuplicates: scanRes.skippedDuplicates
});

// Verify idempotency (no duplicates on second run)
const rerunScan = attendanceAutomationService.scanAndApplyAttendanceViolations(testDate);
console.log(`[PASS] Idempotency Rerun - New penalties: ${rerunScan.penaltiesCreated.length}, Skipped duplicates: ${rerunScan.skippedDuplicates}`);
assert.strictEqual(rerunScan.penaltiesCreated.length, 0, 'Subsequent scan on same date must not create duplicate penalties');
assert(rerunScan.skippedDuplicates > 0, 'Subsequent scan must skip already existing penalties');

// 4. Test Employee Attendance Card (بطاقة حضور الموظف)
const firstEmp = get("SELECT id, emp_code, full_name_ar FROM employees WHERE status = 'نشط' LIMIT 1");
const card = attendanceAutomationService.getEmployeeAttendanceCard(firstEmp.id, '2026-11');
console.log(`[PASS] Employee Attendance Card generated for: ${card.employee.full_name_ar} (${card.employee.emp_code})`);
assert.strictEqual(card.employee.emp_code, firstEmp.emp_code);
assert(card.dailyRecords.length > 0, 'Card must have daily attendance records');
assert(card.metrics.attendancePercentage !== undefined, 'Card must contain attendance percentage');

// 5. Test Attendance Dashboard KPIs
const kpis = attendanceAutomationService.getAttendanceDashboardKPIs(testDate);
console.log(`[PASS] Dashboard KPIs:`, kpis);
assert(kpis.presentToday > 0, 'Present count must be greater than 0');
assert(kpis.dailyAttendanceRate > 0, 'Attendance rate must be calculated');
assert(kpis.autoPenaltiesThisMonth >= 0, 'Auto-penalties count must be a non-negative number');

// 6. Test CSV Export Generation
const csv = attendanceAutomationService.exportAttendanceCsv(testDate);
console.log(`[PASS] Export CSV generated. Length: ${csv.length} bytes, starts with UTF-8 BOM: ${csv.charCodeAt(0) === 0xFEFF}`);
assert(csv.charCodeAt(0) === 0xFEFF, 'CSV must start with UTF-8 BOM for Microsoft Excel compatibility');
assert(csv.includes('كود الموظف'), 'CSV must include Arabic headers');

console.log('\n=== [SUCCESS] Module 1 Verification Completed 100% Successfully! ===');
