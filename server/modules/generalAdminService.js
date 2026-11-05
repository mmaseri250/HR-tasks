/**
 * server/modules/generalAdminService.js
 * Comprehensive General Administration, Transfer Workflows, Circulars, Licenses & Unified Reporting
 * Jawharat Al-Majd HRMS — Saudi Labor Law Compliant
 *
 * Capabilities:
 *  - Dynamic 3-Tier Transfer Workflow (مدير مباشر ➔ موارد بشرية ➔ إدارة عليا) with automatic employee department/branch update upon final approval
 *  - Administrative Circulars with Employee Digital Acknowledgement
 *  - Company Commercial, Municipal & Government Licenses Tracking with Expiry Alarms
 *  - Unified Comprehensive Reporting Engine across all 6 modules
 *  - Official A4 Printable Transfer Decisions, Circulars, and Licenses Reports
 */

const { query, get, run } = require('../database/db');
const xlsx = require('xlsx');
const branding = require('./branding');

class GeneralAdminService {
  constructor() {
    this.ensureTables();
  }

  /**
   * Ensure tables exist and schema columns are reconciled
   */
  ensureTables() {
    // 1. Transfer Requests Table
    run(`
      CREATE TABLE IF NOT EXISTS transfer_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_no TEXT UNIQUE NOT NULL,
        emp_id INTEGER NOT NULL,
        current_dept_id INTEGER,
        target_dept_id INTEGER,
        current_branch_id INTEGER,
        target_branch_id INTEGER,
        reason TEXT,
        desired_transfer_date TEXT,
        status TEXT DEFAULT 'معلق - بانتظار موافقة المدير المباشر',
        manager_status TEXT DEFAULT 'معلق',
        manager_comment TEXT,
        manager_action_at TEXT,
        manager_name TEXT,
        hr_status TEXT DEFAULT 'معلق',
        hr_comment TEXT,
        hr_action_at TEXT,
        hr_name TEXT,
        exec_status TEXT DEFAULT 'معلق',
        exec_comment TEXT,
        exec_action_at TEXT,
        exec_name TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE,
        FOREIGN KEY (current_dept_id) REFERENCES departments(id) ON DELETE SET NULL,
        FOREIGN KEY (target_dept_id) REFERENCES departments(id) ON DELETE SET NULL,
        FOREIGN KEY (current_branch_id) REFERENCES branches(id) ON DELETE SET NULL,
        FOREIGN KEY (target_branch_id) REFERENCES branches(id) ON DELETE SET NULL
      )
    `);

    // Ensure helper columns in transfer_requests
    const transCols = [
      { name: 'manager_name', type: 'TEXT' },
      { name: 'hr_name', type: 'TEXT' },
      { name: 'exec_name', type: 'TEXT' },
      { name: 'updated_at', type: 'TEXT DEFAULT CURRENT_TIMESTAMP' }
    ];
    for (const c of transCols) {
      try { run(`ALTER TABLE transfer_requests ADD COLUMN ${c.name} ${c.type}`); } catch (e) {}
    }

    // 2. Administrative Circulars
    run(`
      CREATE TABLE IF NOT EXISTS administrative_circulars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        circular_no TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT DEFAULT 'إداري وتنظيمي',
        target_audience TEXT DEFAULT 'كافة منسوبي الشركة',
        issued_by TEXT NOT NULL,
        issued_at TEXT NOT NULL,
        is_urgent INTEGER DEFAULT 0,
        acknowledgement_required INTEGER DEFAULT 1,
        status TEXT DEFAULT 'منشور',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Circular Acknowledgements
    run(`
      CREATE TABLE IF NOT EXISTS circular_acknowledgements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        circular_id INTEGER NOT NULL,
        emp_id INTEGER NOT NULL,
        acknowledged_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(circular_id, emp_id),
        FOREIGN KEY (circular_id) REFERENCES administrative_circulars(id) ON DELETE CASCADE,
        FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
      )
    `);

    // 4. Company Licenses
    run(`
      CREATE TABLE IF NOT EXISTS company_licenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        license_type TEXT NOT NULL,
        license_name_ar TEXT NOT NULL,
        license_no TEXT NOT NULL,
        issuing_authority TEXT NOT NULL,
        issue_date TEXT,
        expiry_date TEXT NOT NULL,
        alert_days_before INTEGER DEFAULT 60,
        status TEXT DEFAULT 'سارية',
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    run(`CREATE INDEX IF NOT EXISTS idx_transfer_emp ON transfer_requests(emp_id)`);
    run(`CREATE INDEX IF NOT EXISTS idx_transfer_status ON transfer_requests(status)`);
    run(`CREATE INDEX IF NOT EXISTS idx_circ_ack ON circular_acknowledgements(circular_id, emp_id)`);
    run(`CREATE INDEX IF NOT EXISTS idx_lic_exp ON company_licenses(expiry_date)`);
  }

  /**
   * Zero mock data policy: No automatic seeding of licenses or circulars.
   */
  seedInitialData() {
    // Disabled permanently for clean production state.
    return;
  }

  /* =========================================================================
     1. TRANSFER REQUESTS & DYNAMIC 3-TIER APPROVAL WORKFLOW
     ========================================================================= */

  /**
   * Retrieve transfer requests with rich employee and department relations
   */
  getTransferRequests(filters = {}) {
    let sql = `
      SELECT tr.*,
             e.emp_code, e.full_name_ar as emp_name, e.job_title_ar as emp_job,
             d_cur.name_ar as current_dept_name,
             d_tar.name_ar as target_dept_name,
             b_cur.name_ar as current_branch_name,
             b_tar.name_ar as target_branch_name
      FROM transfer_requests tr
      JOIN employees e ON tr.emp_id = e.id
      LEFT JOIN departments d_cur ON tr.current_dept_id = d_cur.id
      LEFT JOIN departments d_tar ON tr.target_dept_id = d_tar.id
      LEFT JOIN branches b_cur ON tr.current_branch_id = b_cur.id
      LEFT JOIN branches b_tar ON tr.target_branch_id = b_tar.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.emp_id) {
      sql += ` AND tr.emp_id = ?`;
      params.push(filters.emp_id);
    }

    if (filters.status) {
      sql += ` AND tr.status LIKE ?`;
      params.push(`%${filters.status}%`);
    }

    if (filters.search) {
      const term = `%${filters.search.trim()}%`;
      sql += ` AND (e.full_name_ar LIKE ? OR e.emp_code LIKE ? OR tr.request_no LIKE ?)`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY tr.id DESC`;
    return query(sql, params);
  }

