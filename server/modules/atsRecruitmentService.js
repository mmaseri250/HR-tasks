/**
 * server/modules/atsRecruitmentService.js
 * Comprehensive ATS & Recruitment Management Service
 * Jawharat Al-Majd HRMS — Saudi Labor Law Compliant
 * Features:
 *  - Job Vacancies Management (Full Lifecycle)
 *  - Job Applicants Tracking (ATS 6-Stage Pipeline: جديد -> فرز_أولي -> مقابلة_شخصية -> عرض_وظيفي -> مقبول -> مرفوض)
 *  - Job Offers Generator & Salary Package Calculation
 *  - Bilingual Official Templates (عربي / إنجليزي):
 *      1. Bilingual Job Application Form (نموذج طلب التوظيف)
 *      2. Bilingual Official Job Offer Letter (نموذج العرض الوظيفي الرسمي)
 *      3. Bilingual Employee Undertaking & Non-Disclosure Agreement (نموذج الإقرار والتعهد وسرية المعلومات)
 */

const { query, get, run } = require('../database/db');
const branding = require('./branding');

class AtsRecruitmentService {
  constructor() {
    this.ensureTables();
  }

  /**
   * Ensure ATS tables exist and are properly indexed
   */
  ensureTables() {
    // 1. Job Vacancies
    run(`
      CREATE TABLE IF NOT EXISTS job_vacancies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_code TEXT UNIQUE NOT NULL,
        title_ar TEXT NOT NULL,
        title_en TEXT,
        department_id INTEGER,
        branch_id INTEGER,
        experience_years INTEGER DEFAULT 0,
        employment_type TEXT DEFAULT 'دوام كامل',
        openings_count INTEGER DEFAULT 1,
        salary_range TEXT,
        status TEXT DEFAULT 'مفتوح',
        description_id INTEGER,
        requirements TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure requirements column exists if table was created earlier without it
    try {
      run("ALTER TABLE job_vacancies ADD COLUMN requirements TEXT");
    } catch (e) {
      // Column already exists, ignore
    }

    // 2. Job Applicants
    run(`
      CREATE TABLE IF NOT EXISTS job_applicants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        applicant_no TEXT UNIQUE NOT NULL,
        vacancy_id INTEGER,
        full_name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        nationality TEXT DEFAULT 'سعودي',
        experience_years INTEGER DEFAULT 0,
        education_level TEXT,
        current_employer TEXT,
        expected_salary REAL,
        stage TEXT DEFAULT 'جديد',
        interview_date TEXT,
        interview_notes TEXT,
        resume_file TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Job Offers
    run(`
      CREATE TABLE IF NOT EXISTS job_offers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        offer_no TEXT UNIQUE NOT NULL,
        applicant_id INTEGER,
        vacancy_id INTEGER,
        candidate_name TEXT NOT NULL,
        candidate_email TEXT,
        candidate_phone TEXT,
        national_id TEXT,
        nationality TEXT DEFAULT 'سعودي',
        job_title_ar TEXT NOT NULL,
        job_title_en TEXT,
        department_name TEXT,
        branch_name TEXT DEFAULT 'المقر الرئيسي',
        basic_salary REAL NOT NULL DEFAULT 0,
        housing_allowance REAL NOT NULL DEFAULT 0,
        transport_allowance REAL NOT NULL DEFAULT 0,
        other_allowances REAL NOT NULL DEFAULT 0,
        total_salary REAL NOT NULL DEFAULT 0,
        contract_duration TEXT DEFAULT 'سنة قابلة للتجديد (One Year Renewable)',
        probation_period TEXT DEFAULT '90 يوماً (90 Days)',
        annual_leave_days INTEGER DEFAULT 30,
        start_date TEXT,
        expiry_date TEXT,
        status TEXT DEFAULT 'مرسل للمرشح',
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed realistic initial vacancies if empty
    this.seedInitialDataIfEmpty();
  }

  seedInitialDataIfEmpty() {
    const vCount = get('SELECT COUNT(*) as c FROM job_vacancies')?.c || 0;
    if (vCount === 0) {
      const initialVacancies = [
        {
          code: 'JM-VAC-2026-0001',
          ar: 'مدير مشروع إنشائي أول',
          en: 'Senior Construction Project Manager',
          dept: 'إدارة المشاريع الهندسية',
          exp: 7,
          type: 'دوام كامل',
          openings: 2,
          salary: '18,000 - 24,000 ر.س',
          reqs: 'بكالوريوس هندسة مدنية، خبرة في إدارة مشاريع البنية التحتية، إتقان إدارة العقود FIDIC والسلامة المهنية.'
        },
        {
          code: 'JM-VAC-2026-0002',
          ar: 'مهندس سلامة وصحة مهنية (HSE)',
          en: 'Occupational Health & Safety Engineer',
          dept: 'إدارة السلامة والجودة',
          exp: 3,
          type: 'دوام كامل',
          openings: 3,
          salary: '9,000 - 13,000 ر.س',
          reqs: 'شهادة نيبوش NEBOSH IGC، خبرة في مواقع المقاولات والإنشاءات، إتقان تقييم المخاطر وتطبيق معايير أرامكو وسابك.'
        },
        {
          code: 'JM-VAC-2026-0003',
          ar: 'محاسب تكاليف ومقاولات',
          en: 'Cost & Construction Accountant',
          dept: 'الإدارة المالية',
          exp: 4,
          type: 'دوام كامل',
          openings: 1,
          salary: '8,000 - 11,000 ر.س',
          reqs: 'بكالوريوس محاسبة، خبرة محاسبية في قطاع المقاولات والمستخلصات والمستودعات، إتقان برامج ERP.'
        },
        {
          code: 'JM-VAC-2026-0004',
          ar: 'أخصائي توظيف وموارد بشرية',
          en: 'HR & Talent Acquisition Specialist',
          dept: 'إدارة الموارد البشرية',
          exp: 3,
          type: 'دوام كامل',
          openings: 1,
          salary: '7,500 - 10,000 ر.س',
          reqs: 'بكالوريوس موارد بشرية أو إدارة أعمال، إلمام تام بنظام العمل السعودي ومنصات قوى ومقيم ومدد، مهارات التفاوض.'
        }
      ];

      initialVacancies.forEach(v => {
        run(`
          INSERT INTO job_vacancies (
            job_code, title_ar, title_en, experience_years, employment_type, openings_count, salary_range, requirements, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'مفتوح')
        `, [v.code, v.ar, v.en, v.exp, v.type, v.openings, v.salary, v.reqs]);
      });

      // Seed sample applicants across pipeline
      const sampleApplicants = [
        { no: 'APP-2026-0001', vId: 1, name: 'عبدالله إبراهيم الشمري', email: 'a.shammari@example.com', phone: '0551234567', nat: 'سعودي', exp: 8, edu: 'بكالوريوس هندسة مدنية', stage: 'مقابلة_شخصية', expSal: 22000 },
        { no: 'APP-2026-0002', vId: 2, name: 'محمد فاروق المنصور', email: 'm.mansour@example.com', phone: '0547654321', nat: 'سعودي', exp: 4, edu: 'بكالوريوس هندسة ميكانيكية', stage: 'فرز_أولي', expSal: 11000 },
        { no: 'APP-2026-0003', vId: 3, name: 'خالد عبدالعزيز الزهراني', email: 'k.zahrani@example.com', phone: '0509876543', nat: 'سعودي', exp: 5, edu: 'بكالوريوس محاسبة وتمويل', stage: 'عرض_وظيفي', expSal: 10500 },
        { no: 'APP-2026-0004', vId: 4, name: 'سارة فهد السديري', email: 's.sudairi@example.com', phone: '0561122334', nat: 'سعودية', exp: 3, edu: 'بكالوريوس موارد بشرية', stage: 'جديد', expSal: 9000 },
        { no: 'APP-2026-0005', vId: 1, name: 'عمر طارق الدوسري', email: 'o.dosari@example.com', phone: '0554433221', nat: 'سعودي', exp: 9, edu: 'ماجستير إدارة مشاريع', stage: 'مقبول', expSal: 24000 }
      ];

      sampleApplicants.forEach(a => {
        run(`
          INSERT INTO job_applicants (
            applicant_no, vacancy_id, full_name, email, phone, nationality, experience_years, education_level, stage, expected_salary
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [a.no, a.vId, a.name, a.email, a.phone, a.nat, a.exp, a.edu, a.stage, a.expSal]);
      });
    }
  }

  // ==========================================
  // 1. JOB VACANCIES (الوظائف الشاغرة)
  // ==========================================

  getVacancies(filter = {}) {
    let sql = `
      SELECT v.*, 
        d.name_ar as department_name, 
        b.name_ar as branch_name,
        (SELECT COUNT(*) FROM job_applicants a WHERE a.vacancy_id = v.id) as applicants_count
      FROM job_vacancies v
      LEFT JOIN departments d ON v.department_id = d.id
      LEFT JOIN branches b ON v.branch_id = b.id
      WHERE 1=1
    `;
    const params = [];

    if (filter.status) {
      sql += ' AND v.status = ?';
      params.push(filter.status);
    }
    if (filter.search) {
      sql += ' AND (v.title_ar LIKE ? OR v.title_en LIKE ? OR v.job_code LIKE ?)';
      const s = `%${filter.search}%`;
      params.push(s, s, s);
    }

    sql += ' ORDER BY v.id DESC';
    return query(sql, params);
  }

  getVacancyById(id) {
    const sql = `
      SELECT v.*, 
        d.name_ar as department_name, 
        b.name_ar as branch_name,
        (SELECT COUNT(*) FROM job_applicants a WHERE a.vacancy_id = v.id) as applicants_count
      FROM job_vacancies v
      LEFT JOIN departments d ON v.department_id = d.id
      LEFT JOIN branches b ON v.branch_id = b.id
      WHERE v.id = ? OR v.job_code = ?
    `;
    return get(sql, [id, id]);
  }

  createVacancy(data) {
    const currentYear = new Date().getFullYear();
    const countRow = get('SELECT COUNT(*) as c FROM job_vacancies WHERE job_code LIKE ?', [`JM-VAC-${currentYear}-%`]);
    const nextSeq = String((countRow?.c || 0) + 1).padStart(4, '0');
    const jobCode = data.job_code || `JM-VAC-${currentYear}-${nextSeq}`;

    const res = run(`
      INSERT INTO job_vacancies (
        job_code, title_ar, title_en, department_id, branch_id,
        experience_years, employment_type, openings_count, salary_range,
        requirements, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      jobCode,
      data.title_ar,
      data.title_en || '',
      data.department_id || null,
      data.branch_id || null,
      Number(data.experience_years) || 0,
      data.employment_type || 'دوام كامل',
      Number(data.openings_count) || 1,
      data.salary_range || '',
      data.requirements || '',
      data.status || 'مفتوح'
    ]);

    return this.getVacancyById(res.lastInsertRowid);
  }

  updateVacancy(id, data) {
    const fields = [];
    const params = [];

    if (data.title_ar !== undefined) { fields.push('title_ar = ?'); params.push(data.title_ar); }
    if (data.title_en !== undefined) { fields.push('title_en = ?'); params.push(data.title_en); }
    if (data.department_id !== undefined) { fields.push('department_id = ?'); params.push(data.department_id); }
    if (data.branch_id !== undefined) { fields.push('branch_id = ?'); params.push(data.branch_id); }
    if (data.experience_years !== undefined) { fields.push('experience_years = ?'); params.push(data.experience_years); }
    if (data.employment_type !== undefined) { fields.push('employment_type = ?'); params.push(data.employment_type); }
    if (data.openings_count !== undefined) { fields.push('openings_count = ?'); params.push(data.openings_count); }
    if (data.salary_range !== undefined) { fields.push('salary_range = ?'); params.push(data.salary_range); }
    if (data.requirements !== undefined) { fields.push('requirements = ?'); params.push(data.requirements); }
    if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }

    if (fields.length === 0) return this.getVacancyById(id);

    params.push(id);
    run(`UPDATE job_vacancies SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.getVacancyById(id);
  }

  deleteVacancy(id) {
    return run('DELETE FROM job_vacancies WHERE id = ?', [id]);
  }

  // ==========================================
  // 2. APPLICANTS & ATS PIPELINE (المتقدمين وتتبع المراحل)
  // ==========================================

  getApplicants(filter = {}) {
    let sql = `
      SELECT a.*, v.title_ar as vacancy_title_ar, v.title_en as vacancy_title_en, v.job_code
      FROM job_applicants a
      LEFT JOIN job_vacancies v ON a.vacancy_id = v.id
      WHERE 1=1
    `;
    const params = [];

    if (filter.vacancy_id) {
      sql += ' AND a.vacancy_id = ?';
      params.push(filter.vacancy_id);
    }
    if (filter.stage) {
      sql += ' AND a.stage = ?';
      params.push(filter.stage);
    }
    if (filter.search) {
      sql += ' AND (a.full_name LIKE ? OR a.email LIKE ? OR a.phone LIKE ? OR a.applicant_no LIKE ?)';
      const s = `%${filter.search}%`;
      params.push(s, s, s, s);
    }

    sql += ' ORDER BY a.id DESC';
    return query(sql, params);
  }

  getApplicantById(id) {
    const sql = `
      SELECT a.*, v.title_ar as vacancy_title_ar, v.title_en as vacancy_title_en, v.job_code
      FROM job_applicants a
      LEFT JOIN job_vacancies v ON a.vacancy_id = v.id
      WHERE a.id = ? OR a.applicant_no = ?
    `;
    return get(sql, [id, id]);
  }

  createApplicant(data) {
    const currentYear = new Date().getFullYear();
    const countRow = get('SELECT COUNT(*) as c FROM job_applicants WHERE applicant_no LIKE ?', [`APP-${currentYear}-%`]);
    const nextSeq = String((countRow?.c || 0) + 1).padStart(4, '0');
    const applicantNo = data.applicant_no || `APP-${currentYear}-${nextSeq}`;

    const res = run(`
      INSERT INTO job_applicants (
        applicant_no, vacancy_id, full_name, email, phone, nationality,
        experience_years, education_level, current_employer, expected_salary,
        stage, interview_date, interview_notes, resume_file
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      applicantNo,
      data.vacancy_id || null,
      data.full_name,
      data.email || '',
      data.phone || '',
      data.nationality || 'سعودي',
      Number(data.experience_years) || 0,
      data.education_level || '',
      data.current_employer || '',
      Number(data.expected_salary) || 0,
      data.stage || 'جديد',
      data.interview_date || null,
      data.interview_notes || '',
      data.resume_file || ''
    ]);

    return this.getApplicantById(res.lastInsertRowid);
  }

  updateApplicantStage(id, stage, notes = null, interviewDate = null) {
    const validStages = ['جديد', 'فرز_أولي', 'مقابلة_شخصية', 'عرض_وظيفي', 'مقبول', 'مرفوض'];
    if (!validStages.includes(stage)) {
      throw new Error(`مرحلة غير صالحة: ${stage}. المراحل المتاحة هي: ${validStages.join(', ')}`);
    }

    const fields = ['stage = ?'];
    const params = [stage];

    if (notes !== null) {
      fields.push('interview_notes = ?');
      params.push(notes);
    }
    if (interviewDate !== null) {
      fields.push('interview_date = ?');
      params.push(interviewDate);
    }

    params.push(id);
    run(`UPDATE job_applicants SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.getApplicantById(id);
  }

  // ==========================================
  // 3. JOB OFFERS MANAGEMENT (العروض الوظيفية)
  // ==========================================

  getOffers(filter = {}) {
    let sql = 'SELECT * FROM job_offers WHERE 1=1';
    const params = [];

    if (filter.status) {
      sql += ' AND status = ?';
      params.push(filter.status);
    }
    if (filter.search) {
      sql += ' AND (candidate_name LIKE ? OR offer_no LIKE ? OR candidate_phone LIKE ?)';
      const s = `%${filter.search}%`;
      params.push(s, s, s);
    }

    sql += ' ORDER BY id DESC';
    return query(sql, params);
  }

  getOfferById(id) {
    return get('SELECT * FROM job_offers WHERE id = ? OR offer_no = ?', [id, id]);
  }

  createOffer(data) {
    const currentYear = new Date().getFullYear();
    const countRow = get('SELECT COUNT(*) as c FROM job_offers WHERE offer_no LIKE ?', [`JM-OFFER-${currentYear}-%`]);
    const nextSeq = String((countRow?.c || 0) + 1).padStart(4, '0');
    const offerNo = data.offer_no || `JM-OFFER-${currentYear}-${nextSeq}`;

    const basic = Number(data.basic_salary || 0);
    const housing = Number(data.housing_allowance || 0);
    const transport = Number(data.transport_allowance || 0);
    const other = Number(data.other_allowances || 0);
    const total = basic + housing + transport + other;

    const res = run(`
      INSERT INTO job_offers (
        offer_no, applicant_id, vacancy_id, candidate_name, candidate_email,
        candidate_phone, national_id, nationality, job_title_ar, job_title_en,
        department_name, branch_name, basic_salary, housing_allowance,
        transport_allowance, other_allowances, total_salary, contract_duration,
        probation_period, annual_leave_days, start_date, expiry_date, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      offerNo,
      data.applicant_id || null,
      data.vacancy_id || null,
      data.candidate_name,
      data.candidate_email || '',
      data.candidate_phone || '',
      data.national_id || '',
      data.nationality || 'سعودي',
      data.job_title_ar,
      data.job_title_en || '',
      data.department_name || 'الإدارة العامة',
      data.branch_name || 'المقر الرئيسي',
      basic,
      housing,
      transport,
      other,
      total,
      data.contract_duration || 'سنة قابلة للتجديد (One Year Renewable)',
      data.probation_period || '90 يوماً (90 Days)',
      Number(data.annual_leave_days) || 30,
      data.start_date || new Date().toISOString().split('T')[0],
      data.expiry_date || null,
      data.status || 'مرسل للمرشح',
      data.notes || ''
    ]);

    // Automatically advance applicant stage if linked
    if (data.applicant_id) {
      run("UPDATE job_applicants SET stage = 'عرض_وظيفي' WHERE id = ?", [data.applicant_id]);
    }

    return this.getOfferById(res.lastInsertRowid);
  }

  updateOfferStatus(id, status) {
    run('UPDATE job_offers SET status = ? WHERE id = ?', [status, id]);
    const offer = this.getOfferById(id);

    // If offer accepted, update applicant to 'مقبول'
    if (offer && offer.applicant_id && status === 'مقبول') {
      run("UPDATE job_applicants SET stage = 'مقبول' WHERE id = ?", [offer.applicant_id]);
    } else if (offer && offer.applicant_id && status === 'مرفوض') {
      run("UPDATE job_applicants SET stage = 'مرفوض' WHERE id = ?", [offer.applicant_id]);
    }

    return offer;
  }

  // ==========================================
  // 4. STATS & KPIS
  // ==========================================

  getRecruitmentKpis() {
    const totalVacancies = get('SELECT COUNT(*) as c FROM job_vacancies')?.c || 0;
    const openVacancies = get("SELECT COUNT(*) as c FROM job_vacancies WHERE status = 'مفتوح'")?.c || 0;
    const totalApplicants = get('SELECT COUNT(*) as c FROM job_applicants')?.c || 0;
    const activeOffers = get("SELECT COUNT(*) as c FROM job_offers WHERE status = 'مرسل للمرشح'")?.c || 0;
    const hiredCount = get("SELECT COUNT(*) as c FROM job_applicants WHERE stage = 'مقبول'")?.c || 0;

    const stagesBreakdown = {
      new: get("SELECT COUNT(*) as c FROM job_applicants WHERE stage = 'جديد'")?.c || 0,
      screening: get("SELECT COUNT(*) as c FROM job_applicants WHERE stage = 'فرز_أولي'")?.c || 0,
      interview: get("SELECT COUNT(*) as c FROM job_applicants WHERE stage = 'مقابلة_شخصية'")?.c || 0,
      offer: get("SELECT COUNT(*) as c FROM job_applicants WHERE stage = 'عرض_وظيفي'")?.c || 0,
      hired: hiredCount,
      rejected: get("SELECT COUNT(*) as c FROM job_applicants WHERE stage = 'مرفوض'")?.c || 0
    };

    return {
      totalVacancies,
      openVacancies,
      totalApplicants,
      activeOffers,
      hiredCount,
      stagesBreakdown
    };
  }

  // ==========================================
  // 5. BILINGUAL TEMPLATES (عربي / إنجليزي)
  // ==========================================

  /**
   * Template 1: Bilingual Job Application Form (A4 Printable)
   * نموذج طلب التوظيف الرسمي ثنائي اللغة
   */
  generateJobApplicationPrintHtml(data = {}) {
    const v = data.vacancy || {};
    const a = data.applicant || {};

    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>نموذج طلب توظيف - Employment Application Form</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; background: #fff; color: #0f172a; padding: 20px; }
    .brand-border { border-color: #700c14; }
    .brand-text { color: #700c14; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      @page { size: A4; margin: 12mm; }
    }
  </style>
</head>
<body class="max-w-4xl mx-auto space-y-4">

  <!-- Print Actions Bar -->
  <div class="no-print flex justify-between items-center bg-slate-100 p-3 rounded-2xl border border-slate-200">
    <div class="text-xs font-bold text-slate-700">
      <i class="fa-solid fa-file-signature text-brand ml-1"></i> نموذج طلب توظيف رسمي ثنائي اللغة (عربي / English)
    </div>
    <div class="flex gap-2">
      <button onclick="window.print()" class="bg-[#700c14] hover:bg-[#52090e] text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition flex items-center gap-1.5">
        <i class="fa-solid fa-print"></i> طباعة النموذج (PDF)
      </button>
      <button onclick="window.close()" class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition">
        إغلاق
      </button>
    </div>
  </div>

  <!-- Document Body -->
  <div class="border-2 border-slate-300 rounded-3xl p-6 sm:p-8 space-y-5 bg-white print:border-none print:p-0">
    
    <!-- Header -->
    <div class="flex justify-between items-start border-b-2 brand-border pb-4">
      <div class="space-y-0.5">
        <h1 class="text-lg font-black brand-text">${branding.companyNameAr}</h1>
        <h2 class="text-xs font-bold text-slate-700 uppercase tracking-wider">${(branding.companyNameEn || '').toUpperCase()}</h2>
        <p class="text-[10px] text-slate-500 font-mono">سجل تجاري: ${branding.commercialRegister} • المملكة العربية السعودية</p>
      </div>
      <div class="text-center">
        <img src="${branding.logoBase64}" alt="شعار شركة جوهرة المجد" class="h-12 max-w-[140px] object-contain mx-auto" />
        <span class="text-[9px] font-mono text-[#700c14] font-bold block mt-0.5">HR-FRM-REC-01</span>
      </div>
      <div class="text-left space-y-0.5">
        <span class="inline-block bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-brand">
          ${a.applicant_no || 'APP-2026-FORM'}
        </span>
        <p class="text-[10px] text-slate-500">التاريخ / Date: ${new Date().toISOString().split('T')[0]}</p>
      </div>
    </div>

    <!-- Title Banner -->
    <div class="text-center py-2 bg-gradient-to-r from-amber-50 via-slate-50 to-amber-50 border border-amber-200/80 rounded-2xl">
      <h3 class="text-base font-black brand-text">طلب توظيف رسمي</h3>
      <h4 class="text-xs font-bold text-slate-600 uppercase tracking-wider">Official Employment Application Form</h4>
    </div>

    <!-- 1. Position Applied For -->
    <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
      <div class="bg-slate-100 p-2 font-black text-slate-800 flex justify-between">
        <span>1. الوظيفة المرشح لها / Position Applied For:</span>
        <span class="font-mono text-brand">${v.job_code || ''}</span>
      </div>
      <div class="grid grid-cols-2 p-2.5 gap-2 bg-white">
        <div><span class="font-bold text-slate-500">المسمى الوظيفي:</span> <span class="font-black text-slate-900">${v.title_ar || a.vacancy_title_ar || '................................'}</span></div>
        <div><span class="font-bold text-slate-500">Job Title:</span> <span class="font-mono text-slate-800">${v.title_en || a.vacancy_title_en || '................................'}</span></div>
      </div>
    </div>

    <!-- 2. Personal Information -->
    <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
      <div class="bg-slate-100 p-2 font-black text-slate-800">
        2. البيانات الشخصية / Personal Details:
      </div>
      <table class="w-full border-collapse">
        <tbody>
          <tr class="border-b border-slate-100">
            <td class="p-2 font-bold text-slate-500 w-1/4">الاسم الكامل / Full Name:</td>
            <td class="p-2 font-black text-slate-900 w-1/4">${a.full_name || '................................'}</td>
            <td class="p-2 font-bold text-slate-500 w-1/4">رقم الهوية / National ID:</td>
            <td class="p-2 font-mono font-bold text-slate-800 w-1/4">${a.national_id || '................................'}</td>
          </tr>
          <tr class="border-b border-slate-100">
            <td class="p-2 font-bold text-slate-500">الجنسية / Nationality:</td>
            <td class="p-2 font-bold text-slate-800">${a.nationality || 'سعودي'}</td>
            <td class="p-2 font-bold text-slate-500">رقم الجوال / Mobile Phone:</td>
            <td class="p-2 font-mono font-bold text-slate-800">${a.phone || '................................'}</td>
          </tr>
          <tr>
            <td class="p-2 font-bold text-slate-500">البريد الإلكتروني / Email:</td>
            <td class="p-2 font-mono text-slate-800">${a.email || '................................'}</td>
            <td class="p-2 font-bold text-slate-500">العنوان / Address:</td>
            <td class="p-2 text-slate-800">المملكة العربية السعودية</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 3. Education & Experience -->
    <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
      <div class="bg-slate-100 p-2 font-black text-slate-800">
        3. المؤهلات والخبرات / Education & Work Experience:
      </div>
      <table class="w-full border-collapse">
        <tbody>
          <tr class="border-b border-slate-100">
            <td class="p-2 font-bold text-slate-500 w-1/4">المؤهل العلمي / Education:</td>
            <td class="p-2 font-bold text-slate-800 w-1/4">${a.education_level || '................................'}</td>
            <td class="p-2 font-bold text-slate-500 w-1/4">سنوات الخبرة / Experience Years:</td>
            <td class="p-2 font-bold text-slate-800 w-1/4">${a.experience_years ? a.experience_years + ' سنوات' : '................'}</td>
          </tr>
          <tr>
            <td class="p-2 font-bold text-slate-500">جهة العمل الحالية / Current Employer:</td>
            <td class="p-2 text-slate-800">${a.current_employer || '................................'}</td>
            <td class="p-2 font-bold text-slate-500">الراتب المتوقع / Expected Salary:</td>
            <td class="p-2 font-mono font-bold text-emerald-700">${a.expected_salary ? a.expected_salary.toLocaleString() + ' SAR' : '................'}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 4. Legal Undertaking & Declaration -->
    <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1.5 text-slate-700 leading-relaxed text-justify">
      <div class="font-black text-slate-900 flex items-center gap-1.5">
        <i class="fa-solid fa-stamp text-brand"></i>
        <span>الإقرار والتعهد بصحة البيانات / Legal Declaration:</span>
      </div>
      <p>
        أقر أنا مقدم الطلب بأن جميع البيانات والمعلومات والشهادات المدونة بعاليه صحيحة ودقيقة وكاملة، وأدرك تماماً أنه في حال ثبوت عدم صحة أي معلومة فإنه يحق لشركة جوهرة المجد إلغاء طلبي أو إنهاء خدماتي مستقبلاً دون إشعار أو مكافأة بموجب أحكام نظام العمل السعودي.
      </p>
      <p class="text-[10px] text-slate-500 font-mono italic">
        I hereby declare that all information, certificates, and details provided in this application are true, accurate, and complete. Any misrepresentation may result in disqualification or termination in accordance with Saudi Labor Law.
      </p>
    </div>

    <!-- Signatures -->
    <div class="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs">
      <div class="space-y-6">
        <p class="font-bold text-slate-700">توقيع مقدم الطلب / Applicant Signature:</p>
        <div>
          <p class="text-[11px] font-bold text-slate-900">${a.full_name || '................................'}</p>
          <p class="text-[10px] text-slate-400 mt-1">التوقيع / Signature: ....................</p>
        </div>
      </div>
      <div class="space-y-6 text-left">
        <p class="font-bold text-slate-700">اعتماد إدارة الموارد البشرية / HR Review:</p>
        <div>
          <p class="text-[11px] font-bold text-slate-900">قسم التوظيف والاستقطاب</p>
          <p class="text-[10px] text-slate-400 mt-1">التاريخ والختم: ....................</p>
        </div>
      </div>
    </div>

  </div>

</body>
</html>
    `;
  }

  /**
   * Template 2: Bilingual Official Job Offer Letter (A4 Printable)
   * نموذج العرض الوظيفي الرسمي ثنائي اللغة
   */
  generateJobOfferPrintHtml(offerIdOrData) {
    let item = null;
    if (typeof offerIdOrData === 'object') {
      item = offerIdOrData;
    } else {
      item = this.getOfferById(offerIdOrData);
    }

    if (!item) throw new Error('العرض الوظيفي غير موجود');

    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>عرض وظيفي رسمي - Job Offer Letter - ${item.candidate_name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; background: #fff; color: #0f172a; padding: 20px; }
    .brand-border { border-color: #700c14; }
    .brand-text { color: #700c14; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      @page { size: A4; margin: 12mm; }
    }
  </style>
</head>
<body class="max-w-4xl mx-auto space-y-4">

  <!-- Print Actions Bar -->
  <div class="no-print flex justify-between items-center bg-slate-100 p-3 rounded-2xl border border-slate-200">
    <div class="text-xs font-bold text-slate-700">
      <i class="fa-solid fa-award text-brand ml-1"></i> وثيقة العرض الوظيفي الرسمي ثنائية اللغة (Saudi Labor Law Compliant)
    </div>
    <div class="flex gap-2">
      <button onclick="window.print()" class="bg-[#700c14] hover:bg-[#52090e] text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition flex items-center gap-1.5">
        <i class="fa-solid fa-print"></i> طباعة العرض الرسمي (PDF)
      </button>
      <button onclick="window.close()" class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition">
        إغلاق
      </button>
    </div>
  </div>

  <!-- Document Body -->
  <div class="border-2 border-slate-300 rounded-3xl p-6 sm:p-8 space-y-5 bg-white print:border-none print:p-0">
    
    <!-- Header -->
    <div class="flex justify-between items-start border-b-2 brand-border pb-4">
      <div class="space-y-0.5">
        <h1 class="text-lg font-black brand-text">${branding.companyNameAr}</h1>
        <h2 class="text-xs font-bold text-slate-700 uppercase tracking-wider">${(branding.companyNameEn || '').toUpperCase()}</h2>
        <p class="text-[10px] text-slate-500 font-mono">سجل تجاري: ${branding.commercialRegister} • المملكة العربية السعودية</p>
      </div>
      <div class="text-center">
        <img src="${branding.logoBase64}" alt="شعار شركة جوهرة المجد" class="h-12 max-w-[140px] object-contain mx-auto" />
        <span class="text-[9px] font-mono text-[#700c14] font-bold block mt-0.5">HR-OFFER-2026</span>
      </div>
      <div class="text-left space-y-0.5">
        <span class="inline-block bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-brand">
          ${item.offer_no || 'JM-OFFER'}
        </span>
        <p class="text-[10px] text-slate-500">التاريخ / Date: ${new Date(item.created_at || Date.now()).toISOString().split('T')[0]}</p>
      </div>
    </div>

    <!-- Title Banner -->
    <div class="text-center py-2 bg-gradient-to-r from-amber-50 via-slate-50 to-amber-50 border border-amber-200/80 rounded-2xl">
      <h3 class="text-base font-black brand-text">عرض عمل رسمي (Job Offer Letter)</h3>
      <p class="text-xs text-slate-600 mt-0.5">وفقاً لأحكام نظام العمل في المملكة العربية السعودية الصادر بالمرسوم الملكي (م/51)</p>
    </div>

    <!-- Candidate Greeting -->
    <div class="text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
      <div class="flex justify-between items-center">
        <span class="font-bold text-slate-600">السيد / السيدة (Dear Candidate):</span>
        <span class="font-black text-slate-900 text-sm">${item.candidate_name}</span>
      </div>
      <p class="text-slate-700 leading-relaxed">
        يسر إدارة شركة جوهرة المجد تقديم هذا العرض الوظيفي للانضمام إلى فريق عملنا المتميز وفقاً للبنود والمميزات الموضحة أدناه:
      </p>
    </div>

    <!-- 1. Position & Work Location -->
    <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
      <div class="bg-slate-100 p-2 font-black text-slate-800 flex justify-between">
        <span>1. المسمى الوظيفي وموقع العمل / Position & Location:</span>
        <span class="text-slate-500 font-normal">عقد عمل مهني</span>
      </div>
      <table class="w-full border-collapse">
        <tbody>
          <tr class="border-b border-slate-100">
            <td class="p-2 font-bold text-slate-500 w-1/4">المسمى الوظيفي:</td>
            <td class="p-2 font-black text-slate-900 w-1/4">${item.job_title_ar}</td>
            <td class="p-2 font-bold text-slate-500 w-1/4">Job Title (EN):</td>
            <td class="p-2 font-mono text-slate-800 w-1/4">${item.job_title_en || item.job_title_ar}</td>
          </tr>
          <tr>
            <td class="p-2 font-bold text-slate-500">الإدارة / القسم:</td>
            <td class="p-2 font-bold text-slate-800">${item.department_name || 'الإدارة العامة'}</td>
            <td class="p-2 font-bold text-slate-500">موقع العمل / Location:</td>
            <td class="p-2 text-slate-800">${item.branch_name || 'المقر الرئيسي'}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 2. Compensation & Benefits Package (Bilingual Grid) -->
    <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
      <div class="bg-slate-100 p-2 font-black text-slate-800">
        2. الحزمة المالية الشهرية / Monthly Compensation & Benefits (SAR):
      </div>
      <table class="w-full border-collapse">
        <thead class="bg-slate-50 text-slate-600 border-b border-slate-200">
          <tr>
            <th class="p-2 text-right">البند / Salary Component</th>
            <th class="p-2 text-left">القيمة بالريال السعودي (SAR)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr>
            <td class="p-2 font-bold text-slate-700">الراتب الأساسي / Basic Salary</td>
            <td class="p-2 font-mono font-bold text-left text-slate-900">${Number(item.basic_salary).toLocaleString('en-US')} SAR (${Number(item.basic_salary).toLocaleString()} ر.س)</td>
          </tr>
          <tr>
            <td class="p-2 text-slate-700">بدل السكن الشهري / Housing Allowance</td>
            <td class="p-2 font-mono font-bold text-left text-slate-900">${Number(item.housing_allowance).toLocaleString('en-US')} SAR (${Number(item.housing_allowance).toLocaleString()} ر.س)</td>
          </tr>
          <tr>
            <td class="p-2 text-slate-700">بدل النقل الشهري / Transportation Allowance</td>
            <td class="p-2 font-mono font-bold text-left text-slate-900">${Number(item.transport_allowance).toLocaleString('en-US')} SAR (${Number(item.transport_allowance).toLocaleString()} ر.س)</td>
          </tr>
          ${item.other_allowances > 0 ? `
          <tr>
            <td class="p-2 text-slate-700">بدلات أخرى ثابتة / Other Allowances</td>
            <td class="p-2 font-mono font-bold text-left text-slate-900">${Number(item.other_allowances).toLocaleString('en-US')} SAR (${Number(item.other_allowances).toLocaleString()} ر.س)</td>
          </tr>` : ''}
        </tbody>
        <tfoot class="bg-gradient-to-r from-amber-50 to-slate-50 border-t-2 brand-border">
          <tr>
            <td class="p-2.5 font-black brand-text">إجمالي الراتب الشهري الشامل / Gross Monthly Total</td>
            <td class="p-2.5 font-mono font-black text-left brand-text text-sm">${Number(item.total_salary).toLocaleString('en-US')} SAR (${Number(item.total_salary).toLocaleString()} ر.س)</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- 3. Key Employment Conditions -->
    <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
      <div class="bg-slate-100 p-2 font-black text-slate-800">
        3. شروط ومحددات العقد / Employment Terms:
      </div>
      <div class="grid grid-cols-2 p-2.5 gap-2.5 bg-white leading-relaxed">
        <div>
          <span class="font-bold text-slate-600 block">مدة العقد / Contract Duration:</span>
          <span class="text-slate-900 font-semibold">${item.contract_duration || 'سنة قابلة للتجديد برضا الطرفين'}</span>
        </div>
        <div>
          <span class="font-bold text-slate-600 block">فترة التجربة (المادة 53) / Probation Period (Article 53):</span>
          <span class="text-slate-900 font-semibold">${item.probation_period ? item.probation_period + ' - وفقاً للمادة 53 من نظام العمل' : '90 يوماً وفقاً للمادة 53 من نظام العمل'}</span>
        </div>
        <div>
          <span class="font-bold text-slate-600 block">الإجازة السنوية (المادة 109) / Annual Paid Vacation (Article 109):</span>
          <span class="text-slate-900 font-semibold">${item.annual_leave_days || 30} يوماً مدفوعة الأجر وفقاً للمادة 109 من نظام العمل (المادة 109 / Article 109)</span>
        </div>
        <div>
          <span class="font-bold text-slate-600 block">التأمين الطبي / Medical Insurance:</span>
          <span class="text-slate-900 font-semibold">تأمين صحي تعاوني شامل معتمد وفق معايير مجلس الضمان الصحي</span>
        </div>
      </div>
    </div>

    <!-- Candidate Acceptance & Signatures -->
    <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-4">
      <div class="font-black text-slate-900 flex items-center justify-between">
        <span>قبول العرض الوظيفي / Candidate Acceptance:</span>
        <span class="text-[10px] text-slate-400">ساري لمدة 7 أيام من تاريخه</span>
      </div>
      <p class="text-[11px] text-slate-700 leading-relaxed text-justify">
        أقر أنا المرشح المذكور أعلاه بقبولي التام لكافة شروط وبنود ومميزات هذا العرض الوظيفي، وتاريخ المباشرة المتفق عليه، وأتعهد باستكمال مسوغات التعيين النظامية وتوقيع عقد العمل الرسمي.
      </p>
      
      <div class="grid grid-cols-2 gap-8 pt-2">
        <div class="space-y-4">
          <p class="font-bold text-slate-700">توقيع وقبول المرشح / Candidate Acceptance:</p>
          <div>
            <p class="text-[11px] font-bold text-slate-900">${item.candidate_name}</p>
            <p class="text-[10px] text-slate-400 mt-1">التوقيع والتاريخ: ........................................</p>
          </div>
        </div>
        <div class="space-y-4 text-left">
          <p class="font-bold text-slate-700">اعتماد إدارة الشركة / Management Approval:</p>
          <div>
            <p class="text-[11px] font-bold text-slate-900">مدير عام الشركة</p>
            <p class="text-[10px] text-slate-400 mt-1">الختم والاعتماد: ........................................</p>
          </div>
        </div>
      </div>
    </div>

  </div>

</body>
</html>
    `;
  }

  /**
   * Template 3: Bilingual Non-Disclosure & Employee Undertaking (A4 Printable)
   * نموذج الإقرار والتعهد وسرية المعلومات ثنائي اللغة
   */
  generateUndertakingPrintHtml(data = {}) {
    const candidateName = data.candidate_name || data.full_name || '................................';
    const nationalId = data.national_id || '................................';
    const jobTitle = data.job_title_ar || data.job_title || '................................';

    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>نموذج إقرار وتعهد وسرية معلومات - Undertaking & NDA</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; background: #fff; color: #0f172a; padding: 20px; }
    .brand-border { border-color: #700c14; }
    .brand-text { color: #700c14; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      @page { size: A4; margin: 12mm; }
    }
  </style>
</head>
<body class="max-w-4xl mx-auto space-y-4">

  <!-- Print Actions Bar -->
  <div class="no-print flex justify-between items-center bg-slate-100 p-3 rounded-2xl border border-slate-200">
    <div class="text-xs font-bold text-slate-700">
      <i class="fa-solid fa-shield-halved text-brand ml-1"></i> نموذج الإقرار والتعهد وعدم الإفصاح عن الأسرار ثنائي اللغة (Bilingual NDA)
    </div>
    <div class="flex gap-2">
      <button onclick="window.print()" class="bg-[#700c14] hover:bg-[#52090e] text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition flex items-center gap-1.5">
        <i class="fa-solid fa-print"></i> طباعة الوثيقة (PDF)
      </button>
      <button onclick="window.close()" class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition">
        إغلاق
      </button>
    </div>
  </div>

  <!-- Document Body -->
  <div class="border-2 border-slate-300 rounded-3xl p-6 sm:p-8 space-y-5 bg-white print:border-none print:p-0">
    
    <!-- Header -->
    <div class="flex justify-between items-start border-b-2 brand-border pb-4">
      <div class="space-y-0.5">
        <h1 class="text-lg font-black brand-text">${branding.companyNameAr}</h1>
        <h2 class="text-xs font-bold text-slate-700 uppercase tracking-wider">${(branding.companyNameEn || '').toUpperCase()}</h2>
        <p class="text-[10px] text-slate-500 font-mono">سجل تجاري: ${branding.commercialRegister} • المملكة العربية السعودية</p>
      </div>
      <div class="text-center">
        <img src="${branding.logoBase64}" alt="شعار شركة جوهرة المجد" class="h-12 max-w-[140px] object-contain mx-auto" />
        <span class="text-[9px] font-mono text-[#700c14] font-bold block mt-0.5">HR-NDA-03</span>
      </div>
      <div class="text-left space-y-0.5">
        <span class="inline-block bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-brand">
          JM-LEGAL-NDA
        </span>
        <p class="text-[10px] text-slate-500">التاريخ / Date: ${new Date().toISOString().split('T')[0]}</p>
      </div>
    </div>

    <!-- Title Banner -->
    <div class="text-center py-2 bg-gradient-to-r from-amber-50 via-slate-50 to-amber-50 border border-amber-200/80 rounded-2xl">
      <h3 class="text-base font-black brand-text">إقرار وتعهد بحفظ سرية المعلومات والالتزام بأنظمة العمل</h3>
      <h4 class="text-xs font-bold text-slate-600 uppercase tracking-wider">Employee Undertaking & Non-Disclosure Agreement (NDA)</h4>
    </div>

    <!-- Employee Identifier -->
    <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
      <p class="leading-relaxed">
        أقر أنا الموظف / <strong>${candidateName}</strong>، الحامل للهوية/الإقامة رقم: (<strong>${nationalId}</strong>)، والمعين بوظيفة: <strong>${jobTitle}</strong> بشركة جوهرة المجد، بكامل أهليتي المعتبرة شرعاً ونظاماً بالتالي:
      </p>
    </div>

    <!-- Legal Clauses -->
    <div class="space-y-3 text-xs leading-relaxed text-justify text-slate-800">
      <div class="p-3 rounded-xl border border-slate-200 space-y-1">
        <span class="font-black text-brand block">أولاً: سرية المعلومات والأسرار التجارية / Confidentiality:</span>
        <p class="text-[11px] text-slate-700">
          أتعهد بالمحافظة التامة على سرية كافة المعلومات، المستندات، الخطط الهندسية، العقود، والتسعيرات، وقوائم العملاء والموردين، والأنظمة البرمجية الخاصة بالشركة، وعدم إفشائها أو تداولها أو استخدامها خارج نطاق العمل سواء أثناء فترة خدمتي أو بعد انتهائها تحت أي ظرف كان.
        </p>
      </div>

      <div class="p-3 rounded-xl border border-slate-200 space-y-1">
        <span class="font-black text-brand block">ثانياً: الالتزام بأنظمة العمل ولوائح المنشأة / Labor Regulations:</span>
        <p class="text-[11px] text-slate-700">
          أتعهد بالتقيد الكامل بكافة نصوص ومواد نظام العمل السعودي ولائحته التنفيذية، واللائحة الداخلية لتنظيم العمل بالشركة، ومواعيد الدوام الرسمي وقواعد السلامة والصحة المهنية ومكافحة التحرش والرشوة والاحتيال.
        </p>
      </div>

      <div class="p-3 rounded-xl border border-slate-200 space-y-1">
        <span class="font-black text-brand block">ثالثاً: تسليم العهد والممتلكات / Handover of Company Assets:</span>
        <p class="text-[11px] text-slate-700">
          أتعهد بالمحافظة على جميع العهد المسلمة لي (أجهزة، سيارات، بطاقات، مستندات) وتسليمها كاملة وبحالة جيدة فور طلب الإدارة أو عند انتهاء علاقتي التعاقدية قبل صرف أي مستحقات نهائية.
        </p>
      </div>

      <div class="p-3 rounded-xl border border-slate-200 space-y-1">
        <span class="font-black text-brand block">رابعاً: المسؤولية القانونية والملاحقة القضائية / Legal Liability:</span>
        <p class="text-[11px] text-slate-700">
          أقر بعلمي التام بأنه في حال مخالفتي لأي من هذه التعهدات، يحق للشركة اتخاذ الإجراءات الجزائية وفق المادة (80) من نظام العمل بفسخ العقد دون مكافأة أو إشعار، وملاحقتي قضائياً للمطالبة بالتعويضات عن كافة الأضرار المادية والمعنوية أمام المحاكم المختصة.
        </p>
      </div>
    </div>

    <!-- Signatures -->
    <div class="grid grid-cols-2 gap-8 pt-4 border-t-2 border-slate-200 text-xs">
      <div class="space-y-6">
        <p class="font-bold text-slate-700">المقر بما فيه (الموظف) / Employee Signature:</p>
        <div>
          <p class="text-[11px] font-bold text-slate-900">${candidateName}</p>
          <p class="text-[10px] text-slate-400 mt-1">التوقيع والبصمة: ........................................</p>
        </div>
      </div>
      <div class="space-y-6 text-left">
        <p class="font-bold text-slate-700">إدارة الشؤون القانونية والموارد البشرية:</p>
        <div>
          <p class="text-[11px] font-bold text-slate-900">شركة جوهرة المجد للمقاولات</p>
          <p class="text-[10px] text-slate-400 mt-1">الختم والاعتماد: ........................................</p>
        </div>
      </div>
    </div>

  </div>

</body>
</html>
    `;
  }
}

const atsRecruitmentService = new AtsRecruitmentService();
module.exports = atsRecruitmentService;
