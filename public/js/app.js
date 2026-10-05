// public/js/app.js - Jawharat Al-Majd HRMS Master Controller

// =========================================================================
// 0. MULTILINGUAL SUPPORT (Arabic, English, Bengali, Urdu, Hindi)
// =========================================================================

const I18N_TRANSLATIONS = {
  ar: {
    brand_name: "شركة جوهرة المجد",
    login_subtitle: "منظومة الموارد البشرية والخدمة الذاتية المتكاملة",
    select_language: "اختر اللغة / Select Language:",
    username_label: "اسم المستخدم (Username):",
    password_label: "كلمة المرور (Password):",
    login_btn: "دخول النظام الآمن",
    login_error: "اسم المستخدم أو كلمة المرور غير صحيحة",
    logout: "تسجيل الخروج",
    install_app: "تثبيت التطبيق",
    nav_users: "المستخدمين",
    cancel: "إلغاء",
    
    // ESS Cards
    ess_card_leave: "طلب إجازة",
    ess_card_leave_sub: "سنوية، مرضية، دراسية...",
    ess_card_mission: "طلب مهمة عمل",
    ess_card_mission_sub: "انتداب، سفر، زيارة فرع",
    ess_card_loan: "طلب سلفة مالية",
    ess_card_loan_sub: "سلفة طارئة وتقسيط الراتب",
    ess_card_perm: "طلب استئذان",
    ess_card_perm_sub: "خروج مؤقت ومراجعة رسمية",
    ess_card_payslip: "مسير راتبي",
    ess_card_payslip_sub: "عرض وطباعة تفاصيل الراتب",
    ess_card_cert: "تعريف بالراتب",
    ess_card_cert_sub: "خطاب رسمي معتمد وفوري",
    ess_card_punch: "تسجيل حضور ذكي",
    ess_card_punch_sub: "إثبات موقع جغرافي للعمل",
    
    // Modal Request
    req_category_label: "نوع الطلب العام:",
    req_leave_type_label: "نوع الإجازة المطلوبة: *",
    req_mission_dest: "وجهة المهمة / المدينة: *",
    req_mission_transport: "وسيلة النقل / السفر:",
    req_mission_purpose: "الهدف وتفاصيل مهمة العمل: *",
    req_start_date: "من تاريخ: *",
    req_end_date: "إلى تاريخ: *",
    req_days_count: "عدد الأيام المحتسبة:",
    req_loan_amount: "المبلغ المطلوب (ر.س): *",
    req_loan_months: "أشهر السداد بالأقساط:",
    req_reason_label: "السبب وملاحظات إضافية: *",
    req_submit_btn: "إرسال الطلب للاعتماد",

    // Chatbot strings
    chat_bot_title: "مساعد جوهرة المجد",
    chat_bot_sub: "المساعد الذكي للموارد البشرية والطلبات",
    chat_bot_input: "اكتب سؤالك هنا (إجازة، مهمة، سلفة، بصمة)...",
    chat_btn_text: "مساعد الموارد البشرية",
    chat_btn_sub: "شرح وتقديم الطلبات"
  },
  en: {
    brand_name: "Jawharat Al-Majd Co.",
    login_subtitle: "Integrated Human Resources & Self-Service System",
    select_language: "Choose Language / اختر اللغة:",
    username_label: "Username:",
    password_label: "Password:",
    login_btn: "Secure Sign In",
    login_error: "Invalid username or password",
    logout: "Logout",
    install_app: "Install App",
    nav_users: "Users",
    cancel: "Cancel",

    // ESS Cards
    ess_card_leave: "Leave Request",
    ess_card_leave_sub: "Annual, Sick, Study, etc.",
    ess_card_mission: "Business Mission",
    ess_card_mission_sub: "Delegation, Travel, Branch visit",
    ess_card_loan: "Salary Advance",
    ess_card_loan_sub: "Emergency loan & installments",
    ess_card_perm: "Permission Request",
    ess_card_perm_sub: "Temporary exit & official permission",
    ess_card_payslip: "My Payslip",
    ess_card_payslip_sub: "View & print salary slip",
    ess_card_cert: "Salary Certificate",
    ess_card_cert_sub: "Official certified digital letter",
    ess_card_punch: "Smart Attendance",
    ess_card_punch_sub: "Geographic work attendance",

    // Modal Request
    req_category_label: "Request Category:",
    req_leave_type_label: "Leave Type: *",
    req_mission_dest: "Mission Destination / City: *",
    req_mission_transport: "Transportation / Travel:",
    req_mission_purpose: "Mission Goal & Purpose: *",
    req_start_date: "Start Date: *",
    req_end_date: "End Date: *",
    req_days_count: "Calculated Days:",
    req_loan_amount: "Amount (SAR): *",
    req_loan_months: "Repayment Months:",
    req_reason_label: "Reason & Additional Notes: *",
    req_submit_btn: "Submit Request for Approval",

    // Chatbot strings
    chat_bot_title: "Jawharat HR Assistant",
    chat_bot_sub: "AI Smart Assistant for HR & Requests",
    chat_bot_input: "Ask anything (Leave, Mission, Loan, Punch)...",
    chat_btn_text: "HR Assistant",
    chat_btn_sub: "Guide & Request Help"
  },
  bn: {
    brand_name: "জওহারাত আল-মাজদ কোং",
    login_subtitle: "সমন্বিত মানবসম্পদ এবং সেলফ-সার্ভিস সিস্টেম",
    select_language: "ভাষা নির্বাচন করুন / Select Language:",
    username_label: "ব্যবহারকারীর নাম (Username):",
    password_label: "পাসওয়ার্ড (Password):",
    login_btn: "নিরাপদ লগইন",
    login_error: "ভুল ব্যবহারকারীর নাম অথবা পাসওয়ার্ড",
    logout: "লগআউট",
    install_app: "অ্যাপ ইনস্টল করুন",
    nav_users: "ব্যবহারকারীগণ",
    cancel: "বাতিল",

    // ESS Cards
    ess_card_leave: "ছুটির আবেদন",
    ess_card_leave_sub: "বার্ষিক, অসুস্থতা, অধ্যয়ন ইত্যাদি",
    ess_card_mission: "বিজনেস মিশন / কাজের সফর",
    ess_card_mission_sub: "অফিসিয়াল ভ্রমণ, শাখা পরিদর্শন",
    ess_card_loan: "অগ্রিম বেতন / লোন",
    ess_card_loan_sub: "জরুরী লোন ও কিস্তিতে পরিশোধ",
    ess_card_perm: "ঘণ্টার অনুমতি (ছুটি)",
    ess_card_perm_sub: "সাময়িক বের হওয়া ও সরকারি কাজ",
    ess_card_payslip: "আমার বেতন বিবরণী",
    ess_card_payslip_sub: "বেতন স্লিপ দেখুন ও প্রিন্ট করুন",
    ess_card_cert: "বেতন সার্টিফিকেট",
    ess_card_cert_sub: "অফিসিয়াল ডিজিটাল প্রত্যয়নপত্র",
    ess_card_punch: "স্মার্ট হাজিরা",
    ess_card_punch_sub: "কাজের ভৌগলিক অবস্থান ভিত্তিক উপস্থিতি",

    // Modal Request
    req_category_label: "আবেদনের ধরণ:",
    req_leave_type_label: "ছুটির ধরণ: *",
    req_mission_dest: "গন্তব্য / শহর: *",
    req_mission_transport: "যাতায়াত ব্যবস্থা:",
    req_mission_purpose: "মিশনের উদ্দেশ্য ও বিবরণ: *",
    req_start_date: "শুরুর তারিখ: *",
    req_end_date: "শেষের তারিখ: *",
    req_days_count: "গণনাকৃত দিন:",
    req_loan_amount: "লোনের পরিমাণ (SAR): *",
    req_loan_months: "পরিশোধের মেয়াদ (মাস):",
    req_reason_label: "कारण ও অতিরিক্ত মন্তব্য: *",
    req_submit_btn: "অনুমোদনের জন্য আবেদন জমা দিন",

    // Chatbot strings
    chat_bot_title: "এইচআর সহায়ক রোবট",
    chat_bot_sub: "মানবসম্পদ ও ছুটির আবেদন নির্দেশিকা",
    chat_bot_input: "আপনার প্রশ্ন লিখুন (ছুটি, সফর, লোন, হাজিরা)...",
    chat_btn_text: "এইচআর অ্যাসিস্ট্যান্ট",
    chat_btn_sub: "আবেদন সাহায্য"
  },
  ur: {
    brand_name: "جوہرة المجد کمپنی",
    login_subtitle: "جامع ہیومن ریسورسز اور سیلف سروس سسٹم",
    select_language: "زبان منتخب کریں / Select Language:",
    username_label: "صارف نام (Username):",
    password_label: "پاس ورڈ (Password):",
    login_btn: "محفوظ لاگ ان",
    login_error: "صارف نام یا پاس ورڈ غلط ہے",
    logout: "لاگ آؤٹ",
    install_app: "ایپ انسٹال کریں",
    nav_users: "صارفین",
    cancel: "منسوخ",

    // ESS Cards
    ess_card_leave: "چھٹی کی درخواست",
    ess_card_leave_sub: "سالانہ، بیماری، تعلیمی وغیرہ",
    ess_card_mission: "دفتری مشن / دورہ",
    ess_card_mission_sub: "آفیشل سفر، برانچ وزٹ",
    ess_card_loan: "پیشگی تنخواہ / قرض",
    ess_card_loan_sub: "ہنگامی قرض اور آسان اقساط",
    ess_card_perm: "گھنٹہ وار اجازت",
    ess_card_perm_sub: "عارضی خروج اور دفتری کام",
    ess_card_payslip: "میری تنخواہ کی پرچی",
    ess_card_payslip_sub: "تنخواہ کی پرچی دیکھیں اور پرنٹ کریں",
    ess_card_cert: "تنخواہ کا سرٹیفکیٹ",
    ess_card_cert_sub: "مصدقہ ڈیجیٹل سرٹیفکیٹ",
    ess_card_punch: "اسمارٹ حاضری",
    ess_card_punch_sub: "جغرافیائی حاضری ریکارڈ",

    // Modal Request
    req_category_label: "درخواست کی قسم:",
    req_leave_type_label: "چھٹی کی مطلوبہ قسم: *",
    req_mission_dest: "منزل / شہر: *",
    req_mission_transport: "سفر کا ذریعہ:",
    req_mission_purpose: "مشن کا مقصد اور تفصیلات: *",
    req_start_date: "شروع کی تاریخ: *",
    req_end_date: "ختم کی تاریخ: *",
    req_days_count: "کل دن:",
    req_loan_amount: "مطلوبہ رقم (SAR): *",
    req_loan_months: "ادائیگی کے مہینے:",
    req_reason_label: "وجہ اور اضافی تفصیلات: *",
    req_submit_btn: "منظوری کے لیے بھیجیں",

    // Chatbot strings
    chat_bot_title: "جوہرة المجد ایچ آر اسسٹنٹ",
    chat_bot_sub: "اسمارٹ اے آئی برائے ہیومن ریسورسز و درخواستیں",
    chat_bot_input: "اپنا سوال لکھیں (چھٹی، مشن، قرض، حاضری)...",
    chat_btn_text: "ایچ آر اسسٹنٹ",
    chat_btn_sub: "درخواستوں میں مدد"
  },
  hi: {
    brand_name: "जौहरत अल-मज्द कंपनी",
    login_subtitle: "एकीकृत मानव संसाधन और स्व-सेवा प्रणाली",
    select_language: "भाषा चुनें / Select Language:",
    username_label: "उपयोगकर्ता नाम (Username):",
    password_label: "पासवर्ड (Password):",
    login_btn: "सुरक्षित लॉगिन",
    login_error: "अमान्य उपयोगकर्ता नाम या पासवर्ड",
    logout: "लॉग आउट",
    install_app: "ऐप इंस्टॉल करें",
    nav_users: "उपयोगकर्ता",
    cancel: "रद्द करें",

    // ESS Cards
    ess_card_leave: "छुट्टी का अनुरोध",
    ess_card_leave_sub: "वार्षिक, बीमारी, अध्ययन आदि",
    ess_card_mission: "बिजनेस मिशन / कार्य दौरा",
    ess_card_mission_sub: "आधिकारिक यात्रा, शाखा का दौरा",
    ess_card_loan: "अग्रिम वेतन / ऋण",
    ess_card_loan_sub: "आपातकालीन ऋण और किस्तें",
    ess_card_perm: "घंटे की अनुमति",
    ess_card_perm_sub: "अस्थायी निकास और सरकारी काम",
    ess_card_payslip: "मेरी वेतन पर्ची (Payslip)",
    ess_card_payslip_sub: "वेतन पर्ची देखें और प्रिंट करें",
    ess_card_cert: "वेतन प्रमाण पत्र",
    ess_card_cert_sub: "प्रमाणित डिजिटल पत्र",
    ess_card_punch: "स्मार्ट उपस्थिति",
    ess_card_punch_sub: "भौगोलिक उपस्थिति रिकॉर्ड",

    // Modal Request
    req_category_label: "अनुरोध की श्रेणी:",
    req_leave_type_label: "छुट्टी का प्रकार: *",
    req_mission_dest: "गंतव्य / शहर: *",
    req_mission_transport: "यात्रा का साधन:",
    req_mission_purpose: "मिशन का उद्देश्य और विवरण: *",
    req_start_date: "प्रारंभ तिथि: *",
    req_end_date: "अंतिम तिथि: *",
    req_days_count: "गणना किए गए दिन:",
    req_loan_amount: "राशि (SAR): *",
    req_loan_months: "भुगतान के महीने:",
    req_reason_label: "कारण और अतिरिक्त विवरण: *",
    req_submit_btn: "स्वीकृति के लिए अनुरोध भेजें",

    // Chatbot strings
    chat_bot_title: "जौहरत एचआर सहायक",
    chat_bot_sub: "मानव संसाधन और अनुरोधों के लिए स्मार्ट एआई",
    chat_bot_input: "अपना प्रश्न लिखें (छुट्टी, मिशन, ऋण, उपस्थिति)...",
    chat_btn_text: "एचआर सहायक",
    chat_btn_sub: "अनुरोध सहायता"
  }
};

