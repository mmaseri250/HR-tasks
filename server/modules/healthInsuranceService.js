/**
 * server/modules/healthInsuranceService.js
 * Comprehensive Medical Insurance, Health Education & Municipal Health Cards Service
 * Jawharat Al-Majd HRMS — CCHI & Baladiya Compliant
 *
 * Capabilities:
 *  - CCHI Medical Insurance Policies & Employee Insurance Cards (VIP, A, B, C classes)
 *  - Municipal Health Cards for Workers (شهادات وبطاقات البلدية الصحية وتنبيهات الانتهاء)
 *  - Health Education & Awareness Portal (نشرات وتعاميم التثقيف الصحي والبوسترات المعتمدة)
 *  - Real-Time Compliance Alarms (<30 days & expired cards)
 *  - A4 Printable Official Health Certificates & Awareness Posters
 *  - Full Excel/CSV Export with UTF-8 BOM
 */

const { query, get, run } = require('../database/db');
const xlsx = require('xlsx');
const branding = require('./branding');

class HealthInsuranceService {
  constructor() {
    this.ensureTables();
  }

  /**
   * Ensure tables and columns exist
   */
  ensureTables() {
    // 1. Medical Insurance Policies
    run(`
      CREATE TABLE IF NOT EXISTS medical_insurance_policies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        policy_no TEXT UNIQUE NOT NULL,
        provider_name TEXT NOT NULL,
        policy_start TEXT,
        policy_end TEXT,
        category TEXT DEFAULT 'شامل موحد CCHI',
        network_tier TEXT DEFAULT 'الشبكة الذهبية والشاملة',
        max_coverage_per_person REAL DEFAULT 500000,
        status TEXT DEFAULT 'سارية',
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Employee Medical Insurance Cards
    run(`
      CREATE TABLE IF NOT EXISTS employee_insurance_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        emp_id INTEGER NOT NULL,
        emp_code TEXT,
        policy_id INTEGER,
        member_id TEXT UNIQUE NOT NULL,
        class_category TEXT DEFAULT 'B', -- VIP, A, B, C
        issue_date TEXT,
        expiry_date TEXT,
        copay_percent INTEGER DEFAULT 20,
        dependents_count INTEGER DEFAULT 0,
        blood_group TEXT DEFAULT 'O+',
        chronic_conditions TEXT,
        status TEXT DEFAULT 'سارية',
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE,
        FOREIGN KEY (policy_id) REFERENCES medical_insurance_policies(id) ON DELETE SET NULL
      )
    `);

    // 3. Municipal Health Cards (البطاقات الصحية للعمال - البلدية)
    run(`
      CREATE TABLE IF NOT EXISTS health_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        emp_id INTEGER NOT NULL,
        emp_code TEXT,
        card_no TEXT UNIQUE NOT NULL,
        municipality_name TEXT DEFAULT 'أمانة منطقة عسير',
        profession TEXT DEFAULT 'عامل تشغيل وتغذية',
        issue_date TEXT,
        expiry_date TEXT NOT NULL,
        medical_center TEXT DEFAULT 'مجمع عسير الطبي المعتمد',
        fitness_result TEXT DEFAULT 'لائق طبياً', -- لائق طبياً, غير لائق, قيد الفحص
        status TEXT DEFAULT 'سارية', -- سارية, منتهية, قيد التجديد
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
      )
    `);

    // 4. Health Education & Awareness Articles (التثقيف والتوعية الصحية)
    run(`
      CREATE TABLE IF NOT EXISTS health_education_articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title_ar TEXT NOT NULL,
        title_en TEXT,
        category TEXT DEFAULT 'سلامة ميدانية', -- سلامة ميدانية, إجهاد حراري, إسعافات أولية, بيئة العمل
        summary_ar TEXT,
        content_ar TEXT NOT NULL,
        content_en TEXT,
        icon TEXT DEFAULT 'fa-heart-pulse',
        badge_color TEXT DEFAULT 'emerald',
        target_audience TEXT DEFAULT 'كافة العاملين والمهندسين بالمشاريع',
        emergency_contacts TEXT,
        is_featured INTEGER DEFAULT 1,
        published_date TEXT DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add columns if table was created in an earlier migration
    const policyCols = [
      { name: 'network_tier', type: 'TEXT DEFAULT "الشبكة الذهبية والشاملة"' },
      { name: 'max_coverage_per_person', type: 'REAL DEFAULT 500000' },
      { name: 'notes', type: 'TEXT' }
    ];
    for (const c of policyCols) {
      try { run(`ALTER TABLE medical_insurance_policies ADD COLUMN ${c.name} ${c.type}`); } catch (e) {}
    }

    const cardCols = [
      { name: 'copay_percent', type: 'INTEGER DEFAULT 20' },
      { name: 'blood_group', type: 'TEXT DEFAULT "O+"' },
      { name: 'chronic_conditions', type: 'TEXT' },
      { name: 'notes', type: 'TEXT' }
    ];
    for (const c of cardCols) {
      try { run(`ALTER TABLE employee_insurance_cards ADD COLUMN ${c.name} ${c.type}`); } catch (e) {}
    }

    const healthCols = [
      { name: 'profession', type: 'TEXT DEFAULT "عامل تشغيل وتغذية"' },
      { name: 'fitness_result', type: 'TEXT DEFAULT "لائق طبياً"' },
      { name: 'notes', type: 'TEXT' }
    ];
    for (const c of healthCols) {
      try { run(`ALTER TABLE health_cards ADD COLUMN ${c.name} ${c.type}`); } catch (e) {}
    }

