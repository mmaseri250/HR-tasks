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
          makeSigCell('اعتماد إدارة الموارد البشرية', 'عبدالملك سعيد الشريف')
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
            new TextRun({ text: 'مدير عام الموارد البشرية:\nعبدالملك سعيد الشريف\n\nالختم الرسمي:', font: 'Arial', size: 18, bold: true })
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

// 7. نموذج إشعار عقوبة غياب (الملف رقم 1 - مادة 1/11)
function buildAbsencePenaltyNoticeDoc(emp, params = {}) {
  const titleAr = 'إشعار عقوبة غياب عن العمل';
  const titleEn = 'Absence Penalty Notice';
  const curDate = params.date || new Date().toISOString().split('T')[0];
  const days = params.days || 1;
  const incidentDate = params.incident_date || curDate;
  const deductionDays = params.deduction_days || days;

  const infoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: getTableBorders(),
    rows: [
      new TableRow({
        children: [
          new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'التاريخ / Date:', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: curDate, font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'الرقم الوظيفي / Emp#:', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: emp.emp_code, font: 'Arial', size: 18, bold: true })] })] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'الاسم / Name:', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: emp.full_name_ar, font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'الإدارة / Department:', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: emp.department_name_ar || 'شركة جوهرة المجد', font: 'Arial', size: 18 })] })] })
        ]
      })
    ]
  });

  return new Document({
    sections: [{
      properties: { rtl: true },
      children: [
        ...createHeaderParagraphs(titleAr, titleEn),
        infoTable,
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [
          new TextRun({ text: `بالإشارة إلى تقرير إدارتكم الوارد إلينا بشأن غيابكم عن العمل لمدة (${days}) يوم بتاريخ ${incidentDate} دون تقديم أي إذن مسبق أو عذر مقبول، نود إحاطتكم بما يلي:`, font: 'Arial', size: 20 })
        ] }),
        new Paragraph({ spacing: { before: 100, after: 100 }, children: [
          new TextRun({ text: 'استنادًا إلى لائحة العمل، المنصوص عليه في المادة (1/11) الواردة في الفصل الثامن عشر من جدول المخالفات والجزاءات، والتي تنص على أن:', font: 'Arial', size: 20, bold: true })
        ] }),
        new Paragraph({ spacing: { before: 100, after: 100 }, children: [
          new TextRun({ text: `“الغياب دون إذن كتابي أو عذر مقبول لمدة يوم واحد خلال السنة العقدية الواحدة (للمرة الأولى)، فإن الجزاء الوارد فيها خصم (${deductionDays}) يوم بالإضافة إلى خصم أجر مدة الغياب.”`, font: 'Arial', size: 20, italics: true, color: COMPANY_BRAND.primaryColor })
        ] }),
        new Paragraph({ spacing: { before: 100, after: 150 }, children: [
          new TextRun({ text: 'وبناءً على ذلك، فقد تقرر تطبيق الجزاء المنصوص عليه أعلاه بحقكم، مع التأكيد على ضرورة عدم تكرار هذا السلوك مستقبلاً، وفي حال تكراره سيتم اتخاذ إجراءات أشد وفق ما تقضي به الأنظمة واللوائح المعمول بها.', font: 'Arial', size: 20 })
        ] }),
        new Paragraph({ spacing: { before: 100, after: 50 }, children: [
          new TextRun({ text: `With reference to the report submitted by your department regarding your absence from work for (${days}) day(s) on ${incidentDate} without prior authorization or an acceptable justification, please be informed that pursuant to Article (1/11) of the Work Regulations, the stated penalty has been applied.`, font: 'Arial', size: 16, italics: true, color: '555555' })
        ] }),
        createSignaturesTable('عبدالملك سعيد الشريف (مدير الموارد البشرية)')
      ]
    }]
  });
}