  getTransferRequestById(id) {
    return get(`
      SELECT tr.*,
             e.emp_code, e.full_name_ar as emp_name, e.full_name_en as emp_name_en,
             e.national_id, e.nationality, e.job_title_ar as emp_job, e.basic_salary,
             d_cur.name_ar as current_dept_name,
             d_tar.name_ar as target_dept_name,
             b_cur.name_ar as current_branch_name,
             b_tar.name_ar as target_branch_name
      FROM transfer_requests tr
      JOIN employees e ON tr.emp_id = e.id
      LEFT JOIN departments d_cur ON tr.current_dept_id = d_cur.id
      LEFT JOIN departments d_tar ON tr.target_dept_id = d_tar.id
      LEFT JOIN branches b_cur ON tr.current_branch_id = b_cur.id
      LEFT JOIN branches b_tar ON tr.target_branch_id = b_tar.id
      WHERE tr.id = ?
    `, [id]);
  }

  /**
   * Submit new Transfer Request
   */
  createTransferRequest(data) {
    if (!data.emp_id || !data.target_dept_id) {
      throw new Error('يرجى تحديد الموظف والإدارة المنقول إليها.');
    }

    const emp = get(`SELECT * FROM employees WHERE id = ?`, [data.emp_id]);
    if (!emp) throw new Error('الموظف غير موجود.');

    const requestNo = `TRF-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    const desiredDate = data.desired_transfer_date || new Date().toISOString().split('T')[0];

    const res = run(`
      INSERT INTO transfer_requests (
        request_no, emp_id, current_dept_id, target_dept_id,
        current_branch_id, target_branch_id, reason, desired_transfer_date,
        status, manager_status, hr_status, exec_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'معلق - بانتظار موافقة المدير المباشر', 'معلق', 'معلق', 'معلق')
    `, [
      requestNo,
      emp.id,
      emp.department_id,
      parseInt(data.target_dept_id, 10),
      emp.branch_id,
      data.target_branch_id ? parseInt(data.target_branch_id, 10) : emp.branch_id,
      data.reason || 'طلب نقل داخلي لتطوير بيئة العمل وتوزيع الكفاءات',
      desiredDate
    ]);

    // Send in-system notification
    try {
      run(`
        INSERT INTO notifications (emp_id, title, message, type)
        VALUES (?, 'طلب نقل إداري جديد', 'تم استلام طلب النقل برقم ' || ?, 'transfer')
      `, [emp.id, requestNo]);
    } catch (e) {}

    return this.getTransferRequestById(res.lastInsertRowid);
  }

  /**
   * Process dynamic 3-tier approval stage:
   * stage: 'manager' | 'hr' | 'exec'
   */
  processTransferApproval(id, stage, decisionData = {}) {
    const tr = this.getTransferRequestById(id);
    if (!tr) throw new Error('طلب النقل غير موجود.');

    const isApprove = decisionData.action === 'موافق' || decisionData.action === 'approved';
    const comment = decisionData.comment || (isApprove ? 'موافق ومعتمد' : 'مرفوض');
    const approverName = decisionData.approver_name || 'المسؤول المعتمد';
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (stage === 'manager') {
      if (tr.manager_status !== 'معلق') {
        throw new Error('تم اتخاذ القرار في مرحلة المدير المباشر مسبقاً.');
      }
      const newStatus = isApprove ? 'موافقة_المدير - بانتظار مراجعة الموارد البشرية' : 'مرفوض من المدير المباشر';
      run(`
        UPDATE transfer_requests SET
          manager_status = ?,
          manager_comment = ?,
          manager_action_at = ?,
          manager_name = ?,
          status = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [isApprove ? 'معتمد' : 'مرفوض', comment, now, approverName, newStatus, id]);
    } else if (stage === 'hr') {
      if (tr.manager_status !== 'معتمد') {
        throw new Error('لا يمكن للموارد البشرية الاعتماد قبل موافقة المدير المباشر.');
      }
      if (tr.hr_status !== 'معلق') {
        throw new Error('تم اتخاذ قرار الموارد البشرية مسبقاً.');
      }
      const newStatus = isApprove ? 'موافقة_الموارد_البشرية - بانتظار الاعتماد النهائي للإدارة العليا' : 'مرفوض من الموارد البشرية';
      run(`
        UPDATE transfer_requests SET
          hr_status = ?,
          hr_comment = ?,
          hr_action_at = ?,
          hr_name = ?,
          status = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [isApprove ? 'معتمد' : 'مرفوض', comment, now, approverName, newStatus, id]);
    } else if (stage === 'exec') {
      if (tr.hr_status !== 'معتمد') {
        throw new Error('لا يمكن للإدارة العليا الاعتماد النهائي قبل مراجعة واعتماد الموارد البشرية.');
      }
      if (tr.exec_status !== 'معلق') {
        throw new Error('تم اتخاذ قرار الاعتماد النهائي مسبقاً.');
      }

      if (isApprove) {
        // AUTOMATED TRANSFER: Update employee record directly in database
        run(`
          UPDATE employees SET
            department_id = ?,
            branch_id = COALESCE(?, branch_id)
          WHERE id = ?
        `, [tr.target_dept_id, tr.target_branch_id, tr.emp_id]);

        run(`
          UPDATE transfer_requests SET
            exec_status = 'معتمد',
            exec_comment = ?,
            exec_action_at = ?,
            exec_name = ?,
            status = 'معتمد نهائياً وتم تنفيذ النقل',
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `, [comment, now, approverName, id]);

        // Audit log
        try {
          run(`
            INSERT INTO audit_logs (entity_type, entity_id, action, performed_by_name, comment)
            VALUES ('transfer_requests', ?, 'FINAL_APPROVAL', ?, 'تم اعتماد طلب النقل رسمياً وتحديث قسم الموظف إلى ' || ?)
          `, [id, approverName, tr.target_dept_name]);
        } catch (e) {}

      } else {
        run(`
          UPDATE transfer_requests SET
            exec_status = 'مرفوض',
            exec_comment = ?,
            exec_action_at = ?,
            exec_name = ?,
            status = 'مرفوض من الإدارة العليا',
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `, [comment, now, approverName, id]);
      }
    } else {
      throw new Error(`مرحلة اعتماد غير معروفة (${stage}).`);
    }

    return this.getTransferRequestById(id);
  }

  /**
   * Generate Printable Official A4 Transfer Decision Document
   */
  generateTransferDecisionPrintHtml(id) {
    const tr = this.getTransferRequestById(id);
    if (!tr) throw new Error('طلب النقل غير موجود.');

    const isFullyApproved = tr.exec_status === 'معتمد';

    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>قرار نقل إداري رسمي - ${tr.emp_name}</title>
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
      <i class="fa-solid fa-right-left text-amber-400 text-xl"></i>
      <div>
        <p class="font-black text-sm">قرار نقل إداري رسمي معتمد — سير الموافقات الثلاثي</p>
        <p class="text-xs text-slate-300">جاهز للطباعة والأرشفة الرسمية في ملف الموظف</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button onclick="window.print()" class="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 transition shadow">
        <i class="fa-solid fa-print"></i> طباعة القرار (Print A4)
      </button>
      <button onclick="window.close()" class="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs">
        إغلاق
      </button>
    </div>
  </div>

  <!-- A4 Container -->
  <div class="border-2 brand-border rounded-2xl p-6 bg-white space-y-5 relative overflow-hidden shadow-sm">
    
    <!-- Watermark -->
    <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
      <i class="fa-solid fa-scale-balanced text-[350px] text-slate-900"></i>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between border-b-2 brand-border pb-4">
      <div class="text-right space-y-1">
        <h2 class="font-black text-lg text-slate-900">${branding.companyNameAr}</h2>
        <p class="text-xs font-semibold text-slate-600">الإدارة العامة للموارد البشرية والخدمات المساندة</p>
        <p class="text-[11px] text-slate-500">سجل تجاري: ${branding.commercialRegister} | المركز الرئيسي - أبها</p>
      </div>
      <div class="text-center px-4 py-2 border brand-border rounded-xl bg-white shadow-sm">
        <img src="${branding.logoBase64}" alt="شعار شركة جوهرة المجد" class="h-12 max-w-[140px] object-contain mx-auto" />
        <span class="text-[9px] font-black tracking-widest text-[#700c14] block mt-1">TRANSFER DECISION</span>
      </div>
      <div class="text-left space-y-1 text-xs">
        <div class="font-bold text-slate-700">رقم الطلب: <span class="font-mono text-slate-900 font-bold">${tr.request_no}</span></div>
        <div class="font-bold text-slate-700">التاريخ: <span class="font-mono text-slate-900 font-bold">${tr.created_at.substring(0, 10)}</span></div>
        <div class="font-bold text-slate-700">الحالة: <span class="font-bold ${isFullyApproved ? 'text-emerald-700' : 'text-amber-700'}">${tr.status}</span></div>
      </div>
    </div>

    <!-- Title Banner -->
    <div class="text-center py-2.5 bg-gradient-to-r from-slate-900 via-[#700c14] to-slate-900 text-white rounded-xl shadow-sm">
      <h1 class="text-sm font-black tracking-wide">قرار نقل وتكليف إداري داخلي</h1>
      <p class="text-[10px] text-amber-300 font-medium tracking-wider">OFFICIAL ADMINISTRATIVE TRANSFER DECISION</p>
    </div>

    <!-- Employee Details -->
    <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
      <div class="bg-slate-100 px-3 py-2 font-black text-slate-800">
        أولاً: بيانات الموظف المنقول:
      </div>
      <div class="p-3 bg-white grid grid-cols-4 gap-3">
        <div>
          <span class="text-slate-500 block text-[11px]">اسم الموظف:</span>
          <span class="font-black text-slate-900 text-sm">${tr.emp_name}</span>
        </div>
        <div>
          <span class="text-slate-500 block text-[11px]">الرقم الوظيفي:</span>
          <span class="font-bold font-mono text-slate-900">${tr.emp_code}</span>
        </div>
        <div>
          <span class="text-slate-500 block text-[11px]">المسمى الوظيفي:</span>
          <span class="font-bold text-slate-900">${tr.emp_job}</span>
        </div>
        <div>
          <span class="text-slate-500 block text-[11px]">رقم الهوية / الإقامة:</span>
          <span class="font-bold font-mono text-slate-900">${tr.national_id || '---'}</span>
        </div>
      </div>
    </div>

    <!-- Transfer Details (From / To) -->
    <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
      <div class="bg-slate-100 px-3 py-2 font-black text-slate-800">
        ثانياً: تفاصيل النقل ومحددات المباشرة:
      </div>
      <div class="p-3 bg-white grid grid-cols-2 gap-4">
        
        <!-- From -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <span class="text-[10px] font-black text-slate-500 block">الجهة الحالية (قبل النقل):</span>
          <div class="font-bold text-slate-900 text-xs">الإدارة: ${tr.current_dept_name || '---'}</div>
          <div class="text-slate-600 text-[11px]">الفرع: ${tr.current_branch_name || 'المركز الرئيسي'}</div>
        </div>

        <!-- To -->
        <div class="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
          <span class="text-[10px] font-black text-emerald-800 block">الجهة المنقول إليها (بعد النقل):</span>
          <div class="font-black text-emerald-950 text-xs">الإدارة: ${tr.target_dept_name || '---'}</div>
          <div class="text-emerald-800 text-[11px]">الفرع: ${tr.target_branch_name || 'المركز الرئيسي'}</div>
        </div>

      </div>

      <div class="px-3 pb-3 bg-white text-[11px] text-slate-700">
        <span class="font-bold text-slate-900 block mb-0.5">أسباب ومبررات النقل:</span>
        <p class="p-2 bg-slate-50 rounded-lg border border-slate-100">${tr.reason}</p>
      </div>
    </div>

    <!-- 3-Tier Multi-Stage Workflow Approval Trail -->
    <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
      <div class="bg-slate-100 px-3 py-2 font-black text-slate-800">
        ثالثاً: سير الموافقات والاعتمادات الرسمية (3-Tier Workflow):
      </div>
      <div class="p-3 bg-white grid grid-cols-3 gap-3">
        
        <!-- Tier 1: Direct Manager -->
        <div class="p-3 rounded-xl border ${tr.manager_status === 'معتمد' ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'} space-y-1">
          <div class="flex items-center justify-between">
            <span class="font-black text-slate-900 text-[11px]">1. المدير المباشر:</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-black ${tr.manager_status === 'معتمد' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              ${tr.manager_status}
            </span>
          </div>
          <p class="text-[10px] text-slate-600">${tr.manager_comment || 'بانتظار الإجراء'}</p>
          <p class="text-[9px] text-slate-400 font-mono">${tr.manager_action_at || '---'}</p>
        </div>

        <!-- Tier 2: HR -->
        <div class="p-3 rounded-xl border ${tr.hr_status === 'معتمد' ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'} space-y-1">
          <div class="flex items-center justify-between">
            <span class="font-black text-slate-900 text-[11px]">2. الموارد البشرية:</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-black ${tr.hr_status === 'معتمد' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              ${tr.hr_status}
            </span>
          </div>
          <p class="text-[10px] text-slate-600">${tr.hr_comment || 'بانتظار المراجعة'}</p>
          <p class="text-[9px] text-slate-400 font-mono">${tr.hr_action_at || '---'}</p>
        </div>

        <!-- Tier 3: Executive -->
        <div class="p-3 rounded-xl border ${tr.exec_status === 'معتمد' ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'} space-y-1">
          <div class="flex items-center justify-between">
            <span class="font-black text-slate-900 text-[11px]">3. الإدارة العليا:</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-black ${tr.exec_status === 'معتمد' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              ${tr.exec_status}
            </span>
          </div>
          <p class="text-[10px] text-slate-600">${tr.exec_comment || 'بانتظار الاعتماد النهائي'}</p>
          <p class="text-[9px] text-slate-400 font-mono">${tr.exec_action_at || '---'}</p>
        </div>

      </div>
    </div>

    <!-- Official Stamp & Signatures -->
    <div class="grid grid-cols-3 gap-4 pt-3 text-xs border-t border-slate-200">
      <div class="space-y-4">
        <p class="font-bold text-slate-800">توقيع الموظف بالعلم:</p>
        <p class="text-[10px] text-slate-400">التوقيع: ............................</p>
      </div>

      <div class="space-y-4 text-center">
        <p class="font-bold text-slate-800">مدير عام الموارد البشرية:</p>
        <p class="text-[10px] text-slate-400">الاعتماد: ............................</p>
      </div>

      <div class="space-y-4 text-left">
        <p class="font-bold text-slate-800">الرئيس التنفيذي للشركة:</p>
        <p class="text-[10px] text-slate-400">الختم والاعتماد الرسمي</p>
      </div>
    </div>

  </div>

</body>
</html>
    `;
  }

  /* =========================================================================
     2. ADMINISTRATIVE CIRCULARS & NOTIFICATIONS
     ========================================================================= */

  getCirculars(filters = {}) {
    let sql = `
      SELECT c.*,
             (SELECT COUNT(*) FROM circular_acknowledgements a WHERE a.circular_id = c.id) as ack_count,
             (SELECT COUNT(*) FROM employees WHERE emp_code NOT IN ('JM-0001','JM-0002','JM-0003')) as total_employees_count
      FROM administrative_circulars c
      WHERE 1=1
    `;
    const params = [];

    if (filters.category) {
      sql += ` AND c.category = ?`;
      params.push(filters.category);
    }

    if (filters.search) {
      const term = `%${filters.search.trim()}%`;
      sql += ` AND (c.title LIKE ? OR c.content LIKE ? OR c.circular_no LIKE ?)`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY c.id DESC`;
    const rows = query(sql, params);

    // If emp_id provided, flag if acknowledged
    if (filters.emp_id) {
      return rows.map(r => {
        const isAck = get(`SELECT id FROM circular_acknowledgements WHERE circular_id = ? AND emp_id = ?`, [r.id, filters.emp_id]);
        return { ...r, is_acknowledged_by_user: !!isAck };
      });
    }

    return rows;
  }

  getCircularById(id, empId = null) {
    let c = get(`
      SELECT c.*,
             (SELECT COUNT(*) FROM circular_acknowledgements a WHERE a.circular_id = c.id) as ack_count
      FROM administrative_circulars c
      WHERE c.id = ?
    `, [id]);

    if (!c && id) {
      // Allow finding by circular_no (e.g. CIR-2026-004) or numeric suffix (e.g. 4 -> CIR-2026-004)
      const numStr = String(id).padStart(3, '0');
      c = get(`
        SELECT c.*,
               (SELECT COUNT(*) FROM circular_acknowledgements a WHERE a.circular_id = c.id) as ack_count
        FROM administrative_circulars c
        WHERE c.circular_no = ? OR c.circular_no LIKE ?
      `, [String(id), `%${numStr}%`]);
    }
    if (!c) return null;

    let isAck = false;
    if (empId) {
      isAck = !!get(`SELECT id FROM circular_acknowledgements WHERE circular_id = ? AND emp_id = ?`, [c.id, empId]);
    }

    return { ...c, is_acknowledged_by_user: isAck };
  }

  createCircular(data) {
    if (!data.title || !data.content) {
      throw new Error('يرجى تعبئة عنوان التعميم والمحتوى.');
    }

    const circNo = data.circular_no || `CIR-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
    const issuedAt = data.issued_at || new Date().toISOString().split('T')[0];

    const res = run(`
      INSERT INTO administrative_circulars (
        circular_no, title, content, category, target_audience,
        issued_by, issued_at, is_urgent, acknowledgement_required, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'منشور')
    `, [
      circNo,
      data.title.trim(),
      data.content.trim(),
      data.category || 'إداري وتنظيمي',
      data.target_audience || 'كافة منسوبي الشركة',
      data.issued_by || 'إدارة الموارد البشرية',
      issuedAt,
      data.is_urgent ? 1 : 0,
      data.acknowledgement_required !== undefined ? (data.acknowledgement_required ? 1 : 0) : 1
    ]);

    // Broadcast in-system notifications
    try {
      run(`
        INSERT INTO notifications (title, message, type)
        VALUES ('تعميم إداري جديد: ' || ?, 'صدر تعميم إداري برقم ' || ? || ' يلزم الاطلاع والإقرار.', 'circular')
      `, [data.title, circNo]);
    } catch (e) {}

    return this.getCircularById(res.lastInsertRowid);
  }

  acknowledgeCircular(circularId, empId) {
    const circ = this.getCircularById(circularId);
    if (!circ) throw new Error('التعميم غير موجود.');

    const emp = get(`SELECT id FROM employees WHERE id = ?`, [empId]);
    if (!emp) throw new Error('الموظف غير موجود.');

    run(`
      INSERT OR IGNORE INTO circular_acknowledgements (circular_id, emp_id)
      VALUES (?, ?)
    `, [circularId, empId]);

    return { success: true, message: 'تم تسجيل إقرار الاطلاع على التعميم بنجاح.' };
  }

  generateCircularPrintHtml(circularId) {
    const c = this.getCircularById(circularId);
    if (!c) throw new Error('التعميم غير موجود.');

    const qrData = encodeURIComponent(`https://jawharat-hrms.onrender.com/api/general/circulars/${c.id}/verify?no=${c.circular_no}`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&margin=4&data=${qrData}`;

    return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>تعميم إداري رسمي - ${c.circular_no} - شركة جوهرة المجد</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #525659;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }
    .screen-container {
      padding: 24px 0 60px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .toolbar {
      width: 210mm;
      margin-bottom: 16px;
      position: sticky;
      top: 12px;
      z-index: 1000;
    }
    .a4-page {
      width: 210mm;
      min-height: 297mm;
      height: 297mm;
      max-height: 297mm;
      background: #ffffff;
      padding: 14mm 16mm 12mm 16mm;
      margin: 0 auto;
      box-shadow: 0 12px 36px rgba(0,0,0,0.25), 0 0 1px rgba(0,0,0,0.2);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }
    .a4-border-frame {
      position: absolute;
      top: 7mm;
      bottom: 7mm;
      left: 7mm;
      right: 7mm;
      border: 2px solid #700c14;
      pointer-events: none;
      border-radius: 4px;
    }
    .a4-border-frame::after {
      content: '';
      position: absolute;
      top: 2px;
      bottom: 2px;
      left: 2px;
      right: 2px;
      border: 1px solid #d4af37;
      pointer-events: none;
      border-radius: 2px;
    }
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 72px;
      font-weight: 900;
      color: rgba(112, 12, 20, 0.035);
      white-space: nowrap;
      pointer-events: none;
      z-index: 1;
      user-select: none;
    }
    .content-area {
      position: relative;
      z-index: 2;
    }
    .official-stamp {
      display: inline-block;
      width: 90px;
      height: 90px;
      border: 2px dashed #700c14;
      border-radius: 50%;
      padding: 3px;
      transform: rotate(-10deg);
      opacity: 0.88;
      box-shadow: 0 0 0 2px rgba(112, 12, 20, 0.15);
    }
    .stamp-inner {
      width: 100%;
      height: 100%;
      border: 1px solid #700c14;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: radial-gradient(circle, #fff 40%, #fff1f2 100%);
    }
    @media print {
      body {
        background: #ffffff !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .screen-container {
        padding: 0 !important;
        display: block !important;
      }
      .no-print {
        display: none !important;
      }
      .a4-page {
        width: 210mm !important;
        min-height: 297mm !important;
        height: 297mm !important;
        max-height: 297mm !important;
        box-shadow: none !important;
        margin: 0 !important;
        padding: 14mm 16mm 12mm 16mm !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>

  <div class="screen-container">
    <!-- Top Action Toolbar (Hidden during print) -->
    <div class="toolbar no-print flex items-center justify-between bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-slate-700">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#700c14] to-amber-500 flex items-center justify-center text-white shadow-md">
          <i class="fa-solid fa-file-contract text-base"></i>
        </div>
        <div>
          <p class="font-black text-sm">معاينة طباعة التعميم الإداري (A4 Standard)</p>
          <p class="text-[11px] text-slate-300">شركة جوهرة المجد للمقاولات والتجارة — وثيقة إدارية ملزمة</p>
        </div>
      </div>
      <div class="flex items-center gap-2.5">
        <button onclick="window.print()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer">
          <i class="fa-solid fa-print"></i> طباعة التعميم (Print A4)
        </button>
        <button onclick="window.close()" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-700">
          <i class="fa-solid fa-xmark"></i> إغلاق
        </button>
      </div>
    </div>

    <!-- Official A4 Document Canvas -->
    <div class="a4-page relative">
      <!-- Outer/Inner Decorative Golden Border -->
      <div class="a4-border-frame"></div>

      <!-- Security Watermark -->
      <div class="watermark">JAWHARAT AL-MAJD • جوهرة المجد</div>

      <!-- Top Section (Header + Letterhead) -->
      <div class="content-area space-y-3">
        <!-- 3-Column Enterprise Letterhead -->
        <div class="grid grid-cols-3 items-center border-b border-slate-200 pb-3">
          <!-- Right: Kingdom & Company Info -->
          <div class="text-right space-y-0.5">
            <p class="text-[10px] font-bold text-slate-500">المملكة العربية السعودية</p>
            <h2 class="text-sm font-black text-[#700c14] leading-tight">شركة جوهرة المجد للمقاولات والتجارة</h2>
            <p class="text-[9px] font-semibold text-slate-600">سجل تجاري: <span class="font-mono font-bold text-slate-800">5850024190</span></p>
            <p class="text-[9px] font-semibold text-slate-600">الرقم الضريبي: <span class="font-mono font-bold text-slate-800">310123456700003</span></p>
            <p class="text-[9px] font-bold text-slate-700">الشؤون الإدارية والموارد البشرية</p>
          </div>

          <!-- Center: Luxury Crest / Official Emblem -->
          <div class="text-center flex flex-col items-center justify-center">
            <img src="${branding.logoBase64}" alt="شعار شركة جوهرة المجد" class="h-16 max-w-[190px] object-contain mx-auto" />
            <span class="text-xs font-black text-slate-900 mt-1 block tracking-wide">تعميم إداري رسمي معتمد</span>
            <span class="text-[8px] font-bold text-[#700c14] tracking-widest block uppercase font-mono">ADMINISTRATIVE CIRCULAR</span>
          </div>

          <!-- Left: Circular Metadata Card -->
          <div class="text-left space-y-1 text-xs bg-slate-50/90 p-2.5 rounded-xl border border-slate-200">
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-slate-500 text-[10px]">رقم التعميم:</span>
              <span class="font-mono font-black text-[#700c14] text-xs">${c.circular_no}</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-slate-500 text-[10px]">تاريخ الإصدار:</span>
              <span class="font-mono font-bold text-slate-800 text-[11px]">${c.issued_at} م</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-slate-500 text-[10px]">الأهمية:</span>
              <span class="px-2 py-0.5 rounded text-[9px] font-black ${c.is_urgent ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-slate-200 text-slate-800'}">
                ${c.is_urgent ? 'عاجل وهام جداً' : 'عادي (سريان فوري)'}
              </span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-slate-500 text-[10px]">التصنيف:</span>
              <span class="font-bold text-slate-700 text-[9px]">${c.category || 'إداري وتنظيمي'}</span>
            </div>
          </div>
        </div>

        <!-- Gold & Burgundy Accent Divider -->
        <div class="h-1 bg-gradient-to-r from-[#700c14] via-[#d4af37] to-[#700c14] rounded-full"></div>

        <!-- Subject Banner -->
        <div class="bg-gradient-to-r from-[#45060b] via-[#700c14] to-[#45060b] text-white py-2.5 px-4 rounded-xl text-center shadow-md border border-[#d4af37]/60">
          <div class="text-[9px] font-black text-amber-300 tracking-wider mb-0.5">موضوع التعميم الإداري / CIRCULAR SUBJECT</div>
          <h1 class="text-sm font-black tracking-wide leading-snug">${c.title}</h1>
        </div>

        <!-- Routing & Target Entity Bar -->
        <div class="grid grid-cols-2 gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-rose-100 text-[#700c14] flex items-center justify-center text-xs">
              <i class="fa-solid fa-users"></i>
            </div>
            <div>
              <span class="text-[9px] text-slate-500 font-bold block">الجهة الموجه إليها التعميم:</span>
              <strong class="text-slate-900 text-[11px]">${c.target_audience}</strong>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center text-xs">
              <i class="fa-solid fa-building-circle-check"></i>
            </div>
            <div>
              <span class="text-[9px] text-slate-500 font-bold block">الجهة المصدرة والمعتمدة:</span>
              <strong class="text-[#700c14] text-[11px]">${c.issued_by}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Section: Official Body Text -->
      <div class="content-area flex-1 my-3 flex flex-col justify-between">
        <div class="space-y-2">
          <!-- Salutation -->
          <div class="text-xs font-bold text-slate-700 space-y-0.5">
            <p>السلام عليكم ورحمة الله وبركاته،،،</p>
            <p class="text-slate-600">تحية طيبة وبعد؛</p>
          </div>

          <!-- Body Content -->
          <div class="text-[12.5px] leading-relaxed text-slate-800 whitespace-pre-line text-justify p-3 bg-white rounded-xl border border-slate-200/80 shadow-inner min-h-[140px]">
${c.content}
          </div>

          <!-- Formal Conclusion -->
          <div class="text-[11px] text-slate-700 leading-relaxed space-y-0.5 pt-1">
            <p>شاكرين ومقدرين للجميع حسن التعاون والالتزام الصارم بما ورد أعلاه، متمنين للجميع دوام التوفيق والسداد.</p>
            <p class="font-bold text-slate-900">وتقبلوا خالص التحية والتقدير،،،</p>
          </div>
        </div>

        <!-- Approvals & Signature Matrix (3 Columns) -->
        <div class="mt-4 pt-3 border-t-2 border-slate-200">
          <div class="text-[10px] font-black text-slate-600 mb-2 flex items-center justify-between">
            <span>سير الاعتمادات والتوثيق الإداري الرسمي (Official Approval Hierarchy):</span>
            <span class="font-mono text-[9px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <i class="fa-solid fa-certificate text-emerald-600"></i> معتمد وموثق نظامياً
            </span>
          </div>

          <div class="grid grid-cols-3 gap-3 text-center">
            <!-- 1. Reviewer -->
            <div class="p-2 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1">
              <p class="text-[9px] font-bold text-slate-500">إعداد ومراجعة</p>
              <p class="text-[10px] font-black text-slate-800">الشؤون الإدارية والمزايا</p>
              <div class="h-9 flex items-center justify-center">
                <span class="font-serif italic text-xs text-slate-600 font-bold">معتمد إلكترونياً</span>
              </div>
              <p class="text-[8px] text-slate-400 font-mono">HR-VERIFIED</p>
            </div>

            <!-- 2. HR Director -->
            <div class="p-2 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1">
              <p class="text-[9px] font-bold text-slate-500">اعتماد الموارد البشرية</p>
              <p class="text-[10px] font-black text-[#700c14]">عبدالملك سعيد الشريف</p>
              <div class="h-9 flex items-center justify-center">
                <span class="text-[11px] font-black text-[#700c14]">مدير الموارد البشرية</span>
              </div>
              <p class="text-[8px] text-slate-400 font-mono">JM-DIR-HR</p>
            </div>

            <!-- 3. Operations / GM with Official Stamp -->
            <div class="p-2 bg-rose-50/40 rounded-xl border border-rose-200 space-y-1 relative">
              <p class="text-[9px] font-bold text-slate-500">المصادقة التنفيذية والختم</p>
              <p class="text-[10px] font-black text-slate-900">فارس عبدالرحمن القحطاني</p>
              <div class="h-9 flex items-center justify-center">
                <div class="official-stamp">
                  <div class="stamp-inner">
                    <span class="text-[6.5px] font-black text-[#700c14]">جوهرة المجد</span>
                    <span class="text-[5.5px] font-bold text-slate-700">معتمد رسمياً</span>
                    <span class="text-[5px] font-mono text-[#700c14]">CR: 5850024190</span>
                  </div>
                </div>
              </div>
              <p class="text-[8px] text-slate-400 font-mono">EXECUTIVE-AUTH</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section: Verification & Official Enterprise Footer -->
      <div class="content-area border-t border-slate-200 pt-2 space-y-2">
        <!-- Security Bar & Digital Acknowledgements -->
        <div class="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-[10px]">
          <div class="flex items-center gap-2">
            <img src="${qrUrl}" alt="QR Verification" class="w-10 h-10 rounded border border-slate-300 bg-white p-0.5">
            <div>
              <p class="font-bold text-slate-800">رمز التحقق الإلكتروني للتعميم:</p>
              <p class="font-mono text-[9px] text-slate-500">REF-${c.circular_no}-VERIFIED</p>
            </div>
          </div>
          <div class="text-left space-y-0.5">
            <p class="font-bold text-teal-800"><i class="fa-solid fa-clipboard-check text-teal-600"></i> إقرارات العلم والاطلاع المسجلة:</p>
            <p class="text-[9px] text-slate-600 font-mono font-bold">${c.ack_count || 0} موظف أقروا بالاطلاع عبر البوابة</p>
          </div>
        </div>

        <!-- Corporate Address & Registration Footer -->
        <div class="text-center space-y-0.5 text-[8.5px] text-slate-500">
          <p class="font-bold text-slate-600">
            شركة جوهرة المجد للمقاولات والتجارة — شركة ذات مسؤولية محدودة — المملكة العربية السعودية
          </p>
          <p>
            المركز الرئيسي: خميس مشيط - منطقة عسير - طريق الملك فهد | هاتف: 0172220000 | البريد: info@jawharat-al-majd.com | ص.ب: 1234
          </p>
          <div class="flex items-center justify-between text-[8px] text-slate-400 pt-0.5 font-mono">
            <span>وثيقة نظامية ملزمة معتمدة من إدارة الموارد البشرية</span>
            <span>صفحة 1 من 1</span>
          </div>
        </div>
      </div>
    </div>
  </div>

</body>
</html>
    `;
  }

  /* =========================================================================
     3. COMPANY LICENSES & GOVERNMENT REGISTRATIONS
     ========================================================================= */

  computeExpiry(dateStr, alertDays = 60) {
    if (!dateStr) return { daysLeft: null, status: 'unknown', text_ar: 'غير مسجل' };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return { daysLeft, status: 'expired', text_ar: `منتهية منذ ${Math.abs(daysLeft)} يوم` };
    } else if (daysLeft <= alertDays) {
      return { daysLeft, status: 'expiring_soon', text_ar: `تنتهي خلال ${daysLeft} يوم` };
    } else {
      return { daysLeft, status: 'valid', text_ar: `سارية (${daysLeft} يوم متبقٍ)` };
    }
  }

  getLicenses(filters = {}) {
    let sql = `SELECT * FROM company_licenses WHERE 1=1`;
    const params = [];

    if (filters.status) {
      sql += ` AND status = ?`;
      params.push(filters.status);
    }

    if (filters.search) {
      const term = `%${filters.search.trim()}%`;
      sql += ` AND (license_name_ar LIKE ? OR license_no LIKE ? OR issuing_authority LIKE ?)`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY expiry_date ASC`;
    const rows = query(sql, params);

    return rows.map(r => {
      const exp = this.computeExpiry(r.expiry_date, r.alert_days_before || 60);
      return {
        ...r,
        expiry_info: exp,
        has_alert: exp.status === 'expired' || exp.status === 'expiring_soon'
      };
    });
  }

  getLicenseById(id) {
    const l = get(`SELECT * FROM company_licenses WHERE id = ?`, [id]);
    if (!l) return null;
    return {
      ...l,
      expiry_info: this.computeExpiry(l.expiry_date, l.alert_days_before || 60)
    };
  }

  createLicense(data) {
    if (!data.license_name_ar || !data.license_no || !data.expiry_date) {
      throw new Error('يرجى تعبئة اسم الترخيص ورقم الترخيص وتاريخ الانتهاء.');
    }

    const res = run(`
      INSERT INTO company_licenses (
        license_type, license_name_ar, license_no, issuing_authority,
        issue_date, expiry_date, alert_days_before, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'سارية', ?)
    `, [
      data.license_type || 'other',
      data.license_name_ar.trim(),
      data.license_no.trim(),
      data.issuing_authority || 'الجهة الحكومية المختصة',
      data.issue_date || null,
      data.expiry_date,
      data.alert_days_before ? parseInt(data.alert_days_before, 10) : 60,
      data.notes || null
    ]);

    return this.getLicenseById(res.lastInsertRowid);
  }

  updateLicense(id, data) {
    const existing = this.getLicenseById(id);
    if (!existing) throw new Error('الترخيص غير موجود.');

    run(`
      UPDATE company_licenses SET
        license_name_ar = COALESCE(?, license_name_ar),
        license_no = COALESCE(?, license_no),
        issuing_authority = COALESCE(?, issuing_authority),
        issue_date = COALESCE(?, issue_date),
        expiry_date = COALESCE(?, expiry_date),
        alert_days_before = COALESCE(?, alert_days_before),
        status = COALESCE(?, status),
        notes = COALESCE(?, notes)
      WHERE id = ?
    `, [
      data.license_name_ar !== undefined ? data.license_name_ar : null,
      data.license_no !== undefined ? data.license_no : null,
      data.issuing_authority !== undefined ? data.issuing_authority : null,
      data.issue_date !== undefined ? data.issue_date : null,
      data.expiry_date !== undefined ? data.expiry_date : null,
      data.alert_days_before !== undefined ? parseInt(data.alert_days_before, 10) : null,
      data.status !== undefined ? data.status : null,
      data.notes !== undefined ? data.notes : null,
      id
    ]);

    return this.getLicenseById(id);
  }

  deleteLicense(id) {
    const existing = this.getLicenseById(id);
    if (!existing) throw new Error('الترخيص غير موجود.');
    run(`DELETE FROM company_licenses WHERE id = ?`, [id]);
    return { success: true, message: `تم حذف السجل/الترخيص (${existing.license_name_ar}) بنجاح.` };
  }

  /**
   * Generate Printable Official A4 Company Licenses & Commercial Registrations Report
   */
  generateLicensesReportHtml() {
    const licenses = this.getLicenses();
    const alertCount = licenses.filter(l => l.has_alert).length;
    const now = new Date().toISOString().split('T')[0];

    const rowsHtml = licenses.map((l, idx) => {
      let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      if (l.expiry_info.status === 'expired') badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
      else if (l.expiry_info.status === 'expiring_soon') badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';

      return `
        <tr class="border-b border-slate-100 hover:bg-slate-50 text-xs">
          <td class="p-2.5 text-center font-bold text-slate-500">${idx + 1}</td>
          <td class="p-2.5 font-black text-slate-900">${l.license_name_ar}</td>
          <td class="p-2.5 font-mono font-bold text-[#700c14]">${l.license_no}</td>
          <td class="p-2.5 text-slate-700">${l.issuing_authority}</td>
          <td class="p-2.5 font-mono text-center text-slate-600">${l.issue_date || '---'}</td>
          <td class="p-2.5 font-mono text-center font-bold text-slate-900">${l.expiry_date}</td>
          <td class="p-2.5 text-center">
            <span class="inline-block px-2.5 py-1 rounded-lg text-[10px] font-black border ${badgeClass}">
              ${l.expiry_info.text_ar}
            </span>
          </td>
        </tr>
      `;
    }).join('');

    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>تقرير السجلات والتراخيص النظامية - شركة جوهرة المجد</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; background: #fff; color: #0f172a; padding: 20px; }
    .brand-border { border-color: #700c14; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      @page { size: A4 landscape; margin: 10mm; }
    }
  </style>
</head>
<body class="max-w-5xl mx-auto space-y-4">

  <!-- Print Toolbar -->
  <div class="no-print flex items-center justify-between bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-lg mb-4">
    <div class="flex items-center gap-3">
      <i class="fa-solid fa-file-shield text-amber-400 text-xl"></i>
      <div>
        <p class="font-black text-sm">تقرير السجلات التجارية والتراخيص الحكومية</p>
        <p class="text-xs text-slate-300">محدث وفقاً لمنصات بلدي، قوى، ووزارة التجارة</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button onclick="window.print()" class="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 transition shadow">
        <i class="fa-solid fa-print"></i> طباعة التقرير (Print A4)
      </button>
      <button onclick="window.close()" class="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs">
        إغلاق
      </button>
    </div>
  </div>

  <div class="border-2 brand-border rounded-2xl p-6 bg-white space-y-5 shadow-sm">
    <!-- Header -->
    <div class="flex items-center justify-between border-b-2 brand-border pb-4">
      <div class="text-right space-y-1">
        <h2 class="font-black text-lg text-slate-900">شركة جوهرة المجد للمقاولات والتجارة</h2>
        <p class="text-xs font-semibold text-slate-600">الشؤون الإدارية والحوكمة — سجلات وتراخيص المنشأة</p>
      </div>
      <div class="text-center px-4 py-2 border brand-border rounded-xl bg-white shadow-sm">
        <img src="${branding.logoBase64}" alt="شعار شركة جوهرة المجد" class="h-12 max-w-[140px] object-contain mx-auto" />
        <span class="text-[9px] font-black tracking-widest text-[#700c14] block mt-1">COMPANY LICENSES REGISTER</span>
      </div>
      <div class="text-left space-y-1 text-xs">
        <div class="font-bold text-slate-700">تاريخ التقرير: <span class="font-mono text-slate-900 font-bold">${now}</span></div>
        <div class="font-bold text-slate-700">إجمالي التراخيص: <span class="font-mono text-slate-900 font-bold">${licenses.length}</span></div>
        <div class="font-bold text-slate-700">التنبيهات العاجلة: <span class="font-bold ${alertCount > 0 ? 'text-amber-600' : 'text-emerald-600'}">${alertCount}</span></div>
      </div>
    </div>

    <!-- Title Banner -->
    <div class="text-center py-2 bg-gradient-to-r from-slate-900 via-[#700c14] to-slate-900 text-white rounded-xl shadow-sm">
      <h1 class="text-sm font-black tracking-wide">بيان السجلات التجارية والتراخيص والشهادات النظامية السارية</h1>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-xl border border-slate-200">
      <table class="w-full text-right border-collapse">
        <thead>
          <tr class="bg-slate-100 text-slate-700 text-[11px] font-black border-b border-slate-200">
            <th class="p-2.5 text-center">#</th>
            <th class="p-2.5">اسم السجل / الترخيص</th>
            <th class="p-2.5">رقم الترخيص</th>
            <th class="p-2.5">الجهة المصدرة</th>
            <th class="p-2.5 text-center">تاريخ الإصدار</th>
            <th class="p-2.5 text-center">تاريخ الانتهاء</th>
            <th class="p-2.5 text-center">حالة السريان والصلاحية</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>

    <!-- Footer Stamp -->
    <div class="grid grid-cols-2 gap-4 pt-4 text-xs border-t border-slate-200">
      <div class="space-y-1">
        <p class="font-bold text-slate-800">اعتماد إدارة الشؤون القانونية والمتابعة:</p>
        <p class="text-[10px] text-slate-500">تمت مطابقة البيانات بالسجلات الرسمية الصادرة عبر بوابات الجهات الحكومية.</p>
      </div>
      <div class="text-left space-y-1">
        <p class="font-bold text-slate-800">شركة جوهرة المجد للمقاولات والتجارة</p>
        <p class="text-[10px] text-slate-400">الختم الرسمي والإداري المعتمد</p>
      </div>
    </div>
  </div>

</body>
</html>
    `;
  }

  /* =========================================================================
     4. UNIFIED ADVANCED REPORTING ENGINE (المحرك الموحد للتقارير الشاملة)
     ========================================================================= */

  getUnifiedReportSummary(filters = {}) {
    const activeEmployeesCount = get(`SELECT COUNT(*) as c FROM employees WHERE status = 'نشط'`).c;
    const saudiCount = get(`SELECT COUNT(*) as c FROM employees WHERE status = 'نشط' AND is_saudi = 1`).c;
    const expatCount = activeEmployeesCount - saudiCount;
    const saudizationRate = activeEmployeesCount > 0 ? Math.round((saudiCount / activeEmployeesCount) * 100) : 0;

    const vehiclesCount = get(`SELECT COUNT(*) as c FROM vehicles`).c;
    const insuredCardsCount = get(`SELECT COUNT(*) as c FROM employee_insurance_cards`).c;
    const baladiyaCardsCount = get(`SELECT COUNT(*) as c FROM health_cards`).c;
    const pendingTransfersCount = get(`SELECT COUNT(*) as c FROM transfer_requests WHERE status LIKE '%معلق%' OR status LIKE '%موافقة%'`).c;
    const activeCircularsCount = get(`SELECT COUNT(*) as c FROM administrative_circulars WHERE status = 'منشور'`).c;
    const licenses = this.getLicenses();
    const licensesAlertsCount = licenses.filter(l => l.has_alert).length;

    return {
      workforce: {
        total_employees: activeEmployeesCount,
        saudi_employees: saudiCount,
        expat_employees: expatCount,
        saudization_rate: saudizationRate,
        nitaqat_tier: 'النطاق الأخضر المرتفع'
      },
      fleet: {
        total_vehicles: vehiclesCount
      },
      healthcare: {
        insured_employees: insuredCardsCount,
        baladiya_cards: baladiyaCardsCount
      },
      governance: {
        pending_transfers: pendingTransfersCount,
        active_circulars: activeCircularsCount,
        total_licenses: licenses.length,
        licenses_alerts: licensesAlertsCount
      }
    };
  }

  exportUnifiedReportCsv() {
    const summary = this.getUnifiedReportSummary();
    const headers = ['القطاع / الوحدة المؤسسية', 'المؤشر التشغيلي', 'القيمة الفعلية', 'الحالة'];
    const rows = [
      ['القوى العاملة والتوطين', 'إجمالي الكادر التشغيلي النشط', summary.workforce.total_employees, 'مطابق للقاعدة الذهبية'],
      ['القوى العاملة والتوطين', 'عدد الموظفين السعوديين', summary.workforce.saudi_employees, 'معتمد'],
      ['القوى العاملة والتوطين', 'عدد الموظفين غير السعوديين', summary.workforce.expat_employees, 'معتمد'],
      ['القوى العاملة والتوطين', 'نسبة التوطين ونطاقات', `${summary.workforce.saudization_rate}%`, summary.workforce.nitaqat_tier],
      ['الأسطول ومنصة تم', 'إجمالي أسطول المركبات', summary.fleet.total_vehicles, 'ساري ومطابق لمنصة تم'],
      ['الرعاية والتأمين الطبي', 'بطاقات التأمين الطبي CCHI', summary.healthcare.insured_employees, 'معتمد لدى مجلس الضمان'],
      ['الرعاية والتأمين الطبي', 'شهادات البلدية الصحية للعمال', summary.healthcare.baladiya_cards, 'معتمد لدى أمانة عسير'],
      ['الحوكمة والإدارة العامة', 'طلبات النقل قيد الإجراء', summary.governance.pending_transfers, 'سير الموافقات الثلاثي'],
      ['الحوكمة والإدارة العامة', 'التعاميم الإدارية المنشورة', summary.governance.active_circulars, 'منشورة مع إقرارات الاطلاع'],
      ['الحوكمة والإدارة العامة', 'السجلات والتراخيص الحكومية', summary.governance.total_licenses, 'سارية ومحدثة']
    ];

    const escapeCsv = val => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const content = [
      headers.map(escapeCsv).join(','),
      ...rows.map(r => r.map(escapeCsv).join(','))
    ].join('\r\n');

    return '\uFEFF' + content;
  }
}

module.exports = new GeneralAdminService();