    // Indexes
    run(`CREATE INDEX IF NOT EXISTS idx_ins_emp ON employee_insurance_cards(emp_id)`);
    run(`CREATE INDEX IF NOT EXISTS idx_ins_exp ON employee_insurance_cards(expiry_date)`);
    run(`CREATE INDEX IF NOT EXISTS idx_health_emp ON health_cards(emp_id)`);
    run(`CREATE INDEX IF NOT EXISTS idx_health_exp ON health_cards(expiry_date)`);
    run(`CREATE INDEX IF NOT EXISTS idx_health_status ON health_cards(status)`);
  }

  /**
   * Seed realistic initial data - Disabled for production clean state
   */
  seedInitialData() {
    // No-op for production clean state
  }

  /**
   * Helper: Calculate expiry status and days remaining
   */
  computeExpiry(dateStr) {
    if (!dateStr) return { daysLeft: null, status: 'unknown', text_ar: 'غير مسجل' };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return { daysLeft, status: 'expired', text_ar: `منتهية منذ ${Math.abs(daysLeft)} يوم` };
    } else if (daysLeft <= 30) {
      return { daysLeft, status: 'expiring_soon', text_ar: `تنتهي خلال ${daysLeft} يوم` };
    } else {
      return { daysLeft, status: 'valid', text_ar: `سارية (${daysLeft} يوم متبقٍ)` };
    }
  }

  /**
   * Overall KPIs for Module 5
   */
  getInsuranceKpis() {
    const totalPolicies = get(`SELECT COUNT(*) as c FROM medical_insurance_policies`).c;
    const cards = this.getInsuranceCards();
    const healthCards = this.getHealthCards();
    const totalArticles = get(`SELECT COUNT(*) as c FROM health_education_articles`).c;

    let expiringInsurance = 0;
    let expiredInsurance = 0;
    let totalDependents = 0;

    cards.forEach(c => {
      totalDependents += (c.dependents_count || 0);
      if (c.expiry_info.status === 'expiring_soon') expiringInsurance++;
      if (c.expiry_info.status === 'expired') expiredInsurance++;
    });

    let expiringHealthCards = 0;
    let expiredHealthCards = 0;

    healthCards.forEach(h => {
      if (h.expiry_info.status === 'expiring_soon') expiringHealthCards++;
      if (h.expiry_info.status === 'expired') expiredHealthCards++;
    });

    const totalAlerts = expiringInsurance + expiredInsurance + expiringHealthCards + expiredHealthCards;

    return {
      total_policies: totalPolicies,
      total_insured_employees: cards.length,
      total_dependents: totalDependents,
      total_covered_lives: cards.length + totalDependents,
      insurance_alerts: {
        expiring_soon: expiringInsurance,
        expired: expiredInsurance
      },
      total_municipal_cards: healthCards.length,
      municipal_alerts: {
        expiring_soon: expiringHealthCards,
        expired: expiredHealthCards
      },
      total_health_articles: totalArticles,
      total_alerts: totalAlerts,
      cchi_compliance_rate: cards.length > 0 ? Math.round(((cards.length - expiredInsurance) / cards.length) * 100) : 100
    };
  }

  /* =========================================================================
     1. MEDICAL INSURANCE POLICIES
     ========================================================================= */

  getPolicies() {
    return query(`
      SELECT p.*,
        (SELECT COUNT(*) FROM employee_insurance_cards c WHERE c.policy_id = p.id) as covered_employees_count
      FROM medical_insurance_policies p
      ORDER BY p.id DESC
    `);
  }

  getPolicyById(id) {
    return get(`SELECT * FROM medical_insurance_policies WHERE id = ?`, [id]);
  }

  createPolicy(data) {
    if (!data.policy_no || !data.provider_name) {
      throw new Error('يرجى تعبئة الحقول الإلزامية: رقم الوثيقة واسم شركة التأمين.');
    }

    const res = run(`
      INSERT INTO medical_insurance_policies (
        policy_no, provider_name, policy_start, policy_end, category,
        network_tier, max_coverage_per_person, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.policy_no.trim(),
      data.provider_name.trim(),
      data.policy_start || null,
      data.policy_end || null,
      data.category || 'وثيقة الضمان الصحي الموحدة CCHI',
      data.network_tier || 'الشبكة الذهبية والشاملة',
      data.max_coverage_per_person ? parseFloat(data.max_coverage_per_person) : 500000,
      data.status || 'سارية',
      data.notes || null
    ]);

    return this.getPolicyById(res.lastInsertRowid);
  }

  updatePolicy(id, data) {
    const existing = this.getPolicyById(id);
    if (!existing) throw new Error('الوثيقة غير موجودة.');

    run(`
      UPDATE medical_insurance_policies SET
        policy_no = COALESCE(?, policy_no),
        provider_name = COALESCE(?, provider_name),
        policy_start = COALESCE(?, policy_start),
        policy_end = COALESCE(?, policy_end),
        category = COALESCE(?, category),
        network_tier = COALESCE(?, network_tier),
        max_coverage_per_person = COALESCE(?, max_coverage_per_person),
        status = COALESCE(?, status),
        notes = COALESCE(?, notes)
      WHERE id = ?
    `, [
      data.policy_no ? data.policy_no.trim() : null,
      data.provider_name ? data.provider_name.trim() : null,
      data.policy_start !== undefined ? data.policy_start : null,
      data.policy_end !== undefined ? data.policy_end : null,
      data.category !== undefined ? data.category : null,
      data.network_tier !== undefined ? data.network_tier : null,
      data.max_coverage_per_person !== undefined ? parseFloat(data.max_coverage_per_person) : null,
      data.status !== undefined ? data.status : null,
      data.notes !== undefined ? data.notes : null,
      id
    ]);

    return this.getPolicyById(id);
  }

  deletePolicy(id) {
    const cardCheck = get(`SELECT COUNT(*) as c FROM employee_insurance_cards WHERE policy_id = ?`, [id]);
    if (cardCheck && cardCheck.c > 0) {
      throw new Error(`لا يمكن حذف الوثيقة لأنها مرتبطة بـ (${cardCheck.c}) بطاقة تأمين موظفين.`);
    }
    run(`DELETE FROM medical_insurance_policies WHERE id = ?`, [id]);
    return { success: true, message: 'تم حذف وثيقة التأمين بنجاح.' };
  }

  /* =========================================================================
     2. EMPLOYEE MEDICAL INSURANCE CARDS
     ========================================================================= */

  getInsuranceCards(filters = {}) {
    let sql = `
      SELECT c.*,
             e.full_name_ar as emp_name, e.full_name_en as emp_name_en,
             e.national_id, e.nationality, e.gender, e.birth_date,
             e.job_title_ar as emp_job, d.name_ar as dept_name,
             p.provider_name, p.policy_no, p.network_tier
      FROM employee_insurance_cards c
      JOIN employees e ON (c.emp_id = e.id OR (c.emp_code IS NOT NULL AND c.emp_code = e.emp_code))
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN medical_insurance_policies p ON c.policy_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.class_category) {
      sql += ` AND c.class_category = ?`;
      params.push(filters.class_category);
    }

    if (filters.status) {
      sql += ` AND c.status = ?`;
      params.push(filters.status);
    }

    if (filters.policy_id) {
      sql += ` AND c.policy_id = ?`;
      params.push(filters.policy_id);
    }

    if (filters.search) {
      const term = `%${filters.search.trim()}%`;
      sql += ` AND (
        e.full_name_ar LIKE ? OR
        e.emp_code LIKE ? OR
        c.member_id LIKE ? OR
        e.national_id LIKE ?
      )`;
      params.push(term, term, term, term);
    }

    sql += ` ORDER BY c.id DESC`;

    const rows = query(sql, params);

    return rows.map(r => {
      const expiryInfo = this.computeExpiry(r.expiry_date);
      return {
        ...r,
        expiry_info: expiryInfo,
        has_alert: expiryInfo.status === 'expired' || expiryInfo.status === 'expiring_soon'
      };
    });
  }

  getInsuranceCardById(id) {
    const card = get(`
      SELECT c.*,
             e.full_name_ar as emp_name, e.full_name_en as emp_name_en,
             e.national_id, e.nationality, e.gender, e.birth_date,
             e.job_title_ar as emp_job, e.phone as emp_phone,
             d.name_ar as dept_name, b.name_ar as branch_name,
             p.provider_name, p.policy_no, p.network_tier, p.max_coverage_per_person
      FROM employee_insurance_cards c
      JOIN employees e ON (c.emp_id = e.id OR (c.emp_code IS NOT NULL AND c.emp_code = e.emp_code))
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN branches b ON e.branch_id = b.id
      LEFT JOIN medical_insurance_policies p ON c.policy_id = p.id
      WHERE c.id = ?
    `, [id]);

    if (!card) return null;
    return {
      ...card,
      expiry_info: this.computeExpiry(card.expiry_date)
    };
  }

  createInsuranceCard(data) {
    if (!data.emp_id) throw new Error('يرجى تحديد الموظف.');

    const emp = get(`SELECT id, emp_code, full_name_ar FROM employees WHERE id = ?`, [data.emp_id]);
    if (!emp) throw new Error('الموظف غير موجود.');

    // Generate member_id if omitted
    const memberId = data.member_id ? data.member_id.trim() : `BUP-${new Date().getFullYear()}-${String(emp.id).padStart(5, '0')}`;

    // Verify member_id uniqueness
    const dupCheck = get(`SELECT id FROM employee_insurance_cards WHERE member_id = ?`, [memberId]);
    if (dupCheck) throw new Error(`رقم بطاقة التأمين (${memberId}) مسجل مسبقاً.`);

    const res = run(`
      INSERT INTO employee_insurance_cards (
        emp_id, emp_code, policy_id, member_id, class_category,
        issue_date, expiry_date, copay_percent, dependents_count,
        blood_group, chronic_conditions, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      emp.id,
      emp.emp_code,
      data.policy_id ? parseInt(data.policy_id, 10) : null,
      memberId,
      data.class_category || 'B',
      data.issue_date || new Date().toISOString().split('T')[0],
      data.expiry_date || '2026-12-31',
      data.copay_percent !== undefined ? parseInt(data.copay_percent, 10) : 20,
      data.dependents_count !== undefined ? parseInt(data.dependents_count, 10) : 0,
      data.blood_group || 'O+',
      data.chronic_conditions || null,
      data.status || 'سارية',
      data.notes || null
    ]);

    return this.getInsuranceCardById(res.lastInsertRowid);
  }

  updateInsuranceCard(id, data) {
    const existing = this.getInsuranceCardById(id);
    if (!existing) throw new Error('بطاقة التأمين غير موجودة.');

    run(`
      UPDATE employee_insurance_cards SET
        policy_id = COALESCE(?, policy_id),
        class_category = COALESCE(?, class_category),
        issue_date = COALESCE(?, issue_date),
        expiry_date = COALESCE(?, expiry_date),
        copay_percent = COALESCE(?, copay_percent),
        dependents_count = COALESCE(?, dependents_count),
        blood_group = COALESCE(?, blood_group),
        chronic_conditions = COALESCE(?, chronic_conditions),
        status = COALESCE(?, status),
        notes = COALESCE(?, notes)
      WHERE id = ?
    `, [
      data.policy_id !== undefined ? (data.policy_id ? parseInt(data.policy_id, 10) : null) : null,
      data.class_category !== undefined ? data.class_category : null,
      data.issue_date !== undefined ? data.issue_date : null,
      data.expiry_date !== undefined ? data.expiry_date : null,
      data.copay_percent !== undefined ? parseInt(data.copay_percent, 10) : null,
      data.dependents_count !== undefined ? parseInt(data.dependents_count, 10) : null,
      data.blood_group !== undefined ? data.blood_group : null,
      data.chronic_conditions !== undefined ? data.chronic_conditions : null,
      data.status !== undefined ? data.status : null,
      data.notes !== undefined ? data.notes : null,
      id
    ]);

    return this.getInsuranceCardById(id);
  }

  deleteInsuranceCard(id) {
    const existing = this.getInsuranceCardById(id);
    if (!existing) throw new Error('بطاقة التأمين غير موجودة.');
    run(`DELETE FROM employee_insurance_cards WHERE id = ?`, [id]);
    return { success: true, message: `تم حذف بطاقة التأمين (${existing.member_id}) بنجاح.` };
  }

  /* =========================================================================
     3. MUNICIPAL HEALTH CARDS (البطاقات الصحية للعمال - البلدية)
     ========================================================================= */

  getHealthCards(filters = {}) {
    let sql = `
      SELECT h.*,
             e.full_name_ar as emp_name, e.full_name_en as emp_name_en,
             e.national_id, e.nationality, e.gender, e.birth_date,
             e.job_title_ar as emp_job, d.name_ar as dept_name
      FROM health_cards h
      JOIN employees e ON (h.emp_id = e.id OR (h.emp_code IS NOT NULL AND h.emp_code = e.emp_code))
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      sql += ` AND h.status = ?`;
      params.push(filters.status);
    }

    if (filters.fitness_result) {
      sql += ` AND h.fitness_result = ?`;
      params.push(filters.fitness_result);
    }

    if (filters.municipality) {
      sql += ` AND h.municipality_name LIKE ?`;
      params.push(`%${filters.municipality.trim()}%`);
    }

    if (filters.search) {
      const term = `%${filters.search.trim()}%`;
      sql += ` AND (
        e.full_name_ar LIKE ? OR
        e.emp_code LIKE ? OR
        h.card_no LIKE ? OR
        e.national_id LIKE ? OR
        h.profession LIKE ?
      )`;
      params.push(term, term, term, term, term);
    }

    sql += ` ORDER BY h.expiry_date ASC, h.id DESC`;

    const rows = query(sql, params);

    return rows.map(r => {
      const expiryInfo = this.computeExpiry(r.expiry_date);
      return {
        ...r,
        expiry_info: expiryInfo,
        has_alert: expiryInfo.status === 'expired' || expiryInfo.status === 'expiring_soon'
      };
    });
  }

  getHealthCardById(id) {
    const card = get(`
      SELECT h.*,
             e.full_name_ar as emp_name, e.full_name_en as emp_name_en,
             e.national_id, e.nationality, e.gender, e.birth_date,
             e.job_title_ar as emp_job, e.phone as emp_phone,
             d.name_ar as dept_name
      FROM health_cards h
      JOIN employees e ON (h.emp_id = e.id OR (h.emp_code IS NOT NULL AND h.emp_code = e.emp_code))
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE h.id = ?
    `, [id]);

    if (!card) return null;
    return {
      ...card,
      expiry_info: this.computeExpiry(card.expiry_date)
    };
  }

  createHealthCard(data) {
    if (!data.emp_id || !data.expiry_date) {
      throw new Error('يرجى تحديد الموظف وتاريخ انتهاء البطاقة الصحية.');
    }

    const emp = get(`SELECT id, emp_code, full_name_ar FROM employees WHERE id = ?`, [data.emp_id]);
    if (!emp) throw new Error('الموظف غير موجود.');

    const cardNo = data.card_no ? data.card_no.trim() : `BALAD-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

    const dup = get(`SELECT id FROM health_cards WHERE card_no = ?`, [cardNo]);
    if (dup) throw new Error(`رقم الشهادة الصحية (${cardNo}) مسجل مسبقاً.`);

    const res = run(`
      INSERT INTO health_cards (
        emp_id, emp_code, card_no, municipality_name, profession,
        issue_date, expiry_date, medical_center, fitness_result, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      emp.id,
      emp.emp_code,
      cardNo,
      data.municipality_name || 'أمانة منطقة عسير',
      data.profession || 'عامل تشغيل وتغذية',
      data.issue_date || new Date().toISOString().split('T')[0],
      data.expiry_date,
      data.medical_center || 'مجمع عسير الطبي المعتمد',
      data.fitness_result || 'لائق طبياً',
      data.status || 'سارية',
      data.notes || null
    ]);

    return this.getHealthCardById(res.lastInsertRowid);
  }

  updateHealthCard(id, data) {
    const existing = this.getHealthCardById(id);
    if (!existing) throw new Error('البطاقة الصحية غير موجودة.');

    run(`
      UPDATE health_cards SET
        municipality_name = COALESCE(?, municipality_name),
        profession = COALESCE(?, profession),
        issue_date = COALESCE(?, issue_date),
        expiry_date = COALESCE(?, expiry_date),
        medical_center = COALESCE(?, medical_center),
        fitness_result = COALESCE(?, fitness_result),
        status = COALESCE(?, status),
        notes = COALESCE(?, notes)
      WHERE id = ?
    `, [
      data.municipality_name !== undefined ? data.municipality_name : null,
      data.profession !== undefined ? data.profession : null,
      data.issue_date !== undefined ? data.issue_date : null,
      data.expiry_date !== undefined ? data.expiry_date : null,
      data.medical_center !== undefined ? data.medical_center : null,
      data.fitness_result !== undefined ? data.fitness_result : null,
      data.status !== undefined ? data.status : null,
      data.notes !== undefined ? data.notes : null,
      id
    ]);

    return this.getHealthCardById(id);
  }

  deleteHealthCard(id) {
    const existing = this.getHealthCardById(id);
    if (!existing) throw new Error('البطاقة الصحية غير موجودة.');
    run(`DELETE FROM health_cards WHERE id = ?`, [id]);
    return { success: true, message: `تم حذف البطاقة الصحية (${existing.card_no}) بنجاح.` };
  }

  /* =========================================================================
     4. HEALTH EDUCATION & AWARENESS (التثقيف الصحي)
     ========================================================================= */

  getHealthArticles(filters = {}) {
    let sql = `SELECT * FROM health_education_articles WHERE 1=1`;
    const params = [];

    if (filters.category) {
      sql += ` AND category = ?`;
      params.push(filters.category);
    }

    if (filters.search) {
      const term = `%${filters.search.trim()}%`;
      sql += ` AND (title_ar LIKE ? OR summary_ar LIKE ? OR content_ar LIKE ?)`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY is_featured DESC, id DESC`;
    return query(sql, params);
  }

  getHealthArticleById(id) {
    return get(`SELECT * FROM health_education_articles WHERE id = ?`, [id]);
  }

  createHealthArticle(data) {
    if (!data.title_ar || !data.content_ar) {
      throw new Error('يرجى إدخال عنوان المقال والمحتوى التثقيفي.');
    }

    const res = run(`
      INSERT INTO health_education_articles (
        title_ar, title_en, category, summary_ar, content_ar, content_en,
        icon, badge_color, target_audience, emergency_contacts, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.title_ar.trim(),
      data.title_en ? data.title_en.trim() : null,
      data.category || 'سلامة ميدانية',
      data.summary_ar || null,
      data.content_ar,
      data.content_en || null,
      data.icon || 'fa-heart-pulse',
      data.badge_color || 'emerald',
      data.target_audience || 'كافة منسوبي الشركة',
      data.emergency_contacts || 'طوارئ الهلال الأحمر: 997',
      data.is_featured !== undefined ? (data.is_featured ? 1 : 0) : 1
    ]);

    return this.getHealthArticleById(res.lastInsertRowid);
  }

  /* =========================================================================
     5. OFFICIAL A4 PRINTABLE CERTIFICATES & POSTERS
     ========================================================================= */

  /**
   * Printable A4 Digital Medical Insurance Card Certificate
   */
  generateInsuranceCardPrintHtml(cardId) {
    const card = this.getInsuranceCardById(cardId);
    if (!card) throw new Error('بطاقة التأمين غير موجودة.');

    const classBadgeColor = card.class_category === 'VIP' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                           card.class_category === 'A' ? 'bg-purple-100 text-purple-900 border-purple-300' :
                           'bg-blue-100 text-blue-900 border-blue-300';

    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>بطاقة التأمين الطبي الرقمية - ${card.emp_name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; background: #fff; color: #0f172a; padding: 20px; }
    .brand-border { border-color: #700c14; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      @page { size: A4; margin: 12mm; }
    }
  </style>
</head>
<body class="max-w-3xl mx-auto space-y-4">

  <!-- Print Toolbar -->
  <div class="no-print flex items-center justify-between bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-lg mb-4">
    <div class="flex items-center gap-3">
      <i class="fa-solid fa-heart-pulse text-rose-500 text-xl"></i>
      <div>
        <p class="font-black text-sm">شهادة وبطاقة التأمين الطبي الرقمية المعتمدة (CCHI)</p>
        <p class="text-xs text-slate-300">صالحة للاستخدام لدى المستشفيات والمراكز الطبية المعتمدة بالمملكة</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button onclick="window.print()" class="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center gap-2 transition shadow">
        <i class="fa-solid fa-print"></i> طباعة البطاقة (Print A4)
      </button>
      <button onclick="window.close()" class="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs">
        إغلاق
      </button>
    </div>
  </div>

  <!-- A4 Certificate Border -->
  <div class="border-2 brand-border rounded-2xl p-6 bg-white space-y-5 relative overflow-hidden shadow-sm">
    
    <!-- Watermark -->
    <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
      <i class="fa-solid fa-hand-holding-medical text-[350px] text-slate-900"></i>
    </div>

    <!-- Official Header -->
    <div class="flex items-center justify-between border-b-2 brand-border pb-4">
      <div class="text-right space-y-1">
        <h2 class="font-black text-lg text-slate-900">${branding.companyNameAr}</h2>
        <p class="text-xs font-semibold text-slate-600">إدارة الموارد البشرية والخدمات الطبية</p>
        <p class="text-[11px] text-slate-500">معتمد لدى مجلس الضمان الصحي التعاوني (CCHI)</p>
      </div>
      <div class="text-center px-4 py-2 border brand-border rounded-xl bg-white shadow-sm">
        <img src="${branding.logoBase64}" alt="شعار شركة جوهرة المجد" class="h-12 max-w-[140px] object-contain mx-auto" />
        <span class="text-[9px] font-black tracking-widest text-[#700c14] block mt-1">CCHI HEALTH CARD</span>
      </div>
      <div class="text-left space-y-1 text-xs">
        <div class="font-bold text-slate-700">رقم العضوية: <span class="font-mono text-slate-900 font-black">${card.member_id}</span></div>
        <div class="font-bold text-slate-700">فئة التأمين: <span class="font-black text-indigo-700">${card.class_category}</span></div>
        <div class="font-bold text-slate-700">الحالة: <span class="text-emerald-700 font-bold">${card.status}</span></div>
      </div>
    </div>

    <!-- Title Banner -->
    <div class="text-center py-2 bg-gradient-to-r from-slate-900 via-[#700c14] to-slate-900 text-white rounded-xl shadow-sm">
      <h1 class="text-sm font-black tracking-wide">شهادة عضوية التأمين الطبي التعاوني الموحد</h1>
      <p class="text-[10px] text-amber-300 font-medium tracking-wider">COOPERATIVE HEALTH INSURANCE MEMBERSHIP CERTIFICATE</p>
    </div>

    <!-- Digital Card Visual Widget -->
    <div class="max-w-xl mx-auto rounded-2xl p-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden border border-slate-700">
      <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm border border-emerald-400/30">
            <i class="fa-solid fa-shield-heart"></i>
          </div>
          <div>
            <span class="text-xs font-black block">${card.provider_name || 'شركة بوبا العربية للتأمين التعاوني'}</span>
            <span class="text-[9px] text-slate-300">${card.network_tier || 'الشبكة الذهبية والشاملة'}</span>
          </div>
        </div>
        <span class="px-2.5 py-0.5 rounded-full text-xs font-black border ${classBadgeColor}">
          CLASS ${card.class_category}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-3 text-xs mb-3">
        <div>
          <span class="text-[10px] text-slate-400 block">اسم المؤمن له / Insured Name:</span>
          <span class="font-black text-white text-sm block">${card.emp_name}</span>
          <span class="text-[10px] text-slate-300 font-mono">${card.emp_name_en || ''}</span>
        </div>
        <div>
          <span class="text-[10px] text-slate-400 block">رقم الهوية / الإقامة:</span>
          <span class="font-bold text-amber-400 font-mono text-sm block">${card.national_id || '---'}</span>
          <span class="text-[10px] text-slate-300">الرقم الوظيفي: ${card.emp_code}</span>
        </div>
      </div>

      <div class="grid grid-cols-4 gap-2 pt-2 border-t border-white/10 text-center text-[10px]">
        <div>
          <span class="text-slate-400 block text-[9px]">فصيلة الدم</span>
          <span class="font-black text-rose-400">${card.blood_group || 'O+'}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[9px]">نسبة التحمل</span>
          <span class="font-black text-white">${card.copay_percent}%</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[9px]">تاريخ الانتهاء</span>
          <span class="font-bold font-mono text-amber-300">${card.expiry_date}</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[9px]">التابعون</span>
          <span class="font-black text-white">${card.dependents_count || 0} أفراد</span>
        </div>
      </div>
    </div>

    <!-- Policy Benefits & Terms -->
    <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
      <div class="bg-slate-100 px-3 py-2 font-black text-slate-800">
        تفاصيل التغطية التأمينية والحدود المالية (معايير CCHI):
      </div>
      <div class="p-3 bg-white grid grid-cols-3 gap-3">
        <div class="p-2 border rounded-lg bg-slate-50">
          <span class="text-slate-500 block text-[10px]">الحد الأقصى للتغطية السنوية:</span>
          <span class="font-bold text-slate-900 font-mono">${Number(card.max_coverage_per_person || 500000).toLocaleString('en-US')} ر.س</span>
        </div>
        <div class="p-2 border rounded-lg bg-slate-50">
          <span class="text-slate-500 block text-[10px]">تنويم المستشفيات والعمليات:</span>
          <span class="font-bold text-emerald-700">مغطى بنسبة 100% بدون تحمل</span>
        </div>
        <div class="p-2 border rounded-lg bg-slate-50">
          <span class="text-slate-500 block text-[10px]">العيادات الخارجية والأدوية:</span>
          <span class="font-bold text-slate-900">نسبة التحمل ${card.copay_percent}% (بحد أقصى نظامي)</span>
        </div>
      </div>
    </div>

    <!-- Official Contacts & Signatures -->
    <div class="grid grid-cols-2 gap-4 pt-3 text-xs border-t border-slate-200">
      <div class="space-y-1 text-slate-600">
        <p class="font-bold text-slate-800">للحصول على الموافقة الطبية والاستفسارات:</p>
        <p>مركز خدمة العملاء: 8002440307 | مركز اتصال مجلس الضمان الصحي: 920001177</p>
        <p class="text-[10px] text-slate-400">تطبيق صحتي و مجلس الضمان متاح للتحقق الفوري من حالة السريان.</p>
      </div>

      <div class="text-left space-y-2">
        <p class="font-bold text-slate-800">اعتماد إدارة الموارد البشرية والخدمات الطبية:</p>
        <p class="text-xs font-black text-[#700c14]">شركة جوهرة المجد للمقاولات والتجارة</p>
        <p class="text-[10px] text-slate-400">الختم والاعتماد الرسمي المعتمد</p>
      </div>
    </div>

  </div>

</body>
</html>
    `;
  }

  /**
   * Printable A4 Official Municipal Worker Health Card (شهادة البلدية الصحية)
   */
  generateHealthCardPrintHtml(cardId) {
    const card = this.getHealthCardById(cardId);
    if (!card) throw new Error('البطاقة الصحية للبلدية غير موجودة.');

    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>شهادة فحص صحي مهني (بلدية) - ${card.emp_name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; background: #fff; color: #0f172a; padding: 20px; }
    .brand-border { border-color: #15803d; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      @page { size: A4; margin: 12mm; }
    }
  </style>
</head>
<body class="max-w-3xl mx-auto space-y-4">

  <!-- Print Toolbar -->
  <div class="no-print flex items-center justify-between bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-lg mb-4">
    <div class="flex items-center gap-3">
      <i class="fa-solid fa-id-badge text-emerald-400 text-xl"></i>
      <div>
        <p class="font-black text-sm">البطاقة والشهادة الصحية المهنية لعمال البلدية المعتمدة</p>
        <p class="text-xs text-slate-300">مطابقة لاشتراطات أمانة منطقة عسير ووزارة البلديات والإسكان</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button onclick="window.print()" class="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center gap-2 transition shadow">
        <i class="fa-solid fa-print"></i> طباعة الشهادة (Print A4)
      </button>
      <button onclick="window.close()" class="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs">
        إغلاق
      </button>
    </div>
  </div>

  <!-- Certificate Box -->
  <div class="border-2 brand-border rounded-2xl p-6 bg-white space-y-5 relative overflow-hidden shadow-sm">
    
    <!-- Watermark -->
    <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
      <i class="fa-solid fa-certificate text-[380px] text-emerald-900"></i>
    </div>

    <!-- Official Header -->
    <div class="flex items-center justify-between border-b-2 brand-border pb-4">
      <div class="text-right space-y-1">
        <h2 class="font-black text-base text-slate-900">${card.municipality_name}</h2>
        <p class="text-xs font-semibold text-slate-600">الإدارة العامة لصحة البيئة والرقابة الشاملة</p>
        <p class="text-[11px] text-emerald-700 font-bold">${branding.companyNameAr} (المنشأة المشغلة)</p>
      </div>
      <div class="text-center px-4 py-2 border brand-border rounded-xl bg-white shadow-sm">
        <img src="${branding.logoBase64}" alt="شعار شركة جوهرة المجد" class="h-12 max-w-[140px] object-contain mx-auto" />
        <span class="text-[9px] font-black tracking-widest text-emerald-800 block mt-1">MUNICIPAL HEALTH CARD</span>
      </div>
      <div class="text-left space-y-1 text-xs">
        <div class="font-bold text-slate-700">رقم الشهادة: <span class="font-mono text-slate-900 font-black">${card.card_no}</span></div>
        <div class="font-bold text-slate-700">تاريخ الإصدار: <span class="font-mono text-slate-900">${card.issue_date || '---'}</span></div>
        <div class="font-bold text-slate-700">تاريخ الانتهاء: <span class="font-mono text-emerald-700 font-black">${card.expiry_date}</span></div>
      </div>
    </div>

    <!-- Banner -->
    <div class="text-center py-2.5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white rounded-xl shadow-sm">
      <h1 class="text-sm font-black tracking-wide">الشهادة الصحية المهنية للعاملين بالمشاريع والمنشآت</h1>
      <p class="text-[10px] text-emerald-200 font-medium tracking-wider">OFFICIAL MUNICIPAL WORKER HEALTH & HYGIENE CARD</p>
    </div>

    <!-- Worker & Medical Details -->
    <div class="grid grid-cols-3 gap-4 border border-slate-200 rounded-xl p-4 bg-white text-xs">
      <div class="space-y-2 col-span-2">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <span class="text-slate-500 block text-[11px]">اسم العامل:</span>
            <span class="font-black text-slate-900 text-sm">${card.emp_name}</span>
          </div>
          <div>
            <span class="text-slate-500 block text-[11px]">رقم الإقامة / الهوية:</span>
            <span class="font-bold text-slate-900 font-mono text-sm">${card.national_id || '---'}</span>
          </div>
          <div>
            <span class="text-slate-500 block text-[11px]">المهنة المرخصة:</span>
            <span class="font-bold text-slate-900">${card.profession}</span>
          </div>
          <div>
            <span class="text-slate-500 block text-[11px]">الجنسية:</span>
            <span class="font-bold text-slate-900">${card.nationality || 'سعودي'}</span>
          </div>
          <div>
            <span class="text-slate-500 block text-[11px]">المنشأة التابع لها:</span>
            <span class="font-bold text-slate-900">شركة جوهرة المجد للمقاولات والتجارة</span>
          </div>
          <div>
            <span class="text-slate-500 block text-[11px]">المركز الطبي الفاحص:</span>
            <span class="font-bold text-slate-900">${card.medical_center}</span>
          </div>
        </div>
      </div>

      <!-- Worker Photo / Verification Box -->
      <div class="border-2 border-dashed border-slate-300 rounded-xl p-3 flex flex-col items-center justify-center text-center bg-slate-50">
        <div class="w-20 h-24 rounded-lg bg-slate-200 border flex items-center justify-center text-slate-400 mb-2">
          <i class="fa-solid fa-user text-3xl"></i>
        </div>
        <span class="text-[10px] font-bold text-slate-600 block">صورة العامل المعتمدة</span>
        <span class="px-2 py-0.5 mt-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black">${card.fitness_result}</span>
      </div>
    </div>

    <!-- Laboratory & Clinical Results -->
    <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
      <div class="bg-slate-100 px-3 py-2 font-black text-slate-800">
        نتائج الفحوصات المخبرية والسريرية المعتمدة:
      </div>
      <div class="p-3 bg-white grid grid-cols-4 gap-2 text-center">
        <div class="p-2 border rounded-lg bg-emerald-50/50">
          <span class="text-slate-500 block text-[10px]">فحص الصدر (X-Ray):</span>
          <span class="font-black text-emerald-800">سليم وخالٍ من العدوى</span>
        </div>
        <div class="p-2 border rounded-lg bg-emerald-50/50">
          <span class="text-slate-500 block text-[10px]">فحص الدم والطفيليات:</span>
          <span class="font-black text-emerald-800">سلبي (سليم)</span>
        </div>
        <div class="p-2 border rounded-lg bg-emerald-50/50">
          <span class="text-slate-500 block text-[10px]">التطعيمات الوقائية:</span>
          <span class="font-black text-emerald-800">مكتمل ومحدث</span>
        </div>
        <div class="p-2 border rounded-lg bg-emerald-50/50">
          <span class="text-slate-500 block text-[10px]">النتيجة النهائية:</span>
          <span class="font-black text-emerald-800">${card.fitness_result}</span>
        </div>
      </div>
    </div>

    <!-- Municipal Stamp & Signatures -->
    <div class="grid grid-cols-3 gap-4 pt-4 text-xs border-t border-slate-200">
      <div class="space-y-4">
        <p class="font-bold text-slate-800">الطبيب الفاحص المعتمد:</p>
        <p class="text-[10px] text-slate-400">التوقيع: ............................</p>
      </div>

      <div class="space-y-4 text-center">
        <p class="font-bold text-slate-800">ختم المركز الطبي المعتمد:</p>
        <p class="text-[10px] text-slate-400">[ خـتـم مـعـتـمـد ]</p>
      </div>

      <div class="space-y-4 text-left">
        <p class="font-bold text-slate-800">اعتماد ${card.municipality_name}:</p>
        <p class="text-[10px] text-slate-400">إدارة صحة البيئة والرقابة</p>
      </div>
    </div>

  </div>

</body>
</html>
    `;
  }

  /**
   * Printable A4 Health Awareness Poster (بوستر توعوي صحي معتمد)
   */
  generateHealthArticlePrintHtml(articleId) {
    const art = this.getHealthArticleById(articleId);
    if (!art) throw new Error('المقال التثقيفي غير موجود.');

    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>${art.title_ar}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; background: #fff; color: #0f172a; padding: 20px; }
    .brand-border { border-color: #700c14; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      @page { size: A4; margin: 12mm; }
    }
  </style>
</head>
<body class="max-w-3xl mx-auto space-y-4">

  <!-- Print Toolbar -->
  <div class="no-print flex items-center justify-between bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-lg mb-4">
    <div class="flex items-center gap-3">
      <i class="fa-solid fa-bullhorn text-amber-400 text-xl"></i>
      <div>
        <p class="font-black text-sm">نشرة وبوستر التثقيف والتوعية الصحية الميدانية</p>
        <p class="text-xs text-slate-300">جاهز للطباعة والتعليق في مواقع المشاريع ومقر الشركة</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button onclick="window.print()" class="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 transition shadow">
        <i class="fa-solid fa-print"></i> طباعة البوستر (Print A4)
      </button>
      <button onclick="window.close()" class="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs">
        إغلاق
      </button>
    </div>
  </div>

  <!-- Poster Container -->
  <div class="border-4 brand-border rounded-3xl p-8 bg-white space-y-6 relative overflow-hidden shadow-lg">
    
    <!-- Header -->
    <div class="flex items-center justify-between border-b-2 brand-border pb-4">
      <div class="text-right space-y-1">
        <h2 class="font-black text-lg text-slate-900">شركة جوهرة المجد للمقاولات والتجارة</h2>
        <p class="text-xs font-bold text-slate-600">إدارة السلامة والصحة المهنية والخدمات الطبية (HSE)</p>
      </div>
      <div class="text-center">
        <span class="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5">
          <i class="fa-solid fa-heart-pulse"></i> نشرة توعية صحية رسمية
        </span>
      </div>
    </div>

    <!-- Title -->
    <div class="text-center py-4 bg-gradient-to-r from-slate-900 via-[#700c14] to-slate-900 text-white rounded-2xl p-4 shadow">
      <div class="w-12 h-12 mx-auto rounded-full bg-white/10 text-amber-400 flex items-center justify-center text-2xl mb-2">
        <i class="fa-solid ${art.icon || 'fa-heart-pulse'}"></i>
      </div>
      <h1 class="text-xl font-black">${art.title_ar}</h1>
      ${art.title_en ? `<p class="text-xs text-amber-300 mt-1 font-mono">${art.title_en}</p>` : ''}
    </div>

    <!-- Target Audience Banner -->
    <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
      <span class="font-bold text-slate-700">الفئة المستهدفة: <span class="text-slate-900">${art.target_audience}</span></span>
      <span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">${art.category}</span>
    </div>

    <!-- Content Body -->
    <div class="text-xs leading-relaxed text-slate-800 space-y-3 prose max-w-none">
      ${art.content_ar}
    </div>

    <!-- Emergency Contacts Block -->
    <div class="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs flex items-center justify-between">
      <div class="flex items-center gap-3">
        <i class="fa-solid fa-phone-volume text-2xl text-amber-600"></i>
        <div>
          <span class="font-black text-amber-950 block">أرقام الطوارئ والتواصل الطبي المباشر:</span>
          <span class="font-bold text-amber-900 font-mono text-[11px]">${art.emergency_contacts || 'طوارئ الهلال الأحمر: 997 | مركز اتصال الصحة: 937'}</span>
        </div>
      </div>
      <div class="text-left font-mono font-bold text-slate-500 text-[10px]">
        تاريخ الإصدار: ${art.published_date || new Date().toISOString().split('T')[0]}
      </div>
    </div>

    <!-- Footer -->
    <div class="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
      سلامتكم وصحتكم أولوية مطلقة — صادر عن إدارة الموارد البشرية والسلامة والصحة المهنية بشركة جوهرة المجد.
    </div>

  </div>

</body>
</html>
    `;
  }

  /* =========================================================================
     6. EXPORT UTILITIES (CSV with UTF-8 BOM & EXCEL)
     ========================================================================= */

  exportInsuranceCardsCsv() {
    const cards = this.getInsuranceCards();
    const headers = [
      'م', 'رقم العضوية', 'اسم الموظف', 'الرقم الوظيفي', 'الهوية/الإقامة',
      'فئة التأمين', 'شركة التأمين', 'رقم الوثيقة', 'تاريخ الإصدار',
      'تاريخ الانتهاء', 'نسبة التحمل', 'التابعون', 'فصيلة الدم', 'حالة البطاقة'
    ];

    const escapeCsv = val => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const rows = cards.map((c, idx) => [
      idx + 1,
      c.member_id,
      c.emp_name,
      c.emp_code,
      c.national_id || '',
      c.class_category,
      c.provider_name || '',
      c.policy_no || '',
      c.issue_date || '',
      c.expiry_date || '',
      `${c.copay_percent}%`,
      c.dependents_count || 0,
      c.blood_group || '',
      c.status
    ]);

    const content = [
      headers.map(escapeCsv).join(','),
      ...rows.map(r => r.map(escapeCsv).join(','))
    ].join('\r\n');

    return '\uFEFF' + content;
  }

  exportHealthCardsCsv() {
    const cards = this.getHealthCards();
    const headers = [
      'م', 'رقم الشهادة الصحية', 'اسم العامل', 'الرقم الوظيفي', 'الهوية/الإقامة',
      'المهنة المرخصة', 'الأمانة/البلدية', 'المركز الطبي', 'تاريخ الإصدار',
      'تاريخ الانتهاء', 'نتيجة الفحص', 'حالة الشهادة', 'ملاحظات'
    ];

    const escapeCsv = val => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const rows = cards.map((c, idx) => [
      idx + 1,
      c.card_no,
      c.emp_name,
      c.emp_code,
      c.national_id || '',
      c.profession,
      c.municipality_name,
      c.medical_center,
      c.issue_date || '',
      c.expiry_date,
      c.fitness_result,
      c.status,
      c.notes || ''
    ]);

    const content = [
      headers.map(escapeCsv).join(','),
      ...rows.map(r => r.map(escapeCsv).join(','))
    ].join('\r\n');

    return '\uFEFF' + content;
  }
}

module.exports = new HealthInsuranceService();