// 8. نموذج إشعار عقوبة عدم اتباع التعليمات (الملف رقم 2 - مادة 1/15)
function buildInstructionPenaltyNoticeDoc(emp, params = {}) {
  const titleAr = 'إشعار عقوبة مخالفة الأوامر والتعليمات';
  const titleEn = 'Work Instructions Violation Penalty Notice';
  const curDate = params.date || new Date().toISOString().split('T')[0];
  const incidentDate = params.incident_date || curDate;
  const deduction = params.deduction || 'نصف يوم';

  const infoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: getTableBorders(),
    rows: [
      new TableRow({
        children: [
          new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'التاريخ / Date:', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: curDate, font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'الرقم الوظيفي / Emp#:', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: emp.emp_code, font: 'Arial', size: 18, bold: true })] })] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'الاسم / Name:', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: emp.full_name_ar, font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'الإدارة / Department:', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: emp.department_name_ar || 'شركة جوهرة المجد', font: 'Arial', size: 18 })] })] })
        ]
      })
    ]
  });

  return new Document({
    sections: [{
      properties: { rtl: true },
      children: [
        ...createHeaderParagraphs(titleAr, titleEn),
        infoTable,
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [
          new TextRun({ text: `بالإشارة إلى تقرير إدارتكم الوارد إلينا بشأن عدم اتباعكم للتعليمات الخاصة بالعمل وذلك في بتاريخ ${incidentDate}م، نود إحاطتكم بما يلي:`, font: 'Arial', size: 20 })
        ] }),
        new Paragraph({ spacing: { before: 100, after: 100 }, children: [
          new TextRun({ text: 'استنادًا إلى لائحة العمل، المنصوص عليه في المادة (1/15) الواردة في الفصل الثامن عشر من جدول المخالفات المتعلقة بتنظيم العمل، والتي تنص على أن:', font: 'Arial', size: 20, bold: true })
        ] }),
        new Paragraph({ spacing: { before: 100, after: 100 }, children: [
          new TextRun({ text: `“عدم إطاعة الأوامر العادية الخاصة بالعمل أو عدم تنفيذ التعليمات الخاصة بالعمل والمعلقة في مكان ظاهر (للمرة الأولى)، فإن الجزاء الوارد فيها خصم (${deduction}) من الأجر اليومي.”`, font: 'Arial', size: 20, italics: true, color: COMPANY_BRAND.primaryColor })
        ] }),
        new Paragraph({ spacing: { before: 100, after: 150 }, children: [
          new TextRun({ text: 'وبناءً على ذلك، فقد تقرر تطبيق الجزاء المنصوص عليه أعلاه بحقكم، مع التأكيد على ضرورة عدم تكرار هذا السلوك مستقبلاً، وفي حال تكراره سيتم اتخاذ إجراءات أشد وفق ما تقضي به الأنظمة واللوائح المعمول بها.', font: 'Arial', size: 20 })
        ] }),
        new Paragraph({ spacing: { before: 100, after: 50 }, children: [
          new TextRun({ text: `In accordance with Article (1/15) of Chapter 18 of the Work Regulations, failure to comply with ordinary work instructions results in a deduction from the daily wage. Stricter measures will apply in case of recurrence.`, font: 'Arial', size: 16, italics: true, color: '555555' })
        ] }),
        createSignaturesTable('عبدالملك سعيد الشريف (مدير الموارد البشرية)')
      ]
    }]
  });
}

