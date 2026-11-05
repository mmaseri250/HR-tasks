/**
 * server/modules/eosCalculatorService.js
 * Comprehensive End-of-Service (EOS) Award Calculator & Final Settlement Engine
 * Fully compliant with Saudi Labor Law (Articles 53, 74, 77, 79, 80, 81, 84, 85, 87, 111, 137)
 * Jawharat Al-Majd Trading Company HRMS
 */

const { query, get, run } = require('../database/db');
const branding = require('./branding');

/**
 * Official Saudi Labor Law Termination Cases & Entitlement Rules
 */
const SAUDI_EOS_TERMINATION_CASES = [
  {
    id: 'resignation',
    name: 'استقالة الموظف',
    article: 'المادة 84 والمادة 85 من نظام العمل',
    category: 'استقالة',
    entitlement_type: 'resignation_scale',
    description: 'استقالة اختيارية من الموظف: لا يستحق شيئاً إذا قلت الخدمة عن سنتين، ويستحق الثلث من سنتين إلى خمس سنوات، والثلثين من خمس إلى عشر سنوات، والمكافأة كاملة إذا بلغت عشر سنوات فأكثر.'
  },
  {
    id: 'probation_termination',
    name: 'فسخ العقد خلال فترة التجربة وفقاً للمادة 53 من نظام العمل',
    article: 'المادة 53 من نظام العمل',
    category: 'فترة التجربة',
    entitlement_type: 'zero',
    description: 'لا يستحق العامل أي مكافأة نهاية خدمة أو تعويض إذا تم إنهاء العقد خلال فترة التجربة المنصوص عليها بالعقد.'
  },
  {
    id: 'mutual_agreement',
    name: 'باتفاق الطرفين وفقاً للمادة 74 من نظام العمل',
    article: 'المادة 74 فقرة (1) والمادة 84 من نظام العمل',
    category: 'اتفاق الطرفين',
    entitlement_type: 'full',
    description: 'استحقاق مكافأة نهاية الخدمة كاملة بنسبة 100% باتفاق الطرفين كتابياً على إنهاء العلاقة التعاقدية.'
  },
  {
    id: 'article_80_dismissal',
    name: 'فسخ عقد العمل من قبل صاحب العمل وفقاً للمادة 80 من نظام العمل',
    article: 'المادة 80 من نظام العمل',
    category: 'فسخ تأديبي',
    entitlement_type: 'zero',
    description: 'يسقط حق العامل تماماً في مكافأة نهاية الخدمة والإشعار والتعويض إذا كان الفسخ لإحدى الحالات المنصوص عليها في المادة 80.'
  },
  {
    id: 'contract_expiry',
    name: 'إنتهاء العقد بإنتهاء مدته',
    article: 'المادة 74 فقرة (2) والمادة 84 من نظام العمل',
    category: 'انتهاء العقد',
    entitlement_type: 'full',
    description: 'استحقاق مكافأة نهاية الخدمة كاملة بنسبة 100% لانقضاء الأجل المحدد في العقد دون تجديده وفقاً للمادة 84.'
  },
  {
    id: 'retirement',
    name: 'بلوغ العامل سن التقاعد وفقاً للمادة 74 من نظام العمل',
    article: 'المادة 74 فقرة (4) والمادة 84 من نظام العمل',
    category: 'تقاعد',
    entitlement_type: 'full',
    description: 'استحقاق المكافأة كاملة بنسبة 100% عند بلوغ سن التقاعد النظامي (60 سنة للعمال و55 سنة للعاملات ما لم ينص العقد على غير ذلك).'
  },
  {
    id: 'facility_closure',
    name: 'إغلاق المنشأة نهائياً وفقاً للمادة 74 من نظام العمل',
    article: 'المادة 74 فقرة (6) والمادة 84 من نظام العمل',
    category: 'إغلاق المنشأة',
    entitlement_type: 'full',
    description: 'استحقاق مكافأة نهاية الخدمة كاملة بنسبة 100% عند إغلاق المنشأة نهائياً وفقاً للمادة 74.'
  },
  {
    id: 'activity_cessation',
    name: 'إنهاء النشاط الذي يعمل فيه العامل وفقاً للمادة 74 من نظام العمل',
    article: 'المادة 74 فقرة (7) والمادة 84 من نظام العمل',
    category: 'إنهاء النشاط',
    entitlement_type: 'full',
    description: 'استحقاق مكافأة نهاية الخدمة كاملة بنسبة 100% عند إنهاء النشاط أو القسم الذي يعمل فيه العامل وفقاً للمادة 74.'
  },
  {
    id: 'article_77_unlawful',
    name: 'إنهاء العقد دون سبب مشروع وفقاً للمادة 77 من نظام العمل',
    article: 'المادة 77 والمادة 84 من نظام العمل',
    category: 'إنهاء غير مشروع',
    entitlement_type: 'article_77_full',
    description: 'استحقاق مكافأة نهاية الخدمة كاملة بنسبة 100% بالإضافة إلى تعويض المادة 77 (أجر 15 يوماً عن كل سنة للعقد غير المحدد، أو أجر المدة المتبقية للعقد المحدد، بحد أدنى أجر شهرين).'
  },
  {
    id: 'employee_death',
    name: 'وفاة العامل وفقاً للمادة 79 من نظام العمل',
    article: 'المادة 79 والمادة 84 من نظام العمل',
    category: 'وفاة العامل',
    entitlement_type: 'full',
    description: 'تصرف المكافأة كاملة بنسبة 100% للورثة الشرعيين للعامل المتوفى دون أي استقطاع.'
  },
  {
    id: 'work_injury_disability',
    name: 'عجز العامل عن العمل (الناتج عن إصابة العمل) وفقاً للمادة 137 من نظام العمل',
    article: 'المادة 137 والمادة 84 من نظام العمل',
    category: 'عجز وإصابة عمل',
    entitlement_type: 'full',
    description: 'استحقاق المكافأة كاملة بنسبة 100% بالإضافة إلى التعويضات المقررة نظاماً عن إصابة العمل.'
  },
  {
    id: 'ownership_transfer',
    name: 'إنتقال ملكية المنشأة (الفردية) إلى مالك جديد وفقاً للمادة 18 من نظام العمل',
    article: 'المادة 18 والمادة 84 من نظام العمل',
    category: 'انتقال الملكية',
    entitlement_type: 'full',
    description: 'استحقاق مكافأة نهاية الخدمة كاملة بنسبة 100% عند انتقال ملكية المنشأة إلى مالك جديد وتصفية مستحقات العمال.'
  },
  {
    id: 'female_maternity_leave',
    name: 'إنهاء المرأة العاملة العقد بسبب الوضع وفقاً للمادة 87 من نظام العمل',
    article: 'المادة 87 من نظام العمل',
    category: 'استثناء الوضع',
    entitlement_type: 'full',
    description: 'تستحق العاملة المكافأة كاملة بنسبة 100% إذا أنهت العقد خلال 3 أشهر من تاريخ الوضع استثناءً من أحكام الاستقالة.'
  },
  {
    id: 'female_marriage_leave',
    name: 'إنهاء المرأة العاملة العقد بسبب الزواج وفقاً للمادة 87 من نظام العمل',
    article: 'المادة 87 من نظام العمل',
    category: 'استثناء الزواج',
    entitlement_type: 'full',
    description: 'تستحق العاملة المكافأة كاملة بنسبة 100% إذا أنهت العقد خلال 6 أشهر من تاريخ عقد زواجها استثناءً من أحكام الاستقالة.'
  },
  {
    id: 'employer_death',
    name: 'وفاة صاحب العمل وفقاً للمادة 79 من نظام العمل إذا كانت شخصيته قد روعيت في عقد العمل',
    article: 'المادة 79 والمادة 84 من نظام العمل',
    category: 'وفاة صاحب العمل',
    entitlement_type: 'full',
    description: 'استحقاق المكافأة كاملة بنسبة 100% عند وفاة صاحب العمل إذا كانت شخصيته قد روعيت في عقد العمل.'
  },
  {
    id: 'article_81_employee_leave',
    name: 'فسخ العقد من قبل العامل وفقاً للمادة 81 من نظام العمل',
    article: 'المادة 81 والمادة 87 من نظام العمل',
    category: 'فسخ مشروع من العامل',
    entitlement_type: 'full',
    description: 'يستحق العامل مكافأة نهاية الخدمة كاملة بنسبة 100% إذا ترك العمل بسبب إخلال صاحب العمل بالتزاماته الجوهرية أو الاعتداء أو تكليفه بعمل يختلف جوهرياً.'
  }
];

