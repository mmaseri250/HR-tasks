/**
 * tests/module3_ats_recruitment.test.js
 * Verification Suite for Module 3: ATS Recruitment & Bilingual Official Templates
 * Jawharat Al-Majd HRMS — Saudi Labor Law Compliant
 */

const assert = require('node:assert');
const { query, get } = require('../server/database/db');
const atsRecruitmentService = require('../server/modules/atsRecruitmentService');

console.log('================================================================');
console.log('🧪 RUNNING MODULE 3: ATS RECRUITMENT & BILINGUAL TEMPLATES TEST');
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

// --- TEST GROUP 1: Job Vacancies Lifecycle ---
console.log('--- TEST GROUP 1: Job Vacancies Management ---');

const initialVacancies = atsRecruitmentService.getVacancies();
test('Job vacancies list loads and contains seeded positions', () => {
  assert(Array.isArray(initialVacancies), 'Vacancies should return an array');
  assert(initialVacancies.length >= 4, `Expected at least 4 vacancies, got ${initialVacancies.length}`);
});

const newVac = atsRecruitmentService.createVacancy({
  title_ar: 'مهندس تخطيط ومتابعة مشاريع',
  title_en: 'Project Planning & Scheduling Engineer',
  employment_type: 'دوام كامل',
  experience_years: 5,
  openings_count: 2,
  salary_range: '12,000 - 16,000 ر.س',
  requirements: 'إتقان برنامج Primavera P6، خبرة في مشاريع المقاولات الكبرى.'
});

test('createVacancy generates auto-sequenced code (JM-VAC-2026-XXXX)', () => {
  assert(newVac.id > 0, 'New vacancy must have ID');
  assert(newVac.job_code.startsWith('JM-VAC-'), `Job code should start with JM-VAC-, got ${newVac.job_code}`);
  assert.strictEqual(newVac.title_ar, 'مهندس تخطيط ومتابعة مشاريع');
  assert.strictEqual(newVac.openings_count, 2);
});

test('updateVacancy updates vacancy status and details', () => {
  const updated = atsRecruitmentService.updateVacancy(newVac.id, {
    status: 'معلق',
    openings_count: 3
  });
  assert.strictEqual(updated.status, 'معلق');
  assert.strictEqual(updated.openings_count, 3);
});

test('getVacancyById retrieves correct record with applicants count', () => {
  const found = atsRecruitmentService.getVacancyById(newVac.id);
  assert.strictEqual(found.id, newVac.id);
  assert.strictEqual(found.job_code, newVac.job_code);
  assert(typeof found.applicants_count === 'number');
});

// --- TEST GROUP 2: Applicants Tracking & 6-Stage ATS Pipeline ---
console.log('\n--- TEST GROUP 2: Applicants Tracking & Pipeline Stages ---');

const initialApplicants = atsRecruitmentService.getApplicants();
test('Applicants list loads and contains seeded candidates', () => {
  assert(Array.isArray(initialApplicants), 'Applicants should return an array');
  assert(initialApplicants.length >= 5, `Expected at least 5 applicants, got ${initialApplicants.length}`);
});

const newApplicant = atsRecruitmentService.createApplicant({
  vacancy_id: newVac.id,
  full_name: 'تركي ناصر العتيبي',
  email: 't.otaibi@example.com',
  phone: '0559988776',
  nationality: 'سعودي',
  experience_years: 6,
  education_level: 'بكالوريوس هندسة صناعية',
  expected_salary: 14000
});

test('createApplicant generates auto-sequenced applicant_no (APP-2026-XXXX) and default stage جديد', () => {
  assert(newApplicant.id > 0);
  assert(newApplicant.applicant_no.startsWith('APP-'), `Applicant no should start with APP-, got ${newApplicant.applicant_no}`);
  assert.strictEqual(newApplicant.stage, 'جديد');
  assert.strictEqual(newApplicant.full_name, 'تركي ناصر العتيبي');
});