// 9. نموذج إخلاء طرف موظف (الملف رقم 3 - JM-HR-F-005)
function buildClearanceDoc(emp, params = {}) {
  const titleAr = 'نموذج إخلاء طرف موظف (JM-HR-F-005)';
  const titleEn = 'Employee Clearance Form';
  const curDate = params.date || new Date().toISOString().split('T')[0];
  const lastWorkingDay = params.last_working_day || curDate;

  const clearanceTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: getTableBorders(),
    rows: [
      new TableRow({
        children: [
          new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'الإدارة التابع لها (المدير المباشر):', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 70, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'تسليم كافة المهام والملفات والمفاتيح والعهد المكتبية - [معتمد ومكتمل ✓]', font: 'Arial', size: 18 })] })] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'إدارة تقنية المعلومات (IT):', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 70, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'إلغاء البريد، استلام الأجهزة الإلكترونية وإيقاف كافة الصلاحيات - [معتمد ومكتمل ✓]', font: 'Arial', size: 18 })] })] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'الشؤون الإدارية والخدمات:', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 70, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'استلام بطاقة العمل، تسوية التأمين الطبي، استلام عهد السيارات والسكن - [معتمد ومكتمل ✓]', font: 'Arial', size: 18 })] })] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'الإدارة المالية:', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 70, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'تسوية السلف وإغلاق العهد النقدية ولا توجد مديونيات - [معتمد ومكتمل ✓]', font: 'Arial', size: 18 })] })] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'الموارد البشرية:', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 70, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'إسقاط التأمينات GOSI، التوثيق عبر قوى وتصفية المستحقات - [معتمد ومكتمل ✓]', font: 'Arial', size: 18 })] })] })
        ]
      })
    ]
  });

  return new Document({
    sections: [{
      properties: { rtl: true },
      children: [
        ...createHeaderParagraphs(titleAr, titleEn),
        new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun({ text: '1. بيانات الموظف المنتهية خدماته', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        createEmployeeInfoTable(emp),
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: '2. اعتمادات الأقسام والإدارات المعنية', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        clearanceTable,
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: '3. إقرار المخالصة النهائية واعتماد الإدارة العليا', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        new Paragraph({ spacing: { before: 50, after: 150 }, children: [
          new TextRun({ text: `أقر أنا الموظف/ ${emp.full_name_ar} بأنني قمت بتسليم كافة العهد والوثائق والأجهزة العائدة للشركة، واستلمت كامل مستحقاتي النظامية عن فترة عملي، ويعد هذا إخلاء طرف نهائي.`, font: 'Arial', size: 18, italics: true })
        ] }),
        createSignaturesTable('عبدالرحمن صالح القحطاني (الرئيس التنفيذي)')
      ]
    }]
  });
}

// 10. نموذج إشعار عدم رغبة في تجديد العقد (الملف رقم 4 - مادة 55/37)
function buildContractNonRenewalDoc(emp, params = {}) {
  const titleAr = 'خطاب إشعار بعدم الرغبة في تجديد عقد العمل';
  const titleEn = 'Notice of Non-Renewal of Employment Contract';
  const curDate = params.date || new Date().toISOString().split('T')[0];
  const contractStart = params.contract_start || emp.join_date || '2025-01-01';
  const contractEnd = params.contract_end || emp.contract_end_date || '2026-10-31';
  const lastWorkingDay = params.last_working_day || contractEnd;

  return new Document({
    sections: [{
      properties: { rtl: true },
      children: [
        ...createHeaderParagraphs(titleAr, titleEn),
        createEmployeeInfoTable(emp),
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [
          new TextRun({ text: `بالإشارة الى الموضوع أعلاه وإلى عقد العمل المبرم بيننا والذي يبدأ من تاريخ ${contractStart}م وينتهي في ${contractEnd}م يتجدد لمدة أو مدد مماثلة ما لم يشعر أحد الطرفين الأخر خطياً بعدم رغبته في التجديد قبل (30) يوماً من تاريخ انتهاء العقد.`, font: 'Arial', size: 20 })
        ] }),
        new Paragraph({ spacing: { before: 100, after: 100 }, children: [
          new TextRun({ text: 'واستناداً لأحكام المادة (55) من نظام العمل السعودي والتي نصت على أن: “ينتهي عقد العمل المحدد المدة بانقضاء مدته، فإذا استمر طرفاه في تنفيذه عدّ العقد مجدداً لمدة غير محددة” مع مراعاة ما نصت عليه المادة (37) من هذا النظام بالنسبة إلى غير السعوديين.', font: 'Arial', size: 20, bold: true })
        ] }),
        new Paragraph({ spacing: { before: 100, after: 100 }, children: [
          new TextRun({ text: `عليه نفيدكم بعدم رغبة الشركة في تجديد العقد معكم علماً بان اخر يوم عمل لكم سيكون بنهاية عقد العمل في تاريخ ${lastWorkingDay}م. نأمل منكم التنسيق فيما يخص إنهاء كافة الاجراءات الخاصة بإخلاء طرفكم وتسليم ما بعهدتكم من متعلقات حسب النظام، مع تمنياتنا لكم بالتوفيق.`, font: 'Arial', size: 20, color: COMPANY_BRAND.primaryColor })
        ] }),
        createSignaturesTable('عبدالملك سعيد الشريف (مدير الموارد البشرية)')
      ]
    }]
  });
}