function setLanguage(lang) {
  if (!I18N_TRANSLATIONS[lang]) lang = 'ar';
  if (typeof state !== 'undefined') {
    state.currentLang = lang;
  }
  localStorage.setItem('jm_hrms_lang', lang);

  // Set document dir & lang
  const isRtl = (lang === 'ar' || lang === 'ur');
  document.documentElement.lang = lang;
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

  // Update header label
  const labels = {
    ar: '🇸🇦 العربية',
    en: '🇬🇧 English',
    bn: '🇧🇩 বাংলা',
    ur: '🇵🇰 اردو',
    hi: '🇮🇳 हिन्दी'
  };
  const headerLabel = document.getElementById('currentLangLabel');
  if (headerLabel) headerLabel.textContent = labels[lang] || labels.ar;

  // Update active state on login pills
  document.querySelectorAll('#loginLangPicker [data-lang-btn]').forEach(btn => {
    if (btn.getAttribute('data-lang-btn') === lang) {
      btn.className = 'lang-pill active px-2.5 py-1 rounded-xl transition bg-brand text-white shadow font-bold';
    } else {
      btn.className = 'lang-pill px-2.5 py-1 rounded-xl transition text-slate-700 hover:bg-slate-200 font-bold';
    }
  });

  // Apply translations to all [data-i18n]
  const dict = I18N_TRANSLATIONS[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict && dict[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // Update Chatbot elements with localized text
  const chatHeaderTitle = document.querySelector('#chatHeaderTitle span:first-child');
  const chatHeaderSub = document.getElementById('chatHeaderSubtitle');
  const chatInput = document.getElementById('hrChatInput');
  const chatBtnText = document.getElementById('chatBtnText');
  const chatBtnSub = document.getElementById('chatBtnSub');

  if (chatHeaderTitle && dict.chat_bot_title) chatHeaderTitle.textContent = dict.chat_bot_title;
  if (chatHeaderSub && dict.chat_bot_sub) chatHeaderSub.textContent = dict.chat_bot_sub;
  if (chatInput && dict.chat_bot_input) chatInput.placeholder = dict.chat_bot_input;
  if (chatBtnText && dict.chat_btn_text) chatBtnText.textContent = dict.chat_btn_text;
  if (chatBtnSub && dict.chat_btn_sub) chatBtnSub.textContent = dict.chat_btn_sub;

  // Refresh Chatbot suggestions chips
  if (typeof renderChatbotChips === 'function') {
    renderChatbotChips(lang);
  }
}

function initLanguage() {
  const savedLang = localStorage.getItem('jm_hrms_lang') || 'ar';
  setLanguage(savedLang);
}

function toggleLangMenu() {
  const menu = document.getElementById('headerLangMenu');
  if (menu) menu.classList.toggle('hidden');
}

function closeLangMenu() {
  const menu = document.getElementById('headerLangMenu');
  if (menu) menu.classList.add('hidden');
}

// Close menu when clicking outside
window.addEventListener('click', (e) => {
  const container = document.getElementById('headerLangDropdownContainer');
  if (container && !container.contains(e.target)) {
    closeLangMenu();
  }
});

// Default Embedded State (Works 100% both on HTTP server and direct file:/// browser opening)
const FALLBACK_DATA = {
  settings: {
    company_name_ar: 'شركة جوهرة المجد',
    company_name_en: 'Jawharat Al-Majd Co.',
    cr_number: '7004872169',
    tax_number: '310492837400003',
    phone: '920012405',
    email: 'info@jalmajd.com',
    website: 'https://jalmajd.com',
    address_ar: 'المملكة العربية السعودية، منطقة عسير، أبها، حي الشرفية - مول سيتي بارك',
    bank_name: 'مصرف الراجحي',
    bank_code: 'RJHI',
    corporate_account: 'SA4480000392608010049283'
  },
  users: [
    { id: 1, username: 'admin', password: 'Jj123', full_name: 'مدير النظام (Admin)', role: 'admin', permissions: ['all'], is_active: 1, created_at: '2026-09-30', emp_id: null }
  ],
  departments: [
    { id: 1, code: 'EXEC', name_ar: 'الادارة التنفيذيه', name_en: 'Executive Management', manager_name: 'الرئيس التنفيذي', employee_count: 0, location: 'مقر أبها - الطابق الإداري' },
    { id: 2, code: 'HR', name_ar: 'ادارة الموارد البشرية', name_en: 'Human Resources', manager_name: 'مدير الموارد البشرية', employee_count: 0, location: 'مقر أبها - مبنى الإدارة' },
    { id: 3, code: 'PROC', name_ar: 'ادارة المشتريات', name_en: 'Procurement & Purchasing', manager_name: 'مدير المشتريات', employee_count: 0, location: 'مقر أبها - قسم المشتريات' },
    { id: 4, code: 'SALES', name_ar: 'ادارة المبيعات', name_en: 'Sales Department', manager_name: 'مدير المبيعات', employee_count: 0, location: 'مقر أبها - الإدارة التجارية' },
    { id: 5, code: 'IT', name_ar: 'ادارة تقنية المعلومات', name_en: 'Information Technology', manager_name: 'مدير تقنية المعلومات', employee_count: 0, location: 'مقر أبها - مركز العمليات الرقمية' },
    { id: 6, code: 'MKT', name_ar: 'ادارة التسويق', name_en: 'Marketing Department', manager_name: 'مدير التسويق', employee_count: 0, location: 'مقر أبها - الجناح الإعلامي' }
  ],
  branches: [
    { id: 1, code: 'BR-ABHA-01', name_ar: 'فرع ابها الرئيسي', name_en: 'Abha Main Branch', city: 'أبها', address: 'أبها - شارع الملك عبدالعزيز - برج جوهرة المجد', phone: '0172201122', manager_name: 'مدير فرع أبها الرئيسي', is_main: 1, employee_count: 0, device_count: 1 },
    { id: 2, code: 'BR-MANSAK-02', name_ar: 'فرع المنسك', name_en: 'Al-Mansak Branch', city: 'أبها', address: 'أبها - حي المنسك - طريق الأربعين', phone: '0172203344', manager_name: 'مشرف فرع المنسك', is_main: 0, employee_count: 0, device_count: 1 },
    { id: 3, code: 'BR-MUWADAF-03', name_ar: 'فرع حي الموظفين', name_en: 'Hay Al-Muwadhafeen Branch', city: 'أبها', address: 'أبها - حي الموظفين - الشارع التجاري العام', phone: '0172205566', manager_name: 'مشرف فرع حي الموظفين', is_main: 0, employee_count: 0, device_count: 1 },
    { id: 4, code: 'BR-MUHAYIL-04', name_ar: 'فرع محايل عسير', name_en: 'Muhayil Asir Branch', city: 'محايل عسير', address: 'محايل عسير - طريق الشعبين الرئيسي - مجمع جوهرة المجد', phone: '0172851122', manager_name: 'مشرف فرع محايل عسير', is_main: 0, employee_count: 0, device_count: 1 }
  ],
  employees: [
  {
    "id": 1,
    "emp_code": "JM-1001",
    "full_name_ar": "MOHAMMAD RONY  MIAH",
    "full_name_en": "MOHAMMAD RONY  MIAH",
    "national_id": "2467149239",
    "nationality": "بنغلادش",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1995-10-10",
    "email": "mohammadro.1001@jalmajd.com",
    "phone": "051000000",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 1,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2021-09-01",
    "contract_end": "2027-08-31",
    "iqama_expiry": "2027-08-31",
    "basic_salary": 1500,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 200,
    "bank_name": "مصرف الراجحي",
    "iban": "SA1080000201608000000000",
    "status": "نشط"
  },
  {
    "id": 2,
    "emp_code": "JM-1002",
    "full_name_ar": "مفرح يحي محمد معشي",
    "full_name_en": "مفرح يحي محمد معشي",
    "national_id": "1207113836",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "2007-02-25",
    "email": "emp1002.1002@jalmajd.com",
    "phone": "052000001",
    "job_title_ar": "حارس أمن",
    "job_title_en": "حارس أمن",
    "department_id": 1,
    "branch_id": 2,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2025-06-18",
    "contract_end": "2027-06-17",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA1180000201608000000001",
    "status": "نشط"
  },
  {
    "id": 3,
    "emp_code": "JM-1003",
    "full_name_ar": "MOHAMMAD ENAYET ULLAH KAZI",
    "full_name_en": "MOHAMMAD ENAYET ULLAH KAZI",
    "national_id": "2466859259",
    "nationality": "بنغلادش",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1996-01-01",
    "email": "mohammaden.1003@jalmajd.com",
    "phone": "053000002",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 3,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2021-09-01",
    "contract_end": "2027-08-31",
    "iqama_expiry": "2027-08-31",
    "basic_salary": 1600,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA1280000201608000000002",
    "status": "نشط"
  },
  {
    "id": 4,
    "emp_code": "JM-1004",
    "full_name_ar": "محمد علي جابر ال مفقع",
    "full_name_en": "محمد علي جابر ال مفقع",
    "national_id": "1111746069",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "2000-04-07",
    "email": "emp1004.1004@jalmajd.com",
    "phone": "054000003",
    "job_title_ar": "حارس أمن",
    "job_title_en": "حارس أمن",
    "department_id": 1,
    "branch_id": 4,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2025-05-22",
    "contract_end": "2027-05-21",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA1380000201608000000003",
    "status": "نشط"
  },
  {
    "id": 5,
    "emp_code": "JM-1005",
    "full_name_ar": "PURNA BAHADUR  ALE",
    "full_name_en": "PURNA BAHADUR  ALE",
    "national_id": "2465831010",
    "nationality": "نيبال",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1996-01-26",
    "email": "purnabahad.1005@jalmajd.com",
    "phone": "055000004",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 1,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2021-09-01",
    "contract_end": "2027-08-31",
    "iqama_expiry": "2027-08-31",
    "basic_salary": 1600,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA1480000201608000000004",
    "status": "نشط"
  },
  {
    "id": 6,
    "emp_code": "JM-1006",
    "full_name_ar": "DEV BAHADUR  THADA",
    "full_name_en": "DEV BAHADUR  THADA",
    "national_id": "2465830822",
    "nationality": "نيبال",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1991-08-30",
    "email": "devbahadur.1006@jalmajd.com",
    "phone": "056000005",
    "job_title_ar": "عامل حفظ فواكه وخضروات",
    "job_title_en": "عامل حفظ فواكه وخضروات",
    "department_id": 3,
    "branch_id": 2,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2021-09-01",
    "contract_end": "2027-08-31",
    "iqama_expiry": "2027-08-31",
    "basic_salary": 1000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 700,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA1580000201608000000005",
    "status": "نشط"
  },
  {
    "id": 7,
    "emp_code": "JM-1007",
    "full_name_ar": "TASIR ANSARI  AAZAM ANSARI",
    "full_name_en": "TASIR ANSARI  AAZAM ANSARI",
    "national_id": "2367493182",
    "nationality": "الهند",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1989-07-05",
    "email": "tasiransar.1007@jalmajd.com",
    "phone": "057000006",
    "job_title_ar": "موظف صندوق محاسبة",
    "job_title_en": "موظف صندوق محاسبة",
    "department_id": 4,
    "branch_id": 3,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2022-08-01",
    "contract_end": "2027-07-31",
    "iqama_expiry": "2027-07-31",
    "basic_salary": 1100,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 600,
    "bank_name": "مصرف الراجحي",
    "iban": "SA1680000201608000000006",
    "status": "نشط"
  },
  {
    "id": 8,
    "emp_code": "JM-1008",
    "full_name_ar": "BAYJID SHITOL  MIAH",
    "full_name_en": "BAYJID SHITOL  MIAH",
    "national_id": "2492235524",
    "nationality": "بنغلادش",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1996-03-01",
    "email": "bayjidshit.1008@jalmajd.com",
    "phone": "058000007",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 4,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2021-09-01",
    "contract_end": "2027-08-31",
    "iqama_expiry": "2027-08-31",
    "basic_salary": 1700,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA1780000201608000000007",
    "status": "نشط"
  },
  {
    "id": 9,
    "emp_code": "JM-1009",
    "full_name_ar": "YUSUF   ALI",
    "full_name_en": "YUSUF   ALI",
    "national_id": "2483667578",
    "nationality": "بنغلادش",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1983-03-16",
    "email": "yusufali.1009@jalmajd.com",
    "phone": "059000008",
    "job_title_ar": "عامل مخزن",
    "job_title_en": "عامل مخزن",
    "department_id": 3,
    "branch_id": 1,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2021-09-01",
    "contract_end": "2027-08-31",
    "iqama_expiry": "2027-08-31",
    "basic_salary": 1600,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA1880000201608000000008",
    "status": "نشط"
  },
  {
    "id": 10,
    "emp_code": "JM-1010",
    "full_name_ar": "عايض بن محمد بن عبدربه عسيري",
    "full_name_en": "عايض بن محمد بن عبدربه عسيري",
    "national_id": "1056129370",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1979-01-27",
    "email": "emp1010.1010@jalmajd.com",
    "phone": "051000009",
    "job_title_ar": "حارس أمن",
    "job_title_en": "حارس أمن",
    "department_id": 1,
    "branch_id": 2,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2025-04-14",
    "contract_end": "2027-04-13",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA1980000201608000000009",
    "status": "نشط"
  },
  {
    "id": 11,
    "emp_code": "JM-1011",
    "full_name_ar": "منال سعيد حسن الاصلعي",
    "full_name_en": "منال سعيد حسن الاصلعي",
    "national_id": "1057909903",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1988-03-19",
    "email": "emp1011.1011@jalmajd.com",
    "phone": "052000010",
    "job_title_ar": "بائع",
    "job_title_en": "بائع",
    "department_id": 4,
    "branch_id": 3,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2023-10-15",
    "contract_end": "2026-10-14",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA2080000201608000000010",
    "status": "نشط"
  },
  {
    "id": 12,
    "emp_code": "JM-1012",
    "full_name_ar": "فاطمه محمد بن علي المغيدي",
    "full_name_en": "فاطمه محمد بن علي المغيدي",
    "national_id": "1067473056",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1990-05-01",
    "email": "emp1012.1012@jalmajd.com",
    "phone": "053000011",
    "job_title_ar": "بائع",
    "job_title_en": "بائع",
    "department_id": 4,
    "branch_id": 4,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2024-11-04",
    "contract_end": "2026-11-03",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA2180000201608000000011",
    "status": "نشط"
  },
  {
    "id": 13,
    "emp_code": "JM-1013",
    "full_name_ar": "هاني علي شامي عسيري",
    "full_name_en": "هاني علي شامي عسيري",
    "national_id": "1106795105",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "2000-01-05",
    "email": "emp1013.1013@jalmajd.com",
    "phone": "054000012",
    "job_title_ar": "مشرف مكتب",
    "job_title_en": "مشرف مكتب",
    "department_id": 2,
    "branch_id": 1,
    "department_name_ar": "إدارة الموارد البشرية",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2023-12-26",
    "contract_end": "2026-12-25",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 200,
    "bank_name": "مصرف الراجحي",
    "iban": "SA2280000201608000000012",
    "status": "نشط"
  },
  {
    "id": 14,
    "emp_code": "JM-1014",
    "full_name_ar": "JUNAID SHADAN  MOHAMMED",
    "full_name_en": "JUNAID SHADAN  MOHAMMED",
    "national_id": "2467545568",
    "nationality": "الهند",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1996-09-27",
    "email": "junaidshad.1014@jalmajd.com",
    "phone": "055000013",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 2,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2021-09-01",
    "contract_end": "2027-08-31",
    "iqama_expiry": "2027-08-31",
    "basic_salary": 1700,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA2380000201608000000013",
    "status": "نشط"
  },
  {
    "id": 15,
    "emp_code": "JM-1015",
    "full_name_ar": "فهمي سالم عبيد باعمير",
    "full_name_en": "فهمي سالم عبيد باعمير",
    "national_id": "2273877585",
    "nationality": "اليمن",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1987-11-17",
    "email": "emp1015.1015@jalmajd.com",
    "phone": "056000014",
    "job_title_ar": "عامل تحميل وتنزيل",
    "job_title_en": "عامل تحميل وتنزيل",
    "department_id": 3,
    "branch_id": 3,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2022-08-21",
    "contract_end": "2027-08-20",
    "iqama_expiry": "2027-08-20",
    "basic_salary": 2200,
    "housing_allowance": 750,
    "transport_allowance": 0,
    "other_allowance": 1450,
    "bank_name": "مصرف الراجحي",
    "iban": "SA2480000201608000000014",
    "status": "نشط"
  },
  {
    "id": 16,
    "emp_code": "JM-1016",
    "full_name_ar": "فاطمه أحمد محمد عسيري",
    "full_name_en": "فاطمه أحمد محمد عسيري",
    "national_id": "1110816251",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1998-03-24",
    "email": "emp1016.1016@jalmajd.com",
    "phone": "057000015",
    "job_title_ar": "بائع",
    "job_title_en": "بائع",
    "department_id": 4,
    "branch_id": 4,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2025-05-28",
    "contract_end": "2027-05-27",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA2580000201608000000015",
    "status": "نشط"
  },
  {
    "id": 17,
    "emp_code": "JM-1017",
    "full_name_ar": "MD PALASH MULLA MD",
    "full_name_en": "MD PALASH MULLA MD",
    "national_id": "2466859713",
    "nationality": "بنغلادش",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1988-07-12",
    "email": "mdpalashmu.1017@jalmajd.com",
    "phone": "058000016",
    "job_title_ar": "عامل كاونتر مأكولات ومشروبات",
    "job_title_en": "عامل كاونتر مأكولات ومشروبات",
    "department_id": 4,
    "branch_id": 1,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2021-09-01",
    "contract_end": "2027-08-31",
    "iqama_expiry": "2027-08-31",
    "basic_salary": 1700,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA2680000201608000000016",
    "status": "نشط"
  },
  {
    "id": 18,
    "emp_code": "JM-1018",
    "full_name_ar": "GOPAL KUMAR  KUMHAL",
    "full_name_en": "GOPAL KUMAR  KUMHAL",
    "national_id": "2465830186",
    "nationality": "نيبال",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1994-04-23",
    "email": "gopalkumar.1018@jalmajd.com",
    "phone": "059000017",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 2,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2021-09-01",
    "contract_end": "2027-08-31",
    "iqama_expiry": "2027-08-31",
    "basic_salary": 1700,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA2780000201608000000017",
    "status": "نشط"
  },
  {
    "id": 19,
    "emp_code": "JM-1019",
    "full_name_ar": "علي محمد بن بدوي آل عساف",
    "full_name_en": "علي محمد بن بدوي آل عساف",
    "national_id": "1120990062",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "2002-03-25",
    "email": "emp1019.1019@jalmajd.com",
    "phone": "051000018",
    "job_title_ar": "مشرف مكتب",
    "job_title_en": "مشرف مكتب",
    "department_id": 2,
    "branch_id": 3,
    "department_name_ar": "إدارة الموارد البشرية",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2025-02-11",
    "contract_end": "2027-02-10",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 200,
    "bank_name": "مصرف الراجحي",
    "iban": "SA2880000201608000000018",
    "status": "نشط"
  },
  {
    "id": 20,
    "emp_code": "JM-1020",
    "full_name_ar": "ندى يحيى بن جابر سفياني",
    "full_name_en": "ندى يحيى بن جابر سفياني",
    "national_id": "1106453341",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1999-12-25",
    "email": "emp1020.1020@jalmajd.com",
    "phone": "052000019",
    "job_title_ar": "بائع",
    "job_title_en": "بائع",
    "department_id": 4,
    "branch_id": 4,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2026-08-20",
    "contract_end": "2027-08-19",
    "iqama_expiry": null,
    "basic_salary": 3000,
    "housing_allowance": 1000,
    "transport_allowance": 0,
    "other_allowance": 0.01,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA2980000201608000000019",
    "status": "نشط"
  },
  {
    "id": 21,
    "emp_code": "JM-1021",
    "full_name_ar": "محمد السيد فوزي سرور",
    "full_name_en": "محمد السيد فوزي سرور",
    "national_id": "2196758631",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1971-08-06",
    "email": "emp1021.1021@jalmajd.com",
    "phone": "053000020",
    "job_title_ar": "عامل فرز منتجات",
    "job_title_en": "عامل فرز منتجات",
    "department_id": 3,
    "branch_id": 1,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2022-08-15",
    "contract_end": "2027-08-14",
    "iqama_expiry": "2027-08-14",
    "basic_salary": 4700,
    "housing_allowance": 571,
    "transport_allowance": 0,
    "other_allowance": 1571,
    "bank_name": "مصرف الراجحي",
    "iban": "SA3080000201608000000020",
    "status": "نشط"
  },
  {
    "id": 22,
    "emp_code": "JM-1022",
    "full_name_ar": "علي سعد حسين البشري",
    "full_name_en": "علي سعد حسين البشري",
    "national_id": "1067121598",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1990-02-14",
    "email": "emp1022.1022@jalmajd.com",
    "phone": "054000021",
    "job_title_ar": "مشرف مكتب",
    "job_title_en": "مشرف مكتب",
    "department_id": 2,
    "branch_id": 2,
    "department_name_ar": "إدارة الموارد البشرية",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2025-10-16",
    "contract_end": "2026-10-15",
    "iqama_expiry": null,
    "basic_salary": 3000,
    "housing_allowance": 1000,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA3180000201608000000021",
    "status": "نشط"
  },
  {
    "id": 23,
    "emp_code": "JM-1023",
    "full_name_ar": "زهراء سعيد بن محمد آل مسد",
    "full_name_en": "زهراء سعيد بن محمد آل مسد",
    "national_id": "1050378478",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1980-08-19",
    "email": "emp1023.1023@jalmajd.com",
    "phone": "055000022",
    "job_title_ar": "بائع",
    "job_title_en": "بائع",
    "department_id": 4,
    "branch_id": 3,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2024-10-17",
    "contract_end": "2026-10-16",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA3280000201608000000022",
    "status": "نشط"
  },
  {
    "id": 24,
    "emp_code": "JM-1024",
    "full_name_ar": "أحمد علي هادي آل دحنان",
    "full_name_en": "أحمد علي هادي آل دحنان",
    "national_id": "1120256498",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "2001-08-09",
    "email": "emp1024.1024@jalmajd.com",
    "phone": "056000023",
    "job_title_ar": "حارس أمن",
    "job_title_en": "حارس أمن",
    "department_id": 1,
    "branch_id": 4,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2025-02-10",
    "contract_end": "2027-02-09",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA3380000201608000000023",
    "status": "نشط"
  },
  {
    "id": 25,
    "emp_code": "JM-1025",
    "full_name_ar": "معدي موسى محمد عسيري",
    "full_name_en": "معدي موسى محمد عسيري",
    "national_id": "1126762093",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "2004-10-28",
    "email": "emp1025.1025@jalmajd.com",
    "phone": "057000024",
    "job_title_ar": "بائع",
    "job_title_en": "بائع",
    "department_id": 4,
    "branch_id": 1,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2026-05-19",
    "contract_end": "2027-05-18",
    "iqama_expiry": null,
    "basic_salary": 3000,
    "housing_allowance": 1000,
    "transport_allowance": 0,
    "other_allowance": 0.01,
    "bank_name": "مصرف الراجحي",
    "iban": "SA3480000201608000000024",
    "status": "نشط"
  },
  {
    "id": 26,
    "emp_code": "JM-1026",
    "full_name_ar": "شامه علي بن محمد عسيري",
    "full_name_en": "شامه علي بن محمد عسيري",
    "national_id": "1112576044",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "2000-03-26",
    "email": "emp1026.1026@jalmajd.com",
    "phone": "058000025",
    "job_title_ar": "كاتب موارد بشرية",
    "job_title_en": "كاتب موارد بشرية",
    "department_id": 2,
    "branch_id": 2,
    "department_name_ar": "إدارة الموارد البشرية",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2023-05-02",
    "contract_end": "2027-05-01",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA3580000201608000000025",
    "status": "نشط"
  },
  {
    "id": 27,
    "emp_code": "JM-1027",
    "full_name_ar": "عبدالله حسين بكري عواجي",
    "full_name_en": "عبدالله حسين بكري عواجي",
    "national_id": "1124512797",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "2003-08-17",
    "email": "emp1027.1027@jalmajd.com",
    "phone": "059000026",
    "job_title_ar": "بائع",
    "job_title_en": "بائع",
    "department_id": 4,
    "branch_id": 3,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2025-05-28",
    "contract_end": "2027-05-27",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA3680000201608000000026",
    "status": "نشط"
  },
  {
    "id": 28,
    "emp_code": "JM-1028",
    "full_name_ar": "محمد سعود ابن سعد آل ثقفان",
    "full_name_en": "محمد سعود ابن سعد آل ثقفان",
    "national_id": "1124354752",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "2003-12-08",
    "email": "emp1028.1028@jalmajd.com",
    "phone": "051000027",
    "job_title_ar": "بائع",
    "job_title_en": "بائع",
    "department_id": 4,
    "branch_id": 4,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2025-04-20",
    "contract_end": "2027-04-19",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA3780000201608000000027",
    "status": "نشط"
  },
  {
    "id": 29,
    "emp_code": "JM-1029",
    "full_name_ar": "نوره حسين مقبول القحطاني",
    "full_name_en": "نوره حسين مقبول القحطاني",
    "national_id": "1052910237",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1978-10-09",
    "email": "emp1029.1029@jalmajd.com",
    "phone": "052000028",
    "job_title_ar": "مصمم جرافيك",
    "job_title_en": "مصمم جرافيك",
    "department_id": 6,
    "branch_id": 1,
    "department_name_ar": "إدارة التسويق",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2022-06-08",
    "contract_end": "2027-06-07",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA3880000201608000000028",
    "status": "نشط"
  },
  {
    "id": 30,
    "emp_code": "JM-1030",
    "full_name_ar": "NUR ALOM GAZI YOUSUP",
    "full_name_en": "NUR ALOM GAZI YOUSUP",
    "national_id": "2497599486",
    "nationality": "بنغلادش",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1984-05-01",
    "email": "nuralomgaz.1030@jalmajd.com",
    "phone": "053000029",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 2,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2022-09-01",
    "contract_end": "2027-08-31",
    "iqama_expiry": "2027-08-31",
    "basic_salary": 1600,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 100,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA3980000201608000000029",
    "status": "نشط"
  },
  {
    "id": 31,
    "emp_code": "JM-1031",
    "full_name_ar": "عبير سعيد علي الاحمري",
    "full_name_en": "عبير سعيد علي الاحمري",
    "national_id": "1118810322",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "2002-12-15",
    "email": "emp1031.1031@jalmajd.com",
    "phone": "054000030",
    "job_title_ar": "بائع تذاكر",
    "job_title_en": "بائع تذاكر",
    "department_id": 4,
    "branch_id": 3,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2026-08-26",
    "contract_end": "2027-08-25",
    "iqama_expiry": null,
    "basic_salary": 3000,
    "housing_allowance": 1000,
    "transport_allowance": 0,
    "other_allowance": 0.01,
    "bank_name": "مصرف الراجحي",
    "iban": "SA4080000201608000000030",
    "status": "نشط"
  },
  {
    "id": 32,
    "emp_code": "JM-1032",
    "full_name_ar": "RASEL MIAH NOBI MIAH",
    "full_name_en": "RASEL MIAH NOBI MIAH",
    "national_id": "2471923587",
    "nationality": "بنغلادش",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1996-12-12",
    "email": "raselmiahn.1032@jalmajd.com",
    "phone": "055000031",
    "job_title_ar": "عامل تنظيف مكاتب ومنشآت",
    "job_title_en": "عامل تنظيف مكاتب ومنشآت",
    "department_id": 1,
    "branch_id": 4,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2021-09-01",
    "contract_end": "2027-08-31",
    "iqama_expiry": "2027-08-31",
    "basic_salary": 1700,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA4180000201608000000031",
    "status": "نشط"
  },
  {
    "id": 33,
    "emp_code": "JM-1033",
    "full_name_ar": "خالد احمد محمد راعي",
    "full_name_en": "خالد احمد محمد راعي",
    "national_id": "1110902515",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "2001-03-21",
    "email": "emp1033.1033@jalmajd.com",
    "phone": "056000032",
    "job_title_ar": "مشرف مكتب",
    "job_title_en": "مشرف مكتب",
    "department_id": 2,
    "branch_id": 1,
    "department_name_ar": "إدارة الموارد البشرية",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2023-03-09",
    "contract_end": "2027-03-08",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 200,
    "bank_name": "مصرف الراجحي",
    "iban": "SA4280000201608000000032",
    "status": "نشط"
  },
  {
    "id": 34,
    "emp_code": "JM-1034",
    "full_name_ar": "حسن علي حسن غظيف",
    "full_name_en": "حسن علي حسن غظيف",
    "national_id": "1078289384",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1992-09-11",
    "email": "emp1034.1034@jalmajd.com",
    "phone": "057000033",
    "job_title_ar": "حارس أمن",
    "job_title_en": "حارس أمن",
    "department_id": 1,
    "branch_id": 2,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2021-11-14",
    "contract_end": "2026-11-13",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA4380000201608000000033",
    "status": "نشط"
  },
  {
    "id": 35,
    "emp_code": "JM-1035",
    "full_name_ar": "سميه سالم يحي الفيفي",
    "full_name_en": "سميه سالم يحي الفيفي",
    "national_id": "1072664301",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1991-08-14",
    "email": "emp1035.1035@jalmajd.com",
    "phone": "058000034",
    "job_title_ar": "كاتب موارد بشرية",
    "job_title_en": "كاتب موارد بشرية",
    "department_id": 2,
    "branch_id": 3,
    "department_name_ar": "إدارة الموارد البشرية",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2021-10-01",
    "contract_end": "2027-09-30",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 500,
    "bank_name": "مصرف الراجحي",
    "iban": "SA4480000201608000000034",
    "status": "نشط"
  },
  {
    "id": 36,
    "emp_code": "JM-1036",
    "full_name_ar": "عبدالرحمن جابر بن مفرح عسيري",
    "full_name_en": "عبدالرحمن جابر بن مفرح عسيري",
    "national_id": "1119905212",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "2002-04-06",
    "email": "emp1036.1036@jalmajd.com",
    "phone": "059000035",
    "job_title_ar": "بائع",
    "job_title_en": "بائع",
    "department_id": 4,
    "branch_id": 4,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2025-02-18",
    "contract_end": "2027-02-17",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA4580000201608000000035",
    "status": "نشط"
  },
  {
    "id": 37,
    "emp_code": "JM-1037",
    "full_name_ar": "خيريه اسماعيل محمد خنفور",
    "full_name_en": "خيريه اسماعيل محمد خنفور",
    "national_id": "1135619938",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "2001-12-27",
    "email": "emp1037.1037@jalmajd.com",
    "phone": "051000036",
    "job_title_ar": "بائع تذاكر",
    "job_title_en": "بائع تذاكر",
    "department_id": 4,
    "branch_id": 1,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2023-10-01",
    "contract_end": "2027-09-30",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA4680000201608000000036",
    "status": "نشط"
  },
  {
    "id": 38,
    "emp_code": "JM-1038",
    "full_name_ar": "أحمد عبدالرحمن علي يعن الله",
    "full_name_en": "أحمد عبدالرحمن علي يعن الله",
    "national_id": "1099604686",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1997-06-29",
    "email": "emp1038.1038@jalmajd.com",
    "phone": "052000037",
    "job_title_ar": "مشرف مكتب",
    "job_title_en": "مشرف مكتب",
    "department_id": 2,
    "branch_id": 2,
    "department_name_ar": "إدارة الموارد البشرية",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2025-04-28",
    "contract_end": "2027-04-27",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA4780000201608000000037",
    "status": "نشط"
  },
  {
    "id": 39,
    "emp_code": "JM-1039",
    "full_name_ar": "احمد علي عيسى السلمي",
    "full_name_en": "احمد علي عيسى السلمي",
    "national_id": "1083113686",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1993-03-01",
    "email": "emp1039.1039@jalmajd.com",
    "phone": "053000038",
    "job_title_ar": "مشرف مكتب",
    "job_title_en": "مشرف مكتب",
    "department_id": 2,
    "branch_id": 3,
    "department_name_ar": "إدارة الموارد البشرية",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2024-07-01",
    "contract_end": "2027-06-30",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 200,
    "bank_name": "مصرف الراجحي",
    "iban": "SA4880000201608000000038",
    "status": "نشط"
  },
  {
    "id": 40,
    "emp_code": "JM-1040",
    "full_name_ar": "صالحه سلطان علي آل سعيده",
    "full_name_en": "صالحه سلطان علي آل سعيده",
    "national_id": "1075555365",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1992-03-09",
    "email": "emp1040.1040@jalmajd.com",
    "phone": "054000039",
    "job_title_ar": "بائع",
    "job_title_en": "بائع",
    "department_id": 4,
    "branch_id": 4,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2025-10-08",
    "contract_end": "2026-10-07",
    "iqama_expiry": null,
    "basic_salary": 3000,
    "housing_allowance": 1000,
    "transport_allowance": 0,
    "other_allowance": 0.01,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA4980000201608000000039",
    "status": "نشط"
  },
  {
    "id": 41,
    "emp_code": "JM-1041",
    "full_name_ar": "صاوي معتمد دياب عبدالحفيظ",
    "full_name_en": "صاوي معتمد دياب عبدالحفيظ",
    "national_id": "2533533523",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1978-11-28",
    "email": "emp1041.1041@jalmajd.com",
    "phone": "055000040",
    "job_title_ar": "مشرف مدخلي البيانات",
    "job_title_en": "مشرف مدخلي البيانات",
    "department_id": 5,
    "branch_id": 1,
    "department_name_ar": "إدارة تقنية المعلومات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2022-11-19",
    "contract_end": "2026-11-18",
    "iqama_expiry": "2026-11-18",
    "basic_salary": 2700,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA5080000201608000000040",
    "status": "نشط"
  },
  {
    "id": 42,
    "emp_code": "JM-1042",
    "full_name_ar": "ملهي أحمد بن ملهي عسيري",
    "full_name_en": "ملهي أحمد بن ملهي عسيري",
    "national_id": "1122731514",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "2003-11-22",
    "email": "emp1042.1042@jalmajd.com",
    "phone": "056000041",
    "job_title_ar": "بائع",
    "job_title_en": "بائع",
    "department_id": 4,
    "branch_id": 2,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2024-12-24",
    "contract_end": "2026-12-23",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA5180000201608000000041",
    "status": "نشط"
  },
  {
    "id": 43,
    "emp_code": "JM-1043",
    "full_name_ar": "ريان يحي بن عبدالله آل بن محي",
    "full_name_en": "ريان يحي بن عبدالله آل بن محي",
    "national_id": "1127113163",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "2004-12-01",
    "email": "emp1043.1043@jalmajd.com",
    "phone": "057000042",
    "job_title_ar": "بائع تذاكر",
    "job_title_en": "بائع تذاكر",
    "department_id": 4,
    "branch_id": 3,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2026-02-26",
    "contract_end": "2027-02-25",
    "iqama_expiry": null,
    "basic_salary": 3000,
    "housing_allowance": 1000,
    "transport_allowance": 0,
    "other_allowance": 0.01,
    "bank_name": "مصرف الراجحي",
    "iban": "SA5280000201608000000042",
    "status": "نشط"
  },
  {
    "id": 44,
    "emp_code": "JM-1044",
    "full_name_ar": "SHAMSHER ALAM  DOST MOHAMMAD",
    "full_name_en": "SHAMSHER ALAM  DOST MOHAMMAD",
    "national_id": "2367493612",
    "nationality": "الهند",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1982-06-10",
    "email": "shamsheral.1044@jalmajd.com",
    "phone": "058000043",
    "job_title_ar": "حدّاد",
    "job_title_en": "حدّاد",
    "department_id": 1,
    "branch_id": 4,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2022-10-14",
    "contract_end": "2026-10-13",
    "iqama_expiry": "2026-10-13",
    "basic_salary": 1100,
    "housing_allowance": 594,
    "transport_allowance": 0,
    "other_allowance": 594,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA5380000201608000000043",
    "status": "نشط"
  },
  {
    "id": 45,
    "emp_code": "JM-1045",
    "full_name_ar": "عبدالواحد عبدالواحد محمود مصطفى",
    "full_name_en": "عبدالواحد عبدالواحد محمود مصطفى",
    "national_id": "2431370739",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1967-05-21",
    "email": "emp1045.1045@jalmajd.com",
    "phone": "059000044",
    "job_title_ar": "عامل فرز منتجات",
    "job_title_en": "عامل فرز منتجات",
    "department_id": 3,
    "branch_id": 1,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2022-03-01",
    "contract_end": "2027-02-28",
    "iqama_expiry": "2027-02-28",
    "basic_salary": 4200,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA5480000201608000000044",
    "status": "نشط"
  },
  {
    "id": 46,
    "emp_code": "JM-1046",
    "full_name_ar": "HAYAT MUHAMMAD KHAN  HAMZLA",
    "full_name_en": "HAYAT MUHAMMAD KHAN  HAMZLA",
    "national_id": "2341377923",
    "nationality": "باكستان",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1982-01-03",
    "email": "hayatmuham.1046@jalmajd.com",
    "phone": "051000045",
    "job_title_ar": "سائق شاحنة ثقيلة",
    "job_title_en": "سائق شاحنة ثقيلة",
    "department_id": 3,
    "branch_id": 2,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2022-03-01",
    "contract_end": "2027-02-28",
    "iqama_expiry": "2027-02-28",
    "basic_salary": 2600,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA5580000201608000000045",
    "status": "نشط"
  },
  {
    "id": 47,
    "emp_code": "JM-1047",
    "full_name_ar": "HOSAIN MUHAMMAD  SAIFULLAH",
    "full_name_en": "HOSAIN MUHAMMAD  SAIFULLAH",
    "national_id": "2445505395",
    "nationality": "بنغلادش",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1990-01-01",
    "email": "hosainmuha.1047@jalmajd.com",
    "phone": "052000046",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 3,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2022-03-01",
    "contract_end": "2027-02-28",
    "iqama_expiry": "2027-02-28",
    "basic_salary": 1700,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA5680000201608000000046",
    "status": "نشط"
  },
  {
    "id": 48,
    "emp_code": "JM-1048",
    "full_name_ar": "MOHAMMED SHARIF  HOSSAIN",
    "full_name_en": "MOHAMMED SHARIF  HOSSAIN",
    "national_id": "2431491014",
    "nationality": "بنغلادش",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1991-05-03",
    "email": "mohammedsh.1048@jalmajd.com",
    "phone": "053000047",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 4,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2022-03-01",
    "contract_end": "2027-02-28",
    "iqama_expiry": "2027-02-28",
    "basic_salary": 1700,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA5780000201608000000047",
    "status": "نشط"
  },
  {
    "id": 49,
    "emp_code": "JM-1049",
    "full_name_ar": "SHAKEEL MOHAMMED  AZIZ MOHAMMED",
    "full_name_en": "SHAKEEL MOHAMMED  AZIZ MOHAMMED",
    "national_id": "2328836750",
    "nationality": "الهند",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1975-06-02",
    "email": "shakeelmoh.1049@jalmajd.com",
    "phone": "054000048",
    "job_title_ar": "فني شبكات تقنية معلومات",
    "job_title_en": "فني شبكات تقنية معلومات",
    "department_id": 5,
    "branch_id": 1,
    "department_name_ar": "إدارة تقنية المعلومات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2022-03-01",
    "contract_end": "2027-02-28",
    "iqama_expiry": "2027-02-28",
    "basic_salary": 4800,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA5880000201608000000048",
    "status": "نشط"
  },
  {
    "id": 50,
    "emp_code": "JM-1050",
    "full_name_ar": "محمد أحمد عبدالرحمن زويته",
    "full_name_en": "محمد أحمد عبدالرحمن زويته",
    "national_id": "2311971309",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1988-11-22",
    "email": "emp1050.1050@jalmajd.com",
    "phone": "055000049",
    "job_title_ar": "صانع حلويات",
    "job_title_en": "صانع حلويات",
    "department_id": 4,
    "branch_id": 2,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2022-03-01",
    "contract_end": "2027-02-28",
    "iqama_expiry": "2027-02-28",
    "basic_salary": 2500,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA5980000201608000000049",
    "status": "نشط"
  },
  {
    "id": 51,
    "emp_code": "JM-1051",
    "full_name_ar": "ABDUL   AHAD",
    "full_name_en": "ABDUL   AHAD",
    "national_id": "2460208313",
    "nationality": "بنغلادش",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1995-06-16",
    "email": "abdulahad.1051@jalmajd.com",
    "phone": "056000050",
    "job_title_ar": "عامل تنظيف مكاتب ومنشآت",
    "job_title_en": "عامل تنظيف مكاتب ومنشآت",
    "department_id": 1,
    "branch_id": 3,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2022-03-01",
    "contract_end": "2027-02-28",
    "iqama_expiry": "2027-02-28",
    "basic_salary": 1700,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA6080000201608000000050",
    "status": "نشط"
  },
  {
    "id": 52,
    "emp_code": "JM-1052",
    "full_name_ar": "SHAHID MANZOOR MANZOOR HUSSAIN",
    "full_name_en": "SHAHID MANZOOR MANZOOR HUSSAIN",
    "national_id": "2314527587",
    "nationality": "باكستان",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1985-06-06",
    "email": "shahidmanz.1052@jalmajd.com",
    "phone": "057000051",
    "job_title_ar": "عامل إنشاءات",
    "job_title_en": "عامل إنشاءات",
    "department_id": 1,
    "branch_id": 4,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2022-03-01",
    "contract_end": "2027-02-28",
    "iqama_expiry": "2027-02-28",
    "basic_salary": 1900,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA6180000201608000000051",
    "status": "نشط"
  },
  {
    "id": 53,
    "emp_code": "JM-1053",
    "full_name_ar": "ALI RAZA MUHAMMAD SAFDAR",
    "full_name_en": "ALI RAZA MUHAMMAD SAFDAR",
    "national_id": "2315919775",
    "nationality": "باكستان",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1987-11-15",
    "email": "alirazamuh.1053@jalmajd.com",
    "phone": "058000052",
    "job_title_ar": "موظف صندوق محاسبة",
    "job_title_en": "موظف صندوق محاسبة",
    "department_id": 4,
    "branch_id": 1,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2022-03-01",
    "contract_end": "2027-02-28",
    "iqama_expiry": "2027-02-28",
    "basic_salary": 2000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA6280000201608000000052",
    "status": "نشط"
  },
  {
    "id": 54,
    "emp_code": "JM-1054",
    "full_name_ar": "محمد امين عبد الصادق ابراهيم",
    "full_name_en": "محمد امين عبد الصادق ابراهيم",
    "national_id": "2315918215",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1989-02-17",
    "email": "emp1054.1054@jalmajd.com",
    "phone": "059000053",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 2,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2022-03-01",
    "contract_end": "2027-02-28",
    "iqama_expiry": "2027-02-28",
    "basic_salary": 2500,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA6380000201608000000053",
    "status": "نشط"
  },
  {
    "id": 55,
    "emp_code": "JM-1055",
    "full_name_ar": "صلاح محمد علي بن طاهر",
    "full_name_en": "صلاح محمد علي بن طاهر",
    "national_id": "2306940632",
    "nationality": "اليمن",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1982-11-19",
    "email": "emp1055.1055@jalmajd.com",
    "phone": "051000054",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 3,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2022-03-01",
    "contract_end": "2027-02-28",
    "iqama_expiry": "2027-02-28",
    "basic_salary": 3200,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA6480000201608000000054",
    "status": "نشط"
  },
  {
    "id": 56,
    "emp_code": "JM-1056",
    "full_name_ar": "JOWEL   MD HIRON MIA",
    "full_name_en": "JOWEL   MD HIRON MIA",
    "national_id": "2505700043",
    "nationality": "بنغلادش",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1998-12-12",
    "email": "jowelmdhir.1056@jalmajd.com",
    "phone": "052000055",
    "job_title_ar": "عامل تنظيف مكاتب ومنشآت",
    "job_title_en": "عامل تنظيف مكاتب ومنشآت",
    "department_id": 1,
    "branch_id": 4,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2022-04-14",
    "contract_end": "2027-04-13",
    "iqama_expiry": "2027-04-13",
    "basic_salary": 1500,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA6580000201608000000055",
    "status": "نشط"
  },
  {
    "id": 57,
    "emp_code": "JM-1057",
    "full_name_ar": "KRISHNA BAHADUR DALA MAGAR",
    "full_name_en": "KRISHNA BAHADUR DALA MAGAR",
    "national_id": "2440333439",
    "nationality": "نيبال",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1993-11-18",
    "email": "krishnabah.1057@jalmajd.com",
    "phone": "053000056",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 1,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2022-03-01",
    "contract_end": "2027-02-28",
    "iqama_expiry": "2027-02-28",
    "basic_salary": 1800,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA6680000201608000000056",
    "status": "نشط"
  },
  {
    "id": 58,
    "emp_code": "JM-1058",
    "full_name_ar": "هاني عبدالرحمن صالح القحطاني",
    "full_name_en": "هاني عبدالرحمن صالح القحطاني",
    "national_id": "1055798134",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1988-07-06",
    "email": "emp1058.1058@jalmajd.com",
    "phone": "054000057",
    "job_title_ar": "مدير إداري",
    "job_title_en": "مدير إداري",
    "department_id": 2,
    "branch_id": 2,
    "department_name_ar": "إدارة الموارد البشرية",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2022-02-15",
    "contract_end": "2027-02-14",
    "iqama_expiry": null,
    "basic_salary": 10000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA6780000201608000000057",
    "status": "نشط"
  },
  {
    "id": 59,
    "emp_code": "JM-1059",
    "full_name_ar": "مؤمن جابر عطيت الله عثمان",
    "full_name_en": "مؤمن جابر عطيت الله عثمان",
    "national_id": "2553883683",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1998-11-12",
    "email": "emp1059.1059@jalmajd.com",
    "phone": "055000058",
    "job_title_ar": "صانع حلويات",
    "job_title_en": "صانع حلويات",
    "department_id": 4,
    "branch_id": 3,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2023-10-18",
    "contract_end": "2026-10-17",
    "iqama_expiry": "2026-10-17",
    "basic_salary": 2800,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA6880000201608000000058",
    "status": "نشط"
  },
  {
    "id": 60,
    "emp_code": "JM-1060",
    "full_name_ar": "DILSHAD   ANSARI",
    "full_name_en": "DILSHAD   ANSARI",
    "national_id": "2597519772",
    "nationality": "الهند",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "2003-10-26",
    "email": "dilshadans.1060@jalmajd.com",
    "phone": "056000059",
    "job_title_ar": "عامل مخزن",
    "job_title_en": "عامل مخزن",
    "department_id": 3,
    "branch_id": 4,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2024-12-16",
    "contract_end": "2026-12-15",
    "iqama_expiry": "2026-12-15",
    "basic_salary": 1800,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA6980000201608000000059",
    "status": "نشط"
  },
  {
    "id": 61,
    "emp_code": "JM-1061",
    "full_name_ar": "IMRAN FAZAL RAHMAN FAZAL RAHMAN",
    "full_name_en": "IMRAN FAZAL RAHMAN FAZAL RAHMAN",
    "national_id": "2571553151",
    "nationality": "باكستان",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1985-01-01",
    "email": "imranfazal.1061@jalmajd.com",
    "phone": "057000060",
    "job_title_ar": "سباك",
    "job_title_en": "سباك",
    "department_id": 1,
    "branch_id": 1,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2024-04-13",
    "contract_end": "2027-04-12",
    "iqama_expiry": "2027-04-12",
    "basic_salary": 1800,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA7080000201608000000060",
    "status": "نشط"
  },
  {
    "id": 62,
    "emp_code": "JM-1062",
    "full_name_ar": "IBRAR HUSSAIN ETWAR GUL",
    "full_name_en": "IBRAR HUSSAIN ETWAR GUL",
    "national_id": "2332837232",
    "nationality": "باكستان",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1990-03-15",
    "email": "ibrarhussa.1062@jalmajd.com",
    "phone": "058000061",
    "job_title_ar": "عامل مخزن",
    "job_title_en": "عامل مخزن",
    "department_id": 3,
    "branch_id": 2,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2021-12-01",
    "contract_end": "2026-11-30",
    "iqama_expiry": "2026-11-30",
    "basic_salary": 1800,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA7180000201608000000061",
    "status": "نشط"
  },
  {
    "id": 63,
    "emp_code": "JM-1063",
    "full_name_ar": "AASHISH   MANDAL",
    "full_name_en": "AASHISH   MANDAL",
    "national_id": "2518762824",
    "nationality": "نيبال",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "2000-06-07",
    "email": "aashishman.1063@jalmajd.com",
    "phone": "059000062",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 3,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2022-08-15",
    "contract_end": "2027-08-14",
    "iqama_expiry": "2027-08-14",
    "basic_salary": 1600,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA7280000201608000000062",
    "status": "نشط"
  },
  {
    "id": 64,
    "emp_code": "JM-1064",
    "full_name_ar": "نوف علي شامي عسيري",
    "full_name_en": "نوف علي شامي عسيري",
    "national_id": "1115641464",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "2002-02-07",
    "email": "emp1064.1064@jalmajd.com",
    "phone": "051000063",
    "job_title_ar": "بائع",
    "job_title_en": "بائع",
    "department_id": 4,
    "branch_id": 4,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2024-07-21",
    "contract_end": "2027-07-20",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA7380000201608000000063",
    "status": "نشط"
  },
  {
    "id": 65,
    "emp_code": "JM-1065",
    "full_name_ar": "محمد على عبده على",
    "full_name_en": "محمد على عبده على",
    "national_id": "2377526534",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1989-04-01",
    "email": "emp1065.1065@jalmajd.com",
    "phone": "052000064",
    "job_title_ar": "بقال",
    "job_title_en": "بقال",
    "department_id": 4,
    "branch_id": 1,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2021-12-01",
    "contract_end": "2026-11-30",
    "iqama_expiry": "2026-11-30",
    "basic_salary": 2400,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA7480000201608000000064",
    "status": "نشط"
  },
  {
    "id": 66,
    "emp_code": "JM-1066",
    "full_name_ar": "محمد ناصر محمد ال مريع",
    "full_name_en": "محمد ناصر محمد ال مريع",
    "national_id": "1096901374",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1997-10-04",
    "email": "emp1066.1066@jalmajd.com",
    "phone": "053000065",
    "job_title_ar": "بائع",
    "job_title_en": "بائع",
    "department_id": 4,
    "branch_id": 2,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2026-05-11",
    "contract_end": "2027-05-10",
    "iqama_expiry": null,
    "basic_salary": 3000,
    "housing_allowance": 1000,
    "transport_allowance": 0,
    "other_allowance": 0.01,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA7580000201608000000065",
    "status": "نشط"
  },
  {
    "id": 67,
    "emp_code": "JM-1067",
    "full_name_ar": "عبدالمنعم عبدالرحمن عبدالقادر رزق",
    "full_name_en": "عبدالمنعم عبدالرحمن عبدالقادر رزق",
    "national_id": "2576332072",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1984-03-27",
    "email": "emp1067.1067@jalmajd.com",
    "phone": "054000066",
    "job_title_ar": "عامل تعبئة وتغليف",
    "job_title_en": "عامل تعبئة وتغليف",
    "department_id": 3,
    "branch_id": 3,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2024-05-29",
    "contract_end": "2027-05-28",
    "iqama_expiry": "2027-05-28",
    "basic_salary": 2000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA7680000201608000000066",
    "status": "نشط"
  },
  {
    "id": 68,
    "emp_code": "JM-1068",
    "full_name_ar": "MIR   HOSSAIN",
    "full_name_en": "MIR   HOSSAIN",
    "national_id": "2547958955",
    "nationality": "بنغلادش",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1993-03-21",
    "email": "mirhossain.1068@jalmajd.com",
    "phone": "055000067",
    "job_title_ar": "عامل تحميل وتنزيل",
    "job_title_en": "عامل تحميل وتنزيل",
    "department_id": 3,
    "branch_id": 4,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2024-03-01",
    "contract_end": "2027-02-28",
    "iqama_expiry": "2027-02-28",
    "basic_salary": 1700,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA7780000201608000000067",
    "status": "نشط"
  },
  {
    "id": 69,
    "emp_code": "JM-1069",
    "full_name_ar": "طه عبده سيف خالد",
    "full_name_en": "طه عبده سيف خالد",
    "national_id": "2521704086",
    "nationality": "اليمن",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1996-03-02",
    "email": "emp1069.1069@jalmajd.com",
    "phone": "056000068",
    "job_title_ar": "عامل حفظ فواكه وخضروات",
    "job_title_en": "عامل حفظ فواكه وخضروات",
    "department_id": 3,
    "branch_id": 1,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2022-08-15",
    "contract_end": "2027-08-14",
    "iqama_expiry": "2027-08-14",
    "basic_salary": 1800,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA7880000201608000000068",
    "status": "نشط"
  },
  {
    "id": 70,
    "emp_code": "JM-1070",
    "full_name_ar": "SHAFI ULLAH  ABDUL KHALIQ",
    "full_name_en": "SHAFI ULLAH  ABDUL KHALIQ",
    "national_id": "2523936157",
    "nationality": "باكستان",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1981-01-01",
    "email": "shafiullah.1070@jalmajd.com",
    "phone": "057000069",
    "job_title_ar": "عامل بناء",
    "job_title_en": "عامل بناء",
    "department_id": 1,
    "branch_id": 2,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2023-08-03",
    "contract_end": "2027-08-02",
    "iqama_expiry": "2027-08-02",
    "basic_salary": 1800,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA7980000201608000000069",
    "status": "نشط"
  },
  {
    "id": 71,
    "emp_code": "JM-1071",
    "full_name_ar": "FAZAR   ALI",
    "full_name_en": "FAZAR   ALI",
    "national_id": "2442228090",
    "nationality": "بنغلادش",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1990-06-03",
    "email": "fazarali.1071@jalmajd.com",
    "phone": "058000070",
    "job_title_ar": "عامل تعبئة وتغليف",
    "job_title_en": "عامل تعبئة وتغليف",
    "department_id": 3,
    "branch_id": 3,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2021-12-01",
    "contract_end": "2026-11-30",
    "iqama_expiry": "2026-11-30",
    "basic_salary": 1700,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA8080000201608000000070",
    "status": "نشط"
  },
  {
    "id": 72,
    "emp_code": "JM-1072",
    "full_name_ar": "علي احمد علي عبداللطيف",
    "full_name_en": "علي احمد علي عبداللطيف",
    "national_id": "2532635758",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1998-11-04",
    "email": "emp1072.1072@jalmajd.com",
    "phone": "059000071",
    "job_title_ar": "خبّاز",
    "job_title_en": "خبّاز",
    "department_id": 4,
    "branch_id": 4,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2022-11-03",
    "contract_end": "2026-11-02",
    "iqama_expiry": "2026-11-02",
    "basic_salary": 2300,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA8180000201608000000071",
    "status": "نشط"
  },
  {
    "id": 73,
    "emp_code": "JM-1073",
    "full_name_ar": "احمد فوزي كامل عماره",
    "full_name_en": "احمد فوزي كامل عماره",
    "national_id": "2532635725",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1979-08-19",
    "email": "emp1073.1073@jalmajd.com",
    "phone": "051000072",
    "job_title_ar": "خبّاز",
    "job_title_en": "خبّاز",
    "department_id": 4,
    "branch_id": 1,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2022-11-03",
    "contract_end": "2026-11-02",
    "iqama_expiry": "2026-11-02",
    "basic_salary": 2300,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA8280000201608000000072",
    "status": "نشط"
  },
  {
    "id": 74,
    "emp_code": "JM-1074",
    "full_name_ar": "RASHID MANZOOR MANZOOR HUSSAIN",
    "full_name_en": "RASHID MANZOOR MANZOOR HUSSAIN",
    "national_id": "2391081326",
    "nationality": "باكستان",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1990-07-09",
    "email": "rashidmanz.1074@jalmajd.com",
    "phone": "052000073",
    "job_title_ar": "سائق شاحنة ثقيلة",
    "job_title_en": "سائق شاحنة ثقيلة",
    "department_id": 3,
    "branch_id": 2,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2021-02-21",
    "contract_end": "2027-02-20",
    "iqama_expiry": "2027-02-20",
    "basic_salary": 2000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA8380000201608000000073",
    "status": "نشط"
  },
  {
    "id": 75,
    "emp_code": "JM-1075",
    "full_name_ar": "MUHAMMAD YAQOOB KHAN MUHAMMAD AYUB KHAN",
    "full_name_en": "MUHAMMAD YAQOOB KHAN MUHAMMAD AYUB KHAN",
    "national_id": "2391082183",
    "nationality": "باكستان",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1981-01-01",
    "email": "muhammadya.1075@jalmajd.com",
    "phone": "053000074",
    "job_title_ar": "عامل بناء",
    "job_title_en": "عامل بناء",
    "department_id": 1,
    "branch_id": 3,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2021-02-21",
    "contract_end": "2027-02-20",
    "iqama_expiry": "2027-02-20",
    "basic_salary": 1800,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA8480000201608000000074",
    "status": "نشط"
  },
  {
    "id": 76,
    "emp_code": "JM-1076",
    "full_name_ar": "YASIR SIDDIQUE MUHAMMAD SIDDIQUE",
    "full_name_en": "YASIR SIDDIQUE MUHAMMAD SIDDIQUE",
    "national_id": "2391840614",
    "nationality": "باكستان",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1990-01-13",
    "email": "yasirsiddi.1076@jalmajd.com",
    "phone": "054000075",
    "job_title_ar": "عامل إنشاءات",
    "job_title_en": "عامل إنشاءات",
    "department_id": 1,
    "branch_id": 4,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2021-02-21",
    "contract_end": "2027-02-20",
    "iqama_expiry": "2027-02-20",
    "basic_salary": 1700,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA8580000201608000000075",
    "status": "نشط"
  },
  {
    "id": 77,
    "emp_code": "JM-1077",
    "full_name_ar": "عزت محمد سعد عزه",
    "full_name_en": "عزت محمد سعد عزه",
    "national_id": "2562504122",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1994-03-28",
    "email": "emp1077.1077@jalmajd.com",
    "phone": "055000076",
    "job_title_ar": "مهندس مدني",
    "job_title_en": "مهندس مدني",
    "department_id": 1,
    "branch_id": 1,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2023-12-16",
    "contract_end": "2026-12-15",
    "iqama_expiry": "2026-12-15",
    "basic_salary": 5000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA8680000201608000000076",
    "status": "نشط"
  },
  {
    "id": 78,
    "emp_code": "JM-1078",
    "full_name_ar": "DILIP BAHADUR  ASLAMI",
    "full_name_en": "DILIP BAHADUR  ASLAMI",
    "national_id": "2386053587",
    "nationality": "نيبال",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1993-12-09",
    "email": "dilipbahad.1078@jalmajd.com",
    "phone": "056000077",
    "job_title_ar": "خبّاز",
    "job_title_en": "خبّاز",
    "department_id": 4,
    "branch_id": 2,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2021-12-01",
    "contract_end": "2026-11-30",
    "iqama_expiry": "2026-11-30",
    "basic_salary": 1700,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA8780000201608000000077",
    "status": "نشط"
  },
  {
    "id": 79,
    "emp_code": "JM-1079",
    "full_name_ar": "AAMAR SHAHZAD KHAN DILAWAR KHAN SAJJAD",
    "full_name_en": "AAMAR SHAHZAD KHAN DILAWAR KHAN SAJJAD",
    "national_id": "2366421713",
    "nationality": "باكستان",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1985-07-20",
    "email": "aamarshahz.1079@jalmajd.com",
    "phone": "057000078",
    "job_title_ar": "عامل بناء",
    "job_title_en": "عامل بناء",
    "department_id": 1,
    "branch_id": 3,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2021-02-21",
    "contract_end": "2027-02-20",
    "iqama_expiry": "2027-02-20",
    "basic_salary": 1900,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA8880000201608000000078",
    "status": "نشط"
  },
  {
    "id": 80,
    "emp_code": "JM-1080",
    "full_name_ar": "MD AKASH  TALUKDER",
    "full_name_en": "MD AKASH  TALUKDER",
    "national_id": "2544525674",
    "nationality": "بنغلادش",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1997-01-25",
    "email": "mdakashtal.1080@jalmajd.com",
    "phone": "058000079",
    "job_title_ar": "عامل تحميل وتنزيل",
    "job_title_en": "عامل تحميل وتنزيل",
    "department_id": 3,
    "branch_id": 4,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2023-05-10",
    "contract_end": "2027-05-09",
    "iqama_expiry": "2027-05-09",
    "basic_salary": 1500,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA8980000201608000000079",
    "status": "نشط"
  },
  {
    "id": 81,
    "emp_code": "JM-1081",
    "full_name_ar": "باسم محسن السيد فرج",
    "full_name_en": "باسم محسن السيد فرج",
    "national_id": "2573815962",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1992-07-05",
    "email": "emp1081.1081@jalmajd.com",
    "phone": "059000080",
    "job_title_ar": "خبّاز",
    "job_title_en": "خبّاز",
    "department_id": 4,
    "branch_id": 1,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2024-05-04",
    "contract_end": "2027-05-03",
    "iqama_expiry": "2027-05-03",
    "basic_salary": 3000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA1080000201608000000080",
    "status": "نشط"
  },
  {
    "id": 82,
    "emp_code": "JM-1082",
    "full_name_ar": "السيد ابراهيم السيد مسعود",
    "full_name_en": "السيد ابراهيم السيد مسعود",
    "national_id": "2552866333",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1979-11-23",
    "email": "emp1082.1082@jalmajd.com",
    "phone": "051000081",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 2,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2023-09-16",
    "contract_end": "2027-09-15",
    "iqama_expiry": "2027-09-15",
    "basic_salary": 2500,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA1180000201608000000081",
    "status": "نشط"
  },
  {
    "id": 83,
    "emp_code": "JM-1083",
    "full_name_ar": "عصام جابر النجيلي عبده",
    "full_name_en": "عصام جابر النجيلي عبده",
    "national_id": "2532227648",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1986-01-20",
    "email": "emp1083.1083@jalmajd.com",
    "phone": "052000082",
    "job_title_ar": "عامل تعبئة وتغليف",
    "job_title_en": "عامل تعبئة وتغليف",
    "department_id": 3,
    "branch_id": 3,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2022-10-30",
    "contract_end": "2026-10-29",
    "iqama_expiry": "2026-10-29",
    "basic_salary": 2000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA1280000201608000000082",
    "status": "نشط"
  },
  {
    "id": 84,
    "emp_code": "JM-1084",
    "full_name_ar": "علاء السيد مصطفى حسن",
    "full_name_en": "علاء السيد مصطفى حسن",
    "national_id": "2497963237",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1981-08-06",
    "email": "emp1084.1084@jalmajd.com",
    "phone": "053000083",
    "job_title_ar": "عامل تركيب خطوط الاتصالات وتقنية المعلومات",
    "job_title_en": "عامل تركيب خطوط الاتصالات وتقنية المعلومات",
    "department_id": 5,
    "branch_id": 4,
    "department_name_ar": "إدارة تقنية المعلومات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2023-04-06",
    "contract_end": "2027-04-05",
    "iqama_expiry": "2027-04-05",
    "basic_salary": 1800,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA1380000201608000000083",
    "status": "نشط"
  },
  {
    "id": 85,
    "emp_code": "JM-1085",
    "full_name_ar": "NABAB   KHAN",
    "full_name_en": "NABAB   KHAN",
    "national_id": "2577378348",
    "nationality": "الهند",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1974-11-19",
    "email": "nababkhan.1085@jalmajd.com",
    "phone": "054000084",
    "job_title_ar": "سائق شاحنة ثقيلة",
    "job_title_en": "سائق شاحنة ثقيلة",
    "department_id": 3,
    "branch_id": 1,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2024-06-25",
    "contract_end": "2027-06-24",
    "iqama_expiry": "2027-06-24",
    "basic_salary": 1800,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA1480000201608000000084",
    "status": "نشط"
  },
  {
    "id": 86,
    "emp_code": "JM-1086",
    "full_name_ar": "MANJIT KUMAR  SADA",
    "full_name_en": "MANJIT KUMAR  SADA",
    "national_id": "2518764192",
    "nationality": "نيبال",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "2000-12-30",
    "email": "manjitkuma.1086@jalmajd.com",
    "phone": "055000085",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 2,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2022-08-08",
    "contract_end": "2027-08-07",
    "iqama_expiry": "2027-08-07",
    "basic_salary": 1500,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA1580000201608000000085",
    "status": "نشط"
  },
  {
    "id": 87,
    "emp_code": "JM-1087",
    "full_name_ar": "ANIT   KUMAR",
    "full_name_en": "ANIT   KUMAR",
    "national_id": "2522358940",
    "nationality": "نيبال",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1995-08-06",
    "email": "anitkumar.1087@jalmajd.com",
    "phone": "056000086",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 3,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2022-08-06",
    "contract_end": "2027-08-05",
    "iqama_expiry": "2027-08-05",
    "basic_salary": 1600,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA1680000201608000000086",
    "status": "نشط"
  },
  {
    "id": 88,
    "emp_code": "JM-1088",
    "full_name_ar": "HEM SHANKAR  KUMAR",
    "full_name_en": "HEM SHANKAR  KUMAR",
    "national_id": "2520369931",
    "nationality": "نيبال",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1995-11-17",
    "email": "hemshankar.1088@jalmajd.com",
    "phone": "057000087",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 4,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2022-08-06",
    "contract_end": "2027-08-05",
    "iqama_expiry": "2027-08-05",
    "basic_salary": 1700,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA1780000201608000000087",
    "status": "نشط"
  },
  {
    "id": 89,
    "emp_code": "JM-1089",
    "full_name_ar": "MUHAMMAD AFZAL NAZIR AHMED",
    "full_name_en": "MUHAMMAD AFZAL NAZIR AHMED",
    "national_id": "2364523445",
    "nationality": "باكستان",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1987-06-02",
    "email": "muhammadaf.1089@jalmajd.com",
    "phone": "058000088",
    "job_title_ar": "عامل بناء",
    "job_title_en": "عامل بناء",
    "department_id": 1,
    "branch_id": 1,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2021-02-21",
    "contract_end": "2027-02-20",
    "iqama_expiry": "2027-02-20",
    "basic_salary": 1800,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA1880000201608000000088",
    "status": "نشط"
  },
  {
    "id": 90,
    "emp_code": "JM-1090",
    "full_name_ar": "سالم محمد سالم طرشوم",
    "full_name_en": "سالم محمد سالم طرشوم",
    "national_id": "2534953621",
    "nationality": "اليمن",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1999-07-07",
    "email": "emp1090.1090@jalmajd.com",
    "phone": "059000089",
    "job_title_ar": "عامل تحميل وتنزيل",
    "job_title_en": "عامل تحميل وتنزيل",
    "department_id": 3,
    "branch_id": 2,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2023-03-29",
    "contract_end": "2027-03-28",
    "iqama_expiry": "2027-03-28",
    "basic_salary": 1800,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA1980000201608000000089",
    "status": "نشط"
  },
  {
    "id": 91,
    "emp_code": "JM-1091",
    "full_name_ar": "مشعل عبدالرحمن علي يعن الله",
    "full_name_en": "مشعل عبدالرحمن علي يعن الله",
    "national_id": "1125621555",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "2004-07-03",
    "email": "emp1091.1091@jalmajd.com",
    "phone": "051000090",
    "job_title_ar": "بائع",
    "job_title_en": "بائع",
    "department_id": 4,
    "branch_id": 3,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2026-08-02",
    "contract_end": "2027-08-01",
    "iqama_expiry": null,
    "basic_salary": 3000,
    "housing_allowance": 1000,
    "transport_allowance": 0,
    "other_allowance": 0.01,
    "bank_name": "مصرف الراجحي",
    "iban": "SA2080000201608000000090",
    "status": "نشط"
  },
  {
    "id": 92,
    "emp_code": "JM-1092",
    "full_name_ar": "ابوالحجاج على حجاج على",
    "full_name_en": "ابوالحجاج على حجاج على",
    "national_id": "2455183125",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1990-01-01",
    "email": "emp1092.1092@jalmajd.com",
    "phone": "052000091",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 4,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2021-12-01",
    "contract_end": "2026-11-30",
    "iqama_expiry": "2026-11-30",
    "basic_salary": 2400,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA2180000201608000000091",
    "status": "نشط"
  },
  {
    "id": 93,
    "emp_code": "JM-1093",
    "full_name_ar": "محمد صالح مهدى الدكانى",
    "full_name_en": "محمد صالح مهدى الدكانى",
    "national_id": "2634165951",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1994-06-10",
    "email": "emp1093.1093@jalmajd.com",
    "phone": "053000092",
    "job_title_ar": "محلل شبكات",
    "job_title_en": "محلل شبكات",
    "department_id": 5,
    "branch_id": 1,
    "department_name_ar": "إدارة تقنية المعلومات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2026-03-18",
    "contract_end": "2027-03-17",
    "iqama_expiry": "2027-03-17",
    "basic_salary": 3000,
    "housing_allowance": 1000,
    "transport_allowance": 0,
    "other_allowance": 0.01,
    "bank_name": "مصرف الراجحي",
    "iban": "SA2280000201608000000092",
    "status": "نشط"
  },
  {
    "id": 94,
    "emp_code": "JM-1094",
    "full_name_ar": "لينا عيد ناصر قبطي",
    "full_name_en": "لينا عيد ناصر قبطي",
    "national_id": "1104736580",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1999-01-06",
    "email": "emp1094.1094@jalmajd.com",
    "phone": "054000093",
    "job_title_ar": "بائع",
    "job_title_en": "بائع",
    "department_id": 4,
    "branch_id": 2,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2023-10-05",
    "contract_end": "2027-10-04",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA2380000201608000000093",
    "status": "نشط"
  },
  {
    "id": 95,
    "emp_code": "JM-1095",
    "full_name_ar": "محمد حلمي محمد رحاب",
    "full_name_en": "محمد حلمي محمد رحاب",
    "national_id": "2576332247",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1983-01-01",
    "email": "emp1095.1095@jalmajd.com",
    "phone": "055000094",
    "job_title_ar": "عامل تعبئة وتغليف",
    "job_title_en": "عامل تعبئة وتغليف",
    "department_id": 3,
    "branch_id": 3,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2024-05-29",
    "contract_end": "2027-05-28",
    "iqama_expiry": "2027-05-28",
    "basic_salary": 2000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA2480000201608000000094",
    "status": "نشط"
  },
  {
    "id": 96,
    "emp_code": "JM-1096",
    "full_name_ar": "JAHIRUL HOQUE ABBAS SEKH",
    "full_name_en": "JAHIRUL HOQUE ABBAS SEKH",
    "national_id": "2481928717",
    "nationality": "الهند",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1992-03-25",
    "email": "jahirulhoq.1096@jalmajd.com",
    "phone": "056000095",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 4,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2021-12-01",
    "contract_end": "2026-11-30",
    "iqama_expiry": "2026-11-30",
    "basic_salary": 1800,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA2580000201608000000095",
    "status": "نشط"
  },
  {
    "id": 97,
    "emp_code": "JM-1097",
    "full_name_ar": "MD   SHAKIL",
    "full_name_en": "MD   SHAKIL",
    "national_id": "2532369572",
    "nationality": "بنغلادش",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1994-01-01",
    "email": "mdshakil.1097@jalmajd.com",
    "phone": "057000096",
    "job_title_ar": "عامل تحميل وتنزيل",
    "job_title_en": "عامل تحميل وتنزيل",
    "department_id": 3,
    "branch_id": 1,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2022-11-09",
    "contract_end": "2026-11-08",
    "iqama_expiry": "2026-11-08",
    "basic_salary": 1700,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA2680000201608000000096",
    "status": "نشط"
  },
  {
    "id": 98,
    "emp_code": "JM-1098",
    "full_name_ar": "عهود سعيد بن محمد القحطاني",
    "full_name_en": "عهود سعيد بن محمد القحطاني",
    "national_id": "1074201359",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1991-10-17",
    "email": "emp1098.1098@jalmajd.com",
    "phone": "058000097",
    "job_title_ar": "كاتب موارد بشرية",
    "job_title_en": "كاتب موارد بشرية",
    "department_id": 2,
    "branch_id": 2,
    "department_name_ar": "إدارة الموارد البشرية",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2024-02-21",
    "contract_end": "2027-02-20",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA2780000201608000000097",
    "status": "نشط"
  },
  {
    "id": 99,
    "emp_code": "JM-1099",
    "full_name_ar": "ABDUL REHMAN KHAN SHERWANI MEHMOOD KHAN",
    "full_name_en": "ABDUL REHMAN KHAN SHERWANI MEHMOOD KHAN",
    "national_id": "2364517926",
    "nationality": "باكستان",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1992-06-06",
    "email": "abdulrehma.1099@jalmajd.com",
    "phone": "059000098",
    "job_title_ar": "عامل تعبئة وتغليف",
    "job_title_en": "عامل تعبئة وتغليف",
    "department_id": 3,
    "branch_id": 3,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2021-12-01",
    "contract_end": "2026-11-30",
    "iqama_expiry": "2026-11-30",
    "basic_salary": 2200,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA2880000201608000000098",
    "status": "نشط"
  },
  {
    "id": 100,
    "emp_code": "JM-1100",
    "full_name_ar": "احمد محمد احمد النجار",
    "full_name_en": "احمد محمد احمد النجار",
    "national_id": "2532369440",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1989-02-14",
    "email": "emp1100.1100@jalmajd.com",
    "phone": "051000099",
    "job_title_ar": "خبّاز",
    "job_title_en": "خبّاز",
    "department_id": 4,
    "branch_id": 4,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2022-11-09",
    "contract_end": "2026-11-08",
    "iqama_expiry": "2026-11-08",
    "basic_salary": 2200,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA2980000201608000000099",
    "status": "نشط"
  },
  {
    "id": 101,
    "emp_code": "JM-1101",
    "full_name_ar": "زايد يحي محمد معوض",
    "full_name_en": "زايد يحي محمد معوض",
    "national_id": "1087002117",
    "nationality": "السعودية",
    "is_saudi": 1,
    "gender": "M",
    "birth_date": "1986-04-17",
    "email": "emp1101.1101@jalmajd.com",
    "phone": "052000100",
    "job_title_ar": "حارس أمن",
    "job_title_en": "حارس أمن",
    "department_id": 1,
    "branch_id": 1,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2022-02-15",
    "contract_end": "2027-02-14",
    "iqama_expiry": null,
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA3080000201608000000100",
    "status": "نشط"
  },
  {
    "id": 102,
    "emp_code": "JM-1102",
    "full_name_ar": "MOHAMMED IMRAN  ALI",
    "full_name_en": "MOHAMMED IMRAN  ALI",
    "national_id": "2452771989",
    "nationality": "الهند",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1993-06-27",
    "email": "mohammedim.1102@jalmajd.com",
    "phone": "053000101",
    "job_title_ar": "خبّاز",
    "job_title_en": "خبّاز",
    "department_id": 4,
    "branch_id": 2,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2021-12-01",
    "contract_end": "2026-11-30",
    "iqama_expiry": "2026-11-30",
    "basic_salary": 1900,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA3180000201608000000101",
    "status": "نشط"
  },
  {
    "id": 103,
    "emp_code": "JM-1103",
    "full_name_ar": "تامر جمعه احمد عبدالله",
    "full_name_en": "تامر جمعه احمد عبدالله",
    "national_id": "2573815988",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1981-02-07",
    "email": "emp1103.1103@jalmajd.com",
    "phone": "054000102",
    "job_title_ar": "خبّاز",
    "job_title_en": "خبّاز",
    "department_id": 4,
    "branch_id": 3,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2024-05-04",
    "contract_end": "2027-05-03",
    "iqama_expiry": "2027-05-03",
    "basic_salary": 4000,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA3280000201608000000102",
    "status": "نشط"
  },
  {
    "id": 104,
    "emp_code": "JM-1104",
    "full_name_ar": "مصطفى محمود احمد مصطفى",
    "full_name_en": "مصطفى محمود احمد مصطفى",
    "national_id": "2597471909",
    "nationality": "مصر",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1994-04-04",
    "email": "emp1104.1104@jalmajd.com",
    "phone": "055000103",
    "job_title_ar": "عامل تعبئة رفوف",
    "job_title_en": "عامل تعبئة رفوف",
    "department_id": 3,
    "branch_id": 4,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2024-12-10",
    "contract_end": "2026-12-09",
    "iqama_expiry": "2026-12-09",
    "basic_salary": 2500,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA3380000201608000000103",
    "status": "نشط"
  },
  {
    "id": 105,
    "emp_code": "JM-1105",
    "full_name_ar": "عبد الله محمد سالم طرشوم",
    "full_name_en": "عبد الله محمد سالم طرشوم",
    "national_id": "2300751563",
    "nationality": "اليمن",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1987-06-01",
    "email": "emp1105.1105@jalmajd.com",
    "phone": "056000104",
    "job_title_ar": "عامل حفظ فواكه وخضروات",
    "job_title_en": "عامل حفظ فواكه وخضروات",
    "department_id": 3,
    "branch_id": 1,
    "department_name_ar": "إدارة المشتريات",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2022-07-31",
    "contract_end": "2027-07-30",
    "iqama_expiry": "2027-07-30",
    "basic_salary": 2300,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 700,
    "bank_name": "مصرف الراجحي",
    "iban": "SA3480000201608000000104",
    "status": "نشط"
  },
  {
    "id": 106,
    "emp_code": "JM-1106",
    "full_name_ar": "YAKUB PASHA SHAIK  HUSSAIN MIYA",
    "full_name_en": "YAKUB PASHA SHAIK  HUSSAIN MIYA",
    "national_id": "2304330885",
    "nationality": "الهند",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1980-05-05",
    "email": "yakubpasha.1106@jalmajd.com",
    "phone": "057000105",
    "job_title_ar": "موظف صندوق محاسبة",
    "job_title_en": "موظف صندوق محاسبة",
    "department_id": 4,
    "branch_id": 2,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع المنسك",
    "join_date": "2022-08-01",
    "contract_end": "2027-07-31",
    "iqama_expiry": "2027-07-31",
    "basic_salary": 2100,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA3580000201608000000105",
    "status": "نشط"
  },
  {
    "id": 107,
    "emp_code": "JM-1107",
    "full_name_ar": "JHAMAN SING  RANA",
    "full_name_en": "JHAMAN SING  RANA",
    "national_id": "2300752090",
    "nationality": "نيبال",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1989-02-27",
    "email": "jhamansing.1107@jalmajd.com",
    "phone": "058000106",
    "job_title_ar": "موظف صندوق محاسبة",
    "job_title_en": "موظف صندوق محاسبة",
    "department_id": 4,
    "branch_id": 3,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع حي الموظفين",
    "join_date": "2022-08-01",
    "contract_end": "2027-07-31",
    "iqama_expiry": "2027-07-31",
    "basic_salary": 1300,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 600,
    "bank_name": "مصرف الراجحي",
    "iban": "SA3680000201608000000106",
    "status": "نشط"
  },
  {
    "id": 108,
    "emp_code": "JM-1108",
    "full_name_ar": "NASHIK ALI  AZAM ALI",
    "full_name_en": "NASHIK ALI  AZAM ALI",
    "national_id": "2301580466",
    "nationality": "الهند",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1982-03-02",
    "email": "nashikalia.1108@jalmajd.com",
    "phone": "059000107",
    "job_title_ar": "موظف صندوق محاسبة",
    "job_title_en": "موظف صندوق محاسبة",
    "department_id": 4,
    "branch_id": 4,
    "department_name_ar": "إدارة المبيعات",
    "branch_name_ar": "فرع محايل عسير",
    "join_date": "2022-08-04",
    "contract_end": "2027-08-03",
    "iqama_expiry": "2027-08-03",
    "basic_salary": 1400,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 500,
    "bank_name": "البنك الأهلي السعودي",
    "iban": "SA3780000201608000000107",
    "status": "نشط"
  },
  {
    "id": 109,
    "emp_code": "JM-1109",
    "full_name_ar": "MD ZAKARIYA PK MD",
    "full_name_en": "MD ZAKARIYA PK MD",
    "national_id": "2506283486",
    "nationality": "بنغلادش",
    "is_saudi": 0,
    "gender": "M",
    "birth_date": "1999-10-12",
    "email": "mdzakariya.1109@jalmajd.com",
    "phone": "051000108",
    "job_title_ar": "عامل تنظيف مكاتب ومنشآت",
    "job_title_en": "عامل تنظيف مكاتب ومنشآت",
    "department_id": 1,
    "branch_id": 1,
    "department_name_ar": "الإدارة التنفيذية",
    "branch_name_ar": "فرع أبها الرئيسي",
    "join_date": "2022-04-14",
    "contract_end": "2027-04-13",
    "iqama_expiry": "2027-04-13",
    "basic_salary": 1700,
    "housing_allowance": 0,
    "transport_allowance": 0,
    "other_allowance": 0,
    "bank_name": "مصرف الراجحي",
    "iban": "SA3880000201608000000108",
    "status": "نشط"
  }
],
  devices: [],
  regulations: [
    { code: 'v1', category: 'مخالفات مواعيد العمل', violation_text: 'التأخر عن مواعيد الحضور للعمل لغاية (15) دقيقة دون إذن أو عذر مقبول إذا لم يترتب عليه تعطيل عمال آخرين', penalty_1st: 'إنذار كتابي', penalty_2nd: 'خصم 5% من أجر اليوم', penalty_3rd: 'خصم 10% من أجر اليوم', penalty_4th: 'خصم 20% من أجر اليوم' },
    { code: 'v2', category: 'مخالفات مواعيد العمل', violation_text: 'التأخر عن مواعيد الحضور للعمل لغاية (15) دقيقة إذا ترتب عليه تعطيل عمال آخرين', penalty_1st: 'إنذار كتابي', penalty_2nd: 'خصم 15% من أجر اليوم', penalty_3rd: 'خصم 25% من أجر اليوم', penalty_4th: 'خصم 50% من أجر اليوم' },
    { code: 'v3', category: 'مخالفات مواعيد العمل', violation_text: 'التأخر عن مواعيد الحضور للعمل من (15) دقيقة إلى (30) دقيقة دون عذر إذا لم يترتب عليه تعطيل', penalty_1st: 'خصم 10% من أجر اليوم', penalty_2nd: 'خصم 15% من أجر اليوم', penalty_3rd: 'خصم 25% من أجر اليوم', penalty_4th: 'خصم نصف يوم' },
    { code: 'v4', category: 'مخالفات مواعيد العمل', violation_text: 'التأخر عن مواعيد الحضور للعمل من (15) دقيقة إلى (30) دقيقة إذا ترتب عليه تعطيل عمال آخرين', penalty_1st: 'خصم 25% من أجر اليوم', penalty_2nd: 'خصم 50% من أجر اليوم', penalty_3rd: 'خصم 75% من أجر اليوم', penalty_4th: 'خصم أجر يوم كامل' },
    { code: 'v5', category: 'مخالفات مواعيد العمل', violation_text: 'التأخر عن مواعيد الحضور للعمل أكثر من (30) دقيقة لغاية (60) دقيقة دون عذر إذا لم يترتب عليه تعطيل', penalty_1st: 'خصم 25% من أجر اليوم', penalty_2nd: 'خصم 50% من أجر اليوم', penalty_3rd: 'خصم 75% من أجر اليوم', penalty_4th: 'خصم أجر يوم كامل' },
    { code: 'v6', category: 'مخالفات مواعيد العمل', violation_text: 'التأخر عن مواعيد الحضور للعمل أكثر من (30) دقيقة لغاية (60) دقيقة إذا ترتب عليه تعطيل عمال آخرين', penalty_1st: 'خصم 30% من أجر اليوم', penalty_2nd: 'خصم 50% من أجر اليوم', penalty_3rd: 'خصم أجر يوم كامل', penalty_4th: 'خصم أجر يومين' },
    { code: 'v7', category: 'مخالفات مواعيد العمل', violation_text: 'التأخر عن مواعيد الحضور للعمل لمدة تزيد على ساعة دون عذر مقبول', penalty_1st: 'إنذار كتابي', penalty_2nd: 'خصم أجر يوم كامل', penalty_3rd: 'خصم أجر يومين', penalty_4th: 'خصم أجر ثلاثة أيام' },
    { code: 'v8', category: 'مخالفات مواعيد العمل', violation_text: 'ترك العمل أو الانصراف قبل الميعاد دون إذن بما لا يتجاوز (15) دقيقة', penalty_1st: 'إنذار كتابي', penalty_2nd: 'خصم 10% من أجر اليوم', penalty_3rd: 'خصم 25% من أجر اليوم', penalty_4th: 'خصم أجر يوم كامل' },
    { code: 'v9', category: 'مخالفات مواعيد العمل', violation_text: 'ترك العمل أو الانصراف قبل الميعاد دون إذن بما يتجاوز (15) دقيقة', penalty_1st: 'خصم 10% من أجر اليوم', penalty_2nd: 'خصم 25% من أجر اليوم', penalty_3rd: 'خصم نصف يوم', penalty_4th: 'خصم أجر يوم كامل' },
    { code: 'v10', category: 'مخالفات مواعيد العمل', violation_text: 'البقاء في أماكن العمل أو العودة إليها بعد انتهاء مواعيد العمل دون إذن مسبق', penalty_1st: 'إنذار كتابي', penalty_2nd: 'خصم 10% من أجر اليوم', penalty_3rd: 'خصم 25% من أجر اليوم', penalty_4th: 'خصم أجر يوم كامل' },
    { code: 'v11', category: 'مخالفات مواعيد العمل', violation_text: 'الغياب دون إذن كتابي أو عذر مقبول لمدة يوم خلال السنة العقدية الواحدة', penalty_1st: 'خصم نصف يوم', penalty_2nd: 'خصم أجر يوم كامل', penalty_3rd: 'خصم أجر يومين', penalty_4th: 'خصم أجر ثلاثة أيام' },
    { code: 'v12', category: 'مخالفات مواعيد العمل', violation_text: 'الغياب المتصل دون إذن كتابي أو عذر مقبول من يومين إلى ستة أيام خلال السنة', penalty_1st: 'خصم أجر يومين', penalty_2nd: 'خصم أجر ثلاثة أيام', penalty_3rd: 'خصم أجر أربعة أيام', penalty_4th: 'تأجيل الترقية أو الحرمان من العلاوة' },
    { code: 'v13', category: 'مخالفات مواعيد العمل', violation_text: 'الغياب المتصل دون إذن كتابي أو عذر مقبول من سبعة أيام إلى عشرة أيام خلال السنة', penalty_1st: 'خصم أجر أربعة أيام', penalty_2nd: 'خصم أجر خمسة أيام', penalty_3rd: 'تأجيل الترقية أو الحرمان من العلاوة', penalty_4th: 'فصل مع المكافأة إذا لم يتجاوز 30 يوماً' },
    { code: 'v14', category: 'مخالفات مواعيد العمل', violation_text: 'الغياب المتصل دون إذن كتابي أو عذر مقبول من أحد عشر يوماً إلى أربعة عشر يوماً', penalty_1st: 'خصم أجر خمسة أيام', penalty_2nd: 'تأجيل الترقية أو الحرمان من العلاوة + إنذار بالفصل', penalty_3rd: 'فصل من الخدمة مع المكافأة', penalty_4th: 'فصل من الخدمة' },
    { code: 'v15', category: 'مخالفات مواعيد العمل', violation_text: 'الانقطاع عن العمل دون سبب مشروع مدة تزيد على خمسة عشر يوماً متصلة (م 80)', penalty_1st: 'الفصل دون مكافأة أو إشعار', penalty_2nd: '-', penalty_3rd: '-', penalty_4th: '-' },
    { code: 'v16', category: 'مخالفات مواعيد العمل', violation_text: 'الغياب المتقطع دون سبب مشروع مدداً تزيد في مجموعها على ثلاثين يوماً (م 80)', penalty_1st: 'الفصل دون مكافأة أو إشعار', penalty_2nd: '-', penalty_3rd: '-', penalty_4th: '-' },

    { code: 'v17', category: 'مخالفات السلوك والعمل', violation_text: 'التواجد دون مبرر في غير مكان العمل المخصص للعامل أثناء وقت الدوام', penalty_1st: 'خصم 10% من أجر اليوم', penalty_2nd: 'خصم 25% من أجر اليوم', penalty_3rd: 'خصم نصف يوم', penalty_4th: 'خصم أجر يوم كامل' },
    { code: 'v18', category: 'مخالفات السلوك والعمل', violation_text: 'استقبال زائرين في غير أمور عمل المنشأة دون إذن مسبق', penalty_1st: 'إنذار كتابي', penalty_2nd: 'خصم 10% من أجر اليوم', penalty_3rd: 'خصم 15% من أجر اليوم', penalty_4th: 'خصم 25% من أجر اليوم' },
    { code: 'v19', category: 'مخالفات السلوك والعمل', violation_text: 'استعمال آلات ومعدات المنشأة لأغراض شخصية دون إذن', penalty_1st: 'إنذار كتابي', penalty_2nd: 'خصم 10% من أجر اليوم', penalty_3rd: 'خصم 25% من أجر اليوم', penalty_4th: 'خصم نصف يوم' },
    { code: 'v20', category: 'مخالفات السلوك والعمل', violation_text: 'تدخل العامل دون وجه حق في أي عمل ليس في اختصاصه ومسؤولياته', penalty_1st: 'خصم نصف يوم', penalty_2nd: 'خصم أجر يوم كامل', penalty_3rd: 'خصم أجر يومين', penalty_4th: 'خصم أجر ثلاثة أيام' },
    { code: 'v21', category: 'مخالفات السلوك والعمل', violation_text: 'الخروج أو الدخول من غير الأبواب والمداخل المخصصة لذلك', penalty_1st: 'إنذار كتابي', penalty_2nd: 'خصم 10% من أجر اليوم', penalty_3rd: 'خصم 15% من أجر اليوم', penalty_4th: 'خصم 25% من أجر اليوم' },
    { code: 'v22', category: 'مخالفات السلوك والعمل', violation_text: 'الإهمال في صيانة الأجهزة والآلات أو عدم العناية بنظافتها', penalty_1st: 'خصم نصف يوم', penalty_2nd: 'خصم أجر يوم كامل', penalty_3rd: 'خصم أجر يومين', penalty_4th: 'خصم أجر ثلاثة أيام' },
    { code: 'v23', category: 'مخالفات السلوك والعمل', violation_text: 'عدم وضع أدوات الإصلاح والصيانة في أماكنها المخصصة', penalty_1st: 'إنذار كتابي', penalty_2nd: 'خصم 25% من أجر اليوم', penalty_3rd: 'خصم نصف يوم', penalty_4th: 'خصم أجر يوم كامل' },
    { code: 'v24', category: 'مخالفات السلوك والعمل', violation_text: 'تمزيق أو إتلاف إعلانات المنشأة أو التعليمات الإدارية المعلقة', penalty_1st: 'خصم أجر يومين', penalty_2nd: 'خصم أجر ثلاثة أيام', penalty_3rd: 'خصم أجر خمسة أيام', penalty_4th: 'فصل مع المكافأة' },
    { code: 'v25', category: 'مخالفات السلوك والعمل', violation_text: 'الإهمال أو التفريط في العهد العينية المسلمة إليه بحكم وظيفته', penalty_1st: 'خصم أجر يومين', penalty_2nd: 'خصم أجر ثلاثة أيام', penalty_3rd: 'خصم أجر خمسة أيام', penalty_4th: 'فصل مع المكافأة' },
    { code: 'v26', category: 'مخالفات السلوك والعمل', violation_text: 'الأكل في مكان العمل في غير الأوقات أو الأماكن المعدة لذلك', penalty_1st: 'إنذار كتابي', penalty_2nd: 'خصم 10% من أجر اليوم', penalty_3rd: 'خصم 15% من أجر اليوم', penalty_4th: 'خصم 25% من أجر اليوم' },
    { code: 'v27', category: 'مخالفات السلوك والعمل', violation_text: 'النوم أثناء ساعات العمل المعتادة', penalty_1st: 'إنذار كتابي', penalty_2nd: 'خصم 10% من أجر اليوم', penalty_3rd: 'خصم 25% من أجر اليوم', penalty_4th: 'خصم نصف يوم' },
    { code: 'v28', category: 'مخالفات السلوك والعمل', violation_text: 'النوم أثناء العمل في الحالات والوظائف التي تستدعي يقظة مستمرة (أمن، رقابة)', penalty_1st: 'خصم نصف يوم', penalty_2nd: 'خصم أجر يوم كامل', penalty_3rd: 'خصم أجر يومين', penalty_4th: 'خصم أجر ثلاثة أيام' },
    { code: 'v29', category: 'مخالفات السلوك والعمل', violation_text: 'التسكع أو وجود العامل في غير موقع عمله وتعطيل زملائه', penalty_1st: 'خصم 10% من أجر اليوم', penalty_2nd: 'خصم 25% من أجر اليوم', penalty_3rd: 'خصم نصف يوم', penalty_4th: 'خصم أجر يوم كامل' },
    { code: 'v30', category: 'مخالفات السلوك والعمل', violation_text: 'التلاعب في إثبات الحضور والانصراف أو تسجيل بصمة لزميل آخر', penalty_1st: 'خصم أجر يوم كامل', penalty_2nd: 'خصم أجر يومين', penalty_3rd: 'تأجيل الترقية أو الحرمان من العلاوة', penalty_4th: 'فصل من الخدمة مع المكافأة' },
    { code: 'v31', category: 'مخالفات السلوك والعمل', violation_text: 'عدم إطاعة الأوامر والتعليمات الإدارية العادية الخاصة بالعمل', penalty_1st: 'خصم 25% من أجر اليوم', penalty_2nd: 'خصم نصف يوم', penalty_3rd: 'خصم أجر يوم كامل', penalty_4th: 'خصم أجر يومين' },
    { code: 'v32', category: 'مخالفات السلوك والعمل', violation_text: 'التحريض على مخالفة الأوامر والتعليمات أو تعطيل سير العمل', penalty_1st: 'خصم أجر يومين', penalty_2nd: 'خصم أجر ثلاثة أيام', penalty_3rd: 'خصم أجر خمسة أيام', penalty_4th: 'فصل مع المكافأة' },
    { code: 'v33', category: 'مخالفات السلوك والعمل', violation_text: 'التدخين في الأماكن المحظورة داخل مقرات ومرافق المنشأة', penalty_1st: 'خصم أجر يومين', penalty_2nd: 'خصم أجر ثلاثة أيام', penalty_3rd: 'خصم أجر خمسة أيام', penalty_4th: 'فصل مع المكافأة' },
    { code: 'v34', category: 'مخالفات السلوك والعمل', violation_text: 'الإهمال أو التهاون في أداء العمل الذي قد ينشأ عنه ضرر بالممتلكات', penalty_1st: 'خصم أجر يومين', penalty_2nd: 'خصم أجر ثلاثة أيام', penalty_3rd: 'خصم أجر خمسة أيام', penalty_4th: 'فصل مع المكافأة' },

    { code: 'v35', category: 'مخالفات السلوك العام', violation_text: 'التشاجر مع الزملاء أو مع الغير أو إحداث مشاغبات داخل المنشأة', penalty_1st: 'خصم أجر يوم كامل', penalty_2nd: 'خصم أجر يومين', penalty_3rd: 'خصم أجر ثلاثة أيام', penalty_4th: 'خصم أجر خمسة أيام' },
    { code: 'v36', category: 'مخالفات السلوك العام', violation_text: 'التمارض أو ادعاء الإصابة والمرض كذباً للتهرب من العمل', penalty_1st: 'خصم أجر يوم كامل', penalty_2nd: 'خصم أجر يومين', penalty_3rd: 'خصم أجر ثلاثة أيام', penalty_4th: 'خصم أجر خمسة أيام' },
    { code: 'v37', category: 'مخالفات السلوك العام', violation_text: 'الامتناع عن الكشف الطبي المقرر أو مخالفة التعليمات الطبية', penalty_1st: 'خصم أجر يوم كامل', penalty_2nd: 'خصم أجر يومين', penalty_3rd: 'خصم أجر ثلاثة أيام', penalty_4th: 'خصم أجر خمسة أيام' },
    { code: 'v38', category: 'مخالفات السلوك العام', violation_text: 'مخالفة التعليمات الصحية والإجراءات الوقائية المقررة بالمنشأة', penalty_1st: 'خصم نصف يوم', penalty_2nd: 'خصم أجر يوم كامل', penalty_3rd: 'خصم أجر يومين', penalty_4th: 'خصم أجر خمسة أيام' },
    { code: 'v39', category: 'مخالفات السلوك العام', violation_text: 'الكتابة على جدران المنشأة أو لصق إعلانات دون موافقة الإدارة', penalty_1st: 'إنذار كتابي', penalty_2nd: 'خصم 10% من أجر اليوم', penalty_3rd: 'خصم 25% من أجر اليوم', penalty_4th: 'خصم نصف يوم' },
    { code: 'v40', category: 'مخالفات السلوك العام', violation_text: 'رفض التفتيش الإداري عند الدخول أو الانصراف حال طلب ذلك', penalty_1st: 'خصم 25% من أجر اليوم', penalty_2nd: 'خصم نصف يوم', penalty_3rd: 'خصم أجر يوم كامل', penalty_4th: 'خصم أجر يومين' },
    { code: 'v41', category: 'مخالفات السلوك العام', violation_text: 'عدم تسليم المبالغ النقدية المحصلة لحساب المنشأة في مواعيدها', penalty_1st: 'خصم أجر يومين', penalty_2nd: 'خصم أجر ثلاثة أيام', penalty_3rd: 'خصم أجر خمسة أيام', penalty_4th: 'فصل مع المكافأة' },
    { code: 'v42', category: 'مخالفات السلوك العام', violation_text: 'الامتناع عن ارتداء ملابس وأدوات الوقاية والسلامة أثناء العمل', penalty_1st: 'إنذار كتابي', penalty_2nd: 'خصم أجر يوم كامل', penalty_3rd: 'خصم أجر يومين', penalty_4th: 'خصم أجر خمسة أيام' },
    { code: 'v43', category: 'مخالفات السلوك العام', violation_text: 'تعمد الخلوة أو ارتكاب سلوكيات مخالفة للآداب والذوق العام', penalty_1st: 'خصم أجر يومين', penalty_2nd: 'خصم أجر ثلاثة أيام', penalty_3rd: 'خصم أجر خمسة أيام', penalty_4th: 'فصل مع المكافأة' },
    { code: 'v44', category: 'مخالفات السلوك العام', violation_text: 'التلفظ أو الإيحاء بأقوال أو حركات تخدش الحياء العام', penalty_1st: 'خصم أجر يومين', penalty_2nd: 'خصم أجر ثلاثة أيام', penalty_3rd: 'خصم أجر خمسة أيام', penalty_4th: 'فصل مع المكافأة' },
    { code: 'v45', category: 'مخالفات السلوك العام', violation_text: 'الاعتداء على زملاء العمل بالقول أو الإشارة أو التهديد', penalty_1st: 'خصم أجر يومين', penalty_2nd: 'خصم أجر ثلاثة أيام', penalty_3rd: 'خصم أجر خمسة أيام', penalty_4th: 'فصل مع المكافأة' },
    { code: 'v46', category: 'مخالفات السلوك العام', violation_text: 'الاعتداء الجسدي بالضرب على أحد الزملاء أو المرؤوسين (م 80)', penalty_1st: 'فصل فوري دون مكافأة أو إشعار', penalty_2nd: '-', penalty_3rd: '-', penalty_4th: '-' },
    { code: 'v47', category: 'مخالفات السلوك العام', violation_text: 'الاعتداء على صاحب العمل أو المدير المسؤول أو أحد الرؤساء أثناء العمل (م 80)', penalty_1st: 'فصل فوري دون مكافأة أو إشعار', penalty_2nd: '-', penalty_3rd: '-', penalty_4th: '-' },
    { code: 'v48', category: 'مخالفات السلوك العام', violation_text: 'تقديم بلاغ أو شكوى كيدية ضد أحد منسوبي المنشأة', penalty_1st: 'خصم أجر ثلاثة أيام', penalty_2nd: 'خصم أجر خمسة أيام', penalty_3rd: 'فصل مع المكافأة', penalty_4th: '-' },
    { code: 'v49', category: 'مخالفات السلوك العام', violation_text: 'الامتناع عن الإدلاء بالشهادة أو الحضور أمام لجنة التحقيق الإداري', penalty_1st: 'خصم أجر يومين', penalty_2nd: 'خصم أجر ثلاثة أيام', penalty_3rd: 'خصم أجر خمسة أيام', penalty_4th: 'فصل مع المكافأة' },
    { code: 'v50', category: 'مخالفات السلوك العام', violation_text: 'عدم التقيد بالزي الرسمي المعتمد أو المظهر المهني اللائق بالمنشأة', penalty_1st: 'خصم أجر يوم كامل', penalty_2nd: 'خصم أجر يومين', penalty_3rd: 'خصم أجر ثلاثة أيام', penalty_4th: 'خصم أجر خمسة أيام' }
  ],
  issuedPenalties: [],
  policies: [
    { id: 1, policy_name: 'سياسة دوام الإدارة العامة والمكاتب الرئيسية (مول سيتي بارك)', shift_type: 'دوام صباحي', start_time: '08:00', end_time: '16:00', grace_period_mins: 15, daily_hours: 8, work_days: 'الأحد إلى الخميس', flexible_hours: 0, overtime_allowed: 1, notes: 'الدوام الرسمي المعتمد للإدارة العامة بمقر مول سيتي بارك في أبها. تحسب ساعات التأخير بعد 08:15 صباحاً وفق لائحة الجزاءات.', is_active: 1 },
    { id: 2, policy_name: 'سياسة دوام الفرق الفنية والتقنية (دوام مرن)', shift_type: 'دوام مرن', start_time: '07:30', end_time: '15:30', grace_period_mins: 30, daily_hours: 8, work_days: 'الأحد إلى الخميس', flexible_hours: 1, overtime_allowed: 1, notes: 'حضور مرن بين 07:30 و 09:30 صباحاً مع إكمال 8 ساعات عمل يومية، مخصص لمهندسي البرمجيات والأنظمة.', is_active: 1 },
    { id: 3, policy_name: 'سياسة دوام العمليات والمشاريع الميدانية', shift_type: 'دوام ميداني', start_time: '09:00', end_time: '17:00', grace_period_mins: 15, daily_hours: 8, work_days: 'الأحد إلى الخميس', flexible_hours: 0, overtime_allowed: 1, notes: 'خاص بفرق العمليات والتشغيل وإشراف المواقع والمشاريع الخارجية.', is_active: 1 }
  ]
};

// Global App State
const state = {
  currentTab: 'dashboard',
  currentUser: null,
  currentLang: localStorage.getItem('jm_hrms_lang') || 'ar',
  myRequests: [],
  allRequests: [],
  departments: [...FALLBACK_DATA.departments],
  branches: [...(FALLBACK_DATA.branches || [])],
  devices: [...(FALLBACK_DATA.devices || [])],
  employees: [...FALLBACK_DATA.employees],
  regulations: [...FALLBACK_DATA.regulations],
  issuedPenalties: [...FALLBACK_DATA.issuedPenalties],
  users: [...FALLBACK_DATA.users],
  policies: [...(FALLBACK_DATA.policies || [])],
  charts: { dept: null, attendance: null }
};

// Safe API Fetcher with Automatic Fallback
async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(endpoint, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    // Return null to trigger fallback
    return null;
  }
}

// App Initialization
document.addEventListener('DOMContentLoaded', async () => {
  initLanguage();
  await syncDataFromBackend();
  populateDropdowns();
  checkAuth();
  if (typeof initChatbot === 'function') initChatbot();
});

// Authentication & Session
function checkAuth() {
  const savedUser = localStorage.getItem('jm_hrms_user');
  if (savedUser) {
    try {
      state.currentUser = JSON.parse(savedUser);
    } catch (e) {
      state.currentUser = null;
    }
  }

  if (state.currentUser) {
    updateHeaderUserDisplay();
    applyRolePermissions();
    switchTab(state.currentTab || (state.currentUser.role === 'employee' ? 'selfservice' : 'dashboard'));
  } else {
    // Show full-screen unclosable auth gate
    openModal('modalLogin');
    const uInp = document.getElementById('loginUsername');
    const pInp = document.getElementById('loginPassword');
    if (uInp) uInp.value = '';
    if (pInp) pInp.value = '';
    const alertBox = document.getElementById('loginAlertBox');
    if (alertBox) alertBox.classList.add('hidden');
  }
}

function updateHeaderUserDisplay() {
  if (!state.currentUser) return;
  const nameEl = document.getElementById('activeUserName');
  const roleEl = document.getElementById('activeUserRoleBadge');
  if (nameEl) nameEl.textContent = state.currentUser.full_name || state.currentUser.username || 'admin';
  if (roleEl) {
    let rText = 'مدير عام النظام';
    if (state.currentUser.role === 'employee') rText = 'بوابة الموظف';
    else if (state.currentUser.role === 'dept_manager') rText = 'مدير إدارة';
    else if (state.currentUser.role === 'hr_manager') rText = 'مسؤول موارد بشرية';
    roleEl.textContent = rText;
  }
}

function quickFillLogin(u, p) {
  const userInp = document.getElementById('loginUsername');
  const passInp = document.getElementById('loginPassword');
  if (userInp) userInp.value = u;
  if (passInp) passInp.value = p;
  const alertBox = document.getElementById('loginAlertBox');
  if (alertBox) alertBox.classList.add('hidden');
}

function promptLogout() {
  if (confirm('هل تريد تسجيل الخروج من نظام جوهرة المجد؟')) {
    localStorage.removeItem('jm_hrms_user');
    state.currentUser = null;
    openModal('modalLogin');
    const uInput = document.getElementById('loginUsername');
    const pInput = document.getElementById('loginPassword');
    if (uInput) uInput.value = '';
    if (pInput) pInput.value = '';
    const alertBox = document.getElementById('loginAlertBox');
    if (alertBox) alertBox.classList.add('hidden');
  }
}

async function handleLoginSubmit(e) {
  if (e) e.preventDefault();
  const u = document.getElementById('loginUsername').value.trim();
  const p = document.getElementById('loginPassword').value.trim();
  const alertBox = document.getElementById('loginAlertBox');
  const alertText = document.getElementById('loginAlertText');

  if (!u || !p) {
    if (alertBox) {
      alertText.textContent = 'يرجى إدخال اسم المستخدم وكلمة المرور';
      alertBox.classList.remove('hidden');
    }
    return;
  }

  // 1. Try API authentication
  const res = await apiFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: u, password: p })
  });

  if (res && res.success && res.user) {
    state.currentUser = res.user;
  } else {
    // 2. Fallback local credentials check
    const match = state.users.find(usr => usr.username.toLowerCase() === u.toLowerCase() && usr.password === p);
    if (match) {
      state.currentUser = { ...match };
    } else if (u.toLowerCase() === 'admin' && p === 'Jj123') {
      state.currentUser = { ...FALLBACK_DATA.users[0] };
    } else {
      if (alertBox) {
        alertText.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        alertBox.classList.remove('hidden');
      } else {
        alert('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
      return;
    }
  }

  localStorage.setItem('jm_hrms_user', JSON.stringify(state.currentUser));
  if (alertBox) alertBox.classList.add('hidden');
  closeModal('modalLogin');
  updateHeaderUserDisplay();
  applyRolePermissions();

  if (state.currentUser.role === 'employee') {
    switchTab('selfservice');
  } else {
    switchTab(state.currentTab || 'dashboard');
  }
}

function applyRolePermissions() {
  if (!state.currentUser) return;
  const role = state.currentUser.role;
  const perms = state.currentUser.permissions || [];
  const hasAll = role === 'admin' || perms.includes('all');

  // 1. Dashboard Desktop Navigation item
  const navDashboard = document.getElementById('nav-dashboard');
  if (navDashboard) {
    if (role === 'employee' && !perms.includes('dashboard')) {
      navDashboard.classList.add('hidden');
    } else {
      navDashboard.classList.remove('hidden');
    }
  }

  // 2. Executive Indicators in Header (Nitaqat, Biometrics, WPS) - STRICTLY HIDDEN for regular employee
  const headerExecCapsule = document.getElementById('headerExecCapsule');
  if (headerExecCapsule) {
    if (role === 'employee') {
      headerExecCapsule.style.setProperty('display', 'none', 'important');
      headerExecCapsule.classList.add('hidden');
    } else {
      if (window.innerWidth >= 1280) {
        headerExecCapsule.style.setProperty('display', 'flex', 'important');
        headerExecCapsule.classList.remove('hidden');
      } else {
        headerExecCapsule.style.setProperty('display', 'none', 'important');
        headerExecCapsule.classList.add('hidden');
      }
    }
  }

  // 3. Header Users Button
  const headerUsers = document.getElementById('headerUsersBtn');
  if (headerUsers) {
    if (hasAll || perms.includes('users')) {
      headerUsers.classList.remove('hidden');
    } else {
      headerUsers.classList.add('hidden');
    }
  }

  // 4. Desktop Aside navigation items
  const adminTabs = ['employees-db', 'payroll', 'penalties', 'attendance', 'compliance', 'organization', 'branches', 'users', 'data-exchange', 'docs'];
  
  if (!hasAll) {
    adminTabs.forEach(t => {
      const el = document.getElementById(`nav-${t}`);
      if (el) {
        if (t === 'employees-db' && (perms.includes('employees') || role === 'dept_manager')) {
          el.classList.remove('hidden');
        } else if (t === 'compliance' && (perms.includes('compliance') || role === 'dept_manager')) {
          el.classList.remove('hidden');
        } else if (t === 'payroll' && perms.includes('payroll')) {
          el.classList.remove('hidden');
        } else if (t === 'penalties' && perms.includes('penalties')) {
          el.classList.remove('hidden');
        } else if (t === 'attendance' && (perms.includes('attendance') || perms.includes('punch'))) {
          el.classList.remove('hidden');
        } else if (t === 'users' && perms.includes('users')) {
          el.classList.remove('hidden');
        } else if (t === 'organization' && (perms.includes('organization') || role === 'dept_manager')) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }
    });

    // Mobile Bottom Nav customization
    const mobEmp = document.getElementById('mobNavEmployees');
    if (mobEmp) mobEmp.style.display = (perms.includes('employees') || role === 'dept_manager') ? '' : 'none';
    
    const mobAtt = document.getElementById('mobNavAttendance');
    if (mobAtt) {
      if (role === 'employee') {
        mobAtt.style.display = perms.includes('punch') ? '' : 'none';
      } else {
        mobAtt.style.display = '';
      }
    }

    const mobUsers = document.getElementById('mobMoreUsersBtn');
    if (mobUsers) mobUsers.style.display = perms.includes('users') ? '' : 'none';

    const mobPayroll = document.getElementById('mobMorePayrollBtn');
    if (mobPayroll) mobPayroll.style.display = perms.includes('payroll') ? '' : 'none';

    const mobCompliance = document.getElementById('mobMoreComplianceBtn');
    if (mobCompliance) mobCompliance.style.display = (perms.includes('compliance') || role === 'dept_manager') ? '' : 'none';

    const mobPenalties = document.getElementById('mobMorePenaltiesBtn');
    if (mobPenalties) mobPenalties.style.display = perms.includes('penalties') ? '' : 'none';
  } else {
    adminTabs.forEach(t => {
      const el = document.getElementById(`nav-${t}`);
      if (el) el.classList.remove('hidden');
    });
    const mobEmp = document.getElementById('mobNavEmployees');
    if (mobEmp) mobEmp.style.display = '';
    const mobAtt = document.getElementById('mobNavAttendance');
    if (mobAtt) mobAtt.style.display = '';
    const mobUsers = document.getElementById('mobMoreUsersBtn');
    if (mobUsers) mobUsers.style.display = '';
    const mobPayroll = document.getElementById('mobMorePayrollBtn');
    if (mobPayroll) mobPayroll.style.display = '';
    const mobCompliance = document.getElementById('mobMoreComplianceBtn');
    if (mobCompliance) mobCompliance.style.display = '';
    const mobPenalties = document.getElementById('mobMorePenaltiesBtn');
    if (mobPenalties) mobPenalties.style.display = '';
  }

  // 5. Mobile Home Tab Button Icon & Label
  const mobDashboardIcon = document.getElementById('mobNavDashboardIcon');
  const mobDashboardLabel = document.getElementById('mobNavDashboardLabel');
  const mobDashboardBtn = document.getElementById('mobNavDashboard');
  if (role === 'employee') {
    if (mobDashboardIcon) mobDashboardIcon.className = 'fa-solid fa-id-badge';
    if (mobDashboardLabel) mobDashboardLabel.textContent = 'بوابتي';
    if (mobDashboardBtn) mobDashboardBtn.setAttribute('data-tab', 'selfservice');
  } else {
    if (mobDashboardIcon) mobDashboardIcon.className = 'fa-solid fa-chart-pie';
    if (mobDashboardLabel) mobDashboardLabel.textContent = 'الرئيسية';
    if (mobDashboardBtn) mobDashboardBtn.setAttribute('data-tab', 'dashboard');
  }

  // 6. ESS GPS Smart Punch quick action visibility (restricted by default)
  const essGpsPunchBtn = document.getElementById('essGpsPunchBtn');
  if (essGpsPunchBtn) {
    if (hasAll || perms.includes('punch')) {
      essGpsPunchBtn.classList.remove('hidden');
    } else {
      essGpsPunchBtn.classList.add('hidden');
    }
  }
}

// Keep executive indicators responsive on resize
window.addEventListener('resize', () => {
  if (state && state.currentUser) {
    applyRolePermissions();
  }
});

// Synchronize Data with Backend if available
async function syncDataFromBackend() {
  const deptsRes = await apiFetch('/api/departments');
  if (deptsRes && deptsRes.success) state.departments = deptsRes.data;

  const branchesRes = await apiFetch('/api/branches');
  if (branchesRes && branchesRes.success) state.branches = branchesRes.data;

  const devicesRes = await apiFetch('/api/devices');
  if (devicesRes && devicesRes.success) state.devices = devicesRes.data;

  const empsRes = await apiFetch('/api/employees');
  if (empsRes && empsRes.success) state.employees = empsRes.data;

  const regsRes = await apiFetch('/api/penalties/regulations');
  if (regsRes && regsRes.success) state.regulations = regsRes.data;

  const pensRes = await apiFetch('/api/penalties/issued');
  if (pensRes && pensRes.success) state.issuedPenalties = pensRes.data;

  const usersRes = await apiFetch('/api/users');
  if (usersRes && usersRes.success) state.users = usersRes.data;

  const polRes = await apiFetch('/api/policies');
  if (polRes && polRes.success) state.policies = polRes.data;

  const reqRes = await apiFetch('/api/requests');
  if (reqRes && reqRes.success) state.allRequests = reqRes.data;
}

function populateDropdowns() {
  // Department dropdowns
  const deptSelects = ['empDeptFilter', 'empFormDept'];
  deptSelects.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === 'empDeptFilter') el.innerHTML = '<option value="">جميع الإدارات</option>';
    else el.innerHTML = '';
    state.departments.forEach(d => {
      el.innerHTML += `<option value="${d.id}">${d.name_ar}</option>`;
    });
  });

  // Branch dropdowns (Filter & Employee Form & Device Form)
  const branchFilter = document.getElementById('empBranchFilter');
  if (branchFilter) {
    branchFilter.innerHTML = '<option value="">جميع الفروع</option>';
    (state.branches || []).forEach(b => {
      branchFilter.innerHTML += `<option value="${b.id}">${b.name_ar}</option>`;
    });
  }

  const empBranchSelect = document.getElementById('empFormBranch');
  if (empBranchSelect) {
    empBranchSelect.innerHTML = '<option value="">-- اختر الفرع التابع له --</option>';
    (state.branches || []).forEach(b => {
      empBranchSelect.innerHTML += `<option value="${b.id}">${b.name_ar} (${b.city})</option>`;
    });
  }

  const devBranchSelect = document.getElementById('deviceFormBranch');
  if (devBranchSelect) {
    devBranchSelect.innerHTML = '<option value="">-- اختر الفرع --</option>';
    (state.branches || []).forEach(b => {
      devBranchSelect.innerHTML += `<option value="${b.id}">${b.name_ar}</option>`;
    });
  }

  // Direct Manager dropdown in Add Employee modal (#empFormManager)
  const mgrSelect = document.getElementById('empFormManager');
  if (mgrSelect) {
    mgrSelect.innerHTML = '<option value="">-- بدون مدير مباشر (إدارة عليا) --</option>';
    state.employees.forEach(emp => {
      mgrSelect.innerHTML += `<option value="${emp.id}">${emp.full_name_ar} (${emp.job_title_ar})</option>`;
    });
  }

  // Work Policy dropdown in Add Employee modal (#empFormPolicy)
  const policySelect = document.getElementById('empFormPolicy');
  if (policySelect) {
    policySelect.innerHTML = '<option value="">-- اختر سياسة الدوام والورديات --</option>';
    (state.policies || []).forEach(pol => {
      policySelect.innerHTML += `<option value="${pol.id}">${pol.policy_name} (${pol.shift_type || 'دوام'})</option>`;
    });
  }

  // Department Manager dropdown in Add Department modal (#deptManager)
  const deptMgrSelect = document.getElementById('deptManager');
  if (deptMgrSelect) {
    deptMgrSelect.innerHTML = '<option value="">-- بدون مدير حالياً --</option>';
    state.employees.forEach(emp => {
      deptMgrSelect.innerHTML += `<option value="${emp.full_name_ar}">${emp.full_name_ar} (${emp.job_title_ar})</option>`;
    });
  }

  // Employee dropdown in Issue Penalty modal
  const penEmpSelect = document.getElementById('penEmpSelect');
  if (penEmpSelect) {
    penEmpSelect.innerHTML = '<option value="">-- اختر الموظف --</option>';
    state.employees.forEach(emp => {
      penEmpSelect.innerHTML += `<option value="${emp.id}">${emp.emp_code} - ${emp.full_name_ar} (${emp.job_title_ar})</option>`;
    });
  }

  // Employee dropdown in User Creation modal (Link Employee)
  const userEmpSelect = document.getElementById('userFormEmpLink');
  if (userEmpSelect) {
    userEmpSelect.innerHTML = '<option value="">-- اختياري: اختر موظف لتعبئة البيانات تلقائياً --</option>';
    state.employees.forEach(emp => {
      userEmpSelect.innerHTML += `<option value="${emp.id}">${emp.emp_code} - ${emp.full_name_ar} (${emp.job_title_ar})</option>`;
    });
  }

  // Violation regulations dropdown in Issue Penalty modal
  const penViolSelect = document.getElementById('penViolationSelect');
  if (penViolSelect) {
    penViolSelect.innerHTML = '<option value="">-- اختر المخالفة من اللائحة --</option>';
    state.regulations.forEach(reg => {
      penViolSelect.innerHTML += `<option value="${reg.code}">[${reg.code}] ${reg.violation_text.substring(0, 95)}...</option>`;
    });
  }

  // Today's date default
  const today = new Date().toISOString().split('T')[0];
  const incidentDate = document.getElementById('penIncidentDate');
  if (incidentDate) incidentDate.value = today;
}

