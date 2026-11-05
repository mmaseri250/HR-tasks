/**
 * server/modules/fleetService.js
 * Comprehensive Fleet & Vehicle Management Service (Tamm Platform Compliant)
 * Jawharat Al-Majd HRMS — Saudi Labor Law & Tamm Integration Ready
 *
 * Core Capabilities:
 *  - Full Fleet CRUD & Odometer Tracking
 *  - Tamm Integration Fields (Istimara, Fahas الدوري, Vehicle Insurance, Delegations)
 *  - Real-Time Compliance Alarms (Expired / Expiring Within 30 Days)
 *  - Employee Vehicle Custody Handover & Return Lifecycle with Audit Logging
 *  - Excel / CSV Import & Export with UTF-8 BOM
 *  - A4 Printable Official Vehicle Custody Handover Certificate (محضر تسليم عهدة مركبة)
 *  - Fleet KPIs & Dashboard Statistics
 */

const { query, get, run } = require('../database/db');
const xlsx = require('xlsx');
const branding = require('./branding');

class FleetService {
  constructor() {
    this.ensureTables();
  }

  /**
   * Ensure fleet tables and indexes exist with all Tamm fields
   */
  ensureTables() {
    // 1. Vehicles Table
    run(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plate_number_ar TEXT NOT NULL,
        plate_number_en TEXT,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        color TEXT,
        vin_serial TEXT UNIQUE,
        vehicle_type TEXT DEFAULT 'نقل خاص',
        assigned_emp_id INTEGER,
        assigned_emp_name TEXT,
        assigned_date TEXT,
        istimara_expiry TEXT,
        fahas_expiry TEXT,
        insurance_company TEXT,
        insurance_policy_no TEXT,
        insurance_expiry TEXT,
        odometer INTEGER DEFAULT 0,
        status TEXT DEFAULT 'نشط',
        tamm_status TEXT DEFAULT 'ساري',
        tamm_authorization_no TEXT,
        tamm_authorization_expiry TEXT,
        fuel_card_no TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure all Tamm columns exist if the table was created earlier with fewer columns
    const columnsToAdd = [
      { name: 'plate_number_en', type: 'TEXT' },
      { name: 'vehicle_type', type: 'TEXT DEFAULT "نقل خاص"' },
      { name: 'tamm_authorization_no', type: 'TEXT' },
      { name: 'tamm_authorization_expiry', type: 'TEXT' },
      { name: 'fuel_card_no', type: 'TEXT' },
      { name: 'notes', type: 'TEXT' },
      { name: 'updated_at', type: 'TEXT DEFAULT CURRENT_TIMESTAMP' }
    ];

    for (const col of columnsToAdd) {
      try {
        run(`ALTER TABLE vehicles ADD COLUMN ${col.name} ${col.type}`);
      } catch (e) {
        // column already exists, ignore safely
      }
    }

    // 2. Vehicle Custody Movement Logs Table
    run(`
      CREATE TABLE IF NOT EXISTS vehicle_custody_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER NOT NULL,
        emp_id INTEGER,
        emp_name TEXT,
        emp_code TEXT,
        action_type TEXT NOT NULL, -- تسليم_عهدة, استرداد_عهدة, نقل_عهدة
        action_date TEXT NOT NULL,
        odometer INTEGER DEFAULT 0,
        fuel_level TEXT DEFAULT 'ممتلئ',
        accessories_check TEXT, -- JSON array of checked accessories
        body_condition_notes TEXT,
        supervisor_name TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
        FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE SET NULL
      )
    `);

    // Indexes
    run(`CREATE INDEX IF NOT EXISTS idx_vehicles_emp ON vehicles(assigned_emp_id)`);
    run(`CREATE INDEX IF NOT EXISTS idx_vehicles_istimara ON vehicles(istimara_expiry)`);
    run(`CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status)`);
    run(`CREATE INDEX IF NOT EXISTS idx_custody_vehicle ON vehicle_custody_logs(vehicle_id)`);
    run(`CREATE INDEX IF NOT EXISTS idx_custody_emp ON vehicle_custody_logs(emp_id)`);

    // Seed official initial company fleet if empty
    this.seedInitialFleet();
  }

  /**
   * Seed company vehicles if table is empty
   */
  seedInitialFleet() {
    const countCheck = get(`SELECT COUNT(*) as cnt FROM vehicles`);
    if (countCheck && countCheck.cnt === 0) {
      const initialVehicles = [
        {
          plate_number_ar: 'أ ب ج 1122',
          plate_number_en: '1122 JBA',
          make: 'تويوتا',
          model: 'هايلكس غمارتين GLX',
          year: 2024,
          color: 'أبيض لؤلؤي',
          vin_serial: 'MROAB22G801982731',
          vehicle_type: 'نقل خاص',
          assigned_emp_id: 1, // فارس عبدالرحمن القحطاني
          assigned_emp_name: 'فارس عبدالرحمن القحطاني',
          assigned_date: '2026-01-15',
          istimara_expiry: '2027-02-14',
          fahas_expiry: '2026-12-10',
          insurance_company: 'التعاونية للتأمين',
          insurance_policy_no: 'TAW-2026-98124',
          insurance_expiry: '2027-01-20',
          odometer: 28450,
          status: 'نشط',
          tamm_status: 'ساري',
          tamm_authorization_no: 'TAMM-AUTH-90112',
          tamm_authorization_expiry: '2027-01-15',
          fuel_card_no: 'PETRO-4491-001',
          notes: 'مخصصة لإدارة ومتابعة المشاريع الميدانية في منطقة عسير.'
        },
        {
          plate_number_ar: 'د هـ و 3344',
          plate_number_en: '3344 EHD',
          make: 'إيسوزو',
          model: 'ديماكس بيك أب 4X4',
          year: 2023,
          color: 'فضي معدني',
          vin_serial: 'MPA1TF87H90218342',
          vehicle_type: 'نقل خاص',
          assigned_emp_id: 2, // خالد صالح الراعي
          assigned_emp_name: 'خالد صالح الراعي',
          assigned_date: '2026-02-01',
          istimara_expiry: '2026-11-28', // قريب الانتهاء (< 30 يوم)
          fahas_expiry: '2026-11-20', // قريب الانتهاء
          insurance_company: 'تكافل الراجحي',
          insurance_policy_no: 'RAJ-8812-44102',
          insurance_expiry: '2027-03-10',
          odometer: 54120,
          status: 'نشط',
          tamm_status: 'ساري',
          tamm_authorization_no: 'TAMM-AUTH-90113',
          tamm_authorization_expiry: '2026-12-31',
          fuel_card_no: 'PETRO-4491-002',
          notes: 'سيارة الإشراف الفني والسلامة والصحة المهنية.'
        },
        {
          plate_number_ar: 'ح ط ي 5566',
          plate_number_en: '5566 YTH',
          make: 'هيونداي',
          model: 'إلنترا سيدان',
          year: 2023,
          color: 'رمادي تيتانيوم',
          vin_serial: 'KMHD84LF7PU102938',
          vehicle_type: 'خصوصي',
          assigned_emp_id: 3, // علي حسين بشرى
          assigned_emp_name: 'علي حسين بشرى',
          assigned_date: '2026-03-10',
          istimara_expiry: '2026-09-15', // منتهي
          fahas_expiry: '2026-10-01', // منتهي
          insurance_company: 'ميدغلف للتأمين',
          insurance_policy_no: 'MED-7719-20491',
          insurance_expiry: '2026-11-15', // قريب الانتهاء
          odometer: 41200,
          status: 'نشط',
          tamm_status: 'بانتظار التجديد',
          tamm_authorization_no: 'TAMM-AUTH-90114',
          tamm_authorization_expiry: '2026-10-30',
          fuel_card_no: 'PETRO-4491-003',
          notes: 'سيارة الحركة والمراجعات الحكومية والإدارية.'
        },
        {
          plate_number_ar: 'ك ل م 7788',
          plate_number_en: '7788 MLK',
          make: 'تويوتا',
          model: 'لاندكروزر برادو TXL',
          year: 2024,
          color: 'أسود ملوكي',
          vin_serial: 'JTEBU5JR805192837',
          vehicle_type: 'خصوصي',
          assigned_emp_id: 4, // عبدالملك سعيد الشريف
          assigned_emp_name: 'عبدالملك سعيد الشريف',
          assigned_date: '2026-01-10',
          istimara_expiry: '2027-05-30',
          fahas_expiry: '2027-01-15',
          insurance_company: 'التعاونية للتأمين',
          insurance_policy_no: 'TAW-2026-99014',
          insurance_expiry: '2027-05-30',
          odometer: 19800,
          status: 'نشط',
          tamm_status: 'ساري',
          tamm_authorization_no: 'TAMM-AUTH-90115',
          tamm_authorization_expiry: '2027-01-10',
          fuel_card_no: 'PETRO-4491-004',
          notes: 'سيارة الإدارة التنفيذية والمشاريع الاستراتيجية.'
        },
        {
          plate_number_ar: 'ص ع ف 9900',
          plate_number_en: '9900 FES',
          make: 'ميتسوبيشي',
          model: 'إل 200 غمارة واحدة',
          year: 2022,
          color: 'أبيض',
          vin_serial: 'MMBJLKB40PD918234',
          vehicle_type: 'نقل خاص',
          assigned_emp_id: null,
          assigned_emp_name: null,
          assigned_date: null,
          istimara_expiry: '2027-04-10',
          fahas_expiry: '2026-12-25',
          insurance_company: 'تكافل الراجحي',
          insurance_policy_no: 'RAJ-8812-55099',
          insurance_expiry: '2027-04-10',
          odometer: 82300,
          status: 'متاح',
          tamm_status: 'ساري',
          tamm_authorization_no: null,
          tamm_authorization_expiry: null,
          fuel_card_no: 'PETRO-4491-005',
          notes: 'مركبة حرة متاحة في ساحة الشركة لنقل المعدات ومساندة المشاريع.'
        }
      ];

      for (const v of initialVehicles) {
        run(`
          INSERT INTO vehicles (
            plate_number_ar, plate_number_en, make, model, year, color,
            vin_serial, vehicle_type, assigned_emp_id, assigned_emp_name,
            assigned_date, istimara_expiry, fahas_expiry, insurance_company,
            insurance_policy_no, insurance_expiry, odometer, status,
            tamm_status, tamm_authorization_no, tamm_authorization_expiry,
            fuel_card_no, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          v.plate_number_ar, v.plate_number_en, v.make, v.model, v.year, v.color,
          v.vin_serial, v.vehicle_type, v.assigned_emp_id, v.assigned_emp_name,
          v.assigned_date, v.istimara_expiry, v.fahas_expiry, v.insurance_company,
          v.insurance_policy_no, v.insurance_expiry, v.odometer, v.status,
          v.tamm_status, v.tamm_authorization_no, v.tamm_authorization_expiry,
          v.fuel_card_no, v.notes
        ]);
      }

      // Also seed an initial custody log for vehicle #1
      const v1 = get(`SELECT id FROM vehicles WHERE plate_number_ar = 'أ ب ج 1122'`);
      if (v1) {
        run(`
          INSERT INTO vehicle_custody_logs (
            vehicle_id, emp_id, emp_name, emp_code, action_type, action_date,
            odometer, fuel_level, accessories_check, body_condition_notes,
            supervisor_name, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          v1.id, 1, 'فارس عبدالرحمن القحطاني', 'JM-0004', 'تسليم_عهدة', '2026-01-15',
          25000, 'ممتلئ', JSON.stringify(['استمارة أصلية', 'مفتاح احتياطي', 'طفاية حريق', 'إطار احتياطي', 'حقيبة إسعافات']),
          'السيارة بحالة الوكالة ممتازة وخالية من أية صدمات أو حكات.',
          'مدير الشؤون الإدارية والأسطول',
          'تم تسليم السيارة كعهدة عمل رسمية للمشرف الميداني.'
        ]);
      }
    }
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
      return { daysLeft, status: 'expired', text_ar: `منتهي منذ ${Math.abs(daysLeft)} يوم` };
    } else if (daysLeft <= 30) {
      return { daysLeft, status: 'expiring_soon', text_ar: `ينتهي خلال ${daysLeft} يوم` };
    } else {
      return { daysLeft, status: 'valid', text_ar: `سارٍ (${daysLeft} يوم متبقٍ)` };
    }
  }

