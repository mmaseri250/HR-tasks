// server/modules/exportService.js - Export to Excel (.xlsx) and Word (.docx) for all main pages
const XLSX = require('xlsx');
const docx = require('docx');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType
} = docx;

const { query, get } = require('../database/db');
const employeesModule = require('./employees');
const attendanceModule = require('./attendance');
const leavesModule = require('./leaves');
const tasksModule = require('./tasks');
const penaltiesModule = require('./penalties');
const payrollModule = require('./payroll');
const requestsModule = require('./requests');

const COMPANY_NAME = 'شركة جوهرة المجد للتجارة والمقاولات';
const BRAND_PRIMARY = '700C14';
const BRAND_BG = 'F4F6F8';

/**
 * Fetch raw data and column definitions for a given entity type
 */
function getExportDataset(type, filters = {}) {
  let title = '';
  let columns = [];
  let rows = [];

  switch (type) {
    case 'employees':
      title = 'سجل بيانات موظفي شركة جوهرة المجد';
      columns = [
        { key: 'emp_code', label: 'الرقم الوظيفي', width: 14 },
        { key: 'full_name_ar', label: 'الاسم الرباعي', width: 28 },
        { key: 'national_id', label: 'رقم الهوية / الإقامة', width: 18 },
        { key: 'nationality', label: 'الجنسية', width: 14 },
        { key: 'department_name_ar', label: 'الإدارة', width: 18 },
        { key: 'branch_name_ar', label: 'الفرع', width: 18 },
        { key: 'job_title_ar', label: 'المسمى الوظيفي', width: 20 },
        { key: 'phone', label: 'رقم الجوال', width: 15 },
        { key: 'email', label: 'البريد الإلكتروني', width: 25 },
        { key: 'join_date', label: 'تاريخ المباشرة', width: 14 },
        { key: 'annual_leave_balance', label: 'رصيد الإجازات', width: 14 },
        { key: 'total_salary', label: 'إجمالي الراتب', width: 14 }
      ];
      const emps = employeesModule.getAllEmployees(filters);
      rows = emps.map(e => ({
        ...e,
        total_salary: (e.basic_salary || 0) + (e.housing_allowance || 0) + (e.transport_allowance || 0) + (e.other_allowance || 0)
      }));
      break;

    case 'attendance':
      title = 'سجل الحضور والانصراف والبصمة اليومية';
      columns = [
        { key: 'emp_code', label: 'الرقم الوظيفي', width: 14 },
        { key: 'full_name_ar', label: 'اسم الموظف', width: 26 },
        { key: 'date', label: 'التاريخ', width: 14 },
        { key: 'check_in', label: 'وقت الدخول', width: 20 },
        { key: 'check_out', label: 'وقت الخروج', width: 20 },
        { key: 'work_hours', label: 'ساعات العمل', width: 14 },
        { key: 'delay_minutes', label: 'التأخير (دقيقة)', width: 15 },
        { key: 'status', label: 'الحالة', width: 16 }
      ];
      const attDate = filters.date || new Date().toISOString().split('T')[0];
      rows = attendanceModule.getDailyAttendance(attDate);
      break;

    case 'leaves':
      title = 'سجل طلبات وأرصدة الإجازات';
      columns = [
        { key: 'request_no', label: 'رقم الطلب', width: 16 },
        { key: 'emp_code', label: 'الرقم الوظيفي', width: 14 },
        { key: 'full_name_ar', label: 'اسم الموظف', width: 26 },
        { key: 'leave_type', label: 'نوع الإجازة', width: 16 },
        { key: 'start_date', label: 'من تاريخ', width: 14 },
        { key: 'end_date', label: 'إلى تاريخ', width: 14 },
        { key: 'days_count', label: 'عدد الأيام', width: 12 },
        { key: 'status', label: 'حالة الطلب', width: 24 }
      ];
      rows = leavesModule.getAllLeaves(filters);
      break;

    case 'permissions':
      title = 'سجل طلبات الاستئذان والخروج المؤقت';
      columns = [
        { key: 'request_no', label: 'رقم الطلب', width: 16 },
        { key: 'emp_code', label: 'الرقم الوظيفي', width: 14 },
        { key: 'full_name_ar', label: 'اسم الموظف', width: 26 },
        { key: 'start_date', label: 'التاريخ', width: 14 },
        { key: 'days_count', label: 'ساعات الاستئذان', width: 15 },
        { key: 'reason', label: 'السبب', width: 30 },
        { key: 'status', label: 'الحالة', width: 22 }
      ];
      rows = requestsModule.getAllRequests({ ...filters, request_type: 'استئذان' });
      break;

    case 'tasks':
      title = 'سجل المهام الإدارية والميدانية';
      columns = [
        { key: 'task_no', label: 'رقم المهمة', width: 16 },
        { key: 'title', label: 'عنوان المهمة', width: 28 },
        { key: 'assigned_to_name', label: 'الموظف المكلف', width: 26 },
        { key: 'start_date', label: 'تاريخ البداية', width: 14 },
        { key: 'due_date', label: 'تاريخ الاستحقاق', width: 14 },
        { key: 'priority', label: 'الأولوية', width: 12 },
        { key: 'progress_percent', label: 'نسبة الإنجاز', width: 14 },
        { key: 'status', label: 'الحالة', width: 16 }
      ];
      rows = tasksModule.getAllTasks(filters).map(t => ({
        ...t,
        progress_percent: `${t.progress_percent}%`
      }));
      break;

    case 'penalties':
      title = 'سجل القرارات الجزائية والمخالفات الصادرة';
      columns = [
        { key: 'decision_no', label: 'رقم القرار', width: 18 },
        { key: 'emp_code', label: 'الرقم الوظيفي', width: 14 },
        { key: 'full_name_ar', label: 'اسم الموظف', width: 26 },
        { key: 'violation_text', label: 'المخالفة', width: 36 },
        { key: 'penalty_text', label: 'الجزاء الموقع', width: 24 },
        { key: 'deduction_days', label: 'أيام الخصم', width: 12 },
        { key: 'incident_date', label: 'تاريخ الواقعة', width: 14 },
        { key: 'status', label: 'حالة القرار', width: 16 }
      ];
      rows = penaltiesModule.getAllIssuedPenalties();
      break;

    case 'payroll':
      title = 'مسير الرواتب وحماية الأجور';
      columns = [
        { key: 'emp_code', label: 'الرقم الوظيفي', width: 14 },
        { key: 'full_name_ar', label: 'اسم الموظف', width: 26 },
        { key: 'basic_salary', label: 'الأساسي', width: 14 },
        { key: 'housing_allowance', label: 'بدل السكن', width: 14 },
        { key: 'transport_allowance', label: 'بدل النقل', width: 14 },
        { key: 'other_allowance', label: 'بدلات أخرى', width: 14 },
        { key: 'gross_salary', label: 'إجمالي الراتب', width: 16 },
        { key: 'gosi_employee_share', label: 'تأمينات الموظف', width: 14 },
        { key: 'total_deductions', label: 'مجموع الخصومات', width: 15 },
        { key: 'net_salary', label: 'صافي الراتب', width: 16 }
      ];
      const lastPeriod = get('SELECT id FROM payroll_periods ORDER BY period_month DESC LIMIT 1');
      if (lastPeriod) {
        rows = payrollModule.getPayrollItems(lastPeriod.id);
      } else {
        rows = [];
      }
      break;

    case 'reports':
    default:
      title = 'تقرير مؤشرات الامتثال الإداري والمؤسسي';
      columns = [
        { key: 'emp_code', label: 'الرقم الوظيفي', width: 14 },
        { key: 'full_name_ar', label: 'اسم الموظف', width: 26 },
        { key: 'nationality', label: 'الجنسية', width: 14 },
        { key: 'iqama_status', label: 'حالة الإقامة', width: 24 },
        { key: 'work_permit_status', label: 'رخصة العمل (قوى)', width: 24 },
        { key: 'days_remaining', label: 'الأيام المتبقية', width: 16 }
      ];
      const comp = employeesModule.getComplianceMetrics();
      rows = comp.roster || [];
      break;

    case 'muqeem':
      title = 'تقرير مقيم الرسمي وسجل المقيمين النشطين ورخص العمل';
      columns = [
        { key: 'iqama_number', label: 'رقم الإقامة', width: 16 },
        { key: 'full_name', label: 'اسم المقيم', width: 28 },
        { key: 'nationality', label: 'الجنسية', width: 14 },
        { key: 'occupation', label: 'المهنة', width: 22 },
        { key: 'location_status', label: 'التواجد بالمملكة', width: 16 },
        { key: 'passport_number', label: 'رقم الجواز', width: 15 },
        { key: 'passport_expiry', label: 'انتهاء الجواز', width: 14 },
        { key: 'iqama_issue_date', label: 'تاريخ الإصدار', width: 14 },
        { key: 'iqama_expiry_gregorian', label: 'انتهاء الإقامة (ميلادي)', width: 16 },
        { key: 'iqama_expiry_hijri', label: 'انتهاء الإقامة (هجري)', width: 16 },
        { key: 'days_remaining', label: 'الأيام المتبقية', width: 14 },
        { key: 'iqama_status', label: 'حالة الإقامة', width: 18 },
        { key: 'qiwa_status_text', label: 'رخصة العمل (قوى)', width: 20 },
        { key: 'employer_id', label: 'رقم صاحب العمل', width: 16 }
      ];
      try {
        const muqeemModule = require('./muqeem');
        const muqRep = muqeemModule.getMuqeemReport(filters);
        rows = (muqRep.residents || []).map(r => ({
          ...r,
          qiwa_status_text: r.is_outside_ksa === 1 ? 'معلق (خارج المملكة)' : 'سارية • 800 ر.س/شهر'
        }));
      } catch (e) {
        rows = [];
      }
      break;
  }

  return { title, columns, rows };
}