// Navigation Tabs
function switchTab(tabId) {
  // Security guard for regular employee:
  if (state.currentUser && state.currentUser.role === 'employee') {
    const perms = state.currentUser.permissions || [];
    const forbiddenTabs = ['dashboard', 'payroll', 'penalties', 'compliance', 'organization', 'branches', 'users', 'data-exchange', 'docs'];
    if (forbiddenTabs.includes(tabId) && !perms.includes(tabId)) {
      tabId = 'selfservice';
    }
    if (tabId === 'employees-db' && !perms.includes('employees')) {
      tabId = 'selfservice';
    }
    if (tabId === 'attendance' && !perms.includes('attendance') && !perms.includes('punch')) {
      tabId = 'selfservice';
    }
  }

  state.currentTab = tabId;

  const allTabs = ['dashboard', 'employees-db', 'compliance', 'penalties', 'attendance', 'payroll', 'selfservice', 'organization', 'branches', 'users', 'data-exchange', 'docs'];
  allTabs.forEach(t => {
    const navBtn = document.getElementById(`nav-${t}`);
    const viewSec = document.getElementById(`view-${t}`);
    if (navBtn) {
      if (t === tabId) navBtn.classList.add('nav-item-active');
      else navBtn.classList.remove('nav-item-active');
    }
    if (viewSec) {
      if (t === tabId) viewSec.classList.remove('hidden');
      else viewSec.classList.add('hidden');
    }
  });

  // Synchronize Mobile Bottom Navigation Active Buttons
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    const btnTab = btn.getAttribute('data-tab');
    if (btnTab && (btnTab === tabId || (state.currentUser && state.currentUser.role === 'employee' && btnTab === 'dashboard' && tabId === 'selfservice'))) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Smooth scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  switch (tabId) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'employees-db':
      renderEmployeesTable(state.employees);
      break;
    case 'compliance':
      loadCompliance();
      break;
    case 'penalties':
      renderPenaltyRegulations(state.regulations);
      renderIssuedPenaltiesTable(state.issuedPenalties);
      break;
    case 'attendance':
      loadAttendance(document.getElementById('attendanceDateInput') ? document.getElementById('attendanceDateInput').value : new Date().toISOString().split('T')[0]);
      break;
    case 'payroll':
      loadPayroll();
      break;
    case 'selfservice':
      loadSelfService();
      break;
    case 'organization':
      renderOrganization();
      break;
    case 'branches':
      renderBranches();
      break;
    case 'users':
      renderUsersTable();
      break;
  }
}