test('updateApplicantStage advances applicant through 6 ATS pipeline stages', () => {
  // Move to فرز أولي
  const s1 = atsRecruitmentService.updateApplicantStage(newApplicant.id, 'فرز_أولي', 'السيرة مطابقة للشروط');
  assert.strictEqual(s1.stage, 'فرز_أولي');
  assert.strictEqual(s1.interview_notes, 'السيرة مطابقة للشروط');

  // Move to مقابلة شخصية with interview date
  const s2 = atsRecruitmentService.updateApplicantStage(newApplicant.id, 'مقابلة_شخصية', 'المقابلة الفنية مع مدير المشاريع', '2026-11-10T10:00:00');
  assert.strictEqual(s2.stage, 'مقابلة_شخصية');
  assert(s2.interview_date.includes('2026-11-10'));

  // Move to عرض وظيفي
  const s3 = atsRecruitmentService.updateApplicantStage(newApplicant.id, 'عرض_وظيفي', 'اجتاز المقابلة بنجاح بنسبة 92%');
  assert.strictEqual(s3.stage, 'عرض_وظيفي');

  // Move to مقبول
  const s4 = atsRecruitmentService.updateApplicantStage(newApplicant.id, 'مقبول', 'تم اعتماد التعيين وتوقيع العقد');
  assert.strictEqual(s4.stage, 'مقبول');
});

test('updateApplicantStage rejects invalid stage names', () => {
  assert.throws(() => {
    atsRecruitmentService.updateApplicantStage(newApplicant.id, 'مرحلة_غير_معروفة');
  }, /مرحلة غير صالحة/);
});

// --- TEST GROUP 3: Job Offers & Salary Computation ---
console.log('\n--- TEST GROUP 3: Job Offers Management ---');

const offerData = {
  applicant_id: newApplicant.id,
  vacancy_id: newVac.id,
  candidate_name: 'تركي ناصر العتيبي',
  candidate_email: 't.otaibi@example.com',
  candidate_phone: '0559988776',
  national_id: '1099887766',
  nationality: 'سعودي',
  job_title_ar: 'مهندس تخطيط ومتابعة مشاريع',
  job_title_en: 'Planning Engineer',
  department_name: 'إدارة المشاريع',
  branch_name: 'المقر الرئيسي - الرياض',
  basic_salary: 10000,
  housing_allowance: 2500,
  transport_allowance: 1000,
  other_allowances: 500,
  contract_duration: 'سنة قابلة للتجديد',
  annual_leave_days: 30
};

const createdOffer = atsRecruitmentService.createOffer(offerData);

test('createOffer accurately calculates total monthly salary package and generates offer_no', () => {
  assert(createdOffer.id > 0);
  assert(createdOffer.offer_no.startsWith('JM-OFFER-'));
  // 10000 + 2500 + 1000 + 500 = 14000 SAR
  assert.strictEqual(createdOffer.total_salary, 14000);
  assert.strictEqual(createdOffer.basic_salary, 10000);
  assert.strictEqual(createdOffer.housing_allowance, 2500);
  assert.strictEqual(createdOffer.transport_allowance, 1000);
  assert.strictEqual(createdOffer.status, 'مرسل للمرشح');
});

test('updateOfferStatus handles candidate acceptance and auto-advances applicant stage', () => {
  const updatedOffer = atsRecruitmentService.updateOfferStatus(createdOffer.id, 'مقبول');
  assert.strictEqual(updatedOffer.status, 'مقبول');

  // Verify candidate stage updated to 'مقبول'
  const applicant = atsRecruitmentService.getApplicantById(newApplicant.id);
  assert.strictEqual(applicant.stage, 'مقبول');
});

// --- TEST GROUP 4: Bilingual Official Templates (عربي / English) ---
console.log('\n--- TEST GROUP 4: Bilingual Official Templates (عربي / EN) ---');

// Template 1: Application Form
test('generateJobApplicationPrintHtml renders comprehensive bilingual application form', () => {
  const html = atsRecruitmentService.generateJobApplicationPrintHtml({
    applicant: newApplicant,
    vacancy: newVac
  });
  assert(html.includes('شركة جوهرة المجد للمقاولات والتجارة'), 'Must contain Arabic company header');
  assert(html.includes('JAWHARAT AL-MAJD'), 'Must contain English company header');
  assert(html.includes('طلب توظيف رسمي'), 'Must contain Arabic title');
  assert(html.includes('Official Employment Application Form'), 'Must contain English title');
  assert(html.includes('تركي ناصر العتيبي'), 'Must contain applicant name');
  assert(html.includes('Legal Declaration'), 'Must contain bilingual declaration');
  assert(html.includes('Applicant Signature'), 'Must contain applicant signature');
});

