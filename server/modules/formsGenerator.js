// server/modules/formsGenerator.js - Official Word (.docx) Forms Generator for Jawharat Al-Majd HRMS
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
  HeadingLevel,
  ShadingType
} = docx;

const { get } = require('../database/db');

const COMPANY_BRAND = {
  nameAr: 'شركة جوهرة المجد للتجارة والمقاولات',
  nameEn: 'Jawharat Al-Majd Trading & Contracting Co.',
  cr: '7004872169',
  vat: '310492837400003',
  address: 'المملكة العربية السعودية، منطقة عسير، أبها',
  phone: '920012405',
  email: 'info@jalmajd.com',
  primaryColor: '700C14',
  goldColor: 'D4AF37',
  lightBg: 'F8F9FA',
  borderColor: 'CCCCCC'
};

/**
 * Helper to build standard border
 */
function getTableBorders() {
  const border = { style: BorderStyle.SINGLE, size: 4, color: COMPANY_BRAND.borderColor };
  return { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border };
}

/**
 * Create official company letterhead paragraph
 */
function createHeaderParagraphs(formTitleAr, formTitleEn) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: COMPANY_BRAND.nameAr,
          font: 'Arial',
          size: 32,
          bold: true,
          color: COMPANY_BRAND.primaryColor
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: COMPANY_BRAND.nameEn,
          font: 'Arial',
          size: 20,
          bold: true,
          color: '555555'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `س.ت: ${COMPANY_BRAND.cr} | الرقم الضريبي: ${COMPANY_BRAND.vat} | المقر الرئيسي: ${COMPANY_BRAND.address}`,
          font: 'Arial',
          size: 16,
          color: '777777'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 250 },
      children: [
        new TextRun({
          text: `【 ${formTitleAr} 】`,
          font: 'Arial',
          size: 26,
          bold: true,
          color: COMPANY_BRAND.primaryColor
        }),
        new TextRun({
          text: `\n${formTitleEn}`,
          font: 'Arial',
          size: 18,
          bold: true,
          color: COMPANY_BRAND.goldColor
        })
      ]
    })
  ];
}

/**
 * Create Employee Info Table
 */
function createEmployeeInfoTable(emp) {
  const cellStyle = {
    margins: { top: 100, bottom: 100, left: 120, right: 120 }
  };

  const createCell = (label, value, isHeader = false) => new TableCell({
    width: { size: 25, type: WidthType.PERCENTAGE },
    shading: isHeader ? { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' } : undefined,
    margins: cellStyle.margins,
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: label,
            font: 'Arial',
            size: 18,
            bold: isHeader,
            color: isHeader ? COMPANY_BRAND.primaryColor : '333333'
          }),
          ...(value ? [
            new TextRun({
              text: ` ${value}`,
              font: 'Arial',
              size: 18,
              bold: true,
              color: '111111'
            })
          ] : [])
        ]
      })
    ]
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: getTableBorders(),
    rows: [
      new TableRow({
        children: [
          createCell('الاسم الرباعي:', emp.full_name_ar || '', true),
          createCell('', emp.full_name_ar || ''),
          createCell('الرقم الوظيفي:', emp.emp_code || '', true),
          createCell('', emp.emp_code || '')
        ]
      }),
      new TableRow({
        children: [
          createCell('رقم الهوية / الإقامة:', emp.national_id || '', true),
          createCell('', emp.national_id || ''),
          createCell('الجنسية:', emp.nationality || '', true),
          createCell('', emp.nationality || '')
        ]
      }),
      new TableRow({
        children: [
          createCell('الإدارة / الفرع:', `${emp.department_name_ar || emp.department_name || ''} - ${emp.branch_name_ar || emp.branch_name || ''}`, true),
          createCell('', `${emp.department_name_ar || emp.department_name || ''}`),
          createCell('المسمى الوظيفي:', emp.job_title_ar || '', true),
          createCell('', emp.job_title_ar || '')
        ]
      }),
      new TableRow({
        children: [
          createCell('تاريخ المباشرة:', emp.join_date || '', true),
          createCell('', emp.join_date || ''),
          createCell('إجمالي الراتب:', `${(emp.basic_salary || 0) + (emp.housing_allowance || 0) + (emp.transport_allowance || 0) + (emp.other_allowance || 0)} ر.س`, true),
          createCell('', `${(emp.basic_salary || 0) + (emp.housing_allowance || 0) + (emp.transport_allowance || 0) + (emp.other_allowance || 0)} ريال`)
        ]
      })
    ]
  });
}

/**
 * Create Signatures and Approval Table
 */
