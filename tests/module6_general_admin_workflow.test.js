/**
 * tests/module6_general_admin_workflow.test.js
 * Verification Suite for Module 6: Employee Self-Service Transfer Workflow,
 * Administrative Circulars, Commercial & Municipal Licenses, and Unified Multi-Module Reporting.
 * Jawharat Al-Majd HRMS — Saudi Labor Law Compliant
 */

const assert = require('node:assert');
const { query, get, run } = require('../server/database/db');
const generalAdminService = require('../server/modules/generalAdminService');

console.log('================================================================');
console.log('🧪 RUNNING MODULE 6: GENERAL ADMIN & WORKFLOW VERIFICATION TEST');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

// Pick active operational employees and departments for testing
const activeEmps = query("SELECT id, emp_code, full_name_ar, department_id, branch_id FROM employees WHERE emp_code NOT IN ('JM-0001','JM-0002','JM-0003') LIMIT 5");
assert(activeEmps.length >= 2, 'Must have active operational employees for testing');

const depts = query("SELECT id, name_ar FROM departments LIMIT 3");
assert(depts.length >= 2, 'Must have departments for testing');

const testEmp1 = activeEmps[0];
const originalDeptId = testEmp1.department_id;
const targetDept = depts.find(d => d.id !== originalDeptId) || depts[1];

let testTransfer = null;

// ============================================================================
// TEST GROUP 1: Transfer Request Creation & Relational Mapping
// ============================================================================
console.log('--- TEST GROUP 1: Transfer Request Creation & Mapping ---');

test('createTransferRequest throws error if required fields are missing', () => {
  assert.throws(() => {
    generalAdminService.createTransferRequest({ emp_id: testEmp1.id });
  }, /يرجى تحديد الموظف والإدارة المنقول إليها/);
});

test('createTransferRequest creates pending transfer with TRF number and 3-tier pending status', () => {
  testTransfer = generalAdminService.createTransferRequest({
    emp_id: testEmp1.id,
    target_dept_id: targetDept.id,
    desired_transfer_date: '2026-04-01',
    reason: 'نقل إداري لدعم مشاريع البنية التحتية'
  });

  assert(testTransfer, 'Should return created transfer request');
  assert(testTransfer.id > 0, 'Should have positive ID');
  assert(testTransfer.request_no.startsWith('TRF-'), `Request no should start with TRF-, got ${testTransfer.request_no}`);
  assert.strictEqual(testTransfer.emp_id, testEmp1.id);
  assert.strictEqual(testTransfer.target_dept_id, targetDept.id);
  assert.strictEqual(testTransfer.manager_status, 'معلق');
  assert.strictEqual(testTransfer.hr_status, 'معلق');
  assert.strictEqual(testTransfer.exec_status, 'معلق');
  assert(testTransfer.status.includes('بانتظار موافقة المدير المباشر'));
});

test('getTransferRequests returns list including newly created request with relations', () => {
  const list = generalAdminService.getTransferRequests({ emp_id: testEmp1.id });
  assert(Array.isArray(list), 'Should return array');
  assert(list.length >= 1, 'Should include at least 1 request');
  const found = list.find(r => r.id === testTransfer.id);
  assert(found, 'Created transfer should be in list');
  assert.strictEqual(found.emp_name, testEmp1.full_name_ar);
  assert(found.target_dept_name, 'Should join target department name');
});

test('getTransferRequestById retrieves complete transfer details', () => {
  const single = generalAdminService.getTransferRequestById(testTransfer.id);
  assert(single, 'Should find transfer request');
  assert.strictEqual(single.id, testTransfer.id);
  assert.strictEqual(single.request_no, testTransfer.request_no);
  assert(single.emp_job !== undefined);
});

// ============================================================================
// TEST GROUP 2: Dynamic 3-Tier Approval Workflow & Automated Update
// ============================================================================
console.log('\n--- TEST GROUP 2: Dynamic 3-Tier Workflow & Auto Update ---');

test('Premature approval: HR cannot approve before Direct Manager approval', () => {
  assert.throws(() => {
    generalAdminService.processTransferApproval(testTransfer.id, 'hr', {
      action: 'موافق',
      approver_name: 'أحمد فؤاد',
      comment: 'اعتماد الموارد البشرية'
    });
  }, /لا يمكن للموارد البشرية الاعتماد قبل موافقة المدير المباشر/);
});