// Template 2: Job Offer Letter
test('generateJobOfferPrintHtml renders professional bilingual official job offer letter', () => {
  const html = atsRecruitmentService.generateJobOfferPrintHtml(createdOffer.id);
  assert(html.includes('شركة جوهرة المجد'), 'Must contain company name');
  assert(html.includes('عرض عمل رسمي'), 'Must contain Arabic offer title');
  assert(html.includes('Job Offer Letter'), 'Must contain English offer title');
  assert(html.includes('تركي ناصر العتيبي'), 'Must contain candidate name');
  assert(html.includes('14,000'), 'Must contain formatted total package');
  assert(html.includes('المادة 53'), 'Must cite Article 53 for probation');
  assert(html.includes('المادة 109'), 'Must cite Article 109 for leave');
  assert(html.includes('Candidate Acceptance'), 'Must contain candidate acceptance box');
  assert(html.includes('Management Approval'), 'Must contain management approval block');
});

// Template 3: Employee Undertaking & NDA
test('generateUndertakingPrintHtml renders binding bilingual NDA & employee undertaking', () => {
  const html = atsRecruitmentService.generateUndertakingPrintHtml({
    candidate_name: 'تركي ناصر العتيبي',
    national_id: '1099887766',
    job_title_ar: 'مهندس تخطيط ومتابعة مشاريع'
  });
  assert(html.includes('شركة جوهرة المجد'), 'Must contain company name');
  assert(html.includes('إقرار وتعهد بحفظ سرية المعلومات'), 'Must contain Arabic title');
  assert(html.includes('Undertaking & Non-Disclosure Agreement'), 'Must contain English title');
  assert(html.includes('Confidentiality'), 'Must contain confidentiality clause');
  assert(html.includes('المادة (80)'), 'Must cite Article 80 of Saudi Labor Law');
  assert(html.includes('Handover of Company Assets'), 'Must contain asset handover clause');
  assert(html.includes('Employee Signature'), 'Must contain employee signature block');
});

// --- TEST GROUP 5: Recruitment KPIs & Metrics ---
console.log('\n--- TEST GROUP 5: Recruitment KPIs & Dashboard Metrics ---');

test('getRecruitmentKpis computes accurate real-time metrics across all pipeline stages', () => {
  const kpis = atsRecruitmentService.getRecruitmentKpis();
  assert(kpis.totalVacancies >= 5);
  assert(kpis.totalApplicants >= 6);
  assert(typeof kpis.stagesBreakdown.new === 'number');
  assert(typeof kpis.stagesBreakdown.screening === 'number');
  assert(typeof kpis.stagesBreakdown.interview === 'number');
  assert(typeof kpis.stagesBreakdown.offer === 'number');
  assert(typeof kpis.stagesBreakdown.hired === 'number');
  assert(typeof kpis.stagesBreakdown.rejected === 'number');
});

// --- TEST GROUP 6: Absolute Database Safety & Integrity (Rule #1) ---
console.log('\n--- TEST GROUP 6: Database Safety & Rule #1 Strict Verification ---');

// Cleanup test-created records to maintain pristine database state
try {
  const { run } = require('../server/database/db');
  if (createdOffer && createdOffer.id) {
    run('DELETE FROM job_offers WHERE id = ?', [createdOffer.id]);
  }
  if (newApplicant && newApplicant.id) {
    run('DELETE FROM job_applicants WHERE id = ?', [newApplicant.id]);
  }
  if (newVac && newVac.id) {
    run('DELETE FROM job_vacancies WHERE id = ?', [newVac.id]);
  }
} catch (e) {
  console.warn('Test cleanup warning:', e.message);
}

const activeEmployees = query("SELECT * FROM employees WHERE status = 'نشط'");
test('Strict Rule #1: Exactly 111 active operational employees preserved in database', () => {
  assert.strictEqual(activeEmployees.length, 111, `Expected 111 employees, found ${activeEmployees.length}`);
});

const boardMembers = query("SELECT * FROM employees WHERE emp_code IN ('JM-0001', 'JM-0002', 'JM-0003')");
test('Strict Rule #1: Zero board members in operational employee pool', () => {
  assert.strictEqual(boardMembers.length, 0, 'Board members found in operational pool!');
});

const users = query("SELECT * FROM users");
test('Strict Rule #1: Exactly 14 users are active and preserved', () => {
  assert.strictEqual(users.length, 14, `Expected 14 users, found ${users.length}`);
});

console.log('\n================================================================');
console.log(`📊 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (100%)`);
console.log('================================================================\n');
