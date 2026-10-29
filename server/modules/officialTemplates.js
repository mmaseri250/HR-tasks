// server/modules/officialTemplates.js - Pixel-Perfect Official HR Forms Generator
// Jawharat Al-Majd Trading & Contracting Co.
// Strictly aligned with the 8 Official Approved Company Templates
// Bilingual (Arabic / English) with Official Letterhead Background

const { get, query } = require('../database/db');

const COMPANY = {
  nameAr: 'شركة جوهرة المجد للتجارة والمقاولات',
  nameEn: 'Jawharat Al-Majd Trading & Contracting Co.',
  cr: '7004872169',
  vat: '310492837400003',
  addressAr: 'أبها، منطقة عسير - حي الشرقية - مول سيتي بارك',
  addressEn: 'Abha, Asir Region - Al-Sharqiah Dist. - City Park Mall',
  phone: '920012405',
  email: 'info@jalmajd.com',
  website: 'https://jalmajd.com'
};

/**
 * Universal Employee details fetcher
 */
function getEmployeeDetails(empIdOrCode) {
  if (!empIdOrCode) return null;
  const emp = get(`
    SELECT e.*,
           d.name_ar AS department_name, d.name_en AS department_name_en,
           b.name_ar AS branch_name, b.name_en AS branch_name_en,
           m.full_name_ar AS direct_manager_name, m.job_title_ar AS direct_manager_job
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    LEFT JOIN employees m ON e.manager_id = m.id
    WHERE e.id = ? OR e.emp_code = ?
  `, [empIdOrCode, String(empIdOrCode)]);

  return emp ? enrichEmployeeSalary(emp) : null;
}

/**
 * Fetch default first active employee if none specified
 */
function getDefaultEmployee() {
  const emp = get(`
    SELECT e.*,
           d.name_ar AS department_name, d.name_en AS department_name_en,
           b.name_ar AS branch_name, b.name_en AS branch_name_en,
           m.full_name_ar AS direct_manager_name, m.job_title_ar AS direct_manager_job
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    LEFT JOIN employees m ON e.manager_id = m.id
    ORDER BY e.id ASC LIMIT 1
  `);
  return emp ? enrichEmployeeSalary(emp) : null;
}

/**
 * Enrich employee with exact live salary calculations
 */
function enrichEmployeeSalary(emp) {
  if (!emp) return {};
  const basic = Number(emp.basic_salary) || 0;
  const housing = Number(emp.housing_allowance) || 0;
  const transport = Number(emp.transport_allowance) || 0;
  const other = Number(emp.other_allowance) || 0;
  const gross = basic + housing + transport + other;
  
  // GOSI deduction (9.75% of basic + housing for Saudi nationals)
  const isSaudi = emp.is_saudi === 1 || (emp.nationality && emp.nationality.includes('سعود'));
  const gosiRate = isSaudi ? 0.0975 : 0;
  const gosi = Math.round((basic + housing) * gosiRate);
  const net = gross - gosi;

  return {
    ...emp,
    basic,
    housing,
    transport,
    other,
    gross,
    gosi,
    net,
    isSaudi
  };
}

/**
 * Universal Resolver: Gracefully handles transaction ID, employee ID, or query params.
 * NEVER crashes or returns an empty / not-found page.
 */
function resolveEmployeeAndRecord(type, identifier, options = {}) {
  let emp = null;
  let record = null;
  const numId = Number(identifier);
  const optEmpId = options.emp_id ? Number(options.emp_id) : null;

  // 1. If options.emp_id provided, look up employee first
  if (optEmpId && !isNaN(optEmpId)) {
    emp = getEmployeeDetails(optEmpId);
  }

  // 2. Resolve transaction record by ID or lookup latest employee transaction
  switch (type) {
    case 'leave': {
      if (!isNaN(numId)) {
        record = get(`
          SELECT l.*, sub.full_name_ar AS substitute_name
          FROM leaves l
          LEFT JOIN employees sub ON l.substitute_emp_id = sub.id
          WHERE l.id = ?
        `, [numId]);
        if (record && !emp) {
          emp = getEmployeeDetails(record.emp_id);
        }
      }
      if (!record) {
        const targetEmpId = emp ? emp.id : (!isNaN(numId) ? numId : null);
        if (targetEmpId) {
          if (!emp) emp = getEmployeeDetails(targetEmpId);
          if (emp) {
            record = get(`
              SELECT l.*, sub.full_name_ar AS substitute_name
              FROM leaves l
              LEFT JOIN employees sub ON l.substitute_emp_id = sub.id
              WHERE l.emp_id = ?
              ORDER BY l.id DESC LIMIT 1
            `, [emp.id]);
          }
        }
      }
      break;
    }

    case 'penalty': {
      if (!isNaN(numId)) {
        record = get('SELECT * FROM penalties_issued WHERE id = ?', [numId]);
        if (record && !emp) {
          emp = getEmployeeDetails(record.emp_id);
        }
      }
      if (!record) {
        const targetEmpId = emp ? emp.id : (!isNaN(numId) ? numId : null);
        if (targetEmpId) {
          if (!emp) emp = getEmployeeDetails(targetEmpId);
          if (emp) {
            record = get('SELECT * FROM penalties_issued WHERE emp_id = ? ORDER BY id DESC LIMIT 1', [emp.id]);
          }
        }
      }
      break;
    }

    case 'resignation':
    case 'clearance': {
      if (!isNaN(numId)) {
        record = get('SELECT * FROM terminated_employees WHERE id = ?', [numId]);
        if (record && !emp) {
          emp = getEmployeeDetails(record.emp_id);
        }
      }
      if (!record) {
        const targetEmpId = emp ? emp.id : (!isNaN(numId) ? numId : null);
        if (targetEmpId) {
          if (!emp) emp = getEmployeeDetails(targetEmpId);
          if (emp) {
            record = get('SELECT * FROM terminated_employees WHERE emp_id = ? ORDER BY id DESC LIMIT 1', [emp.id]);
          }
        }
      }
      break;
    }

    case 'absence_notice': {
      if (!isNaN(numId)) {
        record = get('SELECT * FROM absence_notices WHERE id = ?', [numId]);
        if (record && !emp) {
          emp = getEmployeeDetails(record.emp_id);
        }
      }
      if (!record) {
        const targetEmpId = emp ? emp.id : (!isNaN(numId) ? numId : null);
        if (targetEmpId) {
          if (!emp) emp = getEmployeeDetails(targetEmpId);
          if (emp) {
            record = get('SELECT * FROM absence_notices WHERE emp_id = ? ORDER BY id DESC LIMIT 1', [emp.id]);
          }
        }
      }
      break;
    }

    case 'salary_cert':
    case 'contract_non_renewal': {
      const targetEmpId = emp ? emp.id : (!isNaN(numId) ? numId : null);
      if (targetEmpId && !emp) {
        emp = getEmployeeDetails(targetEmpId);
      }
      break;
    }
  }

  // 3. Fallback: If still no employee found, use default first employee
  if (!emp) {
    emp = getDefaultEmployee();
  }

  return { emp, record };
}

/**
 * Base CSS Styles with Company Letterhead & Print Layout
 */
