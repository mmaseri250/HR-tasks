/**
 * tests/module5_medical_insurance_health_cards.test.js
 * Verification Suite for Module 5: Medical Insurance, Health Education & Municipal Health Cards
 * Jawharat Al-Majd HRMS — CCHI & Baladiya Compliant
 */

const assert = require('node:assert');
const { query, get, run } = require('../server/database/db');
const healthService = require('../server/modules/healthInsuranceService');

console.log('================================================================');
console.log('🧪 RUNNING MODULE 5: MEDICAL INSURANCE & HEALTH CARDS TEST');
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

// Clean any pre-existing test data
run('DELETE FROM health_cards');
run('DELETE FROM employee_insurance_cards');
run('DELETE FROM health_education_articles');

// --- TEST GROUP 1: Clean Initial State & Policies ---
console.log('--- TEST GROUP 1: Clean Initial State & Policies ---');

test('Clean initial state has zero mock cards and policies', () => {
  const cards = healthService.getInsuranceCards();
  const healthCards = healthService.getHealthCards();
  const articles = healthService.getHealthArticles();
  assert.strictEqual(cards.length, 0, 'Must have 0 mock insurance cards');
  assert.strictEqual(healthCards.length, 0, 'Must have 0 mock health cards');
  assert.strictEqual(articles.length, 0, 'Must have 0 mock articles');
});

let testPolicy = null;
test('createPolicy creates valid CCHI policy with coverage limits', () => {
  testPolicy = healthService.createPolicy({
    policy_no: 'POL-TEST-MED-' + Date.now(),
    provider_name: 'شركة الصقر للتأمين التعاوني',
    policy_start: '2026-01-01',
    policy_end: '2026-12-31',
    category: 'وثيقة عمالة مساندة',
    network_tier: 'الشبكة الفضية CCHI',
    max_coverage_per_person: 600000,
    status: 'سارية'
  });

  assert(testPolicy.id > 0);
  assert(testPolicy.policy_no.startsWith('POL-TEST-MED-'));
  assert.strictEqual(testPolicy.max_coverage_per_person, 600000);
});

test('updatePolicy updates policy details and status', () => {
  const updated = healthService.updatePolicy(testPolicy.id, {
    max_coverage_per_person: 750000,
    notes: 'تمت ترقية الشبكة الطبية'
  });
  assert.strictEqual(updated.max_coverage_per_person, 750000);
  assert(updated.notes.includes('ترقية الشبكة'));
});

// --- TEST GROUP 2: Employee Insurance Cards (CCHI) ---
console.log('\n--- TEST GROUP 2: Employee Insurance Cards (CCHI) ---');

let testCard = null;
test('createInsuranceCard issues card for operational employee with unique member_id', () => {
  const targetEmp = get(`SELECT id, emp_code, full_name_ar FROM employees WHERE status = 'نشط' LIMIT 1`);
  assert(targetEmp);

  const testMemberId = 'BUP-TEST-' + Date.now();
  testCard = healthService.createInsuranceCard({
    emp_id: targetEmp.id,
    policy_id: testPolicy.id,
    member_id: testMemberId,
    class_category: 'VIP',
    copay_percent: 0,
    dependents_count: 3,
    blood_group: 'AB+',
    expiry_date: '2026-12-31',
    status: 'سارية'
  });

  assert(testCard.id > 0);
  assert.strictEqual(testCard.member_id, testMemberId);
  assert.strictEqual(testCard.class_category, 'VIP');
  assert.strictEqual(testCard.copay_percent, 0);

  // Duplicate member_id prevention
  assert.throws(() => {
    healthService.createInsuranceCard({
      emp_id: targetEmp.id,
      member_id: testMemberId
    });
  }, /مسجل مسبقاً/);
});

