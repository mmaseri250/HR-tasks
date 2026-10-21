// server/modules/officialTemplates.js - Pixel-Perfect Official Forms & Letters Generator
// Exactly matching official forms: JM-HR-F-001 (Leave), JM-HR-F-002 (Penalty), JM-HR-F-003 (Resignation & Termination)
const { get } = require('../database/db');

const COMPANY = {
  nameAr: 'شركة جوهرة المجد للتجارة والمقاولات',
  nameEn: 'Jawharat Al-Majd Trading & Contracting Co.',
  cr: '7004872169',
  vat: '310492837400003',
  address: 'المملكة العربية السعودية، منطقة عسير، أبها - مول سيتي بارك',
  phone: '920012405',
  email: 'info@jalmajd.com',
  website: 'https://jalmajd.com'
};

function getBaseStyles() {
  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
      * { box-sizing: border-box; font-family: 'Cairo', sans-serif; }
      body { margin: 0; padding: 20px; background: #f8fafc; color: #1e293b; direction: rtl; }
      .doc-container { max-width: 820px; margin: 0 auto; background: #fff; padding: 35px 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; position: relative; }
      .doc-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f766e; padding-bottom: 15px; margin-bottom: 20px; }
      .doc-header-logo { text-align: right; }
      .doc-header-logo h1 { margin: 0; font-size: 20px; color: #0f766e; font-weight: 900; }
      .doc-header-logo p { margin: 2px 0 0; font-size: 11px; color: #64748b; font-weight: 600; }
      .doc-meta { text-align: left; font-size: 11px; color: #475569; line-height: 1.5; }
      .doc-meta span { display: block; }
      .doc-title-box { background: #f0fdfa; border: 1px solid #ccfbf1; padding: 10px 15px; border-radius: 8px; text-align: center; margin-bottom: 22px; }
      .doc-title-box h2 { margin: 0; font-size: 18px; color: #115e59; font-weight: 900; }
      .doc-title-box p { margin: 2px 0 0; font-size: 12px; color: #0d9488; font-weight: 700; }
      .section-title { font-size: 13px; font-weight: 800; color: #0f766e; border-right: 4px solid #0f766e; padding-right: 8px; margin: 18px 0 8px; }
      table.doc-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
      table.doc-table th, table.doc-table td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: right; }
      table.doc-table th { background: #f8fafc; color: #334155; font-weight: 700; width: 22%; }
      table.doc-table td { color: #0f172a; }
      .checkbox-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 10px 0; font-size: 12px; }
      .checkbox-item { display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; }
      .checkbox-item.checked { background: #f0fdf4; border-color: #86efac; font-weight: 700; color: #166534; }
      .box-box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 15px; background: #fff; font-size: 12px; }
      .signatures-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
      .sig-box { border: 1px dashed #cbd5e1; border-radius: 8px; padding: 12px; text-align: center; font-size: 11px; background: #f8fafc; }
      .sig-box h4 { margin: 0 0 6px; color: #0f766e; font-size: 12px; font-weight: 800; }
      .sig-box p { margin: 4px 0; color: #475569; }
      .sig-line { border-bottom: 1px solid #94a3b8; width: 80%; margin: 25px auto 8px; }
      .stamp-seal { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 10px; font-weight: 800; }
      .stamp-approved { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
      .stamp-pending { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
      .qr-badge { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #64748b; }
      .print-btn { position: fixed; bottom: 25px; left: 25px; background: #0f766e; color: #fff; border: none; padding: 10px 22px; border-radius: 999px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(15,118,110,0.4); display: flex; align-items: center; gap: 8px; font-size: 13px; z-index: 1000; }
      @media print {
        body { background: #fff; padding: 0; }
        .doc-container { box-shadow: none; border: none; padding: 15px; max-width: 100%; }
        .print-btn { display: none; }
      }
    </style>
  `;
}

/**
 * 1. LEAVE REQUEST FORM (نموذج طلب إجازة - Form No: JM-HR-F-001)
 */
function renderLeaveFormHtml(leaveId) {
  const leave = get(`
    SELECT l.*,
           e.emp_code, e.full_name_ar, e.national_id, e.nationality, e.job_title_ar,
           e.join_date, e.basic_salary, e.housing_allowance, e.transport_allowance, e.other_allowance,
           e.annual_leave_balance, e.phone, e.email,
           d.name_ar AS department_name, b.name_ar AS branch_name,
           m.full_name_ar AS direct_manager_name,
           sub.full_name_ar AS substitute_name
    FROM leaves l
    JOIN employees e ON l.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    LEFT JOIN employees m ON l.manager_id = m.id
    LEFT JOIN employees sub ON l.substitute_emp_id = sub.id
    WHERE l.id = ?
  `, [leaveId]);

  if (!leave) return '<h1>طلب الإجازة غير موجود</h1>';

  const leaveTypes = ['إجازة سنوية', 'إجازة مرضية', 'إجازة اضطرارية', 'إجازة بدون راتب', 'إجازة وفاة', 'إجازة مولود'];

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>نموذج طلب إجازة - ${leave.request_no}</title>
      ${getBaseStyles()}
    </head>
    <body>
      <button class="print-btn" onclick="window.print()">🖨️ طباعة النموذج الرسمي</button>
      
      <div class="doc-container">
        <!-- Header -->
        <div class="doc-header">
          <div class="doc-header-logo">
            <h1>${COMPANY.nameAr}</h1>
            <p>${COMPANY.nameEn}</p>
            <p>س.ت: ${COMPANY.cr} | الرقم الضريبي: ${COMPANY.vat}</p>
          </div>
          <div class="doc-meta">
            <span><strong>رقم النموذج:</strong> JM-HR-F-001</span>
            <span><strong>الإصدار:</strong> 1.0</span>
            <span><strong>رقم الطلب:</strong> ${leave.request_no}</span>
            <span><strong>تاريخ التقديم:</strong> ${leave.created_at ? leave.created_at.split(' ')[0] : '2026-10-21'}</span>
          </div>
        </div>

        <!-- Title -->
        <div class="doc-title-box">
          <h2>نموذج طلب إجازة</h2>
          <p>LEAVE REQUEST FORM</p>
        </div>

        <!-- Section 1: Employee Data -->
        <div class="section-title">1. بيانات الموظف (Employee Information)</div>
        <table class="doc-table">
          <tr>
            <th>الرقم الوظيفي:</th>
            <td><strong>${leave.emp_code}</strong></td>
            <th>اسم الموظف:</th>
            <td><strong>${leave.full_name_ar}</strong></td>
          </tr>
          <tr>
            <th>رقم الهوية / الإقامة:</th>
            <td>${leave.national_id || 'غير متوفر'}</td>
            <th>الجنسية:</th>
            <td>${leave.nationality}</td>
          </tr>
          <tr>
            <th>الإدارة / القسم:</th>
            <td>${leave.department_name || ''} - ${leave.branch_name || ''}</td>
            <th>المسمى الوظيفي:</th>
            <td>${leave.job_title_ar}</td>
          </tr>
          <tr>
            <th>تاريخ المباشرة:</th>
            <td>${leave.join_date || 'غير متوفر'}</td>
            <th>رصيد الإجازات المتاح:</th>
            <td><strong>${leave.annual_leave_balance || 0} يوم</strong></td>
          </tr>
        </table>

        <!-- Section 2: Leave Type -->
        <div class="section-title">2. نوع الإجازة المطلوبة (Leave Type)</div>
        <div class="checkbox-grid">
          ${leaveTypes.map(t => `
            <div class="checkbox-item ${leave.leave_type === t ? 'checked' : ''}">
              <span>${leave.leave_type === t ? '☑' : '☐'}</span>
              <span>${t}</span>
            </div>
          `).join('')}
        </div>

        <!-- Section 3: Leave Details -->
        <div class="section-title">3. تفاصيل مدة الإجازة (Leave Details)</div>
        <table class="doc-table">
          <tr>
            <th>تاريخ البدء:</th>
            <td><strong>${leave.start_date}</strong></td>
            <th>تاريخ الانتهاء:</th>
            <td><strong>${leave.end_date}</strong></td>
          </tr>
          <tr>
            <th>عدد الأيام المطلوبة:</th>
            <td><strong style="color: #0f766e; font-size: 14px;">${leave.days_count} يوم</strong></td>
            <th>الموظف البديل المكلف:</th>
            <td>${leave.substitute_name || 'لا يوجد موظف بديل محدد'}</td>
          </tr>
          <tr>
            <th>سبب / ملاحظات الإجازة:</th>
            <td colspan="3">${leave.reason || 'إجازة اعتيادية سنوية'}</td>
          </tr>
        </table>

        <!-- Section 4: Employee Declaration -->
        <div class="box-box" style="background: #fafaf9;">
          <strong>إقرار وتعهد الموظف:</strong>
          <p style="margin: 4px 0 0; color: #444; font-size: 11px;">
            أقر أنا الموظف الموقع أعلاه بصحة البيانات المذكورة، وأتعهد بمباشرة العمل فور انتهاء إجازتي في التاريخ المحدد، وفي حال التأخر دون إشعار مسبق وعذر مقبول أكون عرضة للإجراءات النظامية المعمول بها بالشركة ونظام العمل السعودي.
          </p>
        </div>

        <!-- 4-Step Approval Grid -->
        <div class="section-title">4. مسار الموافقات الرباعي المعتمد (4-Step Workflow Approval)</div>
        <div class="signatures-grid">
          <!-- Step 1: Employee & Direct Manager -->
          <div class="sig-box">
            <h4>[1] توصية المدير المباشر</h4>
            <p><strong>الاسم:</strong> ${leave.manager_name || leave.direct_manager_name || 'المدير المباشر'}</p>
            <p><strong>القرار:</strong> ${leave.manager_status || 'معلق'}</p>
            <p><strong>الملاحظات:</strong> ${leave.manager_comment || 'موافقة مبدئية'}</p>
            <div class="sig-line"></div>
            <p>التوقيع والاعتماد</p>
          </div>

          <!-- Step 2: HR Verification -->
          <div class="sig-box">
            <h4>[2] تدقيق قسم الموارد البشرية</h4>
            <p><strong>المختص:</strong> ${leave.hr_verifier_name || 'أخصائي الموارد البشرية'}</p>
            <p><strong>التدقيق:</strong> ${leave.hr_verify_status || 'تم التحقق من الرصيد والبيانات'}</p>
            <p><strong>الملاحظات:</strong> ${leave.hr_verify_comment || 'مستحق نظاماً'}</p>
            <div class="sig-line"></div>
            <p>التوقيع والتدقيق</p>
          </div>

          <!-- Step 3: HR Director Final Approval -->
          <div class="sig-box">
            <h4>[3] اعتماد مدير الموارد البشرية</h4>
            <p><strong>المدير:</strong> ${leave.hr_director_name || 'عبدالملك سعيد الشريف'}</p>
            <p><strong>الحالة:</strong> <span class="stamp-seal ${leave.status.includes('معتمد') ? 'stamp-approved' : 'stamp-pending'}">${leave.status}</span></p>
            <p><strong>القرار:</strong> ${leave.hr_director_comment || (leave.status.includes('معتمد') ? 'معتمد ومحسوم من الرصيد' : 'قيد الإجراء')}</p>
            <div class="sig-line"></div>
            <p>الاعتماد والختم الرسمي</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="qr-badge">
          <div>
            <span>وثيقة نظامية رسمية صادرة إلكترونياً من نظام إدارة الموارد البشرية بشركة جوهرة المجد</span>
            <br>
            <span>رمز التحقق الرقمي: REF-${leave.request_no}-${leave.id}</span>
          </div>
          <div style="font-weight: 800; color: #0f766e;">
            ختم الاعتماد الرقمي ✓
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 2. PENALTY PROCEDURE FORM (نموذج إجراء جزائي - Form No: JM-HR-F-002)
 */
function renderPenaltyFormHtml(penaltyId) {
  const penalty = get(`
    SELECT p.*,
           e.emp_code, e.full_name_ar, e.national_id, e.nationality, e.job_title_ar,
           d.name_ar AS department_name, b.name_ar AS branch_name,
           m.full_name_ar AS direct_manager_name
    FROM penalties_issued p
    JOIN employees e ON p.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    LEFT JOIN employees m ON e.manager_id = m.id
    WHERE p.id = ?
  `, [penaltyId]);

  if (!penalty) return '<h1>القرار الجزائي غير موجود</h1>';

  const repetitions = ['المرة الأولى', 'المرة الثانية', 'المرة الثالثة', 'المرة الرابعة'];

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>نموذج إجراء جزائي - ${penalty.decision_no}</title>
      ${getBaseStyles()}
    </head>
    <body>
      <button class="print-btn" onclick="window.print()">🖨️ طباعة النموذج الرسمي</button>
      
      <div class="doc-container">
        <!-- Header -->
        <div class="doc-header">
          <div class="doc-header-logo">
            <h1>${COMPANY.nameAr}</h1>
            <p>${COMPANY.nameEn}</p>
            <p>س.ت: ${COMPANY.cr} | الرقم الضريبي: ${COMPANY.vat}</p>
          </div>
          <div class="doc-meta">
            <span><strong>رقم النموذج:</strong> JM-HR-F-002</span>
            <span><strong>الإصدار:</strong> 1.0</span>
            <span><strong>رقم القرار:</strong> ${penalty.decision_no}</span>
            <span><strong>تاريخ الإصدار:</strong> ${penalty.issued_at ? penalty.issued_at.split(' ')[0] : '2026-10-21'}</span>
          </div>
        </div>

        <!-- Title -->
        <div class="doc-title-box" style="background: #fff1f2; border-color: #fecdd3;">
          <h2 style="color: #9f1239;">نموذج إجراء جزائي</h2>
          <p style="color: #be123c;">PENALTY PROCEDURE FORM</p>
        </div>

        <!-- Section 1: Employee Data -->
        <div class="section-title">بيانات الموظف (Employee Data)</div>
        <table class="doc-table">
          <tr>
            <th>الرقم الوظيفي (No):</th>
            <td><strong>${penalty.emp_code}</strong></td>
            <th>الاسم (Name):</th>
            <td><strong>${penalty.full_name_ar}</strong></td>
          </tr>
          <tr>
            <th>مسمى الوظيفة (Job Title):</th>
            <td>${penalty.job_title_ar}</td>
            <th>الإدارة (Management):</th>
            <td>${penalty.department_name || 'الإدارة العامة'}</td>
          </tr>
          <tr>
            <th>الفرع / الموقع:</th>
            <td>${penalty.branch_name || 'الإدارة العامة'}</td>
            <th>المدير المباشر:</th>
            <td>${penalty.direct_manager_name || 'مدير الإدارة'}</td>
          </tr>
        </table>

        <!-- Section 2: Repeating the violation -->
        <div class="section-title">تكرار المخالفة (Repeating the violation)</div>
        <div class="checkbox-grid" style="grid-template-columns: repeat(4, 1fr);">
          ${repetitions.map(r => `
            <div class="checkbox-item ${penalty.repetition_level === r ? 'checked' : ''}" style="${penalty.repetition_level === r ? 'background: #ffe4e6; border-color: #f43f5e; color: #9f1239;' : ''}">
              <span>${penalty.repetition_level === r ? '☑' : '☐'}</span>
              <span>${r}</span>
            </div>
          `).join('')}
        </div>

        <!-- Section 3: Violation Description & Date -->
        <div class="section-title">تاريخ ووصف المخالفة (Violation Description & Date)</div>
        <table class="doc-table">
          <tr>
            <th>تاريخ المخالفة (Penalty Date):</th>
            <td colspan="3"><strong>${penalty.incident_date}</strong></td>
          </tr>
          <tr>
            <th>بند اللائحة المعتمدة:</th>
            <td colspan="3"><strong>كود المخالفة: [${penalty.violation_code}] - ${penalty.category || 'لائحة تنظيم العمل'}</strong></td>
          </tr>
          <tr>
            <th>وصف المخالفة التفصيلي:</th>
            <td colspan="3" style="line-height: 1.6;">${penalty.violation_text}</td>
          </tr>
          <tr>
            <th>نتائج التحقيق الإداري:</th>
            <td colspan="3" style="line-height: 1.6;">${penalty.investigation_details || 'ثبتت المخالفة بموجب سجلات الحضور والنظم الإدارية والتحقيق الداخلي.'}</td>
          </tr>
        </table>

        <!-- Section 4: Penalty Procedure -->
        <div class="section-title">الإجراء الجزائي المقرر (Penalty Procedure)</div>
        <div class="box-box" style="background: #fff1f2; border-color: #fecdd3; color: #881337;">
          <div style="font-size: 14px; font-weight: 800; margin-bottom: 4px;">
            ⚠️ القرار: ${penalty.penalty_text}
          </div>
          <div style="font-size: 12px;">
            نوع الجزاء: <strong>${penalty.deduction_type || 'خصم راتب'}</strong> | أيام الخصم المعتمدة: <strong>${penalty.deduction_days || 0} يوم</strong>
          </div>
        </div>

        <!-- Section 5: Signatures -->
        <div class="signatures-grid">
          <div class="sig-box">
            <h4>توقيع الموظف (Employee signature)</h4>
            <p>الاسم: ${penalty.full_name_ar}</p>
            <p>التاريخ: ..... / ..... / 2026م</p>
            <div class="sig-line"></div>
            <p>توقيع الموظف بالعلم والإقرار</p>
          </div>
          <div class="sig-box">
            <h4>مدير الإدارة (Dept. Manager)</h4>
            <p>الاسم: ${penalty.direct_manager_name || 'مدير الإدارة'}</p>
            <p>التوقيع: معتمد إلكترونياً</p>
            <div class="sig-line"></div>
            <p>توصية وملاحظات مدير الإدارة</p>
          </div>
          <div class="sig-box">
            <h4>اعتماد مدير الموارد البشرية (HR Manager)</h4>
            <p>الاسم: عبدالملك سعيد الشريف</p>
            <p>التاريخ: ${penalty.issued_at ? penalty.issued_at.split(' ')[0] : '2026-10-21'}</p>
            <div class="sig-line"></div>
            <p><span class="stamp-seal stamp-approved">معتمد ومطبق رسمياً ✓</span></p>
          </div>
        </div>

        <!-- Distribution Routing -->
        <div style="margin-top: 15px; font-size: 10px; color: #64748b; display: flex; justify-content: space-around; border-top: 1px dotted #cbd5e1; padding-top: 10px;">
          <span>• الأصل: لملف الموظف</span>
          <span>• صورة: لشؤون الموظفين</span>
          <span>• صورة: لمحاسب الرواتب للتطبيق في المسير</span>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 3. RESIGNATION & TERMINATION FORM (نموذج الاستقالة وإنهاء عقد العمل - v3)
 */
function renderResignationTerminationFormHtml(termId) {
  const term = get('SELECT * FROM terminated_employees WHERE id = ?', [termId]);
  if (!term) return '<h1>سجل إنهاء الخدمة غير موجود</h1>';

  const types = [
    { key: 'استقالة', label: 'استقالة (Resignation)' },
    { key: 'انتهاء عقد', label: 'انتهاء عقد (Contract Expiry)' },
    { key: 'إنهاء خدمة', label: 'إنهاء خدمة (Termination)' },
    { key: 'فترة التجربة', label: 'فترة التجربة (Probation Failure)' },
    { key: 'مادة 80', label: 'فسخ بموجب المادة 80' }
  ];

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>نموذج الاستقالة وإنهاء عقد العمل - ${term.emp_code}</title>
      ${getBaseStyles()}
    </head>
    <body>
      <button class="print-btn" onclick="window.print()">🖨️ طباعة النموذج الرسمي</button>
      
      <div class="doc-container">
        <!-- Header -->
        <div class="doc-header">
          <div class="doc-header-logo">
            <h1>${COMPANY.nameAr}</h1>
            <p>${COMPANY.nameEn}</p>
            <p>س.ت: ${COMPANY.cr} | الرقم الضريبي: ${COMPANY.vat}</p>
          </div>
          <div class="doc-meta">
            <span><strong>رقم النموذج:</strong> JM-HR-F-003</span>
            <span><strong>الإصدار:</strong> 3.0 (v3)</span>
            <span><strong>تاريخ النموذج:</strong> ${term.termination_date}</span>
          </div>
        </div>

        <!-- Title -->
        <div class="doc-title-box">
          <h2>نموذج الاستقالة وإنهاء عقد العمل</h2>
          <p>RESIGNATION & EMPLOYMENT TERMINATION FORM (v3)</p>
        </div>

        <!-- 1. Employee Information -->
        <div class="section-title">1. بيانات الموظف (Employee Information)</div>
        <table class="doc-table">
          <tr>
            <th>الرقم الوظيفي (Employee ID):</th>
            <td><strong>${term.emp_code}</strong></td>
            <th>اسم الموظف (Employee Name):</th>
            <td><strong>${term.full_name_ar}</strong></td>
          </tr>
          <tr>
            <th>رقم الهوية / الإقامة:</th>
            <td>${term.national_id || 'غير متوفر'}</td>
            <th>الجنسية (Nationality):</th>
            <td>${term.nationality}</td>
          </tr>
          <tr>
            <th>الإدارة (Department):</th>
            <td>${term.department_name || 'الإدارة العامة'}</td>
            <th>المسمى الوظيفي (Job Title):</th>
            <td>${term.job_title_ar}</td>
          </tr>
          <tr>
            <th>تاريخ التعيين (Joining Date):</th>
            <td>${term.join_date || 'غير متوفر'}</td>
            <th>مدة الخدمة الفعلية:</th>
            <td><strong>${term.service_years} سنة</strong></td>
          </tr>
        </table>

        <!-- 2. Request Type -->
        <div class="section-title">2. نوع الطلب (Request Type)</div>
        <div class="checkbox-grid">
          ${types.map(t => `
            <div class="checkbox-item ${term.termination_type.includes(t.key) ? 'checked' : ''}">
              <span>${term.termination_type.includes(t.key) ? '☑' : '☐'}</span>
              <span>${t.label}</span>
            </div>
          `).join('')}
        </div>

        <!-- 3. End of Employment Information -->
        <div class="section-title">3. معلومات انتهاء الخدمة (End of Employment Information)</div>
        <table class="doc-table">
          <tr>
            <th>تاريخ انتهاء الخدمة:</th>
            <td><strong>${term.termination_date}</strong></td>
            <th>آخر يوم عمل:</th>
            <td><strong>${term.termination_date}</strong></td>
          </tr>
          <tr>
            <th>سبب إنهاء الخدمة:</th>
            <td colspan="3">${term.termination_reason || 'إنهاء العلاقة التعاقدية وتسوية المستحقات النظامية'}</td>
          </tr>
        </table>

        <!-- 4. Final Financial Settlement Summary -->
        <div class="section-title">4. خلاصة التسوية المالية ومكافأة نهاية الخدمة (نظام العمل م 84 و 85)</div>
        <table class="doc-table">
          <tr>
            <th>آخر راتب شهري:</th>
            <td>${term.last_salary} ر.س</td>
            <th>مكافأة نهاية الخدمة:</th>
            <td><strong>${term.end_of_service_reward} ر.س</strong></td>
          </tr>
          <tr>
            <th>تعويض رصيد الإجازات:</th>
            <td>${term.leave_compensation} ر.س</td>
            <th>الخصومات والسلف:</th>
            <td>${term.deductions_amount} ر.س</td>
          </tr>
          <tr style="background: #f0fdf4;">
            <th style="color: #166534; font-size: 13px;">صافي المستحقات النهائية:</th>
            <td colspan="3"><strong style="color: #166534; font-size: 16px;">${term.total_settlement} ريال سعودي</strong></td>
          </tr>
        </table>

        <!-- 5. Employee Declaration -->
        <div class="box-box" style="background: #fafaf9;">
          <strong>5. إقرار الموظف (Employee Declaration):</strong>
          <p style="margin: 4px 0 0; color: #333; font-size: 11px; line-height: 1.5;">
            أقر أنا الموقع أدناه بأنني تقدمت بهذا الطلب بإرادتي الكاملة، وألتزم بإكمال جميع إجراءات التسليم والإخلاء وتسوية أي التزامات أو عهد تخص عملي لدى شركة جوهرة المجد، وبمجرد استلام صافي مستحقاتي الموضحة أعلاه أكون قد أبرأت ذمة الشركة من أي حقوق عمالية أو مالية حالية أو مستقبلية.
          </p>
        </div>

        <!-- 6. HR Section Checkbox Items -->
        <div class="section-title">6. تدقيق قسم شؤون الموظفين (HR Personnel Section)</div>
        <table class="doc-table">
          <tr>
            <th>حالة إخلاء الطرف:</th>
            <td><strong style="color: #0f766e;">${term.clearance_status}</strong></td>
            <th>منصة قوى (Qiwa):</th>
            <td><strong>${term.qiwa_status}</strong></td>
          </tr>
        </table>

        <!-- 7. Approvals Grid -->
        <div class="signatures-grid">
          <div class="sig-box">
            <h4>توقيع الموظف</h4>
            <p>${term.full_name_ar}</p>
            <div class="sig-line"></div>
            <p>التوقيع والتاريخ</p>
          </div>
          <div class="sig-box">
            <h4>توصية المدير المباشر</h4>
            <p>موافق على قبول الإنهاء</p>
            <div class="sig-line"></div>
            <p>التوقيع والتاريخ</p>
          </div>
          <div class="sig-box">
            <h4>اعتماد مدير الموارد البشرية</h4>
            <p>عبدالملك سعيد الشريف</p>
            <div class="sig-line"></div>
            <p><span class="stamp-seal stamp-approved">معتمد رسمياً ✓</span></p>
          </div>
        </div>

        <!-- Footer -->
        <div class="qr-badge">
          <span>وثيقة إدارية رسمية معتمدة وفق نظام العمل السعودي ولائحة شركة جوهرة المجد</span>
          <span>رمز الوثيقة: JM-TERM-${term.emp_code}</span>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * 4. ATTENDANCE NOTICE / WARNING LETTER (إشعار رسمي بالغياب أو التأخير أو الانقطاع - م 80)
 */
function renderAttendanceNoticeHtml(noticeId) {
  const notice = get(`
    SELECT n.*,
           e.emp_code, e.full_name_ar, e.national_id, e.nationality, e.job_title_ar,
           d.name_ar AS department_name, b.name_ar AS branch_name
    FROM attendance_notices n
    JOIN employees e ON n.emp_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    WHERE n.id = ?
  `, [noticeId]);

  if (!notice) return '<h1>الإشعار غير موجود</h1>';

  const isArticle80 = notice.notice_type.includes('المادة 80') || notice.notice_type.includes('انقطاع');

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>${notice.notice_type} - ${notice.notice_no}</title>
      ${getBaseStyles()}
    </head>
    <body>
      <button class="print-btn" onclick="window.print()">🖨️ طباعة الخطاب الرسمي</button>
      
      <div class="doc-container">
        <!-- Header -->
        <div class="doc-header">
          <div class="doc-header-logo">
            <h1>${COMPANY.nameAr}</h1>
            <p>${COMPANY.nameEn}</p>
            <p>س.ت: ${COMPANY.cr} | الرقم الضريبي: ${COMPANY.vat}</p>
          </div>
          <div class="doc-meta">
            <span><strong>رقم الإشعار:</strong> ${notice.notice_no}</span>
            <span><strong>تاريخ الإصدار:</strong> ${notice.created_at ? notice.created_at.split(' ')[0] : '2026-10-21'}</span>
            <span><strong>الجهة المصدرة:</strong> إدارة الموارد البشرية</span>
          </div>
        </div>

        <!-- Title -->
        <div class="doc-title-box" style="${isArticle80 ? 'background: #fff1f2; border-color: #fecdd3;' : ''}">
          <h2 style="${isArticle80 ? 'color: #9f1239;' : ''}">${notice.notice_type}</h2>
          <p style="${isArticle80 ? 'color: #be123c;' : ''}">OFFICIAL ATTENDANCE & DISCIPLINARY NOTICE</p>
        </div>

        <p style="font-size: 13px; line-height: 1.8;">
          <strong>إلى الموظف المكرم:</strong> ${notice.full_name_ar} (الرقم الوظيفي: ${notice.emp_code})<br>
          <strong>المسمى الوظيفي:</strong> ${notice.job_title_ar || 'موظف'} | <strong>الإدارة:</strong> ${notice.department_name || notice.department || 'الإدارة العامة'}<br>
          <strong>السلام عليكم ورحمة الله وبركاته،،،</strong>
        </p>

        <p style="font-size: 13px; line-height: 1.8; text-align: justify;">
          إشارة إلى سجلات الحضور والانصراف المعتمدة بالمنشأة، ولوائح العمل المنظمة المعمول بها داخل شركة جوهرة المجد والمتوافقة مع نظام العمل السعودي، نفيدكم بصدور هذا الإشعار الرسمي بالواقعة الموضحة أدناه:
        </p>

        <table class="doc-table">
          <tr>
            <th>نوع المخالفة:</th>
            <td><strong>${notice.notice_type}</strong></td>
            <th>تاريخ الواقعة:</th>
            <td><strong>${notice.incident_date}</strong></td>
          </tr>
          ${notice.duration_mins > 0 ? `
          <tr>
            <th>مدة التأخير:</th>
            <td colspan="3"><strong style="color: #b91c1c;">${notice.duration_mins} دقيقة</strong></td>
          </tr>
          ` : ''}
          ${notice.absence_days > 0 ? `
          <tr>
            <th>أيام الغياب:</th>
            <td><strong style="color: #b91c1c;">${notice.absence_days} يوم</strong></td>
            <th>الغياب المتصل:</th>
            <td><strong>${notice.consecutive_days || 0} يوم متصل</strong></td>
          </tr>
          ` : ''}
          <tr>
            <th>السند النظامي والقانوني:</th>
            <td colspan="3" style="color: #0f766e; font-weight: 700;">${notice.legal_basis || 'نظام العمل السعودي ولائحة تنظيم العمل'}</td>
          </tr>
          <tr>
            <th>التفاصيل والوقائع:</th>
            <td colspan="3" style="line-height: 1.6;">${notice.details}</td>
          </tr>
          <tr>
            <th>الإجراء الإداري المترتب:</th>
            <td colspan="3"><strong style="color: #dc2626;">${notice.penalty_applied}</strong></td>
          </tr>
        </table>

        ${isArticle80 ? `
        <div class="box-box" style="background: #fff1f2; border: 2px solid #fda4af; color: #881337;">
          <strong>⚠️ إنذار كتابي نهائي بموجب المادة (80) من نظام العمل السعودي:</strong>
          <p style="margin: 4px 0 0; font-size: 11px; line-height: 1.6;">
            نلفت عنايتكم بأن استمرار الانقطاع عن العمل دون سبب مشروع يجاوز 15 يوماً متصلة أو 30 يوماً متقطعة خلال السنة العقدية يمنح المنشأة الحق القانوني في فسخ عقد العمل دون مكافأة أو إشعار أو تعويض بموجب أحكام الفقرة (7) من المادة (80) من نظام العمل السعودي.
          </p>
        </div>
        ` : `
        <div class="box-box" style="background: #f8fafc;">
          <strong>تنبيه إداري:</strong>
          <p style="margin: 4px 0 0; font-size: 11px; color: #475569;">
            يُرجى الالتزام التام بمواعيد العمل الرسمية وضوابط البصمة البيومترية تفادياً لتصعيد الجزاءات التأديبية المنصوص عليها في لائحة تنظيم العمل.
          </p>
        </div>
        `}

        <!-- Employee Acknowledgment -->
        <div class="signatures-grid" style="grid-template-columns: 1fr 1fr;">
          <div class="sig-box">
            <h4>إقرار وتوقيع الموظف بالاستلام</h4>
            <p>أقر أنا الموظف المذكور أعلاه باستلامي واطلاعي على هذا الإشعار.</p>
            <p><strong>حالة الإقرار:</strong> ${notice.status}</p>
            <p><strong>تاريخ الإقرار:</strong> ${notice.acknowledged_at ? notice.acknowledged_at.split(' ')[0] : 'بانتظار التوقيع'}</p>
            <div class="sig-line"></div>
            <p>التوقيع</p>
          </div>

          <div class="sig-box">
            <h4>إدارة الموارد البشرية</h4>
            <p>شركة جوهرة المجد للتجارة والمقاولات</p>
            <p>مدير الموارد البشرية: عبدالملك سعيد الشريف</p>
            <div class="sig-line"></div>
            <p><span class="stamp-seal stamp-approved">الختم الإداري الرسمي ✓</span></p>
          </div>
        </div>

        <div class="qr-badge">
          <span>إشعار إلكتروني رسمي مثبت بالنظام الداخلي - لا يتطلب إرسال بريد خارجي</span>
          <span>رمز الوثيقة: JM-NOT-${notice.notice_no}</span>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = {
  renderLeaveFormHtml,
  renderPenaltyFormHtml,
  renderResignationTerminationFormHtml,
  renderAttendanceNoticeHtml
};