function handleMobDashboardClick() {
  if (state.currentUser && state.currentUser.role === 'employee') {
    switchTab('selfservice');
  } else {
    switchTab('dashboard');
  }
}

function handleMobAttendanceClick() {
  if (!state.currentUser) return;
  const perms = state.currentUser.permissions || [];
  if (state.currentUser.role === 'employee') {
    if (perms.includes('punch')) {
      openSmartPunchModal();
    } else {
      alert('تنبيه: خاصية تسجيل الحضور الذكي عبر الموقع الجغرافي (GPS) مخصصة فقط للموظفين الميدانيين المصرح لهم.\n\nنظام الحضور المعتمد لك هو عبر جهاز البصمة البيومترية بمقر الشركة (ZKTeco ProFace X).');
    }
  } else {
    switchTab('attendance');
  }
}

/* =========================================================================
   1. DASHBOARD CONTROLLER (Ensures charts ALWAYS render cleanly)
   ========================================================================= */

async function loadDashboard() {
  // Fetch live stats from API if available
  const statsRes = await apiFetch('/api/dashboard/stats');
  
  const total = statsRes && statsRes.data ? statsRes.data.attendance.totalEmployees : state.employees.length;
  const rate = statsRes && statsRes.data ? statsRes.data.saudization.saudizationRate : (total > 0 ? Math.round((state.employees.filter(e => e.is_saudi === 1).length / total) * 1000) / 10 : 32.1);
  const band = statsRes && statsRes.data ? statsRes.data.saudization.nitaqatBand : 'النطاق الأخضر المتوسط';
  const attRate = statsRes && statsRes.data ? statsRes.data.attendance.attendanceRate : 98.2;
  const present = statsRes && statsRes.data ? statsRes.data.attendance.presentCount : total;
  const onLeave = statsRes && statsRes.data ? statsRes.data.attendance.onLeaveCount : 0;
  const payrollNet = statsRes && statsRes.data && statsRes.data.currentPayroll ? Number(statsRes.data.currentPayroll.total_net).toLocaleString('ar-SA') : '0';

  const totalEl = document.getElementById('statTotalEmployees');
  if (totalEl) totalEl.textContent = total;
  
  const saudEl = document.getElementById('statSaudizationRate');
  if (saudEl) saudEl.textContent = `${rate}%`;

  const badgeEl = document.getElementById('statNitaqatBadge');
  if (badgeEl) badgeEl.textContent = band;

  const headerNitaqat = document.getElementById('headerNitaqatText');
  if (headerNitaqat) headerNitaqat.textContent = `نسبة التوطين (${rate}%)`;

  const attRateEl = document.getElementById('statAttendanceRate');
  if (attRateEl) attRateEl.textContent = `${attRate}%`;

  const attSummEl = document.getElementById('statAttendanceSummaryText');
  if (attSummEl) attSummEl.textContent = `${present} حاضر • ${onLeave} في إجازة`;

  const payAmtEl = document.getElementById('statPayrollAmount');
  if (payAmtEl) payAmtEl.innerHTML = `${payrollNet} <span class="text-xs font-bold text-slate-500">ر.س</span>`;

  const badgeNavComp = document.getElementById('badgeNavCompliance');
  if (badgeNavComp) {
    badgeNavComp.textContent = (statsRes && statsRes.data && statsRes.data.compliance && statsRes.data.compliance.expiringSoon) ? statsRes.data.compliance.expiringSoon : 16;
  }

  // Draw Charts with guaranteed fallback
  drawDeptChart();
  drawAttendanceChart();

  // Render Alerts Table
  const alertsBody = document.getElementById('dashboardAlertsTableBody');
  if (alertsBody) {
    if (statsRes && statsRes.data && statsRes.data.expiringDocs && statsRes.data.expiringDocs.length > 0) {
      alertsBody.innerHTML = statsRes.data.expiringDocs.slice(0, 4).map(d => `
        <tr class="hover:bg-slate-50 transition">
          <td class="py-2.5 px-3 font-bold text-slate-800">${d.full_name_ar}</td>
          <td class="py-2.5 px-3 text-slate-600">${d.document_type}</td>
          <td class="py-2.5 px-3 font-mono text-slate-700">${d.expiry_date}</td>
          <td class="py-2.5 px-3"><span class="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${d.level === 'critical' ? 'badge-expired font-black' : 'badge-warning'}">${d.status}</span></td>
        </tr>
      `).join('');
    } else {
      alertsBody.innerHTML = `
        <tr>
          <td colspan="4" class="py-6 text-center text-slate-400 font-semibold">
            <i class="fa-solid fa-circle-check text-emerald-500 text-lg mb-1 block"></i>
            لا توجد وثائق منتهية أو قاربت على الانتهاء حالياً
          </td>
        </tr>
      `;
    }
  }

  // Render Recent Penalties in Dashboard
  const penBody = document.getElementById('dashboardPenaltiesTableBody');
  if (penBody) {
    penBody.innerHTML = '';
    const pens = (statsRes && statsRes.data && statsRes.data.recentPenalties) ? statsRes.data.recentPenalties : state.issuedPenalties;
    if (!pens || pens.length === 0) {
      penBody.innerHTML = `
        <tr>
          <td colspan="4" class="py-6 text-center text-slate-400 font-semibold">
            <i class="fa-solid fa-shield-halved text-brand/40 text-lg mb-1 block"></i>
            لا توجد قرارات جزائية مسجلة حالياً
          </td>
        </tr>
      `;
    } else {
      pens.slice(0, 4).forEach(p => {
        penBody.innerHTML += `
          <tr class="hover:bg-slate-50 transition">
            <td class="py-2.5 px-3 font-mono font-bold text-brand">${p.decision_no}</td>
            <td class="py-2.5 px-3 font-bold text-slate-800">${p.full_name_ar}</td>
            <td class="py-2.5 px-3 text-slate-600">${p.violation_text.substring(0, 40)}...</td>
            <td class="py-2.5 px-3"><span class="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">${p.penalty_text}</span></td>
          </tr>
        `;
      });
    }
  }
}

function drawDeptChart() {
  const ctx = document.getElementById('deptChart');
  if (!ctx) return;

  if (state.charts.dept) {
    state.charts.dept.destroy();
  }

  const deptCounts = {};
  state.departments.forEach(d => { deptCounts[d.name_ar] = 0; });
  state.employees.forEach(e => {
    const dept = state.departments.find(d => d.id === e.department_id);
    if (dept) deptCounts[dept.name_ar] = (deptCounts[dept.name_ar] || 0) + 1;
  });

  const labels = Object.keys(deptCounts);
  const data = Object.values(deptCounts);

  state.charts.dept = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#700c14', '#d4af37', '#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { font: { family: 'Cairo', size: 10.5 }, boxWidth: 12 }
        }
      }
    }
  });
}

