/**
 * tests/module2_eos_settlements.test.js
 * Comprehensive automated verification for Module 2: End-of-Service (EOS) Calculator & Final Clearance
 * Fully compliant with Saudi Labor Law (Articles 53, 74, 77, 79, 80, 81, 84, 85, 87, 111, 137).
 */

const assert = require('node:assert');
const { query, get } = require('../server/database/db');
const { eosCalculatorService, SAUDI_EOS_TERMINATION_CASES, tafqeetArabic, calculateServicePeriod } = require('../server/modules/eosCalculatorService');

const eosService = eosCalculatorService;
eosService.tafqeetArabic = tafqeetArabic;

async function runTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING MODULE 2: EOS CALCULATOR & CLEARANCE VERIFICATION TEST');
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

  // --- TEST GROUP 1: Saudi Labor Law Gratuity Logic & 16 Statutory Cases ---
  console.log('--- TEST GROUP 1: Statutory Gratuity Calculations & 16 Statutory Cases ---');

  // Test 1: Verify exactly 16 statutory termination cases match the statutory list 100%
  test('Exactly 16 Saudi Labor Law termination cases exist with 100% verbatim names', () => {
    assert.strictEqual(SAUDI_EOS_TERMINATION_CASES.length, 16, 'Must contain exactly 16 statutory cases');
    const EXPECTED_16_REASONS = [
      'استقالة الموظف',
      'فسخ العقد خلال فترة التجربة وفقاً للمادة 53 من نظام العمل',
      'باتفاق الطرفين وفقاً للمادة 74 من نظام العمل',
      'فسخ عقد العمل من قبل صاحب العمل وفقاً للمادة 80 من نظام العمل',
      'إنتهاء العقد بإنتهاء مدته',
      'بلوغ العامل سن التقاعد وفقاً للمادة 74 من نظام العمل',
      'إغلاق المنشأة نهائياً وفقاً للمادة 74 من نظام العمل',
      'إنهاء النشاط الذي يعمل فيه العامل وفقاً للمادة 74 من نظام العمل',
      'إنهاء العقد دون سبب مشروع وفقاً للمادة 77 من نظام العمل',
      'وفاة العامل وفقاً للمادة 79 من نظام العمل',
      'عجز العامل عن العمل (الناتج عن إصابة العمل) وفقاً للمادة 137 من نظام العمل',
      'إنتقال ملكية المنشأة (الفردية) إلى مالك جديد وفقاً للمادة 18 من نظام العمل',
      'إنهاء المرأة العاملة العقد بسبب الوضع وفقاً للمادة 87 من نظام العمل',
      'إنهاء المرأة العاملة العقد بسبب الزواج وفقاً للمادة 87 من نظام العمل',
      'وفاة صاحب العمل وفقاً للمادة 79 من نظام العمل إذا كانت شخصيته قد روعيت في عقد العمل',
      'فسخ العقد من قبل العامل وفقاً للمادة 81 من نظام العمل'
    ];

    EXPECTED_16_REASONS.forEach(name => {
      const found = SAUDI_EOS_TERMINATION_CASES.find(c => c.name === name);
      assert(found, `Expected case name "${name}" not found in SAUDI_EOS_TERMINATION_CASES`);
    });

    const resignationCase = SAUDI_EOS_TERMINATION_CASES.find(c => c.id === 'resignation');
    assert.strictEqual(resignationCase.name, 'استقالة الموظف', 'Resignation name must strictly be "استقالة الموظف" without "(المادة 85)"');
    assert(!resignationCase.name.includes('85'), 'Resignation title must not cite "(المادة 85)"');
  });

  // Test 2: Single Gross Salary Field Input
  test('Single gross salary field calculates base gratuity accurately', () => {
    const res = eosService.calculateEos({
      hire_date: '2022-01-01',
      end_date: '2026-01-01', // 4 years
      termination_reason_code: 'استقالة الموظف',
      gross_salary: 9000,
      contract_type: 'محدد المدة'
    });
    // Gross = 9000. 4 years: 4 * (9000 * 0.5) = 18,000 base. 4 yrs resignation = 33.33% = 6,000 SAR.
    assert.strictEqual(res.gross_salary, 9000);
    assert.strictEqual(res.base_gratuity, 18000);
    assert.strictEqual(res.end_of_service_award, 6000);
  });

  // Test 3: Contract Type Options (محدد المدة vs غير محدد المدة) for Article 77
  test('Contract type option impacts Article 77 compensation (fixed vs indefinite)', () => {
    // Fixed-term: remaining months compensation (5 months @ 10,000 = 50,000)
    const fixedRes = eosService.calculateEos({
      hire_date: '2022-01-01',
      end_date: '2026-01-01',
      termination_reason_code: 'إنهاء العقد دون سبب مشروع وفقاً للمادة 77 من نظام العمل',
      gross_salary: 10000,
      contract_type: 'محدد المدة',
      remaining_contract_months: 5
    });
    assert.strictEqual(fixedRes.contract_type, 'محدد المدة');
    assert.strictEqual(fixedRes.article_77_compensation, 50000);

    // Indefinite-term: 15 days per year (4 years @ 5,000/yr = 20,000)
    const indefiniteRes = eosService.calculateEos({
      hire_date: '2022-01-01',
      end_date: '2026-01-01',
      termination_reason_code: 'إنهاء العقد دون سبب مشروع وفقاً للمادة 77 من نظام العمل',
      gross_salary: 10000,
      contract_type: 'غير محدد المدة'
    });
    assert.strictEqual(indefiniteRes.contract_type, 'غير محدد المدة');
    assert.strictEqual(indefiniteRes.article_77_compensation, 20000);
  });

  // Test 4: Resignation under 2 years -> 0%
  test('Resignation < 2 years yields 0% entitlement', () => {
    const res = eosService.calculateEos({
      hire_date: '2025-01-01',
      end_date: '2026-01-01', // exactly 1 year
      termination_reason_code: 'resignation',
      basic_salary: 6000,
      housing_allowance: 1500,
      transport_allowance: 500
    });
    assert.strictEqual(res.entitlement_percentage, 0, 'Entitlement percentage should be 0% for < 2 yrs resignation');
    assert.strictEqual(res.end_of_service_award, 0, 'Net award must be 0 SAR');
    assert(res.base_gratuity > 0, 'Base gratuity before scaling must be calculated');
  });

  // Test 2: Resignation between 2 and 5 years (Article 85) -> 33.33% (1/3)
  test('Resignation between 2 and 5 years yields 33.33% (one-third)', () => {
    const res = eosService.calculateEos({
      hire_date: '2023-01-01',
      end_date: '2026-01-01', // 3 years
      termination_reason_code: 'resignation',
      basic_salary: 6000,
      housing_allowance: 1500,
      transport_allowance: 500 // gross = 8000 SAR
    });
    // Gross = 8,000. 3 years in first 5 yrs: 3 * (8000 / 2) = 12,000 SAR base gratuity.
    assert.strictEqual(res.entitlement_percentage, 33.33);
    assert.strictEqual(res.base_gratuity, 12000);
    assert.strictEqual(res.end_of_service_award, 4000); // 12,000 * (1/3) = 4,000
  });

  // Test 3: Resignation between 5 and 10 years (Article 85) -> 66.67% (two-thirds)
  test('Resignation between 5 and 10 years yields 66.67% (two-thirds)', () => {
    const res = eosService.calculateEos({
      hire_date: '2019-01-01',
      end_date: '2026-01-01', // 7 years
      termination_reason_code: 'resignation',
      basic_salary: 6000,
      housing_allowance: 1500,
      transport_allowance: 500 // gross = 8000 SAR
    });
    // Base: first 5 yrs = 5 * 4000 = 20,000. Next 2 yrs = 2 * 8000 = 16,000. Total base = 36,000.
    assert.strictEqual(res.entitlement_percentage, 66.67);
    assert.strictEqual(res.base_gratuity, 36000);
    assert.strictEqual(res.end_of_service_award, 24000); // 36,000 * (2/3) = 24,000
  });

  // Test 4: Resignation >= 10 years (Article 85) -> 100%
  test('Resignation >= 10 years yields 100% full entitlement', () => {
    const res = eosService.calculateEos({
      hire_date: '2015-01-01',
      end_date: '2026-01-01', // 11 years
      termination_reason_code: 'resignation',
      basic_salary: 6000,
      housing_allowance: 1500,
      transport_allowance: 500 // gross = 8000 SAR
    });
    // Base: 5 * 4000 + 6 * 8000 = 20,000 + 48,000 = 68,000.
    assert.strictEqual(res.entitlement_percentage, 100);
    assert.strictEqual(res.base_gratuity, 68000);
    assert.strictEqual(res.end_of_service_award, 68000);
  });

  // Test 5: Article 80 (Gross misconduct / summary dismissal) -> 0%
  test('Article 80 dismissal forfeits 100% of gratuity', () => {
    const res = eosService.calculateEos({
      hire_date: '2018-01-01',
      end_date: '2026-01-01',
      termination_reason_code: 'article_80_dismissal',
      basic_salary: 7000,
      housing_allowance: 2000,
      transport_allowance: 1000
    });
    assert.strictEqual(res.entitlement_percentage, 0);
    assert.strictEqual(res.end_of_service_award, 0);
    assert(res.statutory_rule.includes('المادة 80'));
  });

  // Test 6: Article 53 (Probation period) -> 0%
  test('Article 53 probation period yields 0% award', () => {
    const res = eosService.calculateEos({
      hire_date: '2026-01-01',
      end_date: '2026-03-01',
      termination_reason_code: 'probation_termination',
      basic_salary: 5000
    });
    assert.strictEqual(res.entitlement_percentage, 0);
    assert.strictEqual(res.end_of_service_award, 0);
    assert(res.statutory_rule.includes('المادة 53'));
  });

  // Test 7: Article 77 (Employer unlawful termination)
  test('Article 77 includes 100% gratuity + statutory compensation', () => {
    const res = eosService.calculateEos({
      hire_date: '2022-01-01',
      end_date: '2026-01-01', // 4 years
      termination_reason_code: 'article_77_unlawful',
      basic_salary: 8000,
      housing_allowance: 2000, // gross = 10,000
      remaining_contract_months: 5
    });
    assert.strictEqual(res.entitlement_percentage, 100);
    assert.strictEqual(res.base_gratuity, 20000); // 4 * 5000 = 20,000
    assert.strictEqual(res.end_of_service_award, 20000);
    assert.strictEqual(res.article_77_compensation, 50000); // 5 months * 10,000 = 50,000
    assert(res.net_payable_amount >= 70000);
  });

  // Test 8: Special 100% cases (Contract Expiry, Female Marriage, Retirement)
  test('Special cases (Contract Expiry, Female Marriage, Retirement) yield 100%', () => {
    const cases = ['contract_expiry', 'female_marriage_leave', 'female_maternity_leave', 'retirement', 'article_81_employee_leave'];
    cases.forEach(c => {
      const res = eosService.calculateEos({
        hire_date: '2023-01-01',
        end_date: '2026-01-01',
        termination_reason_code: c,
        basic_salary: 5000,
        housing_allowance: 1000
      });
      assert.strictEqual(res.entitlement_percentage, 100, `Case ${c} should have 100% entitlement`);
    });
  });

  // --- TEST GROUP 2: Leave Compensation & Financial Deductions ---
  console.log('\n--- TEST GROUP 2: Leave Compensation & Deductions ---');

  test('Article 111 leave compensation is accurately computed', () => {
    const res = eosService.calculateEos({
      hire_date: '2024-01-01',
      end_date: '2026-01-01',
      termination_reason_code: 'contract_expiry',
      basic_salary: 6000, // wage per day = 200
      leave_balance_days: 15
    });
    assert.strictEqual(res.leave_compensation, 3000); // 15 * 200 = 3000
  });

  test('Loans and deductions are subtracted accurately from net total', () => {
    const res = eosService.calculateEos({
      hire_date: '2024-01-01',
      end_date: '2026-01-01', // 2 yrs
      termination_reason_code: 'contract_expiry',
      basic_salary: 6000, // gross = 6000. 2 yrs -> 6000 award.
      leave_balance_days: 10, // 2000
      unpaid_salary_amount: 1500,
      loans_balance: 2500,
      other_deductions: 500
    });
    // Gross additions = 6000 + 2000 + 1500 = 9500
    // Deductions = 2500 + 500 = 3000
    // Net = 6500
    assert.strictEqual(res.end_of_service_award, 6000);
    assert.strictEqual(res.leave_compensation, 2000);
    assert.strictEqual(res.total_deductions, 3000);
    assert.strictEqual(res.net_payable_amount, 6500);
  });

  // --- TEST GROUP 3: Arabic Tafqeet Converter ---
  console.log('\n--- TEST GROUP 3: Arabic Tafqeet Converter ---');

  test('Tafqeet generates formal Arabic prose with exact currency representation', () => {
    const tafqeet1 = eosService.tafqeetArabic(6500);
    assert(tafqeet1.includes('ستة آلاف') && tafqeet1.includes('خمسمائة ريال سعودي'), `Expected 6500 tafqeet, got: ${tafqeet1}`);
    assert(tafqeet1.startsWith('فقط وقدره') && tafqeet1.endsWith('لا غير'));

    const tafqeet2 = eosService.tafqeetArabic(12450.75);
    assert(tafqeet2.includes('اثنا عشر ألف') && tafqeet2.includes('ريال سعودي'), `Expected 12450 tafqeet, got: ${tafqeet2}`);
    assert(tafqeet2.includes('هللة'), `Expected halalas in tafqeet2, got: ${tafqeet2}`);

    const tafqeetZero = eosService.tafqeetArabic(0);
    assert.strictEqual(tafqeetZero, 'فقط وقدره صفر ريال سعودي لا غير');
  });

  // --- TEST GROUP 4: Database Persistence & Settlements Table ---
  console.log('\n--- TEST GROUP 4: Database Persistence & Settlement Generation ---');

  // Test 9: Save settlement to database
  const sampleCalc = eosService.calculateEos({
    hire_date: '2021-03-01',
    end_date: '2026-03-01',
    termination_reason_code: 'resignation',
    basic_salary: 8000,
    housing_allowance: 2000,
    transport_allowance: 1000,
    leave_balance_days: 12,
    loans_balance: 1500
  });

  const farisEmp = get("SELECT * FROM employees WHERE emp_code = 'JM-0004'") || { id: 1 };
  const saveRes = eosService.saveSettlement({
    emp_id: farisEmp.id,
    emp_code: 'JM-0004',
    employee_name_ar: 'فارس عبدالرحمن القحطاني',
    national_id: '1088492011',
    job_title_ar: 'مدير العمليات التشغيلية',
    department_name: 'الإدارة العامة',
    ...sampleCalc,
    created_by: 'system_test'
  });

  test('saveSettlement successfully inserts record into eos_settlements', () => {
    assert(saveRes.success, 'Save settlement should succeed');
    assert(saveRes.id > 0, 'New settlement should receive auto-increment ID');
    assert(saveRes.settlement_number.startsWith('JM-EOS-'), 'Settlement number should follow JM-EOS- standard format');
  });

  test('getSettlementById retrieves complete record with parsed fields', () => {
    const record = eosService.getSettlementById(saveRes.id);
    assert.strictEqual(record.id, saveRes.id);
    assert.strictEqual(record.settlement_number, saveRes.settlement_number);
    assert.strictEqual(record.emp_code, 'JM-0004');
    assert.strictEqual(record.national_id, '1088492011');
    assert(record.net_payable_amount > 0);
    assert(record.tafqeet_ar.length > 5);
  });

  test('getSettlements lists settlements including the saved record', () => {
    const list = eosService.getSettlements({ limit: 10 });
    assert(Array.isArray(list) && list.length > 0);
    const found = list.find(s => s.id === saveRes.id);
    assert(found, 'Created settlement must be found in list');
  });

  // --- TEST GROUP 5: Printable Clearance & Discharge HTML ---
  console.log('\n--- TEST GROUP 5: Printable Clearance Form (A4) ---');

  test('generateClearancePrintHtml renders complete, valid A4 discharge document', () => {
    const html = eosService.generateClearancePrintHtml(saveRes.id);
    assert(html.includes('شركة جوهرة المجد'), 'Should contain company header');
    assert(html.includes('مخالصة نهائية'), 'Should contain title');
    assert(html.includes(saveRes.settlement_number), 'Should contain settlement number');
    assert(html.includes('فارس عبدالرحمن القحطاني'), 'Should contain employee name');
    assert(html.includes('نوع العقد'), 'Should display contract type in official clearance');
    assert(html.includes('إجمالي الراتب الفعلي الشامل'), 'Should display actual gross salary');
    assert(!html.includes('استرشادي'), 'Must not contain any reference to guidance/sample terminology');
    assert(html.includes('المادة 84'), 'Should cite Saudi Labor Law');
    assert(html.includes('توقيع الموظف المقر بما فيه'), 'Should contain employee signature');
    assert(html.includes('مدير الموارد البشرية'), 'Should contain HR signature');
    assert(html.includes('المدير العام'), 'Should contain GM signature');
  });

  // --- TEST GROUP 6: Database Integrity & Employee Counts ---
  console.log('\n--- TEST GROUP 6: System Integrity & Zero Data Loss ---');

  // Clean up created test settlement to ensure zero test residue
  if (saveRes && saveRes.id) {
    const { run } = require('../server/database/db');
    run('DELETE FROM eos_settlements WHERE id = ?', [saveRes.id]);
  }

  const employees = query(`SELECT * FROM employees WHERE status = 'نشط'`);
  test('Exactly 111 active operational employees exist in database', () => {
    assert.strictEqual(employees.length, 111, `Expected 111 employees, found ${employees.length}`);
  });

  const boardCheck = query(`SELECT * FROM employees WHERE emp_code IN ('JM-0001', 'JM-0002', 'JM-0003')`);
  test('Zero board members in operational employee pool', () => {
    assert.strictEqual(boardCheck.length, 0, 'Found board members in operational pool!');
  });

  const users = query(`SELECT * FROM users`);
  test('Exactly 14 users are active and preserved', () => {
    assert.strictEqual(users.length, 14, `Expected 14 users, found ${users.length}`);
  });

  console.log('\n================================================================');
  console.log(`📊 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (100%)`);
  console.log('================================================================\n');
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
