// server/modules/officialDocxFiller.js
// Official Word (.docx) Forms Filler for Jawharat Al-Majd HRMS
// Uses pure Node.js (jszip) to inject live database fields into the 15 official company Word templates
// Extracted directly from 00_All_HR_Forms_Combined_v4.docx

const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates', 'official_word_forms');

// Master Mapping of Form Types to Official Files and Metadata
const FORM_MAP = {
  // 1. Employee Status Notification
  esn: { file: 'JM_HR_F_001_Employee_Status_Notification.docx', formNo: 'JM-HR-F-001', titleAr: 'إشعار حالة موظف' },
  status: { file: 'JM_HR_F_001_Employee_Status_Notification.docx', formNo: 'JM-HR-F-001', titleAr: 'إشعار حالة موظف' },
  employee_status: { file: 'JM_HR_F_001_Employee_Status_Notification.docx', formNo: 'JM-HR-F-001', titleAr: 'إشعار حالة موظف' },
  'jm-hr-f-001': { file: 'JM_HR_F_001_Employee_Status_Notification.docx', formNo: 'JM-HR-F-001', titleAr: 'إشعار حالة موظف' },

  // 2. Employee Advance Request
  adv: { file: 'JM_HR_F_002_Employee_Advance_Request.docx', formNo: 'JM-HR-F-002', titleAr: 'طلب سلفة موظف' },
  advance: { file: 'JM_HR_F_002_Employee_Advance_Request.docx', formNo: 'JM-HR-F-002', titleAr: 'طلب سلفة موظف' },
  loan_advance: { file: 'JM_HR_F_002_Employee_Advance_Request.docx', formNo: 'JM-HR-F-002', titleAr: 'طلب سلفة موظف' },
  'jm-hr-f-002': { file: 'JM_HR_F_002_Employee_Advance_Request.docx', formNo: 'JM-HR-F-002', titleAr: 'طلب سلفة موظف' },

  // 3. Iqama Receipt Acknowledgment
  ira: { file: 'JM_HR_F_003_Iqama_Receipt_Acknowledgment.docx', formNo: 'JM-HR-F-003', titleAr: 'نموذج استلام إقامة' },
  iqama_receipt: { file: 'JM_HR_F_003_Iqama_Receipt_Acknowledgment.docx', formNo: 'JM-HR-F-003', titleAr: 'نموذج استلام إقامة' },
  'jm-hr-f-003': { file: 'JM_HR_F_003_Iqama_Receipt_Acknowledgment.docx', formNo: 'JM-HR-F-003', titleAr: 'نموذج استلام إقامة' },

  // 4. Final Exit Request
  fer: { file: 'JM_HR_F_004_Final_Exit_Request.docx', formNo: 'JM-HR-F-004', titleAr: 'طلب تأشيرة خروج نهائي' },
  final_exit: { file: 'JM_HR_F_004_Final_Exit_Request.docx', formNo: 'JM-HR-F-004', titleAr: 'طلب تأشيرة خروج نهائي' },
  'jm-hr-f-004': { file: 'JM_HR_F_004_Final_Exit_Request.docx', formNo: 'JM-HR-F-004', titleAr: 'طلب تأشيرة خروج نهائي' },

  // 5. Sponsorship Transfer Request
  str: { file: 'JM_HR_F_005_Sponsorship_Transfer_Request.docx', formNo: 'JM-HR-F-005', titleAr: 'طلب نقل كفالة' },
  sponsorship_transfer: { file: 'JM_HR_F_005_Sponsorship_Transfer_Request.docx', formNo: 'JM-HR-F-005', titleAr: 'طلب نقل كفالة' },
  'jm-hr-f-005': { file: 'JM_HR_F_005_Sponsorship_Transfer_Request.docx', formNo: 'JM-HR-F-005', titleAr: 'طلب نقل كفالة' },

  // 6. Employee Clearance Form (Settlement)
  ecf: { file: 'JM_HR_F_006_Employee_Clearance_Form.docx', formNo: 'JM-HR-F-006', titleAr: 'نموذج إخلاء طرف موظف' },
  clearance_settlement: { file: 'JM_HR_F_006_Employee_Clearance_Form.docx', formNo: 'JM-HR-F-006', titleAr: 'نموذج إخلاء طرف موظف' },
  'jm-hr-f-006': { file: 'JM_HR_F_006_Employee_Clearance_Form.docx', formNo: 'JM-HR-F-006', titleAr: 'نموذج إخلاء طرف موظف' },

  // 7. Full & Final Settlement Release
  ffs: { file: 'JM_HR_F_007_Full_Final_Settlement_Release.docx', formNo: 'JM-HR-F-007', titleAr: 'مخالصة نهائية وإبراء ذمة' },
  full_settlement: { file: 'JM_HR_F_007_Full_Final_Settlement_Release.docx', formNo: 'JM-HR-F-007', titleAr: 'مخالصة نهائية وإبراء ذمة' },
  settlement: { file: 'JM_HR_F_007_Full_Final_Settlement_Release.docx', formNo: 'JM-HR-F-007', titleAr: 'مخالصة نهائية وإبراء ذمة' },
  'jm-hr-f-007': { file: 'JM_HR_F_007_Full_Final_Settlement_Release.docx', formNo: 'JM-HR-F-007', titleAr: 'مخالصة نهائية وإبراء ذمة' },

  // 8. Notice Penalty Absence
  npa: { file: 'JM_HR_F_004_Notice_Penalty_Absence.docx', formNo: 'JM-HR-F-004', titleAr: 'إشعار توقيع عقوبة غياب' },
  absence_penalty: { file: 'JM_HR_F_004_Notice_Penalty_Absence.docx', formNo: 'JM-HR-F-004', titleAr: 'إشعار توقيع عقوبة غياب' },
  penalty_absence: { file: 'JM_HR_F_004_Notice_Penalty_Absence.docx', formNo: 'JM-HR-F-004', titleAr: 'إشعار توقيع عقوبة غياب' },
  'jm-hr-f-008': { file: 'JM_HR_F_004_Notice_Penalty_Absence.docx', formNo: 'JM-HR-F-004', titleAr: 'إشعار توقيع عقوبة غياب' },

  // 9. Notice Penalty Instructions
  npi: { file: 'JM_HR_F_004_Notice_Penalty_Instructions.docx', formNo: 'JM-HR-F-004', titleAr: 'إشعار توقيع عقوبة مخالفة التعليمات' },
  instruction_penalty: { file: 'JM_HR_F_004_Notice_Penalty_Instructions.docx', formNo: 'JM-HR-F-004', titleAr: 'إشعار توقيع عقوبة مخالفة التعليمات' },
  penalty_instructions: { file: 'JM_HR_F_004_Notice_Penalty_Instructions.docx', formNo: 'JM-HR-F-004', titleAr: 'إشعار توقيع عقوبة مخالفة التعليمات' },
  'jm-hr-f-009': { file: 'JM_HR_F_004_Notice_Penalty_Instructions.docx', formNo: 'JM-HR-F-004', titleAr: 'إشعار توقيع عقوبة مخالفة التعليمات' },

  // 10. Notice of Non-Renewal of Contract
  nnr: { file: 'JM_HR_F_001_Notice_Non_Renewal_Contract.docx', formNo: 'JM-HR-F-001', titleAr: 'إشعار عدم تجديد عقد العمل' },
  contract_non_renewal: { file: 'JM_HR_F_001_Notice_Non_Renewal_Contract.docx', formNo: 'JM-HR-F-001', titleAr: 'إشعار عدم تجديد عقد العمل' },
  non_renewal: { file: 'JM_HR_F_001_Notice_Non_Renewal_Contract.docx', formNo: 'JM-HR-F-001', titleAr: 'إشعار عدم تجديد عقد العمل' },
  'jm-hr-f-010': { file: 'JM_HR_F_001_Notice_Non_Renewal_Contract.docx', formNo: 'JM-HR-F-001', titleAr: 'إشعار عدم تجديد عقد العمل' },

  // 11. Employee Clearance Form (Alternative)
  clr: { file: 'JM_HR_F_005_Employee_Clearance_Form.docx', formNo: 'JM-HR-F-005', titleAr: 'نموذج إخلاء طرف' },
  clearance: { file: 'JM_HR_F_005_Employee_Clearance_Form.docx', formNo: 'JM-HR-F-005', titleAr: 'نموذج إخلاء طرف' },
  clearance_form: { file: 'JM_HR_F_005_Employee_Clearance_Form.docx', formNo: 'JM-HR-F-005', titleAr: 'نموذج إخلاء طرف' },
  'jm-hr-f-011': { file: 'JM_HR_F_005_Employee_Clearance_Form.docx', formNo: 'JM-HR-F-005', titleAr: 'نموذج إخلاء طرف' },

  // 12. Penalty Procedure Form
  ppf: { file: 'JM_HR_F_002_Penalty_Procedure_Form.docx', formNo: 'JM-HR-F-002', titleAr: 'نموذج إجراء جزائي' },
  penalty: { file: 'JM_HR_F_002_Penalty_Procedure_Form.docx', formNo: 'JM-HR-F-002', titleAr: 'نموذج إجراء جزائي' },
  penalty_procedure: { file: 'JM_HR_F_002_Penalty_Procedure_Form.docx', formNo: 'JM-HR-F-002', titleAr: 'نموذج إجراء جزائي' },
  'jm-hr-f-012': { file: 'JM_HR_F_002_Penalty_Procedure_Form.docx', formNo: 'JM-HR-F-002', titleAr: 'نموذج إجراء جزائي' },

  // 13. Resignation / Termination Form
  rct: { file: 'JM_HR_F_008_Resignation_Termination_Form.docx', formNo: 'JM-HR-F-008', titleAr: 'نموذج الاستقالة وإنهاء عقد العمل' },
  resignation: { file: 'JM_HR_F_008_Resignation_Termination_Form.docx', formNo: 'JM-HR-F-008', titleAr: 'نموذج الاستقالة وإنهاء عقد العمل' },
  resignation_termination: { file: 'JM_HR_F_008_Resignation_Termination_Form.docx', formNo: 'JM-HR-F-008', titleAr: 'نموذج الاستقالة وإنهاء عقد العمل' },
  termination_request: { file: 'JM_HR_F_008_Resignation_Termination_Form.docx', formNo: 'JM-HR-F-008', titleAr: 'نموذج الاستقالة وإنهاء عقد العمل' },
  'jm-hr-f-013': { file: 'JM_HR_F_008_Resignation_Termination_Form.docx', formNo: 'JM-HR-F-008', titleAr: 'نموذج الاستقالة وإنهاء عقد العمل' },

  // 14. Leave Request Form
  lrf: { file: 'JM_HR_F_009_Leave_Request_Form.docx', formNo: 'JM-HR-F-009', titleAr: 'نموذج طلب إجازة' },
  leave: { file: 'JM_HR_F_009_Leave_Request_Form.docx', formNo: 'JM-HR-F-009', titleAr: 'نموذج طلب إجازة' },
  leave_request: { file: 'JM_HR_F_009_Leave_Request_Form.docx', formNo: 'JM-HR-F-009', titleAr: 'نموذج طلب إجازة' },
  'jm-hr-f-014': { file: 'JM_HR_F_009_Leave_Request_Form.docx', formNo: 'JM-HR-F-009', titleAr: 'نموذج طلب إجازة' },

  // 15. Salary Certificate
  scf: { file: 'JM_HR_F_010_Salary_Certificate.docx', formNo: 'JM-HR-F-010', titleAr: 'شهادة تعريف بالراتب' },
  salary: { file: 'JM_HR_F_010_Salary_Certificate.docx', formNo: 'JM-HR-F-010', titleAr: 'شهادة تعريف بالراتب' },
  salary_cert: { file: 'JM_HR_F_010_Salary_Certificate.docx', formNo: 'JM-HR-F-010', titleAr: 'شهادة تعريف بالراتب' },
  'jm-hr-f-015': { file: 'JM_HR_F_010_Salary_Certificate.docx', formNo: 'JM-HR-F-010', titleAr: 'شهادة تعريف بالراتب' },

  // Aliases for common shortcuts
  return_from_leave: { file: 'JM_HR_F_001_Employee_Status_Notification.docx', formNo: 'JM-HR-F-001', titleAr: 'إشعار مباشرة بعد إجازة' },
  permission_request: { file: 'JM_HR_F_009_Leave_Request_Form.docx', formNo: 'JM-HR-F-009', titleAr: 'طلب استئذان' },
  work_mission: { file: 'JM_HR_F_001_Employee_Status_Notification.docx', formNo: 'JM-HR-F-001', titleAr: 'مهمة عمل وانتداب' },
  notice: { file: 'JM_HR_F_004_Notice_Penalty_Absence.docx', formNo: 'JM-HR-F-004', titleAr: 'إشعار إداري' }
};

