const aiJobDescriptionService = require('../server/modules/aiJobDescriptionService');

async function testJd() {
  console.log('--- TEST: Generate Job Description ---');
  const jd = await aiJobDescriptionService.generateJobDescription({
    job_title_ar: 'أخصائي موارد بشرية',
    department_ar: 'إدارة الموارد البشرية',
    job_level: 'تخصصي',
    experience_years: '3 إلى 5 سنوات',
    custom_instructions: 'خبرة في منصة قوى ومدد ولائحة تنظيم العمل 229400'
  });

  console.log('Generated JD title:', jd.job_title_ar, 'Code:', jd.job_code);

  console.log('--- TEST: Save Job Description ---');
  const saved = aiJobDescriptionService.saveJobDescription(jd);
  console.log('Saved JD ID:', saved.id, 'Code:', saved.job_code);

  console.log('--- TEST: Render Printable HTML ---');
  const html = aiJobDescriptionService.renderJobDescriptionHtml(saved);
  if (!html.includes('بطاقة الوصف الوظيفي') || !html.includes('شركة جوهرة المجد')) {
    throw new Error('Printable HTML missing official branding');
  }
  console.log('Printable HTML rendered successfully, length:', html.length);

  console.log('--- TEST: Generate DOCX Buffer ---');
  const docxBuffer = await aiJobDescriptionService.generateJobDescriptionDocx(saved);
  if (!Buffer.isBuffer(docxBuffer) || docxBuffer.length < 1000) {
    throw new Error('Invalid DOCX buffer generated');
  }
  console.log('DOCX generated successfully, size:', docxBuffer.length, 'bytes');

  console.log('--- ALL JOB DESCRIPTION TESTS PASSED! ---');
}

testJd().catch(err => {
  console.error('JD Test failed:', err);
  process.exit(1);
});
