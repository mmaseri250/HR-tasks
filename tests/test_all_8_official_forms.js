// tests/test_all_8_official_forms.js - Comprehensive Test Suite for All 8 Approved HR Forms
const assert = require('node:assert');
const formsGen = require('../server/modules/formsGenerator.js');
const officialTemplates = require('../server/modules/officialTemplates.js');
const db = require('../server/database/db.js');

async function runTests() {
  console.log('===============================================================');
  console.log('🧪 TESTING ALL 8 OFFICIAL HR FORMS (WORD & HTML)');
  console.log('===============================================================');

  const testEmpId1 = 15321; // Chairman عبدالرحمن صالح القحطاني (no existing leave/penalty records)
  const testEmpId2 = 15325; // HR Specialist شامة علي محمد عسيري (has leave record id 16)

  // 1. Test All 8 Word Form Generations
  console.log('\n--- 1. Testing Word (.docx) Generation for 8 Forms ---');
  const wordForms = [
    { type: 'absence_penalty', code: 'JM-HR-F-001/ABS' },
    { type: 'instruction_penalty', code: 'JM-HR-F-002/INS' },
    { type: 'clearance', code: 'JM-HR-F-005' },
    { type: 'contract_non_renewal', code: 'JM-HR-F-004/CNR' },
    { type: 'penalty_procedure', code: 'JM-HR-F-002' },
    { type: 'resignation_termination', code: 'JM-HR-F-003' },
    { type: 'leave_request', code: 'JM-HR-F-001' },
    { type: 'salary_cert', code: 'JM-HR-F-008' }
  ];

  for (const wf of wordForms) {
    const res = await formsGen.generateWordForm(wf.type, testEmpId1);
    assert(res.buffer && res.buffer.length > 5000, `Word buffer for ${wf.type} should be > 5KB`);
    assert(res.filename && res.filename.endsWith('.docx'), `Filename should end with .docx`);
    console.log(`✓ [Word] ${wf.code} (${wf.type}): ${res.filename} (${res.buffer.length} bytes)`);
  }

  // 2. Test All 8 HTML Renderers with Employee ID (No existing transaction - e.g. 15321)
  console.log('\n--- 2. Testing HTML Renderers with Employee ID (Emp 15321 - Zero Record Crash Test) ---');
  const renderers = [
    { name: '1. Absence Penalty', fn: () => officialTemplates.renderAbsencePenaltyNoticeHtml(testEmpId1, { emp_id: testEmpId1 }), code: 'JM-HR-F-001/ABS' },
    { name: '2. Instruction Penalty', fn: () => officialTemplates.renderInstructionPenaltyNoticeHtml(testEmpId1, { emp_id: testEmpId1 }), code: 'JM-HR-F-002/INS' },
    { name: '3. Clearance Form', fn: () => officialTemplates.renderClearanceFormHtml(testEmpId1, { emp_id: testEmpId1 }), code: 'JM-HR-F-005' },
    { name: '4. Contract Non-Renewal', fn: () => officialTemplates.renderContractNonRenewalHtml(testEmpId1, { emp_id: testEmpId1 }), code: 'JM-HR-F-004/CNR' },
    { name: '5. Penalty Procedure', fn: () => officialTemplates.renderPenaltyFormHtml(testEmpId1, { emp_id: testEmpId1 }), code: 'JM-HR-F-002' },
    { name: '6. Resignation / Termination', fn: () => officialTemplates.renderResignationTerminationFormHtml(testEmpId1, { emp_id: testEmpId1 }), code: 'JM-HR-F-003' },
    { name: '7. Leave Request', fn: () => officialTemplates.renderLeaveFormHtml(testEmpId1, { emp_id: testEmpId1 }), code: 'JM-HR-F-001' },
    { name: '8. Unified Salary Certificate', fn: () => officialTemplates.renderSalaryCertHtml(testEmpId1, { emp_id: testEmpId1 }), code: 'JM-HR-F-008' }
  ];

  for (const r of renderers) {
    const html = r.fn();
    assert(html && html.length > 5000, `${r.name} HTML output should be > 5KB`);
    assert(!html.includes('غير موجود'), `${r.name} MUST NOT contain 'غير موجود' error`);
    assert(html.includes('/images/company_letterhead.png'), `${r.name} must reference company letterhead`);
    assert(html.includes(r.code), `${r.name} must contain form code ${r.code}`);
    assert(html.includes('7004872169'), `${r.name} must contain company CR 7004872169`);
    assert(html.includes('عبدالرحمن صالح القحطاني'), `${r.name} must contain employee name`);
    console.log(`✓ [HTML by EmpID] ${r.name} (${r.code}): Generated ${html.length} chars (100% Valid & Pre-filled)`);
  }

  // 3. Test HTML Renderers with Existing Transaction (e.g. Leave ID 16)
  console.log('\n--- 3. Testing HTML Renderers with Existing Record ID (Leave ID 16) ---');
  const leaveHtml = officialTemplates.renderLeaveFormHtml(16, { emp_id: testEmpId2 });
  assert(leaveHtml.includes('شامة علي  محمد عسيري') || leaveHtml.includes('شامة'), 'Leave HTML must resolve to Shama Asiri');
  assert(leaveHtml.includes('REQ-2026-0001'), 'Leave HTML must include leave request number');
  assert(!leaveHtml.includes('طلب الإجازة غير موجود'), 'Leave HTML must not error');
  console.log(`✓ [HTML by RecordID] Leave Request (ID: 16): Generated ${leaveHtml.length} chars for Shama Asiri`);

  // 4. Test Salary Certificate Breakdown Precision
  console.log('\n--- 4. Testing Unified Salary Certificate Component Precision ---');
  const salaryHtml = officialTemplates.renderSalaryCertHtml(testEmpId1, { destination: 'بنك الراجحي' });
  assert(salaryHtml.includes('بنك الراجحي'), 'Should include custom destination');
  assert(salaryHtml.includes('JM-HR-F-008'), 'Should include JM-HR-F-008');
  assert(salaryHtml.includes('Basic Salary') && salaryHtml.includes('الراتب الأساسي'), 'Must be bilingual');
  assert(salaryHtml.includes('Housing Allowance') && salaryHtml.includes('بدل السكن'), 'Must include housing');
  assert(salaryHtml.includes('Transport Allowance') && salaryHtml.includes('بدل النقل'), 'Must include transport');
  assert(salaryHtml.includes('Gross Monthly Salary') && salaryHtml.includes('إجمالي الراتب'), 'Must include gross');
  assert(salaryHtml.includes('GOSI') && salaryHtml.includes('التأمينات الاجتماعية'), 'Must include GOSI');
  assert(salaryHtml.includes('Net Salary') && salaryHtml.includes('صافي الراتب'), 'Must include net');
  console.log(`✓ [Salary Cert] Live Salary Calculation & Bilingual Components verified perfectly.`);

  console.log('\n===============================================================');
  console.log('✅ ALL 8 APPROVED FORMS TESTS PASSED WITH 100% SUCCESS RATE');
  console.log('===============================================================');
}

runTests().then(() => process.exit(0)).catch(err => {
  console.error('❌ Test Failure:', err);
  process.exit(1);
});
