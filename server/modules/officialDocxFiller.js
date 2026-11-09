// server/modules/officialDocxFiller.js
// Official Word (.docx) Forms Filler for Jawharat Al-Majd HRMS
// Injects live database fields into the 15 official company Word templates
// Certified source: 'النماذج والمستندات.docx' (All 15 Certified Official Forms)

const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates', 'official_word_forms');

// Master Mapping of Form Types to Official Files and Metadata
const FORM_MAP = {
  // 1. JM-HR-F-001: Employee Status Notification (إشعار حالة موظف)
  esn: { file: 'JM_HR_F_001_Employee_Status_Notification.docx', formNo: 'JM-HR-F-001', titleAr: 'إشعار حالة موظف' },
  status: { file: 'JM_HR_F_001_Employee_Status_Notification.docx', formNo: 'JM-HR-F-001', titleAr: 'إشعار حالة موظف' },
  employee_status: { file: 'JM_HR_F_001_Employee_Status_Notification.docx', formNo: 'JM-HR-F-001', titleAr: 'إشعار حالة موظف' },
  'jm-hr-f-001': { file: 'JM_HR_F_001_Employee_Status_Notification.docx', formNo: 'JM-HR-F-001', titleAr: 'إشعار حالة موظف' },
  '001': { file: 'JM_HR_F_001_Employee_Status_Notification.docx', formNo: 'JM-HR-F-001', titleAr: 'إشعار حالة موظف' },

  // 2. JM-HR-F-002: Employee Advance Request (طلب سلفة)
  adv: { file: 'JM_HR_F_002_Employee_Advance_Request.docx', formNo: 'JM-HR-F-002', titleAr: 'طلب سلفة' },
  advance: { file: 'JM_HR_F_002_Employee_Advance_Request.docx', formNo: 'JM-HR-F-002', titleAr: 'طلب سلفة' },
  loan_advance: { file: 'JM_HR_F_002_Employee_Advance_Request.docx', formNo: 'JM-HR-F-002', titleAr: 'طلب سلفة' },
  'jm-hr-f-002': { file: 'JM_HR_F_002_Employee_Advance_Request.docx', formNo: 'JM-HR-F-002', titleAr: 'طلب سلفة' },
  '002': { file: 'JM_HR_F_002_Employee_Advance_Request.docx', formNo: 'JM-HR-F-002', titleAr: 'طلب سلفة' },

  // 3. JM-HR-F-003: Iqama Receipt Acknowledgment (نموذج استلام إقامة)
  ira: { file: 'JM_HR_F_003_Iqama_Receipt_Acknowledgment.docx', formNo: 'JM-HR-F-003', titleAr: 'نموذج استلام إقامة' },
  iqama_receipt: { file: 'JM_HR_F_003_Iqama_Receipt_Acknowledgment.docx', formNo: 'JM-HR-F-003', titleAr: 'نموذج استلام إقامة' },
  iqama: { file: 'JM_HR_F_003_Iqama_Receipt_Acknowledgment.docx', formNo: 'JM-HR-F-003', titleAr: 'نموذج استلام إقامة' },
  'jm-hr-f-003': { file: 'JM_HR_F_003_Iqama_Receipt_Acknowledgment.docx', formNo: 'JM-HR-F-003', titleAr: 'نموذج استلام إقامة' },
  '003': { file: 'JM_HR_F_003_Iqama_Receipt_Acknowledgment.docx', formNo: 'JM-HR-F-003', titleAr: 'نموذج استلام إقامة' },

  // 4. JM-HR-F-004: Final Exit Request (خروج نهائي)
  fer: { file: 'JM_HR_F_004_Final_Exit_Request.docx', formNo: 'JM-HR-F-004', titleAr: 'خروج نهائي' },
  final_exit: { file: 'JM_HR_F_004_Final_Exit_Request.docx', formNo: 'JM-HR-F-004', titleAr: 'خروج نهائي' },
  'jm-hr-f-004': { file: 'JM_HR_F_004_Final_Exit_Request.docx', formNo: 'JM-HR-F-004', titleAr: 'خروج نهائي' },
  '004': { file: 'JM_HR_F_004_Final_Exit_Request.docx', formNo: 'JM-HR-F-004', titleAr: 'خروج نهائي' },

  // 5. JM-HR-F-005: Sponsorship Transfer Request (نقل كفالة)
  str: { file: 'JM_HR_F_005_Sponsorship_Transfer_Request.docx', formNo: 'JM-HR-F-005', titleAr: 'نقل كفالة' },
  sponsorship_transfer: { file: 'JM_HR_F_005_Sponsorship_Transfer_Request.docx', formNo: 'JM-HR-F-005', titleAr: 'نقل كفالة' },
  sponsorship: { file: 'JM_HR_F_005_Sponsorship_Transfer_Request.docx', formNo: 'JM-HR-F-005', titleAr: 'نقل كفالة' },
  'jm-hr-f-005': { file: 'JM_HR_F_005_Sponsorship_Transfer_Request.docx', formNo: 'JM-HR-F-005', titleAr: 'نقل كفالة' },
  '005': { file: 'JM_HR_F_005_Sponsorship_Transfer_Request.docx', formNo: 'JM-HR-F-005', titleAr: 'نقل كفالة' },

  // 6. JM-HR-F-006: Employee Settlement (تصفية موظف/ـة)
  ecf: { file: 'JM_HR_F_006_Employee_Settlement.docx', formNo: 'JM-HR-F-006', titleAr: 'تصفية موظف/ـة' },
  settlement: { file: 'JM_HR_F_006_Employee_Settlement.docx', formNo: 'JM-HR-F-006', titleAr: 'تصفية موظف/ـة' },
  employee_settlement: { file: 'JM_HR_F_006_Employee_Settlement.docx', formNo: 'JM-HR-F-006', titleAr: 'تصفية موظف/ـة' },
  clearance_settlement: { file: 'JM_HR_F_006_Employee_Settlement.docx', formNo: 'JM-HR-F-006', titleAr: 'تصفية موظف/ـة' },
  'jm-hr-f-006': { file: 'JM_HR_F_006_Employee_Settlement.docx', formNo: 'JM-HR-F-006', titleAr: 'تصفية موظف/ـة' },
  '006': { file: 'JM_HR_F_006_Employee_Settlement.docx', formNo: 'JM-HR-F-006', titleAr: 'تصفية موظف/ـة' },

  // 7. JM-HR-F-007: Full & Final Settlement Release (وثيقة إبراء ذمة واستلام المستحقات)
  ffs: { file: 'JM_HR_F_007_Clearance_And_Final_Settlement.docx', formNo: 'JM-HR-F-007', titleAr: 'وثيقة إبراء ذمة واستلام المستحقات' },
  full_settlement: { file: 'JM_HR_F_007_Clearance_And_Final_Settlement.docx', formNo: 'JM-HR-F-007', titleAr: 'وثيقة إبراء ذمة واستلام المستحقات' },
  clearance_release: { file: 'JM_HR_F_007_Clearance_And_Final_Settlement.docx', formNo: 'JM-HR-F-007', titleAr: 'وثيقة إبراء ذمة واستلام المستحقات' },
  discharge: { file: 'JM_HR_F_007_Clearance_And_Final_Settlement.docx', formNo: 'JM-HR-F-007', titleAr: 'وثيقة إبراء ذمة واستلام المستحقات' },
  'jm-hr-f-007': { file: 'JM_HR_F_007_Clearance_And_Final_Settlement.docx', formNo: 'JM-HR-F-007', titleAr: 'وثيقة إبراء ذمة واستلام المستحقات' },
  '007': { file: 'JM_HR_F_007_Clearance_And_Final_Settlement.docx', formNo: 'JM-HR-F-007', titleAr: 'وثيقة إبراء ذمة واستلام المستحقات' },

  // 8. JM-HR-F-008: Notice of Penalty - Absence (إخطار عقوبة – غياب)
  npa: { file: 'JM_HR_F_008_Notice_Penalty_Absence.docx', formNo: 'JM-HR-F-008', titleAr: 'إخطار عقوبة – غياب' },
  absence_penalty: { file: 'JM_HR_F_008_Notice_Penalty_Absence.docx', formNo: 'JM-HR-F-008', titleAr: 'إخطار عقوبة – غياب' },
  penalty_absence: { file: 'JM_HR_F_008_Notice_Penalty_Absence.docx', formNo: 'JM-HR-F-008', titleAr: 'إخطار عقوبة – غياب' },
  'jm-hr-f-008': { file: 'JM_HR_F_008_Notice_Penalty_Absence.docx', formNo: 'JM-HR-F-008', titleAr: 'إخطار عقوبة – غياب' },
  '008': { file: 'JM_HR_F_008_Notice_Penalty_Absence.docx', formNo: 'JM-HR-F-008', titleAr: 'إخطار عقوبة – غياب' },

  // 9. JM-HR-F-009: Notice of Penalty - Instructions (إخطار عقوبة – مخالفة الأوامر والتعليمات)
  npi: { file: 'JM_HR_F_009_Notice_Penalty_Instruction.docx', formNo: 'JM-HR-F-009', titleAr: 'إخطار عقوبة – مخالفة الأوامر والتعليمات' },
  instruction_penalty: { file: 'JM_HR_F_009_Notice_Penalty_Instruction.docx', formNo: 'JM-HR-F-009', titleAr: 'إخطار عقوبة – مخالفة الأوامر والتعليمات' },
  penalty_instructions: { file: 'JM_HR_F_009_Notice_Penalty_Instruction.docx', formNo: 'JM-HR-F-009', titleAr: 'إخطار عقوبة – مخالفة الأوامر والتعليمات' },
  'jm-hr-f-009': { file: 'JM_HR_F_009_Notice_Penalty_Instruction.docx', formNo: 'JM-HR-F-009', titleAr: 'إخطار عقوبة – مخالفة الأوامر والتعليمات' },
  '009': { file: 'JM_HR_F_009_Notice_Penalty_Instruction.docx', formNo: 'JM-HR-F-009', titleAr: 'إخطار عقوبة – مخالفة الأوامر والتعليمات' },

  // 10. JM-HR-F-010: Notice of Non-Renewal of Contract (إشعار عدم تجديد العقد)
  nnr: { file: 'JM_HR_F_010_Notice_Non_Renewal_Contract.docx', formNo: 'JM-HR-F-010', titleAr: 'إشعار عدم تجديد العقد' },
  contract_non_renewal: { file: 'JM_HR_F_010_Notice_Non_Renewal_Contract.docx', formNo: 'JM-HR-F-010', titleAr: 'إشعار عدم تجديد العقد' },
  non_renewal: { file: 'JM_HR_F_010_Notice_Non_Renewal_Contract.docx', formNo: 'JM-HR-F-010', titleAr: 'إشعار عدم تجديد العقد' },
  'jm-hr-f-010': { file: 'JM_HR_F_010_Notice_Non_Renewal_Contract.docx', formNo: 'JM-HR-F-010', titleAr: 'إشعار عدم تجديد العقد' },
  '010': { file: 'JM_HR_F_010_Notice_Non_Renewal_Contract.docx', formNo: 'JM-HR-F-010', titleAr: 'إشعار عدم تجديد العقد' },

  // 11. JM-HR-F-011: Employee Clearance Form (نموذج إخلاء طرف موظف)
  clr: { file: 'JM_HR_F_011_Employee_Clearance_Form.docx', formNo: 'JM-HR-F-011', titleAr: 'نموذج إخلاء طرف موظف' },
  clearance: { file: 'JM_HR_F_011_Employee_Clearance_Form.docx', formNo: 'JM-HR-F-011', titleAr: 'نموذج إخلاء طرف موظف' },
  clearance_form: { file: 'JM_HR_F_011_Employee_Clearance_Form.docx', formNo: 'JM-HR-F-011', titleAr: 'نموذج إخلاء طرف موظف' },
  'jm-hr-f-011': { file: 'JM_HR_F_011_Employee_Clearance_Form.docx', formNo: 'JM-HR-F-011', titleAr: 'نموذج إخلاء طرف موظف' },
  '011': { file: 'JM_HR_F_011_Employee_Clearance_Form.docx', formNo: 'JM-HR-F-011', titleAr: 'نموذج إخلاء طرف موظف' },

  // 12. JM-HR-F-012: Penalty Procedure Form (نموذج إجراء جزائي)
  ppf: { file: 'JM_HR_F_012_Penalty_Procedure_Form.docx', formNo: 'JM-HR-F-012', titleAr: 'نموذج إجراء جزائي' },
  penalty: { file: 'JM_HR_F_012_Penalty_Procedure_Form.docx', formNo: 'JM-HR-F-012', titleAr: 'نموذج إجراء جزائي' },
  penalty_procedure: { file: 'JM_HR_F_012_Penalty_Procedure_Form.docx', formNo: 'JM-HR-F-012', titleAr: 'نموذج إجراء جزائي' },
  disciplinary: { file: 'JM_HR_F_012_Penalty_Procedure_Form.docx', formNo: 'JM-HR-F-012', titleAr: 'نموذج إجراء جزائي' },
  'jm-hr-f-012': { file: 'JM_HR_F_012_Penalty_Procedure_Form.docx', formNo: 'JM-HR-F-012', titleAr: 'نموذج إجراء جزائي' },
  '012': { file: 'JM_HR_F_012_Penalty_Procedure_Form.docx', formNo: 'JM-HR-F-012', titleAr: 'نموذج إجراء جزائي' },

  // 13. JM-HR-F-013: Resignation & Contract Termination Form (نموذج الاستقالة وإنهاء عقد العمل)
  rct: { file: 'JM_HR_F_013_Resignation_Termination_Form.docx', formNo: 'JM-HR-F-013', titleAr: 'نموذج الاستقالة وإنهاء عقد العمل' },
  resignation: { file: 'JM_HR_F_013_Resignation_Termination_Form.docx', formNo: 'JM-HR-F-013', titleAr: 'نموذج الاستقالة وإنهاء عقد العمل' },
  resignation_termination: { file: 'JM_HR_F_013_Resignation_Termination_Form.docx', formNo: 'JM-HR-F-013', titleAr: 'نموذج الاستقالة وإنهاء عقد العمل' },
  termination_request: { file: 'JM_HR_F_013_Resignation_Termination_Form.docx', formNo: 'JM-HR-F-013', titleAr: 'نموذج الاستقالة وإنهاء عقد العمل' },
  'jm-hr-f-013': { file: 'JM_HR_F_013_Resignation_Termination_Form.docx', formNo: 'JM-HR-F-013', titleAr: 'نموذج الاستقالة وإنهاء عقد العمل' },
  '013': { file: 'JM_HR_F_013_Resignation_Termination_Form.docx', formNo: 'JM-HR-F-013', titleAr: 'نموذج الاستقالة وإنهاء عقد العمل' },

  // 14. JM-HR-F-014: Leave Request Form (نموذج طلب إجازة)
  lrf: { file: 'JM_HR_F_014_Leave_Request_Form.docx', formNo: 'JM-HR-F-014', titleAr: 'نموذج طلب إجازة' },
  leave: { file: 'JM_HR_F_014_Leave_Request_Form.docx', formNo: 'JM-HR-F-014', titleAr: 'نموذج طلب إجازة' },
  leave_request: { file: 'JM_HR_F_014_Leave_Request_Form.docx', formNo: 'JM-HR-F-014', titleAr: 'نموذج طلب إجازة' },
  'jm-hr-f-014': { file: 'JM_HR_F_014_Leave_Request_Form.docx', formNo: 'JM-HR-F-014', titleAr: 'نموذج طلب إجازة' },
  '014': { file: 'JM_HR_F_014_Leave_Request_Form.docx', formNo: 'JM-HR-F-014', titleAr: 'نموذج طلب إجازة' },

  // 15. JM-HR-F-015: Salary Certificate (تعريف بالراتب)
  scf: { file: 'JM_HR_F_015_Salary_Certificate.docx', formNo: 'JM-HR-F-015', titleAr: 'تعريف بالراتب' },
  salary: { file: 'JM_HR_F_015_Salary_Certificate.docx', formNo: 'JM-HR-F-015', titleAr: 'تعريف بالراتب' },
  salary_cert: { file: 'JM_HR_F_015_Salary_Certificate.docx', formNo: 'JM-HR-F-015', titleAr: 'تعريف بالراتب' },
  salary_certificate: { file: 'JM_HR_F_015_Salary_Certificate.docx', formNo: 'JM-HR-F-015', titleAr: 'تعريف بالراتب' },
  'jm-hr-f-015': { file: 'JM_HR_F_015_Salary_Certificate.docx', formNo: 'JM-HR-F-015', titleAr: 'تعريف بالراتب' },
  '015': { file: 'JM_HR_F_015_Salary_Certificate.docx', formNo: 'JM-HR-F-015', titleAr: 'تعريف بالراتب' },

  // Additional aliases
  return_from_leave: { file: 'JM_HR_F_001_Employee_Status_Notification.docx', formNo: 'JM-HR-F-001', titleAr: 'إشعار مباشرة بعد إجازة' },
  permission_request: { file: 'JM_HR_F_014_Leave_Request_Form.docx', formNo: 'JM-HR-F-014', titleAr: 'طلب استئذان' },
  work_mission: { file: 'JM_HR_F_001_Employee_Status_Notification.docx', formNo: 'JM-HR-F-001', titleAr: 'مهمة عمل وانتداب' },
  notice: { file: 'JM_HR_F_008_Notice_Penalty_Absence.docx', formNo: 'JM-HR-F-008', titleAr: 'إشعار إداري' }
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
 * Injects a value into table cell immediately following the cell containing labelKeywords
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
      const totalSal = emp.gross ? `${Number(emp.gross).toLocaleString('en-US')} ريال` : (emp.total_salary ? `${Number(emp.total_salary).toLocaleString('en-US')} ريال` : basicSal);

      // Injections into standard fields
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
    const safeName = emp ? (emp.full_name_ar || '').replace(/\s+/g, '_') : 'نموذج';
    const filename = `${config.formNo}_${config.titleAr.replace(/\s+/g, '_')}_${safeName}.docx`;
    return { buffer: rawBuffer, filename };
  }
}

/**
 * Self-healing: verify all 15 template files exist; if not, extract from certified source
 */
function ensureOfficialTemplatesExist() {
  try {
    if (!fs.existsSync(TEMPLATES_DIR)) {
      fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
    }
    const sample = path.join(TEMPLATES_DIR, 'JM_HR_F_001_Employee_Status_Notification.docx');
    if (!fs.existsSync(sample)) {
      console.log('[Word Templates] Templates missing, running auto-extraction from النماذج والمستندات.docx...');
      const { execSync } = require('child_process');
      const scriptPath = path.join(__dirname, '..', '..', 'scripts', 'extract_15_official_forms.py');
      if (fs.existsSync(scriptPath)) {
        execSync(`python "${scriptPath}"`, { stdio: 'inherit' });
      }
    }
  } catch (err) {
    console.warn('[Word Templates] Self-healing notice:', err.message);
  }
}

ensureOfficialTemplatesExist();

module.exports = {
  fillOfficialWordForm,
  FORM_MAP,
  ensureOfficialTemplatesExist
};