  /**
   * Retrieve vehicles with compliance info and flexible filtering
   */
  getVehicles(filters = {}) {
    let sql = `
      SELECT v.*, e.emp_code as assigned_emp_code, e.job_title_ar as assigned_emp_job,
             d.name_ar as assigned_dept_name
      FROM vehicles v
      LEFT JOIN employees e ON v.assigned_emp_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      sql += ` AND v.status = ?`;
      params.push(filters.status);
    }

    if (filters.tamm_status) {
      sql += ` AND v.tamm_status = ?`;
      params.push(filters.tamm_status);
    }

    if (filters.custody_state === 'assigned') {
      sql += ` AND v.assigned_emp_id IS NOT NULL`;
    } else if (filters.custody_state === 'available') {
      sql += ` AND v.assigned_emp_id IS NULL AND v.status = 'متاح'`;
    }

    if (filters.search) {
      const term = `%${filters.search.trim()}%`;
      sql += ` AND (
        v.plate_number_ar LIKE ? OR
        v.plate_number_en LIKE ? OR
        v.make LIKE ? OR
        v.model LIKE ? OR
        v.vin_serial LIKE ? OR
        v.assigned_emp_name LIKE ?
      )`;
      params.push(term, term, term, term, term, term);
    }

    sql += ` ORDER BY v.id DESC`;

    const rows = query(sql, params);

    return rows.map(v => {
      const istimara = this.computeExpiry(v.istimara_expiry);
      const fahas = this.computeExpiry(v.fahas_expiry);
      const insurance = this.computeExpiry(v.insurance_expiry);
      const tammAuth = this.computeExpiry(v.tamm_authorization_expiry);

      const hasAlert = istimara.status === 'expired' || istimara.status === 'expiring_soon' ||
                       fahas.status === 'expired' || fahas.status === 'expiring_soon' ||
                       insurance.status === 'expired' || insurance.status === 'expiring_soon';

      return {
        ...v,
        istimara,
        fahas,
        insurance,
        tammAuth,
        has_alert: hasAlert,
        compliance_level: hasAlert ? (istimara.status === 'expired' || fahas.status === 'expired' || insurance.status === 'expired' ? 'خطر' : 'تحذير') : 'مطابق'
      };
    });
  }

  /**
   * Get single vehicle details with full custody history
   */
  getVehicleById(id) {
    const v = get(`
      SELECT v.*, e.emp_code as assigned_emp_code, e.job_title_ar as assigned_emp_job,
             e.national_id as assigned_emp_national_id, e.phone as assigned_emp_phone,
             d.name_ar as assigned_dept_name
      FROM vehicles v
      LEFT JOIN employees e ON v.assigned_emp_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE v.id = ?
    `, [id]);

    if (!v) return null;

    const istimara = this.computeExpiry(v.istimara_expiry);
    const fahas = this.computeExpiry(v.fahas_expiry);
    const insurance = this.computeExpiry(v.insurance_expiry);
    const tammAuth = this.computeExpiry(v.tamm_authorization_expiry);

    const custodyLogs = query(`
      SELECT * FROM vehicle_custody_logs
      WHERE vehicle_id = ?
      ORDER BY action_date DESC, id DESC
    `, [id]);

    return {
      ...v,
      istimara,
      fahas,
      insurance,
      tammAuth,
      custody_logs: custodyLogs.map(l => ({
        ...l,
        accessories: l.accessories_check ? JSON.parse(l.accessories_check) : []
      }))
    };
  }

  /**
   * Create new vehicle
   */
  createVehicle(data) {
    if (!data.plate_number_ar || !data.make || !data.model || !data.year) {
      throw new Error('يرجى تعبئة الحقول الإلزامية: رقم اللوحة بالعربي، الماركة، الطراز، وسنة الصنع.');
    }

    // Check duplicate VIN if provided
    if (data.vin_serial) {
      const existingVin = get(`SELECT id FROM vehicles WHERE vin_serial = ?`, [data.vin_serial.trim()]);
      if (existingVin) throw new Error(`رقم الهيكل (VIN) ${data.vin_serial} مسجل مسبقاً في النظام.`);
    }

    // Check duplicate Plate AR
    const existingPlate = get(`SELECT id FROM vehicles WHERE plate_number_ar = ?`, [data.plate_number_ar.trim()]);
    if (existingPlate) throw new Error(`رقم اللوحة ${data.plate_number_ar} مسجل مسبقاً.`);

    let assignedEmpName = null;
    if (data.assigned_emp_id) {
      const emp = get(`SELECT full_name_ar FROM employees WHERE id = ?`, [data.assigned_emp_id]);
      if (emp) assignedEmpName = emp.full_name_ar;
    }

    const res = run(`
      INSERT INTO vehicles (
        plate_number_ar, plate_number_en, make, model, year, color,
        vin_serial, vehicle_type, assigned_emp_id, assigned_emp_name,
        assigned_date, istimara_expiry, fahas_expiry, insurance_company,
        insurance_policy_no, insurance_expiry, odometer, status,
        tamm_status, tamm_authorization_no, tamm_authorization_expiry,
        fuel_card_no, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.plate_number_ar.trim(),
      data.plate_number_en ? data.plate_number_en.trim() : null,
      data.make.trim(),
      data.model.trim(),
      parseInt(data.year, 10),
      data.color ? data.color.trim() : null,
      data.vin_serial ? data.vin_serial.trim() : null,
      data.vehicle_type || 'نقل خاص',
      data.assigned_emp_id ? parseInt(data.assigned_emp_id, 10) : null,
      assignedEmpName,
      data.assigned_date || (data.assigned_emp_id ? new Date().toISOString().split('T')[0] : null),
      data.istimara_expiry || null,
      data.fahas_expiry || null,
      data.insurance_company || null,
      data.insurance_policy_no || null,
      data.insurance_expiry || null,
      data.odometer ? parseInt(data.odometer, 10) : 0,
      data.status || (data.assigned_emp_id ? 'نشط' : 'متاح'),
      data.tamm_status || 'ساري',
      data.tamm_authorization_no || null,
      data.tamm_authorization_expiry || null,
      data.fuel_card_no || null,
      data.notes || null
    ]);