/**
 * Generate Excel (.xlsx) buffer with executive styling and RTL support
 */
function exportToExcel(type, filters = {}) {
  const dataset = getExportDataset(type, filters);
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('ar-SA-u-nu-latn', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeFormatted = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Prepare header rows with company title
  const sheetData = [];
  sheetData.push([`🏢 ${COMPANY_NAME}`]);
  sheetData.push([`📊 ${dataset.title} - تقرير رسمي معتمد للإدارة العليا`]);
  sheetData.push([`📅 تاريخ الإنشاء: ${dateFormatted} (${timeFormatted}) | 💻 النظام: نظام جوهرة المجد لإدارة الموارد البشرية (HRMS)`]);
  sheetData.push([]); // blank line for separation

  // Column header row (Row 5, 0-indexed row 4)
  const headerLabels = dataset.columns.map(c => c.label);
  sheetData.push(headerLabels);

  // Data rows
  for (const item of dataset.rows) {
    const row = dataset.columns.map(c => {
      const val = item[c.key];
      if (val === undefined || val === null) return '';
      // Retain numeric types for currency/numbers so Excel treats them as numbers
      if (typeof val === 'number') return val;
      return String(val).trim();
    });
    sheetData.push(row);
  }

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  const numCols = dataset.columns.length;
  const lastColLetter = XLSX.utils.encode_col(numCols - 1);
  const totalRows = sheetData.length;

  // 1. Executive Top Header Merges (Rows 1, 2, 3 spanning all columns)
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: numCols - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: numCols - 1 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: numCols - 1 } }
  ];

  // 2. Right-to-Left (RTL) Layout for Arabic Display
  ws['!views'] = [{ rightToLeft: true, RTL: true }];

  // 3. Freeze Panes: Freeze header rows above data (Row 5 is header, freeze at row 5)
  ws['!freeze'] = { xSplit: 0, ySplit: 5 };

  // 4. Auto-Filter on Column Headers Row (Row 5 down to end of data)
  ws['!autofilter'] = { ref: `A5:${lastColLetter}${Math.max(5, totalRows)}` };

  // 5. Dynamic Auto-Fit Column Widths
  ws['!cols'] = dataset.columns.map((col, colIdx) => {
    let maxLen = col.label ? col.label.length * 1.5 : 12;
    for (const item of dataset.rows) {
      const val = item[col.key];
      if (val !== undefined && val !== null) {
        const strVal = String(val);
        const len = strVal.length * (/[^\u0000-\u007f]/.test(strVal) ? 1.4 : 1.0);
        if (len > maxLen) maxLen = len;
      }
    }
    const computedWidth = Math.max(Math.ceil(maxLen) + 4, col.width || 14);
    return { wch: computedWidth };
  });

  const sheetNames = {
    employees: 'بيانات الموظفين',
    attendance: 'الحضور والانصراف',
    leaves: 'سجل الإجازات',
    tasks: 'سجل المهام',
    penalties: 'القرارات الجزائية',
    payroll: 'مسير الرواتب',
    permissions: 'طلبات الاستئذان',
    reports: 'مؤشرات الامتثال',
    muqeem: 'تقرير مقيم النشطين'
  };
  const sheetName = sheetNames[type] || 'البيانات الرسمية';

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  return {
    buffer: XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }),
    filename: `${type}_jawharat_al_majd_${now.toISOString().split('T')[0]}.xlsx`
  };
}