test('updateInsuranceCard updates class and chronic conditions', () => {
  const updated = healthService.updateInsuranceCard(testCard.id, {
    class_category: 'A',
    copay_percent: 10,
    chronic_conditions: 'فحص دوري لضغط الدم'
  });
  assert.strictEqual(updated.class_category, 'A');
  assert.strictEqual(updated.copay_percent, 10);
  assert(updated.chronic_conditions.includes('ضغط الدم'));
});

// --- TEST GROUP 3: Municipal Health Cards (البلدية) & Alarms ---
console.log('\n--- TEST GROUP 3: Municipal Health Cards (البلدية) & Alarms ---');

test('computeExpiry calculates municipal card expiry status (<30 days and expired)', () => {
  const pastDate = '2025-01-01';
  const expPast = healthService.computeExpiry(pastDate);
  assert.strictEqual(expPast.status, 'expired');
  assert(expPast.daysLeft < 0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 15);
  const expSoon = healthService.computeExpiry(tomorrow.toISOString().split('T')[0]);
  assert.strictEqual(expSoon.status, 'expiring_soon');
  assert(expSoon.daysLeft <= 30 && expSoon.daysLeft > 0);
});

let testHealthCard = null;
test('createHealthCard creates municipal card with profession and fitness result', () => {
  const targetEmp = get(`SELECT id, emp_code, full_name_ar FROM employees WHERE status = 'نشط' LIMIT 1`);
  assert(targetEmp);

  testHealthCard = healthService.createHealthCard({
    emp_id: targetEmp.id,
    card_no: 'BALAD-TEST-' + Date.now(),
    municipality_name: 'أمانة منطقة عسير',
    profession: 'فني تشغيل وتغذية',
    issue_date: '2026-01-15',
    expiry_date: '2027-01-15',
    medical_center: 'مجمع عسير الطبي المعتمد',
    fitness_result: 'لائق طبياً',
    status: 'سارية',
    notes: 'شهادة صحية مهنية رسمية'
  });

  assert(testHealthCard.id > 0);
  assert.strictEqual(testHealthCard.profession, 'فني تشغيل وتغذية');
  assert.strictEqual(testHealthCard.fitness_result, 'لائق طبياً');
  assert.strictEqual(testHealthCard.status, 'سارية');
});

test('getInsuranceKpis accurately aggregates insurance and Baladiya alarms', () => {
  const kpis = healthService.getInsuranceKpis();
  assert(kpis.total_policies >= 1);
  assert(kpis.total_insured_employees >= 1);
  assert(kpis.total_municipal_cards >= 1);
  assert(typeof kpis.municipal_alerts.expiring_soon === 'number');
  assert(typeof kpis.municipal_alerts.expired === 'number');
  assert(typeof kpis.total_alerts === 'number');
});

// --- TEST GROUP 4: Health Education & Awareness Portal ---
console.log('\n--- TEST GROUP 4: Health Education & Awareness Portal ---');

let createdArticle = null;
test('createHealthArticle adds an awareness article with emergency contacts', () => {
  createdArticle = healthService.createHealthArticle({
    title_ar: 'الوقاية من الغبار والجسيمات العالقة في مواقع الحفريات',
    title_en: 'Dust & Airborne Particles Protection in Excavation Sites',
    category: 'سلامة ميدانية',
    summary_ar: 'إرشادات استخدام كمامات N95 ونظام ترطيب التربة لمنع تطاير الأتربة.',
    content_ar: '<p>يجب ارتداء وسائل الحماية التنفسية المعتمدة في كافة أعمال الهدم والحفر.</p>',
    target_audience: 'عمال الحفر وسائقو المعدات الثقيلة',
    emergency_contacts: 'مسؤول السلامة بالمشروع: 0550001122'
  });

  assert(createdArticle.id > 0);
  assert(createdArticle.title_ar.includes('الغبار'));
  assert.strictEqual(createdArticle.category, 'سلامة ميدانية');
});