test('Tier 1: Direct Manager approves transfer request', () => {
  const updated = generalAdminService.processTransferApproval(testTransfer.id, 'manager', {
    action: 'موافق',
    approver_name: 'مدير الصيانة والمشاريع',
    comment: 'موافق على نقل الموظف نظراً لجاهزية القسم البديل'
  });

  assert.strictEqual(updated.manager_status, 'معتمد');
  assert.strictEqual(updated.hr_status, 'معلق');
  assert(updated.status.includes('بانتظار مراجعة الموارد البشرية'));
  assert(updated.manager_action_at, 'Should timestamp manager action');
});

test('Premature approval: Exec cannot approve before HR approval', () => {
  assert.throws(() => {
    generalAdminService.processTransferApproval(testTransfer.id, 'exec', {
      action: 'موافق',
      approver_name: 'الرئيس التنفيذي'
    });
  }, /لا يمكن للإدارة العليا الاعتماد النهائي قبل مراجعة واعتماد الموارد البشرية/);
});

test('Tier 2: HR approves transfer request', () => {
  const updated = generalAdminService.processTransferApproval(testTransfer.id, 'hr', {
    action: 'موافق',
    approver_name: 'مدير الموارد البشرية',
    comment: 'تم التحقق من المسمى الوظيفي والميزانية التشغيلية'
  });

  assert.strictEqual(updated.hr_status, 'معتمد');
  assert.strictEqual(updated.exec_status, 'معلق');
  assert(updated.status.includes('بانتظار الاعتماد النهائي للإدارة العليا'));
});

test('Tier 3: Executive final approval executes automated employee department update in database', () => {
  const updated = generalAdminService.processTransferApproval(testTransfer.id, 'exec', {
    action: 'موافق',
    approver_name: 'الرئيس التنفيذي - جوهرة المجد',
    comment: 'معتمد نهائياً وموجه للبدء بالمباشرة'
  });

  assert.strictEqual(updated.exec_status, 'معتمد');
  assert(updated.status.includes('تم تنفيذ النقل'));

  // Verify that employee record in database is AUTOMATICALLY updated to target_dept_id
  const empAfter = get("SELECT department_id FROM employees WHERE id = ?", [testEmp1.id]);
  assert.strictEqual(empAfter.department_id, targetDept.id, 'Employee department must be updated automatically upon final approval');

  // Revert employee department back to original to preserve test idempotency
  run("UPDATE employees SET department_id = ? WHERE id = ?", [originalDeptId, testEmp1.id]);
});

test('Rejection workflow: test request rejected by Manager transitions to rejected status', () => {
  const rejTransfer = generalAdminService.createTransferRequest({
    emp_id: testEmp1.id,
    target_dept_id: targetDept.id,
    reason: 'طلب نقل تجريبي للرفض'
  });

  const rejected = generalAdminService.processTransferApproval(rejTransfer.id, 'manager', {
    action: 'مرفوض',
    approver_name: 'المدير المباشر',
    comment: 'نظراً للحاجة الماسة للموظف في مشروعه الحالي'
  });

  assert.strictEqual(rejected.manager_status, 'مرفوض');
  assert(rejected.status.includes('مرفوض'));

  // Clean up rejection test record
  run("DELETE FROM transfer_requests WHERE id = ?", [rejTransfer.id]);
});

test('generateTransferDecisionPrintHtml produces valid printable A4 decision document', () => {
  const html = generalAdminService.generateTransferDecisionPrintHtml(testTransfer.id);
  assert(typeof html === 'string');
  assert(html.includes('قرار نقل وتكليف إداري داخلي'), 'Must include decision banner');
  assert(html.includes(testEmp1.full_name_ar), 'Must include employee name');
  assert(html.includes('3-Tier Workflow'), 'Must mention workflow tiers');
  assert(html.includes('شركة جوهرة المجد للمقاولات والتجارة'));
});

// ============================================================================
// TEST GROUP 3: Administrative Circulars & Digital Acknowledgements
// ============================================================================
console.log('\n--- TEST GROUP 3: Administrative Circulars & Digital Acknowledgements ---');

test('Initial seeded circulars are populated (at least 4 circulars)', () => {
  const circs = generalAdminService.getCirculars();
  assert(Array.isArray(circs));
  assert(circs.length >= 4, `Expected at least 4 circulars, got ${circs.length}`);
  const c1 = circs.find(c => c.circular_no === 'CIR-2026-001');
  assert(c1, 'Should find safety PPE circular CIR-2026-001');
  assert.strictEqual(c1.is_urgent, 1);
});