    // If assigned at creation, create an initial custody log
    if (data.assigned_emp_id && res.lastInsertRowid) {
      const empInfo = get(`SELECT emp_code, full_name_ar FROM employees WHERE id = ?`, [data.assigned_emp_id]);
      run(`
        INSERT INTO vehicle_custody_logs (
          vehicle_id, emp_id, emp_name, emp_code, action_type, action_date,
          odometer, fuel_level, accessories_check, body_condition_notes,
          supervisor_name, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        res.lastInsertRowid,
        data.assigned_emp_id,
        empInfo ? empInfo.full_name_ar : assignedEmpName,
        empInfo ? empInfo.emp_code : '',
        'تسليم_عهدة',
        data.assigned_date || new Date().toISOString().split('T')[0],
        data.odometer || 0,
        'ممتلئ',
        JSON.stringify(['استمارة أصلية', 'مفتاح احتياطي']),
        'تسليم أولي للمركبة عند الإضافة للنظام',
        'مسؤول الأسطول',
        'تسليم عهدة عند الإنشاء'
      ]);
    }

    return this.getVehicleById(res.lastInsertRowid);
  }

  /**
   * Update existing vehicle
   */
  updateVehicle(id, data) {
    const existing = get(`SELECT * FROM vehicles WHERE id = ?`, [id]);
    if (!existing) throw new Error('المركبة غير موجودة.');

    // Check duplicate VIN if changed
    if (data.vin_serial && data.vin_serial !== existing.vin_serial) {
      const checkVin = get(`SELECT id FROM vehicles WHERE vin_serial = ? AND id != ?`, [data.vin_serial.trim(), id]);
      if (checkVin) throw new Error(`رقم الهيكل ${data.vin_serial} مستخدم لمركبة أخرى.`);
    }

    // Check duplicate plate if changed
    if (data.plate_number_ar && data.plate_number_ar !== existing.plate_number_ar) {
      const checkPlate = get(`SELECT id FROM vehicles WHERE plate_number_ar = ? AND id != ?`, [data.plate_number_ar.trim(), id]);
      if (checkPlate) throw new Error(`رقم اللوحة ${data.plate_number_ar} مستخدم لمركبة أخرى.`);
    }

    let assignedEmpName = existing.assigned_emp_name;
    if (data.assigned_emp_id !== undefined) {
      if (data.assigned_emp_id) {
        const emp = get(`SELECT full_name_ar FROM employees WHERE id = ?`, [data.assigned_emp_id]);
        assignedEmpName = emp ? emp.full_name_ar : null;
      } else {
        assignedEmpName = null;
      }
    }

    run(`
      UPDATE vehicles SET
        plate_number_ar = COALESCE(?, plate_number_ar),
        plate_number_en = COALESCE(?, plate_number_en),
        make = COALESCE(?, make),
        model = COALESCE(?, model),
        year = COALESCE(?, year),
        color = COALESCE(?, color),
        vin_serial = COALESCE(?, vin_serial),
        vehicle_type = COALESCE(?, vehicle_type),
        assigned_emp_id = ?,
        assigned_emp_name = ?,
        assigned_date = COALESCE(?, assigned_date),
        istimara_expiry = COALESCE(?, istimara_expiry),
        fahas_expiry = COALESCE(?, fahas_expiry),
        insurance_company = COALESCE(?, insurance_company),
        insurance_policy_no = COALESCE(?, insurance_policy_no),
        insurance_expiry = COALESCE(?, insurance_expiry),
        odometer = COALESCE(?, odometer),
        status = COALESCE(?, status),
        tamm_status = COALESCE(?, tamm_status),
        tamm_authorization_no = COALESCE(?, tamm_authorization_no),
        tamm_authorization_expiry = COALESCE(?, tamm_authorization_expiry),
        fuel_card_no = COALESCE(?, fuel_card_no),
        notes = COALESCE(?, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      data.plate_number_ar ? data.plate_number_ar.trim() : null,
      data.plate_number_en ? data.plate_number_en.trim() : null,
      data.make ? data.make.trim() : null,
      data.model ? data.model.trim() : null,
      data.year ? parseInt(data.year, 10) : null,
      data.color !== undefined ? data.color : null,
      data.vin_serial !== undefined ? data.vin_serial : null,
      data.vehicle_type !== undefined ? data.vehicle_type : null,
      data.assigned_emp_id !== undefined ? (data.assigned_emp_id ? parseInt(data.assigned_emp_id, 10) : null) : existing.assigned_emp_id,
      assignedEmpName,
      data.assigned_date !== undefined ? data.assigned_date : null,
      data.istimara_expiry !== undefined ? data.istimara_expiry : null,
      data.fahas_expiry !== undefined ? data.fahas_expiry : null,
      data.insurance_company !== undefined ? data.insurance_company : null,
      data.insurance_policy_no !== undefined ? data.insurance_policy_no : null,
      data.insurance_expiry !== undefined ? data.insurance_expiry : null,
      data.odometer !== undefined ? parseInt(data.odometer, 10) : null,
      data.status !== undefined ? data.status : null,
      data.tamm_status !== undefined ? data.tamm_status : null,
      data.tamm_authorization_no !== undefined ? data.tamm_authorization_no : null,
      data.tamm_authorization_expiry !== undefined ? data.tamm_authorization_expiry : null,
      data.fuel_card_no !== undefined ? data.fuel_card_no : null,
      data.notes !== undefined ? data.notes : null,
      id
    ]);

    return this.getVehicleById(id);
  }