/**
 * Converts numbers into formal Arabic currency words (Tafqeet)
 */
function tafqeetArabic(number) {
  if (isNaN(number) || number === null || number === undefined) return '';
  const val = Math.round(Number(number) * 100) / 100;
  if (val === 0) return 'فقط وقدره صفر ريال سعودي لا غير';

  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة',
    'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

  function convertChunk(n) {
    let str = '';
    const h = Math.floor(n / 100);
    const rem = n % 100;
    if (h > 0) {
      str += hundreds[h];
      if (rem > 0) str += ' و ';
    }
    if (rem > 0) {
      if (rem < 20) {
        str += ones[rem];
      } else {
        const o = rem % 10;
        const t = Math.floor(rem / 10);
        if (o > 0) {
          str += ones[o] + ' و ' + tens[t];
        } else {
          str += tens[t];
        }
      }
    }
    return str;
  }

  const intPart = Math.floor(val);
  const fracPart = Math.round((val - intPart) * 100);

  const billions = Math.floor(intPart / 1000000000);
  let remInt = intPart % 1000000000;
  const millions = Math.floor(remInt / 1000000);
  remInt = remInt % 1000000;
  const thousands = Math.floor(remInt / 1000);
  const units = remInt % 1000;

  const parts = [];

  if (billions > 0) {
    if (billions === 1) parts.push('مليار');
    else if (billions === 2) parts.push('ملياران');
    else if (billions <= 10) parts.push(convertChunk(billions) + ' مليارات');
    else parts.push(convertChunk(billions) + ' مليار');
  }

  if (millions > 0) {
    if (millions === 1) parts.push('مليون');
    else if (millions === 2) parts.push('مليونان');
    else if (millions <= 10) parts.push(convertChunk(millions) + ' ملايين');
    else parts.push(convertChunk(millions) + ' مليون');
  }

  if (thousands > 0) {
    if (thousands === 1) parts.push('ألف');
    else if (thousands === 2) parts.push('ألفان');
    else if (thousands <= 10) parts.push(convertChunk(thousands) + ' آلاف');
    else parts.push(convertChunk(thousands) + ' ألف');
  }

  if (units > 0) {
    parts.push(convertChunk(units));
  }

  let result = parts.join(' و ');
  result += result ? ' ريال سعودي' : '';

  if (fracPart > 0) {
    result += (result ? ' و ' : '') + convertChunk(fracPart) + ' هللة';
  }

  return 'فقط وقدره ' + result + ' لا غير';
}

/**
 * Calculates service period breakdown in exact calendar years, months, and days
 */
