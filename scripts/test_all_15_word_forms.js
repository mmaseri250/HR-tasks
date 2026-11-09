const { fillOfficialWordForm, FORM_MAP } = require('../server/modules/officialDocxFiller');
const db = require('../server/database/db');

async function testAll15Forms() {
  console.log('Testing Word Generation for all 15 Certified Official Forms...');
  const emp = db.get("SELECT * FROM employees WHERE emp_code = 'JM-0001'");
  
  const formCodes = [
    'JM-HR-F-001', 'JM-HR-F-002', 'JM-HR-F-003', 'JM-HR-F-004', 'JM-HR-F-005',
    'JM-HR-F-006', 'JM-HR-F-007', 'JM-HR-F-008', 'JM-HR-F-009', 'JM-HR-F-010',
    'JM-HR-F-011', 'JM-HR-F-012', 'JM-HR-F-013', 'JM-HR-F-014', 'JM-HR-F-015'
  ];

  let passed = 0;
  for (const code of formCodes) {
    try {
      const res = await fillOfficialWordForm(code, emp, {
        amount: 5000,
        start_date: '2026-11-15',
        end_date: '2026-11-20',
        days_count: 5,
        reason: 'إجازة سنوية اعتيادية'
      });
      if (res && res.buffer && res.buffer.length > 5000) {
        console.log(`✓ [PASS] ${code}: ${res.filename} (${res.buffer.length} bytes)`);
        passed++;
      } else {
        console.error(`✗ [FAIL] ${code}: Buffer too small or invalid`);
      }
    } catch (err) {
      console.error(`✗ [FAIL] ${code}: ${err.message}`);
    }
  }

  // Also test alias 'employee_status' that was previously reported failing
  try {
    const res = await fillOfficialWordForm('employee_status', emp);
    console.log(`✓ [PASS] Alias 'employee_status': ${res.filename} (${res.buffer.length} bytes)`);
    passed++;
  } catch (err) {
    console.error(`✗ [FAIL] Alias 'employee_status': ${err.message}`);
  }

  console.log(`\nResult: ${passed} / 16 tests passed.`);
  if (passed !== 16) {
    process.exit(1);
  }
}

testAll15Forms();