  /**
   * Delete vehicle safely
   */
  deleteVehicle(id) {
    const existing = get(`SELECT * FROM vehicles WHERE id = ?`, [id]);
    if (!existing) throw new Error('المركبة غير موجودة.');
    if (existing.assigned_emp_id) {
      throw new Error(`لا يمكن حذف المركبة (${existing.plate_number_ar}) لأنها مسلمة كعهدة للموظف (${existing.assigned_emp_name}). يرجى استرداد العهدة أولاً.`);
    }

    run(`DELETE FROM vehicle_custody_logs WHERE vehicle_id = ?`, [id]);
    run(`DELETE FROM vehicles WHERE id = ?`, [id]);
    return { success: true, message: `تم حذف المركبة ${existing.plate_number_ar} بنجاح.` };
  }

  /**
   * Handover vehicle custody to an employee (تسليم عهدة)
   */
  assignVehicle(vehicleId, empId, handoverData = {}) {
    const vehicle = get(`SELECT * FROM vehicles WHERE id = ?`, [vehicleId]);
    if (!vehicle) throw new Error('المركبة غير موجودة.');

    const emp = get(`SELECT id, emp_code, full_name_ar FROM employees WHERE id = ?`, [empId]);
    if (!emp) throw new Error('الموظف غير موجود.');

    const actionDate = handoverData.action_date || new Date().toISOString().split('T')[0];
    const odometer = handoverData.odometer !== undefined ? parseInt(handoverData.odometer, 10) : vehicle.odometer;
    const fuelLevel = handoverData.fuel_level || 'ممتلئ';
    const accessoriesCheck = Array.isArray(handoverData.accessories) ? JSON.stringify(handoverData.accessories) : JSON.stringify(['استمارة أصلية', 'مفتاح احتياطي', 'طفاية حريق']);
    const bodyCondition = handoverData.body_condition_notes || 'حالة جيدة تم الفحص والمعاينة';
    const supervisor = handoverData.supervisor_name || 'مسؤول الحركة والأسطول';
    const notes = handoverData.notes || 'تسليم عهدة رسمية';

    // Update vehicle
    run(`
      UPDATE vehicles SET
        assigned_emp_id = ?,
        assigned_emp_name = ?,
        assigned_date = ?,
        odometer = ?,
        status = 'نشط',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [emp.id, emp.full_name_ar, actionDate, odometer, vehicleId]);

    // Insert Custody Log
    const logRes = run(`
      INSERT INTO vehicle_custody_logs (
        vehicle_id, emp_id, emp_name, emp_code, action_type, action_date,
        odometer, fuel_level, accessories_check, body_condition_notes,
        supervisor_name, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      vehicleId, emp.id, emp.full_name_ar, emp.emp_code, 'تسليم_عهدة', actionDate,
      odometer, fuelLevel, accessoriesCheck, bodyCondition, supervisor, notes
    ]);

    return {
      vehicle: this.getVehicleById(vehicleId),
      log_id: logRes.lastInsertRowid
    };
  }