let testCircular = null;
test('createCircular publishes a new official circular', () => {
  testCircular = generalAdminService.createCircular({
    title: 'تحديث سياسة البدلات والمكافآت الإضافية للمشاريع الميدانية',
    content: 'تقرر اعتماد صرف بدل موقع إضافي للمهندسين والمشرفين الميدانيين بنسبة 10% من الراتب الأساسي.',
    category: 'إداري وتنظيمي',
    target_audience: 'كافة المهندسين الميدانيين',
    issued_by: 'المدير العام للموارد البشرية',
    is_urgent: 1,
    acknowledgement_required: 1
  });

  assert(testCircular, 'Should return created circular');
  assert(testCircular.id > 0);
  assert.strictEqual(testCircular.title, 'تحديث سياسة البدلات والمكافآت الإضافية للمشاريع الميدانية');
  assert.strictEqual(testCircular.is_urgent, 1);
});

test('acknowledgeCircular records employee digital acknowledgement', () => {
  const ackRes = generalAdminService.acknowledgeCircular(testCircular.id, testEmp1.id);
  assert(ackRes.success, 'Acknowledgement must succeed');

  const reloaded = generalAdminService.getCircularById(testCircular.id, testEmp1.id);
  assert.strictEqual(reloaded.is_acknowledged_by_user, true, 'Should reflect user acknowledged');
  assert(reloaded.ack_count >= 1, 'Should increment ack_count');
});

test('generateCircularPrintHtml renders printable A4 circular', () => {
  const html = generalAdminService.generateCircularPrintHtml(testCircular.id);
  assert(typeof html === 'string');
  assert(html.includes(testCircular.title));
  assert(html.includes(testCircular.circular_no));
  assert(html.includes('شركة جوهرة المجد للمقاولات والتجارة'));
});

// ============================================================================
// TEST GROUP 4: Company Licenses & Commercial Registrations
// ============================================================================
console.log('\n--- TEST GROUP 4: Company Licenses & Expiry Tracking ---');

test('Initial seeded company licenses exist (at least 7 official registrations)', () => {
  const licenses = generalAdminService.getLicenses();
  assert(Array.isArray(licenses));
  assert(licenses.length >= 7, `Expected at least 7 licenses, got ${licenses.length}`);
  const cr = licenses.find(l => l.license_type === 'commercial_reg');
  assert(cr, 'Commercial registration must be seeded');
  assert.strictEqual(cr.license_no, '5850024190');
  assert.strictEqual(cr.issuing_authority, 'وزارة التجارة');
});

test('computeExpiry correctly categorizes valid, expiring soon, and expired', () => {
  // 1. Far future date -> valid
  const v1 = generalAdminService.computeExpiry('2028-12-31', 60);
  assert.strictEqual(v1.status, 'valid');

  // 2. 20 days in future with 60 alert days -> expiring_soon
  const soonDate = new Date();
  soonDate.setDate(soonDate.getDate() + 20);
  const v2 = generalAdminService.computeExpiry(soonDate.toISOString().split('T')[0], 60);
  assert.strictEqual(v2.status, 'expiring_soon');

  // 3. Past date -> expired
  const v3 = generalAdminService.computeExpiry('2020-01-01', 60);
  assert.strictEqual(v3.status, 'expired');
});

let testLicense = null;
test('createLicense creates valid license and updateLicense modifies it', () => {
  testLicense = generalAdminService.createLicense({
    license_type: 'civil_defense',
    license_name_ar: 'رخصة السلامة لموقع مشروع خميس مشيط',
    license_no: 'CD-KM-2026-99',
    issuing_authority: 'الدفاع المدني بخميس مشيط',
    expiry_date: '2027-06-30',
    alert_days_before: 45,
    notes: 'معتمد'
  });

  assert(testLicense.id > 0);
  assert.strictEqual(testLicense.license_no, 'CD-KM-2026-99');
  assert.strictEqual(testLicense.expiry_info.status, 'valid');

  // Update
  const updated = generalAdminService.updateLicense(testLicense.id, {
    notes: 'تم فحص أجهزة الإنذار واعتمادها'
  });
  assert.strictEqual(updated.notes, 'تم فحص أجهزة الإنذار واعتمادها');
});

test('generateLicensesReportHtml generates official printable A4 licenses register', () => {
  const html = generalAdminService.generateLicensesReportHtml();
  assert(typeof html === 'string');
  assert(html.includes('تقرير السجلات والتراخيص النظامية - شركة جوهرة المجد'));
  assert(html.includes('5850024190'), 'Must include commercial registration number');
  assert(html.includes('أمانة منطقة عسير'), 'Must include Baladiya authority');
});