// --- TEST GROUP 5: Official A4 Printable Documents & Posters ---
console.log('\n--- TEST GROUP 5: Official A4 Printable Documents & Posters ---');

test('generateInsuranceCardPrintHtml generates CCHI digital health card certificate', () => {
  const html = healthService.generateInsuranceCardPrintHtml(testCard.id);
  assert(html.includes('شركة جوهرة المجد للمقاولات والتجارة'), 'Must contain company header');
  assert(html.includes('مجلس الضمان الصحي'), 'Must cite CCHI');
  assert(html.includes(testCard.member_id), 'Must contain membership number');
  assert(html.includes('فئة التأمين'), 'Must contain insurance class');
});

test('generateHealthCardPrintHtml generates official Baladiya worker health card', () => {
  const html = healthService.generateHealthCardPrintHtml(testHealthCard.id);
  assert(html.includes('الشهادة الصحية المهنية'), 'Must contain Baladiya certificate title');
  assert(html.includes(testHealthCard.card_no), 'Must contain card number');
  assert(html.includes(testHealthCard.municipality_name), 'Must contain municipality name');
  assert(html.includes('لائق طبياً'), 'Must contain fitness result');
});

test('generateHealthArticlePrintHtml generates printable A4 health awareness poster', () => {
  const html = healthService.generateHealthArticlePrintHtml(createdArticle.id);
  assert(html.includes('شركة جوهرة المجد'), 'Must contain company header');
  assert(html.includes(createdArticle.title_ar), 'Must contain article title');
  assert(html.includes('نشرة توعية صحية رسمية'), 'Must contain official banner');
});

// --- TEST GROUP 6: Export Operations ---
console.log('\n--- TEST GROUP 6: Export Operations (CSV with BOM) ---');

test('exportInsuranceCardsCsv generates UTF-8 BOM CSV for Arabic Excel', () => {
  const csv = healthService.exportInsuranceCardsCsv();
  assert(typeof csv === 'string');
  assert.strictEqual(csv.charCodeAt(0), 0xFEFF, 'Must start with UTF-8 BOM');
  assert(csv.includes('رقم العضوية'));
});

test('exportHealthCardsCsv generates UTF-8 BOM CSV for Baladiya cards', () => {
  const csv = healthService.exportHealthCardsCsv();
  assert(typeof csv === 'string');
  assert.strictEqual(csv.charCodeAt(0), 0xFEFF, 'Must start with UTF-8 BOM');
  assert(csv.includes('رقم الشهادة الصحية'));
});

// Clean up all created test records
run('DELETE FROM health_cards WHERE id = ?', [testHealthCard.id]);
run('DELETE FROM employee_insurance_cards WHERE id = ?', [testCard.id]);
run('DELETE FROM health_education_articles WHERE id = ?', [createdArticle.id]);
healthService.deletePolicy(testPolicy.id);

// --- TEST GROUP 7: Strict Rule #1 Headcount & Data Integrity ---
console.log('\n--- TEST GROUP 7: Strict Rule #1 Headcount & Data Integrity ---');

test('Strict Rule #1: Exactly 108 active operational employees preserved', () => {
  const activeCount = get(`SELECT COUNT(*) as cnt FROM employees WHERE status = 'نشط'`).cnt;
  assert.strictEqual(activeCount, 108, `Expected 108, got ${activeCount}`);
});

test('Strict Rule #1: Exactly 113 total employees (108 active + 5 terminated) preserved', () => {
  const totalCount = get(`SELECT COUNT(*) as cnt FROM employees`).cnt;
  assert.strictEqual(totalCount, 113, `Expected 113, got ${totalCount}`);
});

test('Strict Rule #1: Exactly 14 users are active and preserved', () => {
  const userCount = get(`SELECT COUNT(*) as cnt FROM users`).cnt;
  assert.strictEqual(userCount, 14, `Expected 14, got ${userCount}`);
});

console.log('\n================================================================');
console.log(`📊 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