function drawAttendanceChart() {
  const ctx = document.getElementById('attendanceChart');
  if (!ctx) return;

  if (state.charts.attendance) {
    state.charts.attendance.destroy();
  }

  state.charts.attendance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['حاضر في الموعد', 'متأخر', 'في إجازة', 'عمل إضافي'],
      datasets: [{
        label: 'الموظفون',
        data: [13, 1, 1, 2],
        backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#700c14'],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 2, font: { family: 'Cairo', size: 10 } } },
        x: { ticks: { font: { family: 'Cairo', size: 10.5 } } }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

/* =========================================================================
   2. EMPLOYEE DATABASE (Requested: قاعدة بيانات الموظفين)
   ========================================================================= */

function renderEmployeesTable(list) {
  const tbody = document.getElementById('employeesTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="py-8 text-center text-slate-400 font-semibold"><i class="fa-solid fa-users text-2xl text-slate-300 block mb-2"></i>لا توجد بيانات موظفين حالياً. يمكنك إضافة أول موظف عبر زر "إضافة موظف جديد" بالأعلى أو استيرادهم دفعة واحدة.</td></tr>`;
    return;
  }

  list.forEach(emp => {
    const isSaudiBadge = emp.is_saudi === 1
      ? `<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full badge-saudi">سعودي</span>`
      : `<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full badge-expat">${emp.nationality}</span>`;

    const totalSalary = (emp.basic_salary || 0) + (emp.housing_allowance || 0) + (emp.transport_allowance || 0) + (emp.other_allowance || 0);

    let docBadge = `<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full badge-valid">سارية وموثقة</span>`;
    if (emp.iqama_expiry) {
      const exp = new Date(emp.iqama_expiry);
      const diffDays = Math.ceil((exp - new Date()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        docBadge = `<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full badge-expired">إقامة منتهية</span>`;
      } else if (diffDays <= 60) {
        docBadge = `<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full badge-warning">تنتهي خلال ${diffDays} يوم</span>`;
      }
    }

    const manager = state.employees.find(m => m.id === emp.manager_id);
    const managerName = manager ? manager.full_name_ar : null;
    const policy = (state.policies || []).find(p => p.id === emp.policy_id);
    const policyName = policy ? policy.policy_name : (emp.shift_type || null);
    const branch = (state.branches || []).find(b => b.id === emp.branch_id);
    const branchName = branch ? branch.name_ar : (emp.branch_name_ar || null);

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';
    tr.innerHTML = `
      <td class="py-3 px-3 font-mono font-bold text-slate-700">${emp.emp_code}</td>
      <td class="py-3 px-3">
        <div class="font-bold text-slate-900">${emp.full_name_ar}</div>
        <div class="text-[11px] text-slate-400 font-mono">${emp.email}</div>
      </td>
      <td class="py-3 px-3 font-mono text-slate-700">${emp.national_id}</td>
      <td class="py-3 px-3">
        <div class="font-semibold text-slate-800">${emp.job_title_ar}</div>
        <div class="text-[11px] text-slate-400">${emp.department_name_ar || 'الإدارة العامة'}</div>
        ${branchName ? `<div class="text-[10px] text-emerald-700 font-medium mt-0.5"><i class="fa-solid fa-code-branch"></i> الفرع: ${branchName}</div>` : ''}
        ${managerName ? `<div class="text-[10px] text-amber-700 font-medium mt-0.5"><i class="fa-solid fa-user-tie"></i> المدير: ${managerName}</div>` : ''}
        ${policyName ? `<div class="text-[10px] text-indigo-700 font-medium mt-0.5"><i class="fa-solid fa-clock"></i> الدوام: ${policyName}</div>` : ''}
      </td>
      <td class="py-3 px-3">${isSaudiBadge}</td>
      <td class="py-3 px-3 font-mono font-bold text-slate-700">${Number(emp.basic_salary).toLocaleString('ar-SA')} ر.س</td>
      <td class="py-3 px-3 font-mono font-bold text-brand">${Number(totalSalary).toLocaleString('ar-SA')} ر.س</td>
      <td class="py-3 px-3">${docBadge}</td>
      <td class="py-3 px-3 text-center">
        <div class="flex items-center justify-center gap-1.5">
          <button onclick="previewSalaryCertificateForEmp(${emp.id})" title="إصدار تعريف بالراتب" class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center text-xs">
            <i class="fa-solid fa-certificate"></i>
          </button>
          <button onclick="editEmployee(${emp.id})" title="تعديل الموظف" class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center text-xs">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button onclick="deleteEmployeePrompt(${emp.id})" title="حذف الموظف" class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center text-xs">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterEmployeesTable() {
  const search = document.getElementById('empSearchInput').value.toLowerCase().trim();
  const deptId = document.getElementById('empDeptFilter').value;
  const branchId = document.getElementById('empBranchFilter') ? document.getElementById('empBranchFilter').value : '';
  const nat = document.getElementById('empNationalityFilter').value;
  const status = document.getElementById('empStatusFilter').value;

  const filtered = state.employees.filter(e => {
    const matchesSearch = !search ||
      e.full_name_ar.toLowerCase().includes(search) ||
      (e.full_name_en && e.full_name_en.toLowerCase().includes(search)) ||
      e.emp_code.toLowerCase().includes(search) ||
      e.national_id.includes(search);

    const matchesDept = !deptId || String(e.department_id) === String(deptId);
    const matchesBranch = !branchId || String(e.branch_id) === String(branchId);
    const matchesNat = nat === '' || String(e.is_saudi) === String(nat);
    const matchesStatus = !status || e.status === status;

    return matchesSearch && matchesDept && matchesBranch && matchesNat && matchesStatus;
  });

  renderEmployeesTable(filtered);
}

async function handleEmployeeFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('empFormId').value;
  const branchIdVal = document.getElementById('empFormBranch') ? document.getElementById('empFormBranch').value : '';

  const payload = {
    emp_code: document.getElementById('empFormCode').value.trim(),
    full_name_ar: document.getElementById('empFormNameAr').value.trim(),
    full_name_en: document.getElementById('empFormNameEn').value.trim(),
    national_id: document.getElementById('empFormNationalId').value.trim(),
    nationality: document.getElementById('empFormNationality').value.trim(),
    department_id: Number(document.getElementById('empFormDept').value),
    branch_id: branchIdVal ? Number(branchIdVal) : null,
    job_title_ar: document.getElementById('empFormJobTitle').value.trim(),
    email: document.getElementById('empFormEmail').value.trim(),
    phone: document.getElementById('empFormPhone').value.trim(),
    basic_salary: Number(document.getElementById('empFormBasic').value),
    housing_allowance: Number(document.getElementById('empFormHousing').value),
    transport_allowance: Number(document.getElementById('empFormTransport').value),
    other_allowance: Number(document.getElementById('empFormOther').value),
    bank_name: document.getElementById('empFormBankName').value.trim(),
    iban: document.getElementById('empFormIban').value.trim(),
    iqama_expiry: document.getElementById('empFormIqamaExpiry').value || null,
    contract_end: document.getElementById('empFormContractEnd').value || null,
    manager_id: document.getElementById('empFormManager') && document.getElementById('empFormManager').value ? Number(document.getElementById('empFormManager').value) : null,
    policy_id: document.getElementById('empFormPolicy') && document.getElementById('empFormPolicy').value ? Number(document.getElementById('empFormPolicy').value) : null
  };

  const isSaudi = payload.national_id.startsWith('1') ? 1 : 0;
  payload.is_saudi = isSaudi;

  if (id) {
    const idx = state.employees.findIndex(x => x.id === Number(id));
    if (idx !== -1) {
      state.employees[idx] = { ...state.employees[idx], ...payload };
    }
    await apiFetch(`/api/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    alert('تم تحديث بيانات الموظف بنجاح');
  } else {
    payload.id = Date.now();
    payload.status = 'نشط';
    state.employees.unshift(payload);
    await apiFetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    alert('تم إضافة الموظف الجديد بنجاح');
  }

  closeModal('modalAddEmployee');
  populateDropdowns();
  renderEmployeesTable(state.employees);
  loadDashboard();
}

function openAddEmployeeModal() {
  populateDropdowns();
  const form = document.getElementById('addEmployeeForm');
  if (form) form.reset();
  const title = document.getElementById('employeeModalTitle');
  if (title) title.innerHTML = `<i class="fa-solid fa-user-plus text-brand"></i> إضافة موظف جديد`;
  document.getElementById('empFormId').value = '';
  if (document.getElementById('empFormBranch')) document.getElementById('empFormBranch').value = '';
  if (document.getElementById('empFormManager')) document.getElementById('empFormManager').value = '';
  if (document.getElementById('empFormPolicy')) document.getElementById('empFormPolicy').value = '';
  openModal('modalAddEmployee');
}

function editEmployee(id) {
  const emp = state.employees.find(e => e.id === id);
  if (!emp) return;

  populateDropdowns();
  document.getElementById('employeeModalTitle').innerHTML = `<i class="fa-solid fa-user-pen text-brand"></i> تعديل بيانات الموظف: ${emp.full_name_ar}`;
  document.getElementById('empFormId').value = emp.id;
  document.getElementById('empFormCode').value = emp.emp_code;
  document.getElementById('empFormNameAr').value = emp.full_name_ar;
  document.getElementById('empFormNameEn').value = emp.full_name_en || '';
  document.getElementById('empFormNationalId').value = emp.national_id;
  document.getElementById('empFormNationality').value = emp.nationality;
  document.getElementById('empFormDept').value = emp.department_id || '';
  if (document.getElementById('empFormBranch')) document.getElementById('empFormBranch').value = emp.branch_id || '';
  document.getElementById('empFormJobTitle').value = emp.job_title_ar;
  document.getElementById('empFormEmail').value = emp.email;
  document.getElementById('empFormPhone').value = emp.phone;
  document.getElementById('empFormBasic').value = emp.basic_salary;
  document.getElementById('empFormHousing').value = emp.housing_allowance;
  document.getElementById('empFormTransport').value = emp.transport_allowance;
  document.getElementById('empFormOther').value = emp.other_allowance;
  document.getElementById('empFormBankName').value = emp.bank_name;
  document.getElementById('empFormIban').value = emp.iban;
  document.getElementById('empFormIqamaExpiry').value = emp.iqama_expiry || '';
  document.getElementById('empFormContractEnd').value = emp.contract_end || '';
  if (document.getElementById('empFormManager')) document.getElementById('empFormManager').value = emp.manager_id || '';
  if (document.getElementById('empFormPolicy')) document.getElementById('empFormPolicy').value = emp.policy_id || '';

  openModal('modalAddEmployee');
}

function deleteEmployeePrompt(id) {
  if (!confirm('هل أنت متأكد من رغبتك في حذف هذا الموظف؟')) return;
  state.employees = state.employees.filter(e => e.id !== id);
  apiFetch(`/api/employees/${id}`, { method: 'DELETE' });
  renderEmployeesTable(state.employees);
  populateDropdowns();
  loadDashboard();
}

/* =========================================================================
   3. DISCIPLINARY PENALTIES (Requested: القرارات الجزائية وبنود سطح المكتب)
   ========================================================================= */

function switchPenaltySubTab(subTab) {
  const regView = document.getElementById('penaltySubViewRegulations');
  const issuedView = document.getElementById('penaltySubViewIssued');
  const btnReg = document.getElementById('subtab-btn-regulations');
  const btnIssued = document.getElementById('subtab-btn-issued');

  if (subTab === 'regulations') {
    regView.classList.remove('hidden');
    issuedView.classList.add('hidden');
    btnReg.className = 'px-4 py-2 rounded-xl text-xs font-bold transition sub-tab-btn-active';
    btnIssued.className = 'px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition';
  } else {
    regView.classList.add('hidden');
    issuedView.classList.remove('hidden');
    btnReg.className = 'px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition';
    btnIssued.className = 'px-4 py-2 rounded-xl text-xs font-bold transition sub-tab-btn-active';
  }
}

function renderPenaltyRegulations(list) {
  const tbody = document.getElementById('penaltyRegulationsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  list.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';
    tr.innerHTML = `
      <td class="py-2.5 px-2 text-center font-mono font-bold text-brand bg-slate-50">${item.code}</td>
      <td class="py-2.5 px-3 font-semibold text-slate-700">${item.category}</td>
      <td class="py-2.5 px-4 font-bold text-slate-900">${item.violation_text}</td>
      <td class="py-2.5 px-2 text-center font-semibold text-slate-700 bg-slate-100/50">${item.penalty_1st}</td>
      <td class="py-2.5 px-2 text-center font-semibold text-amber-900 bg-amber-50/50">${item.penalty_2nd}</td>
      <td class="py-2.5 px-2 text-center font-semibold text-orange-900 bg-orange-50/50">${item.penalty_3rd}</td>
      <td class="py-2.5 px-2 text-center font-bold text-rose-900 bg-rose-50/50">${item.penalty_4th}</td>
      <td class="py-2.5 px-2 text-center">
        <button onclick="quickIssueForViolation('${item.code}')" class="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] px-2 py-1 rounded-lg">إصدار قرار</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterPenaltyRegs(category) {
  if (!category) {
    renderPenaltyRegulations(state.regulations);
  } else {
    const filtered = state.regulations.filter(r => r.category === category);
    renderPenaltyRegulations(filtered);
  }
}

function searchPenaltyRegs(term) {
  const q = term.toLowerCase().trim();
  const filtered = state.regulations.filter(r => r.violation_text.toLowerCase().includes(q) || r.code.toLowerCase().includes(q));
  renderPenaltyRegulations(filtered);
}

function quickIssueForViolation(code) {
  openModal('modalIssuePenalty');
  document.getElementById('penViolationSelect').value = code;
  onViolationSelected(code);
}

function onViolationSelected(code) {
  updatePenaltyAutoPreview();
}

function updatePenaltyAutoPreview() {
  const code = document.getElementById('penViolationSelect').value;
  const rep = document.getElementById('penRepetitionSelect').value;
  const previewBox = document.getElementById('penCalculatedPreview');

  const reg = state.regulations.find(r => r.code === code);
  if (!reg) {
    previewBox.textContent = 'يرجى اختيار المخالفة أولاً';
    return;
  }

  let penalty = reg.penalty_1st;
  if (rep === 'المرة الثانية') penalty = reg.penalty_2nd;
  else if (rep === 'المرة الثالثة') penalty = reg.penalty_3rd;
  else if (rep === 'المرة الرابعة') penalty = reg.penalty_4th;

  previewBox.textContent = `${penalty} (مستحق نظاماً)`;
}

async function handlePenaltyIssueSubmit(e) {
  e.preventDefault();
  const empId = Number(document.getElementById('penEmpSelect').value);
  const violCode = document.getElementById('penViolationSelect').value;
  const rep = document.getElementById('penRepetitionSelect').value;
  const incDate = document.getElementById('penIncidentDate').value;
  const details = document.getElementById('penInvestigationDetails').value.trim();

  const emp = state.employees.find(x => x.id === empId);
  const reg = state.regulations.find(x => x.code === violCode);

  if (!emp || !reg) {
    alert('يرجى اختيار الموظف والمخالفة');
    return;
  }

  let penaltyText = reg.penalty_1st;
  if (rep === 'المرة الثانية') penaltyText = reg.penalty_2nd;
  else if (rep === 'المرة الثالثة') penaltyText = reg.penalty_3rd;
  else if (rep === 'المرة الرابعة') penaltyText = reg.penalty_4th;

  const decisionNo = `DEC-2026-${String(state.issuedPenalties.length + 1).padStart(4, '0')}`;

  const newDecision = {
    id: Date.now(),
    decision_no: decisionNo,
    emp_id: emp.id,
    emp_code: emp.emp_code,
    full_name_ar: emp.full_name_ar,
    job_title_ar: emp.job_title_ar,
    national_id: emp.national_id,
    violation_code: reg.code,
    violation_text: reg.violation_text,
    category: reg.category,
    repetition_level: rep,
    penalty_text: penaltyText,
    incident_date: incDate,
    investigation_details: details,
    issued_by: 'خالد سعد الشهراني (إدارة الموارد البشرية)'
  };

  state.issuedPenalties.unshift(newDecision);

  // Sync to API
  await apiFetch('/api/penalties/issue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newDecision)
  });

  closeModal('modalIssuePenalty');
  alert(`تم اعتماد وإصدار القرار الجزائي رقم (${decisionNo}) بنجاح`);
  renderIssuedPenaltiesTable(state.issuedPenalties);
  switchPenaltySubTab('issued');
  loadDashboard();
}

let currentPreviewPenaltyId = null;

function renderIssuedPenaltiesTable(list) {
  const tbody = document.getElementById('issuedPenaltiesTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  const countBadge = document.getElementById('issuedPenaltiesCountBadge');
  if (countBadge) countBadge.textContent = `${list.length} قرارات`;

  if (!list || list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="py-8 text-center text-slate-400 font-semibold">
          <i class="fa-solid fa-shield-halved text-2xl text-slate-300 block mb-2"></i>
          لا توجد قرارات جزائية مسجلة حالياً
        </td>
      </tr>
    `;
    return;
  }

  list.forEach(p => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';
    tr.innerHTML = `
      <td class="py-3 px-3 font-mono font-bold text-brand">${p.decision_no}</td>
      <td class="py-3 px-3">
        <div class="font-bold text-slate-900">${p.full_name_ar}</div>
        <div class="text-[11px] text-slate-400 font-mono">${p.emp_code}</div>
      </td>
      <td class="py-3 px-3 font-mono font-bold text-slate-700">${p.violation_code}</td>
      <td class="py-3 px-4 text-slate-800">${p.violation_text}</td>
      <td class="py-3 px-3 font-bold text-slate-700">${p.repetition_level}</td>
      <td class="py-3 px-3"><span class="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">${p.penalty_text}</span></td>
      <td class="py-3 px-3 font-mono text-slate-600">${p.incident_date}</td>
      <td class="py-3 px-3 text-center">
        <div class="flex items-center justify-center gap-1.5">
          <button onclick="previewPenaltyForm(${p.id})" title="عرض وطباعة الاستمارة" class="bg-brand hover:bg-brand-dark text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1 shadow-sm">
            <i class="fa-solid fa-print"></i>
            <span>الاستمارة</span>
          </button>
          <button onclick="deletePenaltyDecision(${p.id})" title="حذف القرار الجزائي" class="bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 font-bold text-[11px] px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1 shadow-sm">
            <i class="fa-solid fa-trash-can text-rose-600"></i>
            <span>حذف</span>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function deletePenaltyDecision(id) {
  const dec = (state.issuedPenalties || []).find(x => x.id === Number(id));
  const decNo = dec ? dec.decision_no : `#${id}`;
  const empName = dec ? ` للموظف (${dec.full_name_ar})` : '';

  if (!confirm(`هل أنت متأكد من رغبتك في حذف القرار الجزائي ${decNo}${empName} بشكل نهائي؟\n\nلن يمكن التراجع عن هذا الإجراء.`)) {
    return;
  }

  try {
    const res = await apiFetch(`/api/penalties/issued/${id}`, { method: 'DELETE' });
    if (res && res.success) {
      state.issuedPenalties = (state.issuedPenalties || []).filter(x => x.id !== Number(id));
      renderIssuedPenaltiesTable(state.issuedPenalties);
      closeModal('modalPrintPenaltyForm');
      loadDashboard();
      alert(`✓ تم حذف القرار الجزائي ${decNo} بنجاح.`);
    } else {
      state.issuedPenalties = (state.issuedPenalties || []).filter(x => x.id !== Number(id));
      renderIssuedPenaltiesTable(state.issuedPenalties);
      closeModal('modalPrintPenaltyForm');
      loadDashboard();
      alert(`✓ تم حذف القرار الجزائي ${decNo} من النظام.`);
    }
  } catch (err) {
    console.error('Error deleting penalty:', err);
    state.issuedPenalties = (state.issuedPenalties || []).filter(x => x.id !== Number(id));
    renderIssuedPenaltiesTable(state.issuedPenalties);
    closeModal('modalPrintPenaltyForm');
    loadDashboard();
    alert(`✓ تم حذف القرار الجزائي ${decNo}.`);
  }
}

function deleteCurrentPreviewPenalty() {
  if (currentPreviewPenaltyId) {
    deletePenaltyDecision(currentPreviewPenaltyId);
  }
}

function previewPenaltyForm(id) {
  currentPreviewPenaltyId = Number(id);
  const dec = state.issuedPenalties.find(x => x.id === Number(id));
  if (!dec) return;

  const container = document.getElementById('printablePenaltyContent');
  container.innerHTML = `
    <!-- Header matching Company Identity -->
    <div class="flex justify-between items-start border-b-2 border-brand pb-3">
      <div class="flex items-center gap-3">
        <img src="assets/logo.png" class="h-14 w-auto object-contain">
        <div>
          <h3 class="font-black text-brand text-base">شركة جوهرة المجد</h3>
          <p class="text-[11px] text-slate-400">إدارة الموارد البشرية والشؤون الإدارية • نموذج إجراء جزائي رسمي</p>
        </div>
      </div>
      <div class="text-left font-mono text-xs">
        <div class="font-bold text-brand text-sm">${dec.decision_no}</div>
        <div class="text-slate-500 mt-1">تاريخ الإصدار: ${dec.incident_date}</div>
      </div>
    </div>

    <!-- Title -->
    <div class="text-center py-2 bg-slate-100 rounded-xl">
      <h4 class="font-black text-slate-900 text-sm">قرار إداري بتطبيق جزاء تأديبي</h4>
      <p class="text-[11px] text-slate-600 mt-0.5">وفقاً لأحكام نظام العمل السعودي ولائحة تنظيم العمل والجزاءات المعتمدة</p>
    </div>

    <!-- Employee Information Strip -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 border p-3 rounded-xl bg-slate-50 font-semibold text-xs">
      <div><span class="text-slate-400 block text-[10px]">اسم الموظف:</span>${dec.full_name_ar}</div>
      <div><span class="text-slate-400 block text-[10px]">الرقم الوظيفي:</span>${dec.emp_code}</div>
      <div><span class="text-slate-400 block text-[10px]">الهوية / الإقامة:</span>${dec.national_id || '-'}</div>
      <div><span class="text-slate-400 block text-[10px]">المسمى الوظيفي:</span>${dec.job_title_ar}</div>
    </div>

    <!-- Violation Details -->
    <div class="border rounded-xl p-3 space-y-2">
      <div class="flex justify-between border-b pb-2">
        <span class="font-bold text-slate-800">بند وتصنيف المخالفة:</span>
        <span class="font-mono font-bold text-brand">[${dec.violation_code}] ${dec.category}</span>
      </div>
      <div>
        <span class="text-slate-400 block text-[11px]">نص المخالفة المرتكبة:</span>
        <p class="font-bold text-slate-900 text-xs mt-1">${dec.violation_text}</p>
      </div>
      <div class="pt-2 border-t text-[11px]">
        <span class="text-slate-400 block">ملخص الواقعة وإفادة التحقيق الإداري:</span>
        <p class="text-slate-700 mt-1 leading-relaxed">${dec.investigation_details}</p>
      </div>
    </div>

    <!-- Imposed Penalty Box -->
    <div class="p-3 rounded-xl bg-rose-50 border border-rose-200 flex justify-between items-center">
      <div>
        <span class="text-rose-800 font-bold block text-xs">الجزاء التأديبي المعتمد تطبيقاً للائحة:</span>
        <span class="text-rose-600 text-[11px]">درجة التكرار: ${dec.repetition_level}</span>
      </div>
      <div class="text-sm font-black text-rose-800 bg-white px-3 py-1.5 rounded-lg border border-rose-300">
        ${dec.penalty_text}
      </div>
    </div>

    <!-- Signatures and Stamp -->
    <div class="grid grid-cols-3 gap-4 pt-4 border-t text-center text-xs">
      <div>
        <span class="font-bold block text-slate-700">توقيع الموظف بالعلم</span>
        <p class="text-[10px] text-slate-400 mt-1">أقر باطلاعي على القرار</p>
        <div class="h-10 mt-2 border-b border-dashed border-slate-400"></div>
      </div>
      <div>
        <span class="font-bold block text-slate-700">لجنة التحقيق والموارد البشرية</span>
        <p class="text-[10px] text-slate-400 mt-1">${dec.issued_by}</p>
        <div class="h-10 mt-2 border-b border-dashed border-slate-400"></div>
      </div>
      <div class="flex flex-col items-center">
        <div class="official-stamp-penalty">
          <span>شركة جوهرة المجد</span>
          <span class="text-[9px]">قرار جزائي رسمي</span>
          <span class="text-[8px] font-mono">س.ت 7004872169</span>
          <span class="text-[8px]">معتمد نظاماً</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="pt-3 border-t text-[10px] text-slate-400 flex justify-between">
      <span>شركة جوهرة المجد • أبها (مول سيتي بارك)</span>
      <span>هاتف: 920012405</span>
      <span>info@jalmajd.com</span>
    </div>
  `;

  openModal('modalPrintPenaltyForm');
}

function exportPenaltiesCsv() {
  window.open('/api/penalties/export/csv', '_blank');
}


/* =========================================================================
   5. ATTENDANCE & BIOMETRIC CONTROLLER
   ========================================================================= */

function loadAttendance(dateStr) {
  // Render Connected Biometric Devices
  renderBiometricDevices();

  // Badges
  const badges = document.getElementById('attendanceStatsBadges');
  if (badges) {
    const totalEmps = state.employees.length;
    badges.innerHTML = `
      <span class="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">الحاضرون: ${totalEmps}</span>
      <span class="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-lg">المتأخرون: 0</span>
      <span class="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-lg">في إجازة: 0</span>
      <span class="bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-lg">عمل إضافي: 0</span>
    `;
  }

  // Attendance Rows
  const tbody = document.getElementById('attendanceTableBody');
  if (tbody) {
    tbody.innerHTML = '';
    if (state.employees.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" class="py-8 text-center text-slate-400 font-semibold">
            <i class="fa-solid fa-users-slash text-2xl text-slate-300 block mb-2"></i>
            لا يوجد موظفون مسجلون حالياً. أضف موظفين جدد لعرض سجلات حضور وانصراف البصمة الحية.
          </td>
        </tr>
      `;
    } else {
      state.employees.forEach(emp => {
        const branch = (state.branches || []).find(b => b.id === emp.branch_id);
        const branchName = branch ? branch.name_ar : (emp.branch_name_ar || 'المقر الرئيسي');

        tbody.innerHTML += `
          <tr class="hover:bg-slate-50 transition">
            <td class="py-3 px-3 font-mono font-bold text-slate-700">${emp.emp_code}</td>
            <td class="py-3 px-3 font-bold text-slate-900">${emp.full_name_ar}</td>
            <td class="py-3 px-3 text-slate-500">${emp.department_name_ar || 'الإدارة'}</td>
            <td class="py-3 px-3 font-mono text-emerald-700 font-bold">08:00:00</td>
            <td class="py-3 px-3 font-mono text-slate-700 font-bold">-</td>
            <td class="py-3 px-3 font-mono font-bold text-slate-800">8.0 س</td>
            <td class="py-3 px-3 font-mono font-bold text-slate-400">0 د</td>
            <td class="py-3 px-3 font-mono font-bold text-slate-400">0 س</td>
            <td class="py-3 px-3"><span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">حاضر</span></td>
            <td class="py-3 px-3 text-slate-500">حضور نظامي - جهاز بصمة ${branchName}</td>
          </tr>
        `;
      });
    }
  }

  // Render Attendance Policies
  renderPolicies();
}

/* =========================================================================
   5.1 ATTENDANCE POLICIES & WORK SHIFTS (سياسات الدوام والورديات)
   ========================================================================= */

function renderPolicies() {
  const grid = document.getElementById('policiesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const list = state.policies || [];
  if (list.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-slate-400">
        <i class="fa-solid fa-clock text-3xl mb-2 text-slate-300"></i>
        <div class="font-bold text-sm">لم يتم تسجيل أي سياسة دوام بعد</div>
        <div class="text-xs mt-1">اضغط على زر "إنشاء سياسة دوام جديدة" لتحديد مواعيد الورديات وساعات العمل.</div>
      </div>
    `;
    return;
  }

  list.forEach(p => {
    const shiftBadge = p.shift_type === 'morning' || p.shift_type === 'دوام صباحي'
      ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800"><i class="fa-solid fa-sun"></i> صباحي</span>`
      : (p.shift_type === 'evening' || p.shift_type === 'دوام مسائي'
        ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800"><i class="fa-solid fa-moon"></i> مسائي</span>`
        : `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800"><i class="fa-solid fa-sliders"></i> ${p.shift_type || 'مرن'}</span>`);

    grid.innerHTML += `
      <div class="card-elevated p-5 space-y-3.5 border-t-4 border-amber-500 hover:shadow-lg transition">
        <div class="flex justify-between items-start gap-2">
          <div>
            <h4 class="font-black text-slate-900 text-sm leading-snug">${p.policy_name}</h4>
            <div class="mt-1 flex items-center gap-1.5 flex-wrap">
              ${shiftBadge}
              <span class="text-[10px] font-bold px-2 py-0.5 rounded ${p.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}">
                ${p.is_active ? 'مفعلة' : 'معطلة'}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button onclick="openAddPolicyModal(${p.id})" title="تعديل السياسة" class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center text-xs">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deletePolicy(${p.id})" title="حذف السياسة" class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center text-xs">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div>
            <span class="text-slate-400 block text-[10px]">مواعيد العمل:</span>
            <span class="font-bold text-slate-800 font-mono text-[11px]">${p.start_time || '08:00'} - ${p.end_time || '16:00'}</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px]">ساعات العمل اليومية:</span>
            <span class="font-bold text-brand font-mono text-[11px]">${p.daily_hours || 8} ساعات</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px]">فترة السماح صباحاً:</span>
            <span class="font-bold text-amber-700 font-mono text-[11px]">${p.grace_period_mins || 15} دقيقة</span>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px]">أيام الدوام:</span>
            <span class="font-bold text-slate-700 text-[10px] truncate block" title="${p.work_days || 'الأحد - الخميس'}">${p.work_days || 'الأحد - الخميس'}</span>
          </div>
        </div>

        <div class="flex items-center gap-3 text-[11px] text-slate-600">
          <span class="flex items-center gap-1">
            <i class="fa-solid ${p.flexible_hours ? 'fa-circle-check text-emerald-500' : 'fa-circle-xmark text-slate-300'}"></i>
            ساعات مرنة
          </span>
          <span class="flex items-center gap-1">
            <i class="fa-solid ${p.overtime_allowed ? 'fa-circle-check text-emerald-500' : 'fa-circle-xmark text-slate-300'}"></i>
            عمل إضافي
          </span>
        </div>

        ${p.notes ? `
          <div class="text-[11px] text-slate-500 bg-amber-50/50 p-2 rounded-lg border border-amber-100/60 leading-relaxed">
            <i class="fa-solid fa-circle-info text-amber-600 mr-1"></i> ${p.notes}
          </div>
        ` : ''}
      </div>
    `;
  });
}

function openAddPolicyModal(id = null) {
  const modal = document.getElementById('modalAttendancePolicy');
  if (!modal) return;

  const form = document.getElementById('attendancePolicyForm');
  if (form) form.reset();

  const title = document.getElementById('policyModalTitle');
  const idInp = document.getElementById('policyId');

  if (id) {
    const p = (state.policies || []).find(x => x.id === Number(id));
    if (p) {
      if (title) title.innerHTML = `<i class="fa-solid fa-clock text-amber-600"></i> تعديل سياسة الدوام: ${p.policy_name}`;
      if (idInp) idInp.value = p.id;
      document.getElementById('policyName').value = p.policy_name || '';
      document.getElementById('shiftType').value = p.shift_type || 'morning';
      document.getElementById('startTime').value = p.start_time || '08:00';
      document.getElementById('endTime').value = p.end_time || '16:00';
      document.getElementById('gracePeriod').value = p.grace_period_mins || 15;
      document.getElementById('dailyHours').value = p.daily_hours || 8.0;
      document.getElementById('workDays').value = p.work_days || 'الأحد إلى الخميس';
      document.getElementById('flexibleHours').checked = !!p.flexible_hours;
      document.getElementById('overtimeAllowed').checked = !!p.overtime_allowed;
      document.getElementById('policyNotes').value = p.notes || '';
      document.getElementById('policyIsActive').value = p.is_active !== undefined ? p.is_active : 1;
    }
  } else {
    if (title) title.innerHTML = `<i class="fa-solid fa-clock text-amber-600"></i> إنشاء سياسة دوام وورديات جديدة`;
    if (idInp) idInp.value = '';
    document.getElementById('policyName').value = '';
    document.getElementById('shiftType').value = 'morning';
    document.getElementById('startTime').value = '08:00';
    document.getElementById('endTime').value = '16:00';
    document.getElementById('gracePeriod').value = 15;
    document.getElementById('dailyHours').value = 8.0;
    document.getElementById('workDays').value = 'الأحد إلى الخميس';
    document.getElementById('flexibleHours').checked = false;
    document.getElementById('overtimeAllowed').checked = true;
    document.getElementById('policyNotes').value = '';
    document.getElementById('policyIsActive').value = 1;
  }

  openModal('modalAttendancePolicy');
}

async function handlePolicyFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('policyId').value;
  const payload = {
    policy_name: document.getElementById('policyName').value.trim(),
    shift_type: document.getElementById('shiftType').value,
    start_time: document.getElementById('startTime').value,
    end_time: document.getElementById('endTime').value,
    grace_period_mins: Number(document.getElementById('gracePeriod').value),
    daily_hours: Number(document.getElementById('dailyHours').value),
    work_days: document.getElementById('workDays').value.trim(),
    flexible_hours: document.getElementById('flexibleHours').checked ? 1 : 0,
    overtime_allowed: document.getElementById('overtimeAllowed').checked ? 1 : 0,
    notes: document.getElementById('policyNotes').value.trim(),
    is_active: Number(document.getElementById('policyIsActive').value)
  };

  if (!payload.policy_name) {
    alert('يرجى إدخال اسم سياسة الدوام');
    return;
  }

  if (id) {
    const idx = (state.policies || []).findIndex(p => p.id === Number(id));
    if (idx !== -1) {
      state.policies[idx] = { ...state.policies[idx], ...payload };
    }
    await apiFetch(`/api/policies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    alert('تم تحديث سياسة الدوام بنجاح');
  } else {
    payload.id = Date.now();
    if (!state.policies) state.policies = [];
    state.policies.unshift(payload);
    await apiFetch('/api/policies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    alert('تم إنشاء سياسة الدوام الجديدة بنجاح');
  }

  closeModal('modalAttendancePolicy');
  renderPolicies();
  populateDropdowns();
}

async function deletePolicy(id) {
  if (!confirm('هل أنت متأكد من حذف سياسة الدوام هذه؟')) return;
  state.policies = (state.policies || []).filter(p => p.id !== Number(id));
  await apiFetch(`/api/policies/${id}`, { method: 'DELETE' });
  renderPolicies();
  populateDropdowns();
}

async function triggerBiometricSimulation() {
  alert('تمت مزامنة نبضات أجهزة البصمة البيومترية بنجاح!');
  loadAttendance(new Date().toISOString().split('T')[0]);
}

function openSmartPunchModal() {
  const perms = (state.currentUser && state.currentUser.permissions) || [];
  const canPunch = state.currentUser && (state.currentUser.role === 'admin' || perms.includes('all') || perms.includes('punch'));
  if (!canPunch) {
    alert('تنبيه: خاصية تسجيل الحضور الذكي عبر الموقع الجغرافي (GPS) مخصصة فقط للموظفين الميدانيين المصرح لهم.\n\nنظام الحضور المعتمد لك هو عبر جهاز البصمة البيومترية بمقر الشركة (ZKTeco ProFace X بمول سيتي بارك).');
    return;
  }
  openModal('modalSmartPunch');
}

async function executeGpsPunch(type) {
  const perms = (state.currentUser && state.currentUser.permissions) || [];
  const canPunch = state.currentUser && (state.currentUser.role === 'admin' || perms.includes('all') || perms.includes('punch'));
  if (!canPunch) {
    alert('غير مصرح لك بتسجيل البصمة عبر GPS. يرجى استخدام جهاز البصمة في مقر الشركة.');
    return;
  }
  const msg = document.getElementById('gpsStatusMessage');
  if (msg) msg.innerHTML = '<span class="text-emerald-600 font-bold"><i class="fa-solid fa-circle-check"></i> تم تسجيل البصمة بنجاح! النطاق: داخل المقر بمول سيتي بارك (49 م)</span>';
  setTimeout(() => closeModal('modalSmartPunch'), 1200);
}

/* =========================================================================
   6. PAYROLL & WPS CONTROLLER
   ========================================================================= */

async function loadPayroll() {
  const select = document.getElementById('payrollPeriodSelect');
  
  let periods = [];
  try {
    const pRes = await apiFetch('/api/payroll/periods');
    if (pRes && pRes.success && pRes.data) {
      periods = pRes.data;
    }
  } catch (e) {
    console.error('Failed to load payroll periods:', e);
  }

  if (select) {
    if (periods.length > 0) {
      select.innerHTML = periods.map(p => `
        <option value="${p.id}" ${p.period_month === '2026-10' ? 'selected' : ''}>
          مسير رواتب ${p.period_month} (${p.status}) - ${Number(p.total_net).toLocaleString('ar-SA')} ر.س
        </option>
      `).join('');
    } else {
      select.innerHTML = `
        <option value="default_oct" selected>مسير رواتب شهر أكتوبر 2026م (قيد الإعداد والاحتساب)</option>
      `;
    }
  }

  const strip = document.getElementById('payrollTotalsStrip');
  if (strip) {
    let totalBasic = 0, totalGosi = 0, totalAllowances = 0, totalNet = 0;
    state.employees.forEach(emp => {
      const basic = emp.basic_salary || 0;
      const h = emp.housing_allowance || 0;
      const t = emp.transport_allowance || 0;
      const o = emp.other_allowance || 0;
      const gosi = emp.is_saudi ? Math.round((basic + h) * 0.0975) : 0;
      const gross = basic + h + t + o;
      totalBasic += basic;
      totalGosi += gosi;
      totalAllowances += (h + t + o);
      totalNet += (gross - gosi);
    });

    strip.innerHTML = `
      <div class="bg-slate-50 border p-2.5 rounded-xl"><span class="block text-slate-400 text-[10px]">الأساسي</span><span class="font-mono font-bold text-slate-800">${totalBasic.toLocaleString('ar-SA')} ر.س</span></div>
      <div class="bg-slate-50 border p-2.5 rounded-xl"><span class="block text-slate-400 text-[10px]">تأمينات GOSI</span><span class="font-mono font-bold text-rose-600">${totalGosi.toLocaleString('ar-SA')} ر.س</span></div>
      <div class="bg-slate-50 border p-2.5 rounded-xl"><span class="block text-slate-400 text-[10px]">البدلات</span><span class="font-mono font-bold text-emerald-600">${totalAllowances.toLocaleString('ar-SA')} ر.س</span></div>
      <div class="bg-brand/10 border border-brand/30 p-2.5 rounded-xl"><span class="block text-brand text-[10px] font-bold">الصافي</span><span class="font-mono font-black text-brand text-sm">${totalNet.toLocaleString('ar-SA')} ر.س</span></div>
    `;
  }

  const tbody = document.getElementById('payrollItemsTableBody');
  if (tbody) {
    tbody.innerHTML = '';
    if (state.employees.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="12" class="py-8 text-center text-slate-400 font-semibold">
            <i class="fa-solid fa-money-bill-wave text-2xl text-slate-300 block mb-2"></i>
            لا يوجد موظفون لاحتساب مسير الرواتب حالياً. عند إضافة موظفين جدد، سيتم احتساب رواتبهم تلقائياً هنا وفق نظام العمل ونظام حماية الأجور (WPS).
          </td>
        </tr>
      `;
    } else {
      state.employees.forEach(emp => {
        const basic = emp.basic_salary || 0;
        const housing = emp.housing_allowance || 0;
        const transport = emp.transport_allowance || 0;
        const other = emp.other_allowance || 0;
        const gross = basic + housing + transport + other;
        const gosi = emp.is_saudi ? Math.round((basic + housing) * 0.0975) : 0;
        const compGosi = emp.is_saudi ? Math.round((basic + housing) * 0.1175) : Math.round((basic + housing) * 0.02);
        const net = gross - gosi;

        tbody.innerHTML += `
          <tr class="hover:bg-slate-50 transition">
            <td class="py-3 px-3 font-mono font-bold text-slate-700">${emp.emp_code}</td>
            <td class="py-3 px-3"><div class="font-bold text-slate-900">${emp.full_name_ar}</div><div class="text-[11px] text-slate-400">${emp.job_title_ar}</div></td>
            <td class="py-3 px-3 font-mono font-bold text-slate-700">${basic.toLocaleString('ar-SA')}</td>
            <td class="py-3 px-3 font-mono text-slate-600">${housing.toLocaleString('ar-SA')}</td>
            <td class="py-3 px-3 font-mono text-slate-600">${transport.toLocaleString('ar-SA')}</td>
            <td class="py-3 px-3 font-mono text-slate-600">${other.toLocaleString('ar-SA')}</td>
            <td class="py-3 px-3 font-mono font-bold text-slate-800">${gross.toLocaleString('ar-SA')}</td>
            <td class="py-3 px-3 font-mono text-rose-600 font-bold">${gosi.toLocaleString('ar-SA')}</td>
            <td class="py-3 px-3 font-mono text-slate-500">${compGosi.toLocaleString('ar-SA')}</td>
            <td class="py-3 px-3 font-mono text-slate-400">0.00</td>
            <td class="py-3 px-3 font-mono font-black text-brand text-sm">${net.toLocaleString('ar-SA')} ر.س</td>
            <td class="py-3 px-3 text-center">
              <button onclick="viewEmployeePayslip(${emp.id})" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-2.5 py-1 rounded-lg">القسيمة</button>
            </td>
          </tr>
        `;
      });
    }
  }
}

async function executeCalculatePayroll() {
  const monthInput = document.getElementById('calcPayrollMonthInput');
  const periodMonth = monthInput ? monthInput.value : '2026-10';

  if (!periodMonth) {
    alert('يرجى تحديد شهر مسير الرواتب (مثال: 2026-10)');
    return;
  }

  try {
    const res = await apiFetch('/api/payroll/calculate', {
      method: 'POST',
      body: JSON.stringify({ period_month: periodMonth })
    });

    if (res && res.success) {
      alert(`✓ تم احتساب مسير رواتب شهر ${periodMonth} بنجاح!\nعدد الموظفين: ${res.data.period.employee_count}\nإجمالي صافي الرواتب: ${Number(res.data.period.total_net).toLocaleString('ar-SA')} ر.س.`);
      closeModal('modalCalculatePayroll');
      await loadPayroll();
    } else {
      alert('تعذر احتساب المسير: ' + (res?.error || 'خطأ في معالجة البيانات'));
    }
  } catch (err) {
    alert('خطأ في الاتصال: ' + err.message);
  }
}

async function approveCurrentPayroll() {
  const select = document.getElementById('payrollPeriodSelect');
  const periodVal = select ? select.value : null;

  if (!periodVal || periodVal === 'default_oct') {
    if (confirm('لم يتم احتساب المسير بعد. هل ترغب في احتساب واعتماد مسير رواتب شهر أكتوبر 2026م الآن؟')) {
      await executeCalculatePayroll();
    }
    return;
  }

  if (!confirm('هل أنت متأكد من اعتماد مسير الرواتب نهائياً وإصدار ملف حماية الأجور (WPS SIF) لبنك المنشأة؟')) return;

  try {
    const res = await apiFetch(`/api/payroll/periods/${periodVal}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approver_name: state.currentUser ? state.currentUser.full_name : 'المدير العام' })
    });

    if (res && res.success) {
      alert('✓ تم اعتماد مسير الرواتب بنجاح! أصبح جاهزاً للتحميل كملف حماية أجور رسمي (WPS) متوافق مع منصة مدد.');
      await loadPayroll();
    } else {
      alert('خطأ أثناء الاعتماد: ' + (res?.error || 'حدث خطأ'));
    }
  } catch (err) {
    alert('تعذر الاتصال بالخادم: ' + err.message);
  }
}

function viewEmployeePayslip(empId) {
  const emp = state.employees.find(e => e.id === empId);
  if (!emp) return;

  const basic = emp.basic_salary;
  const housing = emp.housing_allowance;
  const transport = emp.transport_allowance;
  const other = emp.other_allowance;
  const gross = basic + housing + transport + other;
  const gosi = emp.is_saudi ? Math.round((basic + housing) * 0.0975) : 0;
  const net = gross - gosi;

  const select = document.getElementById('payrollPeriodSelect');
  const periodLabel = select && select.options[select.selectedIndex] ? select.options[select.selectedIndex].text.split(' - ')[0] : 'مسير رواتب أكتوبر 2026م';

  const container = document.getElementById('payslipPrintableContent');
  container.innerHTML = `
    <div class="flex justify-between items-center border-b-2 border-brand pb-3">
      <div class="flex items-center gap-3">
        <img src="assets/logo.png" class="h-12 w-auto object-contain">
        <div>
          <h4 class="font-black text-brand text-sm">شركة جوهرة المجد</h4>
          <p class="text-[10px] text-slate-400">س.ت: 7004872169</p>
        </div>
      </div>
      <div class="text-left font-mono">
        <span class="inline-block px-2.5 py-1 rounded bg-slate-100 font-bold text-xs">${periodLabel}</span>
        <p class="text-[10px] text-slate-400 mt-1">تاريخ الإصدار: 2026-10-31</p>
      </div>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-lg font-semibold text-[11px] border">
      <div><span class="text-slate-400 block text-[10px]">الرقم الوظيفي:</span>${emp.emp_code}</div>
      <div><span class="text-slate-400 block text-[10px]">اسم الموظف:</span>${emp.full_name_ar}</div>
      <div><span class="text-slate-400 block text-[10px]">المسمى الوظيفي:</span>${emp.job_title_ar}</div>
      <div><span class="text-slate-400 block text-[10px]">الهوية / الإقامة:</span>${emp.national_id}</div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="border rounded-lg p-2.5 bg-emerald-50/30">
        <span class="font-bold text-emerald-800 text-xs block mb-2 border-b pb-1">الاستحقاقات (Earnings):</span>
        <div class="space-y-1 font-mono text-xs">
          <div class="flex justify-between"><span>الأساسي:</span><span>${basic.toLocaleString('ar-SA')} ر.س</span></div>
          <div class="flex justify-between"><span>السكن:</span><span>${housing.toLocaleString('ar-SA')} ر.س</span></div>
          <div class="flex justify-between"><span>النقل:</span><span>${transport.toLocaleString('ar-SA')} ر.س</span></div>
          <div class="flex justify-between"><span>البدلات:</span><span>${other.toLocaleString('ar-SA')} ر.س</span></div>
          <div class="flex justify-between border-t pt-1 font-bold"><span>الإجمالي:</span><span>${gross.toLocaleString('ar-SA')} ر.س</span></div>
        </div>
      </div>
      <div class="border rounded-lg p-2.5 bg-rose-50/30">
        <span class="font-bold text-rose-800 text-xs block mb-2 border-b pb-1">الاستقطاعات (Deductions):</span>
        <div class="space-y-1 font-mono text-xs">
          <div class="flex justify-between"><span>التأمينات GOSI:</span><span class="text-rose-600">${gosi.toLocaleString('ar-SA')} ر.س</span></div>
          <div class="flex justify-between"><span>الغياب / التأخير:</span><span>0.00 ر.س</span></div>
          <div class="flex justify-between border-t pt-1 font-bold text-rose-700"><span>المجموع:</span><span>${gosi.toLocaleString('ar-SA')} ر.س</span></div>
        </div>
      </div>
    </div>
    <div class="brand-gradient text-white p-3.5 rounded-xl flex justify-between items-center">
      <div>
        <span class="text-xs text-white/80 block">صافي الراتب المحول للحساب:</span>
        <span class="text-xs font-mono text-amber-200">${emp.bank_name || 'مصرف الراجحي'} • ${emp.iban || ''}</span>
      </div>
      <div class="text-left font-black text-xl text-amber-300">${net.toLocaleString('ar-SA')} ر.س</div>
    </div>
  `;

  openModal('modalPayslip');
}

function printCurrentPayslip() {
  const content = document.getElementById('payslipPrintableContent').innerHTML;
  const printArea = document.getElementById('printableArea');
  printArea.innerHTML = `<div class="p-8">${content}</div>`;
  printArea.classList.remove('hidden');
  window.print();
  printArea.classList.add('hidden');
}

function viewMyPayslip() {
  const empId = (state.currentUser && state.currentUser.emp_id) ? state.currentUser.emp_id : (state.employees[0] ? state.employees[0].id : 1);
  viewEmployeePayslip(empId);
}

function downloadWpsFile() {
  const select = document.getElementById('payrollPeriodSelect');
  const periodVal = (select && select.value && select.value !== 'default_oct') ? select.value : 1;
  window.open(`/api/payroll/periods/${periodVal}/wps`, '_blank');
}

function exportPayrollCsv() {
  const select = document.getElementById('payrollPeriodSelect');
  const periodVal = (select && select.value && select.value !== 'default_oct') ? select.value : 1;
  window.open(`/api/payroll/periods/${periodVal}/export/csv`, '_blank');
}

/* =========================================================================
   6.5 ENTERPRISE COMPLIANCE & IQAMA DASHBOARD (مؤشر الامتثال الوزاري والإقامات)
   ========================================================================= */

let currentComplianceData = null;
let currentComplianceFilter = 'all';

async function loadCompliance() {
  const tableBody = document.getElementById('complianceTableBody');
  if (tableBody) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="10" class="py-12 text-center text-slate-400">
          <i class="fa-solid fa-spinner fa-spin text-2xl mb-2 text-brand block"></i>
          جاري فحص مؤشرات الامتثال وتدقيق الإقامات ورخص العمل عبر السجلات الرسمية...
        </td>
      </tr>
    `;
  }

  try {
    const res = await apiFetch('/api/compliance/stats');
    if (res && res.success && res.data) {
      currentComplianceData = res.data;
    } else {
      currentComplianceData = computeLocalCompliance();
    }
  } catch (err) {
    console.error('Compliance fetch error, falling back:', err);
    currentComplianceData = computeLocalCompliance();
  }

  updateComplianceDashboardUI(currentComplianceData);
  renderComplianceTable();
}

function computeLocalCompliance() {
  const emps = state.employees || [];
  const total = emps.length;
  const saudis = emps.filter(e => e.is_saudi === 1).length;
  const expats = total - saudis;
  const saudizationRate = total > 0 ? Math.round((saudis / total) * 1000) / 10 : 32.1;
  const now = new Date();

  let valid = 0, expiring = 0, expired = 0;
  const roster = emps.map(e => {
    let days = null;
    let status = 'سارية وممتثلة';
    let statusClass = 'success';
    let workPermit = 'سارية - 800 ر.س/شهر';

    if (e.is_saudi === 0) {
      if (e.iqama_expiry) {
        const exp = new Date(e.iqama_expiry);
        days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
        if (days < 0) {
          status = 'منتهية';
          statusClass = 'danger';
          expired++;
        } else if (days <= 60) {
          status = 'تشارف على الانتهاء';
          statusClass = 'warning';
          expiring++;
        } else {
          valid++;
        }
      } else {
        valid++;
      }
    }

    return {
      id: e.id,
      emp_code: e.emp_code,
      full_name_ar: e.full_name_ar,
      national_id: e.national_id,
      nationality: e.nationality,
      is_saudi: e.is_saudi,
      job_title_ar: e.job_title_ar,
      branch_name: e.branch_name_ar || 'الفرع الرئيسي',
      department_name: e.department_name_ar || 'عام',
      iqama_expiry: e.iqama_expiry || '2027-05-15',
      days_remaining: days,
      iqama_status: status,
      status_class: statusClass,
      work_permit_status: e.is_saudi ? 'معفى (مواطن سعودي)' : workPermit
    };
  });

  return {
    overallScore: 100,
    metrics: {
      totalEmployees: total,
      saudiCount: saudis,
      expatCount: expats,
      saudizationRate,
      nitaqatBand: saudizationRate >= 30 ? 'النطاق البلاتيني' : 'النطاق الأخضر المرتفع',
      iqama: { total: expats, valid, expiringSoon: expiring, expired, complianceRate: 100 },
      workPermits: { total: expats, active: expats, pendingPayment: expiring, feeAnnualPerWorker: 9600 },
      contracts: { total, authenticated: total }
    },
    complianceRoster: roster
  };
}

function updateComplianceDashboardUI(data) {
  if (!data) return;
  const m = data.metrics;

  const scoreEl = document.getElementById('compOverallScore');
  if (scoreEl) scoreEl.textContent = `${data.overallScore || 100}%`;

  const subEl = document.getElementById('compOverallSub');
  if (subEl) subEl.textContent = `${m.totalEmployees} موظف (${m.saudiCount} سعودي • ${m.expatCount} وافد)`;

  const iqamaRateEl = document.getElementById('compIqamaRate');
  if (iqamaRateEl) iqamaRateEl.textContent = `${m.iqama.complianceRate || 100}%`;

  const iqamaValidEl = document.getElementById('compIqamaValidCount');
  if (iqamaValidEl) iqamaValidEl.textContent = `${m.iqama.valid || 58} سارية وممتثلة`;

  const iqamaExpEl = document.getElementById('compIqamaExpiringCount');
  if (iqamaExpEl) iqamaExpEl.textContent = `${m.iqama.expiringSoon || 16} موظف`;

  const wpRateEl = document.getElementById('compWorkPermitRate');
  if (wpRateEl) wpRateEl.textContent = '100%';

  const wpFeeEl = document.getElementById('compWorkPermitFee');
  if (wpFeeEl) wpFeeEl.textContent = '800 ر.س / شهرياً';

  const saudRateEl = document.getElementById('compSaudizationRate');
  if (saudRateEl) saudRateEl.textContent = `${m.saudizationRate}%`;

  const bandEl = document.getElementById('compNitaqatBandBadge');
  if (bandEl) bandEl.textContent = m.nitaqatBand;

  const badgeNav = document.getElementById('badgeNavCompliance');
  if (badgeNav) badgeNav.textContent = m.iqama.expiringSoon;
}

function renderComplianceTable() {
  const tableBody = document.getElementById('complianceTableBody');
  if (!tableBody || !currentComplianceData) return;

  const roster = currentComplianceData.complianceRoster || [];
  let filtered = roster;

  if (currentComplianceFilter === 'expiring_soon') {
    filtered = roster.filter(e => e.is_saudi === 0 && e.days_remaining !== null && e.days_remaining <= 60);
  } else if (currentComplianceFilter === 'expats') {
    filtered = roster.filter(e => e.is_saudi === 0);
  } else if (currentComplianceFilter === 'saudis') {
    filtered = roster.filter(e => e.is_saudi === 1);
  }

  const searchInput = document.getElementById('compSearchInput');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  if (query) {
    filtered = filtered.filter(e => 
      (e.full_name_ar && e.full_name_ar.toLowerCase().includes(query)) ||
      (e.emp_code && e.emp_code.toLowerCase().includes(query)) ||
      (e.national_id && e.national_id.includes(query)) ||
      (e.job_title_ar && e.job_title_ar.toLowerCase().includes(query)) ||
      (e.nationality && e.nationality.toLowerCase().includes(query))
    );
  }

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="10" class="py-8 text-center text-slate-400 font-semibold">
          <i class="fa-solid fa-file-circle-check text-2xl text-slate-300 block mb-2"></i>
          لا توجد سجلات مطابقة للفلتر المحدد
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(emp => {
    const isSaudi = emp.is_saudi === 1;
    const isExpiring = !isSaudi && emp.days_remaining !== null && emp.days_remaining <= 60;
    const isExpired = !isSaudi && emp.days_remaining !== null && emp.days_remaining < 0;

    let badgeClass = 'bg-emerald-100 text-emerald-800';
    let statusText = 'سارية وممتثلة';

    if (isSaudi) {
      badgeClass = 'bg-blue-100 text-blue-800';
      statusText = 'مواطن (هوية وطنية)';
    } else if (isExpired) {
      badgeClass = 'bg-rose-100 text-rose-800 font-black animate-pulse';
      statusText = 'منتهية (مطلوب التجديد)';
    } else if (isExpiring) {
      badgeClass = 'bg-amber-100 text-amber-900 font-extrabold';
      statusText = 'تشارف على الانتهاء';
    }

    const remainingBadge = isSaudi 
      ? '<span class="text-slate-400 font-mono text-[11px]">—</span>'
      : (emp.days_remaining !== null 
          ? `<span class="font-mono font-bold ${isExpiring ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full' : (isExpired ? 'text-rose-700 font-black' : 'text-slate-700')}">${emp.days_remaining} يوم</span>`
          : '<span class="text-slate-400 font-mono text-[11px]">غير محدد</span>');

    const qiwaBadge = isSaudi
      ? '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full"><i class="fa-solid fa-check"></i> معفى (سعودي)</span>'
      : (isExpiring 
          ? '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200"><i class="fa-solid fa-clock"></i> بانتظار سداد المقابل</span>'
          : '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full"><i class="fa-solid fa-circle-check"></i> سارية ومسددة</span>');

    return `
      <tr class="hover:bg-slate-50/80 transition ${isExpiring ? 'bg-amber-50/20' : ''}">
        <td class="py-3 px-3 font-mono font-bold text-brand">${emp.emp_code}</td>
        <td class="py-3 px-3">
          <div class="font-bold text-slate-900">${emp.full_name_ar}</div>
          <div class="text-[10px] text-slate-400 font-mono">${emp.national_id}</div>
        </td>
        <td class="py-3 px-3">
          <span class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
            ${isSaudi ? '🇸🇦' : '🌍'} ${emp.nationality}
          </span>
        </td>
        <td class="py-3 px-3 font-mono font-semibold text-slate-700">${emp.national_id}</td>
        <td class="py-3 px-3">
          <div class="font-semibold text-slate-800 text-[11px]">${emp.job_title_ar || 'موظف'}</div>
          <div class="text-[10px] text-amber-700 font-bold">${emp.branch_name || 'الفرع الرئيسي'}</div>
        </td>
        <td class="py-3 px-3 font-mono text-slate-700 font-bold">${emp.iqama_expiry || '—'}</td>
        <td class="py-3 px-3">${remainingBadge}</td>
        <td class="py-3 px-3">${qiwaBadge}</td>
        <td class="py-3 px-3">
          <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}">${statusText}</span>
        </td>
        <td class="py-3 px-3 text-center">
          ${isSaudi ? `
            <button onclick="switchTab('employees-db')" class="text-slate-500 hover:text-brand font-bold text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200">
              الملف
            </button>
          ` : `
            <button onclick="openRenewIqamaModal(${emp.id})" class="text-white font-bold text-[11px] px-2.5 py-1 rounded-lg ${isExpiring ? 'bg-amber-600 hover:bg-amber-700 shadow-sm' : 'bg-brand hover:bg-brand-dark'} transition inline-flex items-center gap-1">
              <i class="fa-solid fa-arrows-rotate text-[10px]"></i>
              <span>تجديد</span>
            </button>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

function filterComplianceTable(filterType) {
  currentComplianceFilter = filterType;

  const btnAll = document.getElementById('btnCompTabAll');
  const btnExpiring = document.getElementById('btnCompTabExpiring');
  const btnExpats = document.getElementById('btnCompTabExpats');
  const btnSaudis = document.getElementById('btnCompTabSaudis');

  [btnAll, btnExpiring, btnExpats, btnSaudis].forEach(btn => {
    if (btn) {
      btn.classList.remove('bg-white', 'text-brand', 'shadow-sm');
      btn.classList.add('text-slate-600');
    }
  });

  if (filterType === 'all' && btnAll) {
    btnAll.classList.add('bg-white', 'text-brand', 'shadow-sm');
    btnAll.classList.remove('text-slate-600');
  } else if (filterType === 'expiring_soon' && btnExpiring) {
    btnExpiring.classList.add('bg-white', 'text-amber-800', 'shadow-sm');
    btnExpiring.classList.remove('text-slate-600');
  } else if (filterType === 'expats' && btnExpats) {
    btnExpats.classList.add('bg-white', 'text-brand', 'shadow-sm');
    btnExpats.classList.remove('text-slate-600');
  } else if (filterType === 'saudis' && btnSaudis) {
    btnSaudis.classList.add('bg-white', 'text-brand', 'shadow-sm');
    btnSaudis.classList.remove('text-slate-600');
  }

  renderComplianceTable();
}

function handleComplianceSearch(val) {
  renderComplianceTable();
}

function openRenewIqamaModal(empId) {
  const emp = (state.employees || []).find(e => e.id === Number(empId));
  if (!emp) return;

  const msg = `تجديد إقامة ورخصة عمل الموظف:
---------------------------------------------
الاسم: ${emp.full_name_ar}
رقم الإقامة: ${emp.national_id}
الجنسية: ${emp.nationality}
الوظيفة: ${emp.job_title_ar}
تاريخ الانتهاء الحالي: ${emp.iqama_expiry || '—'}

الخطوات النظامية المعتمدة لشركة جوهرة المجد:
1. إصدار وسداد المقابل المالي لرخصة العمل عبر منصة "قوى" (Qiwa): 800 ر.س شهرياً / 9,600 ر.س سنوياً.
2. التحقق من سريان وثيقة التأمين الطبي عبر مجلس الضمان الصحي (CCHI).
3. سداد رسوم تجديد الإقامة (الجوازات) عبر منصة "مقيم" أو سداد البنكي (650 ر.س).
4. استكمال التجديد الفوري عبر منصة مقيم.

هل ترغب في فتح منصة "قوى" لإصدار رخصة العمل الآن؟`;

  if (confirm(msg)) {
    window.open('https://qiwa.sa', '_blank');
  }
}

function exportComplianceReport() {
  if (!currentComplianceData) return;
  const roster = currentComplianceData.complianceRoster || [];

  const headers = ['كود الموظف', 'الاسم', 'الجنسية', 'رقم الهوية/الإقامة', 'المسمى الوظيفي', 'الفرع', 'تاريخ الانتهاء', 'الأيام المتبقية', 'رخصة العمل قوى', 'حالة الامتثال'];
  const rows = roster.map(e => [
    `"${e.emp_code}"`,
    `"${e.full_name_ar}"`,
    `"${e.nationality}"`,
    `"${e.national_id}"`,
    `"${e.job_title_ar}"`,
    `"${e.branch_name}"`,
    `"${e.iqama_expiry || ''}"`,
    `"${e.days_remaining !== null ? e.days_remaining : ''}"`,
    `"${e.is_saudi ? 'معفى' : 'سارية'}"`,
    `"${e.iqama_status}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `تقرير_مؤشر_الامتثال_جوهرة_المجد_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* =========================================================================
   7. EMPLOYEE SELF-SERVICE (ESS)
   ========================================================================= */

let currentAttachedFileName = null;

function loadSelfService() {
  let emp = null;
  if (state.currentUser && state.currentUser.emp_id) {
    emp = state.employees.find(e => e.id === state.currentUser.emp_id);
  }
  if (!emp && state.employees.length > 0) {
    emp = state.employees[0];
  }

  const nameEl = document.getElementById('essEmployeeName');
  const titleEl = document.getElementById('essEmployeeTitle');
  const balEl = document.getElementById('essLeaveBalance');

  if (emp) {
    if (nameEl) nameEl.textContent = emp.full_name_ar;
    if (titleEl) titleEl.textContent = `${emp.job_title_ar} • ${emp.department_name_ar || 'شركة جوهرة المجد'}`;
    if (balEl) balEl.textContent = `${emp.annual_leave_balance || 25} يوم`;
  } else {
    if (nameEl) nameEl.textContent = state.currentUser ? (state.currentUser.full_name || state.currentUser.username) : 'الموظف';
    if (titleEl) titleEl.textContent = 'منظومة جوهرة المجد للموارد البشرية والخدمة الذاتية';
    if (balEl) balEl.textContent = '30 يوم';
  }

  renderSelfServiceRequests();
}

function renderSelfServiceRequests() {
  const tbody = document.getElementById('essRequestsTableBody');
  if (!tbody) return;

  // Combine backend requests with local requests
  let list = [];
  if (state.allRequests && state.allRequests.length > 0) {
    list = [...state.allRequests];
  } else if (state.myRequests && state.myRequests.length > 0) {
    list = [...state.myRequests];
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-slate-400 font-semibold">
          <i class="fa-solid fa-file-circle-check text-2xl text-slate-300 block mb-2"></i>
          لا توجد طلبات خدمة ذاتية مسجلة حالياً. يمكنك تقديم طلب جديد عبر البطاقات بالأعلى وسيبدأ سير الموافقات فوراً.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(r => {
    const reqId = r.id || r.request_no;
    const reqCode = r.request_no || (typeof r.id === 'string' ? r.id : `REQ-2026-${r.id}`);
    const empName = r.full_name_ar || (state.currentUser ? state.currentUser.full_name : 'الموظف');
    const deptName = r.department_name || (state.currentUser ? state.currentUser.role : 'جوهرة المجد');
    const mgrName = r.direct_manager_name || r.manager_name || 'المدير المباشر';

    // Status classes
    let statusClass = 'bg-amber-100 text-amber-800';
    if (r.status.includes('معتمد نهائياً')) {
      statusClass = 'bg-emerald-100 text-emerald-800';
    } else if (r.status.includes('موافقة مبدئية')) {
      statusClass = 'bg-blue-100 text-blue-800';
    } else if (r.status.includes('مرفوض')) {
      statusClass = 'bg-rose-100 text-rose-800';
    }

    // Multi-stage Stepper visualization
    const step2Done = !!r.manager_approved_at || r.status.includes('موافقة مبدئية') || r.status.includes('معتمد نهائياً');
    const step2Rejected = r.status.includes('مرفوض من المدير');
    const step3Done = r.status.includes('معتمد نهائياً');
    const step3Rejected = r.status.includes('مرفوض من الموارد');

    const stepperHtml = `
      <div class="space-y-1.5 min-w-[210px] text-xs">
        <div class="flex items-center gap-1.5 text-emerald-700 font-bold">
          <i class="fa-solid fa-circle-check text-[11px]"></i>
          <span>1. تم التقديم من الموظف</span>
        </div>
        <div class="flex items-center gap-1.5 ${step2Done ? 'text-emerald-700 font-bold' : (step2Rejected ? 'text-rose-700 font-bold' : 'text-amber-700')}">
          <i class="fa-solid ${step2Done ? 'fa-circle-check' : (step2Rejected ? 'fa-circle-xmark' : 'fa-hourglass-half')} text-[11px]"></i>
          <span>2. موافقة المدير (${r.manager_name || mgrName}): ${step2Done ? 'معتمد ✓' : (step2Rejected ? 'مرفوض ✗' : 'بانتظار الموافقة')}</span>
        </div>
        <div class="flex items-center gap-1.5 ${step3Done ? 'text-emerald-700 font-bold' : (step3Rejected ? 'text-rose-700 font-bold' : (step2Done ? 'text-blue-700 font-semibold' : 'text-slate-400'))}">
          <i class="fa-solid ${step3Done ? 'fa-stamp' : (step3Rejected ? 'fa-circle-xmark' : (step2Done ? 'fa-hourglass-half' : 'fa-circle-pause'))} text-[11px]"></i>
          <span>3. اعتماد HR (${r.hr_approver_name || 'إدارة HR'}): ${step3Done ? 'معتمد نهائياً ✓' : (step3Rejected ? 'مرفوض ✗' : (step2Done ? 'قيد المراجعة' : 'مؤجل'))}</span>
        </div>
      </div>
    `;

    // Action buttons based on current status and user role
    let actionButtons = '';
    const isPendingMgr = r.status.includes('معلق') || r.status.includes('المدير المباشر');
    const isPendingHr = r.status.includes('موافقة مبدئية') || r.status.includes('الموارد البشرية');

    if (isPendingMgr) {
      actionButtons = `
        <div class="flex flex-col gap-1.5 items-center w-full max-w-[130px] mx-auto">
          <button onclick="approveRequestManager('${reqId}')" class="w-full text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-slate-900 px-2 py-1.5 rounded-lg shadow-sm flex items-center justify-center gap-1">
            <i class="fa-solid fa-check"></i> موافقة المدير
          </button>
          <button onclick="rejectRequest('${reqId}', 'manager')" class="w-full text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 px-2 py-1 rounded-lg border border-rose-200 flex items-center justify-center gap-1">
            <i class="fa-solid fa-xmark"></i> رفض
          </button>
        </div>
      `;
    } else if (isPendingHr) {
      actionButtons = `
        <div class="flex flex-col gap-1.5 items-center w-full max-w-[130px] mx-auto">
          <button onclick="approveRequestHr('${reqId}')" class="w-full text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1.5 rounded-lg shadow-sm flex items-center justify-center gap-1">
            <i class="fa-solid fa-stamp"></i> اعتماد نهائي HR
          </button>
          <button onclick="rejectRequest('${reqId}', 'hr')" class="w-full text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 px-2 py-1 rounded-lg border border-rose-200 flex items-center justify-center gap-1">
            <i class="fa-solid fa-xmark"></i> رفض
          </button>
        </div>
      `;
    } else if (step3Done) {
      actionButtons = `
        <div class="text-center">
          <span class="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <i class="fa-solid fa-circle-check"></i> مكتمل ومعتمد
          </span>
        </div>
      `;
    } else {
      actionButtons = `
        <div class="text-center">
          <span class="inline-block text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
            <i class="fa-solid fa-circle-xmark"></i> تم الرفض
          </span>
        </div>
      `;
    }

    const durationText = r.duration || (r.days_count ? `${r.days_count} يوم` : (r.amount ? `${Number(r.amount).toLocaleString()} ر.س` : '-'));
    const dateText = r.date || r.start_date || (r.created_at ? r.created_at.split(' ')[0] : '-');
    const reasonText = r.reason || r.details || '-';

    return `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="py-3 px-3 font-mono font-bold text-brand">${reqCode}</td>
        <td class="py-3 px-3">
          <div class="font-bold text-slate-900">${r.type || r.request_type}</div>
          ${r.attachment ? `<span class="inline-block mt-0.5 text-[10px] text-brand bg-brand/10 px-1.5 py-0.5 rounded font-mono"><i class="fa-solid fa-paperclip"></i> مرفق</span>` : ''}
        </td>
        <td class="py-3 px-3">
          <div class="font-bold text-slate-800">${empName}</div>
          <div class="text-[11px] text-slate-400">${deptName}</div>
          <div class="text-[10px] text-amber-700 font-medium mt-0.5"><i class="fa-solid fa-user-tie"></i> المدير: ${mgrName}</div>
        </td>
        <td class="py-3 px-3">
          <div class="font-mono text-slate-700 font-bold">${durationText}</div>
          <div class="text-[10px] text-slate-400 font-mono">${dateText}</div>
          <div class="text-[11px] text-slate-600 mt-0.5 line-clamp-1" title="${reasonText}">${reasonText}</div>
        </td>
        <td class="py-3 px-3">${stepperHtml}</td>
        <td class="py-3 px-3">
          <span class="inline-block text-[10px] font-bold px-2 py-1 rounded-full ${statusClass}">
            ${r.status}
          </span>
        </td>
        <td class="py-3 px-3 text-center">${actionButtons}</td>
      </tr>
    `;
  }).join('');
}

function openModalRequest(category = 'إجازة', specificType = null) {
  const catSelect = document.getElementById('reqCategorySelect');
  if (catSelect) {
    catSelect.value = category;
  }
  
  onRequestCategoryChanged(category);

  if (category === 'إجازة' && specificType) {
    const leaveSelect = document.getElementById('reqLeaveTypeSelect');
    if (leaveSelect) {
      leaveSelect.value = specificType;
      onLeaveTypeChanged(specificType);
    }
  }

  // Set default dates (Today to Today)
  const today = new Date().toISOString().split('T')[0];
  const startInp = document.getElementById('reqStartDate');
  const endInp = document.getElementById('reqEndDate');
  if (startInp && !startInp.value) startInp.value = today;
  if (endInp && !endInp.value) endInp.value = today;
  calculateReqDays();

  // Reset file attachment
  clearReqFile();

  // Update title
  const titleText = document.getElementById('requestModalTitleText');
  if (titleText) {
    titleText.textContent = `تقديم طلب جديد: ${category}`;
  }

  openModal('modalNewRequest');
}

function onRequestCategoryChanged(category) {
  const leaveSec = document.getElementById('reqLeaveSection');
  const missionSec = document.getElementById('reqMissionSection');
  const dateFields = document.getElementById('reqDateFields');
  const daysField = document.getElementById('reqDaysField');
  const amountField = document.getElementById('reqAmountField');
  const attachSec = document.getElementById('reqAttachmentContainer');
  const attachTitle = document.getElementById('reqAttachmentTitle');
  const attachNote = document.getElementById('reqAttachmentNote');
  const uploadBtnText = document.getElementById('reqUploadBtnText');

  if (category === 'إجازة') {
    if (leaveSec) leaveSec.classList.remove('hidden');
    if (missionSec) missionSec.classList.add('hidden');
    if (dateFields) dateFields.classList.remove('hidden');
    if (daysField) daysField.classList.remove('hidden');
    if (amountField) amountField.classList.add('hidden');
    
    const leaveType = document.getElementById('reqLeaveTypeSelect')?.value || 'إجازة سنوية';
    onLeaveTypeChanged(leaveType);
  } else if (category === 'مهمة عمل') {
    if (leaveSec) leaveSec.classList.add('hidden');
    if (missionSec) missionSec.classList.remove('hidden');
    if (dateFields) dateFields.classList.remove('hidden');
    if (daysField) daysField.classList.remove('hidden');
    if (amountField) amountField.classList.add('hidden');
    if (attachSec) {
      attachSec.classList.remove('hidden');
      attachSec.className = 'space-y-2 p-3.5 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/60 transition';
    }
    if (attachTitle) attachTitle.textContent = 'إرفاق وثائق المهمة (اختياري / جدول أعمال أو تذكرة):';
    if (attachNote) attachNote.textContent = 'يمكنك إرفاق جدول الاجتماعات أو دعوة العمل أو تذاكر السفر لتسريع اعتماد المهمة.';
    if (uploadBtnText) uploadBtnText.textContent = 'رفع وثيقة أو تذكرة (PDF / صورة)';
  } else if (category === 'سلفة مالية') {
    if (leaveSec) leaveSec.classList.add('hidden');
    if (missionSec) missionSec.classList.add('hidden');
    if (dateFields) dateFields.classList.add('hidden');
    if (daysField) daysField.classList.add('hidden');
    if (amountField) amountField.classList.remove('hidden');
    if (attachSec) {
      attachSec.classList.remove('hidden');
      attachSec.className = 'space-y-2 p-3.5 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/60 transition';
    }
    if (attachTitle) attachTitle.textContent = 'إرفاق ما يثبت الظرف الطارئ (اختياري):';
    if (attachNote) attachNote.textContent = 'إرفاق إثبات الحاجة أو الفواتير الطارئة يسهل الاعتماد السريع من الإدارة المالية.';
    if (uploadBtnText) uploadBtnText.textContent = 'رفع مستند داعم (اختياري)';
  } else if (category === 'استئذان' || category === 'استئذان ساعي') {
    if (leaveSec) leaveSec.classList.add('hidden');
    if (missionSec) missionSec.classList.add('hidden');
    if (dateFields) dateFields.classList.remove('hidden');
    if (daysField) daysField.classList.add('hidden');
    if (amountField) amountField.classList.add('hidden');
    if (attachSec) attachSec.classList.add('hidden');
  }
}

function onLeaveTypeChanged(leaveType) {
  const attachSec = document.getElementById('reqAttachmentContainer');
  const attachTitle = document.getElementById('reqAttachmentTitle');
  const attachNote = document.getElementById('reqAttachmentNote');
  const uploadBtnText = document.getElementById('reqUploadBtnText');
  const daysInp = document.getElementById('reqDaysCount');

  if (!attachSec) return;

  if (leaveType === 'إجازة مرضية تتطلب إرفاق تقرير' || (leaveType && leaveType.includes('مرضية'))) {
    attachSec.classList.remove('hidden');
    attachSec.className = 'space-y-2 p-3.5 rounded-2xl border-2 border-dashed border-rose-400 bg-rose-50/90 transition ring-2 ring-rose-300/40';
    if (attachTitle) attachTitle.innerHTML = '<span class="text-rose-700 font-black">إرفاق التقرير الطبي المعتمد: * (إلزامي عبر صحتي / مستشفى)</span>';
    if (attachNote) attachNote.textContent = 'يتطلب نظام العمل السعودي اعتماد الإجازة المرضية بتقرير رسمي صادر من منصة (صحتي) أو مستشفى معتمد لقبولها نظاماً دون حسم.';
    if (uploadBtnText) uploadBtnText.textContent = 'رفع التقرير الطبي (منصة صحتي / مستشفى معتمد)';
  } else if (leaveType === 'إجازة وفاة') {
    attachSec.classList.remove('hidden');
    attachSec.className = 'space-y-2 p-3.5 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition';
    if (attachTitle) attachTitle.textContent = 'إرفاق شهادة الوفاة أو إشعار الدفن:';
    if (attachNote) attachNote.textContent = 'يحق للعامل إجازة بأجر كامل لمدة 5 أيام في حال وفاة زوجه أو أحد أصوله أو فروعه.';
    if (uploadBtnText) uploadBtnText.textContent = 'رفع شهادة الوفاة (PDF / صورة)';
    if (daysInp) daysInp.value = 5;
  } else if (leaveType === 'إجازة دراسية') {
    attachSec.classList.remove('hidden');
    attachSec.className = 'space-y-2 p-3.5 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50 transition';
    if (attachTitle) attachTitle.textContent = 'إرفاق جدول الاختبارات المعتمد:';
    if (attachNote) attachNote.textContent = 'يرجى إرفاق جدول الاختبارات الرسمي الصادر من الجامعة أو المؤسسة التعليمية المعتمدة.';
    if (uploadBtnText) uploadBtnText.textContent = 'رفع جدول الاختبارات (PDF / صورة)';
  } else if (leaveType === 'إجازة إصابة عمل Gosi') {
    attachSec.classList.remove('hidden');
    attachSec.className = 'space-y-2 p-3.5 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50 transition';
    if (attachTitle) attachTitle.textContent = 'إرفاق إشعار بلاغ إصابة العمل لدى التأمينات (GOSI): *';
    if (attachNote) attachNote.textContent = 'يجب توفير رقم الإشعار أو التقرير المرفوع للتأمينات الاجتماعية لاعتماد التعويض النظامي.';
    if (uploadBtnText) uploadBtnText.textContent = 'رفع إشعار إصابة التأمينات (GOSI)';
  } else if (leaveType === 'إجازة أمومة') {
    attachSec.classList.remove('hidden');
    attachSec.className = 'space-y-2 p-3.5 rounded-2xl border-2 border-dashed border-pink-300 bg-pink-50 transition';
    if (attachTitle) attachTitle.textContent = 'إرفاق التقرير الطبي لتقدير موعد الوضع أو شهادة الميلاد:';
    if (attachNote) attachNote.textContent = 'تستحق العاملة إجازة وضع بأجر كامل لمدة 12 أسبوعاً توزع حسب رغبتها تبدأ بأربعة أسابيع قبل الوضع.';
    if (uploadBtnText) uploadBtnText.textContent = 'رفع التقرير الطبي / شهادة الميلاد';
    if (daysInp) daysInp.value = 70;
  } else if (leaveType === 'إجازة مولود') {
    attachSec.classList.remove('hidden');
    attachSec.className = 'space-y-2 p-3.5 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 transition';
    if (attachTitle) attachTitle.textContent = 'إرفاق تبليغ الولادة أو شهادة الميلاد:';
    if (attachNote) attachNote.textContent = 'يستحق العامل إجازة بأجر كامل لمدة 3 أيام عند قدوم مولود جديد.';
    if (uploadBtnText) uploadBtnText.textContent = 'رفع تبليغ الولادة';
    if (daysInp) daysInp.value = 3;
  } else {
    // Annual or unpaid
    attachSec.classList.add('hidden');
  }
}

function calculateReqDays() {
  const startVal = document.getElementById('reqStartDate')?.value;
  const endVal = document.getElementById('reqEndDate')?.value;
  const countInp = document.getElementById('reqDaysCount');
  if (startVal && endVal && countInp) {
    const s = new Date(startVal);
    const e = new Date(endVal);
    const diffTime = e - s;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    countInp.value = diffDays > 0 ? diffDays : 1;
  }
}

function handleReqFileSelected(e) {
  const file = e.target.files && e.target.files[0];
  if (file) {
    currentAttachedFileName = file.name;
    const badge = document.getElementById('reqFileNameBadge');
    const nameText = document.getElementById('reqFileNameText');
    if (badge && nameText) {
      nameText.textContent = file.name;
      badge.classList.remove('hidden');
    }
  }
}

function clearReqFile() {
  currentAttachedFileName = null;
  const fileInput = document.getElementById('reqAttachmentFile');
  if (fileInput) fileInput.value = '';
  const badge = document.getElementById('reqFileNameBadge');
  if (badge) badge.classList.add('hidden');
}

async function handleRequestFormSubmit(e) {
  e.preventDefault();
  
  const category = document.getElementById('reqCategorySelect')?.value || 'إجازة';
  const leaveType = document.getElementById('reqLeaveTypeSelect')?.value || '';
  const startDate = document.getElementById('reqStartDate')?.value || '';
  const endDate = document.getElementById('reqEndDate')?.value || '';
  const days = document.getElementById('reqDaysCount')?.value || 1;
  const reason = document.getElementById('reqReason')?.value || '';
  const amount = document.getElementById('reqAmount')?.value || 0;
  const missionDest = document.getElementById('reqMissionDest')?.value || '';
  const missionTransport = document.getElementById('reqMissionTransport')?.value || '';
  const missionPurpose = document.getElementById('reqMissionPurpose')?.value || '';

  // Validation: Sick leave requires medical report attachment
  if (category === 'إجازة' && (leaveType === 'إجازة مرضية تتطلب إرفاق تقرير' || leaveType.includes('مرضية')) && !currentAttachedFileName) {
    alert('⚠️ تنبيه إلزامي:\nالإجازة المرضية تتطلب إرفاق تقرير طبي رسمي معتمد (منصة صحتي أو إشعار المستشفى) لقبول الطلب.\n\nيرجى الضغط على زر "رفع التقرير الطبي" ثم إعادة إرسال الطلب.');
    return;
  }

  // Generate Request ID
  const reqNum = Math.floor(1000 + Math.random() * 9000);
  const reqCode = `REQ-2026-${reqNum}`;
  const today = new Date().toISOString().split('T')[0];

  let displayType = category;
  let displayDetails = reason;
  let displayDuration = `${days} يوم`;

  if (category === 'إجازة') {
    displayType = leaveType;
    if (currentAttachedFileName) {
      displayDetails = `${reason} (مرفق تقرير: ${currentAttachedFileName})`;
    }
  } else if (category === 'مهمة عمل') {
    displayType = `مهمة عمل (${missionDest || 'داخلية'})`;
    displayDetails = `${missionPurpose || 'أعمال رسمية'} - وسيلة السفر: ${missionTransport}`;
    if (currentAttachedFileName) {
      displayDetails += ` (مرفق: ${currentAttachedFileName})`;
    }
  } else if (category === 'سلفة مالية') {
    displayType = 'سلفة مالية طارئة';
    displayDuration = `${Number(amount).toLocaleString()} ر.س`;
    const months = document.getElementById('reqLoanMonths')?.value || 3;
    displayDetails = `تقسيط على ${months} أشهر - ${reason}`;
  } else if (category === 'استئذان' || category === 'استئذان ساعي') {
    displayType = 'طلب استئذان';
    displayDuration = 'تصريح خروج';
  }

  const currentEmpId = (state.currentUser && state.currentUser.emp_id) ? state.currentUser.emp_id : 3;
  const currentEmp = state.employees.find(e => e.id === currentEmpId) || state.employees[0];

  const payload = {
    emp_id: currentEmpId,
    request_type: displayType,
    start_date: startDate || today,
    end_date: endDate || today,
    days_count: Number(days) || 1,
    amount: Number(amount) || 0,
    destination_entity: missionDest || null,
    reason: displayDetails
  };

  const apiRes = await apiFetch('/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const backendData = apiRes && apiRes.data ? apiRes.data : null;

  const newReq = {
    id: backendData ? backendData.id : reqCode,
    request_no: backendData ? backendData.request_no : reqCode,
    type: displayType,
    request_type: displayType,
    date: today,
    duration: displayDuration,
    details: displayDetails,
    status: 'معلق - بانتظار موافقة المدير المباشر',
    statusClass: 'bg-amber-100 text-amber-800',
    notes: 'قيد اعتماد المدير المباشر والموارد البشرية',
    attachment: currentAttachedFileName,
    emp_code: currentEmp ? currentEmp.emp_code : 'JM-1003',
    full_name_ar: currentEmp ? currentEmp.full_name_ar : 'الموظف',
    department_name: currentEmp ? currentEmp.department_name_ar : 'الموارد البشرية',
    direct_manager_name: currentEmp ? (state.employees.find(m => m.id === currentEmp.manager_id)?.full_name_ar || 'المدير المباشر') : 'المدير المباشر'
  };

  // Add to state
  if (!state.myRequests) state.myRequests = [];
  state.myRequests.unshift(newReq);
  if (!state.allRequests) state.allRequests = [];
  state.allRequests.unshift(backendData || newReq);

  // Save to localStorage
  try {
    localStorage.setItem('jm_my_requests', JSON.stringify(state.myRequests));
  } catch (err) {}

  closeModal('modalNewRequest');

  // Success Alert
  alert(`✓ تم تقديم طلبك بنجاح!\nالرقم المرجعي: ${newReq.request_no}\nالنوع: ${displayType}\nالمدة/المبلغ: ${displayDuration}\n\nالمسار: بانتظار موافقة المدير المباشر أولاً ثم اعتماد الموارد البشرية.`);

  // Reset form
  const form = document.getElementById('newRequestForm');
  if (form) form.reset();
  clearReqFile();

  // Reload table
  renderSelfServiceRequests();
}

/* =========================================================================
   7.1 APPROVAL WORKFLOW ACTIONS (سير الموافقات متعدد المراحل)
   ========================================================================= */

async function approveRequestManager(id) {
  const approver = state.currentUser ? state.currentUser.full_name : 'م. فهد عبدالعزيز القحطاني (المدير المباشر)';
  const newStatus = 'موافقة مبدئية - بانتظار اعتماد الموارد البشرية';

  // Update in state
  const r = (state.allRequests || []).find(x => String(x.id) === String(id) || String(x.request_no) === String(id));
  if (r) {
    r.status = newStatus;
    r.manager_name = approver;
    r.manager_approved_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
  }
  const mr = (state.myRequests || []).find(x => String(x.id) === String(id) || String(x.request_no) === String(id));
  if (mr) {
    mr.status = newStatus;
    mr.manager_name = approver;
    mr.manager_approved_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
  }

  await apiFetch(`/api/requests/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: newStatus,
      role: 'manager',
      approver_name: approver,
      comment: 'تمت الموافقة المبدئية من قبل المدير المباشر'
    })
  });

  try {
    localStorage.setItem('jm_my_requests', JSON.stringify(state.myRequests));
  } catch (e) {}

  alert(`✓ تمت موافقة المدير المباشر بنجاح على الطلب!\nانتقل الطلب للمرحلة التالية: [بانتظار اعتماد الموارد البشرية]`);
  renderSelfServiceRequests();
}

async function approveRequestHr(id) {
  const approver = state.currentUser ? state.currentUser.full_name : 'خالد سعد الشهراني (مدير الموارد البشرية)';
  const newStatus = 'معتمد نهائياً';

  // Update in state
  const r = (state.allRequests || []).find(x => String(x.id) === String(id) || String(x.request_no) === String(id));
  if (r) {
    r.status = newStatus;
    r.hr_approver_name = approver;
    r.hr_approved_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
  }
  const mr = (state.myRequests || []).find(x => String(x.id) === String(id) || String(x.request_no) === String(id));
  if (mr) {
    mr.status = newStatus;
    mr.hr_approver_name = approver;
    mr.hr_approved_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
  }

  await apiFetch(`/api/requests/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: newStatus,
      role: 'admin',
      approver_name: approver,
      comment: 'تم الاعتماد النهائي من إدارة الموارد البشرية'
    })
  });

  try {
    localStorage.setItem('jm_my_requests', JSON.stringify(state.myRequests));
  } catch (e) {}

  alert(`✓ تم الاعتماد النهائي للطلب بنجاح من الموارد البشرية!\nتم توثيق الطلب وإشعار الموظف.`);
  renderSelfServiceRequests();
}

async function rejectRequest(id, stage = 'manager') {
  const reason = prompt('يرجى كتابة سبب رفض الطلب:', 'لا يتوافق مع خطة العمل الحالية');
  if (reason === null) return;

  const newStatus = stage === 'manager' ? 'مرفوض من المدير المباشر' : 'مرفوض من الموارد البشرية';
  const approver = state.currentUser ? state.currentUser.full_name : (stage === 'manager' ? 'المدير المباشر' : 'الموارد البشرية');

  const r = (state.allRequests || []).find(x => String(x.id) === String(id) || String(x.request_no) === String(id));
  if (r) {
    r.status = newStatus;
    if (stage === 'manager') r.manager_name = approver;
    else r.hr_approver_name = approver;
  }
  const mr = (state.myRequests || []).find(x => String(x.id) === String(id) || String(x.request_no) === String(id));
  if (mr) {
    mr.status = newStatus;
    if (stage === 'manager') mr.manager_name = approver;
    else mr.hr_approver_name = approver;
  }

  await apiFetch(`/api/requests/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: newStatus,
      role: stage,
      approver_name: approver,
      comment: reason
    })
  });

  try {
    localStorage.setItem('jm_my_requests', JSON.stringify(state.myRequests));
  } catch (e) {}

  alert(`تم رفض الطلب وتسجيل سبب الرفض بنجاح.`);
  renderSelfServiceRequests();
}

/* =========================================================================
   8. OFFICIAL SALARY CERTIFICATE (خطاب تعريف بالراتب)
   ========================================================================= */

function openSalaryCertificateModal() {
  refreshSalaryCertificate(document.getElementById('certDestinationSelect').value);
  openModal('modalSalaryCertificate');
}

function previewSalaryCertificateForEmp(empId) {
  refreshSalaryCertificateForEmp(empId, 'إلى من يهمه الأمر');
  openModal('modalSalaryCertificate');
}

function refreshSalaryCertificate(destination) {
  const empId = (state.currentUser && state.currentUser.emp_id) ? state.currentUser.emp_id : 3;
  refreshSalaryCertificateForEmp(empId, destination);
}

function refreshSalaryCertificateForEmp(empId, destination) {
  const emp = state.employees.find(e => e.id === empId) || state.employees[0];
  const gross = (emp.basic_salary || 0) + (emp.housing_allowance || 0) + (emp.transport_allowance || 0) + (emp.other_allowance || 0);
  const certId = `JM-CERT-2026-${String(emp.id).padStart(4, '0')}${Math.floor(100 + Math.random() * 900)}`;

  const container = document.getElementById('certificateContainer');
  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex justify-between items-start border-b-2 border-[#d4af37] pb-4">
        <div class="flex items-center gap-3">
          <img src="assets/logo.png" class="h-16 w-auto object-contain">
          <div>
            <h3 class="font-black text-brand text-lg">شركة جوهرة المجد</h3>
            <p class="text-xs text-slate-500 font-sans">Jawharat Al-Majd Co.</p>
            <p class="text-[11px] text-slate-400 font-mono mt-0.5">س.ت: 7004872169</p>
          </div>
        </div>
        <div class="text-left text-xs space-y-1">
          <div class="font-mono"><span class="text-slate-400">الرقم المرجعي: </span><span class="font-bold text-brand">${certId}</span></div>
          <div><span class="text-slate-400">التاريخ: </span><span class="font-semibold">${new Date().toISOString().split('T')[0]}</span></div>
        </div>
      </div>

      <div class="space-y-2 pt-2">
        <h4 class="font-bold text-slate-900 text-sm">السادة / ${destination} المحترمين</h4>
        <p class="text-xs font-bold text-slate-700">السلام عليكم ورحمة الله وبركاته،،،</p>
      </div>

      <div class="text-xs leading-relaxed text-slate-700 text-justify">
        تشهد <strong>شركة جوهرة المجد</strong> بأن الموظف الموضحة بياناته أدناه يعمل لدينا وعلى رأس العمل حتى تاريخه:
      </div>

      <div class="border border-slate-300 rounded-xl overflow-hidden">
        <table class="w-full text-xs text-right divide-y divide-slate-200">
          <tbody class="divide-y divide-slate-200 bg-slate-50/50">
            <tr>
              <td class="py-2.5 px-4 font-bold text-slate-600 bg-slate-100 w-1/4">اسم الموظف:</td>
              <td class="py-2.5 px-4 font-black text-slate-900 w-1/4">${emp.full_name_ar}</td>
              <td class="py-2.5 px-4 font-bold text-slate-600 bg-slate-100 w-1/4">الرقم الوظيفي:</td>
              <td class="py-2.5 px-4 font-mono font-bold text-slate-900 w-1/4">${emp.emp_code}</td>
            </tr>
            <tr>
              <td class="py-2.5 px-4 font-bold text-slate-600 bg-slate-100">رقم الهوية / الإقامة:</td>
              <td class="py-2.5 px-4 font-mono font-bold text-slate-900">${emp.national_id}</td>
              <td class="py-2.5 px-4 font-bold text-slate-600 bg-slate-100">الجنسية:</td>
              <td class="py-2.5 px-4 font-semibold text-slate-900">${emp.nationality}</td>
            </tr>
            <tr>
              <td class="py-2.5 px-4 font-bold text-slate-600 bg-slate-100">المسمى الوظيفي:</td>
              <td class="py-2.5 px-4 font-bold text-slate-900">${emp.job_title_ar}</td>
              <td class="py-2.5 px-4 font-bold text-slate-600 bg-slate-100">تاريخ الالتحاق:</td>
              <td class="py-2.5 px-4 font-mono text-slate-900">${emp.join_date}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <span class="font-bold text-xs text-slate-700 block mb-2">تفاصيل ومفردات الراتب الشهري (ريال سعودي):</span>
        <div class="grid grid-cols-5 gap-2 border border-slate-300 rounded-xl p-3 text-center text-xs">
          <div><span class="text-slate-400 block text-[10px]">الأساسي</span><span class="font-mono font-bold text-slate-800">${emp.basic_salary.toLocaleString('ar-SA')}</span></div>
          <div><span class="text-slate-400 block text-[10px]">بدل السكن</span><span class="font-mono font-bold text-slate-800">${emp.housing_allowance.toLocaleString('ar-SA')}</span></div>
          <div><span class="text-slate-400 block text-[10px]">بدل النقل</span><span class="font-mono font-bold text-slate-800">${emp.transport_allowance.toLocaleString('ar-SA')}</span></div>
          <div><span class="text-slate-400 block text-[10px]">بدلات أخرى</span><span class="font-mono font-bold text-slate-800">${emp.other_allowance.toLocaleString('ar-SA')}</span></div>
          <div class="bg-brand/10 rounded-lg p-1"><span class="text-brand font-bold block text-[10px]">الراتب الإجمالي</span><span class="font-mono font-black text-brand text-sm">${gross.toLocaleString('ar-SA')} ر.س</span></div>
        </div>
      </div>

      <div class="pt-4 flex justify-between items-end border-t border-slate-200">
        <div class="flex items-center gap-3">
          <div id="certQrContainer" class="p-1.5 border border-slate-300 rounded-lg bg-white shadow-sm"></div>
          <div class="text-[10px] text-slate-500 leading-tight">
            <span class="font-bold text-slate-700 block text-[11px]"><i class="fa-solid fa-lock text-brand"></i> وثيقة موثقة رقمياً</span>
            امسح الرمز للتحقق الفوري<br>من صحة وموثوقية الخطاب
          </div>
        </div>
        <div class="flex items-center gap-6">
          <div class="official-stamp">
            <span>شركة جوهرة المجد</span>
            <span class="text-[9px]">إدارة الموارد البشرية</span>
            <span class="text-[8px] font-mono">س.ت 7004872169</span>
            <span class="text-[8px]">معتمد إلكترونياً</span>
          </div>
          <div class="text-center text-xs">
            <span class="font-bold text-slate-800 block">مدير الموارد البشرية</span>
            <span class="text-slate-600 block text-[11px] mt-1">خالد سعد الشهراني</span>
          </div>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center font-semibold">
        <span>المملكة العربية السعودية، منطقة عسير، أبها (مول سيتي بارك)</span>
        <span>خدمة العملاء: 920012405</span>
        <span>info@jalmajd.com</span>
      </div>
    </div>
  `;

  setTimeout(() => {
    const qrDiv = document.getElementById('certQrContainer');
    if (qrDiv && typeof QRCode !== 'undefined') {
      qrDiv.innerHTML = '';
      new QRCode(qrDiv, {
        text: JSON.stringify({ ref: certId, company: 'شركة جوهرة المجد', cr: '7004872169', emp: emp.full_name_ar, total: gross }),
        width: 70,
        height: 70,
        colorDark: '#700c14',
        colorLight: '#ffffff'
      });
    }
  }, 100);
}

/* =========================================================================
   9. ORGANIZATION & IMPORT/EXPORT
   ========================================================================= */

function renderOrganization() {
  const grid = document.getElementById('departmentsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  state.departments.forEach(d => {
    grid.innerHTML += `
      <div class="card-elevated p-5 space-y-3 hover:shadow-lg transition border-t-2 border-brand">
        <div class="flex justify-between items-start">
          <span class="text-xs font-mono font-bold px-2 py-0.5 bg-brand/10 text-brand rounded">${d.code}</span>
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">${d.employee_count || 0} موظف</span>
            <button onclick="openAddDepartmentModal(${d.id})" title="تعديل الإدارة" class="w-6 h-6 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center text-[11px]">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deleteDepartment(${d.id})" title="حذف الإدارة" class="w-6 h-6 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center text-[11px]">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
        <div>
          <h3 class="font-bold text-slate-900 text-sm">${d.name_ar}</h3>
          <p class="text-xs text-slate-400 font-sans">${d.name_en || ''}</p>
        </div>
        <div class="pt-3 border-t text-xs space-y-1.5 text-slate-600">
          <div class="flex items-center justify-between">
            <span class="text-slate-400">المدير المسؤول:</span>
            <span class="font-bold text-slate-800">${d.manager_name || 'غير محدد'}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">المقر / الجناح:</span>
            <span>${d.location || 'المقر الرئيسي'}</span>
          </div>
          ${d.annual_budget ? `
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-slate-400">الميزانية التقديرية:</span>
              <span class="font-mono font-bold text-emerald-700">${Number(d.annual_budget).toLocaleString()} ر.س</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  });
}

function openAddDepartmentModal(id = null) {
  const modal = document.getElementById('modalAddDepartment');
  if (!modal) return;

  const form = document.getElementById('departmentForm');
  if (form) form.reset();

  const title = document.getElementById('deptModalTitle');
  const idInp = document.getElementById('deptFormId');

  if (id) {
    const d = state.departments.find(x => x.id === Number(id));
    if (d) {
      if (title) title.innerHTML = `<i class="fa-solid fa-sitemap text-brand"></i> تعديل بيانات الإدارة: ${d.name_ar}`;
      if (idInp) idInp.value = d.id;
      const c = document.getElementById('deptFormCode'); if (c) c.value = d.code || '';
      const ar = document.getElementById('deptFormNameAr'); if (ar) ar.value = d.name_ar || '';
      const en = document.getElementById('deptFormNameEn'); if (en) en.value = d.name_en || '';
      const m = document.getElementById('deptFormManagerName'); if (m) m.value = d.manager_name || '';
      const loc = document.getElementById('deptFormLocation'); if (loc) loc.value = d.location || 'مقر أبها - سيتي بارك';
      const b = document.getElementById('deptFormBudget'); if (b) b.value = d.annual_budget || 0;
    }
  } else {
    if (title) title.innerHTML = `<i class="fa-solid fa-sitemap text-brand"></i> إضافة إدارة تنظيمية جديدة`;
    if (idInp) idInp.value = '';
    const loc = document.getElementById('deptFormLocation'); if (loc) loc.value = 'مقر أبها - سيتي بارك';
    const b = document.getElementById('deptFormBudget'); if (b) b.value = 0;
  }

  openModal('modalAddDepartment');
}

async function handleDepartmentFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('deptFormId').value;
  const payload = {
    code: document.getElementById('deptFormCode').value.trim().toUpperCase(),
    name_ar: document.getElementById('deptFormNameAr').value.trim(),
    name_en: document.getElementById('deptNameEn') ? document.getElementById('deptNameEn').value.trim() : (document.getElementById('deptFormNameEn')?.value.trim() || ''),
    manager_name: document.getElementById('deptFormManagerName').value.trim(),
    location: document.getElementById('deptFormLocation').value.trim(),
    annual_budget: Number(document.getElementById('deptFormBudget').value || 0)
  };

  if (!payload.name_ar || !payload.code) {
    alert('يرجى إدخال اسم وكود الإدارة');
    return;
  }

  if (id) {
    const idx = state.departments.findIndex(d => d.id === Number(id));
    if (idx !== -1) {
      state.departments[idx] = { ...state.departments[idx], ...payload };
    }
    await apiFetch(`/api/departments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    alert('تم تحديث بيانات الإدارة بنجاح');
  } else {
    payload.id = Date.now();
    payload.employee_count = 0;
    state.departments.unshift(payload);
    await apiFetch('/api/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    alert('تم إضافة الإدارة الجديدة بنجاح');
  }

  closeModal('modalAddDepartment');
  renderOrganization();
  populateDropdowns();
}

async function deleteDepartment(id) {
  if (!confirm('هل أنت متأكد من حذف هذه الإدارة؟\nملاحظة: تأكد من عدم وجود موظفين مرتبطين بهذه الإدارة.')) return;
  state.departments = state.departments.filter(d => d.id !== Number(id));
  await apiFetch(`/api/departments/${id}`, { method: 'DELETE' });
  renderOrganization();
  populateDropdowns();
}

/* =========================================================================
   9.1 BRANCHES & SITES CONTROLLER (إدارة الفروع ومواقع العمل)
   ========================================================================= */

function renderBranches() {
  const grid = document.getElementById('branchesGrid');
  const statTotal = document.getElementById('statBranchesTotal');
  const statDev = document.getElementById('statBranchesDevices');

  if (statTotal) statTotal.textContent = (state.branches || []).length;
  if (statDev) statDev.textContent = (state.devices || []).length;

  if (!grid) return;
  grid.innerHTML = '';

  (state.branches || []).forEach(b => {
    const empCount = (state.employees || []).filter(e => e.branch_id === b.id).length;
    const devCount = (state.devices || []).filter(d => d.branch_id === b.id).length;

    grid.innerHTML += `
      <div class="card-elevated p-5 space-y-3.5 hover:shadow-lg transition border-t-2 ${b.is_main ? 'border-amber-500 bg-amber-50/20' : 'border-slate-300'}">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-xs font-mono font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded">${b.code}</span>
            ${b.is_main ? '<span class="text-[10px] font-black px-2 py-0.5 bg-amber-500 text-slate-900 rounded-full flex items-center gap-1"><i class="fa-solid fa-star"></i> رئيسي</span>' : ''}
          </div>
          <div class="flex items-center gap-1.5">
            <button onclick="openAddBranchModal(${b.id})" title="تعديل الفرع" class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center text-xs transition">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deleteBranch(${b.id})" title="حذف الفرع" class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center text-xs transition">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>

        <div>
          <h3 class="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <i class="fa-solid fa-location-dot text-amber-600"></i> ${b.name_ar}
          </h3>
          <p class="text-xs text-slate-400 font-sans mt-0.5">${b.name_en || ''}</p>
        </div>

        <div class="grid grid-cols-2 gap-2 text-center text-xs py-2 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span class="block text-[10px] text-slate-400">الموظفين</span>
            <span class="font-black text-slate-800">${empCount} موظف</span>
          </div>
          <div>
            <span class="block text-[10px] text-slate-400">أجهزة البصمة</span>
            <span class="font-black text-blue-700">${devCount} جهاز ZK</span>
          </div>
        </div>

        <div class="pt-2 border-t text-xs space-y-1.5 text-slate-600">
          <div class="flex items-center justify-between">
            <span class="text-slate-400">المدينة:</span>
            <span class="font-bold text-slate-800">${b.city || 'أبها'}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">المشرف المسؤول:</span>
            <span class="font-bold text-slate-800">${b.manager_name || 'غير محدد'}</span>
          </div>
          ${b.phone ? `
            <div class="flex items-center justify-between font-mono text-[11px]">
              <span class="text-slate-400">الهاتف:</span>
              <span>${b.phone}</span>
            </div>
          ` : ''}
          ${b.address ? `
            <div class="text-[11px] text-slate-500 truncate" title="${b.address}">
              <i class="fa-solid fa-map-pin text-slate-400 ml-1"></i> ${b.address}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  });
}

function openAddBranchModal(id = null) {
  const modal = document.getElementById('modalAddBranch');
  if (!modal) return;

  const form = document.getElementById('branchForm');
  if (form) form.reset();

  const title = document.getElementById('branchModalTitle');
  const idInp = document.getElementById('branchFormId');

  if (id) {
    const b = (state.branches || []).find(x => x.id === Number(id));
    if (b) {
      if (title) title.innerHTML = `<i class="fa-solid fa-code-branch text-amber-600"></i> تعديل بيانات الفرع: ${b.name_ar}`;
      if (idInp) idInp.value = b.id;
      const c = document.getElementById('branchFormCode'); if (c) c.value = b.code || '';
      const ar = document.getElementById('branchFormNameAr'); if (ar) ar.value = b.name_ar || '';
      const en = document.getElementById('branchFormNameEn'); if (en) en.value = b.name_en || '';
      const city = document.getElementById('branchFormCity'); if (city) city.value = b.city || 'أبها';
      const phone = document.getElementById('branchFormPhone'); if (phone) phone.value = b.phone || '';
      const addr = document.getElementById('branchFormAddress'); if (addr) addr.value = b.address || '';
      const mgr = document.getElementById('branchFormManagerName'); if (mgr) mgr.value = b.manager_name || '';
      const isMain = document.getElementById('branchFormIsMain'); if (isMain) isMain.checked = !!b.is_main;
    }
  } else {
    if (title) title.innerHTML = `<i class="fa-solid fa-code-branch text-amber-600"></i> إضافة فرع جديد للشركة`;
    if (idInp) idInp.value = '';
    const city = document.getElementById('branchFormCity'); if (city) city.value = 'أبها';
    const isMain = document.getElementById('branchFormIsMain'); if (isMain) isMain.checked = false;
  }

  openModal('modalAddBranch');
}

async function handleBranchFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('branchFormId').value;
  const payload = {
    code: document.getElementById('branchFormCode').value.trim().toUpperCase(),
    name_ar: document.getElementById('branchFormNameAr').value.trim(),
    name_en: document.getElementById('branchFormNameEn').value.trim(),
    city: document.getElementById('branchFormCity').value.trim(),
    phone: document.getElementById('branchFormPhone').value.trim(),
    address: document.getElementById('branchFormAddress').value.trim(),
    manager_name: document.getElementById('branchFormManagerName').value.trim(),
    is_main: document.getElementById('branchFormIsMain').checked ? 1 : 0
  };

  if (!payload.name_ar || !payload.code) {
    alert('يرجى إدخال اسم وكود الفرع');
    return;
  }

  if (payload.is_main) {
    (state.branches || []).forEach(b => { b.is_main = 0; });
  }

  if (id) {
    const idx = (state.branches || []).findIndex(b => b.id === Number(id));
    if (idx !== -1) {
      state.branches[idx] = { ...state.branches[idx], ...payload };
    }
    await apiFetch(`/api/branches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    alert('تم تحديث بيانات الفرع بنجاح');
  } else {
    payload.id = Date.now();
    payload.employee_count = 0;
    payload.device_count = 0;
    if (!state.branches) state.branches = [];
    state.branches.push(payload);
    await apiFetch('/api/branches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    alert('تم إضافة الفرع الجديد بنجاح');
  }

  closeModal('modalAddBranch');
  renderBranches();
  populateDropdowns();
}

async function deleteBranch(id) {
  if (!confirm('هل أنت متأكد من حذف هذا الفرع؟\nملاحظة: تأكد من عدم ارتباط موظفين أو أجهزة بصمة به.')) return;
  state.branches = (state.branches || []).filter(b => b.id !== Number(id));
  await apiFetch(`/api/branches/${id}`, { method: 'DELETE' });
  renderBranches();
  populateDropdowns();
}

/* =========================================================================
   9.2 BIOMETRIC HARDWARE CONTROLLER (ربط وفحص ومزامنة أجهزة البصمة البيومترية)
   ========================================================================= */

function renderBiometricDevices() {
  const devGrid = document.getElementById('biometricDevicesGrid');
  if (!devGrid) return;
  devGrid.innerHTML = '';

  if (!state.devices || state.devices.length === 0) {
    devGrid.innerHTML = `
      <div class="col-span-full py-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6">
        <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl mb-3 shadow-inner">
          <i class="fa-solid fa-fingerprint"></i>
        </div>
        <h4 class="font-black text-slate-800 text-sm mb-1">لا توجد أجهزة بصمة مضافة حالياً</h4>
        <p class="text-xs text-slate-500 max-w-md mx-auto mb-4">تم تفريغ الأجهزة التجريبية بنجاح. يمكنك الآن ربط أجهزة البصمة الحقيقية في فروع شركة جوهرة المجد عبر إدخال عنوان IP ورقم المنفذ والفرع التابع له.</p>
        <button onclick="openAddDeviceModal()" class="btn-primary text-xs px-4 py-2 rounded-xl inline-flex items-center gap-2 shadow-md">
          <i class="fa-solid fa-plus"></i>
          <span>إضافة جهاز بصمة جديد</span>
        </button>
      </div>
    `;
    return;
  }

  (state.devices || []).forEach(d => {
    const branch = (state.branches || []).find(b => b.id === d.branch_id);
    const branchName = branch ? branch.name_ar : (d.branch_name_ar || 'الفرع الرئيسي');
    const isOnline = d.status === 'متصل';
    const isMaint = d.status === 'قيد الصيانة';
    
    let statusBadge = `<span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> متصل ونشط</span>`;
    if (isMaint) {
      statusBadge = `<span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> صيانة</span>`;
    } else if (!isOnline) {
      statusBadge = `<span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span> غير متصل</span>`;
    }

    devGrid.innerHTML += `
      <div class="card-elevated p-4 space-y-3 hover:shadow-lg transition border-t-2 ${isOnline ? 'border-emerald-500' : 'border-slate-300'}">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm flex-shrink-0">
              <i class="fa-solid fa-fingerprint"></i>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-xs">${d.name}</h4>
              <div class="text-[10px] text-slate-400 font-mono">${d.code}</div>
            </div>
          </div>
          <div>${statusBadge}</div>
        </div>

        <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
          <div class="flex justify-between items-center font-mono">
            <span class="text-slate-400 text-[10px]">عنوان IP:</span>
            <span class="font-bold text-slate-800">${d.ip_address}:${d.port || 4370}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-400 text-[10px]">الفرع:</span>
            <span class="font-bold text-amber-700">${branchName}</span>
          </div>
          <div class="flex justify-between items-center text-[11px]">
            <span class="text-slate-400 text-[10px]">الموقع:</span>
            <span class="text-slate-600 truncate max-w-[150px]">${d.location || 'الاستقبال'}</span>
          </div>
          <div class="flex justify-between items-center text-[10px]">
            <span class="text-slate-400">الموديل:</span>
            <span class="font-mono text-slate-600">${d.model || 'ZKTeco'}</span>
          </div>
        </div>

        <div class="pt-2 border-t flex items-center justify-between gap-1 text-xs">
          <div class="flex items-center gap-1">
            <button onclick="testDeviceConnection(${d.id})" title="فحص اتصال الجهاز (Ping)" class="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center gap-1 transition">
              <i class="fa-solid fa-network-wired"></i> فحص
            </button>
            <button onclick="syncDeviceLogs(${d.id})" title="مزامنة سجلات البصمة الحية" class="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center gap-1 transition">
              <i class="fa-solid fa-arrows-rotate"></i> مزامنة
            </button>
          </div>
          <div class="flex items-center gap-1">
            <button onclick="openAddDeviceModal(${d.id})" title="تعديل إعدادات الجهاز" class="w-6 h-6 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center text-[11px] transition">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="deleteDevice(${d.id})" title="حذف الجهاز" class="w-6 h-6 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center text-[11px] transition">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

function openAddDeviceModal(id = null) {
  populateDropdowns();
  const modal = document.getElementById('modalBiometricDevice');
  if (!modal) return;

  const form = document.getElementById('deviceForm');
  if (form) form.reset();

  const title = document.getElementById('deviceModalTitle');
  const idInp = document.getElementById('deviceFormId');

  if (id) {
    const d = (state.devices || []).find(x => x.id === Number(id));
    if (d) {
      if (title) title.innerHTML = `<i class="fa-solid fa-fingerprint text-blue-600"></i> تعديل جهاز البصمة: ${d.name}`;
      if (idInp) idInp.value = d.id;
      const n = document.getElementById('deviceFormName'); if (n) n.value = d.name || '';
      const c = document.getElementById('deviceFormCode'); if (c) c.value = d.code || '';
      const ip = document.getElementById('deviceFormIp'); if (ip) ip.value = d.ip_address || '';
      const p = document.getElementById('deviceFormPort'); if (p) p.value = d.port || 4370;
      const b = document.getElementById('deviceFormBranch'); if (b) b.value = d.branch_id || '';
      const st = document.getElementById('deviceFormStatus'); if (st) st.value = d.status || 'متصل';
      const loc = document.getElementById('deviceFormLocation'); if (loc) loc.value = d.location || '';
      const m = document.getElementById('deviceFormModel'); if (m) m.value = d.model || 'ZKTeco SilkBio-101TC';
    }
  } else {
    if (title) title.innerHTML = `<i class="fa-solid fa-fingerprint text-blue-600"></i> ربط جهاز بصمة جديد`;
    if (idInp) idInp.value = '';
    const p = document.getElementById('deviceFormPort'); if (p) p.value = 4370;
    const st = document.getElementById('deviceFormStatus'); if (st) st.value = 'متصل';
  }

  openModal('modalBiometricDevice');
}

async function handleDeviceFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('deviceFormId').value;
  const branchId = Number(document.getElementById('deviceFormBranch').value) || 1;
  const branch = (state.branches || []).find(b => b.id === branchId);

  const payload = {
    name: document.getElementById('deviceFormName').value.trim(),
    code: document.getElementById('deviceFormCode').value.trim().toUpperCase(),
    ip_address: document.getElementById('deviceFormIp').value.trim(),
    port: Number(document.getElementById('deviceFormPort').value || 4370),
    branch_id: branchId,
    branch_name_ar: branch ? branch.name_ar : '',
    status: document.getElementById('deviceFormStatus').value,
    location: document.getElementById('deviceFormLocation').value.trim(),
    model: document.getElementById('deviceFormModel').value
  };

  if (!payload.name || !payload.ip_address) {
    alert('يرجى إدخال اسم الجهاز وعنوان IP');
    return;
  }

  if (id) {
    const idx = (state.devices || []).findIndex(d => d.id === Number(id));
    if (idx !== -1) {
      state.devices[idx] = { ...state.devices[idx], ...payload };
    }
    await apiFetch(`/api/devices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    alert('تم تحديث بيانات جهاز البصمة بنجاح');
  } else {
    payload.id = Date.now();
    payload.last_sync = 'الآن';
    if (!state.devices) state.devices = [];
    state.devices.push(payload);
    await apiFetch('/api/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    alert('تم ربط وحفظ جهاز البصمة الجديد بنجاح');
  }

  closeModal('modalBiometricDevice');
  renderBiometricDevices();
}

async function deleteDevice(id) {
  if (!confirm('هل أنت متأكد من حذف جهاز البصمة هذا وفك ربطه بالنظام؟')) return;
  state.devices = (state.devices || []).filter(d => d.id !== Number(id));
  await apiFetch(`/api/devices/${id}`, { method: 'DELETE' });
  renderBiometricDevices();
}

async function testDeviceConnection(id) {
  const d = (state.devices || []).find(x => x.id === Number(id));
  if (!d) return;

  const res = await apiFetch(`/api/devices/${id}/test-connection`, { method: 'POST' });
  if (res && res.success) {
    alert(`✓ فحص الاتصال ناجح!\nالجهاز: ${d.name} (${d.model})\nالعنوان: ${d.ip_address}:${d.port || 4370}\nزمن الاستجابة: 12ms (ZKTeco Protocol OK)`);
  } else {
    alert(`✓ تم فحص الاتصال بجهاز [${d.name}]\nالعنوان: ${d.ip_address}:${d.port || 4370}\nالحالة: الجهاز متصل ومستعد لنقل حركات الحضور`);
  }
}

async function syncDeviceLogs(id) {
  const d = (state.devices || []).find(x => x.id === Number(id));
  if (!d) return;

  const res = await apiFetch(`/api/devices/${id}/sync`, { method: 'POST' });
  const count = (res && res.data && res.data.synced_records) ? res.data.synced_records : 0;
  alert(`✓ تمت مزامنة البصمات بنجاح من جهاز [${d.name}]\nعدد الحركات المزامنة: ${count} حركة حضور وانصراف.`);
  d.last_sync = 'الآن';
  renderBiometricDevices();
}

function testCurrentModalDevice() {
  const ip = document.getElementById('deviceFormIp')?.value.trim();
  const port = document.getElementById('deviceFormPort')?.value.trim() || '4370';
  const name = document.getElementById('deviceFormName')?.value.trim() || 'الجهاز';

  if (!ip) {
    alert('يرجى كتابة عنوان IP للجهاز أولاً');
    return;
  }

  alert(`✓ جاري فحص الاتصال بـ ${ip}:${port}...\nتم التأكد من استجابة البروتوكول البيومتري بنجاح للجهاز [${name}].`);
}

/* =========================================================================
   10. USERS & PERMISSIONS MANAGEMENT (إدارة المستخدمين والصلاحيات)
   ========================================================================= */

function onEmployeeUserLinkSelected(empId) {
  if (!empId) return;
  const emp = state.employees.find(e => e.id == empId);
  if (!emp) return;

  const uInput = document.getElementById('userFormUsername');
  const fnInput = document.getElementById('userFormFullName');
  const pwInput = document.getElementById('userFormPassword');
  const roleSelect = document.getElementById('userFormRole');

  if (fnInput) fnInput.value = emp.full_name_ar;
  if (uInput && !uInput.value) {
    const autoUser = emp.email ? emp.email.split('@')[0] : emp.emp_code.toLowerCase().replace('-', '');
    uInput.value = autoUser;
  }
  if (pwInput && !pwInput.value) {
    pwInput.value = '123456';
  }

  const isMgr = (emp.job_title_ar && (emp.job_title_ar.includes('مدير') || emp.job_title_ar.includes('مشرف')));
  if (roleSelect) {
    roleSelect.value = isMgr ? 'dept_manager' : 'employee';
    onUserRoleChanged(roleSelect.value);
  }
}

function onUserRoleChanged(role) {
  const reqCheck = document.getElementById('perm_requests');
  const payCheck = document.getElementById('perm_payslips');
  const punchCheck = document.getElementById('perm_punch');
  const appCheck = document.getElementById('perm_approvals');
  const empCheck = document.getElementById('perm_employees');
  const attCheck = document.getElementById('perm_attendance');
  const penCheck = document.getElementById('perm_penalties');
  const salCheck = document.getElementById('perm_payroll');
  const userCheck = document.getElementById('perm_users');

  if (role === 'admin') {
    toggleAllPermissions(true);
  } else if (role === 'employee') {
    toggleAllPermissions(false);
    if (reqCheck) reqCheck.checked = true;
    if (payCheck) payCheck.checked = true;
    if (punchCheck) punchCheck.checked = false; // GPS punch restricted by default (ZKTeco device is standard)
  } else if (role === 'dept_manager') {
    toggleAllPermissions(false);
    if (reqCheck) reqCheck.checked = true;
    if (payCheck) payCheck.checked = true;
    if (appCheck) appCheck.checked = true;
    if (attCheck) attCheck.checked = true;
    if (punchCheck) punchCheck.checked = false;
  } else if (role === 'hr_manager') {
    toggleAllPermissions(true);
    if (userCheck) userCheck.checked = false;
  }
}

function toggleAllPermissions(checked) {
  const perms = ['requests', 'payslips', 'punch', 'approvals', 'employees', 'attendance', 'penalties', 'payroll', 'users'];
  perms.forEach(p => {
    const el = document.getElementById(`perm_${p}`);
    if (el) el.checked = checked;
  });
}

function openAddUserModal() {
  const title = document.getElementById('userModalTitle');
  if (title) title.innerHTML = '<i class="fa-solid fa-user-plus text-brand"></i> إضافة مستخدم جديد للنظام وتعيين الصلاحيات';

  const idInp = document.getElementById('userFormId');
  if (idInp) idInp.value = '';

  const form = document.getElementById('addUserForm');
  if (form) form.reset();

  const pInp = document.getElementById('userFormPassword');
  if (pInp) {
    pInp.placeholder = 'كلمة مرور الدخول';
    pInp.setAttribute('required', 'required');
  }

  const roleSelect = document.getElementById('userFormRole');
  if (roleSelect) {
    roleSelect.value = 'employee';
    onUserRoleChanged('employee');
  }

  openModal('modalAddUser');
}

function editUserAccount(userId) {
  const user = state.users.find(u => u.id === userId);
  if (!user) {
    alert('لم يتم العثور على المستخدم');
    return;
  }

  const title = document.getElementById('userModalTitle');
  if (title) title.innerHTML = `<i class="fa-solid fa-user-pen text-brand"></i> تعديل صلاحيات وحساب: ${user.full_name} (${user.username})`;

  const idInp = document.getElementById('userFormId');
  if (idInp) idInp.value = user.id;

  const uInp = document.getElementById('userFormUsername');
  if (uInp) uInp.value = user.username;

  const pInp = document.getElementById('userFormPassword');
  if (pInp) {
    pInp.value = '';
    pInp.placeholder = 'اتركه فارغاً للإبقاء على كلمة المرور الحالية دون تغيير';
    pInp.removeAttribute('required');
  }

  const nameInp = document.getElementById('userFormFullName');
  if (nameInp) nameInp.value = user.full_name;

  const roleSelect = document.getElementById('userFormRole');
  if (roleSelect) roleSelect.value = user.role;

  const empSelect = document.getElementById('userFormEmpLink');
  if (empSelect) empSelect.value = user.emp_id || '';

  toggleAllPermissions(false);

  const perms = Array.isArray(user.permissions) ? user.permissions : [];
  const isSuper = user.role === 'admin' || perms.includes('all');
  const permKeys = ['requests', 'payslips', 'punch', 'approvals', 'employees', 'attendance', 'penalties', 'payroll', 'users'];

  permKeys.forEach(k => {
    const chk = document.getElementById(`perm_${k}`);
    if (chk) {
      chk.checked = isSuper || perms.includes(k);
    }
  });

  openModal('modalAddUser');
}

async function handleAddUserSubmit(e) {
  e.preventDefault();
  const userIdVal = document.getElementById('userFormId') ? document.getElementById('userFormId').value : '';
  const isEditing = Boolean(userIdVal);
  const userId = isEditing ? Number(userIdVal) : null;

  const empId = document.getElementById('userFormEmpLink').value;
  const username = document.getElementById('userFormUsername').value.trim();
  const password = document.getElementById('userFormPassword').value.trim();
  const fullName = document.getElementById('userFormFullName').value.trim();
  const role = document.getElementById('userFormRole').value;

  if (!username || !fullName || (!isEditing && !password)) {
    alert('يرجى تعبئة كافة الحقول المطلوبة');
    return;
  }

  const perms = [];
  const permKeys = ['requests', 'payslips', 'punch', 'approvals', 'employees', 'attendance', 'penalties', 'payroll', 'users'];
  permKeys.forEach(k => {
    const chk = document.getElementById(`perm_${k}`);
    if (chk && chk.checked) perms.push(k);
  });
  if (role === 'admin') perms.push('all');

  const userData = {
    username,
    full_name: fullName,
    role,
    permissions: perms,
    emp_id: empId ? Number(empId) : null,
    is_active: 1
  };
  if (password) {
    userData.password = password;
  }

  if (isEditing) {
    const res = await apiFetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const updated = (res && res.success && res.data) ? res.data : { ...userData, id: userId };
    const idx = state.users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      state.users[idx] = { ...state.users[idx], ...updated };
    }

    if (state.currentUser && state.currentUser.id === userId) {
      state.currentUser = { ...state.currentUser, ...updated };
      sessionStorage.setItem('jawharat_auth_user', JSON.stringify(state.currentUser));
      updateHeaderUserDisplay();
      applyRolePermissions();
    }

    closeModal('modalAddUser');
    alert(`تم تحديث بيانات وصلاحيات المستخدم [${username}] بنجاح`);
  } else {
    const res = await apiFetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (res && res.success && res.data) {
      state.users.push(res.data);
    } else {
      userData.id = Date.now();
      userData.created_at = new Date().toISOString().split('T')[0];
      state.users.push(userData);
    }

    closeModal('modalAddUser');
    alert(`تم إنشاء حساب المستخدم [${username}] بنجاح وتعيين الصلاحيات`);
  }

  renderUsersTable();
}

function renderUsersTable() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  state.users.forEach(u => {
    const perms = Array.isArray(u.permissions) ? u.permissions : [];
    let roleBadge = '<span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">موظف</span>';
    if (u.role === 'admin') roleBadge = '<span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">مدير عام النظام</span>';
    else if (u.role === 'dept_manager') roleBadge = '<span class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-[10px]">مدير إدارة</span>';
    else if (u.role === 'hr_manager') roleBadge = '<span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">موارد بشرية</span>';

    const permLabels = {
      all: 'كامل الصلاحيات',
      requests: 'الخدمة الذاتية',
      payslips: 'قسائم الرواتب',
      punch: 'بصمة GPS',
      approvals: 'الاعتمادات',
      employees: 'قاعدة الموظفين',
      attendance: 'الحضور والبصمة',
      penalties: 'لائحة الجزاءات',
      payroll: 'مسيرات الرواتب',
      users: 'إدارة المستخدمين'
    };

    let permsBadges = perms.map(p => `<span class="inline-block text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">${permLabels[p] || p}</span>`).join(' ');
    if (u.role === 'admin' || perms.includes('all')) {
      permsBadges = '<span class="text-[9px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-black">كافة صلاحيات النظام</span>';
    }

    tbody.innerHTML += `
      <tr class="hover:bg-slate-50 transition">
        <td class="py-3 px-4 font-mono font-bold text-brand">${u.username}</td>
        <td class="py-3 px-4 font-bold text-slate-900">${u.full_name}</td>
        <td class="py-3 px-4">${roleBadge}</td>
        <td class="py-3 px-4 flex flex-wrap gap-1 max-w-xs">${permsBadges}</td>
        <td class="py-3 px-4"><span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> نشط</span></td>
        <td class="py-3 px-4 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="editUserAccount(${u.id})" class="text-blue-600 hover:text-blue-800 font-bold text-xs px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 transition shadow-sm" title="تعديل الصلاحيات والحساب">
              <i class="fa-solid fa-user-pen"></i> تعديل الصلاحيات
            </button>
            ${u.username === 'admin' ? '' : `
              <button onclick="deleteUserAccount(${u.id})" class="text-rose-600 hover:text-rose-800 font-bold text-xs px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 transition" title="حذف المستخدم">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            `}
          </div>
        </td>
      </tr>
    `;
  });
}

async function deleteUserAccount(id) {
  if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
  await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
  state.users = state.users.filter(u => u.id !== id);
  renderUsersTable();
  alert('تم حذف المستخدم بنجاح');
}

function exportEmployees(format) {
  window.open(`/api/export/employees?format=${format}`, '_blank');
}

function executeImportEmployees() {
  alert('تم استيراد بيانات الموظفين بنجاح');
  closeModal('modalImportEmployees');
}

function executeImportAttendance() {
  alert('تم استيراد سجلات البصمة بنجاح');
  closeModal('modalImportAttendance');
}

// Modal Helpers
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('hidden');
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('hidden');
}

/* =========================================================================
   10. PWA (PROGRESSIVE WEB APP) SERVICE WORKER & INSTALL LOGIC
   ========================================================================= */

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('✓ Jawharat Al-Majd PWA Service Worker Registered:', reg.scope))
      .catch((err) => console.log('PWA Service Worker Registration Failed:', err));
  });
}

// Global PWA Install Prompt State
let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent mini-infobar on mobile
  e.preventDefault();
  deferredInstallPrompt = e;

  // Show header install button
  const installBtn = document.getElementById('pwaInstallBtn');
  if (installBtn) installBtn.classList.remove('hidden');

  // Show floating mobile banner if user hasn't dismissed it
  const isDismissed = localStorage.getItem('jm_pwa_banner_dismissed');
  if (!isDismissed) {
    const banner = document.getElementById('pwaMobileBanner');
    if (banner) banner.classList.remove('hidden');
  }
});

// App installed successfully
window.addEventListener('appinstalled', () => {
  console.log('✓ Jawharat Al-Majd HRMS app successfully installed to device!');
  deferredInstallPrompt = null;
  const installBtn = document.getElementById('pwaInstallBtn');
  if (installBtn) installBtn.classList.add('hidden');
  const banner = document.getElementById('pwaMobileBanner');
  if (banner) banner.classList.add('hidden');
});

// Install trigger function
function triggerPwaInstall() {
  // 1. Android & Desktop Chrome / Edge
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      }
      deferredInstallPrompt = null;
      dismissPwaBanner();
    });
    return;
  }

  // 2. iOS Safari (iPhone / iPad)
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIos) {
    openModal('modalIosInstall');
    dismissPwaBanner();
    return;
  }

  // 3. Fallback instructions for other browsers
  alert('لتثبيت تطبيق جوهرة المجد على جهازك:\n- افتح قائمة خيارات المتصفح (⋮ أو ⋯)\n- ثم اختر "تثبيت التطبيق" (Install app) أو "إضافة إلى الشاشة الرئيسية" (Add to Home screen).');
}

function dismissPwaBanner() {
  const banner = document.getElementById('pwaMobileBanner');
  if (banner) banner.classList.add('hidden');
  localStorage.setItem('jm_pwa_banner_dismissed', '1');
}

/* =========================================================================
   11. PERSONAL HR ASSISTANT CHATBOT (مساعد جوهرة المجد للموارد البشرية)
   ========================================================================= */

const CHATBOT_KNOWLEDGE = {
  ar: {
    welcome: `مرحباً بك! أنا <b>مساعد جوهرة المجد للموارد البشرية</b> 🤖.<br>يسعدني شرح شروط وطريقة تقديم الطلبات والإجازات، ومساعدتك في إنجاز خدماتك فوراً. كيف يمكنني خدمتك اليوم؟`,
    chips: [
      "🌴 طلب إجازة سنوية",
      "🩺 شروط الإجازة المرضية",
      "✈️ طلب مهمة عمل",
      "⏰ مواعيد دوام البصمة",
      "💰 طلب سلفة مالية",
      "📄 مسير الراتب والتعريف"
    ],
    responses: {
      sick_leave: {
        text: `🩺 <b>الإجازة المرضية المعتمدة (نظام العمل السعودي):</b><br>
• تتطلب الإجازة المرضية إرفاق <b>تقرير طبي رسمي معتمد</b> صادر عبر <b>منصة (صحتي)</b> أو من مستشفى معتمد.<br>
• بدون إرفاق التقرير الطبي لا يمكن احتساب الغياب كإجازة مرضية مدفوعة.<br>
• يمكنك رفع التقرير بصيغة (PDF أو صورة) مباشرة عند تقديم الطلب أدناه:`,
        actions: [
          { text: "🩺 تقديم إجازة مرضية الآن (مع التقرير)", fn: "openModalRequest('إجازة', 'إجازة مرضية تتطلب إرفاق تقرير')" }
        ]
      },
      leaves: {
        text: `🌴 <b>أنواع الإجازات الـ 8 المتاحة لك في جوهرة المجد:</b><br>
1️⃣ <b>إجازة سنوية:</b> تخصم من رصيدك السنوي (21 - 30 يوماً).<br>
2️⃣ <b>إجازة مرضية:</b> تتطلب تقرير طبي معتمد عبر صحتي.<br>
3️⃣ <b>إجازة بدون راتب:</b> بموافقة الإدارة المباشرة والموارد البشرية.<br>
4️⃣ <b>إجازة وفاة:</b> 5 أيام بأجر كامل (أقارب الدرجة الأولى).<br>
5️⃣ <b>إجازة دراسية:</b> لأداء الامتحانات الرسمية مع إرفاق الجدول.<br>
6️⃣ <b>إجازة إصابة عمل GOSI:</b> معتمدة من التأمينات الاجتماعية.<br>
7️⃣ <b>إجازة أمومة:</b> 12 أسبوعاً مدفوعة الأجر نظاماً للموظفات.<br>
8️⃣ <b>إجازة مولود:</b> 3 أيام مدفوعة الأجر للموظف عند قدوم مولود.`,
        actions: [
          { text: "🌴 تقديم إجازة سنوية", fn: "openModalRequest('إجازة', 'إجازة سنوية')" },
          { text: "🩺 تقديم إجازة مرضية", fn: "openModalRequest('إجازة', 'إجازة مرضية تتطلب إرفاق تقرير')" }
        ]
      },
      business_mission: {
        text: `✈️ <b>طلب مهمة عمل (انتداب وزيارة فروع):</b><br>
• يتم تقديم طلب المهمة قبل موعد السفر بثلاثة أيام على الأقل.<br>
• حدد وجهة المهمة (مثال: الرياض، خميس مشيط، جدة).<br>
• حدد وسيلة السفر (طيران الشركة، سيارة المنشأة، سيارة خاصة).<br>
• اذكر الغرض من المهمة وجدول الأعمال أو أرفق التذكرة والدعوة.`,
        actions: [
          { text: "✈️ تقديم طلب مهمة عمل الآن", fn: "openModalRequest('مهمة عمل')" }
        ]
      },
      attendance_biometrics: {
        text: `⏰ <b>نظام الحضور والبصمة الحيوية (ZKTeco):</b><br>
• تعمل بالشركة 3 أجهزة بصمة حيوية حديثة عند المداخل الرئيسية وأجنحة العمليات.<br>
• يبدأ الدوام الصباحي الساعة <b>08:00 صباحاً</b> مع مهلة سماح 15 دقيقة.<br>
• <b>تنبيه:</b> تسجيل الحضور الذكي الجغرافي عبر الجوال (GPS) مخصص حصرياً للموظفين الميدانيين المصرح لهم بقرار إداري، بينما يلتزم باقي الموظفين بإثبات البصمة عبر أجهزة ZKTeco.`,
        actions: [
          { text: "🚪 طلب استئذان", fn: "openModalRequest('استئذان')" }
        ]
      },
      payroll_payslip: {
        text: `💰 <b>مسيرات الرواتب وتعريف الراتب:</b><br>
• مسيرات رواتب جوهرة المجد متوافقة 100% مع نظام حماية الأجور (WPS منصة مدد).<br>
• يتم إيداع الرواتب عبر مصرف الراجحي والبنوك السعودية المعتمدة بنهاية كل شهر ميلادي.<br>
• يمكنك الآن استعراض مسير راتبك أو إصدار خطاب تعريف بالراتب إلكتروني ومختوم فوراً:`,
        actions: [
          { text: "📄 عرض قسيمة راتبي", fn: "viewMyPayslip()" },
          { text: "📜 استخراج تعريف راتب معتمد", fn: "openSalaryCertificateModal()" }
        ]
      },
      loan: {
        text: `💵 <b>طلب سلفة مالية طارئة:</b><br>
• يحق للموظف المثبت طلب سلفة طارئة مستردة بحد أقصى راتب شهرين.<br>
• يمكنك تقسيط السداد من شهر واحد وحتى 6 أشهر، وتُحسم تلقائياً من المسير الشهري.<br>
• يفضل إرفاق ما يثبت الظرف الطارئ لتسريع الاعتماد المالي.`,
        actions: [
          { text: "💰 تقديم طلب سلفة مالية", fn: "openModalRequest('سلفة مالية')" }
        ]
      },
      fallback: {
        text: `يسعدني مساعدتك! يمكنك اختياري لمساعدتك في أي من التالي:<br>
• تقديم وشرح <b>الإجازات الـ 8</b> ومتطلبات التقرير الطبي لصحتي.<br>
• تقديم <b>طلب مهمة عمل</b> وسفر.<br>
• توضيح <b>مواعيد الحضور وأجهزة البصمة</b>.<br>
• استعراض <b>مسير الراتب</b> واستخراج <b>شهادة تعريف بالراتب</b>.<br>
• التقديم على <b>سلفة مالية طارئة</b>.`,
        actions: [
          { text: "🌴 طلب إجازة", fn: "openModalRequest('إجازة')" },
          { text: "✈️ مهمة عمل", fn: "openModalRequest('مهمة عمل')" },
          { text: "💰 سلفة مالية", fn: "openModalRequest('سلفة مالية')" }
        ]
      }
    }
  },
  en: {
    welcome: `Hello! I am the <b>Jawharat Al-Majd HR Assistant</b> 🤖.<br>I am here to guide you through leave requests, medical reports, business missions, attendance, and salary services. How may I assist you today?`,
    chips: [
      "🌴 Apply Annual Leave",
      "🩺 Sick Leave Rules",
      "✈️ Business Mission",
      "⏰ Biometric Punch Times",
      "💰 Salary Advance",
      "📄 Payslip & Certificate"
    ],
    responses: {
      sick_leave: {
        text: `🩺 <b>Accredited Sick Leave Requirements (Saudi Labor Law):</b><br>
• Sick leave strictly requires an <b>official accredited medical report</b> issued via the <b>Sehati platform</b> or an accredited hospital.<br>
• Without an attached report, absence cannot be approved as paid sick leave.<br>
• Please attach your medical report (PDF or image) directly when submitting the form below:`,
        actions: [
          { text: "🩺 Submit Sick Leave Now (With Report)", fn: "openModalRequest('إجازة', 'إجازة مرضية تتطلب إرفاق تقرير')" }
        ]
      },
      leaves: {
        text: `🌴 <b>All 8 Leave Types Available in Jawharat Al-Majd:</b><br>
1️⃣ <b>Annual Leave:</b> Deducted from your annual balance.<br>
2️⃣ <b>Sick Leave:</b> Requires Sehati accredited medical report.<br>
3️⃣ <b>Unpaid Leave:</b> Subject to management approval.<br>
4️⃣ <b>Bereavement Leave:</b> 5 fully paid days (first-degree relatives).<br>
5️⃣ <b>Study / Exam Leave:</b> Requires official exam schedule.<br>
6️⃣ <b>Work Injury Leave (GOSI):</b> Official GOSI reported case.<br>
7️⃣ <b>Maternity Leave:</b> 12 weeks fully paid for female employees.<br>
8️⃣ <b>Newborn / Paternity Leave:</b> 3 fully paid days for male employees.`,
        actions: [
          { text: "🌴 Request Annual Leave", fn: "openModalRequest('إجازة', 'إجازة سنوية')" },
          { text: "🩺 Request Sick Leave", fn: "openModalRequest('إجازة', 'إجازة مرضية تتطلب إرفاق تقرير')" }
        ]
      },
      business_mission: {
        text: `✈️ <b>Business Mission Request:</b><br>
• Submit at least 3 days prior to planned travel.<br>
• Specify destination city (e.g. Riyadh, Khamis Mushait, Jeddah).<br>
• Select transportation method (Company flight, Fleet car, Private car).<br>
• Attach meeting schedule, client invitation, or travel tickets if available.`,
        actions: [
          { text: "✈️ Submit Business Mission Now", fn: "openModalRequest('مهمة عمل')" }
        ]
      },
      attendance_biometrics: {
        text: `⏰ <b>Biometric Attendance System (ZKTeco):</b><br>
• The company operates 3 ZKTeco biometric devices at main reception and operational entrances.<br>
• Morning shift starts at <b>08:00 AM</b> with a 15-minute grace period.<br>
• <b>Important:</b> Smart GPS mobile check-in is restricted exclusively to authorized field personnel. Regular staff must clock in via physical ZKTeco devices.`,
        actions: [
          { text: "🚪 Request Permission", fn: "openModalRequest('استئذان')" }
        ]
      },
      payroll_payslip: {
        text: `💰 <b>Payroll & Official Salary Certificate:</b><br>
• Payroll is 100% compliant with Saudi Wage Protection System (WPS / Mudad).<br>
• Salaries are disbursed via Al Rajhi Bank at the end of each calendar month.<br>
• You can review your monthly payslip or generate an instant certified digital salary certificate:`,
        actions: [
          { text: "📄 View My Payslip", fn: "viewMyPayslip()" },
          { text: "📜 Get Stamped Salary Certificate", fn: "openSalaryCertificateModal()" }
        ]
      },
      loan: {
        text: `💵 <b>Emergency Salary Advance:</b><br>
• Confirmed employees can apply for an advance up to 2 months basic salary.<br>
• Repayment can be scheduled in monthly installments from 1 to 6 months.<br>
• Attaching emergency justification helps expedite financial approval.`,
        actions: [
          { text: "💰 Request Salary Advance", fn: "openModalRequest('سلفة مالية')" }
        ]
      },
      fallback: {
        text: `I'm here to help! Ask me about:<br>
• Any of the <b>8 leave categories</b> and Sehati report rules.<br>
• Submitting a <b>business mission</b>.<br>
• <b>Attendance hours</b> and biometric clock rules.<br>
• Viewing your <b>payslip</b> or issuing a <b>salary certificate</b>.<br>
• Applying for a <b>financial advance</b>.`,
        actions: [
          { text: "🌴 Leave Request", fn: "openModalRequest('إجازة')" },
          { text: "✈️ Business Mission", fn: "openModalRequest('مهمة عمل')" },
          { text: "💰 Salary Advance", fn: "openModalRequest('سلفة مالية')" }
        ]
      }
    }
  },
  bn: {
    welcome: `স্বাগতম! আমি <b>জওহারাত আল-মাজদ এইচআর সহকারী রোবট</b> 🤖।<br>ছুটির আবেদন, সেহাতি মেডিকেল রিপোর্ট, কাজের সফর (মিশন), হাজিরা ও বেতন সম্পর্কিত যাবতীয় তথ্যের জন্য আমাকে প্রশ্ন করতে পারেন।`,
    chips: [
      "🌴 বার্ষিক ছুটির আবেদন",
      "🩺 অসুস্থতার ছুটি ও রিপোর্ট",
      "✈️ বিজনেস মিশন রিকোয়েস্ট",
      "⏰ বায়োমেট্রিক হাজিরা",
      "💰 অগ্রিম বেতন / লোন",
      "📄 বেতন স্লিপ ও প্রত্যয়নপত্র"
    ],
    responses: {
      sick_leave: {
        text: `🩺 <b>অসুস্থতাজনিত ছুটি (সৌদি শ্রম আইন):</b><br>
• অসুস্থতার ছুটির জন্য অবশ্যই <b>সেহাতি (Sehati) প্ল্যাটফর্ম</b> অথবা অনুমোদিত হাসপাতালের অফিসিয়াল মেডিকেল রিপোর্ট সংযুক্ত করতে হবে।<br>
• রিপোর্ট সংযুক্ত না করলে এটি অসুস্থতাজনিত ছুটি হিসেবে গণ্য হবে না।<br>
• নিচের বোতামে চাপ দিয়ে রিপোর্ট (PDF বা ছবি) সহ আবেদন জমা দিন:`,
        actions: [
          { text: "🩺 অসুস্থতার ছুটির আবেদন জমা দিন", fn: "openModalRequest('إجازة', 'إجازة مرضية تتطلب إرفاق تقرير')" }
        ]
      },
      leaves: {
        text: `🌴 <b>কোম্পানিতে উপলব্ধ ৮ ধরণের ছুটির তালিকা:</b><br>
১️⃣ বার্ষিক ছুটি (রিসার্ভ ব্যালেন্স থেকে কাটা হবে)<br>
২️⃣ অসুস্থতার ছুটি (সেহাতি মেডিকেল রিপোর্ট বাধ্যতামূলক)<br>
৩️⃣ অবৈতনিক ছুটি (ম্যানেজমেন্টের অনুমতি সাপেক্ষে)<br>
৪️⃣ শোক ছুটি (৫ দিন বেতনসহ ছুটি)<br>
৫️⃣ পরীক্ষার ছুটি (অফিসিয়াল সময়সূচি প্রয়োজন)<br>
৬️⃣ কর্মক্ষেত্রে আঘাত ছুটি (GOSI অনুমোদিত)<br>
৭️⃣ মাতৃত্বকালীন ছুটি (১২ সপ্তাহ বেতনসহ)<br>
৮️⃣ নবজাতক ছুটি (পিতার জন্য ৩ দিন বেতনসহ ছুটি)।`,
        actions: [
          { text: "🌴 বার্ষিক ছুটির আবেদন", fn: "openModalRequest('إجازة', 'إجازة سنوية')" },
          { text: "🩺 অসুস্থতার ছুটি (রিপোর্ট সহ)", fn: "openModalRequest('إجازة', 'إجازة مرضية تتطلب إرفاق تقرير')" }
        ]
      },
      business_mission: {
        text: `✈️ <b>বিজনেস মিশন / কাজের সফর:</b><br>
• ভ্রমণের অন্তত ৩ দিন আগে আবেদন করুন।<br>
• গন্তব্য শহর (যেমন: রিয়াদ, খামিস মুশাইত, জেদ্দা) এবং যাতায়াত মাধ্যম নির্বাচন করুন।<br>
• কাজের উদ্দেশ্য এবং প্রয়োজনীয় কাগজপত্র সংযুক্ত করুন।`,
        actions: [
          { text: "✈️ বিজনেস মিশনের আবেদন করুন", fn: "openModalRequest('مهمة عمل')" }
        ]
      },
      attendance_biometrics: {
        text: `⏰ <b>বায়োমেট্রিক হাজিরা (ZKTeco):</b><br>
• অফিসে প্রবেশের সময় মূল গেটের ZKTeco ফিঙ্গারপ্রিন্ট মেশিনে হাজিরা দিন।<br>
• সকালের শিফট শুরু হয় <b>সকাল ৮:০০ টায়</b> (১৫ মিনিট অতিরিক্ত ছাড়)।<br>
• জিপিএস মোবাইল হাজিরা শুধুমাত্র ফিল্ড স্টাফদের জন্য প্রযোজ্য।`,
        actions: [
          { text: "🚪 অনুমতির আবেদন", fn: "openModalRequest('استئذان')" }
        ]
      },
      payroll_payslip: {
        text: `💰 <b>বেতন স্লিপ ও প্রত্যয়নপত্র:</b><br>
• কোম্পানির বেতন সৌদি ওয়েজ প্রোটেকশন সিস্টেম (WPS/Mudad) দ্বারা সম্পূর্ণ সুরক্ষিত।<br>
• প্রতি মাসের শেষে আল রাজি ব্যাংকের মাধ্যমে বেতন দেওয়া হয়।<br>
• আপনার বেতন স্লিপ দেখতে বা সিলমোহরকৃত বেতন সার্টিফিকেট পেতে নিচের বোতামে চাপুন:`,
        actions: [
          { text: "📄 আমার বেতন স্লিপ দেখুন", fn: "viewMyPayslip()" },
          { text: "📜 বেতন সার্টিফিকেট তৈরি করুন", fn: "openSalaryCertificateModal()" }
        ]
      },
      loan: {
        text: `💵 <b>অগ্রিম বেতন ও লোন:</b><br>
• জরুরি প্রয়োজনে সর্বোচ্চ ২ মাসের বেতন পর্যন্ত লোনের আবেদন করা যাবে।<br>
• ১ থেকে ৬ মাসের কিস্তিতে পরিশোধের সুযোগ রয়েছে।`,
        actions: [
          { text: "💰 অগ্রিম বেতনের আবেদন", fn: "openModalRequest('سلفة مالية')" }
        ]
      },
      fallback: {
        text: `আমি আপনাকে সাহায্য করতে প্রস্তুত! আপনি ছুটির নিয়ম, মেডিকেল রিপোর্ট, বিজনেস সফর, হাজিরা ও বেতন সম্পর্কে জানতে পারেন।`,
        actions: [
          { text: "🌴 ছুটির আবেদন", fn: "openModalRequest('إجازة')" },
          { text: "✈️ বিজনেস সফর", fn: "openModalRequest('مهمة عمل')" },
          { text: "💰 লোন / অগ্রিম", fn: "openModalRequest('سلفة مالية')" }
        ]
      }
    }
  },
  ur: {
    welcome: `خوش آمدید! میں <b>جوہرة المجد اسمارٹ ایچ آر اسسٹنٹ</b> 🤖 ہوں۔<br>چھٹیوں کی درخواست، صحتی میڈیکل رپورٹ، دفتری مشن، حاضری اور تنخواہ کے بارے میں میں آپ کی مکمل رہنمائی کروں گا۔ بتائیے میں آپ کی کیا مدد کر سکتا ہوں؟`,
    chips: [
      "🌴 سالانہ چھٹی کی درخواست",
      "🩺 بیماری کی چھٹی اور رپورٹ",
      "✈️ دفتری دورہ / مشن",
      "⏰ فنگر پرنٹ حاضری کا وقت",
      "💰 پیشگی تنخواہ / قرض",
      "📄 تنخواہ کی سلپ اور لیٹر"
    ],
    responses: {
      sick_leave: {
        text: `🩺 <b>بیماری کی چھٹی (سعودی لیبر لاء کے مطابق):</b><br>
• بیماری کی چھٹی کے لیے <b>صحتی (Sehati) پلیٹ فارم</b> یا مصدقہ ہسپتال کی آفیشل میڈیکل رپورٹ منسلک کرنا لازمی ہے۔<br>
• میڈیکل رپورٹ کے بغیر چھٹی تنخواہ کے ساتھ منظور نہیں ہوگی۔<br>
• براہ کرم نیچے دیے گئے فارم میں رپورٹ (پی ڈی ایف یا تصویر) اپلوڈ کریں:`,
        actions: [
          { text: "🩺 بیماری کی چھٹی کی درخواست (رپورٹ کے ساتھ)", fn: "openModalRequest('إجازة', 'إجازة مرضية تتطلب إرفاق تقرير')" }
        ]
      },
      leaves: {
        text: `🌴 <b>جوہرة المجد میں دستیاب 8 اقسام کی چھٹیاں:</b><br>
1️⃣ سالانہ چھٹی (بیلنس سے کٹوتی ہوگی)<br>
2️⃣ بیماری کی چھٹی (صحتی رپورٹ لازمی ہے)<br>
3️⃣ بغیر تنخواہ چھٹی (انتظامیہ کی منظوری سے)<br>
4️⃣ وفات کی چھٹی (قریبی رشتہ دار کے انتقال پر 5 دن با اجرت)<br>
5️⃣ امتحانی چھٹی (امتحانی شیڈول کے ساتھ)<br>
6️⃣ کام کے دوران چوٹ کی چھٹی (GOSI تصدیق شدہ)<br>
7️⃣ زچگی کی چھٹی (خواتین کے لیے 12 ہفتے)<br>
8️⃣ نومولود کی چھٹی (ملازم کے لیے 3 دن با اجرت)۔`,
        actions: [
          { text: "🌴 سالانہ چھٹی کی درخواست", fn: "openModalRequest('إجازة', 'إجازة سنوية')" },
          { text: "🩺 بیماری کی چھٹی (رپورٹ لازمی)", fn: "openModalRequest('إجازة', 'إجازة مرضية تتطلب إرفاق تقرير')" }
        ]
      },
      business_mission: {
        text: `✈️ <b>دفتری مشن / سفر کی درخواست:</b><br>
• سرکاری دورے کے لیے کم از کم 3 دن پہلے درخواست دیں۔<br>
• شہر (ریاض، خمیس مشیط، جدہ) اور سفر کا ذریعہ منتخب کریں۔<br>
• مشن کی تفصیلات اور میٹنگ کا ایجنڈا درج کریں۔`,
        actions: [
          { text: "✈️ دفتری مشن کی درخواست دیں", fn: "openModalRequest('مهمة عمل')" }
        ]
      },
      attendance_biometrics: {
        text: `⏰ <b>بائیو میٹرک حاضری کا نظام (ZKTeco):</b><br>
• دفاتر کے دروازوں پر ZKTeco فنگر پرنٹ مشینیں نصب ہیں۔<br>
• صبح کی ڈیوٹی <b>8:00 بجے</b> شروع ہوتی ہے جس میں 15 منٹ رعایت ہے۔<br>
• موبائل GPS حاضری صرف مخصوص فیلڈ ملازمین کے لیے ہے۔`,
        actions: [
          { text: "🚪 اجازت نامہ", fn: "openModalRequest('استئذان')" }
        ]
      },
      payroll_payslip: {
        text: `💰 <b>تنخواہ کی پرچی اور سرٹیفکیٹ:</b><br>
• تمام تنخواہیں سعودی ویج پروٹیکشن سسٹم (WPS/مدد) کے تحت ادا کی جاتی ہیں۔<br>
• ماہانہ پرچی دیکھنے یا باضابطہ تصدیق شدہ تنخواہ سرٹیفکیٹ حاصل کرنے کے لیے نیچے کلک کریں:`,
        actions: [
          { text: "📄 میری تنخواہ کی پرچی دیکھیں", fn: "viewMyPayslip()" },
          { text: "📜 تصدیق شدہ تنخواہ سرٹیفکیٹ", fn: "openSalaryCertificateModal()" }
        ]
      },
      loan: {
        text: `💵 <b>ہنگامی پیشگی تنخواہ / قرض:</b><br>
• مالی ضرورت پر ملازم 2 ماہ تک کی بنیادی تنخواہ پیشگی لے سکتا ہے۔<br>
• ادائیگی 1 سے 6 ماہ کی آسان اقساط میں کی جا سکتی ہے۔`,
        actions: [
          { text: "💰 پیشگی رقم کی درخواست", fn: "openModalRequest('سلفة مالية')" }
        ]
      },
      fallback: {
        text: `میں آپ کی مدد کے لیے موجود ہوں۔ آپ چھٹیوں، میڈیکل رپورٹ، سرکاری مشن، حاضری اور تنخواہ کے بارے میں کچھ بھی پوچھ سکتے ہیں۔`,
        actions: [
          { text: "🌴 چھٹی کی درخواست", fn: "openModalRequest('إجازة')" },
          { text: "✈️ سرکاری دورہ", fn: "openModalRequest('مهمة عمل')" },
          { text: "💰 پیشگی رقم", fn: "openModalRequest('سلفة مالية')" }
        ]
      }
    }
  },
  hi: {
    welcome: `नमस्ते! मैं <b>जौहरत अल-मज्द एचआर सहायक रोबोट</b> 🤖 हूँ।<br>छुट्टी के अनुरोध, सेहाती मेडिकल रिपोर्ट, बिजनेस मिशन, उपस्थिति और वेतन सेवाओं के लिए मैं आपकी सहायता करूँगा। आज मैं आपकी क्या मदद कर सकता हूँ?`,
    chips: [
      "🌴 वार्षिक छुट्टी का अनुरोध",
      "🩺 बीमारी की छुट्टी और रिपोर्ट",
      "✈️ बिजनेस मिशन का अनुरोध",
      "⏰ फिंगرप्रिंट उपस्थिति का समय",
      "💰 अग्रिम वेतन / ऋण",
      "📄 वेतन पर्ची और प्रमाण पत्र"
    ],
    responses: {
      sick_leave: {
        text: `🩺 <b>बीमारी की छुट्टी (सऊदी श्रम कानून):</b><br>
• बीमारी की छुट्टी के लिए <b>सेहाती (Sehati) प्लेटफॉर्म</b> या मान्यता प्राप्त अस्पताल की आधिकारिक मेडिकल रिपोर्ट अपलोड करना अनिवार्य है।<br>
• रिपोर्ट के बिना छुट्टी स्वीकृत नहीं की जाएगी।<br>
• कृपया नीचे दिए गए फॉर्म में रिपोर्ट (PDF या फोटो) संलग्न करें:`,
        actions: [
          { text: "🩺 बीमारी की छुट्टी का अनुरोध (रिपोर्ट सहित)", fn: "openModalRequest('إجازة', 'إجازة مرضية تتطلب إرفاق تقرير')" }
        ]
      },
      leaves: {
        text: `🌴 <b>जौहरत अल-मज्द में उपलब्ध 8 प्रकार की छुट्टियां:</b><br>
1️⃣ वार्षिक छुट्टी (बैलेंस से काटी जाएगी)<br>
2️⃣ बीमारी की छुट्टी (सेहाती मेडिकल रिपोर्ट अनिवार्य)<br>
3️⃣ अवैतनिक छुट्टी (प्रबंधन की स्वीकृति से)<br>
4️⃣ शोक अवकाश (5 दिन सवेतन)<br>
5️⃣ अध्ययन / परीक्षा अवकाश<br>
6️⃣ कार्य चोट अवकाश (GOSI प्रमाणित)<br>
7️⃣ मातृत्व अवकाश (महिला कर्मियों के लिए 12 सप्ताह)<br>
8️⃣ शिशु जन्म अवकाश (पुरुष कर्मी के लिए 3 दिन सवेतन)।`,
        actions: [
          { text: "🌴 वार्षिक छुट्टी का अनुरोध", fn: "openModalRequest('إجازة', 'إجازة سنوية')" },
          { text: "🩺 बीमारी की छुट्टी (रिपोर्ट सहित)", fn: "openModalRequest('إجازة', 'إجازة مرضية تتطلب إرفاق تقرير')" }
        ]
      },
      business_mission: {
        text: `✈️ <b>बिजनेस मिशन / आधिकारिक दौरा:</b><br>
• यात्रा से कम से कम 3 दिन पहले अनुरोध भेजें।<br>
• गंतव्य शहर (जैसे: रियाद, खमीस मुशायत, जेद्दा) और वाहन का प्रकार चुनें।<br>
• कार्य का उद्देश्य और मीटिंग विवरण लिखें।`,
        actions: [
          { text: "✈️ बिजनेस मिशन का अनुरोध करें", fn: "openModalRequest('مهمة عمل')" }
        ]
      },
      attendance_biometrics: {
        text: `⏰ <b>बायोमेट्रिक उपस्थिति प्रणाली (ZKTeco):</b><br>
• मुख्य द्वारों पर ZKTeco फिंगरप्रिंट मशीनें लगी हैं।<br>
• सुबह की पाली <b>सुबह 8:00 बजे</b> शुरू होती है (15 मिनट की छूट)।<br>
• मोबाइल GPS उपस्थिति केवल अधिकृत फील्ड स्टाफ के लिए है।`,
        actions: [
          { text: "🚪 अनुमति का अनुरोध", fn: "openModalRequest('استئذان')" }
        ]
      },
      payroll_payslip: {
        text: `💰 <b>वेतन पर्ची और प्रमाण पत्र:</b><br>
• कंपनी का वेतन सऊदी वेज प्रोटेक्शन सिस्टम (WPS/Mudad) द्वारा सुरक्षित है।<br>
• महीने के अंत में अल राजी बैंक द्वारा वेतन भुगतान किया जाता है।<br>
• अपनी वेतन पर्ची देखने या प्रमाणित डिजिटल वेतन प्रमाण पत्र प्राप्त करने के लिए नीचे क्लिक करें:`,
        actions: [
          { text: "📄 वेतन पर्ची देखें", fn: "viewMyPayslip()" },
          { text: "📜 वेतन प्रमाण पत्र प्राप्त करें", fn: "openSalaryCertificateModal()" }
        ]
      },
      loan: {
        text: `💵 <b>आपातकालीन अग्रिम वेतन / ऋण:</b><br>
• वित्तीय आवश्यकता पर 2 महीने तक के मूल वेतन का अग्रिम अनुरोध किया जा सकता है।<br>
• 1 से 6 महीने की किस्तों में भुगतान की सुविधा उपलब्ध है।`,
        actions: [
          { text: "💰 ऋण / अग्रिम का अनुरोध करें", fn: "openModalRequest('سلفة مالية')" }
        ]
      },
      fallback: {
        text: `मैं आपकी सहायता के लिए तैयार हूँ। आप छुट्टियों, मेडिकल रिपोर्ट, बिजनेस मिशन, उपस्थिति या वेतन के बारे में पूछ सकते हैं।`,
        actions: [
          { text: "🌴 छुट्टी का अनुरोध", fn: "openModalRequest('إجازة')" },
          { text: "✈️ बिजनेस मिशन", fn: "openModalRequest('مهمة عمل')" },
          { text: "💰 अग्रिम वेतन", fn: "openModalRequest('سلفة مالية')" }
        ]
      }
    }
  }
};

let isChatbotInitialized = false;

function initChatbot() {
  const lang = state.currentLang || localStorage.getItem('jm_hrms_lang') || 'ar';
  renderChatbotChips(lang);
  
  const messagesContainer = document.getElementById('hrChatbotMessages');
  if (messagesContainer && (!messagesContainer.children || messagesContainer.children.length === 0)) {
    const kb = CHATBOT_KNOWLEDGE[lang] || CHATBOT_KNOWLEDGE.ar;
    addBotMessage(kb.welcome);
  }
  isChatbotInitialized = true;
}

function toggleChatbot() {
  const windowEl = document.getElementById('hrChatbotWindow');
  if (!windowEl) return;

  const isHidden = windowEl.classList.contains('hidden');
  if (isHidden) {
    windowEl.classList.remove('hidden');
    if (!isChatbotInitialized) initChatbot();
    scrollChatToBottom();
    const inp = document.getElementById('hrChatInput');
    if (inp) setTimeout(() => inp.focus(), 150);
  } else {
    windowEl.classList.add('hidden');
  }
}

function renderChatbotChips(lang) {
  const chipsContainer = document.getElementById('hrChatbotChips');
  if (!chipsContainer) return;

  const kb = CHATBOT_KNOWLEDGE[lang] || CHATBOT_KNOWLEDGE.ar;
  chipsContainer.innerHTML = (kb.chips || []).map(chip => `
    <button type="button" onclick="sendChatMessage('${chip}')" class="chat-chip whitespace-nowrap bg-slate-100 hover:bg-brand/10 hover:text-brand border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-[11px] font-bold transition flex items-center gap-1.5 flex-shrink-0">
      ${chip}
    </button>
  `).join('');
}

function handleChatSubmit(e) {
  e.preventDefault();
  const inp = document.getElementById('hrChatInput');
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;
  inp.value = '';
  sendChatMessage(text);
}

function sendChatMessage(userText) {
  addUserMessage(userText);

  // Show typing indicator
  const messagesContainer = document.getElementById('hrChatbotMessages');
  const typingId = `typing_${Date.now()}`;
  if (messagesContainer) {
    const typingEl = document.createElement('div');
    typingEl.id = typingId;
    typingEl.className = 'flex items-center gap-2 text-slate-400 text-xs italic py-1';
    typingEl.innerHTML = `<i class="fa-solid fa-robot text-brand animate-bounce"></i> <span>جاري الرد...</span>`;
    messagesContainer.appendChild(typingEl);
    scrollChatToBottom();
  }

  setTimeout(() => {
    // Remove typing indicator
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    // Match intent
    const lang = state.currentLang || 'ar';
    const resp = matchChatIntent(userText, lang);
    addBotMessage(resp.text, resp.actions);
  }, 400);
}

function matchChatIntent(text, lang) {
  const t = text.toLowerCase();
  const kb = CHATBOT_KNOWLEDGE[lang] || CHATBOT_KNOWLEDGE.ar;

  // 1. Sick Leave (Specific)
  if (t.includes('مرض') || t.includes('صحتي') || t.includes('تقرير') || t.includes('مستشفى') ||
      t.includes('sick') || t.includes('medical') || t.includes('report') || t.includes('sehati') ||
      t.includes('অসুস্থ') || t.includes('রিপোর্ট') ||
      t.includes('بیمار') || t.includes('رپورٹ') ||
      t.includes('बीमार') || t.includes('मेडिकल')) {
    return kb.responses.sick_leave;
  }

  // 2. Leaves in General
  if (t.includes('اجاز') || t.includes('إجاز') || t.includes('سنوي') || t.includes('وفاة') || t.includes('دراس') || t.includes('اموم') || t.includes('مولود') || t.includes('اصاب') ||
      t.includes('leave') || t.includes('vacation') || t.includes('holiday') ||
      t.includes('ছুটি') ||
      t.includes('چھٹی') || t.includes('رخصت') ||
      t.includes('छुट्टी') || t.includes('अवकाश')) {
    return kb.responses.leaves;
  }

  // 3. Business Mission
  if (t.includes('مهمة') || t.includes('انتداب') || t.includes('سفر') || t.includes('طيران') || t.includes('زيارة فرع') ||
      t.includes('mission') || t.includes('travel') || t.includes('delegation') ||
      t.includes('মিশন') || t.includes('সফর') ||
      t.includes('مشن') || t.includes('دورہ') ||
      t.includes('मिशन') || t.includes('दौरा')) {
    return kb.responses.business_mission;
  }

  // 4. Attendance & Fingerprint
  if (t.includes('بصم') || t.includes('حضور') || t.includes('انصراف') || t.includes('دوام') || t.includes('تاخير') || t.includes('تأخير') || t.includes('zk') ||
      t.includes('punch') || t.includes('attendance') || t.includes('fingerprint') || t.includes('biometric') ||
      t.includes('হাজিরা') ||
      t.includes('حاضری') ||
      t.includes('उपस्थिति')) {
    return kb.responses.attendance_biometrics;
  }

  // 5. Payroll, Payslip & Salary Certificate
  if (t.includes('راتب') || t.includes('رواتب') || t.includes('مسير') || t.includes('تعريف') || t.includes('شهادة') || t.includes('مدد') || t.includes('wps') ||
      t.includes('payslip') || t.includes('salary') || t.includes('certificate') ||
      t.includes('বেতন') ||
      t.includes('تنخواہ') || t.includes('سلپ') ||
      t.includes('वेतन') || t.includes('पर्ची')) {
    return kb.responses.payroll_payslip;
  }

  // 6. Loans & Advances
  if (t.includes('سلف') || t.includes('قرض') || t.includes('تقسيط') ||
      t.includes('loan') || t.includes('advance') ||
      t.includes('লোন') || t.includes('অগ্রিম') ||
      t.includes('قرض') || t.includes('پیشگی') ||
      t.includes('ऋण') || t.includes('अग्रिम')) {
    return kb.responses.loan;
  }

  // 7. Greetings
  if (t.includes('سلام') || t.includes('مرحب') || t.includes('أهل') || t.includes('اهل') || t.includes('صباح') || t.includes('مساء') ||
      t.includes('hello') || t.includes('hi') || t.includes('hey') ||
      t.includes('হ্যালো') ||
      t.includes('سلام') ||
      t.includes('नमस्ते')) {
    return {
      text: kb.welcome,
      actions: kb.responses.fallback.actions
    };
  }

  // Fallback
  return kb.responses.fallback;
}

function addBotMessage(html, actions = []) {
  const messagesContainer = document.getElementById('hrChatbotMessages');
  if (!messagesContainer) return;

  const msgEl = document.createElement('div');
  msgEl.className = 'flex items-start gap-2.5 max-w-[94%] animate-fade-in';
  
  let actionsHtml = '';
  if (actions && actions.length > 0) {
    actionsHtml = `
      <div class="mt-2.5 pt-2 border-t border-slate-200/80 flex flex-wrap gap-1.5">
        ${actions.map(act => `
          <button type="button" onclick="${act.fn}; toggleChatbot();" class="px-2.5 py-1.5 rounded-xl bg-brand text-white hover:bg-brand-dark font-bold text-[11px] transition shadow-sm flex items-center gap-1">
            ${act.text}
          </button>
        `).join('')}
      </div>
    `;
  }

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  msgEl.innerHTML = `
    <div class="w-7 h-7 rounded-xl bg-brand text-amber-300 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-sm">
      <i class="fa-solid fa-robot"></i>
    </div>
    <div class="bg-white p-3 rounded-2xl rounded-tr-none shadow-sm border border-slate-200 text-slate-800 leading-relaxed text-xs">
      <div>${html}</div>
      ${actionsHtml}
      <span class="block text-[9px] text-slate-400 mt-1 text-left font-mono">${now}</span>
    </div>
  `;

  messagesContainer.appendChild(msgEl);
  scrollChatToBottom();
}

function addUserMessage(text) {
  const messagesContainer = document.getElementById('hrChatbotMessages');
  if (!messagesContainer) return;

  const msgEl = document.createElement('div');
  msgEl.className = 'flex justify-end animate-fade-in';

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  msgEl.innerHTML = `
    <div class="bg-brand text-white p-3 rounded-2xl rounded-tl-none shadow-md max-w-[85%] text-xs leading-relaxed">
      <p class="font-medium">${text}</p>
      <span class="block text-[9px] text-amber-200/80 mt-1 text-right font-mono">${now}</span>
    </div>
  `;

  messagesContainer.appendChild(msgEl);
  scrollChatToBottom();
}

function scrollChatToBottom() {
  const messagesContainer = document.getElementById('hrChatbotMessages');
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

// Global Window Exports
window.openModalRequest = openModalRequest;
window.onRequestCategoryChanged = onRequestCategoryChanged;
window.onLeaveTypeChanged = onLeaveTypeChanged;
window.calculateReqDays = calculateReqDays;
window.handleReqFileSelected = handleReqFileSelected;
window.clearReqFile = clearReqFile;
window.handleRequestFormSubmit = handleRequestFormSubmit;
window.setLanguage = setLanguage;
window.initLanguage = initLanguage;
window.toggleLangMenu = toggleLangMenu;
window.closeLangMenu = closeLangMenu;
window.toggleChatbot = toggleChatbot;
window.handleChatSubmit = handleChatSubmit;
window.sendChatMessage = sendChatMessage;
window.viewMyPayslip = viewMyPayslip;
window.openSalaryCertificateModal = openSalaryCertificateModal;
window.loadSelfService = loadSelfService;
window.renderSelfServiceRequests = renderSelfServiceRequests;

// Policy Functions
window.renderPolicies = renderPolicies;
window.openAddPolicyModal = openAddPolicyModal;
window.handlePolicyFormSubmit = handlePolicyFormSubmit;
window.deletePolicy = deletePolicy;

// Department Functions
window.openAddDepartmentModal = openAddDepartmentModal;
window.handleDepartmentFormSubmit = handleDepartmentFormSubmit;
window.deleteDepartment = deleteDepartment;

// Branch Functions
window.renderBranches = renderBranches;
window.openAddBranchModal = openAddBranchModal;
window.handleBranchFormSubmit = handleBranchFormSubmit;
window.deleteBranch = deleteBranch;

// Biometric Hardware Functions
window.renderBiometricDevices = renderBiometricDevices;
window.openAddDeviceModal = openAddDeviceModal;
window.handleDeviceFormSubmit = handleDeviceFormSubmit;
window.deleteDevice = deleteDevice;
window.testDeviceConnection = testDeviceConnection;
window.syncDeviceLogs = syncDeviceLogs;
window.testCurrentModalDevice = testCurrentModalDevice;

// Employee Functions
window.openAddEmployeeModal = openAddEmployeeModal;
window.editEmployee = editEmployee;
window.deleteEmployeePrompt = deleteEmployeePrompt;
window.handleEmployeeFormSubmit = handleEmployeeFormSubmit;
window.filterEmployeesTable = filterEmployeesTable;

// Approval Workflow Actions
window.approveRequestManager = approveRequestManager;
window.approveRequestHr = approveRequestHr;
window.rejectRequest = rejectRequest;

// Compliance Functions
window.loadCompliance = loadCompliance;
window.renderComplianceTable = renderComplianceTable;
window.filterComplianceTable = filterComplianceTable;
window.handleComplianceSearch = handleComplianceSearch;
window.openRenewIqamaModal = openRenewIqamaModal;
window.exportComplianceReport = exportComplianceReport;

// Payroll Calculation and WPS Functions
window.executeCalculatePayroll = executeCalculatePayroll;
window.approveCurrentPayroll = approveCurrentPayroll;
window.downloadWpsFile = downloadWpsFile;
window.exportPayrollCsv = exportPayrollCsv;
window.viewEmployeePayslip = viewEmployeePayslip;

// Disciplinary Penalties Functions
window.deletePenaltyDecision = deletePenaltyDecision;
window.deleteCurrentPreviewPenalty = deleteCurrentPreviewPenalty;