  /**
   * Return vehicle custody (استرداد عهدة وإخلاء طرف)
   */
  returnVehicle(vehicleId, returnData = {}) {
    const vehicle = get(`SELECT * FROM vehicles WHERE id = ?`, [vehicleId]);
    if (!vehicle) throw new Error('المركبة غير موجودة.');
    if (!vehicle.assigned_emp_id) throw new Error('المركبة غير مسلمة لأي موظف حالياً.');

    const empId = vehicle.assigned_emp_id;
    const empName = vehicle.assigned_emp_name;
    const emp = get(`SELECT emp_code FROM employees WHERE id = ?`, [empId]);
    const empCode = emp ? emp.emp_code : '';

    const actionDate = returnData.action_date || new Date().toISOString().split('T')[0];
    const odometer = returnData.odometer !== undefined ? parseInt(returnData.odometer, 10) : vehicle.odometer;
    const fuelLevel = returnData.fuel_level || 'نصف';
    const accessoriesCheck = Array.isArray(returnData.accessories) ? JSON.stringify(returnData.accessories) : JSON.stringify(['استمارة أصلية', 'مفتاح']);
    const bodyCondition = returnData.body_condition_notes || 'تم الاستلام وإجراء الفحص الميداني';
    const supervisor = returnData.supervisor_name || 'مسؤول الحركة والأسطول';
    const notes = returnData.notes || 'إخلاء طرف واسترداد عهدة المركبة بنجاح';
    const newStatus = returnData.new_status || 'متاح';

    // Update vehicle
    run(`
      UPDATE vehicles SET
        assigned_emp_id = NULL,
        assigned_emp_name = NULL,
        assigned_date = NULL,
        odometer = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [odometer, newStatus, vehicleId]);

    // Insert Custody Log
    const logRes = run(`
      INSERT INTO vehicle_custody_logs (
        vehicle_id, emp_id, emp_name, emp_code, action_type, action_date,
        odometer, fuel_level, accessories_check, body_condition_notes,
        supervisor_name, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      vehicleId, empId, empName, empCode, 'استرداد_عهدة', actionDate,
      odometer, fuelLevel, accessoriesCheck, bodyCondition, supervisor, notes
    ]);

    return {
      vehicle: this.getVehicleById(vehicleId),
      log_id: logRes.lastInsertRowid
    };
  }

  /**
   * Get Fleet KPIs and Tamm Alarms
   */
  getFleetKpis() {
    const vehicles = this.getVehicles();

    const totalVehicles = vehicles.length;
    const assignedVehicles = vehicles.filter(v => v.assigned_emp_id !== null).length;
    const availableVehicles = vehicles.filter(v => v.assigned_emp_id === null && v.status === 'متاح').length;
    const maintenanceVehicles = vehicles.filter(v => v.status === 'صيانة').length;

    let expiredIstimara = 0;
    let expiringIstimara = 0;
    let expiredFahas = 0;
    let expiringFahas = 0;
    let expiredInsurance = 0;
    let expiringInsurance = 0;

    for (const v of vehicles) {
      if (v.istimara.status === 'expired') expiredIstimara++;
      if (v.istimara.status === 'expiring_soon') expiringIstimara++;
      if (v.fahas.status === 'expired') expiredFahas++;
      if (v.fahas.status === 'expiring_soon') expiringFahas++;
      if (v.insurance.status === 'expired') expiredInsurance++;
      if (v.insurance.status === 'expiring_soon') expiringInsurance++;
    }

    const totalAlerts = expiredIstimara + expiringIstimara + expiredFahas + expiringFahas + expiredInsurance + expiringInsurance;
    const tammCompliantVehicles = vehicles.filter(v => !v.has_alert && v.tamm_status === 'ساري').length;
    const complianceRate = totalVehicles > 0 ? Math.round((tammCompliantVehicles / totalVehicles) * 100) : 100;

    return {
      total_vehicles: totalVehicles,
      assigned_vehicles: assignedVehicles,
      available_vehicles: availableVehicles,
      maintenance_vehicles: maintenanceVehicles,
      compliance_rate: complianceRate,
      total_alerts: totalAlerts,
      istimara_alerts: {
        expired: expiredIstimara,
        expiring_soon: expiringIstimara
      },
      fahas_alerts: {
        expired: expiredFahas,
        expiring_soon: expiringFahas
      },
      insurance_alerts: {
        expired: expiredInsurance,
        expiring_soon: expiringInsurance
      }
    };
  }