test('deleteLicense safely removes test license', () => {
  const res = generalAdminService.deleteLicense(testLicense.id);
  assert(res.success);
  const check = generalAdminService.getLicenseById(testLicense.id);
  assert.strictEqual(check, null);
});

// ============================================================================
// TEST GROUP 5: Unified Advanced Multi-Module Reporting
// ============================================================================
console.log('\n--- TEST GROUP 5: Unified Multi-Module Reporting ---');

test('getUnifiedReportSummary aggregates data across all 6 operational domains', () => {
  const summary = generalAdminService.getUnifiedReportSummary();
  assert(summary.workforce, 'Must contain workforce metrics');
  assert.strictEqual(summary.workforce.total_employees, 108, 'Workforce count must strictly match 108 active operational employees');
  assert(summary.workforce.saudi_employees > 0);
  assert(summary.workforce.saudization_rate > 0);

  assert(summary.fleet, 'Must contain fleet metrics');
  assert(summary.fleet.total_vehicles >= 1, `Expected at least 1 vehicle, got ${summary.fleet.total_vehicles}`);

  assert(summary.healthcare, 'Must contain healthcare metrics');
  assert(summary.healthcare.insured_employees >= 1, `Expected at least 1 insured employee, got ${summary.healthcare.insured_employees}`);
  assert(summary.healthcare.baladiya_cards >= 1, `Expected at least 1 municipal health card, got ${summary.healthcare.baladiya_cards}`);

  assert(summary.governance, 'Must contain governance metrics');
  assert(summary.governance.total_licenses >= 7);
  assert(summary.governance.active_circulars >= 4);
});

test('exportUnifiedReportCsv exports valid UTF-8 BOM CSV with 6 modules breakdown', () => {
  const csv = generalAdminService.exportUnifiedReportCsv();
  assert(typeof csv === 'string');
  assert(csv.startsWith('\uFEFF'), 'CSV must start with UTF-8 BOM for Arabic Excel');
  assert(csv.includes('القوى العاملة والتوطين'));
  assert(csv.includes('الأسطول ومنصة تم'));
  assert(csv.includes('الرعاية والتأمين الطبي'));
  assert(csv.includes('الحوكمة والإدارة العامة'));
  assert(csv.includes('108'));
});

// ============================================================================
// TEST GROUP 6: Strict Rule #1 Data Integrity Verification
// ============================================================================
console.log('\n--- TEST GROUP 6: Strict Rule #1 Verification ---');

test('Rule #1: Active operational employee count is exactly 108', () => {
  const count = get("SELECT COUNT(*) as c FROM employees WHERE status = 'نشط'").c;
  assert.strictEqual(count, 108, `Expected exactly 108 active operational employees, got ${count}`);
});

test('Rule #1: Total employee count is exactly 113 (108 active + 5 terminated)', () => {
  const count = get("SELECT COUNT(*) as c FROM employees").c;
  assert.strictEqual(count, 113, `Expected exactly 113 employees, got ${count}`);
});

test('Rule #1: Users table contains exactly 14 active users', () => {
  const userCount = get("SELECT COUNT(*) as c FROM users").c;
  assert.strictEqual(userCount, 14, `Expected exactly 14 users, got ${userCount}`);
});

test('Rule #1: Legacy board members are 0 in operational employees', () => {
  const boardInEmps = get("SELECT COUNT(*) as c FROM employees WHERE full_name_ar IN ('عبدالرحمن بن صالح القحطاني', 'سعيد بن صالح القحطاني', 'صالح بن عبدالرحمن القحطاني')").c;
  assert.strictEqual(boardInEmps, 0, `Board members in operational roster must be 0, found ${boardInEmps}`);
});

test('Rule #1: Zero tolerance for board members in users roster', () => {
  const boardInUsers = get("SELECT COUNT(*) as c FROM users WHERE emp_id IN ('JM-0001','JM-0002','JM-0003') OR username IN ('abdulrahman.qahtani','saeed.qahtani','salih.qahtani')").c;
  assert.strictEqual(boardInUsers, 0, `Board members in users roster must be 0, found ${boardInUsers}`);
});

// Clean up test transfer request
run("DELETE FROM transfer_requests WHERE id = ?", [testTransfer.id]);
if (testCircular) run("DELETE FROM administrative_circulars WHERE id = ?", [testCircular.id]);

console.log('\n================================================================');
console.log(`📊 MODULE 6 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