// 11. نموذج إجراء جزائي (الملف رقم 5 - JM-HR-F-002)
function buildPenaltyProcedureDoc(emp, params = {}) {
  const titleAr = 'نموذج إجراء جزائي (JM-HR-F-002)';
  const titleEn = 'Penalty Procedure Form';
  const curDate = params.date || new Date().toISOString().split('T')[0];

  const penaltyTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: getTableBorders(),
    rows: [
      new TableRow({
        children: [
          new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'وصف المخالفة:', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: params.violation_text || 'مخالفة أحكام لائحة العمل المعتمدة وتنظيمات العمل الداخلية.', font: 'Arial', size: 18 })] })] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'الإجراء الجزائي المقرر:', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: params.penalty_text || 'خصم من الراتب وفق جدول الجزاءات ولائحة العمل.', font: 'Arial', size: 18, bold: true, color: COMPANY_BRAND.primaryColor })] })] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'تكرار المخالفة:', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: params.repetition_level || 'المرة الأولى', font: 'Arial', size: 18 })] })] })
        ]
      })
    ]
  });

  return new Document({
    sections: [{
      properties: { rtl: true },
      children: [
        ...createHeaderParagraphs(titleAr, titleEn),
        new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun({ text: 'بيانات الموظف (Employee Data)', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        createEmployeeInfoTable(emp),
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: 'تفاصيل المخالفة والإجراء التأديبي', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        penaltyTable,
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: 'الاعتمادات وسلسلة التوقيعات', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        createSignaturesTable(emp.manager_name_ar)
      ]
    }]
  });
}

// 12. نموذج الاستقالة وإنهاء عقد العمل (الملف رقم 6 - JM-HR-F-003)
function buildResignationTerminationDoc(emp, params = {}) {
  const titleAr = 'نموذج الاستقالة وإنهاء عقد العمل (JM-HR-F-003)';
  const titleEn = 'Resignation & Employment Termination Form';
  const curDate = params.date || new Date().toISOString().split('T')[0];

  const termTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: getTableBorders(),
    rows: [
      new TableRow({
        children: [
          new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'نوع الطلب / الإنهاء:', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: params.termination_type || 'استقالة بموجب المادة 85 من نظام العمل', font: 'Arial', size: 18, bold: true })] })] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'آخر يوم عمل وتاريخ الانتهاء:', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: params.last_working_day || curDate, font: 'Arial', size: 18 })] })] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, shading: { fill: COMPANY_BRAND.lightBg, type: ShadingType.SOLID, color: 'auto' }, children: [new Paragraph({ children: [new TextRun({ text: 'توثيق منصة قوى والأنظمة:', font: 'Arial', size: 18, bold: true })] })] }),
          new TableCell({ width: { size: 75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'تم التحقق والرفع على منصة قوى والتأمينات الاجتماعية GOSI [نعم ✓]', font: 'Arial', size: 18, bold: true, color: COMPANY_BRAND.primaryColor })] })] })
        ]
      })
    ]
  });

  return new Document({
    sections: [{
      properties: { rtl: true },
      children: [
        ...createHeaderParagraphs(titleAr, titleEn),
        new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun({ text: '1. بيانات الموظف (Employee Information)', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        createEmployeeInfoTable(emp),
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: '2. معلومات انتهاء الخدمة ومسوغات الطلب', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        termTable,
        new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: '3. إقرار الموظف وتوصية المدير واعتماد الموارد البشرية', font: 'Arial', size: 20, bold: true, color: COMPANY_BRAND.primaryColor })] }),
        createSignaturesTable(emp.manager_name_ar)
      ]
    }]
  });
}

/**
 * Main generator dispatcher
 */
async function generateWordForm(formType, empId, params = {}) {
  let emp = null;
  const baseSql = `
    SELECT e.*, d.name_ar AS department_name_ar, b.name_ar AS branch_name_ar,
           m.full_name_ar AS manager_name_ar
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN branches b ON e.branch_id = b.id
    LEFT JOIN employees m ON e.manager_id = m.id
  `;

  if (empId && !isNaN(Number(empId))) {
    emp = get(`${baseSql} WHERE e.id = ?`, [Number(empId)]);
  }
  if (!emp && empId && typeof empId === 'string') {
    emp = get(`${baseSql} WHERE e.emp_code = ?`, [empId.trim()]);
  }
  if (!emp && params.emp_code) {
    emp = get(`${baseSql} WHERE e.emp_code = ?`, [params.emp_code.trim()]);
  }
  if (!emp) {
    emp = get(`${baseSql} ORDER BY e.id ASC LIMIT 1`);
  }

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
    case 'absence_penalty':
    case 'penalty_absence':
      doc = buildAbsencePenaltyNoticeDoc(emp, params);
      filename = `إشعار_عقوبة_غياب_${emp.emp_code}_${emp.full_name_ar.replace(/\s+/g, '_')}.docx`;
      break;
    case 'instruction_penalty':
    case 'penalty_instructions':
      doc = buildInstructionPenaltyNoticeDoc(emp, params);
      filename = `إشعار_عقوبة_مخالفة_التعليمات_${emp.emp_code}_${emp.full_name_ar.replace(/\s+/g, '_')}.docx`;
      break;
    case 'clearance':
    case 'clearance_form':
      doc = buildClearanceDoc(emp, params);
      filename = `إخلاء_طرف_${emp.emp_code}_${emp.full_name_ar.replace(/\s+/g, '_')}.docx`;
      break;
    case 'contract_non_renewal':
      doc = buildContractNonRenewalDoc(emp, params);
      filename = `إشعار_عدم_تجديد_عقد_${emp.emp_code}_${emp.full_name_ar.replace(/\s+/g, '_')}.docx`;
      break;
    case 'penalty_procedure':
      doc = buildPenaltyProcedureDoc(emp, params);
      filename = `إجراء_جزائي_${emp.emp_code}_${emp.full_name_ar.replace(/\s+/g, '_')}.docx`;
      break;
    case 'resignation_termination':
    case 'termination_request':
      doc = buildResignationTerminationDoc(emp, params);
      filename = `طلب_إنهاء_خدمة_${emp.emp_code}_${emp.full_name_ar.replace(/\s+/g, '_')}.docx`;
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