  /**
   * Export Fleet to CSV with UTF-8 BOM
   */
  exportVehiclesCsv() {
    const vehicles = this.getVehicles();
    const headers = [
      'م',
      'رقم اللوحة (عربي)',
      'رقم اللوحة (إنجليزي)',
      'الشركة الصانعة',
      'الموديل والطراز',
      'سنة الصنع',
      'اللون',
      'رقم الهيكل (VIN)',
      'نوع المركبة',
      'الموظف المستلم (العهدة)',
      'الرقم الوظيفي',
      'تاريخ التسليم',
      'قراءة العداد (كم)',
      'حالة المركبة',
      'حالة منصة تم',
      'تاريخ انتهاء الاستمارة',
      'حالة الاستمارة',
      'تاريخ انتهاء الفحص الدوري',
      'حالة الفحص الدوري',
      'شركة التأمين',
      'رقم وثيقة التأمين',
      'تاريخ انتهاء التأمين',
      'حالة التأمين',
      'رقم بطاقة الوقود'
    ];

    const rows = vehicles.map((v, idx) => [
      idx + 1,
      v.plate_number_ar || '',
      v.plate_number_en || '',
      v.make || '',
      v.model || '',
      v.year || '',
      v.color || '',
      v.vin_serial || '',
      v.vehicle_type || '',
      v.assigned_emp_name || 'غير مسلمة (متاحة)',
      v.assigned_emp_code || '',
      v.assigned_date || '',
      v.odometer || 0,
      v.status || '',
      v.tamm_status || '',
      v.istimara_expiry || '',
      v.istimara.text_ar,
      v.fahas_expiry || '',
      v.fahas.text_ar,
      v.insurance_company || '',
      v.insurance_policy_no || '',
      v.insurance_expiry || '',
      v.insurance.text_ar,
      v.fuel_card_no || ''
    ]);

    const escapeCsv = (val) => {
      const s = String(val ?? '').replace(/"/g, '""');
      return `"${s}"`;
    };

    const csvContent = [
      headers.map(escapeCsv).join(','),
      ...rows.map(r => r.map(escapeCsv).join(','))
    ].join('\r\n');

    return '\uFEFF' + csvContent;
  }

  /**
   * Export Fleet to Excel Workbook (.xlsx)
   */
  exportVehiclesExcel() {
    const vehicles = this.getVehicles();
    const data = vehicles.map((v, idx) => ({
      'م': idx + 1,
      'رقم اللوحة (عربي)': v.plate_number_ar || '',
      'رقم اللوحة (EN)': v.plate_number_en || '',
      'الماركة': v.make || '',
      'الموديل': v.model || '',
      'سنة الصنع': v.year || '',
      'اللون': v.color || '',
      'رقم الهيكل (VIN)': v.vin_serial || '',
      'نوع المركبة': v.vehicle_type || '',
      'الموظف المستلم': v.assigned_emp_name || 'متاحة',
      'الرقم الوظيفي': v.assigned_emp_code || '',
      'تاريخ التسليم': v.assigned_date || '',
      'قراءة العداد (كم)': v.odometer || 0,
      'حالة المركبة': v.status || '',
      'حالة منصة تم': v.tamm_status || '',
      'انتهاء الاستمارة': v.istimara_expiry || '',
      'حالة الاستمارة': v.istimara.text_ar,
      'انتهاء الفحص الدوري': v.fahas_expiry || '',
      'حالة الفحص': v.fahas.text_ar,
      'شركة التأمين': v.insurance_company || '',
      'رقم الوثيقة': v.insurance_policy_no || '',
      'انتهاء التأمين': v.insurance_expiry || '',
      'حالة التأمين': v.insurance.text_ar,
      'بطاقة الوقود': v.fuel_card_no || ''
    }));

    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'أسطول السيارات ومنصة تم');
    return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  /**
   * Return blank CSV import template
   */
  getImportTemplateCsv() {
    const headers = [
      'رقم اللوحة عربي',
      'رقم اللوحة إنجليزي',
      'الماركة',
      'الموديل',
      'سنة الصنع',
      'اللون',
      'رقم الهيكل VIN',
      'نوع المركبة',
      'قراءة العداد',
      'تاريخ انتهاء الاستمارة',
      'تاريخ انتهاء الفحص الدوري',
      'شركة التأمين',
      'رقم وثيقة التأمين',
      'تاريخ انتهاء التأمين',
      'رقم بطاقة الوقود',
      'ملاحظات'
    ];

    const sampleRow = [
      'ق ر س 4455',
      '4455 SRQ',
      'تويوتا',
      'هايلكس غمارتين',
      '2024',
      'أبيض',
      'MROAB99X001928374',
      'نقل خاص',
      '15000',
      '2027-05-20',
      '2026-12-15',
      'التعاونية للتأمين',
      'TAW-7712-9901',
      '2027-05-20',
      'PETRO-4491-099',
      'سيارة مساندة للمشاريع'
    ];

    const escapeCsv = (val) => `"${String(val).replace(/"/g, '""')}"`;
    return '\uFEFF' + [
      headers.map(escapeCsv).join(','),
      sampleRow.map(escapeCsv).join(',')
    ].join('\r\n');
  }

  /**
   * Import vehicles from parsed JSON array (from Excel or CSV)
   */
  importVehicles(rows) {
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('الملف فارغ أو لا يحتوي على صفوف صالحة.');
    }

    let inserted = 0;
    let updated = 0;
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // accounts for header

      const plateAr = (row['رقم اللوحة عربي'] || row['رقم اللوحة (عربي)'] || row['plate_number_ar'] || '').toString().trim();
      const plateEn = (row['رقم اللوحة إنجليزي'] || row['رقم اللوحة (إنجليزي)'] || row['plate_number_en'] || '').toString().trim();
      const make = (row['الماركة'] || row['الشركة الصانعة'] || row['make'] || '').toString().trim();
      const model = (row['الموديل'] || row['الموديل والطراز'] || row['model'] || '').toString().trim();
      const year = parseInt(row['سنة الصنع'] || row['year'] || '2024', 10);
      const color = (row['اللون'] || row['color'] || '').toString().trim();
      const vin = (row['رقم الهيكل VIN'] || row['رقم الهيكل (VIN)'] || row['vin_serial'] || '').toString().trim();
      const vehicleType = (row['نوع المركبة'] || row['vehicle_type'] || 'نقل خاص').toString().trim();
      const odometer = parseInt(row['قراءة العداد'] || row['قراءة العداد (كم)'] || row['odometer'] || '0', 10);
      const istimara = (row['تاريخ انتهاء الاستمارة'] || row['انتهاء الاستمارة'] || row['istimara_expiry'] || '').toString().trim();
      const fahas = (row['تاريخ انتهاء الفحص الدوري'] || row['انتهاء الفحص الدوري'] || row['fahas_expiry'] || '').toString().trim();
      const insCompany = (row['شركة التأمين'] || row['insurance_company'] || '').toString().trim();
      const insPolicy = (row['رقم وثيقة التأمين'] || row['رقم الوثيقة'] || row['insurance_policy_no'] || '').toString().trim();
      const insExpiry = (row['تاريخ انتهاء التأمين'] || row['انتهاء التأمين'] || row['insurance_expiry'] || '').toString().trim();
      const fuelCard = (row['رقم بطاقة الوقود'] || row['بطاقة الوقود'] || row['fuel_card_no'] || '').toString().trim();
      const notes = (row['ملاحظات'] || row['notes'] || '').toString().trim();

      if (!plateAr || !make || !model) {
        errors.push(`السطر ${rowNum}: تم التجاهل لعدم توفر رقم اللوحة أو الماركة أو الطراز.`);
        continue;
      }

      try {
        // Check if vehicle exists by VIN or Plate
        let existing = null;
        if (vin) {
          existing = get(`SELECT id FROM vehicles WHERE vin_serial = ?`, [vin]);
        }
        if (!existing) {
          existing = get(`SELECT id FROM vehicles WHERE plate_number_ar = ?`, [plateAr]);
        }

        if (existing) {
          // Update
          run(`
            UPDATE vehicles SET
              plate_number_ar = ?,
              plate_number_en = COALESCE(NULLIF(?, ''), plate_number_en),
              make = ?,
              model = ?,
              year = ?,
              color = COALESCE(NULLIF(?, ''), color),
              vin_serial = COALESCE(NULLIF(?, ''), vin_serial),
              vehicle_type = COALESCE(NULLIF(?, ''), vehicle_type),
              odometer = CASE WHEN ? > 0 THEN ? ELSE odometer END,
              istimara_expiry = COALESCE(NULLIF(?, ''), istimara_expiry),
              fahas_expiry = COALESCE(NULLIF(?, ''), fahas_expiry),
              insurance_company = COALESCE(NULLIF(?, ''), insurance_company),
              insurance_policy_no = COALESCE(NULLIF(?, ''), insurance_policy_no),
              insurance_expiry = COALESCE(NULLIF(?, ''), insurance_expiry),
              fuel_card_no = COALESCE(NULLIF(?, ''), fuel_card_no),
              notes = COALESCE(NULLIF(?, ''), notes),
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `, [
            plateAr, plateEn, make, model, year, color, vin, vehicleType,
            odometer, odometer, istimara, fahas, insCompany, insPolicy, insExpiry,
            fuelCard, notes, existing.id
          ]);
          updated++;
        } else {
          // Insert
          run(`
            INSERT INTO vehicles (
              plate_number_ar, plate_number_en, make, model, year, color,
              vin_serial, vehicle_type, odometer, istimara_expiry, fahas_expiry,
              insurance_company, insurance_policy_no, insurance_expiry, fuel_card_no,
              notes, status, tamm_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'متاح', 'ساري')
          `, [
            plateAr, plateEn || null, make, model, year, color || null,
            vin || null, vehicleType, odometer || 0, istimara || null, fahas || null,
            insCompany || null, insPolicy || null, insExpiry || null, fuelCard || null,
            notes || null
          ]);
          inserted++;
        }
      } catch (err) {
        errors.push(`السطر ${rowNum} (${plateAr}): ${err.message}`);
      }
    }

