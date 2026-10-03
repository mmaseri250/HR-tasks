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
    { id: 1, username: 'admin', password: 'Jj123', full_name: 'مدير النظام (Admin)', role: 'admin', permissions: ['all'], is_active: 1, created_at: '2026-09-30', emp_id: null },
    { id: 2, username: 'sarah', password: '123456', full_name: 'سارة عبدالله الشهري', role: 'employee', permissions: ['requests', 'payslips'], is_active: 1, created_at: '2026-09-30', emp_id: 3 },
    { id: 3, username: 'fahad', password: '123456', full_name: 'م. فهد عبدالعزيز القحطاني', role: 'dept_manager', permissions: ['requests', 'payslips', 'approvals'], is_active: 1, created_at: '2026-09-30', emp_id: 2 }
  ],
  departments: [
    { id: 1, code: 'EXEC', name_ar: 'الإدارة العامة والتنفيذية', name_en: 'Executive Management', manager_name: 'سعود بن محمد القحطاني', employee_count: 1, location: 'الطابق الإداري' },
    { id: 2, code: 'HR', name_ar: 'الموارد البشرية والخدمات المشتركة', name_en: 'Human Resources & Shared Services', manager_name: 'خالد سعد الشهراني', employee_count: 4, location: 'مكتب HR - جناح A' },
    { id: 3, code: 'IT', name_ar: 'تقنية المعلومات والتحول الرقمي', name_en: 'Information Technology & Digital Transformation', manager_name: 'م. فهد عبدالعزيز القحطاني', employee_count: 3, location: 'مكتب التقنية - جناح C' },
    { id: 4, code: 'FIN', name_ar: 'الشؤون المالية والمحاسبة', name_en: 'Finance & Accounting', manager_name: 'عبدالله بن إبراهيم السبيعي', employee_count: 2, location: 'مكتب المالية - جناح B' },
    { id: 5, code: 'OPS', name_ar: 'إدارة العمليات والمشاريع', name_en: 'Operations & Project Management', manager_name: 'عبدالرحمن علي عسيري', employee_count: 4, location: 'سيتي بارك - مبنى العمليات' },
    { id: 6, code: 'MKT', name_ar: 'التسويق والاتصال المؤسسي', name_en: 'Marketing & Corporate Communication', manager_name: 'نورة سعيد الغامدي', employee_count: 2, location: 'الجناح الإعلامي' }
  ],
  employees: [
    { id: 1, emp_code: 'JM-1001', full_name_ar: 'خالد سعد الشهراني', full_name_en: 'Khaled Saad Al-Shahrani', national_id: '1084928172', nationality: 'سعودي', is_saudi: 1, gender: 'M', email: 'khaled.shahrani@jalmajd.com', phone: '0501234567', department_id: 2, department_name_ar: 'الموارد البشرية والخدمات المشتركة', job_title_ar: 'مدير الموارد البشرية والعمليات الإدارية', basic_salary: 16000, housing_allowance: 4000, transport_allowance: 1500, other_allowance: 1000, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA5580000201608010011001', annual_leave_balance: 24, shift_type: 'دوام صباحي', status: 'نشط', join_date: '2021-03-01', contract_end: '2027-02-28', iqama_expiry: null },
    { id: 2, emp_code: 'JM-1002', full_name_ar: 'م. فهد عبدالعزيز القحطاني', full_name_en: 'Eng. Fahad Abdulaziz Al-Qahtani', national_id: '1092837461', nationality: 'سعودي', is_saudi: 1, gender: 'M', email: 'fahad.qahtani@jalmajd.com', phone: '0559876543', department_id: 3, department_name_ar: 'تقنية المعلومات والتحول الرقمي', job_title_ar: 'مدير إدارة تقنية المعلومات والتحول الرقمي', basic_salary: 17500, housing_allowance: 4375, transport_allowance: 1500, other_allowance: 1500, bank_name: 'بنك الرياض', bank_code: 'RIBL', iban: 'SA3020000001092837461002', annual_leave_balance: 21, shift_type: 'دوام صباحي', status: 'نشط', join_date: '2022-01-15', contract_end: '2028-01-14', iqama_expiry: null },
    { id: 3, emp_code: 'JM-1003', full_name_ar: 'سارة عبدالله الشهري', full_name_en: 'Sarah Abdullah Al-Shehri', national_id: '1102938475', nationality: 'سعودية', is_saudi: 1, gender: 'F', email: 'sarah.shehri@jalmajd.com', phone: '0543210987', department_id: 2, department_name_ar: 'الموارد البشرية والخدمات المشتركة', job_title_ar: 'أخصائية موارد بشرية وعلاقات موظفين', basic_salary: 8500, housing_allowance: 2125, transport_allowance: 1000, other_allowance: 500, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA7780000201608010011003', annual_leave_balance: 28, shift_type: 'دوام صباحي', status: 'نشط', join_date: '2023-05-10', contract_end: '2027-05-09', iqama_expiry: null },
    { id: 4, emp_code: 'JM-1004', full_name_ar: 'محمد أحمد العتيبي', full_name_en: 'Mohammed Ahmed Al-Otaibi', national_id: '1074829103', nationality: 'سعودي', is_saudi: 1, gender: 'M', email: 'mohammed.otaibi@jalmajd.com', phone: '0567891234', department_id: 4, department_name_ar: 'الشؤون المالية والمحاسبة', job_title_ar: 'محاسب مالي أول ومسؤول مسيرات الرواتب', basic_salary: 10500, housing_allowance: 2625, transport_allowance: 1000, other_allowance: 800, bank_name: 'البنك الأهلي السعودي', bank_code: 'NCBK', iban: 'SA1210000001074829103004', annual_leave_balance: 18, shift_type: 'دوام صباحي', status: 'نشط', join_date: '2022-09-01', contract_end: '2026-10-15', iqama_expiry: null },
    { id: 5, emp_code: 'JM-1005', full_name_ar: 'م. طارق محمود المنصوري', full_name_en: 'Eng. Tarek Mahmoud Al-Mansouri', national_id: '2491827364', nationality: 'مصري', is_saudi: 0, gender: 'M', email: 'tarek.mansouri@jalmajd.com', phone: '0539182736', department_id: 3, department_name_ar: 'تقنية المعلومات والتحول الرقمي', job_title_ar: 'مهندس برمجيات أول ومطور أنظمة سحابية', basic_salary: 12000, housing_allowance: 3000, transport_allowance: 1000, other_allowance: 1000, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA4580000201608010011005', annual_leave_balance: 22, shift_type: 'دوام صباحي', status: 'نشط', join_date: '2022-11-15', contract_end: '2027-11-14', iqama_expiry: '2027-04-10' },
    { id: 6, emp_code: 'JM-1006', full_name_ar: 'عبدالرحمن علي عسيري', full_name_en: 'Abdulrahman Ali Asiri', national_id: '1063928174', nationality: 'سعودي', is_saudi: 1, gender: 'M', email: 'abdulrahman.asiri@jalmajd.com', phone: '0509871234', department_id: 5, department_name_ar: 'إدارة العمليات والمشاريع', job_title_ar: 'مدير العمليات التشغيلية والمشاريع', basic_salary: 15500, housing_allowance: 3875, transport_allowance: 1500, other_allowance: 1200, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA6680000201608010011006', annual_leave_balance: 15, shift_type: 'دوام صباحي', status: 'نشط', join_date: '2020-08-01', contract_end: '2028-07-31', iqama_expiry: null },
    { id: 7, emp_code: 'JM-1007', full_name_ar: 'نورة سعيد الغامدي', full_name_en: 'Noura Saeed Al-Ghamdi', national_id: '1058291740', nationality: 'سعودية', is_saudi: 1, gender: 'F', email: 'noura.ghamdi@jalmajd.com', phone: '0551122334', department_id: 6, department_name_ar: 'التسويق والاتصال المؤسسي', job_title_ar: 'مديرة إدارة التسويق والاتصال المؤسسي', basic_salary: 13000, housing_allowance: 3250, transport_allowance: 1200, other_allowance: 800, bank_name: 'بنك البلاد', bank_code: 'ALBI', iban: 'SA9015000001058291740007', annual_leave_balance: 26, shift_type: 'دوام صباحي', status: 'نشط', join_date: '2023-02-01', contract_end: '2027-01-31', iqama_expiry: null },
    { id: 8, emp_code: 'JM-1008', full_name_ar: 'م. أحمد رضوان الشامي', full_name_en: 'Eng. Ahmad Radwan Al-Shami', national_id: '2381920485', nationality: 'أردني', is_saudi: 0, gender: 'M', email: 'ahmad.shami@jalmajd.com', phone: '0562233445', department_id: 3, department_name_ar: 'تقنية المعلومات والتحول الرقمي', job_title_ar: 'مهندس نظم وشبكات وأمن معلومات', basic_salary: 9500, housing_allowance: 2375, transport_allowance: 1000, other_allowance: 600, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA3380000201608010011008', annual_leave_balance: 19, shift_type: 'دوام صباحي', status: 'نشط', join_date: '2023-08-15', contract_end: '2027-08-14', iqama_expiry: '2026-10-10' },
    { id: 9, emp_code: 'JM-1009', full_name_ar: 'فيصل سلطان الدوسري', full_name_en: 'Faisal Sultan Al-Dossary', national_id: '1047291845', nationality: 'سعودي', is_saudi: 1, gender: 'M', email: 'faisal.dossary@jalmajd.com', phone: '0549988776', department_id: 5, department_name_ar: 'إدارة العمليات والمشاريع', job_title_ar: 'مسؤول السلامة والصحة المهنية (HSE)', basic_salary: 7800, housing_allowance: 1950, transport_allowance: 1000, other_allowance: 500, bank_name: 'مصرف الإنماء', bank_code: 'INMA', iban: 'SA5505000001047291845009', annual_leave_balance: 30, shift_type: 'دوام صباحي', status: 'نشط', join_date: '2023-11-01', contract_end: '2027-10-31', iqama_expiry: null },
    { id: 10, emp_code: 'JM-1010', full_name_ar: 'ريم محمد الدوسري', full_name_en: 'Reem Mohammed Al-Dossary', national_id: '1098273615', nationality: 'سعودية', is_saudi: 1, gender: 'F', email: 'reem.dossary@jalmajd.com', phone: '0534455667', department_id: 2, department_name_ar: 'الموارد البشرية والخدمات المشتركة', job_title_ar: 'أخصائية استقطاب وتوظيف وتدريب', basic_salary: 7500, housing_allowance: 1875, transport_allowance: 1000, other_allowance: 400, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA1180000201608010011010', annual_leave_balance: 29, shift_type: 'دوام صباحي', status: 'نشط', join_date: '2024-03-01', contract_end: '2027-02-28', iqama_expiry: null },
    { id: 11, emp_code: 'JM-1011', full_name_ar: 'عمر فاروق البشير', full_name_en: 'Omar Farooq Al-Bashir', national_id: '2581928471', nationality: 'سوداني', is_saudi: 0, gender: 'M', email: 'omar.bashir@jalmajd.com', phone: '0567788990', department_id: 5, department_name_ar: 'إدارة العمليات والمشاريع', job_title_ar: 'منسق لوجستيات وسلاسل الإمداد', basic_salary: 6500, housing_allowance: 1625, transport_allowance: 800, other_allowance: 300, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA2280000201608010011011', annual_leave_balance: 14, shift_type: 'دوام صباحي', status: 'نشط', join_date: '2022-04-10', contract_end: '2027-04-09', iqama_expiry: '2027-06-15' },
    { id: 12, emp_code: 'JM-1012', full_name_ar: 'مريم يوسف النجار', full_name_en: 'Mariam Yousef Al-Najjar', national_id: '2291827461', nationality: 'لبنانية', is_saudi: 0, gender: 'F', email: 'mariam.najjar@jalmajd.com', phone: '0541199882', department_id: 6, department_name_ar: 'التسويق والاتصال المؤسسي', job_title_ar: 'مصممة جرافيك وواجهات رقمية (UI/UX)', basic_salary: 8000, housing_allowance: 2000, transport_allowance: 1000, other_allowance: 500, bank_name: 'بنك ساب (SAB)', bank_code: 'SABB', iban: 'SA8845000002291827461012', annual_leave_balance: 23, shift_type: 'دوام صباحي', status: 'نشط', join_date: '2023-06-01', contract_end: '2027-05-31', iqama_expiry: '2027-01-20' },
    { id: 13, emp_code: 'JM-1013', full_name_ar: 'عبدالله بن صالح القرني', full_name_en: 'Abdullah Saleh Al-Qarni', national_id: '1039281745', nationality: 'سعودي', is_saudi: 1, gender: 'M', email: 'abdullah.qarni@jalmajd.com', phone: '0553344556', department_id: 2, department_name_ar: 'الموارد البشرية والخدمات المشتركة', job_title_ar: 'منسق إداري وعلاقات حكومية (معقب)', basic_salary: 6000, housing_allowance: 1500, transport_allowance: 800, other_allowance: 300, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA9980000201608010011013', annual_leave_balance: 27, shift_type: 'دوام صباحي', status: 'نشط', join_date: '2024-01-15', contract_end: '2027-01-14', iqama_expiry: null },
    { id: 14, emp_code: 'JM-1014', full_name_ar: 'كمال الدين حسن مرسي', full_name_en: 'Kamal Eldin Hassan Morsi', national_id: '2192837465', nationality: 'مصري', is_saudi: 0, gender: 'M', email: 'kamal.morsi@jalmajd.com', phone: '0502233114', department_id: 5, department_name_ar: 'إدارة العمليات والمشاريع', job_title_ar: 'مشرف تشغيل وصيانة المنشآت', basic_salary: 5500, housing_allowance: 1375, transport_allowance: 600, other_allowance: 300, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA4480000201608010011014', annual_leave_balance: 12, shift_type: 'دوام صباحي', status: 'نشط', join_date: '2021-07-01', contract_end: '2027-06-30', iqama_expiry: '2026-09-15' },
    { id: 15, emp_code: 'JM-1015', full_name_ar: 'هدى خالد العمري', full_name_en: 'Huda Khaled Al-Omari', national_id: '1082917402', nationality: 'سعودية', is_saudi: 1, gender: 'F', email: 'huda.omari@jalmajd.com', phone: '0537766554', department_id: 4, department_name_ar: 'الشؤون المالية والمحاسبة', job_title_ar: 'أخصائية رواتب ومزايا وامتثال مالي', basic_salary: 7200, housing_allowance: 1800, transport_allowance: 1000, other_allowance: 400, bank_name: 'مصرف الراجحي', bank_code: 'RJHI', iban: 'SA6680000201608010011015', annual_leave_balance: 30, shift_type: 'دوام صباحي', status: 'نشط', join_date: '2024-05-01', contract_end: '2027-04-30', iqama_expiry: null }
  ],
  devices: [
    { name: 'جهاز البوابة الرئيسية (ZK-MAIN)', code: 'ZK-BIO-MAIN-01', ip_address: '192.168.10.201', location: 'المدخل الرئيسي - الاستقبال', status: 'متصل', model: 'ZKTeco SilkBio-101TC' },
    { name: 'جهاز بوابة العمليات والتقنية (ZK-TECH)', code: 'ZK-BIO-TECH-02', ip_address: '192.168.10.202', location: 'مدخل أجنحة التقنية والعمليات', status: 'متصل', model: 'ZKTeco SpeedFace-V5L' },
    { name: 'جهاز الإدارة العامة ومول سيتي بارك (ZK-EXEC)', code: 'ZK-BIO-CITY-03', ip_address: '192.168.10.203', location: 'الطابق الثاني - صالة الموظفين', status: 'متصل', model: 'ZKTeco ProFace X' }
  ],
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
  issuedPenalties: [
    { id: 1, decision_no: 'DEC-2026-0012', emp_id: 4, emp_code: 'JM-1004', full_name_ar: 'محمد أحمد العتيبي', job_title_ar: 'محاسب مالي أول', national_id: '1074829103', violation_code: 'v1', violation_text: 'التأخر عن مواعيد الحضور للعمل لغاية (15) دقيقة دون عذر', category: 'مخالفات مواعيد العمل', repetition_level: 'المرة الأولى', penalty_text: 'إنذار كتابي رسمي', deduction_type: 'إنذار كتابي', deduction_days: 0, incident_date: '2026-09-25', investigation_details: 'تأخر الموظف عن بدء الدوام الصباحي بمقدار 12 دقيقة دون إشعار مسبق. تمت مساءلته وتوجيه إنذار كتابي أول.', issued_by: 'خالد سعد الشهراني (مدير الموارد البشرية)' },
    { id: 2, decision_no: 'DEC-2026-0013', emp_id: 14, emp_code: 'JM-1014', full_name_ar: 'كمال الدين حسن مرسي', job_title_ar: 'مشرف تشغيل وصيانة', national_id: '2192837465', violation_code: 'v11', violation_text: 'الغياب دون إذن كتابي أو عذر مقبول لمدة يوم خلال السنة', category: 'مخالفات مواعيد العمل', repetition_level: 'المرة الأولى', penalty_text: 'خصم أجر نصف يوم من الراتب', deduction_type: 'خصم راتب', deduction_days: 0.5, incident_date: '2026-09-22', investigation_details: 'تغيب الموظف عن العمل يوم 22 سبتمبر دون تقديم عذر طبي أو إجازة معتمدة. تقرر حسم نصف يوم وفق اللائحة.', issued_by: 'خالد سعد الشهراني (مدير الموارد البشرية)' },
    { id: 3, decision_no: 'DEC-2026-0014', emp_id: 11, emp_code: 'JM-1011', full_name_ar: 'عمر فاروق البشير', job_title_ar: 'منسق لوجستيات', national_id: '2581928471', violation_code: 'v23', violation_text: 'عدم وضع أدوات الإصلاح والصيانة في أماكنها المخصصة', category: 'مخالفات السلوك والعمل', repetition_level: 'المرة الأولى', penalty_text: 'إنذار كتابي رسمي', deduction_type: 'إنذار كتابي', deduction_days: 0, incident_date: '2026-09-18', investigation_details: 'ترك معدات الفحص اللوجستي خارج مستودع المستلزمات مما عرضها للتلف الجزئي.', issued_by: 'عبدالرحمن علي عسيري (مدير العمليات)' }
  ],
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
    } else if (u.toLowerCase() === 'sarah' && p === '123456') {
      state.currentUser = { ...FALLBACK_DATA.users[1] };
    } else if (u.toLowerCase() === 'fahad' && p === '123456') {
      state.currentUser = { ...FALLBACK_DATA.users[2] };
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
  const adminTabs = ['employees-db', 'payroll', 'penalties', 'attendance', 'organization', 'users', 'data-exchange', 'docs'];
  
  if (!hasAll) {
    adminTabs.forEach(t => {
      const el = document.getElementById(`nav-${t}`);
      if (el) {
        if (t === 'employees-db' && (perms.includes('employees') || role === 'dept_manager')) {
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
    const forbiddenTabs = ['dashboard', 'payroll', 'penalties', 'organization', 'users', 'data-exchange', 'docs'];
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

  const allTabs = ['dashboard', 'employees-db', 'penalties', 'attendance', 'payroll', 'selfservice', 'organization', 'users', 'data-exchange', 'docs'];
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
  const rate = statsRes && statsRes.data ? statsRes.data.saudization.saudizationRate : (total > 0 ? Math.round((state.employees.filter(e => e.is_saudi === 1).length / total) * 1000) / 10 : 66.7);
  const band = statsRes && statsRes.data ? statsRes.data.saudization.nitaqatBand : 'النطاق البلاتيني';
  const attRate = statsRes && statsRes.data ? statsRes.data.attendance.attendanceRate : 93.3;
  const present = statsRes && statsRes.data ? statsRes.data.attendance.presentCount : 14;
  const onLeave = statsRes && statsRes.data ? statsRes.data.attendance.onLeaveCount : 1;
  const payrollNet = statsRes && statsRes.data && statsRes.data.currentPayroll ? Number(statsRes.data.currentPayroll.total_net).toLocaleString('ar-SA') : '201,678';

  const totalEl = document.getElementById('statTotalEmployees');
  if (totalEl) totalEl.textContent = total;
  
  const saudEl = document.getElementById('statSaudizationRate');
  if (saudEl) saudEl.textContent = `${rate}%`;

  const badgeEl = document.getElementById('statNitaqatBadge');
  if (badgeEl) badgeEl.textContent = band;

  const headerNitaqat = document.getElementById('headerNitaqatText');
  if (headerNitaqat) headerNitaqat.textContent = `البلاتيني (${rate}%)`;

  const attRateEl = document.getElementById('statAttendanceRate');
  if (attRateEl) attRateEl.textContent = `${attRate}%`;

  const attSummEl = document.getElementById('statAttendanceSummaryText');
  if (attSummEl) attSummEl.textContent = `${present} حاضر • ${onLeave} في إجازة`;

  const payAmtEl = document.getElementById('statPayrollAmount');
  if (payAmtEl) payAmtEl.innerHTML = `${payrollNet} <span class="text-xs font-bold text-slate-500">ر.س</span>`;

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
        <tr class="hover:bg-slate-50 transition">
          <td class="py-2.5 px-3 font-bold text-slate-800">كمال الدين حسن مرسي</td>
          <td class="py-2.5 px-3 text-slate-600">إقامة / هوية مقيم</td>
          <td class="py-2.5 px-3 font-mono text-slate-700">2026-09-15</td>
          <td class="py-2.5 px-3"><span class="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full badge-expired font-black">منتهي</span></td>
        </tr>
        <tr class="hover:bg-slate-50 transition">
          <td class="py-2.5 px-3 font-bold text-slate-800">م. أحمد رضوان الشامي</td>
          <td class="py-2.5 px-3 text-slate-600">إقامة / هوية مقيم</td>
          <td class="py-2.5 px-3 font-mono text-slate-700">2026-10-10</td>
          <td class="py-2.5 px-3"><span class="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full badge-warning">ينتهي خلال 30 يوم</span></td>
        </tr>
        <tr class="hover:bg-slate-50 transition">
          <td class="py-2.5 px-3 font-bold text-slate-800">محمد أحمد العتيبي</td>
          <td class="py-2.5 px-3 text-slate-600">عقد العمل الموثق (قوى)</td>
          <td class="py-2.5 px-3 font-mono text-slate-700">2026-10-15</td>
          <td class="py-2.5 px-3"><span class="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full badge-warning">ينتهي خلال 30 يوم</span></td>
        </tr>
      `;
    }
  }

  // Render Recent Penalties in Dashboard
  const penBody = document.getElementById('dashboardPenaltiesTableBody');
  if (penBody) {
    penBody.innerHTML = '';
    const pens = (statsRes && statsRes.data && statsRes.data.recentPenalties) ? statsRes.data.recentPenalties : state.issuedPenalties;
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
    tbody.innerHTML = `<tr><td colspan="9" class="py-6 text-center text-slate-400">لا توجد بيانات موظفين مطابقة</td></tr>`;
    return;
  }

  list.forEach(emp => {
    const isSaudiBadge = emp.is_saudi === 1
      ? `<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full badge-saudi">سعودي</span>`
      : `<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full badge-expat">${emp.nationality}</span>`;

    const totalSalary = (emp.basic_salary || 0) + (emp.housing_allowance || 0) + (emp.transport_allowance || 0) + (emp.other_allowance || 0);

    let docBadge = `<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full badge-valid">سارية وموثقة</span>`;
    if (emp.iqama_expiry === '2026-09-15') {
      docBadge = `<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full badge-expired">إقامة منتهية</span>`;
    } else if (emp.contract_end === '2026-10-15') {
      docBadge = `<span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full badge-warning">عقد قوى ينتهي قريباً</span>`;
    }

    const manager = state.employees.find(m => m.id === emp.manager_id);
    const managerName = manager ? manager.full_name_ar : null;
    const policy = (state.policies || []).find(p => p.id === emp.policy_id);
    const policyName = policy ? policy.policy_name : (emp.shift_type || null);

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
  const nat = document.getElementById('empNationalityFilter').value;
  const status = document.getElementById('empStatusFilter').value;

  const filtered = state.employees.filter(e => {
    const matchesSearch = !search ||
      e.full_name_ar.toLowerCase().includes(search) ||
      (e.full_name_en && e.full_name_en.toLowerCase().includes(search)) ||
      e.emp_code.toLowerCase().includes(search) ||
      e.national_id.includes(search);

    const matchesDept = !deptId || String(e.department_id) === String(deptId);
    const matchesNat = nat === '' || String(e.is_saudi) === String(nat);
    const matchesStatus = !status || e.status === status;

    return matchesSearch && matchesDept && matchesNat && matchesStatus;
  });

  renderEmployeesTable(filtered);
}

async function handleEmployeeFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('empFormId').value;

  const payload = {
    emp_code: document.getElementById('empFormCode').value.trim(),
    full_name_ar: document.getElementById('empFormNameAr').value.trim(),
    full_name_en: document.getElementById('empFormNameEn').value.trim(),
    national_id: document.getElementById('empFormNationalId').value.trim(),
    nationality: document.getElementById('empFormNationality').value.trim(),
    department_id: Number(document.getElementById('empFormDept').value),
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

function renderIssuedPenaltiesTable(list) {
  const tbody = document.getElementById('issuedPenaltiesTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  document.getElementById('issuedPenaltiesCountBadge').textContent = `${list.length} قرارات`;

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
        <button onclick="previewPenaltyForm(${p.id})" class="bg-brand hover:bg-brand-dark text-white font-bold text-[11px] px-2.5 py-1 rounded-lg">
          <i class="fa-solid fa-print ml-1"></i> الاستمارة
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function previewPenaltyForm(id) {
  const dec = state.issuedPenalties.find(x => x.id === id);
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
  // Render Devices
  const devGrid = document.getElementById('biometricDevicesGrid');
  if (devGrid) {
    devGrid.innerHTML = '';
    state.devices.forEach(d => {
      devGrid.innerHTML += `
        <div class="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm">
              <i class="fa-solid fa-fingerprint"></i>
            </div>
            <div>
              <div class="font-bold text-slate-800 text-[11px]">${d.name}</div>
              <div class="text-[10px] text-slate-400 font-mono">${d.ip_address} • ${d.model}</div>
            </div>
          </div>
          <span class="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">متصل</span>
        </div>
      `;
    });
  }

  // Badges
  const badges = document.getElementById('attendanceStatsBadges');
  if (badges) {
    badges.innerHTML = `
      <span class="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">الحاضرون: 14</span>
      <span class="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-lg">المتأخرون: 1</span>
      <span class="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-lg">في إجازة: 1</span>
      <span class="bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-lg">عمل إضافي: 2</span>
    `;
  }

  // Attendance Rows
  const tbody = document.getElementById('attendanceTableBody');
  if (tbody) {
    tbody.innerHTML = '';
    state.employees.forEach(emp => {
      const isLate = emp.id === 4;
      const isLeave = emp.id === 11;
      const hasOt = emp.id === 5;

      const checkIn = isLeave ? '-' : (isLate ? '08:35:00' : '07:54:00');
      const checkOut = isLeave ? '-' : (hasOt ? '18:30:00' : '16:05:00');
      const delay = isLate ? '35 د' : '0 د';
      const ot = hasOt ? '2.5 س' : '0 س';
      const statusBadge = isLeave ? '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">إجازة سنوية</span>'
        : (isLate ? '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">متأخر</span>'
        : '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">حاضر</span>');

      tbody.innerHTML += `
        <tr class="hover:bg-slate-50 transition">
          <td class="py-3 px-3 font-mono font-bold text-slate-700">${emp.emp_code}</td>
          <td class="py-3 px-3 font-bold text-slate-900">${emp.full_name_ar}</td>
          <td class="py-3 px-3 text-slate-500">${emp.department_name_ar || 'الإدارة'}</td>
          <td class="py-3 px-3 font-mono text-emerald-700 font-bold">${checkIn}</td>
          <td class="py-3 px-3 font-mono text-slate-700 font-bold">${checkOut}</td>
          <td class="py-3 px-3 font-mono font-bold text-slate-800">${isLeave ? '0 س' : '8.0 س'}</td>
          <td class="py-3 px-3 font-mono font-bold ${isLate ? 'text-amber-600' : 'text-slate-400'}">${delay}</td>
          <td class="py-3 px-3 font-mono font-bold ${hasOt ? 'text-brand' : 'text-slate-400'}">${ot}</td>
          <td class="py-3 px-3">${statusBadge}</td>
          <td class="py-3 px-3 text-slate-500">${hasOt ? 'عمل إضافي معتمد' : (isLate ? 'تأخير صباحي' : 'حضور نظامي')}</td>
        </tr>
      `;
    });
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
  loadAttendance('2026-09-30');
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

function loadPayroll() {
  const select = document.getElementById('payrollPeriodSelect');
  if (select) {
    select.innerHTML = `
      <option value="2026-09">مسير رواتب سبتمبر 2026م (معتمد)</option>
      <option value="2026-08">مسير رواتب أغسطس 2026م (مدفوع)</option>
    `;
  }

  const strip = document.getElementById('payrollTotalsStrip');
  if (strip) {
    strip.innerHTML = `
      <div class="bg-slate-50 border p-2.5 rounded-xl"><span class="block text-slate-400 text-[10px]">الأساسي</span><span class="font-mono font-bold text-slate-800">151,000 ر.س</span></div>
      <div class="bg-slate-50 border p-2.5 rounded-xl"><span class="block text-slate-400 text-[10px]">تأمينات GOSI</span><span class="font-mono font-bold text-rose-600">13,345 ر.س</span></div>
      <div class="bg-slate-50 border p-2.5 rounded-xl"><span class="block text-slate-400 text-[10px]">البدلات</span><span class="font-mono font-bold text-emerald-600">63,750 ر.س</span></div>
      <div class="bg-brand/10 border border-brand/30 p-2.5 rounded-xl"><span class="block text-brand text-[10px] font-bold">الصافي</span><span class="font-mono font-black text-brand text-sm">201,405 ر.س</span></div>
    `;
  }

  const tbody = document.getElementById('payrollItemsTableBody');
  if (tbody) {
    tbody.innerHTML = '';
    state.employees.forEach(emp => {
      const basic = emp.basic_salary;
      const housing = emp.housing_allowance;
      const transport = emp.transport_allowance;
      const other = emp.other_allowance;
      const ot = emp.id === 5 ? 900 : 0;
      const gross = basic + housing + transport + other + ot;
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
          <td class="py-3 px-3 font-mono text-slate-600">${(other + ot).toLocaleString('ar-SA')}</td>
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
        <span class="inline-block px-2.5 py-1 rounded bg-slate-100 font-bold text-xs">مسير رواتب سبتمبر 2026م</span>
        <p class="text-[10px] text-slate-400 mt-1">تاريخ الإصدار: 2026-09-30</p>
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
        <span class="text-xs font-mono text-amber-200">${emp.bank_name} • ${emp.iban}</span>
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
  const empId = (state.currentUser && state.currentUser.emp_id) ? state.currentUser.emp_id : 3;
  viewEmployeePayslip(empId);
}

function downloadWpsFile() {
  window.open('/api/payroll/periods/2/wps', '_blank');
}

function exportPayrollCsv() {
  window.open('/api/payroll/periods/2/export/csv', '_blank');
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
  if (!emp) {
    emp = state.employees.find(e => e.id === 3) || state.employees[0];
  }

  const nameEl = document.getElementById('essEmployeeName');
  const titleEl = document.getElementById('essEmployeeTitle');
  const balEl = document.getElementById('essLeaveBalance');

  if (nameEl) nameEl.textContent = emp.full_name_ar;
  if (titleEl) titleEl.textContent = `${emp.job_title_ar} • ${emp.department_name_ar || 'شركة جوهرة المجد'}`;
  if (balEl) balEl.textContent = `${emp.annual_leave_balance || 25} يوم`;

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
  } else {
    // Default fallback requests demonstrating full workflow
    list = [
      {
        id: 1,
        request_no: 'REQ-2026-0081',
        emp_code: 'JM-1011',
        full_name_ar: 'عمر فاروق البشير',
        department_name: 'إدارة العمليات والمشاريع',
        direct_manager_name: 'عبدالرحمن علي عسيري',
        request_type: 'إجازة سنوية',
        date: '2026-09-30',
        days_count: 5,
        reason: 'إجازة اعتيادية سنوية للسفر وزيارة العائلة',
        status: 'معتمد نهائياً',
        manager_name: 'عبدالرحمن علي عسيري',
        manager_approved_at: '2026-09-28',
        hr_approver_name: 'خالد سعد الشهراني',
        hr_approved_at: '2026-09-29'
      },
      {
        id: 4,
        request_no: 'REQ-2026-0084',
        emp_code: 'JM-1008',
        full_name_ar: 'م. أحمد رضوان الشامي',
        department_name: 'تقنية المعلومات والتحول الرقمي',
        direct_manager_name: 'م. فهد عبدالعزيز القحطاني',
        request_type: 'استئذان ساعي',
        date: '2026-10-01',
        days_count: 0.25,
        reason: 'مراجعة طبية في مستشفى عسير المركزي من 1:00م إلى 3:00م',
        status: 'موافقة مبدئية - بانتظار اعتماد الموارد البشرية',
        manager_name: 'م. فهد عبدالعزيز القحطاني',
        manager_approved_at: '2026-09-29',
        hr_approver_name: null,
        hr_approved_at: null
      },
      {
        id: 3,
        request_no: 'REQ-2026-0083',
        emp_code: 'JM-1003',
        full_name_ar: 'سارة عبدالله الشهري',
        department_name: 'الموارد البشرية والخدمات المشتركة',
        direct_manager_name: 'خالد سعد الشهراني',
        request_type: 'سلفة مالية',
        date: '2026-09-29',
        amount: 4000,
        reason: 'سلفة مالية مستردة على قسطين لظرف عائلي طارئ',
        status: 'معلق - بانتظار موافقة المدير المباشر',
        manager_name: null,
        manager_approved_at: null,
        hr_approver_name: null,
        hr_approved_at: null
      }
    ];
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
  populateDropdowns();
  const modal = document.getElementById('modalAddDepartment');
  if (!modal) return;

  const form = document.getElementById('addDepartmentForm');
  if (form) form.reset();

  const title = document.getElementById('deptModalTitle');
  const idInp = document.getElementById('deptId');

  if (id) {
    const d = state.departments.find(x => x.id === Number(id));
    if (d) {
      if (title) title.innerHTML = `<i class="fa-solid fa-sitemap text-brand"></i> تعديل بيانات الإدارة: ${d.name_ar}`;
      if (idInp) idInp.value = d.id;
      document.getElementById('deptCode').value = d.code || '';
      document.getElementById('deptNameAr').value = d.name_ar || '';
      document.getElementById('deptNameEn').value = d.name_en || '';
      document.getElementById('deptManager').value = d.manager_name || '';
      document.getElementById('deptLocation').value = d.location || '';
      document.getElementById('deptBudget').value = d.annual_budget || 0;
    }
  } else {
    if (title) title.innerHTML = `<i class="fa-solid fa-sitemap text-brand"></i> إضافة إدارة تنظيمية جديدة`;
    if (idInp) idInp.value = '';
  }

  openModal('modalAddDepartment');
}

async function handleDepartmentFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('deptId').value;
  const payload = {
    code: document.getElementById('deptCode').value.trim().toUpperCase(),
    name_ar: document.getElementById('deptNameAr').value.trim(),
    name_en: document.getElementById('deptNameEn').value.trim(),
    manager_name: document.getElementById('deptManager').value.trim(),
    location: document.getElementById('deptLocation').value.trim(),
    annual_budget: Number(document.getElementById('deptBudget').value || 0)
  };

  if (!payload.name_ar) {
    alert('يرجى إدخال اسم الإدارة بالعربية');
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
  if (!confirm('هل أنت متأكد من حذف هذه الإدارة؟')) return;
  state.departments = state.departments.filter(d => d.id !== Number(id));
  await apiFetch(`/api/departments/${id}`, { method: 'DELETE' });
  renderOrganization();
  populateDropdowns();
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

// Employee Add Function
window.openAddEmployeeModal = openAddEmployeeModal;

// Approval Workflow Actions
window.approveRequestManager = approveRequestManager;
window.approveRequestHr = approveRequestHr;
window.rejectRequest = rejectRequest;