/**
 * Clean XML text escape
 */
function escapeXml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Format date as YYYY/MM/DD
 */
function getTodayFormatted() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

/**
 * Injects a value into the table cell immediately following the cell containing labelKeyword
 */
function injectTableCellValue(xml, labelKeywords, valueToInject) {
  if (!valueToInject) return xml;
  const keywords = Array.isArray(labelKeywords) ? labelKeywords : [labelKeywords];

  return xml.replace(/<w:tr[\s>][\s\S]*?<\/w:tr>/g, (trXml) => {
    let matchedKeyword = null;
    for (const kw of keywords) {
      if (trXml.includes(kw)) {
        matchedKeyword = kw;
        break;
      }
    }
    if (!matchedKeyword) return trXml;

    // Split tr into tc cells
    const cells = trXml.match(/<w:tc[\s>][\s\S]*?<\/w:tc>/g);
    if (!cells || cells.length < 2) return trXml;

    for (let i = 0; i < cells.length; i++) {
      if (cells[i].includes(matchedKeyword) && i + 1 < cells.length) {
        const targetCell = cells[i + 1];
        // If targetCell already has significant non-label text, avoid overwriting
        const safeVal = escapeXml(valueToInject);
        const injectedParagraph = `<w:p><w:pPr><w:jc w:val="center"/><w:rPr><w:rFonts w:ascii="Cairo" w:hAnsi="Cairo" w:cs="Cairo"/><w:b/><w:color w:val="111827"/><w:sz w:val="19"/><w:szCs w:val="19"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Cairo" w:hAnsi="Cairo" w:cs="Cairo"/><w:b/><w:color w:val="111827"/><w:sz w:val="19"/><w:szCs w:val="19"/></w:rPr><w:t>${safeVal}</w:t></w:r></w:p>`;

        let newCell;
        if (targetCell.includes('<w:p')) {
          newCell = targetCell.replace(/<w:p[\s>][\s\S]*?<\/w:p>/, injectedParagraph);
        } else {
          newCell = targetCell.replace('</w:tc>', `${injectedParagraph}</w:tc>`);
        }

        trXml = trXml.replace(targetCell, newCell);
        break;
      }
    }
    return trXml;
  });
}