    return {
      total_rows: rows.length,
      inserted,
      updated,
      errors
    };
  }

  /**
   * Generate Official A4 Printable Vehicle Custody Handover Certificate
   * محضر تسليم / استلام عهدة سيارة رسمية
   */
  generateHandoverPrintHtml(vehicleId, logId = null) {
    const v = this.getVehicleById(vehicleId);
    if (!v) throw new Error('المركبة غير موجودة.');

    let log = null;
    if (logId) {
      log = get(`SELECT * FROM vehicle_custody_logs WHERE id = ? AND vehicle_id = ?`, [logId, vehicleId]);
    } else if (v.custody_logs && v.custody_logs.length > 0) {
      log = v.custody_logs[0];
    }

    const actionType = log ? log.action_type : (v.assigned_emp_id ? 'تسليم_عهدة' : 'استرداد_عهدة');
    const isDelivery = actionType === 'تسليم_عهدة';
    const docTitleAr = isDelivery ? 'محضر تسليم عهدة مركبة رسمية' : 'محضر استرداد وإخلاء طرف عهدة مركبة';
    const docTitleEn = isDelivery ? 'Official Vehicle Custody Handover Certificate' : 'Vehicle Custody Return & Clearance Certificate';
    const certificateNo = `JM-VEH-${new Date().getFullYear()}-${String(vehicleId).padStart(4, '0')}`;
    const todayStr = log ? log.action_date : new Date().toISOString().split('T')[0];

    const accessories = log && log.accessories ? log.accessories : [
      'الاستمارة الأصلية (رخصة السير)',
      'مفتاح المركبة الأصلي والاحتياطي',
      'طفاية الحريق الصالحة للاستخدام',
      'عجلة القيادة الاحتياطية (السبير)',
      'عِدة تغيير الإطارات والرافعة (العفريتة)',
      'حقيبة الإسعافات الأولية ومثلث السلامة',
      'بطاقة وقود المركبة المعتمدة'
    ];

    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>${docTitleAr} - ${v.plate_number_ar}</title>
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
      @page { size: A4; margin: 10mm; }
    }
  </style>