/**
 * Generate Word (.docx) Table buffer
 */
async function exportToWord(type, filters = {}) {
  const dataset = getExportDataset(type, filters);

  const border = { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' };
  const borders = { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border };

  // Header row
  const headerRow = new TableRow({
    shading: { fill: BRAND_PRIMARY, type: ShadingType.SOLID, color: 'auto' },
    children: dataset.columns.map(c => new TableCell({
      margins: { top: 80, bottom: 80, left: 80, right: 80 },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: c.label, font: 'Arial', size: 16, bold: true, color: 'FFFFFF' })
          ]
        })
      ]
    }))
  });

  // Data rows (take up to 120 rows for clean docx display)
  const dataRows = dataset.rows.slice(0, 120).map((r, rIdx) => new TableRow({
    shading: rIdx % 2 === 1 ? { fill: BRAND_BG, type: ShadingType.SOLID, color: 'auto' } : undefined,
    children: dataset.columns.map(c => new TableCell({
      margins: { top: 60, bottom: 60, left: 60, right: 60 },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: String(r[c.key] !== undefined && r[c.key] !== null ? r[c.key] : ''), font: 'Arial', size: 14 })
          ]
        })
      ]
    }))
  }));

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders,
    rows: [headerRow, ...dataRows]
  });

  const doc = new Document({
    sections: [{
      properties: {
        rtl: true,
        page: {
          margin: { top: 720, bottom: 720, left: 720, right: 720 }
        }
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({ text: COMPANY_NAME, font: 'Arial', size: 28, bold: true, color: BRAND_PRIMARY })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({ text: dataset.title, font: 'Arial', size: 22, bold: true, color: '333333' })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: `تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA-u-nu-latn')} | إجمالي السجلات: ${dataset.rows.length}`, font: 'Arial', size: 14, color: '777777' })
          ]
        }),
        table,
        new Paragraph({
          spacing: { before: 200 },
          children: [
            new TextRun({ text: 'تم استخراج هذا المستند رسمياً من نظام الموارد البشرية لشركة جوهرة المجد.', font: 'Arial', size: 14, italic: true, color: '888888' })
          ]
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  return {
    buffer,
    filename: `${type}_jawharat_al_majd_${new Date().toISOString().split('T')[0]}.docx`
  };
}

module.exports = {
  getExportDataset,
  exportToExcel,
  exportToWord
};