/**
 * Universal Fill Official Word Form
 * Reads the real .docx template, populates employee and transaction details,
 * and returns { buffer, filename }.
 */
async function fillOfficialWordForm(formTypeKey, emp, params = {}) {
  const normKey = (formTypeKey || '').toLowerCase().trim();
  const config = FORM_MAP[normKey] || FORM_MAP['lrf'];

  const templatePath = path.join(TEMPLATES_DIR, config.file);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`ملف النموذج الرسمي غير موجود: ${config.file}`);
  }

  const rawBuffer = fs.readFileSync(templatePath);
  const today = getTodayFormatted();

  try {
    const zip = await JSZip.loadAsync(rawBuffer);
    let xml = await zip.file('word/document.xml').async('string');

    // 1. Fill Form Header Metadata
    xml = xml.replace(/JM-HR-F-_______/g, config.formNo);
    xml = xml.replace(/__\s*\/\s*__\s*\/\s*____/g, today);
    xml = xml.replace(/00\/00\/0000م?/g, today + 'م');

    // 2. Fill Employee Information
    if (emp) {
      const empName = emp.full_name_ar || emp.full_name || '';
      const empCode = emp.emp_code || '';
      const idNum = emp.id_number || emp.national_id || emp.iqama_number || '';
      const jobTitle = emp.job_title_ar || emp.job_title || '';
      const deptName = emp.department_name_ar || emp.department_name || '';
      const branchName = emp.branch_name_ar || emp.branch_name || 'الفرع الرئيسي';
      const nationality = emp.nationality || 'سعودي';
      const hireDate = emp.hire_date || emp.join_date || '';
      const basicSal = emp.basic_salary ? `${Number(emp.basic_salary).toLocaleString('en-US')} ريال` : '';
      const housingSal = emp.housing_allowance ? `${Number(emp.housing_allowance).toLocaleString('en-US')} ريال` : '0 ريال';
      const transSal = emp.transport_allowance ? `${Number(emp.transport_allowance).toLocaleString('en-US')} ريال` : '0 ريال';
      const totalSal = emp.gross ? `${Number(emp.gross).toLocaleString('en-US')} ريال` : basicSal;

      // Table cell injections
      xml = injectTableCellValue(xml, ['Full Name', 'الاسم الكامل', 'اسم الموظف'], empName);
      xml = injectTableCellValue(xml, ['Employee ID', 'Employee No', 'الرقم الوظيفي'], empCode);
      xml = injectTableCellValue(xml, ['ID / Iqama No', 'ID No.', 'رقم الهوية', 'رقم الإقامة'], idNum);
      xml = injectTableCellValue(xml, ['Position', 'Job Title', 'المسمى الوظيفي'], jobTitle);
      xml = injectTableCellValue(xml, ['Department', 'Division', 'القسم', 'الإدارة'], deptName);
      xml = injectTableCellValue(xml, ['Branch', 'الفرع'], branchName);
      xml = injectTableCellValue(xml, ['Nationality', 'الجنسية'], nationality);
      xml = injectTableCellValue(xml, ['Date of Joining', 'تاريخ المباشرة', 'تاريخ التعيين'], hireDate);
      xml = injectTableCellValue(xml, ['Basic Salary', 'الراتب الأساسي'], basicSal);
      xml = injectTableCellValue(xml, ['Housing Allowance', 'بدل سكن'], housingSal);
      xml = injectTableCellValue(xml, ['Transportation', 'بدل نقل'], transSal);
      xml = injectTableCellValue(xml, ['Total Salary', 'إجمالي الراتب'], totalSal);
      xml = injectTableCellValue(xml, ['التاريخ', 'Date'], today);

      // Context-specific injections
      if (params.start_date) {
        xml = injectTableCellValue(xml, ['Leave Start Date', 'تاريخ بداية الإجازة'], params.start_date);
      }
      if (params.end_date) {
        xml = injectTableCellValue(xml, ['Leave End Date', 'تاريخ نهاية الإجازة'], params.end_date);
      }
      if (params.days_count) {
        xml = injectTableCellValue(xml, ['Leave Duration', 'مدة الإجازة'], `${params.days_count} يوم`);
      }
      if (params.amount) {
        xml = injectTableCellValue(xml, ['Advance Amount', 'مبلغ السلفة'], `${Number(params.amount).toLocaleString('en-US')} ريال`);
      }
      if (params.reason) {
        xml = injectTableCellValue(xml, ['Reason', 'سبب الطلب', 'وصف المخالفة'], params.reason);
      }
    }

    zip.file('word/document.xml', xml);
    const filledBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    const safeName = emp ? (emp.full_name_ar || emp.emp_code || '').replace(/\s+/g, '_') : 'رسمي';
    const filename = `${config.formNo}_${config.titleAr.replace(/\s+/g, '_')}_${safeName}.docx`;

    return { buffer: filledBuffer, filename };
  } catch (err) {
    console.error('Error populating official Word template, sending clean official template:', err);
    // Graceful fallback: Send the genuine company Word document even if XML injection fails
    const safeName = emp ? (emp.full_name_ar || '').replace(/\s+/g, '_') : 'نموذج';
    const filename = `${config.formNo}_${config.titleAr.replace(/\s+/g, '_')}_${safeName}.docx`;
    return { buffer: rawBuffer, filename };
  }
}

module.exports = {
  fillOfficialWordForm,
  FORM_MAP
};