</head>
<body class="max-w-4xl mx-auto space-y-4">

  <!-- Print Action Toolbar -->
  <div class="no-print flex items-center justify-between bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-lg mb-4">
    <div class="flex items-center gap-3">
      <i class="fa-solid fa-car-side text-amber-400 text-xl"></i>
      <div>
        <p class="font-black text-sm">منظومة أسطول شركة جوهرة المجد — منصة تم</p>
        <p class="text-xs text-slate-300">جاهز للطباعة أو التصدير بتنسيق A4 المعتمد</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button onclick="window.print()" class="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 transition shadow">
        <i class="fa-solid fa-print"></i>
        <span>طباعة المحضر (Print A4)</span>
      </button>
      <button onclick="window.close()" class="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs">
        إغلاق
      </button>
    </div>
  </div>

  <!-- A4 Certificate Container -->
  <div class="border-2 brand-border rounded-2xl p-6 bg-white relative overflow-hidden shadow-sm space-y-4">
    
    <!-- Watermark / Background Crest -->
    <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
      <i class="fa-solid fa-car text-[400px] text-slate-900"></i>
    </div>

    <!-- Official Header -->
    <div class="flex items-center justify-between border-b-2 brand-border pb-4">
      <div class="text-right space-y-1">
        <h2 class="font-black text-lg text-slate-900">${branding.companyNameAr}</h2>
        <p class="text-xs font-semibold text-slate-600">سجل تجاري: ${branding.commercialRegister} | ترخيص منصة تم معتمد</p>
        <p class="text-[11px] text-slate-500">إدارة الخدمات المساندة — شعبة الحركة والنقل والأسطول</p>
      </div>
      <div class="text-center px-4 py-2 border brand-border rounded-xl bg-white shadow-sm">
        <img src="${branding.logoBase64}" alt="شعار شركة جوهرة المجد" class="h-12 max-w-[140px] object-contain mx-auto" />
        <span class="text-[9px] font-black tracking-widest text-[#700c14] block mt-1">JAWHARAT AL-MAJD</span>
      </div>
      <div class="text-left space-y-1 text-xs">
        <div class="font-bold text-slate-700">رقم المحضر: <span class="font-mono text-slate-900">${certificateNo}</span></div>
        <div class="font-bold text-slate-700">تاريخ المحضر: <span class="font-mono text-slate-900">${todayStr}</span></div>
        <div class="font-bold text-slate-700">منظومة تم: <span class="text-emerald-700 font-bold">${v.tamm_status || 'ساري'}</span></div>
      </div>
    </div>

    <!-- Document Title Banner -->
    <div class="text-center py-2.5 bg-gradient-to-r from-slate-900 via-[#700c14] to-slate-900 text-white rounded-xl shadow-sm">
      <h1 class="text-base font-black tracking-wide">${docTitleAr}</h1>
      <p class="text-[11px] text-amber-300 font-medium tracking-wider">${docTitleEn}</p>
    </div>

    <!-- 1. Vehicle & Tamm Specifications -->
    <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
      <div class="bg-slate-100 px-3 py-2 font-black text-slate-800 flex items-center justify-between">
        <span>أولاً: بيانات ومواصفات المركبة (منصة تم) / Vehicle & Tamm Data</span>
        <span class="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-mono">${v.vehicle_type}</span>
      </div>
      <div class="grid grid-cols-4 p-3 gap-3 bg-white">
        <div>
          <span class="text-slate-500 block text-[11px]">رقم اللوحة (عربي / EN):</span>
          <span class="font-black text-slate-900 text-sm font-mono">${v.plate_number_ar} <span class="text-slate-400">|</span> ${v.plate_number_en || '---'}</span>
        </div>
        <div>
          <span class="text-slate-500 block text-[11px]">الشركة الصانعة والطراز:</span>
          <span class="font-bold text-slate-900">${v.make} ${v.model}</span>
        </div>
        <div>
          <span class="text-slate-500 block text-[11px]">سنة الصنع واللون:</span>
          <span class="font-bold text-slate-900">${v.year} - ${v.color || 'أبيض'}</span>
        </div>
        <div>
          <span class="text-slate-500 block text-[11px]">رقم الهيكل (VIN):</span>
          <span class="font-bold font-mono text-slate-900 text-[11px]">${v.vin_serial || '---'}</span>
        </div>

        <div>
          <span class="text-slate-500 block text-[11px]">انتهاء رخصة السير (الاستمارة):</span>
          <span class="font-bold text-slate-900 font-mono">${v.istimara_expiry || '---'}</span>
          <span class="text-[10px] block ${v.istimara.status === 'expired' ? 'text-rose-600 font-bold' : 'text-slate-500'}">${v.istimara.text_ar}</span>
        </div>
        <div>
          <span class="text-slate-500 block text-[11px]">الفحص الفني الدوري:</span>
          <span class="font-bold text-slate-900 font-mono">${v.fahas_expiry || '---'}</span>
          <span class="text-[10px] block ${v.fahas.status === 'expired' ? 'text-rose-600 font-bold' : 'text-slate-500'}">${v.fahas.text_ar}</span>
        </div>
        <div>
          <span class="text-slate-500 block text-[11px]">التأمين والشركة:</span>
          <span class="font-bold text-slate-900">${v.insurance_company || '---'}</span>
          <span class="text-[10px] text-slate-500 block">وثيقة: ${v.insurance_policy_no || '---'}</span>
        </div>
        <div>
          <span class="text-slate-500 block text-[11px]">بطاقة الوقود وتفويض تم:</span>
          <span class="font-bold text-slate-900 font-mono">${v.fuel_card_no || '---'}</span>
          <span class="text-[10px] text-slate-500 block">تفويض: ${v.tamm_authorization_no || 'معتمد آلياً'}</span>
        </div>
      </div>
    </div>

    <!-- 2. Custodian Employee Details -->
    <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
      <div class="bg-slate-100 px-3 py-2 font-black text-slate-800">
        ثانياً: بيانات الموظف المستلم للعهدة / Custodian Employee Information
      </div>
      <div class="grid grid-cols-4 p-3 gap-3 bg-white">
        <div>
          <span class="text-slate-500 block text-[11px]">اسم الموظف:</span>
          <span class="font-bold text-slate-900 text-sm">${v.assigned_emp_name || (log ? log.emp_name : '---')}</span>
        </div>
        <div>
          <span class="text-slate-500 block text-[11px]">الرقم الوظيفي:</span>
          <span class="font-bold font-mono text-slate-900">${v.assigned_emp_code || (log ? log.emp_code : '---')}</span>
        </div>
        <div>
          <span class="text-slate-500 block text-[11px]">المسمى الوظيفي والإدارة:</span>
          <span class="font-bold text-slate-900">${v.assigned_emp_job || 'موظف تشغيلي'} - ${v.assigned_dept_name || 'إدارة المشاريع'}</span>
        </div>
        <div>
          <span class="text-slate-500 block text-[11px]">رقم الهوية / الإقامة:</span>
          <span class="font-bold font-mono text-slate-900">${v.assigned_emp_national_id || '---'}</span>
        </div>
      </div>
    </div>

    <!-- 3. Technical Inspection & Custody Checklist -->
    <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
      <div class="bg-slate-100 px-3 py-2 font-black text-slate-800 flex items-center justify-between">
        <span>ثالثاً: المعاينة الفنية وقراءة العداد وملحقات المركبة / Vehicle Condition & Checklist</span>
        <span class="text-amber-800 font-bold font-mono">قراءة العداد: ${Number(log ? log.odometer : v.odometer).toLocaleString('en-US')} كم</span>
      </div>
      <div class="p-3 bg-white space-y-3">
        <div class="grid grid-cols-3 gap-3">
          <div class="p-2 border rounded-lg bg-slate-50">
            <span class="text-slate-500 block text-[11px]">مستوى الوقود عند التسليم:</span>
            <span class="font-bold text-slate-900">${log ? log.fuel_level : 'ممتلئ'}</span>
          </div>
          <div class="p-2 border rounded-lg bg-slate-50">
            <span class="text-slate-500 block text-[11px]">فحص البودي والملاحظات:</span>
            <span class="font-bold text-slate-900">${log ? log.body_condition_notes : 'سليمة وخالية من الصدمات الظاهرة'}</span>
          </div>
          <div class="p-2 border rounded-lg bg-slate-50">
            <span class="text-slate-500 block text-[11px]">المشرف الفني المسلّم:</span>
            <span class="font-bold text-slate-900">${log ? log.supervisor_name : 'مسؤول الحركة والأسطول'}</span>
          </div>
        </div>

        <div>
          <span class="font-bold text-slate-700 block mb-1.5">الملحقات والوثائق المسلمة للموظف:</span>
          <div class="grid grid-cols-3 gap-2">
            ${accessories.map(item => `
              <div class="flex items-center gap-2 text-slate-800 text-[11px]">
                <i class="fa-solid fa-square-check text-emerald-600"></i>
                <span>${item}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Legal Undertaking & Saudi Labor Law Compliance -->
    <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
      <div class="font-black text-slate-900 flex items-center gap-2">
        <i class="fa-solid fa-scale-balanced text-[#700c14]"></i>
        <span>الإقرار والتعهد النظامي (وفقاً لأحكام المادة 80 من نظام العمل السعودي ولائحة تنظيم العمل بالشركة):</span>
      </div>
      <p class="text-[11px] text-slate-700 leading-relaxed text-justify">
        أقر أنا الموظف المستلم للعهدة الموضحة أعلاه، بأنني قد عاينت المركبة معاينة نافية للجهالة واستلمتها بكافة ملحقاتها بحالة تشغيلية سليمة وصالحة للسير. وأتعهد بالمحافظة التامة عليها واستخدامها حصراً لأداء مهام العمل الموكلة إليّ، والالتزام بأنظمة المرور بالمملكة وتفويض منصة تم. كما أتعهد بتحمل كافة المخالفات المرورية الناتجة عن قيادتي، وإعادة المركبة فور طلب الإدارة أو عند انتهاء/إنهاء العلاقة العمالية، وفي حال الإخلال بذلك أتحمل المسؤولية القانونية والمالية الكاملة وفقاً لأحكام المادة 80 من نظام العمل السعودي.
      </p>
    </div>

    <!-- 5. Signatures and Endorsements -->
    <div class="grid grid-cols-3 gap-4 pt-3 text-xs border-t border-slate-200">
      <div class="space-y-6">
        <p class="font-bold text-slate-800">الموظف المستلم للعهدة:</p>
        <div class="space-y-1">
          <p class="font-bold text-slate-900">${v.assigned_emp_name || (log ? log.emp_name : '---')}</p>
          <p class="text-[10px] text-slate-400">التوقيع: .......................................</p>
          <p class="text-[10px] text-slate-400">التاريخ: ${todayStr}</p>
        </div>
      </div>

      <div class="space-y-6 text-center">
        <p class="font-bold text-slate-800">مسؤول الحركة والأسطول:</p>
        <div class="space-y-1">
          <p class="font-bold text-slate-900">${log ? log.supervisor_name : 'شعبة الأسطول والنقل'}</p>
          <p class="text-[10px] text-slate-400">التوقيع: .......................................</p>
          <p class="text-[10px] text-slate-400">الختم الفني: [ فحص سليم ]</p>
        </div>
      </div>

      <div class="space-y-6 text-left">
        <p class="font-bold text-slate-800">اعتماد إدارة الخدمات المساندة:</p>
        <div class="space-y-1">
          <p class="font-bold text-slate-900">مدير الموارد البشرية والخدمات</p>
          <p class="text-[10px] text-slate-400">التوقيع والختم الرسمي: ......................</p>
        </div>
      </div>
    </div>

  </div>

</body>
</html>
    `;
  }
}

module.exports = new FleetService();