function calculateServicePeriod(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return { years: 0, months: 0, days: 0, totalYears: 0, formatted: '0 يوم' };
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const totalYears = Math.round((diffDays / 365.25) * 100) / 100;

  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'سنة' : (years === 2 ? 'سنتان' : (years <= 10 ? 'سنوات' : 'سنة'))}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'شهر' : (months === 2 ? 'شهران' : (months <= 10 ? 'أشهر' : 'شهر'))}`);
  if (days > 0) parts.push(`${days} ${days === 1 ? 'يوم' : (days === 2 ? 'يومان' : (days <= 10 ? 'أيام' : 'يوماً'))}`);

  return {
    years,
    months,
    days,
    diffDays,
    totalYears,
    formatted: parts.length > 0 ? parts.join(' و ') : 'أقل من يوم'
  };
}

/**
 * Base Gratuity Calculation Engine based on Saudi Labor Law Article 84
 * - First 5 years: Half-month salary per year
 * - Subsequent years: Full-month salary per year
 * - Fractional years calculated proportionally
 */
function calculateBaseGratuity(wage, totalYears) {
  if (totalYears <= 0 || wage <= 0) return 0;
  let base = 0;
  if (totalYears <= 5) {
    base = totalYears * (wage * 0.5);
  } else {
    base = (5 * (wage * 0.5)) + ((totalYears - 5) * wage);
  }
  return Math.round(base * 100) / 100;
}

/**
 * Resolves termination case and applies Saudi Labor Law statutory rules
 */
function resolveTerminationCase(caseIdOrName) {
  if (!caseIdOrName) return SAUDI_EOS_TERMINATION_CASES[0];
  const queryStr = String(caseIdOrName).trim();

  const exact = SAUDI_EOS_TERMINATION_CASES.find(c => c.id === queryStr || c.name === queryStr);
  if (exact) return exact;

  if (queryStr === 'resignation' || queryStr.includes('استقالة')) return SAUDI_EOS_TERMINATION_CASES.find(c => c.id === 'resignation');
  if (queryStr === 'probation_termination' || queryStr.includes('53') || queryStr.includes('تجربة')) return SAUDI_EOS_TERMINATION_CASES.find(c => c.id === 'probation_termination');
  if (queryStr === 'article_80_dismissal' || queryStr.includes('80') || queryStr.includes('خطأ جسيم')) return SAUDI_EOS_TERMINATION_CASES.find(c => c.id === 'article_80_dismissal');
  if (queryStr === 'article_81_employee_leave' || queryStr.includes('81') || queryStr.includes('إخلال')) return SAUDI_EOS_TERMINATION_CASES.find(c => c.id === 'article_81_employee_leave');
  if (queryStr === 'article_77_unlawful' || queryStr.includes('77') || queryStr.includes('دون سبب مشروع')) return SAUDI_EOS_TERMINATION_CASES.find(c => c.id === 'article_77_unlawful');
  if (queryStr === 'contract_expiry' || queryStr.includes('إنتهاء العقد') || queryStr.includes('انتهاء العقد') || queryStr.includes('إنتهاء مدته') || queryStr.includes('انتهاء مدته')) return SAUDI_EOS_TERMINATION_CASES.find(c => c.id === 'contract_expiry');
  if (queryStr === 'mutual_agreement' || queryStr.includes('باتفاق') || queryStr.includes('تراضي')) return SAUDI_EOS_TERMINATION_CASES.find(c => c.id === 'mutual_agreement');
  if (queryStr === 'retirement' || queryStr.includes('تقاعد')) return SAUDI_EOS_TERMINATION_CASES.find(c => c.id === 'retirement');
  if (queryStr === 'facility_closure' || queryStr.includes('إغلاق المنشأة') || queryStr.includes('اغلاق المنشأة')) return SAUDI_EOS_TERMINATION_CASES.find(c => c.id === 'facility_closure');
  if (queryStr === 'activity_cessation' || queryStr.includes('إنهاء النشاط') || queryStr.includes('انهاء النشاط')) return SAUDI_EOS_TERMINATION_CASES.find(c => c.id === 'activity_cessation');
  if (queryStr === 'work_injury_disability' || queryStr.includes('137') || queryStr.includes('عجز') || queryStr.includes('إصابة')) return SAUDI_EOS_TERMINATION_CASES.find(c => c.id === 'work_injury_disability');
  if (queryStr === 'ownership_transfer' || queryStr.includes('18') || queryStr.includes('ملكية') || queryStr.includes('انتقال')) return SAUDI_EOS_TERMINATION_CASES.find(c => c.id === 'ownership_transfer');
  if (queryStr === 'female_maternity_leave' || queryStr.includes('الوضع') || queryStr.includes('وضع')) return SAUDI_EOS_TERMINATION_CASES.find(c => c.id === 'female_maternity_leave');
  if (queryStr === 'female_marriage_leave' || queryStr.includes('الزواج') || queryStr.includes('زواج')) return SAUDI_EOS_TERMINATION_CASES.find(c => c.id === 'female_marriage_leave');
  if (queryStr === 'employer_death' || (queryStr.includes('وفاة') && queryStr.includes('صاحب العمل'))) return SAUDI_EOS_TERMINATION_CASES.find(c => c.id === 'employer_death');
  if (queryStr === 'employee_death' || queryStr.includes('وفاة') || queryStr.includes('79')) return SAUDI_EOS_TERMINATION_CASES.find(c => c.id === 'employee_death');

  return SAUDI_EOS_TERMINATION_CASES[0];
}

class EosCalculatorService {

  /**
   * Main calculation function supporting both employee-bound and ad-hoc free calculations
   */
  calculateEos(params) {
    return this.calculateSettlement(params);
  }

  calculateSettlement(params) {
    const empIdentifier = params.emp_id || params.emp_code || null;
    let emp = null;
    if (empIdentifier || params.emp_code) {
      emp = get(`
        SELECT e.*, d.name_ar as department_name, b.name_ar as branch_name
        FROM employees e
        LEFT JOIN departments d ON e.department_id = d.id
        LEFT JOIN branches b ON e.branch_id = b.id
        WHERE e.id = ? OR e.emp_code = ? OR e.emp_code = ?
      `, [params.emp_id || 0, String(params.emp_id || ''), params.emp_code || '']);
    }

    // Determine working values
    const effectiveHireDate = params.hire_date || emp?.join_date || new Date().toISOString().split('T')[0];
    const effectiveEndDate = params.end_date || new Date().toISOString().split('T')[0];

    // Support Single Gross Salary field (إجمالي الراتب الفعلي الشامل) with backward compatibility
    const rawGross = params.gross_salary !== undefined && params.gross_salary !== null ? Number(params.gross_salary) : null;
    const rawBasic = params.basic_salary !== undefined && params.basic_salary !== null ? Number(params.basic_salary) : null;
    const rawHousing = Number(params.housing_allowance || 0);
    const rawTransport = Number(params.transport_allowance || 0);
    const rawOther = Number(params.other_allowances !== undefined ? params.other_allowances : (params.other_allowance || 0));

    let effectiveGross = 0;
    if (rawGross !== null && !isNaN(rawGross) && rawGross > 0) {
      effectiveGross = rawGross;
    } else if (rawBasic !== null && !isNaN(rawBasic) && rawBasic > 0) {
      const sum = rawBasic + rawHousing + rawTransport + rawOther;
      effectiveGross = sum > 0 ? sum : rawBasic;
    } else if (emp) {
      effectiveGross = Number(emp.salary || ((emp.basic_salary || 0) + (emp.housing_allowance || 0) + (emp.transport_allowance || 0) + (emp.other_allowance || 0))) || 0;
    }
    if (effectiveGross <= 0) effectiveGross = 5000;
    const effectiveBasic = rawBasic !== null && rawBasic > 0 ? rawBasic : effectiveGross;
    const effectiveHousing = rawHousing;
    const effectiveTransport = rawTransport;
    const effectiveOther = rawOther;

    const effectiveLeaveBalance = Number(
      params.leave_balance_days !== undefined ? params.leave_balance_days :
      (params.leave_balance !== undefined && params.leave_balance !== null ? params.leave_balance : (emp?.annual_leave_balance || 0))
    );

    // Contract Type Option (محدد المدة - غير محدد المدة)
    const rawContract = params.contract_type || emp?.contract_type || 'محدد المدة';
    const isFixedTerm = !String(rawContract).includes('غير محدد');
    const effectiveContractType = isFixedTerm ? 'محدد المدة' : 'غير محدد المدة';

    const remaining_contract_months = Number(params.remaining_contract_months || 0);
    const unpaid_salary = Number(params.unpaid_salary_amount !== undefined ? params.unpaid_salary_amount : (params.unpaid_salary || 0));
    const loans_deduction = Number(params.loans_balance !== undefined ? params.loans_balance : (params.loans_deduction || 0));
    const other_deductions = Number(params.other_deductions || 0);

    // 1. Calculate Service Period
    const servicePeriod = calculateServicePeriod(effectiveHireDate, effectiveEndDate);
    const totalYears = servicePeriod.totalYears;

    // 2. Base Gratuity (Article 84)
    const baseGratuity = calculateBaseGratuity(effectiveGross, totalYears);

    // 3. Resolve Termination Case & Entitlement Rate
    const rawTermination = params.termination_reason_code || params.termination_type || 'resignation';
    const termCase = resolveTerminationCase(rawTermination);
    let entitlementRate = 1.0;
    let entitlementPercentageLabel = '100% (المكافأة كاملة)';
    let statutoryRule = '';

    if (termCase.entitlement_type === 'zero') {
      entitlementRate = 0.0;
      entitlementPercentageLabel = '0% (لا يستحق مكافأة)';
      statutoryRule = termCase.id === 'article_80_dismissal'
        ? 'بموجب المادة 80 من نظام العمل: لا يستحق العامل أي مكافأة أو تعويض أو مكافأة إشعار نظراً لفسخ العقد لارتكاب مخالفة جوهرية.'
        : 'بموجب المادة 53 من نظام العمل: لا يستحق العامل مكافأة نهاية خدمة عند إنهاء العقد خلال فترة التجربة.';
    } else if (termCase.entitlement_type === 'resignation_scale') {
      if (totalYears < 2) {
        entitlementRate = 0.0;
        entitlementPercentageLabel = '0% (مدة الخدمة أقل من سنتين)';
        statutoryRule = 'استقالة العامل: لا يستحق العامل المستقيل أي مكافأة نهاية خدمة إذا كانت مدة خدمته أقل من سنتين متتاليتين.';
      } else if (totalYears < 5) {
        entitlementRate = 1.0 / 3.0;
        entitlementPercentageLabel = '33.33% (ثلث المكافأة المستحقة)';
        statutoryRule = 'استقالة العامل: يستحق العامل المستقيل ثلث المكافأة (33.33%) بعد قضاء خدمة لا تقل عن سنتين متتاليتين ولا تزيد على خمس سنوات.';
      } else if (totalYears < 10) {
        entitlementRate = 2.0 / 3.0;
        entitlementPercentageLabel = '66.67% (ثلثي المكافأة المستحقة)';
        statutoryRule = 'استقالة العامل: يستحق العامل المستقيل ثلثي المكافأة (66.67%) إذا زادت مدة خدمته على خمس سنوات متتالية ولم تبلغ عشر سنوات.';
      } else {
        entitlementRate = 1.0;
        entitlementPercentageLabel = '100% (المكافأة كاملة)';
        statutoryRule = 'استقالة العامل: يستحق العامل المستقيل المكافأة كاملة بنسبة 100% إذا بلغت مدة خدمته عشر سنوات فأكثر.';
      }
    } else if (termCase.entitlement_type === 'article_77_full') {
      entitlementRate = 1.0;
      entitlementPercentageLabel = '100% (كامل المكافأة + تعويض م77)';
      statutoryRule = 'بموجب المادة 77 والمادة 84 من نظام العمل: يستحق العامل مكافأة نهاية الخدمة كاملة بالإضافة لتعويض الإنهاء غير المشروع.';
    } else {
      entitlementRate = 1.0;
      entitlementPercentageLabel = '100% (المكافأة كاملة)';
      statutoryRule = `بموجب المادة 84 و ${termCase.article}: يستحق العامل مكافأة نهاية الخدمة كاملة بنسبة 100%.`;
    }

    // 4. Net EOS Award
    const eosAward = Math.round(baseGratuity * entitlementRate * 100) / 100;

    // 5. Leave Balance Compensation (المادة 111)
    const dailyWage = effectiveGross / 30.0;
    const vacationCompensation = Math.max(0, Math.round(effectiveLeaveBalance * dailyWage * 100) / 100);

    // 6. Article 77 Compensation (if applicable)
    let article77Compensation = 0;
    let article77Details = '';
    if (termCase.id === 'article_77_unlawful') {
      const minCompensation = effectiveGross * 2; // minimum 2 months
      if (isFixedTerm && remaining_contract_months > 0) {
        // Fixed-term: remaining months salary, min 2 months
        article77Compensation = Math.max(minCompensation, Math.round(remaining_contract_months * effectiveGross * 100) / 100);
        article77Details = `تعويض المدة المتبقية من العقد محدد المدة (${remaining_contract_months} شهر) بحد أدنى أجر شهرين = ${article77Compensation.toLocaleString()} ر.س`;
      } else if (isFixedTerm) {
        article77Compensation = minCompensation;
        article77Details = `تعويض إنهاء العقد محدد المدة (الحد الأدنى النظامي أجر شهرين) = ${article77Compensation.toLocaleString()} ر.س`;
      } else {
        // Indefinite contract: 15 days per year, min 2 months
        const calculated = Math.round(totalYears * (effectiveGross * 0.5) * 100) / 100;
        article77Compensation = Math.max(minCompensation, calculated);
        article77Details = `تعويض أجر 15 يوماً عن كل سنة خدمة للعقد غير محدد المدة (${totalYears} سنة) بحد أدنى أجر شهرين = ${article77Compensation.toLocaleString()} ر.س`;
      }
    }

    // 7. Deductions
    const totalDeductions = Math.max(0, Math.round((Number(loans_deduction || 0) + Number(other_deductions || 0)) * 100) / 100);

    // 8. Total Entitlements & Net Payable
    const totalEntitlements = Math.round((eosAward + vacationCompensation + article77Compensation + Number(unpaid_salary || 0)) * 100) / 100;
    const netPayable = Math.max(0, Math.round((totalEntitlements - totalDeductions) * 100) / 100);

    // 9. Tafqeet in Arabic
    const tafqeetText = tafqeetArabic(netPayable);

    const numericEntitlementPercentage = typeof entitlementPercentageLabel === 'number'
      ? entitlementPercentageLabel
      : (parseFloat(String(entitlementPercentageLabel).replace('%', '')) || 0);

    return {
      // Direct root convenience properties
      contract_type: effectiveContractType,
      gross_salary: effectiveGross,
      service_years: servicePeriod.years,
      service_months: servicePeriod.months,
      service_days: servicePeriod.days,
      total_years: servicePeriod.totalYears,
      service_period_formatted: servicePeriod.formatted,
      base_gratuity: baseGratuity,
      entitlement_percentage: numericEntitlementPercentage,
      entitlement_rate: entitlementRate,
      end_of_service_award: eosAward,
      leave_compensation: vacationCompensation,
      article_77_compensation: article77Compensation,
      article_77_details: article77Details,
      unpaid_salary_amount: Number(unpaid_salary || 0),
      total_entitlements: totalEntitlements,
      total_deductions: totalDeductions,
      net_payable_amount: netPayable,
      statutory_rule: statutoryRule,
      tafqeet_ar: tafqeetText,

      // Structured nested properties
      employee: {
        id: emp?.id || null,
        emp_code: params.emp_code || emp?.emp_code || 'GUEST-001',
        full_name_ar: params.employee_name_ar || params.full_name_ar || emp?.full_name_ar || 'موظف المنشأة',
        national_id: params.national_id || emp?.national_id || '--',
        nationality: params.nationality || emp?.nationality || 'سعودي',
        job_title_ar: params.job_title_ar || emp?.job_title_ar || 'موظف',
        department_name: params.department_name || emp?.department_name || 'الإدارة العامة',
        branch_name: emp?.branch_name || 'المقر الرئيسي',
        basic_salary: effectiveBasic,
        housing_allowance: effectiveHousing,
        transport_allowance: effectiveTransport,
        other_allowance: effectiveOther,
        gross_salary: effectiveGross,
        leave_balance: effectiveLeaveBalance,
        contract_type: effectiveContractType
      },
      dates: {
        hire_date: effectiveHireDate,
        end_date: effectiveEndDate
      },
      service_period: {
        years: servicePeriod.years,
        months: servicePeriod.months,
        days: servicePeriod.days,
        total_years: servicePeriod.totalYears,
        diff_days: servicePeriod.diffDays,
        formatted: servicePeriod.formatted
      },
      termination: {
        case_id: termCase.id,
        name: termCase.name,
        article: termCase.article,
        category: termCase.category,
        description: termCase.description,
        statutory_rule: statutoryRule,
        entitlement_rate: entitlementRate,
        entitlement_percentage: entitlementPercentageLabel
      },
      breakdown: {
        base_gratuity: baseGratuity,
        entitlement_rate: entitlementRate,
        eos_award: eosAward,
        vacation_compensation: vacationCompensation,
        article77_compensation: article77Compensation,
        article77_details: article77Details,
        unpaid_salary: Number(unpaid_salary || 0),
        total_entitlements: totalEntitlements,
        loans_deduction: Number(loans_deduction || 0),
        other_deductions: Number(other_deductions || 0),
        total_deductions: totalDeductions,
        net_payable: netPayable,
        tafqeet_ar: tafqeetText
      }
    };
  }

  /**
   * Saves final settlement to eos_settlements table
   */
  saveSettlement(params) {
    const calc = this.calculateSettlement(params);
    const b = calc.breakdown;
    const e = calc.employee;
    const d = calc.dates;
    const sp = calc.service_period;
    const t = calc.termination;

    // Generate settlement number: JM-EOS-YYYY-XXXX
    const currentYear = new Date().getFullYear();
    const countRow = get('SELECT COUNT(*) as c FROM eos_settlements WHERE settlement_no LIKE ?', [`JM-EOS-${currentYear}-%`]);
    const nextSeq = String((countRow?.c || 0) + 1).padStart(4, '0');
    const settlementNo = `JM-EOS-${currentYear}-${nextSeq}`;

    const res = run(`
      INSERT INTO eos_settlements (
        settlement_no, emp_id, emp_code, full_name_ar, national_id,
        job_title, department_name, hire_date, end_date,
        service_years, service_months, service_days, total_service_years,
        basic_salary, gross_salary, termination_type,
        award_amount, vacation_compensation, remaining_leave_days,
        unpaid_salary, loans_deduction, other_deductions,
        net_payable, reason, clearance_status, approved_by, approved_at, contract_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?)
    `, [
      settlementNo,
      e.id,
      e.emp_code,
      e.full_name_ar,
      e.national_id,
      e.job_title_ar,
      e.department_name,
      d.hire_date,
      d.end_date,
      sp.years,
      sp.months,
      sp.days,
      sp.total_years,
      e.basic_salary,
      e.gross_salary,
      t.name,
      b.eos_award,
      b.vacation_compensation,
      e.leave_balance,
      b.unpaid_salary,
      b.loans_deduction,
      b.other_deductions,
      b.net_payable,
      t.statutory_rule,
      params.clearance_status || 'معتمد - جاهز للصرف',
      params.approved_by || 'إدارة الموارد البشرية',
      e.contract_type || 'محدد المدة'
    ]);

    // If an employee was associated, optionally record in terminated_employees as well
    if (e.id && params.mark_employee_terminated === true) {
      run("UPDATE employees SET status = 'منهي خدماته' WHERE id = ?", [e.id]);
    }

    const saved = this.getSettlementById(res.lastInsertRowid);
    return {
      success: true,
      id: saved.id,
      settlement_number: saved.settlement_no,
      data: saved,
      ...saved
    };
  }

  /**
   * Retrieves all settlements with optional filtering
   */
  getSettlements(filters = {}) {
    let sql = 'SELECT * FROM eos_settlements WHERE 1=1';
    const params = [];

    if (filters.search) {
      sql += ' AND (full_name_ar LIKE ? OR emp_code LIKE ? OR settlement_no LIKE ? OR national_id LIKE ?)';
      const term = `%${filters.search}%`;
      params.push(term, term, term, term);
    }

    if (filters.termination_type) {
      sql += ' AND termination_type LIKE ?';
      params.push(`%${filters.termination_type}%`);
    }

    if (filters.clearance_status) {
      sql += ' AND clearance_status = ?';
      params.push(filters.clearance_status);
    }

    sql += ' ORDER BY id DESC';
    return query(sql, params);
  }

  /**
   * Fetches single settlement by ID or settlement_no
   */
  getSettlementById(idOrNo) {
    let item = null;
    if (String(idOrNo).startsWith('JM-EOS-')) {
      item = get('SELECT * FROM eos_settlements WHERE settlement_no = ?', [idOrNo]);
    } else {
      item = get('SELECT * FROM eos_settlements WHERE id = ?', [Number(idOrNo)]);
    }

    if (!item) return null;

    // Attach Tafqeet and property aliases
    item.settlement_number = item.settlement_no;
    item.net_payable_amount = item.net_payable;
    item.end_of_service_award = item.award_amount;
    item.employee_name_ar = item.full_name_ar;
    item.tafqeet_ar = tafqeetArabic(item.net_payable);
    return item;
  }

  /**
   * Generates official printable Clearance & Discharge Form (مخالصة نهائية وإبراء ذمة شامل)
   */
  generateClearancePrintHtml(idOrNo) {
    let item = null;
    if (typeof idOrNo === 'object' && idOrNo !== null) {
      const d = idOrNo;
      const b = d.breakdown || {};
      const e = d.employee || {};
      const dt = d.dates || {};
      const sp = d.service_period || {};
      const t = d.termination || {};
      item = {
        settlement_no: d.settlement_no || d.settlement_number || 'JM-EOS-معتمد',
        full_name_ar: e.full_name_ar || d.full_name_ar || d.employee_name_ar || 'موظف المنشأة',
        emp_code: e.emp_code || d.emp_code || 'GUEST-001',
        national_id: e.national_id || d.national_id || '--',
        job_title: e.job_title_ar || d.job_title || d.job_title_ar || 'موظف',
        department_name: e.department_name || d.department_name || 'الإدارة العامة',
        contract_type: e.contract_type || d.contract_type || 'محدد المدة',
        gross_salary: e.gross_salary || d.gross_salary || d.basic_salary || 0,
        basic_salary: e.basic_salary || d.basic_salary || 0,
        hire_date: dt.hire_date || d.hire_date || '--',
        end_date: dt.end_date || d.end_date || '--',
        service_years: sp.years !== undefined ? sp.years : (d.service_years || 0),
        service_months: sp.months !== undefined ? sp.months : (d.service_months || 0),
        service_days: sp.days !== undefined ? sp.days : (d.service_days || 0),
        total_service_years: sp.total_years !== undefined ? sp.total_years : (d.total_years || d.total_service_years || 0),
        termination_type: t.name || d.termination_type || d.termination_reason_code || 'استقالة الموظف',
        reason: t.statutory_rule || d.statutory_rule || d.reason || '',
        award_amount: b.eos_award !== undefined ? b.eos_award : (d.award_amount !== undefined ? d.award_amount : (d.end_of_service_award || 0)),
        vacation_compensation: b.vacation_compensation !== undefined ? b.vacation_compensation : (d.vacation_compensation !== undefined ? d.vacation_compensation : (d.leave_compensation || 0)),
        remaining_leave_days: e.leave_balance !== undefined ? e.leave_balance : (d.remaining_leave_days !== undefined ? d.remaining_leave_days : (d.leave_balance_days || 0)),
        unpaid_salary: b.unpaid_salary !== undefined ? b.unpaid_salary : (d.unpaid_salary || d.unpaid_salary_amount || 0),
        loans_deduction: b.loans_deduction !== undefined ? b.loans_deduction : (d.loans_deduction || d.loans_balance || 0),
        other_deductions: b.other_deductions !== undefined ? b.other_deductions : (d.other_deductions || 0),
        net_payable: b.net_payable !== undefined ? b.net_payable : (d.net_payable !== undefined ? d.net_payable : (d.net_payable_amount || 0)),
        clearance_status: d.clearance_status || 'معتمد - جاهز للصرف',
        created_at: d.created_at || new Date().toISOString()
      };
      item.tafqeet_ar = d.tafqeet_ar || tafqeetArabic(item.net_payable);
    } else {
      item = this.getSettlementById(idOrNo);
    }

    if (!item) throw new Error('سجل المخالصة غير موجود');

    const totalServiceStr = `${item.service_years || 0} سنة و ${item.service_months || 0} شهر و ${item.service_days || 0} يوم`;
    const tafqeet = item.tafqeet_ar || tafqeetArabic(item.net_payable);

    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>مخالصة نهائية وإبراء ذمة - ${item.full_name_ar} - ${item.settlement_no}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', sans-serif; background: #fff; color: #0f172a; padding: 24px; }
    .brand-border { border-color: #700c14; }
    .brand-text { color: #700c14; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      @page { size: A4; margin: 15mm; }
    }
  </style>
</head>
<body class="max-w-4xl mx-auto space-y-6">

  <!-- Action Bar (Print / Close) -->
  <div class="no-print flex justify-between items-center bg-slate-100 p-3.5 rounded-2xl border border-slate-200">
    <div class="text-xs font-bold text-slate-700">
      <i class="fa-solid fa-file-invoice-dollar text-brand ml-1"></i> استمارة المخالصة النهائية وإبراء الذمة الرسمية (A4)
    </div>
    <div class="flex gap-2">
      <button onclick="window.print()" class="bg-[#700c14] hover:bg-[#52090e] text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition flex items-center gap-1.5">
        <i class="fa-solid fa-print"></i> طباعة المخالصة (PDF)
      </button>
      <button onclick="window.close()" class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition">
        إغلاق
      </button>
    </div>
  </div>

  <!-- Document Container -->
  <div class="border-2 border-slate-300 rounded-3xl p-8 space-y-6 bg-white shadow-sm print:border-none print:shadow-none print:p-0">
    
    <!-- Header -->
    <div class="flex justify-between items-start border-b-2 brand-border pb-5">
      <div class="space-y-1">
        <h1 class="text-xl font-black brand-text">${branding.companyNameAr}</h1>
        <p class="text-xs font-bold text-slate-600">إدارة الشؤون الإدارية والموارد البشرية</p>
        <p class="text-[11px] text-slate-500 font-mono">سجل تجاري: ${branding.commercialRegister} • المملكة العربية السعودية</p>
      </div>

      <div class="text-center">
        <img src="${branding.logoBase64}" alt="شعار جوهرة المجد" class="h-14 max-w-[160px] object-contain mx-auto" />
        <span class="text-[9px] font-black uppercase tracking-widest text-[#700c14] block mt-1">JAWHARAT AL-MAJD</span>
      </div>

      <div class="text-left space-y-1">
        <div class="inline-block bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl text-xs font-mono font-black brand-text">
          ${item.settlement_no}
        </div>
        <p class="text-[11px] text-slate-500 font-bold">التاريخ: ${new Date(item.created_at || Date.now()).toISOString().split('T')[0]}</p>
        <p class="text-[11px] text-emerald-700 font-bold">الحالة: ${item.clearance_status || 'معتمد'}</p>
      </div>
    </div>

    <!-- Title Banner -->
    <div class="text-center py-2 bg-gradient-to-r from-amber-50 via-slate-50 to-amber-50 border border-amber-200/80 rounded-2xl">
      <h2 class="text-lg font-black brand-text">مخالصة نهائية وتصفية مستحقات وإبراء ذمة</h2>
      <p class="text-xs text-slate-600 mt-0.5">وفقاً لأحكام نظام العمل الصادر بالمرسوم الملكي رقم (م/51) وتعديلاته</p>
    </div>

    <!-- Employee Details Table -->
    <div>
      <h3 class="text-xs font-black text-slate-800 mb-2 flex items-center gap-1.5">
        <i class="fa-solid fa-id-card brand-text"></i> أولاً: بيانات الموظف والتعاقد
      </h3>
      <table class="w-full text-xs border border-slate-300 rounded-xl overflow-hidden">
        <tbody class="divide-y divide-slate-200">
          <tr class="bg-slate-50">
            <td class="p-2.5 font-bold text-slate-600 w-1/4">اسم الموظف الرباعي:</td>
            <td class="p-2.5 font-black text-slate-900 w-1/4">${item.full_name_ar}</td>
            <td class="p-2.5 font-bold text-slate-600 w-1/4">الرقم الوظيفي:</td>
            <td class="p-2.5 font-mono font-bold brand-text w-1/4">${item.emp_code}</td>
          </tr>
          <tr>
            <td class="p-2.5 font-bold text-slate-600">الهوية الوطنية / الإقامة:</td>
            <td class="p-2.5 font-mono font-bold text-slate-800">${item.national_id || '--'}</td>
            <td class="p-2.5 font-bold text-slate-600">المسمى الوظيفي:</td>
            <td class="p-2.5 font-bold text-slate-800">${item.job_title || 'موظف'}</td>
          </tr>
          <tr class="bg-slate-50">
            <td class="p-2.5 font-bold text-slate-600">الإدارة / القسم:</td>
            <td class="p-2.5 font-bold text-slate-800">${item.department_name || 'الإدارة العامة'}</td>
            <td class="p-2.5 font-bold text-slate-600">نوع العقد:</td>
            <td class="p-2.5 font-bold text-brand">${item.contract_type || 'محدد المدة'}</td>
          </tr>
          <tr>
            <td class="p-2.5 font-bold text-slate-600">إجمالي الراتب الفعلي الشامل:</td>
            <td class="p-2.5 font-mono font-bold text-emerald-700">${Number(item.gross_salary || item.basic_salary).toLocaleString()} ر.س</td>
            <td class="p-2.5 font-bold text-slate-600">رصيد الإجازات المتبقي:</td>
            <td class="p-2.5 font-bold text-slate-800">${item.remaining_leave_days || 0} يوم</td>
          </tr>
          <tr class="bg-slate-50">
            <td class="p-2.5 font-bold text-slate-600">تاريخ المباشرة:</td>
            <td class="p-2.5 font-mono text-slate-800">${item.hire_date}</td>
            <td class="p-2.5 font-bold text-slate-600">تاريخ انتهاء الخدمة:</td>
            <td class="p-2.5 font-mono text-slate-800">${item.end_date}</td>
          </tr>
          <tr>
            <td class="p-2.5 font-bold text-slate-600">إجمالي مدة الخدمة:</td>
            <td class="p-2.5 font-bold text-slate-900" colspan="3">${totalServiceStr} (${item.total_service_years} سنة)</td>
          </tr>
          <tr class="bg-amber-50">
            <td class="p-2.5 font-bold text-slate-700">سبب إنهاء العلاقة التعاقدية:</td>
            <td class="p-2.5 font-bold text-amber-950" colspan="3">${item.termination_type}</td>
          </tr>
          ${item.reason ? `
          <tr class="bg-slate-50">
            <td class="p-2.5 font-bold text-slate-600">السند النظامي والقانوني:</td>
            <td class="p-2.5 text-slate-700 text-[11px] leading-relaxed" colspan="3">${item.reason}</td>
          </tr>` : ''}
        </tbody>
      </table>
    </div>

    <!-- Financial Breakdown Table -->
    <div>
      <h3 class="text-xs font-black text-slate-800 mb-2 flex items-center gap-1.5">
        <i class="fa-solid fa-calculator brand-text"></i> ثانياً: تصفية المستحقات والاستقطاعات المالية
      </h3>
      <table class="w-full text-xs border border-slate-300 rounded-xl overflow-hidden text-right">
        <thead class="bg-slate-100 font-bold border-b border-slate-300 text-slate-700">
          <tr>
            <th class="p-2.5 w-1/2">بيان المستحقات النظامية (+)</th>
            <th class="p-2.5 w-1/2 text-left">المبلغ (ر.س)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr>
            <td class="p-2.5 font-bold text-slate-800">1. مكافأة نهاية الخدمة (وفق المادة 84 ونسبة الاستحقاق):</td>
            <td class="p-2.5 font-mono font-bold text-left text-slate-900">${Number(item.award_amount || 0).toLocaleString()} ر.س</td>
          </tr>
          <tr>
            <td class="p-2.5 font-bold text-slate-800">2. تعويض رصيد الإجازات السنوية المستحقة (${item.remaining_leave_days || 0} يوم):</td>
            <td class="p-2.5 font-mono font-bold text-left text-slate-900">${Number(item.vacation_compensation || 0).toLocaleString()} ر.س</td>
          </tr>
          ${Number(item.unpaid_salary || 0) > 0 ? `
          <tr>
            <td class="p-2.5 font-bold text-slate-800">3. أجر أيام العمل المتبقية / رواتب متأخرة:</td>
            <td class="p-2.5 font-mono font-bold text-left text-slate-900">${Number(item.unpaid_salary).toLocaleString()} ر.س</td>
          </tr>` : ''}
          <tr class="bg-slate-50 font-bold">
            <td class="p-2.5 text-slate-900">إجمالي المستحقات:</td>
            <td class="p-2.5 font-mono text-emerald-700 text-left">${Number((item.award_amount || 0) + (item.vacation_compensation || 0) + (item.unpaid_salary || 0)).toLocaleString()} ر.س</td>
          </tr>
        </tbody>

        <thead class="bg-slate-100 font-bold border-y border-slate-300 text-slate-700">
          <tr>
            <th class="p-2.5">بيان الاستقطاعات والالتزامات (-)</th>
            <th class="p-2.5 text-left">المبلغ (ر.س)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr>
            <td class="p-2.5 text-slate-700">1. سلف وقروض مستحقة على الموظف:</td>
            <td class="p-2.5 font-mono text-rose-700 font-bold text-left">${Number(item.loans_deduction || 0).toLocaleString()} ر.س</td>
          </tr>
          <tr>
            <td class="p-2.5 text-slate-700">2. استقطاعات أخرى / عهد / خصومات:</td>
            <td class="p-2.5 font-mono text-rose-700 font-bold text-left">${Number(item.other_deductions || 0).toLocaleString()} ر.س</td>
          </tr>
          <tr class="bg-slate-50 font-bold">
            <td class="p-2.5 text-slate-900">إجمالي الاستقطاعات:</td>
            <td class="p-2.5 font-mono text-rose-700 text-left">${Number((item.loans_deduction || 0) + (item.other_deductions || 0)).toLocaleString()} ر.س</td>
          </tr>
        </tbody>

        <tfoot>
          <tr class="bg-amber-100/70 border-t-2 brand-border">
            <td class="p-3 text-sm font-black brand-text">صافي المبلغ المستحق الصرف للموظف:</td>
            <td class="p-3 text-base font-black font-mono text-left text-emerald-800">${Number(item.net_payable).toLocaleString()} ر.س</td>
          </tr>
          <tr class="bg-white">
            <td colspan="2" class="p-2.5 text-center text-xs font-bold text-slate-700 bg-slate-50">
              المبلغ بالحروف: <span class="brand-text font-black">${tafqeet}</span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Legal Discharge & Acknowledgment Declaration -->
    <div class="p-4 rounded-2xl bg-slate-50 border border-slate-300 text-xs space-y-2">
      <h3 class="font-black text-slate-900 flex items-center gap-1.5">
        <i class="fa-solid fa-stamp text-[#700c14]"></i> ثالثاً: إقرار واستلام وإبراء ذمة شامل ونهائي
      </h3>
      <p class="text-slate-700 leading-relaxed text-justify">
        أقر أنا الموظف الموقع والواضع بصمته أدناه / <strong>${item.full_name_ar}</strong> (رقم الهوية/الإقامة: <strong>${item.national_id || '--'}</strong>)، بأنني قد استلمت من <strong>شركة جوهرة المجد للتجارة</strong> كامل حقوقي ومستحقاتي النظامية والتعاقدية والمالية الموضحة بعاليه والبالغة <strong>${Number(item.net_payable).toLocaleString()} ر.س</strong> (${tafqeet})، عن كامل فترة خدمتي، وتشمل مكافأة نهاية الخدمة، وبدل رصيد الإجازات، وكافة الرواتب والبدلات، وأقر بأنني قمت بتسليم كافة العهد المالية والعينية التي بحوزتي، وأبرئ ذمة الشركة وإدارتها إبراءً شاملاً وكاملاً ونهائياً وناجزاً لا رجعة فيه مسقطاً لأي حق أو دعوى عمالية أو حقوقية أمام كافة الجهات القضائية واللجان العمالية.
      </p>
    </div>

    <!-- Signatures Matrix -->
    <div class="grid grid-cols-4 gap-4 pt-6 border-t-2 border-slate-200 text-xs text-center">
      <div class="space-y-12">
        <p class="font-bold text-slate-700">توقيع الموظف المقر بما فيه:</p>
        <div>
          <p class="text-[11px] font-bold text-slate-800">${item.full_name_ar}</p>
          <p class="text-[10px] text-slate-400 mt-1">التوقيع / البصمة: ............</p>
        </div>
      </div>

      <div class="space-y-12">
        <p class="font-bold text-slate-700">المحاسب المالي:</p>
        <div>
          <p class="text-[11px] font-bold text-slate-800">التدقيق المالي</p>
          <p class="text-[10px] text-slate-400 mt-1">التوقيع: ............</p>
        </div>
      </div>

      <div class="space-y-12">
        <p class="font-bold text-slate-700">مدير الموارد البشرية:</p>
        <div>
          <p class="text-[11px] font-bold text-slate-800">الاعتماد النظامي</p>
          <p class="text-[10px] text-slate-400 mt-1">التوقيع: ............</p>
        </div>
      </div>

      <div class="space-y-12">
        <p class="font-bold brand-text">المدير العام والختم:</p>
        <div>
          <p class="text-[11px] font-bold text-slate-800">الموافقة النهائية</p>
          <p class="text-[10px] text-slate-400 mt-1">الختم والتوقيع: ............</p>
        </div>
      </div>
    </div>

  </div>

</body>
</html>
    `;
  }

  /**
   * Generates CSV report with UTF-8 BOM
   */
  exportSettlementsCsv() {
    const list = this.getSettlements();
    const headers = [
      'رقم المخالصة',
      'كود الموظف',
      'اسم الموظف',
      'نوع العقد',
      'الهوية / الإقامة',
      'المسمى الوظيفي',
      'الإدارة',
      'تاريخ التعيين',
      'تاريخ الإنهاء',
      'مدة الخدمة',
      'إجمالي الراتب الفعلي',
      'سبب الإنهاء',
      'مكافأة نهاية الخدمة',
      'تعويض الإجازات',
      'الاستقطاعات',
      'صافي المستحقات',
      'الحالة'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += headers.map(escapeCsv).join(',') + '\r\n';

    list.forEach(r => {
      const line = [
        r.settlement_no,
        r.emp_code,
        r.full_name_ar,
        r.contract_type || 'محدد المدة',
        r.national_id || '',
        r.job_title || '',
        r.department_name || '',
        r.hire_date,
        r.end_date,
        `${r.service_years} س و ${r.service_months} ش`,
        r.gross_salary || r.basic_salary,
        r.termination_type,
        r.award_amount,
        r.vacation_compensation,
        (r.loans_deduction || 0) + (r.other_deductions || 0),
        r.net_payable,
        r.clearance_status
      ];
      csvContent += line.map(escapeCsv).join(',') + '\r\n';
    });

    return csvContent;
  }
}

const eosCalculatorService = new EosCalculatorService();
module.exports = {
  eosCalculatorService,
  SAUDI_EOS_TERMINATION_CASES,
  tafqeetArabic,
  calculateServicePeriod
};