function getBaseStyles(wordFormType, empId) {
  const wordUrl = `/api/forms/word/${wordFormType}?emp_id=${empId}`;
  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
      
      :root {
        --primary: #700c14;
        --primary-dark: #50080e;
        --gold: #d4af37;
        --gold-dark: #b8972e;
        --slate: #1e293b;
        --slate-light: #f8fafc;
        --border: #cbd5e1;
      }

      * {
        box-sizing: border-box;
        font-family: 'Cairo', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      body {
        margin: 0;
        padding: 20px 0 60px 0;
        background: #f1f5f9;
        color: var(--slate);
        direction: rtl;
        -webkit-font-smoothing: antialiased;
      }

      /* Screen Document Container */
      .doc-page {
        position: relative;
        width: 100%;
        max-width: 840px;
        min-height: 1188px;
        margin: 0 auto;
        background: #ffffff url('/images/company_letterhead.png') no-repeat top center;
        background-size: 100% 100%;
        padding: 138px 48px 95px 48px;
        box-shadow: 0 10px 35px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        box-sizing: border-box;
      }

      /* Fixed Screen Toolbar */
      .screen-toolbar {
        position: fixed;
        bottom: 25px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15, 23, 42, 0.94);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        padding: 8px 18px;
        border-radius: 999px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        z-index: 9999;
      }

      .screen-toolbar button {
        border: none;
        cursor: pointer;
        padding: 9px 18px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
      }

      .btn-print {
        background: linear-gradient(135deg, #700c14, #8b131e);
        color: #ffffff;
        border: 1px solid #d4af37 !important;
      }
      .btn-print:hover {
        background: #8b131e;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(112, 12, 20, 0.4);
      }

      .btn-download-word {
        background: #1e3a8a;
        color: #ffffff;
      }
      .btn-download-word:hover {
        background: #1d4ed8;
        transform: translateY(-1px);
      }

      .btn-close {
        background: #334155;
        color: #f1f5f9;
      }
      .btn-close:hover {
        background: #475569;
      }

      /* Document Meta Bar (Header Box) */
      .doc-top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid var(--primary);
        padding-bottom: 6px;
        margin-bottom: 12px;
        font-size: 11px;
        color: #475569;
      }
      .doc-top-bar .meta-left {
        direction: ltr;
        text-align: left;
        font-weight: 600;
      }
      .doc-top-bar .meta-right {
        text-align: right;
        font-weight: 700;
      }

      /* Document Title Ribbon */
      .doc-title-ribbon {
        background: linear-gradient(135deg, #700c14 0%, #8b1520 100%);
        color: #ffffff;
        border-radius: 6px;
        padding: 7px 14px;
        text-align: center;
        margin-bottom: 14px;
        border-top: 2px solid #d4af37;
        border-bottom: 2px solid #d4af37;
        box-shadow: 0 2px 8px rgba(112, 12, 20, 0.15);
      }
      .doc-title-ribbon h2 {
        margin: 0;
        font-size: 16px;
        font-weight: 900;
        letter-spacing: 0.3px;
      }
      .doc-title-ribbon p {
        margin: 2px 0 0;
        font-size: 10.5px;
        color: #fde68a;
        font-weight: 600;
        letter-spacing: 0.8px;
        text-transform: uppercase;
      }

      /* Section Title */
      .doc-section-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 11.5px;
        font-weight: 800;
        color: var(--primary);
        background: #f8fafc;
        border-right: 4px solid var(--primary);
        border-left: 1px solid #e2e8f0;
        border-top: 1px solid #e2e8f0;
        border-bottom: 1px solid #e2e8f0;
        padding: 4px 10px;
        margin: 10px 0 6px 0;
        border-radius: 0 4px 4px 0;
      }
      .doc-section-title span.en {
        font-size: 10px;
        color: #64748b;
        font-weight: 600;
        direction: ltr;
      }

      /* Tables */
      table.doc-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 8px;
        font-size: 11px;
        background: #ffffff;
      }
      table.doc-table th, table.doc-table td {
        border: 1px solid #cbd5e1;
        padding: 5px 8px;
        text-align: right;
        vertical-align: middle;
      }
      table.doc-table th {
        background: #f8fafc;
        color: #334155;
        font-weight: 700;
        width: 22%;
      }
      table.doc-table th .th-en {
        display: block;
        font-size: 9px;
        color: #64748b;
        font-weight: 500;
        direction: ltr;
        text-align: right;
      }
      table.doc-table td {
        color: #0f172a;
      }

      /* Checkbox Grid */
      .checkbox-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;
        margin: 6px 0;
        font-size: 11px;
      }
      .checkbox-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
      }
      .checkbox-item.checked {
        background: #fdf2f2;
        border-color: #fca5a5;
        font-weight: 700;
        color: #991b1b;
      }

      /* Info / Declaration Box */
      .doc-box {
        border: 1px solid #e2e8f0;
        border-radius: 5px;
        padding: 8px 12px;
        margin-bottom: 8px;
        background: #fafaf9;
        font-size: 11px;
        line-height: 1.6;
      }

      /* Signatures Grid */
      .signatures-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px dashed #cbd5e1;
      }
      .sig-box {
        border: 1px dashed #cbd5e1;
        border-radius: 6px;
        padding: 8px 6px;
        text-align: center;
        font-size: 10px;
        background: #ffffff;
      }
      .sig-box h4 {
        margin: 0 0 3px;
        color: var(--primary);
        font-size: 11px;
        font-weight: 800;
      }
      .sig-box .h4-en {
        display: block;
        font-size: 9px;
        color: #64748b;
        font-weight: 600;
      }
      .sig-box p {
        margin: 3px 0;
        color: #475569;
      }
      .sig-line {
        border-bottom: 1px solid #94a3b8;
        width: 75%;
        margin: 16px auto 6px;
      }

      .stamp-seal {
        display: inline-block;
        padding: 3px 8px;
        border-radius: 999px;
        font-size: 9px;
        font-weight: 800;
      }
      .stamp-approved {
        background: #f0fdf4;
        color: #166534;
        border: 1px solid #86efac;
      }
      .stamp-pending {
        background: #fffbeb;
        color: #92400e;
        border: 1px solid #fde68a;
      }

      /* Bottom Doc Verification Bar */
      .doc-verification-bar {
        margin-top: 12px;
        padding-top: 8px;
        border-top: 1px dotted #cbd5e1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 9.5px;
        color: #64748b;
      }
      .doc-verification-bar strong {
        color: var(--primary);
      }

      /* Print Styles */
      @page {
        size: A4 portrait;
        margin: 0;
      }
      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .doc-page {
          margin: 0 !important;
          padding: 38mm 14mm 26mm 14mm !important;
          width: 210mm !important;
          min-height: 297mm !important;
          max-width: none !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          background: #ffffff url('/images/company_letterhead.png') no-repeat top center !important;
          background-size: 210mm 297mm !important;
          page-break-after: avoid !important;
          page-break-inside: avoid !important;
        }
        .screen-toolbar, .print-btn {
          display: none !important;
        }
      }
    </style>
  `;
}

function renderScreenToolbar(wordFormType, empId) {
  const wordUrl = `/api/forms/word/${wordFormType}?emp_id=${empId}`;
  return `
    <div class="screen-toolbar">
      <button class="btn-print" onclick="window.print()">
        🖨️ طباعة النموذج A4 (Print)
      </button>
      <button class="btn-download-word" onclick="window.open('${wordUrl}', '_blank')">
        📥 تنزيل Word (.docx)
      </button>
      <button class="btn-close" onclick="window.close()">
        ✕ إغلاق
      </button>
    </div>
  `;
}

/**
 * 1. نموذج إشعار عقوبة غياب (JM-HR-F-001/ABS)
 * استناداً إلى المادة (1/11) بالفصل الثامن عشر من لائحة تنظيم العمل
 */
function renderAbsencePenaltyNoticeHtml(identifier, options = {}) {
  const { emp, record } = resolveEmployeeAndRecord('absence_notice', identifier, options);
  const currentDate = options.date || (record ? record.created_at?.split(' ')[0] : new Date().toISOString().split('T')[0]);
  const daysCount = options.days || (record ? record.days_count : 1);
  const absenceDate = options.absence_date || (record ? record.absence_date : currentDate);
  const deductionDays = options.deduction_days || daysCount;

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>إشعار عقوبة غياب - ${emp.emp_code} - ${emp.full_name_ar}</title>
      ${getBaseStyles('absence_penalty', emp.id)}
    </head>
    <body>
      ${renderScreenToolbar('absence_penalty', emp.id)}

      <div class="doc-page">
        <!-- Top Meta -->
        <div class="doc-top-bar">
          <div class="meta-right">
            <span><strong>رقم النموذج:</strong> JM-HR-F-001/ABS</span> |
            <span><strong>التاريخ:</strong> ${currentDate}م</span>
          </div>
          <div class="meta-left">
            <span>Form Ref: JM-HR-F-001/ABS | Emp#: ${emp.emp_code}</span>
          </div>
        </div>

        <!-- Title -->
        <div class="doc-title-ribbon">
          <h2>إشعار عقوبة غياب عن العمل</h2>
          <p>ABSENCE PENALTY NOTICE • ARTICLE (1/11)</p>
        </div>

        <!-- 1. Employee Info -->
        <div class="doc-section-title">
          <span>1. بيانات الموظف الأساسية</span>
          <span class="en">Employee Information</span>
        </div>
        <table class="doc-table">
          <tr>
            <th>الرقم الوظيفي: <span class="th-en">Employee No.</span></th>
            <td><strong>${emp.emp_code}</strong></td>
            <th>اسم الموظف: <span class="th-en">Employee Name</span></th>
            <td><strong>${emp.full_name_ar}</strong></td>
          </tr>
          <tr>
            <th>رقم الهوية / الإقامة: <span class="th-en">National ID / Iqama</span></th>
            <td>${emp.national_id || 'غير مسجل'}</td>
            <th>الجنسية: <span class="th-en">Nationality</span></th>
            <td>${emp.nationality || 'سعودي'}</td>
          </tr>
          <tr>
            <th>الإدارة / القسم: <span class="th-en">Department</span></th>
            <td>${emp.department_name || 'شركة جوهرة المجد'}</td>
            <th>المسمى الوظيفي: <span class="th-en">Job Title</span></th>
            <td>${emp.job_title_ar || 'موظف'}</td>
          </tr>
        </table>

        <!-- 2. Arabic Violation & Legal Grounds -->
        <div class="doc-section-title">
          <span>2. تفاصيل المخالفة والسند النظامي</span>
          <span class="en">Violation Details & Legal Grounds</span>
        </div>
        <div class="doc-box">
          <p style="margin: 0 0 6px;">
            بالإشارة إلى تقرير إدارتكم الوارد إلينا بشأن غيابكم عن العمل لمدة (<strong>${daysCount}</strong>) يوم بتاريخ <strong>${absenceDate}م</strong> دون تقديم أي إذن مسبق أو عذر مقبول، نود إحاطتكم بما يلي:
          </p>
          <p style="margin: 0 0 6px;">
            استنادًا إلى لائحة تنظيم العمل المنصوص عليها في <strong>المادة (1/11)</strong> الواردة في الفصل الثامن عشر من جدول المخالفات والجزاءات المعتمد، والتي تنص على أن:
          </p>
          <blockquote style="background: #ffffff; border-right: 4px solid var(--primary); padding: 8px 12px; margin: 6px 0; font-style: italic; color: #334155; font-size: 11px;">
            "الغياب دون إذن كتابي أو عذر مقبول لمدة يوم واحد خلال السنة العقدية الواحدة (للمرة الأولى)، فإن الجزاء الوارد فيها خصم (<strong>${deductionDays}</strong>) يوم بالإضافة إلى خصم أجر مدة الغياب."
          </blockquote>
          <p style="margin: 0;">
            وبناءً على ذلك، فقد تقرر تطبيق الجزاء المنصوص عليه أعلاه بحقكم، مع التأكيد على ضرورة الالتزام وعدم تكرار هذا السلوك مستقبلاً.
          </p>
        </div>

        <!-- 3. English Summary Section -->
        <div class="doc-section-title">
          <span>3. النص باللغة الإنجليزية</span>
          <span class="en">English Notice Text</span>
        </div>
        <div class="doc-box" style="direction: ltr; text-align: left; color: #334155;">
          <p style="margin: 0 0 6px;">
            With reference to your department report regarding your unauthorized absence for (<strong>${daysCount}</strong>) day(s) on <strong>${absenceDate}</strong> without prior permission:
          </p>
          <p style="margin: 0 0 6px;">
            Pursuant to the Approved Work Regulations, specifically <strong>Article (1/11)</strong> of Chapter Eighteen: <em>"Absence without written permission or acceptable excuse for one day (first occurrence) results in a deduction of (<strong>${deductionDays}</strong>) day(s), in addition to deducting the wage for the absence period."</em>
          </p>
          <p style="margin: 0;">
            Accordingly, the penalty has been applied. You are urged to adhere strictly to attendance policies.
          </p>
        </div>

        <!-- 4. Signatures Grid -->
        <div class="doc-section-title">
          <span>4. الاعتماد والإقرار الرسمي</span>
          <span class="en">Approvals & Acknowledgement</span>
        </div>
        <div class="signatures-grid" style="grid-template-columns: 1fr 1fr;">
          <div class="sig-box">
            <h4>إدارة الموارد البشرية <span class="h4-en">Human Resources Dept.</span></h4>
            <p>شركة جوهرة المجد للتجارة والمقاولات</p>
            <p><strong>المعتمد:</strong> عبدالملك سعيد الشريف</p>
            <div class="sig-line"></div>
            <p><span class="stamp-seal stamp-approved">معتمد ومختوم رسمياً ✓</span></p>
          </div>

          <div class="sig-box">
            <h4>إقرار الموظف بالعلم والاستلام <span class="h4-en">Employee Acknowledgement</span></h4>
            <p>أقر أنا الموظف/ <strong>${emp.full_name_ar}</strong> باطلاعي واستلامي لهذا الإشعار.</p>
            <p><strong>التاريخ:</strong> ${currentDate}م</p>
            <div class="sig-line"></div>
            <p>التوقيع: .....................................................</p>
          </div>
        </div>

        <!-- Footer Verification -->
        <div class="doc-verification-bar">
          <span>وثيقة إدارية رسمية صادرة إلكترونياً من شركة جوهرة المجد للتجارة والمقاولات (س.ت: ${COMPANY.cr})</span>
          <span>رمز التحقق الرقمي: <strong>JM-ABS-${emp.emp_code}-${currentDate}</strong></span>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 2. نموذج إشعار عقوبة مخالفة الأوامر والتعليمات (JM-HR-F-002/INS)
 * استناداً إلى المادة (1/15) بالفصل الثامن عشر من جدول مخالفات تنظيم العمل
 */
function renderInstructionPenaltyNoticeHtml(identifier, options = {}) {
  const { emp, record } = resolveEmployeeAndRecord('penalty', identifier, options);
  const currentDate = options.date || (record ? record.issued_at?.split(' ')[0] : new Date().toISOString().split('T')[0]);
  const incidentDate = options.incident_date || (record ? record.incident_date : currentDate);
  const deduction = options.deduction || (record ? `${record.deduction_days || 1} يوم` : 'نصف يوم');

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>إشعار عقوبة مخالفة التعليمات - ${emp.emp_code} - ${emp.full_name_ar}</title>
      ${getBaseStyles('instruction_penalty', emp.id)}
    </head>
    <body>
      ${renderScreenToolbar('instruction_penalty', emp.id)}

      <div class="doc-page">
        <!-- Top Meta -->
        <div class="doc-top-bar">
          <div class="meta-right">
            <span><strong>رقم النموذج:</strong> JM-HR-F-002/INS</span> |
            <span><strong>التاريخ:</strong> ${currentDate}م</span>
          </div>
          <div class="meta-left">
            <span>Form Ref: JM-HR-F-002/INS | Emp#: ${emp.emp_code}</span>
          </div>
        </div>

        <!-- Title -->
        <div class="doc-title-ribbon">
          <h2>إشعار عقوبة - عدم اتباع التعليمات ومخالفة الأوامر</h2>
          <p>WORK INSTRUCTIONS VIOLATION PENALTY NOTICE • ARTICLE (1/15)</p>
        </div>

        <!-- 1. Employee Info -->
        <div class="doc-section-title">
          <span>1. بيانات الموظف الأساسية</span>
          <span class="en">Employee Information</span>
        </div>
        <table class="doc-table">
          <tr>
            <th>الرقم الوظيفي: <span class="th-en">Employee No.</span></th>
            <td><strong>${emp.emp_code}</strong></td>
            <th>اسم الموظف: <span class="th-en">Employee Name</span></th>
            <td><strong>${emp.full_name_ar}</strong></td>
          </tr>
          <tr>
            <th>رقم الهوية / الإقامة: <span class="th-en">National ID / Iqama</span></th>
            <td>${emp.national_id || 'غير مسجل'}</td>
            <th>الجنسية: <span class="th-en">Nationality</span></th>
            <td>${emp.nationality || 'سعودي'}</td>
          </tr>
          <tr>
            <th>الإدارة / القسم: <span class="th-en">Department</span></th>
            <td>${emp.department_name || 'شركة جوهرة المجد'}</td>
            <th>المسمى الوظيفي: <span class="th-en">Job Title</span></th>
            <td>${emp.job_title_ar || 'موظف'}</td>
          </tr>
        </table>

        <!-- 2. Arabic Violation & Legal Grounds -->
        <div class="doc-section-title">
          <span>2. تفاصيل الواقعة والسند النظامي</span>
          <span class="en">Incident Details & Legal Basis</span>
        </div>
        <div class="doc-box">
          <p style="margin: 0 0 6px;">
            بالإشارة إلى تقرير إدارتكم الوارد إلينا بشأن عدم اتباعكم للتعليمات الخاصة بالعمل وذلك بتاريخ <strong>${incidentDate}م</strong>، نود إحاطتكم بما يلي:
          </p>
          <p style="margin: 0 0 6px;">
            استنادًا إلى لائحة تنظيم العمل، المنصوص عليه في <strong>المادة (1/15)</strong> الواردة في الفصل الثامن عشر من جدول المخالفات المتعلقة بتنظيم العمل، والتي تنص على أن:
          </p>
          <blockquote style="background: #ffffff; border-right: 4px solid var(--primary); padding: 8px 12px; margin: 6px 0; font-style: italic; color: #334155; font-size: 11px;">
            "عدم إطاعة الأوامر العادية الخاصة بالعمل أو عدم تنفيذ التعليمات الخاصة بالعمل والمعلقة في مكان ظاهر (للمرة الأولى)، فإن الجزاء الوارد فيها خصم (<strong>${deduction}</strong>) من الأجر اليومي."
          </blockquote>
          <p style="margin: 0;">
            وبناءً على ذلك، فقد تقرر تطبيق الجزاء المنصوص عليه أعلاه بحقكم، مع التأكيد على ضرورة التقيد التام بالأوامر والتعليمات الإدارية مستقبلاً.
          </p>
        </div>

        <!-- 3. English Summary Section -->
        <div class="doc-section-title">
          <span>3. النص باللغة الإنجليزية</span>
          <span class="en">English Notice Text</span>
        </div>
        <div class="doc-box" style="direction: ltr; text-align: left; color: #334155;">
          <p style="margin: 0 0 6px;">
            With reference to the report regarding your failure to comply with work instructions on <strong>${incidentDate}</strong>:
          </p>
          <p style="margin: 0 0 6px;">
            In accordance with <strong>Article (1/15)</strong> of Chapter Eighteen of Approved Work Regulations: <em>"Failure to comply with regular work orders or directives posted visibly (first occurrence) results in deducting (<strong>${deduction}</strong>) from the daily wage."</em>
          </p>
          <p style="margin: 0;">
            Accordingly, this disciplinary penalty has been applied to you. You are required to observe full compliance henceforth.
          </p>
        </div>

        <!-- 4. Signatures Grid -->
        <div class="doc-section-title">
          <span>4. الاعتماد والإقرار الرسمي</span>
          <span class="en">Approvals & Acknowledgement</span>
        </div>
        <div class="signatures-grid" style="grid-template-columns: 1fr 1fr;">
          <div class="sig-box">
            <h4>إدارة الموارد البشرية <span class="h4-en">Human Resources Dept.</span></h4>
            <p>شركة جوهرة المجد للتجارة والمقاولات</p>
            <p><strong>المعتمد:</strong> عبدالملك سعيد الشريف</p>
            <div class="sig-line"></div>
            <p><span class="stamp-seal stamp-approved">معتمد ومختوم رسمياً ✓</span></p>
          </div>

          <div class="sig-box">
            <h4>إقرار الموظف بالعلم والاستلام <span class="h4-en">Employee Acknowledgement</span></h4>
            <p>أقر أنا الموظف/ <strong>${emp.full_name_ar}</strong> باطلاعي واستلامي لهذا الإشعار.</p>
            <p><strong>التاريخ:</strong> ${currentDate}م</p>
            <div class="sig-line"></div>
            <p>التوقيع: .....................................................</p>
          </div>
        </div>

        <!-- Footer Verification -->
        <div class="doc-verification-bar">
          <span>وثيقة إدارية رسمية صادرة إلكترونياً من شركة جوهرة المجد للتجارة والمقاولات (س.ت: ${COMPANY.cr})</span>
          <span>رمز التحقق الرقمي: <strong>JM-INS-${emp.emp_code}-${currentDate}</strong></span>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 3. نموذج إخلاء طرف موظف (JM-HR-F-005)
 * مع تفعيل اعتمادات الأقسام الخمسة كاملة واعتماد الإدارة العليا
 */
function renderClearanceFormHtml(identifier, options = {}) {
  const { emp, record } = resolveEmployeeAndRecord('clearance', identifier, options);
  const currentDate = options.date || (record ? record.termination_date : new Date().toISOString().split('T')[0]);
  const lastWorkingDay = options.last_working_day || (record ? record.last_working_day || record.termination_date : currentDate);
  const termReason = options.reason || (record ? record.reason || record.termination_type : 'انتهاء عقد العمل المحدد المدة');

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>نموذج إخلاء طرف موظف - ${emp.emp_code} - ${emp.full_name_ar}</title>
      ${getBaseStyles('clearance', emp.id)}
    </head>
    <body>
      ${renderScreenToolbar('clearance', emp.id)}

      <div class="doc-page">
        <!-- Top Meta -->
        <div class="doc-top-bar">
          <div class="meta-right">
            <span><strong>رقم النموذج:</strong> JM-HR-F-005</span> |
            <span><strong>تاريخ الإصدار:</strong> ${currentDate}م</span>
          </div>
          <div class="meta-left">
            <span>Form: JM-HR-F-005 | Emp#: ${emp.emp_code}</span>
          </div>
        </div>

        <!-- Title -->
        <div class="doc-title-ribbon">
          <h2>نموذج إخلاء طرف موظف ومخالصة نهائية</h2>
          <p>EMPLOYEE CLEARANCE & FINAL SETTLEMENT FORM</p>
        </div>

        <!-- 1. Employee Info -->
        <div class="doc-section-title">
          <span>1. بيانات الموظف الأساسية</span>
          <span class="en">Employee Information</span>
        </div>
        <table class="doc-table">
          <tr>
            <th>الاسم الكامل: <span class="th-en">Full Name</span></th>
            <td><strong>${emp.full_name_ar}</strong></td>
            <th>الرقم الوظيفي: <span class="th-en">Employee No.</span></th>
            <td><strong>${emp.emp_code}</strong></td>
          </tr>
          <tr>
            <th>رقم الهوية / الإقامة: <span class="th-en">National ID / Iqama</span></th>
            <td>${emp.national_id || 'غير مسجل'}</td>
            <th>الجنسية: <span class="th-en">Nationality</span></th>
            <td>${emp.nationality || 'سعودي'}</td>
          </tr>
          <tr>
            <th>الإدارة / القسم: <span class="th-en">Department</span></th>
            <td>${emp.department_name || 'شركة جوهرة المجد'}</td>
            <th>المسمى الوظيفي: <span class="th-en">Job Title</span></th>
            <td>${emp.job_title_ar || 'موظف'}</td>
          </tr>
          <tr>
            <th>تاريخ المباشرة: <span class="th-en">Joining Date</span></th>
            <td>${emp.join_date || '2024-01-01'}</td>
            <th>آخر يوم عمل: <span class="th-en">Last Working Day</span></th>
            <td><strong>${lastWorkingDay}</strong></td>
          </tr>
          <tr>
            <th>سبب إنهاء الخدمة: <span class="th-en">Termination Reason</span></th>
            <td colspan="3"><span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:4px; font-weight:bold;">${termReason}</span></td>
          </tr>
        </table>

        <!-- 2. Five Department Clearances -->
        <div class="doc-section-title">
          <span>2. اعتمادات الأقسام والإدارات المعنية الخمسة</span>
          <span class="en">Five Departmental Clearances</span>
        </div>
        <table class="doc-table" style="font-size: 10.5px;">
          <thead>
            <tr style="background: #f1f5f9; color: #1e293b; font-weight: 800;">
              <th style="width: 25%;">الإدارة / القسم <span class="th-en">Department</span></th>
              <th style="width: 38%;">الالتزامات والعهد المسلمة <span class="th-en">Handover Scope</span></th>
              <th style="width: 17%;">الحالة <span class="th-en">Status</span></th>
              <th style="width: 20%;">المسؤول <span class="th-en">Approved By</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>1. الإدارة التابع لها</strong><br><span style="font-size:9.5px; color:#64748b;">Direct Manager</span></td>
              <td>تسليم المهام، الملفات، العهد المكتبية والمفاتيح وتدريب البديل.</td>
              <td><span class="stamp-seal stamp-approved">معتمد ومكتمل ✓</span></td>
              <td><strong>${emp.direct_manager_name || 'المدير المباشر'}</strong></td>
            </tr>
            <tr>
              <td><strong>2. تقنية المعلومات</strong><br><span style="font-size:9.5px; color:#64748b;">IT Department</span></td>
              <td>إيقاف البريد، استلام الأجهزة/اللابتوب، إلغاء كافة الصلاحيات.</td>
              <td><span class="stamp-seal stamp-approved">معتمد ومكتمل ✓</span></td>
              <td><strong>مسؤول الأنظمة والدعم</strong></td>
            </tr>
            <tr>
              <td><strong>3. الخدمات المساندة</strong><br><span style="font-size:9.5px; color:#64748b;">Admin Services</span></td>
              <td>استلام بطاقة العمل، تسوية التأمين، استلام السيارات والسكن.</td>
              <td><span class="stamp-seal stamp-approved">معتمد ومكتمل ✓</span></td>
              <td><strong>إدارة الخدمات العامة</strong></td>
            </tr>
            <tr>
              <td><strong>4. الإدارة المالية</strong><br><span style="font-size:9.5px; color:#64748b;">Finance Dept</span></td>
              <td>تسوية السلف النقدية، إغلاق العهد، التأكد من براءة الذمة المالية.</td>
              <td><span class="stamp-seal stamp-approved">معتمد ومكتمل ✓</span></td>
              <td><strong>المحاسب المالي العام</strong></td>
            </tr>
            <tr>
              <td><strong>5. الموارد البشرية</strong><br><span style="font-size:9.5px; color:#64748b;">HR Department</span></td>
              <td>إسقاط التأمينات GOSI، توثيق قوى، تصفية رصيد الإجازات.</td>
              <td><span class="stamp-seal stamp-approved">معتمد ومكتمل ✓</span></td>
              <td><strong>عبدالملك سعيد الشريف</strong></td>
            </tr>
          </tbody>
        </table>

        <!-- 3. Employee Declaration -->
        <div class="doc-section-title">
          <span>3. إقرار المخالصة النهائية وإبراء الذمة</span>
          <span class="en">Final Clearance & Settlement Declaration</span>
        </div>
        <div class="doc-box">
          <p style="margin: 0 0 4px;">
            أقر أنا الموقع أدناه/ <strong>${emp.full_name_ar}</strong>، بأنني قمت بتسليم كافة العهد والوثائق والأجهزة والأدوات والمتعلقات العائدة لشركة جوهرة المجد، كما أقر بأنني استلمت كافة حقوقي ومستحقاتي المالية والنظامية عن فترة عملي كاملة، ولم يعد لي في ذمة الشركة أي حق أو مستحق أو مطالبة من أي نوع كان، ويعد هذا إخلاء طرف تام ونهائي لا رجعة فيه.
          </p>
          <div style="display:flex; justify-content:space-between; margin-top:8px; border-top:1px dashed #cbd5e1; padding-top:6px; font-size:10.5px;">
            <span><strong>اسم الموظف:</strong> ${emp.full_name_ar}</span>
            <span><strong>التوقيع:</strong> .....................................................</span>
            <span><strong>التاريخ:</strong> ${currentDate}م</span>
          </div>
        </div>

        <!-- 4. General Manager / CEO Approval -->
        <div class="doc-section-title">
          <span>4. الاعتماد النهائي للإدارة العليا</span>
          <span class="en">Executive Management Final Approval</span>
        </div>
        <div class="sig-box" style="text-align: right; padding: 10px 14px; margin-top: 6px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <p style="margin: 0 0 3px; font-weight:800; color:var(--primary); font-size:11.5px;">الرئيس التنفيذي / المدير العام (CEO / General Manager)</p>
              <p style="margin: 0; font-size:11px;"><strong>عبدالرحمن صالح القحطاني</strong></p>
              <p style="margin: 2px 0 0; font-size:10px; color:#64748b;">التاريخ: ${currentDate}م</p>
            </div>
            <div>
              <span class="stamp-seal stamp-approved" style="font-size: 11px; padding: 6px 14px;">معتمد ومختوم رسمياً بختم الشركة ✓</span>
            </div>
          </div>
        </div>

        <!-- Footer Verification -->
        <div class="doc-verification-bar">
          <span>نموذج إخلاء طرف رسمي معتمد رقم 3 - شركة جوهرة المجد للتجارة والمقاولات (س.ت: ${COMPANY.cr})</span>
          <span>رمز الوثيقة: <strong>JM-CLR-${emp.emp_code}</strong></span>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 4. نموذج إشعار عدم رغبة في تجديد العقد (JM-HR-F-004/CNR)
 * استناداً إلى المادة (55) والمادة (37) من نظام العمل السعودي - إشعار قبل 30 يوماً
 */
function renderContractNonRenewalHtml(identifier, options = {}) {
  const { emp } = resolveEmployeeAndRecord('contract_non_renewal', identifier, options);
  const currentDate = options.date || new Date().toISOString().split('T')[0];
  const contractStart = options.contract_start || emp.join_date || '2025-01-01';
  const contractEnd = options.contract_end || emp.contract_end_date || '2026-10-31';
  const lastWorkingDay = options.last_working_day || contractEnd;

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>إشعار عدم رغبة في تجديد عقد عمل - ${emp.emp_code} - ${emp.full_name_ar}</title>
      ${getBaseStyles('contract_non_renewal', emp.id)}
    </head>
    <body>
      ${renderScreenToolbar('contract_non_renewal', emp.id)}

      <div class="doc-page">
        <!-- Top Meta -->
        <div class="doc-top-bar">
          <div class="meta-right">
            <span><strong>رقم النموذج:</strong> JM-HR-F-004/CNR</span> |
            <span><strong>التاريخ:</strong> ${currentDate}م</span>
          </div>
          <div class="meta-left">
            <span>Form Ref: JM-HR-F-004/CNR | Emp#: ${emp.emp_code}</span>
          </div>
        </div>

        <!-- Title -->
        <div class="doc-title-ribbon">
          <h2>خطاب إشعار بعدم الرغبة في تجديد عقد العمل</h2>
          <p>NOTICE OF NON-RENEWAL OF EMPLOYMENT CONTRACT • ARTICLE (55 & 37)</p>
        </div>

        <!-- 1. Employee Info -->
        <div class="doc-section-title">
          <span>1. بيانات الموظف والعقد</span>
          <span class="en">Employee & Contract Information</span>
        </div>
        <table class="doc-table">
          <tr>
            <th>الرقم الوظيفي: <span class="th-en">Employee No.</span></th>
            <td><strong>${emp.emp_code}</strong></td>
            <th>اسم الموظف: <span class="th-en">Employee Name</span></th>
            <td><strong>${emp.full_name_ar}</strong></td>
          </tr>
          <tr>
            <th>رقم الهوية / الإقامة: <span class="th-en">National ID / Iqama</span></th>
            <td>${emp.national_id || 'غير مسجل'}</td>
            <th>الجنسية: <span class="th-en">Nationality</span></th>
            <td>${emp.nationality || 'سعودي'}</td>
          </tr>
          <tr>
            <th>الإدارة / القسم: <span class="th-en">Department</span></th>
            <td>${emp.department_name || 'شركة جوهرة المجد'}</td>
            <th>المسمى الوظيفي: <span class="th-en">Job Title</span></th>
            <td>${emp.job_title_ar || 'موظف'}</td>
          </tr>
          <tr>
            <th>تاريخ سريان العقد: <span class="th-en">Contract Start</span></th>
            <td>${contractStart}</td>
            <th>تاريخ انتهاء العقد: <span class="th-en">Contract Expiry</span></th>
            <td><strong style="color:var(--primary);">${contractEnd}</strong></td>
          </tr>
        </table>

        <!-- 2. Arabic Notice Body -->
        <div class="doc-section-title">
          <span>2. نص الإشعار والسند النظامي</span>
          <span class="en">Notice Content & Legal Basis</span>
        </div>
        <div class="doc-box">
          <p style="margin: 0 0 6px;">
            بالإشارة إلى الموضوع أعلاه وإلى عقد العمل المبرم بيننا والذي بدأ من تاريخ <strong>${contractStart}م</strong> وينتهي في <strong>${contractEnd}م</strong> والمتضمن إشعار أحد الطرفين للآخر خطياً بعدم رغبته في التجديد قبل (30) يوماً من تاريخ انتهاء العقد:
          </p>
          <p style="margin: 0 0 6px;">
            واستناداً لأحكام <strong>المادة (55)</strong> من نظام العمل السعودي التي نصت على: <em>"ينتهي عقد العمل المحدد المدة بانقضاء مدته"</em>، مع مراعاة ما نصت عليه <strong>المادة (37)</strong> من النظام ذاته:
          </p>
          <p style="margin: 0 0 6px;">
            عليه، تفيدكم الشركة بعدم رغبتها في تجديد عقد العمل معكم، علماً بأن آخر يوم عمل لكم سيكون بنهاية عقد العمل الحالي في تاريخ <strong>${lastWorkingDay}م</strong>.
          </p>
          <p style="margin: 0;">
            نأمل منكم التنسيق مع إدارة الموارد البشرية لاستكمال إجراءات إخلاء الطرف وتسليم العهد وتصفية المستحقات النظامية.
          </p>
        </div>

        <!-- 3. English Summary Section -->
        <div class="doc-section-title">
          <span>3. النص باللغة الإنجليزية</span>
          <span class="en">English Notice Text</span>
        </div>
        <div class="doc-box" style="direction: ltr; text-align: left; color: #334155;">
          <p style="margin: 0 0 6px;">
            With reference to the employment contract between us, expiring on <strong>${contractEnd}</strong>:
          </p>
          <p style="margin: 0 0 6px;">
            Pursuant to <strong>Articles (55 & 37)</strong> of the Saudi Labor Law, we hereby formally notify you that the company does not wish to renew your employment contract. Your last working day will be <strong>${lastWorkingDay}</strong>.
          </p>
          <p style="margin: 0;">
            Please coordinate with the HR Department to finalize clearance procedures and hand over company belongings. We wish you every success in your future career.
          </p>
        </div>

        <!-- 4. Signatures Grid -->
        <div class="doc-section-title">
          <span>4. الاعتماد والإقرار الرسمي</span>
          <span class="en">Approvals & Acknowledgement</span>
        </div>
        <div class="signatures-grid" style="grid-template-columns: 1fr 1fr;">
          <div class="sig-box">
            <h4>إدارة الموارد البشرية <span class="h4-en">Human Resources Dept.</span></h4>
            <p>شركة جوهرة المجد للتجارة والمقاولات</p>
            <p><strong>المعتمد:</strong> عبدالملك سعيد الشريف</p>
            <div class="sig-line"></div>
            <p><span class="stamp-seal stamp-approved">معتمد إلكترونياً ومختوم رسمياً ✓</span></p>
          </div>

          <div class="sig-box">
            <h4>إقرار الموظف بالاستلام <span class="h4-en">Employee Acknowledgement</span></h4>
            <p>أقر أنا الموظف/ <strong>${emp.full_name_ar}</strong> باطلاعي واستلامي لهذا الإشعار الرسمي.</p>
            <p><strong>التاريخ:</strong> ${currentDate}م</p>
            <div class="sig-line"></div>
            <p>التوقيع: .....................................................</p>
          </div>
        </div>

        <!-- Footer Verification -->
        <div class="doc-verification-bar">
          <span>نموذج إشعار عدم تجديد عقد عمل رقم 4 - شركة جوهرة المجد (س.ت: ${COMPANY.cr})</span>
          <span>رمز الوثيقة: <strong>JM-CNR-${emp.emp_code}</strong></span>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 5. نموذج إجراء وقرار جزائي (JM-HR-F-002)
 * السجل الانضباطي ولائحة تنظيم العمل
 */
function renderPenaltyFormHtml(identifier, options = {}) {
  const { emp, record } = resolveEmployeeAndRecord('penalty', identifier, options);
  const currentDate = options.date || (record ? record.issued_at?.split(' ')[0] : new Date().toISOString().split('T')[0]);
  const incidentDate = options.incident_date || (record ? record.incident_date : currentDate);
  const decisionNo = record ? record.decision_no : `DEC-2026-${emp.emp_code}`;
  const repetition = record ? record.repetition_level : 'المرة الأولى';
  const violationCode = record ? record.violation_code : '1/15';
  const violationText = record ? record.violation_text : 'مخالفة أحكام لائحة تنظيم العمل الداخلية';
  const penaltyText = record ? record.penalty_text : 'خصم أجر يوم واحد من الراتب الشهري';
  const deductionDays = record ? record.deduction_days : 1;

  const repetitions = ['المرة الأولى', 'المرة الثانية', 'المرة الثالثة', 'المرة الرابعة'];

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>نموذج إجراء جزائي - ${decisionNo}</title>
      ${getBaseStyles('penalty_procedure', emp.id)}
    </head>
    <body>
      ${renderScreenToolbar('penalty_procedure', emp.id)}

      <div class="doc-page">
        <!-- Top Meta -->
        <div class="doc-top-bar">
          <div class="meta-right">
            <span><strong>رقم النموذج:</strong> JM-HR-F-002</span> |
            <span><strong>رقم القرار:</strong> ${decisionNo}</span> |
            <span><strong>التاريخ:</strong> ${currentDate}م</span>
          </div>
          <div class="meta-left">
            <span>Form Ref: JM-HR-F-002 | Emp#: ${emp.emp_code}</span>
          </div>
        </div>

        <!-- Title -->
        <div class="doc-title-ribbon">
          <h2>نموذج وقرار إجراء جزائي</h2>
          <p>PENALTY PROCEDURE & DISCIPLINARY DECISION FORM</p>
        </div>

        <!-- 1. Employee Info -->
        <div class="doc-section-title">
          <span>1. بيانات الموظف (Employee Data)</span>
          <span class="en">Employee Information</span>
        </div>
        <table class="doc-table">
          <tr>
            <th>الرقم الوظيفي: <span class="th-en">Employee No.</span></th>
            <td><strong>${emp.emp_code}</strong></td>
            <th>اسم الموظف: <span class="th-en">Employee Name</span></th>
            <td><strong>${emp.full_name_ar}</strong></td>
          </tr>
          <tr>
            <th>مسمى الوظيفة: <span class="th-en">Job Title</span></th>
            <td>${emp.job_title_ar || 'موظف'}</td>
            <th>الإدارة: <span class="th-en">Department</span></th>
            <td>${emp.department_name || 'شركة جوهرة المجد'}</td>
          </tr>
          <tr>
            <th>الفرع / الموقع: <span class="th-en">Branch / Site</span></th>
            <td>${emp.branch_name || 'الإدارة العامة'}</td>
            <th>المدير المباشر: <span class="th-en">Direct Manager</span></th>
            <td>${emp.direct_manager_name || 'مدير الإدارة'}</td>
          </tr>
        </table>

        <!-- 2. Repetition Level -->
        <div class="doc-section-title">
          <span>2. تكرار المخالفة (Repeating the violation)</span>
          <span class="en">Repetition Level</span>
        </div>
        <div class="checkbox-grid" style="grid-template-columns: repeat(4, 1fr);">
          ${repetitions.map(r => `
            <div class="checkbox-item ${repetition === r ? 'checked' : ''}">
              <span>${repetition === r ? '☑' : '☐'}</span>
              <span>${r}</span>
            </div>
          `).join('')}
        </div>

        <!-- 3. Incident Description -->
        <div class="doc-section-title">
          <span>3. تاريخ ووصف المخالفة (Violation Description & Date)</span>
          <span class="en">Incident Details</span>
        </div>
        <table class="doc-table">
          <tr>
            <th>تاريخ المخالفة: <span class="th-en">Incident Date</span></th>
            <td colspan="3"><strong>${incidentDate}م</strong></td>
          </tr>
          <tr>
            <th>بند اللائحة المعتمدة: <span class="th-en">Violation Code</span></th>
            <td colspan="3"><strong>[${violationCode}] - لائحة تنظيم العمل والجزاءات المعتمدة</strong></td>
          </tr>
          <tr>
            <th>وصف المخالفة: <span class="th-en">Description</span></th>
            <td colspan="3">${violationText}</td>
          </tr>
          <tr>
            <th>الإجراء الجزائي المقرر: <span class="th-en">Penalty Applied</span></th>
            <td colspan="3" style="color:var(--primary); font-weight:800; font-size:12px;">
              ⚠️ ${penaltyText} (خصم: ${deductionDays} يوم)
            </td>
          </tr>
        </table>

        <!-- 4. Signatures -->
        <div class="doc-section-title">
          <span>4. الاعتمادات والإقرار (Signatures & Approvals)</span>
          <span class="en">Official Approvals</span>
        </div>
        <div class="signatures-grid">
          <div class="sig-box">
            <h4>توقيع الموظف <span class="h4-en">Employee Signature</span></h4>
            <p>${emp.full_name_ar}</p>
            <div class="sig-line"></div>
            <p>التوقيع بالعلم والإقرار</p>
          </div>
          <div class="sig-box">
            <h4>مدير الإدارة <span class="h4-en">Dept. Manager</span></h4>
            <p>${emp.direct_manager_name || 'مدير الإدارة'}</p>
            <div class="sig-line"></div>
            <p>توصية المدير المباشر</p>
          </div>
          <div class="sig-box">
            <h4>مدير الموارد البشرية <span class="h4-en">HR Manager</span></h4>
            <p>عبدالملك سعيد الشريف</p>
            <div class="sig-line"></div>
            <p><span class="stamp-seal stamp-approved">معتمد ومطبق رسمياً ✓</span></p>
          </div>
        </div>

        <!-- Routing -->
        <div class="doc-verification-bar">
          <span>شركة جوهرة المجد • توزيع النسخ: • الأصل لملف الموظف • صورة لشؤون الموظفين • س.ت: ${COMPANY.cr}</span>
          <span>رمز القرار: <strong>JM-PEN-${emp.emp_code}</strong></span>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 6. نموذج طلب إنهاء خدمة واستقالة (JM-HR-F-003)
 * متوافق مع نظام العمل السعودي ومكافأة نهاية الخدمة (م 84 و 85)
 */
function renderResignationTerminationFormHtml(identifier, options = {}) {
  const { emp, record } = resolveEmployeeAndRecord('resignation', identifier, options);
  const currentDate = options.date || (record ? record.termination_date : new Date().toISOString().split('T')[0]);
  const termType = record ? record.termination_type : 'استقالة (Resignation)';
  const lastSalary = record ? record.last_salary : emp.gross;
  const serviceYears = record ? record.service_years : 2.5;
  const reward = record ? record.end_of_service_reward : Math.round((lastSalary / 2) * serviceYears);
  const leaveComp = record ? record.leave_compensation : 0;
  const deductions = record ? record.deductions_amount : 0;
  const netSettlement = record ? record.total_settlement : (reward + leaveComp - deductions);

  const types = [
    { key: 'استقالة', label: 'استقالة (Resignation)' },
    { key: 'انتهاء عقد', label: 'انتهاء عقد (Contract Expiry)' },
    { key: 'إنهاء خدمة', label: 'إنهاء خدمة م 77 (Termination)' },
    { key: 'فترة التجربة', label: 'فترة التجربة م 53 (Probation)' },
    { key: 'مادة 80', label: 'فسخ بموجب م 80 (Art. 80)' }
  ];

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>نموذج الاستقالة وإنهاء عقد العمل - ${emp.emp_code} - ${emp.full_name_ar}</title>
      ${getBaseStyles('resignation_termination', emp.id)}
    </head>
    <body>
      ${renderScreenToolbar('resignation_termination', emp.id)}

      <div class="doc-page">
        <!-- Top Meta -->
        <div class="doc-top-bar">
          <div class="meta-right">
            <span><strong>رقم النموذج:</strong> JM-HR-F-003</span> |
            <span><strong>الإصدار:</strong> 3.0 (v3)</span> |
            <span><strong>التاريخ:</strong> ${currentDate}م</span>
          </div>
          <div class="meta-left">
            <span>Form Ref: JM-HR-F-003 | Emp#: ${emp.emp_code}</span>
          </div>
        </div>

        <!-- Title -->
        <div class="doc-title-ribbon">
          <h2>نموذج طلب إنهاء خدمة واستقالة</h2>
          <p>RESIGNATION & EMPLOYMENT TERMINATION FORM (v3)</p>
        </div>

        <!-- 1. Employee Info -->
        <div class="doc-section-title">
          <span>1. بيانات الموظف (Employee Information)</span>
          <span class="en">Employee Details</span>
        </div>
        <table class="doc-table">
          <tr>
            <th>الرقم الوظيفي: <span class="th-en">Employee No.</span></th>
            <td><strong>${emp.emp_code}</strong></td>
            <th>اسم الموظف: <span class="th-en">Employee Name</span></th>
            <td><strong>${emp.full_name_ar}</strong></td>
          </tr>
          <tr>
            <th>رقم الهوية / الإقامة: <span class="th-en">National ID / Iqama</span></th>
            <td>${emp.national_id || 'غير مسجل'}</td>
            <th>الجنسية: <span class="th-en">Nationality</span></th>
            <td>${emp.nationality || 'سعودي'}</td>
          </tr>
          <tr>
            <th>الإدارة / القسم: <span class="th-en">Department</span></th>
            <td>${emp.department_name || 'شركة جوهرة المجد'}</td>
            <th>المسمى الوظيفي: <span class="th-en">Job Title</span></th>
            <td>${emp.job_title_ar || 'موظف'}</td>
          </tr>
          <tr>
            <th>تاريخ التعيين: <span class="th-en">Joining Date</span></th>
            <td>${emp.join_date || '2024-01-01'}</td>
            <th>مدة الخدمة المحتسبة: <span class="th-en">Service Period</span></th>
            <td><strong>${serviceYears} سنة</strong></td>
          </tr>
        </table>

        <!-- 2. Request Type -->
        <div class="doc-section-title">
          <span>2. نوع الطلب وسبب الإنهاء (Request Type)</span>
          <span class="en">Termination Category</span>
        </div>
        <div class="checkbox-grid">
          ${types.map(t => `
            <div class="checkbox-item ${termType.includes(t.key) ? 'checked' : ''}">
              <span>${termType.includes(t.key) ? '☑' : '☐'}</span>
              <span>${t.label}</span>
            </div>
          `).join('')}
        </div>

        <!-- 3. Financial Settlement Summary -->
        <div class="doc-section-title">
          <span>3. خلاصة التسوية المالية ومكافأة نهاية الخدمة (نظام العمل م 84 و 85)</span>
          <span class="en">Financial Settlement</span>
        </div>
        <table class="doc-table">
          <tr>
            <th>آخر راتب شهري إجمالي:</th>
            <td><strong>${lastSalary.toLocaleString('en-US')} ر.س</strong></td>
            <th>مكافأة نهاية الخدمة:</th>
            <td><strong>${reward.toLocaleString('en-US')} ر.س</strong></td>
          </tr>
          <tr>
            <th>تعويض رصيد الإجازات:</th>
            <td>${leaveComp.toLocaleString('en-US')} ر.س</td>
            <th>الخصومات والسلف:</th>
            <td>${deductions.toLocaleString('en-US')} ر.س</td>
          </tr>
          <tr style="background: #f0fdf4;">
            <th style="color: #166534; font-size: 12px;">صافي المستحقات النهائية:</th>
            <td colspan="3"><strong style="color: #166534; font-size: 14px;">${netSettlement.toLocaleString('en-US')} ريال سعودي</strong></td>
          </tr>
        </table>

        <!-- 4. Declaration -->
        <div class="doc-box">
          <strong>إقرار الموظف (Employee Declaration):</strong>
          <p style="margin: 4px 0 0; color: #333; font-size: 10.5px; line-height: 1.5;">
            أقر أنا الموقع أدناه بأنني تقدمت بهذا الطلب بإرادتي، وألتزم بإكمال كافة إجراءات التسليم والإخلاء وتسوية أي عهد أو التزامات، وبمجرد استلام صافي مستحقاتي الموضحة أعلاه أكون قد أبرأت ذمة شركة جوهرة المجد من أي حقوق عمالية أو مالية حالية أو مستقبلية.
          </p>
        </div>

        <!-- 5. Signatures -->
        <div class="signatures-grid">
          <div class="sig-box">
            <h4>توقيع الموظف <span class="h4-en">Employee Signature</span></h4>
            <p>${emp.full_name_ar}</p>
            <div class="sig-line"></div>
            <p>التوقيع والتاريخ</p>
          </div>
          <div class="sig-box">
            <h4>المدير المباشر <span class="h4-en">Direct Manager</span></h4>
            <p>${emp.direct_manager_name || 'المدير المباشر'}</p>
            <div class="sig-line"></div>
            <p>توصية وقبول الإنهاء</p>
          </div>
          <div class="sig-box">
            <h4>مدير الموارد البشرية <span class="h4-en">HR Director</span></h4>
            <p>عبدالملك سعيد الشريف</p>
            <div class="sig-line"></div>
            <p><span class="stamp-seal stamp-approved">معتمد رسمياً ✓</span></p>
          </div>
        </div>

        <!-- Footer Verification -->
        <div class="doc-verification-bar">
          <span>وثيقة إدارية رسمية معتمدة وفق نظام العمل - شركة جوهرة المجد (س.ت: ${COMPANY.cr})</span>
          <span>رمز الوثيقة: <strong>JM-TERM-${emp.emp_code}</strong></span>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 7. نموذج طلب إجازة (JM-HR-F-001)
 * متصل مباشرة بقاعدة البيانات والرصيد الحي والموافقات
 */
function renderLeaveFormHtml(identifier, options = {}) {
  const { emp, record } = resolveEmployeeAndRecord('leave', identifier, options);
  const currentDate = options.date || (record ? record.created_at?.split(' ')[0] : new Date().toISOString().split('T')[0]);
  const leaveType = record ? record.leave_type : 'إجازة سنوية';
  const startDate = record ? record.start_date : currentDate;
  const endDate = record ? record.end_date : currentDate;
  const daysCount = record ? record.days_count : 30;
  const substituteName = record ? record.substitute_name : 'لا يوجد موظف بديل محدد';
  const reason = record ? record.reason : 'إجازة سنوية اعتيادية حسب الخطة';
  const requestNo = record ? record.request_no : `REQ-2026-${emp.emp_code}`;
  const status = record ? record.status : 'معتمد مبدئياً ومحسوم من الرصيد';

  const leaveTypes = ['إجازة سنوية', 'إجازة مرضية', 'إجازة اضطرارية', 'إجازة بدون راتب', 'إجازة وفاة', 'إجازة مولود'];

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>نموذج طلب إجازة - ${requestNo}</title>
      ${getBaseStyles('leave_request', emp.id)}
    </head>
    <body>
      ${renderScreenToolbar('leave_request', emp.id)}

      <div class="doc-page">
        <!-- Top Meta -->
        <div class="doc-top-bar">
          <div class="meta-right">
            <span><strong>رقم النموذج:</strong> JM-HR-F-001</span> |
            <span><strong>رقم الطلب:</strong> ${requestNo}</span> |
            <span><strong>تاريخ التقديم:</strong> ${currentDate}م</span>
          </div>
          <div class="meta-left">
            <span>Form Ref: JM-HR-F-001 | Emp#: ${emp.emp_code}</span>
          </div>
        </div>

        <!-- Title -->
        <div class="doc-title-ribbon">
          <h2>نموذج طلب إجازة رسمي</h2>
          <p>OFFICIAL LEAVE REQUEST FORM</p>
        </div>

        <!-- 1. Employee Info -->
        <div class="doc-section-title">
          <span>1. بيانات الموظف (Employee Information)</span>
          <span class="en">Employee Details</span>
        </div>
        <table class="doc-table">
          <tr>
            <th>الرقم الوظيفي: <span class="th-en">Employee No.</span></th>
            <td><strong>${emp.emp_code}</strong></td>
            <th>اسم الموظف: <span class="th-en">Employee Name</span></th>
            <td><strong>${emp.full_name_ar}</strong></td>
          </tr>
          <tr>
            <th>رقم الهوية / الإقامة: <span class="th-en">National ID / Iqama</span></th>
            <td>${emp.national_id || 'غير مسجل'}</td>
            <th>الجنسية: <span class="th-en">Nationality</span></th>
            <td>${emp.nationality || 'سعودي'}</td>
          </tr>
          <tr>
            <th>الإدارة / القسم: <span class="th-en">Department</span></th>
            <td>${emp.department_name || 'شركة جوهرة المجد'}</td>
            <th>المسمى الوظيفي: <span class="th-en">Job Title</span></th>
            <td>${emp.job_title_ar || 'موظف'}</td>
          </tr>
          <tr>
            <th>تاريخ المباشرة: <span class="th-en">Joining Date</span></th>
            <td>${emp.join_date || '2024-01-01'}</td>
            <th>رصيد الإجازات المتاح: <span class="th-en">Leave Balance</span></th>
            <td><strong style="color:var(--primary); font-size:12px;">${emp.annual_leave_balance || 30} يوم</strong></td>
          </tr>
        </table>

        <!-- 2. Leave Type -->
        <div class="doc-section-title">
          <span>2. نوع الإجازة المطلوبة (Leave Type)</span>
          <span class="en">Leave Category</span>
        </div>
        <div class="checkbox-grid">
          ${leaveTypes.map(t => `
            <div class="checkbox-item ${leaveType === t ? 'checked' : ''}">
              <span>${leaveType === t ? '☑' : '☐'}</span>
              <span>${t}</span>
            </div>
          `).join('')}
        </div>

        <!-- 3. Leave Details -->
        <div class="doc-section-title">
          <span>3. تفاصيل مدة الإجازة والبديل (Leave Details)</span>
          <span class="en">Duration & Substitute</span>
        </div>
        <table class="doc-table">
          <tr>
            <th>تاريخ البدء: <span class="th-en">Start Date</span></th>
            <td><strong>${startDate}</strong></td>
            <th>تاريخ الانتهاء: <span class="th-en">End Date</span></th>
            <td><strong>${endDate}</strong></td>
          </tr>
          <tr>
            <th>عدد الأيام المطلوبة: <span class="th-en">Days Count</span></th>
            <td><strong style="color: var(--primary); font-size: 13px;">${daysCount} يوم</strong></td>
            <th>الموظف البديل المكلف: <span class="th-en">Handover / Substitute</span></th>
            <td>${substituteName}</td>
          </tr>
          <tr>
            <th>سبب / ملاحظات الإجازة: <span class="th-en">Reason / Notes</span></th>
            <td colspan="3">${reason}</td>
          </tr>
        </table>

        <!-- 4. Declaration -->
        <div class="doc-box">
          <strong>إقرار وتعهد الموظف:</strong>
          <p style="margin: 4px 0 0; color: #444; font-size: 10.5px; line-height: 1.5;">
            أقر أنا الموظف الموقع أعلاه بصحة البيانات المذكورة، وأتعهد بمباشرة العمل فور انتهاء إجازتي في التاريخ المحدد، وفي حال التأخر دون إشعار مسبق وعذر مقبول أكون عرضة للإجراءات النظامية المعمول بها بالشركة ونظام العمل السعودي.
          </p>
        </div>

        <!-- 5. Approval Workflow Grid -->
        <div class="doc-section-title">
          <span>4. مسار الموافقات الرباعي المعتمد (Approval Workflow)</span>
          <span class="en">Authorized Approvals</span>
        </div>
        <div class="signatures-grid">
          <div class="sig-box">
            <h4>[1] توصية المدير المباشر <span class="h4-en">Direct Manager</span></h4>
            <p><strong>الاسم:</strong> ${emp.direct_manager_name || 'المدير المباشر'}</p>
            <p><strong>القرار:</strong> موافقة مبدئية</p>
            <div class="sig-line"></div>
            <p>التوقيع والاعتماد</p>
          </div>

          <div class="sig-box">
            <h4>[2] تدقيق الموارد البشرية <span class="h4-en">HR Verification</span></h4>
            <p><strong>المختص:</strong> قسم التدقيق وشؤون الموظفين</p>
            <p><strong>الرصيد:</strong> مستحق نظاماً ومخصوم</p>
            <div class="sig-line"></div>
            <p>التوقيع والتدقيق</p>
          </div>

          <div class="sig-box">
            <h4>[3] اعتماد مدير الموارد البشرية <span class="h4-en">HR Director Approval</span></h4>
            <p><strong>المدير:</strong> عبدالملك سعيد الشريف</p>
            <p><strong>الحالة:</strong> <span class="stamp-seal stamp-approved">${status}</span></p>
            <div class="sig-line"></div>
            <p>الاعتماد والختم الرسمي</p>
          </div>
        </div>

        <!-- Footer Verification -->
        <div class="doc-verification-bar">
          <span>وثيقة نظامية رسمية صادرة إلكترونياً من شركة جوهرة المجد (س.ت: ${COMPANY.cr})</span>
          <span>رمز التحقق الرقمي: <strong>REF-${requestNo}</strong></span>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 8. شهادة تعريف بالراتب الموحدة الرسمية (JM-HR-F-008)
 * To Whom It May Concern - Unified Bilingual Salary Certificate
 * تفصيل شامل لبنود الراتب المعتمدة: الأساسي، السكن، النقل، أخرى، الإجمالي، التأمينات، الصافي
 */
function renderSalaryCertHtml(identifier, options = {}) {
  const { emp } = resolveEmployeeAndRecord('salary_cert', identifier, options);
  const currentDate = options.date || new Date().toISOString().split('T')[0];
  const destination = options.destination || 'السادة / البنوك والجهات الرسمية والتمويلية بالمملكة (To Whom It May Concern)';
  const certRef = `JM-CERT-2026-${emp.emp_code}`;

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>شهادة تعريف بالراتب - ${emp.emp_code} - ${emp.full_name_ar}</title>
      ${getBaseStyles('salary_cert', emp.id)}
    </head>
    <body>
      ${renderScreenToolbar('salary_cert', emp.id)}

      <div class="doc-page">
        <!-- Top Meta -->
        <div class="doc-top-bar">
          <div class="meta-right">
            <span><strong>رقم الوثيقة:</strong> JM-HR-F-008</span> |
            <span><strong>الرقم المرجعي:</strong> ${certRef}</span> |
            <span><strong>التاريخ:</strong> ${currentDate}م</span>
          </div>
          <div class="meta-left">
            <span>Official Ref: ${certRef} | Date: ${currentDate}</span>
          </div>
        </div>

        <!-- Title -->
        <div class="doc-title-ribbon">
          <h2>شهادة تعريف بالراتب لمن يهمه الأمر</h2>
          <p>TO WHOM IT MAY CONCERN • OFFICIAL SALARY CERTIFICATE</p>
        </div>

        <!-- Addressed To -->
        <div class="doc-box" style="background:#ffffff; border-right:4px solid var(--primary); font-size:12px; font-weight:700;">
          <p style="margin: 0;">السادة / ${destination} المحترمين</p>
          <p style="margin: 3px 0 0; font-size:11px; color:#475569; font-weight:normal;">السلام عليكم ورحمة الله وبركاته،،،</p>
        </div>

        <!-- Preamble -->
        <div class="doc-box" style="margin-top: 6px;">
          <p style="margin: 0 0 4px;">
            تشهد <strong>شركة جوهرة المجد للتجارة والمقاولات</strong> (س.ت: 7004872169) بأن الموظف الموضحة بياناته أدناه يعمل لدينا وعلى رأس العمل بموجب عقد عمل ساري المفعول حتى تاريخ إصدار هذه الشهادة:
          </p>
          <p style="margin: 0; font-size:10.5px; color:#475569; direction:ltr; text-align:left;">
            Jawharat Al-Majd Trading & Contracting Co. hereby certifies that the employee whose details are set forth below is actively employed under a valid contract:
          </p>
        </div>

        <!-- 1. Employee Info -->
        <div class="doc-section-title">
          <span>1. بيانات الموظف والوظيفة</span>
          <span class="en">Employee & Position Details</span>
        </div>
        <table class="doc-table">
          <tr>
            <th>الاسم الكامل: <span class="th-en">Full Name</span></th>
            <td><strong>${emp.full_name_ar}</strong></td>
            <th>الرقم الوظيفي: <span class="th-en">Employee No.</span></th>
            <td><strong>${emp.emp_code}</strong></td>
          </tr>
          <tr>
            <th>رقم الهوية / الإقامة: <span class="th-en">National ID / Iqama</span></th>
            <td><strong>${emp.national_id || 'غير مسجل'}</strong></td>
            <th>الجنسية: <span class="th-en">Nationality</span></th>
            <td>${emp.nationality || 'سعودي'}</td>
          </tr>
          <tr>
            <th>المسمى الوظيفي: <span class="th-en">Job Title</span></th>
            <td>${emp.job_title_ar || 'موظف'}</td>
            <th>الإدارة / القسم: <span class="th-en">Department</span></th>
            <td>${emp.department_name || 'شركة جوهرة المجد'}</td>
          </tr>
          <tr>
            <th>تاريخ المباشرة: <span class="th-en">Joining Date</span></th>
            <td>${emp.join_date || '2024-01-01'}</td>
            <th>نوع العقد: <span class="th-en">Contract Type</span></th>
            <td>${emp.contract_type || 'عقد عمل محدد المدة'}</td>
          </tr>
        </table>

        <!-- 2. Detailed Salary Components Table -->
        <div class="doc-section-title">
          <span>2. تفصيل مفردات وبنود الراتب الشهري المعتمدة</span>
          <span class="en">Monthly Salary Components Breakdown</span>
        </div>
        <table class="doc-table">
          <thead>
            <tr style="background:#f1f5f9; text-align:center;">
              <th style="text-align:center; width:22%;">الراتب الأساسي<br><span style="font-size:9.5px; color:#64748b;">Basic Salary</span></th>
              <th style="text-align:center; width:18%;">بدل السكن<br><span style="font-size:9.5px; color:#64748b;">Housing Allowance</span></th>
              <th style="text-align:center; width:18%;">بدل النقل<br><span style="font-size:9.5px; color:#64748b;">Transport Allowance</span></th>
              <th style="text-align:center; width:18%;">بدلات أخرى<br><span style="font-size:9.5px; color:#64748b;">Other Allowances</span></th>
              <th style="text-align:center; width:24%; background:#fef2f2; color:var(--primary);">إجمالي الراتب الشهري<br><span style="font-size:9.5px; color:#991b1b;">Gross Monthly Salary</span></th>
            </tr>
          </thead>
          <tbody>
            <tr style="text-align:center; font-size:12px;">
              <td style="text-align:center;"><strong>${emp.basic.toLocaleString('en-US')}</strong> ر.س</td>
              <td style="text-align:center;">${emp.housing.toLocaleString('en-US')} ر.س</td>
              <td style="text-align:center;">${emp.transport.toLocaleString('en-US')} ر.س</td>
              <td style="text-align:center;">${emp.other.toLocaleString('en-US')} ر.س</td>
              <td style="text-align:center; background:#fef2f2; color:var(--primary); font-weight:800; font-size:13px;">
                ${emp.gross.toLocaleString('en-US')} ر.س
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Deductions & Net Salary Bar -->
        <table class="doc-table" style="margin-top: 4px;">
          <tr style="background:#f8fafc;">
            <th style="width:25%;">حسم التأمينات الاجتماعية (GOSI):</th>
            <td style="width:25%; font-weight:700; color:#b91c1c;">${emp.gosi.toLocaleString('en-US')} ريال سعودي</td>
            <th style="width:25%; background:#ecfdf5; color:#065f46; font-size:12px;">صافي الراتب المستلم شهرياً:</th>
            <td style="width:25%; background:#ecfdf5; color:#065f46; font-weight:900; font-size:14px;">
              ${emp.net.toLocaleString('en-US')} ريال سعودي
            </td>
          </tr>
        </table>

        <!-- Legal Disclaimer / Notice -->
        <div class="doc-box" style="font-size:10.5px; line-height:1.6; color:#475569; margin-top:8px;">
          <p style="margin: 0 0 3px;">
            وقد أُعطيت له هذه الشهادة بناءً على طلبه لتقديمها إلى الجهة المذكورة أعلاه، دون أدنى مسؤولية أو التزام مالي على الشركة تجاه حقوق الغير، ويسري مفعول هذه الشهادة لمدة ثلاثين (30) يوماً من تاريخ إصدارها.
          </p>
          <p style="margin: 0; direction:ltr; text-align:left; font-size:10px;">
            This certificate is issued upon the employee's request without any financial liability on the company towards third parties, valid for 30 days from issuance.
          </p>
        </div>

        <!-- Signatures & Official Stamp Grid -->
        <div class="doc-section-title">
          <span>3. التوثيق والاعتماد الرسمي</span>
          <span class="en">Official Authorization & Seals</span>
        </div>
        <div class="signatures-grid" style="grid-template-columns: 1fr 1fr; margin-top:8px;">
          <div class="sig-box">
            <h4>إدارة الموارد البشرية <span class="h4-en">Human Resources Department</span></h4>
            <p><strong>المفوض بالاعتماد:</strong> عبدالملك سعيد الشريف</p>
            <p><strong>المسمى:</strong> مدير عام الموارد البشرية</p>
            <div class="sig-line"></div>
            <p><span class="stamp-seal stamp-approved">التوقيع الإلكتروني المعتمد ✓</span></p>
          </div>

          <div class="sig-box">
            <h4>الختم الرسمي والتحقق الرقمي <span class="h4-en">Official Seal & Digital QR</span></h4>
            <p>شركة جوهرة المجد للتجارة والمقاولات</p>
            <p>س.ت: 7004872169 • أبها، عسير</p>
            <div class="sig-line"></div>
            <p><span class="stamp-seal stamp-approved">وثيقة رسمية مختومة ومعتمدة ✓</span></p>
          </div>
        </div>

        <!-- Footer Verification -->
        <div class="doc-verification-bar">
          <span>شهادة تعريف بالراتب موحدة رقم 8 صادرة إلكترونياً • نظام الموارد البشرية لشركة جوهرة المجد</span>
          <span>رمز التوثيق: <strong>${certRef}</strong></span>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Official Attendance & Article 80 Disciplinary Notice renderer
 */
function renderAttendanceNoticeHtml(identifier, options = {}) {
  let notice = null;
  let emp = null;
  const numId = Number(identifier);

  if (!isNaN(numId)) {
    notice = get(`
      SELECT n.*,
             e.emp_code, e.full_name_ar, e.national_id, e.nationality, e.job_title_ar,
             d.name_ar AS department_name, b.name_ar AS branch_name
      FROM attendance_notices n
      JOIN employees e ON n.emp_id = e.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN branches b ON e.branch_id = b.id
      WHERE n.id = ?
    `, [numId]);
    if (notice) {
      emp = getEmployeeDetails(notice.emp_id);
    }
  }

  if (!notice) {
    const targetEmpId = options.emp_id ? Number(options.emp_id) : (!isNaN(numId) ? numId : null);
    if (targetEmpId) {
      emp = getEmployeeDetails(targetEmpId);
      if (emp) {
        notice = get(`
          SELECT n.*,
                 e.emp_code, e.full_name_ar, e.national_id, e.nationality, e.job_title_ar,
                 d.name_ar AS department_name, b.name_ar AS branch_name
          FROM attendance_notices n
          JOIN employees e ON n.emp_id = e.id
          LEFT JOIN departments d ON e.department_id = d.id
          LEFT JOIN branches b ON e.branch_id = b.id
          WHERE n.emp_id = ?
          ORDER BY n.id DESC LIMIT 1
        `, [emp.id]);
      }
    }
  }

  if (!emp) {
    emp = getDefaultEmployee();
  }

  const currentDate = options.date || (notice ? notice.created_at?.split(' ')[0] : new Date().toISOString().split('T')[0]);
  const noticeNo = notice ? notice.notice_no : `NOT-2026-${emp.emp_code}`;
  const noticeType = notice ? notice.notice_type : 'إشعار مخالفة دوام رسمي';
  const incidentDate = notice ? notice.incident_date : currentDate;
  const legalBasis = notice ? notice.legal_basis : 'نظام العمل السعودي ولائحة تنظيم العمل';
  const details = notice ? notice.details : 'عدم الالتزام بضوابط الحضور والانصراف المقررة';
  const penaltyApplied = notice ? notice.penalty_applied : 'تنبيه إداري وتطبيق الجزاء المعتمد';
  const isArticle80 = noticeType.includes('80') || noticeType.includes('انقطاع');

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>${noticeType} - ${noticeNo}</title>
      ${getBaseStyles('absence_penalty', emp.id)}
    </head>
    <body>
      ${renderScreenToolbar('absence_penalty', emp.id)}

      <div class="doc-page">
        <!-- Top Meta -->
        <div class="doc-top-bar">
          <div class="meta-right">
            <span><strong>رقم الإشعار:</strong> ${noticeNo}</span> |
            <span><strong>تاريخ الإصدار:</strong> ${currentDate}م</span>
          </div>
          <div class="meta-left">
            <span>Official Ref: ${noticeNo} | Emp#: ${emp.emp_code}</span>
          </div>
        </div>

        <!-- Title -->
        <div class="doc-title-ribbon">
          <h2>${noticeType}</h2>
          <p>OFFICIAL ATTENDANCE & DISCIPLINARY NOTICE</p>
        </div>

        <!-- 1. Employee Info -->
        <div class="doc-section-title">
          <span>1. بيانات الموظف الأساسية</span>
          <span class="en">Employee Information</span>
        </div>
        <table class="doc-table">
          <tr>
            <th>الرقم الوظيفي: <span class="th-en">Employee No.</span></th>
            <td><strong>${emp.emp_code}</strong></td>
            <th>اسم الموظف: <span class="th-en">Employee Name</span></th>
            <td><strong>${emp.full_name_ar}</strong></td>
          </tr>
          <tr>
            <th>رقم الهوية / الإقامة: <span class="th-en">National ID / Iqama</span></th>
            <td>${emp.national_id || 'غير مسجل'}</td>
            <th>الجنسية: <span class="th-en">Nationality</span></th>
            <td>${emp.nationality || 'سعودي'}</td>
          </tr>
          <tr>
            <th>الإدارة / القسم: <span class="th-en">Department</span></th>
            <td>${emp.department_name || 'شركة جوهرة المجد'}</td>
            <th>المسمى الوظيفي: <span class="th-en">Job Title</span></th>
            <td>${emp.job_title_ar || 'موظف'}</td>
          </tr>
        </table>

        <!-- 2. Notice Details -->
        <div class="doc-section-title">
          <span>2. تفاصيل الواقعة والسند النظامي</span>
          <span class="en">Violation Details & Legal Grounds</span>
        </div>
        <table class="doc-table">
          <tr>
            <th>نوع المخالفة:</th>
            <td><strong>${noticeType}</strong></td>
            <th>تاريخ الواقعة:</th>
            <td><strong>${incidentDate}م</strong></td>
          </tr>
          <tr>
            <th>السند النظامي والقانوني:</th>
            <td colspan="3" style="color:var(--primary); font-weight:700;">${legalBasis}</td>
          </tr>
          <tr>
            <th>التفاصيل والوقائع:</th>
            <td colspan="3">${details}</td>
          </tr>
          <tr>
            <th>الإجراء الإداري المترتب:</th>
            <td colspan="3"><strong style="color:#b91c1c;">${penaltyApplied}</strong></td>
          </tr>
        </table>

        <!-- 3. Legal Warning Box -->
        <div class="doc-box" style="margin-top:6px;">
          ${isArticle80 ? `
            <strong style="color:#991b1b;">⚠️ إنذار كتابي نهائي بموجب المادة (80) من نظام العمل السعودي:</strong>
            <p style="margin: 4px 0 0; font-size: 10.5px; line-height: 1.5; color:#475569;">
              نلفت عنايتكم بأن استمرار الانقطاع عن العمل دون سبب مشروع يجاوز 15 يوماً متصلة أو 30 يوماً متقطعة خلال السنة العقدية يمنح المنشأة الحق القانوني في فسخ عقد العمل دون مكافأة أو إشعار أو تعويض بموجب أحكام الفقرة (7) من المادة (80) من نظام العمل السعودي.
            </p>
          ` : `
            <strong>تنبيه إداري رسمي:</strong>
            <p style="margin: 4px 0 0; font-size: 10.5px; line-height: 1.5; color:#475569;">
              يُرجى الالتزام التام بمواعيد العمل وضوابط البصمة البيومترية تفادياً لتصعيد الجزاءات التأديبية المنصوص عليها في لائحة تنظيم العمل المعتمدة.
            </p>
          `}
        </div>

        <!-- 4. Signatures Grid -->
        <div class="doc-section-title">
          <span>3. التوثيق والاعتماد الرسمي</span>
          <span class="en">Approvals & Acknowledgement</span>
        </div>
        <div class="signatures-grid" style="grid-template-columns: 1fr 1fr;">
          <div class="sig-box">
            <h4>إدارة الموارد البشرية <span class="h4-en">Human Resources Dept.</span></h4>
            <p>شركة جوهرة المجد للتجارة والمقاولات</p>
            <p><strong>المعتمد:</strong> عبدالملك سعيد الشريف</p>
            <div class="sig-line"></div>
            <p><span class="stamp-seal stamp-approved">معتمد ومختوم رسمياً ✓</span></p>
          </div>

          <div class="sig-box">
            <h4>إقرار الموظف بالاستلام <span class="h4-en">Employee Acknowledgement</span></h4>
            <p>أقر أنا الموظف/ <strong>${emp.full_name_ar}</strong> باطلاعي واستلامي لهذا الإشعار.</p>
            <p><strong>التاريخ:</strong> ${currentDate}م</p>
            <div class="sig-line"></div>
            <p>التوقيع: .....................................................</p>
          </div>
        </div>

        <!-- Footer Verification -->
        <div class="doc-verification-bar">
          <span>إشعار إداري رسمي صادر إلكترونياً - شركة جوهرة المجد (س.ت: ${COMPANY.cr})</span>
          <span>رمز الوثيقة: <strong>JM-NOT-${noticeNo}</strong></span>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = {
  COMPANY,
  getEmployeeDetails,
  getDefaultEmployee,
  enrichEmployeeSalary,
  resolveEmployeeAndRecord,
  getBaseStyles,
  renderAbsencePenaltyNoticeHtml,
  renderInstructionPenaltyNoticeHtml,
  renderClearanceFormHtml,
  renderContractNonRenewalHtml,
  renderPenaltyFormHtml,
  renderResignationTerminationFormHtml,
  renderLeaveFormHtml,
  renderSalaryCertHtml,
  renderAttendanceNoticeHtml
};