function createSignaturesTable(managerName = 'المدير المباشر') {
  const makeSigCell = (title, name = '') => new TableCell({
    width: { size: 33, type: WidthType.PERCENTAGE },
    margins: { top: 120, bottom: 200, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new TextRun({ text: title, font: 'Arial', size: 18, bold: true, color: COMPANY_BRAND.primaryColor })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({ text: name ? `الاسم: ${name}` : 'الاسم: .......................................', font: 'Arial', size: 16 })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({ text: 'التوقيع: ....................................', font: 'Arial', size: 16 })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: 'التاريخ: ...... / ...... / 2026م', font: 'Arial', size: 16 })
        ]
      })
    ]
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: getTableBorders(),
    rows: [
      new TableRow({
        children: [
          makeSigCell('توقيع مقدم الطلب (الموظف)'),
          makeSigCell('اعتماد وتوقيع المدير المباشر', managerName),
          makeSigCell('اعتماد إدارة الموارد البشرية', 'هاني عبدالرحمن القحطاني')
        ]
      })
    ]
  });
}

/**
 * Generate specific forms:
 */

// 1. نموذج طلب إجازة (Leave Request Form)
function buildLeaveRequestDoc(emp, params = {}) {
  const titleAr = 'نموذج طلب إجازة رسمية';
  const titleEn = 'Official Leave Request Form';

  const detailsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: getTableBorders(),
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'نوع الإجازة المطلوبة:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: params.leave_type || 'إجازة سنوية اعتيادية', font: 'Arial', size: 18, bold: true })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'فترة الإجازة:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: `من: ${params.start_date || '...... / ...... / 2026'}  إلى: ${params.end_date || '...... / ...... / 2026'} (المدة: ${params.days_count || '......'} يوم)`, font: 'Arial', size: 18 })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'رصيد الإجازات الحالي:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: `${emp.annual_leave_balance || 0} يوم (الرصيد المستحق وفق سنوات الخدمة)`, font: 'Arial', size: 18, bold: true, color: COMPANY_BRAND.primaryColor })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'الموظف البديل أثناء الإجازة:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: params.substitute_name || '...........................................................', font: 'Arial', size: 18 })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'سبب الإجازة وملاحظات:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: params.reason || 'إجازة سنوية مستحقة وفقاً لعقد العمل ونظام العمل السعودي.', font: 'Arial', size: 18 })] })]
          })
        ]
      })
    ]
  });

  return new Document({
    sections: [{
      properties: { rtl: true },
      children: [
        ...createHeaderParagraphs(titleAr, titleEn),
        new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun({ text: 'أولاً: البيانات الوظيفية للموظف', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        createEmployeeInfoTable(emp),
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: 'ثانياً: تفاصيل الإجازة المطلوبة', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        detailsTable,
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: 'ثالثاً: الاعتمادات والتوقيعات الإدارية', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        createSignaturesTable(emp.manager_name_ar)
      ]
    }]
  });
}

// 2. نموذج طلب سلفة مالية (Salary Advance Form)
function buildAdvanceRequestDoc(emp, params = {}) {
  const titleAr = 'نموذج طلب سلفة مالية';
  const titleEn = 'Salary Advance Request Form';

  const detailsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: getTableBorders(),
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'المبلغ المطلوب (ر.س):', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: `${params.amount || '....................'} ريال سعودي`, font: 'Arial', size: 18, bold: true, color: COMPANY_BRAND.primaryColor })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'سبب طلب السلفة:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: params.reason || 'ظروف شخصية طارئة', font: 'Arial', size: 18 })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'خطة وأشهر السداد المقترحة:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: `تقسيط شهري على (${params.installment_months || '......'}) أقساط شهرية متتالية تُخصم من مسير الرواتب.`, font: 'Arial', size: 18 })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'إقرار الموظف بالسداد:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: 'أفوض شركة جوهرة المجد بخصم قيمة السلفة المعتمدة من مستحقاتي الشهرية أو نهاية الخدمة في حال إنهاء العقد.', font: 'Arial', size: 16, italic: true })] })]
          })
        ]
      })
    ]
  });

  return new Document({
    sections: [{
      properties: { rtl: true },
      children: [
        ...createHeaderParagraphs(titleAr, titleEn),
        new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun({ text: 'أولاً: البيانات الوظيفية للموظف', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        createEmployeeInfoTable(emp),
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: 'ثانياً: تفاصيل السلفة المالية', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        detailsTable,
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: 'ثالثاً: سلسلة الموافقات الإدارية', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        createSignaturesTable(emp.manager_name_ar)
      ]
    }]
  });
}

// 3. نموذج طلب راتب / شهادة تعريف بالراتب (Salary Certificate)
function buildSalaryCertDoc(emp, params = {}) {
  const titleAr = 'شهادة تعريف بالراتب لمن يهمه الأمر';
  const titleEn = 'To Whom It May Concern - Salary Certificate';

  const basic = emp.basic_salary || 0;
  const housing = emp.housing_allowance || 0;
  const transport = emp.transport_allowance || 0;
  const other = emp.other_allowance || 0;
  const total = basic + housing + transport + other;

  const salaryTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: getTableBorders(),
    rows: [
      new TableRow({
        shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
        children: [
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'الراتب الأساسي', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'بدل السكن', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'بدل المواصلات', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'بدلات أخرى', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'إجمالي الراتب الشهري', font: 'Arial', size: 18, bold: true, color: COMPANY_BRAND.primaryColor })] })] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${basic} ر.س`, font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${housing} ر.س`, font: 'Arial', size: 18 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${transport} ر.س`, font: 'Arial', size: 18 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${other} ر.س`, font: 'Arial', size: 18 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${total} ر.س`, font: 'Arial', size: 18, bold: true, color: COMPANY_BRAND.primaryColor })] })] })
        ]
      })
    ]
  });

  return new Document({
    sections: [{
      properties: { rtl: true },
      children: [
        ...createHeaderParagraphs(titleAr, titleEn),
        new Paragraph({
          spacing: { before: 150, after: 150 },
          children: [
            new TextRun({
              text: `إلى الجهة: ${params.addressed_to || 'إلى من يهمه الأمر المحترمين'}`,
              font: 'Arial',
              size: 20,
              bold: true
            })
          ]
        }),
        new Paragraph({
          spacing: { before: 80, after: 150 },
          children: [
            new TextRun({
              text: `تشهد شركة جوهرة المجد للتجارة والمقاولات بأن الموظف الموضحة بياناته أدناه يعمل لدينا ولا يزال على رأس العمل حتى تاريخ تحرير هذا الخطاب:`,
              font: 'Arial',
              size: 18
            })
          ]
        }),
        createEmployeeInfoTable(emp),
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: 'مفردات ومخصصات الراتب الشهري المعتمدة:', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        salaryTable,
        new Paragraph({
          spacing: { before: 180, after: 200 },
          children: [
            new TextRun({
              text: 'وقد أُعطيت له هذه الشهادة بناءً على طلبه لتقديمها إلى الجهة المذكورة أعلاه، دون أدنى مسؤولية مالية أو التزام على الشركة تجاه الغير.',
              font: 'Arial',
              size: 16,
              italic: true
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 100 },
          children: [
            new TextRun({ text: 'مدير الموارد البشرية:\nهاني عبدالرحمن القحطاني\n\nالختم الرسمي:', font: 'Arial', size: 18, bold: true })
          ]
        })
      ]
    }]
  });
}

// 4. نموذج مباشرة بعد إجازة (Return from Leave Form)
function buildReturnFromLeaveDoc(emp, params = {}) {
  const titleAr = 'نموذج مباشرة عمل بعد إجازة';
  const titleEn = 'Return to Work from Leave Form';

  const detailsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: getTableBorders(),
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'نوع الإجازة المنتهية:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: params.leave_type || 'إجازة سنوية', font: 'Arial', size: 18, bold: true })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'تاريخ انتهاء الإجازة المقرر:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: params.scheduled_return || '...... / ...... / 2026م', font: 'Arial', size: 18 })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'تاريخ المباشرة الفعلية:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: params.actual_return || '...... / ...... / 2026م', font: 'Arial', size: 18, bold: true, color: COMPANY_BRAND.primaryColor })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'حالة الالتزام بموعد المباشرة:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: params.status_notes || 'مباشرة في الموعد المحدد دون تأخير.', font: 'Arial', size: 18 })] })]
          })
        ]
      })
    ]
  });

  return new Document({
    sections: [{
      properties: { rtl: true },
      children: [
        ...createHeaderParagraphs(titleAr, titleEn),
        new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun({ text: 'أولاً: بيانات الموظف المباشر', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        createEmployeeInfoTable(emp),
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: 'ثانياً: تفاصيل المباشرة الفعلية', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        detailsTable,
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: 'ثالثاً: توثيق واعتماد المباشرة', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        createSignaturesTable(emp.manager_name_ar)
      ]
    }]
  });
}

// 5. نموذج استئذان (Permission Request Form)
function buildPermissionRequestDoc(emp, params = {}) {
  const titleAr = 'نموذج طلب استئذان رسمي';
  const titleEn = 'Official Permission Request Form';

  const detailsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: getTableBorders(),
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'تاريخ الاستئذان:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: params.permission_date || '...... / ...... / 2026م', font: 'Arial', size: 18, bold: true })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'وقت الخروج والعودة:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: `من الساعة (${params.start_time || '00:00'}) إلى الساعة (${params.end_time || '00:00'}) - إجمالي الساعات: (${params.hours || '2'} ساعة)`, font: 'Arial', size: 18 })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'طبيعة الاستئذان:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: params.permission_nature || 'شخصي / عائلي طارئ', font: 'Arial', size: 18 })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'سبب وتفاصيل الاستئذان:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: params.reason || 'مراجعة طبية / معاملة رسمية', font: 'Arial', size: 18 })] })]
          })
        ]
      })
    ]
  });

  return new Document({
    sections: [{
      properties: { rtl: true },
      children: [
        ...createHeaderParagraphs(titleAr, titleEn),
        new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun({ text: 'أولاً: بيانات الموظف المستأذن', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        createEmployeeInfoTable(emp),
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: 'ثانياً: تفاصيل الاستئذان وساعاته', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        detailsTable,
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: 'ثالثاً: موافقة المدير المباشر والموارد البشرية', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        createSignaturesTable(emp.manager_name_ar)
      ]
    }]
  });
}

// 6. نموذج مهمة عمل (Work Mission Form)
function buildWorkMissionDoc(emp, params = {}) {
  const titleAr = 'نموذج تكليف بمهمة عمل رسمية';
  const titleEn = 'Official Business Mission Assignment Form';

  const detailsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: getTableBorders(),
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'وجهة المهمة / المدينة:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: params.destination || 'محايل عسير / فروع الشركة', font: 'Arial', size: 18, bold: true, color: COMPANY_BRAND.primaryColor })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'فترة وتاريخ المهمة:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: `من: ${params.start_date || '...... / ...... / 2026'}  إلى: ${params.end_date || '...... / ...... / 2026'} (المدة: ${params.days_count || '1'} يوم)`, font: 'Arial', size: 18 })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'الهدف وتفاصيل المهمة:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: params.mission_purpose || 'متابعة العمليات الميدانية والإشراف الفني على الفروع.', font: 'Arial', size: 18 })] })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' },
            children: [new Paragraph({ children: [new TextRun({ text: 'وسيلة النقل / البدلات المعتمدة:', font: 'Arial', size: 18, bold: true })] })]
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: params.transportation || 'سيارة الشركة الرسمية / بدل انتداب معتمد', font: 'Arial', size: 18 })] })]
          })
        ]
      })
    ]
  });

  return new Document({
    sections: [{
      properties: { rtl: true },
      children: [
        ...createHeaderParagraphs(titleAr, titleEn),
        new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun({ text: 'أولاً: بيانات الموظف المكلف بالمهمة', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        createEmployeeInfoTable(emp),
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: 'ثانياً: تفاصيل ومسار مهمة العمل', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        detailsTable,
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: 'ثالثاً: أمر التكليف والاعتمادات الرسمية', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        createSignaturesTable(emp.manager_name_ar)
      ]
    }]
  });
}

/**
 * Main generator dispatcher
 */
async function generateWordForm(formType, empId, params = {}) {
  const emp = get(`
    SELECT e.*, d.name_ar AS department_name_ar, b.name_ar AS branch_name_ar,
           m.full_name_ar AS manager_name_ar
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    LEFT JOIN employees m ON e.manager_id = m.id
    WHERE e.id = ?
  `, [empId]);

  if (!emp) {
    throw new Error('الموظف غير موجود بالنظام');
  }

  let doc = null;
  let filename = '';

  switch (formType) {
    case 'leave_request':
      doc = buildLeaveRequestDoc(emp, params);
      filename = `طلب_إجازة_${emp.emp_code}_${emp.full_name_ar.replace(/\s+/g, '_')}.docx`;
      break;
    case 'loan_advance':
      doc = buildAdvanceRequestDoc(emp, params);
      filename = `طلب_سلفة_${emp.emp_code}_${emp.full_name_ar.replace(/\s+/g, '_')}.docx`;
      break;
    case 'salary_cert':
      doc = buildSalaryCertDoc(emp, params);
      filename = `تعريف_بالراتب_${emp.emp_code}_${emp.full_name_ar.replace(/\s+/g, '_')}.docx`;
      break;
    case 'return_from_leave':
      doc = buildReturnFromLeaveDoc(emp, params);
      filename = `مباشرة_بعد_إجازة_${emp.emp_code}_${emp.full_name_ar.replace(/\s+/g, '_')}.docx`;
      break;
    case 'permission_request':
      doc = buildPermissionRequestDoc(emp, params);
      filename = `طلب_استئذان_${emp.emp_code}_${emp.full_name_ar.replace(/\s+/g, '_')}.docx`;
      break;
    case 'work_mission':
    case 'mission_request':
      doc = buildWorkMissionDoc(emp, params);
      filename = `مهمة_عمل_${emp.emp_code}_${emp.full_name_ar.replace(/\s+/g, '_')}.docx`;
      break;
    default:
      throw new Error(`نوع النموذج غير معروف: ${formType}`);
  }

  const buffer = await Packer.toBuffer(doc);
  return { buffer, filename };
}

module.exports = {
  generateWordForm
};
